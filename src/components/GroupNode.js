import a394_0x3e9095 from '../core/stores/appStore.js';
import { executeCommand } from '../core/interaction.js';
import { commit } from '../modules/history.js';
import { cancelGroupGenerateButtons, executeGroupGenerateButtons, hasRunningGroupGenerateNodes } from '../modules/groupExecution.js';
import { collectGroupContainmentReparentOps } from '../modules/groupMembership.js';
import { startNodeResizePreview } from '../modules/interaction/nodeResizePreview.js';
import { collectGroupSyncPlayableVideoEntries, syncPlayGroupVideos } from '../modules/videoSyncPlayback.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { SAVED_WORKFLOW_LIBRARY_ENTRY_ENABLED } from '../config/productFeatures.js';
const getStateSnapshot = () => typeof a394_0x3e9095["getStateRaw"] === "function" ? a394_0x3e9095["getStateRaw"]() : a394_0x3e9095["getState"]();
function groupText(_0x4433ea, _0x5028f7 = {}) {
  return t("groupNode." + _0x4433ea, _0x5028f7);
}
export class GroupNode {
  constructor(_0x1677aa) {
    this["_data"] = _0x1677aa;
    this['_rootEl'] = null;
    this['_titleEl'] = null;
    this["_toolbarEl"] = null;
    this['_detachedToolbarEl'] = null;
    this["_colorMenuOutsidePointerDown"] = null;
    this["_toolbarInteractivityRaf"] = null;
    this["_toolbarPreviewOffsetX"] = 0x0;
    this["_toolbarPreviewOffsetY"] = 0x0;
    this['_toolbarAnchorInsetY'] = null;
    this['_lastSyncPlayableVideoCount'] = null;
    this["_unsubscribeLocale"] = null;
    this['_disposeTitleEdit'] = null;
  }
  ['mount']() {
    this["_rootEl"] = document["createElement"]('div');
    this["_rootEl"]["style"]["width"] = "100%";
    this["_rootEl"]["style"]["height"] = "100%";
    const _0x366571 = document["createElement"]("div");
    _0x366571['className'] = "node-group-drag-handle";
    _0x366571["dataset"]["groupDragHandleFor"] = this["_data"]['id'];
    _0x366571["setAttribute"]("aria-hidden", 'true');
    this["_rootEl"]["appendChild"](_0x366571);
    this["_titleEl"] = document['createElement']("div");
    this["_titleEl"]["className"] = 'node-group-title';
    this["_titleEl"]["contentEditable"] = "true";
    this["_titleEl"]['spellcheck'] = ![];
    this['_titleEl']["title"] = groupText("renameTooltip");
    this["_titleEl"]['textContent'] = this['_data']['name'] || groupText("defaultName");
    const _0x3689ce = this["_titleEl"];
    const _0x30b858 = this["_data"]['id'];
    let _0x25e638 = null;
    let _0x3b679d = null;
    this["_disposeTitleEdit"] = () => {
      _0x25e638 = null;
      _0x3b679d?.();
      _0x3b679d = null;
    };
    _0x3689ce["addEventListener"]("focus", () => {
      this['_disposeTitleEdit']();
      _0x25e638 = getStateSnapshot()["nodes"];
      _0x3b679d = a394_0x3e9095['subscribeRaw'](() => {
        const _0x4b4fc9 = getStateSnapshot();
        if (_0x4b4fc9["nodes"] === _0x25e638 && _0x4b4fc9['nodes']?.[_0x30b858]) {
          return;
        }
        this["_disposeTitleEdit"]();
        _0x3689ce["textContent"] = _0x4b4fc9['nodes']?.[_0x30b858]?.['name'] || groupText("defaultName");
        _0x3689ce['blur']();
      });
    });
    this["_titleEl"]["addEventListener"]("pointerdown", _0x23febf => _0x23febf['stopPropagation']());
    this["_titleEl"]['addEventListener']("keydown", _0x8371e7 => {
      if (_0x8371e7["isComposing"]) {
        return;
      }
      _0x8371e7["key"] === 'Enter' && (_0x8371e7["preventDefault"](), this["_titleEl"]['blur']());
    });
    this["_titleEl"]['addEventListener']("blur", () => {
      const _0x64aab2 = getStateSnapshot();
      const _0xc802ff = _0x25e638 && _0x64aab2["nodes"] === _0x25e638 && _0x64aab2["nodes"]?.[_0x30b858] && _0x3689ce["isConnected"];
      this['_disposeTitleEdit']?.();
      if (!_0xc802ff || _0x3689ce["textContent"] === _0x64aab2["nodes"][_0x30b858]["name"]) {
        return;
      }
      a394_0x3e9095['updateNodeData'](_0x30b858, {
        'name': _0x3689ce['textContent']
      });
      commit();
    });
    this["_rootEl"]["appendChild"](this["_titleEl"]);
    const _0x26be07 = document['createElement']("div");
    _0x26be07["className"] = "group-toolbar";
    _0x26be07["dataset"]['groupToolbarFor'] = this["_data"]['id'];
    _0x26be07["onpointerdown"] = _0x3056b4 => _0x3056b4["stopPropagation"]();
    this["_toolbarEl"] = _0x26be07;
    const _0x5e4d04 = "http://www.w3.org/2000/svg";
    const _0x13b8e6 = () => {
      const _0x5345b6 = document["createElementNS"](_0x5e4d04, "svg");
      _0x5345b6['setAttribute']("viewBox", "0 0 24 24");
      _0x5345b6["setAttribute"]('fill', "none");
      _0x5345b6["setAttribute"]("stroke", "currentColor");
      _0x5345b6["setAttribute"]('stroke-linecap', "round");
      _0x5345b6["setAttribute"]('stroke-linejoin', "round");
      return _0x5345b6;
    };
    const _0x17f112 = (_0x4eb14e, _0x49fa45) => {
      _0x4eb14e['type'] = "button";
      const _0x170dff = groupText(_0x49fa45);
      _0x4eb14e["title"] = _0x170dff;
      _0x4eb14e['setAttribute']("aria-label", _0x170dff);
    };
    const _0x5a928c = (_0x3434ae, _0x8bfb4d) => {
      const _0x179874 = document["createElementNS"](_0x5e4d04, "path");
      _0x179874["setAttribute"]('d', _0x8bfb4d);
      _0x3434ae['appendChild'](_0x179874);
      return _0x179874;
    };
    const _0x330618 = document["createElement"]('button');
    _0x330618['className'] = 'gt-btn\x20gt-btn-run';
    _0x17f112(_0x330618, "toolbar.runGroup");
    _0x330618["replaceChildren"]();
    const _0x3739b4 = _0x13b8e6();
    _0x3739b4["setAttribute"]('stroke-width', '2');
    _0x5a928c(_0x3739b4, "M12 3l1.2 4.1L17 8.3l-3.8 1.2L12 13.5l-1.2-4-3.8-1.2 3.8-1.2L12 3z");
    _0x5a928c(_0x3739b4, 'M18\x2014l.7\x202.3L21\x2017l-2.3.7L18\x2020l-.7-2.3L15\x2017l2.3-.7L18\x2014z');
    _0x5a928c(_0x3739b4, "M6 13l.8 2.7L9.5 16.5l-2.7.8L6 20l-.8-2.7-2.7-.8 2.7-.8L6 13z");
    _0x330618["appendChild"](_0x3739b4);
    _0x330618["onclick"] = _0x4c2a63 => {
      _0x4c2a63["stopPropagation"]();
      this["_runGroup"]();
    };
    _0x26be07["appendChild"](_0x330618);
    const _0x41b652 = document['createElement']('button');
    _0x41b652['className'] = "gt-btn gt-btn-sync-play";
    _0x17f112(_0x41b652, "toolbar.syncPlay");
    _0x41b652["replaceChildren"]();
    const _0x2958b9 = _0x13b8e6();
    _0x2958b9["setAttribute"]("stroke-width", "2.5");
    const _0x9a197f = document['createElementNS'](_0x5e4d04, "polygon");
    _0x9a197f["setAttribute"]("points", "5 3 19 12 5 21 5 3");
    _0x2958b9["appendChild"](_0x9a197f);
    _0x41b652["appendChild"](_0x2958b9);
    _0x41b652["style"]['display'] = "none";
    _0x41b652["onclick"] = _0x3e4434 => {
      _0x3e4434["stopPropagation"]();
      this["_syncPlayGroupVideos"]();
    };
    _0x26be07["appendChild"](_0x41b652);
    const _0x4f704d = document["createElement"]("div");
    _0x4f704d['className'] = "gt-color-wrap";
    const _0x43dc76 = document["createElement"]("button");
    _0x43dc76['className'] = "gt-btn gt-btn-color";
    _0x17f112(_0x43dc76, "toolbar.color");
    _0x43dc76['replaceChildren']();
    const _0x11681b = document["createElement"]("div");
    _0x11681b["className"] = "color-dot";
    _0x11681b["style"]["background"] = this["_data"]['color'] || "var(--indigo)";
    _0x43dc76["appendChild"](_0x11681b);
    const _0x2428d4 = document["createElement"]("div");
    _0x2428d4["className"] = "gt-color-menu";
    const _0x2dab0e = ["var(--indigo)", "var(--green)", 'var(--gold)', "var(--red)", 'var(--purple)', 'var(--group-pink)', "var(--group-slate)", "var(--cyan)"];
    _0x43dc76["onclick"] = _0x2dd03a => {
      _0x2dd03a["stopPropagation"]();
      const _0x545600 = _0x2428d4["classList"]['contains']("show");
      document["querySelectorAll"](".gt-color-menu.show")["forEach"](_0x1169cb => _0x1169cb["classList"]["remove"]("show"));
      if (!_0x545600) {
        _0x2428d4["classList"]["add"]("show");
      }
    };
    _0x2dab0e["forEach"](_0x5e41c5 => {
      const _0x1e5616 = document["createElement"]("div");
      _0x1e5616['className'] = "color-option";
      _0x1e5616["dataset"]["groupColor"] = _0x5e41c5;
      _0x1e5616["style"]["background"] = _0x5e41c5;
      _0x1e5616["onclick"] = _0x6435f6 => {
        _0x6435f6["stopPropagation"]();
        this['_setColor'](_0x5e41c5);
      };
      _0x2428d4['appendChild'](_0x1e5616);
    });
    this['_colorMenuOutsidePointerDown'] = () => _0x2428d4["classList"]["remove"]('show');
    window['addEventListener']('pointerdown', this["_colorMenuOutsidePointerDown"]);
    _0x4f704d['appendChild'](_0x43dc76);
    _0x4f704d["appendChild"](_0x2428d4);
    _0x26be07["appendChild"](_0x4f704d);
    const _0x5c32bd = document["createElement"]("button");
    _0x5c32bd["className"] = "gt-btn gt-btn-workflow";
    _0x5c32bd["hidden"] = !SAVED_WORKFLOW_LIBRARY_ENTRY_ENABLED;
    _0x5c32bd['disabled'] = !SAVED_WORKFLOW_LIBRARY_ENTRY_ENABLED;
    _0x5c32bd["setAttribute"]('aria-hidden', String(!SAVED_WORKFLOW_LIBRARY_ENTRY_ENABLED));
    _0x17f112(_0x5c32bd, "toolbar.createWorkflow");
    _0x5c32bd["replaceChildren"]();
    const _0x184da5 = _0x13b8e6();
    _0x184da5["setAttribute"]("stroke-width", "1.8");
    const _0x4c4ed3 = document["createElementNS"](_0x5e4d04, "rect");
    _0x4c4ed3["setAttribute"]('x', '3');
    _0x4c4ed3["setAttribute"]('y', '3');
    _0x4c4ed3["setAttribute"]("width", '18');
    _0x4c4ed3["setAttribute"]("height", '18');
    _0x4c4ed3["setAttribute"]('rx', '2');
    _0x4c4ed3["setAttribute"]('ry', '2');
    const _0x458f8b = document["createElementNS"](_0x5e4d04, "line");
    _0x458f8b['setAttribute']('x1', '3');
    _0x458f8b["setAttribute"]('y1', '9');
    _0x458f8b["setAttribute"]('x2', '21');
    _0x458f8b['setAttribute']('y2', '9');
    const _0x4f073b = document['createElementNS'](_0x5e4d04, "line");
    _0x4f073b["setAttribute"]('x1', '9');
    _0x4f073b["setAttribute"]('y1', '21');
    _0x4f073b["setAttribute"]('x2', '9');
    _0x4f073b["setAttribute"]('y2', '9');
    _0x184da5["appendChild"](_0x4c4ed3);
    _0x184da5["appendChild"](_0x458f8b);
    _0x184da5["appendChild"](_0x4f073b);
    _0x5c32bd["appendChild"](_0x184da5);
    _0x5c32bd["onclick"] = _0x359727 => {
      _0x359727["stopPropagation"]();
      this["_requestWorkflow"]();
    };
    _0x26be07["appendChild"](_0x5c32bd);
    const _0x2b805a = document['createElement']("button");
    _0x2b805a["className"] = "gt-btn gt-btn-ungroup";
    _0x17f112(_0x2b805a, "toolbar.ungroup");
    _0x2b805a["replaceChildren"]();
    const _0xe2e91d = _0x13b8e6();
    _0xe2e91d['setAttribute']("stroke-width", '2');
    const _0x51dabc = document['createElementNS'](_0x5e4d04, 'path');
    _0x51dabc["setAttribute"]('d', "M3 6h18");
    const _0x37f338 = document['createElementNS'](_0x5e4d04, 'path');
    _0x37f338["setAttribute"]('d', 'M8\x206V4c0-1.1.9-2\x202-2h4c1.1\x200\x202\x20.9\x202\x202v2');
    const _0x2e1127 = document["createElementNS"](_0x5e4d04, "path");
    _0x2e1127["setAttribute"]('d', "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6");
    const _0x270e11 = document["createElementNS"](_0x5e4d04, 'line');
    _0x270e11["setAttribute"]('x1', '10');
    _0x270e11["setAttribute"]('y1', '11');
    _0x270e11["setAttribute"]('x2', '10');
    _0x270e11['setAttribute']('y2', '17');
    const _0x1d546d = document["createElementNS"](_0x5e4d04, "line");
    _0x1d546d["setAttribute"]('x1', '14');
    _0x1d546d['setAttribute']('y1', '11');
    _0x1d546d['setAttribute']('x2', '14');
    _0x1d546d["setAttribute"]('y2', '17');
    _0xe2e91d["appendChild"](_0x51dabc);
    _0xe2e91d["appendChild"](_0x37f338);
    _0xe2e91d["appendChild"](_0x2e1127);
    _0xe2e91d["appendChild"](_0x270e11);
    _0xe2e91d['appendChild'](_0x1d546d);
    _0x2b805a["appendChild"](_0xe2e91d);
    _0x2b805a["onclick"] = _0x499d83 => {
      _0x499d83["stopPropagation"]();
      this['_ungroup']();
    };
    _0x26be07["appendChild"](_0x2b805a);
    this["_rootEl"]["appendChild"](_0x26be07);
    this["_mountDetachedToolbar"](_0x26be07);
    const _0x5bcf1f = document['createElement']("div");
    _0x5bcf1f["className"] = 'group-resizer';
    _0x5bcf1f["style"]['pointerEvents'] = "auto";
    _0x5bcf1f["addEventListener"]('pointerdown', _0x2fd452 => {
      startNodeResizePreview({
        'event': _0x2fd452,
        'nodeId': this['_data']['id'],
        'getNode': () => getStateSnapshot()["nodes"]?.[this['_data']['id']] || this['_data'],
        'getViewport': () => getStateSnapshot()['viewport'],
        'resolveSize': ({
          startWidth: _0x3ed5b4,
          startHeight: _0x2a7d48,
          dx: _0x8589d1,
          dy: _0x4df8a4
        }) => ({
          'width': Math['max'](0x96, _0x3ed5b4 + _0x8589d1),
          'height': Math['max'](0x64, _0x2a7d48 + _0x4df8a4)
        }),
        'applyPatch': _0x475e93 => a394_0x3e9095["updateNodeData"](this["_data"]['id'], _0x475e93),
        'onPreview': _0x5c8f2c => this["_syncToolbarPosition"](_0x5c8f2c["width"]),
        'afterApply': () => this["_syncContainedChildren"](),
        'commit': commit,
        'label': "group-resize"
      });
    });
    this['_rootEl']["appendChild"](_0x5bcf1f);
    this["_syncColor"](this['_data']['color'] || "var(--indigo)");
    this['_syncGroupRunButton'](getStateSnapshot()["nodes"] || {});
    this['_syncGroupSyncPlaybackButton'](getStateSnapshot()['nodes'] || {});
    this["_unsubscribeLocale"] = onLocaleChange(() => this["_syncLocaleTexts"]());
    return this["_rootEl"];
  }
  ['_syncLocaleTexts']() {
    this["_titleEl"] && (this["_titleEl"]["title"] = groupText('renameTooltip'), !String(this["_data"]?.['name'] || '')["trim"]() && document['activeElement'] !== this["_titleEl"] && (this["_titleEl"]["textContent"] = groupText('defaultName')));
    const _0x76522e = [[".gt-btn-run", "toolbar.runGroup"], [".gt-btn-sync-play", "toolbar.syncPlay"], [".gt-btn-color", 'toolbar.color'], [".gt-btn-workflow", "toolbar.createWorkflow"], [".gt-btn-ungroup", "toolbar.ungroup"]];
    for (const _0x440097 of [this["_toolbarEl"], this["_detachedToolbarEl"]]) {
      if (!_0x440097) {
        continue;
      }
      for (const [_0x4f16d9, _0x3496cc] of _0x76522e) {
        const _0xd4193f = _0x440097["querySelector"](_0x4f16d9);
        if (!_0xd4193f) {
          continue;
        }
        const _0x46022e = groupText(_0x3496cc);
        _0xd4193f["title"] = _0x46022e;
        _0xd4193f["setAttribute"]("aria-label", _0x46022e);
      }
    }
    this["_syncGroupRunButton"](getStateSnapshot()["nodes"] || {});
  }
  ["_mountDetachedToolbar"](_0x5815a4) {
    const _0x4f9a59 = document["getElementById"]("v2-canvas");
    if (!_0x4f9a59) {
      return;
    }
    const _0x8fb7da = _0x5815a4['cloneNode'](!![]);
    _0x8fb7da["classList"]["add"]("group-toolbar--detached");
    _0x8fb7da["onpointerdown"] = _0x441198 => _0x441198["stopPropagation"]();
    _0x8fb7da['addEventListener']('click', _0x45ee96 => this['_handleDetachedToolbarClick'](_0x45ee96));
    _0x4f9a59['appendChild'](_0x8fb7da);
    this["_detachedToolbarEl"] = _0x8fb7da;
    this["_syncToolbarPosition"]();
  }
  ["_syncToolbarPosition"](_0x4cbb77 = null) {
    if (!this["_detachedToolbarEl"]) {
      return;
    }
    const _0x16af36 = Number["isFinite"](this['_data']['x']) ? this["_data"]['x'] : 0x0;
    const _0x1d9c3a = Number["isFinite"](this["_data"]['y']) ? this["_data"]['y'] : 0x0;
    const _0x462954 = Number["isFinite"](_0x4cbb77) ? _0x4cbb77 : Number["isFinite"](this["_data"]["width"]) ? this['_data']['width'] : 0x0;
    const _0x150faa = _0x16af36 + this["_toolbarPreviewOffsetX"] + _0x462954 / 0x2;
    const _0x4115ca = _0x1d9c3a + this["_toolbarPreviewOffsetY"] + this["_resolveToolbarAnchorInsetY"]();
    this["_detachedToolbarEl"]["style"]["left"] = _0x150faa + 'px';
    this["_detachedToolbarEl"]['style']['top'] = _0x4115ca + 'px';
  }
  ["_resolveToolbarAnchorInsetY"]() {
    if (Number['isFinite'](this["_toolbarAnchorInsetY"])) {
      return this["_toolbarAnchorInsetY"];
    }
    const _0x196a7a = this["_rootEl"]?.["parentElement"];
    if (!_0x196a7a) {
      return 0x0;
    }
    const _0x3ffa0d = Number['parseFloat'](window["getComputedStyle"](_0x196a7a)['borderTopWidth']);
    const _0x5acddd = Number['parseFloat'](window["getComputedStyle"](this["_detachedToolbarEl"])["borderTopWidth"]);
    this["_toolbarAnchorInsetY"] = (Number["isFinite"](_0x3ffa0d) ? _0x3ffa0d : 0x0) + (Number["isFinite"](_0x5acddd) ? _0x5acddd : 0x0);
    return this["_toolbarAnchorInsetY"];
  }
  ['syncDragPreview']({
    dx = 0x0,
    dy = 0x0,
    active = ![]
  } = {}) {
    this["_detachedToolbarEl"]?.["classList"]['toggle']('is-drag-preview', active === !![]);
    const _0xb5a31c = active && Number["isFinite"](dx) ? dx : 0x0;
    const _0x382b29 = active && Number["isFinite"](dy) ? dy : 0x0;
    if (_0xb5a31c === this["_toolbarPreviewOffsetX"] && _0x382b29 === this['_toolbarPreviewOffsetY']) {
      return;
    }
    this["_toolbarPreviewOffsetX"] = _0xb5a31c;
    this["_toolbarPreviewOffsetY"] = _0x382b29;
    this["_syncToolbarPosition"]();
  }
  ["syncSelectionState"]({
    selected = ![],
    singleSelected = ![],
    visible = !![],
    nodes = null
  } = {}) {
    if (!this['_detachedToolbarEl']) {
      return;
    }
    this['_syncGroupRunButton'](nodes || getStateSnapshot()["nodes"] || {});
    this["_syncGroupSyncPlaybackButton"](nodes || getStateSnapshot()["nodes"] || {});
    const _0xabec16 = visible && selected && singleSelected;
    this['_detachedToolbarEl']['classList']["toggle"]("is-visible", _0xabec16);
    if (!_0xabec16) {
      this["_toolbarInteractivityRaf"] !== null && (cancelAnimationFrame(this["_toolbarInteractivityRaf"]), this['_toolbarInteractivityRaf'] = null);
      this['_syncDetachedToolbarInteractivity'](![]);
      return;
    }
    this['_syncToolbarPosition']();
    this["_scheduleDetachedToolbarInteractivitySync"](_0xabec16);
  }
  ['_syncColor'](_0x4f6834) {
    [this['_toolbarEl'], this["_detachedToolbarEl"]]["forEach"](_0x1ed572 => {
      const _0x4d4bef = _0x1ed572?.["querySelector"](".color-dot");
      if (_0x4d4bef) {
        _0x4d4bef['style']["background"] = _0x4f6834;
      }
    });
  }
  ["_closeColorMenus"]() {
    document["querySelectorAll"](".gt-color-menu.show")['forEach'](_0x27e4f6 => _0x27e4f6['classList']["remove"]("show"));
  }
  ["_runGroup"]() {
    const _0x43c6cf = getStateSnapshot();
    hasRunningGroupGenerateNodes(_0x43c6cf["nodes"] || {}, this['_data']['id']) ? cancelGroupGenerateButtons({
      'groupId': this["_data"]['id'],
      'state': _0x43c6cf
    }) : executeGroupGenerateButtons({
      'groupId': this["_data"]['id'],
      'state': _0x43c6cf
    });
    this["_syncGroupRunButton"](getStateSnapshot()['nodes'] || {});
  }
  ["_syncGroupRunButton"](_0x3d376d = {}) {
    const _0x45c61b = hasRunningGroupGenerateNodes(_0x3d376d, this['_data']['id']);
    const _0x11d518 = groupText(_0x45c61b ? "toolbar.stopGroup" : "toolbar.runGroup");
    [this['_toolbarEl'], this["_detachedToolbarEl"]]['forEach'](_0x360c82 => {
      const _0x2bb05d = _0x360c82?.["querySelector"]?.(".gt-btn-run");
      if (!_0x2bb05d) {
        return;
      }
      _0x2bb05d["title"] = _0x11d518;
      _0x2bb05d["setAttribute"]("aria-label", _0x11d518);
      _0x2bb05d["setAttribute"]("aria-busy", String(_0x45c61b));
      _0x2bb05d["classList"]["toggle"]("is-active", _0x45c61b);
    });
  }
  ["_syncPlayGroupVideos"]() {
    void syncPlayGroupVideos({
      'groupId': this["_data"]['id'],
      'state': getStateSnapshot()
    });
  }
  ["_syncGroupSyncPlaybackButton"](_0x4f6a22 = {}) {
    const _0x48ca66 = collectGroupSyncPlayableVideoEntries(_0x4f6a22, this["_data"]['id'])['length'];
    if (_0x48ca66 === this["_lastSyncPlayableVideoCount"]) {
      return;
    }
    this["_lastSyncPlayableVideoCount"] = _0x48ca66;
    const _0x1dfd5d = _0x48ca66 >= 0x2;
    [this["_toolbarEl"], this['_detachedToolbarEl']]["forEach"](_0x2916e0 => {
      const _0x86885f = _0x2916e0?.["querySelector"]?.(".gt-btn-sync-play");
      if (!_0x86885f) {
        return;
      }
      _0x86885f["style"]["display"] = _0x1dfd5d ? '' : "none";
      _0x86885f["disabled"] = !_0x1dfd5d;
      _0x86885f["classList"]["toggle"]("is-disabled", !_0x1dfd5d);
    });
  }
  ['_setColor'](_0x479a88) {
    a394_0x3e9095["updateNodeData"](this["_data"]['id'], {
      'color': _0x479a88
    });
    this["_closeColorMenus"]();
    commit();
  }
  ['_syncContainedChildren']() {
    const {
      nodes: _0x13f50b
    } = getStateSnapshot();
    const _0x48d3f3 = collectGroupContainmentReparentOps(_0x13f50b, [this["_data"]['id']]);
    if (_0x48d3f3["length"] === 0x0) {
      return ![];
    }
    const _0x464b9d = () => {
      _0x48d3f3["forEach"](({
        nodeId: _0x1089ba,
        parentId: _0x1b27d9
      }) => {
        a394_0x3e9095["groupNodes"]([_0x1089ba], _0x1b27d9);
      });
    };
    if (typeof a394_0x3e9095["batch"] === "function") {
      a394_0x3e9095["batch"](_0x464b9d);
      return !![];
    }
    _0x464b9d();
    return !![];
  }
  ["_requestWorkflow"]() {
    window['dispatchEvent'](new CustomEvent("workflow:create-request", {
      'detail': {
        'source': "group-toolbar",
        'groupId': this["_data"]['id']
      }
    }));
  }
  ['_ungroup']() {
    executeCommand("ungroup", {
      'ids': [this['_data']['id']]
    });
  }
  ["_handleDetachedToolbarClick"](_0x23f8c6) {
    const _0x3d4322 = _0x23f8c6['target'];
    if (!(_0x3d4322 instanceof Element)) {
      return;
    }
    const _0x30c4c7 = _0x3d4322["closest"](".gt-btn-run, .gt-btn-sync-play, .gt-btn-color, .gt-btn-workflow, .gt-btn-ungroup, .color-option");
    if (!_0x30c4c7 || !this["_detachedToolbarEl"]?.["contains"](_0x30c4c7)) {
      return;
    }
    _0x23f8c6["stopPropagation"]();
    if (_0x30c4c7["classList"]['contains']("color-option")) {
      const _0x1eaa7a = _0x30c4c7["dataset"]["groupColor"] || _0x30c4c7["style"]["background"];
      if (_0x1eaa7a) {
        this["_setColor"](_0x1eaa7a);
      }
      return;
    }
    if (_0x30c4c7["classList"]["contains"]("gt-btn-run")) {
      this['_runGroup']();
      return;
    }
    if (_0x30c4c7["classList"]['contains']("gt-btn-sync-play")) {
      this["_syncPlayGroupVideos"]();
      return;
    }
    if (_0x30c4c7['classList']["contains"]('gt-btn-workflow')) {
      this["_requestWorkflow"]();
      return;
    }
    if (_0x30c4c7['classList']["contains"]("gt-btn-ungroup")) {
      this["_ungroup"]();
      return;
    }
    if (_0x30c4c7["classList"]["contains"]("gt-btn-color")) {
      const _0x3e2d47 = this["_detachedToolbarEl"]["querySelector"]('.gt-color-menu');
      const _0x3b47ba = _0x3e2d47?.['classList']["contains"]("show");
      this["_closeColorMenus"]();
      if (_0x3e2d47 && !_0x3b47ba) {
        _0x3e2d47["classList"]['add']("show");
      }
    }
  }
  ["_syncDetachedToolbarInteractivity"](_0x54eec7) {
    if (!this["_detachedToolbarEl"]) {
      return;
    }
    this["_detachedToolbarEl"]["classList"]["remove"]('is-interactive');
    this["_toolbarEl"]?.["classList"]["remove"]('is-detached-source-hidden');
    if (!_0x54eec7 || !this['_toolbarEl']) {
      return;
    }
    const _0x5e3674 = Array["from"](this['_toolbarEl']["querySelectorAll"](".gt-btn"))['map'](_0x194285 => _0x194285["getBoundingClientRect"]())['filter'](_0x16c95a => _0x16c95a["width"] > 0x0 && _0x16c95a["height"] > 0x0);
    const _0x3c11cf = this["_toolbarEl"]['getBoundingClientRect']();
    _0x3c11cf["width"] > 0x0 && _0x3c11cf["height"] > 0x0 && _0x5e3674["push"](_0x3c11cf);
    const _0x2e8175 = _0x5e3674['some'](_0x3beea4 => {
      const _0x89b333 = _0x3beea4["left"] + _0x3beea4["width"] / 0x2;
      const _0x34b4e0 = _0x3beea4["top"] + _0x3beea4["height"] / 0x2;
      const _0x5a8304 = document['elementFromPoint'](_0x89b333, _0x34b4e0);
      return _0x5a8304 && !this["_toolbarEl"]["contains"](_0x5a8304);
    });
    this["_detachedToolbarEl"]["classList"]["toggle"]("is-interactive", _0x2e8175);
    this["_toolbarEl"]["classList"]['toggle']('is-detached-source-hidden', _0x2e8175);
  }
  ['_scheduleDetachedToolbarInteractivitySync'](_0x36bb32) {
    this["_syncDetachedToolbarInteractivity"](_0x36bb32);
    this["_toolbarInteractivityRaf"] !== null && (cancelAnimationFrame(this["_toolbarInteractivityRaf"]), this["_toolbarInteractivityRaf"] = null);
    if (typeof requestAnimationFrame !== "function") {
      return;
    }
    this['_toolbarInteractivityRaf'] = requestAnimationFrame(() => {
      this["_toolbarInteractivityRaf"] = null;
      this['_syncDetachedToolbarInteractivity'](_0x36bb32);
    });
  }
  ["update"](_0x1ed5e1) {
    _0x1ed5e1["name"] !== this['_data']['name'] && document["activeElement"] !== this["_titleEl"] && (this["_titleEl"]["textContent"] = _0x1ed5e1['name'] || groupText("defaultName"));
    _0x1ed5e1['color'] !== this["_data"]["color"] && this["_syncColor"](_0x1ed5e1["color"] || "var(--indigo)");
    this["_toolbarPreviewOffsetX"] = 0x0;
    this["_toolbarPreviewOffsetY"] = 0x0;
    this["_data"] = _0x1ed5e1;
    this['_syncToolbarPosition']();
    this["_syncGroupSyncPlaybackButton"](getStateSnapshot()["nodes"] || {});
  }
  ["unmount"]() {
    this['_disposeTitleEdit']?.();
    this["_disposeTitleEdit"] = null;
    this["_toolbarInteractivityRaf"] !== null && (cancelAnimationFrame(this["_toolbarInteractivityRaf"]), this["_toolbarInteractivityRaf"] = null);
    this['_colorMenuOutsidePointerDown'] && (window["removeEventListener"]("pointerdown", this["_colorMenuOutsidePointerDown"]), this["_colorMenuOutsidePointerDown"] = null);
    this["_unsubscribeLocale"]?.();
    this['_unsubscribeLocale'] = null;
    this["_toolbarEl"]?.["isConnected"] && this["_toolbarEl"]["remove"]();
    this["_detachedToolbarEl"]?.['isConnected'] && this["_detachedToolbarEl"]["remove"]();
    this["_detachedToolbarEl"] = null;
    this["_toolbarEl"] = null;
    this["_titleEl"] = null;
    this["_rootEl"] = null;
  }
}