import { buildStoryEpisodeCanvasName } from './storyEpisodeCanvas.js';
import { isStoryCollaborationProject } from './storyCollaborationPolicy.js';
import { getStoryVideoEpisodes, isStoryWorkspaceStepNavigationDisabled } from './storyWorkspaceNavigationTransaction.js';
function normalizeText(_0x288924) {
  return String(_0x288924 ?? '')["trim"]();
}
function freezeSnapshot(_0x1e75bc) {
  if (Array['isArray'](_0x1e75bc)) {
    return Object["freeze"](_0x1e75bc["map"](_0x8d9e3a => freezeSnapshot(_0x8d9e3a)));
  }
  if (_0x1e75bc && typeof _0x1e75bc === "object") {
    return Object['freeze'](Object["fromEntries"](Object["entries"](_0x1e75bc)["map"](([_0x390a58, _0x309b30]) => [_0x390a58, freezeSnapshot(_0x309b30)])));
  }
  return _0x1e75bc;
}
export function getStoryEpisodeToolbarOptions(_0x520704 = [], _0x52608a = '') {
  const _0x2fcf5e = normalizeText(_0x52608a);
  return getStoryVideoEpisodes(_0x520704)['filter'](_0x581bf2 => normalizeText(_0x581bf2?.['id']) !== _0x2fcf5e && Array["isArray"](_0x581bf2?.['clips']) && _0x581bf2["clips"]['length'] > 0x0);
}
export function getStoryProjectCanvasEpisodes(_0x35b382 = [], _0x6f1ecf = '') {
  const _0x40b644 = getStoryVideoEpisodes(_0x35b382);
  const _0x8995a0 = normalizeText(_0x6f1ecf);
  const _0x32db1e = _0x40b644["find"](_0x511d05 => normalizeText(_0x511d05?.['id']) === _0x8995a0) || _0x40b644[0x0];
  return _0x32db1e ? [_0x32db1e] : [];
}
function projectEpisodeSwitcher(_0x50af74, _0x5cbbf8, _0x3bab1d) {
  return {
    'currentEpisodeId': normalizeText(_0x5cbbf8?.['id']),
    'currentEpisodeName': buildStoryEpisodeCanvasName(_0x5cbbf8) || '分集详情',
    'isCurrentPage': _0x3bab1d,
    'options': getStoryEpisodeToolbarOptions(_0x50af74["data"]?.["episodes"], _0x5cbbf8?.['id'])["map"](_0x3357e8 => ({
      'id': _0x3357e8['id'],
      'name': buildStoryEpisodeCanvasName(_0x3357e8) || "分集详情",
      'clipCount': _0x3357e8["clips"]["length"]
    }))
  };
}
export function createStoryWorkspaceChromeProjection({
  steps = []
} = {}) {
  function _0x7094ab(_0x1b7afb, _0x37b083 = _0x1b7afb["step"]) {
    const _0x17e3e1 = _0x1b7afb["data"]?.["project"]?.['sourceMode'];
    const _0x214e43 = _0x17e3e1 === "upload-original" ? steps['map'](_0x29428f => _0x29428f['id'] === 0x1 ? {
      ..._0x29428f,
      'label': "原始剧本"
    } : _0x29428f) : _0x17e3e1 === "video-replication" ? steps['map'](_0x1627fb => ({
      ..._0x1627fb,
      'label': {
        0x1: "原片分析",
        0x2: '素材设定',
        0x3: '视频列表'
      }[_0x1627fb['id']] || _0x1627fb["label"]
    })) : steps;
    return {
      'activeStep': _0x37b083,
      'items': (isStoryCollaborationProject(_0x1b7afb["data"]) ? [{
        'id': 0x0,
        'label': "故事构思"
      }, ..._0x214e43] : _0x214e43)['map']((_0x5e629e, _0x4f1cd6) => ({
        'id': _0x5e629e['id'],
        'number': _0x4f1cd6 + 0x1,
        'label': _0x5e629e['label'],
        'active': _0x37b083 === _0x5e629e['id'],
        'disabled': _0x5e629e['id'] === 0x0 && _0x1b7afb['developerModeAvailable'] !== !![] || isStoryWorkspaceStepNavigationDisabled(_0x1b7afb["data"], _0x5e629e['id'])
      }))
    };
  }
  function _0x1de587(_0x24bfa1 = {}) {
    if (_0x24bfa1['view'] === "episode") {
      const _0x3b4adb = _0x24bfa1["data"]?.["episodes"]?.["find"](_0x1d90c7 => _0x1d90c7['id'] === _0x24bfa1["selectedEpisodeId"]);
      return {
        'kind': 'episode',
        'projectLabel': _0x24bfa1['workspaceSurface'] === "replication" ? '复刻项目' : '剧本项目',
        'steps': _0x7094ab(_0x24bfa1, "episode"),
        'episodeSwitcher': projectEpisodeSwitcher(_0x24bfa1, _0x3b4adb, !![]),
        'canvasSyncPending': _0x24bfa1["canvasSyncPending"] === !![]
      };
    }
    const _0x1fc68d = getStoryEpisodeToolbarOptions(_0x24bfa1["data"]?.["episodes"]);
    const _0x50d71c = _0x1fc68d["find"](_0x29b558 => normalizeText(_0x29b558?.['id']) === normalizeText(_0x24bfa1["selectedEpisodeId"])) || _0x1fc68d[0x0] || null;
    return {
      'kind': "project",
      'collaborationAvailable': _0x24bfa1["developerModeAvailable"] === !![] && _0x24bfa1["workspaceSurface"] !== "replication" && isStoryCollaborationProject(_0x24bfa1['data']),
      'projectLabel': _0x24bfa1['workspaceSurface'] === "replication" ? "复刻项目" : "剧本项目",
      'steps': _0x7094ab(_0x24bfa1),
      'episodeSwitcher': _0x50d71c ? projectEpisodeSwitcher(_0x24bfa1, _0x50d71c, ![]) : null
    };
  }
  function _0x2fefc3(_0x200c49 = {}, {
    nextLabel: _0x164af8,
    nextAction: _0x1285dc = '',
    isLast = ![],
    title = '',
    hint = '',
    actionsMarkup = ''
  } = {}) {
    const _0x968adc = _0x1285dc || (isLast ? "finish-story-workbench" : _0x200c49["step"] === 0x1 ? "extract-assets" : "open-episode-stage");
    const _0xfdd4aa = _0x200c49["data"]?.['project']?.['sourceMode'] === "video-replication" && _0x200c49["splittingEpisodeIds"]?.["length"] > 0x0;
    const _0x3d96c4 = Boolean(_0x200c49["storyPlanningOperation"] || _0xfdd4aa);
    const _0x166aad = _0xfdd4aa ? "正在生成分段提示词" : _0x200c49["storyPlanningStatus"] || _0x164af8 || "处理中";
    const _0x16a51e = title || (_0x1285dc === "plan-episode-outlines" ? "剧本摘要已完成" : _0x1285dc === 'extract-assets' ? '完整分集剧本已全部完成' : _0x200c49["step"] === 0x2 ? "角色、场景和道具设定已应用" : "分集结构已建立");
    const _0x5066c0 = hint || (_0x1285dc === "plan-episode-outlines" ? "下一步将按已设置集数生成分集大纲" : _0x1285dc === "extract-assets" ? "下一步沿用现有素材、分镜和视频流程" : isLast ? '进入分集后可编辑片段并选择视频模型' : "可以继续下一步，也可以返回修改");
    return {
      'title': _0x16a51e,
      'hint': _0x5066c0,
      'actionsMarkup': actionsMarkup,
      'showPrevious': _0x200c49['step'] > (_0x200c49['developerModeAvailable'] === !![] && isStoryCollaborationProject(_0x200c49["data"]) ? 0x0 : 0x1),
      'nextAction': _0x968adc,
      'nextLabel': _0x3d96c4 ? _0x166aad : _0x164af8 || "下一步",
      'busy': _0x3d96c4
    };
  }
  return Object['freeze']({
    'projectFooter': (..._0x33a48f) => freezeSnapshot(_0x2fefc3(..._0x33a48f)),
    'projectToolbar': (..._0x29dcd3) => freezeSnapshot(_0x1de587(..._0x29dcd3))
  });
}