import { MATERIAL_TREE_CHEVRON_ICON_SVG } from '../../components/sharedIconMarkup.js';
export function createCollaborationSelect(_0x45081c, _0x4620a8) {
  _0x45081c['hidden'] = !![];
  _0x45081c["removeAttribute"]("aria-label");
  const _0x2e2c09 = document["createElement"]("div");
  _0x2e2c09["className"] = "collaboration-select";
  const _0x62c05d = document['createElement']("button");
  _0x62c05d["type"] = "button";
  _0x62c05d["className"] = "collaboration-button collaboration-select-trigger";
  _0x62c05d["setAttribute"]("aria-label", _0x4620a8);
  _0x62c05d['setAttribute']("aria-haspopup", "listbox");
  const _0x22a4b1 = document["createElement"]("span");
  const _0x152f7e = document["createElement"]("span");
  _0x152f7e["innerHTML"] = MATERIAL_TREE_CHEVRON_ICON_SVG;
  _0x62c05d['append'](_0x22a4b1, _0x152f7e);
  const _0x3296ae = document["createElement"]('div');
  _0x3296ae["className"] = "collaboration-select-menu";
  _0x3296ae["setAttribute"]("popover", "manual");
  _0x3296ae["setAttribute"]("role", "listbox");
  _0x3296ae["setAttribute"]("aria-label", _0x4620a8);
  _0x3296ae['id'] = "collaboration-select-" + crypto['randomUUID']();
  _0x62c05d["setAttribute"]("aria-controls", _0x3296ae['id']);
  _0x45081c["before"](_0x2e2c09);
  _0x2e2c09["append"](_0x45081c, _0x62c05d, _0x3296ae);
  let _0x253a98 = ![];
  let _0x2c8562 = 0x0;
  let _0x1fa07c = '';
  function _0x5500a7(_0x5a8a2d = ![]) {
    if (!_0x253a98) {
      return;
    }
    _0x253a98 = ![];
    cancelAnimationFrame(_0x2c8562);
    _0x3296ae["hidePopover"]();
    _0x62c05d["setAttribute"]('aria-expanded', "false");
    document["removeEventListener"]("pointerdown", _0x475a8a, !![]);
    if (_0x5a8a2d && _0x62c05d['isConnected']) {
      _0x62c05d['focus']();
    }
  }
  function _0x475a8a(_0x1cbefa) {
    if (!_0x2e2c09["contains"](_0x1cbefa["target"])) {
      _0x5500a7();
    }
  }
  function _0x22521() {
    if (!_0x253a98) {
      return;
    }
    if (!_0x62c05d["isConnected"] || !_0x62c05d["checkVisibility"]()) {
      _0x5500a7();
      return;
    }
    const _0x5986bd = _0x62c05d["getBoundingClientRect"]();
    const _0x56275c = Math["min"](Math["max"](_0x5986bd['width'], 0x82), innerWidth - 0x18);
    _0x3296ae["style"]["width"] = _0x56275c + 'px';
    _0x3296ae["style"]['left'] = Math['max'](0xc, Math["min"](_0x5986bd["right"] - _0x56275c, innerWidth - _0x56275c - 0xc)) + 'px';
    const _0x1ffa48 = innerHeight - _0x5986bd["bottom"] - 0x10;
    const _0x30e68c = _0x5986bd["top"] - 0x10;
    const _0xd36853 = _0x1ffa48 < 0x78 && _0x30e68c > _0x1ffa48;
    _0x3296ae['style']['maxHeight'] = Math["max"](0x28, Math["min"](0x118, _0xd36853 ? _0x30e68c : _0x1ffa48)) + 'px';
    _0x3296ae["style"]["top"] = _0xd36853 ? "auto" : _0x5986bd["bottom"] + 0x4 + 'px';
    _0x3296ae["style"]["bottom"] = _0xd36853 ? innerHeight - _0x5986bd["top"] + 0x4 + 'px' : "auto";
    _0x2c8562 = requestAnimationFrame(_0x22521);
  }
  function _0x12693b() {
    _0x62c05d['disabled'] = _0x45081c["disabled"];
    _0x22a4b1['textContent'] = _0x45081c["selectedOptions"][0x0]?.['textContent'] || '请选择';
    _0x62c05d["title"] = _0x22a4b1["textContent"];
    const _0x4b9979 = JSON['stringify']([..._0x45081c["options"]]["map"](_0x2cbc4f => [_0x2cbc4f["value"], _0x2cbc4f["textContent"], _0x2cbc4f["disabled"], _0x2cbc4f['hidden']]));
    if (_0x4b9979 !== _0x1fa07c) {
      _0x1fa07c = _0x4b9979;
      _0x3296ae['replaceChildren']();
      for (const _0x469c94 of _0x45081c["options"]) {
        if (_0x469c94["hidden"]) {
          continue;
        }
        const _0x28fd3b = document["createElement"]("button");
        _0x28fd3b["type"] = 'button';
        _0x28fd3b["className"] = "collaboration-select-option";
        _0x28fd3b["setAttribute"]('role', "option");
        _0x28fd3b["textContent"] = _0x469c94["textContent"];
        _0x28fd3b["dataset"]["value"] = _0x469c94["value"];
        _0x28fd3b["disabled"] = _0x469c94['disabled'];
        _0x28fd3b["addEventListener"]("click", () => {
          _0x45081c['value'] = _0x469c94["value"];
          _0x12693b();
          _0x5500a7(!![]);
          _0x45081c["dispatchEvent"](new Event("change", {
            'bubbles': !![]
          }));
        });
        _0x3296ae["append"](_0x28fd3b);
      }
    }
    for (const _0x2023ce of _0x3296ae['children']) {
      const _0x442078 = _0x2023ce['dataset']["value"] === _0x45081c['value'];
      _0x2023ce['setAttribute']('aria-selected', String(_0x442078));
      _0x2023ce["tabIndex"] = _0x442078 ? 0x0 : -0x1;
    }
  }
  function _0x1c5e82() {
    if (_0x62c05d["disabled"]) {
      return;
    }
    _0x12693b();
    _0x253a98 = !![];
    _0x3296ae["showPopover"]();
    _0x62c05d['setAttribute']("aria-expanded", "true");
    _0x22521();
    document['addEventListener']('pointerdown', _0x475a8a, !![]);
    (_0x3296ae["querySelector"]('[aria-selected=\x22true\x22]') || _0x3296ae["firstElementChild"])?.["focus"]();
  }
  _0x62c05d["addEventListener"]("click", () => _0x253a98 ? _0x5500a7(!![]) : _0x1c5e82());
  _0x62c05d['addEventListener']("keydown", _0x9137c7 => {
    ["ArrowDown", "ArrowUp"]["includes"](_0x9137c7["key"]) && (_0x9137c7["preventDefault"](), _0x1c5e82());
  });
  _0x3296ae['addEventListener']('keydown', _0x721ffa => {
    _0x721ffa['key'] === "Escape" && (_0x721ffa["preventDefault"](), _0x721ffa["stopPropagation"](), _0x5500a7(!![]));
    if (_0x721ffa["key"] === "Tab") {
      _0x5500a7();
    }
    if (!['ArrowDown', 'ArrowUp', "Home", "End"]["includes"](_0x721ffa["key"])) {
      return;
    }
    _0x721ffa["preventDefault"]();
    const _0x436c0 = [..._0x3296ae["children"]]['filter'](_0x3b0121 => !_0x3b0121['disabled']);
    const _0x17f519 = _0x436c0['indexOf'](document["activeElement"]);
    const _0x3c0854 = _0x721ffa["key"] === 'Home' ? 0x0 : _0x721ffa["key"] === "End" ? _0x436c0["length"] - 0x1 : (_0x17f519 + (_0x721ffa['key'] === "ArrowDown" ? 0x1 : -0x1) + _0x436c0["length"]) % _0x436c0['length'];
    _0x436c0[_0x3c0854]?.["focus"]();
  });
  _0x62c05d["setAttribute"]("aria-expanded", "false");
  _0x12693b();
  return {
    'sync': _0x12693b,
    'open': _0x1c5e82,
    'close': _0x5500a7,
    'trigger': _0x62c05d,
    'destroy'() {
      _0x5500a7();
      _0x2e2c09['remove']();
    }
  };
}