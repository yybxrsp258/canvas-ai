import { normalizeStoryCharacterVoiceReference } from './storyCharacterVoice.js';
import { buildStoryClipFrameMentionCandidates, resolveStoryClipFrameMentionRef, STORY_CLIP_FRAME_MENTION_PREFIX } from './storyClipFrames.js';
import { deriveStoryEpisodeAssetSummary } from './storyPlanningData.js';
import { protectStoryPromptPills } from './storyClipPromptReferences.js';
import { getStoryReplicationCharacterDisplayLabel } from './storyReplicationPromptReferences.js';
const STORY_ASSET_NODE_PREFIX = "story-asset:";
const STORY_CHARACTER_VOICE_NODE_PREFIX = "story-character-voice:";
const STORY_TIME_MENTION_ASSET_ID = "story-meta:time";
const STORY_TIME_ICON_SVG = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"13\" r=\"8\"></circle><path d=\"M12 9v4l2.5 1.5\"></path><path d=\"M9 2h6\"></path><path d=\"M12 2v3\"></path></svg>";
function normalizeText(_0x4694a6) {
  return String(_0x4694a6 || '')["trim"]();
}
function escapeHtml(_0x2a2909) {
  return String(_0x2a2909 ?? '')['replace'](/&/g, "&amp;")["replace"](/</g, "&lt;")['replace'](/>/g, '&gt;')["replace"](/"/g, "&quot;")["replace"](/'/g, "&#39;");
}
function escapeRegExp(_0xb0ae8f) {
  return String(_0xb0ae8f || '')["replace"](/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const STORY_H3_LITERAL_TAG_PATTERN = /(?:<|&(?:amp;)*(?:lt;|#0*60;|#x0*3c;)|＜)\s*((?:\/\s*)?d|scenetrans|cutoff|(?:Subject|Picture|Video|Audio)\s+\d+)\s*(?:>|&(?:amp;)*(?:gt;|#0*62;|#x0*3e;)|＞)/giu;
function normalizeStoryH3LiteralTag(_0xc11edd = '') {
  const _0x4434b1 = normalizeText(_0xc11edd)["replace"](/\s+/gu, '\x20');
  if (/^\/\s*d$/iu['test'](_0x4434b1)) {
    return "</d>";
  }
  if (/^d$/iu["test"](_0x4434b1)) {
    return "<d>";
  }
  if (/^(scenetrans|cutoff)$/iu["test"](_0x4434b1)) {
    return '<' + _0x4434b1["toLowerCase"]() + '>';
  }
  const _0x1fcf84 = _0x4434b1["match"](/^(Subject|Picture|Video|Audio)\s+(\d+)$/iu);
  if (!_0x1fcf84) {
    return '';
  }
  const _0x105751 = '' + _0x1fcf84[0x1][0x0]['toUpperCase']() + _0x1fcf84[0x1]["slice"](0x1)["toLowerCase"]();
  return '<' + _0x105751 + '\x20' + _0x1fcf84[0x2] + '>';
}
function protectStoryH3LiteralTags(_0x194eba = '') {
  const _0x1d38c2 = [];
  const _0x9eb2bc = String(_0x194eba || '')['replace'](STORY_H3_LITERAL_TAG_PATTERN, (_0x441f2f, _0x575627) => {
    const _0xec7674 = normalizeStoryH3LiteralTag(_0x575627);
    if (!_0xec7674) {
      return _0x441f2f;
    }
    const _0xb07b59 = 'story-h3-tag-' + _0x1d38c2['length'] + '';
    _0x1d38c2["push"]({
      'token': _0xb07b59,
      'tag': _0xec7674
    });
    return _0xb07b59;
  });
  return {
    'source': _0x9eb2bc,
    'restore': (_0xb59d8c = '') => _0x1d38c2["reduce"]((_0x398c23, {
      token: _0x31c9ae,
      tag: _0xd0597f
    }) => _0x398c23["split"](_0x31c9ae)["join"](escapeHtml(_0xd0597f)), String(_0xb59d8c || ''))
  };
}
export function normalizeStoryClipTimeLabel(_0x175a42, _0x2cadf8 = "3.0s") {
  const _0x21c59b = String(_0x175a42 ?? '')['match'](/-?\d+(?:\.\d+)?/);
  const _0x17bdc = Number(_0x21c59b?.[0x0]);
  if (!Number["isFinite"](_0x17bdc) || _0x17bdc <= 0x0) {
    return _0x2cadf8;
  }
  const _0x3d9098 = Math['min'](0x3e7, Math["max"](0.1, _0x17bdc));
  return _0x3d9098["toFixed"](0x1) + 's';
}
function getStoryAssetMentionAppearance(_0x1a7486 = {}) {
  const _0x2b2554 = Array['isArray'](_0x1a7486['appearances']) ? _0x1a7486["appearances"] : [];
  const _0x4e4b54 = normalizeText(_0x1a7486["baseAppearanceId"]);
  return _0x2b2554["find"](_0x2307f7 => _0x4e4b54 && normalizeText(_0x2307f7?.['id']) === _0x4e4b54) || _0x2b2554['find'](_0x11800a => normalizeText(_0x11800a?.["name"]) === "基础形象") || _0x2b2554[0x0] || null;
}
function buildStoryAssetMentionId(_0x5330e8 = '', _0x5ec11a = '') {
  return '' + STORY_ASSET_NODE_PREFIX + encodeURIComponent(normalizeText(_0x5330e8)) + ':' + encodeURIComponent(normalizeText(_0x5ec11a) || '__asset__');
}
function parseStoryAssetMentionId(_0x361e95 = '') {
  const _0x258fe8 = normalizeText(_0x361e95);
  if (!_0x258fe8["startsWith"](STORY_ASSET_NODE_PREFIX)) {
    return null;
  }
  const [_0x636569 = '', _0x3fa4d6 = ''] = _0x258fe8["slice"](STORY_ASSET_NODE_PREFIX["length"])['split'](':');
  try {
    const _0x5bd354 = decodeURIComponent(_0x636569);
    const _0x4e0dc6 = decodeURIComponent(_0x3fa4d6);
    return _0x5bd354 ? {
      'assetId': _0x5bd354,
      'appearanceId': _0x4e0dc6
    } : null;
  } catch {
    return null;
  }
}
function matchesQuery(_0x41c926 = {}, _0x26b39e = '') {
  const _0x598998 = normalizeText(_0x26b39e)["replace"](/^@+/, '')["toLowerCase"]();
  if (!_0x598998) {
    return !![];
  }
  const _0x48b4d1 = Array["isArray"](_0x41c926['mentionVariants']) ? _0x41c926["mentionVariants"] : [];
  return [_0x41c926['label'], _0x41c926['subtitle'], _0x41c926['pillLabel'], _0x41c926['assetName'], _0x41c926["type"], ..._0x48b4d1["flatMap"](_0x38b2ff => [_0x38b2ff?.["label"], _0x38b2ff?.["subtitle"], _0x38b2ff?.["pillLabel"]])]["map"](_0x4eec29 => normalizeText(_0x4eec29)['toLowerCase']())["some"](_0x124824 => _0x124824["includes"](_0x598998));
}
function getStoryAssetMentionSection(_0x2b4df8) {
  if (_0x2b4df8 === "scene") {
    return '场景';
  }
  if (_0x2b4df8 === "prop") {
    return '道具';
  }
  return '角色';
}
function getStoryAssetMentionAppearances(_0x34e3b2 = {}) {
  const _0x5a5e87 = Array['isArray'](_0x34e3b2['appearances']) ? _0x34e3b2["appearances"]['filter'](Boolean) : [];
  const _0x11f2dd = getStoryAssetMentionAppearance(_0x34e3b2);
  if (_0x34e3b2["kind"] !== "character") {
    return _0x11f2dd ? [_0x11f2dd] : [];
  }
  if (!_0x5a5e87["length"]) {
    return _0x11f2dd ? [_0x11f2dd] : [];
  }
  return [..._0x5a5e87]["sort"]((_0x3eeb5f, _0x32f9f2) => Number(_0x32f9f2 === _0x11f2dd) - Number(_0x3eeb5f === _0x11f2dd));
}
export function getStoryEpisodeMentionAssets(_0x20b370 = [], _0x4598dc = null) {
  const _0x2b400d = (Array["isArray"](_0x20b370) ? _0x20b370 : [])["filter"](_0x59cb10 => _0x59cb10 && ["character", "scene", "prop"]["includes"](_0x59cb10["kind"]));
  const _0x406c86 = deriveStoryEpisodeAssetSummary(_0x4598dc, _0x2b400d);
  return _0x406c86["assetIds"]['length'] ? _0x406c86["assets"] : _0x2b400d;
}
function buildStoryClipAssetMentionCandidate({
  asset: _0x12031d,
  appearance = null,
  allowAssetImageFallback = ![],
  displayAssets = []
} = {}) {
  const _0x13a303 = normalizeText(_0x12031d?.['name']) || "本集素材";
  const _0xe7415d = normalizeText(appearance?.['id']);
  const _0x437aaa = normalizeText(appearance?.["name"]) || "基础形象";
  const _0x9ff8c1 = normalizeText(appearance?.['imageUrl'] || (allowAssetImageFallback ? _0x12031d?.['imageUrl'] : ''));
  return {
    'origin': "asset",
    'menuDirect': !![],
    'suppressTooltip': !![],
    'assetId': buildStoryAssetMentionId(_0x12031d?.['id'], _0xe7415d),
    'assetIndex': 0x0,
    'type': 'image',
    'label': _0x13a303,
    'subtitle': _0x437aaa,
    'pillLabel': getStoryReplicationCharacterDisplayLabel(_0x12031d, appearance, displayAssets) || _0x13a303 + " · " + _0x437aaa,
    'sourcePillLabel': _0x13a303 + " · " + _0x437aaa,
    'thumbUrl': _0x9ff8c1,
    'iconType': "image",
    'storyAssetId': normalizeText(_0x12031d?.['id']),
    'storyAppearanceId': _0xe7415d,
    'storyAssetKind': normalizeText(_0x12031d?.['kind']),
    'menuPage': "assets",
    'menuGroup': "本集素材",
    'menuSection': getStoryAssetMentionSection(_0x12031d?.["kind"]),
    'assetName': "本集素材",
    'missingAsset': !_0x9ff8c1
  };
}
export function buildStoryClipMentionCandidates({
  assets = [],
  episode = null,
  libraryCandidates = [],
  clipFrames = [],
  query = '',
  includeTime = ![],
  includeClipFrames = ![],
  defaultDuration = '3.0s'
} = {}) {
  const _0x2c3677 = new Map([["character", 0x0], ["scene", 0x1], ['prop', 0x2]]);
  const _0x5d6cff = [...getStoryEpisodeMentionAssets(assets, episode)]["sort"]((_0x2483f7, _0xf0bf92) => (_0x2c3677["get"](_0x2483f7?.["kind"]) ?? 0x9) - (_0x2c3677['get'](_0xf0bf92?.["kind"]) ?? 0x9))["map"](_0x2e4dee => {
    const _0x3132d0 = getStoryAssetMentionAppearances(_0x2e4dee);
    const _0x686831 = _0x3132d0["length"] ? _0x3132d0["map"](_0x515e95 => buildStoryClipAssetMentionCandidate({
      'asset': _0x2e4dee,
      'appearance': _0x515e95,
      'displayAssets': episode?.["replication"] ? assets : []
    })) : [buildStoryClipAssetMentionCandidate({
      'asset': _0x2e4dee,
      'appearance': null,
      'allowAssetImageFallback': !![],
      'displayAssets': episode?.["replication"] ? assets : []
    })];
    const _0x3bdda9 = normalizeText(query)["replace"](/^@+/, '')["toLowerCase"]();
    const _0x4069e0 = _0x3bdda9 ? _0x686831["findIndex"](_0x222f87 => [_0x222f87["subtitle"], _0x222f87["pillLabel"]]["some"](_0x26e945 => normalizeText(_0x26e945)["toLowerCase"]()["includes"](_0x3bdda9))) : -0x1;
    const _0x31f0eb = _0x4069e0 >= 0x0 ? _0x4069e0 : 0x0;
    const _0x3ea4a0 = _0x686831[_0x31f0eb] || _0x686831[0x0];
    return {
      ..._0x3ea4a0,
      'mentionVariants': _0x686831,
      'mentionVariantIndex': _0x31f0eb
    };
  });
  const _0x451307 = (Array["isArray"](libraryCandidates) ? libraryCandidates : [])["map"](_0x2ea42b => ({
    ..._0x2ea42b,
    'origin': 'asset',
    'menuDirect': !![],
    'menuPage': "assets",
    'menuGroup': "全部素材",
    'menuSection': '',
    'suppressTooltip': !![],
    'assetIndex': Number(_0x2ea42b?.['itemIndex'] || 0x0),
    'label': normalizeText(_0x2ea42b?.['insertLabel'] || _0x2ea42b?.["label"] || _0x2ea42b?.["name"]) || '素材库内容',
    'assetName': normalizeText(_0x2ea42b?.["assetName"]) || "素材库",
    'iconType': normalizeText(_0x2ea42b?.["type"])
  }));
  const _0x4c98ca = includeTime ? [{
    'origin': 'asset',
    'menuDirect': !![],
    'suppressTooltip': !![],
    'assetId': STORY_TIME_MENTION_ASSET_ID,
    'assetIndex': 0x0,
    'type': '',
    'label': '添加时间',
    'subtitle': "设置当前片段在提示词中的生成时长",
    'pillLabel': normalizeStoryClipTimeLabel(defaultDuration),
    'pillKind': 'time',
    'iconType': '',
    'assetName': '片段设置',
    'menuPage': 'tools',
    'menuSection': '',
    'compactVisual': !![]
  }] : [];
  const _0x10780f = includeClipFrames || clipFrames["length"] ? buildStoryClipFrameMentionCandidates(clipFrames, {
    'query': query,
    'clips': episode?.["clips"],
    'episodeId': episode?.['id']
  }) : [];
  return [..._0x5d6cff, ..._0x451307, ..._0x4c98ca, ..._0x10780f]["filter"](_0x41c94c => matchesQuery(_0x41c94c, query));
}
function renderStoryAssetMentionPill(_0x2ebb82, _0x8d5ba = []) {
  const _0x4ffce9 = normalizeText(_0x2ebb82?.['pillLabel'] || _0x2ebb82?.['label']) || "本集素材";
  const _0xe3f46c = _0x2ebb82?.["missingAsset"] === !![];
  const _0x5d6887 = normalizeText(_0x2ebb82?.["storyAssetId"]);
  const _0x307ce5 = normalizeText(_0x2ebb82?.["storyAppearanceId"]);
  const _0x4ecd4e = _0x8d5ba["find"](_0x11183d => _0x11183d['id'] === _0x5d6887);
  const _0x32ae58 = _0x4ecd4e?.["appearances"]?.["find"](_0x57b6a3 => _0x57b6a3['id'] === _0x307ce5);
  const _0x440074 = getStoryReplicationCharacterDisplayLabel(_0x4ecd4e, _0x32ae58, _0x8d5ba) || _0x4ffce9;
  const _0x3120d3 = _0x2ebb82?.["thumbUrl"] ? "<img class=\"ref-pill-thumb\" src=\"" + escapeHtml(_0x2ebb82["thumbUrl"]) + '\x22\x20alt=\x22\x22\x20draggable=\x22false\x22>' : '';
  return "<span class=\"ref-pill" + (_0xe3f46c ? " ref-pill--unresolved" : '') + '\x22\x20contenteditable=\x22false\x22\x20data-label=\x22' + escapeHtml(_0x440074) + "\" data-ref-origin=\"asset\" data-asset-id=\"" + escapeHtml(_0x2ebb82['assetId']) + "\" data-asset-index=\"0\" data-ref-type=\"image\"" + (_0x5d6887 ? '\x20data-story-asset-hover-id=\x22' + escapeHtml(_0x5d6887) + '\x22' : '') + (_0x307ce5 ? '\x20data-story-asset-hover-appearance-id=\x22' + escapeHtml(_0x307ce5) + '\x22' : '') + (_0xe3f46c ? '\x20data-ref-unresolved=\x22true\x22\x20data-tooltip=\x22缺少图片素材\x22' : '') + '>' + _0x3120d3 + '<span\x20class=\x22ref-pill-label\x22>' + escapeHtml(_0x440074) + '</span></span>';
}
function renderStoryTimeMentionPill(_0x152039) {
  const _0x4f1b09 = normalizeStoryClipTimeLabel(_0x152039);
  return "<span class=\"ref-pill story-time-pill\" contenteditable=\"false\" data-label=\"" + escapeHtml(_0x4f1b09) + "\" data-ref-origin=\"asset\" data-asset-id=\"" + STORY_TIME_MENTION_ASSET_ID + "\" data-asset-index=\"0\" data-prompt-pill-kind=\"time\"><span class=\"story-time-pill-icon\" aria-hidden=\"true\">" + STORY_TIME_ICON_SVG + "</span><span class=\"ref-pill-label\">" + escapeHtml(_0x4f1b09) + "</span></span>";
}
export function createStoryClipTimeMentionIcon(_0x36a29f = globalThis["document"]) {
  const _0x76d22f = _0x36a29f?.['createElement']?.('span');
  if (!_0x76d22f) {
    return null;
  }
  _0x76d22f["className"] = "story-time-pill-icon";
  _0x76d22f["setAttribute"]?.("aria-hidden", "true");
  _0x76d22f["innerHTML"] = STORY_TIME_ICON_SVG;
  return _0x76d22f;
}
export function beginStoryClipTimePillEdit({
  pill: _0x28639f,
  documentObject = globalThis["document"],
  onCommit = null
} = {}) {
  if (!_0x28639f || !documentObject?.["createElement"]) {
    return null;
  }
  const _0x5869f6 = _0x28639f["querySelector"]?.(".story-time-pill-input");
  if (_0x5869f6) {
    _0x5869f6["focus"]?.();
    _0x5869f6['select']?.();
    return _0x5869f6;
  }
  const _0x595cfe = _0x28639f["querySelector"]?.(".ref-pill-label");
  if (!_0x595cfe || typeof _0x28639f['replaceChild'] !== "function") {
    return null;
  }
  const _0x76ea4b = normalizeStoryClipTimeLabel(_0x28639f["dataset"]?.["label"] || _0x595cfe["textContent"]);
  const _0x2a4ccd = documentObject["createElement"]("input");
  _0x2a4ccd["className"] = "story-time-pill-input";
  _0x2a4ccd["type"] = "text";
  _0x2a4ccd["inputMode"] = "decimal";
  _0x2a4ccd["value"] = _0x76ea4b["replace"](/s$/i, '');
  _0x2a4ccd["autocomplete"] = "off";
  _0x2a4ccd["spellcheck"] = ![];
  _0x2a4ccd["dataset"]['promptPillInlineEditor'] = "true";
  _0x2a4ccd["setAttribute"]?.('aria-label', "片段时间（秒）");
  let _0x4321aa = ![];
  const _0x130b66 = _0x40ae73 => {
    if (_0x4321aa) {
      return;
    }
    _0x4321aa = !![];
    const _0x363394 = _0x40ae73 ? normalizeStoryClipTimeLabel(_0x2a4ccd["value"], _0x76ea4b) : _0x76ea4b;
    const _0x347e27 = documentObject["createElement"]("span");
    _0x347e27["className"] = "ref-pill-label";
    _0x347e27['textContent'] = _0x363394;
    if (_0x2a4ccd["parentNode"] === _0x28639f) {
      _0x28639f['replaceChild'](_0x347e27, _0x2a4ccd);
    }
    _0x28639f["dataset"]["label"] = _0x363394;
    _0x28639f["classList"]?.["remove"]?.("is-editing");
    _0x40ae73 && _0x363394 !== _0x76ea4b && typeof onCommit === 'function' && onCommit(_0x363394);
  };
  _0x2a4ccd['addEventListener']?.("keydown", _0xc72827 => {
    if (_0xc72827["key"] === "Enter") {
      _0xc72827["preventDefault"]?.();
      _0x130b66(!![]);
      return;
    }
    _0xc72827["key"] === 'Escape' && (_0xc72827["preventDefault"]?.(), _0x130b66(![]));
  });
  _0x2a4ccd["addEventListener"]?.("blur", () => _0x130b66(!![]));
  _0x28639f['replaceChild'](_0x2a4ccd, _0x595cfe);
  _0x28639f["classList"]?.["add"]?.("is-editing");
  _0x2a4ccd["focus"]?.();
  _0x2a4ccd["select"]?.();
  return _0x2a4ccd;
}
export function resolveStoryClipPromptPillPresentation(_0x52c684, _0xdc1fe4 = [], _0x395dff = []) {
  const _0x5700f7 = normalizeText(_0x52c684?.["dataset"]?.["assetId"] || _0x52c684?.["getAttribute"]?.('data-asset-id'));
  const _0x3a06a0 = normalizeText(_0x52c684?.["dataset"]?.["promptPillKind"] || _0x52c684?.["getAttribute"]?.("data-prompt-pill-kind"));
  if (_0x3a06a0 === 'time' || _0x5700f7 === STORY_TIME_MENTION_ASSET_ID) {
    return {
      'pillKind': "time",
      'missingAsset': ![]
    };
  }
  if (_0x5700f7["startsWith"](STORY_CLIP_FRAME_MENTION_PREFIX)) {
    return {
      'pillKind': "frame",
      'missingAsset': !resolveStoryClipFrameMentionRef(_0x52c684, _0x395dff)
    };
  }
  if (!_0x5700f7["startsWith"](STORY_ASSET_NODE_PREFIX)) {
    return {
      'pillKind': '',
      'missingAsset': ![]
    };
  }
  return {
    'pillKind': '',
    'missingAsset': !resolveStoryClipAssetMentionRef(_0x52c684, _0xdc1fe4)
  };
}
export function syncStoryClipPromptPillPresentation(_0x7a1829, _0x426597 = [], _0x3c776d = []) {
  _0x7a1829?.["querySelectorAll"]?.(".ref-pill")?.["forEach"]?.(_0x2fedad => {
    syncStoryClipPromptPillHoverTarget(_0x2fedad);
    const _0xfa69d9 = resolveStoryClipPromptPillPresentation(_0x2fedad, _0x426597, _0x3c776d);
    _0xfa69d9["pillKind"] === 'time' && (_0x2fedad["dataset"]['promptPillKind'] = "time", _0x2fedad["classList"]?.["add"]?.('story-time-pill'));
    if (_0xfa69d9["missingAsset"]) {
      _0x2fedad['dataset']["refUnresolved"] = 'true';
      _0x2fedad["classList"]?.["add"]?.("ref-pill--unresolved");
      _0x2fedad['setAttribute']?.("data-tooltip", "缺少图片素材");
      _0x2fedad['removeAttribute']?.("title");
      return;
    }
    const _0x202d65 = normalizeText(_0x2fedad?.["dataset"]?.["assetId"]);
    (_0x202d65["startsWith"](STORY_ASSET_NODE_PREFIX) || _0x202d65["startsWith"](STORY_CLIP_FRAME_MENTION_PREFIX)) && (delete _0x2fedad["dataset"]["refUnresolved"], _0x2fedad["classList"]?.['remove']?.("ref-pill--unresolved"), _0x2fedad["removeAttribute"]?.("data-tooltip"), _0x2fedad["removeAttribute"]?.('data-native-title'), _0x2fedad['removeAttribute']?.('data-tooltip-source'), _0x2fedad["removeAttribute"]?.("title"));
  });
}
export function renderStoryClipPromptMentions(_0x329077, {
  assets = [],
  episode = null,
  clipFrames = []
} = {}) {
  const _0x210107 = protectStoryH3LiteralTags(_0x329077);
  const _0x3f9fb1 = protectStoryPromptPills(_0x210107["source"]);
  const _0x2a34cf = episode?.['replication'] ? assets : [];
  for (const _0x52a9de of _0x3f9fb1['pills']) {
    const _0x32ff74 = parseStoryAssetMentionId(_0x52a9de["html"]["match"](/\bdata-asset-id="([^"]+)"/u)?.[0x1]);
    const _0x3e66ce = _0x32ff74 && assets['find'](_0x484e00 => _0x484e00['id'] === _0x32ff74["assetId"]);
    const _0x57cd8a = _0x3e66ce?.["appearances"]?.["find"](_0x31d969 => _0x31d969['id'] === _0x32ff74['appearanceId']);
    const _0x3e396c = _0x2a34cf["length"] && getStoryReplicationCharacterDisplayLabel(_0x3e66ce, _0x57cd8a, assets);
    _0x3e396c && (_0x52a9de["html"] = _0x52a9de["html"]["replace"](/\bdata-label="[^"]*"/u, "data-label=\"" + escapeHtml(_0x3e396c) + '\x22'), _0x52a9de["html"] = /class="ref-pill-label"/u["test"](_0x52a9de["html"]) ? _0x52a9de["html"]['replace'](/(<span\b[^>]*class="ref-pill-label"[^>]*>)[\s\S]*?(<\/span>)/u, (_0x3f1c7e, _0x300827, _0x2bb65c) => '' + _0x300827 + escapeHtml(_0x3e396c) + _0x2bb65c) : _0x52a9de["html"]['replace'](/>[^<>]*<\/span>$/u, '>' + escapeHtml(_0x3e396c) + "</span>"));
  }
  const _0x152252 = _0x3f9fb1['source'];
  if (!_0x152252) {
    return _0x152252;
  }
  const _0xb1640a = buildStoryClipMentionCandidates({
    'assets': assets,
    'episode': episode,
    'clipFrames': clipFrames
  });
  const _0x3ebc9d = new Map();
  _0xb1640a["forEach"](_0x21d52a => {
    const _0x484997 = normalizeText(_0x21d52a["label"]);
    _0x484997 && !_0x3ebc9d["has"](_0x484997) && _0x3ebc9d["set"](_0x484997, _0x21d52a);
    const _0x14c98e = Array["isArray"](_0x21d52a["mentionVariants"]) ? _0x21d52a["mentionVariants"] : [];
    _0x14c98e["forEach"](_0x47522d => {
      const _0x270709 = normalizeText(_0x47522d?.['pillLabel'] || _0x47522d?.["label"]);
      if (_0x270709) {
        _0x3ebc9d["set"](_0x270709, _0x47522d);
      }
      if (_0x47522d?.["sourcePillLabel"]) {
        _0x3ebc9d['set'](_0x47522d['sourcePillLabel'], _0x47522d);
      }
    });
  });
  const _0x59433d = [..._0x3ebc9d['keys']()]["filter"](Boolean)['sort']((_0x471d1a, _0x29f32a) => _0x29f32a['length'] - _0x471d1a["length"]);
  const _0x44b903 = _0x59433d['length'] ? "@(?:" + _0x59433d["map"](escapeRegExp)["join"]('|') + ')' : "(?!)";
  const _0x1bcaad = new RegExp('(' + _0x44b903 + ")|(⏱\\s*-?\\d+(?:\\.\\d+)?\\s*(?:s|秒))", 'gi');
  const _0x5b4b67 = (_0x2a0769, {
    escapeText = !![]
  } = {}) => {
    _0x1bcaad["lastIndex"] = 0x0;
    let _0x5291c1 = 0x0;
    let _0x46a7da = '';
    let _0x18fe97 = null;
    const _0x37f066 = _0x1af993 => escapeText ? escapeHtml(_0x1af993) : _0x1af993;
    while (_0x18fe97 = _0x1bcaad["exec"](_0x2a0769)) {
      _0x46a7da += _0x37f066(_0x2a0769["slice"](_0x5291c1, _0x18fe97["index"]));
      if (_0x18fe97[0x1]) {
        const _0x1d6dff = _0x18fe97[0x1]["slice"](0x1);
        const _0x53a55e = _0x3ebc9d["get"](_0x1d6dff);
        _0x46a7da += _0x53a55e ? renderStoryAssetMentionPill(_0x53a55e, _0x2a34cf) : _0x37f066(_0x18fe97[0x0]);
      } else {
        _0x46a7da += renderStoryTimeMentionPill(_0x18fe97[0x2]);
      }
      _0x5291c1 = _0x18fe97['index'] + _0x18fe97[0x0]["length"];
    }
    _0x46a7da += _0x37f066(_0x2a0769['slice'](_0x5291c1));
    return _0x46a7da;
  };
  if (_0x3f9fb1["pills"]["length"] || /<[a-z][\s\S]*>/i['test'](_0x152252)) {
    return _0x210107["restore"](_0x3f9fb1['restore'](_0x152252['split'](/(<[^>]+>)/gu)["map"](_0xcb7c26 => _0xcb7c26["startsWith"]('<') ? _0xcb7c26 : _0x5b4b67(_0xcb7c26, {
      'escapeText': ![]
    }))["join"]('')));
  }
  return _0x210107["restore"](_0x3f9fb1["restore"](_0x5b4b67(_0x152252)));
}
export function resolveStoryClipPromptAssetRefs(_0x779f, {
  assets = [],
  episode = null,
  clipFrames = [],
  resolveExternalAssetRef = null,
  voiceAssetIds = null
} = {}) {
  const _0x2f0c5e = renderStoryClipPromptMentions(_0x779f, {
    'assets': assets,
    'episode': episode,
    'clipFrames': clipFrames
  });
  const _0x4b1f24 = /<span\b[^>]*\bclass\s*=\s*(["'])[^"']*\bref-pill\b[^"']*\1[^>]*>/gi;
  const _0x5c8ba6 = (_0x4d59ad, _0x3d907d) => {
    const _0x30ae49 = _0x4d59ad['match'](new RegExp('\x5cb' + _0x3d907d + "\\s*=\\s*([\"'])(.*?)\\1", 'i'));
    return normalizeText(_0x30ae49?.[0x2])["replace"](/&quot;/gi, '\x22')["replace"](/&#39;|&apos;/gi, '\x27')["replace"](/&lt;/gi, '<')['replace'](/&gt;/gi, '>')["replace"](/&amp;/gi, '&');
  };
  const _0xbb4d77 = [];
  const _0x23b9e9 = new Set();
  const _0x2387e9 = voiceAssetIds == null ? null : new Set([...voiceAssetIds]["map"](normalizeText)['filter'](Boolean));
  let _0x246dd7 = null;
  while (_0x246dd7 = _0x4b1f24['exec'](_0x2f0c5e)) {
    const _0x2c9b6e = _0x246dd7[0x0];
    const _0x18b2cc = _0x5c8ba6(_0x2c9b6e, 'data-asset-id');
    if (!_0x18b2cc) {
      continue;
    }
    const _0x37f411 = getStoryAssetIdFromMentionNodeId(_0x18b2cc);
    const _0x4fd3af = _0x18b2cc["startsWith"](STORY_ASSET_NODE_PREFIX) ? resolveStoryClipAssetMentionRefs({
      'dataset': {
        'assetId': _0x18b2cc
      }
    }, assets, {
      'voiceEnabled': _0x2387e9 && !_0x2387e9["has"](_0x37f411) ? ![] : getStoryEpisodeCharacterVoiceEnabled(episode, _0x37f411)
    }) : _0x18b2cc["startsWith"](STORY_CLIP_FRAME_MENTION_PREFIX) ? resolveStoryClipFrameMentionRef({
      'dataset': {
        'assetId': _0x18b2cc
      }
    }, clipFrames) : typeof resolveExternalAssetRef === "function" ? resolveExternalAssetRef({
      'assetId': _0x18b2cc,
      'itemIndex': Number(_0x5c8ba6(_0x2c9b6e, "data-asset-index"))
    }) : null;
    (Array['isArray'](_0x4fd3af) ? _0x4fd3af : [_0x4fd3af])['filter'](Boolean)["forEach"](_0x16add2 => {
      const _0x261515 = normalizeText(_0x16add2?.['type'] || _0x16add2?.["kind"]);
      const _0x2d6cdb = normalizeText(_0x16add2?.["url"]);
      if (!_0x261515 || !_0x2d6cdb) {
        return;
      }
      const _0x5c357b = _0x261515 + ':' + _0x2d6cdb;
      if (_0x23b9e9["has"](_0x5c357b)) {
        return;
      }
      _0x23b9e9["add"](_0x5c357b);
      _0xbb4d77['push'](_0x16add2);
    });
  }
  return _0xbb4d77;
}
export function getStoryAssetIdFromMentionNodeId(_0x1d7f4b = '') {
  return parseStoryAssetMentionId(_0x1d7f4b)?.["assetId"] || '';
}
export function getStoryEpisodeCharacterVoiceEnabled(_0x2adf87 = {}, _0x17fc7c = '') {
  const _0x2b4c67 = normalizeText(_0x17fc7c);
  const _0x3a4251 = _0x2adf87?.["characterVoiceEnabledByAssetId"];
  if (!_0x2b4c67 || !_0x3a4251 || typeof _0x3a4251 !== "object" || Array['isArray'](_0x3a4251) || typeof _0x3a4251[_0x2b4c67] !== "boolean") {
    return undefined;
  }
  return _0x3a4251[_0x2b4c67];
}
export function setStoryEpisodeCharacterVoiceEnabled(_0x57be36 = {}, _0x40437a = '', _0x308fbb = ![]) {
  if (!_0x57be36 || typeof _0x57be36 !== "object" || Array['isArray'](_0x57be36)) {
    return ![];
  }
  const _0xb62418 = normalizeText(_0x40437a);
  if (!_0xb62418) {
    return ![];
  }
  const _0x90929d = _0x57be36["characterVoiceEnabledByAssetId"];
  _0x57be36["characterVoiceEnabledByAssetId"] = {
    ...(_0x90929d && typeof _0x90929d === "object" && !Array["isArray"](_0x90929d) ? _0x90929d : {}),
    [_0xb62418]: _0x308fbb === !![]
  };
  return !![];
}
export function syncStoryClipPromptPillHoverTarget(_0x2b0294) {
  if (!_0x2b0294?.["dataset"]) {
    return '';
  }
  const _0x43b858 = parseStoryAssetMentionId(_0x2b0294["dataset"]["assetId"]);
  const _0x29cfbf = _0x43b858?.["assetId"] || '';
  const _0xb71b3e = _0x43b858?.['appearanceId'] === "__asset__" ? '' : _0x43b858?.["appearanceId"] || '';
  if (_0x29cfbf) {
    _0x2b0294["dataset"]["storyAssetHoverId"] = _0x29cfbf;
  } else {
    delete _0x2b0294['dataset']["storyAssetHoverId"];
  }
  _0xb71b3e ? _0x2b0294['dataset']["storyAssetHoverAppearanceId"] = _0xb71b3e : delete _0x2b0294["dataset"]["storyAssetHoverAppearanceId"];
  return _0x29cfbf;
}
export function resolveStoryClipAssetMentionRef(_0x444f06, _0xfcdd93 = []) {
  const _0x36dd24 = parseStoryAssetMentionId(_0x444f06?.["dataset"]?.["assetId"]);
  if (!_0x36dd24) {
    return null;
  }
  const _0x2584b0 = (Array["isArray"](_0xfcdd93) ? _0xfcdd93 : [])["find"](_0x1d02a1 => normalizeText(_0x1d02a1?.['id']) === _0x36dd24["assetId"]);
  if (!_0x2584b0) {
    return null;
  }
  const _0x335e35 = _0x36dd24['appearanceId'] === '__asset__' ? null : (Array["isArray"](_0x2584b0["appearances"]) ? _0x2584b0["appearances"] : [])["find"](_0x480bc4 => normalizeText(_0x480bc4?.['id']) === _0x36dd24['appearanceId']);
  if (_0x36dd24["appearanceId"] !== "__asset__" && !_0x335e35) {
    return null;
  }
  const _0x4e01a2 = _0x36dd24["appearanceId"] === "__asset__" ? normalizeText(_0x2584b0["imageUrl"]) : normalizeText(_0x335e35?.['imageUrl']);
  if (!_0x4e01a2) {
    return null;
  }
  return {
    'origin': "asset",
    'assetId': normalizeText(_0x444f06?.['dataset']?.["assetId"]),
    'storyAssetId': _0x36dd24['assetId'],
    'appearanceId': _0x36dd24["appearanceId"],
    'itemIndex': 0x0,
    'type': "image",
    'name': normalizeText(_0x2584b0["name"]) || "本集素材",
    'label': normalizeText(_0x2584b0["name"]) || "本集素材",
    'url': _0x4e01a2,
    'thumbUrl': _0x4e01a2,
    'nodeData': {
      'type': "source-image",
      'imageUrl': _0x4e01a2
    }
  };
}
export function getStoryClipMentionVoiceState(_0x48e7bd, _0xedd770 = [], {
  voiceEnabled: _0x4cfe0d
} = {}) {
  const _0x11f918 = parseStoryAssetMentionId(_0x48e7bd?.["dataset"]?.["assetId"]);
  const _0x4295c5 = _0x11f918 ? (Array["isArray"](_0xedd770) ? _0xedd770 : [])["find"](_0x2b9f9d => normalizeText(_0x2b9f9d?.['id']) === _0x11f918["assetId"]) : null;
  const _0x433433 = _0x4295c5?.["kind"] === "character" ? normalizeStoryCharacterVoiceReference(_0x4295c5?.['voiceReference']) : null;
  const _0x239005 = normalizeText(_0x433433?.["audioUrl"] || _0x433433?.["localPath"]);
  const _0x4e953e = Boolean(_0x4295c5 && _0x239005);
  const _0x5cfe16 = normalizeText(_0x48e7bd?.["dataset"]?.["storyVoiceEnabled"]);
  const _0x25a896 = typeof _0x4cfe0d === "boolean" ? _0x4cfe0d : _0x5cfe16 !== 'false';
  return {
    'available': _0x4e953e,
    'enabled': _0x4e953e && _0x25a896,
    'asset': _0x4295c5,
    'voiceReference': _0x433433,
    'url': _0x239005
  };
}
export function setStoryClipMentionVoiceEnabled(_0xeb25a8, _0x2ddea8 = [], _0x3e5326 = ![]) {
  if (!_0xeb25a8?.["dataset"]) {
    return getStoryClipMentionVoiceState(_0xeb25a8, _0x2ddea8);
  }
  const _0x43cb1e = getStoryClipMentionVoiceState(_0xeb25a8, _0x2ddea8);
  if (_0x43cb1e["available"] && _0x3e5326 === !![]) {
    _0xeb25a8["dataset"]["storyVoiceEnabled"] = "true";
  } else {
    _0x43cb1e["available"] ? _0xeb25a8['dataset']["storyVoiceEnabled"] = "false" : (delete _0xeb25a8["dataset"]["storyVoiceEnabled"], _0xeb25a8["removeAttribute"]?.("data-story-voice-enabled"));
  }
  return getStoryClipMentionVoiceState(_0xeb25a8, _0x2ddea8);
}
export function resolveStoryClipAssetMentionRefs(_0x48fa28, _0x348993 = [], {
  voiceEnabled: _0x42c9cd,
  clipFrames = [],
  resolveExternalAssetRef = null
} = {}) {
  const _0xd54e2c = resolveStoryClipFrameMentionRef(_0x48fa28, clipFrames);
  if (_0xd54e2c) {
    return _0xd54e2c;
  }
  const _0x2eac06 = normalizeText(_0x48fa28?.["dataset"]?.['assetId']);
  if (!_0x2eac06["startsWith"](STORY_ASSET_NODE_PREFIX) && typeof resolveExternalAssetRef === "function") {
    return resolveExternalAssetRef({
      'assetId': _0x2eac06,
      'itemIndex': Number(_0x48fa28?.["dataset"]?.['assetIndex'] || 0x0)
    });
  }
  const _0x294c18 = [];
  const _0x2bfc78 = resolveStoryClipAssetMentionRef(_0x48fa28, _0x348993);
  if (_0x2bfc78) {
    _0x294c18["push"](_0x2bfc78);
  }
  const _0x3f89e2 = getStoryClipMentionVoiceState(_0x48fa28, _0x348993, {
    'voiceEnabled': _0x42c9cd
  });
  if (_0x3f89e2["enabled"]) {
    const _0x18519e = normalizeText(_0x3f89e2['asset']?.['id']);
    _0x294c18["push"]({
      'origin': "asset",
      'assetId': '' + STORY_CHARACTER_VOICE_NODE_PREFIX + encodeURIComponent(_0x18519e),
      'storyAssetId': _0x18519e,
      'itemIndex': 0x0,
      'type': "audio",
      'name': (normalizeText(_0x3f89e2['asset']?.["name"]) || '角色') + " · 声音参考",
      'label': normalizeText(_0x3f89e2["asset"]?.["name"]) || "角色声音",
      'url': _0x3f89e2["url"],
      'audioUrl': _0x3f89e2["url"],
      'localPath': normalizeText(_0x3f89e2["voiceReference"]?.['localPath']),
      'placeholderTypeLabel': '声音',
      'nodeData': {
        'type': "source-audio",
        'audioUrl': _0x3f89e2["url"],
        'localPath': normalizeText(_0x3f89e2['voiceReference']?.["localPath"])
      }
    });
  }
  if (_0x294c18["length"] === 0x0) {
    return null;
  }
  return _0x294c18["length"] === 0x1 ? _0x294c18[0x0] : _0x294c18;
}