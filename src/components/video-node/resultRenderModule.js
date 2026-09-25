import { attachVideoPlaybackRecovery, detachVideoPlaybackRecovery, getVideoCurrentSource, logVideoPlaybackEvent, playVideoWithRecovery } from './mediaPlaybackRecovery.js';
import { localPathToUrl, urlToLocalPath } from '../../utils/localMediaPath.js';
import { attachMediaElementPlaybackSource, clearDesktopMediaPlaybackSourceMetadata, isMediaElementPlaybackSource } from '../../services/desktopMediaBlobSource.js';
import { getModelManifest } from '../../manifests/index.js';
import { desktopBridge } from '../../services/desktopBridge.js';
import { getTaskMessage, isTaskCancelled, isTaskFailed } from '../../core/generationTaskUiState.js';
import { buildRhAiAppResultDisplayPatch, isRunningHubAiAppManifest } from '../shared/rhAiAppNodeBehavior.js';
import { t } from '../../i18n/index.js';
import { readViewportInteractionState } from '../../core/viewportInteractionState.js';
import { acquireLocalVideoPlaybackObjectUrl, releaseLocalVideoPlaybackObjectUrlOwner, releaseLocalVideoPlaybackObjectUrlOwnerScope } from '../../services/localVideoPlaybackObjectUrlService.js';
import { resolveCanvasVideoDisplayUrl } from '../../services/canvasMediaLocalService.js';
import { createTrackedMediaObjectUrl, revokeTrackedMediaObjectUrl } from '../../services/mediaObjectUrlRegistry.js';
import { getVideoPresentationSource, hasPresentedVideoFrame, resetVideoFramePresentation, watchVideoFramePresentation } from '../../services/videoFramePresentation.js';
import { createVideoGenerationErrorCard } from './videoGenerationErrorCard.js';
import { isSegmentRetakeEditing } from '../../modules/videoRetake/segmentRetakeModelPolicy.js';
function videoResultRenderText(_0x47b743, _0x1f0d58 = {}) {
  return t("videoResultRender." + _0x47b743, _0x1f0d58);
}
function isChromeShellRuntime() {
  const _0x1d8f3e = String(globalThis["location"]?.["search"] || globalThis["window"]?.["location"]?.["search"] || '');
  return new URLSearchParams(_0x1d8f3e)['get']('aicRuntime') === "chrome-shell";
}
function shouldUseSharedLocalVideoBlob() {
  if (isChromeShellRuntime()) {
    return !![];
  }
  return !desktopBridge['mediaPreview']['isAvailable']();
}
function isVideoResultViewportBusy() {
  return readViewportInteractionState()["isViewportBusy"];
}
function isLikelyPosterImageUrl(_0x3a1c42) {
  const _0x40c7fa = String(_0x3a1c42 || '')["trim"]();
  if (!_0x40c7fa) {
    return ![];
  }
  if (/^(data:image\/|blob:|aic-local-preview:)/i["test"](_0x40c7fa)) {
    return !![];
  }
  return /\.(?:png|jpe?g|webp|gif|avif|bmp)(?:[?#].*)?$/i["test"](_0x40c7fa);
}
function setVideoResultElementVisible(_0x4ca7bb, _0x1a483e) {
  if (!_0x4ca7bb) {
    return;
  }
  const _0x402606 = _0x1a483e !== !![];
  _0x4ca7bb["hidden"] = _0x402606;
  if (_0x402606) {
    _0x4ca7bb["classList"]?.["add"]?.("is-hidden");
  } else {
    _0x4ca7bb["classList"]?.["contains"]?.('is-hidden') && _0x4ca7bb["classList"]?.["remove"]?.("is-hidden");
  }
}
function isVideoResultElementVisible(_0x47e369) {
  return !!_0x47e369 && _0x47e369['hidden'] !== !![];
}
function isVideoResultFrameReady(_0x563444, _0x58bc95 = '') {
  if (!_0x563444) {
    return ![];
  }
  return hasPresentedVideoFrame(_0x563444, _0x58bc95);
}
function setVideoResultLayerActive(_0x4e412f, _0x27afa3, _0x160015) {
  if (!_0x4e412f) {
    return;
  }
  setVideoResultElementVisible(_0x4e412f, _0x27afa3);
  _0x4e412f["classList"]?.['toggle']?.("is-main-result", _0x27afa3 === !![]);
  Number["isFinite"](Number(_0x160015)) && (_0x4e412f["style"]["zIndex"] = String(_0x160015));
}
function applyVideoResultGeometryAnimationStyle(_0x324bab, _0x4ce6f5) {
  if (!_0x324bab || !_0x4ce6f5 || typeof _0x4ce6f5 !== "object") {
    return;
  }
  Object['assign'](_0x324bab["style"], _0x4ce6f5);
}
function getVideoResultMediaKey(_0x5af8ec = {}, _0x2412d6 = {}) {
  return [_0x5af8ec['displayLocalPath'], _0x5af8ec["localPath"], _0x5af8ec["videoUrl"], _0x5af8ec["url"], _0x5af8ec["src"], _0x5af8ec['thumbUrl'], _0x5af8ec["thumbId"], _0x2412d6?.["localPath"], _0x2412d6?.["videoUrl"], _0x2412d6?.["src"], _0x2412d6?.["thumbUrl"]]["map"](_0x626090 => String(_0x626090 || '')['trim']())["find"](Boolean) || '';
}
const SELECTED_VIDEO_PRESENTATION_FIELDS = ["videoUrl", "localPath", "displayLocalPath", "videoLocalPath", "thumbId", "thumbUrl", "posterUrl", 'thumbnailUrl', 'previewUrl', "coverUrl", "posterLocalPath", "thumbLocalPath", 'thumbnailLocalPath', "previewLocalPath", "capturePreviewUrl", 'capturePreviewLocalPath', 'videoThumbSrc', "videoThumbUnavailableSource", "mediaUnavailableSource"];
export function buildSelectedVideoResultPresentationPatch(_0x598c3d = [], _0x39f64b = 0x0) {
  const _0x357d95 = Array['isArray'](_0x598c3d) ? _0x598c3d : [];
  const _0x1643d2 = Math["max"](0x0, Math["min"](_0x357d95["length"] - 0x1, Math['trunc'](Number(_0x39f64b) || 0x0)));
  const _0x4d15c8 = _0x357d95[_0x1643d2] && typeof _0x357d95[_0x1643d2] === "object" ? _0x357d95[_0x1643d2] : {};
  const _0x362a57 = {
    'mainVideoIndex': _0x1643d2,
    'isVideosExpanded': ![],
    'mediaUnavailable': _0x4d15c8["mediaUnavailable"] === !![]
  };
  for (const _0x2e4987 of SELECTED_VIDEO_PRESENTATION_FIELDS) {
    _0x362a57[_0x2e4987] = _0x4d15c8[_0x2e4987] ?? '';
  }
  return _0x362a57;
}
export function createVideoNodeResultRenderModule(_0x58c5e9) {
  const {
    store: _0x5d8529,
    api: _0x1e6ccf,
    getImage: _0x1e73af,
    ensureThumbDecoded: _0x16622f,
    buildApiUrl: _0x175aaf,
    VideoKeyingController: _0x538149
  } = _0x58c5e9;
  class _0x1f8e5a {
    ["_buildRhAiAppVideoResultDisplayPatch"](_0x2d0a4e = {}, _0xaa7458 = 0x0, _0x39db8f = 0x0, _0x45f9ab = '') {
      if (!isRunningHubAiAppManifest(getModelManifest(_0x2d0a4e?.["model"]))) {
        return {};
      }
      return buildRhAiAppResultDisplayPatch({
        'nodeData': _0x2d0a4e,
        'mediaWidth': _0xaa7458,
        'mediaHeight': _0x39db8f,
        'mediaKey': _0x45f9ab
      });
    }
    ["_getPreviewVideoRecoveryLabel"](_0x7a9b9, _0xf683a9 = "preview") {
      const _0x29470a = String(_0x7a9b9?.["dataset"]?.["idx"] ?? '');
      const _0x5586af = _0x29470a ? _0xf683a9 + ':' + _0x29470a : _0xf683a9;
      return 'ai-video:' + this["nodeId"] + ':' + _0x5586af;
    }
    ["_shouldRecoverPreviewPlayback"](_0x36bc7d) {
      return _0x36bc7d?.["isConnected"] !== ![] && this["_hoverManualPause"] !== !![] && (this["_isHovered"] || this['_isManualControl'] || !_0x36bc7d?.["paused"]);
    }
    ['_clearPreviewPosterForVisibleFrame'](_0x2ac39e) {
      if (isVideoResultFrameReady(_0x2ac39e)) {
        this["_markPreviewPosterClearedForPlayback"](_0x2ac39e);
        return !![];
      }
      watchVideoFramePresentation(_0x2ac39e, () => {
        const _0x5e931c = (typeof _0x5d8529["getStateRaw"] === "function" ? _0x5d8529['getStateRaw']() : _0x5d8529["getState"]())["nodes"]?.[this["nodeId"]] || this["_data"] || {};
        const _0x300376 = Math["max"](0x0, Math['trunc'](Number(_0x5e931c["mainVideoIndex"]) || 0x0));
        const _0x4dbb90 = Math["max"](0x0, Math["trunc"](Number(_0x2ac39e?.["dataset"]?.["idx"]) || 0x0));
        if (_0x4dbb90 !== _0x300376 || !isVideoResultFrameReady(_0x2ac39e)) {
          return;
        }
        this['_markPreviewPosterClearedForPlayback'](_0x2ac39e);
      });
      return ![];
    }
    ["_markPreviewPosterClearedForPlayback"](_0x268834) {
      if (!_0x268834) {
        return ![];
      }
      !this['_previewPostersClearedForPlayback'] && (this["_previewPostersClearedForPlayback"] = new WeakMap());
      const _0x250bbe = getVideoPresentationSource(_0x268834);
      const _0x3fc709 = !!(_0x250bbe && this["_previewPostersClearedForPlayback"]['get'](_0x268834) === _0x250bbe);
      const _0x2f0f34 = !!this["_deferredPosterImgEl"];
      const _0x21be39 = !!String(_0x268834?.["poster"] || '')["trim"]();
      const _0x5d2272 = this['el']?.["dataset"]?.["rendererPresentationOwner"] === "fast-preview";
      if (_0x3fc709 && !_0x2f0f34 && !_0x21be39 && !_0x5d2272) {
        return ![];
      }
      this["_previewPostersClearedForPlayback"]["set"](_0x268834, _0x250bbe);
      this['_removeDeferredVideoPosterPreview']();
      globalThis["window"]?.["v2Renderer"]?.["releaseFastPreviewForPlayback"]?.(this['nodeId']);
      if (_0x21be39) {
        _0x268834["removeAttribute"]?.("poster");
        return !![];
      }
      return _0x2f0f34 || _0x5d2272;
    }
    ["_isPreviewPosterClearedForPlayback"](_0x57f403) {
      const _0xa381a1 = getVideoPresentationSource(_0x57f403);
      return !!(_0xa381a1 && this["_previewPostersClearedForPlayback"]?.["get"]?.(_0x57f403) === _0xa381a1);
    }
    ["_attachPreviewVideoRecovery"](_0x1b8bf0, _0x13dce1 = 'preview') {
      if (!_0x1b8bf0) {
        return null;
      }
      const _0x56baf7 = _0x13dce1 === 'hover' || _0x13dce1 === 'fullscreen';
      return attachVideoPlaybackRecovery(_0x1b8bf0, {
        'label': this['_getPreviewVideoRecoveryLabel'](_0x1b8bf0, _0x13dce1),
        'ensureSrc': () => this["_ensureVideoSrcFor"](_0x1b8bf0, {
          'forPlayback': !![],
          'preload': _0x13dce1 === "hover" ? "metadata" : "auto"
        }),
        'minBufferAhead': _0x56baf7 ? 0.5 : undefined,
        'readyTimeoutMs': _0x56baf7 ? 0x15e : undefined,
        'recoveryDebounceMs': _0x56baf7 ? 0x96 : undefined,
        'recoveryCooldownMs': _0x56baf7 ? 0x1f4 : undefined,
        'shouldRecover': () => this['_shouldRecoverPreviewPlayback'](_0x1b8bf0)
      });
    }
    ["_detachPreviewVideoRecovery"](_0x238826) {
      return detachVideoPlaybackRecovery(_0x238826);
    }
    ["_logPreviewVideoPlaybackEvent"](_0x2340e2, _0x1085c3, _0x2f5d7c = 'preview') {
      if (!_0x2340e2) {
        return;
      }
      this["_attachPreviewVideoRecovery"](_0x2340e2, _0x2f5d7c);
      logVideoPlaybackEvent(_0x2340e2, _0x1085c3, {
        'label': this["_getPreviewVideoRecoveryLabel"](_0x2340e2, _0x2f5d7c)
      });
    }
    async ['_playPreviewVideoWithRecovery'](_0x5a285a, _0x2b9316 = {}) {
      if (!_0x5a285a) {
        return ![];
      }
      const _0x21bfb0 = _0x2b9316["reason"] || "preview";
      this['_attachPreviewVideoRecovery'](_0x5a285a, _0x21bfb0);
      return playVideoWithRecovery(_0x5a285a, {
        'label': this["_getPreviewVideoRecoveryLabel"](_0x5a285a, _0x21bfb0),
        'playbackIntent': _0x21bfb0,
        'ensureSrc': () => this['_ensureVideoSrcFor'](_0x5a285a, {
          'forPlayback': !![],
          'preload': _0x21bfb0 === "hover" ? 'metadata' : "auto"
        }),
        'minBufferAhead': _0x21bfb0 === "hover" ? 0.5 : undefined,
        'readyTimeoutMs': _0x21bfb0 === "hover" ? 0x15e : undefined,
        'recoveryDebounceMs': _0x21bfb0 === 'hover' ? 0x96 : undefined,
        'recoveryCooldownMs': _0x21bfb0 === "hover" ? 0x1f4 : undefined,
        'shouldRecover': () => this["_shouldRecoverPreviewPlayback"](_0x5a285a),
        'shouldContinue': typeof _0x2b9316['shouldContinue'] === "function" ? _0x2b9316["shouldContinue"] : undefined
      });
    }
    ['_handlePreviewVideoEnded'](_0x80ec69) {
      if (!_0x80ec69) {
        return ![];
      }
      const _0x46aa19 = _0x5d8529["getState"]()['nodes']?.[this["nodeId"]] || this['_data'] || {};
      const _0x4198dd = Math["max"](0x0, Math['trunc'](Number(_0x46aa19['mainVideoIndex']) || 0x0));
      const _0x5773d5 = Math["max"](0x0, Math['trunc'](Number(_0x80ec69["dataset"]?.['idx']) || 0x0));
      if (_0x5773d5 !== _0x4198dd) {
        return ![];
      }
      const _0x451354 = this["_isHovered"] === !![] && this["_isManualControl"] !== !![] && this['_hoverManualPause'] !== !![];
      const _0x236fd3 = this["_isManualLoopPlayback"] === !![];
      const _0x5c7e0d = _0x451354 || _0x236fd3;
      if (_0x5c7e0d) {
        try {
          _0x80ec69["currentTime"] = 0x0;
        } catch {}
        _0x80ec69["loop"] = !![];
        this["_hideCenterIndicator"]?.();
        this["_autoPlayToken"] = Number(this['_autoPlayToken'] || 0x0) + 0x1;
        const _0x13703c = this["_autoPlayToken"];
        const _0x2fadbc = () => this['_autoPlayToken'] === _0x13703c && (this["_isManualLoopPlayback"] === !![] || this['_isHovered'] === !![] && this["_isManualControl"] !== !![] && this["_hoverManualPause"] !== !![]);
        if (typeof this["_playPreviewVideoWithRecovery"] === 'function') {
          void this['_playPreviewVideoWithRecovery'](_0x80ec69, {
            'reason': _0x236fd3 ? "manual" : "hover",
            'shouldContinue': _0x2fadbc
          })["catch"](() => {});
        } else {
          const _0x28482b = _0x80ec69["play"]?.();
          _0x28482b && typeof _0x28482b["catch"] === "function" && _0x28482b['catch'](() => {});
        }
      } else {
        _0x80ec69['loop'] = ![];
        _0x80ec69['pause']?.();
        this["_showPausedCenterIndicator"]?.();
      }
      this["_syncVideoControlsFromVideo"]?.(_0x80ec69);
      return !![];
    }
    async ['_ensureVideoSrcFor'](_0x57474e, _0x13b0f7 = {}) {
      if (!_0x57474e) {
        return ![];
      }
      const _0x11726f = _0x13b0f7["preload"] === 'metadata' ? "metadata" : "auto";
      const _0x5f05b6 = !!String(_0x57474e["getAttribute"]('src') || '')['trim']();
      if (_0x5f05b6) {
        _0x13b0f7["forPlayback"] === !![] && _0x57474e["preload"] !== _0x11726f && (_0x57474e["preload"] = _0x11726f);
        this['_clearPreviewPosterForVisibleFrame'](_0x57474e);
        return !![];
      }
      const _0xe39c6 = _0x5d8529['getState']();
      const _0x54d9da = _0xe39c6["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0xb8c8e5 = Array["isArray"](_0x54d9da['videos']) ? _0x54d9da["videos"] : [];
      const _0x4dd722 = Number(_0x57474e["dataset"]?.["idx"]);
      const _0x2320b8 = Number["isFinite"](_0x4dd722) ? Math["max"](0x0, Math['trunc'](_0x4dd722)) : 0x0;
      const _0x5e7b3e = _0xb8c8e5[_0x2320b8] || null;
      if (!_0x5e7b3e) {
        return ![];
      }
      const _0x2b6607 = Number(this['_videoSourceAttachToken'] || 0x0);
      !this['_videoSourceAttachTokens'] && (this["_videoSourceAttachTokens"] = new WeakMap());
      const _0x40d4f0 = Number(this["_videoSourceAttachTokens"]['get'](_0x57474e) || 0x0) + 0x1;
      this["_videoSourceAttachTokens"]['set'](_0x57474e, _0x40d4f0);
      const _0x5b660d = () => Number(this["_videoSourceAttachToken"] || 0x0) === _0x2b6607 && this['_videoSourceAttachTokens']?.["get"](_0x57474e) === _0x40d4f0;
      let _0x553644 = this["_resolveVideoPlaybackUrl"](_0x5e7b3e);
      if (!_0x553644 && _0x5e7b3e['thumbId']) {
        const _0x28d4b0 = String(_0x5e7b3e["thumbId"] || '');
        if (_0x28d4b0) {
          _0x553644 = await this["_resolveCachedVideoObjectUrl"](_0x28d4b0);
          if (!_0x5b660d() || !this['_isCachedVideoThumbIdCurrentForSlot'](_0x28d4b0, _0x2320b8)) {
            return ![];
          }
        }
      }
      if (!_0x553644) {
        return ![];
      }
      const _0x4a7d78 = await this["_resolveLocalVideoPlaybackObjectUrl"](_0x553644, 'ai-video:' + this["nodeId"] + ':slot:' + _0x2320b8);
      if (!_0x5b660d()) {
        return ![];
      }
      globalThis["window"]?.["__runtimeCompareMark"]?.("ai-video-playback:attach", {
        'nodeId': this["nodeId"],
        'slotIndex': _0x2320b8,
        'sourceUrl': _0x553644,
        'playbackUrl': _0x4a7d78
      });
      await attachMediaElementPlaybackSource(_0x57474e, _0x553644, {
        'playbackUrl': _0x4a7d78,
        'preload': _0x11726f,
        'warmRanges': ![],
        'load': _0x13b0f7["forPlayback"] === !![],
        'shouldAssign': _0x5b660d,
        'onSourceAssigned': () => {
          this["_clearPreviewPosterForVisibleFrame"](_0x57474e);
        }
      });
      this['_restorePreviewHoverPlaybackTime'](_0x57474e, _0x553644);
      this["_clearPreviewPosterForVisibleFrame"](_0x57474e);
      return _0x5b660d();
    }
    ["_resolveVideoPlaybackUrl"](_0x1a9f51) {
      if (!_0x1a9f51 || typeof _0x1a9f51 !== 'object') {
        return '';
      }
      return this["_resolveMediaUrl"](localPathToUrl(_0x1a9f51['displayLocalPath'])) || this["_resolveMediaUrl"](localPathToUrl(_0x1a9f51["localPath"])) || this["_resolveMediaUrl"](_0x1a9f51["videoUrl"]) || this["_resolveMediaUrl"](resolveCanvasVideoDisplayUrl(_0x1a9f51)) || '';
    }
    ['_resolveMediaUrl'](_0x46d8df) {
      const _0x1150b0 = String(_0x46d8df || '')["trim"]();
      if (!_0x1150b0) {
        return '';
      }
      if (_0x1150b0["startsWith"]("http://") || _0x1150b0["startsWith"]('https://') || _0x1150b0['startsWith']("blob:") || _0x1150b0["startsWith"]('data:')) {
        return _0x1150b0;
      }
      const _0xee4ae3 = localPathToUrl(_0x1150b0);
      if (_0xee4ae3) {
        return _0x175aaf(_0xee4ae3);
      }
      if (_0x1150b0["startsWith"]('/')) {
        return _0x175aaf(_0x1150b0);
      }
      return _0x175aaf('/' + _0x1150b0["replace"](/^\/+/, ''));
    }
    async ["_resolveLocalVideoPlaybackObjectUrl"](_0x3f4c15, _0x4af16f = '') {
      if (!shouldUseSharedLocalVideoBlob()) {
        return '';
      }
      const _0x598900 = String(_0x4af16f || '')['trim']() || 'ai-video:' + this["nodeId"] + ":slot:main";
      return acquireLocalVideoPlaybackObjectUrl(_0x3f4c15, _0x598900);
    }
    ["_getActiveCachedVideoThumbIds"](_0x3ecba4 = null) {
      const _0x2de8bb = _0x5d8529['getState']()?.['nodes'];
      const _0xab4776 = _0x2de8bb && typeof _0x2de8bb === "object";
      const _0xae6cb8 = _0x3ecba4 && typeof _0x3ecba4 === "object" ? _0x3ecba4 : _0xab4776 ? _0x2de8bb[this["nodeId"]] || {} : this["_data"] || {};
      const _0x3d441f = Array['isArray'](_0xae6cb8["videos"]) ? _0xae6cb8['videos'] : [];
      const _0x4b4246 = _0x3d441f["length"] > 0x0 ? _0x3d441f : [_0xae6cb8];
      const _0x112f03 = new Set();
      for (const _0x3048a7 of _0x4b4246) {
        const _0x4d296f = String(_0x3048a7?.["thumbId"] || '')['trim']();
        if (!_0x4d296f || String(_0x3048a7?.["error"] || '')["trim"]() || this['_isVideoMarkedUnavailable'](_0x3048a7) || this['_resolveVideoPlaybackUrl'](_0x3048a7)) {
          continue;
        }
        _0x112f03['add'](_0x4d296f);
      }
      return _0x112f03;
    }
    ["_isCachedVideoThumbIdCurrent"](_0x17d171) {
      const _0x467365 = String(_0x17d171 || '')["trim"]();
      if (!_0x467365 || this["_videoObjectUrlsDisposed"] === !![]) {
        return ![];
      }
      const _0x5a2481 = _0x5d8529["getState"]()?.["nodes"];
      const _0x532d21 = _0x5a2481 && typeof _0x5a2481 === 'object' ? _0x5a2481[this['nodeId']] : this["_data"];
      if (!_0x532d21) {
        return ![];
      }
      return this["_getActiveCachedVideoThumbIds"](_0x532d21)["has"](_0x467365);
    }
    ["_isCachedVideoThumbIdCurrentForSlot"](_0x571f97, _0x1027ae) {
      const _0xced274 = String(_0x571f97 || '')["trim"]();
      if (!_0xced274 || this["_videoObjectUrlsDisposed"] === !![]) {
        return ![];
      }
      const _0x335f1f = _0x5d8529["getState"]()?.["nodes"];
      const _0xc86231 = _0x335f1f && typeof _0x335f1f === 'object' ? _0x335f1f[this["nodeId"]] : this["_data"];
      if (!_0xc86231) {
        return ![];
      }
      const _0x223196 = Array["isArray"](_0xc86231['videos']) ? _0xc86231['videos'] : [];
      const _0x2b09c9 = Math["max"](0x0, Math['trunc'](Number(_0x1027ae) || 0x0));
      const _0xd0b16c = _0x223196["length"] > 0x0 ? _0x223196[_0x2b09c9] || null : _0x2b09c9 === 0x0 ? _0xc86231 : null;
      return Boolean(_0xd0b16c && String(_0xd0b16c['thumbId'] || '')['trim']() === _0xced274 && !String(_0xd0b16c['error'] || '')["trim"]() && !this["_isVideoMarkedUnavailable"](_0xd0b16c) && !this["_resolveVideoPlaybackUrl"](_0xd0b16c));
    }
    ["_getCachedVideoObjectUrlConsumers"]() {
      const _0x341ca5 = new Set();
      const _0x47d584 = _0x2871fa => {
        if (_0x2871fa) {
          _0x341ca5['add'](_0x2871fa);
        }
      };
      _0x47d584(this["videoEl"]);
      _0x47d584(this["_activeFullscreenVideoEl"]);
      for (const _0x2357dd of this["_multiLayerEls"] || []) {
        _0x47d584(_0x2357dd);
      }
      for (const _0x4887e8 of this["previewEl"]?.["querySelectorAll"]?.("video") || []) {
        _0x47d584(_0x4887e8);
      }
      for (const _0x266e60 of this['_expandPanel']?.["querySelectorAll"]?.("video") || []) {
        _0x47d584(_0x266e60);
      }
      return _0x341ca5;
    }
    ["_isCachedVideoObjectUrlReferenced"](_0x27b2e9, _0x34aea6) {
      const _0x26d128 = String(_0x34aea6 || '')["trim"]();
      if (!_0x27b2e9 || !_0x26d128) {
        return ![];
      }
      return [_0x27b2e9["getAttribute"]?.("src"), _0x27b2e9["currentSrc"], _0x27b2e9["src"], _0x27b2e9["dataset"]?.["desktopMediaSourceUrl"]]["some"](_0x4e419b => String(_0x4e419b || '')["trim"]() === _0x26d128);
    }
    ["_detachCachedVideoObjectUrlConsumers"](_0x420cdf) {
      const _0x26a9c4 = [...this['_getCachedVideoObjectUrlConsumers']()]['filter'](_0x2663f2 => this["_isCachedVideoObjectUrlReferenced"](_0x2663f2, _0x420cdf));
      this["_activeFullscreenVideoEl"] && _0x26a9c4["includes"](this["_activeFullscreenVideoEl"]) && this["_activeFullscreenCleanup"]?.();
      for (const _0x116b76 of _0x26a9c4) {
        const _0x41fdc6 = Math["max"](0x0, Math["trunc"](Number(_0x116b76?.["dataset"]?.["idx"]) || 0x0));
        resetVideoFramePresentation(_0x116b76);
        try {
          _0x116b76["pause"]?.();
        } catch {}
        clearDesktopMediaPlaybackSourceMetadata(_0x116b76);
        _0x116b76["removeAttribute"]?.('src');
        try {
          _0x116b76["load"]?.();
        } catch {}
        releaseLocalVideoPlaybackObjectUrlOwner("ai-video:" + this['nodeId'] + ":slot:" + _0x41fdc6);
      }
      return _0x26a9c4["length"];
    }
    ["_releaseCachedVideoObjectUrl"](_0x218c70, _0x54f247) {
      const _0x2c0dd6 = String(_0x218c70 || '')['trim']();
      const _0x19d0f8 = String(_0x54f247 || '')['trim']();
      if (_0x2c0dd6) {
        this["_cachedVideoUrls"]?.["delete"]?.(_0x2c0dd6);
      }
      if (!_0x19d0f8) {
        return ![];
      }
      this['_detachCachedVideoObjectUrlConsumers'](_0x19d0f8);
      return revokeTrackedMediaObjectUrl(_0x19d0f8);
    }
    ["_syncCachedVideoObjectUrls"](_0x2c95bc = null) {
      !(this["_cachedVideoUrls"] instanceof Map) && (this["_cachedVideoUrls"] = new Map());
      const _0x4aee89 = this["_getActiveCachedVideoThumbIds"](_0x2c95bc);
      let _0x1d9028 = 0x0;
      for (const [_0x556050, _0xfdaaa] of [...this["_cachedVideoUrls"]["entries"]()]) {
        if (_0x4aee89['has'](_0x556050)) {
          continue;
        }
        _0x1d9028 += this["_releaseCachedVideoObjectUrl"](_0x556050, _0xfdaaa) ? 0x1 : 0x0;
      }
      return _0x1d9028;
    }
    ["_releaseAllCachedVideoObjectUrls"]({
      invalidatePending = ![]
    } = {}) {
      invalidatePending && (this['_videoObjectUrlLifecycleEpoch'] = Number(this['_videoObjectUrlLifecycleEpoch'] || 0x0) + 0x1, this["_cachedVideoUrlLoads"]?.["clear"]?.());
      let _0x3766fb = 0x0;
      for (const [_0x395076, _0x5c93cb] of [...(this["_cachedVideoUrls"]?.["entries"]?.() || [])]) {
        _0x3766fb += this["_releaseCachedVideoObjectUrl"](_0x395076, _0x5c93cb) ? 0x1 : 0x0;
      }
      this["_cachedVideoUrls"]?.["clear"]?.();
      return _0x3766fb;
    }
    async ['_resolveCachedVideoObjectUrl'](_0x10d9f7) {
      const _0x669cd3 = String(_0x10d9f7 || '')["trim"]();
      if (!_0x669cd3 || !this["_isCachedVideoThumbIdCurrent"](_0x669cd3)) {
        return '';
      }
      !(this["_cachedVideoUrls"] instanceof Map) && (this["_cachedVideoUrls"] = new Map());
      const _0x378932 = String(this['_cachedVideoUrls']["get"](_0x669cd3) || '')["trim"]();
      if (_0x378932) {
        return _0x378932;
      }
      !(this['_cachedVideoUrlLoads'] instanceof Map) && (this["_cachedVideoUrlLoads"] = new Map());
      const _0x817737 = this["_cachedVideoUrlLoads"]["get"](_0x669cd3);
      if (_0x817737) {
        return _0x817737;
      }
      const _0x42badd = Number(this["_videoObjectUrlLifecycleEpoch"] || 0x0);
      const _0x449ae6 = Promise["resolve"]()['then'](() => _0x1e73af(_0x669cd3))["then"](_0x775e6c => {
        if (!_0x775e6c || this['_videoObjectUrlsDisposed'] === !![] || Number(this["_videoObjectUrlLifecycleEpoch"] || 0x0) !== _0x42badd || !this['_isCachedVideoThumbIdCurrent'](_0x669cd3)) {
          return '';
        }
        const _0x1c03d8 = String(this["_cachedVideoUrls"]["get"](_0x669cd3) || '')["trim"]();
        if (_0x1c03d8) {
          return _0x1c03d8;
        }
        const _0x3e2415 = createTrackedMediaObjectUrl(_0x775e6c, {
          'kind': "video",
          'ownerId': "ai-video:" + this["nodeId"] + ":result-cache",
          'sourceUrl': _0x669cd3
        });
        if (!_0x3e2415) {
          return '';
        }
        if (this["_videoObjectUrlsDisposed"] === !![] || Number(this["_videoObjectUrlLifecycleEpoch"] || 0x0) !== _0x42badd || !this["_isCachedVideoThumbIdCurrent"](_0x669cd3) || this['_cachedVideoUrls']["has"](_0x669cd3)) {
          revokeTrackedMediaObjectUrl(_0x3e2415);
          return String(this["_cachedVideoUrls"]['get'](_0x669cd3) || '')["trim"]();
        }
        this["_cachedVideoUrls"]["set"](_0x669cd3, _0x3e2415);
        return _0x3e2415;
      })["catch"](() => '')["finally"](() => {
        this['_cachedVideoUrlLoads']["get"](_0x669cd3) === _0x449ae6 && this["_cachedVideoUrlLoads"]["delete"](_0x669cd3);
      });
      this["_cachedVideoUrlLoads"]["set"](_0x669cd3, _0x449ae6);
      return _0x449ae6;
    }
    ["_disposeCachedVideoObjectUrls"]() {
      this["_videoObjectUrlsDisposed"] = !![];
      return this["_releaseAllCachedVideoObjectUrls"]({
        'invalidatePending': !![]
      });
    }
    ['_releaseLocalVideoPlaybackObjectUrl']() {
      this['_localPlaybackBlobToken'] = Number(this["_localPlaybackBlobToken"] || 0x0) + 0x1;
      this['_localPlaybackBlobFetchController']?.['abort']?.();
      this["_localPlaybackBlobFetchController"] = null;
      this['_localPlaybackBlobPromise'] = null;
      this["_localPlaybackBlobPromiseSource"] = '';
      const _0x52f9c1 = String(this["_localPlaybackObjectUrl"] || '')['trim']();
      this["_localPlaybackObjectUrl"] = '';
      this["_localPlaybackObjectSource"] = '';
      const _0x20f3ea = releaseLocalVideoPlaybackObjectUrlOwnerScope("ai-video:" + this["nodeId"]) > 0x0;
      if (_0x52f9c1) {
        revokeTrackedMediaObjectUrl(_0x52f9c1);
      }
      return _0x20f3ea || !!_0x52f9c1;
    }
    ["_restorePreviewHoverPlaybackTime"](_0x582cc3, _0x59e46b) {
      const _0x245830 = this["_hoverPlaybackResumeState"];
      const _0x36ec62 = String(_0x59e46b || '')["trim"]();
      if (!_0x245830 || !_0x582cc3 || !_0x36ec62 || _0x245830['source'] !== _0x36ec62) {
        return ![];
      }
      const _0x8ea2eb = () => {
        if (this['_hoverPlaybackResumeState'] !== _0x245830 || !isMediaElementPlaybackSource(_0x582cc3, _0x36ec62)) {
          return ![];
        }
        const _0x6c1b42 = Number(_0x582cc3["duration"] || 0x0);
        if (!Number['isFinite'](_0x6c1b42) || _0x6c1b42 <= 0x0) {
          return ![];
        }
        const _0x4cb0b2 = Math["min"](Math["max"](0x0, Number(_0x245830["time"] || 0x0)), Math["max"](0x0, _0x6c1b42 - 0.05));
        try {
          _0x582cc3["currentTime"] = _0x4cb0b2;
        } catch {
          return ![];
        }
        this["_hoverPlaybackResumeState"] = null;
        return !![];
      };
      if (_0x8ea2eb()) {
        return !![];
      }
      const _0x2aa709 = () => {
        if (!_0x8ea2eb()) {
          return;
        }
        _0x582cc3["removeEventListener"]?.("loadedmetadata", _0x2aa709);
        _0x582cc3["removeEventListener"]?.('canplay', _0x2aa709);
      };
      _0x582cc3["addEventListener"]?.("loadedmetadata", _0x2aa709);
      _0x582cc3["addEventListener"]?.("canplay", _0x2aa709);
      return !![];
    }
    ["_restoreIdlePreviewPoster"](_0x34ae89) {
      if (!_0x34ae89) {
        return ![];
      }
      const _0x372054 = this['_resolveDeferredVideoPosterUrl']();
      _0x372054 ? (_0x34ae89["poster"] = _0x372054, setVideoResultElementVisible(this["_placeholderEl"], ![])) : (_0x34ae89["removeAttribute"]?.("poster"), setVideoResultElementVisible(this["_placeholderEl"], !![]));
      this["_removeDeferredVideoPosterPreview"]();
      this["_setVideoOverlaysVisible"]?.(![]);
      return !!_0x372054;
    }
    ["_releaseIdlePreviewHoverPlaybackMedia"]() {
      const _0x38f6ec = this["_getActivePreviewVideoEl"]?.();
      if (!_0x38f6ec || this['_isHovered'] === !![] || this["_isManualControl"] === !![] || this["_isManualLoopPlayback"] === !![] || this['_isProgressSeeking'] === !![] || this["_isProgressDragging"] === !![] || _0x38f6ec["paused"] === ![]) {
        return ![];
      }
      const _0xb675d8 = this["_data"] || {};
      const _0x4e6fc5 = Array["isArray"](_0xb675d8["videos"]) ? _0xb675d8["videos"] : [];
      const _0x148a77 = Math["max"](0x0, Math["min"](Math["max"](0x0, _0x4e6fc5["length"] - 0x1), Math['trunc'](Number(_0xb675d8["mainVideoIndex"]) || 0x0)));
      const _0x53cd04 = this["_resolveVideoPlaybackUrl"](_0x4e6fc5[_0x148a77] || _0x4e6fc5[0x0]);
      const _0x59f597 = Number(_0x38f6ec["currentTime"] || 0x0);
      this["_hoverPlaybackResumeState"] = _0x53cd04 && Number['isFinite'](_0x59f597) && _0x59f597 > 0x0 ? {
        'source': _0x53cd04,
        'time': _0x59f597
      } : null;
      this["_videoSourceAttachToken"] = Number(this["_videoSourceAttachToken"] || 0x0) + 0x1;
      this["_videoSourceAttachTokens"]?.["set"]?.(_0x38f6ec, Number(this['_videoSourceAttachTokens']?.['get']?.(_0x38f6ec) || 0x0) + 0x1);
      this["_releaseLocalVideoPlaybackObjectUrl"]();
      this['_previewPostersClearedForPlayback'] = new WeakMap();
      resetVideoFramePresentation(_0x38f6ec);
      clearDesktopMediaPlaybackSourceMetadata(_0x38f6ec);
      this["_restoreIdlePreviewPoster"](_0x38f6ec);
      _0x38f6ec["preload"] = 'none';
      _0x38f6ec["removeAttribute"]?.("src");
      try {
        _0x38f6ec["load"]?.();
      } catch {}
      return !![];
    }
    ["prepareRendererMediaFallbackForSuspend"]() {
      if (this['_showDeferredVideoPosterPreview']() !== !![]) {
        return ![];
      }
      const _0x5904f2 = this["_deferredPosterImgEl"];
      if (!_0x5904f2) {
        return ![];
      }
      _0x5904f2['loading'] = "eager";
      try {
        _0x5904f2["fetchPriority"] = 'high';
      } catch {}
      return _0x5904f2['isConnected'] !== ![] && _0x5904f2['complete'] === !![] && Number(_0x5904f2['naturalWidth'] || 0x0) > 0x0;
    }
    ["hasPresentedRendererMedia"]() {
      const _0x2d230a = this['_data'] || {};
      const _0x4ff254 = Array['isArray'](_0x2d230a['videos']) ? _0x2d230a["videos"] : [];
      const _0x57f607 = Math["max"](0x0, Math["min"](Math["max"](0x0, _0x4ff254["length"] - 0x1), Math["trunc"](Number(_0x2d230a["mainVideoIndex"]) || 0x0)));
      const _0x904c7a = this['_multiLayerEls']?.[_0x57f607] || null;
      return !!(_0x904c7a && getVideoCurrentSource(_0x904c7a) && isVideoResultFrameReady(_0x904c7a));
    }
    ["suspendRendererMedia"]() {
      this["_videoRenderEpoch"] = Number(this["_videoRenderEpoch"] || 0x0) + 0x1;
      this["_videoSourceAttachToken"] = Number(this["_videoSourceAttachToken"] || 0x0) + 0x1;
      this['_isHovered'] = ![];
      this['_previewHoverActivationPending'] = ![];
      this['_hoverManualPause'] = ![];
      this["_isManualControl"] = ![];
      this["_autoPlayToken"] = Number(this['_autoPlayToken'] || 0x0) + 0x1;
      this["_setVideoOverlaysVisible"]?.(![]);
      this['_releaseLocalVideoPlaybackObjectUrl']();
      this["_previewPostersClearedForPlayback"] = new WeakMap();
      for (const _0x9ac3e7 of this["previewEl"]?.["querySelectorAll"]?.("video") || []) {
        resetVideoFramePresentation(_0x9ac3e7);
        try {
          _0x9ac3e7["pause"]?.();
        } catch {}
        _0x9ac3e7['removeAttribute']?.('src');
        try {
          _0x9ac3e7["load"]?.();
        } catch {}
      }
      this["_releaseAllCachedVideoObjectUrls"]({
        'invalidatePending': !![]
      });
      this['_rendererMediaDeferred'] = !![];
      this["_rendererEagerVideoPreview"] = ![];
      this["_deferredVideoViewRefreshPending"] = !![];
      this["_showDeferredVideoPosterPreview"]();
    }
    ["_resolveDeferredVideoPosterUrl"]() {
      const _0x4a2c2b = this['_data'] || {};
      const _0x48d5e5 = Array["isArray"](_0x4a2c2b["videos"]) ? _0x4a2c2b["videos"] : [];
      const _0x2eb30f = Number(_0x4a2c2b["mainVideoIndex"]);
      const _0xaad44f = Number["isFinite"](_0x2eb30f) ? Math["max"](0x0, Math['trunc'](_0x2eb30f)) : 0x0;
      const _0x3c9952 = _0x48d5e5[_0xaad44f] || _0x48d5e5[0x0] || null;
      if (isTaskFailed(_0x4a2c2b) || isTaskCancelled(_0x4a2c2b) || String(_0x3c9952?.["error"] || '')['trim']()) {
        return '';
      }
      return this["_resolveVideoResultPosterUrl"](_0x3c9952, {
        'nodeData': _0x4a2c2b,
        'allowNodeFallback': _0x48d5e5['length'] <= 0x1
      });
    }
    ["_resolveVideoResultPosterUrl"](_0x13e4cf, {
      nodeData = this["_data"] || {},
      allowNodeFallback = ![]
    } = {}) {
      const _0x166288 = _0x4fb5e1 => [_0x4fb5e1?.['posterUrl'], _0x4fb5e1?.["thumbUrl"], _0x4fb5e1?.["thumbnailUrl"], _0x4fb5e1?.["previewUrl"], _0x4fb5e1?.['videoThumbSrc'], localPathToUrl(_0x4fb5e1?.['posterLocalPath']), localPathToUrl(_0x4fb5e1?.["thumbLocalPath"]), localPathToUrl(_0x4fb5e1?.["thumbnailLocalPath"]), localPathToUrl(_0x4fb5e1?.["previewLocalPath"])];
      const _0x2ae661 = [..._0x166288(_0x13e4cf), ...(allowNodeFallback ? _0x166288(nodeData) : [])];
      for (const _0x48c5ad of _0x2ae661) {
        const _0x2f09aa = String(_0x48c5ad || '')['trim']();
        if (!isLikelyPosterImageUrl(_0x2f09aa)) {
          continue;
        }
        const _0x112325 = this["_resolveMediaUrl"](_0x2f09aa);
        if (_0x112325) {
          return _0x112325;
        }
      }
      return '';
    }
    ['_removeDeferredVideoPosterPreview']() {
      this["_deferredPosterImgEl"]?.['remove']?.();
      this['_deferredPosterImgEl'] = null;
    }
    ['_showDeferredVideoPosterPreview']() {
      const _0x4ee06e = this['_resolveDeferredVideoPosterUrl']();
      if (!_0x4ee06e || !this["previewEl"]) {
        this["_removeDeferredVideoPosterPreview"]();
        const _0x641c46 = this["_mustRenderTerminalVideoState"]?.(this["_data"]) === !![];
        setVideoResultElementVisible(this['_placeholderEl'], !_0x641c46);
        this['_setVideoOverlaysVisible']?.(![]);
        return ![];
      }
      let _0x599cee = this["_deferredPosterImgEl"];
      if (!_0x599cee || _0x599cee["parentNode"] !== this["previewEl"]) {
        _0x599cee = document["createElement"]("img");
        _0x599cee["classList"]?.["add"]?.('v2-media-preview', 'ai-video-deferred-poster');
        _0x599cee["draggable"] = ![];
        _0x599cee["alt"] = '';
        _0x599cee['decoding'] = "async";
        _0x599cee["loading"] = "lazy";
        try {
          _0x599cee['fetchPriority'] = 'auto';
        } catch {}
        this["previewEl"]["appendChild"](_0x599cee);
        this["_deferredPosterImgEl"] = _0x599cee;
      }
      const _0x39e027 = _0x599cee['getAttribute']?.("src") || _0x599cee["src"] || '';
      _0x39e027 !== _0x4ee06e && (typeof _0x599cee["setAttribute"] === 'function' && _0x599cee['setAttribute']('src', _0x4ee06e), _0x599cee["src"] = _0x4ee06e);
      setVideoResultElementVisible(this['_placeholderEl'], ![]);
      this["_setVideoOverlaysVisible"]?.(![]);
      if (!isVideoResultViewportBusy()) {
        _0x16622f?.(_0x4ee06e);
      }
      return !![];
    }
    ["_resolveVideoMetaSrcFromVideoData"](_0x11e4a6) {
      if (!_0x11e4a6) {
        return '';
      }
      const _0x9325f6 = localPathToUrl(_0x11e4a6["displayLocalPath"]);
      if (_0x9325f6) {
        return _0x9325f6;
      }
      const _0x549373 = localPathToUrl(_0x11e4a6['localPath']);
      if (_0x549373) {
        return _0x549373;
      }
      const _0x550d57 = String(_0x11e4a6['videoUrl'] || '')["trim"]();
      if (!_0x550d57) {
        return '';
      }
      if (_0x550d57['startsWith']("blob:") || _0x550d57["startsWith"]('data:')) {
        return '';
      }
      return localPathToUrl(urlToLocalPath(_0x550d57));
    }
    ["_getVideoSourceKey"](_0x5c07ed) {
      if (!_0x5c07ed || typeof _0x5c07ed !== "object") {
        return '';
      }
      return String(_0x5c07ed["localPath"] || '')["trim"]() || String(_0x5c07ed['videoUrl'] || '')['trim']() || String(_0x5c07ed["src"] || '')["trim"]() || String(_0x5c07ed["thumbId"] || '')["trim"]();
    }
    ["_getVideoResultIdentityKey"](_0x15068d) {
      if (!_0x15068d || typeof _0x15068d !== "object") {
        return '';
      }
      const _0x1a91b6 = [_0x15068d["thumbId"], _0x15068d["assetId"], _0x15068d["displayLocalPath"], _0x15068d['localPath'], _0x15068d['videoUrl'], _0x15068d["src"]]["map"](_0x42f613 => String(_0x42f613 || '')['trim']());
      return _0x1a91b6["some"](Boolean) ? JSON["stringify"](_0x1a91b6) : '';
    }
    ["_closeFullscreenForStaleResult"](_0x4196ec = null) {
      const _0x443659 = String(this["_activeFullscreenResultIdentity"] || '')["trim"]();
      const _0x3fc965 = String(this["_pendingFullscreenResultIdentity"] || '')["trim"]();
      if (!_0x443659 && !_0x3fc965) {
        return ![];
      }
      const _0x4bf5fb = _0x4196ec && typeof _0x4196ec === "object" ? _0x4196ec : this["_data"] || {};
      const _0x596aa7 = Array["isArray"](_0x4bf5fb["videos"]) ? _0x4bf5fb["videos"] : [];
      const _0x303912 = _0x596aa7["length"] > 0x0 ? _0x596aa7 : [_0x4bf5fb];
      const _0x44dfdd = new Set(_0x303912["filter"](_0x5e735b => !String(_0x5e735b?.['error'] || '')["trim"]() && !this['_isVideoMarkedUnavailable'](_0x5e735b))["map"](_0x4feea1 => this["_getVideoResultIdentityKey"](_0x4feea1))["filter"](Boolean));
      let _0x42a4fb = ![];
      _0x3fc965 && !_0x44dfdd["has"](_0x3fc965) && (this["_fullscreenOpenEpoch"] = Number(this["_fullscreenOpenEpoch"] || 0x0) + 0x1, this["_pendingFullscreenResultIdentity"] = '', _0x42a4fb = !![]);
      _0x443659 && this["_activeFullscreenCleanup"] && !_0x44dfdd['has'](_0x443659) && (this['_activeFullscreenCleanup'](), _0x42a4fb = !![]);
      return _0x42a4fb;
    }
    ['_isVideoMarkedUnavailable'](_0xed6016) {
      const _0x34d9c0 = this["_getVideoSourceKey"](_0xed6016);
      if (!_0x34d9c0) {
        return ![];
      }
      const _0x936ebc = String(_0xed6016?.["mediaUnavailableSource"] || '')["trim"]();
      return _0xed6016?.["mediaUnavailable"] === !![] && _0x936ebc === _0x34d9c0;
    }
    ["_isVideoThumbMarkedUnavailable"](_0x29f0d9, _0x118053 = '') {
      const _0x4f2259 = String(_0x118053 || this["_resolveVideoMetaSrcFromVideoData"](_0x29f0d9))["trim"]();
      if (!_0x4f2259) {
        return ![];
      }
      return String(_0x29f0d9?.['videoThumbUnavailableSource'] || '')["trim"]() === _0x4f2259;
    }
    ["_markVideoThumbUnavailable"](_0x2fb707, _0x8b6e83, _0x367382 = '') {
      const _0x326bc3 = String(_0x367382 || this['_resolveVideoMetaSrcFromVideoData'](_0x8b6e83))["trim"]();
      if (!_0x326bc3) {
        return;
      }
      const _0x5b5c47 = _0x5d8529["getState"]()['nodes'][this["nodeId"]];
      if (!_0x5b5c47) {
        return;
      }
      const _0xb2d06d = Array["isArray"](_0x5b5c47["videos"]) ? _0x5b5c47["videos"] : [];
      const _0x33dc13 = Number(_0x5b5c47["mainVideoIndex"]);
      const _0x4a5886 = Number["isFinite"](_0x33dc13) ? Math["max"](0x0, Math["trunc"](_0x33dc13)) : 0x0;
      const _0x2a0f65 = {};
      (_0x2fb707 < 0x0 || _0x2fb707 === _0x4a5886) && (_0x2a0f65["videoThumbUnavailableSource"] = _0x326bc3, _0x2a0f65["thumbUrl"] = '');
      if (_0x2fb707 >= 0x0 && _0x2fb707 < _0xb2d06d["length"]) {
        const _0x27fb85 = _0xb2d06d[_0x2fb707];
        if (_0x27fb85 && typeof _0x27fb85 === "object") {
          const _0x7da9a2 = _0xb2d06d["slice"]();
          _0x7da9a2[_0x2fb707] = {
            ..._0x27fb85,
            'videoThumbUnavailableSource': _0x326bc3,
            'thumbUrl': ''
          };
          _0x2a0f65['videos'] = _0x7da9a2;
        }
      }
      if (Object["keys"](_0x2a0f65)['length']) {
        _0x5d8529['updateNodeData'](this["nodeId"], _0x2a0f65);
      }
    }
    ['_markVideoUnavailable'](_0x56c5d7, _0x281ba8) {
      const _0x5b90f2 = this['_getVideoSourceKey'](_0x281ba8);
      if (!_0x5b90f2) {
        return;
      }
      const _0x27fc56 = _0x5d8529['getState']()["nodes"][this["nodeId"]];
      if (!_0x27fc56) {
        return;
      }
      const _0x5bc607 = Array['isArray'](_0x27fc56['videos']) ? _0x27fc56['videos'] : [];
      const _0x15b819 = Number(_0x27fc56["mainVideoIndex"]);
      const _0x2f5be5 = Number["isFinite"](_0x15b819) ? Math["max"](0x0, Math['trunc'](_0x15b819)) : 0x0;
      const _0x224dc7 = {
        'mediaUnavailable': !![],
        'mediaUnavailableSource': _0x5b90f2
      };
      if (_0x56c5d7 < 0x0 || _0x56c5d7 === _0x2f5be5) {
        _0x224dc7["thumbUrl"] = '';
      }
      if (_0x56c5d7 >= 0x0 && _0x56c5d7 < _0x5bc607["length"]) {
        const _0x5056a4 = _0x5bc607[_0x56c5d7];
        if (_0x5056a4 && typeof _0x5056a4 === "object") {
          const _0x4f9892 = _0x5bc607["slice"]();
          _0x4f9892[_0x56c5d7] = {
            ..._0x5056a4,
            'mediaUnavailable': !![],
            'mediaUnavailableSource': _0x5b90f2,
            'thumbUrl': ''
          };
          _0x224dc7["videos"] = _0x4f9892;
        }
      }
      _0x5d8529["updateNodeData"](this['nodeId'], _0x224dc7);
    }
    ['_clearVideoUnavailable'](_0x3501d6, _0x3a59d1) {
      const _0x224bc3 = this["_getVideoSourceKey"](_0x3a59d1);
      if (!_0x224bc3) {
        return;
      }
      const _0x1876dd = _0x5d8529["getState"]()['nodes'][this['nodeId']];
      if (!_0x1876dd) {
        return;
      }
      const _0x1bbd58 = {};
      _0x1876dd["mediaUnavailable"] === !![] && String(_0x1876dd['mediaUnavailableSource'] || '') === _0x224bc3 && (_0x1bbd58["mediaUnavailable"] = ![], _0x1bbd58["mediaUnavailableSource"] = '');
      const _0x32df0c = Array["isArray"](_0x1876dd["videos"]) ? _0x1876dd["videos"] : [];
      if (_0x3501d6 >= 0x0 && _0x3501d6 < _0x32df0c["length"]) {
        const _0x37f8c0 = _0x32df0c[_0x3501d6];
        if (_0x37f8c0 && typeof _0x37f8c0 === "object" && _0x37f8c0["mediaUnavailable"] === !![] && String(_0x37f8c0["mediaUnavailableSource"] || '') === _0x224bc3) {
          const _0x588175 = _0x32df0c["slice"]();
          _0x588175[_0x3501d6] = {
            ..._0x37f8c0,
            'mediaUnavailable': ![],
            'mediaUnavailableSource': ''
          };
          _0x1bbd58['videos'] = _0x588175;
        }
      }
      if (Object["keys"](_0x1bbd58)['length']) {
        _0x5d8529["updateNodeData"](this["nodeId"], _0x1bbd58);
      }
    }
    ['_shouldFetchVideoMetaForNodeInfo']() {
      try {
        const _0x4a5e8a = typeof _0x5d8529['getStateRaw'] === "function" ? _0x5d8529["getStateRaw"]() : _0x5d8529['getState']();
        return _0x4a5e8a?.['ui']?.['showVideoMeta'] === !![];
      } catch {
        return ![];
      }
    }
    ["requestVideoMetaForNodeInfo"](_0x48b4d1 = this['_data']) {
      const _0x2ede12 = Array["isArray"](_0x48b4d1?.['videos']) ? _0x48b4d1['videos'] : [];
      if (!_0x2ede12['length']) {
        return null;
      }
      const _0x4a2a72 = Number(_0x48b4d1?.["mainVideoIndex"]);
      const _0x4722f2 = Number["isFinite"](_0x4a2a72) ? Math["max"](0x0, Math["trunc"](_0x4a2a72)) : 0x0;
      const _0x268184 = _0x2ede12[Math["min"](_0x4722f2, _0x2ede12["length"] - 0x1)] || _0x2ede12[0x0] || null;
      if (!_0x268184 || this["_isVideoMarkedUnavailable"](_0x268184)) {
        return null;
      }
      if (String(_0x268184['error'] || '')['trim']()) {
        return null;
      }
      const _0x1452e8 = this['_resolveVideoMetaSrcFromVideoData'](_0x268184);
      if (!_0x1452e8) {
        return null;
      }
      const _0x5ccee4 = Date["now"]();
      if (this["_videoMetaInfoRequestSrc"] === _0x1452e8 && _0x5ccee4 - Number(this["_videoMetaInfoRequestAt"] || 0x0) < 0x1388) {
        return this["_metaFetchPromise"] || null;
      }
      this["_videoMetaInfoRequestSrc"] = _0x1452e8;
      this["_videoMetaInfoRequestAt"] = _0x5ccee4;
      return this["_maybeFetchVideoMeta"](_0x1452e8);
    }
    async ["_maybeFetchVideoMeta"](_0xcd4fd) {
      if (!this['_shouldFetchVideoMetaForNodeInfo']()) {
        return;
      }
      const _0x23f652 = String(_0xcd4fd || '')["trim"]();
      if (!_0x23f652) {
        return;
      }
      const _0x3bba62 = _0x5d8529['getState']()['nodes'][this["nodeId"]];
      if (!_0x3bba62) {
        return;
      }
      const _0x3bd4f7 = String(_0x3bba62["videoMetaSrc"] || '');
      const _0x2b24fc = Number['isFinite'](Number(_0x3bba62["videoFps"])) && Number(_0x3bba62["videoFps"]) > 0x0 && Number['isFinite'](Number(_0x3bba62["videoFrameCount"])) && Number(_0x3bba62["videoFrameCount"]) > 0x0;
      if (_0x2b24fc && _0x3bd4f7 === _0x23f652) {
        return;
      }
      if (this['_metaFetchPromise'] && this["_metaFetchSrc"] === _0x23f652) {
        return this["_metaFetchPromise"];
      }
      _0x3bd4f7 && _0x3bd4f7 !== _0x23f652 && _0x5d8529['updateNodeData'](this["nodeId"], {
        'videoMetaSrc': _0x23f652,
        'videoFps': null,
        'videoFrameCount': null,
        'videoDuration': null,
        'videoWidth': null,
        'videoHeight': null
      });
      const _0x36a5fe = ++this["_nodeInfoMetaFetchToken"];
      const _0x5457e9 = (async () => {
        try {
          const _0x1c87cf = await _0x1e6ccf["fetchVideoMetaFromServer"](_0x23f652);
          if (_0x36a5fe !== this["_nodeInfoMetaFetchToken"]) {
            return;
          }
          if (!_0x1c87cf || _0x1c87cf['success'] !== !![]) {
            return;
          }
          const _0x15afd1 = Number(_0x1c87cf['fps']);
          const _0x535d26 = Number(_0x1c87cf["frameCount"]);
          const _0x11d723 = Number(_0x1c87cf["duration"]);
          const _0x29cd7a = Number(_0x1c87cf["width"]);
          const _0xad455a = Number(_0x1c87cf['height']);
          const _0x40adcd = {
            'videoMetaSrc': _0x23f652
          };
          if (Number["isFinite"](_0x15afd1) && _0x15afd1 > 0x0) {
            _0x40adcd["videoFps"] = _0x15afd1;
          }
          if (Number["isFinite"](_0x535d26) && _0x535d26 > 0x0) {
            _0x40adcd['videoFrameCount'] = Math['round'](_0x535d26);
          }
          if (Number["isFinite"](_0x11d723) && _0x11d723 > 0x0) {
            _0x40adcd["videoDuration"] = _0x11d723;
          }
          if (Number["isFinite"](_0x29cd7a) && _0x29cd7a > 0x0) {
            _0x40adcd["videoWidth"] = Math["round"](_0x29cd7a);
          }
          if (Number["isFinite"](_0xad455a) && _0xad455a > 0x0) {
            _0x40adcd["videoHeight"] = Math["round"](_0xad455a);
          }
          const _0x3b020c = _0x5d8529['getState']()['nodes'][this["nodeId"]];
          if (!_0x3b020c) {
            return;
          }
          const _0x241366 = String(_0x3b020c['videoMetaSrc'] || '') !== String(_0x40adcd["videoMetaSrc"] || '') || Number(_0x3b020c["videoFps"] || 0x0) !== Number(_0x40adcd["videoFps"] || 0x0) || Number(_0x3b020c["videoFrameCount"] || 0x0) !== Number(_0x40adcd['videoFrameCount'] || 0x0) || Number(_0x3b020c["videoDuration"] || 0x0) !== Number(_0x40adcd["videoDuration"] || 0x0) || Number(_0x3b020c["videoWidth"] || 0x0) !== Number(_0x40adcd["videoWidth"] || 0x0) || Number(_0x3b020c["videoHeight"] || 0x0) !== Number(_0x40adcd["videoHeight"] || 0x0);
          if (_0x241366) {
            _0x5d8529['updateNodeData'](this['nodeId'], _0x40adcd);
          }
        } catch {} finally {
          this["_metaFetchPromise"] === _0x5457e9 && (this["_metaFetchPromise"] = null, this['_metaFetchSrc'] = '');
        }
      })();
      this["_metaFetchSrc"] = _0x23f652;
      this["_metaFetchPromise"] = _0x5457e9;
      return _0x5457e9;
    }
    ["_createStatusCard"](_0x139ad9, _0x179313) {
      const _0x9e4a37 = document["createElement"]('div');
      const _0x3c73c5 = Number(_0x179313) === 0x0;
      _0x9e4a37["className"] = "gen-status-card " + (_0x3c73c5 ? "is-success" : "is-neutral");
      const _0x370a9b = document["createElement"]('div');
      _0x370a9b["className"] = 'gen-status-card-icon';
      _0x370a9b["innerHTML"] = '<svg\x20width=\x2224\x22\x20height=\x2224\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22><circle\x20cx=\x2212\x22\x20cy=\x2212\x22\x20r=\x2210\x22/><path\x20d=\x22' + (_0x3c73c5 ? "M8 12l2.5 2.5L16 9" : "M12 8v5") + "\" />" + (_0x3c73c5 ? '' : "<line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\" />") + '</svg>';
      const _0x8e02f8 = document["createElement"]("span");
      _0x8e02f8["className"] = 'gen-status-card-message';
      _0x8e02f8["textContent"] = String(_0x139ad9 || '');
      _0x9e4a37["appendChild"](_0x370a9b);
      _0x9e4a37["appendChild"](_0x8e02f8);
      return _0x9e4a37;
    }
    ['_ensureStatusOverlayEl']() {
      if (this["_statusOverlayEl"]) {
        return this["_statusOverlayEl"];
      }
      this['_statusOverlayEl'] = document["createElement"]("div");
      this["_statusOverlayEl"]["className"] = 'dreamina-status-overlay';
      this['previewEl']['appendChild'](this['_statusOverlayEl']);
      return this["_statusOverlayEl"];
    }
    ["_clearStatusOverlay"]() {
      if (!this['_statusOverlayEl']) {
        return;
      }
      this["_statusOverlayEl"]["remove"]();
      this["_statusOverlayEl"] = null;
    }
    ['_getGenerationFailureMessage'](_0x358bdc = this["_data"]) {
      if (!_0x358bdc || typeof _0x358bdc !== "object") {
        return '';
      }
      const _0x15c6c5 = isTaskFailed(_0x358bdc) || isTaskCancelled(_0x358bdc);
      if (!_0x15c6c5) {
        return '';
      }
      return getTaskMessage(_0x358bdc) || videoResultRenderText("generationFailed");
    }
    ["_mustRenderTerminalVideoState"](_0x4bd1a1 = this["_data"]) {
      const _0x56c715 = _0x4bd1a1 && typeof _0x4bd1a1 === "object" ? _0x4bd1a1 : {};
      const _0x2aadd0 = Array["isArray"](_0x56c715["videos"]) ? _0x56c715["videos"] : [];
      const _0x15e1b9 = Math['max'](0x0, Math['trunc'](Number(_0x56c715["mainVideoIndex"]) || 0x0));
      const _0x3a31d1 = _0x2aadd0[_0x15e1b9] || _0x2aadd0[0x0] || null;
      return !!this["_getGenerationFailureMessage"](_0x56c715) || !!String(_0x3a31d1?.["error"] || '')["trim"]();
    }
    ["_createErrorCard"](_0xac4aed) {
      return createVideoGenerationErrorCard(_0xac4aed);
    }
    ["_formatDreaminaElapsed"](_0x4ebcea) {
      const _0x332ec9 = Math['max'](0x0, Math["floor"](Number(_0x4ebcea || 0x0) / 0x3e8));
      const _0x4ee1c7 = Math["floor"](_0x332ec9 / 0x3c);
      const _0x57519b = _0x332ec9 % 0x3c;
      if (_0x4ee1c7 > 0x0) {
        return videoResultRenderText("elapsedMinutesSeconds", {
          'minutes': _0x4ee1c7,
          'seconds': String(_0x57519b)["padStart"](0x2, '0')
        });
      }
      return videoResultRenderText('elapsedSeconds', {
        'seconds': _0x57519b
      });
    }
    async ["_loadAndDisplayVideo"]() {
      const _0x52451b = _0x5d8529["getState"]()['nodes']?.[this["nodeId"]] || this["_data"] || {};
      if (isSegmentRetakeEditing(_0x52451b)) {
        return;
      }
      const _0x5de942 = Number(this["_videoRenderEpoch"] || 0x0) + 0x1;
      this["_videoRenderEpoch"] = _0x5de942;
      this["_closeFullscreenForStaleResult"](_0x52451b);
      this["_syncCachedVideoObjectUrls"](_0x52451b);
      let _0x155a0e = Number(this['_videoSourceAttachToken'] || 0x0);
      const _0x2b6a36 = () => Number(this["_videoRenderEpoch"] || 0x0) === _0x5de942 && Number(this["_videoSourceAttachToken"] || 0x0) === _0x155a0e && (this["_isHovered"] === !![] || this["_isManualControl"] === !![]);
      const _0x213afe = this['_data'] || {};
      const _0x22c8c2 = this["_mustRenderTerminalVideoState"](_0x213afe);
      if (this["_rendererMediaDeferred"] === !![] && !_0x22c8c2) {
        this["_deferredVideoViewRefreshPending"] = !![];
        this['_showDeferredVideoPosterPreview']();
        return;
      }
      this["_deferredPosterImgEl"] && !_0x22c8c2 ? this["_showDeferredVideoPosterPreview"]() : this["_removeDeferredVideoPosterPreview"]();
      const _0x14423f = this["_data"]["videos"] || [];
      _0x14423f["length"] === 0x0 && (this["_data"]["videoUrl"] || this["_data"]["localPath"] || this["_data"]['thumbId']) && _0x14423f["push"]({
        'videoUrl': this['_data']["videoUrl"],
        'thumbId': this["_data"]['thumbId'],
        'localPath': this["_data"]["localPath"]
      });
      const _0x2e729f = (this["_data"]["rhStatusMessage"] || '')["trim"]();
      const _0xcfed98 = this["_data"]["rhStatusCode"];
      const _0x5631ce = this["_getGenerationFailureMessage"](this["_data"]);
      if (_0x5631ce && _0x14423f["length"] === 0x0) {
        this["_videoSourceAttachToken"] = Number(this["_videoSourceAttachToken"] || 0x0) + 0x1;
        this["_releaseLocalVideoPlaybackObjectUrl"]();
        this['videoEl'] && (setVideoResultElementVisible(this["videoEl"], ![]), this["videoEl"]["removeAttribute"]?.("src"), this['videoEl']["load"]?.());
        setVideoResultElementVisible(this["_placeholderEl"], ![]);
        this["_setVideoOverlaysVisible"](![]);
        this["_multiVideosContainer"] && (this["_multiVideosContainer"]['remove'](), this["_multiVideosContainer"] = null);
        const _0x20bfb1 = this["_ensureStatusOverlayEl"]();
        _0x20bfb1["innerHTML"] = '';
        _0x20bfb1["appendChild"](this["_createErrorCard"](_0x5631ce));
        return;
      }
      if (_0x2e729f && _0x14423f['length'] === 0x0) {
        this["_videoSourceAttachToken"] = Number(this["_videoSourceAttachToken"] || 0x0) + 0x1;
        this['_releaseLocalVideoPlaybackObjectUrl']();
        this["videoEl"] && (setVideoResultElementVisible(this["videoEl"], ![]), this["videoEl"]["removeAttribute"]?.('src'), this['videoEl']["load"]?.());
        setVideoResultElementVisible(this["_placeholderEl"], ![]);
        this["_setVideoOverlaysVisible"](![]);
        this["_multiVideosContainer"] && (this['_multiVideosContainer']["remove"](), this["_multiVideosContainer"] = null);
        const _0x6131e2 = this['_ensureStatusOverlayEl']();
        _0x6131e2["innerHTML"] = '';
        _0x6131e2["appendChild"](this["_createStatusCard"](_0x2e729f, _0xcfed98));
        return;
      }
      this["_clearStatusOverlay"]();
      const _0xccb66f = _0x14423f["length"];
      if (_0xccb66f === 0x0) {
        this["_videoSourceAttachToken"] = Number(this["_videoSourceAttachToken"] || 0x0) + 0x1;
        this["_releaseLocalVideoPlaybackObjectUrl"]();
        this["videoEl"] && (setVideoResultElementVisible(this['videoEl'], ![]), this["videoEl"]['removeAttribute']?.("src"), this["videoEl"]['load']?.());
        setVideoResultElementVisible(this["_placeholderEl"], !![]);
        this["_setVideoOverlaysVisible"](![]);
        this["_multiVideosContainer"] && (this["_multiVideosContainer"]['remove'](), this["_multiVideosContainer"] = null);
        return;
      }
      const _0x4a7829 = this["_data"]["mainVideoIndex"] || 0x0;
      const _0x39cfbc = this["_rendererThinVideoHydration"] === !![];
      const _0x93da11 = this['_lastVideoRenderWasThin'] === !![];
      const _0x2df8ff = _0xccb66f > 0x1;
      const _0x39ae9b = !_0x39cfbc && _0x2df8ff && !!this["_data"]["isVideosExpanded"];
      const _0x3535f1 = Math["max"](0x0, Math["min"](_0xccb66f - 0x1, Math["trunc"](Number(_0x4a7829) || 0x0)));
      const _0x1e5636 = _0x14423f[Math['max'](0x0, Math["min"](_0xccb66f - 0x1, Math['trunc'](Number(_0x4a7829) || 0x0)))] || _0x14423f[0x0] || null;
      const _0x32045f = !!String(_0x1e5636?.["error"] || '')["trim"]();
      const _0x462d12 = this["_isVideoMarkedUnavailable"](_0x1e5636);
      const _0x15f2e7 = this["_resolveVideoMetaSrcFromVideoData"](_0x1e5636);
      if (_0x15f2e7 && !_0x462d12 && !_0x32045f) {
        this['_maybeFetchVideoMeta'](_0x15f2e7);
      }
      const _0x27c77c = (_0x5423f9, _0x244636) => {
        if (isVideoResultViewportBusy()) {
          return;
        }
        if (this['_isVideoMarkedUnavailable'](_0x244636)) {
          return;
        }
        const _0x3597a7 = this["_resolveVideoMetaSrcFromVideoData"](_0x244636);
        if (!_0x3597a7) {
          return;
        }
        if (!(_0x3597a7["startsWith"]("/output/") || _0x3597a7["startsWith"]("/data/"))) {
          return;
        }
        if (this['_isVideoThumbMarkedUnavailable'](_0x244636, _0x3597a7)) {
          return;
        }
        const _0x145a40 = _0x5d8529["getState"]()['nodes']?.[this['nodeId']] || {};
        const _0x336db8 = ["waiting", "processing"]['includes'](String(_0x145a40['mediaTaskStatus'] || '')) && ["videoFirstFrame", 'videoPoster']["includes"](String(_0x145a40["mediaTaskKind"] || ''));
        if (String(_0x244636?.["videoThumbSrc"] || '')["trim"]() === _0x3597a7) {
          if (String(_0x244636?.['thumbUrl'] || '')["trim"]() || _0x336db8) {
            return;
          }
        }
        const _0x9f3b22 = "out|" + this['nodeId'] + '|' + _0x5423f9 + '|' + _0x3597a7;
        if (this["_videoThumbPending"]["has"](_0x9f3b22)) {
          return;
        }
        this['_videoThumbPending']["add"](_0x9f3b22);
        const _0x143991 = _0x5d8529['getState']()["nodes"]?.[this["nodeId"]];
        const _0x3436a = Array["isArray"](_0x143991?.["videos"]) ? _0x143991["videos"] : [];
        if (_0x5423f9 >= 0x0 && _0x5423f9 < _0x3436a["length"]) {
          const _0x3d65cd = _0x3436a[_0x5423f9];
          if (_0x3d65cd && typeof _0x3d65cd === "object" && String(_0x3d65cd['videoThumbSrc'] || '')['trim']() !== _0x3597a7) {
            const _0x4c0040 = _0x3436a["slice"]();
            _0x4c0040[_0x5423f9] = {
              ..._0x3d65cd,
              'videoThumbSrc': _0x3597a7
            };
            _0x5d8529["updateNodeData"](this["nodeId"], {
              'videos': _0x4c0040
            });
          }
        }
        _0x1e6ccf["fetchVideoFirstFrameThumbFromServer"](_0x3597a7, {
          'nodeId': this['nodeId'],
          'assetId': String(_0x244636?.["assetId"] || _0x244636?.["thumbId"] || '')
        })['then'](_0x587c4f => {
          const _0x1a287f = String(_0x587c4f?.["thumbUrl"] || _0x587c4f?.['url'] || '')["trim"]();
          if (!_0x1a287f) {
            return;
          }
          const _0x46bc65 = _0x5d8529["getState"]();
          const _0x458ec8 = _0x46bc65["nodes"]?.[this["nodeId"]];
          if (!_0x458ec8) {
            return;
          }
          const _0x4d8df1 = Array['isArray'](_0x458ec8["videos"]) ? _0x458ec8["videos"] : [];
          if (!(_0x5423f9 >= 0x0 && _0x5423f9 < _0x4d8df1["length"])) {
            return;
          }
          const _0x125dfd = _0x4d8df1[_0x5423f9];
          if (!_0x125dfd || typeof _0x125dfd !== 'object') {
            return;
          }
          const _0x102b35 = {
            ..._0x125dfd,
            'videoThumbSrc': _0x3597a7,
            'videoThumbUnavailableSource': ''
          };
          if (!String(_0x102b35["thumbUrl"] || '')["trim"]() && _0x1a287f) {
            _0x102b35["thumbUrl"] = _0x1a287f;
          }
          const _0x4dd99f = _0x4d8df1["slice"]();
          _0x4dd99f[_0x5423f9] = _0x102b35;
          const _0x1d93af = {
            'videos': _0x4dd99f
          };
          const _0x51640f = Number(_0x458ec8["mainVideoIndex"]);
          const _0x1348c7 = Number["isFinite"](_0x51640f) ? Math['max'](0x0, Math["trunc"](_0x51640f)) : 0x0;
          if (_0x5423f9 === _0x1348c7) {
            _0x1d93af["videoThumbUnavailableSource"] = '';
          }
          if (_0x5423f9 === _0x1348c7) {
            if (!String(_0x458ec8["thumbUrl"] || '')["trim"]() && _0x1a287f) {
              _0x1d93af['thumbUrl'] = _0x1a287f;
            }
          }
          _0x5d8529['updateNodeData'](this['nodeId'], _0x1d93af);
        })['catch'](() => {
          const _0xba382f = _0x5d8529['getState']()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
          const _0x12029e = Array["isArray"](_0xba382f['videos']) ? _0xba382f["videos"] : [];
          const _0x2a201a = _0x12029e[_0x5423f9] || _0x244636 || {};
          const _0x28c0f2 = this['_resolveVideoMetaSrcFromVideoData'](_0x2a201a);
          _0x28c0f2 === _0x3597a7 && this["_markVideoThumbUnavailable"](_0x5423f9, _0x2a201a, _0x3597a7);
        })["finally"](() => {
          this["_videoThumbPending"]["delete"](_0x9f3b22);
        });
      };
      const _0x3d8371 = _0x14423f["map"](_0x1aaacb => (_0x1aaacb["videoUrl"] || '') + '|' + (_0x1aaacb["localPath"] || '') + '|' + (_0x1aaacb["displayLocalPath"] || '') + '|' + (_0x1aaacb['thumbId'] || '') + '|' + (_0x1aaacb["error"] || ''))["join"]('||');
      const _0x30af93 = _0x3d8371 !== this["_lastVideosKeyStr"];
      const _0x3c65e5 = _0x4a7829 !== this["_lastMainIdx"];
      const _0x13d076 = _0x39ae9b !== this["_lastIsExpanded"];
      const _0x3be0ea = _0x93da11 && !_0x39cfbc;
      const _0x3740a5 = !this["_expandPanel"] || _0x30af93 || _0x3c65e5 || _0x13d076;
      this["_lastVideosKeyStr"] = _0x3d8371;
      this["_lastMainIdx"] = _0x4a7829;
      this['_lastIsExpanded'] = _0x39ae9b;
      this["_lastVideoRenderWasThin"] = _0x39cfbc;
      !this["_multiVideosContainer"] && (this['_multiVideosContainer'] = document["createElement"]('div'), this["_multiVideosContainer"]['className'] = 'multi-video-container', this["previewEl"]["appendChild"](this["_multiVideosContainer"]));
      const _0x4c68bc = new Array(_0xccb66f)["fill"]('');
      const _0x20edb1 = new Array(_0xccb66f)["fill"]('');
      const _0x1d1c76 = [];
      const _0x348e21 = this["_isHovered"] === !![] || this["_isManualControl"] === !![];
      const _0x370a5d = this['_isManualControl'] === !![] ? 'auto' : 'metadata';
      for (let _0x298de9 = 0x0; _0x298de9 < _0xccb66f; _0x298de9++) {
        const _0x3f78d0 = _0x14423f[_0x298de9] || {};
        const _0x4c3a46 = this["_isVideoMarkedUnavailable"](_0x3f78d0);
        !_0x4c3a46 && (_0x20edb1[_0x298de9] = this["_resolveVideoResultPosterUrl"](_0x3f78d0, {
          'nodeData': this["_data"],
          'allowNodeFallback': _0xccb66f <= 0x1 && _0x298de9 === _0x3535f1
        }));
        const _0x54e854 = _0x298de9 === _0x3535f1;
        const _0x493395 = _0x39ae9b || _0x54e854 && _0x348e21;
        if (_0x493395 && !_0x4c3a46) {
          let _0x200d59 = this["_resolveVideoPlaybackUrl"](_0x3f78d0);
          if (!_0x200d59 && _0x3f78d0["thumbId"]) {
            const _0x27092c = String(_0x3f78d0["thumbId"] || '');
            const _0x4c9626 = _0x27092c ? this["_cachedVideoUrls"]["get"](_0x27092c) : '';
            if (_0x4c9626) {
              _0x200d59 = _0x4c9626;
            } else {
              _0x1d1c76["push"]({
                'i': _0x298de9,
                'thumbId': _0x27092c
              });
            }
          }
          _0x4c68bc[_0x298de9] = _0x200d59;
        }
      }
      const _0x3442be = new Set(_0x1d1c76['map'](_0xe35505 => _0xe35505['i']));
      const _0x5e8279 = _0x32045f || !_0x462d12 && (!!_0x4c68bc[_0x3535f1] || !!_0x20edb1[_0x3535f1]);
      setVideoResultElementVisible(this['_placeholderEl'], !_0x5e8279);
      this["_setVideoOverlaysVisible"](!_0x32045f && _0x5e8279 && !_0x39ae9b);
      if (!_0x32045f && _0x20edb1[_0x3535f1]) {
        if (!isVideoResultViewportBusy()) {
          _0x16622f(_0x20edb1[_0x3535f1]);
        }
      } else {
        if (!_0x32045f) {
          _0x27c77c(_0x3535f1, _0x1e5636);
        }
      }
      const _0x467609 = _0x486d96 => {
        if (this["_isExpandedPickClosing"]) {
          return;
        }
        this["_isExpandedPickClosing"] = !![];
        const _0x5f0401 = this["_root"]["querySelectorAll"](".multi-flyout-panel > div");
        const _0x36ca02 = () => {
          const _0x556779 = _0x14423f[_0x486d96];
          if (!_0x556779 || typeof _0x556779 !== "object") {
            return {
              'w': 0x0,
              'h': 0x0,
              'd': 0x0
            };
          }
          const _0x520d85 = Number(_0x556779["videoWidth"] || 0x0);
          const _0x31d41a = Number(_0x556779['videoHeight'] || 0x0);
          const _0x47fc8d = Number(_0x556779['duration']);
          return {
            'w': Number['isFinite'](_0x520d85) ? _0x520d85 : 0x0,
            'h': Number["isFinite"](_0x31d41a) ? _0x31d41a : 0x0,
            'd': _0x47fc8d
          };
        };
        const _0x302a78 = () => {
          const _0x5819ec = _0x36ca02();
          const _0x1f1710 = {
            ...buildSelectedVideoResultPresentationPatch(_0x14423f, _0x486d96)
          };
          _0x5819ec['w'] > 0x0 && _0x5819ec['h'] > 0x0 && (_0x1f1710["selectedVideoWidth"] = _0x5819ec['w'], _0x1f1710["selectedVideoHeight"] = _0x5819ec['h'], _0x1f1710["videoWidth"] = _0x5819ec['w'], _0x1f1710["videoHeight"] = _0x5819ec['h']);
          if (Number["isFinite"](_0x5819ec['d']) && _0x5819ec['d'] > 0x0) {
            _0x1f1710['videoDuration'] = _0x5819ec['d'];
          }
          return _0x1f1710;
        };
        if (_0x5f0401["length"] > 0x0) {
          const _0x47146e = this["previewEl"]["offsetTop"];
          const _0x21e352 = 0x0;
          const _0x11a200 = _0x47146e;
          _0x5f0401["forEach"](_0x15a589 => {
            applyVideoResultGeometryAnimationStyle(_0x15a589, {
              'transition': 'all\x200.35s\x20cubic-bezier(0.6,\x20-0.28,\x200.735,\x200.045)',
              'opacity': '0',
              'transform': "scale(0.01) rotate(-45deg)",
              'filter': "blur(10px)",
              'top': _0x11a200 + 'px',
              'left': _0x21e352 + 'px'
            });
          });
          setTimeout(() => {
            _0x5d8529["updateNodeData"](this["nodeId"], _0x302a78());
            this["_isExpandedPickClosing"] = ![];
          }, 0x15e);
        } else {
          _0x5d8529["updateNodeData"](this["nodeId"], _0x302a78());
          this["_isExpandedPickClosing"] = ![];
        }
      };
      const _0x2862b5 = (_0x4dd454, _0x39812b) => {
        _0x4dd454["innerHTML"] = _0x39812b ? "<span>" + _0xccb66f + " 个</span><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"9 18 15 12 9 6\"></polyline></svg>" : "<span>" + _0xccb66f + " 个</span><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>";
        _0x4dd454["classList"]?.['toggle']?.("is-expanded", _0x39812b === !![]);
      };
      if (_0x30af93 || !this["_multiStackWrap"] || _0x3be0ea) {
        const _0x5e39fc = _0x3be0ea && !_0x32045f ? this["_multiLayerEls"]?.[_0x3535f1] || null : null;
        (_0x30af93 || !_0x5e39fc) && (this["_videoSourceAttachToken"] = Number(this["_videoSourceAttachToken"] || 0x0) + 0x1, _0x155a0e = Number(this["_videoSourceAttachToken"] || 0x0));
        !_0x5e39fc ? (this["_multiVideosContainer"]["innerHTML"] = '', this["_multiStackWrap"] = document["createElement"]('div'), this["_multiStackWrap"]["className"] = 'multi-stack-wrap\x20ai-video-result-stack') : this["_multiToggleBtn"]?.["remove"]?.();
        this["_multiLayerEls"] = [];
        this["_multiErrorEls"] = [];
        this["_multiToggleBtn"] = null;
        for (let _0x33a70b = _0xccb66f - 0x1; _0x33a70b >= 0x0; _0x33a70b--) {
          if (_0x39cfbc && _0x33a70b !== _0x3535f1) {
            continue;
          }
          if (_0x5e39fc && _0x33a70b === _0x3535f1) {
            this["_multiLayerEls"][_0x33a70b] = _0x5e39fc;
            continue;
          }
          const _0x493ab6 = String(_0x14423f[_0x33a70b]?.["error"] || '')['trim']();
          if (_0x493ab6) {
            const _0x1b895d = this["_createErrorCard"](_0x493ab6);
            _0x1b895d['className'] = ((_0x1b895d["className"] || '') + " ai-video-result-error-layer")['trim']();
            this['_multiErrorEls'][_0x33a70b] = _0x1b895d;
            this['_multiStackWrap']['appendChild'](_0x1b895d);
            continue;
          }
          const _0x2ea32e = document["createElement"]("video");
          _0x2ea32e["dataset"]["idx"] = String(_0x33a70b);
          if (_0x20edb1[_0x33a70b]) {
            _0x2ea32e['poster'] = _0x20edb1[_0x33a70b];
          }
          const _0x536307 = _0x33a70b === _0x3535f1 && _0x348e21 && !_0x20edb1[_0x33a70b];
          if (_0x536307 && _0x4c68bc[_0x33a70b]) {
            const _0x108ba6 = await this['_resolveLocalVideoPlaybackObjectUrl'](_0x4c68bc[_0x33a70b], 'ai-video:' + this["nodeId"] + ':slot:' + _0x33a70b);
            if (Number(this["_videoRenderEpoch"] || 0x0) !== _0x5de942) {
              return;
            }
            await attachMediaElementPlaybackSource(_0x2ea32e, _0x4c68bc[_0x33a70b], {
              'playbackUrl': _0x108ba6,
              'preload': _0x370a5d,
              'warmRanges': ![],
              'load': ![],
              'shouldAssign': _0x2b6a36
            });
            if (!_0x2b6a36()) {
              return;
            }
            this["_restorePreviewHoverPlaybackTime"](_0x2ea32e, _0x4c68bc[_0x33a70b]);
          }
          _0x2ea32e["autoplay"] = ![];
          _0x2ea32e["loop"] = ![];
          _0x2ea32e["muted"] = !![];
          _0x2ea32e["playsInline"] = !![];
          _0x2ea32e["preload"] = _0x536307 ? _0x370a5d : 'none';
          _0x2ea32e["draggable"] = ![];
          _0x2ea32e["addEventListener"]("dragstart", _0x231062 => _0x231062["preventDefault"]());
          _0x2ea32e["classList"]["add"]("v2-media-preview", "ai-video-result-layer");
          this["_attachPreviewVideoRecovery"](_0x2ea32e, "preview");
          const _0x16d7f0 = () => {
            const _0x5e6870 = _0x5d8529["getState"]()["nodes"][this["nodeId"]] || this["_data"] || {};
            const _0x53132d = Number(_0x5e6870['mainVideoIndex']) || 0x0;
            const _0x47981b = Math["max"](0x0, Math["trunc"](_0x53132d));
            return _0x33a70b === _0x47981b;
          };
          const _0x41032a = (_0x3deda1, _0x3ef066, _0x287ceb) => {
            const _0x1b449f = _0x5d8529["getState"]()["nodes"][this["nodeId"]];
            if (!_0x1b449f) {
              return;
            }
            const _0x2775e3 = Array['isArray'](_0x1b449f["videos"]) ? _0x1b449f['videos'] : [];
            const _0x5b8593 = _0x2775e3[_0x33a70b] || null;
            if (!_0x5b8593 || typeof _0x5b8593 !== "object") {
              return;
            }
            const _0x204301 = {
              ..._0x5b8593
            };
            let _0x56d751 = ![];
            _0x3deda1 > 0x0 && Number(_0x204301["videoWidth"] || 0x0) !== _0x3deda1 && (_0x204301["videoWidth"] = _0x3deda1, _0x56d751 = !![]);
            _0x3ef066 > 0x0 && Number(_0x204301['videoHeight'] || 0x0) !== _0x3ef066 && (_0x204301["videoHeight"] = _0x3ef066, _0x56d751 = !![]);
            Number["isFinite"](_0x287ceb) && _0x287ceb > 0x0 && Number(_0x204301["duration"] || 0x0) !== _0x287ceb && (_0x204301["duration"] = _0x287ceb, _0x56d751 = !![]);
            if (!_0x56d751) {
              return;
            }
            const _0x5831ca = _0x2775e3["slice"]();
            _0x5831ca[_0x33a70b] = _0x204301;
            const _0x1d3ad5 = {
              'videos': _0x5831ca
            };
            if (_0x16d7f0()) {
              if (_0x3deda1 > 0x0 && Number(_0x1b449f["videoWidth"] || 0x0) !== _0x3deda1) {
                _0x1d3ad5["videoWidth"] = _0x3deda1;
              }
              if (_0x3ef066 > 0x0 && Number(_0x1b449f["videoHeight"] || 0x0) !== _0x3ef066) {
                _0x1d3ad5['videoHeight'] = _0x3ef066;
              }
              if (_0x3deda1 > 0x0 && Number(_0x1b449f['selectedVideoWidth'] || 0x0) !== _0x3deda1) {
                _0x1d3ad5["selectedVideoWidth"] = _0x3deda1;
              }
              if (_0x3ef066 > 0x0 && Number(_0x1b449f["selectedVideoHeight"] || 0x0) !== _0x3ef066) {
                _0x1d3ad5['selectedVideoHeight'] = _0x3ef066;
              }
              if (Number["isFinite"](_0x287ceb) && _0x287ceb > 0x0 && Number(_0x1b449f["videoDuration"] || 0x0) !== _0x287ceb) {
                _0x1d3ad5["videoDuration"] = _0x287ceb;
              }
              Object["assign"](_0x1d3ad5, this["_buildRhAiAppVideoResultDisplayPatch"](_0x1b449f, _0x3deda1, _0x3ef066, getVideoResultMediaKey(_0x204301, _0x1b449f)));
            }
            _0x5d8529["updateNodeData"](this["nodeId"], _0x1d3ad5);
          };
          _0x2ea32e["addEventListener"]('loadedmetadata', () => {
            this["_clearVideoUnavailable"](_0x33a70b, _0x14423f[_0x33a70b]);
            const _0x1034a0 = _0x2ea32e["videoWidth"] || 0x0;
            const _0x2203a8 = _0x2ea32e["videoHeight"] || 0x0;
            const _0x235a14 = Number(_0x2ea32e["duration"]);
            _0x41032a(_0x1034a0, _0x2203a8, _0x235a14);
            if (_0x16d7f0()) {
              this["_syncVideoControlsFromVideo"](_0x2ea32e);
            }
          });
          _0x2ea32e['addEventListener']("error", () => {
            const _0x157e4c = _0x5d8529["getState"]()['nodes'][this["nodeId"]] || this["_data"] || {};
            const _0x2e437a = Array["isArray"](_0x157e4c['videos']) ? _0x157e4c["videos"] : [];
            const _0x42e950 = _0x2e437a[_0x33a70b] || _0x14423f[_0x33a70b] || {};
            const _0x2bb52 = Number(_0x157e4c["mainVideoIndex"]);
            const _0x2dd346 = Number["isFinite"](_0x2bb52) ? Math["max"](0x0, Math["trunc"](_0x2bb52)) : 0x0;
            if (_0x33a70b === _0x2dd346) {
              _0x2ea32e["removeAttribute"]("poster");
              _0x2ea32e['removeAttribute']("src");
              try {
                _0x2ea32e["load"]?.();
              } catch {}
              setVideoResultElementVisible(this["_placeholderEl"], !![]);
              this["_setVideoOverlaysVisible"](![]);
              this["_hideCenterIndicator"]();
              this['_syncVideoControlsFromVideo'](null);
            }
            this['_markVideoUnavailable'](_0x33a70b, _0x42e950);
          });
          _0x2ea32e["addEventListener"]('timeupdate', () => {
            _0x16d7f0() && (this["_clearPreviewPosterForVisibleFrame"](_0x2ea32e), this['_syncVideoControlsFromVideo'](_0x2ea32e));
          });
          const _0x5c9a1d = () => {
            if (_0x16d7f0()) {
              this["_clearPreviewPosterForVisibleFrame"](_0x2ea32e);
            }
          };
          _0x2ea32e["addEventListener"]("loadeddata", _0x5c9a1d);
          _0x2ea32e['addEventListener']('canplay', _0x5c9a1d);
          _0x2ea32e["addEventListener"]("playing", _0x5c9a1d);
          _0x2ea32e["addEventListener"]("pause", () => {
            _0x16d7f0() && (this["_showPausedCenterIndicator"](), this["_syncVideoControlsFromVideo"](_0x2ea32e));
          });
          _0x2ea32e["addEventListener"]('play', () => {
            _0x16d7f0() && (this['_hideCenterIndicator'](), this["_syncVideoControlsFromVideo"](_0x2ea32e));
          });
          _0x2ea32e['addEventListener']('ended', () => {
            if (_0x16d7f0()) {
              this["_handlePreviewVideoEnded"](_0x2ea32e);
            }
          });
          _0x2ea32e["addEventListener"]("click", _0x311552 => {
            const _0x20d637 = _0x5d8529["getState"]()["nodes"][this['nodeId']];
            if (_0x20d637["isVideosExpanded"]) {
              _0x311552['stopPropagation']();
              _0x467609(this['_lastMainIdx'] || 0x0);
              return;
            }
            if (_0x311552['detail'] && _0x311552["detail"] > 0x1) {
              return;
            }
            _0x311552["stopPropagation"]();
            if (_0x538149['isActiveFor'](this["nodeId"])) {
              return;
            }
            if (this["_videoClickTimer"]) {
              clearTimeout(this["_videoClickTimer"]);
            }
            this["_videoClickTimer"] = setTimeout(() => {
              this['_videoClickTimer'] = null;
              const _0x57a37a = _0x5d8529["getState"]()["nodes"][this["nodeId"]];
              if (_0x57a37a?.["isVideosExpanded"]) {
                return;
              }
              if (_0x538149["isActiveFor"](this["nodeId"])) {
                return;
              }
              this['_toggleVideoPlayPause'](_0x2ea32e);
            }, 0xb4);
          });
          _0x2ea32e["addEventListener"]("dblclick", _0x340d30 => {
            _0x340d30["stopPropagation"]();
            if (_0x538149['isActiveFor'](this["nodeId"])) {
              return;
            }
            this['_videoClickTimer'] && (clearTimeout(this["_videoClickTimer"]), this["_videoClickTimer"] = null);
            const _0x11e1ef = this['_lastMainIdx'] || 0x0;
            const _0xf437bc = _0x5d8529["getState"]()["nodes"][this["nodeId"]];
            const _0x3b745c = _0xf437bc["videos"] || [];
            const _0x474c94 = _0x3b745c[_0x11e1ef] || _0x3b745c[0x0];
            void this['_openFullScreenFromVideo'](_0x474c94, _0x2ea32e);
          });
          this["_multiLayerEls"][_0x33a70b] = _0x2ea32e;
          _0x2ea32e["parentNode"] !== this["_multiStackWrap"] && this['_multiStackWrap']["appendChild"](_0x2ea32e);
        }
        _0x2df8ff && !_0x39cfbc && (this["_multiToggleBtn"] = document["createElement"]("div"), this['_multiToggleBtn']['className'] = "multi-toggle-btn", this["_multiToggleBtn"]["addEventListener"]("pointerdown", _0x20d038 => {
          if (_0x20d038["button"] !== 0x0) {
            return;
          }
          _0x20d038["preventDefault"]();
          _0x20d038["stopPropagation"]();
          const _0x3c482e = _0x5d8529["getState"]()["nodes"][this['nodeId']];
          const _0x59a765 = !!_0x3c482e["isVideosExpanded"];
          if (_0x59a765) {
            const _0x532992 = this['_root']['querySelectorAll'](".multi-flyout-panel > div");
            if (_0x532992['length'] > 0x0) {
              const _0x200e3f = this['previewEl']['offsetTop'];
              const _0x25b3ee = 0x0;
              const _0x255bfc = _0x200e3f;
              _0x532992["forEach"](_0x57d2a5 => {
                applyVideoResultGeometryAnimationStyle(_0x57d2a5, {
                  'transition': "all 0.35s cubic-bezier(0.6, -0.28, 0.735, 0.045)",
                  'opacity': '0',
                  'transform': 'scale(0.01)\x20rotate(-45deg)',
                  'filter': "blur(10px)",
                  'top': _0x255bfc + 'px',
                  'left': _0x25b3ee + 'px'
                });
              });
              setTimeout(() => {
                _0x5d8529["updateNodeData"](this["nodeId"], {
                  'isVideosExpanded': ![]
                });
              }, 0x15e);
            } else {
              _0x5d8529['updateNodeData'](this['nodeId'], {
                'isVideosExpanded': ![]
              });
            }
          } else {
            _0x5d8529['updateNodeData'](this["nodeId"], {
              'isVideosExpanded': !![]
            });
          }
        }), this["_multiToggleBtn"]['addEventListener']("mouseenter", () => _0x2862b5(this["_multiToggleBtn"], !![])), this["_multiToggleBtn"]["addEventListener"]("mouseleave", () => {
          const _0x2ea451 = _0x5d8529["getState"]()['nodes'][this["nodeId"]];
          _0x2862b5(this["_multiToggleBtn"], !!_0x2ea451["isVideosExpanded"]);
        }), this["_multiToggleBtn"]['addEventListener']('click', _0x2cdba8 => {
          _0x2cdba8["preventDefault"]();
          _0x2cdba8["stopPropagation"]();
        }), this["_multiStackWrap"]["appendChild"](this['_multiToggleBtn']));
        this["_multiStackWrap"]["parentNode"] !== this["_multiVideosContainer"] && this["_multiVideosContainer"]["appendChild"](this["_multiStackWrap"]);
      }
      for (const _0x33e542 of _0x1d1c76) {
        const _0x1b456f = _0x33e542['i'];
        const _0x640ed6 = String(_0x33e542['thumbId'] || '');
        if (!_0x640ed6 || this["_cachedVideoUrls"]["has"](_0x640ed6)) {
          continue;
        }
        this["_resolveCachedVideoObjectUrl"](_0x640ed6)["then"](_0x387ec8 => {
          if (Number(this["_videoRenderEpoch"] || 0x0) !== _0x5de942) {
            return;
          }
          if (!_0x387ec8 || !this["_isCachedVideoThumbIdCurrentForSlot"](_0x640ed6, _0x1b456f)) {
            return;
          }
          const _0x5c6656 = this["_multiLayerEls"]?.[_0x1b456f];
          if (!_0x5c6656 || !_0x5c6656["isConnected"]) {
            return;
          }
          if (!(_0x39ae9b || _0x1b456f === _0x3535f1)) {
            return;
          }
          _0x5c6656["src"] = _0x387ec8;
          try {
            _0x5c6656["load"]?.();
          } catch {}
          _0x1b456f === _0x3535f1 && this["_placeholderEl"] && isVideoResultElementVisible(this["_placeholderEl"]) && (setVideoResultElementVisible(this["_placeholderEl"], ![]), this['_setVideoOverlaysVisible'](!![]));
        })['catch'](() => {});
      }
      this["_multiToggleBtn"] && _0x2862b5(this["_multiToggleBtn"], _0x39ae9b);
      this['_applyMuteStateToPreviewVideos']();
      for (let _0x1e4766 = 0x0; _0x1e4766 < _0xccb66f; _0x1e4766++) {
        const _0xa8513b = _0x1e4766 === _0x4a7829;
        const _0x4232bf = this["_multiLayerEls"][_0x1e4766];
        const _0x498017 = this['_multiErrorEls'][_0x1e4766];
        if (_0x4232bf) {
          const _0x1cde22 = _0x4c68bc[_0x1e4766] || '';
          const _0x26e84c = _0x20edb1[_0x1e4766] || '';
          const _0x46057f = String(_0x4232bf["getAttribute"]("src") || '')['trim']();
          const _0x19d708 = _0xa8513b && _0x348e21;
          const _0x1dd27f = _0x19d708 ? _0x370a5d : "none";
          const _0x3edb4d = isVideoResultFrameReady(_0x4232bf, _0x1cde22);
          const _0x1907c2 = _0xa8513b && !_0x19d708 && _0x3edb4d && !!_0x46057f;
          const _0xd2bbf6 = this["_isPreviewPosterClearedForPlayback"](_0x4232bf);
          const _0x613267 = !!_0x26e84c && !_0xd2bbf6 && !_0x3edb4d;
          if (_0x613267 && _0x4232bf['poster'] !== _0x26e84c) {
            _0x4232bf["poster"] = _0x26e84c;
          } else {
            if ((!_0x26e84c || _0xd2bbf6 || _0x3edb4d) && _0x4232bf["poster"]) {
              _0x4232bf["removeAttribute"]("poster");
            }
          }
          if (_0x4232bf["preload"] !== _0x1dd27f) {
            _0x4232bf["preload"] = _0x1dd27f;
            if (_0x1dd27f === 'auto' && _0x46057f && _0x4232bf['paused'] && !this["_isHovered"] && !this["_isManualControl"] && Number(_0x4232bf['readyState'] || 0x0) < 0x2) {
              try {
                _0x4232bf['load']?.();
              } catch {}
            }
          }
          if (_0x19d708) {
            !_0xa8513b && _0x26e84c && !_0x1cde22 && _0x46057f && _0x4232bf["paused"] && !this["_isHovered"] && !this["_isManualControl"] && (_0x4232bf["removeAttribute"]("src"), _0x4232bf["load"]?.());
            if (_0x1cde22 && _0x46057f !== _0x1cde22 && !isMediaElementPlaybackSource(_0x4232bf, _0x1cde22)) {
              const _0x2c38ae = await this['_resolveLocalVideoPlaybackObjectUrl'](_0x1cde22, "ai-video:" + this["nodeId"] + ":slot:" + _0x1e4766);
              if (Number(this["_videoRenderEpoch"] || 0x0) !== _0x5de942) {
                return;
              }
              globalThis["window"]?.["__runtimeCompareMark"]?.("ai-video-playback:attach", {
                'nodeId': this["nodeId"],
                'slotIndex': _0x1e4766,
                'sourceUrl': _0x1cde22,
                'playbackUrl': _0x2c38ae
              });
              await attachMediaElementPlaybackSource(_0x4232bf, _0x1cde22, {
                'playbackUrl': _0x2c38ae,
                'preload': _0x1dd27f,
                'warmRanges': ![],
                'load': ![],
                'shouldAssign': _0x2b6a36,
                'onSourceAssigned': () => {
                  this['_clearPreviewPosterForVisibleFrame'](_0x4232bf);
                }
              });
              if (!_0x2b6a36()) {
                return;
              }
              this['_restorePreviewHoverPlaybackTime'](_0x4232bf, _0x1cde22);
              this["_clearPreviewPosterForVisibleFrame"](_0x4232bf);
            } else {
              if (!_0x1cde22 && !_0x46057f && !_0x26e84c) {
                const _0x3eefa8 = _0x14423f[_0x1e4766] || {};
                const _0x58a765 = String(_0x3eefa8["thumbId"] || '');
                if (_0x58a765 && (_0x39ae9b || _0x1e4766 === _0x3535f1)) {
                  if (this["_cachedVideoUrls"]["has"](_0x58a765)) {
                    _0x4232bf["src"] = this['_cachedVideoUrls']['get'](_0x58a765);
                  } else {
                    !_0x3442be["has"](_0x1e4766) && this["_resolveCachedVideoObjectUrl"](_0x58a765)["then"](_0x164233 => {
                      if (Number(this["_videoRenderEpoch"] || 0x0) !== _0x5de942) {
                        return;
                      }
                      if (!_0x164233 || !_0x4232bf['isConnected'] || this["_multiLayerEls"]?.[_0x1e4766] !== _0x4232bf || !this["_isCachedVideoThumbIdCurrentForSlot"](_0x58a765, _0x1e4766)) {
                        return;
                      }
                      _0x4232bf["src"] = _0x164233;
                      try {
                        _0x4232bf["load"]?.();
                      } catch {}
                      _0x1e4766 === _0x3535f1 && this["_placeholderEl"] && isVideoResultElementVisible(this["_placeholderEl"]) && (setVideoResultElementVisible(this["_placeholderEl"], ![]), this['_setVideoOverlaysVisible'](!_0x39ae9b));
                    })["catch"](() => {});
                  }
                }
              }
            }
            _0xa8513b && _0x1cde22 && isMediaElementPlaybackSource(_0x4232bf, _0x1cde22) && this["_clearPreviewPosterForVisibleFrame"](_0x4232bf);
          } else {
            _0x46057f && !_0x1907c2 && (_0x4232bf['removeAttribute']("src"), _0x4232bf["load"]?.());
          }
          setVideoResultLayerActive(_0x4232bf, _0xa8513b, _0xa8513b ? _0xccb66f + 0x1 : _0x1e4766);
        }
        _0x498017 && setVideoResultLayerActive(_0x498017, _0xa8513b, _0xa8513b ? _0xccb66f + 0x1 : _0x1e4766);
      }
      const _0x41e98a = this["_multiLayerEls"][_0x4a7829];
      if (_0x41e98a) {
        const _0x2c353f = _0x41e98a["videoWidth"] || 0x0;
        const _0x5bb312 = _0x41e98a["videoHeight"] || 0x0;
        const _0x4ba22e = Number(_0x41e98a["duration"]);
        const _0x503bf7 = _0x5d8529["getState"]()["nodes"][this['nodeId']];
        if (_0x503bf7) {
          const _0x517aab = {};
          if (_0x2c353f > 0x0 && Number(_0x503bf7['videoWidth'] || 0x0) !== _0x2c353f) {
            _0x517aab["videoWidth"] = _0x2c353f;
          }
          if (_0x5bb312 > 0x0 && Number(_0x503bf7['videoHeight'] || 0x0) !== _0x5bb312) {
            _0x517aab["videoHeight"] = _0x5bb312;
          }
          if (_0x2c353f > 0x0 && Number(_0x503bf7['selectedVideoWidth'] || 0x0) !== _0x2c353f) {
            _0x517aab['selectedVideoWidth'] = _0x2c353f;
          }
          if (_0x5bb312 > 0x0 && Number(_0x503bf7['selectedVideoHeight'] || 0x0) !== _0x5bb312) {
            _0x517aab["selectedVideoHeight"] = _0x5bb312;
          }
          if (Number['isFinite'](_0x4ba22e) && _0x4ba22e > 0x0 && Number(_0x503bf7["videoDuration"] || 0x0) !== _0x4ba22e) {
            _0x517aab["videoDuration"] = _0x4ba22e;
          }
          Object['assign'](_0x517aab, this['_buildRhAiAppVideoResultDisplayPatch'](_0x503bf7, _0x2c353f, _0x5bb312, getVideoResultMediaKey(_0x503bf7, _0x503bf7)));
          if (Object['keys'](_0x517aab)["length"]) {
            _0x5d8529['updateNodeData'](this['nodeId'], _0x517aab);
          }
        }
      }
      if (_0x41e98a && _0x41e98a['paused']) {
        this['_showPausedCenterIndicator']();
      } else {
        this["_hideCenterIndicator"]();
      }
      this["_syncVideoControlsFromVideo"](_0x41e98a || null);
      if (_0x39ae9b) {
        this["_root"]['classList']?.["add"]?.("is-video-result-expanded");
        if (!_0x3740a5) {
          return;
        }
        const _0x5f4530 = _0xccb66f <= 0x2 ? _0xccb66f : 0x2;
        const _0x4d3c1b = Math["ceil"](_0xccb66f / _0x5f4530);
        const _0x310e71 = 0xc;
        const _0x3d7f3f = this["previewEl"]['offsetWidth'];
        const _0x768365 = this["previewEl"]['offsetHeight'];
        const _0x534698 = this['previewEl']["offsetTop"];
        const _0x2257ad = _0x4d3c1b - 0x1;
        const _0x43566f = 0x0;
        const _0x53e3c5 = [];
        for (let _0x1bfe1e = 0x0; _0x1bfe1e < _0xccb66f; _0x1bfe1e++) {
          if (_0x1bfe1e !== _0x4a7829) {
            _0x53e3c5["push"]({
              'video': _0x14423f[_0x1bfe1e],
              'url': _0x4c68bc[_0x1bfe1e],
              'origIdx': _0x1bfe1e
            });
          }
        }
        this["_expandPanel"] && this['_expandPanel']['parentNode'] && this["_expandPanel"]["parentNode"]["removeChild"](this["_expandPanel"]);
        this["_expandPanel"] = document["createElement"]("div");
        this["_expandPanel"]["className"] = "multi-flyout-panel";
        const _0x595f3f = [];
        for (let _0x1f5469 = 0x0; _0x1f5469 < _0x4d3c1b; _0x1f5469++) {
          for (let _0x541472 = 0x0; _0x541472 < _0x5f4530; _0x541472++) {
            if (_0x1f5469 === _0x2257ad && _0x541472 === _0x43566f) {
              continue;
            }
            _0x595f3f["push"]({
              'r': _0x1f5469,
              'c': _0x541472
            });
          }
        }
        _0x4d3c1b === 0x2 && _0x5f4530 === 0x2 && (_0x595f3f["length"] = 0x0, _0x595f3f["push"]({
          'r': 0x1,
          'c': 0x1
        }), _0x595f3f["push"]({
          'r': 0x0,
          'c': 0x0
        }), _0x595f3f["push"]({
          'r': 0x0,
          'c': 0x1
        }));
        for (let _0x2e8255 = 0x0; _0x2e8255 < _0x53e3c5['length']; _0x2e8255++) {
          if (_0x2e8255 >= _0x595f3f['length']) {
            break;
          }
          const _0x9728be = _0x595f3f[_0x2e8255]['r'];
          const _0x114c70 = _0x595f3f[_0x2e8255]['c'];
          const {
            video: _0x10c57c,
            url: _0x4bc940,
            origIdx: _0x4ad1e9
          } = _0x53e3c5[_0x2e8255];
          const _0xbc9930 = _0x534698 + (_0x9728be - _0x2257ad) * (_0x768365 + _0x310e71);
          const _0x374768 = _0x114c70 * (_0x3d7f3f + _0x310e71);
          const _0x4b7e87 = _0x534698;
          const _0x4bde66 = 0x0;
          const _0x53c47f = document['createElement']("div");
          _0x53c47f['className'] = 'ai-video-expanded-result-cell';
          applyVideoResultGeometryAnimationStyle(_0x53c47f, {
            'top': _0x4b7e87 + 'px',
            'left': _0x4bde66 + 'px',
            'width': _0x3d7f3f + 'px',
            'height': _0x768365 + 'px',
            'opacity': '0',
            'transform': "scale(0.2) rotate(-30deg)",
            'filter': 'blur(8px)',
            'zIndex': String(0x2ee0 - _0x2e8255)
          });
          requestAnimationFrame(() => {
            setTimeout(() => {
              applyVideoResultGeometryAnimationStyle(_0x53c47f, {
                'opacity': '1',
                'top': _0xbc9930 + 'px',
                'left': _0x374768 + 'px',
                'transform': "scale(1) rotate(0deg)",
                'filter': "blur(0px)"
              });
            }, _0x2e8255 * 0x3c);
          });
          if (_0x10c57c["error"]) {
            const _0x308720 = this["_createErrorCard"](_0x10c57c["error"]);
            _0x53c47f['appendChild'](_0x308720);
          } else {
            const _0x4b84c3 = document["createElement"]("video");
            _0x4b84c3["className"] = "ai-video-expanded-result-video";
            _0x4b84c3["dataset"]["idx"] = String(_0x4ad1e9);
            _0x4b84c3["autoplay"] = ![];
            _0x4b84c3["loop"] = ![];
            _0x4b84c3['muted'] = !![];
            _0x4b84c3["playsInline"] = !![];
            const _0x5b34bb = _0x20edb1[_0x4ad1e9] || '';
            if (_0x5b34bb) {
              _0x4b84c3["poster"] = _0x5b34bb;
            }
            _0x4b84c3['preload'] = _0x4bc940 ? "auto" : "none";
            if (_0x4bc940) {
              _0x4b84c3["src"] = _0x4bc940;
            }
            attachVideoPlaybackRecovery(_0x4b84c3, {
              'label': "ai-video:" + this["nodeId"] + ':expanded:' + _0x4ad1e9,
              'ensureSrc': () => this["_ensureVideoSrcFor"](_0x4b84c3, {
                'forPlayback': !![]
              }),
              'shouldRecover': () => _0x4b84c3["isConnected"] !== ![] && !_0x4b84c3['paused']
            });
            _0x53c47f["appendChild"](_0x4b84c3);
            !_0x4bc940 && !_0x5b34bb && String(_0x10c57c?.['thumbId'] || '')["trim"]() && void this["_ensureVideoSrcFor"](_0x4b84c3, {
              'forPlayback': !![]
            });
          }
          const _0x46de9a = _0x19de3b => {
            if (_0x19de3b['type'] === 'pointerdown' && _0x19de3b["button"] !== 0x0) {
              return;
            }
            _0x19de3b['preventDefault']();
            _0x19de3b["stopPropagation"]();
            _0x467609(_0x4ad1e9);
          };
          _0x53c47f["addEventListener"]('pointerdown', _0x46de9a);
          _0x53c47f["addEventListener"]("click", _0x46de9a);
          _0x53c47f["addEventListener"]("dblclick", _0x216f58 => {
            _0x216f58["preventDefault"]();
            _0x216f58["stopPropagation"]();
          });
          this["_expandPanel"]["appendChild"](_0x53c47f);
        }
        this["_root"]["appendChild"](this['_expandPanel']);
      } else {
        this["_root"]['classList']?.["remove"]?.("is-video-result-expanded");
        this["_expandPanel"] && this["_expandPanel"]["parentNode"] && (this['_expandPanel']["parentNode"]["removeChild"](this["_expandPanel"]), this['_expandPanel'] = null);
      }
    }
    ["hydrateRendererThinVideoPresentation"]() {
      if (this["_rendererThinVideoHydration"] !== !![]) {
        return ![];
      }
      this['_rendererThinVideoHydration'] = ![];
      return this["_loadAndDisplayVideo"]();
    }
    ["_resolveVideoDataPlaybackUrl"](_0x5daada) {
      if (!_0x5daada) {
        return '';
      }
      return this["_resolveMediaUrl"](localPathToUrl(_0x5daada["displayLocalPath"])) || this["_resolveMediaUrl"](localPathToUrl(_0x5daada['localPath'])) || this["_resolveMediaUrl"](_0x5daada['videoUrl']) || '';
    }
    async ["_openFullScreenFromVideo"](_0x25fccf, _0x21d8a5 = null) {
      try {
        this['_activeFullscreenCleanup']?.();
      } catch {}
      this["_activeFullscreenCleanup"] = null;
      this["_activeFullscreenVideoEl"] = null;
      this["_activeFullscreenResultIdentity"] = '';
      const _0x49def0 = Number(this["_fullscreenOpenEpoch"] || 0x0) + 0x1;
      this["_fullscreenOpenEpoch"] = _0x49def0;
      const _0x2fada1 = () => Number(this["_fullscreenOpenEpoch"] || 0x0) === _0x49def0;
      const _0x342f51 = this["_getVideoResultIdentityKey"](_0x25fccf);
      this['_pendingFullscreenResultIdentity'] = _0x342f51;
      const _0x3d596e = () => {
        _0x2fada1() && this['_pendingFullscreenResultIdentity'] === _0x342f51 && (this["_pendingFullscreenResultIdentity"] = '');
      };
      const _0x4d0bb3 = document["createElement"]("div");
      _0x4d0bb3['className'] = "ai-video-fullscreen-overlay";
      const _0xb88ac7 = getVideoCurrentSource(_0x21d8a5);
      const _0x4be03f = this["_isManualLoopPlayback"] === !![];
      if (_0x21d8a5 && _0xb88ac7) {
        const _0x927a09 = _0x21d8a5['parentNode'];
        const _0x524c2b = _0x21d8a5['nextSibling'];
        const _0xa42d94 = this["_isManualControl"];
        const _0x5404b2 = this["_hoverManualPause"];
        const _0x22c98a = {
          'controls': _0x21d8a5["controls"],
          'loop': _0x21d8a5["loop"],
          'muted': _0x21d8a5["muted"],
          'position': _0x21d8a5["style"]['position'],
          'top': _0x21d8a5['style']["top"],
          'left': _0x21d8a5["style"]["left"],
          'width': _0x21d8a5["style"]['width'],
          'height': _0x21d8a5['style']["height"],
          'maxWidth': _0x21d8a5["style"]["maxWidth"],
          'maxHeight': _0x21d8a5['style']['maxHeight'],
          'objectFit': _0x21d8a5["style"]["objectFit"],
          'borderRadius': _0x21d8a5["style"]['borderRadius'],
          'pointerEvents': _0x21d8a5["style"]["pointerEvents"],
          'transform': _0x21d8a5['style']["transform"],
          'opacity': _0x21d8a5["style"]["opacity"],
          'zIndex': _0x21d8a5["style"]["zIndex"],
          'boxShadow': _0x21d8a5["style"]["boxShadow"]
        };
        this["_isManualControl"] = !![];
        this["_hoverManualPause"] = ![];
        _0x21d8a5["controls"] = !![];
        _0x21d8a5['loop'] = _0x4be03f;
        _0x21d8a5["muted"] = !!this["_isMuted"];
        _0x21d8a5["classList"]?.['add']?.("ai-video-fullscreen-source");
        applyVideoResultGeometryAnimationStyle(_0x21d8a5, {
          'position': "static",
          'top': '',
          'left': '',
          'width': "auto",
          'height': "auto",
          'maxWidth': "90%",
          'maxHeight': "90%",
          'objectFit': "contain",
          'borderRadius': "8px",
          'pointerEvents': "auto",
          'transform': "none",
          'opacity': '1',
          'zIndex': '',
          'boxShadow': "0 0 50px var(--black-95)"
        });
        attachVideoPlaybackRecovery(_0x21d8a5, {
          'label': 'ai-video:' + this['nodeId'] + ":fullscreen",
          'minBufferAhead': 0.5,
          'readyTimeoutMs': 0x15e,
          'recoveryDebounceMs': 0x96,
          'recoveryCooldownMs': 0x1f4,
          'shouldRecover': () => _0x21d8a5["isConnected"] !== ![] && !_0x21d8a5["paused"]
        });
        let _0x531bed = ![];
        const _0x285217 = () => {
          if (_0x531bed) {
            return;
          }
          _0x531bed = !![];
          document["removeEventListener"]?.("keydown", _0x312ee7, !![]);
          try {
            try {
              _0x21d8a5["pause"]();
            } catch {}
            _0x21d8a5['controls'] = _0x22c98a["controls"];
            _0x21d8a5["loop"] = _0x22c98a["loop"];
            _0x21d8a5["muted"] = _0x22c98a["muted"];
            _0x21d8a5["classList"]?.['remove']?.("ai-video-fullscreen-source");
            applyVideoResultGeometryAnimationStyle(_0x21d8a5, {
              'position': _0x22c98a["position"],
              'top': _0x22c98a['top'],
              'left': _0x22c98a["left"],
              'width': _0x22c98a["width"],
              'height': _0x22c98a["height"],
              'maxWidth': _0x22c98a['maxWidth'],
              'maxHeight': _0x22c98a["maxHeight"],
              'objectFit': _0x22c98a["objectFit"],
              'borderRadius': _0x22c98a["borderRadius"],
              'pointerEvents': _0x22c98a["pointerEvents"],
              'transform': _0x22c98a["transform"],
              'opacity': _0x22c98a["opacity"],
              'zIndex': _0x22c98a["zIndex"],
              'boxShadow': _0x22c98a['boxShadow']
            });
          } catch {}
          if (_0x927a09) {
            const _0x21ffff = _0x524c2b?.["parentNode"] === _0x927a09 ? _0x524c2b : null;
            try {
              _0x927a09["insertBefore"](_0x21d8a5, _0x21ffff);
            } catch {
              try {
                _0x927a09["appendChild"](_0x21d8a5);
              } catch {}
            }
          }
          try {
            _0x4d0bb3["remove"]();
          } catch {}
          this["_isManualControl"] = _0xa42d94;
          this["_hoverManualPause"] = _0x5404b2;
          this["_activeFullscreenCleanup"] === _0x285217 && (this['_activeFullscreenCleanup'] = null, this["_activeFullscreenVideoEl"] = null, this["_activeFullscreenResultIdentity"] = '');
          try {
            this["_attachPreviewVideoRecovery"](_0x21d8a5, "preview");
          } catch {}
        };
        const _0x312ee7 = _0x175996 => {
          if (_0x175996?.['key'] !== "Escape") {
            return;
          }
          _0x175996["preventDefault"]?.();
          _0x175996['stopPropagation']?.();
          _0x285217();
        };
        _0x4d0bb3["addEventListener"]("click", _0xeec00c => {
          if (_0xeec00c['target'] === _0x4d0bb3) {
            _0x285217();
          }
        });
        _0x4d0bb3["appendChild"](_0x21d8a5);
        document["body"]["appendChild"](_0x4d0bb3);
        document["addEventListener"]?.("keydown", _0x312ee7, !![]);
        this["_activeFullscreenCleanup"] = _0x285217;
        this['_activeFullscreenVideoEl'] = _0x21d8a5;
        this["_activeFullscreenResultIdentity"] = _0x342f51;
        _0x3d596e();
        void playVideoWithRecovery(_0x21d8a5, {
          'label': 'ai-video:' + this['nodeId'] + ':fullscreen',
          'minBufferAhead': 0.5,
          'readyTimeoutMs': 0x15e,
          'recoveryDebounceMs': 0x96,
          'recoveryCooldownMs': 0x1f4,
          'shouldRecover': () => _0x21d8a5['isConnected'] !== ![] && !_0x21d8a5["paused"]
        });
        return;
      }
      const _0x3934e9 = document["createElement"]("video");
      let _0x1df040 = '';
      let _0x222ec2 = ![];
      const _0x57ce66 = this['_resolveVideoDataPlaybackUrl'](_0x25fccf);
      const _0x1ba967 = String(_0x25fccf?.["thumbId"] || '');
      const _0x4d5313 = Number(_0x21d8a5?.['currentTime'] || 0x0);
      const _0x57c05f = () => {
        if (!(_0x4d5313 > 0x0)) {
          return;
        }
        const _0x5aa648 = Number(_0x3934e9["duration"]);
        const _0x503e6f = Number["isFinite"](_0x5aa648) && _0x5aa648 > 0x0 ? Math["min"](_0x4d5313, Math["max"](0x0, _0x5aa648 - 0.05)) : _0x4d5313;
        try {
          _0x3934e9["currentTime"] = _0x503e6f;
        } catch {}
      };
      _0x3934e9["addEventListener"]('loadedmetadata', _0x57c05f, {
        'once': !![]
      });
      const _0x1acad4 = _0xb88ac7 || _0x57ce66;
      if (_0x1acad4) {
        try {
          await attachMediaElementPlaybackSource(_0x3934e9, _0x1acad4, {
            'preload': "auto",
            'warmRanges': ![],
            'load': ![],
            'shouldAssign': _0x2fada1
          });
        } catch {
          _0x3d596e();
          return;
        }
        if (!_0x2fada1()) {
          clearDesktopMediaPlaybackSourceMetadata(_0x3934e9);
          _0x3934e9["removeAttribute"]?.("src");
          try {
            _0x3934e9["load"]?.();
          } catch {}
          return;
        }
      } else {
        _0x1ba967 && _0x1e73af(_0x1ba967)["then"](_0x2b571b => {
          if (!_0x2b571b || _0x222ec2 || !_0x2fada1() || _0x3934e9["isConnected"] === ![]) {
            return;
          }
          const _0x49794e = createTrackedMediaObjectUrl(_0x2b571b, {
            'kind': "video",
            'ownerId': "ai-video:" + this["nodeId"] + ":fullscreen",
            'sourceUrl': _0x1ba967
          });
          if (!_0x49794e) {
            return;
          }
          if (_0x222ec2 || !_0x2fada1() || _0x3934e9["isConnected"] === ![]) {
            revokeTrackedMediaObjectUrl(_0x49794e);
            return;
          }
          _0x1df040 = _0x49794e;
          _0x3934e9["src"] = _0x1df040;
          _0x57c05f();
          void playVideoWithRecovery(_0x3934e9, {
            'label': 'ai-video:' + this["nodeId"] + ":fullscreen",
            'minBufferAhead': 0.5,
            'readyTimeoutMs': 0x15e,
            'recoveryDebounceMs': 0x96,
            'recoveryCooldownMs': 0x1f4,
            'shouldRecover': () => _0x3934e9["isConnected"] !== ![] && !_0x3934e9['paused']
          });
        })['catch'](() => {});
      }
      attachVideoPlaybackRecovery(_0x3934e9, {
        'label': "ai-video:" + this['nodeId'] + ':fullscreen',
        'minBufferAhead': 0.5,
        'readyTimeoutMs': 0x15e,
        'recoveryDebounceMs': 0x96,
        'recoveryCooldownMs': 0x1f4,
        'shouldRecover': () => _0x3934e9["isConnected"] !== ![] && !_0x3934e9["paused"]
      });
      _0x3934e9["preload"] = "auto";
      _0x3934e9["controls"] = !![];
      _0x3934e9["autoplay"] = !![];
      _0x3934e9["loop"] = _0x4be03f;
      _0x3934e9["muted"] = !!this["_isMuted"];
      _0x3934e9["className"] = "ai-video-fullscreen-video";
      if (!_0x2fada1()) {
        return;
      }
      _0x4d0bb3["appendChild"](_0x3934e9);
      const _0xc23011 = () => {
        if (_0x222ec2) {
          return;
        }
        _0x222ec2 = !![];
        document["removeEventListener"]?.("keydown", _0x16f95, !![]);
        try {
          _0x3934e9["pause"]();
        } catch {}
        detachVideoPlaybackRecovery(_0x3934e9);
        clearDesktopMediaPlaybackSourceMetadata(_0x3934e9);
        _0x3934e9["removeAttribute"]?.('src');
        try {
          _0x3934e9["load"]?.();
        } catch {}
        _0x4d0bb3["remove"]();
        _0x1df040 && (revokeTrackedMediaObjectUrl(_0x1df040), _0x1df040 = '');
        this["_activeFullscreenCleanup"] === _0xc23011 && (this['_activeFullscreenCleanup'] = null, this['_activeFullscreenVideoEl'] = null, this["_activeFullscreenResultIdentity"] = '');
      };
      const _0x16f95 = _0x7f401e => {
        if (_0x7f401e?.["key"] !== "Escape") {
          return;
        }
        _0x7f401e["preventDefault"]?.();
        _0x7f401e["stopPropagation"]?.();
        _0xc23011();
      };
      _0x4d0bb3["addEventListener"]("click", _0xbb6b34 => {
        if (_0xbb6b34["target"] === _0x4d0bb3) {
          _0xc23011();
        }
      });
      document["body"]["appendChild"](_0x4d0bb3);
      document["addEventListener"]?.("keydown", _0x16f95, !![]);
      this["_activeFullscreenCleanup"] = _0xc23011;
      this["_activeFullscreenVideoEl"] = _0x3934e9;
      this["_activeFullscreenResultIdentity"] = _0x342f51;
      _0x3d596e();
      _0x1acad4 && void playVideoWithRecovery(_0x3934e9, {
        'label': 'ai-video:' + this["nodeId"] + ":fullscreen",
        'minBufferAhead': 0.5,
        'readyTimeoutMs': 0x15e,
        'recoveryDebounceMs': 0x96,
        'recoveryCooldownMs': 0x1f4,
        'shouldRecover': () => _0x3934e9['isConnected'] !== ![] && !_0x3934e9['paused']
      });
    }
  }
  return _0x1f8e5a["prototype"];
}