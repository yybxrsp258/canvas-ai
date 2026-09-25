import a1642_0x4bba1e, { graphStore as a1642_0x5c9238, uiStore as a1642_0x25c0e0, workspaceStore as a1642_0x168cec } from '../../core/stores/appStore.js';
import { screenToWorld } from '../../core/math.js';
import { getLocale, t } from '../../i18n/index.js';
import { commit } from '../history.js';
import { applyWorkflowToCanvas, sliceCanvasStateForWorkflow, normalizeWorkflowTags, WORKFLOW_LIMITS } from './workflowCanvas.js';
import { DEFAULT_WORKFLOW_COVER_ID, createWorkflowSnapshotCoverCandidate, extractWorkflowCoverCandidates, getDefaultWorkflowCoverCandidate } from './workflowCovers.js';
import { buildWorkflowContentPreviewItems, buildWorkflowSourceSummary } from './workflowPreview.js';
import { filterWorkflows, findWorkflowById } from './workflowSelectors.js';
import { deleteWorkflow, loadWorkflowsFromServer, renameWorkflow, saveNewWorkflowFromCanvas, saveWorkflowMeta, saveUpdatedWorkflowFromCanvas, saveWorkflowUsage } from './workflowService.js';
import { playWorkflowSaveFly } from './workflowSaveAnimation.js';
import { registerSidebarSubmenu } from '../sidebarSubmenuController.js';
import { showContextMenu } from '../interaction/contextMenuPresenter.js';
import { TEXT_CONTEXT_MENU_TARGET_SELECTOR } from '../textInputContextMenu.js';
const graphStore = a1642_0x4bba1e?.["graphStore"] || a1642_0x5c9238 || a1642_0x4bba1e;
const uiStore = a1642_0x4bba1e?.["uiStore"] || a1642_0x25c0e0 || a1642_0x4bba1e;
const workspaceStore = a1642_0x4bba1e?.["workspaceStore"] || a1642_0x168cec || a1642_0x4bba1e;
function getState() {
  return {
    ...graphStore["getState"](),
    ...uiStore["getState"](),
    ...workspaceStore["getState"]()
  };
}
function getStateRaw() {
  return {
    ...graphStore['getStateRaw'](),
    ...uiStore["getStateRaw"](),
    ...workspaceStore["getStateRaw"]()
  };
}
function el(_0x4a429a, _0x57cda9 = '', _0x1fa938 = '') {
  const _0x36aa12 = document["createElement"](_0x4a429a);
  if (_0x57cda9) {
    _0x36aa12["className"] = _0x57cda9;
  }
  if (_0x1fa938) {
    _0x36aa12["textContent"] = _0x1fa938;
  }
  return _0x36aa12;
}
function cleanText(_0x4287a2) {
  return String(_0x4287a2 ?? '')["trim"]();
}
function workflowText(_0x24eeec, _0x379df3 = {}) {
  return t("workflows.manager." + _0x24eeec, _0x379df3);
}
function formatDateTime(_0x1aa7f5) {
  const _0x436339 = Number(_0x1aa7f5);
  if (!Number['isFinite'](_0x436339) || _0x436339 <= 0x0) {
    return workflowText("unknown");
  }
  return new Date(_0x436339)["toLocaleString"](getLocale(), {
    'year': 'numeric',
    'month': "2-digit",
    'day': "2-digit",
    'hour': "2-digit",
    'minute': "2-digit"
  });
}
function formatShortDate(_0x8d1f04) {
  const _0x4baf77 = Number(_0x8d1f04);
  if (!Number["isFinite"](_0x4baf77) || _0x4baf77 <= 0x0) {
    return workflowText("unknown");
  }
  return new Date(_0x4baf77)['toLocaleDateString'](getLocale(), {
    'month': "2-digit",
    'day': "2-digit"
  });
}
function formatWorkflowMetaLine(_0x496f19) {
  const _0x14171a = Number(_0x496f19?.["nodeCount"] || _0x496f19?.['workflowData']?.["nodes"]?.["length"] || 0x0) || 0x0;
  const _0x38388b = Number(_0x496f19?.["edgeCount"] || _0x496f19?.["workflowData"]?.["edges"]?.["length"] || 0x0) || 0x0;
  const _0x513b85 = Number(_0x496f19?.["lastUsedAt"] || 0x0) || 0x0;
  const _0x290d7f = Number(_0x496f19?.['updatedAt'] || 0x0) || 0x0;
  const _0x22c91b = _0x513b85 > 0x0 ? workflowText("meta.used", {
    'date': formatShortDate(_0x513b85)
  }) : workflowText("meta.updated", {
    'date': formatShortDate(_0x290d7f)
  });
  return workflowText("meta.line", {
    'nodeCount': _0x14171a,
    'edgeCount': _0x38388b,
    'time': _0x22c91b
  });
}
function showToast(_0x3c83b6, _0x1d9ab7 = "info") {
  window['showToast']?.(_0x3c83b6, _0x1d9ab7);
}
function appendCoverPlaceholder(_0x14350b, _0x3da23c = "Canvas AI") {
  if (!_0x14350b) {
    return;
  }
  _0x14350b["replaceChildren"](el("div", "v2-workflow-cover-placeholder", _0x3da23c));
}
const WORKFLOW_UPDATE_ENTRY_ENABLED = ![];
const WORKFLOW_MODAL_TABS_ENABLED = WORKFLOW_UPDATE_ENTRY_ENABLED;
function buildWorkflowListRenderKey(_0x2bbbd7 = []) {
  if (!Array["isArray"](_0x2bbbd7)) {
    return '';
  }
  return _0x2bbbd7["map"](_0x29a51a => {
    const _0x3cd306 = Array["isArray"](_0x29a51a?.['tags']) ? _0x29a51a["tags"]['map'](cleanText)["filter"](Boolean)['join'](',') : '';
    return [cleanText(_0x29a51a?.['id']), cleanText(_0x29a51a?.['name']), cleanText(_0x29a51a?.['cover'] || _0x29a51a?.["coverUrl"]), cleanText(_0x29a51a?.["note"]), _0x3cd306, Number(_0x29a51a?.["updatedAt"] || 0x0) || 0x0, Number(_0x29a51a?.["nodeCount"] || 0x0) || 0x0, Number(_0x29a51a?.["edgeCount"] || 0x0) || 0x0]["join"]('|');
  })['join'](';');
}
export class WorkflowManager {
  constructor() {
    this["sidebarPanel"] = null;
    this["sidebarContent"] = null;
    this["modal"] = null;
    this["modalDialog"] = null;
    this['modalBody'] = null;
    this["_hideTimer"] = 0x0;
    this["_loadingPromise"] = null;
    this['_pendingDeleteWorkflowId'] = '';
    this['_renamingWorkflowId'] = '';
    this['_contextMenuSession'] = null;
    this["initSidebarPanel"]();
    this['initModal']();
    this["bindGlobalEvents"]();
    this["loadWorkflows"]();
    workspaceStore['subscribeSelector'](_0x414ced => ({
      'workflowsKey': buildWorkflowListRenderKey(_0x414ced["workflows"]?.["items"]),
      'workflowsLoading': _0x414ced['workflows']?.["loading"] === !![],
      'workflowsError': _0x414ced["workflows"]?.['error'] || null,
      'panelOpen': _0x414ced["workflowUi"]?.['panelOpen'],
      'panelPinned': _0x414ced["workflowUi"]?.["panelPinned"],
      'searchKeyword': _0x414ced['workflowUi']?.["searchKeyword"],
      'detailWorkflowId': _0x414ced['workflowUi']?.["detailWorkflowId"]
    }), () => this['renderSidebar']());
  }
  ["bindGlobalEvents"]() {
    const _0x1745fd = _0x4d3ea0 => {
      _0x4d3ea0?.["preventDefault"]?.();
      this["openCreateModal"](_0x4d3ea0?.["detail"]?.["groupId"] || null);
    };
    document['addEventListener']("workflow:create-request", _0x1745fd);
    window["addEventListener"]("workflow:create-request", _0x1745fd);
  }
  ["initSidebarPanel"]() {
    const _0x3913f5 = document['querySelector'](".sidebar-floating") || document["body"];
    const _0x3c6f5b = document['getElementById']("btnWorkflows");
    this['sidebarPanel'] = el("div", "v2-workflow-sidebar-panel canvas-toolbar-panel-surface");
    this["sidebarPanel"]["setAttribute"]("aria-label", workflowText("sidebarAria"));
    const _0x5b6095 = el("div", "v2-workflow-sidebar-header");
    const _0x478720 = el("button", "v2-workflow-back", '‹');
    _0x478720['type'] = "button";
    _0x478720['dataset']["action"] = 'workflow-back';
    const _0x235464 = el("div", "v2-workflow-sidebar-title");
    this["sidebarTitleTextEl"] = el("span", "v2-workflow-title-text", workflowText("title"));
    _0x235464["appendChild"](this["sidebarTitleTextEl"]);
    _0x5b6095["append"](_0x478720, _0x235464);
    const _0x5025f5 = el("div", 'v2-workflow-search');
    const _0x2b4325 = el('input', "v2-workflow-search-input");
    _0x2b4325['type'] = 'search';
    _0x2b4325["placeholder"] = workflowText("searchPlaceholder");
    _0x2b4325['dataset']["role"] = 'workflow-search';
    _0x5025f5["appendChild"](_0x2b4325);
    this["sidebarContent"] = el("div", "v2-workflow-list");
    this["sidebarPanel"]['append'](_0x5b6095, _0x5025f5, this["sidebarContent"]);
    _0x3913f5["appendChild"](this["sidebarPanel"]);
    _0x3c6f5b && registerSidebarSubmenu({
      'key': "workflows",
      'button': _0x3c6f5b,
      'panel': this["sidebarPanel"],
      'open': () => this['openSidebar'](![]),
      'close': () => {
        this["hideSidebar"]();
        workspaceStore["setWorkflowUi"]({
          'panelOpen': ![],
          'panelPinned': ![],
          'detailWorkflowId': null
        });
      },
      'isOpen': () => getState()["workflowUi"]?.['panelOpen'] === !![]
    });
    this['sidebarPanel']["addEventListener"]("click", _0x166fb0 => this['handleSidebarClick'](_0x166fb0));
    this["sidebarPanel"]["addEventListener"]("contextmenu", _0x8d9091 => this["handleSidebarContextMenu"](_0x8d9091));
    this['sidebarPanel']["addEventListener"]('keydown', _0x2d46a7 => {
      if (_0x2d46a7["target"]?.["dataset"]?.["role"] !== "workflow-rename-input") {
        return;
      }
      this["handleSidebarRenameKeydown"](_0x2d46a7);
    });
    this["sidebarPanel"]["addEventListener"]("focusout", _0x9b973 => {
      const _0x146906 = _0x9b973["target"];
      if (_0x146906?.["dataset"]?.["role"] !== 'workflow-rename-input') {
        return;
      }
      if (_0x146906["dataset"]["submitted"] === '1') {
        return;
      }
      this["commitWorkflowRename"](_0x146906['dataset']["workflowId"], _0x146906["value"]);
    });
    this["sidebarPanel"]["addEventListener"]("input", _0x10a35c => {
      const _0x7ae1d3 = _0x10a35c["target"];
      if (_0x7ae1d3?.["dataset"]?.['role'] !== "workflow-search") {
        return;
      }
      workspaceStore["setWorkflowUi"]({
        'searchKeyword': _0x7ae1d3['value'] || ''
      });
    });
  }
  ['initModal']() {
    this['modal'] = el("div", "v2-workflow-modal-backdrop");
    this["modal"]["setAttribute"]("aria-hidden", "true");
    this['modalDialog'] = el("div", 'v2-workflow-modal');
    this["modalDialog"]["setAttribute"]("role", "dialog");
    this["modalDialog"]["setAttribute"]("aria-label", workflowText("title"));
    const _0x190c23 = el('div', "v2-workflow-modal-header");
    const _0x3f69db = el("div", "v2-workflow-modal-title");
    this["modalTitleTextEl"] = el("span", 'v2-workflow-title-text', workflowText('title'));
    _0x3f69db["appendChild"](this["modalTitleTextEl"]);
    const _0x2eae7a = el("button", "v2-workflow-icon-btn", '×');
    _0x2eae7a['type'] = 'button';
    _0x2eae7a["dataset"]["action"] = "workflow-modal-close";
    _0x190c23["append"](_0x3f69db, _0x2eae7a);
    this["modalBody"] = el("div", "v2-workflow-modal-body");
    if (WORKFLOW_MODAL_TABS_ENABLED) {
      const _0x21c655 = el("div", "v2-workflow-modal-tabs");
      const _0x531e41 = [["create", workflowText("tabs.create")]];
      WORKFLOW_UPDATE_ENTRY_ENABLED && _0x531e41["push"](['update', workflowText("tabs.update")]);
      for (const [_0x2c745e, _0x6b5375] of _0x531e41) {
        const _0x936555 = el("button", "v2-workflow-modal-tab", _0x6b5375);
        _0x936555["type"] = "button";
        _0x936555["dataset"]["modalTab"] = _0x2c745e;
        _0x21c655['appendChild'](_0x936555);
      }
      this["modalDialog"]["append"](_0x190c23, _0x21c655, this["modalBody"]);
    } else {
      this["modalDialog"]['append'](_0x190c23, this['modalBody']);
    }
    this["modal"]["appendChild"](this["modalDialog"]);
    document["body"]['appendChild'](this["modal"]);
    this["modal"]["addEventListener"]("click", _0x3cfa7e => {
      const _0x1d73b3 = _0x3cfa7e["target"]['closest']("[data-action]");
      if (_0x1d73b3?.["dataset"]?.['action'] === 'workflow-modal-close') {
        this["closeModal"]();
        return;
      }
      _0x3cfa7e['target'] === this["modal"] && this['closeModal']();
    });
    this['modal']["addEventListener"]("click", _0x50f26f => this["handleModalClick"](_0x50f26f));
    this["modal"]["addEventListener"]("input", _0x103291 => this["handleModalInput"](_0x103291));
    this["modal"]['addEventListener']("keydown", _0x3753d4 => this["handleModalKeydown"](_0x3753d4));
  }
  async ["loadWorkflows"]() {
    if (this["_loadingPromise"]) {
      return this["_loadingPromise"];
    }
    workspaceStore["setWorkflowsLoading"](!![]);
    this["_loadingPromise"] = loadWorkflowsFromServer()['then'](_0x3324af => {
      const _0x1cbfb1 = new Map();
      for (const _0x276391 of getState()["workflows"]?.['items'] || []) {
        if (_0x276391?.['id']) {
          _0x1cbfb1["set"](_0x276391['id'], _0x276391);
        }
      }
      for (const _0x33a4fd of _0x3324af || []) {
        if (_0x33a4fd?.['id']) {
          _0x1cbfb1["set"](_0x33a4fd['id'], _0x33a4fd);
        }
      }
      const _0x26309b = Array['from'](_0x1cbfb1["values"]());
      workspaceStore["setWorkflows"](_0x26309b);
      return _0x26309b;
    })["catch"](_0x18e225 => {
      workspaceStore["setWorkflowsLoading"](![], _0x18e225?.['message'] || workflowText("loadFailed"));
      showToast(workflowText("loadFailed"), "error");
      return [];
    })["finally"](() => {
      this["_loadingPromise"] = null;
    });
    return this["_loadingPromise"];
  }
  ["openSidebar"](_0x2f8983 = ![]) {
    clearTimeout(this["_hideTimer"]);
    workspaceStore["setWorkflowUi"]({
      'panelOpen': !![],
      'panelPinned': _0x2f8983 === !![]
    });
    const _0x23e628 = getState()["workflows"] || {};
    !_0x23e628["loadedAt"] && !_0x23e628["loading"] && this["loadWorkflows"]();
  }
  ['scheduleCloseSidebar']() {
    clearTimeout(this["_hideTimer"]);
    this["_hideTimer"] = window["setTimeout"](() => {
      const _0x332c5b = getState()["workflowUi"] || {};
      !_0x332c5b["panelPinned"] && (this['hideSidebar'](), workspaceStore["setWorkflowUi"]({
        'panelOpen': ![]
      }));
    }, 0xb4);
  }
  ["hideSidebar"]() {
    clearTimeout(this['_hideTimer']);
    this['_contextMenuSession']?.["close"]?.();
    this["_contextMenuSession"] = null;
    this["_pendingDeleteWorkflowId"] = '';
    this["_renamingWorkflowId"] = '';
    this['sidebarPanel']?.["classList"]["remove"]("show");
    const _0x3e0235 = document["getElementById"]("btnWorkflows");
    _0x3e0235?.['classList']["remove"]('active');
  }
  ['renderSidebar']() {
    if (!this["sidebarPanel"] || !this["sidebarContent"]) {
      return;
    }
    this["_contextMenuSession"]?.["close"]?.();
    this["_contextMenuSession"] = null;
    const _0x44bfcd = getState();
    const _0x2cbae3 = _0x44bfcd["workflows"]?.["items"] || [];
    const _0x3b8375 = _0x44bfcd["workflows"] || {};
    const _0x350753 = _0x44bfcd["workflowUi"] || {};
    const _0x29a3ec = document["getElementById"]("btnWorkflows");
    this["sidebarPanel"]["classList"]['toggle']("show", _0x350753["panelOpen"] === !![]);
    _0x29a3ec?.["classList"]["toggle"]("active", _0x350753["panelOpen"] === !![] || _0x350753["panelPinned"] === !![]);
    const _0x2ef429 = this["sidebarPanel"]["querySelector"]('.v2-workflow-back');
    _0x2ef429?.["classList"]['toggle']('show', !!_0x350753["detailWorkflowId"]);
    this["sidebarTitleTextEl"] && (this['sidebarTitleTextEl']["textContent"] = _0x350753["detailWorkflowId"] ? workflowText('detailTitle') : workflowText('title'));
    const _0x5a70d1 = this['sidebarPanel']["querySelector"]("[data-role='workflow-search']");
    _0x5a70d1 && _0x5a70d1["value"] !== (_0x350753["searchKeyword"] || '') && (_0x5a70d1["value"] = _0x350753["searchKeyword"] || '');
    this["sidebarContent"]["replaceChildren"]();
    if (_0x350753["detailWorkflowId"]) {
      this["_pendingDeleteWorkflowId"] = '';
      this["_renamingWorkflowId"] = '';
      this["renderWorkflowDetail"](_0x2cbae3, _0x350753["detailWorkflowId"]);
      return;
    }
    if (_0x3b8375["loading"]) {
      this['renderLoadingList']();
      return;
    }
    const _0x17652d = filterWorkflows(_0x2cbae3, _0x350753["searchKeyword"]);
    if (_0x17652d["length"] === 0x0) {
      const _0x22e42c = cleanText(_0x350753["searchKeyword"]) ? workflowText("empty.noMatches") : workflowText("empty.noWorkflows");
      this["sidebarContent"]['appendChild'](this["renderEmpty"](_0x22e42c));
      return;
    }
    for (const _0x32f544 of _0x17652d) {
      this["sidebarContent"]["appendChild"](this['renderWorkflowCard'](_0x32f544));
    }
  }
  ["renderLoadingList"]() {
    for (let _0x31239e = 0x0; _0x31239e < 0x4; _0x31239e++) {
      this["sidebarContent"]["appendChild"](el('div', "v2-workflow-skeleton"));
    }
  }
  ["renderEmpty"](_0x496708) {
    const _0x131267 = el("div", "v2-workflow-empty");
    const _0x4f0121 = el("div", "v2-workflow-empty-text", _0x496708);
    _0x131267["appendChild"](_0x4f0121);
    return _0x131267;
  }
  ["renderCover"](_0x4842e8, _0x5d0ab5 = "v2-workflow-cover", _0x168c82 = "Canvas AI") {
    const _0x370106 = el("div", _0x5d0ab5);
    const _0xd7f3da = cleanText(_0x4842e8);
    appendCoverPlaceholder(_0x370106, _0x168c82);
    if (_0xd7f3da) {
      const _0x4e0c88 = el('img');
      _0x4e0c88["src"] = _0xd7f3da;
      _0x4e0c88["alt"] = workflowText("coverAlt");
      _0x4e0c88['draggable'] = ![];
      _0x4e0c88["decoding"] = "async";
      _0x4e0c88["addEventListener"]("load", () => {
        if (_0x370106["isConnected"]) {
          _0x370106["replaceChildren"](_0x4e0c88);
        }
      }, {
        'once': !![]
      });
    }
    return _0x370106;
  }
  ['renderWorkflowCard'](_0x31c070) {
    const _0x17e1b2 = el("article", "v2-workflow-card");
    const _0x5831a2 = String(_0x31c070?.['id'] || '');
    _0x17e1b2['dataset']['workflowId'] = _0x5831a2;
    _0x17e1b2["dataset"]['action'] = "workflow-view";
    _0x17e1b2["appendChild"](this['renderCover'](_0x31c070["cover"]));
    const _0xc0c34a = getState()['workflowUi']?.["applyingWorkflowId"];
    const _0x9bb9ff = el('button', "v2-workflow-card-load");
    _0x9bb9ff["type"] = "button";
    _0x9bb9ff['dataset']["action"] = "workflow-apply";
    _0x9bb9ff["dataset"]["workflowId"] = _0x5831a2;
    _0x9bb9ff["disabled"] = _0xc0c34a === _0x31c070['id'];
    _0x9bb9ff['title'] = workflowText('loadToCanvas');
    _0x9bb9ff["setAttribute"]("aria-label", workflowText("loadToCanvas"));
    _0x9bb9ff["innerHTML"] = '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20aria-hidden=\x22true\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22><path\x20d=\x22M16.5\x205.5a7.5\x207.5\x200\x201\x200-1\x2013.5\x22/><path\x20d=\x22M12\x2014h6v6\x22/><path\x20d=\x22m18\x2014-6\x206\x22/></svg>';
    const _0x2fa8c4 = el("button", 'v2-workflow-card-delete');
    _0x2fa8c4['type'] = "button";
    _0x2fa8c4['dataset']["action"] = "workflow-delete-open";
    _0x2fa8c4["dataset"]["workflowId"] = _0x5831a2;
    _0x2fa8c4["setAttribute"]("aria-label", workflowText('deleteWorkflow'));
    _0x2fa8c4["innerHTML"] = '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20aria-hidden=\x22true\x22><path\x20fill=\x22currentColor\x22\x20d=\x22M9\x203h6l1\x202h5v2H3V5h5l1-2zm1\x206h2v10h-2V9zm4\x200h2v10h-2V9zM7\x209h2v10H7V9z\x22/></svg>';
    const _0x83996 = el("div", "v2-workflow-card-delete-confirm");
    _0x83996["hidden"] = this['_pendingDeleteWorkflowId'] !== _0x5831a2;
    const _0x3d8831 = el("button", "v2-workflow-card-delete-confirm-btn v2-workflow-card-delete-confirm-btn--danger", '✔');
    _0x3d8831["type"] = "button";
    _0x3d8831["dataset"]['action'] = "workflow-delete-confirm";
    _0x3d8831["dataset"]['workflowId'] = _0x5831a2;
    _0x3d8831["setAttribute"]("aria-label", workflowText('confirm'));
    const _0x27bbc7 = el("button", "v2-workflow-card-delete-confirm-btn v2-workflow-card-delete-confirm-btn--neutral", '×');
    _0x27bbc7["type"] = 'button';
    _0x27bbc7["dataset"]["action"] = "workflow-delete-cancel";
    _0x27bbc7["dataset"]["workflowId"] = _0x5831a2;
    _0x27bbc7['setAttribute']("aria-label", workflowText("cancel"));
    _0x83996["append"](_0x3d8831, _0x27bbc7);
    _0x2fa8c4["hidden"] = this["_pendingDeleteWorkflowId"] === _0x5831a2;
    _0x17e1b2["append"](_0x9bb9ff, _0x2fa8c4, _0x83996);
    const _0x41a9ed = el("div", "v2-workflow-card-info");
    const _0x36862d = el('div', "v2-workflow-card-title");
    _0x36862d['dataset']["action"] = "workflow-rename-open";
    _0x36862d["dataset"]["workflowId"] = _0x5831a2;
    if (this["_renamingWorkflowId"] === _0x5831a2) {
      _0x36862d["classList"]["add"]('is-editing');
      _0x36862d['removeAttribute']("data-action");
      _0x36862d['removeAttribute']('data-workflow-id');
      const _0x5d65bd = el('input', "v2-workflow-card-title-input");
      _0x5d65bd["type"] = "text";
      _0x5d65bd["value"] = _0x31c070['name'] || '';
      _0x5d65bd["maxLength"] = WORKFLOW_LIMITS["nameMax"];
      _0x5d65bd["dataset"]["role"] = 'workflow-rename-input';
      _0x5d65bd["dataset"]["workflowId"] = _0x5831a2;
      _0x5d65bd["setAttribute"]('aria-label', workflowText("name"));
      _0x36862d["appendChild"](_0x5d65bd);
      window["requestAnimationFrame"](() => {
        if (!_0x5d65bd["isConnected"]) {
          return;
        }
        _0x5d65bd['focus']();
        _0x5d65bd['select']?.();
      });
    } else {
      _0x36862d['textContent'] = _0x31c070['name'] || workflowText("unnamedWorkflow");
    }
    _0x41a9ed["appendChild"](_0x36862d);
    const _0x38fa23 = cleanText(_0x31c070['note']);
    const _0x14bad5 = el("button", "v2-workflow-note-hint", '!');
    _0x14bad5["type"] = 'button';
    _0x14bad5["dataset"]["note"] = _0x38fa23 || workflowText("empty.noNote");
    _0x14bad5["title"] = _0x38fa23 || workflowText("empty.noNote");
    _0x14bad5['setAttribute']('aria-label', _0x38fa23 ? workflowText('noteAria', {
      'note': _0x38fa23
    }) : workflowText("empty.noNote"));
    _0x41a9ed["appendChild"](_0x14bad5);
    _0xc0c34a === _0x31c070['id'] && _0x17e1b2['classList']["add"]("is-applying");
    _0x17e1b2['appendChild'](_0x41a9ed);
    return _0x17e1b2;
  }
  ["renderWorkflowDetail"](_0x3c2842, _0x35cb44) {
    const _0x58a9d8 = findWorkflowById(_0x3c2842, _0x35cb44);
    if (!_0x58a9d8) {
      this["sidebarContent"]["appendChild"](this["renderEmpty"](workflowText("workflowMissing")));
      return;
    }
    const _0x257356 = el("div", "v2-workflow-detail");
    _0x257356["appendChild"](this["renderCover"](_0x58a9d8['cover'], "v2-workflow-detail-cover"));
    _0x257356["appendChild"](el("div", "v2-workflow-detail-title", _0x58a9d8["name"]));
    _0x257356["appendChild"](el("div", "v2-workflow-detail-meta", formatWorkflowMetaLine(_0x58a9d8)));
    const _0x1ae2d5 = (_0x58a9d8["tags"] || [])["map"](_0x421cda => cleanText(_0x421cda))["filter"](Boolean);
    if (_0x1ae2d5["length"] > 0x0) {
      const _0x212c39 = el("div", 'v2-workflow-tags');
      for (const _0x40324e of _0x1ae2d5) {
        _0x212c39["appendChild"](el("span", 'v2-workflow-tag', _0x40324e));
      }
      _0x257356["appendChild"](_0x212c39);
    }
    const _0x350f61 = el("section", "v2-workflow-detail-section");
    _0x350f61["appendChild"](el("div", "v2-workflow-detail-section-title", workflowText("content")));
    const _0x5ced49 = buildWorkflowContentPreviewItems(_0x58a9d8);
    if (_0x5ced49["length"] === 0x0) {
      _0x350f61['appendChild'](this["renderEmpty"](workflowText('empty.noPreviewContent')));
    } else {
      const _0x1e7f5a = el('div', "v2-workflow-content-list");
      for (const _0x4b3d91 of _0x5ced49) {
        _0x1e7f5a["appendChild"](this['renderWorkflowContentItem'](_0x4b3d91));
      }
      _0x350f61['appendChild'](_0x1e7f5a);
    }
    _0x257356['appendChild'](_0x350f61);
    const _0x3cfb8 = cleanText(_0x58a9d8['note']);
    if (_0x3cfb8) {
      const _0x1a8fa9 = el('div', "v2-workflow-detail-note");
      _0x1a8fa9["textContent"] = _0x3cfb8;
      _0x257356["appendChild"](_0x1a8fa9);
    }
    const _0x5e4ed4 = el('div', "v2-workflow-detail-actions");
    if (WORKFLOW_UPDATE_ENTRY_ENABLED) {
      const _0x134f6f = el("button", "v2-workflow-secondary-btn", workflowText("editMeta"));
      _0x134f6f['type'] = "button";
      _0x134f6f["dataset"]["action"] = "workflow-edit-meta";
      _0x134f6f['dataset']["workflowId"] = _0x58a9d8['id'];
      const _0x2d5ea8 = el("button", "v2-workflow-secondary-btn", workflowText("updateContent"));
      _0x2d5ea8["type"] = "button";
      _0x2d5ea8["dataset"]["action"] = 'workflow-open-update';
      _0x2d5ea8["dataset"]["workflowId"] = _0x58a9d8['id'];
      _0x5e4ed4["append"](_0x134f6f, _0x2d5ea8);
    }
    const _0x5c7cb1 = el("button", "v2-workflow-primary-btn", workflowText("applyToCanvas"));
    _0x5c7cb1["type"] = "button";
    _0x5c7cb1["dataset"]["action"] = 'workflow-apply';
    _0x5c7cb1["dataset"]['workflowId'] = _0x58a9d8['id'];
    getState()["workflowUi"]?.["applyingWorkflowId"] === _0x58a9d8['id'] && (_0x5c7cb1["disabled"] = !![], _0x5c7cb1['textContent'] = workflowText('applying'));
    _0x5e4ed4["append"](_0x5c7cb1);
    _0x257356["appendChild"](_0x5e4ed4);
    this["sidebarContent"]["appendChild"](_0x257356);
  }
  ["renderWorkflowContentItem"](_0x1538ad) {
    const _0x20f83e = el('article', "v2-workflow-content-item");
    _0x20f83e['appendChild'](this["renderCover"](_0x1538ad["thumbSrc"], "v2-workflow-content-thumb", _0x1538ad['placeholderLabel'] || workflowText("nodeFallback")));
    const _0x51f434 = el("div", "v2-workflow-content-info");
    _0x51f434["appendChild"](el("span", 'v2-workflow-content-type', _0x1538ad['typeLabel'] || workflowText('nodeFallback')));
    _0x51f434["appendChild"](el('div', "v2-workflow-content-title", _0x1538ad['title'] || _0x1538ad["typeLabel"] || workflowText("nodeFallback")));
    const _0xb883f5 = el("div", "v2-workflow-content-summary");
    _0xb883f5["textContent"] = _0x1538ad["summary"] || workflowText("empty.noNodePreviewContent");
    _0x51f434["appendChild"](_0xb883f5);
    _0x20f83e["appendChild"](_0x51f434);
    return _0x20f83e;
  }
  ["playDeleteShake"](_0x5f315d) {
    if (!_0x5f315d) {
      return;
    }
    _0x5f315d["classList"]["remove"]('is-delete-shaking');
    void _0x5f315d["offsetWidth"];
    _0x5f315d["classList"]['add']('is-delete-shaking');
    window["setTimeout"](() => {
      if (_0x5f315d["isConnected"]) {
        _0x5f315d["classList"]['remove']("is-delete-shaking");
      }
    }, 0xf0);
  }
  ['findWorkflowCard'](_0x553dc6) {
    const _0x36ea9a = String(_0x553dc6 || '')["trim"]();
    if (!_0x36ea9a || !this["sidebarContent"]) {
      return null;
    }
    for (const _0x577d18 of this["sidebarContent"]["querySelectorAll"](".v2-workflow-card")) {
      if (_0x577d18?.["dataset"]?.["workflowId"] === _0x36ea9a) {
        return _0x577d18;
      }
    }
    return null;
  }
  ["setWorkflowDeleteConfirm"](_0x2fab96, _0x1cc68a) {
    const _0x161970 = String(_0x2fab96 || '')['trim']();
    if (!_0x161970) {
      return ![];
    }
    _0x1cc68a && this['_pendingDeleteWorkflowId'] && this["_pendingDeleteWorkflowId"] !== _0x161970 && this['setWorkflowDeleteConfirm'](this["_pendingDeleteWorkflowId"], ![]);
    const _0x418e8c = this['findWorkflowCard'](_0x161970);
    if (!_0x418e8c) {
      return ![];
    }
    const _0x5ae453 = _0x418e8c["querySelector"]('.v2-workflow-card-delete');
    const _0x2c0b61 = _0x418e8c["querySelector"](".v2-workflow-card-delete-confirm");
    if (!_0x5ae453 || !_0x2c0b61) {
      return ![];
    }
    _0x5ae453["hidden"] = _0x1cc68a;
    _0x2c0b61["hidden"] = !_0x1cc68a;
    _0x418e8c["classList"]["toggle"]('is-delete-confirming', _0x1cc68a);
    this["_pendingDeleteWorkflowId"] = _0x1cc68a ? _0x161970 : this["_pendingDeleteWorkflowId"] === _0x161970 ? '' : this["_pendingDeleteWorkflowId"];
    return !![];
  }
  ['finishWorkflowRename'](_0x49d320, _0x19718a = '') {
    const _0x2b1842 = String(_0x49d320 || '')["trim"]();
    if (!_0x2b1842) {
      return ![];
    }
    const _0x234cc5 = this["findWorkflowCard"](_0x2b1842);
    const _0x4728a9 = _0x234cc5?.['querySelector'](".v2-workflow-card-title");
    if (!_0x4728a9) {
      return ![];
    }
    const _0x111792 = findWorkflowById(getState()["workflows"]?.["items"] || [], _0x2b1842);
    _0x4728a9["classList"]["remove"]('is-editing');
    _0x4728a9['dataset']["action"] = 'workflow-rename-open';
    _0x4728a9["dataset"]['workflowId'] = _0x2b1842;
    _0x4728a9['replaceChildren']();
    _0x4728a9["textContent"] = cleanText(_0x19718a || _0x111792?.["name"]) || workflowText('unnamedWorkflow');
    if (this["_renamingWorkflowId"] === _0x2b1842) {
      this["_renamingWorkflowId"] = '';
    }
    return !![];
  }
  ["startWorkflowRename"](_0x59521f) {
    const _0x5424f0 = String(_0x59521f || '')["trim"]();
    if (!_0x5424f0) {
      return ![];
    }
    this["_renamingWorkflowId"] && this['_renamingWorkflowId'] !== _0x5424f0 && this["finishWorkflowRename"](this["_renamingWorkflowId"]);
    this["_pendingDeleteWorkflowId"] && this["setWorkflowDeleteConfirm"](this["_pendingDeleteWorkflowId"], ![]);
    const _0xb1f557 = findWorkflowById(getState()["workflows"]?.['items'] || [], _0x5424f0);
    const _0x333800 = this['findWorkflowCard'](_0x5424f0);
    const _0x3efdc3 = _0x333800?.['querySelector'](".v2-workflow-card-title");
    if (!_0xb1f557 || !_0x3efdc3) {
      return ![];
    }
    this['_renamingWorkflowId'] = _0x5424f0;
    _0x3efdc3["classList"]["add"]("is-editing");
    _0x3efdc3['removeAttribute']("data-action");
    _0x3efdc3["removeAttribute"]('data-workflow-id');
    const _0x24f22f = el("input", "v2-workflow-card-title-input");
    _0x24f22f['type'] = 'text';
    _0x24f22f["value"] = _0xb1f557["name"] || '';
    _0x24f22f['maxLength'] = WORKFLOW_LIMITS['nameMax'];
    _0x24f22f["dataset"]['role'] = "workflow-rename-input";
    _0x24f22f['dataset']["workflowId"] = _0x5424f0;
    _0x24f22f["setAttribute"]('aria-label', workflowText("name"));
    _0x3efdc3["replaceChildren"](_0x24f22f);
    window["requestAnimationFrame"](() => {
      if (!_0x24f22f['isConnected']) {
        return;
      }
      _0x24f22f['focus']();
      _0x24f22f["select"]?.();
    });
    return !![];
  }
  ["handleSidebarClick"](_0x14af65) {
    const _0x3804cb = _0x14af65['target']['closest']("[data-action]");
    const _0x5c2973 = _0x3804cb?.['dataset']?.["action"];
    if (_0x5c2973 === "workflow-back") {
      this["_pendingDeleteWorkflowId"] = '';
      this['_renamingWorkflowId'] = '';
      workspaceStore["setWorkflowUi"]({
        'detailWorkflowId': null
      });
      return;
    }
    if (_0x5c2973 === "workflow-open-create") {
      _0x14af65["preventDefault"]();
      _0x14af65["stopPropagation"]();
      this["_pendingDeleteWorkflowId"] = '';
      this['_renamingWorkflowId'] = '';
      this["openCreateModal"](null);
      return;
    }
    const _0x106d3c = _0x3804cb?.['dataset']?.["workflowId"];
    if (_0x5c2973 === "workflow-delete-open" && _0x106d3c) {
      _0x14af65["preventDefault"]();
      _0x14af65["stopPropagation"]();
      this["_renamingWorkflowId"] && this["finishWorkflowRename"](this["_renamingWorkflowId"]);
      !this['setWorkflowDeleteConfirm'](_0x106d3c, !![]) && this['renderSidebar']();
      return;
    }
    if (_0x5c2973 === "workflow-delete-cancel") {
      _0x14af65["preventDefault"]();
      _0x14af65["stopPropagation"]();
      !this["setWorkflowDeleteConfirm"](_0x106d3c, ![]) && (this["_pendingDeleteWorkflowId"] = '', this["renderSidebar"]());
      return;
    }
    if (_0x5c2973 === "workflow-delete-confirm" && _0x106d3c) {
      _0x14af65["preventDefault"]();
      _0x14af65['stopPropagation']();
      this["deleteWorkflowById"](_0x106d3c);
      return;
    }
    if (_0x5c2973 === "workflow-rename-open" && _0x106d3c) {
      _0x14af65["preventDefault"]();
      _0x14af65['stopPropagation']();
      !this["startWorkflowRename"](_0x106d3c) && (this['_renamingWorkflowId'] = String(_0x106d3c), this['renderSidebar']());
      return;
    }
    if (_0x5c2973 === 'workflow-card-apply' && _0x106d3c) {
      if (_0x14af65['target']["closest"]("button, input, textarea, select") || _0x14af65["target"]['closest']('.v2-workflow-card-title')) {
        return;
      }
      _0x14af65['preventDefault']();
      _0x14af65["stopPropagation"]();
      this["_pendingDeleteWorkflowId"] = '';
      this["_renamingWorkflowId"] = '';
      this["applyWorkflow"](_0x106d3c);
      return;
    }
    if (_0x5c2973 === "workflow-view" && _0x106d3c) {
      if (_0x14af65['target']["closest"]("button, input, textarea, select") || _0x14af65["target"]["closest"](".v2-workflow-card-title")) {
        return;
      }
      _0x14af65['preventDefault']();
      _0x14af65['stopPropagation']();
      this["_pendingDeleteWorkflowId"] = '';
      this["_renamingWorkflowId"] = '';
      workspaceStore['setWorkflowUi']({
        'detailWorkflowId': _0x106d3c
      });
      return;
    }
    if (_0x5c2973 === "workflow-edit-meta" && _0x106d3c) {
      this["_pendingDeleteWorkflowId"] = '';
      this["_renamingWorkflowId"] = '';
      this["openUpdateModal"](_0x106d3c, {
        'metaOnly': !![]
      });
      return;
    }
    if (_0x5c2973 === "workflow-open-update" && _0x106d3c) {
      this["_pendingDeleteWorkflowId"] = '';
      this['_renamingWorkflowId'] = '';
      this["openUpdateModal"](_0x106d3c, {
        'metaOnly': ![]
      });
      return;
    }
    if (_0x5c2973 === "workflow-apply" && _0x106d3c) {
      _0x14af65['preventDefault']();
      _0x14af65['stopPropagation']();
      this["_pendingDeleteWorkflowId"] = '';
      this["_renamingWorkflowId"] = '';
      this["applyWorkflow"](_0x106d3c);
      return;
    }
  }
  ["handleSidebarContextMenu"](_0x4e5dd3) {
    if (_0x4e5dd3["target"]?.["closest"]?.("select, " + TEXT_CONTEXT_MENU_TARGET_SELECTOR)) {
      return;
    }
    const _0x254535 = _0x4e5dd3["target"]?.['closest']?.(".v2-workflow-card");
    if (!_0x254535 || !this['sidebarPanel']?.["contains"]?.(_0x254535)) {
      return;
    }
    const _0x343ab6 = String(_0x254535["dataset"]["workflowId"] || '')['trim']();
    const _0x4f050c = findWorkflowById(getState()["workflows"]?.["items"] || [], _0x343ab6);
    if (!_0x4f050c) {
      return;
    }
    _0x4e5dd3["preventDefault"]();
    _0x4e5dd3['stopPropagation']();
    const _0x1e0722 = getState()["workflowUi"]?.["applyingWorkflowId"];
    const _0x53efc7 = [{
      'label': workflowText("detailTitle"),
      'icon': "details",
      'shortcutActionId': 'context-workflow-details',
      'action': () => {
        this['_pendingDeleteWorkflowId'] = '';
        this["_renamingWorkflowId"] = '';
        workspaceStore["setWorkflowUi"]({
          'detailWorkflowId': _0x343ab6
        });
      }
    }, {
      'label': workflowText('loadToCanvas'),
      'icon': "add-to-canvas",
      'disabled': _0x1e0722 === _0x343ab6,
      'shortcutActionId': "context-workflow-load",
      'action': () => {
        this["_pendingDeleteWorkflowId"] = '';
        this["_renamingWorkflowId"] = '';
        this["applyWorkflow"](_0x343ab6);
      }
    }, {
      'label': workflowText("rename"),
      'icon': "edit",
      'shortcutActionId': "context-workflow-rename",
      'action': () => {
        !this['startWorkflowRename'](_0x343ab6) && (this['_renamingWorkflowId'] = _0x343ab6, this["renderSidebar"]());
      }
    }];
    _0x53efc7["push"]({
      'label': workflowText('editMeta'),
      'icon': "edit",
      'disabled': !WORKFLOW_UPDATE_ENTRY_ENABLED,
      'shortcutActionId': "context-workflow-edit-meta",
      'action': () => this["openUpdateModal"](_0x343ab6, {
        'metaOnly': !![]
      })
    }, {
      'label': workflowText("updateContent"),
      'icon': "update",
      'disabled': !WORKFLOW_UPDATE_ENTRY_ENABLED,
      'shortcutActionId': 'context-workflow-update-content',
      'action': () => this["openUpdateModal"](_0x343ab6, {
        'metaOnly': ![]
      })
    });
    _0x53efc7["push"]("sep", {
      'label': workflowText("deleteWorkflow"),
      'icon': "delete",
      'danger': !![],
      'shortcutActionId': "context-workflow-delete",
      'action': () => {
        this["_renamingWorkflowId"] && this["finishWorkflowRename"](this['_renamingWorkflowId']);
        !this["setWorkflowDeleteConfirm"](_0x343ab6, !![]) && this["renderSidebar"]();
      }
    });
    this["_contextMenuSession"] = showContextMenu(_0x4e5dd3["clientX"], _0x4e5dd3["clientY"], _0x53efc7, {
      'ensureItemIcons': !![],
      'ownerElement': _0x254535,
      'ownerRoot': this['sidebarPanel']
    });
  }
  ["handleSidebarRenameKeydown"](_0x4b650d) {
    const _0x247095 = _0x4b650d["target"];
    const _0x598dc = _0x247095?.["dataset"]?.['workflowId'];
    if (!_0x598dc) {
      return;
    }
    if (_0x4b650d["key"] === "Enter") {
      _0x4b650d["preventDefault"]();
      _0x4b650d["stopPropagation"]();
      _0x247095["dataset"]["submitted"] = '1';
      this["commitWorkflowRename"](_0x598dc, _0x247095["value"]);
      return;
    }
    _0x4b650d["key"] === "Escape" && (_0x4b650d["preventDefault"](), _0x4b650d["stopPropagation"](), !this["finishWorkflowRename"](_0x598dc) && (this["_renamingWorkflowId"] = '', this["renderSidebar"]()));
  }
  async ['commitWorkflowRename'](_0x350027, _0x7ced9) {
    const _0x5be7a6 = String(_0x350027 || '')["trim"]();
    const _0x4d1fe5 = cleanText(_0x7ced9);
    if (!_0x5be7a6) {
      return;
    }
    if (!_0x4d1fe5) {
      showToast(workflowText("errors.nameRequired"), "error");
      return;
    }
    const _0x1dffa4 = findWorkflowById(getState()["workflows"]?.["items"] || [], _0x5be7a6);
    if (!_0x1dffa4) {
      return;
    }
    if (cleanText(_0x1dffa4["name"]) === _0x4d1fe5) {
      !this["finishWorkflowRename"](_0x5be7a6, _0x1dffa4["name"]) && (this["_renamingWorkflowId"] = '', this["renderSidebar"]());
      return;
    }
    let _0x36791c = null;
    try {
      _0x36791c = await renameWorkflow(_0x1dffa4, _0x4d1fe5);
      this['finishWorkflowRename'](_0x5be7a6, _0x36791c?.['name'] || _0x4d1fe5);
      workspaceStore["upsertWorkflow"](_0x36791c);
      showToast(workflowText("renamed"), "success");
    } catch (_0x9f2e29) {
      this["finishWorkflowRename"](_0x5be7a6, _0x1dffa4["name"]);
      showToast(_0x9f2e29?.['message'] || workflowText("renameFailed"), "error");
    } finally {
      this["_renamingWorkflowId"] = '';
    }
  }
  async ["deleteWorkflowById"](_0x561308) {
    const _0x49ad83 = String(_0x561308 || '')["trim"]();
    if (!_0x49ad83) {
      return;
    }
    this["setWorkflowDeleteConfirm"](_0x49ad83, ![]);
    this['_pendingDeleteWorkflowId'] = '';
    this["_renamingWorkflowId"] = '';
    try {
      await deleteWorkflow(_0x49ad83);
      const _0x35ddf9 = getState();
      const _0x327d20 = (_0x35ddf9["workflows"]?.["items"] || [])['filter'](_0x3a7ee2 => String(_0x3a7ee2?.['id'] || '') !== _0x49ad83);
      workspaceStore["setWorkflows"](_0x327d20);
      _0x35ddf9["workflowUi"]?.["detailWorkflowId"] === _0x49ad83 && workspaceStore["setWorkflowUi"]({
        'detailWorkflowId': null
      });
      showToast(workflowText("deleted"), "success");
    } catch (_0x3f6bae) {
      showToast(_0x3f6bae?.["message"] || workflowText("deleteFailed"), "error");
    }
  }
  ["openCreateModal"](_0x40a1d9 = null) {
    workspaceStore["openWorkflowModal"]({
      'tab': "create",
      'sourceGroupId': _0x40a1d9
    });
    this["resetCreateDraftFromCurrentSource"]();
    this["renderModal"]();
  }
  ["openUpdateModal"](_0x317dfd, {
    metaOnly = ![]
  } = {}) {
    workspaceStore["openWorkflowModal"]({
      'tab': "update",
      'sourceGroupId': null
    });
    workspaceStore["setWorkflowUi"]({
      'updateMetaOnly': metaOnly === !![]
    });
    this["selectUpdateTarget"](_0x317dfd, {
      'render': ![]
    });
    this["renderModal"]();
  }
  ["resetCreateDraftFromCurrentSource"]() {
    const _0x3d24ad = this["getWorkflowSourceCanvasState"]();
    const _0x20f00f = this["getWorkflowSourceContext"]();
    const _0x550fdf = buildWorkflowSourceSummary(_0x3d24ad, _0x20f00f);
    const _0x1e4df5 = this["getCoverCandidates"](null, _0x3d24ad)[0x0] || getDefaultWorkflowCoverCandidate();
    workspaceStore["resetWorkflowDraft"]({
      'name': _0x550fdf["isEmpty"] ? '' : _0x550fdf["suggestedName"],
      'tags': _0x550fdf["isEmpty"] ? [] : _0x550fdf["suggestedTags"],
      'cover': _0x1e4df5["src"] || '',
      'selectedCoverId': _0x1e4df5['id']
    });
  }
  ['closeModal']() {
    workspaceStore["closeWorkflowModal"]();
    this["renderModal"]();
  }
  ["getWorkflowSourceCanvasState"]() {
    const _0x315dd6 = getState();
    const _0x3c5236 = getStateRaw();
    return sliceCanvasStateForWorkflow(graphStore['serialize'](), _0x3c5236?.["nodes"] || {}, _0x315dd6["workflowUi"]?.["sourceGroupId"]);
  }
  ["getWorkflowSourceContext"]() {
    const _0x20b6e5 = getState();
    const _0x32d095 = getStateRaw();
    const _0x2da9f5 = cleanText(_0x20b6e5["workflowUi"]?.["sourceGroupId"]);
    const _0x3f5734 = _0x2da9f5 ? _0x32d095?.['nodes']?.[_0x2da9f5] : null;
    return {
      'sourceGroupId': _0x2da9f5 || '',
      'sourceLabel': _0x2da9f5 ? workflowText("source.currentGroup") : workflowText("source.wholeCanvas"),
      'sourceName': cleanText(_0x3f5734?.["name"] || _0x3f5734?.["title"] || _0x3f5734?.["label"])
    };
  }
  ["getWorkflowSourceSummary"](_0x3caf39 = this["getWorkflowSourceCanvasState"](), _0x5d89e2 = {}) {
    return buildWorkflowSourceSummary(_0x3caf39, {
      ...this["getWorkflowSourceContext"](),
      ..._0x5d89e2
    });
  }
  ["getCoverCandidates"](_0x3b3553 = null, _0x12e620 = this["getWorkflowSourceCanvasState"]()) {
    const _0x2ab186 = createWorkflowSnapshotCoverCandidate(_0x12e620);
    const _0x58b795 = extractWorkflowCoverCandidates(_0x12e620?.['nodes']);
    const _0xc072c5 = [];
    if (_0x3b3553?.["src"]) {
      _0xc072c5["push"](_0x3b3553);
    }
    if (_0x2ab186?.["src"]) {
      _0xc072c5["push"](_0x2ab186);
    }
    _0xc072c5['push'](..._0x58b795);
    if (_0xc072c5["length"] === 0x0) {
      _0xc072c5["push"](getDefaultWorkflowCoverCandidate());
    }
    const _0x214773 = new Set();
    return _0xc072c5['filter'](_0x5bf26f => {
      const _0x1562f1 = _0x5bf26f["src"] || _0x5bf26f['id'];
      if (_0x214773["has"](_0x1562f1)) {
        return ![];
      }
      _0x214773["add"](_0x1562f1);
      return !![];
    });
  }
  ['getUpdateCoverCandidates'](_0x29f02b, _0x5dc827 = null) {
    const _0x331eb1 = getState()["workflowUi"] || {};
    if (_0x331eb1["updateMetaOnly"] && _0x29f02b?.["workflowData"]) {
      return this['getCoverCandidates'](_0x5dc827, _0x29f02b["workflowData"]);
    }
    return this["getCoverCandidates"](_0x5dc827);
  }
  ['renderModal']() {
    if (!this['modal'] || !this["modalBody"]) {
      return;
    }
    const _0x3c46ca = getState();
    const _0x3e270e = _0x3c46ca["workflowUi"] || {};
    this["modal"]["classList"]["toggle"]("show", _0x3e270e["modalOpen"] === !![]);
    this['modal']['setAttribute']("aria-hidden", _0x3e270e['modalOpen'] === !![] ? "false" : "true");
    if (!_0x3e270e["modalOpen"]) {
      this['modalBody']['replaceChildren']();
      return;
    }
    for (const _0xa6c83e of this["modal"]["querySelectorAll"](".v2-workflow-modal-tab")) {
      _0xa6c83e["classList"]['toggle']('active', _0xa6c83e["dataset"]["modalTab"] === (_0x3e270e["modalTab"] || 'create'));
    }
    const _0x2ff9dc = _0x3e270e["modalTab"] === "update" && !WORKFLOW_UPDATE_ENTRY_ENABLED ? "create" : _0x3e270e["modalTab"];
    this["modalTitleTextEl"] && (this['modalTitleTextEl']["textContent"] = _0x2ff9dc === "update" ? _0x3e270e["updateMetaOnly"] ? workflowText('modal.editMetaTitle') : workflowText("modal.updateTitle") : workflowText("modal.createTitle"));
    this['modalBody']["replaceChildren"]();
    _0x2ff9dc === 'update' ? this["renderUpdateForm"]() : this["renderCreateForm"]();
  }
  ["renderCreateForm"]() {
    const _0x524fc6 = getState();
    const _0x8e7b62 = _0x524fc6["workflowUi"] || {};
    const _0x5632f7 = this['getWorkflowSourceCanvasState']();
    const _0xc1c298 = this["getWorkflowSourceSummary"](_0x5632f7);
    const _0x73a4ab = el("div", "v2-workflow-create-layout");
    _0x73a4ab['appendChild'](this["renderWorkflowSourcePanel"](_0xc1c298));
    const _0x42fe8d = this['renderWorkflowMetaForm']({
      'mode': 'create',
      'candidates': this["getCoverCandidates"](null, _0x5632f7),
      'sourceSummary': _0xc1c298,
      'submitText': _0x8e7b62["saving"] ? workflowText("saving") : workflowText('createConfirm')
    });
    _0x73a4ab["appendChild"](_0x42fe8d);
    this["modalBody"]["appendChild"](_0x73a4ab);
  }
  ["renderUpdateForm"]() {
    const _0x3b0cb6 = getState();
    const _0x5a2809 = _0x3b0cb6['workflowUi'] || {};
    const _0x1ee5c5 = filterWorkflows(_0x3b0cb6["workflows"]?.['items'] || [], _0x5a2809["updateSearchKeyword"] || '');
    const _0x18f2f9 = el("div", 'v2-workflow-create-layout\x20v2-workflow-update-layout');
    const _0x46e68b = el("section", 'v2-workflow-update-picker\x20v2-workflow-source-panel');
    const _0x3415b1 = el("div", "v2-workflow-source-header");
    _0x3415b1["appendChild"](el("div", "v2-workflow-source-title", workflowText("updatePicker.title")));
    _0x3415b1["appendChild"](el("div", "v2-workflow-source-scope", workflowText("updatePicker.resultCount", {
      'count': _0x1ee5c5["length"]
    })));
    _0x46e68b['appendChild'](_0x3415b1);
    const _0x432373 = el("input", "v2-workflow-search-input");
    _0x432373['type'] = "search";
    _0x432373["placeholder"] = workflowText('updatePicker.searchPlaceholder');
    _0x432373["value"] = _0x5a2809["updateSearchKeyword"] || '';
    _0x432373["dataset"]["role"] = "workflow-update-search";
    _0x46e68b['appendChild'](_0x432373);
    const _0x25ac61 = el('div', "v2-workflow-update-list");
    if (_0x1ee5c5["length"] === 0x0) {
      const _0x41c63b = el('div', 'v2-workflow-source-empty');
      _0x41c63b["textContent"] = cleanText(_0x5a2809["updateSearchKeyword"]) ? workflowText("empty.noMatches") : workflowText("empty.noWorkflows");
      _0x25ac61["appendChild"](_0x41c63b);
    } else {
      for (const _0x550a14 of _0x1ee5c5) {
        const _0x18461f = el('button', "v2-workflow-update-item");
        _0x18461f["type"] = "button";
        _0x18461f["dataset"]["action"] = "workflow-update-select";
        _0x18461f['dataset']["workflowId"] = _0x550a14['id'];
        _0x18461f["classList"]["toggle"]("active", _0x5a2809["updateTargetId"] === _0x550a14['id']);
        _0x18461f["append"](this["renderCover"](_0x550a14['cover'], 'v2-workflow-update-thumb'));
        const _0x22f8f7 = el("div", "v2-workflow-update-info");
        _0x22f8f7["append"](el("span", '', _0x550a14["name"]), el("small", '', formatDateTime(_0x550a14["updatedAt"])));
        _0x18461f["appendChild"](_0x22f8f7);
        _0x25ac61["appendChild"](_0x18461f);
      }
    }
    _0x46e68b["appendChild"](_0x25ac61);
    _0x18f2f9["appendChild"](_0x46e68b);
    const _0x664397 = findWorkflowById(_0x3b0cb6['workflows']?.["items"] || [], _0x5a2809["updateTargetId"]);
    const _0xee0ffa = el("div", "v2-workflow-update-editor");
    if (_0x664397) {
      const _0x125709 = this['getWorkflowSourceCanvasState']();
      const _0x333277 = this['getWorkflowSourceSummary'](_0x125709);
      const _0x4507f5 = buildWorkflowSourceSummary(_0x664397["workflowData"], {
        'sourceLabel': workflowText("source.historyWorkflow"),
        'sourceName': _0x664397["name"]
      });
      const _0x25f498 = _0x664397['cover'] && _0x5a2809['draft']?.["cover"] === _0x664397["cover"] ? {
        'id': "existing-" + _0x664397['id'],
        'src': _0x664397["cover"],
        'nodeId': '',
        'label': workflowText('currentCover')
      } : null;
      _0xee0ffa["appendChild"](this["renderWorkflowMetaForm"]({
        'mode': "update",
        'target': _0x664397,
        'candidates': this["getUpdateCoverCandidates"](_0x664397, _0x25f498),
        'sourceSummary': _0x5a2809["updateMetaOnly"] ? null : _0x333277,
        'submitText': _0x5a2809["saving"] ? workflowText("updating") : _0x5a2809["updateMetaOnly"] ? workflowText('saveMeta') : _0x5a2809["updateConfirmOpen"] ? workflowText("confirmOverwrite") : workflowText("updateConfirm")
      }));
    } else {
      _0xee0ffa['appendChild'](this["renderWorkflowMetaForm"]({
        'mode': "update",
        'candidates': [getDefaultWorkflowCoverCandidate()],
        'submitText': workflowText("updateConfirm"),
        'disabled': !![]
      }));
    }
    _0x18f2f9['appendChild'](_0xee0ffa);
    this["modalBody"]["appendChild"](_0x18f2f9);
  }
  ["renderWorkflowSourcePanel"](_0x4919d0, {
    title = workflowText('source.savingContent')
  } = {}) {
    const _0x8d3926 = el("section", "v2-workflow-source-panel");
    const _0x2039db = el("div", 'v2-workflow-source-header');
    _0x2039db["appendChild"](el("div", "v2-workflow-source-title", title));
    const _0x471211 = el("div", "v2-workflow-source-scope", _0x4919d0["sourceLabel"] || workflowText('source.wholeCanvas'));
    if (_0x4919d0["sourceName"]) {
      _0x471211["appendChild"](el('span', '', " · " + _0x4919d0["sourceName"]));
    }
    _0x2039db["appendChild"](_0x471211);
    _0x8d3926['appendChild'](_0x2039db);
    if (_0x4919d0["isEmpty"]) {
      const _0x1b3509 = el('div', 'v2-workflow-source-empty');
      _0x1b3509["textContent"] = _0x4919d0["sourceGroupId"] || _0x4919d0["sourceLabel"] === workflowText("source.currentGroup") ? workflowText("empty.noGroupNodes") : workflowText("empty.noCanvasNodes");
      _0x8d3926["appendChild"](_0x1b3509);
      return _0x8d3926;
    }
    if (_0x4919d0["typeCounts"]["length"] > 0x0) {
      const _0x5d603c = el('div', "v2-workflow-source-types");
      for (const _0x221d3e of _0x4919d0["typeCounts"]["slice"](0x0, 0x6)) {
        _0x5d603c["appendChild"](el("span", "v2-workflow-source-type", _0x221d3e['label'] + '\x20' + _0x221d3e["count"]));
      }
      _0x8d3926['appendChild'](_0x5d603c);
    }
    const _0x46249a = _0x4919d0["previewItems"]["slice"](0x0, 0x4);
    if (_0x46249a["length"] > 0x0) {
      const _0x3bddaa = el("div", 'v2-workflow-source-preview');
      for (const _0x48acd8 of _0x46249a) {
        _0x3bddaa['appendChild'](this['renderWorkflowContentItem'](_0x48acd8));
      }
      _0x4919d0['previewItems']["length"] > _0x46249a['length'] && _0x3bddaa["appendChild"](el("div", "v2-workflow-source-more", workflowText("source.moreNodes", {
        'count': _0x4919d0["previewItems"]['length'] - _0x46249a["length"]
      })));
      _0x8d3926["appendChild"](_0x3bddaa);
    }
    return _0x8d3926;
  }
  ["renderWorkflowMetaForm"]({
    mode: _0x21f63c,
    candidates: _0x511177,
    submitText: _0x4bef90,
    sourceSummary = null,
    disabled = ![]
  }) {
    const _0x526a64 = getState()["workflowUi"] || {};
    const _0x1fd2f3 = _0x526a64["draft"] || {};
    const _0x104f29 = _0x21f63c === 'create' || _0x21f63c === "update" && !_0x526a64["updateMetaOnly"];
    const _0x1daca9 = _0x104f29 && sourceSummary?.["isEmpty"];
    const _0xc8ebe6 = el("div", "v2-workflow-form");
    _0xc8ebe6["dataset"]["workflowForm"] = _0x21f63c;
    _0xc8ebe6["classList"]["toggle"]("is-disabled", disabled === !![]);
    const _0x407d63 = el("div", "v2-workflow-cover-row");
    _0x407d63["appendChild"](this["renderCover"](_0x1fd2f3['cover'], "v2-workflow-form-cover"));
    const _0x48ec22 = el("div", "v2-workflow-cover-choices");
    for (const _0x245436 of _0x511177) {
      const _0x4bcd6d = el("button", 'v2-workflow-cover-choice');
      _0x4bcd6d["type"] = "button";
      _0x4bcd6d["dataset"]["action"] = "workflow-cover-select";
      _0x4bcd6d["dataset"]["coverId"] = _0x245436['id'];
      _0x4bcd6d["dataset"]['coverSrc'] = _0x245436["src"] || '';
      _0x4bcd6d["classList"]["toggle"]("active", _0x245436['id'] === _0x1fd2f3["selectedCoverId"]);
      _0x4bcd6d["title"] = _0x245436["label"];
      _0x4bcd6d["appendChild"](this["renderCover"](_0x245436['src'], "v2-workflow-cover-choice-img"));
      _0x48ec22["appendChild"](_0x4bcd6d);
    }
    _0x407d63["appendChild"](_0x48ec22);
    _0xc8ebe6["appendChild"](_0x407d63);
    _0xc8ebe6["appendChild"](this["renderTextField"](workflowText("name"), "workflow-draft-name", _0x1fd2f3['name'] || '', WORKFLOW_LIMITS["nameMax"]));
    _0xc8ebe6["appendChild"](this['renderTagsField'](_0x1fd2f3['tags'] || []));
    _0xc8ebe6["appendChild"](this["renderNoteField"](_0x1fd2f3['note'] || ''));
    const _0x2ef7b6 = el('div', 'v2-workflow-form-error');
    _0x2ef7b6['dataset']['role'] = "workflow-form-error";
    if (_0x526a64["error"]) {
      _0x2ef7b6['textContent'] = _0x526a64["error"];
    }
    _0xc8ebe6["appendChild"](_0x2ef7b6);
    const _0x15dd90 = el("div", "v2-workflow-form-footer");
    const _0x229477 = el("button", "v2-workflow-secondary-btn", workflowText('cancel'));
    _0x229477["type"] = "button";
    _0x229477["dataset"]["action"] = "workflow-modal-close";
    const _0x4c54df = el("button", "v2-workflow-primary-btn", _0x4bef90);
    _0x4c54df['type'] = "button";
    _0x4c54df["dataset"]["action"] = _0x21f63c === "update" ? "workflow-update-submit" : "workflow-create-submit";
    _0x4c54df["disabled"] = disabled === !![] || _0x526a64["saving"] === !![] || !cleanText(_0x1fd2f3["name"]) || _0x1daca9;
    _0x15dd90["append"](_0x229477, _0x4c54df);
    _0xc8ebe6["appendChild"](_0x15dd90);
    return _0xc8ebe6;
  }
  ["renderTextField"](_0x10f7b8, _0xb4e0be, _0x314d81, _0x42e83b) {
    const _0x15830e = el("label", "v2-workflow-field");
    _0x15830e["appendChild"](el("span", '', _0x10f7b8));
    const _0x1df6d9 = el("input", "v2-workflow-input");
    _0x1df6d9["type"] = "text";
    _0x1df6d9["value"] = _0x314d81 || '';
    _0x1df6d9['maxLength'] = _0x42e83b;
    _0x1df6d9["dataset"]["role"] = _0xb4e0be;
    _0x15830e['appendChild'](_0x1df6d9);
    return _0x15830e;
  }
  ["renderNoteField"](_0x2107f5) {
    const _0x318348 = el("label", "v2-workflow-field v2-workflow-note-field");
    _0x318348['appendChild'](el("span", '', workflowText("note")));
    const _0x33d7f6 = el("textarea", "v2-workflow-textarea");
    _0x33d7f6["maxLength"] = WORKFLOW_LIMITS["noteMax"];
    _0x33d7f6["value"] = _0x2107f5 || '';
    _0x33d7f6['dataset']["role"] = "workflow-draft-note";
    _0x33d7f6['placeholder'] = workflowText("notePlaceholder");
    _0x318348["appendChild"](_0x33d7f6);
    return _0x318348;
  }
  ["renderTagsField"](_0x4ae6ca) {
    const _0x5bf4e7 = el('div', 'v2-workflow-field');
    _0x5bf4e7["appendChild"](el("span", '', workflowText('tags')));
    const _0x24fcf5 = el('div', "v2-workflow-tag-editor");
    for (const _0x3b6c89 of _0x4ae6ca) {
      const _0x2df941 = el("span", "v2-workflow-tag-chip");
      _0x2df941["appendChild"](document['createTextNode'](_0x3b6c89));
      const _0x2402f1 = el('button', '', '×');
      _0x2402f1["type"] = 'button';
      _0x2402f1["dataset"]['action'] = "workflow-tag-remove";
      _0x2402f1["dataset"]["tag"] = _0x3b6c89;
      _0x2df941["appendChild"](_0x2402f1);
      _0x24fcf5["appendChild"](_0x2df941);
    }
    const _0x517130 = el('div', 'v2-workflow-tag-input-row');
    const _0x449fea = el("input", "v2-workflow-input v2-workflow-tag-input");
    _0x449fea["type"] = "text";
    _0x449fea["maxLength"] = WORKFLOW_LIMITS["tagLengthMax"];
    _0x449fea["placeholder"] = _0x4ae6ca["length"] >= WORKFLOW_LIMITS['tagMax'] ? workflowText("tagLimitReached") : workflowText('addTagPlaceholder');
    _0x449fea["disabled"] = _0x4ae6ca["length"] >= WORKFLOW_LIMITS["tagMax"];
    _0x449fea["value"] = getState()["workflowUi"]?.["tagDraft"] || '';
    _0x449fea["dataset"]["role"] = "workflow-tag-draft";
    const _0x16c00f = el('button', "v2-workflow-secondary-btn v2-workflow-tag-add-btn", workflowText("addTag"));
    _0x16c00f["type"] = "button";
    _0x16c00f["dataset"]["action"] = 'workflow-tag-add';
    _0x16c00f['disabled'] = _0x4ae6ca["length"] >= WORKFLOW_LIMITS["tagMax"];
    _0x517130["append"](_0x449fea, _0x16c00f);
    _0x5bf4e7["append"](_0x24fcf5, _0x517130);
    return _0x5bf4e7;
  }
  ["handleModalKeydown"](_0x32c5ab) {
    if (_0x32c5ab["key"] === "Escape") {
      this["closeModal"]();
      return;
    }
    if (_0x32c5ab["key"] !== "Enter") {
      return;
    }
    const _0x60da0e = _0x32c5ab["target"]?.['dataset']?.["role"];
    if (_0x60da0e !== "workflow-tag-draft") {
      return;
    }
    _0x32c5ab["preventDefault"]();
    this["addDraftTag"]();
  }
  ["handleModalInput"](_0x19181a) {
    const _0x3d162a = _0x19181a['target'];
    const _0x124cea = _0x3d162a?.["dataset"]?.['role'];
    if (!_0x124cea) {
      return;
    }
    if (_0x124cea === "workflow-draft-name") {
      workspaceStore["setWorkflowDraft"]({
        'name': _0x3d162a["value"] || ''
      });
      this["updateSubmitDisabled"]();
    } else {
      if (_0x124cea === "workflow-draft-note") {
        workspaceStore["setWorkflowDraft"]({
          'note': _0x3d162a["value"] || ''
        });
      } else {
        if (_0x124cea === "workflow-tag-draft") {
          workspaceStore["setWorkflowUi"]({
            'tagDraft': _0x3d162a["value"] || ''
          });
        } else {
          _0x124cea === "workflow-update-search" && (workspaceStore['setWorkflowUi']({
            'updateSearchKeyword': _0x3d162a["value"] || '',
            'updateConfirmOpen': ![]
          }), this["renderModal"]());
        }
      }
    }
  }
  ["handleModalClick"](_0x1ed839) {
    const _0x920039 = _0x1ed839["target"]["closest"]('.v2-workflow-modal-tab');
    if (_0x920039?.["dataset"]?.["modalTab"]) {
      workspaceStore["setWorkflowUi"]({
        'modalTab': _0x920039["dataset"]["modalTab"],
        'updateConfirmOpen': ![],
        'updateMetaOnly': ![],
        'error': null
      });
      _0x920039["dataset"]['modalTab'] === "create" && this["resetCreateDraftFromCurrentSource"]();
      this["renderModal"]();
      return;
    }
    const _0x27931c = _0x1ed839["target"]["closest"]("[data-action]");
    const _0x41150a = _0x27931c?.['dataset']?.['action'];
    if (!_0x41150a) {
      return;
    }
    if (_0x41150a === "workflow-cover-select") {
      const _0x1af37d = _0x27931c["dataset"]["coverId"];
      const _0x97b375 = _0x1af37d === DEFAULT_WORKFLOW_COVER_ID ? '' : _0x27931c['dataset']["coverSrc"] || '';
      workspaceStore["setWorkflowDraft"]({
        'selectedCoverId': _0x1af37d,
        'cover': _0x97b375
      });
      workspaceStore['setWorkflowUi']({
        'updateConfirmOpen': ![]
      });
      this["updateCoverSelectionUi"](_0x1af37d, _0x97b375);
      return;
    }
    if (_0x41150a === "workflow-tag-add") {
      this["addDraftTag"]();
      return;
    }
    if (_0x41150a === 'workflow-tag-remove') {
      this["removeDraftTag"](_0x27931c["dataset"]['tag']);
      return;
    }
    if (_0x41150a === "workflow-create-submit") {
      this["submitCreate"]();
      return;
    }
    if (_0x41150a === "workflow-update-select") {
      this['selectUpdateTarget'](_0x27931c['dataset']['workflowId']);
      return;
    }
    _0x41150a === "workflow-update-submit" && this['submitUpdate']();
  }
  ["updateSubmitDisabled"]() {
    const _0x7834f9 = this['modalBody']?.["querySelector"]("[data-action='workflow-create-submit'], [data-action='workflow-update-submit']");
    if (_0x7834f9) {
      const _0x1464cc = getState()["workflowUi"] || {};
      const _0x4bba39 = _0x1464cc['modalTab'] === "create" || _0x1464cc['modalTab'] === "update" && !_0x1464cc["updateMetaOnly"];
      const _0x569f35 = _0x4bba39 && this["getWorkflowSourceSummary"](this['getWorkflowSourceCanvasState']())["isEmpty"];
      _0x7834f9["disabled"] = _0x1464cc["saving"] === !![] || !cleanText(_0x1464cc["draft"]?.["name"]) || _0x569f35;
    }
  }
  ["updateCoverSelectionUi"](_0x2302e9, _0x6108a1) {
    if (!this["modalBody"]) {
      return;
    }
    const _0x330570 = cleanText(_0x2302e9);
    for (const _0x2d98dd of this["modalBody"]["querySelectorAll"]('.v2-workflow-cover-choice')) {
      _0x2d98dd["classList"]["toggle"]("active", _0x2d98dd["dataset"]['coverId'] === _0x330570);
    }
    const _0x2b67d0 = this["modalBody"]['querySelector']('.v2-workflow-form-cover');
    if (!_0x2b67d0?.["parentNode"]) {
      return;
    }
    _0x2b67d0['replaceWith'](this["renderCover"](_0x6108a1, "v2-workflow-form-cover"));
  }
  ['setFormError'](_0x4be9ab) {
    workspaceStore['setWorkflowUi']({
      'error': _0x4be9ab || null
    });
    const _0x436236 = this["modalBody"]?.["querySelector"]("[data-role='workflow-form-error']");
    if (_0x436236) {
      _0x436236['textContent'] = _0x4be9ab || '';
    }
  }
  ['addDraftTag']() {
    const _0x3ae58a = getState()["workflowUi"] || {};
    const _0x1a8e38 = cleanText(_0x3ae58a["tagDraft"])['slice'](0x0, WORKFLOW_LIMITS["tagLengthMax"]);
    if (!_0x1a8e38) {
      return;
    }
    const _0x59c40b = normalizeWorkflowTags([...(_0x3ae58a['draft']?.["tags"] || []), _0x1a8e38]);
    if ((_0x3ae58a["draft"]?.["tags"] || [])['length'] >= WORKFLOW_LIMITS['tagMax']) {
      this["setFormError"](workflowText("errors.tagLimit", {
        'limit': WORKFLOW_LIMITS["tagMax"]
      }));
      return;
    }
    if (_0x59c40b["length"] === (_0x3ae58a["draft"]?.["tags"] || [])["length"]) {
      this["setFormError"](workflowText('errors.tagExists'));
      return;
    }
    workspaceStore['setWorkflowDraft']({
      'tags': _0x59c40b
    });
    workspaceStore['setWorkflowUi']({
      'tagDraft': '',
      'updateConfirmOpen': ![],
      'error': null
    });
    this['renderModal']();
  }
  ["removeDraftTag"](_0x738680) {
    const _0x487efd = getState()["workflowUi"] || {};
    const _0x142bbb = cleanText(_0x738680)["toLowerCase"]();
    const _0x52ab0e = (_0x487efd["draft"]?.['tags'] || [])["filter"](_0x539df8 => cleanText(_0x539df8)['toLowerCase']() !== _0x142bbb);
    workspaceStore["setWorkflowDraft"]({
      'tags': _0x52ab0e
    });
    workspaceStore["setWorkflowUi"]({
      'updateConfirmOpen': ![],
      'error': null
    });
    this["renderModal"]();
  }
  ['selectUpdateTarget'](_0x11aa7d, {
    render = !![]
  } = {}) {
    const _0x5d84e4 = findWorkflowById(getState()["workflows"]?.["items"] || [], _0x11aa7d);
    if (!_0x5d84e4) {
      return;
    }
    const _0x191af2 = getState()["workflowUi"] || {};
    const _0x6fcd1d = _0x5d84e4["cover"] ? {
      'id': "existing-" + _0x5d84e4['id'],
      'src': _0x5d84e4["cover"],
      'nodeId': '',
      'label': workflowText("currentCover")
    } : null;
    const _0xaebba3 = this["getUpdateCoverCandidates"](_0x5d84e4, _0x191af2["updateMetaOnly"] ? _0x6fcd1d : null)[0x0] || getDefaultWorkflowCoverCandidate();
    const _0x20f0e6 = _0x5d84e4['cover'] ? "existing-" + _0x5d84e4['id'] : _0xaebba3['id'];
    workspaceStore["setWorkflowUi"]({
      'updateTargetId': _0x5d84e4['id'],
      'updateConfirmOpen': ![],
      'tagDraft': '',
      'error': null
    });
    workspaceStore['setWorkflowDraft']({
      'name': _0x5d84e4['name'],
      'cover': _0x5d84e4["cover"] || _0xaebba3['src'] || '',
      'tags': _0x5d84e4['tags'] || [],
      'note': _0x5d84e4["note"] || '',
      'selectedCoverId': _0x20f0e6
    });
    if (render) {
      this["renderModal"]();
    }
  }
  async ["submitCreate"]() {
    const _0xcf9c42 = getState()["workflowUi"] || {};
    if (_0xcf9c42["saving"]) {
      return;
    }
    const _0x26672d = _0xcf9c42["draft"] || {};
    if (!cleanText(_0x26672d['name'])) {
      this["setFormError"](workflowText("errors.nameRequired"));
      return;
    }
    const _0x3cf31d = this["getWorkflowSourceCanvasState"]();
    if (!Array["isArray"](_0x3cf31d["nodes"]) || _0x3cf31d['nodes']["length"] === 0x0) {
      this["setFormError"](_0xcf9c42["sourceGroupId"] ? workflowText('empty.noGroupNodes') : workflowText("empty.noCanvasNodes"));
      return;
    }
    workspaceStore["setWorkflowSaving"](!![]);
    this['renderModal']();
    try {
      const _0xa357e4 = await saveNewWorkflowFromCanvas(_0x3cf31d, _0x26672d);
      const _0x3a7529 = this["modalBody"]?.["querySelector"](".v2-workflow-form-cover");
      workspaceStore["upsertWorkflow"](_0xa357e4);
      playWorkflowSaveFly({
        'sourceEl': _0x3a7529
      });
      workspaceStore["closeWorkflowModal"]();
      this["renderModal"]();
      showToast(workflowText("created"), "success");
    } catch (_0x2de577) {
      workspaceStore["setWorkflowSaving"](![]);
      this["setFormError"](_0x2de577?.["message"] || workflowText('saveFailed'));
      this["renderModal"]();
      showToast(workflowText("saveFailed"), "error");
    }
  }
  async ["submitUpdate"]() {
    const _0x2d986e = getState();
    const _0x41c262 = _0x2d986e["workflowUi"] || {};
    if (_0x41c262["saving"]) {
      return;
    }
    const _0x4246f8 = findWorkflowById(_0x2d986e["workflows"]?.["items"] || [], _0x41c262["updateTargetId"]);
    if (!_0x4246f8) {
      this["setFormError"](workflowText('errors.selectWorkflowToUpdate'));
      return;
    }
    if (!cleanText(_0x41c262['draft']?.["name"])) {
      this["setFormError"](workflowText("errors.nameRequired"));
      return;
    }
    if (_0x41c262["updateMetaOnly"]) {
      workspaceStore['setWorkflowSaving'](!![]);
      this["renderModal"]();
      try {
        const _0x370646 = await saveWorkflowMeta(_0x4246f8, _0x41c262["draft"] || {});
        const _0x39f98a = this['modalBody']?.["querySelector"]('.v2-workflow-form-cover');
        workspaceStore["upsertWorkflow"](_0x370646);
        playWorkflowSaveFly({
          'sourceEl': _0x39f98a
        });
        workspaceStore['closeWorkflowModal']();
        this["renderModal"]();
        showToast(workflowText('metaSaved'), "success");
      } catch (_0x26387) {
        workspaceStore["setWorkflowSaving"](![]);
        this["setFormError"](_0x26387?.["message"] || workflowText('metaSaveFailed'));
        this["renderModal"]();
        showToast(workflowText("metaSaveFailed"), "error");
      }
      return;
    }
    const _0x1c9749 = this["getWorkflowSourceCanvasState"]();
    if (!Array["isArray"](_0x1c9749["nodes"]) || _0x1c9749["nodes"]['length'] === 0x0) {
      this["setFormError"](_0x41c262["sourceGroupId"] ? workflowText('empty.noGroupNodes') : workflowText("empty.noCanvasNodes"));
      return;
    }
    if (!_0x41c262["updateConfirmOpen"]) {
      workspaceStore["setWorkflowUi"]({
        'updateConfirmOpen': !![],
        'error': null
      });
      this['renderModal']();
      return;
    }
    workspaceStore["setWorkflowSaving"](!![]);
    this["renderModal"]();
    try {
      const _0x2e74d9 = await saveUpdatedWorkflowFromCanvas(_0x4246f8['id'], _0x1c9749, {
        ...(_0x41c262['draft'] || {}),
        'existingWorkflow': _0x4246f8
      });
      const _0x4412e0 = this["modalBody"]?.["querySelector"]('.v2-workflow-form-cover');
      workspaceStore["upsertWorkflow"](_0x2e74d9);
      playWorkflowSaveFly({
        'sourceEl': _0x4412e0
      });
      workspaceStore["closeWorkflowModal"]();
      this["renderModal"]();
      showToast(workflowText('updated'), 'success');
    } catch (_0x2fef7c) {
      workspaceStore["setWorkflowSaving"](![]);
      this['setFormError'](_0x2fef7c?.["message"] || workflowText('updateFailed'));
      this["renderModal"]();
      showToast(workflowText("updateFailed"), "error");
    }
  }
  ["getCanvasCenterWorld"]() {
    const {
      viewport: _0x1d678f
    } = getState();
    const _0x31a6f9 = window["innerWidth"] / 0x2;
    const _0xf60718 = window["innerHeight"] / 0x2;
    const _0x37dadb = document["documentElement"]?.["clientWidth"] || window["innerWidth"] || 0x0;
    const _0x18f880 = document['documentElement']?.['clientHeight'] || window['innerHeight'] || 0x0;
    if (!_0x37dadb || !_0x18f880) {
      return screenToWorld(_0x31a6f9, _0xf60718, _0x1d678f);
    }
    let _0x16d31d = 0x0;
    let _0x143992 = 0x0;
    let _0x191ff3 = _0x37dadb;
    let _0x530ff1 = _0x18f880;
    const _0x4ac9de = [];
    const _0x4595b7 = document["querySelector"]('header');
    if (_0x4595b7) {
      _0x4ac9de['push'](_0x4595b7);
    }
    const _0x5f34cf = document["querySelector"]('.sidebar-floating');
    if (_0x5f34cf) {
      _0x4ac9de["push"](_0x5f34cf);
    }
    this["sidebarPanel"]?.["classList"]?.["contains"]("show") && _0x4ac9de["push"](this["sidebarPanel"]);
    const _0x1d9335 = 0x8;
    for (const _0xd75c9c of _0x4ac9de) {
      if (!_0xd75c9c?.["isConnected"]) {
        continue;
      }
      const _0x9e5e2a = _0xd75c9c["getBoundingClientRect"]();
      const _0x1527f5 = Math["max"](_0x16d31d, _0x9e5e2a['left']);
      const _0x2e8e8a = Math['max'](_0x143992, _0x9e5e2a["top"]);
      const _0x5539fd = Math["min"](_0x191ff3, _0x9e5e2a["right"]);
      const _0x1e0edf = Math["min"](_0x530ff1, _0x9e5e2a['bottom']);
      if (_0x5539fd <= _0x1527f5 || _0x1e0edf <= _0x2e8e8a) {
        continue;
      }
      if (_0x9e5e2a['left'] <= _0x16d31d + _0x1d9335 && _0x9e5e2a["right"] > _0x16d31d + _0x1d9335) {
        _0x16d31d = Math["max"](_0x16d31d, _0x9e5e2a["right"]);
        continue;
      }
      if (_0x9e5e2a["right"] >= _0x191ff3 - _0x1d9335 && _0x9e5e2a["left"] < _0x191ff3 - _0x1d9335) {
        _0x191ff3 = Math["min"](_0x191ff3, _0x9e5e2a["left"]);
        continue;
      }
      if (_0x9e5e2a["top"] <= _0x143992 + _0x1d9335 && _0x9e5e2a["bottom"] > _0x143992 + _0x1d9335) {
        _0x143992 = Math["max"](_0x143992, _0x9e5e2a["bottom"]);
        continue;
      }
      _0x9e5e2a["bottom"] >= _0x530ff1 - _0x1d9335 && _0x9e5e2a['top'] < _0x530ff1 - _0x1d9335 && (_0x530ff1 = Math['min'](_0x530ff1, _0x9e5e2a["top"]));
    }
    const _0x120344 = _0x191ff3 - _0x16d31d;
    const _0x4d0617 = _0x530ff1 - _0x143992;
    const _0x5a3862 = _0x120344 > 0x28 ? _0x16d31d + _0x120344 / 0x2 : _0x31a6f9;
    const _0x5bc921 = _0x4d0617 > 0x28 ? _0x143992 + _0x4d0617 / 0x2 : _0xf60718;
    return screenToWorld(_0x5a3862, _0x5bc921, _0x1d678f);
  }
  async ["applyWorkflow"](_0x3ec8e0) {
    const _0x5dd661 = getState();
    const _0x4c2dd3 = _0x5dd661['workflowUi'] || {};
    if (_0x4c2dd3['applyingWorkflowId']) {
      return;
    }
    const _0x3b69eb = findWorkflowById(_0x5dd661["workflows"]?.["items"] || [], _0x3ec8e0);
    if (!_0x3b69eb) {
      showToast(workflowText('workflowMissing'), "error");
      return;
    }
    workspaceStore["setWorkflowApplying"](_0x3b69eb['id']);
    try {
      const _0x1b635c = applyWorkflowToCanvas(_0x3b69eb, this["getCanvasCenterWorld"]());
      if (_0x1b635c["nodes"]["length"] === 0x0) {
        showToast(workflowText("empty.noApplicableNodes"), "warn");
        return;
      }
      graphStore["batch"](() => {
        for (const _0x135c49 of _0x1b635c['nodes']) {
          graphStore["addNode"](_0x135c49);
        }
        for (const _0x48722a of _0x1b635c["edges"]) {
          graphStore["addEdge"](_0x48722a);
        }
        graphStore['setSelectedNodes'](_0x1b635c["nodes"]["map"](_0xabb10d => _0xabb10d['id']));
      });
      commit();
      const _0x307905 = Date["now"]();
      workspaceStore['markWorkflowUsed'](_0x3b69eb['id'], _0x307905);
      saveWorkflowUsage({
        ..._0x3b69eb,
        'lastUsedAt': _0x307905
      }, _0x307905)["catch"](() => {});
      showToast(workflowText("applied"), 'success');
    } catch (_0x34c05a) {
      showToast(_0x34c05a?.["message"] || workflowText("applyFailed"), 'error');
    } finally {
      workspaceStore["setWorkflowApplying"](null);
    }
  }
}
export const workflowManager = new WorkflowManager();