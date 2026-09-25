import a1164_0x4309f8 from '../core/stores/appStore.js';
import { deferNodeEditorCommit } from '../core/nodeEditorCommit.js';
import { getInputLimitReason, getTargetInputPolicy, isInputKindAllowed, resolveEffectiveInputKind } from './modelInputPolicy.js';
import { sanitizePromptHtml } from '../utils/dom.js';
import { insertPlainTextAtSelection } from '../utils/editableText.js';
import { pasteNodePrompt } from './nodePromptPaste.js';
import { deletePromptMention, insertSelectedPromptMention } from './promptMentionSelection.js';
import { getPromptReferenceSignature } from './promptReferenceSignature.js';
import { getAssetMentionCandidates } from './assetMentionRegistry.js';
import { createReferenceFallbackThumbElement } from './referenceThumbnailFallback.js';
import { localPathToUrl } from '../utils/localMediaPath.js';
import { hasPromptPresetTemplateContent, resolvePromptPresetTemplate } from './promptPresetTemplate.js';
import { normalizeProviderId, resolveModelExecution } from '../manifests/index.js';
import { t } from '../i18n/index.js';
import { deferPromptTriggerUntilCompositionEnd, shouldSkipPromptTriggerForBulkInput } from './promptTriggerComposition.js';
import { removeVirtualPromptPasteEndMarker, rememberVirtualizedPromptCommit, serializeVirtualizedPromptHtml } from './promptPasteVirtualization.js';
import { PROMPT_ASSET_INPUT_REFS_FIELD, getAssetInputRefsFromNodeData, getAssetInputRefsFromPrompt, getAssetInputRefsFromPromptAndNode, getAssetInputRefsFromPromptHtml, getAssetMentionRefFromPillNode, getPromptAssetInputRefRecords as a1164_0x3dab93, getPromptAssetInputRefsFromNode, normalizePromptAssetInputRefRecord as a1164_0x2cee74, normalizePromptMentionType as a1164_0x2166b3 } from './promptAssetInputRefs.js';
export { PROMPT_ASSET_INPUT_REFS_FIELD, getAssetInputRefsFromNodeData, getAssetInputRefsFromPrompt, getAssetInputRefsFromPromptAndNode, getAssetInputRefsFromPromptHtml, getAssetMentionRefFromPillNode, getPromptAssetInputRefsFromNode } from './promptAssetInputRefs.js';
function nodePromptSharedText(_0x9d3d7e, _0x2e19ce = {}) {
  return t("nodePromptShared." + _0x9d3d7e, _0x2e19ce);
}
const AT_TYPE_MAP = {
  'text': '文本',
  'image': '图片',
  'video': '视频',
  'audio': '音频'
};
const MENTION_TYPE_ORDER = ['text', "image", "video", "audio"];
const ASSET_TYPE_MENU_LABELS = {
  'text': "text",
  'image': "image",
  'video': "video",
  'audio': "audio"
};
const PROMPT_INPUT_REF_LABEL_ATTR = "data-ref-label";
const PROMPT_INPUT_REF_UNRESOLVED_ATTR = 'data-ref-unresolved';
const PROMPT_HTML_COMMIT_DELAY_MS = 0x140;
const ADVANCED_VOICE_CLONE_WORKFLOW_KEY = "advanced_voice_clone";
const _pendingPromptHtmlCommitTargets = new Set();
function _normalizeQuery(_0x1e4873) {
  return String(_0x1e4873 || '')["trim"]()['replace'](/^@+/, '');
}
function _stripMentionDisplayMarker(_0x5c9be6) {
  return String(_0x5c9be6 || '')["trim"]()["replace"](/^@+/, '')["trim"]();
}
function _findLastMentionTriggerIndex(_0x2e515c, _0x62b141) {
  const _0x176dd5 = Number["isFinite"](_0x62b141) ? _0x62b141 - 0x1 : undefined;
  return Math["max"](String(_0x2e515c || '')['lastIndexOf']('@', _0x176dd5), String(_0x2e515c || '')['lastIndexOf']('＠', _0x176dd5));
}
function _formatMentionSubmitLabel(_0xe26328) {
  const _0x3d86bc = _stripMentionDisplayMarker(_0xe26328);
  return _0x3d86bc ? '@' + _0x3d86bc : '';
}
function _getNodeMentionDisplayLabel(_0x2931f4 = {}, _0x537198 = '') {
  const _0x5a2647 = [_0x2931f4?.['name'], _0x2931f4?.["title"], _0x2931f4?.['label'], _0x2931f4?.['displayName']]["map"](_0x461b03 => _stripMentionDisplayMarker(_0x461b03))["find"](Boolean);
  return _0x5a2647 || _stripMentionDisplayMarker(_0x537198);
}
function _normalizePromptWhitespace(_0x18bdfb) {
  return String(_0x18bdfb || '')['replace'](/[\s\u00A0\u200B-\u200D\uFEFF]+/g, '\x20')['trim']();
}
export function normalizePromptEnterBehavior(_0x2f4230) {
  return _0x2f4230 === "newline" ? 'newline' : "submit";
}
function getPromptEnterBehaviorFromStore() {
  try {
    const _0xf5efae = a1164_0x4309f8["getStateRaw"]?.() || a1164_0x4309f8["getState"]?.() || {};
    return normalizePromptEnterBehavior(_0xf5efae?.['ui']?.["promptEnterBehavior"]);
  } catch {
    return 'submit';
  }
}
export function shouldSubmitPromptByKeyboard(_0x7cce7e, _0x1c55bf = {}) {
  if (!_0x7cce7e || _0x7cce7e['key'] !== "Enter" || _0x7cce7e['isComposing'] === !![]) {
    return ![];
  }
  const _0x383770 = Object["prototype"]['hasOwnProperty']["call"](_0x1c55bf, 'behavior') ? _0x1c55bf["behavior"] : getPromptEnterBehaviorFromStore();
  const _0x3ad811 = normalizePromptEnterBehavior(_0x383770);
  if (_0x3ad811 === 'newline') {
    return _0x7cce7e['ctrlKey'] === !![] || _0x7cce7e["metaKey"] === !![];
  }
  return _0x7cce7e["shiftKey"] !== !![];
}
function _getAssetTypeMenuLabel(_0x250a76) {
  const _0x31129e = ASSET_TYPE_MENU_LABELS[_0x250a76];
  if (_0x31129e) {
    return nodePromptSharedText("assetTypes." + _0x31129e);
  }
  return _0x250a76 || nodePromptSharedText("materialFallback");
}
function _escapeRegExp(_0x290c85) {
  return String(_0x290c85 || '')["replace"](/[.*+?^${}()|[\]\\]/g, '\x5c$&');
}
export function resolveTextReferenceContent(_0x25f34a) {
  const _0x51d63c = String(_0x25f34a?.["type"] || '')["trim"]()["toLowerCase"]();
  if (_0x51d63c === "source-text" || _0x51d63c === 'text') {
    const _0x28d01b = typeof _0x25f34a?.["content"] === "string" ? _0x25f34a["content"] : _0x25f34a?.["text"] || _0x25f34a?.["outputText"] || _0x25f34a?.["prompt"] || _0x25f34a?.["label"] || '';
    return String(_0x28d01b)['trim']();
  }
  return String(_0x25f34a?.['outputText'] || _0x25f34a?.['text'] || _0x25f34a?.["content"] || _0x25f34a?.["prompt"] || _0x25f34a?.["label"] || '')["trim"]();
}
function _getChildNodes(_0x4b1bb3) {
  if (!_0x4b1bb3?.["childNodes"]) {
    return [];
  }
  return Array["from"](_0x4b1bb3["childNodes"]);
}
function _isRefPillNode(_0x2c98d7) {
  if (!_0x2c98d7) {
    return ![];
  }
  if (typeof _0x2c98d7["classList"]?.["contains"] === 'function') {
    return _0x2c98d7["classList"]["contains"]("ref-pill");
  }
  return String(_0x2c98d7["className"] || '')["split"](/\s+/)["filter"](Boolean)['includes']("ref-pill");
}
function _getDatasetValue(_0x81aaad, _0x25d954, _0xcc6079 = '') {
  const _0x5bca8d = String(_0x81aaad?.["dataset"]?.[_0x25d954] || '')["trim"]();
  if (_0x5bca8d) {
    return _0x5bca8d;
  }
  if (_0xcc6079 && typeof _0x81aaad?.['getAttribute'] === 'function') {
    return String(_0x81aaad['getAttribute'](_0xcc6079) || '')["trim"]();
  }
  return '';
}
function _decodeHtmlAttrValue(_0x1d01da) {
  return String(_0x1d01da || '')['replace'](/&quot;/g, '\x22')['replace'](/&#39;/g, '\x27')["replace"](/&apos;/g, '\x27')['replace'](/&lt;/g, '<')["replace"](/&gt;/g, '>')["replace"](/&amp;/g, '&');
}
function _getHtmlAttrValue(_0xf8b0cd = '', _0x1510db = '') {
  const _0x45da51 = String(_0x1510db || '')["trim"]();
  if (!_0x45da51) {
    return '';
  }
  const _0xf1eed7 = new RegExp(_escapeRegExp(_0x45da51) + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", 'i');
  const _0x3ef74c = String(_0xf8b0cd || '')["match"](_0xf1eed7);
  if (!_0x3ef74c) {
    return '';
  }
  return _decodeHtmlAttrValue(_0x3ef74c[0x1] ?? _0x3ef74c[0x2] ?? _0x3ef74c[0x3] ?? '')['trim']();
}
function _htmlClassAttrContains(_0x432484 = '', _0x5d93af = '') {
  const _0x388197 = _getHtmlAttrValue(_0x432484, "class");
  return _0x388197["split"](/\s+/)["filter"](Boolean)['includes'](_0x5d93af);
}
function _isAssetMentionPill(_0x332926) {
  return _getDatasetValue(_0x332926, "refOrigin", "data-ref-origin") === "asset";
}
function _isUnresolvedInputMentionPill(_0x3ca27f) {
  return !_isAssetMentionPill(_0x3ca27f) && _getDatasetValue(_0x3ca27f, "refUnresolved", PROMPT_INPUT_REF_UNRESOLVED_ATTR) === "true";
}
function _normalizeMentionLabelKey(_0x48db27) {
  return _stripMentionDisplayMarker(_0x48db27)["replace"](/[\s\u00A0]+/g, '');
}
function _inferMentionTypeFromLabel(_0x493874 = '') {
  const _0x511eef = _normalizeMentionLabelKey(_0x493874);
  if (!_0x511eef) {
    return '';
  }
  for (const _0x49efc2 of MENTION_TYPE_ORDER) {
    const _0x2657bf = String(AT_TYPE_MAP[_0x49efc2] || '')["trim"]();
    if (_0x2657bf && _0x511eef['startsWith'](_0x2657bf)) {
      return _0x49efc2;
    }
  }
  return '';
}
function _getPillMentionType(_0x5432f9) {
  return a1164_0x2166b3(_getDatasetValue(_0x5432f9, 'refType', "data-ref-type")) || _inferMentionTypeFromLabel(_getDatasetValue(_0x5432f9, "label", "data-label") || _0x5432f9?.['textContent'] || '');
}
function _getPromptInputDisplayLabel(_0x5061f2) {
  return _stripMentionDisplayMarker(_getDatasetValue(_0x5061f2, "label", "data-label") || _0x5061f2?.['textContent'] || '');
}
function _getPromptInputRefLabel(_0x45e59c, _0x57e3fe = '') {
  return _stripMentionDisplayMarker(_getDatasetValue(_0x45e59c, "refLabel", PROMPT_INPUT_REF_LABEL_ATTR) || _0x57e3fe);
}
export function getPromptInputSubmitLabelFromPillNode(_0x583ae8, _0x1f13c2 = '') {
  if (_isAssetMentionPill(_0x583ae8)) {
    return String(_getDatasetValue(_0x583ae8, "label", 'data-label') || _0x583ae8?.["textContent"] || _0x1f13c2 || '')["trim"]();
  }
  return _formatMentionSubmitLabel(_getPromptInputRefLabel(_0x583ae8, _0x1f13c2) || _getPromptInputDisplayLabel(_0x583ae8) || _0x1f13c2);
}
function _setInputMentionPillUnresolved(_0x43034f, {
  label = '',
  type = ''
} = {}) {
  if (!_isRefPillNode(_0x43034f) || _isAssetMentionPill(_0x43034f)) {
    return ![];
  }
  const _0x357ae9 = _stripMentionDisplayMarker(label || _0x43034f?.["dataset"]?.["label"] || _0x43034f?.["textContent"] || '');
  const _0xbcf6e9 = _getPromptInputRefLabel(_0x43034f, _0x357ae9);
  const _0x2b6467 = a1164_0x2166b3(type) || _getPillMentionType(_0x43034f);
  _0x43034f['dataset']["label"] = _0x357ae9;
  _0x43034f["dataset"]["refOrigin"] = "node";
  _0x43034f["dataset"]["refUnresolved"] = 'true';
  if (_0xbcf6e9) {
    _0x43034f["dataset"]['refLabel'] = _0xbcf6e9;
  }
  if (_0x2b6467) {
    _0x43034f['dataset']['refType'] = _0x2b6467;
  }
  delete _0x43034f["dataset"]["nodeId"];
  _0x43034f["removeAttribute"]?.('data-node-id');
  _0x43034f["classList"]?.["add"]?.("ref-pill--unresolved");
  _0x43034f['title'] = "Input reference is not bound in this node.";
  _renderMentionPillContent(_0x43034f, _0x357ae9, _getMentionVisual(null, null, _0x43034f));
  return !![];
}
function _clearInputMentionPillUnresolved(_0x513ed7) {
  if (!_isRefPillNode(_0x513ed7)) {
    return ![];
  }
  delete _0x513ed7["dataset"]["refUnresolved"];
  _0x513ed7["removeAttribute"]?.(PROMPT_INPUT_REF_UNRESOLVED_ATTR);
  _0x513ed7["classList"]?.["remove"]?.("ref-pill--unresolved");
  if (_0x513ed7["title"] === "Input reference is not bound in this node.") {
    _0x513ed7["removeAttribute"]?.("title");
    if ("title" in _0x513ed7) {
      _0x513ed7["title"] = '';
    }
  }
  return !![];
}
function _getTargetNodeData(_0x15b426 = null) {
  const _0x5e3c58 = String(_0x15b426?.["nodeId"] || '')["trim"]();
  const _0x9fc4a5 = _0x5e3c58 ? a1164_0x4309f8["getState"]?.()?.["nodes"]?.[_0x5e3c58] : null;
  return _0x9fc4a5 || _0x15b426?.["_data"] || {};
}
function _isAdvancedVoiceCloneTarget(_0x3ff96f = {}) {
  if (String(_0x3ff96f?.['type'] || '')["trim"]() !== "ai-audio") {
    return ![];
  }
  return [_0x3ff96f["audioWorkflowKey"], _0x3ff96f["model"], _0x3ff96f['audioWorkflowLabel']]["some"](_0x529e18 => String(_0x529e18 || '')["trim"]() === ADVANCED_VOICE_CLONE_WORKFLOW_KEY);
}
function _getMentionAudioInputKey(_0x3800bb = {}) {
  if (a1164_0x2166b3(_0x3800bb?.['type']) !== "audio") {
    return '';
  }
  if (_0x3800bb?.["origin"] === "asset") {
    const _0xd55dc3 = _getPromptAssetInputRefRecordForMention(_0x3800bb);
    return _0xd55dc3 ? 'asset:' + _0xd55dc3["assetId"] + ':' + _0xd55dc3["itemIndex"] : '';
  }
  const _0x1562b3 = String(_0x3800bb?.["nodeId"] || _0x3800bb?.["sourceId"] || '')["trim"]();
  return _0x1562b3 ? 'node:' + _0x1562b3 : '';
}
function _getActualAudioInputKeysForTarget(_0x3fc9e1 = '', _0xe48665 = {}, _0x5c5445 = null) {
  const _0x1b2188 = new Set();
  const _0x5e7cfa = _0x5c5445 || a1164_0x4309f8["getState"]();
  const _0x54df34 = _0x5e7cfa['nodes'] || {};
  a1164_0x4309f8["getIncomingEdges"](_0x3fc9e1)['forEach'](_0x46a09e => {
    const _0x5d4a51 = _0x54df34?.[_0x46a09e?.['sourceId']];
    resolveEffectiveInputKind(_0x5d4a51, _0x46a09e) === "audio" && _0x46a09e?.["sourceId"] && _0x1b2188['add']("node:" + _0x46a09e["sourceId"]);
  });
  a1164_0x3dab93(_0xe48665 || {})["forEach"](_0x58bd81 => {
    _0x58bd81["type"] === "audio" && _0x1b2188["add"]("asset:" + _0x58bd81["assetId"] + ':' + _0x58bd81["itemIndex"]);
  });
  return _0x1b2188;
}
function _getAdvancedVoiceCloneAudioLimitReason(_0x4345ba, _0x10cf96 = {}, _0x1be900 = {}, _0x2b6c65 = null) {
  if (!_isAdvancedVoiceCloneTarget(_0x1be900)) {
    return null;
  }
  if (a1164_0x2166b3(_0x10cf96?.["type"]) !== "audio") {
    return null;
  }
  const _0x3f42f9 = getTargetInputPolicy(_0x1be900);
  const _0x2c0907 = Number(_0x3f42f9?.["maxByKind"]?.["audio"]);
  if (!Number['isFinite'](_0x2c0907) || _0x2c0907 <= 0x0) {
    return null;
  }
  const _0x51af18 = _getActualAudioInputKeysForTarget(_0x4345ba?.['nodeId'], _0x1be900, _0x2b6c65);
  const _0x5c7a32 = _getMentionAudioInputKey(_0x10cf96);
  if (_0x5c7a32 && _0x51af18["has"](_0x5c7a32)) {
    return '';
  }
  return _0x51af18["size"] >= _0x2c0907 ? getInputLimitReason(_0x3f42f9, 'audio', {
    'audio': _0x51af18["size"]
  }) : '';
}
export function isRunningHubWorkflowNode(_0x3f833c = {}) {
  const _0x1ca70a = normalizeProviderId(_0x3f833c?.["provider"]);
  if (_0x1ca70a === "runninghubwf") {
    return !![];
  }
  const _0x287b4d = String(_0x3f833c?.["model"] || '')["trim"]();
  if (!_0x287b4d) {
    return ![];
  }
  const _0x157c16 = resolveModelExecution(_0x287b4d, {
    'providerHint': _0x1ca70a
  }) || resolveModelExecution(_0x287b4d);
  const _0x1f269d = normalizeProviderId(_0x157c16?.['modelManifest']?.["provider"]);
  const _0x56aacb = normalizeProviderId(_0x157c16?.["executionManifest"]?.["provider"]);
  return _0x157c16?.["executionManifest"]?.["adapterType"] === "workflow" && (_0x1f269d === 'runninghubwf' || _0x56aacb === 'runninghubwf');
}
function _toLocalPathUrl(_0x2e2a15) {
  return localPathToUrl(_0x2e2a15);
}
function _isLikelyImageUrl(_0x5ce5f5) {
  const _0x3c6cad = String(_0x5ce5f5 || '')["trim"]()["toLowerCase"]();
  if (!_0x3c6cad) {
    return ![];
  }
  if (_0x3c6cad["startsWith"]("data:image/") || _0x3c6cad['startsWith']("blob:")) {
    return !![];
  }
  return /\.(png|jpe?g|webp|gif|bmp|svg|avif)(\?|#|$)/i["test"](_0x3c6cad);
}
function _firstNonEmpty(_0x3b69a9 = []) {
  return _0x3b69a9["map"](_0x11407a => String(_0x11407a || '')["trim"]())["find"](Boolean) || '';
}
function _pickIndexedItem(_0x28612a, _0xe238bb) {
  if (!Array["isArray"](_0x28612a) || _0x28612a["length"] === 0x0) {
    return null;
  }
  const _0x5e899e = Number['isFinite'](Number(_0xe238bb)) ? Math["max"](0x0, Math['trunc'](Number(_0xe238bb))) : 0x0;
  return _0x28612a[_0x5e899e] || _0x28612a[0x0] || null;
}
function _resolveNodeThumbUrl(_0x508786 = {}, _0x1bbcc2 = '') {
  const _0x3b8441 = a1164_0x2166b3(_0x1bbcc2 || _0x508786?.['type']);
  if (_0x3b8441 === "text" || _0x3b8441 === "audio") {
    return '';
  }
  if (_0x3b8441 === "image") {
    const _0x431435 = _pickIndexedItem(_0x508786["images"] || _0x508786["outputImages"], _0x508786["mainImageIndex"]);
    return _firstNonEmpty([_0x431435?.["thumbUrl"], _0x431435?.["src"], _0x431435?.["imageUrl"], _0x431435?.["sourceUrl"], _0x431435?.["url"], _toLocalPathUrl(_0x431435?.["localPath"]), _0x508786["thumbUrl"], _0x508786['src'], _0x508786["imageUrl"], _0x508786["sourceUrl"], _0x508786["url"], _toLocalPathUrl(_0x508786["localPath"])]);
  }
  if (_0x3b8441 === 'video') {
    const _0x5dd62b = _pickIndexedItem(_0x508786['videos'], _0x508786["mainVideoIndex"]);
    const _0x372db1 = [_0x5dd62b?.['thumbUrl'], _0x5dd62b?.["posterUrl"], _toLocalPathUrl(_0x5dd62b?.["posterLocalPath"]), _0x508786["thumbUrl"], _0x508786["videoThumbSrc"], _0x508786["firstFrameThumbUrl"], _0x508786['firstFrameUrl'], _0x508786['posterUrl'], _toLocalPathUrl(_0x508786['posterLocalPath']), _0x508786["imageUrl"], _0x508786["src"]];
    return _0x372db1["map"](_0x5da9d5 => String(_0x5da9d5 || '')["trim"]())['find'](_0x905486 => _0x905486 && _isLikelyImageUrl(_0x905486)) || '';
  }
  return '';
}
function _resolveRefBarThumbNode(_0x1ff053, _0x19aedb) {
  const _0x471b52 = String(_0x19aedb || '')['trim']();
  if (!_0x471b52 || !_0x1ff053?.["refBarEl"] || typeof _0x1ff053["refBarEl"]['querySelector'] !== "function") {
    return null;
  }
  const _0x45da20 = typeof CSS !== "undefined" && typeof CSS["escape"] === "function" ? CSS["escape"](_0x471b52) : _0x471b52['replace'](/["\\]/g, "\\$&");
  const _0x827162 = _0x1ff053["refBarEl"]["querySelector"](".ref-thumb-wrap[data-source-id=\"" + _0x45da20 + '\x22]');
  return _0x827162?.["querySelector"]?.(".ref-thumb-media") || null;
}
function _getThumbNodeUrl(_0x587291) {
  const _0x4c6d68 = _0x587291?.["tagName"] && String(_0x587291['tagName'])['toLowerCase']() === "img" ? _0x587291 : null;
  return String(_0x4c6d68?.["currentSrc"] || _0x4c6d68?.["src"] || '')["trim"]();
}
function _getRenderableMentionThumbUrl(_0xf31a0c, _0x1750f9 = '') {
  const _0x45b93a = String(_0xf31a0c || '')['trim']();
  if (!_0x45b93a) {
    return '';
  }
  const _0x22c3f7 = a1164_0x2166b3(_0x1750f9);
  if (_0x22c3f7 === "text" || _0x22c3f7 === 'audio') {
    return _isLikelyImageUrl(_0x45b93a) ? _0x45b93a : '';
  }
  return _0x45b93a;
}
function _getMentionVisual(_0x2fb346, _0x431016 = null, _0x2582a4 = null) {
  const _0x1d54c2 = _0x2fb346?.['getMentionVisual']?.({
    'mention': _0x431016,
    'pill': _0x2582a4
  });
  if (_0x1d54c2 && typeof _0x1d54c2 === 'object') {
    return _0x1d54c2;
  }
  const _0x28764f = a1164_0x2166b3(_0x431016?.['type'] || _getDatasetValue(_0x2582a4, "refType", "data-ref-type"));
  const _0x2ef576 = _0x28764f || 'text';
  if (_0x431016?.["origin"] === "asset" || _isAssetMentionPill(_0x2582a4)) {
    const _0x2b5585 = _0x431016?.["origin"] === 'asset' ? null : getAssetMentionRefFromPillNode(_0x2582a4);
    const _0x4c05cd = _getRenderableMentionThumbUrl(_0x431016?.["thumbUrl"] || _0x2b5585?.["thumbUrl"] || '', _0x28764f);
    return {
      'thumbUrl': _0x4c05cd,
      'iconType': _0x2ef576
    };
  }
  const _0x11b798 = String(_0x431016?.['nodeId'] || _0x431016?.["sourceId"] || _getDatasetValue(_0x2582a4, "nodeId", 'data-node-id'))['trim']();
  const _0x851bd6 = a1164_0x4309f8["getState"]?.()?.['nodes']?.[_0x11b798] || {};
  const _0x1ccfd0 = _0x28764f || a1164_0x2166b3(_0x851bd6['type']);
  const _0x3aa3a1 = _resolveRefBarThumbNode(_0x2fb346, _0x11b798);
  const _0x3ae074 = _getThumbNodeUrl(_0x3aa3a1);
  const _0x2fb4fa = _0x3ae074 || _getRenderableMentionThumbUrl(_0x431016?.['thumbUrl'] || '', _0x1ccfd0) || _resolveNodeThumbUrl(_0x851bd6, _0x1ccfd0);
  return {
    'thumbUrl': _0x2fb4fa,
    'thumbNode': _0x2fb4fa ? null : _0x3aa3a1,
    'iconType': _0x1ccfd0 || _0x2ef576
  };
}
function _createTextAudioMentionThumb(_0x14da49, _0x5cc3ad) {
  return createReferenceFallbackThumbElement(a1164_0x2166b3(_0x14da49), _0x5cc3ad);
}
function _cloneMentionThumbNode(_0x7eed87, _0xfe95d5, _0x1accb0 = '') {
  const _0x2a65d2 = _createTextAudioMentionThumb(_0x1accb0, _0xfe95d5);
  if (_0x2a65d2) {
    return _0x2a65d2;
  }
  if (!_0x7eed87) {
    return null;
  }
  if (typeof _0x7eed87['cloneNode'] !== 'function') {
    return null;
  }
  const _0xae4308 = _0x7eed87["cloneNode"](!![]);
  _0xae4308["className"] = _0xfe95d5;
  _0xae4308['draggable'] = ![];
  _0xae4308["contentEditable"] = "false";
  return _0xae4308;
}
function _appendMentionVisualNode(_0x6d6012, {
  thumbUrl = '',
  thumbNode = null,
  iconType = ''
} = {}) {
  if (thumbUrl) {
    const _0xe2dcf8 = document['createElement']("img");
    _0xe2dcf8["className"] = "ref-pill-thumb";
    _0xe2dcf8["src"] = thumbUrl;
    _0xe2dcf8["alt"] = '';
    _0xe2dcf8["draggable"] = ![];
    _0xe2dcf8["contentEditable"] = "false";
    _0x6d6012["appendChild"](_0xe2dcf8);
    return !![];
  }
  const _0x4fc185 = _cloneMentionThumbNode(thumbNode, "ref-pill-thumb", iconType);
  if (!_0x4fc185) {
    return ![];
  }
  _0x6d6012["appendChild"](_0x4fc185);
  return !![];
}
function _renderMentionPillContent(_0x4ac5a1, _0x56ac1a, _0x305a46 = {}) {
  const _0x5062fc = _stripMentionDisplayMarker(_0x56ac1a);
  if (typeof document === "undefined" || typeof document["createElement"] !== "function" || typeof _0x4ac5a1?.["replaceChildren"] !== "function") {
    _0x4ac5a1["textContent"] = _0x5062fc;
    return;
  }
  const _0x2c1f68 = document['createElement']('span');
  _0x2c1f68["className"] = "ref-pill-label";
  _0x2c1f68["textContent"] = _0x5062fc;
  _0x4ac5a1["replaceChildren"]();
  _appendMentionVisualNode(_0x4ac5a1, _0x305a46);
  _0x4ac5a1['appendChild'](_0x2c1f68);
}
function _decorateMentionPill(_0xdfc294, _0x4d4f2f, _0x4a4dc9 = null) {
  if (typeof _0xdfc294?.["decorateMentionPill"] !== "function") {
    return;
  }
  _0xdfc294["decorateMentionPill"]({
    'pill': _0x4d4f2f,
    'mention': _0x4a4dc9
  });
}
function _isPillVisualCurrent(_0x123cd7, _0x1ed8d4 = {}) {
  if (!_0x123cd7 || typeof _0x123cd7['querySelector'] !== "function") {
    return !![];
  }
  const _0x479f55 = a1164_0x2166b3(_0x1ed8d4["iconType"]);
  if (_0x1ed8d4["thumbUrl"]) {
    const _0x242093 = _0x123cd7["querySelector"]('img.ref-pill-thumb');
    return String(_0x242093?.["currentSrc"] || _0x242093?.["src"] || '')["trim"]() === _0x1ed8d4["thumbUrl"];
  }
  if (_0x479f55 === "text" || _0x479f55 === "audio") {
    const _0x1c8551 = _0x123cd7["querySelector"](".ref-pill-thumb");
    const _0x3d32d8 = typeof _0x1c8551?.['className'] === "string" ? _0x1c8551["className"] : String(_0x1c8551?.['getAttribute']?.("class") || '');
    return !!_0x1c8551 && (_0x1c8551["classList"]?.["contains"]?.("ref-thumb-fallback") || _0x3d32d8["includes"]('ref-thumb-fallback'));
  }
  if (_0x1ed8d4["thumbNode"]) {
    return !!_0x123cd7["querySelector"](".ref-pill-thumb");
  }
  return !_0x123cd7["querySelector"](".ref-pill-thumb") && !_0x123cd7["querySelector"](".ref-pill-icon");
}
export function getMentionPlaceholderLabel(_0x3586e4, _0x1b4501, _0x555c70 = '') {
  const _0x3eab4b = a1164_0x2166b3(_0x3586e4);
  const _0x5ad70d = _stripMentionDisplayMarker(_0x555c70) || AT_TYPE_MAP[_0x3eab4b] || _0x3eab4b || '素材';
  const _0x49bbbc = Math["max"](0x1, Math["trunc"](Number(_0x1b4501) || 0x1));
  return '@' + _0x5ad70d + _0x49bbbc;
}
export function createPromptMediaReferenceState(_0x1dc6a1 = []) {
  const _0x30b524 = {
    'image': 0x0,
    'video': 0x0,
    'audio': 0x0
  };
  const _0x180427 = new Map();
  for (const _0x556fac of _0x1dc6a1) {
    const _0x44ffc0 = a1164_0x2166b3(_0x556fac["type"]);
    const _0x2bc7fe = String(_0x556fac['url'] || '')["trim"]();
    if (!(_0x44ffc0 in _0x30b524) || !_0x2bc7fe || _0x180427["has"](_0x44ffc0 + ':' + _0x2bc7fe)) {
      continue;
    }
    _0x30b524[_0x44ffc0] += 0x1;
    _0x180427["set"](_0x44ffc0 + ':' + _0x2bc7fe, getMentionPlaceholderLabel(_0x44ffc0, _0x30b524[_0x44ffc0]));
  }
  return {
    'mediaCounts': _0x30b524,
    'dedupeState': _0x180427
  };
}
export function appendAssetMentionToPrompt({
  domNode = null,
  rawLabel = '',
  promptParts = null,
  inputRefs = null,
  mediaCounts = null,
  allowedTypes = null,
  resolveAssetMentionRef = null,
  dedupeState = null
} = {}) {
  const _0x5c5671 = typeof resolveAssetMentionRef === 'function' ? resolveAssetMentionRef(domNode) : null;
  const _0xedf385 = _0x5c5671 || getAssetMentionRefFromPillNode(domNode);
  const _0x54be33 = (Array["isArray"](_0xedf385) ? _0xedf385 : [_0xedf385])["filter"](Boolean);
  if (!_0x54be33["length"]) {
    return ![];
  }
  const _0x46a7dd = mediaCounts || {};
  _0x54be33["forEach"](_0x15a0de => {
    const _0x2f5345 = resolveEffectiveInputKind(_0x15a0de) || a1164_0x2166b3(_0x15a0de["type"]);
    if (Array["isArray"](allowedTypes) && !allowedTypes['includes'](_0x2f5345)) {
      _0x54be33["length"] === 0x1 && Array['isArray'](promptParts) && promptParts['push']('\x20' + (rawLabel || _0x15a0de['label']) + '\x20');
      return;
    }
    if (_0x2f5345 === "text") {
      if (Array["isArray"](promptParts)) {
        promptParts["push"]('\x20' + (_0x15a0de["content"] || '') + '\x20');
      }
      return;
    }
    if (!_0x15a0de["url"]) {
      _0x54be33["length"] === 0x1 && Array['isArray'](promptParts) && promptParts["push"]('\x20' + (rawLabel || _0x15a0de['label']) + '\x20');
      return;
    }
    const _0x5c04e6 = _0x2f5345 + ':' + String(_0x15a0de["url"] || '')["trim"]();
    const _0x8f8174 = dedupeState instanceof Map ? dedupeState["get"](_0x5c04e6) : '';
    if (_0x8f8174) {
      if (Array["isArray"](promptParts)) {
        promptParts['push']('\x20' + _0x8f8174 + '\x20');
      }
      return;
    }
    _0x46a7dd[_0x2f5345] = Number(_0x46a7dd[_0x2f5345] || 0x0) + 0x1;
    const _0x43d685 = getMentionPlaceholderLabel(_0x2f5345, _0x46a7dd[_0x2f5345], _0x15a0de["placeholderTypeLabel"]);
    if (dedupeState instanceof Map) {
      dedupeState["set"](_0x5c04e6, _0x43d685);
    }
    if (Array['isArray'](promptParts)) {
      promptParts["push"]('\x20' + _0x43d685 + '\x20');
    }
    Array["isArray"](inputRefs) && inputRefs["push"]({
      ..._0x15a0de,
      'type': _0x2f5345,
      'placeholder': _0x43d685
    });
  });
  return !![];
}
export function removeAssetMentionPillFromPrompt(_0x3fbcf9, {
  assetId = '',
  assetIndex = '',
  itemIndex = '',
  type = '',
  occurrence = null
} = {}) {
  const _0x4e7141 = _0x3fbcf9?.["promptEl"];
  if (!_0x4e7141 || typeof _0x4e7141["querySelectorAll"] !== "function") {
    return ![];
  }
  const _0x13c387 = String(assetId || '')["trim"]();
  const _0x103691 = assetIndex !== null && assetIndex !== undefined && String(assetIndex) !== '' ? assetIndex : itemIndex;
  const _0x5c7272 = String(_0x103691 ?? '')["trim"]();
  const _0x5a242c = a1164_0x2166b3(type);
  const _0x15d0cc = Number(occurrence);
  const _0x444bbd = Number["isFinite"](_0x15d0cc) && _0x15d0cc >= 0x0;
  if (!_0x13c387 || !_0x5c7272) {
    return ![];
  }
  const _0x6a2ec5 = Array["from"](_0x4e7141['querySelectorAll'](".ref-pill"));
  let _0x4b21ac = 0x0;
  const _0x3ad081 = _0x6a2ec5["filter"](_0x3d42dc => {
    if (!_isAssetMentionPill(_0x3d42dc)) {
      return ![];
    }
    const _0x300d20 = _getDatasetValue(_0x3d42dc, "assetId", "data-asset-id");
    const _0x51976e = _getDatasetValue(_0x3d42dc, "assetIndex", "data-asset-index");
    const _0x257dd1 = a1164_0x2166b3(_getDatasetValue(_0x3d42dc, "refType", "data-ref-type"));
    const _0x22b813 = _0x300d20 === _0x13c387 && _0x51976e === _0x5c7272 && (!_0x5a242c || _0x257dd1 === _0x5a242c);
    if (!_0x22b813) {
      return ![];
    }
    if (!_0x444bbd) {
      return !![];
    }
    const _0x47ec92 = _0x4b21ac === _0x15d0cc;
    _0x4b21ac += 0x1;
    return _0x47ec92;
  });
  if (!_0x3ad081["length"]) {
    return ![];
  }
  (occurrence === -0x1 || occurrence === '-1' ? _0x3ad081 : _0x3ad081['slice'](0x0, 0x1))["forEach"](_0x1a470f => _0x1a470f["remove"]?.());
  _updatePromptHtml(_0x3fbcf9);
  return !![];
}
export function removePromptAssetInputRefFromNode(_0x5bad37, {
  assetId = '',
  assetIndex = '',
  itemIndex = '',
  type = '',
  occurrence = null
} = {}) {
  const _0x57a679 = String(_0x5bad37?.["nodeId"] || '')["trim"]();
  if (!_0x57a679) {
    return ![];
  }
  const _0x4da883 = String(assetId || '')["trim"]();
  const _0x36fc19 = assetIndex !== null && assetIndex !== undefined && String(assetIndex) !== '' ? assetIndex : itemIndex;
  const _0x4f9fe4 = Number(_0x36fc19);
  const _0x1346bb = a1164_0x2166b3(type);
  const _0x38012b = Number(occurrence);
  const _0x3d5cd8 = Number["isFinite"](_0x38012b) && _0x38012b >= 0x0;
  if (!_0x4da883 || !Number['isFinite'](_0x4f9fe4)) {
    return ![];
  }
  const _0x19816e = a1164_0x3dab93(_getTargetNodeData(_0x5bad37));
  let _0x37e7f7 = 0x0;
  let _0x1f8bf5 = ![];
  const _0x15f210 = _0x19816e["filter"](_0x269187 => {
    if (_0x1f8bf5) {
      return !![];
    }
    const _0x199fcf = _0x269187["assetId"] === _0x4da883 && _0x269187["itemIndex"] === Math["max"](0x0, Math['trunc'](_0x4f9fe4)) && (!_0x1346bb || _0x269187["type"] === _0x1346bb);
    if (!_0x199fcf) {
      return !![];
    }
    if (_0x3d5cd8 && _0x37e7f7 !== _0x38012b) {
      _0x37e7f7 += 0x1;
      return !![];
    }
    _0x1f8bf5 = !![];
    return ![];
  });
  if (!_0x1f8bf5) {
    return ![];
  }
  a1164_0x4309f8["updateNodeData"](_0x57a679, {
    [PROMPT_ASSET_INPUT_REFS_FIELD]: _0x15f210
  });
  _notifyPromptHtmlUpdated(_0x5bad37);
  return !![];
}
function _assetInputRefTargetMatches(_0x95f9e = {}, _0x3470fb = {}) {
  const _0xb44917 = String(_0x3470fb?.['assetId'] || '')["trim"]();
  const _0x5dba5c = _0x3470fb?.["itemIndex"] !== undefined && _0x3470fb?.["itemIndex"] !== null ? _0x3470fb["itemIndex"] : _0x3470fb?.["assetIndex"];
  const _0x1a1403 = Number(_0x5dba5c);
  const _0x156352 = a1164_0x2166b3(_0x3470fb?.["type"] || _0x3470fb?.["refType"] || '');
  if (!_0xb44917 || !Number['isFinite'](_0x1a1403)) {
    return ![];
  }
  return String(_0x95f9e?.["assetId"] || '')["trim"]() === _0xb44917 && Number(_0x95f9e?.["itemIndex"]) === Math["max"](0x0, Math["trunc"](_0x1a1403)) && (!_0x156352 || a1164_0x2166b3(_0x95f9e?.["type"]) === _0x156352);
}
function _removePromptAssetInputRecordFromNodeData(_0x3cfe6d = {}, _0x1b847e = {}) {
  const _0xd17f5d = a1164_0x3dab93(_0x3cfe6d);
  if (!_0xd17f5d["length"]) {
    return {
      'removed': ![],
      'records': _0xd17f5d
    };
  }
  const _0x4a9ee6 = String(_0x1b847e?.["assetRefSource"] || '')["trim"]();
  if (_0x4a9ee6 && _0x4a9ee6 !== "hidden") {
    return {
      'removed': ![],
      'records': _0xd17f5d
    };
  }
  const _0x39a8ea = Number(_0x1b847e?.['promptAssetRefIndex']);
  if (Number["isFinite"](_0x39a8ea) && _0x39a8ea >= 0x0) {
    const _0x921473 = Math["max"](0x0, Math["trunc"](_0x39a8ea));
    if (_assetInputRefTargetMatches(_0xd17f5d[_0x921473], _0x1b847e)) {
      const _0x220e49 = _0xd17f5d["slice"]();
      _0x220e49['splice'](_0x921473, 0x1);
      return {
        'removed': !![],
        'records': _0x220e49
      };
    }
  }
  const _0x296d99 = Number(_0x1b847e?.['assetMentionOccurrence'] ?? _0x1b847e?.["occurrence"]);
  const _0x684ce5 = Number["isFinite"](_0x296d99) && _0x296d99 >= 0x0;
  let _0x28226b = 0x0;
  let _0x1ec703 = ![];
  const _0x4c603c = _0xd17f5d["filter"](_0x30896b => {
    if (_0x1ec703 || !_assetInputRefTargetMatches(_0x30896b, _0x1b847e)) {
      return !![];
    }
    if (_0x684ce5 && _0x28226b !== Math['trunc'](_0x296d99)) {
      _0x28226b += 0x1;
      return !![];
    }
    _0x1ec703 = !![];
    return ![];
  });
  return {
    'removed': _0x1ec703,
    'records': _0x4c603c
  };
}
function _removeAssetMentionPillFromPromptHtml(_0x184241 = '', _0x16c7e5 = {}) {
  const _0x369616 = String(_0x16c7e5?.['assetRefSource'] || '')["trim"]();
  if (_0x369616 && _0x369616 !== "prompt") {
    return {
      'removed': ![],
      'prompt': _0x184241
    };
  }
  const _0x140ee5 = sanitizePromptHtml(_0x184241);
  if (!_0x140ee5) {
    return {
      'removed': ![],
      'prompt': _0x140ee5
    };
  }
  const _0x4352f3 = Number(_0x16c7e5?.["assetMentionOccurrence"] ?? _0x16c7e5?.["occurrence"]);
  const _0xa1e60b = Number['isFinite'](_0x4352f3) && _0x4352f3 >= 0x0;
  let _0x50334e = 0x0;
  let _0x2be391 = ![];
  const _0x5991fe = _0x140ee5["replace"](/<span\b([^>]*)>([\s\S]*?)<\/span>/gi, (_0xf4e056, _0xb36acf) => {
    if (_0x2be391) {
      return _0xf4e056;
    }
    if (!_htmlClassAttrContains(_0xb36acf, "ref-pill")) {
      return _0xf4e056;
    }
    if (_getHtmlAttrValue(_0xb36acf, "data-ref-origin") !== "asset") {
      return _0xf4e056;
    }
    const _0x59aaa2 = {
      'assetId': _getHtmlAttrValue(_0xb36acf, "data-asset-id"),
      'itemIndex': _getHtmlAttrValue(_0xb36acf, "data-asset-index"),
      'type': _getHtmlAttrValue(_0xb36acf, "data-ref-type")
    };
    if (!_assetInputRefTargetMatches(_0x59aaa2, _0x16c7e5)) {
      return _0xf4e056;
    }
    if (_0xa1e60b && _0x50334e !== Math['trunc'](_0x4352f3)) {
      _0x50334e += 0x1;
      return _0xf4e056;
    }
    _0x2be391 = !![];
    return '';
  });
  return {
    'removed': _0x2be391,
    'prompt': _0x2be391 ? sanitizePromptHtml(_0x5991fe) : _0x140ee5
  };
}
export function buildRemoveAssetInputRefPatchFromNodeData(_0x4d289c = {}, _0x4b6a44 = {}) {
  const _0x1f779c = {};
  const _0x1740eb = _removePromptAssetInputRecordFromNodeData(_0x4d289c, _0x4b6a44);
  _0x1740eb["removed"] && (_0x1f779c[PROMPT_ASSET_INPUT_REFS_FIELD] = _0x1740eb["records"]);
  const _0x32d120 = _removeAssetMentionPillFromPromptHtml(_0x4d289c?.['prompt'] || '', _0x4b6a44);
  _0x32d120["removed"] && (_0x1f779c["prompt"] = _0x32d120["prompt"]);
  return Object["keys"](_0x1f779c)["length"] ? _0x1f779c : null;
}
export function removeAssetInputRefFromNodeData(_0x1e49bd = '', _0x2cdba4 = {}) {
  const _0x737144 = String(_0x1e49bd || '')["trim"]();
  if (!_0x737144) {
    return ![];
  }
  const _0x59c662 = a1164_0x4309f8["getState"]?.()?.["nodes"]?.[_0x737144] || {};
  const _0x1c824a = buildRemoveAssetInputRefPatchFromNodeData(_0x59c662, _0x2cdba4);
  if (!_0x1c824a) {
    return ![];
  }
  a1164_0x4309f8["updateNodeData"](_0x737144, _0x1c824a);
  return !![];
}
export function handleRefThumbDeleteClick(_0x4cccab, _0x3ff1ac) {
  const _0x4ff766 = _0x3ff1ac?.['target']?.["closest"]?.(".ref-thumb-delete");
  if (!_0x4ff766) {
    return ![];
  }
  typeof _0x3ff1ac["stopImmediatePropagation"] === 'function' ? _0x3ff1ac["stopImmediatePropagation"]() : _0x3ff1ac["stopPropagation"]?.();
  _0x3ff1ac["preventDefault"]?.();
  const _0x2afdc4 = _0x4ff766["closest"]?.('.ref-thumb-wrap');
  const _0x17563a = _0x2afdc4?.["dataset"]?.["edgeId"] || '';
  if (_0x17563a) {
    a1164_0x4309f8["removeEdge"](_0x17563a);
    _notifyPromptHtmlUpdated(_0x4cccab);
    return !![];
  }
  if (_0x2afdc4?.['dataset']?.["refOrigin"] === "asset") {
    const _0x1e0fa4 = {
      'assetId': _0x2afdc4['dataset']["assetId"],
      'assetIndex': _0x2afdc4["dataset"]["assetIndex"],
      'type': _0x2afdc4["dataset"]["refType"] || _0x2afdc4["dataset"]["type"] || _0x2afdc4["dataset"]["kind"],
      'occurrence': _0x2afdc4['dataset']['assetOccurrence']
    };
    const _0x35dfba = String(_0x2afdc4["dataset"]['assetRefSource'] || '')["trim"]();
    const _0x4b86e6 = _0x35dfba === "hidden" ? removePromptAssetInputRefFromNode(_0x4cccab, _0x1e0fa4) : removeAssetMentionPillFromPrompt(_0x4cccab, _0x1e0fa4) || removePromptAssetInputRefFromNode(_0x4cccab, _0x1e0fa4);
    !_0x4b86e6 && (_0x4cccab?.['_renderRefBar']?.(), _0x4cccab?.["_updateSubmitButtonState"]?.());
  }
  return !![];
}
function _createInputCountState() {
  return {
    'counts': {
      'text': 0x0,
      'image': 0x0,
      'video': 0x0,
      'audio': 0x0
    },
    'keysByType': {
      'text': new Set(),
      'image': new Set(),
      'video': new Set(),
      'audio': new Set()
    }
  };
}
function _cloneInputCountState(_0x2a9af3 = null) {
  const _0x5c44d4 = _createInputCountState();
  MENTION_TYPE_ORDER["forEach"](_0x2dd3d9 => {
    _0x5c44d4["counts"][_0x2dd3d9] = Number(_0x2a9af3?.["counts"]?.[_0x2dd3d9] || 0x0);
    _0x5c44d4["keysByType"][_0x2dd3d9] = new Set(_0x2a9af3?.["keysByType"]?.[_0x2dd3d9] || []);
  });
  return _0x5c44d4;
}
function _addInputCount(_0x12171f, _0xb6ef9, _0x343594 = '') {
  const _0x45afee = a1164_0x2166b3(_0xb6ef9);
  if (!_0x12171f || _0x12171f["counts"]?.[_0x45afee] == null) {
    return ![];
  }
  const _0x140e67 = String(_0x343594 || '')['trim']();
  const _0x10e44d = _0x12171f["keysByType"]?.[_0x45afee];
  if (_0x140e67 && _0x10e44d?.["has"](_0x140e67)) {
    return ![];
  }
  if (_0x140e67 && _0x10e44d) {
    _0x10e44d["add"](_0x140e67);
  }
  _0x12171f["counts"][_0x45afee] += 0x1;
  return !![];
}
function _getNodeInputCountKey(_0x353910 = '', _0x370573 = '') {
  const _0x5a31e2 = String(_0x353910 || '')["trim"]();
  const _0x30eec3 = a1164_0x2166b3(_0x370573);
  return _0x5a31e2 && _0x30eec3 ? "node:" + _0x5a31e2 + ':' + _0x30eec3 : '';
}
function _getAssetInputCountKey({
  assetId = '',
  itemIndex = null,
  assetIndex = null,
  type = ''
} = {}) {
  const _0x295b9d = String(assetId || '')['trim']();
  const _0x13ddcc = itemIndex !== null && itemIndex !== undefined ? itemIndex : assetIndex;
  const _0xdfaa56 = Number(_0x13ddcc);
  const _0x145c76 = a1164_0x2166b3(type);
  if (!_0x295b9d || !Number["isFinite"](_0xdfaa56) || !_0x145c76) {
    return '';
  }
  return "asset:" + _0x295b9d + ':' + Math['max'](0x0, Math["trunc"](_0xdfaa56)) + ':' + _0x145c76;
}
function _getMentionInputCountKey(_0x53b439 = {}, _0x1be8a3 = '') {
  const _0x5f3c50 = a1164_0x2166b3(_0x1be8a3 || _0x53b439?.["type"]);
  if (_0x53b439?.["origin"] === "asset") {
    return _getAssetInputCountKey({
      'assetId': _0x53b439["assetId"],
      'itemIndex': _0x53b439["itemIndex"],
      'assetIndex': _0x53b439['assetIndex'],
      'type': _0x5f3c50
    });
  }
  return _getNodeInputCountKey(_0x53b439?.["nodeId"] || _0x53b439?.["sourceId"], _0x5f3c50);
}
function _isMentionAlreadyCounted(_0x4690bc, _0x35d069 = {}, _0x4a4432 = '') {
  const _0x5bc389 = a1164_0x2166b3(_0x4a4432 || _0x35d069?.["type"]);
  const _0x1fb979 = _getMentionInputCountKey(_0x35d069, _0x5bc389);
  return !!(_0x5bc389 && _0x1fb979 && _0x4690bc?.['keysByType']?.[_0x5bc389]?.['has'](_0x1fb979));
}
function _canReuseAlreadyCountedInputForLimit(_0x47acdd = '') {
  return a1164_0x2166b3(_0x47acdd) !== 'audio';
}
function _getPromptInputCountState(_0x1e9a3c, _0x404a09 = null, {
  nodeData = null
} = {}) {
  const _0x5d8e22 = _createInputCountState();
  const _0x699f5 = a1164_0x4309f8["getState"]();
  const _0x47a0fe = _0x699f5['nodes'] || {};
  _0x1e9a3c && typeof _0x1e9a3c["querySelectorAll"] === "function" && _0x1e9a3c["querySelectorAll"](".ref-pill")["forEach"](_0x353df8 => {
    if (_0x353df8 === _0x404a09) {
      return;
    }
    let _0xbd78a = '';
    let _0x5a00e5 = '';
    if (_isAssetMentionPill(_0x353df8)) {
      const _0x288564 = getAssetMentionRefFromPillNode(_0x353df8);
      _0xbd78a = _0x288564?.['type'] || _getDatasetValue(_0x353df8, "refType", "data-ref-type");
      _0x5a00e5 = _getAssetInputCountKey({
        'assetId': _0x288564?.["assetId"] || _getDatasetValue(_0x353df8, "assetId", 'data-asset-id'),
        'itemIndex': _0x288564?.["itemIndex"],
        'assetIndex': _getDatasetValue(_0x353df8, 'assetIndex', "data-asset-index"),
        'type': _0xbd78a
      });
    } else {
      const _0xc1017c = _getDatasetValue(_0x353df8, 'nodeId', 'data-node-id');
      if (_isUnresolvedInputMentionPill(_0x353df8)) {
        return;
      }
      _0xbd78a = _getPillMentionType(_0x353df8) || a1164_0x2166b3(_0x47a0fe?.[_0xc1017c]?.["type"] || '');
      _0x5a00e5 = _getNodeInputCountKey(_0xc1017c, _0xbd78a);
    }
    _addInputCount(_0x5d8e22, _0xbd78a, _0x5a00e5);
  });
  a1164_0x3dab93(nodeData || {})['forEach'](_0x1fc0a6 => {
    _addInputCount(_0x5d8e22, _0x1fc0a6["type"], _getAssetInputCountKey(_0x1fc0a6));
  });
  return _0x5d8e22;
}
function _countPromptPillsByType(_0x4d22ec, _0x265e09 = null, {
  nodeData = null
} = {}) {
  return _getPromptInputCountState(_0x4d22ec, _0x265e09, {
    'nodeData': nodeData
  })["counts"];
}
function _candidateMatchesQuery({
  label = '',
  type = '',
  assetName = ''
}, _0x3013bd = '') {
  const _0x212b85 = _normalizeQuery(_0x3013bd)["toLowerCase"]();
  if (!_0x212b85) {
    return !![];
  }
  const _0x483950 = AT_TYPE_MAP[type] || type;
  const _0x28f009 = _getAssetTypeMenuLabel(type);
  return [label, _0x483950, _0x28f009, assetName]['join']('\x20')["toLowerCase"]()["includes"](_0x212b85);
}
export function _resolvePromptTextWithTextRefs({
  promptEl = null,
  inEdges = [],
  nodes = {},
  assetInputRefs = null,
  assetMediaCounts = null,
  allowedAssetTypes = null,
  prependUnusedTextRefs = !![],
  resolveAssetMentionRef = null,
  dedupeAssetMentions = ![],
  assetDedupeState = null
} = {}) {
  const _0x22da4f = [];
  let _0x32f2f3 = 0x0;
  for (const _0x6739d9 of inEdges) {
    const _0x26742b = nodes?.[_0x6739d9?.["sourceId"]];
    if (!_0x26742b) {
      continue;
    }
    if (a1164_0x2166b3(_0x26742b["type"]) !== "text") {
      continue;
    }
    const _0x4966df = resolveTextReferenceContent(_0x26742b);
    if (!_0x4966df) {
      continue;
    }
    _0x32f2f3 += 0x1;
    _0x22da4f['push']({
      'label': '@' + AT_TYPE_MAP['text'] + _0x32f2f3,
      'content': _0x4966df,
      'sourceId': String(_0x6739d9?.['sourceId'] || ''),
      'used': ![]
    });
  }
  if (!promptEl && _0x22da4f['length'] === 0x0) {
    return '';
  }
  const _0x99ea57 = Object["create"](null);
  const _0x2cffaa = Object['create'](null);
  _0x22da4f["forEach"](_0x3f344e => {
    _0x99ea57[_normalizeMentionLabelKey(_0x3f344e["label"])] = _0x3f344e;
    if (_0x3f344e['sourceId']) {
      _0x2cffaa[_0x3f344e["sourceId"]] = _0x3f344e;
    }
  });
  const _0x2b1925 = globalThis["Node"]?.["TEXT_NODE"] ?? 0x3;
  const _0x157d97 = globalThis['Node']?.['ELEMENT_NODE'] ?? 0x1;
  const _0x4bb573 = assetDedupeState || (dedupeAssetMentions ? new Map() : null);
  let _0x2bf498 = '';
  const _0x2fc726 = _0x1abfef => {
    for (const _0x1dc1a9 of _getChildNodes(_0x1abfef)) {
      const _0x18deca = Number(_0x1dc1a9?.['nodeType']);
      if (_0x18deca === _0x2b1925) {
        _0x2bf498 += String(_0x1dc1a9?.['textContent'] || '');
        continue;
      }
      if (_0x18deca !== _0x157d97) {
        continue;
      }
      if (_isRefPillNode(_0x1dc1a9)) {
        const _0x1b7f00 = [];
        if (appendAssetMentionToPrompt({
          'domNode': _0x1dc1a9,
          'rawLabel': String(_0x1dc1a9?.["dataset"]?.['label'] || _0x1dc1a9?.['textContent'] || '')["trim"](),
          'promptParts': _0x1b7f00,
          'inputRefs': assetInputRefs,
          'mediaCounts': assetMediaCounts,
          'allowedTypes': allowedAssetTypes,
          'resolveAssetMentionRef': resolveAssetMentionRef,
          'dedupeState': _0x4bb573
        })) {
          _0x2bf498 += _0x1b7f00["join"]('');
          continue;
        }
        const _0x14919d = String(_0x1dc1a9?.["dataset"]?.["nodeId"] || '');
        const _0x2c23a0 = _getPromptInputDisplayLabel(_0x1dc1a9);
        const _0x66034f = getPromptInputSubmitLabelFromPillNode(_0x1dc1a9, _0x2c23a0) || _0x2c23a0;
        if (_isUnresolvedInputMentionPill(_0x1dc1a9)) {
          _0x2bf498 += '\x20' + _0x66034f + '\x20';
          continue;
        }
        const _0x348f0c = _normalizeMentionLabelKey(_getPromptInputRefLabel(_0x1dc1a9, _0x2c23a0) || _0x2c23a0);
        const _0x5198b7 = _0x14919d && _0x2cffaa[_0x14919d] || _0x99ea57[_0x348f0c];
        _0x5198b7 ? (_0x5198b7["used"] = !![], _0x2bf498 += '\x20' + _0x5198b7["content"] + '\x20') : _0x2bf498 += '\x20' + _0x66034f + '\x20';
        continue;
      }
      if (String(_0x1dc1a9?.['tagName'] || '')["toUpperCase"]() === 'BR') {
        _0x2bf498 += '\x0a';
        continue;
      }
      _0x2fc726(_0x1dc1a9);
    }
  };
  _getChildNodes(promptEl)["length"] > 0x0 ? _0x2fc726(promptEl) : _0x2bf498 = String(promptEl?.["textContent"] || '');
  let _0x304ad6 = _normalizePromptWhitespace(_0x2bf498);
  _0x22da4f["forEach"](_0x4f52eb => {
    if (_0x4f52eb["used"]) {
      return;
    }
    const _0x3bb58e = new RegExp(_escapeRegExp(_0x4f52eb['label'])["replace"](/\s+/g, '[\x5cs\x5cu00A0]*'), 'g');
    _0x3bb58e["test"](_0x304ad6) && (_0x4f52eb['used'] = !![], _0x304ad6 = _0x304ad6["replace"](_0x3bb58e, '\x20' + _0x4f52eb["content"] + '\x20'));
  });
  _0x304ad6 = _normalizePromptWhitespace(_0x304ad6);
  let _0x381f22 = '';
  prependUnusedTextRefs && _0x22da4f['forEach'](_0x2f6f4b => {
    !_0x2f6f4b['used'] && _0x2f6f4b["content"] && (_0x381f22 += _0x2f6f4b["content"] + '\x0a', _0x2f6f4b["used"] = !![]);
  });
  if (!_0x381f22) {
    return _0x304ad6;
  }
  if (!_0x304ad6) {
    return _0x381f22["replace"](/\n+$/g, '');
  }
  return '' + _0x381f22 + _0x304ad6;
}
export function resolvePromptTextWithTextRefs(_0x54df97 = {}) {
  return _resolvePromptTextWithTextRefs(_0x54df97);
}
export function resolvePresetPromptTextWithTextRefs({
  template = null,
  promptEl = null,
  inEdges = [],
  nodes = {},
  assetInputRefs = null,
  assetMediaCounts = null,
  allowedAssetTypes = null,
  dedupeAssetMentions = ![],
  assetDedupeState = null
} = {}) {
  const _0x32147f = _resolvePromptTextWithTextRefs({
    'promptEl': promptEl,
    'inEdges': inEdges,
    'nodes': nodes,
    'assetInputRefs': assetInputRefs,
    'assetMediaCounts': assetMediaCounts,
    'allowedAssetTypes': allowedAssetTypes,
    'dedupeAssetMentions': dedupeAssetMentions,
    'assetDedupeState': assetDedupeState
  });
  if (template == null) {
    return _0x32147f;
  }
  const _0xdad1f7 = resolvePromptPresetTemplate(template, _0x32147f);
  return _resolvePromptTextWithTextRefs({
    'promptEl': {
      'innerText': _0xdad1f7,
      'textContent': _0xdad1f7,
      'childNodes': []
    },
    'inEdges': inEdges,
    'nodes': nodes,
    'assetInputRefs': assetInputRefs,
    'assetMediaCounts': assetMediaCounts,
    'allowedAssetTypes': allowedAssetTypes,
    'prependUnusedTextRefs': ![]
  });
}
function _templateConsumesPresetUserInput(_0x442382 = null) {
  if (_0x442382 == null) {
    return ![];
  }
  const _0xeb2e23 = "__PROMPT_PRESET_USER_INPUT_MARKER__";
  return resolvePromptPresetTemplate(_0x442382, _0xeb2e23)["includes"](_0xeb2e23);
}
function _resolveInsertedPresetPromptText({
  template = null,
  promptEl = null,
  inEdges = [],
  nodes = {},
  allowedAssetTypes = null
} = {}) {
  const _0x56b53f = _resolvePromptTextWithTextRefs({
    'promptEl': promptEl,
    'inEdges': inEdges,
    'nodes': nodes,
    'assetInputRefs': [],
    'assetMediaCounts': {
      'image': 0x0,
      'video': 0x0,
      'audio': 0x0
    },
    'allowedAssetTypes': allowedAssetTypes
  });
  const _0x25ed35 = resolvePromptPresetTemplate(template, _0x56b53f);
  if (!_0x56b53f || _templateConsumesPresetUserInput(template)) {
    return _0x25ed35;
  }
  if (!_0x25ed35) {
    return _0x56b53f;
  }
  return _0x56b53f + '\x0a' + _0x25ed35;
}
function _notifyPromptHtmlUpdated(_0x1357e2, _0x383ba0 = {}) {
  const _0x91610c = _0x383ba0?.['renderRefBar'] !== ![];
  if (typeof _0x1357e2['_handlePromptHtmlUpdated'] === "function") {
    _0x1357e2["_handlePromptHtmlUpdated"]();
    return;
  }
  _0x91610c && typeof _0x1357e2['_renderRefBar'] === "function" && _0x1357e2["_renderRefBar"]();
  typeof _0x1357e2["_updateSubmitButtonState"] === "function" && _0x1357e2["_updateSubmitButtonState"]();
}
function _isEmptyPromptHtml(_0x1ac3b6 = '') {
  const _0x4a73f6 = String(_0x1ac3b6 || '')["replace"](/<br\b[^>]*\/?>/gi, '')["replace"](/<\/?(?:div|p|section|article|blockquote)\b[^>]*>/gi, '')['replace'](/&nbsp;|\u00a0/g, '')["trim"]();
  return _0x4a73f6 === '';
}
function _sanitizePromptHtmlForCommit(_0x4065da = '') {
  const _0x19cdca = sanitizePromptHtml(_0x4065da);
  return _isEmptyPromptHtml(_0x19cdca) ? '' : _0x19cdca;
}
function _readPromptHtmlForCommit(_0x28770a) {
  const _0x29958b = serializeVirtualizedPromptHtml(_0x28770a?.["promptEl"]);
  const _0x20eff9 = _0x29958b === null ? sanitizePromptHtml(_0x28770a?.["promptEl"]?.["innerHTML"] || '') : _0x29958b;
  const _0x592ae9 = _isEmptyPromptHtml(_0x20eff9) ? '' : _0x20eff9;
  rememberVirtualizedPromptCommit(_0x28770a, _0x592ae9);
  return _0x592ae9;
}
export function sanitizePromptHtmlForCommit(_0x5a4f81 = '') {
  return _sanitizePromptHtmlForCommit(_0x5a4f81);
}
function _clearPromptHtmlCommitTimer(_0x6bb3aa) {
  if (!_0x6bb3aa?.["_promptHtmlCommitTimer"]) {
    return;
  }
  clearTimeout(_0x6bb3aa['_promptHtmlCommitTimer']);
  _0x6bb3aa["_promptHtmlCommitTimer"] = null;
}
export function schedulePromptHtmlCommit(_0x98d153, {
  delayMs = PROMPT_HTML_COMMIT_DELAY_MS
} = {}) {
  if (!_0x98d153?.["promptEl"] || !_0x98d153?.["nodeId"]) {
    return ![];
  }
  removeVirtualPromptPasteEndMarker(_0x98d153["promptEl"]);
  _clearPromptHtmlCommitTimer(_0x98d153);
  _0x98d153["_hasPendingPromptHtmlCommit"] = !![];
  _pendingPromptHtmlCommitTargets["add"](_0x98d153);
  const _0x3c212c = Math["max"](0x0, Number(delayMs) || 0x0);
  _0x98d153["_promptHtmlCommitTimer"] = setTimeout(() => {
    flushPromptHtmlCommit(_0x98d153);
  }, _0x3c212c);
  return !![];
}
export function cancelPromptHtmlCommit(_0xdf2595) {
  if (!_0xdf2595) {
    return ![];
  }
  _clearPromptHtmlCommitTimer(_0xdf2595);
  _0xdf2595['_hasPendingPromptHtmlCommit'] = ![];
  _pendingPromptHtmlCommitTargets["delete"](_0xdf2595);
  return !![];
}
export function flushPromptHtmlCommit(_0x346613) {
  if (deferNodeEditorCommit(_0x346613?.['promptEl'], 'prompt', () => flushPromptHtmlCommit(_0x346613))) {
    return ![];
  }
  if (!_0x346613) {
    return ![];
  }
  _clearPromptHtmlCommitTimer(_0x346613);
  const _0x5b297b = _0x346613["_hasPendingPromptHtmlCommit"] === !![];
  _0x346613["_hasPendingPromptHtmlCommit"] = ![];
  _pendingPromptHtmlCommitTargets["delete"](_0x346613);
  if (!_0x346613?.["promptEl"] || !_0x346613?.["nodeId"]) {
    return ![];
  }
  const _0x2ea0c9 = _readPromptHtmlForCommit(_0x346613);
  if (typeof _0x346613["commitPromptHtml"] === 'function') {
    const _0x24b44e = typeof _0x346613['getPromptHtml'] === 'function' ? String(_0x346613["getPromptHtml"]() || '') : '';
    if (_0x24b44e === _0x2ea0c9) {
      return ![];
    }
    _0x346613['commitPromptHtml'](_0x2ea0c9);
    _notifyPromptHtmlUpdated(_0x346613, {
      'renderRefBar': getPromptReferenceSignature(_0x24b44e) !== getPromptReferenceSignature(_0x2ea0c9)
    });
    return !![];
  }
  const _0x418ed3 = (a1164_0x4309f8["getStateRaw"]?.() || a1164_0x4309f8["getState"]?.())?.["nodes"]?.[_0x346613['nodeId']];
  if (!_0x418ed3) {
    return ![];
  }
  const _0x100cf7 = _0x418ed3["prompt"];
  if (!_0x5b297b && _0x100cf7 === _0x2ea0c9) {
    return ![];
  }
  if (_0x100cf7 === _0x2ea0c9) {
    return ![];
  }
  a1164_0x4309f8['updateNodeData'](_0x346613["nodeId"], {
    'prompt': _0x2ea0c9
  });
  _notifyPromptHtmlUpdated(_0x346613, {
    'renderRefBar': getPromptReferenceSignature(_0x100cf7) !== getPromptReferenceSignature(_0x2ea0c9)
  });
  return !![];
}
export function flushAllPendingPromptHtmlCommits() {
  let _0x14d2ee = ![];
  Array["from"](_pendingPromptHtmlCommitTargets)['forEach'](_0x1644d5 => {
    _0x14d2ee = flushPromptHtmlCommit(_0x1644d5) || _0x14d2ee;
  });
  return _0x14d2ee;
}
function _updatePromptHtml(_0x139d05, _0x2211b9 = {}) {
  if (deferNodeEditorCommit(_0x139d05?.["promptEl"], "prompt", () => _updatePromptHtml(_0x139d05, _0x2211b9))) {
    return;
  }
  if (!_0x139d05?.['promptEl'] || !_0x139d05?.["nodeId"]) {
    return;
  }
  cancelPromptHtmlCommit(_0x139d05);
  const _0x38c395 = _readPromptHtmlForCommit(_0x139d05);
  if (typeof _0x139d05["commitPromptHtml"] === "function") {
    _0x139d05["commitPromptHtml"](_0x38c395);
    _notifyPromptHtmlUpdated(_0x139d05, _0x2211b9);
    return;
  }
  a1164_0x4309f8["updateNodeData"](_0x139d05["nodeId"], {
    'prompt': _0x38c395
  });
  _notifyPromptHtmlUpdated(_0x139d05, _0x2211b9);
}
function _commitPromptAndAssetInputRefs(_0x189b66, _0x44fdcd) {
  if (deferNodeEditorCommit(_0x189b66?.["promptEl"], "prompt-assets", () => _commitPromptAndAssetInputRefs(_0x189b66, _0x44fdcd))) {
    return ![];
  }
  if (!_0x189b66?.["nodeId"]) {
    return ![];
  }
  const _0x3ef580 = {
    [PROMPT_ASSET_INPUT_REFS_FIELD]: Array["isArray"](_0x44fdcd) ? _0x44fdcd : []
  };
  _0x189b66?.["promptEl"] && (cancelPromptHtmlCommit(_0x189b66), _0x3ef580["prompt"] = _readPromptHtmlForCommit(_0x189b66));
  a1164_0x4309f8["updateNodeData"](_0x189b66["nodeId"], _0x3ef580);
  _notifyPromptHtmlUpdated(_0x189b66);
  return !![];
}
function _getPromptAssetInputRefRecordForMention(_0x4fad98 = {}) {
  if (_0x4fad98?.["origin"] !== "asset") {
    return null;
  }
  return a1164_0x2cee74({
    'assetId': _0x4fad98['assetId'],
    'itemIndex': _0x4fad98["assetIndex"] ?? _0x4fad98["itemIndex"],
    'type': _0x4fad98["type"]
  });
}
function _appendPromptAssetInputRefRecords(_0x191d91, _0x501c27 = []) {
  const _0x359e26 = a1164_0x3dab93(_getTargetNodeData(_0x191d91));
  const _0x27af2f = _0x359e26["slice"]();
  (Array["isArray"](_0x501c27) ? _0x501c27 : [_0x501c27])["forEach"](_0x1976dc => {
    const _0x5d24ac = _getPromptAssetInputRefRecordForMention(_0x1976dc);
    if (_0x5d24ac) {
      _0x27af2f["push"](_0x5d24ac);
    }
  });
  return _0x27af2f;
}
function _shouldStoreMentionAsPromptAssetInput(_0x28429b, _0x3bdbaf = {}) {
  const _0x182d7c = a1164_0x2166b3(_0x3bdbaf?.["type"]);
  return _0x28429b?.['keepAssetMentionPills'] !== !![] && _0x3bdbaf?.["origin"] === 'asset' && _0x182d7c && _0x182d7c !== 'text' && isRunningHubWorkflowNode(_getTargetNodeData(_0x28429b));
}
function _consumeMentionTriggerText({
  triggerRange = null,
  atIndex = -0x1
} = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return ![];
  }
  const _0x137a87 = window["getSelection"]?.();
  const _0x5f4953 = triggerRange || (_0x137a87 && _0x137a87["rangeCount"] ? _0x137a87['getRangeAt'](0x0) : null);
  if (!_0x5f4953 || _0x5f4953["startContainer"]["nodeType"] !== Node['TEXT_NODE']) {
    return ![];
  }
  const _0x5cf72c = _0x5f4953["startContainer"];
  const _0x5ce718 = String(_0x5cf72c["textContent"] || '');
  const _0x4b5214 = _0x5f4953["startOffset"];
  const _0x15acd3 = Number['isFinite'](atIndex) && atIndex >= 0x0 ? atIndex : _findLastMentionTriggerIndex(_0x5ce718, _0x4b5214);
  if (_0x15acd3 < 0x0) {
    return ![];
  }
  const _0x476238 = _0x5cf72c["parentNode"];
  if (!_0x476238) {
    return ![];
  }
  const _0x49cbee = document["createTextNode"](_0x5ce718['slice'](0x0, _0x15acd3));
  const _0x5aa4e9 = document["createTextNode"](_0x5ce718["slice"](_0x4b5214));
  _0x476238['replaceChild'](_0x5aa4e9, _0x5cf72c);
  _0x476238["insertBefore"](_0x49cbee, _0x5aa4e9);
  const _0x26ea8e = document["createRange"]();
  _0x26ea8e["setStartAfter"](_0x49cbee);
  _0x26ea8e["collapse"](!![]);
  _0x137a87?.["removeAllRanges"]?.();
  _0x137a87?.["addRange"]?.(_0x26ea8e);
  return !![];
}
function _insertPromptAssetInputRef(_0x1e1c22, _0x28aea9, {
  triggerRange = null,
  atIndex = -0x1,
  pillToEdit = null
} = {}) {
  const _0x48418 = _appendPromptAssetInputRefRecords(_0x1e1c22, [_0x28aea9]);
  if (pillToEdit) {
    pillToEdit["remove"]?.();
    return _commitPromptAndAssetInputRefs(_0x1e1c22, _0x48418);
  }
  if (!_consumeMentionTriggerText({
    'triggerRange': triggerRange,
    'atIndex': atIndex
  })) {
    return ![];
  }
  return _commitPromptAndAssetInputRefs(_0x1e1c22, _0x48418);
}
function _escapePromptPreviewHtml(_0x4834eb) {
  return String(_0x4834eb ?? '')["replace"](/&/g, "&amp;")["replace"](/</g, '&lt;')["replace"](/>/g, "&gt;")["replace"](/\r\n?/g, '\x0a')['replace'](/\n/g, '<br>');
}
function _moveCaretToPromptEnd(_0x9bfca9) {
  if (!_0x9bfca9) {
    return;
  }
  if (typeof window === "undefined" || typeof document === "undefined" || typeof document['createRange'] !== 'function') {
    return;
  }
  try {
    const _0x54752d = window["getSelection"]?.();
    if (!_0x54752d) {
      return;
    }
    const _0x166f15 = document["createRange"]();
    _0x166f15['selectNodeContents'](_0x9bfca9);
    _0x166f15['collapse'](![]);
    _0x54752d["removeAllRanges"]();
    _0x54752d["addRange"](_0x166f15);
  } catch {}
}
export function shouldUsePromptPreviewForPreset(_0x2e2853 = null, _0x215f0 = {}) {
  return (_0x215f0?.['insertPrompt'] === !![] || globalThis["window"]?.['DEV_MODE'] === !![]) && hasPromptPresetTemplateContent(_0x2e2853);
}
export function previewPresetPromptInEditor({
  storeApi = a1164_0x4309f8,
  nodeId = '',
  promptEl = null,
  promptText = '',
  toastText = '',
  toastType = "warn"
} = {}) {
  const _0x484061 = String(promptText ?? '');
  const _0x35b948 = sanitizePromptHtml(_escapePromptPreviewHtml(_0x484061));
  const _0x5144fd = typeof Element !== "undefined" && promptEl instanceof Element;
  promptEl && (promptEl["innerHTML"] = _0x35b948);
  !_0x5144fd && promptEl && (("textContent" in promptEl || typeof promptEl['textContent'] !== "undefined") && (promptEl["textContent"] = _0x484061), ("innerText" in promptEl || typeof promptEl['innerText'] !== "undefined") && (promptEl["innerText"] = _0x484061), Array['isArray'](promptEl['childNodes']) && (promptEl["childNodes"] = [{
    'nodeType': globalThis["Node"]?.["TEXT_NODE"] ?? 0x3,
    'textContent': _0x484061
  }]));
  if (typeof promptEl?.["focus"] === "function") {
    try {
      promptEl["focus"]();
    } catch {}
  }
  _0x5144fd && _moveCaretToPromptEnd(promptEl);
  storeApi?.["updateNodeData"] && nodeId && storeApi["updateNodeData"](nodeId, {
    'prompt': _0x35b948
  });
  toastText && globalThis["window"]?.['showToast']?.(toastText, toastType);
  return _0x35b948;
}
export function insertPresetPromptIntoEditor({
  storeApi = a1164_0x4309f8,
  nodeId = '',
  promptEl = null,
  template = null,
  inEdges = [],
  nodes = {},
  allowedAssetTypes = null,
  toastText = '',
  toastType = "success"
} = {}) {
  const _0x30ee2b = _resolveInsertedPresetPromptText({
    'template': template,
    'promptEl': promptEl,
    'inEdges': inEdges,
    'nodes': nodes,
    'allowedAssetTypes': allowedAssetTypes
  });
  return previewPresetPromptInEditor({
    'storeApi': storeApi,
    'nodeId': nodeId,
    'promptEl': promptEl,
    'promptText': _0x30ee2b,
    'toastText': toastText,
    'toastType': toastType
  });
}
let _mentionMenuEl = null;
let _mentionMenuState = {
  'activeMenu': null,
  'activeCandidateHoverEnd': null
};
let _mentionViewportUnsubscribe = null;
let _mentionOutsideDocClick = null;
let _mentionOutsideDocClickTimer = 0x0;
let _mentionMenuPositionState = null;
function _isMentionNodeConnected(_0x4b879d) {
  if (!_0x4b879d) {
    return ![];
  }
  if (_0x4b879d["isConnected"] === !![]) {
    return !![];
  }
  if (typeof document === "undefined") {
    return !![];
  }
  return typeof document["body"]?.['contains'] === "function" ? document["body"]["contains"](_0x4b879d) : !![];
}
function _clearMentionOutsideDocClick() {
  _mentionOutsideDocClickTimer && (clearTimeout(_mentionOutsideDocClickTimer), _mentionOutsideDocClickTimer = 0x0);
  _mentionOutsideDocClick && typeof document !== "undefined" && document["removeEventListener"]?.("mousedown", _mentionOutsideDocClick);
  _mentionOutsideDocClick = null;
}
function _cleanupMentionMenuLifecycle() {
  const _0x57712c = _mentionMenuState['activeCandidateHoverEnd'];
  _mentionMenuState['activeCandidateHoverEnd'] = null;
  _0x57712c?.();
  _clearMentionOutsideDocClick();
  _mentionViewportUnsubscribe && (_mentionViewportUnsubscribe(), _mentionViewportUnsubscribe = null);
  _mentionMenuPositionState = null;
}
function _resolveMentionMenuPoint(_0x2c5c54) {
  if (!_0x2c5c54) {
    return null;
  }
  const _0x2284d1 = 0x5;
  if (_0x2c5c54["triggerRange"]?.["getBoundingClientRect"]) {
    try {
      const _0x42efc8 = _0x2c5c54["triggerRange"]["getBoundingClientRect"]();
      if (_0x42efc8) {
        return {
          'left': _0x42efc8['left'],
          'top': _0x42efc8["bottom"] + _0x2284d1,
          'anchorTop': _0x42efc8['top']
        };
      }
    } catch {}
  }
  if (_0x2c5c54["pillToEdit"]?.["getBoundingClientRect"] && _isMentionNodeConnected(_0x2c5c54["pillToEdit"])) {
    const _0x463b2c = _0x2c5c54["pillToEdit"]["getBoundingClientRect"]();
    return {
      'left': _0x463b2c["left"],
      'top': _0x463b2c["bottom"] + _0x2284d1,
      'anchorTop': _0x463b2c["top"]
    };
  }
  if (Number['isFinite'](_0x2c5c54["fallbackX"]) && Number["isFinite"](_0x2c5c54["fallbackY"])) {
    return {
      'left': _0x2c5c54["fallbackX"],
      'top': _0x2c5c54['fallbackY']
    };
  }
  return null;
}
function _syncOpenMentionSubmenus() {
  const _0x1b5b6c = _mentionMenuPositionState?.["menu"] || _mentionMenuEl;
  if (!_0x1b5b6c?.["querySelectorAll"]) {
    return;
  }
  _0x1b5b6c["querySelectorAll"](".at-mention-submenu-open")["forEach"](_0x35ee33 => {
    const _0x52f886 = Array['from'](_0x35ee33["children"] || [])['find'](_0x11884f => _0x11884f["classList"]?.["contains"]("at-mention-submenu"));
    if (_0x52f886) {
      _positionMentionSubmenu(_0x35ee33, _0x52f886);
    }
  });
}
function _positionMentionMenu() {
  const _0x183fc2 = _mentionMenuPositionState;
  const _0x2ff715 = _0x183fc2?.["menu"];
  if (!_0x183fc2 || !_0x2ff715 || _0x2ff715["style"]["display"] !== 'flex') {
    return;
  }
  const _0x1aee59 = _resolveMentionMenuPoint(_0x183fc2);
  if (!_0x1aee59) {
    _closeMentionMenu();
    return;
  }
  const _0x570888 = Number(globalThis["window"]?.['innerWidth'] || 0x0);
  const _0x322afc = Number(globalThis["window"]?.["innerHeight"] || 0x0);
  const _0x100cd2 = 0xc;
  const _0x27f8ee = 0x5;
  _0x2ff715["style"]["maxHeight"] = '';
  const _0x242e5f = _0x2ff715["getBoundingClientRect"]?.() || null;
  const _0x459e3b = Math['max'](0x0, Number(_0x242e5f?.['width'] || _0x2ff715['offsetWidth'] || 0x0));
  const _0x51ec89 = Math["max"](0x1, Number(_0x242e5f?.["height"] || _0x2ff715["offsetHeight"] || 0x0));
  let _0x10ef09 = Number(_0x1aee59["left"] || 0x0);
  let _0x286960 = Number(_0x1aee59["top"] || 0x0);
  _0x570888 > 0x0 && _0x459e3b > 0x0 && (_0x10ef09 = Math["min"](Math['max'](_0x100cd2, _0x10ef09), Math['max'](_0x100cd2, _0x570888 - _0x100cd2 - _0x459e3b)));
  if (_0x322afc > 0x0) {
    const _0x2d5506 = Math["max"](0x0, _0x322afc - _0x100cd2 - _0x286960);
    const _0x352151 = Number['isFinite'](_0x1aee59["anchorTop"]) ? Number(_0x1aee59["anchorTop"]) : _0x286960 - _0x27f8ee;
    const _0x496a65 = Math["max"](0x0, _0x352151 - _0x100cd2);
    const _0x577abf = _0x51ec89 > _0x2d5506 && _0x496a65 > _0x2d5506;
    const _0x12d181 = _0x577abf ? _0x496a65 : _0x2d5506;
    const _0x1a29bb = Math["max"](0x1, Math["min"](_0x51ec89, _0x12d181));
    _0x2ff715['style']["maxHeight"] = _0x1a29bb + 'px';
    _0x286960 = _0x577abf ? Math["max"](_0x100cd2, _0x352151 - _0x27f8ee - _0x1a29bb) : Math["min"](Math["max"](_0x100cd2, _0x286960), Math["max"](_0x100cd2, _0x322afc - _0x100cd2 - _0x1a29bb));
  }
  _0x2ff715["style"]["left"] = _0x10ef09 + 'px';
  _0x2ff715['style']["top"] = _0x286960 + 'px';
  _syncOpenMentionSubmenus();
}
function _watchMentionViewport() {
  if (typeof a1164_0x4309f8["subscribeSelector"] !== "function") {
    return;
  }
  if (_mentionViewportUnsubscribe) {
    _mentionViewportUnsubscribe();
  }
  _mentionViewportUnsubscribe = a1164_0x4309f8["subscribeSelector"](_0x1d10bf => _0x1d10bf["viewport"], () => _positionMentionMenu());
}
function _bindMentionOutsideDocClick(_0x5e5897) {
  _clearMentionOutsideDocClick();
  _mentionOutsideDocClick = _0xc536c6 => {
    !_0x5e5897["contains"](_0xc536c6["target"]) && _closeMentionMenu();
  };
  _mentionOutsideDocClickTimer = setTimeout(() => {
    _mentionOutsideDocClickTimer = 0x0;
    _mentionOutsideDocClick && document["addEventListener"]?.("mousedown", _mentionOutsideDocClick);
  }, 0xa);
}
export function _getMentionMenu() {
  if (!_mentionMenuEl) {
    _mentionMenuEl = document["getElementById"]("v2-mention-menu");
    if (!_mentionMenuEl) {
      _mentionMenuEl = document['createElement']("div");
      _mentionMenuEl['id'] = 'v2-mention-menu';
      _mentionMenuEl["className"] = "at-mention-menu";
      document["body"]['appendChild'](_mentionMenuEl);
    } else {
      !_mentionMenuEl['classList']["contains"]('at-mention-menu') && _mentionMenuEl["classList"]["add"]('at-mention-menu');
    }
  }
  const _0x31bf84 = document["getElementById"]?.("v2-mention-menu") || null;
  if (_0x31bf84 && _0x31bf84 !== _mentionMenuEl) {
    _mentionMenuEl = _0x31bf84;
  } else {
    _mentionMenuEl && !_0x31bf84 && typeof document["body"]?.["appendChild"] === 'function' && document["body"]['appendChild'](_mentionMenuEl);
  }
  _mentionMenuEl && !_mentionMenuEl['classList']["contains"]("at-mention-menu") && _mentionMenuEl['classList']["add"]('at-mention-menu');
  return _mentionMenuEl;
}
export function _closeMentionMenu() {
  _cleanupMentionMenuLifecycle();
  const _0x5b0739 = _getMentionMenu();
  _0x5b0739['style']["display"] = "none";
  _0x5b0739['innerHTML'] = '';
  _mentionMenuState["activeMenu"] = null;
}
export function _buildMentionCandidates(_0x4f7711, _0x3a4340 = '', _0x41c0dd = {}) {
  if (typeof _0x4f7711?.["getMentionCandidates"] === "function") {
    const _0x4551ec = _0x4f7711["getMentionCandidates"]({
      'query': _0x3a4340,
      'options': _0x41c0dd
    });
    return Array["isArray"](_0x4551ec) ? _0x4551ec : [];
  }
  const _0x3ce076 = _0x4f7711?.["nodeId"];
  const _0x17fbc7 = a1164_0x4309f8["getState"]();
  const _0x4ba6c7 = _0x17fbc7["nodes"] || {};
  const _0x22dba5 = _0x4ba6c7?.[_0x3ce076] || _0x4f7711?.["_data"] || {};
  const _0x48b52f = getTargetInputPolicy(_0x22dba5);
  const _0x60bd56 = a1164_0x4309f8["getIncomingEdges"](_0x3ce076);
  const _0x312afa = _normalizeQuery(_0x3a4340);
  const _0x5b3c73 = _0x312afa['toLowerCase']();
  const _0x45991b = {
    'text': 0x0,
    'image': 0x0,
    'video': 0x0,
    'audio': 0x0
  };
  const _0x232d08 = _getPromptInputCountState(_0x4f7711?.["promptEl"], _0x41c0dd?.['excludePill'] || null, {
    'nodeData': _0x22dba5
  });
  const _0x16b4c3 = _cloneInputCountState(_0x232d08);
  const _0x260371 = [];
  _0x60bd56['forEach'](_0xa406cb => {
    const _0x33bbb4 = _0x4ba6c7[_0xa406cb["sourceId"]];
    if (!_0x33bbb4) {
      return;
    }
    const _0x108499 = resolveEffectiveInputKind(_0x33bbb4, _0xa406cb);
    if (!_0x108499) {
      return;
    }
    if (!isInputKindAllowed(_0x48b52f, _0x108499)) {
      return;
    }
    _addInputCount(_0x16b4c3, _0x108499, _getNodeInputCountKey(_0xa406cb["sourceId"], _0x108499));
    _0x45991b[_0x108499] += 0x1;
    const _0x9cd638 = AT_TYPE_MAP[_0x108499] || _0x108499;
    const _0x3f422d = '' + _0x9cd638 + _0x45991b[_0x108499];
    const _0x59c8ca = _getNodeMentionDisplayLabel(_0x33bbb4, _0x3f422d);
    if (_0x312afa && !_0x3f422d["includes"](_0x312afa) && !_0x9cd638["includes"](_0x312afa) && !_0x59c8ca["toLowerCase"]()["includes"](_0x5b3c73)) {
      return;
    }
    _0x260371['push']({
      'origin': "node",
      'edgeId': _0xa406cb['id'],
      'nodeId': _0xa406cb["sourceId"],
      'type': _0x108499,
      'label': _0x59c8ca,
      'refLabel': _0x3f422d,
      ..._getMentionVisual(_0x4f7711, {
        'origin': "node",
        'nodeId': _0xa406cb["sourceId"],
        'type': _0x108499
      }),
      'limitReason': ''
    });
  });
  const _0x56b690 = MENTION_TYPE_ORDER['filter'](_0x38d697 => isInputKindAllowed(_0x48b52f, _0x38d697));
  getAssetMentionCandidates({
    'query': '',
    'allowedTypes': _0x56b690
  })["forEach"](_0x23deea => {
    const _0x727880 = a1164_0x2166b3(_0x23deea["type"]);
    if (!_0x727880) {
      return;
    }
    if (!_candidateMatchesQuery(_0x23deea, _0x3a4340)) {
      return;
    }
    _0x260371["push"]({
      'origin': "asset",
      'assetId': _0x23deea["assetId"],
      'assetIndex': _0x23deea["itemIndex"],
      'type': _0x727880,
      'label': _stripMentionDisplayMarker(_0x23deea["insertLabel"] || _0x23deea["label"] || _0x23deea["name"]),
      'assetName': _0x23deea["assetName"],
      'thumbUrl': _getRenderableMentionThumbUrl(_0x23deea["thumbUrl"] || '', _0x727880),
      'iconType': _0x727880,
      'limitReason': _getAdvancedVoiceCloneAudioLimitReason(_0x4f7711, {
        'origin': 'asset',
        'assetId': _0x23deea["assetId"],
        'assetIndex': _0x23deea['itemIndex'],
        'type': _0x727880
      }, _0x22dba5, _0x17fbc7) ?? (_canReuseAlreadyCountedInputForLimit(_0x727880) && _isMentionAlreadyCounted(_0x16b4c3, {
        'origin': 'asset',
        'assetId': _0x23deea["assetId"],
        'assetIndex': _0x23deea["itemIndex"],
        'type': _0x727880
      }) ? '' : getInputLimitReason(_0x48b52f, _0x727880, _0x16b4c3['counts']))
    });
  });
  return _0x260371;
}
export function _buildMentionMenuTree(_0x3a7db2 = []) {
  const _0x394c75 = [];
  const _0x280428 = new Map();
  (Array["isArray"](_0x3a7db2) ? _0x3a7db2 : [])["forEach"](_0x397bba => {
    if (!_0x397bba || typeof _0x397bba !== "object") {
      return;
    }
    if (_0x397bba['origin'] !== "asset" || _0x397bba["menuDirect"] === !![]) {
      _0x394c75['push'](_0x397bba);
      return;
    }
    const _0x3e95b7 = a1164_0x2166b3(_0x397bba['type']);
    if (!_0x3e95b7) {
      return;
    }
    const _0x304af0 = String(_0x397bba['assetGroupId'] || _0x397bba["assetId"] || _0x397bba['assetName'] || "asset");
    !_0x280428["has"](_0x304af0) && _0x280428["set"](_0x304af0, {
      'assetId': _0x397bba['assetId'] || '',
      'label': _0x397bba["assetName"] || nodePromptSharedText("assetFallback"),
      'subtitle': _0x397bba["assetGroupSubtitle"] || '',
      'menuPage': _0x397bba['menuPage'] || '',
      'menuGroup': _0x397bba["menuGroup"] || '',
      'menuSection': _0x397bba["menuSection"] || '',
      'suppressBulkMention': _0x397bba["suppressBulkMention"] === !![],
      'typeMap': new Map(),
      'items': []
    });
    const _0x511021 = _0x280428['get'](_0x304af0);
    _0x511021["items"]["push"](_0x397bba);
    !_0x511021["typeMap"]["has"](_0x3e95b7) && _0x511021["typeMap"]['set'](_0x3e95b7, {
      'type': _0x3e95b7,
      'label': _getAssetTypeMenuLabel(_0x3e95b7),
      'items': []
    });
    _0x511021["typeMap"]["get"](_0x3e95b7)['items']["push"](_0x397bba);
  });
  const _0xbe9c32 = Array["from"](_0x280428["values"]())["map"](_0x22b68c => ({
    'assetId': _0x22b68c["assetId"],
    'label': _0x22b68c["label"],
    'subtitle': _0x22b68c["subtitle"],
    'menuPage': _0x22b68c['menuPage'],
    'menuGroup': _0x22b68c["menuGroup"],
    'menuSection': _0x22b68c["menuSection"],
    'suppressBulkMention': _0x22b68c["suppressBulkMention"],
    'items': _0x22b68c["items"],
    'typeItems': MENTION_TYPE_ORDER["map"](_0x2ade25 => _0x22b68c['typeMap']["get"](_0x2ade25))["filter"](_0x281759 => _0x281759?.["items"]?.["length"] > 0x0)
  }))['filter'](_0xe8c1a9 => _0xe8c1a9['items']["length"] > 0x0);
  return {
    'nodeItems': _0x394c75,
    'assetItems': _0xbe9c32
  };
}
function _getPromptInputPillLabel(_0x270291) {
  return _getPromptInputRefLabel(_0x270291, _getPromptInputDisplayLabel(_0x270291));
}
function _buildInputMentionCandidateIndex(_0x242031) {
  const _0x40e275 = _buildMentionCandidates(_0x242031, '')["filter"](_0x58cf50 => _0x58cf50?.["origin"] === "node");
  const _0xba8df6 = new Map();
  const _0x410452 = new Map();
  const _0x50c5a0 = new Map();
  _0x40e275["forEach"](_0x19d961 => {
    const _0x3e7fbd = String(_0x19d961?.["nodeId"] || '')["trim"]();
    const _0x3bb1d3 = [_0x19d961?.["label"], _0x19d961?.["refLabel"]]["map"](_0x330a85 => _normalizeMentionLabelKey(_0x330a85 || ''))["filter"](Boolean);
    const _0x129934 = a1164_0x2166b3(_0x19d961?.['type']);
    if (_0x3e7fbd) {
      _0xba8df6['set'](_0x3e7fbd, _0x19d961);
    }
    _0x3bb1d3["forEach"](_0x440b56 => {
      if (_0x440b56 && !_0x410452['has'](_0x440b56)) {
        _0x410452["set"](_0x440b56, _0x19d961);
      }
      if (_0x440b56 && _0x129934) {
        const _0xc99ea4 = _0x129934 + ':' + _0x440b56;
        if (!_0x50c5a0["has"](_0xc99ea4)) {
          _0x50c5a0['set'](_0xc99ea4, _0x19d961);
        }
      }
    });
  });
  return {
    'bySourceId': _0xba8df6,
    'byLabel': _0x410452,
    'byLabelAndType': _0x50c5a0
  };
}
function _applyInputMentionCandidateToPill(_0x30e0ce, _0x2c1bd8, _0x48a8ab) {
  if (!_isRefPillNode(_0x2c1bd8) || !_0x48a8ab) {
    return ![];
  }
  const _0x6524bd = _stripMentionDisplayMarker(_0x48a8ab["label"] || _0x2c1bd8["dataset"]?.["label"] || '');
  const _0x105cde = _stripMentionDisplayMarker(_0x48a8ab['refLabel'] || _0x6524bd);
  const _0x41159e = a1164_0x2166b3(_0x48a8ab['type']);
  _0x2c1bd8["dataset"]["refOrigin"] = "node";
  _0x2c1bd8["dataset"]['label'] = _0x6524bd;
  if (_0x105cde) {
    _0x2c1bd8["dataset"]["refLabel"] = _0x105cde;
  }
  _0x2c1bd8["dataset"]["nodeId"] = String(_0x48a8ab["nodeId"] || '');
  if (_0x41159e) {
    _0x2c1bd8["dataset"]["refType"] = _0x41159e;
  }
  delete _0x2c1bd8["dataset"]['assetId'];
  delete _0x2c1bd8["dataset"]["assetIndex"];
  _0x2c1bd8["removeAttribute"]?.('data-asset-id');
  _0x2c1bd8['removeAttribute']?.("data-asset-index");
  _clearInputMentionPillUnresolved(_0x2c1bd8);
  _renderMentionPillContent(_0x2c1bd8, _0x6524bd, _getMentionVisual(_0x30e0ce, _0x48a8ab, _0x2c1bd8));
  _decorateMentionPill(_0x30e0ce, _0x2c1bd8, _0x48a8ab);
  return !![];
}
export function resolvePromptInputPillsForTarget(_0x6d96f6) {
  if (deferNodeEditorCommit(_0x6d96f6?.["promptEl"], "prompt-inputs", () => resolvePromptInputPillsForTarget(_0x6d96f6))) {
    return {
      'unresolved': 0x0
    };
  }
  if (!_0x6d96f6?.["promptEl"] || typeof _0x6d96f6["promptEl"]["querySelectorAll"] !== "function") {
    return {
      'resolved': 0x0,
      'unresolved': 0x0
    };
  }
  const _0x508c32 = _buildInputMentionCandidateIndex(_0x6d96f6);
  let _0x8ea24d = 0x0;
  let _0x505f21 = 0x0;
  _0x6d96f6["promptEl"]["querySelectorAll"](".ref-pill")['forEach'](_0x461559 => {
    if (_isAssetMentionPill(_0x461559)) {
      return;
    }
    const _0x56d956 = _getPromptInputPillLabel(_0x461559);
    const _0x3a7817 = _normalizeMentionLabelKey(_0x56d956);
    const _0x27f8f0 = _getPillMentionType(_0x461559);
    const _0x194f38 = _getDatasetValue(_0x461559, 'nodeId', "data-node-id");
    let _0x51ff85 = _0x194f38 ? _0x508c32["bySourceId"]["get"](_0x194f38) : null;
    !_0x51ff85 && _0x3a7817 && _0x27f8f0 && (_0x51ff85 = _0x508c32['byLabelAndType']['get'](_0x27f8f0 + ':' + _0x3a7817) || null);
    !_0x51ff85 && _0x3a7817 && (_0x51ff85 = _0x508c32["byLabel"]["get"](_0x3a7817) || null);
    if (_0x51ff85 && (!_0x27f8f0 || a1164_0x2166b3(_0x51ff85['type']) === _0x27f8f0)) {
      if (_applyInputMentionCandidateToPill(_0x6d96f6, _0x461559, _0x51ff85)) {
        _0x8ea24d += 0x1;
      }
      return;
    }
    if (_setInputMentionPillUnresolved(_0x461559, {
      'label': _0x56d956,
      'type': _0x27f8f0
    })) {
      _0x505f21 += 0x1;
    }
  });
  return {
    'resolved': _0x8ea24d,
    'unresolved': _0x505f21
  };
}
function _insertPromptHtmlAtSelection(_0x450a1c) {
  if (typeof document !== "undefined" && typeof document["execCommand"] === "function") {
    try {
      if (document["execCommand"]("insertHTML", ![], _0x450a1c)) {
        return !![];
      }
    } catch {}
  }
  return ![];
}
function _insertPromptTextAtSelection(_0x29d007) {
  return insertPlainTextAtSelection(_0x29d007);
}
export function handlePromptPaste(_0xcaae1, _0x5b8d38) {
  return pasteNodePrompt(_0xcaae1, _0x5b8d38, {
    'candidates': _0x36f096 => _buildMentionCandidates(_0x36f096, ''),
    'limit': (_0x1e0ccc, _0x1aa6c1) => typeof _0x1e0ccc["getMentionCandidates"] === "function" ? _0x1aa6c1['at'](-0x1)?.['limitReason'] || '' : _0x1aa6c1['some'](_0x4f4989 => _0x4f4989['origin'] === 'asset') ? _getBulkAssetLimitReason(_0x1e0ccc, _0x1aa6c1) : '',
    'createPill': _createMentionPillForCandidate,
    'resolve': resolvePromptInputPillsForTarget,
    'hydrate': _rehydratePromptPills,
    'commit': _updatePromptHtml,
    'schedule': schedulePromptHtmlCommit
  });
}
export function handlePromptSelectAll(_0x173fb9, _0x440708) {
  if (!_0x173fb9?.["promptEl"]) {
    return ![];
  }
  const _0x2a23f9 = String(_0x440708?.["key"] || '')["toLowerCase"]();
  const _0x59299e = String(_0x440708?.['code'] || '');
  const _0xee752f = (_0x440708?.["ctrlKey"] || _0x440708?.["metaKey"]) && !_0x440708?.["altKey"] && (_0x2a23f9 === 'a' || _0x59299e === "KeyA");
  if (!_0xee752f) {
    return ![];
  }
  const _0x333ab9 = globalThis["window"]?.["getSelection"]?.();
  const _0x26376a = typeof document !== "undefined" && typeof document["createRange"] === "function" ? document["createRange"]() : null;
  if (!_0x333ab9 || !_0x26376a) {
    return ![];
  }
  _0x440708["preventDefault"]?.();
  _0x440708['stopPropagation']?.();
  _0x26376a["selectNodeContents"](_0x173fb9["promptEl"]);
  _0x333ab9["removeAllRanges"]?.();
  _0x333ab9["addRange"]?.(_0x26376a);
  return !![];
}
export function bindPromptMentionHost(_0x2ad8ee, {
  enablePaste = !![],
  enableSelectAll = !![],
  ignoreInlineEditor = !![],
  inlineEditorSelector = "[data-prompt-pill-inline-editor=\"true\"]",
  rehydrate = !![],
  commitHydratedPrompt = !![],
  closeMenuOnDestroy = !![]
} = {}) {
  const _0xbcc94f = _0x2ad8ee?.["promptEl"];
  if (!_0xbcc94f?.["addEventListener"]) {
    return null;
  }
  const _0x47e09e = _0x248d2f => ignoreInlineEditor && Boolean(_0x248d2f?.["target"]?.['closest']?.(inlineEditorSelector));
  const _0x59c27a = _0x92a7e9 => {
    if (_0x47e09e(_0x92a7e9)) {
      return;
    }
    schedulePromptHtmlCommit(_0x2ad8ee);
    _checkAtTrigger(_0x2ad8ee, _0x92a7e9);
  };
  const _0x4295e1 = () => {
    flushPromptHtmlCommit(_0x2ad8ee);
  };
  const _0x5e510d = _0x3e6393 => {
    if (_0x47e09e(_0x3e6393)) {
      return;
    }
    if (_handleMentionMenuKeyboard(_0x3e6393)) {
      return;
    }
    if (enableSelectAll && handlePromptSelectAll(_0x2ad8ee, _0x3e6393)) {
      return;
    }
    _handlePillKeyboard(_0x2ad8ee, _0x3e6393);
  };
  const _0x1bd4a6 = _0x56594c => {
    if (_0x47e09e(_0x56594c)) {
      return;
    }
    handlePromptPaste(_0x2ad8ee, _0x56594c);
  };
  _0xbcc94f["addEventListener"]("input", _0x59c27a);
  _0xbcc94f["addEventListener"]('blur', _0x4295e1);
  _0xbcc94f["addEventListener"]('keydown', _0x5e510d);
  if (enablePaste) {
    _0xbcc94f["addEventListener"]("paste", _0x1bd4a6);
  }
  if (rehydrate) {
    _rehydratePromptPills(_0x2ad8ee);
  }
  if (commitHydratedPrompt && typeof _0x2ad8ee["getPromptHtml"] === 'function' && typeof _0x2ad8ee['commitPromptHtml'] === "function") {
    const _0x531c86 = _readPromptHtmlForCommit(_0x2ad8ee);
    _0x531c86 !== _0x2ad8ee["getPromptHtml"]() && _0x2ad8ee["commitPromptHtml"](_0x531c86);
  }
  let _0xabc2da = ![];
  return {
    'destroy'() {
      if (_0xabc2da) {
        return;
      }
      _0xabc2da = !![];
      if (closeMenuOnDestroy) {
        _closeMentionMenu();
      }
      flushPromptHtmlCommit(_0x2ad8ee);
      _0xbcc94f["removeEventListener"]?.("input", _0x59c27a);
      _0xbcc94f["removeEventListener"]?.("blur", _0x4295e1);
      _0xbcc94f['removeEventListener']?.("keydown", _0x5e510d);
      if (enablePaste) {
        _0xbcc94f["removeEventListener"]?.("paste", _0x1bd4a6);
      }
    }
  };
}
export function _insertMentionPill(_0x5c7a34, {
  label: _0x441307,
  nodeId: _0x22250b,
  triggerRange = null,
  atIndex = -0x1,
  pillToEdit = null,
  candidate = null
} = {}) {
  if (!_0x5c7a34?.["promptEl"]) {
    return ![];
  }
  const _0x474ce8 = candidate || {
    'origin': 'node',
    'label': _0x441307,
    'nodeId': _0x22250b,
    'type': ''
  };
  const _0x52a167 = a1164_0x2166b3(_0x474ce8["type"]);
  if (_0x52a167) {
    const _0x5a978a = a1164_0x4309f8['getState']();
    const _0x255249 = _0x5a978a["nodes"]?.[_0x5c7a34["nodeId"]] || _0x5c7a34?.["_data"] || {};
    const _0x5e60ec = getTargetInputPolicy(_0x255249);
    const _0x398dbd = _getPromptInputCountState(_0x5c7a34["promptEl"], pillToEdit || null, {
      'nodeData': _0x255249
    });
    if (_0x474ce8['origin'] === "asset") {
      const _0x57417d = _0x5a978a['nodes'] || {};
      a1164_0x4309f8["getIncomingEdges"](_0x5c7a34["nodeId"])["forEach"](_0x1ddc15 => {
        const _0x9fa12 = resolveEffectiveInputKind(_0x57417d?.[_0x1ddc15?.["sourceId"]], _0x1ddc15);
        _addInputCount(_0x398dbd, _0x9fa12, _getNodeInputCountKey(_0x1ddc15?.["sourceId"], _0x9fa12));
      });
    }
    const _0xbc29c0 = _getAdvancedVoiceCloneAudioLimitReason(_0x5c7a34, _0x474ce8, _0x255249, _0x5a978a) ?? (_canReuseAlreadyCountedInputForLimit(_0x52a167) && _isMentionAlreadyCounted(_0x398dbd, _0x474ce8, _0x52a167) ? '' : getInputLimitReason(_0x5e60ec, _0x52a167, _0x398dbd["counts"]));
    if (_0xbc29c0) {
      globalThis["window"]?.["showToast"]?.(_0xbc29c0, "warn");
      return ![];
    }
  }
  const _0x40879f = _shouldStoreMentionAsPromptAssetInput(_0x5c7a34, _0x474ce8);
  const _0x5ba399 = insertSelectedPromptMention(_0x5c7a34, _0x474ce8, {
    'triggerRange': triggerRange,
    'atIndex': atIndex,
    'pillToEdit': pillToEdit,
    'requireOtherMatches': _0x40879f
  }, {
    'createPill': _createMentionPillForCandidate,
    'hydrate': _rehydratePromptPills,
    'commit': _updatePromptHtml
  });
  if (_0x5ba399 !== null) {
    return _0x5ba399;
  }
  if (_0x40879f) {
    return _insertPromptAssetInputRef(_0x5c7a34, _0x474ce8, {
      'triggerRange': triggerRange,
      'atIndex': atIndex,
      'pillToEdit': pillToEdit
    });
  }
  const _0x3efcdd = _0x139ca2 => {
    const _0x2de917 = _stripMentionDisplayMarker(_0x474ce8['pillLabel'] || _0x474ce8['label'] || _0x441307 || '');
    const _0x3220d5 = _stripMentionDisplayMarker(_0x474ce8["refLabel"] || _0x2de917);
    _0x139ca2["dataset"]['label'] = _0x2de917;
    if (_0x474ce8["origin"] === "asset") {
      _0x139ca2['dataset']['refOrigin'] = "asset";
      _0x139ca2["dataset"]["assetId"] = String(_0x474ce8["assetId"] || '');
      _0x139ca2["dataset"]["assetIndex"] = String(_0x474ce8['assetIndex'] ?? '');
      _0x139ca2["dataset"]["refType"] = String(_0x52a167 || _0x474ce8['type'] || '');
      delete _0x139ca2["dataset"]['refLabel'];
      _clearInputMentionPillUnresolved(_0x139ca2);
      delete _0x139ca2["dataset"]['nodeId'];
      _0x139ca2["removeAttribute"]?.("data-node-id");
      _0x139ca2['removeAttribute']?.(PROMPT_INPUT_REF_LABEL_ATTR);
      _renderMentionPillContent(_0x139ca2, _0x2de917, _getMentionVisual(_0x5c7a34, _0x474ce8, _0x139ca2));
    } else {
      _0x139ca2["dataset"]["refOrigin"] = 'node';
      _0x139ca2["dataset"]["nodeId"] = String(_0x474ce8["nodeId"] || _0x22250b || '');
      if (_0x3220d5) {
        _0x139ca2["dataset"]["refLabel"] = _0x3220d5;
      }
      (_0x52a167 || _0x474ce8["type"]) && (_0x139ca2["dataset"]["refType"] = String(_0x52a167 || _0x474ce8["type"] || ''));
      _clearInputMentionPillUnresolved(_0x139ca2);
      delete _0x139ca2["dataset"]['assetId'];
      delete _0x139ca2["dataset"]["assetIndex"];
      _0x139ca2["removeAttribute"]?.("data-asset-id");
      _0x139ca2['removeAttribute']?.("data-asset-index");
      _renderMentionPillContent(_0x139ca2, _0x2de917, _getMentionVisual(_0x5c7a34, _0x474ce8, _0x139ca2));
    }
    _applyMentionPillPresentation(_0x139ca2, _0x474ce8);
    _decorateMentionPill(_0x5c7a34, _0x139ca2, _0x474ce8);
  };
  if (pillToEdit) {
    _0x3efcdd(pillToEdit);
    _updatePromptHtml(_0x5c7a34);
    return !![];
  }
  const _0x455b02 = window['getSelection']();
  const _0x43ee88 = triggerRange || (_0x455b02 && _0x455b02["rangeCount"] ? _0x455b02['getRangeAt'](0x0) : null);
  if (!_0x43ee88 || _0x43ee88['startContainer']["nodeType"] !== Node["TEXT_NODE"]) {
    return ![];
  }
  const _0x1b3e4e = _0x43ee88["startContainer"];
  const _0xc7476c = String(_0x1b3e4e["textContent"] || '');
  const _0x45b75c = _0x43ee88['startOffset'];
  const _0x3761c7 = Number["isFinite"](atIndex) && atIndex >= 0x0 ? atIndex : _findLastMentionTriggerIndex(_0xc7476c, _0x45b75c);
  if (_0x3761c7 < 0x0) {
    return ![];
  }
  const _0x4eaf8f = _0xc7476c["slice"](0x0, _0x3761c7);
  const _0x4d59a6 = _0xc7476c['slice'](_0x45b75c);
  const _0x1182ee = document["createTextNode"](_0x4eaf8f);
  const _0x391d36 = document["createTextNode"](_0x4d59a6);
  const _0x49aa45 = document["createElement"]('span');
  _0x49aa45["className"] = 'ref-pill';
  _0x49aa45["contentEditable"] = "false";
  _0x3efcdd(_0x49aa45);
  _bindPromptPill(_0x5c7a34, _0x49aa45);
  _0x1b3e4e['parentNode']["replaceChild"](_0x391d36, _0x1b3e4e);
  _0x391d36['parentNode']["insertBefore"](_0x49aa45, _0x391d36);
  _0x391d36["parentNode"]["insertBefore"](_0x1182ee, _0x49aa45);
  const _0x462bcf = document["createRange"]();
  _0x462bcf["setStartAfter"](_0x49aa45);
  _0x462bcf["collapse"](!![]);
  _0x455b02["removeAllRanges"]();
  _0x455b02["addRange"](_0x462bcf);
  _updatePromptHtml(_0x5c7a34);
  return !![];
}
function _getDirectMentionItems(_0x594682) {
  return Array['from'](_0x594682?.["children"] || [])['filter'](_0x11583b => _0x11583b["classList"]?.["contains"]('at-mention-item'));
}
function _clearActiveItems(_0xf9ab19) {
  _getDirectMentionItems(_0xf9ab19)["forEach"](_0x2f24db => {
    _0x2f24db["classList"]["remove"]('active');
    _0x2f24db["classList"]["remove"]('at-mention-keyboard-active');
  });
}
function _setActiveMentionItem(_0x59fa10, {
  focusSubmenu = ![],
  keyboard = ![]
} = {}) {
  if (!_0x59fa10) {
    return;
  }
  const _0x3e8d93 = _0x59fa10["parentElement"];
  if (!_0x3e8d93) {
    return;
  }
  _clearActiveItems(_0x3e8d93);
  _0x59fa10['classList']["add"]('active');
  _0x59fa10['classList']["toggle"]("at-mention-keyboard-active", keyboard);
  _mentionMenuState["activeMenu"] = _0x3e8d93;
  _0x59fa10["classList"]["contains"]("at-mention-has-submenu") ? _openMentionSubmenu(_0x59fa10, {
    'focusSubmenu': focusSubmenu
  }) : _closeSiblingMentionSubmenus(_0x59fa10);
}
function _setInitialMentionActiveItem(_0x9d4765, {
  keyboard = ![]
} = {}) {
  const _0x3e6bca = _getDirectMentionItems(_0x9d4765)["find"](_0x3056b6 => !_0x3056b6["classList"]['contains']('at-mention-disabled')) || _getDirectMentionItems(_0x9d4765)[0x0];
  if (_0x3e6bca) {
    _setActiveMentionItem(_0x3e6bca, {
      'keyboard': keyboard
    });
  }
}
function _closeSiblingMentionSubmenus(_0x4cdbac) {
  const _0x2efd0b = _0x4cdbac?.['parentElement'];
  if (!_0x2efd0b) {
    return;
  }
  _getDirectMentionItems(_0x2efd0b)["forEach"](_0x42c116 => {
    if (_0x42c116 === _0x4cdbac) {
      return;
    }
    _0x42c116['classList']['remove']('at-mention-submenu-open');
    _0x42c116["querySelectorAll"](".at-mention-submenu-open")["forEach"](_0x5d9c9c => _0x5d9c9c["classList"]["remove"]("at-mention-submenu-open"));
  });
}
function _positionMentionSubmenu(_0x2d2de0, _0x4222d5) {
  if (!_0x2d2de0 || !_0x4222d5 || typeof _0x2d2de0["getBoundingClientRect"] !== "function") {
    return;
  }
  const _0x127a8f = _0x2d2de0["getBoundingClientRect"]();
  const _0x132c62 = Number(globalThis["window"]?.["innerWidth"] || 0x0);
  const _0x1e8ef0 = Number(globalThis['window']?.['innerHeight'] || 0x0);
  const _0x1b17fd = 0x6;
  const _0x3cd73d = 0xc;
  const _0x3b1954 = _0x4222d5["offsetWidth"] || 0xdc;
  const _0x1dcd18 = _0x4222d5["offsetHeight"] || 0x140;
  let _0x3722a2 = _0x127a8f["right"] + _0x1b17fd;
  _0x132c62 > 0x0 && _0x3722a2 + _0x3b1954 + _0x3cd73d > _0x132c62 && (_0x3722a2 = Math["max"](_0x3cd73d, _0x127a8f["left"] - _0x3b1954 - _0x1b17fd));
  let _0x55ca5f = _0x127a8f["top"];
  _0x1e8ef0 > 0x0 && _0x55ca5f + _0x1dcd18 + _0x3cd73d > _0x1e8ef0 && (_0x55ca5f = Math["max"](_0x3cd73d, _0x1e8ef0 - _0x1dcd18 - _0x3cd73d));
  _0x4222d5["style"]["left"] = Math["round"](_0x3722a2) + 'px';
  _0x4222d5['style']["top"] = Math["round"](_0x55ca5f) + 'px';
  _0x1e8ef0 > 0x0 && (_0x4222d5["style"]['maxHeight'] = Math['max'](0xa0, _0x1e8ef0 - _0x3cd73d * 0x2) + 'px');
}
function _openMentionSubmenu(_0x22804d, {
  focusSubmenu = ![]
} = {}) {
  const _0x5e9828 = Array['from'](_0x22804d?.["children"] || [])["find"](_0x2cd538 => _0x2cd538["classList"]?.["contains"]("at-mention-submenu"));
  if (!_0x5e9828) {
    return ![];
  }
  _closeSiblingMentionSubmenus(_0x22804d);
  _0x22804d['classList']["add"]('at-mention-submenu-open');
  _positionMentionSubmenu(_0x22804d, _0x5e9828);
  focusSubmenu ? (_mentionMenuState["activeMenu"] = _0x5e9828, _setInitialMentionActiveItem(_0x5e9828, {
    'keyboard': !![]
  })) : _mentionMenuState["activeMenu"] = _0x22804d["parentElement"] || _0x5e9828;
  return !![];
}
function _activateMentionMenuItem(_0x9eb28e) {
  if (!_0x9eb28e) {
    return ![];
  }
  if (_0x9eb28e["classList"]["contains"]("at-mention-has-submenu")) {
    return _openMentionSubmenu(_0x9eb28e, {
      'focusSubmenu': !![]
    });
  }
  if (typeof _0x9eb28e["_mentionSelect"] === "function") {
    _0x9eb28e["_mentionSelect"]();
    return !![];
  }
  return ![];
}
function _createMentionMenuItem({
  label = '',
  subtitle = '',
  title = '',
  disabled = ![],
  hasSubmenu = ![],
  thumbUrl = '',
  thumbNode = null,
  iconType = '',
  badges = null,
  compactVisual = ![],
  variantCount = 0x0,
  variantIndex = 0x0,
  onVariantChange = null,
  onSelect = null
} = {}) {
  const _0xeac559 = document["createElement"]('div');
  _0xeac559['className'] = 'at-mention-item' + (disabled ? " at-mention-disabled disabled" : '') + (hasSubmenu ? " at-mention-has-submenu" : '') + (compactVisual ? " at-mention-compact-visual" : '');
  _0xeac559["title"] = title || '';
  const _0x38f83b = Math["max"](0x0, Math['trunc'](Number(variantCount) || 0x0));
  let _0x240b3c = Math["max"](0x0, Math['min'](_0x38f83b - 0x1, Math["trunc"](Number(variantIndex) || 0x0)));
  const _0x286178 = a1164_0x2166b3(iconType);
  let _0x59719c = null;
  let _0x1cdc68 = null;
  if (thumbUrl || thumbNode || _0x38f83b > 0x1 || _0x286178 === "text" || _0x286178 === "audio") {
    _0x59719c = document["createElement"]("span");
    _0x59719c["className"] = "at-mention-visual";
    if (thumbUrl || _0x38f83b > 0x1) {
      _0x1cdc68 = document['createElement']("img");
      _0x1cdc68["className"] = "at-mention-thumb";
      if (thumbUrl) {
        _0x1cdc68["src"] = thumbUrl;
      }
      _0x1cdc68["hidden"] = !thumbUrl;
      _0x1cdc68['alt'] = '';
      _0x1cdc68["draggable"] = ![];
      _0x59719c['appendChild'](_0x1cdc68);
    } else {
      const _0x47dede = _cloneMentionThumbNode(thumbNode, "at-mention-thumb", iconType);
      if (_0x47dede) {
        _0x59719c["appendChild"](_0x47dede);
      }
    }
    if (_0x59719c["childNodes"]["length"]) {
      _0xeac559["appendChild"](_0x59719c);
    }
  }
  const _0x2a0b42 = document["createElement"]("span");
  _0x2a0b42["className"] = "at-mention-copy";
  const _0x3cbd40 = document['createElement']("span");
  _0x3cbd40['className'] = "at-mention-label";
  _0x3cbd40['textContent'] = label;
  _0x2a0b42["appendChild"](_0x3cbd40);
  const _0x3eb0f6 = document["createElement"]("span");
  _0x3eb0f6["className"] = "at-mention-subtitle";
  _0x3eb0f6["textContent"] = subtitle;
  _0x3eb0f6["hidden"] = !subtitle;
  _0x2a0b42["appendChild"](_0x3eb0f6);
  _0xeac559["classList"]["toggle"]("at-mention-has-subtitle", Boolean(subtitle));
  _0xeac559["appendChild"](_0x2a0b42);
  if (Array["isArray"](badges) && badges["length"] > 0x0) {
    const _0x37859f = document['createElement']("span");
    _0x37859f["className"] = "at-mention-badges";
    badges['slice'](0x0, 0x4)['forEach'](_0x188b1d => {
      const _0x499dbe = document["createElement"]('span');
      _0x499dbe['className'] = 'at-mention-badge';
      _0x499dbe["textContent"] = String(_0x188b1d || '');
      _0x37859f["appendChild"](_0x499dbe);
    });
    _0xeac559['appendChild'](_0x37859f);
  }
  if (hasSubmenu) {
    const _0x249a0d = document['createElement']("span");
    _0x249a0d["className"] = "at-mention-arrow";
    _0x249a0d["textContent"] = '>';
    _0xeac559['appendChild'](_0x249a0d);
  }
  let _0xec784 = null;
  let _0xe9b20e = null;
  if (_0x38f83b > 0x1) {
    const _0x4deffa = document["createElement"]("span");
    _0x4deffa["className"] = "at-mention-variant-controls";
    _0xec784 = document["createElement"]("button");
    _0xec784["type"] = "button";
    _0xec784["className"] = 'at-mention-variant-arrow\x20at-mention-variant-arrow--previous';
    _0xec784['setAttribute']("aria-label", '上一个形象');
    _0xe9b20e = document['createElement']("button");
    _0xe9b20e['type'] = "button";
    _0xe9b20e["className"] = "at-mention-variant-arrow at-mention-variant-arrow--next";
    _0xe9b20e["setAttribute"]("aria-label", "下一个形象");
    _0x4deffa["appendChild"](_0xec784);
    _0x4deffa["appendChild"](_0xe9b20e);
    _0xeac559["appendChild"](_0x4deffa);
  }
  const _0x4d22ca = () => {
    if (_0xec784) {
      _0xec784['hidden'] = _0x240b3c <= 0x0;
    }
    _0xe9b20e && (_0xe9b20e["hidden"] = _0x240b3c >= _0x38f83b - 0x1);
    _0xeac559["dataset"]["mentionVariantIndex"] = String(_0x240b3c);
  };
  const _0x37342e = _0x105b43 => {
    const _0x28a49a = Math["max"](0x0, Math['min'](_0x38f83b - 0x1, Math['trunc'](Number(_0x105b43) || 0x0)));
    if (_0x38f83b <= 0x1 || _0x28a49a === _0x240b3c) {
      return ![];
    }
    _0x240b3c = _0x28a49a;
    _0x4d22ca();
    onVariantChange?.(_0x240b3c);
    return !![];
  };
  _0xec784?.["addEventListener"]('mousedown', _0x5d1566 => {
    _0x5d1566["preventDefault"]();
    _0x5d1566["stopPropagation"]();
    _0x37342e(_0x240b3c - 0x1);
  });
  _0xe9b20e?.["addEventListener"]("mousedown", _0x1f5b92 => {
    _0x1f5b92["preventDefault"]();
    _0x1f5b92['stopPropagation']();
    _0x37342e(_0x240b3c + 0x1);
  });
  let _0x35e71c = 0x0;
  _0x38f83b > 0x1 && _0xeac559["addEventListener"]("wheel", _0x57056c => {
    const _0x357481 = Number(_0x57056c["deltaX"] || 0x0);
    const _0x3d11d5 = Number(_0x57056c['deltaY'] || 0x0);
    const _0x59ba56 = Math['abs'](_0x357481) > Math["abs"](_0x3d11d5) ? _0x357481 : _0x3d11d5;
    if (Math["abs"](_0x59ba56) < 0x4) {
      return;
    }
    _0x57056c["preventDefault"]();
    _0x57056c['stopPropagation']();
    const _0x1c721c = Date["now"]();
    if (_0x1c721c - _0x35e71c < 0xa0) {
      return;
    }
    _0x35e71c = _0x1c721c;
    _0x37342e(_0x240b3c + (_0x59ba56 > 0x0 ? 0x1 : -0x1));
  }, {
    'passive': ![]
  });
  _0xeac559["_mentionSetPresentation"] = (_0x56cde5 = {}) => {
    _0x3cbd40["textContent"] = String(_0x56cde5["label"] || '');
    const _0x2c0c8a = String(_0x56cde5['subtitle'] || '');
    _0x3eb0f6["textContent"] = _0x2c0c8a;
    _0x3eb0f6["hidden"] = !_0x2c0c8a;
    _0xeac559['classList']['toggle']('at-mention-has-subtitle', Boolean(_0x2c0c8a));
    if (_0x1cdc68) {
      const _0xfe037 = String(_0x56cde5['thumbUrl'] || '');
      if (_0xfe037) {
        _0x1cdc68["src"] = _0xfe037;
      } else {
        _0x1cdc68["removeAttribute"]?.("src");
      }
      _0x1cdc68["hidden"] = !_0xfe037;
      _0x59719c["hidden"] = ![];
    }
    Number["isFinite"](Number(_0x56cde5["variantIndex"])) && (_0x240b3c = Math["max"](0x0, Math["min"](_0x38f83b - 0x1, Math["trunc"](Number(_0x56cde5["variantIndex"])))));
    Object["hasOwn"](_0x56cde5, 'title') && (_0xeac559["title"] = String(_0x56cde5["title"] || ''));
    if (Object['hasOwn'](_0x56cde5, "disabled")) {
      const _0x2671c2 = _0x56cde5["disabled"] === !![];
      _0xeac559["classList"]["toggle"]("at-mention-disabled", _0x2671c2);
      _0xeac559["classList"]['toggle']("disabled", _0x2671c2);
    }
    _0x4d22ca();
  };
  _0xeac559["_mentionShiftVariant"] = _0xfb9760 => _0x37342e(_0x240b3c + Math["sign"](Number(_0xfb9760) || 0x0));
  _0x4d22ca();
  _0xeac559['_mentionSelect'] = onSelect;
  _0xeac559["addEventListener"]("mouseenter", () => {
    _setActiveMentionItem(_0xeac559);
  });
  _0xeac559["addEventListener"]("mousedown", _0x38a519 => {
    _0x38a519["preventDefault"]();
    _0x38a519["stopPropagation"]();
    _activateMentionMenuItem(_0xeac559);
  });
  return _0xeac559;
}
function _appendMentionCandidateItem(_0x4f0865, _0x1f693a, _0x147bf4, {
  triggerRange = null,
  atIndex = -0x1,
  pillToEdit = null
} = {}) {
  const _0x3e32b5 = Array["isArray"](_0x147bf4["mentionVariants"]) && _0x147bf4["mentionVariants"]["length"] ? _0x147bf4["mentionVariants"]["filter"](Boolean) : [_0x147bf4];
  let _0x5391f2 = Math["max"](0x0, Math["min"](_0x3e32b5['length'] - 0x1, Math["trunc"](Number(_0x147bf4['mentionVariantIndex']) || 0x0)));
  let _0x4415a2 = _0x3e32b5[_0x5391f2] || _0x147bf4;
  let _0x21b879 = null;
  let _0x25a28b = ![];
  let _0x2784e1 = null;
  const _0x323795 = () => {
    _0x21b879?.["_mentionSetPresentation"]?.({
      'label': _0x4415a2['label'] || _0x147bf4["label"],
      'subtitle': _0x4415a2["subtitle"] || _0x147bf4["subtitle"] || '',
      'thumbUrl': _0x4415a2["thumbUrl"] || '',
      'variantIndex': _0x5391f2,
      'title': _0x147bf4["suppressTooltip"] ? '' : _0x4415a2['limitReason'] || '',
      'disabled': !!_0x4415a2["limitReason"]
    });
  };
  _0x21b879 = _createMentionMenuItem({
    'label': _0x4415a2["label"] || _0x147bf4["label"],
    'subtitle': _0x4415a2["subtitle"] || _0x147bf4["subtitle"] || '',
    'title': _0x147bf4["suppressTooltip"] ? '' : _0x4415a2['limitReason'] || '',
    'disabled': !!_0x4415a2['limitReason'],
    'thumbUrl': _0x4415a2["thumbUrl"] || '',
    'thumbNode': _0x4415a2["thumbNode"] || null,
    'iconType': _0x4415a2["iconType"] || _0x4415a2["type"] || '',
    'compactVisual': _0x4415a2["compactVisual"] === !![],
    'variantCount': _0x3e32b5["length"],
    'variantIndex': _0x5391f2,
    'onVariantChange': _0x1ecb37 => {
      _0x5391f2 = _0x1ecb37;
      _0x4415a2 = _0x3e32b5[_0x5391f2] || _0x147bf4;
      _0x323795();
      _0x25a28b && _0x2784e1 && typeof _0x1f693a?.["onMentionCandidateHover"] === "function" && _0x1f693a["onMentionCandidateHover"]({
        'candidate': _0x4415a2,
        'item': _0x21b879,
        'event': _0x2784e1
      });
    },
    'onSelect': () => {
      if (_0x4415a2["limitReason"]) {
        globalThis["window"]?.['showToast']?.(_0x4415a2["limitReason"], "warn");
        return;
      }
      _insertMentionPill(_0x1f693a, {
        'label': _0x4415a2["label"],
        'nodeId': _0x4415a2["nodeId"],
        'candidate': _0x4415a2,
        'triggerRange': triggerRange,
        'atIndex': atIndex,
        'pillToEdit': pillToEdit
      });
      _closeMentionMenu();
    }
  });
  const _0x502893 = () => {
    if (!_0x25a28b) {
      return;
    }
    _0x25a28b = ![];
    _0x2784e1 = null;
    _0x1f693a?.['onMentionCandidateHoverEnd']?.({
      'candidate': _0x4415a2,
      'item': _0x21b879
    });
  };
  const _0x1a8a40 = _0x47ef02 => {
    if (typeof _0x1f693a?.["onMentionCandidateHover"] !== "function") {
      return;
    }
    _0x2784e1 = _0x47ef02;
    if (!_0x25a28b) {
      const _0x1c6f03 = _mentionMenuState["activeCandidateHoverEnd"];
      _mentionMenuState["activeCandidateHoverEnd"] = null;
      _0x1c6f03?.();
      _0x25a28b = !![];
      _mentionMenuState["activeCandidateHoverEnd"] = _0x502893;
    }
    _0x1f693a['onMentionCandidateHover']({
      'candidate': _0x4415a2,
      'item': _0x21b879,
      'event': _0x47ef02
    });
  };
  _0x21b879["addEventListener"]("mouseenter", _0x1a8a40);
  _0x21b879["addEventListener"]("mousemove", _0x1a8a40);
  _0x21b879["addEventListener"]("mouseleave", () => {
    _mentionMenuState["activeCandidateHoverEnd"] === _0x502893 && (_mentionMenuState['activeCandidateHoverEnd'] = null);
    _0x502893();
  });
  _0x147bf4['assetName'] && !_0x147bf4["limitReason"] && !_0x147bf4['suppressTooltip'] && (_0x21b879["title"] = _0x147bf4["assetName"] + " · " + _getAssetTypeMenuLabel(_0x147bf4['type']));
  _0x4f0865["appendChild"](_0x21b879);
  return _0x21b879;
}
function _appendMentionSectionLabel(_0x3afb2a, _0x397531) {
  const _0x382acb = document["createElement"]("div");
  _0x382acb["className"] = "at-mention-section-label";
  _0x382acb["textContent"] = String(_0x397531 || '');
  _0x3afb2a["appendChild"](_0x382acb);
  return _0x382acb;
}
function _appendMentionGroupLabel(_0x1d8235, _0x2337c1) {
  const _0xb8455b = document["createElement"]("div");
  _0xb8455b["className"] = 'at-mention-group-label';
  _0xb8455b["textContent"] = String(_0x2337c1 || '');
  _0x1d8235['appendChild'](_0xb8455b);
  return _0xb8455b;
}
function _getBulkAssetLimitReason(_0x45f38a, _0x31aeea = [], _0x135fe8 = null) {
  const _0x1b8b2e = (Array['isArray'](_0x31aeea) ? _0x31aeea : [])["filter"](_0x624881 => _0x624881?.["origin"] === "asset");
  if (!_0x1b8b2e['length']) {
    return nodePromptSharedText("assetUnavailable");
  }
  const _0x4e6da6 = a1164_0x4309f8["getState"]();
  const _0xc036da = _0x4e6da6["nodes"]?.[_0x45f38a?.["nodeId"]] || _0x45f38a?.["_data"] || {};
  const _0x29af01 = getTargetInputPolicy(_0xc036da);
  if (_isAdvancedVoiceCloneTarget(_0xc036da)) {
    const _0x1757c6 = _getActualAudioInputKeysForTarget(_0x45f38a?.["nodeId"], _0xc036da, _0x4e6da6);
    const _0xd1eb32 = Number(_0x29af01?.["maxByKind"]?.["audio"]);
    for (const _0x50ae6b of _0x1b8b2e) {
      const _0x105af4 = a1164_0x2166b3(_0x50ae6b["type"]);
      if (!_0x105af4) {
        continue;
      }
      if (_0x105af4 !== "audio") {
        const _0x25b738 = getInputLimitReason(_0x29af01, _0x105af4, {});
        if (_0x25b738) {
          return _0x25b738;
        }
        continue;
      }
      const _0x1120b3 = _getMentionAudioInputKey(_0x50ae6b);
      if (_0x1120b3 && _0x1757c6["has"](_0x1120b3)) {
        continue;
      }
      if (Number["isFinite"](_0xd1eb32) && _0x1757c6["size"] >= _0xd1eb32) {
        return getInputLimitReason(_0x29af01, 'audio', {
          'audio': _0x1757c6["size"]
        });
      }
      if (_0x1120b3) {
        _0x1757c6['add'](_0x1120b3);
      }
    }
    return '';
  }
  const _0x9e5fe4 = _getPromptInputCountState(_0x45f38a?.["promptEl"], _0x135fe8 || null, {
    'nodeData': _0xc036da
  });
  const _0x3d5417 = _0x4e6da6['nodes'] || {};
  a1164_0x4309f8["getIncomingEdges"](_0x45f38a?.["nodeId"])["forEach"](_0x240c5a => {
    const _0x526277 = resolveEffectiveInputKind(_0x3d5417?.[_0x240c5a?.["sourceId"]], _0x240c5a);
    _addInputCount(_0x9e5fe4, _0x526277, _getNodeInputCountKey(_0x240c5a?.["sourceId"], _0x526277));
  });
  for (const _0x58e558 of _0x1b8b2e) {
    const _0x5697a6 = a1164_0x2166b3(_0x58e558['type']);
    if (!_0x5697a6) {
      continue;
    }
    if (_canReuseAlreadyCountedInputForLimit(_0x5697a6) && _isMentionAlreadyCounted(_0x9e5fe4, _0x58e558, _0x5697a6)) {
      continue;
    }
    const _0x41a505 = getInputLimitReason(_0x29af01, _0x5697a6, _0x9e5fe4['counts']);
    if (_0x41a505) {
      return _0x41a505;
    }
    _addInputCount(_0x9e5fe4, _0x5697a6, _getMentionInputCountKey(_0x58e558, _0x5697a6));
  }
  return '';
}
function _createMentionPillForCandidate(_0x225319, _0x20f19a = null) {
  const _0x14d0c4 = document["createElement"]("span");
  _0x14d0c4["className"] = "ref-pill";
  _0x14d0c4['contentEditable'] = "false";
  const _0x37d61f = a1164_0x2166b3(_0x225319?.['type']);
  const _0x6f51fc = _stripMentionDisplayMarker(_0x225319?.["pillLabel"] || _0x225319?.['label'] || '');
  const _0x590834 = _stripMentionDisplayMarker(_0x225319?.['refLabel'] || _0x6f51fc);
  _0x14d0c4["dataset"]['label'] = _0x6f51fc;
  if (_0x225319?.['origin'] === "asset") {
    _0x14d0c4["dataset"]['refOrigin'] = "asset";
    _0x14d0c4["dataset"]["assetId"] = String(_0x225319['assetId'] || '');
    _0x14d0c4["dataset"]["assetIndex"] = String(_0x225319["assetIndex"] ?? '');
    _0x14d0c4["dataset"]["refType"] = String(_0x37d61f || _0x225319["type"] || '');
    _renderMentionPillContent(_0x14d0c4, _0x6f51fc, _getMentionVisual(_0x20f19a, _0x225319, _0x14d0c4));
    _applyMentionPillPresentation(_0x14d0c4, _0x225319);
    _decorateMentionPill(_0x20f19a, _0x14d0c4, _0x225319);
    return _0x14d0c4;
  }
  _0x14d0c4["dataset"]["refOrigin"] = "node";
  _0x14d0c4["dataset"]["nodeId"] = String(_0x225319?.["nodeId"] || '');
  if (_0x590834) {
    _0x14d0c4["dataset"]["refLabel"] = _0x590834;
  }
  (_0x37d61f || _0x225319?.["type"]) && (_0x14d0c4['dataset']["refType"] = String(_0x37d61f || _0x225319["type"] || ''));
  _renderMentionPillContent(_0x14d0c4, _0x6f51fc, _getMentionVisual(_0x20f19a, _0x225319, _0x14d0c4));
  _applyMentionPillPresentation(_0x14d0c4, _0x225319);
  _decorateMentionPill(_0x20f19a, _0x14d0c4, _0x225319);
  return _0x14d0c4;
}
function _applyMentionPillPresentation(_0x2f97b9, _0x399a20 = {}) {
  if (!_0x2f97b9) {
    return;
  }
  const _0x3dd149 = String(_0x399a20?.["pillKind"] || '')["trim"]();
  if (_0x3dd149) {
    _0x2f97b9["dataset"]["promptPillKind"] = _0x3dd149;
  } else {
    delete _0x2f97b9["dataset"]["promptPillKind"];
  }
  _0x2f97b9["classList"]?.['toggle']?.("story-time-pill", _0x3dd149 === "time");
  const _0x4f677c = _0x399a20?.["missingAsset"] === !![];
  _0x2f97b9['classList']?.["toggle"]?.('ref-pill--unresolved', _0x4f677c);
  if (_0x4f677c) {
    _0x2f97b9["dataset"]["refUnresolved"] = 'true';
    _0x2f97b9["title"] = "缺少图片素材";
  } else {
    _0x2f97b9["dataset"]?.["refUnresolved"] === "true" && _0x399a20?.["origin"] === "asset" && delete _0x2f97b9["dataset"]["refUnresolved"];
    if (_0x2f97b9["title"] === "缺少图片素材") {
      _0x2f97b9["removeAttribute"]?.('title');
    }
  }
}
export function appendMentionPillToPrompt(_0xeb84e8, _0x567921, {
  focus = !![]
} = {}) {
  const _0x995094 = _0xeb84e8?.["promptEl"];
  if (!_0x995094 || !_0x567921) {
    return null;
  }
  const _0x3fc605 = _createMentionPillForCandidate(_0x567921, _0xeb84e8);
  _bindPromptPill(_0xeb84e8, _0x3fc605);
  const _0x1a844a = Boolean(String(_0x995094["textContent"] || '')["trim"]() || _0x995094["childNodes"]?.["length"]);
  if (_0x1a844a) {
    _0x995094["appendChild"](document["createTextNode"]('\x20'));
  }
  _0x995094["appendChild"](_0x3fc605);
  const _0x47b138 = document['createTextNode']('\u00a0');
  _0x995094['appendChild'](_0x47b138);
  _updatePromptHtml(_0xeb84e8);
  if (focus) {
    const _0x502442 = globalThis["window"]?.["getSelection"]?.();
    const _0x2f2f22 = typeof globalThis['document']?.["createRange"] === "function" ? globalThis['document']["createRange"]() : null;
    _0x502442 && _0x2f2f22 && (_0x2f2f22["setStart"](_0x47b138, _0x47b138["textContent"]["length"]), _0x2f2f22['collapse'](!![]), _0x502442["removeAllRanges"](), _0x502442['addRange'](_0x2f2f22), _0x995094["focus"]?.());
  }
  return _0x3fc605;
}
function _insertMentionPills(_0x53dcf7, _0x42fc67 = [], {
  triggerRange = null,
  atIndex = -0x1,
  pillToEdit = null
} = {}) {
  if (!_0x53dcf7?.["promptEl"]) {
    return ![];
  }
  const _0x356916 = (Array["isArray"](_0x42fc67) ? _0x42fc67 : [])["filter"](Boolean);
  if (!_0x356916["length"]) {
    return ![];
  }
  if (pillToEdit) {
    return _insertMentionPill(_0x53dcf7, {
      'candidate': _0x356916[0x0],
      'pillToEdit': pillToEdit
    });
  }
  const _0x4fdade = _0x356916["filter"](_0x287ee7 => _shouldStoreMentionAsPromptAssetInput(_0x53dcf7, _0x287ee7));
  const _0x1d8920 = _0x356916["filter"](_0xa0d52b => !_shouldStoreMentionAsPromptAssetInput(_0x53dcf7, _0xa0d52b));
  if (!_0x1d8920['length']) {
    const _0x32ce10 = _appendPromptAssetInputRefRecords(_0x53dcf7, _0x4fdade);
    if (!_consumeMentionTriggerText({
      'triggerRange': triggerRange,
      'atIndex': atIndex
    })) {
      return ![];
    }
    return _commitPromptAndAssetInputRefs(_0x53dcf7, _0x32ce10);
  }
  const _0x1c4171 = window["getSelection"]();
  const _0x3cec5c = triggerRange || (_0x1c4171 && _0x1c4171['rangeCount'] ? _0x1c4171["getRangeAt"](0x0) : null);
  if (!_0x3cec5c || _0x3cec5c["startContainer"]["nodeType"] !== Node['TEXT_NODE']) {
    return ![];
  }
  const _0x5e5197 = _0x3cec5c["startContainer"];
  const _0xfbcd7a = String(_0x5e5197["textContent"] || '');
  const _0x169d8d = _0x3cec5c["startOffset"];
  const _0x405608 = Number["isFinite"](atIndex) && atIndex >= 0x0 ? atIndex : _findLastMentionTriggerIndex(_0xfbcd7a, _0x169d8d);
  if (_0x405608 < 0x0) {
    return ![];
  }
  const _0xfa9aeb = document["createTextNode"](_0xfbcd7a["slice"](0x0, _0x405608));
  const _0x4a0167 = document["createTextNode"](_0xfbcd7a["slice"](_0x169d8d));
  const _0x3211ce = _0x5e5197['parentNode'];
  if (!_0x3211ce) {
    return ![];
  }
  _0x3211ce['replaceChild'](_0x4a0167, _0x5e5197);
  const _0x259d42 = [];
  _0x1d8920["forEach"]((_0x13826b, _0x4a180d) => {
    _0x4a180d > 0x0 && _0x3211ce["insertBefore"](document["createTextNode"]('\u00a0'), _0x4a0167);
    const _0x2e11cb = _createMentionPillForCandidate(_0x13826b, _0x53dcf7);
    _bindPromptPill(_0x53dcf7, _0x2e11cb);
    _0x259d42["push"](_0x2e11cb);
    _0x3211ce["insertBefore"](_0x2e11cb, _0x4a0167);
  });
  _0x3211ce["insertBefore"](_0xfa9aeb, _0x259d42[0x0] || _0x4a0167);
  const _0x2c78bc = document['createRange']();
  const _0xfa76c7 = _0x259d42[_0x259d42["length"] - 0x1];
  _0x2c78bc["setStartAfter"](_0xfa76c7);
  _0x2c78bc['collapse'](!![]);
  _0x1c4171["removeAllRanges"]();
  _0x1c4171['addRange'](_0x2c78bc);
  _0x4fdade["length"] ? _commitPromptAndAssetInputRefs(_0x53dcf7, _appendPromptAssetInputRefRecords(_0x53dcf7, _0x4fdade)) : _updatePromptHtml(_0x53dcf7);
  return !![];
}
function _appendMentionDivider(_0x1e535d) {
  const _0x977f50 = document["createElement"]('div');
  _0x977f50["className"] = "at-mention-divider";
  _0x1e535d["appendChild"](_0x977f50);
  return _0x977f50;
}
function _createMentionSubmenu({
  leaf = ![]
} = {}) {
  const _0x2abff2 = document["createElement"]("div");
  _0x2abff2["className"] = 'at-mention-menu\x20at-mention-submenu' + (leaf ? " at-mention-leaf-submenu" : " at-mention-branch-submenu");
  _0x2abff2["addEventListener"]("mouseenter", () => {
    _mentionMenuState['activeMenu'] = _0x2abff2;
  });
  return _0x2abff2;
}
function _populateMentionMenuTree(_0x54f896, _0x52a4dd, _0x14131a, {
  triggerRange = null,
  atIndex = -0x1,
  pillToEdit = null
} = {}) {
  let _0x1d9c09 = '';
  let _0x1702c9 = '';
  let _0xaca64 = 0x0;
  _0x14131a["nodeItems"]["forEach"](_0x5c5d11 => {
    const _0x440b2c = String(_0x5c5d11["menuGroup"] || '')["trim"]();
    const _0x382246 = String(_0x5c5d11["menuSection"] || '')["trim"]();
    if (_0x440b2c && _0x440b2c !== _0x1d9c09) {
      if (_0xaca64 > 0x0) {
        _appendMentionDivider(_0x54f896);
      }
      _appendMentionGroupLabel(_0x54f896, _0x440b2c);
      _0x1702c9 = '';
    }
    _0x1d9c09 = _0x440b2c;
    _0x382246 && _0x382246 !== _0x1702c9 && _appendMentionSectionLabel(_0x54f896, _0x382246);
    _0x1702c9 = _0x382246;
    _appendMentionCandidateItem(_0x54f896, _0x52a4dd, _0x5c5d11, {
      'triggerRange': triggerRange,
      'atIndex': atIndex,
      'pillToEdit': pillToEdit
    });
    _0xaca64 += 0x1;
  });
  _0x14131a["nodeItems"]["length"] && _0x14131a["assetItems"]["length"] && _appendMentionDivider(_0x54f896);
  _0x14131a['assetItems']["forEach"](_0x5dabbd => {
    const _0x30138d = _createMentionMenuItem({
      'label': _0x5dabbd["label"],
      'subtitle': _0x5dabbd["subtitle"],
      'hasSubmenu': !![]
    });
    const _0x4e9c1e = _createMentionSubmenu();
    if (!_0x5dabbd['suppressBulkMention']) {
      const _0x4637f8 = _getBulkAssetLimitReason(_0x52a4dd, _0x5dabbd['items'], pillToEdit);
      const _0x519553 = _createMentionMenuItem({
        'label': nodePromptSharedText("useEntireAsset"),
        'title': _0x4637f8,
        'disabled': !!_0x4637f8,
        'onSelect': () => {
          if (_0x4637f8) {
            globalThis["window"]?.["showToast"]?.(_0x4637f8, "warn");
            return;
          }
          _insertMentionPills(_0x52a4dd, _0x5dabbd['items'], {
            'triggerRange': triggerRange,
            'atIndex': atIndex,
            'pillToEdit': pillToEdit
          });
          _closeMentionMenu();
        }
      });
      _0x4e9c1e['appendChild'](_0x519553);
      _appendMentionDivider(_0x4e9c1e);
    }
    _0x5dabbd['items']['forEach'](_0x5a3c21 => {
      _appendMentionCandidateItem(_0x4e9c1e, _0x52a4dd, _0x5a3c21, {
        'triggerRange': triggerRange,
        'atIndex': atIndex,
        'pillToEdit': pillToEdit
      });
    });
    _0x30138d["appendChild"](_0x4e9c1e);
    _0x54f896['appendChild'](_0x30138d);
  });
}
function _getMentionMenuPages(_0x24f40b, _0x51727d = []) {
  const _0xe5f416 = typeof _0x24f40b?.["getMentionMenuPages"] === "function" ? _0x24f40b["getMentionMenuPages"]({
    'candidates': _0x51727d
  }) : [];
  if (!Array["isArray"](_0xe5f416) || _0xe5f416["length"] < 0x2) {
    return [];
  }
  const _0x443e19 = new Set();
  return _0xe5f416["map"](_0x455a6a => ({
    'id': String(_0x455a6a?.['id'] || '')['trim'](),
    'label': String(_0x455a6a?.['label'] || '')["trim"](),
    'icon': ["assets", "tools"]['includes'](String(_0x455a6a?.["icon"] || '')['trim']()) ? String(_0x455a6a['icon'])["trim"]() : ''
  }))["filter"](_0x4f6925 => {
    if (!_0x4f6925['id'] || !_0x4f6925["label"] || _0x443e19["has"](_0x4f6925['id'])) {
      return ![];
    }
    _0x443e19["add"](_0x4f6925['id']);
    return !![];
  });
}
function _createMentionMenuPageIcon(_0x224044) {
  const _0x3e5a01 = String(_0x224044 || '')["trim"]();
  if (!_0x3e5a01) {
    return null;
  }
  const _0x1ebf26 = document["createElement"]("span");
  _0x1ebf26["className"] = 'at-mention-tab-icon';
  _0x1ebf26["dataset"]["icon"] = _0x3e5a01;
  _0x1ebf26['setAttribute']("aria-hidden", "true");
  _0x1ebf26['innerHTML'] = _0x3e5a01 === "tools" ? "<svg viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M14.7 6.3a4 4 0 0 0-5-5L12 3.6 9.6 6 7.3 3.7a4 4 0 0 0 5 5l-7.7 7.7a2 2 0 1 0 2.8 2.8z\"/><path d=\"m16 15 4.5 4.5\"/></svg>" : "<svg viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M4 6.5h6l1.7 2H20v9.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z\"/><path d=\"M4 9h16\"/></svg>";
  return _0x1ebf26;
}
function _appendMentionMenuPages(_0x4e72ad, _0x578385, _0x4cdbca, _0x3cd7aa) {
  const _0x19147b = _getMentionMenuPages(_0x578385, _0x4cdbca);
  if (_0x19147b["length"] < 0x2) {
    return null;
  }
  const _0x452f3e = document["createElement"]('div');
  _0x452f3e["className"] = "at-mention-tabs";
  _0x452f3e["setAttribute"]("role", "tablist");
  _0x452f3e["setAttribute"]("aria-label", "@ 功能分类");
  _0x4e72ad["appendChild"](_0x452f3e);
  const _0x382717 = document["createElement"]('div');
  _0x382717["className"] = "at-mention-pages";
  const _0x331e47 = document["createElement"]('div');
  _0x331e47["className"] = "at-mention-pages-track";
  _0x331e47['style']["width"] = _0x19147b["length"] * 0x64 + '%';
  _0x331e47["style"]['gridTemplateColumns'] = 'repeat(' + _0x19147b["length"] + ", minmax(0, 1fr))";
  _0x382717['appendChild'](_0x331e47);
  _0x4e72ad["appendChild"](_0x382717);
  const _0x3acb3d = String(_0x578385?.["getMentionMenuDefaultPage"]?.({
    'candidates': _0x4cdbca
  }) || _0x19147b[0x0]['id'])["trim"]();
  const _0x4c0201 = _0x19147b["map"](_0x3d0313 => {
    const _0x8786f3 = _0x4cdbca['filter'](_0x2669b2 => String(_0x2669b2?.['menuPage'] || _0x19147b[0x0]['id'])["trim"]() === _0x3d0313['id']);
    const _0x1b59fa = document["createElement"]("button");
    _0x1b59fa["type"] = "button";
    _0x1b59fa["className"] = "at-mention-tab";
    const _0x4dadaf = _createMentionMenuPageIcon(_0x3d0313['icon']);
    if (_0x4dadaf) {
      _0x1b59fa["appendChild"](_0x4dadaf);
    }
    const _0x188adf = document["createElement"]("span");
    _0x188adf["className"] = "at-mention-tab-label";
    _0x188adf["textContent"] = _0x3d0313["label"];
    _0x1b59fa["appendChild"](_0x188adf);
    _0x1b59fa['dataset']['mentionPage'] = _0x3d0313['id'];
    _0x1b59fa['setAttribute']('role', "tab");
    const _0x5a68cb = document['createElement']("div");
    _0x5a68cb['className'] = "at-mention-page";
    _0x5a68cb["dataset"]["mentionPagePanel"] = _0x3d0313['id'];
    _0x5a68cb["setAttribute"]('role', "tabpanel");
    if (_0x8786f3["length"]) {
      _populateMentionMenuTree(_0x5a68cb, _0x578385, _buildMentionMenuTree(_0x8786f3), _0x3cd7aa);
    } else {
      const _0x387984 = document['createElement']("div");
      _0x387984["className"] = "at-mention-empty";
      _0x387984["textContent"] = "没有匹配的内容";
      _0x5a68cb["appendChild"](_0x387984);
    }
    _0x452f3e["appendChild"](_0x1b59fa);
    _0x331e47['appendChild'](_0x5a68cb);
    return {
      ..._0x3d0313,
      'button': _0x1b59fa,
      'panel': _0x5a68cb,
      'hasCandidates': _0x8786f3["length"] > 0x0
    };
  });
  const _0x4bd8bf = _0x4c0201["find"](_0x411421 => _0x411421['id'] === _0x3acb3d);
  let _0xa28a24 = _0x4bd8bf?.["hasCandidates"] ? _0x4bd8bf : null;
  if (!_0xa28a24) {
    _0xa28a24 = _0x4c0201["find"](_0x11af15 => _0x11af15["hasCandidates"]);
  }
  if (!_0xa28a24) {
    _0xa28a24 = _0x4bd8bf || _0x4c0201[0x0];
  }
  const _0x37c9f5 = (_0x93b495, {
    keyboard = ![]
  } = {}) => {
    if (!_0x93b495) {
      return;
    }
    const _0x137359 = _0x4c0201["indexOf"](_0x93b495);
    _0x4c0201['forEach'](_0x2d6262 => {
      const _0x1d0ad6 = _0x2d6262 === _0x93b495;
      _0x2d6262["button"]["classList"]['toggle']("is-active", _0x1d0ad6);
      _0x2d6262["button"]['setAttribute']("aria-selected", String(_0x1d0ad6));
      _0x2d6262["button"]["tabIndex"] = _0x1d0ad6 ? 0x0 : -0x1;
      _0x2d6262["panel"]["classList"]["toggle"]('is-active', _0x1d0ad6);
      _0x2d6262["panel"]["setAttribute"]("aria-hidden", String(!_0x1d0ad6));
      _0x2d6262["panel"]["inert"] = !_0x1d0ad6;
    });
    _0x331e47["style"]["transform"] = "translateX(" + -_0x137359 * (0x64 / _0x4c0201["length"]) + '%)';
    _mentionMenuState["activeMenu"] = _0x93b495["panel"];
    _setInitialMentionActiveItem(_0x93b495['panel'], {
      'keyboard': keyboard
    });
    _positionMentionMenu();
  };
  _0x4c0201['forEach'](_0xc02b0e => {
    _0xc02b0e["button"]['addEventListener']("mousedown", _0x1aa497 => {
      _0x1aa497["preventDefault"]();
      _0x1aa497["stopPropagation"]();
      _0x37c9f5(_0xc02b0e);
    });
  });
  _0x37c9f5(_0xa28a24);
  return _0xa28a24?.['panel'] || null;
}
export function _populateMentionMenu(_0x43e0c3, {
  x: _0x3bb315,
  y: _0x15e4b8,
  triggerRange = null,
  query = '',
  atIndex = -0x1,
  pillToEdit = null
} = {}) {
  const _0x42dd3d = _getMentionMenu();
  _cleanupMentionMenuLifecycle();
  const _0x508dd8 = _buildMentionCandidates(_0x43e0c3, query, {
    'excludePill': pillToEdit || null
  });
  const _0x5b34de = _buildMentionMenuTree(_0x508dd8);
  _0x42dd3d["innerHTML"] = '';
  _0x42dd3d["classList"]["remove"]("at-mention-paged");
  if (!_0x508dd8["length"]) {
    _closeMentionMenu();
    return ![];
  }
  const _0x3a9a9d = {
    'triggerRange': triggerRange,
    'atIndex': atIndex,
    'pillToEdit': pillToEdit
  };
  const _0x5e412b = _appendMentionMenuPages(_0x42dd3d, _0x43e0c3, _0x508dd8, _0x3a9a9d);
  _0x5e412b ? _0x42dd3d["classList"]["add"]("at-mention-paged") : _populateMentionMenuTree(_0x42dd3d, _0x43e0c3, _0x5b34de, _0x3a9a9d);
  _0x42dd3d['style']["display"] = "flex";
  _0x42dd3d["style"]["pointerEvents"] = "auto";
  _0x42dd3d["style"]["bottom"] = '';
  _0x42dd3d["style"]["marginTop"] = '';
  _0x42dd3d["style"]["marginBottom"] = '';
  _0x42dd3d['style']["transformOrigin"] = '';
  _mentionMenuPositionState = {
    'menu': _0x42dd3d,
    'triggerRange': triggerRange,
    'pillToEdit': pillToEdit,
    'fallbackX': Number(_0x3bb315),
    'fallbackY': Number(_0x15e4b8)
  };
  _positionMentionMenu();
  _mentionMenuState['activeMenu'] = _0x5e412b || _0x42dd3d;
  if (!_0x5e412b) {
    _setInitialMentionActiveItem(_0x42dd3d);
  }
  _watchMentionViewport();
  _bindMentionOutsideDocClick(_0x42dd3d);
  return !![];
}
export function _checkAtTrigger(_0xeac0c, _0x6911d0) {
  if (deferPromptTriggerUntilCompositionEnd({
    'event': _0x6911d0,
    'promptEl': _0xeac0c?.["promptEl"],
    'triggerKey': "mention",
    'onCompositionEnd': () => _checkAtTrigger(_0xeac0c, {})
  })) {
    return ![];
  }
  if (shouldSkipPromptTriggerForBulkInput(_0x6911d0)) {
    _closeMentionMenu();
    return ![];
  }
  const _0x185709 = window["getSelection"]();
  if (!_0x185709['rangeCount']) {
    return ![];
  }
  const _0x2ad3e7 = _0x185709['getRangeAt'](0x0)["cloneRange"]();
  if (_0x2ad3e7["startContainer"]["nodeType"] !== Node["TEXT_NODE"]) {
    _closeMentionMenu();
    return ![];
  }
  const _0x232b45 = String(_0x2ad3e7["startContainer"]["textContent"] || '')["slice"](0x0, _0x2ad3e7["startOffset"]);
  const _0x255eda = _findLastMentionTriggerIndex(_0x232b45);
  if (_0x255eda === -0x1) {
    _closeMentionMenu();
    return ![];
  }
  const _0x8eb934 = _0x232b45["slice"](_0x255eda + 0x1);
  if (_0x8eb934["length"] > 0x14) {
    _closeMentionMenu();
    return ![];
  }
  const _0x2626fc = _0x2ad3e7["getBoundingClientRect"]();
  return _populateMentionMenu(_0xeac0c, {
    'x': _0x2626fc["left"],
    'y': _0x2626fc['bottom'] + 0x5,
    'triggerRange': _0x2ad3e7,
    'query': _0x8eb934,
    'atIndex': _0x255eda
  });
}
export function _handleMentionMenuKeyboard(_0x4c7bf4) {
  const _0x5eea6b = _getMentionMenu();
  if (_0x5eea6b["style"]['display'] !== "flex") {
    return ![];
  }
  const _0x194442 = _mentionMenuState["activeMenu"] || _0x5eea6b;
  const _0x1fcc7f = _getDirectMentionItems(_0x194442);
  if (!_0x1fcc7f['length']) {
    if (_0x4c7bf4["key"] === 'Escape') {
      _0x4c7bf4["preventDefault"]();
      _closeMentionMenu();
      return !![];
    }
    return ![];
  }
  let _0x524020 = _0x1fcc7f["findIndex"](_0x59a4d2 => _0x59a4d2['classList']["contains"]("active"));
  if (_0x524020 < 0x0) {
    _0x524020 = 0x0;
  }
  if (_0x4c7bf4["key"] === "ArrowDown") {
    _0x4c7bf4["preventDefault"]();
    _0x524020 = _0x524020 < _0x1fcc7f["length"] - 0x1 ? _0x524020 + 0x1 : 0x0;
    _setActiveMentionItem(_0x1fcc7f[_0x524020], {
      'keyboard': !![]
    });
    _0x1fcc7f[_0x524020]?.['scrollIntoView']({
      'block': "nearest"
    });
    return !![];
  }
  if (_0x4c7bf4["key"] === "ArrowUp") {
    _0x4c7bf4["preventDefault"]();
    _0x524020 = _0x524020 > 0x0 ? _0x524020 - 0x1 : _0x1fcc7f['length'] - 0x1;
    _setActiveMentionItem(_0x1fcc7f[_0x524020], {
      'keyboard': !![]
    });
    _0x1fcc7f[_0x524020]?.["scrollIntoView"]({
      'block': "nearest"
    });
    return !![];
  }
  if (_0x4c7bf4["key"] === 'ArrowRight') {
    _0x4c7bf4['preventDefault']();
    _0x524020 >= 0x0 && (_0x1fcc7f[_0x524020]?.["_mentionShiftVariant"]?.(0x1) ? _setActiveMentionItem(_0x1fcc7f[_0x524020], {
      'keyboard': !![]
    }) : _openMentionSubmenu(_0x1fcc7f[_0x524020], {
      'focusSubmenu': !![]
    }));
    return !![];
  }
  if (_0x4c7bf4['key'] === "ArrowLeft") {
    _0x4c7bf4['preventDefault']();
    if (_0x524020 >= 0x0 && _0x1fcc7f[_0x524020]?.["_mentionShiftVariant"]?.(-0x1)) {
      _setActiveMentionItem(_0x1fcc7f[_0x524020], {
        'keyboard': !![]
      });
      return !![];
    }
    if (_0x194442 !== _0x5eea6b && _0x194442["parentElement"]) {
      const _0x281523 = _0x194442["parentElement"];
      const _0x1583a1 = _0x281523['parentElement'] || _0x5eea6b;
      _0x281523['classList']["remove"]("at-mention-submenu-open");
      _clearActiveItems(_0x1583a1);
      _0x281523["classList"]['add']("active");
      _0x281523["classList"]["add"]('at-mention-keyboard-active');
      _mentionMenuState['activeMenu'] = _0x1583a1;
    }
    return !![];
  }
  if (_0x4c7bf4["key"] === "Enter") {
    _0x4c7bf4["preventDefault"]();
    if (_0x524020 >= 0x0) {
      _activateMentionMenuItem(_0x1fcc7f[_0x524020]);
    }
    return !![];
  }
  if (_0x4c7bf4['key'] === "Escape") {
    _0x4c7bf4["preventDefault"]();
    _closeMentionMenu();
    return !![];
  }
  return ![];
}
export function _bindPromptPill(_0x253e93, _0x5c0b24) {
  if (!_0x5c0b24) {
    return;
  }
  _0x5c0b24["querySelectorAll"](".pill-del")["forEach"](_0x4aa2c6 => _0x4aa2c6["remove"]());
  const _0x3d7908 = _stripMentionDisplayMarker(String(_0x5c0b24['dataset']["label"] || _0x5c0b24["textContent"] || '')['replace'](/[×✕✖]/g, ''));
  _0x5c0b24['dataset']['label'] = _0x3d7908;
  _renderMentionPillContent(_0x5c0b24, _0x3d7908, _getMentionVisual(_0x253e93, null, _0x5c0b24));
  _decorateMentionPill(_0x253e93, _0x5c0b24, null);
  _0x5c0b24["dataset"]?.["promptPillKind"] === "time" && _0x5c0b24["classList"]?.['add']?.("story-time-pill");
  _0x5c0b24["dataset"]?.["refUnresolved"] === 'true' && _0x5c0b24["classList"]?.['add']?.("ref-pill--unresolved");
  _isUnresolvedInputMentionPill(_0x5c0b24) && (_0x5c0b24["classList"]?.['add']?.("ref-pill--unresolved"), _0x5c0b24["title"] = "Input reference is not bound in this node.");
  _0x5c0b24["onmousedown"] = _0x3f5afd => {
    if (_0x3f5afd["target"]?.["closest"]?.("[data-prompt-pill-inline-editor=\"true\"]")) {
      _0x3f5afd["stopPropagation"]();
      return;
    }
    _0x3f5afd["preventDefault"]();
    _0x3f5afd["stopPropagation"]();
    if (_0x253e93?.["onPromptPillActivate"]?.({
      'pill': _0x5c0b24,
      'event': _0x3f5afd
    }) === !![]) {
      return;
    }
    const _0x2c80ca = _0x5c0b24['getBoundingClientRect']();
    _populateMentionMenu(_0x253e93, {
      'x': _0x2c80ca["left"],
      'y': _0x2c80ca["bottom"] + 0x5,
      'pillToEdit': _0x5c0b24,
      'query': '',
      'atIndex': -0x1,
      'triggerRange': null
    });
  };
}
export function _rehydratePromptPills(_0xe08dc6) {
  if (!_0xe08dc6?.['promptEl']) {
    return;
  }
  _0xe08dc6["promptEl"]["querySelectorAll"](".ref-pill")['forEach'](_0x383753 => {
    _bindPromptPill(_0xe08dc6, _0x383753);
  });
}
const CARET_SPACER_TEXT_RE = /^[\u00A0\u200B\u200C\u200D\uFEFF]*$/;
function _isCaretSpacerTextNode(_0x133ed5) {
  return !!(_0x133ed5 && _0x133ed5["nodeType"] === Node["TEXT_NODE"] && CARET_SPACER_TEXT_RE["test"](String(_0x133ed5['textContent'] || '')));
}
function _findRefPillNearNode(_0x4c86b0, _0x20d03c) {
  let _0x1d886b = _0x4c86b0 || null;
  while (_0x1d886b) {
    if (_isRefPillNode(_0x1d886b)) {
      return _0x1d886b;
    }
    if (!_isCaretSpacerTextNode(_0x1d886b)) {
      return null;
    }
    _0x1d886b = _0x20d03c === "previous" ? _0x1d886b['previousSibling'] : _0x1d886b["nextSibling"];
  }
  return null;
}
function _getSelectedRefPill(_0x2be0ae) {
  const _0x352d6d = _0x2be0ae?.["startContainer"];
  const _0x2ce92b = _0x2be0ae?.['endContainer'];
  if (!_0x352d6d || _0x352d6d !== _0x2ce92b || _0x352d6d["nodeType"] !== Node["ELEMENT_NODE"]) {
    return null;
  }
  if (_0x2be0ae["endOffset"] - _0x2be0ae["startOffset"] !== 0x1) {
    return null;
  }
  return _isRefPillNode(_0x352d6d["childNodes"]?.[_0x2be0ae['startOffset']]) ? _0x352d6d["childNodes"][_0x2be0ae["startOffset"]] : null;
}
export function _handlePillKeyboard(_0x42ea59, _0x160a93) {
  if (!_0x42ea59?.['promptEl']) {
    return ![];
  }
  if (_0x160a93["key"] !== "Backspace" && _0x160a93["key"] !== "Delete") {
    return ![];
  }
  const _0x56cd7c = window["getSelection"]();
  if (!_0x56cd7c["rangeCount"]) {
    return ![];
  }
  const _0x3eed83 = _0x56cd7c['getRangeAt'](0x0);
  if (!_0x3eed83["collapsed"]) {
    const _0x310355 = _getSelectedRefPill(_0x3eed83);
    if (!_0x310355) {
      return ![];
    }
    _0x160a93["preventDefault"]();
    deletePromptMention(_0x42ea59, _0x310355, _0x3eed83, _0x160a93["key"], _updatePromptHtml);
    return !![];
  }
  const _0x4dc8f9 = _0x3eed83['startContainer'];
  const _0x224838 = _0x3eed83['startOffset'];
  let _0x523ea5 = null;
  if (_0x4dc8f9["nodeType"] === Node['TEXT_NODE']) {
    const _0xcc325a = String(_0x4dc8f9["textContent"] || '');
    if (_0x160a93["key"] === "Backspace" && (_0x224838 === 0x0 || CARET_SPACER_TEXT_RE["test"](_0xcc325a["slice"](0x0, _0x224838)))) {
      _0x523ea5 = _findRefPillNearNode(_0x4dc8f9['previousSibling'], 'previous');
    } else {
      _0x160a93["key"] === 'Delete' && (_0x224838 === _0xcc325a["length"] || CARET_SPACER_TEXT_RE["test"](_0xcc325a['slice'](_0x224838))) && (_0x523ea5 = _findRefPillNearNode(_0x4dc8f9["nextSibling"], "next"));
    }
  } else {
    if (_0x4dc8f9['nodeType'] === Node["ELEMENT_NODE"]) {
      if (_0x160a93["key"] === "Backspace" && _0x224838 > 0x0) {
        _0x523ea5 = _findRefPillNearNode(_0x4dc8f9["childNodes"][_0x224838 - 0x1], 'previous');
      } else {
        _0x160a93["key"] === "Delete" && _0x224838 < _0x4dc8f9['childNodes']["length"] && (_0x523ea5 = _findRefPillNearNode(_0x4dc8f9["childNodes"][_0x224838], "next"));
      }
    }
  }
  if (_isRefPillNode(_0x523ea5)) {
    _0x160a93["preventDefault"]();
    deletePromptMention(_0x42ea59, _0x523ea5, _0x3eed83, _0x160a93['key'], _updatePromptHtml);
    return !![];
  }
  return ![];
}
export function _handlePillHover(_0xff5e8c, _0x580be6) {
  const _0x219cdf = _0xff5e8c["target"]["closest"]('.ref-pill');
  if (!_0x219cdf || !_0x580be6['refBarEl']) {
    return;
  }
  const _0x4cb6fb = _0x219cdf["dataset"]['nodeId'];
  if (!_0x4cb6fb) {
    return;
  }
  const _0x4b156c = _0x580be6["refBarEl"]["querySelector"]('.ref-thumb-wrap[data-source-id=\x22' + _0x4cb6fb + '\x22]');
  _0x4b156c && (_0x4b156c["classList"]["add"]("highlight"), _0x4b156c['scrollIntoView']({
    'behavior': "smooth",
    'block': "nearest",
    'inline': "nearest"
  }));
}
export function _handlePillOut(_0x1f809c, _0x429738) {
  const _0x4b2a2d = _0x1f809c["target"]["closest"]('.ref-pill');
  if (!_0x4b2a2d || !_0x429738["refBarEl"]) {
    return;
  }
  const _0x5ccad8 = _0x4b2a2d["dataset"]["nodeId"];
  if (!_0x5ccad8) {
    return;
  }
  const _0x937e75 = _0x429738['refBarEl']["querySelector"](".ref-thumb-wrap[data-source-id=\"" + _0x5ccad8 + '\x22]');
  _0x937e75 && _0x937e75["classList"]["remove"]('highlight');
}
export function _syncEdgesOrderFromPills(_0x366afa, {
  allowReorder = ![]
} = {}) {
  if (deferNodeEditorCommit(_0x366afa?.["promptEl"], 'prompt-edges', () => _syncEdgesOrderFromPills(_0x366afa, {
    'allowReorder': allowReorder
  }))) {
    return ![];
  }
  if (!allowReorder) {
    return ![];
  }
  if (!_0x366afa?.["promptEl"] || typeof _0x366afa["promptEl"]['querySelectorAll'] !== 'function') {
    return ![];
  }
  const _0xd0db38 = Array['from'](_0x366afa["promptEl"]["querySelectorAll"](".ref-pill"));
  if (_0xd0db38['length'] === 0x0) {
    return ![];
  }
  const _0x56ea20 = a1164_0x4309f8["getIncomingEdges"](_0x366afa["nodeId"])["filter"](_0x41a185 => !_0x41a185?.['isGroupShared'] && _0x41a185?.["targetId"] === _0x366afa["nodeId"]);
  if (_0x56ea20["length"] <= 0x1) {
    return ![];
  }
  const _0xb2b804 = _0xd0db38["map"](_0x59da9e => _0x59da9e["dataset"]['nodeId'])["filter"](Boolean);
  if (_0xb2b804["length"] === 0x0) {
    return ![];
  }
  const _0x2dd832 = _0x56ea20["map"](_0x5bc780 => _0x5bc780['id']);
  const _0x4b68f6 = {};
  _0x56ea20["forEach"](_0x493141 => {
    if (!_0x4b68f6[_0x493141["sourceId"]]) {
      _0x4b68f6[_0x493141["sourceId"]] = [];
    }
    _0x4b68f6[_0x493141["sourceId"]]["push"](_0x493141);
  });
  const _0x2e8401 = [];
  _0xb2b804['forEach'](_0x36ba59 => {
    _0x4b68f6[_0x36ba59]?.['length'] > 0x0 && _0x2e8401["push"](_0x4b68f6[_0x36ba59]["shift"]());
  });
  Object["values"](_0x4b68f6)["forEach"](_0x54b758 => _0x2e8401["push"](..._0x54b758));
  const _0x737bce = _0x2e8401["map"](_0x1d25be => _0x1d25be['id']);
  if (JSON["stringify"](_0x2dd832) !== JSON['stringify'](_0x737bce)) {
    _0x366afa["_isDraggingSorting"] = ![];
    a1164_0x4309f8["updateEdgesBatch"](_0x2dd832, _0x2e8401);
    return !![];
  }
  return ![];
}
export function _syncPillLabels(_0x102186, _0x54c588) {
  if (!_0x102186['promptEl']) {
    return;
  }
  const _0x2d93ff = _0x102186["promptEl"]["querySelectorAll"](".ref-pill");
  if (!_0x2d93ff["length"]) {
    return;
  }
  let _0x5e98cc = ![];
  let _0x4e179c = {};
  try {
    _0x4e179c = a1164_0x4309f8["getState"]?.()?.['nodes'] || {};
  } catch {
    _0x4e179c = {};
  }
  _0x2d93ff["forEach"](_0x3544c5 => {
    if (_isAssetMentionPill(_0x3544c5)) {
      return;
    }
    const _0x44bfb9 = _0x3544c5["dataset"]["nodeId"];
    if (!_0x44bfb9) {
      return;
    }
    if (_0x54c588[_0x44bfb9]) {
      const _0x1db313 = _0x54c588[_0x44bfb9];
      const _0x3d4d05 = typeof _0x1db313 === "object" && _0x1db313 !== null ? _stripMentionDisplayMarker(_0x1db313['refLabel'] || _0x1db313["placeholderLabel"] || _0x1db313["label"] || '') : _stripMentionDisplayMarker(_0x1db313);
      const _0xde49eb = typeof _0x1db313 === "object" && _0x1db313 !== null ? _stripMentionDisplayMarker(_0x1db313['displayLabel'] || '') : '';
      const _0x49fb43 = _0xde49eb || _getNodeMentionDisplayLabel(_0x4e179c?.[_0x44bfb9], _0x3d4d05);
      const _0x53dcb1 = _0x3544c5["querySelector"]?.('.ref-pill-label');
      const _0x1ad366 = String(_0x3544c5['dataset']["label"] || _0x53dcb1?.['textContent'] || _0x3544c5["textContent"] || '')["trim"]();
      const _0x3d18dc = _getPromptInputRefLabel(_0x3544c5);
      const _0x390f05 = _getMentionVisual(_0x102186, null, _0x3544c5);
      const _0x49cb0f = _0x1ad366 !== _0x49fb43 || _0x3d18dc !== _0x3d4d05 || !_0x3544c5["querySelector"]?.('.ref-pill-label') || !_isPillVisualCurrent(_0x3544c5, _0x390f05) || !!_0x3544c5["querySelector"]?.('.pill-del');
      if (_0x49cb0f) {
        _0x3544c5["dataset"]["label"] = _0x49fb43;
        if (_0x3d4d05) {
          _0x3544c5["dataset"]["refLabel"] = _0x3d4d05;
        }
        _renderMentionPillContent(_0x3544c5, _0x49fb43, _0x390f05);
        _0x5e98cc = !![];
      }
    } else {
      _0x3544c5["remove"]();
      _0x5e98cc = !![];
    }
  });
  _0x5e98cc && _updatePromptHtml(_0x102186, {
    'renderRefBar': ![]
  });
}