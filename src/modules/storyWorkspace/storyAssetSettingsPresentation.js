import { renderRequestDebugButton } from '../debugRequestWindow.js';
import { renderAudioPlaybackSurface } from '../../components/audio-node/audioPlaybackSurface.js';
import { renderWorkspaceCardDeleteControl, renderWorkspaceCardAppearanceNavigation } from '../workspaceAssetPresentation.js';
import { renderStoryGenerationSpinner } from './storyAsyncButtonPresentation.js';
import { renderStorySerialExecutionMenuitem } from './storySerialExecutionPreference.js';
function escapeHtml(_0x5345e9) {
  return String(_0x5345e9 ?? '')["replaceAll"]('&', "&amp;")['replaceAll']('<', "&lt;")["replaceAll"]('>', "&gt;")["replaceAll"]('\x22', "&quot;")["replaceAll"]('\x27', '&#39;');
}
function normalizeText(_0x5eb1f9) {
  return String(_0x5eb1f9 ?? '')["trim"]();
}
function emptyRenderer() {
  return '';
}
export function createStoryAssetSettingsPresentation({
  renderAddToLibraryIcon = emptyRenderer,
  renderDeleteIcon = emptyRenderer,
  renderDownloadButton = emptyRenderer,
  renderHomeParamChevron = emptyRenderer,
  renderImage = emptyRenderer,
  renderImageModelSelector = emptyRenderer,
  renderLoadingOverlay = emptyRenderer,
  renderPromptMentions = _0x35136a => escapeHtml(_0x35136a),
  renderSelectionActions = ({
    primaryActionHtml = ''
  } = {}) => primaryActionHtml,
  renderTabIcon = emptyRenderer,
  renderUploadIcon = emptyRenderer,
  renderVoiceFooter = emptyRenderer
} = {}) {
  function _0xd4bed4(_0x1edcc3 = {}, {
    canRename = ![]
  } = {}) {
    const _0x186d5e = normalizeText(_0x1edcc3['name']) || "未命名素材";
    const _0x5cb303 = canRename ? " data-story-asset-name-id=\"" + escapeHtml(_0x1edcc3['id']) + '\x22\x20aria-label=\x22重命名' + escapeHtml(_0x186d5e) + '\x22' : '';
    return "<strong" + _0x5cb303 + '>' + escapeHtml(_0x186d5e) + "</strong>";
  }
  function _0x1fff13(_0x167b84 = {}) {
    const _0x3efd2c = "<button type=\"button\" class=\"story-asset-card " + (_0x167b84["isCurrent"] && !_0x167b84['isSelectionMode'] ? "is-selected" : '') + '\x20' + (_0x167b84["isSelectionMode"] ? 'is-selection-mode' : '') + '\x20' + (_0x167b84["isChecked"] ? "is-checked" : '') + (_0x167b84["cardClassName"] ? '\x20' + escapeHtml(_0x167b84["cardClassName"]) : '') + "\" data-story-asset-id=\"" + escapeHtml(_0x167b84['id']) + '\x22\x20data-story-marquee-item\x20data-story-marquee-id=\x22' + escapeHtml(_0x167b84['id']) + "\" data-story-appearance-count=\"" + Math["max"](0x0, Number(_0x167b84["appearanceCount"]) || 0x0) + "\" aria-pressed=\"" + (_0x167b84["isSelectionMode"] ? String(Boolean(_0x167b84["isChecked"])) : 'false') + '\x22' + (_0x167b84["draggable"] ? " draggable=\"true\"" : '') + (_0x167b84['cardAttributes'] ? '\x20' + _0x167b84["cardAttributes"] : '') + '>\x0a\x20\x20\x20\x20' + (_0x167b84['isSelectionMode'] ? '<span\x20class=\x22story-asset-select-indicator\x22\x20aria-hidden=\x22true\x22>' + (_0x167b84["isChecked"] ? '✓' : '') + "</span>" : '') + "\n    <span class=\"story-asset-card-media " + (_0x167b84["isLoading"] ? "img-preview-loading" : '') + '\x22\x20' + (_0x167b84['canNavigateAppearances'] ? "data-story-card-appearance-wheel=\"" + escapeHtml(_0x167b84['id']) + '\x22' : '') + " aria-busy=\"" + Boolean(_0x167b84["isLoading"]) + "\">\n      " + (_0x167b84["cardMediaHtml"] || renderImage({
      'imageUrl': _0x167b84['preview']?.["imageUrl"],
      'fallbackImageUrl': _0x167b84['fallbackImageUrl'],
      'workspaceAssetLibraryImage': _0x167b84["workspaceAssetLibraryImage"],
      'alt': '' + _0x167b84['name'] + (_0x167b84["preview"]?.['name'] ? " · " + _0x167b84["preview"]["name"] : ''),
      'className': 'story-asset-card-image'
    })) + "\n      " + (_0x167b84["isLoading"] ? renderLoadingOverlay({
      'compact': !![]
    }) : '') + "\n    </span>\n    <span class=\"story-asset-card-copy\">\n      <span class=\"story-asset-card-heading\">" + _0xd4bed4(_0x167b84, {
      'canRename': _0x167b84["canRename"]
    }) + (_0x167b84["showRoleTag"] ? "<small>" + escapeHtml(_0x167b84['role'] || '素材') + '</small>' : '') + "</span>\n      <span class=\"story-asset-card-status\">" + (_0x167b84['cardStatusHtml'] || (_0x167b84["statusText"] ? "<span>" + escapeHtml(_0x167b84["statusText"]) + "</span>" : _0x167b84["stats"]?.["total"] > 0x1 ? "<span>形象 " + _0x167b84["stats"]["generated"] + '/' + _0x167b84["stats"]["total"] + "</span>" : '')) + (_0x167b84["stats"]?.['failed'] ? "<b>生成失败 " + _0x167b84["stats"]["failed"] + "</b>" : '') + "</span>\n      " + (_0x167b84["cardMetaHtml"] || '') + "\n      <p>" + escapeHtml(_0x167b84["promptPreview"] || '') + '</p>\x0a\x20\x20\x20\x20</span>\x0a\x20\x20</button>';
    const _0x1ae033 = _0x167b84["showAppearanceDelete"] ? renderWorkspaceCardDeleteControl({
      'className': "story-asset-card-delete-trigger",
      'ariaLabel': "删除当前形象",
      'actionAttributes': {
        'data-story-action': "request-delete-asset-appearance",
        'data-story-card-appearance-id': _0x167b84['id']
      },
      'disabled': _0x167b84['isLoading'] || !_0x167b84["canDeleteAppearance"]
    }) : _0x167b84["canDelete"] ? renderWorkspaceCardDeleteControl({
      'className': "story-asset-card-delete-trigger",
      'ariaLabel': '删除' + (normalizeText(_0x167b84["kind"])["toLowerCase"]() === "scene" ? '场景' : '人物') + '\x20' + _0x167b84["name"],
      'actionAttributes': {
        'data-story-action': "delete-asset-card",
        'data-story-asset-delete-id': _0x167b84['id']
      },
      'disabled': _0x167b84['isLoading']
    }) : '';
    const _0x32d0ba = _0x167b84['canNavigateAppearances'] ? renderWorkspaceCardAppearanceNavigation({
      'attributes': {
        'data-story-card-appearance-wheel': _0x167b84['id']
      },
      'previousAttributes': {
        'data-story-action': "previous-appearance",
        'data-story-card-appearance-id': _0x167b84['id']
      },
      'nextAttributes': {
        'data-story-action': "next-appearance",
        'data-story-card-appearance-id': _0x167b84['id']
      }
    }) : '';
    if (!_0x1ae033 && !_0x167b84["accessoryHtml"] && !_0x32d0ba) {
      return _0x3efd2c;
    }
    return '<span\x20class=\x22story-asset-card-shell' + (_0x167b84["shellClassName"] ? '\x20' + escapeHtml(_0x167b84['shellClassName']) : '') + "\">\n    " + _0x3efd2c + "\n    " + _0x32d0ba + _0x1ae033 + (_0x167b84["accessoryHtml"] || '') + "\n  </span>";
  }
  function _0x30954c(_0x206b7b, _0x405881 = '') {
    const _0x2fc311 = _0x405881 ? " data-story-card-appearance-id=\"" + escapeHtml(_0x405881) + '\x22' : '';
    if (_0x206b7b === 'previous') {
      return "<button type=\"button\" class=\"story-appearance-arrow story-appearance-arrow--previous\" data-story-action=\"previous-appearance\"" + _0x2fc311 + " aria-label=\"上一个形象\"><svg class=\"story-appearance-arrow-icon\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"m14.5 6.5-5.5 5.5 5.5 5.5\"/></svg></button>";
    }
    return "<button type=\"button\" class=\"story-appearance-arrow story-appearance-arrow--next\" data-story-action=\"next-appearance\"" + _0x2fc311 + " aria-label=\"下一个形象\"><svg class=\"story-appearance-arrow-icon\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"m9.5 6.5 5.5 5.5-5.5 5.5\"/></svg></button>";
  }
  function _0x23c3b4() {
    return "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><rect x=\"4\" y=\"5\" width=\"16\" height=\"14\" rx=\"2.5\"/><circle cx=\"9\" cy=\"10\" r=\"1.5\"/><path d=\"m6.5 16 3.5-3.5 2.6 2.6 1.8-1.8 3.1 2.7\"/></svg>";
  }
  function _0x5ba81d(_0x587adb = {}) {
    const _0x24435e = normalizeText(_0x587adb['referenceImageUrl']);
    return "<span class=\"story-asset-style-reference-control " + (_0x24435e ? "has-reference" : '') + "\">\n    <button type=\"button\" class=\"story-character-voice-capsule story-asset-style-reference-capsule " + (_0x24435e ? "has-reference" : '') + "\" data-story-action=\"upload-asset-reference\" aria-label=\"" + (_0x24435e ? "替换风格参考" : "上传风格参考") + '\x22\x20' + (_0x587adb["disabled"] ? "disabled" : '') + '>\x0a\x20\x20\x20\x20\x20\x20<span\x20class=\x22story-character-voice-icon\x22>' + (_0x24435e ? '<img\x20src=\x22' + escapeHtml(_0x24435e) + "\" alt=\"\">" : _0x23c3b4()) + "</span>\n      <span>风格参考</span>\n    </button>\n    " + (_0x24435e ? "<span class=\"story-asset-style-reference-preview\" aria-hidden=\"true\"><img src=\"" + escapeHtml(_0x24435e) + "\" alt=\"\"></span>" : '') + '\x0a\x20\x20\x20\x20' + (_0x24435e ? "<button type=\"button\" class=\"story-asset-style-reference-remove\" data-story-action=\"remove-asset-reference\" aria-label=\"删除风格参考\" " + (_0x587adb["disabled"] ? "disabled" : '') + '>&times;</button>' : '') + '\x0a\x20\x20</span>';
  }
  function _0xc7f0e1(_0x4afed1 = {}) {
    if (!_0x4afed1["visible"]) {
      return '';
    }
    return "<div class=\"story-home-param-picker story-asset-preset-picker\">\n    <button type=\"button\" class=\"story-home-param-trigger story-menu-trigger story-asset-preset-trigger\" data-story-home-param-trigger=\"asset-preset\" aria-haspopup=\"listbox\" aria-expanded=\"false\" " + (_0x4afed1["disabled"] ? "disabled" : '') + ">\n      <span>预设：" + escapeHtml(_0x4afed1["selectedLabel"]) + '</span>\x0a\x20\x20\x20\x20\x20\x20' + renderHomeParamChevron() + "\n    </button>\n    <div class=\"story-home-param-popover story-asset-preset-popover\" role=\"listbox\" aria-label=\"" + escapeHtml(_0x4afed1["label"]) + '\x22>\x0a\x20\x20\x20\x20\x20\x20<strong>' + escapeHtml(_0x4afed1['label']) + "</strong>\n      <div class=\"story-asset-preset-options\">\n        " + (Array["isArray"](_0x4afed1["options"]) ? _0x4afed1['options'] : [])["map"](_0x16aa52 => '<button\x20type=\x22button\x22\x20class=\x22story-asset-preset-option\x20floating-menu-item\x20has-subtitle\x20' + (_0x16aa52['id'] === _0x4afed1["selectedId"] ? 'active\x20is-selected' : '') + "\" data-story-asset-preset-option=\"" + escapeHtml(_0x16aa52['id']) + "\" data-story-asset-preset-kind=\"" + escapeHtml(_0x4afed1["assetKind"]) + "\" role=\"option\" aria-selected=\"" + (_0x16aa52['id'] === _0x4afed1["selectedId"]) + '\x22><span\x20class=\x22fmi-content\x22><span\x20class=\x22fmi-title\x22>' + escapeHtml(_0x16aa52['label']) + "</span><small class=\"fmi-sub\">" + escapeHtml(_0x16aa52["description"]) + "</small></span></button>")['join']('') + "\n      </div>\n    </div>\n  </div>";
  }
  function _0x4e70d6(_0x1167f8 = ![]) {
    if (_0x1167f8) {
      return "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M8 6.5v11l9-5.5-9-5.5Z\"/></svg>";
    }
    return "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 4v16M8.5 7.5v9M15.5 8.5v7M5 10v4M19 10v4\"/></svg>";
  }
  function _0x57bf19() {
    return '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20aria-hidden=\x22true\x22><path\x20d=\x22M4\x207V3m0\x204h4\x22/><path\x20d=\x22M5.4\x206.2A8\x208\x200\x201\x201\x204\x2012\x22/><path\x20d=\x22M12\x208v4l2.8\x201.8\x22/></svg>';
  }
  function _0x11b11f(_0x574db4 = {}) {
    if (!_0x574db4["visible"]) {
      return '';
    }
    if (_0x574db4["uploadLabel"]) {
      return '<button\x20type=\x22button\x22\x20class=\x22story-character-voice-capsule\x20' + (_0x574db4['hasReference'] ? 'has-reference' : "is-missing") + '\x22\x20data-story-character-voice-capsule\x20data-story-action=\x22upload-character-voice\x22\x20aria-label=\x22' + escapeHtml(_0x574db4["uploadLabel"]) + "\">\n      <span class=\"story-character-voice-icon\">" + _0x4e70d6(![]) + "</span>\n      <span>" + escapeHtml(_0x574db4["uploadLabel"]) + "</span>\n    </button>";
    }
    const _0x283948 = _0x574db4["isOpen"] ? "close-character-voice" : 'open-character-voice';
    const _0x276e73 = _0x574db4["isOpen"] ? "图片参考" : '声音参考';
    return '<button\x20type=\x22button\x22\x20class=\x22story-character-voice-capsule\x20' + (_0x574db4["hasReference"] ? "has-reference" : "is-missing") + '\x20' + (_0x574db4["isOpen"] ? "is-active" : '') + "\" data-story-character-voice-capsule data-story-action=\"" + _0x283948 + "\" aria-label=\"打开角色" + _0x276e73 + "\" aria-pressed=\"" + Boolean(_0x574db4["isOpen"]) + "\">\n    <span class=\"story-character-voice-icon\">" + (_0x574db4["isOpen"] ? _0x23c3b4() : _0x4e70d6(![])) + '</span>\x0a\x20\x20\x20\x20<span>' + _0x276e73 + "</span>\n  </button>";
  }
  function _0x21ee45(_0x202d1a = {}) {
    if (!_0x202d1a["visible"]) {
      return '';
    }
    return "<span class=\"story-character-voice-name-player\" data-story-character-voice-player=\"" + escapeHtml(_0x202d1a['id']) + "\">\n    <button type=\"button\" class=\"story-character-voice-name-play\" data-story-action=\"play-character-voice\" data-story-voice-asset-id=\"" + escapeHtml(_0x202d1a['id']) + "\" aria-label=\"播放 " + escapeHtml(_0x202d1a['name']) + " 的声音参考\">\n      <svg class=\"story-character-voice-name-play-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M7 5.4v9.2l7.2-4.6L7 5.4Z\"/></svg>\n      <svg class=\"story-character-voice-name-pause-icon\" viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M6.5 5.5h2.3v9H6.5zM11.2 5.5h2.3v9h-2.3z\"/></svg>\n    </button>\n    <span class=\"story-character-voice-waveform\" data-story-character-voice-waveform hidden aria-hidden=\"true\">" + Array["from"]({
      'length': 0xc
    }, () => '<i></i>')['join']('') + "</span>\n  </span>";
  }
  function _0x2057c9(_0x47f9e4) {
    if (_0x47f9e4 === "image") {
      return "<svg viewBox=\"0 0 20 20\" fill=\"none\" aria-hidden=\"true\"><rect x=\"2.5\" y=\"3\" width=\"15\" height=\"14\" rx=\"2.2\"/><circle cx=\"7\" cy=\"7.5\" r=\"1.3\"/><path d=\"m4.5 14 3.4-3.4 2.7 2.7 1.8-1.8 3.1 2.5\"/></svg>";
    }
    if (_0x47f9e4 === 'voice') {
      return "<svg viewBox=\"0 0 20 20\" fill=\"none\" aria-hidden=\"true\"><path d=\"M3 10h1.5m2-3.5v7m3-10v13m3-9v5m3-7v9M18 10h-1.5\"/></svg>";
    }
    return "<svg viewBox=\"0 0 20 20\" fill=\"none\" aria-hidden=\"true\"><rect x=\"2.5\" y=\"3\" width=\"6\" height=\"6\" rx=\"1.2\"/><rect x=\"11.5\" y=\"3\" width=\"6\" height=\"6\" rx=\"1.2\"/><rect x=\"2.5\" y=\"12\" width=\"6\" height=\"5\" rx=\"1.2\"/><rect x=\"11.5\" y=\"12\" width=\"6\" height=\"5\" rx=\"1.2\"/></svg>";
  }
  function _0x41c76a(_0x1151ab = {}) {
    const _0x485e9b = normalizeText(_0x1151ab['directMode']);
    const _0x889da3 = normalizeText(_0x1151ab["action"]) || 'batch-generate-assets';
    const _0x499a0a = _0x1151ab["isCancellation"] ? 'aria-label=\x22取消尚未开始的素材生成任务\x22' : _0x485e9b ? "data-story-asset-batch-direct-mode=\"" + escapeHtml(_0x485e9b) + '\x22' : "aria-haspopup=\"menu\" aria-expanded=\"false\"";
    const _0x166da4 = '<button\x20type=\x22button\x22\x20class=\x22story-primary-button\x20story-asset-batch-trigger\x22\x20data-story-action=\x22' + escapeHtml(_0x889da3) + "\" data-story-asset-batch-control " + _0x499a0a + '\x20' + (_0x1151ab["disabled"] ? "disabled" : '') + '\x20aria-busy=\x22' + Boolean(_0x1151ab["busy"]) + '\x22>' + (_0x1151ab["busy"] ? renderStoryGenerationSpinner({
      'button': !![]
    }) : '') + "<span class=\"story-asset-batch-trigger-label\">" + escapeHtml(_0x1151ab["label"]) + '</span></button>';
    if (_0x1151ab["isCancellation"]) {
      return _0x166da4;
    }
    if (_0x485e9b) {
      return _0x166da4;
    }
    return "<div class=\"story-asset-batch-menu-wrap\">\n    " + _0x166da4 + "\n    <div class=\"story-asset-batch-menu\" role=\"menu\" aria-label=\"选择批量生成内容\">\n      <button type=\"button\" role=\"menuitem\" data-story-asset-batch-mode=\"image\"><span class=\"story-asset-batch-mode-icon\">" + _0x2057c9('image') + "</span><span>仅图片</span></button>\n      <button type=\"button\" role=\"menuitem\" data-story-asset-batch-mode=\"voice\"><span class=\"story-asset-batch-mode-icon\">" + _0x2057c9("voice") + "</span><span>仅音频</span></button>\n      <button type=\"button\" role=\"menuitem\" data-story-asset-batch-mode=\"all\"><span class=\"story-asset-batch-mode-icon\">" + _0x2057c9("all") + '</span><span>全部</span></button>' + renderStorySerialExecutionMenuitem() + '\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</div>';
  }
  function _0x5f597f(_0x437464 = {}) {
    if (!_0x437464["isMultiSelection"]) {
      return renderRequestDebugButton("data-story-action=\"debug-asset-image\"") + "<button type=\"button\" class=\"story-asset-generate-button story-main-action-button\" data-story-action=\"generate-asset\" " + (_0x437464["disabled"] ? 'disabled' : '') + " aria-busy=\"" + Boolean(_0x437464["busy"]) + '\x22>' + (_0x437464['busy'] ? renderStoryGenerationSpinner({
        'button': !![]
      }) : '') + '<span\x20data-story-asset-generate-label>' + escapeHtml(_0x437464["label"] || "生成素材图") + "</span></button>";
    }
    const _0x43adf8 = normalizeText(_0x437464['action']) || "batch-generate-assets";
    return '<button\x20type=\x22button\x22\x20class=\x22story-asset-generate-button\x20story-main-action-button\x20story-asset-batch-trigger\x22\x20data-story-action=\x22' + escapeHtml(_0x43adf8) + "\" data-story-asset-batch-control " + (_0x437464['isCancellation'] ? "aria-label=\"取消尚未开始的素材生成任务\"" : "data-story-asset-batch-direct-mode=\"image\"") + '\x20' + (_0x437464["disabled"] ? "disabled" : '') + '\x20aria-busy=\x22' + Boolean(_0x437464["busy"]) + '\x22>' + (_0x437464["busy"] ? renderStoryGenerationSpinner({
      'button': !![]
    }) : '') + "<span class=\"story-asset-batch-trigger-label\">" + escapeHtml(_0x437464["label"]) + "</span></button>";
  }
  function _0x19ff72(_0x4f7a61 = {}) {
    return '<button\x20type=\x22button\x22\x20class=\x22story-library-target-option\x22\x20role=\x22option\x22\x20data-story-library-appearance-target=\x22' + escapeHtml(_0x4f7a61['id']) + "\" data-story-library-target-asset-kind=\"" + escapeHtml(_0x4f7a61["kind"]) + "\" aria-haspopup=\"menu\" aria-expanded=\"false\">\n    <span class=\"story-library-target-thumb\">" + renderImage({
      'imageUrl': _0x4f7a61["preview"]?.['imageUrl'],
      'alt': _0x4f7a61["name"],
      'className': 'story-library-target-image'
    }) + "</span>\n    <span class=\"story-library-target-copy\"><strong>" + escapeHtml(_0x4f7a61['name']) + "</strong><small>" + (_0x4f7a61["appearanceCount"] ? _0x4f7a61["appearanceCount"] + '\x20个形象' : "暂无形象") + '</small></span>\x0a\x20\x20</button>';
  }
  function _0x165821(_0x3afafd = {}, _0x3b72b3 = {}, _0x10b3bc = ![]) {
    const _0x23579b = normalizeText(_0x3b72b3["name"]) || "未命名形象";
    return "<button type=\"button\" class=\"story-library-appearance-option\" role=\"menuitem\" data-story-library-target-asset-id=\"" + escapeHtml(_0x3afafd['id']) + "\" data-story-library-target-appearance-id=\"" + escapeHtml(_0x3b72b3['id']) + '\x22\x20' + (_0x10b3bc ? "disabled title=\"替换已有形象时只能选择一张图片\"" : '') + ">\n      <span class=\"story-library-appearance-thumb\">" + renderImage({
      'imageUrl': _0x3b72b3['imageUrl'],
      'alt': _0x3afafd["name"] + " · " + _0x23579b,
      'className': "story-library-appearance-image"
    }) + "</span>\n      <span class=\"story-library-appearance-copy\"><strong>" + escapeHtml(_0x23579b) + "</strong><small>替换此形象图片</small></span>\n    </button>";
  }
  function _0x20edb8(_0x53274c = {}, _0x34d13e = 0x0) {
    const _0x44e859 = Array["isArray"](_0x53274c["appearances"]) ? _0x53274c['appearances'] : [];
    const _0x587abd = _0x34d13e !== 0x1;
    return '<div\x20class=\x22story-library-appearance-popover\x22\x20data-story-library-appearance-menu=\x22' + escapeHtml(_0x53274c['id']) + '\x22\x20role=\x22menu\x22\x20aria-label=\x22选择' + escapeHtml(_0x53274c['name']) + "的形象\" aria-hidden=\"true\">\n      <div class=\"story-library-target-heading\"><strong>" + escapeHtml(_0x53274c["name"]) + '的形象</strong><small>' + (_0x587abd ? '选择一张图片后可替换已有形象' : '选择要替换的形象') + "</small></div>\n      <div class=\"story-library-appearance-list\">\n        " + _0x44e859["map"](_0x82a40f => _0x165821(_0x53274c, _0x82a40f, _0x587abd))['join']('') + "\n      </div>\n      <button type=\"button\" class=\"story-library-appearance-add\" role=\"menuitem\" data-story-library-target-asset-id=\"" + escapeHtml(_0x53274c['id']) + "\" data-story-library-target-create-appearance=\"true\"><span aria-hidden=\"true\">＋</span><strong>新增形象</strong></button>\n    </div>";
  }
  function _0x455945(_0x26dd17 = {}) {
    const _0x290271 = Array['isArray'](_0x26dd17["targetGroups"]) ? _0x26dd17['targetGroups'] : [];
    const _0x321acc = Math["max"](0x0, Math["trunc"](Number(_0x26dd17["selectedCount"]) || 0x0));
    return "<div class=\"story-asset-batch-menu-wrap story-library-add-menu-wrap\">\n    <button type=\"button\" class=\"story-primary-button story-asset-batch-trigger\" data-story-action=\"add-library-assets-to-project\" aria-haspopup=\"menu\" aria-expanded=\"false\" " + (_0x321acc ? '' : 'disabled') + "><span class=\"story-asset-batch-trigger-label\">加入到项目" + (_0x26dd17['showCount'] && _0x321acc ? '\x20(' + _0x321acc + ')' : '') + "</span></button>\n    <div class=\"story-asset-batch-menu story-library-add-menu\" role=\"menu\" aria-label=\"选择加入项目的素材分类\">\n      " + _0x290271["map"](_0x1cc48d => "<button type=\"button\" role=\"menuitem\" data-story-library-target-kind=\"" + escapeHtml(_0x1cc48d['kind']) + "\" aria-haspopup=\"listbox\" aria-expanded=\"false\"><span class=\"story-asset-batch-mode-icon\">" + renderTabIcon(_0x1cc48d["kind"]) + "</span><span>" + escapeHtml(_0x1cc48d['label']) + "</span></button>")["join"]('') + "\n    </div>\n    " + _0x290271["map"](_0x57b990 => "<div class=\"story-library-target-popover\" data-story-library-target-menu=\"" + escapeHtml(_0x57b990["kind"]) + '\x22\x20role=\x22listbox\x22\x20aria-label=\x22选择本剧' + escapeHtml(_0x57b990["label"]) + "\" aria-hidden=\"true\">\n      <div class=\"story-library-target-heading\"><strong>选择本剧" + escapeHtml(_0x57b990["label"]) + "</strong><small>悬停后选择已有形象或新增</small></div>\n      <div class=\"story-library-target-list\">\n        " + (_0x57b990["targets"]?.['length'] ? _0x57b990["targets"]['map'](_0x19ff72)['join']('') : "<div class=\"story-library-target-empty\">本剧暂无可绑定的" + escapeHtml(_0x57b990["label"]) + "</div>") + "\n      </div>\n      " + (_0x57b990["targets"]?.["map"](_0x59c5a4 => _0x20edb8(_0x59c5a4, _0x321acc))['join']('') || '') + "\n    </div>")["join"]('') + "\n  </div>";
  }
  function _0x573bea(_0x55e21d = {}) {
    return renderSelectionActions({
      'selectionMode': _0x55e21d['selectionMode'],
      'selectedCount': _0x55e21d['selectedCount'],
      'allSelected': _0x55e21d['allSelected'],
      'primaryActionHtml': _0x455945({
        ..._0x55e21d,
        'showCount': _0x55e21d["selectionMode"]
      }),
      'selectAllLabel': "全选图片",
      'clearSelectionLabel': "取消全选"
    });
  }
  function _0x53083a(_0x2091e6 = {}) {
    const _0x517744 = renderDownloadButton({
      'action': "download-asset-image",
      'enabled': Boolean(_0x2091e6["canDownload"])
    });
    if (!_0x2091e6['showProjectActions']) {
      return _0x517744 ? '<div\x20class=\x22story-asset-preview-actions\x22>' + _0x517744 + "</div>" : '';
    }
    return '<div\x20class=\x22story-asset-preview-actions\x22>\x0a\x20\x20\x20\x20' + _0x517744 + "\n    <button type=\"button\" class=\"story-character-voice-upload-button story-add-to-library-button " + (_0x2091e6["librarySynced"] ? "is-synced" : '') + '\x22\x20data-story-action=\x22add-asset-appearance-to-library\x22\x20aria-label=\x22' + escapeHtml(_0x2091e6["saveToLibraryLabel"]) + "\" title=\"" + escapeHtml(_0x2091e6["saveToLibraryLabel"]) + '\x22\x20' + (_0x2091e6["canSaveToLibrary"] ? '' : "disabled") + " aria-busy=\"" + Boolean(_0x2091e6["isSavingToLibrary"]) + '\x22>' + (_0x2091e6["isSavingToLibrary"] ? renderStoryGenerationSpinner({
      'button': !![]
    }) : renderAddToLibraryIcon()) + '</button>\x0a\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-upload-replace\x20story-character-voice-upload-button\x22\x20data-story-action=\x22upload-asset\x22\x20aria-label=\x22上传替换图片\x22\x20title=\x22上传替换图片\x22\x20' + (_0x2091e6["canUpload"] ? '' : 'disabled') + '>' + renderUploadIcon() + "</button>\n    " + (_0x2091e6["showDeleteAppearance"] ? "<button type=\"button\" class=\"story-character-voice-remove story-delete-current-appearance-button\" data-story-action=\"request-delete-asset-appearance\" aria-label=\"删除当前形象\" title=\"删除当前形象\" " + (_0x2091e6['canDeleteAppearance'] ? '' : "disabled") + '>' + renderDeleteIcon() + "</button>" : '') + "\n    " + (_0x2091e6["isDeleteAppearanceConfirming"] ? "<div class=\"story-project-delete-confirm story-asset-appearance-delete-confirm\" role=\"alertdialog\" aria-label=\"删除当前形象\">\n      <span>删除当前形象？</span>\n      <button type=\"button\" class=\"confirm-btn confirm-cancel\" data-story-action=\"cancel-delete-asset-appearance\">取消</button>\n      <button type=\"button\" class=\"confirm-btn confirm-ok\" data-story-action=\"confirm-delete-asset-appearance\" aria-label=\"确认删除当前形象\">删除</button>\n    </div>" : '') + "\n  </div>";
  }
  function _0x42abc2(_0x2793f2 = {}) {
    if (!_0x2793f2["visible"]) {
      return '';
    }
    const _0x4b38b2 = _0x2793f2['reference'];
    const _0x1b6ed0 = Array['isArray'](_0x2793f2["history"]) ? _0x2793f2["history"] : [];
    const _0x14f97f = renderVoiceFooter({
      'workflow': _0x2793f2["footer"]?.["workflow"],
      'nodeData': _0x2793f2['footer']?.["nodeData"],
      'workflowItems': _0x2793f2["footer"]?.["workflowItems"],
      'labels': {
        'advanced': "高级设置",
        'generateTitle': "生成声音参考"
      }
    });
    const _0x52d3e3 = _0x4b38b2 ? '' : '<button\x20type=\x22button\x22\x20class=\x22story-character-voice-upload-zone\x20is-empty\x20' + (_0x2793f2['isGenerating'] ? "img-preview-loading" : '') + '\x22\x20data-story-character-voice-drop\x20data-story-action=\x22upload-character-voice\x22\x20aria-busy=\x22' + Boolean(_0x2793f2["isGenerating"]) + '\x22\x20' + (_0x2793f2["isGenerating"] ? 'disabled' : '') + '>\x0a\x20\x20\x20\x20\x20\x20<span\x20class=\x22story-character-voice-upload-icon\x22>' + renderUploadIcon() + "</span>\n        <span class=\"story-character-voice-upload-copy\">\n          <strong>上传或拖入声音参考</strong>\n          <small>支持 MP3 / WAV / M4A，建议 5–15 秒</small>\n        </span>\n        " + (_0x2793f2["isGenerating"] ? renderLoadingOverlay({
      'compact': !![]
    }) : '') + '\x0a\x20\x20\x20\x20\x20\x20</button>';
    const _0x22e294 = _0x1b6ed0["length"] ? '<div\x20class=\x22story-character-voice-history-wrap\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-character-voice-history-button\x22\x20data-story-action=\x22toggle-character-voice-history\x22\x20aria-label=\x22历史音频\x22\x20aria-haspopup=\x22true\x22\x20aria-expanded=\x22false\x22\x20' + (_0x2793f2["isGenerating"] ? "disabled" : '') + '>' + _0x57bf19() + '</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-character-voice-history-panel\x22\x20aria-hidden=\x22true\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<strong>历史音频</strong>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-character-voice-history-list\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + _0x1b6ed0['map']((_0x182b11, _0x1034f5) => "<div class=\"story-character-voice-history-item\">\n              <button type=\"button\" class=\"story-character-voice-history-play\" data-story-character-voice-history-play=\"" + _0x1034f5 + "\" aria-label=\"试听历史音频 " + (_0x1034f5 + 0x1) + '\x22>' + _0x4e70d6(!![]) + '</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span><strong>' + escapeHtml(_0x182b11["label"]) + "</strong><small>" + escapeHtml(_0x182b11["timeLabel"]) + "</small></span>\n              <button type=\"button\" class=\"story-character-voice-history-restore\" data-story-character-voice-history-restore=\"" + _0x1034f5 + '\x22>设为当前</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>')["join"]('') + "\n          </div>\n        </div>\n      </div>" : '';
    return "<div class=\"story-asset-detail-copy story-asset-detail-panel-face story-asset-detail-panel-face--voice story-character-voice-panel\" data-story-character-voice-panel aria-hidden=\"" + !_0x2793f2["isActive"] + '\x22\x20' + (_0x2793f2["isActive"] ? '' : "inert") + ">\n      <div class=\"story-character-voice-navigation\">\n        <button type=\"button\" class=\"story-character-voice-capsule story-character-voice-return-control is-active\" data-story-action=\"close-character-voice\" aria-label=\"返回图片参考\">\n          <span class=\"story-character-voice-icon\">" + _0x23c3b4() + "</span>\n          <span>图片参考</span>\n        </button>\n      </div>\n      <div class=\"story-character-voice-current " + (_0x4b38b2 ? "has-reference" : 'is-empty') + "\">\n        " + (_0x4b38b2 ? renderAudioPlaybackSurface({
      'audioUrl': _0x4b38b2["audioUrl"] || _0x4b38b2["localPath"],
      'waveformUrl': _0x4b38b2['waveformLocalPath'] || _0x4b38b2["waveformUrl"],
      'className': 'story-character-voice-audio-card\x20has-reference\x20' + (_0x2793f2["isGenerating"] ? "img-preview-loading" : ''),
      'playLabel': "播放声音参考",
      'pauseLabel': "暂停声音参考",
      'disabled': _0x2793f2['isGenerating'],
      'ariaBusy': _0x2793f2['isGenerating'],
      'dataAttributes': {
        'data-story-character-voice-audio-surface': '',
        'data-story-character-voice-drop': ''
      },
      'trailingHtml': _0x2793f2["isGenerating"] ? renderLoadingOverlay({
        'compact': !![]
      }) : ''
    }) : '') + "\n        " + _0x52d3e3 + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x4b38b2 || _0x1b6ed0['length'] ? "<div class=\"story-character-voice-current-actions " + (_0x2793f2["isGenerating"] ? 'is-generating' : '') + "\">\n          " + (_0x4b38b2 ? "<button type=\"button\" class=\"story-character-voice-upload-button\" data-story-action=\"upload-character-voice\" aria-label=\"上传替换声音参考\" " + (_0x2793f2["isGenerating"] ? 'disabled' : '') + '>' + renderUploadIcon() + "</button>\n          <button type=\"button\" class=\"story-character-voice-remove\" data-story-action=\"remove-character-voice\" aria-label=\"移除声音参考\" " + (_0x2793f2['isGenerating'] ? "disabled" : '') + '>' + renderDeleteIcon() + "</button>" : '') + "\n          " + _0x22e294 + "\n        </div>" : '') + "\n      </div>\n      <div class=\"story-character-voice-fields\">\n        <label>\n          <span>试听台词 <small>优先合并角色对白，生成结果最多 5 秒</small></span>\n          <textarea data-story-character-voice-sample maxlength=\"" + Math["max"](0x1, Number(_0x2793f2["sampleMaxCharacters"]) || 0x1) + '\x22>' + escapeHtml(_0x2793f2["sampleText"] || '') + "</textarea>\n        </label>\n        <label>\n          <span>声音设定 <small>用于描述音色、年龄、情绪和说话方式</small></span>\n          <textarea data-story-character-voice-description maxlength=\"600\">" + escapeHtml(_0x2793f2["voiceDescription"] || '') + "</textarea>\n        </label>\n      </div>\n      " + (_0x2793f2["error"] ? '<p\x20class=\x22story-character-voice-error\x22\x20role=\x22alert\x22>' + escapeHtml(_0x2793f2["error"]) + "</p>" : '') + "\n      <div class=\"story-character-voice-generation-bar story-asset-generation-bar prompt-panel-footer\">\n        <footer class=\"story-character-voice-model-footer " + (_0x2793f2["isGenerating"] ? 'is-generating' : '') + "\" data-story-character-voice-model-footer>\n          " + _0x14f97f + "\n        </footer>\n        " + renderRequestDebugButton("data-story-action=\"debug-character-voice\"") + "<button type=\"button\" class=\"story-asset-generate-button story-main-action-button\" data-story-action=\"generate-character-voice\" " + (_0x2793f2["isGenerating"] ? 'disabled' : '') + '\x20aria-busy=\x22' + Boolean(_0x2793f2["isGenerating"]) + '\x22>' + (_0x2793f2["isGenerating"] ? renderStoryGenerationSpinner({
      'button': !![]
    }) : '') + "<span>" + (_0x2793f2["isGenerating"] ? '生成中' : _0x4b38b2 ? '重新生成声音' : "生成声音") + "</span></button>\n      </div>\n  </div>";
  }
  function _0xda9621(_0x5ccb79 = {}) {
    if (_0x5ccb79["empty"]) {
      return "<aside class=\"story-asset-detail story-empty-panel\">\n      <strong>暂无可用素材</strong>\n      " + (_0x5ccb79["showEmptyDescription"] ? '<p>' + escapeHtml(_0x5ccb79["emptyDescription"]) + "</p>" : '') + "\n    </aside>";
    }
    const _0x5ed202 = _0x5ccb79["asset"] || {};
    const _0x54102a = _0x5ccb79["appearance"] || {};
    const _0x1b9852 = Math['max'](0x20, Math["min"](0x44, Number(_0x5ccb79['detailSplitRatio']) || 0x32));
    const _0x2b4e96 = "<div class=\"story-asset-preview-caption\">\n      <div class=\"story-asset-caption-heading\">\n        <span class=\"story-asset-caption-title\">" + _0xd4bed4(_0x5ed202, {
      'canRename': _0x5ccb79['canRename']
    }) + _0x21ee45({
      ..._0x5ccb79["voicePlayer"],
      'id': _0x5ed202['id'],
      'name': _0x5ed202["name"]
    }) + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22story-asset-caption-tags\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x5ccb79["supportsBaseAppearance"] ? "<button type=\"button\" class=\"story-base-appearance-button " + (_0x5ccb79["isBaseAppearance"] ? "is-active" : '') + '\x20' + (_0x5ccb79["isBaseAppearanceSelectionDisabled"] ? "is-disabled" : '') + '\x22\x20' + (_0x5ccb79['hasMultipleAppearances'] ? "data-story-action=\"set-base-appearance\"" : "disabled") + " aria-pressed=\"" + Boolean(_0x5ccb79["isBaseAppearance"]) + "\" aria-disabled=\"" + !_0x5ccb79['canSetBaseAppearance'] + '\x22\x20title=\x22会以基础形象作为参考，生成角色的其他形象\x22>' + (_0x5ccb79["isBaseAppearance"] ? '基础形象' : "设为基础形象") + "</button>" : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x5ccb79["showStyleReference"] ? _0x5ba81d(_0x5ccb79["styleReference"]) : '') + "\n          " + _0x11b11f(_0x5ccb79["voiceCapsule"]) + "\n          " + (_0x5ccb79["allowDeleteAppearance"] ? "<button type=\"button\" class=\"story-character-voice-capsule story-delete-appearance-button\" data-story-action=\"delete-appearance\">删除形象</button>" : '') + "\n        </span>\n      </div>\n      <span data-story-asset-caption-meta>" + escapeHtml(_0x5ccb79["captionMeta"]) + "</span>\n    </div>";
    return "<aside class=\"story-asset-detail story-workspace-asset-detail-layout " + escapeHtml(_0x5ccb79["motionClass"] || '') + "\" data-story-asset-detail-layout style=\"--story-asset-detail-top:" + _0x1b9852 + '%;\x22>\x0a\x20\x20\x20\x20<div\x20class=\x22story-asset-preview-wrap' + (_0x5ccb79["previewActions"]?.['isDeleteAppearanceConfirming'] ? " is-delete-confirming" : '') + '\x22\x20data-story-appearance-wheel=\x22' + Boolean(_0x5ccb79["hasMultipleAppearances"]) + '\x22\x20' + (_0x5ccb79['hasMultipleAppearances'] ? "tabindex=\"0\" aria-label=\"滚动鼠标滚轮或按左右方向键切换形象\"" : '') + ">\n      <div class=\"story-asset-preview-slide " + (_0x5ccb79["isGeneratingAppearance"] ? "img-preview-loading" : '') + "\" aria-busy=\"" + Boolean(_0x5ccb79["isGeneratingAppearance"]) + "\">\n        " + renderImage({
      'imageUrl': _0x54102a['imageUrl'],
      'alt': _0x5ed202["name"] + '\x20·\x20' + (_0x54102a["name"] || '形象'),
      'className': "story-asset-preview"
    }) + "\n        " + (_0x5ccb79['isGeneratingAppearance'] ? renderLoadingOverlay() : '') + '\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20' + _0x53083a(_0x5ccb79['previewActions']) + '\x0a\x20\x20\x20\x20\x20\x20' + (_0x5ccb79["hasMultipleAppearances"] ? '' + _0x30954c("previous") + _0x30954c('next') : '') + "\n    </div>\n    <div class=\"story-asset-detail-splitter panel-resize-handle panel-resize-handle--horizontal panel-resize-handle--transient\" data-story-asset-detail-splitter role=\"separator\" aria-orientation=\"horizontal\" aria-label=\"调整形象预览与提示词区域高度\" aria-valuemin=\"32\" aria-valuemax=\"68\" aria-valuenow=\"" + Math["round"](_0x1b9852) + "\" tabindex=\"0\"></div>\n    <div class=\"story-asset-detail-panel-stage " + (_0x5ccb79["panel"]?.["isVoice"] ? "is-voice" : "is-image") + '\x20' + (_0x5ccb79["panel"]?.['isAnimating'] ? "is-animating" : 'is-settled') + '\x22\x20data-story-asset-detail-panel-stage>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-asset-detail-panel-cube\x20' + escapeHtml(_0x5ccb79["panel"]?.["motionClass"] || '') + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-asset-detail-copy\x20story-asset-detail-panel-face\x20story-asset-detail-panel-face--image\x22\x20aria-hidden=\x22' + Boolean(_0x5ccb79["panel"]?.["isVoice"]) + '\x22\x20' + (_0x5ccb79["panel"]?.["isVoice"] ? 'inert' : '') + '>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + _0x2b4e96 + "\n          <div class=\"story-asset-prompt-field\">\n            <div class=\"story-asset-prompt-editor\" data-story-asset-prompt data-story-asset-prompt-asset-id=\"" + escapeHtml(_0x5ed202['id']) + "\" data-story-asset-prompt-appearance-id=\"" + escapeHtml(_0x54102a['id']) + "\" contenteditable=\"" + (_0x5ed202['isLibraryAsset'] || _0x5ccb79["readOnly"] ? 'false' : "true") + "\" role=\"textbox\" aria-multiline=\"true\" aria-label=\"形象提示词\" spellcheck=\"false\">" + renderPromptMentions(_0x5ed202["isLibraryAsset"] || _0x5ccb79["readOnly"] ? _0x5ed202["description"] || _0x54102a["prompt"] || '' : _0x54102a["prompt"] || '', _0x54102a) + "</div>\n          </div>\n          " + (_0x5ed202['isLibraryAsset'] || _0x5ccb79["readOnly"] ? '' : "<div class=\"story-asset-generation-bar prompt-panel-footer\">\n            " + renderImageModelSelector({
      ..._0x5ccb79["imageModel"],
      'showSchemaControls': !![],
      'className': "story-asset-image-model-selector"
    }) + "\n            <div class=\"story-asset-generation-actions\">\n              " + _0xc7f0e1(_0x5ccb79["preset"]) + "\n              " + _0x5f597f(_0x5ccb79["promptControl"]) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>') + "\n        </div>\n        " + _0x42abc2(_0x5ccb79["voicePanel"]) + "\n      </div>\n    </div>\n  </aside>";
  }
  function _0x51186f(_0x20f151 = {}) {
    if (_0x20f151["kind"] === "batch-generation") {
      return _0x41c76a(_0x20f151['control']);
    }
    if (_0x20f151["kind"] === "prompt-generation") {
      return _0x5f597f(_0x20f151["control"]);
    }
    if (_0x20f151['kind'] === "preset") {
      return _0xc7f0e1(_0x20f151["control"]);
    }
    if (_0x20f151["kind"] === 'library-add') {
      return _0x455945(_0x20f151["control"]);
    }
    if (_0x20f151['kind'] === 'library-selection') {
      return _0x573bea(_0x20f151["control"]);
    }
    return '';
  }
  function _0x115b1e(_0x1bf5d1 = {}) {
    if (_0x1bf5d1['kind'] === "card") {
      return _0x1fff13(_0x1bf5d1['card']);
    }
    if (_0x1bf5d1['kind'] === "detail") {
      return _0xda9621(_0x1bf5d1["detail"]);
    }
    if (_0x1bf5d1['kind'] === "appearance-arrow") {
      return _0x30954c(_0x1bf5d1['direction']);
    }
    if (_0x1bf5d1["kind"] === "preview-actions") {
      return _0x53083a(_0x1bf5d1["actions"]);
    }
    if (_0x1bf5d1["kind"] === 'reference-input') {
      return _0x5ba81d(_0x1bf5d1["reference"]);
    }
    if (_0x1bf5d1["kind"] === "voice-capsule") {
      return _0x11b11f(_0x1bf5d1["voiceCapsule"]);
    }
    if (_0x1bf5d1["kind"] === "voice-panel") {
      return _0x42abc2(_0x1bf5d1['voicePanel']);
    }
    if (_0x1bf5d1["kind"] === "voice-player") {
      return _0x21ee45(_0x1bf5d1["voicePlayer"]);
    }
    if (_0x1bf5d1["kind"] === "voice-icon") {
      return _0x4e70d6(_0x1bf5d1["hasVoice"] === !![]);
    }
    return '';
  }
  return Object["freeze"]({
    'renderAssetControls': _0x51186f,
    'renderAssetSurface': _0x115b1e
  });
}