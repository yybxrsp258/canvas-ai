import a1346_0x4ae997 from '../../core/stores/appStore.js';
import { getShortcuts } from '../shortcuts.js';
import { applySnapGridEnabled, readSnapGridEnabled, subscribeSnapGridChanges } from '../snapGridState.js';
import { getShortcutLabelByAction } from './settingsShared.js';
import { normalizeConnectionLineStyle } from '../../core/edgePathGeometry.js';
const SELECTION_RELATED_HIGHLIGHT_COLORS = ["white", "blue", "green", "cyan", "purple", "red", 'yellow'];
function normalizeSelectionRelatedHighlightColor(_0x154fa3) {
  const _0x42f45f = String(_0x154fa3 || '')["trim"]();
  return SELECTION_RELATED_HIGHLIGHT_COLORS["includes"](_0x42f45f) ? _0x42f45f : "white";
}
function getSelectionRelatedHighlightElements() {
  if (typeof document === "undefined") {
    return {
      'btnOn': null,
      'btnOff': null,
      'colorRow': null,
      'colorButtons': []
    };
  }
  return {
    'btnOn': document['getElementById']("btnSelectionRelatedHighlightOn"),
    'btnOff': document["getElementById"]("btnSelectionRelatedHighlightOff"),
    'colorRow': document["getElementById"]("selectionRelatedHighlightColorRow"),
    'colorButtons': Array["from"](document["querySelectorAll"]('[data-highlight-color]'))
  };
}
function syncSelectionRelatedHighlightColorButtons(_0x4a1adc) {
  const _0x540c38 = normalizeSelectionRelatedHighlightColor(_0x4a1adc);
  const {
    colorButtons: _0x5a5fe3
  } = getSelectionRelatedHighlightElements();
  _0x5a5fe3["forEach"](_0x2893f5 => {
    _0x2893f5["classList"]["toggle"]("active", _0x2893f5['dataset']["highlightColor"] === _0x540c38);
    _0x2893f5['setAttribute']?.("aria-pressed", String(_0x2893f5["dataset"]["highlightColor"] === _0x540c38));
  });
}
function syncSelectionRelatedHighlightEnabled(_0x5105dd) {
  const _0x3f72f1 = _0x5105dd !== ![];
  const {
    btnOn: _0x350324,
    btnOff: _0x36a302,
    colorRow: _0x36a66d,
    colorButtons: _0x52a4ab
  } = getSelectionRelatedHighlightElements();
  _0x350324?.["classList"]["toggle"]("active", _0x3f72f1);
  _0x36a302?.["classList"]['toggle']('active', !_0x3f72f1);
  _0x350324?.["setAttribute"]?.('aria-pressed', String(_0x3f72f1));
  _0x36a302?.['setAttribute']?.("aria-pressed", String(!_0x3f72f1));
  _0x36a66d?.['classList']["toggle"]("settings-row-disabled", !_0x3f72f1);
  _0x52a4ab["forEach"](_0x2f2840 => {
    _0x2f2840["disabled"] = !_0x3f72f1;
    _0x2f2840["setAttribute"]('aria-disabled', _0x3f72f1 ? "false" : "true");
  });
}
export function setSelectionRelatedHighlightPref(_0x585718, _0x5ca5fb = a1346_0x4ae997) {
  const _0x5a252a = _0x585718 !== ![];
  _0x5ca5fb['setSelectionRelatedHighlightEnabled'](_0x5a252a);
  syncSelectionRelatedHighlightEnabled(_0x5a252a);
  return _0x5a252a;
}
export function setSelectionRelatedHighlightColorPref(_0x4b6cf9, _0x355670 = a1346_0x4ae997) {
  const _0x3aa7ff = normalizeSelectionRelatedHighlightColor(_0x4b6cf9);
  _0x355670['setSelectionRelatedHighlightColor'](_0x3aa7ff);
  syncSelectionRelatedHighlightColorButtons(_0x3aa7ff);
  return _0x3aa7ff;
}
function initSelectionRelatedHighlight() {
  const _0x376aec = document["getElementById"]("btnSelectionRelatedHighlightOn");
  const _0x151629 = document["getElementById"]("btnSelectionRelatedHighlightOff");
  const _0x5a6ba6 = Array['from'](document["querySelectorAll"]("[data-highlight-color]"));
  if (!_0x376aec || !_0x151629) {
    return;
  }
  const _0x16c4da = a1346_0x4ae997["getState"]();
  const _0x45b8d9 = _0x16c4da?.['ui']?.["selectionRelatedHighlightEnabled"] !== ![];
  const _0xc21c7a = normalizeSelectionRelatedHighlightColor(_0x16c4da?.['ui']?.["selectionRelatedHighlightColor"]);
  setSelectionRelatedHighlightPref(_0x45b8d9);
  setSelectionRelatedHighlightColorPref(_0xc21c7a);
  _0x376aec['addEventListener']("click", () => setSelectionRelatedHighlightPref(!![]));
  _0x151629["addEventListener"]("click", () => setSelectionRelatedHighlightPref(![]));
  _0x5a6ba6["forEach"](_0x292596 => {
    _0x292596["addEventListener"]("click", () => {
      if (_0x292596['disabled']) {
        return;
      }
      setSelectionRelatedHighlightColorPref(_0x292596['dataset']['highlightColor']);
    });
  });
}
function initAlignFeature() {
  const _0x86515c = document["getElementById"]("btnAlignTriggerHold");
  const _0x1fcc01 = document["getElementById"]("btnAlignTriggerClick");
  const _0x2c8f5b = document["getElementById"]("btnAlignTriggerOff");
  const _0xf843eb = document["getElementById"]("alignDistributeGapSlider");
  const _0x5b5fff = document["getElementById"]("alignDistributeGapValue");
  const _0x495edc = document["getElementById"]("alignShortcutLabelMain");
  const _0x1ac8a4 = document["getElementById"]("alignShortcutLabelHold");
  const _0x5aafee = document["getElementById"]("alignShortcutLabelClick");
  if (!_0x86515c || !_0x1fcc01 || !_0x2c8f5b || !_0xf843eb || !_0x5b5fff) {
    return;
  }
  const _0x49fcd9 = _0x23302a => {
    const _0x2fdb73 = String(_0x23302a || '')["trim"]();
    return _0x2fdb73 === "hold" || _0x2fdb73 === "click" || _0x2fdb73 === "off" ? _0x2fdb73 : "click";
  };
  const _0x34e388 = () => {
    try {
      const _0x2ce45d = getShortcuts?.() || {};
      const _0x4c948e = _0x2ce45d?.["align-feature"]?.['keys'];
      if (Array["isArray"](_0x4c948e) && _0x4c948e["length"] > 0x0) {
        return _0x4c948e["join"]('+');
      }
    } catch {}
    return "Tab";
  };
  const _0x5557ed = () => {
    const _0xd3b19 = _0x34e388();
    if (_0x495edc) {
      _0x495edc["textContent"] = _0xd3b19;
    }
    if (_0x1ac8a4) {
      _0x1ac8a4['textContent'] = _0xd3b19;
    }
    if (_0x5aafee) {
      _0x5aafee["textContent"] = _0xd3b19;
    }
  };
  const _0x2098fe = _0x20a393 => {
    const _0x1ece53 = _0x49fcd9(_0x20a393);
    a1346_0x4ae997["setAlignFeatureTriggerMode"](_0x1ece53);
    const _0x7fcd0a = _0x1ece53 !== "off";
    _0x86515c["classList"]["toggle"]('active', _0x1ece53 === "hold");
    _0x1fcc01["classList"]["toggle"]("active", _0x1ece53 === "click");
    _0x2c8f5b["classList"]["toggle"]('active', _0x1ece53 === "off");
    _0x86515c['setAttribute']?.("aria-pressed", String(_0x1ece53 === "hold"));
    _0x1fcc01["setAttribute"]?.("aria-pressed", String(_0x1ece53 === "click"));
    _0x2c8f5b["setAttribute"]?.("aria-pressed", String(_0x1ece53 === "off"));
    window["dispatchEvent"](new CustomEvent('v2-align-feature-changed', {
      'detail': {
        'enabled': _0x7fcd0a,
        'mode': _0x1ece53
      }
    }));
  };
  const _0x376d03 = _0x39c871 => {
    const _0x15f0e4 = Number(_0x39c871);
    const _0xdc62ad = Number['isFinite'](_0x15f0e4) ? Math["max"](0x0, Math["min"](0xc8, Math["round"](_0x15f0e4 / 0x5) * 0x5)) : 0x28;
    _0xf843eb['value'] = String(_0xdc62ad);
    _0x5b5fff["textContent"] = String(_0xdc62ad);
    a1346_0x4ae997["setAlignDistributeGap"](_0xdc62ad);
  };
  const _0x2451a1 = a1346_0x4ae997['getState']()?.['ui'] || {};
  const _0x3fe4d0 = _0x49fcd9(_0x2451a1['alignFeatureTriggerMode']);
  const _0x4821cd = Number["isFinite"](Number(_0x2451a1["alignDistributeGap"])) ? Number(_0x2451a1["alignDistributeGap"]) : 0x28;
  _0x2098fe(_0x3fe4d0);
  _0x376d03(_0x4821cd);
  _0x5557ed();
  _0x86515c["addEventListener"]('click', () => _0x2098fe("hold"));
  _0x1fcc01["addEventListener"]("click", () => _0x2098fe('click'));
  _0x2c8f5b['addEventListener']("click", () => _0x2098fe("off"));
  _0xf843eb["addEventListener"]('input', _0x92b1d4 => _0x376d03(_0x92b1d4["target"]?.["value"]));
  window["addEventListener"]("shortcuts-updated", _0x5557ed);
}
function initConnectionLines() {
  const _0x5f035d = document["getElementById"]('btnConnectionLinesOn');
  const _0x390cbf = document["getElementById"]("btnConnectionLinesOff");
  const _0xb652a1 = document['getElementById']("connectionLinesShortcutLabel");
  if (!_0x5f035d || !_0x390cbf) {
    return;
  }
  const _0x5ee1f3 = _0x32e930 => {
    const _0x25539d = _0x32e930 !== ![];
    _0x5f035d["classList"]["toggle"]("active", _0x25539d);
    _0x390cbf["classList"]['toggle']("active", !_0x25539d);
    _0x5f035d["setAttribute"]?.("aria-pressed", String(_0x25539d));
    _0x390cbf["setAttribute"]?.('aria-pressed', String(!_0x25539d));
  };
  const _0xaa6bb1 = _0x1487b1 => {
    const _0x565132 = _0x1487b1 !== ![];
    a1346_0x4ae997["setConnectionLinesVisible"](_0x565132);
    _0x5ee1f3(_0x565132);
    window["dispatchEvent"](new CustomEvent('v2-connection-lines-visibility-changed', {
      'detail': {
        'visible': _0x565132
      }
    }));
  };
  const _0x35f7de = () => {
    if (!_0xb652a1) {
      return;
    }
    _0xb652a1["textContent"] = getShortcutLabelByAction("toggle-connection-lines", 'B');
  };
  _0xaa6bb1(a1346_0x4ae997["getState"]()?.['ui']?.['connectionLinesVisible'] !== ![]);
  _0x35f7de();
  _0x5f035d["addEventListener"]("click", () => _0xaa6bb1(!![]));
  _0x390cbf["addEventListener"]("click", () => _0xaa6bb1(![]));
  window["addEventListener"]("shortcuts-updated", _0x35f7de);
  window["addEventListener"]("v2-connection-lines-visibility-changed", _0x1631ba => {
    _0x5ee1f3(_0x1631ba?.["detail"]?.["visible"] !== ![]);
  });
}
function initConnectionLineStyle() {
  const _0x841474 = Array["from"](document['querySelectorAll']("[data-connection-line-style]"));
  if (_0x841474['length'] === 0x0) {
    return;
  }
  const _0x993827 = _0x4db4ec => {
    const _0x52cc19 = normalizeConnectionLineStyle(_0x4db4ec);
    a1346_0x4ae997["setConnectionLineStyle"](_0x52cc19);
    _0x841474["forEach"](_0x37e91a => {
      const _0x27fc3d = _0x37e91a["dataset"]["connectionLineStyle"] === _0x52cc19;
      _0x37e91a["classList"]["toggle"]("active", _0x27fc3d);
      _0x37e91a["setAttribute"]("aria-pressed", _0x27fc3d ? "true" : "false");
    });
  };
  _0x993827(a1346_0x4ae997["getState"]()?.['ui']?.["connectionLineStyle"]);
  _0x841474["forEach"](_0x260ccd => {
    _0x260ccd['addEventListener']("click", () => {
      _0x993827(_0x260ccd["dataset"]['connectionLineStyle']);
    });
  });
}
function ensureSnapGuideOverlay() {
  const _0x1f0cff = document["querySelector"]('.v2-canvas-stage');
  const _0x4bfdac = _0x1f0cff || document["body"];
  let _0x44be61 = document['getElementById']('v2-snap-guide-overlay');
  !_0x44be61 && (_0x44be61 = document["createElement"]("div"), _0x44be61['id'] = 'v2-snap-guide-overlay', _0x44be61["className"] = 'v2-snap-guide-overlay');
  if (_0x44be61["parentElement"] !== _0x4bfdac) {
    _0x4bfdac["appendChild"](_0x44be61);
  }
  window["_showSnapGuideLines"] = _0xa45654 => {
    if (!_0x44be61) {
      return;
    }
    _0x44be61["replaceChildren"]();
    if (!Array['isArray'](_0xa45654) || _0xa45654["length"] === 0x0) {
      return;
    }
    const _0x36fe3b = document['createDocumentFragment']();
    _0xa45654["forEach"](_0x3a00eb => {
      if (!_0x3a00eb || _0x3a00eb["type"] !== 'v' && _0x3a00eb['type'] !== 'h') {
        return;
      }
      const _0x18867a = document['createElement']("div");
      _0x18867a['className'] = _0x3a00eb['type'] === 'v' ? "v2-snap-guide-line is-vertical" : "v2-snap-guide-line is-horizontal";
      if (_0x3a00eb["type"] === 'v') {
        const _0xc2b143 = Number['isFinite'](_0x3a00eb["start"]) ? _0x3a00eb["start"] : 0x0;
        const _0x27d60b = Number["isFinite"](_0x3a00eb['end']) ? _0x3a00eb["end"] : _0xc2b143;
        const _0x4d0747 = Math["min"](_0xc2b143, _0x27d60b);
        const _0xb5e0df = Math["max"](0x1, Math["abs"](_0x27d60b - _0xc2b143));
        _0x18867a['style']['left'] = (Number(_0x3a00eb["pos"]) || 0x0) + 'px';
        _0x18867a["style"]["top"] = _0x4d0747 + 'px';
        _0x18867a["style"]['height'] = _0xb5e0df + 'px';
      } else {
        const _0x3dda53 = Number['isFinite'](_0x3a00eb['start']) ? _0x3a00eb["start"] : 0x0;
        const _0x24ea31 = Number['isFinite'](_0x3a00eb["end"]) ? _0x3a00eb["end"] : _0x3dda53;
        const _0x36138d = Math['min'](_0x3dda53, _0x24ea31);
        const _0x3fd8f3 = Math["max"](0x1, Math['abs'](_0x24ea31 - _0x3dda53));
        _0x18867a['style']["top"] = (Number(_0x3a00eb['pos']) || 0x0) + 'px';
        _0x18867a["style"]["left"] = _0x36138d + 'px';
        _0x18867a["style"]["width"] = _0x3fd8f3 + 'px';
      }
      _0x36fe3b["appendChild"](_0x18867a);
    });
    _0x44be61["appendChild"](_0x36fe3b);
  };
  window["_clearSnapGuideLines"] = () => {
    _0x44be61?.['replaceChildren']();
  };
}
function initSnapGuides() {
  const _0x257d2c = document["getElementById"]("btnSnapGuidesOn");
  const _0x463c56 = document['getElementById']('btnSnapGuidesOff');
  const _0x328594 = document["getElementById"]("snapGuidesShortcutLabel");
  if (!_0x257d2c || !_0x463c56) {
    return;
  }
  ensureSnapGuideOverlay();
  const _0x3f0400 = () => {
    const _0x324d92 = localStorage["getItem"]("v2-snap-guides");
    if (_0x324d92 == null) {
      return !![];
    }
    return _0x324d92 === '1' || _0x324d92 === "true";
  };
  const _0x493414 = _0x4cde37 => {
    const _0x50c2e5 = _0x4cde37 !== ![];
    _0x257d2c["classList"]["toggle"]("active", _0x50c2e5);
    _0x463c56["classList"]["toggle"]("active", !_0x50c2e5);
    _0x257d2c["setAttribute"]?.("aria-pressed", String(_0x50c2e5));
    _0x463c56["setAttribute"]?.("aria-pressed", String(!_0x50c2e5));
  };
  const _0x3e56ee = _0x4a7fb3 => {
    const _0x3ed9d5 = _0x4a7fb3 !== ![];
    a1346_0x4ae997["setSnapGuidesEnabled"](_0x3ed9d5);
    window['v2SnapGuides'] = _0x3ed9d5;
    _0x493414(_0x3ed9d5);
    if (!_0x3ed9d5) {
      window['_clearSnapGuideLines']?.();
    }
    window['dispatchEvent'](new CustomEvent("v2-snap-guides-changed", {
      'detail': {
        'enabled': _0x3ed9d5
      }
    }));
  };
  const _0x251c5f = () => {
    if (!_0x328594) {
      return;
    }
    _0x328594["textContent"] = getShortcutLabelByAction('snap-guides', '；');
  };
  const _0x28447c = a1346_0x4ae997['getState']()?.['ui']?.["snapGuidesEnabled"];
  const _0x108e4b = typeof _0x28447c === 'boolean' ? _0x28447c : _0x3f0400();
  _0x3e56ee(_0x108e4b);
  _0x251c5f();
  _0x257d2c["addEventListener"]("click", () => _0x3e56ee(!![]));
  _0x463c56["addEventListener"]("click", () => _0x3e56ee(![]));
  window["addEventListener"]("shortcuts-updated", _0x251c5f);
  window['addEventListener']("v2-snap-guides-changed", _0x254d40 => {
    _0x493414(_0x254d40?.["detail"]?.['enabled'] !== ![]);
  });
}
function initSnapGrid() {
  const _0x110582 = document["getElementById"]("btnSnapGridOn");
  const _0x52c397 = document["getElementById"]("btnSnapGridOff");
  const _0x1619f5 = document['getElementById']("snapGridShortcutLabel");
  if (!_0x110582 || !_0x52c397) {
    return;
  }
  const _0x11032d = () => {
    if (!_0x1619f5) {
      return;
    }
    _0x1619f5['textContent'] = getShortcutLabelByAction("snap-grid", 'L');
  };
  const _0x1091e5 = readSnapGridEnabled();
  applySnapGridEnabled(_0x1091e5, {
    'emitEvent': ![]
  });
  _0x11032d();
  _0x110582["addEventListener"]("click", () => applySnapGridEnabled(!![]));
  _0x52c397["addEventListener"]("click", () => applySnapGridEnabled(![]));
  window['addEventListener']("shortcuts-updated", _0x11032d);
  subscribeSnapGridChanges(_0x124eca => {
    _0x110582["classList"]["toggle"]("active", _0x124eca === !![]);
    _0x52c397["classList"]["toggle"]("active", _0x124eca !== !![]);
    _0x110582["setAttribute"]?.('aria-pressed', String(_0x124eca === !![]));
    _0x52c397["setAttribute"]?.("aria-pressed", String(_0x124eca !== !![]));
  });
}
export function initCanvasAlignmentSettings() {
  initSelectionRelatedHighlight();
  initConnectionLines();
  initConnectionLineStyle();
  initSnapGuides();
  initSnapGrid();
  initAlignFeature();
}