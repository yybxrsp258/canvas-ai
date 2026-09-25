import a517_0x501c15 from '../core/stores/appStore.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { resumeAsyncVideoTask, resumeRunningHubVideoTask } from '../../api/aiVideoApi.js';
import { ensureConfig, getProviderConfig } from '../../api/configApi.js';
import { fetchVideoMetaFromServer } from '../../api/videoMetaApi.js';
import { desktopBridge } from '../services/desktopBridge.js';
import { fetchVideoFirstFrameThumbFromServer } from '../../api/videoThumbApi.js';
import { fetchRemoteBlob, saveOutputFromUrlToServer, saveOutputToServer } from '../../api/projectsV2Api.js';
import { resumeRunninghubWorkflowTask } from '../../api/runninghubWorkflowApi.js';
import { discardLocalStagedAsset, importLocalStagedAsset, uploadFile } from '../modules/project.js';
import { startLoading, stopLoading } from '../modules/loadingOverlay.js';
import a517_0x34b728 from '../modules/VideoKeyingController.js';
import { commit } from '../modules/history.js';
import { startNodeResizePreview } from '../modules/interaction/nodeResizePreview.js';
import { VIDEO_TOOLBAR_HTML, bindVideoToolbarEvents } from './NodeToolbarConfig.js';
import { registerStaticInnerHTML, setStaticInnerHTML } from '../utils/dom.js';
import { CANVAS_VIDEO_IMPORT_MAX_BYTES, CANVAS_VIDEO_IMPORT_MAX_MB, buildSourceMediaNodePayload, getAutoMediaSizeByShortSide } from '../services/fileService.js';
import { buildCanvasVideoProxyPromotionPatch, buildCanvasLocalVideoFields, resolveCanvasVideoUrl } from '../services/canvasMediaLocalService.js';
import { requestVisibleVideoProxyMigration } from '../services/mediaTaskService.js';
import { isTaskTerminal, resolveGenerationUiState, shouldShowGenerationResultLoadingUi } from '../core/generationTaskUiState.js';
import { resumeTask } from '../core/generationTaskRuntime.js';
import { extractCurrentVideoFrameToImageNode } from '../modules/videoFrameExtraction.js';
import { attachVideoPlaybackRecovery, detachVideoPlaybackRecovery, getVideoCurrentSource, logVideoPlaybackEvent } from './video-node/mediaPlaybackRecovery.js';
import { attachMediaElementPlaybackSource, clearDesktopMediaPlaybackSourceMetadata, isMediaElementPlaybackSource } from '../services/desktopMediaBlobSource.js';
import { localPathToUrl, pickResultLocalPath, urlToLocalPath } from '../utils/localMediaPath.js';
import { getVideoSourceKey } from '../modules/modelInputPolicy.js';
import { buildVideoMutedPatch, readVideoAudioDefaultEnabledFromStore, resolveVideoMutedPreference } from './video-node/videoMuteState.js';
import { createHoverVideoPlaybackLifecycle, isExternallyOwnedVideoPlayback, shouldKeepManualPlaybackPresentationActive, shouldTakeOverActiveHoverPlayback } from './shared/hoverVideoPlaybackLifecycle.js';
import { startMediaProgressDragSession } from './shared/mediaProgressDragSession.js';
import { deactivateSourceVideoHoverPlayback, releaseIdleSourceVideoHoverPlaybackMedia, shouldActivateSourceVideoHoverPlayback, syncSourceVideoPlaybackChromeVisibility } from './source-video/sourceVideoHoverPlayback.js';
import { setSourceVideoManualLoopPlayback, toggleSourceVideoManualPlayback } from './source-video/sourceVideoManualPlayback.js';
import { isCanvasImagePreloadRecentlyResolved, preloadCanvasImage } from '../modules/canvasMediaScheduler.js';
import { shouldDeferRendererDetailsOnMount, shouldDeferRendererMediaOnMount, shouldPrebuildRendererRuntimeOffscreen } from '../core/rendererDeferredMedia.js';
import { hasPresentedVideoFrame, resetVideoFramePresentation, watchVideoFramePresentation } from '../services/videoFramePresentation.js';
import { hasReportedSourceVideoMediaSlotFrame, reportSourceVideoMediaSlotFrameOnce, scheduleSourceVideoFramePresentationCommit } from './video-node/sourceVideoFramePresentationBatch.js';
import { acquireLocalVideoPlaybackObjectUrlResult, releaseLocalVideoPlaybackObjectUrlOwner } from '../services/localVideoPlaybackObjectUrlService.js';
import { revokeTrackedMediaObjectUrl } from '../services/mediaObjectUrlRegistry.js';
import { createVideoNodeUpdatePerf } from './video-node/videoNodeUpdatePerf.js';
import { createVideoGenerationErrorCard } from './video-node/videoGenerationErrorCard.js';
import { openSourceVideoFullscreenPreview } from './video-node/sourceVideoFullscreenPreview.js';
import { hasSourceVideoRecoveryWork, isClientFetchableMediaUrl, isDesktopRenderer, isSourceVideoInteractionBusy, scheduleSourceVideoIdleTask, shouldFetchVideoMetaForNodeInfo, sourceVideoText } from './source-video/sourceVideoRuntime.js';
import { buildSourceVideoUploadSizePatch, createVideoCapturePreviewUrl, readVideoFileNaturalSize, waitForNextPaint } from './source-video/sourceVideoUploadMedia.js';
import { buildRunningHubVideoTerminalStatePatch, buildSourceVideoRecoveryFailurePatch, getVideoMattingModelId, isRunningHubVideoTask, resolveRunningHubVideoStatusName, resolveSourceVideoGenerationFailureMessage } from './source-video/sourceVideoTaskState.js';
import { resolveSourceVideoMediaTaskSrc, resolveSourceVideoPosterSrc } from './source-video/sourceVideoMediaState.js';
import { clearSourceVideoPlaybackFeedback, playSourceVideoWithFeedback } from './source-video/sourceVideoPlaybackFeedback.js';
export { buildSourceVideoUploadSizePatch, resolveSourceVideoGenerationFailureMessage, resolveSourceVideoMediaTaskSrc, resolveSourceVideoPosterSrc };
const SOURCE_VIDEO_MIN_SIZE = 0x96;
const SOURCE_VIDEO_POSTER_PRELOAD = "metadata";
const SOURCE_VIDEO_POSTER_PRELOAD_PRIORITY = 0x37;
const SOURCE_VIDEO_RENDER_PIN_REASON = "source-video:playback";
const SOURCE_VIDEO_LOCAL_BLOB_MAX_BYTES = 0x40 * 0x400 * 0x400;
const SOURCE_VIDEO_LOCAL_BLOB_FETCH_TIMEOUT_MS = 0x384;
const SOURCE_VIDEO_CANONICAL_IMPORT_RETRY_MS = 0x2710;
const _SOURCE_VIDEO_NODE_TEMPLATE_ID = "node:source-video";
registerStaticInnerHTML(_SOURCE_VIDEO_NODE_TEMPLATE_ID, VIDEO_TOOLBAR_HTML + "\n        <div class=\"node-card media-card video-card\" style=\"width: 100%; height: 100%; padding: 0; background: var(--white-05); border: 1px solid var(--video-node-surface-border-color, var(--stroke-08)); border-radius: 18px; overflow: hidden; position: relative; display: flex; align-items: stretch; pointer-events: auto; cursor: var(--link-cursor);\">\n        <img class=\"source-video-poster-frame\" alt=\"\" draggable=\"false\">\n\n        <div class=\"video-center-indicator\">\n          <div class=\"indicator-inner\">\n          </div>\n        </div>\n\n        <div class=\"node-upload-hint source-upload-hint\">\n          <button type=\"button\" class=\"upload-btn source-upload-btn\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"17 8 12 3 7 8\"/><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"15\"/></svg>\n            <span class=\"source-upload-label\"></span>\n          </button>\n        </div>\n\n        <div class=\"video-controls\">\n          <button type=\"button\" class=\"video-play-btn\">\n            <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg>\n          </button>\n          <span class=\"video-time-current\">0:00</span>\n          <div class=\"media-progress-bar\">\n             <div class=\"media-progress-fill\">\n                <div class=\"media-progress-knob\"></div>\n             </div>\n          </div>\n          <span class=\"video-time-total\">0:00</span>\n          <button type=\"button\" class=\"video-mute-btn\">\n            <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" class=\"icon-unmuted\" style=\"display:none;\"><polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"></polygon><path d=\"M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07\"></path></svg>\n            <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" class=\"icon-muted\"><polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"></polygon><line x1=\"23\" y1=\"1\" x2=\"1\" y2=\"23\"></line><line x1=\"15.54\" y1=\"8.46\" x2=\"19.07\" y2=\"12\"></line></svg>\n          </button>\n          <button type=\"button\" class=\"video-snap-btn\">\n            <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z\"></path><circle cx=\"12\" cy=\"13\" r=\"4\"></circle></svg>\n          </button>\n        </div>\n        <div class=\"node-port out-port\"></div>\n        <div class=\"node-resizer\"></div>\n      </div>");
export class SourceVideoNode {
  constructor(_0x452b10) {
    this["_data"] = _0x452b10;
    this['el'] = document["createElement"]('div');
    this['id'] = _0x452b10['id'];
    this['el']["className"] = "v2-node-component source-video-node-component";
    this["_currentSrc"] = null;
    this["_rendererMediaSlotToken"] = null;
    this["_objUrl"] = null;
    this["_objUrlSource"] = '';
    this["_playbackBlobFetchController"] = null;
    this["_playbackSourcePromise"] = null;
    this['_playbackSourcePromiseSource'] = '';
    this["_playbackSourceToken"] = 0x0;
    this['_pendingPlaybackSource'] = '';
    this["_hasPendingPlaybackSource"] = ![];
    this["_playbackResumeGeneration"] = 0x0;
    this['_pendingPlaybackResume'] = null;
    this["_isMuted"] = resolveVideoMutedPreference(_0x452b10, {
      'videoAudioDefaultEnabled': readVideoAudioDefaultEnabledFromStore(a517_0x501c15)
    });
    this["_isManualControl"] = ![];
    this["_isHovered"] = ![];
    this['_hoverManualPause'] = ![];
    this["_isManualLoopPlayback"] = ![];
    this["_autoPlayToken"] = 0x0;
    this["_seekToken"] = 0x0;
    this["_isSeeking"] = ![];
    this["_progressDragSession"] = null;
    this["_clickTimer"] = null;
    this["_clip"] = null;
    this["_metaFetchToken"] = 0x0;
    this['_canonicalAssetImportRetryTimer'] = null;
    this["_canonicalAssetImportSource"] = '';
    this['_canonicalAssetImportPromise'] = null;
    this["_canonicalAssetImportRetryGeneration"] = 0x0;
    this["_canonicalAssetImportDisposed"] = ![];
    this['_canonicalAssetImportFailedAt'] = 0x0;
    this["_thumbFetchToken"] = 0x0;
    this["_activeCapturePreviewUrl"] = '';
    this["_lastPosterSrc"] = '';
    this["_rhResumeAbortController"] = null;
    this['_rhResumeTaskId'] = '';
    this["_rhResumePromise"] = null;
    this['_asyncResumeAbortController'] = null;
    this['_asyncResumeTaskId'] = '';
    this["_asyncResumePromise"] = null;
    this["_idleVideoThumbCancel"] = null;
    this["_deferredVideoMetaCancel"] = null;
    this['_isUploading'] = ![];
    this["_unsubscribeLocale"] = null;
    this["_rendererMediaDeferred"] = shouldDeferRendererMediaOnMount(_0x452b10);
    this["_rendererDetailsDeferred"] = shouldDeferRendererDetailsOnMount(_0x452b10);
    this["_rendererRuntimePrebuiltOffscreen"] = shouldPrebuildRendererRuntimeOffscreen(_0x452b10);
    this["_videoEventsBound"] = ![];
    this["_progressRaf"] = 0x0;
    this["_toolbarEl"] = null;
    this["_videoToolbarBound"] = ![];
    this['_videoToolbarCleanup'] = null;
    this['_removeDeferredToolbarActivator'] = null;
    this["_videoInteractionBound"] = ![];
    this['_removeDeferredInteractionActivator'] = null;
    this["_rendererEagerVideoPreview"] = ![];
    this["_rendererPlaybackPinned"] = ![];
    this["_hoverPlaybackLifecycle"] = createHoverVideoPlaybackLifecycle({
      'releaseMedia': () => this["_releaseIdleHoverPlaybackMedia"]()
    });
  }
  ["_ensureVideoToolbarBound"]() {
    if (this['_videoToolbarBound'] === !![]) {
      return;
    }
    const _0x28640d = this["_toolbarEl"] || this['el']?.["querySelector"]?.('.node-floating-toolbar') || null;
    if (!_0x28640d) {
      return;
    }
    this['_removeDeferredToolbarActivator']?.();
    this['_removeDeferredToolbarActivator'] = null;
    this['_videoToolbarCleanup']?.();
    this["_videoToolbarCleanup"] = bindVideoToolbarEvents(_0x28640d, this["_data"]);
    this['_toolbarEl'] = _0x28640d;
    this['_videoToolbarBound'] = !![];
  }
  ["_armDeferredVideoToolbarBinding"]() {
    if (!this['_toolbarEl'] || this["_removeDeferredToolbarActivator"]) {
      return;
    }
    const _0xe56dff = _0x68250 => {
      _0x68250?.["stopPropagation"]?.();
      this['_ensureVideoToolbarBound']();
    };
    const _0x4a994e = () => {
      this["_ensureVideoToolbarBound"]();
    };
    this["_toolbarEl"]["addEventListener"]?.("pointerdown", _0xe56dff, !![]);
    this['_toolbarEl']['addEventListener']?.("focusin", _0x4a994e, !![]);
    this["_removeDeferredToolbarActivator"] = () => {
      this["_toolbarEl"]?.["removeEventListener"]?.("pointerdown", _0xe56dff, !![]);
      this['_toolbarEl']?.['removeEventListener']?.("focusin", _0x4a994e, !![]);
    };
  }
  ["_ensureVideoInputElement"]() {
    if (this["_input"]) {
      return this['_input'];
    }
    if (!this['el'] || typeof document?.["createElement"] !== 'function') {
      return null;
    }
    const _0xe93fbb = document['createElement']("input");
    _0xe93fbb["type"] = "file";
    _0xe93fbb["accept"] = "video/*";
    _0xe93fbb['style']['display'] = "none";
    this['el']["appendChild"](_0xe93fbb);
    this["_input"] = _0xe93fbb;
    return _0xe93fbb;
  }
  ["_armDeferredVideoInteractionBinding"]() {
    if (!this['el'] || this['_removeDeferredInteractionActivator'] || this["_videoInteractionBound"]) {
      return;
    }
    const _0xd02d4b = this["_card"];
    const _0x3bfb2b = () => {
      this['_bindVideoInteractionHandlers']();
    };
    const _0x2ba1e4 = () => {
      if (!shouldActivateSourceVideoHoverPlayback(a517_0x501c15, this['id'])) {
        return;
      }
      this["hydrateDeferredMedia"]();
      this['_activateHoverPlayback']();
    };
    this['el']["addEventListener"]?.("pointerdown", _0x3bfb2b, !![]);
    this['el']['addEventListener']?.('focusin', _0x3bfb2b, !![]);
    _0xd02d4b?.["addEventListener"]?.("mouseenter", _0x2ba1e4, !![]);
    this['_removeDeferredInteractionActivator'] = () => {
      this['el']?.["removeEventListener"]?.("pointerdown", _0x3bfb2b, !![]);
      this['el']?.["removeEventListener"]?.('focusin', _0x3bfb2b, !![]);
      _0xd02d4b?.['removeEventListener']?.("mouseenter", _0x2ba1e4, !![]);
    };
  }
  ["_bindVideoInteractionHandlers"]() {
    if (this["_videoInteractionBound"] === !![]) {
      return;
    }
    if (!this['el'] || typeof this['_card']?.["addEventListener"] !== 'function') {
      return;
    }
    this["_videoInteractionBound"] = !![];
    this["_removeDeferredInteractionActivator"]?.();
    this['_removeDeferredInteractionActivator'] = null;
    this["_card"]["addEventListener"]('dblclick', _0x543d13 => {
      _0x543d13["stopPropagation"]();
      this["_clickTimer"] && (clearTimeout(this["_clickTimer"]), this["_clickTimer"] = null);
      const _0xbb7798 = this["_currentSrc"] || this['_resolveVideoSrc'](this["_data"]) || this["_video"]?.["dataset"]?.["desktopMediaSourceUrl"] || (this['_video'] ? getVideoCurrentSource(this["_video"]) : '');
      _0xbb7798 && void this['_openFullscreenFromCurrentVideo']();
    });
    this["_card"]["addEventListener"]("click", _0x3352f4 => {
      if (_0x3352f4["detail"] && _0x3352f4["detail"] > 0x1) {
        return;
      }
      if (_0x3352f4["target"]["closest"]('.video-controls') || _0x3352f4["target"]['closest'](".video-mute-btn") || _0x3352f4["target"]["closest"]('.node-upload-hint') || _0x3352f4["target"]["closest"](".node-floating-toolbar")) {
        return;
      }
      _0x3352f4["stopPropagation"]();
      if (this["_clickTimer"]) {
        clearTimeout(this["_clickTimer"]);
      }
      this["_clickTimer"] = setTimeout(() => {
        this["_clickTimer"] = null;
        if (!this['_currentSrc']) {
          return;
        }
        this["_toggleManualPlayback"]({
          'forcePlay': this["_shouldKeepHoverPlaybackOnManualClick"]()
        });
      }, 0xb4);
    });
    const _0x3cf651 = this['_ensureVideoInputElement']();
    this['_uploadBtn']?.['addEventListener']?.('click', _0x3df14c => {
      _0x3df14c['stopPropagation']();
      _0x3cf651?.['click']?.();
    });
    this["_resizer"] && this["_resizer"]['addEventListener']('pointerdown', _0x380b9b => {
      const _0x3c32d7 = a517_0x501c15["getStateRaw"]()['ui']?.["imageVideoNodeResizeEnabled"] === !![];
      const _0x5d6f4d = document["getElementById"]("v2-wrap")?.["classList"]['contains']("v2-media-node-resize-enabled");
      if (!(_0x3c32d7 && _0x5d6f4d)) {
        return;
      }
      startNodeResizePreview({
        'event': _0x380b9b,
        'nodeId': this['id'],
        'getNode': () => a517_0x501c15["getStateRaw"]()['nodes']?.[this['id']] || this["_data"],
        'getViewport': () => a517_0x501c15["getStateRaw"]()["viewport"],
        'resolveSize': ({
          startWidth: _0x5e3a18,
          startHeight: _0x56a967,
          dx: _0x178169,
          dy: _0xebd7b6
        }) => {
          const _0x58d924 = _0x5e3a18 / _0x56a967;
          const _0x48ad39 = Math["max"](_0x178169 / _0x5e3a18, _0xebd7b6 / _0x56a967);
          const _0x250ed9 = Math["max"](SOURCE_VIDEO_MIN_SIZE / _0x5e3a18, SOURCE_VIDEO_MIN_SIZE / _0x56a967);
          const _0x40bd9f = Math["max"](_0x250ed9, 0x1 + _0x48ad39);
          const _0x5319ca = Math["max"](SOURCE_VIDEO_MIN_SIZE, Math['round'](_0x5e3a18 * _0x40bd9f));
          const _0x3e74a7 = Math['max'](SOURCE_VIDEO_MIN_SIZE, Math['round'](_0x5319ca / _0x58d924));
          return {
            'width': _0x5319ca,
            'height': _0x3e74a7
          };
        },
        'buildFinalPatch': ({
          startNode: _0x5cccef
        }) => _0x5cccef?.["needsAutoResize"] ? {
          'needsAutoResize': ![]
        } : {},
        'applyPatch': _0x129abf => a517_0x501c15["updateNodeData"](this['id'], _0x129abf),
        'commit': commit
      });
    });
    _0x3cf651?.["addEventListener"]?.('change', async _0x463ca0 => {
      const _0x3af202 = _0x463ca0["target"]["files"][0x0];
      if (!_0x3af202) {
        return;
      }
      await this["_handleUploadInputFile"](_0x3af202);
    });
    this["_muteBtn"]?.['addEventListener']?.("click", _0x551b7a => {
      _0x551b7a["stopPropagation"]();
      if (a517_0x34b728["isActiveFor"](this["_data"]?.['id'])) {
        return;
      }
      this['_setMuted'](!this["_isMuted"], {
        'persist': !![]
      });
    });
    this["_playBtn"]?.["addEventListener"]?.("click", _0x104877 => {
      _0x104877["stopPropagation"]();
      if (a517_0x34b728["isActiveFor"](this["_data"]?.['id'])) {
        return;
      }
      if (!this["_currentSrc"]) {
        return;
      }
      this['_toggleManualPlayback']({
        'loop': _0x104877["shiftKey"] === !![],
        'forcePlay': this["_shouldKeepHoverPlaybackOnManualClick"]()
      });
    });
    if (this["_bar"]) {
      let _0x51b784 = 0x0;
      this['_updateDragVisual'] = _0x1b2aba => {
        if (this['_fill']) {
          this["_fill"]["style"]["width"] = _0x1b2aba * 0x64 + '%';
        }
        if (!this['_timeCurrent']) {
          return;
        }
        const _0x3e3ca9 = this['_getBaseDuration']();
        const _0x4d0339 = this["_getClipRange"](_0x3e3ca9);
        const _0x349b58 = _0x4d0339["active"] ? Math["max"](0x0, _0x4d0339['end'] - _0x4d0339["start"]) : _0x3e3ca9;
        if (_0x349b58 && Number["isFinite"](_0x349b58)) {
          this["_timeCurrent"]["textContent"] = this['_fmt'](_0x1b2aba * _0x349b58);
        }
      };
      const _0x2b6503 = _0x4a086 => {
        const _0x5a2e60 = this["_bar"];
        if (!_0x5a2e60) {
          return 0x0;
        }
        const _0x255f9d = _0x5a2e60["getBoundingClientRect"]();
        const _0x45e21d = _0x255f9d["width"] || 0x0;
        if (!_0x45e21d) {
          return 0x0;
        }
        const _0x238147 = _0x4a086['clientX'] - _0x255f9d['left'];
        if (!Number['isFinite'](_0x238147)) {
          return 0x0;
        }
        return Math['max'](0x0, Math["min"](0x1, _0x238147 / _0x45e21d));
      };
      const _0x554d1e = _0xdd5217 => {
        if (!Number["isFinite"](_0xdd5217)) {
          return;
        }
        const _0x2919e9 = this["_getBaseDuration"]();
        if (!_0x2919e9 || !Number['isFinite'](_0x2919e9)) {
          return;
        }
        const _0x3f6a9b = this["_getClipRange"](_0x2919e9);
        const _0xcea825 = _0x3f6a9b["active"] ? Math["max"](0x0, _0x3f6a9b["end"] - _0x3f6a9b["start"]) : _0x2919e9;
        if (!_0xcea825 || !Number['isFinite'](_0xcea825)) {
          return;
        }
        const _0x382d6d = Math["max"](0x0, Math['min'](_0x2919e9, (_0x3f6a9b["active"] ? _0x3f6a9b["start"] : 0x0) + _0xdd5217 * _0xcea825));
        if (!Number["isFinite"](_0x382d6d)) {
          return;
        }
        const _0x52cc38 = this['_ensureVideoElement']();
        if (!_0x52cc38) {
          return;
        }
        this["_isSeeking"] = !![];
        const _0x1acbd4 = ++this["_seekToken"];
        _0x52cc38["currentTime"] = _0x382d6d;
        const _0x31a84a = () => {
          if (_0x1acbd4 !== this["_seekToken"]) {
            return;
          }
          this["_isSeeking"] = ![];
          const _0x366905 = this['_getBaseDuration']();
          const _0x385ea3 = this['_getClipRange'](_0x366905);
          const _0x50600e = _0x385ea3["active"] ? Math['max'](0x0, _0x385ea3["end"] - _0x385ea3["start"]) : _0x366905;
          const _0x2172b0 = _0x52cc38["currentTime"] || 0x0;
          if (_0x50600e && Number["isFinite"](_0x50600e)) {
            const _0x39392a = _0x385ea3['active'] ? Math['max'](0x0, Math['min'](_0x50600e, _0x2172b0 - _0x385ea3['start'])) : _0x2172b0;
            this["_fill"]["style"]['width'] = _0x39392a / _0x50600e * 0x64 + '%';
            this['_timeCurrent']["textContent"] = this["_fmt"](_0x39392a);
            this['_timeTotal']["textContent"] = this['_fmt'](_0x50600e);
          }
        };
        _0x52cc38["addEventListener"]("seeked", _0x31a84a, {
          'once': !![]
        });
        window["setTimeout"](_0x31a84a, 0x12c);
      };
      const _0x3b6b3e = _0x8032a9 => {
        _0x8032a9["stopPropagation"]();
        _0x8032a9['preventDefault']();
        _0x51b784 = _0x2b6503(_0x8032a9);
        this["_updateDragVisual"](_0x51b784);
      };
      const _0x3b8557 = ({
        commitSeek: _0x1f6ff5
      }) => {
        this["_bar"]["dataset"]["dragging"] = "false";
        this['_progressDragSession'] = null;
        if (_0x1f6ff5) {
          _0x554d1e(_0x51b784);
        }
        this["_isSeeking"] = ![];
        if (!_0x1f6ff5) {
          this['_syncVideoProgressUi']();
        }
        this["_syncRendererPlaybackPin"]();
      };
      this['_bar']["addEventListener"]?.("pointerdown", _0x3d814c => {
        _0x3d814c['stopPropagation']();
        _0x3d814c['preventDefault']();
        if (_0x3d814c['button'] !== 0x0 || _0x3d814c['isPrimary'] === ![]) {
          return;
        }
        this["_progressDragSession"]?.["cancel"]?.();
        if (a517_0x34b728["isActiveFor"](this["_data"]?.['id'])) {
          return;
        }
        if (!this["_currentSrc"]) {
          return;
        }
        this["_isManualControl"] = !![];
        this['_setManualLoopPlayback'](![]);
        this["_syncPlaybackChromeVisibility"]();
        this["_autoPlayToken"]++;
        this["_hoverManualPause"] = !![];
        this['_ensureVideoElement']()?.["pause"]?.();
        this['_isSeeking'] = !![];
        this["_syncRendererPlaybackPin"]();
        this["_bar"]["dataset"]["dragging"] = 'true';
        _0x51b784 = _0x2b6503(_0x3d814c);
        this["_updateDragVisual"](_0x51b784);
        _0x554d1e(_0x51b784);
        this["_progressDragSession"] = startMediaProgressDragSession({
          'target': window,
          'pointerId': _0x3d814c["pointerId"],
          'onMove': _0x3b6b3e,
          'onEnd': () => _0x3b8557({
            'commitSeek': !![]
          }),
          'onCancel': () => _0x3b8557({
            'commitSeek': ![]
          })
        });
      });
    }
    this["_snapBtn"]?.["addEventListener"]?.("click", _0x16f36c => {
      _0x16f36c["stopPropagation"]();
      if (a517_0x34b728['isActiveFor'](this["_data"]?.['id'])) {
        return;
      }
      void this['_captureFrame']();
    });
    this["_card"]["addEventListener"]("mouseenter", () => this["_activateHoverPlayback"]());
    this["_card"]["addEventListener"]("mouseleave", () => {
      const _0x537cbf = a517_0x501c15["getStateRaw"]()["videoClip"];
      if (_0x537cbf && _0x537cbf["active"] && _0x537cbf["nodeId"] === this["_data"]?.['id']) {
        return;
      }
      this["_deactivateHoverPlayback"]();
    });
    this['_controls']?.["addEventListener"]?.("pointerdown", _0x178799 => _0x178799["stopPropagation"]());
    this["_muteBtn"]?.['addEventListener']?.("pointerdown", _0x3f4c6d => _0x3f4c6d['stopPropagation']());
  }
  ['_activateHoverPlayback']() {
    if (!shouldActivateSourceVideoHoverPlayback(a517_0x501c15, this['id'])) {
      return ![];
    }
    const _0x157649 = a517_0x501c15["getStateRaw"]()["videoClip"];
    if (_0x157649 && _0x157649["active"] && _0x157649["nodeId"] === this["_data"]?.['id']) {
      return ![];
    }
    this['_hoverPlaybackLifecycle']?.["activate"]?.();
    if (!this['_currentSrc'] || this["_rendererMediaDeferred"] === !![]) {
      return ![];
    }
    const _0x463eb4 = this['_ensureVideoElement']();
    if (!_0x463eb4) {
      return ![];
    }
    this["_isHovered"] = !![];
    this["_syncPlaybackChromeVisibility"]();
    this['_syncRendererPlaybackPin']();
    if (a517_0x34b728["isActiveFor"](this['_data']?.['id'])) {
      _0x463eb4["pause"]();
      return ![];
    }
    if (isExternallyOwnedVideoPlayback(_0x463eb4) || shouldKeepManualPlaybackPresentationActive(this, _0x463eb4)) {
      return !![];
    }
    if (this['_hoverManualPause'] || this["_isManualLoopPlayback"]) {
      return ![];
    }
    const _0x463d76 = this["_getBaseDuration"]();
    const _0x3e766d = this["_getClipRange"](_0x463d76);
    _0x463eb4['loop'] = !_0x3e766d["active"];
    if (_0x3e766d['active']) {
      const _0x414508 = _0x463eb4['currentTime'] || 0x0;
      if (_0x414508 < _0x3e766d["start"] || _0x414508 > _0x3e766d["end"]) {
        _0x463eb4['currentTime'] = _0x3e766d['start'];
      }
    }
    const _0x21bdd4 = ++this["_autoPlayToken"];
    logVideoPlaybackEvent(_0x463eb4, 'hover-enter', {
      'label': this["_getPlaybackLabel"]("hover")
    });
    void this["_playVideoWithRecovery"]("hover", () => this["_autoPlayToken"] === _0x21bdd4 && this["_isHovered"] === !![] && !this['_hoverManualPause']);
    return !![];
  }
  ["_ensureVideoElement"]() {
    if (this["_video"]) {
      return this["_video"];
    }
    if (!this["_card"]) {
      return null;
    }
    const _0x12a3e9 = document['createElement']("video");
    _0x12a3e9['className'] = "video-player";
    _0x12a3e9["setAttribute"]('playsinline', '');
    _0x12a3e9["preload"] = "none";
    _0x12a3e9["muted"] = this["_isMuted"];
    Object['assign'](_0x12a3e9["style"], {
      'width': '100%',
      'height': "100%",
      'display': 'block',
      'opacity': '0',
      'visibility': "hidden",
      'objectFit': "cover",
      'borderRadius': '0',
      'margin': '0',
      'pointerEvents': 'none'
    });
    if (this["_posterFrame"]?.["parentNode"] === this['_card']) {
      this["_card"]["insertBefore"](_0x12a3e9, this['_posterFrame']);
    } else {
      typeof this["_card"]["prepend"] === "function" ? this['_card']["prepend"](_0x12a3e9) : this['_card']["appendChild"](_0x12a3e9);
    }
    this["_video"] = _0x12a3e9;
    this["_bindVideoElementEvents"]();
    return _0x12a3e9;
  }
  ["_syncPlaybackChromeVisibility"]({
    forceHidden = ![]
  } = {}) {
    return syncSourceVideoPlaybackChromeVisibility(this, {
      'forceHidden': forceHidden
    });
  }
  ["_deactivateHoverPlayback"]() {
    return deactivateSourceVideoHoverPlayback(this);
  }
  ["_releaseIdleHoverPlaybackMedia"]() {
    return releaseIdleSourceVideoHoverPlaybackMedia(this);
  }
  ["_syncLoadedVideoMetadata"](_0x271c4d = this["_video"]) {
    if (!_0x271c4d || _0x271c4d !== this["_video"]) {
      return ![];
    }
    const _0x377cd4 = a517_0x501c15["getState"]()["nodes"]?.[this['id']];
    if (!_0x377cd4) {
      return ![];
    }
    const _0x184df5 = String(this["_resolveVideoSrc"](_0x377cd4) || '')['trim']();
    const _0x4da11a = String(this["_currentSrc"] || '')['trim']();
    if (_0x184df5 && _0x4da11a && _0x184df5 !== _0x4da11a) {
      return ![];
    }
    const _0x4d94c6 = _0x4da11a || _0x184df5;
    if (_0x4d94c6 && !isMediaElementPlaybackSource(_0x271c4d, _0x4d94c6)) {
      return ![];
    }
    this["_syncVideoDurationUi"]();
    this["_syncVideoProgressUi"]();
    const _0xe0cd88 = Number(_0x271c4d["duration"] || 0x0);
    const _0x1ac290 = Number(_0x271c4d["videoWidth"] || 0x0);
    const _0x349cbf = Number(_0x271c4d["videoHeight"] || 0x0);
    const _0x2dc5e6 = {};
    Number['isFinite'](_0xe0cd88) && _0xe0cd88 > 0x0 && Number(_0x377cd4["videoDuration"] || 0x0) !== _0xe0cd88 && (_0x2dc5e6["videoDuration"] = _0xe0cd88);
    _0x1ac290 > 0x0 && Number(_0x377cd4["videoWidth"] || 0x0) !== _0x1ac290 && (_0x2dc5e6["videoWidth"] = _0x1ac290);
    _0x349cbf > 0x0 && Number(_0x377cd4["videoHeight"] || 0x0) !== _0x349cbf && (_0x2dc5e6["videoHeight"] = _0x349cbf);
    if (_0x377cd4["fixedSize"] !== !![] && _0x377cd4["needsAutoResize"] === !![] && _0x1ac290 > 0x0 && _0x349cbf > 0x0) {
      const _0x2cd0c8 = getAutoMediaSizeByShortSide(_0x1ac290, _0x349cbf);
      _0x2dc5e6['width'] = _0x2cd0c8['width'];
      _0x2dc5e6["height"] = _0x2cd0c8['height'];
      _0x2dc5e6["needsAutoResize"] = ![];
    }
    Object["keys"](_0x2dc5e6)["length"] > 0x0 && (a517_0x501c15['updateNodeData'](this['id'], _0x2dc5e6), this['_data'] = {
      ..._0x377cd4,
      ..._0x2dc5e6
    });
    return !![];
  }
  ["_bindVideoElementEvents"]() {
    if (!this["_video"] || this["_videoEventsBound"] === !![]) {
      return;
    }
    this['_videoEventsBound'] = !![];
    this["_video"]['addEventListener']("play", () => {
      this['_syncRendererPlaybackPin']();
      this["_syncPosterFrameVisibility"]();
      this['_updatePlayIcon'](![]);
      this["_syncPlaybackChromeVisibility"]();
      this["_hideCenterIndicator"]();
      this["_startProgressLoop"]();
    });
    this["_video"]["addEventListener"]("pause", () => {
      this["_cancelProgressLoop"]();
      this['_syncVideoProgressUi']();
      this["_syncPosterFrameVisibility"]();
      this['_updatePlayIcon'](!![]);
      this["_syncPlaybackChromeVisibility"]();
      this['_syncRendererPlaybackPin']();
      this["_applyPendingPlaybackSourceAtBoundary"]();
    });
    this["_video"]["addEventListener"]("ended", () => {
      this["_applyPendingPlaybackSourceAtBoundary"]();
    });
    const _0x19df3a = () => {
      const _0x3ec068 = this["_rendererMediaSlotToken"];
      this["_armFirstVideoFramePresentation"](this["_currentSrc"], _0x3ec068);
    };
    for (const _0x1d7516 of ["loadeddata", 'playing', "timeupdate", "seeked"]) {
      this["_video"]["addEventListener"](_0x1d7516, () => {
        _0x19df3a();
        this["_syncPosterFrameVisibility"]();
        this["_releaseFastPreviewForPlaybackIfReady"]();
        this['_syncRendererPlaybackPin']();
      });
    }
    this["_video"]["addEventListener"]('timeupdate', () => this["_syncVideoProgressUi"]());
    const _0x1fc0f0 = this['_video'];
    _0x1fc0f0['addEventListener']("loadedmetadata", () => {
      this["_applyPendingPlaybackResume"](_0x1fc0f0);
      this['_syncLoadedVideoMetadata'](_0x1fc0f0);
    });
    _0x1fc0f0['addEventListener']('canplay', () => {
      this["_applyPendingPlaybackResume"](_0x1fc0f0);
    });
  }
  ["mount"]() {
    const _0x30301b = this['el'];
    setStaticInnerHTML(_0x30301b, _SOURCE_VIDEO_NODE_TEMPLATE_ID);
    this['_card'] = _0x30301b["querySelector"](".node-card");
    this["_video"] = null;
    this['_posterFrame'] = _0x30301b['querySelector'](".source-video-poster-frame");
    this['_posterFrame'] && (this["_posterFrame"]['decoding'] = "async", this["_posterFrame"]["loading"] = "lazy", "fetchPriority" in this['_posterFrame'] && (this["_posterFrame"]["fetchPriority"] = "auto"));
    if (!this['_rendererRuntimePrebuiltOffscreen']) {
      this["_applyVideoPoster"](this["_data"]);
    }
    this['_attachPlaybackRecovery']();
    this["_hint"] = _0x30301b["querySelector"](".node-upload-hint");
    this["_uploadBtn"] = _0x30301b["querySelector"](".upload-btn");
    this["_controls"] = _0x30301b["querySelector"](".video-controls");
    this["_playBtn"] = _0x30301b["querySelector"](".video-play-btn");
    this["_muteBtn"] = _0x30301b["querySelector"]('.video-mute-btn');
    this['_iconUnmuted'] = _0x30301b["querySelector"](".icon-unmuted");
    this["_iconMuted"] = _0x30301b['querySelector']('.icon-muted');
    this["_syncMutedStateFromData"](this["_data"]);
    this["_fill"] = _0x30301b["querySelector"](".media-progress-fill");
    this["_bar"] = _0x30301b["querySelector"](".media-progress-bar");
    this["_timeCurrent"] = _0x30301b['querySelector'](".video-time-current");
    this["_timeTotal"] = _0x30301b['querySelector']('.video-time-total');
    this["_snapBtn"] = _0x30301b['querySelector'](".video-snap-btn");
    this['_centerIndicator'] = _0x30301b['querySelector']('.video-center-indicator');
    this["_indicatorInner"] = _0x30301b["querySelector"](".indicator-inner");
    this["_centerIndicatorTimer"] = null;
    this["_resizer"] = _0x30301b['querySelector']('.node-resizer');
    this['_syncPlaybackChromeVisibility']({
      'forceHidden': !![]
    });
    this['_syncLocaleTexts']();
    this['_rendererDetailsDeferred'] !== !![] && (this['_unsubscribeLocale'] = onLocaleChange(() => this["_syncLocaleTexts"]()));
    if (this['_data']?.["isGenerating"] && !this['_resolveVideoSrc'](this["_data"])) {
      startLoading(this["_card"], {
        'variant': "full"
      });
      if (this["_hint"]) {
        this['_hint']["style"]["display"] = 'none';
      }
      if (this['_uploadBtn']) {
        this['_uploadBtn']["disabled"] = !![];
      }
    }
    this["_rendererMediaDeferred"] === !![] || this["_rendererDetailsDeferred"] === !![] ? this["_armDeferredVideoInteractionBinding"]() : this["_bindVideoInteractionHandlers"]();
    const _0x5d7d0c = this['_rendererMediaDeferred'] === !![] ? this["_data"] : this['_promotePendingProxyAtMediaSegmentBoundary'](this["_data"]);
    const _0x20e491 = this["_resolveVideoSrc"](_0x5d7d0c);
    if (this["_rendererMediaDeferred"] === !![]) {
      this["_currentSrc"] = _0x20e491 || '';
      this["_syncPosterFrameVisibility"]({
        'force': !!this["_lastPosterSrc"]
      });
    } else {
      this["_requestVisibleProxyMigration"]();
      if (_0x20e491) {
        this['_loadVideo'](_0x20e491);
      } else {
        this["_loadVideo"]('');
      }
    }
    this['_rendererDetailsDeferred'] !== !![] && this["_clearResolvedVideoTimer"](this["_data"], _0x20e491);
    this["_rendererMediaDeferred"] !== !![] && this['_rendererDetailsDeferred'] !== !![] && this["_maybeFetchVideoMeta"](this['_data']);
    this['_rendererDetailsDeferred'] !== !![] && (this["_syncRunningHubVideoTaskState"](this["_data"]), this["_maybeResumeRunningHubTask"](), this["_maybeResumeAsyncTask"]());
    this["_syncGenerationFailureUi"](a517_0x501c15["getStateRaw"]()["nodes"]?.[this['id']] || this['_data']);
    this["_toolbarEl"] = _0x30301b["querySelector"](".node-floating-toolbar");
    this["_rendererMediaDeferred"] === !![] || this["_rendererDetailsDeferred"] === !![] ? this["_armDeferredVideoToolbarBinding"]() : this['_ensureVideoToolbarBound']();
    return _0x30301b;
  }
  ["_syncGenerationFailureUi"](_0x30a576 = this["_data"]) {
    const _0x481d17 = resolveSourceVideoGenerationFailureMessage(_0x30a576);
    if (!_0x481d17) {
      this['_generationErrorOverlay']?.['remove']?.();
      this["_generationErrorOverlay"] = null;
      this["_generationErrorMessage"] = '';
      return ![];
    }
    if (!this["_card"] || typeof this["_card"]["appendChild"] !== "function" || typeof globalThis["document"]?.["createElement"] !== "function") {
      return ![];
    }
    stopLoading(this["_card"]);
    let _0x2e7fb5 = ![];
    !this["_generationErrorOverlay"] && (this['_generationErrorOverlay'] = document['createElement']('div'), this["_generationErrorOverlay"]["className"] = "dreamina-status-overlay source-video-generation-error-overlay", this['_card']?.["appendChild"]?.(this['_generationErrorOverlay']), _0x2e7fb5 = !![]);
    (_0x2e7fb5 || this["_generationErrorMessage"] !== _0x481d17) && (this["_generationErrorOverlay"]["innerHTML"] = '', this["_generationErrorOverlay"]['appendChild'](createVideoGenerationErrorCard(_0x481d17)), this["_generationErrorMessage"] = _0x481d17);
    this['_setPosterFrameVisible'](![]);
    if (this["_hint"]) {
      this['_hint']['style']["display"] = 'none';
    }
    this['_syncPlaybackChromeVisibility']({
      'forceHidden': !![]
    });
    if (this["_uploadBtn"]) {
      this["_uploadBtn"]["disabled"] = ![];
    }
    return !![];
  }
  ["hydrateDeferredDetails"]() {
    if (this["_rendererDetailsDeferred"] !== !![]) {
      return ![];
    }
    this['_rendererDetailsDeferred'] = ![];
    this['_syncLocaleTexts']();
    !this["_unsubscribeLocale"] && (this["_unsubscribeLocale"] = onLocaleChange(() => this["_syncLocaleTexts"]()));
    this["_bindVideoInteractionHandlers"]();
    this["_ensureVideoToolbarBound"]();
    const _0x78414a = a517_0x501c15['getStateRaw']()["nodes"]?.[this['id']] || this["_data"];
    this["_data"] = _0x78414a;
    const _0x2934be = this["_resolveVideoSrc"](_0x78414a);
    this['_clearResolvedVideoTimer'](_0x78414a, _0x2934be);
    this["_maybeFetchVideoMeta"](_0x78414a);
    this['_syncRunningHubVideoTaskState'](_0x78414a);
    this['_maybeResumeRunningHubTask']();
    this["_maybeResumeAsyncTask"]();
    return !![];
  }
  ["_waitForUploadPaint"]() {
    return waitForNextPaint();
  }
  ["_syncLocaleTexts"]() {
    if (this['_muteBtn']) {
      const _0x52e100 = sourceVideoText("controls.toggleMute");
      this["_muteBtn"]["dataset"]["tooltip"] = _0x52e100;
      this["_muteBtn"]["setAttribute"]?.("aria-label", _0x52e100);
    }
    if (this['_snapBtn']) {
      const _0x5baf9a = sourceVideoText("controls.captureFrame");
      this["_snapBtn"]["dataset"]['tooltip'] = _0x5baf9a;
      this["_snapBtn"]["setAttribute"]?.("aria-label", _0x5baf9a);
    }
    this["_updatePlayIcon"](this['_video']?.["paused"] !== ![]);
    if (this["_uploadBtn"] && !this["_isUploading"]) {
      const _0x239903 = this["_uploadBtn"]["querySelector"]?.(".source-upload-label");
      _0x239903 ? _0x239903["textContent"] = sourceVideoText('upload.button') : this["_uploadBtn"]["textContent"] = sourceVideoText("upload.button");
    }
  }
  ['_syncMuteButtonIcon']() {
    if (!this["_iconMuted"] || !this["_iconUnmuted"]) {
      return;
    }
    this["_iconMuted"]["style"]["display"] = this["_isMuted"] ? "block" : 'none';
    this['_iconUnmuted']["style"]["display"] = this['_isMuted'] ? 'none' : "block";
  }
  ["_applyMutedState"]() {
    if (this["_video"]) {
      this['_video']["muted"] = !!this["_isMuted"];
    }
    this["_syncMuteButtonIcon"]();
  }
  ["_syncMutedStateFromData"](_0x190fbb = this["_data"]) {
    this['_isMuted'] = resolveVideoMutedPreference(_0x190fbb, {
      'videoAudioDefaultEnabled': readVideoAudioDefaultEnabledFromStore(a517_0x501c15)
    });
    this["_applyMutedState"]();
  }
  ["_setMuted"](_0x4fd641, {
    persist = ![]
  } = {}) {
    this['_isMuted'] = !!_0x4fd641;
    this["_applyMutedState"]();
    if (!persist) {
      return;
    }
    const _0x45290d = a517_0x501c15["getState"]()["nodes"]?.[this['id']] || this["_data"] || {};
    const _0x24a506 = buildVideoMutedPatch(_0x45290d, this["_isMuted"]);
    if (!_0x24a506) {
      return;
    }
    a517_0x501c15["updateNodeData"](this['id'], _0x24a506);
    this['_data'] = {
      ..._0x45290d,
      ..._0x24a506
    };
  }
  ['_readUploadVideoNaturalSize'](_0x52168e) {
    return readVideoFileNaturalSize(_0x52168e);
  }
  ["_uploadSourceVideoFile"](_0x2dd1f9, _0x35aa7d) {
    return uploadFile(_0x2dd1f9, _0x35aa7d);
  }
  async ["_handleUploadInputFile"](_0x904db) {
    if (Number(_0x904db?.["size"] || 0x0) > CANVAS_VIDEO_IMPORT_MAX_BYTES) {
      window["showToast"]?.(t('fileService.errors.videoTooLarge', {
        'file': _0x904db?.["name"] || t("fileService.defaultNames.video"),
        'maxMB': CANVAS_VIDEO_IMPORT_MAX_MB
      }), "error");
      if (this["_input"]) {
        this["_input"]['value'] = '';
      }
      return ![];
    }
    this["_isUploading"] = !![];
    startLoading(this["_card"], {
      'variant': "static"
    });
    const _0x276b10 = this["_ensureVideoElement"]();
    if (_0x276b10) {
      _0x276b10["style"]["display"] = "none";
    }
    this["_syncPlaybackChromeVisibility"]({
      'forceHidden': !![]
    });
    const _0x475ea9 = Array["from"](this["_uploadBtn"]["childNodes"])["map"](_0x1e2b3a => _0x1e2b3a["cloneNode"](!![]));
    this["_uploadBtn"]["textContent"] = sourceVideoText("upload.uploading");
    this["_uploadBtn"]["style"]["pointerEvents"] = "none";
    const _0x206952 = this["_currentSrc"];
    const _0x92c248 = createVideoCapturePreviewUrl(_0x904db);
    _0x92c248 && (this["_data"] = {
      ...this['_data'],
      'capturePreviewUrl': _0x92c248
    }, this["_loadVideo"](_0x92c248));
    try {
      const _0x4f5bd8 = window["currentProjectId"] || "default_v2_project";
      await this["_waitForUploadPaint"]();
      const _0x412690 = Promise["resolve"]()["then"](() => this["_readUploadVideoNaturalSize"](_0x904db))["catch"](() => null);
      void _0x412690["then"](_0x43d657 => {
        const _0x46eaf4 = buildSourceVideoUploadSizePatch(_0x43d657);
        if (_0x46eaf4["needsAutoResize"] !== ![]) {
          return;
        }
        const _0x1bbc6c = a517_0x501c15['getState']()['nodes']?.[this['id']];
        if (!_0x1bbc6c) {
          return;
        }
        a517_0x501c15["updateNodeData"](this['id'], _0x46eaf4);
        this["_data"] = {
          ..._0x1bbc6c,
          ..._0x46eaf4
        };
      });
      const _0x199572 = await this["_uploadSourceVideoFile"](_0x904db, _0x4f5bd8);
      const _0x7fe1b2 = await _0x412690;
      const _0x26482a = _0x904db["name"]["replace"](/\.[^/.]+$/, '');
      const _0x2a2b7d = _0x199572["url"];
      const _0x35a77c = pickResultLocalPath(_0x199572) || urlToLocalPath(_0x2a2b7d);
      const _0xefc2a6 = String(_0x199572["videoProxyStatus"] || '')["trim"]();
      const _0x428a0f = _0xefc2a6 === "processing" && !!_0x92c248;
      const _0x5af9fa = _0xefc2a6 === "processing" ? '' : String(_0x199572["displayUrl"] || '')["trim"]() || String(_0x199572["displayLocalPath"] ? '/' + _0x199572["displayLocalPath"] : '')["trim"]() || _0x2a2b7d;
      const _0x3eda6b = buildSourceVideoUploadSizePatch({
        'width': _0x199572["videoWidth"] || _0x199572['width'],
        'height': _0x199572['videoHeight'] || _0x199572["height"]
      }, _0x7fe1b2);
      a517_0x501c15["updateNodeData"](this['id'], {
        'name': _0x26482a,
        'src': _0x5af9fa,
        'localPath': _0x35a77c,
        'assetId': _0x199572["assetId"] || '',
        'assetRevision': Number(_0x199572["assetRevision"] || 0x0) || 0x0,
        'assetUpdatedAt': _0x199572['assetUpdatedAt'] || _0x199572['updatedAt'] || '',
        'originalLocalPath': _0x199572["originalLocalPath"] || _0x199572["localPath"] || '',
        'displayLocalPath': _0x199572['displayLocalPath'] || '',
        'posterLocalPath': _0x199572["posterLocalPath"] || '',
        'thumbLocalPath': _0x199572["posterLocalPath"] || _0x199572['thumbLocalPath'] || '',
        'thumbUrl': _0x199572["posterUrl"] || _0x199572["thumbUrl"] || '',
        'derivativeStatus': _0x199572["derivativeStatus"] || _0x199572["status"] || '',
        'mediaTaskId': _0x199572["mediaTaskId"] || '',
        'mediaTaskKind': _0x199572['mediaTaskKind'] || '',
        'mediaTaskStatus': _0x199572["mediaTaskStatus"] || '',
        'mediaTaskProgress': Number(_0x199572["mediaTaskProgress"] || 0x0) || 0x0,
        'mediaTaskError': _0x199572["mediaTaskError"] || '',
        'videoProxyStatus': _0xefc2a6,
        'videoProxyVersion': _0x199572['videoProxyVersion'] || '',
        'videoCodec': _0x199572["videoCodec"] || '',
        'videoDuration': Number(_0x199572["videoDuration"] || _0x7fe1b2?.['duration'] || 0x0) || 0x0,
        'videoFps': Number(_0x199572["videoFps"] || 0x0) || 0x0,
        'fileSize': Number(_0x199572["size"] || _0x904db?.["size"] || 0x0) || 0x0,
        'fileName': _0x199572["filename"] || _0x904db['name'],
        'stagedUploadId': _0x199572["stagedUploadId"] || '',
        'canonicalImportPending': _0x199572["canonicalImportPending"] === !![],
        'canonicalImportStatus': _0x199572['canonicalImportStatus'] || '',
        'canonicalImportError': _0x199572["canonicalImportError"] || '',
        'capturePreviewUrl': _0x428a0f ? _0x92c248 : '',
        ..._0x3eda6b
      });
    } catch (_0x149a99) {
      console['error']("视频上传失败:", _0x149a99);
      window["showToast"](sourceVideoText("upload.failedRetry"));
      stopLoading(this['_card']);
      if (_0x92c248 && this['_currentSrc'] === _0x92c248) {
        this["_releaseActiveCapturePreviewUrl"]();
        if (_0x206952) {
          this["_loadVideo"](_0x206952);
        } else {
          this["_currentSrc"] = '';
          this["_loadVideo"]('');
        }
      }
      if (this["_currentSrc"]) {
        const _0x2a2309 = this["_ensureVideoElement"]();
        if (_0x2a2309) {
          _0x2a2309['style']["display"] = "block";
        }
        this["_syncPlaybackChromeVisibility"]();
      }
    } finally {
      this['_isUploading'] = ![];
      this["_uploadBtn"]["replaceChildren"](..._0x475ea9["map"](_0x47ea48 => _0x47ea48['cloneNode'](!![])));
      this["_syncLocaleTexts"]();
      this['_uploadBtn']["style"]["pointerEvents"] = 'auto';
      if (this["_input"]) {
        this["_input"]["value"] = '';
      }
    }
  }
  ['_applyVideoPoster'](_0x4745c8 = this["_data"], _0x3d40e1 = {}) {
    const _0x515797 = resolveSourceVideoPosterSrc(_0x4745c8);
    const _0x4a9c02 = !!_0x515797 && (_0x3d40e1?.["restoreNativePoster"] === !![] || !hasPresentedVideoFrame(this['_video'], this["_currentSrc"]));
    if (_0x515797) {
      this['_video'] && _0x4a9c02 && this["_video"]["poster"] !== _0x515797 && (this['_video']["poster"] = _0x515797);
      this["_lastPosterSrc"] = _0x515797;
      this['_applyPosterFrameSource'](_0x515797);
    } else {
      if (this["_video"]?.["poster"]) {
        this['_video']['removeAttribute']?.("poster");
        if (this["_posterFrame"]) {
          this["_posterFrame"]['removeAttribute']?.('src');
        }
        this['_lastPosterSrc'] = '';
      } else {
        if (this["_posterFrame"]) {
          this["_posterFrame"]["removeAttribute"]?.('src');
        }
        this["_lastPosterSrc"] = '';
      }
    }
    _0x4a9c02 ? this["_syncPosterFrameVisibility"]({
      'force': !![]
    }) : this["_syncPosterFrameVisibility"]();
    return _0x515797;
  }
  ["_getPosterFrameSrc"]() {
    if (!this["_posterFrame"]) {
      return '';
    }
    return String(this["_posterFrame"]["getAttribute"]?.("src") || this['_posterFrame']["src"] || '')["trim"]();
  }
  ["_setPosterFrameSrc"](_0x1c204b) {
    if (!this["_posterFrame"]) {
      return;
    }
    typeof this["_posterFrame"]["setAttribute"] === "function" ? this["_posterFrame"]["setAttribute"]('src', _0x1c204b) : this["_posterFrame"]['src'] = _0x1c204b;
  }
  ["_applyPosterFrameSource"](_0x53c108) {
    if (!this["_posterFrame"] || !_0x53c108) {
      return;
    }
    const _0x512f02 = this["_getPosterFrameSrc"]();
    if (_0x512f02 === _0x53c108) {
      return;
    }
    const _0x3c8a4b = ({
      requireConnected = ![]
    } = {}) => {
      if (!this["_posterFrame"] || requireConnected && this["_posterFrame"]["isConnected"] === ![] || this['_lastPosterSrc'] !== _0x53c108) {
        return;
      }
      this["_setPosterFrameSrc"](_0x53c108);
      this["_syncPosterFrameVisibility"]();
    };
    if (!_0x512f02 || _0x53c108['startsWith']("data:") || typeof Image !== 'function') {
      _0x3c8a4b();
      return;
    }
    if (isCanvasImagePreloadRecentlyResolved(_0x53c108)) {
      _0x3c8a4b();
      return;
    }
    const _0x59357b = (this["_posterFramePreloadToken"] || 0x0) + 0x1;
    this['_posterFramePreloadToken'] = _0x59357b;
    preloadCanvasImage(_0x53c108, {
      'priority': SOURCE_VIDEO_POSTER_PRELOAD_PRIORITY,
      'fetchPriority': "auto",
      'deferWhenPaused': !![]
    })["then"](() => {
      if (this["_posterFramePreloadToken"] === _0x59357b) {
        _0x3c8a4b({
          'requireConnected': !![]
        });
      }
    }, () => {});
  }
  ['_setPosterFrameVisible'](_0x562f8b) {
    if (!this["_posterFrame"]) {
      return;
    }
    this["_posterFrame"]["classList"]?.["toggle"]("is-visible", !!_0x562f8b);
  }
  ["_shouldPinRendererForPlayback"]() {
    return !!(this['_isHovered'] || this["_isManualControl"] || this["_isManualLoopPlayback"] || this["_isSeeking"] || this['_video']?.["paused"] === ![]);
  }
  ["_setRendererPlaybackPin"](_0x3284ab) {
    const _0x2ec29b = _0x3284ab === !![];
    if (this["_rendererPlaybackPinned"] === _0x2ec29b) {
      return;
    }
    this['_rendererPlaybackPinned'] = _0x2ec29b;
    const _0x287edc = globalThis["window"]?.['v2Renderer'];
    _0x2ec29b ? _0x287edc?.['pinNode']?.(this['id'], SOURCE_VIDEO_RENDER_PIN_REASON) : _0x287edc?.["unpinNode"]?.(this['id'], SOURCE_VIDEO_RENDER_PIN_REASON);
  }
  ["_syncRendererPlaybackPin"]() {
    this["_setRendererPlaybackPin"](this["_shouldPinRendererForPlayback"]());
  }
  ["_prepareRendererMediaSlotSource"](_0x56f02a, _0x61e067 = {}) {
    const _0x4923f2 = String(_0x56f02a || '')['trim']();
    const _0x12f49d = globalThis["window"]?.['v2Renderer']?.["prepareMediaSlotSource"]?.(this['id'], _0x4923f2, {
      'slotIndex': 0x0,
      'rebind': _0x61e067?.["rebind"] === !![]
    });
    if (!_0x12f49d || String(_0x12f49d["sourceKey"] || '')["trim"]() !== _0x4923f2 || !Number["isInteger"](_0x12f49d["sourceEpoch"])) {
      this["_rendererMediaSlotToken"] = null;
      return null;
    }
    const _0x10836d = Object['freeze']({
      'sourceKey': _0x4923f2,
      'sourceEpoch': _0x12f49d["sourceEpoch"]
    });
    this["_rendererMediaSlotToken"] = _0x10836d;
    return _0x10836d;
  }
  ["_armFirstVideoFramePresentation"](_0x52e20a = this["_currentSrc"], _0xba86c7 = this["_rendererMediaSlotToken"]) {
    const _0x405ddc = String(_0x52e20a || '')["trim"]();
    const _0x2e403e = this['_video'];
    if (!_0x2e403e || !_0x405ddc) {
      return ![];
    }
    if (this['_isCurrentRendererMediaSlotToken'](_0x405ddc, _0xba86c7) && hasReportedSourceVideoMediaSlotFrame(this, {
      'sourceKey': _0x405ddc,
      'mediaSlotToken': _0xba86c7
    }) && hasPresentedVideoFrame(_0x2e403e, _0x405ddc)) {
      return !![];
    }
    if (!_0x2e403e['style']) {
      _0x2e403e['style'] = {};
    }
    _0x2e403e["style"]["display"] = "block";
    _0x2e403e["style"]["opacity"] = '1';
    _0x2e403e["style"]["visibility"] = "visible";
    return watchVideoFramePresentation(_0x2e403e, () => scheduleSourceVideoFramePresentationCommit(this, _0x405ddc, _0xba86c7));
  }
  ['_isCurrentRendererMediaSlotToken'](_0x4016f9, _0x377b5f) {
    if (!_0x377b5f) {
      return !![];
    }
    const _0x29eff5 = this["_rendererMediaSlotToken"];
    return !!(_0x29eff5 && _0x29eff5['sourceKey'] === String(_0x4016f9 || '')['trim']() && _0x29eff5['sourceEpoch'] === _0x377b5f['sourceEpoch'] && _0x29eff5["sourceKey"] === _0x377b5f["sourceKey"]);
  }
  ["_removeNativePosterForPresentedSource"](_0x378e19 = this["_currentSrc"], _0x3f5de7 = this["_rendererMediaSlotToken"], _0x177228 = null) {
    const _0x56251f = String(_0x378e19 || '')["trim"]();
    const _0xfe38cf = this["_video"];
    if (!_0xfe38cf || !_0xfe38cf["poster"] || !_0x56251f || this["_currentSrc"] !== _0x56251f || !this['_isCurrentRendererMediaSlotToken'](_0x56251f, _0x3f5de7)) {
      return ![];
    }
    const _0x94d0b5 = _0x177228 || this["_getRendererVideoPresentationFacts"]();
    if (_0x94d0b5['domConnected'] !== !![] || _0x94d0b5['readyState'] < 0x2 || _0x94d0b5['videoWidth'] <= 0x0 || _0x94d0b5['videoHeight'] <= 0x0 || _0x94d0b5["error"] || _0x94d0b5["rvfcObserved"] !== !![] || _0x94d0b5["cssDisplayVisible"] !== !![] || _0x94d0b5["cssVisibilityVisible"] !== !![] || _0x94d0b5["cssOpacityVisible"] !== !![] || _0x94d0b5["overlayClear"] !== !![]) {
      return ![];
    }
    _0xfe38cf["removeAttribute"]?.('poster');
    return !_0xfe38cf['poster'];
  }
  ["_restorePausedFirstFrameNudge"](_0x2511ea = this["_currentSrc"]) {
    const _0x401528 = this["_pausedFirstFrameNudge"];
    if (!_0x401528 || _0x401528["sourceKey"] !== String(_0x2511ea || '')["trim"]()) {
      return ![];
    }
    this["_pausedFirstFrameNudge"] = null;
    if (_0x401528["timer"]) {
      clearTimeout(_0x401528["timer"]);
    }
    const _0x5c3d17 = this['_video'];
    if (!_0x5c3d17 || this["_currentSrc"] !== _0x401528["sourceKey"] || _0x5c3d17["paused"] !== !![] || Math["abs"](Number(_0x5c3d17['currentTime'] || 0x0) - _0x401528['nudgedTime']) > 0.0005) {
      return ![];
    }
    try {
      _0x5c3d17['currentTime'] = _0x401528["originalTime"];
      return !![];
    } catch {
      return ![];
    }
  }
  ["_nudgePausedVideoForFirstFrame"](_0x72a0ef = this["_currentSrc"]) {
    const _0x52be67 = String(_0x72a0ef || '')["trim"]();
    const _0x247816 = this["_video"];
    if (!_0x247816 || !_0x52be67 || this["_currentSrc"] !== _0x52be67 || _0x247816["paused"] !== !![] || Number(_0x247816["readyState"] || 0x0) < 0x2 || Number(_0x247816['videoWidth'] || 0x0) <= 0x0 || Number(_0x247816["videoHeight"] || 0x0) <= 0x0 || hasPresentedVideoFrame(_0x247816, _0x52be67) || this["_pausedFirstFrameNudge"]?.['sourceKey'] === _0x52be67) {
      return ![];
    }
    const _0x1a0674 = Number(_0x247816["currentTime"] || 0x0);
    const _0x10319c = Number(_0x247816["duration"] || 0x0);
    const _0xbe674d = 0.001;
    const _0x20c314 = Number["isFinite"](_0x10319c) && _0x10319c > _0xbe674d && _0x1a0674 + _0xbe674d >= _0x10319c ? Math["max"](0x0, _0x1a0674 - _0xbe674d) : _0x1a0674 + _0xbe674d;
    if (_0x20c314 === _0x1a0674) {
      return ![];
    }
    const _0x41c97a = {
      'sourceKey': _0x52be67,
      'originalTime': _0x1a0674,
      'nudgedTime': _0x20c314,
      'timer': null
    };
    this["_pausedFirstFrameNudge"] = _0x41c97a;
    _0x41c97a["timer"] = setTimeout(() => {
      this["_restorePausedFirstFrameNudge"](_0x52be67);
    }, 0xfa);
    try {
      _0x247816["currentTime"] = _0x20c314;
      return !![];
    } catch {
      this['_restorePausedFirstFrameNudge'](_0x52be67);
      return ![];
    }
  }
  ["_releaseFastPreviewForPlaybackIfReady"](_0x4bb727 = this["_rendererMediaSlotToken"], _0x5f43cb = null) {
    const _0xf2ddcb = String(this['_currentSrc'] || '')["trim"]();
    if (!_0xf2ddcb || _0x4bb727?.["sourceKey"] !== _0xf2ddcb || !Number['isInteger'](_0x4bb727?.['sourceEpoch']) || !this['_isVideoFrameReadyToShow']()) {
      return ![];
    }
    return reportSourceVideoMediaSlotFrameOnce(this, {
      'sourceKey': _0xf2ddcb,
      'mediaSlotToken': _0x4bb727,
      'presentationFacts': _0x5f43cb
    });
  }
  ["_isVideoFrameReadyToShow"]() {
    return hasPresentedVideoFrame(this["_video"], this["_currentSrc"]);
  }
  ["getRendererMediaState"]() {
    return {
      'deferred': this['_rendererMediaDeferred'] === !![],
      'interactionActive': !!(this["_isHovered"] || this["_isManualControl"] || this['_isManualLoopPlayback'] || this["_isSeeking"])
    };
  }
  ["hasPresentedRendererMedia"]() {
    return !!(this['_video'] && getVideoCurrentSource(this['_video']) && this["_isVideoFrameReadyToShow"]());
  }
  ["_getRendererVideoPresentationFacts"]() {
    const _0x29d7e5 = this["_video"];
    const _0x461365 = _0x31c938 => {
      if (!_0x31c938 || _0x31c938["isConnected"] === ![]) {
        return ![];
      }
      let _0x21cab3 = _0x31c938;
      while (_0x21cab3 && _0x21cab3 !== globalThis['document']) {
        const _0x1add40 = typeof globalThis["getComputedStyle"] === "function" ? globalThis['getComputedStyle'](_0x21cab3) : _0x21cab3["style"] || {};
        if (_0x1add40?.["display"] === 'none' || _0x1add40?.["visibility"] === "hidden" || Number["parseFloat"](_0x1add40?.["opacity"] ?? '1') === 0x0) {
          return ![];
        }
        _0x21cab3 = _0x21cab3["parentElement"] || _0x21cab3["parentNode"];
      }
      return !![];
    };
    const _0x41e844 = this['_posterFrame']?.["classList"]?.["contains"]?.("is-visible") === !![];
    const _0x4ab92f = !!(this['_card']?.["classList"]?.["contains"]?.('img-preview-loading') || this["_card"]?.["querySelector"]?.(".img-loading-overlay"));
    const _0x159045 = _0x29d7e5?.["style"] || {};
    const _0x130241 = _0x461365(_0x29d7e5);
    return {
      'domConnected': _0x29d7e5?.["isConnected"] === !![],
      'readyState': Number(_0x29d7e5?.["readyState"] || 0x0),
      'videoWidth': Number(_0x29d7e5?.["videoWidth"] || 0x0),
      'videoHeight': Number(_0x29d7e5?.["videoHeight"] || 0x0),
      'error': _0x29d7e5?.['error'] || null,
      'rvfcObserved': hasPresentedVideoFrame(_0x29d7e5, this["_currentSrc"]),
      'cssDisplayVisible': _0x159045['display'] !== "none" && _0x130241,
      'cssVisibilityVisible': _0x159045["visibility"] !== 'hidden' && _0x130241,
      'cssOpacityVisible': Number["parseFloat"](_0x159045["opacity"] || '1') > 0x0 && _0x130241,
      'overlayClear': !_0x41e844 && !_0x4ab92f
    };
  }
  ["_isPosterFrameReadyToShow"]() {
    if (!this["_posterFrame"] || !this["_getPosterFrameSrc"]()) {
      return ![];
    }
    if (typeof this["_posterFrame"]["complete"] !== "boolean") {
      return !![];
    }
    return this["_posterFrame"]['complete'] === !![] && Number(this["_posterFrame"]['naturalWidth'] || 0x0) > 0x0;
  }
  ['_syncVideoElementFrameVisibility']({
    forceHidden = ![]
  } = {}) {
    if (!this['_video']) {
      return;
    }
    if (!this["_video"]["style"]) {
      this["_video"]['style'] = {};
    }
    const _0x35e12a = !!getVideoCurrentSource(this['_video']);
    if (!_0x35e12a) {
      this["_video"]['style']["display"] = "none";
      this["_video"]["style"]['opacity'] = '';
      this["_video"]["style"]['visibility'] = '';
      return;
    }
    this["_video"]['style']['display'] = "block";
    if (!String(this["_lastPosterSrc"] || '')["trim"]()) {
      this["_video"]["style"]["opacity"] = '1';
      this["_video"]["style"]["visibility"] = 'visible';
      return;
    }
    const _0x1f82a8 = this['_getPosterFrameSrc']();
    const _0x2ed6db = Number(this["_video"]["readyState"] || 0x0) >= 0x2 && !!_0x1f82a8 && typeof this['_posterFrame']?.["complete"] === 'boolean' && !this["_isPosterFrameReadyToShow"]();
    const _0x4e7d30 = _0x2ed6db || !forceHidden && this["_isVideoFrameReadyToShow"]();
    this["_video"]["style"]['opacity'] = _0x4e7d30 ? '1' : '0';
    this['_video']['style']['visibility'] = _0x4e7d30 ? "visible" : "hidden";
  }
  ["_syncPosterFrameVisibility"](_0x57c4bf = {}) {
    this["_syncVideoElementFrameVisibility"]();
    if (!this['_posterFrame']) {
      return;
    }
    const _0x29a813 = String(this["_lastPosterSrc"] || '')["trim"]();
    if (!_0x29a813) {
      this["_setPosterFrameVisible"](![]);
      return;
    }
    if (Object["prototype"]["hasOwnProperty"]['call'](_0x57c4bf, 'force')) {
      this['_setPosterFrameVisible'](!!_0x57c4bf["force"]);
      _0x57c4bf['force'] === !![] && this["_syncVideoElementFrameVisibility"]({
        'forceHidden': !![]
      });
      return;
    }
    if (this["_isVideoFrameReadyToShow"]()) {
      this["_setPosterFrameVisible"](![]);
      return;
    }
    this['_setPosterFrameVisible'](!![]);
  }
  ["_clearVideoElementSource"]({
    load = !![],
    invalidateRendererSlot = !![]
  } = {}) {
    if (!this['_video']) {
      return;
    }
    if (invalidateRendererSlot) {
      const _0x4136c1 = String(this['_rendererMediaSlotToken']?.["sourceKey"] || this['_currentSrc'] || '')["trim"]();
      this["_prepareRendererMediaSlotSource"](_0x4136c1, {
        'rebind': !![]
      });
      this["_rendererMediaSlotToken"] = null;
    }
    this["_cancelProgressLoop"]();
    const _0x149064 = this['_pausedFirstFrameNudge'];
    this["_pausedFirstFrameNudge"] = null;
    if (_0x149064?.["timer"]) {
      clearTimeout(_0x149064["timer"]);
    }
    resetVideoFramePresentation(this["_video"]);
    clearDesktopMediaPlaybackSourceMetadata(this['_video']);
    this['_video']["removeAttribute"]?.("src");
    this['_releasePlaybackObjectUrl']();
    if (load !== ![]) {
      try {
        this["_video"]["load"]?.();
      } catch {}
    }
  }
  ["_releasePlaybackObjectUrl"]() {
    this['_playbackBlobFetchController']?.["abort"]?.();
    this['_playbackBlobFetchController'] = null;
    const _0x6707f1 = String(this['_objUrl'] || '')["trim"]();
    const _0x41870c = releaseLocalVideoPlaybackObjectUrlOwner("source-video:" + this['id'] + ":playback");
    this["_objUrl"] = null;
    this["_objUrlSource"] = '';
    _0x6707f1 && !_0x41870c && revokeTrackedMediaObjectUrl(_0x6707f1);
  }
  async ["_resolveLocalPlaybackObjectUrl"](_0x66cfcd, {
    resultMode = "legacy"
  } = {}) {
    const _0xc0a90a = resultMode === "typed";
    const _0x42e0f3 = (_0x244022, _0x2e5012 = '', _0x59d446 = 0x0) => _0xc0a90a ? {
      'status': _0x244022,
      'playbackUrl': _0x2e5012,
      'httpStatus': Number(_0x59d446 || 0x0)
    } : _0x2e5012;
    const _0x50e0f1 = String(_0x66cfcd || '')["trim"]();
    if (!_0x50e0f1) {
      return _0x42e0f3("empty-url");
    }
    let _0x4bf593;
    try {
      _0x4bf593 = new URL(_0x50e0f1, globalThis['location']?.["href"] || globalThis['window']?.['location']?.['href']);
    } catch {
      return _0x42e0f3("invalid-url");
    }
    const _0x24b6ed = String(globalThis['location']?.['origin'] || globalThis["window"]?.["location"]?.["origin"] || '');
    if (!_0x24b6ed || _0x4bf593["origin"] !== _0x24b6ed || !/^\/(?:output|data\/assets|data\/uploads)\//i['test'](_0x4bf593['pathname'])) {
      return _0x42e0f3("not-local");
    }
    const _0x1b2bb4 = _0x4bf593["href"];
    if (this["_hardMissingPlaybackSource"] === _0x1b2bb4) {
      return _0x42e0f3('hard-missing', '', this["_hardMissingPlaybackStatus"] || 0x194);
    }
    if (this["_objUrl"] && this["_objUrlSource"] === _0x1b2bb4) {
      return _0x42e0f3('ready', this["_objUrl"]);
    }
    const _0x95be02 = typeof AbortController === "function" ? new AbortController() : null;
    this['_playbackBlobFetchController']?.["abort"]?.();
    this['_playbackBlobFetchController'] = _0x95be02;
    try {
      const _0x8a922f = await acquireLocalVideoPlaybackObjectUrlResult(_0x1b2bb4, "source-video:" + this['id'] + ":playback", {
        'signal': _0x95be02?.["signal"],
        'timeout': SOURCE_VIDEO_LOCAL_BLOB_FETCH_TIMEOUT_MS,
        'maxBytes': SOURCE_VIDEO_LOCAL_BLOB_MAX_BYTES
      });
      if (_0x8a922f?.['status'] === 'hard-missing') {
        this["_hardMissingPlaybackSource"] = _0x1b2bb4;
        this["_hardMissingPlaybackStatus"] = Number(_0x8a922f["httpStatus"] || 0x0);
        return _0x42e0f3("hard-missing", '', _0x8a922f['httpStatus']);
      }
      if (_0x8a922f?.['status'] === "aborted") {
        return _0x42e0f3('aborted');
      }
      const _0x33a2c5 = String(_0x8a922f?.['playbackUrl'] || '')["trim"]();
      if (!_0x33a2c5 || this["_playbackBlobFetchController"] !== _0x95be02) {
        globalThis["window"]?.["__runtimeCompareMark"]?.("source-video-playback:blob-discarded", {
          'nodeId': this['id'],
          'sourceUrl': _0x1b2bb4,
          'hasBlob': !!_0x33a2c5,
          'controllerMatches': this["_playbackBlobFetchController"] === _0x95be02,
          'status': String(_0x8a922f?.["status"] || "failed")
        });
        return _0x42e0f3(this['_playbackBlobFetchController'] === _0x95be02 ? String(_0x8a922f?.["status"] || "failed") : "aborted");
      }
      this["_playbackBlobFetchController"] === _0x95be02 && (this["_playbackBlobFetchController"] = null);
      this["_objUrl"] = _0x33a2c5;
      this['_objUrlSource'] = _0x1b2bb4;
      return _0x42e0f3("ready", _0x33a2c5);
    } catch (_0x4df64b) {
      return _0x42e0f3(_0x4df64b?.["name"] === "AbortError" ? 'aborted' : "failed");
    } finally {
      this["_playbackBlobFetchController"] === _0x95be02 && (this["_playbackBlobFetchController"] = null);
    }
  }
  ["_applyHardMissingPlaybackState"](_0x4c51ed, _0x4ad405 = 0x0) {
    stopLoading(this["_card"]);
    this['_video'] && (this["_video"]["style"]["opacity"] = '0', this['_video']["style"]["visibility"] = "hidden");
    this["_setPosterFrameVisible"](!![]);
    const _0x3dfea7 = a517_0x501c15["getStateRaw"]?.()["nodes"]?.[this['id']] || a517_0x501c15["getState"]()["nodes"]?.[this['id']] || this["_data"] || null;
    const _0x2ca260 = getVideoSourceKey(_0x3dfea7);
    const _0x1d2b94 = urlToLocalPath(_0x4c51ed);
    const _0x3083ed = urlToLocalPath(_0x2ca260);
    const _0x24cbfa = !!_0x2ca260 && (_0x2ca260 === String(_0x4c51ed || '')['trim']() || !!_0x1d2b94 && _0x1d2b94 === _0x3083ed);
    if (_0x24cbfa && (_0x3dfea7["mediaUnavailable"] !== !![] || String(_0x3dfea7["mediaUnavailableSource"] || '')["trim"]() !== _0x2ca260)) {
      const _0x169e95 = {
        'mediaUnavailable': !![],
        'mediaUnavailableSource': _0x2ca260
      };
      a517_0x501c15['updateNodeData'](this['id'], _0x169e95);
      this["_data"] = {
        ..._0x3dfea7,
        ..._0x169e95
      };
    }
    globalThis["window"]?.["__runtimeCompareMark"]?.("source-video-playback:hard-missing", {
      'nodeId': this['id'],
      'sourceUrl': String(_0x4c51ed || ''),
      'status': Number(_0x4ad405 || 0x0)
    });
  }
  ["_isHardMissingPlaybackSource"](_0x2925b5) {
    const _0x5a3896 = String(this["_hardMissingPlaybackSource"] || '')["trim"]();
    const _0x56ad9d = String(_0x2925b5 || '')["trim"]();
    if (!_0x5a3896 || !_0x56ad9d) {
      return ![];
    }
    if (_0x56ad9d === _0x5a3896) {
      return !![];
    }
    try {
      return new URL(_0x56ad9d, globalThis["location"]?.["href"] || globalThis["window"]?.["location"]?.["href"])["href"] === _0x5a3896;
    } catch {
      return ![];
    }
  }
  ['_resolveVideoSrc'](_0x2f137a) {
    return resolveCanvasVideoUrl(_0x2f137a) || this["_getCapturePreviewUrl"](_0x2f137a);
  }
  ['_shouldDeferActivePlaybackSourceChange'](_0x2c47c9) {
    const _0x33b150 = String(_0x2c47c9 || '')["trim"]();
    const _0x56733b = String(this["_currentSrc"] || '')["trim"]();
    if (_0x33b150 === _0x56733b) {
      return ![];
    }
    const _0x653597 = this["_video"];
    if (!_0x653597 || _0x653597["isConnected"] === ![] || _0x653597["paused"] !== ![]) {
      return ![];
    }
    return !!(getVideoCurrentSource(_0x653597) || _0x653597['dataset']?.["desktopMediaSourceUrl"] || this['_objUrl']);
  }
  ["_setPendingPlaybackSource"](_0x2d568) {
    this['_invalidatePendingPlaybackResume']();
    this["_pendingPlaybackSource"] = String(_0x2d568 || '')['trim']();
    this["_hasPendingPlaybackSource"] = !![];
  }
  ["_clearPendingPlaybackSource"]() {
    this["_pendingPlaybackSource"] = '';
    this["_hasPendingPlaybackSource"] = ![];
  }
  ["_invalidatePendingPlaybackResume"]() {
    this["_playbackResumeGeneration"] = Number(this["_playbackResumeGeneration"] || 0x0) + 0x1;
    this["_pendingPlaybackResume"] = null;
  }
  ['_replacePendingPlaybackResume'](_0x26bc08, _0x4bf9c7) {
    this["_invalidatePendingPlaybackResume"]();
    const _0x4912de = String(_0x26bc08 || '')['trim']();
    const _0x32727c = Number(_0x4bf9c7);
    if (!_0x4912de || !Number['isFinite'](_0x32727c) || _0x32727c <= 0x0) {
      return ![];
    }
    this['_pendingPlaybackResume'] = {
      'generation': this["_playbackResumeGeneration"],
      'source': _0x4912de,
      'time': _0x32727c
    };
    return !![];
  }
  ["_applyPendingPlaybackResume"](_0x4ae39a = this["_video"]) {
    const _0xf53c1f = this['_pendingPlaybackResume'];
    if (!_0xf53c1f || !_0x4ae39a || _0x4ae39a !== this["_video"]) {
      return ![];
    }
    if (_0xf53c1f["generation"] !== this['_playbackResumeGeneration']) {
      this['_pendingPlaybackResume'] = null;
      return ![];
    }
    const _0x5dfe86 = String(_0xf53c1f["source"] || '')["trim"]();
    if (_0x5dfe86 !== String(this["_currentSrc"] || '')['trim']()) {
      this["_invalidatePendingPlaybackResume"]();
      return ![];
    }
    if (Number(_0x4ae39a["readyState"] || 0x0) < 0x1 || !isMediaElementPlaybackSource(_0x4ae39a, _0x5dfe86)) {
      return ![];
    }
    const _0x343861 = Number(_0x4ae39a["duration"]);
    if (!Number['isFinite'](_0x343861) || _0x343861 <= 0x0) {
      return ![];
    }
    const _0x3ea8a5 = Number(_0xf53c1f['time']);
    const _0x26949a = Math["min"](Math["max"](0x0, _0x3ea8a5), Math["max"](0x0, _0x343861 - 0.05));
    try {
      _0x4ae39a['currentTime'] = _0x26949a;
    } catch {
      return ![];
    }
    this["_pendingPlaybackResume"] === _0xf53c1f && _0xf53c1f['generation'] === this["_playbackResumeGeneration"] && (this["_pendingPlaybackResume"] = null);
    return !![];
  }
  ['_applyPendingPlaybackSourceAtBoundary']() {
    if (this["_hasPendingPlaybackSource"] !== !![] || this["_rendererMediaDeferred"] === !![] || this['_video']?.['paused'] === ![]) {
      return ![];
    }
    const _0x2004e7 = a517_0x501c15["getStateRaw"]()["nodes"]?.[this['id']] || this['_data'];
    const _0x11df5e = String(this['_resolveVideoSrc'](_0x2004e7) || '')["trim"]();
    const _0x153245 = Number(this['_video']?.["currentTime"]);
    const _0x1da8ab = Number(this["_video"]?.["duration"]);
    const _0x5ea846 = this["_video"]?.['ended'] === !![] || Number["isFinite"](_0x153245) && Number["isFinite"](_0x1da8ab) && _0x1da8ab > 0x0 && _0x153245 >= Math["max"](0x0, _0x1da8ab - 0.05);
    const _0x1a77dc = !_0x5ea846 && this["_shouldKeepReadyCapturePreview"](_0x11df5e) ? _0x153245 : 0x0;
    this["_clearPendingPlaybackSource"]();
    if (_0x11df5e === String(this["_currentSrc"] || '')["trim"]()) {
      return ![];
    }
    this["_data"] = _0x2004e7;
    this['_loadVideo'](_0x11df5e, {
      'forceCapturePreviewPromotion': !![],
      ...(Number["isFinite"](_0x1a77dc) && _0x1a77dc > 0x0 ? {
        'resumePlaybackTime': _0x1a77dc
      } : {})
    });
    this["_clearStoredCapturePreviewAfterSourcePromotion"](_0x11df5e);
    return !![];
  }
  ['_promotePendingProxyAtMediaSegmentBoundary'](_0x162ff2 = null) {
    const _0x27a71b = _0x162ff2 || a517_0x501c15["getStateRaw"]()['nodes']?.[this['id']] || this["_data"] || null;
    const _0x4da771 = buildCanvasVideoProxyPromotionPatch(_0x27a71b);
    if (!_0x4da771) {
      return _0x27a71b;
    }
    const _0x53fd56 = !!(this["_video"]?.["getAttribute"]?.("src") || this['_video']?.['dataset']?.["desktopMediaSourceUrl"] || this["_objUrl"] || this["_playbackBlobFetchController"] || this["_playbackSourcePromise"]);
    if (_0x53fd56) {
      return _0x27a71b;
    }
    a517_0x501c15["updateNodeData"](this['id'], _0x4da771);
    const _0x1920aa = a517_0x501c15['getStateRaw']()["nodes"]?.[this['id']] || {
      ..._0x27a71b,
      ..._0x4da771
    };
    this["_data"] = _0x1920aa;
    return _0x1920aa;
  }
  ["_importLocalStagedAsset"](_0x3474f1, _0x2b603f) {
    return importLocalStagedAsset(_0x3474f1, _0x2b603f);
  }
  ["_discardLocalStagedAsset"](_0x4f046b) {
    return discardLocalStagedAsset(_0x4f046b);
  }
  ["_clearCanonicalAssetImportRetry"]() {
    const _0x34c284 = this['_canonicalAssetImportRetryTimer'];
    this['_canonicalAssetImportRetryTimer'] = null;
    if (_0x34c284 == null) {
      return;
    }
    const _0x5afe52 = globalThis["window"]?.["clearTimeout"] || globalThis["clearTimeout"];
    try {
      _0x5afe52?.(_0x34c284);
    } catch {}
  }
  ["_invalidateCanonicalAssetImportRetry"]() {
    this['_clearCanonicalAssetImportRetry']();
    this['_canonicalAssetImportRetryGeneration'] = Number(this['_canonicalAssetImportRetryGeneration'] || 0x0) + 0x1;
  }
  ["_scheduleCanonicalAssetImportRetry"](_0x55c8bf, _0x159868 = SOURCE_VIDEO_CANONICAL_IMPORT_RETRY_MS) {
    const _0x3925b6 = String(_0x55c8bf || '')["trim"]();
    if (!_0x3925b6 || this["_canonicalAssetImportDisposed"] === !![]) {
      return ![];
    }
    this['_clearCanonicalAssetImportRetry']();
    const _0x2db8b8 = globalThis["window"]?.["setTimeout"] || globalThis["setTimeout"];
    if (typeof _0x2db8b8 !== "function") {
      return ![];
    }
    const _0x301486 = Number(this["_canonicalAssetImportRetryGeneration"] || 0x0) + 0x1;
    this["_canonicalAssetImportRetryGeneration"] = _0x301486;
    const _0x1c6d8b = _0x2db8b8(() => {
      this["_canonicalAssetImportRetryTimer"] === _0x1c6d8b && (this['_canonicalAssetImportRetryTimer'] = null);
      if (this["_canonicalAssetImportDisposed"] === !![] || Number(this["_canonicalAssetImportRetryGeneration"] || 0x0) !== _0x301486) {
        return;
      }
      const _0x5135 = a517_0x501c15['getStateRaw']()["nodes"]?.[this['id']];
      if (!_0x5135 || _0x5135['assetId'] || resolveSourceVideoMediaTaskSrc(_0x5135) !== _0x3925b6) {
        return;
      }
      void this["_requestCanonicalAssetImport"](_0x5135);
    }, Math['max'](0x0, Number(_0x159868) || 0x0));
    this["_canonicalAssetImportRetryTimer"] = _0x1c6d8b;
    return !![];
  }
  ['_requestCanonicalAssetImport'](_0x38e8d3 = this['_data']) {
    if (!desktopBridge["isChromeShell"]) {
      return null;
    }
    if (!_0x38e8d3 || _0x38e8d3["assetId"]) {
      this["_invalidateCanonicalAssetImportRetry"]();
      return null;
    }
    const _0x46638f = resolveSourceVideoMediaTaskSrc(_0x38e8d3);
    if (!_0x46638f["startsWith"]("data/uploads/")) {
      this["_invalidateCanonicalAssetImportRetry"]();
      return null;
    }
    this['_canonicalAssetImportSource'] && this["_canonicalAssetImportSource"] !== _0x46638f && this["_invalidateCanonicalAssetImportRetry"]();
    if (this["_canonicalAssetImportSource"] === _0x46638f && this["_canonicalAssetImportPromise"]) {
      return this["_canonicalAssetImportPromise"];
    }
    const _0x4dc16a = Date["now"]() - Number(this["_canonicalAssetImportFailedAt"] || 0x0);
    if (this['_canonicalAssetImportSource'] === _0x46638f && _0x4dc16a < SOURCE_VIDEO_CANONICAL_IMPORT_RETRY_MS) {
      this["_canonicalAssetImportRetryTimer"] == null && this['_scheduleCanonicalAssetImportRetry'](_0x46638f, SOURCE_VIDEO_CANONICAL_IMPORT_RETRY_MS - Math['max'](0x0, _0x4dc16a));
      return null;
    }
    this["_canonicalAssetImportSource"] = _0x46638f;
    const _0x23ed1f = Promise['resolve']()["then"](() => this["_importLocalStagedAsset"](_0x46638f, {
      'name': _0x38e8d3["fileName"] || _0x38e8d3["name"],
      'type': _0x38e8d3["mimeType"] || _0x38e8d3['fileType'] || '',
      'projectId': globalThis["window"]?.["currentProjectId"] || "default_v2_project"
    }))["then"](_0x207648 => {
      if (!_0x207648?.["success"] || !_0x207648['assetId']) {
        throw new Error('Canonical\x20asset\x20import\x20returned\x20no\x20assetId');
      }
      const _0x3fb90f = a517_0x501c15['getStateRaw']()["nodes"]?.[this['id']];
      if (!_0x3fb90f || _0x3fb90f["assetId"]) {
        return null;
      }
      if (resolveSourceVideoMediaTaskSrc(_0x3fb90f) !== _0x46638f) {
        return null;
      }
      const _0x2b13ae = String(_0x207648["videoProxyStatus"] || '')["trim"]();
      const _0xaeda0e = _0x2b13ae === "processing" || _0x2b13ae === "waiting";
      const _0x43e8d8 = _0x207648["localPath"] || _0x207648["originalLocalPath"] || _0x46638f;
      const _0x2f3791 = _0xaeda0e ? _0x46638f : _0x207648["displayLocalPath"] || '';
      const _0x547fa3 = _0xaeda0e ? _0x3fb90f['src'] || localPathToUrl(_0x46638f) : _0x207648['displayUrl'] || _0x207648['url'] || localPathToUrl(_0x2f3791 || _0x43e8d8);
      const _0x4f12cc = String(_0x3fb90f["stagedUploadId"] || '')['trim']();
      const _0x17096d = {
        'assetId': _0x207648["assetId"],
        'assetRevision': Number(_0x207648["assetRevision"] || 0x0) || 0x0,
        'assetUpdatedAt': _0x207648['assetUpdatedAt'] || _0x207648["updatedAt"] || '',
        'src': _0x547fa3,
        'localPath': _0xaeda0e ? _0x3fb90f["localPath"] || _0x46638f : _0x43e8d8,
        'originalLocalPath': _0x207648['originalLocalPath'] || _0x43e8d8,
        'displayLocalPath': _0x2f3791,
        'posterLocalPath': _0x207648['posterLocalPath'] || _0x3fb90f["posterLocalPath"] || '',
        'thumbLocalPath': _0x207648['posterLocalPath'] || _0x207648['thumbLocalPath'] || _0x3fb90f["thumbLocalPath"] || '',
        'thumbUrl': _0x207648['posterUrl'] || _0x207648["thumbUrl"] || _0x3fb90f['thumbUrl'] || '',
        'derivativeStatus': _0x207648["derivativeStatus"] || _0x207648["status"] || _0x3fb90f["derivativeStatus"] || '',
        'mediaTaskId': _0x207648['mediaTaskId'] || '',
        'mediaTaskKind': _0x207648['mediaTaskKind'] || '',
        'mediaTaskStatus': _0x207648["mediaTaskStatus"] || '',
        'mediaTaskProgress': Number(_0x207648['mediaTaskProgress'] || 0x0) || 0x0,
        'mediaTaskError': _0x207648["mediaTaskError"] || '',
        'videoProxyStatus': _0x2b13ae,
        'videoProxyVersion': _0x207648["videoProxyVersion"] || '',
        'videoCodec': _0x207648["videoCodec"] || _0x3fb90f['videoCodec'] || '',
        'videoDuration': Number(_0x207648["videoDuration"] || _0x3fb90f["videoDuration"] || 0x0) || 0x0,
        'videoFps': Number(_0x207648["videoFps"] || _0x3fb90f['videoFps'] || 0x0) || 0x0,
        'videoWidth': Number(_0x207648["videoWidth"] || _0x3fb90f['videoWidth'] || 0x0) || 0x0,
        'videoHeight': Number(_0x207648["videoHeight"] || _0x3fb90f["videoHeight"] || 0x0) || 0x0,
        'fileSize': Number(_0x207648["size"] || _0x3fb90f["fileSize"] || 0x0) || 0x0,
        'fileName': _0x207648['filename'] || _0x3fb90f['fileName'] || _0x38e8d3["fileName"] || '',
        'stagedUploadId': '',
        'canonicalImportPending': ![],
        'canonicalImportStatus': "succeeded",
        'canonicalImportError': ''
      };
      a517_0x501c15["updateNodeData"](this['id'], _0x17096d);
      this["_data"] = {
        ..._0x3fb90f,
        ..._0x17096d
      };
      this["_canonicalAssetImportFailedAt"] = 0x0;
      this['_clearCanonicalAssetImportRetry']();
      _0x4f12cc && void Promise['resolve']()["then"](() => this['_discardLocalStagedAsset'](_0x4f12cc))["catch"](() => {});
      return _0x207648;
    })["catch"](_0x50cc65 => {
      const _0x4c8490 = a517_0x501c15['getStateRaw']()["nodes"]?.[this['id']];
      if (this["_canonicalAssetImportDisposed"] === !![] || !_0x4c8490 || _0x4c8490["assetId"] || resolveSourceVideoMediaTaskSrc(_0x4c8490) !== _0x46638f) {
        return null;
      }
      this["_canonicalAssetImportFailedAt"] = Date["now"]();
      const _0x2470f8 = {
        'canonicalImportPending': !![],
        'canonicalImportStatus': "failed",
        'canonicalImportError': String(_0x50cc65?.['message'] || _0x50cc65 || '')
      };
      a517_0x501c15['updateNodeData'](this['id'], _0x2470f8);
      this["_data"] = {
        ..._0x4c8490,
        ..._0x2470f8
      };
      this["_scheduleCanonicalAssetImportRetry"](_0x46638f, SOURCE_VIDEO_CANONICAL_IMPORT_RETRY_MS);
      console["warn"]("[SourceVideoNode] canonical asset import failed:", _0x50cc65);
      return null;
    })["finally"](() => {
      this["_canonicalAssetImportPromise"] === _0x23ed1f && (this["_canonicalAssetImportPromise"] = null);
    });
    this["_canonicalAssetImportPromise"] = _0x23ed1f;
    return _0x23ed1f;
  }
  ["_requestVisibleProxyMigration"]() {
    void this["_requestCanonicalAssetImport"]();
    void requestVisibleVideoProxyMigration(this['id'])["catch"](_0x52c081 => {
      console["warn"]('[SourceVideoNode]\x20failed\x20to\x20enqueue\x20legacy\x20proxy\x20migration:', _0x52c081);
    });
  }
  ['_clearResolvedVideoTimer'](_0x5e0293, _0x327382) {
    if (!_0x327382 || !_0x5e0293 || typeof _0x5e0293 !== "object") {
      return;
    }
    const _0x43e3df = !!String(_0x5e0293["rhTaskId"] || _0x5e0293["asyncTaskId"] || _0x5e0293["dreaminaSubmitId"] || '')["trim"]() || _0x5e0293["rhTaskRecovering"] === !![] || _0x5e0293["asyncTaskRecovering"] === !![] || _0x5e0293["dreaminaTaskRecovering"] === !![];
    if (_0x43e3df) {
      return;
    }
    if (!_0x5e0293['generationStartTime'] && _0x5e0293["generationDuration"] == null) {
      return;
    }
    const _0x4423d7 = a517_0x501c15["getState"]()['nodes']?.[this['id']];
    if (!_0x4423d7) {
      return;
    }
    const _0x2d4f4f = {};
    if (_0x4423d7["generationStartTime"]) {
      _0x2d4f4f["generationStartTime"] = null;
    }
    if (_0x4423d7['generationDuration'] != null) {
      _0x2d4f4f["generationDuration"] = null;
    }
    if (_0x4423d7["isGenerating"] === !![]) {
      _0x2d4f4f["isGenerating"] = ![];
    }
    Object["keys"](_0x2d4f4f)["length"] > 0x0 && a517_0x501c15["updateNodeData"](this['id'], _0x2d4f4f);
  }
  ["_clearMediaUnavailableAfterPlayback"](_0x4e242a) {
    const _0x40ee65 = a517_0x501c15["getState"]()["nodes"]?.[this['id']] || this["_data"] || null;
    if (!_0x40ee65 || _0x40ee65["mediaUnavailable"] !== !![]) {
      return;
    }
    const _0x4fd509 = String(_0x40ee65['mediaUnavailableSource'] || '')["trim"]();
    if (!_0x4fd509) {
      return;
    }
    const _0x58c543 = new Set();
    const _0x15508b = _0x30c2bf => {
      const _0x2b8f86 = String(_0x30c2bf || '')['trim']();
      if (!_0x2b8f86) {
        return;
      }
      _0x58c543["add"](_0x2b8f86);
      const _0x4c7a2c = urlToLocalPath(_0x2b8f86);
      if (_0x4c7a2c) {
        _0x58c543["add"](_0x4c7a2c);
      }
      const _0x4830e9 = localPathToUrl(_0x2b8f86);
      if (_0x4830e9) {
        _0x58c543["add"](_0x4830e9);
      }
    };
    [_0x40ee65["localPath"], _0x40ee65["displayLocalPath"], _0x40ee65["originalLocalPath"], _0x40ee65["videoLocalPath"], _0x40ee65["videoUrl"], _0x40ee65['src'], _0x40ee65['url'], _0x40ee65["resultUrl"], _0x40ee65['sourceUrl'], _0x4e242a]['forEach'](_0x15508b);
    if (!_0x58c543["has"](_0x4fd509)) {
      return;
    }
    a517_0x501c15["updateNodeData"](this['id'], {
      'mediaUnavailable': ![],
      'mediaUnavailableSource': ''
    });
  }
  ["_getCapturePreviewUrl"](_0x3fd2c6 = this["_data"]) {
    const _0x28c284 = String(_0x3fd2c6?.["capturePreviewUrl"] || '')['trim']();
    return _0x28c284["startsWith"]("blob:") || _0x28c284["startsWith"]("aic-local-preview:") ? _0x28c284 : '';
  }
  ["_revokeCapturePreviewUrl"](_0x2ce29e) {
    const _0x56a99b = String(_0x2ce29e || '')["trim"]();
    if (!_0x56a99b["startsWith"]('blob:')) {
      return;
    }
    const _0x25cf27 = globalThis["window"]?.["URL"] || globalThis["URL"];
    if (typeof _0x25cf27?.["revokeObjectURL"] !== "function") {
      return;
    }
    try {
      _0x25cf27['revokeObjectURL'](_0x56a99b);
    } catch {}
  }
  ["_adoptCapturePreviewUrl"](_0x26e69d) {
    const _0x5daf9a = String(_0x26e69d || '')["trim"]();
    this["_activeCapturePreviewUrl"] && this["_activeCapturePreviewUrl"] !== _0x5daf9a && this['_revokeCapturePreviewUrl'](this['_activeCapturePreviewUrl']);
    this["_activeCapturePreviewUrl"] = _0x5daf9a;
  }
  ["_releaseActiveCapturePreviewUrl"]() {
    if (!this["_activeCapturePreviewUrl"]) {
      return;
    }
    const _0x34eff1 = this['_activeCapturePreviewUrl'];
    this["_activeCapturePreviewUrl"] = '';
    this['_revokeCapturePreviewUrl'](_0x34eff1);
  }
  ["_clearStoredCapturePreviewAfterSourcePromotion"](_0x48643c) {
    const _0x8521a5 = String(_0x48643c || '')["trim"]();
    const _0x24164f = this["_getCapturePreviewUrl"](this['_data']);
    if (!_0x8521a5 || !_0x24164f || _0x8521a5 === _0x24164f) {
      return ![];
    }
    const _0x3383a2 = a517_0x501c15['getStateRaw']()['nodes']?.[this['id']];
    if (!_0x3383a2 || this["_getCapturePreviewUrl"](_0x3383a2) !== _0x24164f) {
      return ![];
    }
    a517_0x501c15["updateNodeData"](this['id'], {
      'capturePreviewUrl': ''
    });
    this["_data"] = {
      ..._0x3383a2,
      'capturePreviewUrl': ''
    };
    return !![];
  }
  ["_shouldKeepReadyCapturePreview"](_0x1b79ba) {
    const _0x12462a = String(this["_activeCapturePreviewUrl"] || '')['trim']();
    const _0x55134f = String(_0x1b79ba || '')["trim"]();
    if (!_0x12462a || !this["_video"] || Number(this["_video"]["readyState"] || 0x0) < 0x2) {
      return ![];
    }
    const _0x415f7f = getVideoCurrentSource(this["_video"]);
    const _0x196599 = this["_currentSrc"] === _0x12462a || _0x415f7f === _0x12462a;
    if (!_0x196599) {
      return ![];
    }
    if (!_0x55134f) {
      return this["_isUploading"] === !![];
    }
    if (_0x55134f === _0x12462a || /^(?:blob:|aic-local-preview:)/i["test"](_0x55134f)) {
      return ![];
    }
    return !![];
  }
  ['_resolveVideoMetaSrc'](_0x33e751) {
    if (!_0x33e751) {
      return '';
    }
    const _0x44da71 = resolveSourceVideoMediaTaskSrc(_0x33e751);
    if (_0x44da71) {
      return _0x44da71;
    }
    const _0x2117a5 = this['_resolveVideoSrc'](_0x33e751);
    if (!_0x2117a5) {
      return '';
    }
    const _0xb9eac8 = String(_0x2117a5);
    if (_0xb9eac8["startsWith"]("http://") || _0xb9eac8["startsWith"]("https://") || _0xb9eac8["startsWith"]("blob:") || _0xb9eac8['startsWith']("aic-local-preview:") || _0xb9eac8["startsWith"]('data:')) {
      return '';
    }
    return urlToLocalPath(_0xb9eac8) || '';
  }
  ["requestVideoMetaForNodeInfo"](_0x329e78 = this["_data"]) {
    const _0x4f91b4 = this["_resolveVideoMetaSrc"](_0x329e78);
    if (!_0x4f91b4) {
      return null;
    }
    const _0xcdcb1 = Date["now"]();
    if (this["_videoMetaInfoRequestSrc"] === _0x4f91b4 && _0xcdcb1 - Number(this['_videoMetaInfoRequestAt'] || 0x0) < 0x1388) {
      return this["_metaFetchPromise"] || null;
    }
    this["_videoMetaInfoRequestSrc"] = _0x4f91b4;
    this['_videoMetaInfoRequestAt'] = _0xcdcb1;
    this['_cancelDeferredVideoMetaFetch']();
    return this["_maybeFetchVideoMeta"](_0x329e78);
  }
  ["_cancelDeferredVideoMetaFetch"]() {
    if (!this["_deferredVideoMetaCancel"]) {
      return;
    }
    this['_deferredVideoMetaCancel']();
    this["_deferredVideoMetaCancel"] = null;
  }
  ["_scheduleDeferredVideoMetaFetch"](_0x42352f = this["_data"]) {
    this["_cancelDeferredVideoMetaFetch"]();
    this["_deferredVideoMetaCancel"] = scheduleSourceVideoIdleTask(() => {
      this["_deferredVideoMetaCancel"] = null;
      const _0x3d7503 = a517_0x501c15["getStateRaw"]()["nodes"]?.[this['id']] || _0x42352f || this["_data"];
      void this["_maybeFetchVideoMeta"](_0x3d7503);
    });
  }
  async ['_maybeFetchVideoMeta'](_0x3fe825) {
    const _0x4415b8 = this['_getNodeDuration'](_0x3fe825) <= 0x0;
    if (!_0x4415b8 && !shouldFetchVideoMetaForNodeInfo()) {
      return;
    }
    const _0x1a1bb6 = this["_resolveVideoMetaSrc"](_0x3fe825);
    if (!_0x1a1bb6) {
      return;
    }
    const _0x4f2d1a = a517_0x501c15["getState"]()["nodes"][this['id']];
    if (!_0x4f2d1a) {
      return;
    }
    if (this['_resolveVideoMetaSrc'](_0x4f2d1a) !== _0x1a1bb6) {
      return;
    }
    const _0x4d8300 = String(_0x4f2d1a['videoMetaSrc'] || '');
    const _0x5c5d06 = Number["isFinite"](Number(_0x4f2d1a['videoFps'])) && Number(_0x4f2d1a["videoFps"]) > 0x0 && Number['isFinite'](Number(_0x4f2d1a["videoFrameCount"])) && Number(_0x4f2d1a["videoFrameCount"]) > 0x0;
    if (_0x5c5d06 && _0x4d8300 === _0x1a1bb6) {
      return;
    }
    if (this["_metaFetchPromise"] && this["_metaFetchSrc"] === _0x1a1bb6) {
      return this["_metaFetchPromise"];
    }
    _0x4d8300 && _0x4d8300 !== _0x1a1bb6 && a517_0x501c15["updateNodeData"](this['id'], {
      'videoMetaSrc': _0x1a1bb6,
      'videoFps': null,
      'videoFrameCount': null
    });
    const _0x221684 = ++this["_metaFetchToken"];
    const _0x38e894 = (async () => {
      try {
        const _0x17fb4f = await fetchVideoMetaFromServer(_0x1a1bb6);
        if (_0x221684 !== this["_metaFetchToken"]) {
          return;
        }
        if (!_0x17fb4f || _0x17fb4f["success"] !== !![]) {
          return;
        }
        const _0xb4d836 = Number(_0x17fb4f['fps']);
        const _0x35b71b = Number(_0x17fb4f["frameCount"]);
        const _0x34a2b7 = Number(_0x17fb4f['duration']);
        const _0x593071 = Number(_0x17fb4f['width']);
        const _0x1e13fa = Number(_0x17fb4f["height"]);
        const _0x267193 = {
          'videoMetaSrc': _0x1a1bb6
        };
        if (Number["isFinite"](_0xb4d836) && _0xb4d836 > 0x0) {
          _0x267193["videoFps"] = _0xb4d836;
        }
        if (Number['isFinite'](_0x35b71b) && _0x35b71b > 0x0) {
          _0x267193["videoFrameCount"] = Math["round"](_0x35b71b);
        }
        if (Number["isFinite"](_0x34a2b7) && _0x34a2b7 > 0x0) {
          _0x267193['videoDuration'] = _0x34a2b7;
        }
        if (Number['isFinite'](_0x593071) && _0x593071 > 0x0) {
          _0x267193["videoWidth"] = Math['round'](_0x593071);
        }
        if (Number["isFinite"](_0x1e13fa) && _0x1e13fa > 0x0) {
          _0x267193["videoHeight"] = Math["round"](_0x1e13fa);
        }
        const _0x3439ea = a517_0x501c15["getState"]()['nodes'][this['id']];
        if (!_0x3439ea) {
          return;
        }
        if (this["_resolveVideoMetaSrc"](_0x3439ea) !== _0x1a1bb6) {
          return;
        }
        const _0x57a211 = String(_0x3439ea["videoMetaSrc"] || '') !== String(_0x267193["videoMetaSrc"] || '') || Number(_0x3439ea['videoFps'] || 0x0) !== Number(_0x267193["videoFps"] || 0x0) || Number(_0x3439ea["videoFrameCount"] || 0x0) !== Number(_0x267193["videoFrameCount"] || 0x0) || Number(_0x3439ea['videoDuration'] || 0x0) !== Number(_0x267193["videoDuration"] || 0x0) || Number(_0x3439ea["videoWidth"] || 0x0) !== Number(_0x267193["videoWidth"] || 0x0) || Number(_0x3439ea["videoHeight"] || 0x0) !== Number(_0x267193["videoHeight"] || 0x0);
        if (_0x57a211) {
          a517_0x501c15["updateNodeData"](this['id'], _0x267193);
        }
      } catch {} finally {
        this["_metaFetchPromise"] === _0x38e894 && (this['_metaFetchPromise'] = null, this["_metaFetchSrc"] = '');
      }
    })();
    this["_metaFetchSrc"] = _0x1a1bb6;
    this["_metaFetchPromise"] = _0x38e894;
    return _0x38e894;
  }
  ['_scheduleMaybeEnsureVideoThumb']() {
    if (this["_idleVideoThumbCancel"]) {
      return;
    }
    this['_idleVideoThumbCancel'] = scheduleSourceVideoIdleTask(() => {
      this["_idleVideoThumbCancel"] = null;
      void this["_maybeEnsureVideoThumb"](this["_data"]);
    });
  }
  async ["_maybeEnsureVideoThumb"](_0x33ea62) {
    if (isSourceVideoInteractionBusy()) {
      this["_scheduleMaybeEnsureVideoThumb"]();
      return;
    }
    const _0x1ef33b = this["_resolveVideoMetaSrc"](_0x33ea62);
    if (!_0x1ef33b) {
      return;
    }
    const _0xadfc5f = a517_0x501c15["getState"]()["nodes"][this['id']];
    if (!_0xadfc5f) {
      return;
    }
    const _0x281e16 = String(_0xadfc5f["videoThumbSrc"] || '');
    const _0x19b1f1 = !!String(_0xadfc5f["thumbUrl"] || '')["trim"]();
    if (_0x19b1f1 && _0x281e16 === _0x1ef33b) {
      return;
    }
    if (_0x281e16 === _0x1ef33b && ["waiting", "processing"]["includes"](String(_0xadfc5f["mediaTaskStatus"] || '')) && ["videoFirstFrame", "videoPoster"]["includes"](String(_0xadfc5f["mediaTaskKind"] || ''))) {
      return;
    }
    if (_0x281e16 && _0x281e16 !== _0x1ef33b) {
      a517_0x501c15['updateNodeData'](this['id'], {
        'videoThumbSrc': _0x1ef33b
      });
    } else {
      !_0x281e16 && a517_0x501c15['updateNodeData'](this['id'], {
        'videoThumbSrc': _0x1ef33b
      });
    }
    const _0x26e515 = ++this['_thumbFetchToken'];
    try {
      const _0x51ba6d = await fetchVideoFirstFrameThumbFromServer(_0x1ef33b, {
        'nodeId': this['id'],
        'assetId': String(_0xadfc5f["assetId"] || '')
      });
      if (_0x26e515 !== this["_thumbFetchToken"]) {
        return;
      }
      if (!_0x51ba6d || _0x51ba6d["success"] === ![]) {
        return;
      }
      const _0x474ff4 = String(_0x51ba6d["thumbUrl"] || _0x51ba6d["url"] || '')['trim']();
      if (!_0x474ff4) {
        return;
      }
      const _0x36e2e1 = a517_0x501c15["getState"]()["nodes"][this['id']];
      if (!_0x36e2e1) {
        return;
      }
      const _0x28fda1 = String(_0x36e2e1["videoThumbSrc"] || '') !== String(_0x1ef33b || '') || String(_0x36e2e1["thumbUrl"] || '') !== _0x474ff4;
      _0x28fda1 && a517_0x501c15["updateNodeData"](this['id'], {
        'videoThumbSrc': _0x1ef33b,
        'thumbUrl': _0x474ff4
      });
    } catch {}
  }
  ["_getBaseDuration"]() {
    const _0x3b8bbb = this['_video'];
    if (!_0x3b8bbb) {
      return 0x0;
    }
    const _0x5e3fcf = Number(_0x3b8bbb["duration"]);
    if (Number["isFinite"](_0x5e3fcf) && _0x5e3fcf > 0x0) {
      return _0x5e3fcf;
    }
    const _0x1d56ef = _0x3b8bbb["seekable"];
    if (_0x1d56ef && _0x1d56ef["length"]) {
      const _0x3d7129 = Number(_0x1d56ef["end"](_0x1d56ef['length'] - 0x1));
      if (Number["isFinite"](_0x3d7129) && _0x3d7129 > 0x0) {
        return _0x3d7129;
      }
    }
    return 0x0;
  }
  ["_getClipRange"](_0x1465c7) {
    const _0x552861 = Number(_0x1465c7);
    if (!Number['isFinite'](_0x552861) || _0x552861 <= 0x0) {
      return {
        'active': ![],
        'start': 0x0,
        'end': 0x0
      };
    }
    const _0x217c81 = Number(this['_data']?.["clipStart"]);
    const _0xb717f5 = Number(this["_data"]?.["clipEnd"]);
    if (!Number['isFinite'](_0x217c81) || !Number["isFinite"](_0xb717f5) || !(_0xb717f5 > _0x217c81)) {
      return {
        'active': ![],
        'start': 0x0,
        'end': _0x552861
      };
    }
    const _0xa91276 = Math["max"](0x0, Math["min"](_0x552861, _0x217c81));
    const _0x5bbcd2 = Math['max'](0x0, Math["min"](_0x552861, _0xb717f5));
    if (!(_0x5bbcd2 > _0xa91276)) {
      return {
        'active': ![],
        'start': 0x0,
        'end': _0x552861
      };
    }
    return {
      'active': !![],
      'start': _0xa91276,
      'end': _0x5bbcd2
    };
  }
  ["_requestProgressFrame"](_0x4f1533) {
    const _0x761b4 = globalThis['window']?.["requestAnimationFrame"] || globalThis["requestAnimationFrame"];
    if (typeof _0x761b4 === "function") {
      return _0x761b4["call"](globalThis["window"] || globalThis, _0x4f1533);
    }
    return setTimeout(_0x4f1533, 0x10);
  }
  ["_cancelProgressFrame"](_0x290a69) {
    const _0x386fc8 = globalThis["window"]?.["cancelAnimationFrame"] || globalThis['cancelAnimationFrame'];
    if (typeof _0x386fc8 === "function") {
      _0x386fc8['call'](globalThis['window'] || globalThis, _0x290a69);
      return;
    }
    clearTimeout(_0x290a69);
  }
  ['_cancelProgressLoop']() {
    if (!this["_progressRaf"]) {
      return;
    }
    this['_cancelProgressFrame'](this['_progressRaf']);
    this["_progressRaf"] = 0x0;
  }
  ["_startProgressLoop"]() {
    if (this["_progressRaf"] || !this['_video'] || this["_video"]["paused"]) {
      return;
    }
    const _0x53c010 = () => {
      this["_progressRaf"] = 0x0;
      this["_syncVideoProgressUi"]();
      if (!this["_video"] || this["_video"]["paused"] || this["_video"]["ended"]) {
        return;
      }
      this['_progressRaf'] = this['_requestProgressFrame'](_0x53c010);
    };
    this['_progressRaf'] = this["_requestProgressFrame"](_0x53c010);
  }
  ["_syncVideoProgressUi"]() {
    if (!this['_video'] || !this["_fill"] || !this['_timeCurrent'] || !this["_timeTotal"]) {
      return;
    }
    if (this["_isSeeking"] || this["_bar"] && this["_bar"]["dataset"]["dragging"] === "true") {
      return;
    }
    const _0x17a7bf = this["_getBaseDuration"]();
    if (!_0x17a7bf || !Number["isFinite"](_0x17a7bf)) {
      return;
    }
    const _0x3dc206 = this['_getClipRange'](_0x17a7bf);
    const _0x17de6e = _0x3dc206["active"] ? Math["max"](0x0, _0x3dc206["end"] - _0x3dc206['start']) : _0x17a7bf;
    if (!_0x17de6e || !Number["isFinite"](_0x17de6e)) {
      return;
    }
    let _0x1e0f63 = this['_video']["currentTime"] || 0x0;
    if (_0x3dc206["active"]) {
      if (_0x1e0f63 < _0x3dc206["start"]) {
        this["_video"]["currentTime"] = _0x3dc206["start"];
        _0x1e0f63 = _0x3dc206['start'];
      } else {
        _0x1e0f63 > _0x3dc206["end"] - 0.03 && (this["_video"]['currentTime'] = _0x3dc206["start"], _0x1e0f63 = _0x3dc206["start"]);
      }
    }
    const _0x511af4 = _0x3dc206['active'] ? Math["max"](0x0, Math['min'](_0x17de6e, _0x1e0f63 - _0x3dc206['start'])) : _0x1e0f63;
    this["_fill"]["style"]["width"] = _0x511af4 / _0x17de6e * 0x64 + '%';
    const _0x98facb = this['_fmt'](_0x511af4);
    const _0x55da35 = this["_fmt"](_0x17de6e);
    this["_timeCurrent"]["textContent"] !== _0x98facb && (this["_timeCurrent"]["textContent"] = _0x98facb);
    this['_timeTotal']['textContent'] !== _0x55da35 && (this["_timeTotal"]["textContent"] = _0x55da35);
  }
  ["_setManualLoopPlayback"](_0x591747) {
    setSourceVideoManualLoopPlayback(this, _0x591747);
  }
  ["_shouldKeepHoverPlaybackOnManualClick"]() {
    return shouldTakeOverActiveHoverPlayback(this, this["_video"]);
  }
  ["_toggleManualPlayback"]({
    loop = ![],
    forcePlay = ![]
  } = {}) {
    toggleSourceVideoManualPlayback(this, {
      'loop': loop,
      'forcePlay': forcePlay
    });
  }
  ["_getPlaybackLabel"](_0x2a78d0 = 'preview') {
    return 'source-video:' + this['id'] + ':' + _0x2a78d0;
  }
  ["_openFullscreenFromCurrentVideo"]() {
    const _0xf84fc = String(this['_resolveVideoSrc'](this["_data"]) || this["_video"]?.["dataset"]?.["desktopMediaSourceUrl"] || this["_currentSrc"] || '')['trim']();
    if (!_0xf84fc) {
      return null;
    }
    return openSourceVideoFullscreenPreview({
      'nodeData': this["_data"],
      'previewUrl': _0xf84fc,
      'previewPlaybackUrl': getVideoCurrentSource(this["_video"]),
      'currentTime': Number(this["_video"]?.["currentTime"] || 0x0),
      'muted': !!this["_isMuted"],
      'loop': this["_isManualLoopPlayback"] === !![]
    });
  }
  async ["_ensurePlaybackVideoSrc"]({
    forPlayback = ![],
    preload = forPlayback ? "auto" : SOURCE_VIDEO_POSTER_PRELOAD
  } = {}) {
    const _0x420f84 = this["_ensureVideoElement"]();
    if (!_0x420f84) {
      return ![];
    }
    this['_applyPendingPlaybackSourceAtBoundary']();
    const _0x263c60 = String(this["_currentSrc"] || this["_resolveVideoSrc"](this["_data"]) || '')["trim"]();
    if (!_0x263c60) {
      return ![];
    }
    if (isMediaElementPlaybackSource(_0x420f84, _0x263c60)) {
      forPlayback && _0x420f84["preload"] !== preload && (_0x420f84["preload"] = preload);
      return !![];
    }
    if (this["_isHardMissingPlaybackSource"](_0x263c60)) {
      this["_applyHardMissingPlaybackState"](_0x263c60, this["_hardMissingPlaybackStatus"]);
      return ![];
    }
    if (this['_playbackSourcePromise'] && this["_playbackSourcePromiseSource"] === _0x263c60) {
      return this['_playbackSourcePromise'];
    }
    const _0x138f9d = Number(this['_playbackSourceToken'] || 0x0);
    const _0x1015f1 = (async () => {
      this["_currentSrc"] = _0x263c60;
      const _0x3e12e2 = forPlayback ? await this["_resolveLocalPlaybackObjectUrl"](_0x263c60, {
        'resultMode': 'typed'
      }) : '';
      const _0x3dcbb5 = typeof _0x3e12e2 === "string" ? _0x3e12e2 : String(_0x3e12e2?.['playbackUrl'] || '');
      const _0x214a65 = typeof _0x3e12e2 === "string" ? _0x3dcbb5 ? "ready" : "fallback" : String(_0x3e12e2?.["status"] || "fallback");
      if (this['_currentSrc'] !== _0x263c60 || this["_rendererMediaDeferred"] === !![] || Number(this["_playbackSourceToken"] || 0x0) !== _0x138f9d) {
        return ![];
      }
      if (_0x214a65 === "hard-missing") {
        this['_applyHardMissingPlaybackState'](_0x263c60, _0x3e12e2?.['httpStatus']);
        return ![];
      }
      if (_0x214a65 === "aborted") {
        return ![];
      }
      globalThis["window"]?.["__runtimeCompareMark"]?.("source-video-playback:attach", {
        'nodeId': this['id'],
        'sourceUrl': _0x263c60,
        'playbackUrl': _0x3dcbb5
      });
      const _0x167408 = this['_rendererMediaSlotToken'];
      let _0x555bf9 = ![];
      const _0x46d237 = () => {
        _0x555bf9 = this["_armFirstVideoFramePresentation"](_0x263c60, _0x167408) || _0x555bf9;
      };
      const _0x11a98a = () => this["_video"] === _0x420f84 && this["_currentSrc"] === _0x263c60 && this["_rendererMediaDeferred"] !== !![] && Number(this["_playbackSourceToken"] || 0x0) === _0x138f9d;
      const _0x43acec = await attachMediaElementPlaybackSource(_0x420f84, _0x263c60, {
        'playbackUrl': _0x3dcbb5,
        'preload': preload,
        'warmRanges': ![],
        'load': forPlayback || !forPlayback && !isDesktopRenderer(),
        'onSourceAssigned': _0x46d237,
        'shouldAssign': _0x11a98a
      });
      if (!_0x43acec || !_0x11a98a()) {
        return ![];
      }
      if (!_0x555bf9) {
        _0x46d237();
      }
      return !![];
    })();
    this['_playbackSourcePromise'] = _0x1015f1;
    this["_playbackSourcePromiseSource"] = _0x263c60;
    try {
      return await _0x1015f1;
    } finally {
      this['_playbackSourcePromise'] === _0x1015f1 && (this["_playbackSourcePromise"] = null, this["_playbackSourcePromiseSource"] = '');
    }
  }
  ['_attachPlaybackRecovery'](_0x382581 = 'hover') {
    if (!this["_video"]) {
      return null;
    }
    const _0x56286b = _0x382581 === "hover" || _0x382581 === "fullscreen";
    return attachVideoPlaybackRecovery(this["_video"], {
      'label': this["_getPlaybackLabel"](_0x382581),
      'ensureSrc': () => this["_ensurePlaybackVideoSrc"]({
        'forPlayback': !![],
        'preload': _0x382581 === "hover" ? 'metadata' : "auto"
      }),
      'minBufferAhead': _0x56286b ? 0.5 : undefined,
      'readyTimeoutMs': _0x56286b ? 0x15e : undefined,
      'recoveryDebounceMs': _0x56286b ? 0x96 : undefined,
      'recoveryCooldownMs': _0x56286b ? 0x1f4 : undefined,
      'shouldRecover': () => this["_video"]?.["isConnected"] !== ![] && (this["_isHovered"] || this['_isManualControl'] || !this["_video"]?.["paused"])
    });
  }
  async ["_playVideoWithRecovery"](_0x559b91, _0x5609cf) {
    return playSourceVideoWithFeedback(this, _0x559b91, _0x5609cf);
  }
  ["_loadVideo"](_0x5db2cb, {
    forceCapturePreviewPromotion = ![],
    resumePlaybackTime = null
  } = {}) {
    const _0x5a1401 = String(_0x5db2cb || '')['trim']();
    this["_replacePendingPlaybackResume"](_0x5a1401, resumePlaybackTime);
    const _0x417516 = String(this["_currentSrc"] || '')['trim']();
    _0x5a1401 !== _0x417516 && (clearSourceVideoPlaybackFeedback(this), this["_playbackSourceToken"] = Number(this["_playbackSourceToken"] || 0x0) + 0x1);
    const _0x45eb34 = forceCapturePreviewPromotion === !![] || resolveGenerationUiState(this["_data"]) === "success" && this["_card"]?.["classList"]?.['contains']?.("img-preview-loading") === !![];
    if (forceCapturePreviewPromotion !== !![] && this["_shouldKeepReadyCapturePreview"](_0x5a1401)) {
      this["_prepareRendererMediaSlotSource"](_0x5a1401);
      this["_applyVideoPoster"](this['_data']);
      stopLoading(this["_card"]);
      this["_syncVideoElementFrameVisibility"]();
      return;
    }
    if (this["_rendererMediaDeferred"] === !![]) {
      const _0x3eb045 = _0x5a1401 !== String(this["_currentSrc"] || '')["trim"]();
      this["_currentSrc"] = _0x5a1401;
      this["_prepareRendererMediaSlotSource"](_0x5a1401);
      this['_applyVideoPoster'](this['_data'], {
        'restoreNativePoster': !!_0x5a1401 && _0x3eb045
      });
      return;
    }
    this["_setManualLoopPlayback"](![]);
    const _0x5ab11d = _0x5a1401 !== String(this["_currentSrc"] || '')["trim"]();
    const _0x439574 = this["_applyVideoPoster"](this["_data"], {
      'restoreNativePoster': !!_0x5a1401 && _0x5ab11d
    });
    if (!_0x5a1401) {
      this["_currentSrc"] = '';
      this['_prepareRendererMediaSlotSource']('');
      this['_setRendererPlaybackPin'](![]);
      const _0x3c842f = shouldShowGenerationResultLoadingUi(this['_data'], {
        'hasResult': ![]
      });
      this['_idleVideoThumbCancel'] && (this["_idleVideoThumbCancel"](), this["_idleVideoThumbCancel"] = null);
      this['_loadVideoToken'] = null;
      this["_releaseActiveCapturePreviewUrl"]();
      this["_video"] && (this["_video"]['onloadeddata'] = null, this["_video"]["onerror"] = null, this['_video']["preload"] = "none", this["_clearVideoElementSource"]({
        'invalidateRendererSlot': ![]
      }), this["_video"]["style"]["display"] = "none");
      this['_setPosterFrameVisible'](_0x3c842f && !!_0x439574);
      _0x3c842f ? startLoading(this['_card'], {
        'variant': "full"
      }) : stopLoading(this["_card"]);
      if (this['_hint']) {
        this['_hint']["style"]["display"] = _0x3c842f ? "none" : "block";
      }
      this["_syncPlaybackChromeVisibility"]({
        'forceHidden': !![]
      });
      if (this["_uploadBtn"]) {
        this["_uploadBtn"]["disabled"] = _0x3c842f;
      }
      return;
    }
    const _0x37b877 = this["_getCapturePreviewUrl"](this["_data"]);
    if (_0x5a1401 === _0x37b877) {
      this["_adoptCapturePreviewUrl"](_0x5a1401);
    } else {
      this["_activeCapturePreviewUrl"] && this["_releaseActiveCapturePreviewUrl"]();
    }
    _0x5a1401 !== _0x37b877 && this['_clearStoredCapturePreviewAfterSourcePromotion'](_0x5a1401);
    this["_currentSrc"] = _0x5a1401;
    this["_prepareRendererMediaSlotSource"](_0x5a1401);
    const _0x2fd6b0 = !!(this["_video"] && isMediaElementPlaybackSource(this["_video"], _0x5a1401));
    if (_0x439574) {
      this['_idleVideoThumbCancel'] && (this['_idleVideoThumbCancel'](), this['_idleVideoThumbCancel'] = null);
      this["_loadVideoToken"] = null;
      if (this["_video"]) {
        this["_video"]["onloadeddata"] = null;
        this["_video"]["onerror"] = null;
        const _0x5216d4 = getVideoCurrentSource(this["_video"]);
        _0x5216d4 && !isMediaElementPlaybackSource(this["_video"], _0x5a1401) && this["_clearVideoElementSource"]({
          'load': ![],
          'invalidateRendererSlot': ![]
        });
        this['_video']["preload"] = "none";
        this["_syncVideoElementFrameVisibility"]({
          'forceHidden': !_0x2fd6b0
        });
      }
      this["_syncVideoDurationUi"]();
      if (!_0x45eb34 || this["_card"]?.['classList']?.["contains"]?.("img-preview-loading") !== !![]) {
        stopLoading(this['_card']);
      }
      this['_syncPosterFrameVisibility'](_0x2fd6b0 ? {} : {
        'force': !![]
      });
      this["_syncPlaybackChromeVisibility"]();
      if (this["_hint"]) {
        this['_hint']["style"]["display"] = "block";
      }
      if (!_0x45eb34) {
        return;
      }
    }
    let _0x1719d7 = ![];
    const _0x589b50 = () => {
      if (_0x1719d7 || this['_currentSrc'] !== _0x5a1401) {
        return;
      }
      _0x1719d7 = !![];
      this["_clearMediaUnavailableAfterPlayback"](_0x5a1401);
      this["_activeCapturePreviewUrl"] && this["_activeCapturePreviewUrl"] !== _0x5a1401 && this["_releaseActiveCapturePreviewUrl"]();
      this["_syncPlaybackChromeVisibility"]();
      if (this["_hint"]) {
        this["_hint"]["style"]['display'] = "block";
      }
      this['_maybeEnsureVideoThumb'](this['_data']);
      const _0x5469ea = this["_rendererMediaSlotToken"];
      if (!this["_armFirstVideoFramePresentation"](_0x5a1401, _0x5469ea)) {
        stopLoading(this["_card"]);
      }
      this['_nudgePausedVideoForFirstFrame'](_0x5a1401);
      this["_syncPosterFrameVisibility"]();
    };
    if (!_0x45eb34) {
      this["_loadVideoToken"] = null;
      this['_video'] && getVideoCurrentSource(this["_video"]) && !_0x2fd6b0 && this["_clearVideoElementSource"]();
      this['_video'] && (this["_video"]['onloadeddata'] = _0x589b50, this["_video"]['onerror'] = () => {
        if (this["_currentSrc"] === _0x5a1401) {
          stopLoading(this['_card']);
        }
      }, this["_video"]['preload'] = 'none', this["_syncVideoElementFrameVisibility"]({
        'forceHidden': !_0x2fd6b0
      }));
      this['_syncPosterFrameVisibility'](_0x2fd6b0 ? {} : {
        'force': !!_0x439574
      });
      this["_syncPlaybackChromeVisibility"]();
      if (this['_hint']) {
        this["_hint"]['style']["display"] = 'block';
      }
      stopLoading(this["_card"]);
      this["_scheduleMaybeEnsureVideoThumb"]();
      this["_attachPlaybackRecovery"]();
      return;
    }
    const _0x3a7b43 = this['_ensureVideoElement']();
    if (!_0x3a7b43) {
      stopLoading(this["_card"]);
      return;
    }
    _0x3a7b43["onloadeddata"] = _0x589b50;
    _0x3a7b43["onerror"] = () => {
      if (this["_currentSrc"] === _0x5a1401) {
        stopLoading(this["_card"]);
      }
    };
    startLoading(this["_card"], {
      'variant': "full"
    });
    _0x3a7b43["style"]["display"] = "block";
    this["_syncVideoElementFrameVisibility"]();
    _0x439574 ? (this["_syncPosterFrameVisibility"]({
      'force': !![]
    }), this['_syncPlaybackChromeVisibility']()) : (this['_setPosterFrameVisible'](![]), this["_syncPlaybackChromeVisibility"]({
      'forceHidden': !![]
    }));
    const _0x3891df = {};
    this["_loadVideoToken"] = _0x3891df;
    const _0x58adaa = () => {
      if (!this['_video'] || this["_loadVideoToken"] !== _0x3891df || this["_currentSrc"] !== _0x5a1401) {
        return;
      }
      this["_video"]["preload"] = "auto";
      if (!_0x439574 && !isDesktopRenderer()) {
        this['_video']['src'] = _0x5a1401;
        this['_armFirstVideoFramePresentation'](_0x5a1401, this["_rendererMediaSlotToken"]);
        try {
          this["_video"]["load"]?.();
        } catch {}
        if (Number(this["_video"]["readyState"] || 0x0) >= 0x2) {
          _0x589b50();
        }
        return;
      }
      if (!_0x439574) {
        const _0x53d774 = this["_rendererMediaSlotToken"];
        let _0x4dd607 = ![];
        const _0x25cc3b = () => {
          _0x4dd607 = this["_armFirstVideoFramePresentation"](_0x5a1401, _0x53d774) || _0x4dd607;
        };
        const _0xa88d6e = Number(this["_playbackSourceToken"] || 0x0);
        const _0x53fce0 = this["_video"];
        const _0x23c952 = () => this["_video"] === _0x53fce0 && this["_loadVideoToken"] === _0x3891df && this['_currentSrc'] === _0x5a1401 && this["_rendererMediaDeferred"] !== !![] && Number(this["_playbackSourceToken"] || 0x0) === _0xa88d6e;
        void attachMediaElementPlaybackSource(_0x53fce0, _0x5a1401, {
          'preload': 'auto',
          'warmRanges': ![],
          'load': !![],
          'onSourceAssigned': _0x25cc3b,
          'shouldAssign': _0x23c952
        })["then"](_0x5c455b => {
          if (!_0x5c455b || !_0x23c952()) {
            return;
          }
          if (!_0x4dd607) {
            _0x25cc3b();
          }
          this["_video"] && this['_loadVideoToken'] === _0x3891df && this['_currentSrc'] === _0x5a1401 && Number(this["_video"]["readyState"] || 0x0) >= 0x2 && _0x589b50();
        })["catch"](() => {
          if (this["_currentSrc"] === _0x5a1401) {
            stopLoading(this["_card"]);
          }
        });
        return;
      }
      void this['_ensurePlaybackVideoSrc']({
        'forPlayback': !![]
      })["then"](() => {
        this['_video'] && this["_loadVideoToken"] === _0x3891df && this['_currentSrc'] === _0x5a1401 && Number(this["_video"]['readyState'] || 0x0) >= 0x2 && _0x589b50();
      })["catch"](() => {
        if (this['_currentSrc'] === _0x5a1401) {
          stopLoading(this["_card"]);
        }
      });
    };
    _0x58adaa();
    this["_attachPlaybackRecovery"]();
    if (this["_hint"]) {
      this["_hint"]["style"]["display"] = "block";
    }
  }
  ["_fmt"](_0x3928cd) {
    if (!_0x3928cd || isNaN(_0x3928cd)) {
      return "0:00";
    }
    return Math['floor'](_0x3928cd / 0x3c) + ':' + String(Math['floor'](_0x3928cd % 0x3c))["padStart"](0x2, '0');
  }
  ['_getNodeDuration'](_0x1b9975 = this["_data"]) {
    const _0x587012 = Number(_0x1b9975?.['videoDuration'] || _0x1b9975?.['duration'] || 0x0);
    if (Number["isFinite"](_0x587012) && _0x587012 > 0x0) {
      return _0x587012;
    }
    const _0x1d4058 = Number(_0x1b9975?.["videoFrameCount"] || _0x1b9975?.["frameCount"] || 0x0);
    const _0x3cd421 = Number(_0x1b9975?.["videoFps"] || _0x1b9975?.["fps"] || 0x0);
    if (Number['isFinite'](_0x1d4058) && _0x1d4058 > 0x0 && Number['isFinite'](_0x3cd421) && _0x3cd421 > 0x0) {
      return _0x1d4058 / _0x3cd421;
    }
    return 0x0;
  }
  ["_syncVideoDurationUi"]() {
    if (!this["_timeTotal"]) {
      return;
    }
    const _0x5ee6a9 = this['_getBaseDuration']() || this["_getNodeDuration"](this['_data']);
    if (!_0x5ee6a9 || !Number['isFinite'](_0x5ee6a9)) {
      this["_timeTotal"]['textContent'] = "0:00";
      return;
    }
    const _0x2449c0 = this["_getClipRange"](_0x5ee6a9);
    const _0x4283cd = _0x2449c0['active'] ? Math["max"](0x0, _0x2449c0["end"] - _0x2449c0["start"]) : _0x5ee6a9;
    if (!_0x4283cd || !Number['isFinite'](_0x4283cd)) {
      this["_timeTotal"]['textContent'] = '0:00';
      return;
    }
    this['_timeTotal']["textContent"] = this['_fmt'](_0x4283cd);
  }
  ['_setCenterIndicatorIcon'](_0x574c70) {
    if (!this["_indicatorInner"]) {
      return;
    }
    const _0x30f1f4 = document['createElementNS']('http://www.w3.org/2000/svg', "svg");
    _0x30f1f4['setAttribute']("width", '28');
    _0x30f1f4['setAttribute']("height", '28');
    _0x30f1f4['setAttribute']("viewBox", '0\x200\x2024\x2024');
    _0x30f1f4["setAttribute"]("fill", "currentColor");
    _0x30f1f4["style"]["color"] = "var(--canvas-white)";
    _0x574c70 === 'play' ? _0x30f1f4["innerHTML"] = "<polygon points=\"6 4 20 12 6 20 6 4\"></polygon>" : _0x30f1f4["innerHTML"] = "<rect x=\"6\" y=\"5\" width=\"4\" height=\"14\" rx=\"1\"></rect><rect x=\"14\" y=\"5\" width=\"4\" height=\"14\" rx=\"1\"></rect>";
    this["_indicatorInner"]["innerHTML"] = '';
    this["_indicatorInner"]["appendChild"](_0x30f1f4);
  }
  ["_showPausedCenterIndicator"]() {
    if (!this["_indicatorInner"]) {
      return;
    }
    this['_centerIndicatorTimer'] && (clearTimeout(this["_centerIndicatorTimer"]), this["_centerIndicatorTimer"] = null);
    this['_setCenterIndicatorIcon']('play');
    this["_indicatorInner"]["style"]["opacity"] = '1';
    this["_indicatorInner"]["style"]["transform"] = 'scale(1)';
  }
  ["_hideCenterIndicator"]() {
    if (!this["_indicatorInner"]) {
      return;
    }
    this["_centerIndicatorTimer"] && (clearTimeout(this["_centerIndicatorTimer"]), this["_centerIndicatorTimer"] = null);
    this["_indicatorInner"]['style']["opacity"] = '0';
    this["_indicatorInner"]['style']['transform'] = "scale(0.92)";
  }
  ["_flashCenterIndicator"](_0x283fe0) {
    if (!this["_indicatorInner"]) {
      return;
    }
    this["_centerIndicatorTimer"] && (clearTimeout(this["_centerIndicatorTimer"]), this["_centerIndicatorTimer"] = null);
    this["_setCenterIndicatorIcon"](_0x283fe0);
    this["_indicatorInner"]["style"]["opacity"] = '1';
    this["_indicatorInner"]['style']["transform"] = "scale(1)";
    this["_centerIndicatorTimer"] = setTimeout(() => {
      if (!this["_indicatorInner"]) {
        return;
      }
      if (_0x283fe0 === "pause") {
        this['_showPausedCenterIndicator']();
      } else {
        this['_hideCenterIndicator']();
      }
      this['_centerIndicatorTimer'] = null;
    }, 0x208);
  }
  ['_updatePlayIcon'](_0x5a6c4c) {
    if (!this['_playBtn']) {
      return;
    }
    const _0x4af343 = _0x5a6c4c ? "paused" : "playing";
    const _0x421539 = sourceVideoText(_0x5a6c4c ? "controls.playLoopHint" : "controls.pause");
    if (this['_playIconButtonEl'] === this["_playBtn"] && this['_playIconState'] === _0x4af343 && this["_playBtn"]["dataset"]?.["tooltip"] === _0x421539) {
      return;
    }
    this['_playIconButtonEl'] = this["_playBtn"];
    this['_playIconState'] = _0x4af343;
    this["_playBtn"]['dataset']["tooltip"] = _0x421539;
    this["_playBtn"]["setAttribute"]?.("aria-label", _0x421539);
    this["_playBtn"]["replaceChildren"]();
    const _0x5ca423 = "http://www.w3.org/2000/svg";
    const _0x597eb0 = document["createElementNS"](_0x5ca423, "svg");
    _0x597eb0['setAttribute']("width", '16');
    _0x597eb0["setAttribute"]("height", '16');
    _0x597eb0['setAttribute']("viewBox", '0\x200\x2024\x2024');
    _0x597eb0["setAttribute"]("fill", "currentColor");
    if (_0x5a6c4c) {
      const _0x58f184 = document['createElementNS'](_0x5ca423, 'polygon');
      _0x58f184["setAttribute"]("points", "5 3 19 12 5 21 5 3");
      _0x597eb0["appendChild"](_0x58f184);
    } else {
      const _0x216f1d = document["createElementNS"](_0x5ca423, "rect");
      _0x216f1d["setAttribute"]('x', '6');
      _0x216f1d["setAttribute"]('y', '4');
      _0x216f1d['setAttribute']("width", '4');
      _0x216f1d['setAttribute']("height", '16');
      const _0x196acb = document["createElementNS"](_0x5ca423, "rect");
      _0x196acb['setAttribute']('x', '14');
      _0x196acb['setAttribute']('y', '4');
      _0x196acb["setAttribute"]("width", '4');
      _0x196acb['setAttribute']("height", '16');
      _0x597eb0['appendChild'](_0x216f1d);
      _0x597eb0["appendChild"](_0x196acb);
    }
    this['_playBtn']["appendChild"](_0x597eb0);
  }
  async ['_captureFrame']() {
    const _0x24a683 = await this["_ensurePlaybackVideoSrc"]();
    if (!_0x24a683 || !this["_video"]) {
      return;
    }
    await extractCurrentVideoFrameToImageNode({
      'videoEl': this["_video"],
      'anchorNodeId': this['id'],
      'fallbackDurationSec': this["_getBaseDuration"](),
      'onMissingMetadata': _0xf59543 => this["_maybeFetchVideoMeta"](_0xf59543),
      'logPrefix': '[SourceVideoNode]'
    });
  }
  ["_computeGenerationDuration"](_0x5294d3 = this["_data"]) {
    if (!_0x5294d3) {
      return 0x0;
    }
    if (typeof _0x5294d3["generationDuration"] === "number") {
      return _0x5294d3["generationDuration"];
    }
    const _0x1b29a0 = Number(_0x5294d3["generationStartTime"] || 0x0);
    if (!Number['isFinite'](_0x1b29a0) || _0x1b29a0 <= 0x0) {
      return 0x0;
    }
    return Math['max'](0x0, Date["now"]() - _0x1b29a0);
  }
  ["_isRunningHubRecoverableTask"](_0x41671c = this["_data"]) {
    if (!_0x41671c || typeof _0x41671c !== "object") {
      return ![];
    }
    const _0x24d605 = String(_0x41671c["rhTaskId"] || '')['trim']();
    if (!_0x24d605) {
      return ![];
    }
    const _0x1313b3 = String(_0x41671c["rhTaskStatus"] || '')['trim']()['toLowerCase']();
    if (["success", "failed", "idle", "cancelled"]["includes"](_0x1313b3)) {
      return ![];
    }
    return isRunningHubVideoTask(_0x41671c);
  }
  ['_syncRunningHubVideoTaskState'](_0x3bb65a = this["_data"]) {
    if (!_0x3bb65a || typeof _0x3bb65a !== 'object') {
      return ![];
    }
    const _0x28205e = buildRunningHubVideoTerminalStatePatch(_0x3bb65a, _0x3bb65a["rhTaskStatus"], this['_computeGenerationDuration'](_0x3bb65a));
    if (!_0x28205e) {
      return ![];
    }
    a517_0x501c15["updateNodeData"](this['id'], _0x28205e);
    return !![];
  }
  ["_isAsyncRecoverableTask"](_0x23db03 = this["_data"]) {
    if (!_0x23db03 || typeof _0x23db03 !== 'object') {
      return ![];
    }
    const _0x9ba3e8 = String(_0x23db03["asyncTaskId"] || '')["trim"]();
    if (!_0x9ba3e8) {
      return ![];
    }
    const _0x5bbdff = String(_0x23db03["asyncTaskProvider"] || _0x23db03['provider'] || '')["trim"]()["toLowerCase"]();
    if (!_0x5bbdff || _0x5bbdff === "runninghubwf" || _0x5bbdff === "runninghub" || _0x5bbdff === "dreamina") {
      return ![];
    }
    const _0x17c8a7 = String(_0x23db03["asyncTaskKind"] || '')["trim"]()["toLowerCase"]();
    if (_0x17c8a7 && _0x17c8a7 !== "video") {
      return ![];
    }
    const _0x289bdc = String(_0x23db03['asyncTaskStatus'] || '')["trim"]()["toLowerCase"]();
    if (["success", "failed", "idle", "cancelled"]["includes"](_0x289bdc)) {
      return ![];
    }
    return !![];
  }
  ["_stopRunningHubRecovery"](_0x5e3760 = !![]) {
    try {
      this["_rhResumeAbortController"]?.["abort"]?.();
    } catch {}
    this["_rhResumeAbortController"] = null;
    this["_rhResumePromise"] = null;
    this["_rhResumeTaskId"] = '';
    if (!_0x5e3760) {
      return;
    }
    const _0x1af8ba = a517_0x501c15["getStateRaw"]()['nodes']?.[this['id']];
    if (!_0x1af8ba || _0x1af8ba['rhTaskRecovering'] !== !![]) {
      return;
    }
    a517_0x501c15["updateNodeData"](this['id'], {
      'rhTaskRecovering': ![]
    });
  }
  ["_stopAsyncRecovery"](_0x40cb3e = !![]) {
    try {
      this["_asyncResumeAbortController"]?.["abort"]?.();
    } catch {}
    this['_asyncResumeAbortController'] = null;
    this['_asyncResumePromise'] = null;
    this["_asyncResumeTaskId"] = '';
    if (!_0x40cb3e) {
      return;
    }
    const _0x424023 = a517_0x501c15["getStateRaw"]()['nodes']?.[this['id']];
    if (!_0x424023 || _0x424023["asyncTaskRecovering"] !== !![]) {
      return;
    }
    a517_0x501c15['updateNodeData'](this['id'], {
      'asyncTaskRecovering': ![]
    });
  }
  ["_extractFirstVideoUrl"](_0x4931f9) {
    const _0xed716f = new Set();
    const _0x1e42f0 = _0x35b571 => {
      if (_0x35b571 == null) {
        return '';
      }
      if (typeof _0x35b571 === 'string') {
        const _0x5a74c3 = _0x35b571['trim']();
        if (!_0x5a74c3) {
          return '';
        }
        if (_0x5a74c3["startsWith"]('http://') || _0x5a74c3["startsWith"]('https://') || _0x5a74c3['startsWith']('/')) {
          return _0x5a74c3;
        }
        if (_0x5a74c3["startsWith"]('{') || _0x5a74c3["startsWith"]('[')) {
          try {
            return _0x1e42f0(JSON['parse'](_0x5a74c3));
          } catch {
            return '';
          }
        }
        const _0x14ba80 = _0x5a74c3["match"](/https?:\/\/[^\s"'<>]+/);
        return _0x14ba80 && _0x14ba80[0x0] ? _0x14ba80[0x0] : '';
      }
      if (typeof _0x35b571 !== "object") {
        return '';
      }
      if (_0xed716f["has"](_0x35b571)) {
        return '';
      }
      _0xed716f["add"](_0x35b571);
      if (Array["isArray"](_0x35b571)) {
        for (const _0x1b3367 of _0x35b571) {
          const _0x1120d0 = _0x1e42f0(_0x1b3367);
          if (_0x1120d0) {
            return _0x1120d0;
          }
        }
        return '';
      }
      const _0x2415c2 = ["url", "videoUrl", 'video_url', 'fileUrl', "file_url", "download_url", "output", "result", "data", 'results', 'outputs'];
      for (const _0x195caa of _0x2415c2) {
        const _0x2ff3e7 = _0x1e42f0(_0x35b571[_0x195caa]);
        if (_0x2ff3e7) {
          return _0x2ff3e7;
        }
      }
      return '';
    };
    return _0x1e42f0(_0x4931f9);
  }
  ["_toLocalPathIfSameOrigin"](_0x4b3989) {
    return urlToLocalPath(_0x4b3989);
  }
  async ['_saveVideoToOutput'](_0x12316e) {
    const _0x12932d = String(_0x12316e || '')["trim"]();
    const _0x67827 = this["_toLocalPathIfSameOrigin"](_0x12932d);
    if (_0x67827) {
      return _0x67827;
    }
    if (!isClientFetchableMediaUrl(_0x12932d)) {
      return '';
    }
    let _0x4f877a = '';
    try {
      const _0x480966 = new AbortController();
      const _0x4e7328 = setTimeout(() => _0x480966["abort"](), 0x1d4c0);
      let _0x5860b1 = null;
      try {
        _0x5860b1 = await fetchRemoteBlob(_0x12932d, {
          'signal': _0x480966['signal']
        });
      } finally {
        clearTimeout(_0x4e7328);
      }
      const _0x7dbe23 = await saveOutputToServer(_0x5860b1, {
        'ext': "mp4"
      });
      _0x7dbe23?.["success"] && (_0x4f877a = pickResultLocalPath(_0x7dbe23));
    } catch (_0x2848a0) {
      const _0x4c6afe = _0x2848a0 instanceof Error ? _0x2848a0["message"] : String(_0x2848a0 || '');
      const _0x4d8417 = _0x4c6afe["includes"]("Failed to fetch") || _0x4c6afe["includes"]("NetworkError") || _0x4c6afe["toLowerCase"]()['includes']("cors");
      if (_0x4d8417 && /^https?:\/\//i["test"](_0x12932d)) {
        const _0x232d1f = await saveOutputFromUrlToServer({
          'url': _0x12932d,
          'ext': "mp4"
        });
        _0x4f877a = pickResultLocalPath(_0x232d1f);
      }
    }
    return _0x4f877a;
  }
  async ["_buildRecoveredVideoResultPatch"](_0x1749ad) {
    let _0x8e3566 = buildCanvasLocalVideoFields(_0x1749ad);
    if (_0x8e3566["src"] && _0x8e3566['localPath']) {
      return _0x8e3566;
    }
    const _0x25d036 = this["_extractFirstVideoUrl"](_0x1749ad);
    if (!_0x25d036) {
      throw new Error(sourceVideoText("recovery.noOutputVideoUrl"));
    }
    const _0x1d082c = this["_toLocalPathIfSameOrigin"](_0x25d036) || (await this["_saveVideoToOutput"](_0x25d036));
    _0x8e3566 = buildCanvasLocalVideoFields({
      'localPath': _0x1d082c,
      'videoUrl': _0x25d036
    });
    if (!_0x8e3566["src"] || !_0x8e3566["localPath"]) {
      throw new Error(sourceVideoText("recovery.noOutputVideoUrl"));
    }
    return _0x8e3566;
  }
  ["_resolveAsyncResumePayload"](_0x36f46a) {
    return {
      'model': String(_0x36f46a?.['model'] || '')['trim'](),
      'provider': String(_0x36f46a?.["asyncTaskProvider"] || _0x36f46a?.["provider"] || '')["trim"]()
    };
  }
  ["_maybeResumeRunningHubTask"]() {
    const _0x4cda21 = a517_0x501c15["getStateRaw"]()["nodes"]?.[this['id']] || this['_data'];
    if (!this["_isRunningHubRecoverableTask"](_0x4cda21)) {
      this["_stopRunningHubRecovery"](!![]);
      return;
    }
    const _0x2468e5 = String(_0x4cda21?.["rhTaskId"] || '')["trim"]();
    if (!_0x2468e5) {
      return;
    }
    if (this["_rhResumePromise"] && this["_rhResumeTaskId"] === _0x2468e5) {
      return;
    }
    const _0x79f5bd = Number(_0x4cda21?.["rhTaskStartedAt"] || _0x4cda21?.["generationStartTime"] || 0x0) || Date["now"]();
    const _0x4d8575 = String(_0x4cda21?.['model'] || '')["trim"]()['toLowerCase']();
    const _0x5c66e0 = _0x4cda21?.['rhTaskUseOpenapiQuery'] === !![];
    const _0x2bfe57 = getVideoMattingModelId();
    const _0x56a7b2 = _0x4d8575 === _0x2bfe57;
    const _0x14f97f = String(_0x4cda21?.["taskProviderProfileId"] || _0x4cda21?.['providerProfileId'] || _0x4cda21?.["rhProviderProfileId"] || '')["trim"]();
    const _0xdcaba6 = {
      'provider': _0x56a7b2 ? "runninghubwf" : String(_0x4cda21?.["provider"] || 'runninghubwf')["trim"]() || "runninghubwf",
      'model': _0x56a7b2 ? _0x2bfe57 : String(_0x4cda21?.["model"] || '')['trim'](),
      ...(_0x14f97f ? {
        'providerProfileId': _0x14f97f,
        'rhProviderProfileId': _0x14f97f
      } : {})
    };
    const _0x29450a = typeof this["_resumeRunningHubTaskPoller"] === "function" ? this["_resumeRunningHubTaskPoller"] : null;
    const _0x1ffb8d = new AbortController();
    this["_rhResumeAbortController"] = _0x1ffb8d;
    this["_rhResumeTaskId"] = _0x2468e5;
    const _0x4460d1 = (async () => {
      try {
        const _0x3d53a1 = await resumeTask({
          'sourceNodeId': this['id'],
          'targetNodeId': this['id'],
          'trigger': "node",
          'taskType': "video-generation",
          'provider': _0xdcaba6["provider"] || _0x4cda21?.["provider"] || "runninghubwf",
          'adapterType': 'workflow',
          'modelId': _0xdcaba6['model'] || _0x4cda21?.['model'] || '',
          'executionId': "runninghub.source-video." + (_0xdcaba6["model"] || _0x4cda21?.['model'] || "workflow"),
          'payload': _0xdcaba6,
          'taskId': _0x2468e5,
          'cancellable': ![],
          'resumable': !![],
          'pauseOnAbort': !![],
          'startBuilder': () => ({
            'rhTaskStatus': String(_0x4cda21?.["rhTaskStatus"] || '')["trim"]()["toLowerCase"]() === "pending" ? "pending" : "running",
            'rhTaskUseOpenapiQuery': _0x5c66e0
          }),
          'poll': async () => {
            if (_0x29450a) {
              return _0x29450a(_0x2468e5, _0x4cda21, {
                'signal': _0x1ffb8d["signal"],
                'payload': _0xdcaba6,
                'useOpenapiQuery': _0x5c66e0
              });
            }
            if (_0x56a7b2) {
              return resumeRunningHubVideoTask(_0x2468e5, _0xdcaba6, {
                'signal': _0x1ffb8d["signal"],
                'useOpenapiQuery': _0x5c66e0
              });
            }
            await ensureConfig();
            const _0x410580 = getProviderConfig(_0xdcaba6["providerProfileId"] || "runninghubwf");
            const _0x5aa9a5 = String(_0x410580?.["apiKey"] || '')["trim"]();
            if (!_0x5aa9a5) {
              throw new Error(sourceVideoText("recovery.runninghubApiKeyMissing"));
            }
            return resumeRunninghubWorkflowTask({
              'apiKey': _0x5aa9a5,
              'taskId': _0x2468e5,
              'providerProfileId': _0xdcaba6['providerProfileId'],
              'runningHubApiUrl': _0x410580?.["apiUrl"]
            }, {
              'signal': _0x1ffb8d["signal"],
              'useOpenapiQuery': _0x5c66e0
            });
          },
          'resultBuilder': async _0x38fc90 => {
            const _0x3ecbc8 = a517_0x501c15["getState"]()['nodes']?.[this['id']] || {};
            const _0x1a21f7 = resolveRunningHubVideoStatusName(_0x3ecbc8, 'success') || (_0x3ecbc8?.["name"]?.["includes"](sourceVideoText('result.hdVideo')) ? sourceVideoText("result.hdVideo") : _0x3ecbc8?.["name"] || sourceVideoText("result.defaultName"));
            return {
              ...(await this["_buildRecoveredVideoResultPatch"](_0x38fc90)),
              'name': _0x1a21f7,
              'generationDuration': this["_computeGenerationDuration"](_0x3ecbc8)
            };
          },
          'failureBuilder': (_0x2d6ea3, _0x1952d9) => {
            const _0x4904c2 = _0x2d6ea3 instanceof Error ? _0x2d6ea3['message'] : String(_0x2d6ea3 || sourceVideoText("recovery.taskFailed"));
            const _0x1389f2 = a517_0x501c15["getState"]()["nodes"]?.[this['id']] || {};
            const _0xc3e94c = buildRunningHubVideoTerminalStatePatch(_0x1389f2, "failed", this["_computeGenerationDuration"](_0x1389f2)) || {};
            const _0x48edfb = _0xc3e94c['generationDuration'] ?? this['_computeGenerationDuration'](_0x1389f2);
            return {
              ...buildSourceVideoRecoveryFailurePatch(_0x1389f2, {
                'error': _0x4904c2,
                'startedAt': _0x1952d9["startedAt"],
                'duration': _0x48edfb
              }),
              ..._0xc3e94c,
              'generationDuration': _0x48edfb
            };
          },
          'parseError': _0x16e456 => _0x16e456 instanceof Error ? _0x16e456["message"] : String(_0x16e456 || sourceVideoText('recovery.taskFailed'))
        }, {
          'store': a517_0x501c15,
          'startedAt': _0x79f5bd,
          'abortController': _0x1ffb8d
        });
        _0x3d53a1["status"] === "success" && window["_triggerLocalCacheSave"]?.();
      } catch (_0x5b8c7d) {
        if (_0x1ffb8d["signal"]["aborted"] || String(_0x5b8c7d?.["message"] || '') === 'CANCELLED') {
          return;
        }
        const _0x2830d2 = _0x5b8c7d instanceof Error ? _0x5b8c7d['message'] : String(_0x5b8c7d || sourceVideoText("recovery.taskFailed"));
        const _0x47ee99 = a517_0x501c15['getState']()['nodes']?.[this['id']];
        if (!_0x47ee99) {
          return;
        }
        const _0x21b41b = buildRunningHubVideoTerminalStatePatch(_0x47ee99, "failed", this['_computeGenerationDuration'](_0x47ee99)) || {};
        a517_0x501c15['updateNodeData'](this['id'], {
          ...buildSourceVideoRecoveryFailurePatch(_0x47ee99, {
            'error': _0x2830d2,
            'startedAt': _0x79f5bd,
            'duration': _0x21b41b["generationDuration"] ?? this["_computeGenerationDuration"](_0x47ee99)
          }),
          ..._0x21b41b,
          'isGenerating': ![],
          'generationDuration': _0x21b41b['generationDuration'] ?? this["_computeGenerationDuration"](_0x47ee99),
          'rhTaskStatus': "failed",
          'rhTaskRecovering': ![]
        });
      } finally {
        this['_rhResumeAbortController'] === _0x1ffb8d && (this['_rhResumeAbortController'] = null);
        this["_rhResumeTaskId"] === _0x2468e5 && (this["_rhResumeTaskId"] = '');
        this['_rhResumePromise'] = null;
      }
    })();
    this["_rhResumePromise"] = _0x4460d1;
  }
  ["_maybeResumeAsyncTask"]() {
    const _0x4a1db2 = a517_0x501c15['getStateRaw']()["nodes"]?.[this['id']] || this["_data"];
    if (!this["_isAsyncRecoverableTask"](_0x4a1db2)) {
      this['_stopAsyncRecovery'](!![]);
      return;
    }
    const _0x59d516 = String(_0x4a1db2?.["asyncTaskId"] || '')['trim']();
    if (!_0x59d516) {
      return;
    }
    if (this['_asyncResumePromise'] && this["_asyncResumeTaskId"] === _0x59d516) {
      return;
    }
    const _0x1f9c35 = Number(_0x4a1db2?.['asyncTaskStartedAt'] || _0x4a1db2?.["generationStartTime"] || 0x0) || Date['now']();
    const _0x289318 = this["_resolveAsyncResumePayload"](_0x4a1db2);
    const _0x59e1c0 = String(_0x289318["provider"] || _0x4a1db2?.["asyncTaskProvider"] || _0x4a1db2?.["provider"] || '')["trim"]()["toLowerCase"]();
    const _0x35eae4 = typeof this['_resumeAsyncTaskPoller'] === "function" ? this["_resumeAsyncTaskPoller"] : resumeAsyncVideoTask;
    const _0x20f9a6 = new AbortController();
    this["_asyncResumeAbortController"] = _0x20f9a6;
    this["_asyncResumeTaskId"] = _0x59d516;
    const _0x355b64 = (async () => {
      try {
        const _0xc62a05 = await resumeTask({
          'sourceNodeId': this['id'],
          'targetNodeId': this['id'],
          'trigger': "node",
          'taskType': "video-generation",
          'provider': _0x59e1c0 || _0x289318["provider"] || _0x4a1db2?.["provider"] || '',
          'adapterType': "modelApi",
          'modelId': _0x289318["model"] || _0x4a1db2?.['model'] || '',
          'executionId': (_0x59e1c0 || _0x289318["provider"] || "model") + ".source-video.async",
          'payload': _0x289318,
          'taskId': _0x59d516,
          'async': !![],
          'cancellable': ![],
          'resumable': !![],
          'pauseOnAbort': !![],
          'startBuilder': () => ({
            'asyncTaskProvider': _0x59e1c0,
            'asyncTaskKind': "video",
            'asyncTaskStatus': String(_0x4a1db2?.["asyncTaskStatus"] || '')["trim"]()["toLowerCase"]() === "pending" ? 'pending' : "running"
          }),
          'poll': async () => _0x35eae4(_0x59d516, _0x289318, {
            'signal': _0x20f9a6['signal']
          }),
          'resultBuilder': async _0x2f0331 => {
            const _0x1e02d4 = a517_0x501c15["getState"]()["nodes"]?.[this['id']] || {};
            return {
              ...(await this["_buildRecoveredVideoResultPatch"](_0x2f0331)),
              'name': _0x1e02d4?.["name"]?.['includes'](sourceVideoText('result.hdVideo')) ? sourceVideoText("result.hdVideo") : _0x1e02d4?.["name"] || sourceVideoText("result.defaultName"),
              'generationDuration': this["_computeGenerationDuration"](_0x1e02d4)
            };
          },
          'failureBuilder': (_0x667220, _0x102d04) => {
            const _0x4602bf = _0x667220 instanceof Error ? _0x667220["message"] : String(_0x667220 || sourceVideoText("recovery.taskFailed"));
            const _0xeba1bb = a517_0x501c15["getState"]()["nodes"]?.[this['id']] || {};
            return buildSourceVideoRecoveryFailurePatch(_0xeba1bb, {
              'error': _0x4602bf,
              'startedAt': _0x102d04["startedAt"],
              'duration': this['_computeGenerationDuration'](_0xeba1bb)
            });
          },
          'parseError': _0x17cd9c => _0x17cd9c instanceof Error ? _0x17cd9c["message"] : String(_0x17cd9c || sourceVideoText("recovery.taskFailed"))
        }, {
          'store': a517_0x501c15,
          'startedAt': _0x1f9c35,
          'abortController': _0x20f9a6
        });
        _0xc62a05["status"] === 'success' && window["_triggerLocalCacheSave"]?.();
      } catch (_0xf0728) {
        if (_0x20f9a6["signal"]["aborted"] || String(_0xf0728?.["message"] || '') === "CANCELLED" || _0xf0728?.["name"] === 'AbortError') {
          return;
        }
        const _0x5b11ca = _0xf0728 instanceof Error ? _0xf0728["message"] : String(_0xf0728 || sourceVideoText('recovery.taskFailed'));
        const _0x280ad0 = a517_0x501c15["getState"]()["nodes"]?.[this['id']];
        if (!_0x280ad0) {
          return;
        }
        a517_0x501c15['updateNodeData'](this['id'], {
          ...buildSourceVideoRecoveryFailurePatch(_0x280ad0, {
            'error': _0x5b11ca,
            'startedAt': _0x1f9c35,
            'duration': this['_computeGenerationDuration'](_0x280ad0)
          }),
          'isGenerating': ![],
          'asyncTaskStatus': "failed",
          'asyncTaskRecovering': ![]
        });
      } finally {
        this["_asyncResumeAbortController"] === _0x20f9a6 && (this["_asyncResumeAbortController"] = null);
        this["_asyncResumeTaskId"] === _0x59d516 && (this["_asyncResumeTaskId"] = '');
        this["_asyncResumePromise"] = null;
      }
    })();
    this['_asyncResumePromise'] = _0x355b64;
  }
  ["update"](_0x7b2705) {
    const _0x5813f2 = createVideoNodeUpdatePerf();
    this["_data"] = _0x7b2705;
    this["_syncRunningHubVideoTaskState"](_0x7b2705) && (this["_data"] = a517_0x501c15['getState']()["nodes"]?.[this['id']] || _0x7b2705, _0x7b2705 = this["_data"]);
    this['_syncMutedStateFromData'](_0x7b2705);
    this["_syncVideoDurationUi"]();
    _0x5813f2?.["mark"]('task-muted-state');
    const _0x36703e = this["_resolveVideoSrc"](_0x7b2705);
    _0x5813f2?.["mark"]('resolve-source');
    const _0x361b33 = shouldShowGenerationResultLoadingUi(_0x7b2705, {
      'hasResult': !!_0x36703e
    });
    if (_0x361b33) {
      startLoading(this['_card'], {
        'variant': "full"
      });
      if (this['_hint']) {
        this["_hint"]['style']["display"] = "none";
      }
      if (this["_uploadBtn"]) {
        this["_uploadBtn"]["disabled"] = !![];
      }
    } else {
      if (isTaskTerminal(_0x7b2705)) {
        if (!_0x36703e) {
          stopLoading(this["_card"]);
        }
        if (this["_uploadBtn"]) {
          this["_uploadBtn"]['disabled'] = ![];
        }
      } else {
        if (this["_uploadBtn"]) {
          this["_uploadBtn"]["disabled"] = ![];
        }
        if (!_0x36703e) {
          stopLoading(this["_card"]);
        }
      }
    }
    _0x5813f2?.["mark"]("loading-ui");
    const _0x351ddf = resolveSourceVideoPosterSrc(_0x7b2705);
    const _0x344502 = _0x351ddf !== this["_lastPosterSrc"];
    if (this["_rendererMediaDeferred"] === !![]) {
      this["_currentSrc"] = _0x36703e || '';
      this["_video"] && (this["_video"]["preload"] = 'none', this["_clearVideoElementSource"]({
        'load': ![]
      }));
      if (_0x344502 || _0x351ddf) {
        this["_applyVideoPoster"](_0x7b2705);
      } else {
        this["_setPosterFrameVisible"](![]);
      }
      _0x5813f2?.["mark"]("deferred-poster");
      this['_rendererDetailsDeferred'] !== !![] && hasSourceVideoRecoveryWork(_0x7b2705) && (this["_maybeResumeRunningHubTask"](), this["_maybeResumeAsyncTask"]());
      _0x5813f2?.['mark']("deferred-task-resume");
      this['_label'] && _0x7b2705['name'] && document["activeElement"] !== this['_label'] && this["_label"]["textContent"] !== _0x7b2705["name"] && (this["_label"]["textContent"] = _0x7b2705["name"]);
      this["_syncGenerationFailureUi"](_0x7b2705);
      _0x5813f2?.["mark"]("label");
      this["_lastUpdatePerfBreakdown"] = _0x5813f2?.["finish"]() || null;
      return;
    }
    this["_requestVisibleProxyMigration"]();
    _0x5813f2?.["mark"]('proxy-migration');
    const _0x1094bc = String(_0x36703e || '')["trim"]() !== String(this["_currentSrc"] || '')["trim"]();
    const _0x2193f5 = _0x1094bc && (this["_shouldDeferActivePlaybackSourceChange"](_0x36703e) || this["_shouldKeepReadyCapturePreview"](_0x36703e));
    !_0x1094bc && this["_hasPendingPlaybackSource"] === !![] && this["_clearPendingPlaybackSource"]();
    if (_0x2193f5) {
      this["_setPendingPlaybackSource"](_0x36703e);
    } else {
      if (_0x1094bc) {
        this['_clearPendingPlaybackSource']();
        this['_loadVideo'](_0x36703e || '');
      } else {
        if (_0x36703e && _0x344502 && (!this["_video"] || this['_video']["paused"]) && !this["_isVideoFrameReadyToShow"]()) {
          this["_loadVideo"](_0x36703e);
        } else {
          if (_0x344502) {
            this["_applyVideoPoster"](_0x7b2705);
          }
        }
      }
    }
    _0x5813f2?.['mark']('media-poster');
    this["_maybeFetchVideoMeta"](_0x7b2705);
    hasSourceVideoRecoveryWork(_0x7b2705) && (this['_maybeResumeRunningHubTask'](), this['_maybeResumeAsyncTask']());
    _0x5813f2?.["mark"]("meta-task-resume");
    this["_label"] && _0x7b2705["name"] && document['activeElement'] !== this['_label'] && this["_label"]["textContent"] !== _0x7b2705["name"] && (this["_label"]["textContent"] = _0x7b2705['name']);
    this["_syncGenerationFailureUi"](_0x7b2705);
    _0x5813f2?.["mark"]("label");
    this["_lastUpdatePerfBreakdown"] = _0x5813f2?.["finish"]() || null;
  }
  ["unmount"]() {
    clearSourceVideoPlaybackFeedback(this);
    this["_canonicalAssetImportDisposed"] = !![];
    this["_progressDragSession"]?.["dispose"]?.();
    this["_progressDragSession"] = null;
    if (this['_bar']?.['dataset']) {
      this["_bar"]["dataset"]["dragging"] = 'false';
    }
    this["_isSeeking"] = ![];
    this["_seekToken"] = Number(this["_seekToken"] || 0x0) + 0x1;
    this["_invalidateCanonicalAssetImportRetry"]();
    this['_clearPendingPlaybackSource']();
    this["_invalidatePendingPlaybackResume"]();
    this["_metaFetchToken"] = Number(this['_metaFetchToken'] || 0x0) + 0x1;
    this["_playbackSourceToken"] = Number(this['_playbackSourceToken'] || 0x0) + 0x1;
    this["_setRendererPlaybackPin"](![]);
    this['_hoverPlaybackLifecycle']?.['dispose']?.();
    this["_unsubscribeLocale"]?.();
    this["_unsubscribeLocale"] = null;
    this['_videoToolbarCleanup']?.();
    this["_videoToolbarCleanup"] = null;
    this["_removeDeferredToolbarActivator"]?.();
    this["_removeDeferredToolbarActivator"] = null;
    this['_removeDeferredInteractionActivator']?.();
    this["_removeDeferredInteractionActivator"] = null;
    this["_cancelProgressLoop"]();
    this["_posterFramePreloadToken"] = (this["_posterFramePreloadToken"] || 0x0) + 0x1;
    this['_idleVideoThumbCancel'] && (this["_idleVideoThumbCancel"](), this["_idleVideoThumbCancel"] = null);
    this["_cancelDeferredVideoMetaFetch"]();
    this["_releaseActiveCapturePreviewUrl"]();
    this['_stopRunningHubRecovery'](![]);
    this["_stopAsyncRecovery"](![]);
    this["_centerIndicatorTimer"] && (clearTimeout(this['_centerIndicatorTimer']), this["_centerIndicatorTimer"] = null);
    this["_video"] && (this["_setManualLoopPlayback"](![]), detachVideoPlaybackRecovery(this["_video"]), this["_video"]['pause'](), this["_video"]["src"] = '');
    this["_releasePlaybackObjectUrl"]();
  }
  ["prepareRendererVisibleVideoPreview"]() {
    this["_rendererEagerVideoPreview"] = ![];
    return this['_rendererMediaDeferred'] === !![];
  }
  ["prepareRendererMediaFallbackForSuspend"]() {
    const _0x38bdef = String(this["_lastPosterSrc"] || '')["trim"]();
    if (!_0x38bdef || !this["_posterFrame"]) {
      return ![];
    }
    this["_posterFrame"]["loading"] = 'eager';
    try {
      this["_posterFrame"]['fetchPriority'] = "high";
    } catch {}
    this["_applyPosterFrameSource"](_0x38bdef);
    const _0x4b5615 = this["_posterFrame"]["isConnected"] !== ![] && this["_posterFrame"]["complete"] === !![] && Number(this["_posterFrame"]['naturalWidth'] || 0x0) > 0x0;
    if (_0x4b5615) {
      this["_setPosterFrameVisible"](!![]);
    }
    return _0x4b5615;
  }
  ['suspendRendererMedia']() {
    clearSourceVideoPlaybackFeedback(this);
    this["_setRendererPlaybackPin"](![]);
    this["_rendererMediaDeferred"] = !![];
    this["_rendererEagerVideoPreview"] = ![];
    this['_playbackSourceToken'] = Number(this["_playbackSourceToken"] || 0x0) + 0x1;
    this['_playbackSourcePromise'] = null;
    this["_clearPendingPlaybackSource"]();
    this["_invalidatePendingPlaybackResume"]();
    this["_playbackSourcePromiseSource"] = '';
    this["_loadVideoToken"] = null;
    this["_currentSrc"] = null;
    this["_isHovered"] = ![];
    this['_isManualControl'] = ![];
    this['_hoverManualPause'] = ![];
    this["_autoPlayToken"] += 0x1;
    if (this['_video']) {
      this['_video']["onloadeddata"] = null;
      this["_video"]["onerror"] = null;
      this["_video"]["preload"] = "none";
      try {
        this["_video"]["pause"]?.();
      } catch {}
      this["_clearVideoElementSource"]();
      this["_syncPosterFrameVisibility"]();
    } else {
      this['_releasePlaybackObjectUrl']();
    }
    this["_syncPlaybackChromeVisibility"]({
      'forceHidden': !![]
    });
  }
  ['hydrateDeferredMedia']() {
    if (this["_rendererMediaDeferred"] !== !![]) {
      return;
    }
    this["_rendererMediaDeferred"] = ![];
    this["_rendererEagerVideoPreview"] = ![];
    this["_bindVideoInteractionHandlers"]();
    this['_ensureVideoToolbarBound']();
    const _0x1cdc91 = this["_promotePendingProxyAtMediaSegmentBoundary"](a517_0x501c15["getStateRaw"]()['nodes']?.[this['id']] || this['_data']);
    this["_requestVisibleProxyMigration"]();
    const _0x2f6116 = this["_resolveVideoSrc"](_0x1cdc91);
    if (_0x2f6116) {
      this["_loadVideo"](_0x2f6116);
    } else {
      this["_loadVideo"]('');
    }
    this["_scheduleDeferredVideoMetaFetch"](_0x1cdc91);
  }
}