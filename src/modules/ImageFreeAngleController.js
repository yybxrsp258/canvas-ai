import { openDebugRequestWindow } from './debugRequestWindow.js';
import a1095_0x7f854a from '../core/stores/appStore.js';
import { bindImageFunctionControls, getImageFunctionRequestSettings, getImageFunctionSelection, renderImageFunctionControls } from './imageFunctionControls.js';
import { generateId } from '../core/math.js';
import { getImage } from './storage.js';
import { buildGenerateImageRequest, generateImage } from '../../api/aiImageApi.js';
import { isAdaptiveRatioLabel } from '../../api/imageRatioPolicy.js';
import { cancelRunningHubTask } from '../../api/runninghubTaskApi.js';
import { ensureConfig, getProviderConfig } from '../../api/configApi.js';
import { calcSafeSpawnPosNearNode } from './nodeSpawn.js';
import { buildSourceMediaNodePayload, getAutoMediaSizeByShortSide, getNodeDefaultSize } from '../services/fileService.js';
import { buildImageFreeAngleModelCatalog, getDefaultImageFreeAngleModelState, getImageFunctionModelDisplayName, isImageFreeAngleOnlyModel } from './imageFunctionModelMenu.js';
import { DEBUG_WRENCH_ICON_HTML, buildFinalApiDebugPreview } from '../utils/debugRequestPreview.js';
import { localPathToUrl, pickResultLocalPath } from '../utils/localMediaPath.js';
import { GENERATE_CANCEL_ICON_HTML } from './previewGenerateButtonUi.js';
import { buildImageGenerationFailurePatch, buildImageGenerationResultPatch } from '../components/aigenImage/imageGenerationResultRenderer.js';
import { buildGenerationCancelledPatch, buildGenerationStartPatch } from '../core/generationTaskLifecycle.js';
import { buildAsyncTaskPatch as a1095_0x407b86, buildDreaminaTaskPatch as a1095_0x32cc89, buildRunningHubTaskPatch as a1095_0x40b7cb } from '../core/generationTaskProtocolState.js';
import { isTaskCancelled } from '../core/generationTaskUiState.js';
import { isDreaminaImageTaskModel, isRunningHubImageTaskModel, isRunningHubModelApiImageTask, resolveImageTaskProvider, shouldUseRunningHubOpenapiQuery } from './imageTaskModelResolver.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { resolveImageFreeAngleAspectRatio, resolveImageFreeAngleSourceSize } from './imageFreeAngleAspectRatio.js';
const FREE_ANGLE_DISTANCE_MIN = 0.1;
const FREE_ANGLE_DISTANCE_MAX = 0x2;
const FREE_ANGLE_VISUAL_SCALE_MIN = 0.7;
const FREE_ANGLE_PREVIOUS_DISTANCE_ONE_VISUAL_SCALE = FREE_ANGLE_VISUAL_SCALE_MIN + (0x1 - FREE_ANGLE_DISTANCE_MIN) * (2.65 / (FREE_ANGLE_DISTANCE_MAX - FREE_ANGLE_DISTANCE_MIN));
function _computeGenerationDuration(_0x3466da) {
  if (!_0x3466da) {
    return 0x0;
  }
  if (typeof _0x3466da['generationDuration'] === 'number') {
    return _0x3466da["generationDuration"];
  }
  const _0x523f88 = Number(_0x3466da["generationStartTime"]);
  if (!Number["isFinite"](_0x523f88) || _0x523f88 <= 0x0) {
    return 0x0;
  }
  return Math["max"](0x0, Date["now"]() - _0x523f88);
}
function _isRunningHubTaskModel(_0x49cddb, _0x17281b) {
  return isRunningHubImageTaskModel(_0x49cddb, _0x17281b);
}
function _isDreaminaTaskModel(_0x45eb5a, _0x3fe6e5) {
  return isDreaminaImageTaskModel(_0x45eb5a, _0x3fe6e5);
}
function freeAngleText(_0x4ea710, _0x43626f = {}) {
  return t("imageFreeAngle." + _0x4ea710, _0x43626f);
}
function buildFreeAngleOutputText(_0x5846ac, {
  rotation: _0x41ddf9,
  pitch: _0x236026,
  scale: _0x288806
} = {}) {
  return freeAngleText('output.angle', {
    'model': _0x5846ac,
    'rotation': _0x41ddf9,
    'pitch': _0x236026,
    'scale': _0x288806
  });
}
function _resolveImageProvider(_0x94a570, _0x48aafc = '') {
  return resolveImageTaskProvider(_0x94a570, _0x48aafc, "grsai");
}
function _buildRunningHubTaskPatch({
  taskId = '',
  status = 'pending',
  startedAt = 0x0,
  recovering = ![],
  useOpenapiQuery = ![]
} = {}) {
  return a1095_0x40b7cb({
    'taskId': taskId,
    'status': status,
    'startedAt': startedAt,
    'recovering': recovering,
    'useOpenapiQuery': useOpenapiQuery
  });
}
function _buildDreaminaTaskPatch({
  submitId = '',
  status = 'pending',
  phase = "generating",
  label = freeAngleText('task.generating'),
  startedAt = 0x0,
  recovering = ![]
} = {}) {
  return a1095_0x32cc89({
    'submitId': submitId,
    'status': status,
    'phase': phase,
    'label': label,
    'startedAt': startedAt,
    'recovering': recovering,
    'defaultLabel': freeAngleText("task.generating")
  });
}
function _buildAsyncTaskPatch({
  provider = '',
  kind = "image",
  taskId = '',
  status = "pending",
  startedAt = 0x0,
  recovering = ![]
} = {}) {
  return a1095_0x407b86({
    'provider': provider,
    'kind': kind,
    'taskId': taskId,
    'status': status,
    'startedAt': startedAt,
    'recovering': recovering
  });
}
function _persistRunningHubResumeCache() {
  try {
    window["_triggerLocalCacheSave"]?.();
  } catch {}
}
export function createRunningHubTaskStateMachine() {
  const _0x1fceee = {
    'active': ![],
    'cancelRequested': ![],
    'apiKey': '',
    'providerProfileId': '',
    'taskId': '',
    'abortController': null,
    'outNodeId': '',
    'originHtml': '',
    'originColor': '',
    'originTooltip': '',
    'originAria': '',
    'originTitle': ''
  };
  const _0xf63200 = _0x10b6f0 => {
    if (!_0x10b6f0 || _0x1fceee["originHtml"]) {
      return;
    }
    _0x1fceee['originHtml'] = _0x10b6f0['innerHTML'];
    _0x1fceee["originColor"] = _0x10b6f0["style"]["color"] || '';
    _0x1fceee["originTooltip"] = _0x10b6f0["dataset"]["tooltip"] || '';
    _0x1fceee["originAria"] = _0x10b6f0["getAttribute"]("aria-label") || '';
    _0x1fceee["originTitle"] = _0x10b6f0["title"] || '';
  };
  const _0x15fcfb = _0x5ee9c6 => {
    if (!_0x5ee9c6) {
      return;
    }
    _0xf63200(_0x5ee9c6);
    _0x5ee9c6["style"]["color"] = 'var(--red)';
    _0x5ee9c6['dataset']["tooltip"] = freeAngleText('runningTask.clickCancel');
    _0x5ee9c6["setAttribute"]("aria-label", freeAngleText("runningTask.cancel"));
    _0x5ee9c6["title"] = freeAngleText("runningTask.clickCancelTask");
    _0x5ee9c6["innerHTML"] = GENERATE_CANCEL_ICON_HTML;
  };
  const _0x53c846 = _0x34b0a4 => {
    if (!_0x34b0a4) {
      return;
    }
    if (_0x1fceee["originHtml"]) {
      _0x34b0a4["innerHTML"] = _0x1fceee["originHtml"];
    }
    _0x34b0a4["style"]["color"] = _0x1fceee["originColor"] || '';
    if (_0x1fceee["originTooltip"]) {
      _0x34b0a4['dataset']["tooltip"] = _0x1fceee["originTooltip"];
    } else {
      delete _0x34b0a4["dataset"]["tooltip"];
    }
    if (_0x1fceee['originAria']) {
      _0x34b0a4["setAttribute"]('aria-label', _0x1fceee['originAria']);
    } else {
      _0x34b0a4["removeAttribute"]("aria-label");
    }
    _0x34b0a4["title"] = _0x1fceee["originTitle"] || '';
  };
  const _0xa4b242 = ({
    button: _0x43e409,
    apiKey: _0x35b957,
    providerProfileId: _0x5c4a7e,
    abortController: _0x591f66,
    outNodeId: _0x30fd75
  }) => {
    _0x1fceee["active"] = !![];
    _0x1fceee["cancelRequested"] = ![];
    _0x1fceee["apiKey"] = _0x35b957 || '';
    _0x1fceee["providerProfileId"] = String(_0x5c4a7e || '')["trim"]();
    _0x1fceee["taskId"] = '';
    _0x1fceee['abortController'] = _0x591f66 || null;
    _0x1fceee["outNodeId"] = _0x30fd75 || '';
    _0x15fcfb(_0x43e409);
  };
  const _0x125b4f = _0x27f13f => {
    _0x1fceee["taskId"] = _0x27f13f ? String(_0x27f13f) : '';
  };
  const _0x5ba919 = () => !!_0x1fceee["cancelRequested"] || !!_0x1fceee["abortController"]?.["signal"]?.['aborted'];
  const _0x144ccd = async () => {
    _0x1fceee["cancelRequested"] = !![];
    try {
      _0x1fceee["abortController"]?.["abort"]?.();
    } catch {}
    _0x1fceee['apiKey'] && _0x1fceee["taskId"] && (await cancelRunningHubTask({
      'apiKey': _0x1fceee["apiKey"],
      'taskId': _0x1fceee["taskId"],
      'providerProfileId': _0x1fceee["providerProfileId"]
    }));
  };
  const _0x4fb028 = ({
    nodeId: _0x4fe7a7,
    name: _0x31da66,
    outputText: _0x3d8bd2
  }) => {
    const _0x5083bd = _0x4fe7a7 || _0x1fceee['outNodeId'];
    if (!_0x5083bd) {
      return;
    }
    const _0x8fd70c = a1095_0x7f854a["getState"]()['nodes']?.[_0x5083bd];
    if (!_0x8fd70c) {
      return;
    }
    const _0x3dfc77 = _computeGenerationDuration(_0x8fd70c);
    a1095_0x7f854a["updateNodeData"](_0x5083bd, {
      ...buildGenerationCancelledPatch({
        'duration': _0x3dfc77
      }),
      'name': _0x31da66,
      'outputText': _0x3d8bd2,
      'jobStatus': null
    });
  };
  const _0x5f11ed = _0x1399d9 => {
    _0x1fceee["active"] = ![];
    _0x1fceee['cancelRequested'] = ![];
    _0x1fceee["apiKey"] = '';
    _0x1fceee['providerProfileId'] = '';
    _0x1fceee['taskId'] = '';
    _0x1fceee['abortController'] = null;
    _0x1fceee["outNodeId"] = '';
    _0x53c846(_0x1399d9);
  };
  return {
    'state': _0x1fceee,
    'bindButton': _0xf63200,
    'activate': _0xa4b242,
    'setTaskId': _0x125b4f,
    'isCancelled': _0x5ba919,
    'cancel': _0x144ccd,
    'finalizeCancelledNode': _0x4fb028,
    'reset': _0x5f11ed
  };
}
const ImageFreeAngleController = {
  'active': ![],
  'nodeId': null,
  'nodeData': null,
  'state': {
    'rotation': 0x23,
    'pitch': 0x14,
    'scale': 0.5,
    'pan': {
      'x': 0x0,
      'y': 0x0
    }
  },
  'containerEl': null,
  'cubeEl': null,
  'imageWrapEl': null,
  'onDone': null,
  '_unsubscribeLocale': null,
  async 'render'(_0x5e4f2f, _0x402881, _0x3194d2, _0x5590a4, _0x302e12) {
    const _0x4ff2f2 = a1095_0x7f854a["getStateRaw"]();
    const _0x54f456 = _0x4ff2f2["nodes"]?.[_0x5e4f2f];
    if (!_0x54f456) {
      return;
    }
    if (this["active"] && this["nodeId"] === _0x5e4f2f) {
      return;
    }
    this["active"] && this['nodeId'] !== _0x5e4f2f && this["_exit"]();
    this["active"] = !![];
    this["nodeId"] = _0x5e4f2f;
    this['nodeData'] = _0x54f456;
    this['containerEl'] = _0x402881;
    this["onDone"] = _0x3194d2;
    this['onGenerate'] = _0x5590a4;
    this["triggerBtn"] = _0x302e12;
    this["triggerBtn"] && (this["_oldTriggerContent"] = this['triggerBtn']["innerHTML"], this["_oldTriggerTooltip"] = this["triggerBtn"]["getAttribute"]("data-tooltip"), this["_oldTriggerAriaLabel"] = this["triggerBtn"]['getAttribute']("aria-label"), this['_oldTriggerTitle'] = this["triggerBtn"]["getAttribute"]("title"), this["triggerBtn"]["innerHTML"] = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line></svg>", this["triggerBtn"]["setAttribute"]('data-tooltip', freeAngleText("actions.exit")), this["triggerBtn"]["setAttribute"]("aria-label", freeAngleText("actions.exitControl")), this["triggerBtn"]['setAttribute']("title", freeAngleText("actions.exitControl")), this['triggerBtn']["classList"]["add"]("ftb-btn-exit"));
    this['state'] = {
      'rotation': 0x23,
      'pitch': 0x14,
      'scale': 0.5,
      'pan': {
        'x': 0x0,
        'y': 0x0
      }
    };
    this["_modelCatalog"] = buildImageFreeAngleModelCatalog();
    const _0x1a6d0c = getDefaultImageFreeAngleModelState(this["_modelCatalog"]);
    this['_currentModel'] = _0x1a6d0c["model"] || "nano-banana-2-lite";
    this["_currentProvider"] = _0x1a6d0c["provider"] || "grsai";
    this["_createUI"]();
    this['_bindEvents']();
    this["_unsubscribeLocale"] = onLocaleChange(() => this["_syncLocaleTexts"]());
    this['_syncLocaleTexts']();
    this["_updateView"]();
  },
  '_createUI'() {
    const _0x517a88 = this["containerEl"];
    _0x517a88["innerHTML"] = '';
    const _0x113df3 = document["createElement"]('div');
    _0x113df3['className'] = "v2-free-angle-embedded";
    let _0x2fb258 = this["nodeData"]['imageUrl'] || this["nodeData"]["sourceUrl"] || this["nodeData"]["thumbUrl"] || this['nodeData']['src'] || localPathToUrl(this["nodeData"]["localPath"]);
    const _0x4ff323 = this['_modelCatalog'] || buildImageFreeAngleModelCatalog();
    this["_modelCatalog"] = _0x4ff323;
    this["_functionSelection"] = getImageFunctionSelection(this["_currentModel"], this["nodeData"], this["nodeData"]["imageSize"] || '2K');
    _0x113df3['innerHTML'] = "\n      <div class=\"fa-header\">\n        <span class=\"fa-title\">" + freeAngleText("panel.title") + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<button\x20class=\x22fa-close-btn\x22>×</button>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22fa-content\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22fa-preview-area\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20class=\x22fa-reset-btn\x22>' + freeAngleText('actions.reset') + "</button>\n          <div class=\"fa-cube-container\">\n            <div class=\"fa-cube\">\n              <div class=\"fa-cube-face face-front\">\n                <img src=\"" + _0x2fb258 + "\" class=\"fa-face-img\" />\n              </div>\n              <div class=\"fa-cube-face face-back\">" + freeAngleText("cube.back") + "</div>\n              <div class=\"fa-cube-face face-right\">" + freeAngleText("cube.right") + "</div>\n              <div class=\"fa-cube-face face-left\">" + freeAngleText('cube.left') + "</div>\n              <div class=\"fa-cube-face face-top\">" + freeAngleText('cube.top') + "</div>\n              <div class=\"fa-cube-face face-bottom\">" + freeAngleText("cube.bottom") + "</div>\n            </div>\n          </div>\n        </div>\n        <div class=\"fa-controls\">\n          <div class=\"fa-control-item\">\n            <div class=\"fa-control-label-row\" style=\"display:flex;justify-content:space-between;\">\n              <span class=\"fa-label fa-label-rotation\">" + freeAngleText('controls.rotation') + "</span>\n              <span class=\"fa-value\" id=\"val-rotation\">35.0°</span>\n            </div>\n            <input type=\"range\" class=\"fa-slider\" id=\"sld-rotation\" min=\"0\" max=\"360\" step=\"0.5\" value=\"35\">\n          </div>\n          <div class=\"fa-control-item\">\n            <div class=\"fa-control-label-row\" style=\"display:flex;justify-content:space-between;\">\n              <span class=\"fa-label fa-label-pitch\">" + freeAngleText("controls.pitch") + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22fa-value\x22\x20id=\x22val-pitch\x22>20.0°</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<input\x20type=\x22range\x22\x20class=\x22fa-slider\x22\x20id=\x22sld-pitch\x22\x20min=\x22-30\x22\x20max=\x2260\x22\x20step=\x220.5\x22\x20value=\x2220\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22fa-control-item\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22fa-control-label-row\x22\x20style=\x22display:flex;justify-content:space-between;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22fa-label\x20fa-label-distance\x22>' + freeAngleText("controls.distance") + "</span>\n              <span class=\"fa-value\" id=\"val-scale\">0.50</span>\n            </div>\n            <input type=\"range\" class=\"fa-slider\" id=\"sld-scale\" min=\"0.1\" max=\"2\" step=\"0.05\" value=\"0.5\">\n          </div>\n          <div class=\"fa-footer\">\n            " + renderImageFunctionControls(this['_functionSelection'], _0x4ff323) + "\n            <div class=\"fa-footer-actions\">\n              <button type=\"button\" class=\"fa-debug-btn debug-wrench-btn\" title=\"" + freeAngleText('actions.debugApiParams') + "\">\n                " + DEBUG_WRENCH_ICON_HTML + "\n              </button>\n              <button class=\"fa-gen-btn img-gen-btn\" title=\"" + freeAngleText("actions.generate") + "\">\n                <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"5\"/><polyline points=\"5 12 12 5 19 12\"/></svg>\n              </button>\n            </div>\n          </div>\n        </div>\n      </div>\n    ";
    _0x113df3["querySelector"](".fa-close-btn")["onclick"] = () => this["_exit"]();
    _0x113df3["addEventListener"]('click', _0x3cf01a => {
      _0x3cf01a["stopPropagation"]();
    });
    _0x113df3["addEventListener"]("mousedown", _0x30e29e => {
      _0x30e29e["stopPropagation"]();
    });
    _0x517a88["appendChild"](_0x113df3);
    this["cubeEl"] = _0x113df3["querySelector"](".fa-cube");
    this["wrapperEl"] = _0x113df3;
    const _0x29030f = _0x113df3["querySelector"](".fa-face-img");
    this["nodeData"]["thumbId"] && _0x29030f && void this["_hydrateFaceImageFromStorage"]({
      'nodeId': this["nodeId"],
      'thumbId': this["nodeData"]["thumbId"],
      'imageEl': _0x29030f
    });
  },
  async '_hydrateFaceImageFromStorage'({
    nodeId: _0x413c40,
    thumbId: _0x31a923,
    imageEl: _0x553f19
  }) {
    try {
      const _0x560319 = await getImage(_0x31a923);
      if (!_0x560319) {
        return;
      }
      const _0x3cf49e = URL["createObjectURL"](_0x560319);
      if (!this['active'] || this["nodeId"] !== _0x413c40 || _0x553f19?.["isConnected"] === ![]) {
        URL["revokeObjectURL"](_0x3cf49e);
        return;
      }
      String(this["_faceImageObjectUrl"] || '')["startsWith"]("blob:") && URL["revokeObjectURL"](this["_faceImageObjectUrl"]);
      this["_faceImageObjectUrl"] = _0x3cf49e;
      _0x553f19["src"] = _0x3cf49e;
    } catch (_0x487138) {}
  },
  '_syncLocaleTexts'() {
    this["triggerBtn"]?.['classList']?.["contains"]("ftb-btn-exit") && (this["triggerBtn"]["setAttribute"]("data-tooltip", freeAngleText('actions.exit')), this['triggerBtn']['setAttribute']('aria-label', freeAngleText("actions.exitControl")), this['triggerBtn']['setAttribute']("title", freeAngleText("actions.exitControl")));
    if (!this["wrapperEl"]) {
      return;
    }
    const _0x8657a4 = (_0x447b6e, _0x824e65) => {
      const _0x1a8be8 = this["wrapperEl"]["querySelector"](_0x447b6e);
      if (_0x1a8be8) {
        _0x1a8be8['textContent'] = _0x824e65;
      }
    };
    const _0x22a77b = (_0xc59e76, _0x3a3541) => {
      const _0x4d5520 = this["wrapperEl"]["querySelector"](_0xc59e76);
      if (_0x4d5520) {
        _0x4d5520['title'] = _0x3a3541;
      }
    };
    _0x8657a4(".fa-title", freeAngleText("panel.title"));
    _0x8657a4('.fa-reset-btn', freeAngleText('actions.reset'));
    _0x8657a4(".face-back", freeAngleText('cube.back'));
    _0x8657a4(".face-right", freeAngleText("cube.right"));
    _0x8657a4(".face-left", freeAngleText('cube.left'));
    _0x8657a4('.face-top', freeAngleText("cube.top"));
    _0x8657a4(".face-bottom", freeAngleText("cube.bottom"));
    _0x8657a4(".fa-label-rotation", freeAngleText("controls.rotation"));
    _0x8657a4(".fa-label-pitch", freeAngleText("controls.pitch"));
    _0x8657a4(".fa-label-distance", freeAngleText('controls.distance'));
    _0x22a77b(".fa-debug-btn", freeAngleText('actions.debugApiParams'));
    _0x22a77b(".fa-gen-btn", freeAngleText('actions.generate'));
  },
  '_updateView'() {
    if (!this["active"]) {
      return;
    }
    const {
      rotation: _0x325348,
      pitch: _0x415eb9,
      scale: _0x4ed70c
    } = this["state"];
    const _0x5e1126 = (_0x325348 % 0x168 + 0x168) % 0x168;
    this['wrapperEl']['querySelector']("#val-rotation")["textContent"] = _0x5e1126["toFixed"](0x1) + '°';
    this["wrapperEl"]["querySelector"]("#val-pitch")["textContent"] = _0x415eb9["toFixed"](0x1) + '°';
    this["wrapperEl"]["querySelector"]('#val-scale')["textContent"] = '' + _0x4ed70c["toFixed"](0x2);
    this["wrapperEl"]['querySelector']("#sld-rotation")["value"] = _0x5e1126;
    this["wrapperEl"]["querySelector"]("#sld-pitch")["value"] = _0x415eb9;
    this['wrapperEl']['querySelector']('#sld-scale')['value'] = _0x4ed70c;
    this["cubeEl"]["style"]["transform"] = 'rotateX(' + -_0x415eb9 + "deg) rotateY(" + (_0x5e1126 - 0x168) + "deg)";
    const _0x1133f9 = FREE_ANGLE_VISUAL_SCALE_MIN + (_0x4ed70c - FREE_ANGLE_DISTANCE_MIN) * ((FREE_ANGLE_PREVIOUS_DISTANCE_ONE_VISUAL_SCALE - FREE_ANGLE_VISUAL_SCALE_MIN) / (FREE_ANGLE_DISTANCE_MAX - FREE_ANGLE_DISTANCE_MIN));
    this["cubeEl"]["parentElement"]["style"]['transform'] = "scale(" + _0x1133f9 + ')';
  },
  '_bindEvents'() {
    const _0x1b788e = this["wrapperEl"];
    _0x1b788e['querySelector']("#sld-rotation")["oninput"] = _0x583544 => {
      this["state"]["rotation"] = parseFloat(_0x583544["target"]["value"]);
      this["_updateView"]();
    };
    _0x1b788e["querySelector"]("#sld-pitch")["oninput"] = _0x404c59 => {
      this["state"]["pitch"] = parseFloat(_0x404c59["target"]["value"]);
      this["_updateView"]();
    };
    _0x1b788e['querySelector']("#sld-scale")["oninput"] = _0x45e218 => {
      this["state"]["scale"] = parseFloat(_0x45e218['target']['value']);
      this["_updateView"]();
    };
    _0x1b788e["querySelector"](".fa-reset-btn")["onclick"] = () => {
      this["state"] = {
        'rotation': 0x23,
        'pitch': 0x14,
        'scale': 0.5,
        'pan': {
          'x': 0x0,
          'y': 0x0
        }
      };
      this["_updateView"]();
    };
    const _0x5731af = _0x1b788e["querySelector"]('.fa-preview-area');
    let _0x9cf3df = ![];
    let _0x25bce7 = ![];
    let _0x4f7130 = {
      'x': 0x0,
      'y': 0x0
    };
    _0x5731af['onmousedown'] = _0x488ded => {
      _0x9cf3df = !![];
      if (_0x488ded["button"] === 0x2) {
        _0x25bce7 = !![];
      }
      _0x4f7130 = {
        'x': _0x488ded["clientX"],
        'y': _0x488ded["clientY"]
      };
      _0x488ded["preventDefault"]();
      _0x488ded["stopPropagation"]();
    };
    const _0x36d3ab = _0x5337aa => {
      if (!_0x9cf3df) {
        return;
      }
      const _0x332f27 = _0x5337aa['clientX'] - _0x4f7130['x'];
      const _0x37d17e = _0x5337aa['clientY'] - _0x4f7130['y'];
      _0x4f7130 = {
        'x': _0x5337aa['clientX'],
        'y': _0x5337aa["clientY"]
      };
      _0x25bce7 && (this["state"]['pan']['x'] += _0x332f27, this["state"]["pan"]['y'] += _0x37d17e);
      !_0x25bce7 && (this["state"]['rotation'] += _0x332f27 * 0.5, this["state"]['pitch'] += _0x37d17e * 0.5, this["state"]["pitch"] = Math["max"](-0x1e, Math["min"](0x3c, this["state"]["pitch"])));
      this["_updateView"]();
    };
    const _0x306ebd = () => {
      _0x9cf3df = ![];
      _0x25bce7 = ![];
    };
    window["addEventListener"]('mousemove', _0x36d3ab);
    window["addEventListener"]("mouseup", _0x306ebd);
    this['_cleanupHandlers'] = () => {
      window["removeEventListener"]("mousemove", _0x36d3ab);
      window["removeEventListener"]('mouseup', _0x306ebd);
    };
    _0x5731af["onwheel"] = _0x4984e2 => {
      _0x4984e2['preventDefault']();
      _0x4984e2["stopPropagation"]();
      const _0x250b36 = _0x4984e2["deltaY"] > 0x0 ? -0.05 : 0.05;
      this["state"]["scale"] = Math["max"](0.1, Math["min"](0x2, this["state"]['scale'] + _0x250b36));
      this["_updateView"]();
    };
    _0x5731af['oncontextmenu'] = _0x338a19 => _0x338a19['preventDefault']();
    _0x1b788e["querySelector"](".fa-gen-btn")["onclick"] = () => this["_handleGenerate"]();
    _0x1b788e["querySelector"](".fa-debug-btn")['onclick'] = _0x1b3632 => {
      _0x1b3632["stopPropagation"]();
      this["_handleDebug"]();
    };
    this["_functionControls"] = bindImageFunctionControls(_0x1b788e, {
      'selection': this["_functionSelection"],
      'onChange': _0x9f8dcb => {
        this["_functionSelection"] = _0x9f8dcb;
        this['_currentModel'] = _0x9f8dcb["modelId"];
        this["_currentProvider"] = _0x9f8dcb["provider"];
        !isImageFreeAngleOnlyModel(_0x9f8dcb['modelId']) && a1095_0x7f854a["updateNodeData"](this["nodeId"], {
          'model': _0x9f8dcb['modelId'],
          'provider': _0x9f8dcb["provider"],
          'generationParams': _0x9f8dcb['generationParams'],
          'generationParamsByModel': _0x9f8dcb["generationParamsByModel"],
          'providerProfileId': _0x9f8dcb["providerProfileId"],
          'providerProfileIdByModel': _0x9f8dcb["providerProfileIdByModel"]
        });
      }
    });
  },
  '_exit'() {
    if (!this["active"]) {
      return;
    }
    this['_functionControls']?.["destroy"]();
    this["_functionControls"] = null;
    this['active'] = ![];
    this["nodeId"] = null;
    String(this["_faceImageObjectUrl"] || '')['startsWith']("blob:") && URL["revokeObjectURL"](this["_faceImageObjectUrl"]);
    this["_faceImageObjectUrl"] = '';
    this["_unsubscribeLocale"] && (this["_unsubscribeLocale"](), this["_unsubscribeLocale"] = null);
    if (this["_cleanupHandlers"]) {
      this["_cleanupHandlers"]();
    }
    if (this["_cleanupModelMenu"]) {
      this["_cleanupModelMenu"]();
    }
    if (this["_cleanupSubmenuClick"]) {
      this["_cleanupSubmenuClick"]();
    }
    if (this['containerEl']) {
      this["containerEl"]["innerHTML"] = '';
    }
    this["triggerBtn"] && (this['triggerBtn']["innerHTML"] = this["_oldTriggerContent"], this["_oldTriggerTooltip"] != null ? this['triggerBtn']["setAttribute"]("data-tooltip", this["_oldTriggerTooltip"]) : this["triggerBtn"]['removeAttribute']("data-tooltip"), this["_oldTriggerAriaLabel"] != null ? this["triggerBtn"]["setAttribute"]("aria-label", this["_oldTriggerAriaLabel"]) : this["triggerBtn"]["removeAttribute"]("aria-label"), this['_oldTriggerTitle'] != null ? this['triggerBtn']['setAttribute']('title', this["_oldTriggerTitle"]) : this["triggerBtn"]['removeAttribute']('title'), this["triggerBtn"]["classList"]["remove"]("ftb-btn-exit"));
    this["_oldTriggerContent"] = null;
    this["_oldTriggerTooltip"] = null;
    this['_oldTriggerAriaLabel'] = null;
    this["_oldTriggerTitle"] = null;
    this["_modelCatalog"] = null;
    if (this["onDone"]) {
      this["onDone"]();
    }
  },
  async '_handleGenerate'() {
    if (!this["nodeId"]) {
      return;
    }
    const {
      rotation: _0xed7df4,
      pitch: _0x3ebd6,
      scale: _0x3406f6
    } = this["state"];
    a1095_0x7f854a["updateNodeData"](this['nodeId'], {
      'cameraAngle': {
        'rotation': _0xed7df4,
        'pitch': _0x3ebd6,
        'scale': _0x3406f6
      }
    });
    const _0x1d0ec8 = a1095_0x7f854a["getStateRaw"]();
    const _0x4b2e98 = _0x1d0ec8['nodes']?.[this['nodeId']];
    if (!_0x4b2e98) {
      return;
    }
    let _0xcf325 = this["_currentModel"] || "nano-banana-2";
    const _0x5b7cea = getImageFunctionRequestSettings(this["_functionSelection"]);
    const _0x509a2e = _resolveImageProvider(_0xcf325, this["_currentProvider"] || _0x4b2e98["provider"]);
    let _0x5c51ba = null;
    const _0x2ed59c = document["getElementById"](this["nodeId"]);
    if (_0x2ed59c) {
      const _0x27e1da = _0x2ed59c["querySelector"]("img");
      _0x27e1da && (_0x5c51ba = _0x27e1da["src"]);
    }
    !_0x5c51ba && _0x4b2e98['imageUrl'] && (_0x5c51ba = _0x4b2e98["imageUrl"]);
    !_0x5c51ba && _0x4b2e98['outputImage'] && (_0x5c51ba = _0x4b2e98["outputImage"]);
    const _0x26d921 = _0x4b2e98["aspectRatio"] || '';
    const _0x240a81 = isAdaptiveRatioLabel(_0x26d921);
    const _0x93e8f = resolveImageFreeAngleSourceSize(_0x4b2e98, _0x2ed59c?.["querySelector"]("img"));
    const _0x3bdcf8 = resolveImageFreeAngleAspectRatio({
      'aspectRatio': _0x26d921,
      'provider': _0x509a2e,
      'model': _0xcf325,
      'imageSize': _0x5b7cea["imageSize"] || _0x4b2e98["imageSize"] || '2K',
      'sourceSize': _0x93e8f
    });
    await ensureConfig();
    const _0x32e3e0 = getProviderConfig(_0x5b7cea["providerProfileId"] || _0x509a2e);
    let _0x287bee = '';
    if (_0x509a2e === "runninghub") {
      _0x287bee = isRunningHubModelApiImageTask(_0xcf325, _0x509a2e) ? _0x32e3e0["modelApiKey"] || '' : _0x32e3e0["apiKey"] || '';
    } else {
      _0x509a2e === "runninghubwf" ? _0x287bee = _0x32e3e0["apiKey"] || '' : _0x287bee = _0x32e3e0["apiKey"] || window['_appApiKey'] || '';
    }
    const _0x216a3d = {
      'prompt': '',
      'model': _0xcf325,
      'aspectRatio': _0x3bdcf8,
      'imageSize': _0x4b2e98["imageSize"] || '2K',
      ..._0x5b7cea,
      'batchSize': 0x1,
      'inputUrls': _0x5c51ba ? [_0x5c51ba] : [],
      'apiKey': _0x287bee,
      'provider': _0x509a2e,
      'cameraAngle': {
        'rotation': _0xed7df4,
        'pitch': _0x3ebd6,
        'scale': _0x3406f6
      }
    };
    const _0x9576a3 = Date["now"]();
    const _0x2d6b20 = _isRunningHubTaskModel(_0xcf325, _0x509a2e);
    const _0x3f75b0 = _isDreaminaTaskModel(_0xcf325, _0x509a2e);
    const _0x14fac4 = !_0x2d6b20 && !_0x3f75b0;
    const _0x5e1f98 = String(_0x509a2e || '')["trim"]()["toLowerCase"]();
    const _0x3dc8b7 = shouldUseRunningHubOpenapiQuery(_0xcf325, _0x509a2e);
    let _0x47db31 = 0x120;
    let _0x26d99f = 0x120;
    const _0x2c26b5 = _0x3bdcf8['split'](':');
    const _0x264cde = _0x240a81 && _0x93e8f ? _0x93e8f : {
      'width': parseFloat(_0x2c26b5[0x0]),
      'height': parseFloat(_0x2c26b5[0x1])
    };
    if (_0x264cde['width'] > 0x0 && _0x264cde["height"] > 0x0) {
      const _0x55e939 = getAutoMediaSizeByShortSide(_0x264cde["width"], _0x264cde["height"]);
      _0x47db31 = _0x55e939["width"];
      _0x26d99f = _0x55e939['height'];
    }
    const {
      x: _0x5d8233,
      y: _0x19bc2e
    } = calcSafeSpawnPosNearNode(_0x1d0ec8["nodes"], _0x4b2e98, _0x47db31, _0x26d99f);
    const _0x279cef = generateId("source-image-rotate");
    const _0x5d7461 = () => {
      return isTaskCancelled(a1095_0x7f854a["getState"]()['nodes']?.[_0x279cef]);
    };
    const _0x2f2b8e = getImageFunctionModelDisplayName(_0xcf325, this["_modelCatalog"] || buildImageFreeAngleModelCatalog());
    a1095_0x7f854a["addNode"](buildSourceMediaNodePayload({
      'id': _0x279cef,
      'type': 'source-image',
      'x': _0x5d8233,
      'y': _0x19bc2e,
      'width': _0x47db31,
      'height': _0x26d99f,
      'name': freeAngleText("output.generatingName"),
      'src': '',
      ...buildGenerationStartPatch({
        'startedAt': _0x9576a3
      }),
      ...(_0x2d6b20 || _0x3f75b0 || _0x14fac4 ? {
        'provider': _0x509a2e,
        'model': _0xcf325
      } : {}),
      ...(_0x2d6b20 ? {
        'rhSourceNodeId': _0x4b2e98['id'],
        'rhToolbarTaskType': "image-free-angle"
      } : {}),
      ...(_0x2d6b20 ? _buildRunningHubTaskPatch({
        'taskId': '',
        'status': "pending",
        'startedAt': _0x9576a3,
        'recovering': ![],
        'useOpenapiQuery': _0x3dc8b7
      }) : {}),
      ...(_0x3f75b0 ? _buildDreaminaTaskPatch({
        'submitId': '',
        'status': "pending",
        'phase': "generating",
        'label': freeAngleText("task.submitting"),
        'startedAt': _0x9576a3,
        'recovering': ![]
      }) : {}),
      ...(_0x14fac4 ? _buildAsyncTaskPatch({
        'provider': _0x5e1f98,
        'kind': 'image',
        'taskId': '',
        'status': "pending",
        'startedAt': _0x9576a3,
        'recovering': ![]
      }) : {}),
      'outputText': buildFreeAngleOutputText(_0x2f2b8e, {
        'rotation': _0xed7df4,
        'pitch': _0x3ebd6,
        'scale': _0x3406f6
      })
    }));
    (_0x2d6b20 || _0x3f75b0 || _0x14fac4) && _persistRunningHubResumeCache();
    a1095_0x7f854a["setSelectedNodes"]([_0x279cef]);
    try {
      const _0x526ed2 = await generateImage(_0x216a3d, {
        'onTaskMeta': ({
          taskId: _0x50c453,
          useOpenapiQuery: _0x4b07a9,
          provider: _0xc49de,
          providerProfileId: _0x44007c,
          rhProviderProfileId: _0xebb87e
        }) => {
          const _0x3b1f8a = String(_0x50c453 || '')["trim"]();
          if (!_0x3b1f8a) {
            return;
          }
          const _0x243cb3 = a1095_0x7f854a['getState']()['nodes']?.[_0x279cef];
          if (!_0x243cb3) {
            return;
          }
          if (_0x5d7461()) {
            return;
          }
          if (_0x2d6b20) {
            const _0x31536b = String(_0x44007c || _0xebb87e || '')['trim']();
            a1095_0x7f854a["updateNodeData"](_0x279cef, {
              ...(_0x31536b ? {
                'taskProviderProfileId': _0x31536b,
                'providerProfileId': _0x31536b,
                'rhProviderProfileId': _0x31536b
              } : {}),
              ..._buildRunningHubTaskPatch({
                'taskId': _0x3b1f8a,
                'status': "running",
                'startedAt': _0x9576a3,
                'recovering': ![],
                'useOpenapiQuery': _0x4b07a9 === !![]
              })
            });
            _persistRunningHubResumeCache();
            return;
          }
          if (_0x3f75b0) {
            a1095_0x7f854a["updateNodeData"](_0x279cef, {
              ..._buildDreaminaTaskPatch({
                'submitId': _0x3b1f8a,
                'status': "pending",
                'phase': "generating",
                'label': freeAngleText("task.generating"),
                'startedAt': _0x9576a3,
                'recovering': ![]
              })
            });
            _persistRunningHubResumeCache();
            return;
          }
          _0x14fac4 && (a1095_0x7f854a['updateNodeData'](_0x279cef, {
            ..._buildAsyncTaskPatch({
              'provider': String(_0xc49de || _0x243cb3?.["asyncTaskProvider"] || _0x5e1f98)["trim"](),
              'kind': 'image',
              'taskId': _0x3b1f8a,
              'status': 'running',
              'startedAt': _0x9576a3,
              'recovering': ![]
            })
          }), _persistRunningHubResumeCache());
        },
        'onTaskId': _0x5fe801 => {
          const _0x3684dc = String(_0x5fe801 || '')["trim"]();
          if (!_0x3684dc) {
            return;
          }
          const _0x558e7f = a1095_0x7f854a['getState']()['nodes']?.[_0x279cef];
          if (!_0x558e7f) {
            return;
          }
          if (_0x5d7461()) {
            return;
          }
          if (_0x2d6b20) {
            a1095_0x7f854a["updateNodeData"](_0x279cef, {
              ..._buildRunningHubTaskPatch({
                'taskId': _0x3684dc,
                'status': "running",
                'startedAt': _0x9576a3,
                'recovering': ![],
                'useOpenapiQuery': _0x558e7f?.["rhTaskUseOpenapiQuery"] === !![] || _0x3dc8b7
              })
            });
            _persistRunningHubResumeCache();
            return;
          }
          if (_0x3f75b0) {
            a1095_0x7f854a["updateNodeData"](_0x279cef, {
              ..._buildDreaminaTaskPatch({
                'submitId': _0x3684dc,
                'status': "pending",
                'phase': "generating",
                'label': freeAngleText("task.generating"),
                'startedAt': _0x9576a3,
                'recovering': ![]
              })
            });
            _persistRunningHubResumeCache();
            return;
          }
          _0x14fac4 && (a1095_0x7f854a['updateNodeData'](_0x279cef, {
            ..._buildAsyncTaskPatch({
              'provider': String(_0x558e7f?.["asyncTaskProvider"] || _0x5e1f98)["trim"](),
              'kind': 'image',
              'taskId': _0x3684dc,
              'status': "running",
              'startedAt': _0x9576a3,
              'recovering': ![]
            })
          }), _persistRunningHubResumeCache());
        }
      });
      if (_0x5d7461()) {
        return;
      }
      const _0x22cfa4 = _0x526ed2 && _0x526ed2["isBatch"] && Array["isArray"](_0x526ed2["images"]) && _0x526ed2["images"][0x0] ? _0x526ed2["images"][0x0] : _0x526ed2;
      if (_0x22cfa4?.["error"]) {
        throw new Error(String(_0x22cfa4['error']));
      }
      const _0x55798e = pickResultLocalPath(_0x22cfa4);
      const _0x400277 = localPathToUrl(_0x55798e) || _0x22cfa4?.["sourceUrl"] || _0x22cfa4?.["imageUrl"] || _0x22cfa4?.["url"] || '';
      if (!_0x400277) {
        throw new Error(freeAngleText("errors.noGeneratedImageUrl"));
      }
      const _0x31c817 = _0x2beeee => {
        const _0x56f340 = String(_0x2beeee || '');
        const _0x153f25 = _0x56f340["split"]('/')["pop"]() || '';
        return _0x153f25;
      };
      const _0x40e27f = a1095_0x7f854a["getState"]()["nodes"]?.[_0x279cef];
      const _0x354f91 = _0x40e27f?.["generationStartTime"] ? Date["now"]() - _0x40e27f["generationStartTime"] : 0x0;
      const _0x411950 = buildImageGenerationResultPatch({
        ..._0x22cfa4,
        'localPath': _0x55798e,
        'sourceUrl': _0x22cfa4?.["sourceUrl"] || _0x22cfa4?.["imageUrl"] || _0x400277,
        'imageUrl': _0x22cfa4?.["imageUrl"] || _0x22cfa4?.["sourceUrl"] || _0x400277,
        'thumbUrl': _0x22cfa4?.["thumbUrl"] || _0x22cfa4?.["sourceUrl"] || _0x22cfa4?.["imageUrl"] || ''
      }, {
        'startedAt': _0x9576a3,
        'duration': _0x354f91
      });
      a1095_0x7f854a["updateNodeData"](_0x279cef, {
        ..._0x411950,
        'name': freeAngleText("output.resultName"),
        'src': _0x400277,
        'fileName': _0x55798e ? _0x31c817(_0x55798e) : '',
        ...(_0x2d6b20 ? _buildRunningHubTaskPatch({
          'taskId': _0x40e27f?.["rhTaskId"] || '',
          'status': "success",
          'startedAt': _0x9576a3,
          'recovering': ![],
          'useOpenapiQuery': _0x40e27f?.["rhTaskUseOpenapiQuery"] === !![] || _0x3dc8b7
        }) : {}),
        ...(_0x3f75b0 ? _buildDreaminaTaskPatch({
          'submitId': _0x40e27f?.["dreaminaSubmitId"] || '',
          'status': 'success',
          'phase': "done",
          'label': freeAngleText("task.completed"),
          'startedAt': _0x9576a3,
          'recovering': ![]
        }) : {}),
        ...(_0x14fac4 ? _buildAsyncTaskPatch({
          'provider': _0x40e27f?.["asyncTaskProvider"] || _0x5e1f98,
          'kind': 'image',
          'taskId': _0x40e27f?.['asyncTaskId'] || '',
          'status': "success",
          'startedAt': _0x9576a3,
          'recovering': ![]
        }) : {})
      });
      (_0x2d6b20 || _0x3f75b0 || _0x14fac4) && _persistRunningHubResumeCache();
      window["showToast"]?.(freeAngleText("toasts.success"), "success");
    } catch (_0x25b3f0) {
      if (_0x5d7461()) {
        return;
      }
      const _0xe414de = a1095_0x7f854a["getState"]()["nodes"]?.[_0x279cef];
      if (_0xe414de) {
        const _0x33d949 = _0xe414de?.["generationStartTime"] ? Date["now"]() - _0xe414de["generationStartTime"] : 0x0;
        const _0x1099b5 = _0x25b3f0?.["message"] || freeAngleText('errors.unknown');
        a1095_0x7f854a["updateNodeData"](_0x279cef, {
          ...buildImageGenerationFailurePatch({
            'error': _0x1099b5,
            'startedAt': _0x9576a3,
            'duration': _0x33d949
          }),
          'name': freeAngleText("output.failedName"),
          'src': '',
          ...(_0x2d6b20 ? _buildRunningHubTaskPatch({
            'taskId': _0xe414de?.["rhTaskId"] || '',
            'status': "failed",
            'startedAt': _0x9576a3,
            'recovering': ![],
            'useOpenapiQuery': _0xe414de?.["rhTaskUseOpenapiQuery"] === !![] || _0x3dc8b7
          }) : {}),
          ...(_0x3f75b0 ? _buildDreaminaTaskPatch({
            'submitId': _0xe414de?.["dreaminaSubmitId"] || '',
            'status': "failed",
            'phase': "failed",
            'label': _0x1099b5 || freeAngleText("task.failed"),
            'startedAt': _0x9576a3,
            'recovering': ![]
          }) : {}),
          ...(_0x14fac4 ? _buildAsyncTaskPatch({
            'provider': _0xe414de?.['asyncTaskProvider'] || _0x5e1f98,
            'kind': 'image',
            'taskId': _0xe414de?.["asyncTaskId"] || '',
            'status': "failed",
            'startedAt': _0x9576a3,
            'recovering': ![]
          }) : {}),
          'outputText': freeAngleText("output.failedReason", {
            'error': _0x1099b5
          })
        });
        (_0x2d6b20 || _0x3f75b0 || _0x14fac4) && _persistRunningHubResumeCache();
      }
      window["showToast"]?.(freeAngleText("toasts.failed", {
        'error': _0x25b3f0?.["message"] || freeAngleText("errors.unknown")
      }), 'error');
    }
  },
  async '_handleDebug'() {
    if (!this["nodeId"]) {
      return;
    }
    const _0x542314 = a1095_0x7f854a['getStateRaw']();
    const _0x3e3bf6 = _0x542314["nodes"]?.[this['nodeId']];
    if (!_0x3e3bf6) {
      return;
    }
    let _0x3234d0 = this["_currentModel"] || "nano-banana-2";
    const _0x25a5c9 = getImageFunctionRequestSettings(this["_functionSelection"]);
    const _0x2900c2 = _resolveImageProvider(_0x3234d0, this["_currentProvider"] || _0x3e3bf6["provider"]);
    const {
      rotation: _0x475a32,
      pitch: _0x4e3a16,
      scale: _0xf8bfe3
    } = this['state'];
    let _0xd5da29 = null;
    const _0x2d6c57 = document["getElementById"](this["nodeId"]);
    if (_0x2d6c57) {
      const _0x8acc58 = _0x2d6c57["querySelector"]('img');
      _0x8acc58 && (_0xd5da29 = _0x8acc58["src"]);
    }
    !_0xd5da29 && _0x3e3bf6["imageUrl"] && (_0xd5da29 = _0x3e3bf6['imageUrl']);
    !_0xd5da29 && _0x3e3bf6["outputImage"] && (_0xd5da29 = _0x3e3bf6['outputImage']);
    const _0x41225c = resolveImageFreeAngleSourceSize(_0x3e3bf6, _0x2d6c57?.["querySelector"]("img"));
    const _0x2659f3 = resolveImageFreeAngleAspectRatio({
      'aspectRatio': _0x3e3bf6["aspectRatio"] || '',
      'provider': _0x2900c2,
      'model': _0x3234d0,
      'imageSize': _0x25a5c9["imageSize"] || _0x3e3bf6["imageSize"] || '2K',
      'sourceSize': _0x41225c
    });
    await ensureConfig();
    const _0x4746da = getProviderConfig(_0x25a5c9["providerProfileId"] || _0x2900c2);
    let _0x559393 = '';
    if (_0x2900c2 === "runninghub") {
      _0x559393 = isRunningHubModelApiImageTask(_0x3234d0, _0x2900c2) ? _0x4746da["modelApiKey"] || '' : _0x4746da["apiKey"] || '';
    } else {
      _0x2900c2 === "runninghubwf" ? _0x559393 = _0x4746da["apiKey"] || '' : _0x559393 = _0x4746da["apiKey"] || window['_appApiKey'] || '';
    }
    const _0x48e3de = {
      'prompt': '',
      'model': _0x3234d0,
      'aspectRatio': _0x2659f3,
      'imageSize': _0x3e3bf6['imageSize'] || '2K',
      ..._0x25a5c9,
      'batchSize': 0x1,
      'inputUrls': _0xd5da29 ? [_0xd5da29] : [],
      'apiKey': _0x559393,
      'provider': _0x2900c2,
      'cameraAngle': {
        'rotation': _0x475a32,
        'pitch': _0x4e3a16,
        'scale': _0xf8bfe3
      }
    };
    try {
      const _0x3bcd7f = await buildGenerateImageRequest(_0x48e3de);
      openDebugRequestWindow(buildFinalApiDebugPreview(_0x3bcd7f));
    } catch (_0x5e9cbd) {
      console['error']("[ImageFreeAngleController] 调试请求构建失败:", _0x5e9cbd);
      window["showToast"]?.(freeAngleText("toasts.debugBuildFailed", {
        'error': _0x5e9cbd?.["message"] || freeAngleText("errors.unknown")
      }), 'error');
    }
  }
};
export default ImageFreeAngleController;