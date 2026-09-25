import { t } from '../../i18n/index.js';
import { positionAnchoredSubmenu } from '../../utils/submenuPosition.js';
function imageToolbarText(_0x40a324) {
  return t("nodeToolbar.image." + _0x40a324);
}
const IMAGE_TOOLBAR_ZONE_MAP = Object["freeze"]({
  'outside-primary': "outsidePrimary",
  'outside-secondary': 'outsideSecondary',
  'more': "more"
});
function getToolbarZones(_0x25a181) {
  return {
    'outsidePrimary': _0x25a181["querySelector"]('[data-zone=\x22outside-primary\x22]'),
    'outsideSecondary': _0x25a181["querySelector"]("[data-zone=\"outside-secondary\"]"),
    'more': _0x25a181['querySelector']("[data-zone=\"more\"]")
  };
}
function collectToolbarActionButtons(_0x48d472, _0x53830f) {
  const _0x1911a9 = new Map();
  _0x48d472["querySelectorAll"]('.ftb-btn')["forEach"](_0x2511f2 => {
    if (_0x2511f2["dataset"]["fixedToolbarButton"] === '1') {
      return;
    }
    const _0x39631d = _0x53830f(_0x2511f2);
    if (!_0x39631d || _0x1911a9['has'](_0x39631d)) {
      return;
    }
    _0x1911a9["set"](_0x39631d, _0x2511f2);
  });
  return _0x1911a9;
}
function applyToolbarLayoutToDom({
  toolbarEl: _0x54c7ed,
  layoutInput: _0x5f0400,
  imageToolbarActions: _0x51cd33,
  normalizeImageToolbarLayout: _0x4a4ade,
  getToolbarActionFromButton: _0x1b7564
}) {
  const _0x5ed499 = getToolbarZones(_0x54c7ed);
  if (!_0x5ed499["outsidePrimary"] || !_0x5ed499["outsideSecondary"] || !_0x5ed499["more"]) {
    return;
  }
  const _0x2ec3d8 = _0x4a4ade(_0x5f0400);
  const _0xa11cee = collectToolbarActionButtons(_0x54c7ed, _0x1b7564);
  const _0x1e92ef = new Set();
  for (const [_0x347fd1, _0x14f785] of Object["entries"](_0x2ec3d8)) {
    const _0x5e6302 = _0x5ed499[_0x347fd1];
    if (!_0x5e6302) {
      continue;
    }
    _0x14f785["forEach"](_0x55abdc => {
      const _0x12ca72 = _0xa11cee["get"](_0x55abdc);
      if (!_0x12ca72) {
        return;
      }
      _0x5e6302["appendChild"](_0x12ca72);
      _0x1e92ef['add'](_0x55abdc);
    });
  }
  for (const _0x1e4df0 of _0x51cd33) {
    if (_0x1e92ef["has"](_0x1e4df0)) {
      continue;
    }
    const _0xccbee9 = _0xa11cee['get'](_0x1e4df0);
    if (!_0xccbee9) {
      continue;
    }
    _0x5ed499['more']["appendChild"](_0xccbee9);
  }
  const _0x4e7117 = _0x54c7ed["querySelector"](".v2-img-toolbar-main-divider");
  if (_0x4e7117) {
    const _0x43ede1 = _0x5ed499["outsideSecondary"]["querySelectorAll"](".ftb-btn")["length"] > 0x0;
    _0x4e7117["hidden"] = !_0x43ede1;
  }
}
function readToolbarLayoutFromDom(_0x38b2e8, _0x214178, _0x1a714d, _0x2c7726 = null) {
  const _0x43be1c = {
    'outsidePrimary': [],
    'outsideSecondary': [],
    'more': []
  };
  const _0x19522a = _0x2c7726 && typeof _0x2c7726 === 'object' ? Object["entries"](_0x2c7726) : [];
  if (_0x19522a["length"] > 0x0) {
    _0x19522a["forEach"](([_0x3c9885, _0x20e952]) => {
      if (!_0x43be1c[_0x3c9885] || !_0x20e952) {
        return;
      }
      _0x20e952["querySelectorAll"](".ftb-btn")["forEach"](_0x54a3bf => {
        const _0x59e45e = _0x214178(_0x54a3bf);
        if (!_0x59e45e) {
          return;
        }
        _0x43be1c[_0x3c9885]["push"](_0x59e45e);
      });
    });
    return _0x1a714d(_0x43be1c);
  }
  _0x38b2e8["querySelectorAll"]('[data-zone]')["forEach"](_0x364fc2 => {
    const _0x366b54 = String(_0x364fc2["getAttribute"]('data-zone') || '')["trim"]();
    const _0x46ed9f = IMAGE_TOOLBAR_ZONE_MAP[_0x366b54];
    if (!_0x46ed9f) {
      return;
    }
    _0x364fc2["querySelectorAll"](".ftb-btn")["forEach"](_0x35b226 => {
      const _0x5eb46e = _0x214178(_0x35b226);
      if (!_0x5eb46e) {
        return;
      }
      _0x43be1c[_0x46ed9f]["push"](_0x5eb46e);
    });
  });
  return _0x1a714d(_0x43be1c);
}
export function bindImageToolbarLayoutUi(_0x3540e1, _0x4c3e11 = {}) {
  const {
    store: _0x103c80,
    getStateSnapshot: _0x2b785b,
    getToolbarActionFromButton: _0x192183
  } = _0x4c3e11;
  const _0x1ea253 = _0x4c3e11["toolbarActions"] || _0x4c3e11["imageToolbarActions"] || [];
  const _0x408165 = _0x4c3e11['normalizeToolbarLayout'] || _0x4c3e11['normalizeImageToolbarLayout'];
  const _0x1909c8 = _0x4c3e11["serializeToolbarLayout"] || _0x4c3e11["serializeImageToolbarLayout"];
  const _0x599779 = typeof _0x4c3e11["getToolbarLayout"] === "function" ? _0x4c3e11['getToolbarLayout'] : _0x52f17c => _0x52f17c?.['ui']?.["imageToolbarLayout"];
  const _0x28605f = typeof _0x4c3e11["setToolbarLayout"] === "function" ? _0x4c3e11['setToolbarLayout'] : _0x157cb5 => _0x103c80?.['setImageToolbarLayout']?.(_0x157cb5);
  const _0x137104 = new Set(Array["isArray"](_0x4c3e11["moreMenuStickyActions"]) ? _0x4c3e11["moreMenuStickyActions"] : ['auto-subject', "multigrid"]);
  const _0x9c80bd = getToolbarZones(_0x3540e1);
  const _0x2a7fa0 = _0x3540e1['querySelector']('.act-more-tools');
  const _0xc5cbfd = _0x3540e1["querySelector"]("[data-role=\"more-menu\"]");
  const _0x1edc56 = _0x3540e1["querySelector"](".act-customize-tools");
  if (!_0x9c80bd["outsidePrimary"] || !_0x9c80bd['outsideSecondary'] || !_0x9c80bd['more'] || !_0x2a7fa0 || !_0xc5cbfd || !_0x1edc56) {
    return {
      'closeMoreMenu'() {}
    };
  }
  applyToolbarLayoutToDom({
    'toolbarEl': _0x3540e1,
    'layoutInput': _0x599779(_0x2b785b()),
    'imageToolbarActions': _0x1ea253,
    'normalizeImageToolbarLayout': _0x408165,
    'getToolbarActionFromButton': _0x192183
  });
  let _0x548eb4 = ![];
  let _0x2538ac = ![];
  let _0x5c7bec = ![];
  let _0x23319f = null;
  let _0x3272f7 = null;
  let _0x22aec7 = null;
  let _0xcae6ad = 0x0;
  const _0x47bbce = _0xc5cbfd['parentNode'];
  const _0x3a7d7e = _0xc5cbfd["nextSibling"];
  const _0x4aded9 = () => {
    if (_0xcae6ad) {
      cancelAnimationFrame(_0xcae6ad);
    }
    _0xcae6ad = 0x0;
    _0xc5cbfd["classList"]['remove']('is-portaled');
    _0xc5cbfd['removeAttribute']("style");
    if (_0x47bbce && _0xc5cbfd["parentNode"] !== _0x47bbce) {
      const _0x44dd6e = _0x3a7d7e && _0x3a7d7e["parentNode"] === _0x47bbce ? _0x3a7d7e : null;
      _0x47bbce["insertBefore"](_0xc5cbfd, _0x44dd6e);
    }
  };
  const _0x416ceb = () => {
    if (!_0x548eb4 || _0xc5cbfd['hidden'] || !_0x3540e1["isConnected"]) {
      _0x4aded9();
      return;
    }
    const _0x3e0a51 = _0x3540e1["getBoundingClientRect"]();
    if (_0x3e0a51["width"] > 0x0 && _0x3e0a51["height"] > 0x0) {
      const _0x7798c3 = Number(document["querySelector"]?.('.v2-canvas-stage')?.["getBoundingClientRect"]?.()?.['top']);
      const _0x390b98 = Number["isFinite"](_0x7798c3) ? Math["max"](0x0, _0x7798c3) : 0x0;
      const _0x41a2d7 = _0xc5cbfd["getBoundingClientRect"]?.() || {};
      const _0x53184c = Number(_0xc5cbfd['offsetHeight']) || Number(_0x41a2d7['height']) || 0x0;
      _0xc5cbfd["style"]["transform"] = 'translate(0,\x200)';
      positionAnchoredSubmenu({
        'submenu': _0xc5cbfd,
        'anchorRect': _0x3e0a51,
        'horizontalPlacement': "center",
        'verticalPlacement': _0x3e0a51["top"] - _0x390b98 >= _0x53184c + 0x12 ? "above" : "below",
        'verticalGap': 0xa,
        'position': "fixed",
        'viewportMargin': 0x8,
        'viewportTop': _0x390b98,
        'viewportWidth': globalThis['window']?.["innerWidth"],
        'viewportHeight': globalThis["window"]?.['innerHeight']
      });
    }
    _0xcae6ad = requestAnimationFrame(_0x416ceb);
  };
  const _0x2a6041 = () => {
    _0xc5cbfd['parentNode'] !== document["body"] && document["body"]["appendChild"](_0xc5cbfd);
    _0xc5cbfd["classList"]["add"]("is-portaled");
    _0xc5cbfd["style"]["transform"] = 'translate(0,\x200)';
    if (_0xcae6ad) {
      cancelAnimationFrame(_0xcae6ad);
    }
    _0xcae6ad = 0x0;
  };
  const _0x37cb37 = () => {
    const _0x547621 = collectToolbarActionButtons(_0x3540e1, _0x192183);
    collectToolbarActionButtons(_0xc5cbfd, _0x192183)["forEach"]((_0x5ccf0e, _0x3c92e1) => _0x547621["set"](_0x3c92e1, _0x5ccf0e));
    return _0x547621;
  };
  const _0x565377 = (_0x4cc190, _0x9864f2) => {
    _0x4cc190["classList"]["toggle"]('is-drop-target', !!_0x9864f2);
  };
  const _0x53871e = _0x3796e0 => {
    if (_0x3272f7 === _0x3796e0) {
      return;
    }
    if (_0x3272f7) {
      _0x565377(_0x3272f7, ![]);
    }
    _0x3272f7 = _0x3796e0 || null;
    if (_0x3272f7) {
      _0x565377(_0x3272f7, !![]);
    }
  };
  const _0x389c48 = () => {
    _0x53871e(null);
    Object["values"](_0x9c80bd)["forEach"](_0x37c522 => _0x565377(_0x37c522, ![]));
  };
  const _0x168cdd = _0x38a135 => {
    _0x3540e1["classList"]["toggle"]('is-toolbar-drag-active', !!_0x38a135);
    _0xc5cbfd['classList']["toggle"]("is-toolbar-drag-active", !!_0x38a135);
  };
  const _0x15fc1e = () => Object['values'](_0x9c80bd)["flatMap"](_0x415a19 => Array["from"](_0x415a19?.['querySelectorAll']?.(".ftb-btn") || [])['filter'](_0x31bf7d => _0x192183(_0x31bf7d)));
  const _0xe70056 = _0x2f435e => {
    const _0x54fb29 = _0x15fc1e();
    const _0x10f0e1 = new Map(_0x54fb29["map"](_0x142765 => [_0x142765, _0x142765["getBoundingClientRect"]?.() || {}]));
    const _0x1cf8f0 = _0x2f435e();
    if (!_0x1cf8f0) {
      return ![];
    }
    _0x15fc1e()["forEach"](_0x50c5d9 => {
      const _0x3aef2b = _0x10f0e1["get"](_0x50c5d9);
      if (!_0x3aef2b) {
        return;
      }
      const _0x71549f = _0x50c5d9["getBoundingClientRect"]?.() || {};
      const _0x42fe5f = Number(_0x3aef2b["left"] || 0x0) - Number(_0x71549f['left'] || 0x0);
      const _0x4930da = Number(_0x3aef2b["top"] || 0x0) - Number(_0x71549f["top"] || 0x0);
      if (_0x42fe5f === 0x0 && _0x4930da === 0x0) {
        return;
      }
      _0x50c5d9["style"]["transform"] = "translate(" + _0x42fe5f + "px, " + _0x4930da + "px)";
      _0x50c5d9["style"]["transition"] = "none";
      const _0x315982 = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : _0x130618 => setTimeout(_0x130618, 0x0);
      _0x315982(() => {
        _0x50c5d9['style']["transform"] = '';
        _0x50c5d9["style"]["transition"] = 'transform\x200.2s\x20cubic-bezier(0.2,\x200.8,\x200.2,\x201)';
      });
    });
    return !![];
  };
  const _0x21afaa = () => {
    const _0x5de323 = readToolbarLayoutFromDom(_0x3540e1, _0x192183, _0x408165, _0x9c80bd);
    const _0x5ef17c = _0x1909c8(_0x599779(_0x2b785b()));
    const _0x19a637 = _0x1909c8(_0x5de323);
    if (_0x5ef17c === _0x19a637) {
      return;
    }
    _0x28605f(_0x5de323);
  };
  const _0x39d78c = (_0x1bbb9d, _0x5c7cdb) => {
    const _0x27545c = Array["from"](_0x1bbb9d["querySelectorAll"](".ftb-btn"))["filter"](_0x2fcdd9 => _0x2fcdd9 !== _0x23319f);
    for (const _0x12a62e of _0x27545c) {
      const _0x3f7cae = _0x12a62e["getBoundingClientRect"]();
      const _0x1142dd = _0x3f7cae["left"] + _0x3f7cae["width"] / 0x2;
      if (_0x5c7cdb < _0x1142dd) {
        return _0x12a62e;
      }
    }
    return null;
  };
  const _0x413f3b = (_0x119145, _0x49345e) => {
    const _0x218c1e = _0x49345e["target"]?.["closest"]?.(".ftb-btn");
    if (_0x218c1e === _0x23319f) {
      return _0x23319f;
    }
    if (_0x218c1e && _0x119145["contains"](_0x218c1e) && _0x192183(_0x218c1e)) {
      const _0x80288f = _0x218c1e['getBoundingClientRect']();
      const _0x28bb99 = _0x80288f["left"] + _0x80288f["width"] / 0x2;
      return Number(_0x49345e["clientX"] || 0x0) < _0x28bb99 ? _0x218c1e : _0x218c1e["nextElementSibling"];
    }
    return _0x39d78c(_0x119145, _0x49345e["clientX"]);
  };
  const _0x1d4eb1 = (_0x219724, _0xcc7795) => {
    if (!_0x23319f || !_0x219724) {
      return ![];
    }
    if (_0xcc7795 === _0x23319f) {
      return ![];
    }
    const _0x583f08 = _0xcc7795 || null;
    if (_0x23319f["parentNode"] === _0x219724) {
      const _0x2093f2 = _0x23319f["nextElementSibling"];
      if (_0x583f08 && _0x2093f2 === _0x583f08) {
        return ![];
      }
      if (!_0x583f08 && _0x23319f === _0x219724["lastElementChild"]) {
        return ![];
      }
    }
    return _0xe70056(() => {
      _0x583f08 ? _0x219724["insertBefore"](_0x23319f, _0x583f08) : _0x219724['appendChild'](_0x23319f);
      return !![];
    });
  };
  const _0x47bdd8 = _0x3f4e36 => {
    _0x5c7bec = !!_0x3f4e36;
    _0x1edc56['classList']['toggle']("is-tooltip-pinned", _0x5c7bec);
  };
  const _0x278a81 = _0x25cf4b => {
    _0x2538ac = !!_0x25cf4b;
    _0x3540e1["classList"]["toggle"]("is-toolbar-customizing", _0x2538ac);
    _0xc5cbfd["classList"]['toggle']('is-toolbar-customizing', _0x2538ac);
    _0x47bdd8(_0x2538ac);
    _0x1edc56["hidden"] = ![];
    _0x1edc56["classList"]['toggle']("is-active", _0x2538ac);
    _0x1edc56["textContent"] = _0x2538ac ? imageToolbarText("done") : imageToolbarText('customize');
    _0x1edc56["setAttribute"]("aria-label", _0x2538ac ? imageToolbarText("doneCustomize") : imageToolbarText("customize"));
    _0x37cb37()['forEach'](_0x2fe63d => {
      _0x2fe63d["draggable"] = _0x2538ac;
      _0x2fe63d["classList"]["toggle"]('is-toolbar-draggable', _0x2538ac);
    });
    !_0x2538ac && (_0x23319f = null, _0x168cdd(![]), _0x389c48(), _0x37cb37()['forEach'](_0x4a5256 => {
      _0x4a5256["classList"]["remove"]("is-toolbar-dragging");
      _0x4a5256['classList']["remove"]('is-toolbar-dragging-capture');
    }));
  };
  const _0x4fe2f0 = () => {
    if (!_0x548eb4) {
      return;
    }
    _0x548eb4 = ![];
    _0x2538ac && (_0x4aded9(), _0x21afaa());
    _0x278a81(![]);
    _0x2a7fa0['classList']["remove"]("is-active");
    _0xc5cbfd["hidden"] = !![];
    _0x4aded9();
    _0x22aec7 && (document['removeEventListener']('pointerdown', _0x22aec7, !![]), _0x22aec7 = null);
  };
  const _0x290cd6 = () => {
    if (_0x548eb4) {
      return;
    }
    _0x548eb4 = !![];
    _0x2a7fa0['classList']["add"]("is-active");
    _0x2a6041();
    _0xc5cbfd['hidden'] = ![];
    _0x416ceb();
    !_0x22aec7 && (_0x22aec7 = _0x316612 => {
      !_0x3540e1['contains'](_0x316612["target"]) && !_0xc5cbfd["contains"](_0x316612["target"]) && _0x4fe2f0();
    }, document["addEventListener"]('pointerdown', _0x22aec7, !![]));
  };
  _0x2a7fa0["addEventListener"]('click', _0x382c0f => {
    _0x382c0f["preventDefault"]();
    _0x382c0f['stopPropagation']();
    _0x548eb4 ? _0x4fe2f0() : _0x290cd6();
  });
  _0x1edc56['addEventListener']("click", _0x55ba4e => {
    _0x55ba4e["preventDefault"]();
    _0x55ba4e["stopPropagation"]();
    _0x290cd6();
    if (_0x2538ac) {
      _0x278a81(![]);
      _0x21afaa();
      return;
    }
    _0x278a81(!![]);
  });
  const _0x12dc68 = _0x511a4c => {
    const _0x221612 = _0x511a4c['target']?.['closest']?.(".ftb-btn");
    if (!_0x221612) {
      return;
    }
    const _0x5af988 = _0x192183(_0x221612);
    if (!_0x5af988) {
      return;
    }
    if (_0x2538ac) {
      _0x511a4c['preventDefault']();
      _0x511a4c['stopPropagation']();
      return;
    }
    if (_0x9c80bd["more"]["contains"](_0x221612)) {
      if (_0x137104["has"](_0x5af988)) {
        return;
      }
      queueMicrotask(() => {
        if (!_0x3540e1['isConnected']) {
          return;
        }
        if (_0x2538ac) {
          return;
        }
        _0x4fe2f0();
      });
    }
  };
  _0x3540e1["addEventListener"]("click", _0x12dc68, !![]);
  _0xc5cbfd["addEventListener"]("click", _0x12dc68, !![]);
  collectToolbarActionButtons(_0x3540e1, _0x192183)["forEach"](_0x5b77ec => {
    if (_0x5b77ec['dataset']["toolbarDnDBound"] === '1') {
      return;
    }
    _0x5b77ec['dataset']["toolbarDnDBound"] = '1';
    _0x5b77ec["addEventListener"]("dragstart", _0x363813 => {
      if (!_0x2538ac) {
        _0x363813["preventDefault"]();
        return;
      }
      _0x23319f = _0x5b77ec;
      _0x168cdd(!![]);
      _0x5b77ec['classList']["add"]("is-toolbar-dragging-capture");
      setTimeout(() => {
        if (_0x23319f === _0x5b77ec) {
          _0x5b77ec["classList"]['add']("is-toolbar-dragging");
        }
      }, 0x0);
      _0x363813['dataTransfer'] && (_0x363813['dataTransfer']["effectAllowed"] = 'move', _0x363813['dataTransfer']['setData']("text/plain", 'image-toolbar-button'));
    });
    _0x5b77ec["addEventListener"]('dragend', () => {
      _0x5b77ec["classList"]["remove"]("is-toolbar-dragging-capture");
      _0x5b77ec['classList']["remove"]("is-toolbar-dragging");
      _0x23319f = null;
      _0x168cdd(![]);
      _0x389c48();
    });
  });
  Object["values"](_0x9c80bd)["forEach"](_0x479576 => {
    if (_0x479576["dataset"]["toolbarDropBound"] === '1') {
      return;
    }
    _0x479576['dataset']['toolbarDropBound'] = '1';
    _0x479576['addEventListener']("dragover", _0x45eac7 => {
      if (!_0x2538ac || !_0x23319f) {
        return;
      }
      _0x45eac7["preventDefault"]();
      _0x53871e(_0x479576);
      const _0x7f4ac4 = _0x413f3b(_0x479576, _0x45eac7);
      _0x1d4eb1(_0x479576, _0x7f4ac4);
    });
    _0x479576["addEventListener"]("dragleave", _0x3246e6 => {
      if (_0x23319f) {
        const _0x549c32 = _0x3246e6["relatedTarget"] || null;
        if (!_0x549c32 || _0x479576["contains"](_0x549c32)) {
          return;
        }
      }
      if (_0x3272f7 === _0x479576) {
        _0x53871e(null);
      }
    });
    _0x479576["addEventListener"]("drop", _0x1d6d21 => {
      if (!_0x2538ac || !_0x23319f) {
        return;
      }
      _0x1d6d21["preventDefault"]();
      _0x53871e(null);
      _0x21afaa();
    });
  });
  return {
    'closeMoreMenu': _0x4fe2f0
  };
}