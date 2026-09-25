import { renderModelUiSchemaControls } from '../aigenImage/uiSchemaRenderer.js';
import { getModelManifest } from '../../manifests/index.js';
import { RH_AI_APP_PERSISTENT_ADVANCED_CLASS, isCustomAiAppManifest, isRunningHubAiAppManifest, resolveCustomAiAppNodeManifest } from '../shared/rhAiAppNodeBehavior.js';
import { buildAudioModelMenuHtml, buildAudioModelTriggerHtml } from './audioModelMenuHelpers.js';
import { ADVANCED_SETTINGS_TUNE_ICON_MARKUP } from '../sharedIconMarkup.js';
export function isRunningHubAudioWorkflowItem(_0x1f0671 = {}) {
  const _0x368512 = String(_0x1f0671?.["provider"] || '')["trim"]()['toLowerCase']();
  const _0x346783 = String(_0x1f0671?.["adapterType"] || '')['trim']()["toLowerCase"]();
  return _0x368512 === "runninghubwf" && _0x346783 === "workflow";
}
function getAudioWorkflowManifest(_0x469d83 = {}, _0x153606 = {}) {
  const _0x263713 = String(_0x469d83?.["key"] || _0x469d83?.['modelId'] || '')["trim"]();
  return resolveCustomAiAppNodeManifest({
    ..._0x153606,
    'model': _0x263713,
    'provider': _0x469d83?.["provider"] || _0x153606?.["provider"]
  }) || getModelManifest(_0x263713);
}
function renderAudioWorkflowSchemaControl(_0x3c5e50, _0x4b4617, _0x1ef9dd = {}) {
  const _0x7957b9 = String(_0x3c5e50?.["key"] || _0x3c5e50?.["modelId"] || '')["trim"]();
  if (!_0x7957b9) {
    return '';
  }
  return renderModelUiSchemaControls(_0x7957b9, _0x4b4617, _0x1ef9dd);
}
export function isRhAiAppAudioWorkflow(_0x5a4c37 = {}, _0x3cab6e = {}) {
  return isRunningHubAiAppManifest(getAudioWorkflowManifest(_0x5a4c37, _0x3cab6e));
}
function isCustomAiAppAudioWorkflow(_0x44857b = {}, _0x1ac3ce = {}) {
  return isCustomAiAppManifest(getAudioWorkflowManifest(_0x44857b, _0x1ac3ce));
}
export function renderAudioWorkflowFooterSchemaControls(_0x4f2798, _0x288539 = {}) {
  return {
    'batch': renderAudioWorkflowSchemaControl(_0x4f2798, _0x288539, {
      'placement': "batch"
    }),
    'mode': renderAudioWorkflowSchemaControl(_0x4f2798, _0x288539, {
      'placement': "mode"
    }),
    'advanced': renderAudioWorkflowSchemaControl(_0x4f2798, _0x288539, {
      'placement': "advanced"
    }),
    'instance': isRunningHubAudioWorkflowItem(_0x4f2798) ? renderAudioWorkflowSchemaControl(_0x4f2798, _0x288539, {
      'placement': "instance",
      'variant': "instanceToggle"
    }) : ''
  };
}
export function buildAudioWorkflowFooterHtml({
  workflow: _0x3c78f0,
  nodeData = {},
  workflowItems = [],
  labels = {},
  debugIconHtml = ''
} = {}) {
  const {
    mode: _0x45618f,
    advanced: _0x2ef4bb,
    instance: _0x27330f,
    batch: _0x6175dc
  } = renderAudioWorkflowFooterSchemaControls(_0x3c78f0, nodeData);
  const _0x549447 = isRhAiAppAudioWorkflow(_0x3c78f0, nodeData);
  const _0x1edd19 = isCustomAiAppAudioWorkflow(_0x3c78f0, nodeData);
  const _0x104937 = String(labels["advanced"] || "高级设置")['replace'](/&/g, "&amp;")["replace"](/"/g, "&quot;")["replace"](/</g, "&lt;")['replace'](/>/g, "&gt;");
  const _0x137f93 = buildAudioModelMenuHtml({
    'activeModel': _0x3c78f0?.["key"],
    'workflowItems': workflowItems
  });
  return '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22img-model-pills\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22img-model-wrap\x22\x20style=\x22position:relative;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + buildAudioModelTriggerHtml({
    'label': _0x3c78f0?.['label'],
    'activeProvider': _0x3c78f0?.["provider"] || '',
    'icon': _0x3c78f0?.["icon"] || '',
    'iconAlt': _0x3c78f0?.["iconAlt"] || '',
    'iconHtml': _0x3c78f0?.["iconHtml"] || ''
  }) + "\n              " + _0x137f93 + "\n            </div>\n            <div class=\"ui-schema-placement ui-schema-mode-slot\" style=\"" + (_0x45618f ? '' : "display:none;") + "\">\n              " + _0x45618f + "\n            </div>\n          </div>\n          <div class=\"prompt-actions\">\n            <div class=\"ui-schema-placement ui-schema-batch-slot\" style=\"" + (_0x6175dc ? '' : 'display:none;') + '\x22>' + _0x6175dc + "</div>\n            <div class=\"rh-adv-wrap\" style=\"position:relative;" + (_0x2ef4bb && !_0x549447 ? '' : "display:none;") + "\">\n              <button type=\"button\" class=\"img-pill-btn rh-adv-btn advanced-settings-icon-button\" data-tooltip=\"" + _0x104937 + "\" aria-label=\"" + _0x104937 + "\" aria-expanded=\"" + (_0x1edd19 && Boolean(_0x2ef4bb)) + '\x22>' + ADVANCED_SETTINGS_TUNE_ICON_MARKUP + '</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22prompt-submit\x20debug-wrench-btn\x22\x20title=\x22' + (labels["debugTitle"] || '') + "\">\n              " + debugIconHtml + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22ui-schema-placement\x20ui-schema-instance-slot\x22\x20style=\x22' + (_0x27330f ? '' : "display:none;") + "\">\n              " + _0x27330f + "\n            </div>\n            <button type=\"button\" class=\"prompt-submit img-gen-btn\" title=\"" + (labels["generateTitle"] || '') + "\">\n              <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"5\"/><polyline points=\"5 12 12 5 19 12\"/></svg>\n            </button>\n          </div>\n          <div class=\"rh-adv-panel" + (_0x1edd19 && _0x2ef4bb ? " show " + RH_AI_APP_PERSISTENT_ADVANCED_CLASS : '') + "\">\n            " + _0x2ef4bb + "\n          </div>";
}
function updateHtmlSlot(_0x3d0e81, _0x355562) {
  if (!_0x3d0e81) {
    return;
  }
  _0x3d0e81["innerHTML"] = _0x355562 || '';
  _0x3d0e81["style"]["display"] = _0x355562 ? '' : "none";
}
function setClassState(_0xd94337, _0x5ae7a2, _0x10c7cd) {
  if (!_0xd94337?.["classList"]) {
    return;
  }
  if (typeof _0xd94337["classList"]['toggle'] === "function") {
    _0xd94337["classList"]["toggle"](_0x5ae7a2, _0x10c7cd);
    return;
  }
  _0x10c7cd ? _0xd94337["classList"]["add"]?.(_0x5ae7a2) : _0xd94337['classList']["remove"]?.(_0x5ae7a2);
}
export function applyAudioWorkflowFooterSchemaControls({
  workflow: _0x5a4a81,
  nodeData = {},
  modeSlot: _0xc125af,
  advancedPanel: _0x1c3ac6,
  advancedWrap: _0x156e68,
  advancedButton: _0x101d9c,
  instanceSlot: _0x5c433e,
  batchSlot: _0xf13031
} = {}) {
  const _0x2573b4 = renderAudioWorkflowFooterSchemaControls(_0x5a4a81, nodeData);
  const _0x2f6137 = isRhAiAppAudioWorkflow(_0x5a4a81, nodeData);
  const _0x593c5c = isCustomAiAppAudioWorkflow(_0x5a4a81, nodeData);
  updateHtmlSlot(_0xc125af, _0x2573b4['mode']);
  updateHtmlSlot(_0x5c433e, _0x2573b4["instance"]);
  updateHtmlSlot(_0xf13031, _0x2573b4["batch"]);
  if (_0x1c3ac6) {
    _0x1c3ac6["innerHTML"] = _0x2573b4["advanced"] || '';
  }
  if (_0x1c3ac6) {
    setClassState(_0x1c3ac6, RH_AI_APP_PERSISTENT_ADVANCED_CLASS, _0x593c5c && Boolean(_0x2573b4["advanced"]));
    if (_0x593c5c) {
      setClassState(_0x1c3ac6, 'show', Boolean(_0x2573b4['advanced']));
    } else {
      _0x2f6137 && setClassState(_0x1c3ac6, 'show', ![]);
    }
  }
  if (_0x156e68) {
    _0x156e68["style"]["display"] = _0x2573b4["advanced"] && !_0x2f6137 ? '' : "none";
  }
  if (!_0x2573b4['advanced']) {
    _0x1c3ac6?.["classList"]?.['remove']?.("show");
    _0x101d9c?.["classList"]?.["remove"]?.("active");
  } else {
    _0x2f6137 && _0x101d9c?.["classList"]?.["remove"]?.('active');
  }
  _0x101d9c?.["setAttribute"]?.("aria-expanded", String(_0x1c3ac6?.["classList"]?.["contains"]?.("show") === !![]));
  return _0x2573b4;
}
export function updateAudioModelTriggerIcon(_0x3b4dca, _0x51d483 = {}) {
  const _0x254150 = String(_0x51d483?.["iconHtml"] || '')["trim"]();
  if (_0x254150 && _0x3b4dca && typeof document !== "undefined") {
    const _0x55ad9f = _0x3b4dca?.["querySelector"]?.(".img-model-label") || null;
    const _0x3ea212 = _0x3b4dca?.["querySelector"]?.(".node-menu-icon, .node-menu-icon-small, img");
    const _0x21113e = document["createElement"]("template");
    _0x21113e['innerHTML'] = _0x254150;
    const _0x16af64 = _0x21113e["content"]["firstElementChild"];
    _0x16af64 && _0x55ad9f && (_0x3ea212?.['remove']?.(), _0x3b4dca['insertBefore'](_0x16af64, _0x55ad9f));
    return;
  }
  const _0x52bba9 = _0x3b4dca?.["querySelector"]?.('img');
  if (!_0x52bba9) {
    return;
  }
  const _0xd44509 = String(_0x51d483?.["provider"] || '')['trim']();
  const _0xba45f = String(_0x51d483?.["icon"] || '')['trim']() || (_0xd44509 === "volcengine-speech" ? 'images/volcengine.svg' : "images/RH.png");
  const _0x232087 = String(_0x51d483?.["iconAlt"] || '')["trim"]() || (_0xd44509 === "volcengine-speech" ? 'volcengine-speech' : "runninghub");
  _0x52bba9['setAttribute']?.("src", _0xba45f);
  _0x52bba9['setAttribute']?.("alt", _0x232087);
  _0x52bba9["src"] = _0xba45f;
  _0x52bba9['alt'] = _0x232087;
}