import { createWorkspaceMenuController } from '../workspaceMenuController.js';
import { MATERIAL_TREE_CHEVRON_ICON_SVG } from '../../components/sharedIconMarkup.js';
export function bindStoryReplicationSelects(_0x405579) {
  const _0x4d2c65 = _0x405579["ownerDocument"];
  const _0x2eda46 = _0x4d2c65["defaultView"];
  const _0xa5773a = [..._0x405579['querySelectorAll']('select')]["map"](_0x4c4243 => {
    const _0x23ef26 = _0x4c4243['getAttribute']("aria-label") || [...(_0x4c4243["labels"]?.[0x0]?.["childNodes"] || [])]["filter"](_0x4492ac => _0x4492ac['nodeType'] === 0x3)["map"](_0x7df124 => _0x7df124["textContent"])["join"]('')["trim"]();
    const _0x1589f6 = _0x4d2c65["createElement"]("span");
    _0x1589f6["className"] = 'story-replication-select';
    const _0x5df9b7 = _0x4d2c65["createElement"]("button");
    _0x5df9b7["type"] = "button";
    _0x5df9b7['className'] = "story-replication-select-trigger";
    _0x5df9b7["setAttribute"]("aria-label", _0x23ef26);
    _0x5df9b7["setAttribute"]('aria-haspopup', 'listbox');
    _0x5df9b7['setAttribute']("aria-expanded", "false");
    const _0x228704 = _0x4d2c65["createElement"]("span");
    const _0x483c3a = _0x4d2c65["createElement"]("span");
    _0x483c3a["innerHTML"] = MATERIAL_TREE_CHEVRON_ICON_SVG;
    _0x483c3a["setAttribute"]("aria-hidden", 'true');
    _0x5df9b7["append"](_0x228704, _0x483c3a);
    const _0x51c656 = _0x4d2c65["createElement"]("span");
    _0x51c656["className"] = "story-replication-select-menu";
    _0x51c656["setAttribute"]('popover', "manual");
    _0x51c656["setAttribute"]("role", "listbox");
    _0x51c656["setAttribute"]("aria-label", _0x23ef26);
    _0x51c656['setAttribute']("aria-hidden", "true");
    _0x51c656['id'] = "replication-select-" + _0x2eda46["crypto"]["randomUUID"]();
    _0x5df9b7["setAttribute"]('aria-controls', _0x51c656['id']);
    for (const _0x123e06 of _0x4c4243["options"]) {
      const _0x5dd6fb = _0x4d2c65["createElement"]('button');
      _0x5dd6fb["type"] = "button";
      _0x5dd6fb["className"] = "story-replication-select-option";
      _0x5dd6fb["setAttribute"]("role", 'option');
      _0x5dd6fb['dataset']["value"] = _0x123e06['value'];
      _0x5dd6fb["textContent"] = _0x123e06["textContent"];
      _0x5dd6fb["disabled"] = _0x123e06['disabled'];
      _0x5dd6fb["tabIndex"] = -0x1;
      _0x51c656["append"](_0x5dd6fb);
    }
    const _0x2b475c = _0x4c4243["hidden"];
    _0x4c4243["before"](_0x1589f6);
    _0x4c4243["hidden"] = !![];
    _0x1589f6["append"](_0x4c4243, _0x5df9b7, _0x51c656);
    return {
      'select': _0x4c4243,
      'root': _0x1589f6,
      'trigger': _0x5df9b7,
      'text': _0x228704,
      'menu': _0x51c656,
      'hidden': _0x2b475c
    };
  });
  const _0x32c695 = createWorkspaceMenuController({
    'root': _0x405579,
    'wrapperSelector': '.story-replication-select',
    'triggerSelector': ".story-replication-select-trigger",
    'menuSelector': ".story-replication-select-menu",
    'optionSelector': '.story-replication-select-option'
  });
  let _0x2b6f27 = null;
  let _0x4c535d = 0x0;
  function _0x284fc5(_0x3f7c61 = ![]) {
    const _0x277fca = _0x2b6f27;
    _0x2b6f27 = null;
    _0x2eda46["cancelAnimationFrame"](_0x4c535d);
    _0x32c695["close"]();
    _0x277fca?.["menu"]["hidePopover"]();
    _0x4d2c65["removeEventListener"]('pointerdown', _0x3a448a, !![]);
    if (_0x3f7c61 && _0x277fca?.["trigger"]["isConnected"]) {
      _0x277fca["trigger"]["focus"]({
        'preventScroll': !![]
      });
    }
  }
  function _0x3a448a(_0xee1128) {
    if (!_0x2b6f27?.['root']["contains"](_0xee1128["target"])) {
      _0x284fc5();
    }
  }
  function _0x22017b() {
    for (const _0x61498 of _0xa5773a) {
      const {
        select: _0x58dd64,
        trigger: _0x447e0d,
        text: _0x390b86,
        menu: _0x15187b
      } = _0x61498;
      _0x447e0d["disabled"] = _0x58dd64["matches"](':disabled');
      _0x390b86["textContent"] = _0x58dd64["selectedOptions"][0x0]?.["textContent"] || "请选择";
      _0x447e0d["title"] = _0x390b86["textContent"];
      for (const _0x23c8ca of _0x15187b['children']) {
        _0x23c8ca["setAttribute"]("aria-selected", String(_0x23c8ca["dataset"]["value"] === _0x58dd64["value"]));
      }
      if (_0x2b6f27 === _0x61498 && _0x447e0d["disabled"]) {
        _0x284fc5();
      }
    }
  }
  function _0x437aa6() {
    if (!_0x2b6f27) {
      return;
    }
    const {
      trigger: _0xfccab5,
      menu: _0x4a110b
    } = _0x2b6f27;
    if (!_0xfccab5['isConnected'] || !_0xfccab5["checkVisibility"]() || _0xfccab5["matches"](":disabled")) {
      _0x284fc5();
      return;
    }
    const _0x2ba69c = _0xfccab5["getBoundingClientRect"]();
    const _0x4a6619 = Math["min"](Math["max"](_0x2ba69c["width"], 0xa0), _0x2eda46['innerWidth'] - 0x18);
    const _0x135ffc = _0x2eda46["innerHeight"] - _0x2ba69c["bottom"] - 0x10;
    const _0x23e214 = _0x2ba69c["top"] - 0x10;
    const _0x258f1b = _0x135ffc < 0xa0 && _0x23e214 > _0x135ffc;
    _0x4a110b["style"]["width"] = _0x4a6619 + 'px';
    _0x4a110b["style"]['left'] = Math['max'](0xc, Math['min'](_0x2ba69c["left"], _0x2eda46["innerWidth"] - _0x4a6619 - 0xc)) + 'px';
    _0x4a110b["style"]["maxHeight"] = Math["max"](0x28, Math["min"](0x118, _0x258f1b ? _0x23e214 : _0x135ffc)) + 'px';
    _0x4a110b["style"]["top"] = _0x258f1b ? 'auto' : _0x2ba69c["bottom"] + 0x4 + 'px';
    _0x4a110b["style"]["bottom"] = _0x258f1b ? _0x2eda46["innerHeight"] - _0x2ba69c["top"] + 0x4 + 'px' : "auto";
    _0x4c535d = _0x2eda46["requestAnimationFrame"](_0x437aa6);
  }
  function _0x230a7a(_0x720a4a) {
    _0x284fc5();
    _0x22017b();
    if (!_0x32c695["open"](_0x720a4a["root"], _0x720a4a["trigger"])) {
      return ![];
    }
    _0x2b6f27 = _0x720a4a;
    _0x720a4a['menu']["showPopover"]();
    _0x437aa6();
    _0x4d2c65["addEventListener"]("pointerdown", _0x3a448a, !![]);
    return !![];
  }
  function _0x336d09(_0x32ca7b) {
    const _0x15030f = _0xa5773a["find"](_0x3b6501 => _0x3b6501["root"]["contains"](_0x32ca7b["target"]));
    if (!_0x15030f || _0x15030f["select"]["matches"](":disabled")) {
      return;
    }
    if (_0x32ca7b['target']['closest'](".story-replication-select-trigger")) {
      if (_0x2b6f27 === _0x15030f) {
        _0x284fc5(!![]);
      } else {
        if (_0x230a7a(_0x15030f)) {
          const _0x5b7b0f = _0x15030f['menu']['querySelector']("[aria-selected=\"true\"]:not(:disabled)") || _0x15030f["menu"]["querySelector"]('button:not(:disabled)');
          _0x5b7b0f?.['focus']({
            'preventScroll': !![]
          });
          _0x5b7b0f?.["scrollIntoView"]({
            'block': 'nearest'
          });
        }
      }
    }
    const _0xda23f6 = _0x32ca7b["target"]["closest"](".story-replication-select-option");
    if (!_0xda23f6 || _0xda23f6["disabled"]) {
      return;
    }
    _0x15030f["select"]["value"] = _0xda23f6["dataset"]['value'];
    _0x22017b();
    _0x284fc5(!![]);
    _0x15030f["select"]["dispatchEvent"](new _0x2eda46['Event']("change", {
      'bubbles': !![]
    }));
  }
  function _0x362e56(_0x4364e2) {
    const _0x427a6d = _0xa5773a["find"](_0x4d5471 => _0x4d5471['root']["contains"](_0x4364e2["target"]));
    if (!_0x427a6d || _0x427a6d['select']["matches"](":disabled")) {
      return;
    }
    if (_0x4364e2['target'] === _0x427a6d["trigger"] && ["ArrowDown", "ArrowUp"]["includes"](_0x4364e2["key"]) && _0x2b6f27 !== _0x427a6d) {
      if (!_0x230a7a(_0x427a6d)) {
        return;
      }
    }
    if (_0x4364e2["key"] === 'Tab' && _0x2b6f27) {
      _0x284fc5(!![]);
      return;
    }
    if (_0x32c695["handleKeyDown"](_0x4364e2)) {
      if (!_0x427a6d['root']["classList"]["contains"]("is-open")) {
        _0x284fc5();
      } else {
        if (_0x427a6d["menu"]["contains"](_0x4d2c65["activeElement"])) {
          _0x4d2c65["activeElement"]["scrollIntoView"]({
            'block': "nearest"
          });
        }
      }
    }
  }
  _0x405579["addEventListener"]("click", _0x336d09);
  _0x405579["addEventListener"]("keydown", _0x362e56);
  _0x405579["addEventListener"]('change', _0x22017b);
  _0x22017b();
  return {
    'sync': _0x22017b,
    'close': _0x284fc5,
    'destroy'() {
      _0x284fc5();
      _0x405579["removeEventListener"]("click", _0x336d09);
      _0x405579["removeEventListener"]('keydown', _0x362e56);
      _0x405579["removeEventListener"]("change", _0x22017b);
      for (const {
        select: _0x24e32f,
        root: _0x3d62e1,
        hidden: _0x4bb2c3
      } of _0xa5773a) {
        _0x3d62e1["before"](_0x24e32f);
        _0x24e32f["hidden"] = _0x4bb2c3;
        _0x3d62e1["remove"]();
      }
    }
  };
}