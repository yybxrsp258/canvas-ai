import { ensureVideoResultThumbnail } from '../../../api/videoResultThumbnailApi.js';
import { readVideoFileNaturalSize } from '../../components/source-video/sourceVideoUploadMedia.js';
import { uploadFile } from '../../services/projectService.js';
import { logDiagnosticEvent } from '../../services/diagnosticsService.js';
import { collectStoryReplicationRepresentativeFrames } from './storyReplicationRepresentativeFrames.js';
import { buildStoryBackgroundTaskId } from './storyBackgroundTasks.js';
import { resolveStoryTextProviderProfileId } from './storyProjectPlanning.js';
import { getStoryWorkspaceModelChoice, resolveStoryVideoInputTextModelId } from './storyWorkspaceModelCatalog.js';
import { applyStoryVideoReplicationAnalysis, applyStoryVideoReplicationUpload, createStoryVideoReplicationProjectData, failStoryVideoReplicationEpisode, findStoryReplicationEpisode, getStoryVideoReplicationSummary, invalidateStoryVideoReplicationAssetLocalization, resolveStoryVideoReplicationHomeTab, resolveStoryReplicationUploadedVideo, syncStoryVideoReplicationProject } from './storyVideoReplication.js';
import { syncStoryVideoReplicationCardElement, syncStoryReplicationSelection } from './storyVideoReplicationPresentation.js';
function normalizeText(_0x424779) {
  return String(_0x424779 ?? '')["trim"]();
}
function finishAnalysisAttempt(_0x52cc38, _0x89a1ad, _0xc92d52 = null) {
  if (!_0x89a1ad) {
    return;
  }
  const _0x436841 = {
    ..._0x89a1ad,
    'finishedAt': Date["now"](),
    'status': _0xc92d52 ? 'failed' : "succeeded",
    ...(_0xc92d52 ? {
      'error': String(_0xc92d52["message"] || "视频分析失败")['slice'](0x0, 0x4b0),
      'code': _0xc92d52['code'],
      'httpStatus': _0xc92d52["status"],
      'errorType': _0xc92d52["type"]
    } : {})
  };
  _0x52cc38["replication"]['analysisAttempts'] = [...(_0x52cc38['replication']["analysisAttempts"] || []), _0x436841]["slice"](-0xa);
  void logDiagnosticEvent({
    'type': "story.replication_analysis_finished",
    'level': _0xc92d52 ? "error" : "info",
    'message': _0xc92d52 ? _0x436841["error"] : "原视频分析完成",
    'context': _0x436841
  });
}
export function createStoryVideoReplicationWorkspaceController({
  state: _0x2282f3,
  viewport: _0x246f2b,
  documentObject = globalThis["document"],
  windowObject = globalThis['window'] || globalThis,
  analyzeSourceVideo: _0x537859,
  analysisPromises: _0x18e5cd,
  sourceFileByEpisodeKey: _0x11de64,
  createProjectToken: _0x3209b5,
  beginProjectSession: _0x6e6418,
  isProjectTaskLive: _0x2f0a73,
  isProjectTaskCurrent: _0x461322,
  startBackgroundTask: _0x5b00a6,
  updateBackgroundTask: _0x4b579e,
  finishBackgroundTask: _0x18d4e6,
  syncProjectEntry: _0x2922be,
  syncCurrentProjectEntry: _0x403ce8,
  schedulePersistence: _0x1391ce,
  openProject: _0x28e02f,
  renderFooter: _0x3ece31,
  showToast: _0x1bf488,
  showNavigableTaskResultToast: _0x5d2101,
  notifyTextTaskComplete: _0x4c3994
} = {}) {
  if (!_0x2282f3 || !_0x246f2b || !documentObject || !(_0x18e5cd instanceof Map) || !(_0x11de64 instanceof Map) || typeof _0x3209b5 !== "function" || typeof _0x6e6418 !== "function" || typeof _0x2f0a73 !== "function" || typeof _0x461322 !== "function" || typeof _0x5b00a6 !== "function" || typeof _0x4b579e !== "function" || typeof _0x18d4e6 !== "function" || typeof _0x2922be !== "function" || typeof _0x403ce8 !== "function" || typeof _0x1391ce !== "function" || typeof _0x28e02f !== "function" || typeof _0x3ece31 !== 'function' || typeof _0x1bf488 !== "function" || typeof _0x5d2101 !== "function" || typeof _0x4c3994 !== 'function') {
    throw new TypeError("Story video replication requires task, persistence, and presentation adapters.");
  }
  function _0x5bf184(_0x202ca2) {
    const _0x1371fd = windowObject?.["URL"];
    if (!_0x202ca2 || typeof _0x1371fd?.["createObjectURL"] !== "function") {
      return '';
    }
    try {
      return _0x1371fd["createObjectURL"](_0x202ca2);
    } catch (_0x2d6823) {
      console["warn"]("[storyWorkspace] 创建复刻视频本地预览失败", _0x2d6823);
      return '';
    }
  }
  function _0x2bc987(_0x745988) {
    const _0x166a00 = normalizeText(_0x745988);
    const _0x2bd737 = windowObject?.['URL'];
    if (!_0x166a00['startsWith']("blob:") || typeof _0x2bd737?.['revokeObjectURL'] !== "function") {
      return;
    }
    _0x2bd737["revokeObjectURL"](_0x166a00);
  }
  function _0xfe4e13() {
    _0x2282f3['replicationSourcePreviewUrls']["forEach"](_0x2bc987);
    _0x2282f3['replicationSourcePreviewUrls'] = [];
  }
  function _0x34c43b(_0x19f089) {
    if (_0x2282f3['view'] !== "project" || _0x2282f3["step"] !== 0x1 || _0x2282f3["data"]?.["project"]?.["sourceMode"] !== 'video-replication') {
      return ![];
    }
    const _0x5da97f = _0x246f2b['querySelector'](".story-page.is-current");
    const _0x3ae67d = findStoryReplicationEpisode(_0x2282f3['data'], _0x19f089);
    const _0x4bb23c = [...(_0x5da97f?.['querySelectorAll']("[data-story-replication-episode-id]") || [])]["find"](_0x3c9ba4 => _0x3c9ba4["matches"]?.("article") && normalizeText(_0x3c9ba4["dataset"]["storyReplicationEpisodeId"]) === normalizeText(_0x19f089));
    if (!_0x5da97f || !_0x3ae67d || !_0x4bb23c) {
      return ![];
    }
    const _0x52e715 = _0x2282f3["data"]["episodes"]['indexOf'](_0x3ae67d);
    _0x5da97f["dispatchEvent"]?.(new CustomEvent("story-replication-updated", {
      'detail': {
        'episodeId': _0x19f089
      }
    }));
    return syncStoryVideoReplicationCardElement(_0x4bb23c, _0x3ae67d, _0x52e715);
  }
  function _0x588814() {
    if (_0x2282f3["view"] !== "project" || _0x2282f3['step'] !== 0x1 || _0x2282f3["data"]?.['project']?.["sourceMode"] !== "video-replication") {
      return ![];
    }
    const _0x5f7244 = _0x246f2b["querySelector"](".story-page.is-current");
    const _0x453d9e = _0x5f7244?.["querySelector"](".story-page-footer");
    if (_0x5f7244) {
      syncStoryReplicationSelection(_0x5f7244, _0x2282f3);
    }
    if (!_0x453d9e) {
      return ![];
    }
    const _0x2363b3 = documentObject["createElement"]('template');
    _0x2363b3["innerHTML"] = _0x3ece31(_0x2282f3)["trim"]();
    const _0x1d44ef = _0x2363b3['content']["firstElementChild"];
    if (!_0x1d44ef) {
      return ![];
    }
    _0x453d9e['replaceWith'](_0x1d44ef);
    return !![];
  }
  function _0x111f27(_0x3ad78c, _0x3479de) {
    if (!_0x461322(_0x3ad78c) || _0x2282f3["view"] !== "project" || _0x2282f3["step"] !== 0x1 || _0x2282f3["data"]?.["project"]?.["sourceMode"] !== "video-replication") {
      return ![];
    }
    const _0x27d6c4 = _0x34c43b(_0x3479de);
    const _0x456824 = _0x588814();
    return _0x27d6c4 && _0x456824;
  }
  async function _0x14ca20(_0x43834e, _0x45bc72, _0x264d9e, {
    uploadOnly = ![],
    force = ![]
  } = {}) {
    const _0x56be39 = findStoryReplicationEpisode(_0x43834e["data"], _0x264d9e);
    if (!_0x56be39 || !_0x2f0a73(_0x43834e)) {
      return ![];
    }
    const _0x2dc175 = force ? {
      'replication': {
        ..._0x56be39["replication"]
      },
      'status': _0x56be39["status"]
    } : null;
    let _0x589c7c = null;
    const _0x1983e3 = buildStoryBackgroundTaskId("video-replication-analysis", {
      'episodeId': _0x264d9e
    });
    _0x5b00a6(_0x43834e, {
      'id': _0x1983e3,
      'type': "video-replication-analysis",
      'scope': {
        'episodeId': _0x264d9e
      },
      'label': '解析第\x20' + _0x56be39["number"] + " 集视频",
      'message': "正在上传原视频"
    }, {
      'refreshHome': ![]
    });
    if (!force) {
      invalidateStoryVideoReplicationAssetLocalization(_0x43834e["data"]);
    }
    _0x56be39["replication"] = {
      ...(_0x56be39['replication'] || {}),
      'status': "uploading",
      'progress': 0xa,
      'error': ''
    };
    _0x111f27(_0x43834e, _0x264d9e);
    try {
      let _0x1c7c53 = normalizeText(_0x56be39["sourceVideo"]?.['videoRef']);
      if (!_0x1c7c53) {
        if (!_0x45bc72) {
          throw new Error("原视频尚未上传，请使用卡片上的“重新上传该视频”。");
        }
        const _0x4b23bd = readVideoFileNaturalSize(_0x45bc72)["catch"](() => null);
        const _0x42f8e4 = await uploadFile(_0x45bc72, _0x43834e["projectId"]);
        if (!_0x2f0a73(_0x43834e)) {
          return ![];
        }
        const _0x99fd96 = await _0x4b23bd;
        if (!_0x2f0a73(_0x43834e)) {
          return ![];
        }
        const _0x2ec359 = resolveStoryReplicationUploadedVideo(_0x42f8e4);
        _0x1c7c53 = _0x2ec359['videoRef'];
        let _0x593376 = {
          ..._0x42f8e4,
          'localPath': _0x2ec359['localPath'] || _0x42f8e4?.["localPath"],
          'videoUrl': _0x1c7c53
        };
        try {
          _0x593376 = await ensureVideoResultThumbnail(_0x593376);
        } catch (_0x3e5315) {
          globalThis["console"]?.["warn"]?.('[storyWorkspace]\x20复刻视频首帧提取失败，继续执行视频解析', _0x3e5315);
        }
        if (!_0x2f0a73(_0x43834e)) {
          return ![];
        }
        applyStoryVideoReplicationUpload(_0x56be39, {
          'file': _0x45bc72,
          'videoRef': _0x1c7c53,
          'durationSec': _0x99fd96?.["duration"] || _0x42f8e4?.["durationSec"] || _0x42f8e4?.["duration"],
          'posterUrl': _0x593376?.["posterUrl"] || _0x593376?.["thumbUrl"],
          'posterLocalPath': _0x593376?.["posterLocalPath"] || _0x593376?.["thumbLocalPath"]
        });
      } else {
        _0x56be39["replication"] = {
          ...(_0x56be39["replication"] || {}),
          'status': "analyzing",
          'progress': 0x2d,
          'error': ''
        };
        _0x56be39["status"] = "解析中";
      }
      if (uploadOnly) {
        _0x56be39["replication"]['status'] = "pending";
        _0x56be39["replication"]["progress"] = 0x0;
        _0x56be39["status"] = "待分析";
        _0x18d4e6(_0x43834e, _0x1983e3, {
          'status': 'succeeded',
          'message': "视频已导入，等待选择分析"
        }, {
          'refreshHome': ![]
        });
        syncStoryVideoReplicationProject(_0x43834e["data"]);
        _0x2922be(_0x43834e);
        _0x1391ce({
          'immediate': !![]
        });
        _0x111f27(_0x43834e, _0x264d9e);
        return !![];
      }
      _0x4b579e(_0x43834e, _0x1983e3, {
        'status': "running",
        'message': '正在理解剧情、台词与镜头'
      }, {
        'refreshHome': ![]
      });
      _0x111f27(_0x43834e, _0x264d9e);
      const _0x16830e = normalizeText(_0x43834e["modelSettings"]['models']?.["text"]);
      if (!_0x16830e || resolveStoryVideoInputTextModelId(_0x16830e) !== _0x16830e) {
        throw new Error("当前选中的模型不支持视频分析，请从模型菜单重新选择后重试。");
      }
      const _0x37a64d = getStoryWorkspaceModelChoice("text", _0x16830e)?.["provider"] || _0x43834e['modelSettings']['textProvider'];
      const _0x359166 = resolveStoryTextProviderProfileId(_0x37a64d, _0x43834e["modelSettings"]['textProviderProfileId']);
      _0x4b579e(_0x43834e, _0x1983e3, {
        'modelId': _0x16830e,
        'provider': _0x37a64d,
        'providerProfileId': _0x359166
      }, {
        'refreshHome': ![]
      });
      (force || !_0x56be39['replication']['sourceAnalysis']) && (_0x589c7c = {
        'startedAt': Date['now'](),
        'projectId': _0x43834e['projectId'],
        'episodeId': _0x264d9e,
        'modelId': _0x16830e,
        'provider': _0x37a64d,
        'providerProfileId': _0x359166
      });
      const _0x46fedb = await _0x537859({
        'videoRef': _0x1c7c53,
        'durationSec': _0x56be39["sourceVideo"]['durationSec'],
        'modelId': _0x16830e,
        'model': _0x16830e,
        'provider': _0x37a64d,
        'providerProfileId': _0x359166,
        'sourceAnalysis': force ? null : _0x56be39['replication']["sourceAnalysis"] || null,
        'isActive': () => _0x2f0a73(_0x43834e),
        'onProgress': _0x5dc9e0 => {
          if (!_0x2f0a73(_0x43834e)) {
            return;
          }
          _0x56be39["replication"]["message"] = _0x5dc9e0;
          _0x4b579e(_0x43834e, _0x1983e3, {
            'message': _0x5dc9e0
          }, {
            'refreshHome': ![]
          });
          _0x111f27(_0x43834e, _0x264d9e);
        },
        'onSourceAnalysis': async _0x3685cd => {
          if (!_0x2f0a73(_0x43834e) || force) {
            return;
          }
          _0x56be39["replication"]["sourceAnalysis"] = _0x3685cd;
          _0x2922be(_0x43834e);
          _0x1391ce({
            'immediate': !![]
          });
        }
      });
      if (!_0x2f0a73(_0x43834e)) {
        return ![];
      }
      if (_0x46fedb["sourceAnalysis"]) {
        const _0x142784 = {
          ..._0x56be39,
          'replication': {
            ..._0x56be39["replication"],
            'sourceAnalysis': _0x46fedb['sourceAnalysis']
          }
        };
        await collectStoryReplicationRepresentativeFrames({
          'episode': _0x142784,
          'projectId': _0x43834e["projectId"],
          'isActive': () => _0x2f0a73(_0x43834e),
          'onProgress': _0x169ee4 => {
            _0x56be39['replication']["message"] = _0x169ee4;
            _0x111f27(_0x43834e, _0x264d9e);
          }
        });
      }
      if (!_0x2f0a73(_0x43834e)) {
        return ![];
      }
      applyStoryVideoReplicationAnalysis(_0x56be39, _0x46fedb);
      finishAnalysisAttempt(_0x56be39, _0x589c7c);
      if (force) {
        invalidateStoryVideoReplicationAssetLocalization(_0x43834e["data"]);
        const _0x2b9fec = _0x43834e["data"]["project"]['replication']['characterBindings'] || {};
        for (const _0x536a69 of Object['keys'](_0x2b9fec)) {
          if (_0x536a69['startsWith'](_0x56be39['id'] + ':')) {
            delete _0x2b9fec[_0x536a69];
          }
        }
      }
      _0x56be39["replication"]["message"] = '';
      syncStoryVideoReplicationProject(_0x43834e["data"]);
      _0x18d4e6(_0x43834e, _0x1983e3, {
        'status': "succeeded",
        'message': '第\x20' + _0x56be39["number"] + " 集视频解析完成"
      }, {
        'refreshHome': ![]
      });
      _0x2922be(_0x43834e);
      _0x1391ce({
        'immediate': !![]
      });
      _0x111f27(_0x43834e, _0x264d9e);
      return !![];
    } catch (_0x5aa11c) {
      if (!_0x2f0a73(_0x43834e)) {
        return ![];
      }
      if (_0x2dc175) {
        _0x56be39['replication'] = {
          ..._0x2dc175['replication'],
          'error': "重新分析失败，已保留原人物记录：" + (_0x5aa11c?.["message"] || '请重试')
        };
        _0x56be39["status"] = _0x2dc175["status"];
      } else {
        failStoryVideoReplicationEpisode(_0x56be39, _0x5aa11c?.["message"]);
      }
      finishAnalysisAttempt(_0x56be39, _0x589c7c, _0x5aa11c);
      syncStoryVideoReplicationProject(_0x43834e["data"]);
      _0x18d4e6(_0x43834e, _0x1983e3, {
        'status': "failed",
        'message': '第\x20' + _0x56be39["number"] + " 集视频解析失败",
        'error': _0x5aa11c?.['message'] || '视频解析失败。'
      }, {
        'refreshHome': ![]
      });
      _0x2922be(_0x43834e);
      _0x1391ce({
        'immediate': !![]
      });
      _0x111f27(_0x43834e, _0x264d9e);
      return ![];
    }
  }
  async function _0x42a3f9(_0x2c111f, _0x1ee961 = []) {
    const _0x1e58cf = normalizeText(_0x2c111f?.["projectId"]);
    const _0x401ee5 = _0x18e5cd["get"](_0x1e58cf);
    if (_0x401ee5) {
      return _0x401ee5;
    }
    const _0x15e2af = Array['isArray'](_0x1ee961) ? [..._0x1ee961] : [];
    const _0x44ef75 = (async () => {
      let _0x41949f = 0x0;
      for (const _0x4b3e92 of _0x15e2af) {
        if (!_0x2f0a73(_0x2c111f)) {
          break;
        }
        if (!(await _0x14ca20(_0x2c111f, _0x4b3e92["file"], _0x4b3e92["episodeId"], _0x4b3e92))) {
          _0x41949f += 0x1;
        }
      }
      if (!_0x2f0a73(_0x2c111f)) {
        return ![];
      }
      const _0x2df52f = getStoryVideoReplicationSummary(_0x2c111f["data"]);
      if (!_0x41949f && !_0x2df52f["active"] && !_0x2df52f["failed"] && _0x2df52f["completed"] === _0x2df52f["total"]) {
        _0x4c3994("视频解析完成，共 " + _0x2df52f["completed"] + " 条。", _0x2c111f, {
          'step': 0x1
        }, {
          'notificationMessage': "复刻视频解析完成。"
        });
      } else {
        (_0x2df52f["failed"] || _0x41949f) && _0x5d2101("视频解析已完成 " + _0x2df52f['completed'] + '/' + _0x2df52f['total'] + " 条，" + Math["max"](_0x2df52f["failed"], _0x41949f) + '\x20条请求失败。', "warn", _0x2c111f, {
          'step': 0x1
        });
      }
      return _0x2df52f["completed"] > 0x0 || _0x15e2af['some'](_0x1bf19e => _0x1bf19e['uploadOnly'] && findStoryReplicationEpisode(_0x2c111f["data"], _0x1bf19e["episodeId"])?.["replication"]?.['status'] === "pending");
    })()['finally'](() => {
      _0x18e5cd["get"](_0x1e58cf) === _0x44ef75 && _0x18e5cd["delete"](_0x1e58cf);
      if (_0x461322(_0x2c111f)) {
        _0x588814();
      }
    });
    _0x18e5cd['set'](_0x1e58cf, _0x44ef75);
    return _0x44ef75;
  }
  async function _0x1704b6() {
    if (_0x2282f3['isGeneratingStory']) {
      return ![];
    }
    if (resolveStoryVideoReplicationHomeTab(_0x2282f3, "replication") !== "replication") {
      return ![];
    }
    if (typeof _0x537859 !== "function") {
      _0x1bf488('视频理解\x20Agent\x20尚未初始化。', "error");
      return ![];
    }
    const _0xc7be8c = [..._0x2282f3['replicationSourceFiles']];
    if (!_0xc7be8c["length"]) {
      _0x1bf488("请先上传至少一条视频。", "warn");
      return ![];
    }
    const _0x11ffd3 = resolveStoryVideoInputTextModelId(_0x2282f3["models"]["text"]);
    if (!_0x11ffd3) {
      _0x1bf488('当前没有支持视频输入的文本模型。', "error");
      return ![];
    }
    _0x403ce8();
    _0x6e6418();
    _0x2282f3["models"]["text"] = _0x11ffd3;
    const _0x3b2671 = getStoryWorkspaceModelChoice("text", _0x11ffd3);
    _0x2282f3["textProvider"] = _0x3b2671?.["provider"] || _0x2282f3["textProvider"];
    _0x2282f3['textProviderProfileId'] = resolveStoryTextProviderProfileId(_0x2282f3['textProvider'], _0x2282f3['textProviderProfileId']);
    const _0x2cacd5 = 'story-' + Date['now']();
    _0x2282f3['data'] = createStoryVideoReplicationProjectData({
      'projectId': _0x2cacd5,
      'files': _0xc7be8c,
      'modelId': _0x11ffd3,
      'provider': _0x2282f3["textProvider"],
      'providerProfileId': _0x2282f3["textProviderProfileId"],
      'targetLocale': _0x2282f3["replicationTargetLocale"],
      'promptMode': _0x2282f3['data']['project']?.["planning"]?.["promptMode"],
      'aspectRatio': _0x2282f3["data"]["project"]?.['aspectRatio'] || "9:16"
    });
    _0x2282f3["projectTitleEdited"] = ![];
    _0x2282f3["hasCreatedProject"] = !![];
    _0x2282f3['assetSelectionMode'] = ![];
    _0x2282f3['selectedAssetIds'] = [];
    _0x2282f3["selectedEpisodeId"] = _0x2282f3["data"]["episodes"][0x0]?.['id'] || '';
    _0x2282f3["selectedClipId"] = '';
    _0xfe4e13();
    _0x2282f3["replicationSourceFiles"] = [];
    _0x28e02f({
      'resetStep': !![]
    });
    _0x403ce8();
    _0x1391ce({
      'immediate': !![]
    });
    const _0x1c256e = _0x3209b5();
    const _0x3ab00c = _0xc7be8c["map"]((_0x4adb3a, _0x35bd6f) => ({
      'file': _0x4adb3a,
      'episodeId': _0x2282f3["data"]["episodes"][_0x35bd6f]?.['id'],
      'uploadOnly': !![]
    }))["filter"](_0x373f8e => _0x373f8e["file"] && _0x373f8e["episodeId"]);
    _0x3ab00c["forEach"](_0x302e47 => {
      _0x11de64['set'](_0x2cacd5 + ':' + _0x302e47['episodeId'], _0x302e47["file"]);
    });
    return _0x42a3f9(_0x1c256e, _0x3ab00c);
  }
  async function _0x5d7459() {
    if (_0x2282f3['data']?.["project"]?.["sourceMode"] !== 'video-replication') {
      return ![];
    }
    const _0x40c2c7 = _0x3209b5();
    const _0x39e0d = normalizeText(_0x40c2c7["projectId"]);
    if (_0x18e5cd['has'](_0x39e0d)) {
      return ![];
    }
    const _0x120540 = _0x2282f3["data"]['episodes']["filter"](_0x5c3044 => _0x5c3044?.["replication"]?.["status"] === "failed")["map"](_0x4ef347 => ({
      'episodeId': _0x4ef347['id'],
      'file': _0x11de64["get"](_0x39e0d + ':' + _0x4ef347['id']) || null
    }));
    if (!_0x120540["length"]) {
      return ![];
    }
    return _0x42a3f9(_0x40c2c7, _0x120540);
  }
  async function _0x43ca4d({
    all = ![],
    episodeId = ''
  } = {}) {
    if (_0x2282f3["data"]?.["project"]?.['sourceMode'] !== "video-replication") {
      return ![];
    }
    const _0x476a18 = _0x3209b5();
    if (_0x18e5cd["has"](_0x476a18['projectId'])) {
      return ![];
    }
    const _0x50b01c = _0x476a18["data"]["episodes"]['filter'](_0x29b862 => ["pending", "failed"]['includes'](_0x29b862['replication']?.["status"]) && (episodeId ? _0x29b862['id'] === episodeId : all || _0x29b862["replication"]["selectedForAnalysis"]))["map"](_0x37bb63 => ({
      'episodeId': _0x37bb63['id'],
      'file': _0x11de64["get"](_0x476a18['projectId'] + ':' + _0x37bb63['id']) || null
    }));
    if (!_0x50b01c["length"]) {
      _0x1bf488("请先选择待分析的视频。", "warn");
      return ![];
    }
    for (const _0x143b9b of _0x50b01c) {
      const _0x42f4b2 = findStoryReplicationEpisode(_0x476a18['data'], _0x143b9b['episodeId']);
      _0x42f4b2["replication"]["status"] = "queued";
      _0x34c43b(_0x42f4b2['id']);
    }
    _0x588814();
    return _0x42a3f9(_0x476a18, _0x50b01c);
  }
  return {
    'reanalyzeEpisode': _0x2f4b0f => {
      const _0x36165b = _0x3209b5();
      const _0x549ba0 = findStoryReplicationEpisode(_0x36165b["data"], _0x2f4b0f);
      if (!_0x549ba0?.['replication']["sourceAnalysis"] || _0x549ba0["clips"]?.["length"]) {
        return ![];
      }
      if (_0x18e5cd['has'](_0x36165b['projectId'])) {
        _0x1bf488('已有视频正在分析，请等待完成后再重新识别。', "warn");
        return ![];
      }
      return _0x42a3f9(_0x36165b, [{
        'episodeId': _0x2f4b0f,
        'force': !![]
      }]);
    },
    'analyzeEpisode': _0x14ca20,
    'analyzeSelected': _0x43ca4d,
    'createSourcePreviewUrl': _0x5bf184,
    'refreshEpisode': _0x34c43b,
    'refreshFooter': _0x588814,
    'releaseSourcePreviewUrls': _0xfe4e13,
    'retryFailedAnalysis': _0x5d7459,
    'revokeSourcePreviewUrl': _0x2bc987,
    'runAnalysis': _0x42a3f9,
    'startFromHome': _0x1704b6
  };
}