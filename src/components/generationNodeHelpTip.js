import { RH_AUDIO_ADVANCED_VOICE_CLONE_MODEL_ID, RH_AUDIO_ADVANCED_VOICE_CLONE_RUNNINGHUB_MODEL_ID, getModelManifest } from '../manifests/index.js';
import { RH_AUDIO_ADVANCED_VOICE_CLONE_HELP_TOOLTIP } from '../manifests/audio/runninghub/runningHubAudioAdvancedVoiceCloneManifest.js';
import { t } from '../i18n/index.js';
import { translateManifestText } from '../i18n/manifestText.js';
import { createPromptPresetTriggerController } from './promptPresetTrigger.js';
export const ADVANCED_VOICE_CLONE_HELP_TOOLTIP = RH_AUDIO_ADVANCED_VOICE_CLONE_HELP_TOOLTIP;
const HELP_HIGHLIGHT_PATTERN = /\[\[red:([^\]]+)\]\]/g;
const GENERATION_NODE_HELP_ICON_HTML = "<span class=\"generation-node-help-tip-icon\" aria-hidden=\"true\"></span>";
const ADVANCED_VOICE_CLONE_ALIASES = [RH_AUDIO_ADVANCED_VOICE_CLONE_MODEL_ID, RH_AUDIO_ADVANCED_VOICE_CLONE_RUNNINGHUB_MODEL_ID, ...(getModelManifest(RH_AUDIO_ADVANCED_VOICE_CLONE_MODEL_ID)?.["subscriptionAliases"] || []), '进阶声音克隆'];
const GENERATION_NODE_HELP_TOOLTIP_MAP = Object["fromEntries"](ADVANCED_VOICE_CLONE_ALIASES["map"](_0x20455e => ["audio:" + String(_0x20455e || '')["trim"](), ADVANCED_VOICE_CLONE_HELP_TOOLTIP])["filter"](([_0x19f979]) => _0x19f979 !== "audio:"));
function helpTipText(_0x2fff9e, _0x3a77b9 = {}) {
  return t("generationNodeHelpTip." + _0x2fff9e, _0x3a77b9);
}
function getHelpConditionFieldValue(_0x27546b = {}, _0x2aec8d = '') {
  const _0x1ebcc3 = String(_0x2aec8d || '')["trim"]();
  if (!_0x1ebcc3) {
    return undefined;
  }
  const _0x4f92be = _0x27546b?.["generationParams"] && typeof _0x27546b["generationParams"] === 'object' ? _0x27546b["generationParams"] : {};
  if (Object["prototype"]['hasOwnProperty']['call'](_0x4f92be, _0x1ebcc3)) {
    return _0x4f92be[_0x1ebcc3];
  }
  if (Object['prototype']['hasOwnProperty']['call'](_0x27546b || {}, _0x1ebcc3)) {
    return _0x27546b[_0x1ebcc3];
  }
  const _0x46a3ab = _0x1ebcc3["split"]('.')["filter"](Boolean);
  if (_0x46a3ab['length'] <= 0x1) {
    return undefined;
  }
  let _0x638fdf = _0x27546b;
  for (const _0x351ad0 of _0x46a3ab) {
    if (!_0x638fdf || typeof _0x638fdf !== 'object') {
      return undefined;
    }
    _0x638fdf = _0x638fdf[_0x351ad0];
  }
  return _0x638fdf;
}
function helpConditionMatches(_0xaca6eb, _0x48ecb9 = {}) {
  if (!_0xaca6eb || typeof _0xaca6eb !== "object") {
    return ![];
  }
  if (Array["isArray"](_0xaca6eb["any"])) {
    return _0xaca6eb["any"]["some"](_0xf20318 => helpConditionMatches(_0xf20318, _0x48ecb9));
  }
  if (Array["isArray"](_0xaca6eb["all"])) {
    return _0xaca6eb['all']["every"](_0x5aaca3 => helpConditionMatches(_0x5aaca3, _0x48ecb9));
  }
  const _0x36e571 = String(_0xaca6eb["field"] || '')["trim"]();
  if (!_0x36e571) {
    return ![];
  }
  const _0x5643b8 = getHelpConditionFieldValue(_0x48ecb9, _0x36e571);
  const _0x31aa94 = Array["isArray"](_0xaca6eb["values"]) ? _0xaca6eb["values"] : Object['prototype']['hasOwnProperty']["call"](_0xaca6eb, "value") ? [_0xaca6eb['value']] : [];
  if (_0x31aa94['length'] === 0x0) {
    return Boolean(_0x5643b8);
  }
  return _0x31aa94['some'](_0xf22c38 => _0x5643b8 === _0xf22c38 || String(_0x5643b8 ?? '') === String(_0xf22c38 ?? ''));
}
function resolveManifestHelpText(_0x35e3c9, _0x351417 = {}) {
  const _0x235e0f = _0x35e3c9?.["help"];
  if (!_0x235e0f || typeof _0x235e0f !== "object") {
    return '';
  }
  const _0x5d42b3 = Array['isArray'](_0x235e0f["variants"]) ? _0x235e0f["variants"] : [];
  for (const _0x117117 of _0x5d42b3) {
    if (_0x117117 && typeof _0x117117 === "object" && helpConditionMatches(_0x117117["when"], _0x351417)) {
      const _0x3bb02b = String(_0x117117['tooltip'] || _0x117117["text"] || '')["trim"]();
      if (_0x3bb02b) {
        return translateManifestText(_0x3bb02b);
      }
    }
  }
  const _0x31031a = String(_0x235e0f["tooltip"] || _0x235e0f["text"] || '')["trim"]();
  return _0x31031a ? translateManifestText(_0x31031a) : '';
}
export function getGenerationNodeHelpTooltip({
  kind = '',
  key = '',
  model = '',
  label = '',
  nodeData = {}
} = {}) {
  const _0x2ecea8 = String(kind || '')["trim"]();
  const _0x4028f7 = [key, model, label]["map"](_0x33edeb => String(_0x33edeb || '')["trim"]())['filter'](Boolean);
  for (const _0x6f73ac of _0x4028f7) {
    const _0x564183 = getModelManifest(_0x6f73ac);
    const _0x471900 = resolveManifestHelpText(_0x564183, nodeData);
    if (_0x471900) {
      return _0x471900;
    }
    const _0x3d8149 = _0x2ecea8 ? _0x2ecea8 + ':' + _0x6f73ac : '';
    const _0x8e4fc = _0x3d8149 && GENERATION_NODE_HELP_TOOLTIP_MAP[_0x3d8149] || GENERATION_NODE_HELP_TOOLTIP_MAP[_0x6f73ac] || '';
    if (_0x8e4fc) {
      return translateManifestText(_0x8e4fc);
    }
  }
  return '';
}
export function stripGenerationNodeHelpMarkup(_0x336391 = '') {
  HELP_HIGHLIGHT_PATTERN['lastIndex'] = 0x0;
  return String(_0x336391 || '')['replace'](HELP_HIGHLIGHT_PATTERN, '$1');
}
export function createGenerationNodeHelpTipController({
  panel: _0x47c1f7,
  getHelpText: _0xa51d4a,
  ariaLabel = helpTipText('ariaLabel')
} = {}) {
  let _0x24602a = null;
  let _0x1d46b3 = null;
  let _0x310f88 = null;
  const _0x567f05 = () => typeof _0xa51d4a === 'function' ? String(_0xa51d4a() || '') : '';
  const _0x2322d1 = (_0x74a59b, _0x448527) => {
    const _0x358229 = String(_0x448527 || '');
    HELP_HIGHLIGHT_PATTERN["lastIndex"] = 0x0;
    let _0x33dc8d = 0x0;
    let _0xb77618 = HELP_HIGHLIGHT_PATTERN["exec"](_0x358229);
    while (_0xb77618) {
      _0xb77618["index"] > _0x33dc8d && _0x74a59b["appendChild"](document['createTextNode'](_0x358229["slice"](_0x33dc8d, _0xb77618['index'])));
      const _0x30e6c5 = document['createElement']("span");
      _0x30e6c5["className"] = "generation-node-help-emphasis";
      _0x30e6c5["textContent"] = _0xb77618[0x1];
      _0x74a59b["appendChild"](_0x30e6c5);
      _0x33dc8d = _0xb77618['index'] + _0xb77618[0x0]['length'];
      _0xb77618 = HELP_HIGHLIGHT_PATTERN["exec"](_0x358229);
    }
    _0x33dc8d < _0x358229["length"] && _0x74a59b["appendChild"](document["createTextNode"](_0x358229["slice"](_0x33dc8d)));
  };
  const _0x39156d = (_0x24855c, _0x5022b1, _0x36eb72 = '') => {
    const _0x15f824 = document['createElement']("div");
    if (_0x36eb72) {
      _0x15f824["className"] = _0x36eb72;
    }
    _0x2322d1(_0x15f824, _0x5022b1);
    _0x24855c["appendChild"](_0x15f824);
    return _0x15f824;
  };
  const _0x65346 = (_0x455337, _0x5229b1, _0x3e47ad) => {
    const _0x59dbc0 = document["createElement"]("div");
    _0x59dbc0["className"] = "generation-node-help-example-line";
    const _0x554671 = document['createElement']("span");
    _0x554671["className"] = "generation-node-help-ref-pill";
    _0x554671["textContent"] = _0x5229b1;
    _0x59dbc0["appendChild"](_0x554671);
    _0x59dbc0['appendChild'](document["createTextNode"]('\x20' + _0x3e47ad));
    _0x455337["appendChild"](_0x59dbc0);
  };
  const _0x492406 = (_0x239e89, _0x16cdce) => {
    String(_0x16cdce || '')['split']('\x0a')['forEach']((_0x4c2ab5, _0x126011) => {
      _0x39156d(_0x239e89, _0x4c2ab5, _0x126011 === 0x0 && /用法$/['test'](String(_0x4c2ab5 || '')["trim"]()) ? "generation-node-help-title" : '');
    });
  };
  const _0x49bc85 = (_0x2b41a9 = '') => String(_0x2b41a9 || '')["trim"]()['replace'](/^\|/, '')["replace"](/\|$/, '')["split"]('|')["map"](_0x5cd5e1 => _0x5cd5e1["trim"]()["replace"](/^`|`$/g, ''));
  const _0x185856 = (_0x2082f4 = '') => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/["test"](String(_0x2082f4 || ''));
  const _0xe2a7bf = (_0x56b9fd, _0x3cb0eb) => {
    const _0x5b670c = String(_0x3cb0eb || '')["split"]('\x0a');
    const _0x4c04a3 = _0x5b670c['findIndex']((_0x15bb57, _0x1ed14d) => {
      if (_0x1ed14d === 0x0 || !_0x185856(_0x15bb57)) {
        return ![];
      }
      return String(_0x5b670c[_0x1ed14d - 0x1] || '')['includes']('|');
    });
    if (_0x4c04a3 < 0x1) {
      return ![];
    }
    _0x5b670c['slice'](0x0, _0x4c04a3 - 0x1)["forEach"]((_0x144f85, _0xf56feb) => {
      const _0x33c403 = String(_0x144f85 || '')["trim"]();
      if (!_0x33c403) {
        return;
      }
      _0x39156d(_0x56b9fd, _0x33c403, _0xf56feb === 0x0 && /用法说明$/["test"](_0x33c403) ? "generation-node-help-title" : '');
    });
    const _0x353bdf = document["createElement"]("table");
    _0x353bdf["className"] = "generation-node-help-table";
    const _0xa8409c = document["createElement"]("thead");
    const _0x5204eb = document["createElement"]('tr');
    _0x49bc85(_0x5b670c[_0x4c04a3 - 0x1])['forEach'](_0x6c1b06 => {
      const _0x211020 = document["createElement"]('th');
      _0x2322d1(_0x211020, _0x6c1b06);
      _0x5204eb['appendChild'](_0x211020);
    });
    _0xa8409c["appendChild"](_0x5204eb);
    _0x353bdf['appendChild'](_0xa8409c);
    const _0x4895df = document["createElement"]("tbody");
    _0x5b670c["slice"](_0x4c04a3 + 0x1)['forEach'](_0x1aff98 => {
      if (!String(_0x1aff98 || '')["includes"]('|')) {
        return;
      }
      const _0x57e8ad = document["createElement"]('tr');
      _0x49bc85(_0x1aff98)["forEach"](_0x2227e1 => {
        const _0x4cd246 = document["createElement"]('td');
        _0x2322d1(_0x4cd246, _0x2227e1);
        _0x57e8ad['appendChild'](_0x4cd246);
      });
      _0x4895df["appendChild"](_0x57e8ad);
    });
    _0x353bdf['appendChild'](_0x4895df);
    _0x56b9fd["appendChild"](_0x353bdf);
    return !![];
  };
  const _0x8f304c = (_0x26b4d4, _0x35e7fc) => {
    _0x26b4d4['textContent'] = '';
    _0x26b4d4["classList"]['remove']("has-table");
    if (_0xe2a7bf(_0x26b4d4, _0x35e7fc)) {
      _0x26b4d4["classList"]['add']("has-table");
      return;
    }
    if (_0x35e7fc !== ADVANCED_VOICE_CLONE_HELP_TOOLTIP) {
      _0x492406(_0x26b4d4, _0x35e7fc);
      return;
    }
    _0x39156d(_0x26b4d4, helpTipText("advancedVoiceClone.title"), "generation-node-help-title");
    _0x39156d(_0x26b4d4, helpTipText("advancedVoiceClone.duration"));
    _0x39156d(_0x26b4d4, helpTipText('advancedVoiceClone.noAudio'));
    _0x39156d(_0x26b4d4, helpTipText('advancedVoiceClone.promptExample'), "generation-node-help-muted-line");
    _0x39156d(_0x26b4d4, helpTipText("advancedVoiceClone.oneAudio"));
    _0x39156d(_0x26b4d4, helpTipText("advancedVoiceClone.twoAudio"));
    _0x39156d(_0x26b4d4, helpTipText("advancedVoiceClone.examples"));
    _0x65346(_0x26b4d4, helpTipText('advancedVoiceClone.audio1'), helpTipText("advancedVoiceClone.exampleSpeaker1"));
    _0x65346(_0x26b4d4, helpTipText("advancedVoiceClone.audio2"), helpTipText('advancedVoiceClone.exampleSpeaker2'));
    return;
    _0x39156d(_0x26b4d4, '进阶声音克隆用法', "generation-node-help-title");
    _0x39156d(_0x26b4d4, "支持 [[red:3~15 秒音频]]");
    _0x39156d(_0x26b4d4, "[[red:无音频入参]]时 TTS语音 根据提示词生成随机音色");
    _0x39156d(_0x26b4d4, "例：今晚月色真好", 'generation-node-help-muted-line');
    _0x39156d(_0x26b4d4, "[[red:1个音频入参]]时 克隆语音");
    _0x39156d(_0x26b4d4, "[[red:2个音频入参]]时 多人克隆音色对话");
    _0x39156d(_0x26b4d4, '例：');
    _0x65346(_0x26b4d4, "@音频1", "你今晚回家吗");
    _0x65346(_0x26b4d4, "@音频2", '不回了加班要忙到很晚');
  };
  const _0x207d13 = () => {
    if (!_0x47c1f7) {
      return null;
    }
    if (_0x24602a && _0x24602a['parentNode'] === _0x47c1f7) {
      return _0x24602a;
    }
    const _0x49f5a8 = _0x47c1f7["querySelector"]('.generation-node-help-tip');
    if (_0x49f5a8) {
      _0x24602a = _0x49f5a8;
      return _0x49f5a8;
    }
    const _0x1c1a7d = document["createElement"]("button");
    _0x1c1a7d['type'] = "button";
    _0x1c1a7d["className"] = 'rh-tip\x20generation-node-help-tip';
    _0x1c1a7d["innerHTML"] = GENERATION_NODE_HELP_ICON_HTML;
    _0x1c1a7d["setAttribute"]("aria-label", ariaLabel);
    _0x1c1a7d['addEventListener']('mouseenter', _0x3a622a);
    _0x1c1a7d['addEventListener']("mouseleave", _0x5ce3dc);
    _0x1c1a7d["addEventListener"]("focus", _0x3a622a);
    _0x1c1a7d["addEventListener"]("blur", _0x5ce3dc);
    _0x1c1a7d["addEventListener"]("click", _0x179229 => {
      _0x179229["preventDefault"]();
      _0x179229["stopPropagation"]();
    });
    _0x1c1a7d["addEventListener"]('pointerdown', _0x4b9038 => {
      _0x4b9038['preventDefault']();
      _0x4b9038['stopPropagation']();
    });
    _0x47c1f7['appendChild'](_0x1c1a7d);
    _0x24602a = _0x1c1a7d;
    return _0x1c1a7d;
  };
  const _0x3cc47f = () => {
    if (_0x1d46b3?.["isConnected"]) {
      return _0x1d46b3;
    }
    const _0x4402e4 = document['createElement']("div");
    _0x4402e4["className"] = "generation-node-help-tooltip-portal";
    _0x4402e4["setAttribute"]("role", "tooltip");
    document['body']["appendChild"](_0x4402e4);
    _0x1d46b3 = _0x4402e4;
    return _0x4402e4;
  };
  const _0x451386 = () => {
    if (!_0x24602a || !_0x1d46b3) {
      return;
    }
    const _0x27a507 = 0xc;
    const _0x3024da = _0x24602a["getBoundingClientRect"]();
    const _0xc1768f = _0x1d46b3["offsetWidth"] || 0x154;
    const _0x5b256d = _0x1d46b3["offsetHeight"] || 0x0;
    const _0x1333d = Math["max"](_0x27a507, window["innerWidth"] - _0xc1768f - _0x27a507);
    const _0x18ae9c = _0x3024da["right"] - _0xc1768f + 0x6;
    const _0x4e95f8 = Math["min"](Math['max'](_0x27a507, _0x18ae9c), _0x1333d);
    const _0x51489d = _0x3024da['top'] - _0x5b256d - _0x27a507;
    const _0x517f38 = _0x3024da["bottom"] + _0x27a507;
    const _0xdd0f47 = _0x51489d < _0x27a507;
    const _0x57898d = _0xdd0f47 ? _0x517f38 : _0x51489d;
    const _0x517c22 = Math['min'](Math["max"](_0x3024da["left"] + _0x3024da["width"] / 0x2 - _0x4e95f8, 0x10), _0xc1768f - 0x10);
    _0x1d46b3['style']["left"] = _0x4e95f8 + 'px';
    _0x1d46b3["style"]['top'] = _0x57898d + 'px';
    _0x1d46b3['classList']['toggle']("is-below", _0xdd0f47);
    _0x1d46b3["style"]["setProperty"]("--generation-node-help-tooltip-arrow-left", _0x517c22 + 'px');
  };
  const _0x3a622a = () => {
    const _0x128733 = _0x567f05();
    if (!_0x128733 || _0x24602a?.["classList"]["contains"]("is-hidden")) {
      return;
    }
    const _0x18467a = _0x3cc47f();
    _0x8f304c(_0x18467a, _0x128733);
    _0x18467a["classList"]["add"]("is-open");
    _0x451386();
    !_0x310f88 && (_0x310f88 = () => _0x451386(), window["addEventListener"]("scroll", _0x310f88, !![]), window['addEventListener']("resize", _0x310f88));
  };
  const _0x5ce3dc = () => {
    _0x1d46b3?.["classList"]["remove"]("is-open");
    if (!_0x310f88) {
      return;
    }
    window["removeEventListener"]('scroll', _0x310f88, !![]);
    window["removeEventListener"]("resize", _0x310f88);
    _0x310f88 = null;
  };
  const _0x344dd3 = () => {
    const _0x5b26ad = _0x24602a || _0x207d13();
    if (!_0x5b26ad) {
      return;
    }
    const _0x1dd4f4 = _0x567f05();
    const _0x2f3bcd = Boolean(_0x1dd4f4);
    _0x5b26ad["classList"]["toggle"]('is-hidden', !_0x2f3bcd);
    _0x2f3bcd ? _0x5b26ad["setAttribute"]('data-tooltip', stripGenerationNodeHelpMarkup(_0x1dd4f4)) : _0x5b26ad['removeAttribute']("data-tooltip");
    _0x47c1f7?.["classList"]["toggle"]('has-generation-node-help-tip', _0x2f3bcd);
    if (!_0x2f3bcd) {
      _0x5ce3dc();
    }
  };
  const _0x4a5056 = () => {
    _0x5ce3dc();
    _0x1d46b3?.["remove"]();
    _0x1d46b3 = null;
  };
  return {
    'sync': _0x344dd3,
    'remove': _0x4a5056
  };
}
export function attachGenerationNodeHelpTip(_0x48fa52, {
  panel: _0x2db1ec,
  kind: _0x2f0a83,
  getKey: _0x194dfc,
  getModel = _0x194dfc,
  getLabel: _0x41e367,
  getNodeData: _0x327fc5,
  ariaLabel: _0x9d2924
} = {}) {
  if (!_0x48fa52 || !_0x2db1ec) {
    return null;
  }
  _0x48fa52["_generationNodeHelpTip"] = createGenerationNodeHelpTipController({
    'panel': _0x2db1ec,
    'getHelpText': () => getGenerationNodeHelpTooltip({
      'kind': _0x2f0a83,
      'key': typeof _0x194dfc === "function" ? _0x194dfc() : '',
      'model': typeof getModel === 'function' ? getModel() : '',
      'label': typeof _0x41e367 === "function" ? _0x41e367() : '',
      'nodeData': typeof _0x327fc5 === 'function' ? _0x327fc5() : {}
    }),
    'ariaLabel': _0x9d2924
  });
  _0x48fa52["_generationNodeHelpTip"]["sync"]();
  return _0x48fa52['_generationNodeHelpTip'];
}
export function attachGenerationNodePromptTools(_0x28b3cf, _0x1b25c1 = {}) {
  if (!_0x28b3cf || !_0x1b25c1?.["panel"]) {
    return null;
  }
  _0x28b3cf["_promptPresetTrigger"]?.['remove']?.();
  _0x28b3cf["_promptPresetTrigger"] = createPromptPresetTriggerController({
    'panel': _0x1b25c1["panel"],
    'getPromptEl': () => _0x28b3cf["promptEl"],
    'getNodeType': () => _0x28b3cf["_data"]?.["type"],
    'getNodeId': () => _0x28b3cf["nodeId"],
    'onGenerate': (_0x418f9c, _0x123812) => _0x28b3cf['_onGenerate']?.(_0x418f9c, _0x123812)
  });
  return attachGenerationNodeHelpTip(_0x28b3cf, _0x1b25c1);
}