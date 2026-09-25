import a467_0x4acc09 from '../../core/stores/appStore.js';
import { findAvailablePosition } from '../../core/math.js';
import { submitTask } from '../../core/generationTaskRuntime.js';
import { createRunningHubTaskStateMachine } from '../../modules/ImageFreeAngleController.js';
import a467_0x5ee396, { runSmartClipKeyframeExtractionFromVideoNode } from '../../modules/VideoClipController.js';
import { runVideoAudioSeparationFromNode } from '../../modules/VideoAudioSeparationController.js';
import { runVideoReverseFromNode } from '../../modules/VideoReverseController.js';
import a467_0x35146e from '../../modules/VideoKeyingController.js';
import a467_0x3c187b from '../../modules/VideoGifController.js';
import { fetchRemoteBlob, saveOutputToServer, saveOutputFromUrlToServer } from '../../../api/projectsV2Api.js';
import { fetchAppRuntimeInfoFromServer } from '../../../api/runtimeApi.js';
import { fetchVideoMetaFromServer } from '../../../api/videoMetaApi.js';
import { generateVideo } from '../../../api/aiVideoApi.js';
import { runRunninghubAiApp, runRunninghubWorkflow, resumeRunninghubWorkflowTask } from '../../../api/runninghubWorkflowApi.js';
import { processInputVideos } from '../../../api/videoUploadApi.js';
import { detectScenes } from '../../../api/sceneDetectionApi.js';
import { buildApiUrl } from '../../../api/apiBase.js';
import { getProviderConfig, ensureConfig } from '../../../api/configApi.js';
import { calcSafeSpawnPosNearNode, getNodeSpawnPrefs } from '../../modules/nodeSpawn.js';
import { buildSourceMediaNodePayload, getAIGenerationNodeSize, getAutoMediaSizeByShortSide } from '../../services/fileService.js';
import { buildCanvasLocalVideoFields, resolveCanvasVideoLocalPath, resolveCanvasVideoUrl } from '../../services/canvasMediaLocalService.js';
import { attachMediaElementPlaybackSource } from '../../services/desktopMediaBlobSource.js';
import { getVideoCurrentSource } from '../video-node/mediaPlaybackRecovery.js';
import { desktopBridge } from '../../services/desktopBridge.js';
import { saveMediaDownload } from '../../services/downloadSaveService.js';
import { pickResultLocalPath, urlToLocalPath } from '../../utils/localMediaPath.js';
import { buildVideoGenerationFailurePatch, buildVideoGenerationResultPatch } from '../video-node/videoGenerationResultRenderer.js';
import { executeCommand } from '../../core/interaction.js';
import { VIDEO_TOOLBAR_HTML } from './videoToolbarHtml.js';
import { RUNNING_HUB_CANCEL_ICON_HTML, bindRunningHubToolbarTaskButton, cancelRunningHubResultTask, cancelRunningHubRemoteTaskQuietly, findRunningHubToolbarTaskForNode, isRunningHubToolbarTaskCancelled, notifyRunningHubToolbarTasksChanged } from './runningHubToolbarTaskButton.js';
import { RH_VIDEO_HD_VIP_MODEL_ID, resolveModelExecution } from '../../manifests/index.js';
import { bindVideoClipAction } from './videoActions/clipAction.js';
import { bindVideoSegmentRetakeAction } from './videoActions/segmentRetakeAction.js';
import { bindVideoExtractKeyframesAction } from './videoActions/extractKeyframesAction.js';
import { bindVideoSeparateAvAction } from './videoActions/separateAvAction.js';
import { bindVideoVoiceReplaceAction } from './videoActions/voiceReplaceAction.js';
import { bindVideoReverseAction } from './videoActions/reverseAction.js';
import { bindVideoSmartClipAction } from './videoActions/smartClipAction.js';
import { bindVideoKeyingAction } from './videoActions/keyingAction.js';
import { bindVideoRemoveAction } from './videoActions/removeAction.js';
import { bindVideoFrameInterpolationAction } from './videoActions/frameInterpolationAction.js';
import { bindVideoDepthAction } from './videoActions/depthVideoAction.js';
import { bindVideoHdAction } from './videoActions/hdAction.js';
import { bindVideoDownloadAction } from './videoActions/downloadAction.js';
import { bindVideoFullscreenAction } from './videoActions/fullscreenAction.js';
import { bindVideoResetSizeAction } from './videoActions/resetSizeAction.js';
import { bindVideoToGifAction } from './videoActions/toGifAction.js';
import { bindStoryboardScriptToolbarAction } from './storyboardScriptAction.js';
import { bindImageToolbarLayoutUi } from './imageToolbarLayoutUi.js';
import { bindApimartPrivateAvatarAction } from './apimartPrivateAvatarAction.js';
import { VIDEO_TOOLBAR_ACTIONS, normalizeVideoToolbarLayout, serializeVideoToolbarLayout } from '../../modules/videoToolbarLayoutMemory.js';
import { bindPreviewUploadToolbarAction } from '../../modules/previewUploadEntry.js';
import { t } from '../../i18n/index.js';
export { VIDEO_TOOLBAR_HTML };
function isClientFetchableVideoUrl(_0x56b8ad) {
  const _0x55d393 = String(_0x56b8ad || '')['trim']();
  return /^https?:\/\//i["test"](_0x55d393) || _0x55d393["startsWith"]('blob:') || _0x55d393["startsWith"]("data:") || _0x55d393['startsWith']('/') && !_0x55d393["startsWith"]('//');
}
const RH_VIDEO_HD_BASIC_WORKFLOW_ID = '2019292222763573249';
const RH_VIDEO_HD_VIP_EXECUTION = resolveModelExecution(RH_VIDEO_HD_VIP_MODEL_ID);
const RH_VIDEO_HD_VIP_APP_ID = RH_VIDEO_HD_VIP_EXECUTION?.["executionManifest"]?.['appId'] || "2047787809091620866";
const VIDEO_HD_STANDARD_INSTANCE_TYPE = "default";
const VIDEO_HD_VIP_INSTANCE_TYPE = "plus";
const VIDEO_HD_STANDARD_MAX_SECONDS = 0xf;
const KEYING_CANCEL_ICON_HTML = RUNNING_HUB_CANCEL_ICON_HTML;
function videoToolbarText(_0x502aa3, _0x59e6f = {}) {
  return t('nodeToolbar.video.' + _0x502aa3, _0x59e6f);
}
const getStateSnapshot = () => typeof a467_0x4acc09["getStateRaw"] === "function" ? a467_0x4acc09["getStateRaw"]() : a467_0x4acc09['getState']();
function getToolbarActionFromButton(_0x578e34) {
  if (!_0x578e34?.["classList"]) {
    return '';
  }
  for (const _0x2d6078 of _0x578e34['classList']) {
    if (!_0x2d6078["startsWith"]("act-")) {
      continue;
    }
    const _0x4165c9 = _0x2d6078["slice"](0x4);
    if (VIDEO_TOOLBAR_ACTIONS["includes"](_0x4165c9)) {
      return _0x4165c9;
    }
  }
  return '';
}
export function bindVideoToolbarEvents(_0x2f6450, _0x6928a2) {
  if (!_0x2f6450) {
    return () => {};
  }
  const _0x2edb2c = [];
  const _0x1af10b = _0x158e43 => {
    if (typeof _0x158e43 === "function") {
      _0x2edb2c["push"](_0x158e43);
    }
    return _0x158e43;
  };
  const _0x24c373 = 0x78;
  const _0xf8b684 = 0x320;
  const _0x17d1f8 = 0x2;
  _0x2f6450['addEventListener']("pointerdown", _0x33e2dd => _0x33e2dd["stopPropagation"]());
  _0x2f6450["addEventListener"]('dblclick', _0x321c50 => {
    _0x321c50['preventDefault']();
    _0x321c50["stopPropagation"]();
  });
  const _0x998d68 = bindImageToolbarLayoutUi(_0x2f6450, {
    'store': a467_0x4acc09,
    'getStateSnapshot': getStateSnapshot,
    'toolbarActions': VIDEO_TOOLBAR_ACTIONS,
    'normalizeToolbarLayout': normalizeVideoToolbarLayout,
    'serializeToolbarLayout': serializeVideoToolbarLayout,
    'getToolbarActionFromButton': getToolbarActionFromButton,
    'getToolbarLayout': _0x29e2d3 => _0x29e2d3?.['ui']?.["videoToolbarLayout"],
    'setToolbarLayout': _0x16281e => a467_0x4acc09["setVideoToolbarLayout"]?.(_0x16281e),
    'moreMenuStickyActions': ["to-gif", 'hd', 'depth-video']
  });
  _0x1af10b(() => _0x998d68?.["closeMoreMenu"]?.());
  const _0x48c4bf = () => {
    const _0x38e45c = _0x6928a2?.['id'];
    if (!_0x38e45c) {
      return _0x6928a2 || {};
    }
    return getStateSnapshot()["nodes"]?.[_0x38e45c] || _0x6928a2 || {};
  };
  const _0x4e43e4 = _0x2da186 => {
    const _0x44766a = String(_0x2da186 || '')["trim"]();
    if (!_0x44766a) {
      return '';
    }
    if (_0x44766a["startsWith"]("http://") || _0x44766a['startsWith']('https://') || _0x44766a["startsWith"]('blob:') || _0x44766a["startsWith"]('data:')) {
      return _0x44766a;
    }
    if (_0x44766a['startsWith']('/')) {
      return buildApiUrl(_0x44766a);
    }
    return buildApiUrl('/' + _0x44766a['replace'](/^\/+/, ''));
  };
  const _0x5ba9bf = (_0xa13a39, _0x5f3f8f) => {
    const _0x11eca7 = document["createElement"]('a');
    _0x11eca7['href'] = _0xa13a39;
    _0x11eca7["download"] = _0x5f3f8f;
    _0x11eca7["rel"] = "noopener";
    document["body"]["appendChild"](_0x11eca7);
    _0x11eca7["click"]();
    _0x11eca7["remove"]();
  };
  const _0x1a008d = _0x2aefff => {
    const _0x43745d = String(_0x2aefff || '')["trim"]();
    if (!_0x43745d) {
      return ![];
    }
    if (_0x43745d['startsWith']('/')) {
      return !![];
    }
    try {
      const _0x1bddde = new URL(_0x43745d, window["location"]['href']);
      return _0x1bddde["origin"] === window["location"]["origin"];
    } catch {
      return ![];
    }
  };
  const _0x365d38 = () => {
    const _0x13f3fc = _0x48c4bf();
    const _0x316e30 = Array["isArray"](_0x13f3fc['videos']) ? _0x13f3fc["videos"] : [];
    const _0x4babe3 = _0x13f3fc['mainVideoIndex'] || 0x0;
    const _0x2e9ee0 = _0x316e30[_0x4babe3] || _0x316e30[0x0] || {};
    return _0x4e43e4(resolveCanvasVideoUrl(_0x2e9ee0) || resolveCanvasVideoUrl(_0x13f3fc));
  };
  const _0xa390e4 = () => {
    const _0x2cad36 = _0x2f6450['closest']?.('.v2-node') || _0x2f6450["parentElement"] || null;
    const _0x2bd241 = Array["from"](_0x2cad36?.['querySelectorAll']?.("video") || []);
    if (_0x2bd241['length'] === 0x0) {
      return '';
    }
    const _0x3e741f = _0x365d38();
    const _0x7eeea6 = _0x1afb3b => {
      const _0x1458c4 = String(_0x1afb3b || '')['trim']();
      if (!_0x1458c4) {
        return '';
      }
      try {
        return new URL(_0x1458c4, globalThis['location']?.["href"] || globalThis["window"]?.["location"]?.["href"] || 'http://localhost/')['href'];
      } catch {
        return _0x1458c4;
      }
    };
    const _0x3ce196 = _0x7eeea6(_0x3e741f);
    const _0x55ae88 = _0x2bd241["find"](_0x959d0b => {
      const _0x1ae5c4 = _0x959d0b['dataset']?.["desktopMediaSourceUrl"] || getVideoCurrentSource(_0x959d0b);
      return _0x3ce196 && _0x7eeea6(_0x1ae5c4) === _0x3ce196;
    });
    const _0x222df2 = _0x55ae88 || _0x2bd241['find'](_0x442a7b => _0x442a7b["classList"]?.['contains']?.("video-player")) || _0x2bd241['find'](_0x13b6c2 => _0x13b6c2['paused'] === ![]) || _0x2bd241[0x0];
    return getVideoCurrentSource(_0x222df2);
  };
  const _0x2ae02f = () => {
    const _0x1416f7 = _0x48c4bf();
    const _0x2f6364 = Array["isArray"](_0x1416f7["videos"]) ? _0x1416f7["videos"] : [];
    const _0x1a3cdb = _0x1416f7['mainVideoIndex'] || 0x0;
    const _0x5684d5 = _0x2f6364[_0x1a3cdb] || _0x2f6364[0x0] || {};
    return resolveCanvasVideoLocalPath(_0x5684d5) || resolveCanvasVideoLocalPath(_0x1416f7);
  };
  const _0x1a7d3b = () => {
    const _0x137f06 = _0x48c4bf();
    const _0x5a03bd = Array["isArray"](_0x137f06["videos"]) ? _0x137f06["videos"] : [];
    const _0x52095f = _0x137f06["mainVideoIndex"] || 0x0;
    const _0x4a3e22 = _0x5a03bd[_0x52095f] || _0x5a03bd[0x0] || {};
    return {
      'node': _0x137f06,
      'item': _0x4a3e22
    };
  };
  const _0x3b8e51 = () => {
    const {
      node: _0x3366b8,
      item: _0x4c8801
    } = _0x1a7d3b();
    const _0x2344f0 = [_0x4c8801?.["videoDuration"], _0x4c8801?.["duration"], _0x3366b8?.["videoDuration"]];
    for (const _0x2f5dc1 of _0x2344f0) {
      const _0x142e19 = Number(_0x2f5dc1);
      if (Number['isFinite'](_0x142e19) && _0x142e19 > 0x0) {
        return _0x142e19;
      }
    }
    return 0x0;
  };
  const _0x1c7278 = () => {
    const {
      node: _0x1a695c,
      item: _0x4d36ad
    } = _0x1a7d3b();
    return resolveCanvasVideoLocalPath(_0x4d36ad) || resolveCanvasVideoLocalPath(_0x1a695c);
  };
  const _0x367d79 = async () => {
    try {
      const _0x5777ac = await fetchAppRuntimeInfoFromServer();
      window['ADVANCED_MODE'] = Boolean(_0x5777ac?.["isAdvancedMode"]);
    } catch {}
    return window["ADVANCED_MODE"] === !![];
  };
  const _0x40f476 = _0x220bd7 => new Promise(_0x5589bc => {
    const _0x116e59 = String(_0x220bd7 || '')['trim']();
    if (!_0x116e59) {
      _0x5589bc(0x0);
      return;
    }
    const _0x3d47f3 = document["createElement"]("video");
    let _0x25aa2d = ![];
    const _0x3c4827 = () => {
      _0x3d47f3["removeAttribute"]('src');
      try {
        _0x3d47f3["load"]();
      } catch {}
    };
    const _0x446cbd = _0x240162 => {
      if (_0x25aa2d) {
        return;
      }
      _0x25aa2d = !![];
      window["clearTimeout"](_0x15a9f5);
      _0x3c4827();
      _0x5589bc(_0x240162);
    };
    const _0x15a9f5 = window["setTimeout"](() => _0x446cbd(0x0), 0x2ee0);
    _0x3d47f3["preload"] = 'metadata';
    _0x3d47f3["muted"] = !![];
    _0x3d47f3["playsInline"] = !![];
    _0x3d47f3["onloadedmetadata"] = () => {
      const _0x3143fb = Number(_0x3d47f3["duration"]);
      _0x446cbd(Number["isFinite"](_0x3143fb) && _0x3143fb > 0x0 ? _0x3143fb : 0x0);
    };
    _0x3d47f3["onerror"] = () => _0x446cbd(0x0);
    void attachMediaElementPlaybackSource(_0x3d47f3, _0x116e59, {
      'preload': "metadata"
    })['catch'](() => {
      !String(_0x3d47f3['getAttribute']?.("src") || _0x3d47f3["src"] || '')["trim"]() && (_0x3d47f3["src"] = _0x116e59, _0x3d47f3["load"]?.());
    });
  });
  const _0x259498 = async _0x4c9742 => {
    const _0x345e95 = _0x3b8e51();
    if (_0x345e95 > 0x0) {
      return _0x345e95;
    }
    const _0x1d6723 = _0x1c7278();
    if (_0x1d6723) {
      try {
        const _0x3dbca0 = await fetchVideoMetaFromServer(_0x1d6723);
        const _0xca7db6 = Number(_0x3dbca0?.["duration"]);
        if (Number["isFinite"](_0xca7db6) && _0xca7db6 > 0x0) {
          return _0xca7db6;
        }
      } catch {}
    }
    return _0x40f476(_0x4c9742);
  };
  const _0x4e01ce = async _0xe7d939 => {
    if (await _0x367d79()) {
      return !![];
    }
    const _0x47a7fa = await _0x259498(_0xe7d939);
    if (Number["isFinite"](_0x47a7fa) && _0x47a7fa > VIDEO_HD_STANDARD_MAX_SECONDS + 0.05) {
      window['showToast']?.(videoToolbarText("durationLimit", {
        'seconds': VIDEO_HD_STANDARD_MAX_SECONDS
      }), "warn", 0x1450);
      return ![];
    }
    return !![];
  };
  const _0x494f7c = async (_0x47f1a5, _0x424485 = null) => {
    if (typeof window['refreshSubscriptionState'] === "function") {
      try {
        await window['refreshSubscriptionState']();
      } catch {}
    }
    const _0x24e98c = typeof window["isModelAllowedBySubscription"] === "function" ? window['isModelAllowedBySubscription'](_0x47f1a5, 'runninghubwf') : !![];
    if (_0x24e98c) {
      return !![];
    }
    if (typeof window["openSubscriptionDialog"] === "function") {
      window["openSubscriptionDialog"]({
        'modelId': _0x47f1a5,
        'provider': "runninghubwf",
        'onSuccess': _0x424485
      });
    } else {
      typeof window["handleSubscriptionRequired"] === "function" ? await window['handleSubscriptionRequired']({
        'modelId': _0x47f1a5,
        'provider': 'runninghubwf'
      }) : window["showToast"]?.(videoToolbarText("hdVipRequired"), "warn");
    }
    return ![];
  };
  const _0x592115 = _0x4591d7 => {
    const _0x56effd = new Set();
    const _0x559f6c = ["url", 'videoUrl', 'video_url', 'fileUrl', "file_url", "download_url", 'output', 'result', "data", 'results', "outputs"];
    const _0x2040e9 = _0x56d0db => {
      const _0x229cbe = String(_0x56d0db || '')["trim"]();
      if (!_0x229cbe) {
        return '';
      }
      if (_0x229cbe["startsWith"]("http://") || _0x229cbe["startsWith"]("https://")) {
        return _0x229cbe;
      }
      if (_0x229cbe["startsWith"]('/')) {
        return _0x229cbe;
      }
      const _0x5b7ea4 = _0x229cbe["match"](/https?:\/\/[^\s"'<>]+/);
      if (_0x5b7ea4?.[0x0]) {
        return _0x5b7ea4[0x0];
      }
      if (_0x229cbe["startsWith"]('{') || _0x229cbe['startsWith']('[')) {
        try {
          return _0x23ecee(JSON["parse"](_0x229cbe));
        } catch {}
      }
      return '';
    };
    const _0x23ecee = _0x5b5b1c => {
      if (!_0x5b5b1c) {
        return '';
      }
      if (typeof _0x5b5b1c === "string") {
        return _0x2040e9(_0x5b5b1c);
      }
      if (typeof _0x5b5b1c !== "object") {
        return '';
      }
      if (_0x56effd["has"](_0x5b5b1c)) {
        return '';
      }
      _0x56effd['add'](_0x5b5b1c);
      if (Array["isArray"](_0x5b5b1c)) {
        for (const _0x3ac0bb of _0x5b5b1c) {
          const _0x38814a = _0x23ecee(_0x3ac0bb);
          if (_0x38814a) {
            return _0x38814a;
          }
        }
        return '';
      }
      for (const _0x30395c of _0x559f6c) {
        if (_0x30395c in _0x5b5b1c) {
          const _0x3a2746 = _0x23ecee(_0x5b5b1c[_0x30395c]);
          if (_0x3a2746) {
            return _0x3a2746;
          }
        }
      }
      for (const _0x47d0c6 of Object["keys"](_0x5b5b1c)) {
        const _0x5a85cb = _0x23ecee(_0x5b5b1c[_0x47d0c6]);
        if (_0x5a85cb) {
          return _0x5a85cb;
        }
      }
      return '';
    };
    return _0x23ecee(_0x4591d7);
  };
  const _0x534100 = _0xdbe2a7 => {
    return urlToLocalPath(_0xdbe2a7);
  };
  const _0x3ebe02 = async _0x401b2b => {
    const _0x559217 = String(_0x401b2b || '')["trim"]();
    if (!isClientFetchableVideoUrl(_0x559217)) {
      throw new Error(videoToolbarText('saveInvalidUrl'));
    }
    const _0x400c36 = new AbortController();
    const _0x403f41 = setTimeout(() => _0x400c36['abort'](), 0x1d4c0);
    let _0x424c42 = null;
    try {
      _0x424c42 = await fetchRemoteBlob(_0x559217, {
        'signal': _0x400c36["signal"]
      });
    } finally {
      clearTimeout(_0x403f41);
    }
    if (!_0x424c42) {
      throw new Error(videoToolbarText("saveEmptyDownload"));
    }
    const _0x2356a4 = await saveOutputToServer(_0x424c42, {
      'ext': "mp4"
    });
    const _0x5e6cef = pickResultLocalPath(_0x2356a4);
    if (!_0x2356a4?.["success"] || !_0x5e6cef) {
      throw new Error(videoToolbarText("saveMalformed"));
    }
    return _0x5e6cef;
  };
  const _0xd1097c = async _0x2c01af => {
    let _0x5b06c0 = _0x534100(_0x2c01af);
    if (!_0x5b06c0 && isClientFetchableVideoUrl(_0x2c01af)) {
      try {
        window['showToast']?.(videoToolbarText("savingLocal"), "info");
        _0x5b06c0 = await _0x3ebe02(_0x2c01af);
      } catch (_0x5eb5c8) {
        const _0x17288b = _0x5eb5c8 instanceof Error ? _0x5eb5c8["message"] : String(_0x5eb5c8 || '');
        const _0x5a6f7d = _0x17288b["includes"]('Failed\x20to\x20fetch') || _0x17288b["includes"]("NetworkError") || _0x17288b["toLowerCase"]()["includes"]("cors");
        if (!_0x5a6f7d || !/^https?:\/\//i['test'](_0x2c01af)) {
          throw _0x5eb5c8;
        }
        const _0x16de97 = await saveOutputFromUrlToServer({
          'url': _0x2c01af,
          'ext': 'mp4'
        });
        const _0x59ea72 = pickResultLocalPath(_0x16de97);
        if (_0x59ea72) {
          _0x5b06c0 = _0x59ea72;
        } else {
          throw new Error(_0x16de97?.['error'] || videoToolbarText("localSaveFailed"));
        }
      }
    }
    return _0x5b06c0 || '';
  };
  const _0x101141 = {
    'toolbarEl': _0x2f6450,
    'nodeData': _0x6928a2,
    'mediaKind': 'video',
    'getStateSnapshot': getStateSnapshot,
    'store': a467_0x4acc09,
    'findAvailablePosition': findAvailablePosition,
    'submitTask': submitTask,
    'createRunningHubTaskStateMachine': createRunningHubTaskStateMachine,
    'VideoClipController': a467_0x5ee396,
    'runSmartClipKeyframeExtractionFromVideoNode': runSmartClipKeyframeExtractionFromVideoNode,
    'runVideoAudioSeparationFromNode': runVideoAudioSeparationFromNode,
    'runVideoReverseFromNode': runVideoReverseFromNode,
    'VideoKeyingController': a467_0x35146e,
    'VideoGifController': a467_0x3c187b,
    'fetchRemoteBlob': fetchRemoteBlob,
    'generateVideo': generateVideo,
    'runRunninghubAiApp': runRunninghubAiApp,
    'runRunninghubWorkflow': runRunninghubWorkflow,
    'resumeRunninghubWorkflowTask': resumeRunninghubWorkflowTask,
    'processInputVideos': processInputVideos,
    'detectScenes': detectScenes,
    'getProviderConfig': getProviderConfig,
    'ensureConfig': ensureConfig,
    'calcSafeSpawnPosNearNode': calcSafeSpawnPosNearNode,
    'getNodeSpawnPrefs': getNodeSpawnPrefs,
    'buildSourceMediaNodePayload': buildSourceMediaNodePayload,
    'getAutoMediaSizeByShortSide': getAutoMediaSizeByShortSide,
    'getAIGenerationNodeSize': getAIGenerationNodeSize,
    'buildCanvasLocalVideoFields': buildCanvasLocalVideoFields,
    'buildVideoGenerationFailurePatch': buildVideoGenerationFailurePatch,
    'buildVideoGenerationResultPatch': buildVideoGenerationResultPatch,
    'executeCommand': executeCommand,
    'VIDEO_TOOLBAR_FOCUS_PADDING': _0x24c373,
    'VIDEO_TOOLBAR_FOCUS_DURATION_MS': _0xf8b684,
    'VIDEO_TOOLBAR_FOCUS_MAX_ZOOM': _0x17d1f8,
    'KEYING_CANCEL_ICON_HTML': KEYING_CANCEL_ICON_HTML,
    'bindRunningHubToolbarTaskButton': _0x56d150 => _0x1af10b(bindRunningHubToolbarTaskButton(_0x56d150)),
    'cancelRunningHubResultTask': cancelRunningHubResultTask,
    'cancelRunningHubRemoteTaskQuietly': cancelRunningHubRemoteTaskQuietly,
    'findRunningHubToolbarTaskForNode': findRunningHubToolbarTaskForNode,
    'isRunningHubToolbarTaskCancelled': isRunningHubToolbarTaskCancelled,
    'notifyRunningHubToolbarTasksChanged': notifyRunningHubToolbarTasksChanged,
    'RH_VIDEO_HD_BASIC_WORKFLOW_ID': RH_VIDEO_HD_BASIC_WORKFLOW_ID,
    'RH_VIDEO_HD_VIP_MODEL_ID': RH_VIDEO_HD_VIP_MODEL_ID,
    'RH_VIDEO_HD_VIP_APP_ID': RH_VIDEO_HD_VIP_APP_ID,
    'VIDEO_HD_STANDARD_INSTANCE_TYPE': VIDEO_HD_STANDARD_INSTANCE_TYPE,
    'VIDEO_HD_VIP_INSTANCE_TYPE': VIDEO_HD_VIP_INSTANCE_TYPE,
    '_getLatestNodeData': _0x48c4bf,
    '_triggerHrefDownload': _0x5ba9bf,
    '_isProbablyLocalUrl': _0x1a008d,
    '_getCurrentVideoUrl': _0x365d38,
    '_getCurrentVideoPlaybackUrl': _0xa390e4,
    '_getCurrentVideoLocalPath': _0x2ae02f,
    'saveMediaFile': desktopBridge['nodeExport']["canSaveMedia"]() ? saveMediaDownload : null,
    '_getCurrentVideoSource': _0x1a7d3b,
    '_resolveCurrentVideoDurationSec': _0x259498,
    '_ensureVideoHdDurationAllowed': _0x4e01ce,
    '_ensureVideoHdVipAllowed': _0x494f7c,
    '_extractFirstUrl': _0x592115,
    '_saveRemoteVideoResult': _0xd1097c,
    'closeToolbarMoreMenu': () => _0x998d68?.['closeMoreMenu']?.()
  };
  _0x1af10b(bindPreviewUploadToolbarAction({
    'button': _0x2f6450['querySelector']('.act-upload')
  }));
  bindStoryboardScriptToolbarAction(_0x101141);
  _0x1af10b(bindApimartPrivateAvatarAction(_0x101141));
  bindVideoClipAction(_0x101141);
  _0x1af10b(bindVideoSegmentRetakeAction(_0x101141));
  bindVideoVoiceReplaceAction(_0x101141);
  bindVideoExtractKeyframesAction(_0x101141);
  bindVideoSeparateAvAction(_0x101141);
  bindVideoReverseAction(_0x101141);
  bindVideoSmartClipAction(_0x101141);
  _0x1af10b(bindVideoKeyingAction(_0x101141));
  _0x1af10b(bindVideoToGifAction(_0x101141));
  bindVideoRemoveAction(_0x101141);
  bindVideoFrameInterpolationAction(_0x101141);
  bindVideoDepthAction(_0x101141);
  bindVideoHdAction(_0x101141);
  bindVideoDownloadAction(_0x101141);
  bindVideoFullscreenAction(_0x101141);
  bindVideoResetSizeAction(_0x101141);
  return () => {
    for (const _0x506503 of _0x2edb2c["splice"](0x0)) {
      _0x506503();
    }
  };
}