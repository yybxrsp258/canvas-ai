import a542_0x3b634e from '../core/stores/appStore.js';
import a542_0x10ac8a from '../core/nodeRuntimeRegistry.js';
import { submitTask } from '../core/generationTaskRuntime.js';
import { resolveGenerationButtonMode } from '../core/generationTaskUiState.js';
import { buildCanonicalStoryboardScriptJson, createDefaultStoryboardScriptState, getStoryboardScriptDisplayColumns, getStoryboardScriptDefaultName, normalizeStoryboardScriptSelectedRowIndexes, normalizeStoryboardScriptMediaMode, normalizeStoryboardScriptViewMode, resolveStoryboardScriptResizeMinSize, serializeCanonicalStoryboardScriptJson, serializeStoryboardScriptRowsToCsv, STORYBOARD_SCRIPT_COLUMNS, STORYBOARD_SCRIPT_TABLE_EXPORT_MIME, STORYBOARD_SCRIPT_TEXT_MODEL, STORYBOARD_SCRIPT_TEXT_PROVIDER } from '../core/storyboardScriptFactory.js';
import { generateId } from '../core/math.js';
import { assertVideoAnalysisModel, getVideoAnalysisModelIds } from '../manifests/textVideoUnderstanding.js';
import { buildStoryboardScriptImageSystemPrompt, buildStoryboardScriptImagePrompt, buildStoryboardScriptPrompt, buildStoryboardScriptTextOnlySystemPrompt, buildStoryboardScriptTextOnlyPrompt, buildStoryboardScriptVideoSystemPrompt, buildStoryboardScriptVideoPrompt, extractRequestedStoryboardShotCount, normalizeStoryboardScriptGenerationResult, STORYBOARD_SCRIPT_GENERATION_SCHEMA_VERSION } from '../core/storyboardScriptGeneration.js';
import { getModelManifest, resolveModelManifest, sanitizeModelUiSchemaParams } from '../manifests/index.js';
import { activateMenuKeyboard } from '../modules/floatingMenuKeyboard.js';
import { getPromptAssetInputRefsFromNode, insertPresetPromptIntoEditor, previewPresetPromptInEditor, _rehydratePromptPills, resolvePresetPromptTextWithTextRefs, resolvePromptTextWithTextRefs, shouldUsePromptPreviewForPreset } from '../modules/nodePromptShared.js';
import { resolveEffectiveInputKind } from '../modules/modelInputPolicy.js';
import { commit } from '../modules/history.js';
import { resetGenerateButtonIdleUi, setGenerateButtonLoadingUi } from '../modules/previewGenerateButtonUi.js';
import { getNanoBananaSelectionFromModel } from '../modules/nanoBananaModeRules.js';
import { getAIGenerationDefaultSizeByType } from '../services/fileService.js';
import { resolveGenerationInputImageUrl } from '../services/imageReferenceUrlService.js';
import { resolveCanvasVideoUrl } from '../services/canvasMediaLocalService.js';
import { saveTextDownload } from '../services/downloadSaveService.js';
import { sanitizePromptHtml } from '../utils/dom.js';
import { localPathToUrl } from '../utils/localMediaPath.js';
import { generateText } from '../../api/aiTextApi.js';
import { extractStoryboardVideoFramesFromServer, STORYBOARD_VIDEO_FRAME_LIMIT } from '../../api/storyboardVideoFrameApi.js';
import { getDisplayModelName } from '../modules/providers.js';
import { createBatchSpawnLayoutNearNode } from '../modules/nodeSpawn.js';
import { DEFAULT_IMAGE_NODE_MODEL, DEFAULT_IMAGE_NODE_PROVIDER } from './aigenImage/defaults.js';
import { bindImageModelMenuSubmenu, buildImageModelMenuHTML, renderImageModelTriggerIconHTML, resolveApimartImageMenuSelection, resolveGrsaiImageMenuSelection, resolveRunningHubModelImageMenuSelection, resolveRunningHubWorkflowImageMenuSelection, resolveVolcengineImageMenuSelection, setImageModelTriggerIcon } from './aigenImage/uiModuleModelHelpers.js';
import { buildImageDisplayRatioResizePatch } from './shared/generationDisplayPolicy.js';
import { bindDreaminaImageMenu, normalizeDreaminaImageModel } from './aigenImage/dreaminaModelMenuHelper.js';
import { bindModelUiSchemaControls, buildModelUiSchemaDefaultParams, hasVisibleModelUiSchema, renderModelUiSchemaControls, syncModelUiSchemaControls } from './aigenImage/uiSchemaRenderer.js';
import { buildTextModelSmallIconHTML } from './aigenText/apimartTextModelMenu.js';
import { createNodeResizeHandle } from './aigenText/nodeResizeUi.js';
import { _renderSharedRefBar } from './AIGenTextNode.js';
import { closeNodeFooterMenus } from './shared/nodeFooterControls.js';
import { ADVANCED_SETTINGS_TUNE_ICON_MARKUP } from './sharedIconMarkup.js';
import { buildSharedPromptPanel } from './sharedPromptPanel.js';
import { t } from '../i18n/index.js';
const CARD_FIELDS = Object["freeze"](['景别', '场景', "画面描述", '角色', "角色描述", "角色动作", '情绪', '角色图', '参考', "图片提示词", '视频提示词', '对白', '音效']);
const CARD_FIELD_KEYS = new Set(CARD_FIELDS);
const NARROW_TABLE_COLUMNS = new Set(['镜号', '时长']);
const COMPACT_TABLE_COLUMNS = new Set(['景别', '场景', '情绪']);
const WIDE_TABLE_COLUMNS = new Set(["画面描述", "角色描述", "图片提示词", "视频提示词"]);
const STORYBOARD_SCRIPT_TEXT_REQUEST_TIMEOUT_MS = 0x3e8 * 0x3e8;
const STORYBOARD_TOOLBAR_GENERATE_ICON_HTML = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M8 4v16\"/><path d=\"M3 9h18\"/><path d=\"M3 14h18\"/><path d=\"M13 17l2 2 4-4\"/></svg>";
const STORYBOARD_TOOLBAR_FULLSCREEN_ICON_HTML = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M8 3H5a2 2 0 0 0-2 2v3\"/><path d=\"M16 3h3a2 2 0 0 1 2 2v3\"/><path d=\"M21 16v3a2 2 0 0 1-2 2h-3\"/><path d=\"M8 21H5a2 2 0 0 1-2-2v-3\"/></svg>";
const STORYBOARD_TOOLBAR_DOWNLOAD_ICON_HTML = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"7 10 12 15 17 10\"/><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"/></svg>";
const STORYBOARD_QUEUE_ICON_HTML = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\"><path d=\"M5 7h14\"/><path d=\"M5 12h14\"/><path d=\"M5 17h14\"/></svg>";
const STORYBOARD_COLUMN_I18N_KEYS = Object["freeze"]({
  '镜号': 'shotNo',
  '时长': "duration",
  '景别': "shotSize",
  '场景': 'scene',
  '画面描述': "visualDescription",
  '角色': 'character',
  '角色描述': "characterDescription",
  '角色动作': "characterAction",
  '情绪': 'emotion',
  '角色图': 'characterImage',
  '参考': 'reference',
  '图片提示词': "imagePrompt",
  '视频提示词': 'videoPrompt',
  '对白': "dialogue",
  '音效': "soundEffect"
});
const STORYBOARD_IMAGE_BATCH_PADDING = 0x1e;
const STORYBOARD_IMAGE_BATCH_TITLE_HEIGHT = 0x14;
function storyboardScriptText(_0x34a1bb, _0x80f2db = {}) {
  return t('storyboardScript.' + _0x34a1bb, _0x80f2db);
}
function getStoryboardColumnLabel(_0x421aef, _0x5735f6 = '') {
  const _0x354ee9 = STORYBOARD_COLUMN_I18N_KEYS[String(_0x421aef || '')];
  if (!_0x354ee9) {
    return String(_0x5735f6 || _0x421aef || '');
  }
  return storyboardScriptText('columns.' + _0x354ee9);
}
const getStateSnapshot = () => typeof a542_0x3b634e['getStateRaw'] === "function" ? a542_0x3b634e['getStateRaw']() : a542_0x3b634e["getState"]();
function getSelectedRowIndexes(_0x5b7e13) {
  return normalizeStoryboardScriptSelectedRowIndexes(_0x5b7e13?.['selectedRowIndexes'], Array["isArray"](_0x5b7e13?.["rows"]) ? _0x5b7e13['rows']['length'] : 0x0);
}
function resolveStoryboardColumnDensity(_0xc39ba0) {
  const _0x443cf3 = String(_0xc39ba0 || '');
  if (NARROW_TABLE_COLUMNS['has'](_0x443cf3)) {
    return "narrow";
  }
  if (COMPACT_TABLE_COLUMNS["has"](_0x443cf3)) {
    return "compact";
  }
  if (WIDE_TABLE_COLUMNS['has'](_0x443cf3)) {
    return "wide";
  }
  return "normal";
}
function getStoryboardColumnsForMediaMode(_0x173348, _0x17cf8a = []) {
  return getStoryboardScriptDisplayColumns({
    'mediaMode': _0x173348,
    'rows': _0x17cf8a
  });
}
function getStoryboardCardFieldsForMediaMode(_0x4ea209, _0x39c257 = []) {
  return getStoryboardScriptDisplayColumns({
    'mediaMode': _0x4ea209,
    'rows': _0x39c257
  })["map"](_0x9a5018 => _0x9a5018["key"])["filter"](_0x483917 => CARD_FIELD_KEYS['has'](_0x483917));
}
function formatCellValue(_0x4fd6ff) {
  if (_0x4fd6ff == null) {
    return '';
  }
  if (typeof _0x4fd6ff === "string") {
    return _0x4fd6ff;
  }
  if (typeof _0x4fd6ff === 'number' || typeof _0x4fd6ff === "boolean") {
    return String(_0x4fd6ff);
  }
  try {
    return JSON["stringify"](_0x4fd6ff);
  } catch {
    return String(_0x4fd6ff);
  }
}
const STORYBOARD_IMAGE_PLACEHOLDER_PATTERN = /@图片\d+/g;
function normalizeStoryboardImagePlaceholder(_0x5cda90) {
  return String(_0x5cda90 || '')["trim"]()["replace"](/\s+/g, '');
}
function extractStoryboardImagePlaceholders(_0x4e4b4f) {
  return String(_0x4e4b4f || '')['match'](STORYBOARD_IMAGE_PLACEHOLDER_PATTERN) || [];
}
function extractGeneratedText(_0x385ef5) {
  if (typeof _0x385ef5 === 'string') {
    return _0x385ef5;
  }
  return String(_0x385ef5?.['text'] || _0x385ef5?.["outputText"] || _0x385ef5?.["output"] || _0x385ef5?.["content"] || _0x385ef5?.["message"] || '');
}
function getStoryboardImagePlaceholder(_0x339d7f) {
  return "@图片" + Math["max"](0x1, Math['trunc'](Number(_0x339d7f) || 0x1));
}
function getStoryboardVideoPlaceholder(_0x29ea43) {
  return '@视频' + Math['max'](0x1, Math["trunc"](Number(_0x29ea43) || 0x1));
}
function buildStoryboardImageRefMap(_0x405d5d = []) {
  const _0x3155ae = Array["isArray"](_0x405d5d) ? _0x405d5d : [];
  const _0xd6f056 = new Map();
  _0x3155ae['forEach']((_0x55aea0, _0x5ebed2) => {
    const _0x37858a = normalizeStoryboardImagePlaceholder(_0x55aea0?.['label']) || getStoryboardImagePlaceholder(_0x5ebed2 + 0x1);
    const _0x589016 = String(_0x55aea0?.["url"] || '')["trim"]();
    if (!_0x37858a || !_0x589016) {
      return;
    }
    _0xd6f056["set"](_0x37858a, {
      ..._0x55aea0,
      'label': _0x37858a,
      'url': _0x589016
    });
  });
  return _0xd6f056;
}
function mergeStoryboardImageRefs(..._0x3d10c5) {
  const _0x3d0730 = [];
  const _0x380447 = new Set();
  _0x3d10c5["flat"]()['forEach'](_0xcc7ca8 => {
    const _0x29b970 = normalizeStoryboardImagePlaceholder(_0xcc7ca8?.["label"]);
    const _0xcd1938 = String(_0xcc7ca8?.["url"] || '')['trim']();
    if (!_0x29b970 || !_0xcd1938 || _0x380447["has"](_0x29b970)) {
      return;
    }
    _0x380447["add"](_0x29b970);
    _0x3d0730['push']({
      ..._0xcc7ca8,
      'label': _0x29b970,
      'url': _0xcd1938,
      'type': "image"
    });
  });
  return _0x3d0730;
}
function pickStoryboardIndexedItem(_0x59ad08, _0x58df94) {
  if (!Array["isArray"](_0x59ad08) || _0x59ad08["length"] === 0x0) {
    return null;
  }
  const _0x2566d0 = Number["isFinite"](Number(_0x58df94)) ? Math["max"](0x0, Math["trunc"](Number(_0x58df94))) : 0x0;
  return _0x59ad08[Math["min"](_0x2566d0, _0x59ad08["length"] - 0x1)] || null;
}
function toStoryboardUsableMediaUrl(_0x3217e6) {
  const _0x53345a = String(_0x3217e6 || '')["trim"]();
  if (!_0x53345a) {
    return '';
  }
  if (/^(?:https?:|blob:|data:|\/)/i["test"](_0x53345a)) {
    return _0x53345a;
  }
  return localPathToUrl(_0x53345a) || '';
}
function resolveStoryboardVideoRefUrl(_0x32f378 = {}) {
  const _0x52c583 = pickStoryboardIndexedItem(_0x32f378?.["videos"], _0x32f378?.["mainVideoIndex"]);
  const _0x469015 = [resolveCanvasVideoUrl(_0x52c583), resolveCanvasVideoUrl(_0x32f378), _0x52c583?.['videoUrl'], _0x52c583?.["url"], _0x52c583?.["src"], _0x52c583?.["localPath"], _0x32f378?.["videoUrl"], _0x32f378?.["url"], _0x32f378?.["src"], _0x32f378?.['localPath']];
  return _0x469015["map"](_0x487ae7 => toStoryboardUsableMediaUrl(_0x487ae7))["find"](Boolean) || '';
}
function createStoryboardRoleImagePreview(_0x9ad517, _0x42efba = new Map()) {
  const _0x2cb75d = extractStoryboardImagePlaceholders(_0x9ad517);
  const _0x190e9e = _0x2cb75d['map'](_0x1f9c3f => _0x42efba["get"](normalizeStoryboardImagePlaceholder(_0x1f9c3f)))["filter"](_0x479fe3 => _0x479fe3?.["url"]);
  if (_0x190e9e["length"] === 0x0) {
    return null;
  }
  const _0x29d56a = document['createElement']("span");
  _0x29d56a["className"] = "storyboard-script-role-images";
  _0x190e9e['slice'](0x0, 0x3)["forEach"](_0x2728cb => {
    const _0x93b128 = document["createElement"]("img");
    _0x93b128['className'] = 'storyboard-script-role-image-thumb';
    _0x93b128['src'] = _0x2728cb["url"];
    _0x93b128['alt'] = _0x2728cb['label'] || getStoryboardColumnLabel("角色图");
    _0x93b128["loading"] = "lazy";
    _0x93b128["draggable"] = ![];
    _0x93b128["title"] = _0x2728cb["label"] || '';
    _0x29d56a['appendChild'](_0x93b128);
  });
  if (_0x190e9e["length"] > 0x3) {
    const _0x843123 = document["createElement"]('span');
    _0x843123["className"] = 'storyboard-script-role-image-more';
    _0x843123["textContent"] = '+' + (_0x190e9e['length'] - 0x3);
    _0x29d56a['appendChild'](_0x843123);
  }
  return _0x29d56a;
}
function appendStoryboardCellDisplay(_0x1ec956, _0x4f6765, _0x478565, _0x1ff5e7 = new Map()) {
  const _0xeefccc = formatCellValue(_0x478565);
  _0x1ec956["dataset"]['storyboardRawValue'] = _0xeefccc;
  _0x1ec956["replaceChildren"]();
  _0x1ec956["classList"]['remove']("storyboard-script-image-cell");
  if (_0x4f6765 === "角色图" || _0x4f6765 === '参考') {
    const _0x44f424 = createStoryboardRoleImagePreview(_0xeefccc, _0x1ff5e7);
    if (_0x44f424) {
      _0x1ec956['classList']["add"]("storyboard-script-image-cell");
      _0x1ec956['appendChild'](_0x44f424);
      return;
    }
  }
  _0x1ec956['textContent'] = _0xeefccc;
}
function buildStoryboardBodyRenderSignature(_0xc62e7, _0x8c47c6 = []) {
  const _0x25a5f0 = mergeStoryboardImageRefs(_0x8c47c6, _0xc62e7?.["referenceImageRefs"])["map"](_0x2ebdcb => ({
    'label': normalizeStoryboardImagePlaceholder(_0x2ebdcb?.["label"]),
    'url': String(_0x2ebdcb?.["url"] || '')["trim"]()
  }));
  try {
    return JSON['stringify']({
      'viewMode': normalizeStoryboardScriptViewMode(_0xc62e7?.["viewMode"]),
      'mediaMode': normalizeStoryboardScriptMediaMode(_0xc62e7?.['mediaMode']),
      'selectionMode': _0xc62e7?.['selectionMode'] === !![],
      'rows': Array['isArray'](_0xc62e7?.['rows']) ? _0xc62e7['rows'] : [],
      'refs': _0x25a5f0
    });
  } catch {
    return '' + Date['now']();
  }
}
function collectDirectStoryboardImageRefs(_0x1e24b3 = [], _0x1641a0 = {}) {
  const _0x5eb8ac = [];
  for (const _0x2f5b94 of Array["isArray"](_0x1e24b3) ? _0x1e24b3 : []) {
    const _0x28b99d = _0x1641a0?.[_0x2f5b94?.["sourceId"]];
    if (!_0x28b99d) {
      continue;
    }
    if (resolveEffectiveInputKind(_0x28b99d, _0x2f5b94) !== "image") {
      continue;
    }
    const _0x1f7924 = resolveGenerationInputImageUrl(_0x28b99d);
    if (!_0x1f7924) {
      continue;
    }
    _0x5eb8ac['push']({
      'label': getStoryboardImagePlaceholder(_0x5eb8ac['length'] + 0x1),
      'url': _0x1f7924,
      'type': 'image',
      'sourceId': String(_0x2f5b94?.["sourceId"] || ''),
      'source': 'node'
    });
  }
  return _0x5eb8ac;
}
function collectDirectStoryboardVideoRefs(_0x3608d9 = [], _0x330abf = {}) {
  const _0x535bf0 = [];
  for (const _0x1389ac of Array["isArray"](_0x3608d9) ? _0x3608d9 : []) {
    const _0x516d9a = _0x330abf?.[_0x1389ac?.["sourceId"]];
    if (!_0x516d9a) {
      continue;
    }
    if (resolveEffectiveInputKind(_0x516d9a, _0x1389ac) !== "video") {
      continue;
    }
    const _0x2f171f = resolveStoryboardVideoRefUrl(_0x516d9a);
    if (!_0x2f171f) {
      continue;
    }
    _0x535bf0["push"]({
      'label': getStoryboardVideoPlaceholder(_0x535bf0['length'] + 0x1),
      'url': _0x2f171f,
      'type': "video",
      'sourceId': String(_0x1389ac?.['sourceId'] || ''),
      'source': "node"
    });
  }
  return _0x535bf0;
}
function normalizeStoryboardImageInputRefs({
  directImageRefs = [],
  promptAssetRefs = [],
  hiddenAssetRefs = []
} = {}) {
  const _0x27efcc = [];
  const _0x1232c1 = (_0x20368f, _0x32adf4 = '') => {
    const _0x5a3d27 = String(_0x20368f?.["url"] || '')["trim"]();
    if (!_0x5a3d27) {
      return;
    }
    const _0x5727f8 = String(_0x20368f?.["placeholder"] || _0x20368f?.['label'] || _0x32adf4 || '')["trim"]() || getStoryboardImagePlaceholder(_0x27efcc['length'] + 0x1);
    _0x27efcc["push"]({
      ..._0x20368f,
      'label': _0x5727f8,
      'url': _0x5a3d27,
      'type': "image"
    });
  };
  directImageRefs["forEach"](_0xc94a06 => _0x1232c1(_0xc94a06, _0xc94a06?.["label"]));
  promptAssetRefs["filter"](_0x37b152 => _0x37b152?.["type"] === "image")["forEach"](_0x10475f => _0x1232c1({
    ..._0x10475f,
    'label': ''
  }, _0x10475f?.["placeholder"]));
  hiddenAssetRefs['filter'](_0x449ae3 => _0x449ae3?.["type"] === "image")["forEach"](_0x56b91d => {
    _0x1232c1({
      ..._0x56b91d,
      'label': ''
    }, getStoryboardImagePlaceholder(_0x27efcc["length"] + 0x1));
  });
  return _0x27efcc["map"]((_0x20e080, _0x112a5d) => ({
    ..._0x20e080,
    'label': _0x20e080["label"] || getStoryboardImagePlaceholder(_0x112a5d + 0x1)
  }));
}
function normalizeStoryboardVideoInputRefs({
  directVideoRefs = [],
  promptAssetRefs = [],
  hiddenAssetRefs = []
} = {}) {
  const _0x377fd1 = [];
  const _0x48a3e3 = (_0x46d156, _0x22bfb9 = '') => {
    const _0x136ec0 = String(_0x46d156?.['url'] || '')["trim"]();
    if (!_0x136ec0) {
      return;
    }
    const _0x1770bd = String(_0x46d156?.["placeholder"] || _0x46d156?.["label"] || _0x22bfb9 || '')["trim"]() || getStoryboardVideoPlaceholder(_0x377fd1['length'] + 0x1);
    _0x377fd1['push']({
      ..._0x46d156,
      'label': _0x1770bd,
      'url': _0x136ec0,
      'type': "video"
    });
  };
  directVideoRefs["forEach"](_0x267547 => _0x48a3e3(_0x267547, _0x267547?.["label"]));
  promptAssetRefs["filter"](_0x32220b => _0x32220b?.['type'] === 'video')["forEach"](_0x40107e => _0x48a3e3({
    ..._0x40107e,
    'label': ''
  }, _0x40107e?.["placeholder"]));
  hiddenAssetRefs["filter"](_0x305f4a => _0x305f4a?.['type'] === "video")["forEach"](_0x3128a4 => {
    _0x48a3e3({
      ..._0x3128a4,
      'label': ''
    }, getStoryboardVideoPlaceholder(_0x377fd1["length"] + 0x1));
  });
  return _0x377fd1["map"]((_0x5ed247, _0x268177) => ({
    ..._0x5ed247,
    'label': _0x5ed247["label"] || getStoryboardVideoPlaceholder(_0x268177 + 0x1)
  }));
}
function buildStoryboardReferenceSummary({
  imageLabels = [],
  videoLabels = []
} = {}) {
  const _0x4e3d2d = [];
  Array["isArray"](imageLabels) && imageLabels['length'] > 0x0 && _0x4e3d2d["push"]('参考图片：' + imageLabels["join"]('、'));
  Array['isArray'](videoLabels) && videoLabels["length"] > 0x0 && _0x4e3d2d["push"]('参考视频：' + videoLabels["join"]('、'));
  return _0x4e3d2d["join"]('\x0a');
}
function formatStoryboardVideoTime(_0x31448d) {
  const _0x58e4a8 = Math["max"](0x0, Number(_0x31448d) || 0x0);
  const _0x240532 = Math["floor"](_0x58e4a8);
  const _0x3394a5 = Math['floor'](_0x240532 / 0x3c);
  const _0x38fc24 = _0x240532 % 0x3c;
  const _0x1360d2 = Math["round"]((_0x58e4a8 - _0x240532) * 0xa);
  return String(_0x3394a5)["padStart"](0x2, '0') + ':' + String(_0x38fc24)["padStart"](0x2, '0') + '.' + _0x1360d2;
}
function formatStoryboardVideoTimeRange(_0x50b861 = {}) {
  const _0x1be8a6 = formatStoryboardVideoTime(_0x50b861['start']);
  const _0xb01ce8 = formatStoryboardVideoTime(Number(_0x50b861["end"]) > Number(_0x50b861["start"]) ? _0x50b861["end"] : _0x50b861["captureTime"]);
  return _0x1be8a6 + '-' + _0xb01ce8;
}
function buildStoryboardVideoFrameReferenceSummary(_0x5ed347 = []) {
  const _0xf67bc2 = Array["isArray"](_0x5ed347) ? _0x5ed347 : [];
  if (_0xf67bc2["length"] === 0x0) {
    return '';
  }
  return _0xf67bc2["map"](_0x317e17 => {
    const _0x2f2b90 = normalizeStoryboardImagePlaceholder(_0x317e17?.["label"]);
    const _0x537abc = String(_0x317e17?.['videoLabel'] || '@视频1')["trim"]();
    const _0x2f359a = String(_0x317e17?.['timeRange'] || '')["trim"]();
    const _0x34ae5b = _0x317e17?.["sentAsImage"] === ![] ? "（仅提供时间码，画面请结合原视频判断）" : '';
    return _0x2f2b90 + "：来自 " + _0x537abc + (_0x2f359a ? '\x20' + _0x2f359a : '') + _0x34ae5b;
  })["filter"](Boolean)['join']('\x0a');
}
function getStoryboardModelImageInputLimit(_0x431591, _0x359ece) {
  const _0x5440bb = getModelManifest(_0x431591, _0x359ece);
  const _0x6df1c8 = Number(_0x5440bb?.["inputSlots"]?.["maxByKind"]?.["image"]);
  return Number['isFinite'](_0x6df1c8) && _0x6df1c8 > 0x0 ? Math["trunc"](_0x6df1c8) : STORYBOARD_VIDEO_FRAME_LIMIT;
}
function chunkStoryboardFrameRefs(_0x5c6be2 = [], _0x819623 = STORYBOARD_VIDEO_FRAME_LIMIT) {
  const _0x5807bc = Array["isArray"](_0x5c6be2) ? _0x5c6be2 : [];
  const _0x49fa38 = Math["max"](0x1, Math['trunc'](Number(_0x819623) || 0x1));
  const _0x54bd59 = [];
  for (let _0x4c9f22 = 0x0; _0x4c9f22 < _0x5807bc["length"]; _0x4c9f22 += _0x49fa38) {
    _0x54bd59["push"](_0x5807bc["slice"](_0x4c9f22, _0x4c9f22 + _0x49fa38));
  }
  return _0x54bd59;
}
function buildCombinedStoryboardBatchJson({
  rows = [],
  title = getStoryboardScriptDefaultName()
} = {}) {
  const _0x356fe5 = (Array["isArray"](rows) ? rows : [])["map"]((_0x233d75, _0x38444c) => ({
    ..._0x233d75,
    '镜号': String(_0x38444c + 0x1)
  }));
  return JSON["stringify"]({
    'schemaVersion': STORYBOARD_SCRIPT_GENERATION_SCHEMA_VERSION,
    'type': 'storyboard-script',
    'sourceMode': 'video',
    'title': String(title || getStoryboardScriptDefaultName())["trim"]() || getStoryboardScriptDefaultName(),
    'detectedIntent': {
      'shotCount': _0x356fe5["length"],
      'language': "zh-CN"
    },
    'rows': _0x356fe5
  }, null, 0x2);
}
async function runStoryboardScriptGenerationPayload(_0x1ed7bd) {
  assertVideoAnalysisModel(_0x1ed7bd["model"]);
  const _0x333021 = Array['isArray'](_0x1ed7bd?.["videoFrameBatches"]) ? _0x1ed7bd["videoFrameBatches"]["filter"](_0x58c605 => Array["isArray"](_0x58c605) && _0x58c605["length"] > 0x0) : [];
  if (_0x1ed7bd?.['sourceMode'] !== 'video' || _0x333021["length"] <= 0x1) {
    return generateText(_0x1ed7bd);
  }
  const _0x103a6b = [];
  let _0x31a9fd = '';
  for (const _0x2bbf2c of _0x333021) {
    const _0x587055 = _0x2bbf2c["map"](_0x5b1de0 => _0x5b1de0["url"])["filter"](Boolean);
    const _0xaf03e2 = buildStoryboardScriptVideoPrompt(_0x1ed7bd["rawPromptText"] || '', {
      'videoCount': Array['isArray'](_0x1ed7bd["inputVideoUrls"]) ? _0x1ed7bd["inputVideoUrls"]["length"] : 0x0,
      'videoLabels': _0x1ed7bd["videoLabels"],
      'videoFrameSummary': buildStoryboardVideoFrameReferenceSummary(_0x2bbf2c["map"](_0x3d768e => ({
        ..._0x3d768e,
        'sentAsImage': !![]
      })))
    });
    const _0x3034eb = await generateText({
      ..._0x1ed7bd,
      'prompt': _0xaf03e2,
      'inputImageUrls': _0x587055,
      'inputUrls': [..._0x587055, ...(_0x1ed7bd["inputVideoUrls"] || [])]
    });
    const _0x158998 = normalizeStoryboardScriptGenerationResult(extractGeneratedText(_0x3034eb)["trim"](), {
      'requireMarker': !![],
      'sourceMode': "video"
    });
    if (!_0x158998['ok']) {
      throw new Error(storyboardScriptText("errors.invalidJsonTooManyFrames"));
    }
    if (!_0x31a9fd) {
      _0x31a9fd = _0x158998["title"];
    }
    _0x103a6b["push"](..._0x158998['rows']);
  }
  return {
    'text': buildCombinedStoryboardBatchJson({
      'rows': _0x103a6b,
      'title': _0x31a9fd || getStoryboardScriptDefaultName()
    })
  };
}
function resolveStoryboardScriptTextModel(_0xfbef30 = {}) {
  const _0x5d3e52 = String(_0xfbef30["storyboardScript"]?.['model'] || _0xfbef30["model"] || STORYBOARD_SCRIPT_TEXT_MODEL)["trim"]();
  return _0x5d3e52 || STORYBOARD_SCRIPT_TEXT_MODEL;
}
function resolveStoryboardScriptTextProvider(_0x2bc95c = {}) {
  const _0x3d65b2 = String(_0x2bc95c["storyboardScript"]?.['provider'] || _0x2bc95c["provider"] || STORYBOARD_SCRIPT_TEXT_PROVIDER)["trim"]();
  return _0x3d65b2 || STORYBOARD_SCRIPT_TEXT_PROVIDER;
}
function buildStoryboardScriptStatePatch({
  current: _0x1e9324,
  prompt: _0x542b5c,
  model: _0x435981,
  provider: _0x2a25a1,
  sourceMode = '',
  status: _0x593cd9,
  normalized = null,
  error = '',
  referenceImageRefs = null
}) {
  const _0x3ce8d0 = normalized?.['rows'] ?? _0x1e9324["rows"] ?? [];
  const _0x40b478 = buildCanonicalStoryboardScriptJson({
    ..._0x1e9324,
    ...(normalized || {}),
    'rows': _0x3ce8d0
  });
  return {
    ..._0x1e9324,
    'version': 0x1,
    'viewMode': _0x1e9324["viewMode"] || "list",
    'prompt': _0x542b5c,
    'model': _0x435981,
    'provider': _0x2a25a1,
    'sourceMode': normalized?.["sourceMode"] || sourceMode || _0x1e9324["sourceMode"] || "text",
    'isGenerating': _0x593cd9 === "running",
    'jobStatus': _0x593cd9,
    'jobError': error,
    'rawJson': normalized?.["rawJson"] ?? _0x1e9324["rawJson"] ?? '',
    'canonicalJson': JSON["stringify"](_0x40b478, null, 0x2),
    'rows': _0x3ce8d0,
    'selectedRowIndexes': normalized ? [] : normalizeStoryboardScriptSelectedRowIndexes(_0x1e9324['selectedRowIndexes'], _0x3ce8d0["length"]),
    'selectionMode': normalized ? ![] : _0x1e9324['selectionMode'] === !![],
    'title': _0x40b478["title"],
    'detectedIntent': _0x40b478["detectedIntent"],
    'referenceImageRefs': Array['isArray'](referenceImageRefs) ? referenceImageRefs : Array["isArray"](_0x1e9324["referenceImageRefs"]) ? _0x1e9324["referenceImageRefs"] : [],
    'warnings': normalized?.['warnings'] ?? _0x1e9324['warnings'] ?? [],
    'updatedAt': Date['now']()
  };
}
function createToolbarButton({
  action: _0x105dfb,
  label: _0x190783,
  tooltip: _0x1f98cc,
  iconHtml: _0xc90123,
  showLabel = ![]
}) {
  const _0x27b003 = document["createElement"]("button");
  _0x27b003['type'] = "button";
  _0x27b003["className"] = ["ftb-btn", showLabel ? '' : "icon-only", 'act-' + _0x105dfb]['filter'](Boolean)["join"]('\x20');
  if (!showLabel) {
    _0x27b003['dataset']["tooltip"] = _0x1f98cc || _0x190783;
  }
  _0x27b003["setAttribute"]("aria-label", _0x190783);
  _0x27b003["innerHTML"] = showLabel ? _0xc90123 + "<span>" + _0x190783 + "</span>" : _0xc90123;
  return _0x27b003;
}
function setToolbarButtonLabel(_0x19d878, _0x3643c0) {
  if (!_0x19d878) {
    return;
  }
  _0x19d878["setAttribute"]("aria-label", _0x3643c0);
  const _0xacf49a = _0x19d878['querySelector']('span');
  _0xacf49a ? (_0xacf49a['textContent'] = _0x3643c0, delete _0x19d878["dataset"]["tooltip"]) : _0x19d878["dataset"]["tooltip"] = _0x3643c0;
}
function replaceModelTriggerIcon(_0xc86f2, _0x5ce330) {
  const _0x5d37c2 = _0xc86f2?.["firstElementChild"];
  const _0x3e533c = String(_0x5ce330 || '')["trim"]();
  if (!_0x5d37c2 || !_0x3e533c) {
    return;
  }
  const _0x520394 = _0xc86f2["dataset"]?.["storyboardModelIconHtml"] || '';
  if (_0x520394 === _0x3e533c) {
    return;
  }
  if (!_0x520394 && String(_0x5d37c2['outerHTML'] || '')["trim"]() === _0x3e533c) {
    _0xc86f2['dataset']["storyboardModelIconHtml"] = _0x3e533c;
    return;
  }
  const _0x22eec1 = document["createElement"]("template");
  _0x22eec1["innerHTML"] = _0x3e533c;
  const _0x2d9441 = _0x22eec1["content"]["firstElementChild"];
  if (!_0x2d9441) {
    return;
  }
  _0xc86f2["dataset"]["storyboardModelIconHtml"] = _0x3e533c;
  _0x5d37c2['replaceWith'](_0x2d9441);
}
function escapePromptTextForHtml(_0x16f6eb) {
  return String(_0x16f6eb || '')["replace"](/&/g, "&amp;")["replace"](/</g, "&lt;")["replace"](/>/g, '&gt;')["replace"](/"/g, "&quot;");
}
function getStoryboardRowImagePrompt(_0x1fc3ee) {
  if (!_0x1fc3ee || typeof _0x1fc3ee !== "object") {
    return '';
  }
  return formatCellValue(_0x1fc3ee["图片提示词"] ?? _0x1fc3ee['imagePrompt'] ?? _0x1fc3ee["image_prompt"] ?? _0x1fc3ee['imagePromptText'] ?? '')["trim"]();
}
function getStoryboardRowShotNo(_0xb4bd7b, _0x2ebe1b) {
  return formatCellValue(_0xb4bd7b?.['镜号'] ?? _0xb4bd7b?.["shotNo"] ?? _0xb4bd7b?.["shotNumber"] ?? _0x2ebe1b + 0x1)["trim"]();
}
function clonePlainObject(_0x4cefcf) {
  if (!_0x4cefcf || typeof _0x4cefcf !== "object" || Array["isArray"](_0x4cefcf)) {
    return null;
  }
  try {
    return JSON["parse"](JSON["stringify"](_0x4cefcf));
  } catch {
    return {
      ..._0x4cefcf
    };
  }
}
function getPlainObject(_0x37ddbf) {
  return _0x37ddbf && typeof _0x37ddbf === 'object' && !Array["isArray"](_0x37ddbf) ? {
    ..._0x37ddbf
  } : {};
}
function getImageNodeSizeForAspectRatio(_0x52ecaa) {
  const _0xbd2278 = getAIGenerationDefaultSizeByType("ai-image");
  const _0xc084ff = buildImageDisplayRatioResizePatch({
    'nodeData': {
      'x': 0x0,
      'y': 0x0,
      'width': _0xbd2278["width"],
      'height': _0xbd2278["height"]
    },
    'ratioValue': _0x52ecaa,
    'minSide': Math["min"](_0xbd2278["width"], _0xbd2278["height"])
  });
  return {
    'width': Number(_0xc084ff["width"]) || _0xbd2278['width'],
    'height': Number(_0xc084ff["height"]) || _0xbd2278["height"]
  };
}
function sanitizeExportFileName(_0x3617a4) {
  const _0x38567b = String(_0x3617a4 || '')["trim"]()['replace'](/[\\/:*?"<>|]/g, '_')["replace"](/\s+/g, '_')["slice"](0x0, 0x50);
  return _0x38567b || getStoryboardScriptDefaultName();
}
function formatExportTimestamp(_0x3e6b4d = new Date()) {
  const _0x48a03f = _0x277d47 => String(_0x277d47)['padStart'](0x2, '0');
  return [_0x3e6b4d['getFullYear'](), _0x48a03f(_0x3e6b4d["getMonth"]() + 0x1), _0x48a03f(_0x3e6b4d["getDate"]()), '-', _0x48a03f(_0x3e6b4d['getHours']()), _0x48a03f(_0x3e6b4d['getMinutes']()), _0x48a03f(_0x3e6b4d["getSeconds"]())]["join"]('');
}
function focusStoryboardImageBatch(_0x2db2ad, _0xb828ce) {
  const _0x1cd6e1 = [_0x2db2ad, _0xb828ce]['map'](_0x511397 => String(_0x511397 || '')["trim"]())['filter'](Boolean);
  if (_0x1cd6e1["length"] === 0x0) {
    return;
  }
  a542_0x3b634e["setSelectedNodes"](_0x1cd6e1);
  const _0x2e23d6 = typeof window !== "undefined" ? window : null;
  try {
    if (typeof _0x2e23d6?.["v2FocusOnNodes"] === "function") {
      _0x2e23d6['v2FocusOnNodes'](_0x1cd6e1, 0x50, 0x320);
    } else {
      typeof _0x2e23d6?.["v2FocusOnNode"] === "function" && _0x2e23d6["v2FocusOnNode"](_0x1cd6e1[_0x1cd6e1['length'] - 0x1], 0x50, 0x320);
    }
  } catch (_0x56bd15) {
    console['warn']("[StoryboardScriptNode] focus created image batch failed", _0x56bd15);
  }
}
function createStoryboardScriptLoadingOverlay() {
  const _0x18ba1a = document["createElement"]("div");
  _0x18ba1a["className"] = "storyboard-script-loading-overlay";
  _0x18ba1a["setAttribute"]("role", "status");
  _0x18ba1a["setAttribute"]('aria-live', "polite");
  const _0x68e23 = document["createElement"]("div");
  _0x68e23["className"] = "storyboard-script-loading-spinner";
  _0x18ba1a["appendChild"](_0x68e23);
  const _0x57765d = document["createElement"]("div");
  _0x57765d['className'] = 'storyboard-script-loading-label';
  _0x57765d["textContent"] = storyboardScriptText("loading");
  _0x18ba1a['appendChild'](_0x57765d);
  const _0x1501fd = document["createElement"]("div");
  _0x1501fd["className"] = "storyboard-script-loading-bar";
  const _0x4c37af = document["createElement"]("div");
  _0x4c37af['className'] = "storyboard-script-loading-bar-fill";
  _0x1501fd["appendChild"](_0x4c37af);
  _0x18ba1a['appendChild'](_0x1501fd);
  return _0x18ba1a;
}
function waitForStoryboardLoadingPaint() {
  const _0x19e69f = typeof window !== 'undefined' ? window : null;
  if (!_0x19e69f) {
    return Promise['resolve']();
  }
  return new Promise(_0x3e058f => {
    const _0x1ed40f = () => _0x3e058f();
    if (typeof _0x19e69f["requestAnimationFrame"] === "function") {
      _0x19e69f["requestAnimationFrame"](() => {
        typeof _0x19e69f["setTimeout"] === "function" ? _0x19e69f["setTimeout"](_0x1ed40f, 0x0) : _0x1ed40f();
      });
      return;
    }
    if (typeof _0x19e69f['setTimeout'] === "function") {
      _0x19e69f["setTimeout"](_0x1ed40f, 0x0);
      return;
    }
    _0x1ed40f();
  });
}
function createSvgIcon() {
  const _0x493551 = 'http://www.w3.org/2000/svg';
  const _0x2bf4c0 = document["createElementNS"](_0x493551, "svg");
  _0x2bf4c0['setAttribute']("width", '16');
  _0x2bf4c0["setAttribute"]("height", '16');
  _0x2bf4c0["setAttribute"]("viewBox", "0 0 24 24");
  _0x2bf4c0['setAttribute']("fill", "none");
  _0x2bf4c0["setAttribute"]("stroke", "currentColor");
  _0x2bf4c0["setAttribute"]('stroke-width', '2');
  const _0x91e219 = document["createElementNS"](_0x493551, "rect");
  _0x91e219["setAttribute"]('x', '3');
  _0x91e219["setAttribute"]('y', '4');
  _0x91e219["setAttribute"]("width", '18');
  _0x91e219["setAttribute"]('height', '16');
  _0x91e219["setAttribute"]('rx', '2');
  _0x2bf4c0["appendChild"](_0x91e219);
  ['9', '14']["forEach"](_0x29a367 => {
    const _0x285593 = document['createElementNS'](_0x493551, "line");
    _0x285593["setAttribute"]('x1', '3');
    _0x285593["setAttribute"]('y1', _0x29a367);
    _0x285593['setAttribute']('x2', '21');
    _0x285593['setAttribute']('y2', _0x29a367);
    _0x2bf4c0['appendChild'](_0x285593);
  });
  const _0x2e6eb3 = document["createElementNS"](_0x493551, "line");
  _0x2e6eb3["setAttribute"]('x1', '8');
  _0x2e6eb3["setAttribute"]('y1', '4');
  _0x2e6eb3['setAttribute']('x2', '8');
  _0x2e6eb3["setAttribute"]('y2', '20');
  _0x2bf4c0["appendChild"](_0x2e6eb3);
  return _0x2bf4c0;
}
export class StoryboardScriptNode {
  constructor(_0x5946b9) {
    this["_data"] = _0x5946b9 || {};
    this["nodeId"] = this['_data']['id'];
    this["refBarEl"] = null;
    this['promptEl'] = null;
    this["_promptPanelEl"] = null;
    this['btnEl'] = null;
    this["_toolbarGenerateBtn"] = null;
    this['_toolbarFullscreenBtn'] = null;
    this["_toolbarDownloadBtn"] = null;
    this['_queueBtn'] = null;
    this['_imageModeBtn'] = null;
    this['_videoModeBtn'] = null;
    this["_selectionCountEl"] = null;
    this["_onDocumentPointerDown"] = null;
    this["_onModelTriggerClickCapture"] = null;
    this['_storyboardImageModelMenu'] = null;
    this["_storyboardImageModelMenuBound"] = ![];
    this["_storyboardImageSchemaCleanup"] = null;
    this["_storyboardImageSchemaModel"] = '';
    this["_storyboardImageSchemaSelectionMode"] = null;
    this["rhAdvPanelEl"] = null;
    this["rhAdvWrap"] = null;
    this["uiSchemaModeSlot"] = null;
    this["uiSchemaResolutionSlot"] = null;
    this["uiSchemaInstanceSlot"] = null;
    this["uiSchemaBatchSlot"] = null;
    this["_isGeneratingScript"] = ![];
    this['_isPromptGenerateLoadingPrimed'] = ![];
    this['_activeCellEdit'] = null;
    this['_storyboardViewScrollByKey'] = new Map();
    this["_storyboardBodyRenderSignature"] = '';
    this["_skipNextStoryboardBodyRender"] = ![];
    this['_fullscreenOverlayEl'] = null;
    this["_onFullscreenKeydown"] = null;
    this['el'] = document["createElement"]('div');
    this['el']["className"] = 'v2-node-component\x20storyboard-script-node';
  }
  ["mount"]() {
    this['el']["replaceChildren"]();
    const _0x29ab43 = this['_getScriptState']()["displayOnly"] === !![];
    this['el']["classList"]["toggle"]("is-display-only", _0x29ab43);
    const _0x2e254d = document["createElement"]("div");
    _0x2e254d["className"] = "storyboard-script-header";
    const _0x5a915c = document['createElement']('div');
    _0x5a915c["className"] = "storyboard-script-title";
    _0x5a915c["appendChild"](createSvgIcon());
    const _0x3a3e2f = document["createElement"]("span");
    _0x3a3e2f['textContent'] = getStoryboardScriptDefaultName();
    _0x5a915c['appendChild'](_0x3a3e2f);
    const _0x3f4752 = document["createElement"]("span");
    _0x3f4752['className'] = "storyboard-script-beta";
    _0x3f4752["textContent"] = "BETA";
    _0x5a915c["appendChild"](_0x3f4752);
    const _0x242903 = document["createElement"]('div');
    _0x242903["className"] = "storyboard-script-header-controls";
    const _0x3189a8 = document['createElement']("div");
    _0x3189a8["className"] = 'storyboard-script-media-switch';
    _0x3189a8["setAttribute"]("role", "group");
    _0x3189a8["setAttribute"]("aria-label", storyboardScriptText('mediaModeAria'));
    this["_imageModeBtn"] = this["_createMediaModeButton"]("image", storyboardScriptText("mediaMode.image"));
    this['_videoModeBtn'] = this["_createMediaModeButton"]("video", storyboardScriptText("mediaMode.video"));
    _0x3189a8["appendChild"](this["_imageModeBtn"]);
    _0x3189a8["appendChild"](this["_videoModeBtn"]);
    const _0x351a26 = document['createElement']('div');
    _0x351a26["className"] = "storyboard-script-view-switch";
    _0x351a26["setAttribute"]("role", "group");
    _0x351a26["setAttribute"]("aria-label", storyboardScriptText("viewModeAria"));
    this['_listBtn'] = this["_createModeButton"]("list", storyboardScriptText("viewMode.list"));
    this["_cardBtn"] = this["_createModeButton"]("card", storyboardScriptText("viewMode.card"));
    _0x351a26["appendChild"](this["_listBtn"]);
    _0x351a26["appendChild"](this['_cardBtn']);
    _0x242903["appendChild"](_0x3189a8);
    _0x242903["appendChild"](_0x351a26);
    _0x2e254d["appendChild"](_0x5a915c);
    _0x2e254d["appendChild"](_0x242903);
    this['_bodyEl'] = document['createElement']("div");
    this["_bodyEl"]["className"] = "storyboard-script-body";
    this["_bindBodyInteractions"]();
    !_0x29ab43 && (this["_promptPanelEl"] = buildSharedPromptPanel(this, {
      'placeholder': storyboardScriptText("promptPlaceholder"),
      'btnTitle': storyboardScriptText("generate"),
      'modelMenu': {
        'provider': resolveStoryboardScriptTextProvider(this["_data"]),
        'allowedModelIds': getVideoAnalysisModelIds(),
        'allowCustomModels': ![],
        'defaultModel': STORYBOARD_SCRIPT_TEXT_MODEL,
        'model': resolveStoryboardScriptTextModel(this["_data"]),
        'onSelect': ({
          modelId: _0x3bf3a3,
          provider: _0x217093
        }) => {
          assertVideoAnalysisModel(_0x3bf3a3);
          const _0xb21304 = this["_getScriptState"]();
          const _0x170780 = {
            ..._0xb21304,
            'model': _0x3bf3a3,
            'provider': _0x217093,
            'sourceMode': "text"
          };
          this["_data"] = {
            ...this["_data"],
            'model': _0x3bf3a3,
            'provider': _0x217093,
            'storyboardScript': _0x170780
          };
          a542_0x3b634e["updateNodeData"](this['nodeId'], {
            'model': _0x3bf3a3,
            'provider': _0x217093,
            'storyboardScript': _0x170780
          });
        }
      }
    }), this["_bindPromptGenerateImmediateLoading"](), this["_installSelectionCountIndicator"](), this["_installStoryboardImagePromptSchemaControls"](), this["_installStoryboardQueueButton"](), this["_bindStoryboardImageModelTrigger"]());
    this['el']["appendChild"](_0x2e254d);
    this['el']["appendChild"](this['_bodyEl']);
    this["_toolbarEl"] = this['_createToolbar']();
    this['el']["appendChild"](this["_toolbarEl"]);
    if (this["_promptPanelEl"]) {
      this['el']["appendChild"](this["_promptPanelEl"]);
    }
    this["_resizeHandleEl"] = createNodeResizeHandle(this, {
      'store': a542_0x3b634e,
      'getStateSnapshot': getStateSnapshot,
      'commit': commit,
      'resolveMinSize': resolveStoryboardScriptResizeMinSize
    });
    this['el']['appendChild'](this["_resizeHandleEl"]);
    this["_renderRefBar"]();
    this["_bindOutsideSelectionCancel"]();
    this["_updateSubmitButtonState"]();
    this["_render"]();
    return this['el'];
  }
  ['_createToolbar']() {
    const _0x552332 = document["createElement"]('div');
    _0x552332['className'] = "node-floating-toolbar v2-text-toolbar v2-storyboard-script-toolbar";
    _0x552332["addEventListener"]("pointerdown", _0x37511b => {
      _0x37511b["stopPropagation"]();
    });
    _0x552332['addEventListener']("dblclick", _0x2d275b => {
      _0x2d275b["preventDefault"]();
      _0x2d275b["stopPropagation"]();
    });
    this['_toolbarGenerateBtn'] = createToolbarButton({
      'action': "generate-storyboard",
      'label': storyboardScriptText('toolbar.editMode'),
      'tooltip': storyboardScriptText("toolbar.editMode"),
      'iconHtml': STORYBOARD_TOOLBAR_GENERATE_ICON_HTML,
      'showLabel': !![]
    });
    this["_toolbarGenerateBtn"]["addEventListener"]("click", _0x52d5b2 => {
      _0x52d5b2["stopPropagation"]();
      const _0xe7b44a = this["_getScriptState"]();
      _0xe7b44a['selectionMode'] === !![] ? this['_cancelSelectionMode']() : this["_enterSelectionMode"]();
    });
    this['_toolbarFullscreenBtn'] = createToolbarButton({
      'action': 'fullscreen-script',
      'label': storyboardScriptText('toolbar.fullscreen'),
      'tooltip': storyboardScriptText('toolbar.fullscreen'),
      'iconHtml': STORYBOARD_TOOLBAR_FULLSCREEN_ICON_HTML
    });
    this["_toolbarFullscreenBtn"]["addEventListener"]("click", _0x40b4e2 => {
      _0x40b4e2["stopPropagation"]();
      this["_openFullscreenScript"]();
    });
    this["_toolbarDownloadBtn"] = createToolbarButton({
      'action': "download-table",
      'label': storyboardScriptText("toolbar.download"),
      'tooltip': storyboardScriptText('toolbar.downloadTable'),
      'iconHtml': STORYBOARD_TOOLBAR_DOWNLOAD_ICON_HTML
    });
    this["_toolbarDownloadBtn"]['addEventListener']("click", _0x359663 => {
      _0x359663['stopPropagation']();
      void this["_downloadScriptTable"]();
    });
    _0x552332["appendChild"](this["_toolbarGenerateBtn"]);
    _0x552332["appendChild"](this["_toolbarFullscreenBtn"]);
    _0x552332["appendChild"](this["_toolbarDownloadBtn"]);
    return _0x552332;
  }
  ["_bindOutsideSelectionCancel"]() {
    this['_unbindOutsideSelectionCancel']();
    this['_onDocumentPointerDown'] = _0x2e161c => {
      const _0x3656bf = this["_getScriptState"]();
      if (_0x3656bf["selectionMode"] !== !![]) {
        return;
      }
      const _0x5d788d = _0x2e161c["target"];
      if (!(_0x5d788d instanceof Element)) {
        return;
      }
      const _0x171d72 = document["getElementById"](this["nodeId"]);
      if (this["_fullscreenOverlayEl"]?.["contains"](_0x5d788d)) {
        return;
      }
      if (this['el']["contains"](_0x5d788d) || _0x171d72?.["contains"](_0x5d788d)) {
        return;
      }
      this["_cancelSelectionMode"]();
    };
    document["addEventListener"]('pointerdown', this["_onDocumentPointerDown"], !![]);
  }
  ["_unbindOutsideSelectionCancel"]() {
    if (!this["_onDocumentPointerDown"]) {
      return;
    }
    document["removeEventListener"]("pointerdown", this["_onDocumentPointerDown"], !![]);
    this["_onDocumentPointerDown"] = null;
  }
  ["_bindStoryboardImageModelTrigger"]() {
    const _0x5c8f3c = this["_promptPanelEl"]?.['querySelector'](".img-model-btn-trigger");
    if (!_0x5c8f3c) {
      return;
    }
    this["_onModelTriggerClickCapture"] = _0x44b94c => {
      const _0x2667d8 = this["_getScriptState"]();
      if (_0x2667d8['selectionMode'] !== !![]) {
        return;
      }
      _0x44b94c['preventDefault']();
      _0x44b94c["stopPropagation"]();
      _0x44b94c["stopImmediatePropagation"]?.();
      this["_toggleStoryboardImageModelMenu"]();
    };
    _0x5c8f3c["addEventListener"]("click", this['_onModelTriggerClickCapture'], {
      'capture': !![]
    });
  }
  ["_unbindStoryboardImageModelTrigger"]() {
    const _0x5bb72e = this["_promptPanelEl"]?.["querySelector"](".img-model-btn-trigger");
    if (!_0x5bb72e || !this["_onModelTriggerClickCapture"]) {
      return;
    }
    _0x5bb72e["removeEventListener"]("click", this["_onModelTriggerClickCapture"], {
      'capture': !![]
    });
    this["_onModelTriggerClickCapture"] = null;
  }
  ["_removeStoryboardImageModelMenu"]() {
    this["_storyboardImageModelMenu"]?.["remove"]();
    this["_storyboardImageModelMenu"] = null;
    this["_storyboardImageModelMenuBound"] = ![];
  }
  ['_getStoryboardImagePromptNodeData'](_0x2505b0 = this["_data"], _0xc00fd4 = null) {
    const _0x546776 = _0xc00fd4 || createDefaultStoryboardScriptState(_0x2505b0?.["storyboardScript"] || {});
    const _0x514461 = normalizeDreaminaImageModel(_0x546776["imageModel"] || DEFAULT_IMAGE_NODE_MODEL, _0x546776["imageProvider"] || DEFAULT_IMAGE_NODE_PROVIDER);
    return {
      ...(_0x2505b0 || {}),
      'type': "ai-image",
      'model': _0x514461,
      'provider': _0x546776["imageProvider"] || DEFAULT_IMAGE_NODE_PROVIDER,
      'providerProfileId': _0x546776['imageProviderProfileId'] || '',
      'generationParams': getPlainObject(_0x2505b0?.["generationParams"]),
      'generationParamsByModel': getPlainObject(_0x2505b0?.["generationParamsByModel"])
    };
  }
  ["_installStoryboardImagePromptSchemaControls"]() {
    const _0x3ae68f = this['_promptPanelEl']?.["querySelector"](".prompt-panel-footer");
    const _0xfaf09c = _0x3ae68f?.['querySelector']('.img-model-pills');
    const _0x3530da = _0xfaf09c?.["querySelector"](".img-model-wrap");
    const _0x50bb81 = _0x3ae68f?.["querySelector"]('.prompt-actions');
    const _0x257e26 = _0x50bb81?.["querySelector"]('.debug-wrench-btn');
    if (!_0x3ae68f || !_0xfaf09c || !_0x3530da || !_0x50bb81 || !_0x257e26) {
      return;
    }
    const _0xddd540 = _0x35e498 => {
      const _0x6c64cf = document["createElement"]("div");
      _0x6c64cf['className'] = 'ui-schema-placement\x20' + _0x35e498 + " storyboard-image-schema-only";
      _0x6c64cf["hidden"] = !![];
      return _0x6c64cf;
    };
    this["uiSchemaModeSlot"] = _0xddd540("ui-schema-mode-slot");
    this["uiSchemaResolutionSlot"] = _0xddd540("ui-schema-resolution-slot");
    this["uiSchemaBatchSlot"] = _0xddd540("ui-schema-batch-slot");
    this["uiSchemaInstanceSlot"] = _0xddd540("ui-schema-instance-slot");
    _0x3530da["after"](this["uiSchemaModeSlot"], this["uiSchemaResolutionSlot"]);
    this['rhAdvWrap'] = document["createElement"]("div");
    this["rhAdvWrap"]["className"] = "rh-adv-wrap storyboard-image-schema-only";
    this["rhAdvWrap"]["hidden"] = !![];
    const _0x4618a0 = document["createElement"]("button");
    _0x4618a0["type"] = "button";
    _0x4618a0["className"] = "img-pill-btn rh-adv-btn advanced-settings-icon-button";
    const _0x5ef8d2 = storyboardScriptText("advancedSettings");
    _0x4618a0['setAttribute']("data-tooltip", _0x5ef8d2);
    _0x4618a0['setAttribute']('aria-label', _0x5ef8d2);
    _0x4618a0["setAttribute"]("aria-expanded", "false");
    _0x4618a0["innerHTML"] = ADVANCED_SETTINGS_TUNE_ICON_MARKUP;
    this["rhAdvWrap"]["appendChild"](_0x4618a0);
    _0x50bb81['insertBefore'](this["rhAdvWrap"], _0x257e26);
    _0x50bb81["insertBefore"](this['uiSchemaBatchSlot'], _0x257e26);
    _0x50bb81["insertBefore"](this["uiSchemaInstanceSlot"], _0x257e26);
    this['rhAdvPanelEl'] = document["createElement"]("div");
    this["rhAdvPanelEl"]["className"] = "rh-adv-panel storyboard-image-schema-only";
    _0x3ae68f['appendChild'](this["rhAdvPanelEl"]);
    _0x4618a0["addEventListener"]("click", _0x439364 => {
      _0x439364["stopPropagation"]();
      if (this["rhAdvPanelEl"]?.["hidden"]) {
        return;
      }
      closeNodeFooterMenus(_0x3ae68f, this["rhAdvPanelEl"]);
      const _0x41dd8c = this['rhAdvPanelEl']?.["classList"]["toggle"]("show") === !![];
      _0x4618a0["setAttribute"]('aria-expanded', String(_0x41dd8c));
      this["_storyboardImageModelMenu"]?.["classList"]["remove"]("show");
    });
    this["rhAdvPanelEl"]["addEventListener"]("click", _0x106a63 => {
      _0x106a63['stopPropagation']();
    });
    this["_storyboardImageSchemaCleanup"]?.();
    this["_storyboardImageSchemaCleanup"] = bindModelUiSchemaControls(_0x3ae68f, {
      'nodeId': this['nodeId'],
      'nodeData': this["_getStoryboardImagePromptNodeData"](),
      'store': a542_0x3b634e,
      'decorateNodeData': _0x58052b => this["_getStoryboardImagePromptNodeData"](_0x58052b, createDefaultStoryboardScriptState(_0x58052b?.["storyboardScript"] || {})),
      'buildPatch': (_0xca248, _0x7a538, _0x1b8453) => {
        const _0x57f460 = createDefaultStoryboardScriptState(_0xca248?.['storyboardScript'] || {});
        const _0x285482 = {
          ..._0x57f460,
          'updatedAt': Date["now"]()
        };
        if (_0x7a538 !== "aspectRatio") {
          return {
            'storyboardScript': _0x285482
          };
        }
        return {
          'aspectRatio': _0x1b8453,
          'storyboardScript': _0x285482
        };
      },
      'afterCommit': (_0x3fba31, _0x5cf415, _0x1ef597, {
        patch: _0x4395f0
      } = {}) => {
        _0x4395f0 && typeof _0x4395f0 === "object" && (this["_data"] = {
          ...this["_data"],
          ..._0x4395f0
        });
        this["_syncStoryboardImageSchemaControls"](this["_getScriptState"]());
      }
    });
  }
  ["_syncStoryboardImageSchemaControls"](_0x3a3c1d = this["_getScriptState"]()) {
    const _0x34e0d9 = this["_promptPanelEl"]?.["querySelector"](".prompt-panel-footer");
    if (!_0x34e0d9 || !this["uiSchemaModeSlot"] || !this['uiSchemaResolutionSlot']) {
      return;
    }
    const _0x38f3b7 = Array["isArray"](_0x3a3c1d["rows"]) && _0x3a3c1d["rows"]["length"] > 0x0 && _0x3a3c1d['selectionMode'] === !![];
    const _0xc15c4c = normalizeDreaminaImageModel(_0x3a3c1d['imageModel'] || DEFAULT_IMAGE_NODE_MODEL, _0x3a3c1d["imageProvider"] || DEFAULT_IMAGE_NODE_PROVIDER);
    const _0x23ff97 = this['_getStoryboardImagePromptNodeData'](this["_data"], _0x3a3c1d);
    const _0x5a7109 = this["_storyboardImageSchemaModel"] !== _0xc15c4c || this['_storyboardImageSchemaSelectionMode'] !== _0x38f3b7;
    if (_0x5a7109) {
      const _0x18aeb4 = (_0x2affb6, _0x31a2fa, _0x513d80) => {
        if (!_0x2affb6) {
          return;
        }
        const _0x4ae60a = _0x38f3b7 ? renderModelUiSchemaControls(_0xc15c4c, _0x23ff97, {
          'placement': _0x31a2fa,
          'variant': _0x513d80
        }) : '';
        _0x2affb6["innerHTML"] = _0x4ae60a;
        _0x2affb6["hidden"] = !_0x38f3b7 || !_0x4ae60a;
      };
      _0x18aeb4(this["uiSchemaModeSlot"], 'mode', "pillMenu");
      _0x18aeb4(this["uiSchemaResolutionSlot"], "resolution", "resolutionPill");
      _0x18aeb4(this["uiSchemaBatchSlot"], "batch", "pillMenu");
      _0x18aeb4(this["uiSchemaInstanceSlot"], "instance", "instanceToggle");
      this['rhAdvPanelEl'] && (this["rhAdvPanelEl"]['innerHTML'] = _0x38f3b7 ? renderModelUiSchemaControls(_0xc15c4c, _0x23ff97, {
        'placement': "advanced",
        'variant': "advancedRow"
      }) : '');
      this["_storyboardImageSchemaModel"] = _0xc15c4c;
      this['_storyboardImageSchemaSelectionMode'] = _0x38f3b7;
    }
    syncModelUiSchemaControls(_0x34e0d9, _0x23ff97);
    const _0x43a69b = _0x38f3b7 && hasVisibleModelUiSchema(_0xc15c4c, _0x23ff97, {
      'placement': "advanced"
    });
    if (this["rhAdvWrap"]) {
      this["rhAdvWrap"]["hidden"] = !_0x43a69b;
    }
    this["rhAdvPanelEl"] && (this["rhAdvPanelEl"]["hidden"] = !_0x43a69b, (!_0x43a69b || !_0x38f3b7) && (this["rhAdvPanelEl"]["classList"]["remove"]("show"), this["rhAdvWrap"]?.["querySelector"]?.(".rh-adv-btn")?.["setAttribute"]('aria-expanded', "false")));
  }
  ["_buildStoryboardImageModelPatch"](_0x2c14b5, _0xc558e9, _0x8a5469, _0x254aa3 = {}) {
    const _0x1af26d = createDefaultStoryboardScriptState(_0x2c14b5?.["storyboardScript"] || this["_getScriptState"]());
    const _0x56975b = String(_0x2c14b5?.["model"] || '')['trim']();
    const _0x45145 = String(_0xc558e9 || '')["trim"]() || DEFAULT_IMAGE_NODE_MODEL;
    const _0x27568d = String(_0x8a5469 || '')["trim"]() || DEFAULT_IMAGE_NODE_PROVIDER;
    const _0x1b73e7 = _0x254aa3 && typeof _0x254aa3 === "object" ? {
      ..._0x254aa3
    } : {};
    delete _0x1b73e7["storyboardScript"];
    const _0x11bf99 = getPlainObject(_0x2c14b5?.["generationParamsByModel"]);
    _0x56975b && (_0x11bf99[_0x56975b] = getPlainObject(_0x2c14b5?.['generationParams']));
    const _0x4a0789 = getModelManifest(_0x45145);
    const _0x13f0dc = new Set((_0x4a0789?.["uiSchema"]?.["fields"] || [])["map"](_0x1bcebb => String(_0x1bcebb?.['id'] || '')["trim"]())["filter"](Boolean));
    const _0x2c6792 = getPlainObject(_0x1b73e7["generationParams"]);
    const _0x43c347 = getPlainObject(_0x11bf99[_0x45145]);
    const _0x559b30 = buildModelUiSchemaDefaultParams(_0x45145);
    const _0x542f31 = {};
    _0x13f0dc["forEach"](_0x2e1546 => {
      Object["prototype"]["hasOwnProperty"]["call"](_0x1b73e7, _0x2e1546) && (_0x542f31[_0x2e1546] = _0x1b73e7[_0x2e1546], delete _0x1b73e7[_0x2e1546]);
    });
    delete _0x1b73e7["generationParams"];
    delete _0x1b73e7["generationParamsByModel"];
    const _0x1bf78d = sanitizeModelUiSchemaParams(_0x45145, {
      ..._0x559b30,
      ..._0x43c347,
      ..._0x2c6792,
      ..._0x542f31
    }, {
      'includeDefaults': !![]
    });
    if (_0x45145) {
      _0x11bf99[_0x45145] = _0x1bf78d;
    }
    const _0x678220 = {
      ..._0x1af26d,
      'selectionMode': !![],
      'imageModel': _0x45145,
      'imageProvider': _0x27568d,
      'imageProviderProfileId': _0x1b73e7["providerProfileId"] || _0x1af26d["imageProviderProfileId"] || '',
      'updatedAt': Date['now']()
    };
    const _0x2ca488 = _0x1bf78d['aspectRatio'] || _0x1b73e7["aspectRatio"] || _0x2c14b5?.["aspectRatio"];
    return {
      ..._0x1b73e7,
      'model': _0x45145,
      'provider': _0x27568d,
      ...(_0x2ca488 ? {
        'aspectRatio': _0x2ca488
      } : {}),
      'generationParams': _0x1bf78d,
      'generationParamsByModel': _0x11bf99,
      'storyboardScript': _0x678220
    };
  }
  ["_bindStoryboardImageModelMenu"](_0x55f99c) {
    if (!_0x55f99c || this["_storyboardImageModelMenuBound"]) {
      return;
    }
    const _0x26dce5 = this["_promptPanelEl"]?.['querySelector'](".img-model-btn-trigger");
    const _0x8bb11b = this["_promptPanelEl"]?.['querySelector'](".img-model-label");
    const _0x5ee626 = {
      'modelMenu': _0x55f99c,
      'modelTrigger': _0x26dce5,
      'modelLabel': _0x8bb11b,
      'nodeId': this["nodeId"],
      'store': a542_0x3b634e,
      'fallbackNodeData': this["_data"],
      'buildModelPatch': (..._0x1d3a63) => this["_buildStoryboardImageModelPatch"](..._0x1d3a63)
    };
    bindImageModelMenuSubmenu({
      ..._0x5ee626,
      'toggleSelector': "[data-grsai-toggle]",
      'submenuSelector': ".grsai-submenu",
      'defaultProvider': "grsai",
      'resolveSelection': resolveGrsaiImageMenuSelection,
      'afterSelect': ({
        item: _0x2a23f2
      }) => setImageModelTriggerIcon(_0x26dce5, "grsai", _0x2a23f2)
    });
    bindImageModelMenuSubmenu({
      ..._0x5ee626,
      'toggleSelector': "[data-ppio-toggle]",
      'submenuSelector': ".ppio-submenu",
      'defaultProvider': "ppio",
      'afterSelect': ({
        item: _0x5cfb55
      }) => setImageModelTriggerIcon(_0x26dce5, "ppio", _0x5cfb55)
    });
    bindDreaminaImageMenu(_0x5ee626);
    bindImageModelMenuSubmenu({
      ..._0x5ee626,
      'toggleSelector': '[data-apimart-toggle]',
      'submenuSelector': ".apimart-submenu",
      'defaultProvider': "apimart",
      'resolveSelection': resolveApimartImageMenuSelection,
      'afterSelect': ({
        item: _0x234f6a
      }) => setImageModelTriggerIcon(_0x26dce5, "apimart", _0x234f6a)
    });
    bindImageModelMenuSubmenu({
      ..._0x5ee626,
      'toggleSelector': "[data-agnes-toggle]",
      'submenuSelector': ".agnes-submenu",
      'defaultProvider': "agnes",
      'afterSelect': ({
        item: _0x82fa22
      }) => setImageModelTriggerIcon(_0x26dce5, 'agnes', _0x82fa22)
    });
    bindImageModelMenuSubmenu({
      ..._0x5ee626,
      'toggleSelector': "[data-volcengine-toggle]",
      'submenuSelector': ".volcengine-submenu",
      'defaultProvider': "volcengine",
      'resolveSelection': resolveVolcengineImageMenuSelection,
      'afterSelect': ({
        item: _0x3db0cf
      }) => setImageModelTriggerIcon(_0x26dce5, "volcengine", _0x3db0cf)
    });
    bindImageModelMenuSubmenu({
      ..._0x5ee626,
      'toggleSelector': "[data-runninghubwf-toggle]",
      'submenuSelector': '.runninghubwf-submenu',
      'defaultProvider': "runninghubwf",
      'resolveSelection': resolveRunningHubWorkflowImageMenuSelection,
      'afterSelect': ({
        item: _0x141a2c
      }) => setImageModelTriggerIcon(_0x26dce5, "runninghubwf", _0x141a2c)
    });
    bindImageModelMenuSubmenu({
      ..._0x5ee626,
      'toggleSelector': "[data-runninghub-toggle]",
      'submenuSelector': ".runninghub-submenu",
      'defaultProvider': "runninghub",
      'resolveSelection': resolveRunningHubModelImageMenuSelection,
      'afterSelect': ({
        item: _0x19614c,
        provider: _0xe72a
      }) => setImageModelTriggerIcon(_0x26dce5, _0xe72a, _0x19614c)
    });
    this['_storyboardImageModelMenuBound'] = !![];
  }
  ["_ensureStoryboardImageModelMenu"]() {
    if (this["_storyboardImageModelMenu"]?.["isConnected"]) {
      return this["_storyboardImageModelMenu"];
    }
    const _0x329025 = this['_promptPanelEl']?.["querySelector"]('.img-model-wrap');
    if (!_0x329025) {
      return null;
    }
    const _0x42f211 = this["_getScriptState"]();
    const _0x1ceef0 = normalizeDreaminaImageModel(_0x42f211['imageModel'] || DEFAULT_IMAGE_NODE_MODEL, _0x42f211["imageProvider"] || DEFAULT_IMAGE_NODE_PROVIDER);
    const _0x5b64d5 = document["createElement"]("template");
    _0x5b64d5["innerHTML"] = buildImageModelMenuHTML({
      'activeModel': _0x1ceef0,
      'nanoSelection': getNanoBananaSelectionFromModel(_0x1ceef0, _0x42f211["imageProvider"] || DEFAULT_IMAGE_NODE_PROVIDER)
    })["trim"]();
    const _0x244044 = _0x5b64d5["content"]["firstElementChild"];
    if (!_0x244044) {
      return null;
    }
    _0x244044["classList"]["add"]("storyboard-image-model-menu");
    _0x329025["style"]["position"] = _0x329025['style']["position"] || 'relative';
    _0x329025["appendChild"](_0x244044);
    this["_storyboardImageModelMenu"] = _0x244044;
    this["_storyboardImageModelMenuBound"] = ![];
    this['_bindStoryboardImageModelMenu'](_0x244044);
    return _0x244044;
  }
  ["_toggleStoryboardImageModelMenu"]() {
    const _0xeded87 = this["_promptPanelEl"]?.["querySelector"]('.prompt-panel-footer');
    const _0x2c5ec3 = this['_ensureStoryboardImageModelMenu']();
    if (!_0x2c5ec3) {
      return;
    }
    const _0x22e2c3 = !_0x2c5ec3["classList"]['contains']("show");
    closeNodeFooterMenus(_0xeded87 || this['_promptPanelEl'], _0x2c5ec3);
    _0x2c5ec3["classList"]['toggle']("show", _0x22e2c3);
    if (_0x22e2c3) {
      activateMenuKeyboard(_0x2c5ec3);
    }
  }
  ['_installSelectionCountIndicator']() {
    const _0x1e9186 = this["_promptPanelEl"]?.["querySelector"]('.prompt-actions');
    const _0x63fad0 = _0x1e9186?.["querySelector"](".debug-wrench-btn");
    if (!_0x1e9186 || !_0x63fad0) {
      return;
    }
    this['_selectionCountEl'] = document['createElement']("div");
    this["_selectionCountEl"]["className"] = "storyboard-script-selection-count";
    this["_selectionCountEl"]["textContent"] = "0/0";
    this["_selectionCountEl"]["setAttribute"]("aria-label", storyboardScriptText("selectionCount", {
      'selected': 0x0,
      'total': 0x0
    }));
    _0x1e9186["insertBefore"](this["_selectionCountEl"], _0x63fad0);
  }
  ["_installStoryboardQueueButton"]() {
    const _0x204e1e = this["_promptPanelEl"]?.["querySelector"]('.prompt-actions');
    if (!_0x204e1e || !this["btnEl"] || this["_queueBtn"]) {
      return;
    }
    const _0x53232e = document["createElement"]("button");
    _0x53232e["type"] = "button";
    _0x53232e["className"] = "prompt-submit storyboard-script-queue-btn";
    _0x53232e["title"] = storyboardScriptText("toolbar.queue");
    _0x53232e["setAttribute"]("aria-label", storyboardScriptText('toolbar.queue'));
    _0x53232e["innerHTML"] = STORYBOARD_QUEUE_ICON_HTML;
    _0x53232e["hidden"] = !![];
    _0x53232e["addEventListener"]("click", _0xed3fbf => {
      _0xed3fbf["stopPropagation"]();
      this["_flushPromptHtmlCommit"]?.();
      this["_createImageNodesFromSelectedStoryboards"]({
        'startGeneration': ![]
      });
    });
    _0x204e1e["insertBefore"](_0x53232e, this['btnEl']);
    this["_queueBtn"] = _0x53232e;
  }
  ["_createModeButton"](_0x516001, _0x1818d6) {
    const _0x14b072 = document["createElement"]("button");
    _0x14b072["type"] = 'button';
    _0x14b072["className"] = "storyboard-script-view-btn";
    _0x14b072["dataset"]['mode'] = _0x516001;
    _0x14b072["textContent"] = _0x1818d6;
    _0x14b072["addEventListener"]("pointerdown", _0x22bd97 => {
      _0x22bd97["stopPropagation"]();
    });
    _0x14b072["addEventListener"]('dblclick', _0x46723d => {
      _0x46723d['stopPropagation']();
    });
    _0x14b072["addEventListener"]("click", _0x1153b0 => {
      _0x1153b0['stopPropagation']();
      this["_setViewMode"](_0x516001);
    });
    return _0x14b072;
  }
  ['_createMediaModeButton'](_0x40301e, _0x5b77fc) {
    const _0xc2e3d0 = document["createElement"]("button");
    _0xc2e3d0["type"] = 'button';
    _0xc2e3d0["className"] = "storyboard-script-view-btn storyboard-script-media-btn";
    _0xc2e3d0["dataset"]["mediaMode"] = _0x40301e;
    _0xc2e3d0['textContent'] = _0x5b77fc;
    _0xc2e3d0["addEventListener"]("pointerdown", _0x14c907 => {
      _0x14c907["stopPropagation"]();
    });
    _0xc2e3d0["addEventListener"]("dblclick", _0x451f64 => {
      _0x451f64['stopPropagation']();
    });
    _0xc2e3d0["addEventListener"]('click', _0x3d94d2 => {
      _0x3d94d2["stopPropagation"]();
      this["_setMediaMode"](_0x40301e);
    });
    return _0xc2e3d0;
  }
  ["_getScriptState"]() {
    return createDefaultStoryboardScriptState(this['_data']["storyboardScript"] || {});
  }
  ["_syncSelectionModeUi"](_0x2c4b8c = this['_getScriptState']()) {
    const _0x54adfc = Array['isArray'](_0x2c4b8c["rows"]) ? _0x2c4b8c['rows']["length"] : 0x0;
    const _0x195308 = getSelectedRowIndexes(_0x2c4b8c);
    const _0x32894a = _0x54adfc > 0x0 && _0x2c4b8c['selectionMode'] === !![];
    const _0x410866 = _0x32894a ? storyboardScriptText("toolbar.exitEdit") : storyboardScriptText("toolbar.editMode");
    const _0x1a532f = _0x32894a ? _0x2c4b8c["imageModel"] || DEFAULT_IMAGE_NODE_MODEL : resolveStoryboardScriptTextModel({
      'storyboardScript': _0x2c4b8c
    });
    const _0x31d7b9 = _0x32894a ? _0x2c4b8c['imageProvider'] || DEFAULT_IMAGE_NODE_PROVIDER : resolveStoryboardScriptTextProvider({
      'storyboardScript': _0x2c4b8c
    });
    this["_promptPanelEl"]?.['classList']["toggle"]("is-storyboard-image-mode", _0x32894a);
    this["_queueBtn"] && (this["_queueBtn"]['hidden'] = !_0x32894a);
    this['el']?.["classList"]['toggle']("has-storyboard-rows", _0x54adfc > 0x0);
    this['el']?.["classList"]['toggle']("is-storyboard-selection-mode", _0x32894a);
    this["_toolbarGenerateBtn"]?.['classList']["toggle"]("active", _0x32894a);
    setToolbarButtonLabel(this["_toolbarGenerateBtn"], _0x410866);
    this["_promptPanelEl"]?.['querySelector'](".node-model-menu")?.["classList"]["toggle"]("is-storyboard-text-menu-hidden", _0x32894a);
    !_0x32894a && this['_storyboardImageModelMenu']?.["classList"]['remove']("show");
    const _0x2212cd = this['_promptPanelEl']?.["querySelector"](".img-model-btn-trigger");
    const _0x2afe72 = this["_promptPanelEl"]?.['querySelector'](".img-model-label");
    const _0x5958b5 = getDisplayModelName(_0x1a532f);
    _0x2afe72 && _0x2afe72["textContent"] !== _0x5958b5 && (_0x2afe72["textContent"] = _0x5958b5);
    _0x32894a ? replaceModelTriggerIcon(_0x2212cd, renderImageModelTriggerIconHTML({
      'model': _0x1a532f,
      'provider': _0x31d7b9
    })) : replaceModelTriggerIcon(_0x2212cd, buildTextModelSmallIconHTML(_0x1a532f) || '<div\x20class=\x22text-model-icon-small\x20text-model-icon-badge\x22>AI</div>');
    this["_selectionCountEl"] && (this["_selectionCountEl"]["textContent"] = _0x195308["length"] + '/' + _0x54adfc, this["_selectionCountEl"]['setAttribute']("aria-label", storyboardScriptText("selectionCount", {
      'selected': _0x195308['length'],
      'total': _0x54adfc
    })), this["_selectionCountEl"]["hidden"] = !_0x32894a);
    this["_syncStoryboardImageSchemaControls"](_0x2c4b8c);
  }
  ["_enterSelectionMode"]() {
    this["_finishCellEdit"]({
      'commit': !![]
    });
    const _0x27c3a1 = this["_getScriptState"]();
    if (!Array['isArray'](_0x27c3a1["rows"]) || _0x27c3a1["rows"]["length"] === 0x0) {
      window['showToast']?.(storyboardScriptText("toasts.generateScriptFirst"), "warn");
      return;
    }
    const _0x5b3a5a = _0x27c3a1["imageModel"] || DEFAULT_IMAGE_NODE_MODEL;
    const _0x13baa2 = _0x27c3a1['imageProvider'] || DEFAULT_IMAGE_NODE_PROVIDER;
    const _0x122124 = a542_0x3b634e["getState"]?.()["nodes"]?.[this["nodeId"]] || this["_data"];
    const _0x27e023 = this['_buildStoryboardImageModelPatch'](_0x122124, _0x5b3a5a, _0x13baa2);
    const _0x2f3d56 = {
      ..._0x27e023["storyboardScript"],
      'viewMode': "list",
      'selectionMode': !![],
      'selectedRowIndexes': getSelectedRowIndexes(_0x27c3a1),
      'updatedAt': Date["now"]()
    };
    this["_data"] = {
      ...this["_data"],
      ..._0x27e023,
      'storyboardScript': _0x2f3d56
    };
    a542_0x3b634e["updateNodeData"](this["nodeId"], {
      ..._0x27e023,
      'storyboardScript': _0x2f3d56
    });
  }
  ["_cancelSelectionMode"]() {
    let _0x380755 = this["_getScriptState"]();
    if (_0x380755["selectionMode"] !== !![]) {
      return;
    }
    this["_finishCellEdit"]({
      'commit': !![]
    });
    _0x380755 = this["_getScriptState"]();
    const _0x439a26 = resolveStoryboardScriptTextModel({
      'storyboardScript': _0x380755
    });
    const _0x1124b0 = resolveStoryboardScriptTextProvider({
      'storyboardScript': _0x380755
    });
    const _0x3ffcf3 = {
      ..._0x380755,
      'selectionMode': ![],
      'selectedRowIndexes': [],
      'updatedAt': Date["now"]()
    };
    this["_data"] = {
      ...this["_data"],
      'model': _0x439a26,
      'provider': _0x1124b0,
      'storyboardScript': _0x3ffcf3
    };
    a542_0x3b634e['updateNodeData'](this["nodeId"], {
      'model': _0x439a26,
      'provider': _0x1124b0,
      'storyboardScript': _0x3ffcf3
    });
  }
  ["_updateSelectedRowIndexes"](_0x23ae5c) {
    const _0x295622 = this['_getScriptState']();
    const _0x1fab7c = normalizeStoryboardScriptSelectedRowIndexes(_0x23ae5c, _0x295622["rows"]['length']);
    const _0x14d069 = {
      ..._0x295622,
      'selectedRowIndexes': _0x1fab7c,
      'updatedAt': Date["now"]()
    };
    this["_data"] = {
      ...this["_data"],
      'storyboardScript': _0x14d069
    };
    this['_syncListSelectionState'](_0x14d069);
    a542_0x3b634e["updateNodeData"](this["nodeId"], {
      'storyboardScript': _0x14d069
    });
  }
  ["_toggleRowSelection"](_0x241405, _0x2930c6) {
    const _0xde3829 = this["_getScriptState"]();
    const _0x42a528 = new Set(getSelectedRowIndexes(_0xde3829));
    if (_0x2930c6) {
      _0x42a528["add"](_0x241405);
    } else {
      _0x42a528["delete"](_0x241405);
    }
    this["_updateSelectedRowIndexes"]([..._0x42a528]["sort"]((_0x2ed326, _0x1dc49e) => _0x2ed326 - _0x1dc49e));
  }
  ['_setAllRowsSelected'](_0x4a666d) {
    const _0x4c2132 = this["_getScriptState"]();
    const _0x31815f = _0x4a666d ? _0x4c2132["rows"]["map"]((_0x2b4458, _0x59dd13) => _0x59dd13) : [];
    this['_updateSelectedRowIndexes'](_0x31815f);
  }
  ["_setViewMode"](_0x3c86d5) {
    this['_finishCellEdit']({
      'commit': !![]
    });
    const _0x6850ec = normalizeStoryboardScriptViewMode(_0x3c86d5);
    const _0x5b0301 = this["_getScriptState"]();
    if (_0x5b0301["viewMode"] === _0x6850ec) {
      return;
    }
    a542_0x3b634e["updateNodeData"](this["nodeId"], {
      'storyboardScript': {
        ..._0x5b0301,
        'viewMode': _0x6850ec
      }
    });
  }
  ['_setMediaMode'](_0x5eb1c3) {
    this["_finishCellEdit"]({
      'commit': !![]
    });
    const _0x2c7e6b = normalizeStoryboardScriptMediaMode(_0x5eb1c3);
    const _0x5c25f5 = this["_getScriptState"]();
    if (_0x5c25f5["mediaMode"] === _0x2c7e6b) {
      return;
    }
    a542_0x3b634e["updateNodeData"](this["nodeId"], {
      'storyboardScript': {
        ..._0x5c25f5,
        'mediaMode': _0x2c7e6b,
        'updatedAt': Date["now"]()
      }
    });
  }
  ["_syncModeButtons"](_0x26de6f, _0x441edf) {
    [this["_listBtn"], this["_cardBtn"]]["forEach"](_0x2b5a1c => {
      if (!_0x2b5a1c) {
        return;
      }
      const _0x1555a6 = _0x2b5a1c["dataset"]["mode"] === _0x26de6f;
      _0x2b5a1c["classList"]["toggle"]("is-active", _0x1555a6);
      _0x2b5a1c['setAttribute']("aria-pressed", _0x1555a6 ? 'true' : "false");
    });
    const _0x1f8827 = normalizeStoryboardScriptMediaMode(_0x441edf);
    [this["_imageModeBtn"], this["_videoModeBtn"]]["forEach"](_0x33bbb4 => {
      if (!_0x33bbb4) {
        return;
      }
      const _0x30e950 = _0x33bbb4['dataset']["mediaMode"] === _0x1f8827;
      _0x33bbb4['classList']["toggle"]("is-active", _0x30e950);
      _0x33bbb4["setAttribute"]("aria-pressed", _0x30e950 ? "true" : 'false');
    });
  }
  ["_isStoryboardScriptGenerating"](_0x5c0d41 = null) {
    const _0x2fb05d = a542_0x3b634e["getState"]?.()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
    const _0x1ff8b0 = _0x5c0d41 || createDefaultStoryboardScriptState(_0x2fb05d["storyboardScript"] || this['_data']["storyboardScript"] || {});
    return this["_isGeneratingScript"] || _0x2fb05d["isGenerating"] === !![] || _0x1ff8b0["isGenerating"] === !![] || String(_0x1ff8b0['jobStatus'] || _0x2fb05d["jobStatus"] || '') === "running";
  }
  ["_syncGeneratingOverlay"](_0x507637) {
    if (!this["_bodyEl"]) {
      return;
    }
    const _0x5cef11 = _0x507637 === !![];
    this['el']?.["classList"]?.["toggle"]("is-storyboard-script-generating", _0x5cef11);
    this["_bodyEl"]["classList"]["toggle"]("is-generating", _0x5cef11);
    this['_bodyEl']["setAttribute"]("aria-busy", _0x5cef11 ? "true" : 'false');
    const _0x40b161 = this['_bodyEl']['querySelector'](".storyboard-script-loading-overlay");
    if (!_0x5cef11) {
      _0x40b161?.["remove"]();
      return;
    }
    if (_0x40b161) {
      return;
    }
    this["_bodyEl"]["appendChild"](createStoryboardScriptLoadingOverlay());
  }
  ['_setStoryboardGeneratingState'](_0x5a73f6, _0x3881be = {}) {
    const _0x13a452 = this["_getScriptState"]();
    const _0x2832b4 = {
      ..._0x13a452,
      ..._0x3881be,
      'isGenerating': _0x5a73f6 === !![],
      'jobStatus': _0x5a73f6 === !![] ? "running" : _0x3881be['jobStatus'] || '',
      'updatedAt': Date["now"]()
    };
    this["_data"] = {
      ...this["_data"],
      'storyboardScript': _0x2832b4
    };
    a542_0x3b634e["updateNodeData"](this["nodeId"], {
      'storyboardScript': _0x2832b4
    });
  }
  ["_showStoryboardLoadingOverlayImmediately"]() {
    if (this["_isGeneratingScript"]) {
      return;
    }
    const _0x3bc6bd = this["_getScriptState"]();
    if (_0x3bc6bd["selectionMode"] === !![]) {
      return;
    }
    this['_isGeneratingScript'] = !![];
    this['_isPromptGenerateLoadingPrimed'] = !![];
    this["_setStoryboardGeneratingState"](!![]);
    this['_syncGeneratingOverlay'](!![]);
  }
  ["_bindPromptGenerateImmediateLoading"]() {
    const _0x425b21 = this['btnEl'];
    if (!(_0x425b21 instanceof HTMLElement)) {
      return;
    }
    _0x425b21['addEventListener']("click", () => {
      if (_0x425b21["disabled"]) {
        return;
      }
      this['_showStoryboardLoadingOverlayImmediately']();
    }, {
      'capture': !![]
    });
  }
  ["_getEffectiveSubmitPromptText"]() {
    return this["_getStoryboardSubmitInput"]()["promptText"];
  }
  ['_getStoryboardSubmitInput'](_0x2b4cee = null) {
    const _0x4fe90c = a542_0x3b634e['getState']();
    const _0x41067d = _0x4fe90c["nodes"] || {};
    const _0x43cd0d = _0x41067d?.[this['nodeId']] || this["_data"] || {};
    const _0x15bcc1 = a542_0x3b634e["getIncomingEdges"](this["nodeId"]);
    const _0x58b1c2 = collectDirectStoryboardImageRefs(_0x15bcc1, _0x41067d);
    const _0x5b2cef = collectDirectStoryboardVideoRefs(_0x15bcc1, _0x41067d);
    const _0x4599af = [];
    const _0x5bb1ee = {
      'image': _0x58b1c2["length"],
      'video': _0x5b2cef["length"],
      'audio': 0x0
    };
    const _0x3039db = _0x2b4cee == null ? resolvePromptTextWithTextRefs : resolvePresetPromptTextWithTextRefs;
    const _0x363ad5 = _0x3039db({
      'template': _0x2b4cee,
      'promptEl': this["promptEl"],
      'inEdges': _0x15bcc1,
      'nodes': _0x41067d,
      'assetInputRefs': _0x4599af,
      'assetMediaCounts': _0x5bb1ee,
      'allowedAssetTypes': ['text', "image", "video"]
    })["trim"]();
    const _0x3ab75f = getPromptAssetInputRefsFromNode(_0x43cd0d, {
      'allowedTypes': ["image", "video"]
    });
    const _0x28e377 = normalizeStoryboardImageInputRefs({
      'directImageRefs': _0x58b1c2,
      'promptAssetRefs': _0x4599af,
      'hiddenAssetRefs': _0x3ab75f
    });
    const _0x455fca = normalizeStoryboardVideoInputRefs({
      'directVideoRefs': _0x5b2cef,
      'promptAssetRefs': _0x4599af,
      'hiddenAssetRefs': _0x3ab75f
    });
    const _0x4f736c = _0x28e377["map"](_0x2765b9 => _0x2765b9["url"])["filter"](Boolean);
    const _0x2bd3b9 = _0x455fca["map"](_0x10b91d => _0x10b91d["url"])["filter"](Boolean);
    const _0x385651 = _0x4f736c["length"] > 0x0 && _0x2bd3b9["length"] > 0x0 ? 'multimodal' : _0x2bd3b9["length"] > 0x0 ? "video" : _0x4f736c["length"] > 0x0 ? "image" : "text";
    return {
      'promptText': _0x363ad5,
      'imageRefs': _0x28e377,
      'videoRefs': _0x455fca,
      'imageLabels': _0x28e377["map"](_0x5274b7 => _0x5274b7["label"]),
      'videoLabels': _0x455fca["map"](_0x2c046d => _0x2c046d["label"]),
      'inputUrls': [..._0x4f736c, ..._0x2bd3b9],
      'inputImageUrls': _0x4f736c,
      'inputVideoUrls': _0x2bd3b9,
      'sourceMode': _0x385651
    };
  }
  ['_updateSubmitButtonState']() {
    if (!this["btnEl"]) {
      return;
    }
    const _0x23939f = a542_0x3b634e["getState"]?.()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
    const _0x39c2d2 = createDefaultStoryboardScriptState(_0x23939f["storyboardScript"] || this["_data"]['storyboardScript'] || {});
    const _0x3b865a = resolveGenerationButtonMode({
      ..._0x23939f,
      'isGenerating': this["_isGeneratingScript"] || _0x23939f["isGenerating"] === !![] || _0x39c2d2["isGenerating"] === !![],
      'jobStatus': _0x39c2d2["jobStatus"] || _0x23939f["jobStatus"] || ''
    }, {
      'cancellable': _0x23939f["taskCancellable"] === !![]
    });
    const _0xe5e8ef = this['_getStoryboardSubmitInput']();
    const _0x378aa1 = _0xe5e8ef['promptText'];
    const _0x54c999 = _0x39c2d2["rows"]["length"] > 0x0 && _0x39c2d2["selectionMode"] === !![];
    const _0xff21f0 = _0x54c999 ? storyboardScriptText("toolbar.generateSelected") : storyboardScriptText("generate");
    const _0x455ed2 = getSelectedRowIndexes(_0x39c2d2)["length"];
    const _0x5817b7 = _0x54c999 ? _0x455ed2 > 0x0 : Boolean(_0x378aa1 || _0xe5e8ef["inputImageUrls"]['length'] > 0x0 || _0xe5e8ef["inputVideoUrls"]["length"] > 0x0);
    this['_syncGeneratingOverlay'](_0x3b865a["busy"]);
    this["_queueBtn"] && (this["_queueBtn"]['hidden'] = !_0x54c999, this["_queueBtn"]["disabled"] = !_0x54c999 || _0x455ed2 === 0x0 || _0x3b865a["busy"], this["_queueBtn"]["style"]["cursor"] = this['_queueBtn']["disabled"] ? 'var(--unavailable-cursor)' : '');
    this["_syncToolbarButtonState"]({
      'canGenerate': _0x39c2d2['rows']["length"] > 0x0 && !_0x3b865a["busy"] && !_0x3b865a['disabled'],
      'canDownload': Array["isArray"](_0x39c2d2["rows"]) && _0x39c2d2["rows"]["length"] > 0x0
    });
    if (_0x3b865a["busy"]) {
      setGenerateButtonLoadingUi(this["btnEl"], {
        'title': _0xff21f0,
        'disabled': _0x3b865a["disabled"],
        'ariaLabel': _0xff21f0
      });
      this["btnEl"]["disabled"] = _0x3b865a["disabled"];
      this["btnEl"]["style"]["cursor"] = _0x3b865a["cursor"];
      return;
    }
    resetGenerateButtonIdleUi(this['btnEl'], _0xff21f0);
    !_0x5817b7 ? (this["btnEl"]['disabled'] = !![], this["btnEl"]['style']["cursor"] = "var(--unavailable-cursor)") : (this["btnEl"]["disabled"] = ![], this["btnEl"]["style"]["cursor"] = '');
  }
  ["_syncToolbarButtonState"]({
    canGenerate: _0x4d806b,
    canDownload: _0x4994f7,
    canFullscreen: _0x3b7f67
  } = {}) {
    this["_toolbarGenerateBtn"] && (this["_toolbarGenerateBtn"]['disabled'] = _0x4d806b !== !![], this["_toolbarGenerateBtn"]['style']["cursor"] = _0x4d806b === !![] ? '' : "var(--unavailable-cursor)");
    if (this["_toolbarFullscreenBtn"]) {
      const _0x292a02 = (_0x3b7f67 ?? _0x4994f7) === !![];
      this["_toolbarFullscreenBtn"]['disabled'] = !_0x292a02;
      this["_toolbarFullscreenBtn"]["style"]["cursor"] = _0x292a02 ? '' : "var(--unavailable-cursor)";
    }
    this['_toolbarDownloadBtn'] && (this["_toolbarDownloadBtn"]["disabled"] = _0x4994f7 !== !![], this['_toolbarDownloadBtn']["style"]["cursor"] = _0x4994f7 === !![] ? '' : "var(--unavailable-cursor)");
  }
  ['_syncGenerateButtonState']() {
    this['_updateSubmitButtonState']();
  }
  ['_createFullscreenCloseButton']() {
    const _0x2b1eb0 = document["createElement"]("button");
    _0x2b1eb0["type"] = "button";
    _0x2b1eb0['className'] = "storyboard-script-fullscreen-close";
    _0x2b1eb0["setAttribute"]("aria-label", storyboardScriptText("fullscreen.close"));
    _0x2b1eb0["innerHTML"] = '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2218\x22\x20height=\x2218\x22><path\x20d=\x22M18\x206\x206\x2018\x22/><path\x20d=\x22m6\x206\x2012\x2012\x22/></svg>';
    _0x2b1eb0['addEventListener']("click", _0x24d22b => {
      _0x24d22b['stopPropagation']();
      this['_closeFullscreenScript']();
    });
    return _0x2b1eb0;
  }
  ["_openFullscreenScript"]() {
    this['_finishCellEdit']({
      'commit': !![]
    });
    const _0x19f909 = this["_getScriptState"]();
    if (!Array["isArray"](_0x19f909["rows"]) || _0x19f909["rows"]["length"] === 0x0) {
      window['showToast']?.(storyboardScriptText("toasts.noFullscreenData"), "warn");
      return;
    }
    if (this["_fullscreenOverlayEl"]) {
      this["_renderFullscreenContent"](_0x19f909);
      this["_fullscreenOverlayEl"]["querySelector"](".storyboard-script-fullscreen-close")?.["focus"]?.({
        'preventScroll': !![]
      });
      return;
    }
    const _0x470959 = document["createElement"]('div');
    _0x470959["className"] = "storyboard-script-fullscreen-overlay";
    _0x470959["setAttribute"]("role", 'dialog');
    _0x470959["setAttribute"]("aria-modal", "true");
    _0x470959["setAttribute"]("aria-label", storyboardScriptText("fullscreen.aria"));
    const _0x4b43e2 = document['createElement']('section');
    _0x4b43e2["className"] = "storyboard-script-fullscreen-panel";
    _0x4b43e2["addEventListener"]("pointerdown", _0x3d93e5 => {
      _0x3d93e5["stopPropagation"]();
    });
    _0x4b43e2["addEventListener"]("dblclick", _0x1f315e => {
      _0x1f315e["stopPropagation"]();
    });
    const _0x1e7e90 = document["createElement"]("header");
    _0x1e7e90['className'] = "storyboard-script-fullscreen-header";
    const _0x464ee1 = document["createElement"]('div');
    _0x464ee1["className"] = "storyboard-script-fullscreen-title-wrap";
    const _0x5137ea = document["createElement"]("div");
    _0x5137ea["className"] = "storyboard-script-fullscreen-title";
    _0x5137ea['textContent'] = _0x19f909['title'] || this["_data"]["name"] || getStoryboardScriptDefaultName();
    const _0x3091a7 = document["createElement"]("div");
    _0x3091a7["className"] = "storyboard-script-fullscreen-meta";
    _0x464ee1["appendChild"](_0x5137ea);
    _0x464ee1["appendChild"](_0x3091a7);
    _0x1e7e90["appendChild"](_0x464ee1);
    _0x1e7e90['appendChild'](this["_createFullscreenCloseButton"]());
    const _0x3c7044 = document["createElement"]('div');
    _0x3c7044["className"] = "storyboard-script-fullscreen-body";
    this["_bindFullscreenBodyInteractions"](_0x3c7044);
    _0x4b43e2['appendChild'](_0x1e7e90);
    _0x4b43e2["appendChild"](_0x3c7044);
    _0x470959["appendChild"](_0x4b43e2);
    _0x470959['addEventListener']("pointerdown", _0x167d25 => {
      _0x167d25["stopPropagation"]();
      if (_0x167d25["target"] === _0x470959) {
        this["_closeFullscreenScript"]();
      }
    });
    this["_onFullscreenKeydown"] = _0xb730b0 => {
      if (_0xb730b0['key'] !== "Escape") {
        return;
      }
      _0xb730b0["preventDefault"]();
      _0xb730b0["stopPropagation"]();
      this["_closeFullscreenScript"]();
    };
    document["addEventListener"]("keydown", this["_onFullscreenKeydown"], !![]);
    document["body"]["appendChild"](_0x470959);
    this["_fullscreenOverlayEl"] = _0x470959;
    this["_renderFullscreenContent"](_0x19f909);
    _0x470959["querySelector"](".storyboard-script-fullscreen-close")?.['focus']?.({
      'preventScroll': !![]
    });
  }
  ["_closeFullscreenScript"]() {
    this['_finishCellEdit']({
      'commit': !![]
    });
    this["_onFullscreenKeydown"] && (document['removeEventListener']('keydown', this["_onFullscreenKeydown"], !![]), this['_onFullscreenKeydown'] = null);
    this["_fullscreenOverlayEl"]?.["remove"]();
    this['_fullscreenOverlayEl'] = null;
  }
  ["_bindFullscreenBodyInteractions"](_0x39abfc) {
    if (!(_0x39abfc instanceof HTMLElement)) {
      return;
    }
    _0x39abfc['addEventListener']('wheel', _0xa656de => {
      _0xa656de["stopPropagation"]();
    }, {
      'passive': ![]
    });
    _0x39abfc["addEventListener"]("pointerdown", _0x33bb42 => {
      const _0x2eb344 = _0x33bb42["target"] instanceof Element ? _0x33bb42['target'] : _0x33bb42["target"]?.["parentElement"];
      const _0x3ffba3 = _0x2eb344?.['closest']?.('[data-storyboard-edit-key]');
      if (!_0x3ffba3 || !_0x39abfc["contains"](_0x3ffba3)) {
        return;
      }
      this['_beginCellEdit'](_0x3ffba3, {
        'focus': ![],
        'selectAll': ![]
      });
    }, {
      'capture': !![]
    });
    _0x39abfc["addEventListener"]("pointerdown", _0x571464 => {
      _0x571464["stopPropagation"]();
    });
    _0x39abfc['addEventListener']('dblclick', _0x8de4dd => {
      const _0x2d596d = _0x8de4dd["target"] instanceof Element ? _0x8de4dd["target"] : _0x8de4dd['target']?.["parentElement"];
      const _0x322745 = _0x2d596d?.['closest']?.("[data-storyboard-edit-key]");
      _0x8de4dd["preventDefault"]();
      _0x8de4dd["stopPropagation"]();
      if (!_0x322745 || !_0x39abfc["contains"](_0x322745)) {
        return;
      }
      this["_beginCellEdit"](_0x322745);
    });
  }
  ["_renderFullscreenContent"](_0x30693e = this["_getScriptState"](), _0x37ba54 = null) {
    if (!this["_fullscreenOverlayEl"]) {
      return;
    }
    const _0x228558 = this["_fullscreenOverlayEl"]["querySelector"](".storyboard-script-fullscreen-body");
    if (!(_0x228558 instanceof HTMLElement)) {
      return;
    }
    const _0x593abf = Array["isArray"](_0x30693e["rows"]) ? _0x30693e["rows"] : [];
    const _0x21fc68 = _0x228558["querySelector"](".storyboard-script-table-wrap, .storyboard-script-card-grid");
    const _0x261750 = _0x21fc68 ? {
      'left': _0x21fc68['scrollLeft'] || 0x0,
      'top': _0x21fc68["scrollTop"] || 0x0
    } : null;
    const _0x54927d = _0x37ba54 || mergeStoryboardImageRefs(this["_getStoryboardSubmitInput"]()['imageRefs'], _0x30693e["referenceImageRefs"]);
    const _0x163910 = this["_fullscreenOverlayEl"]["querySelector"](".storyboard-script-fullscreen-title");
    _0x163910 && (_0x163910["textContent"] = _0x30693e["title"] || this["_data"]["name"] || getStoryboardScriptDefaultName());
    const _0x114411 = this["_fullscreenOverlayEl"]["querySelector"](".storyboard-script-fullscreen-meta");
    if (_0x114411) {
      const _0x151365 = normalizeStoryboardScriptViewMode(_0x30693e["viewMode"]) === "card" ? storyboardScriptText("viewMode.card") : storyboardScriptText('viewMode.list');
      const _0x5f1c42 = normalizeStoryboardScriptMediaMode(_0x30693e['mediaMode']) === 'video' ? storyboardScriptText("mediaMode.video") : storyboardScriptText("mediaMode.image");
      _0x114411["textContent"] = storyboardScriptText("fullscreen.meta", {
        'count': _0x593abf['length'],
        'media': _0x5f1c42,
        'view': _0x151365
      });
    }
    _0x228558["replaceChildren"]();
    if (_0x593abf['length'] === 0x0) {
      _0x228558['appendChild'](this["_createEmptyState"]());
      return;
    }
    const _0x4eeb0b = buildStoryboardImageRefMap(_0x54927d);
    const _0x8aee93 = normalizeStoryboardScriptViewMode(_0x30693e["viewMode"]) === "card" ? this["_createCardView"](_0x593abf, getStoryboardCardFieldsForMediaMode(_0x30693e['mediaMode'], _0x593abf), _0x4eeb0b) : this['_createListView'](_0x593abf, getStoryboardColumnsForMediaMode(_0x30693e["mediaMode"], _0x593abf), _0x4eeb0b, {
      'selectionMode': ![]
    });
    _0x8aee93["classList"]['add']("storyboard-script-fullscreen-scroller");
    _0x228558['appendChild'](_0x8aee93);
    if (_0x261750) {
      const _0xb2faa3 = () => {
        _0x8aee93["scrollLeft"] = Math["max"](0x0, _0x261750["left"]);
        _0x8aee93["scrollTop"] = Math["max"](0x0, _0x261750["top"]);
      };
      _0xb2faa3();
      typeof window !== 'undefined' && typeof window['requestAnimationFrame'] === 'function' && window["requestAnimationFrame"](_0xb2faa3);
    }
  }
  ["_renderRefBar"]() {
    _renderSharedRefBar(this);
  }
  ["_bindBodyInteractions"]() {
    if (!this["_bodyEl"]) {
      return;
    }
    this['_bodyEl']['addEventListener']("wheel", _0x3509ac => {
      _0x3509ac["stopPropagation"]();
    }, {
      'passive': ![]
    });
    this["_bodyEl"]["addEventListener"]("pointerdown", _0x27b930 => {
      const _0x223eb5 = this['_getScriptState']();
      if (_0x223eb5["selectionMode"] !== !![]) {
        return;
      }
      const _0x47f7d4 = _0x27b930['target'] instanceof Element ? _0x27b930["target"] : _0x27b930["target"]?.["parentElement"];
      const _0x295b96 = _0x47f7d4?.["closest"]?.("[data-storyboard-edit-key]");
      if (!_0x295b96 || !this["_bodyEl"]["contains"](_0x295b96)) {
        return;
      }
      this["_beginCellEdit"](_0x295b96, {
        'focus': ![],
        'selectAll': ![]
      });
    }, {
      'capture': !![]
    });
    this["_bodyEl"]["addEventListener"]("pointerdown", _0x568233 => {
      const _0x319f3f = this['_getScriptState']();
      if (_0x319f3f["selectionMode"] !== !![]) {
        return;
      }
      _0x568233['stopPropagation']();
    });
    this["_bodyEl"]["addEventListener"]("dblclick", _0x140618 => {
      const _0x3a963e = _0x140618["target"] instanceof Element ? _0x140618['target'] : _0x140618["target"]?.["parentElement"];
      const _0xcd8031 = _0x3a963e?.["closest"]?.("[data-storyboard-edit-key]");
      _0x140618['preventDefault']();
      _0x140618['stopPropagation']();
      const _0xfea6ed = this['_getScriptState']();
      if (_0xfea6ed['selectionMode'] !== !![]) {
        this["_enterSelectionMode"]();
        return;
      }
      if (!_0xcd8031 || !this["_bodyEl"]['contains'](_0xcd8031)) {
        return;
      }
      this["_beginCellEdit"](_0xcd8031);
    });
  }
  ["_beginCellEdit"](_0x14881c, {
    focus = !![],
    selectAll = !![]
  } = {}) {
    if (!(_0x14881c instanceof HTMLElement)) {
      return;
    }
    if (this["_activeCellEdit"]?.["target"] === _0x14881c) {
      return;
    }
    this["_finishCellEdit"]({
      'commit': !![]
    });
    const _0x21d6a5 = Number(_0x14881c["dataset"]['storyboardRowIndex']);
    const _0x51bf99 = String(_0x14881c["dataset"]["storyboardEditKey"] || '');
    if (!Number["isInteger"](_0x21d6a5) || _0x21d6a5 < 0x0 || !_0x51bf99) {
      return;
    }
    const _0x29a20c = _0x14881c["dataset"]["storyboardRawValue"] ?? _0x14881c["textContent"] ?? '';
    const _0x5a4709 = _0x3f0a46 => _0x3f0a46["stopPropagation"]();
    const _0x558d6b = _0x5ef30d => _0x5ef30d["stopPropagation"]();
    const _0x34d0e4 = _0x1415a7 => {
      _0x1415a7["stopPropagation"]();
      if (_0x1415a7["key"] === "Enter" && !_0x1415a7["shiftKey"]) {
        _0x1415a7["preventDefault"]();
        this['_finishCellEdit']({
          'commit': !![]
        });
      } else {
        _0x1415a7["key"] === "Escape" && (_0x1415a7["preventDefault"](), this['_finishCellEdit']({
          'commit': ![]
        }));
      }
    };
    const _0x1a83fc = () => this["_finishCellEdit"]({
      'commit': !![]
    });
    const _0xc0cbab = () => {
      _0x14881c['removeEventListener']("pointerdown", _0x5a4709);
      _0x14881c['removeEventListener']('dblclick', _0x558d6b);
      _0x14881c["removeEventListener"]("keydown", _0x34d0e4);
      _0x14881c["removeEventListener"]("blur", _0x1a83fc);
    };
    this["_activeCellEdit"] = {
      'target': _0x14881c,
      'rowIndex': _0x21d6a5,
      'key': _0x51bf99,
      'originalText': _0x29a20c,
      'cleanup': _0xc0cbab
    };
    _0x14881c["textContent"] = _0x29a20c;
    _0x14881c['classList']["remove"]('storyboard-script-image-cell');
    _0x14881c['classList']["add"]('is-editing');
    _0x14881c["contentEditable"] = "true";
    _0x14881c["spellcheck"] = ![];
    _0x14881c["addEventListener"]("pointerdown", _0x5a4709);
    _0x14881c["addEventListener"]("dblclick", _0x558d6b);
    _0x14881c['addEventListener']("keydown", _0x34d0e4);
    _0x14881c["addEventListener"]("blur", _0x1a83fc);
    focus && _0x14881c["focus"]({
      'preventScroll': !![]
    });
    const _0x2285d0 = selectAll ? window["getSelection"]?.() : null;
    if (_0x2285d0) {
      const _0x3abf7c = document['createRange']();
      _0x3abf7c["selectNodeContents"](_0x14881c);
      _0x2285d0["removeAllRanges"]();
      _0x2285d0["addRange"](_0x3abf7c);
    }
  }
  ["_finishCellEdit"]({
    commit: _0x4af371
  }) {
    const _0x147910 = this["_activeCellEdit"];
    if (!_0x147910) {
      return;
    }
    this["_activeCellEdit"] = null;
    _0x147910['cleanup']?.();
    _0x147910["target"]["classList"]['remove']('is-editing');
    _0x147910["target"]["removeAttribute"]("contenteditable");
    _0x147910["target"]['spellcheck'] = ![];
    if (!_0x4af371) {
      this["_restoreEditedCellDisplay"](_0x147910["target"], _0x147910["key"], _0x147910['originalText']);
      return;
    }
    const _0xba4797 = String(_0x147910['target']["textContent"] || '')["replace"](/\u00a0/g, '\x20')["trim"]();
    if (_0xba4797 !== _0x147910["originalText"]) {
      this["_restoreEditedCellDisplay"](_0x147910["target"], _0x147910['key'], _0xba4797);
      this["_updateCellValue"](_0x147910['rowIndex'], _0x147910['key'], _0xba4797);
    } else {
      (_0x147910["key"] === '角色图' || _0x147910["key"] === '参考') && this["_restoreEditedCellDisplay"](_0x147910["target"], _0x147910["key"], _0x147910["originalText"]);
    }
  }
  ["_restoreEditedCellDisplay"](_0x41b85e, _0x1a4ad8, _0x283efb) {
    if (!(_0x41b85e instanceof HTMLElement)) {
      return;
    }
    const _0x90ceaa = this["_getScriptState"]();
    const _0x3da37f = this["_getStoryboardSubmitInput"]();
    const _0x8b793c = buildStoryboardImageRefMap(mergeStoryboardImageRefs(_0x3da37f["imageRefs"], _0x90ceaa["referenceImageRefs"]));
    appendStoryboardCellDisplay(_0x41b85e, _0x1a4ad8, _0x283efb, _0x8b793c);
  }
  ['_updateCellValue'](_0xa8f6e6, _0x449bd1, _0x5ab084) {
    const _0x4dacd3 = this['_getScriptState']();
    if (!Array["isArray"](_0x4dacd3['rows']) || !_0x4dacd3['rows'][_0xa8f6e6]) {
      return;
    }
    const _0x19f221 = _0x4dacd3['rows']['map']((_0x2e38cd, _0x3989f4) => _0x3989f4 === _0xa8f6e6 ? {
      ..._0x2e38cd,
      [_0x449bd1]: _0x5ab084
    } : _0x2e38cd);
    const _0x4406b8 = serializeCanonicalStoryboardScriptJson({
      ..._0x4dacd3,
      'rows': _0x19f221
    });
    const _0x5e9e1b = JSON["parse"](_0x4406b8);
    const _0x1c1e7b = {
      ..._0x4dacd3,
      'rows': _0x19f221,
      'canonicalJson': _0x4406b8,
      'title': _0x5e9e1b['title'],
      'detectedIntent': _0x5e9e1b["detectedIntent"],
      'updatedAt': Date["now"]()
    };
    this["_data"] = {
      ...this['_data'],
      'storyboardScript': _0x1c1e7b
    };
    this["_skipNextStoryboardBodyRender"] = !![];
    a542_0x3b634e["updateNodeData"](this['nodeId'], {
      'storyboardScript': _0x1c1e7b
    });
  }
  async ["_prepareStoryboardVideoFrames"]({
    submitInput: _0x5043ad,
    promptText: _0x5c7ac7,
    model: _0x49a056,
    provider: _0x349dfd
  }) {
    const _0x35c482 = Array["isArray"](_0x5043ad?.['videoRefs']) ? _0x5043ad['videoRefs'] : [];
    if (_0x35c482["length"] === 0x0) {
      return {
        'frameRefs': [],
        'frameBatches': [],
        'frameSummary': '',
        'visibleFrameRefs': []
      };
    }
    const _0x15e1ac = extractRequestedStoryboardShotCount(_0x5c7ac7, {
      'max': STORYBOARD_VIDEO_FRAME_LIMIT
    });
    const _0xb78d91 = _0x15e1ac || STORYBOARD_VIDEO_FRAME_LIMIT;
    const _0x624117 = Math['max'](0x1, Math["ceil"](_0xb78d91 / _0x35c482["length"]));
    const _0x503f17 = getStoryboardModelImageInputLimit(_0x49a056, _0x349dfd);
    const _0x2bf1a3 = [];
    for (const _0x3691b0 of _0x35c482) {
      if (_0x2bf1a3['length'] >= _0xb78d91) {
        break;
      }
      const _0x1da749 = _0xb78d91 - _0x2bf1a3["length"];
      const _0x30ba12 = Math["max"](0x1, Math['min'](_0x624117, _0x1da749));
      const _0x453133 = await extractStoryboardVideoFramesFromServer(_0x3691b0["url"], {
        'maxFrames': _0x30ba12,
        'exactCount': _0x15e1ac > 0x0
      });
      const _0x347e6a = Array["isArray"](_0x453133["frames"]) ? _0x453133["frames"] : [];
      for (const _0x10dfc8 of _0x347e6a) {
        if (_0x2bf1a3["length"] >= _0xb78d91) {
          break;
        }
        const _0x5274d0 = getStoryboardImagePlaceholder(_0x2bf1a3["length"] + 0x1);
        const _0x83ad32 = String(_0x10dfc8["url"] || '')["trim"]();
        if (!_0x83ad32) {
          continue;
        }
        const _0x44ada2 = {
          ..._0x10dfc8,
          'label': _0x5274d0,
          'url': _0x83ad32,
          'type': "image",
          'source': "video-frame",
          'videoLabel': _0x3691b0['label'],
          'videoUrl': _0x3691b0['url']
        };
        _0x44ada2["timeRange"] = formatStoryboardVideoTimeRange(_0x44ada2);
        _0x2bf1a3["push"](_0x44ada2);
      }
    }
    const _0x29b3cc = _0x2bf1a3['map']((_0x40ccb5, _0x5ba4fa) => ({
      ..._0x40ccb5,
      'sentAsImage': _0x5ba4fa < _0x503f17
    }));
    return {
      'frameRefs': _0x29b3cc,
      'frameBatches': chunkStoryboardFrameRefs(_0x29b3cc, _0x503f17),
      'frameSummary': buildStoryboardVideoFrameReferenceSummary(_0x29b3cc),
      'visibleFrameRefs': _0x29b3cc
    };
  }
  async ["_buildPayload"](_0x3c2721 = null) {
    const _0x1293cb = this['_getStoryboardSubmitInput'](_0x3c2721);
    const _0xd93562 = _0x1293cb["promptText"];
    const _0x23e72e = _0x1293cb['inputImageUrls']["length"] > 0x0;
    const _0x1bfeba = _0x1293cb["inputVideoUrls"]["length"] > 0x0;
    if (!_0xd93562 && !_0x23e72e && !_0x1bfeba) {
      window["showToast"]?.(storyboardScriptText("toasts.missingPromptOrReference"), "warn");
      return null;
    }
    const _0x8cd2b8 = resolveStoryboardScriptTextModel(this["_data"]);
    const _0x2083e5 = resolveStoryboardScriptTextProvider(this["_data"]);
    const _0x162b98 = _0x1293cb["sourceMode"];
    assertVideoAnalysisModel(_0x8cd2b8);
    const _0x3fdcf8 = _0x162b98 === "video" ? await this["_prepareStoryboardVideoFrames"]({
      'submitInput': _0x1293cb,
      'promptText': _0xd93562,
      'model': _0x8cd2b8,
      'provider': _0x2083e5
    }) : {
      'frameRefs': [],
      'frameBatches': [],
      'frameSummary': '',
      'visibleFrameRefs': []
    };
    const _0x5f53a1 = _0xd93562 || buildStoryboardReferenceSummary({
      'imageLabels': _0x1293cb["imageLabels"],
      'videoLabels': _0x1293cb["videoLabels"]
    });
    const _0x114c33 = buildStoryboardReferenceSummary({
      'imageLabels': _0x1293cb["imageLabels"],
      'videoLabels': _0x1293cb["videoLabels"]
    });
    let _0x159964 = buildStoryboardScriptTextOnlyPrompt(_0xd93562);
    let _0x392a6b = buildStoryboardScriptTextOnlySystemPrompt();
    if (_0x162b98 === "image") {
      _0x159964 = buildStoryboardScriptImagePrompt(_0xd93562, {
        'imageCount': _0x1293cb["inputImageUrls"]["length"],
        'imageLabels': _0x1293cb['imageLabels']
      });
      _0x392a6b = buildStoryboardScriptImageSystemPrompt();
    } else {
      if (_0x162b98 === 'video') {
        _0x159964 = buildStoryboardScriptVideoPrompt(_0xd93562, {
          'videoCount': _0x1293cb["inputVideoUrls"]['length'],
          'videoLabels': _0x1293cb["videoLabels"],
          'videoFrameSummary': _0x3fdcf8["frameSummary"]
        });
        _0x392a6b = buildStoryboardScriptVideoSystemPrompt();
      } else {
        _0x162b98 === "multimodal" && (_0x159964 = buildStoryboardScriptPrompt(_0xd93562, {
          'summary': _0x114c33,
          'imageCount': _0x1293cb['inputImageUrls']["length"],
          'imageLabels': _0x1293cb["imageLabels"],
          'videoCount': _0x1293cb["inputVideoUrls"]["length"],
          'videoLabels': _0x1293cb['videoLabels']
        }), _0x392a6b = '');
      }
    }
    return {
      'prompt': _0x159964,
      'systemPrompt': _0x392a6b,
      'storyboardPrompt': _0x5f53a1,
      'sourceMode': _0x162b98,
      'inputUrls': _0x162b98 === "video" ? [..._0x3fdcf8["visibleFrameRefs"]['filter'](_0x5b3ba4 => _0x5b3ba4["sentAsImage"] !== ![])["map"](_0x18be58 => _0x18be58["url"])['filter'](Boolean), ..._0x1293cb["inputVideoUrls"]] : _0x1293cb['inputUrls'],
      'inputImageUrls': _0x162b98 === "video" ? _0x3fdcf8["visibleFrameRefs"]["filter"](_0x5b4c72 => _0x5b4c72['sentAsImage'] !== ![])["map"](_0x29138c => _0x29138c["url"])["filter"](Boolean) : _0x1293cb['inputImageUrls'],
      'inputVideoUrls': _0x1293cb["inputVideoUrls"],
      'videoLabels': _0x1293cb["videoLabels"],
      'videoFrameRefs': _0x3fdcf8["visibleFrameRefs"],
      'videoFrameBatches': _0x3fdcf8["frameBatches"],
      'referenceImageRefs': _0x3fdcf8["visibleFrameRefs"],
      'rawPromptText': _0xd93562,
      'requestTimeoutMs': STORYBOARD_SCRIPT_TEXT_REQUEST_TIMEOUT_MS,
      'model': _0x8cd2b8,
      'provider': _0x2083e5,
      'nodeId': this['nodeId']
    };
  }
  ["_createImageNodesFromSelectedStoryboards"]({
    startGeneration = ![]
  } = {}) {
    this["_finishCellEdit"]({
      'commit': !![]
    });
    const _0x26796b = a542_0x3b634e['getState']?.()['nodes']?.[this["nodeId"]] || this["_data"] || {};
    const _0x4775db = createDefaultStoryboardScriptState(_0x26796b['storyboardScript'] || this["_data"]["storyboardScript"] || {});
    const _0x654a5d = serializeCanonicalStoryboardScriptJson(_0x4775db);
    const _0x249b60 = JSON["parse"](_0x654a5d);
    const _0x213bb3 = getSelectedRowIndexes(_0x4775db);
    if (_0x4775db["selectionMode"] !== !![]) {
      return ![];
    }
    if (_0x213bb3["length"] === 0x0) {
      window["showToast"]?.(storyboardScriptText('toasts.selectStoryboardsFirst'), "warn");
      return !![];
    }
    const _0x1d2632 = _0x213bb3["map"](_0x282310 => {
      const _0xc90a90 = _0x4775db["rows"][_0x282310] || {};
      return {
        'rowIndex': _0x282310,
        'shotNo': getStoryboardRowShotNo(_0xc90a90, _0x282310),
        'prompt': getStoryboardRowImagePrompt(_0xc90a90)
      };
    });
    const _0x42f9e1 = _0x1d2632["filter"](_0x2d3369 => !_0x2d3369["prompt"]);
    if (_0x42f9e1["length"] > 0x0) {
      window['showToast']?.(storyboardScriptText('toasts.missingImagePrompt'), 'warn');
      return !![];
    }
    const _0x1908d9 = _0x4775db["imageModel"] || DEFAULT_IMAGE_NODE_MODEL;
    const _0x1a9689 = _0x4775db["imageProvider"] || DEFAULT_IMAGE_NODE_PROVIDER;
    const _0x10d047 = String(_0x4775db["imageProviderProfileId"] || _0x26796b['providerProfileId'] || '')['trim']();
    const _0x2605ef = resolveStoryboardScriptTextModel({
      'storyboardScript': _0x4775db
    });
    const _0x37173d = resolveStoryboardScriptTextProvider({
      'storyboardScript': _0x4775db
    });
    const _0x3a595b = clonePlainObject(_0x26796b["generationParams"]);
    const _0x1fa7c3 = clonePlainObject(_0x26796b["generationParamsByModel"]);
    const _0xb0d7db = _0x3a595b?.["aspectRatio"] || _0x26796b['aspectRatio'] || '自适应';
    const _0x28e4ae = _0x3a595b?.["imageSize"] || _0x26796b["imageSize"] || '';
    const _0x53602a = getImageNodeSizeForAspectRatio(_0xb0d7db);
    const _0xf8b62e = getStateSnapshot();
    const _0x26358e = createBatchSpawnLayoutNearNode({
      'nodes': _0xf8b62e["nodes"] || {},
      'anchorNode': _0x26796b,
      'itemCount': _0x1d2632['length'],
      'itemWidth': _0x53602a["width"],
      'itemHeight': _0x53602a["height"],
      'maxPerLine': 0x5,
      'padding': STORYBOARD_IMAGE_BATCH_PADDING,
      'titleHeight': STORYBOARD_IMAGE_BATCH_TITLE_HEIGHT
    });
    const _0x4ebc78 = generateId("group");
    a542_0x3b634e["addNode"]({
      'id': _0x4ebc78,
      'type': "group",
      'x': _0x26358e["groupX"],
      'y': _0x26358e['groupY'],
      'width': _0x26358e["groupWidth"],
      'height': _0x26358e["groupHeight"],
      'name': storyboardScriptText("imageBatchGroupName"),
      'label': storyboardScriptText("imageBatchGroupName")
    });
    const _0x1f0856 = [];
    _0x1d2632['forEach']((_0x3ddd80, _0x2073f7) => {
      const _0x331c1e = _0x26358e['getItemPosition'](_0x2073f7);
      const _0x29e17a = generateId('ai-image');
      const _0x23fe1d = {
        'id': _0x29e17a,
        'type': 'ai-image',
        'x': _0x331c1e['x'],
        'y': _0x331c1e['y'],
        'width': _0x53602a["width"],
        'height': _0x53602a["height"],
        'name': storyboardScriptText('imageNodeName', {
          'shot': _0x3ddd80["shotNo"] || _0x2073f7 + 0x1
        }),
        'prompt': escapePromptTextForHtml(_0x3ddd80['prompt']),
        'model': _0x1908d9,
        'provider': _0x1a9689,
        ...(_0x1a9689 === 'runninghub' && _0x10d047 ? {
          'providerProfileId': _0x10d047
        } : {}),
        'aspectRatio': _0xb0d7db,
        'needsAutoResize': !![],
        'storyboardSource': {
          'nodeId': this["nodeId"],
          'rowIndex': _0x3ddd80["rowIndex"],
          'shotNo': _0x3ddd80["shotNo"]
        }
      };
      _0x3a595b && (_0x23fe1d["generationParams"] = clonePlainObject(_0x3a595b));
      _0x1fa7c3 && (_0x23fe1d['generationParamsByModel'] = clonePlainObject(_0x1fa7c3));
      if (_0x28e4ae) {
        _0x23fe1d["imageSize"] = _0x28e4ae;
      }
      a542_0x3b634e["addNode"](_0x23fe1d);
      _0x1f0856["push"](_0x29e17a);
    });
    a542_0x3b634e["groupNodes"](_0x1f0856, _0x4ebc78);
    const _0x44c45a = {
      ..._0x4775db,
      'canonicalJson': _0x654a5d,
      'title': _0x249b60["title"],
      'detectedIntent': _0x249b60['detectedIntent'],
      'selectionMode': ![],
      'selectedRowIndexes': [],
      'updatedAt': Date["now"]()
    };
    this["_data"] = {
      ...this['_data'],
      'model': _0x2605ef,
      'provider': _0x37173d,
      'storyboardScript': _0x44c45a
    };
    a542_0x3b634e["updateNodeData"](this["nodeId"], {
      'model': _0x2605ef,
      'provider': _0x37173d,
      'storyboardScript': _0x44c45a
    });
    commit();
    startGeneration ? this["_startGeneratedImageNodes"](_0x1f0856, {
      'onStarted': () => focusStoryboardImageBatch(this["nodeId"], _0x4ebc78)
    }) : focusStoryboardImageBatch(this["nodeId"], _0x4ebc78);
    window['showToast']?.(startGeneration ? storyboardScriptText("toasts.createdAndStartedImageNodes", {
      'count': _0x1f0856["length"]
    }) : storyboardScriptText("toasts.createdImageNodes", {
      'count': _0x1f0856['length']
    }), "success");
    return !![];
  }
  ["_startGeneratedImageNodes"](_0x2542af = [], {
    onStarted = null
  } = {}) {
    const _0x125869 = Array["isArray"](_0x2542af) ? _0x2542af["map"](_0x1863fe => String(_0x1863fe || '')["trim"]())['filter'](Boolean) : [];
    if (_0x125869["length"] === 0x0) {
      return;
    }
    let _0x36715b = ![];
    for (const _0x3d1b7c of _0x125869) {
      const _0x3f0976 = a542_0x10ac8a["resolve"](_0x3d1b7c, {
        'store': a542_0x3b634e
      });
      if (!_0x3f0976?.['runGeneration']) {
        _0x36715b = !![];
        continue;
      }
      Promise["resolve"](_0x3f0976['runGeneration']())['catch'](_0x36f614 => {
        console["error"]("[StoryboardScriptNode] auto image generation failed", _0x36f614);
      });
    }
    if (_0x36715b) {
      globalThis["window"]?.['showToast']?.(storyboardScriptText("toasts.autoStartPartialFailed"), "warn");
    }
    try {
      onStarted?.();
    } catch (_0x54a9e1) {
      console["warn"]('[StoryboardScriptNode]\x20post-start\x20callback\x20failed', _0x54a9e1);
    }
  }
  ["runGeneration"](_0x430ccc = {}) {
    return this["_onGenerate"](null, _0x430ccc);
  }
  ["cancelGeneration"]() {
    return {
      'ok': ![],
      'status': "not-cancellable",
      'message': "Storyboard script generation is not cancellable yet."
    };
  }
  ["getGenerationStatus"]() {
    const _0x19d72f = a542_0x3b634e["getState"]?.()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
    const _0x444f82 = createDefaultStoryboardScriptState(_0x19d72f["storyboardScript"] || this["_data"]["storyboardScript"] || {});
    const _0x4b7514 = this['_isStoryboardScriptGenerating'](_0x444f82);
    return {
      'nodeId': this["nodeId"],
      'jobStatus': _0x4b7514 ? 'running' : String(_0x444f82["jobStatus"] || "idle"),
      'isGenerating': _0x4b7514,
      'cancellable': ![],
      'resumable': ![]
    };
  }
  async ["_onGenerate"](_0x3f93d4 = null, _0x1709dc = {}) {
    const _0x199710 = this["_isPromptGenerateLoadingPrimed"] === !![];
    if (this["_isGeneratingScript"] && !_0x199710) {
      return;
    }
    this["_isPromptGenerateLoadingPrimed"] = ![];
    if (_0x1709dc?.["insertPrompt"] === !![]) {
      insertPresetPromptIntoEditor({
        'storeApi': a542_0x3b634e,
        'nodeId': this["nodeId"],
        'promptEl': this["promptEl"],
        'template': _0x3f93d4,
        'inEdges': a542_0x3b634e['getIncomingEdges'](this["nodeId"]),
        'nodes': a542_0x3b634e["getState"]()["nodes"] || {},
        'allowedAssetTypes': ["text", "image", "video"]
      });
      this["_updateSubmitButtonState"]?.();
      return;
    }
    if (shouldUsePromptPreviewForPreset(_0x3f93d4)) {
      const _0x219865 = await this["_buildPayload"](_0x3f93d4);
      if (!_0x219865) {
        this["_updateSubmitButtonState"]?.();
        return;
      }
      previewPresetPromptInEditor({
        'storeApi': a542_0x3b634e,
        'nodeId': this["nodeId"],
        'promptEl': this["promptEl"],
        'promptText': _0x219865['prompt']
      });
      this['_updateSubmitButtonState']?.();
      return;
    }
    const _0xeed69d = this["_getScriptState"]();
    if (_0xeed69d["selectionMode"] === !![]) {
      this["_isGeneratingScript"] = ![];
      this["_syncGeneratingOverlay"](![]);
      this["_createImageNodesFromSelectedStoryboards"]({
        'startGeneration': !![]
      });
      return;
    }
    this['_isGeneratingScript'] = !![];
    !_0x199710 && this["_setStoryboardGeneratingState"](!![]);
    this["_syncGeneratingOverlay"](!![]);
    await waitForStoryboardLoadingPaint();
    this['_updateSubmitButtonState']();
    let _0x14c3d9 = null;
    try {
      _0x14c3d9 = await this["_buildPayload"](_0x3f93d4);
    } catch (_0x26486e) {
      this['_isGeneratingScript'] = ![];
      this["_setStoryboardGeneratingState"](![]);
      this["_updateSubmitButtonState"]();
      window['showToast']?.(_0x26486e?.["message"] || storyboardScriptText("errors.videoPreprocessFailed"), "error");
      return;
    }
    if (!_0x14c3d9) {
      this["_isGeneratingScript"] = ![];
      this["_setStoryboardGeneratingState"](![]);
      this["_updateSubmitButtonState"]();
      return;
    }
    const _0x3407c5 = Date["now"]();
    const _0x512904 = this["_getScriptState"]();
    const _0x4cacde = resolveModelManifest(_0x14c3d9['model'], _0x14c3d9['provider']);
    try {
      const _0x4d51ce = await submitTask({
        'sourceNodeId': this["nodeId"],
        'targetNodeId': this["nodeId"],
        'trigger': "node",
        'taskType': "storyboard-script-generation",
        'provider': _0x14c3d9["provider"],
        'adapterType': 'modelApi',
        'modelId': _0x14c3d9["model"],
        'executionId': _0x4cacde?.["executionId"] || "storyboard-script." + _0x14c3d9['provider'] + '.' + _0x14c3d9['model'],
        'payload': _0x14c3d9,
        'cancellable': ![],
        'resumable': ![],
        'async': ![],
        'submit': () => runStoryboardScriptGenerationPayload(_0x14c3d9),
        'startBuilder': () => ({
          'model': _0x14c3d9["model"],
          'provider': _0x14c3d9["provider"],
          'storyboardScript': buildStoryboardScriptStatePatch({
            'current': _0x512904,
            'prompt': _0x14c3d9["storyboardPrompt"],
            'model': _0x14c3d9["model"],
            'provider': _0x14c3d9["provider"],
            'sourceMode': _0x14c3d9["sourceMode"],
            'status': 'running',
            'referenceImageRefs': _0x14c3d9["referenceImageRefs"]
          })
        }),
        'resultBuilder': async _0x473abf => {
          const _0x283b49 = extractGeneratedText(_0x473abf)["trim"]();
          const _0x296d3b = normalizeStoryboardScriptGenerationResult(_0x283b49, {
            'requireMarker': !![],
            'sourceMode': _0x14c3d9["sourceMode"]
          });
          if (!_0x296d3b['ok']) {
            throw new Error(storyboardScriptText("errors.invalidJsonSwitchModel"));
          }
          return {
            'name': _0x296d3b["title"] || this['_data']["name"] || getStoryboardScriptDefaultName(),
            'model': _0x14c3d9["model"],
            'provider': _0x14c3d9['provider'],
            'storyboardScript': buildStoryboardScriptStatePatch({
              'current': _0x512904,
              'prompt': _0x14c3d9["storyboardPrompt"],
              'model': _0x14c3d9["model"],
              'provider': _0x14c3d9["provider"],
              'sourceMode': _0x14c3d9["sourceMode"],
              'normalized': _0x296d3b,
              'status': "success",
              'referenceImageRefs': _0x14c3d9["referenceImageRefs"]
            })
          };
        },
        'failureBuilder': _0x23e77f => ({
          'storyboardScript': buildStoryboardScriptStatePatch({
            'current': _0x512904,
            'prompt': _0x14c3d9["storyboardPrompt"],
            'model': _0x14c3d9["model"],
            'provider': _0x14c3d9['provider'],
            'sourceMode': _0x14c3d9["sourceMode"],
            'status': 'error',
            'error': _0x23e77f?.["message"] || storyboardScriptText("errors.generationFailed"),
            'referenceImageRefs': _0x14c3d9["referenceImageRefs"]
          })
        }),
        'parseError': _0x15e14c => _0x15e14c?.["message"] || storyboardScriptText("errors.generationFailed")
      }, {
        'store': a542_0x3b634e,
        'startedAt': _0x3407c5
      });
      _0x4d51ce["status"] === "failed" && window["showToast"]?.(_0x4d51ce["error"]?.["message"] || storyboardScriptText('errors.generationFailed'), 'error');
    } finally {
      this["_isGeneratingScript"] = ![];
      this['_updateSubmitButtonState']();
    }
  }
  async ["_downloadScriptTable"]() {
    this["_finishCellEdit"]({
      'commit': !![]
    });
    const _0x5ea405 = this['_getScriptState']();
    if (!Array["isArray"](_0x5ea405["rows"]) || _0x5ea405["rows"]["length"] === 0x0) {
      window["showToast"]?.(storyboardScriptText("toasts.noDownloadData"), 'warn');
      return;
    }
    const _0x3ff19b = serializeCanonicalStoryboardScriptJson(_0x5ea405);
    const _0x4f96f5 = JSON['parse'](_0x3ff19b);
    const _0x39e4d8 = {
      ..._0x5ea405,
      'canonicalJson': _0x3ff19b,
      'title': _0x4f96f5["title"],
      'detectedIntent': _0x4f96f5["detectedIntent"],
      'updatedAt': Date["now"]()
    };
    this["_data"] = {
      ...this['_data'],
      'storyboardScript': _0x39e4d8
    };
    a542_0x3b634e["updateNodeData"](this["nodeId"], {
      'storyboardScript': _0x39e4d8
    });
    const _0x79d3fd = STORYBOARD_SCRIPT_COLUMNS["map"](_0x509b9b => ({
      ..._0x509b9b,
      'label': getStoryboardColumnLabel(_0x509b9b['key'], _0x509b9b["label"])
    }));
    const _0x28b3e2 = serializeStoryboardScriptRowsToCsv(_0x39e4d8["rows"], _0x79d3fd);
    const _0x146b30 = sanitizeExportFileName(_0x39e4d8["title"] || this["_data"]["name"] || getStoryboardScriptDefaultName());
    try {
      const _0x2c1074 = await saveTextDownload({
        'filename': _0x146b30 + '_' + formatExportTimestamp() + ".csv",
        'content': _0x28b3e2,
        'mimeType': STORYBOARD_SCRIPT_TABLE_EXPORT_MIME,
        'title': storyboardScriptText("toolbar.downloadTable"),
        'filterName': "CSV"
      });
      if (_0x2c1074?.["canceled"]) {
        return;
      }
    } catch (_0x4b8a) {
      window["showToast"]?.(String(_0x4b8a?.['message'] || _0x4b8a), "error");
      return;
    }
    window["showToast"]?.(storyboardScriptText('toasts.downloadedTable'), "success");
  }
  ["_getStoryboardViewScrollKey"](_0x489971, _0x570b76 = '') {
    const _0x5ca9ad = normalizeStoryboardScriptMediaMode(_0x489971?.['mediaMode']);
    const _0xe55293 = normalizeStoryboardScriptViewMode(_0x570b76 || _0x489971?.["viewMode"]);
    return _0x5ca9ad + ':' + _0xe55293;
  }
  ["_getCurrentStoryboardScroller"]() {
    return this["_bodyEl"]?.["querySelector"]?.('.storyboard-script-table-wrap,\x20.storyboard-script-card-grid');
  }
  ["_rememberStoryboardViewScroll"](_0x3e11a1, _0x3cc434, _0x15d991 = '') {
    if (!(_0x3e11a1 instanceof HTMLElement)) {
      return;
    }
    const _0x21412d = this["_getStoryboardViewScrollKey"](_0x3cc434, _0x15d991);
    this["_storyboardViewScrollByKey"]["set"](_0x21412d, {
      'left': _0x3e11a1["scrollLeft"],
      'top': _0x3e11a1['scrollTop']
    });
  }
  ["_captureStoryboardViewScroll"](_0x20165c) {
    const _0x2d351c = this["_getCurrentStoryboardScroller"]();
    if (!(_0x2d351c instanceof HTMLElement)) {
      return;
    }
    const _0x5536ce = _0x2d351c['classList']["contains"]("storyboard-script-card-grid") ? "card" : "list";
    this["_rememberStoryboardViewScroll"](_0x2d351c, _0x20165c, _0x5536ce);
  }
  ["_bindStoryboardViewScrollMemory"](_0x4b3388, _0x1a8811) {
    if (!(_0x4b3388 instanceof HTMLElement)) {
      return;
    }
    if (_0x4b3388["dataset"]['storyboardScrollMemoryBound'] === 'true') {
      return;
    }
    _0x4b3388["dataset"]['storyboardScrollMemoryBound'] = "true";
    _0x4b3388["addEventListener"]('scroll', () => this["_rememberStoryboardViewScroll"](_0x4b3388, _0x1a8811), {
      'passive': !![]
    });
  }
  ["_restoreStoryboardViewScroll"](_0x45b9bb, _0x3c0fc4) {
    if (!(_0x45b9bb instanceof HTMLElement)) {
      return;
    }
    const _0x3b7361 = this["_getStoryboardViewScrollKey"](_0x3c0fc4);
    const _0x2a94bb = this['_storyboardViewScrollByKey']["get"](_0x3b7361);
    if (!_0x2a94bb) {
      return;
    }
    const _0x49ec69 = () => {
      const _0x3c6980 = Math["max"](0x0, _0x45b9bb["scrollWidth"] - _0x45b9bb["clientWidth"]);
      const _0x5bccb6 = Math['max'](0x0, _0x45b9bb["scrollHeight"] - _0x45b9bb["clientHeight"]);
      _0x45b9bb["scrollLeft"] = Math["min"](_0x3c6980, Math["max"](0x0, _0x2a94bb["left"] || 0x0));
      _0x45b9bb['scrollTop'] = Math["min"](_0x5bccb6, Math["max"](0x0, _0x2a94bb["top"] || 0x0));
    };
    _0x49ec69();
    typeof window !== "undefined" && typeof window["requestAnimationFrame"] === "function" && window["requestAnimationFrame"](_0x49ec69);
  }
  ["_render"]() {
    if (!this['_bodyEl']) {
      return;
    }
    const _0x30ab5e = this["_getScriptState"]();
    const _0x289365 = this["_isStoryboardScriptGenerating"](_0x30ab5e);
    this['_captureStoryboardViewScroll'](_0x30ab5e);
    this['_syncModeButtons'](_0x30ab5e['viewMode'], _0x30ab5e['mediaMode']);
    this['_syncSelectionModeUi'](_0x30ab5e);
    this['_updateSubmitButtonState']();
    const _0x9d074a = this["_getStoryboardSubmitInput"]();
    const _0x45cd61 = mergeStoryboardImageRefs(_0x9d074a["imageRefs"], _0x30ab5e["referenceImageRefs"]);
    const _0x1b3b8d = buildStoryboardBodyRenderSignature(_0x30ab5e, _0x45cd61);
    const _0x5aee2d = this['_getCurrentStoryboardScroller']();
    const _0x5d142b = _0x5aee2d instanceof HTMLElement && (this["_storyboardBodyRenderSignature"] === _0x1b3b8d || this["_skipNextStoryboardBodyRender"] === !![]);
    if (_0x5d142b) {
      this["_storyboardBodyRenderSignature"] = _0x1b3b8d;
      this["_skipNextStoryboardBodyRender"] = ![];
      this["_bindStoryboardViewScrollMemory"](_0x5aee2d, _0x30ab5e);
      this['_syncListSelectionState'](_0x30ab5e);
      this['_syncGeneratingOverlay'](_0x289365);
      this['_renderFullscreenContent'](_0x30ab5e, _0x45cd61);
      return;
    }
    this["_skipNextStoryboardBodyRender"] = ![];
    this['_storyboardBodyRenderSignature'] = _0x1b3b8d;
    this["_bodyEl"]["replaceChildren"]();
    if (_0x30ab5e["rows"]["length"] === 0x0) {
      this['_bodyEl']["appendChild"](this["_createEmptyState"]());
      this["_syncGeneratingOverlay"](_0x289365);
      this["_renderFullscreenContent"](_0x30ab5e, _0x45cd61);
      return;
    }
    const _0x15a0af = buildStoryboardImageRefMap(_0x45cd61);
    let _0x507491 = null;
    _0x30ab5e['viewMode'] === "card" ? (_0x507491 = this["_createCardView"](_0x30ab5e["rows"], getStoryboardCardFieldsForMediaMode(_0x30ab5e["mediaMode"], _0x30ab5e["rows"]), _0x15a0af), this["_bodyEl"]["appendChild"](_0x507491)) : (_0x507491 = this["_createListView"](_0x30ab5e["rows"], getStoryboardColumnsForMediaMode(_0x30ab5e["mediaMode"], _0x30ab5e['rows']), _0x15a0af), this["_bodyEl"]["appendChild"](_0x507491));
    this['_bindStoryboardViewScrollMemory'](_0x507491, _0x30ab5e);
    this["_restoreStoryboardViewScroll"](_0x507491, _0x30ab5e);
    this['_syncListSelectionState'](_0x30ab5e);
    this["_syncGeneratingOverlay"](_0x289365);
    this["_renderFullscreenContent"](_0x30ab5e, _0x45cd61);
  }
  ['_createEmptyState']() {
    const _0x555b57 = document['createElement']("div");
    _0x555b57["className"] = "storyboard-script-empty";
    const _0x2e33d9 = document["createElement"]("div");
    _0x2e33d9["className"] = "storyboard-script-empty-title";
    _0x2e33d9["textContent"] = storyboardScriptText("empty.title");
    const _0x3a015d = document['createElement']("div");
    _0x3a015d["className"] = "storyboard-script-empty-hint";
    _0x3a015d["textContent"] = storyboardScriptText('empty.hint');
    _0x555b57["appendChild"](_0x2e33d9);
    _0x555b57["appendChild"](_0x3a015d);
    return _0x555b57;
  }
  ["_createListView"](_0x3c155f, _0x4987bc = STORYBOARD_SCRIPT_COLUMNS, _0x2aafd4 = new Map(), {
    selectionMode: _0x1e9e89 = null
  } = {}) {
    const _0x5ba0e1 = document["createElement"]('div');
    _0x5ba0e1["className"] = 'storyboard-script-table-wrap\x20custom-scrollbar';
    const _0x5c0bed = this["_getScriptState"]();
    const _0x56ea1a = _0x1e9e89 == null ? _0x5c0bed['selectionMode'] === !![] : _0x1e9e89 === !![];
    const _0x13c503 = _0x56ea1a ? getSelectedRowIndexes(_0x5c0bed) : [];
    const _0x126e1f = new Set(_0x13c503);
    const _0xe95856 = _0x3c155f["length"] > 0x0 && _0x13c503["length"] === _0x3c155f["length"];
    const _0x51b4b4 = document["createElement"]('table');
    _0x51b4b4["className"] = 'storyboard-script-table';
    _0x51b4b4["classList"]['toggle']('is-selection-mode', _0x56ea1a);
    const _0x1158a5 = document['createElement']("thead");
    const _0x145158 = document["createElement"]('tr');
    if (_0x56ea1a) {
      const _0x13b61e = document["createElement"]('th');
      _0x13b61e["scope"] = 'col';
      _0x13b61e['className'] = "storyboard-script-select-cell storyboard-script-select-cell--head";
      const _0x5afdc4 = document["createElement"]('input');
      _0x5afdc4["type"] = "checkbox";
      _0x5afdc4["className"] = 'storyboard-script-select-checkbox\x20storyboard-script-select-all';
      _0x5afdc4["checked"] = _0xe95856;
      _0x5afdc4["indeterminate"] = _0x13c503["length"] > 0x0 && !_0xe95856;
      _0x5afdc4['setAttribute']('aria-label', storyboardScriptText('selectAllAria'));
      _0x5afdc4['addEventListener']("pointerdown", _0x25cabe => {
        _0x25cabe['stopPropagation']();
      });
      _0x5afdc4['addEventListener']("click", _0xd4a528 => {
        _0xd4a528["stopPropagation"]();
        this["_setAllRowsSelected"](_0x5afdc4['checked']);
      });
      _0x13b61e['appendChild'](_0x5afdc4);
      _0x145158["appendChild"](_0x13b61e);
    }
    _0x4987bc["forEach"](_0x304e01 => {
      const _0x2f0519 = document["createElement"]('th');
      _0x2f0519["scope"] = "col";
      _0x2f0519["dataset"]["storyboardColumnDensity"] = resolveStoryboardColumnDensity(_0x304e01["key"]);
      _0x2f0519["textContent"] = getStoryboardColumnLabel(_0x304e01['key'], _0x304e01["label"]);
      _0x145158["appendChild"](_0x2f0519);
    });
    _0x1158a5["appendChild"](_0x145158);
    const _0x1f0c97 = document["createElement"]("tbody");
    _0x3c155f["forEach"]((_0xbaace7, _0x3d4efb) => {
      const _0x315413 = document["createElement"]('tr');
      _0x315413["dataset"]["storyboardRowIndex"] = String(_0x3d4efb);
      if (_0x56ea1a) {
        const _0x3faa5d = document["createElement"]('td');
        _0x3faa5d["className"] = "storyboard-script-select-cell";
        const _0x3112b0 = document["createElement"]("input");
        _0x3112b0["type"] = "checkbox";
        _0x3112b0['className'] = "storyboard-script-select-checkbox";
        _0x3112b0['checked'] = _0x126e1f["has"](_0x3d4efb);
        _0x3112b0['setAttribute']("aria-label", storyboardScriptText('selectRowAria', {
          'index': _0x3d4efb + 0x1
        }));
        _0x3112b0["addEventListener"]("pointerdown", _0x33cb9d => {
          _0x33cb9d['stopPropagation']();
        });
        _0x3112b0["addEventListener"]("click", _0x3696ae => {
          _0x3696ae['stopPropagation']();
          this['_toggleRowSelection'](_0x3d4efb, _0x3112b0['checked']);
        });
        _0x3faa5d["appendChild"](_0x3112b0);
        _0x315413['appendChild'](_0x3faa5d);
      }
      _0x4987bc["forEach"](_0x172857 => {
        const _0x5c3891 = document["createElement"]('td');
        _0x5c3891['className'] = "storyboard-script-editable";
        _0x5c3891["dataset"]["storyboardRowIndex"] = String(_0x3d4efb);
        _0x5c3891["dataset"]['storyboardEditKey'] = _0x172857["key"];
        _0x5c3891["dataset"]["storyboardColumnDensity"] = resolveStoryboardColumnDensity(_0x172857['key']);
        appendStoryboardCellDisplay(_0x5c3891, _0x172857["key"], _0xbaace7[_0x172857["key"]], _0x2aafd4);
        _0x315413["appendChild"](_0x5c3891);
      });
      _0x1f0c97["appendChild"](_0x315413);
    });
    _0x51b4b4["appendChild"](_0x1158a5);
    _0x51b4b4["appendChild"](_0x1f0c97);
    _0x5ba0e1["appendChild"](_0x51b4b4);
    return _0x5ba0e1;
  }
  ["_syncListSelectionState"](_0x44ae38 = this["_getScriptState"]()) {
    const _0x570e28 = _0x44ae38["selectionMode"] === !![];
    const _0x2cfbb9 = _0x570e28 ? getSelectedRowIndexes(_0x44ae38) : [];
    const _0x55e88e = new Set(_0x2cfbb9);
    const _0x49b87c = this["_bodyEl"]?.['querySelector']?.(".storyboard-script-table");
    if (!(_0x49b87c instanceof HTMLElement)) {
      return;
    }
    _0x49b87c["classList"]["toggle"]("is-selection-mode", _0x570e28);
    const _0x28614d = _0x570e28 && Array["isArray"](_0x44ae38["rows"]) && _0x44ae38["rows"]["length"] > 0x0 && _0x2cfbb9["length"] === _0x44ae38["rows"]["length"];
    const _0x49114e = _0x49b87c['querySelector'](".storyboard-script-select-all");
    _0x49114e instanceof HTMLInputElement && (_0x49114e['checked'] = _0x28614d, _0x49114e['indeterminate'] = _0x570e28 && _0x2cfbb9["length"] > 0x0 && !_0x28614d);
    _0x49b87c["querySelectorAll"]('tbody\x20tr')["forEach"]((_0x33ac52, _0x4abb54) => {
      if (!(_0x33ac52 instanceof HTMLElement)) {
        return;
      }
      const _0xaafe0f = Number(_0x33ac52["dataset"]["storyboardRowIndex"] || _0x4abb54);
      const _0x46ad88 = _0x55e88e["has"](_0xaafe0f);
      const _0x5c488e = _0x33ac52["querySelector"](".storyboard-script-select-checkbox");
      _0x5c488e instanceof HTMLInputElement && (_0x5c488e['checked'] = _0x46ad88);
    });
  }
  ["_createCardView"](_0x4da538, _0x190620 = CARD_FIELDS, _0x9a900 = new Map()) {
    const _0x276e3a = document["createElement"]("div");
    _0x276e3a["className"] = 'storyboard-script-card-grid\x20custom-scrollbar';
    _0x4da538["forEach"]((_0x4487cd, _0x2b64e7) => {
      const _0x2d90e3 = document['createElement']("article");
      _0x2d90e3["className"] = "storyboard-script-card";
      const _0x388897 = document["createElement"]("div");
      _0x388897['className'] = "storyboard-script-card-head";
      const _0x3dae96 = document['createElement']('span');
      _0x3dae96["className"] = "storyboard-script-shot storyboard-script-editable";
      _0x3dae96['dataset']['storyboardRowIndex'] = String(_0x2b64e7);
      _0x3dae96["dataset"]["storyboardEditKey"] = '镜号';
      _0x3dae96["textContent"] = formatCellValue(_0x4487cd['镜号']) || storyboardScriptText("shotFallback", {
        'index': _0x2b64e7 + 0x1
      });
      _0x388897["appendChild"](_0x3dae96);
      const _0x5576b2 = formatCellValue(_0x4487cd['时长']);
      if (_0x5576b2) {
        const _0x359096 = document["createElement"]("span");
        _0x359096['className'] = "storyboard-script-duration storyboard-script-editable";
        _0x359096["dataset"]['storyboardRowIndex'] = String(_0x2b64e7);
        _0x359096['dataset']['storyboardEditKey'] = '时长';
        _0x359096["textContent"] = _0x5576b2;
        _0x388897["appendChild"](_0x359096);
      }
      _0x2d90e3['appendChild'](_0x388897);
      _0x190620["forEach"](_0x47124a => {
        const _0x518fe4 = formatCellValue(_0x4487cd[_0x47124a]);
        if (!_0x518fe4) {
          return;
        }
        const _0x53fc3a = document["createElement"]("div");
        _0x53fc3a["className"] = "storyboard-script-card-field";
        const _0x57e86e = document['createElement']("span");
        _0x57e86e["className"] = "storyboard-script-card-label";
        _0x57e86e["textContent"] = getStoryboardColumnLabel(_0x47124a, _0x47124a);
        const _0x29a106 = document["createElement"]("span");
        _0x29a106['className'] = "storyboard-script-card-value storyboard-script-editable";
        _0x29a106["dataset"]["storyboardRowIndex"] = String(_0x2b64e7);
        _0x29a106["dataset"]["storyboardEditKey"] = _0x47124a;
        appendStoryboardCellDisplay(_0x29a106, _0x47124a, _0x518fe4, _0x9a900);
        _0x53fc3a["appendChild"](_0x57e86e);
        _0x53fc3a['appendChild'](_0x29a106);
        _0x2d90e3["appendChild"](_0x53fc3a);
      });
      _0x276e3a["appendChild"](_0x2d90e3);
    });
    return _0x276e3a;
  }
  ["update"](_0x56e1b7) {
    this["_data"] = _0x56e1b7 || {};
    if (this["promptEl"] && document["activeElement"] !== this['promptEl'] && _0x56e1b7?.["prompt"] !== undefined) {
      const _0x126b17 = sanitizePromptHtml(_0x56e1b7["prompt"] || '');
      this["promptEl"]?.["innerHTML"] !== _0x126b17 && (this['promptEl']["innerHTML"] = _0x126b17, _rehydratePromptPills(this));
    }
    this["_syncPromptBoxSizeFromData"]?.(_0x56e1b7);
    this["_renderRefBar"]();
    this["_render"]();
  }
  ["unmount"]() {
    this['_closeFullscreenScript']();
    this['_finishCellEdit']({
      'commit': !![]
    });
    this['_flushPromptHtmlCommit']?.();
    this["_unbindRefThumbHoverPreview"]?.();
    this['_unbindRefThumbHoverPreview'] = null;
    this['_unbindOutsideSelectionCancel']();
    this['_unbindStoryboardImageModelTrigger']();
    this["_removeStoryboardImageModelMenu"]();
    this["_storyboardImageSchemaCleanup"]?.();
    this['_storyboardImageSchemaCleanup'] = null;
    this["_sharedPanelCleanup"]?.();
  }
}