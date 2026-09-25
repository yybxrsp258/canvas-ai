import { graphStore } from '../../core/stores/appStore.js';
import { SOURCE_TYPES, SOURCE_TYPE_META, COMFYUI_WORKFLOW_STATE_SCOPE, normalizeSourceType, getSourceMeta, isComfyUiSource, isRunningHubSource, getComfyUiBaseUrlMode, getComfyUiSourceTypeFromBaseUrlMode, getComfyUiBaseUrlModeLabel } from './rhAiAppSources.js';
import { createRhAiAppDefinitionController } from './rhAiAppDefinitionController.js';
import { createRunningHubWorkflowComponentDrafts, buildRunningHubWorkflowManifestBundle } from './rhWorkflowImport.js';
import { generateId, screenToWorld } from '../../core/math.js';
import { sanitizeModelUiSchemaParams } from '../../manifests/index.js';
import { getAIGenerationDefaultSizeByType } from '../../services/fileService.js';
import { bindUiSchemaFieldControls, renderModelUiSchemaControls, renderUiSchemaFields } from '../../components/aigenImage/uiSchemaRenderer.js';
import { commit } from '../history.js';
import { closeAllSidebarSubmenus } from '../sidebarSubmenuController.js';
import { createRunningHubAiAppContextMenuController } from './runningHubAiAppContextMenu.js';
import { RH_AI_APP_FOOTER_PARAM_LIMIT, buildRunningHubAiAppManifestBundle, createRunningHubAiAppComponentDrafts, summarizeRunningHubAiAppBundle } from './rhAiAppImport.js';
import { buildComfyUiWorkflowManifestBundle, createComfyUiWorkflowComponentDrafts, formatComfyUiComponentLabel, summarizeComfyUiWorkflowBundle } from '../comfyuiWorkflow/comfyUiWorkflowImport.js';
import { renderComfyUiLocalWorkflowLogoHtml, renderRunningHubAiAppLogoHtml } from '../../components/shared/customAiAppLogo.js';
import { RH_AI_APP_VIP_MODEL_ID } from '../subscriptionAccess.js';
import { RUNNINGHUB_DOMESTIC_PROFILE_ID, RUNNINGHUB_INTERNATIONAL_PROFILE_ID, normalizeRunningHubModelApiProfileId } from '../runningHubProviderProfiles.js';
import { getRunningHubInstanceTypeLabel } from '../runningHubInstanceTypes.js';
import { createRhAiAppConfigRepository } from './rhAiAppConfigRepository.js';
import { createRhAiAppPreviewDragController } from './rhAiAppPreviewDragController.js';
import { createRhAiAppPreviewPresentation } from './rhAiAppPreviewPresentation.js';
import { getDefaultRunningHubProfileId, assertRunningHubDefinitionProfile, getRunningHubProfileShortLabel, syncRunningHubProfileBadge } from './rhAiAppRunningHubProfile.js';
import { createCustomAiAppNodeBundleRegistry, getCustomAiAppBundleKey as a1336_0x2ec2d0, getCustomAiAppBundleModelId as a1336_0x4bbbd4, projectCustomAiAppBundleForNodeRuntime, registerCustomAiAppBundle as a1336_0x370b10, unregisterCustomAiAppBundle as a1336_0x4e4b90 } from './customAiAppNodeBundleRegistry.js';
const OUTPUT_KIND_LABELS = Object['freeze']({
  'image': '图像',
  'video': '视频',
  'audio': '音频'
});
const NODE_TYPE_BY_KIND = Object["freeze"]({
  'image': "ai-image",
  'video': 'ai-video',
  'audio': "ai-audio"
});
const COMPONENT_KIND_LABELS = Object['freeze']({
  'image': '图像入参',
  'video': "视频入参",
  'audio': "音频入参",
  'prompt': '提示词',
  'param': '参数'
});
const COMPONENT_KIND_OPTIONS = Object["freeze"]([["image", "图像入参"], ["video", "视频入参"], ['audio', '音频入参'], ["prompt", '提示词'], ["param", '参数']]);
const CONTROL_TYPE_LABELS = Object["freeze"]({
  'select': "下拉选项",
  'text': "短文本",
  'textarea': "长文本",
  'stepper': '整数',
  'float': '浮点数',
  'toggle': '布尔',
  'prompt': "提示词"
});
const CONTROL_TYPE_OPTIONS = Object['freeze']([["select", "下拉选项"], ["text", "短文本"], ["textarea", '长文本'], ["stepper", '整数'], ["float", '浮点数'], ['toggle', '布尔'], ["prompt", '提示词']]);
const MEDIA_COMPONENT_KINDS = new Set(["image", 'video', "audio"]);
const PREVIEW_CUSTOM_COMPONENT_LIMIT = RH_AI_APP_FOOTER_PARAM_LIMIT;
const PREVIEW_DROP_ZONES = Object["freeze"](["input", "prompt", 'params', 'advanced']);
const PREVIEW_TEXT_TYPE_VALUES = Object['freeze'](["prompt", "text", "textarea"]);
const PREVIEW_PARAM_TEXT_TYPE_VALUES = Object["freeze"](['text', "textarea"]);
const PREVIEW_PROMPT_HELP_FIELD_NAMES = Object['freeze'](['提示词', "prompt", '提示词.value', "prompt.value", "positive prompt", "positive_prompt"]);
const PREVIEW_DRAG_START_THRESHOLD_PX = 0xa;
const PREVIEW_RENAME_CLICK_TOLERANCE_PX = 0x3;
const PREVIEW_MOVE_ANIMATION_MS = 0x104;
const INPUT_SLOT_LABEL_MAX_WIDTH_UNITS = 0x12;
const INPUT_SLOT_LABEL_INPUT_MAX_LENGTH = 0x18;
const INPUT_SLOT_LABEL_WIDE_CHAR_RE = /[^\u0000-\u00ff]/u;
const INPUT_SLOT_LABEL_LATIN_RE = /^[\u0000-\u007f]+$/u;
const SOURCE_PAGE_ANIMATION_MS = 0x118;
const RH_AI_APP_EXIT_MOTION_MS = 0xb4;
const DEFAULT_AI_APP_NAME = "未命名 AI应用";
const JSON_FILE_EXTENSION_RE = /\.json$/i;
const RH_AI_APP_VIP_PROVIDER = "runninghubwf";
function escapeHtml(_0x3b9cfd) {
  return String(_0x3b9cfd ?? '')["replaceAll"]('&', "&amp;")["replaceAll"]('<', "&lt;")["replaceAll"]('>', "&gt;")["replaceAll"]('\x22', "&quot;")["replaceAll"]('\x27', "&#39;");
}
function normalizeKind(_0x57c8a3) {
  return Object["hasOwn"](OUTPUT_KIND_LABELS, _0x57c8a3) ? _0x57c8a3 : "image";
}
function shouldReduceMotion() {
  try {
    return window["matchMedia"]?.("(prefers-reduced-motion: reduce)")?.["matches"] === !![];
  } catch {
    return ![];
  }
}
function normalizeComponentKind(_0x50ad10) {
  return Object['hasOwn'](COMPONENT_KIND_LABELS, _0x50ad10) ? _0x50ad10 : "param";
}
function normalizeControlType(_0x10dbc0) {
  const _0x1e4d9a = String(_0x10dbc0 || '')["trim"]()["toLowerCase"]();
  if (_0x1e4d9a === "integer" || _0x1e4d9a === 'number') {
    return 'stepper';
  }
  if (_0x1e4d9a === "decimal") {
    return "float";
  }
  if (_0x1e4d9a === "boolean" || _0x1e4d9a === "bool") {
    return 'toggle';
  }
  return Object["hasOwn"](CONTROL_TYPE_LABELS, _0x1e4d9a) ? _0x1e4d9a : 'text';
}
function cloneComponentDrafts(_0x13cff8 = []) {
  return Array["isArray"](_0x13cff8) ? _0x13cff8['map'](_0x577210 => ({
    ..._0x577210
  })) : [];
}
function normalizeAppName(_0x5e165c) {
  const _0x1cc7a7 = String(_0x5e165c || '')["trim"]();
  return _0x1cc7a7 || DEFAULT_AI_APP_NAME;
}
function normalizeDroppedJsonAppName(_0x1be1c4) {
  const _0x4de468 = String(_0x1be1c4 || '')['split'](/[\\/]/)["pop"]()["replace"](JSON_FILE_EXTENSION_RE, '')["trim"]();
  return normalizeAppName(_0x4de468);
}
function isJsonFile(_0x4dde5f) {
  const _0x545c97 = String(_0x4dde5f?.["name"] || '')["trim"]();
  const _0x48a14b = String(_0x4dde5f?.["type"] || '')['trim']()["toLowerCase"]();
  return JSON_FILE_EXTENSION_RE["test"](_0x545c97) || _0x48a14b === 'application/json';
}
function hasFileDragPayload(_0x43e0c8) {
  return Array["from"](_0x43e0c8?.["dataTransfer"]?.["types"] || [])['some'](_0x5a0545 => String(_0x5a0545 || '')["toLowerCase"]() === "files");
}
function normalizeAppDescription(_0xf6bc4f) {
  return String(_0xf6bc4f || '')["trim"]();
}
function normalizePromptHelpTooltip(_0x305e84) {
  return String(_0x305e84 || '')["trim"]();
}
function getBundleDisplayName(_0x527c20) {
  return normalizeAppName(_0x527c20?.['models']?.[0x0]?.["displayName"]);
}
function getCanvasCenterWorld(_0x4baf4a = null) {
  const {
    viewport: _0x4af8b7
  } = graphStore["getState"]();
  const _0x8a7a88 = window["innerWidth"] / 0x2;
  const _0x4a84f4 = window['innerHeight'] / 0x2;
  const _0x4ef2b8 = document["documentElement"]?.["clientWidth"] || window["innerWidth"] || 0x0;
  const _0x3128e7 = document['documentElement']?.['clientHeight'] || window["innerHeight"] || 0x0;
  if (!_0x4ef2b8 || !_0x3128e7) {
    return screenToWorld(_0x8a7a88, _0x4a84f4, _0x4af8b7);
  }
  let _0xfd6b1f = 0x0;
  let _0x1f268b = 0x0;
  let _0x3d5576 = _0x4ef2b8;
  let _0x31d2d7 = _0x3128e7;
  const _0x327d5e = [document["querySelector"]("header"), document["querySelector"](".sidebar-floating"), _0x4baf4a?.["classList"]?.["contains"]("is-open") ? _0x4baf4a : null]["filter"](Boolean);
  const _0x23447b = 0x8;
  for (const _0x500a94 of _0x327d5e) {
    if (!_0x500a94?.["isConnected"]) {
      continue;
    }
    const _0x4bd393 = _0x500a94["getBoundingClientRect"]();
    const _0x27617b = Math['max'](_0xfd6b1f, _0x4bd393['left']);
    const _0x15ecb6 = Math["max"](_0x1f268b, _0x4bd393["top"]);
    const _0x33021a = Math['min'](_0x3d5576, _0x4bd393["right"]);
    const _0xc0092c = Math["min"](_0x31d2d7, _0x4bd393["bottom"]);
    if (_0x33021a <= _0x27617b || _0xc0092c <= _0x15ecb6) {
      continue;
    }
    if (_0x4bd393["left"] <= _0xfd6b1f + _0x23447b && _0x4bd393["right"] > _0xfd6b1f + _0x23447b) {
      _0xfd6b1f = Math['max'](_0xfd6b1f, _0x4bd393['right']);
      continue;
    }
    if (_0x4bd393["right"] >= _0x3d5576 - _0x23447b && _0x4bd393["left"] < _0x3d5576 - _0x23447b) {
      _0x3d5576 = Math['min'](_0x3d5576, _0x4bd393["left"]);
      continue;
    }
    if (_0x4bd393["top"] <= _0x1f268b + _0x23447b && _0x4bd393['bottom'] > _0x1f268b + _0x23447b) {
      _0x1f268b = Math["max"](_0x1f268b, _0x4bd393["bottom"]);
      continue;
    }
    _0x4bd393["bottom"] >= _0x31d2d7 - _0x23447b && _0x4bd393["top"] < _0x31d2d7 - _0x23447b && (_0x31d2d7 = Math["min"](_0x31d2d7, _0x4bd393["top"]));
  }
  const _0x5f28fb = _0x3d5576 - _0xfd6b1f;
  const _0x1b52c1 = _0x31d2d7 - _0x1f268b;
  const _0x556bab = _0x5f28fb > 0x28 ? _0xfd6b1f + _0x5f28fb / 0x2 : _0x8a7a88;
  const _0x14e561 = _0x1b52c1 > 0x28 ? _0x1f268b + _0x1b52c1 / 0x2 : _0x4a84f4;
  return screenToWorld(_0x556bab, _0x14e561, _0x4af8b7);
}
function getGenerationNodeSize(_0x406764) {
  if (_0x406764 === "ai-audio") {
    return {
      'width': 0x1a4,
      'height': 0xb4
    };
  }
  return getAIGenerationDefaultSizeByType(_0x406764);
}
function buildRhAiAppNodeData({
  bundle: _0x739a03,
  kind: _0x436bb7,
  center: _0x16b0a7,
  runningHubProfileId = ''
}) {
  const _0x4432bd = NODE_TYPE_BY_KIND[_0x436bb7] || "ai-image";
  const _0x4d778d = a1336_0x4bbbd4(_0x739a03);
  const _0x5d3c82 = getBundleDisplayName(_0x739a03);
  const _0x4c3385 = _0x739a03?.["models"]?.[0x0]?.["provider"] || "runninghubwf";
  const _0x5ecb1a = _0x4c3385 === 'runninghubwf' ? normalizeRunningHubModelApiProfileId(runningHubProfileId) : '';
  const _0x3cb83d = getGenerationNodeSize(_0x4432bd);
  const _0x182a92 = sanitizeModelUiSchemaParams(_0x4d778d, {}, {
    'includeDefaults': !![]
  });
  const _0x1e3dc7 = {
    'id': generateId(_0x4432bd),
    'type': _0x4432bd,
    'x': Math["round"](_0x16b0a7['x'] - _0x3cb83d["width"] / 0x2),
    'y': Math["round"](_0x16b0a7['y'] - _0x3cb83d["height"] / 0x2),
    'width': _0x3cb83d["width"],
    'height': _0x3cb83d["height"],
    'name': _0x5d3c82,
    'model': _0x4d778d,
    'provider': _0x4c3385,
    'generationParams': _0x182a92,
    'generationParamsByModel': {
      [_0x4d778d]: _0x182a92
    },
    ...(_0x5ecb1a ? {
      'providerProfileId': _0x5ecb1a,
      'rhProviderProfileId': _0x5ecb1a
    } : {}),
    'rhAiAppManifestBundle': projectCustomAiAppBundleForNodeRuntime(_0x739a03)
  };
  (_0x4432bd === "ai-image" || _0x4432bd === "ai-video") && (_0x1e3dc7["aspectRatio"] = "自适应");
  _0x4432bd === "ai-audio" && (_0x1e3dc7["audioWorkflowKey"] = _0x4d778d, _0x1e3dc7['audioWorkflowLabel'] = _0x5d3c82);
  return _0x1e3dc7;
}
function renderSummaryHtml(_0xde1dad, _0x1e5afc = SOURCE_TYPE_META[SOURCE_TYPES["runninghub"]]['emptyText']) {
  if (!_0xde1dad?.["modelId"]) {
    return '<div\x20class=\x22rh-ai-app-empty\x22>' + escapeHtml(_0x1e5afc) + '</div>';
  }
  const _0x7eec4a = _0xde1dad["slots"]["length"] ? _0xde1dad["slots"]["map"](_0x5c3887 => "<span class=\"rh-ai-app-chip\">" + escapeHtml(OUTPUT_KIND_LABELS[_0x5c3887['kind']] || _0x5c3887['kind']) + " · " + escapeHtml(_0x5c3887["label"]) + "</span>")["join"]('') : "<span class=\"rh-ai-app-muted\">无媒体入参槽</span>";
  const _0x407341 = _0xde1dad["params"]["length"] ? _0xde1dad["params"]['map'](_0x4a9409 => "<span class=\"rh-ai-app-chip\">" + escapeHtml(_0x4a9409["label"]) + '</span>')["join"]('') : "<span class=\"rh-ai-app-muted\">无额外参数</span>";
  return "\n    <div class=\"rh-ai-app-summary-card\">\n      <div class=\"rh-ai-app-summary-top\">\n        <span>" + escapeHtml(_0xde1dad["resourceIdLabel"] || "App ID") + "</span>\n        <strong>" + escapeHtml(_0xde1dad['appId']) + "</strong>\n      </div>\n      <div class=\"rh-ai-app-summary-row\">\n        <span>节点类型</span>\n        <strong>" + escapeHtml(OUTPUT_KIND_LABELS[_0xde1dad["kind"]] || _0xde1dad["kind"]) + "</strong>\n      </div>\n      <div class=\"rh-ai-app-summary-group\">\n        <div class=\"rh-ai-app-summary-label\">入参槽</div>\n        <div class=\"rh-ai-app-chip-row\">" + _0x7eec4a + "</div>\n      </div>\n      <div class=\"rh-ai-app-summary-group\">\n        <div class=\"rh-ai-app-summary-label\">参数</div>\n        <div class=\"rh-ai-app-chip-row\">" + _0x407341 + '</div>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</div>';
}
function renderOptionsHtml(_0x5ebab1, _0x2e4915) {
  const _0x468432 = String(_0x2e4915 || '');
  return _0x5ebab1["map"](([_0x376581, _0x11cde6]) => {
    const _0x479159 = String(_0x376581) === _0x468432 ? '\x20selected' : '';
    return '<option\x20value=\x22' + escapeHtml(_0x376581) + '\x22' + _0x479159 + '>' + escapeHtml(_0x11cde6) + '</option>';
  })['join']('');
}
function getOptionLabel(_0x2d0b49 = [], _0x4d9656 = '') {
  const _0x4ed271 = String(_0x4d9656 || '');
  const _0x99dc88 = _0x2d0b49["find"](([_0x530f8a]) => String(_0x530f8a) === _0x4ed271);
  return String(_0x99dc88?.[0x1] || _0x4ed271 || '');
}
function buildOptionsFromValues(_0x53cd56 = [], _0x423e49 = {}) {
  return (Array["isArray"](_0x53cd56) ? _0x53cd56 : [])["map"](_0x3c2747 => String(_0x3c2747 || '')["trim"]())["filter"]((_0x37673f, _0x243b51, _0x46a2aa) => _0x37673f && _0x46a2aa['indexOf'](_0x37673f) === _0x243b51)["filter"](_0x28b75 => Object['hasOwn'](_0x423e49, _0x28b75))["map"](_0xcbe478 => [_0xcbe478, _0x423e49[_0xcbe478]]);
}
function getComponentKindOptions(_0x5ca6b6, _0x376aac) {
  const _0x4ee893 = buildOptionsFromValues(_0x5ca6b6?.['componentKindOptions'], COMPONENT_KIND_LABELS);
  if (_0x4ee893["length"]) {
    return _0x4ee893;
  }
  if (_0x5ca6b6?.["componentKindLocked"] === !![] || isMediaComponent(_0x5ca6b6)) {
    return [[_0x376aac, COMPONENT_KIND_LABELS[_0x376aac] || _0x376aac]];
  }
  return COMPONENT_KIND_OPTIONS['filter'](([_0xfd2a5a]) => _0xfd2a5a === 'param' || _0xfd2a5a === 'prompt');
}
function getControlTypeOptions(_0x5c6185, _0x5103be) {
  const _0x1f9f46 = buildOptionsFromValues(_0x5c6185?.["controlTypeOptions"], CONTROL_TYPE_LABELS);
  if (_0x1f9f46["length"]) {
    return _0x1f9f46;
  }
  if (_0x5c6185?.["controlTypeLocked"] === !![]) {
    return [[_0x5103be, CONTROL_TYPE_LABELS[_0x5103be] || _0x5103be]];
  }
  return CONTROL_TYPE_OPTIONS["filter"](([_0x3ad071]) => _0x3ad071 !== "toggle" && _0x3ad071 !== "prompt");
}
function getPreviewTextTypeOptions(_0x315f87) {
  if (!_0x315f87 || isMediaComponent(_0x315f87)) {
    return [];
  }
  const _0x4fc4d1 = normalizeComponentKind(_0x315f87["componentKind"]);
  const _0x24cc39 = normalizeControlType(_0x315f87['controlType']);
  const _0x44a8f9 = getControlTypeOptions(_0x315f87, _0x24cc39);
  const _0x52d4e1 = getComponentKindOptions(_0x315f87, _0x4fc4d1);
  return PREVIEW_TEXT_TYPE_VALUES["filter"](_0x3c0a42 => {
    if (_0x3c0a42 === "prompt") {
      return _0x24cc39 === 'prompt' || optionValuesInclude(_0x44a8f9, 'prompt') || optionValuesInclude(_0x52d4e1, "prompt");
    }
    return _0x24cc39 === _0x3c0a42 || optionValuesInclude(_0x44a8f9, _0x3c0a42);
  })["map"](_0x3d8745 => [_0x3d8745, CONTROL_TYPE_LABELS[_0x3d8745] || _0x3d8745]);
}
function optionValuesInclude(_0xd7daeb = [], _0x4a5173 = '') {
  const _0x39ba5c = String(_0x4a5173 || '')['trim']();
  return _0xd7daeb["some"](([_0x1969e3]) => String(_0x1969e3) === _0x39ba5c);
}
function previewTextTypeOptionsInclude(_0x23a83a, _0x2bc5a5) {
  return optionValuesInclude(getPreviewTextTypeOptions(_0x23a83a), _0x2bc5a5);
}
function canPreviewComponentBecomePrompt(_0xa466de) {
  if (!_0xa466de || isMediaComponent(_0xa466de)) {
    return ![];
  }
  if (normalizeComponentKind(_0xa466de["componentKind"]) === "prompt") {
    return !![];
  }
  const _0x2a8abd = normalizeControlType(_0xa466de["controlType"]);
  if (!PREVIEW_PARAM_TEXT_TYPE_VALUES["includes"](_0x2a8abd)) {
    return ![];
  }
  return previewTextTypeOptionsInclude(_0xa466de, 'prompt');
}
function canPreviewPromptBecomeParam(_0x31bfc7) {
  if (normalizeComponentKind(_0x31bfc7?.["componentKind"]) !== "prompt") {
    return ![];
  }
  return PREVIEW_PARAM_TEXT_TYPE_VALUES["some"](_0x203959 => previewTextTypeOptionsInclude(_0x31bfc7, _0x203959));
}
function getPreviewPromptReturnControlType(_0x2281ea, _0x1e22ef = '') {
  const _0x2ba6cc = normalizeControlType(_0x1e22ef);
  if (PREVIEW_PARAM_TEXT_TYPE_VALUES["includes"](_0x2ba6cc) && previewTextTypeOptionsInclude(_0x2281ea, _0x2ba6cc)) {
    return _0x2ba6cc;
  }
  return PREVIEW_PARAM_TEXT_TYPE_VALUES["find"](_0x246175 => previewTextTypeOptionsInclude(_0x2281ea, _0x246175)) || '';
}
function renderPreviewTypeBarHtml(_0x51a36a, {
  canRemove = ![]
} = {}) {
  const _0x55b0f5 = Number(_0x51a36a?.["index"]);
  if (!Number["isInteger"](_0x55b0f5)) {
    return '';
  }
  const _0x599c08 = getPreviewTextTypeOptions(_0x51a36a);
  const _0x2bad1f = isParamComponent(_0x51a36a);
  const _0x4252c5 = isMediaComponent(_0x51a36a);
  const _0x52cf01 = _0x2bad1f || _0x4252c5;
  const _0x304c49 = _0x2bad1f || normalizeComponentKind(_0x51a36a?.['componentKind']) === "prompt";
  const _0x33527f = _0x2bad1f && canRemove === !![];
  const _0x3a25f5 = _0x4252c5 && canRemove === !![];
  if (!_0x599c08["length"] && !_0x52cf01 && !_0x304c49 && !_0x3a25f5) {
    return '';
  }
  const _0x3b1644 = normalizeComponentKind(_0x51a36a["componentKind"]) === "prompt" ? "prompt" : normalizeControlType(_0x51a36a["controlType"]);
  const _0x18876e = _0x4252c5 ? "入参槽" : '参数';
  const _0x57ee14 = _0x51a36a?.["label"] || _0x51a36a?.['fieldName'] || _0x18876e;
  const _0x5afbdb = _0x52cf01 ? "<button type=\"button\" class=\"rh-ai-app-preview-typebar-action rh-ai-app-preview-typebar-rename\" data-action=\"rename-preview-param\" data-preview-component-index=\"" + _0x55b0f5 + "\" aria-label=\"重命名" + _0x18876e + '\x20' + escapeHtml(_0x57ee14) + "\">重命名</button>" : '';
  const _0x1b2f4f = _0x304c49 ? '<button\x20type=\x22button\x22\x20class=\x22rh-ai-app-preview-typebar-action\x20rh-ai-app-preview-typebar-remark\x22\x20data-action=\x22edit-preview-description\x22\x20data-preview-component-index=\x22' + _0x55b0f5 + "\" aria-label=\"修改备注 " + escapeHtml(_0x57ee14) + '\x22>改备注</button>' : '';
  const _0x1806a1 = _0x599c08["map"](([_0x1e8fe0, _0xbc0dff]) => {
    const _0x3f54e1 = String(_0x1e8fe0) === _0x3b1644;
    return "<button type=\"button\" class=\"rh-ai-app-preview-typebar-option " + (_0x3f54e1 ? 'active' : '') + "\" data-action=\"choose-preview-control-type\" data-preview-component-index=\"" + _0x55b0f5 + '\x22\x20data-value=\x22' + escapeHtml(_0x1e8fe0) + "\" aria-pressed=\"" + (_0x3f54e1 ? 'true' : 'false') + '\x22>' + escapeHtml(_0xbc0dff) + '</button>';
  })["join"]('');
  const _0x8dc767 = (_0x33527f || _0x3a25f5) && !_0x1806a1 ? "<span class=\"rh-ai-app-preview-typebar-separator\" aria-hidden=\"true\">|</span>" : '';
  const _0x84d788 = _0x4252c5 ? 'remove-preview-input' : "remove-preview-param";
  const _0x5ef4f3 = _0x33527f || _0x3a25f5 ? "<button type=\"button\" class=\"rh-ai-app-preview-typebar-action rh-ai-app-preview-typebar-delete\" data-action=\"" + _0x84d788 + '\x22\x20data-preview-component-index=\x22' + _0x55b0f5 + "\" aria-label=\"删除" + _0x18876e + '\x20' + escapeHtml(_0x57ee14) + "\">×</button>" : '';
  return '<div\x20class=\x22rh-ai-app-preview-typebar\x22\x20aria-label=\x22组件工具栏\x22>' + _0x5afbdb + _0x1b2f4f + _0x1806a1 + _0x8dc767 + _0x5ef4f3 + "</div>";
}
function renderFixedTypeLabelHtml(_0x13c9dc, _0x168a6c = '') {
  return "<div class=\"rh-ai-app-component-fixed-type " + _0x168a6c + '\x22\x20aria-disabled=\x22true\x22>\x0a\x20\x20\x20\x20<span>' + escapeHtml(_0x13c9dc) + "</span>\n  </div>";
}
function renderComponentSelectHtml({
  className = '',
  ariaLabel = '',
  prop = '',
  options = [],
  activeValue = ''
} = {}) {
  const _0xadaf6b = String(activeValue || '');
  const _0x2c6490 = getOptionLabel(options, _0xadaf6b);
  const _0x2bc96f = options['map'](([_0x5e0fb9, _0x181437]) => {
    const _0x55aee3 = String(_0x5e0fb9) === _0xadaf6b;
    return "\n        <button type=\"button\" class=\"rh-ai-app-select-option " + (_0x55aee3 ? "active" : '') + "\" data-action=\"choose-component-select\" data-component-prop=\"" + escapeHtml(prop) + "\" data-value=\"" + escapeHtml(_0x5e0fb9) + "\" role=\"option\" aria-selected=\"" + (_0x55aee3 ? "true" : 'false') + "\" tabindex=\"-1\">\n          <span>" + escapeHtml(_0x181437) + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</button>';
  })['join']('');
  return '\x0a\x20\x20\x20\x20<div\x20class=\x22rh-ai-app-select\x20' + className + '\x22\x20data-component-select\x20data-component-prop=\x22' + escapeHtml(prop) + "\">\n      <button type=\"button\" class=\"rh-ai-app-select-trigger\" data-action=\"toggle-component-select\" data-component-prop=\"" + escapeHtml(prop) + "\" aria-label=\"" + escapeHtml(ariaLabel) + "\" aria-haspopup=\"listbox\" aria-expanded=\"false\">\n        <span>" + escapeHtml(_0x2c6490) + "</span>\n        <svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"m4 6 4 4 4-4\"></path></svg>\n      </button>\n      <div class=\"rh-ai-app-select-menu\" role=\"listbox\">\n        " + _0x2bc96f + "\n      </div>\n    </div>";
}
function isMediaComponent(_0x27dbf2) {
  return MEDIA_COMPONENT_KINDS['has'](normalizeComponentKind(_0x27dbf2?.["componentKind"]));
}
function isParamComponent(_0x50227e) {
  return normalizeComponentKind(_0x50227e?.["componentKind"]) === 'param';
}
function getParamComponents(_0x4393ee = []) {
  return _0x4393ee['filter'](_0x32a846 => {
    if (!_0x32a846 || !Number["isInteger"](Number(_0x32a846["index"]))) {
      return ![];
    }
    return isParamComponent(_0x32a846);
  });
}
function getPreviewParamText(_0x2bec43) {
  return String(_0x2bec43?.['label'] || _0x2bec43?.["fieldName"] || '参数')['trim']();
}
function getPreviewResolutionText(_0x5bb932 = []) {
  const _0x4797e5 = getParamComponents(_0x5bb932)["find"](_0x24286b => {
    const _0x473fd6 = String(_0x24286b?.["defaultValue"] || '')["trim"]();
    return _0x473fd6 && /^\d+(?:\.\d+)?$/["test"](_0x473fd6);
  });
  if (!_0x4797e5) {
    return "自适应";
  }
  return getPreviewParamText(_0x4797e5);
}
function getPreviewInstanceText(_0x50313f) {
  const _0x1155e1 = _0x50313f?.["models"]?.[0x0]?.["uiSchema"]?.["fields"] || [];
  const _0x1e4cf3 = _0x1155e1["find"](_0x11e71f => _0x11e71f?.['id'] === "rhInstanceType");
  if (!_0x1e4cf3) {
    return '';
  }
  return getRunningHubInstanceTypeLabel(_0x1e4cf3?.["defaultValue"]);
}
function normalizeOrderValue(_0x3db198, _0x401b77) {
  const _0x4c3471 = Number(_0x3db198);
  return Number["isFinite"](_0x4c3471) ? _0x4c3471 : _0x401b77;
}
function sortComponentsByOrder(_0x43b85b = [], _0xd014bd) {
  return [..._0x43b85b]["sort"]((_0x5588c7, _0x5ca7f5) => {
    const _0x26afc9 = Number(_0x5588c7?.["index"]);
    const _0xe304cc = Number(_0x5ca7f5?.["index"]);
    const _0x5877ce = normalizeOrderValue(_0x5588c7?.[_0xd014bd], _0x26afc9);
    const _0x1d35aa = normalizeOrderValue(_0x5ca7f5?.[_0xd014bd], _0xe304cc);
    if (_0x5877ce !== _0x1d35aa) {
      return _0x5877ce - _0x1d35aa;
    }
    return _0x26afc9 - _0xe304cc;
  });
}
function getPreviewInputComponents(_0x284d03 = []) {
  return sortComponentsByOrder(_0x284d03["filter"](_0xa103af => _0xa103af && Number['isInteger'](Number(_0xa103af["index"])) && isMediaComponent(_0xa103af)), "inputOrder");
}
function getInputSlotLabelWidthUnits(_0x108061) {
  if (!_0x108061) {
    return 0x0;
  }
  if (/\s/u["test"](_0x108061)) {
    return 0.5;
  }
  return INPUT_SLOT_LABEL_WIDE_CHAR_RE["test"](_0x108061) ? 0x2 : 0x1;
}
function clampInputSlotLabel(_0x2a9043, _0x2d8dd7 = INPUT_SLOT_LABEL_MAX_WIDTH_UNITS) {
  let _0x110a88 = 0x0;
  let _0x4f4f52 = '';
  for (const _0x2f7261 of Array["from"](String(_0x2a9043 ?? '')['trim']())) {
    const _0x1a1820 = getInputSlotLabelWidthUnits(_0x2f7261);
    if (_0x110a88 + _0x1a1820 > _0x2d8dd7) {
      break;
    }
    _0x4f4f52 += _0x2f7261;
    _0x110a88 += _0x1a1820;
  }
  return _0x4f4f52;
}
function normalizeInputSlotLabel(_0x4a0119, _0x418b3a = '组件') {
  const _0x27a36c = clampInputSlotLabel(_0x4a0119);
  if (_0x27a36c) {
    return _0x27a36c;
  }
  if (_0x418b3a === '') {
    return '';
  }
  return clampInputSlotLabel(_0x418b3a) || '组件';
}
function getInputSlotLabelClass(_0x452ab0) {
  return INPUT_SLOT_LABEL_LATIN_RE['test'](String(_0x452ab0 || '')) ? " rh-ai-app-preview-input-label--latin" : '';
}
function getPreviewHomeParamComponents(_0x208bc1 = []) {
  return sortComponentsByOrder(getParamComponents(_0x208bc1)["filter"](_0x58ac4b => _0x58ac4b["previewPlacement"] === "home"), "homeParamOrder")["slice"](0x0, PREVIEW_CUSTOM_COMPONENT_LIMIT);
}
function getPreviewAdvancedParamComponents(_0x4933f9 = []) {
  const _0xf4e56b = new Set(getPreviewHomeParamComponents(_0x4933f9)["map"](_0xc1394e => Number(_0xc1394e['index'])));
  return sortComponentsByOrder(getParamComponents(_0x4933f9)["filter"](_0x45d86a => !_0xf4e56b['has'](Number(_0x45d86a["index"]))), "advancedParamOrder");
}
function normalizePromptHelpFieldName(_0x48c711) {
  return String(_0x48c711 || '')["trim"]()["toLowerCase"]();
}
function isPreviewPromptHelpFieldName(_0x425c00) {
  const _0x5ce251 = normalizePromptHelpFieldName(_0x425c00);
  return PREVIEW_PROMPT_HELP_FIELD_NAMES["some"](_0x1fc8e7 => normalizePromptHelpFieldName(_0x1fc8e7) === _0x5ce251);
}
function isPreviewPromptHelpTextComponent(_0x36b045 = {}) {
  const _0x228f7a = normalizeControlType(_0x36b045["controlType"]);
  if (!PREVIEW_TEXT_TYPE_VALUES["includes"](_0x228f7a)) {
    return ![];
  }
  return [_0x36b045["label"], _0x36b045["fieldName"], _0x36b045["name"], _0x36b045['id'], _0x36b045['path']]["some"](isPreviewPromptHelpFieldName);
}
function getPreviewPromptHelpComponent(_0x49cd9a = []) {
  return _0x49cd9a['find'](_0xd85057 => normalizeComponentKind(_0xd85057?.["componentKind"]) === 'prompt') || _0x49cd9a["find"](isPreviewPromptHelpTextComponent) || null;
}
function shouldRefreshPreviewPromptForDraft(_0x39649f, _0x2f0145) {
  if (_0x2f0145 === "componentKind" || _0x2f0145 === "controlType" || _0x2f0145 === "label") {
    return !![];
  }
  if (_0x2f0145 === 'description') {
    return normalizeComponentKind(_0x39649f?.["componentKind"]) === 'prompt' || isPreviewPromptHelpTextComponent(_0x39649f);
  }
  return ![];
}
function buildComponentByIndex(_0x5e79e9 = []) {
  const _0x5ceea1 = new Map();
  _0x5e79e9["forEach"](_0x3b8675 => {
    const _0x249c9a = Number(_0x3b8675?.["index"]);
    if (Number["isInteger"](_0x249c9a)) {
      _0x5ceea1['set'](_0x249c9a, _0x3b8675);
    }
  });
  return _0x5ceea1;
}
function isPreviewSystemField(_0x386f53 = {}) {
  const _0x106ee2 = String(_0x386f53?.['id'] || '')['trim']();
  const _0x215fd6 = String(_0x386f53?.["placement"] || '')["trim"]();
  return _0x106ee2 === 'rhInstanceType' || _0x215fd6 === "batch" || _0x386f53?.['comfyUiSystemField'] === !![];
}
function getBundleParamFields(_0xd9b531) {
  const _0x794a18 = Array['isArray'](_0xd9b531?.["models"]?.[0x0]?.["uiSchema"]?.["fields"]) ? _0xd9b531['models'][0x0]["uiSchema"]["fields"] : [];
  return _0x794a18["filter"](_0x245d1c => !isPreviewSystemField(_0x245d1c));
}
function getCustomAiAppComponentIndex(_0x322bd9 = {}) {
  const _0x1e28f1 = Number(_0x322bd9?.["customAiAppComponentIndex"]);
  if (Number["isInteger"](_0x1e28f1)) {
    return _0x1e28f1;
  }
  const _0x16f239 = Number(_0x322bd9?.['rhAiAppComponentIndex']);
  if (Number['isInteger'](_0x16f239)) {
    return _0x16f239;
  }
  const _0x2b70f0 = Number(_0x322bd9?.["comfyUiComponentIndex"]);
  if (Number["isInteger"](_0x2b70f0)) {
    return _0x2b70f0;
  }
  return NaN;
}
function getPreviewAdvancedParamFields({
  bundle = null,
  components = []
} = {}) {
  const _0x13ead0 = new Set(getPreviewHomeParamComponents(components)["map"](_0x19e96c => Number(_0x19e96c["index"])));
  const _0x54462a = buildComponentByIndex(components);
  const _0x30deeb = new Map();
  return getBundleParamFields(bundle)["filter"]((_0x49bf40, _0x18399b) => {
    _0x30deeb["set"](_0x49bf40, _0x18399b);
    const _0x3a96e1 = getCustomAiAppComponentIndex(_0x49bf40);
    if (!Number["isInteger"](_0x3a96e1)) {
      return !![];
    }
    if (!_0x54462a['has'](_0x3a96e1)) {
      return !![];
    }
    return !_0x13ead0["has"](_0x3a96e1);
  })["sort"]((_0x3de1f6, _0x501320) => {
    const _0xeaac8b = getCustomAiAppComponentIndex(_0x3de1f6);
    const _0x63c540 = getCustomAiAppComponentIndex(_0x501320);
    const _0x1bf7e0 = Number["isInteger"](_0xeaac8b) ? _0x54462a["get"](_0xeaac8b) : null;
    const _0x41ff12 = Number["isInteger"](_0x63c540) ? _0x54462a["get"](_0x63c540) : null;
    const _0x35e530 = _0x1bf7e0 ? normalizeOrderValue(_0x1bf7e0["advancedParamOrder"], _0xeaac8b) : normalizeOrderValue(_0x3de1f6?.["displayOrder"], _0x30deeb['get'](_0x3de1f6) ?? Number["MAX_SAFE_INTEGER"]);
    const _0x5b77ff = _0x41ff12 ? normalizeOrderValue(_0x41ff12["advancedParamOrder"], _0x63c540) : normalizeOrderValue(_0x501320?.["displayOrder"], _0x30deeb["get"](_0x501320) ?? Number["MAX_SAFE_INTEGER"]);
    if (_0x35e530 !== _0x5b77ff) {
      return _0x35e530 - _0x5b77ff;
    }
    return (_0x30deeb['get'](_0x3de1f6) ?? 0x0) - (_0x30deeb["get"](_0x501320) ?? 0x0);
  });
}
function buildPreviewUiSchemaNodeData(_0x5e4537 = null) {
  const _0xd85537 = getBundleParamFields(_0x5e4537);
  return {
    'model': a1336_0x4bbbd4(_0x5e4537),
    'generationParams': _0xd85537['reduce']((_0x1beb16, _0x3ee23c) => {
      _0x1beb16[_0x3ee23c['id']] = _0x3ee23c['defaultValue'];
      return _0x1beb16;
    }, {})
  };
}
function renderPreviewBatchControlsHtml(_0x47b0f8 = null) {
  const _0x51d688 = a1336_0x4bbbd4(_0x47b0f8);
  if (!_0x51d688) {
    return '';
  }
  return renderModelUiSchemaControls(_0x51d688, buildPreviewUiSchemaNodeData(_0x47b0f8), {
    'placement': 'batch',
    'variant': "pillMenu"
  });
}
function renderPreviewInputComponentsHtml(_0x50c95c = [], {
  canRemovePreviewInputs = !![]
} = {}) {
  const _0x2a2e32 = getPreviewInputComponents(_0x50c95c);
  if (!_0x2a2e32["length"]) {
    return '';
  }
  return _0x2a2e32["map"]((_0x3a3e18, _0x473dc7) => {
    const _0x266278 = normalizeComponentKind(_0x3a3e18['componentKind']);
    const _0x296ede = String(_0x3a3e18['label'] || _0x3a3e18['fieldName'] || COMPONENT_KIND_LABELS[_0x266278] || '组件')['trim']();
    const _0x4254dc = normalizeInputSlotLabel(_0x296ede);
    const _0x2f27e1 = getInputSlotLabelClass(_0x4254dc);
    return "\n        <div role=\"button\" tabindex=\"0\" class=\"rh-ai-app-preview-component rh-ai-app-preview-draggable rh-ai-app-preview-input-slot ref-thumb-wrap ref-upload-slot rh-v5-ref-box\" data-preview-drag-kind=\"input\" data-preview-component-index=\"" + Number(_0x3a3e18["index"]) + "\" data-preview-order=\"" + _0x473dc7 + "\" aria-label=\"拖动调整入参顺序：" + escapeHtml(_0x296ede || _0x4254dc) + "\">\n          " + renderPreviewTypeBarHtml(_0x3a3e18, {
      'canRemove': canRemovePreviewInputs
    }) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22rh-ai-app-preview-input-slot-content\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22ref-upload-label\x20rh-ai-app-preview-rename-target' + _0x2f27e1 + "\" data-preview-component-index=\"" + Number(_0x3a3e18["index"]) + '\x22>' + escapeHtml(_0x4254dc) + "</span>\n          </span>\n        </div>";
  })["join"]('');
}
function getPreviewComponentDescription(_0x544cef, _0x5e89f0 = "参数说明") {
  return String(_0x544cef?.["description"] || _0x544cef?.["label"] || _0x544cef?.['fieldName'] || _0x5e89f0)["trim"]() || _0x5e89f0;
}
function getPreviewBundlePromptHelpTooltip(_0x17cbbf = null) {
  return String(_0x17cbbf?.['models']?.[0x0]?.["help"]?.['tooltip'] || _0x17cbbf?.['help']?.["tooltip"] || '')["trim"]();
}
function renderPreviewDescriptionTipHtml(_0x55068d, {
  className = '',
  ariaLabel = '编辑参数说明',
  fallback = "参数说明"
} = {}) {
  const _0x545e1a = Number(_0x55068d?.["index"]);
  if (!Number["isInteger"](_0x545e1a)) {
    return '';
  }
  const _0xd19cd4 = getPreviewComponentDescription(_0x55068d, fallback);
  const _0x178c87 = ['rh-tip', "ui-schema-info-tip", "rh-ai-app-preview-description-target", className]["filter"](Boolean)["join"]('\x20');
  return '<span\x20role=\x22button\x22\x20tabindex=\x220\x22\x20class=\x22' + _0x178c87 + "\" data-preview-component-index=\"" + _0x545e1a + "\" data-tooltip=\"" + escapeHtml(_0xd19cd4) + "\" title=\"" + escapeHtml(_0xd19cd4) + "\" aria-label=\"" + escapeHtml(ariaLabel) + '\x22>!</span>';
}
function renderPreviewPromptHelpTipHtml(_0x3b3765, {
  bundle = null
} = {}) {
  const _0x10fe23 = Number(_0x3b3765?.["index"]);
  const _0x38bb10 = Number['isInteger'](_0x10fe23);
  const _0x3a9ec5 = getPreviewBundlePromptHelpTooltip(bundle) || getPreviewComponentDescription(_0x3b3765, "提示词说明");
  const _0x2791e8 = ["rh-tip", "rh-ai-app-preview-description-target", "rh-ai-app-preview-prompt-help-tip"]["filter"](Boolean)["join"]('\x20');
  const _0x2e8025 = _0x38bb10 ? " data-preview-component-index=\"" + _0x10fe23 + '\x22' : '';
  const _0x56b87e = " data-preview-description-scope=\"prompt-help\"";
  return "<button type=\"button\" class=\"" + _0x2791e8 + '\x22' + _0x2e8025 + _0x56b87e + " data-tooltip=\"" + escapeHtml(_0x3a9ec5) + "\" title=\"" + escapeHtml(_0x3a9ec5) + "\" aria-label=\"编辑提示词说明\">!</button>";
}
function isPreviewToggleOn(_0x797502) {
  if (_0x797502 === !![]) {
    return !![];
  }
  if (_0x797502 === ![]) {
    return ![];
  }
  const _0x235c13 = String(_0x797502 ?? '')["trim"]()["toLowerCase"]();
  return ['true', '1', "yes", 'on']["includes"](_0x235c13);
}
function getPreviewToggleLabel(_0x10bcff) {
  return isPreviewToggleOn(_0x10bcff) ? '是' : '否';
}
function renderPreviewHomeParamsHtml(_0x5d0a79 = [], _0x26b273 = null, {
  canRemovePreviewParams = !![]
} = {}) {
  const _0x4da5d2 = getPreviewHomeParamComponents(_0x5d0a79);
  if (!_0x4da5d2['length']) {
    return '';
  }
  return _0x4da5d2["map"]((_0x474d96, _0x4a90df) => {
    const _0x1a4fdb = Number(_0x474d96["index"]);
    const _0x29f27b = _0x474d96["label"] || _0x474d96["fieldName"] || '参数';
    const _0x22ec27 = normalizeControlType(_0x474d96["controlType"]) === "toggle";
    const _0x319ce9 = getPreviewToggleLabel(_0x474d96["defaultValue"]);
    const _0x223597 = _0x22ec27 ? " is-toggle" : '';
    const _0x3dfee3 = _0x22ec27 ? "<button type=\"button\" class=\"rh-ai-app-preview-param-toggle\" data-action=\"toggle-preview-param-default\" data-preview-component-index=\"" + _0x1a4fdb + '\x22\x20aria-label=\x22切换\x20' + escapeHtml(_0x29f27b) + "，当前" + escapeHtml(_0x319ce9) + "\"><span class=\"rh-ai-app-preview-param-toggle-separator\" aria-hidden=\"true\">·</span><span class=\"rh-ai-app-preview-param-toggle-value\">" + escapeHtml(_0x319ce9) + "</span></button>" : '';
    return "\n        <div class=\"img-pill-btn ui-schema-menu-trigger rh-ai-app-preview-component rh-ai-app-preview-draggable rh-ai-app-preview-param-chip" + _0x223597 + "\" data-preview-drag-kind=\"param\" data-preview-component-index=\"" + _0x1a4fdb + "\" data-preview-order=\"" + _0x4a90df + "\">\n          " + renderPreviewTypeBarHtml(_0x474d96, {
      'canRemove': canRemovePreviewParams
    }) + "\n          <span class=\"rh-ai-app-preview-rename-target rh-ai-app-preview-param-label\" data-preview-component-index=\"" + _0x1a4fdb + '\x22>' + escapeHtml(_0x29f27b) + "</span>\n          " + _0x3dfee3 + "\n          <span class=\"rh-ai-app-preview-drag-pad\" aria-hidden=\"true\"></span>\n        </div>";
  })["join"]('');
}
function renderPreviewAdvancedPanelHtml({
  components = [],
  bundle = null
} = {}) {
  const _0x2c7eb0 = getPreviewAdvancedParamFields({
    'bundle': bundle,
    'components': components
  });
  const _0x2b2442 = _0x2c7eb0["length"] > 0x0 || getParamComponents(components)["length"] > 0x0;
  if (!_0x2b2442) {
    return '';
  }
  const _0x55fe1c = buildPreviewUiSchemaNodeData(bundle);
  const _0x370844 = _0x2c7eb0["length"] ? '' : " is-empty";
  return "\n    <div class=\"rh-adv-panel show rh-ai-app-preview-advanced-panel" + _0x370844 + "\" data-preview-zone=\"advanced\">\n      " + (_0x2c7eb0["length"] ? renderUiSchemaFields(_0x2c7eb0, _0x55fe1c, {
    'placement': "advanced"
  }) : "<div class=\"rh-ai-app-preview-advanced-empty\">拖回这里可放回高级设置</div>") + '\x0a\x20\x20\x20\x20</div>';
}
function renderControlTypeOptionsHtml(_0x6dce3d) {
  return renderOptionsHtml(CONTROL_TYPE_OPTIONS, normalizeControlType(_0x6dce3d));
}
function renderDefaultValueInputHtml(_0x4aa07e, _0x1a2b99) {
  const _0x66d1ee = String(_0x4aa07e["defaultValue"] ?? '');
  if (_0x1a2b99 === "toggle") {
    const _0xbadf9 = String(_0x66d1ee)["trim"]()["toLowerCase"]() === "true" ? "true" : "false";
    return renderComponentSelectHtml({
      'className': "rh-ai-app-component-default",
      'ariaLabel': '默认值',
      'prop': 'defaultValue',
      'options': [["true", "true"], ["false", "false"]],
      'activeValue': _0xbadf9
    });
  }
  const _0xd8ff6d = _0x1a2b99 === "stepper" || _0x1a2b99 === "float" ? 'number' : "text";
  const _0x1dc35a = _0x1a2b99 === "stepper" ? '\x20step=\x221\x22' : _0x1a2b99 === "float" ? '\x20step=\x22any\x22' : '';
  return "<input type=\"" + _0xd8ff6d + '\x22' + _0x1dc35a + " class=\"rh-ai-app-component-default\" aria-label=\"默认值\" data-component-prop=\"defaultValue\" value=\"" + escapeHtml(_0x66d1ee) + '\x22>';
}
function getNextHomeParamOrder(_0x4801e4 = []) {
  return Math["min"](getPreviewHomeParamComponents(_0x4801e4)["length"], PREVIEW_CUSTOM_COMPONENT_LIMIT - 0x1);
}
function assignSequentialOrder(_0xfe2cab = [], _0x4aa429) {
  _0xfe2cab["forEach"]((_0x19e6de, _0x2db1d7) => {
    _0x19e6de[_0x4aa429] = _0x2db1d7;
  });
}
function getComponentByIndex(_0x422a08 = [], _0x5501ff) {
  return _0x422a08["find"](_0x5b43f6 => Number(_0x5b43f6?.['index']) === Number(_0x5501ff)) || null;
}
function getComfyComponentDraftKey(_0x1e61a4 = {}) {
  const _0x160cfb = String(_0x1e61a4?.["componentKey"] || '')["trim"]();
  if (_0x160cfb) {
    return _0x160cfb;
  }
  return [_0x1e61a4?.["nodeId"], _0x1e61a4?.["classType"], _0x1e61a4?.["inputName"]]['map'](_0x875978 => String(_0x875978 || '')["trim"]()['toLowerCase']())["join"]('::');
}
function mergeComfyComponentDraft(_0x3607c9 = {}, _0x16a83c = {}) {
  const _0x1effd9 = {
    ..._0x3607c9
  };
  ["label", "defaultValue", "inputOrder", 'homeParamOrder', 'advancedParamOrder', "previewPlacement", 'required']["forEach"](_0x5e62ae => {
    if (Object["hasOwn"](_0x16a83c, _0x5e62ae)) {
      _0x1effd9[_0x5e62ae] = _0x16a83c[_0x5e62ae];
    }
  });
  _0x3607c9["componentKindLocked"] !== !![] && Object["hasOwn"](_0x16a83c, "componentKind") && (_0x1effd9['componentKind'] = _0x16a83c["componentKind"]);
  _0x3607c9['controlTypeLocked'] !== !![] && Object['hasOwn'](_0x16a83c, "controlType") && (_0x1effd9['controlType'] = _0x16a83c["controlType"]);
  return _0x1effd9;
}
function preserveComfyComponentDrafts(_0x284dbf = [], _0x816f0e = []) {
  const _0x1bca4e = new Map();
  const _0x2163ff = new Map();
  _0x816f0e['forEach'](_0x42a35d => {
    const _0x57ca7d = Number(_0x42a35d?.["index"]);
    if (Number["isInteger"](_0x57ca7d)) {
      _0x1bca4e["set"](_0x57ca7d, _0x42a35d);
    }
    const _0x20634b = getComfyComponentDraftKey(_0x42a35d);
    if (_0x20634b) {
      _0x2163ff["set"](_0x20634b, _0x42a35d);
    }
  });
  const _0x6dba42 = new Set();
  return cloneComponentDrafts(_0x284dbf)["map"](_0x1b6ece => {
    const _0x3dbab2 = getComfyComponentDraftKey(_0x1b6ece);
    const _0x28190c = _0x3dbab2 ? _0x2163ff["get"](_0x3dbab2) : null;
    const _0x3d706a = _0x1bca4e['get'](Number(_0x1b6ece?.["index"]));
    const _0x13a7c5 = _0x28190c || _0x3d706a || null;
    const _0x3a8ee4 = Number(_0x13a7c5?.["index"]);
    if (!_0x13a7c5 || _0x6dba42['has'](_0x3a8ee4)) {
      return null;
    }
    _0x6dba42["add"](_0x3a8ee4);
    return mergeComfyComponentDraft(_0x13a7c5, _0x1b6ece);
  })["filter"](Boolean);
}
function moveComponentToOrder(_0x24c387 = [], _0x13dfc9, _0x9817db, _0x5868bc) {
  const _0x4b0add = getComponentByIndex(_0x24c387, _0x13dfc9);
  if (!_0x4b0add) {
    return ![];
  }
  const _0x3e1466 = sortComponentsByOrder(_0x24c387, _0x9817db)["filter"](_0xa01e95 => Number(_0xa01e95['index']) !== Number(_0x13dfc9));
  const _0x5adb34 = Math["max"](0x0, Math["min"](_0x3e1466['length'], Number(_0x5868bc) || 0x0));
  _0x3e1466["splice"](_0x5adb34, 0x0, _0x4b0add);
  assignSequentialOrder(_0x3e1466, _0x9817db);
  return !![];
}
function renderSavedAppsMenuHtml({
  savedApps = [],
  pendingDeleteSavedAppId = '',
  pendingOverwriteSavedAppId = '',
  pendingOverwriteIntent = ''
} = {}) {
  if (!savedApps["length"]) {
    return "<div class=\"rh-ai-app-saved-app-empty\">暂无已保存子应用</div>";
  }
  return savedApps["map"](_0x2b8f43 => {
    const _0x36a546 = String(_0x2b8f43['id'] || '');
    const _0x5d05f1 = normalizeAppName(_0x2b8f43["name"]);
    if (_0x36a546 === pendingDeleteSavedAppId) {
      return "\n          <div class=\"rh-ai-app-saved-app-row is-confirming\" data-saved-app-id=\"" + escapeHtml(_0x36a546) + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-ai-app-saved-app-confirm-text\x22>是否删除「' + escapeHtml(_0x5d05f1) + "」？</div>\n            <div class=\"rh-ai-app-saved-app-confirm-actions\">\n              <button type=\"button\" data-action=\"confirm-delete-app\" data-saved-app-id=\"" + escapeHtml(_0x36a546) + '\x22>删除</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20data-action=\x22cancel-delete-app\x22>取消</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>';
    }
    if (_0x36a546 === pendingOverwriteSavedAppId) {
      const _0x13cfe1 = pendingOverwriteIntent === "create" ? '覆盖后继续生成节点。' : '覆盖后保存当前配置。';
      return "\n          <div class=\"rh-ai-app-saved-app-row is-confirming is-overwrite-confirming\" data-saved-app-id=\"" + escapeHtml(_0x36a546) + "\">\n            <div class=\"rh-ai-app-saved-app-confirm-text\">已存在同名应用「" + escapeHtml(_0x5d05f1) + '」，是否覆盖？</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-ai-app-saved-app-confirm-note\x22>' + escapeHtml(_0x13cfe1) + "</div>\n            <div class=\"rh-ai-app-saved-app-confirm-actions\">\n              <button type=\"button\" data-action=\"confirm-overwrite-app\" data-saved-app-id=\"" + escapeHtml(_0x36a546) + '\x22>覆盖</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20data-action=\x22cancel-overwrite-app\x22>取消</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>';
    }
    const _0x2a290a = OUTPUT_KIND_LABELS[_0x2b8f43["kind"]] || _0x2b8f43["kind"] || '';
    const _0x4b48b2 = normalizeSourceType(_0x2b8f43["sourceType"]) || SOURCE_TYPES["runninghub"];
    const _0x2d27f1 = isComfyUiSource(_0x4b48b2) ? getComfyUiBaseUrlModeLabel(_0x4b48b2) : getRunningHubProfileShortLabel(_0x2b8f43["runningHubProfileId"]);
    const _0x35c9ad = [_0x2a290a, _0x2d27f1]["filter"](Boolean)['join']('\x20·\x20');
    return "\n        <div class=\"rh-ai-app-saved-app-row\" data-saved-app-id=\"" + escapeHtml(_0x36a546) + "\">\n          <button type=\"button\" class=\"rh-ai-app-saved-app-item\" data-action=\"load-saved-app\" data-saved-app-id=\"" + escapeHtml(_0x36a546) + "\">\n            <span>" + escapeHtml(_0x5d05f1) + "</span>\n            <small>" + escapeHtml(_0x35c9ad) + "</small>\n          </button>\n          <button type=\"button\" class=\"rh-ai-app-saved-app-delete\" data-action=\"request-delete-app\" data-saved-app-id=\"" + escapeHtml(_0x36a546) + "\" aria-label=\"删除 " + escapeHtml(_0x5d05f1) + "\">×</button>\n        </div>";
  })["join"]('');
}
function renderSaveConfigOverwriteMenuHtml({
  savedApp = null,
  intent = 'save'
} = {}) {
  const _0x27bea8 = String(savedApp?.['id'] || '')['trim']();
  if (!_0x27bea8) {
    return '';
  }
  const _0x2d5553 = normalizeAppName(savedApp['name']);
  const _0x2e9429 = intent === "create" ? "覆盖后继续生成节点。" : '覆盖后保存当前配置。';
  return "\n    <div class=\"rh-ai-app-save-config-overwrite\" data-saved-app-id=\"" + escapeHtml(_0x27bea8) + "\">\n      <div class=\"rh-ai-app-saved-app-confirm-text\">已存在同名应用「" + escapeHtml(_0x2d5553) + "」，是否覆盖？</div>\n      <div class=\"rh-ai-app-saved-app-confirm-note\">" + escapeHtml(_0x2e9429) + "</div>\n      <div class=\"rh-ai-app-saved-app-confirm-actions\">\n        <button type=\"button\" data-action=\"confirm-overwrite-app\" data-saved-app-id=\"" + escapeHtml(_0x27bea8) + '\x22>覆盖</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20data-action=\x22cancel-overwrite-app\x22>取消</button>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</div>';
}
function getComfyUiCandidateSearchText(_0x22e2a9 = {}) {
  return [_0x22e2a9["label"], _0x22e2a9['nodeId'], _0x22e2a9["nodeTitle"], _0x22e2a9["classType"], _0x22e2a9["inputName"]]["map"](_0x13fcf9 => String(_0x13fcf9 || '')["trim"]()['toLowerCase']())['filter'](Boolean)['join']('\x20');
}
function filterComfyUiCandidates(_0xfe5aeb = [], _0x28022c = new Set(), _0x242cfd = '') {
  const _0x2cda21 = String(_0x242cfd || '')['trim']()['toLowerCase']();
  return (Array["isArray"](_0xfe5aeb) ? _0xfe5aeb : [])['filter'](_0x5e06fe => {
    const _0x3f8a2b = Number(_0x5e06fe?.["index"]);
    if (!Number["isInteger"](_0x3f8a2b) || _0x28022c["has"](_0x3f8a2b)) {
      return ![];
    }
    return !_0x2cda21 || getComfyUiCandidateSearchText(_0x5e06fe)['includes'](_0x2cda21);
  });
}
function getComfyUiCandidateDefaultComponentName(_0x47b236 = {}) {
  return formatComfyUiComponentLabel(_0x47b236);
}
function getComfyUiCandidateMenuMeta(_0x5b08f2 = {}) {
  return [_0x5b08f2["nodeId"], _0x5b08f2['classType'], _0x5b08f2["inputName"]]['filter'](_0x452e37 => String(_0x452e37 || '')['trim']())["join"](" / ") || getComfyUiCandidateDefaultComponentName(_0x5b08f2);
}
function renderComfyUiCandidateMenuHtml(_0x227ee4 = [], _0x260763 = new Set(), _0x4a78ae = '') {
  const _0x3feda5 = (Array["isArray"](_0x227ee4) ? _0x227ee4 : [])["filter"](_0x20b691 => {
    const _0x3db2a5 = Number(_0x20b691?.["index"]);
    return Number["isInteger"](_0x3db2a5) && !_0x260763['has'](_0x3db2a5);
  });
  const _0x34c747 = filterComfyUiCandidates(_0x227ee4, _0x260763, _0x4a78ae);
  if (!_0x3feda5["length"]) {
    return "<div class=\"rh-ai-app-candidate-empty\">暂无可添加组件</div>";
  }
  if (!_0x34c747["length"]) {
    return "<div class=\"rh-ai-app-candidate-empty\">没有匹配的节点输入</div>";
  }
  const _0x37a67c = _0x34c747["map"](_0x43518f => {
    const _0x49383b = Number(_0x43518f["index"]);
    const _0xe77fda = getComfyUiCandidateDefaultComponentName(_0x43518f);
    const _0x170f6b = getComfyUiCandidateMenuMeta(_0x43518f);
    const _0x49135e = _0x170f6b ? "<span class=\"rh-ai-app-candidate-meta\">" + escapeHtml(_0x170f6b) + "</span>" : '';
    return "\n        <button type=\"button\" class=\"rh-ai-app-candidate-option\" data-action=\"choose-comfy-candidate\" data-component-index=\"" + _0x49383b + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22rh-ai-app-candidate-topline\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22rh-ai-app-candidate-title\x22>' + escapeHtml(_0xe77fda) + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + _0x49135e + "\n          </span>\n        </button>";
  })["join"]('');
  return "<div class=\"rh-ai-app-candidate-options\">" + _0x37a67c + "</div>";
}
function renderComfyUiComponentAddPanelHtml({
  show = ![],
  canAdd = !![],
  hasComponents = ![],
  emptyText = '',
  isOpen = ![],
  searchText = ''
} = {}) {
  if (!show) {
    return '';
  }
  const _0x44f167 = hasComponents ? "继续选择工作流输入，新增组件会直接加入节点组件编辑。" : emptyText || "点击添加组件，逐行选择要暴露到节点上的工作流输入。";
  const _0x58f3c9 = isOpen ? "收起组件" : '点击添加组件';
  const _0x3b5ebf = canAdd ? '' : '\x20disabled';
  return "\n    <div class=\"rh-ai-app-comfy-add-panel " + (isOpen ? "is-open" : '') + "\">\n      <div class=\"rh-ai-app-comfy-add-panel-head\">\n        <button type=\"button\" class=\"rh-ai-app-secondary rh-ai-app-add-component\" data-action=\"toggle-comfy-candidate-select\" aria-expanded=\"" + (isOpen ? 'true' : 'false') + '\x22' + _0x3b5ebf + '>' + _0x58f3c9 + "</button>\n        <div class=\"rh-ai-app-comfy-head-slot\">\n          <div class=\"rh-ai-app-comfy-add-hint\">" + escapeHtml(_0x44f167) + "</div>\n          <label class=\"rh-ai-app-candidate-search\">\n            <span>搜索组件</span>\n            <input type=\"search\" data-role=\"comfyui-candidate-search\" value=\"" + escapeHtml(searchText) + "\" placeholder=\"搜索节点 ID、节点名字、输入名\" aria-label=\"搜索组件\">\n          </label>\n        </div>\n      </div>\n      <div class=\"rh-ai-app-candidate-menu\" data-role=\"comfyui-candidate-menu\" aria-hidden=\"" + (isOpen ? "false" : 'true') + '\x22></div>\x0a\x20\x20\x20\x20</div>';
}
function renderPreviewAppMenuHtml({
  appName = DEFAULT_AI_APP_NAME,
  savedApps = [],
  isOpen = ![],
  pendingDeleteSavedAppId = '',
  pendingOverwriteSavedAppId = '',
  pendingOverwriteIntent = '',
  sourceLabel = "RH AI应用"
} = {}) {
  if (!isOpen) {
    return '';
  }
  const _0x1edd9b = normalizeAppName(appName);
  return "\n    <div class=\"rh-ai-app-preview-app-menu\" data-role=\"saved-app-menu\">\n      <div class=\"rh-ai-app-preview-app-menu-title\">" + escapeHtml(sourceLabel) + "</div>\n      <div class=\"rh-ai-app-current-app-row\">\n        <button type=\"button\" class=\"rh-ai-app-current-app-item active\" data-action=\"rename-current-app\">\n          <span>" + escapeHtml(_0x1edd9b) + "</span>\n          <small>当前创建</small>\n        </button>\n      </div>\n      <div class=\"rh-ai-app-preview-app-menu-subtitle\">已保存子应用</div>\n      " + renderSavedAppsMenuHtml({
    'savedApps': savedApps,
    'pendingDeleteSavedAppId': pendingDeleteSavedAppId,
    'pendingOverwriteSavedAppId': pendingOverwriteSavedAppId,
    'pendingOverwriteIntent': pendingOverwriteIntent
  }) + "\n    </div>";
}
function renderRhAiAppNodePreviewHtml({
  components = [],
  kind = "image",
  bundle = null,
  appName = DEFAULT_AI_APP_NAME,
  savedApps = [],
  isAppMenuOpen = ![],
  pendingDeleteSavedAppId = '',
  pendingOverwriteSavedAppId = '',
  pendingOverwriteIntent = '',
  sourceLabel = "RH AI应用",
  runningHubProfileLabel = '',
  showComfyAddPanel = ![],
  canAddComfyComponents = !![],
  comfyCandidatePickerOpen = ![],
  comfyCandidateSearchText = '',
  comfyCandidateEmptyText = '',
  canRemovePreviewParams = !![],
  canRemovePreviewInputs = !![]
} = {}) {
  const _0x763acc = components["find"](_0x3416b5 => normalizeComponentKind(_0x3416b5?.['componentKind']) === "prompt");
  const _0x1eabec = getPreviewPromptHelpComponent(components);
  const _0x1c3e89 = (_0x763acc || _0x1eabec)?.["label"] ? '填写' + (_0x763acc || _0x1eabec)["label"] + "，按 @ 引用素材，/呼出指令..." : '描述' + (OUTPUT_KIND_LABELS[kind] || '生成') + '内容，按\x20@\x20引用素材，/呼出指令...';
  const _0x42b52e = Number(_0x763acc?.["index"]);
  const _0xf5ca44 = Number['isInteger'](_0x42b52e) ? " data-preview-component-index=\"" + _0x42b52e + '\x22' : '';
  const _0x3bde7f = Number['isInteger'](_0x42b52e) ? " rh-ai-app-preview-prompt-target" : '';
  const _0x4b0d07 = _0x763acc && canPreviewPromptBecomeParam(_0x763acc) ? " rh-ai-app-preview-draggable rh-ai-app-preview-prompt-draggable" : '';
  const _0x20a391 = _0x763acc && canPreviewPromptBecomeParam(_0x763acc) ? " data-preview-drag-kind=\"prompt\"" : '';
  const _0x41ef05 = getPreviewInstanceText(bundle);
  const _0x55e28b = renderPreviewBatchControlsHtml(bundle);
  const _0x4a669b = renderComfyUiComponentAddPanelHtml({
    'show': showComfyAddPanel,
    'canAdd': canAddComfyComponents,
    'hasComponents': components['length'] > 0x0,
    'emptyText': comfyCandidateEmptyText,
    'isOpen': canAddComfyComponents && comfyCandidatePickerOpen === !![],
    'searchText': comfyCandidateSearchText
  });
  return "\n    " + _0x4a669b + "\n    <div class=\"rh-ai-app-node-preview-card rh-ai-app-preview-node\" data-preview-node-kind=\"" + escapeHtml(kind) + "\">\n      <div class=\"text-prompt-panel rh-ai-app-real-preview-panel\" data-role=\"preview-canvas\">\n        " + renderPreviewPromptHelpTipHtml(_0x1eabec, {
    'bundle': bundle
  }) + "\n        <div class=\"node-ref-bar active rh-v5-refbar rh-ai-app-preview-input-zone\" data-preview-zone=\"input\">\n          " + renderPreviewInputComponentsHtml(components, {
    'canRemovePreviewInputs': canRemovePreviewInputs
  }) + "\n        </div>\n        <div class=\"prompt-input-wrapper rh-ai-app-preview-input rh-ai-app-preview-prompt-zone" + _0x3bde7f + _0x4b0d07 + "\" data-preview-zone=\"prompt\"" + _0xf5ca44 + _0x20a391 + ">\n          " + (_0x763acc ? renderPreviewTypeBarHtml(_0x763acc, {
    'canRemove': canRemovePreviewParams
  }) : '') + "\n          <div class=\"prompt-textarea rh-ai-app-preview-prompt\" data-placeholder=\"" + escapeHtml(_0x1c3e89) + "\"></div>\n        </div>\n        <div class=\"prompt-panel-footer\">\n          <div class=\"img-model-pills\">\n            <div class=\"img-model-wrap\">\n              <button type=\"button\" class=\"img-pill-btn img-model-btn-trigger rh-ai-app-preview-model-trigger\" data-action=\"toggle-app-menu\" title=\"单击打开 " + escapeHtml(sourceLabel) + '\x20菜单，双击修改名字\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<img\x20class=\x22image-model-trigger-icon\x22\x20src=\x22images/RH.png\x22\x20alt=\x22\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22rh-ai-app-preview-runtime-badge\x22\x20data-role=\x22preview-runninghub-runtime-label\x22' + (runningHubProfileLabel ? '' : '\x20hidden') + '>' + escapeHtml(runningHubProfileLabel) + "</span>\n                <span class=\"img-model-label\">" + escapeHtml(normalizeAppName(appName)) + "</span>\n              </button>\n              " + renderPreviewAppMenuHtml({
    'appName': appName,
    'savedApps': savedApps,
    'isOpen': isAppMenuOpen,
    'pendingDeleteSavedAppId': pendingDeleteSavedAppId,
    'pendingOverwriteSavedAppId': pendingOverwriteSavedAppId,
    'pendingOverwriteIntent': pendingOverwriteIntent,
    'sourceLabel': sourceLabel
  }) + "\n            </div>\n          </div>\n          <div class=\"ui-schema-placement rh-ai-app-preview-param-zone\" data-preview-zone=\"params\">\n            " + renderPreviewHomeParamsHtml(components, bundle, {
    'canRemovePreviewParams': canRemovePreviewParams
  }) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22prompt-actions\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-adv-wrap\x20rh-ai-app-preview-adv-wrap\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22img-pill-btn\x20rh-adv-btn\x22\x20tabindex=\x22-1\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22rh-adv-btn-label\x22></span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22ui-schema-placement\x20ui-schema-instance-slot\x22' + (_0x41ef05 ? '' : " hidden") + ">\n              <button type=\"button\" class=\"img-pill-btn rh-vram-btn\" tabindex=\"-1\">\n                <span class=\"rh-vram-label\">" + escapeHtml(_0x41ef05) + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22ui-schema-placement\x20ui-schema-batch-slot\x22' + (_0x55e28b ? '' : '\x20hidden') + '>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + _0x55e28b + "\n            </div>\n            <button type=\"button\" class=\"prompt-submit img-gen-btn\" tabindex=\"-1\" aria-label=\"生成\">\n              <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"5\"></line><polyline points=\"5 12 12 5 19 12\"></polyline></svg>\n            </button>\n          </div>\n        </div>\n        " + renderPreviewAdvancedPanelHtml({
    'components': components,
    'bundle': bundle
  }) + "\n      </div>\n    </div>";
}
function renderAppNameConfigHtml(_0x20888d = DEFAULT_AI_APP_NAME, _0x35c489 = '') {
  return "\n    <div class=\"rh-ai-app-component-row rh-ai-app-app-name-row\">\n      <label class=\"rh-ai-app-meta-field\">\n        <span class=\"rh-ai-app-component-static-label\">AI应用名称</span>\n        <input type=\"text\" class=\"rh-ai-app-name-input\" aria-label=\"AI应用名称\" data-app-prop=\"appName\" value=\"" + escapeHtml(_0x20888d) + "\">\n      </label>\n      <label class=\"rh-ai-app-meta-field\">\n        <span class=\"rh-ai-app-component-static-label\">简介</span>\n        <input type=\"text\" class=\"rh-ai-app-description-input\" aria-label=\"简介\" data-app-prop=\"appDescription\" value=\"" + escapeHtml(_0x35c489) + "\" placeholder=\"填写应用简介\">\n      </label>\n    </div>";
}
function renderComponentConfigHtml(_0x46b47f = [], _0x4a07e0 = DEFAULT_AI_APP_NAME, _0x10af2c = '', _0x162dba = {}) {
  return renderAppNameConfigHtml(_0x4a07e0, _0x10af2c);
}
class RunningHubAiAppManager {
  constructor() {
    this['panel'] = null;
    this['button'] = null;
    this["textarea"] = null;
    this["builderEl"] = null;
    this['sourceSelectEl'] = null;
    this["workbenchEl"] = null;
    this['bodyEl'] = null;
    this["kindTabsEl"] = null;
    this["sourceBackBtn"] = null;
    this["nodePreviewEl"] = null;
    this["componentListEl"] = null;
    this["componentPickerEl"] = null;
    this["summaryEl"] = null;
    this["errorEl"] = null;
    this["saveBtn"] = null;
    this["saveConfigMenuEl"] = null;
    this["createConfigMenuEl"] = null;
    this["createBtn"] = null;
    this["runtimeToggleEl"] = null;
    this['runningHubRuntimeToggleEl'] = null;
    this["sourceType"] = '';
    this["definitionReference"] = '';
    this["definitionController"] = createRhAiAppDefinitionController(this);
    this['kind'] = "image";
    this["runningHubProfileId"] = getDefaultRunningHubProfileId();
    this["appName"] = DEFAULT_AI_APP_NAME;
    this["appDescription"] = '';
    this["promptHelpTooltip"] = '';
    this["savedAppId"] = '';
    this['currentBundle'] = null;
    this["componentDrafts"] = [];
    this["componentCandidates"] = [];
    this["componentDraftKey"] = '';
    this["comfyCandidateSearchText"] = '';
    this["comfyCandidatePickerOpen"] = ![];
    this["workflowInputCollapsed"] = ![];
    this["errorMessage"] = '';
    this["configRepository"] = createRhAiAppConfigRepository({
      'getSnapshot': () => this["_getConfigRepositorySnapshot"](),
      'applyExternalSnapshot': _0x383fac => this["_applyExternalStoragePayload"](_0x383fac)
    });
    const _0x367023 = this["configRepository"]["loadLocalSeed"]();
    this["kindStates"] = this['configRepository']["createInitialKindStates"]();
    const _0x521ff5 = _0x367023['panelDraft'];
    _0x521ff5 && (this["sourceType"] = _0x521ff5['sourceType'] || '', this['kind'] = _0x521ff5["kind"], this["kindStates"] = _0x521ff5["kindStates"]);
    this['savedApps'] = _0x367023['savedApps'];
    this["localStorageSeedHasData"] = _0x367023["hasData"];
    this["previewAppMenuOpen"] = ![];
    this['pendingDeleteSavedAppId'] = '';
    this["pendingOverwriteSavedAppId"] = '';
    this['pendingOverwriteIntent'] = '';
    this["parseTimer"] = 0x0;
    this["saveSuccessTimer"] = 0x0;
    this["sourceViewAnimationTimer"] = 0x0;
    this["sourceViewTransitionDirection"] = '';
    this["workflowJsonDragDepth"] = 0x0;
    this['registeredBundleKeys'] = new Set();
    this["nodeBundleRegistry"] = createCustomAiAppNodeBundleRegistry({
      'registerBundle': (_0x2068a0, _0x498402) => a1336_0x370b10(_0x2068a0, this["registeredBundleKeys"], _0x498402),
      'unregisterBundle': _0x2cb94e => a1336_0x4e4b90(_0x2cb94e, this["registeredBundleKeys"]),
      'isBundleRegistered': _0x317f6f => this["registeredBundleKeys"]['has'](_0x317f6f)
    });
    this['unsubscribeNodes'] = null;
    this["previewPresentation"] = createRhAiAppPreviewPresentation({
      'readState': () => ({
        'nodePreviewEl': this['nodePreviewEl'],
        'componentDrafts': this["componentDrafts"],
        'kind': this['kind'],
        'currentBundle': this['currentBundle'],
        'appName': this["appName"],
        'runningHubProfileLabel': this['_isRunningHubAiAppSource']() ? getRunningHubProfileShortLabel(this['runningHubProfileId']) : '',
        'previewAppMenuOpen': this["previewAppMenuOpen"],
        'pendingDeleteSavedAppId': this["pendingDeleteSavedAppId"],
        'pendingOverwriteSavedAppId': this["pendingOverwriteSavedAppId"],
        'pendingOverwriteIntent': this["pendingOverwriteIntent"],
        'componentDraftKey': this["componentDraftKey"],
        'comfyCandidatePickerOpen': this["comfyCandidatePickerOpen"],
        'comfyCandidateSearchText': this['comfyCandidateSearchText'],
        'saveConfigMenuEl': this["saveConfigMenuEl"],
        'createConfigMenuEl': this['createConfigMenuEl']
      }),
      'writeState': _0x17166e => Object["assign"](this, _0x17166e),
      'actions': {
        'getSavedAppsForKind': () => this["_getSavedAppsForKind"](),
        'getSourceMeta': () => this["_getSourceMeta"](),
        'syncRunningHubProfileBadge': _0xf64bb5 => syncRunningHubProfileBadge(_0xf64bb5, this["runningHubProfileId"], this["_isRunningHubAiAppSource"]()),
        'shouldShowManualComponentPicker': () => this["_shouldShowManualComponentPicker"](),
        'canRemovePreviewParams': () => this["_canRemovePreviewParams"](),
        'canRemovePreviewInputs': () => this["_canRemovePreviewInputs"](),
        'renderComfyCandidatePicker': _0x1eaf41 => this["_renderComfyCandidatePicker"](_0x1eaf41),
        'findSavedApp': _0x40e6f2 => this["_findSavedApp"](_0x40e6f2),
        'commitPreviewUiSchemaValue': (_0x28a073, _0x336c89) => this["_commitPreviewUiSchemaValue"](_0x28a073, _0x336c89)
      },
      'primitives': {
        'OUTPUT_KIND_LABELS': OUTPUT_KIND_LABELS,
        'RH_AI_APP_EXIT_MOTION_MS': RH_AI_APP_EXIT_MOTION_MS,
        'bindUiSchemaFieldControls': bindUiSchemaFieldControls,
        'buildPreviewUiSchemaNodeData': buildPreviewUiSchemaNodeData,
        'canPreviewPromptBecomeParam': canPreviewPromptBecomeParam,
        'getBundleParamFields': getBundleParamFields,
        'getComponentByIndex': getComponentByIndex,
        'getCustomAiAppComponentIndex': getCustomAiAppComponentIndex,
        'getPreviewComponentDescription': getPreviewComponentDescription,
        'getPreviewInstanceText': getPreviewInstanceText,
        'getPreviewPromptHelpComponent': getPreviewPromptHelpComponent,
        'normalizeAppName': normalizeAppName,
        'normalizeComponentKind': normalizeComponentKind,
        'normalizeKind': normalizeKind,
        'renderPreviewAdvancedPanelHtml': renderPreviewAdvancedPanelHtml,
        'renderPreviewAppMenuHtml': renderPreviewAppMenuHtml,
        'renderPreviewBatchControlsHtml': renderPreviewBatchControlsHtml,
        'renderPreviewHomeParamsHtml': renderPreviewHomeParamsHtml,
        'renderPreviewInputComponentsHtml': renderPreviewInputComponentsHtml,
        'renderPreviewPromptHelpTipHtml': renderPreviewPromptHelpTipHtml,
        'renderPreviewTypeBarHtml': renderPreviewTypeBarHtml,
        'renderRhAiAppNodePreviewHtml': renderRhAiAppNodePreviewHtml,
        'renderSaveConfigOverwriteMenuHtml': renderSaveConfigOverwriteMenuHtml,
        'shouldReduceMotion': shouldReduceMotion
      }
    });
    this["previewDragController"] = createRhAiAppPreviewDragController({
      'readState': () => ({
        'panel': this["panel"],
        'nodePreviewEl': this["nodePreviewEl"],
        'componentDrafts': this["componentDrafts"]
      }),
      'actions': {
        'getPreviewZoneElement': _0x3ee3e2 => this['previewPresentation']["_getPreviewZoneElement"](_0x3ee3e2),
        'isPreviewControlTarget': _0x1b7cde => this["_isPreviewControlTarget"](_0x1b7cde),
        'startPreviewInlineRename': (_0x1aca62, _0x3cb4da) => this["_startPreviewInlineRename"](_0x1aca62, _0x3cb4da),
        'refreshBundleFromComponents': _0x4ace9e => this["_refreshBundleFromComponents"](_0x4ace9e),
        'patchPreviewWithoutRebuild': (_0x520d80, _0x3f2d39) => this["_patchPreviewWithoutRebuild"](_0x520d80, _0x3f2d39)
      },
      'primitives': {
        'PREVIEW_CUSTOM_COMPONENT_LIMIT': PREVIEW_CUSTOM_COMPONENT_LIMIT,
        'PREVIEW_DRAG_START_THRESHOLD_PX': PREVIEW_DRAG_START_THRESHOLD_PX,
        'PREVIEW_DROP_ZONES': PREVIEW_DROP_ZONES,
        'PREVIEW_MOVE_ANIMATION_MS': PREVIEW_MOVE_ANIMATION_MS,
        'PREVIEW_RENAME_CLICK_TOLERANCE_PX': PREVIEW_RENAME_CLICK_TOLERANCE_PX,
        'assignSequentialOrder': assignSequentialOrder,
        'buildComponentByIndex': buildComponentByIndex,
        'canPreviewComponentBecomePrompt': canPreviewComponentBecomePrompt,
        'canPreviewPromptBecomeParam': canPreviewPromptBecomeParam,
        'getComponentByIndex': getComponentByIndex,
        'getPreviewAdvancedParamComponents': getPreviewAdvancedParamComponents,
        'getPreviewHomeParamComponents': getPreviewHomeParamComponents,
        'getPreviewInputComponents': getPreviewInputComponents,
        'getPreviewParamText': getPreviewParamText,
        'getPreviewPromptReturnControlType': getPreviewPromptReturnControlType,
        'isParamComponent': isParamComponent,
        'moveComponentToOrder': moveComponentToOrder,
        'shouldReduceMotion': shouldReduceMotion
      }
    });
    this["contextMenuController"] = createRunningHubAiAppContextMenuController({
      'getPanel': () => this["panel"],
      'beforeOpen': () => this["_closeInlineMenusBeforeContextMenu"]()
    });
    this["_createPanel"]();
    this['_syncSourceView']();
    if (this["sourceType"]) {
      this["_restoreKindState"](this["kind"]);
    }
    this["_bindButton"]();
    this['_bindGlobalEvents']();
    this["_registerSavedAppBundles"]();
    this["_watchExistingNodeBundles"]();
    void this["_hydrateExternalStorage"]();
  }
  ['_createPanel']() {
    this["panel"] = document["createElement"]("section");
    this["panel"]['className'] = "rh-ai-app-panel";
    this['panel']["setAttribute"]("aria-label", "自定义AI应用");
    this['panel']["setAttribute"]("aria-hidden", "true");
    this["panel"]["innerHTML"] = '\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-ai-app-header\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-ai-app-title\x22\x20data-role=\x22panel-title\x22>自定义AI应用</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-ai-app-subtitle\x22\x20data-role=\x22panel-subtitle\x22>选择一种自定义应用来源</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-ai-app-header-actions\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22rh-ai-app-back-to-sources\x22\x20data-action=\x22back-to-source-types\x22\x20aria-label=\x22返回自定义AI应用\x22\x20title=\x22返回自定义AI应用\x22\x20hidden>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20aria-hidden=\x22true\x22><path\x20d=\x22m15\x2018-6-6\x206-6\x22></path><path\x20d=\x22M20\x2012H9\x22></path></svg>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22rh-ai-app-back\x22\x20data-action=\x22close\x22\x20aria-label=\x22关闭\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20aria-hidden=\x22true\x22><path\x20d=\x22M18\x206\x206\x2018\x22></path><path\x20d=\x22m6\x206\x2012\x2012\x22></path></svg>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-ai-app-body\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-ai-app-source-select\x22\x20data-role=\x22source-select\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22rh-ai-app-source-option\x20rh-ai-app-source-option--rh\x22\x20data-action=\x22select-source-type\x22\x20data-source-type=\x22runninghub-ai-app\x22\x20data-vip-model-id=\x22' + escapeHtml(RH_AI_APP_VIP_MODEL_ID) + "\" data-provider=\"" + escapeHtml(RH_AI_APP_VIP_PROVIDER) + "\">\n            <span class=\"rh-ai-app-source-content\">\n              " + renderRunningHubAiAppLogoHtml({
      'className': "rh-ai-app-source-icon rh-ai-app-source-icon--rh"
    }) + "\n              <span class=\"rh-ai-app-source-copy\">\n                <span class=\"rh-ai-app-source-title\">\n                  <span>RunningHub</span>\n                </span>\n                <span class=\"rh-ai-app-source-subtitle\">粘贴 AI 应用或工作流链接，自动识别并获取配置</span>\n              </span>\n            </span>\n            <span class=\"rh-ai-app-source-arrow\" aria-hidden=\"true\">\n              <svg viewBox=\"0 0 24 24\"><path d=\"m9 18 6-6-6-6\"></path></svg>\n            </span>\n          </button>\n          <button type=\"button\" class=\"rh-ai-app-source-option rh-ai-app-source-option--comfyui\" data-action=\"select-source-type\" data-source-type=\"comfyui-local-workflow\">\n            <span class=\"rh-ai-app-source-content\">\n              " + renderComfyUiLocalWorkflowLogoHtml({
      'className': "rh-ai-app-source-icon"
    }) + "\n              <span class=\"rh-ai-app-source-copy\">\n                <span class=\"rh-ai-app-source-title\">ComfyUI 工作流</span>\n                <span class=\"rh-ai-app-source-subtitle\">粘贴 ComfyUI API workflow，选择本地或云端运行环境</span>\n              </span>\n            </span>\n            <span class=\"rh-ai-app-source-arrow\" aria-hidden=\"true\">\n              <svg viewBox=\"0 0 24 24\"><path d=\"m9 18 6-6-6-6\"></path></svg>\n            </span>\n          </button>\n        </div>\n        <div class=\"rh-ai-app-workbench\" data-role=\"workbench\" hidden>\n          <div class=\"rh-ai-app-field rh-ai-app-kind-field\">\n            <div class=\"rh-ai-app-label\">节点类型</div>\n            <div class=\"rh-ai-app-kind-tabs is-kind-image\" role=\"tablist\" aria-label=\"节点类型\">\n              <button type=\"button\" class=\"active\" data-kind=\"image\" aria-pressed=\"true\">图像</button>\n              <button type=\"button\" data-kind=\"video\" aria-pressed=\"false\">视频</button>\n              <button type=\"button\" data-kind=\"audio\" aria-pressed=\"false\">音频</button>\n            </div>\n          </div>\n          <div class=\"rh-ai-app-field rh-ai-app-workflow-field\" data-role=\"workflow-input-field\">\n            <div class=\"rh-ai-app-input-head\">\n              <span class=\"rh-ai-app-label\" data-role=\"input-label\">RunningHub 请求</span>\n              <div class=\"rh-ai-app-input-actions\">\n                <div class=\"rh-ai-app-runtime-toggle\" data-role=\"comfyui-runtime-toggle\" role=\"radiogroup\" aria-label=\"运行环境\" hidden>\n                  <span class=\"rh-ai-app-runtime-label\">运行环境</span>\n                  <button type=\"button\" data-action=\"select-comfyui-runtime\" data-comfyui-runtime=\"local\" aria-pressed=\"true\">本地工作流</button>\n                  <button type=\"button\" data-action=\"select-comfyui-runtime\" data-comfyui-runtime=\"cloud\" aria-pressed=\"false\">云端工作流</button>\n                </div>\n                <div class=\"rh-ai-app-runtime-toggle\" data-role=\"runninghub-runtime-toggle\" role=\"radiogroup\" aria-label=\"运行环境\" hidden>\n                  <span class=\"rh-ai-app-runtime-label\">运行环境</span>\n                  <button type=\"button\" data-action=\"select-runninghub-runtime\" data-runninghub-runtime=\"" + escapeHtml(RUNNINGHUB_DOMESTIC_PROFILE_ID) + "\" aria-pressed=\"true\">国内</button>\n                  <button type=\"button\" data-action=\"select-runninghub-runtime\" data-runninghub-runtime=\"" + escapeHtml(RUNNINGHUB_INTERNATIONAL_PROFILE_ID) + "\" aria-pressed=\"false\">国际</button>\n                </div>\n                <button type=\"button\" class=\"rh-ai-app-input-toggle\" data-action=\"toggle-workflow-input\" aria-label=\"收起 JSON\" title=\"收起 JSON\" hidden><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m6 9 6 6 6-6\"/></svg></button>\n              </div>\n            </div>\n            <div class=\"rh-ai-app-input-summary\" data-role=\"workflow-input-summary\" hidden></div>\n            <div class=\"rh-ai-app-input-shell\" data-role=\"workflow-input-shell\">\n              <div class=\"rh-ai-app-input-shell-inner\">\n                <textarea class=\"rh-ai-app-input\" spellcheck=\"false\" placeholder=\"粘贴 openapi/v2/run/ai-app 的 curl 或 JSON\"></textarea>\n                <button type=\"button\" class=\"rh-ai-app-secondary\" data-action=\"parse\">解析 JSON</button>\n              </div>\n            </div>\n          </div>\n          <div class=\"rh-ai-app-builder\" data-role=\"builder\" hidden>\n            <div class=\"rh-ai-app-section-head\">\n              <div class=\"rh-ai-app-section-title\">应用信息</div>\n            </div>\n            <div class=\"rh-ai-app-component-list\" data-role=\"components\"></div>\n            <div class=\"rh-ai-app-section-title\">节点组件编辑</div>\n            <div data-role=\"node-preview\"></div>\n          </div>\n          <div class=\"rh-ai-app-preview\" data-role=\"summary\">\n            " + renderSummaryHtml(null) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-ai-app-error\x22\x20data-role=\x22error\x22\x20hidden></div>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-ai-app-footer\x22\x20data-role=\x22footer\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22rh-ai-app-save-config-wrap\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22rh-ai-app-secondary\x22\x20data-action=\x22save-config\x22\x20disabled>保存模型</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-ai-app-save-config-menu\x22\x20data-role=\x22save-config-menu\x22\x20aria-hidden=\x22true\x22\x20hidden></div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22rh-ai-app-create-config-wrap\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22rh-ai-app-primary\x22\x20data-action=\x22create\x22\x20disabled>测试节点</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-ai-app-create-config-menu\x22\x20data-role=\x22create-config-menu\x22\x20aria-hidden=\x22true\x22\x20hidden></div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</span>\x0a\x20\x20\x20\x20\x20\x20</div>';
    const _0x4393b3 = document["body"] || document['documentElement'];
    _0x4393b3["appendChild"](this["panel"]);
    this["bodyEl"] = this['panel']["querySelector"](".rh-ai-app-body");
    this["sourceSelectEl"] = this["panel"]["querySelector"]("[data-role='source-select']");
    this['workbenchEl'] = this["panel"]["querySelector"]("[data-role='workbench']");
    this["kindTabsEl"] = this['panel']['querySelector']('.rh-ai-app-kind-tabs');
    this["sourceBackBtn"] = this["panel"]["querySelector"]("[data-action='back-to-source-types']");
    this["workflowInputFieldEl"] = this["panel"]["querySelector"]("[data-role='workflow-input-field']");
    this["workflowInputSummaryEl"] = this["panel"]["querySelector"]("[data-role='workflow-input-summary']");
    this["runtimeToggleEl"] = this["panel"]["querySelector"]('[data-role=\x27comfyui-runtime-toggle\x27]');
    this["runningHubRuntimeToggleEl"] = this["panel"]["querySelector"]('[data-role=\x27runninghub-runtime-toggle\x27]');
    this["workflowInputToggleBtn"] = this['panel']["querySelector"]("[data-action='toggle-workflow-input']");
    this["textarea"] = this["panel"]["querySelector"](".rh-ai-app-input");
    this["builderEl"] = this['panel']["querySelector"]("[data-role='builder']");
    this["nodePreviewEl"] = this["panel"]['querySelector']('[data-role=\x27node-preview\x27]');
    this["componentListEl"] = this["panel"]["querySelector"]("[data-role='components']");
    this['componentPickerEl'] = this["panel"]["querySelector"]("[data-role='comfyui-candidate-menu']");
    this['summaryEl'] = this["panel"]["querySelector"]("[data-role='summary']");
    this["errorEl"] = this['panel']['querySelector']("[data-role='error']");
    this["saveBtn"] = this["panel"]['querySelector']("[data-action='save-config']");
    this["saveConfigMenuEl"] = this["panel"]["querySelector"]("[data-role='save-config-menu']");
    this["createConfigMenuEl"] = this["panel"]['querySelector']("[data-role='create-config-menu']");
    this["createBtn"] = this['panel']["querySelector"]("[data-action='create']");
    this["definitionController"]['mount']();
    this["panel"]['addEventListener']("click", _0x5eefeb => this['_handlePanelClick'](_0x5eefeb));
    this["panel"]["addEventListener"]("contextmenu", _0x43b69d => this["contextMenuController"]["handleContextMenu"](_0x43b69d));
    this["panel"]['addEventListener']('dblclick', _0xadce77 => this['_handlePanelDoubleClick'](_0xadce77));
    this["panel"]['addEventListener']("keydown", _0x3b0d52 => this['_handlePanelKeyDown'](_0x3b0d52));
    this['panel']["addEventListener"]("focusout", _0x1c3d69 => this["_handlePanelFocusOut"](_0x1c3d69));
    this["panel"]["addEventListener"]('pointerdown', _0x131eed => {
      _0x131eed['stopPropagation']();
      this["previewDragController"]["handlePointerDown"](_0x131eed);
    });
    this["panel"]["addEventListener"]("input", _0x347da0 => this["_handleComponentInput"](_0x347da0));
    this["panel"]["addEventListener"]("change", _0x456401 => this["_handleComponentInput"](_0x456401));
    this["bodyEl"]?.["addEventListener"]('scroll', () => this["_syncStickyHeaderShadow"]());
    this["workflowInputFieldEl"]?.["addEventListener"]("dragenter", _0x7ea923 => this["_handleWorkflowJsonFileDragEnter"](_0x7ea923));
    this["workflowInputFieldEl"]?.["addEventListener"]('dragover', _0x1b2803 => this['_handleWorkflowJsonFileDragOver'](_0x1b2803));
    this["workflowInputFieldEl"]?.["addEventListener"]('dragleave', _0x3c2f5b => this["_handleWorkflowJsonFileDragLeave"](_0x3c2f5b));
    this['workflowInputFieldEl']?.['addEventListener']("drop", _0x25740b => void this["_handleWorkflowJsonFileDrop"](_0x25740b));
    this["textarea"]?.["addEventListener"]("input", () => {
      this["workflowInputCollapsed"] = ![];
      this["_syncWorkflowInputCollapsed"]();
      this['_scheduleParse']();
    });
  }
  ["_bindButton"]() {
    this["button"] = document['getElementById']('btnRunningHubAiApp');
    if (!this["button"] || !this["panel"]) {
      return;
    }
    this["button"]["setAttribute"]("aria-haspopup", "dialog");
    this['button']["setAttribute"]("aria-expanded", "false");
    this["button"]['addEventListener']("click", _0x11c5cd => {
      _0x11c5cd["preventDefault"]();
      _0x11c5cd["stopPropagation"]();
      if (Number(_0x11c5cd["detail"] || 0x0) > 0x1) {
        return;
      }
      this["_toggle"]();
    });
    this['button']["addEventListener"]("dblclick", _0x1c5eb0 => {
      _0x1c5eb0["preventDefault"]();
      _0x1c5eb0["stopPropagation"]();
      this["_close"]();
    });
  }
  ['_bindGlobalEvents']() {
    document['addEventListener']("keydown", _0xf9d39 => {
      if (_0xf9d39["key"] !== "Escape" || !this["_isOpen"]()) {
        return;
      }
      if (this['previewAppMenuOpen']) {
        this["previewAppMenuOpen"] = ![];
        this["pendingDeleteSavedAppId"] = '';
        this['pendingOverwriteSavedAppId'] = '';
        this["pendingOverwriteIntent"] = '';
        this["_patchPreviewAppChrome"]();
        return;
      }
      this["_close"]();
    });
    document["addEventListener"]("pointerdown", _0x4c4c2a => {
      if (!this["previewAppMenuOpen"] || !this["_isOpen"]()) {
        return;
      }
      if (this["panel"]?.['contains'](_0x4c4c2a['target'])) {
        return;
      }
      this["previewAppMenuOpen"] = ![];
      this["pendingDeleteSavedAppId"] = '';
      this['pendingOverwriteSavedAppId'] = '';
      this['pendingOverwriteIntent'] = '';
      this["_patchPreviewAppChrome"]();
    });
    document["addEventListener"]("pointermove", _0x59471c => this['previewDragController']["handlePointerMove"](_0x59471c));
    document["addEventListener"]("pointerup", _0x2cb900 => this["previewDragController"]["handlePointerEnd"](_0x2cb900));
    document["addEventListener"]('pointercancel', _0x100f3f => this["previewDragController"]["handlePointerEnd"](_0x100f3f));
    window['addEventListener']("custom-ai-app:open", () => this["_openSourceSelect"]());
    window["addEventListener"]("custom-ai-app:toggle", () => this["_toggleSourceSelect"]());
  }
  ["_watchExistingNodeBundles"]() {
    this["unsubscribeNodes"] = graphStore["subscribeNodeField"]('rhAiAppManifestBundle', _0x126e93 => this['_registerBundlesFromNodes'](_0x126e93));
  }
  ["_registerBundlesFromNodes"](_0xb2f66c) {
    const _0x2ab639 = _0xb2f66c || Object['values'](graphStore["getStateRaw"]()?.["nodes"] || {})["map"](_0x3bb3e7 => _0x3bb3e7?.['rhAiAppManifestBundle'])["filter"](Boolean);
    const _0x5715e6 = this['savedApps']["map"](_0x9d4530 => a1336_0x2ec2d0(_0x9d4530?.["bundle"]))["filter"](Boolean);
    return this["nodeBundleRegistry"]["reconcile"]({
      'bundles': _0x2ab639,
      'savedBundleKeys': _0x5715e6
    });
  }
  ["_getSavedAppsForKind"](_0x5d0e33 = this["kind"]) {
    const _0x19cc08 = normalizeKind(_0x5d0e33);
    const _0xcdf1c0 = normalizeSourceType(this["sourceType"]) || SOURCE_TYPES["runninghub"];
    return this["savedApps"]["filter"](_0x2ee149 => {
      if (normalizeKind(_0x2ee149["kind"]) !== _0x19cc08) {
        return ![];
      }
      const _0x345028 = normalizeSourceType(_0x2ee149["sourceType"]) || SOURCE_TYPES["runninghub"];
      if (isComfyUiSource(_0xcdf1c0)) {
        return isComfyUiSource(_0x345028);
      }
      if (isRunningHubSource(_0xcdf1c0)) {
        return isRunningHubSource(_0x345028);
      }
      return _0x345028 === _0xcdf1c0;
    });
  }
  ['_getSavedAppsForExactSource'](_0x2ac3f6 = this['kind'], _0x3b253c = this["sourceType"]) {
    const _0x157580 = normalizeKind(_0x2ac3f6);
    const _0x40eb9d = normalizeSourceType(_0x3b253c) || SOURCE_TYPES["runninghub"];
    return this["savedApps"]['filter'](_0x87029f => {
      if (normalizeKind(_0x87029f["kind"]) !== _0x157580) {
        return ![];
      }
      const _0x199ee0 = normalizeSourceType(_0x87029f["sourceType"]) || SOURCE_TYPES["runninghub"];
      return _0x199ee0 === _0x40eb9d;
    });
  }
  ['_findSavedApp'](_0x463f1f) {
    const _0x365152 = String(_0x463f1f || '')["trim"]();
    if (!_0x365152) {
      return null;
    }
    return this['savedApps']["find"](_0x32559c => _0x32559c['id'] === _0x365152) || null;
  }
  ['_findSameNameSavedAppForCurrentScope'](_0x91b732 = this["appName"]) {
    const _0x188f38 = normalizeAppName(_0x91b732);
    return this["_getSavedAppsForExactSource"](this["kind"], this["sourceType"])['find'](_0x172778 => normalizeAppName(_0x172778["name"]) === _0x188f38) || null;
  }
  ["_clearPendingOverwrite"]({
    keepMenuOpen = ![],
    render = !![]
  } = {}) {
    this['pendingOverwriteSavedAppId'] = '';
    this["pendingOverwriteIntent"] = '';
    if (keepMenuOpen) {
      this["previewAppMenuOpen"] = !![];
    }
    render && (this['_patchPreviewAppChrome'](), this["_patchSaveConfigMenu"](), this["_patchCreateConfigMenu"]());
  }
  ['_showOverwriteConfirm'](_0x281265, _0x5d4e41 = "save") {
    const _0x226bab = String(_0x281265 || '')["trim"]();
    if (!_0x226bab) {
      return ![];
    }
    this["pendingOverwriteSavedAppId"] = _0x226bab;
    this["pendingOverwriteIntent"] = _0x5d4e41 === "create" ? "create" : "save";
    this["pendingDeleteSavedAppId"] = '';
    this["previewAppMenuOpen"] = ![];
    this["_patchPreviewAppChrome"]();
    this["_patchSaveConfigMenu"]();
    this['_patchCreateConfigMenu']();
    return !![];
  }
  ["_getConfigRepositorySnapshot"]() {
    return {
      'savedApps': this["savedApps"],
      'sourceType': this['sourceType'],
      'kind': this["kind"],
      'kindStates': this["kindStates"]
    };
  }
  ["_persistSavedApps"]() {
    this["configRepository"]['saveSavedApps'](this["savedApps"]);
  }
  async ["_hydrateExternalStorage"]() {
    return await this["configRepository"]["hydrateExternalStorage"]({
      'hasLocalSeed': this["localStorageSeedHasData"]
    });
  }
  ["_applyExternalStoragePayload"](_0x4fd693) {
    this["savedApps"]["forEach"](_0x1e2df9 => {
      _0x1e2df9?.["bundle"] && a1336_0x4e4b90(_0x1e2df9["bundle"], this['registeredBundleKeys']);
    });
    this['savedApps'] = Array["isArray"](_0x4fd693?.["savedApps"]) ? _0x4fd693['savedApps'] : [];
    this["_registerSavedAppBundles"]();
    this['_registerBundlesFromNodes']();
    _0x4fd693?.["panelDraft"] && (this["sourceType"] = _0x4fd693["panelDraft"]['sourceType'] || '', this['kind'] = _0x4fd693["panelDraft"]["kind"], this['kindStates'] = _0x4fd693["panelDraft"]['kindStates']);
    this["_dropUnauthorizedRunningHubAiAppSource"]();
    this['previewAppMenuOpen'] = ![];
    this["pendingDeleteSavedAppId"] = '';
    this['pendingOverwriteSavedAppId'] = '';
    this['pendingOverwriteIntent'] = '';
    this["_syncSourceView"]();
    if (this["sourceType"]) {
      this["_restoreKindState"](this["kind"]);
    } else {
      this["_patchPreviewAppChrome"]();
    }
  }
  ["_buildBundleForSavedApp"](_0x334b09) {
    const _0x27ab0a = normalizeSourceType(_0x334b09['sourceType'] || this["sourceType"]) || SOURCE_TYPES["runninghub"];
    if (isRunningHubSource(_0x27ab0a)) {
      assertRunningHubDefinitionProfile(_0x334b09["input"], _0x334b09['runningHubProfileId'] || this["runningHubProfileId"]);
    }
    if (_0x27ab0a === SOURCE_TYPES["runninghubWorkflow"]) {
      return buildRunningHubWorkflowManifestBundle({
        ..._0x334b09,
        'components': _0x334b09["componentDrafts"],
        'displayName': _0x334b09["name"],
        'appKey': _0x334b09['id']
      });
    }
    if (isComfyUiSource(_0x27ab0a)) {
      return buildComfyUiWorkflowManifestBundle({
        'input': _0x334b09["input"],
        'kind': _0x334b09["kind"],
        'components': _0x334b09['componentDrafts'],
        'displayName': _0x334b09["name"],
        'description': _0x334b09['description'],
        'promptHelpTooltip': normalizePromptHelpTooltip(_0x334b09["promptHelpTooltip"]),
        'appKey': _0x334b09['id'],
        'baseUrlMode': getComfyUiBaseUrlMode(_0x27ab0a),
        'componentSelectionMode': "manual"
      });
    }
    return buildRunningHubAiAppManifestBundle({
      'input': _0x334b09["input"],
      'appId': this["_getAppIdText"](),
      'kind': _0x334b09["kind"],
      'components': _0x334b09["componentDrafts"],
      'displayName': _0x334b09['name'],
      'description': _0x334b09["description"],
      'promptHelpTooltip': normalizePromptHelpTooltip(_0x334b09["promptHelpTooltip"]),
      'appKey': _0x334b09['id']
    });
  }
  ["_registerSavedAppBundles"]() {
    this["savedApps"]["forEach"](_0x5dccb1 => {
      try {
        const _0x4b2649 = this["_buildBundleForSavedApp"](_0x5dccb1);
        _0x5dccb1["bundle"] = _0x4b2649;
        a1336_0x370b10(_0x4b2649, this["registeredBundleKeys"], {
          'replace': !![]
        });
      } catch (_0x5a9e29) {
        console['warn']("[RH AI App] register saved app failed:", _0x5a9e29);
      }
    });
  }
  ["_setActionButtonsEnabled"](_0x2064ef) {
    if (!_0x2064ef) {
      this['_resetSaveSuccessFeedback']();
    }
    if (this["saveBtn"]) {
      this['saveBtn']["disabled"] = !_0x2064ef;
    }
    if (this["createBtn"]) {
      this['createBtn']['disabled'] = !_0x2064ef;
    }
  }
  ["_resetSaveSuccessFeedback"]() {
    window["clearTimeout"](this['saveSuccessTimer']);
    this["saveSuccessTimer"] = 0x0;
    if (!this["saveBtn"]) {
      return;
    }
    this["saveBtn"]["classList"]["remove"]("is-save-success");
    this["saveBtn"]["textContent"] = this['saveBtn']["dataset"]["defaultText"] || "保存模型";
  }
  ["_flashSaveSuccessFeedback"]() {
    if (!this["saveBtn"]) {
      return;
    }
    const _0x29a8c3 = this['saveBtn']["dataset"]["defaultText"] || this["saveBtn"]['textContent'] || '保存模型';
    this['saveBtn']["dataset"]["defaultText"] = _0x29a8c3;
    window['clearTimeout'](this["saveSuccessTimer"]);
    this["saveBtn"]["classList"]["add"]("is-save-success");
    this["saveBtn"]["textContent"] = "已保存";
    this['saveSuccessTimer'] = window["setTimeout"](() => this['_resetSaveSuccessFeedback'](), 0x4b0);
  }
  ["_getStateKey"](_0x347e99 = this["kind"], _0x209c2f = this["sourceType"]) {
    return this["configRepository"]["getKindStateKey"](_0x209c2f, _0x347e99);
  }
  ["_getSourceMeta"]() {
    return getSourceMeta(this["sourceType"]);
  }
  ["_isComfyUiSource"]() {
    return isComfyUiSource(this["sourceType"]);
  }
  ['_isRunningHubAiAppSource'](_0x289a57 = this["sourceType"]) {
    return isRunningHubSource(normalizeSourceType(_0x289a57));
  }
  ["_isRunningHubAiAppAuthorized"]() {
    const _0xb970f1 = globalThis["window"];
    const _0x5804db = _0xb970f1?.["isModelAllowedBySubscription"];
    if (typeof _0x5804db !== "function") {
      return ![];
    }
    return _0x5804db(RH_AI_APP_VIP_MODEL_ID, RH_AI_APP_VIP_PROVIDER) === !![];
  }
  ["_requestRunningHubAiAppAuthorization"](_0x295806 = null) {
    const _0x4f9207 = globalThis["window"];
    if (typeof _0x4f9207?.["openSubscriptionDialog"] === 'function') {
      _0x4f9207['openSubscriptionDialog']({
        'modelId': RH_AI_APP_VIP_MODEL_ID,
        'provider': RH_AI_APP_VIP_PROVIDER,
        'onSuccess': _0x295806
      });
      return;
    }
    _0x4f9207?.["showToast"]?.("需要VIP授权，请先激活CDKEY", "warn");
  }
  ["_guardRunningHubAiAppAccess"](_0x29233b = null) {
    if (this["_isRunningHubAiAppAuthorized"]()) {
      return !![];
    }
    this["_requestRunningHubAiAppAuthorization"](_0x29233b);
    return ![];
  }
  ["_dropUnauthorizedRunningHubAiAppSource"]() {
    if (!this["_isRunningHubAiAppSource"]()) {
      return ![];
    }
    if (this["_isRunningHubAiAppAuthorized"]()) {
      return ![];
    }
    this["sourceType"] = '';
    return !![];
  }
  ['_shouldShowManualComponentPicker']() {
    return this['_isComfyUiSource']() || this["sourceType"] === SOURCE_TYPES["runninghubWorkflow"];
  }
  ["_canRemovePreviewParams"]() {
    return this["_shouldShowManualComponentPicker"]();
  }
  ["_canRemovePreviewInputs"]() {
    return this["_shouldShowManualComponentPicker"]();
  }
  ['_clearSourceViewAnimation']() {
    window["clearTimeout"](this["sourceViewAnimationTimer"]);
    this["sourceViewAnimationTimer"] = 0x0;
    this["bodyEl"]?.["classList"]["remove"]("is-view-transitioning");
    this["sourceSelectEl"]?.["classList"]["remove"]('is-page-enter-left', 'is-page-exit-left', "is-page-enter-right", 'is-page-exit-right');
    this["workbenchEl"]?.["classList"]["remove"]('is-page-enter-left', "is-page-exit-left", 'is-page-enter-right', "is-page-exit-right");
  }
  ["_setSourceViewHiddenState"](_0x47f07e) {
    if (this['sourceSelectEl']) {
      this["sourceSelectEl"]["hidden"] = _0x47f07e;
    }
    if (this["workbenchEl"]) {
      this["workbenchEl"]["hidden"] = !_0x47f07e;
    }
  }
  ['_applySourceViewTransition'](_0x3e3c64, _0x5afa40) {
    if (shouldReduceMotion() || !_0x5afa40 || !this["sourceSelectEl"] || !this["workbenchEl"]) {
      this["_setSourceViewHiddenState"](_0x3e3c64);
      return ![];
    }
    const _0x4769af = _0x5afa40 === 'forward' && _0x3e3c64;
    const _0x2e20b7 = _0x5afa40 === "back" && !_0x3e3c64;
    if (!_0x4769af && !_0x2e20b7) {
      this["_setSourceViewHiddenState"](_0x3e3c64);
      return ![];
    }
    this["sourceSelectEl"]["hidden"] = ![];
    this["workbenchEl"]["hidden"] = ![];
    this["bodyEl"]?.["classList"]["add"]("is-view-transitioning");
    _0x4769af ? (this["sourceSelectEl"]["classList"]["add"]("is-page-exit-left"), this["workbenchEl"]["classList"]["add"]("is-page-enter-right")) : (this["sourceSelectEl"]["classList"]["add"]("is-page-enter-left"), this["workbenchEl"]["classList"]["add"]("is-page-exit-right"));
    this["sourceViewAnimationTimer"] = window["setTimeout"](() => {
      this["_clearSourceViewAnimation"]();
      this["_setSourceViewHiddenState"](_0x3e3c64);
    }, SOURCE_PAGE_ANIMATION_MS);
    return !![];
  }
  ["_syncSourceView"]() {
    this["definitionController"]["sync"]();
    const _0xd5902b = Boolean(normalizeSourceType(this["sourceType"]));
    const _0x135c61 = this['_getSourceMeta']();
    const _0x60817c = this["sourceViewTransitionDirection"];
    this["sourceViewTransitionDirection"] = '';
    this['_clearSourceViewAnimation']();
    this["_applySourceViewTransition"](_0xd5902b, _0x60817c);
    if (this["sourceBackBtn"]) {
      this["sourceBackBtn"]["hidden"] = !_0xd5902b;
    }
    const _0x5c9c85 = this["panel"]?.["querySelector"]?.("[data-role='footer']");
    if (_0x5c9c85) {
      _0x5c9c85['hidden'] = !_0xd5902b;
    }
    const _0x5b6ee1 = this["panel"]?.["querySelector"]?.("[data-role='panel-title']");
    const _0x4412d6 = this['panel']?.["querySelector"]?.("[data-role='panel-subtitle']");
    const _0x254662 = this["panel"]?.["querySelector"]?.("[data-role='input-label']");
    if (_0x5b6ee1) {
      _0x5b6ee1["textContent"] = _0xd5902b ? _0x135c61?.['panelLabel'] || _0x135c61?.["label"] || "自定义AI应用" : "自定义AI应用";
    }
    _0x4412d6 && (_0x4412d6['textContent'] = _0xd5902b ? _0x135c61?.["subtitle"] || '' : "选择一种自定义应用来源");
    if (_0x254662 && _0x135c61?.['inputLabel']) {
      _0x254662["textContent"] = _0x135c61["inputLabel"];
    }
    this["textarea"] && _0x135c61?.['inputPlaceholder'] && (this["textarea"]["placeholder"] = _0x135c61["inputPlaceholder"]);
    this['_syncComfyUiRuntimeControl']();
    this["_syncRunningHubRuntimeControl"]();
    !_0xd5902b && (this['_setActionButtonsEnabled'](![]), this['_setError'](''));
    this["_syncStickyHeaderShadow"]();
  }
  ["_syncComfyUiRuntimeControl"]() {
    const _0x16f754 = this['_isComfyUiSource']();
    if (!this["runtimeToggleEl"]) {
      return;
    }
    this["runtimeToggleEl"]["hidden"] = !_0x16f754;
    const _0x22d9e8 = getComfyUiBaseUrlMode(this["sourceType"]);
    this['runtimeToggleEl']["querySelectorAll"]("[data-comfyui-runtime]")['forEach'](_0x69d2f => {
      const _0x385b25 = _0x69d2f['dataset']["comfyuiRuntime"] === _0x22d9e8;
      _0x69d2f["classList"]["toggle"]('active', _0x385b25);
      _0x69d2f["setAttribute"]('aria-pressed', _0x385b25 ? "true" : "false");
    });
  }
  ["_syncRunningHubRuntimeControl"]() {
    const _0x249003 = this["_isRunningHubAiAppSource"]();
    if (!this["runningHubRuntimeToggleEl"]) {
      return;
    }
    this['runningHubRuntimeToggleEl']["hidden"] = !_0x249003;
    const _0x510c1b = normalizeRunningHubModelApiProfileId(this["runningHubProfileId"]);
    this['runningHubRuntimeToggleEl']["querySelectorAll"]("[data-runninghub-runtime]")["forEach"](_0x241082 => {
      const _0x914dda = normalizeRunningHubModelApiProfileId(_0x241082['dataset']["runninghubRuntime"]) === _0x510c1b;
      _0x241082["classList"]["toggle"]("active", _0x914dda);
      _0x241082['setAttribute']("aria-pressed", _0x914dda ? "true" : "false");
    });
  }
  ['_syncStickyHeaderShadow']() {
    const _0x54aa96 = Boolean(normalizeSourceType(this["sourceType"])) && Number(this["bodyEl"]?.["scrollTop"] || 0x0) > 0x4;
    this["panel"]?.["classList"]["toggle"]("has-sticky-kind-shadow", _0x54aa96);
  }
  ["_selectSourceType"](_0x5bb6c4) {
    const _0xfed24a = normalizeSourceType(_0x5bb6c4);
    if (!_0xfed24a) {
      return;
    }
    if (isRunningHubSource(_0xfed24a) && !this["_guardRunningHubAiAppAccess"](() => this["_selectSourceType"](_0xfed24a))) {
      return;
    }
    window["clearTimeout"](this['parseTimer']);
    if (this['sourceType']) {
      this['_saveKindState']();
    }
    this['sourceType'] = _0xfed24a;
    this["previewAppMenuOpen"] = ![];
    this['pendingDeleteSavedAppId'] = '';
    this["pendingOverwriteSavedAppId"] = '';
    this["pendingOverwriteIntent"] = '';
    this["sourceViewTransitionDirection"] = 'forward';
    this['_restoreKindState'](this["kind"]);
    requestAnimationFrame(() => this["textarea"]?.['focus']());
  }
  ["_selectComfyUiRuntime"](_0x59f295) {
    this["definitionController"]["cancel"]();
    if (!this['_isComfyUiSource']()) {
      return;
    }
    const _0x298f9a = getComfyUiSourceTypeFromBaseUrlMode(_0x59f295);
    if (_0x298f9a === this['sourceType']) {
      this["_syncComfyUiRuntimeControl"]();
      return;
    }
    window['clearTimeout'](this['parseTimer']);
    this['_saveKindState']();
    this["sourceType"] = _0x298f9a;
    this["previewAppMenuOpen"] = ![];
    this["pendingDeleteSavedAppId"] = '';
    this['pendingOverwriteSavedAppId'] = '';
    this["pendingOverwriteIntent"] = '';
    this['_syncSourceView']();
    if (this['_getInputText']()["trim"]()) {
      const _0x48682c = this["_refreshBundleFromComponents"]({
        'renderPreview': ![]
      });
      this["_patchPreviewWithoutRebuild"](_0x48682c || this["currentBundle"], {
        'renderInputs': !![],
        'renderParams': !![],
        'renderAdvanced': !![],
        'renderPrompt': !![],
        'renderAppChrome': !![],
        'renderActionControls': !![]
      });
      return;
    }
    this['_patchPreviewAppChrome']();
    this["_saveKindState"]();
  }
  ["_selectRunningHubRuntime"](_0x3f074f) {
    this["definitionController"]['cancel']();
    if (!this["_isRunningHubAiAppSource"]()) {
      return;
    }
    const _0xc3566 = normalizeRunningHubModelApiProfileId(_0x3f074f);
    if (_0xc3566 === this["runningHubProfileId"]) {
      this['_syncRunningHubRuntimeControl']();
      return;
    }
    window["clearTimeout"](this["parseTimer"]);
    this["runningHubProfileId"] = _0xc3566;
    this["_syncRunningHubRuntimeControl"]();
    if (this["_getInputText"]()['trim']()) {
      this["_refreshBundleFromComponents"]({
        'renderPreview': ![]
      });
    }
    this['_saveKindState']();
    this["_patchPreviewAppChrome"]();
  }
  ["_showSourceSelect"]() {
    this["definitionController"]['cancel']();
    window["clearTimeout"](this["parseTimer"]);
    if (this["sourceType"]) {
      this['_saveKindState']();
    }
    this["sourceType"] = '';
    this["previewAppMenuOpen"] = ![];
    this["pendingDeleteSavedAppId"] = '';
    this["pendingOverwriteSavedAppId"] = '';
    this["pendingOverwriteIntent"] = '';
    this["_closeComponentSelectMenus"]();
    this["sourceViewTransitionDirection"] = 'back';
    this["_syncSourceView"]();
    this["_persistPanelDraft"]();
  }
  ["_openSourceSelect"]() {
    this["definitionController"]["cancel"]();
    window['clearTimeout'](this["parseTimer"]);
    const _0x4bf41a = this["_isOpen"]();
    if (this["sourceType"]) {
      this['_saveKindState']();
    }
    this['sourceType'] = '';
    this['previewAppMenuOpen'] = ![];
    this["pendingDeleteSavedAppId"] = '';
    this["pendingOverwriteSavedAppId"] = '';
    this["pendingOverwriteIntent"] = '';
    this["_closeComponentSelectMenus"]();
    this["sourceViewTransitionDirection"] = _0x4bf41a ? "back" : '';
    this["_syncSourceView"]();
    this["_persistPanelDraft"]();
    if (!_0x4bf41a) {
      this["_open"]();
    }
  }
  ["_toggleSourceSelect"]() {
    if (this['_isOpen']()) {
      this["_close"]();
      return;
    }
    this["_openSourceSelect"]();
  }
  ["_isOpen"]() {
    return this["panel"]?.['classList']["contains"]("is-open") === !![];
  }
  ['_open']() {
    closeAllSidebarSubmenus();
    this["_dropUnauthorizedRunningHubAiAppSource"]();
    this["_syncSourceView"]();
    if (this["sourceType"]) {
      this["_restoreKindState"](this["kind"]);
    }
    this["panel"]?.['classList']["add"]("is-open");
    this["panel"]?.['setAttribute']("aria-hidden", "false");
    document["body"]?.['classList']?.['add']("rh-ai-app-panel-open");
    this["button"]?.["classList"]["add"]("active");
    this["button"]?.["setAttribute"]('aria-expanded', "true");
    requestAnimationFrame(() => this["_syncStickyHeaderShadow"]());
    if (this['sourceType']) {
      requestAnimationFrame(() => this["textarea"]?.["focus"]());
    }
  }
  ["_close"]() {
    this["definitionController"]["cancel"]();
    window["clearTimeout"](this["parseTimer"]);
    this['_resetSaveSuccessFeedback']();
    this["_saveKindState"]();
    this["_clearSourceViewAnimation"]();
    this["_closeComponentSelectMenus"]();
    this["contextMenuController"]['close']();
    this["previewAppMenuOpen"] = ![];
    this["pendingDeleteSavedAppId"] = '';
    this["pendingOverwriteSavedAppId"] = '';
    this["pendingOverwriteIntent"] = '';
    this["panel"]?.["classList"]["remove"]("is-open");
    this["panel"]?.['classList']["remove"]("has-sticky-kind-shadow");
    this["panel"]?.['setAttribute']('aria-hidden', "true");
    document["body"]?.["classList"]?.["remove"]("rh-ai-app-panel-open");
    this["button"]?.['classList']['remove']("active");
    this["button"]?.["setAttribute"]("aria-expanded", "false");
  }
  ['_toggle']() {
    if (this["_isOpen"]()) {
      this['_close']();
    } else {
      this["_open"]();
    }
  }
  ["_handlePanelClick"](_0x15ff11) {
    const _0x560178 = _0x15ff11['target']?.["closest"]?.("[data-action]");
    if (_0x560178 && this["panel"]?.["contains"](_0x560178)) {
      const _0x22f454 = _0x560178["dataset"]['action'] || '';
      if (_0x22f454 === 'close') {
        this["_close"]();
        return;
      }
      if (_0x22f454 === "select-source-type") {
        this["_selectSourceType"](_0x560178["dataset"]["sourceType"]);
        return;
      }
      if (_0x22f454 === "back-to-source-types") {
        this["_showSourceSelect"]();
        return;
      }
      if (_0x22f454 === "select-comfyui-runtime") {
        this['_selectComfyUiRuntime'](_0x560178["dataset"]['comfyuiRuntime']);
        return;
      }
      if (_0x22f454 === 'select-runninghub-runtime') {
        this["_selectRunningHubRuntime"](_0x560178["dataset"]["runninghubRuntime"]);
        return;
      }
      if (_0x22f454 === "toggle-workflow-input") {
        this['_toggleWorkflowInputCollapsed']();
        return;
      }
      if (_0x22f454 === "parse") {
        this['_parseNow']();
        return;
      }
      if (_0x22f454 === "save-config") {
        this["_closeComponentSelectMenus"]();
        this["_saveConfigFromCurrentInput"]();
        return;
      }
      if (_0x22f454 === "create") {
        this['_closeComponentSelectMenus']();
        void this["_createNodeFromCurrentInput"]();
        return;
      }
      if (_0x22f454 === "toggle-component-select") {
        this['_toggleComponentSelect'](_0x560178);
        return;
      }
      if (_0x22f454 === "choose-component-select") {
        this['_chooseComponentSelect'](_0x560178);
        return;
      }
      if (_0x22f454 === "choose-preview-control-type") {
        this['_choosePreviewControlType'](_0x560178);
        return;
      }
      if (_0x22f454 === "confirm-preview-rename") {
        _0x15ff11["preventDefault"]();
        _0x15ff11["stopPropagation"]();
        const _0x3a9f6d = _0x560178['closest']?.(".rh-ai-app-preview-rename-target")?.["querySelector"]?.('[data-role=\x27preview-rename-input\x27]');
        this["_commitPreviewInlineRename"](_0x3a9f6d);
        return;
      }
      if (_0x22f454 === 'rename-preview-param') {
        _0x15ff11["preventDefault"]();
        _0x15ff11['stopPropagation']();
        this['_renamePreviewParamFromTypebar'](_0x560178);
        return;
      }
      if (_0x22f454 === 'edit-preview-description') {
        _0x15ff11['preventDefault']();
        _0x15ff11["stopPropagation"]();
        this["_editPreviewDescriptionFromTypebar"](_0x560178);
        return;
      }
      if (_0x22f454 === "toggle-preview-param-default") {
        _0x15ff11["preventDefault"]();
        _0x15ff11['stopPropagation']();
        this["_togglePreviewParamDefault"](_0x560178);
        return;
      }
      if (_0x22f454 === "remove-preview-param") {
        _0x15ff11["preventDefault"]();
        _0x15ff11["stopPropagation"]();
        this["_removePreviewParam"](_0x560178);
        return;
      }
      if (_0x22f454 === 'remove-preview-input') {
        _0x15ff11['preventDefault']();
        _0x15ff11["stopPropagation"]();
        this["_removePreviewInput"](_0x560178);
        return;
      }
      if (_0x22f454 === "toggle-comfy-candidate-select") {
        this["_toggleComfyCandidateMenu"]();
        return;
      }
      if (_0x22f454 === "choose-comfy-candidate") {
        this["_chooseComfyCandidate"](_0x560178);
        return;
      }
      if (_0x22f454 === "toggle-app-menu") {
        this["_closeComponentSelectMenus"]();
        if (Number(_0x15ff11["detail"] || 0x0) > 0x1) {
          return;
        }
        this["previewAppMenuOpen"] = !this["previewAppMenuOpen"];
        this['pendingDeleteSavedAppId'] = '';
        this["pendingOverwriteSavedAppId"] = '';
        this["pendingOverwriteIntent"] = '';
        this["_patchPreviewAppChrome"]();
        return;
      }
      if (_0x22f454 === "load-saved-app") {
        this['_closeComponentSelectMenus']();
        this["_loadSavedApp"](_0x560178["dataset"]['savedAppId']);
        return;
      }
      if (_0x22f454 === "rename-current-app") {
        this["_closeComponentSelectMenus"]();
        this["previewAppMenuOpen"] = ![];
        this["pendingDeleteSavedAppId"] = '';
        this['pendingOverwriteSavedAppId'] = '';
        this["pendingOverwriteIntent"] = '';
        this["_patchPreviewAppChrome"]();
        this["_focusAppNameInput"]();
        return;
      }
      if (_0x22f454 === "request-delete-app") {
        this["_closeComponentSelectMenus"]();
        this['pendingDeleteSavedAppId'] = String(_0x560178["dataset"]['savedAppId'] || '');
        this['pendingOverwriteSavedAppId'] = '';
        this["pendingOverwriteIntent"] = '';
        this["previewAppMenuOpen"] = !![];
        this["_patchPreviewAppChrome"]();
        return;
      }
      if (_0x22f454 === 'confirm-delete-app') {
        this['_closeComponentSelectMenus']();
        this["_deleteSavedApp"](_0x560178["dataset"]["savedAppId"]);
        return;
      }
      if (_0x22f454 === "cancel-delete-app") {
        this["_closeComponentSelectMenus"]();
        this["pendingDeleteSavedAppId"] = '';
        this["previewAppMenuOpen"] = !![];
        this["_patchPreviewAppChrome"]();
        return;
      }
      if (_0x22f454 === "confirm-overwrite-app") {
        this['_closeComponentSelectMenus']();
        void this["_confirmOverwriteSavedApp"](_0x560178["dataset"]['savedAppId']);
        return;
      }
      if (_0x22f454 === 'cancel-overwrite-app') {
        this["_closeComponentSelectMenus"]();
        const _0xb6a4c0 = Boolean(_0x560178["closest"]?.("[data-role='save-config-menu'], [data-role='create-config-menu']"));
        this["_clearPendingOverwrite"]({
          'keepMenuOpen': !_0xb6a4c0
        });
        return;
      }
    }
    const _0x20d9f3 = _0x15ff11["target"]?.['closest']?.(".rh-ai-app-preview-description-target");
    if (_0x20d9f3 && this['panel']?.["contains"](_0x20d9f3)) {
      const _0x51b844 = Number(_0x20d9f3['dataset']["previewComponentIndex"]);
      const _0x2eea54 = _0x20d9f3["classList"]["contains"]("rh-ai-app-preview-prompt-help-tip");
      if (Number['isInteger'](_0x51b844) || _0x2eea54) {
        _0x15ff11["preventDefault"]();
        _0x15ff11["stopPropagation"]();
        this["_startPreviewInlineDescriptionEdit"](_0x20d9f3, _0x51b844);
        return;
      }
    }
    if (this["_isPreviewControlTarget"](_0x15ff11["target"])) {
      return;
    }
    if (this["previewDragController"]['consumeSuppressedRenameClickForTarget'](_0x15ff11)) {
      return;
    }
    const _0xdfb19c = _0x15ff11["target"]?.["closest"]?.(".rh-ai-app-preview-rename-target");
    if (_0xdfb19c && this['panel']?.["contains"](_0xdfb19c)) {
      const _0x351ee2 = Number(_0xdfb19c["dataset"]["previewComponentIndex"]);
      if (Number["isInteger"](_0x351ee2)) {
        _0x15ff11["preventDefault"]();
        _0x15ff11["stopPropagation"]();
        this["_startPreviewInlineRename"](_0xdfb19c, _0x351ee2);
        return;
      }
    }
    const _0x22f0c0 = _0x15ff11["target"]?.['closest']?.(".rh-ai-app-kind-tabs [data-kind]");
    if (!_0x22f0c0 || !this['panel']?.["contains"](_0x22f0c0)) {
      const _0x3f1bf5 = _0x15ff11["target"]?.['closest']?.('[data-role=\x27saved-app-menu\x27]');
      const _0x509759 = _0x15ff11["target"]?.["closest"]?.("[data-role='save-config-menu'], [data-action='save-config']");
      const _0x126570 = _0x15ff11["target"]?.["closest"]?.('[data-role=\x27create-config-menu\x27],\x20[data-action=\x27create\x27]');
      const _0x2ed9dc = _0x15ff11["target"]?.["closest"]?.(".rh-ai-app-preview-model-trigger");
      const _0x4390b1 = _0x15ff11["target"]?.['closest']?.("[data-component-select]");
      const _0x2edd6b = _0x15ff11['target']?.["closest"]?.(".rh-ai-app-comfy-add-panel, [data-role='comfyui-candidate-menu']");
      !_0x4390b1 && !_0x2edd6b && this['_closeComponentSelectMenus']();
      !_0x3f1bf5 && !_0x2ed9dc && this["previewAppMenuOpen"] && (this["previewAppMenuOpen"] = ![], this['pendingDeleteSavedAppId'] = '', this['pendingOverwriteSavedAppId'] = '', this['pendingOverwriteIntent'] = '', this["_patchPreviewAppChrome"]());
      !_0x509759 && this["pendingOverwriteIntent"] === "save" && this["pendingOverwriteSavedAppId"] && this['_clearPendingOverwrite']();
      !_0x126570 && this["pendingOverwriteIntent"] === "create" && this["pendingOverwriteSavedAppId"] && this['_clearPendingOverwrite']();
      return;
    }
    const _0x49de45 = _0x22f0c0["dataset"]["kind"];
    _0x49de45 && (this["_closeComponentSelectMenus"](), this["_setKind"](_0x49de45));
  }
  ["_handlePanelDoubleClick"](_0x1eafb0) {
    const _0x18c677 = _0x1eafb0['target']?.["closest"]?.(".rh-ai-app-preview-model-trigger");
    if (_0x18c677 && this["panel"]?.["contains"](_0x18c677)) {
      _0x1eafb0["preventDefault"]();
      _0x1eafb0['stopPropagation']();
      this["previewAppMenuOpen"] = ![];
      this['pendingDeleteSavedAppId'] = '';
      this['pendingOverwriteSavedAppId'] = '';
      this["pendingOverwriteIntent"] = '';
      this["_patchPreviewAppChrome"]();
      this["_focusAppNameInput"]();
      return;
    }
    if (this['_isPreviewControlTarget'](_0x1eafb0["target"]) || this['_isPreviewRenameTarget'](_0x1eafb0["target"])) {
      return;
    }
    const _0x2fef73 = _0x1eafb0["target"]?.["closest"]?.('.rh-ai-app-preview-rename-target');
    if (!_0x2fef73 || !this['panel']?.["contains"](_0x2fef73)) {
      return;
    }
    const _0x5284ad = _0x2fef73["closest"]?.("[data-preview-component-index]");
    const _0x2445a2 = Number(_0x5284ad?.["dataset"]?.["previewComponentIndex"] || _0x2fef73["dataset"]?.["previewComponentIndex"]);
    if (!Number["isInteger"](_0x2445a2)) {
      return;
    }
    _0x1eafb0["preventDefault"]();
    _0x1eafb0["stopPropagation"]();
    this["_startPreviewInlineRename"](_0x2fef73, _0x2445a2);
  }
  ['_syncKindTabs']() {
    const _0x2c8847 = normalizeKind(this["kind"]);
    this["kindTabsEl"]?.['classList']["toggle"]("is-kind-image", _0x2c8847 === "image");
    this["kindTabsEl"]?.['classList']["toggle"]("is-kind-video", _0x2c8847 === 'video');
    this["kindTabsEl"]?.['classList']["toggle"]("is-kind-audio", _0x2c8847 === "audio");
    this["panel"]?.['querySelectorAll'](".rh-ai-app-kind-tabs button")['forEach'](_0x2079d2 => {
      const _0x161e54 = _0x2079d2["dataset"]["kind"] === _0x2c8847;
      _0x2079d2['classList']["toggle"]("active", _0x161e54);
      _0x2079d2["setAttribute"]("aria-pressed", _0x161e54 ? "true" : 'false');
    });
  }
  ["_setKind"](_0x3bb71d) {
    const _0x5299c0 = normalizeKind(_0x3bb71d);
    if (_0x5299c0 === this["kind"]) {
      return;
    }
    window['clearTimeout'](this["parseTimer"]);
    this['_saveKindState']();
    this["kind"] = _0x5299c0;
    this["previewAppMenuOpen"] = ![];
    this['pendingDeleteSavedAppId'] = '';
    this['pendingOverwriteSavedAppId'] = '';
    this["pendingOverwriteIntent"] = '';
    this["_syncKindTabs"]();
    this["_restoreKindState"](_0x5299c0);
  }
  ['_saveKindState'](_0x4a837a = this["kind"]) {
    if (!this["sourceType"]) {
      this["_persistPanelDraft"]();
      return;
    }
    const _0x2870c7 = normalizeKind(_0x4a837a);
    this["kindStates"][this["_getStateKey"](_0x2870c7)] = {
      'sourceType': this["sourceType"],
      'input': this['_getInputText'](),
      'definitionReference': this["definitionReference"],
      'appName': this["appName"],
      'appDescription': this['appDescription'],
      'promptHelpTooltip': this["promptHelpTooltip"],
      'runningHubProfileId': this['runningHubProfileId'],
      'savedAppId': this["savedAppId"],
      'componentDraftKey': this["componentDraftKey"],
      'componentDrafts': cloneComponentDrafts(this["componentDrafts"]),
      'componentCandidates': cloneComponentDrafts(this["componentCandidates"]),
      'currentBundle': this["currentBundle"],
      'errorMessage': this["errorMessage"] || ''
    };
    this["_persistPanelDraft"]();
  }
  ["_persistPanelDraft"]() {
    this['configRepository']["savePanelDraft"]({
      'sourceType': this["sourceType"],
      'kind': this["kind"],
      'kindStates': this["kindStates"]
    });
  }
  ["_restoreKindState"](_0x8efd63 = this["kind"]) {
    this["definitionController"]["cancel"]();
    if (!this['sourceType']) {
      this["_syncSourceView"]();
      return;
    }
    const _0x3a32c0 = normalizeKind(_0x8efd63);
    const _0x46927c = this["_getStateKey"](_0x3a32c0);
    const _0x5497c1 = isComfyUiSource(this["sourceType"]) ? this["configRepository"]['getLegacyKindStateKey'](this['sourceType'], _0x3a32c0) : '';
    const _0x342314 = this["sourceType"] === SOURCE_TYPES["runninghub"] ? this['kindStates'][_0x3a32c0] : null;
    const _0x329101 = this["kindStates"][_0x46927c] || (_0x5497c1 ? this["kindStates"][_0x5497c1] : null) || _0x342314 || this["configRepository"]["createEmptyKindState"]();
    this["kindStates"][_0x46927c] = _0x329101;
    this["kind"] = _0x3a32c0;
    if (isRunningHubSource(this["sourceType"]) && isRunningHubSource(_0x329101["sourceType"])) {
      this["sourceType"] = _0x329101["sourceType"];
    }
    this["definitionReference"] = _0x329101['definitionReference'] || '';
    this["_syncSourceView"]();
    this['_syncKindTabs']();
    if (this["textarea"]) {
      this["textarea"]['value'] = _0x329101["input"] || '';
    }
    this["appName"] = _0x329101["appName"] || DEFAULT_AI_APP_NAME;
    this["appDescription"] = normalizeAppDescription(_0x329101["appDescription"]);
    this['promptHelpTooltip'] = normalizePromptHelpTooltip(_0x329101["promptHelpTooltip"]);
    this["runningHubProfileId"] = normalizeRunningHubModelApiProfileId(_0x329101["runningHubProfileId"] || getDefaultRunningHubProfileId());
    this["_syncRunningHubRuntimeControl"]();
    this["savedAppId"] = _0x329101['savedAppId'] || '';
    this["componentDraftKey"] = _0x329101["componentDraftKey"] || '';
    this['componentDrafts'] = cloneComponentDrafts(_0x329101['componentDrafts']);
    this['componentCandidates'] = cloneComponentDrafts(_0x329101["componentCandidates"]);
    this["currentBundle"] = _0x329101["currentBundle"] || null;
    let _0x1598b8 = _0x329101['errorMessage'] || '';
    if (!this["currentBundle"] && this['_getInputText']()["trim"]()) {
      try {
        this['currentBundle'] = this["_buildCurrentBundle"]({
          'syncComponents': this["componentDrafts"]["length"] === 0x0
        });
        _0x1598b8 = '';
      } catch (_0x26da30) {
        this["currentBundle"] = null;
        _0x1598b8 = _0x1598b8 || _0x26da30?.["message"] || "解析失败";
      }
    }
    this["_renderComponentConfig"]();
    this["_patchPreviewWithoutRebuild"](this['currentBundle'], {
      'renderInputs': !![],
      'renderParams': !![],
      'renderAdvanced': !![],
      'renderPrompt': !![],
      'renderAppChrome': !![],
      'renderActionControls': !![]
    });
    this["_setSummary"](this["currentBundle"]);
    this["_setError"](_0x1598b8);
    this["_setActionButtonsEnabled"](!!this["currentBundle"]);
    this["_saveKindState"](_0x3a32c0);
  }
  ["_focusAppNameInput"]() {
    const _0x1763c8 = this["componentListEl"]?.["querySelector"]?.("[data-app-prop='appName']");
    if (!_0x1763c8) {
      return;
    }
    _0x1763c8["scrollIntoView"]?.({
      'block': "nearest",
      'inline': "nearest"
    });
    _0x1763c8["focus"]();
    _0x1763c8["select"]?.();
  }
  ['_startPreviewInlineRename'](_0x364306, _0x3b4c3b) {
    const _0x2b2d1d = Number(_0x3b4c3b);
    if (!Number["isInteger"](_0x2b2d1d)) {
      return;
    }
    const _0x7da5dc = _0x364306?.['closest']?.(".rh-ai-app-preview-rename-target");
    if (!_0x7da5dc || !this["nodePreviewEl"]?.["contains"]?.(_0x7da5dc)) {
      return;
    }
    if (_0x7da5dc['querySelector']?.('[data-role=\x27preview-rename-input\x27]')) {
      return;
    }
    const _0x366295 = getComponentByIndex(this["componentDrafts"], _0x2b2d1d);
    if (!_0x366295) {
      return;
    }
    const _0x5180aa = _0x7da5dc['closest']?.(".rh-ai-app-preview-input-slot");
    const _0x5c5fcb = String(_0x366295["label"] || _0x366295['fieldName'] || '组件')["trim"]() || '组件';
    const _0x1167cc = _0x5180aa && isMediaComponent(_0x366295) ? normalizeInputSlotLabel(_0x5c5fcb) : _0x5c5fcb;
    const _0x48c164 = _0x5180aa ? " maxlength=\"" + INPUT_SLOT_LABEL_INPUT_MAX_LENGTH + '\x22' : '';
    _0x5180aa?.["classList"]?.["add"]("is-inline-editing");
    _0x7da5dc["classList"]["add"]("is-renaming");
    const _0x133a2e = "<input type=\"text\" class=\"rh-ai-app-preview-rename-input\" data-role=\"preview-rename-input\" data-preview-component-index=\"" + _0x2b2d1d + "\" data-original-label=\"" + escapeHtml(_0x1167cc) + '\x22\x20value=\x22' + escapeHtml(_0x1167cc) + "\" aria-label=\"组件名\"" + _0x48c164 + '>';
    _0x7da5dc['innerHTML'] = _0x5180aa ? '<span\x20class=\x22rh-ai-app-preview-slot-rename-shell\x22>' + _0x133a2e + "<button type=\"button\" class=\"rh-ai-app-preview-rename-confirm\" data-action=\"confirm-preview-rename\" data-preview-component-index=\"" + _0x2b2d1d + "\" aria-label=\"确认重命名\">&#10003;</button></span>" : _0x133a2e;
    const _0x2a76b7 = _0x7da5dc['querySelector']("[data-role='preview-rename-input']");
    if (!_0x2a76b7) {
      return;
    }
    const _0x2921ea = () => {
      _0x2a76b7["focus"]();
      _0x2a76b7["select"]?.();
    };
    typeof window["requestAnimationFrame"] === "function" ? window['requestAnimationFrame'](_0x2921ea) : _0x2921ea();
  }
  ['_restorePreviewInlineRename'](_0x1bf946) {
    const _0x83d0ae = Number(_0x1bf946?.['dataset']?.["previewComponentIndex"]);
    if (!Number['isInteger'](_0x83d0ae)) {
      return;
    }
    const _0x41cc5a = _0x1bf946['closest']?.(".rh-ai-app-preview-rename-target");
    const _0x5e3a5d = getComponentByIndex(this["componentDrafts"], _0x83d0ae);
    if (!_0x41cc5a || !_0x5e3a5d) {
      return;
    }
    const _0x1aa4bb = String(_0x5e3a5d['label'] || _0x5e3a5d["fieldName"] || _0x1bf946['dataset']["originalLabel"] || '组件')["trim"]() || '组件';
    const _0x1ae779 = isMediaComponent(_0x5e3a5d) ? normalizeInputSlotLabel(_0x1aa4bb) : _0x1aa4bb;
    _0x41cc5a["closest"]?.(".rh-ai-app-preview-input-slot")?.["classList"]?.['remove']("is-inline-editing");
    _0x41cc5a["classList"]["remove"]("is-renaming");
    _0x41cc5a["classList"]["toggle"]("rh-ai-app-preview-input-label--latin", isMediaComponent(_0x5e3a5d) && INPUT_SLOT_LABEL_LATIN_RE["test"](_0x1ae779));
    _0x41cc5a["textContent"] = _0x1ae779;
  }
  ["_commitPreviewInlineRename"](_0x3ae498, {
    cancel = ![]
  } = {}) {
    if (!_0x3ae498 || _0x3ae498['dataset']['committing'] === "true") {
      return;
    }
    _0x3ae498["dataset"]["committing"] = "true";
    const _0x4eea53 = Number(_0x3ae498['dataset']['previewComponentIndex']);
    if (!Number['isInteger'](_0x4eea53)) {
      return;
    }
    const _0x385484 = String(_0x3ae498["dataset"]["originalLabel"] || '')['trim']();
    const _0x54627d = getComponentByIndex(this['componentDrafts'], _0x4eea53);
    const _0x2145e7 = _0x54627d && isMediaComponent(_0x54627d) ? normalizeInputSlotLabel(_0x3ae498["value"], '') : String(_0x3ae498['value'] || '')['trim']();
    if (_0x54627d && isMediaComponent(_0x54627d) && _0x3ae498['value'] !== _0x2145e7) {
      _0x3ae498["value"] = _0x2145e7;
    }
    if (cancel || !_0x2145e7 || _0x2145e7 === _0x385484) {
      this["_restorePreviewInlineRename"](_0x3ae498);
      return;
    }
    this["_updateComponentDraft"](_0x4eea53, "label", _0x2145e7);
  }
  ['_startPreviewInlineDescriptionEdit'](_0x5b49ad, _0x3237fb = NaN) {
    const _0x558c81 = Number(_0x3237fb);
    const _0x241248 = _0x5b49ad?.['closest']?.('.rh-ai-app-preview-description-target');
    if (!_0x241248 || !this["nodePreviewEl"]?.["contains"]?.(_0x241248)) {
      return;
    }
    const _0x294563 = _0x241248['classList']["contains"]('rh-ai-app-preview-prompt-help-tip');
    if (!Number["isInteger"](_0x558c81) && !_0x294563) {
      return;
    }
    const _0x4394ed = this["nodePreviewEl"]?.["querySelector"]?.("[data-role='preview-description-input']");
    if (_0x4394ed) {
      this["_commitPreviewInlineDescriptionEdit"](_0x4394ed);
    }
    const _0x1f2e0e = Number["isInteger"](_0x558c81) ? getComponentByIndex(this["componentDrafts"], _0x558c81) : null;
    if (Number["isInteger"](_0x558c81) && !_0x1f2e0e) {
      return;
    }
    const _0x32b6e2 = Boolean(_0x241248['closest']?.(".rh-ai-app-preview-advanced-param") || _0x241248["classList"]["contains"]("rh-ai-app-preview-param-description-tip"));
    const _0x3ddde1 = _0x294563 ? "提示词说明" : "参数说明";
    const _0x3caef5 = _0x294563 ? String(_0x241248["getAttribute"]("data-tooltip") || getPreviewComponentDescription(_0x1f2e0e, _0x3ddde1))["trim"]() || _0x3ddde1 : getPreviewComponentDescription(_0x1f2e0e, _0x3ddde1);
    const _0x3d088a = document["createElement"]("input");
    _0x3d088a["type"] = "text";
    _0x3d088a["className"] = ["rh-ai-app-preview-description-input", _0x294563 ? "rh-ai-app-preview-description-input--prompt" : '', _0x32b6e2 ? "rh-ai-app-preview-description-input--param" : '']["filter"](Boolean)['join']('\x20');
    _0x3d088a["dataset"]['role'] = 'preview-description-input';
    Number["isInteger"](_0x558c81) && (_0x3d088a["dataset"]["previewComponentIndex"] = String(_0x558c81));
    _0x294563 && (_0x3d088a["dataset"]["previewDescriptionScope"] = "prompt-help");
    _0x3d088a['dataset']['originalDescription'] = _0x3caef5;
    _0x3d088a['value'] = _0x3caef5;
    _0x3d088a["placeholder"] = _0x3ddde1;
    _0x3d088a["setAttribute"]("aria-label", _0x3ddde1);
    _0x241248["replaceWith"](_0x3d088a);
    const _0x10478c = () => {
      _0x3d088a["focus"]();
      _0x3d088a['select']?.();
    };
    typeof window['requestAnimationFrame'] === "function" ? window["requestAnimationFrame"](_0x10478c) : _0x10478c();
  }
  ['_restorePreviewInlineDescriptionEdit']() {
    const _0x598afa = this["_refreshBundleFromComponents"]({
      'renderPreview': ![]
    });
    this["_patchPreviewWithoutRebuild"](_0x598afa, {
      'renderParams': !![],
      'renderAdvanced': !![],
      'renderPrompt': !![]
    });
  }
  ['_commitPreviewInlineDescriptionEdit'](_0x594f0a, {
    cancel = ![]
  } = {}) {
    if (!_0x594f0a || _0x594f0a['dataset']["committing"] === "true") {
      return;
    }
    _0x594f0a["dataset"]["committing"] = 'true';
    const _0x24db2d = Number(_0x594f0a["dataset"]["previewComponentIndex"]);
    const _0x183476 = _0x594f0a['dataset']["previewDescriptionScope"] === 'prompt-help';
    if (!Number['isInteger'](_0x24db2d) && !_0x183476) {
      return;
    }
    const _0x49c464 = String(_0x594f0a["dataset"]["originalDescription"] || '')["trim"]();
    const _0x55d90b = String(_0x594f0a["value"] || '')['trim']();
    if (cancel || !_0x55d90b || _0x55d90b === _0x49c464) {
      this["_restorePreviewInlineDescriptionEdit"]();
      return;
    }
    if (!Number['isInteger'](_0x24db2d) && _0x183476) {
      this["_updatePromptHelpTooltip"](_0x55d90b);
      return;
    }
    this["_updateComponentDraft"](_0x24db2d, "description", _0x55d90b);
  }
  ['_handlePanelKeyDown'](_0x15d24b) {
    const _0x262968 = _0x15d24b["target"]?.['closest']?.(".rh-ai-app-preview-description-target");
    if (_0x262968 && this["panel"]?.["contains"](_0x262968)) {
      if (_0x15d24b["key"] === "Enter" || _0x15d24b["key"] === '\x20') {
        const _0x28dc88 = Number(_0x262968["dataset"]["previewComponentIndex"]);
        const _0xf83cef = _0x262968["classList"]["contains"]("rh-ai-app-preview-prompt-help-tip");
        (Number["isInteger"](_0x28dc88) || _0xf83cef) && (_0x15d24b["preventDefault"](), _0x15d24b["stopPropagation"](), this["_startPreviewInlineDescriptionEdit"](_0x262968, _0x28dc88));
      }
      return;
    }
    const _0x53d45e = _0x15d24b["target"]?.["closest"]?.("[data-role='preview-description-input']");
    if (_0x53d45e && this["panel"]?.["contains"](_0x53d45e)) {
      if (_0x15d24b["key"] === "Enter") {
        _0x15d24b["preventDefault"]();
        _0x15d24b['stopPropagation']();
        this["_commitPreviewInlineDescriptionEdit"](_0x53d45e);
        return;
      }
      _0x15d24b["key"] === "Escape" && (_0x15d24b["preventDefault"](), _0x15d24b["stopPropagation"](), this["_commitPreviewInlineDescriptionEdit"](_0x53d45e, {
        'cancel': !![]
      }));
      return;
    }
    const _0x204c4e = _0x15d24b["target"]?.["closest"]?.("[data-role='preview-rename-input']");
    if (!_0x204c4e || !this["panel"]?.['contains'](_0x204c4e)) {
      return;
    }
    if (_0x15d24b["key"] === 'Enter') {
      _0x15d24b["preventDefault"]();
      _0x15d24b['stopPropagation']();
      this["_commitPreviewInlineRename"](_0x204c4e);
      return;
    }
    _0x15d24b["key"] === 'Escape' && (_0x15d24b["preventDefault"](), _0x15d24b["stopPropagation"](), this["_commitPreviewInlineRename"](_0x204c4e, {
      'cancel': !![]
    }));
  }
  ["_handlePanelFocusOut"](_0xf486e1) {
    const _0x220314 = _0xf486e1["target"]?.["closest"]?.("[data-role='preview-description-input']");
    if (_0x220314 && this['panel']?.["contains"](_0x220314)) {
      this["_commitPreviewInlineDescriptionEdit"](_0x220314);
      return;
    }
    const _0x380d17 = _0xf486e1["target"]?.["closest"]?.("[data-role='preview-rename-input']");
    if (!_0x380d17 || !this["panel"]?.["contains"](_0x380d17)) {
      return;
    }
    const _0x34d2 = _0xf486e1["relatedTarget"]?.["closest"]?.('[data-action=\x27confirm-preview-rename\x27]');
    if (_0x34d2 && this["panel"]?.["contains"](_0x34d2)) {
      return;
    }
    this["_commitPreviewInlineRename"](_0x380d17);
  }
  ["_closeComponentSelectMenus"](_0x222568 = null, {
    preserveComfyPicker = ![]
  } = {}) {
    this["componentListEl"]?.["querySelectorAll"]?.("[data-component-select].is-open")["forEach"](_0x31ae59 => {
      if (_0x222568 && _0x31ae59 === _0x222568) {
        return;
      }
      _0x31ae59["classList"]['remove']("is-open");
      _0x31ae59["querySelector"]('.rh-ai-app-select-trigger')?.['setAttribute']("aria-expanded", 'false');
    });
    if (preserveComfyPicker) {
      return;
    }
    this["comfyCandidatePickerOpen"] = ![];
    if (this["componentPickerEl"]) {
      this["componentPickerEl"]["hidden"] = ![];
      this["componentPickerEl"]["setAttribute"]("aria-hidden", 'true');
      const _0x31bf2c = this["componentPickerEl"]["closest"]?.(".rh-ai-app-comfy-add-panel");
      _0x31bf2c?.["classList"]?.['remove']("is-open");
      const _0x3e84dc = _0x31bf2c?.["querySelector"]?.("[data-action='toggle-comfy-candidate-select']");
      _0x3e84dc?.['setAttribute']("aria-expanded", "false");
      if (_0x3e84dc) {
        _0x3e84dc['textContent'] = "点击添加组件";
      }
    }
  }
  ['_closeInlineMenusBeforeContextMenu']() {
    this["_closeComponentSelectMenus"]();
    if (!this["previewAppMenuOpen"]) {
      return;
    }
    this["previewAppMenuOpen"] = ![];
    this["pendingDeleteSavedAppId"] = '';
    this["pendingOverwriteSavedAppId"] = '';
    this["pendingOverwriteIntent"] = '';
    const _0xcc21d = this["panel"]?.["querySelector"]?.("[data-role='saved-app-menu']");
    if (_0xcc21d) {
      _0xcc21d["hidden"] = !![];
    }
  }
  ['_toggleComponentSelect'](_0x37d0f5) {
    const _0x44ec65 = _0x37d0f5?.["closest"]?.("[data-component-select]");
    if (!_0x44ec65 || !this["panel"]?.["contains"](_0x44ec65)) {
      return;
    }
    const _0x4a5b60 = !_0x44ec65["classList"]['contains']("is-open");
    this['_closeComponentSelectMenus'](_0x44ec65);
    _0x44ec65["classList"]["toggle"]("is-open", _0x4a5b60);
    _0x37d0f5["setAttribute"]("aria-expanded", _0x4a5b60 ? 'true' : 'false');
    this['previewAppMenuOpen'] = ![];
    this["pendingDeleteSavedAppId"] = '';
    this['pendingOverwriteSavedAppId'] = '';
    this['pendingOverwriteIntent'] = '';
    this['_patchPreviewAppChrome']();
  }
  ["_chooseComponentSelect"](_0x55100c) {
    const _0x730130 = _0x55100c?.["closest"]?.('[data-component-index]');
    const _0x5db307 = Number(_0x730130?.["dataset"]['componentIndex']);
    const _0x18347b = String(_0x55100c?.["dataset"]?.["componentProp"] || '');
    if (!Number["isInteger"](_0x5db307) || !_0x18347b) {
      return;
    }
    this["_closeComponentSelectMenus"]();
    this['_updateComponentDraft'](_0x5db307, _0x18347b, _0x55100c['dataset']["value"]);
  }
  ["_choosePreviewControlType"](_0x3bdf65) {
    const _0x374405 = Number(_0x3bdf65?.['dataset']?.["previewComponentIndex"]);
    const _0x297f7c = String(_0x3bdf65?.["dataset"]?.["value"] || '');
    if (!Number["isInteger"](_0x374405) || !_0x297f7c) {
      return;
    }
    const _0x580b50 = getComponentByIndex(this["componentDrafts"], _0x374405);
    const _0x1de906 = normalizeControlType(_0x297f7c);
    const _0xc9c067 = _0x1de906 === "prompt" && _0x580b50 && normalizeComponentKind(_0x580b50["componentKind"]) !== 'prompt';
    const _0x204dc1 = PREVIEW_PARAM_TEXT_TYPE_VALUES['includes'](_0x1de906) && _0x580b50 && normalizeComponentKind(_0x580b50["componentKind"]) === "prompt";
    const _0x4e7ceb = _0xc9c067 || _0x204dc1 ? this["previewDragController"]["captureComponentRect"](_0x374405) : null;
    this['_closeComponentSelectMenus']();
    this["previewAppMenuOpen"] = ![];
    this["pendingDeleteSavedAppId"] = '';
    this["pendingOverwriteSavedAppId"] = '';
    this['pendingOverwriteIntent'] = '';
    const _0x12de6f = normalizeControlType(_0x297f7c) === 'prompt' ? 'componentKind' : 'controlType';
    this["_updateComponentDraft"](_0x374405, _0x12de6f, _0x297f7c, {
      'animatePreviewMoveFromRect': _0x4e7ceb,
      'preferredPreviewPlacement': _0x204dc1 ? "advanced" : ''
    });
  }
  ["_setError"](_0x58f154) {
    const _0x14b99b = String(_0x58f154 || '')["trim"]();
    this["errorMessage"] = _0x14b99b;
    if (!this["errorEl"]) {
      return;
    }
    this["errorEl"]["hidden"] = !_0x14b99b;
    this['errorEl']["textContent"] = _0x14b99b;
  }
  ["_setSummary"](_0x1d46ed) {
    if (!this["summaryEl"]) {
      return;
    }
    const _0x5eb2d7 = _0x1d46ed ? this["_isComfyUiSource"]() ? summarizeComfyUiWorkflowBundle(_0x1d46ed) : summarizeRunningHubAiAppBundle(_0x1d46ed) : null;
    this["summaryEl"]["innerHTML"] = renderSummaryHtml(_0x5eb2d7 && {
      ..._0x5eb2d7,
      'resourceIdLabel': this["sourceType"] === SOURCE_TYPES["runninghubWorkflow"] ? "工作流 ID" : "App ID"
    }, this["_getSourceMeta"]()?.["emptyText"]);
    this["_syncWorkflowInputCollapsed"]();
  }
  ["_getWorkflowInputSummaryText"](_0x566c47 = this["currentBundle"]) {
    if (!_0x566c47) {
      return '';
    }
    const _0x9148e2 = this['_isComfyUiSource']() ? summarizeComfyUiWorkflowBundle(_0x566c47) : summarizeRunningHubAiAppBundle(_0x566c47);
    if (!_0x9148e2?.["modelId"]) {
      return '';
    }
    const _0x426cb1 = this['_getSourceMeta']()?.["label"] || '工作流';
    const _0xf26eca = OUTPUT_KIND_LABELS[_0x9148e2["kind"]] || _0x9148e2["kind"];
    const _0x1ab6b5 = Number(_0x9148e2["slotCount"] ?? _0x9148e2["slots"]?.["length"] ?? 0x0);
    const _0x250b5d = Number(_0x9148e2["paramCount"] ?? _0x9148e2["params"]?.["length"] ?? 0x0);
    return _0x426cb1 + " · " + _0xf26eca + " · " + _0x1ab6b5 + " 个入参 · " + _0x250b5d + '\x20个参数';
  }
  ["_syncWorkflowInputCollapsed"]() {
    const _0xcfd26 = Boolean(this["currentBundle"]);
    if (!_0xcfd26) {
      this["workflowInputCollapsed"] = ![];
    }
    this['workflowInputFieldEl']?.["classList"]?.['toggle']("is-collapsed", _0xcfd26 && this["workflowInputCollapsed"]);
    if (this["workflowInputToggleBtn"]) {
      this["workflowInputToggleBtn"]["hidden"] = !_0xcfd26;
      const _0x2291fe = this["workflowInputCollapsed"] ? "展开 JSON" : "收起 JSON";
      this["workflowInputToggleBtn"]["setAttribute"]("aria-label", _0x2291fe);
      this["workflowInputToggleBtn"]['title'] = _0x2291fe;
      this["workflowInputToggleBtn"]["setAttribute"]("aria-expanded", this["workflowInputCollapsed"] ? "false" : "true");
    }
    if (this["workflowInputSummaryEl"]) {
      const _0x3c964d = this["_getWorkflowInputSummaryText"]();
      const _0x490e73 = Boolean(_0x3c964d);
      const _0x1ff5cf = _0xcfd26 && _0x490e73 && (this["workflowInputCollapsed"] || this["_isRunningHubAiAppSource"]());
      this["workflowInputSummaryEl"]["hidden"] = !_0x490e73;
      this["workflowInputSummaryEl"]['classList']?.["toggle"]('is-visible', _0x1ff5cf);
      this["workflowInputSummaryEl"]["setAttribute"]('aria-hidden', _0x1ff5cf ? "false" : "true");
      if (_0x490e73) {
        this['workflowInputSummaryEl']["textContent"] = _0x3c964d;
        if (this["_isRunningHubAiAppSource"]()) {
          const _0x2b0e63 = this["_getSourceMeta"]()['label'];
          this["workflowInputSummaryEl"]["innerHTML"] = "<span class=\"rh-ai-app-resource-type\" data-role=\"runninghub-resource-type\">" + escapeHtml(_0x2b0e63) + "</span>" + escapeHtml(_0x3c964d["slice"](_0x2b0e63['length']));
        }
      }
    }
  }
  ["_toggleWorkflowInputCollapsed"]() {
    if (!this["currentBundle"]) {
      return;
    }
    this["workflowInputCollapsed"] = !this['workflowInputCollapsed'];
    this["_syncWorkflowInputCollapsed"]();
  }
  ["_getInputText"]() {
    return this["textarea"]?.["value"] || '';
  }
  ["_getAppIdText"]() {
    return '';
  }
  ['_setWorkflowJsonDropActive'](_0x1ee988) {
    if (!_0x1ee988) {
      this['workflowJsonDragDepth'] = 0x0;
    }
    this["workflowInputFieldEl"]?.["classList"]?.["toggle"]("is-json-drag-over", _0x1ee988 === !![]);
  }
  ["_canAcceptWorkflowJsonDrop"](_0x543bb4) {
    return Boolean(this['sourceType'] && hasFileDragPayload(_0x543bb4));
  }
  ["_handleWorkflowJsonFileDragEnter"](_0x532ef6) {
    if (!this["_canAcceptWorkflowJsonDrop"](_0x532ef6)) {
      return;
    }
    _0x532ef6["preventDefault"]();
    _0x532ef6['stopPropagation']();
    this["workflowJsonDragDepth"] += 0x1;
    this["_setWorkflowJsonDropActive"](!![]);
    if (_0x532ef6['dataTransfer']) {
      _0x532ef6["dataTransfer"]["dropEffect"] = 'copy';
    }
  }
  ["_handleWorkflowJsonFileDragOver"](_0x28825b) {
    if (!this["_canAcceptWorkflowJsonDrop"](_0x28825b)) {
      return;
    }
    _0x28825b["preventDefault"]();
    _0x28825b["stopPropagation"]();
    this["_setWorkflowJsonDropActive"](!![]);
    if (_0x28825b["dataTransfer"]) {
      _0x28825b['dataTransfer']['dropEffect'] = 'copy';
    }
  }
  ["_handleWorkflowJsonFileDragLeave"](_0x321c9b) {
    if (!this["_canAcceptWorkflowJsonDrop"](_0x321c9b)) {
      return;
    }
    _0x321c9b['preventDefault']();
    _0x321c9b["stopPropagation"]();
    this['workflowJsonDragDepth'] = Math["max"](0x0, this['workflowJsonDragDepth'] - 0x1);
    if (this["workflowJsonDragDepth"] === 0x0) {
      this["_setWorkflowJsonDropActive"](![]);
    }
  }
  async ["_handleWorkflowJsonFileDrop"](_0x4489e5) {
    if (!this['_canAcceptWorkflowJsonDrop'](_0x4489e5)) {
      return;
    }
    _0x4489e5["preventDefault"]();
    _0x4489e5["stopPropagation"]();
    this['_setWorkflowJsonDropActive'](![]);
    const [_0xc2ef47] = Array['from'](_0x4489e5["dataTransfer"]?.["files"] || []);
    if (!_0xc2ef47) {
      return;
    }
    if (!isJsonFile(_0xc2ef47)) {
      const _0x5d8eaf = "请拖入 .json 文件";
      this["_setError"](_0x5d8eaf);
      window["showToast"]?.(_0x5d8eaf, 'error');
      return;
    }
    const _0x106a40 = this['definitionController']['beginFileRead']();
    try {
      const _0x2faa49 = await _0xc2ef47['text']();
      if (!_0x106a40["isCurrent"]()) {
        return;
      }
      window["clearTimeout"](this["parseTimer"]);
      if (this["textarea"]) {
        this['textarea']['value'] = String(_0x2faa49 || '');
      }
      this["appName"] = normalizeDroppedJsonAppName(_0xc2ef47['name']);
      this["savedAppId"] = '';
      this["workflowInputCollapsed"] = ![];
      this["previewAppMenuOpen"] = ![];
      this["pendingDeleteSavedAppId"] = '';
      this["pendingOverwriteSavedAppId"] = '';
      this["pendingOverwriteIntent"] = '';
      this['_closeComponentSelectMenus']();
      const _0x8b6cdf = this["_parseNow"]();
      if (_0x8b6cdf) {
        window["showToast"]?.("JSON 文件已载入", "success");
      }
    } catch (_0x45a398) {
      if (!_0x106a40["isCurrent"]()) {
        return;
      }
      const _0x5e6f6b = _0x45a398?.["message"] || "JSON 文件读取失败";
      this["_setError"](_0x5e6f6b);
      window["showToast"]?.(_0x5e6f6b, "error");
    } finally {
      _0x106a40["finish"]();
    }
  }
  ["_getComponentDraftKey"](_0x42e152 = this["_getInputText"](), _0x32aada = this["_getAppIdText"]()) {
    const _0xaa4d2c = isComfyUiSource(this["sourceType"]) ? COMFYUI_WORKFLOW_STATE_SCOPE : String(this["sourceType"] || '')["trim"]();
    return _0xaa4d2c + '\x0a' + String(_0x32aada || '')['trim']() + '\x0a' + String(_0x42e152 || '')["trim"]();
  }
  ["_syncComponentDrafts"]({
    force = ![]
  } = {}) {
    const _0x4bd3d1 = this["_getInputText"]();
    const _0x5d048a = this["_getAppIdText"]();
    const _0x32a40a = this["_getComponentDraftKey"](_0x4bd3d1, _0x5d048a);
    if (!force && _0x32a40a === this["componentDraftKey"] && (this["componentDrafts"]["length"] || this["componentCandidates"]["length"])) {
      return;
    }
    if (this["_shouldShowManualComponentPicker"]()) {
      const {
        components: _0x1e4ec6
      } = this["sourceType"] === SOURCE_TYPES["runninghubWorkflow"] ? createRunningHubWorkflowComponentDrafts(_0x4bd3d1) : createComfyUiWorkflowComponentDrafts(_0x4bd3d1);
      this['componentDraftKey'] = _0x32a40a;
      this['comfyCandidateSearchText'] = '';
      this["comfyCandidatePickerOpen"] = ![];
      this['componentCandidates'] = cloneComponentDrafts(_0x1e4ec6);
      this['componentDrafts'] = preserveComfyComponentDrafts(this["componentDrafts"], _0x1e4ec6);
      this["_renderComponentConfig"]();
      return;
    }
    const {
      parsed: _0x2a55b7,
      components: _0x38789b
    } = createRunningHubAiAppComponentDrafts(_0x4bd3d1, {
      'appId': _0x5d048a
    });
    _0x2a55b7["providerProfileId"] && (this['runningHubProfileId'] = normalizeRunningHubModelApiProfileId(_0x2a55b7["providerProfileId"]), this["_syncRunningHubRuntimeControl"]());
    this["componentDraftKey"] = _0x32a40a;
    this["componentDrafts"] = cloneComponentDrafts(_0x38789b);
    this["componentCandidates"] = [];
    this["comfyCandidatePickerOpen"] = ![];
    this["_renderComponentConfig"]();
  }
  ['_renderComponentConfig']() {
    this['componentListEl'] && (this["componentListEl"]["innerHTML"] = renderComponentConfigHtml(this["componentDrafts"], this["appName"], this["appDescription"], {}));
    this["builderEl"] && (this["builderEl"]["hidden"] = ![]);
  }
  ["_renderComfyCandidatePicker"]({
    open = ![],
    preserveSearchFocus = ![]
  } = {}) {
    if (!this["componentPickerEl"]) {
      return;
    }
    const _0x1951ce = this["_shouldShowManualComponentPicker"]() && Boolean(this["componentDraftKey"]);
    if (!_0x1951ce) {
      this["comfyCandidatePickerOpen"] = ![];
      this["componentPickerEl"]["hidden"] = !![];
      this["componentPickerEl"]["setAttribute"]('aria-hidden', "true");
      this['componentPickerEl']['innerHTML'] = '';
      return;
    }
    this['comfyCandidatePickerOpen'] = open === !![];
    const _0x4195cb = new Set(this["componentDrafts"]["map"](_0x298c27 => Number(_0x298c27?.["index"]))["filter"](_0x1431b5 => Number["isInteger"](_0x1431b5)));
    this["componentPickerEl"]['innerHTML'] = renderComfyUiCandidateMenuHtml(this['componentCandidates'], _0x4195cb, this["comfyCandidateSearchText"]);
    this['componentPickerEl']["hidden"] = ![];
    this["componentPickerEl"]["setAttribute"]("aria-hidden", open === !![] ? "false" : "true");
    const _0xaeb0be = this['componentPickerEl']["closest"]?.('.rh-ai-app-comfy-add-panel');
    _0xaeb0be?.["classList"]?.["toggle"]("is-open", open === !![]);
    const _0x36fec6 = _0xaeb0be?.['querySelector']?.('[data-action=\x27toggle-comfy-candidate-select\x27]');
    _0x36fec6?.["setAttribute"]("aria-expanded", open === !![] ? "true" : "false");
    if (_0x36fec6) {
      _0x36fec6["textContent"] = open === !![] ? "收起组件" : "点击添加组件";
    }
    if (open && preserveSearchFocus) {
      const _0x5841de = _0xaeb0be?.["querySelector"]("[data-role='comfyui-candidate-search']");
      const _0x1aa77d = String(this["comfyCandidateSearchText"] || '')["length"];
      _0x5841de?.["focus"]?.();
      _0x5841de?.["setSelectionRange"]?.(_0x1aa77d, _0x1aa77d);
    }
  }
  ["_toggleComfyCandidateMenu"]() {
    if (!this["_shouldShowManualComponentPicker"]()) {
      return;
    }
    if (!this["componentDraftKey"]) {
      this['comfyCandidatePickerOpen'] = ![];
      this["_renderComfyCandidatePicker"]({
        'open': ![]
      });
      return;
    }
    const _0x45166d = this["comfyCandidatePickerOpen"] !== !![];
    this["_closeComponentSelectMenus"](null, {
      'preserveComfyPicker': !![]
    });
    this["previewAppMenuOpen"] = ![];
    this["pendingDeleteSavedAppId"] = '';
    this["pendingOverwriteSavedAppId"] = '';
    this["pendingOverwriteIntent"] = '';
    if (_0x45166d) {
      this['comfyCandidateSearchText'] = '';
    }
    this["comfyCandidatePickerOpen"] = _0x45166d;
    this['_renderComfyCandidatePicker']({
      'open': _0x45166d
    });
  }
  ["_captureComfyCandidateScrollState"](_0x41adc6 = null) {
    const _0x4d1ffd = _0x41adc6?.["closest"]?.(".rh-ai-app-candidate-options");
    return {
      'panelScrollTop': Number(this["bodyEl"]?.["scrollTop"] || 0x0),
      'candidateScrollTop': Number(_0x4d1ffd?.['scrollTop'] || 0x0)
    };
  }
  ["_restoreComfyCandidateScrollState"](_0xd75ec = {}) {
    this["bodyEl"] && Number['isFinite'](_0xd75ec["panelScrollTop"]) && (this['bodyEl']["scrollTop"] = _0xd75ec["panelScrollTop"]);
    const _0x22d5a6 = this["componentPickerEl"]?.["querySelector"]?.(".rh-ai-app-candidate-options");
    _0x22d5a6 && Number["isFinite"](_0xd75ec["candidateScrollTop"]) && (_0x22d5a6["scrollTop"] = _0xd75ec["candidateScrollTop"]);
    this["_syncStickyHeaderShadow"]();
  }
  ["_chooseComfyCandidate"](_0x2fc139) {
    if (!this["_shouldShowManualComponentPicker"]()) {
      return;
    }
    const _0x5d8777 = Number(_0x2fc139?.['dataset']?.["componentIndex"]);
    if (!Number["isInteger"](_0x5d8777)) {
      return;
    }
    const _0x1f0371 = this["componentDrafts"]["some"](_0xce648d => Number(_0xce648d?.["index"]) === _0x5d8777);
    if (_0x1f0371) {
      return;
    }
    const _0x21921c = this['componentCandidates']["find"](_0xfbd027 => Number(_0xfbd027?.["index"]) === _0x5d8777);
    if (!_0x21921c) {
      return;
    }
    const _0x45e346 = this["_captureComfyCandidateScrollState"](_0x2fc139);
    this["componentDrafts"]['push']({
      ..._0x21921c,
      'label': getComfyUiCandidateDefaultComponentName(_0x21921c)
    });
    this['comfyCandidatePickerOpen'] = !![];
    const _0x2b770c = this["_refreshBundleFromComponents"]({
      'renderPreview': ![]
    });
    this['_patchPreviewWithoutRebuild'](_0x2b770c, {
      'renderInputs': !![],
      'renderParams': !![],
      'renderAdvanced': !![],
      'renderPrompt': !![],
      'renderAppChrome': !![],
      'renderActionControls': !![]
    });
    this["_renderComfyCandidatePicker"]({
      'open': !![]
    });
    this['_restoreComfyCandidateScrollState'](_0x45e346);
    requestAnimationFrame(() => this["_restoreComfyCandidateScrollState"](_0x45e346));
  }
  ['_renderNodePreview'](_0x16f97f = this['currentBundle']) {
    return this["previewPresentation"]["_renderNodePreview"](_0x16f97f);
  }
  ["_closePreviewAppMenuElement"](_0x2da7f7) {
    return this["previewPresentation"]['_closePreviewAppMenuElement'](_0x2da7f7);
  }
  ["_patchPreviewAppChrome"]() {
    return this["previewPresentation"]["_patchPreviewAppChrome"]();
  }
  ["_patchSaveConfigMenu"]() {
    return this["previewPresentation"]["_patchSaveConfigMenu"]();
  }
  ["_patchCreateConfigMenu"]() {
    return this['previewPresentation']["_patchCreateConfigMenu"]();
  }
  ["_patchFooterOverwriteMenu"](_0x28eee4, _0x416c40) {
    return this["previewPresentation"]['_patchFooterOverwriteMenu'](_0x28eee4, _0x416c40);
  }
  ["_patchPreviewPromptArea"]() {
    return this["previewPresentation"]["_patchPreviewPromptArea"]();
  }
  ["_patchPreviewActionControls"](_0x357fa1 = this["currentBundle"]) {
    return this['previewPresentation']["_patchPreviewActionControls"](_0x357fa1);
  }
  ["_patchPreviewWithoutRebuild"](_0x3a115e = this["currentBundle"], _0x3c4ab6 = {}) {
    return this['previewPresentation']["_patchPreviewWithoutRebuild"](_0x3a115e, _0x3c4ab6);
  }
  ["_renderPreviewMutableZones"](_0x3cefec = this["currentBundle"], _0x5dfbb0 = {}) {
    return this["previewPresentation"]["_renderPreviewMutableZones"](_0x3cefec, _0x5dfbb0);
  }
  ["_clearBuilder"]() {
    this["componentDraftKey"] = '';
    this["componentDrafts"] = [];
    this['componentCandidates'] = [];
    this["promptHelpTooltip"] = '';
    this["comfyCandidateSearchText"] = '';
    this["comfyCandidatePickerOpen"] = ![];
    this["workflowInputCollapsed"] = ![];
    this["previewAppMenuOpen"] = ![];
    this["pendingDeleteSavedAppId"] = '';
    this["pendingOverwriteSavedAppId"] = '';
    this['pendingOverwriteIntent'] = '';
    this["previewPresentation"]["clearUiSchemaBinding"]();
    this["_renderComponentConfig"]();
    this['_renderNodePreview'](null);
    this['_syncWorkflowInputCollapsed']();
    this["_setActionButtonsEnabled"](![]);
  }
  ['_clearCurrentDraftIdentity']() {
    this["savedAppId"] = '';
    this["appName"] = DEFAULT_AI_APP_NAME;
    this["appDescription"] = '';
    this["promptHelpTooltip"] = '';
    this["previewAppMenuOpen"] = ![];
    this["pendingDeleteSavedAppId"] = '';
    this["pendingOverwriteSavedAppId"] = '';
    this['pendingOverwriteIntent'] = '';
  }
  ["_buildCurrentBundle"]({
    syncComponents = !![]
  } = {}) {
    if (this['_isRunningHubAiAppSource']()) {
      assertRunningHubDefinitionProfile(this["_getInputText"](), this['runningHubProfileId']);
    }
    if (syncComponents) {
      this['definitionController']["syncInputSource"]();
    }
    if (syncComponents) {
      this['_syncComponentDrafts']();
    }
    if (this["sourceType"] === SOURCE_TYPES["runninghubWorkflow"]) {
      return buildRunningHubWorkflowManifestBundle({
        'input': this["_getInputText"](),
        'kind': this["kind"],
        'components': this["componentDrafts"],
        'displayName': normalizeAppName(this["appName"]),
        'description': this["appDescription"],
        'promptHelpTooltip': this["promptHelpTooltip"],
        'appKey': this['savedAppId']
      });
    }
    if (this["_isComfyUiSource"]()) {
      return buildComfyUiWorkflowManifestBundle({
        'input': this["_getInputText"](),
        'kind': this["kind"],
        'components': this["componentDrafts"],
        'displayName': normalizeAppName(this["appName"]),
        'description': normalizeAppDescription(this['appDescription']),
        'promptHelpTooltip': normalizePromptHelpTooltip(this["promptHelpTooltip"]),
        'appKey': this['savedAppId'],
        'baseUrlMode': getComfyUiBaseUrlMode(this['sourceType']),
        'componentSelectionMode': 'manual'
      });
    }
    return buildRunningHubAiAppManifestBundle({
      'input': this["_getInputText"](),
      'appId': this["_getAppIdText"](),
      'kind': this["kind"],
      'components': this['componentDrafts'],
      'displayName': normalizeAppName(this['appName']),
      'description': normalizeAppDescription(this["appDescription"]),
      'promptHelpTooltip': normalizePromptHelpTooltip(this["promptHelpTooltip"]),
      'appKey': this["savedAppId"]
    });
  }
  ["_refreshBundleFromComponents"]({
    renderPreview = !![]
  } = {}) {
    try {
      const _0x1cface = this['_buildCurrentBundle']({
        'syncComponents': ![]
      });
      this["currentBundle"] = _0x1cface;
      this["_setSummary"](_0x1cface);
      this["_setError"]('');
      if (renderPreview) {
        this["_renderNodePreview"](_0x1cface);
      }
      this["_setActionButtonsEnabled"](!![]);
      this["_saveKindState"]();
      return _0x1cface;
    } catch (_0x21beca) {
      this["currentBundle"] = null;
      this["_setActionButtonsEnabled"](![]);
      this["_setError"](_0x21beca?.["message"] || '解析失败');
      this["_saveKindState"]();
      return null;
    }
  }
  ['_bindPreviewUiSchemaControls']() {
    return this["previewPresentation"]["_bindPreviewUiSchemaControls"]();
  }
  ["_commitPreviewUiSchemaValue"](_0x55a2cf, _0x12183f) {
    const _0x2e13e4 = String(_0x55a2cf || '')['trim']();
    if (!_0x2e13e4) {
      return buildPreviewUiSchemaNodeData(this["currentBundle"]);
    }
    const _0x972f17 = getBundleParamFields(this['currentBundle'])["find"](_0x5f0611 => String(_0x5f0611?.['id'] || '')["trim"]() === _0x2e13e4);
    const _0x3943e9 = getCustomAiAppComponentIndex(_0x972f17);
    const _0x3c7d9a = Number["isInteger"](_0x3943e9) ? getComponentByIndex(this['componentDrafts'], _0x3943e9) : null;
    if (!_0x3c7d9a || !isParamComponent(_0x3c7d9a)) {
      return buildPreviewUiSchemaNodeData(this["currentBundle"]);
    }
    const _0x3440e = normalizeControlType(_0x3c7d9a['controlType']);
    if (_0x3440e === "toggle") {
      _0x3c7d9a["defaultValue"] = _0x12183f === !![] || String(_0x12183f)["toLowerCase"]() === "true" ? 'true' : "false";
    } else {
      if (_0x3440e === "stepper") {
        _0x3c7d9a["defaultValue"] = String(Math['trunc'](Number(_0x12183f) || 0x0));
      } else {
        if (_0x3440e === "float") {
          const _0x4be559 = Number(_0x12183f);
          _0x3c7d9a["defaultValue"] = Number["isFinite"](_0x4be559) ? String(_0x4be559) : '0';
        } else {
          _0x3c7d9a["defaultValue"] = String(_0x12183f ?? '');
        }
      }
    }
    const _0x108e38 = this['_refreshBundleFromComponents']({
      'renderPreview': ![]
    });
    return buildPreviewUiSchemaNodeData(_0x108e38 || this["currentBundle"]);
  }
  ["_decoratePreviewAdvancedFields"](_0x5a641f = this["currentBundle"]) {
    return this["previewPresentation"]['_decoratePreviewAdvancedFields'](_0x5a641f);
  }
  ["_isPreviewRenameTarget"](_0x17c5b8) {
    return !!_0x17c5b8?.['closest']?.(".rh-ai-app-preview-rename-target");
  }
  ["_isPreviewControlTarget"](_0x53f94e) {
    return !!_0x53f94e?.["closest"]?.("[data-role='preview-rename-input'], [data-role='preview-description-input'], .rh-ai-app-preview-description-target, .rh-ai-app-preview-param-toggle, [data-action='confirm-preview-rename'], .rh-ai-app-preview-param-zone input, .rh-ai-app-preview-param-zone textarea, .rh-ai-app-preview-param-zone select, .rh-ai-app-preview-param-zone button:not(.rh-ai-app-preview-draggable), .rh-ai-app-preview-param-zone [contenteditable='true'], .rh-ai-app-preview-param-zone [data-ui-schema-input], .rh-ai-app-preview-param-zone [data-ui-schema-value], .rh-ai-app-preview-param-zone [data-ui-schema-menu-trigger], .rh-ai-app-preview-param-zone .rh-stepper-value, .rh-ai-app-preview-param-zone .rh-stepper-input, .rh-ai-app-preview-param-zone .ui-schema-option, .rh-ai-app-preview-advanced-panel input, .rh-ai-app-preview-advanced-panel textarea, .rh-ai-app-preview-advanced-panel select, .rh-ai-app-preview-advanced-panel button:not(.rh-ai-app-preview-draggable), .rh-ai-app-preview-advanced-panel [contenteditable='true'], .rh-ai-app-preview-advanced-panel [data-ui-schema-input], .rh-ai-app-preview-advanced-panel [data-ui-schema-value], .rh-ai-app-preview-advanced-panel [data-ui-schema-menu-trigger], .rh-ai-app-preview-advanced-panel .rh-stepper-value, .rh-ai-app-preview-advanced-panel .rh-stepper-input, .rh-ai-app-preview-advanced-panel .ui-schema-option, .rh-ai-app-preview-advanced-panel .rh-tip, .rh-ai-app-preview-advanced-panel .ui-schema-info-tip, .rh-ai-app-preview-typebar-action, .rh-ai-app-preview-typebar-option");
  }
  ["_handleComponentInput"](_0x5ecaa7) {
    const _0x922b78 = _0x5ecaa7["target"]?.['closest']?.("[data-role='preview-rename-input']");
    if (_0x922b78 && this["panel"]?.["contains"](_0x922b78)) {
      const _0xa5d570 = Number(_0x922b78["dataset"]["previewComponentIndex"]);
      const _0xbf1c16 = getComponentByIndex(this["componentDrafts"], _0xa5d570);
      if (_0xbf1c16 && isMediaComponent(_0xbf1c16)) {
        const _0x363fdc = normalizeInputSlotLabel(_0x922b78["value"], '');
        if (_0x922b78["value"] !== _0x363fdc) {
          _0x922b78["value"] = _0x363fdc;
        }
      }
      return;
    }
    const _0x5b14bf = _0x5ecaa7["target"]?.["closest"]?.("[data-role='comfyui-candidate-search']");
    if (_0x5b14bf && this["panel"]?.["contains"](_0x5b14bf)) {
      this['comfyCandidateSearchText'] = String(_0x5b14bf["value"] || '');
      this['_renderComfyCandidatePicker']({
        'open': !![],
        'preserveSearchFocus': !![]
      });
      return;
    }
    const _0x3abb7f = _0x5ecaa7["target"]?.["closest"]?.("[data-app-prop]");
    if (_0x3abb7f && this["panel"]?.["contains"](_0x3abb7f)) {
      const _0xe27952 = String(_0x3abb7f["dataset"]["appProp"] || '');
      if (_0xe27952 === "appName") {
        this["appName"] = String(_0x3abb7f["value"] || '');
        this["pendingDeleteSavedAppId"] = '';
        this["pendingOverwriteSavedAppId"] = '';
        this['pendingOverwriteIntent'] = '';
      } else {
        if (_0xe27952 === "appDescription") {
          this['appDescription'] = String(_0x3abb7f["value"] || '');
        } else {
          return;
        }
      }
      this["_refreshBundleFromComponents"]({
        'renderPreview': ![]
      });
      this['_patchPreviewAppChrome']();
      return;
    }
    const _0x4296e4 = _0x5ecaa7["target"]?.["closest"]?.('[data-component-prop]');
    if (!_0x4296e4 || !this['panel']?.["contains"](_0x4296e4)) {
      return;
    }
    const _0x42ece5 = _0x4296e4["closest"]("[data-component-index]");
    const _0x45ea6f = Number(_0x42ece5?.["dataset"]['componentIndex']);
    const _0xc3696f = String(_0x4296e4["dataset"]['componentProp'] || '');
    if (!Number["isInteger"](_0x45ea6f) || !_0xc3696f) {
      return;
    }
    let _0x23b048 = _0x4296e4["value"];
    const _0x498165 = getComponentByIndex(this["componentDrafts"], _0x45ea6f);
    if (_0xc3696f === "label" && _0x498165 && isMediaComponent(_0x498165)) {
      _0x23b048 = normalizeInputSlotLabel(_0x23b048, '');
      if (_0x4296e4["value"] !== _0x23b048) {
        _0x4296e4["value"] = _0x23b048;
      }
    }
    this['_updateComponentDraft'](_0x45ea6f, _0xc3696f, _0x23b048);
  }
  ['_updatePromptHelpTooltip'](_0x1790f8) {
    this["promptHelpTooltip"] = normalizePromptHelpTooltip(_0x1790f8);
    const _0x5b82c2 = this['_refreshBundleFromComponents']({
      'renderPreview': ![]
    });
    this["_patchPreviewWithoutRebuild"](_0x5b82c2, {
      'renderPrompt': !![]
    });
  }
  ["_updateComponentDraft"](_0x56ba0e, _0x156b66, _0x273e56, {
    animatePreviewMoveFromRect = null,
    preferredPreviewPlacement = ''
  } = {}) {
    const _0x8bb120 = this["componentDrafts"]['find'](_0x356ae7 => Number(_0x356ae7['index']) === _0x56ba0e);
    if (!_0x8bb120) {
      return;
    }
    if (_0x156b66 === "componentKind") {
      if (_0x8bb120["componentKindLocked"] === !![]) {
        return;
      }
      const _0x59f1b6 = normalizeComponentKind(_0x273e56);
      const _0x6b10e0 = getComponentKindOptions(_0x8bb120, normalizeComponentKind(_0x8bb120["componentKind"]));
      if (!optionValuesInclude(_0x6b10e0, _0x59f1b6)) {
        return;
      }
      _0x8bb120["componentKind"] = _0x59f1b6;
      if (_0x59f1b6 === 'prompt') {
        _0x8bb120['controlType'] = "prompt";
      }
      if (_0x59f1b6 === "param" && normalizeControlType(_0x8bb120["controlType"]) === "prompt") {
        const _0x2e8660 = getControlTypeOptions(_0x8bb120, normalizeControlType(_0x8bb120["controlType"]));
        _0x8bb120['controlType'] = _0x2e8660['find'](([_0x4f06a2]) => _0x4f06a2 !== 'prompt')?.[0x0] || 'text';
      }
      if (!isMediaComponent(_0x8bb120)) {
        delete _0x8bb120["inputOrder"];
      }
      !isParamComponent(_0x8bb120) && (delete _0x8bb120["homeParamOrder"], delete _0x8bb120["advancedParamOrder"], delete _0x8bb120["previewPlacement"]);
    } else {
      if (_0x156b66 === "controlType") {
        if (_0x8bb120['controlTypeLocked'] === !![]) {
          return;
        }
        const _0x4d4503 = normalizeControlType(_0x273e56);
        const _0x57dd14 = getControlTypeOptions(_0x8bb120, normalizeControlType(_0x8bb120["controlType"]));
        if (!optionValuesInclude(_0x57dd14, _0x4d4503)) {
          return;
        }
        _0x4d4503 === "prompt" ? (_0x8bb120["componentKind"] = "prompt", _0x8bb120["controlType"] = 'prompt', delete _0x8bb120['homeParamOrder'], delete _0x8bb120["advancedParamOrder"], delete _0x8bb120["previewPlacement"]) : (_0x8bb120["componentKind"] = "param", _0x8bb120["controlType"] = _0x4d4503, preferredPreviewPlacement && (this["previewDragController"]["placeParamDraft"](_0x8bb120, preferredPreviewPlacement), _0x8bb120["previewPlacement"] !== preferredPreviewPlacement && this["previewDragController"]["placeParamDraft"](_0x8bb120, "advanced")));
      } else {
        if (_0x156b66 === 'label') {
          _0x8bb120["label"] = isMediaComponent(_0x8bb120) ? normalizeInputSlotLabel(_0x273e56, '') : String(_0x273e56 || '')["trim"]();
        } else {
          if (_0x156b66 === 'description') {
            _0x8bb120['description'] = String(_0x273e56 || '')['trim']();
          } else {
            if (_0x156b66 === "defaultValue") {
              _0x8bb120["defaultValue"] = String(_0x273e56 ?? '');
            } else {
              return;
            }
          }
        }
      }
    }
    if (_0x156b66 === 'componentKind' || _0x156b66 === 'controlType') {
      this["_renderComponentConfig"]();
    }
    const _0x200751 = shouldRefreshPreviewPromptForDraft(_0x8bb120, _0x156b66);
    const _0x461bef = this["_refreshBundleFromComponents"]({
      'renderPreview': ![]
    });
    this["_patchPreviewWithoutRebuild"](_0x461bef, {
      'renderInputs': _0x156b66 === "componentKind" || _0x156b66 === "label",
      'renderParams': !![],
      'renderAdvanced': !![],
      'renderPrompt': _0x200751
    });
    animatePreviewMoveFromRect && this["previewDragController"]["animateComponentFromRect"](_0x56ba0e, animatePreviewMoveFromRect);
  }
  ["_renamePreviewParamFromTypebar"](_0x1117dd) {
    const _0x130dce = Number(_0x1117dd?.["dataset"]?.["previewComponentIndex"]);
    if (!Number['isInteger'](_0x130dce)) {
      return;
    }
    const _0x5f191b = _0x1117dd["closest"]?.(".rh-ai-app-preview-input-slot, .rh-ai-app-preview-param-chip, .rh-ai-app-preview-advanced-param, .rh-ai-app-preview-prompt-target");
    const _0x42cbba = _0x5f191b?.['querySelector']?.(".rh-ai-app-preview-rename-target[data-preview-component-index=\"" + _0x130dce + '\x22]');
    if (_0x42cbba) {
      this["_startPreviewInlineRename"](_0x42cbba, _0x130dce);
    }
  }
  ["_editPreviewDescriptionFromTypebar"](_0x5894ae) {
    const _0x578481 = Number(_0x5894ae?.["dataset"]?.["previewComponentIndex"]);
    if (!Number["isInteger"](_0x578481)) {
      return;
    }
    const _0x3b6ba6 = _0x5894ae["closest"]?.(".rh-ai-app-preview-param-chip, .rh-ai-app-preview-advanced-param, .rh-ai-app-preview-prompt-target, .rh-ai-app-real-preview-panel");
    let _0x1f27ba = _0x3b6ba6?.['querySelector']?.(".rh-ai-app-preview-description-target[data-preview-component-index=\"" + _0x578481 + '\x22]') || this['nodePreviewEl']?.["querySelector"]?.(".rh-ai-app-preview-description-target[data-preview-component-index=\"" + _0x578481 + '\x22]');
    if (!_0x1f27ba && _0x3b6ba6?.["classList"]?.['contains']("rh-ai-app-preview-param-chip")) {
      const _0x18de77 = _0x3b6ba6["querySelector"]?.(".rh-ai-app-preview-param-label[data-preview-component-index=\"" + _0x578481 + '\x22]');
      if (_0x18de77) {
        const _0x5f4400 = getComponentByIndex(this["componentDrafts"], _0x578481);
        const _0x3ae461 = getPreviewComponentDescription(_0x5f4400, '参数说明');
        _0x1f27ba = document["createElement"]("span");
        _0x1f27ba["className"] = "rh-tip ui-schema-info-tip rh-ai-app-preview-description-target rh-ai-app-preview-param-description-tip";
        _0x1f27ba["dataset"]['previewComponentIndex'] = String(_0x578481);
        _0x1f27ba["textContent"] = '!';
        _0x1f27ba["setAttribute"]('role', 'button');
        _0x1f27ba['setAttribute']('tabindex', '0');
        _0x1f27ba['setAttribute']("aria-label", '编辑参数说明');
        _0x1f27ba["setAttribute"]("data-tooltip", _0x3ae461);
        _0x1f27ba["setAttribute"]("title", _0x3ae461);
        _0x18de77["insertAdjacentElement"]('afterend', _0x1f27ba);
      }
    }
    if (_0x1f27ba) {
      this["_startPreviewInlineDescriptionEdit"](_0x1f27ba, _0x578481);
    }
  }
  ["_togglePreviewParamDefault"](_0x494175) {
    const _0x3d2d6c = Number(_0x494175?.["dataset"]?.["previewComponentIndex"]);
    if (!Number["isInteger"](_0x3d2d6c)) {
      return;
    }
    const _0x5ee5de = getComponentByIndex(this['componentDrafts'], _0x3d2d6c);
    if (!_0x5ee5de || !isParamComponent(_0x5ee5de)) {
      return;
    }
    if (normalizeControlType(_0x5ee5de["controlType"]) !== 'toggle') {
      return;
    }
    const _0xa33f62 = isPreviewToggleOn(_0x5ee5de["defaultValue"]) ? "false" : 'true';
    this["_updateComponentDraft"](_0x3d2d6c, "defaultValue", _0xa33f62);
  }
  ["_removePreviewParam"](_0x4fc039) {
    if (!this["_canRemovePreviewParams"]()) {
      return;
    }
    const _0x44aba8 = Number(_0x4fc039?.['dataset']?.["previewComponentIndex"]);
    if (!Number["isInteger"](_0x44aba8)) {
      return;
    }
    const _0x2547c2 = getComponentByIndex(this['componentDrafts'], _0x44aba8);
    if (!_0x2547c2 || !isParamComponent(_0x2547c2)) {
      return;
    }
    this['componentDrafts'] = this["componentDrafts"]['filter'](_0x29ab82 => Number(_0x29ab82?.["index"]) !== _0x44aba8);
    const _0x17b84f = this['_refreshBundleFromComponents']({
      'renderPreview': ![]
    });
    this["_patchPreviewWithoutRebuild"](_0x17b84f, {
      'renderParams': !![],
      'renderAdvanced': !![],
      'renderPrompt': !![],
      'renderAppChrome': !![],
      'renderActionControls': !![]
    });
    this["_renderComfyCandidatePicker"]({
      'open': this["comfyCandidatePickerOpen"]
    });
  }
  ["_removePreviewInput"](_0x3a1178) {
    if (!this['_canRemovePreviewInputs']()) {
      return;
    }
    const _0x3bdd6b = Number(_0x3a1178?.["dataset"]?.["previewComponentIndex"]);
    if (!Number["isInteger"](_0x3bdd6b)) {
      return;
    }
    const _0x4cb0c4 = getComponentByIndex(this['componentDrafts'], _0x3bdd6b);
    if (!_0x4cb0c4 || !isMediaComponent(_0x4cb0c4)) {
      return;
    }
    this["componentDrafts"] = this["componentDrafts"]["filter"](_0x22ad15 => Number(_0x22ad15?.['index']) !== _0x3bdd6b);
    const _0x334dc7 = this["_refreshBundleFromComponents"]({
      'renderPreview': ![]
    });
    this["_patchPreviewWithoutRebuild"](_0x334dc7, {
      'renderInputs': !![],
      'renderParams': !![],
      'renderAdvanced': !![],
      'renderPrompt': !![],
      'renderAppChrome': !![],
      'renderActionControls': !![]
    });
    this["_renderComfyCandidatePicker"]({
      'open': this["comfyCandidatePickerOpen"]
    });
  }
  ["_scheduleParse"]() {
    window["clearTimeout"](this['parseTimer']);
    if (!this["_getInputText"]()['trim']()) {
      this["currentBundle"] = null;
      this["_clearCurrentDraftIdentity"]();
      this['_setSummary'](null);
      this['_setError']('');
      this["_clearBuilder"]();
      this['_saveKindState']();
      return;
    }
    this['_saveKindState']();
    this['parseTimer'] = window['setTimeout'](() => this['_parseNow']({
      'silent': !![]
    }), 0xb4);
  }
  ['_parseNow']({
    silent = ![]
  } = {}) {
    window["clearTimeout"](this["parseTimer"]);
    const _0x21fabe = this["_getInputText"]();
    try {
      const _0x5053ee = this["_buildCurrentBundle"]();
      this["currentBundle"] = _0x5053ee;
      if (!silent) {
        this["workflowInputCollapsed"] = !![];
      }
      this["_setSummary"](_0x5053ee);
      this["_setError"]('');
      this["_renderNodePreview"](_0x5053ee);
      this["_setActionButtonsEnabled"](!![]);
      this['_saveKindState']();
      return _0x5053ee;
    } catch (_0x4df8a4) {
      this['currentBundle'] = null;
      const _0xdd8ead = !_0x21fabe["trim"]();
      const _0x292fed = !_0xdd8ead && Boolean(this["componentDraftKey"] || this["componentDrafts"]['length'] || this['componentCandidates']["length"]);
      if (_0xdd8ead) {
        this["_clearCurrentDraftIdentity"]();
      }
      if (_0xdd8ead || !_0x292fed) {
        this["_clearBuilder"]();
      }
      this["_setSummary"](null);
      this['_setActionButtonsEnabled'](![]);
      if (!silent || _0x21fabe["trim"]()) {
        this['_setError'](_0x4df8a4?.["message"] || "解析失败");
      } else {
        this['_setError']('');
      }
      this['_saveKindState']();
      return null;
    }
  }
  ["_buildSavedAppRecordFromCurrentInput"](_0x4687af = null) {
    return this["configRepository"]["buildSavedAppRecord"]({
      'sourceType': this['sourceType'],
      'kind': this["kind"],
      'runningHubProfileId': this['runningHubProfileId'],
      'name': normalizeAppName(this["appName"]),
      'description': normalizeAppDescription(this["appDescription"]),
      'promptHelpTooltip': normalizePromptHelpTooltip(this["promptHelpTooltip"]),
      'input': this['_getInputText'](),
      'componentDraftKey': this["_getComponentDraftKey"](),
      'componentDrafts': this["componentDrafts"]
    }, _0x4687af);
  }
  ["_saveCurrentConfigAsSavedApp"]({
    overwriteSavedAppId = ''
  } = {}) {
    const _0x5b6038 = String(overwriteSavedAppId || '')["trim"]();
    const _0x473da4 = _0x5b6038 ? this["_findSavedApp"](_0x5b6038) : null;
    if (_0x5b6038 && !_0x473da4) {
      throw new Error('覆盖目标应用不存在');
    }
    const _0x405e6c = _0x473da4?.["bundle"] || null;
    const _0x5a1e2c = this["_buildSavedAppRecordFromCurrentInput"](_0x473da4);
    const _0x4d3ca4 = this["_buildBundleForSavedApp"](_0x5a1e2c);
    if (_0x405e6c) {
      a1336_0x4e4b90(_0x405e6c, this["registeredBundleKeys"]);
    }
    _0x5a1e2c['bundle'] = _0x4d3ca4;
    const _0x12f36e = this["savedApps"]['findIndex'](_0x358077 => _0x358077['id'] === _0x5a1e2c['id']);
    if (_0x12f36e >= 0x0) {
      this['savedApps']["splice"](_0x12f36e, 0x1, _0x5a1e2c);
    } else {
      this["savedApps"]["unshift"](_0x5a1e2c);
    }
    a1336_0x370b10(_0x4d3ca4, this['registeredBundleKeys'], {
      'replace': !![]
    });
    this["_registerBundlesFromNodes"]();
    this["savedAppId"] = _0x5a1e2c['id'];
    this["currentBundle"] = _0x4d3ca4;
    this["appName"] = _0x5a1e2c['name'];
    this["appDescription"] = _0x5a1e2c['description'];
    this["promptHelpTooltip"] = normalizePromptHelpTooltip(_0x5a1e2c["promptHelpTooltip"]);
    this["previewAppMenuOpen"] = ![];
    this["pendingDeleteSavedAppId"] = '';
    this["pendingOverwriteSavedAppId"] = '';
    this['pendingOverwriteIntent'] = '';
    this['_persistSavedApps']();
    this["_setSummary"](_0x4d3ca4);
    this["_setActionButtonsEnabled"](!![]);
    this["_saveKindState"]();
    return {
      'record': _0x5a1e2c,
      'bundle': _0x4d3ca4
    };
  }
  ['_saveCurrentConfigWithOverwritePolicy'](_0x529c51 = 'save') {
    const _0x3ea636 = this['_findSameNameSavedAppForCurrentScope']();
    if (_0x3ea636) {
      this["_showOverwriteConfirm"](_0x3ea636['id'], _0x529c51);
      return null;
    }
    return this["_saveCurrentConfigAsSavedApp"]({
      'overwriteSavedAppId': ''
    });
  }
  ['_patchSavedConfigSuccessPreview'](_0x4025a2) {
    this["_renderComponentConfig"]();
    this["_patchPreviewWithoutRebuild"](_0x4025a2, {
      'renderInputs': !![],
      'renderParams': !![],
      'renderAdvanced': !![],
      'renderPrompt': !![],
      'renderAppChrome': !![],
      'renderActionControls': !![]
    });
  }
  ['_saveConfigFromCurrentInput']() {
    try {
      const _0x2db594 = this["_saveCurrentConfigWithOverwritePolicy"]("save");
      if (!_0x2db594) {
        return null;
      }
      const {
        record: _0x57b2f9,
        bundle: _0x162166
      } = _0x2db594;
      this["_patchSavedConfigSuccessPreview"](_0x162166);
      this["_flashSaveSuccessFeedback"]();
      window["showToast"]?.(this["_getSourceMeta"]()?.["saveSuccess"] || "配置已保存", "success");
      return _0x57b2f9;
    } catch (_0x294f2c) {
      console["error"]("[RH AI App] save config failed:", _0x294f2c);
      this['_setError'](_0x294f2c?.["message"] || "配置保存失败");
      this["_saveKindState"]();
      window["showToast"]?.(_0x294f2c?.['message'] || this["_getSourceMeta"]()?.['saveFailed'] || "配置保存失败", "error");
      return null;
    }
  }
  async ["_confirmOverwriteSavedApp"](_0x59a84b) {
    const _0x2c2e7f = String(_0x59a84b || '')["trim"]();
    if (!_0x2c2e7f || _0x2c2e7f !== this["pendingOverwriteSavedAppId"]) {
      return null;
    }
    const _0x5c7398 = this["pendingOverwriteIntent"] === 'create' ? "create" : 'save';
    try {
      const {
        record: _0xde4e8f,
        bundle: _0x49bc2d
      } = this["_saveCurrentConfigAsSavedApp"]({
        'overwriteSavedAppId': _0x2c2e7f
      });
      if (_0x5c7398 === "create") {
        this['_patchPreviewAppChrome']();
        this["_createNodeFromSavedBundle"](_0x49bc2d);
        return _0xde4e8f;
      }
      this["_patchSavedConfigSuccessPreview"](_0x49bc2d);
      this["_flashSaveSuccessFeedback"]();
      window['showToast']?.(this["_getSourceMeta"]()?.["saveSuccess"] || "配置已保存", "success");
      return _0xde4e8f;
    } catch (_0x1ba967) {
      console["error"]("[RH AI App] overwrite config failed:", _0x1ba967);
      const _0x20cac0 = this["_getSourceMeta"]();
      const _0x196c70 = _0x5c7398 === "create" ? _0x20cac0?.['createFailed'] : _0x20cac0?.["saveFailed"];
      window["showToast"]?.(_0x1ba967?.["message"] || _0x196c70 || '配置覆盖失败', 'error');
      this['_setError'](_0x1ba967?.["message"] || "配置覆盖失败");
      this["_saveKindState"]();
      return null;
    }
  }
  ["_loadSavedApp"](_0x11a2f6) {
    this["definitionController"]["cancel"]();
    const _0x3836e6 = this["_findSavedApp"](_0x11a2f6);
    if (!_0x3836e6) {
      return;
    }
    window["clearTimeout"](this["parseTimer"]);
    this["_saveKindState"]();
    this["sourceType"] = normalizeSourceType(_0x3836e6["sourceType"]) || SOURCE_TYPES["runninghub"];
    this["kind"] = normalizeKind(_0x3836e6["kind"]);
    this["runningHubProfileId"] = normalizeRunningHubModelApiProfileId(_0x3836e6["runningHubProfileId"]);
    this["_syncSourceView"]();
    this["_syncKindTabs"]();
    this["appName"] = normalizeAppName(_0x3836e6['name']);
    this["appDescription"] = normalizeAppDescription(_0x3836e6["description"]);
    this["promptHelpTooltip"] = normalizePromptHelpTooltip(_0x3836e6["promptHelpTooltip"]);
    this['savedAppId'] = _0x3836e6['id'];
    if (this['textarea']) {
      this['textarea']["value"] = _0x3836e6["input"] || '';
    }
    this['definitionReference'] = this["definitionController"]["getSavedReference"](_0x3836e6);
    this["definitionController"]["sync"]();
    this['componentDraftKey'] = _0x3836e6["componentDraftKey"] || this["_getComponentDraftKey"]();
    this['componentDrafts'] = cloneComponentDrafts(_0x3836e6["componentDrafts"]);
    (this["_shouldShowManualComponentPicker"]() || !this['componentDrafts']["length"]) && _0x3836e6["input"]["trim"]() && this["_syncComponentDrafts"]({
      'force': !![]
    });
    this['previewAppMenuOpen'] = ![];
    this["pendingDeleteSavedAppId"] = '';
    this['pendingOverwriteSavedAppId'] = '';
    this['pendingOverwriteIntent'] = '';
    try {
      const _0x31b4ec = _0x3836e6["bundle"] || this["_buildBundleForSavedApp"](_0x3836e6);
      _0x3836e6['bundle'] = _0x31b4ec;
      a1336_0x370b10(_0x31b4ec, this["registeredBundleKeys"]);
      this["currentBundle"] = _0x31b4ec;
      this["_setSummary"](_0x31b4ec);
      this['_setError']('');
      this["_renderComponentConfig"]();
      this["_patchPreviewWithoutRebuild"](_0x31b4ec, {
        'renderInputs': !![],
        'renderParams': !![],
        'renderAdvanced': !![],
        'renderPrompt': !![],
        'renderAppChrome': !![],
        'renderActionControls': !![]
      });
      this["_setActionButtonsEnabled"](!![]);
    } catch (_0x3d1293) {
      this['currentBundle'] = null;
      this["_setSummary"](null);
      this['_setError'](_0x3d1293?.['message'] || "配置载入失败");
      this['_setActionButtonsEnabled'](![]);
    }
    this['_saveKindState']();
  }
  ["_deleteSavedApp"](_0x5f1886) {
    const _0x51b1e8 = this["_findSavedApp"](_0x5f1886);
    if (!_0x51b1e8) {
      return;
    }
    const _0x3f89e1 = this["savedAppId"] === _0x51b1e8['id'];
    if (_0x51b1e8['bundle']) {
      a1336_0x4e4b90(_0x51b1e8["bundle"], this["registeredBundleKeys"]);
    }
    this["savedApps"] = this['savedApps']["filter"](_0x52d59f => _0x52d59f['id'] !== _0x51b1e8['id']);
    this["_registerBundlesFromNodes"]();
    this['pendingDeleteSavedAppId'] = '';
    this['pendingOverwriteSavedAppId'] = '';
    this['pendingOverwriteIntent'] = '';
    if (_0x3f89e1) {
      this["savedAppId"] = '';
      if (this['textarea']) {
        this["textarea"]["value"] = '';
      }
      this['appName'] = DEFAULT_AI_APP_NAME;
      this["appDescription"] = '';
      this['currentBundle'] = null;
      this['_clearBuilder']();
      this["_setSummary"](null);
      this["_setError"]('');
    } else {
      this["previewAppMenuOpen"] = !![];
      this["_patchPreviewAppChrome"]();
    }
    this["_persistSavedApps"]();
    this["_saveKindState"]();
    window['showToast']?.(this['_getSourceMeta']()?.["deleteSuccess"] || "配置已删除", "success");
  }
  ["_createNodeFromSavedBundle"](_0x240dce) {
    const _0x42e5bf = getCanvasCenterWorld(this['panel']);
    const _0x56a0ca = buildRhAiAppNodeData({
      'bundle': _0x240dce,
      'kind': this["kind"],
      'center': _0x42e5bf,
      'runningHubProfileId': this['runningHubProfileId']
    });
    graphStore["batch"]?.(() => {
      graphStore["addNode"](_0x56a0ca);
      graphStore["setSelectedNodes"]([_0x56a0ca['id']]);
    });
    typeof graphStore["batch"] !== 'function' && (graphStore["addNode"](_0x56a0ca), graphStore['setSelectedNodes']([_0x56a0ca['id']]));
    commit();
    window["showToast"]?.(this["_getSourceMeta"]()?.["createSuccess"] || "节点已创建", "success");
    return _0x56a0ca;
  }
  async ["_createNodeFromCurrentInput"]() {
    const _0x1299ba = this['_refreshBundleFromComponents']({
      'renderPreview': ![]
    }) || this["currentBundle"] || this["_parseNow"]();
    if (!_0x1299ba) {
      return;
    }
    try {
      const _0x40f942 = this['_saveCurrentConfigWithOverwritePolicy']('create');
      if (!_0x40f942) {
        return;
      }
      this["_patchPreviewAppChrome"]();
      this["_createNodeFromSavedBundle"](_0x40f942["bundle"]);
    } catch (_0x326c0f) {
      console['error']("[RH AI App] create node failed:", _0x326c0f);
      window['showToast']?.(_0x326c0f?.["message"] || this['_getSourceMeta']()?.["createFailed"] || "节点创建失败", 'error');
      this["_setError"](_0x326c0f?.['message'] || '节点创建失败');
      this["_saveKindState"]();
    }
  }
}
export const runningHubAiAppManager = new RunningHubAiAppManager();