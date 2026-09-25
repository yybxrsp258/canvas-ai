import { renderRequestDebugButton } from '../debugRequestWindow.js';
import { renderAIGenImageModelSelectorMarkup } from '../../components/aigenImage/modelSelector.js';
import { renderAudioPlaybackSurface } from '../../components/audio-node/audioPlaybackSurface.js';
import { getWorkspaceAssetAppearanceStats, getWorkspaceAssetAppearances, getWorkspaceAssetBaseAppearance } from '../workspaceAssetAppearance.js';
import { renderWorkspaceAssetCard, renderWorkspaceAssetLoadingOverlay, renderWorkspaceCardDeleteControl, renderWorkspacePreviewArrow } from '../workspaceAssetPresentation.js';
import { renderWorkspaceActionIcon } from '../workspaceActionIcons.js';
import { renderWorkspaceImageDownloadButton } from '../workspaceImageDownload.js';
import { PERSON_REPLACEMENT_CHARACTER_ASSET_PROMPT_PRESETS } from './personReplacementImageGeneration.js';
import { PERSON_REPLACEMENT_DEFAULT_IMAGE_MODEL_ID } from './personReplacementProject.js';
import { getPersonReplacementAudioSavedName, getPersonReplacementLibraryAudioRef } from './personReplacementVoiceLibrary.js';
function normalizeText(_0x454bef) {
  return String(_0x454bef ?? '')['trim']();
}
function escapeHtml(_0x48280d) {
  return String(_0x48280d ?? '')["replaceAll"]('&', '&amp;')["replaceAll"]('<', "&lt;")["replaceAll"]('>', "&gt;")['replaceAll']('\x22', '&quot;')["replaceAll"]('\x27', '&apos;');
}
export function buildPersonReplacementAssetViewState(_0x1eea71) {
  const _0x48020c = ["character", "scene", "audio", 'library']['includes'](_0x1eea71['workspace']['characterAssetTab']) ? _0x1eea71["workspace"]["characterAssetTab"] : "character";
  const _0xb481ae = _0x48020c === 'library';
  const _0xec6795 = _0x48020c === 'scene';
  const _0x4bbec1 = _0x48020c === "audio";
  const _0x1d6e05 = _0xb481ae ? _0x1eea71["libraryAssets"] : _0x4bbec1 ? _0x1eea71["audioAssets"] : _0xec6795 ? _0x1eea71["scenes"] : _0x1eea71['characters'];
  const _0x2218e5 = _0xb481ae ? _0x1eea71['workspace']["selectedLibraryAssetId"] : _0x4bbec1 ? _0x1eea71["workspace"]['selectedAudioAssetId'] : _0xec6795 ? _0x1eea71["workspace"]["selectedSceneId"] : _0x1eea71["workspace"]['selectedCharacterId'];
  const _0x4157e2 = _0x1d6e05["find"](_0x56ad27 => _0x56ad27['id'] === _0x2218e5) || _0x1d6e05[0x0] || null;
  return {
    'data': {
      'assets': _0x1d6e05,
      'project': {}
    },
    'assetFilter': _0x48020c,
    'selectedAssetId': _0x4157e2?.['id'] || '',
    'selectedAssetIds': _0x4bbec1 ? [] : _0x1eea71["workspace"]['selectedAssetIds'],
    'assetSelectionMode': _0x4bbec1 ? ![] : _0x1eea71['workspace']["assetSelectionMode"],
    'assetAppearanceIndexes': _0x1eea71['workspace']["assetAppearanceIndexes"],
    'assetAppearanceMotion': '',
    'assetSplitRatio': _0x1eea71["workspace"]["assetSplitRatio"],
    'assetDetailSplitRatio': _0x1eea71["workspace"]["assetDetailSplitRatio"],
    'generatingAppearanceKeys': _0x1eea71["workspace"]['generatingAppearanceKeys'],
    'isBatchGenerating': ![],
    'batchGeneratingAssetIds': [],
    'batchGeneratingAppearanceKeys': [],
    'characterVoiceEditor': null,
    'characterVoicePanelMotion': '',
    'models': {
      'image': _0x1eea71["settings"]['characterImageModelId'] || PERSON_REPLACEMENT_DEFAULT_IMAGE_MODEL_ID
    },
    'imageProvider': _0x1eea71["settings"]["characterImageProvider"] || "apimart",
    'imageGenerationParams': _0x1eea71["settings"]["characterImageGenerationParams"] || {},
    'imageGenerationParamsByModel': _0x1eea71['settings']["characterImageGenerationParamsByModel"] || {},
    'imageProviderProfileId': _0x1eea71["settings"]["characterImageProviderProfileId"] || '',
    'imageProviderProfileIdByModel': _0x1eea71["settings"]["characterImageProviderProfileIdByModel"] || {},
    'assetVoiceUploadLabel': '添加声音',
    'allowDeleteAssetAppearance': !_0xec6795 && !_0x4bbec1,
    'allowDeleteAssetCard': !_0xb481ae,
    'allowAssetRename': !_0xb481ae && !_0xec6795 && !_0x4bbec1,
    'allowAssetStyleReference': ![],
    'hideAssetRoleTag': !![],
    'hideAssetNameTooltip': !![],
    'assetGenerateLabel': '生成素材图',
    'assetPromptPresetId': _0x1eea71["workspace"]["assetPromptPresetId"],
    'assetPromptPresets': PERSON_REPLACEMENT_CHARACTER_ASSET_PROMPT_PRESETS,
    'assetPromptPresetLabel': "图1 人设参考"
  };
}
function renderPromptText(_0x448ee1) {
  return escapeHtml(_0x448ee1)["replace"](/\r\n?|\n/g, "<br>");
}
export function readPersonReplacementAssetPromptText(_0x4fefe4 = null) {
  if (!_0x4fefe4) {
    return '';
  }
  const _0x98bcf4 = [];
  const _0x3ca862 = _0x202092 => {
    if (_0x202092) {
      _0x98bcf4['push'](String(_0x202092));
    }
  };
  const _0x4028b1 = (_0x182bc0, {
    root = ![]
  } = {}) => {
    const _0x2eb2c7 = Number(_0x182bc0?.["nodeType"]);
    if (_0x2eb2c7 === 0x3) {
      _0x3ca862(_0x182bc0["textContent"] || '');
      return;
    }
    if (_0x2eb2c7 !== 0x1 && !root) {
      return;
    }
    const _0x1128e3 = String(_0x182bc0?.['tagName'] || '')["toUpperCase"]();
    if (_0x1128e3 === 'BR') {
      _0x3ca862('\x0a');
      return;
    }
    const _0x2ee3f9 = !root && ["DIV", 'P']["includes"](_0x1128e3);
    if (_0x2ee3f9 && _0x98bcf4['length'] && !_0x98bcf4['at'](-0x1)["endsWith"]('\x0a')) {
      _0x3ca862('\x0a');
    }
    Array['from'](_0x182bc0?.["childNodes"] || [])['forEach'](_0x3315e3 => _0x4028b1(_0x3315e3));
    if (_0x2ee3f9 && _0x98bcf4["length"] && !_0x98bcf4['at'](-0x1)["endsWith"]('\x0a')) {
      _0x3ca862('\x0a');
    }
  };
  _0x4028b1(_0x4fefe4, {
    'root': !![]
  });
  return _0x98bcf4["join"]('')["replace"](/\u00a0/g, '\x20')["replace"](/\n{3,}/g, '\x0a\x0a')['replace'](/\n$/g, '');
}
function getSelectedAppearanceIndex(_0x1ffbef = {}, _0x131ed0 = {}) {
  const _0x393599 = getWorkspaceAssetAppearances(_0x131ed0);
  if (!_0x393599["length"]) {
    return 0x0;
  }
  const _0x760a55 = Math['trunc'](Number(_0x1ffbef?.["assetAppearanceIndexes"]?.[_0x131ed0['id']]) || 0x0);
  return Math['max'](0x0, Math["min"](_0x393599["length"] - 0x1, _0x760a55));
}
function getSelectedAppearance(_0x5aa6b2 = {}, _0x357a10 = {}) {
  const _0x4acccb = getWorkspaceAssetAppearances(_0x357a10);
  return _0x4acccb[getSelectedAppearanceIndex(_0x5aa6b2, _0x357a10)] || getWorkspaceAssetBaseAppearance(_0x357a10) || _0x4acccb[0x0] || null;
}
function isAppearanceGenerating(_0x3a8853 = {}, _0x15340b = {}, _0x578bc2 = {}) {
  if (normalizeText(_0x578bc2?.["error"]) || normalizeText(_0x578bc2?.["imageUrl"])) {
    return ![];
  }
  const _0x57250c = normalizeText(_0x15340b?.['id']) + ':' + normalizeText(_0x578bc2?.['id']);
  return Boolean(_0x57250c !== ':' && (_0x3a8853?.["generatingAppearanceKeys"]?.["includes"]?.(_0x57250c) || _0x3a8853?.["isBatchGenerating"] === !![] && _0x3a8853?.['batchGeneratingAppearanceKeys']?.["includes"]?.(_0x57250c)));
}
function isAssetGenerating(_0x399b55 = {}, _0x40c25b = {}) {
  const _0x1f5b1c = normalizeText(_0x40c25b?.['id']);
  if (!_0x1f5b1c) {
    return ![];
  }
  if (_0x399b55?.["isBatchGenerating"] === !![] && _0x399b55?.["batchGeneratingAssetIds"]?.["includes"]?.(_0x1f5b1c)) {
    return !![];
  }
  const _0x422059 = new Map(getWorkspaceAssetAppearances(_0x40c25b)['map'](_0x54682e => [normalizeText(_0x54682e?.['id']), _0x54682e]));
  return (Array['isArray'](_0x399b55?.["generatingAppearanceKeys"]) ? _0x399b55["generatingAppearanceKeys"] : [])["some"](_0x12e65d => {
    const _0x3d3e28 = normalizeText(_0x12e65d);
    if (!_0x3d3e28["startsWith"](_0x1f5b1c + ':')) {
      return ![];
    }
    const _0x2804e7 = _0x422059["get"](_0x3d3e28["slice"](_0x1f5b1c["length"] + 0x1));
    return _0x2804e7 && !normalizeText(_0x2804e7["error"]);
  });
}
function hasVoiceReference(_0x1268f3 = {}) {
  return Boolean(normalizeText(_0x1268f3?.["voiceReference"]?.["audioUrl"] || _0x1268f3?.["voiceReference"]?.["localPath"] || _0x1268f3?.['voiceRef']));
}
export function renderPersonReplacementVoicePreviewPlayer(_0x3a1a6c = {}, {
  className = '',
  showWaveform = !![]
} = {}) {
  if (_0x3a1a6c?.["kind"] !== "character" || _0x3a1a6c?.["isLibraryAsset"] || !hasVoiceReference(_0x3a1a6c)) {
    return '';
  }
  const _0x4a387e = normalizeText(className);
  return '<span\x20class=\x22story-character-voice-name-player' + (_0x4a387e ? '\x20' + escapeHtml(_0x4a387e) : '') + '\x22\x20data-story-character-voice-player=\x22' + escapeHtml(_0x3a1a6c['id']) + "\">\n    <button type=\"button\" class=\"story-character-voice-name-play\" data-story-action=\"play-character-voice\" data-story-voice-asset-id=\"" + escapeHtml(_0x3a1a6c['id']) + '\x22\x20aria-label=\x22播放\x20' + escapeHtml(_0x3a1a6c["name"]) + " 的声音参考\">\n      <svg class=\"story-character-voice-name-play-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M7 5.4v9.2l7.2-4.6L7 5.4Z\"/></svg>\n      <svg class=\"story-character-voice-name-pause-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M6.5 5.5h2.3v9H6.5zM11.2 5.5h2.3v9h-2.3z\"/></svg>\n    </button>\n    " + (showWaveform ? "<span class=\"story-character-voice-waveform\" data-story-character-voice-waveform hidden aria-hidden=\"true\">" + Array['from']({
    'length': 0xc
  }, () => "<i></i>")["join"]('') + '</span>' : '') + "\n  </span>";
}
function renderVoiceCapsule(_0x3674bd = {}, _0x32141c = "添加声音") {
  if (_0x3674bd?.["kind"] !== 'character' || _0x3674bd?.["isLibraryAsset"]) {
    return '';
  }
  const _0x43570f = hasVoiceReference(_0x3674bd);
  return '<span\x20class=\x22person-replacement-add-voice-menu-wrap\x22>\x0a\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-character-voice-capsule\x20' + (_0x43570f ? 'has-reference' : "is-missing") + "\" data-story-character-voice-capsule data-story-action=\"toggle-character-voice-menu\" aria-label=\"" + escapeHtml(_0x32141c) + "\" aria-haspopup=\"menu\" aria-expanded=\"false\">\n      <span class=\"story-character-voice-icon\"><svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 4v16M8.5 7.5v9M15.5 8.5v7M5 10v4M19 10v4\"/></svg></span>\n      <span>" + escapeHtml(_0x32141c) + "</span>\n    </button>\n    <span class=\"person-replacement-add-voice-menu\" role=\"menu\" aria-label=\"添加人物声音\" aria-hidden=\"true\">\n      <button type=\"button\" role=\"menuitem\" data-story-action=\"upload-character-voice\">上传声音</button>\n      <button type=\"button\" role=\"menuitem\" data-story-action=\"choose-character-voice-from-library\">从项目音频添加</button>\n    </span>\n  </span>";
}
function renderPromptPresetPicker(_0x5e65d0 = {}, _0x104198 = '') {
  if (_0x104198 !== "character") {
    return '';
  }
  const _0x3b6971 = Array["isArray"](_0x5e65d0["assetPromptPresets"]) ? _0x5e65d0["assetPromptPresets"] : [];
  if (!_0x3b6971["length"]) {
    return '';
  }
  const _0x3c57e4 = _0x3b6971["find"](_0x4dc031 => _0x4dc031['id'] === _0x5e65d0["assetPromptPresetId"]) || _0x3b6971[0x0];
  const _0xc2c86c = normalizeText(_0x5e65d0["assetPromptPresetLabel"]) || "生成参考";
  return '<div\x20class=\x22story-home-param-picker\x20story-asset-preset-picker\x22\x20data-story-asset-preset-picker>\x0a\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-home-param-trigger\x20story-menu-trigger\x20story-asset-preset-trigger\x22\x20data-story-home-param-trigger=\x22asset-preset\x22\x20aria-haspopup=\x22listbox\x22\x20aria-expanded=\x22false\x22>\x0a\x20\x20\x20\x20\x20\x20<span>' + escapeHtml(_0xc2c86c) + "</span><strong>" + escapeHtml(_0x3c57e4?.["label"] || '选择预设') + "</strong>\n    </button>\n    <div class=\"story-home-param-popover story-asset-preset-popover\" role=\"listbox\" aria-label=\"" + escapeHtml(_0xc2c86c) + "\">\n      <strong>" + escapeHtml(_0xc2c86c) + "</strong>\n      <div class=\"story-asset-preset-options\">\n        " + _0x3b6971['map'](_0x11ccc6 => '<button\x20type=\x22button\x22\x20class=\x22story-asset-preset-option\x20floating-menu-item\x20has-subtitle\x20' + (_0x11ccc6['id'] === _0x3c57e4?.['id'] ? "active is-selected" : '') + "\" data-story-asset-preset-option=\"" + escapeHtml(_0x11ccc6['id']) + '\x22\x20data-story-asset-preset-kind=\x22character\x22\x20role=\x22option\x22\x20aria-selected=\x22' + (_0x11ccc6['id'] === _0x3c57e4?.['id']) + "\"><span class=\"fmi-content\"><span class=\"fmi-title\">" + escapeHtml(_0x11ccc6['label']) + '</span><small\x20class=\x22fmi-sub\x22>' + escapeHtml(_0x11ccc6['description']) + "</small></span></button>")["join"]('') + '\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</div>';
}
function renderPreviewActions({
  state = {},
  asset = {},
  appearance = {},
  readOnly = ![],
  generating = ![]
} = {}) {
  const _0x4c7c0f = renderWorkspaceImageDownloadButton({
    'action': "download-asset-image",
    'enabled': Boolean(normalizeText(appearance?.["imageUrl"]) && normalizeText(asset?.["mediaKind"])["toLowerCase"]() !== "video")
  });
  if (asset['isLibraryAsset'] || readOnly) {
    return _0x4c7c0f ? '<div\x20class=\x22story-asset-preview-actions\x22>' + _0x4c7c0f + "</div>" : '';
  }
  const _0x390e52 = appearance?.['totalAssetRef'];
  const _0x101979 = _0x390e52 ? "已加入总素材" : '将当前形象加入总素材';
  return "<div class=\"story-asset-preview-actions\">\n    " + _0x4c7c0f + "\n    <button type=\"button\" class=\"story-character-voice-upload-button story-add-to-library-button " + (_0x390e52 ? 'is-synced' : '') + '\x22\x20data-story-action=\x22add-asset-appearance-to-library\x22\x20aria-label=\x22' + _0x101979 + '\x22\x20title=\x22' + _0x101979 + '\x22\x20' + (generating || _0x390e52 ? 'disabled' : '') + '>' + renderWorkspaceActionIcon('addToLibrary') + '</button>\x0a\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-upload-replace\x20story-character-voice-upload-button\x22\x20data-story-action=\x22upload-asset\x22\x20aria-label=\x22上传替换图片\x22\x20title=\x22上传替换图片\x22\x20' + (generating ? "disabled" : '') + '>' + renderWorkspaceActionIcon("upload") + "</button>\n  </div>";
}
export function renderPersonReplacementAssetCard(_0x2b9a7f, _0x4423f6, {
  previewAppearance = null,
  statusText = '',
  cardStatusHtml = '',
  draggable = ![],
  cardClassName = '',
  cardAttributes = '',
  shellClassName = '',
  preserveShell = ![],
  accessoryHtml = '',
  cardMetaHtml = '',
  cardMediaHtml = '',
  fallbackImageUrl = '',
  workspaceAssetLibraryImage = ![]
} = {}) {
  const _0x4b72eb = _0x4423f6['isLibraryAsset'] ? [_0x4423f6] : getWorkspaceAssetAppearances(_0x4423f6);
  const _0x3789f2 = _0x4423f6["isLibraryAsset"] ? {
    'total': 0x1,
    'generated': _0x4423f6["imageUrl"] ? 0x1 : 0x0,
    'failed': 0x0,
    'pending': _0x4423f6["imageUrl"] ? 0x0 : 0x1
  } : getWorkspaceAssetAppearanceStats(_0x4423f6);
  const _0x4f6825 = previewAppearance || getWorkspaceAssetBaseAppearance(_0x4423f6) || _0x4b72eb["find"](_0x2c96d0 => normalizeText(_0x2c96d0?.["imageUrl"])) || _0x4b72eb[0x0] || _0x4423f6;
  const _0x33fcb7 = isAssetGenerating(_0x2b9a7f, _0x4423f6);
  const _0x40e11d = _0x2b9a7f?.["allowAssetRename"] === !![] && !_0x4423f6['isLibraryAsset'];
  const _0x5b124c = _0x40e11d ? "data-story-asset-name-id=\"" + escapeHtml(_0x4423f6['id']) + "\" aria-label=\"重命名" + escapeHtml(_0x4423f6["name"] || "未命名素材") + '\x22' : '';
  const _0x360ae0 = _0x2b9a7f?.["hideAssetRoleTag"] !== !![] && !["scene", "prop"]["includes"](normalizeText(_0x4423f6?.["kind"])) ? '<small>' + escapeHtml(_0x4423f6["role"] || '素材') + "</small>" : '';
  const _0x40369c = normalizeText(_0x4423f6["kind"])['toLowerCase']();
  const _0x52d9b4 = _0x40369c === "scene" ? '场景' : _0x40369c === "audio" ? '音频' : '人物';
  const _0x5c07f4 = _0x2b9a7f?.["allowDeleteAssetCard"] && !_0x4423f6["isLibraryAsset"] && !_0x2b9a7f["assetSelectionMode"] ? renderWorkspaceCardDeleteControl({
    'className': "story-asset-card-delete-trigger",
    'ariaLabel': '删除' + _0x52d9b4 + '\x20' + _0x4423f6["name"],
    'actionAttributes': {
      'data-story-action': "delete-asset-card",
      'data-story-asset-delete-id': _0x4423f6['id']
    },
    'disabled': _0x33fcb7
  }) : '';
  return renderWorkspaceAssetCard({
    'asset': _0x4423f6,
    'appearances': _0x4b72eb,
    'previewAppearance': _0x4f6825,
    'stats': _0x3789f2,
    'selected': _0x4423f6['id'] === _0x2b9a7f?.["selectedAssetId"],
    'selectionMode': _0x2b9a7f?.["assetSelectionMode"] === !![],
    'checked': _0x2b9a7f?.["selectedAssetIds"]?.["includes"]?.(_0x4423f6['id']) === !![],
    'loading': _0x33fcb7,
    'draggable': draggable,
    'promptPreview': _0x4f6825?.["prompt"] || _0x4423f6?.["prompt"] || '',
    'statusText': statusText,
    'cardStatusHtml': cardStatusHtml,
    'cardClassName': cardClassName,
    'cardAttributes': cardAttributes,
    'shellClassName': shellClassName,
    'preserveShell': preserveShell || _0x2b9a7f?.["allowDeleteAssetCard"] === !![] && !_0x4423f6['isLibraryAsset'],
    'accessoryHtml': accessoryHtml,
    'cardMetaHtml': cardMetaHtml,
    'cardMediaHtml': cardMediaHtml,
    'fallbackImageUrl': fallbackImageUrl,
    'workspaceAssetLibraryImage': workspaceAssetLibraryImage,
    'nameAttributes': _0x5b124c,
    'roleHtml': _0x360ae0,
    'deleteControlHtml': _0x5c07f4
  });
}
function renderAudioArtwork({
  compact = ![]
} = {}) {
  return "<span class=\"" + (compact ? "story-asset-card-image " : '') + "person-replacement-audio-artwork" + (compact ? '\x20is-compact' : '') + '\x22\x20role=\x22img\x22\x20aria-label=\x22音频素材\x22>\x0a\x20\x20\x20\x20<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20aria-hidden=\x22true\x22><path\x20d=\x22M5\x2010v4M8.5\x207.5v9M12\x204v16M15.5\x208.5v7M19\x2010v4\x22/></svg>\x0a\x20\x20\x20\x20<span>' + (compact ? '音频' : "声音素材") + '</span>\x0a\x20\x20</span>';
}
function getCharacterPreview(_0x19c927 = {}) {
  const _0x1d614e = getWorkspaceAssetBaseAppearance(_0x19c927) || getWorkspaceAssetAppearances(_0x19c927)['find'](_0x9853ec => normalizeText(_0x9853ec?.["imageUrl"]));
  return {
    'imageUrl': normalizeText(_0x1d614e?.["imageUrl"]),
    'name': normalizeText(_0x19c927["name"]) || '未命名人设'
  };
}
function getAudioAssetDisplayName(_0x1587d9 = {}) {
  return getPersonReplacementAudioSavedName(_0x1587d9);
}
export function renderPersonReplacementAudioAssetCard(_0x4692f2, _0x1305ee, {
  boundCharacters = [],
  showVoiceLibraryConfirm = ![]
} = {}) {
  const _0x5abda0 = Array["isArray"](boundCharacters) ? boundCharacters["length"] : 0x0;
  const _0x5646ad = getAudioAssetDisplayName(_0x1305ee);
  const _0x2b00ab = showVoiceLibraryConfirm ? '<button\x20type=\x22button\x22\x20class=\x22story-primary-button\x20person-replacement-audio-card-add-voice\x22\x20data-person-replacement-action=\x22confirm-character-voice-library\x22\x20data-person-replacement-audio-asset-id=\x22' + escapeHtml(_0x1305ee['id']) + '\x22\x20aria-label=\x22添加声音：' + escapeHtml(_0x5646ad) + "\">添加声音</button>" : '';
  return renderPersonReplacementAssetCard(_0x4692f2, {
    ..._0x1305ee,
    'name': _0x5646ad,
    'prompt': ''
  }, {
    'cardClassName': "person-replacement-audio-asset-card",
    'cardAttributes': 'data-person-replacement-audio-library-asset=\x22true\x22',
    'shellClassName': showVoiceLibraryConfirm ? "person-replacement-audio-asset-shell" : '',
    'accessoryHtml': _0x2b00ab,
    'cardMediaHtml': renderAudioArtwork({
      'compact': !![]
    }),
    'cardStatusHtml': "<span>" + (_0x5abda0 ? "已绑定 " + _0x5abda0 + " 个人设" : "未绑定人设") + "</span>"
  });
}
export function renderPersonReplacementAudioAssetDetail(_0x126751, {
  boundCharacters = [],
  selectedCharacterId = ''
} = {}) {
  if (!_0x126751) {
    return "<aside class=\"story-asset-detail story-empty-panel\">\n      <strong>暂无音频素材</strong>\n      <p>请先从总素材将声音加入当前项目。</p>\n    </aside>";
  }
  const _0x5d75f3 = normalizeText(_0x126751["audioUrl"] || _0x126751["sourceUrl"] || _0x126751["url"]);
  const _0x4aa55d = getAudioAssetDisplayName(_0x126751);
  const _0x544ec0 = Array["isArray"](boundCharacters) ? boundCharacters : [];
  const _0x23c0bf = _0x544ec0["find"](_0x11a8c6 => normalizeText(_0x11a8c6?.['id']) === normalizeText(selectedCharacterId)) || _0x544ec0[0x0] || null;
  const _0x23aa97 = _0x23c0bf ? getCharacterPreview(_0x23c0bf) : null;
  const _0x45d595 = _0x544ec0["length"] > 0x1;
  const _0x461113 = _0x23c0bf ? _0x544ec0["indexOf"](_0x23c0bf) : -0x1;
  const _0x258dff = _0x23aa97?.['imageUrl'] ? '<img\x20class=\x22story-asset-preview\x22\x20src=\x22' + escapeHtml(_0x23aa97["imageUrl"]) + '\x22\x20alt=\x22' + escapeHtml(_0x23aa97["name"]) + "\" loading=\"lazy\" decoding=\"async\">" : "<div class=\"story-asset-preview story-media-empty\" role=\"img\" aria-label=\"" + (_0x23c0bf ? "已绑定人设暂无图片" : '未绑定人设') + '\x22><span>' + (_0x23c0bf ? "暂无人设图片" : "未绑定人设") + "</span></div>";
  return "<aside class=\"story-asset-detail person-replacement-audio-detail\">\n    <div class=\"story-asset-preview-wrap person-replacement-audio-preview-wrap\" data-person-replacement-audio-bound-preview data-person-replacement-audio-bound-wheel=\"" + _0x45d595 + '\x22\x20' + (_0x45d595 ? "tabindex=\"0\" aria-label=\"滚动鼠标滚轮或按左右方向键切换已绑定人设\"" : 'aria-label=\x22' + (_0x23c0bf ? "已绑定 1 个人设" : "未绑定人设") + '\x22') + ">\n      <div class=\"story-asset-preview-slide\" data-person-replacement-audio-bound-character-id=\"" + escapeHtml(_0x23c0bf?.['id'] || '') + "\">\n        " + _0x258dff + "\n      </div>\n      " + (_0x45d595 ? '' + renderWorkspacePreviewArrow("previous", {
    'action': "previous-audio-bound-character",
    'label': "上一个已绑定人设",
    'actionAttributes': {
      'data-story-action': "previous-audio-bound-character"
    }
  }) + renderWorkspacePreviewArrow('next', {
    'action': 'next-audio-bound-character',
    'label': "下一个已绑定人设",
    'actionAttributes': {
      'data-story-action': "next-audio-bound-character"
    }
  }) : '') + '\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-asset-preview-caption\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-asset-caption-heading\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22story-asset-caption-title\x22><strong>' + escapeHtml(_0x4aa55d) + "</strong></span>\n        </div>\n        <span>" + (_0x23aa97 ? escapeHtml(_0x23aa97['name']) + " · " + (_0x461113 + 0x1) + '/' + _0x544ec0['length'] : "未绑定人设") + "</span>\n      </div>\n    </div>\n    <div class=\"story-asset-detail-panel-stage is-audio is-settled\">\n      <div class=\"person-replacement-audio-detail-panel\">\n        <strong>声音预览</strong>\n        " + (_0x5d75f3 ? renderAudioPlaybackSurface({
    'audioUrl': _0x5d75f3,
    'waveformUrl': _0x126751["waveformLocalPath"] || _0x126751["waveformUrl"],
    'className': 'person-replacement-audio-playback\x20has-reference',
    'playLabel': "播放声音素材",
    'pauseLabel': "暂停声音素材"
  }) : '<p\x20class=\x22person-replacement-audio-unavailable\x22>该音频缺少可播放地址。</p>') + "\n      </div>\n    </div>\n  </aside>";
}
export function renderPersonReplacementAssetDetail(_0x19f85a, _0x5e08f0, {
  showEmptyDescription = !![],
  readOnly = ![],
  voiceLibrarySelection = null,
  detailSplitRatio = 0x32,
  detailSplitterHtml = ''
} = {}) {
  if (!_0x5e08f0) {
    const _0x1c76eb = _0x19f85a?.['assetFilter'] === "library" ? '总素材中还没有可引用的图片或音频。' : '';
    return "<aside class=\"story-asset-detail story-empty-panel\">\n      <strong>暂无可用素材</strong>\n      " + (showEmptyDescription && _0x1c76eb ? "<p>" + _0x1c76eb + '</p>' : '') + '\x0a\x20\x20\x20\x20</aside>';
  }
  const _0x4b36bb = _0x5e08f0["isLibraryAsset"] ? [_0x5e08f0] : getWorkspaceAssetAppearances(_0x5e08f0);
  const _0xa19fef = getSelectedAppearanceIndex(_0x19f85a, _0x5e08f0);
  const _0x3fa30e = getSelectedAppearance(_0x19f85a, _0x5e08f0) || _0x5e08f0;
  const _0x4a5651 = !_0x5e08f0["isLibraryAsset"] && !readOnly && _0x4b36bb["length"] > 0x1;
  const _0x147158 = _0x5e08f0["kind"] === "character" && !_0x5e08f0["isLibraryAsset"] && !readOnly;
  const _0x3f1aac = getWorkspaceAssetBaseAppearance(_0x5e08f0);
  const _0x3b6d47 = _0x147158 && (_0x4b36bb["length"] === 0x1 ? _0x4b36bb[0x0]?.['id'] === _0x3fa30e?.['id'] : _0x3f1aac?.['id'] === _0x3fa30e?.['id']);
  const _0x512ff6 = isAppearanceGenerating(_0x19f85a, _0x5e08f0, _0x3fa30e);
  const _0x1dfd30 = Boolean(_0x19f85a?.["allowDeleteAssetAppearance"] && _0x4a5651 && !_0x3b6d47);
  const _0x1af314 = normalizeText(_0x3fa30e?.["imageUrl"]);
  const _0x21db33 = _0x1af314 ? "<img class=\"story-asset-preview\" src=\"" + escapeHtml(_0x1af314) + "\" alt=\"" + escapeHtml(_0x5e08f0['name'] + '\x20·\x20' + (_0x3fa30e["name"] || '形象')) + "\" loading=\"lazy\" decoding=\"async\">" : "<div class=\"story-asset-preview story-media-empty\" role=\"img\" aria-label=\"" + escapeHtml(_0x5e08f0['name'] + "待生成") + "\"><span>待生成</span></div>";
  const _0x29af62 = _0x19f85a?.["allowAssetRename"] === !![] && !_0x5e08f0["isLibraryAsset"] ? " data-story-asset-name-id=\"" + escapeHtml(_0x5e08f0['id']) + "\" aria-label=\"重命名" + escapeHtml(_0x5e08f0["name"]) + '\x22' : '';
  const _0x2bb4b4 = normalizeText(_0x3fa30e?.['occurrences'] || _0x5e08f0?.["occurrences"]) || '当前项目';
  const _0x189385 = voiceLibrarySelection?.["audioAsset"] || null;
  const _0x46a5d4 = _0x189385 ? getPersonReplacementLibraryAudioRef(_0x189385) : '';
  const _0x41c390 = Boolean(voiceLibrarySelection);
  const _0x138e5b = _0x41c390 ? "<div class=\"story-asset-prompt-field person-replacement-voice-library-playback-field\">\n        " + (_0x46a5d4 ? renderAudioPlaybackSurface({
    'audioUrl': _0x46a5d4,
    'waveformUrl': _0x189385?.["waveformLocalPath"] || _0x189385?.["waveformUrl"],
    'className': "person-replacement-voice-library-playback has-reference",
    'playLabel': '播放' + (_0x189385?.["name"] || '所选声音'),
    'pauseLabel': '暂停' + (_0x189385?.["name"] || "所选声音")
  }) : "<div class=\"person-replacement-voice-library-playback-empty\">请从左侧选择声音</div>") + "\n      </div>" : '<div\x20class=\x22story-asset-prompt-field\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-asset-prompt-editor\x22\x20data-story-asset-prompt\x20data-story-asset-prompt-asset-id=\x22' + escapeHtml(_0x5e08f0['id']) + "\" data-story-asset-prompt-appearance-id=\"" + escapeHtml(_0x3fa30e['id']) + "\" contenteditable=\"" + (_0x5e08f0["isLibraryAsset"] || readOnly ? "false" : "true") + "\" role=\"textbox\" aria-multiline=\"true\" aria-label=\"形象提示词\" spellcheck=\"false\">" + renderPromptText(_0x5e08f0["isLibraryAsset"] || readOnly ? _0x5e08f0['description'] || _0x3fa30e["prompt"] || '' : _0x3fa30e["prompt"] || '') + "</div>\n      </div>";
  const _0x299c14 = _0x5e08f0['isLibraryAsset'] || readOnly ? '' : _0x41c390 ? "<div class=\"story-asset-generation-bar prompt-panel-footer person-replacement-voice-library-confirm-bar\">\n          <div class=\"story-asset-generation-actions\">\n            <button type=\"button\" class=\"story-asset-generate-button story-primary-button\" data-person-replacement-action=\"confirm-character-voice-library\" " + (_0x46a5d4 ? '' : "disabled") + '><span>确认</span></button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>' : "<div class=\"story-asset-generation-bar prompt-panel-footer\">\n          " + renderAIGenImageModelSelectorMarkup({
    'modelId': _0x19f85a?.["models"]?.['image'],
    'provider': _0x19f85a?.["imageProvider"],
    'generationParams': _0x19f85a?.["imageGenerationParams"],
    'providerProfileId': _0x19f85a?.['imageProviderProfileId'],
    'providerProfileIdByModel': _0x19f85a?.["imageProviderProfileIdByModel"],
    'showSchemaControls': !![],
    'className': 'story-asset-image-model-selector'
  }) + "\n          <div class=\"story-asset-generation-actions\">\n            " + renderPromptPresetPicker(_0x19f85a, _0x5e08f0["kind"]) + "\n            " + renderRequestDebugButton("data-story-action=\"debug-generation-asset\"") + '<button\x20type=\x22button\x22\x20class=\x22story-asset-generate-button\x20story-primary-button\x22\x20data-story-action=\x22generate-asset\x22\x20' + (_0x512ff6 ? "disabled" : '') + '><span>' + (_0x512ff6 ? '生成中' : escapeHtml(_0x19f85a?.["assetGenerateLabel"] || "生成素材图")) + "</span></button>\n          </div>\n        </div>";
  const _0x2b359b = '<div\x20class=\x22story-asset-preview-caption\x20person-replacement-asset-detail-caption\x22>\x0a\x20\x20\x20\x20<div\x20class=\x22story-asset-caption-heading\x22>\x0a\x20\x20\x20\x20\x20\x20<span\x20class=\x22story-asset-caption-title\x22><strong' + _0x29af62 + '>' + escapeHtml(_0x5e08f0["name"] || "未命名素材") + "</strong>" + renderPersonReplacementVoicePreviewPlayer(_0x5e08f0) + "</span>\n      <span class=\"story-asset-caption-tags\">\n        " + (_0x147158 ? "<button type=\"button\" class=\"story-base-appearance-button " + (_0x3b6d47 ? "is-active" : '') + '\x22\x20' + (_0x4a5651 ? "data-story-action=\"set-base-appearance\"" : 'disabled') + '\x20aria-pressed=\x22' + _0x3b6d47 + "\" aria-disabled=\"" + !_0x4a5651 + "\" title=\"会以基础形象作为参考，生成角色的其他形象\">" + (_0x3b6d47 ? '基础形象' : '设为基础形象') + "</button>" : '') + "\n        " + renderVoiceCapsule(_0x5e08f0, _0x19f85a?.['assetVoiceUploadLabel'] || "添加声音") + "\n        " + (_0x1dfd30 ? "<button type=\"button\" class=\"story-character-voice-capsule story-delete-appearance-button\" data-story-action=\"delete-appearance\">删除形象</button>" : '') + "\n      </span>\n    </div>\n    <span data-story-asset-caption-meta>" + escapeHtml(_0x3fa30e["name"] || _0x5e08f0["role"] || '素材') + " · " + escapeHtml(_0x2bb4b4) + (_0x4a5651 ? " · " + (_0xa19fef + 0x1) + '/' + _0x4b36bb["length"] : '') + "</span>\n  </div>";
  const _0x1b1772 = Math["min"](0x44, Math["max"](0x20, Number(detailSplitRatio) || 0x32));
  return "<aside class=\"story-asset-detail person-replacement-asset-detail-layout" + (_0x41c390 ? '\x20person-replacement-voice-library-character-detail' : '') + '\x22\x20data-person-replacement-asset-detail-layout\x20style=\x22--person-replacement-asset-detail-top:' + _0x1b1772 + "%;\"" + (_0x41c390 ? " data-person-replacement-voice-library-character-detail" : '') + ">\n    <div class=\"story-asset-preview-wrap\" data-story-appearance-wheel=\"" + _0x4a5651 + '\x22\x20' + (_0x4a5651 ? "tabindex=\"0\" aria-label=\"滚动鼠标滚轮或按左右方向键切换形象\"" : '') + ">\n      <div class=\"story-asset-preview-slide " + (_0x512ff6 ? "img-preview-loading" : '') + "\" aria-busy=\"" + _0x512ff6 + "\">\n        " + _0x21db33 + "\n        " + (_0x512ff6 ? renderWorkspaceAssetLoadingOverlay() : '') + "\n      </div>\n      " + renderPreviewActions({
    'state': _0x19f85a,
    'asset': _0x5e08f0,
    'appearance': _0x3fa30e,
    'readOnly': readOnly,
    'generating': _0x512ff6
  }) + '\x0a\x20\x20\x20\x20\x20\x20' + (_0x4a5651 ? '' + renderWorkspacePreviewArrow("previous", {
    'action': "previous-appearance",
    'label': "上一个形象",
    'actionAttributes': {
      'data-story-action': "previous-appearance"
    }
  }) + renderWorkspacePreviewArrow("next", {
    'action': "next-appearance",
    'label': '下一个形象',
    'actionAttributes': {
      'data-story-action': "next-appearance"
    }
  }) : '') + "\n    </div>\n    " + detailSplitterHtml + "\n    <div class=\"story-asset-detail-panel-stage is-image is-settled\" data-story-asset-detail-panel-stage>\n      <div class=\"story-asset-detail-panel-cube\">\n        <div class=\"story-asset-detail-copy story-asset-detail-panel-face story-asset-detail-panel-face--image\" aria-hidden=\"false\">\n          " + _0x2b359b + "\n          " + _0x138e5b + "\n          " + _0x299c14 + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</aside>';
}
export function renderPersonReplacementBatchGenerationControl(_0x1c6b18 = {}) {
  const _0x1834f9 = Array["isArray"](_0x1c6b18?.["selectedAssetIds"]) ? _0x1c6b18["selectedAssetIds"]["length"] : 0x0;
  const _0x43d741 = _0x1c6b18?.['isBatchGenerating'] === !![];
  const _0x44e713 = _0x1c6b18?.["batchCancelRequested"] === !![];
  const _0xf2355a = _0x43d741 ? _0x44e713 : !_0x1834f9;
  const _0x296716 = _0x1834f9 ? '\x20(' + _0x1834f9 + ')' : '';
  const _0x26ffdc = normalizeText(_0x1c6b18?.["batchGenerationActionLabel"]) || "批量生成";
  const _0x127514 = _0x43d741 ? '' + (_0x44e713 ? "正在停止" : "取消运行") + _0x296716 : '' + _0x26ffdc + _0x296716;
  const _0x3c700a = ['scene', "prop"]['includes'](normalizeText(_0x1c6b18?.["assetFilter"])) ? "image" : '';
  const _0x13d182 = _0x43d741 ? normalizeText(_0x1c6b18["batchCancelAction"]) || "cancel-asset-batch-generation" : "batch-generate-assets";
  return "<button type=\"button\" class=\"story-primary-button story-asset-batch-trigger\" data-story-action=\"" + escapeHtml(_0x13d182) + '\x22' + (_0x3c700a ? " data-story-asset-batch-direct-mode=\"" + _0x3c700a + '\x22' : '') + " aria-busy=\"" + _0x43d741 + '\x22\x20' + (_0xf2355a ? "disabled" : '') + '><span\x20class=\x22story-asset-batch-trigger-label\x22>' + escapeHtml(_0x127514) + "</span></button>";
}
export function renderPersonReplacementPreviewArrow(_0x57db63, _0x1f8cb0 = {}) {
  return renderWorkspacePreviewArrow(_0x57db63, {
    ..._0x1f8cb0,
    'actionAttributes': normalizeText(_0x1f8cb0?.["action"]) ? {
      'data-story-action': _0x1f8cb0["action"]
    } : {}
  });
}
export function syncPersonReplacementVoicePreviewUi(_0x1c7c50, {
  audioEl = null,
  assetId = ''
} = {}) {
  const _0x5e2aef = Number(audioEl?.['duration']);
  const _0x346b03 = Number(audioEl?.["currentTime"]);
  const _0x232e69 = Number["isFinite"](_0x5e2aef) && _0x5e2aef > 0x0 ? Math["max"](0x0, Math['min'](0x1, _0x346b03 / _0x5e2aef)) : 0x0;
  const _0x417ba2 = Boolean(audioEl && audioEl["paused"] === ![] && audioEl['ended'] !== !![]);
  _0x1c7c50?.['querySelectorAll']?.("[data-story-character-voice-player]")?.['forEach']?.(_0x194f18 => {
    const _0x130404 = normalizeText(_0x194f18["dataset"]?.["storyCharacterVoicePlayer"]) === normalizeText(assetId);
    const _0x3c9628 = _0x194f18["querySelector"]?.('[data-story-action=\x27play-character-voice\x27]');
    const _0x5c4ee4 = _0x194f18["querySelector"]?.("[data-story-character-voice-waveform]");
    _0x194f18["classList"]?.['toggle']?.("is-active", _0x130404);
    _0x194f18['classList']?.['toggle']?.("is-playing", _0x130404 && _0x417ba2);
    _0x3c9628?.["setAttribute"]?.("aria-label", _0x130404 && _0x417ba2 ? "暂停声音参考" : "播放声音参考");
    if (_0x5c4ee4) {
      _0x5c4ee4['hidden'] = !_0x130404;
      _0x5c4ee4['setAttribute']?.("aria-hidden", String(!_0x130404));
      _0x5c4ee4['style']?.["setProperty"]?.("--story-character-voice-progress", '' + _0x232e69);
      const _0x43cefb = _0x5c4ee4["querySelectorAll"]?.('i') || [];
      _0x43cefb["forEach"]?.((_0xd75c97, _0x5f2957) => {
        _0xd75c97["classList"]?.["toggle"]?.('is-played', _0x130404 && _0x232e69 >= (_0x5f2957 + 0x1) / _0x43cefb["length"]);
      });
    }
  });
  return !![];
}