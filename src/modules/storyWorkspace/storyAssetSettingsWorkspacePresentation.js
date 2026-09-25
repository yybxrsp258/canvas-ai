import { buildWorkspaceAssetLibraryItems, createWorkspaceAssetLibraryDisclosure } from '../workspaceAssetLibrary.js';
import { renderWorkspaceAssetSettingsShell } from '../workspaceAssetSettingsShell.js';
import { renderWorkspacePreviewArrow } from '../workspaceAssetPresentation.js';
import { ensureStoryAssetBaseAppearance, getStoryAssetAppearance, getStoryAssetAppearances } from './storyAssetAppearances.js';
import { hasStoryCharacterVoiceReference } from './storyCharacterVoice.js';
import { renderStoryReplicationReplacementSettings, renderStoryReplicationReplacementTrigger, renderStoryReplicationAssetComparison } from './storyReplicationReplacementPresentation.js';
import { normalizeStoryAssetDetailSplitRatio, normalizeStoryAssetSplitRatio } from './storyWorkspaceInteractions.js';
function normalizeText(_0x1fc72b) {
  return String(_0x1fc72b ?? '')["trim"]();
}
export function isStoryAddedAssetAppearance(_0x4cef7d = {}) {
  return ["library", "upload"]["includes"](normalizeText(_0x4cef7d?.["sourceOrigin"]));
}
export function removeStoryAddedAssetAppearance(_0xd57f2e = {}, _0x573178 = '') {
  const _0x1afb06 = getStoryAssetAppearances(_0xd57f2e);
  const _0x110edd = normalizeText(_0x573178);
  const _0x376869 = _0x1afb06['findIndex'](_0x82567b => normalizeText(_0x82567b?.['id']) === _0x110edd);
  const _0x5ac4fa = _0x1afb06[_0x376869] || null;
  if (_0x1afb06["length"] <= 0x1 || _0x376869 < 0x0 || !isStoryAddedAssetAppearance(_0x5ac4fa)) {
    return {
      'removed': ![],
      'removedAppearance': null,
      'removedIndex': -0x1,
      'nextIndex': Math['max'](0x0, Math['min'](_0x1afb06["length"] - 0x1, _0x376869))
    };
  }
  _0xd57f2e["appearances"] = _0x1afb06["filter"]((_0x187b39, _0x773016) => _0x773016 !== _0x376869);
  normalizeText(_0xd57f2e["baseAppearanceId"]) === _0x110edd && (_0xd57f2e["baseAppearanceId"] = '', ensureStoryAssetBaseAppearance(_0xd57f2e));
  return {
    'removed': !![],
    'removedAppearance': _0x5ac4fa,
    'removedIndex': _0x376869,
    'nextIndex': Math["max"](0x0, Math["min"](_0xd57f2e["appearances"]["length"] - 0x1, _0x376869))
  };
}
const STORY_VISUAL_ASSET_KINDS = ['character', "scene", 'prop'];
export function getMissingStoryAssetImages(_0x49276a = []) {
  return (Array["isArray"](_0x49276a) ? _0x49276a : [])["flatMap"](_0x46e95d => {
    const _0x54a19e = normalizeText(_0x46e95d?.['kind']);
    if (!STORY_VISUAL_ASSET_KINDS['includes'](_0x54a19e)) {
      return [];
    }
    const _0x25d762 = getStoryAssetAppearances(_0x46e95d);
    const _0x4274b3 = _0x25d762["length"] ? _0x25d762 : [_0x46e95d];
    return _0x4274b3["filter"](_0x19b16d => !normalizeText(_0x19b16d?.["imageUrl"]))["map"](_0x3b2724 => ({
      'kind': _0x54a19e,
      'assetId': normalizeText(_0x46e95d?.['id']),
      'assetName': normalizeText(_0x46e95d?.["name"]),
      'appearanceId': normalizeText(_0x3b2724?.['id']),
      'appearanceName': normalizeText(_0x3b2724?.["name"])
    }));
  });
}
export function buildMissingStoryAssetImageWarning(_0x18b909 = []) {
  const _0x1fd4ae = {
    'character': '角色',
    'scene': '场景',
    'prop': '道具'
  };
  const _0xe34c34 = STORY_VISUAL_ASSET_KINDS["map"](_0x50c7c8 => {
    const _0x23daa1 = (Array["isArray"](_0x18b909) ? _0x18b909 : [])['filter'](_0x169d5d => _0x169d5d?.['kind'] === _0x50c7c8)["length"];
    return _0x23daa1 ? _0x1fd4ae[_0x50c7c8] + '\x20' + _0x23daa1 + '\x20张' : '';
  })["filter"](Boolean);
  if (!_0xe34c34["length"]) {
    return '';
  }
  return "检测到缺少图片：" + _0xe34c34["join"]('、') + '。跳过后，这些素材不会作为分镜视频的图片参考。是否跳过并继续？';
}
export function createStoryAssetSettingsWorkspacePresentation({
  projection: _0x5a2b8c,
  presentation: _0x926206,
  getTabLabel = _0x5307b5 => _0x5307b5,
  renderTabIcon = () => '',
  renderPageFooter = () => ''
} = {}) {
  if (!_0x5a2b8c || !_0x926206) {
    throw new TypeError("Story asset settings workspace requires projection and presentation owners.");
  }
  const _0x269865 = _0x3d50af => {
    if (_0x3d50af["assetFilter"] === 'library') {
      return buildWorkspaceAssetLibraryItems();
    }
    return _0x3d50af["data"]["assets"]["filter"](_0x2cf046 => _0x2cf046['kind'] === _0x3d50af["assetFilter"]);
  };
  const _0x25bd46 = (_0x351eb9 = {}) => normalizeText(_0x351eb9?.['mediaKind'])["toLowerCase"]() === 'image' && Boolean(normalizeText(_0x351eb9?.["sourceUrl"] || _0x351eb9?.["imageUrl"]));
  const _0x1e216f = (_0x3ab61a = {}, _0x507e7e = []) => {
    const _0x554c38 = new Set((Array["isArray"](_0x507e7e) ? _0x507e7e : [])["filter"](_0x25bd46)["map"](_0x2b39a2 => normalizeText(_0x2b39a2?.['id']))['filter'](Boolean));
    if (_0x3ab61a['assetSelectionMode']) {
      return (Array['isArray'](_0x3ab61a["selectedAssetIds"]) ? _0x3ab61a["selectedAssetIds"] : [])["map"](normalizeText)["filter"](_0x5ccdde => _0x554c38["has"](_0x5ccdde));
    }
    const _0x130baf = normalizeText(_0x3ab61a["selectedAssetId"]);
    return _0x554c38['has'](_0x130baf) ? [_0x130baf] : [];
  };
  const _0x5c4d19 = (_0x3a0558, _0x5c4c56) => _0x5c4c56["find"](_0x5206f0 => _0x5206f0['id'] === _0x3a0558["selectedAssetId"]) || _0x5c4c56[0x0] || null;
  const _0x49b499 = (_0xe30658, _0x3d0315) => {
    const _0x352f27 = Number(_0xe30658["assetAppearanceIndexes"]?.[_0x3d0315?.['id']]);
    const _0x39df77 = Math['max'](0x0, getStoryAssetAppearances(_0x3d0315)['length'] - 0x1);
    return Math["max"](0x0, Math["min"](_0x39df77, Number["isFinite"](_0x352f27) ? Math["trunc"](_0x352f27) : 0x0));
  };
  const _0x117211 = (_0xb092b2, _0x452aea) => _0x452aea?.['isLibraryAsset'] ? _0x452aea : getStoryAssetAppearance(_0x452aea, _0x49b499(_0xb092b2, _0x452aea));
  const _0x1ae124 = (_0x48ed54 = {}, _0x134151 = {}) => {
    const _0x4cebb0 = normalizeText(_0x48ed54?.['id']);
    const _0xa258b4 = normalizeText(_0x134151?.['id']);
    return _0x4cebb0 && _0xa258b4 ? _0x4cebb0 + ':' + _0xa258b4 : '';
  };
  const _0x353e0a = isStoryAddedAssetAppearance;
  const _0x40837e = (_0x384732, _0x148715, {
    previewAppearance = null,
    statusText = '',
    cardStatusHtml = '',
    draggable = ![],
    cardClassName = '',
    cardAttributes = '',
    shellClassName = '',
    accessoryHtml = '',
    cardMetaHtml = '',
    cardMediaHtml = renderStoryReplicationAssetComparison(_0x384732, _0x148715),
    fallbackImageUrl = '',
    workspaceAssetLibraryImage = ![]
  } = {}) => _0x926206["renderAssetSurface"]({
    'kind': 'card',
    'card': _0x5a2b8c['projectAssetCard'](_0x384732, _0x148715, {
      'previewAppearance': previewAppearance,
      'statusText': statusText,
      'cardStatusHtml': cardStatusHtml,
      'draggable': draggable,
      'cardClassName': cardClassName,
      'cardAttributes': cardAttributes,
      'shellClassName': shellClassName,
      'accessoryHtml': accessoryHtml,
      'cardMetaHtml': cardMetaHtml,
      'cardMediaHtml': cardMediaHtml,
      'fallbackImageUrl': fallbackImageUrl,
      'workspaceAssetLibraryImage': workspaceAssetLibraryImage
    })
  });
  const _0x5f5bf8 = _0x3894b9 => _0x926206['renderAssetSurface']({
    'kind': 'appearance-arrow',
    'direction': _0x3894b9
  });
  const _0xb9ab9b = (_0x4b1d61 = {}, {
    disabled = ![]
  } = {}) => _0x926206["renderAssetSurface"]({
    'kind': "reference-input",
    'reference': {
      'referenceImageUrl': _0x4b1d61['referenceImageUrl'],
      'disabled': disabled
    }
  });
  const _0x2ddb5b = (_0x586772, {
    action = '',
    label = '',
    className = ''
  } = {}) => renderWorkspacePreviewArrow(_0x586772, {
    'action': action,
    'label': label,
    'className': className,
    'actionAttributes': {
      'data-story-action': action
    }
  });
  const _0x1fb780 = _0x53ed3e => _0x2ddb5b(_0x53ed3e, {
    'action': _0x53ed3e === "previous" ? "previous-clip" : 'next-clip',
    'label': _0x53ed3e === 'previous' ? '上一幕' : '下一幕',
    'className': "story-clip-navigation-arrow"
  });
  const _0x4d2f80 = new Set(["mp3", 'wav', "m4a"]);
  const _0x5c4b4e = new Set(["audio/mpeg", 'audio/mp3', "audio/wav", "audio/x-wav", "audio/mp4", "audio/x-m4a"]);
  const _0x313f98 = _0x4c1768 => {
    const _0x323253 = normalizeText(_0x4c1768?.["name"])['toLowerCase']();
    const _0x61113f = _0x323253["includes"]('.') ? _0x323253['split']('.')['pop']() : '';
    const _0x191771 = normalizeText(_0x4c1768?.["type"])['toLowerCase']();
    return _0x4d2f80['has'](_0x61113f) || _0x5c4b4e["has"](_0x191771);
  };
  const _0x1ebc19 = (_0x200742 = {}) => _0x926206['renderAssetControls']({
    'kind': "batch-generation",
    'control': _0x5a2b8c['projectAssetControl']("batch-generation", {
      'state': _0x200742
    })
  });
  const _0x15179f = (_0x20576b = {}, _0x529ace = {}) => _0x926206["renderAssetControls"]({
    'kind': "prompt-generation",
    'control': _0x5a2b8c["projectAssetControl"]("prompt-generation", {
      'state': _0x20576b,
      'generationControl': _0x529ace
    })
  });
  const _0x51c31f = ({
    selectedCount = 0x0,
    projectAssets = [],
    showCount = !![]
  } = {}) => {
    const _0x33eb09 = _0x5a2b8c["projectAssetControl"]('library-selection', {
      'selectionMode': showCount,
      'selectedCount': selectedCount,
      'projectAssets': projectAssets,
      'getTabLabel': getTabLabel
    });
    return _0x926206['renderAssetControls']({
      'kind': "library-add",
      'control': {
        ..._0x33eb09,
        'showCount': showCount
      }
    });
  };
  const _0x219ebd = ({
    selectionMode = ![],
    selectedCount = 0x0,
    allSelected = ![],
    projectAssets = []
  } = {}) => _0x926206["renderAssetControls"]({
    'kind': "library-selection",
    'control': _0x5a2b8c['projectAssetControl']('library-selection', {
      'selectionMode': selectionMode,
      'selectedCount': selectedCount,
      'allSelected': allSelected,
      'projectAssets': projectAssets,
      'getTabLabel': getTabLabel
    })
  });
  const _0x145e1d = (_0x2d6287, _0x171287 = {}) => {
    if (typeof _0x2d6287?.["classList"]?.['toggle'] !== "function") {
      return ![];
    }
    const _0xa5ab09 = hasStoryCharacterVoiceReference(_0x171287);
    _0x2d6287["classList"]["toggle"]('has-reference', _0xa5ab09);
    _0x2d6287["classList"]["toggle"]("is-missing", !_0xa5ab09);
    return !![];
  };
  const _0x2b8519 = (_0x35491a = ![]) => _0x926206['renderAssetSurface']({
    'kind': "voice-icon",
    'hasVoice': _0x35491a
  });
  const _0x188f67 = _0x458107 => _0x926206["renderAssetSurface"]({
    'kind': 'voice-player',
    'voicePlayer': _0x5a2b8c["projectAssetControl"]('voice-player', {
      'asset': _0x458107
    })
  });
  const _0x4000f9 = (_0x4010ef, _0x567e13 = {}) => {
    const _0x4717fe = _0x4010ef?.["querySelector"]?.(".story-asset-caption-title");
    if (!_0x4717fe) {
      return ![];
    }
    _0x4717fe["querySelector"]?.('[data-story-character-voice-player]')?.["remove"]?.();
    const _0x2fe070 = _0x188f67(_0x567e13);
    if (_0x2fe070) {
      _0x4717fe['insertAdjacentHTML']("beforeend", _0x2fe070);
    }
    return !![];
  };
  const _0x4b8028 = ({
    state = {},
    asset = {},
    appearance = {},
    generationControl = {},
    readOnly = ![]
  } = {}) => _0x926206["renderAssetSurface"]({
    'kind': "preview-actions",
    'actions': _0x5a2b8c["projectAssetControl"]('preview-actions', {
      'state': state,
      'asset': asset,
      'appearance': appearance,
      'generationControl': generationControl,
      'readOnly': readOnly
    })
  });
  const _0x39208e = (_0x2bbf74, _0x9fa159, {
    showEmptyDescription = !![],
    readOnly = ![]
  } = {}) => _0x926206["renderAssetSurface"]({
    'kind': "detail",
    'detail': {
      ..._0x5a2b8c["projectAssetDetail"](_0x2bbf74, _0x9fa159, {
        'showEmptyDescription': showEmptyDescription,
        'readOnly': readOnly
      }),
      'detailSplitRatio': normalizeStoryAssetDetailSplitRatio(_0x2bbf74["assetDetailSplitRatio"])
    }
  });
  const _0x55a857 = _0x5be407 => {
    const _0x570326 = _0x269865(_0x5be407);
    const _0x3549ef = _0x5be407["assetFilter"] === 'library' ? _0x570326["filter"](_0x25bd46) : _0x570326;
    const _0x1dd399 = _0x3549ef["length"] > 0x0 && _0x3549ef["every"](_0xdf87fc => _0x5be407["selectedAssetIds"]["includes"](_0xdf87fc['id']));
    const _0x559522 = _0x5c4d19(_0x5be407, _0x570326);
    _0x559522 && _0x5be407["selectedAssetId"] !== _0x559522['id'] && (_0x5be407["selectedAssetId"] = _0x559522['id']);
    const _0x46e7d9 = _0x5be407["assetFilter"] === 'library' ? _0x1e216f(_0x5be407, _0x570326) : [];
    const _0x37e43c = _0x5be407["data"]["assets"]['filter'](_0x3e17cb => _0x3e17cb["kind"] === "character")["length"];
    const _0x1f7dd7 = _0x5be407["data"]['assets']["filter"](_0x34b524 => _0x34b524["kind"] === "scene")["length"];
    const _0x9f4fcb = _0x5be407["data"]["assets"]["filter"](_0x228ef2 => _0x228ef2["kind"] === "prop")["length"];
    const _0x1a59e0 = buildWorkspaceAssetLibraryItems()["length"];
    const _0x409700 = _0x100aa1 => _0x40837e(_0x5be407, _0x100aa1, {
      'cardMediaHtml': _0x5be407["assetFilter"] !== "library" ? renderStoryReplicationAssetComparison(_0x5be407, _0x100aa1) : '',
      'previewAppearance': _0x5be407["assetFilter"] === "library" ? {
        ..._0x100aa1,
        'imageUrl': _0x100aa1["thumbnailUrl"] || _0x100aa1['imageUrl']
      } : null,
      'fallbackImageUrl': _0x5be407["assetFilter"] === "library" ? _0x100aa1["sourceUrl"] : '',
      'workspaceAssetLibraryImage': _0x5be407["assetFilter"] === 'library'
    });
    const _0x46d6b1 = _0x5be407['assetFilter'] === "library" ? (_0x5be407["assetLibraryDisclosure"] || createWorkspaceAssetLibraryDisclosure())["render"]({
      'assets': _0x570326,
      'renderAsset': _0x409700
    }) : _0x570326["map"](_0x409700)["join"]('');
    return renderWorkspaceAssetSettingsShell({
      'className': 'story-workspace-assets-page',
      'activeTab': _0x5be407['assetFilter'],
      'tabCount': 0x4,
      'tabsHtml': [['character', _0x37e43c], ["scene", _0x1f7dd7], ["prop", _0x9f4fcb], ["library", _0x1a59e0]]["map"](([_0x400c3b, _0x6d10ab]) => "<button type=\"button\" class=\"" + (_0x5be407["assetFilter"] === _0x400c3b ? "is-active" : '') + "\" data-story-asset-filter=\"" + _0x400c3b + '\x22\x20role=\x22tab\x22\x20aria-selected=\x22' + (_0x5be407["assetFilter"] === _0x400c3b) + "\" tabindex=\"" + (_0x5be407["assetFilter"] === _0x400c3b ? '0' : '-1') + '\x22>' + renderTabIcon(_0x400c3b) + '<span\x20class=\x22story-asset-tab-label\x22>' + getTabLabel(_0x400c3b) + "</span><span class=\"story-asset-tab-count\">" + _0x6d10ab + "</span></button>")['join'](''),
      'calloutTitle': _0x5be407["assetFilter"] === "character" ? "生成或导入角色形象" : _0x5be407["assetFilter"] === 'scene' ? "生成或导入场景设定" : _0x5be407["assetFilter"] === 'prop' ? "生成或导入道具设定" : '从总素材加入项目',
      'calloutDescription': _0x5be407['assetFilter'] === "library" ? _0x5be407["assetSelectionMode"] ? _0x5be407["selectedAssetIds"]['length'] ? '已选择\x20' + _0x5be407['selectedAssetIds']["length"] + '\x20张图片' : "点击图片进行多选，或拖动鼠标框选。" : '单击图片可直接加入项目；需要多张时可使用框选多选。' : _0x5be407["assetSelectionMode"] ? "已选择 " + _0x5be407["selectedAssetIds"]["length"] + '\x20项' : _0x5be407["assetFilter"] === "character" ? "多形象角色会先确定基础形象，再以其作为参考生成其他形象。" : "每项素材保留一张可复用的设定图。",
      'calloutActionsHtml': renderStoryReplicationReplacementTrigger(_0x5be407) + (_0x5be407["assetFilter"] === "library" ? _0x219ebd({
        'selectionMode': _0x5be407["assetSelectionMode"],
        'selectedCount': _0x46e7d9["length"],
        'allSelected': _0x1dd399,
        'projectAssets': _0x5be407["data"]["assets"]
      }) : _0x5be407["assetSelectionMode"] ? '<button\x20type=\x22button\x22\x20class=\x22story-secondary-button\x22\x20data-story-action=\x22toggle-all-assets\x22\x20aria-pressed=\x22' + _0x1dd399 + '\x22\x20' + (_0x570326["length"] && !_0x5be407["isBatchGenerating"] ? '' : "disabled") + '>' + (_0x1dd399 ? '取消全选' : '全选') + "</button><button type=\"button\" class=\"story-secondary-button\" data-story-action=\"cancel-asset-selection\" " + (_0x5be407["isBatchGenerating"] ? "disabled" : '') + ">取消</button>" + _0x1ebc19(_0x5be407) : "<button type=\"button\" class=\"story-secondary-button workspace-selection-trigger\" data-story-action=\"toggle-asset-selection\">多选</button>"),
      'cardsHtml': renderStoryReplicationReplacementSettings(_0x5be407) + _0x46d6b1,
      'detailHtml': _0x39208e(_0x5be407, _0x559522),
      'footerHtml': renderPageFooter(_0x5be407, {
        'nextLabel': _0x5be407["data"]?.['project']?.["sourceMode"] === "video-replication" ? _0x5be407["data"]['episodes']["length"] === 0x1 ? _0x5be407["data"]["episodes"][0x0]["clips"]?.["length"] ? "进入视频制作" : "生成分段提示词" : '下一步：视频列表' : "生成分镜视频"
      }),
      'splitRatio': normalizeStoryAssetSplitRatio(_0x5be407["assetSplitRatio"])
    });
  };
  return Object["freeze"]({
    'getAppearanceActionKey': _0x1ae124,
    'getLibraryActionAssetIds': _0x1e216f,
    'getSelectedAppearance': _0x117211,
    'getSelectedAppearanceIndex': _0x49b499,
    'getSelectedAsset': _0x5c4d19,
    'getVisibleAssets': _0x269865,
    'isAddedAppearance': _0x353e0a,
    'isLibraryImageAsset': _0x25bd46,
    'isSupportedCharacterVoiceFile': _0x313f98,
    'renderAppearanceArrow': _0x5f5bf8,
    'renderAssetBatchGenerationControl': _0x1ebc19,
    'renderAssetCard': _0x40837e,
    'renderAssetDetail': _0x39208e,
    'renderAssetPreviewActions': _0x4b8028,
    'renderAssetPromptGenerationControl': _0x15179f,
    'renderAssetReferenceInput': _0xb9ab9b,
    'renderAssetsPage': _0x55a857,
    'renderClipNavigationArrow': _0x1fb780,
    'renderLibraryAddToProjectControl': _0x51c31f,
    'renderLibrarySelectionActions': _0x219ebd,
    'renderPreviewArrow': _0x2ddb5b,
    'renderVoiceIcon': _0x2b8519,
    'syncCharacterVoiceCapsuleState': _0x145e1d,
    'syncCharacterVoicePlayerState': _0x4000f9
  });
}