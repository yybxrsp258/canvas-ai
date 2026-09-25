import a515_0x57b49f from '../core/stores/appStore.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { resumeAsyncImageTask, resumeDreaminaImageTask, resumeRunningHubImageTask } from '../../api/aiImageApi.js';
import { ensureLocalImageDerivatives, uploadFile } from '../modules/project.js';
import { openNodeImagePreview } from '../modules/imagePreview.js';
import { generateThumbnail } from '../modules/imageUtils.js';
import { bindImageToolbarEvents } from './NodeToolbarConfig.js';
import a515_0x3f27c9 from '../modules/ImageFreeAngleController.js';
import { startLoading, stopLoading } from '../modules/loadingOverlay.js';
import { setStaticInnerHTML } from '../utils/dom.js';
import { commit } from '../modules/history.js';
import { startNodeResizePreview } from '../modules/interaction/nodeResizePreview.js';
import { getThumbnail, setThumbnail } from '../services/thumbnailCacheService.js';
import { getAutoMediaSizeByShortSide } from '../services/fileService.js';
import { logDragImportProfile } from '../services/dragImportDiagnostics.js';
import { buildImageNodeStorageFields, pickCanvasImageLocalPath, toLocalPathUrl } from '../services/imageDerivativeService.js';
import { buildCanvasLocalImageFields, resolveCanvasImageLowZoomUrl, resolveCanvasImageThumbUrl } from '../services/canvasMediaLocalService.js';
import { isCanvasLowZoomActive, pickImageLodUrl, setNodeMediaLodHoverPromoted, shouldUseLowZoomImageThumbnail } from '../modules/canvasImageLod.js';
import { forgetCanvasImageDisplayLoad, isCanvasImageDisplayLoadPending, isCanvasImagePreloadCoolingDown, isCanvasImagePreloadPending, rememberCanvasImagePreloadResolved, preloadCanvasImage, trackCanvasImageDisplayLoad } from '../modules/canvasMediaScheduler.js';
import { assignCanvasImageDisplaySource, clearCanvasImageDisplayHandoff, deferCanvasImageDisplayFallbackRelease } from '../modules/canvasImageDisplayHandoff.js';
import { shouldDeferRendererMediaOnMount, shouldPrebuildRendererRuntimeOffscreen } from '../core/rendererDeferredMedia.js';
import { resumeTask } from '../core/generationTaskRuntime.js';
import { readViewportInteractionState } from '../core/viewportInteractionState.js';
import { isModelApiModel, isWorkflowModel, resolveModelProvider } from '../manifests/index.js';
import { getTaskMessage, isTaskCancelled, isTaskFailed, isTaskTerminal, shouldShowGenerationResultLoadingUi } from '../core/generationTaskUiState.js';
import { buildImageGenerationFailurePatch } from './aigenImage/imageGenerationResultRenderer.js';
import { getDefaultDreaminaImageModelId } from './aigenImage/dreaminaModelMenuHelper.js';
const SOURCE_IMAGE_MIN_SIZE = 0x96;
const SOURCE_IMAGE_IDLE_PRELOAD_TIMEOUT_MS = 0x28;
const SOURCE_IMAGE_BUSY_RETRY_MS = 0x30;
const SOURCE_IMAGE_MAX_BUSY_WAIT_MS = 0x1388;
const SOURCE_IMAGE_LOD_HOVER_REFRESH_DELAY_MS = 0xa0;
const DREAMINA_POLL_TIMEOUT_CODE = "DREAMINA_POLL_TIMEOUT";
const DREAMINA_STALE_ACTIVE_RESUME_MS = 0xf * 0x3e8;
const NON_RECOVERABLE_FAILURE_STATUSES = new Set(["cancelled", "canceled", "error", "fail", "failed"]);
function hasSharedCanvasImageAcquisition(_0x2d96a6) {
  const _0x5e7a29 = String(_0x2d96a6 || '')["trim"]();
  return !!_0x5e7a29 && (isCanvasImageDisplayLoadPending(_0x5e7a29) || isCanvasImagePreloadPending(_0x5e7a29) || isCanvasImagePreloadCoolingDown(_0x5e7a29));
}
const DREAMINA_NON_RECOVERABLE_STATUSES = new Set([...NON_RECOVERABLE_FAILURE_STATUSES, "idle"]);
const DREAMINA_NON_RECOVERABLE_PHASES = new Set([...NON_RECOVERABLE_FAILURE_STATUSES, "done"]);
function sourceImageText(_0x18d3db, _0x5b907d = {}) {
  return t("sourceImageNode." + _0x18d3db, _0x5b907d);
}
function getSourceImageSchedulerNow() {
  return typeof performance !== "undefined" && typeof performance['now'] === 'function' ? performance['now']() : Date["now"]();
}
function isSourceImageInteractionBusy() {
  return readViewportInteractionState()["isViewportBusy"];
}
function scheduleSourceImageIdleTask(_0x359b90, {
  timeout = SOURCE_IMAGE_IDLE_PRELOAD_TIMEOUT_MS
} = {}) {
  if (typeof _0x359b90 !== "function") {
    return () => {};
  }
  let _0x4a85fd = ![];
  let _0x28d3d3 = () => {};
  const _0x52426d = getSourceImageSchedulerNow();
  const _0x11d4d9 = globalThis["window"]?.['requestIdleCallback'] || globalThis['requestIdleCallback'];
  const _0x55fe13 = globalThis["window"]?.["cancelIdleCallback"] || globalThis["cancelIdleCallback"];
  function _0x142599(_0x4e3334) {
    const _0x359026 = setTimeout(_0x3de14e, _0x4e3334);
    _0x28d3d3 = () => clearTimeout(_0x359026);
  }
  const _0x3de14e = () => {
    if (_0x4a85fd) {
      return;
    }
    const _0x28c8d9 = getSourceImageSchedulerNow() - _0x52426d;
    if (isSourceImageInteractionBusy() && _0x28c8d9 < SOURCE_IMAGE_MAX_BUSY_WAIT_MS) {
      _0x142599(SOURCE_IMAGE_BUSY_RETRY_MS);
      return;
    }
    _0x359b90();
  };
  if (typeof _0x11d4d9 === "function") {
    const _0x548282 = _0x11d4d9(_0x3de14e, {
      'timeout': timeout
    });
    _0x28d3d3 = () => {
      if (typeof _0x55fe13 === "function") {
        _0x55fe13(_0x548282);
      }
    };
  } else {
    _0x142599(0x0);
  }
  return () => {
    _0x4a85fd = !![];
    _0x28d3d3();
  };
}
function buildSourceImageRecoveryFailurePatch(_0x5b6405, {
  error = '',
  startedAt = 0x0,
  duration = null
} = {}) {
  const _0x2b7795 = String(error?.['message'] || error || sourceImageText("recovery.taskFailed"))['trim']() || sourceImageText("recovery.taskFailed");
  const _0xfa1171 = String(_0x5b6405?.['outputText'] || '')["trim"]();
  const _0x3a8cb4 = _0xfa1171 ? _0xfa1171 + '\x0a' + sourceImageText("recovery.failedWithMessage", {
    'message': _0x2b7795
  }) : sourceImageText('recovery.failedWithMessage', {
    'message': _0x2b7795
  });
  return {
    ...buildImageGenerationFailurePatch({
      'error': _0x2b7795,
      'startedAt': startedAt,
      'duration': duration,
      'clearMediaFields': ![]
    }),
    'outputText': _0x3a8cb4
  };
}
function normalizeImmediateImagePreviewUrl(_0x56212a) {
  const _0x8d6248 = String(_0x56212a || '')['trim']();
  if (!_0x8d6248) {
    return '';
  }
  if (/^data:image\//i["test"](_0x8d6248) || /^blob:/i["test"](_0x8d6248) || /^aic-local-preview:/i["test"](_0x8d6248)) {
    return _0x8d6248;
  }
  if (/^(?:https?:|file:)/i["test"](_0x8d6248)) {
    return '';
  }
  return toLocalPathUrl(_0x8d6248);
}
function firstImmediateImagePreviewUrl(_0x537af5) {
  for (const _0x373f43 of _0x537af5 || []) {
    const _0x3e2a10 = normalizeImmediateImagePreviewUrl(_0x373f43);
    if (_0x3e2a10) {
      return _0x3e2a10;
    }
  }
  return '';
}
function getPrimarySourceImageItem(_0x958a62) {
  const _0x5e1524 = Array["isArray"](_0x958a62?.['images']) ? _0x958a62['images'] : [];
  if (_0x5e1524["length"] === 0x0) {
    return null;
  }
  const _0x566c02 = Number(_0x958a62?.["mainImageIndex"]);
  const _0x7b69db = Number["isFinite"](_0x566c02) ? Math["max"](0x0, Math["trunc"](_0x566c02)) : 0x0;
  return _0x5e1524[_0x7b69db] || _0x5e1524[0x0] || null;
}
function normalizeTaskStatus(_0x170df1) {
  return String(_0x170df1 || '')["trim"]()["toLowerCase"]();
}
function normalizeUploadMediaDimensions(_0x290630, _0x4bd671) {
  const _0xd881ba = Math["round"](Number(_0x290630) || 0x0);
  const _0x702f45 = Math['round'](Number(_0x4bd671) || 0x0);
  if (_0xd881ba <= 0x0 || _0x702f45 <= 0x0) {
    return null;
  }
  return {
    'width': _0xd881ba,
    'height': _0x702f45
  };
}
export function buildSourceImageUploadSizePatch(..._0x177da9) {
  for (const _0x505037 of _0x177da9) {
    const _0x230b8c = normalizeUploadMediaDimensions(_0x505037?.['width'], _0x505037?.["height"]);
    if (!_0x230b8c) {
      continue;
    }
    const _0x5486c9 = getAutoMediaSizeByShortSide(_0x230b8c["width"], _0x230b8c["height"]);
    return {
      'width': _0x5486c9['width'],
      'height': _0x5486c9["height"],
      'imageWidth': _0x230b8c['width'],
      'imageHeight': _0x230b8c["height"],
      'needsAutoResize': ![]
    };
  }
  return {
    'needsAutoResize': !![]
  };
}
export class SourceImageNode {
  constructor(_0x29f775) {
    this["_data"] = _0x29f775;
    this['el'] = document["createElement"]("div");
    this['id'] = _0x29f775['id'];
    this['el']["className"] = "v2-node-component";
    this["_currentSrc"] = null;
    this['_currentMaskPreview'] = null;
    this["_objUrl"] = null;
    this["_thumbGenSrc"] = null;
    this["_failedSrc"] = null;
    this["_currentJobStatus"] = null;
    this['_resolvedPreviewSig'] = '';
    this["_previewResolveToken"] = 0x0;
    this['_uploadLabelNode'] = null;
    this["_unsubscribeLocale"] = null;
    this['_cachedThumbUrl'] = '';
    this["_activeCapturePreviewUrl"] = '';
    this["_retiredCapturePreviewUrls"] = new Set();
    this["_capturePreviewReleaseCallbacks"] = new Map();
    this["_rhResumeAbortController"] = null;
    this['_rhResumeTaskId'] = '';
    this["_rhResumePromise"] = null;
    this["_rhResumeRetryTimer"] = null;
    this['_dreaminaResumeAbortController'] = null;
    this['_dreaminaResumeSubmitId'] = '';
    this['_dreaminaResumePromise'] = null;
    this["_asyncResumeAbortController"] = null;
    this["_asyncResumeTaskId"] = '';
    this["_asyncResumePromise"] = null;
    this["_idleImageRefreshCancel"] = null;
    this["_lowZoomHoverRefreshTimer"] = null;
    this["_rendererMediaDeferred"] = shouldDeferRendererMediaOnMount(_0x29f775);
    this['_rendererRuntimePrebuiltOffscreen'] = shouldPrebuildRendererRuntimeOffscreen(_0x29f775);
  }
  ["_applyMaskPreview"](_0x4a7cd7) {
    if (!this["_maskOverlay"]) {
      return;
    }
    const _0x13b750 = String(_0x4a7cd7 || '')["trim"]();
    if (!_0x13b750) {
      this["_currentMaskPreview"] && (this["_maskOverlay"]["src"] = '', this["_maskOverlay"]["style"]["display"] = "none", this['_currentMaskPreview'] = null);
      return;
    }
    if (this["_currentMaskPreview"] === _0x13b750) {
      return;
    }
    const _0x114bfb = _0x13b750["startsWith"]("blob:") || _0x13b750["startsWith"]('data:') || _0x13b750["startsWith"]('/') ? _0x13b750 : toLocalPathUrl(_0x13b750);
    if (!_0x114bfb) {
      return;
    }
    this["_maskOverlay"]['src'] = encodeURI(_0x114bfb);
    this["_maskOverlay"]["style"]["display"] = 'block';
    this["_currentMaskPreview"] = _0x13b750;
  }
  ["_setImageLodSrc"](_0x3285b8) {
    if (!this['_img']?.["dataset"]) {
      return;
    }
    const _0x4776c5 = String(_0x3285b8 || '')["trim"]();
    if (_0x4776c5) {
      this["_img"]["dataset"]["lodSrc"] = _0x4776c5;
    } else {
      delete this["_img"]['dataset']["lodSrc"];
    }
  }
  ["_isShowingFullImage"](_0x255707 = this['_getPrimaryImageUrl']()) {
    const _0x3b6ea5 = String(_0x255707 || '')["trim"]();
    if (!_0x3b6ea5 || !this["_img"]) {
      return ![];
    }
    const _0x1fb0cf = String(this["_img"]["getAttribute"]("src") || '')["trim"]();
    const _0xee31fc = String(this["_img"]["dataset"]?.["lodSrc"] || '')['trim']();
    return _0x1fb0cf === _0x3b6ea5 && _0xee31fc === "full" && this["_img"]["style"]["display"] !== 'none' && this["_img"]["complete"] === !![] && Number(this['_img']["naturalWidth"] || 0x0) > 0x0;
  }
  ["_shouldCommitPreloadedImage"](_0x1f7ddf) {
    const _0x176076 = String(_0x1f7ddf || '')["trim"]();
    if (!_0x176076) {
      return ![];
    }
    const _0x10cab4 = a515_0x57b49f["getStateRaw"]()["nodes"]?.[this['id']] || this["_data"];
    const _0x180775 = this["_getImageDisplayLod"](_0x10cab4);
    const _0x58aec3 = this["_getCapturePreviewUrl"](_0x10cab4);
    const _0x4332f7 = _0x180775['url'] || _0x58aec3;
    const _0x4295d0 = this["_getPrimaryImageUrl"](_0x10cab4);
    if (!_0x4295d0) {
      return !![];
    }
    if (_0x176076 === _0x4332f7) {
      return !![];
    }
    if (_0x176076 === _0x4295d0 && _0x180775["lod"] === "thumb") {
      return this['_isShowingFullImage'](_0x176076);
    }
    return ![];
  }
  ["_waitForDisplayedImageLoad"](_0x162f20, {
    allowPendingSrc = ![]
  } = {}) {
    const _0x16246d = String(_0x162f20 || '')["trim"]();
    const _0x286dc5 = this["_img"];
    if (!_0x16246d || !_0x286dc5) {
      return Promise["reject"](new Error("Image source is empty"));
    }
    const _0x3f52bd = () => String(_0x286dc5["getAttribute"]?.('src') || _0x286dc5["src"] || '')["trim"]();
    const _0x10e55f = () => _0x3f52bd() === _0x16246d;
    const _0x4a457b = () => {
      const _0x103f80 = {
        'image': _0x286dc5,
        'naturalWidth': _0x286dc5["naturalWidth"] || 0x0,
        'naturalHeight': _0x286dc5['naturalHeight'] || 0x0
      };
      rememberCanvasImagePreloadResolved(_0x16246d, _0x103f80);
      return _0x103f80;
    };
    if (!allowPendingSrc && !_0x10e55f()) {
      return Promise["reject"](new Error("Image source changed before load"));
    }
    if (_0x10e55f() && _0x286dc5['complete'] === !![]) {
      return Number(_0x286dc5['naturalWidth'] || 0x0) > 0x0 ? Promise["resolve"](_0x4a457b()) : Promise["reject"](new Error("Image load failed"));
    }
    return new Promise((_0x13c838, _0x39b191) => {
      trackCanvasImageDisplayLoad(_0x16246d, _0x286dc5);
      let _0x30b3b4 = ![];
      let _0x5f47a2 = () => {};
      const _0x1faa63 = (_0x317cff = null) => {
        if (_0x30b3b4) {
          return;
        }
        _0x30b3b4 = !![];
        forgetCanvasImageDisplayLoad(_0x286dc5);
        _0x5f47a2();
        if (_0x317cff) {
          _0x39b191(_0x317cff);
          return;
        }
        if (!_0x10e55f()) {
          _0x39b191(new Error("Image source changed before load"));
          return;
        }
        _0x13c838(_0x4a457b());
      };
      const _0x3501a7 = () => _0x1faa63();
      const _0xd506a9 = () => _0x1faa63(new Error("Image load failed"));
      if (typeof _0x286dc5["addEventListener"] === 'function') {
        _0x286dc5["addEventListener"]('load', _0x3501a7, {
          'once': !![]
        });
        _0x286dc5["addEventListener"]("error", _0xd506a9, {
          'once': !![]
        });
        _0x5f47a2 = () => {
          _0x286dc5["removeEventListener"]?.('load', _0x3501a7);
          _0x286dc5["removeEventListener"]?.("error", _0xd506a9);
        };
      } else {
        const _0xc87a2f = _0x286dc5['onload'];
        const _0x1f9070 = _0x286dc5["onerror"];
        const _0x4dd360 = (..._0x2e6d66) => {
          if (typeof _0xc87a2f === "function") {
            _0xc87a2f["apply"](_0x286dc5, _0x2e6d66);
          }
          _0x3501a7();
        };
        const _0x436b4d = (..._0x34f0ce) => {
          if (typeof _0x1f9070 === 'function') {
            _0x1f9070["apply"](_0x286dc5, _0x34f0ce);
          }
          _0xd506a9();
        };
        _0x286dc5["onload"] = _0x4dd360;
        _0x286dc5['onerror'] = _0x436b4d;
        _0x5f47a2 = () => {
          if (_0x286dc5["onload"] === _0x4dd360) {
            _0x286dc5["onload"] = _0xc87a2f;
          }
          if (_0x286dc5["onerror"] === _0x436b4d) {
            _0x286dc5['onerror'] = _0x1f9070;
          }
        };
      }
    });
  }
  ["_queueThumbnail"](_0x2bf777) {
    if (!_0x2bf777) {
      return;
    }
    if (this["_thumbGenSrc"] === _0x2bf777) {
      return;
    }
    this["_thumbGenSrc"] = _0x2bf777;
    generateThumbnail(_0x2bf777)["then"](async _0x66638a => {
      if (!_0x66638a) {
        return;
      }
      const _0x5aca0c = a515_0x57b49f["getState"]()["nodes"][this['id']];
      if (!_0x5aca0c) {
        return;
      }
      if (this["_getPrimaryImageUrl"](_0x5aca0c) !== _0x2bf777) {
        return;
      }
      await setThumbnail(_0x5aca0c, _0x66638a);
      !this['_cachedThumbUrl'] && (this["_cachedThumbUrl"] = _0x66638a);
    })["catch"](_0x1e84f4 => {
      console['warn']("[SourceImageNode] 缩略图缓存写入失败:", _0x1e84f4);
    })["finally"](() => {
      if (this["_thumbGenSrc"] === _0x2bf777) {
        this["_thumbGenSrc"] = null;
      }
    });
  }
  ["_normalizeLocalUrl"](_0x472b04) {
    return toLocalPathUrl(_0x472b04);
  }
  ['_getPrimaryImageUrl'](_0x20b4ca = this['_data']) {
    const _0x5e6c1d = pickCanvasImageLocalPath(_0x20b4ca);
    return _0x5e6c1d ? toLocalPathUrl(_0x5e6c1d) : '';
  }
  ["_getSynchronousThumbUrl"](_0x2f3903 = this["_data"]) {
    const _0x1ff12b = getPrimarySourceImageItem(_0x2f3903);
    return firstImmediateImagePreviewUrl([_0x2f3903?.['previewLocalPath'], _0x2f3903?.["thumbLocalPath"], _0x2f3903?.["thumbnailLocalPath"], _0x2f3903?.['displayLocalPath'], _0x2f3903?.['previewUrl'], _0x2f3903?.['thumbUrl'], _0x2f3903?.['thumbnailUrl'], _0x1ff12b?.["previewLocalPath"], _0x1ff12b?.["thumbLocalPath"], _0x1ff12b?.["thumbnailLocalPath"], _0x1ff12b?.["displayLocalPath"], _0x1ff12b?.["previewUrl"], _0x1ff12b?.['thumbUrl'], _0x1ff12b?.['thumbnailUrl']]) || resolveCanvasImageThumbUrl(_0x2f3903);
  }
  ['_getLowZoomImageUrl'](_0x21b601 = this["_data"]) {
    return resolveCanvasImageLowZoomUrl(_0x21b601);
  }
  ['_shouldUseLowZoomThumbnail']() {
    return shouldUseLowZoomImageThumbnail({
      'nodeId': this['id'],
      'rootEl': this['el'],
      'store': a515_0x57b49f
    });
  }
  ["_getImageDisplayLod"](_0x5a1bc4 = this["_data"]) {
    const _0x35e5de = this["_getPrimaryImageUrl"](_0x5a1bc4);
    const _0x488791 = this["_getSynchronousThumbUrl"](_0x5a1bc4) || this["_getLowZoomImageUrl"](_0x5a1bc4);
    return pickImageLodUrl({
      'mainUrl': _0x35e5de,
      'thumbUrl': _0x488791,
      'lowZoomThumbnail': this["_shouldUseLowZoomThumbnail"]()
    });
  }
  ["_getCapturePreviewUrl"](_0x54be08 = this['_data']) {
    const _0x5a274f = String(_0x54be08?.["capturePreviewUrl"] || '')["trim"]();
    if (!_0x5a274f) {
      return '';
    }
    if (_0x5a274f["startsWith"]("blob:") || _0x5a274f["startsWith"]("data:image/") || _0x5a274f["startsWith"]("aic-local-preview:")) {
      return _0x5a274f;
    }
    if ((_0x5a274f["startsWith"]("http://") || _0x5a274f["startsWith"]("https://")) && _0x5a274f === String(_0x54be08?.['webSourceUrl'] || '')["trim"]()) {
      return _0x5a274f;
    }
    return '';
  }
  ['_getPreviewSignature'](_0x2a81b7 = this["_data"]) {
    return [String(_0x2a81b7?.["localPath"] || '')["trim"](), String(_0x2a81b7?.['originalLocalPath'] || '')['trim'](), String(_0x2a81b7?.["displayLocalPath"] || '')['trim'](), String(_0x2a81b7?.["thumbLocalPath"] || '')["trim"](), String(_0x2a81b7?.["previewLocalPath"] || '')["trim"](), String(_0x2a81b7?.["previewUrl"] || '')["trim"](), String(_0x2a81b7?.['thumbUrl'] || '')["trim"](), String(_0x2a81b7?.["thumbnailUrl"] || '')["trim"](), String(_0x2a81b7?.["capturePreviewUrl"] || '')["trim"](), String(getPrimarySourceImageItem(_0x2a81b7)?.['previewLocalPath'] || '')["trim"](), String(getPrimarySourceImageItem(_0x2a81b7)?.["thumbLocalPath"] || '')["trim"](), String(getPrimarySourceImageItem(_0x2a81b7)?.["displayLocalPath"] || '')["trim"](), String(getPrimarySourceImageItem(_0x2a81b7)?.["previewUrl"] || '')["trim"](), String(getPrimarySourceImageItem(_0x2a81b7)?.["thumbUrl"] || '')["trim"](), String(getPrimarySourceImageItem(_0x2a81b7)?.["thumbnailUrl"] || '')["trim"](), this["_shouldUseLowZoomThumbnail"]() ? "thumb" : "full"]['join']('|');
  }
  ['_revokeCapturePreviewUrl'](_0x302b62) {
    const _0x134427 = String(_0x302b62 || '')["trim"]();
    if (!_0x134427 || !_0x134427["startsWith"]('blob:')) {
      return;
    }
    const _0x34c7da = globalThis['window']?.["URL"] || globalThis["URL"];
    if (typeof _0x34c7da?.["revokeObjectURL"] !== "function") {
      return;
    }
    try {
      _0x34c7da["revokeObjectURL"](_0x134427);
    } catch {}
  }
  ['_readDisplayedImageSource']() {
    return String(this["_img"]?.["getAttribute"]?.("src") || this['_img']?.["currentSrc"] || this["_img"]?.['src'] || '')["trim"]();
  }
  ["_getCapturePreviewReleaseCallback"](_0x38ac3d) {
    const _0x46cd97 = String(_0x38ac3d || '')["trim"]();
    !this['_capturePreviewReleaseCallbacks'] && (this["_capturePreviewReleaseCallbacks"] = new Map());
    const _0xb06e8a = this['_capturePreviewReleaseCallbacks']["get"](_0x46cd97);
    if (_0xb06e8a) {
      return _0xb06e8a;
    }
    const _0x1c7a3f = _0x4ceb84 => {
      const _0x3b047b = this["_retiredCapturePreviewUrls"];
      this['_capturePreviewReleaseCallbacks']?.["delete"](_0x46cd97);
      if (!_0x3b047b?.["has"](_0x46cd97)) {
        return;
      }
      if (this["_activeCapturePreviewUrl"] === _0x46cd97 || this['_readDisplayedImageSource']() === _0x46cd97) {
        return;
      }
      _0x3b047b["delete"](_0x46cd97);
      this['_revokeCapturePreviewUrl'](_0x4ceb84 || _0x46cd97);
    };
    this["_capturePreviewReleaseCallbacks"]["set"](_0x46cd97, _0x1c7a3f);
    return _0x1c7a3f;
  }
  ["_flushRetiredCapturePreviewUrls"]({
    force = ![]
  } = {}) {
    const _0x37d3cf = this["_retiredCapturePreviewUrls"];
    if (!_0x37d3cf?.["size"]) {
      return;
    }
    const _0x3975e8 = this['_readDisplayedImageSource']();
    for (const _0x5a0f22 of [..._0x37d3cf]) {
      if (!force && this["_activeCapturePreviewUrl"] === _0x5a0f22) {
        continue;
      }
      const _0x1b036f = this["_getCapturePreviewReleaseCallback"](_0x5a0f22);
      if (!force && deferCanvasImageDisplayFallbackRelease(this['_img'], _0x5a0f22, _0x1b036f)) {
        continue;
      }
      if (!force && _0x3975e8 === _0x5a0f22) {
        continue;
      }
      _0x37d3cf["delete"](_0x5a0f22);
      this["_capturePreviewReleaseCallbacks"]?.['delete'](_0x5a0f22);
      this['_revokeCapturePreviewUrl'](_0x5a0f22);
    }
  }
  ["_retireCapturePreviewUrl"](_0x4222ef) {
    const _0x22452f = String(_0x4222ef || '')["trim"]();
    if (!_0x22452f || !_0x22452f["startsWith"]("blob:")) {
      return;
    }
    !this["_retiredCapturePreviewUrls"] && (this['_retiredCapturePreviewUrls'] = new Set());
    this["_retiredCapturePreviewUrls"]['add'](_0x22452f);
    this["_flushRetiredCapturePreviewUrls"]();
  }
  ["_assignImageDisplaySource"](_0x5d266b) {
    const _0x17efee = assignCanvasImageDisplaySource(this["_img"], _0x5d266b);
    this["_flushRetiredCapturePreviewUrls"]();
    return _0x17efee;
  }
  ["_adoptCapturePreviewUrl"](_0x5d2687) {
    const _0x1709c6 = String(_0x5d2687 || '')['trim']();
    const _0x399ee1 = this["_activeCapturePreviewUrl"];
    this["_activeCapturePreviewUrl"] = _0x1709c6;
    this["_retiredCapturePreviewUrls"]?.["delete"](_0x1709c6);
    _0x399ee1 && _0x399ee1 !== _0x1709c6 && this["_retireCapturePreviewUrl"](_0x399ee1);
  }
  ['_releaseActiveCapturePreviewUrl']() {
    if (!this['_activeCapturePreviewUrl']) {
      return;
    }
    const _0x42f405 = this["_activeCapturePreviewUrl"];
    this['_activeCapturePreviewUrl'] = '';
    this["_retireCapturePreviewUrl"](_0x42f405);
  }
  async ['_refreshImageDisplay'](_0x31c4ee = ![]) {
    const _0x3343dc = this["_getPreviewSignature"]();
    if (!_0x31c4ee && _0x3343dc === this["_resolvedPreviewSig"]) {
      return;
    }
    this["_resolvedPreviewSig"] = _0x3343dc;
    const _0x442325 = ++this["_previewResolveToken"];
    const _0x1c5603 = this['_getPrimaryImageUrl']();
    const _0x22ceab = this["_getCapturePreviewUrl"]();
    const _0x405eb6 = this["_getSynchronousThumbUrl"]();
    const _0x29e329 = this["_getImageDisplayLod"]();
    const _0x28f571 = _0x29e329["lod"] === "thumb" && _0x1c5603 && this["_isShowingFullImage"](_0x1c5603);
    if (!_0x1c5603 && _0x22ceab) {
      this["_adoptCapturePreviewUrl"](_0x22ceab);
      this["_showImg"](_0x22ceab, this["_cachedThumbUrl"]);
      return;
    }
    if (_0x28f571) {
      this["_cachedThumbUrl"] = _0x405eb6 || _0x29e329['url'] || this["_cachedThumbUrl"] || '';
      this['_releaseActiveCapturePreviewUrl']();
      this["_showImg"](_0x1c5603, this["_cachedThumbUrl"] || _0x22ceab);
      return;
    }
    if (_0x29e329["lod"] === "thumb" && _0x29e329['url']) {
      this["_cachedThumbUrl"] = _0x405eb6 || _0x29e329["url"];
      this["_releaseActiveCapturePreviewUrl"]();
      this["_showLowZoomThumb"](_0x29e329["url"]);
      return;
    }
    if (_0x1c5603) {
      this["_cachedThumbUrl"] = _0x405eb6 || this["_cachedThumbUrl"] || '';
      this["_showImg"](_0x1c5603, this["_cachedThumbUrl"] || _0x22ceab);
      return;
    }
    if (_0x405eb6) {
      this["_cachedThumbUrl"] = _0x405eb6;
      this["_releaseActiveCapturePreviewUrl"]();
      this["_showLowZoomThumb"](_0x405eb6);
      return;
    }
    let _0x2cde70 = '';
    try {
      _0x2cde70 = await getThumbnail(this["_data"]);
    } catch {
      _0x2cde70 = '';
    }
    if (_0x442325 !== this['_previewResolveToken']) {
      return;
    }
    this["_cachedThumbUrl"] = _0x405eb6 || _0x2cde70 || '';
    if (_0x22ceab) {
      this['_adoptCapturePreviewUrl'](_0x22ceab);
      this['_showImg'](_0x22ceab, this["_cachedThumbUrl"]);
      return;
    }
    if (this["_cachedThumbUrl"]) {
      this["_showLowZoomThumb"](this["_cachedThumbUrl"]);
      return;
    }
    this['_showImg']('', '');
  }
  ["_scheduleImageDisplayRefresh"](_0x316ae3 = ![]) {
    if (this["_idleImageRefreshCancel"]) {
      return;
    }
    this["_idleImageRefreshCancel"] = scheduleSourceImageIdleTask(() => {
      this['_idleImageRefreshCancel'] = null;
      if (!this["_img"]) {
        return;
      }
      void this['_refreshImageDisplay'](_0x316ae3);
    });
  }
  ["mount"]() {
    const _0x323c38 = this['el'];
    const _0x238707 = this['_data'];
    Object["assign"](_0x323c38['style'], {
      'display': "flex",
      'flexDirection': 'column',
      'height': "100%",
      'overflow': "visible",
      'pointerEvents': "auto",
      'cursor': "default"
    });
    const _0x145bb1 = this['_getCapturePreviewUrl'](_0x238707);
    const _0x2ef640 = this["_getPrimaryImageUrl"](_0x238707);
    const _0x372618 = !_0x2ef640 && !!_0x145bb1;
    const _0x561d0d = _0x372618 ? {
      'url': _0x145bb1,
      'lod': "full"
    } : this["_getImageDisplayLod"](_0x238707);
    const _0x4f2323 = _0x561d0d["url"] || _0x145bb1;
    const _0x5a1586 = (_0x372618 ? _0x145bb1 : this["_getSynchronousThumbUrl"](_0x238707)) || _0x145bb1;
    const _0x3c1cff = this['_rendererMediaDeferred'] === !![] && _0x561d0d["lod"] !== 'thumb' && !!_0x561d0d["url"] && _0x561d0d['url'] !== _0x5a1586;
    const _0x360fe3 = _0x3c1cff ? _0x5a1586 : _0x4f2323;
    const _0x5b55f8 = _0x3c1cff ? _0x360fe3 ? "placeholder" : '' : _0x561d0d["lod"];
    this["_adoptCapturePreviewUrl"](_0x145bb1);
    this["_currentSrc"] = _0x4f2323;
    this["_currentJobStatus"] = _0x238707['jobStatus'] || null;
    setStaticInnerHTML(_0x323c38, "toolbar:image");
    this["_card"] = document["createElement"]("div");
    this['_card']['className'] = "img-node-preview";
    Object["assign"](this["_card"]["style"], {
      'background': 'var(--white-05)',
      'border': "1px solid var(--stroke-10)",
      'position': 'relative',
      'display': "flex",
      'alignItems': "center",
      'justifyContent': "center",
      'overflow': "hidden",
      'width': "100%",
      'height': "100%",
      'flexShrink': '0'
    });
    this["_img"] = document['createElement']("img");
    this['_img']["className"] = 'node-img';
    this["_img"]["decoding"] = "async";
    this["_img"]["loading"] = "eager";
    const _0x4ffa00 = this["_rendererMediaDeferred"] === !![];
    const _0x5cc6e7 = _0x4ffa00 ? _0x5a1586 : '';
    const _0x583267 = this["_rendererRuntimePrebuiltOffscreen"] ? '' : _0x4ffa00 ? _0x5cc6e7 : _0x360fe3;
    const _0x3602b5 = hasSharedCanvasImageAcquisition(_0x583267) ? '' : _0x583267;
    "fetchPriority" in this["_img"] && (this['_img']["fetchPriority"] = _0x3602b5 && (_0x4ffa00 || _0x360fe3 !== _0x4f2323 || _0x561d0d['lod'] === 'full') ? "high" : 'auto');
    Object["assign"](this['_img']["style"], {
      'pointerEvents': "none",
      'width': '100%',
      'height': "100%",
      'objectFit': "cover",
      'display': _0x3602b5 ? 'block' : "none"
    });
    this["_setImageLodSrc"](_0x4ffa00 ? _0x5cc6e7 ? 'placeholder' : '' : _0x5b55f8);
    _0x3602b5 && (trackCanvasImageDisplayLoad(_0x3602b5, this["_img"]), this["_img"]['src'] = _0x3602b5);
    this["_maskOverlay"] = document["createElement"]("img");
    this["_maskOverlay"]["className"] = "node-img-mask-overlay";
    Object["assign"](this["_maskOverlay"]["style"], {
      'pointerEvents': "none"
    });
    !_0x4ffa00 && this["_applyMaskPreview"](_0x238707["maskPreviewUrl"] || _0x238707['maskPreview']);
    this["_jobUI"] = document["createElement"]('div');
    this["_jobUI"]['className'] = 'node-job-ui';
    Object["assign"](this["_jobUI"]["style"], {
      'position': "absolute",
      'inset': '0',
      'zIndex': '5',
      'display': "none",
      'flexDirection': 'column',
      'alignItems': 'center',
      'justifyContent': "center",
      'background': "var(--bg-node)",
      'pointerEvents': "none"
    });
    this["_hint"] = document["createElement"]("div");
    this["_hint"]["className"] = "node-upload-hint source-upload-hint";
    Object["assign"](this["_hint"]["style"], {
      'position': "absolute",
      'top': "12px",
      'right': "12px",
      'zIndex': '10',
      'display': "block"
    });
    this['_uploadBtn'] = document['createElement']('button');
    this["_uploadBtn"]["type"] = "button";
    this["_uploadBtn"]["className"] = "upload-btn source-upload-btn";
    const _0x1d7d49 = "http://www.w3.org/2000/svg";
    const _0x239da7 = document["createElementNS"](_0x1d7d49, "svg");
    _0x239da7['setAttribute']("width", '14');
    _0x239da7["setAttribute"]('height', '14');
    _0x239da7["setAttribute"]('viewBox', "0 0 24 24");
    _0x239da7["setAttribute"]('fill', "none");
    _0x239da7["setAttribute"]("stroke", 'currentColor');
    _0x239da7["setAttribute"]("stroke-width", '2.5');
    const _0x31bffb = document['createElementNS'](_0x1d7d49, 'path');
    _0x31bffb["setAttribute"]('d', "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4");
    const _0x195be4 = document["createElementNS"](_0x1d7d49, 'polyline');
    _0x195be4["setAttribute"]("points", "17 8 12 3 7 8");
    const _0x5122c8 = document["createElementNS"](_0x1d7d49, "line");
    _0x5122c8["setAttribute"]('x1', '12');
    _0x5122c8['setAttribute']('y1', '3');
    _0x5122c8["setAttribute"]('x2', '12');
    _0x5122c8["setAttribute"]('y2', '15');
    _0x239da7["appendChild"](_0x31bffb);
    _0x239da7["appendChild"](_0x195be4);
    _0x239da7["appendChild"](_0x5122c8);
    this["_uploadBtn"]["appendChild"](_0x239da7);
    this["_uploadLabelNode"] = document["createTextNode"]('');
    this['_uploadBtn']["appendChild"](this['_uploadLabelNode']);
    this["_syncLocaleTexts"]();
    this["_hint"]["appendChild"](this["_uploadBtn"]);
    const _0x4e7587 = document["createElement"]("div");
    _0x4e7587["className"] = "node-port out-port";
    const _0x1874b4 = document["createElement"]("div");
    _0x1874b4['className'] = "node-resizer";
    this["_card"]["appendChild"](this['_img']);
    this['_card']["appendChild"](this["_maskOverlay"]);
    this['_card']["appendChild"](this["_jobUI"]);
    this["_card"]['appendChild'](this["_hint"]);
    this['_card']["appendChild"](_0x4e7587);
    this['_card']["appendChild"](_0x1874b4);
    _0x323c38["appendChild"](this["_card"]);
    this["_syncJobUI"](this["_currentJobStatus"]);
    if (shouldShowGenerationResultLoadingUi(_0x238707, {
      'hasResult': !!_0x4f2323
    }) && !this["_currentJobStatus"]) {
      startLoading(this['_card'], {
        'variant': 'static'
      });
      if (this["_hint"]) {
        this["_hint"]["style"]["display"] = "none";
      }
      if (this["_uploadBtn"]) {
        this["_uploadBtn"]['disabled'] = !![];
      }
    }
    this['_card']["addEventListener"]("dblclick", _0x380431 => {
      _0x380431["stopPropagation"]();
      void openNodeImagePreview(this["_data"], {
        'currentSrc': this["_img"]?.['currentSrc'] || this["_img"]?.["src"] || ''
      });
    });
    const _0x139ef0 = () => isCanvasLowZoomActive() || this["_img"]?.['dataset']?.["lodSrc"] === 'thumb';
    const _0x7f5979 = () => {
      if (!_0x139ef0()) {
        return;
      }
      this["_resolvedPreviewSig"] = '';
      void this['_refreshImageDisplay'](!![]);
    };
    const _0x2dd4b2 = (_0x4195b3 = 0x0) => {
      this["_lowZoomHoverRefreshTimer"] && (clearTimeout(this['_lowZoomHoverRefreshTimer']), this["_lowZoomHoverRefreshTimer"] = null);
      if (_0x4195b3 > 0x0) {
        this["_lowZoomHoverRefreshTimer"] = setTimeout(() => {
          this["_lowZoomHoverRefreshTimer"] = null;
          _0x139ef0() && setNodeMediaLodHoverPromoted(this['el'], !![]);
          _0x7f5979();
        }, _0x4195b3);
        return;
      }
      setNodeMediaLodHoverPromoted(this['el'], ![]);
      _0x7f5979();
    };
    this['_card']["addEventListener"]("pointerenter", () => _0x2dd4b2(SOURCE_IMAGE_LOD_HOVER_REFRESH_DELAY_MS));
    this["_card"]["addEventListener"]('pointerleave', () => _0x2dd4b2(0x0));
    this["_input"] = document["createElement"]("input");
    this["_input"]["type"] = "file";
    this["_input"]["accept"] = "image/*";
    this['_input']["style"]["display"] = "none";
    _0x323c38["appendChild"](this["_input"]);
    this['_uploadBtn']["addEventListener"]('click', _0x31a2f0 => {
      _0x31a2f0["stopPropagation"]();
      this["_input"]["click"]();
    });
    _0x1874b4 && _0x1874b4["addEventListener"]('pointerdown', _0x3ab031 => {
      const _0x5ab1e4 = a515_0x57b49f["getStateRaw"]()['ui']?.["imageVideoNodeResizeEnabled"] === !![];
      const _0x19204a = document["getElementById"]("v2-wrap")?.["classList"]["contains"]("v2-media-node-resize-enabled");
      if (!(_0x5ab1e4 && _0x19204a)) {
        return;
      }
      startNodeResizePreview({
        'event': _0x3ab031,
        'nodeId': this['id'],
        'getNode': () => a515_0x57b49f['getStateRaw']()["nodes"]?.[this['id']] || this["_data"],
        'getViewport': () => a515_0x57b49f["getStateRaw"]()["viewport"],
        'resolveSize': ({
          startWidth: _0xc3f2ba,
          startHeight: _0x528f99,
          dx: _0x43e947,
          dy: _0x529db1
        }) => {
          const _0x3626a3 = _0xc3f2ba / _0x528f99;
          const _0x5ae3bb = Math["max"](_0x43e947 / _0xc3f2ba, _0x529db1 / _0x528f99);
          const _0x43f3aa = Math["max"](SOURCE_IMAGE_MIN_SIZE / _0xc3f2ba, SOURCE_IMAGE_MIN_SIZE / _0x528f99);
          const _0x20355c = Math["max"](_0x43f3aa, 0x1 + _0x5ae3bb);
          const _0x418d53 = Math["max"](SOURCE_IMAGE_MIN_SIZE, Math["round"](_0xc3f2ba * _0x20355c));
          const _0x50829c = Math['max'](SOURCE_IMAGE_MIN_SIZE, Math["round"](_0x418d53 / _0x3626a3));
          return {
            'width': _0x418d53,
            'height': _0x50829c
          };
        },
        'buildFinalPatch': ({
          startNode: _0x4dcf20
        }) => _0x4dcf20?.['needsAutoResize'] ? {
          'needsAutoResize': ![]
        } : {},
        'applyPatch': _0x3ebae9 => a515_0x57b49f["updateNodeData"](this['id'], _0x3ebae9),
        'commit': commit
      });
    });
    this["_input"]['addEventListener']('change', async _0x61b637 => {
      const _0x554ff3 = _0x61b637["target"]['files'][0x0];
      if (!_0x554ff3) {
        return;
      }
      this["_isUploading"] = !![];
      startLoading(this["_card"], {
        'variant': "static"
      });
      this["_img"]['style']['display'] = 'none';
      const _0x279c57 = Array['from'](this["_uploadBtn"]['childNodes'])["map"](_0x191c6a => _0x191c6a['cloneNode'](!![]));
      this["_uploadBtn"]["textContent"] = sourceImageText("upload.transcoding");
      this["_uploadBtn"]["style"]["pointerEvents"] = "none";
      try {
        const _0x4761f5 = await new Promise((_0x29bf67, _0x258261) => {
          const _0x4c6603 = URL["createObjectURL"](_0x554ff3);
          const _0x113260 = new Image();
          _0x113260["onload"] = () => {
            const _0x30ef66 = Math["round"](Number(_0x113260["naturalWidth"] || _0x113260["width"]) || 0x0);
            const _0x4bcc41 = Math["round"](Number(_0x113260['naturalHeight'] || _0x113260['height']) || 0x0);
            const _0x43e99a = document["createElement"]("canvas");
            _0x43e99a['width'] = _0x30ef66;
            _0x43e99a["height"] = _0x4bcc41;
            const _0x5831c7 = _0x43e99a["getContext"]('2d');
            _0x5831c7["fillStyle"] = "var(--text-primary)";
            _0x5831c7["fillRect"](0x0, 0x0, _0x43e99a["width"], _0x43e99a["height"]);
            _0x5831c7["drawImage"](_0x113260, 0x0, 0x0);
            URL['revokeObjectURL'](_0x4c6603);
            _0x43e99a['toBlob'](_0x56e784 => {
              if (!_0x56e784) {
                _0x258261(new Error(sourceImageText("upload.canvasTranscodeFailed")));
                return;
              }
              const _0x5599fb = Math["random"]()["toString"](0x24)["substring"](0x2, 0x8);
              const _0x2c83e0 = _0x554ff3["name"]["replace"](/\.[^/.]+$/, '');
              const _0x3f2f1d = "upload_" + _0x5599fb + '_' + _0x2c83e0 + ".jpg";
              _0x29bf67({
                'file': new File([_0x56e784], _0x3f2f1d, {
                  'type': "image/jpeg"
                }),
                'width': _0x30ef66,
                'height': _0x4bcc41
              });
            }, "image/jpeg", 0.85);
          };
          _0x113260["onerror"] = () => {
            URL["revokeObjectURL"](_0x4c6603);
            _0x258261(new Error(sourceImageText('upload.imageLoadFailed')));
          };
          _0x113260["src"] = _0x4c6603;
        });
        const _0x503f8b = _0x4761f5["file"];
        this["_uploadBtn"]["textContent"] = sourceImageText("upload.uploading");
        const _0x38cc80 = window["currentProjectId"] || "default_v2_project";
        const _0x1dfa6a = await uploadFile(_0x503f8b, _0x38cc80);
        const _0x19f5c8 = _0x1dfa6a?.["displayLocalPath"] || _0x1dfa6a?.["thumbLocalPath"] ? _0x1dfa6a : await ensureLocalImageDerivatives(_0x1dfa6a?.['originalLocalPath'] || _0x1dfa6a?.["localPath"]);
        const _0x72b6fb = String(_0x1dfa6a?.["url"] || _0x19f5c8?.["originalUrl"] || '')['trim']();
        const _0x56ed43 = buildImageNodeStorageFields(_0x19f5c8);
        const _0x4178ae = buildSourceImageUploadSizePatch({
          'width': _0x19f5c8?.["originalWidth"] || _0x56ed43["originalWidth"],
          'height': _0x19f5c8?.["originalHeight"] || _0x56ed43["originalHeight"]
        }, {
          'width': _0x4761f5["width"],
          'height': _0x4761f5["height"]
        });
        const _0x1e2440 = _0x554ff3["name"]["replace"](/\.[^/.]+$/, '');
        a515_0x57b49f["renameNode"](this['id'], _0x1e2440);
        const _0x4645cd = document["getElementById"](this['id']);
        const _0x1db8fa = _0x4645cd?.["__v2_name_el"];
        if (_0x1db8fa) {
          _0x1db8fa["textContent"] = _0x1e2440;
        }
        a515_0x57b49f['updateNodeData'](this['id'], {
          'src': _0x72b6fb,
          'assetId': _0x1dfa6a?.["assetId"] || _0x19f5c8?.['assetId'] || '',
          'derivativeStatus': _0x1dfa6a?.['derivativeStatus'] || _0x19f5c8?.["derivativeStatus"] || _0x19f5c8?.["status"] || '',
          ..._0x56ed43,
          'fileName': _0x19f5c8["filename"] || _0x1dfa6a?.['filename'] || _0x503f8b["name"],
          ..._0x4178ae
        });
        !_0x56ed43['thumbLocalPath'] && _0x72b6fb && this['_queueThumbnail'](_0x72b6fb);
      } catch (_0x5ab74f) {
        console["error"]("图片上传失败:", _0x5ab74f);
        alert(sourceImageText("upload.failedRetry"));
        stopLoading(this['_card']);
        this["_currentSrc"] && (this["_img"]["style"]["display"] = 'block');
      } finally {
        this["_isUploading"] = ![];
        this["_uploadBtn"]["replaceChildren"](..._0x279c57["map"](_0x17a4f3 => _0x17a4f3["cloneNode"](!![])));
        this['_uploadLabelNode'] = null;
        this["_syncLocaleTexts"]();
        this['_uploadBtn']['style']['pointerEvents'] = 'auto';
        this["_input"]["value"] = '';
      }
    });
    _0x4f2323 && _0x360fe3 !== _0x4f2323 ? this["_scheduleImageDisplayRefresh"](!![]) : void this["_refreshImageDisplay"](!![]);
    const _0x49623b = _0x323c38["querySelector"](".node-floating-toolbar");
    bindImageToolbarEvents(_0x49623b, this['id']);
    _0x323c38["addEventListener"]("v2-node:free-angle", _0x17dbe5 => {
      _0x17dbe5["stopPropagation"]();
      this["_switchToFreeAngle"]();
    });
    this["_maybeResumePersistedTasks"](this['_data']);
    this['_unsubscribeLocale'] = onLocaleChange(() => this["_syncLocaleTexts"]());
    return _0x323c38;
  }
  ['_syncLocaleTexts']() {
    if (!this['_uploadBtn'] || this["_isUploading"]) {
      return;
    }
    (!this["_uploadLabelNode"] || this["_uploadLabelNode"]["parentNode"] !== this['_uploadBtn']) && (this['_uploadLabelNode'] = Array["from"](this["_uploadBtn"]["childNodes"] || [])['find'](_0x1c4911 => _0x1c4911?.['nodeType'] === 0x3) || null);
    !this['_uploadLabelNode'] && (this['_uploadLabelNode'] = document["createTextNode"](''), this["_uploadBtn"]["appendChild"](this["_uploadLabelNode"]));
    this['_uploadLabelNode']["textContent"] = '\x20' + sourceImageText("upload.button");
  }
  async ["_switchToFreeAngle"]() {
    if (a515_0x3f27c9["active"] && a515_0x3f27c9['nodeId'] === this['id']) {
      a515_0x3f27c9["_exit"]();
      return;
    }
    if (window['v2FocusOnNodeAtZoomPercent']) {
      window['v2FocusOnNodeAtZoomPercent'](this['id'], 0x3c);
    }
    const _0x39f81d = this['el']['querySelector']('.act-multiangle');
    this["_bottomPanel"] = document["createElement"]("div");
    this['_bottomPanel']["className"] = 'text-prompt-panel';
    this['_bottomPanel']["addEventListener"]('pointerdown', _0x983248 => {
      _0x983248["stopPropagation"]();
    });
    await a515_0x3f27c9["render"](this['id'], this['_bottomPanel'], () => this['_switchToImage'](), () => this["_handleGenerate"](), _0x39f81d);
    this['el']['appendChild'](this['_bottomPanel']);
  }
  ["_switchToImage"]() {
    this["_bottomPanel"] && this["_bottomPanel"]['parentNode'] && (this["_bottomPanel"]["parentNode"]["removeChild"](this['_bottomPanel']), this['_bottomPanel'] = null);
  }
  ["_handleGenerate"]() {
    if (window["showToast"]) {
      window["showToast"](sourceImageText('toasts.generateUnsupported'), 'info');
    }
  }
  ["_showLowZoomThumb"](_0x551bb9) {
    const _0x1e5486 = String(_0x551bb9 || '')["trim"]();
    if (!_0x1e5486) {
      this["_showImg"]('', '');
      return;
    }
    stopLoading(this["_card"]);
    this["_currentSrc"] = _0x1e5486;
    if (this["_img"]) {
      const _0x181b9a = String(this["_img"]["getAttribute"]("src") || '')["trim"]();
      _0x181b9a !== _0x1e5486 && !hasSharedCanvasImageAcquisition(_0x1e5486) && (this["_assignImageDisplaySource"](_0x1e5486), this["_setImageLodSrc"]("thumb"), trackCanvasImageDisplayLoad(_0x1e5486, this['_img']));
      (_0x181b9a || !hasSharedCanvasImageAcquisition(_0x1e5486)) && (this['_img']["style"]['display'] = "block");
    }
    if (this["_hint"]) {
      this['_hint']['style']["display"] = "block";
    }
  }
  ["_showImg"](_0x15eff2, _0x34c57f = '') {
    if (this['_rendererMediaDeferred'] === !![]) {
      this["_currentSrc"] = String(_0x15eff2 || '')["trim"]();
      this["_resolvedPreviewSig"] = '';
      return;
    }
    if (!_0x15eff2) {
      stopLoading(this["_card"]);
      clearCanvasImageDisplayHandoff(this["_img"]);
      this["_setImageLodSrc"]('');
      this["_img"]['style']['display'] = 'none';
      if (this['_data']?.["isGenerating"]) {
        if (this['_hint']) {
          this["_hint"]["style"]["display"] = 'none';
        }
      } else {
        if (this["_hint"]) {
          this['_hint']["style"]["display"] = 'block';
        }
      }
      return;
    }
    const _0x2eac41 = String(_0x34c57f || this["_cachedThumbUrl"] || '')["trim"]();
    logDragImportProfile("SourceImageNode:show-img", {
      'id': this['id'],
      'url': _0x15eff2,
      'fallbackThumb': _0x2eac41,
      'currentSrc': this["_currentSrc"] || '',
      'isGenerating': !!this["_data"]?.["isGenerating"],
      'jobStatus': this["_data"]?.["jobStatus"] || ''
    });
    if (this["_failedSrc"] === _0x15eff2 && _0x2eac41 && isCanvasImagePreloadCoolingDown(_0x15eff2)) {
      this["_assignImageDisplaySource"](_0x2eac41);
      this["_setImageLodSrc"]("placeholder");
      this["_img"]["style"]["display"] = "block";
      if (this["_hint"]) {
        this["_hint"]["style"]["display"] = "block";
      }
      return;
    }
    const _0x46af8f = String(this["_img"]?.["getAttribute"]("src") || '')["trim"]();
    const _0x315a39 = this["_currentSrc"] === _0x15eff2 && _0x46af8f === _0x15eff2 && this["_img"]["style"]["display"] !== 'none';
    let _0x536476 = ![];
    let _0x49f6a2 = ![];
    let _0x4dd69b = null;
    const _0x5e4b00 = String(this['_img']?.["getAttribute"]('src') || '')["trim"]();
    const _0x56d8e8 = String(this["_img"]?.["dataset"]?.["lodSrc"] || '')["trim"]();
    const _0x58b00f = _0x56d8e8 === 'placeholder' && !!_0x2eac41 && _0x5e4b00 === _0x2eac41;
    const _0x41bd38 = this['_shouldUseLowZoomThumbnail']();
    const _0x15920f = _0x58b00f && !_0x41bd38;
    if (_0x15920f && !hasSharedCanvasImageAcquisition(_0x15eff2)) {
      _0x4dd69b = this["_waitForDisplayedImageLoad"](_0x15eff2, {
        'allowPendingSrc': !![]
      });
      if ("fetchPriority" in this["_img"]) {
        this["_img"]['fetchPriority'] = 'high';
      }
      if ('loading' in this["_img"]) {
        this["_img"]['loading'] = "eager";
      }
      this['_assignImageDisplaySource'](_0x15eff2);
      this["_setImageLodSrc"]("full");
      this["_img"]['style']["display"] = "block";
      if (this['_hint']) {
        this["_hint"]["style"]['display'] = "block";
      }
    } else {
      if (_0x58b00f && this["_currentSrc"] !== _0x15eff2) {
        this["_setImageLodSrc"]("placeholder");
        this["_assignImageDisplaySource"](_0x2eac41);
        this['_img']["style"]["display"] = "block";
        if (this['_hint']) {
          this["_hint"]["style"]["display"] = "block";
        }
        _0x536476 = !![];
      } else {
        if (this["_currentSrc"] !== _0x15eff2) {
          const _0x1f9fb7 = !_0x5e4b00 || this["_img"]["style"]["display"] === "none";
          if (_0x1f9fb7) {
            if (!hasSharedCanvasImageAcquisition(_0x15eff2)) {
              _0x4dd69b = this["_waitForDisplayedImageLoad"](_0x15eff2, {
                'allowPendingSrc': !![]
              });
              this["_assignImageDisplaySource"](_0x15eff2);
              this["_setImageLodSrc"]("full");
              this['_img']['style']["display"] = "block";
              if (this["_hint"]) {
                this['_hint']['style']["display"] = "block";
              }
            }
          } else {
            this["_img"]['style']["display"] = "block";
            _0x49f6a2 = !![];
          }
        }
      }
    }
    this["_currentSrc"] = _0x15eff2;
    const _0x4535c6 = String(this['_img']?.["getAttribute"]("src") || '')["trim"]();
    const _0x289699 = _0x4535c6 === _0x15eff2 && this["_img"]["style"]["display"] !== 'none';
    const _0x29338c = !!_0x2eac41 && (_0x536476 || _0x4535c6 === _0x2eac41) && this['_img']["style"]["display"] !== "none";
    const _0x2a899c = _0x49f6a2 && !!_0x4535c6 && _0x4535c6 !== _0x15eff2 && this["_img"]["style"]["display"] !== 'none';
    !_0x289699 && !_0x29338c && !_0x2a899c ? startLoading(this["_card"], {
      'variant': "static"
    }) : stopLoading(this["_card"]);
    if (_0x315a39) {
      const _0x55bbd0 = a515_0x57b49f["getStateRaw"]()["nodes"]?.[this['id']];
      const _0x1b346d = Number(_0x55bbd0?.["imageWidth"] || 0x0) > 0x0 && Number(_0x55bbd0?.["imageHeight"] || 0x0) > 0x0;
      const _0x4801e7 = _0x55bbd0?.["fixedSize"] !== !![] && _0x55bbd0?.['needsAutoResize'] === !![];
      const _0x54cc0a = this["_img"]?.["complete"] === !![] && Number(this['_img']?.["naturalWidth"] || 0x0) > 0x0;
      if (_0x1b346d && !_0x4801e7 && _0x54cc0a) {
        if (this["_hint"]) {
          this["_hint"]['style']['display'] = "block";
        }
        return;
      }
    }
    if (_0x41bd38 && _0x29338c && !_0x289699) {
      if (this['_hint']) {
        this["_hint"]["style"]['display'] = "block";
      }
      return;
    }
    const _0x5d80e0 = !_0x41bd38;
    const _0x163394 = _0x289699 ? _0x4dd69b || this["_waitForDisplayedImageLoad"](_0x15eff2) : preloadCanvasImage(_0x15eff2, {
      'decode': !![],
      'priority': _0x5d80e0 ? 0x78 : _0x2eac41 ? 0x14 : 0xa,
      'fetchPriority': _0x5d80e0 ? "high" : _0x2eac41 ? "auto" : "high",
      'allowWhenPaused': _0x5d80e0,
      'deferWhenPaused': !_0x5d80e0
    });
    _0x163394["then"](({
      image: _0x268079,
      naturalWidth: _0x3b745b,
      naturalHeight: _0x1dd996
    }) => {
      if (this["_currentSrc"] !== _0x15eff2) {
        return;
      }
      if (!this["_shouldCommitPreloadedImage"](_0x15eff2)) {
        return;
      }
      logDragImportProfile("SourceImageNode:preload:onload", {
        'id': this['id'],
        'url': _0x15eff2,
        'naturalWidth': _0x3b745b || _0x268079?.["naturalWidth"] || 0x0,
        'naturalHeight': _0x1dd996 || _0x268079?.['naturalHeight'] || 0x0
      });
      const _0x20e9af = Math["max"](0x1, Math["round"](_0x3b745b || _0x268079?.["naturalWidth"] || 0x0));
      const _0x55025d = Math['max'](0x1, Math['round'](_0x1dd996 || _0x268079?.["naturalHeight"] || 0x0));
      const _0x529c34 = a515_0x57b49f['getStateRaw']()['nodes']?.[this['id']];
      if (_0x529c34) {
        const _0x37b777 = Number(_0x529c34["imageWidth"] || 0x0);
        const _0x1935ae = Number(_0x529c34["imageHeight"] || 0x0);
        (_0x37b777 !== _0x20e9af || _0x1935ae !== _0x55025d) && a515_0x57b49f["updateNodeData"](this['id'], {
          'imageWidth': _0x20e9af,
          'imageHeight': _0x55025d
        });
      }
      if (!_0x289699) {
        stopLoading(this["_card"]);
        if ("fetchPriority" in this['_img']) {
          this['_img']["fetchPriority"] = "high";
        }
        if ("loading" in this["_img"]) {
          this['_img']["loading"] = "eager";
        }
        this['_assignImageDisplaySource'](_0x15eff2);
        this["_setImageLodSrc"]("full");
      }
      this["_img"]["style"]["display"] = "block";
      if (this['_hint']) {
        this["_hint"]["style"]['display'] = "block";
      }
      this["_activeCapturePreviewUrl"] && this["_activeCapturePreviewUrl"] !== _0x15eff2 && (this["_releaseActiveCapturePreviewUrl"](), _0x529c34?.["capturePreviewUrl"] && a515_0x57b49f["updateNodeData"](this['id'], {
        'capturePreviewUrl': ''
      }));
      !String(_0x529c34?.["thumbLocalPath"] || '')["trim"]() && this["_queueThumbnail"](_0x15eff2);
      if (this["_data"]["fixedSize"]) {
        return;
      }
      if (!this["_data"]["needsAutoResize"]) {
        return;
      }
      const {
        width: _0x4b4123,
        height: _0x2d1874
      } = getAutoMediaSizeByShortSide(_0x20e9af || 0x3e8, _0x55025d || 0x3e8);
      a515_0x57b49f["updateNodeData"](this['id'], {
        'width': _0x4b4123,
        'height': _0x2d1874,
        'needsAutoResize': ![]
      });
    })['catch'](() => {
      if (this["_currentSrc"] !== _0x15eff2) {
        return;
      }
      if (!this["_shouldCommitPreloadedImage"](_0x15eff2)) {
        return;
      }
      stopLoading(this['_card']);
      this["_failedSrc"] = _0x15eff2;
      const _0x549698 = String(this["_img"]?.['getAttribute']("src") || '')["trim"]();
      const _0x168e14 = !!_0x549698 && _0x549698 !== _0x15eff2 && this['_img']['style']["display"] !== 'none';
      if (_0x2eac41) {
        this["_setImageLodSrc"]("placeholder");
        _0x549698 !== _0x2eac41 && this['_assignImageDisplaySource'](_0x2eac41);
        this["_img"]["style"]["display"] = 'block';
      } else {
        _0x168e14 ? this['_img']['style']["display"] = "block" : (clearCanvasImageDisplayHandoff(this['_img']), this["_setImageLodSrc"](''), this['_img']["src"] = '', this["_img"]['style']["display"] = "none");
      }
      if (this['_hint']) {
        this["_hint"]["style"]["display"] = "block";
      }
    });
  }
  ["_computeGenerationDuration"](_0xfa64e7 = this["_data"]) {
    if (!_0xfa64e7) {
      return 0x0;
    }
    if (typeof _0xfa64e7["generationDuration"] === "number") {
      return _0xfa64e7["generationDuration"];
    }
    const _0x41d4c9 = Number(_0xfa64e7["generationStartTime"] || 0x0);
    if (!Number["isFinite"](_0x41d4c9) || _0x41d4c9 <= 0x0) {
      return 0x0;
    }
    return Math["max"](0x0, Date["now"]() - _0x41d4c9);
  }
  ['hydrateDeferredMedia']() {
    if (this['_rendererMediaDeferred'] !== !![]) {
      return;
    }
    this['_rendererMediaDeferred'] = ![];
    this["_resolvedPreviewSig"] = '';
    const _0x44f0b1 = a515_0x57b49f["getStateRaw"]()["nodes"]?.[this['id']] || this['_data'];
    this['update'](_0x44f0b1);
  }
  ["_inferAsyncProvider"](_0xb57ff4 = this["_data"]) {
    const _0x54d9d3 = String(_0xb57ff4?.["model"] || '')['trim']();
    const _0x4d4858 = resolveModelProvider(_0x54d9d3, '', {
      'allowProviderHint': ![]
    });
    if (_0x4d4858) {
      return _0x4d4858;
    }
    const _0x3d0bd5 = String(_0xb57ff4?.["asyncTaskProvider"] || _0xb57ff4?.['provider'] || '')["trim"]()["toLowerCase"]();
    if (_0x3d0bd5) {
      return _0x3d0bd5;
    }
    if (_0x54d9d3 && !_0x54d9d3["includes"]('/')) {
      return "grsai";
    }
    return "grsai";
  }
  ['_isRunningHubRecoverableTask'](_0x237ccd = this["_data"]) {
    if (!_0x237ccd || typeof _0x237ccd !== "object") {
      return ![];
    }
    const _0x5be9af = String(_0x237ccd['rhTaskId'] || '')["trim"]();
    if (!_0x5be9af) {
      return ![];
    }
    const _0x539788 = String(_0x237ccd["rhTaskStatus"] || '')['trim']()["toLowerCase"]();
    if (["success", "idle", 'cancelled']['includes'](_0x539788)) {
      return ![];
    }
    if (_0x539788 === "failed" && !this["_isRunningHubLocalPendingFailure"](_0x237ccd)) {
      return ![];
    }
    const _0xd80de3 = String(_0x237ccd["provider"] || '')["trim"]()["toLowerCase"]();
    const _0x3ead77 = String(_0x237ccd["model"] || '')['trim']();
    const _0x356755 = resolveModelProvider(_0x3ead77, _0xd80de3, {
      'allowProviderHint': ![]
    });
    return _0xd80de3 === "runninghubwf" || _0xd80de3 === "runninghub" || isWorkflowModel(_0x3ead77, _0xd80de3 || 'runninghubwf') || _0x356755 === "runninghub" && isModelApiModel(_0x3ead77, "runninghub");
  }
  ['_isRunningHubLocalPendingFailure'](_0x52fcc0 = this['_data']) {
    const _0x36fde0 = [_0x52fcc0?.["outputText"], _0x52fcc0?.["jobError"], _0x52fcc0?.["rhStatusMessage"]]["map"](_0x2510d6 => String(_0x2510d6 || '')["trim"]())['filter'](Boolean)['join']('\x0a')["toLowerCase"]();
    if (!_0x36fde0) {
      return ![];
    }
    return _0x36fde0['includes']("任务超时") || _0x36fde0['includes']("请求超时") || _0x36fde0["includes"]('处理超时') || _0x36fde0["includes"]("仍在生成") || _0x36fde0["includes"]("继续查询") || _0x36fde0["includes"]("runninghub 仍在生成"["toLowerCase"]());
  }
  ["_clearRunningHubRecoveryRetry"]() {
    if (!this['_rhResumeRetryTimer']) {
      return;
    }
    clearTimeout(this["_rhResumeRetryTimer"]);
    this["_rhResumeRetryTimer"] = null;
  }
  ["_scheduleRunningHubRecoveryRetry"](_0xf75b29 = 0x1388) {
    this["_clearRunningHubRecoveryRetry"]();
    this["_rhResumeRetryTimer"] = setTimeout(() => {
      this["_rhResumeRetryTimer"] = null;
      this["_maybeResumeRunningHubTask"]();
    }, Math["max"](0x3e8, Number(_0xf75b29) || 0x1388));
  }
  ["_isDreaminaRecoverableTask"](_0x135eef = this["_data"]) {
    if (!_0x135eef || typeof _0x135eef !== 'object') {
      return ![];
    }
    const _0x5843ec = String(_0x135eef['dreaminaSubmitId'] || '')["trim"]();
    if (!_0x5843ec) {
      return ![];
    }
    const _0x2c272e = String(_0x135eef["provider"] || '')["trim"]()["toLowerCase"]();
    const _0x41a680 = String(_0x135eef["model"] || '')["trim"]();
    if (!(_0x2c272e === "dreamina" || resolveModelProvider(_0x41a680, _0x2c272e) === "dreamina")) {
      return ![];
    }
    const _0x1d1703 = normalizeTaskStatus(_0x135eef["jobStatus"]);
    const _0x26a723 = normalizeTaskStatus(_0x135eef["dreaminaTaskPhase"]);
    const _0x2c9fe4 = normalizeTaskStatus(_0x135eef["dreaminaTaskStatus"]);
    if (NON_RECOVERABLE_FAILURE_STATUSES['has'](_0x1d1703)) {
      return ![];
    }
    if (DREAMINA_NON_RECOVERABLE_PHASES["has"](_0x26a723)) {
      return ![];
    }
    if (DREAMINA_NON_RECOVERABLE_STATUSES["has"](_0x2c9fe4)) {
      return ![];
    }
    if (_0x135eef["isGenerating"] === !![] && _0x135eef["dreaminaTaskRecovering"] !== !![]) {
      const _0x5ac2d9 = Number(_0x135eef["dreaminaTaskLastCheckedAt"] || _0x135eef["dreaminaTaskStartedAt"] || _0x135eef['generationStartTime'] || 0x0);
      if (Number["isFinite"](_0x5ac2d9) && _0x5ac2d9 > 0x0 && Date['now']() - _0x5ac2d9 < DREAMINA_STALE_ACTIVE_RESUME_MS) {
        return ![];
      }
    }
    return !![];
  }
  ["_isDreaminaPollTimeoutError"](_0x1172a0) {
    const _0x1e108d = String(_0x1172a0?.["code"] || '')['trim']()["toUpperCase"]();
    if (_0x1e108d === DREAMINA_POLL_TIMEOUT_CODE || _0x1e108d === 'TIMEOUT') {
      return !![];
    }
    const _0x2ec94b = String(_0x1172a0?.['type'] || '')["trim"]()["toUpperCase"]();
    if (_0x2ec94b === "TIMEOUT" || _0x2ec94b === "TASK_TIMEOUT") {
      return !![];
    }
    const _0x4a9789 = String(_0x1172a0?.["message"] || '')["trim"]()["toLowerCase"]();
    return _0x4a9789["includes"]("timeout") || _0x4a9789['includes']('超时');
  }
  ["_isAsyncRecoverableTask"](_0x5b25b6 = this["_data"]) {
    if (!_0x5b25b6 || typeof _0x5b25b6 !== "object") {
      return ![];
    }
    const _0x110622 = String(_0x5b25b6["asyncTaskId"] || '')["trim"]();
    if (!_0x110622) {
      return ![];
    }
    const _0x108591 = this['_inferAsyncProvider'](_0x5b25b6);
    if (!_0x108591 || _0x108591 === "runninghubwf" || _0x108591 === "runninghub" || _0x108591 === "dreamina") {
      return ![];
    }
    const _0x2c4709 = String(_0x5b25b6["asyncTaskKind"] || '')["trim"]()["toLowerCase"]();
    if (_0x2c4709 && _0x2c4709 !== "image") {
      return ![];
    }
    const _0x5a1d74 = String(_0x5b25b6["asyncTaskStatus"] || '')["trim"]()["toLowerCase"]();
    if (["success", "failed", "idle", "cancelled"]["includes"](_0x5a1d74)) {
      return ![];
    }
    return !![];
  }
  ["_stopRunningHubRecovery"](_0x233d9a = !![]) {
    try {
      this['_rhResumeAbortController']?.["abort"]?.();
    } catch {}
    this["_clearRunningHubRecoveryRetry"]();
    this["_rhResumeAbortController"] = null;
    this["_rhResumePromise"] = null;
    this["_rhResumeTaskId"] = '';
    if (!_0x233d9a) {
      return;
    }
    const _0x1f32ea = a515_0x57b49f["getState"]()['nodes']?.[this['id']];
    if (!_0x1f32ea || _0x1f32ea['rhTaskRecovering'] !== !![]) {
      return;
    }
    a515_0x57b49f['updateNodeData'](this['id'], {
      'rhTaskRecovering': ![]
    });
  }
  ["_stopDreaminaRecovery"](_0x4c72af = !![]) {
    try {
      this["_dreaminaResumeAbortController"]?.["abort"]?.();
    } catch {}
    this["_dreaminaResumeAbortController"] = null;
    this['_dreaminaResumePromise'] = null;
    this['_dreaminaResumeSubmitId'] = '';
    if (!_0x4c72af) {
      return;
    }
    const _0x391584 = a515_0x57b49f["getState"]()['nodes']?.[this['id']];
    if (!_0x391584 || _0x391584["dreaminaTaskRecovering"] !== !![]) {
      return;
    }
    a515_0x57b49f["updateNodeData"](this['id'], {
      'dreaminaTaskRecovering': ![]
    });
  }
  ["_stopAsyncRecovery"](_0x39ae4a = !![]) {
    try {
      this['_asyncResumeAbortController']?.["abort"]?.();
    } catch {}
    this["_asyncResumeAbortController"] = null;
    this["_asyncResumePromise"] = null;
    this["_asyncResumeTaskId"] = '';
    if (!_0x39ae4a) {
      return;
    }
    const _0x248d04 = a515_0x57b49f['getState']()["nodes"]?.[this['id']];
    if (!_0x248d04 || _0x248d04["asyncTaskRecovering"] !== !![]) {
      return;
    }
    a515_0x57b49f['updateNodeData'](this['id'], {
      'asyncTaskRecovering': ![]
    });
  }
  ["_resolveRunningHubResumePayload"](_0x214bf4) {
    const _0x5692cc = String(_0x214bf4?.['model'] || '')["trim"]();
    const _0x56530f = String(_0x214bf4?.["provider"] || '')["trim"]()['toLowerCase']();
    const _0x14d4a4 = String(_0x214bf4?.["taskProviderProfileId"] || _0x214bf4?.["providerProfileId"] || _0x214bf4?.["rhProviderProfileId"] || '')["trim"]();
    let _0x4fc383 = _0x56530f;
    !_0x4fc383 && (_0x4fc383 = isModelApiModel(_0x5692cc, "runninghub") ? "runninghub" : "runninghubwf");
    return {
      'model': _0x5692cc,
      'provider': _0x4fc383,
      ...(_0x14d4a4 ? {
        'providerProfileId': _0x14d4a4,
        'rhProviderProfileId': _0x14d4a4
      } : {})
    };
  }
  ["_resolveDreaminaResumePayload"](_0x108541) {
    return {
      'model': String(_0x108541?.["model"] || '')["trim"]() || getDefaultDreaminaImageModelId(),
      'provider': "dreamina"
    };
  }
  ["_resolveAsyncResumePayload"](_0x3fb6c8) {
    return {
      'model': String(_0x3fb6c8?.["model"] || '')['trim'](),
      'provider': this["_inferAsyncProvider"](_0x3fb6c8)
    };
  }
  ["_fileNameFromPath"](_0x3059b9) {
    const _0x108245 = String(_0x3059b9 || '')['replace'](/^\/+/, '');
    if (!_0x108245) {
      return '';
    }
    const _0x1cb087 = _0x108245["split"]('/');
    return String(_0x1cb087[_0x1cb087["length"] - 0x1] || '')["trim"]();
  }
  ["_buildRecoveredImageResultPatch"](_0x57578a, _0x53e385 = sourceImageText("recovery.imageTaskFailed")) {
    const _0x339e0e = _0x57578a?.['isBatch'] && Array["isArray"](_0x57578a["images"]) ? _0x57578a["images"][0x0] : _0x57578a;
    if (!_0x339e0e || _0x339e0e["error"]) {
      throw new Error(String(_0x339e0e?.["error"] || _0x53e385));
    }
    const _0x14f466 = buildCanvasLocalImageFields(_0x339e0e, {
      'includeSrc': !![]
    });
    if (!_0x14f466["src"] || !_0x14f466["localPath"]) {
      throw new Error(sourceImageText("recovery.noOutputImage"));
    }
    return {
      ..._0x14f466,
      'fileName': this["_fileNameFromPath"](_0x14f466["localPath"])
    };
  }
  ['_maybeResumePersistedTasks'](_0x395f6a = this["_data"]) {
    const _0xad4ead = _0x395f6a || this['_data'] || {};
    if (isTaskFailed(_0xad4ead) || isTaskCancelled(_0xad4ead)) {
      this['_stopRunningHubRecovery'](!![]);
      this['_stopDreaminaRecovery'](!![]);
      this["_stopAsyncRecovery"](!![]);
      return;
    }
    (_0xad4ead["rhTaskId"] || this["_rhResumePromise"] || this['_rhResumeTaskId']) && this["_maybeResumeRunningHubTask"](_0xad4ead);
    (_0xad4ead["dreaminaSubmitId"] || this["_dreaminaResumePromise"] || this["_dreaminaResumeSubmitId"]) && this['_maybeResumeDreaminaTask'](_0xad4ead);
    (_0xad4ead["asyncTaskId"] || this["_asyncResumePromise"] || this["_asyncResumeTaskId"]) && this["_maybeResumeAsyncTask"](_0xad4ead);
  }
  ["_maybeResumeRunningHubTask"](_0x5a8d57 = null) {
    const _0x41e5e3 = _0x5a8d57 || (typeof a515_0x57b49f['getStateRaw'] === "function" ? a515_0x57b49f["getStateRaw"]()?.['nodes']?.[this['id']] : a515_0x57b49f["getState"]()['nodes']?.[this['id']]) || this["_data"];
    if (!this["_isRunningHubRecoverableTask"](_0x41e5e3)) {
      this["_stopRunningHubRecovery"](!![]);
      return;
    }
    const _0x500245 = String(_0x41e5e3?.["rhTaskId"] || '')['trim']();
    if (!_0x500245) {
      return;
    }
    if (this["_rhResumePromise"] && this["_rhResumeTaskId"] === _0x500245) {
      return;
    }
    const _0x1bb18a = Number(_0x41e5e3?.['rhTaskStartedAt'] || _0x41e5e3?.['generationStartTime'] || 0x0) || Date['now']();
    const _0x1e1a83 = this["_resolveRunningHubResumePayload"](_0x41e5e3);
    const _0xc746d1 = _0x41e5e3?.["rhTaskUseOpenapiQuery"] === !![];
    const _0x2bd039 = typeof this["_resumeRunningHubTaskPoller"] === "function" ? this["_resumeRunningHubTaskPoller"] : resumeRunningHubImageTask;
    const _0x2f7fc5 = new AbortController();
    this["_rhResumeAbortController"] = _0x2f7fc5;
    this["_rhResumeTaskId"] = _0x500245;
    const _0x1cd400 = (async () => {
      try {
        const _0x42e92b = await resumeTask({
          'sourceNodeId': this['id'],
          'targetNodeId': this['id'],
          'trigger': 'node',
          'taskType': "image-generation",
          'provider': _0x1e1a83["provider"] || _0x41e5e3?.["provider"] || 'runninghubwf',
          'adapterType': "workflow",
          'modelId': _0x1e1a83["model"] || _0x41e5e3?.["model"] || '',
          'executionId': "runninghub.source-image." + (_0x1e1a83['model'] || _0x41e5e3?.['model'] || "workflow"),
          'payload': _0x1e1a83,
          'taskId': _0x500245,
          'cancellable': ![],
          'resumable': !![],
          'startBuilder': () => ({
            'rhTaskStatus': String(_0x41e5e3?.["rhTaskStatus"] || '')["trim"]()["toLowerCase"]() === "pending" ? 'pending' : 'running',
            'rhTaskUseOpenapiQuery': _0xc746d1
          }),
          'poll': async () => _0x2bd039(_0x500245, _0x1e1a83, {
            'signal': _0x2f7fc5["signal"],
            'useOpenapiQuery': _0xc746d1,
            'softTimeout': !![]
          }),
          'resultBuilder': async _0x1a4efa => {
            const _0x1b07b9 = a515_0x57b49f["getState"]()["nodes"]?.[this['id']] || {};
            const _0x19cd95 = String(_0x1b07b9?.["name"] || sourceImageText('result.defaultName'))["replace"](/\s*\(处理中\)\s*$/, '')["replace"](/\s*\(恢复中\)\s*$/, '')["trim"]();
            return {
              ...this["_buildRecoveredImageResultPatch"](_0x1a4efa, sourceImageText("recovery.imageTaskFailed")),
              'name': _0x19cd95 || sourceImageText("result.defaultName"),
              'generationDuration': this["_computeGenerationDuration"](_0x1b07b9)
            };
          },
          'failureBuilder': (_0x553dc0, _0x22917d) => {
            const _0x4194c6 = _0x553dc0 instanceof Error ? _0x553dc0['message'] : String(_0x553dc0 || sourceImageText("recovery.taskFailed"));
            const _0x2615b0 = a515_0x57b49f["getState"]()['nodes']?.[this['id']] || {};
            return buildSourceImageRecoveryFailurePatch(_0x2615b0, {
              'error': _0x4194c6,
              'startedAt': _0x22917d['startedAt'],
              'duration': this['_computeGenerationDuration'](_0x2615b0)
            });
          },
          'parseError': _0x2510dc => _0x2510dc instanceof Error ? _0x2510dc["message"] : String(_0x2510dc || sourceImageText("recovery.taskFailed"))
        }, {
          'store': a515_0x57b49f,
          'startedAt': _0x1bb18a,
          'abortController': _0x2f7fc5
        });
        if (_0x42e92b["status"] === "pending") {
          window["_triggerLocalCacheSave"]?.();
          this["_scheduleRunningHubRecoveryRetry"]();
          return;
        }
        _0x42e92b["status"] === "success" && window['_triggerLocalCacheSave']?.();
      } catch (_0x379cd4) {
        if (_0x2f7fc5["signal"]["aborted"] || String(_0x379cd4?.["message"] || '') === 'CANCELLED' || _0x379cd4?.["name"] === "AbortError") {
          return;
        }
        const _0x358e2a = _0x379cd4 instanceof Error ? _0x379cd4["message"] : String(_0x379cd4 || sourceImageText('recovery.taskFailed'));
        const _0x4c63ee = a515_0x57b49f['getState']()["nodes"]?.[this['id']];
        if (!_0x4c63ee) {
          return;
        }
        a515_0x57b49f['updateNodeData'](this['id'], {
          ...buildSourceImageRecoveryFailurePatch(_0x4c63ee, {
            'error': _0x358e2a,
            'startedAt': _0x1bb18a,
            'duration': this["_computeGenerationDuration"](_0x4c63ee)
          }),
          'isGenerating': ![],
          'rhTaskStatus': "failed",
          'rhTaskRecovering': ![]
        });
      } finally {
        this['_rhResumeAbortController'] === _0x2f7fc5 && (this["_rhResumeAbortController"] = null);
        this["_rhResumeTaskId"] === _0x500245 && (this["_rhResumeTaskId"] = '');
        this["_rhResumePromise"] = null;
      }
    })();
    this['_rhResumePromise'] = _0x1cd400;
  }
  ["_maybeResumeDreaminaTask"](_0x5204fe = null) {
    const _0x344cfe = _0x5204fe || (typeof a515_0x57b49f['getStateRaw'] === "function" ? a515_0x57b49f['getStateRaw']()?.["nodes"]?.[this['id']] : a515_0x57b49f["getState"]()["nodes"]?.[this['id']]) || this["_data"];
    if (!this["_isDreaminaRecoverableTask"](_0x344cfe)) {
      this['_stopDreaminaRecovery'](!![]);
      return;
    }
    const _0x41f222 = String(_0x344cfe?.["dreaminaSubmitId"] || '')["trim"]();
    if (!_0x41f222) {
      return;
    }
    if (this['_dreaminaResumeSubmitId'] === _0x41f222) {
      return;
    }
    const _0x4a5b43 = Number(_0x344cfe?.["dreaminaTaskStartedAt"] || _0x344cfe?.['generationStartTime'] || 0x0) || Date['now']();
    const _0x4b297f = this["_resolveDreaminaResumePayload"](_0x344cfe);
    const _0x37a19b = typeof this["_dreaminaResumePoller"] === "function" ? this["_dreaminaResumePoller"] : resumeDreaminaImageTask;
    const _0x28e98b = new AbortController();
    this['_dreaminaResumeAbortController'] = _0x28e98b;
    this["_dreaminaResumeSubmitId"] = _0x41f222;
    const _0x4d6cb4 = (async () => {
      try {
        const _0x424ec0 = await resumeTask({
          'sourceNodeId': this['id'],
          'targetNodeId': this['id'],
          'trigger': "node",
          'taskType': 'image-generation',
          'provider': "dreamina",
          'adapterType': "localRuntime",
          'modelId': _0x4b297f["model"] || _0x344cfe?.['model'] || '',
          'executionId': 'dreamina.source-image.' + (_0x4b297f["model"] || _0x344cfe?.['model'] || "image"),
          'payload': _0x4b297f,
          'taskId': _0x41f222,
          'cancellable': ![],
          'resumable': !![],
          'startBuilder': () => ({
            'dreaminaSubmitId': _0x41f222,
            'dreaminaTaskStatus': 'pending',
            'dreaminaTaskPhase': "generating",
            'dreaminaTaskLabel': String(_0x344cfe?.['dreaminaTaskLabel'] || '')["trim"]() || sourceImageText("status.generating"),
            'dreaminaTaskStartedAt': _0x4a5b43,
            'dreaminaTaskLastCheckedAt': Date["now"](),
            'dreaminaTaskRecovering': !![]
          }),
          'poll': async () => _0x37a19b(_0x41f222, _0x4b297f, {
            'signal': _0x28e98b["signal"]
          }),
          'resultBuilder': async (_0x5ce555, _0x453e5d) => {
            const _0x339387 = a515_0x57b49f["getState"]()["nodes"]?.[this['id']] || {};
            const _0x18749b = String(_0x339387?.["name"] || sourceImageText("result.defaultName"))['replace'](/\s*\(处理中\)\s*$/, '')["replace"](/\s*\(恢复中\)\s*$/, '')["trim"]();
            return {
              ...this["_buildRecoveredImageResultPatch"](_0x5ce555, sourceImageText("recovery.dreaminaImageTaskFailed")),
              'isGenerating': ![],
              'name': _0x18749b || sourceImageText("result.defaultName"),
              'generationDuration': this["_computeGenerationDuration"](_0x339387),
              'dreaminaTaskStatus': "success",
              'dreaminaTaskPhase': 'done',
              'dreaminaTaskLabel': sourceImageText("status.completed"),
              'dreaminaTaskLastCheckedAt': Date['now'](),
              'dreaminaTaskRecovering': ![]
            };
          },
          'failureBuilder': (_0x200d79, _0x1d51ff) => {
            const _0x256703 = _0x200d79 instanceof Error ? _0x200d79["message"] : String(_0x200d79 || sourceImageText("recovery.taskFailed"));
            const _0x2e3adb = a515_0x57b49f['getState']()["nodes"]?.[this['id']] || {};
            if (this["_isDreaminaPollTimeoutError"](_0x200d79)) {
              return {
                'isGenerating': !![],
                'jobStatus': "running",
                'jobError': null,
                'generationDuration': Date["now"]() - _0x1d51ff["startedAt"],
                'dreaminaTaskStatus': 'pending',
                'dreaminaTaskPhase': "generating",
                'dreaminaTaskLabel': sourceImageText("status.queuedBackground"),
                'dreaminaTaskStartedAt': _0x1d51ff["startedAt"],
                'dreaminaTaskLastCheckedAt': Date['now'](),
                'dreaminaTaskRecovering': ![]
              };
            }
            return {
              ...buildSourceImageRecoveryFailurePatch(_0x2e3adb, {
                'error': _0x256703,
                'startedAt': _0x1d51ff["startedAt"],
                'duration': this["_computeGenerationDuration"](_0x2e3adb)
              }),
              'isGenerating': ![],
              'dreaminaTaskStatus': "failed",
              'dreaminaTaskPhase': 'failed',
              'dreaminaTaskLabel': _0x256703 || sourceImageText("recovery.failed"),
              'dreaminaTaskLastCheckedAt': Date['now'](),
              'dreaminaTaskRecovering': ![]
            };
          },
          'cancelledBuilder': _0x106331 => ({
            'isGenerating': ![],
            'generationDuration': Date["now"]() - _0x106331["startedAt"],
            'dreaminaTaskStatus': "cancelled",
            'dreaminaTaskPhase': 'cancelled',
            'dreaminaTaskLabel': sourceImageText("status.cancelled"),
            'dreaminaTaskStartedAt': _0x106331['startedAt'],
            'dreaminaTaskLastCheckedAt': Date["now"](),
            'dreaminaTaskRecovering': ![]
          }),
          'parseError': _0x2c18ba => _0x2c18ba instanceof Error ? _0x2c18ba["message"] : String(_0x2c18ba || sourceImageText('recovery.taskFailed'))
        }, {
          'store': a515_0x57b49f,
          'startedAt': _0x4a5b43,
          'abortController': _0x28e98b
        });
        (_0x424ec0["status"] === "success" || _0x424ec0["status"] === "pending" || _0x424ec0['status'] === "failed" && this['_isDreaminaPollTimeoutError'](_0x424ec0["error"])) && window['_triggerLocalCacheSave']?.();
      } catch (_0x28ad19) {
        if (_0x28e98b["signal"]['aborted'] || String(_0x28ad19?.["message"] || '') === 'CANCELLED' || _0x28ad19?.["name"] === "AbortError") {
          return;
        }
      } finally {
        this["_dreaminaResumeAbortController"] === _0x28e98b && (this["_dreaminaResumeAbortController"] = null);
        this["_dreaminaResumeSubmitId"] === _0x41f222 && (this['_dreaminaResumeSubmitId'] = '');
        this["_dreaminaResumePromise"] = null;
      }
    })();
    this["_dreaminaResumePromise"] = _0x4d6cb4;
  }
  ["_maybeResumeAsyncTask"](_0x535a16 = null) {
    const _0x33873d = _0x535a16 || (typeof a515_0x57b49f['getStateRaw'] === "function" ? a515_0x57b49f["getStateRaw"]()?.["nodes"]?.[this['id']] : a515_0x57b49f["getState"]()["nodes"]?.[this['id']]) || this["_data"];
    if (!this["_isAsyncRecoverableTask"](_0x33873d)) {
      this["_stopAsyncRecovery"](!![]);
      return;
    }
    const _0x177be5 = String(_0x33873d?.['asyncTaskId'] || '')["trim"]();
    if (!_0x177be5) {
      return;
    }
    if (this["_asyncResumePromise"] && this['_asyncResumeTaskId'] === _0x177be5) {
      return;
    }
    const _0x5a827c = Number(_0x33873d?.["asyncTaskStartedAt"] || _0x33873d?.['generationStartTime'] || 0x0) || Date['now']();
    const _0x137ccc = this["_resolveAsyncResumePayload"](_0x33873d);
    const _0x1c86a6 = _0x137ccc["provider"] || this["_inferAsyncProvider"](_0x33873d);
    const _0x2f2496 = typeof this['_resumeAsyncTaskPoller'] === "function" ? this["_resumeAsyncTaskPoller"] : resumeAsyncImageTask;
    const _0x1239e9 = new AbortController();
    this["_asyncResumeAbortController"] = _0x1239e9;
    this['_asyncResumeTaskId'] = _0x177be5;
    const _0x163d28 = (async () => {
      try {
        const _0x3f5cb5 = await resumeTask({
          'sourceNodeId': this['id'],
          'targetNodeId': this['id'],
          'trigger': 'node',
          'taskType': "image-generation",
          'provider': _0x1c86a6 || _0x137ccc["provider"] || _0x33873d?.["provider"] || '',
          'adapterType': "modelApi",
          'modelId': _0x137ccc['model'] || _0x33873d?.["model"] || '',
          'executionId': (_0x1c86a6 || _0x137ccc["provider"] || "model") + ".source-image.async",
          'payload': _0x137ccc,
          'taskId': _0x177be5,
          'async': !![],
          'cancellable': ![],
          'resumable': !![],
          'startBuilder': () => ({
            'asyncTaskProvider': _0x1c86a6,
            'asyncTaskKind': "image",
            'asyncTaskStatus': String(_0x33873d?.["asyncTaskStatus"] || '')["trim"]()["toLowerCase"]() === "pending" ? "pending" : 'running'
          }),
          'poll': async () => _0x2f2496(_0x177be5, _0x137ccc, {
            'signal': _0x1239e9["signal"]
          }),
          'resultBuilder': async _0x30d0b8 => {
            const _0x2b1eff = a515_0x57b49f["getState"]()['nodes']?.[this['id']] || {};
            const _0xb032da = String(_0x2b1eff?.["name"] || sourceImageText("result.defaultName"))["replace"](/\s*\(处理中\)\s*$/, '')["replace"](/\s*\(恢复中\)\s*$/, '')["trim"]();
            return {
              ...this["_buildRecoveredImageResultPatch"](_0x30d0b8, sourceImageText('recovery.asyncImageTaskFailed')),
              'name': _0xb032da || sourceImageText('result.defaultName'),
              'generationDuration': this["_computeGenerationDuration"](_0x2b1eff)
            };
          },
          'failureBuilder': (_0x4f4b66, _0x1c546f) => {
            const _0x32501e = _0x4f4b66 instanceof Error ? _0x4f4b66["message"] : String(_0x4f4b66 || sourceImageText("recovery.taskFailed"));
            const _0x3dac0d = a515_0x57b49f["getState"]()["nodes"]?.[this['id']] || {};
            return buildSourceImageRecoveryFailurePatch(_0x3dac0d, {
              'error': _0x32501e,
              'startedAt': _0x1c546f["startedAt"],
              'duration': this["_computeGenerationDuration"](_0x3dac0d)
            });
          },
          'parseError': _0x15f449 => _0x15f449 instanceof Error ? _0x15f449["message"] : String(_0x15f449 || sourceImageText('recovery.taskFailed'))
        }, {
          'store': a515_0x57b49f,
          'startedAt': _0x5a827c,
          'abortController': _0x1239e9
        });
        _0x3f5cb5["status"] === 'success' && window["_triggerLocalCacheSave"]?.();
      } catch (_0x1bde49) {
        if (_0x1239e9["signal"]["aborted"] || String(_0x1bde49?.['message'] || '') === "CANCELLED" || _0x1bde49?.['name'] === "AbortError") {
          return;
        }
        const _0x1c96cd = _0x1bde49 instanceof Error ? _0x1bde49["message"] : String(_0x1bde49 || sourceImageText("recovery.taskFailed"));
        const _0x2132e2 = a515_0x57b49f["getState"]()["nodes"]?.[this['id']];
        if (!_0x2132e2) {
          return;
        }
        a515_0x57b49f['updateNodeData'](this['id'], {
          ...buildSourceImageRecoveryFailurePatch(_0x2132e2, {
            'error': _0x1c96cd,
            'startedAt': _0x5a827c,
            'duration': this["_computeGenerationDuration"](_0x2132e2)
          }),
          'isGenerating': ![],
          'asyncTaskStatus': "failed",
          'asyncTaskRecovering': ![]
        });
      } finally {
        this["_asyncResumeAbortController"] === _0x1239e9 && (this['_asyncResumeAbortController'] = null);
        this['_asyncResumeTaskId'] === _0x177be5 && (this["_asyncResumeTaskId"] = '');
        this["_asyncResumePromise"] = null;
      }
    })();
    this["_asyncResumePromise"] = _0x163d28;
  }
  ['_syncJobUI'](_0x4f14db) {
    if (!this["_jobUI"]) {
      return;
    }
    _0x4f14db = _0x4f14db || null;
    if (_0x4f14db === 'running') {
      if (this["_getCapturePreviewUrl"](this["_data"])) {
        stopLoading(this["_jobUI"]);
        this["_jobUI"]["style"]["display"] = 'none';
        this["_jobUI"]["replaceChildren"]();
        if (this["_hint"]) {
          this["_hint"]["style"]["display"] = "none";
        }
        if (this['_uploadBtn']) {
          this["_uploadBtn"]["disabled"] = !![];
        }
        return;
      }
      this['_jobUI']['style']['display'] = 'flex';
      this["_jobUI"]["replaceChildren"]();
      startLoading(this['_jobUI'], {
        'variant': "full"
      });
      if (this["_hint"]) {
        this["_hint"]["style"]["display"] = "none";
      }
      if (this["_uploadBtn"]) {
        this['_uploadBtn']["disabled"] = !![];
      }
    } else {
      if (_0x4f14db === "error") {
        this['_jobUI']['style']["display"] = "flex";
        this["_jobUI"]["replaceChildren"]();
        stopLoading(this["_jobUI"]);
        const _0x4039b8 = document["createElement"]('div');
        _0x4039b8["style"]["color"] = 'var(--text-danger)';
        _0x4039b8["style"]["fontSize"] = "13px";
        _0x4039b8['style']["textAlign"] = "center";
        _0x4039b8["style"]['padding'] = "20px";
        _0x4039b8["style"]["maxWidth"] = "90%";
        _0x4039b8["style"]["wordBreak"] = "break-word";
        _0x4039b8['textContent'] = getTaskMessage(this['_data']) || sourceImageText("status.generationFailed");
        this['_jobUI']["appendChild"](_0x4039b8);
        if (this["_hint"]) {
          this["_hint"]["style"]["display"] = "block";
        }
        if (this["_uploadBtn"]) {
          this["_uploadBtn"]["disabled"] = ![];
        }
      } else {
        this["_jobUI"]["style"]["display"] !== 'none' && (this["_jobUI"]['style']["opacity"] = '0', this['_jobUI']["style"]["transition"] = "opacity 0.4s ease", setTimeout(() => {
          this["_jobUI"]["style"]["display"] = 'none';
          this['_jobUI']["style"]["opacity"] = '1';
          this["_jobUI"]['style']["transition"] = '';
          stopLoading(this["_jobUI"]);
        }, 0x190));
        if (this['_hint']) {
          this['_hint']["style"]["display"] = 'block';
        }
        if (this['_uploadBtn']) {
          this["_uploadBtn"]['disabled'] = ![];
        }
      }
    }
  }
  ['update'](_0x1483cb) {
    if (!this["_img"]) {
      return;
    }
    const _0x57f216 = this["_currentJobStatus"];
    this['_data'] = _0x1483cb;
    this["_currentJobStatus"] = _0x1483cb['jobStatus'] || null;
    const _0x22355e = this["_getImageDisplayLod"](_0x1483cb)["url"] || this["_getCapturePreviewUrl"](_0x1483cb);
    this["_currentJobStatus"] !== _0x57f216 && this["_syncJobUI"](this['_currentJobStatus']);
    const _0x13647f = shouldShowGenerationResultLoadingUi(_0x1483cb, {
      'hasResult': !!_0x22355e
    }) && !this["_currentJobStatus"];
    if (_0x13647f) {
      startLoading(this['_card'], {
        'variant': "static"
      });
      if (this['_hint']) {
        this["_hint"]["style"]["display"] = "none";
      }
      if (this["_uploadBtn"]) {
        this["_uploadBtn"]['disabled'] = !![];
      }
    } else {
      if (isTaskTerminal(_0x1483cb)) {
        stopLoading(this["_card"]);
        if (this["_uploadBtn"]) {
          this["_uploadBtn"]["disabled"] = ![];
        }
      } else {
        if (!this["_currentJobStatus"]) {
          !this["_isUploading"] && _0x22355e === this["_currentSrc"] && stopLoading(this["_card"]);
          if (this["_uploadBtn"]) {
            this["_uploadBtn"]['disabled'] = ![];
          }
        }
      }
    }
    void this["_refreshImageDisplay"]();
    this["_applyMaskPreview"](_0x1483cb["maskPreviewUrl"] || _0x1483cb["maskPreview"]);
    this["_maybeResumePersistedTasks"](_0x1483cb);
  }
  ["unmount"]() {
    this["_unsubscribeLocale"]?.();
    this["_unsubscribeLocale"] = null;
    this["_idleImageRefreshCancel"] && (this["_idleImageRefreshCancel"](), this["_idleImageRefreshCancel"] = null);
    this["_lowZoomHoverRefreshTimer"] && (clearTimeout(this['_lowZoomHoverRefreshTimer']), this["_lowZoomHoverRefreshTimer"] = null);
    setNodeMediaLodHoverPromoted(this['el'], ![]);
    clearCanvasImageDisplayHandoff(this['_img']);
    this["_releaseActiveCapturePreviewUrl"]();
    this["_flushRetiredCapturePreviewUrls"]({
      'force': !![]
    });
    this['_stopRunningHubRecovery'](![]);
    this['_stopDreaminaRecovery'](![]);
    this["_stopAsyncRecovery"](![]);
  }
}