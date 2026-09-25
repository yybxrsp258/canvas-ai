import { clearRendererCache } from '../core/renderer.js';
import { captureBackgroundTaskCanvas } from './backgroundTaskCanvasSnapshot.js';
import { warmupCanvasVisibleMedia } from '../core/canvasMediaWarmup.js';
import { getCanvasMediaSchedulerStats } from './canvasMediaScheduler.js';
import { resetHistory } from './history.js';
import a1004_0x59ab0f, { createStore } from '../core/stores/appStore.js';
import { isGenerationTaskTerminalStatus } from '../core/generationTaskLifecycle.js';
import { handoffActiveGenerationTasks, hasActiveGenerationTasksForStore, restoreActiveGenerationTasks } from '../core/generationTaskRuntime.js';
import { startVideoThumbBackfill } from './videoThumbBackfill.js';
import { sanitizeMultiCanvasDataForPersistence } from '../utils/thumbnailPersistence.js';
import { createStableSignature } from '../utils/stableSignature.js';
import { flushAllPendingPromptHtmlCommits } from './nodePromptShared.js';
import { captureCanvasVisualSnapshot, captureCanvasVisualSnapshotFromElectron, hideCanvasVisualSnapshotOverlay, normalizeCanvasVisualSnapshot } from './canvasVisualSnapshot.js';
import { t } from '../i18n/index.js';
import { desktopBridge } from '../services/desktopBridge.js';
import { saveTextDownload } from '../services/downloadSaveService.js';
import { showContextMenu } from './interaction/contextMenuPresenter.js';
import { assertCanvasProjectSaveAllowed, normalizeCanvasProjectAccess } from '../services/canvasProjectAccess.js';
import { createCanvasProjectBadge } from '../components/sharedProjectIcon.js';
function canvasTabsText(_0x2376c0, _0x24fbe3 = {}) {
  return t("canvasTabs." + _0x2376c0, _0x24fbe3);
}
function markPerf(_0x29d6e7) {
  if (typeof performance?.["mark"] !== "function") {
    return;
  }
  performance['mark'](_0x29d6e7);
}
function measurePerf(_0x1ede88, _0x562b32, _0x36c79f) {
  if (typeof performance?.["measure"] !== "function") {
    return;
  }
  try {
    performance["measure"](_0x1ede88, _0x562b32, _0x36c79f);
  } catch {}
}
const CANVAS_MEDIA_WARMUP_OPEN_DELAY_MS = 0x15e;
const CANVAS_MEDIA_WARMUP_OPEN_MAX_JOBS = 0x60;
const CANVAS_MEDIA_WARMUP_SNAPSHOT_MAX_JOBS = 0x30;
const VISUAL_SNAPSHOT_BACKFILL_DELAYS_MS = [0x4b0, 0xbb8, 0x1b58, 0x36b0, 0x55f0];
const DENSE_VISUAL_SNAPSHOT_NODE_COUNT = 0x78;
const DENSE_VISUAL_SNAPSHOT_BACKFILL_DELAYS_MS = [0x2328, 0x4650, 0x7530, 0xafc8];
const VISUAL_SNAPSHOT_BACKFILL_RETRY_MS = 0x9c4;
const VISUAL_SNAPSHOT_INTERACTION_SETTLE_MS = 0x1f4;
function countCanvasNodes(_0x1664dc) {
  if (Array["isArray"](_0x1664dc)) {
    return _0x1664dc['length'];
  }
  if (_0x1664dc && typeof _0x1664dc === 'object') {
    return Object["keys"](_0x1664dc)['length'];
  }
  return 0x0;
}
function isChromeShellRuntime() {
  const _0x27b263 = String(globalThis["location"]?.["search"] || globalThis["window"]?.['location']?.["search"] || '');
  return new URLSearchParams(_0x27b263)["get"]('aicRuntime') === "chrome-shell";
}
function createEmptyCanvasSnapshot() {
  return {
    'nodes': [],
    'edges': [],
    'viewport': {
      'x': 0x0,
      'y': 0x0,
      'zoom': 1.1
    },
    'assets': [],
    'storyboard3dProjects': [],
    '_persistRevHint': 0x0,
    '_contentPersistRevHint': 0x0
  };
}
function cloneMultiDataSnapshot(_0x32f455) {
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(_0x32f455);
    } catch {}
  }
  try {
    return JSON["parse"](JSON["stringify"](_0x32f455));
  } catch {
    return {
      'canvases': [],
      'activeCanvasId': null
    };
  }
}
function isRecoverableTaskStatus(_0x5e8d8c) {
  const _0x20e5bc = String(_0x5e8d8c || '')["trim"]();
  return !_0x20e5bc || !isGenerationTaskTerminalStatus(_0x20e5bc);
}
function markRecoveringGenerationNode(_0x2ee44a) {
  if (!_0x2ee44a || typeof _0x2ee44a !== "object") {
    return _0x2ee44a;
  }
  if (!_0x2ee44a["generationStartTime"] || _0x2ee44a["generationDuration"] != null) {
    return _0x2ee44a;
  }
  const _0x49d20e = {
    ..._0x2ee44a
  };
  let _0x19f44f = ![];
  String(_0x49d20e['rhTaskId'] || '')["trim"]() && isRecoverableTaskStatus(_0x49d20e["rhTaskStatus"]) && (_0x49d20e["rhTaskRecovering"] = !![], _0x19f44f = !![]);
  String(_0x49d20e["dreaminaSubmitId"] || '')["trim"]() && isRecoverableTaskStatus(_0x49d20e["dreaminaTaskStatus"]) && isRecoverableTaskStatus(_0x49d20e["dreaminaTaskPhase"]) && (_0x49d20e["dreaminaTaskRecovering"] = !![], _0x19f44f = !![]);
  String(_0x49d20e["asyncTaskId"] || '')["trim"]() && isRecoverableTaskStatus(_0x49d20e["asyncTaskStatus"]) && (_0x49d20e["asyncTaskRecovering"] = !![], _0x19f44f = !![]);
  if (!_0x19f44f) {
    return _0x2ee44a;
  }
  _0x49d20e["isGenerating"] = !![];
  _0x49d20e["jobStatus"] = isRecoverableTaskStatus(_0x49d20e["jobStatus"]) ? "running" : _0x49d20e["jobStatus"];
  _0x49d20e["generationDuration"] = null;
  return _0x49d20e;
}
function markRecoveringGenerationSnapshot(_0xb6794e) {
  if (!_0xb6794e || typeof _0xb6794e !== 'object') {
    return _0xb6794e;
  }
  if (Array["isArray"](_0xb6794e["nodes"])) {
    return {
      ..._0xb6794e,
      'nodes': _0xb6794e["nodes"]['map'](_0x224ea3 => markRecoveringGenerationNode(_0x224ea3))
    };
  }
  if (_0xb6794e["nodes"] && typeof _0xb6794e["nodes"] === 'object') {
    return {
      ..._0xb6794e,
      'nodes': Object["fromEntries"](Object["entries"](_0xb6794e["nodes"])["map"](([_0x1d9849, _0x2570ae]) => [_0x1d9849, markRecoveringGenerationNode(_0x2570ae)]))
    };
  }
  return _0xb6794e;
}
function getCanvasNodesList(_0x37e571 = {}) {
  const _0x1b6bdc = _0x37e571?.["nodes"];
  if (Array["isArray"](_0x1b6bdc)) {
    return _0x1b6bdc;
  }
  if (_0x1b6bdc && typeof _0x1b6bdc === "object") {
    return Object["values"](_0x1b6bdc);
  }
  return [];
}
function hasLiveGenerationNode(_0x26e28a = {}) {
  if (!_0x26e28a || typeof _0x26e28a !== "object") {
    return ![];
  }
  if (_0x26e28a["isGenerating"] !== !![] || _0x26e28a["generationDuration"] != null) {
    return ![];
  }
  const _0x5b42f9 = [_0x26e28a["jobStatus"], _0x26e28a["rhTaskStatus"], _0x26e28a["dreaminaTaskStatus"], _0x26e28a['dreaminaTaskPhase'], _0x26e28a["asyncTaskStatus"], _0x26e28a["mediaTaskStatus"]];
  return !_0x5b42f9["some"](_0x21c24c => {
    const _0x492e8c = String(_0x21c24c || '')["trim"]()["toLowerCase"]();
    if (!_0x492e8c || _0x492e8c === "idle") {
      return ![];
    }
    return isGenerationTaskTerminalStatus(_0x492e8c);
  });
}
function canvasHasLiveGeneration(_0x3edecf = {}) {
  return getCanvasNodesList(_0x3edecf)["some"](_0x3c2a96 => hasLiveGenerationNode(_0x3c2a96));
}
export function buildTabsRenderSignature(_0x178f21 = [], _0x5961ea = null) {
  return (_0x5961ea || '') + '::' + (Array["isArray"](_0x178f21) ? _0x178f21 : [])['map'](_0x224ae5 => (_0x224ae5?.['id'] || '') + ':' + (_0x224ae5?.["name"] || ''))["join"]('|');
}
export function getCanvasTabScrollMetrics(_0xef8b7f = {}) {
  const _0x5df2b3 = Math["max"](0x0, Number(_0xef8b7f["scrollWidth"]) || 0x0);
  const _0x5d0a6b = Math["max"](0x0, Number(_0xef8b7f["clientWidth"]) || Number(_0xef8b7f["getBoundingClientRect"]?.()["width"]) || Number(_0xef8b7f["offsetWidth"]) || 0x0);
  const _0x37a754 = Math["max"](0x0, _0x5df2b3 - _0x5d0a6b);
  const _0x1ff9fb = Math["min"](_0x37a754, Math["max"](0x0, Number(_0xef8b7f["scrollLeft"]) || 0x0));
  return {
    'clientWidth': _0x5d0a6b,
    'maxScrollLeft': _0x37a754,
    'scrollLeft': _0x1ff9fb,
    'scrollWidth': _0x5df2b3
  };
}
export function scrollCanvasTabsWithWheel(_0xf2a679, _0x54ec71 = {}) {
  if (!_0xf2a679) {
    return ![];
  }
  const {
    clientWidth: _0x23068d,
    maxScrollLeft: _0x133a92,
    scrollLeft: _0x331713
  } = getCanvasTabScrollMetrics(_0xf2a679);
  if (_0x133a92 <= 0x1) {
    return ![];
  }
  const _0x58aae7 = Number(_0x54ec71["deltaX"]) || 0x0;
  const _0x271d6c = Number(_0x54ec71["deltaY"]) || 0x0;
  const _0x24084e = Math["abs"](_0x58aae7) > Math['abs'](_0x271d6c) && _0x58aae7 !== 0x0 ? _0x58aae7 : _0x271d6c;
  if (!_0x24084e) {
    return ![];
  }
  const _0x21fd85 = Number(_0x54ec71["deltaMode"]) || 0x0;
  const _0x1155cc = _0x21fd85 === 0x1 ? 0x10 : _0x21fd85 === 0x2 ? Math["max"](_0x23068d, 0x1) : 0x1;
  const _0x49fc24 = Math["min"](_0x133a92, Math["max"](0x0, _0x331713 + _0x24084e * _0x1155cc));
  if (_0x49fc24 === _0x331713) {
    return ![];
  }
  _0xf2a679['scrollLeft'] = _0x49fc24;
  _0x54ec71["preventDefault"]?.();
  return !![];
}
function normalizeCanvasProjectContext(_0xd86c29 = {}, _0x4d1d69 = {}) {
  const _0x208d0b = String(_0x4d1d69["canvasId"] || '')["trim"]();
  const _0x39ee3b = String(_0xd86c29["projectName"] || _0x4d1d69["projectName"] || '')['trim']();
  return {
    'projectId': String(_0xd86c29['projectId'] || _0x4d1d69["projectId"] || _0x208d0b)["trim"](),
    'filename': String(_0xd86c29['filename'] || '')["trim"](),
    'projectName': _0x39ee3b,
    'recentId': String(_0xd86c29['recentId'] || '')["trim"](),
    'displayPath': String(_0xd86c29['displayPath'] || '')["trim"](),
    'lastModified': Math['max'](0x0, Number(_0xd86c29["lastModified"] || 0x0) || 0x0),
    'isTemporary': _0xd86c29["isTemporary"] === !![],
    'workspaceProjectScoped': _0xd86c29["workspaceProjectScoped"] !== ![]
  };
}
function captureCurrentProjectContext(_0x1f8fe3 = {}) {
  if (typeof window === 'undefined') {
    return normalizeCanvasProjectContext({}, {
      'canvasId': _0x1f8fe3?.['id'],
      'projectName': _0x1f8fe3?.["name"]
    });
  }
  return normalizeCanvasProjectContext({
    'projectId': window["currentProjectId"],
    'filename': window['_v2CurrentFile'],
    'projectName': globalThis['document']?.['getElementById']?.('projectNameText')?.["textContent"] || _0x1f8fe3?.["name"],
    'recentId': window['_v2CurrentRecentProjectId'],
    'displayPath': window["_v2CurrentProjectDisplayPath"],
    'lastModified': window["_v2CurrentProjectLastModified"],
    'workspaceProjectScoped': window["_v2WorkspaceProjectScoped"] !== ![]
  }, {
    'canvasId': _0x1f8fe3?.['id'],
    'projectName': _0x1f8fe3?.["name"]
  });
}
const CanvasTabManager = {
  '_canvases': [],
  '_projectBadges': new Map(),
  '_activeId': null,
  '_projectContextByCanvasId': new Map(),
  '_lastPersistRevByCanvas': new Map(),
  '_lastContentPersistRevByCanvas': new Map(),
  '_savedSignatureByCanvas': new Map(),
  '_lastTabsRenderSignature': '',
  '_tabContainerBound': ![],
  '_visualSnapshotBackfillTimers': [],
  '_visualSnapshotIdleRetryTimer': null,
  '_visualSnapshotIdleRetryCanvasId': null,
  '_visualSnapshotBackfillCapturePromise': null,
  '_visualSnapshotBackfillGeneration': 0x0,
  '_visualSnapshotInteractionGuardDocument': null,
  '_visualSnapshotInteractionGuardHandlers': null,
  '_visualSnapshotActivePointers': new Set(),
  '_visualSnapshotSettleUntil': 0x0,
  '_mediaWarmupTimer': null,
  '_tabOverflowResizeObserver': null,
  '_taskSafeCanvasTransitionPromise': null,
  '_backgroundTaskStores': new Map(),
  '_showTaskTransitionBlocked'(_0x580f09, _0x254826 = "switchBlockedByTasks") {
    const _0x332a27 = Math["max"](0x1, Number(_0x580f09?.['blockers']?.["length"] || _0x580f09?.["activeCount"] || 0x0));
    window['showToast']?.(canvasTabsText(_0x254826, {
      'count': _0x332a27
    }), "warn");
  },
  async '_runTaskSafeCanvasTransition'(_0x24add7) {
    if ((await a1004_0x59ab0f["getGraphMutationPolicy"]?.()?.['beforeWorkspaceTransition']?.()) === ![]) {
      return ![];
    }
    if (this["_taskSafeCanvasTransitionPromise"]) {
      return this["_taskSafeCanvasTransitionPromise"];
    }
    const _0x39a0fc = (async () => {
      return _0x24add7();
    })();
    this["_taskSafeCanvasTransitionPromise"] = _0x39a0fc;
    try {
      return await _0x39a0fc;
    } finally {
      this['_taskSafeCanvasTransitionPromise'] === _0x39a0fc && (this["_taskSafeCanvasTransitionPromise"] = null);
    }
  },
  '_getStorePersistRev'() {
    return Number(a1004_0x59ab0f["getStateRaw"]()?.['_persistRev'] || 0x0);
  },
  '_getStoreContentPersistRev'() {
    return Number(a1004_0x59ab0f["getStateRaw"]()?.["_contentPersistRev"] || 0x0);
  },
  '_rememberCanvasPersistRev'(_0x2b68d4 = this["_activeId"]) {
    if (!_0x2b68d4) {
      return;
    }
    this["_lastPersistRevByCanvas"]["set"](_0x2b68d4, this["_getStorePersistRev"]());
    this["_lastContentPersistRevByCanvas"]["set"](_0x2b68d4, this['_getStoreContentPersistRev']());
  },
  '_scheduleWorkspaceCacheSave'() {
    return window["_triggerLocalCacheSave"]?.();
  },
  '_syncBackgroundTaskCanvas'(_0x250766, _0x25c7cd, {
    persist = !![],
    updatedNodeId: _0x3475b2
  } = {}) {
    const _0x2ccc1d = this['_canvases']["findIndex"](_0x801fef => _0x801fef['id'] === _0x250766);
    if (_0x2ccc1d === -0x1 || !_0x25c7cd) {
      return ![];
    }
    const _0x1f3db8 = captureBackgroundTaskCanvas(_0x25c7cd, this["_canvases"][_0x2ccc1d], _0x3475b2);
    const _0x52abfc = _0x1f3db8["snapshot"];
    const _0x2c2ba7 = Number(_0x25c7cd['getStateRaw']()?.['_persistRev'] || 0x0);
    const _0x4bd771 = Number(_0x25c7cd["getStateRaw"]()?.['_contentPersistRev'] || 0x0);
    const _0x34cd48 = this["_buildCanvasRecord"](this["_canvases"][_0x2ccc1d], _0x52abfc);
    _0x34cd48["_persistRevHint"] = _0x2c2ba7;
    _0x34cd48["_contentPersistRevHint"] = _0x4bd771;
    this["_canvases"][_0x2ccc1d] = _0x34cd48;
    _0x1f3db8["remember"](_0x34cd48);
    persist && (this["_scheduleWorkspaceCacheSave"](), this["_notifyDirtyStateChanged"]());
    return !![];
  },
  '_handoffActiveCanvasTasks'(_0x38764b = this["_activeId"]) {
    if (!_0x38764b || !hasActiveGenerationTasksForStore(a1004_0x59ab0f)) {
      return {
        'ok': !![],
        'movedCount': 0x0,
        'taskScopeId': _0x38764b || ''
      };
    }
    let _0x209306 = null;
    let _0x38963a = null;
    try {
      _0x209306 = createStore();
      _0x209306['hydrateTrustedSnapshot'](a1004_0x59ab0f["serialize"](), {
        'preserveLiveGeneration': !![]
      });
      _0x38963a = handoffActiveGenerationTasks({
        'sourceStore': a1004_0x59ab0f,
        'targetStore': _0x209306,
        'taskScopeId': _0x38764b,
        'mirrorTaskState': ({
          updatedNodeId: _0x126180
        } = {}) => this['_syncBackgroundTaskCanvas'](_0x38764b, _0x209306, {
          'persist': !![],
          'updatedNodeId': _0x126180
        })
      });
      _0x38963a["movedCount"] > 0x0 && (this["_backgroundTaskStores"]["set"](_0x38764b, _0x209306), this["_syncBackgroundTaskCanvas"](_0x38764b, _0x209306, {
        'persist': ![]
      }));
      return _0x38963a;
    } catch (_0x3c34bf) {
      restoreActiveGenerationTasks({
        'taskScopeId': _0x38764b,
        'targetStore': a1004_0x59ab0f
      });
      this["_backgroundTaskStores"]['delete'](_0x38764b);
      console['error']("[CanvasTabManager] Failed to hand off active generation tasks:", _0x3c34bf);
      return {
        'ok': ![],
        'movedCount': 0x0,
        'activeCount': Number(_0x38963a?.["movedCount"] || 0x1),
        'taskScopeId': _0x38764b,
        'blockers': [{
          'reason': 'background-store-handoff-failed',
          'error': _0x3c34bf
        }]
      };
    }
  },
  '_restoreActiveCanvasTasks'(_0x22273e = this["_activeId"]) {
    const _0x147786 = restoreActiveGenerationTasks({
      'taskScopeId': _0x22273e,
      'targetStore': a1004_0x59ab0f
    });
    this["_backgroundTaskStores"]["delete"](_0x22273e);
    return _0x147786;
  },
  '_scheduleWorkspaceMetaCacheSave'() {
    return window["_triggerLocalCacheMetaSave"]?.() ?? window["_triggerLocalCacheSave"]?.();
  },
  '_markCanvasMetaDirty'() {
    return this["_scheduleWorkspaceMetaCacheSave"]();
  },
  '_notifyDirtyStateChanged'() {
    if (typeof window === 'undefined' || typeof window['dispatchEvent'] !== "function") {
      return;
    }
    if (typeof CustomEvent === "function") {
      window["dispatchEvent"](new CustomEvent("aicanvas:dirty-state-changed"));
      return;
    }
    typeof Event === 'function' && window["dispatchEvent"](new Event("aicanvas:dirty-state-changed"));
  },
  '_notifyActiveCanvasChanged'(_0x5ba0b4 = 'switch') {
    const _0x38fb82 = this["_activeId"] || '';
    if (!_0x38fb82 || typeof window === "undefined" || typeof window['dispatchEvent'] !== "function") {
      return;
    }
    const _0x2452e0 = {
      'canvasId': _0x38fb82,
      'reason': _0x5ba0b4,
      'projectContext': this["getCanvasProjectContext"](_0x38fb82)
    };
    if (typeof CustomEvent === "function") {
      window["dispatchEvent"](new CustomEvent('aicanvas:active-canvas-changed', {
        'detail': _0x2452e0
      }));
      return;
    }
    if (typeof Event === "function") {
      const _0x289eee = new Event("aicanvas:active-canvas-changed");
      _0x289eee["detail"] = _0x2452e0;
      window["dispatchEvent"](_0x289eee);
    }
  },
  '_applyActiveCanvasProjectContext'() {
    if (typeof window === "undefined") {
      return ![];
    }
    const _0x4f8b61 = this["getCanvasProjectContext"]();
    if (!_0x4f8b61) {
      return ![];
    }
    window["currentProjectId"] = _0x4f8b61["projectId"];
    window['_v2CurrentFile'] = _0x4f8b61["filename"];
    window["_v2CurrentRecentProjectId"] = _0x4f8b61["recentId"];
    window["_v2CurrentProjectDisplayPath"] = _0x4f8b61["displayPath"];
    window["_v2CurrentProjectLastModified"] = _0x4f8b61["lastModified"];
    window["_v2WorkspaceProjectScoped"] = _0x4f8b61["workspaceProjectScoped"];
    const _0x42c2d5 = globalThis["document"]?.["getElementById"]?.("projectNameText");
    if (_0x42c2d5) {
      _0x42c2d5["textContent"] = _0x4f8b61["projectName"] || this["_canvases"]["find"](_0x46d034 => _0x46d034?.['id'] === this["_activeId"])?.["name"] || '';
      _0x42c2d5["parentElement"]?.["querySelector"]?.(".canvas-project-badge")?.['remove']();
      const _0x51a79c = this["getCanvasProjectAccess"]();
      const _0x40d3f8 = createCanvasProjectBadge(_0x51a79c);
      if (_0x40d3f8) {
        _0x42c2d5["before"]?.(_0x40d3f8);
      }
    }
    return !![];
  },
  'setCanvasProjectContext'(_0x34c238, _0x320d34 = {}, {
    persist = !![]
  } = {}) {
    const _0x3816f4 = this["_canvases"]["find"](_0x24aebf => _0x24aebf?.['id'] === _0x34c238);
    if (!_0x3816f4) {
      return null;
    }
    const _0x1bf110 = normalizeCanvasProjectContext(_0x320d34, {
      'canvasId': _0x34c238,
      'projectName': _0x3816f4['name']
    });
    this["_projectContextByCanvasId"]["set"](_0x34c238, _0x1bf110);
    _0x34c238 === this["_activeId"] && (this["_applyActiveCanvasProjectContext"](), this['_notifyActiveCanvasChanged']("context"));
    persist && this["_markCanvasMetaDirty"]();
    return {
      ..._0x1bf110
    };
  },
  'getCanvasProjectContext'(_0x21d6ea = this["_activeId"]) {
    const _0x56b55c = this["_projectContextByCanvasId"]['get'](_0x21d6ea);
    return _0x56b55c ? {
      ..._0x56b55c
    } : null;
  },
  'findCanvasIdByProjectIdentity'(_0x2b274d = {}) {
    const _0x3356a7 = (_0x370c2b, {
      path = ![]
    } = {}) => {
      const _0x48d885 = String(_0x370c2b || '')["trim"]()['toLowerCase']();
      return path ? _0x48d885["replace"](/\\/g, '/') : _0x48d885;
    };
    const _0x1d2137 = _0x3356a7(_0x2b274d["projectName"]);
    const _0x3098a5 = [["recentId", _0x3356a7(_0x2b274d['recentId'])], ["displayPath", _0x3356a7(_0x2b274d['displayPath'], {
      'path': !![]
    })], ['filename', _0x3356a7(_0x2b274d["filename"], {
      'path': !![]
    })], ["projectId", _0x3356a7(_0x2b274d['projectId'])]]["filter"](([, _0x2f5417]) => _0x2f5417);
    for (const [_0x2059f7, _0xb36cc0] of _0x3098a5) {
      const _0x5e58eb = [];
      for (const _0x5c8f7e of this["_canvases"]) {
        const _0x1d8dc4 = this['_projectContextByCanvasId']["get"](_0x5c8f7e?.['id']);
        if (!_0x1d8dc4) {
          continue;
        }
        const _0x5302f4 = _0x3356a7(_0x1d8dc4[_0x2059f7], {
          'path': _0x2059f7 === "displayPath" || _0x2059f7 === "filename"
        });
        _0x5302f4 === _0xb36cc0 && _0x5e58eb["push"]({
          'canvas': _0x5c8f7e,
          'context': _0x1d8dc4
        });
      }
      if (_0x5e58eb["length"] === 0x0) {
        continue;
      }
      if (_0x1d2137) {
        const _0xd800b9 = _0x5e58eb["find"](({
          canvas: _0x51620f
        }) => _0x3356a7(_0x51620f?.["name"]) === _0x1d2137) || _0x5e58eb["find"](({
          context: _0xc3939c
        }) => _0x3356a7(_0xc3939c?.["projectName"]) === _0x1d2137);
        if (_0xd800b9) {
          return _0xd800b9['canvas']['id'];
        }
      }
      return _0x5e58eb[0x0]["canvas"]['id'];
    }
    if (_0x1d2137) {
      const _0x151295 = this['_canvases']['filter'](_0x5e7628 => _0x3356a7(_0x5e7628?.["name"]) === _0x1d2137);
      if (_0x151295["length"] === 0x1) {
        return _0x151295[0x0]['id'];
      }
    }
    return '';
  },
  '_getTabsRenderSignature'() {
    return buildTabsRenderSignature(this["_canvases"], this["_activeId"]) + this["_canvases"]['map'](_0x46eb7d => this["_projectBadges"]["get"](_0x46eb7d['id']) || '')['join'](':');
  },
  'getCanvasProjectAccess'(_0xd858f2 = this["_activeId"]) {
    const _0x5388bc = normalizeCanvasProjectAccess(this["_canvases"]["find"](_0x2a137d => _0x2a137d['id'] === _0xd858f2)?.['projectAccess']);
    return _0x5388bc ? {
      ..._0x5388bc,
      'badge': this["_projectBadges"]["get"](_0xd858f2) || ''
    } : null;
  },
  'setCanvasProjectAccess'(_0x43a3e2, _0x51cb22) {
    const _0x484a7d = this['_canvases']["find"](_0x54e4b8 => _0x54e4b8['id'] === _0x43a3e2);
    if (!_0x484a7d) {
      return;
    }
    const _0x16c897 = normalizeCanvasProjectAccess(_0x51cb22);
    if (_0x16c897?.["badge"]) {
      this["_projectBadges"]["set"](_0x43a3e2, _0x16c897["badge"]);
    } else {
      this['_projectBadges']["delete"](_0x43a3e2);
    }
    const _0x4221d2 = _0x16c897 ? {
      ..._0x16c897,
      'badge': ''
    } : null;
    JSON['stringify'](_0x484a7d["projectAccess"]) !== JSON["stringify"](_0x4221d2) && (_0x484a7d['projectAccess'] = _0x4221d2, this["_markCanvasMetaDirty"]());
    this["renderTabs"]();
    if (_0x43a3e2 === this["_activeId"]) {
      this['_applyActiveCanvasProjectContext']();
    }
  },
  '_buildCanvasStructureDigest'(_0x21a39a, _0x20ece7) {
    const _0x4da48c = Array["isArray"](_0x21a39a) ? _0x21a39a : _0x21a39a && typeof _0x21a39a === "object" ? Object['values'](_0x21a39a) : [];
    let _0x2b201a = '' + _0x4da48c["length"];
    for (const _0x2077ba of _0x4da48c) {
      if (!_0x2077ba || typeof _0x2077ba !== "object") {
        continue;
      }
      _0x2b201a += '|';
      for (const _0x1064b3 of _0x20ece7) {
        _0x2b201a += String(_0x2077ba[_0x1064b3] ?? '') + ',';
      }
    }
    return _0x2b201a;
  },
  '_buildCanvasSavedSignature'(_0xde241f) {
    const _0x3dcc49 = _0xde241f?.["viewport"] && typeof _0xde241f["viewport"] === "object" ? _0xde241f['viewport'] : {
      'x': 0x0,
      'y': 0x0,
      'zoom': 1.1
    };
    const _0x4b5883 = Number["isFinite"](_0xde241f?.["_persistRevHint"]) ? Number(_0xde241f['_persistRevHint']) : 0x0;
    return createStableSignature({
      'id': _0xde241f?.['id'] ?? null,
      'name': _0xde241f?.['name'] ?? "未命名画布",
      'persistRevHint': _0x4b5883,
      'viewport': {
        'x': Number(_0x3dcc49['x']) || 0x0,
        'y': Number(_0x3dcc49['y']) || 0x0,
        'zoom': Number(_0x3dcc49["zoom"]) || 1.1
      },
      'nodes': this['_buildCanvasStructureDigest'](_0xde241f?.['nodes'], ['id', "type", 'x', 'y', 'width', "height", "parentId"]),
      'edges': this["_buildCanvasStructureDigest"](_0xde241f?.["edges"], ['id', "sourceId", 'targetId']),
      'assets': this["_buildCanvasStructureDigest"](_0xde241f?.["assets"], ['id', "type", 'localPath']),
      'storyboard3dProjects': this["_buildCanvasStructureDigest"](_0xde241f?.["storyboard3dProjects"], ['id', "name", "updatedAt"])
    });
  },
  '_resetSavedCanvasSignatures'({
    markClean = !![]
  } = {}) {
    this["_savedSignatureByCanvas"] = new Map();
    if (!markClean) {
      return;
    }
    this["_canvases"]["forEach"](_0x1686be => {
      if (!_0x1686be?.['id']) {
        return;
      }
      this["_savedSignatureByCanvas"]["set"](_0x1686be['id'], this["_buildCanvasSavedSignature"](_0x1686be));
    });
  },
  '_removeTabContextMenu'() {
    this["_tabContextMenuSession"]?.["close"]?.({
      'restoreFocus': ![]
    });
    this["_tabContextMenuSession"] = null;
    document['getElementById']('tab-context-menu')?.['remove']();
  },
  '_startTabRename'(_0x37572b) {
    if (!_0x37572b) {
      return;
    }
    _0x37572b["contentEditable"] = "true";
    _0x37572b["focus"]();
    const _0x520188 = document["createRange"]();
    _0x520188["selectNodeContents"](_0x37572b);
    const _0x4a118 = window["getSelection"]?.();
    if (!_0x4a118) {
      return;
    }
    _0x4a118["removeAllRanges"]();
    _0x4a118['addRange'](_0x520188);
  },
  '_commitTabRename'(_0x34f982, {
    deferRender = ![]
  } = {}) {
    if (!_0x34f982) {
      return;
    }
    const _0x354b84 = _0x34f982["closest"](".canvas-tab");
    const _0x457f0a = _0x354b84?.['dataset']?.['id'];
    if (!_0x457f0a) {
      return;
    }
    const _0x22aef8 = this["_canvases"]["find"](_0x179493 => _0x179493['id'] === _0x457f0a);
    if (!_0x22aef8) {
      return;
    }
    const _0x5cd34e = _0x22aef8["name"];
    const _0x1c3fda = String(_0x34f982['textContent'] || '')["trim"]();
    _0x34f982["contentEditable"] = "false";
    this["renameCanvas"](_0x457f0a, _0x1c3fda);
    _0x34f982["textContent"] = this["_canvases"]["find"](_0x4bf24d => _0x4bf24d['id'] === _0x457f0a)?.["name"] || _0x5cd34e;
    if (deferRender) {
      window["setTimeout"](() => this['renderTabs'](), 0x0);
      return;
    }
    this["renderTabs"]();
  },
  '_bindTabContainerEvents'(_0x5b69da) {
    if (this["_tabContainerBound"] || !_0x5b69da) {
      return;
    }
    this["_tabContainerBound"] = !![];
    let _0x3ebe56 = '';
    let _0x446203 = 0x0;
    const _0x422c9f = _0x3bb213 => {
      const _0xcec7f1 = _0x3bb213["target"]["closest"]('.canvas-tab');
      if (!_0xcec7f1 || !_0x5b69da['contains'](_0xcec7f1)) {
        return '';
      }
      return _0xcec7f1["dataset"]['id'] || '';
    };
    const _0xfc6bf5 = _0x9d406 => {
      if (_0x9d406["button"] !== 0x1) {
        return ![];
      }
      const _0x171cce = _0x422c9f(_0x9d406);
      if (!_0x171cce) {
        return ![];
      }
      _0x9d406["preventDefault"]();
      _0x9d406["stopPropagation"]();
      _0x3ebe56 = _0x171cce;
      _0x446203 = Date["now"]();
      void this["deleteCanvas"](_0x171cce);
      return !![];
    };
    _0x5b69da["addEventListener"]("click", _0x15a0a7 => {
      const _0x573a6e = _0x15a0a7["target"]["closest"]('.canvas-tab');
      if (!_0x573a6e || !_0x5b69da['contains'](_0x573a6e)) {
        return;
      }
      const _0x14ab25 = _0x573a6e["dataset"]['id'];
      if (!_0x14ab25) {
        return;
      }
      const _0x49ff29 = this["_canvases"]['find'](_0x18a569 => _0x18a569['id'] === _0x14ab25);
      if (!_0x49ff29) {
        return;
      }
      const _0x259118 = _0x15a0a7["target"]["closest"](".canvas-tab-close");
      if (_0x259118) {
        _0x15a0a7["stopPropagation"]();
        void this["deleteCanvas"](_0x14ab25);
        return;
      }
      const _0x598950 = _0x573a6e["querySelector"](".canvas-tab-name");
      const _0x24a671 = _0x14ab25 === this["_activeId"];
      if (_0x24a671) {
        if (_0x598950?.['contentEditable'] === "true") {
          return;
        }
        this["_startTabRename"](_0x598950);
        return;
      }
      this['switchTo'](_0x14ab25);
    });
    _0x5b69da["addEventListener"]("pointerdown", _0x1756d9 => {
      _0xfc6bf5(_0x1756d9);
    });
    _0x5b69da["addEventListener"]("auxclick", _0x35baff => {
      if (_0x35baff["button"] !== 0x1) {
        return;
      }
      const _0x379e6b = _0x422c9f(_0x35baff);
      if (!_0x379e6b) {
        return;
      }
      _0x35baff["preventDefault"]();
      _0x35baff['stopPropagation']();
      if (_0x379e6b === _0x3ebe56 && Date["now"]() - _0x446203 < 0x320) {
        return;
      }
      _0x3ebe56 = _0x379e6b;
      _0x446203 = Date["now"]();
      void this["deleteCanvas"](_0x379e6b);
    });
    _0x5b69da["addEventListener"]("contextmenu", async _0x8ea2c1 => {
      const _0xf7fe7 = _0x8ea2c1['target']["closest"](".canvas-tab");
      if (!_0xf7fe7 || !_0x5b69da["contains"](_0xf7fe7)) {
        return;
      }
      const _0x28ea83 = _0xf7fe7["dataset"]['id'];
      if (!_0x28ea83) {
        return;
      }
      const _0x21fe8e = this["_canvases"]["find"](_0x7b086c => _0x7b086c['id'] === _0x28ea83);
      if (!_0x21fe8e) {
        return;
      }
      _0x8ea2c1['preventDefault']();
      _0x8ea2c1['stopPropagation']();
      const _0x40143a = () => {
        this["_showTabContextMenu"](_0x21fe8e, {
          'clientX': _0x8ea2c1["clientX"],
          'clientY': _0x8ea2c1['clientY']
        });
      };
      _0x28ea83 !== this['_activeId'] && (await this["switchTo"](_0x28ea83));
      _0x40143a();
    });
    _0x5b69da['addEventListener']("focusout", _0x302fdf => {
      const _0x265ed6 = _0x302fdf["target"]["closest"](".canvas-tab-name");
      if (!_0x265ed6 || !_0x5b69da["contains"](_0x265ed6)) {
        return;
      }
      if (_0x265ed6["contentEditable"] !== "true") {
        return;
      }
      this['_commitTabRename'](_0x265ed6, {
        'deferRender': !![]
      });
    });
    _0x5b69da["addEventListener"]("keydown", _0x3380cf => {
      const _0x1c1dd2 = _0x3380cf["target"]["closest"](".canvas-tab-name");
      if (!_0x1c1dd2 || !_0x5b69da['contains'](_0x1c1dd2)) {
        return;
      }
      if (_0x1c1dd2['contentEditable'] !== 'true') {
        return;
      }
      if (_0x3380cf['key'] === "Enter") {
        _0x3380cf["preventDefault"]();
        _0x1c1dd2["blur"]();
        return;
      }
      if (_0x3380cf["key"] === "Escape") {
        _0x3380cf["preventDefault"]();
        const _0x2d4865 = _0x1c1dd2["closest"]('.canvas-tab')?.["dataset"]?.['id'];
        const _0x517bb8 = this["_canvases"]['find'](_0x5b374d => _0x5b374d['id'] === _0x2d4865);
        if (_0x517bb8) {
          _0x1c1dd2["textContent"] = _0x517bb8["name"];
        }
        _0x1c1dd2["blur"]();
      }
    });
    _0x5b69da["addEventListener"]('scroll', () => this["_updateTabScrollHints"](_0x5b69da), {
      'passive': !![]
    });
    _0x5b69da["addEventListener"]("wheel", _0x555a0e => {
      _0x555a0e['stopPropagation']?.();
      scrollCanvasTabsWithWheel(_0x5b69da, _0x555a0e) && this["_updateTabScrollHints"](_0x5b69da);
    }, {
      'passive': ![]
    });
    const _0x435b48 = globalThis['ResizeObserver'];
    if (typeof _0x435b48 === "function") {
      this["_tabOverflowResizeObserver"]?.["disconnect"]?.();
      this["_tabOverflowResizeObserver"] = new _0x435b48(() => {
        this["_updateTabScrollHints"](_0x5b69da);
      });
      this['_tabOverflowResizeObserver']["observe"](_0x5b69da);
      const _0xbcdc73 = this["_getTabScrollShell"](_0x5b69da);
      _0xbcdc73 && _0xbcdc73 !== _0x5b69da && this["_tabOverflowResizeObserver"]["observe"](_0xbcdc73);
    }
    this["_updateTabScrollHints"](_0x5b69da);
  },
  '_getTabScrollShell'(_0x43ce18) {
    return _0x43ce18?.["closest"]?.(".canvas-tabs-wrap") || globalThis["document"]?.['getElementById']?.("canvasTabsWrap") || null;
  },
  '_updateTabScrollHints'(_0x562dc2) {
    const _0x4f51d5 = this['_getTabScrollShell'](_0x562dc2);
    if (!_0x4f51d5?.["classList"]) {
      return;
    }
    const {
      maxScrollLeft: _0x2c13be,
      scrollLeft: _0x59ffc6
    } = getCanvasTabScrollMetrics(_0x562dc2);
    const _0x5d05be = _0x2c13be > 0x1;
    _0x4f51d5["classList"]["toggle"]("has-overflow", _0x5d05be);
    _0x4f51d5["classList"]["toggle"]("has-left-fade", _0x5d05be && _0x59ffc6 > 0x1);
    _0x4f51d5["classList"]["toggle"]("has-right-fade", _0x5d05be && _0x59ffc6 < _0x2c13be - 0x1);
  },
  '_revealActiveTab'(_0x3b3d7b) {
    const _0xa1902a = _0x3b3d7b?.['querySelector']?.(".canvas-tab.active");
    _0xa1902a?.["scrollIntoView"]?.({
      'behavior': 'auto',
      'block': "nearest",
      'inline': "nearest"
    });
  },
  '_showTabContextMenu'(_0x137235, {
    clientX = 0x0,
    clientY = 0x0
  } = {}) {
    if (!_0x137235) {
      return;
    }
    this["_removeTabContextMenu"]();
    const _0x3bcabf = [{
      'label': canvasTabsText("contextMenu.save"),
      'icon': "save",
      'shortcutActionId': 'save',
      'action': () => {
        window['_v2SaveProject']?.(_0x137235["name"], {
          'canvasId': _0x137235['id']
        });
      }
    }, {
      'label': canvasTabsText("contextMenu.saveAs"),
      'icon': "save-as",
      'shortcutActionId': "context-canvas-tab-save-as",
      'action': async () => {
        try {
          assertCanvasProjectSaveAllowed({
            'canvases': [_0x137235]
          }, this);
        } catch (_0x506075) {
          window["showToast"]?.(_0x506075["message"], 'warn');
          return;
        }
        if (desktopBridge['project']["isAvailable"]() && typeof window["_v2SaveProjectAsLocal"] === "function") {
          window['_v2SaveProjectAsLocal']({
            'canvasId': _0x137235['id']
          });
          return;
        }
        const _0xd6b068 = this["getMultiDataSnapshot"]({
          'sanitizeForPersistence': !![]
        }) || {};
        const _0x6054a7 = Array["isArray"](_0xd6b068["canvases"]) ? _0xd6b068["canvases"] : [];
        const _0x34fa26 = _0x6054a7["find"](_0x4f93d8 => String(_0x4f93d8?.['id'] || '') === String(_0x137235['id'] || '')) || _0x137235;
        const _0x412fd1 = {
          ..._0xd6b068,
          'canvases': _0x34fa26 ? [_0x34fa26] : [],
          'activeCanvasId': _0x34fa26?.['id'] || _0x137235['id'] || null
        };
        const _0x458369 = _0x137235["name"] + '.aicanvas';
        const _0x4233d4 = await saveTextDownload({
          'filename': _0x458369,
          'content': JSON["stringify"](_0x412fd1, null, 0x2),
          'mimeType': "application/json",
          'filterName': "Canvas AI Project"
        });
        if (_0x4233d4?.["canceled"]) {
          return;
        }
        window["showToast"]?.(canvasTabsText("downloadedWorkflow", {
          'filename': _0x458369
        }));
      }
    }];
    typeof window['_v2ExportCurrentProjectPackage'] === "function" && _0x3bcabf["push"]({
      'label': canvasTabsText("contextMenu.collectProject"),
      'icon': "package-export",
      'shortcutActionId': "context-canvas-tab-collect-project",
      'action': () => {
        window['_v2ExportCurrentProjectPackage']({
          'canvasId': _0x137235['id'],
          'projectName': _0x137235["name"]
        });
      }
    });
    _0x3bcabf["push"]("sep", {
      'label': canvasTabsText("contextMenu.delete"),
      'icon': "delete",
      'danger': !![],
      'shortcutActionId': "context-canvas-tab-delete",
      'action': () => void this["deleteCanvas"](_0x137235['id'])
    });
    this["_tabContextMenuSession"] = showContextMenu(clientX, clientY, _0x3bcabf, {
      'className': "v2-canvas-ctx-menu canvas-tab-context-menu",
      'ensureItemIcons': !![],
      'restoreTarget': document["querySelector"]?.(".canvas-tab[data-id=\"" + (globalThis["CSS"]?.["escape"]?.(String(_0x137235['id'])) || String(_0x137235['id'])) + '\x22]'),
      'onClose': () => {
        this["_tabContextMenuSession"] = null;
      }
    });
    this['_tabContextMenuSession']["menu"]['id'] = "tab-context-menu";
  },
  '_clearCanvasSurface'() {
    clearRendererCache();
    const _0x205e16 = document["getElementById"]("v2-canvas");
    if (!_0x205e16) {
      return;
    }
    Array['from'](_0x205e16['children'])["forEach"](_0x4b1cae => {
      if (_0x4b1cae['classList']["contains"]('v2-node')) {
        _0x4b1cae["remove"]();
      }
    });
  },
  '_buildCanvasRecord'(_0x4d4ec3 = {}, _0x474536 = {}) {
    const _0x10d011 = createEmptyCanvasSnapshot();
    const _0x4896f9 = Number["isFinite"](_0x4d4ec3?.['_persistRevHint']) ? _0x4d4ec3['_persistRevHint'] : Number["isFinite"](_0x474536?.['_persistRevHint']) ? _0x474536['_persistRevHint'] : _0x10d011['_persistRevHint'];
    const _0x22f8d5 = Number["isFinite"](_0x4d4ec3?.["_contentPersistRevHint"]) ? _0x4d4ec3["_contentPersistRevHint"] : Number["isFinite"](_0x474536?.["_contentPersistRevHint"]) ? _0x474536["_contentPersistRevHint"] : _0x10d011['_contentPersistRevHint'];
    return {
      ..._0x4d4ec3,
      ...(_0x4d4ec3["projectAccess"] ? {
        'projectAccess': {
          ...normalizeCanvasProjectAccess(_0x4d4ec3["projectAccess"]),
          'badge': ''
        }
      } : {}),
      'nodes': Array['isArray'](_0x474536?.["nodes"]) ? _0x474536["nodes"] : _0x474536?.["nodes"] && typeof _0x474536["nodes"] === "object" ? _0x474536["nodes"] : _0x10d011["nodes"],
      'edges': Array["isArray"](_0x474536?.["edges"]) ? _0x474536["edges"] : _0x474536?.["edges"] && typeof _0x474536["edges"] === "object" ? _0x474536["edges"] : _0x10d011["edges"],
      'viewport': _0x474536?.["viewport"] && typeof _0x474536["viewport"] === "object" ? {
        ..._0x474536['viewport']
      } : {
        ..._0x10d011["viewport"]
      },
      'assets': Array['isArray'](_0x474536?.["assets"]) ? _0x474536["assets"] : _0x10d011["assets"],
      'storyboard3dProjects': Array["isArray"](_0x474536?.["storyboard3dProjects"]) ? _0x474536["storyboard3dProjects"] : _0x10d011["storyboard3dProjects"],
      'visualSnapshot': normalizeCanvasVisualSnapshot(_0x474536?.['visualSnapshot']) || normalizeCanvasVisualSnapshot(_0x4d4ec3?.["visualSnapshot"]) || null,
      '_persistRevHint': _0x4896f9,
      '_contentPersistRevHint': _0x22f8d5
    };
  },
  '_clearVisualSnapshotBackfillTimers'() {
    for (const _0x13bbb4 of this["_visualSnapshotBackfillTimers"] || []) {
      clearTimeout(_0x13bbb4);
    }
    this["_visualSnapshotBackfillTimers"] = [];
    this["_clearVisualSnapshotIdleRetryTimer"]();
  },
  '_clearVisualSnapshotIdleRetryTimer'() {
    this["_visualSnapshotIdleRetryTimer"] !== null && clearTimeout(this["_visualSnapshotIdleRetryTimer"]);
    this["_visualSnapshotIdleRetryTimer"] = null;
    this["_visualSnapshotIdleRetryCanvasId"] = null;
  },
  '_getVisualSnapshotNow'() {
    return Date["now"]();
  },
  '_holdVisualSnapshotCaptureAfterInteraction'() {
    this["_visualSnapshotSettleUntil"] = Math['max'](Number(this["_visualSnapshotSettleUntil"]) || 0x0, this["_getVisualSnapshotNow"]() + VISUAL_SNAPSHOT_INTERACTION_SETTLE_MS);
  },
  '_invalidateVisualSnapshotBackfillCapture'() {
    this["_visualSnapshotBackfillGeneration"] = (Number(this["_visualSnapshotBackfillGeneration"]) || 0x0) + 0x1;
    return this["_visualSnapshotBackfillGeneration"];
  },
  '_deferVisualSnapshotBackfillAfterInteraction'() {
    this['_holdVisualSnapshotCaptureAfterInteraction']();
    this["_invalidateVisualSnapshotBackfillCapture"]();
    this['_clearVisualSnapshotBackfillTimers']();
    this['_activeId'] && this["_scheduleVisualSnapshotIdleRetry"](this["_activeId"]);
  },
  '_bindVisualSnapshotInteractionGuard'() {
    const _0x3d590d = typeof document !== 'undefined' ? document : null;
    if (!_0x3d590d || typeof _0x3d590d["addEventListener"] !== 'function') {
      return;
    }
    if (this['_visualSnapshotInteractionGuardDocument'] === _0x3d590d) {
      return;
    }
    const _0x6549c = this['_visualSnapshotInteractionGuardDocument'];
    const _0x4a5282 = this["_visualSnapshotInteractionGuardHandlers"];
    _0x6549c && _0x4a5282 && (_0x6549c["removeEventListener"]?.('pointerdown', _0x4a5282['pointerdown'], !![]), _0x6549c['removeEventListener']?.("pointerup", _0x4a5282['pointerup'], !![]), _0x6549c["removeEventListener"]?.('pointercancel', _0x4a5282['pointercancel'], !![]), _0x6549c['removeEventListener']?.("wheel", _0x4a5282["wheel"], !![]));
    this["_visualSnapshotActivePointers"] = new Set();
    const _0xc56ae8 = _0x1fb86f => Number["isFinite"](_0x1fb86f?.["pointerId"]) ? _0x1fb86f["pointerId"] : "primary";
    const _0x39fd08 = {
      'pointerdown': _0x14489a => {
        this["_visualSnapshotActivePointers"]["add"](_0xc56ae8(_0x14489a));
        this["_deferVisualSnapshotBackfillAfterInteraction"]();
      },
      'pointerup': _0x2e8d27 => {
        this["_visualSnapshotActivePointers"]["delete"](_0xc56ae8(_0x2e8d27));
        this["_deferVisualSnapshotBackfillAfterInteraction"]();
      },
      'pointercancel': _0x4bb483 => {
        this["_visualSnapshotActivePointers"]["delete"](_0xc56ae8(_0x4bb483));
        this["_deferVisualSnapshotBackfillAfterInteraction"]();
      },
      'wheel': () => {
        this["_deferVisualSnapshotBackfillAfterInteraction"]();
      }
    };
    _0x3d590d["addEventListener"]("pointerdown", _0x39fd08["pointerdown"], !![]);
    _0x3d590d["addEventListener"]("pointerup", _0x39fd08["pointerup"], !![]);
    _0x3d590d["addEventListener"]("pointercancel", _0x39fd08["pointercancel"], !![]);
    _0x3d590d["addEventListener"]("wheel", _0x39fd08["wheel"], {
      'capture': !![],
      'passive': !![]
    });
    this['_visualSnapshotInteractionGuardDocument'] = _0x3d590d;
    this["_visualSnapshotInteractionGuardHandlers"] = _0x39fd08;
  },
  '_getActiveCanvasNodeCount'() {
    const _0x4ec14a = this['_canvases']["find"](_0x1b4e4b => _0x1b4e4b['id'] === this["_activeId"]);
    const _0x348492 = countCanvasNodes(_0x4ec14a?.["nodes"]);
    if (_0x348492 > 0x0) {
      return _0x348492;
    }
    return countCanvasNodes(a1004_0x59ab0f["getStateRaw"]?.()?.['nodes']);
  },
  '_resolveVisualSnapshotBackfillDelays'() {
    return this["_getActiveCanvasNodeCount"]() >= DENSE_VISUAL_SNAPSHOT_NODE_COUNT ? DENSE_VISUAL_SNAPSHOT_BACKFILL_DELAYS_MS : VISUAL_SNAPSHOT_BACKFILL_DELAYS_MS;
  },
  '_isViewportBusyForVisualSnapshot'() {
    const _0x56e2da = typeof document !== "undefined" ? document : null;
    const _0x5a3cec = _0x56e2da?.["body"]?.['classList'];
    const _0x4d9c5d = _0x56e2da?.["documentElement"]?.["classList"];
    return Boolean(_0x5a3cec?.["contains"]?.("is-panning") || _0x5a3cec?.["contains"]?.("is-zooming") || _0x5a3cec?.["contains"]?.('is-viewport-animating') || _0x5a3cec?.['contains']?.("is-dragging") || _0x4d9c5d?.['contains']?.("is-connecting-mode"));
  },
  '_isVisualSnapshotInteractionBusy'() {
    if (this["_isViewportBusyForVisualSnapshot"]()) {
      this["_holdVisualSnapshotCaptureAfterInteraction"]();
      return !![];
    }
    if ((this['_visualSnapshotActivePointers']?.["size"] || 0x0) > 0x0) {
      return !![];
    }
    return this["_getVisualSnapshotNow"]() < (Number(this['_visualSnapshotSettleUntil']) || 0x0);
  },
  '_hasPendingVideoLoadForVisualSnapshot'() {
    const _0x27ad34 = typeof document !== 'undefined' ? document : null;
    const _0x3aae48 = _0x27ad34?.['getElementById']?.("v2-canvas");
    if (!_0x3aae48?.["querySelectorAll"]) {
      return ![];
    }
    return Array["from"](_0x3aae48["querySelectorAll"]("video"))["some"](_0x3f0de2 => {
      if (_0x3f0de2?.["isConnected"] === ![] || _0x3f0de2?.["error"]) {
        return ![];
      }
      const _0x65ee = String(_0x3f0de2?.["currentSrc"] || _0x3f0de2?.["getAttribute"]?.("src") || _0x3f0de2?.['src'] || '')['trim']();
      return !!_0x65ee && Number(_0x3f0de2?.["readyState"] || 0x0) < 0x2;
    });
  },
  '_shouldDeferVisualSnapshotBackfill'() {
    if (this["_isVisualSnapshotInteractionBusy"]()) {
      return !![];
    }
    if (this["_getActiveCanvasNodeCount"]() < DENSE_VISUAL_SNAPSHOT_NODE_COUNT) {
      return ![];
    }
    if (this["_hasPendingVideoLoadForVisualSnapshot"]()) {
      return !![];
    }
    const _0x276454 = getCanvasMediaSchedulerStats();
    return Number(_0x276454["imagePreloadActive"] || 0x0) > 0x0 || Number(_0x276454["imagePreloadQueued"] || 0x0) > 0x0;
  },
  '_isVisualSnapshotWorthReplacing'(_0x495c63, _0x4933b0, {
    force = ![]
  } = {}) {
    if (!_0x4933b0) {
      return ![];
    }
    if (!_0x495c63) {
      return !![];
    }
    const _0x43076b = Math['max'](0x0, Number(_0x495c63["readyMediaNodeCount"] ?? _0x495c63["mediaNodeCount"]) || 0x0);
    const _0x1f0117 = Math["max"](0x0, Number(_0x4933b0["readyMediaNodeCount"] ?? _0x4933b0["mediaNodeCount"]) || 0x0);
    if (_0x1f0117 > _0x43076b) {
      return !![];
    }
    if (_0x1f0117 < _0x43076b) {
      return ![];
    }
    const _0x48aa15 = Math["max"](0x0, Number(_0x495c63["visibleNodeCount"]) || 0x0);
    const _0x5f081d = Math["max"](0x0, Number(_0x4933b0['visibleNodeCount']) || 0x0);
    if (_0x5f081d > _0x48aa15) {
      return !![];
    }
    return force && _0x5f081d >= _0x48aa15;
  },
  '_captureActiveVisualSnapshot'({
    force = ![],
    persistIfChanged = ![]
  } = {}) {
    if (!this["_activeId"]) {
      return null;
    }
    if (this["_isVisualSnapshotInteractionBusy"]()) {
      this['_scheduleVisualSnapshotIdleRetry'](this['_activeId']);
      return null;
    }
    const _0x291826 = this["_canvases"]["findIndex"](_0x312b4b => _0x312b4b['id'] === this["_activeId"]);
    if (_0x291826 === -0x1) {
      return null;
    }
    if (typeof document === "undefined") {
      return null;
    }
    const _0x221771 = document['getElementById']('v2-canvas');
    if (!_0x221771) {
      return null;
    }
    const _0x2d3094 = a1004_0x59ab0f["getStateRaw"]?.() || {};
    const _0x2ab636 = captureCanvasVisualSnapshot({
      'canvasEl': _0x221771,
      'containerEl': _0x221771['parentElement'] || document["getElementById"]("v2-container"),
      'nodes': _0x2d3094["nodes"],
      'edges': _0x2d3094['edges'],
      'viewport': _0x2d3094['viewport'],
      'force': force
    });
    if (!_0x2ab636) {
      return null;
    }
    const _0x2429a1 = this["_canvases"][_0x291826]?.["visualSnapshot"] || null;
    if (!this['_isVisualSnapshotWorthReplacing'](_0x2429a1, _0x2ab636, {
      'force': force
    })) {
      return null;
    }
    this["_canvases"][_0x291826] = {
      ...this['_canvases'][_0x291826],
      'visualSnapshot': _0x2ab636
    };
    persistIfChanged && this['_scheduleWorkspaceMetaCacheSave']();
    return _0x2ab636;
  },
  '_getActiveVisualSnapshotCaptureInput'({
    force = ![]
  } = {}) {
    if (!this['_activeId']) {
      return null;
    }
    const _0x306021 = this["_canvases"]["findIndex"](_0xd1d50e => _0xd1d50e['id'] === this['_activeId']);
    if (_0x306021 === -0x1) {
      return null;
    }
    if (typeof document === "undefined") {
      return null;
    }
    const _0x4b797a = document["getElementById"]("v2-canvas");
    if (!_0x4b797a) {
      return null;
    }
    const _0x597d22 = a1004_0x59ab0f["getStateRaw"]?.() || {};
    return {
      'idx': _0x306021,
      'canvasId': this["_activeId"],
      'canvasEl': _0x4b797a,
      'containerEl': _0x4b797a["parentElement"] || document["getElementById"]("v2-container"),
      'nodes': _0x597d22["nodes"],
      'edges': _0x597d22["edges"],
      'viewport': _0x597d22["viewport"],
      'force': force
    };
  },
  async '_captureActiveVisualSnapshotAsync'({
    force = ![],
    persistIfChanged = ![]
  } = {}) {
    const _0x4c439d = Number(this['_visualSnapshotBackfillGeneration']) || 0x0;
    const _0x13baa7 = this["_getActiveVisualSnapshotCaptureInput"]({
      'force': force
    });
    if (!_0x13baa7) {
      return null;
    }
    if (this["_isVisualSnapshotInteractionBusy"]()) {
      this["_scheduleVisualSnapshotIdleRetry"](_0x13baa7["canvasId"]);
      return null;
    }
    let _0x4aad63 = await captureCanvasVisualSnapshotFromElectron(_0x13baa7);
    if (this['_activeId'] !== _0x13baa7["canvasId"] || _0x4c439d !== (Number(this['_visualSnapshotBackfillGeneration']) || 0x0) || this['_isVisualSnapshotInteractionBusy']()) {
      this["_activeId"] === _0x13baa7['canvasId'] && this['_scheduleVisualSnapshotIdleRetry'](_0x13baa7["canvasId"]);
      return null;
    }
    if (!_0x4aad63) {
      if (isChromeShellRuntime() && countCanvasNodes(_0x13baa7['nodes']) >= DENSE_VISUAL_SNAPSHOT_NODE_COUNT) {
        return null;
      }
      _0x4aad63 = captureCanvasVisualSnapshot(_0x13baa7);
    }
    if (!_0x4aad63) {
      return null;
    }
    if (this['_activeId'] !== _0x13baa7["canvasId"] || _0x4c439d !== (Number(this["_visualSnapshotBackfillGeneration"]) || 0x0) || this['_isVisualSnapshotInteractionBusy']()) {
      this["_activeId"] === _0x13baa7['canvasId'] && this["_scheduleVisualSnapshotIdleRetry"](_0x13baa7["canvasId"]);
      return null;
    }
    const _0x33c4c8 = this["_canvases"]["findIndex"](_0x27fa52 => _0x27fa52['id'] === _0x13baa7["canvasId"]);
    if (_0x33c4c8 === -0x1) {
      return null;
    }
    const _0x126fa3 = this["_canvases"][_0x33c4c8]?.['visualSnapshot'] || null;
    if (!this["_isVisualSnapshotWorthReplacing"](_0x126fa3, _0x4aad63, {
      'force': force
    })) {
      return null;
    }
    this["_canvases"][_0x33c4c8] = {
      ...this['_canvases'][_0x33c4c8],
      'visualSnapshot': _0x4aad63
    };
    persistIfChanged && this["_scheduleWorkspaceMetaCacheSave"]();
    return _0x4aad63;
  },
  '_showCanvasVisualSnapshot'(_0x452b2c) {
    hideCanvasVisualSnapshotOverlay();
    this["_scheduleCanvasVisibleMediaWarmup"](_0x452b2c, {
      'delayMs': CANVAS_MEDIA_WARMUP_OPEN_DELAY_MS,
      'maxJobs': CANVAS_MEDIA_WARMUP_SNAPSHOT_MAX_JOBS
    });
    return ![];
  },
  '_warmupCanvasVisibleMedia'(_0x5d6b7d, {
    maxJobs: _0x3a496f
  } = {}) {
    if (typeof document === "undefined" || !_0x5d6b7d) {
      return null;
    }
    if (typeof document["getElementById"] !== 'function') {
      return null;
    }
    const _0x476519 = document["getElementById"]("v2-canvas");
    const _0x39fbd6 = _0x476519?.["parentElement"] || document['getElementById']("v2-container");
    return warmupCanvasVisibleMedia({
      'canvas': _0x5d6b7d,
      'containerEl': _0x39fbd6,
      'maxJobs': _0x3a496f
    });
  },
  '_clearCanvasVisibleMediaWarmupTimer'() {
    this["_mediaWarmupTimer"] !== null && (clearTimeout(this["_mediaWarmupTimer"]), this['_mediaWarmupTimer'] = null);
  },
  '_scheduleCanvasVisibleMediaWarmup'(_0x4fe8dd, {
    delayMs = CANVAS_MEDIA_WARMUP_OPEN_DELAY_MS,
    maxJobs = CANVAS_MEDIA_WARMUP_OPEN_MAX_JOBS
  } = {}) {
    this['_clearCanvasVisibleMediaWarmupTimer']();
    if (!_0x4fe8dd) {
      return null;
    }
    const _0x5ec693 = _0x4fe8dd['id'] || null;
    const _0x42064a = setTimeout(() => {
      this["_mediaWarmupTimer"] = null;
      if (_0x5ec693 && this["_activeId"] !== _0x5ec693) {
        return;
      }
      this['_warmupCanvasVisibleMedia'](_0x4fe8dd, {
        'maxJobs': maxJobs
      });
    }, Math["max"](0x0, Number(delayMs) || 0x0));
    _0x42064a?.['unref']?.();
    this['_mediaWarmupTimer'] = _0x42064a;
    return _0x42064a;
  },
  '_scheduleVisualSnapshotBackfill'() {
    this['_clearVisualSnapshotBackfillTimers']();
    if (!this["_activeId"]) {
      return;
    }
    this['_invalidateVisualSnapshotBackfillCapture']();
    this["_bindVisualSnapshotInteractionGuard"]();
    const _0x2ec634 = this["_activeId"];
    this["_visualSnapshotBackfillTimers"] = this["_resolveVisualSnapshotBackfillDelays"]()["map"](_0x462aaf => this["_scheduleVisualSnapshotBackfillTimer"](_0x2ec634, _0x462aaf));
  },
  '_scheduleVisualSnapshotIdleRetry'(_0x5dd572, _0x37270d = VISUAL_SNAPSHOT_BACKFILL_RETRY_MS) {
    if (this['_visualSnapshotIdleRetryTimer'] !== null && this["_visualSnapshotIdleRetryCanvasId"] === _0x5dd572) {
      return this["_visualSnapshotIdleRetryTimer"];
    }
    this["_clearVisualSnapshotIdleRetryTimer"]();
    const _0x1d8a41 = setTimeout(() => {
      if (this["_visualSnapshotIdleRetryTimer"] !== _0x1d8a41) {
        return;
      }
      this["_visualSnapshotIdleRetryTimer"] = null;
      this["_visualSnapshotIdleRetryCanvasId"] = null;
      if (this["_activeId"] !== _0x5dd572) {
        return;
      }
      if (this["_shouldDeferVisualSnapshotBackfill"]()) {
        this["_scheduleVisualSnapshotIdleRetry"](_0x5dd572);
        return;
      }
      void this['_requestVisualSnapshotBackfillCapture'](_0x5dd572);
    }, Math["max"](0x0, Number(_0x37270d) || 0x0));
    _0x1d8a41?.["unref"]?.();
    this["_visualSnapshotIdleRetryTimer"] = _0x1d8a41;
    this["_visualSnapshotIdleRetryCanvasId"] = _0x5dd572;
    return _0x1d8a41;
  },
  '_requestVisualSnapshotBackfillCapture'(_0x52566c) {
    if (this["_activeId"] !== _0x52566c) {
      return Promise["resolve"](null);
    }
    if (this["_shouldDeferVisualSnapshotBackfill"]()) {
      this["_scheduleVisualSnapshotIdleRetry"](_0x52566c);
      return Promise["resolve"](null);
    }
    if (this["_visualSnapshotBackfillCapturePromise"]) {
      return this["_visualSnapshotBackfillCapturePromise"];
    }
    const _0x2f2ab9 = this["_captureActiveVisualSnapshotAsync"]({
      'force': ![],
      'persistIfChanged': !![]
    });
    const _0x2de6a1 = Promise['resolve'](_0x2f2ab9)["finally"](() => {
      this["_visualSnapshotBackfillCapturePromise"] === _0x2de6a1 && (this["_visualSnapshotBackfillCapturePromise"] = null);
    });
    this["_visualSnapshotBackfillCapturePromise"] = _0x2de6a1;
    return _0x2de6a1;
  },
  '_scheduleVisualSnapshotBackfillTimer'(_0x15db3a, _0x3094fe) {
    const _0x2eb5d4 = setTimeout(() => {
      this["_visualSnapshotBackfillTimers"] = (this["_visualSnapshotBackfillTimers"] || [])['filter'](_0x19c9de => _0x19c9de !== _0x2eb5d4);
      if (this["_activeId"] !== _0x15db3a) {
        return;
      }
      if (this["_shouldDeferVisualSnapshotBackfill"]()) {
        this["_scheduleVisualSnapshotIdleRetry"](_0x15db3a);
        return;
      }
      this["_clearVisualSnapshotIdleRetryTimer"]();
      void this['_requestVisualSnapshotBackfillCapture'](_0x15db3a);
    }, Math["max"](0x0, Number(_0x3094fe) || 0x0));
    _0x2eb5d4?.["unref"]?.();
    return _0x2eb5d4;
  },
  '_hydrateCanvasSnapshot'(_0x3b6882, {
    preserveLiveGeneration = ![]
  } = {}) {
    markPerf("hydrateTrustedSnapshot:start");
    a1004_0x59ab0f["hydrateTrustedSnapshot"](_0x3b6882, {
      'preserveLiveGeneration': preserveLiveGeneration
    });
    markPerf("hydrateTrustedSnapshot:end");
    measurePerf("hydrateTrustedSnapshot", "hydrateTrustedSnapshot:start", 'hydrateTrustedSnapshot:end');
    this["_rememberCanvasPersistRev"]();
  },
  'hydrateActiveCanvasSnapshot'(_0x242e94) {
    if (!this["_activeId"]) {
      return;
    }
    const _0x2be588 = this["_canvases"]['findIndex'](_0x41cd95 => _0x41cd95['id'] === this["_activeId"]);
    if (_0x2be588 === -0x1) {
      return;
    }
    this["_canvases"][_0x2be588] = this['_buildCanvasRecord'](this["_canvases"][_0x2be588], _0x242e94);
    this["_scheduleCanvasVisibleMediaWarmup"](this["_canvases"][_0x2be588]);
    this["_clearCanvasSurface"]();
    this["_hydrateCanvasSnapshot"](this['_canvases'][_0x2be588]);
    this["_scheduleVisualSnapshotBackfill"]();
  },
  'init'(_0x1d31ae, {
    markClean = !![]
  } = {}) {
    this['_projectBadges'] = new Map();
    this["_bindVisualSnapshotInteractionGuard"]();
    this['_invalidateVisualSnapshotBackfillCapture']();
    this["_backgroundTaskStores"] = new Map();
    this["_canvases"] = Array["isArray"](_0x1d31ae["canvases"]) ? _0x1d31ae['canvases']["map"](_0x24341e => this["_buildCanvasRecord"](_0x24341e, _0x24341e)) : [];
    const _0x23a0a9 = new Map((Array["isArray"](_0x1d31ae?.["projectContexts"]) ? _0x1d31ae["projectContexts"] : [])["filter"](_0x282f4d => _0x282f4d?.["canvasId"])['map'](_0x3ca670 => [String(_0x3ca670["canvasId"]), _0x3ca670]));
    this["_projectContextByCanvasId"] = new Map();
    this["_lastPersistRevByCanvas"] = new Map();
    this['_lastContentPersistRevByCanvas'] = new Map();
    this["_savedSignatureByCanvas"] = new Map();
    this["_lastTabsRenderSignature"] = '';
    if (this["_canvases"]["length"] === 0x0) {
      const _0x3a6739 = 'canvas_default_' + Date["now"]();
      this["_canvases"]["push"]({
        'id': _0x3a6739,
        'name': canvasTabsText("defaultCanvasName"),
        ...createEmptyCanvasSnapshot()
      });
      this["_activeId"] = _0x3a6739;
      this["_projectContextByCanvasId"]["set"](_0x3a6739, normalizeCanvasProjectContext({
        'projectName': this["_canvases"][0x0]['name'],
        'isTemporary': !![]
      }, {
        'canvasId': _0x3a6739,
        'projectName': this["_canvases"][0x0]["name"]
      }));
      this['_hydrateCanvasSnapshot'](this["_canvases"][0x0]);
    } else {
      const _0x1ccb8d = this["_canvases"]['find'](_0xb4181 => _0xb4181?.['id'] === _0x1d31ae['activeCanvasId']) || this['_canvases'][0x0];
      this["_activeId"] = _0x1ccb8d?.['id'] ?? null;
      const _0x11fd85 = captureCurrentProjectContext(_0x1ccb8d);
      this['_canvases']['forEach'](_0x4dc74a => {
        const _0x186246 = _0x23a0a9["get"](String(_0x4dc74a?.['id']));
        const _0x4c0e27 = _0x4dc74a['id'] === this['_activeId'] ? _0x11fd85 : {
          'projectId': _0x4dc74a["name"] || _0x4dc74a['id'],
          'projectName': _0x4dc74a["name"],
          'isTemporary': !![],
          'workspaceProjectScoped': !![]
        };
        this['_projectContextByCanvasId']['set'](_0x4dc74a['id'], normalizeCanvasProjectContext(_0x186246 || _0x4c0e27, {
          'canvasId': _0x4dc74a['id'],
          'projectName': _0x4dc74a['name']
        }));
      });
      _0x1ccb8d && (this["_showCanvasVisualSnapshot"](_0x1ccb8d), this["_hydrateCanvasSnapshot"](_0x1ccb8d), this["_scheduleVisualSnapshotBackfill"]());
    }
    resetHistory();
    this["_resetSavedCanvasSignatures"]({
      'markClean': markClean
    });
    this["renderTabs"]();
    startVideoThumbBackfill();
    this["_applyActiveCanvasProjectContext"]();
    this['_notifyActiveCanvasChanged']("init");
    this["_notifyDirtyStateChanged"]();
  },
  'replaceWorkspace'(_0xa110b8, {
    markClean = !![]
  } = {}) {
    this["_flushCurrentCanvas"]();
    this['_clearVisualSnapshotBackfillTimers']();
    this['_clearCanvasVisibleMediaWarmupTimer']();
    this["_clearCanvasSurface"]();
    this["init"](_0xa110b8, {
      'markClean': markClean
    });
    this["_scheduleWorkspaceCacheSave"]();
    return !![];
  },
  '_flushCurrentCanvas'() {
    if (!this['_activeId']) {
      return;
    }
    const _0x4f23d2 = this['_canvases']["findIndex"](_0x2c810e => _0x2c810e['id'] === this["_activeId"]);
    if (_0x4f23d2 === -0x1) {
      return;
    }
    flushAllPendingPromptHtmlCommits();
    const _0x8cf9f2 = this["_getStorePersistRev"]();
    if (this['_lastPersistRevByCanvas']["get"](this["_activeId"]) === _0x8cf9f2) {
      return;
    }
    const _0x1ff3de = this["_getStoreContentPersistRev"]();
    if (this["_lastContentPersistRevByCanvas"]["get"](this["_activeId"]) === _0x1ff3de) {
      const _0x4adea2 = a1004_0x59ab0f["getStateRaw"]()?.["viewport"] || {};
      this["_canvases"][_0x4f23d2] = {
        ...this['_canvases'][_0x4f23d2],
        'viewport': {
          'x': Number(_0x4adea2['x']) || 0x0,
          'y': Number(_0x4adea2['y']) || 0x0,
          'zoom': Number(_0x4adea2['zoom']) || 1.1
        },
        '_persistRevHint': _0x8cf9f2,
        '_contentPersistRevHint': _0x1ff3de
      };
      this['_lastPersistRevByCanvas']["set"](this["_activeId"], _0x8cf9f2);
      return;
    }
    const _0x5bfce6 = markRecoveringGenerationSnapshot(a1004_0x59ab0f["serialize"]());
    const _0x4369fa = this["_buildCanvasRecord"](this["_canvases"][_0x4f23d2], _0x5bfce6);
    _0x4369fa["_persistRevHint"] = _0x8cf9f2;
    _0x4369fa["_contentPersistRevHint"] = _0x1ff3de;
    this["_canvases"][_0x4f23d2] = _0x4369fa;
    this["_lastPersistRevByCanvas"]["set"](this["_activeId"], _0x8cf9f2);
    this["_lastContentPersistRevByCanvas"]["set"](this["_activeId"], _0x1ff3de);
  },
  async 'switchTo'(_0x488be3) {
    if (_0x488be3 === this["_activeId"]) {
      return;
    }
    if (!this["_canvases"]["some"](_0x2080d5 => _0x2080d5['id'] === _0x488be3)) {
      return;
    }
    return this["_runTaskSafeCanvasTransition"](() => {
      let _0x3db134 = this["_canvases"]['find'](_0x284c17 => _0x284c17['id'] === _0x488be3);
      if (!_0x3db134 || _0x488be3 === this['_activeId']) {
        return ![];
      }
      this["_flushCurrentCanvas"]();
      const _0x5186ec = this["_handoffActiveCanvasTasks"](this["_activeId"]);
      if (_0x5186ec?.['ok'] === ![]) {
        this['_showTaskTransitionBlocked'](_0x5186ec);
        return ![];
      }
      const _0x3a3313 = this['_backgroundTaskStores']["get"](_0x488be3);
      _0x3a3313 && (this["_syncBackgroundTaskCanvas"](_0x488be3, _0x3a3313, {
        'persist': ![]
      }), _0x3db134 = this["_canvases"]["find"](_0x3c17b2 => _0x3c17b2['id'] === _0x488be3));
      this["_showCanvasVisualSnapshot"](_0x3db134);
      this["_clearCanvasSurface"]();
      this['_activeId'] = _0x488be3;
      this["_hydrateCanvasSnapshot"](_0x3db134, {
        'preserveLiveGeneration': canvasHasLiveGeneration(_0x3db134)
      });
      this["_restoreActiveCanvasTasks"](_0x488be3);
      this["_scheduleVisualSnapshotBackfill"]();
      resetHistory();
      this["renderTabs"]();
      startVideoThumbBackfill();
      this["_applyActiveCanvasProjectContext"]();
      this["_notifyActiveCanvasChanged"]("switch");
      this["_markCanvasMetaDirty"]();
      this["_notifyDirtyStateChanged"]();
      return !![];
    });
  },
  async 'addCanvas'() {
    return this["_runTaskSafeCanvasTransition"](() => {
      this["_flushCurrentCanvas"]();
      const _0x10f179 = this['_handoffActiveCanvasTasks'](this["_activeId"]);
      if (_0x10f179?.['ok'] === ![]) {
        this["_showTaskTransitionBlocked"](_0x10f179);
        return ![];
      }
      this["_clearCanvasSurface"]();
      const _0x43b27e = "canvas_" + Date["now"]();
      const _0x567292 = canvasTabsText("newCanvasName", {
        'index': this["_canvases"]["length"] + 0x1
      });
      this['_canvases']['push']({
        'id': _0x43b27e,
        'name': _0x567292,
        ...createEmptyCanvasSnapshot()
      });
      this['_projectContextByCanvasId']["set"](_0x43b27e, normalizeCanvasProjectContext({
        'projectName': _0x567292,
        'isTemporary': !![]
      }, {
        'canvasId': _0x43b27e,
        'projectName': _0x567292
      }));
      this["_activeId"] = _0x43b27e;
      this["_hydrateCanvasSnapshot"](createEmptyCanvasSnapshot());
      this["_scheduleVisualSnapshotBackfill"]();
      resetHistory();
      this["renderTabs"]();
      startVideoThumbBackfill();
      this["_applyActiveCanvasProjectContext"]();
      this["_notifyActiveCanvasChanged"]("add");
      this["_markCanvasMetaDirty"]();
      this["_notifyDirtyStateChanged"]();
      return !![];
    });
  },
  async '_confirmDeleteDirtyCanvas'(_0x912305, {
    skipDirtyConfirm = ![]
  } = {}) {
    if (skipDirtyConfirm || !this["isCanvasDirty"](_0x912305?.['id'])) {
      return !![];
    }
    return this["_showUnsavedDeleteConfirm"](_0x912305);
  },
  '_showUnsavedDeleteConfirm'(_0x25efd8) {
    if (typeof document === "undefined" || !document['body']) {
      return Promise["resolve"](![]);
    }
    document['getElementById']("canvas-delete-confirm-overlay")?.["remove"]();
    return new Promise(_0x2c55b7 => {
      const _0x2608bb = document["createElement"]('div');
      _0x2608bb['id'] = "canvas-delete-confirm-overlay";
      _0x2608bb["className"] = "custom-confirm-overlay";
      const _0x16fb29 = document["createElement"]("div");
      _0x16fb29['className'] = 'custom-confirm-box';
      const _0x26ea1c = document['createElement']("div");
      _0x26ea1c['className'] = "confirm-title";
      _0x26ea1c["textContent"] = canvasTabsText("deleteUnsaved.title");
      const _0x22199f = document["createElement"]('div');
      _0x22199f['className'] = 'confirm-msg';
      _0x22199f["textContent"] = canvasTabsText("deleteUnsaved.message", {
        'name': _0x25efd8?.["name"] || canvasTabsText("untitledCanvas")
      });
      const _0x5227ae = document["createElement"]("div");
      _0x5227ae["className"] = "confirm-btns";
      const _0x22e11d = document["createElement"]("button");
      _0x22e11d["type"] = 'button';
      _0x22e11d["className"] = "confirm-btn confirm-cancel";
      _0x22e11d['textContent'] = canvasTabsText("deleteUnsaved.cancel");
      const _0xa6dd4f = document["createElement"]("button");
      _0xa6dd4f["type"] = "button";
      _0xa6dd4f['className'] = "confirm-btn confirm-ok";
      _0xa6dd4f["textContent"] = canvasTabsText("deleteUnsaved.delete");
      _0x5227ae["appendChild"](_0x22e11d);
      _0x5227ae["appendChild"](_0xa6dd4f);
      _0x16fb29["appendChild"](_0x26ea1c);
      _0x16fb29["appendChild"](_0x22199f);
      _0x16fb29['appendChild'](_0x5227ae);
      _0x2608bb["appendChild"](_0x16fb29);
      document["body"]['appendChild'](_0x2608bb);
      let _0x9d1866 = ![];
      const _0x97c493 = _0x482a26 => {
        if (_0x9d1866) {
          return;
        }
        _0x9d1866 = !![];
        document["removeEventListener"]("keydown", _0x2f2a0d, !![]);
        _0x2608bb["remove"]();
        _0x2c55b7(_0x482a26);
      };
      const _0x2f2a0d = _0x1079ca => {
        if (_0x1079ca['key'] === 'Escape') {
          _0x1079ca["preventDefault"]();
          _0x97c493(![]);
          return;
        }
        _0x1079ca["key"] === 'Enter' && !_0x1079ca['isComposing'] && (_0x1079ca["preventDefault"](), _0x97c493(!![]));
      };
      _0x2608bb['addEventListener']("click", _0x31903f => {
        if (_0x31903f['target'] === _0x2608bb) {
          _0x97c493(![]);
        }
      });
      _0x22e11d["addEventListener"]("click", () => _0x97c493(![]));
      _0xa6dd4f["addEventListener"]("click", () => _0x97c493(!![]));
      document["addEventListener"]('keydown', _0x2f2a0d, !![]);
      _0x22e11d["focus"]?.();
    });
  },
  async 'deleteCanvas'(_0x470a93, _0x5b766c = {}) {
    if (_0x470a93 === this["_activeId"] && (await a1004_0x59ab0f["getGraphMutationPolicy"]?.()?.['beforeWorkspaceTransition']?.()) === ![]) {
      return ![];
    }
    if (this["_canvases"]["length"] <= 0x1) {
      window['showToast'](canvasTabsText("keepOneCanvas"), "warn");
      return ![];
    }
    const _0x376d65 = this["_canvases"]['findIndex'](_0x3754ca => _0x3754ca['id'] === _0x470a93);
    if (_0x376d65 === -0x1) {
      return ![];
    }
    if (_0x470a93 === this["_activeId"]) {
      this["_flushCurrentCanvas"]();
    }
    const _0x52a6b5 = this['_canvases'][_0x376d65];
    if (canvasHasLiveGeneration(_0x52a6b5)) {
      this["_showTaskTransitionBlocked"]({
        'activeCount': 0x1
      }, "deleteBlockedByTasks");
      return ![];
    }
    const _0x4f9645 = await this['_confirmDeleteDirtyCanvas'](_0x52a6b5, _0x5b766c);
    if (!_0x4f9645) {
      return ![];
    }
    this["_canvases"]['splice'](_0x376d65, 0x1);
    this["_projectContextByCanvasId"]["delete"](_0x470a93);
    this["_backgroundTaskStores"]["delete"](_0x470a93);
    this["_lastPersistRevByCanvas"]['delete'](_0x470a93);
    this["_lastContentPersistRevByCanvas"]["delete"](_0x470a93);
    this['_savedSignatureByCanvas']["delete"](_0x470a93);
    if (this["_activeId"] === _0x470a93) {
      const _0x30227d = this["_canvases"][Math["max"](0x0, _0x376d65 - 0x1)];
      this["_activeId"] = _0x30227d['id'];
      this["_showCanvasVisualSnapshot"](_0x30227d);
      this["_clearCanvasSurface"]();
      this['_hydrateCanvasSnapshot'](_0x30227d, {
        'preserveLiveGeneration': canvasHasLiveGeneration(_0x30227d)
      });
      this["_scheduleVisualSnapshotBackfill"]();
      resetHistory();
      this['_applyActiveCanvasProjectContext']();
      this["_notifyActiveCanvasChanged"]("delete");
    }
    this["renderTabs"]();
    startVideoThumbBackfill();
    this['_markCanvasMetaDirty']();
    this['_notifyDirtyStateChanged']();
    return !![];
  },
  'renameCanvas'(_0x2a88a8, _0x3532bb) {
    const _0x1b0330 = this["_canvases"]['find'](_0x18b909 => _0x18b909['id'] === _0x2a88a8);
    if (!_0x1b0330) {
      return;
    }
    const _0x489176 = String(_0x3532bb || '')["trim"]();
    const _0x217ae1 = String(_0x1b0330["name"] || '')["trim"]();
    if (!_0x489176 || _0x489176 === _0x217ae1) {
      return;
    }
    _0x1b0330["name"] = _0x489176;
    this["renderTabs"]();
    this['_markCanvasMetaDirty']();
    this["_notifyDirtyStateChanged"]();
  },
  'captureCanvasSaveCheckpoint'(_0x28f9e8 = this['_activeId'], {
    name: _0x54ff80
  } = {}) {
    if (_0x28f9e8 === this["_activeId"]) {
      this['_flushCurrentCanvas']();
    }
    const _0x49f3fd = this["_canvases"]["find"](_0x6eff8d => _0x6eff8d['id'] === _0x28f9e8);
    if (!_0x49f3fd) {
      return null;
    }
    return Object["freeze"]({
      'canvasId': _0x28f9e8,
      'signature': this["_buildCanvasSavedSignature"](_0x54ff80 === undefined ? _0x49f3fd : {
        ..._0x49f3fd,
        'name': _0x54ff80
      })
    });
  },
  'markCanvasClean'(_0x298185 = this["_activeId"], {
    checkpoint: _0x1d4e0d
  } = {}) {
    if (!_0x298185) {
      return ![];
    }
    if (_0x1d4e0d && _0x1d4e0d["canvasId"] !== _0x298185) {
      return ![];
    }
    if (_0x298185 === this["_activeId"]) {
      this["_flushCurrentCanvas"]();
    }
    const _0x33b231 = this["_canvases"]["find"](_0x49dc24 => _0x49dc24['id'] === _0x298185);
    if (!_0x33b231) {
      return ![];
    }
    this['_savedSignatureByCanvas']["set"](_0x298185, _0x1d4e0d?.['signature'] || this["_buildCanvasSavedSignature"](_0x33b231));
    this['_notifyDirtyStateChanged']();
    return !![];
  },
  'markAllCanvasesClean'() {
    this["_flushCurrentCanvas"]();
    this["_resetSavedCanvasSignatures"]({
      'markClean': !![]
    });
    this['_notifyDirtyStateChanged']();
    return !![];
  },
  'isCanvasDirty'(_0x2fbef6 = this["_activeId"]) {
    if (!_0x2fbef6) {
      return ![];
    }
    if (_0x2fbef6 === this["_activeId"]) {
      this["_flushCurrentCanvas"]();
    }
    const _0x5ae96d = this["_canvases"]["find"](_0x1fa473 => _0x1fa473['id'] === _0x2fbef6);
    if (!_0x5ae96d) {
      return ![];
    }
    const _0x1b169d = this['_savedSignatureByCanvas']['get'](_0x2fbef6);
    if (!_0x1b169d) {
      return !![];
    }
    return _0x1b169d !== this['_buildCanvasSavedSignature'](_0x5ae96d);
  },
  'hasDirtyCanvases'() {
    this["_flushCurrentCanvas"]();
    return this["_canvases"]['some'](_0x4a0942 => {
      const _0xde0962 = _0x4a0942?.['id'];
      if (!_0xde0962) {
        return ![];
      }
      const _0x78f61b = this["_savedSignatureByCanvas"]["get"](_0xde0962);
      return !_0x78f61b || _0x78f61b !== this["_buildCanvasSavedSignature"](_0x4a0942);
    });
  },
  'getMultiDataSnapshot'({
    sanitizeForPersistence = ![],
    captureVisualSnapshot = !![],
    includeProjectContexts = ![]
  } = {}) {
    this["_flushCurrentCanvas"]();
    captureVisualSnapshot && this["_captureActiveVisualSnapshot"]({
      'force': ![]
    });
    const _0x3bfd89 = cloneMultiDataSnapshot({
      'canvases': this["_canvases"],
      'activeCanvasId': this["_activeId"],
      ...(includeProjectContexts ? {
        'projectContexts': this['_canvases']["map"](_0x35f466 => {
          const _0x4013e5 = this['_projectContextByCanvasId']['get'](_0x35f466?.['id']);
          return _0x4013e5 ? {
            'canvasId': _0x35f466['id'],
            ..._0x4013e5
          } : null;
        })["filter"](Boolean)
      } : {})
    });
    if (!sanitizeForPersistence) {
      return _0x3bfd89;
    }
    return sanitizeMultiCanvasDataForPersistence(_0x3bfd89 || {});
  },
  'getMultiData'() {
    return this["getMultiDataSnapshot"]();
  },
  'getPersistableMultiDataSnapshot'({
    includeProjectContexts = ![]
  } = {}) {
    this['_flushCurrentCanvas']();
    return {
      'canvases': this["_canvases"]["map"](_0x2a159f => ({
        ..._0x2a159f,
        'viewport': {
          ...(_0x2a159f?.["viewport"] || {})
        }
      })),
      'activeCanvasId': this["_activeId"],
      ...(includeProjectContexts ? {
        'projectContexts': this["_canvases"]["map"](_0xff469c => {
          const _0x599dfb = this["_projectContextByCanvasId"]["get"](_0xff469c?.['id']);
          return _0x599dfb ? {
            'canvasId': _0xff469c['id'],
            ..._0x599dfb
          } : null;
        })['filter'](Boolean)
      } : {})
    };
  },
  'getActiveCanvasId'() {
    return this["_activeId"] || '';
  },
  'getPersistenceRevisionSnapshot'() {
    const _0x40e778 = this["_activeId"] || '';
    const _0x1a3d49 = this['_getStorePersistRev']();
    return {
      'activeCanvasId': _0x40e778,
      'canvases': this["_canvases"]["map"](_0x3d3506 => ({
        'id': String(_0x3d3506?.['id'] || ''),
        'name': String(_0x3d3506?.["name"] || ''),
        'persistRev': _0x3d3506?.['id'] === _0x40e778 ? _0x1a3d49 : Number(_0x3d3506?.['_persistRevHint']) || 0x0,
        'contentPersistRev': _0x3d3506?.['id'] === _0x40e778 ? this["_getStoreContentPersistRev"]() : Number(_0x3d3506?.["_contentPersistRevHint"]) || 0x0
      }))
    };
  },
  'renderTabs'() {
    const _0x52dbed = document["getElementById"]('canvasTabs');
    if (!_0x52dbed) {
      return;
    }
    this["_bindTabContainerEvents"](_0x52dbed);
    const _0x4cac6d = this["_getTabsRenderSignature"]();
    if (_0x4cac6d === this["_lastTabsRenderSignature"]) {
      return;
    }
    this["_lastTabsRenderSignature"] = _0x4cac6d;
    this['_removeTabContextMenu']();
    const _0x2c25ea = document["createDocumentFragment"]();
    this["_canvases"]["forEach"](_0x4fcb96 => {
      const _0x5be112 = _0x4fcb96['id'] === this["_activeId"];
      const _0x4f55c1 = document["createElement"]("div");
      _0x4f55c1["className"] = "canvas-tab" + (_0x5be112 ? " active" : '');
      _0x4f55c1['dataset']['id'] = _0x4fcb96['id'];
      const _0x4a3015 = document["createElement"]("span");
      _0x4a3015["className"] = "canvas-tab-name";
      _0x4a3015["dataset"]["tooltip"] = _0x4fcb96["name"];
      _0x4a3015["dataset"]["tooltipOverflow"] = 'true';
      _0x4a3015['textContent'] = _0x4fcb96["name"];
      const _0x5e08fe = document["createElement"]("button");
      _0x5e08fe["type"] = 'button';
      _0x5e08fe["className"] = "canvas-tab-close";
      _0x5e08fe["title"] = canvasTabsText('closeCanvas');
      _0x5e08fe['textContent'] = '×';
      _0x4f55c1["appendChild"](_0x4a3015);
      const _0x3f6e7e = this["getCanvasProjectAccess"](_0x4fcb96['id']);
      const _0x3abfe9 = createCanvasProjectBadge(_0x3f6e7e);
      if (_0x3abfe9) {
        _0x4f55c1["prepend"](_0x3abfe9);
      }
      _0x4f55c1["appendChild"](_0x5e08fe);
      _0x2c25ea["appendChild"](_0x4f55c1);
    });
    _0x52dbed["replaceChildren"](_0x2c25ea);
    this["_revealActiveTab"](_0x52dbed);
    this["_updateTabScrollHints"](_0x52dbed);
  }
};
export default CanvasTabManager;
export { CanvasTabManager };