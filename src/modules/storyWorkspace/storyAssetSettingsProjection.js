import { canEditStoryAssetStyleReference, getStoryAssetAppearance, getStoryAssetAppearanceStats, getStoryAssetAppearances, getStoryAssetBaseAppearance, isStoryAssetBaseAppearance } from './storyAssetAppearances.js';
import { getStoryAssetGenerationControlState, isStoryAssetCardLoading, isStoryAssetVoiceLoading } from './storyAssetGenerationState.js';
import { STORY_CHARACTER_ASSET_PROMPT_PREFIX } from './storyPlanningData.js';
import { STORY_CHARACTER_ASSET_PROMPT_PRESETS, STORY_SCENE_ASSET_PROMPT_PRESETS, getStoryCharacterAssetPromptPreset, getStorySceneAssetPromptPreset } from './storyAssetPromptPresets.js';
import { resolveStoryStyleSelection } from './storyStyleCatalog.js';
import { STORY_CHARACTER_VOICE_SAMPLE_MAX_CHARACTERS, getStoryCharacterVoiceWorkflow, getStoryCharacterVoiceWorkflowItems, hasStoryCharacterVoiceReference, normalizeStoryCharacterVoiceHistory, normalizeStoryCharacterVoiceReference } from './storyCharacterVoice.js';
function normalizeText(_0x38e118) {
  return String(_0x38e118 ?? '')["trim"]();
}
function freezeSnapshot(_0x68fc76) {
  if (Array['isArray'](_0x68fc76)) {
    return Object["freeze"](_0x68fc76['map'](_0x53dff2 => freezeSnapshot(_0x53dff2)));
  }
  if (_0x68fc76 && typeof _0x68fc76 === "object" && (Object["getPrototypeOf"](_0x68fc76) === Object["prototype"] || Object["getPrototypeOf"](_0x68fc76) === null)) {
    return Object['freeze'](Object['fromEntries'](Object['entries'](_0x68fc76)["map"](([_0x84516a, _0x4b2580]) => [_0x84516a, freezeSnapshot(_0x4b2580)])));
  }
  return _0x68fc76;
}
export function shouldRenderStoryAssetRoleTag(_0x1583f2 = '') {
  return !["scene", 'prop']['includes'](normalizeText(_0x1583f2));
}
export function getStoryAssetBatchDirectMode(_0x510a54 = '') {
  return ['scene', "prop"]["includes"](normalizeText(_0x510a54)) ? 'image' : '';
}
export function formatStoryAssetOccurrences(_0x52cf94 = '') {
  const _0x4200bd = normalizeText(_0x52cf94);
  if (!_0x4200bd) {
    return "当前项目";
  }
  const _0x2c16f4 = _0x4200bd["split"](/[、,，]/u)["map"](_0x7d7dea => _0x7d7dea["trim"]())['filter'](Boolean);
  const _0x1d8f57 = _0x2c16f4['map'](_0x260d45 => {
    const _0x45c2e3 = /(?:^|[-_])episode-(\d+)$/iu["exec"](_0x260d45);
    return _0x45c2e3 ? String(Math['max'](0x1, Number(_0x45c2e3[0x1]) || 0x1)) : '';
  });
  if (_0x2c16f4["length"] && _0x1d8f57["every"](Boolean)) {
    const _0x110abd = [...new Set(_0x1d8f57['map'](Number))]["sort"]((_0x43ea33, _0x1c3840) => _0x43ea33 - _0x1c3840);
    return '第\x20' + _0x110abd["join"]('、') + '\x20集';
  }
  return _0x2c16f4['map']((_0x5e565e, _0x3e83ae) => _0x1d8f57[_0x3e83ae] ? '第\x20' + _0x1d8f57[_0x3e83ae] + '\x20集' : _0x5e565e)["join"]('、');
}
export function getSelectedAppearanceIndex(_0x23c815, _0x58693e) {
  const _0x3e6637 = Number(_0x23c815["assetAppearanceIndexes"]?.[_0x58693e?.['id']]);
  const _0x4906a5 = Math["max"](0x0, getStoryAssetAppearances(_0x58693e)["length"] - 0x1);
  return Math["max"](0x0, Math["min"](_0x4906a5, Number["isFinite"](_0x3e6637) ? Math["trunc"](_0x3e6637) : 0x0));
}
function getSelectedAppearance(_0x49ffef, _0x4787af) {
  return _0x4787af?.["isLibraryAsset"] ? _0x4787af : getStoryAssetAppearance(_0x4787af, getSelectedAppearanceIndex(_0x49ffef, _0x4787af));
}
function getAppearanceActionKey(_0x121dc5 = {}, _0x4646be = {}) {
  const _0x2a0143 = normalizeText(_0x121dc5?.['id']);
  const _0x5231bc = normalizeText(_0x4646be?.['id']);
  return _0x2a0143 && _0x5231bc ? _0x2a0143 + ':' + _0x5231bc : '';
}
function isAddedAppearance(_0x3c9c32 = {}) {
  return ['library', "upload"]['includes'](normalizeText(_0x3c9c32?.["sourceOrigin"]));
}
function getCardPromptPreview(_0x54daab = {}, _0x3ee0b6 = {}, _0x19862f = {}) {
  let _0x3e84f4 = normalizeText(_0x19862f?.["prompt"] || _0x3ee0b6?.["prompt"]);
  if (_0x3ee0b6?.["kind"] !== 'character' || !_0x3e84f4) {
    return _0x3e84f4;
  }
  const _0xcc9d0a = _0x54daab?.["data"]?.["project"] || {};
  const _0x24323b = resolveStoryStyleSelection({
    'styleId': _0xcc9d0a["videoStyleId"],
    'stylePrompt': _0xcc9d0a["videoStylePrompt"],
    'videoStyle': _0xcc9d0a["videoStyle"]
  })["stylePrompt"];
  [STORY_CHARACTER_ASSET_PROMPT_PREFIX, _0x24323b, '正面全身人物设定图']["filter"](Boolean)["forEach"](_0x3824b6 => {
    _0x3e84f4 = _0x3e84f4["split"](_0x3824b6)['join']('');
  });
  return _0x3e84f4["split"](/\r?\n/u)['map'](_0x3230c9 => _0x3230c9["trim"]()["replace"](/(?:\s*[，,]){2,}/gu, '，')["replace"](/^[\s，,。；;:：|/·-]+|[\s，,。；;:：|/·-]+$/gu, ''))["filter"](Boolean)["join"]('\x0a');
}
function formatVoiceHistoryTime(_0x1f0fb0) {
  const _0x54d4e0 = new Date(Number(_0x1f0fb0));
  if (!Number["isFinite"](_0x54d4e0['getTime']())) {
    return "历史版本";
  }
  const _0x4be785 = _0x3179b8 => String(_0x3179b8)['padStart'](0x2, '0');
  return _0x54d4e0["getFullYear"]() + '/' + _0x4be785(_0x54d4e0["getMonth"]() + 0x1) + '/' + _0x4be785(_0x54d4e0['getDate']()) + '\x20' + _0x4be785(_0x54d4e0["getHours"]()) + ':' + _0x4be785(_0x54d4e0["getMinutes"]());
}
function projectPreset(_0x570dfc, _0xda1360, _0x4e44b2, _0x28d462) {
  if (!['character', 'scene']['includes'](_0xda1360)) {
    return {
      'visible': ![]
    };
  }
  const _0x1cfb52 = _0xda1360 === "scene";
  const _0x18d1c7 = !_0x1cfb52 && Array["isArray"](_0x570dfc["assetPromptPresets"]) && _0x570dfc["assetPromptPresets"]['length'] ? _0x570dfc["assetPromptPresets"] : null;
  const _0x54a785 = _0x1cfb52 ? STORY_SCENE_ASSET_PROMPT_PRESETS : _0x18d1c7 || STORY_CHARACTER_ASSET_PROMPT_PRESETS;
  const _0x2ac7e3 = _0x1cfb52 ? getStorySceneAssetPromptPreset(_0x570dfc["sceneAssetPromptPresetId"]) : _0x18d1c7?.['find'](_0x10b798 => _0x10b798['id'] === _0x570dfc["assetPromptPresetId"]) || _0x18d1c7?.[0x0] || getStoryCharacterAssetPromptPreset(_0x570dfc["assetPromptPresetId"]);
  const _0x186cb5 = _0x4e44b2 && _0x28d462 ? getStoryAssetGenerationControlState(_0x570dfc, _0x4e44b2['id'], _0x28d462['id']) : {
    'disabled': _0x570dfc['isBatchGenerating'] === !![]
  };
  return {
    'visible': !![],
    'assetKind': _0xda1360,
    'label': _0x1cfb52 ? '场景图片预设' : normalizeText(_0x570dfc["assetPromptPresetLabel"]) || "角色图片预设",
    'selectedId': _0x2ac7e3?.['id'] || '',
    'selectedLabel': _0x2ac7e3?.["label"] || '',
    'disabled': Boolean(_0x186cb5['disabled']),
    'options': _0x54a785["map"](_0xa82c65 => ({
      'id': _0xa82c65['id'],
      'label': _0xa82c65['label'],
      'description': _0xa82c65['description']
    }))
  };
}
function projectLibrarySyncState(_0x3dcf3f, _0x2b8ce1) {
  const _0x1d228f = _0x3dcf3f?.["totalAssetRef"] && typeof _0x3dcf3f["totalAssetRef"] === "object" ? _0x3dcf3f['totalAssetRef'] : null;
  const _0x1e9369 = normalizeText(_0x1d228f?.["assetId"]);
  const _0x581372 = Math['max'](0x0, Math["trunc"](Number(_0x1d228f?.['itemIndex']) || 0x0));
  if (!_0x1e9369) {
    return {
      'exists': ![],
      'synced': ![]
    };
  }
  const _0x29aaf6 = _0x2b8ce1({
    'assetId': _0x1e9369,
    'itemIndex': _0x581372
  });
  if (!_0x29aaf6) {
    return {
      'exists': ![],
      'synced': ![]
    };
  }
  const _0x475f54 = normalizeText(_0x1d228f?.['itemKey']);
  const _0x16735d = normalizeText(_0x29aaf6?.["nodeData"]?.["assetPackageItemKey"]);
  const _0x2f3e54 = !_0x475f54 || !_0x16735d || _0x475f54 === _0x16735d;
  const _0x505673 = normalizeText(_0x3dcf3f?.["imageUrl"]);
  const _0x5917db = normalizeText(_0x29aaf6?.["url"] || _0x29aaf6?.["nodeData"]?.["imageUrl"] || _0x29aaf6?.["nodeData"]?.['src']);
  return {
    'exists': _0x2f3e54,
    'synced': _0x2f3e54 && Boolean(_0x505673) && _0x505673 === _0x5917db
  };
}
function projectPreviewActions(_0x4a4dc, _0x1954a8, _0x36df72, _0x4978f9, _0x549050, _0x4a3bff) {
  if (_0x1954a8["isLibraryAsset"] || _0x549050) {
    return {
      'canDownload': Boolean(normalizeText(_0x36df72?.["imageUrl"]) && normalizeText(_0x1954a8?.["mediaKind"])["toLowerCase"]() !== "video"),
      'showProjectActions': ![]
    };
  }
  const _0x4b45b4 = projectLibrarySyncState(_0x36df72, _0x4a3bff);
  const _0x4c33f5 = getAppearanceActionKey(_0x1954a8, _0x36df72);
  const _0x2c9fdf = Boolean(_0x4c33f5 && normalizeText(_0x4a4dc["pendingDeleteAssetAppearanceKey"]) === _0x4c33f5);
  const _0x110ca2 = isAddedAppearance(_0x36df72) && getStoryAssetAppearances(_0x1954a8)['length'] > 0x1;
  const _0x4ed004 = normalizeText(_0x4a4dc["exportingAssetAppearanceKey"]) === getAppearanceActionKey(_0x1954a8, _0x36df72);
  const _0x3b2e2a = Boolean(normalizeText(_0x36df72?.["imageUrl"]) && !_0x4978f9['disabled'] && !_0x4ed004 && !_0x4b45b4['synced'] && !_0x2c9fdf);
  return {
    'canDownload': Boolean(normalizeText(_0x36df72?.["imageUrl"]) && normalizeText(_0x1954a8?.["mediaKind"])["toLowerCase"]() !== "video"),
    'showProjectActions': !![],
    'saveToLibraryLabel': _0x4ed004 ? "正在加入总素材" : _0x4b45b4['synced'] ? '已加入总素材' : _0x4b45b4['exists'] ? "更新总素材" : '将当前形象加入总素材',
    'canSaveToLibrary': _0x3b2e2a,
    'isSavingToLibrary': _0x4ed004,
    'canUpload': !_0x4ed004 && !_0x2c9fdf,
    'showDeleteAppearance': _0x110ca2,
    'canDeleteAppearance': Boolean(_0x110ca2 && !_0x4978f9["disabled"] && !_0x4ed004 && !_0x2c9fdf),
    'isDeleteAppearanceConfirming': _0x2c9fdf,
    'librarySynced': _0x4b45b4["synced"]
  };
}
function projectVoicePanel(_0x1a0ba0, _0x30b86c, _0x6990c0) {
  const _0x36ae43 = _0x1a0ba0["characterVoiceEditor"];
  if (!_0x36ae43?.["assetId"] || _0x36ae43["assetId"] !== _0x30b86c?.['id'] || _0x30b86c["kind"] !== 'character') {
    return {
      'visible': ![]
    };
  }
  const _0xa87c55 = normalizeStoryCharacterVoiceReference(_0x30b86c['voiceReference']);
  const _0x331776 = normalizeStoryCharacterVoiceHistory(_0x30b86c["voiceReferenceHistory"])["map"](_0x4dfacb => ({
    ..._0x4dfacb,
    'label': _0x4dfacb["modelLabel"] || _0x4dfacb["fileName"] || (_0x4dfacb["source"] === "generated" ? "AI 生成声音" : "上传声音"),
    'timeLabel': formatVoiceHistoryTime(_0x4dfacb["updatedAt"])
  }));
  const _0x5aa71c = isStoryAssetVoiceLoading(_0x1a0ba0, _0x30b86c['id']);
  return {
    'visible': !![],
    'isActive': _0x6990c0,
    'isGenerating': _0x5aa71c,
    'reference': _0xa87c55,
    'history': _0x331776,
    'sampleText': _0x36ae43["sampleText"] || '',
    'voiceDescription': _0x36ae43["voiceDescription"] || '',
    'error': _0x36ae43["error"] || '',
    'sampleMaxCharacters': STORY_CHARACTER_VOICE_SAMPLE_MAX_CHARACTERS,
    'footer': {
      'workflow': getStoryCharacterVoiceWorkflow(_0x36ae43["nodeData"]?.["model"]),
      'nodeData': _0x36ae43["nodeData"],
      'workflowItems': getStoryCharacterVoiceWorkflowItems()
    }
  };
}
export function createStoryAssetSettingsProjection({
  resolveLibraryReference = () => null
} = {}) {
  function _0x1db5c4(_0x3182aa = {}, _0x284066 = {}, _0x3de275 = {}) {
    const _0x1a83d6 = _0x284066["isLibraryAsset"] ? [_0x284066] : getStoryAssetAppearances(_0x284066);
    const _0x1604fd = _0x284066['isLibraryAsset'] ? {
      'total': 0x1,
      'generated': _0x284066["imageUrl"] ? 0x1 : 0x0,
      'failed': 0x0,
      'pending': _0x284066["imageUrl"] ? 0x0 : 0x1
    } : getStoryAssetAppearanceStats(_0x284066);
    const _0x329f4e = _0x3de275["previewAppearance"] || !_0x284066["isLibraryAsset"] && getSelectedAppearance(_0x3182aa, _0x284066) || getStoryAssetBaseAppearance(_0x284066) || _0x1a83d6["find"](_0x472e5e => normalizeText(_0x472e5e['imageUrl'])) || _0x1a83d6[0x0] || _0x284066;
    const _0x1ac04e = Array["isArray"](_0x3182aa["selectedAssetIds"]) ? _0x3182aa["selectedAssetIds"] : [];
    const _0x1ac2c0 = _0x3182aa['assetSelectionMode'] === !![];
    const _0x507beb = _0x284066['id'] === _0x3182aa["selectedAssetId"];
    const _0x314507 = isStoryAssetCardLoading(_0x3182aa, _0x284066['id']);
    return {
      'id': _0x284066['id'],
      'name': normalizeText(_0x284066['name']) || "未命名素材",
      'role': _0x284066['role'] || '素材',
      'kind': _0x284066["kind"],
      'appearanceCount': _0x1a83d6["length"],
      'canNavigateAppearances': !_0x284066['isLibraryAsset'] && !_0x1ac2c0 && _0x1a83d6["length"] > 0x1,
      'showAppearanceDelete': !_0x284066["isLibraryAsset"] && !_0x1ac2c0 && _0x3182aa['data']?.["project"]?.["sourceMode"] === "video-replication" && _0x284066["kind"] === 'character',
      'canDeleteAppearance': _0x1a83d6["length"] > 0x1 && isAddedAppearance(_0x329f4e),
      'preview': _0x329f4e,
      'promptPreview': getCardPromptPreview(_0x3182aa, _0x284066, _0x329f4e),
      'stats': _0x1604fd,
      'statusText': _0x3de275["statusText"] || '',
      'cardStatusHtml': _0x3de275['cardStatusHtml'] || '',
      'isCurrent': _0x507beb,
      'isChecked': _0x1ac04e["includes"](_0x284066['id']),
      'isSelectionMode': _0x1ac2c0,
      'isLoading': _0x314507,
      'showRoleTag': _0x3182aa["hideAssetRoleTag"] !== !![] && shouldRenderStoryAssetRoleTag(_0x284066["kind"]),
      'canRename': _0x3182aa["allowAssetRename"] === !![] && !_0x284066["isLibraryAsset"],
      'canDelete': Boolean(_0x3182aa['allowDeleteAssetCard'] && !_0x284066["isLibraryAsset"] && !_0x1ac2c0),
      'draggable': _0x3de275["draggable"] === !![],
      'cardClassName': [_0x3de275["cardClassName"], !_0x284066["isLibraryAsset"] && _0x284066["kind"] === "character" && _0x3182aa["data"]?.["project"]?.["sourceMode"] === 'video-replication' ? "story-replication-character-card" : '']['filter'](Boolean)['join']('\x20'),
      'cardAttributes': _0x3de275["cardAttributes"] || '',
      'shellClassName': _0x3de275['shellClassName'] || '',
      'accessoryHtml': _0x3de275["accessoryHtml"] || '',
      'cardMetaHtml': _0x3de275['cardMetaHtml'] || '',
      'cardMediaHtml': _0x3de275["cardMediaHtml"] || '',
      'fallbackImageUrl': _0x3de275["fallbackImageUrl"] || '',
      'workspaceAssetLibraryImage': _0x3de275['workspaceAssetLibraryImage'] === !![]
    };
  }
  function _0x1e9e47(_0x17afa2, _0xe04bd8 = {}) {
    if (_0x17afa2 === "batch-generation") {
      const _0x562ce1 = _0xe04bd8["state"] || _0xe04bd8;
      const _0x2695db = Array["isArray"](_0x562ce1["selectedAssetIds"]) ? _0x562ce1['selectedAssetIds']['length'] : 0x0;
      const _0x34752a = _0x562ce1["isBatchGenerating"] === !![];
      const _0x1c913f = _0x562ce1["assetBatchCancelRequested"] === !![];
      return {
        'selectedCount': _0x2695db,
        'action': _0x34752a ? "cancel-asset-batch-generation" : "batch-generate-assets",
        'isCancellation': _0x34752a,
        'busy': ![],
        'cancelRequested': _0x1c913f,
        'disabled': _0x34752a ? _0x1c913f : !_0x2695db,
        'label': _0x34752a ? '' + (_0x1c913f ? "已取消后续生成" : "取消后续生成") + (_0x2695db ? '\x20(' + _0x2695db + ')' : '') : "批量生成" + (_0x2695db ? '\x20(' + _0x2695db + ')' : ''),
        'directMode': _0x34752a ? '' : getStoryAssetBatchDirectMode(_0x562ce1["assetFilter"])
      };
    }
    if (_0x17afa2 === "prompt-generation") {
      const _0x56c89d = _0xe04bd8["state"] || {};
      const _0x353884 = _0xe04bd8["generationControl"] || {};
      const _0x359001 = Array["isArray"](_0x56c89d["selectedAssetIds"]) ? _0x56c89d["selectedAssetIds"]["length"] : 0x0;
      const _0x45e57d = _0x56c89d["assetSelectionMode"] === !![] && _0x359001 > 0x1;
      const _0x572c96 = _0x45e57d && _0x56c89d['isBatchGenerating'] === !![];
      const _0x1f9b43 = _0x56c89d["assetBatchCancelRequested"] === !![];
      return {
        'isMultiSelection': _0x45e57d,
        'selectedCount': _0x359001,
        'action': _0x572c96 ? "cancel-asset-batch-generation" : 'batch-generate-assets',
        'isCancellation': _0x572c96,
        'busy': !_0x45e57d && _0x353884["isGenerating"] === !![],
        'cancelRequested': _0x1f9b43,
        'disabled': _0x45e57d ? _0x572c96 && _0x1f9b43 : Boolean(_0x353884["disabled"]),
        'label': _0x45e57d ? _0x572c96 ? (_0x1f9b43 ? "已取消后续生成" : '取消后续生成') + '\x20(' + _0x359001 + ')' : "批量生成 (" + _0x359001 + ')' : _0x353884['label'] || "生成素材图"
      };
    }
    if (_0x17afa2 === "library-selection") {
      const _0x5b718b = Math["max"](0x0, Math["trunc"](Number(_0xe04bd8["selectedCount"]) || 0x0));
      const _0x10aa6b = Array["isArray"](_0xe04bd8["projectAssets"]) ? _0xe04bd8["projectAssets"] : [];
      return {
        'selectionMode': _0xe04bd8["selectionMode"] === !![],
        'selectedCount': _0x5b718b,
        'allSelected': _0xe04bd8["allSelected"] === !![],
        'targetGroups': ["character", 'scene', 'prop']['map'](_0x2e2c43 => ({
          'kind': _0x2e2c43,
          'label': _0xe04bd8["getTabLabel"]?.(_0x2e2c43) || _0x2e2c43,
          'targets': _0x10aa6b["filter"](_0x28dc9a => normalizeText(_0x28dc9a?.["kind"]) === _0x2e2c43)["map"](_0x14bc5c => {
            const _0x475458 = getStoryAssetAppearances(_0x14bc5c);
            return {
              'id': _0x14bc5c['id'],
              'kind': _0x14bc5c['kind'],
              'name': _0x14bc5c["name"],
              'appearanceCount': _0x475458['length'],
              'appearances': _0x475458['map'](_0x541705 => ({
                'id': _0x541705['id'],
                'name': _0x541705["name"],
                'imageUrl': _0x541705["imageUrl"]
              })),
              'preview': getStoryAssetBaseAppearance(_0x14bc5c) || _0x475458["find"](_0x2c1acd => normalizeText(_0x2c1acd?.["imageUrl"])) || _0x475458[0x0] || {}
            };
          })
        }))
      };
    }
    if (_0x17afa2 === "preset") {
      const _0x36383b = _0xe04bd8["state"] || {};
      const _0x2306b4 = _0xe04bd8['asset'] || (Array["isArray"](_0x36383b["data"]?.["assets"]) ? _0x36383b["data"]["assets"]["find"](_0xcb4e64 => _0xcb4e64['id'] === _0x36383b["selectedAssetId"]) : null);
      return projectPreset(_0x36383b, _0xe04bd8["assetKind"], _0x2306b4, _0x2306b4 ? getSelectedAppearance(_0x36383b, _0x2306b4) : null);
    }
    if (_0x17afa2 === 'preview-actions') {
      return projectPreviewActions(_0xe04bd8["state"] || {}, _0xe04bd8["asset"] || {}, _0xe04bd8["appearance"] || {}, _0xe04bd8["generationControl"] || {}, _0xe04bd8['readOnly'] === !![], resolveLibraryReference);
    }
    if (_0x17afa2 === "voice-capsule") {
      const _0xa85d70 = _0xe04bd8["state"] || {};
      const _0x4729cf = _0xe04bd8['asset'] || {};
      return {
        'visible': _0x4729cf["kind"] === 'character' && !_0x4729cf["isLibraryAsset"],
        'hasReference': hasStoryCharacterVoiceReference(_0x4729cf),
        'isOpen': _0xe04bd8["isOpen"] === !![],
        'uploadLabel': normalizeText(_0xa85d70["assetVoiceUploadLabel"])
      };
    }
    if (_0x17afa2 === "voice-player") {
      const _0x3b1584 = _0xe04bd8["asset"] || {};
      return {
        'visible': _0x3b1584["kind"] === "character" && !_0x3b1584["isLibraryAsset"] && hasStoryCharacterVoiceReference(_0x3b1584),
        'id': _0x3b1584['id'],
        'name': _0x3b1584["name"]
      };
    }
    return {};
  }
  function _0x28914d(_0x27ad1d = {}, _0x3a9d86 = null, {
    showEmptyDescription = !![],
    readOnly = ![]
  } = {}) {
    if (!_0x3a9d86) {
      return {
        'empty': !![],
        'emptyDescription': _0x27ad1d["assetFilter"] === "library" ? '总素材中还没有可引用的图片或视频。' : '完成剧本分析后，角色、场景和道具会显示在这里。',
        'showEmptyDescription': showEmptyDescription
      };
    }
    const _0x188642 = _0x3a9d86["isLibraryAsset"] ? [_0x3a9d86] : getStoryAssetAppearances(_0x3a9d86);
    const _0x473276 = getSelectedAppearanceIndex(_0x27ad1d, _0x3a9d86);
    const _0x4c75eb = getSelectedAppearance(_0x27ad1d, _0x3a9d86) || _0x3a9d86;
    const _0x3bc7c2 = !_0x3a9d86['isLibraryAsset'] && !readOnly && _0x188642["length"] > 0x1;
    const _0x1f7c71 = _0x3a9d86["kind"] === "character" && !_0x3a9d86["isLibraryAsset"] && !readOnly;
    const _0x34e7c1 = _0x1f7c71 && isStoryAssetBaseAppearance(_0x3a9d86, _0x4c75eb);
    const _0x5c1b9a = !_0x3a9d86["isLibraryAsset"] && !readOnly && canEditStoryAssetStyleReference(_0x3a9d86, _0x4c75eb);
    const _0x558d70 = getStoryAssetGenerationControlState(_0x27ad1d, _0x3a9d86['id'], _0x4c75eb['id']);
    const _0x4f099b = _0x27ad1d["characterVoiceEditor"]?.["assetId"] === _0x3a9d86['id'];
    const _0x24f0b5 = _0x4f099b && _0x27ad1d['characterVoicePanelMotion'] !== "to-asset";
    const _0x58a294 = _0x27ad1d['characterVoicePanelMotion'] === "to-voice" ? "is-flipping-to-voice" : _0x27ad1d["characterVoicePanelMotion"] === "to-asset" ? "is-flipping-to-asset" : '';
    const _0xafcda7 = Array["isArray"](_0x27ad1d["data"]?.["assets"]) ? _0x27ad1d['data']["assets"]["find"](_0x30366b => _0x30366b['id'] === _0x27ad1d["selectedAssetId"]) : _0x3a9d86;
    const _0x5d49df = _0xafcda7 ? getSelectedAppearance(_0x27ad1d, _0xafcda7) : _0x4c75eb;
    return {
      'empty': ![],
      'asset': {
        'id': _0x3a9d86['id'],
        'name': normalizeText(_0x3a9d86['name']) || "未命名素材",
        'role': _0x3a9d86['role'],
        'kind': _0x3a9d86["kind"],
        'mediaKind': _0x3a9d86["mediaKind"],
        'isLibraryAsset': _0x3a9d86["isLibraryAsset"] === !![],
        'description': _0x3a9d86["description"] || ''
      },
      'appearance': _0x4c75eb,
      'appearanceIndex': _0x473276,
      'appearanceCount': _0x188642["length"],
      'hasMultipleAppearances': _0x3bc7c2,
      'supportsBaseAppearance': _0x1f7c71,
      'isBaseAppearance': _0x34e7c1,
      'canRename': _0x27ad1d["allowAssetRename"] === !![] && !_0x3a9d86["isLibraryAsset"],
      'isBaseAppearanceSelectionDisabled': Boolean(isStoryAssetCardLoading(_0x27ad1d, _0x3a9d86['id'])),
      'canSetBaseAppearance': _0x3bc7c2 && !isStoryAssetCardLoading(_0x27ad1d, _0x3a9d86['id']),
      'showStyleReference': _0x5c1b9a && _0x27ad1d["allowAssetStyleReference"] !== ![],
      'styleReference': {
        'referenceImageUrl': _0x4c75eb["referenceImageUrl"],
        'disabled': Boolean(_0x558d70["disabled"])
      },
      'voiceCapsule': {
        'visible': _0x3a9d86["kind"] === "character" && !_0x3a9d86["isLibraryAsset"],
        'hasReference': hasStoryCharacterVoiceReference(_0x3a9d86),
        'isOpen': _0x24f0b5,
        'uploadLabel': normalizeText(_0x27ad1d["assetVoiceUploadLabel"])
      },
      'voicePlayer': {
        'visible': _0x3a9d86["kind"] === "character" && !_0x3a9d86['isLibraryAsset'] && hasStoryCharacterVoiceReference(_0x3a9d86)
      },
      'previewActions': projectPreviewActions(_0x27ad1d, _0x3a9d86, _0x4c75eb, _0x558d70, readOnly, resolveLibraryReference),
      'generationControl': _0x558d70,
      'promptControl': _0x1e9e47("prompt-generation", {
        'state': _0x27ad1d,
        'generationControl': _0x558d70
      }),
      'preset': projectPreset(_0x27ad1d, _0x3a9d86["kind"], _0xafcda7, _0x5d49df),
      'imageModel': {
        'modelId': _0x27ad1d['models']?.["image"],
        'provider': _0x27ad1d["imageProvider"],
        'generationParams': _0x27ad1d["imageGenerationParams"]
      },
      'readOnly': readOnly,
      'allowDeleteAppearance': Boolean(_0x27ad1d["allowDeleteAssetAppearance"] && _0x3bc7c2 && !_0x34e7c1),
      'isGeneratingAppearance': Boolean(_0x558d70["isGenerating"]),
      'motionClass': _0x27ad1d['assetAppearanceMotion'] ? "is-sliding-" + _0x27ad1d['assetAppearanceMotion'] : '',
      'panel': {
        'isVoice': _0x24f0b5,
        'motionClass': _0x58a294,
        'isAnimating': Boolean(_0x58a294)
      },
      'voicePanel': projectVoicePanel(_0x27ad1d, _0x3a9d86, _0x24f0b5),
      'captionMeta': (_0x4c75eb['name'] || _0x3a9d86["role"] || '素材') + " · " + formatStoryAssetOccurrences(_0x4c75eb["occurrences"] || _0x3a9d86['occurrences'] || "当前项目") + (_0x3bc7c2 ? " · " + (_0x473276 + 0x1) + '/' + _0x188642["length"] : '')
    };
  }
  return Object["freeze"]({
    'projectAssetCard': (..._0x458214) => freezeSnapshot(_0x1db5c4(..._0x458214)),
    'projectAssetControl': (..._0x349b54) => freezeSnapshot(_0x1e9e47(..._0x349b54)),
    'projectAssetDetail': (..._0x383cce) => freezeSnapshot(_0x28914d(..._0x383cce))
  });
}