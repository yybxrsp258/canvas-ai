import { renderRequestDebugButton } from '../debugRequestWindow.js';
import { PERSON_REPLACEMENT_DEFAULT_VIDEO_MODEL_ID, PERSON_REPLACEMENT_DEFAULT_VIDEO_PROMPT, PERSON_REPLACEMENT_VIDEO_INPUT_MODE_CHARACTER_REFERENCE, PERSON_REPLACEMENT_VIDEO_INPUT_MODE_FIRST_FRAME, PERSON_REPLACEMENT_VIDEO_MODEL_IDS, PERSON_REPLACEMENT_VIDEO_REFERENCE_KIND_CHARACTER_IMAGE, getPersonReplacementActiveVideoResultIndex, getPersonReplacementVideoResults, resolvePersonReplacementVideoGenerationFps, resolvePersonReplacementVideoImageInput, resolvePersonReplacementVideoParameterPolicy, resolvePersonReplacementVideoResultRef } from './personReplacementProject.js';
import { isPersonReplacementVideoGenerationActive, resolvePersonReplacementVideoGenerationState } from './personReplacementVideoGeneration.js';
import { resolvePersonReplacementVideoSlotState } from './personReplacementVideoInputs.js';
import { localPathToUrl } from '../../utils/localMediaPath.js';
import { renderAIGenVideoModelSelectorMarkup } from '../../components/aigenVideo/modelSelector.js';
import { VIDEO_CLIP_ICON_SVG } from '../../components/nodeToolbar/videoToolbarHtml.js';
import { getModelManifest, resolveModelProvider } from '../../manifests/index.js';
import { renderWorkspaceAssetLoadingOverlay } from '../workspaceAssetPresentation.js';
import { renderPersonReplacementPreviewArrow } from './personReplacementAssetPresentation.js';
import { renderWorkspaceVideoPlaybackControls } from '../workspaceVideoPlaybackControls.js';
import { renderWorkspaceVideoDownloadButton } from '../workspaceVideoDownload.js';
import { renderWorkspaceUploadIcon } from '../workspaceActionIcons.js';
import { normalizePersonReplacementLayout } from './personReplacementProjectSession.js';
import { renderPersonReplacementPromptHtml } from './personReplacementPromptMentions.js';
export const PERSON_REPLACEMENT_VIDEO_GENERATION_BLOCK_REASONS = Object["freeze"]({
  'MISSING_SHOT': "missing-shot",
  'GENERATION_RUNNING': "generation-running",
  'SOURCE_PREPARING': "source-preparing",
  'SOURCE_PREPARATION_FAILED': "source-preparation-failed",
  'MISSING_SOURCE_VIDEO': "missing-source-video",
  'MISSING_IMAGE_INPUT': 'missing-image-input'
});
function normalizeText(_0x5338c7) {
  return String(_0x5338c7 ?? '')["trim"]();
}
function resolveVideoResultPosterRef(_0xec1c47, _0x506669) {
  const _0x2a8d12 = normalizeText(_0xec1c47?.["posterLocalPath"] || _0xec1c47?.["thumbLocalPath"] || _0xec1c47?.["posterUrl"] || _0xec1c47?.["thumbUrl"] || _0xec1c47?.["thumbnailLocalPath"] || _0xec1c47?.["thumbnailUrl"] || _0xec1c47?.['coverUrl']);
  if (_0x2a8d12) {
    return _0x2a8d12;
  }
  return normalizeText(_0xec1c47?.['source'])["toLowerCase"]() === "upload" ? '' : normalizeText(_0x506669?.['replacementImageRef'] || _0x506669?.['keyframeRef']);
}
function buildVideoStageFrameStyle(_0x1f8ea2 = {}) {
  const _0x5a144d = Math["max"](0x1, Number(_0x1f8ea2?.["frame"]?.["width"]) || 0x10);
  const _0x5b8d5f = Math["max"](0x1, Number(_0x1f8ea2?.["frame"]?.['height']) || 0x9);
  return '--frame-aspect:' + _0x5a144d + " / " + _0x5b8d5f + ';' + ("--frame-width:" + _0x5a144d + ";--frame-height:" + _0x5b8d5f);
}
export function syncPersonReplacementVideoStageFrame(_0x504ab2) {
  const _0xdecc2e = Math["max"](0x0, Number(_0x504ab2?.["videoWidth"]) || 0x0);
  const _0x17c1f2 = Math["max"](0x0, Number(_0x504ab2?.["videoHeight"]) || 0x0);
  const _0x343b87 = _0x504ab2?.["closest"]?.("[data-person-replacement-video-playback-stage]");
  if (!(_0xdecc2e > 0x0 && _0x17c1f2 > 0x0) || !_0x343b87?.["style"]) {
    return ![];
  }
  _0x343b87["style"]["setProperty"]("--frame-aspect", _0xdecc2e + " / " + _0x17c1f2);
  _0x343b87['style']["setProperty"]('--frame-width', String(_0xdecc2e));
  _0x343b87["style"]["setProperty"]("--frame-height", String(_0x17c1f2));
  return !![];
}
function normalizeProgress(_0xaf3cde) {
  const _0x438e95 = Number(_0xaf3cde);
  if (!Number["isFinite"](_0x438e95)) {
    return 0x0;
  }
  return Math['max'](0x0, Math["min"](0x64, _0x438e95));
}
function resolveSelectedShot(_0x5c0158 = {}, _0x544ac3 = '') {
  const _0x40287f = Array["isArray"](_0x5c0158?.["shots"]) ? _0x5c0158["shots"] : [];
  const _0x5f24a5 = normalizeText(_0x544ac3 || _0x5c0158?.["workspace"]?.['selectedShotId']);
  return _0x40287f["find"](_0x24e9a => normalizeText(_0x24e9a?.['id']) === _0x5f24a5) || _0x40287f[0x0] || null;
}
function buildPreparationPresentation(_0x578bde, _0x46f42e, _0x284c80, _0x429be5) {
  const _0x30a857 = _0x578bde?.["workspace"]?.["videoPreparation"];
  const _0x5c53e9 = _0x30a857 && typeof _0x30a857 === "object" && !Array["isArray"](_0x30a857) ? _0x30a857 : {};
  const _0x5af7fa = normalizeText(_0x5c53e9['status'])['toLowerCase']() || "idle";
  const _0x3904d3 = normalizeText(_0x46f42e?.["materializationStatus"])["toLowerCase"]() || 'idle';
  const _0x5d76db = !_0x429be5 && Boolean(_0x284c80?.["pending"] === !![] || _0x3904d3 === "running" || _0x5af7fa === 'running');
  const _0x2404f6 = !_0x429be5 && Boolean(_0x3904d3 === 'failed' || _0x5af7fa === "failed" && normalizeText(_0x5c53e9["error"]));
  const _0x179a8a = _0x3904d3 === "running" ? normalizeProgress(_0x46f42e?.['materializationProgress']) : normalizeProgress(_0x5c53e9["progress"]);
  return {
    'status': _0x5af7fa,
    'progress': _0x179a8a,
    'error': normalizeText(_0x46f42e?.["error"] || _0x5c53e9['error']),
    'materializationStatus': _0x3904d3,
    'isRunning': _0x5af7fa === "running" || _0x3904d3 === "running",
    'sourcePending': _0x5d76db,
    'sourceFailed': _0x2404f6
  };
}
function buildGenerationEligibility({
  shot: _0x4fbe99,
  generation: _0x227d02,
  preparation: _0x430b89,
  sourceReady: _0x1f501e,
  imageInput: _0xf05f8d
}) {
  if (!_0x4fbe99) {
    return {
      'canGenerate': ![],
      'reason': PERSON_REPLACEMENT_VIDEO_GENERATION_BLOCK_REASONS["MISSING_SHOT"]
    };
  }
  if (_0x227d02["isActive"]) {
    return {
      'canGenerate': ![],
      'reason': PERSON_REPLACEMENT_VIDEO_GENERATION_BLOCK_REASONS["GENERATION_RUNNING"]
    };
  }
  if (_0x430b89['sourcePending']) {
    return {
      'canGenerate': ![],
      'reason': PERSON_REPLACEMENT_VIDEO_GENERATION_BLOCK_REASONS["SOURCE_PREPARING"]
    };
  }
  if (_0x430b89["sourceFailed"]) {
    return {
      'canGenerate': ![],
      'reason': PERSON_REPLACEMENT_VIDEO_GENERATION_BLOCK_REASONS["SOURCE_PREPARATION_FAILED"]
    };
  }
  if (!_0x1f501e) {
    return {
      'canGenerate': ![],
      'reason': PERSON_REPLACEMENT_VIDEO_GENERATION_BLOCK_REASONS['MISSING_SOURCE_VIDEO']
    };
  }
  if (_0xf05f8d["status"] !== "ready") {
    return {
      'canGenerate': ![],
      'reason': PERSON_REPLACEMENT_VIDEO_GENERATION_BLOCK_REASONS["MISSING_IMAGE_INPUT"]
    };
  }
  return {
    'canGenerate': !![],
    'reason': ''
  };
}
function buildOutputPresentation(_0x1c0cc7, _0x9ea610) {
  const _0x4a9d5a = _0x1c0cc7?.["output"] && typeof _0x1c0cc7["output"] === "object" && !Array["isArray"](_0x1c0cc7['output']) ? _0x1c0cc7['output'] : {};
  const _0x3a24f3 = normalizeText(_0x4a9d5a["composeStatus"])["toLowerCase"]() || "idle";
  const _0x25c940 = normalizeText(_0x4a9d5a["originalMasterRef"]);
  const _0x817033 = normalizeText(_0x4a9d5a["visualMasterRef"]);
  const _0x207094 = normalizeText(_0x4a9d5a["finalVideoRef"]);
  const _0x18e448 = normalizeText(_0x4a9d5a["finalAudioTrack"]);
  const _0xa6d0a9 = Array["isArray"](_0x4a9d5a["composedShotIds"]) ? _0x4a9d5a["composedShotIds"]['map'](normalizeText)['filter'](Boolean) : [];
  const _0x3816aa = _0x207094 || _0x817033;
  return {
    'composeStatus': _0x3a24f3,
    'originalMasterRef': _0x25c940,
    'visualMasterRef': _0x817033,
    'finalVideoRef': _0x207094,
    'finalAudioTrack': _0x18e448,
    'composedShotIds': _0xa6d0a9,
    'previewVideoRef': _0x3816aa,
    'compositionAvailable': Boolean(_0x3a24f3 === "succeeded" && _0x25c940 && _0x3816aa),
    'finalVideoAvailable': Boolean(_0x207094),
    'selectedShotComposed': Boolean(_0x9ea610 && _0xa6d0a9["includes"](_0x9ea610))
  };
}
export function buildPersonReplacementVideoPresentation(_0x358070 = {}, {
  shotId: _0x5dddeb = ''
} = {}) {
  const _0x2c1bd3 = resolveSelectedShot(_0x358070, _0x5dddeb);
  const _0x3ac99e = normalizeText(_0x2c1bd3?.['id']);
  const _0x21c212 = resolvePersonReplacementVideoImageInput(_0x358070, _0x2c1bd3);
  const _0x259e04 = resolvePersonReplacementVideoSlotState(_0x358070, _0x2c1bd3);
  const _0x5842bc = resolvePersonReplacementVideoGenerationState(_0x358070?.['workspace'], _0x3ac99e);
  const _0x278bf4 = {
    ..._0x5842bc,
    'isActive': isPersonReplacementVideoGenerationActive(_0x5842bc)
  };
  const _0x310f73 = getPersonReplacementVideoResults(_0x2c1bd3);
  const _0x4aeab4 = getPersonReplacementActiveVideoResultIndex(_0x2c1bd3, _0x310f73);
  const _0x9663d = _0x310f73[_0x4aeab4] || null;
  const _0x36e478 = resolvePersonReplacementVideoResultRef(_0x9663d);
  const _0x500bf5 = _0x259e04["inputsBySlot"]?.["sourceVideo"] || null;
  const _0x3e9dd4 = Boolean(_0x259e04["slotEntries"]?.["sourceVideo"]?.["url"]);
  const _0x20d136 = buildPreparationPresentation(_0x358070, _0x2c1bd3, _0x500bf5, _0x3e9dd4);
  const _0x2f70a6 = {
    'sourceRef': normalizeText(_0x3e9dd4 ? _0x500bf5?.["url"] : ''),
    'sourceInputRef': normalizeText(_0x500bf5?.["url"]),
    'sourcePosterRef': normalizeText(_0x500bf5?.['thumbUrl']),
    'sourceReady': _0x3e9dd4,
    'sourcePending': _0x20d136['sourcePending'],
    'resultRef': _0x36e478 || normalizeText(_0x2c1bd3?.["resultVideoRef"]),
    'resultPosterRef': resolveVideoResultPosterRef(_0x9663d, _0x2c1bd3)
  };
  return {
    'shot': _0x2c1bd3,
    'shotId': _0x3ac99e,
    'imageInput': _0x21c212,
    'slotState': _0x259e04,
    'generation': _0x278bf4,
    'preparation': _0x20d136,
    'history': {
      'results': _0x310f73,
      'activeIndex': _0x4aeab4,
      'activeResult': _0x9663d,
      'activeResultRef': _0x36e478,
      'count': _0x310f73["length"],
      'hasMultipleResults': _0x310f73['length'] > 0x1
    },
    'media': _0x2f70a6,
    'eligibility': buildGenerationEligibility({
      'shot': _0x2c1bd3,
      'generation': _0x278bf4,
      'preparation': _0x20d136,
      'sourceReady': _0x3e9dd4,
      'imageInput': _0x21c212
    }),
    'output': buildOutputPresentation(_0x358070, _0x3ac99e)
  };
}
function escapeHtml(_0x78d669) {
  return String(_0x78d669 ?? '')["replaceAll"]('&', "&amp;")["replaceAll"]('<', "&lt;")["replaceAll"]('>', "&gt;")['replaceAll']('\x22', "&quot;")["replaceAll"]('\x27', "&#39;");
}
function normalizeMediaUrl(_0x162521) {
  const _0xac76e1 = normalizeText(_0x162521);
  return _0xac76e1 ? localPathToUrl(_0xac76e1) || _0xac76e1 : '';
}
function renderVideoInputModeControl(_0x10bf09) {
  const _0x5d2448 = _0x10bf09["settings"]['replacementVideoInputMode'] !== PERSON_REPLACEMENT_VIDEO_INPUT_MODE_CHARACTER_REFERENCE;
  const _0x3bc46f = _0x5d2448 ? PERSON_REPLACEMENT_VIDEO_INPUT_MODE_CHARACTER_REFERENCE : PERSON_REPLACEMENT_VIDEO_INPUT_MODE_FIRST_FRAME;
  const _0x283f73 = _0x5d2448 ? "替换首帧" : "人物参考图";
  const _0x13e08e = _0x5d2448 ? "替换首帧：从左侧选择图像替换结果，作为生成视频的参考首帧。点击切换为人物参考图。" : "人物参考图：可从左侧选择任一已绑定的人物形象或图像替换结果，作为生成视频的参考图。点击切换为替换首帧。";
  return '<div\x20class=\x22person-replacement-video-input-mode\x22\x20role=\x22group\x22\x20aria-label=\x22视频替换入参模式\x22>\x0a\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-secondary-button\x20person-replacement-toggle-button\x22\x20data-person-replacement-action=\x22set-video-input-mode\x22\x20data-person-replacement-video-input-mode=\x22' + _0x3bc46f + "\" aria-pressed=\"" + _0x5d2448 + '\x22\x20data-tooltip=\x22' + _0x13e08e + '\x22>' + _0x283f73 + "</button>\n  </div>";
}
function renderVideoNodeCenterPlayIndicator() {
  return "<span class=\"video-center-indicator person-replacement-video-center-indicator\" data-person-replacement-video-center-play aria-hidden=\"true\"><span class=\"indicator-inner\"><svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><polygon points=\"6 4 20 12 6 20 6 4\"></polygon></svg></span></span>";
}
function renderVideoReplacementPlaybackControls(_0x1e454c = {}, {
  role = 'source',
  context = 'video-replacement',
  disabled = ![]
} = {}) {
  const _0x55cf81 = context === "comparison";
  const _0x28c082 = role === "result" ? "result" : "source";
  const _0x222f50 = _0x55cf81 ? "原视频和替换视频" : _0x28c082 === "result" ? "替换结果" : "当前片段";
  return renderWorkspaceVideoPlaybackControls({
    'label': _0x222f50,
    'disabled': disabled,
    'className': _0x55cf81 ? "person-replacement-video-playback-controls person-replacement-compare-playback-controls" : "person-replacement-video-playback-controls",
    'controlsAttributes': _0x55cf81 ? {
      'data-person-replacement-compare-playback-controls': !![]
    } : {
      'data-person-replacement-video-controls': _0x28c082,
      'data-person-replacement-video-label': _0x222f50
    },
    'playAttributes': _0x55cf81 ? {
      'data-person-replacement-compare-playback-control': !![],
      'data-person-replacement-action': "toggle-comparison-playback",
      'aria-pressed': "false"
    } : {
      'data-person-replacement-video-play': !![]
    },
    'currentTimeAttributes': {
      [_0x55cf81 ? "data-person-replacement-compare-current-time" : "data-person-replacement-video-time-current"]: !![]
    },
    'progressAttributes': {
      [_0x55cf81 ? "data-person-replacement-compare-progress" : "data-person-replacement-video-progress"]: !![]
    },
    'progressFillAttributes': {
      [_0x55cf81 ? 'data-person-replacement-compare-progress-fill' : 'data-person-replacement-video-progress-fill']: !![]
    },
    'totalTimeAttributes': {
      [_0x55cf81 ? "data-person-replacement-compare-total-time" : 'data-person-replacement-video-time-total']: !![]
    },
    'volumeAttributes': {
      [_0x55cf81 ? "data-person-replacement-compare-volume" : 'data-person-replacement-video-volume']: !![]
    },
    'volumeToggleAttributes': {
      [_0x55cf81 ? "data-person-replacement-compare-volume-toggle" : 'data-person-replacement-video-volume-toggle']: !![]
    },
    'playLabel': '播放' + _0x222f50,
    'progressLabel': _0x55cf81 ? "同步播放进度" : _0x222f50 + '播放进度',
    'volumeLabel': _0x222f50 + '音量',
    'volumeToggleLabel': '静音' + _0x222f50,
    'slots': {
      'afterPlay': !_0x55cf81 && _0x28c082 === 'result' ? "<button type=\"button\" class=\"person-replacement-video-sync-toggle\" data-person-replacement-action=\"toggle-video-replacement-sync-playback\" data-person-replacement-video-sync-play data-tooltip=\"同步播放\" aria-label=\"开启同步播放\" aria-pressed=\"false\">\n      <svg class=\"person-replacement-video-sync-icon\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.15-1.15\"></path></svg>\n    </button>" : '',
      'beforeVolume': !_0x55cf81 && _0x28c082 === 'source' ? '<button\x20type=\x22button\x22\x20class=\x22video-snap-btn\x20story-video-snap-btn\x20story-video-clip-btn\x22\x20data-person-replacement-action=\x22trim-current-video\x22\x20data-shot-id=\x22' + escapeHtml(_0x1e454c['id']) + '\x22\x20aria-label=\x22裁剪当前片段\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + VIDEO_CLIP_ICON_SVG + "\n      </button>" : ''
    }
  });
}
function renderVideoReplacementPreview(_0x5bb5a2, _0x1b2dce, _0x2ac794) {
  const _0x4c7da2 = _0x1b2dce?.["shot"] || null;
  const _0x282d56 = _0x1b2dce?.['media'] || {};
  const _0x3be62a = Math["max"](0x0, _0x5bb5a2["shots"]["indexOf"](_0x4c7da2));
  const _0xb00a34 = _0x4c7da2?.['title'] || '片段' + String(_0x3be62a + 0x1)["padStart"](0x2, '0');
  const _0x2b8923 = _0x5bb5a2["shots"]["length"] > 0x1;
  const _0x2d6104 = _0x2b8923 ? '' + renderPersonReplacementPreviewArrow("previous", {
    'action': "previous-shot",
    'label': '上一个片段',
    'className': "person-replacement-shot-navigation-arrow person-replacement-video-shot-navigation-arrow"
  }) + renderPersonReplacementPreviewArrow("next", {
    'action': "next-shot",
    'label': "下一个片段",
    'className': "person-replacement-shot-navigation-arrow person-replacement-video-shot-navigation-arrow"
  }) : '';
  const _0x554091 = _0x2b8923 ? " data-person-replacement-shot-wheel=\"true\" aria-label=\"滚动鼠标滚轮切换原视频片段\"" : '';
  if (!_0x282d56["sourceReady"]) {
    return "<div class=\"person-replacement-video-preview-panel person-replacement-middle-preview-slide\" aria-label=\"" + escapeHtml(_0xb00a34 + '原视频片段') + "\">\n      <div class=\"story-video-result person-replacement-video-preview\"" + _0x554091 + "><div class=\"person-replacement-inline-empty\">" + escapeHtml(_0x2ac794) + '</div>' + _0x2d6104 + "</div>\n    </div>";
  }
  const _0x452615 = normalizeMediaUrl(_0x282d56["sourceRef"]);
  const _0x377f66 = normalizeMediaUrl(_0x282d56["sourcePosterRef"]);
  const _0x5b2e00 = buildVideoStageFrameStyle(_0x4c7da2);
  return "<div class=\"person-replacement-video-preview-panel person-replacement-middle-preview-slide\" aria-label=\"" + escapeHtml(_0xb00a34 + "原视频片段") + "\">\n    <div class=\"story-video-result person-replacement-video-preview\"" + _0x554091 + '>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-video-stage\x20person-replacement-video-stage\x22\x20data-person-replacement-video-stage\x20data-person-replacement-video-playback-stage=\x22source\x22\x20data-person-replacement-video-url=\x22' + escapeHtml(_0x452615) + '\x22\x20data-person-replacement-video-poster=\x22' + escapeHtml(_0x377f66) + "\" data-person-replacement-video-reversed=\"" + (_0x4c7da2["materializedIsReversed"] === !![]) + "\" data-person-replacement-video-center-stage data-shot-id=\"" + escapeHtml(_0x4c7da2['id']) + "\" style=\"" + _0x5b2e00 + "\">\n        <video data-person-replacement-video-player=\"source\" data-person-replacement-video-center-player data-person-replacement-video-url=\"" + escapeHtml(_0x452615) + "\" playsinline preload=\"metadata\" " + (_0x377f66 ? 'poster=\x22' + escapeHtml(_0x377f66) + '\x22' : '') + '\x20aria-label=\x22' + escapeHtml(_0xb00a34 + "原视频片段") + '\x22></video>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + renderVideoNodeCenterPlayIndicator() + "\n        " + renderVideoReplacementPlaybackControls(_0x4c7da2, {
    'role': "source"
  }) + "\n      </div>\n      " + _0x2d6104 + "\n    </div>\n  </div>";
}
function renderVideoReplacementResult(_0x30e2ae, {
  isGenerating = ![]
} = {}) {
  const _0x3f8875 = _0x30e2ae?.["shot"] || null;
  const _0x48e719 = _0x30e2ae?.["history"] || {};
  const _0x3f653c = _0x30e2ae?.["media"] || {};
  const _0x18a36f = Number(_0x48e719["activeIndex"]) || 0x0;
  const _0x103b7e = normalizeText(_0x3f653c['resultRef']);
  const _0x525ffa = _0x48e719["hasMultipleResults"] === !![];
  const _0x5416bc = _0x525ffa ? '' + renderPersonReplacementPreviewArrow("previous", {
    'action': "previous-replacement-video-result",
    'label': '上一个生成版本',
    'className': "person-replacement-video-result-arrow"
  }) + renderPersonReplacementPreviewArrow("next", {
    'action': "next-replacement-video-result",
    'label': "下一个生成版本",
    'className': "person-replacement-video-result-arrow"
  }) : '';
  const _0x1ae025 = _0x525ffa ? " data-person-replacement-video-result-wheel=\"true\" aria-label=\"滚动鼠标滚轮切换生成版本\"" : '';
  const _0x36a480 = isGenerating ? renderWorkspaceAssetLoadingOverlay({
    'title': _0x30e2ae?.["generation"]?.['status'] === "queued" ? "替换视频排队中" : "替换视频生成中",
    'description': _0x30e2ae?.['generation']?.['status'] === "queued" ? "RunningHub 并发已占满，释放名额后会自动开始。" : "正在等待生成结果，完成后会自动显示。"
  }) : '';
  const _0x29994c = normalizeMediaUrl(_0x103b7e);
  const _0x697f49 = normalizeMediaUrl(_0x3f653c["resultPosterRef"]);
  const _0x7f632c = Math['max'](Number(_0x48e719["count"]) || 0x0, _0x103b7e ? 0x1 : 0x0);
  const _0x5cf7a0 = buildVideoStageFrameStyle(_0x3f8875);
  const _0x5d82f0 = _0x103b7e ? "<div class=\"story-video-stage person-replacement-video-stage person-replacement-video-result-stage\" data-person-replacement-video-playback-stage=\"result\" data-person-replacement-video-url=\"" + escapeHtml(_0x29994c) + "\" data-person-replacement-video-poster=\"" + escapeHtml(_0x697f49) + '\x22\x20data-person-replacement-video-center-stage\x20data-shot-id=\x22' + escapeHtml(_0x3f8875?.['id'] || '') + "\" style=\"" + _0x5cf7a0 + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<video\x20data-person-replacement-video-player=\x22result\x22\x20data-person-replacement-video-center-player\x20data-person-replacement-video-url=\x22' + escapeHtml(_0x29994c) + "\" playsinline preload=\"metadata\"" + (_0x697f49 ? " poster=\"" + escapeHtml(_0x697f49) + '\x22' : '') + " aria-label=\"替换视频生成版本 " + (_0x18a36f + 0x1) + '/' + _0x7f632c + "\"></video>\n        " + (isGenerating ? '' : renderVideoNodeCenterPlayIndicator()) + "\n        " + (isGenerating ? '' : renderVideoReplacementPlaybackControls(_0x3f8875, {
    'role': 'result'
  })) + '\x0a\x20\x20\x20\x20\x20\x20</div>' : "<span>生成视频显示在这里</span>";
  const _0x3aa06d = '<div\x20class=\x22story-asset-preview-actions\x20person-replacement-result-actions\x22>\x0a\x20\x20\x20\x20' + renderWorkspaceVideoDownloadButton({
    'enabled': Boolean(_0x103b7e),
    'className': 'person-replacement-result-download'
  }) + '\x0a\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-upload-replace\x20story-character-voice-upload-button\x20person-replacement-result-upload\x22\x20data-story-action=\x22upload-replacement-video\x22\x20aria-label=\x22上传替换视频\x22\x20title=\x22上传替换视频\x22\x20' + (!_0x3f8875 || isGenerating ? "disabled" : '') + '>' + renderWorkspaceUploadIcon() + "</button>\n  </div>";
  return "<div class=\"person-replacement-generation-preview person-replacement-video-result" + (isGenerating ? " img-preview-loading" : '') + "\" aria-busy=\"" + isGenerating + '\x22' + _0x1ae025 + '><div\x20class=\x22person-replacement-video-result-slide\x22>' + _0x5d82f0 + "</div>" + _0x3aa06d + _0x5416bc + _0x36a480 + "</div>";
}
function renderVideoReplacementGenerateButton(_0x223bf8, {
  presentation = {},
  shotBatchGenerationActive = ![],
  shotBatchGeneratingShotIds = [],
  shotBatchCancelRequested = ![]
} = {}) {
  const _0x1a74e6 = presentation["shot"] || null;
  const _0x19bd26 = _0x223bf8["workspace"]["shotSelectionMode"] === !![];
  const _0x2be61e = Array["isArray"](_0x223bf8["workspace"]['selectedShotIds']) ? _0x223bf8['workspace']["selectedShotIds"]['length'] : 0x0;
  const _0x4719ab = Boolean(_0x1a74e6?.['id'] && (presentation["generation"]?.["isActive"] && normalizeText(presentation["generation"]["shotId"]) === normalizeText(_0x1a74e6['id']) || Array['isArray'](shotBatchGeneratingShotIds) && shotBatchGeneratingShotIds['includes'](_0x1a74e6['id'])));
  const _0x1a454f = Boolean(!_0x19bd26 && presentation["generation"]?.["isActive"] && normalizeText(presentation["generation"]["shotId"]) === normalizeText(_0x1a74e6?.['id']));
  const _0x42ecbf = _0x2be61e ? '\x20(' + _0x2be61e + ')' : '';
  const _0x442274 = _0x19bd26 ? shotBatchGenerationActive ? shotBatchCancelRequested ? "正在停止" + _0x42ecbf : '取消运行' + _0x42ecbf : '批量生成视频' + _0x42ecbf : _0x1a454f ? '取消运行' : _0x4719ab ? "生成中" : "生成视频";
  const _0x399b94 = _0x19bd26 ? !_0x2be61e || shotBatchCancelRequested : !_0x1a454f && (!presentation["eligibility"]?.["canGenerate"] || _0x4719ab);
  return "<button type=\"button\" class=\"story-asset-generate-button\" aria-busy=\"" + shotBatchGenerationActive + '\x22\x20data-person-replacement-action=\x22generate-replacement-video\x22\x20' + (_0x399b94 ? "disabled" : '') + '>' + escapeHtml(_0x442274) + "</button>";
}
function renderVideoReplacementPage(_0x109aa8, _0x15ff66, {
  buildIdentityView: _0x38ec3b,
  renderShotTimeline: _0x52d6ac,
  renderLayoutSplitter: _0x79420b,
  renderFooter: _0x336ba4
}) {
  const _0xb8af19 = buildPersonReplacementVideoPresentation(_0x109aa8);
  const _0x34ff29 = _0x38ec3b(_0x109aa8, _0xb8af19);
  const _0x9e2745 = _0xb8af19["shot"];
  const _0xa43681 = _0xb8af19["generation"];
  const _0x2257fe = _0xb8af19["preparation"];
  const _0x5c309f = _0xb8af19["imageInput"];
  const _0x18f154 = _0xa43681['isActive'] || Boolean(Array["isArray"](_0x15ff66["shotBatchGeneratingShotIds"]) && _0x15ff66['shotBatchGeneratingShotIds']["includes"](_0x9e2745?.['id']));
  const _0x1e4c0a = _0x2257fe['materializationStatus'] === 'running' ? "正在切片并统一为 " + (_0x9e2745["outputFps"] || 0x18) + " FPS…" : _0x2257fe["materializationStatus"] === 'failed' ? _0x2257fe["error"] || "镜头切片失败" : _0x2257fe["status"] === "running" ? "正在准备视频片段 " + Math["round"](_0x2257fe['progress']) + '%' : "进入视频替换时生成固定帧率片段";
  const _0x3f2be8 = _0x109aa8['settings']["replacementModelId"] || PERSON_REPLACEMENT_DEFAULT_VIDEO_MODEL_ID;
  const _0x4ec321 = resolveModelProvider(_0x3f2be8);
  const _0x3c4a1f = getModelManifest(_0x3f2be8)?.['prompt'];
  const _0xa4be78 = _0x9e2745?.["videoPrompt"] || (_0x3c4a1f?.["emptyPolicy"] === "allow" ? '' : PERSON_REPLACEMENT_DEFAULT_VIDEO_PROMPT);
  const _0x41274a = normalizeText(_0x3c4a1f?.["placeholder"]) || '描述视频人物替换效果';
  const _0x794e3e = _0x41274a + "；输入 / 选择预设";
  const _0x49275d = resolvePersonReplacementVideoParameterPolicy({
    'modelId': _0x3f2be8,
    'inputMode': _0x109aa8['settings']['replacementVideoInputMode'],
    'generationParams': _0x109aa8["settings"]['replacementVideoGenerationParams']
  });
  const _0xd28564 = {
    ..._0x49275d["generationParams"],
    'rhVideoFps': resolvePersonReplacementVideoGenerationFps(_0x109aa8["settings"])
  };
  const _0x349ab5 = _0x5c309f["referenceKind"] === PERSON_REPLACEMENT_VIDEO_REFERENCE_KIND_CHARACTER_IMAGE ? "人物参考图" : '替换首帧';
  const _0x4e2efb = normalizePersonReplacementLayout(_0x109aa8["workspace"]["replacementLayout"]);
  const _0x4259a1 = '--person-replacement-left-width:' + _0x4e2efb["left"] + '%;' + ("--person-replacement-right-width:" + _0x4e2efb['right'] + '%;') + ('--person-replacement-center-top:' + _0x4e2efb["centerTop"] + '%;');
  return "<div class=\"person-replacement-production-page\">\n    <div class=\"person-replacement-four-panel-layout\" data-person-replacement-layout style=\"" + _0x4259a1 + "\">\n      " + _0x34ff29['referenceRailHtml'] + '\x0a\x20\x20\x20\x20\x20\x20' + _0x79420b("left", _0x4e2efb) + "\n      <section class=\"person-replacement-keyframe-panel person-replacement-middle-layout person-replacement-video-middle-layout\">" + renderVideoReplacementPreview(_0x109aa8, _0xb8af19, _0x1e4c0a) + _0x79420b("center", _0x4e2efb) + _0x52d6ac(_0x109aa8, {
    'timelineMode': "video",
    'shotBatchGenerationActive': _0x15ff66["shotBatchGenerationActive"],
    'shotBatchGenerationLabel': _0x15ff66["shotBatchGenerationLabel"],
    'shotBatchGeneratingShotIds': _0x15ff66["shotBatchGeneratingShotIds"],
    'shotBatchCancelRequested': _0x15ff66["shotBatchCancelRequested"]
  }) + "</section>\n      " + _0x79420b("right", _0x4e2efb) + "\n      <aside class=\"person-replacement-generation-panel person-replacement-video-generation-panel\">\n        " + renderVideoReplacementResult(_0xb8af19, {
    'isGenerating': _0x18f154
  }) + "\n        " + _0x79420b("center", _0x4e2efb, {
    'label': '调整结果预览与提示词区域高度'
  }) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-asset-detail-copy\x20person-replacement-generation-copy\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-asset-prompt-field\x20person-replacement-prompt-field\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22person-replacement-prompt-field-heading\x22\x20role=\x22group\x22\x20aria-label=\x22模型入参\x22><div\x20class=\x22person-replacement-video-prompt-heading-actions\x22><div\x20class=\x22person-replacement-prompt-reference-inputs\x22\x20data-person-replacement-video-reference-inputs>' + _0x34ff29["referenceInputsHtml"] + "</div>" + renderVideoInputModeControl(_0x109aa8) + "</div></div>\n            <div class=\"prompt-input-wrapper is-resizable person-replacement-prompt-input-wrapper\"><div class=\"prompt-textarea custom-textarea story-asset-prompt-editor person-replacement-prompt-editor\" contenteditable=\"true\" role=\"textbox\" aria-multiline=\"true\" aria-label=\"视频替换提示词\" spellcheck=\"false\" data-placeholder=\"" + escapeHtml(_0x794e3e) + "\" data-person-replacement-field=\"video-prompt\" data-shot-id=\"" + escapeHtml(_0x9e2745?.['id'] || '') + '\x22>' + renderPersonReplacementPromptHtml(_0xa4be78) + "</div></div>\n          </div>\n          " + (_0x5c309f["status"] === "ready" ? '' : "<p class=\"person-replacement-reference-note\">" + escapeHtml(_0x349ab5 + '：' + _0x5c309f["message"]) + "</p>") + "\n          <div class=\"story-asset-generation-bar prompt-panel-footer\">" + renderAIGenVideoModelSelectorMarkup({
    'modelId': _0x3f2be8,
    'provider': _0x4ec321,
    'generationParams': _0xd28564,
    'uiSchemaFieldState': _0x49275d["uiSchemaFieldState"],
    'providerProfileId': _0x109aa8['settings']['replacementVideoProviderProfileId'],
    'providerProfileIdByModel': _0x109aa8['settings']["replacementVideoProviderProfileIdByModel"],
    'referenceCounts': _0xb8af19["slotState"]['referenceCounts'],
    'showSchemaControls': !![],
    'allowedModelIds': PERSON_REPLACEMENT_VIDEO_MODEL_IDS,
    'className': "person-replacement-video-model-selector"
  }) + renderRequestDebugButton("data-story-action=\"debug-generation-video\"") + renderVideoReplacementGenerateButton(_0x109aa8, {
    'presentation': _0xb8af19,
    ..._0x15ff66
  }) + "</div>\n          " + (_0xa43681["error"] ? "<p class=\"person-replacement-error\">" + escapeHtml(_0xa43681['error']) + '</p>' : '') + "\n        </div>\n      </aside>\n    </div>" + _0x336ba4(_0x109aa8, {
    'nextLabel': "进入声音克隆"
  }) + "\n  </div>";
}
function cloneFrozenPresentationValue(_0x5891d0) {
  if (Array["isArray"](_0x5891d0)) {
    return Object["freeze"](_0x5891d0['map'](cloneFrozenPresentationValue));
  }
  if (!_0x5891d0 || typeof _0x5891d0 !== "object") {
    return _0x5891d0;
  }
  return Object['freeze'](Object["fromEntries"](Object["entries"](_0x5891d0)['map'](([_0x5b99fc, _0x4dae80]) => [_0x5b99fc, cloneFrozenPresentationValue(_0x4dae80)])));
}
function buildReadonlyVideoPresentation(_0x45ce5b, _0x2dd448) {
  const _0x56b51a = buildPersonReplacementVideoPresentation(_0x45ce5b, _0x2dd448);
  return Object["freeze"]({
    'shot': _0x56b51a["shot"] ? cloneFrozenPresentationValue(_0x56b51a['shot']) : null,
    'shotId': _0x56b51a['shotId'],
    'imageInput': cloneFrozenPresentationValue(_0x56b51a["imageInput"]),
    'slotState': cloneFrozenPresentationValue(_0x56b51a['slotState']),
    'generation': cloneFrozenPresentationValue(_0x56b51a["generation"]),
    'preparation': cloneFrozenPresentationValue(_0x56b51a["preparation"]),
    'history': cloneFrozenPresentationValue(_0x56b51a['history']),
    'media': cloneFrozenPresentationValue(_0x56b51a['media']),
    'eligibility': cloneFrozenPresentationValue(_0x56b51a["eligibility"]),
    'output': cloneFrozenPresentationValue(_0x56b51a['output'])
  });
}
export function createPersonReplacementVideoPresentation({
  buildIdentityView = () => ({
    'referenceInputsHtml': '',
    'referenceRailHtml': ''
  }),
  renderShotTimeline = () => '',
  renderLayoutSplitter = () => '',
  renderFooter = () => ''
} = {}) {
  const _0x3339c3 = Object["freeze"]({
    'buildIdentityView': buildIdentityView,
    'renderShotTimeline': renderShotTimeline,
    'renderLayoutSplitter': renderLayoutSplitter,
    'renderFooter': renderFooter
  });
  return Object['freeze']({
    'build': buildReadonlyVideoPresentation,
    'render': (_0x15044d, _0x46ef74 = {}) => renderVideoReplacementPage(_0x15044d, _0x46ef74, _0x3339c3),
    'renderGenerateButton': renderVideoReplacementGenerateButton,
    'renderPlaybackControls': renderVideoReplacementPlaybackControls
  });
}