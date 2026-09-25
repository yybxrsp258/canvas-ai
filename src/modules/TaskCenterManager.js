import { registerSidebarSubmenu } from './sidebarSubmenuController.js';
import { pickResultLocalPath } from '../utils/localMediaPath.js';
import { GENERATION_TASK_CENTER_EVENT, listGenerationTaskCenterUpdates } from './generationTaskCenterEvents.js';
import { ACTIVE_TASK_STATUSES as a1596_0x20de66, TERMINAL_TASK_STATUSES as a1596_0x3e7781, pruneTaskCenterRecords } from './taskCenterModel.js';
import { createTaskCardView, syncTaskElements } from './taskCenterListView.js';
import { resolveTaskCenterThumbnail } from './taskCenterThumbnail.js';
import { createTaskCenterMediaController } from './taskCenterMediaController.js';
import { executeTaskCenterAction } from './taskCenterActions.js';
import { getProviderTaskConsoleUrl } from '../config/providerTaskConsole.js';
import a1596_0x2716b4 from '../core/stores/appStore.js';
import { cancelTask as a1596_0x2f5fe2 } from '../core/generationTaskRuntime.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { desktopBridge } from '../services/desktopBridge.js';
import { showContextMenu } from './interaction/contextMenuPresenter.js';
const MAX_TASKS = 0x78;
function el(_0x505f99, _0x4e0a03 = '', _0x36a99a = '') {
  const _0x5db031 = document['createElement'](_0x505f99);
  if (_0x4e0a03) {
    _0x5db031["className"] = _0x4e0a03;
  }
  if (_0x36a99a) {
    _0x5db031["textContent"] = _0x36a99a;
  }
  return _0x5db031;
}
function taskCenterText(_0x4b4f50, _0x2e4d59 = {}) {
  return t("taskCenter." + _0x4b4f50, _0x2e4d59);
}
function normalizeTask(_0x5b4364 = {}) {
  const _0x415c9a = String(_0x5b4364["taskId"] || '')["trim"]();
  if (!_0x415c9a) {
    return null;
  }
  return {
    'taskId': _0x415c9a,
    'title': String(_0x5b4364["title"] || ''),
    'provider': String(_0x5b4364['provider'] || ''),
    'providerProfileId': String(_0x5b4364["providerProfileId"] || ''),
    'modelId': String(_0x5b4364["modelId"] || ''),
    'adapterType': String(_0x5b4364["adapterType"] || ''),
    'projectId': String(_0x5b4364['projectId'] || ''),
    'canvasId': String(_0x5b4364["canvasId"] || ''),
    'projectTitle': String(_0x5b4364["projectTitle"] || ''),
    'navigation': _0x5b4364["navigation"] || null,
    'nodeId': String(_0x5b4364["nodeId"] || '')["trim"](),
    'assetId': String(_0x5b4364['assetId'] || '')["trim"](),
    'kind': String(_0x5b4364["kind"] || '')["trim"](),
    'source': String(_0x5b4364['source'] || '')['trim']() || "mediaTask",
    'status': String(_0x5b4364["status"] || '')["trim"]() || 'waiting',
    'progress': _0x5b4364["progress"] == null ? null : Math['max'](0x0, Math["min"](0x1, Number(_0x5b4364["progress"]) || 0x0)),
    'message': String(_0x5b4364["message"] || '')["trim"](),
    'error': String(_0x5b4364['error'] || '')["trim"](),
    'remoteTaskId': String(_0x5b4364['remoteTaskId'] || '')["trim"](),
    'cancellable': _0x5b4364["cancellable"] === !![],
    'result': _0x5b4364["result"] && typeof _0x5b4364["result"] === 'object' ? _0x5b4364["result"] : null,
    'thumbnail': _0x5b4364["thumbnail"] || null,
    'createdAt': Number(_0x5b4364["createdAt"] || 0x0) || Date["now"](),
    'startedAt': Number(_0x5b4364['startedAt'] || 0x0) || 0x0,
    'finishedAt': Number(_0x5b4364["finishedAt"] || 0x0) || 0x0,
    'updatedAt': Date["now"]()
  };
}
function getTaskLabel(_0x280293) {
  const _0xd57e32 = String(_0x280293 || '')["trim"]();
  if (!_0xd57e32) {
    return taskCenterText('taskKinds.mediaTask');
  }
  const _0x234a4d = 'taskCenter.taskKinds.' + _0xd57e32;
  const _0x4a14c3 = t(_0x234a4d);
  return _0x4a14c3 === _0x234a4d ? taskCenterText('taskKinds.mediaTask') : _0x4a14c3;
}
function getStatusLabel(_0x347795) {
  const _0xf4ca59 = String(_0x347795 || '')["trim"]();
  if (!_0xf4ca59) {
    return taskCenterText("statuses.fallback");
  }
  const _0x5dfb44 = "taskCenter.statuses." + _0xf4ca59;
  const _0x1b0398 = t(_0x5dfb44);
  return _0x1b0398 === _0x5dfb44 ? taskCenterText("statuses.fallback") : _0x1b0398;
}
function formatDuration(_0x6b7f11) {
  const _0x2ab5a4 = Math["max"](0x0, Math['floor'](Number(_0x6b7f11 || 0x0) / 0x3e8));
  const _0x353d2e = Math['floor'](_0x2ab5a4 / 0x3c);
  const _0x5554af = _0x2ab5a4 % 0x3c;
  if (_0x353d2e <= 0x0) {
    return _0x5554af + 's';
  }
  return _0x353d2e + 'm\x20' + String(_0x5554af)["padStart"](0x2, '0') + 's';
}
function getTaskDuration(_0x87afd6) {
  const _0x2c33ab = Number(_0x87afd6['startedAt'] || _0x87afd6["createdAt"] || 0x0) || 0x0;
  const _0x1cca9e = Number(_0x87afd6["finishedAt"] || 0x0) || (a1596_0x20de66["has"](_0x87afd6['status']) ? Date["now"]() : 0x0);
  if (!_0x2c33ab || !_0x1cca9e) {
    return '';
  }
  return formatDuration(_0x1cca9e - _0x2c33ab);
}
function getResultLocalPath(_0x4185b7) {
  return pickResultLocalPath(_0x4185b7);
}
function sortTasks(_0x2ff3bc) {
  const _0x2ad85a = {
    'processing': 0x0,
    'waiting': 0x1,
    'failed': 0x2,
    'complete': 0x3,
    'cancelled': 0x4
  };
  return [..._0x2ff3bc]["sort"]((_0x350bf6, _0x8552c6) => {
    const _0x4554a6 = _0x2ad85a[_0x350bf6['status']] ?? 0x9;
    const _0xe00d18 = _0x2ad85a[_0x8552c6["status"]] ?? 0x9;
    if (_0x4554a6 !== _0xe00d18) {
      return _0x4554a6 - _0xe00d18;
    }
    return Number(_0x8552c6["createdAt"] || 0x0) - Number(_0x350bf6["createdAt"] || 0x0);
  });
}
function getElectronMediaTaskApi() {
  return desktopBridge["mediaTask"]["isAvailable"]() ? desktopBridge["mediaTask"] : null;
}
export class TaskCenterManager {
  constructor({
    generationCancelTask = a1596_0x2f5fe2,
    generationStore = a1596_0x2716b4,
    contextMenuPresenter = showContextMenu
  } = {}) {
    this["generationCancelTask"] = generationCancelTask;
    this['generationStore'] = generationStore;
    this["contextMenuPresenter"] = contextMenuPresenter;
    this["contextMenuSession"] = null;
    this["panel"] = null;
    this['listEl'] = null;
    this["summaryEl"] = null;
    this["titleEl"] = null;
    this["clearBtn"] = null;
    this["badgeEl"] = null;
    this["tasks"] = new Map();
    this["cardViews"] = new Map();
    this["sectionViews"] = new Map();
    this["pendingActions"] = new Set();
    this['renderTimer'] = 0x0;
    this['clockTimer'] = 0x0;
    this["unsubscribe"] = null;
    this["unsubscribeGenerationTasks"] = null;
    this["unsubscribeLocale"] = null;
    this["initPanel"]();
    this['bindLocaleChange']();
    this["bindMediaTasks"]();
    this['bindGenerationTasks']();
  }
  ["initPanel"]() {
    const _0x5e97af = document["getElementById"]("btnTasks");
    this["badgeEl"] = document["getElementById"]("taskCenterBadge");
    const _0x256428 = document["querySelector"](".sidebar-floating") || document["body"];
    this["panel"] = el("div", "v2-task-center-panel canvas-toolbar-panel-surface");
    this["panel"]["setAttribute"]("aria-label", taskCenterText("ariaLabel"));
    const _0x3509ae = el("div", 'v2-task-center-header');
    this["titleEl"] = el("div", 'v2-task-center-title', taskCenterText("title"));
    this["clearBtn"] = el("button", "v2-task-center-action", taskCenterText('clearDone'));
    this["clearBtn"]["type"] = "button";
    this["clearBtn"]["dataset"]['taskAction'] = "clear-terminal";
    _0x3509ae["append"](this["titleEl"], this['clearBtn']);
    this["summaryEl"] = el("div", "v2-task-center-summary");
    this["listEl"] = el("div", "v2-task-center-list");
    this["mediaController"] = createTaskCenterMediaController(this["listEl"]);
    this['panel']["append"](_0x3509ae, this["summaryEl"], this["listEl"]);
    _0x256428['appendChild'](this["panel"]);
    _0x5e97af && registerSidebarSubmenu({
      'key': "tasks",
      'button': _0x5e97af,
      'panel': this["panel"],
      'open': () => this["show"](),
      'close': () => this["hide"](),
      'isOpen': () => this["panel"]["classList"]["contains"]("show")
    });
    this['panel']["addEventListener"]("click", _0x41a846 => this["handleClick"](_0x41a846));
    this["panel"]["addEventListener"]("contextmenu", _0x2d1013 => this["handleContextMenu"](_0x2d1013));
    this['panel']["addEventListener"]("wheel", _0x14227d => this['handleWheel'](_0x14227d), {
      'passive': ![]
    });
    this["render"]();
  }
  ["handleWheel"](_0x56f8bc) {
    _0x56f8bc['stopPropagation']();
    _0x56f8bc["stopImmediatePropagation"]?.();
    if (!this['listEl'] || this["listEl"]["contains"](_0x56f8bc["target"])) {
      return;
    }
    const _0x5d139e = Number(_0x56f8bc["deltaY"] || 0x0);
    if (!_0x5d139e) {
      return;
    }
    const _0x3ad60f = Number(this["listEl"]["scrollHeight"] || 0x0) > Number(this["listEl"]["clientHeight"] || 0x0);
    if (!_0x3ad60f) {
      return;
    }
    _0x56f8bc["preventDefault"]?.();
    this["listEl"]["scrollTop"] = Math["max"](0x0, Number(this["listEl"]["scrollTop"] || 0x0) + _0x5d139e);
  }
  ["bindLocaleChange"]() {
    this['unsubscribeLocale'] = onLocaleChange(() => {
      this['render']();
    });
  }
  ["bindMediaTasks"]() {
    const _0x2e8472 = getElectronMediaTaskApi();
    if (!_0x2e8472) {
      this['render']();
      return;
    }
    typeof _0x2e8472["onUpdate"] === "function" && (this["unsubscribe"] = _0x2e8472["onUpdate"](_0x4cbfdb => {
      this['upsertTask'](_0x4cbfdb || {});
    }));
    typeof _0x2e8472['list'] === "function" && _0x2e8472["list"]({
      'limit': MAX_TASKS
    })["then"](_0x570313 => {
      if (!Array["isArray"](_0x570313)) {
        return;
      }
      _0x570313["forEach"](_0x5be58e => this["upsertTask"](_0x5be58e, {
        'silent': !![]
      }));
      this["scheduleRender"]();
    })["catch"](() => {});
  }
  ['bindGenerationTasks']() {
    if (!globalThis["window"]?.["addEventListener"]) {
      return;
    }
    const _0x206b57 = _0x1c2683 => {
      this["upsertTask"]({
        ...(_0x1c2683?.["detail"] || {}),
        'source': _0x1c2683?.["detail"]?.["source"] || "generation"
      });
    };
    window['addEventListener'](GENERATION_TASK_CENTER_EVENT, _0x206b57);
    listGenerationTaskCenterUpdates()["forEach"](_0x41f084 => this["upsertTask"](_0x41f084));
    this["unsubscribeGenerationTasks"] = () => {
      window["removeEventListener"](GENERATION_TASK_CENTER_EVENT, _0x206b57);
    };
  }
  ["show"]() {
    this["panel"]?.["classList"]["add"]("show");
    this["mediaController"]?.["setVisible"](!![]);
    document["getElementById"]("btnTasks")?.['classList']['add']("active");
    this['render']();
    this["startClock"]();
  }
  ["hide"]() {
    this["closeContextMenu"]();
    this["mediaController"]?.["setVisible"](![]);
    this["panel"]?.['classList']["remove"]("show");
    document["getElementById"]("btnTasks")?.["classList"]["remove"]("active");
    this["stopClock"]();
    if (this["renderTimer"]) {
      window["cancelAnimationFrame"]?.(this["renderTimer"]);
    }
    this["renderTimer"] = 0x0;
  }
  ['startClock']() {
    if (this["clockTimer"]) {
      return;
    }
    this["clockTimer"] = window['setInterval'](() => {
      if (!this["hasActiveTasks"]()) {
        this['stopClock']();
        return;
      }
      this["render"]();
    }, 0x3e8);
  }
  ["stopClock"]() {
    if (!this["clockTimer"]) {
      return;
    }
    window['clearInterval'](this['clockTimer']);
    this["clockTimer"] = 0x0;
  }
  ["closeContextMenu"]() {
    this["contextMenuSession"]?.["close"]?.();
    this["contextMenuSession"] = null;
    this["contextMenuTaskId"] = '';
  }
  ["hasActiveTasks"]() {
    return [...this['tasks']['values']()]["some"](_0xc28dac => a1596_0x20de66["has"](_0xc28dac["status"]));
  }
  ['retireDuplicateGenerationTasks'](_0xb6ac9b) {
    if (_0xb6ac9b?.["source"] !== "generation" || _0xb6ac9b["kind"] !== "dreaminaVideo" || !_0xb6ac9b["nodeId"] || !a1596_0x20de66['has'](_0xb6ac9b["status"])) {
      return;
    }
    for (const [_0x5c54a9, _0xfe2f03] of this["tasks"]['entries']()) {
      if (_0x5c54a9 === _0xb6ac9b["taskId"]) {
        continue;
      }
      _0xfe2f03?.["source"] === 'generation' && _0xfe2f03['kind'] === "dreaminaVideo" && _0xfe2f03["nodeId"] === _0xb6ac9b["nodeId"] && _0xfe2f03['canvasId'] === _0xb6ac9b['canvasId'] && _0xfe2f03["projectId"] === _0xb6ac9b["projectId"] && a1596_0x20de66["has"](_0xfe2f03["status"]) && this["tasks"]["set"](_0x5c54a9, {
        ..._0xfe2f03,
        'status': "complete",
        'progress': 0x1,
        'message': _0xfe2f03["message"] || "Replaced by latest task",
        'finishedAt': _0xfe2f03["finishedAt"] || Date["now"](),
        'updatedAt': Date['now']()
      });
    }
  }
  ["upsertTask"](_0x50196b, {
    silent = ![]
  } = {}) {
    const _0x488247 = this["tasks"]["get"](_0x50196b?.["taskId"]);
    const _0x65e6c9 = normalizeTask({
      ..._0x488247,
      ..._0x50196b,
      'createdAt': _0x50196b?.["createdAt"] || _0x488247?.["createdAt"],
      'finishedAt': _0x50196b?.["finishedAt"] || _0x488247?.["finishedAt"]
    });
    if (!_0x65e6c9) {
      return;
    }
    if (a1596_0x20de66['has'](_0x65e6c9['status'])) {
      _0x65e6c9["finishedAt"] = 0x0;
      if (_0x488247 && a1596_0x3e7781["has"](_0x488247["status"]) && !_0x50196b["createdAt"]) {
        _0x65e6c9["createdAt"] = Date["now"]();
      }
    }
    if (a1596_0x3e7781["has"](_0x65e6c9["status"]) && !_0x65e6c9["finishedAt"]) {
      _0x65e6c9["finishedAt"] = Date["now"]();
    }
    this["retireDuplicateGenerationTasks"](_0x65e6c9);
    const _0x4f3314 = this["tasks"]["get"](_0x65e6c9['taskId']);
    if (_0x4f3314 && this['contextMenuTaskId'] === _0x65e6c9["taskId"] && (_0x4f3314["status"] !== _0x65e6c9["status"] || _0x4f3314["cancellable"] !== _0x65e6c9['cancellable'])) {
      this['closeContextMenu']();
    }
    this["tasks"]["set"](_0x65e6c9["taskId"], {
      ...(_0x4f3314 || {}),
      ..._0x65e6c9,
      'updatedAt': Date["now"]()
    });
    this["trimTasks"]();
    if (!silent) {
      this["scheduleRender"]();
    }
    if (a1596_0x20de66["has"](_0x65e6c9['status']) && this['panel']?.['classList']["contains"]('show')) {
      this["startClock"]();
    }
  }
  ["trimTasks"]() {
    if (this['tasks']["size"] <= MAX_TASKS) {
      return;
    }
    const _0x2e8b27 = pruneTaskCenterRecords([...this["tasks"]["values"]()], MAX_TASKS);
    this["tasks"] = new Map(_0x2e8b27["map"](_0x53325c => [_0x53325c["taskId"], _0x53325c]));
  }
  ['scheduleRender']() {
    if (!this["panel"]?.["classList"]["contains"]("show")) {
      this["updateBadge"]();
      return;
    }
    if (this["renderTimer"]) {
      return;
    }
    this["renderTimer"] = window["requestAnimationFrame"](() => {
      this["renderTimer"] = 0x0;
      this['render']();
    });
  }
  ['getTaskGroups']() {
    const _0x113737 = sortTasks([...this["tasks"]["values"]()]);
    return {
      'active': _0x113737["filter"](_0x38ddac => a1596_0x20de66["has"](_0x38ddac['status'])),
      'failed': _0x113737["filter"](_0x425cee => _0x425cee["status"] === "failed"),
      'done': _0x113737["filter"](_0xebaf => a1596_0x3e7781["has"](_0xebaf['status']) && _0xebaf["status"] !== 'failed')
    };
  }
  ['updateBadge'](_0x1c54c7) {
    const _0x32e834 = _0x1c54c7 ? _0x1c54c7["active"]["length"] : [...this["tasks"]["values"]()]["filter"](_0xf12e52 => a1596_0x20de66['has'](_0xf12e52["status"]))['length'];
    if (!this["badgeEl"]) {
      return;
    }
    if (this['badgeEl']['hidden'] !== _0x32e834 <= 0x0) {
      this["badgeEl"]['hidden'] = _0x32e834 <= 0x0;
    }
    const _0x4b0b2a = _0x32e834 > 0x63 ? "99+" : String(_0x32e834);
    if (this["badgeEl"]["textContent"] !== _0x4b0b2a) {
      this["badgeEl"]['textContent'] = _0x4b0b2a;
    }
  }
  ["render"]() {
    if (!this["listEl"] || !this["summaryEl"]) {
      return;
    }
    if (!this['panel']?.['classList']["contains"]("show")) {
      this["updateBadge"]();
      return;
    }
    const _0x4a2922 = this["getTaskGroups"]();
    this["updateBadge"](_0x4a2922);
    const _0x3bd8b0 = _0x4a2922['failed']["length"];
    const _0x3f51e1 = _0x4a2922['done']["length"];
    this["panel"]?.["setAttribute"]('aria-label', taskCenterText("ariaLabel"));
    if (this['clearBtn']) {
      this["clearBtn"]['textContent'] = taskCenterText("clearDone");
    }
    if (this["titleEl"]) {
      this["titleEl"]['textContent'] = taskCenterText("title");
    }
    this['summaryEl']["textContent"] = taskCenterText('summary', {
      'active': _0x4a2922["active"]["length"],
      'failed': _0x3bd8b0,
      'done': _0x3f51e1
    });
    if (this["clearBtn"]) {
      this["clearBtn"]["hidden"] = _0x3f51e1 + _0x3bd8b0 <= 0x0;
    }
    const _0x4a826b = [];
    for (const [_0x2938c6, _0x564a9b] of Object["entries"](_0x4a2922)) {
      if (!_0x564a9b['length']) {
        const _0x55b00d = this['sectionViews']['get'](_0x2938c6);
        if (_0x55b00d) {
          syncTaskElements(_0x55b00d, [_0x55b00d["children"][0x0]]);
        }
        continue;
      }
      let _0x1c7455 = this["sectionViews"]["get"](_0x2938c6);
      !_0x1c7455 && (_0x1c7455 = el("section", "v2-task-center-section"), _0x1c7455["appendChild"](el("div", "v2-task-center-section-title")), this["sectionViews"]["set"](_0x2938c6, _0x1c7455));
      _0x1c7455["children"][0x0]["textContent"] = taskCenterText("sections." + _0x2938c6);
      syncTaskElements(_0x1c7455, [_0x1c7455["children"][0x0], ..._0x564a9b['map'](_0x12ec2c => this["renderTaskCard"](_0x12ec2c))]);
      _0x4a826b["push"](_0x1c7455);
    }
    !_0x4a826b["length"] && (this["emptyEl"] ||= el("div", "v2-task-center-empty"), this['emptyEl']['textContent'] = taskCenterText('empty'), _0x4a826b["push"](this['emptyEl']));
    syncTaskElements(this['listEl'], _0x4a826b);
    for (const _0x17fc5c of this["cardViews"]['keys']()) {
      if (!this["tasks"]["has"](_0x17fc5c)) {
        this["cardViews"]['delete'](_0x17fc5c);
      }
    }
    this["mediaController"]?.["sync"](this['cardViews']['values']());
  }
  ['renderTaskCard'](_0x4cdf2f) {
    let _0x363c2b = this["cardViews"]["get"](_0x4cdf2f["taskId"]);
    !_0x363c2b && (_0x363c2b = createTaskCardView(_0x4cdf2f["taskId"]), this["cardViews"]["set"](_0x4cdf2f['taskId'], _0x363c2b));
    const _0x2e0446 = getTaskDuration(_0x4cdf2f);
    const _0x2f510c = [];
    const _0x219fb1 = (_0x4c3eaf, _0xd63875, _0x240f89 = {}) => _0x2f510c["push"]({
      'id': _0x4c3eaf,
      'label': this['pendingActions']["has"](_0x4cdf2f["taskId"] + ':' + _0x4c3eaf) ? taskCenterText("pendingAction") : taskCenterText(_0xd63875),
      'pending': this["pendingActions"]['has'](_0x4cdf2f['taskId'] + ':' + _0x4c3eaf),
      ..._0x240f89
    });
    if (a1596_0x20de66["has"](_0x4cdf2f["status"]) && _0x4cdf2f['cancellable']) {
      _0x219fb1('cancel', "actions.cancel", {
        'danger': !![]
      });
    }
    if (_0x4cdf2f['navigation']) {
      _0x219fb1("locate", 'actions.locate');
    }
    if (getProviderTaskConsoleUrl(_0x4cdf2f)) {
      _0x219fb1("api-console", "actions.apiConsole");
    }
    if (_0x4cdf2f["remoteTaskId"]) {
      _0x219fb1('copy-task-id', 'actions.copyTaskId');
    }
    const _0x308fa3 = getResultLocalPath(_0x4cdf2f["result"]);
    if (_0x308fa3) {
      _0x219fb1("reveal", "actions.reveal", {
        'localPath': _0x308fa3
      });
    }
    if (_0x4cdf2f["error"]) {
      _0x219fb1('copy-error', "actions.copyError");
    }
    const _0x4f762c = _0x4cdf2f['status'] === "complete" ? _0x4cdf2f['thumbnail'] || resolveTaskCenterThumbnail(_0x4cdf2f["result"], _0x4cdf2f["kind"]) : null;
    _0x363c2b['update']({
      'title': _0x4cdf2f['title'] || getTaskLabel(_0x4cdf2f["kind"]),
      'context': [_0x4cdf2f["projectTitle"], _0x4cdf2f["provider"], _0x4cdf2f['modelId']]['filter'](Boolean)["join"](" · "),
      'meta': [_0x4cdf2f["message"] || getStatusLabel(_0x4cdf2f["status"]), _0x2e0446 ? taskCenterText('duration', {
        'duration': _0x2e0446
      }) : '']["filter"](Boolean)['join'](" · "),
      'status': _0x4cdf2f["status"],
      'statusLabel': getStatusLabel(_0x4cdf2f["status"]),
      'active': a1596_0x20de66["has"](_0x4cdf2f["status"]),
      'progress': _0x4cdf2f['progress'],
      'error': _0x4cdf2f['error'],
      'remoteId': _0x4cdf2f["remoteTaskId"],
      'actions': _0x2f510c,
      'thumbnail': _0x4f762c,
      'thumbnailLabel': _0x4f762c ? taskCenterText("resultPreview", {
        'count': _0x4f762c['count']
      }) : ''
    });
    return _0x363c2b["card"];
  }
  ["handleClick"](_0x1eff0e) {
    const _0x5834a6 = _0x1eff0e['target']["closest"]('[data-task-action]');
    if (!_0x5834a6 || _0x5834a6['disabled']) {
      return;
    }
    _0x1eff0e["preventDefault"]();
    _0x1eff0e["stopPropagation"]();
    const _0xd96d5e = _0x5834a6["dataset"]['taskAction'] || '';
    this["runTaskAction"](_0xd96d5e, {
      'taskId': _0x5834a6['dataset']["taskId"] || '',
      'localPath': _0x5834a6["dataset"]["localPath"] || ''
    });
  }
  ['handleContextMenu'](_0x107a42) {
    const _0x39c6f9 = _0x107a42["target"]?.['closest']?.(".v2-task-card");
    if (!_0x39c6f9 || !this['panel']?.['contains']?.(_0x39c6f9)) {
      return;
    }
    const _0x5939bd = String(_0x39c6f9['dataset']["taskId"] || '');
    const _0x13eb10 = this["tasks"]["get"](_0x5939bd);
    if (!_0x13eb10) {
      return;
    }
    const _0x3d8530 = [];
    a1596_0x20de66["has"](_0x13eb10["status"]) && _0x13eb10['cancellable'] === !![] && _0x3d8530["push"]({
      'label': taskCenterText("actions.cancel"),
      'icon': "cancel",
      'danger': !![],
      'shortcutActionId': "context-task-cancel",
      'action': () => this["runTaskAction"]("cancel", {
        'taskId': _0x5939bd
      })
    });
    const _0xe0118e = getResultLocalPath(_0x13eb10["result"]);
    _0xe0118e && _0x3d8530["push"]({
      'label': taskCenterText("actions.reveal"),
      'icon': "reveal",
      'shortcutActionId': 'context-task-reveal',
      'disabled': !desktopBridge["shell"]["canShowItemInFolder"](),
      'action': () => this["runTaskAction"]("reveal", {
        'localPath': _0xe0118e
      })
    });
    _0x13eb10['error'] && _0x3d8530['push']({
      'label': taskCenterText("actions.copyError"),
      'icon': 'copy',
      'shortcutActionId': "context-task-copy-error",
      'action': () => this["runTaskAction"]("copy-error", {
        'taskId': _0x5939bd
      })
    });
    if (!_0x3d8530["length"]) {
      return;
    }
    _0x107a42["preventDefault"]();
    _0x107a42["stopPropagation"]();
    this["closeContextMenu"]();
    this["contextMenuTaskId"] = _0x5939bd;
    this["contextMenuSession"] = this['contextMenuPresenter'](_0x107a42["clientX"], _0x107a42["clientY"], _0x3d8530, {
      'ensureItemIcons': !![],
      'ownerElement': _0x39c6f9,
      'ownerRoot': this["panel"]
    });
  }
  ['runTaskAction'](_0x1a9087, {
    taskId = '',
    localPath = ''
  } = {}) {
    if (_0x1a9087 === 'clear-terminal') {
      this["closeContextMenu"]();
      for (const [_0x402ded, _0x5910bd] of this["tasks"]) {
        if (a1596_0x3e7781["has"](_0x5910bd["status"])) {
          this["tasks"]['delete'](_0x402ded);
        }
      }
      this["render"]();
      return Promise["resolve"]();
    }
    const _0x40cdea = taskId + ':' + _0x1a9087;
    if (this['pendingActions']["has"](_0x40cdea)) {
      return Promise["resolve"]();
    }
    this['pendingActions']["add"](_0x40cdea);
    this["render"]();
    return executeTaskCenterAction(this, _0x1a9087, this["tasks"]["get"](taskId), localPath, taskCenterText)['catch'](_0x444e40 => window["showToast"]?.(_0x444e40?.["message"] || taskCenterText("actionFailed"), "error"))["finally"](() => {
      this["pendingActions"]["delete"](_0x40cdea);
      this["render"]();
    });
  }
}
export function initTaskCenterManager(_0x5e8125 = {}) {
  if (globalThis["window"]?.["__aiCanvasTaskCenterManager"]) {
    return globalThis["window"]["__aiCanvasTaskCenterManager"];
  }
  const _0x512d1c = new TaskCenterManager(_0x5e8125);
  globalThis['window']['__aiCanvasTaskCenterManager'] = _0x512d1c;
  return _0x512d1c;
}