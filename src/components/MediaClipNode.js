import a411_0x3bf9e9 from '../core/stores/appStore.js';
import { generateId } from '../core/math.js';
import { syncRendererNodePresentationZIndex } from '../core/rendererNodePresentation.js';
import { commit } from '../modules/history.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { getShortcuts, resolveShortcutActionForEvent } from '../modules/shortcuts.js';
import { getWaveformBarsPathFromPersistedUrl, getWaveformBarsPathFromUrl } from '../utils/audioWaveform.js';
import { MEDIA_CLIP_COMPACT_SIZE, MEDIA_CLIP_AUDIO_LANE_COUNT_MAX, MEDIA_CLIP_TIMELINE_ZOOM_MIN, buildMediaClipExportPayload, buildMediaClipIncomingSignature, getMediaClipInputKind, normalizeMediaClipAudioLaneIndex, normalizeMediaClipTimelineView, normalizeMediaClipState, patchMediaClipAudioLaneMuted, patchMediaClipAudioClipState, removeMediaClipAudioClip, removeMediaClipClip, resolveMediaClipSourceKey, splitMediaClipAudioAtTimelineSec, splitMediaClipAtTimelineSec } from './media-clip/mediaClipState.js';
import { buildMediaClipTimelineTicks, getMediaClipFrameCount, getMediaClipTimelineAddSlotLeftPx, getMediaClipTimelineContentWidthPx, getMediaClipTimelineDisplayDuration, getMediaClipTimelinePercent, getMediaClipTimelinePlayheadModel, getMediaClipTimelineRangeRect, getMediaClipTimelineSecFromClientX, getMediaClipTimelineTrackWidthPx } from './media-clip/mediaClipTimelineModel.js';
import { pausePreviewPlayback as a411_0x5cad16, playbackClockTimelineSec as a411_0x3ac7d9, playPreview as a411_0x480e85, playReplacementAudioFromVideo as a411_0x1639a1, preparePreviewMediaForPlayback as a411_0x16e08f, resetPlaybackClock as a411_0x195aaf, setPreviewPlayIcon as a411_0x51be5c, startPlaybackLoop as a411_0x44977f, syncReplacementAudioFromVideo as a411_0xe0c203, togglePreviewPlayback as a411_0x16c7a1, updatePreviewControls as a411_0x51e564 } from './media-clip/mediaClipPlaybackController.js';
import { disposeMediaElement, setMediaElementSource } from './media-clip/mediaClipMediaElement.js';
import { applyPreviewVideoLayout as a411_0x55c8b4, clearPreviewVideoFallback as a411_0x3662d9, ensurePreviewAudioElement as a411_0x507d25, ensurePreviewImageElement as a411_0x29e4a8, ensurePreviewVideoElement as a411_0x1782b5, getPreviewLayoutTokens as a411_0x3ea9, getPreviewVideoLayoutClasses as a411_0x281258, renderPreview as a411_0x1e34c1, renderPreviewControls as a411_0x540f14, renderPreviewPanel as a411_0xab38, renderVideoFallback as a411_0x463e6c, showPreviewImage as a411_0x49639d, showPreviewVideo as a411_0x3781bb, syncPreviewPanelLayout as a411_0x4752f7, syncPreviewVideoLayoutFromElement as a411_0x2d1590 } from './media-clip/mediaClipPreviewView.js';
import { renderMediaClipMaterialMenu } from './media-clip/mediaClipMaterialMenuView.js';
import { collectMediaClipFrameUrls, resolveMediaClipAudioUrl, resolveMediaClipImageUrl, resolveMediaClipLocalPath, resolveMediaClipThumbUrl, resolveMediaClipVideoUrl, resolveMediaClipWaveformUrl } from './media-clip/mediaClipSourceResolver.js';
import { firstNonEmpty, formatDurationLabel, formatTime, getTrackDuration, isSameMediaClipState, normalizeText, parsePercentValue, readLayoutWidthPx, stopPointer, toNumber } from './media-clip/mediaClipUtils.js';
import { MEDIA_CLIP_WAVEFORM_HEIGHT, MEDIA_CLIP_WAVEFORM_SAMPLES, MEDIA_CLIP_WAVEFORM_WIDTH, createConnectCursorIcon, createMediaClipSvgElement, fillFilmstripPlaceholder, formatWaveformPct, getMediaClipWaveformViewBox, getMediaClipWaveformViewport, iconButton, makeButton, setMediaClipSvgClass } from './media-clip/mediaClipViewUtils.js';
import { clearTimelineHoverState as a411_0x4d2a46, createTimelineInteractionState as a411_0xbb024e, getTimelineDrag as a411_0x233196, isTimelineDragSession as a411_0x3afa26, nextTimelineDragSessionId as a411_0x568dd1, setTimelineDrag as a411_0x3755c1, setTimelineHoverSegment as a411_0x28d294 } from './media-clip/mediaClipTimelineInteractionController.js';
import { applyMediaClipTimelineDragPreviewFromPointer, commitMediaClipTimelineEdit, detachMediaClipTimelineEditDrag, handleMediaClipTimelineDrag, handleMediaClipTimelineSegmentDrag, previewMediaClipTimelineMoveDrag, previewMediaClipTimelineTrimDrag, renderMediaClipTimelineTrimHandle, startMediaClipTimelineSegmentDrag } from './media-clip/mediaClipTimelineEditController.js';
import { bindTimelineScroll as a411_0x1fb37c, clampTimelineScrollLeft as a411_0x5b9f38, handleTimelineZoomWheel as a411_0x13bdf7, persistTimelineDragScroll as a411_0x3ce520, primeTimelineScroll as a411_0x5a84e5, runTimelineDragAutoScroll as a411_0x434e62, scheduleTimelineDragAutoScroll as a411_0x3790ef, shouldLockTimelineWheelScroll as a411_0x57b704, stopTimelineDragAutoScroll as a411_0xfefd86, syncTimelineScrollFade as a411_0x139b00, timelineDragAutoScrollVelocity as a411_0x142c2a, timelineDragDeltaPx as a411_0x1e0c0a, timelineDragScrollDeltaPx as a411_0x1e600c, timelineMaterialRangeSec as a411_0x1b2a96, timelineMaterialScrollBounds as a411_0x507ad1 } from './media-clip/mediaClipTimelineViewportController.js';
import { addImageOutputNodeFromSource as a411_0x3424d9, addOutputNode as a411_0x2a8f1d, exportAndUse as a411_0x44997b, exportAudioClips as a411_0xfb30f, exportLoadingTargetElement as a411_0x43191e, exportMaterialToCanvas as a411_0x4a14d0, exportVisualClips as a411_0x5246fd, exportVisualDurationSec as a411_0x494fe9, firstExportVideoSource as a411_0x484676, renderDownloadMenu as a411_0x35f76a, resolveOutputNodePosition as a411_0x3239b4, singleVisualClipExportTrack as a411_0x51c795, startExportLoading as a411_0x3cc9f1, stopExportLoading as a411_0x2ae9dd, waitForExportLoadingFrame as a411_0x39c0f8 } from './media-clip/mediaClipExportController.js';
const TIMELINE_VIEW_PERSIST_DELAY_MS = 0xb4;
const TIMELINE_SETTLE_ANIMATION_MS = 0x168;
const PREVIEW_SCRUB_SEEK_EPSILON_SEC = 0.04;
const TIMELINE_ZOOM_OUT_DISPLAY_MULTIPLIER = 0x4;
const MEDIA_CLIP_AUDIO_LANE_HEIGHT_PX = 0x1e;
const MEDIA_CLIP_AUDIO_LANE_GAP_PX = 0x6;
const MEDIA_CLIP_AUDIO_LANE_DRAG_THRESHOLD_PX = 0x12;
const MEDIA_CLIP_TIMELINE_AXIS_WIDTH_PX = 0x30;
const MEDIA_CLIP_DELETE_MATERIAL_EVENT = 'media-clip-delete-material';
const MEDIA_CLIP_EXPANDED_HOST_Z_INDEX = "12000";
let activeExpandedMediaClipNode = null;
function mediaClipText(_0x5551d9, _0x3cfc04 = {}) {
  return t('mediaClip.' + _0x5551d9, _0x3cfc04);
}
export { getMediaClipFrameCount, getMediaClipTimelineAddSlotLeftPx, getMediaClipTimelineContentWidthPx, getMediaClipTimelineDisplayDuration, shouldLockMediaClipTimelineWheelScroll } from './media-clip/mediaClipTimelineModel.js';
export class MediaClipNode {
  constructor(_0x4a9f7a) {
    this["nodeData"] = _0x4a9f7a || {};
    this['id'] = this['nodeData']['id'];
    this['el'] = document['createElement']("div");
    this['el']["className"] = "media-clip-node-shell";
    this["_sources"] = {
      'video': null,
      'videos': [],
      'audio': null,
      'audios': []
    };
    this["_mediaClip"] = normalizeMediaClipState(this['nodeData'], this["_sources"]);
    this['_timelineView'] = normalizeMediaClipTimelineView(this["_mediaClip"]["timelineView"]);
    this["_playheadSec"] = 0x0;
    this['_exporting'] = ![];
    this["_menuOpen"] = ![];
    this["_materialMenu"] = null;
    this["_materialMenuEl"] = null;
    this['_exportLoadingTarget'] = null;
    this["_unsubscribePick"] = null;
    this["_unsubscribeInputs"] = null;
    this["_unsubscribeLocale"] = null;
    this["_timelineInteractionState"] = this["_createTimelineInteractionState"]();
    this["_suppressTrackClick"] = ![];
    this["_activeClipIndex"] = 0x0;
    this["_selectedClipIndex"] = -0x1;
    this["_activeAudioClipIndex"] = 0x0;
    this["_selectedAudioClipIndex"] = -0x1;
    this["_timelineScrollLeft"] = this["_timelineView"]['scrollLeft'];
    this["_timelineViewPersistTimer"] = 0x0;
    this['_timelineViewPersistRender'] = ![];
    this["_timelineSettleTimer"] = 0x0;
    this['_timelineSettleRow'] = null;
    this['_timelineSettlePendingPersist'] = ![];
    this['_timelineSettlePendingCommit'] = ![];
    this["_timelineSettleVersion"] = 0x0;
    this["_timelineDragSessionSeq"] = 0x0;
    this["_timelineDragAutoScrollRaf"] = 0x0;
    this["_deferredTimelineDragNodeData"] = null;
    this['_skipNextStoreMediaClipRender'] = ![];
    this["_skipNextIncomingMediaClipRender"] = ![];
    this["_restoringTimelineScroll"] = null;
    this["_onDocumentPointerDown"] = null;
    this['_onMaterialMenuPointerDown'] = null;
    this["_onDocumentKeyDown"] = null;
    this["_onDeleteMaterialShortcut"] = null;
    this["_onShortcutsUpdated"] = null;
    this["_lastDeleteMaterialShortcutAt"] = Number['NEGATIVE_INFINITY'];
    this["_pendingPreviewSeek"] = {
      'video': null,
      'audio': null
    };
    this["_previewSeekRaf"] = {
      'video': 0x0,
      'audio': 0x0
    };
    this["_previewSeekState"] = {
      'video': this["_createPreviewSeekState"](),
      'audio': this["_createPreviewSeekState"]()
    };
    this["_playbackRaf"] = 0x0;
    this["_playing"] = ![];
    this["_playPreviewPending"] = null;
    this["_previewVisualKind"] = '';
    this["_playbackStartedAtMs"] = Number["NaN"];
    this['_playbackStartSec'] = 0x0;
    this["_imagePlaybackStartedAt"] = 0x0;
    this['_imagePlaybackStartSec'] = 0x0;
    this["_videoPreview"] = null;
    this["_imagePreview"] = null;
    this['_audioPreview'] = null;
    this['_previewPlayButton'] = null;
    this["_previewTimeLabel"] = null;
    this["_previewVideoSrc"] = '';
    this["_previewAudioSrc"] = '';
  }
  ["_createTimelineInteractionState"](_0x3d9000 = {}) {
    return a411_0xbb024e(_0x3d9000);
  }
  ['_timelineDrag']() {
    return a411_0x233196(this);
  }
  ["_compactLayoutSize"](_0x3c3cfb = this["_mediaClip"]) {
    return {
      'width': MEDIA_CLIP_COMPACT_SIZE["width"],
      'height': MEDIA_CLIP_COMPACT_SIZE["height"]
    };
  }
  ["_nextTimelineDragSessionId"]() {
    return a411_0x568dd1(this);
  }
  ["_isTimelineDragSession"](_0x433f20) {
    return a411_0x3afa26(this, _0x433f20);
  }
  ["_setTimelineDrag"](_0x1facae = null) {
    return a411_0x3755c1(this, _0x1facae);
  }
  ['_setTimelineHoverSegment'](_0xee4e05, _0x45834e, _0x59814b = '', _0x3adede = -0x1) {
    return a411_0x28d294(this, _0xee4e05, _0x45834e, _0x59814b, _0x3adede);
  }
  ["_clearTimelineHoverState"](_0x5b5a19 = this['el']) {
    return a411_0x4d2a46(this, _0x5b5a19);
  }
  ["mount"]() {
    this['el']['addEventListener']("pointerdown", _0x4fc4df => {
      (this["_mediaClip"]["expanded"] === !![] || _0x4fc4df["target"]["closest"]("button, video, audio, .media-clip-menu")) && _0x4fc4df["stopPropagation"]();
    });
    this["_unsubscribePick"] = a411_0x3bf9e9['subscribeSelector']?.(_0x48347c => ({
      'active': _0x48347c['pickConnectMode']?.["active"] === !![],
      'sourceNodeId': _0x48347c["pickConnectMode"]?.["sourceNodeId"] || ''
    }), () => this['_render']());
    this["_unsubscribeInputs"] = a411_0x3bf9e9['subscribeSelector']?.(_0x4d02c5 => buildMediaClipIncomingSignature(_0x4d02c5, this['id']), () => {
      const _0x198e34 = this['_skipNextIncomingMediaClipRender'] === !![];
      this["_skipNextIncomingMediaClipRender"] = ![];
      const _0x49ff91 = a411_0x3bf9e9['getState']()?.["nodes"]?.[this['id']] || this['nodeData'];
      this["nodeData"] = _0x49ff91;
      this["_syncFromStore"](_0x49ff91);
      if (_0x198e34) {
        return;
      }
      this['_render']();
    });
    this['_unsubscribeLocale'] = onLocaleChange(() => this["_render"]());
    this["_onShortcutsUpdated"] = () => this["_rerenderCompactOnly"]();
    window["addEventListener"]("shortcuts-updated", this["_onShortcutsUpdated"]);
    this['_syncFromStore'](this["nodeData"]);
    this['_render']();
    return this['el'];
  }
  ["unmount"]() {
    this["_unsubscribePick"]?.();
    this["_unsubscribeInputs"]?.();
    this["_unsubscribeLocale"]?.();
    this["_unsubscribePick"] = null;
    this["_unsubscribeInputs"] = null;
    this["_unsubscribeLocale"] = null;
    this["_onShortcutsUpdated"] && (window['removeEventListener']('shortcuts-updated', this["_onShortcutsUpdated"]), this["_onShortcutsUpdated"] = null);
    this["_detachDragListeners"]();
    this['_syncDocumentExitListener'](![]);
    this["_syncMaterialMenuDismissListener"](![]);
    this["_syncDocumentKeyListener"](![]);
    this["_syncDeleteMaterialShortcutListener"](![]);
    this["_removeMaterialMenuPortal"]();
    this['_stopExportLoading']();
    this['_releaseExpandedEditor']();
    this["_disposePreviewMedia"]();
    this["_timelineViewPersistTimer"] && (clearTimeout(this["_timelineViewPersistTimer"]), this["_timelineViewPersistTimer"] = 0x0);
    this["_timelineSettleTimer"] && (clearTimeout(this["_timelineSettleTimer"]), this["_timelineSettleTimer"] = 0x0, this['_timelineSettleRow']?.["classList"]["remove"]("is-settling"), this["_flushTimelineSettlePersist"]());
    this['_timelineSettleRow'] = null;
    this['_skipNextStoreMediaClipRender'] = ![];
    this["_skipNextIncomingMediaClipRender"] = ![];
    this["_timelineViewPersistRender"] = ![];
    this["_restoringTimelineScroll"] = null;
    this['_stopTimelineDragAutoScroll']();
  }
  ["update"](_0x2df28c) {
    const _0x444f30 = _0x2df28c || this["nodeData"];
    if (this["_timelineDrag"]()) {
      this['_deferredTimelineDragNodeData'] = _0x444f30;
      this["nodeData"] = {
        ...(_0x444f30 || {}),
        'mediaClip': this['_mediaClip']
      };
      return;
    }
    if (this["_skipNextStoreMediaClipRender"] && isSameMediaClipState(_0x444f30?.["mediaClip"], this["_mediaClip"])) {
      this["_skipNextStoreMediaClipRender"] = ![];
      this["nodeData"] = _0x444f30;
      return;
    }
    if ((this["_timelineSettleTimer"] || this["_timelineSettleRow"]) && isSameMediaClipState(_0x444f30?.['mediaClip'], this["_mediaClip"])) {
      this['_skipNextStoreMediaClipRender'] = ![];
      this["nodeData"] = _0x444f30;
      return;
    }
    if (this['_isTimelinePresentationOnlyUpdate'](_0x444f30)) {
      this['_skipNextStoreMediaClipRender'] = ![];
      this["nodeData"] = {
        ...(_0x444f30 || {}),
        'mediaClip': this["_mediaClip"]
      };
      return;
    }
    this["_skipNextStoreMediaClipRender"] = ![];
    this["nodeData"] = _0x444f30;
    this["_syncFromStore"](this["nodeData"]);
    this["_render"]();
  }
  ["_isTimelinePresentationOnlyUpdate"](_0x4d55e9 = {}) {
    if (!_0x4d55e9 || !Object['prototype']["hasOwnProperty"]['call'](_0x4d55e9, "mediaClip")) {
      return ![];
    }
    if (!isSameMediaClipState(_0x4d55e9["mediaClip"], this['_mediaClip'])) {
      return ![];
    }
    const _0x4019a7 = this['nodeData'] || {};
    const _0xf64b55 = toNumber(_0x4019a7["width"], MEDIA_CLIP_COMPACT_SIZE["width"]);
    const _0x23568b = toNumber(_0x4019a7["height"], MEDIA_CLIP_COMPACT_SIZE["height"]);
    const _0x53997e = toNumber(_0x4d55e9['width'], _0xf64b55);
    const _0xb8c309 = toNumber(_0x4d55e9['height'], _0x23568b);
    return Math["abs"](_0x53997e - _0xf64b55) <= 0.01 && Math["abs"](_0xb8c309 - _0x23568b) <= 0.01;
  }
  ["_syncFromStore"](_0x84e6ac) {
    const _0x4120d5 = a411_0x3bf9e9['getState']();
    const _0x42fd16 = Object["values"](_0x4120d5["edges"] || {})['filter'](_0x34b903 => _0x34b903?.["targetId"] === this['id'])["sort"]((_0x2436eb, _0x35831b) => {
      const _0x53c8dc = toNumber(_0x2436eb?.["createdAt"], 0x0);
      const _0x3ca528 = toNumber(_0x35831b?.['createdAt'], 0x0);
      if (_0x53c8dc !== _0x3ca528) {
        return _0x53c8dc - _0x3ca528;
      }
      return normalizeText(_0x2436eb?.['id'])['localeCompare'](normalizeText(_0x35831b?.['id']));
    })["map"](_0x218765 => {
      const _0x3555c4 = _0x4120d5["nodes"]?.[_0x218765["sourceId"]];
      return _0x3555c4 ? {
        ..._0x3555c4,
        '__mediaClipEdgeId': normalizeText(_0x218765?.['id'])
      } : null;
    })["filter"](Boolean);
    const _0x5a0b98 = _0x42fd16["filter"](_0x4a3e16 => {
      const _0x2cd2df = getMediaClipInputKind(_0x4a3e16);
      return _0x2cd2df === "video" || _0x2cd2df === "image";
    });
    const _0x5830ce = _0x42fd16["filter"](_0x1ad2dc => getMediaClipInputKind(_0x1ad2dc) === "audio");
    this['_sources'] = {
      'video': _0x5a0b98[0x0] || null,
      'videos': _0x5a0b98,
      'audio': _0x5830ce[0x0] || null,
      'audios': _0x5830ce
    };
    const _0x53abda = normalizeMediaClipState(_0x84e6ac, this["_sources"]);
    const _0x59e18d = this["_timelineViewPersistTimer"] ? normalizeMediaClipTimelineView(this["_timelineView"]) : normalizeMediaClipTimelineView(_0x53abda["timelineView"]);
    const _0xef796c = {
      ..._0x53abda,
      'timelineView': _0x59e18d
    };
    this["_timelineView"] = _0x59e18d;
    this["_timelineScrollLeft"] = _0x59e18d["scrollLeft"];
    this["_mediaClip"] = _0xef796c;
    this['_activeClipIndex'] = this["_clampVideoClipIndex"](this["_activeClipIndex"]);
    this['_selectedClipIndex'] = this['_clampSelectedClipIndex'](this['_selectedClipIndex']);
    this["_activeAudioClipIndex"] = this["_clampAudioClipIndex"](this["_activeAudioClipIndex"]);
    this["_selectedAudioClipIndex"] = this["_clampSelectedAudioClipIndex"](this['_selectedAudioClipIndex']);
    const _0x5e79d7 = !!(_0xef796c["tracks"]?.["video"] || _0xef796c["tracks"]?.["audio"]);
    const _0x4d4c71 = this["_compactLayoutSize"](_0xef796c);
    const _0x29fdc9 = {};
    _0x5e79d7 && toNumber(_0x84e6ac?.['width'], _0x4d4c71["width"]) !== _0x4d4c71["width"] && (_0x29fdc9['width'] = _0x4d4c71["width"]);
    _0x5e79d7 && toNumber(_0x84e6ac?.['height'], _0x4d4c71["height"]) !== _0x4d4c71['height'] && (_0x29fdc9["height"] = _0x4d4c71["height"]);
    const _0x49ff28 = {
      ..._0x29fdc9
    };
    !isSameMediaClipState(_0x84e6ac?.['mediaClip'], _0xef796c) && (_0x49ff28["mediaClip"] = _0xef796c);
    if (Object["keys"](_0x49ff28)["length"]) {
      a411_0x3bf9e9["updateNodeData"](this['id'], _0x49ff28);
    }
    this["nodeData"] = {
      ...(_0x84e6ac || {}),
      ..._0x29fdc9,
      'mediaClip': _0xef796c
    };
    const _0x32044e = _0xef796c["tracks"]?.[_0xef796c["activeTrack"]] || _0xef796c["tracks"]?.["video"] || _0xef796c["tracks"]?.["audio"];
    _0x32044e && this["_playheadSec"] <= 0x0 && (this["_playheadSec"] = _0xef796c['activeTrack'] === "video" ? this["_videoTimelineStart"](_0x32044e, _0xef796c["clips"]) : _0x32044e["startSec"]);
  }
  ["_isPicking"]() {
    const _0x859171 = a411_0x3bf9e9["getState"]()?.["pickConnectMode"] || {};
    return _0x859171["active"] === !![] && _0x859171["sourceNodeId"] === this['id'];
  }
  ["_normalizeMediaClipWithTimelineView"](_0x1c52c9 = {}) {
    const _0x362339 = normalizeMediaClipTimelineView(_0x1c52c9['timelineView'] || this['_timelineView']);
    this["_timelineView"] = _0x362339;
    this['_timelineScrollLeft'] = _0x362339["scrollLeft"];
    return {
      ..._0x1c52c9,
      'timelineView': _0x362339
    };
  }
  ["_updateTimelineView"](_0x42940e = {}, _0x12c1c5 = {}) {
    const _0x1574b3 = normalizeMediaClipTimelineView({
      ...this['_timelineView'],
      ..._0x42940e
    });
    this["_timelineView"] = _0x1574b3;
    this["_timelineScrollLeft"] = _0x1574b3["scrollLeft"];
    this["_mediaClip"] = {
      ...this["_mediaClip"],
      'timelineView': _0x1574b3
    };
    this["nodeData"] = {
      ...(this["nodeData"] || {}),
      'mediaClip': this['_mediaClip']
    };
    _0x12c1c5["persist"] === !![] && this["_scheduleTimelineViewPersist"]({
      'render': _0x12c1c5['renderOnPersist'] !== ![]
    });
    return _0x1574b3;
  }
  ["_persistTimelineView"](_0x470594 = {}) {
    const _0x1e8043 = normalizeMediaClipTimelineView(this["_timelineView"]);
    const _0x1dd18c = {
      ...this["_mediaClip"],
      'timelineView': _0x1e8043
    };
    this['_timelineView'] = _0x1e8043;
    this["_timelineScrollLeft"] = _0x1e8043["scrollLeft"];
    this["_mediaClip"] = _0x1dd18c;
    this["nodeData"] = {
      ...(this['nodeData'] || {}),
      'mediaClip': _0x1dd18c
    };
    if (_0x470594["render"] === ![]) {
      this["_skipNextStoreMediaClipRender"] = !![];
    }
    a411_0x3bf9e9['updateNodeData'](this['id'], {
      'mediaClip': _0x1dd18c
    });
    if (_0x470594["render"] !== ![]) {
      this["_render"]();
    }
  }
  ["_flushTimelineViewPersist"](_0x54a2a4 = {}) {
    if (!this['_timelineViewPersistTimer']) {
      return ![];
    }
    clearTimeout(this["_timelineViewPersistTimer"]);
    this["_timelineViewPersistTimer"] = 0x0;
    const _0xc34ebf = _0x54a2a4["render"] === ![] ? ![] : _0x54a2a4["render"] === !![] || this["_timelineViewPersistRender"];
    this["_timelineViewPersistRender"] = ![];
    this["_persistTimelineView"]({
      'render': _0xc34ebf
    });
    return !![];
  }
  ['_scheduleTimelineViewPersist'](_0x387b12 = {}) {
    if (this["_timelineViewPersistTimer"]) {
      clearTimeout(this["_timelineViewPersistTimer"]);
    }
    this["_timelineViewPersistRender"] = this["_timelineViewPersistRender"] || _0x387b12["render"] !== ![];
    this["_timelineViewPersistTimer"] = setTimeout(() => {
      const _0xa30c39 = this["_timelineViewPersistRender"];
      this["_timelineViewPersistTimer"] = 0x0;
      this["_timelineViewPersistRender"] = ![];
      this["_persistTimelineView"]({
        'render': _0xa30c39
      });
    }, TIMELINE_VIEW_PERSIST_DELAY_MS);
  }
  ["_setMediaClip"](_0x5d1c01, _0x48705e = ![], _0x638254 = {}) {
    const _0x410f97 = this["_normalizeMediaClipWithTimelineView"](_0x5d1c01);
    this["_mediaClip"] = _0x410f97;
    this["nodeData"] = {
      ...(this['nodeData'] || {}),
      'mediaClip': _0x410f97
    };
    if (_0x638254["render"] === ![]) {
      this["_skipNextStoreMediaClipRender"] = !![];
    }
    a411_0x3bf9e9["updateNodeData"](this['id'], {
      'mediaClip': _0x410f97
    });
    if (_0x48705e) {
      commit();
    }
    if (_0x638254["render"] !== ![]) {
      this["_render"]();
    }
  }
  ["_claimExpandedEditor"]() {
    activeExpandedMediaClipNode && activeExpandedMediaClipNode !== this && activeExpandedMediaClipNode["_collapseFromPeer"]();
    activeExpandedMediaClipNode = this;
  }
  ["_releaseExpandedEditor"]() {
    activeExpandedMediaClipNode === this && (activeExpandedMediaClipNode = null);
  }
  ["_collapseFromPeer"]() {
    if (this["_mediaClip"]["expanded"] !== !![]) {
      return;
    }
    this["_setMediaClipWithLayout"]({
      ...this["_mediaClip"],
      'expanded': ![]
    }, ![], {
      'claimExpanded': ![]
    });
  }
  ['_prepareTimelineForCollapse']() {
    this["_stopTimelineDragAutoScroll"]();
    this["_cancelTimelineSettle"]();
    this['_flushTimelineViewPersist']({
      'render': ![]
    });
    this["_deferredTimelineDragNodeData"] = null;
  }
  ["_setMediaClipWithLayout"](_0x16da98, _0x2a72e1 = ![], _0x42ab07 = {}) {
    if (_0x16da98["expanded"] === !![] && _0x42ab07["claimExpanded"] !== ![]) {
      this["_claimExpandedEditor"]();
    } else {
      _0x16da98["expanded"] !== !![] && (this["_prepareTimelineForCollapse"](), this["_releaseExpandedEditor"](), this['_disposePreviewMedia']());
    }
    const _0x5c47f1 = this["nodeData"] || {};
    const _0x4eae14 = this['_normalizeMediaClipWithTimelineView'](_0x16da98);
    const _0x5d2d6f = this["_compactLayoutSize"](_0x4eae14);
    const _0x2cd3bc = {
      'width': _0x5d2d6f["width"],
      'height': _0x5d2d6f["height"],
      'mediaClip': _0x4eae14
    };
    this["_mediaClip"] = _0x2cd3bc["mediaClip"];
    this["nodeData"] = {
      ..._0x5c47f1,
      ..._0x2cd3bc
    };
    if (_0x42ab07["render"] === ![]) {
      this['_skipNextStoreMediaClipRender'] = !![];
    }
    a411_0x3bf9e9["updateNodeData"](this['id'], _0x2cd3bc);
    if (_0x2a72e1) {
      commit();
    }
    if (_0x42ab07["render"] !== ![]) {
      this["_render"]();
    }
  }
  ["_setActiveTrack"](_0x4a7625, _0x117139 = null, _0x17dcda = {}) {
    const _0x2706ba = this["_mediaClip"]["tracks"]?.[_0x4a7625];
    if (!_0x2706ba) {
      return;
    }
    this["_pausePreviewPlayback"]({
      'updateControls': ![]
    });
    const _0x19558d = {
      ...this["_mediaClip"],
      'activeTrack': _0x4a7625
    };
    this['_playheadSec'] = _0x117139 == null ? this["_playheadSec"] : _0x117139;
    const _0x18cf6a = this["_mediaClip"]["activeTrack"] !== _0x4a7625;
    this["_mediaClip"] = _0x19558d;
    this['nodeData'] = {
      ...(this["nodeData"] || {}),
      'mediaClip': _0x19558d
    };
    _0x18cf6a && a411_0x3bf9e9["updateNodeData"](this['id'], {
      'mediaClip': _0x19558d
    });
    _0x18cf6a || _0x17dcda["forceRender"] === !![] ? this["_render"]() : this["_updateTrackVisuals"](_0x4a7625, {
      'syncTimelineWidth': ![]
    });
    if (_0x4a7625 === "video") {
      this["_syncVideoPreviewSourceForTimelineSec"](this["_playheadSec"]);
    } else {
      _0x4a7625 === "audio" && (this["_setActiveAudioClipIndex"](this['_audioClipIndexAtTimelineSec'](this["_playheadSec"])), this["_syncAudioPreviewSourceForTimelineSec"](this['_playheadSec']));
    }
    this["_syncPreviewTime"](_0x4a7625, this["_previewSourceSecForTimelineSec"](_0x4a7625, this["_playheadSec"]));
  }
  ["_togglePickConnect"](_0x28bb97) {
    stopPointer(_0x28bb97);
    const _0x8427db = this["_isPicking"]();
    if (_0x8427db) {
      a411_0x3bf9e9["setPickConnectMode"]({
        'active': ![]
      });
      return;
    }
    a411_0x3bf9e9["setPickConnectMode"]({
      'active': !![],
      'sourceNodeId': this['id'],
      'handleDirection': "left"
    });
  }
  ["_setExpanded"](_0x48d698, _0x194819 = {}) {
    const _0x457f09 = {
      ...this["_mediaClip"],
      ..._0x194819,
      'expanded': _0x48d698 === !![]
    };
    this['_setMediaClipWithLayout'](_0x457f09, !![]);
  }
  ["_splitActiveMaterial"](_0xd5cb29 = this["_getPlaybackKind"]()) {
    const _0x3dea7c = _0xd5cb29 === 'audio' ? "audio" : "video";
    const _0x371caa = this['_mediaClip']["tracks"]?.[_0x3dea7c];
    if (!_0x371caa) {
      return;
    }
    const _0x89f416 = this["_playheadSec"];
    const _0x2de7ee = _0x3dea7c === "audio" ? splitMediaClipAudioAtTimelineSec(this["_mediaClip"], _0x89f416, generateId("split")) : splitMediaClipAtTimelineSec(this["_mediaClip"], _0x89f416, generateId('split'));
    if (isSameMediaClipState(_0x2de7ee, this['_mediaClip'])) {
      window["showToast"]?.(mediaClipText('toasts.splitAtMiddle'));
      return;
    }
    if (_0x3dea7c === "audio") {
      const _0x305461 = this["_audioClipIndexAtTimelineSec"](_0x89f416 + 0.001, _0x2de7ee["audioClips"]);
      this['_activeAudioClipIndex'] = _0x305461;
      this["_selectedAudioClipIndex"] = _0x305461;
    } else {
      const _0xbfb114 = this["_clipIndexAtTimelineSec"](_0x89f416 + 0.001, _0x2de7ee['clips']);
      this["_activeClipIndex"] = _0xbfb114;
      this["_selectedClipIndex"] = _0xbfb114;
    }
    this["_pausePreviewPlayback"]({
      'updateControls': ![]
    });
    this["_setMediaClipWithLayout"]({
      ..._0x2de7ee,
      'activeTrack': _0x3dea7c,
      'expanded': !![]
    }, !![], {
      'render': ![]
    });
    this["_rerenderCompactOnly"]();
    _0x3dea7c === 'audio' ? (this["_syncAudioPreviewSourceForTimelineSec"](_0x89f416), this["_syncPreviewTime"]('audio', this['_audioSourceSecForPlayhead'](_0x89f416), {
      'immediate': !![]
    })) : (this["_syncVideoPreviewSourceForTimelineSec"](_0x89f416), this['_syncPreviewTime']("video", this["_videoSourceSecForPlayhead"](_0x89f416), {
      'immediate': !![]
    }));
    this['_updatePreviewControls']();
  }
  ["_splitActiveVideoClip"]() {
    this["_splitActiveMaterial"]("video");
  }
  ["_getPlaybackKind"]() {
    const _0x101802 = this["_mediaClip"]["activeTrack"];
    if (this["_mediaClip"]["tracks"]?.[_0x101802]) {
      return _0x101802;
    }
    if (this["_mediaClip"]["tracks"]?.["video"]) {
      return "video";
    }
    if (this["_mediaClip"]["tracks"]?.["audio"]) {
      return "audio";
    }
    return '';
  }
  ["_getPlaybackTrack"](_0x851eab = this["_getPlaybackKind"]()) {
    return _0x851eab ? this["_mediaClip"]["tracks"]?.[_0x851eab] || null : null;
  }
  ["_getVideoClipAtTimelineSec"](_0x1259fd = this["_playheadSec"], _0x2bcc04 = this["_videoTimelineClips"](this["_mediaClip"]["tracks"]?.["video"])) {
    const _0x19496b = Array["isArray"](_0x2bcc04) ? _0x2bcc04 : [];
    if (!_0x19496b["length"]) {
      return null;
    }
    return _0x19496b[this["_clipIndexAtTimelineSec"](_0x1259fd, _0x19496b)] || _0x19496b[0x0];
  }
  ["_videoTimelineStart"](_0x4080ee = this["_mediaClip"]["tracks"]?.["video"], _0x1d22de = this["_videoTimelineClips"](_0x4080ee)) {
    const _0x56361b = Array["isArray"](_0x1d22de) ? _0x1d22de : [];
    if (_0x56361b["length"]) {
      return _0x56361b["reduce"]((_0x414fd2, _0x301b87) => Math["min"](_0x414fd2, toNumber(_0x301b87["timelineStartSec"], 0x0)), Number["POSITIVE_INFINITY"]);
    }
    return toNumber(_0x4080ee?.["startSec"], 0x0);
  }
  ['_timelineDisplayEnd'](_0x4d2fc8 = this['_getPlaybackKind']()) {
    if (_0x4d2fc8 === "video") {
      return this["_videoTimelineBaseDuration"](this['_mediaClip']['tracks']?.["video"]);
    }
    const _0x4980c1 = this["_mediaClip"]["tracks"]?.[_0x4d2fc8];
    return toNumber(_0x4980c1?.['endSec'] || _0x4980c1?.["durationSec"], 0x0);
  }
  ["_getPlaybackMedia"](_0x78e3c4 = this["_getPlaybackKind"]()) {
    return _0x78e3c4 ? this["_getPreviewMedia"](_0x78e3c4) : null;
  }
  ["_isSecInsideTrack"](_0x4c1abb, _0x5513de) {
    if (!_0x4c1abb) {
      return ![];
    }
    const _0x296356 = toNumber(_0x5513de, -0x1);
    return _0x296356 >= toNumber(_0x4c1abb["startSec"], 0x0) && _0x296356 <= toNumber(_0x4c1abb['endSec'], 0x0);
  }
  ["_cancelPlaybackLoop"]() {
    const _0xbe0d32 = this['_playbackRaf'];
    if (!_0xbe0d32) {
      return;
    }
    try {
      if (typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(_0xbe0d32);
      }
    } catch {}
    try {
      clearTimeout(_0xbe0d32);
    } catch {}
    this["_playbackRaf"] = 0x0;
  }
  ['_pausePreviewPlayback'](_0x1bc6b3 = {}) {
    return a411_0x5cad16(this, _0x1bc6b3);
  }
  ["_resetPlaybackClock"](_0x7bfc4c = this["_playheadSec"]) {
    return a411_0x195aaf(this, _0x7bfc4c);
  }
  ['_playbackClockTimelineSec'](_0x175587 = this['_playheadSec']) {
    return a411_0x3ac7d9(this, _0x175587);
  }
  async ["_preparePreviewMediaForPlayback"](_0x58eff7, _0x10e24d = null) {
    return a411_0x16e08f(this, _0x58eff7, _0x10e24d);
  }
  ["_togglePreviewPlayback"](_0x4b70d6) {
    return a411_0x16c7a1(this, _0x4b70d6);
  }
  async ['_playPreview']() {
    return a411_0x480e85(this);
  }
  async ["_playReplacementAudioFromVideo"](_0x5a6878) {
    return a411_0x1639a1(this, _0x5a6878);
  }
  ["_syncReplacementAudioFromVideo"](_0x3c0a24, _0x473c3c = {}) {
    return a411_0xe0c203(this, _0x3c0a24, _0x473c3c);
  }
  ["_startPlaybackLoop"](_0x186a9f) {
    return a411_0x44977f(this, _0x186a9f);
  }
  ["_setPreviewPlayIcon"](_0x97dfbf = this["_previewPlayButton"]) {
    return a411_0x51be5c(this, _0x97dfbf);
  }
  ["_updatePreviewControls"]() {
    return a411_0x51e564(this);
  }
  ["_getPreviewMedia"](_0x3ebda0) {
    return _0x3ebda0 === "audio" ? this['_audioPreview'] : this["_videoPreview"];
  }
  ["_visualClipKind"](_0x2b5d1c = null, _0x28572e = null) {
    const _0x5df116 = normalizeText(_0x2b5d1c?.['kind']);
    if (_0x5df116 === 'image') {
      return 'image';
    }
    const _0x2d1f68 = getMediaClipInputKind(_0x28572e || {});
    return _0x2d1f68 === "image" ? "image" : "video";
  }
  ['_getVisualClipContextAtTimelineSec'](_0x55a585 = this["_playheadSec"], _0x49e9ea = null) {
    const _0x3089ea = Array["isArray"](_0x49e9ea) ? _0x49e9ea : this["_videoTimelineClips"](this['_mediaClip']["tracks"]?.["video"]);
    const _0x576504 = this["_clipIndexAtTimelineSec"](_0x55a585, _0x3089ea);
    const _0x8fd233 = _0x3089ea[_0x576504] || this['_getVideoClipAtTimelineSec'](_0x55a585, _0x3089ea);
    const _0x5d6a9c = _0x8fd233 ? this["_videoClipSource"](_0x8fd233, _0x576504) : this['_sources']["video"];
    const _0xbffe13 = this["_visualClipKind"](_0x8fd233, _0x5d6a9c);
    return {
      'clip': _0x8fd233,
      'index': _0x576504,
      'source': _0x5d6a9c,
      'clipKind': _0xbffe13
    };
  }
  ['_resolveVideoPreviewSeekTarget']() {
    const _0x2b8e1c = toNumber(this['_pendingPreviewSeek']?.["video"], Number['NaN']);
    if (Number["isFinite"](_0x2b8e1c)) {
      return Math['max'](0x0, _0x2b8e1c);
    }
    return this["_videoSourceSecForPlayhead"](this["_playheadSec"] || 0x0);
  }
  ['_getVideoPreviewContextAtTimelineSec'](_0x57fbf8 = this["_playheadSec"], _0xd9619c = null) {
    const _0x30cdaf = this['_getVisualClipContextAtTimelineSec'](_0x57fbf8, _0xd9619c);
    const {
      clip: _0xadc072,
      index: _0x2e5e79,
      source: _0x1f804e,
      clipKind: _0x3a7a6d
    } = _0x30cdaf;
    const _0x41245b = _0x3a7a6d === "image" ? resolveMediaClipImageUrl(_0x1f804e) : resolveMediaClipVideoUrl(_0x1f804e);
    return {
      'clip': _0xadc072,
      'index': _0x2e5e79,
      'clipKind': _0x3a7a6d,
      'source': _0x1f804e,
      'url': _0x41245b,
      'posterUrl': resolveMediaClipThumbUrl(_0x1f804e),
      'sourceSec': _0xadc072 ? this["_videoSourceSecForTimelineSec"](_0x57fbf8, _0xd9619c) : _0x57fbf8
    };
  }
  ['_syncVideoPreviewSourceForTimelineSec'](_0x570b99 = this["_playheadSec"], _0xee2038 = {}) {
    const _0x23a09b = this["_videoPreview"];
    const _0x4ebad3 = this["_getVideoPreviewContextAtTimelineSec"](_0x570b99, _0xee2038['clips']);
    if (!_0x4ebad3['url']) {
      return ![];
    }
    if (_0x4ebad3["clipKind"] === "image") {
      this["_showPreviewImage"](_0x4ebad3["source"], _0x4ebad3["url"]);
      return !![];
    }
    if (!_0x23a09b) {
      return ![];
    }
    this["_showPreviewVideo"](_0x4ebad3['source']);
    _0x23a09b['__mediaClipFallbackHost'] ??= _0x23a09b["parentElement"] || null;
    _0x23a09b["__mediaClipPosterUrl"] = _0x4ebad3["posterUrl"];
    if (_0x4ebad3["posterUrl"]) {
      _0x23a09b["poster"] = _0x4ebad3["posterUrl"];
    } else {
      _0x23a09b["removeAttribute"]?.("poster");
    }
    this["_applyPreviewVideoLayout"](_0x23a09b["parentElement"], _0x4ebad3["source"]);
    const _0xfc554e = this["_normalizePreviewSourceIdentity"](firstNonEmpty(_0x23a09b["dataset"]?.["desktopMediaSourceUrl"], _0x23a09b["dataset"]?.['mediaClipSourceUrl'], _0x23a09b["getAttribute"]?.("src"), _0x23a09b["currentSrc"], _0x23a09b["src"]));
    const _0x3eb877 = this['_normalizePreviewSourceIdentity'](_0x4ebad3["url"]);
    _0x3eb877 && _0xfc554e !== _0x3eb877 && (this["_showVideoSourceSwitchHold"](_0x23a09b), _0x23a09b["classList"]?.["add"]("is-source-switching"));
    const _0x25c7c3 = setMediaElementSource(_0x23a09b, _0x4ebad3["url"]);
    if (_0x25c7c3) {
      this["_cancelPendingVideoSourceSeek"](_0x23a09b, {
        'clearHold': ![]
      });
      this['_resetPreviewSeekState']("video");
      _0x23a09b["__mediaClipPendingSourceSeek"] = {
        'src': normalizeText(_0x4ebad3["url"]),
        'sec': Math['max'](0x0, toNumber(_0x4ebad3["sourceSec"], 0x0))
      };
      _0x23a09b["classList"]?.['add']("is-source-switching");
    } else {
      const _0x35d554 = this["_normalizePreviewSourceIdentity"](_0x23a09b['__mediaClipPendingSourceSeek']?.['src']);
      if (_0x35d554 && _0x35d554 === _0x3eb877) {
        _0x23a09b["__mediaClipPendingSourceSeek"]["sec"] = Math["max"](0x0, toNumber(_0x4ebad3["sourceSec"], 0x0));
        _0x23a09b['classList']?.["add"]('is-source-switching');
      } else {
        !_0x23a09b['__mediaClipWaitingSourceSeek'] && this["_clearVideoSourceSwitchHold"](_0x23a09b);
      }
    }
    this["_previewVideoSrc"] = _0x4ebad3['url'];
    return _0x25c7c3;
  }
  ["_getAudioClipContextAtTimelineSec"](_0x502008 = this["_playheadSec"], _0x1ead61 = {}) {
    const _0x3ff3c1 = this["_audioTimelineClips"](this["_mediaClip"]["tracks"]?.['audio']);
    const _0x27a085 = _0x3ff3c1["map"]((_0xf73837, _0x40e051) => ({
      'clip': _0xf73837,
      'index': _0x40e051
    }))["filter"](({
      clip: _0x27dedc
    }) => _0x1ead61["audibleOnly"] === !![] ? _0x27dedc?.["muted"] !== !![] && _0x27dedc?.['disabled'] !== !![] : !![]);
    const _0x28e23a = toNumber(_0x502008, 0x0);
    const _0x6d0e9b = _0x27a085["findIndex"](({
      clip: _0x5cb91e
    }, _0x495c0b) => {
      const _0x6fadc3 = toNumber(_0x5cb91e["timelineStartSec"], 0x0);
      const _0x4ee35c = Math["max"](_0x6fadc3, toNumber(_0x5cb91e['timelineEndSec'], _0x6fadc3));
      return _0x495c0b === _0x27a085["length"] - 0x1 ? _0x28e23a >= _0x6fadc3 && _0x28e23a <= _0x4ee35c : _0x28e23a >= _0x6fadc3 && _0x28e23a < _0x4ee35c;
    });
    const _0x558006 = _0x6d0e9b >= 0x0 || _0x1ead61["nearest"] === ![] ? _0x6d0e9b : this["_audioClipIndexAtTimelineSec"](_0x502008, _0x27a085['map'](({
      clip: _0x2d5747
    }) => _0x2d5747));
    const _0x4361a8 = _0x1ead61["nearest"] === ![] ? null : _0x27a085[0x0] || null;
    const _0x1e7fc2 = _0x558006 >= 0x0 ? _0x27a085[_0x558006] || null : _0x4361a8;
    const _0x2e119a = _0x1e7fc2?.["clip"] || null;
    const _0x514a5e = _0x1e7fc2?.["index"] ?? -0x1;
    const _0x172da5 = _0x2e119a ? this["_audioClipSource"](_0x2e119a, _0x514a5e) : _0x1ead61["nearest"] === ![] ? null : this["_sources"]['audio'];
    return {
      'clip': _0x2e119a,
      'index': _0x514a5e,
      'source': _0x172da5,
      'url': resolveMediaClipAudioUrl(_0x172da5),
      'sourceSec': _0x2e119a ? this["_audioClipSourceSec"](_0x2e119a, _0x502008) : _0x502008
    };
  }
  ["_syncAudioPreviewSourceForTimelineSec"](_0x46414e = this["_playheadSec"]) {
    const _0x158f59 = this["_audioPreview"];
    if (!_0x158f59) {
      return ![];
    }
    this['_videoPreview'] && this["_mediaClip"]["tracks"]?.["audio"] && (this["_videoPreview"]["muted"] = !![]);
    const _0xfbffa4 = this["_getAudioClipContextAtTimelineSec"](_0x46414e, {
      'audibleOnly': !![],
      'nearest': ![]
    });
    if (!_0xfbffa4['url']) {
      setMediaElementSource(_0x158f59, '');
      this["_previewAudioSrc"] = '';
      return ![];
    }
    const _0x690552 = setMediaElementSource(_0x158f59, _0xfbffa4["url"]);
    if (_0x690552) {
      this["_resetPreviewSeekState"]("audio");
    }
    this["_previewAudioSrc"] = _0xfbffa4['url'];
    return _0x690552;
  }
  ["_createPreviewSeekState"](_0x3d92cd = {}) {
    return {
      'lastAppliedSec': null,
      ..._0x3d92cd
    };
  }
  ["_getPreviewSeekState"](_0x2b28a8) {
    if (!this["_previewSeekState"]) {
      this["_previewSeekState"] = {};
    }
    !this["_previewSeekState"][_0x2b28a8] && (this["_previewSeekState"][_0x2b28a8] = this["_createPreviewSeekState"]());
    return this["_previewSeekState"][_0x2b28a8];
  }
  ["_resetPreviewSeekState"](_0x55e8b8 = '') {
    const _0xbc18a = _0x55e8b8 ? [_0x55e8b8] : ["video", "audio"];
    if (!this["_previewSeekState"]) {
      this["_previewSeekState"] = {};
    }
    _0xbc18a['forEach'](_0x45c0c3 => {
      this['_cancelPreviewSeek'](_0x45c0c3);
      this['_previewSeekState'][_0x45c0c3] = this["_createPreviewSeekState"]();
    });
  }
  ["_cancelPreviewSeek"](_0x845511) {
    const _0x2a928e = this['_previewSeekRaf']?.[_0x845511];
    if (!_0x2a928e) {
      return;
    }
    try {
      if (typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(_0x2a928e);
      }
    } catch {}
    try {
      clearTimeout(_0x2a928e);
    } catch {}
    this["_previewSeekRaf"][_0x845511] = 0x0;
  }
  ["_disposePreviewMedia"](_0x348216 = '') {
    (!_0x348216 || _0x348216 === this["_getPlaybackKind"]()) && this["_pausePreviewPlayback"]({
      'updateControls': ![]
    });
    const _0x3019c7 = !_0x348216 || _0x348216 === "video";
    const _0x2f0425 = !_0x348216 || _0x348216 === "video" || _0x348216 === 'image';
    const _0x3f1d9d = !_0x348216 || _0x348216 === "audio";
    _0x3019c7 && (this['_resetPreviewSeekState']("video"), this['_clearVideoSourceSwitchHold'](this["_videoPreview"]), disposeMediaElement(this['_videoPreview']), this['_videoPreview']?.["remove"]?.(), this["_videoPreview"] = null, this['_previewVideoSrc'] = '');
    if (_0x2f0425) {
      this["_imagePreview"]?.["remove"]?.();
      this["_imagePreview"] = null;
      if (this["_previewVisualKind"] === 'image') {
        this["_previewVisualKind"] = '';
      }
    }
    _0x3f1d9d && (this["_resetPreviewSeekState"]("audio"), disposeMediaElement(this['_audioPreview']), this["_audioPreview"]?.["remove"]?.(), this["_audioPreview"] = null, this["_previewAudioSrc"] = '');
  }
  ["_schedulePreviewSeek"](_0x25041e, _0x4fa968 = {}) {
    if (this["_previewSeekRaf"][_0x25041e]) {
      return;
    }
    const _0x5a6f3b = typeof requestAnimationFrame === "function" ? _0x153159 => requestAnimationFrame(_0x153159) : _0x5af612 => setTimeout(_0x5af612, 0x10);
    this["_previewSeekRaf"][_0x25041e] = _0x5a6f3b(() => {
      this["_previewSeekRaf"][_0x25041e] = 0x0;
      this["_applyPreviewSeek"](_0x25041e, _0x4fa968);
    });
  }
  ['_applyPreviewSeek'](_0x355337, _0x1d5a87 = {}) {
    if (_0x355337 === "video" && this["_previewVisualKind"] === "image") {
      this["_updatePreviewControls"]();
      return;
    }
    const _0x287aae = _0x1d5a87["immediate"] === !![] || _0x1d5a87["allowDuringPlayback"] === !![];
    if ((this['_playing'] || this["_playPreviewPending"]) && !_0x287aae) {
      this["_pendingPreviewSeek"][_0x355337] = null;
      this["_updatePreviewControls"]();
      return;
    }
    const _0x1ef3cd = this["_getPreviewMedia"](_0x355337);
    const _0x3e1884 = Math["max"](0x0, toNumber(this["_pendingPreviewSeek"][_0x355337], 0x0));
    if (!_0x1ef3cd) {
      return;
    }
    if (_0x1ef3cd["readyState"] < 0x1) {
      !_0x1ef3cd["__mediaClipSeekPending"] && (_0x1ef3cd["__mediaClipSeekPending"] = !![], _0x1ef3cd["addEventListener"]("loadedmetadata", () => {
        _0x1ef3cd['__mediaClipSeekPending'] = ![];
        this["_applyPreviewSeek"](_0x355337, _0x1d5a87);
      }, {
        'once': !![]
      }));
      return;
    }
    const _0x4c87bd = this["_getPreviewSeekState"](_0x355337);
    const _0x1c48eb = _0x1d5a87["immediate"] === !![];
    const _0x2e3c76 = Number["isFinite"](_0x1ef3cd["duration"]) && _0x1ef3cd['duration'] > 0x0 ? Math['min'](_0x3e1884, _0x1ef3cd['duration']) : _0x3e1884;
    const _0x2d8cbd = toNumber(_0x1ef3cd['currentTime'], _0x2e3c76);
    const _0x56d611 = toNumber(_0x4c87bd["lastAppliedSec"], Number["NaN"]);
    if (!_0x1c48eb && (Math["abs"](_0x2d8cbd - _0x2e3c76) < PREVIEW_SCRUB_SEEK_EPSILON_SEC || Number["isFinite"](_0x56d611) && Math['abs'](_0x2e3c76 - _0x56d611) < PREVIEW_SCRUB_SEEK_EPSILON_SEC)) {
      this["_updatePreviewControls"]();
      return;
    }
    try {
      _0x1ef3cd["currentTime"] = _0x2e3c76;
      _0x4c87bd["lastAppliedSec"] = _0x2e3c76;
    } catch {}
    this['_updatePreviewControls']();
  }
  ["_syncPreviewTime"](_0x1f29f1, _0x14deb1, _0x373587 = {}) {
    const _0x3be7eb = _0x373587["immediate"] === !![] || _0x373587["allowDuringPlayback"] === !![];
    if ((this["_playing"] || this["_playPreviewPending"]) && !_0x3be7eb) {
      return;
    }
    const _0x3ba365 = Math['max'](0x0, toNumber(_0x14deb1, 0x0));
    this["_pendingPreviewSeek"][_0x1f29f1] = _0x3ba365;
    if (_0x1f29f1 === "video" && this["_previewVisualKind"] === "image") {
      this["_updatePreviewControls"]();
      return;
    }
    if (!this["_getPreviewMedia"](_0x1f29f1)) {
      return;
    }
    if (_0x373587["immediate"] === !![]) {
      this["_cancelPreviewSeek"](_0x1f29f1);
      this["_applyPreviewSeek"](_0x1f29f1, {
        'immediate': !![]
      });
      return;
    }
    this["_schedulePreviewSeek"](_0x1f29f1, _0x373587);
  }
  ["_applyPendingVideoSourceSeek"](_0x52828b = this['_videoPreview']) {
    const _0x224bbd = _0x52828b?.["__mediaClipPendingSourceSeek"];
    if (!_0x224bbd || typeof _0x224bbd !== "object") {
      return ![];
    }
    const _0x223138 = normalizeText(_0x224bbd["src"]);
    const _0x39a677 = this["_normalizePreviewSourceIdentity"](firstNonEmpty(_0x52828b["dataset"]?.["desktopMediaSourceUrl"], _0x52828b["getAttribute"]?.("src"), _0x52828b["currentSrc"], _0x52828b["src"]));
    const _0x285078 = this['_normalizePreviewSourceIdentity'](_0x223138);
    if (_0x285078 && _0x39a677 !== _0x285078) {
      return ![];
    }
    delete _0x52828b["__mediaClipPendingSourceSeek"];
    const _0x1a5d92 = toNumber(_0x224bbd["sec"], Number["NaN"]);
    if (!Number['isFinite'](_0x1a5d92)) {
      return ![];
    }
    this['_syncPreviewTime']("video", Math["max"](0x0, _0x1a5d92), {
      'immediate': !![]
    });
    this["_waitForPendingVideoSourceSeek"](_0x52828b, _0x1a5d92);
    return !![];
  }
  ["_normalizePreviewSourceIdentity"](_0x19e1d5) {
    const _0x286105 = normalizeText(_0x19e1d5);
    if (!_0x286105) {
      return '';
    }
    try {
      return new URL(_0x286105, globalThis["location"]?.['href'] || "http://127.0.0.1/")["href"];
    } catch {
      return _0x286105;
    }
  }
  ["_showVideoSourceSwitchHold"](_0x15eb13 = this["_videoPreview"]) {
    const _0x384fdf = _0x15eb13?.["parentElement"];
    if (!_0x384fdf || !_0x15eb13) {
      return ![];
    }
    this["_clearVideoSourceSwitchHold"](_0x15eb13);
    const _0x32e6d6 = document["createElement"]('canvas');
    _0x32e6d6['className'] = "media-clip-source-switch-hold";
    const _0x3ec63a = _0x15eb13["getBoundingClientRect"]?.() || _0x384fdf["getBoundingClientRect"]?.() || {};
    const _0x36182d = Math["max"](0x1, Math['round'](toNumber(_0x15eb13["videoWidth"], 0x0) || toNumber(_0x3ec63a["width"], 0x0) || 0x1));
    const _0x5dd0a1 = Math["max"](0x1, Math["round"](toNumber(_0x15eb13['videoHeight'], 0x0) || toNumber(_0x3ec63a['height'], 0x0) || 0x1));
    _0x32e6d6["width"] = _0x36182d;
    _0x32e6d6['height'] = _0x5dd0a1;
    let _0x28b431 = ![];
    try {
      const _0x5e1e1f = _0x32e6d6['getContext']?.('2d');
      _0x5e1e1f && (_0x5e1e1f["drawImage"](_0x15eb13, 0x0, 0x0, _0x36182d, _0x5dd0a1), _0x28b431 = !![]);
    } catch {}
    _0x28b431 && (_0x384fdf['appendChild'](_0x32e6d6), _0x15eb13["__mediaClipSourceSwitchHold"] = _0x32e6d6, this["_videoSourceSwitchHold"] = _0x32e6d6);
    return _0x28b431;
  }
  ["_clearVideoSourceSwitchHold"](_0x30f0a6 = this["_videoPreview"]) {
    const _0x24840b = _0x30f0a6?.['__mediaClipSourceSwitchHold'] || this["_videoSourceSwitchHold"] || null;
    _0x24840b?.["remove"]?.();
    _0x30f0a6 && _0x24840b && _0x30f0a6['__mediaClipSourceSwitchHold'] === _0x24840b && delete _0x30f0a6["__mediaClipSourceSwitchHold"];
    _0x24840b && this["_videoSourceSwitchHold"] === _0x24840b && (this["_videoSourceSwitchHold"] = null);
    _0x30f0a6?.['classList']?.['remove']('is-source-switching');
  }
  ["_cancelPendingVideoSourceSeek"](_0x34331d = this["_videoPreview"], _0x32075a = {}) {
    if (!_0x34331d) {
      return;
    }
    const _0x931fad = _0x34331d["__mediaClipSourceSeekFinish"];
    if (_0x931fad) {
      try {
        _0x34331d["removeEventListener"]?.("seeked", _0x931fad);
      } catch {}
    }
    const _0x45773f = _0x34331d["__mediaClipSourceSeekFallbackTimer"];
    if (_0x45773f) {
      try {
        clearTimeout(_0x45773f);
      } catch {}
    }
    delete _0x34331d['__mediaClipWaitingSourceSeek'];
    delete _0x34331d["__mediaClipSourceSeekFinish"];
    delete _0x34331d['__mediaClipSourceSeekFallbackTimer'];
    delete _0x34331d["__mediaClipSourceSeekTargetSec"];
    delete _0x34331d["__mediaClipSourceSeekToken"];
    if (_0x32075a["clearHold"] !== ![]) {
      this['_clearVideoSourceSwitchHold'](_0x34331d);
    }
  }
  ["_waitForPendingVideoSourceSeek"](_0x3175d8 = this["_videoPreview"], _0x565670 = 0x0) {
    if (!_0x3175d8) {
      return;
    }
    const _0x57021b = Math['max'](0x0, toNumber(_0x565670, 0x0));
    _0x3175d8["__mediaClipSourceSeekTargetSec"] = _0x57021b;
    if (_0x57021b <= PREVIEW_SCRUB_SEEK_EPSILON_SEC) {
      this["_finishPendingVideoSourceSeek"](_0x3175d8);
      return;
    }
    if (!_0x3175d8['__mediaClipWaitingSourceSeek']) {
      _0x3175d8["__mediaClipWaitingSourceSeek"] = !![];
      const _0x498858 = () => this['_finishPendingVideoSourceSeek'](_0x3175d8);
      _0x3175d8["__mediaClipSourceSeekFinish"] = _0x498858;
      _0x3175d8["addEventListener"]?.('seeked', _0x498858, {
        'once': !![]
      });
    }
    const _0x3dd410 = _0x3175d8["__mediaClipSourceSeekFallbackTimer"];
    if (_0x3dd410) {
      try {
        clearTimeout(_0x3dd410);
      } catch {}
    }
    if (typeof setTimeout === "function") {
      const _0xe7889a = toNumber(_0x3175d8['__mediaClipSourceSeekToken'], 0x0) + 0x1;
      _0x3175d8["__mediaClipSourceSeekToken"] = _0xe7889a;
      _0x3175d8["__mediaClipSourceSeekFallbackTimer"] = setTimeout(() => {
        if (_0x3175d8["__mediaClipSourceSeekToken"] !== _0xe7889a) {
          return;
        }
        this['_finishPendingVideoSourceSeek'](_0x3175d8);
      }, 0xfa);
    }
  }
  ['_finishPendingVideoSourceSeek'](_0x452d81 = this["_videoPreview"]) {
    if (!_0x452d81?.["__mediaClipWaitingSourceSeek"] && !_0x452d81?.['__mediaClipSourceSwitchHold'] && !_0x452d81?.["classList"]?.["contains"]?.("is-source-switching")) {
      return;
    }
    const _0x5c58e0 = _0x452d81["__mediaClipSourceSeekFinish"];
    if (_0x5c58e0) {
      try {
        _0x452d81["removeEventListener"]?.("seeked", _0x5c58e0);
      } catch {}
    }
    const _0x4052b9 = _0x452d81["__mediaClipSourceSeekFallbackTimer"];
    if (_0x4052b9) {
      try {
        clearTimeout(_0x4052b9);
      } catch {}
    }
    delete _0x452d81["__mediaClipWaitingSourceSeek"];
    delete _0x452d81["__mediaClipSourceSeekFinish"];
    delete _0x452d81["__mediaClipSourceSeekFallbackTimer"];
    delete _0x452d81["__mediaClipSourceSeekTargetSec"];
    delete _0x452d81["__mediaClipSourceSeekToken"];
    this["_clearVideoSourceSwitchHold"](_0x452d81);
    if (this['_playing']) {
      try {
        _0x452d81['play']?.()?.["catch"]?.(() => {});
      } catch {}
    }
    this["_updatePreviewControls"]();
  }
  ['_render']() {
    if (!this['el']) {
      return;
    }
    this["_removeMaterialMenuPortal"]();
    const _0x371197 = !!(this['_mediaClip']["tracks"]?.["video"] || this["_mediaClip"]["tracks"]?.['audio']);
    const _0x3f803a = _0x371197 && this["_mediaClip"]["expanded"] === !![];
    _0x3f803a ? this['_claimExpandedEditor']() : (this["_materialMenu"] = null, this["_releaseExpandedEditor"](), this["_disposePreviewMedia"]());
    this['el']["replaceChildren"]();
    this['el']['classList']['toggle']("is-picking", this["_isPicking"]());
    this['el']["classList"]["toggle"]("is-expanded", _0x3f803a);
    this["_syncHostPresentation"](_0x3f803a);
    this["_syncDocumentExitListener"](_0x3f803a);
    this["_syncMaterialMenuDismissListener"](_0x3f803a && !!this["_materialMenu"]);
    this["_syncDocumentKeyListener"](_0x3f803a);
    this['_syncDeleteMaterialShortcutListener'](_0x3f803a);
    if (!_0x371197) {
      this['el']["appendChild"](this["_renderEmpty"]());
      return;
    }
    _0x3f803a ? this['el']["append"](this["_renderCompact"](), this["_renderPreviewPanel"]()) : this['el']["appendChild"](this["_renderCompact"]());
    _0x3f803a && this['_materialMenu'] && this["_renderMaterialMenuPortal"]();
    this['_exporting'] && this["_startExportLoading"]();
  }
  ["_rerenderCompactOnly"]() {
    if (!this['el']) {
      return ![];
    }
    const _0x16c2ca = this['el']["querySelector"]?.(".media-clip-compact");
    const _0x9455ae = _0x16c2ca?.['parentNode'];
    if (!_0x16c2ca || !_0x9455ae) {
      this['_render']();
      return ![];
    }
    this["_removeMaterialMenuPortal"]();
    const _0x55846a = this['_renderCompact']();
    if (typeof _0x9455ae['replaceChild'] === 'function') {
      _0x9455ae['replaceChild'](_0x55846a, _0x16c2ca);
    } else {
      if (Array["isArray"](_0x9455ae['children'])) {
        const _0x25bfd1 = _0x9455ae["children"]["indexOf"](_0x16c2ca);
        _0x25bfd1 >= 0x0 && (_0x55846a['parentNode'] = _0x9455ae, _0x16c2ca['parentNode'] = null, _0x9455ae["children"]["splice"](_0x25bfd1, 0x1, _0x55846a));
      }
    }
    const _0x4f86c7 = !!(this["_mediaClip"]['tracks']?.["video"] || this['_mediaClip']["tracks"]?.["audio"]);
    const _0x28255d = _0x4f86c7 && this["_mediaClip"]['expanded'] === !![];
    this['_syncDocumentExitListener'](_0x28255d);
    this['_syncMaterialMenuDismissListener'](_0x28255d && !!this["_materialMenu"]);
    this['_syncDocumentKeyListener'](_0x28255d);
    this["_syncDeleteMaterialShortcutListener"](_0x28255d);
    _0x28255d && this["_materialMenu"] && this["_renderMaterialMenuPortal"]();
    return !![];
  }
  ["_syncHostPresentation"](_0x5f271b) {
    const _0x576719 = () => {
      const _0x4fda5f = this['el']?.["closest"]?.(".v2-node-component") || this['el']?.['parentElement'];
      _0x4fda5f?.["style"] && (_0x4fda5f["style"]["overflow"] = "visible");
      const _0x1674dd = document["getElementById"](this['id']);
      if (!_0x1674dd?.["style"]) {
        return;
      }
      _0x1674dd["classList"]["toggle"]("media-clip-expanded-host", _0x5f271b === !![]);
      syncRendererNodePresentationZIndex(_0x1674dd, _0x5f271b === !![] ? MEDIA_CLIP_EXPANDED_HOST_Z_INDEX : _0x1674dd["classList"]["contains"]("selected") || _0x1674dd["classList"]["contains"]("v2-selected") ? '100' : '10');
    };
    _0x576719();
    !this['el']?.["parentElement"] && typeof requestAnimationFrame === "function" && requestAnimationFrame(_0x576719);
  }
  ["_syncDocumentExitListener"](_0x26752e) {
    if (typeof document === "undefined") {
      return;
    }
    if (!_0x26752e) {
      this["_onDocumentPointerDown"] && (document["removeEventListener"]("pointerdown", this["_onDocumentPointerDown"], !![]), this['_onDocumentPointerDown'] = null);
      return;
    }
    if (this["_onDocumentPointerDown"]) {
      return;
    }
    this["_onDocumentPointerDown"] = _0x2fd31c => {
      if (this["_mediaClip"]["expanded"] !== !![]) {
        return;
      }
      const _0x295380 = document["getElementById"](this['id']);
      if (this['el']?.["contains"]?.(_0x2fd31c['target'])) {
        return;
      }
      if (this["_materialMenuEl"]?.['contains']?.(_0x2fd31c['target'])) {
        return;
      }
      if (_0x295380?.["contains"]?.(_0x2fd31c["target"])) {
        _0x2fd31c["preventDefault"]?.();
        _0x2fd31c["stopPropagation"]?.();
        return;
      }
      this["_setExpanded"](![]);
    };
    document["addEventListener"]("pointerdown", this["_onDocumentPointerDown"], !![]);
  }
  ['_syncMaterialMenuDismissListener'](_0x57d2ab) {
    if (typeof document === "undefined") {
      return;
    }
    if (!_0x57d2ab) {
      this['_onMaterialMenuPointerDown'] && (document['removeEventListener']("pointerdown", this["_onMaterialMenuPointerDown"], !![]), this["_onMaterialMenuPointerDown"] = null);
      return;
    }
    if (this["_onMaterialMenuPointerDown"]) {
      return;
    }
    this["_onMaterialMenuPointerDown"] = _0x48c923 => {
      if (!this["_materialMenu"]) {
        return;
      }
      if (_0x48c923?.["button"] === 0x2) {
        return;
      }
      if (this['_materialMenuEl']?.["contains"]?.(_0x48c923['target'])) {
        return;
      }
      this["_closeMaterialMenu"]();
    };
    document["addEventListener"]("pointerdown", this["_onMaterialMenuPointerDown"], !![]);
  }
  ["_removeMaterialMenuPortal"]() {
    this["_materialMenuEl"]?.["parentNode"]?.["removeChild"]?.(this["_materialMenuEl"]);
    this['_materialMenuEl'] = null;
  }
  ["_closeMaterialMenu"](_0x24c148 = {}) {
    if (!this['_materialMenu'] && !this["_materialMenuEl"]) {
      return;
    }
    this["_materialMenu"] = null;
    this["_syncMaterialMenuDismissListener"](![]);
    this["_removeMaterialMenuPortal"]();
    if (_0x24c148["render"] === !![]) {
      this['_render']();
    }
  }
  ["_materialMenuHost"]() {
    return this['el']?.['querySelector']?.(".media-clip-compact.is-editing") || this['el']?.["querySelector"]?.(".media-clip-compact") || this['el'] || null;
  }
  ['_materialMenuLocalPoint'](_0x57566b, _0xa7a61d, _0x3093f5 = this["_materialMenuHost"]()) {
    const _0x352659 = _0x3093f5?.["getBoundingClientRect"]?.() || {
      'left': 0x0,
      'top': 0x0,
      'width': 0x0,
      'height': 0x0
    };
    const _0x27a731 = readLayoutWidthPx(_0x3093f5, _0x352659["width"] || 0x1);
    const _0x547836 = toNumber(_0x3093f5?.["offsetHeight"], 0x0) || parseFloat(_0x3093f5?.["style"]?.["getPropertyValue"]?.("height")) || _0x352659["height"] || 0x1;
    const _0x3038ac = _0x352659['width'] > 0x0 && _0x27a731 > 0x0 ? _0x352659["width"] / _0x27a731 : 0x1;
    const _0x8a75d = _0x352659["height"] > 0x0 && _0x547836 > 0x0 ? _0x352659["height"] / _0x547836 : _0x3038ac;
    return {
      'x': (toNumber(_0x57566b, _0x352659["left"]) - toNumber(_0x352659["left"], 0x0)) / (_0x3038ac || 0x1),
      'y': (toNumber(_0xa7a61d, _0x352659["top"]) - toNumber(_0x352659["top"], 0x0)) / (_0x8a75d || 0x1)
    };
  }
  ["_renderMaterialMenuPortal"]() {
    if (typeof document === 'undefined' || !this["_materialMenu"]) {
      return;
    }
    const _0x5c2c1b = this["_materialMenuHost"]();
    if (!_0x5c2c1b) {
      return;
    }
    const _0x4c3381 = this["_renderMaterialMenu"]();
    this["_materialMenuEl"] = _0x4c3381;
    _0x5c2c1b["appendChild"](_0x4c3381);
    this["_positionMaterialMenu"](_0x4c3381, _0x5c2c1b);
  }
  ["_positionMaterialMenu"](_0x2e09f3, _0x47e3f7 = this["_materialMenuHost"]()) {
    if (!_0x2e09f3) {
      return;
    }
    const _0x2b40b8 = this["_materialMenu"] || {};
    const _0x1f1796 = 0x8;
    const _0x568ad6 = toNumber(_0x2b40b8['x'] ?? _0x2b40b8["left"], _0x1f1796);
    const _0x3d61ea = toNumber(_0x2b40b8['y'] ?? _0x2b40b8['top'], _0x1f1796);
    const _0x4c4f0e = _0x47e3f7?.["getBoundingClientRect"]?.() || {
      'left': 0x0,
      'top': 0x0,
      'width': 0x0,
      'height': 0x0
    };
    const _0x2a168e = readLayoutWidthPx(_0x47e3f7, _0x4c4f0e["width"] || 0x1);
    const _0x294c63 = toNumber(_0x47e3f7?.["offsetHeight"], 0x0) || parseFloat(_0x47e3f7?.["style"]?.["getPropertyValue"]?.("height")) || _0x4c4f0e["height"] || 0x1;
    const _0x2acaa1 = _0x4c4f0e["width"] > 0x0 && _0x2a168e > 0x0 ? _0x4c4f0e["width"] / _0x2a168e : 0x1;
    const _0x5d6c7e = _0x4c4f0e["height"] > 0x0 && _0x294c63 > 0x0 ? _0x4c4f0e["height"] / _0x294c63 : _0x2acaa1;
    const _0x15a184 = toNumber(_0x2e09f3["offsetWidth"], 0x0);
    const _0x41f65d = toNumber(_0x2e09f3["offsetHeight"], 0x0);
    const _0x38eddc = typeof window !== "undefined" ? toNumber(window["innerWidth"], 0x0) : 0x0;
    const _0x338e4b = typeof window !== "undefined" ? toNumber(window['innerHeight'], 0x0) : 0x0;
    const _0xa1612d = _0x38eddc > 0x0 && _0x2acaa1 > 0x0 ? Math["max"](_0x1f1796, (_0x38eddc - _0x4c4f0e["left"]) / _0x2acaa1 - _0x15a184 - _0x1f1796) : _0x568ad6;
    const _0x123e9f = _0x338e4b > 0x0 && _0x5d6c7e > 0x0 ? Math["max"](_0x1f1796, (_0x338e4b - _0x4c4f0e["top"]) / _0x5d6c7e - _0x41f65d - _0x1f1796) : _0x3d61ea;
    _0x2e09f3['style']["left"] = Math["min"](_0xa1612d, Math["max"](_0x1f1796, _0x568ad6)) + 'px';
    _0x2e09f3['style']["top"] = Math["min"](_0x123e9f, Math["max"](_0x1f1796, _0x3d61ea)) + 'px';
  }
  ["_isEditableEventTarget"](_0x515a04) {
    return !!_0x515a04?.["closest"]?.("input, textarea, select, [contenteditable=\"true\"], [role=\"textbox\"]");
  }
  ["_syncDocumentKeyListener"](_0x3f7231) {
    if (typeof document === "undefined") {
      return;
    }
    if (!_0x3f7231) {
      this["_onDocumentKeyDown"] && (document["removeEventListener"]("keydown", this["_onDocumentKeyDown"], !![]), this["_onDocumentKeyDown"] = null);
      return;
    }
    if (this['_onDocumentKeyDown']) {
      return;
    }
    this["_onDocumentKeyDown"] = _0x3f81c5 => this['_handleDocumentKeyDown'](_0x3f81c5);
    document["addEventListener"]("keydown", this['_onDocumentKeyDown'], !![]);
  }
  ["_syncDeleteMaterialShortcutListener"](_0xde43ab) {
    if (typeof window === "undefined") {
      return;
    }
    if (!_0xde43ab) {
      this['_onDeleteMaterialShortcut'] && (window["removeEventListener"](MEDIA_CLIP_DELETE_MATERIAL_EVENT, this["_onDeleteMaterialShortcut"]), this["_onDeleteMaterialShortcut"] = null);
      return;
    }
    if (this["_onDeleteMaterialShortcut"]) {
      return;
    }
    this["_onDeleteMaterialShortcut"] = _0x4739a9 => {
      const _0xd6189a = normalizeText(_0x4739a9?.['detail']?.["nodeId"]);
      if (_0xd6189a && _0xd6189a !== this['id']) {
        return;
      }
      if (this["_mediaClip"]["expanded"] !== !![]) {
        return;
      }
      this["_deleteActiveMaterialFromShortcut"]();
    };
    window["addEventListener"](MEDIA_CLIP_DELETE_MATERIAL_EVENT, this["_onDeleteMaterialShortcut"]);
  }
  ["_deleteActiveMaterialFromShortcut"]() {
    const _0x518695 = typeof performance !== "undefined" && typeof performance['now'] === "function" ? performance["now"]() : Date["now"]();
    if (_0x518695 - this['_lastDeleteMaterialShortcutAt'] < 0x50) {
      return;
    }
    this["_lastDeleteMaterialShortcutAt"] = _0x518695;
    this["_deleteActiveMaterial"]();
  }
  ["_handleDocumentKeyDown"](_0xe251bb) {
    if (this["_mediaClip"]["expanded"] !== !![]) {
      return;
    }
    if (this["_materialMenuEl"]) {
      const _0x1400e8 = Array["from"](this["_materialMenuEl"]['querySelectorAll']?.("[data-shortcut-action]") || []);
      const _0x245b23 = resolveShortcutActionForEvent(_0xe251bb, _0x1400e8["map"](_0x5368fa => _0x5368fa["dataset"]["shortcutAction"]));
      if (_0x245b23 && _0xe251bb?.['repeat'] !== !![]) {
        const _0x5b8cd6 = _0x1400e8['find'](_0x48d603 => _0x48d603['dataset']["shortcutAction"] === _0x245b23);
        if (typeof _0x5b8cd6?.["__contextMenuShortcutActivate"] === 'function') {
          _0xe251bb["preventDefault"]?.();
          _0xe251bb["stopPropagation"]?.();
          _0xe251bb["stopImmediatePropagation"]?.();
          _0x5b8cd6["__contextMenuShortcutActivate"](_0xe251bb);
          return;
        }
      }
    }
    if (this["_isEditableEventTarget"](_0xe251bb?.["target"])) {
      return;
    }
    if (_0xe251bb?.["key"] === "Escape" && this["_materialMenu"]) {
      _0xe251bb["preventDefault"]?.();
      _0xe251bb["stopPropagation"]?.();
      this["_closeMaterialMenu"]();
      return;
    }
    if (_0xe251bb?.["key"] === '\x20' || _0xe251bb?.["code"] === "Space") {
      _0xe251bb["preventDefault"]?.();
      _0xe251bb["stopPropagation"]?.();
      _0xe251bb["stopImmediatePropagation"]?.();
      !_0xe251bb?.['repeat'] && void this['_togglePreviewPlayback']();
      return;
    }
  }
  ["_renderPickButton"]() {
    const _0x355880 = document['createElement']("button");
    _0x355880["type"] = "button";
    _0x355880["className"] = "media-clip-pick-btn";
    _0x355880['classList']["toggle"]('is-active', this["_isPicking"]());
    const _0x14c6eb = mediaClipText("pick.addByConnection");
    _0x355880['title'] = _0x14c6eb;
    _0x355880["setAttribute"]("aria-label", _0x14c6eb);
    _0x355880["appendChild"](createConnectCursorIcon());
    _0x355880['addEventListener']("click", _0xbe4114 => this["_togglePickConnect"](_0xbe4114));
    return _0x355880;
  }
  ["_renderEmpty"]() {
    const _0xb48dd8 = document["createElement"]('div');
    _0xb48dd8["className"] = "media-clip-empty";
    const _0x3d2c16 = document['createElement']("div");
    _0x3d2c16["className"] = 'media-clip-empty-body';
    const _0x48b38a = document["createElement"]("button");
    _0x48b38a["type"] = "button";
    _0x48b38a["className"] = 'media-clip-pick-btn';
    _0x48b38a["classList"]['toggle']('is-active', this["_isPicking"]());
    const _0x2904d3 = mediaClipText("pick.addByConnection");
    _0x48b38a["title"] = _0x2904d3;
    _0x48b38a['setAttribute']('aria-label', _0x2904d3);
    _0x48b38a["appendChild"](createConnectCursorIcon());
    _0x48b38a["addEventListener"]("click", _0x43cbf1 => this["_togglePickConnect"](_0x43cbf1));
    _0x3d2c16['appendChild'](_0x48b38a);
    const _0x1ccc86 = document["createElement"]("div");
    _0x1ccc86['className'] = 'media-clip-empty-copy';
    _0x1ccc86["classList"]["toggle"]('is-picking', this["_isPicking"]());
    const _0xeaf2eb = document["createElement"]('div');
    _0xeaf2eb["textContent"] = this["_isPicking"]() ? mediaClipText("empty.selectMaterial") : mediaClipText('empty.connectHint');
    _0x1ccc86["appendChild"](_0xeaf2eb);
    if (this['_isPicking']()) {
      const _0x523f62 = document['createElement']("div");
      _0x523f62['className'] = 'media-clip-esc';
      _0x523f62["textContent"] = mediaClipText("empty.exit");
      _0x1ccc86["appendChild"](_0x523f62);
    }
    _0x3d2c16["appendChild"](_0x1ccc86);
    _0xb48dd8['appendChild'](_0x3d2c16);
    return _0xb48dd8;
  }
  ["_renderCompact"]() {
    const _0x3f87ee = this["_mediaClip"]["expanded"] === !![];
    const _0xb0a3dd = document["createElement"]("div");
    _0xb0a3dd["className"] = "media-clip-compact";
    _0xb0a3dd["classList"]["toggle"]("is-editing", _0x3f87ee);
    _0xb0a3dd["classList"]["toggle"]("is-menu-open", this["_menuOpen"] === !![]);
    const _0x190175 = document["createElement"]('div');
    _0x190175['className'] = "media-clip-compact-body";
    const _0x43b851 = document['createElement']('div');
    _0x43b851["className"] = 'media-clip-timeline-scroll';
    this["_primeTimelineScroll"](_0x43b851);
    _0x43b851["addEventListener"]("click", () => {
      if (this["_mediaClip"]["expanded"] === !![]) {
        return;
      }
      this['_setExpanded'](!![]);
    });
    this['_bindTimelineScroll'](_0x43b851);
    const _0x179679 = document['createElement']("div");
    _0x179679["className"] = "media-clip-compact-timeline";
    _0x179679["classList"]['toggle']("is-editing", _0x3f87ee);
    const _0x3a41b1 = this["_timelineTrackContentWidth"]({
      'compact': !_0x3f87ee
    });
    const _0x5a1584 = this["_timelineAddSlotLeftPx"](_0x3a41b1);
    const _0x51a81e = this["_timelineContentWidth"](_0x3a41b1);
    const _0x2c8dce = this["_timelineAxisWidthPx"]();
    _0x179679["style"]["setProperty"]("--media-clip-track-content-width", _0x3a41b1 + 'px');
    _0x179679["style"]["setProperty"]("--media-clip-timeline-content-width", _0x51a81e + 'px');
    _0x179679['style']["setProperty"]("--media-clip-add-left", _0x5a1584 + 'px');
    _0x179679["style"]["setProperty"]("--media-clip-track-axis-width", _0x2c8dce + 'px');
    const _0x625a4f = this["_audioTimelineClips"](this["_mediaClip"]["tracks"]["audio"]);
    const _0x593702 = this["_audioLaneCount"](_0x625a4f);
    this['_setAudioLaneCountStyle'](_0x179679, _0x593702);
    _0x179679["appendChild"](this["_renderRuler"](this["_primaryDuration"](), {
      'compact': !_0x3f87ee,
      'timelineWidthPx': _0x3a41b1
    }));
    const _0x414fe1 = document['createElement']("div");
    _0x414fe1["className"] = "media-clip-timeline-lane";
    _0x414fe1["classList"]["toggle"]("has-audio-track", !!this["_mediaClip"]["tracks"]["audio"]);
    this["_setAudioLaneCountStyle"](_0x414fe1, _0x593702);
    _0x414fe1["addEventListener"]("pointerleave", () => {
      if (this["_timelineDrag"]()) {
        return;
      }
      this["_clearTimelineHoverState"](_0x414fe1);
      this["_restoreTimelinePlayheads"]();
    });
    const _0x53efe3 = document["createElement"]("div");
    _0x53efe3['className'] = "media-clip-timeline-tracks";
    _0x53efe3["classList"]['toggle']("has-audio-track", !!this['_mediaClip']['tracks']["audio"]);
    this["_setAudioLaneCountStyle"](_0x53efe3, _0x593702);
    this['_mediaClip']['tracks']["audio"] && _0x414fe1["appendChild"](this["_renderAudioLaneControls"](_0x625a4f, _0x593702));
    this["_mediaClip"]["tracks"]["video"] && _0x53efe3["appendChild"](this["_renderTrack"]("video", {
      'compact': !_0x3f87ee,
      'timelineWidthPx': _0x3a41b1
    }));
    this["_mediaClip"]["tracks"]['audio'] && _0x53efe3['appendChild'](this["_renderTrack"]("audio", {
      'compact': !_0x3f87ee,
      'timelineWidthPx': _0x3a41b1
    }));
    const _0x2c75da = this["_renderShortcutCropButton"]();
    const _0x5f4044 = this['_renderPickButton']();
    _0x5f4044["classList"]["add"]('media-clip-add-btn');
    const _0x526952 = mediaClipText("pick.continueAdd");
    _0x5f4044["title"] = _0x526952;
    _0x5f4044["setAttribute"]("aria-label", _0x526952);
    _0x414fe1["append"](_0x53efe3, _0x5f4044);
    _0x179679["appendChild"](_0x414fe1);
    _0x3f87ee && (this['_bindTimelinePointerCursors'](_0x179679, _0x53efe3), _0x179679["appendChild"](this["_renderTimelineCursors"](this["_primaryDuration"]())));
    _0x43b851['appendChild'](_0x179679);
    this["_primeTimelineScroll"](_0x43b851);
    _0x190175["append"](_0x43b851);
    _0xb0a3dd['append'](_0x190175, _0x2c75da);
    _0x3f87ee && (_0xb0a3dd["appendChild"](this["_renderTimelineHintCarousel"]()), _0xb0a3dd["appendChild"](this['_renderTimelineTools']()));
    return _0xb0a3dd;
  }
  ["_renderAudioLaneControls"](_0x524336 = [], _0x3d81e1 = 0x1) {
    const _0x397f5f = document["createElement"]("div");
    _0x397f5f['className'] = "media-clip-audio-lane-controls";
    _0x397f5f["dataset"]["uiStop"] = "true";
    this["_setAudioLaneCountStyle"](_0x397f5f, _0x3d81e1);
    for (let _0x15105f = 0x0; _0x15105f < _0x3d81e1; _0x15105f += 0x1) {
      const _0x234121 = this["_audioClipsForLane"](_0x15105f, _0x524336);
      const _0x1ad116 = this["_isAudioLaneMuted"](_0x15105f, _0x524336);
      const _0x54a4b5 = document['createElement']("button");
      _0x54a4b5["type"] = "button";
      _0x54a4b5["className"] = "media-clip-audio-lane-mute-btn";
      _0x54a4b5["classList"]['toggle']("is-muted", _0x1ad116);
      _0x54a4b5["disabled"] = _0x234121["length"] === 0x0;
      _0x54a4b5["dataset"]["audioLaneIndex"] = String(_0x15105f);
      _0x54a4b5["dataset"]["uiStop"] = "true";
      _0x54a4b5["title"] = mediaClipText(_0x1ad116 ? "audioLane.unmute" : 'audioLane.mute');
      _0x54a4b5['setAttribute']('aria-label', _0x54a4b5["title"]);
      _0x54a4b5['style']["setProperty"]('--media-clip-audio-lane-top', _0x15105f * (MEDIA_CLIP_AUDIO_LANE_HEIGHT_PX + MEDIA_CLIP_AUDIO_LANE_GAP_PX) + 'px');
      const _0x1e24a5 = createMediaClipSvgElement("svg");
      _0x1e24a5["setAttribute"]("viewBox", "0 0 24 24");
      _0x1e24a5["setAttribute"]("width", '16');
      _0x1e24a5["setAttribute"]("height", '16');
      _0x1e24a5["setAttribute"]('aria-hidden', 'true');
      const _0x57c344 = createMediaClipSvgElement("path");
      _0x57c344["setAttribute"]('d', 'M4\x209v6h4l5\x204V5L8\x209H4z');
      _0x57c344["setAttribute"]("fill", "currentColor");
      _0x1e24a5["appendChild"](_0x57c344);
      const _0x1edfb5 = createMediaClipSvgElement("path");
      _0x1edfb5["setAttribute"]('d', _0x1ad116 ? 'M16\x209l5\x205m0-5l-5\x205' : "M16 8c1.3 1.4 1.3 4.6 0 6M18.5 6c2.4 2.6 2.4 8.4 0 11");
      _0x1edfb5["setAttribute"]('fill', "none");
      _0x1edfb5["setAttribute"]("stroke", "currentColor");
      _0x1edfb5["setAttribute"]("stroke-width", '2');
      _0x1edfb5["setAttribute"]("stroke-linecap", "round");
      _0x1e24a5["appendChild"](_0x1edfb5);
      _0x54a4b5["appendChild"](_0x1e24a5);
      _0x54a4b5['addEventListener']("pointerdown", stopPointer);
      _0x54a4b5['addEventListener']("click", _0x5ed42f => {
        stopPointer(_0x5ed42f);
        this['_toggleAudioLaneMuted'](_0x15105f);
      });
      _0x397f5f['appendChild'](_0x54a4b5);
    }
    return _0x397f5f;
  }
  ["_syncAudioLaneControls"](_0xe01f5e = this["_audioTimelineClips"](this["_mediaClip"]['tracks']?.["audio"]), _0x14ded1 = this["_audioLaneCount"](_0xe01f5e)) {
    const _0x55a684 = this['el']?.["querySelector"]?.(".media-clip-audio-lane-controls");
    if (!_0x55a684) {
      return;
    }
    const _0x5f335b = this['_renderAudioLaneControls'](_0xe01f5e, _0x14ded1);
    this["_setAudioLaneCountStyle"](_0x55a684, _0x14ded1);
    _0x55a684["replaceChildren"]?.(...Array['from'](_0x5f335b["children"] || []));
  }
  ["_primeTimelineScroll"](_0x53be7f) {
    return a411_0x5a84e5(this, _0x53be7f);
  }
  ["_bindTimelineScroll"](_0x25c88d) {
    return a411_0x1fb37c(this, _0x25c88d);
  }
  ['_shouldLockTimelineWheelScroll'](_0x12d5c6, _0x11bce5 = {}) {
    return a411_0x57b704(this, _0x12d5c6, _0x11bce5);
  }
  ['_timelineMaterialRangeSec']() {
    return a411_0x1b2a96(this);
  }
  ["_timelineMaterialScrollBounds"](_0x3e13b8, _0x3546be = {}) {
    return a411_0x507ad1(this, _0x3e13b8, _0x3546be);
  }
  ["_clampTimelineScrollLeft"](_0x3730e7, _0x32c4a6 = 0x0, _0x16d452 = {}) {
    return a411_0x5b9f38(this, _0x3730e7, _0x32c4a6, _0x16d452);
  }
  ['_handleTimelineZoomWheel'](_0xd5ebf6, _0x2e2fd1) {
    return a411_0x13bdf7(this, _0xd5ebf6, _0x2e2fd1);
  }
  ["_syncTimelineScrollFade"](_0x33f3c7) {
    return a411_0x139b00(this, _0x33f3c7);
  }
  ["_timelineDragScrollDeltaPx"](_0x5f4bea = this["_timelineDrag"]()) {
    return a411_0x1e600c(this, _0x5f4bea);
  }
  ["_timelineDragDeltaPx"](_0x5f1a59 = this['_timelineDrag'](), _0x13840b = {}) {
    return a411_0x1e0c0a(this, _0x5f1a59, _0x13840b);
  }
  ["_timelineDragAutoScrollVelocity"](_0x5ab136, _0x50edc4) {
    return a411_0x142c2a(_0x5ab136, _0x50edc4);
  }
  ["_scheduleTimelineDragAutoScroll"](_0x276efb = this["_timelineDrag"]()) {
    return a411_0x3790ef(this, _0x276efb);
  }
  ["_stopTimelineDragAutoScroll"]() {
    return a411_0xfefd86(this);
  }
  ["_runTimelineDragAutoScroll"](_0x97e6e1) {
    return a411_0x434e62(this, _0x97e6e1);
  }
  ["_persistTimelineDragScroll"](_0x43f30e = this["_timelineDrag"]()) {
    return a411_0x3ce520(this, _0x43f30e);
  }
  ['_renderShortcutCropButton']() {
    const _0x468c95 = makeButton("media-clip-tool-crop media-clip-shortcut-crop", mediaClipText("tools.splitMaterial"), '');
    _0x468c95["tabIndex"] = -0x1;
    _0x468c95['setAttribute']("aria-hidden", "true");
    _0x468c95["addEventListener"]("click", _0x14ba5e => {
      stopPointer(_0x14ba5e);
      this["_splitActiveMaterial"]();
    });
    return _0x468c95;
  }
  ["_setDownloadMenuOpen"](_0xdf8ffe) {
    this["_menuOpen"] = _0xdf8ffe === !![];
    this["_materialMenu"] && (this["_materialMenu"] = null, this["_removeMaterialMenuPortal"](), this['_syncMaterialMenuDismissListener'](![]));
    const _0x2b93cd = this['el']?.["querySelector"]?.(".media-clip-compact");
    _0x2b93cd?.["classList"]?.["toggle"]("is-menu-open", this["_menuOpen"]);
    const _0x34267d = this['el']?.["querySelector"]?.(".media-clip-compact-tools");
    if (!_0x34267d) {
      return;
    }
    const _0x4f016e = _0x34267d['querySelector']?.(".media-clip-tool-download");
    _0x4f016e?.["classList"]?.['toggle']('is-active', this["_menuOpen"]);
    _0x34267d['querySelectorAll']?.(".media-clip-menu")?.['forEach'](_0x5ab835 => _0x5ab835['remove']?.());
    this["_menuOpen"] && _0x34267d["appendChild"](this['_renderDownloadMenu']());
  }
  ["_renderTimelineTools"]() {
    const _0x37399f = document["createElement"]('div');
    _0x37399f["className"] = "media-clip-tools media-clip-compact-tools";
    const _0x5e1cea = iconButton("media-clip-tool media-clip-tool-crop", mediaClipText("tools.splitMaterial"), '<circle\x20cx=\x226\x22\x20cy=\x226\x22\x20r=\x223\x22/><path\x20d=\x22M8.12\x208.12\x2012\x2012\x22/><path\x20d=\x22M20\x204\x208.12\x2015.88\x22/><circle\x20cx=\x226\x22\x20cy=\x2218\x22\x20r=\x223\x22/><path\x20d=\x22M14.8\x2014.8\x2020\x2020\x22/>');
    const _0x4d66bd = document["createElement"]("span");
    _0x4d66bd['className'] = "media-clip-tool-kbd";
    _0x4d66bd["textContent"] = this["_getShortcutLabel"]('clip-tool-crop', 'C');
    _0x5e1cea["appendChild"](_0x4d66bd);
    _0x5e1cea["addEventListener"]('click', _0x16c1e1 => {
      stopPointer(_0x16c1e1);
      this['_splitActiveMaterial']();
    });
    const _0x2c902d = iconButton("media-clip-tool media-clip-tool-download", mediaClipText("tools.export"), "<path d=\"M12 3v12\"/><path d=\"m7 10 5 5 5-5\"/><path d=\"M5 21h14\"/>");
    _0x2c902d['classList']["toggle"]('is-active', this["_menuOpen"]);
    _0x2c902d["addEventListener"]("click", _0x5d759f => {
      stopPointer(_0x5d759f);
      this["_setDownloadMenuOpen"](!this['_menuOpen']);
    });
    _0x37399f["append"](_0x5e1cea, _0x2c902d);
    if (this["_menuOpen"]) {
      _0x37399f["appendChild"](this["_renderDownloadMenu"]());
    }
    return _0x37399f;
  }
  ["_renderTimelineHintCarousel"]() {
    const _0x44337a = document['createElement']('div');
    _0x44337a['className'] = 'media-clip-helper-row';
    const _0x12d65c = document['createElement']("div");
    _0x12d65c["className"] = "media-clip-helper-left";
    const _0x1e216a = [[["kbd", 'Space'], ["text", mediaClipText("hints.playPause")]], [["kbd", this["_getShortcutLabel"]("clip-tool-crop", 'C')], ["text", mediaClipText('hints.splitAtPlayhead')]], [["kbd", this['_getShortcutLabel']('delete', "Delete")], ['text', mediaClipText("hints.deleteCurrent")]], [["kbd", mediaClipText("hints.dragMaterial")], ["text", mediaClipText("hints.adjustOrder")]], [["kbd", mediaClipText('hints.dragEdges')], ["text", mediaClipText("hints.trimMaterial")]], [["kbd", mediaClipText("hints.rightClick")], ["text", mediaClipText("hints.exportOrDelete")]], [["text", mediaClipText("hints.connectButtonAdd")]], [['kbd', "Ctrl"], ["text", mediaClipText("hints.zoomTimeline")]]];
    _0x44337a["style"]["setProperty"]("--media-clip-helper-count", String(_0x1e216a["length"]));
    _0x1e216a["forEach"]((_0x2a58cc, _0x5de89d) => {
      const _0x419219 = document["createElement"]("div");
      _0x419219["className"] = 'media-clip-helper-msg';
      _0x419219["style"]["setProperty"]("--media-clip-helper-index", String(_0x5de89d));
      _0x2a58cc['forEach'](([_0x229277, _0x283e5e]) => {
        const _0x2373df = document["createElement"]("span");
        _0x2373df["className"] = _0x229277 === "kbd" ? "media-clip-helper-kbd" : "media-clip-helper-text";
        _0x2373df["textContent"] = _0x283e5e;
        _0x419219["appendChild"](_0x2373df);
      });
      _0x12d65c['appendChild'](_0x419219);
    });
    _0x44337a['appendChild'](_0x12d65c);
    return _0x44337a;
  }
  ['_getShortcutLabel'](_0x56d0a0, _0x19c379 = '') {
    const _0x4439f0 = getShortcuts()?.[_0x56d0a0]?.["keys"];
    return Array["isArray"](_0x4439f0) && _0x4439f0["length"] > 0x0 ? _0x4439f0["join"]('+') : _0x19c379;
  }
  ["_renderMaterialMenu"]() {
    return renderMediaClipMaterialMenu(this);
  }
  ["_renderPreviewPanel"]() {
    return a411_0xab38(this);
  }
  ["_previewLayoutTokens"]() {
    return a411_0x3ea9();
  }
  ['_previewVideoLayoutClasses'](_0x5a6930 = {}) {
    return a411_0x281258(_0x5a6930);
  }
  ['_syncPreviewPanelLayout'](_0x378a1a, _0x3c5ab6) {
    return a411_0x4752f7(this, _0x378a1a, _0x3c5ab6);
  }
  ["_applyPreviewVideoLayout"](_0xfaf629, _0x4b44a7 = {}) {
    return a411_0x55c8b4(this, _0xfaf629, _0x4b44a7);
  }
  ["_syncPreviewVideoLayoutFromElement"](_0x458f5c = this["_videoPreview"]) {
    return a411_0x2d1590(this, _0x458f5c);
  }
  ["_showPreviewImage"](_0x933eb1 = {}, _0x27615d = '') {
    return a411_0x49639d(this, _0x933eb1, _0x27615d);
  }
  ['_clearPreviewVideoFallback']() {
    return a411_0x3662d9(this);
  }
  ["_showPreviewVideo"](_0x101c4b = {}) {
    return a411_0x3781bb(this, _0x101c4b);
  }
  ["_ensurePreviewVideoElement"]() {
    return a411_0x1782b5(this);
  }
  ["_ensurePreviewImageElement"]() {
    return a411_0x29e4a8(this);
  }
  ["_ensurePreviewAudioElement"]() {
    return a411_0x507d25(this);
  }
  ["_renderPreviewControls"]() {
    return a411_0x540f14(this);
  }
  ["_renderPreview"]() {
    return a411_0x1e34c1(this);
  }
  ["_renderVideoFallback"](_0x426465 = '') {
    return a411_0x463e6c(_0x426465);
  }
  ['_estimateTimelineWidth'](_0xf38986 = {}) {
    const _0x1d569c = toNumber(_0xf38986["timelineWidthPx"], 0x0);
    if (_0x1d569c > 0x0) {
      return Math['max'](0xf0, _0x1d569c);
    }
    const _0x3c4416 = toNumber(this["nodeData"]?.["width"], MEDIA_CLIP_COMPACT_SIZE["width"]);
    const _0x42c6c0 = _0xf38986["compact"] === !![] ? 0x88 : 0x74;
    return Math['max'](0xf0, _0x3c4416 - _0x42c6c0);
  }
  ["_timelineViewportWidth"]() {
    const _0x37a327 = toNumber(this["nodeData"]?.["width"], MEDIA_CLIP_COMPACT_SIZE["width"]);
    return Math["max"](0xf0, _0x37a327 - 0x40);
  }
  ["_timelineZoom"](_0x17c19d = {}) {
    return normalizeMediaClipTimelineView({
      'zoom': _0x17c19d['timelineZoom'] ?? this["_timelineView"]?.["zoom"] ?? this["_mediaClip"]?.["timelineView"]?.['zoom']
    })["zoom"];
  }
  ['_timelineTrackContentWidth'](_0x1d773e = {}) {
    const _0x4ce976 = this["_timelineZoom"](_0x1d773e);
    const _0x2bdc0d = this['_primaryDuration']({
      'timelineZoom': _0x4ce976
    });
    return getMediaClipTimelineTrackWidthPx({
      'durationSec': _0x2bdc0d,
      'viewportWidthPx': this["_timelineViewportWidth"](),
      'zoom': _0x4ce976
    });
  }
  ["_timelineAxisWidthPx"]() {
    return this["_mediaClip"]['tracks']?.["audio"] ? MEDIA_CLIP_TIMELINE_AXIS_WIDTH_PX : 0x0;
  }
  ['_timelineMaterialEndSec']() {
    const _0xf8b9db = this["_mediaClip"]["tracks"]?.["video"];
    const _0x363a06 = this["_videoTimelineMaterialEnd"](_0xf8b9db);
    if (_0x363a06 > 0x0) {
      return _0x363a06;
    }
    const _0x17bcd1 = this["_mediaClip"]['tracks']?.["audio"];
    if (_0x17bcd1) {
      return this['_audioTimelineMaterialEnd'](_0x17bcd1);
    }
    return 0x0;
  }
  ["_timelineAddSlotLeftPx"](_0x53dc9d = this["_timelineTrackContentWidth"](), _0x1e7b44 = {}) {
    return getMediaClipTimelineAddSlotLeftPx({
      'trackWidthPx': _0x53dc9d,
      'displayDurationSec': _0x1e7b44["displayDurationSec"] ?? this["_primaryDuration"](),
      'materialEndSec': _0x1e7b44["materialEndSec"] ?? this["_timelineMaterialEndSec"]()
    });
  }
  ['_timelineContentWidth'](_0x2a28a6 = this['_timelineTrackContentWidth'](), _0xe23140 = {}) {
    return this["_timelineAxisWidthPx"]() + getMediaClipTimelineContentWidthPx({
      'trackWidthPx': _0x2a28a6,
      'displayDurationSec': _0xe23140['displayDurationSec'] ?? this["_primaryDuration"](),
      'materialEndSec': _0xe23140["materialEndSec"] ?? this["_timelineMaterialEndSec"]()
    });
  }
  ['_syncTimelineAddSlotPosition'](_0x25ce22 = this["_timelineTrackContentWidth"](), _0x3b8768 = {}) {
    const _0x1ee925 = Math['max'](0xf0, Math["ceil"](toNumber(_0x25ce22, 0x0)));
    const _0x3f701c = this["_timelineAddSlotLeftPx"](_0x1ee925, _0x3b8768);
    const _0x24ebc3 = this["_timelineContentWidth"](_0x1ee925, _0x3b8768);
    const _0xc94dc4 = this['el']?.["querySelector"]?.(".media-clip-compact-timeline");
    if (!_0xc94dc4) {
      return;
    }
    _0xc94dc4["style"]["setProperty"]("--media-clip-add-left", _0x3f701c + 'px');
    _0xc94dc4["style"]['setProperty']("--media-clip-timeline-content-width", _0x24ebc3 + 'px');
    _0xc94dc4["style"]["setProperty"]("--media-clip-track-axis-width", this["_timelineAxisWidthPx"]() + 'px');
    const _0x4d4384 = _0xc94dc4["querySelector"]?.(".media-clip-add-btn");
    if (_0x4d4384) {
      _0x4d4384["style"]["left"] = this["_timelineAxisWidthPx"]() + _0x3f701c + 'px';
    }
  }
  ['_syncTimelineAddSlotForRow'](_0x210281, _0x507145 = {}) {
    const _0x137ef4 = Math["max"](0xf0, readLayoutWidthPx(_0x210281, this["_timelineTrackContentWidth"]()));
    this["_syncTimelineCursorLayerForRow"](_0x210281);
    const _0x417071 = _0x507145["displayDurationSec"] ?? _0x507145['durationSec'];
    if (Number["isFinite"](toNumber(_0x417071, NaN))) {
      const _0x2b6457 = getMediaClipTimelineDisplayDuration(_0x417071);
      this["_setTimelineRowDuration"](_0x210281, _0x2b6457);
      this["_syncTimelineRulerTicks"](_0x137ef4, {
        ..._0x507145,
        'durationSec': _0x2b6457
      });
    }
    this['_syncTimelineAddSlotPosition'](_0x137ef4, _0x507145);
  }
  ["_syncTimelineContentWidth"](_0x4cd209 = this["_timelineTrackContentWidth"](), _0x3c4e95 = {}) {
    const _0x19a755 = Math['max'](0xf0, Math['ceil'](toNumber(_0x4cd209, 0x0)));
    const _0x3e1fda = this['el']?.["querySelector"]?.(".media-clip-compact-timeline");
    if (!_0x3e1fda) {
      return;
    }
    _0x3e1fda['style']["setProperty"]("--media-clip-track-content-width", _0x19a755 + 'px');
    _0x3e1fda["style"]['setProperty']('--media-clip-track-axis-width', this['_timelineAxisWidthPx']() + 'px');
    this["_syncTimelineAddSlotPosition"](_0x19a755, _0x3c4e95);
    this['el']?.["querySelectorAll"]?.(".media-clip-track, .media-clip-ruler")?.["forEach"](_0x3a25c0 => {
      _0x3a25c0["style"]["width"] = _0x19a755 + 'px';
    });
    this['_syncTimelineRulerTicks'](_0x19a755, _0x3c4e95);
    this["_syncTimelineScrollFade"](this['el']?.['querySelector']?.(".media-clip-timeline-scroll"));
  }
  ["_timelineRulerTicks"](_0x1ca8e3, _0x4060c6, _0x4be57f = {}) {
    const _0x30cec4 = getMediaClipTimelineDisplayDuration(_0x1ca8e3);
    return buildMediaClipTimelineTicks(_0x30cec4, _0x4060c6);
  }
  ["_populateTimelineRuler"](_0x437030, _0x5ca686, _0x5b39a5, _0x1753c3 = {}) {
    if (!_0x437030) {
      return;
    }
    const _0x1f046d = getMediaClipTimelineDisplayDuration(_0x5ca686);
    const _0x68e162 = this["_timelineRulerTicks"](_0x1f046d, _0x5b39a5, _0x1753c3);
    const _0x1020d2 = _0x1f046d + ':' + _0x68e162["join"](',');
    if (_0x437030["dataset"]?.['tickSignature'] === _0x1020d2) {
      return;
    }
    if (_0x437030["dataset"]) {
      _0x437030["dataset"]["tickSignature"] = _0x1020d2;
    }
    typeof _0x437030["replaceChildren"] === "function" ? _0x437030["replaceChildren"]() : _0x437030['textContent'] = '';
    _0x68e162["forEach"](_0x4c1118 => {
      const _0x2d5d5b = document['createElement']("span");
      _0x2d5d5b["className"] = 'media-clip-ruler-tick';
      _0x2d5d5b["textContent"] = formatTime(_0x4c1118);
      const _0x5badad = getMediaClipTimelinePercent(_0x4c1118, _0x1f046d);
      _0x2d5d5b['style']['left'] = _0x5badad + '%';
      _0x437030["appendChild"](_0x2d5d5b);
    });
  }
  ["_syncTimelineRulerTicks"](_0x50c5be = this["_timelineTrackContentWidth"](), _0x1ef0bd = {}) {
    const _0x1b51e2 = this['el']?.["querySelector"]?.('.media-clip-ruler');
    if (!_0x1b51e2) {
      return;
    }
    const _0x25e983 = _0x1ef0bd['durationSec'] ?? _0x1ef0bd['displayDurationSec'] ?? this['_primaryDuration']();
    this['_populateTimelineRuler'](_0x1b51e2, _0x25e983, _0x50c5be, _0x1ef0bd);
  }
  ["_renderRuler"](_0x122c60, _0x4abb60 = {}) {
    const _0x46586d = getMediaClipTimelineDisplayDuration(_0x122c60);
    const _0x1ecf2b = this["_estimateTimelineWidth"](_0x4abb60);
    const _0x108cd6 = document["createElement"]('div');
    _0x108cd6["className"] = 'media-clip-ruler';
    this["_populateTimelineRuler"](_0x108cd6, _0x46586d, _0x1ecf2b, _0x4abb60);
    return _0x108cd6;
  }
  ["_renderTimelineCursors"](_0x41f308 = this['_primaryDuration']()) {
    const _0x1dc142 = document['createElement']("div");
    _0x1dc142['className'] = "media-clip-timeline-cursors";
    _0x1dc142["setAttribute"]("aria-hidden", "true");
    const _0x3f58dc = document["createElement"]("div");
    _0x3f58dc["className"] = "media-clip-playhead media-clip-timeline-cursor media-clip-timeline-cursor-fixed";
    this['_applyTimelinePlayheadModel'](_0x3f58dc, getMediaClipTimelinePlayheadModel({
      'playheadSec': this["_playheadSec"],
      'durationSec': _0x41f308
    }));
    const _0x165fa8 = document["createElement"]("div");
    _0x165fa8['className'] = "media-clip-hover-playhead media-clip-timeline-cursor media-clip-timeline-cursor-hover";
    _0x165fa8["hidden"] = !![];
    _0x1dc142["append"](_0x3f58dc, _0x165fa8);
    return _0x1dc142;
  }
  ["_timelineCursorKind"]() {
    const _0xed2346 = normalizeText(this['_mediaClip']["activeTrack"]);
    if (_0xed2346 && this["_mediaClip"]['tracks']?.[_0xed2346]) {
      return _0xed2346;
    }
    if (this['_mediaClip']["tracks"]?.['video']) {
      return "video";
    }
    if (this['_mediaClip']["tracks"]?.["audio"]) {
      return "audio";
    }
    return '';
  }
  ["_timelineDurationForKind"](_0x428fb1 = this["_timelineCursorKind"](), _0x4686e9 = {}) {
    const _0xfb182d = this['_mediaClip']['tracks']?.[_0x428fb1];
    if (!_0xfb182d) {
      return this["_primaryDuration"](_0x4686e9);
    }
    if (_0x428fb1 === 'video') {
      return this["_videoTimelineDuration"](_0xfb182d, null, _0x4686e9);
    }
    if (_0x428fb1 === "audio") {
      const _0x1c3d20 = this["_mediaClip"]["tracks"]?.["video"];
      return _0x1c3d20 ? this["_videoTimelineDuration"](_0x1c3d20, null, _0x4686e9) : this["_audioTimelineDuration"](_0xfb182d, null, _0x4686e9);
    }
    return getTrackDuration(_0xfb182d);
  }
  ["_timelinePointerContext"](_0x18760a, _0x14da6e = null) {
    const _0xaa5d76 = _0x14da6e?.["closest"]?.(".media-clip-track:not(.is-compact)");
    const _0x25a9d1 = _0xaa5d76?.["classList"]?.["contains"]("media-clip-track-audio") ? 'audio' : _0xaa5d76?.["classList"]?.["contains"]("media-clip-track-video") ? 'video' : '';
    const _0x56d9a2 = _0x25a9d1 || this["_timelineCursorKind"]();
    if (!_0x56d9a2) {
      return null;
    }
    const _0x119d1e = _0x25a9d1 ? _0xaa5d76 : _0x18760a?.['querySelector']?.(".media-clip-track-" + _0x56d9a2 + ":not(.is-compact)");
    if (!_0x119d1e) {
      return null;
    }
    const _0x450821 = this["_timelineDurationForKind"](_0x56d9a2);
    return {
      'kind': _0x56d9a2,
      'row': _0x119d1e,
      'duration': this["_timelineRowDuration"](_0x119d1e, _0x450821)
    };
  }
  ["_isTimelineControlTarget"](_0x247cd2) {
    return !!_0x247cd2?.["closest"]?.('.media-clip-pick-btn,\x20.media-clip-tool,\x20.media-clip-menu,\x20.media-clip-material-menu,\x20.media-clip-menu-item,\x20.media-clip-audio-lane-mute-btn,\x20.media-clip-trim');
  }
  ["_timelineEventSegment"](_0x111f50) {
    return _0x111f50?.["closest"]?.('.media-clip-segment') || null;
  }
  ["_openMaterialMenu"](_0x46e9ab, _0x3f27f6, _0x116189) {
    if (!_0x46e9ab || !_0x116189) {
      return;
    }
    _0x116189["preventDefault"]?.();
    _0x116189["stopPropagation"]?.();
    const _0x323cdb = this["_materialMenuHost"]();
    const _0x1d5acc = this["_materialMenuLocalPoint"](_0x116189["clientX"], _0x116189["clientY"], _0x323cdb);
    this["_menuOpen"] = ![];
    this["_materialMenu"] = {
      'kind': _0x46e9ab,
      'clipIndex': Math['max'](0x0, Math["trunc"](toNumber(_0x3f27f6, 0x0))),
      'x': _0x1d5acc['x'],
      'y': _0x1d5acc['y']
    };
    this["_syncMaterialMenuDismissListener"](!![]);
    this["_removeMaterialMenuPortal"]();
    this["_renderMaterialMenuPortal"]();
  }
  ["_bindTimelinePointerCursors"](_0x4e0159, _0x426608) {
    if (!_0x4e0159 || !_0x426608) {
      return;
    }
    _0x4e0159["addEventListener"]("pointermove", _0x5ba6c4 => {
      if (this["_timelineDrag"]() || this["_isTimelineControlTarget"](_0x5ba6c4["target"])) {
        return;
      }
      const _0x256a5a = this["_timelinePointerContext"](_0x426608, _0x5ba6c4["target"]);
      if (!_0x256a5a) {
        return;
      }
      const _0x50a46f = this['_timelineSecFromPointerEvent'](_0x256a5a["row"], _0x5ba6c4, _0x256a5a["duration"]);
      this["_timelineEventSegment"](_0x5ba6c4["target"]) ? this["_previewTrackPlayhead"](_0x256a5a["row"], _0x256a5a['kind'], _0x50a46f, _0x256a5a["duration"]) : this["_updateTimelineHoverPlayheadVisual"](_0x256a5a["row"], _0x256a5a["duration"], {
        'playheadSec': _0x50a46f
      });
    });
    _0x4e0159['addEventListener']('pointerdown', _0x1a1be0 => {
      if (_0x1a1be0["button"] !== 0x0 || this["_timelineDrag"]() || this["_isTimelineControlTarget"](_0x1a1be0["target"])) {
        return;
      }
      if (this["_timelineEventSegment"](_0x1a1be0['target'])) {
        return;
      }
      const _0x2e5807 = this["_timelinePointerContext"](_0x426608, _0x1a1be0['target']);
      if (!_0x2e5807) {
        return;
      }
      this['_setTimelinePlayheadFromPointer'](_0x2e5807['row'], _0x2e5807["kind"], _0x1a1be0, _0x2e5807["duration"], {
        'updateActiveTrack': ![],
        'updateClipSelection': ![],
        'selectClip': ![],
        'syncPreview': ![]
      });
    });
    _0x4e0159['addEventListener']("pointerleave", () => {
      if (this["_timelineDrag"]()) {
        return;
      }
      this["_hideTimelineHoverPlayhead"](_0x4e0159);
      this['_restoreTimelinePlayheads']();
    });
    _0x4e0159["addEventListener"]('click', _0x412c50 => {
      if (this['_timelineDrag']() || this["_isTimelineControlTarget"](_0x412c50["target"])) {
        return;
      }
      if (!this['_timelineEventSegment'](_0x412c50["target"])) {
        return;
      }
      const _0x1db21a = this["_timelinePointerContext"](_0x426608, _0x412c50["target"]);
      if (!_0x1db21a) {
        return;
      }
      const _0x25066f = this["_timelineSecFromPointerEvent"](_0x1db21a["row"], _0x412c50, _0x1db21a["duration"]);
      const _0x577c5a = _0x1db21a["kind"] === "video" ? this["_setActiveClipIndex"](this["_clipIndexAtTimelineSec"](_0x25066f)) : _0x1db21a["kind"] === "audio" ? this["_setActiveAudioClipIndex"](this["_audioClipIndexAtTimelineSec"](_0x25066f)) : ![];
      if (_0x1db21a["kind"] === "audio") {
        this["_selectAudioClipIndex"](this['_activeAudioClipIndex']);
      }
      this["_setActiveTrack"](_0x1db21a["kind"], _0x25066f, {
        'forceRender': _0x577c5a
      });
    });
  }
  ['_videoSources']() {
    const _0x379620 = Array['isArray'](this["_sources"]?.["videos"]) ? this["_sources"]["videos"] : [];
    if (_0x379620["length"]) {
      return _0x379620;
    }
    return this["_sources"]?.['video'] ? [this["_sources"]["video"]] : [];
  }
  ["_firstVideoSource"]() {
    return this['_videoSources']()["find"](_0x3e8269 => getMediaClipInputKind(_0x3e8269) === "video") || null;
  }
  ['_videoClipSource'](_0x50fb11 = {}, _0x51091f = 0x0) {
    const _0x35d803 = this["_videoSources"]();
    const _0x220285 = normalizeText(_0x50fb11['sourceId']);
    const _0xa7660d = normalizeText(_0x50fb11["sourceKey"]);
    return _0x35d803["find"](_0x57438b => normalizeText(_0x57438b?.['id']) === _0x220285) || _0x35d803["find"](_0x22da0d => normalizeText(_0x22da0d?.["__mediaClipEdgeId"]) === normalizeText(_0x50fb11['id'])) || _0x35d803["find"](_0x477c6c => normalizeText(resolveMediaClipSourceKey(_0x477c6c)) === _0xa7660d) || _0x35d803[_0x51091f] || this["_sources"]?.['video'] || null;
  }
  ['_audioSources']() {
    const _0x4f0251 = Array['isArray'](this['_sources']?.["audios"]) ? this["_sources"]["audios"] : [];
    if (_0x4f0251["length"]) {
      return _0x4f0251;
    }
    return this["_sources"]?.["audio"] ? [this["_sources"]["audio"]] : [];
  }
  ["_audioClipSource"](_0x1aeefa = {}, _0x25e85e = 0x0) {
    const _0x157ea2 = this["_audioSources"]();
    const _0x2bff2e = normalizeText(_0x1aeefa['sourceId']);
    const _0x11cf2f = normalizeText(_0x1aeefa['sourceKey']);
    return _0x157ea2["find"](_0x44ff62 => normalizeText(_0x44ff62?.['id']) === _0x2bff2e) || _0x157ea2["find"](_0x2ae59e => normalizeText(_0x2ae59e?.["__mediaClipEdgeId"]) === normalizeText(_0x1aeefa['id'])) || _0x157ea2["find"](_0x6403a0 => normalizeText(resolveMediaClipSourceKey(_0x6403a0)) === _0x11cf2f) || _0x157ea2[_0x25e85e] || this["_sources"]?.["audio"] || null;
  }
  ['_videoTimelineClips'](_0x31fc78 = null) {
    const _0x35c7ab = Array["isArray"](this['_mediaClip']?.["clips"]) ? this["_mediaClip"]["clips"] : [];
    if (_0x35c7ab["length"]) {
      return _0x35c7ab;
    }
    if (!_0x31fc78) {
      return [];
    }
    return [{
      'id': "video:0",
      'sourceKey': _0x31fc78["sourceKey"],
      'startSec': _0x31fc78["startSec"],
      'endSec': _0x31fc78["endSec"],
      'durationSec': _0x31fc78['durationSec'],
      'timelineStartSec': _0x31fc78["startSec"],
      'timelineEndSec': _0x31fc78["endSec"]
    }];
  }
  ["_audioTimelineClips"](_0x5a00b8 = null) {
    const _0x58075b = Array["isArray"](this['_mediaClip']?.["audioClips"]) ? this["_mediaClip"]["audioClips"] : [];
    if (_0x58075b['length']) {
      return _0x58075b;
    }
    if (!_0x5a00b8) {
      return [];
    }
    const _0x5bf842 = toNumber(_0x5a00b8['startSec'], 0x0);
    const _0x309a56 = Math['max'](_0x5bf842, toNumber(_0x5a00b8["endSec"], _0x5bf842));
    return [{
      'id': "audio:0",
      'kind': "audio",
      'sourceKey': _0x5a00b8["sourceKey"],
      'startSec': _0x5bf842,
      'endSec': _0x309a56,
      'durationSec': _0x5a00b8['durationSec'],
      'timelineStartSec': _0x5bf842,
      'timelineEndSec': _0x309a56,
      'laneIndex': 0x0,
      'muted': ![],
      'disabled': ![]
    }];
  }
  ['_timelineDurationForZoom'](_0x41663e = 0x0, _0x3fd3db = {}) {
    const _0x5d97ff = getMediaClipTimelineDisplayDuration(_0x41663e);
    const _0x14fe48 = Math["max"](_0x5d97ff, _0x5d97ff * TIMELINE_ZOOM_OUT_DISPLAY_MULTIPLIER);
    if (_0x14fe48 <= _0x5d97ff) {
      return _0x5d97ff;
    }
    const _0x3247ac = this["_timelineZoom"](_0x3fd3db);
    if (_0x3247ac >= 0x1) {
      return _0x5d97ff;
    }
    const _0x1032ad = Math["max"](0.001, 0x1 - MEDIA_CLIP_TIMELINE_ZOOM_MIN);
    const _0xe9fdb = Math["max"](0x0, Math["min"](0x1, (0x1 - _0x3247ac) / _0x1032ad));
    return Math["round"]((_0x5d97ff + (_0x14fe48 - _0x5d97ff) * _0xe9fdb) * 0x3e8) / 0x3e8;
  }
  ["_videoTimelineBaseDuration"](_0x3c3cc8 = null, _0x969ca3 = null) {
    const _0x468bf8 = Array["isArray"](_0x969ca3) ? _0x969ca3 : this["_videoTimelineClips"](_0x3c3cc8);
    const _0x39d806 = this["_videoTimelineMaterialEnd"](_0x3c3cc8, _0x468bf8);
    const _0x1350c8 = _0x468bf8["reduce"]((_0x3988fd, _0x49cc7e) => Math["min"](_0x3988fd, toNumber(_0x49cc7e?.["timelineStartSec"], 0x0)), 0x0);
    const _0x18a32d = _0x1350c8 < 0x0 ? Math["max"](0x0, _0x39d806 - _0x1350c8) : _0x39d806;
    if (_0x468bf8["length"]) {
      const _0x2a7376 = _0x468bf8["length"] === 0x1 ? Math["max"](toNumber(_0x468bf8[0x0]?.["durationSec"], 0x0), toNumber(_0x3c3cc8?.["durationSec"], 0x0)) : 0x0;
      return getMediaClipTimelineDisplayDuration(Math['max'](_0x39d806, _0x18a32d, _0x2a7376));
    }
    return getMediaClipTimelineDisplayDuration(Math["max"](toNumber(_0x3c3cc8?.["durationSec"], 0x0), getTrackDuration(_0x3c3cc8)));
  }
  ["_videoTimelineDuration"](_0x2b3c17 = null, _0x350c39 = null, _0x45aa75 = {}) {
    return this["_timelineDurationForZoom"](this["_videoTimelineBaseDuration"](_0x2b3c17, _0x350c39), _0x45aa75);
  }
  ["_timelineSegmentVisualDurationSec"](_0x5549ca = null, _0x88b7ab = null) {
    if (!_0x5549ca || !_0x88b7ab) {
      return 0x0;
    }
    const _0x1a8701 = Math["max"](0x0, toNumber(_0x88b7ab["timelineStartSec"], 0x0));
    const _0x3781fa = Math['max'](_0x1a8701, toNumber(_0x88b7ab["timelineEndSec"], _0x1a8701));
    const _0x47878a = Math["max"](0x0, _0x3781fa - _0x1a8701);
    const _0x3c2092 = parsePercentValue(_0x5549ca?.["style"]?.["left"]);
    const _0x1f2658 = parsePercentValue(_0x5549ca?.['style']?.['width']);
    const _0x539098 = parsePercentValue(_0x5549ca?.["style"]?.["right"]);
    const _0x43c48e = Number["isFinite"](_0x1f2658) && _0x1f2658 > 0x0 ? _0x1f2658 : Number["isFinite"](_0x3c2092) && Number['isFinite'](_0x539098) ? Math["max"](0x0, 0x64 - _0x3c2092 - _0x539098) : NaN;
    const _0x3591d5 = [];
    Number["isFinite"](_0x3c2092) && _0x3c2092 > 0x0 && _0x1a8701 > 0x0 && _0x3591d5["push"](_0x1a8701 / (_0x3c2092 / 0x64));
    Number['isFinite'](_0x43c48e) && _0x43c48e > 0x0 && _0x47878a > 0x0 && _0x3591d5["push"](_0x47878a / (_0x43c48e / 0x64));
    Number["isFinite"](_0x3c2092) && Number["isFinite"](_0x43c48e) && _0x3c2092 + _0x43c48e > 0x0 && _0x3781fa > 0x0 && _0x3591d5["push"](_0x3781fa / ((_0x3c2092 + _0x43c48e) / 0x64));
    return Math["max"](0x0, ..._0x3591d5["filter"](_0x569544 => Number['isFinite'](_0x569544) && _0x569544 > 0x0));
  }
  ["_setTimelineRowDuration"](_0x324a33 = null, _0x1cc07b = 0x0) {
    if (!_0x324a33?.["dataset"]) {
      return;
    }
    _0x324a33['dataset']["timelineDurationSec"] = String(getMediaClipTimelineDisplayDuration(_0x1cc07b));
  }
  ['_timelineRowDuration'](_0x434544 = null, _0x3a61fe = 0x0) {
    const _0x1aec2d = toNumber(_0x434544?.["dataset"]?.['timelineDurationSec'], NaN);
    if (Number["isFinite"](_0x1aec2d) && _0x1aec2d > 0x0) {
      return getMediaClipTimelineDisplayDuration(_0x1aec2d);
    }
    return getMediaClipTimelineDisplayDuration(_0x3a61fe);
  }
  ["_resolveTimelineDragDuration"](_0x352ffb, _0x472ddb = null, _0x18df77 = null, _0x14f1cc = null, _0x1d47f7 = 0x0) {
    if (_0x352ffb === "audio") {
      const _0x5594c6 = Array["isArray"](_0x18df77) ? _0x18df77 : this["_audioTimelineClips"](_0x472ddb);
      const _0xec0726 = this["_timelineDurationForKind"]('audio');
      const _0x593966 = _0x14f1cc?.["closest"]?.(".media-clip-track") || null;
      return this["_timelineRowDuration"](_0x593966, _0xec0726);
    }
    if (_0x352ffb !== "video") {
      return getTrackDuration(_0x472ddb);
    }
    const _0x3f1f7f = Array["isArray"](_0x18df77) ? _0x18df77 : this["_videoTimelineClips"](_0x472ddb);
    const _0x139f86 = this['_videoTimelineDuration'](_0x472ddb, _0x3f1f7f);
    const _0x1ca1dc = _0x14f1cc?.["closest"]?.(".media-clip-track") || null;
    return this["_timelineRowDuration"](_0x1ca1dc, _0x139f86);
  }
  ['_videoTimelineMaterialEnd'](_0x548028 = null, _0x135cc8 = null) {
    const _0x249505 = Array['isArray'](_0x135cc8) ? _0x135cc8 : this["_videoTimelineClips"](_0x548028);
    if (_0x249505["length"]) {
      return _0x249505["reduce"]((_0x2cb49c, _0x4d0ccd) => Math['max'](_0x2cb49c, toNumber(_0x4d0ccd['timelineEndSec'], 0x0)), 0x0);
    }
    return Math["max"](0x0, toNumber(_0x548028?.['endSec'] || _0x548028?.["durationSec"], 0x0));
  }
  ["_audioTimelineMaterialEnd"](_0x14ff15 = null, _0x14dd03 = null) {
    const _0xb95861 = Array["isArray"](_0x14dd03) ? _0x14dd03 : this["_audioTimelineClips"](_0x14ff15);
    if (_0xb95861['length']) {
      return _0xb95861["reduce"]((_0xf335dc, _0x509fd7) => Math["max"](_0xf335dc, toNumber(_0x509fd7["timelineEndSec"], 0x0)), 0x0);
    }
    return Math["max"](0x0, toNumber(_0x14ff15?.["endSec"] || _0x14ff15?.["durationSec"], 0x0));
  }
  ["_audioTimelineDuration"](_0x107881 = null, _0x2a4eeb = null, _0x4db9e4 = {}) {
    const _0x3fefd3 = Array["isArray"](_0x2a4eeb) ? _0x2a4eeb : this["_audioTimelineClips"](_0x107881);
    const _0x41869f = this['_audioTimelineMaterialEnd'](_0x107881, _0x3fefd3);
    const _0x2f016b = _0x3fefd3["length"] === 0x1 ? Math["max"](toNumber(_0x3fefd3[0x0]?.['durationSec'], 0x0), toNumber(_0x107881?.["durationSec"], 0x0)) : toNumber(_0x107881?.["durationSec"], 0x0);
    return this["_timelineDurationForZoom"](Math["max"](_0x41869f, _0x2f016b), _0x4db9e4);
  }
  ['_clampVideoClipIndex'](_0x5d3306 = this['_activeClipIndex']) {
    const _0x5b6813 = Math["max"](0x0, this["_videoTimelineClips"](this["_mediaClip"]["tracks"]?.['video'])["length"]);
    const _0x563144 = Math["max"](0x0, _0x5b6813 - 0x1);
    return Math["max"](0x0, Math["min"](_0x563144, Math["trunc"](toNumber(_0x5d3306, 0x0))));
  }
  ["_clampAudioClipIndex"](_0x5b80d8 = this["_activeAudioClipIndex"]) {
    const _0xbe399c = Math["max"](0x0, this["_audioTimelineClips"](this["_mediaClip"]['tracks']?.["audio"])['length']);
    const _0x388b05 = Math["max"](0x0, _0xbe399c - 0x1);
    return Math["max"](0x0, Math["min"](_0x388b05, Math['trunc'](toNumber(_0x5b80d8, 0x0))));
  }
  ["_clipIndexAtTimelineSec"](_0x93407b, _0x1b9aa9 = this["_videoTimelineClips"](this["_mediaClip"]['tracks']?.['video'])) {
    const _0x3a162b = Array["isArray"](_0x1b9aa9) ? _0x1b9aa9 : [];
    if (!_0x3a162b["length"]) {
      return 0x0;
    }
    const _0x463683 = toNumber(_0x93407b, 0x0);
    const _0x2ff3fd = _0x3a162b["findIndex"]((_0x234b13, _0x4affa0) => {
      const _0x275d5d = toNumber(_0x234b13['timelineStartSec'], 0x0);
      const _0x439625 = Math["max"](_0x275d5d, toNumber(_0x234b13["timelineEndSec"], _0x275d5d));
      return _0x4affa0 === _0x3a162b["length"] - 0x1 ? _0x463683 >= _0x275d5d && _0x463683 <= _0x439625 : _0x463683 >= _0x275d5d && _0x463683 < _0x439625;
    });
    if (_0x2ff3fd >= 0x0) {
      return _0x2ff3fd;
    }
    let _0x45e7f9 = 0x0;
    let _0x5b2a4c = Number['POSITIVE_INFINITY'];
    _0x3a162b['forEach']((_0x294fd8, _0x589298) => {
      const _0xf73eb7 = toNumber(_0x294fd8["timelineStartSec"], 0x0);
      const _0xede391 = Math["max"](_0xf73eb7, toNumber(_0x294fd8["timelineEndSec"], _0xf73eb7));
      const _0x185271 = _0x463683 < _0xf73eb7 ? _0xf73eb7 - _0x463683 : _0x463683 - _0xede391;
      _0x185271 < _0x5b2a4c && (_0x45e7f9 = _0x589298, _0x5b2a4c = _0x185271);
    });
    return _0x45e7f9;
  }
  ["_audioClipIndexAtTimelineSec"](_0x1d315b, _0x2ef271 = this["_audioTimelineClips"](this["_mediaClip"]['tracks']?.["audio"])) {
    const _0x268f2a = Array['isArray'](_0x2ef271) ? _0x2ef271 : [];
    if (!_0x268f2a["length"]) {
      return 0x0;
    }
    const _0x1bafc0 = toNumber(_0x1d315b, 0x0);
    const _0x215919 = _0x268f2a['findIndex']((_0x2e83df, _0x137783) => {
      const _0x2702d4 = toNumber(_0x2e83df["timelineStartSec"], 0x0);
      const _0x11cc72 = Math["max"](_0x2702d4, toNumber(_0x2e83df["timelineEndSec"], _0x2702d4));
      return _0x137783 === _0x268f2a["length"] - 0x1 ? _0x1bafc0 >= _0x2702d4 && _0x1bafc0 <= _0x11cc72 : _0x1bafc0 >= _0x2702d4 && _0x1bafc0 < _0x11cc72;
    });
    if (_0x215919 >= 0x0) {
      return _0x215919;
    }
    let _0x4e0f19 = 0x0;
    let _0x497342 = Number["POSITIVE_INFINITY"];
    _0x268f2a["forEach"]((_0x2e0717, _0x53ec94) => {
      const _0x36b9d9 = toNumber(_0x2e0717["timelineStartSec"], 0x0);
      const _0x5d2218 = Math["max"](_0x36b9d9, toNumber(_0x2e0717['timelineEndSec'], _0x36b9d9));
      const _0x30fdaf = _0x1bafc0 < _0x36b9d9 ? _0x36b9d9 - _0x1bafc0 : _0x1bafc0 - _0x5d2218;
      _0x30fdaf < _0x497342 && (_0x4e0f19 = _0x53ec94, _0x497342 = _0x30fdaf);
    });
    return _0x4e0f19;
  }
  ['_setActiveClipIndex'](_0x1484c8 = this['_activeClipIndex']) {
    const _0x11032b = this['_clampVideoClipIndex'](_0x1484c8);
    const _0x10cded = _0x11032b !== this["_activeClipIndex"];
    this["_activeClipIndex"] = _0x11032b;
    return _0x10cded;
  }
  ["_setActiveAudioClipIndex"](_0x254825 = this['_activeAudioClipIndex']) {
    const _0x404728 = this["_clampAudioClipIndex"](_0x254825);
    const _0x4799a7 = _0x404728 !== this["_activeAudioClipIndex"];
    this["_activeAudioClipIndex"] = _0x404728;
    return _0x4799a7;
  }
  ['_clampSelectedClipIndex'](_0x55fd47 = this["_selectedClipIndex"]) {
    const _0x53b236 = Math['max'](0x0, this['_videoTimelineClips'](this["_mediaClip"]['tracks']?.['video'])["length"]);
    const _0x5b777f = Math["trunc"](toNumber(_0x55fd47, -0x1));
    return _0x5b777f >= 0x0 && _0x5b777f < _0x53b236 ? _0x5b777f : -0x1;
  }
  ["_clampSelectedAudioClipIndex"](_0xd451ee = this["_selectedAudioClipIndex"]) {
    const _0x5c8e1b = Math['max'](0x0, this['_audioTimelineClips'](this["_mediaClip"]["tracks"]?.["audio"])['length']);
    const _0x58ddb0 = Math["trunc"](toNumber(_0xd451ee, -0x1));
    return _0x58ddb0 >= 0x0 && _0x58ddb0 < _0x5c8e1b ? _0x58ddb0 : -0x1;
  }
  ["_selectClipIndex"](_0x1688a5 = this["_activeClipIndex"]) {
    const _0x1faa61 = this["_clampVideoClipIndex"](_0x1688a5);
    const _0x444fc0 = _0x1faa61 !== this['_selectedClipIndex'];
    this["_selectedClipIndex"] = _0x1faa61;
    return _0x444fc0;
  }
  ["_selectAudioClipIndex"](_0x1f23d7 = this["_activeAudioClipIndex"]) {
    const _0x3babfe = this["_clampAudioClipIndex"](_0x1f23d7);
    const _0x446885 = _0x3babfe !== this["_selectedAudioClipIndex"];
    this["_selectedAudioClipIndex"] = _0x3babfe;
    return _0x446885;
  }
  ['_patchAudioClipState'](_0x34faec = this['_activeAudioClipIndex'], _0x55553b = {}) {
    const _0x4db927 = Math['max'](0x0, Math['trunc'](toNumber(_0x34faec, 0x0)));
    const _0x6feca1 = this["_audioTimelineClips"](this["_mediaClip"]["tracks"]?.['audio']);
    const _0xbd1fad = _0x6feca1[_0x4db927];
    if (!_0xbd1fad) {
      return ![];
    }
    this['_mediaClip'] = patchMediaClipAudioClipState(this["_mediaClip"], _0x4db927, _0x55553b);
    this["_setActiveAudioClipIndex"](_0x4db927);
    this["_selectAudioClipIndex"](_0x4db927);
    this["nodeData"] = {
      ...(this["nodeData"] || {}),
      'mediaClip': this["_mediaClip"]
    };
    a411_0x3bf9e9["updateNodeData"](this['id'], {
      'mediaClip': this["_mediaClip"]
    });
    commit();
    this["_refreshMediaClipTimelineInPlace"]();
    return !![];
  }
  ["_toggleAudioClipMuted"](_0x4e6ed5 = this["_activeAudioClipIndex"]) {
    const _0x33689d = Math["max"](0x0, Math["trunc"](toNumber(_0x4e6ed5, 0x0)));
    const _0x3fe390 = this["_audioTimelineClips"](this["_mediaClip"]["tracks"]?.['audio'])[_0x33689d];
    if (!_0x3fe390) {
      return ![];
    }
    return this['_patchAudioClipState'](_0x33689d, {
      'muted': _0x3fe390['muted'] !== !![]
    });
  }
  ["_audioClipsForLane"](_0x476fdd = 0x0, _0x5cc056 = this["_audioTimelineClips"](this["_mediaClip"]["tracks"]?.["audio"])) {
    const _0x5cc44f = normalizeMediaClipAudioLaneIndex(_0x476fdd);
    const _0x4dc4c6 = Array['isArray'](_0x5cc056) ? _0x5cc056 : [];
    return _0x4dc4c6["filter"](_0x1c3a22 => this['_audioClipLaneIndex'](_0x1c3a22) === _0x5cc44f);
  }
  ["_isAudioLaneMuted"](_0x1d6e72 = 0x0, _0x376747 = this["_audioTimelineClips"](this["_mediaClip"]["tracks"]?.["audio"])) {
    const _0xb865b9 = this["_audioClipsForLane"](_0x1d6e72, _0x376747);
    return _0xb865b9["length"] > 0x0 && _0xb865b9["every"](_0x595586 => _0x595586?.["muted"] === !![]);
  }
  ["_toggleAudioLaneMuted"](_0x2aa77b = 0x0) {
    const _0x14caa7 = normalizeMediaClipAudioLaneIndex(_0x2aa77b);
    const _0x1b653a = this["_audioTimelineClips"](this['_mediaClip']["tracks"]?.['audio']);
    const _0x1f4e5f = this["_audioClipsForLane"](_0x14caa7, _0x1b653a);
    if (!_0x1f4e5f["length"]) {
      return ![];
    }
    const _0x2992cb = !this["_isAudioLaneMuted"](_0x14caa7, _0x1b653a);
    this["_mediaClip"] = patchMediaClipAudioLaneMuted(this["_mediaClip"], _0x14caa7, _0x2992cb);
    const _0x2d376a = Math["max"](0x0, this["_mediaClip"]["audioClips"]?.["findIndex"]?.(_0xc48bab => this["_audioClipLaneIndex"](_0xc48bab) === _0x14caa7) ?? 0x0);
    this["_setActiveAudioClipIndex"](_0x2d376a);
    this["_selectAudioClipIndex"](_0x2d376a);
    this["nodeData"] = {
      ...(this['nodeData'] || {}),
      'mediaClip': this["_mediaClip"]
    };
    a411_0x3bf9e9["updateNodeData"](this['id'], {
      'mediaClip': this["_mediaClip"]
    });
    commit();
    this["_refreshMediaClipTimelineInPlace"]();
    return !![];
  }
  ["_toggleAudioClipDisabled"](_0x206e84 = this['_activeAudioClipIndex']) {
    const _0x48eea2 = Math['max'](0x0, Math["trunc"](toNumber(_0x206e84, 0x0)));
    const _0x1d187c = this["_audioTimelineClips"](this["_mediaClip"]["tracks"]?.["audio"])[_0x48eea2];
    if (!_0x1d187c) {
      return ![];
    }
    return this["_patchAudioClipState"](_0x48eea2, {
      'disabled': _0x1d187c["disabled"] !== !![]
    });
  }
  ["_segmentClipIndex"](_0x4a514d, _0xf7c0 = "video", _0x5d2554 = null) {
    const _0x47d7ff = normalizeText(_0x4a514d?.["dataset"]?.["clipId"]);
    if (_0x47d7ff) {
      const _0x23e68b = Array['isArray'](_0x5d2554) ? _0x5d2554 : _0xf7c0 === "audio" ? this["_mediaClip"]['audioClips'] || [] : this["_mediaClip"]["clips"] || [];
      const _0x1ecf6d = _0x23e68b["findIndex"](_0xfc23e6 => normalizeText(_0xfc23e6?.['id']) === _0x47d7ff);
      if (_0x1ecf6d >= 0x0) {
        return _0x1ecf6d;
      }
    }
    return Math["max"](0x0, Math["trunc"](toNumber(_0x4a514d?.["dataset"]?.["clipIndex"], 0x0)));
  }
  ["_timelineRowForDrag"](_0x4f0686 = this['_timelineDrag']()) {
    if (_0x4f0686?.["rowEl"]) {
      return _0x4f0686['rowEl'];
    }
    const _0x1ac522 = normalizeText(_0x4f0686?.["kind"]);
    if (!_0x1ac522) {
      return null;
    }
    return this['el']?.["querySelector"]?.(".media-clip-track-" + _0x1ac522 + ":not(.is-compact)") || this['el']?.["querySelector"]?.(".media-clip-track-" + _0x1ac522) || null;
  }
  ["_videoSourceSecForTimelineSec"](_0x1283d1 = this["_playheadSec"], _0x47e040 = null) {
    const _0xcddbd0 = Array["isArray"](_0x47e040) ? _0x47e040 : this['_videoTimelineClips'](this["_mediaClip"]["tracks"]?.["video"]);
    if (!_0xcddbd0["length"]) {
      return _0x1283d1;
    }
    const _0x112a3d = toNumber(_0x1283d1, 0x0);
    if (_0xcddbd0["length"] === 0x1) {
      const _0x153e36 = _0xcddbd0[0x0];
      const _0x2e08a3 = toNumber(_0x153e36["startSec"], 0x0);
      const _0xa7c427 = toNumber(_0x153e36["endSec"], _0x2e08a3);
      const _0x4afabd = toNumber(_0x153e36["timelineStartSec"], 0x0);
      const _0x2a579b = toNumber(_0x153e36["timelineEndSec"], _0x4afabd);
      if (_0x112a3d >= _0x4afabd && _0x112a3d <= _0x2a579b) {
        return _0x2e08a3 + (_0x112a3d - _0x4afabd);
      }
      return Math["max"](_0x2e08a3, Math['min'](_0xa7c427, _0x112a3d));
    }
    const _0x19e102 = _0xcddbd0[this['_clipIndexAtTimelineSec'](_0x112a3d, _0xcddbd0)] || _0xcddbd0[_0xcddbd0["length"] - 0x1];
    const _0x4c07e4 = toNumber(_0x19e102["timelineStartSec"], 0x0);
    const _0x31e19e = toNumber(_0x19e102["startSec"], 0x0);
    const _0x56bc52 = toNumber(_0x19e102['endSec'], _0x31e19e);
    return Math["max"](_0x31e19e, Math['min'](_0x56bc52, _0x31e19e + (_0x112a3d - _0x4c07e4)));
  }
  ['_videoSourceSecForPlayhead'](_0x353f84 = this["_playheadSec"]) {
    return this["_videoSourceSecForTimelineSec"](_0x353f84);
  }
  ["_audioSourceSecForPlayhead"](_0x234818 = this["_playheadSec"]) {
    const _0xf08f9f = this["_audioTimelineClips"](this["_mediaClip"]['tracks']?.["audio"]);
    if (!_0xf08f9f["length"]) {
      return _0x234818;
    }
    const _0xff80 = toNumber(_0x234818, 0x0);
    const _0x7a1270 = _0xf08f9f[this["_audioClipIndexAtTimelineSec"](_0xff80, _0xf08f9f)] || _0xf08f9f[_0xf08f9f['length'] - 0x1];
    const _0x40da1b = toNumber(_0x7a1270['timelineStartSec'], 0x0);
    const _0x5f1904 = toNumber(_0x7a1270["startSec"], 0x0);
    const _0x34cd78 = toNumber(_0x7a1270['endSec'], _0x5f1904);
    return Math["max"](_0x5f1904, Math["min"](_0x34cd78, _0x5f1904 + (_0xff80 - _0x40da1b)));
  }
  ['_audioClipSourceSec'](_0xebcca6 = {}, _0x200c4d = this["_playheadSec"]) {
    const _0x140c77 = toNumber(_0xebcca6["timelineStartSec"], 0x0);
    const _0x12af27 = toNumber(_0xebcca6["startSec"], 0x0);
    const _0x5a9074 = toNumber(_0xebcca6["endSec"], _0x12af27);
    return Math["max"](_0x12af27, Math["min"](_0x5a9074, _0x12af27 + (toNumber(_0x200c4d, 0x0) - _0x140c77)));
  }
  ["_audioClipLaneIndex"](_0x2b2ec8 = {}) {
    return normalizeMediaClipAudioLaneIndex(_0x2b2ec8?.['laneIndex']);
  }
  ["_audioLaneCount"](_0x3b4ace = this['_audioTimelineClips'](this["_mediaClip"]["tracks"]?.["audio"]), _0x462689 = {}) {
    const _0x1f95dc = Array['isArray'](_0x3b4ace) ? _0x3b4ace : [];
    const _0x36bd26 = _0x1f95dc["reduce"]((_0x10de26, _0x50f775) => Math["max"](_0x10de26, this["_audioClipLaneIndex"](_0x50f775)), 0x0);
    const _0x4a8a0f = Number['isFinite'](Number(_0x462689["previewLaneIndex"])) ? normalizeMediaClipAudioLaneIndex(_0x462689["previewLaneIndex"]) : 0x0;
    return Math["max"](0x1, Math['min'](MEDIA_CLIP_AUDIO_LANE_COUNT_MAX, Math['max'](_0x36bd26, _0x4a8a0f) + 0x1));
  }
  ["_setAudioLaneCountStyle"](_0x5311a1, _0x38eb69 = 0x1) {
    if (!_0x5311a1?.['style']) {
      return;
    }
    const _0x4de75d = Math["max"](0x1, Math["min"](MEDIA_CLIP_AUDIO_LANE_COUNT_MAX, Math["trunc"](toNumber(_0x38eb69, 0x1))));
    const _0x112791 = _0x4de75d * MEDIA_CLIP_AUDIO_LANE_HEIGHT_PX + Math["max"](0x0, _0x4de75d - 0x1) * MEDIA_CLIP_AUDIO_LANE_GAP_PX;
    const _0xe5a573 = (_0x18ba04, _0x5485e1) => {
      if (typeof _0x5311a1["style"]['setProperty'] === "function") {
        _0x5311a1['style']['setProperty'](_0x18ba04, _0x5485e1);
      } else {
        _0x5311a1["style"][_0x18ba04] = _0x5485e1;
      }
    };
    _0xe5a573('--media-clip-audio-lane-count', String(_0x4de75d));
    _0xe5a573('--media-clip-audio-lane-height', MEDIA_CLIP_AUDIO_LANE_HEIGHT_PX + 'px');
    _0xe5a573("--media-clip-audio-lane-gap", MEDIA_CLIP_AUDIO_LANE_GAP_PX + 'px');
    _0xe5a573('--media-clip-audio-stack-height', _0x112791 + 'px');
  }
  ["_setAudioSegmentLaneVisual"](_0x15c7ab, _0x16f51a = 0x0) {
    if (!_0x15c7ab?.["style"]) {
      return;
    }
    const _0x305ef4 = normalizeMediaClipAudioLaneIndex(_0x16f51a);
    const _0x2f0351 = _0x305ef4 * (MEDIA_CLIP_AUDIO_LANE_HEIGHT_PX + MEDIA_CLIP_AUDIO_LANE_GAP_PX);
    _0x15c7ab["dataset"]["audioLaneIndex"] = String(_0x305ef4);
    typeof _0x15c7ab["style"]["setProperty"] === 'function' ? (_0x15c7ab["style"]["setProperty"]('--media-clip-audio-lane-index', String(_0x305ef4)), _0x15c7ab["style"]["setProperty"]('--media-clip-audio-lane-top', _0x2f0351 + 'px')) : (_0x15c7ab["style"]["--media-clip-audio-lane-index"] = String(_0x305ef4), _0x15c7ab["style"]["--media-clip-audio-lane-top"] = _0x2f0351 + 'px');
  }
  ["_audioLaneIndexFromDrag"](_0xeb7539 = {}) {
    const _0x66ab6d = normalizeMediaClipAudioLaneIndex(_0xeb7539["startLaneIndex"]);
    const _0x1cab1d = toNumber(_0xeb7539["latestClientY"], _0xeb7539["startY"]) - toNumber(_0xeb7539["startY"], 0x0);
    if (Math["abs"](_0x1cab1d) < MEDIA_CLIP_AUDIO_LANE_DRAG_THRESHOLD_PX) {
      return _0x66ab6d;
    }
    const _0x1150d8 = MEDIA_CLIP_AUDIO_LANE_HEIGHT_PX + MEDIA_CLIP_AUDIO_LANE_GAP_PX;
    const _0x517176 = Math["round"](_0x1cab1d / _0x1150d8);
    return normalizeMediaClipAudioLaneIndex(_0x66ab6d + _0x517176);
  }
  ["_previewSourceSecForTimelineSec"](_0x5853d1, _0x48124c = this["_playheadSec"]) {
    if (_0x5853d1 === "video") {
      return this['_videoSourceSecForPlayhead'](_0x48124c);
    }
    if (_0x5853d1 === "audio") {
      return this["_audioSourceSecForPlayhead"](_0x48124c);
    }
    return _0x48124c;
  }
  ["_applyTimelineSegmentRect"](_0xdb12e1, _0x14340d = {}) {
    if (!_0xdb12e1) {
      return;
    }
    _0xdb12e1['style']['left'] = toNumber(_0x14340d["leftPct"], 0x0) + '%';
    _0xdb12e1["style"]["width"] = toNumber(_0x14340d["widthPct"], 0x0) + '%';
    _0xdb12e1["style"]["right"] = '';
  }
  ["_applyAudioTimelineSegmentRect"](_0x2a55c4, _0x25c410 = {}) {
    if (!_0x2a55c4) {
      return;
    }
    _0x2a55c4['style']["left"] = toNumber(_0x25c410['leftPct'], 0x0) + '%';
    _0x2a55c4["style"]['right'] = Math["max"](0x0, 0x64 - toNumber(_0x25c410["rightPct"], 0x0)) + '%';
    _0x2a55c4["style"]["width"] = "auto";
  }
  ["_applyAudioTimelineTrimRect"](_0x59c738, _0x442be1 = {}) {
    this['_applyAudioTimelineSegmentRect'](_0x59c738, _0x442be1);
  }
  ["_timelinePreviewRangeRect"](_0xf5846 = {}) {
    const _0x32abf1 = toNumber(_0xf5846["startSec"], 0x0);
    const _0x34d066 = Math["max"](_0x32abf1, toNumber(_0xf5846["endSec"], _0x32abf1));
    if (_0x32abf1 >= 0x0) {
      return getMediaClipTimelineRangeRect(_0xf5846);
    }
    const _0x2ad532 = getMediaClipTimelineDisplayDuration(_0xf5846["durationSec"]);
    const _0x8c3f92 = _0x32abf1 / _0x2ad532 * 0x64;
    const _0xf2214c = _0x34d066 / _0x2ad532 * 0x64;
    return {
      'startSec': _0x32abf1,
      'endSec': _0x34d066,
      'leftPct': _0x8c3f92,
      'rightPct': _0xf2214c,
      'widthPct': Math["max"](0x0, _0xf2214c - _0x8c3f92)
    };
  }
  ["_timelineCursorHost"](_0x4ebe24 = null) {
    return _0x4ebe24?.["closest"]?.('.media-clip-compact-timeline') || this['el']?.["querySelector"]?.('.media-clip-compact-timeline') || _0x4ebe24;
  }
  ["_syncTimelineCursorLayerForRow"](_0x4632bb = null) {
    if (!_0x4632bb) {
      return;
    }
    const _0x51b8b0 = this["_timelineCursorHost"](_0x4632bb);
    const _0x3ca22c = Math["max"](0xf0, readLayoutWidthPx(_0x4632bb, this["_timelineTrackContentWidth"]()));
    _0x51b8b0?.['style']?.["setProperty"]?.("--media-clip-track-content-width", _0x3ca22c + 'px');
    const _0x4f8f10 = _0x51b8b0?.["querySelector"]?.(".media-clip-timeline-cursors");
    if (_0x4f8f10?.["style"]) {
      _0x4f8f10["style"]['width'] = _0x3ca22c + 'px';
    }
  }
  ["_updateTimelineSegmentLabel"](_0xd07739, _0x36dea2 = 0x0) {
    const _0x581230 = _0xd07739?.["querySelector"]?.(".media-clip-material-label");
    if (!_0x581230) {
      return;
    }
    _0x581230["textContent"] = formatDurationLabel(_0x36dea2);
  }
  ["_syncAudioSegmentWaveformViewport"](_0x316ad0, _0x4b42cf = {}) {
    const _0x4e5d06 = _0x316ad0?.['querySelector']?.(".media-clip-wave-svg");
    if (!_0x4e5d06) {
      return;
    }
    const _0x57287d = _0x316ad0?.["querySelector"]?.('.media-clip-wave-source') || _0x4e5d06;
    const _0x578944 = getMediaClipWaveformViewport(_0x4b42cf);
    const _0x55ab91 = formatWaveformPct(_0x578944['widthPct']) + '%';
    const _0x4ce843 = _0x578944["marginLeftPct"] > 0x0 ? '-' + formatWaveformPct(_0x578944["marginLeftPct"]) + '%' : '0';
    _0x4e5d06["setAttribute"]("viewBox", getMediaClipWaveformViewBox());
    _0x4e5d06["setAttribute"]("width", '100%');
    _0x57287d?.["style"] && (_0x57287d["style"]['width'] = _0x55ab91, _0x57287d['style']['marginLeft'] = _0x4ce843, _0x57287d["style"]["transform"] = "none", _0x57287d["style"]['transformOrigin'] = '');
    _0x4e5d06['style'] && (_0x4e5d06['style']["width"] = "100%", _0x4e5d06["style"]["marginLeft"] = '0', _0x4e5d06['style']["transform"] = "none", _0x4e5d06["style"]["transformOrigin"] = '');
  }
  ["_applyVideoTimelinePreview"](_0x22f672, _0x15bb2c = [], _0x47d9ea = 0x0) {
    const _0x4e8203 = Array["isArray"](_0x15bb2c) ? _0x15bb2c : [];
    if (!_0x22f672 || !_0x4e8203["length"]) {
      return 0x0;
    }
    let _0x5f384e = 0x0;
    _0x22f672['querySelectorAll']?.(".media-clip-segment")?.["forEach"](_0x14d475 => {
      const _0x4b18a1 = this["_segmentClipIndex"](_0x14d475, 'video', _0x4e8203);
      const _0x3f1699 = _0x4e8203[_0x4b18a1];
      if (!_0x3f1699) {
        return;
      }
      const _0x5c642f = toNumber(_0x3f1699["timelineStartSec"], 0x0);
      const _0xe33bfc = Math["max"](_0x5c642f, toNumber(_0x3f1699["timelineEndSec"], _0x5c642f));
      const _0x2a8881 = Math["max"](0x0, _0xe33bfc - _0x5c642f);
      this['_applyTimelineSegmentRect'](_0x14d475, this["_timelinePreviewRangeRect"]({
        'startSec': _0x5c642f,
        'endSec': _0xe33bfc,
        'durationSec': _0x47d9ea
      }));
      this['_updateTimelineSegmentLabel'](_0x14d475, _0x2a8881);
      _0x5f384e += 0x1;
    });
    return _0x5f384e;
  }
  ["_applyAudioTimelinePreview"](_0x1e29cf, _0x36dba0 = [], _0x4e6f98 = 0x0) {
    const _0x4dc767 = Array["isArray"](_0x36dba0) ? _0x36dba0 : [];
    if (!_0x1e29cf || !_0x4dc767["length"]) {
      return 0x0;
    }
    const _0x5cfe9c = this["_audioLaneCount"](_0x4dc767);
    this['_setAudioLaneCountStyle'](_0x1e29cf, _0x5cfe9c);
    this['_setAudioLaneCountStyle'](_0x1e29cf["parentElement"], _0x5cfe9c);
    this["_setAudioLaneCountStyle"](_0x1e29cf["closest"]?.(".media-clip-timeline-lane"), _0x5cfe9c);
    this["_setAudioLaneCountStyle"](_0x1e29cf['closest']?.(".media-clip-compact-timeline"), _0x5cfe9c);
    let _0x1b2207 = 0x0;
    _0x1e29cf['querySelectorAll']?.(".media-clip-segment")?.["forEach"](_0x5bcedd => {
      const _0x25e8fb = this["_segmentClipIndex"](_0x5bcedd, "audio", _0x4dc767);
      const _0x966d6a = _0x4dc767[_0x25e8fb];
      if (!_0x966d6a) {
        return;
      }
      const _0x2a2985 = toNumber(_0x966d6a["timelineStartSec"], 0x0);
      const _0x47de0f = Math["max"](_0x2a2985, toNumber(_0x966d6a["timelineEndSec"], _0x2a2985));
      const _0x4e86c0 = Math["max"](0x0, _0x47de0f - _0x2a2985);
      this["_applyAudioTimelineSegmentRect"](_0x5bcedd, this['_timelinePreviewRangeRect']({
        'startSec': _0x2a2985,
        'endSec': _0x47de0f,
        'durationSec': _0x4e6f98
      }));
      this["_updateTimelineSegmentLabel"](_0x5bcedd, _0x4e86c0);
      this["_setAudioSegmentLaneVisual"](_0x5bcedd, this["_audioClipLaneIndex"](_0x966d6a));
      _0x5bcedd["dataset"]["mutedClip"] = _0x966d6a["muted"] === !![] ? "true" : "false";
      _0x5bcedd['dataset']["disabledClip"] = _0x966d6a["disabled"] === !![] ? "true" : 'false';
      _0x5bcedd["classList"]?.["toggle"]?.("is-muted", _0x966d6a["muted"] === !![]);
      _0x5bcedd["classList"]?.["toggle"]?.('is-disabled', _0x966d6a['disabled'] === !![]);
      this['_syncAudioSegmentWaveformViewport'](_0x5bcedd, _0x966d6a);
      _0x1b2207 += 0x1;
    });
    return _0x1b2207;
  }
  ['_setTimelinePlayheadFromPointer'](_0x26daaf, _0x5dee6a, _0x4f639f, _0x1b6f4b = 0x0, _0x1e4c3f = {}) {
    if (!_0x26daaf || !this["_mediaClip"]["tracks"]?.[_0x5dee6a]) {
      return ![];
    }
    const _0x7a9cb5 = this["_timelineSecFromPointerEvent"](_0x26daaf, _0x4f639f, _0x1b6f4b);
    this["_playheadSec"] = _0x7a9cb5;
    const _0x23a17f = this["_mediaClip"]["activeTrack"] !== _0x5dee6a;
    if (_0x5dee6a === "video") {
      if (_0x1e4c3f["updateClipSelection"] !== ![]) {
        const _0x118986 = _0x1e4c3f["clipIndex"] == null ? this["_clipIndexAtTimelineSec"](_0x7a9cb5) : Math["max"](0x0, Math["trunc"](toNumber(_0x1e4c3f["clipIndex"], 0x0)));
        this["_setActiveClipIndex"](_0x118986);
        if (_0x1e4c3f["selectClip"] !== ![]) {
          this["_selectClipIndex"](_0x118986);
        }
      }
      _0x1e4c3f["syncPreview"] !== ![] && this["_syncVideoPreviewSourceForTimelineSec"](_0x7a9cb5);
    } else {
      if (_0x5dee6a === "audio") {
        const _0x23525c = _0x1e4c3f["clipIndex"] == null ? this["_audioClipIndexAtTimelineSec"](_0x7a9cb5) : Math["max"](0x0, Math["trunc"](toNumber(_0x1e4c3f['clipIndex'], 0x0)));
        this["_setActiveAudioClipIndex"](_0x23525c);
        if (_0x1e4c3f["selectClip"] !== ![]) {
          this["_selectAudioClipIndex"](_0x23525c);
        }
        _0x1e4c3f["syncPreview"] !== ![] && this["_syncAudioPreviewSourceForTimelineSec"](_0x7a9cb5);
      }
    }
    _0x23a17f && _0x1e4c3f['updateActiveTrack'] !== ![] && (this["_mediaClip"] = {
      ...this["_mediaClip"],
      'activeTrack': _0x5dee6a
    }, this["nodeData"] = {
      ...(this["nodeData"] || {}),
      'mediaClip': this['_mediaClip']
    }, _0x1e4c3f["persistActiveTrack"] !== ![] && a411_0x3bf9e9['updateNodeData'](this['id'], {
      'mediaClip': this["_mediaClip"]
    }));
    this['_updateTrackPlayheadVisual'](_0x26daaf, _0x1b6f4b, {
      'playheadSec': _0x7a9cb5
    });
    _0x1e4c3f["syncPreview"] !== ![] && this["_syncPreviewTime"](_0x5dee6a, this["_previewSourceSecForTimelineSec"](_0x5dee6a, _0x7a9cb5));
    return !![];
  }
  ['_applyTimelinePlayheadModel'](_0x21122c, _0x3cb8bd = {}) {
    if (!_0x21122c) {
      return;
    }
    _0x21122c["style"]['left'] = toNumber(_0x3cb8bd["leftPct"], 0x0) + '%';
  }
  async ["_loadAudioWaveformPath"](_0x280f8d, _0x5801a4, _0x3f7404 = {}) {
    if (!_0x280f8d || !_0x5801a4) {
      return;
    }
    const _0x2512c7 = resolveMediaClipWaveformUrl(_0x3f7404);
    const _0x5dbced = resolveMediaClipAudioUrl(_0x3f7404);
    if (!_0x2512c7 && !_0x5dbced) {
      return;
    }
    const _0x3ba830 = [_0x2512c7, _0x5dbced, resolveMediaClipSourceKey(_0x3f7404)]["join"]('|');
    if (_0x280f8d["dataset"]) {
      _0x280f8d['dataset']["waveformKey"] = _0x3ba830;
    }
    const _0x19906f = {
      'width': MEDIA_CLIP_WAVEFORM_WIDTH,
      'height': MEDIA_CLIP_WAVEFORM_HEIGHT,
      'samples': MEDIA_CLIP_WAVEFORM_SAMPLES
    };
    let _0x19f591 = '';
    _0x2512c7 && (_0x19f591 = await getWaveformBarsPathFromPersistedUrl(_0x2512c7, _0x19906f));
    !_0x19f591 && _0x5dbced && typeof window !== 'undefined' && (_0x19f591 = await getWaveformBarsPathFromUrl(_0x5dbced, _0x19906f));
    if (!_0x19f591) {
      return;
    }
    if (_0x280f8d["dataset"]?.["waveformKey"] && _0x280f8d["dataset"]["waveformKey"] !== _0x3ba830) {
      return;
    }
    if (this['el']?.["isConnected"] === ![]) {
      return;
    }
    _0x5801a4['setAttribute']('d', _0x19f591);
    _0x280f8d["classList"]?.["add"]('has-waveform');
  }
  ["_renderTrack"](_0x147a18, _0x4afe7e = {}) {
    const _0xd1735f = this['_mediaClip']['tracks']?.[_0x147a18];
    const _0x514ec5 = _0x147a18 === "video" ? getMediaClipTimelineDisplayDuration(_0x4afe7e['durationSec'] ?? this["_videoTimelineDuration"](_0xd1735f)) : getMediaClipTimelineDisplayDuration(_0x4afe7e["durationSec"] ?? this["_timelineDurationForKind"](_0x147a18));
    const _0x310b3e = this["_mediaClip"]['activeTrack'] === _0x147a18;
    const _0x3b1efc = _0x147a18 === 'audio' ? this['_audioTimelineClips'](_0xd1735f) : [];
    const _0xae4c88 = _0x147a18 === "audio" ? this["_audioLaneCount"](_0x3b1efc) : 0x1;
    const _0x3e605d = document["createElement"]("div");
    _0x3e605d["className"] = "media-clip-track media-clip-track-" + _0x147a18;
    _0x3e605d['classList']['toggle']("is-active", _0x310b3e);
    _0x3e605d["classList"]["toggle"]("is-compact", _0x4afe7e["compact"] === !![]);
    if (_0x147a18 === "audio") {
      _0x3e605d['dataset']["audioLaneCount"] = String(_0xae4c88);
      this["_setAudioLaneCountStyle"](_0x3e605d, _0xae4c88);
      for (let _0x234bd4 = 0x0; _0x234bd4 < _0xae4c88; _0x234bd4 += 0x1) {
        const _0x3b3c86 = document["createElement"]("div");
        _0x3b3c86["className"] = "media-clip-audio-lane-guide";
        _0x3b3c86["dataset"]['audioLaneIndex'] = String(_0x234bd4);
        _0x3b3c86["style"]['setProperty']("--media-clip-audio-lane-index", String(_0x234bd4));
        _0x3b3c86['style']["setProperty"]("--media-clip-audio-lane-top", _0x234bd4 * (MEDIA_CLIP_AUDIO_LANE_HEIGHT_PX + MEDIA_CLIP_AUDIO_LANE_GAP_PX) + 'px');
        _0x3e605d['appendChild'](_0x3b3c86);
      }
    }
    this['_setTimelineRowDuration'](_0x3e605d, _0x514ec5);
    const _0x3aceff = toNumber(_0x4afe7e["timelineWidthPx"], 0x0);
    if (_0x3aceff > 0x0) {
      _0x3e605d["style"]["width"] = Math["max"](0xf0, _0x3aceff) + 'px';
    }
    _0x3e605d["addEventListener"]("click", _0xa54daa => {
      _0xa54daa["stopPropagation"]();
      if (this["_suppressTrackClick"]) {
        this["_suppressTrackClick"] = ![];
        return;
      }
      if (this['_isTimelineControlTarget'](_0xa54daa["target"])) {
        return;
      }
      if (_0x4afe7e["compact"] === !![]) {
        this["_setMediaClipWithLayout"]({
          ...this["_mediaClip"],
          'expanded': !![]
        }, !![]);
        return;
      }
      if (!this["_timelineEventSegment"](_0xa54daa["target"])) {
        return;
      }
      const _0x3508e8 = this["_timelineRowDuration"](_0x3e605d, _0x514ec5);
      const _0xd61cf6 = this['_timelineSecFromPointerEvent'](_0x3e605d, _0xa54daa, _0x3508e8);
      const _0x100a65 = _0x147a18 === 'video' ? this['_setActiveClipIndex'](this["_clipIndexAtTimelineSec"](_0xd61cf6)) : _0x147a18 === "audio" ? this["_setActiveAudioClipIndex"](this["_audioClipIndexAtTimelineSec"](_0xd61cf6)) : ![];
      if (_0x147a18 === "audio") {
        this["_selectAudioClipIndex"](this["_activeAudioClipIndex"]);
      }
      this["_setActiveTrack"](_0x147a18, _0xd61cf6, {
        'forceRender': _0x100a65
      });
    });
    const _0x42fed2 = (_0x4b408e, _0x32e4cf) => {
      const _0x36b858 = document['createElement']('div');
      _0x36b858["className"] = "media-clip-filmstrip";
      const _0x33b9f7 = collectMediaClipFrameUrls(_0x32e4cf);
      const _0x524ca3 = getMediaClipFrameCount(this["_estimateTimelineWidth"](_0x4afe7e), _0x4afe7e);
      if (_0x33b9f7["length"] > 0x0) {
        for (let _0x1d400f = 0x0; _0x1d400f < _0x524ca3; _0x1d400f += 0x1) {
          const _0x358931 = document["createElement"]("img");
          _0x358931["className"] = 'media-clip-filmstrip-frame';
          _0x358931["src"] = _0x33b9f7[_0x1d400f % _0x33b9f7["length"]];
          _0x358931['alt'] = '';
          _0x358931["draggable"] = ![];
          _0x358931["addEventListener"]('error', () => fillFilmstripPlaceholder(_0x36b858, _0x524ca3), {
            'once': !![]
          });
          _0x36b858["appendChild"](_0x358931);
        }
      } else {
        fillFilmstripPlaceholder(_0x36b858, _0x524ca3);
      }
      _0x4b408e['appendChild'](_0x36b858);
    };
    const _0x17ef5a = (_0x5bad81, _0x40694d = {}, _0x2f8900 = null) => {
      const _0x3cce67 = document["createElement"]('div');
      _0x3cce67["className"] = "media-clip-wave";
      const _0x5b721b = document['createElement']("div");
      _0x5b721b["className"] = 'media-clip-wave-source';
      const _0x3b091c = createMediaClipSvgElement("svg");
      setMediaClipSvgClass(_0x3b091c, "media-clip-wave-svg");
      _0x3b091c["setAttribute"]("width", "100%");
      _0x3b091c["setAttribute"]("height", "100%");
      _0x3b091c['setAttribute']("viewBox", getMediaClipWaveformViewBox());
      _0x3b091c["setAttribute"]("preserveAspectRatio", "none");
      const _0x144f92 = createMediaClipSvgElement("path");
      setMediaClipSvgClass(_0x144f92, "media-clip-wave-path");
      _0x144f92["setAttribute"]('d', '');
      _0x3b091c["appendChild"](_0x144f92);
      _0x5b721b["appendChild"](_0x3b091c);
      _0x3cce67["appendChild"](_0x5b721b);
      _0x5bad81["appendChild"](_0x3cce67);
      this["_syncAudioSegmentWaveformViewport"](_0x5bad81, _0x40694d);
      void this["_loadAudioWaveformPath"](_0x3cce67, _0x144f92, _0x2f8900);
    };
    const _0x23f769 = (_0x172b57, _0x5771f8 = {}) => {
      const _0xba96cd = document["createElement"]("div");
      _0xba96cd["className"] = 'media-clip-material-selection\x20v2-video-clipselection';
      _0xba96cd["style"]["left"] = '0%';
      _0xba96cd["style"]['width'] = "100%";
      const _0x209405 = document["createElement"]("div");
      _0x209405['className'] = "media-clip-material-label v2-video-cliplabel";
      const _0x1f02c9 = toNumber(_0x5771f8["startSec"] ?? _0x5771f8['timelineStartSec'], 0x0);
      const _0x1e97db = toNumber(_0x5771f8["endSec"] ?? _0x5771f8["timelineEndSec"], _0x1f02c9);
      _0x209405["textContent"] = formatDurationLabel(Math["max"](0x0, _0x1e97db - _0x1f02c9));
      _0xba96cd['append'](_0x209405);
      _0x172b57['appendChild'](_0xba96cd);
    };
    const _0x4d9de7 = ({
      rect = {},
      source = null,
      clipIndex = 0x0,
      item = null
    }) => {
      const _0x51b20f = document["createElement"]('div');
      _0x51b20f["className"] = "media-clip-segment media-clip-material-strip";
      _0x147a18 === "audio" ? this['_applyAudioTimelineSegmentRect'](_0x51b20f, rect) : this["_applyTimelineSegmentRect"](_0x51b20f, rect);
      _0x51b20f["dataset"]["clipIndex"] = String(clipIndex);
      const _0x1f2011 = normalizeText(item?.['id']);
      if (_0x1f2011) {
        _0x51b20f['dataset']["clipId"] = _0x1f2011;
      }
      if (_0x147a18 === "video") {
        const _0x4e177c = this["_visualClipKind"](item, source);
        _0x51b20f['classList']["add"]("media-clip-segment-" + _0x4e177c);
        _0x51b20f["dataset"]['mediaKind'] = _0x4e177c;
        clipIndex === this["_clampVideoClipIndex"]() && (_0x51b20f['dataset']["activeClip"] = "true");
        clipIndex === this['_selectedClipIndex'] && (_0x51b20f["dataset"]["selectedClip"] = "true");
        _0x42fed2(_0x51b20f, source);
      } else {
        _0x51b20f['classList']["add"]("media-clip-segment-audio");
        _0x51b20f["dataset"]['mediaKind'] = "audio";
        this["_setAudioSegmentLaneVisual"](_0x51b20f, this["_audioClipLaneIndex"](item));
        _0x51b20f['dataset']["mutedClip"] = item?.["muted"] === !![] ? "true" : "false";
        _0x51b20f["dataset"]["disabledClip"] = item?.["disabled"] === !![] ? "true" : "false";
        _0x51b20f['classList']["toggle"]("is-muted", item?.["muted"] === !![]);
        _0x51b20f["classList"]["toggle"]("is-disabled", item?.["disabled"] === !![]);
        clipIndex === this["_clampAudioClipIndex"]() && (_0x51b20f["dataset"]["activeClip"] = 'true');
        clipIndex === this["_selectedAudioClipIndex"] && (_0x51b20f['dataset']["selectedClip"] = "true");
        _0x17ef5a(_0x51b20f, item, source);
      }
      _0x23f769(_0x51b20f, item || {});
      if (_0x4afe7e['compact'] !== !![]) {
        _0x51b20f["addEventListener"]('contextmenu', _0x1d0866 => {
          const _0xe50cf9 = this["_segmentClipIndex"](_0x51b20f, _0x147a18);
          if (_0x147a18 === "video") {
            this["_setActiveClipIndex"](_0xe50cf9);
            this["_selectClipIndex"](_0xe50cf9);
            this["_syncTrackActiveClipChrome"](_0x3e605d, _0x147a18);
          } else {
            _0x147a18 === "audio" && (this["_setActiveAudioClipIndex"](_0xe50cf9), this["_selectAudioClipIndex"](_0xe50cf9), this["_syncTrackActiveClipChrome"](_0x3e605d, _0x147a18));
          }
          this["_openMaterialMenu"](_0x147a18, _0xe50cf9, _0x1d0866);
        });
        const _0x4bce9a = _0x3bf2e7 => {
          if (this['_timelineDrag']()) {
            return;
          }
          const _0x257c96 = this["_segmentClipIndex"](_0x51b20f, _0x147a18);
          this["_setTimelineHoverSegment"](_0x3e605d, _0x51b20f, _0x147a18, _0x257c96);
          const _0xd7acbd = this['_timelineRowDuration'](_0x3e605d, _0x514ec5);
          const _0x392c95 = this["_timelineSecFromPointerEvent"](_0x3e605d, _0x3bf2e7, _0xd7acbd);
          this["_previewTrackPlayhead"](_0x3e605d, _0x147a18, _0x392c95, _0xd7acbd);
        };
        _0x51b20f["addEventListener"]("pointerenter", _0x4bce9a);
        _0x51b20f['addEventListener']("pointermove", _0x4bce9a);
        _0x51b20f["addEventListener"]("pointerleave", () => {
          if (!this['_timelineDrag']()) {
            this["_clearTimelineHoverState"](_0x3e605d);
          }
          this["_restoreTrackPlayhead"](_0x3e605d, _0x147a18);
        });
        _0x51b20f["addEventListener"]('pointerdown', _0x5d8a61 => {
          const _0x5c86e3 = this["_segmentClipIndex"](_0x51b20f, _0x147a18);
          if (_0x147a18 === "video") {
            this["_setActiveClipIndex"](_0x5c86e3);
            this['_selectClipIndex'](_0x5c86e3);
            this["_syncTrackActiveClipChrome"](_0x3e605d, _0x147a18);
          } else {
            _0x147a18 === "audio" && (this["_setActiveAudioClipIndex"](_0x5c86e3), this['_selectAudioClipIndex'](_0x5c86e3), this["_syncTrackActiveClipChrome"](_0x3e605d, _0x147a18));
          }
          this["_startSegmentDrag"](_0x147a18, _0x5d8a61, {
            ..._0x4afe7e,
            'clipIndex': _0x5c86e3
          });
        });
      }
      _0x3e605d["appendChild"](_0x51b20f);
      return _0x51b20f;
    };
    if (_0x147a18 === "video") {
      const _0xfb2b8e = this["_videoTimelineClips"](_0xd1735f);
      _0xfb2b8e["length"] ? _0xfb2b8e["forEach"]((_0x4e2bb5, _0x23e86d) => {
        const _0x1210b4 = toNumber(_0x4e2bb5["timelineStartSec"], 0x0);
        const _0x414298 = Math["max"](_0x1210b4, toNumber(_0x4e2bb5["timelineEndSec"], _0x1210b4));
        _0x4d9de7({
          'rect': getMediaClipTimelineRangeRect({
            'startSec': _0x1210b4,
            'endSec': _0x414298,
            'durationSec': _0x514ec5
          }),
          'source': this['_videoClipSource'](_0x4e2bb5, _0x23e86d),
          'clipIndex': _0x23e86d,
          'item': _0x4e2bb5
        });
      }) : _0x4d9de7({
        'rect': getMediaClipTimelineRangeRect({
          'startSec': _0xd1735f["startSec"],
          'endSec': _0xd1735f["endSec"],
          'durationSec': _0x514ec5
        }),
        'source': this["_videoClipSource"](_0xfb2b8e[0x0] || _0xd1735f, 0x0),
        'clipIndex': 0x0,
        'item': _0xfb2b8e[0x0] || _0xd1735f
      });
    } else {
      const _0x44bb1a = _0x3b1efc;
      _0x44bb1a["length"] && _0x44bb1a['forEach']((_0x5efd76, _0x3fe39f) => {
        const _0xa783b4 = toNumber(_0x5efd76["timelineStartSec"], 0x0);
        const _0x59a05d = Math['max'](_0xa783b4, toNumber(_0x5efd76["timelineEndSec"], _0xa783b4));
        _0x4d9de7({
          'rect': getMediaClipTimelineRangeRect({
            'startSec': _0xa783b4,
            'endSec': _0x59a05d,
            'durationSec': _0x514ec5
          }),
          'source': this["_audioClipSource"](_0x5efd76, _0x3fe39f),
          'clipIndex': _0x3fe39f,
          'item': _0x5efd76
        });
      });
    }
    !_0x4afe7e["compact"] && _0x310b3e && this["_syncTrackActiveClipChrome"](_0x3e605d, _0x147a18);
    return _0x3e605d;
  }
  ["_timelineSecFromPointerEvent"](_0x2ee9b0, _0x4086ab, _0x3978ba = 0x0) {
    const _0x259b65 = _0x2ee9b0?.["getBoundingClientRect"]?.();
    const _0x398eb0 = Math["max"](0x1, toNumber(_0x259b65?.['width'], readLayoutWidthPx(_0x2ee9b0, 0x1)));
    const _0x3013bc = toNumber(_0x259b65?.["left"], 0x0);
    return getMediaClipTimelineSecFromClientX(_0x4086ab?.['clientX'], {
      'durationSec': _0x3978ba,
      'trackLeftPx': _0x3013bc,
      'trackWidthPx': _0x398eb0
    });
  }
  ["_previewTrackPlayhead"](_0x28ffb6, _0xad4557, _0x2a3ba8 = 0x0, _0x87caa0 = 0x0) {
    if (!_0x28ffb6 || this['_playing'] || this["_playPreviewPending"]) {
      return;
    }
    this["_updateTimelineHoverPlayheadVisual"](_0x28ffb6, _0x87caa0, {
      'playheadSec': _0x2a3ba8
    });
    if (_0xad4557 === "video") {
      this["_syncVideoPreviewSourceForTimelineSec"](_0x2a3ba8);
    } else {
      if (_0xad4557 === "audio") {
        this["_syncAudioPreviewSourceForTimelineSec"](_0x2a3ba8);
      }
    }
    this["_syncPreviewTime"](_0xad4557, this["_previewSourceSecForTimelineSec"](_0xad4557, _0x2a3ba8));
  }
  ["_syncTimelineHoverPlayheadFromPointer"](_0x109b6d, _0x230006, _0x594753 = 0x0) {
    if (!_0x109b6d || !_0x230006 || this['_playing'] || this["_playPreviewPending"]) {
      return;
    }
    const _0x4dea22 = this["_timelineSecFromPointerEvent"](_0x109b6d, _0x230006, _0x594753);
    this["_updateTimelineHoverPlayheadVisual"](_0x109b6d, _0x594753, {
      'playheadSec': _0x4dea22
    });
  }
  ["_restoreTrackPlayhead"](_0x4e6da2, _0x4193ef) {
    if (!_0x4e6da2 || this["_playing"] || this["_playPreviewPending"]) {
      return;
    }
    this["_hideTimelineHoverPlayhead"](_0x4e6da2);
    this["_updatePlaybackVisuals"](_0x4193ef);
  }
  ["_restoreTimelinePlayheads"]() {
    if (this['_playing'] || this["_playPreviewPending"]) {
      return;
    }
    this["_hideTimelineHoverPlayhead"]();
    this['_updatePlaybackVisuals']("video");
    this["_updatePlaybackVisuals"]("audio");
  }
  ["_syncTrackActiveClipChrome"](_0xb7aafa, _0x236933) {
    if (!_0xb7aafa || _0xb7aafa["classList"]?.["contains"]("is-compact")) {
      return;
    }
    const _0x45369b = this["_mediaClip"]['activeTrack'] === _0x236933;
    const _0x157c47 = _0x236933 === "video" ? this["_clampVideoClipIndex"]() : this["_clampAudioClipIndex"]();
    const _0x488a24 = _0x236933 === "video" ? this["_clampSelectedClipIndex"]() : this["_clampSelectedAudioClipIndex"]();
    const _0x4c4ba4 = _0x236933 === "audio" ? this['_mediaClip']["audioClips"] || [] : this["_mediaClip"]["clips"] || [];
    _0xb7aafa['querySelectorAll'](".media-clip-segment")['forEach'](_0x1ce2df => {
      const _0x3878ed = this['_segmentClipIndex'](_0x1ce2df, _0x236933, _0x4c4ba4);
      if (_0x236933 === 'video') {
        const _0x5025cd = normalizeText(_0x4c4ba4[_0x3878ed]?.['id']);
        _0x1ce2df["dataset"]["clipIndex"] = String(_0x3878ed);
        if (_0x5025cd) {
          _0x1ce2df["dataset"]['clipId'] = _0x5025cd;
        }
      } else {
        if (_0x236933 === 'audio') {
          const _0x2c5d59 = normalizeText(_0x4c4ba4[_0x3878ed]?.['id']);
          _0x1ce2df["dataset"]["clipIndex"] = String(_0x3878ed);
          if (_0x2c5d59) {
            _0x1ce2df["dataset"]["clipId"] = _0x2c5d59;
          }
        }
      }
      const _0x38291c = _0x45369b && _0x3878ed === _0x157c47;
      const _0x30c7f6 = _0x45369b && _0x3878ed === _0x488a24;
      _0x38291c ? _0x1ce2df['dataset']["activeClip"] = 'true' : delete _0x1ce2df["dataset"]["activeClip"];
      _0x30c7f6 ? _0x1ce2df["dataset"]["selectedClip"] = "true" : delete _0x1ce2df['dataset']["selectedClip"];
      _0x1ce2df["querySelectorAll"](".media-clip-trim")["forEach"](_0x4dea2c => {
        (!_0x45369b || Math["trunc"](toNumber(_0x4dea2c["dataset"]["clipIndex"], -0x1)) !== _0x3878ed) && _0x4dea2c["remove"]();
      });
      if (!_0x45369b) {
        return;
      }
      _0x1ce2df['querySelectorAll'](".media-clip-material-selection .media-clip-trim")['forEach'](_0x4afb7a => _0x4afb7a["remove"]());
      const _0x461b87 = _0x1ce2df;
      const _0x1bcebe = _0x177393 => Array["from"](_0x461b87["children"])["some"](_0x33362c => _0x33362c['classList']?.['contains']("media-clip-trim-" + _0x177393));
      !_0x1bcebe("left") && _0x461b87["appendChild"](this["_renderTrimHandle"](_0x236933, "left", {
        'clipIndex': _0x3878ed
      }));
      !_0x1bcebe("right") && _0x461b87["appendChild"](this["_renderTrimHandle"](_0x236933, 'right', {
        'clipIndex': _0x3878ed
      }));
    });
  }
  ['_renderTrimHandle'](_0x420516, _0x539619, _0x2bb677 = {}) {
    return renderMediaClipTimelineTrimHandle(this, _0x420516, _0x539619, _0x2bb677);
  }
  ["_detachDragListeners"]() {
    return detachMediaClipTimelineEditDrag(this);
  }
  ["_startSegmentDrag"](_0x294701, _0x2179e4, _0x5d5afa = {}) {
    return startMediaClipTimelineSegmentDrag(this, _0x294701, _0x2179e4, _0x5d5afa);
  }
  ["_handleTrimDrag"](_0x57c356, _0x2ef5ea = null) {
    return handleMediaClipTimelineDrag(this, _0x57c356, _0x2ef5ea);
  }
  ['_applyTimelineDragPreviewFromPointer'](_0x25dcf0 = this["_timelineDrag"](), _0x29582b = {}) {
    return applyMediaClipTimelineDragPreviewFromPointer(this, _0x25dcf0, _0x29582b);
  }
  ["_previewVideoTrimDrag"](_0x3fe743, _0x30a9b0 = 0x0, _0x38b574 = 0x0, _0x4882d5 = null) {
    return previewMediaClipTimelineTrimDrag(this, "video", _0x3fe743, _0x30a9b0, _0x38b574, _0x4882d5);
  }
  ['_previewAudioTrimDrag'](_0x2b3134, _0x2b8c50 = 0x0, _0x275231 = 0x0, _0x20652f = null) {
    return previewMediaClipTimelineTrimDrag(this, "audio", _0x2b3134, _0x2b8c50, _0x275231, _0x20652f);
  }
  ["_commitVideoTrimDrag"](_0x32c0d, _0x2e3047 = {}) {
    return commitMediaClipTimelineEdit(this, 'video', "trim", _0x32c0d, _0x2e3047);
  }
  ["_commitAudioTrimDrag"](_0x933e4c, _0x38325a = {}) {
    return commitMediaClipTimelineEdit(this, "audio", "trim", _0x933e4c, _0x38325a);
  }
  ['_handleSegmentDrag'](_0x584adc) {
    return handleMediaClipTimelineSegmentDrag(this, _0x584adc);
  }
  ['_previewVideoSegmentDrag'](_0x298f52, _0x271ac3 = 0x0, _0x23e9ae = 0x0) {
    return previewMediaClipTimelineMoveDrag(this, "video", _0x298f52, _0x271ac3, _0x23e9ae);
  }
  ["_previewAudioSegmentDrag"](_0x433676, _0x525d41 = 0x0, _0x255de9 = 0x0) {
    return previewMediaClipTimelineMoveDrag(this, "audio", _0x433676, _0x525d41, _0x255de9);
  }
  ["_commitVideoSegmentDrag"](_0xf0dae0, _0x470126 = {}) {
    return commitMediaClipTimelineEdit(this, "video", "move", _0xf0dae0, _0x470126);
  }
  ["_commitAudioSegmentDrag"](_0x1544e0, _0x4715f5 = {}) {
    return commitMediaClipTimelineEdit(this, 'audio', "move", _0x1544e0, _0x4715f5);
  }
  ['_flushTimelineSettlePersist']() {
    if (!this["_timelineSettlePendingPersist"]) {
      return;
    }
    const _0x3cb102 = this['_timelineSettlePendingCommit'];
    this['_timelineSettlePendingPersist'] = ![];
    this['_timelineSettlePendingCommit'] = ![];
    this["_persistTimelineMediaClip"]({
      'commitHistory': _0x3cb102
    });
  }
  ["_persistTimelineMediaClip"](_0x4c861d = {}) {
    this["_skipNextStoreMediaClipRender"] = !![];
    a411_0x3bf9e9["updateNodeData"](this['id'], {
      'mediaClip': this["_mediaClip"]
    });
    this['nodeData'] = {
      ...(this["nodeData"] || {}),
      'mediaClip': this["_mediaClip"]
    };
    if (_0x4c861d["commitHistory"] === !![]) {
      commit();
    }
  }
  ['_applyDeferredTimelineDragUpdate'](_0x487878 = null) {
    const _0x4dd707 = this["_deferredTimelineDragNodeData"];
    this["_deferredTimelineDragNodeData"] = null;
    if (!_0x4dd707 || this["_timelineDrag"]()) {
      return;
    }
    const _0x11a881 = _0x4dd707['mediaClip'];
    if (isSameMediaClipState(_0x11a881, this["_mediaClip"])) {
      return;
    }
    if (_0x487878?.['startMediaClip'] && isSameMediaClipState(_0x11a881, _0x487878['startMediaClip'])) {
      return;
    }
    this['update'](_0x4dd707);
  }
  ["_scheduleTimelineSettleRender"](_0x2ac1a9, _0x3b0561 = {}) {
    if (this['_timelineSettleTimer']) {
      clearTimeout(this["_timelineSettleTimer"]);
    }
    this['_timelineSettleRow'] = _0x2ac1a9 || this['_timelineSettleRow'];
    const _0x386f6d = this["_timelineSettleVersion"];
    this["_timelineSettlePendingPersist"] = this['_timelineSettlePendingPersist'] || _0x3b0561["persist"] === !![];
    this["_timelineSettlePendingCommit"] = this["_timelineSettlePendingCommit"] || _0x3b0561["commitHistory"] === !![];
    this["_timelineSettleTimer"] = setTimeout(() => {
      if (_0x386f6d !== this["_timelineSettleVersion"]) {
        return;
      }
      this['_timelineSettleTimer'] = 0x0;
      const _0x2a8ffa = this["_timelineSettleRow"] || _0x2ac1a9;
      _0x2a8ffa?.['classList']["remove"]("is-settling");
      this['_timelineSettleRow'] = null;
      _0x3b0561["syncTimelineWidthAfterSettle"] !== ![] && this['_syncTimelineContentWidth']();
      this['_flushTimelineSettlePersist']();
    }, TIMELINE_SETTLE_ANIMATION_MS);
  }
  ["_animateTrackVisualsToCurrentState"](_0x19c7d3, _0x537a32 = "video", _0x7981a9 = {}) {
    const _0x350d3d = this["_startTimelineSettle"](_0x19c7d3);
    const _0x487d8b = {
      ..._0x7981a9
    };
    _0x487d8b["persist"] === !![] && (this["_persistTimelineMediaClip"]({
      'commitHistory': _0x487d8b['commitHistory'] === !![]
    }), _0x487d8b["persist"] = ![], _0x487d8b["commitHistory"] = ![]);
    const _0x584cd6 = () => {
      if (_0x350d3d !== this["_timelineSettleVersion"] || this["_timelineDrag"]()) {
        return;
      }
      this["_updateTrackVisuals"](_0x537a32, {
        'durationSec': _0x487d8b["durationSec"],
        'syncTimelineWidth': ![]
      });
      this["_scheduleTimelineSettleRender"](_0x19c7d3, _0x487d8b);
    };
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => requestAnimationFrame(_0x584cd6));
    } else {
      setTimeout(_0x584cd6, 0x0);
    }
  }
  ["_startTimelineSettle"](_0xed4e7e) {
    this['_cancelTimelineSettle']();
    this["_timelineSettleVersion"] += 0x1;
    if (this["_timelineSettleTimer"]) {
      clearTimeout(this["_timelineSettleTimer"]);
      this["_timelineSettleTimer"] = 0x0;
      const _0x3a3284 = this["_timelineSettleRow"] || _0xed4e7e;
      _0x3a3284?.['classList']["remove"]("is-settling");
      this["_timelineSettleRow"] = null;
      this["_flushTimelineSettlePersist"]();
    }
    this['_timelineSettleRow'] = _0xed4e7e || null;
    _0xed4e7e?.['classList']["add"]("is-settling");
    _0xed4e7e?.['getBoundingClientRect']?.();
    return this["_timelineSettleVersion"];
  }
  ['_cancelTimelineSettle'](_0x548b24 = {}) {
    this["_timelineSettleVersion"] = toNumber(this['_timelineSettleVersion'], 0x0) + 0x1;
    this["_timelineSettleTimer"] && (clearTimeout(this["_timelineSettleTimer"]), this["_timelineSettleTimer"] = 0x0);
    const _0x598456 = this["_timelineSettleRow"];
    _0x598456?.["classList"]['remove']('is-settling');
    this["_timelineSettleRow"] = null;
    _0x548b24['flushPersist'] !== ![] ? this['_flushTimelineSettlePersist']() : (this['_timelineSettlePendingPersist'] = ![], this["_timelineSettlePendingCommit"] = ![]);
  }
  ['_updateTrackPlayheadVisual'](_0x496af1, _0xd41714 = 0x0, _0x24f8b2 = {}) {
    if (!_0x496af1) {
      return;
    }
    const _0x438b32 = this['_timelineRowDuration'](_0x496af1, _0xd41714);
    this["_setTimelineRowDuration"](_0x496af1, _0x438b32);
    this['_syncTimelineCursorLayerForRow'](_0x496af1);
    const _0x407d55 = this["_timelineCursorHost"](_0x496af1);
    const _0x143d80 = _0x407d55?.["querySelector"]?.('.media-clip-playhead') || _0x496af1['querySelector']?.('.media-clip-playhead');
    if (!_0x143d80) {
      return;
    }
    this['_applyTimelinePlayheadModel'](_0x143d80, getMediaClipTimelinePlayheadModel({
      'playheadSec': _0x24f8b2["playheadSec"] ?? this['_playheadSec'],
      'durationSec': _0x438b32
    }));
  }
  ["_updateTimelineHoverPlayheadVisual"](_0x5e9ff7, _0x5a4bcf = 0x0, _0x4d0fdd = {}) {
    if (!_0x5e9ff7) {
      return;
    }
    const _0x182d0 = this["_timelineRowDuration"](_0x5e9ff7, _0x5a4bcf);
    this["_setTimelineRowDuration"](_0x5e9ff7, _0x182d0);
    this['_syncTimelineCursorLayerForRow'](_0x5e9ff7);
    const _0x4d80fe = this["_timelineCursorHost"](_0x5e9ff7);
    const _0x4ca5ad = _0x4d80fe?.['querySelector']?.('.media-clip-hover-playhead') || _0x5e9ff7["querySelector"]?.('.media-clip-hover-playhead');
    if (!_0x4ca5ad) {
      return;
    }
    _0x4ca5ad['hidden'] = ![];
    _0x4ca5ad["classList"]?.["add"]('is-visible');
    this['_applyTimelinePlayheadModel'](_0x4ca5ad, getMediaClipTimelinePlayheadModel({
      'playheadSec': _0x4d0fdd["playheadSec"] ?? this['_playheadSec'],
      'durationSec': _0x182d0
    }));
  }
  ['_hideTimelineHoverPlayhead'](_0x5d9d10 = null) {
    const _0x195afe = this["_timelineCursorHost"](_0x5d9d10);
    const _0x2f4492 = [];
    const _0x2d31b1 = _0x195afe?.["querySelectorAll"] ? _0x195afe["querySelectorAll"](".media-clip-hover-playhead") : this['el']?.["querySelectorAll"]?.(".media-clip-hover-playhead");
    _0x2d31b1?.["forEach"]?.(_0x29929a => _0x2f4492["push"](_0x29929a));
    const _0x37f2fa = _0x195afe?.['querySelector']?.(".media-clip-hover-playhead") || _0x5d9d10?.["querySelector"]?.(".media-clip-hover-playhead");
    if (_0x37f2fa && !_0x2f4492["includes"](_0x37f2fa)) {
      _0x2f4492["push"](_0x37f2fa);
    }
    _0x2f4492['forEach'](_0x3800e1 => {
      _0x3800e1['classList']?.['remove']('is-visible');
      _0x3800e1["hidden"] = !![];
    });
  }
  ["_clearTimelinePlaybackVisualLocks"]() {
    const _0x527507 = this['el'];
    _0x527507?.['querySelectorAll']?.(".media-clip-compact-timeline")?.["forEach"](_0x4ef51b => {
      _0x4ef51b["classList"]?.["remove"]("is-moving-material");
    });
    _0x527507?.["querySelectorAll"]?.(".media-clip-timeline-lane")?.["forEach"](_0x1ac2c6 => {
      _0x1ac2c6["classList"]?.['remove']("is-moving");
      _0x1ac2c6['classList']?.["remove"]("is-trimming");
    });
    _0x527507?.["querySelectorAll"]?.(".media-clip-timeline-scroll")?.["forEach"](_0x23bcd1 => {
      _0x23bcd1['classList']?.['remove']("is-trimming");
    });
    _0x527507?.["querySelectorAll"]?.('.media-clip-track')?.["forEach"](_0x560f18 => {
      _0x560f18["classList"]?.["remove"]("is-trimming");
      _0x560f18["classList"]?.['remove']('is-preview-dragging');
    });
    _0x527507?.['querySelectorAll']?.(".media-clip-segment")?.["forEach"](_0x5b4b21 => {
      _0x5b4b21["classList"]?.["remove"]("is-dragging");
      _0x5b4b21["classList"]?.["remove"]("is-trimming");
    });
  }
  ['_updatePlaybackVisuals'](_0x9fbe9f) {
    const _0x41c7d6 = this["_mediaClip"]['tracks']?.[_0x9fbe9f];
    const _0x13a1ae = this['el']?.['querySelector'](".media-clip-track-" + _0x9fbe9f + ":not(.is-compact)");
    if (!_0x41c7d6 || !_0x13a1ae) {
      return;
    }
    const _0x2b585f = this["_timelineDurationForKind"](_0x9fbe9f);
    this['_updateTrackPlayheadVisual'](_0x13a1ae, _0x2b585f);
  }
  ["_updateTrackVisuals"](_0x133baf, _0x40d290 = {}) {
    const _0xd69e7 = this["_mediaClip"]["tracks"]?.[_0x133baf];
    const _0x57d843 = this['el']?.["querySelector"]('.media-clip-track-' + _0x133baf + ':not(.is-compact)');
    if (!_0xd69e7 || !_0x57d843) {
      return;
    }
    const _0x4d3504 = _0x133baf === "video" ? getMediaClipTimelineDisplayDuration(_0x40d290["durationSec"] ?? this["_videoTimelineDuration"](_0xd69e7)) : getMediaClipTimelineDisplayDuration(_0x40d290["durationSec"] ?? this['_timelineDurationForKind'](_0x133baf));
    this["_setTimelineRowDuration"](_0x57d843, _0x4d3504);
    if (_0x133baf === "video" && _0x40d290["syncTimelineWidth"] !== ![]) {
      this['_syncTimelineContentWidth'](undefined, {
        'durationSec': _0x4d3504
      });
    } else {
      _0x133baf === "video" && this["_syncTimelineAddSlotForRow"](_0x57d843, {
        'displayDurationSec': _0x4d3504
      });
    }
    if (_0x133baf === "video" && (this["_mediaClip"]["clips"] || [])["length"]) {
      const _0x4ee924 = this['_mediaClip']["clips"] || [];
      _0x57d843["querySelectorAll"](".media-clip-segment")["forEach"](_0x336ab1 => {
        const _0x588690 = this["_segmentClipIndex"](_0x336ab1, _0x133baf, _0x4ee924);
        const _0x117553 = _0x4ee924[_0x588690];
        if (!_0x117553) {
          return;
        }
        _0x336ab1["dataset"]["clipIndex"] = String(_0x588690);
        const _0x2d0fe9 = normalizeText(_0x117553['id']);
        if (_0x2d0fe9) {
          _0x336ab1["dataset"]["clipId"] = _0x2d0fe9;
        }
        const _0x47af06 = toNumber(_0x117553["timelineStartSec"], 0x0);
        const _0x3a2e86 = Math["max"](_0x47af06, toNumber(_0x117553["timelineEndSec"], _0x47af06));
        this['_applyTimelineSegmentRect'](_0x336ab1, this["_timelinePreviewRangeRect"]({
          'startSec': _0x47af06,
          'endSec': _0x3a2e86,
          'durationSec': _0x4d3504
        }));
        this["_updateTimelineSegmentLabel"](_0x336ab1, Math['max'](0x0, _0x3a2e86 - _0x47af06));
      });
    } else {
      if (_0x133baf === 'audio' && (this['_mediaClip']['audioClips'] || [])["length"]) {
        const _0x106388 = this['_mediaClip']["audioClips"] || [];
        const _0x21c5ab = this['_audioLaneCount'](_0x106388);
        this["_setAudioLaneCountStyle"](_0x57d843, _0x21c5ab);
        this["_setAudioLaneCountStyle"](_0x57d843["parentElement"], _0x21c5ab);
        this['_setAudioLaneCountStyle'](_0x57d843["closest"]?.(".media-clip-timeline-lane"), _0x21c5ab);
        this["_setAudioLaneCountStyle"](_0x57d843['closest']?.(".media-clip-compact-timeline"), _0x21c5ab);
        this["_syncAudioLaneControls"](_0x106388, _0x21c5ab);
        _0x57d843["querySelectorAll"]('.media-clip-segment')["forEach"](_0x4cca1a => {
          const _0x5a374e = this['_segmentClipIndex'](_0x4cca1a, _0x133baf, _0x106388);
          const _0xaed4b5 = _0x106388[_0x5a374e];
          if (!_0xaed4b5) {
            return;
          }
          _0x4cca1a["dataset"]['clipIndex'] = String(_0x5a374e);
          const _0x599784 = normalizeText(_0xaed4b5['id']);
          if (_0x599784) {
            _0x4cca1a['dataset']['clipId'] = _0x599784;
          }
          const _0x831856 = toNumber(_0xaed4b5["timelineStartSec"], 0x0);
          const _0x1d8e74 = Math["max"](_0x831856, toNumber(_0xaed4b5["timelineEndSec"], _0x831856));
          this["_applyAudioTimelineSegmentRect"](_0x4cca1a, getMediaClipTimelineRangeRect({
            'startSec': _0x831856,
            'endSec': _0x1d8e74,
            'durationSec': _0x4d3504
          }));
          this["_updateTimelineSegmentLabel"](_0x4cca1a, Math["max"](0x0, _0x1d8e74 - _0x831856));
          this["_setAudioSegmentLaneVisual"](_0x4cca1a, this["_audioClipLaneIndex"](_0xaed4b5));
          _0x4cca1a['dataset']["mutedClip"] = _0xaed4b5["muted"] === !![] ? "true" : 'false';
          _0x4cca1a["dataset"]["disabledClip"] = _0xaed4b5['disabled'] === !![] ? "true" : "false";
          _0x4cca1a["classList"]?.["toggle"]?.("is-muted", _0xaed4b5['muted'] === !![]);
          _0x4cca1a["classList"]?.["toggle"]?.('is-disabled', _0xaed4b5['disabled'] === !![]);
          this["_syncAudioSegmentWaveformViewport"](_0x4cca1a, _0xaed4b5);
        });
      } else {
        const _0x4bb0e6 = _0x57d843["querySelector"](".media-clip-segment");
        if (_0x4bb0e6) {
          const _0x439998 = toNumber(_0xd69e7['startSec'], 0x0);
          const _0x864149 = Math["max"](_0x439998, toNumber(_0xd69e7["endSec"], _0x439998));
          _0x133baf === "audio" ? this["_applyAudioTimelineSegmentRect"](_0x4bb0e6, getMediaClipTimelineRangeRect({
            'startSec': _0x439998,
            'endSec': _0x864149,
            'durationSec': _0x4d3504
          })) : this["_applyTimelineSegmentRect"](_0x4bb0e6, getMediaClipTimelineRangeRect({
            'startSec': _0x439998,
            'endSec': _0x864149,
            'durationSec': _0x4d3504
          }));
          this["_updateTimelineSegmentLabel"](_0x4bb0e6, Math["max"](0x0, _0x864149 - _0x439998));
          if (_0x133baf === "audio") {
            this['_syncAudioSegmentWaveformViewport'](_0x4bb0e6, _0xd69e7);
          }
        }
      }
    }
    this['_syncTrackActiveClipChrome'](_0x57d843, _0x133baf);
    this["_updateTrackPlayheadVisual"](_0x57d843, _0x4d3504);
  }
  ["_primaryDuration"](_0x14f6d3 = {}) {
    const _0xfbfc0d = this["_mediaClip"]["tracks"]?.["video"];
    const _0x20d694 = this["_mediaClip"]["tracks"]?.["audio"];
    return (_0xfbfc0d ? this["_videoTimelineDuration"](_0xfbfc0d, null, _0x14f6d3) : 0x0) || this["_audioTimelineDuration"](_0x20d694, null, _0x14f6d3) || 0xa;
  }
  ['_refreshMediaClipTimelineInPlace']() {
    if (this["_mediaClip"]['expanded'] !== !![] || !(this["_mediaClip"]["tracks"]?.["video"] || this['_mediaClip']["tracks"]?.["audio"])) {
      this["_render"]();
      return;
    }
    this["_rerenderCompactOnly"]();
    const _0xbe5fdf = this['_getPlaybackKind']();
    if (_0xbe5fdf === "video") {
      this["_syncVideoPreviewSourceForTimelineSec"](this['_playheadSec']);
      this["_syncPreviewTime"]("video", this["_videoSourceSecForPlayhead"](this['_playheadSec']), {
        'immediate': !![]
      });
    } else {
      _0xbe5fdf === 'audio' && (this["_setActiveAudioClipIndex"](this["_audioClipIndexAtTimelineSec"](this["_playheadSec"])), this['_syncAudioPreviewSourceForTimelineSec'](this['_playheadSec']), this['_syncPreviewTime']("audio", this["_audioSourceSecForPlayhead"](this["_playheadSec"]), {
        'immediate': !![]
      }));
    }
    this["_updatePreviewControls"]();
  }
  ['_edgeIdForMaterial'](_0x50f442 = "video", _0x5eff48 = 0x0) {
    if (_0x50f442 === "audio") {
      const _0x73bd77 = this["_audioTimelineClips"](this["_mediaClip"]["tracks"]?.["audio"])[_0x5eff48];
      const _0x429925 = this["_audioClipSource"](_0x73bd77, _0x5eff48);
      return normalizeText(_0x429925?.['__mediaClipEdgeId']);
    }
    const _0xd73bef = this["_videoTimelineClips"](this["_mediaClip"]['tracks']?.["video"])[_0x5eff48];
    const _0x4020b5 = this["_videoClipSource"](_0xd73bef, _0x5eff48);
    return normalizeText(_0x4020b5?.["__mediaClipEdgeId"]);
  }
  ['_deleteActiveMaterial']() {
    const _0x426ac2 = this['_mediaClip']["activeTrack"] === "audio" ? "audio" : "video";
    const _0x180f5c = _0x426ac2 === "video" ? this['_clampSelectedClipIndex'](this['_selectedClipIndex']) >= 0x0 ? this["_clampSelectedClipIndex"](this['_selectedClipIndex']) : this["_clampVideoClipIndex"](this["_activeClipIndex"]) : this["_clampSelectedAudioClipIndex"](this['_selectedAudioClipIndex']) >= 0x0 ? this['_clampSelectedAudioClipIndex'](this["_selectedAudioClipIndex"]) : this["_clampAudioClipIndex"](this["_activeAudioClipIndex"]);
    this["_deleteMaterial"](_0x426ac2, _0x180f5c);
  }
  ["_deleteMaterial"](_0x388e72 = "video", _0x5729d1 = 0x0) {
    if (this["_timelineDrag"]()) {
      return;
    }
    const _0x4c7ad9 = _0x388e72 === "audio" ? "audio" : "video";
    const _0x545721 = this["_mediaClip"]["activeTrack"];
    this['_pausePreviewPlayback']({
      'updateControls': ![]
    });
    this["_materialMenu"] = null;
    let _0x3f98c7 = this["_mediaClip"];
    let _0x18ea6f = '';
    if (_0x4c7ad9 === "audio") {
      if (!this["_mediaClip"]['tracks']?.["audio"]) {
        return;
      }
      const _0x3d9f53 = this["_audioTimelineClips"](this["_mediaClip"]["tracks"]?.["audio"]);
      const _0x183e16 = Math["max"](0x0, Math["min"](_0x3d9f53["length"] - 0x1, Math['trunc'](toNumber(_0x5729d1, 0x0))));
      const _0x142c89 = _0x3d9f53[_0x183e16];
      if (!_0x142c89) {
        return;
      }
      const _0x134d28 = this["_audioClipSource"](_0x142c89, _0x183e16);
      const _0x556cf8 = normalizeText(_0x142c89['sourceId'] || _0x134d28?.['id']);
      const _0x50dfcd = normalizeText(_0x142c89["sourceKey"] || resolveMediaClipLocalPath(_0x134d28));
      _0x18ea6f = this["_edgeIdForMaterial"]('audio', _0x183e16);
      _0x3f98c7 = removeMediaClipAudioClip(this["_mediaClip"], _0x183e16);
      const _0x21f8d9 = Array['isArray'](_0x3f98c7["audioClips"]) ? _0x3f98c7["audioClips"] : [];
      const _0x2cffe0 = _0x21f8d9["some"](_0x44e059 => {
        const _0x3534fb = normalizeText(_0x44e059?.["sourceId"]);
        const _0x1cd883 = normalizeText(_0x44e059?.["sourceKey"]);
        return _0x556cf8 && _0x3534fb === _0x556cf8 || _0x50dfcd && _0x1cd883 === _0x50dfcd;
      });
      if (_0x2cffe0) {
        _0x18ea6f = '';
      }
      this["_activeAudioClipIndex"] = _0x21f8d9["length"] ? Math['max'](0x0, Math['min'](_0x21f8d9["length"] - 0x1, _0x183e16)) : 0x0;
      this["_selectedAudioClipIndex"] = _0x21f8d9['length'] ? this['_activeAudioClipIndex'] : -0x1;
      _0x3f98c7 = {
        ..._0x3f98c7,
        'activeTrack': _0x3f98c7["tracks"]?.["video"] ? "video" : _0x3f98c7['tracks']?.["audio"] ? "audio" : "video",
        'expanded': !!(_0x3f98c7["tracks"]?.["video"] || _0x3f98c7["tracks"]?.["audio"]) && this['_mediaClip']["expanded"] === !![]
      };
    } else {
      const _0x338eaf = this["_videoTimelineClips"](this["_mediaClip"]["tracks"]?.["video"]);
      const _0x3313d3 = Math["max"](0x0, Math["min"](_0x338eaf["length"] - 0x1, Math['trunc'](toNumber(_0x5729d1, 0x0))));
      const _0x1a59bc = _0x338eaf[_0x3313d3];
      if (!_0x1a59bc) {
        return;
      }
      const _0x2b033b = this["_videoClipSource"](_0x1a59bc, _0x3313d3);
      const _0x3e2ab0 = normalizeText(_0x1a59bc["sourceId"] || _0x2b033b?.['id']);
      const _0x328c79 = normalizeText(_0x1a59bc["sourceKey"] || resolveMediaClipLocalPath(_0x2b033b));
      _0x18ea6f = this["_edgeIdForMaterial"]("video", _0x3313d3);
      _0x3f98c7 = removeMediaClipClip(this["_mediaClip"], _0x3313d3);
      const _0x34eab5 = Array['isArray'](_0x3f98c7["clips"]) ? _0x3f98c7["clips"] : [];
      const _0x681a61 = _0x34eab5['some'](_0x58b2f5 => {
        const _0x3e39cf = normalizeText(_0x58b2f5?.["sourceId"]);
        const _0x1124bd = normalizeText(_0x58b2f5?.["sourceKey"]);
        return _0x3e2ab0 && _0x3e39cf === _0x3e2ab0 || _0x328c79 && _0x1124bd === _0x328c79;
      });
      if (_0x681a61) {
        _0x18ea6f = '';
      }
      this['_activeClipIndex'] = _0x34eab5["length"] ? Math['max'](0x0, Math['min'](_0x34eab5['length'] - 0x1, _0x3313d3)) : 0x0;
      this["_selectedClipIndex"] = _0x34eab5["length"] ? this["_activeClipIndex"] : -0x1;
      _0x3f98c7 = {
        ..._0x3f98c7,
        'activeTrack': _0x3f98c7["tracks"]?.["video"] ? "video" : _0x3f98c7["tracks"]?.['audio'] ? "audio" : "video",
        'expanded': !!(_0x3f98c7["tracks"]?.['video'] || _0x3f98c7["tracks"]?.["audio"]) && this["_mediaClip"]["expanded"] === !![]
      };
    }
    const _0x205405 = _0x3f98c7['expanded'] !== !![] || _0x545721 !== _0x3f98c7["activeTrack"];
    this['_setMediaClipWithLayout'](_0x3f98c7, ![], {
      'render': ![]
    });
    _0x18ea6f && typeof a411_0x3bf9e9['removeEdge'] === "function" && (this["_skipNextIncomingMediaClipRender"] = !![], a411_0x3bf9e9["removeEdge"](_0x18ea6f), this["_skipNextIncomingMediaClipRender"] === !![] && (this['_skipNextIncomingMediaClipRender'] = ![]));
    commit();
    if (_0x205405) {
      this["_render"]();
    } else {
      this["_refreshMediaClipTimelineInPlace"]();
    }
  }
  ["_singleVisualClipExportTrack"](_0x325a5e = {}) {
    return a411_0x51c795(_0x325a5e);
  }
  ["_exportVisualClips"](_0x3d7777 = this["_mediaClip"]['tracks']?.["video"]) {
    return a411_0x5246fd(this, _0x3d7777);
  }
  ['_firstExportVideoSource'](_0x4fbf83 = []) {
    return a411_0x484676(this, _0x4fbf83);
  }
  ['_exportVisualDurationSec'](_0x209f05 = []) {
    return a411_0x494fe9(_0x209f05);
  }
  ["_exportAudioClips"](_0x14a487 = this["_mediaClip"]["tracks"]?.["audio"]) {
    return a411_0xfb30f(this, _0x14a487);
  }
  ["_exportLoadingTargetElement"]() {
    return a411_0x43191e(this);
  }
  ["_startExportLoading"](_0x772f6f = mediaClipText("export.loading")) {
    return a411_0x3cc9f1(this, _0x772f6f);
  }
  ['_stopExportLoading']() {
    return a411_0x2ae9dd(this);
  }
  ["_waitForExportLoadingFrame"]() {
    return a411_0x39c0f8();
  }
  async ["_exportMaterialToCanvas"](_0x83fa0c = 'video', _0x13218f = 0x0) {
    return a411_0x4a14d0(this, _0x83fa0c, _0x13218f);
  }
  ["_renderDownloadMenu"]() {
    return a411_0x35f76a(this);
  }
  async ["_exportAndUse"](_0x5f29ab) {
    return a411_0x44997b(this, _0x5f29ab);
  }
  ["_resolveOutputNodePosition"](_0xe51554, _0x5586ce) {
    return a411_0x3239b4(this, _0xe51554, _0x5586ce);
  }
  ['_addImageOutputNodeFromSource'](_0x42a082 = {}, _0x9ea744 = {}) {
    return a411_0x3424d9(this, _0x42a082, _0x9ea744);
  }
  ["_addOutputNode"](_0x26c105, _0x11c8ad = {}, _0x6bdb1d = {}) {
    return a411_0x2a8f1d(this, _0x26c105, _0x11c8ad, _0x6bdb1d);
  }
}