import { localPathToUrl } from '../../utils/localMediaPath.js';
import { buildWorkspaceAssetHoverPreviewContent, isWorkspaceAssetHoverLandscape } from '../workspaceAssetPresentation.js';
import { getWorkspaceAssetHoverCard, getWorkspaceAssetHoverCardId } from '../workspaceAssetHover.js';
import { getWorkspaceAssetAppearances, getWorkspaceAssetBaseAppearance } from '../workspaceAssetAppearance.js';
import { PERSON_REPLACEMENT_VIDEO_REFERENCE_KIND_CHARACTER_IMAGE, getPersonReplacementActiveImageResultIndex, getPersonReplacementImageResults, resolvePersonReplacementImageResultRef, resolvePersonReplacementVideoImageInput } from './personReplacementProject.js';
import { getPersonReplacementVoiceLibraryBoundCharacters } from './personReplacementVoiceLibrary.js';
function normalizeText(_0x10f0ee, _0x3d7ffc = '') {
  const _0x4cd06b = String(_0x10f0ee ?? '')["trim"]();
  return _0x4cd06b || _0x3d7ffc;
}
function normalizeMediaUrl(_0x5c5941) {
  const _0x374d3c = normalizeText(_0x5c5941);
  if (!_0x374d3c) {
    return '';
  }
  return localPathToUrl(_0x374d3c) || _0x374d3c;
}
function getCharacterAppearance(_0x4219a2, _0x4c5e68 = '') {
  const _0x355be0 = getWorkspaceAssetAppearances(_0x4219a2);
  return _0x355be0["find"](_0x538ff5 => _0x538ff5['id'] === _0x4c5e68) || getWorkspaceAssetBaseAppearance(_0x4219a2) || _0x355be0[0x0] || null;
}
function getCharacterVoiceUrl(_0x1d6944 = {}) {
  return normalizeMediaUrl(_0x1d6944["voiceReference"]?.["audioUrl"] || _0x1d6944["voiceReference"]?.["localPath"] || _0x1d6944["voiceRef"]);
}
function resolveVideoShotReferencePreview(_0x14bd9b, _0x22a422) {
  const _0x21c6f7 = resolvePersonReplacementVideoImageInput(_0x14bd9b, _0x22a422);
  const _0x401c60 = Array["isArray"](_0x21c6f7?.["referenceOptions"]) ? _0x21c6f7["referenceOptions"] : [];
  const _0x3c6816 = Math['max'](0x0, Math["min"](Math["max"](0x0, _0x401c60['length'] - 0x1), Math["trunc"](Number(_0x21c6f7?.["activeReferenceIndex"]) || 0x0)));
  const _0x3729b7 = _0x401c60[_0x3c6816] || null;
  return _0x3729b7 ? {
    'isCharacterReference': _0x3729b7["kind"] === PERSON_REPLACEMENT_VIDEO_REFERENCE_KIND_CHARACTER_IMAGE,
    'referenceImageRef': normalizeText(_0x3729b7["imageRef"])
  } : null;
}
export function createPersonReplacementAssetHoverPreviewController({
  getRoot = () => null,
  getProject = () => ({}),
  getSelectedAppearance = () => null,
  isTargetAssetDragActive = () => ![],
  documentObject = globalThis["document"],
  windowObject = globalThis
} = {}) {
  let _0xac1e1d = 0x0;
  let _0x2275ea = 0x0;
  let _0x217658 = 0x0;
  let _0xaec789 = null;
  let _0x33fc25 = '';
  let _0x1313dd = null;
  let _0x473637 = ![];
  const _0x4ae9b3 = () => getRoot()?.["querySelector"]?.('[data-story-asset-hover-preview]');
  const _0x461730 = _0x313d06 => {
    const _0x2ee00e = _0x313d06?.['closest']?.('.person-replacement-prompt-reference-inputs');
    const _0x44234c = _0x2ee00e ? _0x313d06?.["querySelector"]?.(".ref-thumb-media") : null;
    const _0x1f8b9e = normalizeMediaUrl(_0x44234c?.["currentSrc"] || _0x44234c?.['getAttribute']?.("src") || _0x44234c?.["src"]);
    if (!_0x1f8b9e) {
      return null;
    }
    const _0x4a82e4 = normalizeText(_0x313d06?.["dataset"]?.["slot"]) || 'input';
    const _0x4a30c8 = normalizeText(_0x313d06?.["getAttribute"]?.("aria-label")) || "模型入参 " + _0x4a82e4;
    return {
      'id': 'prompt-reference:' + _0x4a82e4 + ':' + _0x1f8b9e,
      'slotId': _0x4a82e4,
      'label': _0x4a30c8,
      'imageUrl': _0x1f8b9e
    };
  };
  const _0x976239 = _0x398ec3 => getWorkspaceAssetHoverCard(_0x398ec3, {
    'selector': "[data-story-asset-id], [data-story-reference-asset], [data-story-asset-hover-id]"
  }) || _0x398ec3?.["closest"]?.(".person-replacement-prompt-reference-inputs .ref-thumb-wrap[data-slot]") || null;
  const _0x366f0d = _0x9c767a => normalizeText(getWorkspaceAssetHoverCardId(_0x9c767a, {
    'datasetKeys': ["storyAssetHoverId", "storyAssetId", "storyReferenceAsset"]
  })) || _0x461730(_0x9c767a)?.['id'] || '';
  const _0x203bf0 = _0x11a144 => {
    if (!_0x11a144 || !_0x1313dd) {
      return ![];
    }
    return _0x366f0d(_0x11a144) === _0x1313dd["assetId"] && normalizeText(_0x11a144['dataset']?.["shotId"]) === _0x1313dd["shotId"] && normalizeText(_0x11a144["dataset"]?.["personId"]) === _0x1313dd["personId"];
  };
  const _0x20e2c5 = () => {
    _0x33fc25 = '';
    _0xaec789 = null;
    const _0x51740d = _0x4ae9b3();
    _0x51740d?.['classList']?.["remove"]?.("is-visible");
    _0x51740d?.["classList"]?.['remove']?.("is-prompt-reference-preview");
    _0x51740d?.['setAttribute']?.("aria-hidden", "true");
  };
  const _0x42f46d = () => {
    _0xac1e1d = 0x0;
    const _0x38c509 = _0x4ae9b3();
    if (!_0x38c509?.["classList"]?.['contains']?.("is-visible")) {
      return;
    }
    const _0xb3aa9f = _0x38c509['getBoundingClientRect']?.();
    if (!_0xb3aa9f) {
      return;
    }
    const _0x308cf2 = windowObject?.["innerWidth"] || documentObject?.["documentElement"]?.["clientWidth"] || 0x400;
    const _0x294a5c = windowObject?.["innerHeight"] || documentObject?.["documentElement"]?.["clientHeight"] || 0x300;
    const _0x44ca22 = 0xe;
    const _0x2f4c55 = 0xa;
    const _0x45f129 = Math["max"](_0x2f4c55, _0x308cf2 - _0xb3aa9f['width'] - _0x2f4c55);
    const _0x3e0461 = Math["max"](_0x2f4c55, _0x294a5c - _0xb3aa9f["height"] - _0x2f4c55);
    const _0x2eb442 = _0xaec789?.["getBoundingClientRect"]?.();
    const _0x455a1c = Number(_0x2eb442?.["width"]) > 0x0 && Number['isFinite'](Number(_0x2eb442?.["left"])) && Number["isFinite"](Number(_0x2eb442?.['top']));
    const _0x4a3ac7 = _0x455a1c ? Number(_0x2eb442['left']) + (Number(_0x2eb442["width"]) - _0xb3aa9f['width']) / 0x2 : _0x2275ea + _0x44ca22;
    const _0x2f0e48 = _0x455a1c ? Number(_0x2eb442['top']) - _0xb3aa9f["height"] - _0x44ca22 : _0x217658 + _0x44ca22;
    _0x38c509["style"]['left'] = Math["round"](Math["min"](Math['max'](_0x2f4c55, _0x4a3ac7), _0x45f129)) + 'px';
    _0x38c509["style"]["top"] = Math['round'](Math['min'](Math["max"](_0x2f4c55, _0x2f0e48), _0x3e0461)) + 'px';
  };
  const _0x11f6b4 = (_0x37fa0e, {
    anchor = null
  } = {}) => {
    _0x2275ea = Number(_0x37fa0e?.["clientX"] || 0x0);
    _0x217658 = Number(_0x37fa0e?.['clientY'] || 0x0);
    _0xaec789 = anchor;
    if (_0xac1e1d) {
      return;
    }
    typeof windowObject?.['requestAnimationFrame'] === "function" ? _0xac1e1d = windowObject["requestAnimationFrame"](_0x42f46d) : _0x42f46d();
  };
  const _0x59db98 = _0x12b025 => {
    _0x12b025?.["querySelectorAll"]?.("[data-story-asset-hover-image]")?.["forEach"]?.(_0x6e15be => {
      const _0x4b03c0 = () => {
        const _0x1af17a = isWorkspaceAssetHoverLandscape(_0x6e15be['naturalWidth'], _0x6e15be["naturalHeight"]);
        _0x6e15be['closest']?.(".story-asset-hover-preview-item")?.["classList"]?.["toggle"]?.("is-landscape", _0x1af17a);
        _0x6e15be["closest"]?.(".story-asset-hover-preview-cell")?.["classList"]?.["toggle"]?.('is-landscape', _0x1af17a);
        _0x42f46d();
      };
      if (_0x6e15be['complete'] && Number(_0x6e15be["naturalWidth"]) > 0x0) {
        _0x4b03c0();
      } else {
        _0x6e15be["addEventListener"]?.("load", _0x4b03c0, {
          'once': !![]
        });
      }
    });
  };
  const _0x18018c = (_0x2a21c3, _0x5e375b) => {
    const _0x527eb0 = getRoot();
    const _0x5e8bb3 = getProject();
    if (_0x473637 || !_0x2a21c3 || _0x5e375b?.["pointerType"] === 'touch' || _0x5e8bb3["workspace"]["view"] !== "project" || _0x527eb0?.["classList"]?.['contains']?.("is-marquee-selecting") || isTargetAssetDragActive()) {
      _0x20e2c5();
      return ![];
    }
    const _0x145cd2 = _0x461730(_0x2a21c3);
    const _0xf64a4f = _0x2a21c3["dataset"]?.["personReplacementAudioLibraryAsset"] === "true";
    const _0x22d142 = normalizeText(getWorkspaceAssetHoverCardId(_0x2a21c3, {
      'datasetKeys': ["storyAssetHoverId", "storyAssetId", 'storyReferenceAsset']
    })) || _0x145cd2?.['id'] || '';
    if (_0x203bf0(_0x2a21c3)) {
      _0x20e2c5();
      return ![];
    }
    const _0x156b67 = normalizeText(_0x2a21c3["dataset"]?.["storyAssetHoverAppearanceId"]);
    const _0x2bf64d = _0x5e8bb3["workspace"]["step"] === 0x2 && Boolean(_0x2a21c3["closest"]?.(".person-replacement-target-assets"));
    const _0x58d6db = _0x5e8bb3["workspace"]['step'] === 0x2 && Boolean(_0x2bf64d || _0x2a21c3["closest"]?.("[data-person-replacement-person-drop]"));
    const _0x201113 = _0x2a21c3["dataset"]?.["personReplacementReplacementAssetKind"] === 'scene';
    const _0x3684ca = _0x5e8bb3["workspace"]["step"] === 0x3 && _0x2a21c3["dataset"]?.["personReplacementVideoShotHoverPreview"] === "true";
    const _0x22b0e1 = _0x5e8bb3['workspace']["step"] === 0x3 && _0x2a21c3['dataset']?.["personReplacementVideoReferenceHoverPreview"] === "true";
    const _0xa217f3 = _0x5e8bb3["workspace"]["step"] === 0x5 && _0x2a21c3["dataset"]?.['personReplacementCompositeShotHoverPreview'] === "true";
    const _0x59c0c4 = Boolean(_0x145cd2);
    const _0x5afa80 = _0x3684ca || _0x22b0e1 || _0xa217f3 ? _0x5e8bb3["shots"]["findIndex"](_0x239625 => normalizeText(_0x239625?.['id']) === _0x22d142) : -0x1;
    const _0x215231 = _0x5afa80 >= 0x0 ? _0x5e8bb3["shots"][_0x5afa80] : null;
    const _0xebe198 = getPersonReplacementImageResults(_0x215231);
    const _0x3c077c = getPersonReplacementActiveImageResultIndex(_0x215231, _0xebe198);
    const _0x316d66 = resolvePersonReplacementImageResultRef(_0xebe198[_0x3c077c]) || normalizeText(_0x215231?.["replacementImageRef"]);
    const _0x159579 = _0x3684ca && _0x215231 ? resolveVideoShotReferencePreview(_0x5e8bb3, _0x215231) : null;
    const _0x530e82 = _0x215231 ? {
      'id': _0x22d142,
      'kind': "scene",
      'name': '片段' + String(_0x5afa80 + 0x1)['padStart'](0x2, '0'),
      'appearances': [{
        'id': "source-frame",
        'name': "原片关键帧",
        'imageUrl': normalizeMediaUrl(_0x215231['keyframeRef'])
      }, {
        'id': _0x159579?.["isCharacterReference"] ? 'character-reference' : "replacement-frame",
        'name': _0x159579?.['isCharacterReference'] ? "人物入参图" : "当前替换图",
        'imageUrl': normalizeMediaUrl(_0x159579?.['referenceImageRef'] || _0x316d66)
      }]
    } : null;
    const _0x56998e = _0x22b0e1 ? _0x5e8bb3["shots"]['find'](_0x2e3d11 => normalizeText(_0x2e3d11?.['id']) === normalizeText(_0x2a21c3['dataset']?.["shotId"])) || _0x215231 || null : null;
    const _0x245b9a = _0x56998e ? resolvePersonReplacementVideoImageInput(_0x5e8bb3, _0x56998e) : null;
    const _0x3cf8c8 = Array["isArray"](_0x245b9a?.["referenceOptions"]) ? _0x245b9a["referenceOptions"] : [];
    const _0x4128d3 = Math["max"](0x0, Math["min"](Math["max"](0x0, _0x3cf8c8["length"] - 0x1), Math["trunc"](Number(_0x2a21c3['dataset']?.["personReplacementVideoReferenceIndex"]) || 0x0)));
    const _0x55192d = Math["max"](0x0, Math["trunc"](Number(_0x2a21c3["dataset"]?.["personReplacementVideoReferenceResultIndex"]) || 0x0));
    const _0x5c1640 = normalizeText(_0x2a21c3['dataset']?.['personReplacementVideoReferenceSourceShotId']) ? _0xebe198[_0x55192d] : null;
    const _0x3e0587 = resolvePersonReplacementImageResultRef(_0x5c1640);
    const _0x47c799 = _0x3e0587 ? {
      'imageRef': _0x3e0587,
      'sourceShotIndex': _0x5afa80,
      'resultIndex': _0x55192d
    } : _0x3cf8c8[_0x4128d3];
    const _0x1459a3 = _0x47c799?.['imageRef'] ? {
      'id': _0x22d142,
      'kind': 'scene',
      'name': Number["isInteger"](_0x47c799["sourceShotIndex"]) ? '片段' + (_0x47c799['sourceShotIndex'] + 0x1) + ".图片" + ((_0x47c799["resultIndex"] || 0x0) + 0x1) : "替换参考图 " + (_0x4128d3 + 0x1),
      'appearances': [{
        'id': "video-reference-" + _0x4128d3,
        'name': "替换参考图",
        'imageUrl': normalizeMediaUrl(_0x47c799['imageRef'])
      }]
    } : null;
    const _0xf69542 = _0xa217f3 && _0x215231 ? {
      'id': _0x22d142,
      'kind': 'scene',
      'name': normalizeText(_0x215231["title"]) || '片段' + String(_0x5afa80 + 0x1)["padStart"](0x2, '0'),
      'appearances': [{
        'id': 'composite-thumbnail',
        'name': "片段缩略图",
        'imageUrl': normalizeMediaUrl(_0x316d66 || _0x215231["keyframeRef"])
      }]
    } : null;
    const _0x395b89 = _0x59c0c4 ? {
      'id': _0x22d142,
      'kind': "scene",
      'name': _0x145cd2['label'],
      'appearances': [{
        'id': _0x145cd2["slotId"],
        'name': _0x145cd2["label"],
        'imageUrl': _0x145cd2['imageUrl']
      }]
    } : null;
    const _0x386290 = !_0x59c0c4 && !_0x3684ca && !_0x22b0e1 && !_0xa217f3 && (_0x201113 || _0x5e8bb3["workspace"]["step"] === 0x1 && _0x5e8bb3["workspace"]['characterAssetTab'] === "scene");
    const _0x7c8020 = !_0x386290 && !_0xf64a4f && !_0x59c0c4 && !_0x58d6db && !_0x3684ca && !_0x22b0e1 && !_0xa217f3 && _0x5e8bb3['workspace']["characterAssetTab"] === 'library';
    const _0x72c40f = !_0x386290 && !_0x59c0c4 && !_0x58d6db && !_0x3684ca && !_0x22b0e1 && !_0xa217f3 && (_0xf64a4f || _0x5e8bb3["workspace"]["characterAssetTab"] === "audio");
    const _0x1959df = _0x5e8bb3['workspace']["characterAssetTab"] === "audio" ? _0x5e8bb3["audioAssets"] : _0x5e8bb3["libraryAssets"];
    const _0x204c3f = _0x72c40f ? _0x1959df['find'](_0x23afa3 => normalizeText(_0x23afa3?.['id']) === _0x22d142) : null;
    const _0x246ca7 = _0x204c3f ? getPersonReplacementVoiceLibraryBoundCharacters(_0x5e8bb3, _0x204c3f)["map"](_0x584664 => {
      const _0x3a65d8 = getWorkspaceAssetBaseAppearance(_0x584664) || getWorkspaceAssetAppearances(_0x584664)['find'](_0x2f6ceb => normalizeText(_0x2f6ceb?.["imageUrl"]));
      return {
        'id': _0x584664['id'],
        'name': normalizeText(_0x584664["name"]) || "未命名人设",
        'imageUrl': normalizeMediaUrl(_0x3a65d8?.["imageUrl"])
      };
    })["filter"](_0x2f1ec4 => _0x2f1ec4["imageUrl"]) : [];
    const _0x280f3a = _0x246ca7["length"] ? {
      'id': _0x22d142,
      'kind': "character",
      'name': normalizeText(_0x204c3f?.["name"]) || "音频绑定人设",
      'appearances': _0x246ca7
    } : null;
    const _0x3b359c = _0x386290 ? _0x5e8bb3["scenes"] : _0x7c8020 ? _0x5e8bb3["libraryAssets"] : _0x72c40f ? _0x1959df : _0x5e8bb3["characters"];
    const _0x3e4c6f = _0x395b89 || _0xf69542 || _0x1459a3 || _0x530e82 || _0x280f3a || _0x3b359c["find"](_0x3c7cfc => normalizeText(_0x3c7cfc?.['id']) === _0x22d142);
    if (_0x72c40f && !_0x280f3a) {
      _0x20e2c5();
      return ![];
    }
    const _0x2561e9 = _0x4ae9b3();
    const _0x2a240b = _0x59c0c4 ? _0x395b89?.["appearances"]?.[0x0] : _0xa217f3 ? _0xf69542?.["appearances"]?.[0x0] : _0x22b0e1 ? _0x1459a3?.['appearances']?.[0x0] : _0x3684ca ? _0x530e82?.["appearances"]?.[0x1] : _0x72c40f ? _0x280f3a?.["appearances"]?.[0x0] : _0x3e4c6f?.['isLibraryAsset'] ? _0x3e4c6f : _0x156b67 ? getCharacterAppearance(_0x3e4c6f, _0x156b67) : getSelectedAppearance(_0x3e4c6f);
    const _0x3161e5 = _0x72c40f ? _0x280f3a : _0x58d6db && _0x2a240b ? {
      ..._0x3e4c6f,
      'appearances': [_0x2a240b]
    } : _0x3e4c6f;
    const _0x46d6ea = buildWorkspaceAssetHoverPreviewContent(_0x3161e5, {
      'selectedAssetId': _0x59c0c4 || _0x3684ca || _0x22b0e1 || _0xa217f3 ? _0x22d142 : _0x58d6db ? _0x22d142 : _0x72c40f && _0x5e8bb3["workspace"]["characterAssetTab"] === "audio" ? _0x5e8bb3["workspace"]['selectedAudioAssetId'] : _0x7c8020 || _0x72c40f ? _0x5e8bb3["workspace"]['selectedLibraryAssetId'] : _0x386290 ? _0x5e8bb3['workspace']["selectedSceneId"] : _0x5e8bb3["workspace"]['selectedCharacterId'],
      'selectedAppearanceId': _0x2a240b?.['id'],
      'mediaOnly': _0x3684ca || _0x22b0e1 || _0xa217f3 || _0x59c0c4 || _0x72c40f || [0x1, 0x2]['includes'](_0x5e8bb3["workspace"]["step"]),
      'getAppearances': getWorkspaceAssetAppearances,
      'hasVoiceReference': _0x28ffd1 => Boolean(getCharacterVoiceUrl(_0x28ffd1))
    });
    if (!_0x2561e9 || !_0x46d6ea) {
      _0x20e2c5();
      return ![];
    }
    const _0x467270 = _0x22d142 + ':' + (_0x2a240b?.['id'] || '') + ':' + _0x46d6ea["mediaOnly"] + ':' + _0x46d6ea['appearances']["map"](_0x1e7388 => (_0x1e7388?.['id'] || '') + ':' + (_0x1e7388?.['imageUrl'] || ''))['join']('|');
    _0x33fc25 = _0x22d142;
    _0x2561e9["dataset"]['signature'] !== _0x467270 && (_0x2561e9["dataset"]["signature"] = _0x467270, _0x2561e9["style"]["setProperty"]("--story-asset-hover-columns", String(_0x46d6ea["columns"])), _0x2561e9['innerHTML'] = _0x46d6ea['html'], _0x59db98(_0x2561e9));
    _0x2561e9['classList']["toggle"]("is-prompt-reference-preview", _0x59c0c4);
    _0x2561e9["classList"]["add"]("is-visible");
    _0x2561e9['setAttribute']("aria-hidden", "false");
    _0x11f6b4(_0x5e375b, {
      'anchor': _0x59c0c4 ? _0x2a21c3 : null
    });
    return !![];
  };
  const _0x25e993 = _0x5487c3 => {
    const _0x2661c5 = getRoot();
    if (_0x5487c3["target"]?.["closest"]?.(".person-replacement-detection-label")) {
      _0x20e2c5();
      return;
    }
    const _0x11a2ff = _0x976239(_0x5487c3['target']);
    if (!_0x11a2ff || !_0x2661c5?.["contains"]?.(_0x11a2ff)) {
      return;
    }
    if (_0x5487c3['relatedTarget'] && _0x11a2ff["contains"]?.(_0x5487c3["relatedTarget"])) {
      return;
    }
    _0x18018c(_0x11a2ff, _0x5487c3);
  };
  const _0x55a6aa = _0x5d6d3b => {
    const _0x2cb3e3 = getRoot();
    if (_0x5d6d3b["target"]?.['closest']?.(".person-replacement-detection-label")) {
      if (_0x33fc25) {
        _0x20e2c5();
      }
      return;
    }
    const _0xc0c8de = _0x976239(_0x5d6d3b["target"]);
    if (!_0xc0c8de || !_0x2cb3e3?.["contains"]?.(_0xc0c8de)) {
      if (!isTargetAssetDragActive()) {
        _0x1313dd = null;
      }
      if (_0x33fc25) {
        _0x20e2c5();
      }
      return;
    }
    _0x18018c(_0xc0c8de, _0x5d6d3b);
  };
  const _0x5ebb9c = _0x2d8161 => {
    const _0xbbcfda = _0x976239(_0x2d8161["target"]);
    !isTargetAssetDragActive() && _0x203bf0(_0xbbcfda) && (_0x1313dd = null);
    if (!_0xbbcfda || _0x366f0d(_0xbbcfda) !== _0x33fc25) {
      return;
    }
    if (_0x2d8161['relatedTarget'] && _0xbbcfda['contains']?.(_0x2d8161["relatedTarget"])) {
      return;
    }
    _0x20e2c5();
  };
  return Object["freeze"]({
    'blockDropTarget'(_0x709d11 = null) {
      _0x1313dd = _0x709d11 ? {
        'assetId': normalizeText(_0x709d11["assetId"]),
        'shotId': normalizeText(_0x709d11["shotId"]),
        'personId': normalizeText(_0x709d11['personId'])
      } : null;
    },
    'destroy'() {
      if (_0x473637) {
        return;
      }
      _0x473637 = !![];
      _0xac1e1d && typeof windowObject?.["cancelAnimationFrame"] === "function" && windowObject["cancelAnimationFrame"](_0xac1e1d);
      _0xac1e1d = 0x0;
      _0x1313dd = null;
      _0x20e2c5();
    },
    'handlePointerMove': _0x55a6aa,
    'handlePointerOut': _0x5ebb9c,
    'handlePointerOver': _0x25e993,
    'hide': _0x20e2c5,
    'show': _0x18018c
  });
}