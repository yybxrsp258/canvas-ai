import { openDebugRequestWindow } from './debugRequestWindow.js';
import a1091_0x1b8e67 from '../core/stores/appStore.js';
import { positionCanvasEditorToolbar } from '../components/shared/canvasEditorSurface.js';
import { bindImageFunctionControls, getImageFunctionRequestSettings, getImageFunctionSelection, renderImageFunctionControls } from './imageFunctionControls.js';
import { worldToScreen, generateId } from '../core/math.js';
import { getDisplayModelName } from './providers.js';
import { IMAGE_MODELS } from '../config/modelConfig.js';
import { buildGenerateImageRequest, generateImage } from '../../api/aiImageApi.js';
import { calcSafeSpawnPosNearNode } from './nodeSpawn.js';
import { buildSourceMediaNodePayload, getNodeDefaultSize } from '../services/fileService.js';
import { OUTPUT_RATIO_SWITCH_THRESHOLD, calcDisplaySizeByMedia, resolveInputRatioBasis, resolveOutputMediaSize, shouldSwitchToOutputRatio } from '../services/mediaRatioService.js';
import { buildImageFunctionModelCatalog, findImageFunctionProviderByModel, getDefaultImageFunctionModelState } from './imageFunctionModelMenu.js';
import { DEBUG_WRENCH_ICON_HTML, formatFinalApiDebugRequest, buildFinalApiDebugPreview } from '../utils/debugRequestPreview.js';
import { resolveImageNodeUrl } from './imageNodeImageUrl.js';
import { waitForImageElementReady } from './imageOverlayReadiness.js';
import { bindImageOverlayViewportPreview } from './imageOverlayViewportPreview.js';
import { bindToolbarUpMenus, renderToolbarUpMenu } from './imageToolbarUpMenu.js';
import { buildImageGenerationFailurePatch, buildImageGenerationResultPatch } from '../components/aigenImage/imageGenerationResultRenderer.js';
import { buildGenerationStartPatch } from '../core/generationTaskLifecycle.js';
import { buildAsyncTaskPatch as a1091_0x380616, buildDreaminaTaskPatch as a1091_0x33674e, buildRunningHubTaskPatch as a1091_0x1d6b1f } from '../core/generationTaskProtocolState.js';
import { isTaskCancelled } from '../core/generationTaskUiState.js';
import { isDreaminaImageTaskModel, isRunningHubImageTaskModel, resolveImageTaskProvider, shouldUseRunningHubOpenapiQuery } from './imageTaskModelResolver.js';
import { onLocaleChange, t } from '../i18n/index.js';
const IMAGE_EXPAND_PROMPT = "移除绿区域，并在绿色区域内生成符合画面的场景";
function imageExpandText(_0x264dde, _0x4dd019 = {}) {
  return t("imageExpand." + _0x264dde, _0x4dd019);
}
const EXPAND_RATIO_OPTIONS = [{
  'value': 'original',
  'labelKey': "ratio.original"
}, {
  'value': '21:9',
  'label': "21:9"
}, {
  'value': "16:9",
  'label': "16:9"
}, {
  'value': '9:16',
  'label': "9:16"
}, {
  'value': "4:3",
  'label': "4:3"
}, {
  'value': "3:4",
  'label': "3:4"
}, {
  'value': '1:1',
  'label': "1:1"
}];
function getExpandRatioOptions() {
  return EXPAND_RATIO_OPTIONS["map"](_0x21da23 => ({
    ..._0x21da23,
    'label': _0x21da23["labelKey"] ? imageExpandText(_0x21da23["labelKey"]) : _0x21da23["label"],
    'selectedLabel': _0x21da23["value"] === "original" ? imageExpandText("ratio.selectedOriginal") : _0x21da23["label"]
  }));
}
function isRunningHubTaskModel(_0x36136c, _0x3b1719) {
  return isRunningHubImageTaskModel(_0x36136c, _0x3b1719);
}
function isDreaminaTaskModel(_0x2f4232, _0x4e7d85) {
  return isDreaminaImageTaskModel(_0x2f4232, _0x4e7d85);
}
function buildRunningHubTaskPatch({
  taskId = '',
  status = "pending",
  startedAt = 0x0,
  recovering = ![],
  useOpenapiQuery = ![]
} = {}) {
  return a1091_0x1d6b1f({
    'taskId': taskId,
    'status': status,
    'startedAt': startedAt,
    'recovering': recovering,
    'useOpenapiQuery': useOpenapiQuery
  });
}
function buildDreaminaTaskPatch({
  submitId = '',
  status = "pending",
  phase = "generating",
  label = imageExpandText("task.generating"),
  startedAt = 0x0,
  recovering = ![]
} = {}) {
  return a1091_0x33674e({
    'submitId': submitId,
    'status': status,
    'phase': phase,
    'label': label,
    'startedAt': startedAt,
    'recovering': recovering,
    'defaultLabel': imageExpandText("task.generating")
  });
}
function buildAsyncTaskPatch({
  provider = '',
  kind = "image",
  taskId = '',
  status = "pending",
  startedAt = 0x0,
  recovering = ![]
} = {}) {
  return a1091_0x380616({
    'provider': provider,
    'kind': kind,
    'taskId': taskId,
    'status': status,
    'startedAt': startedAt,
    'recovering': recovering
  });
}
function persistRunningHubResumeCache() {
  try {
    window["_triggerLocalCacheSave"]?.();
  } catch {}
}
function buildImageExpandOutputText(_0x5ce5fc, {
  error = ''
} = {}) {
  const _0x4054f8 = {
    'model': _0x5ce5fc,
    'prompt': imageExpandText("output.promptDisplay"),
    'error': error
  };
  return error ? imageExpandText("output.failed", _0x4054f8) : imageExpandText("output.started", _0x4054f8);
}
function buildExpandModelCatalog() {
  return buildImageFunctionModelCatalog(IMAGE_MODELS);
}
function findProviderKeyByModel(_0x2d6034, _0x104c71) {
  const _0x2ce5df = String(_0x104c71 || '')['trim']();
  if (!_0x2ce5df) {
    return null;
  }
  for (const [_0xedb003, _0x38ad5e] of Object['entries'](_0x2d6034 || {})) {
    const _0x3b8271 = Array["isArray"](_0x38ad5e?.["models"]) ? _0x38ad5e["models"] : [];
    if (_0x3b8271["some"](_0x453d82 => _0x453d82?.['id'] === _0x2ce5df)) {
      return _0xedb003;
    }
  }
  return findImageFunctionProviderByModel(_0x2d6034, _0x2ce5df);
}
function buildSeedreamMigrationPatch(_0xfeff39) {
  void _0xfeff39;
  return null;
}
const ImageExpandController = {
  'active': ![],
  'nodeId': null,
  'nodeData': null,
  'ratioStr': "original",
  'imageSize': '1K',
  'model': null,
  'provider': null,
  'overlayEl': null,
  'frameEl': null,
  'frameRect': null,
  '_pointerState': null,
  'imgEl': null,
  'toolbarEl': null,
  'ratioMenuEl': null,
  'sizeMenuEl': null,
  'modelMenuEl': null,
  '_unsubscribe': null,
  '_unsubscribeViewportPreview': null,
  '_view': null,
  '_expandModelCatalog': null,
  '_unbindToolbarUpMenus': null,
  '_unsubscribeLocale': null,
  'cleanup': null,
  'init'(_0x2805e6) {
    if (this["active"]) {
      return;
    }
    const _0x314ada = a1091_0x1b8e67['getStateRaw']();
    const _0x4cbc58 = _0x314ada["nodes"]?.[_0x2805e6];
    if (!_0x4cbc58) {
      return;
    }
    this["active"] = !![];
    this['nodeId'] = _0x2805e6;
    this["_expandModelCatalog"] = buildExpandModelCatalog();
    const _0x4f8ffb = this["_normalizeLegacySeedreamNode"](_0x4cbc58);
    this["nodeData"] = _0x4f8ffb;
    this['_view'] = {
      'viewport': _0x314ada["viewport"],
      'node': _0x4f8ffb
    };
    this["ratioStr"] = 'original';
    this["imageSize"] = '1K';
    const _0x270267 = this['_getExpandModelCatalog']();
    const _0x42e395 = getDefaultImageFunctionModelState(_0x270267);
    const _0x278610 = String(_0x4f8ffb?.["model"] || '')["trim"]();
    const _0x431c47 = String(_0x4f8ffb?.["provider"] || '')["trim"]();
    const _0x1e2b51 = findProviderKeyByModel(_0x270267, _0x278610);
    if (_0x1e2b51) {
      this["model"] = _0x278610;
      this["provider"] = _0x1e2b51;
    } else {
      _0x42e395['model'] ? (this["model"] = _0x42e395["model"], this['provider'] = _0x42e395["provider"]) : (this["model"] = _0x278610 || '', this["provider"] = resolveImageTaskProvider(_0x278610, _0x431c47, _0x42e395["provider"] || ''));
    }
    this["_createUI"]();
    this["_bindEvents"]();
    this["_unsubscribeLocale"] = onLocaleChange(() => this["_syncLocaleTexts"]());
    this["_unsubscribe"] = a1091_0x1b8e67["subscribeSelector"](_0x292f57 => {
      const _0x183d0f = _0x292f57["nodes"]?.[_0x2805e6];
      const _0x3464f7 = _0x292f57['viewport'] || {
        'x': 0x0,
        'y': 0x0,
        'zoom': 0x1
      };
      return {
        'hasNode': !!_0x183d0f,
        'vx': _0x3464f7['x'],
        'vy': _0x3464f7['y'],
        'vz': _0x3464f7["zoom"] || 0x1,
        'vox': _0x3464f7["_screenOriginX"] || 0x0,
        'voy': _0x3464f7["_screenOriginY"] || 0x0,
        'nx': _0x183d0f ? _0x183d0f['x'] : 0x0,
        'ny': _0x183d0f ? _0x183d0f['y'] : 0x0,
        'nw': _0x183d0f ? _0x183d0f["width"] : 0x0,
        'nh': _0x183d0f ? _0x183d0f['height'] : 0x0
      };
    }, _0x18f05e => {
      if (!_0x18f05e?.['hasNode']) {
        return;
      }
      const _0x25dfe3 = a1091_0x1b8e67['getStateRaw']()['nodes']?.[_0x2805e6];
      if (!_0x25dfe3) {
        return;
      }
      const _0x3e5beb = this["_normalizeLegacySeedreamNode"](_0x25dfe3);
      this["nodeData"] = _0x3e5beb;
      this["_view"] = {
        'viewport': {
          'x': _0x18f05e['vx'],
          'y': _0x18f05e['vy'],
          'zoom': _0x18f05e['vz'],
          '_screenOriginX': _0x18f05e['vox'],
          '_screenOriginY': _0x18f05e["voy"]
        },
        'node': _0x3e5beb
      };
      this["_updateView"](this["_view"]);
    });
    this["_unsubscribeViewportPreview"] = bindImageOverlayViewportPreview({
      'getView': () => this["_view"],
      'updateView': _0x5d2096 => {
        this["_view"] = _0x5d2096;
        this["_updateView"](_0x5d2096);
      }
    });
    this["_waitForImageAndShow"]();
  },
  '_waitForImageAndShow'() {
    this["_cancelImageReadyWait"]?.();
    this["overlayEl"]?.["classList"]['add']("visible");
    this["_cancelImageReadyWait"] = waitForImageElementReady({
      'image': this["imgEl"],
      'onReady': () => {
        this['_cancelImageReadyWait'] = null;
        if (this["active"]) {
          this["_updateView"](this['_view']);
        }
      },
      'onError': () => {
        this["_cancelImageReadyWait"] = null;
        if (!this["active"]) {
          return;
        }
        window["showToast"]?.(imageExpandText("errors.sourceImageLoadFailed"), 'error');
        this['exit']();
      }
    });
  },
  '_getExpandModelCatalog'() {
    !this["_expandModelCatalog"] && (this["_expandModelCatalog"] = buildExpandModelCatalog());
    return this["_expandModelCatalog"];
  },
  '_normalizeLegacySeedreamNode'(_0x230fcf) {
    const _0x455d11 = buildSeedreamMigrationPatch(_0x230fcf);
    if (!_0x455d11) {
      return _0x230fcf;
    }
    const _0x2a61aa = {
      ...(_0x230fcf || {}),
      ..._0x455d11
    };
    const _0x4ab590 = a1091_0x1b8e67['getStateRaw']()["nodes"]?.[this["nodeId"]];
    _0x4ab590 && a1091_0x1b8e67['updateNodeData'](this['nodeId'], _0x455d11);
    return _0x2a61aa;
  },
  '_getImageUrl'() {
    return resolveImageNodeUrl(this['nodeData'] || {}, {
      'preferPreview': !![]
    });
  },
  '_createExpandedImage'(_0x59e815, _0x5be806) {
    return new Promise((_0x455883, _0x3e1239) => {
      const _0x40874a = new Image();
      _0x40874a["crossOrigin"] = "anonymous";
      _0x40874a["onload"] = async () => {
        try {
          const _0x289c73 = document["createElement"]('canvas');
          const _0x2e078c = _0x289c73["getContext"]('2d');
          const _0x438a4e = _0x40874a['naturalWidth'];
          const _0xccb53d = _0x40874a["naturalHeight"];
          const _0x14c41a = _0x59e815;
          const _0x4690c1 = {
            'x': _0x5be806['x'] || 0x0,
            'y': _0x5be806['y'] || 0x0,
            'w': _0x5be806['width'] || 0x1,
            'h': _0x5be806["height"] || 0x1
          };
          const _0x145137 = _0x438a4e / _0x4690c1['w'];
          const _0x1d9c4a = _0xccb53d / _0x4690c1['h'];
          const _0x5be174 = Math["round"](_0x14c41a['w'] * _0x145137);
          const _0x331e6d = Math["round"](_0x14c41a['h'] * _0x1d9c4a);
          _0x289c73["width"] = _0x5be174;
          _0x289c73["height"] = _0x331e6d;
          _0x2e078c["fillStyle"] = "#00FF00";
          _0x2e078c["fillRect"](0x0, 0x0, _0x5be174, _0x331e6d);
          const _0x3a1fd4 = Math["round"]((_0x4690c1['x'] - _0x14c41a['x']) * _0x145137);
          const _0x20797f = Math["round"]((_0x4690c1['y'] - _0x14c41a['y']) * _0x1d9c4a);
          _0x2e078c["drawImage"](_0x40874a, _0x3a1fd4, _0x20797f, _0x438a4e, _0xccb53d);
          _0x289c73["toBlob"](_0xa0d311 => {
            if (_0xa0d311) {
              const _0x493d33 = URL["createObjectURL"](_0xa0d311);
              _0x455883({
                'url': _0x493d33,
                'width': _0x5be174,
                'height': _0x331e6d
              });
            } else {
              _0x3e1239(new Error(imageExpandText("errors.createExpandedImageFailed")));
            }
          }, "image/png");
        } catch (_0x35c81e) {
          _0x3e1239(_0x35c81e);
        }
      };
      _0x40874a["onerror"] = () => {
        _0x3e1239(new Error(imageExpandText("errors.sourceImageLoadFailed")));
      };
      const _0x18421e = resolveImageNodeUrl(_0x5be806, {
        'preferPreview': ![]
      });
      _0x40874a['src'] = _0x18421e;
    });
  },
  '_buildGenerationPayload'(_0x3d5cfd, _0x5cd429, _0x402e31, _0x1e6ea4 = getImageFunctionRequestSettings(this["_functionSelection"]), _0x36f512 = this["ratioStr"]) {
    const _0x3d6a5a = _0x36f512 === 'original';
    return {
      'prompt': IMAGE_EXPAND_PROMPT,
      'model': _0x3d5cfd,
      'provider': _0x5cd429,
      ...(_0x3d6a5a ? {
        'suppressAspectRatio': !![]
      } : {
        'aspectRatio': _0x36f512
      }),
      'imageSize': this["imageSize"],
      ..._0x1e6ea4,
      'inputUrls': [_0x402e31],
      'batchSize': 0x1
    };
  },
  '_formatDebugRequest'(_0x6a2d8e) {
    return formatFinalApiDebugRequest(_0x6a2d8e);
  },
  '_showDebugWindow'(_0x15662f, _0x5828d8) {
    openDebugRequestWindow({
      'outputText': _0x15662f,
      'images': _0x5828d8
    });
  },
  async '_handleDebug'() {
    let _0x53f5a2 = null;
    try {
      const _0x4938ed = a1091_0x1b8e67["getStateRaw"]();
      const _0x2bf743 = _0x4938ed["nodes"]?.[this['nodeId']];
      if (!_0x2bf743) {
        window["showToast"]?.(imageExpandText('toasts.sourceNodeMissing'), "warn");
        return;
      }
      if (!this["frameRect"]) {
        this["frameRect"] = this["_calcFrameWorldRect"]();
      }
      const _0x16d437 = String(this["model"] || '')["trim"]();
      const _0x691f0 = resolveImageTaskProvider(_0x16d437, this["provider"], '');
      const _0x5d32d9 = getImageFunctionRequestSettings(this["_functionSelection"]);
      const _0x247b16 = this["ratioStr"];
      _0x53f5a2 = await this['_createExpandedImage']({
        ...this["frameRect"]
      }, {
        ..._0x2bf743
      });
      const _0x82f27 = this["_buildGenerationPayload"](_0x16d437, _0x691f0, _0x53f5a2['url'], _0x5d32d9, _0x247b16);
      const _0xf3f9a3 = await buildGenerateImageRequest(_0x82f27);
      const _0x424678 = buildFinalApiDebugPreview(_0xf3f9a3);
      this["_showDebugWindow"](_0x424678["outputText"], _0x424678["images"]);
      window["showToast"]?.(imageExpandText('toasts.debugShown'), "warn");
    } catch (_0x584780) {
      console["error"]('[ImageExpandController]\x20调试请求构建失败:', _0x584780);
      window["showToast"]?.(imageExpandText("toasts.debugBuildFailed", {
        'error': _0x584780?.["message"] || imageExpandText('errors.unknown')
      }), 'error');
    } finally {
      _0x53f5a2?.["url"] && URL["revokeObjectURL"](_0x53f5a2["url"]);
    }
  },
  '_parseRatio'() {
    if (this["ratioStr"] === "original") {
      return (this["nodeData"]['width'] || 0x1) / (this["nodeData"]["height"] || 0x1);
    }
    const _0x572760 = this["ratioStr"]["split"](':')["map"](_0x2e0c89 => Number(_0x2e0c89));
    if (_0x572760["length"] !== 0x2 || !_0x572760[0x0] || !_0x572760[0x1]) {
      return (this["nodeData"]["width"] || 0x1) / (this["nodeData"]["height"] || 0x1);
    }
    return _0x572760[0x0] / _0x572760[0x1];
  },
  '_calcFrameWorldRect'() {
    const _0x27a8ab = this["nodeData"];
    const _0x5d2859 = _0x27a8ab['width'] || 0x1;
    const _0x5c01f6 = _0x27a8ab["height"] || 0x1;
    const _0x2ce894 = _0x27a8ab['x'] + _0x5d2859 / 0x2;
    const _0x5b6dcd = _0x27a8ab['y'] + _0x5c01f6 / 0x2;
    const _0x47645a = _0x5d2859 / _0x5c01f6;
    const _0x54f5b5 = this['_parseRatio']();
    let _0x4b46ff;
    let _0x4882a7;
    _0x54f5b5 >= _0x47645a ? (_0x4882a7 = _0x5c01f6, _0x4b46ff = _0x5c01f6 * _0x54f5b5) : (_0x4b46ff = _0x5d2859, _0x4882a7 = _0x5d2859 / _0x54f5b5);
    const _0x31e49d = 1.35;
    const _0x22b56e = Math["max"](_0x5d2859, _0x4b46ff) * _0x31e49d;
    const _0x595471 = Math["max"](_0x5c01f6, _0x4882a7) * _0x31e49d;
    return {
      'x': _0x2ce894 - _0x22b56e / 0x2,
      'y': _0x5b6dcd - _0x595471 / 0x2,
      'w': _0x22b56e,
      'h': _0x595471
    };
  },
  '_getNodeWorldRect'() {
    const _0x2ff162 = this['nodeData'] || {};
    const _0x1f30f0 = _0x2ff162['width'] || 0x1;
    const _0x58713d = _0x2ff162["height"] || 0x1;
    return {
      'x': _0x2ff162['x'] || 0x0,
      'y': _0x2ff162['y'] || 0x0,
      'w': _0x1f30f0,
      'h': _0x58713d
    };
  },
  '_clampFrameRect'(_0x1ec8de) {
    const _0xf78feb = this["_getNodeWorldRect"]();
    const _0x2dd922 = (_0x5086a5, _0x39e91c, _0x405468) => Math["min"](_0x405468, Math["max"](_0x39e91c, _0x5086a5));
    const _0x26406e = {
      'x': Number(_0x1ec8de?.['x']) || 0x0,
      'y': Number(_0x1ec8de?.['y']) || 0x0,
      'w': Number(_0x1ec8de?.['w']) || 0x1,
      'h': Number(_0x1ec8de?.['h']) || 0x1
    };
    const _0xe764e1 = Math["max"](_0xf78feb['w'], 0x18);
    const _0x4fd7e6 = Math["max"](_0xf78feb['h'], 0x18);
    _0x26406e['w'] = Math["max"](_0x26406e['w'], _0xe764e1);
    _0x26406e['h'] = Math["max"](_0x26406e['h'], _0x4fd7e6);
    if (this["ratioStr"] !== "original") {
      const _0x1058b5 = this["_parseRatio"]();
      const _0x2e6618 = _0x26406e['x'] + _0x26406e['w'] / 0x2;
      const _0x36b7b2 = _0x26406e['y'] + _0x26406e['h'] / 0x2;
      let _0xda10cb = _0x26406e['w'];
      let _0x59cd02 = _0x26406e['h'];
      _0xda10cb / _0x59cd02 > _0x1058b5 ? _0x59cd02 = _0xda10cb / _0x1058b5 : _0xda10cb = _0x59cd02 * _0x1058b5;
      _0xda10cb < _0xe764e1 && (_0xda10cb = _0xe764e1, _0x59cd02 = _0xda10cb / _0x1058b5);
      _0x59cd02 < _0x4fd7e6 && (_0x59cd02 = _0x4fd7e6, _0xda10cb = _0x59cd02 * _0x1058b5);
      _0x26406e['w'] = _0xda10cb;
      _0x26406e['h'] = _0x59cd02;
      _0x26406e['x'] = _0x2e6618 - _0x26406e['w'] / 0x2;
      _0x26406e['y'] = _0x36b7b2 - _0x26406e['h'] / 0x2;
    }
    const _0x3327d9 = _0xf78feb['x'] + _0xf78feb['w'] - _0x26406e['w'];
    const _0x5950dd = _0xf78feb['x'];
    const _0x4078a1 = _0xf78feb['y'] + _0xf78feb['h'] - _0x26406e['h'];
    const _0x4f922a = _0xf78feb['y'];
    _0x26406e['x'] = _0x2dd922(_0x26406e['x'], _0x3327d9, _0x5950dd);
    _0x26406e['y'] = _0x2dd922(_0x26406e['y'], _0x4078a1, _0x4f922a);
    return _0x26406e;
  },
  '_closeToolbarUpMenus'(_0x5e50d2 = null) {
    this["toolbarEl"]?.["querySelectorAll"]("[data-toolbar-up-menu-menu]")["forEach"](_0x4daad9 => {
      if (_0x4daad9 === _0x5e50d2) {
        return;
      }
      const _0x5f57f2 = String(_0x4daad9?.["dataset"]?.["toolbarUpMenuOpenClass"] || "open")["trim"]() || 'open';
      _0x4daad9['classList']["remove"](_0x5f57f2);
      _0x4daad9["classList"]["remove"]("open");
      _0x4daad9["classList"]["remove"]('show');
    });
  },
  '_createUI'() {
    const _0x4fbb9c = document["createElement"]("div");
    _0x4fbb9c["className"] = "v2-expand-overlay";
    const _0x252df0 = document["createElement"]('div');
    _0x252df0["className"] = "v2-expand-frame";
    ['tl', 'tr', 'bl', 'br', 'tm', 'bm', 'lm', 'rm']["forEach"](_0x26f199 => {
      const _0x1359db = document["createElement"]("div");
      _0x1359db['className'] = "v2-expand-handle " + _0x26f199;
      _0x1359db["dataset"]['handle'] = _0x26f199;
      _0x252df0['appendChild'](_0x1359db);
    });
    const _0x28bc7f = document['createElement']("img");
    _0x28bc7f["className"] = 'v2-expand-img';
    _0x28bc7f["draggable"] = ![];
    _0x28bc7f["src"] = this["_getImageUrl"]();
    _0x4fbb9c["appendChild"](_0x252df0);
    _0x4fbb9c["appendChild"](_0x28bc7f);
    document["body"]['appendChild'](_0x4fbb9c);
    this['overlayEl'] = _0x4fbb9c;
    this["frameEl"] = _0x252df0;
    this['imgEl'] = _0x28bc7f;
    this["frameRect"] = this["_calcFrameWorldRect"]();
    const _0x1d6688 = document["createElement"]("div");
    _0x1d6688["className"] = 'v2-expand-toolbar';
    const _0x4cc750 = this['_getExpandModelCatalog']();
    this['_functionSelection'] = getImageFunctionSelection(this["model"], a1091_0x1b8e67["getStateRaw"]()['nodes']?.[this["nodeId"]], this['imageSize']);
    _0x1d6688["innerHTML"] = '\x0a\x20\x20\x20\x20\x20\x20<button\x20class=\x22v2-expand-toolbar-btn\x20exit\x22\x20title=\x22' + imageExpandText("actions.exit") + "\">\n        <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M18 6L6 18M6 6l12 12\"/></svg>\n      </button>\n      " + renderImageFunctionControls(this["_functionSelection"], _0x4cc750) + "\n      " + renderToolbarUpMenu({
      'fieldId': "ratio",
      'value': this['ratioStr'],
      'options': getExpandRatioOptions(),
      'triggerClass': "ratio-toggle",
      'labelClass': "ratio-text",
      'menuClass': "v2-expand-menu ratio-menu",
      'itemClass': 'v2-expand-menu-item'
    }) + '\x0a\x20\x20\x20\x20\x20\x20<button\x20class=\x22v2-expand-toolbar-btn\x20debug-wrench-btn\x22\x20type=\x22button\x22\x20title=\x22' + imageExpandText('actions.debugApiParams') + '\x22\x20aria-label=\x22' + imageExpandText("actions.debugApiParams") + "\">\n        " + DEBUG_WRENCH_ICON_HTML + '\x0a\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20<button\x20class=\x22v2-expand-toolbar-btn\x20go\x20img-gen-btn\x22\x20title=\x22' + imageExpandText("actions.generate") + "\">\n        <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M12 19V5\"/><path d=\"M5 12l7-7 7 7\"/></svg>\n      </button>\n    ";
    const _0x20cfbb = _0x1d6688["querySelector"]("[data-toolbar-up-menu=\"ratio\"]");
    _0x1d6688['querySelector'](".ui-schema-resolution-slot")["before"](_0x20cfbb);
    document["body"]["appendChild"](_0x1d6688);
    this["toolbarEl"] = _0x1d6688;
    this["ratioMenuEl"] = _0x1d6688['querySelector'](".ratio-menu");
    this["sizeMenuEl"] = _0x1d6688["querySelector"](".size-menu");
    this["modelMenuEl"] = _0x1d6688["querySelector"](".model-menu");
    this["_updateView"](this["_view"]);
    this['_syncLocaleTexts']();
  },
  '_syncLocaleTexts'() {
    if (!this["toolbarEl"]) {
      return;
    }
    const _0x4ffa80 = this["toolbarEl"]["querySelector"](".exit");
    if (_0x4ffa80) {
      _0x4ffa80["title"] = imageExpandText("actions.exit");
    }
    const _0x1492da = this["toolbarEl"]["querySelector"](".debug-wrench-btn");
    if (_0x1492da) {
      const _0x261c3b = imageExpandText("actions.debugApiParams");
      _0x1492da["title"] = _0x261c3b;
      _0x1492da['setAttribute']('aria-label', _0x261c3b);
    }
    const _0x4d0c6a = this["toolbarEl"]["querySelector"](".go");
    if (_0x4d0c6a) {
      _0x4d0c6a['title'] = imageExpandText("actions.generate");
    }
    const _0x3e1e4a = (_0x12725d, _0x2995d1, _0x5d95b6) => {
      const _0x2f2f16 = new Map(_0x2995d1['map'](_0x261462 => [String(_0x261462["value"] || ''), _0x261462]));
      const _0x38692f = this["toolbarEl"]["querySelector"]("[data-toolbar-up-menu=\"" + _0x12725d + '\x22]');
      const _0x54acf4 = _0x2f2f16["get"](String(_0x5d95b6 || '')) || _0x2995d1[0x0];
      const _0x588a07 = _0x38692f?.["querySelector"]('[data-toolbar-up-menu-label]');
      _0x588a07 && _0x54acf4 && (_0x588a07["textContent"] = _0x54acf4["selectedLabel"] || _0x54acf4["label"] || _0x5d95b6);
      _0x38692f?.["querySelectorAll"]('[data-toolbar-up-menu-item]')?.["forEach"](_0x20e988 => {
        const _0x1aaad1 = _0x2f2f16["get"](String(_0x20e988["dataset"]["toolbarUpMenuValue"] || ''));
        if (!_0x1aaad1) {
          return;
        }
        _0x20e988["dataset"]["toolbarUpMenuLabel"] = _0x1aaad1["selectedLabel"] || _0x1aaad1["label"];
        const _0x3e933a = _0x20e988['querySelector'](".floating-menu-label");
        if (_0x3e933a) {
          _0x3e933a["textContent"] = _0x1aaad1["label"];
        }
      });
    };
    _0x3e1e4a("ratio", getExpandRatioOptions(), this["ratioStr"]);
  },
  '_updateView'(_0x51f156 = this['_view']) {
    if (!this["active"]) {
      return;
    }
    const _0x53a8b5 = _0x51f156?.["node"];
    const _0x281f49 = _0x51f156?.["viewport"];
    if (!_0x53a8b5) {
      return;
    }
    this["nodeData"] = _0x53a8b5;
    if (!this['frameRect']) {
      this["frameRect"] = this['_calcFrameWorldRect']();
    }
    this['frameRect'] = this["_clampFrameRect"](this['frameRect']);
    const _0x50de08 = this['frameRect'];
    const _0x1af536 = worldToScreen(_0x50de08['x'], _0x50de08['y'], _0x281f49);
    const _0x5d037b = Math["round"](_0x50de08['w'] * _0x281f49['zoom']);
    const _0x1570e2 = Math["round"](_0x50de08['h'] * _0x281f49['zoom']);
    this["frameEl"]["style"]['left'] = Math["round"](_0x1af536['x']) + 'px';
    this["frameEl"]["style"]["top"] = Math['round'](_0x1af536['y']) + 'px';
    this['frameEl']["style"]["width"] = _0x5d037b + 'px';
    this['frameEl']['style']['height'] = _0x1570e2 + 'px';
    const _0x3c4b37 = worldToScreen(_0x53a8b5['x'], _0x53a8b5['y'], _0x281f49);
    const _0x12153f = Math["round"](_0x53a8b5['width'] * _0x281f49["zoom"]);
    const _0x503640 = Math["round"](_0x53a8b5["height"] * _0x281f49["zoom"]);
    this["imgEl"]["style"]["left"] = Math["round"](_0x3c4b37['x']) + 'px';
    this["imgEl"]["style"]["top"] = Math["round"](_0x3c4b37['y']) + 'px';
    this["imgEl"]["style"]["width"] = _0x12153f + 'px';
    this["imgEl"]["style"]['height'] = _0x503640 + 'px';
    this["toolbarEl"] && positionCanvasEditorToolbar(this["toolbarEl"], {
      'center': _0x3c4b37['x'] + _0x12153f / 0x2,
      'top': _0x3c4b37['y'] + _0x503640 + 0xe
    });
  },
  '_bindEvents'() {
    const _0x182538 = _0x1f8bfa => {
      if (_0x1f8bfa['key'] === "Escape") {
        this['exit']();
      }
    };
    window['addEventListener']("keydown", _0x182538);
    const _0x57f1a2 = _0x12c6ac => _0x12c6ac["stopPropagation"]();
    this["overlayEl"]["addEventListener"]("wheel", _0x57f1a2, {
      'passive': !![]
    });
    this['toolbarEl']['addEventListener']("pointerdown", _0x271332 => _0x271332["stopPropagation"]());
    this['toolbarEl']['querySelector'](".exit")["onclick"] = () => this["exit"]();
    const _0x2d575d = () => {
      this["_closeToolbarUpMenus"]();
      this["_functionControls"]?.["closeMenus"]();
    };
    this["_functionControls"] = bindImageFunctionControls(this["toolbarEl"], {
      'selection': this['_functionSelection'],
      'onBeforeOpen': () => this["_closeToolbarUpMenus"](),
      'onChange': _0x254790 => {
        this["_functionSelection"] = _0x254790;
        this["model"] = _0x254790["modelId"];
        this['provider'] = _0x254790["provider"];
        this['imageSize'] = _0x254790["generationParams"]["imageSize"] || this["imageSize"];
        a1091_0x1b8e67["updateNodeData"](this["nodeId"], {
          'model': _0x254790["modelId"],
          'provider': _0x254790["provider"],
          'generationParams': _0x254790["generationParams"],
          'generationParamsByModel': _0x254790['generationParamsByModel'],
          'providerProfileId': _0x254790['providerProfileId'],
          'providerProfileIdByModel': _0x254790["providerProfileIdByModel"]
        });
      },
      'onResize': () => this["active"] && this["_updateView"](this["_view"])
    });
    this["_unbindToolbarUpMenus"] = bindToolbarUpMenus(this["toolbarEl"], {
      'onBeforeOpen': () => this["_functionControls"]?.["closeMenus"](),
      'onSelect': ({
        fieldId: _0x39d5f1,
        value: _0x143b92
      }) => {
        if (_0x39d5f1 !== "ratio") {
          return;
        }
        this["ratioStr"] = String(_0x143b92 || 'original');
        this["frameRect"] = this["_calcFrameWorldRect"]();
        this["_updateView"](this["_view"]);
      }
    });
    const _0x131638 = this["toolbarEl"]["querySelector"](".debug-wrench-btn");
    _0x131638['onclick'] = _0x1eda44 => {
      _0x1eda44["stopPropagation"]();
      _0x1eda44['preventDefault']();
      _0x2d575d();
      void this["_handleDebug"]();
    };
    this["toolbarEl"]["querySelector"](".go")['onclick'] = async () => {
      const _0x22069e = getImageFunctionRequestSettings(this["_functionSelection"]);
      const _0x3aab35 = this['ratioStr'];
      let _0x3ea60c = null;
      let _0x430342 = null;
      let _0x4ba621 = resolveInputRatioBasis();
      const _0x1724c6 = String(this["model"] || '')['trim']();
      const _0x3f7f87 = resolveImageTaskProvider(_0x1724c6, this["provider"], '');
      const _0x4c64fe = isRunningHubTaskModel(_0x1724c6, _0x3f7f87);
      const _0xa050f5 = isDreaminaTaskModel(_0x1724c6, _0x3f7f87);
      const _0x8ba173 = !_0x4c64fe && !_0xa050f5;
      const _0x819f9b = String(_0x3f7f87 || '')["trim"]()["toLowerCase"]();
      const _0x4e2209 = shouldUseRunningHubOpenapiQuery(_0x1724c6, _0x3f7f87);
      const _0x305ed2 = Date['now']();
      try {
        window["showToast"]?.(imageExpandText("toasts.generating"), "loading");
        const _0x280afa = a1091_0x1b8e67["getStateRaw"]();
        const _0x3a0ddb = _0x280afa["nodes"]?.[this["nodeId"]];
        if (!_0x3a0ddb) {
          return;
        }
        const _0x1ec1b7 = {
          ...this["frameRect"]
        };
        const _0x228201 = {
          ..._0x3a0ddb
        };
        _0x4ba621 = resolveInputRatioBasis({
          'width': _0x1ec1b7?.['w'],
          'height': _0x1ec1b7?.['h']
        }, {
          'width': _0x3a0ddb["width"],
          'height': _0x3a0ddb["height"]
        });
        const {
          width: _0x457021,
          height: _0x2a8a2b
        } = calcDisplaySizeByMedia(_0x4ba621["width"], _0x4ba621["height"]);
        const {
          x: _0x1d5e9e,
          y: _0x549b3a
        } = calcSafeSpawnPosNearNode(_0x280afa["nodes"], _0x3a0ddb, _0x457021, _0x2a8a2b);
        _0x3ea60c = generateId("source-image-expand");
        const _0x4c543c = () => {
          return isTaskCancelled(a1091_0x1b8e67['getState']()['nodes']?.[_0x3ea60c]);
        };
        a1091_0x1b8e67['addNode'](buildSourceMediaNodePayload({
          'id': _0x3ea60c,
          'type': "source-image",
          'x': _0x1d5e9e,
          'y': _0x549b3a,
          'width': _0x457021,
          'height': _0x2a8a2b,
          'needsAutoResize': ![],
          'name': imageExpandText("output.generatingName"),
          'src': '',
          ...buildGenerationStartPatch({
            'startedAt': _0x305ed2
          }),
          ...(_0x4c64fe || _0xa050f5 || _0x8ba173 ? {
            'provider': _0x3f7f87,
            'model': _0x1724c6
          } : {}),
          ...(_0x4c64fe ? {
            'rhSourceNodeId': _0x3a0ddb['id'],
            'rhToolbarTaskType': "image-expand"
          } : {}),
          ...(_0x4c64fe ? buildRunningHubTaskPatch({
            'taskId': '',
            'status': "pending",
            'startedAt': _0x305ed2,
            'recovering': ![],
            'useOpenapiQuery': _0x4e2209
          }) : {}),
          ...(_0xa050f5 ? buildDreaminaTaskPatch({
            'submitId': '',
            'status': "pending",
            'phase': "generating",
            'label': imageExpandText("task.submitting"),
            'startedAt': _0x305ed2,
            'recovering': ![]
          }) : {}),
          ...(_0x8ba173 ? buildAsyncTaskPatch({
            'provider': _0x819f9b,
            'kind': "image",
            'taskId': '',
            'status': "pending",
            'startedAt': _0x305ed2,
            'recovering': ![]
          }) : {}),
          'outputText': buildImageExpandOutputText(getDisplayModelName(this["model"]))
        }));
        (_0x4c64fe || _0xa050f5 || _0x8ba173) && persistRunningHubResumeCache();
        a1091_0x1b8e67["setSelectedNodes"]([_0x3ea60c]);
        this["exit"]();
        _0x430342 = await this["_createExpandedImage"](_0x1ec1b7, _0x228201);
        _0x4ba621 = resolveInputRatioBasis({
          'width': _0x430342?.["width"],
          'height': _0x430342?.["height"]
        }, _0x4ba621);
        const _0x416e0e = this['_buildGenerationPayload'](_0x1724c6, _0x3f7f87, _0x430342['url'], _0x22069e, _0x3aab35);
        const _0x5d5975 = await generateImage(_0x416e0e, {
          'onTaskMeta': ({
            taskId: _0x299e27,
            useOpenapiQuery: _0xb9b3be,
            provider: _0x247058,
            providerProfileId: _0x49760d,
            rhProviderProfileId: _0x1cc315
          }) => {
            const _0x428d2d = String(_0x299e27 || '')["trim"]();
            if (!_0x428d2d) {
              return;
            }
            const _0x11c05a = a1091_0x1b8e67["getState"]()["nodes"]?.[_0x3ea60c];
            if (!_0x11c05a) {
              return;
            }
            if (_0x4c543c()) {
              return;
            }
            if (_0x4c64fe) {
              const _0x3aa231 = String(_0x49760d || _0x1cc315 || '')['trim']();
              a1091_0x1b8e67['updateNodeData'](_0x3ea60c, {
                ...(_0x3aa231 ? {
                  'taskProviderProfileId': _0x3aa231,
                  'providerProfileId': _0x3aa231,
                  'rhProviderProfileId': _0x3aa231
                } : {}),
                ...buildRunningHubTaskPatch({
                  'taskId': _0x428d2d,
                  'status': "running",
                  'startedAt': _0x305ed2,
                  'recovering': ![],
                  'useOpenapiQuery': _0xb9b3be === !![]
                })
              });
              persistRunningHubResumeCache();
              return;
            }
            if (_0xa050f5) {
              a1091_0x1b8e67["updateNodeData"](_0x3ea60c, {
                ...buildDreaminaTaskPatch({
                  'submitId': _0x428d2d,
                  'status': 'pending',
                  'phase': "generating",
                  'label': imageExpandText("task.generating"),
                  'startedAt': _0x305ed2,
                  'recovering': ![]
                })
              });
              persistRunningHubResumeCache();
              return;
            }
            _0x8ba173 && (a1091_0x1b8e67["updateNodeData"](_0x3ea60c, {
              ...buildAsyncTaskPatch({
                'provider': String(_0x247058 || _0x11c05a?.["asyncTaskProvider"] || _0x819f9b)['trim'](),
                'kind': "image",
                'taskId': _0x428d2d,
                'status': "running",
                'startedAt': _0x305ed2,
                'recovering': ![]
              })
            }), persistRunningHubResumeCache());
          },
          'onTaskId': _0xebccd3 => {
            const _0x490cc3 = String(_0xebccd3 || '')["trim"]();
            if (!_0x490cc3) {
              return;
            }
            const _0x4b4b9f = a1091_0x1b8e67["getState"]()["nodes"]?.[_0x3ea60c];
            if (!_0x4b4b9f) {
              return;
            }
            if (_0x4c543c()) {
              return;
            }
            if (_0x4c64fe) {
              a1091_0x1b8e67["updateNodeData"](_0x3ea60c, {
                ...buildRunningHubTaskPatch({
                  'taskId': _0x490cc3,
                  'status': "running",
                  'startedAt': _0x305ed2,
                  'recovering': ![],
                  'useOpenapiQuery': _0x4b4b9f?.['rhTaskUseOpenapiQuery'] === !![] || _0x4e2209
                })
              });
              persistRunningHubResumeCache();
              return;
            }
            if (_0xa050f5) {
              a1091_0x1b8e67["updateNodeData"](_0x3ea60c, {
                ...buildDreaminaTaskPatch({
                  'submitId': _0x490cc3,
                  'status': "pending",
                  'phase': 'generating',
                  'label': imageExpandText("task.generating"),
                  'startedAt': _0x305ed2,
                  'recovering': ![]
                })
              });
              persistRunningHubResumeCache();
              return;
            }
            _0x8ba173 && (a1091_0x1b8e67["updateNodeData"](_0x3ea60c, {
              ...buildAsyncTaskPatch({
                'provider': String(_0x4b4b9f?.["asyncTaskProvider"] || _0x819f9b)["trim"](),
                'kind': "image",
                'taskId': _0x490cc3,
                'status': "running",
                'startedAt': _0x305ed2,
                'recovering': ![]
              })
            }), persistRunningHubResumeCache());
          }
        });
        if (_0x4c543c()) {
          return;
        }
        if (_0x5d5975["error"]) {
          const _0x1e06c4 = a1091_0x1b8e67["getState"]()["nodes"]?.[_0x3ea60c];
          const _0x269d20 = _0x1e06c4?.["generationStartTime"] ? Date['now']() - _0x1e06c4['generationStartTime'] : 0x0;
          a1091_0x1b8e67["updateNodeData"](_0x3ea60c, {
            ...buildImageGenerationFailurePatch({
              'error': _0x5d5975["error"],
              'startedAt': _0x305ed2,
              'duration': _0x269d20
            }),
            'name': imageExpandText('output.failedName'),
            ...(_0x4c64fe ? buildRunningHubTaskPatch({
              'taskId': _0x1e06c4?.["rhTaskId"] || '',
              'status': 'failed',
              'startedAt': _0x305ed2,
              'recovering': ![],
              'useOpenapiQuery': _0x1e06c4?.["rhTaskUseOpenapiQuery"] === !![] || _0x4e2209
            }) : {}),
            ...(_0xa050f5 ? buildDreaminaTaskPatch({
              'submitId': _0x1e06c4?.["dreaminaSubmitId"] || '',
              'status': "failed",
              'phase': "failed",
              'label': _0x5d5975['error'] || imageExpandText("task.failed"),
              'startedAt': _0x305ed2,
              'recovering': ![]
            }) : {}),
            ...(_0x8ba173 ? buildAsyncTaskPatch({
              'provider': _0x1e06c4?.["asyncTaskProvider"] || _0x819f9b,
              'kind': "image",
              'taskId': _0x1e06c4?.["asyncTaskId"] || '',
              'status': "failed",
              'startedAt': _0x305ed2,
              'recovering': ![]
            }) : {}),
            'outputText': buildImageExpandOutputText(getDisplayModelName(this["model"]), {
              'error': _0x5d5975["error"]
            })
          });
          (_0x4c64fe || _0xa050f5 || _0x8ba173) && persistRunningHubResumeCache();
          return;
        }
        const _0x50ff36 = a1091_0x1b8e67["getState"]()["nodes"]?.[_0x3ea60c];
        const _0x49abf7 = _0x50ff36?.["generationStartTime"] ? Date['now']() - _0x50ff36["generationStartTime"] : 0x0;
        const _0x23f887 = await resolveOutputMediaSize({
          'localPath': _0x5d5975["localPath"],
          'imageUrl': _0x5d5975['imageUrl'],
          'sourceUrl': _0x5d5975["sourceUrl"],
          'thumbUrl': _0x5d5975["thumbUrl"],
          'src': _0x5d5975["imageUrl"] || _0x5d5975["sourceUrl"] || _0x5d5975["thumbUrl"] || ''
        });
        const _0x56d942 = _0x23f887 && shouldSwitchToOutputRatio(_0x4ba621["width"], _0x4ba621["height"], _0x23f887["width"], _0x23f887["height"], OUTPUT_RATIO_SWITCH_THRESHOLD) ? calcDisplaySizeByMedia(_0x23f887['width'], _0x23f887["height"]) : calcDisplaySizeByMedia(_0x4ba621['width'], _0x4ba621["height"]);
        a1091_0x1b8e67["updateNodeData"](_0x3ea60c, {
          ...buildImageGenerationResultPatch(_0x5d5975, {
            'startedAt': _0x305ed2,
            'duration': _0x49abf7
          }),
          'name': imageExpandText("output.resultName"),
          'width': _0x56d942["width"],
          'height': _0x56d942["height"],
          ...(_0x4c64fe ? buildRunningHubTaskPatch({
            'taskId': _0x50ff36?.["rhTaskId"] || '',
            'status': 'success',
            'startedAt': _0x305ed2,
            'recovering': ![],
            'useOpenapiQuery': _0x50ff36?.["rhTaskUseOpenapiQuery"] === !![] || _0x4e2209
          }) : {}),
          ...(_0xa050f5 ? buildDreaminaTaskPatch({
            'submitId': _0x50ff36?.["dreaminaSubmitId"] || '',
            'status': 'success',
            'phase': "done",
            'label': imageExpandText("task.completed"),
            'startedAt': _0x305ed2,
            'recovering': ![]
          }) : {}),
          ...(_0x8ba173 ? buildAsyncTaskPatch({
            'provider': _0x50ff36?.["asyncTaskProvider"] || _0x819f9b,
            'kind': "image",
            'taskId': _0x50ff36?.["asyncTaskId"] || '',
            'status': "success",
            'startedAt': _0x305ed2,
            'recovering': ![]
          }) : {}),
          'outputText': buildImageExpandOutputText(getDisplayModelName(this["model"]))
        });
        (_0x4c64fe || _0xa050f5 || _0x8ba173) && persistRunningHubResumeCache();
        window["showToast"]?.(imageExpandText('toasts.success'), "success");
      } catch (_0xd832f3) {
        console["error"]("扩图生成失败:", _0xd832f3);
        if (_0x3ea60c) {
          const _0x4c12f6 = a1091_0x1b8e67["getState"]()["nodes"]?.[_0x3ea60c];
          if (isTaskCancelled(_0x4c12f6)) {
            return;
          }
          const _0xc9a54b = _0x4c12f6?.["generationStartTime"] ? Date["now"]() - _0x4c12f6["generationStartTime"] : 0x0;
          const _0x193f95 = _0xd832f3["message"] || imageExpandText("errors.unknown");
          a1091_0x1b8e67["updateNodeData"](_0x3ea60c, {
            ...buildImageGenerationFailurePatch({
              'error': _0x193f95,
              'startedAt': _0x305ed2,
              'duration': _0xc9a54b
            }),
            'name': imageExpandText("output.failedName"),
            ...(_0x4c64fe ? buildRunningHubTaskPatch({
              'taskId': _0x4c12f6?.['rhTaskId'] || '',
              'status': "failed",
              'startedAt': _0x305ed2,
              'recovering': ![],
              'useOpenapiQuery': _0x4c12f6?.["rhTaskUseOpenapiQuery"] === !![] || _0x4e2209
            }) : {}),
            ...(_0xa050f5 ? buildDreaminaTaskPatch({
              'submitId': _0x4c12f6?.["dreaminaSubmitId"] || '',
              'status': "failed",
              'phase': "failed",
              'label': _0x193f95 || imageExpandText("task.failed"),
              'startedAt': _0x305ed2,
              'recovering': ![]
            }) : {}),
            ...(_0x8ba173 ? buildAsyncTaskPatch({
              'provider': _0x4c12f6?.["asyncTaskProvider"] || _0x819f9b,
              'kind': "image",
              'taskId': _0x4c12f6?.['asyncTaskId'] || '',
              'status': "failed",
              'startedAt': _0x305ed2,
              'recovering': ![]
            }) : {}),
            'outputText': buildImageExpandOutputText(getDisplayModelName(this["model"]), {
              'error': _0x193f95
            })
          });
          (_0x4c64fe || _0xa050f5 || _0x8ba173) && persistRunningHubResumeCache();
        } else {
          window['showToast']?.(imageExpandText("toasts.failed", {
            'error': _0xd832f3["message"] || imageExpandText("errors.unknown")
          }), "error");
        }
      } finally {
        _0x430342?.["url"] && URL['revokeObjectURL'](_0x430342["url"]);
      }
    };
    const _0x55b007 = _0x37042a => {
      if (!this["toolbarEl"]["contains"](_0x37042a['target']) && !this["_functionControls"]?.["containsMenuTarget"](_0x37042a["target"])) {
        _0x2d575d();
      }
    };
    document['addEventListener']("pointerdown", _0x55b007, !![]);
    const _0x35ff9d = () => {
      if (!this['_pointerState']) {
        return;
      }
      window["removeEventListener"]("pointermove", _0x2b17da, !![]);
      window["removeEventListener"]("pointerup", _0xe7eaac, !![]);
      window['removeEventListener']("pointercancel", _0xe7eaac, !![]);
      this["_pointerState"] = null;
    };
    const _0x54ef70 = () => this["ratioStr"] !== 'original';
    const _0x2b17da = _0x18ae0c => {
      const _0x4ad86a = this["_pointerState"];
      if (!_0x4ad86a || _0x18ae0c["pointerId"] !== _0x4ad86a['pointerId']) {
        return;
      }
      _0x18ae0c["preventDefault"]();
      const _0x9edba = _0x4ad86a['zoom'] || this["_view"]?.["viewport"]?.["zoom"] || 0x1;
      const _0x5eaea6 = (_0x18ae0c['clientX'] - _0x4ad86a["startX"]) / _0x9edba;
      const _0x395fe4 = (_0x18ae0c["clientY"] - _0x4ad86a["startY"]) / _0x9edba;
      const _0x3020b3 = this["_getNodeWorldRect"]();
      const _0x4f26ed = (_0x51e7bc, _0x5ef373, _0x5355c3) => Math["min"](_0x5355c3, Math["max"](_0x5ef373, _0x51e7bc));
      if (_0x4ad86a["mode"] === "drag") {
        const _0x4e8067 = _0x4ad86a['startRect']['w'];
        const _0x3e93db = _0x4ad86a["startRect"]['h'];
        let _0x527159 = _0x4ad86a['startRect']['x'] + _0x5eaea6;
        let _0x55ac50 = _0x4ad86a["startRect"]['y'] + _0x395fe4;
        _0x527159 = _0x4f26ed(_0x527159, _0x3020b3['x'] + _0x3020b3['w'] - _0x4e8067, _0x3020b3['x']);
        _0x55ac50 = _0x4f26ed(_0x55ac50, _0x3020b3['y'] + _0x3020b3['h'] - _0x3e93db, _0x3020b3['y']);
        this["frameRect"] = {
          'x': _0x527159,
          'y': _0x55ac50,
          'w': _0x4e8067,
          'h': _0x3e93db
        };
        this['_updateView'](this["_view"]);
        return;
      }
      const _0x35daaf = _0x4ad86a["handle"];
      const _0x345d70 = Math["max"](_0x3020b3['w'], 0x18);
      const _0x52e0d3 = Math["max"](_0x3020b3['h'], 0x18);
      const _0x4e820a = _0x525ff8 => {
        const _0xd1fbb1 = {
          ..._0x525ff8
        };
        const _0x3996b3 = _0x3020b3['x'] + _0x3020b3['w'] - _0xd1fbb1['w'];
        const _0x185705 = _0x3020b3['x'];
        const _0x3ab8ad = _0x3020b3['y'] + _0x3020b3['h'] - _0xd1fbb1['h'];
        const _0x475252 = _0x3020b3['y'];
        _0xd1fbb1['x'] = _0x4f26ed(_0xd1fbb1['x'], _0x3996b3, _0x185705);
        _0xd1fbb1['y'] = _0x4f26ed(_0xd1fbb1['y'], _0x3ab8ad, _0x475252);
        return _0xd1fbb1;
      };
      const _0x5475cd = (_0x19d5b7, _0x52fdb9) => {
        const _0x13be7b = {
          ..._0x19d5b7
        };
        if (_0x13be7b['w'] < _0x345d70) {
          _0x13be7b['w'] = _0x345d70;
        }
        if (_0x13be7b['h'] < _0x52e0d3) {
          _0x13be7b['h'] = _0x52e0d3;
        }
        if (_0x52fdb9 === 'tl') {
          _0x13be7b['x'] = _0x4ad86a["startRect"]['x'] + _0x4ad86a['startRect']['w'] - _0x13be7b['w'];
          _0x13be7b['y'] = _0x4ad86a['startRect']['y'] + _0x4ad86a["startRect"]['h'] - _0x13be7b['h'];
        } else {
          if (_0x52fdb9 === 'tr') {
            _0x13be7b['x'] = _0x4ad86a["startRect"]['x'];
            _0x13be7b['y'] = _0x4ad86a["startRect"]['y'] + _0x4ad86a["startRect"]['h'] - _0x13be7b['h'];
          } else {
            if (_0x52fdb9 === 'bl') {
              _0x13be7b['x'] = _0x4ad86a['startRect']['x'] + _0x4ad86a["startRect"]['w'] - _0x13be7b['w'];
              _0x13be7b['y'] = _0x4ad86a['startRect']['y'];
            } else {
              if (_0x52fdb9 === 'br') {
                _0x13be7b['x'] = _0x4ad86a["startRect"]['x'];
                _0x13be7b['y'] = _0x4ad86a['startRect']['y'];
              } else {
                if (_0x52fdb9 === 'lm') {
                  _0x13be7b['x'] = _0x4ad86a["startRect"]['x'] + _0x4ad86a["startRect"]['w'] - _0x13be7b['w'];
                  _0x13be7b['y'] = _0x4ad86a['startRect']['y'];
                } else {
                  if (_0x52fdb9 === 'rm') {
                    _0x13be7b['x'] = _0x4ad86a["startRect"]['x'];
                    _0x13be7b['y'] = _0x4ad86a["startRect"]['y'];
                  } else {
                    if (_0x52fdb9 === 'tm') {
                      _0x13be7b['x'] = _0x4ad86a["startRect"]['x'];
                      _0x13be7b['y'] = _0x4ad86a["startRect"]['y'] + _0x4ad86a["startRect"]['h'] - _0x13be7b['h'];
                    } else {
                      _0x52fdb9 === 'bm' && (_0x13be7b['x'] = _0x4ad86a['startRect']['x'], _0x13be7b['y'] = _0x4ad86a["startRect"]['y']);
                    }
                  }
                }
              }
            }
          }
        }
        return _0x13be7b;
      };
      if (!_0x54ef70()) {
        let _0x567567 = {
          ..._0x4ad86a["startRect"]
        };
        if (_0x35daaf === 'tl') {
          _0x567567['x'] = _0x4ad86a["startRect"]['x'] + _0x5eaea6;
          _0x567567['y'] = _0x4ad86a["startRect"]['y'] + _0x395fe4;
          _0x567567['w'] = _0x4ad86a["startRect"]['w'] - _0x5eaea6;
          _0x567567['h'] = _0x4ad86a['startRect']['h'] - _0x395fe4;
          _0x567567 = _0x5475cd(_0x567567, 'tl');
        } else {
          if (_0x35daaf === 'tr') {
            _0x567567['y'] = _0x4ad86a["startRect"]['y'] + _0x395fe4;
            _0x567567['w'] = _0x4ad86a["startRect"]['w'] + _0x5eaea6;
            _0x567567['h'] = _0x4ad86a["startRect"]['h'] - _0x395fe4;
            _0x567567 = _0x5475cd(_0x567567, 'tr');
          } else {
            if (_0x35daaf === 'bl') {
              _0x567567['x'] = _0x4ad86a["startRect"]['x'] + _0x5eaea6;
              _0x567567['w'] = _0x4ad86a["startRect"]['w'] - _0x5eaea6;
              _0x567567['h'] = _0x4ad86a["startRect"]['h'] + _0x395fe4;
              _0x567567 = _0x5475cd(_0x567567, 'bl');
            } else {
              if (_0x35daaf === 'br') {
                _0x567567['w'] = _0x4ad86a['startRect']['w'] + _0x5eaea6;
                _0x567567['h'] = _0x4ad86a["startRect"]['h'] + _0x395fe4;
                _0x567567 = _0x5475cd(_0x567567, 'br');
              } else {
                if (_0x35daaf === 'tm') {
                  _0x567567['y'] = _0x4ad86a["startRect"]['y'] + _0x395fe4;
                  _0x567567['h'] = _0x4ad86a["startRect"]['h'] - _0x395fe4;
                  _0x567567 = _0x5475cd(_0x567567, 'tm');
                } else {
                  if (_0x35daaf === 'bm') {
                    _0x567567['h'] = _0x4ad86a["startRect"]['h'] + _0x395fe4;
                    _0x567567 = _0x5475cd(_0x567567, 'bm');
                  } else {
                    if (_0x35daaf === 'lm') {
                      _0x567567['x'] = _0x4ad86a["startRect"]['x'] + _0x5eaea6;
                      _0x567567['w'] = _0x4ad86a['startRect']['w'] - _0x5eaea6;
                      _0x567567 = _0x5475cd(_0x567567, 'lm');
                    } else {
                      _0x35daaf === 'rm' && (_0x567567['w'] = _0x4ad86a['startRect']['w'] + _0x5eaea6, _0x567567 = _0x5475cd(_0x567567, 'rm'));
                    }
                  }
                }
              }
            }
          }
        }
        this["frameRect"] = _0x4e820a(_0x567567);
        this["_updateView"](this["_view"]);
        return;
      }
      const _0x2d5aa8 = this["_parseRatio"]();
      const _0x5ced7d = _0x4ad86a["startRect"]['x'] + _0x4ad86a["startRect"]['w'] / 0x2;
      const _0x503997 = _0x4ad86a["startRect"]['y'] + _0x4ad86a['startRect']['h'] / 0x2;
      let _0x490850 = {
        ..._0x4ad86a["startRect"]
      };
      if (_0x35daaf === 'lm' || _0x35daaf === 'rm') {
        let _0x322dd7 = _0x4ad86a['startRect']['w'] + (_0x35daaf === 'rm' ? _0x5eaea6 : -_0x5eaea6);
        _0x322dd7 = Math['max'](_0x322dd7, _0x345d70);
        let _0x2c72a9 = _0x322dd7 / _0x2d5aa8;
        _0x2c72a9 < _0x52e0d3 && (_0x2c72a9 = _0x52e0d3, _0x322dd7 = _0x2c72a9 * _0x2d5aa8);
        _0x490850['w'] = _0x322dd7;
        _0x490850['h'] = _0x2c72a9;
        _0x490850['x'] = _0x35daaf === 'rm' ? _0x4ad86a['startRect']['x'] : _0x4ad86a["startRect"]['x'] + _0x4ad86a["startRect"]['w'] - _0x490850['w'];
        _0x490850['y'] = _0x503997 - _0x490850['h'] / 0x2;
      } else {
        if (_0x35daaf === 'tm' || _0x35daaf === 'bm') {
          let _0x30a3ec = _0x4ad86a["startRect"]['h'] + (_0x35daaf === 'bm' ? _0x395fe4 : -_0x395fe4);
          _0x30a3ec = Math["max"](_0x30a3ec, _0x52e0d3);
          let _0x2bab5b = _0x30a3ec * _0x2d5aa8;
          _0x2bab5b < _0x345d70 && (_0x2bab5b = _0x345d70, _0x30a3ec = _0x2bab5b / _0x2d5aa8);
          _0x490850['w'] = _0x2bab5b;
          _0x490850['h'] = _0x30a3ec;
          _0x490850['y'] = _0x35daaf === 'bm' ? _0x4ad86a["startRect"]['y'] : _0x4ad86a["startRect"]['y'] + _0x4ad86a["startRect"]['h'] - _0x490850['h'];
          _0x490850['x'] = _0x5ced7d - _0x490850['w'] / 0x2;
        } else {
          const _0x5eb3eb = _0x35daaf === 'tr' || _0x35daaf === 'br' ? 0x1 : -0x1;
          const _0x919382 = _0x35daaf === 'bl' || _0x35daaf === 'br' ? 0x1 : -0x1;
          let _0x3131ab = _0x4ad86a['startRect']['w'] + _0x5eaea6 * _0x5eb3eb;
          let _0x57a9b8 = _0x4ad86a["startRect"]['h'] + _0x395fe4 * _0x919382;
          _0x3131ab = Math["max"](_0x3131ab, 0x1);
          _0x57a9b8 = Math['max'](_0x57a9b8, 0x1);
          _0x3131ab / _0x57a9b8 > _0x2d5aa8 ? _0x57a9b8 = _0x3131ab / _0x2d5aa8 : _0x3131ab = _0x57a9b8 * _0x2d5aa8;
          _0x3131ab < _0x345d70 && (_0x3131ab = _0x345d70, _0x57a9b8 = _0x3131ab / _0x2d5aa8);
          _0x57a9b8 < _0x52e0d3 && (_0x57a9b8 = _0x52e0d3, _0x3131ab = _0x57a9b8 * _0x2d5aa8);
          _0x490850['w'] = _0x3131ab;
          _0x490850['h'] = _0x57a9b8;
          if (_0x35daaf === 'br') {
            _0x490850['x'] = _0x4ad86a["startRect"]['x'];
            _0x490850['y'] = _0x4ad86a["startRect"]['y'];
          } else {
            if (_0x35daaf === 'bl') {
              _0x490850['x'] = _0x4ad86a["startRect"]['x'] + _0x4ad86a["startRect"]['w'] - _0x490850['w'];
              _0x490850['y'] = _0x4ad86a["startRect"]['y'];
            } else {
              _0x35daaf === 'tr' ? (_0x490850['x'] = _0x4ad86a["startRect"]['x'], _0x490850['y'] = _0x4ad86a["startRect"]['y'] + _0x4ad86a["startRect"]['h'] - _0x490850['h']) : (_0x490850['x'] = _0x4ad86a["startRect"]['x'] + _0x4ad86a['startRect']['w'] - _0x490850['w'], _0x490850['y'] = _0x4ad86a["startRect"]['y'] + _0x4ad86a["startRect"]['h'] - _0x490850['h']);
            }
          }
        }
      }
      this["frameRect"] = _0x4e820a(_0x490850);
      this["_updateView"](this["_view"]);
    };
    const _0xe7eaac = _0x1191bc => {
      const _0x3634e7 = this["_pointerState"];
      if (!_0x3634e7 || _0x1191bc['pointerId'] !== _0x3634e7["pointerId"]) {
        return;
      }
      _0x1191bc['preventDefault']();
      _0x35ff9d();
    };
    const _0x300a51 = _0x347d25 => {
      if (_0x347d25["button"] !== 0x0) {
        return;
      }
      _0x347d25["stopPropagation"]();
      _0x347d25["preventDefault"]();
      if (!this["frameRect"]) {
        this["frameRect"] = this["_calcFrameWorldRect"]();
      }
      this["frameRect"] = this["_clampFrameRect"](this["frameRect"]);
      const _0x37eb59 = _0x347d25["target"]["closest"](".v2-expand-handle");
      const _0x3c6a4d = _0x37eb59?.["dataset"]?.['handle'] || null;
      const _0x467321 = _0x3c6a4d ? 'resize' : "drag";
      this["_pointerState"] = {
        'pointerId': _0x347d25["pointerId"],
        'mode': _0x467321,
        'handle': _0x3c6a4d,
        'startX': _0x347d25['clientX'],
        'startY': _0x347d25["clientY"],
        'startRect': {
          ...this["frameRect"]
        },
        'zoom': this["_view"]?.['viewport']?.["zoom"] || 0x1
      };
      this["frameEl"]["setPointerCapture"]?.(_0x347d25['pointerId']);
      window["addEventListener"]('pointermove', _0x2b17da, !![]);
      window["addEventListener"]("pointerup", _0xe7eaac, !![]);
      window["addEventListener"]("pointercancel", _0xe7eaac, !![]);
    };
    this["frameEl"]["addEventListener"]("pointerdown", _0x300a51);
    this["cleanup"] = () => {
      _0x35ff9d();
      window["removeEventListener"]("keydown", _0x182538);
      document["removeEventListener"]('pointerdown', _0x55b007, !![]);
      this["overlayEl"]?.["removeEventListener"]("wheel", _0x57f1a2);
      this["frameEl"]?.["removeEventListener"]("pointerdown", _0x300a51);
      this["_unbindToolbarUpMenus"]?.();
      this["_unbindToolbarUpMenus"] = null;
      this["_unbindImageFunctionMenus"]?.();
      this["_unbindImageFunctionMenus"] = null;
    };
  },
  'exit'() {
    if (!this["active"]) {
      return;
    }
    this["_functionControls"]?.["destroy"]();
    this['_functionControls'] = null;
    this["_cancelImageReadyWait"]?.();
    this["_cancelImageReadyWait"] = null;
    this['active'] = ![];
    this["_unsubscribe"] && (this["_unsubscribe"](), this["_unsubscribe"] = null);
    this["_unsubscribeViewportPreview"]?.();
    this["_unsubscribeViewportPreview"] = null;
    this["_unsubscribeLocale"] && (this['_unsubscribeLocale'](), this['_unsubscribeLocale'] = null);
    this["cleanup"]?.();
    this["cleanup"] = null;
    const _0x239ce7 = this['overlayEl'];
    const _0x4cb80b = this['toolbarEl'];
    _0x239ce7?.["classList"]["remove"]("visible");
    this["overlayEl"] = null;
    this["toolbarEl"] = null;
    this["nodeId"] = null;
    this["nodeData"] = null;
    this["frameRect"] = null;
    this["_view"] = null;
    this["_expandModelCatalog"] = null;
    this["ratioMenuEl"] = null;
    this['sizeMenuEl'] = null;
    setTimeout(() => {
      _0x239ce7?.["remove"]();
      _0x4cb80b?.["remove"]();
    }, 0xc8);
  }
};
export default ImageExpandController;