import { getModelManifest, normalizeUiSchemaFieldValue, sanitizeModelUiSchemaParams } from '../../manifests/index.js';
import { configureUiSchemaFieldAdapter, getUiSchemaFieldAdapterDefinition, resolveUiSchemaControlAdapter, resolveUiSchemaControlAdapterDefinition, resolveUiSchemaFieldAdapter, resolveUiSchemaFieldAdapterDefinition } from './uiSchemaControlAdapters.js';
import { escapeHtmlAttr } from './uiModuleModelHelpers.js';
import { resolveAudioVoiceCompositeState } from './audioVoiceCompositeState.js';
import { t } from '../../i18n/index.js';
import { translateManifestText } from '../../i18n/manifestText.js';
import { openExternalLink } from '../../services/externalLinkService.js';
import { createUiSchemaBindingSession } from './uiSchemaBindingSession.js';
import { applyUiSchemaFieldOverrides } from './uiSchemaFieldOverrides.js';
import { normalizeRandomSeedMode, resolveRandomSeedModeFromNodeData } from '../shared/randomSeedPolicy.js';
import { renderRunningHubInstanceControl, syncRunningHubInstanceControl } from './runningHubInstanceControl.js';
import { buildUiSchemaParamPatch as a350_0x31d815, createUiSchemaStateOwner, evaluateUiSchemaNumberExpression, filterVisibleUiSchemaFields, firstNonEmptyString, getNodeFieldValue, getOptionDisableRepairPatch, getRenderedOptionDisableWhen, getUiSchemaParamContext, optionDisableWhenMatches, uiSchemaConditionMatches } from './uiSchemaStateOwner.js';
export { evaluateUiSchemaNumberExpression, sanitizeModelUiSchemaParams };
const SUPPORTED_CONTROL_TYPES = new Set(["segmented", 'select', "slider", "stepper", "toggle", 'text', "textarea", 'image\x20input', "video input", "audio input"]);
const ALLOWED_PLACEMENTS = new Set(["mode", "resolution", "advanced", "videoadvanced", 'videoparams', "instance", "batch"]);
const RANDOM_SEED_DEFAULT_MIN = 0x0;
const RANDOM_SEED_DEFAULT_MAX = 0x7fffffff;
const UI_SCHEMA_POPUP_EXIT_MS = 0xa0;
function manifestText(_0x667a2c) {
  return translateManifestText(_0x667a2c);
}
function getDisplayLabelFromOption(_0x43fce2, _0x1fbe2a = '') {
  return manifestText(_0x43fce2?.['displayLabel'] ?? _0x43fce2?.["selectedLabel"] ?? _0x43fce2?.["label"] ?? _0x1fbe2a);
}
function formatMetricLabel(_0x596178, _0xe73d10) {
  const _0x4debe3 = manifestText(_0x596178);
  const _0x4ef142 = String(_0xe73d10 ?? '');
  return _0x4debe3 === String(_0x596178) ? '' + _0x4debe3 + _0x4ef142 : _0x4debe3 + '\x20' + _0x4ef142;
}
function joinMetricLabels(_0x2a5055) {
  return _0x2a5055['filter'](_0x504144 => Array["isArray"](_0x504144) && _0x504144["length"] >= 0x2 && _0x504144[0x1] !== '')["map"](([_0x2619fd, _0x423492]) => formatMetricLabel(_0x2619fd, _0x423492))["join"]('·');
}
function getUiSchemaValueOptions(_0x2552ad) {
  return Array["from"](_0x2552ad?.['querySelectorAll']?.("[data-ui-schema-value]") || []);
}
function findUiSchemaValueOption(_0x5e9e89, _0x360329) {
  const _0x4819c0 = String(_0x360329 ?? '');
  return getUiSchemaValueOptions(_0x5e9e89)['find'](_0x3daa96 => String(_0x3daa96?.["dataset"]?.["uiSchemaValue"] ?? '') === _0x4819c0) || null;
}
function findFirstEnabledUiSchemaValueOption(_0x2b1a5e) {
  return getUiSchemaValueOptions(_0x2b1a5e)['find'](_0x2f01fb => _0x2f01fb?.["dataset"]?.["uiSchemaDisabled"] !== "true") || null;
}
function normalizePlacement(_0x497176) {
  const _0x2e5091 = String(_0x497176 || '')["trim"]()["toLowerCase"]();
  return ALLOWED_PLACEMENTS['has'](_0x2e5091) ? _0x2e5091 : '';
}
function filterUiSchemaFields(_0x5205b2, {
  placement: _0x563e3f,
  excludeFieldIds: _0x135e5e,
  ignorePlacementFilter = ![]
} = {}) {
  if (!Array['isArray'](_0x5205b2)) {
    return [];
  }
  const _0x52e324 = String(_0x563e3f ?? '')["trim"]() !== '';
  const _0x19ad12 = normalizePlacement(_0x563e3f);
  const _0x5372d5 = new Set((Array['isArray'](_0x135e5e) ? _0x135e5e : [])["map"](_0x421b0f => String(_0x421b0f || '')["trim"]()));
  return _0x5205b2["filter"](_0x483c19 => {
    const _0x2530b2 = String(_0x483c19?.['id'] || '')["trim"]();
    if (_0x5372d5["has"](_0x2530b2)) {
      return ![];
    }
    if (_0x52e324 && !_0x19ad12 && !ignorePlacementFilter) {
      return ![];
    }
    if (!_0x19ad12 || ignorePlacementFilter) {
      return !![];
    }
    return normalizePlacement(_0x483c19?.['placement']) === _0x19ad12;
  });
}
function getUiSchemaFields(_0x2ae5a6, {
  placement: _0x31e427,
  excludeFieldIds: _0x7e5c3,
  fieldOverrides: _0x55c440
} = {}) {
  const _0x4a8694 = getModelManifest(_0x2ae5a6);
  return filterUiSchemaFields(applyUiSchemaFieldOverrides(_0x4a8694?.["uiSchema"]?.["fields"], _0x55c440), {
    'placement': _0x31e427,
    'excludeFieldIds': _0x7e5c3
  });
}
function assertSupportedField(_0x185d26) {
  const _0x140fac = String(_0x185d26?.['id'] || '')["trim"]();
  const _0x49eb5e = normalizeControlType(_0x185d26?.["type"]);
  if (!_0x140fac) {
    throw new Error("[uiSchema] field id is required");
  }
  if (!SUPPORTED_CONTROL_TYPES["has"](_0x49eb5e)) {
    throw new Error('[uiSchema]\x20unsupported\x20control\x20type\x20for\x20' + _0x140fac + ':\x20' + _0x185d26?.["type"]);
  }
  if (_0x185d26?.["defaultValue"] === undefined) {
    throw new Error("[uiSchema] defaultValue is required for " + _0x140fac);
  }
  if ((_0x49eb5e === "segmented" || _0x49eb5e === 'select') && (!Array['isArray'](_0x185d26?.['options']) || _0x185d26["options"]["length"] === 0x0)) {
    throw new Error('[uiSchema]\x20options\x20are\x20required\x20for\x20' + _0x140fac);
  }
}
function getFieldValue(_0x50df79, _0x317abe) {
  const _0x4fb3d9 = String(_0x317abe?.['id'] || '')["trim"]();
  if (!_0x4fb3d9) {
    return _0x317abe?.["defaultValue"] ?? '';
  }
  const _0x23fe68 = getUiSchemaParamContext(_0x50df79);
  const _0x11998f = _0x50df79?.["generationParams"];
  if (_0x11998f && typeof _0x11998f === "object" && !Array['isArray'](_0x11998f) && _0x11998f[_0x4fb3d9] !== undefined) {
    return normalizeUiSchemaFieldValue(_0x317abe, _0x11998f[_0x4fb3d9], {
      'params': _0x23fe68
    });
  }
  if (_0x50df79 && typeof _0x50df79 === 'object' && !Array["isArray"](_0x50df79) && _0x50df79[_0x4fb3d9] !== undefined) {
    return normalizeUiSchemaFieldValue(_0x317abe, _0x50df79[_0x4fb3d9], {
      'params': _0x23fe68
    });
  }
  return normalizeUiSchemaFieldValue(_0x317abe, _0x317abe?.["defaultValue"], {
    'params': _0x23fe68
  });
}
function normalizeControlType(_0x112b0c) {
  return String(_0x112b0c || '')["trim"]()["toLowerCase"]();
}
function getRenderableOptions(_0x5688c4) {
  const _0x43f313 = Array["isArray"](_0x5688c4?.["options"]) ? _0x5688c4["options"] : [];
  const _0x104f10 = Array["isArray"](_0x5688c4?.['advancedOptions']) && globalThis['window']?.["ADVANCED_MODE"] ? _0x5688c4["advancedOptions"] : [];
  const _0x387d34 = Array["isArray"](_0x5688c4?.["developerOptions"]) && globalThis["window"]?.["DEV_MODE"] === !![] ? _0x5688c4['developerOptions'] : [];
  return [..._0x43f313, ..._0x104f10, ..._0x387d34];
}
function getOptionHideWhen(_0x256e39) {
  if (!_0x256e39 || typeof _0x256e39 !== "object" || Array["isArray"](_0x256e39)) {
    return null;
  }
  const _0x65e8e0 = _0x256e39["hideWhen"];
  return _0x65e8e0 && (Array["isArray"](_0x65e8e0) || typeof _0x65e8e0 === 'object' && !Array["isArray"](_0x65e8e0)) ? _0x65e8e0 : null;
}
function isOptionHidden(_0x2d6592, _0x2f5c88 = {}) {
  if (_0x2d6592?.["hidden"] === !![]) {
    return !![];
  }
  const _0x5c93f2 = getOptionHideWhen(_0x2d6592);
  return _0x5c93f2 ? uiSchemaConditionMatches(_0x5c93f2, _0x2f5c88) : ![];
}
function getVisibleOptions(_0x36b7a0, _0x260b5a = {}) {
  return getRenderableOptions(_0x36b7a0)["filter"](_0x3ed9c4 => !isOptionHidden(_0x3ed9c4, _0x260b5a));
}
function renderOptions(_0x2b3095, _0x38a738, _0x5a7443 = {}) {
  const _0x424eba = getVisibleOptions(_0x2b3095, _0x5a7443);
  return _0x424eba["map"](_0x52ba57 => {
    const _0x40f0ed = _0x52ba57 && typeof _0x52ba57 === "object" && !Array["isArray"](_0x52ba57);
    const _0x3fad5d = String(_0x40f0ed ? _0x52ba57["value"] ?? '' : _0x52ba57);
    const _0x1341d8 = manifestText(_0x40f0ed ? _0x52ba57['label'] ?? _0x3fad5d : _0x3fad5d);
    const _0x38ff16 = manifestText(_0x40f0ed ? _0x52ba57["tooltip"] || '' : '')['trim']();
    const _0x48bc4a = String(_0x38a738 ?? '') === _0x3fad5d;
    const _0x23eee0 = isOptionDisabled(_0x2b3095, _0x52ba57, _0x5a7443);
    const _0x166a13 = _0x38ff16 ? '\x20title=\x22' + escapeHtmlAttr(_0x38ff16) + "\" data-tooltip=\"" + escapeHtmlAttr(_0x38ff16) + '\x22' : '';
    return '<button\x20type=\x22button\x22\x20class=\x22img-rp-quality-item\x20ui-schema-option\x20' + (_0x48bc4a ? "active" : '') + '\x20' + (_0x23eee0 ? 'disabled' : '') + '\x22\x20data-ui-schema-value=\x22' + escapeHtmlAttr(_0x3fad5d) + '\x22' + _0x166a13 + getOptionDisabledAttrs(_0x2b3095, _0x52ba57, {
      'nodeData': _0x5a7443
    }) + '>' + escapeHtmlAttr(_0x1341d8) + '</button>';
  })['join']('');
}
function renderControl(_0x799178, _0x554484, _0x194791, _0x443f56 = {}) {
  const _0x234ac5 = {
    'renderSegmentedControl': () => {
      if (_0x443f56?.['advanced']) {
        return renderAdvancedSelectionControl(_0x799178, _0x554484, _0x443f56?.['nodeData'] || {});
      }
      const _0x5e5817 = _0x443f56?.["advanced"] ? " rh-adv-seg rh-v5-fps-seg" : '';
      return "<div class=\"img-rp-quality-segmented ui-schema-segmented" + _0x5e5817 + '\x22>' + renderOptions(_0x799178, _0x554484, _0x443f56?.["nodeData"] || {}) + "</div>";
    },
    'renderSelectControl': () => renderSelect(_0x799178, _0x554484, _0x443f56?.["nodeData"] || {}),
    'renderRangeControl': () => renderRange(_0x799178, _0x554484, _0x194791, _0x443f56?.["nodeData"] || {}),
    'renderToggleControl': () => renderAdvancedSelectionControl(_0x799178, _0x554484, _0x443f56?.['nodeData'] || {}),
    'renderTextControl': () => renderTextInput(_0x799178, _0x554484, _0x194791, _0x443f56?.["nodeData"]),
    'renderAssetInputControl': () => renderAssetInput(_0x799178, _0x194791)
  };
  const _0x2c6dce = resolveUiSchemaControlAdapterDefinition(_0x194791);
  if (_0x2c6dce && typeof _0x2c6dce["render"] === "function") {
    return _0x2c6dce['render']({
      'field': _0x799178,
      'value': _0x554484,
      'type': _0x194791,
      'nodeData': _0x443f56?.["nodeData"] || {},
      'options': _0x443f56,
      'helpers': {
        'renderAdvancedSelectionControl': renderAdvancedSelectionControl,
        'renderAssetInput': renderAssetInput,
        'renderRange': renderRange,
        'renderSelect': renderSelect,
        'renderTextInput': renderTextInput
      }
    });
  }
  return _0x234ac5[_0x2c6dce?.['renderer'] || resolveUiSchemaControlAdapter(_0x194791)]();
}
function getOptionLabel(_0x399fcb, _0xc3fd8d) {
  const _0x429a6e = getRenderableOptions(_0x399fcb);
  const _0x26bfab = String(_0xc3fd8d ?? '');
  const _0x431782 = _0x429a6e["find"](_0x4128fd => String(_0x4128fd?.["value"] ?? _0x4128fd) === _0x26bfab);
  return getDisplayLabelFromOption(_0x431782, _0x26bfab);
}
function getFieldById(_0x3de905, _0x32d493) {
  return (Array["isArray"](_0x3de905) ? _0x3de905 : [])["find"](_0x5bfe1b => String(_0x5bfe1b?.['id'] || '')["trim"]() === _0x32d493);
}
function getFieldByDisplayRole(_0x49487e, _0x5dda0e) {
  const _0x2807d5 = String(_0x5dda0e || '')["trim"]();
  if (!_0x2807d5) {
    return null;
  }
  return (Array['isArray'](_0x49487e) ? _0x49487e : [])['find'](_0x13b21d => String(_0x13b21d?.["displayRole"] || '')['trim']() === _0x2807d5);
}
function getOptionValue(_0x4ae8de) {
  return String(_0x4ae8de?.["value"] ?? _0x4ae8de);
}
function isFieldDisabled(_0x588a44) {
  return _0x588a44?.['disabled'] === !![] || _0x588a44?.['readOnly'] === !![];
}
function isFieldDisabledByCondition(_0xda8a11, _0x1c8a48) {
  if (!_0xda8a11 || !_0x1c8a48) {
    return ![];
  }
  const _0x24fc95 = _0xda8a11?.["disableWhen"];
  if (!_0x24fc95 || typeof _0x24fc95 !== 'object') {
    return ![];
  }
  return optionDisableWhenMatches(_0x24fc95, _0x1c8a48);
}
function isFieldDisabledByUiState(_0x36edd2, _0x558bbd) {
  const _0x537dca = String(_0x36edd2?.['id'] || '')["trim"]();
  if (!_0x537dca || !_0x558bbd) {
    return ![];
  }
  const _0x1dc5cc = _0x558bbd?.["uiSchemaFieldState"]?.[_0x537dca];
  return _0x1dc5cc === !![] || _0x1dc5cc?.["disabled"] === !![] || _0x1dc5cc?.['readOnly'] === !![];
}
function resolveFieldDisabled(_0x24d889, _0x1654d5) {
  if (!_0x24d889) {
    return ![];
  }
  if (isFieldDisabled(_0x24d889)) {
    return !![];
  }
  return isFieldDisabledByUiState(_0x24d889, _0x1654d5 || {}) || isFieldDisabledByCondition(_0x24d889, _0x1654d5 || {});
}
function getOptionDisableWhen(_0x276733) {
  if (!_0x276733 || typeof _0x276733 !== "object" || Array["isArray"](_0x276733)) {
    return null;
  }
  const _0x42cb2c = _0x276733["disableWhen"] || _0x276733["disabledWhen"];
  return _0x42cb2c && (Array["isArray"](_0x42cb2c) || typeof _0x42cb2c === 'object' && !Array["isArray"](_0x42cb2c)) ? _0x42cb2c : null;
}
function getOptionDisableWhenAttrs(_0x3b75e7) {
  const _0xa9ad04 = getOptionDisableWhen(_0x3b75e7);
  if (!_0xa9ad04) {
    return '';
  }
  if (Array["isArray"](_0xa9ad04) || Array["isArray"](_0xa9ad04['any']) || Array['isArray'](_0xa9ad04["all"]) || _0xa9ad04["not"] === !![]) {
    return " data-ui-schema-disable-when-json=\"" + escapeHtmlAttr(JSON["stringify"](_0xa9ad04)) + '\x22';
  }
  const _0x520582 = String(_0xa9ad04['field'] || _0xa9ad04["param"] || '')["trim"]();
  const _0x5d84f6 = _0xa9ad04['values'] !== undefined ? _0xa9ad04['values'] : _0xa9ad04["value"];
  const _0x3f2cf4 = Array['isArray'](_0x5d84f6) ? _0x5d84f6 : [_0x5d84f6];
  if (!_0x520582 || _0x3f2cf4["length"] === 0x0) {
    return '';
  }
  return '\x20data-ui-schema-disable-when-field=\x22' + escapeHtmlAttr(_0x520582) + "\" data-ui-schema-disable-when-values=\"" + escapeHtmlAttr(_0x3f2cf4['join'](',')) + '\x22';
}
function getFieldDefaultAliasAttrs(_0x3bc22b) {
  const _0x3cc1e7 = (Array["isArray"](_0x3bc22b?.["defaultValueAliases"]) ? _0x3bc22b["defaultValueAliases"] : [])["map"](_0x307404 => String(_0x307404 ?? '')["trim"]())["filter"](Boolean);
  return _0x3cc1e7["length"] ? " data-ui-schema-default-aliases=\"" + escapeHtmlAttr(JSON['stringify'](_0x3cc1e7)) + '\x22' : '';
}
function isOptionDisabled(_0x2b3e0d, _0x1a7365, _0x5183eb = {}) {
  const _0x1b9e94 = getOptionDisableWhen(_0x1a7365);
  const _0x4bb817 = optionDisableWhenMatches(_0x1b9e94, _0x5183eb);
  const _0x49082c = _0x4bb817 ? getOptionDisableRepairPatch(_0x1b9e94, _0x5183eb) : null;
  return resolveFieldDisabled(_0x2b3e0d, _0x5183eb) || _0x1a7365 && typeof _0x1a7365 === "object" && !Array["isArray"](_0x1a7365) && (_0x1a7365["disabled"] === !![] || _0x4bb817 && !_0x49082c);
}
function getOptionDisabledAttrs(_0x41c3b4, _0x573a84, {
  button = !![],
  nodeData = {}
} = {}) {
  const _0x383fb8 = getOptionDisableWhenAttrs(_0x573a84);
  const _0x4a0370 = isFieldDisabled(_0x41c3b4) || _0x573a84 && typeof _0x573a84 === 'object' && !Array["isArray"](_0x573a84) && _0x573a84["disabled"] === !![];
  const _0x211b3e = isOptionDisabled(_0x41c3b4, _0x573a84, nodeData);
  if (!_0x211b3e) {
    return _0x383fb8;
  }
  const _0x28881c = _0x4a0370 ? '\x20data-ui-schema-static-disabled=\x22true\x22' : '';
  const _0x13d782 = button ? " data-ui-schema-disabled=\"true\" disabled aria-disabled=\"true\"" : " data-ui-schema-disabled=\"true\" aria-disabled=\"true\"";
  return '' + _0x383fb8 + _0x28881c + _0x13d782;
}
function isAdaptiveRatioOption(_0x357727, _0x3b5221) {
  const _0x5bf40e = getOptionValue(_0x3b5221)["trim"]();
  const _0x1a7189 = String(_0x3b5221?.['label'] ?? _0x5bf40e)["trim"]();
  const _0x5af8f1 = _0x5bf40e["toLowerCase"]();
  const _0x3c514c = _0x1a7189["toLowerCase"]();
  return _0x5af8f1 === "auto" || _0x5af8f1 === 'adaptive' || _0x5af8f1 === "自适应" || _0x3c514c === "auto" || _0x3c514c === "adaptive" || _0x3c514c === "自适应" || _0x5bf40e === String(_0x357727?.["defaultValue"] ?? '') && _0x3c514c === 'auto';
}
const BUILTIN_ADAPTIVE_RATIO_OPTION = Object['freeze']({
  'value': '自适应',
  'label': '自适应'
});
function getRatioOptions(_0xf22052, _0x1fa0e4 = {}) {
  const _0x995791 = getVisibleOptions(_0xf22052, _0x1fa0e4);
  return _0x995791["some"](_0x4426f5 => isAdaptiveRatioOption(_0xf22052, _0x4426f5)) ? _0x995791 : [BUILTIN_ADAPTIVE_RATIO_OPTION, ..._0x995791];
}
function getRatioOptionLabel(_0x2809bb, _0x22e25f) {
  const _0x263196 = getRenderableOptions(_0x2809bb);
  const _0x2af5a6 = String(_0x22e25f ?? '');
  const _0x46bb59 = _0x263196['find'](_0x47806f => getOptionValue(_0x47806f) === _0x2af5a6);
  if (_0x46bb59 && isAdaptiveRatioOption(_0x2809bb, _0x46bb59)) {
    return t("videoNode.parameterPanel.adaptive");
  }
  if (!_0x46bb59 && isAdaptiveRatioOption(_0x2809bb, _0x2af5a6)) {
    return t("videoNode.parameterPanel.adaptive");
  }
  return getDisplayLabelFromOption(_0x46bb59, _0x2af5a6);
}
function getRatioIconClass(_0x1200b6) {
  const _0x1e2950 = String(_0x1200b6 || '')['trim']();
  const _0x54c610 = {
    '1:1': "img-rp-sq",
    '9:16': "img-rp-tall",
    '16:9': 'img-rp-wide',
    '3:4': "img-rp-p34",
    '4:3': "img-rp-l43",
    '1:4': 'img-rp-p14',
    '4:1': 'img-rp-l41',
    '1:8': "img-rp-p18",
    '8:1': 'img-rp-l81',
    '3:2': "img-rp-l32",
    '2:3': "img-rp-p23",
    '5:4': "img-rp-l54",
    '4:5': "img-rp-p45",
    '21:9': 'img-rp-ultra'
  };
  if (_0x54c610[_0x1e2950]) {
    return _0x54c610[_0x1e2950];
  }
  const _0x46fb4a = _0x1e2950["match"](/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (!_0x46fb4a) {
    return 'img-rp-sq';
  }
  const _0x3d5f48 = Number(_0x46fb4a[0x1]);
  const _0x119f2a = Number(_0x46fb4a[0x2]);
  if (!Number["isFinite"](_0x3d5f48) || !Number["isFinite"](_0x119f2a) || _0x3d5f48 === _0x119f2a) {
    return 'img-rp-sq';
  }
  return _0x3d5f48 > _0x119f2a ? "img-rp-wide" : "img-rp-tall";
}
function renderQualityButtons(_0x347fa7, _0x20c99b, _0x174198 = {}) {
  assertSupportedField(_0x347fa7);
  const _0x17cc9d = _0x347fa7?.["displayRole"] ? " data-ui-schema-display-role=\"" + escapeHtmlAttr(_0x347fa7["displayRole"]) + '\x22' : '';
  const _0x2cdb44 = String(_0x347fa7?.['id'] || '')['trim']() === 'imageSize' ? manifestText('画质') : manifestText(_0x347fa7?.['label'] || '画质');
  const _0x49cfc1 = manifestText(_0x347fa7?.["description"] || _0x347fa7?.["tooltip"] || '')["trim"]();
  const _0x3b987a = String(_0x347fa7?.["variant"] || '')["trim"]() === "sectionMenu" || _0x347fa7?.["showInfoTip"] === !![];
  const _0x38f4d4 = _0x49cfc1 && _0x3b987a ? "<span class=\"rh-tip ui-schema-info-tip\" data-tooltip=\"" + escapeHtmlAttr(_0x49cfc1) + "\">!</span>" : '';
  const _0x6a9227 = getVisibleOptions(_0x347fa7, _0x174198);
  const _0x58755c = _0x6a9227['some'](_0xcbb3f => String(_0xcbb3f?.["groupLabel"] || _0xcbb3f?.["sectionLabel"] || '')["trim"]());
  if (_0x58755c) {
    const _0x2410f6 = [];
    _0x6a9227["forEach"](_0x5b72f4 => {
      const _0x36473c = manifestText(_0x5b72f4?.["groupLabel"] || _0x5b72f4?.["sectionLabel"] || _0x2cdb44)['trim']();
      let _0x3c4dff = _0x2410f6["find"](_0x406cb8 => _0x406cb8["label"] === _0x36473c);
      !_0x3c4dff && (_0x3c4dff = {
        'label': _0x36473c,
        'options': []
      }, _0x2410f6["push"](_0x3c4dff));
      _0x3c4dff["options"]["push"](_0x5b72f4);
    });
    return "<div class=\"img-rp-quality-area\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x347fa7['id']) + "\" data-ui-schema-type=\"segmented\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x347fa7?.['defaultValue'] ?? '') + '\x22' + (_0x174198?.["uiSchemaFieldState"]?.[_0x347fa7['id']]?.["lockedValue"] !== undefined ? " data-ui-schema-locked-value=\"" + escapeHtmlAttr(_0x174198["uiSchemaFieldState"][_0x347fa7['id']]["lockedValue"]) + '\x22' : '') + _0x17cc9d + ">\n      " + _0x2410f6["map"](_0x2ac5ad => "<div class=\"img-rp-section-label\">" + escapeHtmlAttr(_0x2ac5ad["label"]) + (_0x2ac5ad["label"] === _0x2cdb44 ? _0x38f4d4 : '') + "</div>\n            <div class=\"img-rp-quality-segmented\">\n              " + _0x2ac5ad["options"]["map"](_0x525750 => {
      const _0x87e908 = getOptionValue(_0x525750);
      const _0x3da639 = manifestText(_0x525750?.["label"] ?? _0x87e908);
      const _0x1119cc = getDisplayLabelFromOption(_0x525750, _0x3da639);
      const _0x3190a5 = String(_0x20c99b ?? '') === _0x87e908;
      const _0x18b19a = isOptionDisabled(_0x347fa7, _0x525750, _0x174198);
      return "<button type=\"button\" class=\"img-rp-quality-item ui-schema-option " + (_0x3190a5 ? "active" : '') + '\x20' + (_0x18b19a ? "disabled" : '') + '\x22\x20data-ui-schema-value=\x22' + escapeHtmlAttr(_0x87e908) + "\" data-ui-schema-option-label=\"" + escapeHtmlAttr(_0x1119cc) + '\x22' + getOptionDisabledAttrs(_0x347fa7, _0x525750, {
        'nodeData': _0x174198
      }) + '>' + escapeHtmlAttr(_0x3da639) + "</button>";
    })["join"]('') + "\n            </div>")['join']('') + "\n    </div>";
  }
  return "<div class=\"img-rp-quality-area\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x347fa7['id']) + "\" data-ui-schema-type=\"segmented\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x347fa7?.["defaultValue"] ?? '') + '\x22' + (_0x174198?.["uiSchemaFieldState"]?.[_0x347fa7['id']]?.["lockedValue"] !== undefined ? " data-ui-schema-locked-value=\"" + escapeHtmlAttr(_0x174198["uiSchemaFieldState"][_0x347fa7['id']]["lockedValue"]) + '\x22' : '') + _0x17cc9d + '>\x0a\x20\x20\x20\x20<div\x20class=\x22img-rp-section-label\x22>' + escapeHtmlAttr(_0x2cdb44) + _0x38f4d4 + "</div>\n    <div class=\"img-rp-quality-segmented\">\n      " + _0x6a9227["map"](_0x3df43e => {
    const _0x420b8c = getOptionValue(_0x3df43e);
    const _0x3e676c = manifestText(_0x3df43e?.["label"] ?? _0x420b8c);
    const _0x285923 = getDisplayLabelFromOption(_0x3df43e, _0x3e676c);
    const _0x3bc7f1 = String(_0x20c99b ?? '') === _0x420b8c;
    const _0x1d39bd = isOptionDisabled(_0x347fa7, _0x3df43e, _0x174198);
    return "<button type=\"button\" class=\"img-rp-quality-item ui-schema-option " + (_0x3bc7f1 ? "active" : '') + '\x20' + (_0x1d39bd ? 'disabled' : '') + "\" data-ui-schema-value=\"" + escapeHtmlAttr(_0x420b8c) + "\" data-ui-schema-option-label=\"" + escapeHtmlAttr(_0x285923) + '\x22' + getOptionDisabledAttrs(_0x347fa7, _0x3df43e, {
      'nodeData': _0x174198
    }) + '>' + escapeHtmlAttr(_0x3e676c) + "</button>";
  })['join']('') + "\n    </div>\n  </div>";
}
function renderSectionMenuField(_0x4fd6c2, _0x322833) {
  const _0x1469f3 = String(_0x4fd6c2?.['id'] || '')["trim"]();
  const _0x3c6019 = getFieldValue(_0x322833, _0x4fd6c2);
  const _0x3f608b = getOptionLabel(_0x4fd6c2, _0x3c6019);
  const _0x43af34 = resolveFieldDisabled(_0x4fd6c2, _0x322833) ? '\x20disabled\x20aria-disabled=\x22true\x22\x20data-ui-schema-disabled=\x22true\x22' : '';
  return "<div class=\"ui-schema-field ui-schema-section-menu\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x1469f3) + '\x22\x20data-ui-schema-type=\x22segmented\x22\x20data-ui-schema-default=\x22' + escapeHtmlAttr(_0x4fd6c2?.['defaultValue'] ?? '') + '\x22>\x0a\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22img-pill-btn\x20ui-schema-menu-trigger\x22\x20data-ui-schema-menu-trigger=\x22' + escapeHtmlAttr(_0x1469f3) + '\x22' + _0x43af34 + ">\n      <span class=\"ui-schema-pill-label\">" + escapeHtmlAttr(_0x3f608b) + "</span>\n    </button>\n    <div class=\"img-ratio-popup ui-schema-popup ui-schema-section-menu-popup\" style=\"display:none;\">\n      " + renderQualityButtons(_0x4fd6c2, _0x3c6019, _0x322833) + "\n    </div>\n  </div>";
}
function renderRatioButtons(_0x5450cb, _0x5cdf18, _0x5277dc = {}) {
  assertSupportedField(_0x5450cb);
  const _0x2059dc = _0x5450cb?.["displayRole"] ? '\x20data-ui-schema-display-role=\x22' + escapeHtmlAttr(_0x5450cb["displayRole"]) + '\x22' : '';
  const _0x2f631f = getRatioOptions(_0x5450cb, _0x5277dc);
  const _0x160aa3 = _0x2f631f["find"](_0x225fac => isAdaptiveRatioOption(_0x5450cb, _0x225fac));
  const _0xa08d63 = _0x2f631f["filter"](_0x34f34b => !isAdaptiveRatioOption(_0x5450cb, _0x34f34b));
  const _0x322f00 = String(_0x5cdf18 ?? '');
  const _0x3d43bc = _0x160aa3 ? getOptionValue(_0x160aa3) : '';
  const _0x3a83c7 = _0x160aa3 ? getDisplayLabelFromOption(_0x160aa3, _0x3d43bc) : '';
  const _0x5cf52b = _0x160aa3 && String(_0x322f00) === String(_0x3d43bc);
  const _0x17276c = _0x160aa3 ? '<button\x20type=\x22button\x22\x20class=\x22img-rp-large-adaptive\x20ui-schema-option\x20' + (_0x5cf52b ? 'active' : '') + '\x20' + (isOptionDisabled(_0x5450cb, _0x160aa3, _0x5277dc) ? "disabled" : '') + "\" data-label=\"自适应\" data-ui-schema-value=\"" + escapeHtmlAttr(_0x3d43bc) + "\" data-ui-schema-option-label=\"" + escapeHtmlAttr(_0x3a83c7) + '\x22' + getOptionDisabledAttrs(_0x5450cb, _0x160aa3, {
    'nodeData': _0x5277dc
  }) + ">\n        <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18\"/><path d=\"M9 21V9\"/></svg>\n        <span>" + escapeHtmlAttr(t("videoNode.parameterPanel.adaptive")) + "</span>\n      </button>" : '';
  const _0x3b498d = _0x160aa3 ? "img-rp-ratio-split has-adaptive" : "img-rp-ratio-split";
  return "<div class=\"img-rp-ratio-area\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x5450cb['id']) + "\" data-ui-schema-type=\"segmented\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x5450cb?.["defaultValue"] ?? '') + '\x22' + _0x2059dc + ">\n    <div class=\"img-rp-section-label\">" + escapeHtmlAttr(manifestText('比例')) + "</div>\n    <div class=\"" + _0x3b498d + "\">\n      " + (_0x160aa3 ? "<div class=\"img-rp-ratio-left\">" + _0x17276c + "</div>" : '') + '\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22img-rp-ratio-right\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + _0xa08d63["map"](_0x1ec435 => {
    const _0x2515d4 = getOptionValue(_0x1ec435);
    const _0xfdf455 = manifestText(_0x1ec435?.["label"] ?? _0x2515d4);
    const _0xeda1a7 = getDisplayLabelFromOption(_0x1ec435, _0xfdf455);
    const _0x51e63a = _0x322f00 === _0x2515d4;
    const _0x2be944 = isOptionDisabled(_0x5450cb, _0x1ec435, _0x5277dc);
    return '<button\x20type=\x22button\x22\x20class=\x22img-rp-ratio-item\x20ui-schema-option\x20' + (_0x51e63a ? "active" : '') + '\x20' + (_0x2be944 ? 'disabled' : '') + "\" data-label=\"" + escapeHtmlAttr(_0x2515d4) + "\" data-ui-schema-value=\"" + escapeHtmlAttr(_0x2515d4) + "\" data-ui-schema-option-label=\"" + escapeHtmlAttr(_0xeda1a7) + '\x22' + getOptionDisabledAttrs(_0x5450cb, _0x1ec435, {
      'nodeData': _0x5277dc
    }) + "><span class=\"img-rp-icon " + getRatioIconClass(_0x2515d4) + "\"></span><span>" + escapeHtmlAttr(_0xfdf455) + "</span></button>";
  })["join"]('') + "\n      </div>\n    </div>\n  </div>";
}
function renderQualityRatioField(_0x9ee9dc, _0x12c02e, _0xaf4491) {
  const _0x3b1afc = (Array["isArray"](_0x9ee9dc) ? _0x9ee9dc : [_0x9ee9dc])["filter"](Boolean);
  _0x3b1afc["forEach"](assertSupportedField);
  assertSupportedField(_0x12c02e);
  const _0x4c44c0 = getFieldValue(_0xaf4491, _0x12c02e);
  const _0x4e217b = _0x3b1afc['map'](_0x42a11a => getOptionLabel(_0x42a11a, getFieldValue(_0xaf4491, _0x42a11a)));
  const _0x1e4b80 = getRatioOptionLabel(_0x12c02e, _0x4c44c0);
  const _0x2c9b10 = String(_0x3b1afc[0x0]?.["qualityRatioLabelOrder"] || _0x3b1afc[0x0]?.["compositeLabelOrder"] || '')["trim"]();
  const _0x27a308 = _0x4e217b["length"] > 0x1 ? [..._0x4e217b, _0x1e4b80]['join']('\x20·\x20') : _0x2c9b10 === 'fieldFirst' ? (_0x4e217b[0x0] || '') + '\x20·\x20' + _0x1e4b80 : _0x1e4b80 + " · " + (_0x4e217b[0x0] || '');
  const _0x4728f9 = _0x2c9b10 ? '\x20data-ui-schema-label-order=\x22' + escapeHtmlAttr(_0x2c9b10) + '\x22' : '';
  return '<div\x20class=\x22ui-schema-quality-ratio-pill\x22\x20data-ui-schema-composite-field=\x22qualityRatio\x22' + _0x4728f9 + '>\x0a\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22img-pill-btn\x20ui-schema-menu-trigger\x22\x20data-ui-schema-menu-trigger=\x22qualityRatio\x22>\x0a\x20\x20\x20\x20\x20\x20<svg\x20width=\x2212\x22\x20height=\x2212\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22><rect\x20x=\x223\x22\x20y=\x223\x22\x20width=\x2218\x22\x20height=\x2218\x22\x20rx=\x222\x22/><path\x20d=\x22M3\x209h18\x22/><path\x20d=\x22M9\x2021V9\x22/></svg>\x0a\x20\x20\x20\x20\x20\x20<span\x20class=\x22ui-schema-pill-label\x20ui-schema-quality-ratio-label\x22>' + escapeHtmlAttr(_0x27a308) + "</span>\n    </button>\n    <div class=\"img-ratio-popup ui-schema-popup ui-schema-quality-ratio-popup\" style=\"display:none;\">\n      " + _0x3b1afc["map"](_0x29f4c7 => renderQualityButtons(_0x29f4c7, getFieldValue(_0xaf4491, _0x29f4c7), _0xaf4491))["join"]('') + "\n      " + renderRatioButtons(_0x12c02e, _0x4c44c0, _0xaf4491) + "\n    </div>\n  </div>";
}
function renderAspectRatioPillField(_0xaecb9e, _0x3d1323) {
  assertSupportedField(_0xaecb9e);
  const _0x35c53a = String(_0xaecb9e?.['id'] || '')["trim"]();
  const _0x2238fe = getFieldValue(_0x3d1323, _0xaecb9e);
  const _0x2401dc = getRatioOptionLabel(_0xaecb9e, _0x2238fe);
  const _0x3c6b5d = resolveFieldDisabled(_0xaecb9e, _0x3d1323) ? " disabled aria-disabled=\"true\" data-ui-schema-disabled=\"true\"" : '';
  return "<div class=\"ui-schema-aspect-ratio-pill\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x35c53a) + "\" data-ui-schema-type=\"segmented\" data-ui-schema-default=\"" + escapeHtmlAttr(_0xaecb9e?.['defaultValue'] ?? '') + '\x22>\x0a\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22img-pill-btn\x20ui-schema-menu-trigger\x22\x20data-ui-schema-menu-trigger=\x22' + escapeHtmlAttr(_0x35c53a) + '\x22' + _0x3c6b5d + ">\n      <svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18\"/><path d=\"M9 21V9\"/></svg>\n      <span class=\"ui-schema-pill-label ui-schema-aspect-ratio-label\">" + escapeHtmlAttr(_0x2401dc) + "</span>\n    </button>\n    <div class=\"img-ratio-popup ui-schema-popup ui-schema-aspect-ratio-popup\" style=\"display:none;\">\n      " + renderRatioButtons(_0xaecb9e, _0x2238fe, _0x3d1323) + '\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</div>';
}
function getVoiceCompositeModeField(_0x299a2f = {}, _0x4fc133 = {}) {
  return firstNonEmptyString(_0x299a2f?.['modeField'], _0x4fc133?.["modeField"], _0x299a2f?.['voiceModeField'], _0x4fc133?.['voiceModeField'], "voiceMode");
}
function getVoiceCompositeDefaultModeValue(_0x3c3d13 = {}, _0x10701b = {}) {
  return firstNonEmptyString(_0x3c3d13?.["modeValue"], _0x3c3d13?.["defaultModeValue"], _0x10701b?.['defaultModeValue'], "default");
}
function getVoiceCompositeCustomModeValue(_0x45a88a = {}, _0x5d561e = {}) {
  return firstNonEmptyString(_0x5d561e?.["modeValue"], _0x5d561e?.["filledModeValue"], _0x5d561e?.['customModeValue'], _0x45a88a?.["customModeValue"], "custom");
}
function renderVoiceQualityRatioField(_0x597c15, _0x59e554) {
  const _0x3af919 = (Array['isArray'](_0x597c15) ? _0x597c15 : [])["filter"](Boolean);
  if (_0x3af919["length"] < 0x2) {
    return '';
  }
  const _0x51b893 = _0x3af919[0x0];
  const _0xbb18a = _0x3af919[0x1];
  assertSupportedField(_0x51b893);
  assertSupportedField(_0xbb18a);
  const _0x4e77fa = getVoiceCompositeModeField(_0x51b893, _0xbb18a);
  const _0x2abf1e = getVoiceCompositeDefaultModeValue(_0x51b893, _0xbb18a);
  const _0x2c4e2e = getVoiceCompositeCustomModeValue(_0x51b893, _0xbb18a);
  const _0x24dce1 = getFieldValue(_0x59e554, _0x51b893);
  const _0x1b10e2 = String(getFieldValue(_0x59e554, _0xbb18a) || '')["trim"]();
  const _0x5e6c5f = _0x4e77fa ? String(getNodeFieldValue(_0x59e554, _0x4e77fa, '') || '')["trim"]() : '';
  const _0x59d81e = getOptionLabel(_0x51b893, _0x24dce1);
  const _0x21f0ea = resolveAudioVoiceCompositeState({
    'voiceTypeValue': _0x24dce1,
    'voiceTypeLabel': _0x59d81e,
    'speakerIdValue': _0x1b10e2,
    'voiceModeValue': _0x5e6c5f,
    'defaultModeValue': _0x2abf1e,
    'customModeValue': _0x2c4e2e
  });
  const _0x48de1c = _0x21f0ea["speakerIdValue"];
  const _0x5d71b9 = _0x21f0ea["triggerLabel"];
  const _0x2c5d7f = _0x21f0ea["customAreaClassName"];
  const _0x2918dc = _0x21f0ea['defaultAreaClassName'];
  const _0xb96ffc = manifestText(_0xbb18a?.["label"] || "自定义音色ID");
  const _0x180a09 = String(_0xbb18a?.["placeholder"] || '留空使用预设音色')["trim"]();
  const _0x1b7a33 = String(_0xbb18a?.['helpUrl'] || '')["trim"]();
  const _0x115e79 = _0x1b7a33 ? "<span class=\"rh-tip ui-schema-info-tip\" data-tooltip=\"" + escapeHtmlAttr(_0xbb18a?.["description"] || "填写后覆盖预设音色，默认音色将不可选。点击旁边链接可跳转音色库获取完整音色ID。") + "\">!</span><a href=\"#\" class=\"ui-schema-help-link img-rp-voice-help-link\" data-ui-schema-field-help-url=\"" + escapeHtmlAttr(_0x1b7a33) + '\x22\x20title=\x22打开火山音色库\x22\x20onclick=\x22return\x20false;\x22><svg\x20width=\x2212\x22\x20height=\x2212\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22><path\x20d=\x22M18\x2013v6a2\x202\x200\x200\x201-2\x202H5a2\x202\x200\x200\x201-2-2V8a2\x202\x200\x200\x201\x202-2h6\x22/><polyline\x20points=\x2215\x203\x2021\x203\x2021\x209\x22/><line\x20x1=\x2210\x22\x20y1=\x2214\x22\x20x2=\x2221\x22\x20y2=\x223\x22/></svg></a>' : '';
  const _0x274e45 = "<div class=\"img-rp-quality-area img-rp-voice-custom-area" + _0x2c5d7f + "\" data-ui-schema-field=\"" + escapeHtmlAttr(_0xbb18a['id']) + "\" data-ui-schema-type=\"text\" data-ui-schema-default=\"" + escapeHtmlAttr(_0xbb18a?.["defaultValue"] ?? '') + '\x22>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22img-rp-section-label\x22>' + escapeHtmlAttr(_0xb96ffc) + _0x115e79 + '</div>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22img-rp-voice-input-wrap\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<input\x20type=\x22text\x22\x20class=\x22img-rp-voice-input\x22\x20data-ui-schema-input=\x22' + escapeHtmlAttr(_0xbb18a['id']) + "\" data-ui-schema-field=\"" + escapeHtmlAttr(_0xbb18a['id']) + "\" data-ui-schema-value=\"" + escapeHtmlAttr(_0x48de1c) + "\" placeholder=\"" + escapeHtmlAttr(_0x180a09) + "\" value=\"" + escapeHtmlAttr(_0x48de1c) + '\x22\x20/>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</div>';
  const _0x205a4e = manifestText(_0x51b893?.['label'] || '默认音色');
  const _0x1d473f = getVisibleOptions(_0x51b893, _0x59e554);
  const _0xeff0e = _0x1d473f["map"](_0x2a2980 => {
    const _0x483c88 = getOptionValue(_0x2a2980);
    const _0x1a9ad1 = manifestText(_0x2a2980?.["label"] ?? _0x483c88);
    const _0x17caec = String(_0x24dce1 ?? '') === String(_0x483c88);
    return "<button type=\"button\" class=\"img-rp-ratio-item ui-schema-option " + (_0x17caec ? "active" : '') + "\" data-label=\"" + escapeHtmlAttr(_0x483c88) + "\" data-ui-schema-value=\"" + escapeHtmlAttr(_0x483c88) + "\"><span>" + escapeHtmlAttr(_0x1a9ad1) + "</span></button>";
  })["join"]('');
  const _0x5d6f30 = "<div class=\"img-rp-ratio-area img-rp-voice-default-area" + _0x2918dc + "\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x51b893['id']) + "\" data-ui-schema-type=\"segmented\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x51b893?.["defaultValue"] ?? '') + "\">\n      <div class=\"img-rp-section-label\">" + escapeHtmlAttr(_0x205a4e) + "</div>\n      <div class=\"img-rp-ratio-split\">\n        <div class=\"img-rp-ratio-right\">\n          " + _0xeff0e + "\n        </div>\n      </div>\n    </div>";
  return "<div class=\"ui-schema-voice-quality-ratio-pill\" data-ui-schema-composite-field=\"voiceQualityRatio\" data-ui-schema-primary-field=\"" + escapeHtmlAttr(_0x51b893['id']) + '\x22\x20data-ui-schema-secondary-field=\x22' + escapeHtmlAttr(_0xbb18a['id']) + '\x22\x20data-ui-schema-mode-field=\x22' + escapeHtmlAttr(_0x4e77fa) + "\" data-ui-schema-default-mode-value=\"" + escapeHtmlAttr(_0x2abf1e) + "\" data-ui-schema-custom-mode-value=\"" + escapeHtmlAttr(_0x2c4e2e) + "\">\n    <button type=\"button\" class=\"img-pill-btn ui-schema-menu-trigger\" data-ui-schema-menu-trigger=\"voiceQualityRatio\">\n      <svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z\"/><path d=\"M19 10v2a7 7 0 0 1-14 0v-2\"/><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\"/><line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\"/></svg>\n      <span class=\"ui-schema-pill-label ui-schema-voice-quality-ratio-label\">" + escapeHtmlAttr(_0x5d71b9) + '</span>\x0a\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20<div\x20class=\x22img-ratio-popup\x20ui-schema-popup\x20ui-schema-voice-quality-ratio-popup\x22\x20style=\x22display:none;\x22>\x0a\x20\x20\x20\x20\x20\x20' + _0x274e45 + "\n      " + _0x5d6f30 + "\n    </div>\n  </div>";
}
function renderSectionPairField(_0x4b8aa1, _0x12d74f) {
  const _0x587210 = (Array["isArray"](_0x4b8aa1) ? _0x4b8aa1 : [])["filter"](Boolean);
  _0x587210["forEach"](assertSupportedField);
  const _0x417146 = _0x587210["map"](_0x175210 => getOptionLabel(_0x175210, getFieldValue(_0x12d74f, _0x175210)))["join"](" · ");
  const _0x3298e8 = _0x587210["map"](_0x52c682 => String(_0x52c682?.['id'] || '')["trim"]())["filter"](Boolean);
  const _0x3235c5 = _0x3298e8[0x0] || '';
  const _0x474d1b = _0x3298e8[0x1] || '';
  return "<div class=\"ui-schema-section-pair-pill\" data-ui-schema-composite-field=\"sectionPair\" data-ui-schema-primary-field=\"" + escapeHtmlAttr(_0x3235c5) + "\" data-ui-schema-secondary-field=\"" + escapeHtmlAttr(_0x474d1b) + '\x22>\x0a\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22img-pill-btn\x20ui-schema-menu-trigger\x22\x20data-ui-schema-menu-trigger=\x22sectionPair\x22>\x0a\x20\x20\x20\x20\x20\x20<span\x20class=\x22ui-schema-pill-label\x20ui-schema-section-pair-label\x22>' + escapeHtmlAttr(_0x417146) + "</span>\n    </button>\n    <div class=\"img-ratio-popup ui-schema-popup ui-schema-section-pair-popup\" style=\"display:none;\">\n      " + _0x587210['map'](_0x470da9 => renderQualityButtons(_0x470da9, getFieldValue(_0x12d74f, _0x470da9), _0x12d74f))["join"]('') + '\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</div>';
}
function renderVideoResolutionField(_0x430840, _0x452e1d) {
  const _0x937f8b = getFieldById(_0x430840, "rhVideoResolution") || getFieldById(_0x430840, 'videoResolution');
  if (!_0x937f8b) {
    return '';
  }
  assertSupportedField(_0x937f8b);
  const _0x32be32 = getFieldById(_0x430840, "rhVideoFps");
  const _0xceb88c = getFieldById(_0x430840, 'rhVideoFrames');
  if (_0x32be32) {
    assertSupportedField(_0x32be32);
  }
  if (_0xceb88c) {
    assertSupportedField(_0xceb88c);
  }
  const _0x1dcb15 = getFieldValue(_0x452e1d, _0x937f8b);
  const _0x5e82d3 = _0x32be32 ? getFieldValue(_0x452e1d, _0x32be32) : '';
  const _0x3ca09e = _0xceb88c ? getFieldValue(_0x452e1d, _0xceb88c) : '';
  const _0x4d0438 = Number(_0x3ca09e) === 0x0 ? t("aigenImage.uiSchema.fullLength") : String(_0x3ca09e || '');
  const _0x10b331 = _0x32be32 && _0xceb88c ? joinMetricLabels([['帧数', _0x4d0438], ['帧率', _0x5e82d3], ["分辨率", _0x1dcb15]]) : formatMetricLabel("分辨率", _0x1dcb15);
  return '<div\x20class=\x22ui-schema-video-resolution-pill\x22\x20data-ui-schema-composite-field=\x22videoResolution\x22>\x0a\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22img-pill-btn\x20ui-schema-menu-trigger\x22\x20data-ui-schema-menu-trigger=\x22videoResolution\x22>\x0a\x20\x20\x20\x20\x20\x20<span\x20class=\x22ui-schema-pill-label\x20ui-schema-video-resolution-label\x22>' + escapeHtmlAttr(_0x10b331) + "</span>\n    </button>\n    <div class=\"img-ratio-popup ui-schema-popup ui-schema-video-resolution-popup\" style=\"display:none;\">\n      " + renderQualityButtons({
    ..._0x937f8b,
    'label': "分辨率"
  }, _0x1dcb15, _0x452e1d) + "\n      " + (_0x32be32 ? '<div\x20class=\x22rh-v5-meta-panel\x22><div\x20class=\x22rh-vram-adv-row\x22><div\x20class=\x22rh-vram-adv-label\x22><span>' + escapeHtmlAttr(manifestText('帧率')) + '</span></div><div\x20class=\x22img-rp-quality-segmented\x20rh-adv-seg\x20rh-v5-fps-seg\x22\x20data-ui-schema-field=\x22' + escapeHtmlAttr(_0x32be32['id']) + '\x22\x20data-ui-schema-type=\x22segmented\x22\x20data-ui-schema-default=\x22' + escapeHtmlAttr(_0x32be32["defaultValue"] ?? '') + '\x22>' + renderOptions(_0x32be32, _0x5e82d3, _0x452e1d) + "</div></div></div>" : '') + "\n    </div>\n  </div>";
}
function normalizeNumberValue(_0x4a1b06, _0x130c05, {
  min = -Infinity,
  max = Infinity
} = {}) {
  const _0x363c60 = Number(_0x4a1b06);
  const _0x1ce73a = Number["isFinite"](_0x363c60) ? Math['trunc'](_0x363c60) : _0x130c05;
  return Math['max'](min, Math['min'](max, _0x1ce73a));
}
function renderRhVideoParamsIcon() {
  return "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" style=\"flex-shrink:0;\"><rect x=\"3\" y=\"6\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M7 6V4\"/><path d=\"M12 6V4\"/><path d=\"M17 6V4\"/><path d=\"M8 10h1\"/><path d=\"M8 14h1\"/><path d=\"M8 18h1\"/><path d=\"M15 12l4 2-4 2z\"/></svg>";
}
function getRhVideoParamsKind(_0x18e26a) {
  if (getFieldById(_0x18e26a, 'rhVideoSeconds')) {
    return 'seconds';
  }
  if (getFieldById(_0x18e26a, 'rhVideoFrames')) {
    return "frames";
  }
  return "resolution";
}
function buildRhVideoParamsLabel(_0x5da76e, _0xa73812) {
  const _0x483e66 = getFieldById(_0x5da76e, "rhVideoResolution");
  const _0xe9e74a = getFieldById(_0x5da76e, "rhVideoFps");
  const _0x294939 = getFieldById(_0x5da76e, 'rhVideoFrames');
  const _0x9241c = getFieldById(_0x5da76e, "rhVideoSeconds");
  const _0x5c1447 = _0x483e66 ? normalizeNumberValue(getFieldValue(_0xa73812, _0x483e66), Number(_0x483e66["defaultValue"] ?? 0x340), {
    'min': 0x340
  }) : 0x340;
  if (_0x9241c) {
    const _0x3e9c4f = _0xe9e74a ? normalizeNumberValue(getFieldValue(_0xa73812, _0xe9e74a), Number(_0xe9e74a["defaultValue"] ?? 0x18)) : 0x18;
    const _0x2d2388 = normalizeNumberValue(getFieldValue(_0xa73812, _0x9241c), Number(_0x9241c["defaultValue"] ?? 0x5), {
      'min': Number(_0x9241c["min"] ?? 0x1),
      'max': Number(_0x9241c['max'] ?? 0x258)
    });
    return joinMetricLabels([['秒数', _0x2d2388], ['帧率', _0x3e9c4f], ["分辨率", _0x5c1447]]);
  }
  if (_0x294939) {
    const _0x1ccae3 = normalizeNumberValue(getFieldValue(_0xa73812, _0x294939), Number(_0x294939["defaultValue"] ?? 0x4d), {
      'min': Number(_0x294939["min"] ?? 0x0),
      'max': Number(_0x294939["max"] ?? 0xf423f)
    });
    const _0x1af9c0 = _0x1ccae3 === 0x0 ? t("aigenImage.uiSchema.fullLength") : String(_0x1ccae3);
    if (!_0xe9e74a) {
      return joinMetricLabels([['帧数', _0x1af9c0], ["分辨率", _0x5c1447]]);
    }
    const _0x591ae8 = normalizeNumberValue(getFieldValue(_0xa73812, _0xe9e74a), Number(_0xe9e74a['defaultValue'] ?? 0x18));
    return joinMetricLabels([['帧数', _0x1af9c0], ['帧率', _0x591ae8], ["分辨率", _0x5c1447]]);
  }
  return formatMetricLabel("分辨率", _0x5c1447);
}
function getRhVideoParamsAspectRatioField(_0x17ca43) {
  return getFieldById(_0x17ca43, 'rhBerniniAspectRatio') || getFieldById(_0x17ca43, 'aspectRatio') || getFieldByDisplayRole(_0x17ca43, "aspectRatio");
}
function getRhVideoFpsOptions(_0x2873df, _0x543e23 = {}) {
  if (Array['isArray'](_0x543e23?.["rhVideoFpsOptions"]) && _0x543e23['rhVideoFpsOptions']["length"]) {
    return _0x543e23["rhVideoFpsOptions"]["map"](_0x1fa6f1 => Number(_0x1fa6f1))["filter"](Number["isFinite"])['map'](_0x5391bd => Object['freeze']({
      'value': _0x5391bd,
      'label': _0x5391bd + '帧'
    }));
  }
  return getRenderableOptions(_0x2873df);
}
function renderRhVideoParamsResolutionField(_0x996010, _0x430611, {
  buttonClass: _0x1a255c
}) {
  assertSupportedField(_0x996010);
  const _0x35af74 = normalizeNumberValue(getFieldValue(_0x430611, _0x996010), Number(_0x996010['defaultValue'] ?? 0x340), {
    'min': 0x340
  });
  return "<div class=\"img-rp-quality-area\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x996010['id']) + "\" data-ui-schema-type=\"segmented\" data-ui-schema-value-type=\"number\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x996010?.["defaultValue"] ?? '') + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22img-rp-section-label\x22>' + escapeHtmlAttr(manifestText("分辨率")) + "<span class=\"rh-tip\" data-tooltip=\"" + escapeHtmlAttr(manifestText(_0x996010?.["description"] || _0x996010?.['tooltip'] || "分辨率越高细节越清晰、边缘更稳定。\n同时显存占用与生成耗时会明显增加。")) + "\">!</span></div>\n                  <div class=\"img-rp-quality-segmented rh-video-resolution-seg\">\n                    " + (Array["isArray"](_0x996010?.["options"]) ? _0x996010["options"] : [])["map"](_0x7df115 => {
    const _0x4282cf = Number(getOptionValue(_0x7df115));
    const _0x49506c = Number(_0x35af74) === Number(_0x4282cf);
    const _0x58bd05 = _0x996010?.["showHighResolutionOptions"] === !![] || Number(_0x4282cf) <= 0x5a0 ? '' : " dev-mode-only";
    return '<button\x20type=\x22button\x22\x20class=\x22img-rp-quality-item' + _0x58bd05 + '\x20' + (_0x49506c ? 'active' : '') + '\x20' + _0x1a255c + " ui-schema-option\" data-value=\"" + escapeHtmlAttr(_0x4282cf) + "\" data-ui-schema-value=\"" + escapeHtmlAttr(_0x4282cf) + '\x22>' + escapeHtmlAttr(_0x4282cf) + "</button>";
  })['join']('') + "\n                  </div>\n                </div>";
}
function renderRhVideoParamsFpsRow(_0x1a85a8, _0x35b7aa, _0x17a449 = {}) {
  assertSupportedField(_0x1a85a8);
  const _0x144980 = normalizeNumberValue(getFieldValue(_0x35b7aa, _0x1a85a8), Number(_0x1a85a8['defaultValue'] ?? 0x18));
  const _0x56c8e8 = _0x17a449?.["buttonClass"] || 'rh-v5-fps-btn';
  const _0x7d8fc2 = _0x17a449?.["hidden"] ? " hidden" : '';
  return '<div\x20class=\x22rh-vram-adv-row\x22' + _0x7d8fc2 + '>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-vram-adv-label\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span>' + escapeHtmlAttr(manifestText('帧率')) + "</span>\n                      <span class=\"rh-tip\" data-tooltip=\"" + escapeHtmlAttr(manifestText("帧率越高运动更顺滑、动作更连贯。\n但生成更慢、成本更高。\n常用 24 帧；想更快或更省可选 16 帧。")) + '\x22>!</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22img-rp-quality-segmented\x20rh-adv-seg\x20rh-v5-fps-seg\x22\x20data-ui-schema-field=\x22' + escapeHtmlAttr(_0x1a85a8['id']) + '\x22\x20data-ui-schema-type=\x22segmented\x22\x20data-ui-schema-value-type=\x22number\x22\x20data-ui-schema-default=\x22' + escapeHtmlAttr(_0x1a85a8?.["defaultValue"] ?? '') + "\">\n                      " + getRhVideoFpsOptions(_0x1a85a8, _0x17a449)["map"](_0x1a31a4 => {
    const _0xade995 = Number(getOptionValue(_0x1a31a4));
    const _0x44a2f0 = manifestText(_0x1a31a4?.['label'] ?? _0xade995 + '帧');
    return '<button\x20type=\x22button\x22\x20class=\x22img-rp-quality-item\x20' + _0x56c8e8 + '\x20' + (Number(_0x144980) === Number(_0xade995) ? "active" : '') + " ui-schema-option\" data-value=\"" + escapeHtmlAttr(_0xade995) + '\x22\x20data-ui-schema-value=\x22' + escapeHtmlAttr(_0xade995) + '\x22>' + escapeHtmlAttr(_0x44a2f0) + "</button>";
  })["join"]('') + "\n                    </div>\n                  </div>";
}
function renderRhVideoParamsStepperRow(_0x529634, _0x1059fe, _0x402549 = {}) {
  assertSupportedField(_0x529634);
  const _0x105d88 = String(_0x529634?.['id'] || '')["trim"]();
  const _0x54044f = _0x105d88 === "rhVideoFrames";
  const _0x3a6d7e = Number(_0x529634?.["min"] ?? (_0x54044f ? 0x0 : 0x1));
  const _0x4a6b7c = Number(_0x529634?.["max"] ?? (_0x54044f ? 0xf423f : 0x258));
  const _0x4bbe86 = Number(_0x529634?.['defaultValue'] ?? (_0x54044f ? 0x4d : 0x5));
  const _0x10e975 = normalizeNumberValue(getFieldValue(_0x1059fe, _0x529634), _0x4bbe86, {
    'min': _0x3a6d7e,
    'max': _0x4a6b7c
  });
  const _0x1a9fb0 = Number(_0x1059fe?.["rhVideoSourceFrameCount"] || 0x0);
  const _0x570ac9 = _0x54044f ? "rh-v5-frames-stepper" : 'rh-ltx-seconds-stepper';
  const _0x20e687 = manifestText(_0x54044f ? "生成时长（帧数）" : '生成秒数');
  const _0x56b780 = manifestText(_0x54044f ? "帧数决定生成片段的长度：数值越大视频越长、耗时越高。\n填 0 表示按源视频全长处理（适合整段替换）。" : "秒数决定生成视频的时长：数值越大视频越长、耗时与成本越高。");
  const _0x6b1cc3 = _0x54044f && _0x10e975 === 0x0 ? t("aigenImage.uiSchema.fullLength") : String(_0x10e975);
  return "<div class=\"rh-vram-adv-row ui-schema-rh-video-stepper\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x105d88) + "\" data-ui-schema-type=\"stepper\" data-ui-schema-value-type=\"number\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x529634?.["defaultValue"] ?? '') + "\" data-ui-schema-min=\"" + escapeHtmlAttr(_0x3a6d7e) + "\" data-ui-schema-max=\"" + escapeHtmlAttr(_0x4a6b7c) + "\" data-ui-schema-step=\"" + escapeHtmlAttr(_0x529634?.['step'] ?? 0x1) + "\">\n                    <div class=\"rh-vram-adv-label\">\n                      <span>" + _0x20e687 + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22rh-tip\x22\x20data-tooltip=\x22' + _0x56b780 + "\">!</span>\n                    </div>\n                    <div class=\"rh-stepper " + _0x570ac9 + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x54044f ? '<div\x20class=\x22rh-v5-source-framecount\x22\x20aria-label=\x22' + escapeHtmlAttr(manifestText("源视频总帧数")) + '\x22>' + (_0x1a9fb0 ? String(_0x1a9fb0) : '—') + '</div>' : '') + "\n                      <div class=\"rh-stepper-value\" role=\"spinbutton\" aria-label=\"" + escapeHtmlAttr(manifestText(_0x54044f ? "生成帧数" : '生成秒数')) + '\x22\x20aria-valuenow=\x22' + escapeHtmlAttr(_0x10e975) + "\" tabindex=\"0\">" + escapeHtmlAttr(_0x6b1cc3) + "</div>\n                    </div>\n                  </div>";
}
function renderRhVideoParamsPlacementFields(_0x9a9bf1, _0x13adaf, _0x5ca38a = {}) {
  const _0x4a4ba8 = getFieldById(_0x9a9bf1, "rhVideoResolution");
  if (!_0x4a4ba8) {
    return _0x9a9bf1["map"](_0x8bedaa => renderField(_0x8bedaa, _0x13adaf, _0x5ca38a))['join']('');
  }
  const _0x557d9a = getFieldById(_0x9a9bf1, 'rhVideoFps');
  const _0x5d304e = getFieldById(_0x9a9bf1, 'rhVideoFrames');
  const _0x12ac51 = getFieldById(_0x9a9bf1, "rhVideoSeconds");
  const _0x1ccdf0 = getRhVideoParamsAspectRatioField(_0x9a9bf1);
  const _0x5576ac = getRhVideoParamsKind(_0x9a9bf1);
  const _0x1163b1 = _0x5576ac === "seconds";
  const _0x5e0b25 = Boolean(_0x5d304e && !_0x557d9a);
  const _0x44e29c = _0x1163b1 ? "rh-ltx-res-btn" : "rh-v5-res-btn";
  const _0x4bdeb5 = _0x1163b1 ? 'rh-ltx-fps-btn' : "rh-v5-fps-btn";
  const _0x882a4e = buildRhVideoParamsLabel(_0x9a9bf1, _0x13adaf);
  const _0x20d5ee = _0x1163b1 ? 'rh-ltx-meta-panel' : 'rh-v5-meta-panel';
  const _0x3af319 = _0x1163b1 ? '' + (_0x557d9a ? renderRhVideoParamsFpsRow(_0x557d9a, _0x13adaf, {
    ..._0x5ca38a,
    'buttonClass': _0x4bdeb5
  }) : '') + (_0x12ac51 ? renderRhVideoParamsStepperRow(_0x12ac51, _0x13adaf, _0x5ca38a) : '') : '' + (_0x557d9a ? renderRhVideoParamsFpsRow(_0x557d9a, _0x13adaf, {
    ..._0x5ca38a,
    'buttonClass': _0x4bdeb5
  }) : '') + (_0x5e0b25 && _0x5ca38a?.["preserveHiddenFpsRow"] ? '' : '') + (_0x5d304e ? renderRhVideoParamsStepperRow(_0x5d304e, _0x13adaf, _0x5ca38a) : '');
  const _0x3f9059 = new Set(['rhVideoResolution', "rhVideoFps", "rhVideoFrames", 'rhVideoSeconds']);
  const _0x573de6 = String(_0x1ccdf0?.['id'] || '')["trim"]();
  if (_0x573de6) {
    _0x3f9059["add"](_0x573de6);
  }
  const _0x57e3b0 = _0x9a9bf1["filter"](_0x26af66 => !_0x3f9059["has"](String(_0x26af66?.['id'] || '')["trim"]()));
  const _0x4f205a = _0x5e0b25 && _0x5ca38a?.['preserveHiddenFpsRow'] ? renderRhVideoParamsFpsRow({
    'id': "rhVideoFps",
    'type': "segmented",
    'label': '帧率',
    'defaultValue': 0x18,
    'options': Object['freeze']([Object["freeze"]({
      'value': 0x10,
      'label': "16帧"
    }), Object["freeze"]({
      'value': 0x18,
      'label': '24帧'
    })])
  }, {
    'generationParams': {
      'rhVideoFps': 0x18
    }
  }, {
    ..._0x5ca38a,
    'buttonClass': _0x4bdeb5,
    'hidden': !![]
  }) : '';
  const _0x3b8381 = "<div class=\"img-ratio-wrap ui-schema-rh-video-params\" style=\"position:relative;\" data-ui-schema-composite-field=\"rhVideoParams\">\n              <button type=\"button\" class=\"img-pill-btn img-ratio-btn ui-schema-menu-trigger\" data-ui-schema-menu-trigger=\"rhVideoParams\">\n                <span class=\"img-ratio-icon-slot\">" + renderRhVideoParamsIcon() + "</span>\n                <span class=\"img-ratio-label\">" + escapeHtmlAttr(_0x882a4e) + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22img-ratio-popup\x20ui-schema-popup\x22\x20style=\x22display:none;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + renderRhVideoParamsResolutionField(_0x4a4ba8, _0x13adaf, {
    'buttonClass': _0x44e29c
  }) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22' + _0x20d5ee + "\" style=\"display:flex;flex-direction:column;gap:10px;\">\n                  " + _0x4f205a + _0x3af319 + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x1ccdf0 ? renderRatioButtons(_0x1ccdf0, getFieldValue(_0x13adaf, _0x1ccdf0), _0x13adaf) : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>';
  return [..._0x57e3b0["map"](_0x1c566b => renderField(_0x1c566b, _0x13adaf, _0x5ca38a)), _0x3b8381]["join"]('');
}
function renderFloatingMenuItems(_0xed327, _0x5aac0d, _0x309913 = {}) {
  const _0x424473 = getVisibleOptions(_0xed327, _0x309913);
  return _0x424473['map'](_0x1d980d => {
    const _0x3a3180 = String(_0x1d980d?.["value"] ?? _0x1d980d);
    const _0x3f1f87 = manifestText(_0x1d980d?.["label"] ?? _0x3a3180);
    const _0x132a72 = getDisplayLabelFromOption(_0x1d980d, _0x3f1f87);
    const _0xed31b6 = manifestText(_0x1d980d?.["tooltip"] || '')["trim"]();
    const _0x43c628 = manifestText(_0x1d980d?.["subtitle"] || _0x1d980d?.["description"] || '')["trim"]();
    const _0x446e71 = String(_0x5aac0d ?? '') === _0x3a3180;
    const _0x4d411e = isOptionDisabled(_0xed327, _0x1d980d, _0x309913);
    const _0x1f6085 = _0xed31b6 ? '\x20title=\x22' + escapeHtmlAttr(_0xed31b6) + "\" data-tooltip=\"" + escapeHtmlAttr(_0xed31b6) + '\x22' : '';
    const _0x4582f7 = _0xed31b6 ? "<span class=\"rh-tip ui-schema-info-tip\" data-tooltip=\"" + escapeHtmlAttr(_0xed31b6) + '\x22>!</span>' : '';
    const _0x3e7773 = _0x43c628 ? "<div class=\"fmi-content\"><div class=\"fmi-title\">" + escapeHtmlAttr(_0x3f1f87) + "</div><div class=\"fmi-sub\">" + escapeHtmlAttr(_0x43c628) + "</div></div>" : '<span\x20class=\x22floating-menu-label\x22>' + escapeHtmlAttr(_0x3f1f87) + "</span>";
    return '<button\x20type=\x22button\x22\x20role=\x22option\x22\x20aria-selected=\x22' + (_0x446e71 ? 'true' : 'false') + "\" class=\"floating-menu-item " + (_0x446e71 ? "active" : '') + '\x20' + (_0x4d411e ? "disabled" : '') + '\x20' + (_0x43c628 ? 'has-subtitle' : '') + "\" data-ui-schema-value=\"" + escapeHtmlAttr(_0x3a3180) + "\" data-ui-schema-option-label=\"" + escapeHtmlAttr(_0x132a72) + '\x22' + _0x1f6085 + getOptionDisabledAttrs(_0xed327, _0x1d980d, {
      'nodeData': _0x309913
    }) + '>' + _0x3e7773 + _0x4582f7 + "</button>";
  })["join"]('');
}
function renderDropdownControl(_0x39eec3, _0x35c974, _0x5b1f11, _0x1d83bb = {}) {
  const _0x310782 = String(_0x39eec3?.['id'] || '')["trim"]();
  const _0x2e1fb7 = getOptionLabel(_0x39eec3, _0x35c974);
  const _0x36e1cf = _0x1d83bb?.["advanced"] ? " ui-schema-advanced-dropdown" : '';
  const _0x221528 = String(_0x1d83bb?.['titleHtml'] || '');
  const _0x1b039f = _0x1d83bb?.["advanced"] ? "<svg class=\"ui-schema-dropdown-chevron\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" aria-hidden=\"true\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>" : '';
  const _0xc39507 = resolveFieldDisabled(_0x39eec3, _0x5b1f11) ? " disabled aria-disabled=\"true\" data-ui-schema-disabled=\"true\"" : '';
  return "<div class=\"ui-schema-pill-menu" + _0x36e1cf + "\" data-ui-schema-dropdown>\n    <button type=\"button\" class=\"img-pill-btn ui-schema-menu-trigger\" data-ui-schema-menu-trigger=\"" + escapeHtmlAttr(_0x310782) + "\" aria-haspopup=\"listbox\" aria-expanded=\"false\"" + _0xc39507 + ">\n      <span class=\"ui-schema-pill-label\">" + escapeHtmlAttr(_0x2e1fb7) + "</span>\n      " + _0x1b039f + "\n    </button>\n    <div class=\"floating-menu ui-schema-floating-menu\" role=\"listbox\" aria-hidden=\"true\">\n      " + _0x221528 + '\x0a\x20\x20\x20\x20\x20\x20' + renderFloatingMenuItems(_0x39eec3, _0x35c974, _0x5b1f11) + "\n    </div>\n  </div>";
}
function renderPillMenuField(_0x5a2d07, _0x2ecafc) {
  const _0x4b19f9 = String(_0x5a2d07?.['id'] || '')["trim"]();
  const _0x3d5149 = getFieldValue(_0x2ecafc, _0x5a2d07);
  const _0x44e4fd = normalizeControlType(_0x5a2d07?.["type"]);
  const _0x1f87d1 = manifestText(_0x5a2d07?.["menuTitle"] || _0x5a2d07?.["label"] || _0x4b19f9)["trim"]();
  const _0x2658df = _0x5a2d07?.["menuTooltipByValue"];
  const _0x2878d0 = String(_0x5a2d07?.["menuTooltipField"] || '')["trim"]();
  const _0x23c90c = _0x2878d0 ? String(getNodeFieldValue(_0x2ecafc, _0x2878d0, '') || '')["trim"]() : '';
  const _0x2a6af4 = _0x2658df && typeof _0x2658df === "object" && !Array['isArray'](_0x2658df) ? _0x2658df[_0x23c90c] : '';
  const _0x2f6218 = manifestText(_0x2a6af4 || _0x5a2d07?.["menuTooltip"] || _0x5a2d07?.["menuDescription"] || _0x5a2d07?.["tooltip"] || '')["trim"]();
  const _0x1a4a68 = _0x2f6218 ? "<span class=\"rh-tip ui-schema-info-tip\" data-tooltip=\"" + escapeHtmlAttr(_0x2f6218) + "\">!</span>" : '';
  const _0x2bb05f = _0x1f87d1 ? "<div class=\"floating-menu-title ui-schema-floating-menu-title\">" + escapeHtmlAttr(_0x1f87d1) + _0x1a4a68 + '</div>' : '';
  return "<div class=\"ui-schema-field\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x4b19f9) + "\" data-ui-schema-type=\"" + escapeHtmlAttr(_0x44e4fd) + "\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x5a2d07?.['defaultValue'] ?? '') + "\">\n    " + renderDropdownControl(_0x5a2d07, _0x3d5149, _0x2ecafc, {
    'titleHtml': _0x2bb05f
  }) + "\n  </div>";
}
function renderResolutionPillField(_0x4f880d, _0x3f2899) {
  const _0x5e9dcd = String(_0x4f880d?.['id'] || '')["trim"]();
  const _0x86973e = getFieldValue(_0x3f2899, _0x4f880d);
  const _0x4fe262 = getVisibleOptions(_0x4f880d, _0x3f2899);
  const _0x36ff7a = _0x4fe262["map"](_0x2fb4fe => Number(_0x2fb4fe?.["value"] ?? _0x2fb4fe))["filter"](Number['isFinite']);
  const _0x137b8d = Number["isFinite"](Number(_0x86973e)) ? Number(_0x86973e) : Number(_0x4f880d?.["defaultValue"] ?? _0x36ff7a[0x0] ?? 0x0);
  const _0x4ff1f3 = Math["max"](0x0, _0x36ff7a["indexOf"](_0x137b8d));
  const _0xc2125 = Math['max'](0x0, _0x36ff7a["length"] - 0x1);
  const _0x36015e = manifestText(_0x4f880d?.["label"] || "Resolution");
  const _0x5eb9f8 = manifestText(_0x4f880d?.["description"] || _0x4f880d?.["tooltip"] || '')["trim"]();
  const _0x56132f = _0x5eb9f8 && _0x4f880d?.['showInfoTip'] === !![] ? "<span class=\"rh-tip ui-schema-info-tip\" data-tooltip=\"" + escapeHtmlAttr(_0x5eb9f8) + "\">!</span>" : '';
  const _0x228ae8 = resolveFieldDisabled(_0x4f880d, _0x3f2899) ? " disabled aria-disabled=\"true\" data-ui-schema-disabled=\"true\"" : '';
  return "<div class=\"ui-schema-field ui-schema-resolution-pill\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x5e9dcd) + "\" data-ui-schema-adapter=\"field.resolutionPill.slider\" data-ui-schema-type=\"slider\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x4f880d?.["defaultValue"] ?? '') + "\" data-ui-schema-range-values=\"" + escapeHtmlAttr(_0x36ff7a["join"](',')) + "\">\n    <button type=\"button\" class=\"img-pill-btn ui-schema-menu-trigger\" data-ui-schema-menu-trigger=\"" + escapeHtmlAttr(_0x5e9dcd) + '\x22' + _0x228ae8 + ">\n      <span class=\"ui-schema-pill-label ui-schema-resolution-label\">\n        <span class=\"ui-schema-resolution-title\">" + escapeHtmlAttr(_0x36015e) + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22ui-schema-resolution-value\x22>' + escapeHtmlAttr(_0x137b8d) + "</span>\n      </span>\n    </button>\n    <div class=\"rh-res-popup ui-schema-popup\" style=\"display:none;\">\n      <div class=\"rh-res-title\">" + escapeHtmlAttr(_0x36015e) + _0x56132f + "</div>\n      <input type=\"range\" class=\"rh-res-slider ui-schema-range-index\" data-ui-schema-input=\"" + escapeHtmlAttr(_0x5e9dcd) + "\" min=\"0\" max=\"" + escapeHtmlAttr(_0xc2125) + "\" step=\"1\" value=\"" + escapeHtmlAttr(_0x4ff1f3) + "\">\n      <div class=\"rh-res-ticks\">" + _0x36ff7a["map"](_0x637e32 => '<span>' + escapeHtmlAttr(_0x637e32) + "</span>")['join']('') + '</div>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</div>';
}
function findRangeValueIndex(_0x4b0ba6, _0x2e1c91) {
  const _0x5608eb = Number(_0x2e1c91);
  if (!Number["isFinite"](_0x5608eb) || !Array["isArray"](_0x4b0ba6)) {
    return -0x1;
  }
  return _0x4b0ba6["findIndex"](_0x3bb27c => Math['abs'](Number(_0x3bb27c) - _0x5608eb) < 0.000001);
}
function parseRangeValuesFromFieldEl(_0x2b3e81) {
  const _0x4e1569 = String(_0x2b3e81?.['dataset']?.['uiSchemaRangeValues'] || '')['trim']();
  if (!_0x4e1569) {
    return [];
  }
  return _0x4e1569["split"](',')["map"](_0x31a463 => Number(_0x31a463))["filter"](Number["isFinite"]);
}
function parseRangeLabelsFromFieldEl(_0x277316) {
  const _0x2263de = String(_0x277316?.["dataset"]?.["uiSchemaRangeLabels"] || '')["trim"]();
  if (!_0x2263de) {
    return [];
  }
  try {
    const _0x4ad7e0 = JSON["parse"](_0x2263de);
    return Array["isArray"](_0x4ad7e0) ? _0x4ad7e0["map"](_0x4e1285 => String(_0x4e1285)) : [];
  } catch {
    return [];
  }
}
function getRangeValueDisplayLabel(_0x1cedc3, _0x110075, _0x219d89 = '') {
  const _0x44a1fa = parseRangeLabelsFromFieldEl(_0x1cedc3);
  if (_0x44a1fa["length"] === 0x0) {
    return _0x219d89 || String(_0x110075 ?? '');
  }
  const _0x173c8c = parseRangeValuesFromFieldEl(_0x1cedc3);
  const _0x405b05 = findRangeValueIndex(_0x173c8c, _0x110075);
  return _0x405b05 >= 0x0 && _0x44a1fa[_0x405b05] ? _0x44a1fa[_0x405b05] : _0x219d89 || String(_0x110075 ?? '');
}
function getDurationOptionEntries(_0x85138, _0x33d5f8 = {}) {
  return getVisibleOptions(_0x85138, _0x33d5f8)["map"](_0x218e73 => {
    const _0x3a5628 = _0x218e73 && typeof _0x218e73 === "object" && !Array["isArray"](_0x218e73);
    const _0x1ff622 = Number(_0x3a5628 ? _0x218e73["value"] : _0x218e73);
    if (!Number["isFinite"](_0x1ff622)) {
      return null;
    }
    const _0x3fecdf = String(_0x3a5628 ? getDisplayLabelFromOption(_0x218e73, _0x1ff622 + 'S') : _0x1ff622 + 'S');
    return {
      'value': _0x1ff622,
      'label': _0x3fecdf
    };
  })['filter'](Boolean);
}
function renderDurationPillField(_0xbc0a5e, _0x35a0f5) {
  const _0x4412fe = String(_0xbc0a5e?.['id'] || '')["trim"]();
  const _0x17410b = getFieldValue(_0x35a0f5, _0xbc0a5e);
  const _0xcf8237 = getDurationOptionEntries(_0xbc0a5e, _0x35a0f5);
  const _0x46959a = _0xcf8237['map'](_0x2ea3bb => _0x2ea3bb['value']);
  const _0x284121 = _0x46959a['length'] > 0x0;
  const _0x164cf2 = Number(_0xbc0a5e?.["min"] ?? 0x1);
  const _0x446b7f = Number(_0xbc0a5e?.["max"] ?? 0xf);
  const _0x10a2ea = Number(_0xbc0a5e?.["step"] ?? 0x1);
  const _0x488e0b = Number["isFinite"](Number(_0x17410b)) ? Number(_0x17410b) : Number(_0xbc0a5e?.["defaultValue"] ?? _0x164cf2);
  const _0x1e28e6 = Math["max"](0x0, findRangeValueIndex(_0x46959a, _0x488e0b));
  const _0x6ebb68 = _0x284121 ? 0x0 : _0x164cf2;
  const _0x1a23e2 = _0x284121 ? Math["max"](0x0, _0x46959a["length"] - 0x1) : _0x446b7f;
  const _0x46aa51 = _0x284121 ? 0x1 : _0x10a2ea;
  const _0x5ae5b2 = _0x284121 ? _0x1e28e6 : _0x488e0b;
  const _0x45cd7c = _0x284121 && _0xcf8237[_0x1e28e6]?.["label"] ? _0xcf8237[_0x1e28e6]['label'] : _0x488e0b + 'S';
  const _0x39f63e = _0x284121 ? _0xcf8237[0x0]?.["label"] : _0x164cf2 + 'S';
  const _0x4f13ca = _0x284121 ? _0xcf8237[_0xcf8237['length'] - 0x1]?.["label"] : _0x446b7f + 'S';
  const _0x12557c = _0x284121 ? " data-ui-schema-range-values=\"" + escapeHtmlAttr(_0x46959a['join'](',')) + '\x22' : '';
  const _0x3e401f = _0x284121 ? " data-ui-schema-range-labels=\"" + escapeHtmlAttr(JSON['stringify'](_0xcf8237["map"](_0x124c19 => _0x124c19["label"]))) + '\x22' : '';
  const _0x2a1525 = resolveFieldDisabled(_0xbc0a5e, _0x35a0f5) ? " disabled aria-disabled=\"true\" data-ui-schema-disabled=\"true\"" : '';
  return "<div class=\"ui-schema-field ui-schema-duration-pill\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x4412fe) + "\" data-ui-schema-adapter=\"field.durationPill.slider\" data-ui-schema-type=\"slider\" data-ui-schema-default=\"" + escapeHtmlAttr(_0xbc0a5e?.["defaultValue"] ?? '') + '\x22' + _0x12557c + _0x3e401f + ">\n    <button type=\"button\" class=\"img-pill-btn ui-schema-menu-trigger\" data-ui-schema-menu-trigger=\"" + escapeHtmlAttr(_0x4412fe) + '\x22' + _0x2a1525 + '>\x0a\x20\x20\x20\x20\x20\x20<span\x20class=\x22ui-schema-pill-label\x20ui-schema-duration-label\x22>' + escapeHtmlAttr(_0x45cd7c) + "</span>\n    </button>\n    <div class=\"floating-menu ui-schema-popup ui-schema-duration-pop\">\n      <div class=\"ui-schema-duration-title\">" + escapeHtmlAttr(manifestText(_0xbc0a5e?.["label"] || "视频时长")) + "</div>\n      <input type=\"range\" class=\"ui-schema-range ui-schema-duration-slider\" data-ui-schema-input=\"" + escapeHtmlAttr(_0x4412fe) + "\" min=\"" + escapeHtmlAttr(_0x6ebb68) + "\" max=\"" + escapeHtmlAttr(_0x1a23e2) + '\x22\x20step=\x22' + escapeHtmlAttr(_0x46aa51) + "\" value=\"" + escapeHtmlAttr(_0x5ae5b2) + "\">\n      <div class=\"ui-schema-duration-bounds\">\n        <span>" + escapeHtmlAttr(_0x39f63e) + "</span>\n        <span>" + escapeHtmlAttr(_0x4f13ca) + "</span>\n      </div>\n    </div>\n  </div>";
}
function renderInstanceToggleField(_0x2e525e, _0x141e8b) {
  return renderRunningHubInstanceControl(_0x2e525e, _0x141e8b, {
    'escapeHtmlAttr': escapeHtmlAttr,
    'getFieldValue': getFieldValue,
    'isOptionHidden': isOptionHidden,
    'manifestText': manifestText,
    'renderDropdownControl': renderDropdownControl
  });
}
const syncInstanceToggleField = syncRunningHubInstanceControl;
function syncStepperField(_0x4507af, _0x202685) {
  if (!_0x4507af?.['classList']?.["contains"]('ui-schema-rh-video-stepper')) {
    return;
  }
  const _0x2bf669 = Number(_0x4507af['dataset']['uiSchemaDefault'] ?? 0x0);
  const _0x1c8d40 = _0x4507af["dataset"]['uiSchemaMin'];
  const _0x5912c4 = _0x4507af["dataset"]["uiSchemaMax"];
  const _0x590311 = normalizeNumberValue(_0x202685, Number["isFinite"](_0x2bf669) ? _0x2bf669 : 0x0, {
    'min': _0x1c8d40 === undefined ? -Infinity : Number(_0x1c8d40),
    'max': _0x5912c4 === undefined ? Infinity : Number(_0x5912c4)
  });
  const _0x1afff0 = _0x4507af["querySelector"]('.rh-stepper-value');
  if (!_0x1afff0) {
    return;
  }
  const _0xf2782e = String(_0x4507af["dataset"]["uiSchemaField"] || '')["trim"]();
  _0x1afff0["textContent"] = _0xf2782e === 'rhVideoFrames' && _0x590311 === 0x0 ? t("aigenImage.uiSchema.fullLength") : String(_0x590311);
  _0x1afff0["setAttribute"]('aria-valuenow', String(_0x590311));
}
function renderSelect(_0x17ebca, _0x3c8c9f, _0x242f53 = {}) {
  const _0x37bb0f = getVisibleOptions(_0x17ebca, _0x242f53);
  return "<select class=\"ui-schema-select\" data-ui-schema-input=\"" + escapeHtmlAttr(_0x17ebca['id']) + "\">\n    " + _0x37bb0f["map"](_0x30ae65 => {
    const _0x39ec01 = String(_0x30ae65?.["value"] ?? '');
    const _0x165cad = String(_0x3c8c9f ?? '') === _0x39ec01 ? " selected" : '';
    return "<option value=\"" + escapeHtmlAttr(_0x39ec01) + '\x22' + _0x165cad + '>' + escapeHtmlAttr(_0x30ae65?.["label"] ?? _0x39ec01) + "</option>";
  })["join"]('') + "\n  </select>";
}
function renderRange(_0x238fa9, _0x1dbb5e, _0x19f03b, _0x934235 = {}) {
  const _0x3f6502 = getVisibleOptions(_0x238fa9, _0x934235);
  const _0x5bade0 = _0x3f6502["map"](_0x4f9cba => Number(_0x4f9cba?.["value"] ?? _0x4f9cba))["filter"](Number["isFinite"]);
  const _0xe2fd71 = Number(_0x238fa9?.["defaultValue"] ?? _0x5bade0[0x0] ?? 0x0);
  const _0x55852e = Number['isFinite'](Number(_0x1dbb5e)) ? Number(_0x1dbb5e) : _0xe2fd71;
  if (_0x19f03b === "stepper") {
    const _0x5c94e3 = _0x238fa9?.['ariaLabel'] ? manifestText(_0x238fa9['ariaLabel']) : t("aigenImage.uiSchema.numericValueAria", {
      'label': manifestText(_0x238fa9?.["label"] || _0x238fa9['id'])
    });
    return "<div class=\"rh-stepper\" data-key=\"" + escapeHtmlAttr(_0x238fa9['id']) + "\">\n      <div class=\"rh-stepper-value\" role=\"spinbutton\" aria-label=\"" + escapeHtmlAttr(_0x5c94e3) + "\" aria-valuenow=\"" + escapeHtmlAttr(_0x55852e) + "\" tabindex=\"0\">" + escapeHtmlAttr(_0x55852e) + '</div>\x0a\x20\x20\x20\x20</div>';
  }
  const _0x1727bf = Number(_0x238fa9?.["min"] ?? _0x5bade0[0x0] ?? 0x0);
  const _0x258ec7 = Number(_0x238fa9?.["max"] ?? _0x5bade0[_0x5bade0["length"] - 0x1] ?? _0x1727bf);
  const _0x4859b = Number(_0x238fa9?.['step'] ?? 0x1);
  return "<div class=\"ui-schema-range-line\">\n    <input class=\"ui-schema-range\" data-ui-schema-input=\"" + escapeHtmlAttr(_0x238fa9['id']) + '\x22\x20type=\x22range\x22\x20min=\x22' + escapeHtmlAttr(_0x1727bf) + "\" max=\"" + escapeHtmlAttr(_0x258ec7) + "\" step=\"" + escapeHtmlAttr(_0x4859b) + "\" value=\"" + escapeHtmlAttr(_0x55852e) + '\x22>\x0a\x20\x20\x20\x20<span\x20class=\x22ui-schema-value\x22>' + escapeHtmlAttr(_0x55852e) + '</span>\x0a\x20\x20</div>';
}
function renderStepperAttrs(_0x30c016, _0x3d7bea) {
  if (_0x3d7bea !== "stepper") {
    return '';
  }
  const _0x393454 = [];
  const _0x59d07a = String(_0x30c016?.["valueType"] || _0x30c016?.["numberMode"] || '')["trim"]()["toLowerCase"]();
  _0x30c016?.['min'] !== undefined && _0x30c016?.["min"] !== null && _0x393454["push"](" data-ui-schema-min=\"" + escapeHtmlAttr(_0x30c016["min"]) + '\x22');
  _0x30c016?.["max"] !== undefined && _0x30c016?.["max"] !== null && _0x393454['push']('\x20data-ui-schema-max=\x22' + escapeHtmlAttr(_0x30c016["max"]) + '\x22');
  _0x393454["push"](" data-ui-schema-step=\"" + escapeHtmlAttr(_0x30c016?.["step"] ?? 0x1) + '\x22');
  (_0x59d07a === "float" || _0x59d07a === "decimal") && _0x393454["push"](" data-ui-schema-number-mode=\"float\"");
  return _0x393454["join"]('');
}
function renderTextInput(_0x3d14b4, _0x49d969, _0x530277, _0x5a3f58) {
  const _0x229895 = _0x5a3f58 ? resolveFieldDisabled(_0x3d14b4, _0x5a3f58) : isFieldDisabled(_0x3d14b4);
  const _0x3235af = _0x229895 ? " disabled" : '';
  if (_0x530277 === "textarea") {
    return "<textarea class=\"ui-schema-textarea\" data-ui-schema-input=\"" + escapeHtmlAttr(_0x3d14b4['id']) + '\x22' + _0x3235af + '>' + escapeHtmlAttr(_0x49d969) + "</textarea>";
  }
  return "<input class=\"ui-schema-text\" data-ui-schema-input=\"" + escapeHtmlAttr(_0x3d14b4['id']) + "\" type=\"text\" value=\"" + escapeHtmlAttr(_0x49d969) + '\x22' + _0x3235af + '>';
}
function renderAssetInput(_0x3a4fac, _0x501eca) {
  const _0x1d8e37 = _0x501eca === 'video\x20input' ? t("aigenImage.uiSchema.assetInput.video") : _0x501eca === 'audio\x20input' ? t('aigenImage.uiSchema.assetInput.audio') : t("aigenImage.uiSchema.assetInput.image");
  return "<button type=\"button\" class=\"img-rp-quality-item ui-schema-asset-input\" data-ui-schema-input=\"" + escapeHtmlAttr(_0x3a4fac['id']) + "\" data-ui-schema-asset-kind=\"" + escapeHtmlAttr(_0x501eca["split"]('\x20')[0x0]) + '\x22>' + _0x1d8e37 + "</button>";
}
function renderAdvancedRowField(_0x4cab16, _0x1bf7dd) {
  assertSupportedField(_0x4cab16);
  const _0x1db3d1 = String(_0x4cab16?.['id'] || '')["trim"]();
  const _0x18aac3 = normalizeControlType(_0x4cab16?.["type"]);
  const _0x49f05f = String(_0x4cab16?.["variant"] || '')["trim"]()["toLowerCase"]();
  if (_0x49f05f === "randomseedrow") {
    return renderRandomSeedRowField(_0x4cab16, _0x1bf7dd);
  }
  const _0x3f9df4 = getFieldValue(_0x1bf7dd, _0x4cab16);
  const _0x29ad60 = manifestText(_0x4cab16?.['label'] || _0x1db3d1);
  const _0x1f15d2 = manifestText(_0x4cab16?.["description"] || _0x4cab16?.['tooltip'] || '')["trim"]();
  const _0x59a800 = _0x1f15d2 ? "<span class=\"rh-tip ui-schema-info-tip\" data-tooltip=\"" + escapeHtmlAttr(_0x1f15d2) + "\">!</span>" : '';
  const _0x2c805a = String(_0x4cab16?.['helpUrl'] || '')["trim"]();
  const _0x2cbda5 = _0x2c805a ? "<a href=\"#\" class=\"ui-schema-help-link\" data-ui-schema-field-help-url=\"" + escapeHtmlAttr(_0x2c805a) + "\" title=\"打开相关页面\" onclick=\"return false;\"><svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"/><polyline points=\"15 3 21 3 21 9\"/><line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"3\"/></svg></a>" : '';
  const _0x3a0ff4 = typeof _0x4cab16?.["defaultValue"] === "boolean" ? '\x20data-ui-schema-value-type=\x22boolean\x22' : _0x18aac3 === "stepper" ? " data-ui-schema-value-type=\"number\"" : '';
  const _0x3d2166 = _0x18aac3 === "stepper" ? '\x20ui-schema-rh-video-stepper' : '';
  const _0x2af245 = resolveFieldDisabled(_0x4cab16, _0x1bf7dd) ? " is-rh-disabled" : '';
  let _0x16cba9;
  _0x18aac3 === "select" || _0x49f05f === "pillmenu" && _0x18aac3 === "segmented" ? _0x16cba9 = renderDropdownControl(_0x4cab16, _0x3f9df4, _0x1bf7dd, {
    'advanced': !![]
  }) : _0x16cba9 = renderControl(_0x4cab16, _0x3f9df4, _0x18aac3, {
    'advanced': !![],
    'nodeData': _0x1bf7dd
  });
  return '<div\x20class=\x22ui-schema-field\x20rh-vram-adv-row' + _0x3d2166 + _0x2af245 + '\x22\x20data-ui-schema-field=\x22' + escapeHtmlAttr(_0x1db3d1) + "\" data-ui-schema-type=\"" + escapeHtmlAttr(_0x18aac3) + "\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x4cab16?.["defaultValue"] ?? '') + '\x22' + getFieldDefaultAliasAttrs(_0x4cab16) + _0x3a0ff4 + renderStepperAttrs(_0x4cab16, _0x18aac3) + ">\n    <div class=\"rh-vram-adv-label\">\n      <span class=\"rh-adv-title ui-schema-field-label\">" + escapeHtmlAttr(_0x29ad60) + '</span>\x0a\x20\x20\x20\x20\x20\x20' + _0x59a800 + "\n      " + _0x2cbda5 + "\n    </div>\n    <div class=\"rh-adv-control-line\">" + _0x16cba9 + "</div>\n  </div>";
}
function getRandomSeedAttrs(_0x55cc12) {
  const _0x2d70ca = Number['isFinite'](Number(_0x55cc12?.["randomSeedMin"])) ? Math["trunc"](Number(_0x55cc12["randomSeedMin"])) : RANDOM_SEED_DEFAULT_MIN;
  const _0x1d5f72 = Number['isFinite'](Number(_0x55cc12?.["randomSeedMax"])) ? Math["trunc"](Number(_0x55cc12['randomSeedMax'])) : RANDOM_SEED_DEFAULT_MAX;
  const _0x259752 = Math['min'](_0x2d70ca, _0x1d5f72);
  const _0x17e8dc = Math["max"](_0x2d70ca, _0x1d5f72);
  const _0x5a906f = String(_0x55cc12?.["randomSeedModeField"] || '')["trim"]();
  const _0x512ec7 = String(_0x55cc12?.["randomSeedDefaultMode"] || 'fixed')["trim"]() || "fixed";
  const _0x2c4e93 = _0x5a906f ? " data-ui-schema-random-seed-mode-field=\"" + escapeHtmlAttr(_0x5a906f) + "\" data-ui-schema-random-seed-mode-default=\"" + escapeHtmlAttr(_0x512ec7) + '\x22' : '';
  return " data-ui-schema-random-seed-min=\"" + escapeHtmlAttr(_0x259752) + "\" data-ui-schema-random-seed-max=\"" + escapeHtmlAttr(_0x17e8dc) + '\x22' + _0x2c4e93;
}
function getRandomSeedModeFromNodeData(_0x1e7f83, _0x38f867) {
  const _0x149bf4 = String(_0x38f867?.['randomSeedModeField'] || '')["trim"]();
  return resolveRandomSeedModeFromNodeData(_0x1e7f83, {
    'seedField': String(_0x38f867?.['id'] || 'seed')["trim"]() || "seed",
    'modeField': _0x149bf4,
    'defaultMode': _0x38f867?.["randomSeedDefaultMode"] || "fixed"
  })['mode'];
}
function renderRandomSeedModeButtons(_0x16f185, _0x71a709, _0x8ffefb) {
  const _0x3b0529 = String(_0x16f185?.["randomSeedModeField"] || '')["trim"]();
  const _0x3a830d = t("aigenImage.uiSchema.random");
  const _0x31021d = t("aigenImage.uiSchema.fixed");
  if (!_0x3b0529) {
    return '<button\x20type=\x22button\x22\x20class=\x22img-rp-quality-item\x20ui-schema-random-seed-btn\x22\x20data-ui-schema-random-seed=\x22true\x22\x20aria-label=\x22' + escapeHtmlAttr(t("aigenImage.uiSchema.randomAria", {
      'label': _0x8ffefb
    })) + '\x22>' + escapeHtmlAttr(_0x3a830d) + "</button>";
  }
  const _0x894c1c = [{
    'value': "random",
    'label': _0x3a830d
  }, {
    'value': 'fixed',
    'label': _0x31021d
  }];
  return _0x894c1c['map'](_0xd5e10a => "<button type=\"button\" class=\"img-rp-quality-item ui-schema-random-seed-mode-btn " + (_0x71a709 === _0xd5e10a['value'] ? "active" : '') + "\" data-ui-schema-random-seed-mode=\"" + escapeHtmlAttr(_0xd5e10a["value"]) + '\x22\x20data-ui-schema-random-seed-mode-field=\x22' + escapeHtmlAttr(_0x3b0529) + '\x22\x20aria-label=\x22' + escapeHtmlAttr('' + _0x8ffefb + _0xd5e10a["label"]) + '\x22>' + escapeHtmlAttr(_0xd5e10a["label"]) + "</button>")["join"]('');
}
function syncRandomSeedField(_0x1942af, _0x5153c4 = {}) {
  if (!_0x1942af?.["classList"]?.["contains"]?.('ui-schema-random-seed-row')) {
    return;
  }
  const _0x56ff4d = String(_0x1942af["dataset"]["uiSchemaRandomSeedModeField"] || '')["trim"]();
  if (!_0x56ff4d) {
    return;
  }
  const _0x935337 = resolveRandomSeedModeFromNodeData(_0x5153c4, {
    'seedField': String(_0x1942af['dataset']["uiSchemaField"] || "seed")['trim']() || "seed",
    'modeField': _0x56ff4d,
    'defaultMode': _0x1942af["dataset"]["uiSchemaRandomSeedModeDefault"] || "fixed"
  })["mode"];
  _0x1942af["querySelectorAll"]('[data-ui-schema-random-seed-mode]')["forEach"](_0x1fca18 => {
    _0x1fca18["classList"]["toggle"]("active", String(_0x1fca18['dataset']['uiSchemaRandomSeedMode'] || '') === _0x935337);
  });
}
function syncDurationPillField(_0x14d34a, _0x2fd5ec) {
  if (!_0x14d34a?.["classList"]?.['contains']("ui-schema-duration-pill")) {
    return;
  }
  const _0x3b59e4 = _0x14d34a["querySelector"](".ui-schema-duration-label");
  if (!_0x3b59e4) {
    return;
  }
  _0x3b59e4["textContent"] = getRangeValueDisplayLabel(_0x14d34a, _0x2fd5ec, _0x2fd5ec + 'S');
}
function syncResolutionPillField(_0x45dc7d, _0x10c819) {
  if (!_0x45dc7d?.['classList']?.["contains"]('ui-schema-resolution-pill')) {
    return;
  }
  const _0x3ef41f = _0x45dc7d["querySelector"]('.ui-schema-pill-label');
  const _0x4ac7c0 = _0x3ef41f?.["querySelector"](".ui-schema-resolution-value");
  if (_0x4ac7c0) {
    _0x4ac7c0["textContent"] = String(_0x10c819);
    return;
  }
  const _0x605dce = _0x45dc7d["querySelector"](".rh-res-title")?.["textContent"] || "Resolution";
  if (_0x3ef41f) {
    _0x3ef41f["textContent"] = _0x605dce + '\x20' + _0x10c819;
  }
}
function renderRandomSeedRowField(_0x258915, _0x435d23) {
  assertSupportedField(_0x258915);
  const _0x548e07 = String(_0x258915?.['id'] || '')["trim"]();
  const _0x5a78b0 = normalizeControlType(_0x258915?.["type"]);
  const _0x2c5c6a = getFieldValue(_0x435d23, _0x258915);
  const _0x4f23aa = getRandomSeedModeFromNodeData(_0x435d23, _0x258915);
  const _0xc36238 = manifestText(_0x258915?.["label"] || _0x548e07);
  const _0x3c161a = manifestText(_0x258915?.["description"] || _0x258915?.["tooltip"] || '')["trim"]();
  const _0x1a4f8a = _0x3c161a ? "<span class=\"rh-tip ui-schema-info-tip\" data-tooltip=\"" + escapeHtmlAttr(_0x3c161a) + "\">!</span>" : '';
  const _0xefe6e2 = _0x5a78b0 === "stepper" ? " data-ui-schema-value-type=\"number\"" : '';
  const _0x16620a = _0x5a78b0 === "stepper" ? '\x20ui-schema-rh-video-stepper' : '';
  const _0x32eb23 = String(_0x258915?.["randomSeedModeField"] || '')["trim"]() ? " ui-schema-random-seed-row-has-mode" : '';
  return "<div class=\"ui-schema-field rh-vram-adv-row ui-schema-random-seed-row" + _0x32eb23 + _0x16620a + "\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x548e07) + "\" data-ui-schema-adapter=\"field.randomSeedRow\" data-ui-schema-type=\"" + escapeHtmlAttr(_0x5a78b0) + "\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x258915?.["defaultValue"] ?? '') + '\x22' + getFieldDefaultAliasAttrs(_0x258915) + _0xefe6e2 + renderStepperAttrs(_0x258915, _0x5a78b0) + getRandomSeedAttrs(_0x258915) + ">\n    <div class=\"rh-vram-adv-label\">\n      <span class=\"rh-adv-title ui-schema-field-label\">" + escapeHtmlAttr(_0xc36238) + "</span>\n      " + _0x1a4f8a + "\n    </div>\n    <div class=\"rh-adv-control-line\">\n      " + renderRandomSeedModeButtons(_0x258915, _0x4f23aa, _0xc36238) + "\n      " + renderControl(_0x258915, _0x2c5c6a, _0x5a78b0, {
    'advanced': !![],
    'nodeData': _0x435d23
  }) + '\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</div>';
}
function normalizeRhV54SinglePreset(_0x511a0b, _0x417499 = 'efficiency') {
  const _0x135073 = String(_0x511a0b ?? '')["trim"]();
  return _0x135073 === "efficiency" || _0x135073 === "stable" || _0x135073 === "quality" ? _0x135073 : _0x417499;
}
function normalizeRhV54SpecialMode(_0x4dfd07) {
  const _0x54bf52 = String(_0x4dfd07 ?? '')["trim"]();
  return _0x54bf52 === "longVideoOverlay" || _0x54bf52 === "cameraMove" ? _0x54bf52 : '';
}
function normalizeRhV54MaskExpand(_0x34207c, _0x5cc57b = 0x19) {
  const _0x5831e3 = Number(_0x34207c);
  return Number["isFinite"](_0x5831e3) ? Math['max'](-0x270f, Math["min"](0x270f, Math["trunc"](_0x5831e3))) : _0x5cc57b;
}
function getStepPrecision(_0x5001f4) {
  const _0x32d6ca = String(_0x5001f4 ?? '');
  const _0x1fdc69 = _0x32d6ca["includes"]('.') ? _0x32d6ca["split"]('.')[0x1] : '';
  return Math['min'](Math['max'](_0x1fdc69['length'], 0x0), 0x8);
}
function normalizeRhV54BreastJiggle(_0x485aaa, {
  min = 0x0,
  max = 0x1,
  step = 0.05,
  fallback = 0x0
} = {}) {
  const _0x10f6c5 = Number(_0x485aaa);
  const _0x24a7f5 = Number(fallback);
  const _0x532e6a = Number(min);
  const _0x10e43a = Number(max);
  const _0x4589ab = Number(step);
  const _0x65cb44 = Number["isFinite"](_0x532e6a) ? _0x532e6a : 0x0;
  const _0x4aab44 = Number["isFinite"](_0x10e43a) ? _0x10e43a : 0x1;
  const _0x382654 = Number["isFinite"](_0x24a7f5) ? _0x24a7f5 : _0x65cb44;
  const _0x4f0dc0 = Math["max"](Math["min"](_0x65cb44, _0x4aab44), Math["min"](Math['max'](_0x65cb44, _0x4aab44), Number['isFinite'](_0x10f6c5) ? _0x10f6c5 : _0x382654));
  if (!Number["isFinite"](_0x4589ab) || _0x4589ab <= 0x0) {
    return _0x4f0dc0;
  }
  const _0x527de1 = _0x65cb44 + Math['round']((_0x4f0dc0 - _0x65cb44) / _0x4589ab) * _0x4589ab;
  return Math["max"](Math["min"](_0x65cb44, _0x4aab44), Math["min"](Math["max"](_0x65cb44, _0x4aab44), _0x527de1));
}
function formatRhV54BreastJiggle(_0x1240b9, _0x4c5935 = {}) {
  const _0x568e34 = normalizeRhV54BreastJiggle(_0x1240b9, _0x4c5935);
  return String(Number(_0x568e34['toFixed'](getStepPrecision(_0x4c5935["step"] ?? 0.05))));
}
function getRhV54BreastJiggleRangeFromFieldEl(_0x3c8e06) {
  const _0x4b0582 = Number(_0x3c8e06?.["dataset"]?.["uiSchemaMin"] ?? 0x0);
  const _0x50bfd7 = Number(_0x3c8e06?.["dataset"]?.["uiSchemaMax"] ?? 0x1);
  const _0x29c0da = Number(_0x3c8e06?.['dataset']?.["uiSchemaStep"] ?? 0.05);
  const _0x328e2b = Number(_0x3c8e06?.["dataset"]?.["uiSchemaDefault"] ?? _0x4b0582);
  return {
    'min': _0x4b0582,
    'max': _0x50bfd7,
    'step': _0x29c0da,
    'fallback': _0x328e2b
  };
}
function renderRhV54FieldLabel(_0x4ad30a) {
  const _0xdf4db3 = String(_0x4ad30a?.['id'] || '')["trim"]();
  const _0xdb4c64 = manifestText(_0x4ad30a?.["label"] || _0xdf4db3);
  const _0x22be20 = manifestText(_0x4ad30a?.['description'] || _0x4ad30a?.["tooltip"] || '')["trim"]();
  const _0x14c7da = _0x22be20 ? "<span class=\"rh-tip ui-schema-info-tip\" data-tooltip=\"" + escapeHtmlAttr(_0x22be20) + "\">!</span>" : '';
  return "<div class=\"rh-vram-adv-label\"><span>" + escapeHtmlAttr(_0xdb4c64) + "</span>" + _0x14c7da + '</div>';
}
function renderRhV54SegmentButton({
  key: _0x3f0faf,
  value: _0x1d4227,
  label: _0x576adb,
  active: _0x28161e,
  disabled = ![],
  attrs = ''
}) {
  const _0xd8fb93 = attrs || (disabled ? " disabled aria-disabled=\"true\" data-ui-schema-disabled=\"true\"" : '');
  const _0x2996a9 = ['img-rp-quality-item', 'rh-adv-seg-btn', _0x28161e ? 'active' : '', disabled ? "disabled" : '']["filter"](Boolean)["join"]('\x20');
  return '<button\x20type=\x22button\x22\x20class=\x22' + _0x2996a9 + "\" data-key=\"" + escapeHtmlAttr(_0x3f0faf) + "\" data-value=\"" + escapeHtmlAttr(_0x1d4227) + "\" data-ui-schema-value=\"" + escapeHtmlAttr(_0x1d4227) + '\x22' + _0xd8fb93 + '>' + escapeHtmlAttr(_0x576adb) + '</button>';
}
function renderAdvancedSelectionControl(_0x1c99f7, _0x332649, _0x401362 = {}) {
  const _0x550902 = String(_0x1c99f7?.['id'] || '')["trim"]();
  const _0x56a4c6 = normalizeControlType(_0x1c99f7?.["type"]);
  const _0x5a3b98 = [Object["freeze"]({
    'value': !![],
    'label': t("aigenImage.uiSchema.yes")
  }), Object["freeze"]({
    'value': ![],
    'label': t("aigenImage.uiSchema.no")
  })];
  const _0x3c0d12 = _0x56a4c6 === "toggle" && !Array["isArray"](_0x1c99f7?.["options"]) ? _0x5a3b98 : getVisibleOptions(_0x1c99f7, _0x401362);
  const _0xd23cbf = _0x3c0d12["length"] ? _0x3c0d12 : _0x5a3b98;
  return '<div\x20class=\x22img-rp-quality-segmented\x20rh-adv-seg\x22>\x0a\x20\x20\x20\x20\x20\x20' + _0xd23cbf['map'](_0x1ec67d => {
    const _0x209bce = getOptionValue(_0x1ec67d);
    const _0x8a58a3 = manifestText(_0x1ec67d?.["label"] ?? _0x209bce);
    const _0x374296 = String(_0x332649 ?? '') === _0x209bce;
    const _0x571ea4 = isOptionDisabled(_0x1c99f7, _0x1ec67d, _0x401362);
    return renderRhV54SegmentButton({
      'key': _0x550902,
      'value': _0x209bce,
      'label': _0x8a58a3,
      'active': _0x374296,
      'disabled': _0x571ea4,
      'attrs': getOptionDisabledAttrs(_0x1c99f7, _0x1ec67d, {
        'nodeData': _0x401362
      })
    });
  })["join"]('') + "\n    </div>";
}
function renderRhV54ControlModeField(_0x5aee7e, _0x48dc2b) {
  assertSupportedField(_0x5aee7e);
  const _0x234ca8 = String(_0x5aee7e?.['id'] || '')["trim"]();
  const _0x1a7c09 = String(getNodeFieldValue(_0x48dc2b, "rhControlMode", "single") || "single");
  const _0x3794f3 = normalizeRhV54SinglePreset(getNodeFieldValue(_0x48dc2b, "rhSingleControlPreset", _0x5aee7e?.["defaultValue"]), String(_0x5aee7e?.["defaultValue"] || "efficiency"));
  const _0x1799e2 = _0x1a7c09 === "multi" ? 'multi' : _0x3794f3;
  return "<div class=\"ui-schema-field rh-vram-adv-row ui-schema-rh-v54-control-mode\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x234ca8) + "\" data-ui-schema-type=\"segmented\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x5aee7e?.["defaultValue"] ?? '') + "\">\n    " + renderRhV54FieldLabel(_0x5aee7e) + "\n    <div class=\"rh-adv-control-line\">\n      <div class=\"rh-adv-single-group " + (_0x1a7c09 !== "multi" ? "active" : '') + "\">\n        <span class=\"rh-adv-single-title\">" + escapeHtmlAttr(t('aigenImage.uiSchema.singleControl')) + "</span>\n        <span class=\"rh-adv-single-colon\" aria-hidden=\"true\">" + escapeHtmlAttr(t("aigenImage.uiSchema.controlColon")) + "</span>\n        <div class=\"img-rp-quality-segmented rh-adv-seg rh-adv-control-seg\">\n          " + renderRhV54SegmentButton({
    'key': "rhSingleControlPreset",
    'value': "efficiency",
    'label': t('aigenImage.uiSchema.efficiency'),
    'active': _0x1799e2 === 'efficiency'
  }) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + renderRhV54SegmentButton({
    'key': "rhSingleControlPreset",
    'value': "stable",
    'label': t("aigenImage.uiSchema.stable"),
    'active': _0x1799e2 === "stable"
  }) + "\n        </div>\n      </div>\n      <span class=\"rh-adv-control-split\" aria-hidden=\"true\"></span>\n      <div class=\"rh-adv-multi-group " + (_0x1a7c09 === 'multi' ? 'active' : '') + "\">\n        " + renderRhV54SegmentButton({
    'key': "rhControlMode",
    'value': "multi",
    'label': t('aigenImage.uiSchema.multiControl'),
    'active': _0x1799e2 === "multi"
  }) + "\n      </div>\n    </div>\n  </div>";
}
function renderRhV54BooleanRowField(_0x38f078, _0x13a3b9) {
  assertSupportedField(_0x38f078);
  const _0x35f353 = String(_0x38f078?.['id'] || '')["trim"]();
  const _0x34eb74 = _0x38f078?.["disableWhenSpecialMode"] === "cameraMove" && normalizeRhV54SpecialMode(getNodeFieldValue(_0x13a3b9, 'rhSpecialMode', '')) === "cameraMove";
  const _0x88c1fc = _0x35f353 === "rhSubtractSubject" && _0x13a3b9?.["rhV54HasMaskVideo"] === !![];
  const _0x415b4c = _0x88c1fc ? ![] : getNodeFieldValue(_0x13a3b9, _0x35f353, _0x38f078?.["defaultValue"]) === !![];
  return '<div\x20class=\x22ui-schema-field\x20rh-vram-adv-row\x20ui-schema-rh-v54-boolean-row\x20' + (_0x34eb74 || _0x88c1fc ? "is-rh-disabled" : '') + "\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x35f353) + "\" data-ui-schema-type=\"segmented\" data-ui-schema-value-type=\"boolean\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x38f078?.["defaultValue"] ?? '') + '\x22' + (_0x38f078?.['disableWhenSpecialMode'] ? " data-rh-v54-disable-on-special=\"" + escapeHtmlAttr(_0x38f078['disableWhenSpecialMode']) + '\x22' : '') + (_0x88c1fc ? '\x20data-rh-v54-disable-on-mask-video=\x22true\x22' : '') + '>\x0a\x20\x20\x20\x20' + renderRhV54FieldLabel(_0x38f078) + "\n    <div class=\"img-rp-quality-segmented rh-adv-seg\">\n      " + renderRhV54SegmentButton({
    'key': _0x35f353,
    'value': "true",
    'label': t("aigenImage.uiSchema.yes"),
    'active': _0x415b4c
  }) + '\x0a\x20\x20\x20\x20\x20\x20' + renderRhV54SegmentButton({
    'key': _0x35f353,
    'value': 'false',
    'label': t("aigenImage.uiSchema.no"),
    'active': !_0x415b4c
  }) + '\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</div>';
}
function renderRhV54MaskExpandField(_0x58790b, _0x398b01) {
  assertSupportedField(_0x58790b);
  const _0x1cc21a = String(_0x58790b?.['id'] || '')["trim"]();
  const _0x36d7bf = getNodeFieldValue(_0x398b01, _0x1cc21a, _0x58790b?.["defaultValue"] ?? 0x19);
  const _0x3b1b7c = normalizeRhV54MaskExpand(_0x36d7bf, Number(_0x58790b?.["defaultValue"] ?? 0x19));
  const _0x5938ab = _0x58790b?.['ariaLabel'] ? manifestText(_0x58790b["ariaLabel"]) : t("aigenImage.uiSchema.numericValueAria", {
    'label': manifestText(_0x58790b?.["label"] || _0x1cc21a)
  });
  const _0x2fa813 = _0x58790b?.['disableWhenSpecialMode'] === 'cameraMove' && normalizeRhV54SpecialMode(getNodeFieldValue(_0x398b01, "rhSpecialMode", '')) === "cameraMove";
  return "<div class=\"ui-schema-field rh-vram-adv-row ui-schema-rh-v54-mask-expand " + (_0x2fa813 ? 'is-rh-disabled' : '') + "\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x1cc21a) + "\" data-ui-schema-type=\"stepper\" data-ui-schema-value-type=\"number\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x58790b?.["defaultValue"] ?? '') + '\x22\x20data-ui-schema-min=\x22' + escapeHtmlAttr(_0x58790b?.["min"] ?? -0x270f) + '\x22\x20data-ui-schema-max=\x22' + escapeHtmlAttr(_0x58790b?.['max'] ?? 0x270f) + "\" data-ui-schema-step=\"" + escapeHtmlAttr(_0x58790b?.["step"] ?? 0x1) + '\x22' + (_0x58790b?.['disableWhenSpecialMode'] ? " data-rh-v54-disable-on-special=\"" + escapeHtmlAttr(_0x58790b['disableWhenSpecialMode']) + '\x22' : '') + ">\n    " + renderRhV54FieldLabel(_0x58790b) + '\x0a\x20\x20\x20\x20<div\x20class=\x22rh-stepper\x22\x20data-key=\x22' + escapeHtmlAttr(_0x1cc21a) + '\x22>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-stepper-value\x22\x20role=\x22spinbutton\x22\x20aria-label=\x22' + escapeHtmlAttr(_0x5938ab) + '\x22\x20aria-valuenow=\x22' + escapeHtmlAttr(_0x3b1b7c) + "\" tabindex=\"0\">" + escapeHtmlAttr(_0x3b1b7c) + '</div>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</div>';
}
function renderRhV54SpecialModeField(_0x2a0aab, _0x161d2e) {
  assertSupportedField(_0x2a0aab);
  const _0x41ad0a = String(_0x2a0aab?.['id'] || '')['trim']();
  const _0x33d15d = normalizeRhV54SpecialMode(getNodeFieldValue(_0x161d2e, _0x41ad0a, ''));
  const _0x599b50 = getRenderableOptions(_0x2a0aab)["filter"](_0x13fa1a => _0x13fa1a?.['hidden'] !== !![]);
  return "<div class=\"ui-schema-field rh-vram-adv-row ui-schema-rh-v54-special-mode\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x41ad0a) + '\x22\x20data-ui-schema-type=\x22segmented\x22\x20data-ui-schema-default=\x22' + escapeHtmlAttr(_0x2a0aab?.["defaultValue"] ?? '') + "\">\n    " + renderRhV54FieldLabel(_0x2a0aab) + "\n    <div class=\"img-rp-quality-segmented rh-adv-seg\">\n      " + _0x599b50['map'](_0x275bef => {
    const _0x111d99 = getOptionValue(_0x275bef);
    return renderRhV54SegmentButton({
      'key': _0x41ad0a,
      'value': _0x111d99,
      'label': manifestText(_0x275bef?.["label"] ?? _0x111d99),
      'active': _0x33d15d === _0x111d99
    });
  })["join"]('') + '\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</div>';
}
function renderRhV54BreastJiggleField(_0x4fd9dc, _0x74659f) {
  assertSupportedField(_0x4fd9dc);
  const _0x51490a = String(_0x4fd9dc?.['id'] || '')["trim"]();
  const _0x48a65d = Number(_0x4fd9dc?.['min'] ?? 0x0);
  const _0x826b49 = Number(_0x4fd9dc?.['max'] ?? 0x1);
  const _0x3bb01b = Number(_0x4fd9dc?.['step'] ?? 0.05);
  const _0x2a1ecd = Number(_0x4fd9dc?.["defaultValue"] ?? _0x48a65d);
  const _0x425bad = formatRhV54BreastJiggle(getNodeFieldValue(_0x74659f, _0x51490a, _0x4fd9dc?.["defaultValue"] ?? 0x0), {
    'min': _0x48a65d,
    'max': _0x826b49,
    'step': _0x3bb01b,
    'fallback': _0x2a1ecd
  });
  return '<div\x20class=\x22ui-schema-field\x20rh-vram-adv-row\x20rh-breast-jiggle-row\x20ui-schema-rh-v54-breast-jiggle\x22\x20data-ui-schema-field=\x22' + escapeHtmlAttr(_0x51490a) + "\" data-ui-schema-type=\"slider\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x4fd9dc?.['defaultValue'] ?? '') + "\" data-ui-schema-min=\"" + escapeHtmlAttr(_0x48a65d) + '\x22\x20data-ui-schema-max=\x22' + escapeHtmlAttr(_0x826b49) + "\" data-ui-schema-step=\"" + escapeHtmlAttr(_0x3bb01b) + "\">\n    " + renderRhV54FieldLabel(_0x4fd9dc) + '\x0a\x20\x20\x20\x20<div\x20class=\x22rh-breast-jiggle-control\x22>\x0a\x20\x20\x20\x20\x20\x20<input\x20type=\x22range\x22\x20class=\x22rh-breast-jiggle-slider\x22\x20data-ui-schema-input=\x22' + escapeHtmlAttr(_0x51490a) + "\" min=\"" + escapeHtmlAttr(_0x48a65d) + "\" max=\"" + escapeHtmlAttr(_0x826b49) + "\" step=\"" + escapeHtmlAttr(_0x3bb01b) + "\" value=\"" + escapeHtmlAttr(_0x425bad) + '\x22\x20aria-label=\x22' + escapeHtmlAttr(manifestText(_0x4fd9dc?.["ariaLabel"] || _0x4fd9dc?.["label"] || _0x51490a)) + "\">\n      <span class=\"rh-breast-jiggle-value\">" + escapeHtmlAttr(_0x425bad) + "</span>\n    </div>\n  </div>";
}
function formatRhAiAppFooterParamLabel(_0xb1dfc5, _0x2ad6c4) {
  const _0x4a70df = String(_0xb1dfc5?.['dataset']?.["uiSchemaFooterLabel"] || _0xb1dfc5?.["dataset"]?.["uiSchemaField"] || '参数')["trim"]();
  const _0x57a271 = String(_0xb1dfc5?.["dataset"]?.['uiSchemaType'] || '')["trim"]();
  const _0x535004 = formatRhAiAppFooterParamValue(_0x57a271, _0x2ad6c4);
  return _0x535004 ? _0x4a70df + '\x20·\x20' + _0x535004 : _0x4a70df;
}
function isRhAiAppFooterToggleOn(_0x51442a) {
  if (_0x51442a === !![]) {
    return !![];
  }
  if (_0x51442a === ![]) {
    return ![];
  }
  const _0x37543a = String(_0x51442a ?? '')['trim']()['toLowerCase']();
  return ["true", '1', "yes", 'on']["includes"](_0x37543a);
}
function syncRhAiAppFooterParamField(_0x47f7c6, _0x259c81) {
  if (!_0x47f7c6?.["classList"]?.['contains']("ui-schema-rh-aiapp-footer-param")) {
    return;
  }
  const _0xaeb406 = _0x47f7c6['querySelector']("[data-ui-schema-rh-aiapp-footer-toggle]");
  if (_0xaeb406) {
    const _0xd2ad6d = isRhAiAppFooterToggleOn(_0x259c81);
    _0xaeb406['dataset']['uiSchemaValue'] = _0xd2ad6d ? 'false' : "true";
    _0xaeb406["setAttribute"]("aria-pressed", String(_0xd2ad6d));
    const _0x2bfd7e = _0xaeb406["querySelector"](".ui-schema-rh-aiapp-footer-value");
    if (_0x2bfd7e) {
      _0x2bfd7e["textContent"] = formatRhAiAppFooterParamValue("toggle", _0xd2ad6d);
    }
    const _0x5f4ca3 = _0xaeb406['querySelector'](".ui-schema-pill-label");
    _0x5f4ca3 && (_0x5f4ca3["textContent"] = String(_0x47f7c6?.["dataset"]?.["uiSchemaFooterLabel"] || _0x47f7c6?.["dataset"]?.["uiSchemaField"] || '参数')['trim']());
    return;
  }
  const _0x5347c4 = _0x47f7c6['querySelector'](".ui-schema-pill-label");
  if (!_0x5347c4) {
    return;
  }
  _0x5347c4["textContent"] = formatRhAiAppFooterParamLabel(_0x47f7c6, _0x259c81);
}
function formatRhAiAppFooterParamValue(_0x2d7e54, _0x1a70a2) {
  if (_0x2d7e54 === "toggle") {
    return isRhAiAppFooterToggleOn(_0x1a70a2) ? '是' : '否';
  }
  return String(_0x1a70a2 ?? '')["trim"]();
}
function renderRhAiAppFooterDirectNumberField({
  field: _0x20f942,
  id: _0x50ecc5,
  type: _0x6472e1,
  value: _0x480e2b,
  label: _0x518894,
  defaultValue: _0x42f95a,
  valueTypeAttr: _0x3ed651,
  nodeData: _0x109d2e
}) {
  const _0xcb3b90 = String(_0x20f942?.["valueType"] || _0x20f942?.["numberMode"] || '')['trim']()["toLowerCase"]();
  const _0x5b2845 = _0xcb3b90 === 'float' || _0xcb3b90 === "decimal" ? "decimal" : "numeric";
  const _0x374112 = [];
  _0x20f942?.["min"] !== undefined && _0x20f942?.["min"] !== null && _0x374112["push"]('\x20min=\x22' + escapeHtmlAttr(_0x20f942['min']) + '\x22');
  _0x20f942?.["max"] !== undefined && _0x20f942?.["max"] !== null && _0x374112["push"](" max=\"" + escapeHtmlAttr(_0x20f942['max']) + '\x22');
  _0x374112["push"](" step=\"" + escapeHtmlAttr(_0x20f942?.['step'] ?? (_0x5b2845 === "decimal" ? 'any' : 0x1)) + '\x22');
  const _0x5dff2f = resolveFieldDisabled(_0x20f942, _0x109d2e) ? '\x20disabled\x20aria-disabled=\x22true\x22\x20data-ui-schema-disabled=\x22true\x22' : '';
  return "<div class=\"ui-schema-field ui-schema-rh-aiapp-footer-param ui-schema-rh-aiapp-footer-param--input\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x50ecc5) + "\" data-ui-schema-type=\"" + escapeHtmlAttr(_0x6472e1) + "\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x42f95a) + "\" data-ui-schema-footer-label=\"" + escapeHtmlAttr(_0x518894) + '\x22' + _0x3ed651 + renderStepperAttrs(_0x20f942, _0x6472e1) + ">\n    <label class=\"ui-schema-rh-aiapp-footer-inline\">\n      <span class=\"ui-schema-rh-aiapp-footer-inline-label\">" + escapeHtmlAttr(_0x518894) + "</span>\n      <span class=\"ui-schema-rh-aiapp-footer-inline-separator\">·</span>\n      <input class=\"ui-schema-rh-aiapp-footer-input\" data-ui-schema-input=\"" + escapeHtmlAttr(_0x50ecc5) + "\" type=\"number\" inputmode=\"" + escapeHtmlAttr(_0x5b2845) + '\x22\x20value=\x22' + escapeHtmlAttr(_0x480e2b) + "\" aria-label=\"" + escapeHtmlAttr(_0x518894) + '\x22' + _0x374112['join']('') + _0x5dff2f + ">\n    </label>\n  </div>";
}
function renderRhAiAppFooterToggleField({
  field: _0x559fa6,
  id: _0x110862,
  type: _0x51f8f8,
  value: _0x1ea3df,
  label: _0x2d57ad,
  defaultValue: _0x4382b2,
  valueTypeAttr: _0x5c1a1a,
  nodeData: _0x327886
}) {
  const _0x376468 = isRhAiAppFooterToggleOn(_0x1ea3df);
  const _0x45c5e1 = resolveFieldDisabled(_0x559fa6, _0x327886) ? " disabled aria-disabled=\"true\" data-ui-schema-disabled=\"true\"" : '';
  const _0x35ae09 = formatRhAiAppFooterParamValue(_0x51f8f8, _0x376468);
  return "<div class=\"ui-schema-field ui-schema-rh-aiapp-footer-param ui-schema-rh-aiapp-footer-param--toggle\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x110862) + "\" data-ui-schema-type=\"" + escapeHtmlAttr(_0x51f8f8) + "\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x4382b2) + "\" data-ui-schema-footer-label=\"" + escapeHtmlAttr(_0x2d57ad) + '\x22' + _0x5c1a1a + ">\n    <button type=\"button\" class=\"img-pill-btn ui-schema-rh-aiapp-footer-toggle\" data-ui-schema-rh-aiapp-footer-toggle=\"true\" data-ui-schema-value=\"" + escapeHtmlAttr(_0x376468 ? "false" : 'true') + "\" aria-pressed=\"" + escapeHtmlAttr(_0x376468) + '\x22' + _0x45c5e1 + ">\n      <span class=\"ui-schema-pill-label\">" + escapeHtmlAttr(_0x2d57ad) + '</span>\x0a\x20\x20\x20\x20\x20\x20<span\x20class=\x22ui-schema-rh-aiapp-footer-separator\x22\x20aria-hidden=\x22true\x22>·</span>\x0a\x20\x20\x20\x20\x20\x20<span\x20class=\x22ui-schema-rh-aiapp-footer-value\x22>' + escapeHtmlAttr(_0x35ae09) + "</span>\n    </button>\n  </div>";
}
function renderRhAiAppFooterParamField(_0x1a919c, _0x5dbf05) {
  assertSupportedField(_0x1a919c);
  const _0x523be6 = String(_0x1a919c?.['id'] || '')["trim"]();
  const _0x403ab9 = normalizeControlType(_0x1a919c?.["type"]);
  const _0x51ad3d = getFieldValue(_0x5dbf05, _0x1a919c);
  const _0x171faa = manifestText(_0x1a919c?.["label"] || _0x523be6);
  const _0x215a4e = _0x1a919c?.["defaultValue"] ?? '';
  const _0x252013 = typeof _0x1a919c?.["defaultValue"] === 'boolean' ? " data-ui-schema-value-type=\"boolean\"" : _0x403ab9 === "stepper" ? '\x20data-ui-schema-value-type=\x22number\x22' : '';
  const _0x40b12e = _0x403ab9 === 'stepper' ? " ui-schema-rh-video-stepper" : '';
  if (_0x403ab9 === "stepper") {
    return renderRhAiAppFooterDirectNumberField({
      'field': _0x1a919c,
      'id': _0x523be6,
      'type': _0x403ab9,
      'value': _0x51ad3d,
      'label': _0x171faa,
      'defaultValue': _0x215a4e,
      'valueTypeAttr': _0x252013,
      'nodeData': _0x5dbf05
    });
  }
  if (_0x403ab9 === "toggle") {
    return renderRhAiAppFooterToggleField({
      'field': _0x1a919c,
      'id': _0x523be6,
      'type': _0x403ab9,
      'value': _0x51ad3d,
      'label': _0x171faa,
      'defaultValue': _0x215a4e,
      'valueTypeAttr': _0x252013,
      'nodeData': _0x5dbf05
    });
  }
  const _0x5e9130 = renderControl(_0x1a919c, _0x51ad3d, _0x403ab9, {
    'nodeData': _0x5dbf05,
    'advanced': !![]
  });
  const _0x28fd47 = formatRhAiAppFooterParamValue(_0x403ab9, _0x51ad3d);
  const _0x4130da = _0x28fd47 ? _0x171faa + " · " + _0x28fd47 : _0x171faa;
  return "<div class=\"ui-schema-field ui-schema-pill-menu ui-schema-rh-aiapp-footer-param" + _0x40b12e + "\" data-ui-schema-field=\"" + escapeHtmlAttr(_0x523be6) + '\x22\x20data-ui-schema-type=\x22' + escapeHtmlAttr(_0x403ab9) + "\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x215a4e) + "\" data-ui-schema-footer-label=\"" + escapeHtmlAttr(_0x171faa) + '\x22' + _0x252013 + renderStepperAttrs(_0x1a919c, _0x403ab9) + ">\n    <button type=\"button\" class=\"img-pill-btn ui-schema-menu-trigger\" data-ui-schema-menu-trigger=\"" + escapeHtmlAttr(_0x523be6) + "\">\n      <span class=\"ui-schema-pill-label\">" + escapeHtmlAttr(_0x4130da) + '</span>\x0a\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20<div\x20class=\x22floating-menu\x20ui-schema-floating-menu\x20ui-schema-rh-aiapp-footer-menu\x22>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22ui-schema-floating-menu-title\x22>' + escapeHtmlAttr(_0x171faa) + "</div>\n      <div class=\"ui-schema-rh-aiapp-footer-control\">" + _0x5e9130 + "</div>\n    </div>\n  </div>";
}
function renderField(_0x24440f, _0x2c2198, _0x1d3d1b = {}) {
  assertSupportedField(_0x24440f);
  const _0x427bd2 = String(_0x24440f?.['id'] || '')['trim']();
  const _0x15ca85 = normalizeControlType(_0x24440f?.["type"]);
  const _0x3f1194 = _0x24440f?.["variant"] || _0x1d3d1b?.['variant'];
  if (String(_0x3f1194 || '')['trim']() === 'rhAiAppFooterParam') {
    return renderRhAiAppFooterParamField(_0x24440f, _0x2c2198);
  }
  const _0x497cb3 = {
    'renderRhV54ControlModeField': renderRhV54ControlModeField,
    'renderRhV54BooleanRowField': renderRhV54BooleanRowField,
    'renderRhV54MaskExpandField': renderRhV54MaskExpandField,
    'renderRhV54SpecialModeField': renderRhV54SpecialModeField,
    'renderRhV54BreastJiggleField': renderRhV54BreastJiggleField,
    'renderAdvancedRowField': renderAdvancedRowField,
    'renderRandomSeedRowField': renderRandomSeedRowField,
    'renderPillMenuField': renderPillMenuField,
    'renderAspectRatioPillField': renderAspectRatioPillField,
    'renderVoiceQualityRatioField': renderVoiceQualityRatioField,
    'renderSectionMenuField': renderSectionMenuField,
    'renderResolutionPillField': renderResolutionPillField,
    'renderDurationPillField': renderDurationPillField,
    'renderInstanceToggleField': renderInstanceToggleField
  };
  const _0x25851a = resolveUiSchemaFieldAdapterDefinition(_0x24440f, {
    'type': _0x15ca85,
    'variant': _0x3f1194
  });
  if (_0x25851a && typeof _0x25851a["render"] === "function") {
    return _0x25851a["render"]({
      'field': _0x24440f,
      'nodeData': _0x2c2198,
      'options': _0x1d3d1b,
      'type': _0x15ca85,
      'variant': _0x3f1194,
      'helpers': {
        'renderControl': renderControl
      }
    });
  }
  const _0x222a57 = _0x25851a?.["renderer"] || resolveUiSchemaFieldAdapter(_0x24440f, {
    'type': _0x15ca85,
    'variant': _0x3f1194
  });
  if (_0x222a57 && typeof _0x497cb3[_0x222a57] === "function") {
    return _0x497cb3[_0x222a57](_0x24440f, _0x2c2198, _0x1d3d1b);
  }
  const _0x442369 = getFieldValue(_0x2c2198, _0x24440f);
  const _0x350d4c = manifestText(_0x24440f?.["label"] || _0x427bd2);
  const _0x5c48c5 = _0x24440f?.["defaultValue"] ?? '';
  let _0x2a2f9b;
  _0x3f1194 === "pillmenu" && (_0x15ca85 === "segmented" || _0x15ca85 === "select") ? _0x2a2f9b = renderDropdownControl(_0x24440f, _0x442369, _0x2c2198) : _0x2a2f9b = renderControl(_0x24440f, _0x442369, _0x15ca85, {
    'nodeData': _0x2c2198
  });
  const _0x29c66e = _0x15ca85 === 'stepper' ? " ui-schema-rh-video-stepper" : '';
  const _0xd67d7e = _0x15ca85 === "stepper" ? '\x20data-ui-schema-value-type=\x22number\x22' : '';
  return "<div class=\"ui-schema-field" + _0x29c66e + '\x22\x20data-ui-schema-field=\x22' + escapeHtmlAttr(_0x427bd2) + '\x22\x20data-ui-schema-type=\x22' + escapeHtmlAttr(_0x15ca85) + "\" data-ui-schema-default=\"" + escapeHtmlAttr(_0x5c48c5) + '\x22' + _0xd67d7e + renderStepperAttrs(_0x24440f, _0x15ca85) + ">\n    <div class=\"rh-adv-title ui-schema-field-label\">" + escapeHtmlAttr(_0x350d4c) + "</div>\n    <div class=\"ui-schema-field-control\">" + _0x2a2f9b + "</div>\n  </div>";
}
function isStandaloneResolutionField(_0x329917) {
  if (_0x329917?.['standaloneInResolution'] === !![]) {
    return !![];
  }
  return String(_0x329917?.["resolutionComposite"] || '')["trim"]()["toLowerCase"]() === "standalone";
}
function renderResolutionPlacementFields(_0xbdff86, _0x4bfc25, _0x451287 = {}) {
  const _0x2ffc30 = getFieldById(_0xbdff86, 'rhVideoResolution') || getFieldById(_0xbdff86, "videoResolution");
  const _0x1d795d = String(_0x2ffc30?.["resolutionComposite"] || '')["trim"]() === "qualityRatio";
  if (_0x2ffc30 && !_0x1d795d) {
    const _0x5a9d51 = new Set(["rhVideoResolution", "videoResolution", 'rhVideoFps', "rhVideoFrames"]);
    const _0x3e5b3e = _0xbdff86["filter"](_0x597c72 => !_0x5a9d51["has"](String(_0x597c72?.['id'] || '')["trim"]()));
    return [renderVideoResolutionField(_0xbdff86, _0x4bfc25), ..._0x3e5b3e["map"](_0x3ca873 => renderField(_0x3ca873, _0x4bfc25, _0x451287))]["join"]('');
  }
  const _0x11c032 = new Set(["imageSize", "resolution", "videoSize", "videoResolution", 'quality']);
  const _0xe13fe6 = _0xbdff86["filter"](_0x486635 => {
    if (isStandaloneResolutionField(_0x486635)) {
      return ![];
    }
    const _0x5e0abd = String(_0x486635?.['id'] || '')["trim"]();
    const _0x546adf = String(_0x486635?.["displayRole"] || '')["trim"]();
    return _0x546adf === "resolution" || _0x11c032['has'](_0x5e0abd);
  });
  const _0x2afbc2 = _0xe13fe6[0x0] || null;
  const _0x7d6877 = getFieldById(_0xbdff86, 'aspectRatio') || getFieldByDisplayRole(_0xbdff86, 'aspectRatio');
  if (_0x2afbc2 && _0x7d6877) {
    const _0x473e9e = new Set([..._0xe13fe6, _0x7d6877]["map"](_0x2066cd => String(_0x2066cd?.['id'] || '')["trim"]()));
    let _0x502f05 = ![];
    return _0xbdff86["map"](_0x57a68d => {
      const _0x1caa26 = String(_0x57a68d?.['id'] || '')['trim']();
      if (!_0x473e9e['has'](_0x1caa26)) {
        return renderField(_0x57a68d, _0x4bfc25, _0x451287);
      }
      if (_0x502f05) {
        return '';
      }
      _0x502f05 = !![];
      return renderQualityRatioField(_0xe13fe6, _0x7d6877, _0x4bfc25);
    })["join"]('');
  }
  return _0xbdff86['map'](_0x4ecce8 => renderField(_0x4ecce8, _0x4bfc25, _0x451287))["join"]('');
}
function renderModePlacementFields(_0x578e7c, _0x52c40a, _0x5e502a = {}) {
  const _0x3672b7 = _0x578e7c["find"](_0x5937c2 => String(_0x5937c2?.['variant'] || '')["trim"]() === "voiceQualityRatio");
  if (_0x3672b7) {
    const _0x41183d = String(_0x3672b7?.["compositeWith"] || '')['trim']();
    const _0x29ce80 = _0x41183d ? _0x578e7c["find"](_0x12dac9 => String(_0x12dac9?.['id'] || '')["trim"]() === _0x41183d) : null;
    if (_0x29ce80) {
      const _0xebd00 = new Set([_0x3672b7['id'], _0x29ce80['id']]);
      const _0x46dcb2 = _0x578e7c['filter'](_0x2d378f => !_0xebd00['has'](String(_0x2d378f?.['id'] || '')['trim']()));
      return [renderVoiceQualityRatioField([_0x3672b7, _0x29ce80], _0x52c40a), ..._0x46dcb2["map"](_0x18e5ac => renderField(_0x18e5ac, _0x52c40a, _0x5e502a))]["join"]('');
    }
  }
  const _0x12735a = _0x578e7c["filter"](_0x436d0f => String(_0x436d0f?.["variant"] || '')["trim"]() === "sectionMenu");
  if (_0x12735a["length"] >= 0x2) {
    const _0x111b07 = new Set(_0x12735a["map"](_0x5d9be5 => String(_0x5d9be5?.['id'] || '')["trim"]()));
    const _0x25888a = _0x578e7c['filter'](_0x2c2d5c => !_0x111b07['has'](String(_0x2c2d5c?.['id'] || '')["trim"]()));
    return [renderSectionPairField(_0x12735a, _0x52c40a), ..._0x25888a["map"](_0x24cdac => renderField(_0x24cdac, _0x52c40a, _0x5e502a))]['join']('');
  }
  return _0x578e7c['map'](_0x4b9ac0 => renderField(_0x4b9ac0, _0x52c40a, _0x5e502a))["join"]('');
}
export function hasModelUiSchema(_0x28e78b, _0x5c69a6 = {}) {
  const _0x5d2f5c = getUiSchemaFields(_0x28e78b, _0x5c69a6);
  _0x5d2f5c["forEach"](assertSupportedField);
  return _0x5d2f5c["length"] > 0x0;
}
export function hasVisibleModelUiSchema(_0x4e815e, _0x5b56df = {}, _0x397364 = {}) {
  const _0x5f1112 = getUiSchemaFields(_0x4e815e, _0x397364);
  _0x5f1112["forEach"](assertSupportedField);
  return filterVisibleUiSchemaFields(_0x5f1112, _0x5b56df)["length"] > 0x0;
}
function renderUiSchemaControls(_0x274c9f, _0xcdb015 = {}, _0x3bab08 = {}) {
  const _0x39bb00 = filterVisibleUiSchemaFields(filterUiSchemaFields(_0x274c9f, _0x3bab08), _0xcdb015);
  if (!_0x39bb00['length']) {
    return '';
  }
  const _0xda53d0 = normalizePlacement(_0x3bab08?.["placement"]);
  const _0x2baaa9 = _0xda53d0 === "resolution" ? renderResolutionPlacementFields(_0x39bb00, _0xcdb015, _0x3bab08) : _0xda53d0 === "mode" ? renderModePlacementFields(_0x39bb00, _0xcdb015, _0x3bab08) : _0xda53d0 === 'advanced' ? _0x39bb00["map"](_0x51a756 => renderField(_0x51a756, _0xcdb015, {
    ..._0x3bab08,
    'variant': _0x51a756?.["variant"] || _0x3bab08?.["variant"] || 'advancedRow'
  }))['join']('') : _0xda53d0 === "videoparams" ? renderRhVideoParamsPlacementFields(_0x39bb00, _0xcdb015, _0x3bab08) : _0x39bb00["map"](_0x5ec349 => renderField(_0x5ec349, _0xcdb015, _0x3bab08))["join"]('');
  if (!_0x2baaa9) {
    return '';
  }
  if (_0x3bab08?.["unwrap"] === !![]) {
    return _0x2baaa9;
  }
  const _0x1b75ff = _0xda53d0 ? '\x20data-ui-schema-placement=\x22' + escapeHtmlAttr(_0xda53d0) + '\x22' : '';
  const _0x251f3b = _0x3bab08?.['modelId'] ? '\x20data-ui-schema-model=\x22' + escapeHtmlAttr(_0x3bab08['modelId']) + '\x22' : '';
  const _0x6e8a77 = _0x3bab08?.["sourceId"] ? " data-ui-schema-source=\"" + escapeHtmlAttr(_0x3bab08['sourceId']) + '\x22' : '';
  return "<div class=\"ui-schema-renderer\"" + _0x251f3b + _0x6e8a77 + _0x1b75ff + '>' + _0x2baaa9 + "</div>";
}
export function renderModelUiSchemaControls(_0x460b8f, _0x5a347d = {}, _0x179fae = {}) {
  const _0x23789f = getUiSchemaFields(_0x460b8f, _0x179fae);
  return renderUiSchemaControls(_0x23789f, _0x5a347d, {
    ..._0x179fae,
    'modelId': _0x460b8f
  });
}
export function renderUiSchemaFields(_0x3d4621, _0x5ad0b4 = {}, _0x37736b = {}) {
  return renderUiSchemaControls(_0x3d4621, _0x5ad0b4, {
    ..._0x37736b,
    'ignorePlacementFilter': !![]
  });
}
export function buildUiSchemaParamPatch(_0x109941 = {}, _0x1e5909 = '', _0x567deb = '') {
  return a350_0x31d815(_0x109941, _0x1e5909, _0x567deb);
}
export function buildModelUiSchemaDefaultParams(_0x249199) {
  const _0x59240a = getUiSchemaFields(_0x249199);
  _0x59240a["forEach"](assertSupportedField);
  return sanitizeModelUiSchemaParams(_0x249199);
}
function handleRandomSeedRowBindEvent({
  event: _0x3dbff0,
  eventName: _0x2706c3,
  fieldEl: _0x23a109,
  helpers = {}
} = {}) {
  if (_0x2706c3 !== 'click' || !_0x23a109) {
    return ![];
  }
  const _0x392840 = helpers["commitValue"];
  if (typeof _0x392840 !== "function") {
    return ![];
  }
  const _0x502973 = typeof helpers["setRhVideoStepperValueEl"] === 'function' ? helpers["setRhVideoStepperValueEl"] : () => {};
  const _0xabdb9a = typeof helpers['generateRandomSeedForField'] === "function" ? helpers['generateRandomSeedForField'] : () => '';
  const _0x378144 = _0x3dbff0?.["target"]?.['closest']?.('[data-ui-schema-random-seed-mode]');
  if (_0x378144 && _0x23a109["contains"](_0x378144)) {
    _0x3dbff0["preventDefault"]?.();
    _0x3dbff0['stopPropagation']?.();
    const _0x209f72 = String(_0x378144['dataset']['uiSchemaRandomSeedModeField'] || _0x23a109["dataset"]?.['uiSchemaRandomSeedModeField'] || '')["trim"]();
    const _0x69c974 = normalizeRandomSeedMode(_0x378144["dataset"]["uiSchemaRandomSeedMode"], "fixed");
    if (!_0x209f72) {
      return !![];
    }
    _0x392840(_0x209f72, _0x69c974);
    if (_0x69c974 === "random") {
      const _0x187785 = String(_0x23a109["dataset"]["uiSchemaField"] || '')["trim"]();
      const _0x120425 = _0xabdb9a(_0x23a109);
      _0x23a109["classList"]?.["contains"]("ui-schema-rh-video-stepper") && _0x502973(_0x23a109, _0x120425);
      const _0x62cc89 = _0x23a109["querySelector"]("[data-ui-schema-input]");
      if (_0x62cc89) {
        _0x62cc89["value"] = _0x120425;
      }
      if (_0x187785) {
        _0x392840(_0x187785, _0x120425);
      }
    }
    return !![];
  }
  const _0x28f8d0 = _0x3dbff0?.["target"]?.["closest"]?.('[data-ui-schema-random-seed]');
  if (_0x28f8d0 && _0x23a109['contains'](_0x28f8d0)) {
    _0x3dbff0["preventDefault"]?.();
    _0x3dbff0["stopPropagation"]?.();
    const _0x2c0f60 = String(_0x23a109?.["dataset"]?.['uiSchemaField'] || '')["trim"]();
    if (!_0x2c0f60) {
      return !![];
    }
    const _0x327418 = _0xabdb9a(_0x23a109);
    _0x23a109['classList']?.["contains"]("ui-schema-rh-video-stepper") && _0x502973(_0x23a109, _0x327418);
    const _0x3f7115 = _0x23a109["querySelector"]("[data-ui-schema-input]");
    if (_0x3f7115) {
      _0x3f7115["value"] = _0x327418;
    }
    _0x392840(_0x2c0f60, _0x327418);
    return !![];
  }
  return ![];
}
configureUiSchemaFieldAdapter("field.randomSeedRow", {
  'render': ({
    field: _0x1388d6,
    nodeData: _0x84de41
  }) => renderRandomSeedRowField(_0x1388d6, _0x84de41),
  'sync': ({
    fieldEl: _0x5c9a80,
    nodeData: _0x47fa7b
  }) => syncRandomSeedField(_0x5c9a80, _0x47fa7b),
  'bind': handleRandomSeedRowBindEvent,
  'normalize': ({
    field: _0x26e1c0,
    value: _0x26d371,
    helpers = {}
  }) => {
    const _0x6343d2 = typeof helpers["normalizeUiSchemaFieldValue"] === "function" ? helpers['normalizeUiSchemaFieldValue'] : normalizeUiSchemaFieldValue;
    return _0x6343d2(_0x26e1c0, _0x26d371);
  }
});
configureUiSchemaFieldAdapter("field.durationPill.slider", {
  'render': ({
    field: _0x131863,
    nodeData: _0x11022f
  }) => renderDurationPillField(_0x131863, _0x11022f),
  'sync': ({
    fieldEl: _0x2a116b,
    nodeData: _0x1bf304,
    helpers = {}
  }) => {
    const _0x288cb3 = String(_0x2a116b?.["dataset"]?.["uiSchemaField"] || '')["trim"]();
    if (!_0x288cb3) {
      return;
    }
    const _0x130237 = typeof helpers["getNodeFieldValue"] === 'function' ? helpers["getNodeFieldValue"](_0x1bf304, _0x288cb3, _0x2a116b["dataset"]["uiSchemaDefault"]) : _0x1bf304?.[_0x288cb3];
    syncDurationPillField(_0x2a116b, _0x130237);
  }
});
configureUiSchemaFieldAdapter("field.resolutionPill.slider", {
  'render': ({
    field: _0x3e8b8c,
    nodeData: _0x2dba4b
  }) => renderResolutionPillField(_0x3e8b8c, _0x2dba4b),
  'sync': ({
    fieldEl: _0xa27fa9,
    nodeData: _0x3ebc96,
    helpers = {}
  }) => {
    const _0x4b6611 = String(_0xa27fa9?.["dataset"]?.['uiSchemaField'] || '')["trim"]();
    if (!_0x4b6611) {
      return;
    }
    const _0x336e32 = typeof helpers["getNodeFieldValue"] === "function" ? helpers["getNodeFieldValue"](_0x3ebc96, _0x4b6611, _0xa27fa9['dataset']["uiSchemaDefault"]) : _0x3ebc96?.[_0x4b6611];
    syncResolutionPillField(_0xa27fa9, _0x336e32);
  }
});
function bindUiSchemaControls(_0x1d182e, {
  getNodeData: _0x10567b,
  commitFieldValue: _0x43ad29
} = {}) {
  return createUiSchemaBindingSession(_0x1d182e, {
    'getNodeData': _0x10567b,
    'commitFieldValue': _0x43ad29
  }, {
    'RANDOM_SEED_DEFAULT_MAX': RANDOM_SEED_DEFAULT_MAX,
    'RANDOM_SEED_DEFAULT_MIN': RANDOM_SEED_DEFAULT_MIN,
    'UI_SCHEMA_POPUP_EXIT_MS': UI_SCHEMA_POPUP_EXIT_MS,
    'evaluateUiSchemaNumberExpression': evaluateUiSchemaNumberExpression,
    'formatRhV54BreastJiggle': formatRhV54BreastJiggle,
    'getNodeFieldValue': getNodeFieldValue,
    'getOptionDisableRepairPatch': getOptionDisableRepairPatch,
    'getRangeValueDisplayLabel': getRangeValueDisplayLabel,
    'getRenderedOptionDisableWhen': getRenderedOptionDisableWhen,
    'getRhV54BreastJiggleRangeFromFieldEl': getRhV54BreastJiggleRangeFromFieldEl,
    'getUiSchemaFieldAdapterDefinition': getUiSchemaFieldAdapterDefinition,
    'normalizeRhV54MaskExpand': normalizeRhV54MaskExpand,
    'openExternalLink': openExternalLink,
    'parseRangeValuesFromFieldEl': parseRangeValuesFromFieldEl,
    'syncInstanceToggleField': syncInstanceToggleField,
    'syncModelUiSchemaControls': syncModelUiSchemaControls,
    'syncRhAiAppFooterParamField': syncRhAiAppFooterParamField,
    't': t
  });
}
export function bindModelUiSchemaControls(_0x344bfb, {
  nodeId: _0x19956b,
  nodeData: _0x339809,
  store: _0x1baf62,
  buildPatch: _0x978420,
  decorateNodeData: _0x50cca6,
  afterCommit: _0xb6320f
} = {}) {
  if (!_0x344bfb || !_0x1baf62 || !_0x19956b) {
    return () => {};
  }
  const _0x13f61b = () => {
    const _0x30906c = _0x1baf62["getState"]?.()["nodes"]?.[_0x19956b] || _0x339809 || {};
    return typeof _0x50cca6 === "function" ? _0x50cca6(_0x30906c) : _0x30906c;
  };
  return bindUiSchemaControls(_0x344bfb, {
    'getNodeData': _0x13f61b,
    'commitFieldValue': (_0x21c381, _0x2b0522, _0x247682) => {
      const _0x2d9037 = buildUiSchemaParamPatch(_0x247682, _0x21c381, _0x2b0522);
      const _0x4dad95 = typeof _0x978420 === 'function' ? _0x978420(_0x247682, _0x21c381, _0x2b0522, _0x2d9037) : {};
      const _0x51174a = {
        ..._0x2d9037,
        ...(_0x4dad95 && typeof _0x4dad95 === "object" ? _0x4dad95 : {})
      };
      _0x1baf62["updateNodeData"](_0x19956b, _0x51174a);
      const _0x5ef950 = {
        ..._0x247682,
        ..._0x51174a
      };
      const _0x4c2d2b = typeof _0x50cca6 === 'function' ? _0x50cca6(_0x5ef950) : _0x5ef950;
      _0xb6320f?.(_0x21c381, _0x2b0522, _0x4c2d2b, {
        'latest': _0x247682,
        'patch': _0x51174a
      });
      return _0x4c2d2b;
    }
  });
}
export function bindUiSchemaFieldControls(_0x20809d, {
  getNodeData: _0x347b84,
  commitFieldValue: _0x626a0
} = {}) {
  return bindUiSchemaControls(_0x20809d, {
    'getNodeData': _0x347b84,
    'commitFieldValue': _0x626a0
  });
}
const uiSchemaStateOwner = createUiSchemaStateOwner({
  'getUiSchemaValueOptions': getUiSchemaValueOptions,
  'findUiSchemaValueOption': findUiSchemaValueOption,
  'findFirstEnabledUiSchemaValueOption': findFirstEnabledUiSchemaValueOption,
  'syncInstanceToggleField': syncInstanceToggleField,
  'syncStepperField': syncStepperField,
  'syncRhAiAppFooterParamField': syncRhAiAppFooterParamField,
  'parseRangeValuesFromFieldEl': parseRangeValuesFromFieldEl,
  'findRangeValueIndex': findRangeValueIndex,
  'normalizeRhV54SpecialMode': normalizeRhV54SpecialMode,
  'normalizeRhV54SinglePreset': normalizeRhV54SinglePreset,
  'normalizeRhV54MaskExpand': normalizeRhV54MaskExpand,
  'formatRhV54BreastJiggle': formatRhV54BreastJiggle,
  'getRhV54BreastJiggleRangeFromFieldEl': getRhV54BreastJiggleRangeFromFieldEl,
  'normalizeNumberValue': normalizeNumberValue,
  'formatMetricLabel': formatMetricLabel,
  'joinMetricLabels': joinMetricLabels
});
export function syncModelUiSchemaControls(_0x23fd82, _0x39edc5 = {}) {
  return uiSchemaStateOwner['syncModelUiSchemaControls'](_0x23fd82, _0x39edc5);
}