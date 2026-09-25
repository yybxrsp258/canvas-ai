import { createWorkspacePageTransitionController } from '../workspacePageTransition.js';
function normalizeText(_0x26c36a) {
  return String(_0x26c36a ?? '')["trim"]();
}
export function createPersonReplacementPageTransitionController({
  getRoot: _0x329f0c,
  getTransitionKey: _0x40309e,
  isCutEditorOpen: _0x5e7f9c,
  isDestroyed = () => ![],
  requestRender: _0x46ef18,
  documentObject = globalThis["document"],
  windowObject = globalThis["window"] || globalThis
} = {}) {
  if (typeof _0x329f0c !== "function" || typeof _0x40309e !== "function" || typeof _0x5e7f9c !== "function" || typeof _0x46ef18 !== 'function') {
    throw new TypeError("Person replacement page transitions require workspace adapters.");
  }
  let _0x4e372e = null;
  let _0x5f33d4 = '';
  let _0x4ca275 = ![];
  const _0x368b45 = (_0x2f5353, _0x1a7a3e) => {
    const _0x512461 = _0x2f5353?.["querySelector"]?.(".story-asset-tabs");
    const _0x316485 = _0x1a7a3e?.["querySelector"]?.(".story-asset-tabs");
    if (!_0x512461 || !_0x316485) {
      return;
    }
    _0x512461["dataset"]["activeTab"] = _0x316485["dataset"]['activeTab'];
    _0x512461["querySelectorAll"]?.("[data-asset-tab]")?.['forEach']?.(_0x1befcc => {
      const _0x4f7ca5 = normalizeText(_0x1befcc["dataset"]?.["assetTab"]);
      const _0x39913e = Array["from"](_0x316485["querySelectorAll"]?.("[data-asset-tab]") || [])["find"](_0x596c14 => normalizeText(_0x596c14["dataset"]?.['assetTab']) === _0x4f7ca5);
      if (!_0x39913e) {
        return;
      }
      _0x1befcc["classList"]?.["toggle"]?.('is-active', _0x39913e['classList']?.["contains"]?.("is-active") === !![]);
      const _0x2f0b45 = _0x39913e["getAttribute"]?.("aria-selected");
      if (_0x2f0b45 == null) {
        _0x1befcc["removeAttribute"]?.("aria-selected");
      } else {
        _0x1befcc["setAttribute"]?.('aria-selected', _0x2f0b45);
      }
      _0x1befcc["tabIndex"] = _0x39913e['tabIndex'];
      const _0x42182f = _0x1befcc["querySelector"]?.(".story-asset-tab-count");
      const _0x3a6414 = _0x39913e["querySelector"]?.(".story-asset-tab-count");
      _0x42182f && _0x3a6414 && (_0x42182f["textContent"] = _0x3a6414["textContent"]);
    });
  };
  const _0x1c7051 = (_0x486f46, _0x1d62e3) => {
    const _0x117381 = _0x486f46?.['querySelector']?.(".person-replacement-story-toolbar");
    const _0x12af82 = _0x1d62e3?.["querySelector"]?.(".person-replacement-story-toolbar");
    const _0x182c9a = _0x117381?.['querySelector']?.(".person-replacement-story-steps");
    const _0xe6bf0c = _0x12af82?.["querySelector"]?.('.person-replacement-story-steps');
    if (!_0x117381 || !_0x12af82 || !_0x182c9a || !_0xe6bf0c) {
      return ![];
    }
    _0x117381["className"] = _0x12af82['className'];
    _0x182c9a['dataset']["activeStep"] = _0xe6bf0c["dataset"]['activeStep'];
    _0x182c9a["querySelectorAll"]?.("[data-person-replacement-step]")?.["forEach"]?.(_0x3738ec => {
      const _0x51363c = normalizeText(_0x3738ec["dataset"]?.["personReplacementStep"]);
      const _0x817bdf = Array["from"](_0xe6bf0c['querySelectorAll']?.("[data-person-replacement-step]") || [])['find'](_0x15f248 => normalizeText(_0x15f248["dataset"]?.["personReplacementStep"]) === _0x51363c);
      if (!_0x817bdf) {
        return;
      }
      _0x3738ec["className"] = _0x817bdf["className"];
      ['aria-current', "aria-disabled", "title"]["forEach"](_0x143dee => {
        const _0x219d67 = _0x817bdf['getAttribute']?.(_0x143dee);
        if (_0x219d67 == null) {
          _0x3738ec['removeAttribute']?.(_0x143dee);
        } else {
          _0x3738ec['setAttribute']?.(_0x143dee, _0x219d67);
        }
      });
    });
    const _0x2f5fb5 = _0x117381["querySelector"]?.('.person-replacement-toolbar-side');
    const _0x5e1bc9 = _0x12af82["querySelector"]?.('.person-replacement-toolbar-side');
    if (_0x2f5fb5 && _0x5e1bc9) {
      _0x2f5fb5["innerHTML"] = _0x5e1bc9["innerHTML"];
    }
    return !![];
  };
  const _0x119a91 = () => {
    const _0xbebe1c = _0x329f0c();
    const _0x2d1585 = documentObject?.['activeElement'];
    if (!_0x2d1585 || !_0xbebe1c?.["contains"]?.(_0x2d1585)) {
      return null;
    }
    const _0x5e2338 = normalizeText(_0x2d1585["dataset"]?.['personReplacementStep']);
    if (_0x5e2338) {
      return {
        'kind': "step",
        'value': _0x5e2338
      };
    }
    const _0x3f5316 = normalizeText(_0x2d1585['dataset']?.["assetTab"]);
    if (_0x3f5316) {
      return {
        'kind': "asset-tab",
        'value': _0x3f5316
      };
    }
    const _0x1da122 = _0x5e7f9c() ? _0x2d1585["closest"]?.(["[data-person-replacement-shot-cut-editor]", "#person-replacement-shot-cut-smart-detect-panel"]["join"](',')) : null;
    if (_0x1da122) {
      const _0x148af7 = _0x2d1585["closest"]?.("[data-person-replacement-action]");
      return {
        'kind': "cut-editor",
        'value': normalizeText(_0x148af7?.['dataset']?.['personReplacementAction']) || "surface",
        'shotId': normalizeText(_0x148af7?.['dataset']?.["shotId"]),
        'smartClipMode': normalizeText(_0x148af7?.["dataset"]?.["smartClipMode"])
      };
    }
    return null;
  };
  const _0x3a387b = (_0x260bc0, {
    currentToolbar = null,
    incomingPage = null
  } = {}) => {
    const _0x35097e = _0x329f0c();
    if (!_0x260bc0?.['value']) {
      return ![];
    }
    if (_0x260bc0["kind"] === 'cut-editor') {
      const _0x45285a = _0x35097e?.['querySelector']?.("[data-person-replacement-shot-cut-editor]");
      const _0x588063 = _0x260bc0["value"] === "surface" ? null : Array['from'](_0x35097e?.["querySelectorAll"]?.("[data-person-replacement-action]") || [])["find"](_0x2de384 => normalizeText(_0x2de384['dataset']?.["personReplacementAction"]) === _0x260bc0["value"] && (!_0x260bc0["shotId"] || normalizeText(_0x2de384["dataset"]?.["shotId"]) === _0x260bc0["shotId"]) && (!_0x260bc0["smartClipMode"] || normalizeText(_0x2de384['dataset']?.["smartClipMode"]) === _0x260bc0["smartClipMode"]));
      const _0x291975 = _0x588063 && !_0x588063['disabled'] ? _0x588063 : _0x45285a;
      if (!_0x291975) {
        return ![];
      }
      try {
        _0x291975["focus"]?.({
          'preventScroll': !![]
        });
      } catch {
        _0x291975['focus']?.();
      }
      return documentObject?.["activeElement"] === _0x291975;
    }
    const _0xf58914 = _0x260bc0["kind"] === 'step' ? currentToolbar || _0x35097e : incomingPage || _0x35097e;
    const _0x5dc3ab = _0x260bc0["kind"] === 'step' ? "personReplacementStep" : _0x260bc0["kind"] === "asset-tab" ? "assetTab" : '';
    if (!_0xf58914 || !_0x5dc3ab) {
      return ![];
    }
    const _0x419845 = _0x260bc0["kind"] === "step" ? "[data-person-replacement-step]" : "[data-asset-tab]";
    const _0x56b5a4 = Array['from'](_0xf58914["querySelectorAll"]?.(_0x419845) || [])["find"](_0x553387 => normalizeText(_0x553387["dataset"]?.[_0x5dc3ab]) === _0x260bc0['value']);
    if (!_0x56b5a4 || _0x56b5a4['disabled']) {
      return ![];
    }
    try {
      _0x56b5a4["focus"]?.({
        'preventScroll': !![]
      });
    } catch {
      _0x56b5a4["focus"]?.();
    }
    return documentObject?.["activeElement"] === _0x56b5a4;
  };
  const _0x16cc8c = createWorkspacePageTransitionController({
    'windowObject': windowObject,
    'disposePage': _0x40a681 => _0x40a681?.['remove']?.(),
    'restoreFocus': (_0x1369e9, _0x23620d) => {
      if (documentObject?.["activeElement"] !== documentObject?.["body"]) {
        return ![];
      }
      return _0x3a387b(_0x1369e9, _0x23620d);
    }
  });
  const _0x3bf2d2 = ({
    renderPending = ![]
  } = {}) => {
    _0x4e372e?.({
      'renderPending': renderPending
    });
    _0x4e372e = null;
  };
  const _0x2b7b1b = (_0x1e1f57 = "none") => {
    if (_0x4e372e && _0x1e1f57 === "none" && _0x5f33d4 === _0x40309e()) {
      _0x4ca275 = !![];
      return !![];
    }
    return ![];
  };
  const _0x1a301f = (_0x1c86cc, _0x4ccdfe, _0x2fd04d, _0x1498c8, {
    currentToolbar = null,
    nextToolbar = null,
    focusKey = null
  } = {}) => {
    const _0x2d5626 = _0x4ccdfe?.['parentElement'];
    if (!_0x1c86cc || !_0x4ccdfe || !_0x2d5626 || !["forward", "backward"]['includes'](_0x2fd04d)) {
      return ![];
    }
    const _0x57b7b4 = _0x2fd04d === "backward" ? "is-entering-backward" : "is-entering-forward";
    const _0x2b231d = _0x2fd04d === "backward" ? 'is-leaving-backward' : "is-leaving-forward";
    const _0x5bf43c = _0x1c86cc["querySelector"]?.("[data-story-assets-switch-region]");
    const _0x4ff37f = _0x4ccdfe["querySelector"]?.('[data-story-assets-switch-region]');
    const _0x5e433e = _0x1c86cc["querySelector"]?.(".story-assets-list");
    const _0x52b904 = _0x4ccdfe["querySelector"]?.(".story-assets-list");
    const _0x2413d0 = _0x1498c8 === 'asset-content' && _0x5bf43c && _0x4ff37f;
    const _0x408938 = _0x1498c8 === 'asset-list' && _0x5e433e && _0x52b904;
    const _0x45b5eb = _0x2413d0 || _0x408938;
    const _0x1cc96f = _0x408938 ? 'person-replacement-page--asset-list-transition' : _0x2413d0 ? "person-replacement-page--asset-content-transition" : '';
    const _0x5b35a7 = _0x408938 ? "person-replacement-page--asset-list-transition-target" : _0x2413d0 ? "person-replacement-page--asset-content-transition-target" : '';
    const _0x1206c9 = _0x408938 ? _0x52b904 : _0x2413d0 ? _0x4ff37f : _0x4ccdfe;
    _0x4ccdfe["remove"]?.();
    let _0x553258 = !![];
    let _0x4673f9 = null;
    const _0x1deec6 = ({
      renderPending = !![]
    } = {}) => {
      _0x553258 = renderPending;
      _0x4673f9?.["cancel"]?.({
        'commit': !![]
      });
    };
    _0x4673f9 = _0x16cc8c["start"]({
      'current': _0x1c86cc,
      'next': _0x4ccdfe,
      'parent': _0x2d5626,
      'direction': _0x2fd04d,
      'transitionElement': _0x1206c9,
      'classNames': {
        'current': "is-current",
        'page': "person-replacement-page-transition",
        'parent': "person-replacement-page-transitioning",
        'scopeCurrent': _0x1cc96f,
        'scopeNext': _0x1cc96f,
        'scopeTarget': _0x5b35a7,
        'retainCurrentOnCommit': ![],
        'directions': {
          [_0x2fd04d]: {
            'entering': _0x57b7b4,
            'leaving': _0x2b231d
          }
        }
      },
      'focusKey': focusKey,
      'focusContext': {
        'currentToolbar': currentToolbar,
        'incomingPage': _0x4ccdfe
      },
      'mount': () => {
        _0x4ccdfe["parentElement"] !== _0x2d5626 && _0x2d5626["appendChild"]?.(_0x4ccdfe);
        _0x2d5626["insertBefore"]?.(_0x1c86cc, _0x4ccdfe);
      },
      'forceLayout': () => {
        currentToolbar?.["getBoundingClientRect"]?.();
        _0x1c86cc["querySelector"]?.(".story-asset-tabs")?.["getBoundingClientRect"]?.();
        _0x1206c9?.['getBoundingClientRect']?.();
      },
      'onBeforeCommit': () => {
        _0x1c7051(currentToolbar, nextToolbar);
        _0x45b5eb && _0x368b45(_0x1c86cc, _0x4ccdfe);
      },
      'onSettled': () => {
        if (_0x4e372e === _0x1deec6) {
          _0x4e372e = null;
        }
        _0x5f33d4 = '';
        const _0x2c16cc = _0x553258 && _0x4ca275;
        _0x4ca275 = ![];
        if (_0x2c16cc && !isDestroyed()) {
          _0x46ef18();
        }
      }
    });
    if (!_0x4673f9) {
      return ![];
    }
    _0x4e372e = _0x1deec6;
    _0x5f33d4 = _0x40309e();
    return !![];
  };
  const _0x5967fa = () => {
    _0x3bf2d2({
      'renderPending': ![]
    });
    _0x16cc8c["destroy"]();
  };
  return Object["freeze"]({
    'captureFocus': _0x119a91,
    'deferRenderIfSettling': _0x2b7b1b,
    'destroy': _0x5967fa,
    'restoreFocus': _0x3a387b,
    'start': _0x1a301f,
    'stop': _0x3bf2d2,
    'syncProjectToolbarInPlace': _0x1c7051
  });
}