import { localPathToUrl } from '../../utils/localMediaPath.js';
import { createWorkspaceAssetLibraryDisclosure } from '../workspaceAssetLibrary.js';
import { getWorkspaceAssetAppearanceStats, getWorkspaceAssetAppearances } from '../workspaceAssetAppearance.js';
import { renderWorkspaceAssetSelectionActions } from '../workspaceAssetSelection.js';
import { renderWorkspaceAssetSettingsShell } from '../workspaceAssetSettingsShell.js';
import { renderWorkspaceAssetTabIcon, renderWorkspaceCardAppearanceNavigation } from '../workspaceAssetPresentation.js';
import { buildPersonReplacementAssetViewState, renderPersonReplacementAudioAssetCard, renderPersonReplacementAudioAssetDetail, renderPersonReplacementAssetCard, renderPersonReplacementAssetDetail, renderPersonReplacementBatchGenerationControl } from './personReplacementAssetPresentation.js';
import { getPersonReplacementLibraryAudioRef, getPersonReplacementProjectAudioAssets, getPersonReplacementVoiceLibraryBoundCharacters } from './personReplacementVoiceLibrary.js';
function normalizeText(_0x15c74e) {
  return String(_0x15c74e ?? '')["trim"]();
}
function escapeHtml(_0x2639fc) {
  return String(_0x2639fc ?? '')["replaceAll"]('&', "&amp;")["replaceAll"]('<', "&lt;")["replaceAll"]('>', "&gt;")['replaceAll']('\x22', '&quot;')["replaceAll"]('\x27', "&apos;");
}
function normalizeMediaUrl(_0x3b5105) {
  const _0x21f97c = normalizeText(_0x3b5105);
  if (!_0x21f97c) {
    return '';
  }
  return localPathToUrl(_0x21f97c) || _0x21f97c;
}
function normalizeProjectAssetMediaForRender(_0x63075c = {}) {
  return {
    ..._0x63075c,
    'appearances': getWorkspaceAssetAppearances(_0x63075c)["map"](_0x1e2231 => ({
      ..._0x1e2231,
      'imageUrl': normalizeMediaUrl(_0x1e2231["imageUrl"]),
      'referenceImageUrl': normalizeMediaUrl(_0x1e2231['referenceImageUrl'])
    }))
  };
}
function getCharacterVoiceUrl(_0x290e87 = {}) {
  return normalizeMediaUrl(_0x290e87["voiceReference"]?.["audioUrl"] || _0x290e87["voiceReference"]?.['localPath'] || _0x290e87["voiceRef"]);
}
function renderVoiceReferenceStatus(_0x5c535d = {}, _0x291b7b = '') {
  const _0x17c435 = Boolean(getCharacterVoiceUrl(_0x5c535d));
  return "<span class=\"person-replacement-target-voice-status" + (_0x291b7b ? '\x20' + escapeHtml(_0x291b7b) : '') + '\x20' + (_0x17c435 ? "has-reference" : "is-missing") + '\x22><i\x20aria-hidden=\x22true\x22></i>' + (_0x17c435 ? "有声音参考" : "无声音参考") + '</span>';
}
export const PERSON_REPLACEMENT_LIBRARY_TARGETS = Object["freeze"]([{
  'kind': 'character',
  'label': '人物'
}, {
  'kind': "scene",
  'label': '场景'
}, {
  'kind': 'audio',
  'label': '音频'
}]);
export function getPersonReplacementSelectableAssets(_0x353e79, _0x168c26) {
  if (_0x168c26 === "library") {
    return _0x353e79['libraryAssets']["filter"](_0x30440d => normalizeText(_0x30440d?.["mediaKind"])["toLowerCase"]() === "image" && normalizeText(_0x30440d?.['sourceUrl'] || _0x30440d?.["imageUrl"]) || normalizeText(_0x30440d?.["mediaKind"])['toLowerCase']() === "audio" && getPersonReplacementLibraryAudioRef(_0x30440d));
  }
  if (_0x168c26 === "audio") {
    return [];
  }
  return _0x168c26 === "scene" ? _0x353e79["scenes"] : _0x353e79["characters"];
}
export function renderPersonReplacementAssetSettingsPage(_0x4545ba, _0x195a2f = {}) {
  const _0x171be4 = ["character", 'scene', "audio", "library"]["includes"](_0x4545ba["workspace"]["characterAssetTab"]) ? _0x4545ba['workspace']["characterAssetTab"] : "character";
  const _0x22bd9f = _0x171be4 === "library";
  const _0x46264d = _0x171be4 === "scene";
  const _0x183eee = _0x171be4 === 'audio';
  const _0x308406 = new Set(Array["isArray"](_0x195a2f["assetUploadPendingKinds"]) ? _0x195a2f["assetUploadPendingKinds"] : []);
  const _0x2c76f3 = getPersonReplacementProjectAudioAssets(_0x4545ba);
  const _0x29cf23 = normalizeText(_0x195a2f["voiceLibraryTargetCharacterId"]);
  const _0x43b675 = {
    ..._0x4545ba,
    'characters': _0x4545ba["characters"]["map"](normalizeProjectAssetMediaForRender),
    'scenes': _0x4545ba['scenes']["map"](normalizeProjectAssetMediaForRender)
  };
  const _0x143cae = _0x43b675['characters']["find"](_0x5c2aa3 => _0x5c2aa3['id'] === _0x29cf23) || null;
  const _0x5e8ced = _0x183eee && Boolean(_0x143cae);
  const _0x36de34 = buildPersonReplacementAssetViewState(_0x43b675);
  _0x36de34['isBatchGenerating'] = _0x195a2f["assetBatchGenerationActive"] === !![];
  _0x36de34["batchGenerationLabel"] = normalizeText(_0x195a2f["assetBatchGenerationLabel"]);
  _0x36de34["batchCancelRequested"] = _0x195a2f["assetBatchCancelRequested"] === !![];
  _0x36de34['batchGeneratingAssetIds'] = Array["isArray"](_0x195a2f["assetBatchGeneratingCharacterIds"]) ? _0x195a2f["assetBatchGeneratingCharacterIds"] : [];
  _0x36de34['batchCancelAction'] = "cancel-asset-batch-generation";
  const _0x1c3e76 = _0x5e8ced ? buildPersonReplacementAssetViewState({
    ..._0x43b675,
    'workspace': {
      ..._0x43b675["workspace"],
      'characterAssetTab': 'character',
      'selectedCharacterId': _0x143cae['id']
    }
  }) : null;
  const _0x19320f = _0x36de34["data"]['assets'];
  const _0x59ba10 = _0x19320f['find'](_0x59a75c => _0x59a75c['id'] === _0x36de34['selectedAssetId']) || null;
  const _0x3f1bac = getPersonReplacementSelectableAssets(_0x43b675, _0x171be4);
  const _0x40b37d = _0x3f1bac["length"] > 0x0 && _0x3f1bac['every'](_0x37e8fb => _0x36de34["selectedAssetIds"]["includes"](_0x37e8fb['id']));
  const _0x777510 = _0x22bd9f ? _0x36de34["assetSelectionMode"] ? _0x3f1bac["filter"](_0x8079e7 => _0x36de34["selectedAssetIds"]["includes"](_0x8079e7['id'])) : _0x3f1bac["filter"](_0x7e5953 => _0x7e5953['id'] === _0x36de34["selectedAssetId"]) : [];
  const _0x5e23b6 = _0x777510["length"];
  const _0x22c8db = _0x195a2f["assetLibraryDisclosure"] || createWorkspaceAssetLibraryDisclosure();
  const _0x4d5c10 = _0x53346f => {
    const _0x45b439 = !_0x22bd9f && !_0x46264d && !_0x183eee;
    const _0x31e5b2 = _0x45b439 ? getWorkspaceAssetAppearanceStats(_0x53346f) : null;
    const _0x4bc7a2 = getPersonReplacementVoiceLibraryBoundCharacters(_0x4545ba, _0x53346f);
    if (normalizeText(_0x53346f?.["mediaKind"])["toLowerCase"]() === "audio") {
      return renderPersonReplacementAudioAssetCard({
        ..._0x36de34,
        'allowDeleteAssetCard': _0x36de34["allowDeleteAssetCard"] && !_0x5e8ced
      }, _0x53346f, {
        'boundCharacters': _0x4bc7a2,
        'showVoiceLibraryConfirm': _0x5e8ced
      });
    }
    return renderPersonReplacementAssetCard(_0x36de34, _0x53346f, {
      'previewAppearance': _0x22bd9f ? {
        ..._0x53346f,
        'imageUrl': _0x53346f['thumbnailUrl'] || _0x53346f["imageUrl"]
      } : getWorkspaceAssetAppearances(_0x53346f)[_0x36de34["assetAppearanceIndexes"]?.[_0x53346f['id']] || 0x0],
      'accessoryHtml': !_0x22bd9f && !_0x36de34['assetSelectionMode'] && getWorkspaceAssetAppearances(_0x53346f)["length"] > 0x1 ? renderWorkspaceCardAppearanceNavigation({
        'previousAttributes': {
          'data-story-action': 'previous-appearance',
          'data-story-card-appearance-id': _0x53346f['id']
        },
        'nextAttributes': {
          'data-story-action': "next-appearance",
          'data-story-card-appearance-id': _0x53346f['id']
        }
      }) : '',
      'fallbackImageUrl': _0x22bd9f ? _0x53346f["sourceUrl"] : '',
      'workspaceAssetLibraryImage': _0x22bd9f,
      'statusText': _0x45b439 ? "形象 " + _0x31e5b2['generated'] + '/' + _0x31e5b2["total"] : '',
      'cardClassName': _0x45b439 ? 'person-replacement-character-asset-card' : '',
      'cardMetaHtml': _0x45b439 ? renderVoiceReferenceStatus(_0x53346f, "person-replacement-asset-voice-status") : ''
    });
  };
  const _0x3f8ba2 = _0x22bd9f ? _0x22c8db['render']({
    'assets': _0x19320f,
    'renderAsset': _0x4d5c10
  }) : _0x19320f["map"](_0x4d5c10)["join"]('');
  const _0x386d18 = '<div\x20class=\x22story-asset-batch-menu-wrap\x20story-library-add-menu-wrap\x20person-replacement-library-add-menu-wrap\x22>\x0a\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-primary-button\x20story-asset-batch-trigger\x22\x20data-person-replacement-action=\x22toggle-library-add-targets\x22\x20aria-haspopup=\x22menu\x22\x20aria-expanded=\x22false\x22\x20' + (_0x5e23b6 ? '' : 'disabled') + "><span class=\"story-asset-batch-trigger-label\">加入到项目" + (_0x36de34["assetSelectionMode"] && _0x5e23b6 ? '\x20(' + _0x5e23b6 + ')' : '') + "</span></button>\n    <div class=\"story-asset-batch-menu story-library-add-menu\" role=\"menu\" aria-label=\"选择加入项目的素材分类\" aria-hidden=\"true\">\n      " + PERSON_REPLACEMENT_LIBRARY_TARGETS["map"](({
    kind: _0x5b6591,
    label: _0x41f3b9
  }) => "<button type=\"button\" role=\"menuitem\" data-person-replacement-action=\"add-library-assets-to-project\" data-person-replacement-library-target-kind=\"" + _0x5b6591 + "\"><span class=\"story-asset-batch-mode-icon\">" + renderWorkspaceAssetTabIcon(_0x5b6591) + '</span><span>' + _0x41f3b9 + "</span></button>")['join']('') + "\n    </div>\n  </div>";
  const _0x43680c = (_0x1704e5, _0x11db91, _0x283ad8) => {
    const _0x11d222 = _0x308406["has"](_0x1704e5);
    return "<button type=\"button\" class=\"story-secondary-button\" data-person-replacement-action=\"" + _0x283ad8 + '\x22' + (_0x11d222 ? " aria-busy=\"true\" disabled" : '') + '>' + (_0x11d222 ? "<span class=\"storyboard-script-loading-spinner\" aria-hidden=\"true\"></span><span>上传中…</span>" : '上传' + _0x11db91) + "</button>";
  };
  const _0x65a00 = _0x183eee ? _0x59ba10 : null;
  const _0xed888c = {
    'detailSplitRatio': _0x36de34["assetDetailSplitRatio"],
    'detailSplitterHtml': typeof _0x195a2f["renderDetailSplitter"] === 'function' ? _0x195a2f['renderDetailSplitter'](_0x36de34["assetDetailSplitRatio"]) : ''
  };
  const _0x5072fa = _0x183eee ? _0x5e8ced ? '<button\x20type=\x22button\x22\x20class=\x22story-secondary-button\x22\x20data-person-replacement-action=\x22cancel-character-voice-library\x22>取消</button>' : _0x43680c("audio", '音频', "choose-new-audio-files") : renderWorkspaceAssetSelectionActions({
    'selectionMode': _0x36de34["assetSelectionMode"],
    'selectedCount': _0x36de34["selectedAssetIds"]["length"],
    'allSelected': _0x40b37d,
    'primaryActionHtml': _0x22bd9f ? _0x386d18 : _0x46264d ? _0x36de34["assetSelectionMode"] ? '' : _0x43680c("scene", '场景', 'choose-new-scene-images') : _0x36de34["assetSelectionMode"] ? renderPersonReplacementBatchGenerationControl(_0x36de34) : _0x43680c("character", '人物', "choose-new-character-images"),
    'selectAllLabel': _0x22bd9f ? "全选素材" : '全选',
    'clearSelectionLabel': "取消全选"
  });
  return renderWorkspaceAssetSettingsShell({
    'className': "person-replacement-assets-page",
    'activeTab': _0x171be4,
    'tabCount': 0x4,
    'tabsHtml': [['character', '人物', _0x4545ba["characters"]["length"]], ["scene", '场景', _0x4545ba["scenes"]["length"]], ["audio", '音频', _0x2c76f3["length"]], ['library', "总素材", _0x4545ba["libraryAssets"]["length"]]]['map'](([_0x3340f6, _0x8271a8, _0x561714]) => '<button\x20type=\x22button\x22\x20class=\x22' + (_0x171be4 === _0x3340f6 ? "is-active" : '') + '\x22\x20data-person-replacement-action=\x22select-character-asset-tab\x22\x20data-asset-tab=\x22' + _0x3340f6 + '\x22\x20role=\x22tab\x22\x20aria-selected=\x22' + (_0x171be4 === _0x3340f6) + "\" tabindex=\"" + (_0x171be4 === _0x3340f6 ? '0' : '-1') + '\x22>' + renderWorkspaceAssetTabIcon(_0x3340f6) + "<span class=\"story-asset-tab-label\">" + _0x8271a8 + "</span><span class=\"story-asset-tab-count\">" + _0x561714 + '</span></button>')["join"](''),
    'calloutTitle': _0x183eee ? _0x5e8ced ? '为「' + _0x143cae["name"] + "」添加声音" : '音频素材' : _0x22bd9f ? '从总素材加入项目' : _0x46264d ? '项目场景素材' : '上传人物基础形象',
    'calloutDescription': _0x183eee ? _0x5e8ced ? "请选择要添加的人设声音，选中后点击确认。" : "这里只显示已加入当前项目的音频；上传会先保存到总素材再加入项目。" : _0x22bd9f ? _0x36de34["assetSelectionMode"] ? _0x36de34["selectedAssetIds"]["length"] ? '已选择\x20' + _0x36de34["selectedAssetIds"]["length"] + " 项素材" : '点击图片或音频进行多选，或拖动鼠标框选。' : "单击素材可查看详情；点击加入到项目后，选择人物、场景或音频。" : _0x46264d ? _0x36de34["assetSelectionMode"] ? '已选择\x20' + _0x36de34["selectedAssetIds"]["length"] + '\x20项' : '从总素材加入的场景可在图像替换中作为画面参考。' : _0x36de34["assetSelectionMode"] ? "已选择 " + _0x36de34['selectedAssetIds']["length"] + '\x20项' : "上传的第一张图片作为基础形象；后续生成会新增形象。",
    'calloutActionsHtml': _0x5072fa,
    'cardsHtml': _0x3f8ba2,
    'emptyText': _0x183eee ? "当前项目暂无音频，请从总素材加入或上传音频" : _0x22bd9f ? '总素材中暂无可用素材' : _0x46264d ? '请先从总素材加入场景' : '请先上传人物基础形象',
    'detailHtml': _0x5e8ced ? renderPersonReplacementAssetDetail(_0x1c3e76, _0x143cae, {
      'voiceLibrarySelection': {
        'audioAsset': _0x65a00
      },
      ..._0xed888c
    }) : normalizeText(_0x59ba10?.["mediaKind"])["toLowerCase"]() === "audio" ? renderPersonReplacementAudioAssetDetail(_0x59ba10, {
      'boundCharacters': getPersonReplacementVoiceLibraryBoundCharacters(_0x4545ba, _0x59ba10),
      'selectedCharacterId': _0x4545ba["workspace"]['selectedCharacterId']
    }) : renderPersonReplacementAssetDetail(_0x36de34, _0x59ba10, {
      'showEmptyDescription': _0x22bd9f || _0x46264d,
      'readOnly': _0x46264d,
      ..._0xed888c
    }),
    'footerHtml': _0x195a2f["footerHtml"] || '',
    'splitRatio': _0x36de34["assetSplitRatio"]
  });
}