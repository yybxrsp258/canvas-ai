import a516_0x2dd1a6 from '../core/stores/appStore.js';
import { deferNodeEditorCommit } from '../core/nodeEditorCommit.js';
import { commit } from '../modules/history.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { startNodeResizePreview } from '../modules/interaction/nodeResizePreview.js';
import { bindTextToolbarEvents } from './NodeToolbarConfig.js';
import { sanitizeRichTextHtml, setStaticInnerHTML } from '../utils/dom.js';
function sourceTextText(_0x553df0, _0x5a7dd0 = {}) {
  return t("sourceTextNode." + _0x553df0, _0x5a7dd0);
}
export class SourceTextNode {
  constructor(_0xa788dd) {
    this["_data"] = _0xa788dd;
    this['el'] = document["createElement"]("div");
    this['id'] = _0xa788dd['id'];
    this['el']["className"] = "v2-node-component";
    this["_lastScrollTop"] = Number['isFinite'](_0xa788dd?.['contentScrollTop']) ? Math["max"](0x0, _0xa788dd["contentScrollTop"]) : 0x0;
    this["_unsubscribeLocale"] = null;
  }
  ["mount"]() {
    this["_subscribeLocaleChanges"]();
    const _0x33bfb2 = this['el'];
    setStaticInnerHTML(_0x33bfb2, "toolbar:text");
    const _0x335eab = document["createElement"]("div");
    _0x335eab["className"] = "node-card source-text-card";
    const _0x585c37 = document["createElement"]("div");
    _0x585c37["className"] = 'source-text-content';
    _0x585c37["setAttribute"]("contenteditable", "false");
    _0x585c37["spellcheck"] = ![];
    _0x585c37["dataset"]['placeholder'] = sourceTextText("placeholder.initial");
    const _0x47026a = document["createElement"]("div");
    _0x47026a["className"] = 'source-text-footer';
    const _0x27f29e = document["createElement"]('div');
    _0x27f29e["className"] = "source-text-info";
    const _0x472d1e = "http://www.w3.org/2000/svg";
    const _0x13d474 = document["createElementNS"](_0x472d1e, "svg");
    _0x13d474["setAttribute"]('width', '12');
    _0x13d474["setAttribute"]("height", '12');
    _0x13d474["setAttribute"]("viewBox", "0 0 24 24");
    _0x13d474["setAttribute"]('fill', "none");
    _0x13d474["setAttribute"]("stroke", 'currentColor');
    _0x13d474['setAttribute']("stroke-width", '2');
    _0x13d474["style"]["opacity"] = "0.4";
    const _0x97508a = document['createElementNS'](_0x472d1e, "path");
    _0x97508a['setAttribute']('d', 'M14\x202H6a2\x202\x200\x200\x200-2\x202v16a2\x202\x200\x200\x200\x202\x202h12a2\x202\x200\x200\x200\x202-2V8z');
    const _0x238f8c = document['createElementNS'](_0x472d1e, 'polyline');
    _0x238f8c["setAttribute"]("points", "14 2 14 8 20 8");
    const _0x3e0c02 = document["createElementNS"](_0x472d1e, "line");
    _0x3e0c02["setAttribute"]('x1', '16');
    _0x3e0c02["setAttribute"]('y1', '13');
    _0x3e0c02["setAttribute"]('x2', '8');
    _0x3e0c02["setAttribute"]('y2', '13');
    const _0x1a885d = document["createElementNS"](_0x472d1e, "line");
    _0x1a885d["setAttribute"]('x1', '16');
    _0x1a885d['setAttribute']('y1', '17');
    _0x1a885d["setAttribute"]('x2', '8');
    _0x1a885d["setAttribute"]('y2', '17');
    _0x13d474["appendChild"](_0x97508a);
    _0x13d474["appendChild"](_0x238f8c);
    _0x13d474["appendChild"](_0x3e0c02);
    _0x13d474["appendChild"](_0x1a885d);
    const _0x291caf = document["createElement"]('span');
    _0x291caf["className"] = 'source-text-char-count';
    _0x291caf["textContent"] = sourceTextText("charCount", {
      'count': 0x0
    });
    _0x27f29e["appendChild"](_0x13d474);
    _0x27f29e['appendChild'](_0x291caf);
    _0x47026a["appendChild"](_0x27f29e);
    const _0x132dd4 = document["createElement"]('div');
    _0x132dd4['className'] = "node-port out-port";
    const _0xe9ae40 = document["createElement"]("div");
    _0xe9ae40["className"] = 'group-resizer';
    _0xe9ae40["classList"]["add"]('v2-resize-move');
    _0x335eab["appendChild"](_0x585c37);
    _0x335eab["appendChild"](_0x47026a);
    _0x335eab['appendChild'](_0x132dd4);
    _0x335eab['appendChild'](_0xe9ae40);
    _0x33bfb2["appendChild"](_0x335eab);
    this["_card"] = _0x335eab;
    this["_content"] = _0x585c37;
    this['_countEl'] = _0x291caf;
    this["_card"]["addEventListener"]("dblclick", _0x545b1f => {
      _0x545b1f["stopPropagation"]();
    });
    const _0x41417f = typeof this["_data"]["content"] === 'string' ? this["_data"]["content"] : '';
    const _0x38f894 = typeof this["_data"]["contentHtml"] === "string" ? this["_data"]['contentHtml'] : '';
    const _0x44cbcb = sanitizeRichTextHtml(_0x38f894);
    _0x44cbcb["trim"]() ? this["_content"]["innerHTML"] = _0x44cbcb : this["_content"]["innerText"] = _0x41417f;
    const _0xc0c639 = this["_content"]["innerText"] || '';
    !_0xc0c639 ? this["_content"]['dataset']['placeholder'] = sourceTextText("placeholder.initial") : delete this["_content"]["dataset"]['placeholder'];
    this["_countEl"]["textContent"] = sourceTextText("charCount", {
      'count': _0xc0c639['length']
    });
    this["_content"]["scrollTop"] = this["_lastScrollTop"];
    this["_content"]["addEventListener"]("blur", () => {
      this['_lastScrollTop'] = Math["max"](0x0, this["_content"]['scrollTop'] || 0x0);
      this['_content']["setAttribute"]("contenteditable", "false");
      this['el']["classList"]["remove"]("source-text-editing");
      if (deferNodeEditorCommit(this['_content'], 'source-text', () => this['_content']["dispatchEvent"](new Event('blur')))) {
        return;
      }
      const _0x1ba6d1 = this["_content"]["innerText"] || '';
      const _0x4e2621 = _0x1ba6d1["trim"]()["length"] > 0x0 ? sanitizeRichTextHtml(this["_content"]['innerHTML'] || '') : '';
      if (_0x4e2621["trim"]()) {
        this["_content"]["innerHTML"] = _0x4e2621;
      } else {
        _0x1ba6d1 && (this["_content"]["innerText"] = _0x1ba6d1);
      }
      a516_0x2dd1a6["updateNodeData"](this['id'], {
        'content': _0x1ba6d1,
        'contentHtml': _0x4e2621,
        'contentScrollTop': this["_lastScrollTop"]
      });
      this["_updateSizeByLength"](_0x1ba6d1['length'], !![]);
    });
    this["_content"]["addEventListener"]("input", () => {
      const _0x56b638 = this["_content"]["innerText"] || '';
      this["_countEl"]["textContent"] = sourceTextText("charCount", {
        'count': _0x56b638["length"]
      });
      _0x56b638["length"] > 0x0 ? delete this["_content"]["dataset"]["placeholder"] : this["_content"]["dataset"]["placeholder"] = sourceTextText("placeholder.edit");
    });
    let _0x327674 = 0x0;
    let _0x4e31d2 = 0x0;
    this['_content']["addEventListener"]("pointerdown", _0x25e3b0 => {
      if (this["_content"]["getAttribute"]("contenteditable") === 'true') {
        _0x25e3b0['stopPropagation']();
        return;
      }
      _0x327674 = _0x25e3b0["clientX"];
      _0x4e31d2 = _0x25e3b0["clientY"];
    });
    this['_content']["addEventListener"]('pointerup', _0xc96faf => {
      if (this['_content']["getAttribute"]("contenteditable") === "true") {
        return;
      }
      const _0x323b42 = Math["hypot"](_0xc96faf["clientX"] - _0x327674, _0xc96faf["clientY"] - _0x4e31d2);
      if (_0x323b42 < 0x5) {
        const _0x47caa1 = this["_content"]["innerText"]["trim"]();
        if (_0x47caa1["length"] === 0x0) {
          this["_enterEditMode"]();
          return;
        }
        const _0x36ac90 = document["caretRangeFromPoint"](_0xc96faf["clientX"], _0xc96faf['clientY']);
        if (_0x36ac90 && this['_content']["contains"](_0x36ac90["startContainer"])) {
          const _0x2d38e7 = _0x36ac90["startContainer"]['nodeType'] === Node["TEXT_NODE"] ? _0x36ac90["startContainer"] : null;
          _0x2d38e7 && this["_enterEditMode"]();
        }
      }
    });
    this['_content']['addEventListener']("wheel", _0x118134 => {
      this["_content"]['scrollHeight'] > this["_content"]['clientHeight'] && _0x118134["stopPropagation"]();
    });
    this["_content"]["addEventListener"]("scroll", () => {
      this['_lastScrollTop'] = Math["max"](0x0, this['_content']["scrollTop"] || 0x0);
    });
    _0xe9ae40 && _0xe9ae40["addEventListener"]("pointerdown", _0x31d0af => {
      startNodeResizePreview({
        'event': _0x31d0af,
        'nodeId': this['id'],
        'getNode': () => a516_0x2dd1a6["getStateRaw"]()["nodes"]?.[this['id']] || this["_data"],
        'getViewport': () => a516_0x2dd1a6['getStateRaw']()["viewport"],
        'resolveSize': ({
          startWidth: _0x472c0a,
          startHeight: _0x342300,
          dx: _0x4e2b11,
          dy: _0x3b8029
        }) => ({
          'width': Math["max"](0x96, _0x472c0a + _0x4e2b11),
          'height': Math["max"](0x96, _0x342300 + _0x3b8029)
        }),
        'applyPatch': _0x41ddbc => a516_0x2dd1a6["updateNodeData"](this['id'], _0x41ddbc),
        'commit': commit
      });
    });
    const _0x5006ba = _0x33bfb2["querySelector"](".node-floating-toolbar");
    bindTextToolbarEvents(_0x5006ba, this["_data"], () => this["_content"]['innerText']);
    this["_updateSizeByLength"](_0xc0c639["length"], ![]);
    return _0x33bfb2;
  }
  ["_enterEditMode"]() {
    this["_content"]["setAttribute"]("contenteditable", "true");
    this['el']["classList"]["add"]("source-text-editing");
    this["_content"]["focus"]();
    this["_content"]['scrollTop'] = this["_lastScrollTop"];
    requestAnimationFrame(() => {
      this['_content']['scrollTop'] = this["_lastScrollTop"];
    });
    const _0x402ed8 = a516_0x2dd1a6['getState']()["selectedNodeIds"];
    if (!_0x402ed8["includes"](this['id'])) {
      a516_0x2dd1a6['setSelectedNodes']([this['id']]);
    }
  }
  ["_updateSizeByLength"](_0x51d6b1, _0x360fea = ![]) {
    if (!this["_data"]["width"] || this["_data"]["width"] < 0x64) {
      let _0x268c81 = 0x104;
      if (_0x51d6b1 > 0x12c) {
        _0x268c81 = 0x208;
      }
      _0x360fea ? a516_0x2dd1a6["updateNodeData"](this['id'], {
        'width': _0x268c81,
        'height': _0x268c81
      }) : (this["_data"]['width'] = _0x268c81, this["_data"]['height'] = _0x268c81);
    }
  }
  ["update"](_0x45fdf0) {
    this["_data"] = _0x45fdf0;
    if (!this["_content"]) {
      return;
    }
    Number["isFinite"](_0x45fdf0['contentScrollTop']) && (this["_lastScrollTop"] = Math["max"](0x0, _0x45fdf0["contentScrollTop"]));
    const _0x19172c = _0x45fdf0["content"] !== undefined || _0x45fdf0["contentHtml"] !== undefined;
    if (_0x19172c && document['activeElement'] !== this["_content"]) {
      const _0x25e1c7 = sanitizeRichTextHtml(typeof _0x45fdf0["contentHtml"] === "string" ? _0x45fdf0['contentHtml'] : '');
      const _0x2e5531 = typeof _0x45fdf0["content"] === "string" ? _0x45fdf0["content"] : '';
      _0x25e1c7["trim"]() ? this['_content']["innerHTML"] = _0x25e1c7 : this["_content"]['innerText'] = _0x2e5531;
      const _0x45de4e = this["_content"]['innerText'] || '';
      !_0x45de4e ? this["_content"]['dataset']['placeholder'] = sourceTextText("placeholder.edit") : delete this['_content']["dataset"]['placeholder'];
      this['_countEl'] && (this["_countEl"]["textContent"] = sourceTextText("charCount", {
        'count': _0x45de4e["length"]
      }));
      this["_content"]['scrollTop'] = this['_lastScrollTop'];
    }
  }
  ["_subscribeLocaleChanges"]() {
    if (this["_unsubscribeLocale"]) {
      return;
    }
    this['_unsubscribeLocale'] = onLocaleChange(() => this["_syncLocaleTexts"]());
  }
  ['_syncLocaleTexts']() {
    if (!this['_content']) {
      return;
    }
    const _0xd2016c = this["_content"]["innerText"] || '';
    !_0xd2016c && (this["_content"]["dataset"]["placeholder"] = this["_content"]["getAttribute"]("contenteditable") === 'true' ? sourceTextText('placeholder.edit') : sourceTextText('placeholder.initial'));
    this["_countEl"] && (this["_countEl"]["textContent"] = sourceTextText("charCount", {
      'count': _0xd2016c["length"]
    }));
  }
  ["unmount"]() {
    this['_unsubscribeLocale']?.();
    this["_unsubscribeLocale"] = null;
  }
}