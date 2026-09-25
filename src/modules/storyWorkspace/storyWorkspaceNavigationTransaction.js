import { isStoryVideoReplicationAssetLocalizationComplete } from './storyVideoReplication.js';
import { isStoryCollaborationProject } from './storyCollaborationPolicy.js';
const STORY_WORKSPACE_STEP_COUNT = 0x3;
function normalizeText(_0x3341ab) {
  return String(_0x3341ab ?? '')["trim"]();
}
function cloneNavigationValue(_0x29ecbd, _0x338ff2) {
  if (_0x29ecbd === undefined) {
    return _0x338ff2;
  }
  try {
    return JSON['parse'](JSON['stringify'](_0x29ecbd));
  } catch {
    return _0x338ff2;
  }
}
export function normalizeStoryWorkspaceStep(_0x5ee419) {
  if (_0x5ee419 === 0x0 || _0x5ee419 === '0') {
    return 0x0;
  }
  const _0x1ae5a6 = Math["trunc"](Number(_0x5ee419) || 0x1);
  return Math["max"](0x1, Math["min"](STORY_WORKSPACE_STEP_COUNT, _0x1ae5a6));
}
export function canReuseStoryStepNavigation({
  view = '',
  hasNavigation = ![],
  isEpisodeToolbar = ![]
} = {}) {
  return view === "project" && Boolean(hasNavigation) && !isEpisodeToolbar;
}
export function getStoryVideoEpisodes(_0x5929ee = []) {
  return Array["isArray"](_0x5929ee) ? _0x5929ee["filter"](_0xcd6167 => _0xcd6167 && normalizeText(_0xcd6167?.["script"]?.["fullText"]) !== '') : [];
}
function normalizeStoryWorkspaceProjectData(_0x2001ed) {
  return _0x2001ed && typeof _0x2001ed === "object" && !Array["isArray"](_0x2001ed) ? _0x2001ed : {};
}
export function getStoryWorkspaceStepBlockMessage(_0x2d23f2 = {}, _0x571079 = 0x1) {
  const _0x12fd64 = normalizeStoryWorkspaceStep(_0x571079);
  const _0x52d28e = normalizeStoryWorkspaceProjectData(_0x2d23f2);
  if (_0x12fd64 === 0x0) {
    return isStoryCollaborationProject(_0x52d28e) ? '' : "当前项目没有故事构思步骤。";
  }
  if (_0x52d28e["project"]?.["collaboration"]?.["stage"] === "writing") {
    return "请先确认故事构思中的正文。";
  }
  if (_0x12fd64 === 0x1) {
    return '';
  }
  if (!getStoryVideoEpisodes(_0x52d28e["episodes"])['length']) {
    return "请先至少完成一集分集剧本正文。";
  }
  if (_0x52d28e["project"]?.["sourceMode"] === "video-replication" && !isStoryVideoReplicationAssetLocalizationComplete(_0x52d28e)) {
    return "请先完成资产本地化。";
  }
  return '';
}
export function canEnterStoryWorkspaceStep(_0x27292c = {}, _0x253ced = 0x1) {
  return !getStoryWorkspaceStepBlockMessage(_0x27292c, _0x253ced);
}
export function isStoryWorkspaceStepNavigationDisabled(_0x4e5c96 = {}, _0x34e7dd = 0x1) {
  const _0x22cba3 = normalizeStoryWorkspaceStep(_0x34e7dd);
  const _0x5d9002 = normalizeStoryWorkspaceProjectData(_0x4e5c96);
  return !canEnterStoryWorkspaceStep(_0x5d9002, _0x22cba3) || _0x22cba3 > 0x1 && _0x5d9002['project']?.["outlineStatus"] === "stale";
}
export function getStoryWorkspaceTransitionDirection(_0xcc2f67, _0x4c0ce1) {
  const _0x1d3b02 = normalizeStoryWorkspaceStep(_0xcc2f67);
  const _0x7c92e2 = normalizeStoryWorkspaceStep(_0x4c0ce1);
  if (_0x1d3b02 === _0x7c92e2) {
    return 'none';
  }
  return _0x7c92e2 > _0x1d3b02 ? 'forward' : "backward";
}
export function getStoryWorkspacePageTransitionDirection(_0x1211c6, _0x1267ca, _0x52de9f) {
  if (normalizeText(_0x1211c6) === "episode") {
    return "backward";
  }
  return getStoryWorkspaceTransitionDirection(_0x1267ca, _0x52de9f);
}
export function getStoryEpisodeGenerationControlState(_0x43254f = {}, _0x16b549 = '') {
  const _0x10f278 = normalizeText(_0x16b549);
  const _0x579fe1 = (Array["isArray"](_0x43254f["splittingEpisodeIds"]) ? _0x43254f["splittingEpisodeIds"] : [])["some"](_0xef2f9a => normalizeText(_0xef2f9a) === _0x10f278);
  const _0x4c8ef7 = normalizeText(_0x43254f["storyPlanningOperation"]);
  const _0x4da749 = Boolean(_0x4c8ef7 && _0x4c8ef7 !== 'splitting-episode');
  return {
    'isGenerating': _0x579fe1,
    'disabled': _0x579fe1 || _0x4da749
  };
}
function captureNavigationSnapshot(_0x307670) {
  return {
    'view': _0x307670['view'],
    'step': _0x307670["step"],
    'selectedEpisodeId': _0x307670["selectedEpisodeId"],
    'selectedClipId': _0x307670["selectedClipId"],
    'episodeSelectionMode': _0x307670["episodeSelectionMode"],
    'selectedEpisodeIds': [...(_0x307670['selectedEpisodeIds'] || [])],
    'clipSelectionMode': _0x307670["clipSelectionMode"],
    'selectedClipGenerationIds': [...(_0x307670["selectedClipGenerationIds"] || [])],
    'characterVoicePanelMotion': _0x307670['characterVoicePanelMotion'],
    'pendingCharacterVoiceAssetId': _0x307670["pendingCharacterVoiceAssetId"],
    'pendingDeleteClipId': _0x307670['pendingDeleteClipId'],
    'selectedAssetId': _0x307670['selectedAssetId'],
    'assetFilter': _0x307670["assetFilter"],
    'assetSelectionMode': _0x307670['assetSelectionMode'],
    'selectedAssetIds': [...(_0x307670["selectedAssetIds"] || [])],
    'characterVoiceEditor': cloneNavigationValue(_0x307670["characterVoiceEditor"], null),
    'outlineSectionOpenState': cloneNavigationValue(_0x307670['outlineSectionOpenState'] || {}, {}),
    'clipAdjustmentOpen': _0x307670["clipAdjustmentOpen"],
    'clipAdjustmentInstruction': _0x307670["clipAdjustmentInstruction"],
    'clipAdjustmentLanguage': _0x307670['clipAdjustmentLanguage'],
    'clipAdjustmentLanguageOpen': _0x307670["clipAdjustmentLanguageOpen"],
    'clipPromptHistoryOpen': _0x307670["clipPromptHistoryOpen"],
    'models': {
      ...(_0x307670["models"] || {})
    },
    'videoProvider': _0x307670["videoProvider"],
    'videoProviderProfileId': _0x307670['videoProviderProfileId'],
    'videoProviderProfileIdByModel': cloneNavigationValue(_0x307670["videoProviderProfileIdByModel"] || {}, {}),
    'videoGenerationParams': {
      ...(_0x307670["videoGenerationParams"] || {})
    },
    'videoGenerationParamsByModel': cloneNavigationValue(_0x307670["videoGenerationParamsByModel"] || {}, {})
  };
}
function restoreNavigationSnapshot(_0x22dce8, _0x8414d7) {
  Object["assign"](_0x22dce8, _0x8414d7);
}
export function createStoryWorkspaceNavigationTransaction({
  state: _0x41e73a,
  toolbarEl = null,
  windowObject = globalThis["window"],
  renderAdapter = {},
  onClipSelected = () => {},
  onCommit = () => {},
  notify = () => {},
  logger = globalThis["console"]
} = {}) {
  if (!_0x41e73a || typeof _0x41e73a !== "object") {
    throw new Error('[storyWorkspaceNavigation]\x20state\x20is\x20required');
  }
  if (typeof renderAdapter["render"] !== "function") {
    throw new Error("[storyWorkspaceNavigation] renderAdapter.render is required");
  }
  let _0x1071a8 = 0x0;
  let _0x34040c = ![];
  let _0x11af60 = null;
  function _0x168d12({
    restore = !![]
  } = {}) {
    const _0x217653 = _0x11af60;
    if (!_0x217653) {
      return;
    }
    _0x217653["cancelWait"]?.();
    if (restore) {
      restoreNavigationSnapshot(_0x41e73a, _0x217653["snapshot"]);
    }
    if (_0x11af60 === _0x217653) {
      _0x11af60 = null;
    }
    _0x14d7a2();
  }
  function _0x2ced62() {
    const _0x107d9b = ++_0x1071a8;
    _0x168d12();
    const _0x451555 = captureNavigationSnapshot(_0x41e73a);
    _0x11af60 = {
      'token': _0x107d9b,
      'snapshot': _0x451555,
      'cancelWait': null
    };
    return {
      'token': _0x107d9b,
      'snapshot': _0x451555
    };
  }
  function _0x25c21c(_0x2add14) {
    if (_0x11af60?.["token"] === _0x2add14) {
      _0x11af60 = null;
    }
  }
  function _0xd367eb() {
    const _0x19272e = toolbarEl?.["querySelector"]?.(".story-step-navigation");
    const _0x3c6e39 = toolbarEl?.["querySelector"]?.(".story-project-toolbar");
    const _0x38d9d2 = canReuseStoryStepNavigation({
      'view': _0x41e73a['view'],
      'hasNavigation': Boolean(_0x19272e),
      'isEpisodeToolbar': Boolean(_0x3c6e39?.["classList"]?.["contains"]("story-project-toolbar--episode"))
    });
    if (!_0x38d9d2) {
      return ![];
    }
    _0x19272e["dataset"]["activeStep"] = String(_0x41e73a["step"]);
    _0x19272e["querySelectorAll"]("[data-story-step]")["forEach"](_0x4b50f9 => {
      const _0x10e474 = normalizeStoryWorkspaceStep(_0x4b50f9["dataset"]["storyStep"]);
      const _0x45e61d = _0x10e474 === _0x41e73a["step"];
      _0x4b50f9["classList"]["toggle"]('is-active', _0x45e61d);
      _0x4b50f9["setAttribute"]('aria-current', _0x45e61d ? "step" : 'false');
      _0x4b50f9["disabled"] = isStoryWorkspaceStepNavigationDisabled(_0x41e73a["data"], _0x10e474);
    });
    return !![];
  }
  function _0x12bed6(_0x32646f) {
    const _0x28701e = toolbarEl?.["querySelector"]?.('.story-project-toolbar--episode');
    const _0x4d9979 = _0x28701e?.['querySelector'](".story-episode-toolbar-current");
    const _0x2c7574 = _0x28701e?.["querySelector"]("[data-story-step=\"" + normalizeStoryWorkspaceStep(_0x32646f) + '\x22]');
    if (!_0x28701e || !_0x4d9979 || !_0x2c7574) {
      return ![];
    }
    const _0x4ad197 = _0x4d9979["getBoundingClientRect"]?.();
    const _0x34d058 = _0x2c7574["getBoundingClientRect"]?.();
    if (!_0x4ad197?.['width'] || !_0x34d058?.["width"]) {
      return ![];
    }
    _0x4d9979['style']["setProperty"]("--story-episode-exit-x", _0x34d058['left'] - _0x4ad197["left"] + 'px');
    _0x4d9979["style"]["setProperty"]("--story-episode-exit-width", _0x34d058["width"] + 'px');
    _0x2c7574["classList"]["add"]("is-episode-exit-target");
    _0x28701e["classList"]["add"]('is-switching-from-episode');
    return !![];
  }
  function _0x3f6c37() {
    const _0x1f86aa = toolbarEl?.["querySelector"]?.(".story-project-toolbar:not(.story-project-toolbar--episode)");
    const _0x882373 = _0x1f86aa?.["querySelector"](".story-episode-toolbar-current[data-story-episode-state=\"inactive\"]");
    const _0x3a7f61 = _0x1f86aa?.["querySelector"]("[data-story-step=\"" + normalizeStoryWorkspaceStep(_0x41e73a["step"]) + '\x22]');
    if (!_0x1f86aa || !_0x882373 || !_0x3a7f61) {
      return ![];
    }
    const _0x549d4e = _0x882373['getBoundingClientRect']?.();
    const _0xf59fa = _0x3a7f61['getBoundingClientRect']?.();
    if (!_0x549d4e?.["width"] || !_0xf59fa?.["width"]) {
      return ![];
    }
    _0x882373['style']["setProperty"]('--story-episode-enter-x', _0xf59fa["left"] - _0x549d4e["left"] + 'px');
    _0x882373["style"]['setProperty']("--story-episode-enter-width", _0xf59fa['width'] + 'px');
    _0x1f86aa["classList"]['add']("is-switching-to-episode");
    _0x882373['getBoundingClientRect']?.();
    windowObject?.['requestAnimationFrame']?.(() => {
      if (!_0x1f86aa["isConnected"] || !_0x1f86aa["classList"]["contains"]('is-switching-to-episode')) {
        return;
      }
      _0x1f86aa['classList']["add"]("is-switching-to-episode-ready");
    });
    return !![];
  }
  function _0x14d7a2() {
    toolbarEl?.["querySelectorAll"]?.(".story-project-toolbar")['forEach'](_0x2d3f99 => {
      _0x2d3f99["classList"]["remove"]("is-switching-to-episode", "is-switching-to-episode-ready", "is-switching-from-episode");
    });
    toolbarEl?.["querySelectorAll"]?.('.story-episode-toolbar-current')['forEach'](_0x5e348b => {
      _0x5e348b["style"]["removeProperty"]("--story-episode-enter-x");
      _0x5e348b["style"]["removeProperty"]('--story-episode-enter-width');
      _0x5e348b["style"]["removeProperty"]("--story-episode-exit-x");
      _0x5e348b["style"]["removeProperty"]("--story-episode-exit-width");
    });
    toolbarEl?.["querySelectorAll"]?.('.is-episode-exit-target')["forEach"](_0x5a2b42 => {
      _0x5a2b42["classList"]['remove']('is-episode-exit-target');
    });
  }
  function _0x239b47(_0xb28413) {
    if (typeof windowObject?.["requestAnimationFrame"] !== "function") {
      return Promise['resolve']();
    }
    return new Promise(_0x8c764e => {
      const _0x14dbff = _0x11af60?.["token"] === _0xb28413 ? _0x11af60 : null;
      if (!_0x14dbff) {
        _0x8c764e();
        return;
      }
      let _0x32f4e4 = 0x0;
      let _0xfcc554 = 0x0;
      let _0x25376a = ![];
      const _0x46730a = () => {
        if (_0x25376a) {
          return;
        }
        _0x25376a = !![];
        if (_0x14dbff["cancelWait"] === _0x14a5f8) {
          _0x14dbff["cancelWait"] = null;
        }
        _0x8c764e();
      };
      const _0x14a5f8 = () => {
        if (typeof windowObject["cancelAnimationFrame"] === "function") {
          if (_0x32f4e4) {
            windowObject["cancelAnimationFrame"](_0x32f4e4);
          }
          if (_0xfcc554) {
            windowObject["cancelAnimationFrame"](_0xfcc554);
          }
        }
        _0x46730a();
      };
      _0x14dbff["cancelWait"] = _0x14a5f8;
      _0x32f4e4 = windowObject["requestAnimationFrame"](() => {
        _0x32f4e4 = 0x0;
        _0xfcc554 = windowObject["requestAnimationFrame"](() => {
          _0xfcc554 = 0x0;
          _0x46730a();
        });
      });
    });
  }
  function _0x2db7d0({
    token: _0x117300,
    snapshot: _0x4f3854,
    operation: _0x120c43,
    error: _0x447010,
    message: _0x269a0f
  }) {
    if (_0x34040c || _0x117300 !== _0x1071a8) {
      return ![];
    }
    restoreNavigationSnapshot(_0x41e73a, _0x4f3854);
    if (_0x11af60?.["token"] === _0x117300) {
      _0x11af60 = null;
    }
    _0x14d7a2();
    logger?.['error']?.("[storyWorkspace][" + _0x120c43 + "] 导航失败", _0x447010);
    try {
      renderAdapter["renderToolbar"]?.();
    } catch (_0xc8d076) {
      logger?.['error']?.('[storyWorkspace][' + _0x120c43 + ']\x20工具栏恢复失败', _0xc8d076);
    }
    try {
      renderAdapter["render"]({
        'direction': "none",
        'updateToolbar': ![],
        'capturePageState': ![]
      });
    } catch (_0x2a75cc) {
      logger?.["error"]?.("[storyWorkspace][" + _0x120c43 + ']\x20页面恢复失败', _0x2a75cc);
    }
    notify(_0x269a0f, "error");
    return ![];
  }
  function _0x23a337(_0x2a0965, _0x339d54) {
    if (_0x34040c || _0x2a0965 !== _0x1071a8) {
      return;
    }
    try {
      renderAdapter["renderToolbar"]?.();
    } catch (_0x4d5ba1) {
      logger?.["error"]?.('[storyWorkspace][' + _0x339d54 + "] 工具栏收尾失败", _0x4d5ba1);
      notify("工具栏更新失败，请重试。", "error");
      throw _0x4d5ba1;
    } finally {
      _0x14d7a2();
    }
  }
  async function _0x118634(_0x30088b = {}) {
    if (_0x34040c) {
      return ![];
    }
    const _0x5e7c82 = normalizeStoryWorkspaceStep(_0x30088b["step"]);
    const _0x3abadd = getStoryWorkspaceStepBlockMessage(_0x41e73a["data"], _0x5e7c82);
    if (_0x3abadd) {
      notify(_0x3abadd, "warn");
      return ![];
    }
    const {
      token: _0x158180,
      snapshot: _0x33afd6
    } = _0x2ced62();
    try {
      const _0x5b2324 = _0x41e73a['view'] === "episode";
      const _0x7cbfb8 = getStoryWorkspacePageTransitionDirection(_0x41e73a["view"], _0x41e73a["step"], _0x5e7c82);
      if (_0x5b2324) {
        _0x12bed6(_0x5e7c82);
      }
      _0x5e7c82 !== _0x41e73a["step"] && (_0x41e73a["episodeSelectionMode"] = ![], _0x41e73a["selectedEpisodeIds"] = [], _0x41e73a['clipSelectionMode'] = ![], _0x41e73a["selectedClipGenerationIds"] = [], _0x41e73a["characterVoicePanelMotion"] = '', _0x41e73a["pendingCharacterVoiceAssetId"] = '');
      _0x41e73a["pendingDeleteClipId"] = '';
      _0x41e73a['view'] = "project";
      _0x41e73a["step"] = _0x5e7c82;
      normalizeText(_0x30088b["assetFilter"]) && (_0x41e73a["assetFilter"] = normalizeText(_0x30088b['assetFilter']));
      normalizeText(_0x30088b["assetId"]) && (_0x41e73a["selectedAssetId"] = normalizeText(_0x30088b["assetId"]), _0x41e73a["characterVoiceEditor"] = null, _0x41e73a['characterVoicePanelMotion'] = '', _0x41e73a["pendingCharacterVoiceAssetId"] = '');
      if (normalizeText(_0x30088b["outlineSectionId"])) {
        const _0x4de8b2 = normalizeText(_0x30088b['outlineSectionId']);
        _0x41e73a["outlineSectionOpenState"] = {
          ...(_0x41e73a['outlineSectionOpenState'] || {}),
          ...(_0x4de8b2["startsWith"]('episode-') ? {
            'episodes': !![]
          } : {}),
          [_0x4de8b2]: !![]
        };
      }
      if (_0x5e7c82 === 0x2) {
        const _0x55af36 = (_0x41e73a["data"]?.['assets'] || [])["some"](_0x4e9ffb => normalizeText(_0x4e9ffb?.['id']) === normalizeText(_0x41e73a["selectedAssetId"]) && _0x4e9ffb?.["kind"] === _0x41e73a['assetFilter']);
        if (!_0x55af36) {
          const _0xbbe484 = (_0x41e73a["data"]?.["assets"] || [])["find"](_0x362a92 => _0x362a92["kind"] === _0x41e73a["assetFilter"]);
          _0x41e73a["selectedAssetId"] = _0xbbe484?.['id'] || '';
        }
        _0x41e73a["assetSelectionMode"] = ![];
        _0x41e73a["selectedAssetIds"] = [];
      }
      const _0x15f75c = _0x5b2324 ? ![] : _0xd367eb();
      const _0x51786f = await Promise['resolve'](renderAdapter["render"]({
        'direction': _0x7cbfb8,
        'updateToolbar': !_0x5b2324 && !_0x15f75c,
        'onTransitionComplete': _0x5b2324 ? () => _0x23a337(_0x158180, "go-to-step") : null
      }));
      if (_0x34040c || _0x158180 !== _0x1071a8) {
        return ![];
      }
      if (_0x51786f !== !![]) {
        throw new Error("story workspace page transition was interrupted");
      }
      onCommit();
      _0x25c21c(_0x158180);
      return !![];
    } catch (_0x3ad122) {
      return _0x2db7d0({
        'token': _0x158180,
        'snapshot': _0x33afd6,
        'operation': "go-to-step",
        'error': _0x3ad122,
        'message': '切换步骤失败，请重试。'
      });
    }
  }
  async function _0x387352(_0x4b0968, _0x4d0942 = '') {
    if (_0x34040c) {
      return ![];
    }
    const _0xcb665d = getStoryWorkspaceStepBlockMessage(_0x41e73a['data'], 0x3);
    if (_0xcb665d) {
      notify(_0xcb665d, "warn");
      return ![];
    }
    const _0x2b59f1 = (_0x41e73a["data"]?.["episodes"] || [])['find'](_0x49d2fd => normalizeText(_0x49d2fd?.['id']) === normalizeText(_0x4b0968));
    if (!_0x2b59f1) {
      return ![];
    }
    if (getStoryEpisodeGenerationControlState(_0x41e73a, _0x2b59f1['id'])['disabled']) {
      return ![];
    }
    if (!Array["isArray"](_0x2b59f1["clips"]) || !_0x2b59f1["clips"]["length"]) {
      return ![];
    }
    const {
      token: _0x46ded4,
      snapshot: _0x26eb9e
    } = _0x2ced62();
    try {
      const _0x40a981 = _0x41e73a["view"] !== "episode";
      const _0x5b8970 = _0x41e73a["view"] === "episode" && _0x41e73a["selectedEpisodeId"] !== _0x2b59f1['id'];
      renderAdapter["capturePageState"]?.();
      _0x41e73a["clipAdjustmentOpen"] = ![];
      _0x41e73a["clipAdjustmentInstruction"] = '';
      _0x41e73a["clipAdjustmentLanguage"] = '';
      _0x41e73a["clipAdjustmentLanguageOpen"] = ![];
      _0x41e73a['clipPromptHistoryOpen'] = ![];
      _0x41e73a["selectedEpisodeId"] = _0x2b59f1['id'];
      const _0x16c7b8 = _0x2b59f1["clips"]["find"](_0x587037 => normalizeText(_0x587037?.['id']) === normalizeText(_0x4d0942)) || _0x2b59f1["clips"][0x0];
      _0x41e73a['selectedClipId'] = _0x16c7b8?.['id'] || '';
      _0x41e73a["pendingDeleteClipId"] = '';
      _0x41e73a["clipSelectionMode"] = ![];
      _0x41e73a["selectedClipGenerationIds"] = [];
      onClipSelected(_0x16c7b8, {
        'episode': _0x2b59f1,
        'enteringEpisode': _0x40a981,
        'switchingEpisode': _0x5b8970
      });
      if (_0x5b8970) {
        renderAdapter["renderToolbar"]?.();
        await _0x239b47(_0x46ded4);
        if (_0x46ded4 !== _0x1071a8) {
          return ![];
        }
        if (_0x41e73a["view"] !== "episode" || _0x41e73a["selectedEpisodeId"] !== _0x2b59f1['id']) {
          throw new Error("story episode navigation was superseded");
        }
      }
      let _0x3d4a5b = ![];
      _0x40a981 && (renderAdapter['renderToolbar']?.(), _0x3d4a5b = _0x3f6c37());
      _0x41e73a["view"] = 'episode';
      const _0x514b88 = await Promise['resolve'](renderAdapter["render"]({
        'direction': "forward",
        'updateToolbar': !_0x3d4a5b && !_0x5b8970,
        'capturePageState': ![],
        'onTransitionComplete': _0x3d4a5b ? () => _0x23a337(_0x46ded4, "open-episode") : null
      }));
      if (_0x34040c || _0x46ded4 !== _0x1071a8) {
        return ![];
      }
      if (_0x514b88 !== !![]) {
        throw new Error('story\x20workspace\x20page\x20transition\x20was\x20interrupted');
      }
      onCommit();
      _0x25c21c(_0x46ded4);
      return !![];
    } catch (_0x11128a) {
      return _0x2db7d0({
        'token': _0x46ded4,
        'snapshot': _0x26eb9e,
        'operation': "open-episode",
        'error': _0x11128a,
        'message': "打开分集失败，请重试。"
      });
    }
  }
  function _0xf3710e(_0x3b671b = {}) {
    if (normalizeText(_0x3b671b["view"]) === "episode") {
      return _0x387352(_0x3b671b['episodeId'], _0x3b671b['clipId']);
    }
    if (normalizeText(_0x3b671b["view"]) === "project") {
      return _0x118634(_0x3b671b);
    }
    return Promise["resolve"](![]);
  }
  function _0x15a0f0() {
    _0x168d12();
    _0x34040c = !![];
    _0x1071a8 += 0x1;
    _0x14d7a2();
  }
  return {
    'navigate': _0xf3710e,
    'destroy': _0x15a0f0
  };
}