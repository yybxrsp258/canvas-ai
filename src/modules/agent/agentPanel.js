import { findTextModelMenuItem } from '../../components/aigenText/apimartTextModelMenu.js';
import { createAgentConversationActions } from './agentConversationActions.js';
import { createAgentPanelContinuity } from './agentPanelContinuity.js';
import { buildAIGenTextModelMenuMarkup } from '../../components/aigenText/modelSelector.js';
import { createPromptAttachmentButtonHTML } from '../../components/refAttachmentButton.js';
import { closeNodeFooterMenus } from '../../components/shared/nodeFooterControls.js';
import { ADVANCED_SETTINGS_TUNE_ICON_MARKUP } from '../../components/sharedIconMarkup.js';
import { getLocale, onLocaleChange } from '../../i18n/index.js';
import { openImagePreview } from '../imagePreview.js';
import { createLinkCursor, getCursorSize } from '../cursorUtils.js';
import { createReferenceFallbackThumbElement } from '../referenceThumbnailFallback.js';
import { showContextMenu } from '../interaction/contextMenuPresenter.js';
import { bindAgentModelControls } from './agentModelControls.js';
export { commitAgentModelSelection } from './agentModelControls.js';
import { AGENT_CONVERSATION_INPUT_REF_LIMIT as a849_0x5b7fd4, createAgentConversationPresentation, normalizeAgentRenderableMediaUrl as a849_0xbe9f13 } from './agentConversationPresentation.js';
import { AGENT_PANEL_LOCALES as a849_0x527b9b, agentPanelText as a849_0x59861c, formatAgentPanelText as a849_0x5b0a80 } from './agentPanelText.js';
import { agentIconSvg as a849_0x10ac62, createAgentButton as a849_0x285c10, createAgentElement as a849_0x385cc0 } from './agentPanelElements.js';
import { createAgentSkillPanel } from './agentSkillPanel.js';
import { createAgentSkillPicker } from './agentSkillPicker.js';
import { createAgentComposerAttachmentController } from './agentComposerAttachmentController.js';
import { renderAgentConversationChoices } from './agentConversationChoices.js';
export { formatAgentAssistantMarkdown } from './agentConversationPresentation.js';
const AGENT_QUICK_ACTIONS = Object['freeze']([{
  'id': "expand-prompt",
  'labelKey': "quickActionCanvasReviewLabel",
  'promptKey': "quickActionCanvasReviewPrompt"
}, {
  'id': 'canvas-gap-check',
  'labelKey': "quickActionGapCheckLabel",
  'promptKey': 'quickActionGapCheckPrompt'
}, {
  'id': "storyboard-plan",
  'labelKey': "quickActionStoryboardLabel",
  'promptKey': "quickActionStoryboardPrompt"
}, {
  'id': "selected-node-tune",
  'labelKey': "quickActionSelectedTuneLabel",
  'promptKey': 'quickActionSelectedTunePrompt'
}]);
const AGENT_LEGACY_QUICK_ACTIONS = Object["freeze"]([{
  'id': "expand-prompt",
  'labelKey': "legacyQuickActionExpandPromptLabel",
  'promptKey': 'legacyQuickActionExpandPromptPrompt'
}, {
  'id': 'storyboard-plan',
  'labelKey': 'legacyQuickActionStoryboardLabel',
  'promptKey': "legacyQuickActionStoryboardPrompt"
}, {
  'id': 'canvas-gap-check',
  'labelKey': 'legacyQuickActionGapCheckLabel',
  'promptKey': "legacyQuickActionGapCheckPrompt"
}]);
const PLACEHOLDER_ACTION_MESSAGES = Object["freeze"]({
  'upload': "placeholderUpload",
  'custom': "placeholderCustom",
  'skills': 'placeholderSkills'
});
const AGENT_PANEL_WIDTH_STORAGE_KEY = "aiCanvas.agentSidebarWidth.v1";
const AGENT_CUSTOM_QUICK_ACTIONS_STORAGE_KEY = "aiCanvas.agentCustomQuickActions.v1";
const AGENT_CUSTOM_QUICK_ACTIONS_SEEDED_STORAGE_KEY = "aiCanvas.agentCustomQuickActionsSeeded.v1";
const AGENT_CUSTOM_QUICK_ACTIONS_VERSION_STORAGE_KEY = "aiCanvas.agentCustomQuickActionsVersion.v1";
const AGENT_CUSTOM_QUICK_ACTIONS_VERSION = "canvas-defaults-v2";
const AGENT_PANEL_WIDTH_LIMITS = Object["freeze"]({
  'min': 0x230,
  'max': 0x35c
});
const AGENT_CUSTOM_QUICK_ACTION_LIMIT = 0x8;
const AGENT_NOTICE_AUTO_HIDE_MS = 0xc80;
function createAgentPromptAttachmentButton({
  title = '',
  className = ''
} = {}) {
  const _0x1f6579 = document["createElement"]("div");
  _0x1f6579["innerHTML"] = createPromptAttachmentButtonHTML({
    'tooltip': title,
    'stroke': "currentColor",
    'fill': 'var(--white-05)',
    'circleFill': 'currentColor'
  });
  const _0x5fc8d6 = _0x1f6579["firstElementChild"];
  if (_0x5fc8d6) {
    className["split"](/\s+/)["filter"](Boolean)['forEach'](_0x5f5044 => _0x5fc8d6['classList']["add"](_0x5f5044));
    _0x5fc8d6["setAttribute"]("role", "button");
    _0x5fc8d6["tabIndex"] = 0x0;
    return _0x5fc8d6;
  }
  const _0x492294 = a849_0x385cc0("div", ['prompt-attachment-btn', className]["filter"](Boolean)["join"]('\x20'));
  title && (_0x492294["title"] = title, _0x492294['setAttribute']("aria-label", title));
  _0x492294["setAttribute"]("role", "button");
  _0x492294["tabIndex"] = 0x0;
  const _0x4d1d72 = a849_0x385cc0('span', "btn-icon");
  _0x4d1d72["innerHTML"] = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 4l7.07 16.97 2.51-7.39 7.39-2.51L4 4z\" fill=\"var(--white-05)\" /><circle cx=\"20\" cy=\"20\" r=\"2.5\" fill=\"currentColor\" /><path d=\"M12 12 Q 17 12 19 18\" stroke-dasharray=\"3 3\" /></svg>";
  _0x492294["appendChild"](_0x4d1d72);
  return _0x492294;
}
function setEditorText(_0x1b68f3, _0x4223f2 = '') {
  _0x1b68f3['textContent'] = String(_0x4223f2 || '');
  _0x1b68f3["dispatchEvent"]?.(new Event("input", {
    'bubbles': !![]
  }));
}
function getEditorText(_0x1fc6ef) {
  return String(_0x1fc6ef?.["innerText"] || _0x1fc6ef?.['textContent'] || '')["trim"]();
}
function truncateUiText(_0xb3347a, _0x2a8323 = 0x28) {
  const _0x4570e7 = String(_0xb3347a || '')["replace"](/\s+/g, '\x20')["trim"]();
  return _0x4570e7["length"] <= _0x2a8323 ? _0x4570e7 : _0x4570e7["slice"](0x0, Math['max'](0x0, _0x2a8323 - 0x3)) + "...";
}
function writeJsonArrayToStorage(_0x135808, _0x3ca38e, _0x3fafe6) {
  try {
    _0x135808?.['localStorage']?.["setItem"]?.(_0x3ca38e, JSON['stringify'](_0x3fafe6));
  } catch {}
}
function normalizeQuickAction(_0x493f23 = {}, _0x1771b4 = '', _0x10ee9e = getLocale()) {
  const _0x48200e = String(_0x493f23['promptKey'] ? a849_0x59861c(_0x493f23["promptKey"], _0x10ee9e) : _0x493f23["prompt"] || '')["trim"]();
  if (!_0x48200e) {
    return null;
  }
  const _0x440fb8 = String(_0x493f23['id'] || _0x1771b4 || '')['trim']() || "custom-" + Date["now"]();
  const _0x30ba3c = _0x493f23["labelKey"] ? a849_0x59861c(_0x493f23["labelKey"], _0x10ee9e) : _0x493f23['label'];
  return {
    'id': _0x440fb8,
    'label': truncateUiText(_0x30ba3c || _0x48200e, 0x1c),
    'prompt': _0x48200e,
    'custom': _0x493f23["custom"] === !![]
  };
}
function normalizeQuickActionList(_0x232d90 = [], _0x42aca5 = getLocale()) {
  return _0x232d90['map']((_0x4f944f, _0x439892) => normalizeQuickAction(_0x4f944f, 'custom-' + _0x439892, _0x42aca5))['filter'](Boolean)["slice"](0x0, AGENT_CUSTOM_QUICK_ACTION_LIMIT);
}
function getDefaultQuickActions(_0x4f4b79 = getLocale()) {
  return normalizeQuickActionList(AGENT_QUICK_ACTIONS, _0x4f4b79);
}
function getLegacyQuickActions(_0x28af8f = getLocale()) {
  return normalizeQuickActionList(AGENT_LEGACY_QUICK_ACTIONS, _0x28af8f);
}
function isSameQuickActionContent(_0xc702d7 = {}, _0x2e4a63 = {}) {
  return String(_0xc702d7['id'] || '') === String(_0x2e4a63['id'] || '') && String(_0xc702d7["label"] || '') === String(_0x2e4a63["label"] || '') && String(_0xc702d7['prompt'] || '') === String(_0x2e4a63["prompt"] || '');
}
function mergeSeedQuickActions(_0x513c0c = []) {
  const _0x4358a0 = new Set();
  const _0x5bc3e5 = [];
  [...getDefaultQuickActions(), ...normalizeQuickActionList(_0x513c0c)]['forEach'](_0x3df019 => {
    const _0x216c8b = String(_0x3df019?.['id'] || '')["trim"]();
    if (!_0x216c8b || _0x4358a0["has"](_0x216c8b)) {
      return;
    }
    _0x4358a0["add"](_0x216c8b);
    _0x5bc3e5["push"](_0x3df019);
  });
  return _0x5bc3e5["slice"](0x0, AGENT_CUSTOM_QUICK_ACTION_LIMIT);
}
function migrateQuickActionsToCurrentDefaults(_0x136692 = []) {
  const _0xe5604b = getDefaultQuickActions();
  const _0x588e5a = new Map(_0xe5604b['map'](_0x3b97d8 => [_0x3b97d8['id'], _0x3b97d8]));
  const _0x4ee5f0 = new Map(getLegacyQuickActions()["map"](_0x2e6f2f => [_0x2e6f2f['id'], _0x2e6f2f]));
  const _0x3d63db = normalizeQuickActionList(_0x136692)['map'](_0x201a79 => {
    const _0x438ec1 = _0x588e5a["get"](_0x201a79['id']);
    const _0x578509 = _0x4ee5f0['get'](_0x201a79['id']);
    if (_0x438ec1 && _0x578509 && isSameQuickActionContent(_0x201a79, _0x578509)) {
      return _0x438ec1;
    }
    return _0x201a79;
  });
  const _0xd16905 = new Set(_0x3d63db["map"](_0x6ac9aa => _0x6ac9aa['id']));
  _0xe5604b["forEach"](_0x5c825c => {
    if (_0xd16905['has'](_0x5c825c['id'])) {
      return;
    }
    if (_0x4ee5f0["has"](_0x5c825c['id'])) {
      return;
    }
    _0x3d63db["push"](_0x5c825c);
    _0xd16905['add'](_0x5c825c['id']);
  });
  return _0x3d63db["slice"](0x0, AGENT_CUSTOM_QUICK_ACTION_LIMIT);
}
function isKnownDefaultQuickActionContent(_0x35f211 = {}) {
  if (_0x35f211['custom'] === !![]) {
    return ![];
  }
  return a849_0x527b9b["some"](_0xbad612 => [...getDefaultQuickActions(_0xbad612), ...getLegacyQuickActions(_0xbad612)]["some"](_0x231c49 => isSameQuickActionContent(_0x35f211, _0x231c49)));
}
function localizeStoredDefaultQuickActions(_0xab3ce9 = []) {
  const _0x425d79 = new Map(getDefaultQuickActions()["map"](_0x2227ae => [_0x2227ae['id'], _0x2227ae]));
  return normalizeQuickActionList(_0xab3ce9)["map"](_0x1aa235 => {
    const _0x52d8e5 = _0x425d79["get"](_0x1aa235['id']);
    return _0x52d8e5 && isKnownDefaultQuickActionContent(_0x1aa235) ? _0x52d8e5 : _0x1aa235;
  });
}
function readQuickActionsStorage(_0x4b5cc8 = globalThis['window']) {
  try {
    const _0x3bc982 = _0x4b5cc8?.['localStorage']?.['getItem']?.(AGENT_CUSTOM_QUICK_ACTIONS_STORAGE_KEY);
    if (_0x3bc982 == null) {
      return null;
    }
    const _0x22eef5 = JSON["parse"](_0x3bc982);
    return Array["isArray"](_0x22eef5) ? _0x22eef5 : null;
  } catch {
    return null;
  }
}
function markCustomQuickActionsSeeded(_0x3f7c6e = globalThis['window']) {
  try {
    _0x3f7c6e?.['localStorage']?.["setItem"]?.(AGENT_CUSTOM_QUICK_ACTIONS_SEEDED_STORAGE_KEY, "true");
    _0x3f7c6e?.["localStorage"]?.['setItem']?.(AGENT_CUSTOM_QUICK_ACTIONS_VERSION_STORAGE_KEY, AGENT_CUSTOM_QUICK_ACTIONS_VERSION);
  } catch {}
}
function seedCustomQuickActionsIfNeeded(_0x3be90a = globalThis['window']) {
  try {
    const _0x497d87 = _0x3be90a?.["localStorage"]?.["getItem"]?.(AGENT_CUSTOM_QUICK_ACTIONS_SEEDED_STORAGE_KEY) === "true";
    const _0xfe1870 = _0x3be90a?.["localStorage"]?.["getItem"]?.(AGENT_CUSTOM_QUICK_ACTIONS_VERSION_STORAGE_KEY);
    if (_0x497d87 && _0xfe1870 === AGENT_CUSTOM_QUICK_ACTIONS_VERSION) {
      return;
    }
    const _0x32511a = readQuickActionsStorage(_0x3be90a) || [];
    const _0x2d7f38 = _0x497d87 ? migrateQuickActionsToCurrentDefaults(_0x32511a) : mergeSeedQuickActions(_0x32511a);
    writeJsonArrayToStorage(_0x3be90a, AGENT_CUSTOM_QUICK_ACTIONS_STORAGE_KEY, _0x2d7f38);
    markCustomQuickActionsSeeded(_0x3be90a);
  } catch {}
}
function readCustomQuickActions(_0x1e95fb = globalThis['window']) {
  const _0x3d3e34 = readQuickActionsStorage(_0x1e95fb);
  return _0x3d3e34 === null ? getDefaultQuickActions() : localizeStoredDefaultQuickActions(_0x3d3e34);
}
function writeCustomQuickActions(_0x426d23 = [], _0x1069f6 = globalThis["window"]) {
  const _0x5aaf44 = normalizeQuickActionList(_0x426d23);
  writeJsonArrayToStorage(_0x1069f6, AGENT_CUSTOM_QUICK_ACTIONS_STORAGE_KEY, _0x5aaf44);
  markCustomQuickActionsSeeded(_0x1069f6);
  return _0x5aaf44;
}
function inferAgentInputKind(_0x1f2e5a = '') {
  const _0x5dff54 = String(_0x1f2e5a || '')["trim"]();
  if (_0x5dff54["includes"]("image")) {
    return "image";
  }
  if (_0x5dff54["includes"]("video")) {
    return "video";
  }
  if (_0x5dff54["includes"]("audio")) {
    return "audio";
  }
  if (_0x5dff54["includes"]("text")) {
    return "text";
  }
  return _0x5dff54 || "node";
}
function isLikelyRenderableImageUrl(_0x580ac8 = '') {
  const _0x1eccf2 = String(_0x580ac8 || '')["trim"]()["toLowerCase"]();
  if (!_0x1eccf2) {
    return ![];
  }
  if (_0x1eccf2['startsWith']("data:image/")) {
    return !![];
  }
  return /\.(png|jpe?g|webp|gif|bmp|svg|avif)(\?|#|$)/i["test"](_0x1eccf2);
}
function resolveFirstAgentThumbUrl(_0x219cd2 = [], {
  imageLikeOnly = ![]
} = {}) {
  for (const _0x4c8f50 of _0x219cd2) {
    const _0x329905 = a849_0xbe9f13(_0x4c8f50);
    if (imageLikeOnly && !isLikelyRenderableImageUrl(_0x329905)) {
      continue;
    }
    if (_0x329905) {
      return _0x329905;
    }
  }
  return '';
}
function getPrimaryVideoItem(_0x28fd9b = {}) {
  const _0x5dd5f8 = Array["isArray"](_0x28fd9b['videos']) ? _0x28fd9b["videos"] : [];
  if (_0x5dd5f8["length"] === 0x0) {
    return null;
  }
  const _0x2d1bc7 = Number['isFinite'](Number(_0x28fd9b["mainVideoIndex"])) ? Math["max"](0x0, Math["trunc"](Number(_0x28fd9b['mainVideoIndex']))) : 0x0;
  return _0x5dd5f8[_0x2d1bc7] || _0x5dd5f8[0x0] || null;
}
function resolveAgentInputRefThumbUrl(_0x419c22 = {}, _0x25b7eb = inferAgentInputKind(_0x419c22?.['type'])) {
  const _0x5c9197 = String(_0x25b7eb || '')['trim']();
  if (_0x5c9197 === 'audio') {
    return resolveFirstAgentThumbUrl([_0x419c22["thumbUrl"], _0x419c22["thumbnailUrl"], _0x419c22["imageUrl"], _0x419c22['coverUrl'], _0x419c22["posterUrl"], _0x419c22["waveformThumbUrl"], _0x419c22['waveformImageUrl'], _0x419c22["thumbLocalPath"], _0x419c22['posterLocalPath']], {
      'imageLikeOnly': !![]
    });
  }
  if (_0x5c9197 === "video") {
    const _0x474117 = getPrimaryVideoItem(_0x419c22);
    return resolveFirstAgentThumbUrl([_0x474117?.["thumbUrl"], _0x474117?.['thumbLocalPath'], _0x419c22['thumbUrl'], _0x419c22['thumbnailUrl'], _0x419c22['posterUrl'], _0x419c22['videoThumbSrc'], _0x419c22["firstFrameUrl"], _0x419c22["firstFrameThumbUrl"], _0x419c22["imageUrl"], _0x419c22["coverUrl"], _0x419c22["thumbLocalPath"], _0x419c22['posterLocalPath']], {
      'imageLikeOnly': !![]
    });
  }
  return resolveFirstAgentThumbUrl([_0x419c22['thumbUrl'], _0x419c22["thumbnailUrl"], _0x419c22["imageUrl"], _0x419c22['src'], _0x419c22["coverUrl"], _0x419c22["thumbLocalPath"], _0x419c22["displayLocalPath"], _0x419c22["localPath"], _0x419c22["originalLocalPath"]]);
}
function normalizeAgentInputRefFromNode(_0x3e1533 = {}, {
  source = 'canvas'
} = {}) {
  const _0x1ec45e = String(_0x3e1533['id'] || _0x3e1533["nodeId"] || '')["trim"]();
  if (!_0x1ec45e) {
    return null;
  }
  const _0x2c5af2 = String(_0x3e1533['type'] || '')["trim"]();
  const _0x1e844d = inferAgentInputKind(_0x2c5af2);
  const _0x3fc93f = truncateUiText(_0x3e1533["name"] || _0x3e1533["label"] || _0x3e1533["title"] || _0x1ec45e, 0x3c);
  const _0x47c9b5 = Number(_0x3e1533["width"]);
  const _0x545060 = Number(_0x3e1533["height"]);
  const _0x53cbad = {
    'id': _0x1ec45e,
    'nodeId': _0x1ec45e,
    'type': _0x2c5af2,
    'kind': _0x1e844d,
    'name': _0x3fc93f,
    'label': _0x3fc93f,
    'source': source,
    'thumbUrl': resolveAgentInputRefThumbUrl(_0x3e1533, _0x1e844d)
  };
  if (Number["isFinite"](_0x47c9b5) && _0x47c9b5 > 0x0) {
    _0x53cbad["width"] = Math["round"](_0x47c9b5);
  }
  if (Number["isFinite"](_0x545060) && _0x545060 > 0x0) {
    _0x53cbad["height"] = Math["round"](_0x545060);
  }
  return _0x53cbad;
}
function isAgentMaterialRef(_0x2e4cda = {}) {
  return ['image', 'video', 'audio', "text"]["includes"](String(_0x2e4cda['kind'] || ''));
}
function getImageFileFromClipboardData(_0x8fb812 = null) {
  const _0x94bce8 = Array["from"](_0x8fb812?.["files"] || []);
  const _0x2fdfc6 = _0x94bce8["find"](_0x159392 => String(_0x159392?.["type"] || '')["startsWith"]('image/'));
  if (_0x2fdfc6) {
    return _0x2fdfc6;
  }
  const _0x297d0c = Array["from"](_0x8fb812?.['items'] || []);
  for (const _0x26230c of _0x297d0c) {
    if (String(_0x26230c?.["kind"] || '') !== "file") {
      continue;
    }
    if (!String(_0x26230c?.["type"] || '')["startsWith"]('image/')) {
      continue;
    }
    const _0x1aafcb = _0x26230c["getAsFile"]?.();
    if (_0x1aafcb) {
      return _0x1aafcb;
    }
  }
  return null;
}
function normalizePastedImageFile(_0x41c7e7 = null) {
  if (!_0x41c7e7 || !String(_0x41c7e7["type"] || '')['startsWith']("image/")) {
    return null;
  }
  if (String(_0x41c7e7["name"] || '')["trim"]()) {
    return _0x41c7e7;
  }
  try {
    const _0x1ebf89 = String(_0x41c7e7["type"] || '')['split']('/')[0x1] || "png";
    return new File([_0x41c7e7], 'agent-paste-image.' + _0x1ebf89, {
      'type': _0x41c7e7["type"]
    });
  } catch {
    return _0x41c7e7;
  }
}
function getStoreState(_0xfa4722) {
  return _0xfa4722?.['getStateRaw']?.() || _0xfa4722?.["getState"]?.() || {};
}
function clampAgentSidebarWidth(_0x731226, _0x2abeaf = globalThis["window"]?.["innerWidth"]) {
  const _0x1810cb = Number(_0x731226);
  const _0x5bc8dc = Number["isFinite"](Number(_0x2abeaf)) ? Math["max"](0x140, Number(_0x2abeaf) - 0x18) : AGENT_PANEL_WIDTH_LIMITS["max"];
  const _0x2f0ddb = Math["min"](AGENT_PANEL_WIDTH_LIMITS["max"], _0x5bc8dc);
  const _0x50f9b1 = Math["min"](AGENT_PANEL_WIDTH_LIMITS["min"], _0x2f0ddb);
  return Math["max"](_0x50f9b1, Math['min'](_0x2f0ddb, _0x1810cb));
}
function readStoredSidebarWidth(_0x707b4c = globalThis["window"]) {
  const _0x414903 = Number(_0x707b4c?.["localStorage"]?.["getItem"]?.(AGENT_PANEL_WIDTH_STORAGE_KEY));
  return Number["isFinite"](_0x414903) && _0x414903 > 0x0 ? _0x414903 : null;
}
function writeStoredSidebarWidth(_0x3d5394, _0x2b93d8 = globalThis['window']) {
  try {
    _0x2b93d8?.["localStorage"]?.['setItem']?.(AGENT_PANEL_WIDTH_STORAGE_KEY, String(Math['round'](_0x3d5394)));
  } catch {}
}
export function normalizeAgentSidebarWidth(_0x1fcec2, _0x1729fc) {
  return clampAgentSidebarWidth(_0x1fcec2, _0x1729fc);
}
export function normalizeAgentExecutionMode(_0x48a338) {
  return String(_0x48a338 || '')['trim']() === "auto" ? 'auto' : "manual";
}
export function getAgentExecutionModeLabel(_0x32e050) {
  return normalizeAgentExecutionMode(_0x32e050) === "auto" ? a849_0x59861c('executionModeAuto') : a849_0x59861c("executionModeManual");
}
export function getAgentPlaceholderActionMessage(_0x1889c5) {
  const _0x4f65d3 = PLACEHOLDER_ACTION_MESSAGES[_0x1889c5] || "placeholderFallback";
  return a849_0x59861c(_0x4f65d3);
}
export function resolveAgentModelLabel(_0x312ef8) {
  const _0x31f497 = String(_0x312ef8 || '')['trim']();
  if (!_0x31f497) {
    return a849_0x59861c("modelSelection");
  }
  return findTextModelMenuItem(_0x31f497)?.["title"] || _0x31f497;
}
function getCreateActionLabel(_0x3b1fd7) {
  const _0x47c732 = String(_0x3b1fd7 || '');
  if (_0x47c732 === "ai-image") {
    return a849_0x59861c('nodeCreateImage');
  }
  if (_0x47c732 === "ai-video") {
    return a849_0x59861c("nodeCreateVideo");
  }
  if (_0x47c732 === "ai-audio") {
    return a849_0x59861c('nodeCreateAudio');
  }
  if (_0x47c732 === "ai-text" || _0x47c732 === "source-text") {
    return a849_0x59861c('nodeCreateText');
  }
  return a849_0x59861c('nodeCreate');
}
function formatActionSummary(_0x3ef8a9 = {}) {
  if (_0x3ef8a9["label"]) {
    const _0x4878cc = [];
    if (_0x3ef8a9["promptSummary"]) {
      _0x4878cc["push"]('“' + _0x3ef8a9["promptSummary"] + '”');
    }
    Number["isFinite"](Number(_0x3ef8a9["args"]?.["gap"])) && _0x4878cc["push"](a849_0x5b0a80('gapValue', {
      'value': Number(_0x3ef8a9["args"]["gap"])
    }));
    return _0x4878cc['length'] ? _0x3ef8a9["label"] + '：' + _0x4878cc["join"]('，') : _0x3ef8a9['label'];
  }
  const _0x42b832 = String(_0x3ef8a9["type"] || '');
  const _0x152170 = _0x3ef8a9["args"] || {};
  const _0x760c1b = _0x42b832 === "node.create" ? getCreateActionLabel(_0x152170["type"]) : _0x42b832 === "node.setPrompt" || _0x42b832 === "node.appendPrompt" ? a849_0x59861c('nodeSetPrompt') : _0x42b832 === "node.setParams" ? a849_0x59861c("nodeSetParams") : _0x42b832 === "graph.connect" ? a849_0x59861c("graphConnect") : _0x42b832 === "layout.arrangeRow" ? a849_0x59861c("layoutArrangeRow") : _0x42b832 === "layout.align" ? a849_0x59861c("layoutAlign") : _0x42b832 === 'generation.run' ? a849_0x59861c('generate') : _0x42b832 === "generation.runBatch" ? a849_0x59861c("generateBatch") : _0x42b832 === 'node.delete' ? a849_0x59861c("nodeDelete") : _0x42b832;
  const _0x4b9cc8 = [];
  const _0x4d3fae = _0x152170['prompt'] || _0x152170["text"];
  if (_0x4d3fae) {
    _0x4b9cc8['push']('“' + String(_0x4d3fae)["slice"](0x0, 0x24) + '”');
  }
  Number["isFinite"](Number(_0x152170['gap'])) && _0x4b9cc8["push"](a849_0x5b0a80('gapValue', {
    'value': Number(_0x152170["gap"])
  }));
  return _0x4b9cc8["length"] ? _0x760c1b + '：' + _0x4b9cc8['join']('，') : _0x760c1b;
}
function readParamControlValue(_0x341f76, _0x54a1fa = {}) {
  const _0x3e4c6d = String(_0x54a1fa["type"] || '')["toLowerCase"]();
  if (_0x3e4c6d === "toggle") {
    return _0x341f76["checked"] === !![];
  }
  if (_0x3e4c6d === "slider" || _0x3e4c6d === 'stepper') {
    const _0x1ec5dc = Number(_0x341f76['value']);
    return Number["isFinite"](_0x1ec5dc) ? _0x1ec5dc : _0x341f76['value'];
  }
  return _0x341f76["value"];
}
function getSelectedParamOption(_0x539ae7 = {}) {
  const _0x4d7312 = _0x539ae7["value"];
  return (Array["isArray"](_0x539ae7['options']) ? _0x539ae7["options"] : [])["find"](_0x2a8e45 => String(_0x2a8e45?.["value"] ?? '') === String(_0x4d7312 ?? '')) || null;
}
function getParamOptionLabel(_0x319efc = {}, {
  selected = ![]
} = {}) {
  const _0x98ce75 = selected ? _0x319efc['displayLabel'] ?? _0x319efc['selectedLabel'] ?? _0x319efc["label"] : _0x319efc["label"] ?? _0x319efc["selectedLabel"] ?? _0x319efc["displayLabel"];
  return String(_0x98ce75 ?? '');
}
function createParamControl(_0x4d69cc = {}, _0x154eab = null, _0x507687 = null) {
  const _0xc3c7b0 = String(_0x4d69cc['id'] || '')["trim"]();
  if (!_0xc3c7b0) {
    return null;
  }
  const _0x1b635f = a849_0x385cc0("div", "agent-param-control");
  _0x1b635f["dataset"]["agentParamId"] = _0xc3c7b0;
  const _0x5e9bb4 = String(_0x4d69cc["label"] || '')["trim"]();
  if (!_0x5e9bb4) {
    return null;
  }
  _0x1b635f["appendChild"](a849_0x385cc0("span", "agent-param-label", _0x5e9bb4));
  const _0x4d79f1 = String(_0x4d69cc['type'] || '')["toLowerCase"]();
  let _0xee2891;
  let _0x291f54 = _0x5e9bb4;
  if (Array['isArray'](_0x4d69cc["options"]) && _0x4d69cc["options"]["length"] > 0x0) {
    _0xee2891 = a849_0x285c10("agent-param-input agent-param-select-trigger", '');
    _0xee2891["value"] = _0x4d69cc["value"];
    _0xee2891["setAttribute"]("aria-haspopup", "menu");
    _0xee2891["setAttribute"]("aria-expanded", "false");
    const _0x377ca2 = getSelectedParamOption(_0x4d69cc);
    const _0x327b17 = _0x377ca2 ? getParamOptionLabel(_0x377ca2, {
      'selected': !![]
    }) : '—';
    _0x291f54 = _0x5e9bb4 + '：' + _0x327b17;
    _0xee2891["append"](a849_0x385cc0("span", 'agent-param-select-value', _0x327b17), a849_0x385cc0("span", 'agent-caret\x20agent-param-select-caret'));
    const _0x176ea3 = _0xee2891["querySelector"](".agent-param-select-caret");
    _0x176ea3 && (_0x176ea3["innerHTML"] = '<svg\x20width=\x2210\x22\x20height=\x2210\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22><polyline\x20points=\x226\x209\x2012\x2015\x2018\x209\x22></polyline></svg>');
    _0xee2891['addEventListener']("click", _0xd91a1e => {
      _0xd91a1e["preventDefault"]?.();
      _0xd91a1e["stopPropagation"]?.();
      _0x507687?.({
        'trigger': _0xee2891,
        'field': _0x4d69cc,
        'onSelect': _0x3e5157 => _0x154eab?.(_0xc3c7b0, _0x3e5157, _0x4d69cc)
      });
    });
  } else {
    if (_0x4d79f1 === 'toggle') {
      _0xee2891 = a849_0x385cc0('input', "agent-param-input agent-param-checkbox");
      _0xee2891["type"] = "checkbox";
      _0xee2891["checked"] = _0x4d69cc['value'] === !![];
    } else {
      _0xee2891 = a849_0x385cc0('input', "agent-param-input agent-param-number");
      _0xee2891["type"] = _0x4d79f1 === 'slider' || _0x4d79f1 === "stepper" ? "number" : 'text';
      _0xee2891["value"] = String(_0x4d69cc["value"] ?? '');
      if (_0x4d69cc["min"] !== undefined) {
        _0xee2891["setAttribute"]("min", _0x4d69cc["min"]);
      }
      if (_0x4d69cc["max"] !== undefined) {
        _0xee2891["setAttribute"]("max", _0x4d69cc["max"]);
      }
      if (_0x4d69cc["step"] !== undefined) {
        _0xee2891["setAttribute"]("step", _0x4d69cc["step"]);
      }
    }
  }
  _0xee2891["dataset"]['agentParamId'] = _0xc3c7b0;
  _0xee2891['setAttribute']('aria-label', _0x291f54);
  (!Array["isArray"](_0x4d69cc["options"]) || _0x4d69cc["options"]["length"] === 0x0) && _0xee2891["addEventListener"]("change", () => {
    _0x154eab?.(_0xc3c7b0, readParamControlValue(_0xee2891, _0x4d69cc), _0x4d69cc);
  });
  _0x1b635f['appendChild'](_0xee2891);
  return _0x1b635f;
}
function isAdvancedEditableParam(_0x491c2f = {}) {
  return String(_0x491c2f["placement"] || '')['trim']()["toLowerCase"]()["endsWith"]("advanced");
}
function renderEditableParams(_0x508e18, _0x15e59a = [], _0x42680b = null, _0x125d1f = null, {
  advancedExpanded = ![],
  onAdvancedExpandedChange = null
} = {}) {
  if (!Array["isArray"](_0x15e59a) || _0x15e59a["length"] === 0x0) {
    return;
  }
  const _0x356b47 = _0x15e59a['filter'](isAdvancedEditableParam);
  const _0x111e59 = _0x15e59a['filter'](_0x9c1edf => !isAdvancedEditableParam(_0x9c1edf));
  const _0x4b813d = a849_0x385cc0("div", 'agent-param-editor');
  _0x4b813d["appendChild"](a849_0x385cc0("div", 'agent-plan-group-title', a849_0x59861c("editableParams")));
  const _0x503c5b = (_0x3d0091, _0x4e73cd = "agent-param-list") => {
    if (_0x3d0091["length"] === 0x0) {
      return null;
    }
    const _0x4e3b47 = a849_0x385cc0('div', _0x4e73cd);
    _0x3d0091["map"](_0x47ace7 => createParamControl(_0x47ace7, _0x42680b, _0x125d1f))["filter"](Boolean)["forEach"](_0xb15b5c => _0x4e3b47["appendChild"](_0xb15b5c));
    _0x4b813d["appendChild"](_0x4e3b47);
    return _0x4e3b47;
  };
  _0x503c5b(_0x111e59);
  if (_0x356b47["length"] > 0x0) {
    const _0x5a7450 = a849_0x385cc0("button", "agent-param-advanced-toggle advanced-settings-icon-button");
    const _0x1b209b = a849_0x59861c('advancedSettings');
    _0x5a7450["type"] = 'button';
    _0x5a7450["setAttribute"]("aria-expanded", advancedExpanded ? "true" : "false");
    _0x5a7450["setAttribute"]("aria-label", _0x1b209b);
    _0x5a7450["dataset"]["tooltip"] = _0x1b209b;
    const _0xf94a59 = a849_0x385cc0("span", 'agent-param-advanced-icon');
    _0xf94a59["setAttribute"]("aria-hidden", "true");
    _0xf94a59['innerHTML'] = ADVANCED_SETTINGS_TUNE_ICON_MARKUP;
    _0x5a7450["append"](_0xf94a59, a849_0x385cc0("span", 'agent-param-advanced-caret', '⌄'));
    _0x5a7450['querySelector'](".agent-param-advanced-caret")?.["setAttribute"]('aria-hidden', "true");
    _0x4b813d["appendChild"](_0x5a7450);
    const _0x446343 = _0x503c5b(_0x356b47, "agent-param-list agent-param-advanced-list");
    _0x446343["hidden"] = !advancedExpanded;
    _0x5a7450['addEventListener']("click", () => {
      const _0x4ad709 = _0x446343["hidden"];
      _0x446343["hidden"] = !_0x4ad709;
      _0x5a7450["setAttribute"]('aria-expanded', _0x4ad709 ? "true" : "false");
      onAdvancedExpandedChange?.(_0x4ad709);
    });
  } else {
    onAdvancedExpandedChange?.(![]);
  }
  _0x508e18["appendChild"](_0x4b813d);
}
function renderActionGroup(_0x10e332, _0x52db12, _0x1cafca = []) {
  if (!Array["isArray"](_0x1cafca) || _0x1cafca['length'] === 0x0) {
    return;
  }
  const _0x1d1a13 = a849_0x385cc0("div", "agent-plan-group");
  _0x1d1a13["appendChild"](a849_0x385cc0("div", "agent-plan-group-title", _0x52db12));
  const _0x41ad09 = a849_0x385cc0("div", "agent-plan-list");
  _0x1cafca["forEach"](_0x2ed0da => {
    _0x41ad09["appendChild"](a849_0x385cc0("div", 'agent-plan-item', formatActionSummary(_0x2ed0da)));
  });
  _0x1d1a13["appendChild"](_0x41ad09);
  _0x10e332['appendChild'](_0x1d1a13);
}
function renderTraceSummary(_0x3a424e, _0x4f431b, _0x15a2cb = []) {
  if (!Array["isArray"](_0x15a2cb) || _0x15a2cb['length'] === 0x0) {
    return;
  }
  const _0x42811b = a849_0x385cc0("div", 'agent-plan-group');
  _0x42811b["appendChild"](a849_0x385cc0("div", 'agent-plan-group-title', _0x4f431b));
  const _0x52452e = a849_0x385cc0('div', "agent-plan-list");
  _0x15a2cb['forEach'](_0x3ce41d => {
    _0x52452e["appendChild"](a849_0x385cc0("div", "agent-plan-item", _0x3ce41d));
  });
  _0x42811b["appendChild"](_0x52452e);
  _0x3a424e['appendChild'](_0x42811b);
}
function renderPlanPreview(_0x40bb51, _0x52d802, {
  onParamChange = null,
  onOpenParamOptions = null
} = {}) {
  _0x40bb51["replaceChildren"]();
  if (!_0x52d802) {
    delete _0x40bb51["dataset"]['agentAdvancedExpanded'];
    _0x40bb51["hidden"] = !![];
    return;
  }
  const _0x4faa9f = _0x52d802["confirmationSummary"] || null;
  const _0xcaa6dd = Array["isArray"](_0x52d802["actions"]) ? _0x52d802["actions"] : [];
  if (!_0x4faa9f && _0xcaa6dd["length"] === 0x0) {
    _0x40bb51["hidden"] = !![];
    return;
  }
  _0x40bb51["hidden"] = ![];
  const _0x3b5720 = a849_0x385cc0("div", 'agent-plan-title', a849_0x59861c("confirmTitle"));
  const _0x5e7bf5 = a849_0x385cc0("div", 'agent-plan-body');
  if (_0x4faa9f) {
    renderActionGroup(_0x5e7bf5, a849_0x59861c("completed"), _0x4faa9f["completedActions"] || []);
    renderActionGroup(_0x5e7bf5, a849_0x59861c("pending"), _0x4faa9f["pendingActions"] || []);
    renderTraceSummary(_0x5e7bf5, a849_0x59861c("traceSummary"), _0x4faa9f['debugTraceSummary'] || []);
    if (_0x4faa9f["generation"]) {
      const _0x4221e7 = a849_0x385cc0("div", "agent-plan-meta");
      [[a849_0x59861c('batchNodes'), Number(_0x4faa9f['generation']["batchSize"] || 0x0) > 0x1 ? '' + _0x4faa9f["generation"]['batchSize'] : ''], [a849_0x59861c('model'), _0x4faa9f['generation']["modelLabel"] || _0x4faa9f["generation"]["model"] || ''], [a849_0x59861c('prompt'), _0x4faa9f['generation']['promptSummary'] || ''], [a849_0x59861c('inputSource'), _0x4faa9f['generation']["inputSource"] || '']]["forEach"](([_0x23ff16, _0x1cb7c8]) => {
        if (!_0x1cb7c8) {
          return;
        }
        const _0x25fad6 = a849_0x385cc0("div", "agent-plan-meta-row");
        _0x25fad6["append"](a849_0x385cc0("span", "agent-plan-meta-label", _0x23ff16), a849_0x385cc0("span", 'agent-plan-meta-value', _0x1cb7c8));
        _0x4221e7["appendChild"](_0x25fad6);
      });
      _0x5e7bf5["appendChild"](_0x4221e7);
      renderEditableParams(_0x5e7bf5, _0x4faa9f["generation"]["editableParams"] || [], onParamChange, onOpenParamOptions, {
        'advancedExpanded': _0x40bb51["dataset"]["agentAdvancedExpanded"] === "true",
        'onAdvancedExpandedChange': _0x16667b => {
          _0x40bb51["dataset"]["agentAdvancedExpanded"] = _0x16667b ? 'true' : 'false';
        }
      });
    }
    _0x4faa9f["cancelNotice"] && _0x5e7bf5["appendChild"](a849_0x385cc0("div", "agent-plan-notice", _0x4faa9f["cancelNotice"]));
  } else {
    const _0x331982 = a849_0x385cc0("div", "agent-plan-list");
    _0xcaa6dd["forEach"](_0x1a0a60 => {
      _0x331982["appendChild"](a849_0x385cc0("div", 'agent-plan-item', formatActionSummary(_0x1a0a60)));
    });
    _0x5e7bf5["appendChild"](_0x331982);
  }
  _0x40bb51["append"](_0x3b5720, _0x5e7bf5);
}
function renderRecovery(_0x296ed7, _0x2500eb, _0xed8f3f, _0x2d7537, _0x1e31ae = null, {
  editor = null,
  setNotice = null
} = {}) {
  _0x296ed7["replaceChildren"]();
  const _0x5b71ce = _0x2500eb?.["recovery"] || null;
  const _0x224966 = Array["isArray"](_0x5b71ce?.['options']) ? _0x5b71ce["options"] : [];
  _0x296ed7["hidden"] = _0x224966["length"] === 0x0;
  if (_0x224966['length'] === 0x0) {
    return;
  }
  _0x296ed7["appendChild"](a849_0x385cc0("div", "agent-recovery-title", a849_0x59861c('recoveryTitle')));
  const _0x58849c = a849_0x385cc0("div", 'agent-recovery-actions');
  for (const _0x34b66c of _0x224966) {
    const _0x53c053 = a849_0x385cc0('button', 'agent-recovery-btn', _0x34b66c["label"] || _0x34b66c['id']);
    _0x53c053["type"] = 'button';
    _0x53c053["dataset"]["recoveryAction"] = _0x34b66c['id'];
    _0x53c053["addEventListener"]("click", async () => {
      const _0x49c36e = String(_0x34b66c['id'] || '');
      if (_0x49c36e === "editPrompt") {
        setEditorText(editor, a849_0x59861c("recoveryEditPromptDraft"));
        editor?.['focus']?.();
        setNotice?.(a849_0x59861c("recoveryEditPromptNotice"));
        _0x296ed7['hidden'] = !![];
        return;
      }
      if (_0x49c36e === "changeModel") {
        setEditorText(editor, a849_0x59861c("recoveryChangeModelDraft"));
        editor?.['focus']?.();
        setNotice?.(a849_0x59861c("recoveryChangeModelNotice"));
        _0x296ed7["hidden"] = !![];
        return;
      }
      if (_0x49c36e === "editRequest") {
        setEditorText(editor, _0x34b66c["draft"] || '');
        editor?.["focus"]?.();
        setNotice?.(a849_0x59861c("recoveryEditRequestNotice"));
        _0x296ed7["hidden"] = !![];
        return;
      }
      _0x1e31ae?.(!![], {
        'stoppable': !![]
      });
      try {
        const _0x55530a = _0x49c36e === "keepPrepared" ? await _0xed8f3f['keepPreparedPlan']?.() : _0x49c36e === "retryPlanner" ? await _0xed8f3f["retryPlannerRun"]?.() : await _0xed8f3f['retryFailedPlan']?.();
        _0x2d7537(_0x55530a || {
          'ok': ![],
          'status': "failed",
          'reply': 'Recovery\x20failed.'
        });
      } catch (_0xad0a4a) {
        _0x2d7537({
          'ok': ![],
          'status': "failed",
          'reply': _0xad0a4a?.['message'] || "Agent recovery failed."
        });
      } finally {
        _0x1e31ae?.(![], {
          'stoppable': ![]
        });
      }
    });
    _0x58849c["appendChild"](_0x53c053);
  }
  _0x296ed7["appendChild"](_0x58849c);
}
function formatHistoryTime(_0x8d208c) {
  const _0x32d56f = new Date(Number(_0x8d208c) || Date["now"]());
  return _0x32d56f['toLocaleString'](getLocale(), {
    'month': 'numeric',
    'day': "numeric",
    'hour': "2-digit",
    'minute': "2-digit"
  });
}
function getLastMessageSummary(_0x2d1622 = {}) {
  const _0x23e1e8 = Array["isArray"](_0x2d1622["messages"]) ? _0x2d1622["messages"] : [];
  const _0x27074d = _0x23e1e8[_0x23e1e8["length"] - 0x1] || null;
  return String(_0x27074d?.['content'] || _0x2d1622["lastPlanSummary"] || _0x2d1622["title"] || '')["trim"]();
}
function renderHistory(_0x508a02, _0x499e05, {
  onSelect = null,
  onDelete = null
} = {}) {
  _0x508a02["replaceChildren"]();
  const _0x406738 = a849_0x385cc0("div", "agent-history-title", a849_0x59861c("historyTitle"));
  const _0x51c6d1 = _0x499e05?.['listConversations']?.() || [];
  const _0x6b3c82 = _0x499e05?.["getActiveConversation"]?.() || null;
  if (!_0x51c6d1["length"]) {
    _0x508a02['append'](_0x406738, a849_0x385cc0("div", 'agent-history-empty', a849_0x59861c('historyEmpty')));
    return;
  }
  const _0x486dcc = a849_0x385cc0('div', "agent-history-list");
  _0x51c6d1["forEach"](_0x50dfbe => {
    const _0x2c14a9 = a849_0x385cc0("div", "agent-history-item");
    _0x2c14a9["dataset"]["conversationId"] = _0x50dfbe['id'];
    _0x2c14a9["classList"]["toggle"]("is-active", _0x50dfbe['id'] === _0x6b3c82?.['id']);
    const _0x2e6e29 = a849_0x385cc0("button", "agent-history-main");
    _0x2e6e29["type"] = 'button';
    _0x2e6e29["append"](a849_0x385cc0("span", 'agent-history-name', _0x50dfbe["title"] || a849_0x59861c("newConversationFallback")), a849_0x385cc0("span", "agent-history-time", formatHistoryTime(_0x50dfbe["updatedAt"])), a849_0x385cc0("span", 'agent-history-content', getLastMessageSummary(_0x50dfbe)));
    _0x2e6e29["addEventListener"]("click", () => onSelect?.(_0x50dfbe['id']));
    const _0x2bc2b2 = a849_0x285c10("agent-history-delete", '×', {
      'title': a849_0x59861c("historyDelete")
    });
    _0x2bc2b2['addEventListener']('click', _0x4fe5eb => {
      _0x4fe5eb["preventDefault"]?.();
      _0x4fe5eb["stopPropagation"]?.();
      onDelete?.(_0x50dfbe['id']);
    });
    _0x2c14a9["append"](_0x2e6e29, _0x2bc2b2);
    _0x486dcc["appendChild"](_0x2c14a9);
  });
  _0x508a02["append"](_0x406738, _0x486dcc);
}
function isAgentPopoverOpen(_0x112bad) {
  if (!_0x112bad) {
    return ![];
  }
  if (_0x112bad["classList"]?.["contains"]("agent-history-popover")) {
    return _0x112bad["hidden"] !== !![];
  }
  return _0x112bad['classList']?.["contains"]("show");
}
function hideAgentPopover(_0x27f7d8) {
  if (!_0x27f7d8) {
    return;
  }
  if (_0x27f7d8["classList"]?.["contains"]("agent-history-popover")) {
    _0x27f7d8["hidden"] = !![];
    _0x27f7d8["classList"]?.["remove"]?.("show");
    return;
  }
  _0x27f7d8["classList"]?.["remove"]?.("show");
  _0x27f7d8["agentPopoverTrigger"]?.["setAttribute"]?.("aria-expanded", "false");
}
function showAgentPopover(_0x17e101) {
  if (!_0x17e101) {
    return;
  }
  if (_0x17e101["classList"]?.['contains']("agent-history-popover")) {
    _0x17e101["hidden"] = ![];
    _0x17e101["classList"]?.['add']?.("show");
    return;
  }
  _0x17e101["classList"]?.["add"]?.("show");
  _0x17e101["agentPopoverTrigger"]?.['setAttribute']?.("aria-expanded", "true");
}
function closeFloatingMenus(_0x18f0ed, _0x33fa97 = null) {
  _0x18f0ed?.['querySelectorAll']?.('.agent-floating-menu.show,\x20.agent-model-menu.show,\x20.agent-history-popover')?.['forEach'](_0x4c4438 => {
    if (_0x4c4438 !== _0x33fa97) {
      hideAgentPopover(_0x4c4438);
    }
  });
  if (!_0x33fa97) {
    closeNodeFooterMenus(_0x18f0ed);
  }
}
function setMenuOpen(_0x4bcfae, _0x336aa0, _0x3634e1) {
  closeFloatingMenus(_0x3634e1, _0x336aa0 ? _0x4bcfae : null);
  if (_0x336aa0) {
    showAgentPopover(_0x4bcfae);
  } else {
    hideAgentPopover(_0x4bcfae);
  }
}
function isAgentMenuSurface(_0x4443c5) {
  return !!_0x4443c5?.["closest"]?.(".agent-menu-wrap, .agent-floating-menu, .agent-model-menu, .agent-history-popover, .agent-history-btn");
}
function hasOpenFloatingMenus(_0x250751) {
  return Array["from"](_0x250751?.["querySelectorAll"]?.('.agent-floating-menu.show,\x20.agent-model-menu.show,\x20.agent-history-popover') || [])["some"](isAgentPopoverOpen);
}
export function initAgentPanel({
  runtime: _0x265548,
  modelSettings: _0x4919fb,
  store = null,
  uploadMaterial = null,
  validateDocumentFile = null,
  skillRegistry = null,
  refreshAgentSkills = null,
  installAgentSkill = null,
  deleteAgentSkill = null,
  saveAgentSkill = null,
  fabBtnEl = document["getElementById"]('fabBtn'),
  root = document["body"],
  stateRoot = document["body"],
  surface = {},
  replyActions = []
} = {}) {
  if (!_0x265548 || !fabBtnEl || !root) {
    return null;
  }
  const _0x179756 = a849_0x385cc0("aside", 'agent-sidebar');
  _0x179756['setAttribute']("aria-label", a849_0x59861c("panelAria"));
  _0x179756['setAttribute']("aria-hidden", "true");
  _0x179756["dataset"]["readonlyTextSelectionRoot"] = "true";
  const _0x5a3ad3 = a849_0x385cc0("div", "agent-sidebar-resize-handle");
  _0x5a3ad3["setAttribute"]("role", "separator");
  _0x5a3ad3["setAttribute"]("aria-orientation", "vertical");
  _0x5a3ad3["setAttribute"]("aria-label", a849_0x59861c('resizeAria'));
  _0x5a3ad3["tabIndex"] = 0x0;
  const _0x5a3eef = a849_0x385cc0("div", "agent-sidebar-header");
  const _0x2a9488 = a849_0x385cc0("div", "agent-sidebar-title");
  _0x2a9488["append"](a849_0x385cc0("span", "agent-sidebar-title-main", surface["title"] || 'Canvas\x20AI\x20Agent'), a849_0x385cc0('span', 'agent-sidebar-title-badge', a849_0x59861c('betaBadge')));
  const _0x16c4d0 = a849_0x385cc0("div", 'agent-header-actions');
  const _0x201b95 = a849_0x285c10("agent-icon-btn agent-new-chat-btn", '', {
    'title': a849_0x59861c("newConversation"),
    'icon': a849_0x10ac62("plus")
  });
  const _0x261e3c = a849_0x285c10("agent-icon-btn agent-history-btn", '', {
    'title': a849_0x59861c("historyTitle"),
    'icon': a849_0x10ac62("history")
  });
  const _0x5c0b25 = a849_0x285c10("agent-icon-btn agent-close-btn", '', {
    'title': a849_0x59861c('close'),
    'icon': a849_0x10ac62("close")
  });
  _0x16c4d0["append"](_0x201b95, _0x261e3c, _0x5c0b25);
  _0x5a3eef["append"](_0x2a9488, _0x16c4d0);
  const _0x4cdcc7 = a849_0x385cc0("div", "agent-sidebar-main");
  const _0x511e73 = a849_0x385cc0("div", 'agent-greeting');
  _0x511e73["append"](a849_0x385cc0('div', "agent-greeting-kicker", surface['kicker'] || a849_0x59861c("greetingKicker")), a849_0x385cc0("div", "agent-greeting-title", surface['greeting'] || a849_0x59861c('greetingTitle')));
  const _0x28d712 = a849_0x385cc0('div', "agent-messages");
  const _0x1238ba = a849_0x385cc0("div", 'agent-run-steps');
  _0x1238ba["hidden"] = !![];
  const _0x2c2d95 = a849_0x385cc0('div', "agent-history-popover");
  _0x2c2d95["hidden"] = !![];
  _0x4cdcc7['append'](_0x511e73, _0x28d712, _0x1238ba, _0x2c2d95);
  const _0x4d5166 = a849_0x385cc0("div", 'agent-quick-actions-shell');
  const _0x2b3328 = a849_0x385cc0("div", "agent-quick-actions");
  _0x4d5166['appendChild'](_0x2b3328);
  const _0x15f0a1 = globalThis['window'];
  let _0x22a4f8 = null;
  const _0x5ffb95 = () => {
    _0x22a4f8?.["close"]?.();
    _0x22a4f8 = null;
  };
  const _0x521682 = (_0x56889b, _0x37c1b6) => {
    if (!Array["isArray"](_0x37c1b6) || _0x37c1b6["length"] === 0x0) {
      return;
    }
    _0x56889b["preventDefault"]?.();
    _0x56889b["stopPropagation"]?.();
    closeFloatingMenus(_0x179756);
    _0x5ffb95();
    _0x22a4f8 = showContextMenu(Number(_0x56889b["clientX"]) || 0x0, Number(_0x56889b["clientY"]) || 0x0, _0x37c1b6, {
      'className': "v2-canvas-ctx-menu agent-context-menu",
      'ensureItemIcons': !![],
      'ownerElement': _0x56889b["target"],
      'ownerRoot': _0x179756
    });
  };
  const _0x27a727 = ({
    trigger: _0x5e0643,
    field: _0x32c85d,
    onSelect: _0x4982cc
  } = {}) => {
    if (!_0x5e0643 || !Array["isArray"](_0x32c85d?.['options']) || _0x32c85d["options"]['length'] === 0x0) {
      return;
    }
    if (_0x5e0643["getAttribute"]("aria-expanded") === "true") {
      _0x5ffb95();
      return;
    }
    closeFloatingMenus(_0x179756);
    _0x5ffb95();
    const _0x2dc43c = _0x32c85d["options"]["map"](_0x31c73e => {
      const _0x49bfd3 = getParamOptionLabel(_0x31c73e);
      if (!_0x49bfd3) {
        return null;
      }
      return {
        'label': _0x49bfd3,
        'checked': String(_0x31c73e?.["value"] ?? '') === String(_0x32c85d["value"] ?? ''),
        'disabled': _0x31c73e?.["disabled"] === !![],
        'action': () => _0x4982cc?.(_0x31c73e["value"]),
        'paramValue': _0x31c73e["value"]
      };
    })['filter'](Boolean);
    if (_0x2dc43c['length'] === 0x0) {
      return;
    }
    const _0x265ad4 = _0x5e0643['getBoundingClientRect']?.() || {};
    _0x5e0643["setAttribute"]('aria-expanded', "true");
    let _0x574868 = null;
    _0x574868 = showContextMenu(Number(_0x265ad4["left"]) || 0x0, (Number(_0x265ad4['bottom']) || 0x0) + 0x4, _0x2dc43c, {
      'className': "v2-canvas-ctx-menu v2-sb-dropdown agent-param-dropdown-menu",
      'restoreTarget': _0x5e0643,
      'ownerElement': _0x5e0643,
      'ownerRoot': _0x179756,
      'dismissOnOwnerPointerDown': ![],
      'ariaLabel': String(_0x32c85d["label"] || ''),
      'onClose': () => {
        _0x5e0643["setAttribute"]("aria-expanded", 'false');
        if (_0x22a4f8 === _0x574868) {
          _0x22a4f8 = null;
        }
      }
    });
    _0x22a4f8 = _0x574868;
    _0x574868["menu"]['dataset']['agentParamId'] = String(_0x32c85d['id'] || '');
    _0x574868["menu"]['querySelectorAll']?.(".v2-menu-row")?.["forEach"]((_0x30e339, _0x1c58fc) => {
      _0x30e339['dataset']["agentParamValue"] = String(_0x2dc43c[_0x1c58fc]?.['paramValue'] ?? '');
    });
  };
  seedCustomQuickActionsIfNeeded(_0x15f0a1);
  function _0x1cc79e() {
    _0x2b3328["replaceChildren"]();
    (surface['quickActions'] || readCustomQuickActions(_0x15f0a1))["forEach"](_0x316bcb => {
      const _0x1768c1 = a849_0x285c10("agent-quick-card", _0x316bcb["label"], {
        'icon': _0x316bcb["custom"] === !![] ? a849_0x10ac62('wand') : _0x316bcb['id'] === "canvas-gap-check" ? a849_0x10ac62('scan') : _0x316bcb['id'] === 'storyboard-plan' ? a849_0x10ac62('flow') : a849_0x10ac62("wand")
      });
      _0x1768c1["dataset"]['prompt'] = _0x316bcb['prompt'];
      _0x2b3328["appendChild"](_0x1768c1);
    });
    _0x3ffb01();
  }
  _0x1cc79e();
  const _0x1b16de = a849_0x385cc0("div", "agent-custom-panel");
  _0x1b16de["hidden"] = !![];
  _0x1b16de["setAttribute"]('aria-hidden', "true");
  const _0x58579d = a849_0x385cc0('div', "agent-custom-panel-header");
  const _0x34c315 = a849_0x385cc0("div", "agent-custom-panel-copy");
  _0x34c315["append"](a849_0x385cc0('div', "agent-custom-panel-title", a849_0x59861c("customShortcutPanelTitle")), a849_0x385cc0('div', "agent-custom-panel-desc", a849_0x59861c("customShortcutPanelDesc")));
  const _0x596305 = a849_0x285c10("agent-custom-close-btn", '×', {
    'title': a849_0x59861c("customShortcutClose")
  });
  _0x58579d["append"](_0x34c315, _0x596305);
  const _0x2409bc = a849_0x285c10("agent-secondary-btn agent-custom-new-btn", a849_0x59861c("customShortcutNew"));
  const _0x1bed73 = a849_0x385cc0("div", "agent-custom-panel-body");
  const _0x29d6fb = a849_0x385cc0('div', "agent-custom-sidebar");
  const _0x398409 = a849_0x385cc0("div", "agent-custom-list");
  _0x398409["setAttribute"]('role', "list");
  _0x29d6fb["append"](_0x2409bc, _0x398409);
  const _0x5dd3d5 = a849_0x385cc0('div', "agent-custom-editor");
  const _0x11225a = a849_0x385cc0('label', "agent-custom-field");
  _0x11225a["appendChild"](a849_0x385cc0("span", "agent-custom-label", a849_0x59861c("customShortcutNameLabel")));
  const _0x4396fd = a849_0x385cc0('input', "agent-custom-input");
  _0x4396fd["type"] = "text";
  _0x4396fd['maxLength'] = 0x1c;
  _0x4396fd['placeholder'] = a849_0x59861c('customShortcutNamePlaceholder');
  _0x11225a["appendChild"](_0x4396fd);
  const _0x990a4b = a849_0x385cc0("label", "agent-custom-field");
  _0x990a4b["appendChild"](a849_0x385cc0("span", "agent-custom-label", a849_0x59861c("customShortcutPromptLabel")));
  const _0x3fb56c = a849_0x385cc0("textarea", "agent-custom-textarea");
  _0x3fb56c['rows'] = 0x4;
  _0x3fb56c["placeholder"] = a849_0x59861c('customShortcutPromptPlaceholder');
  _0x990a4b["appendChild"](_0x3fb56c);
  const _0x3dad7f = a849_0x385cc0('div', "agent-custom-editor-actions");
  const _0x3bdf58 = a849_0x285c10("agent-primary-btn agent-custom-save-btn", a849_0x59861c('customShortcutSave'));
  _0x3dad7f["append"](_0x3bdf58);
  _0x5dd3d5["append"](_0x11225a, _0x990a4b, _0x3dad7f);
  _0x1bed73["append"](_0x29d6fb, _0x5dd3d5);
  _0x1b16de["append"](_0x58579d, _0x1bed73);
  const _0x1a4e2d = a849_0x385cc0("div", "agent-notice");
  _0x1a4e2d["hidden"] = !![];
  const _0x49aea9 = a849_0x385cc0("div", 'agent-plan-preview');
  _0x49aea9['hidden'] = !![];
  const _0x163bd3 = a849_0x385cc0("div", "agent-options");
  _0x163bd3["hidden"] = !![];
  const _0x4f47a7 = a849_0x385cc0("div", "agent-recovery");
  _0x4f47a7['hidden'] = !![];
  const _0x6373d1 = a849_0x385cc0("div", "agent-actions");
  _0x6373d1["hidden"] = !![];
  const _0x86de1a = a849_0x285c10("agent-primary-btn", a849_0x59861c('confirmExecute'));
  const _0xab1eed = a849_0x285c10("agent-secondary-btn", a849_0x59861c("cancel"));
  _0x6373d1["append"](_0x86de1a, _0xab1eed);
  const _0x49b2ec = a849_0x385cc0("form", "agent-compose");
  const _0x3ceef3 = a849_0x385cc0("div", "agent-prompt-panel text-prompt-panel");
  const _0xb5fbd7 = a849_0x385cc0("div", "agent-ref-bar node-ref-bar active");
  const _0x552f5c = createAgentPromptAttachmentButton({
    'title': a849_0x59861c("addSelectedReference"),
    'className': "agent-connect-btn"
  });
  const _0x3e266f = a849_0x385cc0("div", "agent-ref-placeholder", a849_0x59861c('addReference'));
  const _0x2d8739 = a849_0x385cc0("div", "ref-thumb-container agent-input-ref-list");
  _0x2d8739['setAttribute']("role", "list");
  _0xb5fbd7["append"](_0x552f5c, _0x3e266f, _0x2d8739);
  if (surface['textOnly']) {
    _0xb5fbd7["hidden"] = !![];
  }
  const _0x483b5d = a849_0x385cc0("div", "agent-input-wrapper prompt-input-wrapper");
  const _0x25fb20 = a849_0x385cc0("div", "agent-compose-input prompt-textarea custom-textarea");
  _0x25fb20['contentEditable'] = "true";
  _0x25fb20["spellcheck"] = ![];
  _0x25fb20["dataset"]["placeholder"] = surface["placeholder"] || a849_0x59861c("inputPlaceholder");
  _0x483b5d['appendChild'](_0x25fb20);
  const _0x3a5fd2 = a849_0x385cc0("div", "agent-compose-footer prompt-panel-footer");
  const _0x541715 = a849_0x385cc0("div", "agent-compose-left");
  const _0x3dbece = a849_0x385cc0("div", "agent-menu-wrap");
  const _0x37fd1f = a849_0x285c10("agent-round-btn", '', {
    'title': a849_0x59861c("add"),
    'icon': a849_0x10ac62("plus")
  });
  const _0x1e6c77 = a849_0x385cc0("div", "agent-floating-menu agent-add-menu");
  [["upload", a849_0x59861c("uploadMaterial"), "upload"], ["document", a849_0x59861c('readDocument'), "upload"], ['custom', a849_0x59861c('customShortcutPanelTitle'), "wand"], ['skills', a849_0x59861c("skillManage"), "skills"]]["forEach"](([_0x50e52c, _0xe9518e, _0x3c79d3]) => {
    const _0x46ad74 = a849_0x285c10('agent-menu-item', _0xe9518e, {
      'icon': a849_0x10ac62(_0x3c79d3)
    });
    _0x46ad74['dataset']["placeholderAction"] = _0x50e52c;
    _0x1e6c77['appendChild'](_0x46ad74);
  });
  _0x3dbece['append'](_0x37fd1f, _0x1e6c77);
  if (surface["textOnly"]) {
    _0x3dbece["hidden"] = !![];
  }
  const _0x11636e = _0x4919fb?.["getSettings"]?.() || {};
  const _0xc5434d = a849_0x385cc0('div', "img-model-pills aigen-text-model-selector agent-text-model-selector");
  _0xc5434d["dataset"]['aigenTextModelSelector'] = '';
  const _0x5bb7fa = a849_0x385cc0("div", 'agent-menu-wrap\x20agent-model-wrap\x20img-model-wrap');
  const _0xc53633 = a849_0x285c10("agent-pill-btn agent-model-btn img-model-btn-trigger", '', {
    'title': a849_0x59861c('modelSelection')
  });
  const _0x35eee1 = a849_0x385cc0("span", 'agent-model-icon-slot');
  _0x35eee1["innerHTML"] = a849_0x10ac62('model');
  const _0x4eac61 = a849_0x385cc0("span", "agent-model-label img-model-label", resolveAgentModelLabel(_0x11636e["model"]));
  const _0x2bd2a5 = a849_0x385cc0("span", 'agent-caret\x20node-menu-caret');
  _0x2bd2a5["innerHTML"] = "<svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>";
  _0xc53633["append"](_0x35eee1, _0x4eac61, _0x2bd2a5);
  const _0x3f8401 = a849_0x385cc0("div", 'floating-menu\x20img-model-menu\x20node-model-menu\x20agent-model-menu');
  _0x3f8401["innerHTML"] = buildAIGenTextModelMenuMarkup({
    'activeModel': _0x11636e["model"]
  });
  _0x5bb7fa["append"](_0xc53633, _0x3f8401);
  const _0x1f3057 = a849_0x285c10('model-provider-profile-selector-toggle\x20is-hidden', '');
  const _0x5a09e8 = a849_0x385cc0("div", "ui-schema-placement ui-schema-mode-slot");
  _0x5a09e8["dataset"]["aigenTextUiSchemaModeSlot"] = '';
  _0x5a09e8["hidden"] = !![];
  _0xc5434d["append"](_0x5bb7fa, _0x1f3057, _0x5a09e8);
  const _0x199045 = a849_0x385cc0("div", "agent-menu-wrap");
  const _0x555443 = a849_0x285c10('agent-pill-btn\x20agent-mode-btn', '', {
    'title': a849_0x59861c("agentMode"),
    'icon': a849_0x10ac62('mode')
  });
  const _0x2caa6e = a849_0x385cc0("span", "agent-mode-label", getAgentExecutionModeLabel(_0x11636e["executionMode"]));
  const _0x25239c = a849_0x385cc0("span", "agent-caret");
  _0x25239c["innerHTML"] = "<svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>";
  _0x555443["append"](_0x2caa6e, _0x25239c);
  const _0x15622b = a849_0x385cc0('div', "agent-floating-menu agent-mode-menu");
  [["manual", getAgentExecutionModeLabel("manual")], ["auto", getAgentExecutionModeLabel('auto')]]['forEach'](([_0xb32e77, _0x21515c]) => {
    const _0x26c5b5 = a849_0x285c10("agent-menu-item", _0x21515c, {
      'icon': a849_0x10ac62("check")
    });
    _0x26c5b5["dataset"]['executionMode'] = _0xb32e77;
    _0x26c5b5["classList"]["toggle"]('active', normalizeAgentExecutionMode(_0x11636e['executionMode']) === _0xb32e77);
    _0x15622b["appendChild"](_0x26c5b5);
  });
  _0x199045["append"](_0x555443, _0x15622b);
  _0x199045["hidden"] = !![];
  const _0x35c427 = createAgentSkillPicker({
    'registry': skillRegistry,
    'text': a849_0x59861c,
    'slashTrigger': _0x25fb20,
    'onSelect': _0x2cfe5d => {
      const _0x14032a = String(_0x2cfe5d?.['id'] || '')['trim']();
      if (_0x14032a) {
        setEditorText(_0x25fb20, '$' + _0x14032a + '\x20');
      }
      setMenuOpen(_0x35c427["menu"], ![], _0x179756);
      _0x25fb20['focus']();
    }
  });
  _0x541715["append"](_0x3dbece, _0xc5434d);
  const _0x2cb949 = a849_0x285c10("agent-send-btn", '', {
    'title': a849_0x59861c("send"),
    'icon': a849_0x10ac62("send")
  });
  _0x2cb949["type"] = "submit";
  const _0x1ae736 = a849_0x285c10('agent-stop-btn', '', {
    'title': a849_0x59861c("stop"),
    'icon': a849_0x10ac62('stop')
  });
  _0x1ae736["type"] = 'button';
  _0x1ae736["hidden"] = !![];
  _0x3a5fd2['append'](_0x541715, _0x2cb949, _0x1ae736);
  _0x3ceef3["append"](_0xb5fbd7, _0x483b5d, _0x3a5fd2, _0x35c427["element"]);
  const _0x393a7f = createAgentSkillPanel({
    'registry': skillRegistry,
    'refreshSkills': refreshAgentSkills,
    'installSkill': installAgentSkill,
    'deleteSkill': deleteAgentSkill,
    'saveSkill': saveAgentSkill,
    'text': a849_0x59861c,
    'formatText': a849_0x5b0a80,
    'onInsert': _0x57e0ae => {
      setEditorText(_0x25fb20, '' + _0x57e0ae + getEditorText(_0x25fb20));
      _0x25fb20["focus"]();
    },
    'onUse': _0x458e2a => {
      const _0x5d5b68 = String(_0x458e2a || '')["trim"]();
      const _0x4a0329 = getEditorText(_0x25fb20);
      if (_0x5d5b68) {
        const _0x212cad = '$' + _0x5d5b68;
        setEditorText(_0x25fb20, _0x4a0329 === _0x212cad || _0x4a0329["startsWith"](_0x212cad + '\x20') ? '' + _0x4a0329 + (_0x4a0329 === _0x212cad ? '\x20' : '') : '' + _0x212cad + (_0x4a0329 ? '\x20' + _0x4a0329 : '\x20'));
      }
      setMenuOpen(_0x35c427["menu"], ![], _0x179756);
      _0x25fb20["focus"]();
    },
    'onCatalogChange': _0x35c427["render"],
    'onNotice': _0x5c3b58,
    'windowObject': _0x15f0a1
  });
  function _0x3b2b67() {
    _0x50c239(![]);
    _0x393a7f["open"]();
  }
  const _0x4dff54 = createAgentComposerAttachmentController({
    'documentObject': document,
    'uploadMaterial': uploadMaterial,
    'validateDocumentFile': validateDocumentFile,
    'normalizeMaterialNode': _0x1103f0 => normalizeAgentInputRefFromNode(_0x1103f0, {
      'source': "upload"
    }),
    'addInputRefs': _0x5511cd,
    'setBusy': _0x1ad907,
    'getBusy': () => _0x69b3e3,
    'captureContext': () => _0x1b12e2["capture"](),
    'isContextCurrent': _0x2e7f45 => _0x1b12e2["isCurrent"](_0x2e7f45),
    'setNotice': _0x5c3b58,
    'text': a849_0x59861c,
    'formatText': a849_0x5b0a80,
    'focusInput': () => _0x25fb20["focus"](),
    'onDocumentChange': _0x43043c
  });
  _0x49b2ec["append"](_0x4d5166, _0x1b16de, _0x393a7f['element'], _0x49aea9, _0x163bd3, _0x4f47a7, _0x6373d1, _0x3ceef3, _0x4dff54['materialInput'], _0x4dff54["documentInput"]);
  _0x179756["append"](_0x5a3ad3, _0x5a3eef, _0x4cdcc7, _0x49b2ec);
  root["appendChild"](_0x179756);
  stateRoot["appendChild"](_0x1a4e2d);
  let _0x3c6208 = null;
  _0xc53633["addEventListener"]("click", () => {
    if (_0x3f8401["classList"]["contains"]('show')) {
      return;
    }
    closeFloatingMenus(_0x179756, _0x3f8401);
    const _0x38915d = _0x4919fb?.["getSettings"]?.() || _0x11636e;
    _0x3c6208?.["sync"]?.(_0x38915d);
  });
  _0x3c6208 = bindAgentModelControls(_0xc5434d, {
    'modelSettings': _0x4919fb,
    'initialSettings': _0x11636e,
    'documentObject': document
  });
  let _0x69b3e3 = ![];
  const _0x1b12e2 = createAgentPanelContinuity({
    'getConversation': () => _0x265548["sessionStore"]?.['getActiveConversation']?.() || _0x265548["getActiveConversation"]?.(),
    'getHistory': _0xe10870,
    'getMessageCount': () => _0x28d712["children"]["length"]
  });
  let _0x576f7a = null;
  let _0xa85738 = null;
  let _0x1b33f0 = null;
  let _0x1e4a8b = ![];
  let _0x2aa431 = null;
  const _0x45eeb5 = readStoredSidebarWidth(_0x15f0a1);
  _0x45eeb5 && stateRoot["style"]?.['setProperty']?.("--agent-sidebar-width", clampAgentSidebarWidth(_0x45eeb5) + 'px');
  function _0x32c721() {
    _0x1b33f0 !== null && (clearTimeout(_0x1b33f0), _0x1b33f0 = null);
  }
  function _0x5c3b58(_0x28027f, {
    sticky = ![]
  } = {}) {
    _0x32c721();
    const _0x527141 = _0x179756['classList']["contains"]('is-open') && _0x265548["sessionStore"]?.["getPersistenceError"]?.();
    _0x1e4a8b = Boolean(_0x527141);
    _0x527141 && (_0x28027f = _0x527141, sticky = !![]);
    _0x1a4e2d["textContent"] = String(_0x28027f || '');
    _0x1a4e2d["hidden"] = !_0x1a4e2d["textContent"];
    _0x1a4e2d['textContent'] && !sticky && (_0x1b33f0 = setTimeout(() => {
      _0x1b33f0 = null;
      _0x1a4e2d["textContent"] = '';
      _0x1a4e2d['hidden'] = !![];
    }, AGENT_NOTICE_AUTO_HIDE_MS), _0x1b33f0?.["unref"]?.());
  }
  async function _0x4a0617(_0x1cf917 = '') {
    const _0x3ed5a3 = String(_0x1cf917 || '')["trim"]();
    if (!_0x3ed5a3) {
      return ![];
    }
    try {
      const _0x4c38e0 = _0x15f0a1?.["navigator"]?.["clipboard"] || globalThis["navigator"]?.["clipboard"];
      if (!_0x4c38e0?.["writeText"]) {
        throw new Error("Clipboard unavailable");
      }
      await _0x4c38e0['writeText'](_0x3ed5a3);
      _0x5c3b58(a849_0x59861c("copyMessageDone"));
      return !![];
    } catch {
      _0x5c3b58(a849_0x59861c('copyMessageFailed'));
      return ![];
    }
  }
  function _0x9f10c9(_0x558f57 = '', _0x2b3d7e = '') {
    const _0x1fa730 = String(_0x558f57 || '')["trim"]();
    if (!_0x1fa730) {
      return;
    }
    openImagePreview(_0x1fa730, {
      'alt': _0x2b3d7e || a849_0x59861c("imageResultOpen"),
      'sidebarSubmenuOwner': 'agent'
    });
  }
  function _0x1731bc(_0x5e8e87 = _0x179756) {
    const _0x18d981 = document?.["getSelection"]?.() || _0x15f0a1?.['getSelection']?.() || globalThis["getSelection"]?.();
    const _0x50486f = String(_0x18d981?.['toString']?.() || '')['trim']();
    if (!_0x50486f || _0x18d981?.["isCollapsed"] === !![]) {
      return '';
    }
    const _0x56cd2e = Number(_0x18d981?.['rangeCount']) || 0x0;
    if (_0x56cd2e > 0x0 && typeof _0x18d981['getRangeAt'] === "function") {
      for (let _0x249497 = 0x0; _0x249497 < _0x56cd2e; _0x249497 += 0x1) {
        const _0x302cb1 = _0x18d981["getRangeAt"](_0x249497);
        if (_0x5e8e87['contains'](_0x302cb1["commonAncestorContainer"]) || _0x5e8e87["contains"](_0x302cb1["startContainer"]) || _0x5e8e87['contains'](_0x302cb1['endContainer'])) {
          return _0x50486f;
        }
      }
      return '';
    }
    return _0x5e8e87['contains'](_0x18d981?.['anchorNode']) || _0x5e8e87["contains"](_0x18d981?.["focusNode"]) ? _0x50486f : '';
  }
  function _0x2d1242(_0x3b0db6) {
    const _0x2d5cef = _0x1731bc();
    if (!_0x2d5cef) {
      return;
    }
    _0x3b0db6["stopPropagation"]?.();
    _0x3b0db6["clipboardData"]?.['setData'] && (_0x3b0db6["preventDefault"]?.(), _0x3b0db6['clipboardData']["setData"]('text/plain', _0x2d5cef));
  }
  function _0x78996e() {
    const _0x5a104c = Math["max"](0x0, Number(_0x2b3328["scrollWidth"]) || 0x0);
    const _0xc1c4ca = Number(_0x2b3328["getBoundingClientRect"]?.()["width"]) || 0x0;
    const _0x2f10b3 = Math["max"](0x0, Number(_0x2b3328["clientWidth"]) || _0xc1c4ca || Number(_0x2b3328['offsetWidth']) || 0x0);
    const _0x5a717f = Math["max"](0x0, _0x5a104c - _0x2f10b3);
    const _0x3d6c09 = Math["min"](_0x5a717f, Math['max'](0x0, Number(_0x2b3328["scrollLeft"]) || 0x0));
    return {
      'clientWidth': _0x2f10b3,
      'maxScroll': _0x5a717f,
      'scrollLeft': _0x3d6c09,
      'scrollWidth': _0x5a104c
    };
  }
  function _0x3ffb01() {
    const {
      maxScroll: _0x1fc4c1,
      scrollLeft: _0x209d7a
    } = _0x78996e();
    const _0xd5ebba = _0x1fc4c1 > 0x1;
    _0x4d5166["classList"]["toggle"]("has-overflow", _0xd5ebba);
    _0x4d5166['classList']['toggle']("has-left-fade", _0xd5ebba && _0x209d7a > 0x1);
    _0x4d5166["classList"]["toggle"]("has-right-fade", _0xd5ebba && _0x209d7a < _0x1fc4c1 - 0x1);
  }
  function _0x156b87(_0x42f0e3) {
    const _0x2e0590 = _0x42f0e3 === !![];
    _0x2b3328['hidden'] = _0x2e0590;
    _0x4d5166["hidden"] = _0x2e0590;
    _0x3ffb01();
  }
  function _0x570337(_0xf77e5b) {
    const {
      maxScroll: _0x446de8,
      scrollLeft: _0x5e0bc3
    } = _0x78996e();
    if (_0x446de8 <= 0x1) {
      return;
    }
    const _0x2620be = Number(_0xf77e5b?.["deltaY"]) || 0x0;
    const _0x3289a4 = Number(_0xf77e5b?.["deltaX"]) || 0x0;
    const _0x1799cc = Math['abs'](_0x3289a4) > Math["abs"](_0x2620be) && _0x3289a4 !== 0x0 ? _0x3289a4 : _0x2620be;
    if (!_0x1799cc) {
      return;
    }
    const _0x1142f4 = _0x1799cc < 0x0 && _0x5e0bc3 > 0x1;
    const _0x57be54 = _0x1799cc > 0x0 && _0x5e0bc3 < _0x446de8 - 0x1;
    if (!_0x1142f4 && !_0x57be54) {
      return;
    }
    _0xf77e5b?.["preventDefault"]?.();
    _0x2b3328["scrollLeft"] = Math["min"](_0x446de8, Math["max"](0x0, _0x5e0bc3 + _0x1799cc));
    _0x3ffb01();
  }
  function _0x50c239(_0x20ef1a) {
    if (_0x20ef1a) {
      _0x1b16de["hidden"] = ![];
      _0x1b16de["setAttribute"]("aria-hidden", "false");
      _0x1b16de['classList']["remove"]("is-open");
      void _0x1b16de["offsetWidth"];
      _0x1b16de['classList']["add"]("is-open");
      return;
    }
    _0x1b16de['classList']['remove']('is-open');
    _0x1b16de["setAttribute"]('aria-hidden', "true");
    _0x1b16de["hidden"] = !![];
  }
  let _0x32d3ec = ![];
  let _0xf866c2 = [];
  let _0x568604 = ![];
  let _0x5b3902 = null;
  function _0x1c0f47(_0x4a39ef, _0x5426c5) {
    if (!_0x4a39ef) {
      return;
    }
    const _0x366044 = String(_0x5426c5 || '');
    _0x366044 ? (_0x4a39ef["title"] = _0x366044, _0x4a39ef["setAttribute"]?.("aria-label", _0x366044)) : (_0x4a39ef["title"] = '', _0x4a39ef['removeAttribute']?.("aria-label"));
  }
  function _0xdb79f(_0x4ef8dc, _0x4a24e6) {
    if (!_0x4ef8dc) {
      return;
    }
    const _0x18553f = _0x4ef8dc["querySelector"]?.(".agent-btn-label");
    if (_0x18553f) {
      _0x18553f["textContent"] = _0x4a24e6;
      return;
    }
    _0x4ef8dc['textContent'] = _0x4a24e6;
  }
  function _0x4c118c() {
    const _0x238f1 = _0x4919fb?.["getSettings"]?.() || _0x11636e;
    _0x179756["setAttribute"]("aria-label", a849_0x59861c('panelAria'));
    _0x5a3ad3["setAttribute"]('aria-label', a849_0x59861c("resizeAria"));
    _0x179756['querySelector'](".agent-sidebar-title-badge")["textContent"] = a849_0x59861c('betaBadge');
    _0x1c0f47(_0x201b95, a849_0x59861c('newConversation'));
    _0x1c0f47(_0x261e3c, a849_0x59861c("historyTitle"));
    _0x1c0f47(_0x5c0b25, a849_0x59861c('close'));
    _0x511e73["querySelector"](".agent-greeting-kicker")["textContent"] = surface['kicker'] || a849_0x59861c("greetingKicker");
    _0x511e73["querySelector"](".agent-greeting-title")["textContent"] = surface['greeting'] || a849_0x59861c("greetingTitle");
    _0x1b16de["querySelector"](".agent-custom-panel-title")["textContent"] = a849_0x59861c("customShortcutPanelTitle");
    _0x1b16de["querySelector"]('.agent-custom-panel-desc')['textContent'] = a849_0x59861c("customShortcutPanelDesc");
    _0x1c0f47(_0x596305, a849_0x59861c("customShortcutClose"));
    _0xdb79f(_0x2409bc, a849_0x59861c('customShortcutNew'));
    const _0x44b08c = _0x5dd3d5["querySelectorAll"](".agent-custom-label");
    if (_0x44b08c[0x0]) {
      _0x44b08c[0x0]["textContent"] = a849_0x59861c("customShortcutNameLabel");
    }
    if (_0x44b08c[0x1]) {
      _0x44b08c[0x1]["textContent"] = a849_0x59861c("customShortcutPromptLabel");
    }
    _0x4396fd['placeholder'] = a849_0x59861c("customShortcutNamePlaceholder");
    _0x3fb56c["placeholder"] = a849_0x59861c('customShortcutPromptPlaceholder');
    _0xdb79f(_0x3bdf58, a849_0x59861c('customShortcutSave'));
    _0xdb79f(_0x86de1a, a849_0x59861c("confirmExecute"));
    _0xdb79f(_0xab1eed, a849_0x59861c("cancel"));
    _0x1c0f47(_0x552f5c, a849_0x59861c("addSelectedReference"));
    _0x552f5c['setAttribute']?.("data-tooltip", a849_0x59861c("addSelectedReference"));
    _0x3e266f['textContent'] = a849_0x59861c("addReference");
    _0x25fb20["dataset"]["placeholder"] = surface["placeholder"] || a849_0x59861c("inputPlaceholder");
    _0x1c0f47(_0x37fd1f, a849_0x59861c("add"));
    _0x1e6c77["querySelectorAll"](".agent-menu-item")["forEach"](_0x54c429 => {
      const _0x5d2e99 = _0x54c429["dataset"]?.["placeholderAction"];
      if (_0x5d2e99 === "upload") {
        _0xdb79f(_0x54c429, a849_0x59861c("uploadMaterial"));
      }
      if (_0x5d2e99 === "document") {
        _0xdb79f(_0x54c429, a849_0x59861c("readDocument"));
      }
      if (_0x5d2e99 === "custom") {
        _0xdb79f(_0x54c429, a849_0x59861c("customShortcutPanelTitle"));
      }
      if (_0x5d2e99 === "skills") {
        _0xdb79f(_0x54c429, a849_0x59861c("skillManage"));
      }
    });
    _0x1c0f47(_0xc53633, a849_0x59861c("modelSelection"));
    _0x3c6208?.["sync"]?.(_0x238f1);
    _0x1c0f47(_0x555443, a849_0x59861c("agentMode"));
    _0x2caa6e["textContent"] = getAgentExecutionModeLabel(_0x238f1['executionMode']);
    _0x15622b["querySelectorAll"]("[data-execution-mode]")["forEach"](_0x22dccc => {
      _0xdb79f(_0x22dccc, getAgentExecutionModeLabel(_0x22dccc["dataset"]["executionMode"]));
    });
    _0x1c0f47(_0x2cb949, a849_0x59861c('send'));
    _0x1c0f47(_0x1ae736, a849_0x59861c("stop"));
    _0x35c427['refreshText']();
    _0x393a7f["refreshText"]();
    _0x1cc79e();
    _0x43043c();
    isAgentPopoverOpen(_0x2c2d95) && renderHistory(_0x2c2d95, _0x265548, {
      'onSelect': _0x1eaedf,
      'onDelete': _0x3de0cd
    });
    if (!_0x1b16de["hidden"]) {
      renderCustomShortcutList();
    }
    _0x568604 && _0x5c3b58(a849_0x59861c("materialPickStarted"), {
      'sticky': !![]
    });
  }
  function _0x3fe6af(_0x9facfd = {}) {
    if (_0x9facfd["thumbUrl"]) {
      const _0x233cb5 = a849_0x385cc0("img", "ref-thumb-media agent-input-ref-media");
      _0x233cb5["src"] = _0x9facfd['thumbUrl'];
      _0x233cb5["alt"] = _0x9facfd["label"] || _0x9facfd["nodeId"] || '';
      _0x233cb5["draggable"] = ![];
      return _0x233cb5;
    }
    if (String(_0x9facfd["kind"] || '') === "audio") {
      const _0x4f7f35 = createReferenceFallbackThumbElement("audio", 'ref-thumb-media\x20agent-input-ref-fallback') || a849_0x385cc0("div", "ref-thumb-media ref-thumb-fallback agent-input-ref-fallback");
      _0x4f7f35["classList"]?.["add"]?.("agent-input-ref-audio-thumb");
      _0x4f7f35['textContent'] = '';
      const _0x14e426 = a849_0x385cc0("span", "agent-audio-thumb-bars");
      for (let _0x2ede89 = 0x0; _0x2ede89 < 0x9; _0x2ede89 += 0x1) {
        _0x14e426["appendChild"](a849_0x385cc0("span", "agent-audio-thumb-bar"));
      }
      _0x4f7f35["appendChild"](_0x14e426);
      return _0x4f7f35;
    }
    const _0x4a1e25 = a849_0x385cc0("div", "ref-thumb-media ref-thumb-fallback agent-input-ref-fallback", String(_0x9facfd["kind"] || 'node')["slice"](0x0, 0x3)['toUpperCase']());
    _0x4a1e25['setAttribute']("aria-hidden", "true");
    return _0x4a1e25;
  }
  function _0x43043c() {
    _0x2d8739["replaceChildren"]();
    const _0x18ff46 = [..._0xf866c2, ..._0x4dff54["getDocumentDisplayRefs"]()];
    _0x18ff46["forEach"](_0x27817a => {
      const _0x182f66 = a849_0x385cc0("div", 'ref-thumb-wrap\x20agent-input-ref-thumb');
      const _0x13c56e = String(_0x27817a["label"] || _0x27817a["name"] || _0x27817a['nodeId'] || '')['trim']();
      _0x182f66["title"] = _0x13c56e;
      _0x182f66["setAttribute"]("aria-label", _0x13c56e);
      _0x182f66['setAttribute']("role", "listitem");
      _0x182f66["dataset"]['inputRefId'] = _0x27817a['nodeId'];
      _0x182f66["appendChild"](_0x3fe6af(_0x27817a));
      const _0x1500c4 = a849_0x59861c("removeReference");
      const _0x3af4ab = a849_0x385cc0("button", "ref-thumb-delete agent-input-ref-remove", '×');
      _0x3af4ab["type"] = "button";
      _0x3af4ab['title'] = _0x1500c4;
      _0x3af4ab["setAttribute"]("aria-label", _0x1500c4);
      _0x3af4ab["dataset"]["inputRefRemove"] = _0x27817a['nodeId'];
      _0x182f66["appendChild"](_0x3af4ab);
      _0x2d8739["appendChild"](_0x182f66);
    });
    _0xb5fbd7["classList"]['add']("active");
    _0xb5fbd7["classList"]["toggle"]("has-input-refs", _0x18ff46["length"] > 0x0);
    _0x3e266f["hidden"] = _0x18ff46["length"] > 0x0;
  }
  function _0x5511cd(_0x264cc4 = []) {
    const _0x46269e = new Map(_0xf866c2['map'](_0xe758e => [_0xe758e["nodeId"], _0xe758e]));
    _0x264cc4['filter'](Boolean)["forEach"](_0x4cd678 => {
      if (!_0x4cd678['nodeId'] || _0x46269e["has"](_0x4cd678["nodeId"])) {
        return;
      }
      _0x46269e["set"](_0x4cd678["nodeId"], _0x4cd678);
    });
    _0xf866c2 = Array["from"](_0x46269e["values"]())["slice"](0x0, a849_0x5b7fd4);
    _0x43043c();
    return _0xf866c2['length'];
  }
  function _0x4e59da() {
    _0xf866c2 = [];
    _0x4dff54["clearDocuments"]({
      'notify': ![]
    });
    _0x43043c();
  }
  function _0x48bd85({
    clearWhenMissing = ![]
  } = {}) {
    const _0x25d60a = _0x265548?.['sessionStore']?.["getPendingClarification"]?.() || _0x265548?.['sessionStore']?.["getState"]?.()["pendingClarification"] || null;
    const _0x38fa06 = (Array["isArray"](_0x25d60a?.["inputRefs"]) ? _0x25d60a["inputRefs"] : [])["filter"](_0x6cba49 => String(_0x6cba49?.['nodeId'] || _0x6cba49?.['id'] || '')["trim"]())["map"](_0x571d8d => ({
      ..._0x571d8d,
      'id': String(_0x571d8d["nodeId"] || _0x571d8d['id'] || '')["trim"](),
      'nodeId': String(_0x571d8d["nodeId"] || _0x571d8d['id'] || '')["trim"]()
    }))["slice"](0x0, a849_0x5b7fd4);
    if (_0x38fa06['length'] === 0x0 && !clearWhenMissing) {
      return ![];
    }
    _0xf866c2 = _0x38fa06;
    _0x43043c();
    return _0x38fa06["length"] > 0x0;
  }
  function _0x3ff026() {
    return document?.["getElementById"]?.('v2-wrap') || null;
  }
  function _0x1ed0e7() {
    return document?.["documentElement"] || globalThis["document"]?.["documentElement"] || null;
  }
  function _0x32b607() {
    try {
      return createLinkCursor({
        'size': getCursorSize()
      });
    } catch {
      return createLinkCursor({
        'size': "small"
      });
    }
  }
  function _0x180e76() {
    _0x5b3902?.["classList"]?.["remove"]?.("agent-material-pick-hover");
    _0x5b3902 = null;
  }
  function _0x2c84f8(_0x37a204) {
    if (_0x5b3902 === _0x37a204) {
      return;
    }
    _0x180e76();
    _0x5b3902 = _0x37a204 || null;
    _0x5b3902?.["classList"]?.["add"]?.("agent-material-pick-hover");
  }
  function _0x289dad({
    noticeText = ''
  } = {}) {
    if (!_0x568604) {
      return;
    }
    _0x568604 = ![];
    _0x180e76();
    _0x179756["classList"]["remove"]('is-material-picking');
    _0x552f5c["classList"]["remove"]('is-picking', "is-connecting-active");
    _0x552f5c["setAttribute"]("aria-pressed", "false");
    const _0x3c507d = _0x3ff026();
    _0x3c507d?.["classList"]?.["remove"]?.("is-connecting", "agent-material-pick-mode");
    const _0x5acfd2 = _0x1ed0e7();
    _0x5acfd2?.['classList']?.["remove"]?.("is-connecting-mode");
    _0x5acfd2?.["style"]?.["removeProperty"]?.("--connect-cursor");
    document?.["removeEventListener"]?.("click", _0x22ad1e, !![]);
    document?.['removeEventListener']?.("pointermove", _0x182c1a, !![]);
    document?.["removeEventListener"]?.("keydown", _0x1f3253, !![]);
    if (noticeText) {
      _0x5c3b58(noticeText);
    }
  }
  function _0x275f86({
    toggle = !![]
  } = {}) {
    if (_0x568604) {
      toggle && _0x289dad({
        'noticeText': a849_0x59861c('materialPickCancelled')
      });
      return;
    }
    _0x568604 = !![];
    _0x179756["classList"]["add"]("is-material-picking");
    _0x552f5c["classList"]['add']("is-picking", 'is-connecting-active');
    _0x552f5c["setAttribute"]("aria-pressed", "true");
    const _0x189262 = _0x3ff026();
    _0x189262?.["classList"]?.['add']?.("is-connecting", "agent-material-pick-mode");
    const _0x392dd0 = _0x1ed0e7();
    _0x392dd0?.["classList"]?.["add"]?.("is-connecting-mode");
    _0x392dd0?.["style"]?.["setProperty"]?.("--connect-cursor", _0x32b607());
    document?.["addEventListener"]?.("click", _0x22ad1e, !![]);
    document?.["addEventListener"]?.("pointermove", _0x182c1a, !![]);
    document?.["addEventListener"]?.('keydown', _0x1f3253, !![]);
    _0x5c3b58(a849_0x59861c("materialPickStarted"), {
      'sticky': !![]
    });
  }
  function _0x5b10e0(_0x1e642d) {
    const _0x18491c = _0x1e642d?.["closest"]?.(".v2-node") || null;
    const _0x400afb = String(_0x18491c?.['id'] || '')["trim"]();
    if (!_0x400afb) {
      return {
        'nodeEl': null,
        'node': null,
        'ref': null
      };
    }
    const _0xc05e4e = getStoreState(store)['nodes']?.[_0x400afb] || null;
    const _0x139ee9 = normalizeAgentInputRefFromNode(_0xc05e4e, {
      'source': "canvas-pick"
    });
    return {
      'nodeEl': _0x18491c,
      'node': _0xc05e4e,
      'ref': _0x139ee9
    };
  }
  function _0x182c1a(_0xccb77c) {
    if (!_0x568604 || _0x179756["contains"](_0xccb77c['target'])) {
      return;
    }
    const {
      nodeEl: _0x305bf0,
      ref: _0x5e9ed6
    } = _0x5b10e0(_0xccb77c["target"]);
    _0x2c84f8(_0x305bf0 && isAgentMaterialRef(_0x5e9ed6) ? _0x305bf0 : null);
  }
  function _0x22ad1e(_0x5cce08) {
    if (!_0x568604) {
      return;
    }
    if (_0x179756["contains"](_0x5cce08["target"])) {
      return;
    }
    const {
      ref: _0x3a6fc4
    } = _0x5b10e0(_0x5cce08["target"]);
    if (!_0x3a6fc4) {
      return;
    }
    _0x5cce08["preventDefault"]?.();
    _0x5cce08["stopPropagation"]?.();
    _0x5cce08['stopImmediatePropagation']?.();
    if (!isAgentMaterialRef(_0x3a6fc4)) {
      _0x5c3b58(a849_0x59861c('materialPickUnsupported'), {
        'sticky': !![]
      });
      return;
    }
    _0x5511cd([_0x3a6fc4]);
    _0x5c3b58(a849_0x5b0a80("attachSelected", {
      'count': 0x1
    }), {
      'sticky': !![]
    });
  }
  function _0x1f3253(_0x2fc9d2) {
    if (!_0x568604 || _0x2fc9d2["key"] !== "Escape") {
      return;
    }
    _0x2fc9d2['preventDefault']?.();
    _0x2fc9d2['stopPropagation']?.();
    _0x289dad({
      'noticeText': a849_0x59861c("materialPickCancelled")
    });
  }
  function _0xe87137() {
    const _0x406fa2 = getStoreState(store);
    const _0x3e703e = Array['isArray'](_0x406fa2["selectedNodeIds"]) ? _0x406fa2["selectedNodeIds"]['map'](_0x15ce92 => String(_0x15ce92 || ''))["filter"](Boolean) : [];
    const _0x5dca59 = _0x3e703e["map"](_0x481b9a => normalizeAgentInputRefFromNode(_0x406fa2['nodes']?.[_0x481b9a], {
      'source': "canvas-selection"
    }))['filter'](Boolean);
    const _0x5d9071 = _0x5dca59['filter'](isAgentMaterialRef);
    if (_0x5d9071["length"] === 0x0) {
      _0x5c3b58(a849_0x59861c("attachSelectedEmpty"));
      return 0x0;
    }
    const _0x1b937a = _0xf866c2["length"];
    _0x5511cd(_0x5d9071);
    const _0x2a3202 = Math['max'](0x0, _0xf866c2["length"] - _0x1b937a);
    _0x5c3b58(a849_0x5b0a80('attachSelected', {
      'count': _0x2a3202 || _0x5d9071["length"]
    }));
    _0x25fb20["focus"]();
    return _0x2a3202 || _0x5d9071['length'];
  }
  function _0x433f14({
    toggle = !![]
  } = {}) {
    if (_0x568604) {
      _0x275f86({
        'toggle': toggle
      });
      return 0x0;
    }
    const _0x30d70f = _0xe87137();
    if (_0x30d70f > 0x0) {
      return _0x30d70f;
    }
    _0x275f86({
      'toggle': ![]
    });
    return 0x0;
  }
  let _0x31a1b9 = '';
  function _0x276fa0() {
    const _0x346e09 = readCustomQuickActions(_0x15f0a1);
    _0x398409["replaceChildren"]();
    if (_0x346e09["length"] === 0x0) {
      const _0x3d0da2 = a849_0x385cc0("div", "agent-custom-empty", a849_0x59861c("customShortcutEmpty"));
      _0x398409["appendChild"](_0x3d0da2);
      return _0x346e09;
    }
    _0x346e09["forEach"](_0x302df7 => {
      const _0x467122 = String(_0x302df7["label"] || _0x302df7["prompt"] || '')['trim']();
      const _0x37f7ed = a849_0x385cc0("div", "agent-custom-item");
      const _0x3f5641 = a849_0x285c10('agent-custom-item-main', _0x467122);
      const _0x25e45f = a849_0x285c10("agent-custom-item-delete", '×');
      _0x37f7ed["dataset"]["agentCustomActionId"] = _0x302df7['id'];
      _0x37f7ed['setAttribute']("role", "listitem");
      _0x37f7ed["classList"]['toggle']("is-active", _0x302df7['id'] === _0x31a1b9);
      _0x25e45f["setAttribute"]('aria-label', a849_0x59861c("customShortcutDelete"));
      _0x25e45f["dataset"]["agentCustomDeleteActionId"] = _0x302df7['id'];
      _0x37f7ed['append'](_0x3f5641, _0x25e45f);
      _0x398409['appendChild'](_0x37f7ed);
    });
    return _0x346e09;
  }
  function _0x21f7e9(_0x2278bf) {
    const _0x5eb8ab = String(_0x2278bf || '')["trim"]();
    if (!_0x5eb8ab) {
      return null;
    }
    const _0x5a9a4b = readCustomQuickActions(_0x15f0a1)["find"](_0x1672ac => _0x1672ac['id'] === _0x5eb8ab);
    if (!_0x5a9a4b) {
      return null;
    }
    _0x5a5311(_0x5a9a4b);
    return _0x5a9a4b;
  }
  function _0x5a5311(_0x9417e3 = {}) {
    _0x31a1b9 = String(_0x9417e3['id'] || '')["trim"]();
    const _0x59d813 = String(_0x9417e3['prompt'] || '')["trim"]();
    _0x4396fd["value"] = String(_0x9417e3["label"] || '')['trim']();
    _0x3fb56c['value'] = _0x59d813;
    _0x276fa0();
    !_0x4396fd['value'] && _0x59d813 && (_0x4396fd['value'] = truncateUiText(_0x59d813, 0x12));
  }
  function _0x255e00({
    prefillFromInput = ![]
  } = {}) {
    _0x50c239(!![]);
    const _0x5006ab = readCustomQuickActions(_0x15f0a1);
    const _0x51edeb = prefillFromInput ? getEditorText(_0x25fb20) : '';
    _0x51edeb ? _0x5a5311({
      'label': truncateUiText(_0x51edeb, 0x12),
      'prompt': _0x51edeb
    }) : _0x5a5311(_0x5006ab[0x0] || {});
    _0x3fb56c["focus"]?.();
  }
  function _0x527c05() {
    const _0x2abffc = String(_0x3fb56c['value'] || '')["trim"]();
    if (!_0x2abffc) {
      _0x5c3b58(a849_0x59861c('customShortcutEmpty'));
      _0x3fb56c["focus"]?.();
      return;
    }
    const _0x4ebd0f = truncateUiText(_0x4396fd["value"] || _0x2abffc, 0x1c);
    const _0x1f0199 = readCustomQuickActions(_0x15f0a1);
    const _0x3fd25a = _0x1f0199["find"](_0xb025d3 => _0xb025d3['id'] === _0x31a1b9);
    const _0x19fed3 = {
      'id': _0x31a1b9 || "custom-" + Date["now"](),
      'label': _0x4ebd0f,
      'prompt': _0x2abffc,
      'custom': _0x3fd25a ? _0x3fd25a["custom"] === !![] : !![]
    };
    const _0x19b344 = _0x1f0199["findIndex"](_0x120f24 => _0x120f24['id'] === _0x19fed3['id']);
    const _0x3cfd03 = _0x19b344 >= 0x0 ? _0x1f0199["map"](_0x5c81cc => _0x5c81cc['id'] === _0x19fed3['id'] ? _0x19fed3 : _0x5c81cc) : [_0x19fed3, ..._0x1f0199['filter'](_0x11efb5 => _0x11efb5['prompt'] !== _0x2abffc)];
    const _0x30976d = writeCustomQuickActions(_0x3cfd03, _0x15f0a1);
    _0x31a1b9 = _0x19fed3['id'];
    _0x1cc79e();
    _0x276fa0();
    _0x156b87(_0x28d712["children"]["length"] > 0x0);
    _0x5c3b58(a849_0x59861c("customShortcutSaved"));
    return _0x30976d;
  }
  function _0x40a07a(_0x2b3335) {
    const _0x34f307 = String(_0x2b3335 || '')['trim']();
    if (!_0x34f307) {
      return [];
    }
    const _0x30ff9f = writeCustomQuickActions(readCustomQuickActions(_0x15f0a1)["filter"](_0x554b90 => _0x554b90['id'] !== _0x34f307), _0x15f0a1);
    _0x1cc79e();
    _0x156b87(_0x28d712['children']['length'] > 0x0);
    _0x31a1b9 === _0x34f307 ? _0x5a5311(_0x30ff9f[0x0] || {}) : _0x276fa0();
    _0x5c3b58(a849_0x59861c("customShortcutDeleted"));
    return _0x30ff9f;
  }
  function _0xe10870() {
    return _0x265548?.["sessionStore"]?.["getHistory"]?.() || _0x265548?.["sessionStore"]?.["getState"]?.()["history"] || [];
  }
  function _0x4b1fb8() {
    _0x5ffb95();
    renderPlanPreview(_0x49aea9, null);
    _0x163bd3["replaceChildren"]();
    _0x163bd3['hidden'] = !![];
    _0x4f47a7["replaceChildren"]();
    _0x4f47a7['hidden'] = !![];
    _0x6373d1['hidden'] = !![];
  }
  function _0x1dc279(_0x367879 = {}) {
    _0x576f7a?.["appendEntry"](_0x367879);
  }
  function _0x527774({
    hasMessages: _0x11a62a
  } = {}) {
    const _0x1f9a8f = _0x11a62a ?? _0x28d712["children"]["length"] > 0x0;
    _0x511e73['hidden'] = _0x1f9a8f;
    _0x156b87(_0x1f9a8f);
    if (_0x1f9a8f) {
      _0x50c239(![]);
    }
  }
  function _0x1dfe59({
    preserveNotice = ![]
  } = {}) {
    if (!_0x179756["classList"]["contains"]("is-open")) {
      _0x5c3b58('');
      return;
    }
    if (_0x265548["sessionStore"]?.["getPersistenceError"]?.()) {
      _0x5c3b58('');
      return;
    }
    const _0x2090e1 = _0x265548?.["getActiveConversation"]?.() || _0x265548?.["sessionStore"]?.["getState"]?.()["activeConversation"] || null;
    if (_0x2090e1?.["hasUnfinishedOperation"]) {
      _0x5c3b58(a849_0x59861c("unfinishedNotice"), {
        'sticky': !![]
      });
      return;
    }
    if (!preserveNotice) {
      _0x5c3b58('');
    }
  }
  function _0x914e27({
    preserveNotice = ![],
    restorePendingInputRefs = ![]
  } = {}) {
    _0x4b1fb8();
    const _0x43c755 = _0x265548?.["sessionStore"]?.["getState"]?.() || {};
    _0x576f7a?.["render"]({
      'history': _0xe10870(),
      'sessionSnapshot': _0x43c755
    });
    const _0x34c29d = _0x43c755['pendingPlan'] || null;
    _0x34c29d && (renderPlanPreview(_0x49aea9, _0x34c29d, {
      'onParamChange': _0x295355,
      'onOpenParamOptions': _0x27a727
    }), _0x6373d1['hidden'] = ![]);
    restorePendingInputRefs && _0x48bd85({
      'clearWhenMissing': !![]
    });
    _0x390827(_0x265548['getPendingAssistantChoice']?.() || _0x43c755["pendingClarification"]);
    _0x527774();
    _0x1dfe59({
      'preserveNotice': preserveNotice
    });
  }
  function _0x5c6129() {
    const _0x19850f = _0xe10870();
    const _0x361570 = Array["isArray"](_0x19850f) ? _0x19850f : [];
    _0x576f7a?.["renderMessages"](_0x361570);
    _0x527774();
    return _0x361570['length'] > 0x0;
  }
  function _0x1ad907(_0x57fa9c, {
    stoppable = ![]
  } = {}) {
    _0x69b3e3 = _0x57fa9c === !![];
    if (_0x69b3e3) {
      _0x5ffb95();
    }
    _0x49b2ec["setAttribute"]('aria-busy', _0x69b3e3 ? "true" : "false");
    _0x1ae736["setAttribute"]("aria-busy", _0x69b3e3 && stoppable ? "true" : 'false');
    _0x2cb949["disabled"] = _0x69b3e3;
    _0x2cb949["hidden"] = _0x69b3e3 && stoppable;
    _0x1ae736["hidden"] = !(_0x69b3e3 && stoppable);
    _0x86de1a["disabled"] = _0x69b3e3;
    _0xab1eed["disabled"] = _0x69b3e3;
    _0x163bd3["querySelectorAll"]?.(".agent-option-btn")?.['forEach'](_0x44e88c => {
      _0x44e88c["disabled"] = _0x69b3e3;
    });
    _0x4f47a7["querySelectorAll"]?.('.agent-recovery-btn')?.["forEach"](_0x325ae9 => {
      _0x325ae9["disabled"] = _0x69b3e3;
    });
    _0x49aea9["querySelectorAll"]?.(".agent-param-input")?.['forEach'](_0x49e541 => {
      _0x49e541["disabled"] = _0x69b3e3;
    });
    _0x179756["classList"]["toggle"]('is-busy', _0x69b3e3);
    _0x576f7a?.["setBusy"](_0x69b3e3);
    _0xa85738?.['setBusy']();
    if (!_0x69b3e3 && (_0x1e4a8b || _0x265548["sessionStore"]?.['getPersistenceError']?.())) {
      _0x5c3b58('');
    }
  }
  function _0xe1b1dd(_0x5e8134) {
    !_0x5e8134 && (_0x2aa431?.(), _0x1b12e2["rememberClosed"]());
    _0x179756['classList']['toggle']("is-open", _0x5e8134);
    _0x179756["setAttribute"]("aria-hidden", _0x5e8134 ? 'false' : "true");
    stateRoot["classList"]?.["toggle"]("agent-sidebar-open", _0x5e8134);
    stateRoot['classList']?.["toggle"]("agent-sidebar-collapsed", _0x5e8134 && _0x32d3ec);
    fabBtnEl['classList']["toggle"]("is-agent-open", _0x5e8134);
    if (_0x5e8134) {
      _0x265548["sessionStore"]?.["retryPersistence"]?.();
      _0x3c6208?.["sync"]?.(_0x4919fb?.["getSettings"]?.() || _0x11636e);
      if (!_0x69b3e3 && !_0x1b12e2["canResume"]()) {
        _0x914e27({
          'preserveNotice': !![],
          'restorePendingInputRefs': !_0x1b12e2['isSameConversation']()
        });
      }
      _0x3ffb01();
      if (!_0x32d3ec) {
        (_0x28d712["querySelector"]('.agent-message-edit-input') || _0x25fb20)["focus"]({
          'preventScroll': !![]
        });
      }
      _0x1dfe59({
        'preserveNotice': !![]
      });
    } else {
      _0x289dad();
      _0x5ffb95();
      closeFloatingMenus(_0x179756);
      _0x5c3b58('');
    }
  }
  function _0x14c3a0() {
    _0xe1b1dd(!_0x179756['classList']["contains"]('is-open'));
  }
  function _0x85f59b(_0x6be459) {
    _0x32d3ec = _0x6be459 === !![];
    _0x179756['classList']['toggle']("is-collapsed", _0x32d3ec);
    stateRoot["classList"]?.["toggle"]("agent-sidebar-collapsed", _0x32d3ec && _0x179756['classList']["contains"]("is-open"));
    if (!_0x32d3ec && _0x179756['classList']["contains"]("is-open")) {
      _0x25fb20['focus']({
        'preventScroll': !![]
      });
    }
    _0x32d3ec && (_0x289dad(), closeFloatingMenus(_0x179756), _0x5c3b58(''));
  }
  function _0x6a0db0(_0x43873d, {
    persist = ![]
  } = {}) {
    const _0x491f45 = clampAgentSidebarWidth(_0x43873d);
    stateRoot["style"]?.['setProperty']?.("--agent-sidebar-width", _0x491f45 + 'px');
    if (persist) {
      writeStoredSidebarWidth(_0x491f45, _0x15f0a1);
    }
    _0x3ffb01();
    return _0x491f45;
  }
  function _0x5b75c2(_0x4bf111) {
    _0x4bf111['preventDefault']?.();
    _0x4bf111['stopPropagation']?.();
    const _0x53ad48 = Number(_0x4bf111["clientX"]);
    const _0x4a582a = _0x179756['getBoundingClientRect']?.()["width"] || _0x179756["offsetWidth"] || 0x0;
    if (!Number["isFinite"](_0x53ad48) || !_0x4a582a) {
      return;
    }
    stateRoot["classList"]?.["add"]?.("agent-sidebar-resizing");
    const _0x52a788 = _0x3007da => {
      const _0x11120c = Number(_0x3007da["clientX"]);
      if (!Number['isFinite'](_0x11120c)) {
        return;
      }
      _0x6a0db0(_0x4a582a + (_0x53ad48 - _0x11120c));
    };
    const _0x2b51b5 = _0x53dd99 => {
      _0x2aa431 = null;
      document?.['removeEventListener']?.("pointermove", _0x52a788);
      document?.["removeEventListener"]?.("pointerup", _0x2b51b5);
      stateRoot["classList"]?.['remove']?.("agent-sidebar-resizing");
      const _0x41f0b6 = Number(_0x53dd99["clientX"]);
      Number["isFinite"](_0x41f0b6) && _0x6a0db0(_0x4a582a + (_0x53ad48 - _0x41f0b6), {
        'persist': !![]
      });
    };
    _0x2aa431?.();
    _0x2aa431 = () => _0x2b51b5({});
    document?.['addEventListener']?.('pointermove', _0x52a788);
    document?.['addEventListener']?.("pointerup", _0x2b51b5);
  }
  function _0xe8d8d9() {
    _0x1b12e2["invalidate"]();
    _0x289dad();
    _0x265548["startNewConversation"]?.();
    _0x914e27({
      'preserveNotice': !![],
      'restorePendingInputRefs': !![]
    });
    _0x1ad907(![]);
    setEditorText(_0x25fb20, '');
    _0x4e59da();
    _0x50c239(![]);
    _0x2c2d95["hidden"] = !![];
    _0x5c3b58(a849_0x59861c("newConversationNotice"));
  }
  function _0x1eaedf(_0x382e94) {
    if (!_0x265548["switchConversation"]?.(_0x382e94)) {
      return;
    }
    _0x1b12e2["invalidate"]();
    _0x289dad();
    setEditorText(_0x25fb20, '');
    _0x4e59da();
    _0x50c239(![]);
    _0x2c2d95['hidden'] = !![];
    _0x914e27({
      'restorePendingInputRefs': !![]
    });
    _0x1ad907(![]);
  }
  function _0x3de0cd(_0x2a4bd7) {
    const _0x367c71 = _0x2a4bd7 === _0x265548["getActiveConversation"]?.()?.['id'];
    _0x367c71 && (_0x1b12e2["invalidate"](), _0x289dad());
    _0x265548["deleteConversation"]?.(_0x2a4bd7);
    _0x367c71 && (setEditorText(_0x25fb20, ''), _0x4e59da(), _0x50c239(![]), _0x914e27({
      'restorePendingInputRefs': !![]
    }), _0x1ad907(![]));
    renderHistory(_0x2c2d95, _0x265548, {
      'onSelect': _0x1eaedf,
      'onDelete': _0x3de0cd
    });
  }
  async function _0x295355(_0x2b0f62, _0x1c1f55) {
    if (typeof _0x265548?.['updatePendingGenerationParams'] !== 'function') {
      return;
    }
    const _0x27a64 = _0x1b12e2["capture"]();
    _0x1ad907(!![]);
    try {
      const _0x47f9d3 = await _0x265548['updatePendingGenerationParams']({
        'params': {
          [_0x2b0f62]: _0x1c1f55
        }
      });
      if (!_0x1b12e2["isCurrent"](_0x27a64) || _0x47f9d3?.["stale"]) {
        return;
      }
      if (_0x47f9d3?.['ok'] && _0x47f9d3["plan"]) {
        renderPlanPreview(_0x49aea9, _0x47f9d3["plan"], {
          'onParamChange': _0x295355,
          'onOpenParamOptions': _0x27a727
        });
        _0x576f7a?.["acknowledgeSessionState"]?.();
        _0x5c3b58('');
        return;
      }
      _0x5c3b58(_0x47f9d3?.['message'] || _0x47f9d3?.['reply'] || a849_0x59861c('paramUpdateFailed'));
    } catch (_0x2f1017) {
      if (_0x1b12e2["isCurrent"](_0x27a64)) {
        _0x5c3b58(_0x2f1017?.["message"] || a849_0x59861c("paramUpdateFailed"));
      }
    } finally {
      if (_0x1b12e2['isCurrent'](_0x27a64)) {
        _0x1ad907(![]);
      }
    }
  }
  function _0x34461c(_0x3dfb74) {
    if (_0x3dfb74?.['stale']) {
      return;
    }
    if (_0x3dfb74?.["notice"]) {
      _0x5c3b58(_0x3dfb74["notice"]);
    }
    _0x3dfb74?.["reply"] && !_0x3dfb74['assistantHandled'] && _0x576f7a["appendMessage"]("assistant", _0x3dfb74["reply"], {
      'diagnostic': _0x3dfb74["diagnostic"] || null
    });
    Array["isArray"](_0x3dfb74?.['taskMessages']) && _0x3dfb74["taskMessages"]["forEach"](_0x34d009 => _0x1dc279(_0x34d009));
    _0x511e73["hidden"] = _0x28d712["children"]["length"] > 0x0;
    const _0x2de642 = _0x3dfb74?.["status"] === "need_confirmation" ? _0x3dfb74?.["plan"] || null : null;
    renderPlanPreview(_0x49aea9, _0x2de642, {
      'onParamChange': _0x295355,
      'onOpenParamOptions': _0x27a727
    });
    _0x390827(_0x3dfb74);
    renderRecovery(_0x4f47a7, _0x3dfb74, _0x265548, _0x34461c, _0x1ad907, {
      'editor': _0x25fb20,
      'setNotice': _0x5c3b58
    });
    _0x6373d1['hidden'] = _0x3dfb74?.["status"] !== "need_confirmation";
    _0x576f7a["renderRunSteps"](_0x265548?.["sessionStore"]?.["getState"]?.() || {});
    _0x48bd85({
      'clearWhenMissing': !![]
    });
    _0x576f7a?.['acknowledgeSessionState']?.({
      'taskMessages': _0x3dfb74?.["taskMessages"] || []
    });
  }
  function _0x390827(_0x2b064a) {
    renderAgentConversationChoices(_0x163bd3, _0x2b064a, _0x265548, _0x34461c, _0x2ef972 => _0x1ad907(_0x2ef972, {
      'stoppable': _0x2ef972 === !![]
    }), {
      'onAnswer': _0x24daae => {
        if (!_0x24daae) {
          return;
        }
        const _0x53a66c = _0xf866c2["slice"]();
        _0x4e59da();
        _0x576f7a["appendMessage"]("user", _0x24daae, {
          'inputRefs': _0x53a66c
        });
        _0x511e73["hidden"] = !![];
      },
      'onWaitingStart': () => _0x576f7a["appendWaiting"](),
      'onWaitingEnd': _0x46ef24 => _0x576f7a["removeWaiting"](_0x46ef24)
    });
  }
  async function _0x2f18f7() {
    const _0x551c27 = getEditorText(_0x25fb20);
    if (!_0x551c27) {
      return;
    }
    const _0x36a401 = _0x1b12e2["capture"]();
    _0x5c6129();
    _0x5c3b58('');
    _0x289dad();
    const _0x237e42 = _0xf866c2["slice"]();
    const _0x3b8083 = _0x4dff54["consumeDocuments"]();
    const _0xd22b90 = [..._0x237e42, ..._0x3b8083["displayRefs"]];
    _0x4e59da();
    setEditorText(_0x25fb20, '');
    _0x50c239(![]);
    _0x393a7f['close']();
    _0x156b87(!![]);
    _0x576f7a["appendMessage"]("user", _0x551c27, {
      'inputRefs': _0xd22b90
    });
    _0x511e73['hidden'] = !![];
    _0x163bd3["hidden"] = !![];
    _0x1ad907(!![], {
      'stoppable': !![]
    });
    const _0x12f943 = _0x576f7a["appendWaiting"]();
    try {
      const _0x3c92de = await _0x265548['handleUserMessage'](_0x551c27, {
        'inputRefs': _0x237e42,
        ...(_0x3b8083["files"]["length"] > 0x0 ? {
          'documentFiles': _0x3b8083["files"],
          'displayInputRefs': _0xd22b90
        } : {})
      });
      if (_0x1b12e2['isCurrent'](_0x36a401)) {
        _0x34461c(_0x3c92de);
      }
    } catch (_0x1578b1) {
      if (!_0x1b12e2["isCurrent"](_0x36a401)) {
        return;
      }
      _0x576f7a["appendMessage"]("assistant", _0x1578b1?.["message"] || "Agent failed.");
    } finally {
      if (_0x1b12e2["isCurrent"](_0x36a401)) {
        const _0x3bd8eb = Boolean(_0x12f943["parentNode"]);
        _0x576f7a['removeWaiting'](_0x12f943);
        if (_0x3bd8eb) {
          _0x1ad907(![]);
        }
      }
    }
  }
  const _0x359de1 = _0x596d0f => {
    _0x596d0f["stopPropagation"]();
    _0x14c3a0();
  };
  fabBtnEl["addEventListener"]("click", _0x359de1);
  _0x5c0b25["addEventListener"]("click", () => _0xe1b1dd(![]));
  _0x201b95['addEventListener']("click", _0xe8d8d9);
  _0x261e3c["addEventListener"]('click', _0x440e53 => {
    _0x440e53["stopPropagation"]?.();
    const _0x5e4a0a = !isAgentPopoverOpen(_0x2c2d95);
    setMenuOpen(_0x2c2d95, _0x5e4a0a, _0x179756);
    _0x5e4a0a && renderHistory(_0x2c2d95, _0x265548, {
      'onSelect': _0x1eaedf,
      'onDelete': _0x3de0cd
    });
  });
  _0x2b3328['addEventListener']("click", _0x3872a6 => {
    const _0x291380 = _0x3872a6["target"]?.["closest"]?.('.agent-quick-card');
    if (!_0x291380) {
      return;
    }
    setEditorText(_0x25fb20, _0x291380["dataset"]["prompt"] || _0x291380["textContent"] || '');
    _0x25fb20['focus']();
  });
  _0x2b3328["addEventListener"]("scroll", _0x3ffb01);
  _0x2b3328["addEventListener"]("wheel", _0x570337);
  _0x15f0a1?.["addEventListener"]?.('resize', _0x3ffb01);
  _0x398409["addEventListener"]("click", _0x2d4e12 => {
    const _0x196854 = _0x2d4e12["target"]?.["closest"]?.("[data-agent-custom-delete-action-id]");
    if (_0x196854) {
      _0x2d4e12["preventDefault"]?.();
      _0x2d4e12["stopPropagation"]?.();
      _0x40a07a(_0x196854['dataset']['agentCustomDeleteActionId']);
      return;
    }
    const _0x5c02e2 = _0x2d4e12["target"]?.["closest"]?.('[data-agent-custom-action-id]');
    const _0xd5bb6e = String(_0x5c02e2?.["dataset"]?.['agentCustomActionId'] || '')["trim"]();
    _0x21f7e9(_0xd5bb6e);
  });
  _0x2409bc["addEventListener"]("click", () => {
    const _0x56f951 = getEditorText(_0x25fb20);
    _0x5a5311(_0x56f951 ? {
      'label': truncateUiText(_0x56f951, 0x12),
      'prompt': _0x56f951
    } : {});
    _0x3fb56c["focus"]?.();
  });
  _0x3bdf58["addEventListener"]("click", _0x527c05);
  _0x596305["addEventListener"]("click", () => {
    _0x50c239(![]);
    _0x25fb20["focus"]();
  });
  _0x37fd1f["addEventListener"]("click", _0x35f9a3 => {
    _0x35f9a3["stopPropagation"]();
    setMenuOpen(_0x1e6c77, !_0x1e6c77["classList"]["contains"]("show"), _0x179756);
  });
  _0x1e6c77['addEventListener']("click", _0x4081c7 => {
    const _0x416497 = _0x4081c7["target"]?.["closest"]?.("[data-placeholder-action]");
    if (!_0x416497) {
      return;
    }
    _0x4081c7["stopPropagation"]?.();
    const _0x33bcc6 = _0x416497["dataset"]["placeholderAction"];
    if (_0x33bcc6 === "upload") {
      _0x4dff54["openMaterialPicker"]();
    } else {
      if (_0x33bcc6 === "document") {
        _0x4dff54['openDocumentPicker']();
      } else {
        if (_0x33bcc6 === 'custom') {
          _0x393a7f["close"]();
          _0x255e00({
            'prefillFromInput': !![]
          });
        } else {
          _0x33bcc6 === "skills" && _0x3b2b67();
        }
      }
    }
    _0x1e6c77["classList"]["remove"]("show");
  });
  _0x552f5c['addEventListener']("click", _0x485a3c => {
    _0x485a3c["stopPropagation"]?.();
    _0x433f14();
  });
  _0x552f5c["addEventListener"]('keydown', _0xa6f332 => {
    if (_0xa6f332["key"] !== "Enter" && _0xa6f332["key"] !== '\x20') {
      return;
    }
    _0xa6f332["preventDefault"]?.();
    _0x433f14();
  });
  _0x2d8739['addEventListener']("click", _0x121c5c => {
    const _0x21cd7d = _0x121c5c["target"]?.["closest"]?.("[data-input-ref-remove]");
    const _0x47ec2d = String(_0x21cd7d?.['dataset']?.["inputRefRemove"] || '')["trim"]();
    if (!_0x47ec2d) {
      return;
    }
    _0xf866c2 = _0xf866c2["filter"](_0x57c7e4 => _0x57c7e4["nodeId"] !== _0x47ec2d);
    _0x4dff54["removeDocument"](_0x47ec2d);
    _0x43043c();
  });
  _0x555443["addEventListener"]("click", _0x290ba7 => {
    if (_0x199045["hidden"]) {
      return;
    }
    _0x290ba7["stopPropagation"]();
    setMenuOpen(_0x15622b, !_0x15622b["classList"]['contains']('show'), _0x179756);
  });
  _0x15622b["addEventListener"]("click", _0x431993 => {
    const _0x3cb844 = _0x431993["target"]?.["closest"]?.("[data-execution-mode]");
    if (!_0x3cb844) {
      return;
    }
    const _0x4c9eac = normalizeAgentExecutionMode(_0x3cb844['dataset']["executionMode"]);
    const _0x690271 = _0x4919fb?.['updateSettings']?.({
      'executionMode': _0x4c9eac
    }) || {
      'executionMode': _0x4c9eac
    };
    _0x2caa6e['textContent'] = getAgentExecutionModeLabel(_0x690271["executionMode"]);
    _0x15622b["querySelectorAll"]('[data-execution-mode]')['forEach'](_0x431c75 => _0x431c75['classList']['toggle']("active", _0x431c75["dataset"]["executionMode"] === _0x690271["executionMode"]));
    _0x15622b["classList"]["remove"]("show");
    _0x5c3b58(a849_0x59861c("executionModeSaved"));
  });
  _0x49b2ec['addEventListener']("submit", _0x5160aa => {
    _0x5160aa['preventDefault']();
    if (_0x69b3e3) {
      return;
    }
    _0x2f18f7();
  });
  _0x1ae736["addEventListener"]("click", () => {
    const _0x495880 = _0x265548["stop"]?.();
    _0x28d712["querySelectorAll"]?.(".agent-message--typing")?.['forEach'](_0x109cec => _0x576f7a["removeWaiting"](_0x109cec));
    _0x1ad907(![]);
    _0x5c3b58(_0x495880?.["notice"] || a849_0x59861c('stopRequested'));
  });
  _0x25fb20['addEventListener']('input', () => {
    if (surface["textOnly"]) {
      return;
    }
    const _0xf72233 = getEditorText(_0x25fb20)["match"](/^\/([^\s]*)$/);
    if (!_0xf72233) {
      setMenuOpen(_0x35c427['menu'], ![], _0x179756);
      return;
    }
    _0x393a7f["close"]();
    _0x50c239(![]);
    _0x35c427["openSlash"](_0xf72233[0x1]);
    setMenuOpen(_0x35c427["menu"], !![], _0x179756);
  });
  _0x25fb20["addEventListener"]("keydown", _0x292e1a => {
    if (isAgentPopoverOpen(_0x35c427["menu"]) && !_0x292e1a["isComposing"]) {
      if (_0x292e1a["key"] === "ArrowDown" || _0x292e1a["key"] === "ArrowUp") {
        _0x292e1a["preventDefault"]();
        _0x35c427["moveActive"](_0x292e1a["key"] === "ArrowUp" ? -0x1 : 0x1);
        return;
      }
      if (_0x292e1a['key'] === "Enter" && !_0x292e1a['shiftKey'] || _0x292e1a["key"] === 'Tab') {
        _0x292e1a["preventDefault"]();
        _0x35c427["chooseActive"]();
        return;
      }
      if (_0x292e1a["key"] === "Escape") {
        _0x292e1a["preventDefault"]();
        setMenuOpen(_0x35c427["menu"], ![], _0x179756);
        _0x25fb20['focus']();
        return;
      }
    }
    if (_0x292e1a['key'] === "Enter" && !_0x292e1a["shiftKey"]) {
      _0x292e1a["preventDefault"]();
      if (_0x69b3e3) {
        return;
      }
      _0x2f18f7();
    }
  });
  _0x25fb20['addEventListener']('paste', _0x10417c => {
    if (surface["textOnly"]) {
      return;
    }
    const _0x34e28b = normalizePastedImageFile(getImageFileFromClipboardData(_0x10417c["clipboardData"]));
    if (!_0x34e28b) {
      return;
    }
    _0x10417c["preventDefault"]?.();
    _0x4dff54["uploadMaterialFile"](_0x34e28b);
  });
  _0x179756["addEventListener"]("copy", _0x2d1242);
  _0x179756["addEventListener"]("contextmenu", _0xb214c => {
    const _0x13f6d5 = _0xb214c["target"]?.['closest']?.(".agent-message-media-card");
    if (_0x13f6d5) {
      _0x521682(_0xb214c, [{
        'label': a849_0x59861c('imageResultOpen'),
        'icon': 'fullscreen',
        'shortcutActionId': 'context-agent-open-image',
        'action': () => _0x9f10c9(_0x13f6d5["dataset"]["imageUrl"] || '', _0x13f6d5['dataset']["imageName"] || '')
      }]);
      return;
    }
    const _0xd223d8 = _0xb214c["target"]?.["closest"]?.(".agent-history-item");
    if (_0xd223d8) {
      const _0x3f5ed7 = String(_0xd223d8['dataset']["conversationId"] || '')["trim"]();
      if (!_0x3f5ed7) {
        return;
      }
      _0x521682(_0xb214c, [{
        'label': a849_0x59861c("historyOpen"),
        'icon': 'folder-open',
        'shortcutActionId': "context-agent-open-history",
        'action': () => _0x1eaedf(_0x3f5ed7)
      }, "sep", {
        'label': a849_0x59861c("historyDelete"),
        'icon': 'delete',
        'danger': !![],
        'shortcutActionId': "context-agent-delete-history",
        'action': () => _0x3de0cd(_0x3f5ed7)
      }]);
      return;
    }
    const _0x50b3fd = _0xb214c['target']?.['closest']?.(".agent-message");
    const _0x51fcc4 = _0x50b3fd ? _0x1731bc(_0x50b3fd) : '';
    const _0x7f2eef = _0x51fcc4 || String(_0x50b3fd?.["agentMessageCopyText"] || '')['trim']();
    if (!_0x7f2eef) {
      return;
    }
    _0x521682(_0xb214c, [{
      'label': a849_0x59861c(_0x51fcc4 ? "copySelection" : "copyMessage"),
      'icon': 'copy',
      'kbd': 'Ctrl\x20C',
      'shortcutActionId': "copy",
      'action': () => void _0x4a0617(_0x7f2eef)
    }]);
  });
  _0x179756["addEventListener"]("pointerdown", _0x217ba3 => _0x217ba3['stopPropagation']());
  _0x179756['addEventListener']("click", _0x3c830d => {
    if (isAgentMenuSurface(_0x3c830d["target"])) {
      return;
    }
    closeFloatingMenus(_0x179756);
  });
  const _0x256e50 = _0x33d9df => {
    if (!_0x179756["contains"](_0x33d9df['target'])) {
      closeFloatingMenus(_0x179756);
    }
  };
  const _0x5b8971 = _0xd4a70b => {
    if (_0xd4a70b['key'] !== "Escape") {
      return;
    }
    if (!hasOpenFloatingMenus(_0x179756)) {
      return;
    }
    const _0x4d7cc2 = isAgentPopoverOpen(_0x35c427["menu"]);
    _0xd4a70b["preventDefault"]?.();
    closeFloatingMenus(_0x179756);
    if (_0x4d7cc2) {
      _0x25fb20["focus"]();
    }
  };
  document?.["addEventListener"]?.("click", _0x256e50);
  document?.["addEventListener"]?.("keydown", _0x5b8971);
  _0x5a3ad3['addEventListener']("pointerdown", _0x5b75c2);
  _0x5a3ad3["addEventListener"]("keydown", _0x10a4b6 => {
    if (_0x10a4b6["key"] !== "ArrowLeft" && _0x10a4b6['key'] !== "ArrowRight") {
      return;
    }
    _0x10a4b6["preventDefault"]();
    const _0xb43dd5 = _0x179756["getBoundingClientRect"]?.()["width"] || _0x179756["offsetWidth"] || 0x0;
    const _0x987a9c = _0x10a4b6["key"] === "ArrowLeft" ? 0x18 : -0x18;
    _0x6a0db0(_0xb43dd5 + _0x987a9c, {
      'persist': !![]
    });
  });
  _0x86de1a["addEventListener"]("click", async () => {
    if (_0x69b3e3) {
      return;
    }
    const _0x1ccbda = _0x1b12e2["capture"]();
    const _0xd14517 = a849_0x59861c("confirmUserMessage");
    _0x576f7a["appendMessage"]("user", _0xd14517);
    _0x511e73['hidden'] = !![];
    _0x6373d1['hidden'] = !![];
    _0x1ad907(!![], {
      'stoppable': !![]
    });
    const _0x4d8d40 = _0x576f7a["appendWaiting"]();
    try {
      const _0x4b7418 = await _0x265548["confirmPendingPlan"]({
        'displayAnswer': _0xd14517
      });
      if (_0x1b12e2["isCurrent"](_0x1ccbda) && _0x4d8d40["parentNode"]) {
        _0x34461c(_0x4b7418);
      }
    } catch (_0x59705a) {
      if (!_0x1b12e2['isCurrent'](_0x1ccbda) || !_0x4d8d40["parentNode"]) {
        return;
      }
      _0x576f7a["appendMessage"]('assistant', _0x59705a?.["message"] || "Agent confirmation failed.");
    } finally {
      _0x1b12e2["isCurrent"](_0x1ccbda) && _0x4d8d40["parentNode"] && (_0x576f7a['removeWaiting'](_0x4d8d40), _0x1ad907(![]));
    }
  });
  _0xab1eed['addEventListener']("click", () => {
    if (_0x69b3e3) {
      return;
    }
    _0x6373d1["hidden"] = !![];
    _0x1ad907(!![]);
    try {
      _0x34461c(_0x265548["cancelPendingPlan"]());
    } finally {
      _0x1ad907(![]);
    }
  });
  _0xa85738 = createAgentConversationActions({
    'replyActions': replyActions,
    'messagesEl': _0x28d712,
    'runtime': _0x265548,
    'getBusy': () => _0x69b3e3,
    'setBusy': _0x1ad907,
    'getPresentation': () => _0x576f7a,
    'onResult': _0x34461c,
    'setNotice': _0x5c3b58
  });
  _0x576f7a = createAgentConversationPresentation({
    'messagesEl': _0x28d712,
    'runStepsEl': _0x1238ba,
    'sessionStore': _0x265548["sessionStore"],
    'getHistory': _0xe10870,
    'onCopy': _0x4a0617,
    'onImagePreview': _0x9f10c9,
    'copyIconHtml': a849_0x10ac62("copy"),
    'onMessagesChanged': () => {
      _0x527774();
      _0xa85738["render"]();
      if (!_0x179756['classList']["contains"]("is-open")) {
        _0x1b12e2['rememberClosed']();
      }
    },
    'onConversationInvalidated': ({
      historyOnly = ![]
    } = {}) => {
      if (!historyOnly) {
        return _0x914e27({
          'preserveNotice': !![]
        });
      }
      _0x576f7a?.['render']({
        'history': _0xe10870(),
        'sessionSnapshot': _0x265548?.['sessionStore']?.["getState"]?.() || {}
      });
      _0x527774();
    }
  });
  const _0x47d4f5 = onLocaleChange(_0x4c118c);
  _0x914e27({
    'restorePendingInputRefs': !![]
  });
  return {
    'panel': _0x179756,
    'sendMessage': _0x38af8c => {
      if (_0x69b3e3) {
        return;
      }
      setEditorText(_0x25fb20, _0x38af8c);
      return _0x2f18f7();
    },
    'open': () => _0xe1b1dd(!![]),
    'close': () => _0xe1b1dd(![]),
    'toggle': _0x14c3a0,
    'collapse': () => _0x85f59b(!![]),
    'expand': () => _0x85f59b(![]),
    'reset': _0xe8d8d9,
    'setWidth': _0x40cdc7 => _0x6a0db0(_0x40cdc7, {
      'persist': !![]
    }),
    'destroy': () => {
      _0x1b12e2['destroy']();
      _0x2aa431?.();
      _0x5ffb95();
      _0x3c6208?.["destroy"]?.();
      _0x35c427['destroy']();
      _0x393a7f['destroy']();
      _0x576f7a?.["destroy"]?.();
      _0xa85738?.['destroy']();
      _0x47d4f5();
      _0x289dad();
      _0x4dff54["clearDocuments"]({
        'notify': ![]
      });
      _0x32c721();
      document?.["removeEventListener"]?.('click', _0x256e50);
      document?.["removeEventListener"]?.('keydown', _0x5b8971);
      _0x15f0a1?.['removeEventListener']?.("resize", _0x3ffb01);
      fabBtnEl["removeEventListener"]("click", _0x359de1);
      stateRoot["classList"]?.['remove']?.("agent-sidebar-open", "agent-sidebar-collapsed", "agent-sidebar-resizing");
      fabBtnEl['classList']?.["remove"]?.('is-agent-open');
      _0x179756["remove"]?.();
      _0x1a4e2d["remove"]?.();
    }
  };
}