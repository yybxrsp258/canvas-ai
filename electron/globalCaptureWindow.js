import { createContextMenuIcon } from '../src/modules/interaction/contextMenuIcons.js';
import { scrollElementHorizontallyWithWheel } from '../src/modules/workspaceHorizontalWheel.js';
const api = globalThis["globalCaptureWindow"];
const panel = document["getElementById"]("capturePanel");
const toolbar = document["getElementById"]("actionList");
const details = document["getElementById"]("captureDetails");
const preview = document["getElementById"]("textPreview");
const more = document["getElementById"]("moreToggle");
const toggle = document['getElementById']('runImmediatelyToggle');
const feedback = document["getElementById"]("captureFeedback");
const status = document["getElementById"]("captureStatus");
const hint = document["getElementById"]("captureHint");
const retry = document['getElementById']("retryAction");
const actions = Array["from"](panel["querySelectorAll"]("[data-action-id]"));
const toolbarButtons = Array['from'](toolbar["querySelectorAll"]("button"));
const actionIds = actions["map"](_0x5c558 => _0x5c558["dataset"]["actionId"]);
const state = {
  'captureId': '',
  'activeIndex': 0x0,
  'runImmediately': ![],
  'busy': ![],
  'phase': "ready",
  'expanded': ![],
  'layoutVersion': 0x0,
  'revision': 0x0,
  'failedAction': null
};
const aiLabels = [["AI 文本", "建文本", 'AI\x20文本节点'], ["AI 生图", "建图像", "AI 图像节点"], ["AI 视频", '建视频', "AI 视频节点"]];
panel['querySelectorAll']('[data-icon]')["forEach"](_0x4d5e40 => {
  const _0x5e092c = createContextMenuIcon(_0x4d5e40["dataset"]["icon"], {
    'size': 0x10
  });
  if (_0x5e092c) {
    _0x4d5e40["prepend"](_0x5e092c);
  }
});
function updateRunImmediately(_0x5e18f7) {
  state['runImmediately'] = _0x5e18f7 === !![];
  toggle["setAttribute"]('aria-checked', String(state["runImmediately"]));
  actions['slice'](0x1, 0x4)['forEach']((_0x1ac654, _0x3b6028) => {
    const [_0x444ed9, _0x3063c9, _0x27b596] = aiLabels[_0x3b6028];
    _0x1ac654["querySelector"]("[data-action-label]")["textContent"] = state['runImmediately'] ? _0x444ed9 : _0x3063c9;
    _0x1ac654["setAttribute"]("aria-label", (state["runImmediately"] ? "创建并生成" : "仅创建") + _0x27b596);
  });
}
function syncControls() {
  const _0x3fbbef = state["busy"] || state["phase"] !== 'ready';
  panel['classList']["toggle"]("is-capturing", state['phase'] === "capturing");
  more['setAttribute']("aria-label", state["phase"] === 'capturing' ? "正在读取选中文字…" : "更多操作");
  document['getElementById']("closeCapture")["hidden"] = state["phase"] === 'capturing';
  actions["forEach"](_0x226105 => {
    _0x226105["disabled"] = _0x3fbbef;
  });
  toggle["disabled"] = _0x3fbbef;
  more['disabled'] = _0x3fbbef;
  panel["setAttribute"]("aria-busy", String(state["busy"] || state["phase"] === 'capturing'));
}
function showFeedback(_0x4bbc6a = '', _0x1ee594 = '') {
  status["textContent"] = _0x4bbc6a;
  hint["textContent"] = _0x1ee594;
  feedback["hidden"] = !_0x4bbc6a;
  toolbar["hidden"] = Boolean(_0x4bbc6a) && state["phase"] !== "capturing";
  details['hidden'] = Boolean(_0x4bbc6a) || !state["expanded"];
  retry["hidden"] = !state["failedAction"] || state["busy"];
}
async function setExpanded(_0x12f102, {
  restoreFocus = ![]
} = {}) {
  state["expanded"] = _0x12f102 === !![];
  details["hidden"] = !state["expanded"];
  more['setAttribute']("aria-expanded", String(state["expanded"]));
  const _0x46871e = state['captureId'];
  const _0x55a820 = ++state["layoutVersion"];
  if (restoreFocus) {
    more["focus"]({
      'preventScroll': !![]
    });
  }
  try {
    const _0x26299a = await api?.['setExpanded']?.({
      'captureId': _0x46871e,
      'expanded': state["expanded"]
    });
    if (_0x46871e !== state['captureId'] || _0x55a820 !== state["layoutVersion"]) {
      return;
    }
    _0x26299a?.['ok'] === ![] && (state['expanded'] = ![], details['hidden'] = !![], more['setAttribute']('aria-expanded', "false"));
    panel["classList"]["toggle"]('is-above', _0x26299a?.['ok'] === !![] && _0x26299a["opensUp"] === !![]);
  } catch {
    if (_0x46871e !== state["captureId"] || _0x55a820 !== state["layoutVersion"]) {
      return;
    }
    state["expanded"] = ![];
    details["hidden"] = !![];
    more['setAttribute']("aria-expanded", "false");
  }
}
function setActiveIndex(_0x4cc891, {
  focus = !![]
} = {}) {
  state["activeIndex"] = Math["max"](0x0, Math["min"](toolbarButtons["length"] - 0x1, _0x4cc891));
  toolbarButtons["forEach"]((_0x3b02d2, _0x4bd6b8) => {
    _0x3b02d2["tabIndex"] = _0x4bd6b8 === state['activeIndex'] ? 0x0 : -0x1;
  });
  const _0x4a0b96 = toolbarButtons[state['activeIndex']];
  _0x4a0b96["scrollIntoView"]({
    'block': 'nearest',
    'inline': "nearest"
  });
  if (focus) {
    _0x4a0b96["focus"]({
      'preventScroll': !![]
    });
  }
}
async function choose(_0x203037, _0x38271c = state['runImmediately'], _0x24da5b = !![]) {
  if (state["busy"] || state["phase"] !== "ready" || !state["captureId"] || !actionIds["includes"](_0x203037)) {
    return;
  }
  const _0x2fef1b = state["captureId"];
  const _0x3b9716 = state["revision"];
  const _0x453295 = {
    'actionId': _0x203037,
    'runImmediately': _0x38271c,
    ...(_0x24da5b ? {} : {
      'rememberRunImmediately': ![]
    })
  };
  state["busy"] = !![];
  state["failedAction"] = null;
  void setExpanded(![]);
  syncControls();
  showFeedback('正在发送到画布…');
  try {
    const _0x57b184 = await api["chooseAction"]({
      'captureId': _0x2fef1b,
      ..._0x453295
    });
    if (state["captureId"] !== _0x2fef1b || state["revision"] !== _0x3b9716) {
      return;
    }
    if (_0x57b184?.['ok'] !== !![]) {
      throw Object["assign"](new Error('dispatch-failed'), {
        'retryable': _0x57b184?.["retryable"]
      });
    }
    state["busy"] = ![];
    state["captureId"] = '';
    showFeedback('已发送到画布');
    syncControls();
  } catch (_0x4ee4bc) {
    if (state["captureId"] !== _0x2fef1b || state["revision"] !== _0x3b9716) {
      return;
    }
    state["busy"] = ![];
    state["failedAction"] = _0x4ee4bc?.["retryable"] === !![] ? _0x453295 : null;
    syncControls();
    showFeedback("发送失败", '选中文字已保留');
    (state["failedAction"] ? retry : document["getElementById"]("closeCapture"))["focus"]({
      'preventScroll': !![]
    });
  }
}
async function cancel() {
  if (!state["captureId"]) {
    return;
  }
  const _0x4e31b6 = state['captureId'];
  state["captureId"] = '';
  state['revision'] += 0x1;
  state["busy"] = ![];
  syncControls();
  try {
    await api?.["cancel"]?.({
      'captureId': _0x4e31b6
    });
  } catch {}
}
function captureError(_0x32db10, _0x3e421c) {
  if (_0x32db10 === "shortcut-keys-still-held") {
    return ["请先松开快捷键", '松开后再按\x20' + _0x3e421c];
  }
  if (_0x32db10 === "copy-command-timeout" || _0x32db10 === 'copy-worker-startup-timeout') {
    return ["读取选区超时", "保持文字选中，再按 " + _0x3e421c];
  }
  return ["未能读取选中文字", "重新选中文字，再按 " + _0x3e421c];
}
function present(_0x5e5e41 = {}) {
  state["revision"] += 0x1;
  state['layoutVersion'] += 0x1;
  state['captureId'] = String(_0x5e5e41["captureId"] || '');
  state['phase'] = _0x5e5e41["phase"] === "capturing" || _0x5e5e41["phase"] === 'error' ? _0x5e5e41['phase'] : 'ready';
  state["busy"] = ![];
  state['failedAction'] = null;
  state["expanded"] = ![];
  more["setAttribute"]("aria-expanded", "false");
  panel["classList"]['remove']("is-above");
  preview['textContent'] = String(_0x5e5e41['text'] || '');
  preview['scrollTop'] = 0x0;
  details['scrollTop'] = 0x0;
  document['getElementById']('textCount')["textContent"] = Array["from"](preview['textContent'])["length"] + '\x20字';
  document["documentElement"]["dataset"]["theme"] = _0x5e5e41["theme"] === "light" ? 'light' : "dark";
  updateRunImmediately(_0x5e5e41["runImmediately"] === !![]);
  syncControls();
  const _0x332e78 = String(_0x5e5e41["shortcutLabel"] || "Alt+C");
  if (state['phase'] === "capturing") {
    showFeedback('正在读取选中文字…');
  } else {
    state["phase"] === "error" ? showFeedback(...captureError(_0x5e5e41["errorReason"], _0x332e78)) : showFeedback();
  }
  setActiveIndex(Math['max'](0x0, actionIds['indexOf'](_0x5e5e41["activeActionId"])), {
    'focus': ![]
  });
  const _0x346beb = state["revision"];
  requestAnimationFrame(() => {
    if (!state["captureId"] || state["revision"] !== _0x346beb || state['busy']) {
      return;
    }
    if (state['phase'] === 'ready') {
      toolbarButtons[state["activeIndex"]]['focus']({
        'preventScroll': !![]
      });
    } else {
      if (state['phase'] === "error") {
        document['getElementById']("closeCapture")["focus"]({
          'preventScroll': !![]
        });
      }
    }
  });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (!state["captureId"] || state['revision'] !== _0x346beb) {
      return;
    }
    void api?.["didPresent"]?.({
      'captureId': state["captureId"],
      'presentationId': _0x5e5e41["presentationId"]
    })?.["catch"]?.(() => {});
  }));
}
actions["forEach"](_0x37707a => {
  _0x37707a['addEventListener']('click', () => {
    void choose(_0x37707a["dataset"]["actionId"]);
  });
});
toolbarButtons["forEach"]((_0x2b8e2a, _0x48044e) => {
  _0x2b8e2a['addEventListener']("focus", () => {
    setActiveIndex(_0x48044e, {
      'focus': ![]
    });
  });
});
toolbar['addEventListener']("wheel", _0x420fe7 => {
  if (!_0x420fe7["ctrlKey"] && !_0x420fe7["metaKey"]) {
    scrollElementHorizontallyWithWheel(_0x420fe7, toolbar);
  }
}, {
  'passive': ![]
});
more["addEventListener"]('click', () => {
  void setExpanded(!state["expanded"]);
});
toggle["addEventListener"]("click", () => {
  updateRunImmediately(!state['runImmediately']);
});
retry["addEventListener"]("click", () => {
  if (state["failedAction"]) {
    void choose(state['failedAction']["actionId"], state["failedAction"]["runImmediately"], state['failedAction']["rememberRunImmediately"] !== ![]);
  }
});
document['getElementById']("closeCapture")["addEventListener"]("click", () => {
  void cancel();
});
window["addEventListener"]('keydown', _0x14b644 => {
  if (_0x14b644["key"] === "Escape") {
    _0x14b644["preventDefault"]();
    if (state["expanded"]) {
      void setExpanded(![], {
        'restoreFocus': !![]
      });
    } else {
      void cancel();
    }
    return;
  }
  if (state['busy'] || state['phase'] !== "ready" || state["failedAction"] || _0x14b644["altKey"] || _0x14b644["ctrlKey"] || _0x14b644["metaKey"]) {
    return;
  }
  const _0x4fdb16 = _0x14b644['target'];
  if (_0x4fdb16 === preview || _0x4fdb16 === toggle || _0x4fdb16?.["closest"]?.("#captureFeedback")) {
    return;
  }
  if (/^[1-5]$/['test'](_0x14b644["key"])) {
    _0x14b644["preventDefault"]();
    void choose(actionIds[Number(_0x14b644["key"]) - 0x1]);
    return;
  }
  if (_0x4fdb16?.["closest"]?.("#captureDetails")) {
    return;
  }
  if (_0x14b644['key'] === "ArrowDown" && _0x4fdb16 === more) {
    _0x14b644['preventDefault']();
    void setExpanded(!![])['then'](() => {
      if (state["expanded"] && !state["busy"]) {
        actions[0x4]["focus"]({
          'preventScroll': !![]
        });
      }
    });
    return;
  }
  if (["ArrowLeft", 'ArrowRight', 'ArrowDown', 'ArrowUp']["includes"](_0x14b644["key"])) {
    _0x14b644["preventDefault"]();
    const _0xb4668d = _0x14b644["key"] === "ArrowLeft" || _0x14b644['key'] === "ArrowUp" ? -0x1 : 0x1;
    setActiveIndex((state["activeIndex"] + _0xb4668d + toolbarButtons["length"]) % toolbarButtons["length"]);
    return;
  }
  if (_0x14b644["key"] === "Enter" && _0x4fdb16 !== more) {
    _0x14b644['preventDefault']();
    const _0x3008bf = _0x4fdb16?.["closest"]?.("[data-action-id]")?.["dataset"]["actionId"] || actionIds[state["activeIndex"]];
    if (state["activeIndex"] === 0x4 && !_0x4fdb16?.["closest"]?.("[data-action-id]")) {
      void setExpanded(!state["expanded"]);
      return;
    }
    void choose(_0x3008bf, _0x14b644["shiftKey"] && _0x3008bf?.["startsWith"]("ai-") ? !state["runImmediately"] : state["runImmediately"], !_0x14b644["shiftKey"]);
  }
});
api?.["onPresent"]?.(present);
globalThis["__presentGlobalCapture"] = present;