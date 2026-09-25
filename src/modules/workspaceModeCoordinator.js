import { REPLACEMENT_STUDIO_MODE_ID, REPLACEMENT_STUDIO_NAME } from './workspaceStudioModes.js';
import { runCircularRevealTransition } from '../utils/circularRevealTransition.js';
import { resolveRendererVirtualizationTier } from '../core/rendererVirtualization.js';
export const WORKSPACE_MODE_CHANGED_EVENT = 'workspaceMode:changed';
const CANVAS_MODE_ID = "canvas";
const STORY_MODE_ID = "story";
const REPLICATION_MODE_ID = "replication";
const STORYBOARD_3D_MODE_ID = "storyboard3d";
const CANVAS_MODE_VIEW_TRANSITION_BYPASS_MAX_ZOOM = 0.32;
const WORKSPACE_MODE_IDS = new Set([CANVAS_MODE_ID, STORY_MODE_ID, REPLICATION_MODE_ID, STORYBOARD_3D_MODE_ID, REPLACEMENT_STUDIO_MODE_ID]);
const MODE_BODY_CLASSES = Object["freeze"]({
  [STORY_MODE_ID]: ["story-workspace-active"],
  [REPLICATION_MODE_ID]: ["story-workspace-active", 'replication-workspace-active'],
  [STORYBOARD_3D_MODE_ID]: ["storyboard-3d-workspace-active"],
  [REPLACEMENT_STUDIO_MODE_ID]: ["person-replacement-workspace-active", "replacement-studio-workspace-active"]
});
function normalizeWorkspaceMode(_0x3e186b) {
  return WORKSPACE_MODE_IDS["has"](_0x3e186b) ? _0x3e186b : CANVAS_MODE_ID;
}
export function shouldBypassCanvasModeViewTransition({
  currentMode: _0x610cab,
  nextMode: _0x356faf,
  canvasPresentationContext = null
} = {}) {
  if (_0x610cab !== CANVAS_MODE_ID && _0x356faf !== CANVAS_MODE_ID) {
    return ![];
  }
  const _0x3bbca1 = Number(canvasPresentationContext?.['viewport']?.["zoom"]);
  if (!Number['isFinite'](_0x3bbca1) || _0x3bbca1 > CANVAS_MODE_VIEW_TRANSITION_BYPASS_MAX_ZOOM) {
    return ![];
  }
  return resolveRendererVirtualizationTier({
    'viewport': canvasPresentationContext?.["viewport"],
    'nodeCount': canvasPresentationContext?.['nodeCount']
  }) === "very-dense-low-zoom";
}
export function isStoryboard3DWorkspaceAvailable(_0x3988b7 = globalThis['window']) {
  return !![];
}
function renderWorkspaceModeIcon(_0x270302) {
  if (_0x270302 === REPLICATION_MODE_ID) {
    return '<span\x20class=\x22workspace-mode-icon\x20workspace-mode-icon--replication\x22\x20aria-hidden=\x22true\x22><svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22><rect\x20x=\x223\x22\x20y=\x225\x22\x20width=\x2213\x22\x20height=\x2214\x22\x20rx=\x222\x22/><path\x20d=\x22m16\x209\x205-3v12l-5-3M7\x209l5\x203-5\x203z\x22/></svg></span>';
  }
  if (_0x270302 === REPLACEMENT_STUDIO_MODE_ID) {
    return '<span\x20class=\x22workspace-mode-icon\x20workspace-mode-icon--person-replacement\x22\x20aria-hidden=\x22true\x22><svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22><path\x20d=\x22M7.5\x2010.25a3.25\x203.25\x200\x201\x200\x200-6.5\x203.25\x203.25\x200\x200\x200\x200\x206.5Z\x22/><path\x20d=\x22M2.75\x2018.75v-1.5a4.75\x204.75\x200\x200\x201\x204.75-4.75h1.25\x22/><path\x20d=\x22M16.5\x2013.75a3\x203\x200\x201\x200\x200-6\x203\x203\x200\x200\x200\x200\x206Z\x22/><path\x20d=\x22M12.25\x2020.25v-1.5A3.75\x203.75\x200\x200\x201\x2016\x2015h1a4.25\x204.25\x200\x200\x201\x204.25\x204.25v1\x22/><path\x20d=\x22m10.5\x208.25\x202-2\x202\x202M12.5\x206.25v5\x22/></svg></span>';
  }
  if (_0x270302 === STORYBOARD_3D_MODE_ID) {
    return "<span class=\"workspace-mode-icon workspace-mode-icon--storyboard3d\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"m12 3 8 4.5v9L12 21l-8-4.5v-9z\"/><path d=\"m4 7.5 8 4.5 8-4.5M12 12v9\"/><circle cx=\"12\" cy=\"8\" r=\"1.5\"/></svg></span>";
  }
  if (_0x270302 === STORY_MODE_ID) {
    return "<span class=\"workspace-mode-icon workspace-mode-icon--story\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M7 3.75h8.5L19 7.25v13H7z\"/><path d=\"M15.5 3.75v3.5H19M10 11h6M10 14.5h6M10 18h4\"/></svg></span>";
  }
  return "<span class=\"workspace-mode-icon workspace-mode-icon--canvas\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" fill=\"none\"><rect x=\"3.75\" y=\"3.75\" width=\"6.5\" height=\"6.5\" rx=\"1.25\"/><rect x=\"13.75\" y=\"3.75\" width=\"6.5\" height=\"6.5\" rx=\"1.25\"/><rect x=\"3.75\" y=\"13.75\" width=\"6.5\" height=\"6.5\" rx=\"1.25\"/><path d=\"M14 17h6M17 14v6\"/></svg></span>";
}
export function renderWorkspaceModeSwitcher(_0x284e79, {
  storyboard3DAvailable = ![],
  replicationAvailable = ![],
  menuOpen = ![]
} = {}) {
  const _0x7dfceb = normalizeWorkspaceMode(_0x284e79);
  const _0x1f20fd = _0x7dfceb === REPLICATION_MODE_ID ? "复刻工作室" : _0x7dfceb === STORY_MODE_ID ? '剧本工作室模式' : _0x7dfceb === REPLACEMENT_STUDIO_MODE_ID ? REPLACEMENT_STUDIO_NAME : _0x7dfceb === STORYBOARD_3D_MODE_ID ? '3D场景预演模式' : "画布模式";
  const _0x17a722 = storyboard3DAvailable ? '' : 'disabled\x20aria-disabled=\x22true\x22';
  const _0x33eb7b = replicationAvailable ? '' : 'disabled\x20aria-disabled=\x22true\x22';
  const _0x3560d1 = ["workspace-mode-switcher", menuOpen ? "is-open" : '']["filter"](Boolean)['join']('\x20');
  return "<div class=\"" + _0x3560d1 + "\" data-story-mode-switcher>\n    <button type=\"button\" class=\"workspace-mode-current\" aria-haspopup=\"menu\" aria-controls=\"workspaceModeMenu\" aria-expanded=\"" + menuOpen + '\x22>\x0a\x20\x20\x20\x20\x20\x20' + renderWorkspaceModeIcon(_0x7dfceb) + '\x0a\x20\x20\x20\x20\x20\x20<span\x20data-story-mode-current>' + _0x1f20fd + '</span>\x0a\x20\x20\x20\x20\x20\x20<span\x20class=\x22workspace-mode-chevron\x22\x20aria-hidden=\x22true\x22><svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22><path\x20d=\x22m6\x209\x206\x206\x206-6\x22/></svg></span>\x0a\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20<div\x20class=\x22workspace-mode-menu\x22\x20id=\x22workspaceModeMenu\x22\x20role=\x22menu\x22\x20aria-label=\x22工作区模式\x22\x20aria-hidden=\x22' + !menuOpen + "\">\n      <button type=\"button\" class=\"workspace-mode-option workspace-mode-option--canvas " + (_0x7dfceb === CANVAS_MODE_ID ? "is-active" : '') + "\" data-story-workspace-mode=\"" + CANVAS_MODE_ID + "\" role=\"menuitem\">\n        " + renderWorkspaceModeIcon(CANVAS_MODE_ID) + "\n        <span class=\"workspace-mode-option-copy\"><span class=\"workspace-mode-option-title\"><strong>画布模式</strong></span><small>节点创作与生成</small></span>\n      </button>\n      <button type=\"button\" class=\"workspace-mode-option workspace-mode-option--story " + (_0x7dfceb === STORY_MODE_ID ? "is-active" : '') + "\" data-story-workspace-mode=\"" + STORY_MODE_ID + "\" role=\"menuitem\">\n        " + renderWorkspaceModeIcon(STORY_MODE_ID) + "\n        <span class=\"workspace-mode-option-copy\"><span class=\"workspace-mode-option-title\"><strong>剧本工作室</strong><span class=\"workspace-mode-beta-badge\">beta</span></span><small>剧本、素材与分集</small></span>\n      </button>\n      <button type=\"button\" class=\"workspace-mode-option workspace-mode-option--person-replacement " + (_0x7dfceb === REPLACEMENT_STUDIO_MODE_ID ? "is-active" : '') + "\" data-story-workspace-mode=\"" + REPLACEMENT_STUDIO_MODE_ID + '\x22\x20role=\x22menuitem\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + renderWorkspaceModeIcon(REPLACEMENT_STUDIO_MODE_ID) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22workspace-mode-option-copy\x22><span\x20class=\x22workspace-mode-option-title\x22><strong>' + REPLACEMENT_STUDIO_NAME + "</strong><span class=\"workspace-mode-beta-badge\">beta</span></span><small>角色、镜头与声音替换</small></span>\n      </button>\n      <button type=\"button\" class=\"workspace-mode-option workspace-mode-option--storyboard3d " + (_0x7dfceb === STORYBOARD_3D_MODE_ID ? "is-active" : '') + "\" data-story-workspace-mode=\"" + STORYBOARD_3D_MODE_ID + "\" role=\"menuitem\" " + _0x17a722 + '>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + renderWorkspaceModeIcon(STORYBOARD_3D_MODE_ID) + "\n        <span class=\"workspace-mode-option-copy\"><span class=\"workspace-mode-option-title\"><strong>3D场景预演</strong></span><small>场景、机位与镜头预演</small></span>\n      </button>\n      <button type=\"button\" class=\"workspace-mode-option workspace-mode-option--replication " + (_0x7dfceb === REPLICATION_MODE_ID ? "is-active" : '') + '\x22\x20data-story-workspace-mode=\x22' + REPLICATION_MODE_ID + "\" role=\"menuitem\" " + _0x33eb7b + ">\n        " + renderWorkspaceModeIcon(REPLICATION_MODE_ID) + "\n        <span class=\"workspace-mode-option-copy\"><span class=\"workspace-mode-option-title\"><strong>复刻工作室</strong><span class=\"workspace-mode-beta-badge\">beta</span></span><small>原片分析与视频复刻</small>" + '</span>\x0a\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</div>';
}
function resolveMountTarget(_0x4927d3, _0x43f056) {
  if (typeof _0x43f056 === 'string') {
    return _0x4927d3?.["querySelector"]?.(_0x43f056) || null;
  }
  return _0x43f056 || null;
}
export function createWorkspaceModeCoordinator({
  documentObject = globalThis["document"],
  windowObject = globalThis["window"],
  mountTarget = ".header",
  initialMode = CANVAS_MODE_ID,
  canvasWorkspace = null,
  storyWorkspace = null,
  replicationWorkspace = null,
  storyboard3DWorkspace = null,
  replacementStudio = null,
  getCanvasPresentationContext = null
} = {}) {
  if (!documentObject?.["body"]) {
    return null;
  }
  const _0xee033 = resolveMountTarget(documentObject, mountTarget);
  if (!_0xee033) {
    return null;
  }
  const _0x2cb164 = _0xee033["querySelector"]?.(".workspace-mode-switcher-wrap");
  if (_0x2cb164?.["_workspaceModeCoordinator"]) {
    return _0x2cb164['_workspaceModeCoordinator'];
  }
  const _0x3b3b14 = Object["freeze"]({
    [CANVAS_MODE_ID]: canvasWorkspace,
    [STORY_MODE_ID]: storyWorkspace,
    [REPLICATION_MODE_ID]: replicationWorkspace,
    [STORYBOARD_3D_MODE_ID]: storyboard3DWorkspace,
    [REPLACEMENT_STUDIO_MODE_ID]: replacementStudio
  });
  const _0x2f9cf3 = _0x4de4ec => {
    const _0xc54380 = _0x3b3b14[_0x4de4ec];
    if (typeof _0xc54380?.["isAvailable"] === "function") {
      try {
        return _0xc54380["isAvailable"]() !== ![];
      } catch {
        return ![];
      }
    }
    if (_0x4de4ec === STORYBOARD_3D_MODE_ID) {
      return isStoryboard3DWorkspaceAvailable(windowObject);
    }
    return !![];
  };
  const _0x1e9796 = normalizeWorkspaceMode(initialMode);
  const _0x10dfa7 = {
    'mode': _0x2f9cf3(_0x1e9796) ? _0x1e9796 : CANVAS_MODE_ID,
    'storyboard3DAvailable': _0x2f9cf3(STORYBOARD_3D_MODE_ID),
    'replicationAvailable': _0x2f9cf3(REPLICATION_MODE_ID)
  };
  let _0x5ff1e3 = ![];
  let _0x4f2ae7 = 0x0;
  let _0x32ffae = _0x10dfa7["mode"];
  let _0x522b11 = ![];
  let _0x5f15f5 = ![];
  let _0xa503f6 = ![];
  const _0x476021 = documentObject["createElement"]("div");
  _0x476021['className'] = 'workspace-mode-switcher-wrap';
  _0xee033["appendChild"](_0x476021);
  const _0xebe20 = () => {
    _0xa503f6 = _0x522b11 || _0x5f15f5;
    _0x476021["innerHTML"] = renderWorkspaceModeSwitcher(_0x10dfa7["mode"], {
      'storyboard3DAvailable': _0x10dfa7["storyboard3DAvailable"],
      'replicationAvailable': _0x10dfa7['replicationAvailable'],
      'menuOpen': _0xa503f6
    });
  };
  const _0x1dcd3a = () => {
    canvasWorkspace?.["setPresentationActive"]?.(_0x10dfa7['mode'] === CANVAS_MODE_ID);
    const _0x5f039f = new Set(MODE_BODY_CLASSES[_0x10dfa7["mode"]] || []);
    new Set(Object["values"](MODE_BODY_CLASSES)["flat"]())["forEach"](_0x3544e9 => {
      documentObject["body"]['classList']['toggle'](_0x3544e9, _0x5f039f['has'](_0x3544e9));
    });
    documentObject["getElementById"]("v2-canvas")?.["setAttribute"]("aria-hidden", String(_0x10dfa7["mode"] !== CANVAS_MODE_ID));
    _0xebe20();
  };
  const _0xff0431 = ({
    focus = ''
  } = {}) => {
    const _0x52f21b = _0x522b11 || _0x5f15f5;
    _0xa503f6 = _0x52f21b;
    const _0x122db0 = _0x476021["querySelector"]("[data-story-mode-switcher]");
    const _0x50373e = _0x122db0?.['querySelector'](".workspace-mode-current");
    const _0x597392 = _0x122db0?.["querySelector"]('.workspace-mode-menu');
    _0x122db0?.["classList"]['toggle']("is-open", _0x52f21b);
    _0x50373e?.["setAttribute"]("aria-expanded", String(_0x52f21b));
    _0x597392?.["setAttribute"]("aria-hidden", String(!_0x52f21b));
    if (!_0x52f21b || !focus) {
      return;
    }
    const _0xf100ec = Array["from"](_0x597392?.["querySelectorAll"](".workspace-mode-option:not(:disabled)") || [])["filter"](_0x4b4301 => _0x4b4301["getAttribute"]("aria-disabled") !== "true");
    const _0x2a35ba = focus === "last" ? _0xf100ec['at'](-0x1) : _0xf100ec[0x0];
    const _0x562edc = () => {
      if (!_0xa503f6 || !_0x476021["contains"](_0x2a35ba)) {
        return;
      }
      _0x2a35ba?.["focus"]?.();
    };
    typeof windowObject?.['requestAnimationFrame'] === 'function' ? windowObject["requestAnimationFrame"](_0x562edc) : _0x562edc();
  };
  const _0x18d7e3 = (_0x559c90, _0x4e66ea) => {
    const _0x502254 = windowObject?.["CustomEvent"] || globalThis['CustomEvent'];
    if (typeof _0x502254 !== "function") {
      return;
    }
    windowObject?.["dispatchEvent"]?.(new _0x502254(WORKSPACE_MODE_CHANGED_EVENT, {
      'detail': {
        'mode': _0x559c90,
        'previousMode': _0x4e66ea
      }
    }));
  };
  const _0x7fc602 = (_0x15712f, {
    activate = !![]
  } = {}, _0x4acc64) => {
    if (_0x5ff1e3) {
      return ![];
    }
    const _0xc4b7aa = normalizeWorkspaceMode(_0x15712f);
    if (!_0x2f9cf3(_0xc4b7aa)) {
      return ![];
    }
    const _0x2aabfd = _0x3b3b14[_0xc4b7aa];
    let _0x12b503 = !![];
    try {
      _0x12b503 = _0x2aabfd?.["canActivate"]?.() !== ![];
    } catch {
      _0x12b503 = ![];
    }
    if (!_0x12b503) {
      _0x2aabfd?.['requestActivation']?.({
        'retry': () => {
          if (_0x5ff1e3 || _0x4acc64 !== _0x4f2ae7 || _0x32ffae !== _0xc4b7aa) {
            return ![];
          }
          return _0x7fc602(_0xc4b7aa, {
            'activate': activate
          }, _0x4acc64);
        }
      });
      return ![];
    }
    const _0xcfb0b1 = _0x10dfa7["mode"];
    const _0x18742f = _0x3b3b14[_0xcfb0b1];
    if (_0xcfb0b1 !== _0xc4b7aa) {
      let _0x5d9a99 = !![];
      try {
        _0x5d9a99 = _0x18742f?.["canDeactivate"]?.({
          'nextMode': _0xc4b7aa
        }) !== ![];
      } catch {
        _0x5d9a99 = !![];
      }
      if (!_0x5d9a99) {
        _0x18742f?.["onNavigationBlocked"]?.({
          'nextMode': _0xc4b7aa
        });
        return ![];
      }
    }
    if (_0xcfb0b1 === _0xc4b7aa) {
      if (activate && [STORYBOARD_3D_MODE_ID, REPLACEMENT_STUDIO_MODE_ID]["includes"](_0xc4b7aa)) {
        const _0xa578c2 = _0x2aabfd?.["activate"]?.({
          'previousMode': _0xcfb0b1,
          'reactivating': !![]
        });
        if (!_0xa578c2) {
          return ![];
        }
        _0x2aabfd?.["onActivated"]?.({
          'previousMode': _0xcfb0b1,
          'reactivating': !![]
        });
      }
      return !![];
    }
    let _0x4fa53b = !![];
    if (activate && _0xc4b7aa !== CANVAS_MODE_ID) {
      _0x4fa53b = _0x2aabfd?.["activate"]?.({
        'previousMode': _0xcfb0b1
      });
      if (!_0x4fa53b) {
        return ![];
      }
    }
    _0x10dfa7["mode"] = _0xc4b7aa;
    _0x1dcd3a();
    const _0x59305a = _0x18742f?.["deactivate"]?.({
      'nextMode': _0xc4b7aa
    });
    if (_0x59305a === ![]) {
      _0x10dfa7['mode'] = _0xcfb0b1;
      _0x1dcd3a();
      _0x2aabfd?.["deactivate"]?.({
        'nextMode': _0xcfb0b1,
        'rollback': !![]
      });
      _0x18742f?.['onNavigationBlocked']?.({
        'nextMode': _0xc4b7aa
      });
      return ![];
    }
    _0x18d7e3(_0xc4b7aa, _0xcfb0b1);
    if (activate && _0x4fa53b) {
      _0x2aabfd?.["onActivated"]?.({
        'previousMode': _0xcfb0b1
      });
    }
    return !![];
  };
  const _0x187e7b = (_0x2bc12e, _0x128e1e = {}) => {
    const _0x49baf9 = normalizeWorkspaceMode(_0x2bc12e);
    _0x32ffae = _0x49baf9;
    _0x4f2ae7 += 0x1;
    return _0x7fc602(_0x49baf9, _0x128e1e, _0x4f2ae7);
  };
  const _0x1ca271 = _0x40b004 => {
    const _0x2bb696 = normalizeWorkspaceMode(_0x40b004);
    if (_0x5ff1e3 || _0x32ffae !== _0x2bb696) {
      return ![];
    }
    return _0x7fc602(_0x2bb696, {}, _0x4f2ae7);
  };
  const _0x283d43 = () => {
    if (_0x5ff1e3) {
      return ![];
    }
    const _0x51b1e3 = _0x2f9cf3(STORYBOARD_3D_MODE_ID);
    const _0x35cc9d = _0x2f9cf3(REPLICATION_MODE_ID);
    const _0x132407 = _0x10dfa7["storyboard3DAvailable"] !== _0x51b1e3 || _0x10dfa7["replicationAvailable"] !== _0x35cc9d;
    if (!_0x132407) {
      return ![];
    }
    _0x10dfa7["storyboard3DAvailable"] = _0x51b1e3;
    _0x10dfa7["replicationAvailable"] = _0x35cc9d;
    !_0x2f9cf3(_0x10dfa7['mode']) ? _0x187e7b(CANVAS_MODE_ID) : _0xebe20();
    return !![];
  };
  const _0x3a3cda = () => {
    _0x522b11 = !![];
    _0xff0431();
  };
  const _0x57931b = () => {
    _0x522b11 = ![];
    _0xff0431();
  };
  const _0x405503 = _0x2a1b0d => {
    if (_0x476021["contains"](_0x2a1b0d["target"])) {
      _0x2a1b0d['target']['matches']?.(":focus-visible") && (_0x5f15f5 = !![], _0xff0431());
      return;
    }
    if (!_0x5f15f5) {
      return;
    }
    _0x5f15f5 = ![];
    _0xff0431();
  };
  const _0x3b3540 = _0x257b27 => {
    const _0x5a2773 = _0x257b27["target"]["closest"]?.(".workspace-mode-current");
    const _0x3b7522 = _0x257b27["target"]["closest"]?.(".workspace-mode-option");
    if (_0x257b27["key"] === "Escape" && _0xa503f6) {
      _0x257b27["preventDefault"]();
      _0x476021["querySelector"](".workspace-mode-current")?.["focus"]?.();
      _0x5f15f5 = ![];
      _0x522b11 = ![];
      _0xff0431();
      return;
    }
    if (_0x5a2773 && (_0x257b27['key'] === "ArrowDown" || _0x257b27["key"] === "ArrowUp")) {
      _0x257b27['preventDefault']();
      _0x5f15f5 = !![];
      _0xff0431({
        'focus': _0x257b27["key"] === "ArrowUp" ? "last" : "first"
      });
      return;
    }
    if (!_0x3b7522 || !_0xa503f6) {
      return;
    }
    const _0x3dff4a = Array['from'](_0x476021['querySelectorAll'](".workspace-mode-option:not(:disabled)"))["filter"](_0x32d610 => _0x32d610["getAttribute"]("aria-disabled") !== 'true');
    const _0x4868dc = _0x3dff4a["indexOf"](_0x3b7522);
    let _0x10ebc1 = _0x4868dc;
    if (_0x257b27["key"] === "ArrowDown") {
      _0x10ebc1 = (_0x4868dc + 0x1) % _0x3dff4a['length'];
    } else {
      if (_0x257b27["key"] === "ArrowUp") {
        _0x10ebc1 = (_0x4868dc - 0x1 + _0x3dff4a['length']) % _0x3dff4a["length"];
      } else {
        if (_0x257b27["key"] === "Home") {
          _0x10ebc1 = 0x0;
        } else {
          if (_0x257b27["key"] === "End") {
            _0x10ebc1 = _0x3dff4a['length'] - 0x1;
          } else {
            return;
          }
        }
      }
    }
    _0x257b27['preventDefault']();
    _0x3dff4a[_0x10ebc1]?.["focus"]?.();
  };
  const _0x42b46d = _0x538f5f => {
    const _0x163093 = _0x538f5f["target"]['closest']?.(".workspace-mode-current");
    if (_0x163093 && _0x476021["contains"](_0x163093)) {
      return;
    }
    const _0x5db2cc = _0x538f5f["target"]['closest']?.("[data-story-workspace-mode]");
    if (!_0x5db2cc || !_0x476021["contains"](_0x5db2cc)) {
      return;
    }
    if (_0x5db2cc['disabled'] || _0x5db2cc['getAttribute']("aria-disabled") === "true") {
      _0x538f5f["preventDefault"]();
      return;
    }
    const _0xf546aa = _0x5db2cc['dataset']["storyWorkspaceMode"];
    if (_0xf546aa === _0x10dfa7["mode"] && _0xf546aa !== STORYBOARD_3D_MODE_ID) {
      _0x522b11 = ![];
      _0x5f15f5 = ![];
      _0xff0431();
      _0x187e7b(_0xf546aa);
      return;
    }
    const _0x23cf88 = _0x476021["querySelector"](".workspace-mode-current");
    const _0x11df4e = () => {
      _0x522b11 = ![];
      _0x5f15f5 = ![];
      _0xff0431();
      _0x187e7b(_0xf546aa);
    };
    let _0x5d2ecb = null;
    try {
      _0x5d2ecb = getCanvasPresentationContext?.() || null;
    } catch {
      _0x5d2ecb = null;
    }
    if (shouldBypassCanvasModeViewTransition({
      'currentMode': _0x10dfa7["mode"],
      'nextMode': _0xf546aa,
      'canvasPresentationContext': _0x5d2ecb
    })) {
      _0x11df4e();
      return;
    }
    runCircularRevealTransition({
      'sourceElement': _0x23cf88,
      'apply': _0x11df4e,
      'documentObject': documentObject,
      'windowObject': windowObject,
      'rootClassName': "workspace-mode-reveal-transitioning",
      'duration': 0x2f8
    });
  };
  const _0x87a13 = Object['freeze']({
    'setMode': _0x187e7b,
    'getMode': () => _0x10dfa7["mode"],
    'resumePendingMode': _0x1ca271,
    'refreshAvailability': _0x283d43,
    'destroy'() {
      if (_0x5ff1e3) {
        return;
      }
      _0x5ff1e3 = !![];
      _0x476021["removeEventListener"]('click', _0x42b46d);
      _0x476021["removeEventListener"]("pointerenter", _0x3a3cda);
      _0x476021["removeEventListener"]("pointerleave", _0x57931b);
      _0x476021["removeEventListener"]("keydown", _0x3b3540);
      documentObject['removeEventListener']('focusin', _0x405503);
      windowObject?.["removeEventListener"]?.("aicanvas:runtime-info", _0x283d43);
      windowObject?.["removeEventListener"]?.("dev-mode-changed", _0x283d43);
      Object["values"](MODE_BODY_CLASSES)["flat"]()['forEach'](_0x1064a2 => {
        documentObject["body"]['classList']['remove'](_0x1064a2);
      });
      documentObject['getElementById']('v2-canvas')?.["setAttribute"]("aria-hidden", "false");
      _0x476021["remove"]();
    }
  });
  _0x476021["_workspaceModeCoordinator"] = _0x87a13;
  _0x476021['addEventListener']('click', _0x42b46d);
  _0x476021["addEventListener"]("pointerenter", _0x3a3cda);
  _0x476021["addEventListener"]("pointerleave", _0x57931b);
  _0x476021["addEventListener"]("keydown", _0x3b3540);
  documentObject['addEventListener']('focusin', _0x405503);
  windowObject?.["addEventListener"]?.("aicanvas:runtime-info", _0x283d43);
  windowObject?.["addEventListener"]?.("dev-mode-changed", _0x283d43);
  _0x1dcd3a();
  return _0x87a13;
}