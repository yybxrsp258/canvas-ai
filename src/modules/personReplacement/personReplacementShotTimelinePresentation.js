import { VIDEO_CLIP_ICON_SVG } from '../../components/nodeToolbar/videoToolbarHtml.js';
import { getMediaClipTimelineRangeRect, getMediaClipTimelineTrackWidthPx } from '../../components/media-clip/mediaClipTimelineModel.js';
import { formatDurationLabel } from '../../components/media-clip/mediaClipUtils.js';
import { resolveMediaClipReverseControlState } from '../../components/media-clip/mediaClipReverseControl.js';
import { localPathToUrl } from '../../utils/localMediaPath.js';
import { renderWorkspaceActionIcon, renderWorkspaceConfirmIcon, renderWorkspaceKeyframeIcon } from '../workspaceActionIcons.js';
import { renderWorkspaceAssetLoadingOverlay, renderWorkspaceCardDeleteControl } from '../workspaceAssetPresentation.js';
import { renderWorkspaceMediaHistoryMenu } from '../workspaceMediaHistory.js';
import { getPersonReplacementActiveImageResultIndex, getPersonReplacementActiveVideoResultIndex, getPersonReplacementImageResults, getPersonReplacementVideoResults, resolvePersonReplacementImageResultRef, resolvePersonReplacementVideoResultRef } from './personReplacementProject.js';
import { resolvePersonReplacementImageGenerationState } from './personReplacementImageGeneration.js';
import { isPersonReplacementVideoGenerationActive, resolvePersonReplacementVideoGenerationState } from './personReplacementVideoGeneration.js';
import { renderPersonReplacementAssetCard, renderPersonReplacementBatchGenerationControl } from './personReplacementAssetPresentation.js';
import { PERSON_REPLACEMENT_CUT_BASE_VIEWPORT_WIDTH_PX, PERSON_REPLACEMENT_CUT_MIN_SEC, canMergePersonReplacementShotCutRanges, canSplitPersonReplacementShotCutRange, countEditablePersonReplacementShotCuts, createPersonReplacementShotCutDraft, getPersonReplacementShotCutDisplayDuration, getPersonReplacementShotCutFrameSec, getPersonReplacementShotCutPositionAtTimelineSec, getPersonReplacementShotCutTimelineSec, getPersonReplacementShotCutTotalDuration, getPersonReplacementShotDurationSec, hasPersonReplacementShotCutUpdateChanges } from './personReplacementShotCutModel.js';
import { getPersonReplacementShotCutRulerFrameRate, hasSplittablePersonReplacementShotCut, renderPersonReplacementShotCutFilmstrip, renderPersonReplacementShotCutRulerTicks } from './personReplacementShotCutRendering.js';
import { resolveShotCutSubmissionUi } from './personReplacementShotReverse.js';
function escapeHtml(_0xefd7bd) {
  return String(_0xefd7bd ?? '')["replaceAll"]('&', "&amp;")["replaceAll"]('<', '&lt;')['replaceAll']('>', '&gt;')["replaceAll"]('\x22', "&quot;")["replaceAll"]('\x27', '&#39;');
}
function normalizeText(_0x3719a7, _0xab467d = '') {
  const _0x32398d = String(_0x3719a7 ?? '')["trim"]();
  return _0x32398d || _0xab467d;
}
function normalizeMediaUrl(_0x2750ae) {
  const _0x329c56 = normalizeText(_0x2750ae);
  return _0x329c56 ? localPathToUrl(_0x329c56) || _0x329c56 : '';
}
function clamp(_0x420696, _0x55a462, _0x61551a, _0x180d71 = _0x55a462) {
  const _0x945b31 = Number(_0x420696);
  return Number['isFinite'](_0x945b31) ? Math["min"](_0x61551a, Math["max"](_0x55a462, _0x945b31)) : _0x180d71;
}
function formatClock(_0x3807b9) {
  const _0x3f7a1d = Math["max"](0x0, Number(_0x3807b9) || 0x0);
  const _0x336cbe = Math["floor"](_0x3f7a1d / 0x3c);
  const _0x5eb331 = Math["floor"](_0x3f7a1d % 0x3c);
  return String(_0x336cbe)["padStart"](0x2, '0') + ':' + String(_0x5eb331)["padStart"](0x2, '0');
}
function formatPreciseClock(_0xe42a16) {
  const _0x1b1a22 = Math["max"](0x0, Number(_0xe42a16) || 0x0);
  const _0x1a04ae = Math["floor"](_0x1b1a22 / 0x3c);
  const _0x1e371e = _0x1b1a22 - _0x1a04ae * 0x3c;
  return String(_0x1a04ae)["padStart"](0x2, '0') + ':' + _0x1e371e['toFixed'](0x2)["padStart"](0x5, '0');
}
function resolvePersonReplacementVideoResultPosterRef(_0x11f284 = {}) {
  if (!_0x11f284 || typeof _0x11f284 !== "object" || Array["isArray"](_0x11f284)) {
    return '';
  }
  return [_0x11f284["posterUrl"], _0x11f284["thumbUrl"], _0x11f284["thumbnailUrl"], _0x11f284['coverUrl'], _0x11f284["posterLocalPath"], _0x11f284["thumbLocalPath"], _0x11f284["thumbnailLocalPath"]]['map'](_0x172b32 => normalizeText(_0x172b32))['find'](Boolean) || '';
}
function renderShotTimelineVideoMedia({
  shot = {},
  title = "镜头片段",
  resultRef = '',
  resultPosterRef = ''
} = {}) {
  const _0x1a6a2a = normalizeText(resultRef);
  const _0x2ea24d = _0x1a6a2a || normalizeText(shot['videoRef']) || normalizeText(shot['sourceVideoRef']);
  if (!_0x2ea24d) {
    return '';
  }
  const _0x29c386 = _0x1a6a2a ? 'result' : "source";
  const _0x39e08b = _0x1a6a2a ? normalizeText(resultPosterRef) : normalizeText(shot["keyframeRef"]);
  const _0x5c84a7 = normalizeMediaUrl(_0x2ea24d);
  const _0xb51315 = normalizeMediaUrl(_0x39e08b);
  const _0xac3ede = _0x29c386 === "result" ? title + "替换视频结果" : title + '原视频片段';
  return "<video class=\"story-asset-card-image person-replacement-shot-card-video\" data-person-replacement-shot-card-video=\"" + _0x29c386 + "\" src=\"" + escapeHtml(_0x5c84a7) + '\x22' + (_0xb51315 ? " poster=\"" + escapeHtml(_0xb51315) + '\x22' : '') + " muted playsinline preload=\"metadata\" aria-label=\"" + escapeHtml(_0xac3ede) + "\" draggable=\"false\"></video>";
}
function renderReplacementResultReferenceButton(_0x35c2f0 = {}, _0x5d4f8b = 0x0, _0x86a738 = "image") {
  const _0x30f0a9 = _0x86a738 === "video";
  const _0x50432e = _0x30f0a9 ? getPersonReplacementVideoResults(_0x35c2f0) : getPersonReplacementImageResults(_0x35c2f0);
  const _0x134bd1 = _0x50432e[_0x5d4f8b];
  const _0x56bc24 = _0x30f0a9 ? resolvePersonReplacementVideoResultRef(_0x134bd1) : resolvePersonReplacementImageResultRef(_0x134bd1);
  if (!_0x56bc24) {
    return '';
  }
  const _0x599904 = _0x56bc24 === normalizeText(_0x30f0a9 ? _0x35c2f0?.["videoIterationReferenceRef"] : _0x35c2f0?.["imageIterationReferenceRef"]);
  const _0x185d41 = _0x30f0a9 ? '视频' : '图片';
  const _0x26e6c1 = _0x599904 ? '取消' + _0x185d41 + '\x20' + (_0x5d4f8b + 0x1) + " 的参考" : '将' + _0x185d41 + '\x20' + (_0x5d4f8b + 0x1) + " 设为参考";
  const _0x1c3e36 = _0x599904 ? "再次点击取消下一轮参考" : _0x30f0a9 ? "设为下一轮视频替换的原视频" : "设为下一轮图像替换的参考";
  return '<button\x20type=\x22button\x22\x20class=\x22story-base-appearance-button\x20person-replacement-result-reference-button' + (_0x599904 ? " is-active" : '') + "\" data-story-action=\"set-replacement-" + _0x86a738 + '-reference\x22\x20data-shot-id=\x22' + escapeHtml(_0x35c2f0?.['id']) + "\" data-replacement-" + _0x86a738 + "-result-index=\"" + _0x5d4f8b + "\" aria-pressed=\"" + _0x599904 + "\" aria-label=\"" + escapeHtml(_0x26e6c1) + "\" title=\"" + escapeHtml(_0x1c3e36) + '\x22>' + (_0x599904 ? "参考中" : "设为参考") + '</button>';
}
function renderReplacementImageHistoryMenu(_0x28bb89 = {}, _0x832f52 = "镜头片段", {
  allowSingleResult = ![]
} = {}) {
  const _0x119ce1 = getPersonReplacementImageResults(_0x28bb89);
  const _0xbdfc4d = getPersonReplacementActiveImageResultIndex(_0x28bb89, _0x119ce1);
  return renderWorkspaceMediaHistoryMenu({
    'title': _0x832f52,
    'results': _0x119ce1,
    'activeIndex': _0xbdfc4d,
    'minimumItemCount': allowSingleResult ? 0x1 : 0x2,
    'countLabel': _0x119ce1["length"] + '\x20张图片',
    'menuLabel': _0x832f52 + '替换图片',
    'getItemLabel': (_0x350bd0, _0x35d89f) => "图片 " + (_0x35d89f + 0x1),
    'getItemStatus': (_0x2a9f70, _0x22a38a) => _0x22a38a === _0xbdfc4d ? '当前使用' : "点击切换",
    'renderMedia': (_0x2ca622, _0x2f357c) => {
      const _0x3dc48f = resolvePersonReplacementImageResultRef(_0x2ca622);
      return _0x3dc48f ? "<img class=\"story-media-history-thumbnail story-clip-video-history-thumbnail\" src=\"" + escapeHtml(normalizeMediaUrl(_0x3dc48f)) + "\" alt=\"" + escapeHtml(_0x832f52 + " · 图片 " + (_0x2f357c + 0x1)) + "\" loading=\"lazy\" draggable=\"false\">" : '';
    },
    'getItemAttributes': (_0x1d8e4f, _0x32f569) => 'data-story-action=\x22select-replacement-image-result\x22\x20data-shot-id=\x22' + escapeHtml(_0x28bb89?.['id']) + "\" data-replacement-image-result-index=\"" + _0x32f569 + '\x22',
    'renderItemAction': (_0x3be70b, _0x37de56) => '' + renderReplacementResultReferenceButton(_0x28bb89, _0x37de56) + (_0x119ce1["length"] > 0x1 ? renderWorkspaceCardDeleteControl({
      'className': "story-media-history-delete",
      'ariaLabel': "删除图片 " + (_0x37de56 + 0x1),
      'actionAttributes': {
        'data-story-action': 'delete-replacement-image-result',
        'data-shot-id': _0x28bb89?.['id'],
        'data-replacement-image-result-index': _0x37de56
      }
    }) : '')
  });
}
function renderReplacementVideoHistoryMenu(_0x2e3b09 = {}, _0x5155af = "镜头片段", {
  allowSingleResult = ![]
} = {}) {
  const _0x2a0346 = getPersonReplacementVideoResults(_0x2e3b09);
  const _0x4e19f6 = getPersonReplacementActiveVideoResultIndex(_0x2e3b09, _0x2a0346);
  return renderWorkspaceMediaHistoryMenu({
    'title': _0x5155af,
    'results': _0x2a0346,
    'activeIndex': _0x4e19f6,
    'minimumItemCount': allowSingleResult ? 0x1 : 0x2,
    'countLabel': _0x2a0346["length"] + " 个视频",
    'menuLabel': _0x5155af + "替换结果视频",
    'getItemLabel': (_0x58cd9f, _0x46100f) => "视频 " + (_0x46100f + 0x1),
    'getItemStatus': (_0x229bc2, _0x365752) => _0x365752 === _0x4e19f6 ? "当前播放" : "点击切换",
    'renderMedia': (_0x43e46b, _0x478511) => {
      const _0x32bc9f = resolvePersonReplacementVideoResultPosterRef(_0x43e46b);
      if (_0x32bc9f) {
        return "<img class=\"story-media-history-thumbnail story-clip-video-history-thumbnail\" src=\"" + escapeHtml(normalizeMediaUrl(_0x32bc9f)) + "\" alt=\"" + escapeHtml(_0x5155af + " · 视频 " + (_0x478511 + 0x1)) + "\" loading=\"lazy\" draggable=\"false\">";
      }
      const _0x4cf9c7 = resolvePersonReplacementVideoResultRef(_0x43e46b);
      return _0x4cf9c7 ? "<video class=\"story-media-history-thumbnail story-clip-video-history-thumbnail\" src=\"" + escapeHtml(normalizeMediaUrl(_0x4cf9c7)) + "\" aria-label=\"" + escapeHtml(_0x5155af + " · 视频 " + (_0x478511 + 0x1)) + "\" muted playsinline preload=\"metadata\"></video>" : '';
    },
    'getItemAttributes': (_0x261a98, _0x4988a5) => "data-story-action=\"select-replacement-video-result\" data-shot-id=\"" + escapeHtml(_0x2e3b09?.['id']) + "\" data-replacement-video-result-index=\"" + _0x4988a5 + '\x22',
    'renderItemAction': (_0x340d51, _0x16cb75) => '' + renderReplacementResultReferenceButton(_0x2e3b09, _0x16cb75, "video") + (_0x2a0346['length'] > 0x1 ? renderWorkspaceCardDeleteControl({
      'className': "story-media-history-delete",
      'ariaLabel': "删除视频 " + (_0x16cb75 + 0x1),
      'actionAttributes': {
        'data-story-action': "delete-replacement-video-result",
        'data-shot-id': _0x2e3b09?.['id'],
        'data-replacement-video-result-index': _0x16cb75
      }
    }) : '')
  });
}
function renderShotTimeline(_0x397bfe, {
  allowCutEditing = ![],
  mode = "image",
  isBatchGenerating = ![],
  batchGeneratingShotIds = [],
  batchCancelRequested = ![]
} = {}) {
  const _0x3899e4 = mode === "video";
  const _0x21a937 = Array['isArray'](_0x397bfe["shots"]) ? _0x397bfe["shots"] : [];
  const _0x4408cd = _0x21a937["reduce"]((_0x534418, _0x509b8c) => _0x534418 + getPersonReplacementShotDurationSec(_0x509b8c), 0x0);
  const _0x236639 = createPersonReplacementShotCutDraft(_0x397bfe);
  const _0x34fdd0 = countEditablePersonReplacementShotCuts(_0x236639);
  const _0x1d5e38 = _0x34fdd0 > 0x0 || hasSplittablePersonReplacementShotCut(_0x236639);
  const _0x2bb618 = _0x397bfe["workspace"]["selectedShotIds"];
  const _0x120180 = _0x21a937["length"] > 0x0 && _0x21a937["every"](_0x1cd228 => _0x2bb618["includes"](_0x1cd228['id']));
  const _0x28a7e2 = _0x3899e4 ? _0x21a937["filter"](_0x1241a1 => isPersonReplacementVideoGenerationActive(resolvePersonReplacementVideoGenerationState(_0x397bfe["workspace"], _0x1241a1['id'])))['map'](_0x2732c => normalizeText(_0x2732c['id'])) : _0x21a937["filter"](_0x3d759d => resolvePersonReplacementImageGenerationState(_0x397bfe["workspace"], _0x3d759d['id'])["status"] === "running")["map"](_0x33f43b => normalizeText(_0x33f43b['id']));
  const _0xa626f2 = [...new Set([...(Array["isArray"](batchGeneratingShotIds) ? batchGeneratingShotIds : []), ..._0x28a7e2]["map"](normalizeText)["filter"](Boolean))];
  const _0x28f381 = {
    'data': {
      'assets': [],
      'project': {}
    },
    'assetFilter': "scene",
    'selectedAssetId': _0x397bfe['workspace']["selectedShotId"],
    'selectedAssetIds': _0x2bb618,
    'assetSelectionMode': _0x397bfe["workspace"]["shotSelectionMode"],
    'assetAppearanceIndexes': {},
    'generatingAppearanceKeys': _0xa626f2["map"](_0x78b86e => _0x78b86e + ":keyframe"),
    'isBatchGenerating': isBatchGenerating,
    'batchGenerationActionLabel': _0x3899e4 ? "批量生成视频" : "批量生成替换图",
    'batchCancelAction': "cancel-shot-batch-generation",
    'batchCancelRequested': batchCancelRequested,
    'batchGeneratingAssetIds': isBatchGenerating ? _0xa626f2 : [],
    'allowDeleteAssetCard': ![],
    'allowAssetRename': ![],
    'hideAssetRoleTag': !![],
    'hideAssetNameTooltip': !![]
  };
  const _0x529b8b = _0x397bfe["workspace"]["shotSelectionMode"] ? "<button type=\"button\" class=\"story-secondary-button\" data-story-action=\"toggle-all-shots\" aria-pressed=\"" + _0x120180 + '\x22>' + (_0x120180 ? '取消全选' : '全选') + "</button><button type=\"button\" class=\"story-secondary-button\" data-story-action=\"cancel-shot-selection\">取消</button>" + renderPersonReplacementBatchGenerationControl(_0x28f381) : (allowCutEditing ? "<button type=\"button\" class=\"story-secondary-button person-replacement-shot-split-trigger is-icon-only\" data-person-replacement-action=\"edit-shot-cuts\" data-tooltip=\"剪辑全部切口\" aria-label=\"剪辑全部切口\" " + (_0x1d5e38 ? '' : 'disabled') + '>' + VIDEO_CLIP_ICON_SVG + '</button>' : '') + "<button type=\"button\" class=\"story-secondary-button workspace-selection-trigger\" data-story-action=\"toggle-shot-selection\" " + (_0x21a937["length"] ? '' : "disabled") + ">多选</button>";
  const _0x37b699 = _0x21a937["map"]((_0x46107d, _0x503b2d) => {
    const _0x2d39ef = '片段' + String(_0x503b2d + 0x1)['padStart'](0x2, '0');
    const _0x5352e1 = getPersonReplacementImageResults(_0x46107d);
    const _0x4240a0 = getPersonReplacementActiveImageResultIndex(_0x46107d, _0x5352e1);
    const _0x232e33 = resolvePersonReplacementImageResultRef(_0x5352e1[_0x4240a0]);
    const _0x5e10e1 = _0x3899e4 ? getPersonReplacementVideoResults(_0x46107d) : [];
    const _0x577afc = _0x3899e4 ? getPersonReplacementActiveVideoResultIndex(_0x46107d, _0x5e10e1) : 0x0;
    const _0x392da1 = _0x5e10e1[_0x577afc] || null;
    const _0x95d9d0 = resolvePersonReplacementVideoResultRef(_0x392da1) || normalizeText(_0x46107d['resultVideoRef']);
    const _0x33ea9b = resolvePersonReplacementVideoResultPosterRef(_0x392da1);
    const _0x1238f7 = normalizeMediaUrl(_0x3899e4 ? _0x33ea9b || _0x46107d['keyframeRef'] : _0x232e33 || _0x46107d["keyframeRef"]);
    const _0x4bfcad = _0x3899e4 ? renderShotTimelineVideoMedia({
      'shot': _0x46107d,
      'title': _0x2d39ef,
      'resultRef': _0x95d9d0,
      'resultPosterRef': _0x33ea9b
    }) : '';
    const _0x13b975 = formatClock(_0x46107d["startTimeSec"]) + '–' + formatClock(_0x46107d["endTimeSec"]);
    const _0x4ef988 = _0x3899e4 ? _0x95d9d0 : _0x46107d["replacementImageRef"];
    const _0x151315 = _0x4ef988 ? _0x13b975 + " · 已生成" : _0x13b975;
    const _0x390b59 = (_0x3899e4 ? _0x5e10e1 : _0x5352e1)["length"];
    const _0x3683f0 = _0x3899e4 ? "data-person-replacement-video-history=\"" + (_0x5e10e1["length"] > 0x1) + '\x22' : "data-person-replacement-image-history=\"" + (_0x5352e1["length"] > 0x1) + '\x22';
    const _0x1dcf30 = !_0x397bfe["workspace"]["shotSelectionMode"] && (_0x3899e4 ? _0x5e10e1 : _0x5352e1)['length'] === 0x1 ? renderReplacementResultReferenceButton(_0x46107d, 0x0, _0x3899e4 ? 'video' : 'image') : '';
    const _0x24ed26 = _0x390b59 > 0x1 ? '<button\x20type=\x22button\x22\x20class=\x22person-replacement-shot-result-count\x22\x20data-person-replacement-result-history-toggle\x20data-shot-id=\x22' + escapeHtml(_0x46107d['id']) + "\" data-result-count=\"" + _0x390b59 + "\" aria-expanded=\"false\" aria-label=\"展开" + _0x390b59 + " 个结果\" title=\"查看 " + _0x390b59 + " 个生成结果\"" + (_0x397bfe["workspace"]["shotSelectionMode"] ? " disabled" : '') + '>' + renderWorkspaceActionIcon("results") + '<span>' + _0x390b59 + '</span></button>' : '';
    return renderPersonReplacementAssetCard(_0x28f381, {
      'id': _0x46107d['id'],
      'kind': 'scene',
      'name': _0x2d39ef,
      'description': '',
      'imageUrl': _0x1238f7,
      'appearances': [{
        'id': "keyframe",
        'name': _0x3899e4 && _0x95d9d0 ? "替换结果视频" : '检测帧',
        'imageUrl': _0x1238f7
      }]
    }, {
      'statusText': _0x151315,
      'cardMediaHtml': _0x4bfcad,
      'cardClassName': "person-replacement-shot-card",
      'cardAttributes': "data-person-replacement-shot-card=\"true\" data-shot-id=\"" + escapeHtml(_0x46107d['id']) + '\x22\x20' + _0x3683f0 + " aria-current=\"" + (_0x46107d['id'] === _0x397bfe["workspace"]["selectedShotId"] ? "true" : "false") + "\" aria-label=\"" + escapeHtml(_0x2d39ef + '，' + formatClock(_0x46107d['startTimeSec']) + " 到 " + formatClock(_0x46107d["endTimeSec"]) + (_0x4ef988 ? _0x3899e4 ? "，替换视频已生成" : "，替换图已生成" : '')) + '\x22',
      'shellClassName': [_0x1dcf30 || _0x24ed26 ? "person-replacement-shot-card-shell" : '', _0x1dcf30 ? "has-reference-control" : '', _0x24ed26 ? "has-result-count-control" : '']["filter"](Boolean)["join"]('\x20'),
      'accessoryHtml': _0x1dcf30 + _0x24ed26,
      'preserveShell': !![]
    });
  })["join"]('');
  const _0x417ab1 = _0x397bfe["workspace"]["shotSelectionMode"] ? '已选择\x20' + _0x2bb618['length'] + '\x20项' : '';
  const _0x12e11e = _0x417ab1 ? "<small>" + _0x417ab1 + "</small>" : '';
  const _0x3594e2 = "data-story-marquee-surface=\"shots\" tabindex=\"0\"";
  return "<section class=\"person-replacement-shot-timeline\" aria-label=\"镜头片段网格\">\n    <section class=\"person-replacement-result-history-panel\" data-person-replacement-result-history-menu aria-label=\"片段生成结果\" aria-hidden=\"true\" hidden></section>\n    <header class=\"person-replacement-shot-timeline-header\"><div><strong>镜头片段</strong><span>" + _0x21a937['length'] + " 个片段 · " + formatClock(_0x4408cd) + "</span></div><div class=\"person-replacement-shot-timeline-actions\">" + _0x12e11e + _0x529b8b + "</div></header>\n    <div class=\"person-replacement-shot-timeline-scroll\" data-person-replacement-shot-timeline-scroll " + _0x3594e2 + ">\n      <div class=\"person-replacement-shot-grid story-asset-grid\">" + (_0x37b699 || '<div\x20class=\x22person-replacement-shot-timeline-empty-state\x22>镜头切分完成后会显示在这里</div>') + '</div>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</section>';
}
function renderShotCutEditor(_0x39eab9, _0x416c38 = [], {
  submitting = ![],
  keyframeCapturing = ![],
  smartDetecting = ![],
  playheadSec = 0x0,
  previewShotId = '',
  timelineZoom = 0x1,
  soundEnabled = ![],
  canUndo = ![],
  selectedShotIds = []
} = {}, _0x33b919 = () => '') {
  const _0x4e3e32 = new Map((_0x39eab9['shots'] || [])['map'](_0x4c24b9 => [_0x4c24b9['id'], _0x4c24b9]));
  const _0x3b996b = getPersonReplacementShotCutTotalDuration(_0x416c38);
  const _0x2a26f7 = getPersonReplacementShotCutDisplayDuration(_0x416c38);
  const _0x14c23c = countEditablePersonReplacementShotCuts(_0x416c38);
  const _0x5d3c3e = hasPersonReplacementShotCutUpdateChanges(_0x39eab9["shots"], _0x416c38);
  const _0x31ae4a = resolveShotCutSubmissionUi(submitting, smartDetecting);
  const {
    reversePending: _0x1a9e08,
    cutSubmitting: _0x1a8362,
    editorBusy: _0x4de87b
  } = _0x31ae4a;
  const _0x13925d = _0x4de87b || keyframeCapturing;
  const _0x40b89d = _0x4de87b ? renderWorkspaceAssetLoadingOverlay({
    'title': _0x31ae4a["loadingTitle"],
    'description': _0x31ae4a["loadingDescription"]
  }) : '';
  const _0x107c85 = getMediaClipTimelineTrackWidthPx({
    'durationSec': _0x3b996b,
    'viewportWidthPx': PERSON_REPLACEMENT_CUT_BASE_VIEWPORT_WIDTH_PX,
    'zoom': timelineZoom
  });
  const _0x5a5eca = clamp(playheadSec, 0x0, _0x3b996b, 0x0);
  const _0x196d4c = getPersonReplacementShotCutPositionAtTimelineSec(_0x416c38, _0x5a5eca);
  const _0x530559 = _0x416c38[_0x196d4c["shotIndex"]] || null;
  const _0x470065 = new Set((Array["isArray"](selectedShotIds) ? selectedShotIds : [])["map"](normalizeText)["filter"](Boolean));
  const _0x465de0 = _0x470065["size"] === 0x2;
  const _0x29c678 = _0x465de0 && canMergePersonReplacementShotCutRanges(_0x416c38, [..._0x470065]);
  const _0x26ba96 = Boolean(_0x530559 && canSplitPersonReplacementShotCutRange(_0x530559, _0x196d4c["sourceTimeSec"] - (Number(_0x530559["startSec"]) || 0x0)));
  const _0x4d4448 = renderPersonReplacementShotCutRulerTicks(_0x3b996b, _0x107c85, _0x2a26f7, getPersonReplacementShotCutRulerFrameRate(_0x416c38));
  let _0x35fa66 = 0x0;
  const _0x202e1c = [];
  const _0x265f9c = [];
  const _0x4cb654 = _0x416c38['map']((_0x5921a8, _0x58a18d) => {
    const _0x2dba22 = _0x4e3e32["get"](_0x5921a8["shotId"]) || _0x4e3e32["get"](_0x5921a8["originShotId"]) || {};
    const _0x4f6634 = Math["max"](PERSON_REPLACEMENT_CUT_MIN_SEC, _0x5921a8["durationSec"]);
    const _0x551f2d = _0x35fa66;
    _0x35fa66 += _0x4f6634;
    const _0x316fe6 = getMediaClipTimelineRangeRect({
      'startSec': _0x551f2d,
      'endSec': _0x35fa66,
      'durationSec': _0x3b996b,
      'trackWidthPx': _0x107c85,
      'minWidthPct': 0x0
    });
    const _0x3f2648 = '片段' + String(_0x58a18d + 0x1)["padStart"](0x2, '0');
    _0x202e1c["push"]("<span class=\"person-replacement-shot-cut-segment-label\" data-person-replacement-cut-segment-label=\"" + _0x58a18d + "\" style=\"left:" + _0x316fe6["leftPct"]['toFixed'](0x5) + "%;width:" + _0x316fe6['widthPct']["toFixed"](0x5) + "%\" aria-hidden=\"true\">" + _0x3f2648 + "</span>");
    if (_0x5921a8["keyframeManuallySelected"] === !![] && normalizeText(_0x5921a8["keyframeRef"])) {
      const _0x859d44 = getPersonReplacementShotCutTimelineSec(_0x416c38, _0x5921a8['shotId'], _0x5921a8['keyframeTimeSec']);
      const _0x2b3edc = clamp(_0x859d44 / _0x2a26f7 * 0x64, 0x0, 0x64, 0x0);
      const _0x25dc68 = _0x2b3edc < 0x5 ? " is-start" : _0x2b3edc > 0x5f ? " is-end" : '';
      const _0x53342d = _0x3f2648 + '\x20关键帧';
      _0x265f9c["push"]("<div class=\"person-replacement-shot-cut-keyframe-marker" + _0x25dc68 + "\" data-person-replacement-keyframe-marker=\"" + _0x58a18d + '\x22\x20style=\x22left:' + _0x2b3edc["toFixed"](0x5) + '%\x22\x20role=\x22note\x22\x20aria-label=\x22' + _0x53342d + "\"><span aria-hidden=\"true\">" + _0x53342d + "</span></div>");
    }
    const _0x1ee9c7 = _0x58a18d > 0x0 && _0x416c38[_0x58a18d - 0x1]?.["sourceId"] !== _0x5921a8['sourceId'];
    const _0x407c76 = normalizeText(previewShotId) === normalizeText(_0x5921a8["shotId"]);
    const _0x110611 = _0x470065['has'](normalizeText(_0x5921a8['shotId']));
    const _0x1f95a5 = _0x416c38[_0x58a18d - 0x1];
    const _0x3a46c = _0x416c38[_0x58a18d + 0x1];
    const _0x33aa83 = Boolean(_0x1f95a5 && _0x1f95a5["sourceId"] && _0x1f95a5["sourceId"] === _0x5921a8["sourceId"]);
    const _0x11ba51 = Boolean(_0x3a46c && _0x3a46c['sourceId'] && _0x3a46c["sourceId"] === _0x5921a8["sourceId"]);
    const _0x4ed21a = _0x33aa83 ? "<button type=\"button\" class=\"person-replacement-shot-cut-boundary media-clip-trim media-clip-trim-left\" data-person-replacement-cut-boundary-index=\"" + _0x58a18d + "\" data-person-replacement-cut-boundary-side=\"left\" role=\"slider\" aria-label=\"调整片段 " + (_0x58a18d + 0x1) + " 的左切口\" aria-valuemin=\"" + (_0x1f95a5["startSec"] + getPersonReplacementShotCutFrameSec(_0x1f95a5, _0x5921a8))["toFixed"](0x4) + "\" aria-valuemax=\"" + (_0x5921a8["endSec"] - getPersonReplacementShotCutFrameSec(_0x1f95a5, _0x5921a8))["toFixed"](0x4) + "\" aria-valuenow=\"" + _0x5921a8['startSec']["toFixed"](0x4) + "\"><span class=\"media-clip-trim-visual\" aria-hidden=\"true\"></span></button>" : '';
    const _0x54df8e = _0x11ba51 ? '<button\x20type=\x22button\x22\x20class=\x22person-replacement-shot-cut-boundary\x20media-clip-trim\x20media-clip-trim-right\x22\x20data-person-replacement-cut-boundary-index=\x22' + (_0x58a18d + 0x1) + "\" data-person-replacement-cut-boundary-side=\"right\" role=\"slider\" aria-label=\"调整片段 " + (_0x58a18d + 0x1) + " 的右切口\" aria-valuemin=\"" + (_0x5921a8["startSec"] + getPersonReplacementShotCutFrameSec(_0x5921a8, _0x3a46c))['toFixed'](0x4) + "\" aria-valuemax=\"" + (_0x3a46c["endSec"] - getPersonReplacementShotCutFrameSec(_0x5921a8, _0x3a46c))['toFixed'](0x4) + "\" aria-valuenow=\"" + _0x5921a8["endSec"]["toFixed"](0x4) + "\"><span class=\"media-clip-trim-visual\" aria-hidden=\"true\"></span></button>" : '';
    return "<div class=\"person-replacement-shot-cut-segment media-clip-segment media-clip-material-strip media-clip-segment-video " + (_0x407c76 ? "is-previewing" : '') + '\x20' + (_0x110611 ? 'is-merge-selected' : '') + '\x20' + (_0x1ee9c7 ? "is-source-start" : '') + '\x20' + (_0x5921a8["isReversed"] === !![] ? "is-reversed" : '') + "\" style=\"left:" + _0x316fe6['leftPct']["toFixed"](0x5) + '%;width:' + _0x316fe6["widthPct"]["toFixed"](0x5) + "%\" data-person-replacement-action=\"preview-shot-cut\" data-person-replacement-shot-cut-selectable data-story-marquee-item data-story-marquee-id=\"" + escapeHtml(_0x5921a8["shotId"]) + "\" data-person-replacement-cut-shot-index=\"" + _0x58a18d + "\" data-clip-index=\"" + _0x58a18d + "\" data-media-kind=\"video\" data-shot-id=\"" + escapeHtml(_0x5921a8["shotId"]) + '\x22\x20' + (_0x407c76 ? 'data-selected-clip=\x22true\x22' : '') + '\x20' + (_0x110611 ? 'data-person-replacement-cut-merge-selected=\x22true\x22' : '') + '\x20' + (_0x5921a8["isReversed"] === !![] ? 'data-person-replacement-cut-reversed=\x22true\x22' : '') + '\x20role=\x22button\x22\x20tabindex=\x220\x22\x20aria-pressed=\x22' + _0x407c76 + "\" aria-label=\"" + escapeHtml((_0x2dba22["title"] || "片段 " + (_0x58a18d + 0x1)) + '，' + formatClock(_0x5921a8["startSec"]) + '\x20到\x20' + formatClock(_0x5921a8["endSec"]) + (_0x5921a8["isReversed"] === !![] ? "，已设为倒放" : '') + (_0x110611 ? '，已框选' : '')) + "\">\n      " + renderPersonReplacementShotCutFilmstrip(_0x2dba22, _0x107c85, _0x5921a8["keyframeRef"]) + '\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22media-clip-material-selection\x20v2-video-clipselection\x20person-replacement-shot-cut-selection\x22\x20style=\x22left:0%;width:100%\x22\x20aria-hidden=\x22true\x22><div\x20class=\x22media-clip-material-label\x20v2-video-cliplabel\x22\x20data-person-replacement-cut-duration=\x22' + _0x58a18d + '\x22>' + formatDurationLabel(_0x4f6634) + "</div></div>\n      " + (_0x5921a8["isReversed"] === !![] ? "<span class=\"person-replacement-shot-cut-reverse-badge\" aria-hidden=\"true\">倒放</span>" : '') + "\n      " + _0x4ed21a + _0x54df8e + '\x0a\x20\x20\x20\x20</div>';
  })["join"]('');
  const _0x499e66 = resolveMediaClipReverseControlState({
    'isReversed': _0x530559?.["isReversed"] === !![],
    'pending': _0x1a9e08
  });
  const _0x326464 = _0x499e66["isReversed"];
  return "<section class=\"person-replacement-shot-cut-editor\" data-person-replacement-shot-cut-editor tabindex=\"-1\" aria-label=\"调整全部镜头切口\" aria-busy=\"" + _0x4de87b + '\x22>\x0a\x20\x20\x20\x20<header\x20class=\x22person-replacement-shot-timeline-header\x22>\x0a\x20\x20\x20\x20\x20\x20<div><strong>调整全部切口</strong><span>' + _0x416c38["length"] + '\x20个片段\x20·\x20' + _0x14c23c + '\x20个可调切口</span><span\x20class=\x22person-replacement-shot-cut-clock\x22><output\x20data-person-replacement-shot-cut-current-time>' + formatPreciseClock(_0x5a5eca) + "</output> / " + formatPreciseClock(_0x3b996b) + "</span></div>\n      <div class=\"person-replacement-shot-cut-actions\">\n        <button type=\"button\" class=\"person-replacement-shot-cut-action person-replacement-shot-cut-sound is-icon-only " + (soundEnabled ? 'is-sound-enabled' : '') + "\" data-person-replacement-action=\"toggle-shot-cut-sound\" data-tooltip=\"" + (soundEnabled ? "关闭声音" : '打开声音') + "\" aria-label=\"" + (soundEnabled ? "关闭声音" : "打开声音") + '\x22\x20aria-pressed=\x22' + soundEnabled + '\x22\x20' + (_0x4de87b ? "disabled" : '') + '>' + _0x33b919(soundEnabled ? "soundOn" : "soundOff") + "</button>\n        <button type=\"button\" class=\"person-replacement-shot-cut-action is-icon-only\" data-person-replacement-action=\"undo-shot-cut\" aria-keyshortcuts=\"Control+Z Meta+Z\" data-tooltip=\"撤回\" aria-label=\"撤回\" " + (_0x13925d || !canUndo ? "disabled" : '') + '>' + _0x33b919("undo") + '</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22person-replacement-shot-cut-action\x20is-icon-only\x22\x20data-person-replacement-action=\x22reset-shot-cuts\x22\x20data-tooltip=\x22重置\x22\x20aria-label=\x22重置\x22\x20' + (_0x13925d ? "disabled" : '') + '>' + _0x33b919("reset") + "</button>\n        <button type=\"button\" class=\"person-replacement-shot-cut-action person-replacement-shot-cut-cancel is-icon-only\" data-person-replacement-action=\"cancel-shot-cuts\" data-tooltip=\"取消\" aria-label=\"取消\" " + (_0x13925d ? 'disabled' : '') + '>' + _0x33b919('close') + "</button>\n        <button type=\"button\" class=\"person-replacement-shot-cut-action is-primary is-icon-only " + (_0x1a8362 ? "is-loading" : '') + '\x22\x20data-person-replacement-action=\x22confirm-shot-cuts\x22\x20data-tooltip=\x22' + (_0x1a8362 ? "正在应用切口" : "应用切口") + "\" aria-label=\"" + (_0x1a8362 ? "正在应用切口" : "应用切口") + "\" aria-busy=\"" + _0x1a8362 + '\x22\x20' + (_0x13925d || !_0x5d3c3e ? "disabled" : '') + '>' + renderWorkspaceConfirmIcon() + "</button>\n      </div>\n    </header>\n    <div class=\"person-replacement-shot-cut-shell media-clip-compact is-editing" + (_0x4de87b ? " img-preview-loading" : '') + "\" aria-busy=\"" + _0x4de87b + "\">\n      <div class=\"media-clip-compact-body\">\n        <div class=\"person-replacement-shot-cut-scroll media-clip-timeline-scroll\" data-person-replacement-shot-timeline-scroll data-story-marquee-surface=\"shot-cuts\" tabindex=\"0\">\n          <div class=\"person-replacement-shot-cut-timeline media-clip-compact-timeline is-editing\" data-person-replacement-shot-cut-timeline style=\"--media-clip-track-content-width:" + _0x107c85 + "px;--media-clip-timeline-content-width:" + _0x107c85 + 'px;--media-clip-track-axis-width:0px;--cut-total-duration:' + _0x3b996b['toFixed'](0x5) + "\">\n            <div class=\"media-clip-ruler person-replacement-shot-cut-ruler\" aria-hidden=\"true\">" + _0x4d4448 + "</div>\n            <div class=\"media-clip-timeline-lane\">\n              <div class=\"media-clip-timeline-tracks\">\n                <div class=\"person-replacement-shot-cut-track media-clip-track media-clip-track-video is-active\" data-person-replacement-shot-cut-track>" + (_0x4cb654 || "<div class=\"person-replacement-shot-timeline-empty-state\">暂无可调整的镜头切口</div>") + "</div>\n              </div>\n            </div>\n            <div class=\"person-replacement-shot-cut-annotations\">" + _0x202e1c['join']('') + _0x265f9c["join"]('') + "</div>\n            <div class=\"media-clip-timeline-cursors person-replacement-shot-cut-cursors\" aria-hidden=\"true\">\n              <div class=\"media-clip-playhead media-clip-timeline-cursor media-clip-timeline-cursor-fixed person-replacement-shot-cut-playhead\" data-person-replacement-shot-cut-playhead style=\"left:" + (_0x5a5eca / _0x2a26f7 * 0x64)["toFixed"](0x4) + "%\"></div>\n              <div class=\"media-clip-hover-playhead media-clip-timeline-cursor media-clip-timeline-cursor-hover person-replacement-shot-cut-hover-playhead\" data-person-replacement-shot-cut-hover-playhead hidden></div>\n            </div>\n          </div>\n        </div>\n      </div>\n      " + _0x40b89d + "\n    </div>\n    <div class=\"person-replacement-shot-cut-primary-actions\" aria-label=\"片段编辑工具\">\n      <button type=\"button\" class=\"person-replacement-shot-cut-action is-icon-only " + (keyframeCapturing ? 'is-loading' : '') + '\x22\x20data-person-replacement-action=\x22capture-shot-keyframe\x22\x20data-tooltip=\x22' + (keyframeCapturing ? "正在获取关键帧" : '获取关键帧') + "\" aria-label=\"" + (keyframeCapturing ? '正在获取关键帧' : "获取关键帧") + '\x22\x20aria-busy=\x22' + keyframeCapturing + '\x22\x20' + (_0x4de87b || keyframeCapturing || _0x196d4c['shotIndex'] < 0x0 ? "disabled" : '') + '>' + renderWorkspaceKeyframeIcon() + "</button>\n      <button type=\"button\" class=\"person-replacement-shot-cut-action person-replacement-shot-cut-split is-icon-only\" data-person-replacement-action=\"split-shot-cut\" aria-keyshortcuts=\"C\" data-tooltip=\"裁剪（C）\" aria-label=\"裁剪（C）\" " + (_0x13925d || !_0x26ba96 ? "disabled" : '') + '>' + VIDEO_CLIP_ICON_SVG + "</button>\n      <button type=\"button\" class=\"person-replacement-shot-cut-action person-replacement-shot-cut-reverse is-icon-only " + (_0x1a9e08 ? "is-loading" : _0x326464 ? 'is-active' : '') + '\x22\x20data-person-replacement-action=\x22toggle-shot-cut-reverse\x22\x20data-tooltip=\x22' + _0x499e66['label'] + "\" aria-label=\"" + _0x499e66["label"] + '\x22\x20aria-busy=\x22' + _0x499e66['ariaBusy'] + "\" aria-pressed=\"" + _0x499e66["ariaPressed"] + '\x22\x20' + (_0x13925d || _0x196d4c["shotIndex"] < 0x0 ? 'disabled' : '') + '>' + _0x33b919("reverse") + '</button>\x0a\x20\x20\x20\x20\x20\x20' + (_0x465de0 ? "<button type=\"button\" class=\"person-replacement-shot-cut-action person-replacement-shot-cut-merge is-icon-only\" data-person-replacement-action=\"merge-shot-cuts\" data-tooltip=\"合并片段\" aria-label=\"合并片段\" " + (_0x13925d || !_0x29c678 ? "disabled" : '') + '>' + _0x33b919('merge') + '</button>' : '') + "\n    </div>\n    <div class=\"person-replacement-shot-cut-helper-row\" aria-label=\"时间轴操作提示\">\n      <div class=\"person-replacement-shot-cut-helper-left\">\n        <span class=\"person-replacement-shot-cut-helper-msg\" style=\"--person-replacement-shot-cut-helper-index:0\"><kbd>Space</kbd><span>播放 / 暂停</span></span>\n        <span class=\"person-replacement-shot-cut-helper-msg\" style=\"--person-replacement-shot-cut-helper-index:1\"><kbd>← →</kbd><span>逐帧移动播放头</span></span>\n        <span class=\"person-replacement-shot-cut-helper-msg\" style=\"--person-replacement-shot-cut-helper-index:2\"><kbd>C</kbd><span>在播放头处增加切口</span></span>\n        <span class=\"person-replacement-shot-cut-helper-msg\" style=\"--person-replacement-shot-cut-helper-index:3\"><kbd>Ctrl / ⌘ Z</kbd><span>撤回上一步裁剪操作</span></span>\n        <span class=\"person-replacement-shot-cut-helper-msg\" style=\"--person-replacement-shot-cut-helper-index:4\"><kbd>Ctrl / ⌘ + −</kbd><span>缩放时间轴</span></span>\n        <span class=\"person-replacement-shot-cut-helper-msg\" style=\"--person-replacement-shot-cut-helper-index:5\"><kbd>拖动切口</kbd><span>左右片段同步伸缩</span></span>\n      </div>\n    </div>\n  </section>";
}
function renderShotTimelineStage(_0x35000a, {
  cutEditorOpen = ![],
  cutEditorOpening = ![],
  cutEditorMotion = '',
  cutEditorDraft = [],
  cutEditorSubmitting = ![],
  cutEditorKeyframeCapturing = ![],
  cutEditorSmartDetecting = ![],
  cutEditorPlayheadSec = 0x0,
  cutEditorPreviewShotId = '',
  cutEditorTimelineZoom = 0x1,
  cutEditorSoundEnabled = ![],
  cutEditorSelectedShotIds = [],
  cutEditorCanUndo = ![],
  allowCutEditing = ![],
  timelineMode = "image",
  shotBatchGenerationActive = ![],
  shotBatchGeneratingShotIds = [],
  shotBatchCancelRequested = ![]
} = {}, _0x57f3c4 = () => '') {
  const _0x702482 = cutEditorOpen && cutEditorMotion !== "to-timeline";
  const _0x337617 = cutEditorMotion === "to-editor" ? "is-flipping-to-editor" : cutEditorMotion === "to-timeline" ? "is-flipping-to-timeline" : '';
  const _0x5ca3ae = Boolean(_0x337617);
  const _0x1fb54d = cutEditorOpening ? " is-cut-editor-loading img-preview-loading" : '';
  const _0x206708 = _0x702482 || cutEditorOpening;
  return "<div class=\"person-replacement-shot-timeline-stage " + (_0x702482 ? "is-editor" : 'is-timeline') + '\x20' + (_0x5ca3ae ? "is-animating" : "is-settled") + _0x1fb54d + '\x22\x20data-person-replacement-shot-timeline-stage\x20aria-busy=\x22' + cutEditorOpening + '\x22' + (cutEditorOpening ? " aria-label=\"视频加载中，正在准备裁剪预览\"" : '') + ">\n    <div class=\"person-replacement-shot-timeline-cube " + _0x337617 + "\">\n      <div class=\"person-replacement-shot-timeline-face person-replacement-shot-timeline-face--timeline\" aria-hidden=\"" + _0x702482 + '\x22\x20' + (_0x206708 ? "inert" : '') + '>' + renderShotTimeline(_0x35000a, {
    'allowCutEditing': allowCutEditing,
    'mode': timelineMode,
    'isBatchGenerating': shotBatchGenerationActive,
    'batchGeneratingShotIds': shotBatchGeneratingShotIds,
    'batchCancelRequested': shotBatchCancelRequested
  }) + "</div>\n      <div class=\"person-replacement-shot-timeline-face person-replacement-shot-timeline-face--editor\" aria-hidden=\"" + !_0x702482 + '\x22\x20' + (_0x702482 ? '' : "inert") + '>' + renderShotCutEditor(_0x35000a, cutEditorDraft, {
    'submitting': cutEditorSubmitting,
    'keyframeCapturing': cutEditorKeyframeCapturing,
    'smartDetecting': cutEditorSmartDetecting,
    'playheadSec': cutEditorPlayheadSec,
    'previewShotId': cutEditorPreviewShotId,
    'timelineZoom': cutEditorTimelineZoom,
    'soundEnabled': cutEditorSoundEnabled,
    'selectedShotIds': cutEditorSelectedShotIds,
    'canUndo': cutEditorCanUndo
  }, _0x57f3c4) + "</div>\n    </div>\n    " + (cutEditorOpening ? renderWorkspaceAssetLoadingOverlay({
    'title': "视频加载中",
    'description': "正在准备裁剪预览，加载完成后会自动进入。"
  }) : '') + '\x0a\x20\x20</div>';
}
export function createPersonReplacementShotTimelinePresentation({
  renderIcon = () => ''
} = {}) {
  const _0x353c80 = typeof renderIcon === 'function' ? renderIcon : () => '';
  return Object["freeze"]({
    'renderHistoryMenu'({
      kind = "image",
      shot = {},
      title = "镜头片段",
      allowSingleResult = ![]
    } = {}) {
      const _0x1336bb = {
        'allowSingleResult': allowSingleResult
      };
      return kind === "video" ? renderReplacementVideoHistoryMenu(shot, title, _0x1336bb) : renderReplacementImageHistoryMenu(shot, title, _0x1336bb);
    },
    'renderTimeline': renderShotTimeline,
    'renderStage'(_0x4a299b, _0x19aa70 = {}) {
      return renderShotTimelineStage(_0x4a299b, _0x19aa70, _0x353c80);
    }
  });
}