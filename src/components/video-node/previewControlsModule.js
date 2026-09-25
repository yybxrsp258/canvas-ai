import { buildVideoFrameCaptureNodeName, captureVideoFrameSnapshot, DEFAULT_VIDEO_FRAME_CAPTURE_FPS, getVideoFrameSource, isVideoFrameReady, resolveVideoFrameCaptureIndex, startVideoFrameSnapshotPersistence, waitForVideoFrame } from '../videoFrameCapture.js';
import { t } from '../../i18n/index.js';
import { buildVideoMutedPatch, readVideoAudioDefaultEnabledFromStore, resolveVideoMutedPreference } from './videoMuteState.js';
import { isTaskFailed } from '../../core/generationTaskUiState.js';
import { shouldActivateRendererMediaHoverPlayback } from '../../core/rendererDeferredMedia.js';
import { isExternallyOwnedVideoPlayback, setHoverPlaybackChromeVisible, shouldKeepManualPlaybackPresentationActive, shouldTakeOverActiveHoverPlayback } from '../shared/hoverVideoPlaybackLifecycle.js';
import { startMediaProgressDragSession } from '../shared/mediaProgressDragSession.js';
import { isSegmentRetakeEditing } from '../../modules/videoRetake/segmentRetakeModelPolicy.js';
function previewControlsText(_0x3e4fa5, _0xe588a9 = {}) {
  return t(_0x3e4fa5, _0xe588a9);
}
export function createVideoNodePreviewControlsModule(_0x2139ca) {
  const {
    store: _0x2658e3,
    saveOutputBlob: _0x56c5ff,
    VideoKeyingController: _0x25751b,
    getAutoMediaSizeByShortSide: _0x2abe6a,
    buildSourceMediaNodePayload: _0x4fee8a,
    calcSafeSpawnPosNearNode: _0x41bb12
  } = _0x2139ca;
  class _0x3f767e {
    ["_schedulePreviewHoverTimer"](_0x30b719, _0x560490) {
      if (typeof _0x30b719 !== "function") {
        return null;
      }
      const _0x3f3743 = this["_previewHoverRetryTimers"] || (this["_previewHoverRetryTimers"] = new Set());
      let _0x443ca1 = null;
      _0x443ca1 = setTimeout(() => {
        _0x3f3743["delete"](_0x443ca1);
        _0x30b719();
      }, Math["max"](0x0, Number(_0x560490) || 0x0));
      _0x3f3743['add'](_0x443ca1);
      return _0x443ca1;
    }
    ["_cancelPreviewHoverRetryTimers"]() {
      const _0x364c0e = this["_previewHoverRetryTimers"];
      if (!_0x364c0e?.['size']) {
        return 0x0;
      }
      const _0x111e43 = _0x364c0e["size"];
      for (const _0x3ddd9f of _0x364c0e) {
        clearTimeout(_0x3ddd9f);
      }
      _0x364c0e["clear"]();
      return _0x111e43;
    }
    ["_schedulePreviewHoverPlaybackWhenVideoReady"]({
      hydrateDeferredMedia = ![]
    } = {}) {
      if (this["_previewHoverActivationPending"] === !![]) {
        return !![];
      }
      if (this["previewEl"]?.["matches"]?.(":hover") !== !![]) {
        return ![];
      }
      this["_cancelPreviewHoverRetryTimers"]();
      this["_previewHoverActivationPending"] = !![];
      this['_isHovered'] = !![];
      const _0x1eb7a4 = ++this['_autoPlayToken'];
      const _0x2a847f = [0x0, 0x20, 0x60, 0xf0, 0x258, 0x4b0];
      const _0x4bfce9 = _0x3ea376 => {
        this["_schedulePreviewHoverTimer"](() => {
          const _0x53e674 = this["previewEl"]?.["matches"]?.(":hover") === !![];
          if (this['_autoPlayToken'] !== _0x1eb7a4 || this['_isHovered'] !== !![] || this['previewEl']?.["isConnected"] === ![] || !_0x53e674) {
            this["_previewHoverActivationPending"] = ![];
            return;
          }
          if (hydrateDeferredMedia && this["_rendererMediaDeferred"] === !![] && typeof this['hydrateDeferredMedia'] === "function") {
            this["hydrateDeferredMedia"]();
            if (this["_rendererMediaDeferred"] !== !![]) {
              _0x4bfce9(_0x3ea376);
              return;
            }
          }
          const _0x9105be = this["_getActivePreviewVideoEl"]();
          if (_0x9105be) {
            this['_previewHoverActivationPending'] = ![];
            this["_isHovered"] = ![];
            this["activatePreviewHoverPlayback"]();
            return;
          }
          _0x3ea376 + 0x1 < _0x2a847f['length'] ? _0x4bfce9(_0x3ea376 + 0x1) : (this["_previewHoverActivationPending"] = ![], this["_isHovered"] = ![]);
        }, _0x2a847f[_0x3ea376]);
      };
      _0x4bfce9(0x0);
      return !![];
    }
    ["activatePreviewHoverPlayback"]() {
      const _0x2d3066 = typeof _0x2658e3["getStateRaw"] === "function" ? _0x2658e3["getStateRaw"]() : _0x2658e3["getState"]();
      if (!shouldActivateRendererMediaHoverPlayback({
        'viewport': _0x2d3066?.["viewport"],
        'nodeCount': Number["isFinite"](_0x2d3066?.["_nodeCount"]) ? _0x2d3066["_nodeCount"] : Object["keys"](_0x2d3066?.["nodes"] || {})["length"],
        'isSelected': _0x2d3066?.["selectedNodeIds"]?.['includes']?.(this['nodeId']) === !![]
      })) {
        return ![];
      }
      const _0x56d89d = _0x2d3066["videoClip"];
      if (_0x56d89d && _0x56d89d['active'] && _0x56d89d['nodeId'] === this["nodeId"]) {
        return ![];
      }
      const _0x186ae4 = _0x2d3066["nodes"]?.[this['nodeId']] || this["_data"] || {};
      if (isSegmentRetakeEditing(_0x186ae4)) {
        this['_cancelPreviewHoverRetryTimers']();
        this['_previewHoverActivationPending'] = ![];
        this['_isHovered'] = ![];
        const _0x31c1e1 = this["_getActivePreviewVideoEl"]?.();
        const _0x54d151 = this["_isManualControl"] === !![] || this["_isManualLoopPlayback"] === !![] || isExternallyOwnedVideoPlayback(_0x31c1e1);
        !_0x54d151 && (this["_autoPlayToken"]++, _0x31c1e1 && (_0x31c1e1["loop"] = ![], _0x31c1e1["pause"]?.()));
        this["_setVideoOverlaysVisible"](!![], _0x31c1e1);
        return ![];
      }
      if (isTaskFailed(_0x186ae4)) {
        this["_setVideoOverlaysVisible"](![]);
        return ![];
      }
      if (_0x186ae4["isVideosExpanded"]) {
        return ![];
      }
      this["_cancelPreviewHoverRetryTimers"]();
      this["_hoverPlaybackLifecycle"]?.["activate"]?.();
      const _0x1d45e3 = this["_isHovered"] === !![];
      this["_isHovered"] = !![];
      if (this['_rendererMediaDeferred'] === !![]) {
        return this['_schedulePreviewHoverPlaybackWhenVideoReady']({
          'hydrateDeferredMedia': !![]
        });
      }
      typeof this["previewEl"]?.["querySelectorAll"] === 'function' && this['_ensurePreviewVideoOverlays']();
      this["_rendererDetailsDeferred"] !== !![] && this["_rendererThinVideoHydration"] === !![] && void this["hydrateRendererThinVideoPresentation"]?.();
      const _0x3c5751 = this["_getActivePreviewVideoEl"]();
      if (!_0x3c5751) {
        return this["_schedulePreviewHoverPlaybackWhenVideoReady"]();
      }
      this["_setVideoOverlaysVisible"](!![]);
      if (_0x1d45e3 && _0x3c5751["paused"] === ![] || shouldKeepManualPlaybackPresentationActive(this, _0x3c5751)) {
        return !![];
      }
      if (isExternallyOwnedVideoPlayback(_0x3c5751)) {
        return !![];
      }
      const _0x24549e = Number(_0x3c5751["duration"] || 0x0);
      const _0xaa2e91 = Number(_0x3c5751['currentTime'] || 0x0);
      const _0x4a540b = (_0x3c5751["ended"] === !![] || Number["isFinite"](_0x24549e) && _0x24549e > 0x0 && _0xaa2e91 >= Math["max"](0x0, _0x24549e - 0.05)) && this['_isPreviewPosterClearedForPlayback']?.(_0x3c5751) === !![];
      if (_0x4a540b) {
        try {
          _0x3c5751["currentTime"] = 0x0;
        } catch {}
      }
      this["_previewHoverActivationPending"] = ![];
      this["_isHovered"] = !![];
      if (_0x25751b["isActiveFor"](this["nodeId"])) {
        _0x3c5751["pause"]();
        return ![];
      }
      if (this["_hoverManualPause"]) {
        return ![];
      }
      if (this["_isManualLoopPlayback"]) {
        return ![];
      }
      _0x3c5751["loop"] = !![];
      const _0x1fa7d7 = ++this["_autoPlayToken"];
      typeof this["_logPreviewVideoPlaybackEvent"] === "function" && this["_logPreviewVideoPlaybackEvent"](_0x3c5751, "hover-enter", "hover");
      if (typeof this['_playPreviewVideoWithRecovery'] === "function") {
        let _0x38a8ec = ![];
        let _0x168694 = ![];
        const _0x8ab53f = () => this["_autoPlayToken"] === _0x1fa7d7 && this["_isHovered"] === !![] && !this["_hoverManualPause"] && !this["_isManualLoopPlayback"];
        const _0x414852 = () => {
          if (!_0x8ab53f()) {
            return Promise["resolve"](![]);
          }
          if (_0x168694 || _0x38a8ec) {
            return Promise["resolve"](_0x38a8ec);
          }
          _0x168694 = !![];
          return Promise['resolve'](this["_playPreviewVideoWithRecovery"](_0x3c5751, {
            'reason': "hover",
            'shouldContinue': _0x8ab53f
          }))['then'](_0x3d276b => {
            (_0x3d276b || !_0x3c5751["paused"] && Number(_0x3c5751["currentTime"] || 0x0) >= 0x0) && (_0x38a8ec = !![]);
            _0x168694 = ![];
            return _0x3d276b;
          }, _0x1488f3 => {
            _0x168694 = ![];
            throw _0x1488f3;
          });
        };
        const _0x4c3037 = _0x387e61 => {
          if (!_0x8ab53f()) {
            return ![];
          }
          this["_schedulePreviewHoverTimer"](() => {
            if (!_0x8ab53f()) {
              return;
            }
            if (_0x3c5751["isConnected"] === ![] || this["_getActivePreviewVideoEl"]() !== _0x3c5751) {
              return;
            }
            if (_0x168694 || _0x38a8ec || _0x3c5751["ended"] === !![]) {
              return;
            }
            const _0x50144b = Number(_0x3c5751["duration"] || 0x0);
            const _0x41931e = Number(_0x3c5751["currentTime"] || 0x0);
            if (Number['isFinite'](_0x50144b) && _0x50144b > 0x0 && _0x41931e >= Math["max"](0x0, _0x50144b - 0.05)) {
              return;
            }
            (_0x3c5751["paused"] || Number(_0x3c5751["currentTime"] || 0x0) <= 0x0) && void _0x414852();
          }, _0x387e61);
          return !![];
        };
        void _0x414852()["then"](_0x1216f6 => {
          if (!_0x1216f6) {
            _0x4c3037(0x0);
          }
        });
        _0x4c3037(0xb4);
        _0x4c3037(0x2bc);
        _0x4c3037(0x578);
        return !![];
      }
      typeof this["_markPreviewPosterClearedForPlayback"] === "function" && this["_markPreviewPosterClearedForPlayback"](_0x3c5751);
      if (this["_autoPlayToken"] !== _0x1fa7d7) {
        _0x3c5751['pause']();
        return ![];
      }
      const _0x1e0c1d = _0x3c5751['play']();
      _0x1e0c1d && typeof _0x1e0c1d["catch"] === "function" && _0x1e0c1d["catch"](() => {});
      return !![];
    }
    ["_deactivatePreviewHoverPlayback"]() {
      this["_cancelPreviewHoverRetryTimers"]();
      this["_isHovered"] = ![];
      this["_previewHoverActivationPending"] = ![];
      const _0x3d6098 = this['_getActivePreviewVideoEl']();
      const _0x2c6f9a = shouldKeepManualPlaybackPresentationActive(this, _0x3d6098);
      if (!_0x2c6f9a) {
        this["_autoPlayToken"]++;
      }
      if (_0x3d6098) {
        if (!_0x2c6f9a) {
          _0x3d6098['loop'] = ![];
        }
        this["_logPreviewVideoPlaybackEvent"]?.(_0x3d6098, "hover-leave", "hover");
        if (!_0x2c6f9a) {
          _0x3d6098['pause']?.();
        }
      }
      this['_hoverManualPause'] = ![];
      !_0x2c6f9a && !this["_isManualLoopPlayback"] && (this["_isManualControl"] = ![]);
      this['_setVideoOverlaysVisible'](_0x2c6f9a, _0x3d6098);
      this["_hoverPlaybackLifecycle"]?.["deactivate"]?.({
        'release': ![]
      });
      return !!_0x3d6098;
    }
    ["_ensurePreviewVideoOverlays"]() {
      if (!this["previewEl"]) {
        return;
      }
      const _0x2dbfdc = _0x2658e3["getState"]()["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x1c238e = isSegmentRetakeEditing(_0x2dbfdc);
      this['_syncMutedStateFromNodeData'](this["_data"]);
      if (!_0x1c238e && !this['_muteBtnEl']) {
        const _0x15a8c1 = document["createElement"]("button");
        _0x15a8c1["type"] = "button";
        _0x15a8c1['className'] = "video-mute-btn";
        _0x15a8c1["dataset"]["tooltip"] = previewControlsText("sourceVideoNode.controls.toggleMute");
        Object["assign"](_0x15a8c1["style"], {
          'display': "flex",
          'alignItems': "center",
          'justifyContent': "center",
          'color': "var(--media-control-button-text)",
          'cursor': "pointer",
          'userSelect': "none"
        });
        const _0x3e0c62 = document["createElementNS"]("http://www.w3.org/2000/svg", "svg");
        _0x3e0c62["setAttribute"]('width', '16');
        _0x3e0c62["setAttribute"]("height", '16');
        _0x3e0c62["setAttribute"]("viewBox", "0 0 24 24");
        _0x3e0c62["setAttribute"]("fill", "none");
        _0x3e0c62["setAttribute"]("stroke", 'currentColor');
        _0x3e0c62['setAttribute']("stroke-width", '2');
        _0x3e0c62['classList']["add"]("icon-unmuted");
        _0x3e0c62["innerHTML"] = "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"></polygon><path d=\"M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07\"></path>";
        const _0x1feec3 = document["createElementNS"]("http://www.w3.org/2000/svg", 'svg');
        _0x1feec3["setAttribute"]("width", '16');
        _0x1feec3["setAttribute"]('height', '16');
        _0x1feec3['setAttribute']("viewBox", "0 0 24 24");
        _0x1feec3['setAttribute']("fill", "none");
        _0x1feec3['setAttribute']("stroke", "currentColor");
        _0x1feec3["setAttribute"]("stroke-width", '2');
        _0x1feec3["classList"]["add"]('icon-muted');
        _0x1feec3["innerHTML"] = "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"></polygon><line x1=\"23\" y1=\"1\" x2=\"1\" y2=\"23\"></line><line x1=\"15.54\" y1=\"8.46\" x2=\"19.07\" y2=\"12\"></line>";
        _0x15a8c1['appendChild'](_0x3e0c62);
        _0x15a8c1["appendChild"](_0x1feec3);
        _0x15a8c1["addEventListener"]("pointerdown", _0x54c3d6 => _0x54c3d6["stopPropagation"]());
        _0x15a8c1["addEventListener"]('click', _0x5685fc => {
          _0x5685fc["stopPropagation"]();
          this["_setPreviewMuted"](!this["_isMuted"], {
            'persist': !![]
          });
          this['_applyMuteStateToPreviewVideos']();
          this["_syncMuteBtnIcon"]();
        });
        this['previewEl']["appendChild"](_0x15a8c1);
        this["_muteBtnEl"] = _0x15a8c1;
        this['_muteIconUnmutedEl'] = _0x3e0c62;
        this["_muteIconMutedEl"] = _0x1feec3;
        this["_syncMuteBtnIcon"]?.();
      }
      if (!this["_centerIndicatorEl"]) {
        const _0x17e223 = document["createElement"]("div");
        _0x17e223["className"] = "gen-video-center-indicator";
        Object['assign'](_0x17e223['style'], {
          'position': 'absolute',
          'inset': '0',
          'display': "flex",
          'alignItems': "center",
          'justifyContent': "center",
          'pointerEvents': "none",
          'zIndex': '11'
        });
        const _0x47610e = document["createElement"]("div");
        Object["assign"](_0x47610e["style"], {
          'width': "64px",
          'height': '64px',
          'borderRadius': "18px",
          'background': "var(--media-control-center-bg)",
          'border': "1px solid var(--media-control-center-border)",
          'display': 'flex',
          'alignItems': "center",
          'justifyContent': "center",
          'color': "var(--media-control-button-text)",
          'opacity': '0',
          'transform': "scale(0.92)",
          'transition': "opacity 0.18s ease, transform 0.18s ease"
        });
        _0x17e223["appendChild"](_0x47610e);
        this["previewEl"]["appendChild"](_0x17e223);
        this["_centerIndicatorEl"] = _0x17e223;
        this['_centerIndicatorInnerEl'] = _0x47610e;
      }
      if (!_0x1c238e && !this['_controlsEl']) {
        const _0xf5309e = document["createElement"]("div");
        _0xf5309e["className"] = 'video-controls';
        Object["assign"](_0xf5309e["style"], {
          'position': "absolute",
          'bottom': '0',
          'left': '0',
          'width': "100%",
          'padding': "16px 16px",
          'display': "flex",
          'alignItems': "center",
          'gap': "12px",
          'background': "var(--media-control-overlay-bg)",
          'zIndex': '60',
          'opacity': '1',
          'transition': 'opacity\x200.2s'
        });
        const _0x11caaf = document["createElement"]("button");
        _0x11caaf["type"] = "button";
        _0x11caaf['className'] = "video-play-btn";
        Object['assign'](_0x11caaf["style"], {
          'cursor': "pointer",
          'color': "var(--media-control-button-text)",
          'display': "flex",
          'alignItems': "center"
        });
        const _0x52e27a = document['createElement']('span');
        _0x52e27a["className"] = "video-time-current";
        Object['assign'](_0x52e27a["style"], {
          'color': "var(--media-control-time-text)",
          'fontSize': "12px",
          'fontVariantNumeric': "tabular-nums"
        });
        _0x52e27a["textContent"] = "0:00";
        const _0x25d7ca = document['createElement']("div");
        _0x25d7ca["className"] = "media-progress-bar";
        Object['assign'](_0x25d7ca["style"], {
          'flex': '1',
          'height': "4px",
          'background': 'var(--media-control-progress-track)',
          'borderRadius': "2px",
          'cursor': "pointer",
          'position': "relative"
        });
        const _0x561ea5 = document["createElement"]("div");
        _0x561ea5["className"] = "media-progress-fill";
        Object["assign"](_0x561ea5["style"], {
          'width': '0%',
          'height': '100%',
          'background': "var(--media-control-progress-fill)",
          'borderRadius': "2px",
          'pointerEvents': "none",
          'position': "relative"
        });
        const _0x57f258 = document["createElement"]("div");
        _0x57f258["className"] = "media-progress-knob";
        Object["assign"](_0x57f258["style"], {
          'width': "10px",
          'height': "10px",
          'background': "var(--media-control-progress-fill)",
          'borderRadius': "50%",
          'position': 'absolute',
          'right': "-5px",
          'top': "-3px",
          'boxShadow': "0 0 4px var(--media-control-knob-shadow)"
        });
        _0x561ea5['appendChild'](_0x57f258);
        _0x25d7ca["appendChild"](_0x561ea5);
        const _0x11b0c8 = document["createElement"]('span');
        _0x11b0c8["className"] = "video-time-total";
        Object["assign"](_0x11b0c8["style"], {
          'color': "var(--media-control-time-text)",
          'fontSize': "12px",
          'fontVariantNumeric': "tabular-nums"
        });
        _0x11b0c8['textContent'] = '0:00';
        const _0x5901ff = document['createElement']("button");
        _0x5901ff["type"] = "button";
        _0x5901ff['className'] = "video-snap-btn";
        _0x5901ff["dataset"]["tooltip"] = previewControlsText("sourceVideoNode.controls.captureFrame");
        Object["assign"](_0x5901ff["style"], {
          'cursor': 'pointer',
          'color': 'var(--media-control-button-text)',
          'display': "flex",
          'alignItems': 'center'
        });
        _0x5901ff['innerHTML'] = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z\"></path><circle cx=\"12\" cy=\"13\" r=\"4\"></circle></svg>";
        _0xf5309e['appendChild'](_0x11caaf);
        _0xf5309e["appendChild"](_0x52e27a);
        _0xf5309e['appendChild'](_0x25d7ca);
        _0xf5309e["appendChild"](_0x11b0c8);
        _0xf5309e["appendChild"](this['_muteBtnEl']);
        _0xf5309e["appendChild"](_0x5901ff);
        _0xf5309e["addEventListener"]("pointerdown", _0x567a80 => _0x567a80["stopPropagation"]());
        _0xf5309e["addEventListener"]("click", _0x11dfe5 => _0x11dfe5['stopPropagation']());
        let _0x18c0a2 = ![];
        const _0xb13840 = _0x4315dc => {
          if (_0x25751b["isActiveFor"](this["nodeId"])) {
            return;
          }
          const _0x2d5a48 = this["_getActivePreviewVideoEl"]();
          if (!_0x2d5a48) {
            return;
          }
          this["_toggleVideoPlayPause"](_0x2d5a48, {
            'loop': _0x4315dc["shiftKey"] === !![]
          });
          this["_syncVideoControlsFromVideo"](_0x2d5a48);
        };
        _0x11caaf["addEventListener"]("pointerdown", _0x225598 => {
          _0x225598["stopPropagation"]();
          _0x225598["preventDefault"]();
          _0x18c0a2 = !![];
          _0xb13840(_0x225598);
        });
        _0x11caaf["addEventListener"]('click', _0x346729 => {
          _0x346729["stopPropagation"]();
          if (_0x18c0a2) {
            _0x18c0a2 = ![];
            return;
          }
          _0xb13840(_0x346729);
        });
        const _0x455012 = _0x1d3069 => {
          if (!this["_progressBarEl"]) {
            return 0x0;
          }
          const _0xe6aaa4 = this['_progressBarEl']['getBoundingClientRect']();
          const _0x39e101 = _0xe6aaa4["width"] || 0x0;
          if (!_0x39e101) {
            return 0x0;
          }
          const _0x1441d5 = _0x1d3069['clientX'] - _0xe6aaa4['left'];
          if (!Number["isFinite"](_0x1441d5)) {
            return 0x0;
          }
          return Math["max"](0x0, Math['min'](0x1, _0x1441d5 / _0x39e101));
        };
        const _0x476829 = _0x27570d => {
          if (this['_progressFillEl']) {
            this["_progressFillEl"]['style']["width"] = _0x27570d * 0x64 + '%';
          }
          const _0x221ee5 = this['_getActivePreviewVideoEl']();
          const _0x31b646 = this["_getActiveVideoDuration"](_0x221ee5);
          this["_timeCurrentEl"] && _0x31b646 > 0x0 && (this['_timeCurrentEl']["textContent"] = this["_fmtVideoTime"](_0x27570d * _0x31b646));
        };
        const _0x5d97a2 = _0x2bd507 => {
          const _0x2d629b = this["_getActivePreviewVideoEl"]();
          this['_seekActiveVideoByPos'](_0x2d629b, _0x2bd507);
        };
        _0x25d7ca["addEventListener"]("pointerdown", _0x3fdfc6 => {
          _0x3fdfc6["stopPropagation"]();
          _0x3fdfc6["preventDefault"]();
          if (_0x3fdfc6["button"] !== 0x0 || _0x3fdfc6['isPrimary'] === ![]) {
            return;
          }
          this["_progressDragSession"]?.["cancel"]?.();
          if (_0x25751b["isActiveFor"](this["nodeId"])) {
            return;
          }
          const _0xc8529c = this["_getActivePreviewVideoEl"]();
          if (!_0xc8529c) {
            return;
          }
          const _0x2f7466 = !!String(_0xc8529c["getAttribute"]("src") || '')["trim"]();
          this["_isManualControl"] = !![];
          this["_setManualLoopPlayback"](![], _0xc8529c);
          this['_autoPlayToken']++;
          this['_hoverManualPause'] = !![];
          _0xc8529c["pause"]();
          if (!_0x2f7466) {
            this["_ensureVideoSrcFor"](_0xc8529c)["then"](_0x154b0b => {
              if (!_0x154b0b) {
                return;
              }
              const _0x565b8a = _0x455012(_0x3fdfc6);
              _0x476829(_0x565b8a);
              _0x5d97a2(_0x565b8a);
            });
            return;
          }
          this["_isProgressDragging"] = !![];
          const _0x36b82b = _0x455012(_0x3fdfc6);
          _0x476829(_0x36b82b);
          _0x5d97a2(_0x36b82b);
          const _0x145860 = _0x6cbb44 => {
            const _0x59d874 = _0x455012(_0x6cbb44);
            _0x476829(_0x59d874);
            _0x5d97a2(_0x59d874);
          };
          const _0x5e9ba6 = _0x4143c7 => {
            _0x4143c7?.['stopPropagation']?.();
            this['_isProgressDragging'] = ![];
            this["_progressDragSession"] = null;
            const _0x2ab6fd = this["_getActivePreviewVideoEl"]();
            this['_syncVideoControlsFromVideo'](_0x2ab6fd);
          };
          this["_progressDragSession"] = startMediaProgressDragSession({
            'target': window,
            'pointerId': _0x3fdfc6["pointerId"],
            'onMove': _0x145860,
            'onEnd': _0x5e9ba6,
            'onCancel': _0x5e9ba6
          });
        });
        _0x5901ff["addEventListener"]("click", _0x45591f => {
          _0x45591f['stopPropagation']();
          if (_0x25751b["isActiveFor"](this['nodeId'])) {
            return;
          }
          void this["_captureCurrentFrameFromActiveVideo"]();
        });
        this["previewEl"]["appendChild"](_0xf5309e);
        this["_controlsEl"] = _0xf5309e;
        this["_playBtnEl"] = _0x11caaf;
        this["_timeCurrentEl"] = _0x52e27a;
        this["_timeTotalEl"] = _0x11b0c8;
        this["_progressBarEl"] = _0x25d7ca;
        this["_progressFillEl"] = _0x561ea5;
        this["_snapBtnEl"] = _0x5901ff;
        this['_syncPreviewControlLocaleTexts']();
        this["_updatePlayIcon"](!![]);
      }
      _0x1c238e && setHoverPlaybackChromeVisible({
        'controlsEl': this['_controlsEl'],
        'muteEl': this["_muteBtnEl"]
      }, ![]);
      this["_setVideoOverlaysVisible"](_0x1c238e || !this['isNoResult']);
    }
    ["_setVideoOverlaysVisible"](_0x1662bc, _0x5528a6 = null) {
      const _0x5021d3 = typeof _0x2658e3['getStateRaw'] === 'function' ? _0x2658e3["getStateRaw"]() : _0x2658e3['getState']();
      const _0x3a88fb = _0x5021d3?.['nodes']?.[this['nodeId']] || this["_data"] || {};
      if (isSegmentRetakeEditing(_0x3a88fb)) {
        setHoverPlaybackChromeVisible({
          'controlsEl': this["_controlsEl"],
          'muteEl': this['_muteBtnEl']
        }, ![]);
        const _0x22271f = _0x5528a6 || this["_getActivePreviewVideoEl"]();
        const _0x5a8e69 = _0x22271f?.["paused"] !== ![] && !this["previewEl"]?.["classList"]?.["contains"]?.("is-segment-retake-annotating");
        this["_centerIndicatorEl"]?.["style"] && (this["_centerIndicatorEl"]['style']["display"] = _0x5a8e69 ? "flex" : 'none');
        if (_0x5a8e69) {
          this["_showPausedCenterIndicator"]?.();
        } else {
          this["_hideCenterIndicator"]?.();
        }
        return;
      }
      const _0x5ca53a = !!_0x3a88fb['isVideosExpanded'];
      const _0xd4ddb2 = !!_0x1662bc && !isTaskFailed(_0x3a88fb) && !_0x5ca53a && !!(this['_isHovered'] || this['_isManualControl'] || this["_isManualLoopPlayback"] || this["_isProgressSeeking"] || this["_isProgressDragging"]) && !_0x25751b["isActiveFor"](this["nodeId"]);
      setHoverPlaybackChromeVisible({
        'controlsEl': this["_controlsEl"],
        'muteEl': this["_muteBtnEl"]
      }, _0xd4ddb2);
      const _0xd1a51c = _0xd4ddb2 && !!(this["_isManualControl"] || this["_isManualLoopPlayback"]);
      this["_centerIndicatorEl"]?.["style"] && (this["_centerIndicatorEl"]["style"]["display"] = _0xd1a51c ? "flex" : 'none');
      if (!_0xd1a51c) {
        this['_hideCenterIndicator']?.();
      }
      _0xd4ddb2 && this["_syncVideoControlsFromVideo"](_0x5528a6 || this["_getActivePreviewVideoEl"]());
    }
    ['_syncMuteBtnIconImpl']() {
      if (!this['_muteIconMutedEl'] || !this["_muteIconUnmutedEl"]) {
        return;
      }
      this["_muteIconMutedEl"]["style"]["display"] = this['_isMuted'] ? '' : "none";
      this['_muteIconUnmutedEl']["style"]["display"] = this["_isMuted"] ? "none" : '';
    }
    ["_syncPreviewControlLocaleTexts"]() {
      if (this['_muteBtnEl']) {
        const _0x3fd3ac = previewControlsText("sourceVideoNode.controls.toggleMute");
        this["_muteBtnEl"]['dataset']["tooltip"] = _0x3fd3ac;
        this["_muteBtnEl"]["setAttribute"]?.("aria-label", _0x3fd3ac);
      }
      if (this["_snapBtnEl"]) {
        const _0x5a18eb = previewControlsText("sourceVideoNode.controls.captureFrame");
        this['_snapBtnEl']["dataset"]["tooltip"] = _0x5a18eb;
        this["_snapBtnEl"]["setAttribute"]?.("aria-label", _0x5a18eb);
      }
      this["_updatePlayIcon"](this["_getActivePreviewVideoEl"]()?.["paused"] !== ![]);
    }
    ["_setManualLoopPlayback"](_0x3b6ce8, _0x344841 = null) {
      const _0x183d13 = _0x3b6ce8 === !![];
      this["_isManualLoopPlayback"] = _0x183d13;
      if (_0x344841) {
        _0x344841["loop"] = _0x183d13;
      }
    }
    ["_syncMutedStateFromNodeData"](_0x585a10 = this["_data"]) {
      this["_isMuted"] = resolveVideoMutedPreference(_0x585a10, {
        'videoAudioDefaultEnabled': readVideoAudioDefaultEnabledFromStore(_0x2658e3)
      });
      this["_applyMuteStateToPreviewVideos"]();
      this["_syncMuteBtnIcon"]();
    }
    ['_setPreviewMuted'](_0x5ed7c8, {
      persist = ![]
    } = {}) {
      this["_isMuted"] = !!_0x5ed7c8;
      if (!persist) {
        return;
      }
      const _0x9625e0 = _0x2658e3['getState']()["nodes"]?.[this['nodeId']] || this['_data'] || {};
      const _0x205fa = buildVideoMutedPatch(_0x9625e0, this["_isMuted"]);
      if (!_0x205fa || typeof _0x2658e3["updateNodeData"] !== 'function') {
        return;
      }
      _0x2658e3["updateNodeData"](this["nodeId"], _0x205fa);
      this["_data"] = {
        ..._0x9625e0,
        ..._0x205fa
      };
    }
    ["_applyMuteStateToPreviewVideos"]() {
      if (!this['previewEl']) {
        return;
      }
      const _0x116f41 = this["_data"] && Number["isFinite"](Number(this['_data']['mainVideoIndex'])) ? Number(this['_data']["mainVideoIndex"]) : Number["isFinite"](Number(this["_lastMainIdx"])) ? Number(this['_lastMainIdx']) : 0x0;
      const _0xcb6598 = Math["max"](0x0, Math['trunc'](_0x116f41));
      const _0x2f6bee = Array["isArray"](this["_multiLayerEls"]) && this["_multiLayerEls"]["length"] > 0x0;
      if (_0x2f6bee) {
        for (let _0x4f3cb9 = 0x0; _0x4f3cb9 < this["_multiLayerEls"]["length"]; _0x4f3cb9++) {
          const _0x2cfda6 = this['_multiLayerEls'][_0x4f3cb9];
          if (!_0x2cfda6) {
            continue;
          }
          _0x2cfda6["muted"] = _0x4f3cb9 === _0xcb6598 ? !!this['_isMuted'] : !![];
        }
        this["_expandPanel"] && this['_expandPanel']["querySelectorAll"]("video")["forEach"](_0x54b342 => {
          _0x54b342["muted"] = !![];
        });
        return;
      }
      this["previewEl"]["querySelectorAll"]("video")['forEach'](_0x584a88 => {
        _0x584a88["muted"] = !!this["_isMuted"];
      });
    }
    ["_setCenterIndicatorIcon"](_0x588879) {
      if (!this["_centerIndicatorInnerEl"]) {
        return;
      }
      const _0x12bce9 = document['createElementNS']("http://www.w3.org/2000/svg", "svg");
      _0x12bce9["setAttribute"]("width", '28');
      _0x12bce9["setAttribute"]("height", '28');
      _0x12bce9["setAttribute"]("viewBox", "0 0 24 24");
      _0x12bce9["setAttribute"]("fill", "currentColor");
      _0x12bce9["style"]["color"] = 'var(--canvas-white)';
      _0x588879 === "play" ? _0x12bce9["innerHTML"] = "<polygon points=\"6 4 20 12 6 20 6 4\"></polygon>" : _0x12bce9["innerHTML"] = '<rect\x20x=\x226\x22\x20y=\x225\x22\x20width=\x224\x22\x20height=\x2214\x22\x20rx=\x221\x22></rect><rect\x20x=\x2214\x22\x20y=\x225\x22\x20width=\x224\x22\x20height=\x2214\x22\x20rx=\x221\x22></rect>';
      this['_centerIndicatorInnerEl']['innerHTML'] = '';
      this["_centerIndicatorInnerEl"]["appendChild"](_0x12bce9);
    }
    ["_showPausedCenterIndicator"]() {
      if (!this["_centerIndicatorInnerEl"]) {
        return;
      }
      this["_centerIndicatorTimer"] && (clearTimeout(this["_centerIndicatorTimer"]), this['_centerIndicatorTimer'] = null);
      this["_setCenterIndicatorIcon"]('play');
      this["_centerIndicatorInnerEl"]["style"]["opacity"] = '1';
      this["_centerIndicatorInnerEl"]["style"]['transform'] = "scale(1)";
    }
    ["_hideCenterIndicator"]() {
      if (!this["_centerIndicatorInnerEl"]) {
        return;
      }
      this['_centerIndicatorTimer'] && (clearTimeout(this['_centerIndicatorTimer']), this["_centerIndicatorTimer"] = null);
      this['_centerIndicatorInnerEl']["style"]["opacity"] = '0';
      this['_centerIndicatorInnerEl']["style"]["transform"] = "scale(0.92)";
    }
    ["_flashCenterIndicator"](_0x110892) {
      if (!this["_centerIndicatorInnerEl"]) {
        return;
      }
      this['_centerIndicatorTimer'] && (clearTimeout(this["_centerIndicatorTimer"]), this["_centerIndicatorTimer"] = null);
      this["_setCenterIndicatorIcon"](_0x110892);
      this["_centerIndicatorInnerEl"]["style"]["opacity"] = '1';
      this["_centerIndicatorInnerEl"]["style"]['transform'] = "scale(1)";
      this["_centerIndicatorTimer"] = setTimeout(() => {
        if (!this['_centerIndicatorInnerEl']) {
          return;
        }
        if (_0x110892 === "pause") {
          this["_showPausedCenterIndicator"]();
        } else {
          this["_hideCenterIndicator"]();
        }
        this["_centerIndicatorTimer"] = null;
      }, 0x208);
    }
    ["_getActivePreviewVideoEl"]() {
      const _0x4acf5b = this["_data"] && Number['isFinite'](Number(this["_data"]["mainVideoIndex"])) ? Number(this["_data"]["mainVideoIndex"]) : Number['isFinite'](Number(this["_lastMainIdx"])) ? Number(this["_lastMainIdx"]) : 0x0;
      const _0x34acff = Math['max'](0x0, Math["trunc"](_0x4acf5b));
      if (Array["isArray"](this["_multiLayerEls"]) && this['_multiLayerEls']['length'] > 0x0) {
        return this["_multiLayerEls"][_0x34acff] || this["_multiLayerEls"][0x0] || this["videoEl"] || null;
      }
      return this['videoEl'] || null;
    }
    ["_toggleVideoPlayPause"](_0x1a4a53, _0x1ef877 = {}) {
      if (!_0x1a4a53) {
        return;
      }
      const _0x3c6c97 = _0x1ef877?.["loop"] === !![];
      const _0x1b3259 = shouldTakeOverActiveHoverPlayback(this, _0x1a4a53);
      const _0x17751d = _0x3c6c97;
      this["_isManualControl"] = !![];
      this["_hoverPlaybackLifecycle"]?.["activate"]?.();
      this["_setVideoOverlaysVisible"](!![], _0x1a4a53);
      this["_autoPlayToken"]++;
      const _0x198671 = !!String(_0x1a4a53["getAttribute"]('src') || '')["trim"]();
      if (_0x1a4a53["paused"] || _0x1b3259) {
        this['_hoverManualPause'] = ![];
        if (_0x1a4a53["ended"] === !![]) {
          try {
            _0x1a4a53["currentTime"] = 0x0;
          } catch {}
        }
        this["_setManualLoopPlayback"](_0x17751d, _0x1a4a53);
        const _0x35e6d3 = this['_autoPlayToken'];
        if (typeof this["_playPreviewVideoWithRecovery"] === "function") {
          void this['_playPreviewVideoWithRecovery'](_0x1a4a53, {
            'reason': "manual",
            'shouldContinue': () => this['_isManualControl'] === !![] && this["_hoverManualPause"] !== !![] && this["_autoPlayToken"] === _0x35e6d3
          })["then"](_0x29fced => {
            if (this["_autoPlayToken"] !== _0x35e6d3 || this['_hoverManualPause'] === !![]) {
              this['_setManualLoopPlayback'](![], _0x1a4a53);
              _0x1a4a53["pause"]?.();
              return;
            }
            if (!_0x29fced) {
              this["_setManualLoopPlayback"](![], _0x1a4a53);
              return;
            }
            this["_flashCenterIndicator"]("play");
            this["_syncVideoControlsFromVideo"](_0x1a4a53);
          });
          return;
        }
        if (!_0x198671) {
          this["_ensureVideoSrcFor"](_0x1a4a53)["then"](_0x273b07 => {
            if (!_0x273b07) {
              this['_setManualLoopPlayback'](![], _0x1a4a53);
              return;
            }
            const _0x2761b5 = _0x1a4a53["play"]();
            _0x2761b5 && typeof _0x2761b5['catch'] === "function" && _0x2761b5["catch"](() => {
              this["_setManualLoopPlayback"](![], _0x1a4a53);
            });
            this['_flashCenterIndicator']("play");
            this['_syncVideoControlsFromVideo'](_0x1a4a53);
          });
          return;
        }
        const _0x5993f3 = _0x1a4a53["play"]();
        _0x5993f3 && typeof _0x5993f3['catch'] === "function" && _0x5993f3["catch"](() => {
          this["_setManualLoopPlayback"](![], _0x1a4a53);
        });
        this["_flashCenterIndicator"]("play");
        this["_syncVideoControlsFromVideo"](_0x1a4a53);
      } else {
        this["_hoverManualPause"] = !![];
        this['_setManualLoopPlayback'](![], _0x1a4a53);
        _0x1a4a53["pause"]();
        this["_showPausedCenterIndicator"]();
        this["_syncVideoControlsFromVideo"](_0x1a4a53);
      }
    }
    ["_updatePlayIcon"](_0x3d1009) {
      if (!this["_playBtnEl"]) {
        return;
      }
      const _0x5d9e74 = _0x3d1009 ? "paused" : "playing";
      const _0x249ee7 = previewControlsText(_0x3d1009 ? "sourceVideoNode.controls.playLoopHint" : "sourceVideoNode.controls.pause");
      if (this["_playIconButtonEl"] === this["_playBtnEl"] && this['_playIconState'] === _0x5d9e74 && this["_playBtnEl"]["dataset"]?.["tooltip"] === _0x249ee7) {
        return;
      }
      this["_playIconButtonEl"] = this["_playBtnEl"];
      this['_playIconState'] = _0x5d9e74;
      if (this["_playBtnEl"]["dataset"]) {
        this["_playBtnEl"]["dataset"]['tooltip'] = _0x249ee7;
      } else {
        this["_playBtnEl"]["setAttribute"]?.('data-tooltip', _0x249ee7);
      }
      this["_playBtnEl"]["setAttribute"]?.("aria-label", _0x249ee7);
      this["_playBtnEl"]["replaceChildren"]();
      const _0x187663 = 'http://www.w3.org/2000/svg';
      const _0x5565d0 = document['createElementNS'](_0x187663, "svg");
      _0x5565d0['setAttribute']("width", '16');
      _0x5565d0["setAttribute"]("height", '16');
      _0x5565d0['setAttribute']('viewBox', "0 0 24 24");
      _0x5565d0["setAttribute"]("fill", "currentColor");
      if (_0x3d1009) {
        const _0x1f3deb = document["createElementNS"](_0x187663, "polygon");
        _0x1f3deb["setAttribute"]("points", "5 3 19 12 5 21 5 3");
        _0x5565d0["appendChild"](_0x1f3deb);
      } else {
        const _0x198ac5 = document['createElementNS'](_0x187663, 'rect');
        _0x198ac5["setAttribute"]('x', '6');
        _0x198ac5["setAttribute"]('y', '4');
        _0x198ac5['setAttribute']("width", '4');
        _0x198ac5['setAttribute']("height", '16');
        const _0x3dd102 = document["createElementNS"](_0x187663, 'rect');
        _0x3dd102["setAttribute"]('x', '14');
        _0x3dd102["setAttribute"]('y', '4');
        _0x3dd102["setAttribute"]("width", '4');
        _0x3dd102["setAttribute"]("height", '16');
        _0x5565d0["appendChild"](_0x198ac5);
        _0x5565d0["appendChild"](_0x3dd102);
      }
      this["_playBtnEl"]["appendChild"](_0x5565d0);
    }
    ['_fmtVideoTime'](_0x4295da) {
      const _0x5a1d95 = Number(_0x4295da);
      if (!Number["isFinite"](_0x5a1d95) || _0x5a1d95 <= 0x0) {
        return "0:00";
      }
      return Math["floor"](_0x5a1d95 / 0x3c) + ':' + String(Math['floor'](_0x5a1d95 % 0x3c))["padStart"](0x2, '0');
    }
    ["_getActiveVideoDuration"](_0x359df9) {
      if (_0x359df9) {
        const _0x7f849 = Number(_0x359df9["duration"]);
        if (Number['isFinite'](_0x7f849) && _0x7f849 > 0x0) {
          return _0x7f849;
        }
        const _0x169e7d = _0x359df9["seekable"];
        if (_0x169e7d && _0x169e7d["length"]) {
          const _0x5761f6 = Number(_0x169e7d['end'](_0x169e7d["length"] - 0x1));
          if (Number["isFinite"](_0x5761f6) && _0x5761f6 > 0x0) {
            return _0x5761f6;
          }
        }
      }
      const _0x56b33f = Number(this["_data"]?.["videoDuration"]);
      if (Number["isFinite"](_0x56b33f) && _0x56b33f > 0x0) {
        return _0x56b33f;
      }
      return 0x0;
    }
    ["_requestVideoProgressFrame"](_0x37edbe) {
      const _0x3018b4 = globalThis["window"]?.["requestAnimationFrame"] || globalThis["requestAnimationFrame"];
      if (typeof _0x3018b4 === 'function') {
        return _0x3018b4['call'](globalThis["window"] || globalThis, _0x37edbe);
      }
      return setTimeout(_0x37edbe, 0x10);
    }
    ['_cancelVideoProgressFrame'](_0x37001e) {
      const _0x322fc4 = globalThis["window"]?.["cancelAnimationFrame"] || globalThis["cancelAnimationFrame"];
      if (typeof _0x322fc4 === "function") {
        _0x322fc4["call"](globalThis["window"] || globalThis, _0x37001e);
        return;
      }
      clearTimeout(_0x37001e);
    }
    ["_cancelVideoProgressLoop"]() {
      this["_progressRaf"] && this["_cancelVideoProgressFrame"](this['_progressRaf']);
      this["_progressRaf"] = 0x0;
      this["_progressRafVideoEl"] = null;
    }
    ["_startVideoProgressLoop"](_0xd30ece) {
      const _0x5d3088 = _0xd30ece || this["_getActivePreviewVideoEl"]();
      if (!_0x5d3088 || _0x5d3088["paused"] || _0x5d3088['ended']) {
        this['_cancelVideoProgressLoop']();
        return;
      }
      if (this["_progressRaf"] && this['_progressRafVideoEl'] === _0x5d3088) {
        return;
      }
      this["_cancelVideoProgressLoop"]();
      this["_progressRafVideoEl"] = _0x5d3088;
      const _0x14c620 = () => {
        const _0x33e7b0 = this["_getActivePreviewVideoEl"]();
        if (!_0x33e7b0 || _0x33e7b0 !== this["_progressRafVideoEl"] || _0x33e7b0["paused"] || _0x33e7b0['ended']) {
          this["_progressRaf"] = 0x0;
          this["_progressRafVideoEl"] = null;
          this["_syncVideoControlsFromVideo"](_0x33e7b0 || null);
          return;
        }
        this['_syncVideoControlsFromVideo'](_0x33e7b0);
        this["_progressRaf"] = this["_requestVideoProgressFrame"](_0x14c620);
      };
      this["_progressRaf"] = this["_requestVideoProgressFrame"](_0x14c620);
    }
    ['_syncVideoControlsFromVideo'](_0x5ed50b) {
      const _0x2397fd = typeof _0x2658e3['getStateRaw'] === "function" ? _0x2658e3["getStateRaw"]() : _0x2658e3["getState"]();
      const _0x10d354 = _0x2397fd?.["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      if (isSegmentRetakeEditing(_0x10d354)) {
        const _0x2ebad9 = _0x5ed50b || this["_getActivePreviewVideoEl"]();
        this["_setVideoOverlaysVisible"](!![], _0x2ebad9);
        return;
      }
      if (!this["_controlsEl"] || !this["_playBtnEl"] || !this["_progressFillEl"]) {
        return;
      }
      const _0x4451da = _0x5ed50b || this["_getActivePreviewVideoEl"]();
      if (!_0x4451da) {
        this["_cancelVideoProgressLoop"]();
        this["_updatePlayIcon"](!![]);
        this["_progressFillEl"]["style"]["width"] = '0%';
        if (this["_timeCurrentEl"]) {
          this["_timeCurrentEl"]['textContent'] = "0:00";
        }
        if (this["_timeTotalEl"]) {
          this["_timeTotalEl"]["textContent"] = "0:00";
        }
        return;
      }
      const _0x507e6b = this["_getActiveVideoDuration"](_0x4451da);
      const _0x4a34c8 = Math["max"](0x0, Number(_0x4451da["currentTime"]) || 0x0);
      const _0x1e07ec = _0x507e6b > 0x0 ? Math["max"](0x0, Math["min"](0x1, _0x4a34c8 / _0x507e6b)) : 0x0;
      if (!this['_isProgressDragging'] && !this['_isProgressSeeking']) {
        this["_progressFillEl"]["style"]["width"] = _0x1e07ec * 0x64 + '%';
        if (this["_timeCurrentEl"]) {
          const _0x21155c = this["_fmtVideoTime"](_0x4a34c8);
          this["_timeCurrentEl"]["textContent"] !== _0x21155c && (this["_timeCurrentEl"]['textContent'] = _0x21155c);
        }
      }
      if (this["_timeTotalEl"]) {
        const _0x464769 = this["_fmtVideoTime"](_0x507e6b);
        this['_timeTotalEl']["textContent"] !== _0x464769 && (this["_timeTotalEl"]["textContent"] = _0x464769);
      }
      this["_updatePlayIcon"](!!_0x4451da["paused"]);
      _0x4451da["paused"] || _0x4451da['ended'] ? (this["_showPausedCenterIndicator"](), this["_cancelVideoProgressLoop"]()) : (this["_hideCenterIndicator"](), this['_startVideoProgressLoop'](_0x4451da));
    }
    ["_seekActiveVideoByPos"](_0x41fc32, _0x41cdb9) {
      const _0x2517d4 = _0x41fc32 || this["_getActivePreviewVideoEl"]();
      if (!_0x2517d4) {
        return;
      }
      const _0x2529fa = this["_getActiveVideoDuration"](_0x2517d4);
      if (!Number['isFinite'](_0x2529fa) || _0x2529fa <= 0x0) {
        return;
      }
      const _0x37fdf5 = Math["max"](0x0, Math["min"](0x1, Number(_0x41cdb9) || 0x0));
      const _0x3f9dad = _0x37fdf5 * _0x2529fa;
      this['_isProgressSeeking'] = !![];
      const _0x5d74fc = ++this["_progressSeekToken"];
      _0x2517d4["currentTime"] = _0x3f9dad;
      if (this["_progressFillEl"]) {
        this["_progressFillEl"]["style"]["width"] = _0x37fdf5 * 0x64 + '%';
      }
      if (this["_timeCurrentEl"]) {
        this["_timeCurrentEl"]['textContent'] = this['_fmtVideoTime'](_0x3f9dad);
      }
      queueMicrotask(() => {
        if (_0x5d74fc !== this["_progressSeekToken"]) {
          return;
        }
        this["_isProgressSeeking"] = ![];
        this["_syncVideoControlsFromVideo"](_0x2517d4);
      });
    }
    ["_disposeVideoProgressInteraction"]() {
      this["_progressDragSession"]?.["dispose"]?.();
      this["_progressDragSession"] = null;
      this['_isProgressDragging'] = ![];
      this["_isProgressSeeking"] = ![];
      this["_progressSeekToken"] = Number(this["_progressSeekToken"] || 0x0) + 0x1;
    }
    async ['_captureCurrentFrameFromActiveVideo']() {
      const _0x269686 = this["_getActivePreviewVideoEl"]();
      if (!_0x269686) {
        return;
      }
      if (!getVideoFrameSource(_0x269686)) {
        const _0x197821 = await this["_ensureVideoSrcFor"](_0x269686);
        if (!_0x197821) {
          window['showToast']?.(previewControlsText('videoFrameExtraction.videoNotLoaded'), 'info');
          return;
        }
      }
      if (!isVideoFrameReady(_0x269686)) {
        const _0x2ab27d = await waitForVideoFrame(_0x269686);
        if (!_0x2ab27d) {
          window["showToast"]?.(previewControlsText("videoFrameExtraction.videoNotLoaded"), "info");
          return;
        }
      }
      const _0x255874 = _0x269686["videoWidth"] || 0x0;
      const _0x1f23dc = _0x269686['videoHeight'] || 0x0;
      if (!_0x255874 || !_0x1f23dc) {
        return;
      }
      let _0x3c8a86 = null;
      try {
        _0x3c8a86 = await captureVideoFrameSnapshot(_0x269686, {
          'fileNamePrefix': "ai_video_frame"
        });
      } catch (_0x1f4122) {
        console['warn']("[AIGenVideoNode] capture frame failed:", _0x1f4122);
        window["showToast"]?.(previewControlsText("videoFrameExtraction.captureUnsupported"), 'error');
        return;
      }
      if (!_0x3c8a86?.['blob']) {
        return;
      }
      const _0x3f16ec = _0x2658e3["getState"]()["nodes"][this["nodeId"]];
      if (!_0x3f16ec) {
        return;
      }
      const _0x3f2932 = Array['isArray'](_0x3f16ec["videos"]) && _0x3f16ec["videos"][Math['max'](0x0, Number(_0x3f16ec["mainVideoIndex"]) || 0x0)] || (Array['isArray'](_0x3f16ec["videos"]) ? _0x3f16ec["videos"][0x0] : null) || _0x3f16ec;
      const _0x29abaa = typeof this['_resolveVideoMetaSrcFromVideoData'] === "function" ? this['_resolveVideoMetaSrcFromVideoData'](_0x3f2932) : '';
      const {
        frameIndex: _0x443332,
        nextSnapSeq: _0x52d157
      } = resolveVideoFrameCaptureIndex(_0x3f16ec, {
        'currentTimeSec': Number(_0x269686["currentTime"]) || 0x0,
        'fallbackDurationSec': this["_getActiveVideoDuration"](_0x269686),
        'fallbackFrameRate': DEFAULT_VIDEO_FRAME_CAPTURE_FPS
      });
      _0x52d157 && _0x2658e3["updateNodeData"](this["nodeId"], {
        'snapSeq': _0x52d157
      });
      _0x29abaa && typeof this['_maybeFetchVideoMeta'] === "function" && void this['_maybeFetchVideoMeta'](_0x29abaa);
      const _0x314a26 = _0x2abe6a(_0x255874, _0x1f23dc);
      const _0x326d80 = _0x41bb12(_0x2658e3["getState"]()['nodes'], _0x3f16ec, _0x314a26['width'], _0x314a26["height"]);
      const _0x5d8806 = "src-img-" + Date["now"]();
      const _0x16263b = previewControlsText("videoFrameExtraction.capturedFrameName", {
        'frameIndex': _0x443332
      });
      const _0x437792 = buildVideoFrameCaptureNodeName(_0x3f16ec, {
        'frameIndex': _0x443332,
        'fallbackName': _0x16263b,
        'formatSourceFrameName': _0x6e26c7 => previewControlsText("videoFrameExtraction.capturedFrameNameWithSource", _0x6e26c7)
      });
      const {
        savePromise: _0x489f0f
      } = startVideoFrameSnapshotPersistence(_0x3c8a86, _0x56c5ff, {
        'onPreview': ({
          previewUrl: _0x10c2dc
        }) => {
          _0x2658e3["addNode"](_0x4fee8a({
            'id': _0x5d8806,
            'type': 'source-image',
            'name': _0x437792,
            'capturePreviewUrl': _0x10c2dc,
            'captureSavePending': !![],
            'captureSaveError': null,
            'originalWidth': _0x3c8a86["originalWidth"],
            'originalHeight': _0x3c8a86["originalHeight"],
            'fileName': _0x3c8a86['fileName'],
            'x': _0x326d80['x'],
            'y': _0x326d80['y'],
            'width': _0x314a26["width"],
            'height': _0x314a26["height"],
            'needsAutoResize': ![]
          }));
        }
      });
      _0x489f0f['then'](_0x14ab96 => {
        if (!_0x2658e3["getStateRaw"]()['nodes']?.[_0x5d8806]) {
          return;
        }
        _0x2658e3["updateNodeData"](_0x5d8806, {
          'src': _0x14ab96["src"],
          'localPath': _0x14ab96['localPath'],
          'originalLocalPath': _0x14ab96["originalLocalPath"],
          'displayLocalPath': _0x14ab96['displayLocalPath'],
          'thumbLocalPath': _0x14ab96["thumbLocalPath"],
          'originalWidth': _0x14ab96["originalWidth"],
          'originalHeight': _0x14ab96["originalHeight"],
          'fileName': _0x14ab96["fileName"],
          'captureSavePending': ![],
          'captureSaveError': null
        });
      })["catch"](_0x1255b7 => {
        const _0x2900af = String(_0x1255b7?.["message"] || previewControlsText('videoFrameExtraction.localSaveFailed'));
        console["warn"]('[AIGenVideoNode]\x20save\x20captured\x20frame\x20failed:', _0x1255b7);
        _0x2658e3["getStateRaw"]()["nodes"]?.[_0x5d8806] && _0x2658e3['updateNodeData'](_0x5d8806, {
          'captureSavePending': ![],
          'captureSaveError': _0x2900af
        });
        window["showToast"]?.(previewControlsText("videoFrameExtraction.shownButSaveFailed"), "warning");
      });
    }
  }
  return _0x3f767e["prototype"];
}