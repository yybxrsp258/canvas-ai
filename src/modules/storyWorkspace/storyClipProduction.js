import { renderRequestDebugButton } from '../debugRequestWindow.js';
import { resolveAssetMentionRef } from '../assetMentionRegistry.js';
import { renderAIGenVideoModelSelectorMarkup } from '../../components/aigenVideo/modelSelector.js';
import { renderVideoPromptEditorMarkup, renderVideoReferenceBarMarkup } from '../../components/video-node/promptInputSurface.js';
import { resolveModelExecution } from '../../manifests/index.js';
import { buildFixedInputAssetSlotMapFromRefs, getFixedInputSlotConfigFromManifest, shouldHideFixedInputSlots } from '../fixedInputAssetRefs.js';
import { sanitizePromptHtmlForCommit } from '../nodePromptShared.js';
import { STORY_PROMPT_LANGUAGES } from '../../domain/storyGeneration/promptLanguage.js';
import { canGenerateStoryClipAdjustment } from './storyClipAdjustmentMenu.js';
import { t } from '../../i18n/index.js';
import { buildStoryClipInputSlotViewModel } from './storyClipInputSlots.js';
import { getRecoverableStoryClipVideoTask, buildStoryClipVideoPayload } from './storyClipGeneration.js';
import { renderStoryGenerationSpinner } from './storyAsyncButtonPresentation.js';
import { localPathToUrl } from '../../utils/localMediaPath.js';
import { renderWorkspaceVideoPlaybackControls } from '../workspaceVideoPlaybackControls.js';
import { renderStoryClipPromptMentions, resolveStoryClipPromptAssetRefs } from './storyClipMentions.js';
import { normalizeDurationSeconds } from './storyPlanningData.js';
import { resolveStoryVideoReplicationClipVoiceAssetIds } from './storyVideoReplication.js';
import { renderStoryKeyframeIcon } from './storyWorkspaceIcons.js';
import { renderStoryMediaHistoryMenu } from './storyMediaHistory.js';
import { VIDEO_CLIP_ICON_SVG } from '../../components/nodeToolbar/videoToolbarHtml.js';
import { renderWorkspaceCardDeleteControl } from '../workspaceAssetPresentation.js';
import { formatStoryClipVideoGenerationDuration, resolveStoryClipVideoGenerationParams } from './storyVideoGenerationSettings.js';
import { STORY_WORKSPACE_RUNNINGHUB_WORKFLOW_MODEL_IDS } from './storyWorkspaceModelCatalog.js';
import { isStoryClipAdjustmentGenerating, normalizeStoryClipPromptHistory } from './storyClipAdjustment.js';
import { STORY_PROMPT_MODE_OPTIONS, isStoryMinimaxH3PromptMode, getStoryPromptModeLabel, normalizeStoryMinimaxH3OfficialTags, normalizeStoryPromptMode } from './storyPromptModes.js';
import { readStorySerialExecution, renderStorySerialExecutionToggle } from './storySerialExecutionPreference.js';
function escapeHtml(_0x16899c) {
  return String(_0x16899c ?? '')["replace"](/&/g, "&amp;")["replace"](/</g, "&lt;")['replace'](/>/g, '&gt;')['replace'](/"/g, "&quot;")["replace"](/'/g, "&#39;");
}
function normalizeText(_0x405280) {
  return String(_0x405280 || '')['trim']();
}
function formatPromptHistorySavedAt(_0x5f1276) {
  const _0x31a25f = new Date(Number(_0x5f1276));
  if (!Number["isFinite"](_0x31a25f["getTime"]()) || Number(_0x5f1276) <= 0x0) {
    return "时间未记录";
  }
  const _0x5de838 = _0x189bdb => String(_0x189bdb)["padStart"](0x2, '0');
  return _0x31a25f["getFullYear"]() + '-' + _0x5de838(_0x31a25f['getMonth']() + 0x1) + '-' + _0x5de838(_0x31a25f["getDate"]()) + '\x20' + _0x5de838(_0x31a25f["getHours"]()) + ':' + _0x5de838(_0x31a25f["getMinutes"]());
}
function getPromptHistoryPreview(_0x48ad01) {
  return normalizeText(String(_0x48ad01 || '')["replace"](/<br\s*\/?\s*>/gi, '\x20')['replace'](/<[^>]+>/g, '\x20')["replace"](/&nbsp;/gi, '\x20')['replace'](/&lt;/gi, '<')["replace"](/&gt;/gi, '>')["replace"](/&quot;/gi, '\x22')["replace"](/&#39;|&apos;/gi, '\x27')["replace"](/&amp;/gi, '&')["replace"](/\s+/g, '\x20'))["slice"](0x0, 0x60);
}
function getVideoResults(_0x2f657d = {}) {
  return Array['isArray'](_0x2f657d?.["video"]?.['results']) ? _0x2f657d["video"]["results"]["filter"](_0xd2ea1a => _0xd2ea1a && typeof _0xd2ea1a === 'object') : [];
}
function getActiveVideoResultIndex(_0x460d62 = {}, _0x22cef3 = getVideoResults(_0x460d62)) {
  if (!_0x22cef3['length']) {
    return 0x0;
  }
  const _0x33315b = Math["trunc"](Number(_0x460d62?.["video"]?.['activeIndex']) || 0x0);
  return Math["max"](0x0, Math["min"](_0x22cef3["length"] - 0x1, _0x33315b));
}
function removeVideoResult(_0x47461a = {}, _0x10f46f) {
  const _0x1518bc = getVideoResults(_0x47461a);
  const _0x9398f6 = Number(_0x10f46f);
  const _0x499f80 = getActiveVideoResultIndex(_0x47461a, _0x1518bc);
  if (_0x1518bc["length"] < 0x2 || !Number["isInteger"](_0x9398f6) || _0x9398f6 < 0x0 || _0x9398f6 >= _0x1518bc["length"]) {
    return {
      'changed': ![],
      'clip': _0x47461a,
      'results': _0x1518bc,
      'activeIndex': _0x499f80,
      'activeResultChanged': ![],
      'direction': ''
    };
  }
  const _0x562884 = _0x1518bc[_0x499f80];
  const _0x4d9ac4 = _0x1518bc['filter']((_0x502294, _0x3e9ffa) => _0x3e9ffa !== _0x9398f6);
  const _0x9d057d = _0x9398f6 < _0x499f80 ? _0x499f80 - 0x1 : _0x9398f6 === _0x499f80 ? Math["min"](_0x9398f6, _0x4d9ac4['length'] - 0x1) : _0x499f80;
  const _0x3f421e = _0x4d9ac4[_0x9d057d] !== _0x562884;
  return {
    'changed': !![],
    'clip': {
      ..._0x47461a,
      'video': {
        ...(_0x47461a?.['video'] || {}),
        'results': _0x4d9ac4,
        'activeIndex': _0x9d057d
      }
    },
    'results': _0x4d9ac4,
    'activeIndex': _0x9d057d,
    'activeResultChanged': _0x3f421e,
    'direction': _0x3f421e && _0x9398f6 >= _0x4d9ac4["length"] ? "previous" : _0x3f421e ? 'next' : ''
  };
}
function resolveVideoResultUrl(_0x32b4ea = {}) {
  return [localPathToUrl(_0x32b4ea["displayLocalPath"]), localPathToUrl(_0x32b4ea["localPath"]), _0x32b4ea["videoUrl"], _0x32b4ea["url"], _0x32b4ea["displayUrl"]]["map"](_0x2f1971 => normalizeText(_0x2f1971))['find'](Boolean) || '';
}
function resolveVideoResultPosterUrl(_0x192754 = {}) {
  return [_0x192754["posterUrl"], _0x192754["thumbUrl"], _0x192754["thumbnailUrl"], _0x192754["coverUrl"], localPathToUrl(_0x192754['posterLocalPath']), localPathToUrl(_0x192754["thumbLocalPath"]), localPathToUrl(_0x192754["thumbnailLocalPath"])]["map"](_0x151478 => normalizeText(_0x151478))['find'](Boolean) || '';
}
function renderVideoThumbnail(_0x175838, {
  className = '',
  label = "视频缩略图"
} = {}) {
  const _0xd78c29 = resolveVideoResultPosterUrl(_0x175838);
  if (_0xd78c29) {
    return "<img class=\"" + escapeHtml(className) + "\" src=\"" + escapeHtml(_0xd78c29) + '\x22\x20alt=\x22' + escapeHtml(label) + "\" loading=\"lazy\" draggable=\"false\">";
  }
  const _0x1c357f = resolveVideoResultUrl(_0x175838);
  if (_0x1c357f) {
    return "<video class=\"" + escapeHtml(className) + "\" src=\"" + escapeHtml(_0x1c357f) + "\" aria-label=\"" + escapeHtml(label) + "\" muted playsinline preload=\"metadata\"></video>";
  }
  return '';
}
function getAdjacentVideoResultIndex(_0x313e86 = {}, _0x218455 = 0x1) {
  const _0x4de071 = getVideoResults(_0x313e86);
  if (_0x4de071["length"] < 0x2) {
    return getActiveVideoResultIndex(_0x313e86, _0x4de071);
  }
  const _0x5d88b3 = getActiveVideoResultIndex(_0x313e86, _0x4de071);
  const _0x1b7fbc = Number(_0x218455) < 0x0 ? -0x1 : 0x1;
  return (_0x5d88b3 + _0x1b7fbc + _0x4de071['length']) % _0x4de071['length'];
}
function renderVideoHistoryMenu(_0x442001 = {}) {
  const _0x3edcc6 = getVideoResults(_0x442001);
  const _0x1a20a8 = getActiveVideoResultIndex(_0x442001, _0x3edcc6);
  return renderStoryMediaHistoryMenu({
    'title': _0x442001?.["title"] || "片段视频",
    'results': _0x3edcc6,
    'activeIndex': _0x1a20a8,
    'menuLabel': (_0x442001?.['title'] || '片段') + "历史视频",
    'getItemStatus': (_0x45308b, _0x371981) => _0x371981 === _0x1a20a8 ? "当前播放" : "点击切换",
    'renderMedia': (_0x1f54a7, _0x13aa52) => renderVideoThumbnail(_0x1f54a7, {
      'className': "story-media-history-thumbnail story-clip-video-history-thumbnail",
      'label': (_0x442001?.["title"] || '片段') + " · 版本 " + (_0x13aa52 + 0x1)
    }),
    'getItemAttributes': (_0x2f8f9f, _0x4cdfb1) => "data-story-action=\"select-video-result\" data-story-clip-id=\"" + escapeHtml(_0x442001?.['id']) + '\x22\x20data-story-video-result-index=\x22' + _0x4cdfb1 + '\x22',
    'renderItemAction': (_0x1283f3, _0x3c087b) => renderWorkspaceCardDeleteControl({
      'className': "story-media-history-delete",
      'ariaLabel': "删除版本 " + (_0x3c087b + 0x1),
      'actionAttributes': {
        'data-story-action': "delete-video-result",
        'data-story-clip-id': _0x442001?.['id'],
        'data-story-video-result-index': _0x3c087b
      }
    })
  });
}
function renderGenerationSpinner() {
  return renderStoryGenerationSpinner();
}
function renderTimelineVideoThumbnail(_0x35f58b = {}) {
  const _0x3c7df5 = getVideoResults(_0x35f58b);
  const _0xb82874 = _0x3c7df5[getActiveVideoResultIndex(_0x35f58b, _0x3c7df5)] || null;
  return _0xb82874 ? renderVideoThumbnail(_0xb82874, {
    'className': 'story-clip-card-thumbnail',
    'label': "片段 " + _0x35f58b["number"] + " 视频缩略图"
  }) : '';
}
function getSelectedEpisode(_0xde8e3b) {
  const _0x103ef3 = Array["isArray"](_0xde8e3b?.["data"]?.["episodes"]) ? _0xde8e3b["data"]['episodes'] : [];
  return _0x103ef3['find'](_0x4d2799 => _0x4d2799['id'] === _0xde8e3b?.["selectedEpisodeId"]) || _0x103ef3[0x0] || null;
}
function getSelectedClip(_0x51430a, _0x462fe4) {
  const _0x3c1782 = Array["isArray"](_0x462fe4?.["clips"]) ? _0x462fe4["clips"] : [];
  return _0x3c1782["find"](_0x9a8cce => _0x9a8cce['id'] === _0x51430a?.["selectedClipId"]) || _0x3c1782[0x0] || null;
}
function getAdjacentClipId(_0x1abde7 = [], _0x1ea89f = '', _0x4b41dc = 0x1) {
  const _0x26af5f = (Array["isArray"](_0x1abde7) ? _0x1abde7 : [])['filter'](_0x34dc04 => normalizeText(_0x34dc04?.['id']));
  if (!_0x26af5f["length"]) {
    return '';
  }
  const _0x31bc03 = _0x26af5f["findIndex"](_0x1f5ebe => _0x1f5ebe['id'] === _0x1ea89f);
  const _0x2954a6 = _0x31bc03 >= 0x0 ? _0x31bc03 : 0x0;
  const _0xd85ab0 = Number(_0x4b41dc) < 0x0 ? -0x1 : 0x1;
  const _0x5a1f08 = (_0x2954a6 + _0xd85ab0 + _0x26af5f["length"]) % _0x26af5f["length"];
  return _0x26af5f[_0x5a1f08]['id'];
}
function selectBatchTargets(_0x6c948b = [], _0x1e9952 = []) {
  const _0x5a3fc3 = new Set((Array["isArray"](_0x1e9952) ? _0x1e9952 : [])["map"](_0x505dfd => normalizeText(_0x505dfd))['filter'](Boolean));
  return (Array['isArray'](_0x6c948b) ? _0x6c948b : [])["filter"](_0x187235 => _0x5a3fc3["has"](normalizeText(_0x187235?.['id'])));
}
async function runBatch(_0x3dcaf8 = [], _0x1a3d29 = null, {
  onProgress = null,
  shouldStop = null
} = {}) {
  if (typeof _0x1a3d29 !== "function") {
    return [];
  }
  const _0x1b875b = Array["isArray"](_0x3dcaf8) ? _0x3dcaf8 : [];
  let _0x5684c1 = 0x0;
  const _0x4c72a2 = async (_0x3dc918, _0x2b38bb) => {
    let _0x272156;
    try {
      _0x272156 = await _0x1a3d29(_0x3dc918, {
        'index': _0x2b38bb,
        'total': _0x1b875b["length"]
      });
    } catch (_0x57817d) {
      _0x272156 = {
        'ok': ![],
        'error': _0x57817d
      };
    }
    _0x5684c1 += 0x1;
    onProgress?.({
      'completed': _0x5684c1,
      'total': _0x1b875b["length"],
      'index': _0x2b38bb,
      'target': _0x3dc918,
      'result': _0x272156
    });
    return _0x272156;
  };
  if (!readStorySerialExecution()) {
    return Promise['all'](_0x1b875b["map"](_0x4c72a2));
  }
  const _0x2f9c31 = [];
  for (let _0x3bb0de = 0x0; _0x3bb0de < _0x1b875b["length"]; _0x3bb0de += 0x1) {
    if (typeof shouldStop === "function" && shouldStop({
      'target': _0x1b875b[_0x3bb0de],
      'index': _0x3bb0de,
      'completed': _0x5684c1,
      'total': _0x1b875b["length"]
    })) {
      for (let _0x7f1e77 = _0x3bb0de; _0x7f1e77 < _0x1b875b["length"]; _0x7f1e77 += 0x1) {
        const _0x1cf4b5 = {
          'ok': ![],
          'cancelled': !![],
          'reason': "batch-cancelled"
        };
        _0x5684c1 += 0x1;
        onProgress?.({
          'completed': _0x5684c1,
          'total': _0x1b875b["length"],
          'index': _0x7f1e77,
          'target': _0x1b875b[_0x7f1e77],
          'result': _0x1cf4b5
        });
        _0x2f9c31['push'](_0x1cf4b5);
      }
      break;
    }
    _0x2f9c31['push'](await _0x4c72a2(_0x1b875b[_0x3bb0de], _0x3bb0de));
  }
  return _0x2f9c31;
}
function getGeneratingClipIds(_0xdaaf8 = {}, _0x5554ce = null) {
  const _0xd5d707 = new Set((Array["isArray"](_0xdaaf8?.["generatingClipIds"]) ? _0xdaaf8["generatingClipIds"] : [])["map"](_0x4fb91d => normalizeText(_0x4fb91d))["filter"](Boolean));
  const _0x15629c = normalizeText(_0xdaaf8?.['generatingClipId']);
  if (_0x15629c) {
    _0xd5d707["add"](_0x15629c);
  }
  const _0x28ef23 = [..._0xd5d707];
  if (!_0x5554ce) {
    return _0x28ef23;
  }
  const _0x24c69a = new Set((Array['isArray'](_0x5554ce?.["clips"]) ? _0x5554ce["clips"] : [])["map"](_0x550067 => normalizeText(_0x550067?.['id']))["filter"](Boolean));
  return _0x28ef23['filter'](_0x997665 => _0x24c69a['has'](_0x997665));
}
function setClipGenerationRunning(_0x14d9fd, _0x531d15, _0x41c0e0 = !![]) {
  if (!_0x14d9fd || typeof _0x14d9fd !== "object") {
    return [];
  }
  const _0x517e22 = normalizeText(_0x531d15);
  const _0x2f65f2 = new Set(getGeneratingClipIds(_0x14d9fd));
  if (_0x517e22) {
    if (_0x41c0e0) {
      _0x2f65f2['add'](_0x517e22);
    } else {
      _0x2f65f2['delete'](_0x517e22);
    }
  }
  _0x14d9fd["generatingClipIds"] = [..._0x2f65f2];
  _0x14d9fd["generatingClipId"] = _0x14d9fd["generatingClipIds"][0x0] || '';
  return [..._0x14d9fd['generatingClipIds']];
}
function getGenerationState(_0x251b60 = {}, _0x2dae89 = null) {
  const _0x2ccea0 = normalizeText(_0x2dae89?.['id']);
  const _0x26bae3 = _0x251b60?.["clipBatchGenerationByEpisode"];
  const _0x1d1a93 = Boolean(_0x2ccea0 && _0x26bae3 && typeof _0x26bae3 === "object" && !Array["isArray"](_0x26bae3) && Object["hasOwn"](_0x26bae3, _0x2ccea0));
  const _0x17a1c7 = _0x1d1a93 ? _0x26bae3[_0x2ccea0] : null;
  const _0x346172 = getGeneratingClipIds(_0x251b60, _0x2dae89);
  return {
    'generatingClipIds': _0x346172,
    'isBatchGenerating': _0x1d1a93,
    'batchLabel': normalizeText(_0x17a1c7?.['label']),
    'batchCancelRequested': _0x17a1c7?.["cancelRequested"] === !![],
    'busy': _0x1d1a93 || _0x346172["length"] > 0x0
  };
}
function setEpisodeBatchRunning(_0x353e09, _0x47a9a8, _0x468d0c = !![], _0x759dd7 = '', _0xe56a8 = {}) {
  if (!_0x353e09 || typeof _0x353e09 !== "object") {
    return null;
  }
  const _0x4abec5 = normalizeText(_0x47a9a8);
  if (!_0x4abec5) {
    return null;
  }
  const _0x3cc556 = _0x353e09['clipBatchGenerationByEpisode'];
  const _0x1c486e = {
    ...(_0x3cc556 && typeof _0x3cc556 === "object" && !Array["isArray"](_0x3cc556) ? _0x3cc556 : {})
  };
  if (_0x468d0c) {
    _0x1c486e[_0x4abec5] = {
      ...(_0x1c486e[_0x4abec5] || {}),
      ...(_0xe56a8 && typeof _0xe56a8 === "object" ? _0xe56a8 : {}),
      'label': normalizeText(_0x759dd7)
    };
  } else {
    delete _0x1c486e[_0x4abec5];
  }
  _0x353e09['clipBatchGenerationByEpisode'] = _0x1c486e;
  return _0x1c486e[_0x4abec5] || null;
}
function getClipInputSurface(_0x217bcc, _0x367d32, _0x1b1769) {
  if (!_0x1b1769) {
    return '';
  }
  const _0x1b6a76 = resolveModelExecution(_0x217bcc["models"]["video"], {
    'providerHint': _0x217bcc["videoProvider"]
  });
  const _0x34e6b3 = buildStoryClipInputSlotViewModel({
    'modelId': _0x217bcc['models']['video'],
    'provider': _0x217bcc['videoProvider'],
    'inputs': _0x1b1769['inputs']
  });
  const _0x429781 = {
    'model': _0x217bcc["models"]["video"],
    'provider': _0x217bcc['videoProvider'],
    'generationParams': _0x217bcc['videoGenerationParams']
  };
  const _0x2dcb8f = getFixedInputSlotConfigFromManifest(_0x429781, {
    'manifest': _0x1b6a76?.["modelManifest"] || null
  });
  const _0x39ce83 = shouldHideFixedInputSlots(_0x2dcb8f) ? null : _0x2dcb8f;
  const _0x2665a1 = _0x34e6b3['slots']["filter"](_0x131673 => _0x131673["input"]?.['url']);
  const _0x5e097a = Object["fromEntries"](_0x2665a1["map"](_0x46ce79 => [_0x46ce79['id'], {
    ..._0x46ce79["input"],
    'kind': _0x46ce79["kind"]
  }]));
  const _0x3c4245 = new Set(_0x2665a1["map"](_0x34b47e => normalizeText(_0x34b47e["kind"]) + ':' + normalizeText(_0x34b47e["input"]?.['url']))["filter"](Boolean));
  const _0x30ae6f = resolveStoryVideoReplicationClipVoiceAssetIds(_0x217bcc?.["data"], _0x1b1769);
  const _0x38b91a = resolveStoryClipPromptAssetRefs(_0x1b1769?.['prompt'] || '', {
    'assets': Array["isArray"](_0x217bcc?.["data"]?.["assets"]) ? _0x217bcc["data"]["assets"] : [],
    'episode': _0x367d32,
    'clipFrames': Array["isArray"](_0x217bcc?.["data"]?.['clipFrames']) ? _0x217bcc['data']['clipFrames'] : [],
    'resolveExternalAssetRef': resolveAssetMentionRef,
    'voiceAssetIds': _0x30ae6f
  })['map']((_0x3fcdf7, _0x1757f3) => ({
    ..._0x3fcdf7,
    'type': normalizeText(_0x3fcdf7?.["type"] || _0x3fcdf7?.["kind"]),
    'kind': normalizeText(_0x3fcdf7?.["type"] || _0x3fcdf7?.["kind"]),
    'url': normalizeText(_0x3fcdf7?.['url']),
    'thumbUrl': normalizeText(_0x3fcdf7?.['thumbUrl'] || _0x3fcdf7?.['url']),
    'name': normalizeText(_0x3fcdf7?.["name"] || _0x3fcdf7?.["label"]) || "素材 " + (_0x1757f3 + 0x1),
    'refSlot': normalizeText(_0x3fcdf7?.["refSlot"] || _0x3fcdf7?.["slotId"])
  }))["filter"](_0x360ec8 => _0x360ec8["kind"] && _0x360ec8["url"] && !_0x3c4245["has"](_0x360ec8["kind"] + ':' + _0x360ec8["url"]));
  let _0x49191a = _0x38b91a["filter"](_0x4b1b63 => _0x4b1b63["kind"] === 'image');
  const _0x45c7e7 = [];
  if (_0x1b6a76?.["modelManifest"]?.['extensions']?.['rhAiApp'] && _0x39ce83) {
    const _0x445785 = buildFixedInputAssetSlotMapFromRefs(_0x38b91a, {
      'slotOrderByType': _0x39ce83["slotOrderByType"],
      'visibleSlots': _0x39ce83["visibleSlots"],
      'occupiedSlots': _0x2665a1["map"](_0x516ace => _0x516ace['id']),
      'exclusiveGroups': _0x39ce83["exclusiveGroups"],
      'slotById': _0x39ce83["slotById"]
    });
    const _0x595460 = new Set();
    Object['entries'](_0x445785)["forEach"](([_0x3e5e3d, _0x5c6346]) => {
      if (!_0x5c6346?.["url"]) {
        return;
      }
      const _0x1bbcc5 = normalizeText(_0x5c6346["type"] || _0x5c6346["kind"]);
      _0x5e097a[_0x3e5e3d] = {
        ..._0x5c6346,
        'kind': _0x1bbcc5,
        'slotId': _0x3e5e3d
      };
      _0x45c7e7["push"](_0x3e5e3d);
      _0x595460["add"](_0x1bbcc5 + ':' + normalizeText(_0x5c6346["url"]));
    });
    _0x49191a = _0x49191a["filter"](_0x21a7f0 => !_0x595460['has'](_0x21a7f0["kind"] + ':' + _0x21a7f0["url"]));
  }
  return {
    'fixedInputConfig': _0x39ce83,
    'inputsBySlot': _0x5e097a,
    'inputs': _0x2665a1["map"](_0x48bf88 => ({
      ..._0x48bf88["input"],
      'kind': _0x48bf88['kind'],
      'slotId': _0x48bf88['id']
    })),
    'readOnlyInputs': _0x49191a,
    'readOnlyFixedInputSlots': _0x45c7e7
  };
}
function getInputReferenceCounts(_0x4d1ae0) {
  const _0x5b4ac5 = _0x4d1ae0?.["inputs"] && typeof _0x4d1ae0["inputs"] === "object" ? _0x4d1ae0["inputs"] : {};
  const _0xd4f1c5 = _0x366282 => (Array['isArray'](_0x5b4ac5[_0x366282]) ? _0x5b4ac5[_0x366282] : [])['filter'](_0x364f63 => normalizeText(_0x364f63?.["url"]))['length'];
  return {
    'imageCount': _0xd4f1c5("image"),
    'videoCount': _0xd4f1c5('video'),
    'audioCount': _0xd4f1c5("audio")
  };
}
function getUsedReferenceCounts(_0x157761, {
  assets = [],
  episode = null,
  clipFrames = [],
  voiceAssetIds = null
} = {}) {
  const _0x47f2bc = {
    'imageCount': 0x0,
    'audioCount': 0x0,
    'videoCount': 0x0
  };
  const _0x122729 = new Set();
  const _0x387251 = (_0x50e0e1, _0x2810ae = '') => {
    const _0x1abcb5 = normalizeText(_0x50e0e1?.["type"] || _0x50e0e1?.['kind'] || _0x2810ae);
    const _0x6613bf = normalizeText(_0x50e0e1?.["url"]);
    if (!Object["hasOwn"](_0x47f2bc, _0x1abcb5 + "Count") || !_0x6613bf) {
      return;
    }
    const _0x567e07 = _0x1abcb5 + ':' + _0x6613bf;
    if (_0x122729["has"](_0x567e07)) {
      return;
    }
    _0x122729["add"](_0x567e07);
    _0x47f2bc[_0x1abcb5 + "Count"] += 0x1;
  };
  const _0x4f4839 = _0x157761?.["inputs"] && typeof _0x157761["inputs"] === "object" ? _0x157761["inputs"] : {};
  ["image", "audio", "video"]["forEach"](_0x660094 => {
    (Array["isArray"](_0x4f4839[_0x660094]) ? _0x4f4839[_0x660094] : [])["forEach"](_0x107d91 => _0x387251(_0x107d91, _0x660094));
  });
  resolveStoryClipPromptAssetRefs(_0x157761?.["prompt"] || '', {
    'assets': assets,
    'episode': episode,
    'clipFrames': clipFrames,
    'resolveExternalAssetRef': resolveAssetMentionRef,
    'voiceAssetIds': voiceAssetIds
  })["forEach"](_0x4c5085 => _0x387251(_0x4c5085));
  return _0x47f2bc;
}
function renderReferenceSummary(_0x444a1a, {
  assets = [],
  episode = null,
  clipFrames = [],
  voiceAssetIds = null
} = {}) {
  const _0x271973 = getUsedReferenceCounts(_0x444a1a, {
    'assets': assets,
    'episode': episode,
    'clipFrames': clipFrames,
    'voiceAssetIds': voiceAssetIds
  });
  const _0x3b74f7 = "参考素材，图片 " + _0x271973["imageCount"] + '，音频\x20' + _0x271973["audioCount"] + "，视频 " + _0x271973["videoCount"];
  return '<div\x20class=\x22story-clip-reference-summary\x22\x20data-story-clip-reference-summary\x20role=\x22status\x22\x20aria-live=\x22polite\x22\x20aria-label=\x22' + _0x3b74f7 + '\x22>\x0a\x20\x20\x20\x20<span>图片：<strong\x20data-story-reference-count=\x22image\x22>' + _0x271973["imageCount"] + "</strong></span>\n    <span>音频：<strong data-story-reference-count=\"audio\">" + _0x271973['audioCount'] + "</strong></span>\n    <span>视频：<strong data-story-reference-count=\"video\">" + _0x271973['videoCount'] + '</strong></span>\x0a\x20\x20</div>';
}
function renderSelectionControls(_0x1a5dfb, _0x1d6a69, _0x58e2f6 = null) {
  const _0x1c9a45 = Array["isArray"](_0x1d6a69?.["clips"]) ? _0x1d6a69["clips"] : [];
  const _0x39a316 = Array["isArray"](_0x1a5dfb?.["selectedClipGenerationIds"]) ? _0x1a5dfb['selectedClipGenerationIds'] : [];
  const _0x1ef7aa = selectBatchTargets(_0x1c9a45, _0x39a316);
  const _0x2e2188 = _0x1ef7aa["length"];
  const _0x599c0c = getGenerationState(_0x1a5dfb, _0x1d6a69);
  const {
    generatingClipIds: _0x43d871
  } = _0x599c0c;
  const _0x34aff1 = _0x58e2f6 || getSelectedClip(_0x1a5dfb, _0x1d6a69);
  const _0x4ad912 = _0x1a5dfb?.['clipSelectionMode'] ? _0x1ef7aa[0x0] : _0x34aff1;
  const _0xbc6f3c = _0x1a5dfb?.["clipSelectionMode"] && _0x2e2188 > 0x1;
  const _0x34b94d = !_0x1a5dfb?.["clipSelectionMode"] || _0x2e2188 === 0x1;
  const _0x1bc49d = _0x34b94d && Boolean(_0x4ad912 && (_0x43d871["includes"](normalizeText(_0x4ad912['id'])) || getRecoverableStoryClipVideoTask(_0x4ad912)));
  const _0x6d6303 = _0x599c0c['isBatchGenerating'];
  const _0x130ce5 = _0x1a5dfb?.["clipSelectionMode"] ? _0x2e2188 === 0x0 || _0x599c0c["isBatchGenerating"] || (_0xbc6f3c ? _0x43d871['length'] > 0x0 : _0x1bc49d) : !_0x34aff1 || _0x599c0c["isBatchGenerating"] || _0x1bc49d;
  const _0x436327 = normalizeText(_0x4ad912?.["generation"]?.["status"])['toLowerCase']() === "queued";
  const _0x5f1eb0 = "批量生成视频" + (_0x2e2188 ? '\x20(' + _0x2e2188 + ')' : '');
  const _0x4e9a4f = _0x599c0c["isBatchGenerating"] ? _0x5f1eb0 : _0x1bc49d ? _0x436327 ? "排队中" : "生成中" : _0x1a5dfb?.["clipSelectionMode"] && _0x2e2188 > 0x1 ? _0x5f1eb0 : '生成本片段';
  const _0x1f5b89 = Boolean(_0x599c0c["isBatchGenerating"] || _0x1bc49d);
  const _0x68546d = renderRequestDebugButton('data-story-action=\x22debug-clip-video\x22') + '<button\x20type=\x22button\x22\x20class=\x22story-workbench-action-button\x20story-main-action-button\x22\x20data-story-action=\x22generate-clip-video\x22\x20aria-busy=\x22' + _0x1f5b89 + '\x22\x20' + (_0x130ce5 ? "disabled" : '') + '>' + (_0x1f5b89 ? renderStoryGenerationSpinner({
    'button': !![]
  }) : '') + _0x4e9a4f + "</button>";
  const _0x46f023 = _0x599c0c["isBatchGenerating"] ? "<button type=\"button\" class=\"story-secondary-button\" data-story-action=\"cancel-clip-batch-generation\" " + (_0x599c0c["batchCancelRequested"] ? 'disabled' : '') + '>' + (_0x599c0c["batchCancelRequested"] ? "正在停止" : "停止批量生成") + '</button>' : '';
  const _0x4788e2 = _0x1a5dfb?.["clipSelectionMode"] ? '<div\x20class=\x22story-clip-selection-actions\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-secondary-button\x22\x20data-story-action=\x22select-all-clips\x22\x20' + (_0x6d6303 || !_0x1c9a45['length'] || _0x2e2188 === _0x1c9a45["length"] ? "disabled" : '') + ">全选</button>\n        <button type=\"button\" class=\"story-secondary-button\" data-story-action=\"cancel-clip-selection\">" + (_0x6d6303 ? '退出多选' : '取消') + '</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + _0x46f023 + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + _0x68546d + '\x0a\x20\x20\x20\x20\x20\x20</div>' : "<div class=\"story-clip-selection-actions\">\n        <button type=\"button\" class=\"story-secondary-button story-clip-selection-trigger workspace-selection-trigger\" data-story-action=\"toggle-clip-selection\" " + (_0x6d6303 || !_0x1c9a45['length'] ? "disabled" : '') + ">多选</button>\n        " + _0x46f023 + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + _0x68546d + "\n      </div>";
  return "<div class=\"story-clip-selection-controls\">" + _0x4788e2 + (_0x1a5dfb?.["clipSelectionMode"] ? renderStorySerialExecutionToggle() : '') + "</div>";
}
function renderAdjustmentBar(_0x313cc5, _0x2bb453, _0x3096f2 = null) {
  if (_0x313cc5?.["clipAdjustmentOpen"] !== !![]) {
    return '';
  }
  const _0x3afac5 = isStoryClipAdjustmentGenerating(_0x313cc5, _0x3096f2, _0x2bb453);
  const _0x14c9af = normalizeStoryPromptMode(_0x2bb453?.["promptMode"] || _0x3096f2?.['promptMode'] || _0x313cc5?.["data"]?.['project']?.["planning"]?.["promptMode"], {
    'allowDeveloperModes': !![]
  });
  const _0x3f0fba = normalizeStoryPromptMode(_0x313cc5?.['clipAdjustmentPromptMode'] || _0x14c9af, {
    'allowDeveloperModes': !![]
  });
  const _0x5c572b = canGenerateStoryClipAdjustment(_0x313cc5, _0x3096f2, _0x2bb453);
  return "<div class=\"story-clip-adjustment-bar\" data-story-clip-adjustment-bar>\n    <div class=\"story-clip-adjustment-selectors\">\n    <div class=\"story-clip-adjustment-mode\" data-story-clip-adjustment-mode data-story-adjustment-kind=\"mode\">\n      <button type=\"button\" class=\"story-clip-adjustment-mode-trigger\" data-story-action=\"toggle-clip-adjustment-mode\" aria-haspopup=\"listbox\" aria-expanded=\"" + (_0x313cc5?.["clipAdjustmentPromptModeOpen"] === !![]) + '\x22\x20' + (_0x3afac5 ? "disabled" : '') + ">\n        <strong data-story-clip-adjustment-mode-label>" + escapeHtml(getStoryPromptModeLabel(_0x3f0fba)) + "</strong>\n        <span aria-hidden=\"true\">⌄</span>\n      </button>\n      <div class=\"story-clip-adjustment-mode-menu\" role=\"listbox\" aria-label=\"提示词模式\" " + (_0x313cc5?.['clipAdjustmentPromptModeOpen'] === !![] ? '' : "hidden") + ">\n        " + STORY_PROMPT_MODE_OPTIONS["map"](_0x155573 => "<button type=\"button\" class=\"" + (_0x155573["value"] === _0x3f0fba ? "is-selected" : '') + '\x22\x20data-story-action=\x22select-clip-adjustment-mode\x22\x20data-story-clip-adjustment-mode-option=\x22' + escapeHtml(_0x155573["value"]) + "\" role=\"option\" aria-selected=\"" + (_0x155573["value"] === _0x3f0fba) + '\x22>' + escapeHtml(_0x155573["label"]) + "</button>")["join"]('') + "\n      </div>\n    </div>\n    <div class=\"story-clip-adjustment-mode\" data-story-clip-adjustment-mode data-story-adjustment-kind=\"language\">\n      <button type=\"button\" class=\"story-clip-adjustment-mode-trigger\" data-story-action=\"toggle-clip-adjustment-mode\" aria-label=\"语言转换\" aria-haspopup=\"listbox\" aria-expanded=\"" + (_0x313cc5?.["clipAdjustmentLanguageOpen"] === !![]) + '\x22\x20' + (_0x3afac5 ? 'disabled' : '') + ">\n        <strong data-story-clip-adjustment-mode-label>" + escapeHtml(STORY_PROMPT_LANGUAGES['find'](_0x51b541 => _0x51b541["value"] === _0x313cc5?.["clipAdjustmentLanguage"])?.['label'] || "语言转换") + "</strong><span aria-hidden=\"true\">⌄</span>\n      </button>\n      <div class=\"story-clip-adjustment-mode-menu\" role=\"listbox\" aria-label=\"语言转换\" " + (_0x313cc5?.['clipAdjustmentLanguageOpen'] ? '' : 'hidden') + ">\n        " + [{
    'value': '',
    'label': '保持当前语言'
  }, ...STORY_PROMPT_LANGUAGES]["map"](_0x5bb582 => "<button type=\"button\" class=\"" + (_0x5bb582["value"] === (_0x313cc5?.['clipAdjustmentLanguage'] || '') ? "is-selected" : '') + '\x22\x20data-story-action=\x22select-clip-adjustment-mode\x22\x20data-story-clip-adjustment-mode-option=\x22' + _0x5bb582["value"] + '\x22\x20role=\x22option\x22\x20aria-selected=\x22' + (_0x5bb582["value"] === (_0x313cc5?.["clipAdjustmentLanguage"] || '')) + '\x22>' + _0x5bb582['label'] + "</button>")['join']('') + "\n      </div>\n    </div></div>\n    <div class=\"story-clip-adjustment-compose\">\n      <input type=\"text\" data-story-clip-adjustment-instruction maxlength=\"600\" value=\"" + escapeHtml(_0x313cc5?.["clipAdjustmentInstruction"] || '') + '\x22\x20placeholder=\x22可选：补充这一段还要怎么调整\x22\x20aria-label=\x22AI\x20调整说明\x22\x20' + (_0x3afac5 ? "disabled" : '') + '>\x0a\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-workbench-action-button\x22\x20data-story-action=\x22generate-clip-adjustment\x22\x20' + (_0x3afac5 || !_0x5c572b ? "disabled" : '') + " aria-busy=\"" + _0x3afac5 + '\x22>' + (_0x3afac5 ? renderStoryGenerationSpinner({
    'button': !![]
  }) : '') + (_0x3afac5 ? '生成中' : '生成') + '</button>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</div>';
}
function shouldCloseAdjustmentOnOutsideClick(_0x2625f0, _0x2bb9b9) {
  return _0x2625f0?.["clipAdjustmentOpen"] === !![] && !_0x2bb9b9?.["closest"]?.(".story-clip-adjustment-control");
}
function shouldClosePromptHistoryOnOutsideClick(_0x5a52e8, _0x3290aa) {
  return _0x5a52e8?.["clipPromptHistoryOpen"] === !![] && !_0x3290aa?.["closest"]?.('[data-story-clip-prompt-history]');
}
function renderPromptHistoryControl(_0x412d46, _0x38569a) {
  const _0x55c6c7 = normalizeStoryClipPromptHistory(_0x38569a?.["promptHistory"]);
  if (!_0x55c6c7['length']) {
    return '';
  }
  const _0x195273 = _0x412d46?.["clipPromptHistoryOpen"] === !![];
  return "<div class=\"story-clip-prompt-history\" data-story-clip-prompt-history>\n    <button type=\"button\" class=\"story-clip-prompt-history-trigger\" data-story-action=\"toggle-clip-prompt-history\" aria-label=\"提示词历史\" aria-haspopup=\"dialog\" aria-expanded=\"" + _0x195273 + "\">\n      <svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M3.8 12a8.2 8.2 0 1 0 2.4-5.8L4 8.4M4 4.8v3.6h3.6M12 7.8v4.7l3.1 1.8\"/></svg>\n    </button>\n    <section class=\"story-clip-prompt-history-panel\" data-story-clip-prompt-history-panel role=\"dialog\" aria-label=\"提示词历史\" " + (_0x195273 ? '' : "hidden") + ">\n      <header><strong>提示词历史</strong><span>最近 " + _0x55c6c7["length"] + " 个已确认版本</span></header>\n      <div class=\"story-clip-prompt-history-list\">\n        " + _0x55c6c7['map'](_0x2f623b => {
    const _0x3d8357 = _0x2f623b['durationSec'] > 0x0 ? _0x2f623b["durationSec"]["toFixed"](0x1) + 's' : "时长未记录";
    const _0x428b7e = getPromptHistoryPreview(_0x2f623b["promptHtml"]) || "空提示词";
    return "<button type=\"button\" class=\"story-clip-prompt-history-item\" data-story-action=\"restore-clip-prompt-history\" data-story-clip-prompt-history-id=\"" + escapeHtml(_0x2f623b['id']) + "\" aria-label=\"恢复 " + escapeHtml(getStoryPromptModeLabel(_0x2f623b["promptMode"])) + " 历史提示词\">\n            <span class=\"story-clip-prompt-history-item-meta\"><strong>" + escapeHtml(getStoryPromptModeLabel(_0x2f623b["promptMode"])) + '\x20·\x20' + _0x3d8357 + '</strong><small>' + escapeHtml(formatPromptHistorySavedAt(_0x2f623b["savedAt"])) + "</small></span>\n            <span class=\"story-clip-prompt-history-item-preview\">" + escapeHtml(_0x428b7e) + "</span>\n            <span class=\"story-clip-prompt-history-item-action\">恢复</span>\n          </button>";
  })["join"]('') + '\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</section>\x0a\x20\x20</div>';
}
function renderAdjustmentControl(_0x41f8c8, _0x22395a, _0x387a = null) {
  if (_0x22395a?.["promptAdjustment"]?.["candidate"]) {
    return '';
  }
  const _0x368026 = isStoryClipAdjustmentGenerating(_0x41f8c8, _0x387a, _0x22395a);
  const _0x4ae96a = "<div class=\"story-clip-adjustment-header\">\n    " + renderPromptHistoryControl(_0x41f8c8, _0x22395a) + "\n    <button type=\"button\" class=\"story-clip-adjustment-trigger\" data-story-action=\"toggle-clip-adjustment\" aria-expanded=\"" + (_0x41f8c8?.["clipAdjustmentOpen"] === !![]) + '\x22\x20' + (_0x368026 ? "disabled" : '') + '><span\x20aria-hidden=\x22true\x22>✦</span>AI\x20调整</button>\x0a\x20\x20</div>';
  return "<div class=\"story-clip-adjustment-control\">\n    " + _0x4ae96a + "\n    " + renderAdjustmentBar(_0x41f8c8, _0x22395a, _0x387a) + "\n  </div>";
}
function renderPromptComparison(_0x5e2232) {
  const _0x23173c = _0x5e2232?.["promptAdjustment"]?.["candidate"];
  if (!_0x23173c) {
    return '';
  }
  const _0x19be86 = normalizeDurationSeconds(_0x23173c["sourceDurationSeconds"] || _0x5e2232?.["durationSec"] || _0x5e2232?.["duration"]);
  const _0x5a3602 = normalizeDurationSeconds(_0x23173c["candidateDurationSeconds"] || _0x19be86);
  const _0x5e3f5b = normalizeStoryPromptMode(_0x23173c["sourcePromptMode"] || _0x5e2232?.["promptMode"], {
    'allowDeveloperModes': !![]
  });
  const _0x19f635 = normalizeStoryPromptMode(_0x23173c["targetPromptMode"] || _0x5e3f5b, {
    'allowDeveloperModes': !![]
  });
  const _0x439a6e = _0x1d3212 => _0x1d3212 > 0x0 ? _0x1d3212["toFixed"](0x1) + 's' : '--';
  return '<div\x20class=\x22story-clip-prompt-comparison\x22\x20data-story-clip-prompt-comparison>\x0a\x20\x20\x20\x20<header>\x0a\x20\x20\x20\x20\x20\x20<span>AI\x20调整完成</span>\x0a\x20\x20\x20\x20\x20\x20<strong>选择这个片段要使用的提示词版本</strong>\x0a\x20\x20\x20\x20</header>\x0a\x20\x20\x20\x20<div\x20class=\x22story-clip-prompt-comparison-grid\x22>\x0a\x20\x20\x20\x20\x20\x20<article>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-clip-prompt-version-title\x22><strong>原版本\x20·\x20' + escapeHtml(getStoryPromptModeLabel(_0x5e3f5b)) + "</strong><span>总时长 " + _0x439a6e(_0x19be86) + "</span></div>\n        <div class=\"story-clip-prompt-version-content\">" + sanitizePromptHtmlForCommit(_0x23173c["sourcePromptHtml"]) + '</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20data-story-action=\x22keep-current-clip-prompt\x22>保留原版本</button>\x0a\x20\x20\x20\x20\x20\x20</article>\x0a\x20\x20\x20\x20\x20\x20<article\x20class=\x22is-ai-version\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-clip-prompt-version-title\x22><strong>AI\x20调整后\x20·\x20' + escapeHtml(getStoryPromptModeLabel(_0x19f635)) + "</strong><span>总时长 " + _0x439a6e(_0x5a3602) + "</span></div>\n        <div class=\"story-clip-prompt-version-content\">" + sanitizePromptHtmlForCommit(_0x23173c["promptHtml"]) + "</div>\n        <div class=\"story-clip-prompt-version-actions\">\n          <button type=\"button\" class=\"story-regenerate-button\" data-story-action=\"regenerate-clip-adjustment\">重新生成</button>\n          <button type=\"button\" class=\"story-workbench-action-button\" data-story-action=\"use-ai-clip-prompt\">使用 AI 版本</button>\n        </div>\n      </article>\n    </div>\n  </div>";
}
function renderPromptSurface(_0x243b4e, _0x1acbee, _0x5a347a) {
  try {
    const _0x5a76bd = getClipInputSurface(_0x243b4e, _0x1acbee, _0x5a347a);
    const _0x3ca40f = resolveStoryClipVideoGenerationParams(_0x5a347a, _0x243b4e["models"]["video"], _0x243b4e["videoGenerationParams"]);
    const _0x1fb4a5 = {
      ...(_0x243b4e["videoGenerationParamsByModel"] || {}),
      [_0x243b4e["models"]["video"]]: {
        ..._0x3ca40f
      }
    };
    const _0x47b326 = normalizeStoryPromptMode(_0x5a347a?.["promptMode"] || _0x1acbee?.['promptMode'] || _0x243b4e?.["data"]?.['project']?.['planning']?.['promptMode'], {
      'allowDeveloperModes': !![]
    });
    const _0x4e3193 = isStoryMinimaxH3PromptMode(_0x47b326) ? normalizeStoryMinimaxH3OfficialTags(_0x5a347a?.["prompt"] || '') : _0x5a347a?.["prompt"] || '';
    const _0x59856e = renderStoryClipPromptMentions(_0x4e3193, {
      'assets': Array["isArray"](_0x243b4e?.["data"]?.['assets']) ? _0x243b4e["data"]["assets"] : [],
      'episode': _0x1acbee,
      'clipFrames': Array["isArray"](_0x243b4e?.['data']?.['clipFrames']) ? _0x243b4e["data"]["clipFrames"] : []
    });
    const _0x4a18fc = isStoryClipAdjustmentGenerating(_0x243b4e, _0x1acbee, _0x5a347a);
    const _0x55cf87 = Boolean(_0x5a347a?.["promptAdjustment"]?.["candidate"]);
    return "<div class=\"story-video-node-prompt text-prompt-panel\" data-story-clip-prompt-surface>\n      <div class=\"story-clip-prompt-toolbar\">\n        " + renderVideoReferenceBarMarkup({
      ..._0x5a76bd,
      'attachmentButtonHtml': ''
    }) + "\n        " + renderAdjustmentControl(_0x243b4e, _0x5a347a, _0x1acbee) + "\n      </div>\n      " + (_0x4a18fc ? '<div\x20class=\x22story-clip-prompt-adjustment-loading\x22\x20role=\x22status\x22\x20aria-live=\x22polite\x22\x20aria-busy=\x22true\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + renderGenerationSpinner() + "\n            <strong>正在调整当前片段提示词</strong>\n            <span>其他片段不受影响</span>\n          </div>" : _0x55cf87 ? renderPromptComparison(_0x5a347a) : renderVideoPromptEditorMarkup({
      'promptHtml': _0x59856e,
      'placeholder': t("aigenVideoNode.prompt.placeholder"),
      'attributes': "data-story-clip-prompt"
    })) + "\n      <div class=\"story-clip-model-bar prompt-panel-footer\">\n        " + renderAIGenVideoModelSelectorMarkup({
      'modelId': _0x243b4e["models"]['video'],
      'provider': _0x243b4e['videoProvider'],
      'generationParams': _0x3ca40f,
      'generationParamsByModel': _0x1fb4a5,
      'providerProfileId': _0x243b4e['videoProviderProfileId'],
      'providerProfileIdByModel': _0x243b4e["videoProviderProfileIdByModel"],
      'referenceCounts': getInputReferenceCounts(_0x5a347a),
      'showSchemaControls': !![],
      'className': 'story-clip-video-model-selector',
      'runningHubWorkflowAllowedModelIds': STORY_WORKSPACE_RUNNINGHUB_WORKFLOW_MODEL_IDS
    }) + "\n        <span class=\"story-clip-provider-profile-control\" data-story-video-provider-profile></span>\n        <div class=\"story-clip-generation-actions\">\n          " + renderSelectionControls(_0x243b4e, _0x1acbee, _0x5a347a) + "\n        </div>\n      </div>\n    </div>";
  } catch (_0x27a657) {
    return "<div class=\"story-inline-error\">" + escapeHtml(_0x27a657?.["message"] || "当前模型输入槽不可用") + "</div>";
  }
}
function renderVideoResultSwitchButton(_0x48d650, _0x18f306) {
  const _0x557006 = _0x48d650 === "previous";
  const _0x2b745f = _0x557006 ? 'previous-video-result' : "next-video-result";
  const _0x2aef4c = _0x557006 ? '切换到上一个历史视频' : "切换到下一个历史视频";
  const _0x41db9c = _0x557006 ? "story-video-result-switch--previous" : 'story-video-result-switch--next';
  const _0x1c30af = _0x557006 ? "m6.5 14.5 5.5-5.5 5.5 5.5" : "m6.5 9.5 5.5 5.5 5.5-5.5";
  return "<button type=\"button\" class=\"story-appearance-arrow story-video-result-switch " + _0x41db9c + '\x22\x20data-story-action=\x22' + _0x2b745f + "\" data-story-clip-id=\"" + escapeHtml(_0x18f306?.['id']) + "\" aria-label=\"" + _0x2aef4c + "\"><svg class=\"story-appearance-arrow-icon\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"" + _0x1c30af + "\"/></svg></button>";
}
function renderVideoPlaybackControls(_0x172800, _0x2b52e0) {
  const _0x448946 = escapeHtml(_0x172800?.['id']);
  return renderWorkspaceVideoPlaybackControls({
    'label': '视频',
    'playLabel': "播放视频",
    'playTitle': "播放视频",
    'controlsAttributes': {
      'data-story-video-controls': !![]
    },
    'playAttributes': {
      'data-story-video-play': !![]
    },
    'currentTimeAttributes': {
      'data-story-video-time-current': !![]
    },
    'progressAttributes': {
      'data-story-video-progress': !![]
    },
    'progressFillAttributes': {
      'data-story-video-progress-fill': !![]
    },
    'totalTimeAttributes': {
      'data-story-video-time-total': !![]
    },
    'volumeAttributes': {
      'data-story-video-volume': !![]
    },
    'volumeToggleAttributes': {
      'data-story-video-volume-toggle': !![]
    },
    'slots': {
      'beforeVolume': "<button type=\"button\" class=\"video-snap-btn story-video-snap-btn\" data-story-action=\"capture-video-frame\" data-story-clip-id=\"" + _0x448946 + "\" data-story-video-result-index=\"" + _0x2b52e0 + '\x22\x20aria-label=\x22获取当前帧\x22\x20title=\x22获取当前帧\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + renderStoryKeyframeIcon() + "\n      </button>\n      <button type=\"button\" class=\"video-snap-btn story-video-snap-btn story-video-clip-btn\" data-story-action=\"trim-video\" data-story-clip-id=\"" + _0x448946 + "\" data-story-video-result-index=\"" + _0x2b52e0 + "\" aria-label=\"裁剪视频\" title=\"裁剪视频\">\n        " + VIDEO_CLIP_ICON_SVG + "\n      </button>"
    }
  });
}
function renderVideoPreview(_0x2ca97e, {
  isGenerating = ![]
} = {}) {
  const _0x12130a = getVideoResults(_0x2ca97e);
  const _0x51eb9f = getActiveVideoResultIndex(_0x2ca97e, _0x12130a);
  const _0x3bc221 = _0x12130a[_0x51eb9f] || {};
  const _0x60a554 = resolveVideoResultUrl(_0x3bc221);
  const _0x218ab8 = normalizeText(_0x2ca97e?.["generation"]?.["status"])["toLowerCase"]();
  const _0xf584bd = isGenerating || ["pending", 'queued', "recovering", "running", 'submitting']["includes"](_0x218ab8);
  if (_0xf584bd) {
    return "<div class=\"story-video-empty story-video-loading\" role=\"status\" aria-live=\"polite\" aria-busy=\"true\">\n      " + renderGenerationSpinner() + "\n      <strong>视频生成中</strong>\n      <p>正在等待生成结果，完成后会自动显示。</p>\n    </div>";
  }
  if (_0x60a554) {
    const _0x33645a = _0x12130a["length"] > 0x1;
    return '<div\x20class=\x22story-video-result\x22\x20data-story-video-result-index=\x22' + _0x51eb9f + "\">\n      <div class=\"story-video-stage\">\n        " + (_0x33645a ? renderVideoResultSwitchButton('previous', _0x2ca97e) : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<video\x20data-story-video-player\x20data-story-video-url=\x22' + escapeHtml(_0x60a554) + "\" playsinline preload=\"auto\"></video>\n        " + (_0x33645a ? renderVideoResultSwitchButton("next", _0x2ca97e) : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + renderVideoPlaybackControls(_0x2ca97e, _0x51eb9f) + "\n      </div>\n      <div class=\"story-video-result-meta\"><strong>视频结果</strong><span>" + (_0x51eb9f + 0x1) + '/' + _0x12130a["length"] + "</span></div>\n    </div>";
  }
  const _0x139274 = _0x2ca97e?.["generation"]?.["error"] || '';
  const _0x20369c = _0x139274 ? 'story-video-empty\x20story-video-error' : 'story-video-empty';
  return '<div\x20class=\x22' + _0x20369c + '\x22>\x0a\x20\x20\x20\x20<strong>视频结果</strong>\x0a\x20\x20\x20\x20<p>' + escapeHtml(_0x139274 || "生成完成后将在这里预览本片段视频。") + "</p>\n  </div>";
}
function renderTimeline(_0x5c7d8c, _0x233a59, {
  selectionMode = ![],
  selectedClipIds = [],
  pendingDeleteClipId = '',
  generatingClipIds = [],
  adjustingClipIds = [],
  modelId = '',
  generationParams = {}
} = {}) {
  const _0x3f8775 = Array["isArray"](_0x5c7d8c?.['clips']) ? _0x5c7d8c["clips"] : [];
  const _0x479f41 = new Set((Array["isArray"](selectedClipIds) ? selectedClipIds : [])["map"](_0x43bf9d => normalizeText(_0x43bf9d)));
  const _0x263349 = new Set((Array["isArray"](generatingClipIds) ? generatingClipIds : [])["map"](_0x144b39 => normalizeText(_0x144b39))["filter"](Boolean));
  return "<div class=\"story-clip-timeline " + (selectionMode ? "is-selection-mode" : '') + "\">\n    <div class=\"story-clip-timeline-header\">\n      <span>" + escapeHtml(_0x5c7d8c?.['duration'] || "--:--") + "</span>\n      <small>" + (selectionMode ? "点击片段选择需要生成的视频" : "点击片段切换提示词和视频结果") + "</small>\n    </div>\n    <div class=\"story-clip-strip\" data-story-marquee-surface=\"clips\">\n      " + _0x3f8775["map"]((_0x1e466e, _0x17c341) => {
    const _0x90bacc = normalizeText(_0x1e466e['id']);
    const _0x4bbe39 = adjustingClipIds["includes"](_0x90bacc);
    const _0x23f58c = getVideoResults(_0x1e466e);
    const _0x3e7cc7 = renderTimelineVideoThumbnail(_0x1e466e);
    const _0x5f12da = normalizeText(_0x1e466e?.["generation"]?.["status"])['toLowerCase']();
    const _0x57c0de = _0x263349['has'](_0x90bacc) || ["pending", "queued", 'recovering', "running", "submitting"]["includes"](_0x5f12da);
    const _0x1edf99 = _0x479f41["has"](_0x90bacc);
    const _0x40aae9 = !_0x57c0de && normalizeText(pendingDeleteClipId) === _0x90bacc;
    const _0x3a553d = "<div class=\"story-clip-card-shell" + (_0x57c0de ? " is-generating" : '') + (_0x40aae9 ? " is-delete-confirming" : '') + "\" data-story-video-history=\"" + (_0x23f58c["length"] > 0x1) + "\" data-story-clip-id=\"" + escapeHtml(_0x1e466e['id']) + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-clip-card\x20' + (_0x1e466e['id'] === _0x233a59 ? 'is-selected' : '') + '\x20' + (selectionMode ? "is-selection-mode" : '') + '\x20' + (_0x1edf99 ? "is-checked" : '') + (_0x3e7cc7 ? '\x20has-video-thumbnail' : '') + "\" data-story-clip-id=\"" + escapeHtml(_0x1e466e['id']) + '\x22\x20data-story-marquee-item\x20data-story-marquee-id=\x22' + escapeHtml(_0x1e466e['id']) + "\" aria-pressed=\"" + (selectionMode ? String(_0x1edf99) : 'false') + "\" aria-busy=\"" + _0x57c0de + "\">\n            " + (selectionMode && !_0x57c0de ? "<span class=\"story-asset-select-indicator story-clip-select-indicator\" aria-hidden=\"true\">" + (_0x1edf99 ? '✓' : '') + '</span>' : '') + "\n            " + (_0x3e7cc7 ? "<span class=\"story-clip-card-media\" aria-hidden=\"true\">" + _0x3e7cc7 + "</span>" : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22story-clip-card-copy\x22><strong>片段' + escapeHtml(String(_0x1e466e["number"] || _0x17c341 + 0x1)["padStart"](0x2, '0')) + "</strong><small data-story-clip-duration=\"" + escapeHtml(_0x1e466e['id']) + '\x22>' + escapeHtml(formatStoryClipVideoGenerationDuration(_0x1e466e, modelId, generationParams)) + "</small></span>\n          </button>\n          " + (_0x4bbe39 && !_0x57c0de ? "<span class=\"story-clip-card-adjusting generation-loading-surface\" role=\"status\" aria-busy=\"true\" aria-label=\"正在调整提示词\"><span class=\"generation-loading-shimmer\" aria-hidden=\"true\"></span><span class=\"generation-loading-label\">正在调整提示词</span></span>" : '') + "\n          " + (_0x57c0de ? "<span class=\"story-clip-card-loading generation-loading-surface\" role=\"status\" aria-busy=\"true\" aria-label=\"片段 " + escapeHtml(_0x1e466e['number']) + '\x20视频生成中\x22><span\x20class=\x22generation-loading-shimmer\x22\x20aria-hidden=\x22true\x22></span><span\x20class=\x22generation-loading-label\x22>视频生成中</span></span>' : selectionMode || _0x4bbe39 ? '' : renderWorkspaceCardDeleteControl({
      'className': 'story-clip-delete-trigger',
      'ariaLabel': "删除片段 " + _0x1e466e["number"] + '：' + (_0x1e466e["title"] || '未命名片段'),
      'actionAttributes': {
        'data-story-action': 'request-delete-clip',
        'data-story-clip-delete-id': _0x1e466e['id'],
        'hidden': _0x40aae9
      }
    }) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-project-delete-confirm\x20story-clip-delete-confirm\x22\x20' + (_0x40aae9 ? '' : "hidden") + " aria-label=\"确认删除片段 " + escapeHtml(_0x1e466e['number']) + "\">\n            <button type=\"button\" class=\"confirm-btn confirm-cancel\" data-story-action=\"cancel-delete-clip\" data-story-clip-delete-id=\"" + escapeHtml(_0x1e466e['id']) + "\">取消</button>\n            <button type=\"button\" class=\"confirm-btn confirm-ok\" data-story-action=\"confirm-delete-clip\" data-story-clip-delete-id=\"" + escapeHtml(_0x1e466e['id']) + "\">删除</button>\n          </div>") + "\n        </div>";
    if (_0x17c341 >= _0x3f8775["length"] - 0x1) {
      return _0x3a553d;
    }
    const _0x243033 = _0x3f8775[_0x17c341 + 0x1];
    return _0x3a553d + "<button type=\"button\" class=\"story-clip-insert-button\" data-story-insert-after-clip-id=\"" + escapeHtml(_0x1e466e['id']) + "\" aria-label=\"在片段 " + escapeHtml(_0x1e466e["number"]) + '\x20和片段\x20' + escapeHtml(_0x243033?.["number"]) + " 之间新增片段\"><span aria-hidden=\"true\">+</span></button>";
  })["join"]('') + "\n    </div>\n  </div>";
}
function renderEpisode(_0x278a74 = {}, _0x26df66 = null, _0x12168c = null) {
  const _0x23d95c = _0x26df66 || getSelectedEpisode(_0x278a74);
  const _0x114804 = _0x12168c || getSelectedClip(_0x278a74, _0x23d95c);
  const _0x4e223c = Array["isArray"](_0x278a74?.["data"]?.["assets"]) ? _0x278a74["data"]["assets"] : [];
  const _0x24cc9d = Array["isArray"](_0x278a74?.['data']?.["clipFrames"]) ? _0x278a74['data']['clipFrames'] : [];
  const _0xe54631 = resolveStoryVideoReplicationClipVoiceAssetIds(_0x278a74?.["data"], _0x114804);
  return {
    get 'referenceCounts'() {
      return getUsedReferenceCounts(_0x114804, {
        'assets': _0x4e223c,
        'episode': _0x23d95c,
        'clipFrames': _0x24cc9d,
        'voiceAssetIds': _0xe54631
      });
    },
    get 'referenceSummary'() {
      return renderReferenceSummary(_0x114804, {
        'assets': _0x4e223c,
        'episode': _0x23d95c,
        'clipFrames': _0x24cc9d,
        'voiceAssetIds': _0xe54631
      });
    },
    get 'referenceBar'() {
      return renderVideoReferenceBarMarkup({
        ...getClipInputSurface(_0x278a74, _0x23d95c, _0x114804),
        'attachmentButtonHtml': ''
      });
    },
    get 'selectionControls'() {
      return renderSelectionControls(_0x278a74, _0x23d95c, _0x114804);
    },
    get 'adjustmentBar'() {
      return renderAdjustmentBar(_0x278a74, _0x114804, _0x23d95c);
    },
    get 'adjustmentControl'() {
      return renderAdjustmentControl(_0x278a74, _0x114804, _0x23d95c);
    },
    get 'promptSurface'() {
      return renderPromptSurface(_0x278a74, _0x23d95c, _0x114804);
    },
    get 'videoPreview'() {
      const _0x20dbcb = getGenerationState(_0x278a74, _0x23d95c);
      return renderVideoPreview(_0x114804, {
        'isGenerating': _0x20dbcb["generatingClipIds"]["includes"](normalizeText(_0x114804?.['id']))
      });
    },
    get 'videoResults'() {
      return getVideoResults(_0x114804);
    },
    get 'activeVideoResultIndex'() {
      return getActiveVideoResultIndex(_0x114804);
    },
    get 'videoHistoryMenu'() {
      return renderVideoHistoryMenu(_0x114804);
    },
    'getAdjacentVideoResultIndex'(_0x1c1104) {
      return getAdjacentVideoResultIndex(_0x114804, _0x1c1104);
    },
    get 'timeline'() {
      const _0x23bda6 = getGenerationState(_0x278a74, _0x23d95c);
      return renderTimeline(_0x23d95c, _0x114804?.['id'], {
        'selectionMode': _0x278a74?.["clipSelectionMode"],
        'selectedClipIds': _0x278a74?.["selectedClipGenerationIds"],
        'pendingDeleteClipId': _0x278a74?.["pendingDeleteClipId"],
        'generatingClipIds': _0x23bda6['generatingClipIds'],
        'adjustingClipIds': (_0x23d95c?.["clips"] || [])['filter'](_0x33d6aa => isStoryClipAdjustmentGenerating(_0x278a74, _0x23d95c, _0x33d6aa))['map'](_0xba8b4d => _0xba8b4d['id']),
        'modelId': _0x278a74?.["models"]?.["video"],
        'generationParams': _0x278a74?.["videoGenerationParams"]
      });
    }
  };
}
function createRuntime({
  state: _0x1d31a5,
  projectAdapter = {},
  generationAdapter = {},
  projectionAdapter = {}
} = {}) {
  if (!_0x1d31a5 || typeof _0x1d31a5 !== "object") {
    throw new Error("[storyClipProduction] state is required");
  }
  if (typeof projectAdapter['createToken'] !== "function") {
    throw new Error("[storyClipProduction] projectAdapter.createToken is required");
  }
  if (typeof generationAdapter['createController'] !== "function") {
    throw new Error("[storyClipProduction] generationAdapter.createController is required");
  }
  const _0x388f3a = generationAdapter["controllers"] instanceof Map ? generationAdapter["controllers"] : new Map();
  const _0x2abb52 = new Map();
  const _0x4f4720 = _0x4c662e => projectAdapter["isLive"]?.(_0x4c662e) !== ![];
  const _0x5ed8ab = _0xcf2492 => projectAdapter["isCurrent"]?.(_0xcf2492) !== ![];
  const _0x5edcd9 = (_0x219c4e, _0x13ab9, _0x4d24f6) => [_0x219c4e?.["projectId"], _0x13ab9?.['id'], _0x4d24f6?.['id']]["map"](normalizeText)["join"](':');
  const _0x1aabc3 = (_0x56f8ae, _0x11f535) => [_0x56f8ae?.["projectId"], _0x11f535?.['id']]["map"](normalizeText)["join"](':');
  const _0x5e0a5b = () => {
    if (projectionAdapter["refreshGeneration"]?.() === !![]) {
      return !![];
    }
    projectionAdapter['render']?.();
    return ![];
  };
  function _0x5b0951({
    episode: _0x3318e9,
    clip: _0x52ed5b,
    projectToken: _0x55a971
  }) {
    return {
      'ok': ![],
      'cancelled': !![],
      'reason': "batch-cancelled",
      'projectToken': _0x55a971,
      'episodeId': _0x3318e9?.['id'] || '',
      'clipId': _0x52ed5b?.['id'] || ''
    };
  }
  function _0x451f92({
    episode: _0x5d4cb7,
    clip: _0x4c16a1,
    displayedClip: _0x3b8e9a,
    projectToken: _0x4c4b9f
  }) {
    const _0x4453dc = generationAdapter["resolvePrompt"]?.({
      'state': _0x1d31a5,
      'episode': _0x5d4cb7,
      'clip': _0x4c16a1,
      'displayedClip': _0x3b8e9a,
      'projectToken': _0x4c4b9f
    }) || {};
    const _0x551bcc = generationAdapter['resolveSettings']?.({
      'state': _0x1d31a5,
      'episode': _0x5d4cb7,
      'clip': _0x4c16a1,
      'projectToken': _0x4c4b9f
    }) || {};
    return {
      'projectId': _0x4c4b9f["projectId"],
      'episodeId': _0x5d4cb7['id'],
      'modelId': _0x551bcc["modelId"],
      'provider': _0x551bcc["provider"],
      'providerProfileId': _0x551bcc["providerProfileId"],
      'prompt': _0x4453dc["prompt"],
      'generationParams': _0x551bcc["generationParams"],
      'inputs': _0x4c16a1["inputs"],
      'assetInputRefs': _0x4453dc['assetInputRefs']
    };
  }
  function _0x22cadd() {
    const _0x36d251 = getSelectedEpisode(_0x1d31a5);
    const _0xc36c9e = getSelectedClip(_0x1d31a5, _0x36d251);
    const _0x43acb4 = _0x1d31a5["clipSelectionMode"] ? selectBatchTargets(_0x36d251?.["clips"], _0x1d31a5["selectedClipGenerationIds"]) : [_0xc36c9e];
    if (!_0x36d251 || !_0x43acb4[0x0]) {
      throw new Error('请先选择片段');
    }
    const _0x34f629 = _0x451f92({
      'episode': _0x36d251,
      'clip': _0x43acb4[0x0],
      'displayedClip': _0xc36c9e,
      'projectToken': projectAdapter["createToken"]()
    });
    return buildStoryClipVideoPayload(_0x34f629);
  }
  async function _0x315d4a({
    episode: _0x3d014e,
    clip: _0x5295eb,
    displayedClip: _0x4d347a,
    projectToken: _0x49edb8,
    batch = null,
    batchRun = null
  }) {
    if (batchRun?.["cancelRequested"]) {
      return _0x5b0951({
        'episode': _0x3d014e,
        'clip': _0x5295eb,
        'projectToken': _0x49edb8
      });
    }
    const _0x11467e = _0x5edcd9(_0x49edb8, _0x3d014e, _0x5295eb);
    if (!_0x3d014e || !_0x5295eb || getGenerationState(_0x1d31a5, _0x3d014e)["generatingClipIds"]["includes"](normalizeText(_0x5295eb['id'])) || getRecoverableStoryClipVideoTask(_0x5295eb) || _0x388f3a["has"](_0x11467e)) {
      return {
        'ok': ![],
        'reason': "unavailable"
      };
    }
    let _0x4868b7 = null;
    let _0x10d22b = '';
    let _0x30bbd7 = '';
    try {
      const _0x46edf3 = _0x451f92({
        'episode': _0x3d014e,
        'clip': _0x5295eb,
        'displayedClip': _0x4d347a,
        'projectToken': _0x49edb8
      });
      if (!normalizeText(_0x46edf3['prompt'])) {
        return {
          'ok': ![],
          'reason': 'empty-prompt'
        };
      }
      const _0x31f546 = _0x46edf3;
      _0x10d22b = normalizeText(_0x31f546["modelId"]);
      _0x30bbd7 = normalizeText(_0x31f546["provider"]);
      const _0x5c55fc = normalizeText(await generationAdapter["resolveInstallId"]?.({
        'state': _0x1d31a5,
        'episode': _0x3d014e,
        'clip': _0x5295eb,
        'projectToken': _0x49edb8,
        'modelId': _0x10d22b,
        'provider': _0x30bbd7
      }));
      if (batchRun?.["cancelRequested"]) {
        return _0x5b0951({
          'episode': _0x3d014e,
          'clip': _0x5295eb,
          'projectToken': _0x49edb8
        });
      }
      _0x4868b7 = generationAdapter["createController"]({
        'state': _0x1d31a5,
        'episode': _0x3d014e,
        'clip': _0x5295eb,
        'projectToken': _0x49edb8,
        'batch': batch
      });
      if (!_0x4868b7 || typeof _0x4868b7['generate'] !== "function") {
        throw new Error("story clip generation controller is unavailable");
      }
      _0x388f3a['set'](_0x11467e, _0x4868b7);
      batchRun?.["controllers"]["add"](_0x4868b7);
      if (batchRun?.["cancelRequested"]) {
        return _0x5b0951({
          'episode': _0x3d014e,
          'clip': _0x5295eb,
          'projectToken': _0x49edb8
        });
      }
      projectAdapter["register"]?.(_0x49edb8);
      _0x5ed8ab(_0x49edb8) && (setClipGenerationRunning(_0x1d31a5, _0x5295eb['id'], !![]), _0x5e0a5b());
      const _0x5166dd = await _0x4868b7['generate']({
        ..._0x46edf3,
        'installId': _0x5c55fc
      });
      if (!_0x4f4720(_0x49edb8)) {
        return {
          'ok': ![],
          'reason': "stale-project",
          'modelId': _0x10d22b,
          'provider': _0x30bbd7
        };
      }
      const _0x4543b2 = normalizeText(_0x5166dd?.["status"])["toLowerCase"]();
      if (batchRun?.["cancelRequested"] && (_0x5166dd?.['ok'] === ![] || ["cancelled", "canceled", "paused"]["includes"](_0x4543b2))) {
        return _0x5b0951({
          'episode': _0x3d014e,
          'clip': _0x5295eb,
          'projectToken': _0x49edb8
        });
      }
      if (_0x5166dd?.['ok'] === ![] || ['cancelled', "canceled", 'error', "failed"]["includes"](_0x4543b2)) {
        const _0xd7d4bf = _0x5166dd?.["error"];
        const _0x26c385 = _0xd7d4bf instanceof Error ? _0xd7d4bf : new Error(normalizeText(_0xd7d4bf?.['message'] || _0xd7d4bf) || "片段视频生成失败");
        return {
          'ok': ![],
          'type': "single-failed",
          'error': _0x26c385,
          'projectToken': _0x49edb8,
          'episodeId': _0x3d014e['id'],
          'clipId': _0x5295eb['id'],
          'modelId': _0x10d22b,
          'provider': _0x30bbd7
        };
      }
      await projectionAdapter['persist']?.({
        'immediate': !![]
      });
      return {
        'ok': !![],
        'type': 'single-complete',
        'result': _0x5166dd,
        'projectToken': _0x49edb8,
        'episodeId': _0x3d014e['id'],
        'clipId': _0x5295eb['id'],
        'modelId': _0x10d22b,
        'provider': _0x30bbd7
      };
    } catch (_0x3deb37) {
      if (!_0x4f4720(_0x49edb8)) {
        return {
          'ok': ![],
          'reason': "stale-project",
          'modelId': _0x10d22b,
          'provider': _0x30bbd7
        };
      }
      if (batchRun?.['cancelRequested']) {
        return _0x5b0951({
          'episode': _0x3d014e,
          'clip': _0x5295eb,
          'projectToken': _0x49edb8
        });
      }
      return {
        'ok': ![],
        'type': "single-failed",
        'error': _0x3deb37,
        'projectToken': _0x49edb8,
        'episodeId': _0x3d014e?.['id'] || '',
        'clipId': _0x5295eb?.['id'] || '',
        'modelId': _0x10d22b,
        'provider': _0x30bbd7
      };
    } finally {
      _0x4868b7 && _0x388f3a["get"](_0x11467e) === _0x4868b7 && _0x388f3a["delete"](_0x11467e);
      if (_0x4868b7) {
        batchRun?.["controllers"]["delete"](_0x4868b7);
      }
      _0x4868b7 && _0x5ed8ab(_0x49edb8) && (setClipGenerationRunning(_0x1d31a5, _0x5295eb?.['id'], ![]), _0x5e0a5b());
    }
  }
  async function _0x425529({
    episode: _0xb11c78,
    targets: _0x5752d6,
    projectToken: _0x225b95
  }) {
    const _0x5270d4 = new Set(_0x5752d6["map"](_0x298313 => normalizeText(_0x298313?.['id']))["filter"](Boolean));
    const _0x464dd2 = projectAdapter["createBatch"]?.('clip-videos', {
      'episodeId': _0xb11c78['id'],
      'total': _0x5752d6["length"],
      'completed': 0x0,
      'targetClipIds': [..._0x5270d4],
      'pendingClipIds': [..._0x5270d4],
      'label': '批量生成\x200/' + _0x5752d6["length"]
    }) || {
      'id': 'clip-videos:' + normalizeText(_0x225b95?.["projectId"]) + ':' + Date["now"](),
      'type': "clip-videos",
      'episodeId': _0xb11c78['id'],
      'total': _0x5752d6['length'],
      'completed': 0x0
    };
    const _0x583bd2 = {
      'batch': _0x464dd2,
      'projectToken': _0x225b95,
      'episodeId': normalizeText(_0xb11c78['id']),
      'controllers': new Set(),
      'cancelRequested': ![]
    };
    const _0x38c325 = _0x1aabc3(_0x225b95, _0xb11c78);
    _0x2abb52["set"](_0x38c325, _0x583bd2);
    setEpisodeBatchRunning(_0x1d31a5, _0xb11c78['id'], !![], "批量生成 0/" + _0x5752d6["length"], {
      'batchId': _0x464dd2['id'],
      'cancelRequested': ![]
    });
    let _0x5bf158 = 0x0;
    let _0x2fd937 = 0x0;
    let _0x390d70 = 0x0;
    let _0x7e953d = null;
    let _0x3e321a = ![];
    _0x5e0a5b();
    try {
      await runBatch(_0x5752d6, _0x2507e7 => _0x315d4a({
        'episode': _0xb11c78,
        'clip': _0x2507e7,
        'displayedClip': null,
        'projectToken': _0x225b95,
        'batch': _0x464dd2,
        'batchRun': _0x583bd2
      }), {
        'shouldStop': () => _0x583bd2["cancelRequested"],
        'onProgress': ({
          completed: _0x12c29e,
          total: _0x57d8ce,
          target: _0x548e21,
          result: _0x50a5c8
        }) => {
          if (!_0x4f4720(_0x225b95)) {
            return;
          }
          _0x5270d4["delete"](normalizeText(_0x548e21?.['id']));
          const _0x1bd646 = _0x583bd2["cancelRequested"] ? "正在停止批量生成 · 已结束 " + _0x12c29e + '/' + _0x57d8ce : "批量生成 " + _0x12c29e + '/' + _0x57d8ce;
          projectAdapter['syncBatch']?.(_0x225b95, _0x464dd2, {
            'completed': _0x12c29e,
            'pendingClipIds': [..._0x5270d4],
            'cancelRequested': _0x583bd2["cancelRequested"],
            'label': _0x1bd646
          });
          if (_0x50a5c8?.['ok']) {
            _0x5bf158 += 0x1;
          } else {
            _0x50a5c8?.['cancelled'] || _0x50a5c8?.['reason'] === "batch-cancelled" ? _0x390d70 += 0x1 : (_0x2fd937 += 0x1, _0x7e953d ||= _0x50a5c8, !_0x3e321a && _0x50a5c8?.['error'] && (_0x3e321a = projectionAdapter["present"]?.({
              'type': "provider-error",
              'error': _0x50a5c8['error'],
              'modelId': _0x50a5c8["modelId"],
              'provider': _0x50a5c8["provider"]
            }) === !![]));
          }
          _0x5ed8ab(_0x225b95) && (setEpisodeBatchRunning(_0x1d31a5, _0xb11c78['id'], !![], _0x1bd646, {
            'batchId': _0x464dd2['id'],
            'cancelRequested': _0x583bd2["cancelRequested"]
          }), _0x5e0a5b());
        }
      });
    } finally {
      _0x2abb52['get'](_0x38c325) === _0x583bd2 && _0x2abb52["delete"](_0x38c325);
      _0x5ed8ab(_0x225b95) && (setEpisodeBatchRunning(_0x1d31a5, _0xb11c78['id'], ![]), await projectionAdapter['persist']?.({
        'immediate': !![]
      }), _0x5e0a5b());
    }
    if (!_0x4f4720(_0x225b95)) {
      return ![];
    }
    projectionAdapter["present"]?.({
      'type': "batch-complete",
      'projectToken': _0x225b95,
      'episodeId': _0xb11c78['id'],
      'clipId': _0x5752d6[0x0]?.['id'] || '',
      'succeeded': _0x5bf158,
      'failed': _0x2fd937,
      'cancelled': _0x390d70,
      'cancelRequested': _0x583bd2["cancelRequested"],
      'firstFailure': _0x7e953d,
      'suppressToast': _0x3e321a
    });
    return _0x5bf158 > 0x0;
  }
  async function _0x59f830() {
    const _0x2c96a6 = getSelectedEpisode(_0x1d31a5);
    const _0x38355d = normalizeText(_0x2c96a6?.['id']);
    const _0x25d434 = projectAdapter["createToken"]();
    const _0x22720d = _0x1aabc3(_0x25d434, _0x2c96a6);
    let _0x2c13ae = _0x2abb52["get"](_0x22720d);
    if (!_0x2c13ae) {
      const _0x38bc34 = _0x1d31a5["clipBatchGenerationByEpisode"]?.[_0x38355d];
      const _0x3bc853 = _0x22720d + ':';
      const _0x3ee0ac = new Set([..._0x388f3a["entries"]()]['filter'](([_0x1d0e5e]) => normalizeText(_0x1d0e5e)["startsWith"](_0x3bc853))["map"](([, _0x4e4358]) => _0x4e4358));
      if (!_0x38bc34?.["batchId"] || !_0x3ee0ac["size"]) {
        return ![];
      }
      _0x2c13ae = {
        'batch': {
          'id': _0x38bc34["batchId"],
          'type': "clip-videos",
          'episodeId': _0x38355d
        },
        'projectToken': _0x25d434,
        'episodeId': _0x38355d,
        'controllers': _0x3ee0ac,
        'cancelRequested': _0x38bc34["cancelRequested"] === !![]
      };
    }
    if (!_0x2c13ae || _0x2c13ae['cancelRequested']) {
      return ![];
    }
    _0x2c13ae['cancelRequested'] = !![];
    const _0x20482c = '正在停止批量生成';
    projectAdapter["syncBatch"]?.(_0x2c13ae['projectToken'], _0x2c13ae["batch"], {
      'type': "clip-videos-stopped",
      'cancelRequested': !![],
      'pendingClipIds': [],
      'label': _0x20482c
    });
    _0x5ed8ab(_0x2c13ae["projectToken"]) && (setEpisodeBatchRunning(_0x1d31a5, _0x38355d, !![], _0x20482c, {
      'batchId': _0x2c13ae["batch"]['id'],
      'cancelRequested': !![]
    }), _0x5e0a5b());
    await Promise["allSettled"]([..._0x2c13ae["controllers"]]["map"](_0x1d0002 => {
      if (typeof _0x1d0002?.['cancel'] === "function") {
        return _0x1d0002["cancel"]();
      }
      return _0x1d0002?.["pause"]?.();
    }));
    return !![];
  }
  async function _0x5d66ac() {
    const _0x15bad3 = getSelectedEpisode(_0x1d31a5);
    const _0x37376b = getGenerationState(_0x1d31a5, _0x15bad3);
    if (_0x37376b["isBatchGenerating"]) {
      return ![];
    }
    const _0x4c7d45 = getSelectedClip(_0x1d31a5, _0x15bad3);
    const _0x36b8c8 = _0x1d31a5["clipSelectionMode"] ? selectBatchTargets(_0x15bad3?.["clips"], _0x1d31a5['selectedClipGenerationIds']) : [];
    if (_0x1d31a5["clipSelectionMode"] && _0x36b8c8['length'] > 0x1) {
      if (_0x37376b["busy"]) {
        return ![];
      }
      return _0x425529({
        'episode': _0x15bad3,
        'targets': _0x36b8c8,
        'projectToken': projectAdapter["createToken"]()
      });
    }
    const _0x28f986 = _0x1d31a5["clipSelectionMode"] ? _0x36b8c8[0x0] : _0x4c7d45;
    if (!_0x28f986) {
      projectionAdapter["present"]?.({
        'type': "selection-missing"
      });
      return ![];
    }
    const _0x247501 = projectAdapter["createToken"]();
    const _0x1d82b8 = await _0x315d4a({
      'episode': _0x15bad3,
      'clip': _0x28f986,
      'displayedClip': _0x4c7d45,
      'projectToken': _0x247501
    });
    if (_0x1d82b8["reason"] === "empty-prompt") {
      projectionAdapter["present"]?.({
        ..._0x1d82b8,
        'type': "empty-prompt"
      });
      return ![];
    }
    if (_0x1d82b8["type"]) {
      projectionAdapter["present"]?.(_0x1d82b8);
    }
    return _0x1d82b8['ok'] === !![];
  }
  return Object["freeze"]({
    'generateSelection': _0x5d66ac,
    'previewSelection': _0x22cadd,
    'cancelBatch': _0x59f830
  });
}
export const storyClipProduction = Object["freeze"]({
  'createRuntime': createRuntime,
  'getAdjacentClipId': getAdjacentClipId,
  'getInputReferenceCounts': getInputReferenceCounts,
  'removeVideoResult': removeVideoResult,
  'renderTimelineVideoThumbnail': renderTimelineVideoThumbnail,
  'selectBatchTargets': selectBatchTargets,
  'runBatch': runBatch,
  'getGenerationState': getGenerationState,
  'setClipGenerationRunning': setClipGenerationRunning,
  'setEpisodeBatchRunning': setEpisodeBatchRunning,
  'shouldCloseAdjustmentOnOutsideClick': shouldCloseAdjustmentOnOutsideClick,
  'shouldClosePromptHistoryOnOutsideClick': shouldClosePromptHistoryOnOutsideClick,
  'renderEpisode': renderEpisode
});