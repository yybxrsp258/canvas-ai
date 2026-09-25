import { readNodeMediaMetricsDataset } from '../modules/nodeMediaMetrics.js';
const _staticInnerHtmlRegistry = new Map([["cpdProjectItemIcon16", "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"var(--indigo-text)\" stroke-width=\"2\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\"/><polyline points=\"21 15 16 10 5 21\"/></svg>"], ["iconTrash18", '<svg\x20width=\x2218\x22\x20height=\x2218\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22var(--red)\x22\x20stroke-width=\x222\x22><polyline\x20points=\x223\x206\x205\x206\x2021\x206\x22/><path\x20d=\x22M19\x206v14a2\x202\x200\x200\x201-2\x202H7a2\x202\x200\x200\x201-2-2V6m3\x200V4a1\x201\x200\x200\x201\x201-1h4a1\x201\x200\x200\x201\x201\x201v2\x22/></svg>'], ["iconFolderOpen18", "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v2\"/><path d=\"M3 10h18l-2 8a2 2 0 0 1-2 1.5H5a2 2 0 0 1-2-1.5Z\"/></svg>"], ["iconSaveAs18", "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v3\"/><path d=\"M17 21v-8H7v8\"/><path d=\"M7 3v5h8\"/><path d=\"M18 14v6\"/><path d=\"M15 17h6\"/></svg>"], ["iconPackageExport18", "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M21 8v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8\"/><path d=\"M3 8l9 5 9-5\"/><path d=\"M12 13v7\"/><path d=\"M7 4h10l4 4H3z\"/><path d=\"M12 2v6\"/><path d=\"M9 5l3-3 3 3\"/></svg>"], ["iconPackageImport18", "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M21 8v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8\"/><path d=\"M3 8l9 5 9-5\"/><path d=\"M12 13v7\"/><path d=\"M7 4h10l4 4H3z\"/><path d=\"M12 2v6\"/><path d=\"M15 5l-3 3-3-3\"/></svg>"]]);
const _staticTemplateCache = new Map();
export function registerStaticInnerHTML(_0x119f99, _0x5325c1) {
  if (typeof _0x119f99 !== 'string' || !_0x119f99) {
    throw new Error("templateId must be a non-empty string");
  }
  if (typeof _0x5325c1 !== "string") {
    throw new Error("html must be a string");
  }
  if (_staticInnerHtmlRegistry["has"](_0x119f99)) {
    throw new Error('Static\x20HTML\x20template\x20already\x20registered:\x20' + _0x119f99);
  }
  _staticInnerHtmlRegistry['set'](_0x119f99, _0x5325c1);
}
export function setStaticInnerHTML(_0xce8e56, _0x45413a) {
  if (!_0xce8e56) {
    return;
  }
  const _0x29ab0a = _staticTemplateCache["get"](_0x45413a);
  if (_0x29ab0a) {
    _0xce8e56["replaceChildren"](_0x29ab0a["content"]["cloneNode"](!![]));
    return;
  }
  const _0x3a8be0 = _staticInnerHtmlRegistry['get'](_0x45413a);
  if (!_0x3a8be0) {
    throw new Error("Unknown static HTML template: " + _0x45413a);
  }
  if (typeof document === "undefined") {
    _0xce8e56["innerHTML"] = _0x3a8be0;
    return;
  }
  const _0x334a49 = document["createElement"]("template");
  _0x334a49["innerHTML"] = _0x3a8be0;
  _staticTemplateCache['set'](_0x45413a, _0x334a49);
  _0xce8e56['replaceChildren'](_0x334a49["content"]["cloneNode"](!![]));
}
export function clearElement(_0x4eb037) {
  if (!_0x4eb037) {
    return;
  }
  _0x4eb037["replaceChildren"]();
}
export function setText(_0x28abce, _0x4161e7) {
  if (!_0x28abce) {
    return;
  }
  _0x28abce['textContent'] = _0x4161e7 == null ? '' : String(_0x4161e7);
}
export function setTextWithLineBreaks(_0x1e5010, _0xcf5732) {
  if (!_0x1e5010) {
    return;
  }
  _0x1e5010["replaceChildren"]();
  const _0x4ac72c = _0xcf5732 == null ? '' : String(_0xcf5732);
  const _0x5a00b1 = _0x4ac72c["split"]('\x0a');
  for (let _0xf96e9 = 0x0; _0xf96e9 < _0x5a00b1["length"]; _0xf96e9++) {
    if (_0xf96e9 > 0x0) {
      _0x1e5010['appendChild'](document["createElement"]('br'));
    }
    _0x1e5010["appendChild"](document["createTextNode"](_0x5a00b1[_0xf96e9]));
  }
}
const _SVG_NS = "http://www.w3.org/2000/svg";
const _ALLOWED_SVG_TAGS = new Set(["svg", 'g', "path", "rect", "circle", 'ellipse', "line", "polyline", "polygon"]);
const _ALLOWED_SVG_ATTRS = new Set(["viewBox", "width", "height", "fill", "stroke", "stroke-width", 'stroke-linecap', "stroke-linejoin", "stroke-miterlimit", "stroke-dasharray", "stroke-dashoffset", 'opacity', "transform", 'd', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'points', "xmlns", "class", "aria-hidden", "focusable"]);
function _sanitizeSvgNode(_0x3ce69d) {
  if (!_0x3ce69d || _0x3ce69d["nodeType"] !== Node["ELEMENT_NODE"]) {
    return null;
  }
  const _0x35b7d3 = String(_0x3ce69d["tagName"] || '')["toLowerCase"]();
  if (!_ALLOWED_SVG_TAGS["has"](_0x35b7d3)) {
    return null;
  }
  const _0x262d0d = document["createElementNS"](_SVG_NS, _0x35b7d3);
  for (const _0x39c78a of Array["from"](_0x3ce69d['attributes'] || [])) {
    const _0x5cdffd = _0x39c78a["name"];
    const _0x1f5b12 = _0x39c78a['value'];
    if (!_0x5cdffd) {
      continue;
    }
    const _0x302dda = _0x5cdffd['toLowerCase']();
    if (_0x302dda["startsWith"]('on')) {
      continue;
    }
    if (_0x302dda === 'href' || _0x302dda === "xlink:href") {
      continue;
    }
    if (!_ALLOWED_SVG_ATTRS['has'](_0x5cdffd)) {
      continue;
    }
    _0x262d0d["setAttribute"](_0x5cdffd, _0x1f5b12);
  }
  for (const _0x4c6754 of Array['from'](_0x3ce69d["childNodes"] || [])) {
    if (_0x4c6754["nodeType"] === Node["ELEMENT_NODE"]) {
      const _0xde769d = _sanitizeSvgNode(_0x4c6754);
      if (_0xde769d) {
        _0x262d0d["appendChild"](_0xde769d);
      }
    }
  }
  return _0x262d0d;
}
export function createSafeSvg(_0x210073) {
  if (typeof _0x210073 !== "string") {
    return null;
  }
  const _0x33e039 = _0x210073["trim"]();
  if (!_0x33e039) {
    return null;
  }
  const _0x5867f6 = new DOMParser()["parseFromString"](_0x33e039, "image/svg+xml");
  if (_0x5867f6["querySelector"]("parsererror")) {
    return null;
  }
  const _0x87eb2 = _0x5867f6["documentElement"];
  if (!_0x87eb2 || String(_0x87eb2["tagName"] || '')["toLowerCase"]() !== "svg") {
    return null;
  }
  const _0x2a7f50 = _sanitizeSvgNode(_0x87eb2);
  if (!_0x2a7f50) {
    return null;
  }
  if (!_0x2a7f50["getAttribute"]("focusable")) {
    _0x2a7f50["setAttribute"]('focusable', "false");
  }
  if (!_0x2a7f50["getAttribute"]("aria-hidden")) {
    _0x2a7f50['setAttribute']("aria-hidden", "true");
  }
  return _0x2a7f50;
}
const _DANGEROUS_HTML_TAGS = new Set(["script", "style", "iframe", "object", 'embed', 'template']);
const _PROMPT_CONTAINER_TAGS = new Set(['div', 'p']);
const _RICH_TEXT_ALLOWED_TAGS = new Set(['h1', 'h2', 'h3', 'p', 'div', 'br', 'b', "strong", 'i', 'em', 'ul', 'ol', 'li', 'hr', "blockquote", "pre", "code", "table", 'thead', "tbody", 'tr', 'th', 'td']);
function _escapeHtmlText(_0x2ee307) {
  return String(_0x2ee307 ?? '')["replace"](/&/g, "&amp;")["replace"](/</g, '&lt;')['replace'](/>/g, "&gt;");
}
function _escapeHtmlAttr(_0x5e20d2) {
  return _escapeHtmlText(_0x5e20d2)["replace"](/"/g, '&quot;')["replace"](/'/g, "&#39;");
}
function _stripHtmlTags(_0x455609) {
  return String(_0x455609 ?? '')["replace"](/<\/?[^>]+>/g, '');
}
function _stripDangerousHtml(_0xff40b) {
  let _0x6f1177 = String(_0xff40b ?? '');
  _DANGEROUS_HTML_TAGS["forEach"](_0x4771cc => {
    const _0x2656cb = new RegExp('<' + _0x4771cc + '\x5cb[^>]*>[\x5cs\x5cS]*?<\x5c/' + _0x4771cc + '\x5cs*>', 'gi');
    const _0xaa4cf0 = new RegExp("<\\/?" + _0x4771cc + "\\b[^>]*\\/?>", 'gi');
    _0x6f1177 = _0x6f1177["replace"](_0x2656cb, '');
    _0x6f1177 = _0x6f1177["replace"](_0xaa4cf0, '');
  });
  return _0x6f1177;
}
function _extractHtmlAttr(_0x5770cc, _0x3bf8e2) {
  const _0x5039a6 = String(_0x5770cc ?? '');
  const _0x2312bb = String(_0x3bf8e2 || '')["replace"](/[.*+?^${}()|[\]\\]/g, "\\$&");
  const _0x1df93e = new RegExp(_0x2312bb + "\\s*=\\s*(\"([^\"]*)\"|'([^']*)')", 'i');
  const _0x5927ef = _0x5039a6['match'](_0x1df93e);
  if (_0x5927ef) {
    return _0x5927ef[0x2] ?? _0x5927ef[0x3] ?? '';
  }
  const _0x2f4731 = new RegExp(_0x2312bb + '\x5cs*=\x5cs*([^\x5cs\x22\x27>]+)', 'i');
  const _0x17279c = _0x5039a6["match"](_0x2f4731);
  return _0x17279c ? _0x17279c[0x1] ?? '' : '';
}
function _classAttrContains(_0x2e6dca, _0x9723d) {
  const _0xe864c2 = _extractHtmlAttr(_0x2e6dca, "class");
  return String(_0xe864c2 || '')["split"](/\s+/)["filter"](Boolean)["includes"](String(_0x9723d || ''));
}
function _replaceAllowedTagsWithTokens(_0x52900e, _0x16cb00) {
  const _0x57dcff = [];
  const _0x580bfb = _0x382e8b => {
    const _0x133d36 = '__AIC_HTML_TOKEN_' + _0x57dcff["length"] + '__';
    _0x57dcff["push"](String(_0x382e8b ?? ''));
    return _0x133d36;
  };
  let _0x3469a5 = String(_0x52900e ?? '');
  const _0x31435a = _0x2a9f07 => {
    const _0x200bea = new RegExp('<' + _0x2a9f07 + '\x5cb[^>]*>', 'gi');
    const _0x259ea9 = new RegExp("<\\/" + _0x2a9f07 + "\\s*>", 'gi');
    _0x3469a5 = _0x3469a5["replace"](_0x200bea, () => _0x580bfb('<' + _0x2a9f07 + '>'));
    _0x3469a5 = _0x3469a5['replace'](_0x259ea9, () => _0x580bfb('</' + _0x2a9f07 + '>'));
  };
  _0x16cb00["forEach"](_0x44cac2 => {
    if (_0x44cac2 === 'br' || _0x44cac2 === 'hr') {
      const _0x480692 = new RegExp('<' + _0x44cac2 + '\x5cb[^>]*\x5c/?>', 'gi');
      _0x3469a5 = _0x3469a5["replace"](_0x480692, () => _0x580bfb('<' + _0x44cac2 + '>'));
      return;
    }
    _0x31435a(_0x44cac2);
  });
  return {
    'output': _0x3469a5,
    'restore'() {
      return _0x3469a5["replace"](/__AIC_HTML_TOKEN_(\d+)__/g, (_0x2b81a1, _0x12606b) => {
        const _0x43c78a = _0x57dcff[Number(_0x12606b)];
        return typeof _0x43c78a === 'string' ? _0x43c78a : '';
      });
    },
    'pushToken': _0x580bfb,
    'setOutput'(_0x1fbc2f) {
      _0x3469a5 = String(_0x1fbc2f ?? '');
    }
  };
}
function _sanitizePromptHtmlWithoutDom(_0x10a525) {
  const _0x5c7e52 = String(_0x10a525 ?? '')["replace"](/<button\b[^>]*\bdata-story-voice-toggle(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?[^>]*>[\s\S]*?<\/button>/gi, '')["replace"](/<span\b[^>]*\bdata-story-voice-separator(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?[^>]*>[\s\S]*?<\/span>/gi, '');
  const _0x40cb4a = _replaceAllowedTagsWithTokens(_stripDangerousHtml(_0x5c7e52), _PROMPT_CONTAINER_TAGS);
  let _0x3b9584 = _0x40cb4a["output"]["replace"](/<span\b([^>]*)>([\s\S]*?)<\/span>/gi, (_0x3f29c2, _0xdb2a32, _0x45244d) => {
    const _0x206a60 = _classAttrContains(_0xdb2a32, "segment-retake-prompt-time") ? "segment-retake-prompt-time" : _classAttrContains(_0xdb2a32, "segment-retake-prompt-instruction") ? "segment-retake-prompt-instruction" : '';
    if (_0x206a60) {
      const _0x572680 = _stripHtmlTags(_extractHtmlAttr(_0xdb2a32, 'data-retake-annotation-id'))["trim"]();
      if (!_0x572680) {
        return _stripHtmlTags(_0x45244d);
      }
      return _0x40cb4a["pushToken"]("<span class=\"" + _0x206a60 + "\" contenteditable=\"false\" data-retake-annotation-id=\"" + _escapeHtmlAttr(_0x572680) + '\x22>' + _escapeHtmlText(_stripHtmlTags(_0x45244d)) + "</span>");
    }
    if (!_classAttrContains(_0xdb2a32, "ref-pill")) {
      return _0x45244d;
    }
    const _0x34e26d = _extractHtmlAttr(_0xdb2a32, "data-label") || _stripHtmlTags(_0x45244d);
    const _0x16c498 = _stripHtmlTags(_0x34e26d)["replace"](/[×✕✖]/g, '')["trim"]();
    const _0x1c086d = _stripHtmlTags(_extractHtmlAttr(_0xdb2a32, "data-node-id") || _extractHtmlAttr(_0xdb2a32, "data-nodeId"))["trim"]();
    const _0x4dfd2c = _stripHtmlTags(_extractHtmlAttr(_0xdb2a32, "data-ref-origin"))["trim"]();
    const _0x5b65cb = _stripHtmlTags(_extractHtmlAttr(_0xdb2a32, "data-ref-label"))["trim"]();
    const _0x29f985 = _stripHtmlTags(_extractHtmlAttr(_0xdb2a32, "data-asset-id"))["trim"]();
    const _0x1fc5ea = _stripHtmlTags(_extractHtmlAttr(_0xdb2a32, 'data-asset-index'))["trim"]();
    const _0x243fbd = _stripHtmlTags(_extractHtmlAttr(_0xdb2a32, "data-ref-type"))["trim"]();
    const _0x58effb = _stripHtmlTags(_extractHtmlAttr(_0xdb2a32, "data-ref-unresolved"))["trim"]();
    const _0x26042a = _stripHtmlTags(_extractHtmlAttr(_0xdb2a32, 'data-prompt-pill-kind'))['trim']();
    const _0x24bb11 = _stripHtmlTags(_extractHtmlAttr(_0xdb2a32, "data-story-voice-enabled"))["trim"]();
    const _0x3aa13d = _stripHtmlTags(_extractHtmlAttr(_0xdb2a32, "data-retake-annotation-id"))['trim']();
    const _0x3e513f = ["class=\"ref-pill\"", "contenteditable=\"false\""];
    if (_0x16c498) {
      _0x3e513f['push']("data-label=\"" + _escapeHtmlAttr(_0x16c498) + '\x22');
    }
    if (_0x1c086d) {
      _0x3e513f["push"]("data-node-id=\"" + _escapeHtmlAttr(_0x1c086d) + '\x22');
    }
    if (_0x4dfd2c === 'asset') {
      _0x3e513f["push"]("data-ref-origin=\"asset\"");
    }
    if (_0x5b65cb) {
      _0x3e513f["push"]("data-ref-label=\"" + _escapeHtmlAttr(_0x5b65cb) + '\x22');
    }
    if (_0x29f985) {
      _0x3e513f["push"]("data-asset-id=\"" + _escapeHtmlAttr(_0x29f985) + '\x22');
    }
    if (_0x1fc5ea) {
      _0x3e513f["push"]("data-asset-index=\"" + _escapeHtmlAttr(_0x1fc5ea) + '\x22');
    }
    if (_0x243fbd) {
      _0x3e513f['push']("data-ref-type=\"" + _escapeHtmlAttr(_0x243fbd) + '\x22');
    }
    if (_0x58effb === "true") {
      _0x3e513f["push"]("data-ref-unresolved=\"true\"");
    }
    if (_0x26042a === "time") {
      _0x3e513f["push"]("data-prompt-pill-kind=\"time\"");
    }
    if (_0x24bb11 === "true") {
      _0x3e513f["push"]("data-story-voice-enabled=\"true\"");
    }
    _0x3aa13d && _0x3e513f["push"]('data-retake-annotation-id=\x22' + _escapeHtmlAttr(_0x3aa13d) + '\x22');
    return _0x40cb4a["pushToken"]("<span " + _0x3e513f['join']('\x20') + '>' + _escapeHtmlText(_0x16c498) + '</span>');
  })["replace"](/<br\b[^>]*\/?>/gi, () => _0x40cb4a['pushToken']("<br>"));
  _0x40cb4a["setOutput"](_0x3b9584["replace"](/<\/?[^>]+>/g, ''));
  return _0x40cb4a["restore"]();
}
function _sanitizeRichTextHtmlWithoutDom(_0x439f64) {
  const _0x330741 = _replaceAllowedTagsWithTokens(_stripDangerousHtml(_0x439f64), _RICH_TEXT_ALLOWED_TAGS);
  _0x330741["setOutput"](_0x330741["output"]["replace"](/<\/?[^>]+>/g, ''));
  return _0x330741["restore"]();
}
function _appendSanitizedPromptNode(_0x423c35, _0x4d3dfa) {
  const _0x33f29c = Number(_0x4d3dfa?.["nodeType"]);
  if (_0x33f29c === 0x3) {
    _0x423c35["appendChild"](document["createTextNode"](String(_0x4d3dfa?.['textContent'] || '')));
    return;
  }
  if (_0x33f29c !== 0x1) {
    return;
  }
  const _0x2e01b6 = String(_0x4d3dfa?.["tagName"] || '')["toLowerCase"]();
  if (_DANGEROUS_HTML_TAGS["has"](_0x2e01b6)) {
    return;
  }
  if (_0x2e01b6 === 'br') {
    _0x423c35['appendChild'](document["createElement"]('br'));
    return;
  }
  const _0x1975d8 = _0x4d3dfa["classList"]?.["contains"]("segment-retake-prompt-time") ? "segment-retake-prompt-time" : _0x4d3dfa["classList"]?.['contains']("segment-retake-prompt-instruction") ? 'segment-retake-prompt-instruction' : '';
  if (_0x2e01b6 === "span" && _0x1975d8) {
    const _0x2662ee = String(_0x4d3dfa["getAttribute"]?.("data-retake-annotation-id") || '')["trim"]();
    if (!_0x2662ee) {
      _0x423c35['appendChild'](document["createTextNode"](String(_0x4d3dfa['textContent'] || '')));
      return;
    }
    const _0x405fc0 = document["createElement"]("span");
    _0x405fc0["className"] = _0x1975d8;
    _0x405fc0["setAttribute"]("contenteditable", "false");
    _0x405fc0['setAttribute']("data-retake-annotation-id", _0x2662ee);
    _0x405fc0["textContent"] = String(_0x4d3dfa["textContent"] || '');
    _0x423c35["appendChild"](_0x405fc0);
    return;
  }
  if (_0x2e01b6 === "span" && _0x4d3dfa['classList']?.['contains']("ref-pill")) {
    const _0x124f41 = String(_0x4d3dfa["getAttribute"]?.("data-label") || _0x4d3dfa['dataset']?.["label"] || _0x4d3dfa["textContent"] || '')['replace'](/[×✕✖]/g, '')["trim"]();
    const _0x560586 = String(_0x4d3dfa["getAttribute"]?.("data-node-id") || _0x4d3dfa["dataset"]?.["nodeId"] || '')["trim"]();
    const _0x4643c4 = String(_0x4d3dfa["getAttribute"]?.("data-ref-origin") || _0x4d3dfa["dataset"]?.["refOrigin"] || '')['trim']();
    const _0x3f155c = String(_0x4d3dfa["getAttribute"]?.("data-ref-label") || _0x4d3dfa["dataset"]?.["refLabel"] || '')["trim"]();
    const _0xc605a4 = String(_0x4d3dfa["getAttribute"]?.("data-asset-id") || _0x4d3dfa['dataset']?.["assetId"] || '')["trim"]();
    const _0x3247dd = String(_0x4d3dfa["getAttribute"]?.('data-asset-index') || _0x4d3dfa['dataset']?.["assetIndex"] || '')["trim"]();
    const _0x4b57db = String(_0x4d3dfa["getAttribute"]?.("data-ref-type") || _0x4d3dfa['dataset']?.['refType'] || '')["trim"]();
    const _0x5a0420 = String(_0x4d3dfa["getAttribute"]?.("data-ref-unresolved") || _0x4d3dfa["dataset"]?.["refUnresolved"] || '')["trim"]();
    const _0x36be62 = String(_0x4d3dfa["getAttribute"]?.("data-prompt-pill-kind") || _0x4d3dfa['dataset']?.["promptPillKind"] || '')["trim"]();
    const _0x1fba8f = String(_0x4d3dfa["getAttribute"]?.('data-story-voice-enabled') || _0x4d3dfa["dataset"]?.["storyVoiceEnabled"] || '')["trim"]();
    const _0x8e5846 = String(_0x4d3dfa["getAttribute"]?.("data-retake-annotation-id") || '')['trim']();
    const _0x4bcfb8 = document['createElement']("span");
    _0x4bcfb8['className'] = 'ref-pill';
    _0x4bcfb8["setAttribute"]("contenteditable", 'false');
    if (_0x124f41) {
      _0x4bcfb8["setAttribute"]("data-label", _0x124f41);
    }
    if (_0x560586) {
      _0x4bcfb8["setAttribute"]("data-node-id", _0x560586);
    }
    if (_0x4643c4 === "asset") {
      _0x4bcfb8["setAttribute"]('data-ref-origin', "asset");
    }
    if (_0x3f155c) {
      _0x4bcfb8['setAttribute']("data-ref-label", _0x3f155c);
    }
    if (_0xc605a4) {
      _0x4bcfb8['setAttribute']("data-asset-id", _0xc605a4);
    }
    if (_0x3247dd) {
      _0x4bcfb8['setAttribute']("data-asset-index", _0x3247dd);
    }
    if (_0x4b57db) {
      _0x4bcfb8['setAttribute']("data-ref-type", _0x4b57db);
    }
    if (_0x5a0420 === "true") {
      _0x4bcfb8['setAttribute']("data-ref-unresolved", "true");
    }
    if (_0x36be62 === "time") {
      _0x4bcfb8["setAttribute"]("data-prompt-pill-kind", "time");
    }
    if (_0x1fba8f === 'true') {
      _0x4bcfb8["setAttribute"]('data-story-voice-enabled', "true");
    }
    if (_0x8e5846) {
      _0x4bcfb8['setAttribute']("data-retake-annotation-id", _0x8e5846);
    }
    _0x4bcfb8["textContent"] = _0x124f41;
    _0x423c35["appendChild"](_0x4bcfb8);
    return;
  }
  if (_PROMPT_CONTAINER_TAGS["has"](_0x2e01b6)) {
    const _0x262cc4 = document['createElement'](_0x2e01b6);
    Array["from"](_0x4d3dfa['childNodes'] || [])['forEach'](_0x4b8936 => _appendSanitizedPromptNode(_0x262cc4, _0x4b8936));
    _0x423c35['appendChild'](_0x262cc4);
    return;
  }
  Array["from"](_0x4d3dfa["childNodes"] || [])["forEach"](_0x2c37a3 => _appendSanitizedPromptNode(_0x423c35, _0x2c37a3));
}
function _appendSanitizedRichTextNode(_0x50379a, _0x3d59cd) {
  const _0x90efe8 = Number(_0x3d59cd?.["nodeType"]);
  if (_0x90efe8 === 0x3) {
    _0x50379a["appendChild"](document['createTextNode'](String(_0x3d59cd?.["textContent"] || '')));
    return;
  }
  if (_0x90efe8 !== 0x1) {
    return;
  }
  const _0x34bb3a = String(_0x3d59cd?.['tagName'] || '')["toLowerCase"]();
  if (_DANGEROUS_HTML_TAGS['has'](_0x34bb3a)) {
    return;
  }
  if (!_RICH_TEXT_ALLOWED_TAGS["has"](_0x34bb3a)) {
    Array["from"](_0x3d59cd["childNodes"] || [])['forEach'](_0xa2ef7b => _appendSanitizedRichTextNode(_0x50379a, _0xa2ef7b));
    return;
  }
  const _0x233bf3 = document["createElement"](_0x34bb3a);
  _0x34bb3a !== 'br' && _0x34bb3a !== 'hr' && Array["from"](_0x3d59cd["childNodes"] || [])["forEach"](_0x4fd6e4 => _appendSanitizedRichTextNode(_0x233bf3, _0x4fd6e4));
  _0x50379a["appendChild"](_0x233bf3);
}
function _sanitizeHtmlWithDom(_0x50e303, _0x5334d3) {
  if (typeof document === "undefined" || typeof document["createElement"] !== "function") {
    throw new Error("Document API is unavailable");
  }
  const _0x1ed256 = document['createElement']('template');
  const _0x1ee1e2 = document["createElement"]("div");
  _0x1ed256["innerHTML"] = String(_0x50e303 ?? '');
  const _0x2260c7 = Array["from"](_0x1ed256['content']?.["childNodes"] || _0x1ed256["childNodes"] || []);
  _0x2260c7["forEach"](_0x1e945a => {
    if (_0x5334d3 === "prompt") {
      _appendSanitizedPromptNode(_0x1ee1e2, _0x1e945a);
      return;
    }
    _appendSanitizedRichTextNode(_0x1ee1e2, _0x1e945a);
  });
  return _0x1ee1e2["innerHTML"] || '';
}
export function sanitizePromptHtml(_0x162885) {
  const _0x486e1f = typeof _0x162885 === "string" ? _0x162885 : '';
  if (!_0x486e1f["trim"]()) {
    return '';
  }
  try {
    return _sanitizeHtmlWithDom(_0x486e1f, "prompt");
  } catch {
    return _sanitizePromptHtmlWithoutDom(_0x486e1f);
  }
}
export function sanitizeRichTextHtml(_0x50c811) {
  const _0x2ef798 = typeof _0x50c811 === "string" ? _0x50c811 : '';
  if (!_0x2ef798["trim"]()) {
    return '';
  }
  try {
    return _sanitizeHtmlWithDom(_0x2ef798, "richText");
  } catch {
    return _sanitizeRichTextHtmlWithoutDom(_0x2ef798);
  }
}
export function createElement(_0x1d3aac, _0x4a776f = {}, _0x943785 = null) {
  const _0x208f10 = document['createElement'](_0x1d3aac);
  Object["entries"](_0x4a776f)['forEach'](([_0x93bae3, _0x1e6f64]) => {
    if (_0x93bae3 === "className") {
      _0x208f10['className'] = _0x1e6f64;
    } else {
      if (_0x93bae3 === "dataset") {
        Object["entries"](_0x1e6f64)["forEach"](([_0x28a1bf, _0x12929b]) => {
          _0x208f10["dataset"][_0x28a1bf] = _0x12929b;
        });
      } else {
        _0x93bae3['startsWith']('on') && typeof _0x1e6f64 === 'function' ? _0x208f10['addEventListener'](_0x93bae3["slice"](0x2)['toLowerCase'](), _0x1e6f64) : _0x208f10["setAttribute"](_0x93bae3, _0x1e6f64);
      }
    }
  });
  if (_0x943785) {
    if (typeof _0x943785 === "string") {
      _0x208f10["textContent"] = _0x943785;
    } else {
      if (_0x943785 instanceof Node) {
        _0x208f10["appendChild"](_0x943785);
      } else {
        Array["isArray"](_0x943785) && _0x208f10["append"](..._0x943785["filter"](Boolean));
      }
    }
  }
  return _0x208f10;
}
export function closest(_0x1f29c6, _0x593c67) {
  if (!_0x1f29c6) {
    return null;
  }
  if (_0x1f29c6["matches"] && _0x1f29c6["matches"](_0x593c67)) {
    return _0x1f29c6;
  }
  return _0x1f29c6['closest'] ? _0x1f29c6["closest"](_0x593c67) : null;
}
export function addEvents(_0x5257f3, _0x3f20f3, _0x643b4a = ![]) {
  Object['entries'](_0x3f20f3)['forEach'](([_0x2d247a, _0x4edfc0]) => {
    _0x5257f3['addEventListener'](_0x2d247a, _0x4edfc0, _0x643b4a);
  });
}
export function removeEvents(_0x2fdd63, _0x3bc09c, _0x4b27e2 = ![]) {
  Object["entries"](_0x3bc09c)["forEach"](([_0x37395f, _0x4fa435]) => {
    _0x2fdd63["removeEventListener"](_0x37395f, _0x4fa435, _0x4b27e2);
  });
}
export function raf(_0x830ba) {
  return requestAnimationFrame(_0x830ba);
}
export function nextFrame(_0x1923aa) {
  return new Promise(_0x4a56ef => {
    requestAnimationFrame(() => {
      _0x1923aa();
      _0x4a56ef();
    });
  });
}
export function debounce(_0x1e344b, _0x366eba = 0x12c) {
  let _0x58e605 = null;
  return function (..._0x12bd06) {
    clearTimeout(_0x58e605);
    _0x58e605 = setTimeout(() => _0x1e344b["apply"](this, _0x12bd06), _0x366eba);
  };
}
export function throttle(_0x46f843, _0x30d834 = 0x64) {
  let _0x9edaee = ![];
  return function (..._0x26643c) {
    !_0x9edaee && (_0x46f843['apply'](this, _0x26643c), _0x9edaee = !![], setTimeout(() => _0x9edaee = ![], _0x30d834));
  };
}
export function rafSampleLatest(_0x539252) {
  let _0x1181bb = null;
  let _0x1e011c = null;
  let _0x3164a7 = null;
  function _0x46b378(..._0x5705e5) {
    _0x1e011c = _0x5705e5;
    _0x3164a7 = this;
    if (_0x1181bb !== null) {
      return;
    }
    _0x1181bb = requestAnimationFrame(() => {
      _0x1181bb = null;
      const _0x4e990c = _0x1e011c;
      const _0x117d5a = _0x3164a7;
      _0x1e011c = null;
      _0x3164a7 = null;
      if (!_0x4e990c) {
        return;
      }
      _0x539252["apply"](_0x117d5a, _0x4e990c);
    });
  }
  _0x46b378["cancel"] = () => {
    if (_0x1181bb !== null) {
      cancelAnimationFrame(_0x1181bb);
    }
    _0x1181bb = null;
    _0x1e011c = null;
    _0x3164a7 = null;
  };
  return _0x46b378;
}
export function waitForElement(_0x2ecf8e, _0x5c05fa = 0x1388) {
  return new Promise((_0x46796f, _0x34a32f) => {
    const _0x43f866 = document["querySelector"](_0x2ecf8e);
    if (_0x43f866) {
      _0x46796f(_0x43f866);
      return;
    }
    const _0x5cbd67 = new MutationObserver(() => {
      const _0x4d06f9 = document["querySelector"](_0x2ecf8e);
      _0x4d06f9 && (_0x5cbd67["disconnect"](), clearTimeout(_0x483136), _0x46796f(_0x4d06f9));
    });
    _0x5cbd67["observe"](document["body"], {
      'childList': !![],
      'subtree': !![]
    });
    const _0x483136 = setTimeout(() => {
      _0x5cbd67["disconnect"]();
      _0x34a32f(new Error("Element " + _0x2ecf8e + " not found within " + _0x5c05fa + 'ms'));
    }, _0x5c05fa);
  });
}
export function safeRemove(_0x324f07) {
  _0x324f07 && _0x324f07["parentNode"] && _0x324f07["parentNode"]["removeChild"](_0x324f07);
}
export function getViewportRect(_0x15e4fa) {
  const _0x2a1075 = _0x15e4fa['getBoundingClientRect']();
  return {
    'top': _0x2a1075["top"],
    'left': _0x2a1075['left'],
    'bottom': _0x2a1075["bottom"],
    'right': _0x2a1075['right'],
    'width': _0x2a1075["width"],
    'height': _0x2a1075["height"]
  };
}
export function isInViewport(_0x5455e0, _0x4201cb = 0x0) {
  const _0x2fd625 = _0x5455e0["getBoundingClientRect"]();
  return _0x2fd625['top'] >= -_0x4201cb && _0x2fd625["left"] >= -_0x4201cb && _0x2fd625["bottom"] <= window["innerHeight"] + _0x4201cb && _0x2fd625["right"] <= window["innerWidth"] + _0x4201cb;
}
export function getDisplayedMediaSizeFromNode(_0x405e89, _0x11a29c) {
  const _0x2de135 = String(_0x405e89 || '')['trim']();
  if (!_0x2de135) {
    return {
      'w': 0x0,
      'h': 0x0
    };
  }
  const _0x5867d1 = document["getElementById"](_0x2de135);
  if (!_0x5867d1) {
    return {
      'w': 0x0,
      'h': 0x0
    };
  }
  const _0x48403c = readNodeMediaMetricsDataset(_0x5867d1, _0x11a29c);
  if (_0x48403c) {
    return {
      'w': _0x48403c['w'],
      'h': _0x48403c['h']
    };
  }
  const _0x510798 = _0x5867d1['querySelector'](".img-node-preview") || _0x5867d1;
  const _0x39d7c1 = String(_0x11a29c || '');
  const _0x5605bc = _0x39d7c1 === "video" ? "video" : 'img';
  const _0x37294a = Array["from"](_0x510798["querySelectorAll"](_0x5605bc));
  let _0x198284 = 0x0;
  let _0x10f35b = 0x0;
  let _0x3b2ecb = -0x3b9aca00;
  for (const _0x12f0ad of _0x37294a) {
    const _0x3fe5c4 = window["getComputedStyle"](_0x12f0ad);
    if (!_0x3fe5c4) {
      continue;
    }
    if (_0x3fe5c4["display"] === "none") {
      continue;
    }
    if (_0x3fe5c4["visibility"] === "hidden") {
      continue;
    }
    if (Number(_0x3fe5c4["opacity"] || '1') <= 0.05) {
      continue;
    }
    if (_0x3fe5c4["pointerEvents"] === "none") {
      continue;
    }
    const _0x51f01d = _0x39d7c1 === "video" ? _0x12f0ad["videoWidth"] || 0x0 : _0x12f0ad["naturalWidth"] || 0x0;
    const _0x5e4b5a = _0x39d7c1 === "video" ? _0x12f0ad["videoHeight"] || 0x0 : _0x12f0ad["naturalHeight"] || 0x0;
    if (!_0x51f01d || !_0x5e4b5a) {
      continue;
    }
    const _0x39bde6 = Number(_0x3fe5c4['zIndex']);
    const _0x3c158d = Number['isFinite'](_0x39bde6) ? _0x39bde6 : 0x0;
    _0x3c158d >= _0x3b2ecb && (_0x3b2ecb = _0x3c158d, _0x198284 = _0x51f01d, _0x10f35b = _0x5e4b5a);
  }
  return {
    'w': _0x198284,
    'h': _0x10f35b
  };
}
export function getDisplayedVideoMetaFromNode(_0x4c93d9) {
  const _0x10fae1 = String(_0x4c93d9 || '')["trim"]();
  if (!_0x10fae1) {
    return {
      'src': '',
      'w': 0x0,
      'h': 0x0
    };
  }
  const _0x18b12e = document["getElementById"](_0x10fae1);
  if (!_0x18b12e) {
    return {
      'src': '',
      'w': 0x0,
      'h': 0x0
    };
  }
  const _0x205469 = readNodeMediaMetricsDataset(_0x18b12e, "video");
  if (_0x205469?.["src"]) {
    return {
      'src': _0x205469["src"],
      'w': _0x205469['w'],
      'h': _0x205469['h']
    };
  }
  const _0x5a09b9 = _0x18b12e["querySelector"](".img-node-preview") || _0x18b12e;
  const _0x573f47 = Array["from"](_0x5a09b9["querySelectorAll"]("video"));
  let _0x5badfe = '';
  let _0x2c57a3 = 0x0;
  let _0x713adb = 0x0;
  let _0x347e46 = -0x3b9aca00;
  for (const _0x4b72cf of _0x573f47) {
    const _0x36df1f = window['getComputedStyle'](_0x4b72cf);
    if (!_0x36df1f) {
      continue;
    }
    if (_0x36df1f['display'] === "none") {
      continue;
    }
    if (_0x36df1f['visibility'] === "hidden") {
      continue;
    }
    if (Number(_0x36df1f["opacity"] || '1') <= 0.05) {
      continue;
    }
    if (_0x36df1f["pointerEvents"] === "none") {
      continue;
    }
    const _0x484cd8 = String(_0x4b72cf["currentSrc"] || _0x4b72cf["src"] || '')['trim']();
    if (!_0x484cd8) {
      continue;
    }
    const _0x1d507c = Number(_0x4b72cf["videoWidth"] || 0x0);
    const _0x4c18d8 = Number(_0x4b72cf["videoHeight"] || 0x0);
    const _0x4adac6 = Number(_0x36df1f["zIndex"]);
    const _0x3956bb = Number["isFinite"](_0x4adac6) ? _0x4adac6 : 0x0;
    _0x3956bb >= _0x347e46 && (_0x347e46 = _0x3956bb, _0x5badfe = _0x484cd8, _0x2c57a3 = Number['isFinite'](_0x1d507c) ? _0x1d507c : 0x0, _0x713adb = Number["isFinite"](_0x4c18d8) ? _0x4c18d8 : 0x0);
  }
  return {
    'src': _0x5badfe,
    'w': _0x2c57a3,
    'h': _0x713adb
  };
}