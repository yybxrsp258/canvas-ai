import { createReferenceMaskBadgeHtml, getReferenceMaskSignaturePart } from '../../modules/refThumbMaskBadge.js';
import { bindRefThumbFixedSlotDrag, bindRefThumbOrderDrag } from '../../modules/refThumbDragController.js';
import { buildFixedInputAssetSlotMap, getFixedInputSlotConfigFromManifest, resolveFixedInputSlotForRef, shouldHideFixedInputSlots } from '../../modules/fixedInputAssetRefs.js';
import { getAssetInputRefsFromPrompt, getAssetInputRefsFromPromptAndNode } from '../../modules/nodePromptShared.js';
import { getGenerationRatioSizeWithDom } from '../../modules/generationRatioSource.js';
import { resolveEffectiveInputKind } from '../../modules/modelInputPolicy.js';
import { createReferenceInputThumbnailHtml, resolveReferenceVideoItemByEdge as a562_0x3bf827, resolveReferenceVideoMediaSignature as a562_0x99b4ef, resolveReferenceVideoSourcePath as a562_0x40f3af, resolveReferenceVideoThumbnail as a562_0x1a2835 } from '../../modules/referenceInputThumbnail.js';
import { localPathToUrl } from '../../utils/localMediaPath.js';
import { resolveCanvasImageLowZoomUrl } from '../../services/canvasMediaLocalService.js';
import { createPromptAttachmentButtonHTML } from '../refAttachmentButton.js';
import { formatInputSlotLabelHtml } from '../shared/inputSlotLabelFormatter.js';
import { animateImageSchemaRatioResizeFlip, armImageSchemaRatioResizeAnimation, GENERATION_RATIO_RESIZE_ANIMATION_MS as a562_0x16e0da } from '../shared/generationDisplayPolicy.js';
import { renderVideoFixedInputSlotsMarkup } from './promptInputSurface.js';
import { t } from '../../i18n/index.js';
const RH_V54_FPS_OPTIONS = Object['freeze']([0x10, 0x18, 0x1e]);
const RH_MIN_VIDEO_RESOLUTION = 0x340;
function referenceInputText(_0x348a04, _0x24c52e = {}) {
  return t("videoNode.referenceInput." + _0x348a04, _0x24c52e);
}
function normalizeRhV54Fps(_0x16e112) {
  const _0x68c01 = Number(_0x16e112);
  return RH_V54_FPS_OPTIONS["includes"](_0x68c01) ? _0x68c01 : 0x18;
}
function normalizeRhVideoResolution(_0x535286) {
  const _0x258b38 = Number(_0x535286);
  return Number["isFinite"](_0x258b38) ? Math['max'](RH_MIN_VIDEO_RESOLUTION, Math["trunc"](_0x258b38)) : RH_MIN_VIDEO_RESOLUTION;
}
function normalizeVideoMediaKey(_0x27451f) {
  return String(_0x27451f || '')["trim"]()["replace"](/^\/+/, '');
}
function normalizeRefSignaturePart(_0x40a839) {
  return String(_0x40a839 || '')["trim"]();
}
function getFixedRefBarLayoutKey(_0x46b13e) {
  if (!_0x46b13e) {
    return 'generic';
  }
  return 'fixed';
}
function getRefSourceDisplayStateKey(_0x4c9bba, _0x2d9313) {
  const _0x2c1ca1 = String(_0x4c9bba?.['type'] || '');
  const _0x165634 = getReferenceMaskSignaturePart(_0x4c9bba);
  const _0x26d1be = normalizeRefSignaturePart(_0x4c9bba?.['outputText'] || _0x4c9bba?.["text"] || _0x4c9bba?.["content"] || '');
  if (_0x2c1ca1["includes"]("text")) {
    return 't:' + _0x26d1be;
  }
  if (_0x2c1ca1["includes"]("video")) {
    const _0x2e4e41 = a562_0x3bf827(_0x4c9bba, _0x2d9313);
    const _0x273069 = a562_0x1a2835(_0x4c9bba, _0x2d9313);
    const _0x2baead = String(_0x4c9bba?.["type"] || '') === "ai-video" ? normalizeVideoMediaKey(_0x2e4e41["item"]?.["videoThumbUnavailableSource"] || _0x4c9bba?.["videoThumbUnavailableSource"]) : normalizeVideoMediaKey(_0x4c9bba?.['videoThumbUnavailableSource']);
    return ['v', _0x2e4e41['index'], normalizeVideoMediaKey(_0x2d9313?.['sourceMediaKey']), normalizeVideoMediaKey(_0x273069["thumbUrl"]), normalizeVideoMediaKey(_0x4c9bba?.["imageUrl"]), a562_0x99b4ef(_0x4c9bba, _0x2d9313), _0x2baead]["join"](':');
  }
  if (_0x2c1ca1["includes"]("audio")) {
    return ['a', normalizeRefSignaturePart(_0x4c9bba?.["audioUrl"]), normalizeRefSignaturePart(_0x4c9bba?.["src"]), normalizeRefSignaturePart(_0x4c9bba?.["localPath"])]["join"](':');
  }
  return ['i', normalizeRefSignaturePart(_0x4c9bba?.["thumbId"]), normalizeRefSignaturePart(_0x4c9bba?.['thumbUrl']), normalizeRefSignaturePart(_0x4c9bba?.["imageUrl"]), normalizeRefSignaturePart(_0x4c9bba?.['src']), normalizeRefSignaturePart(_0x4c9bba?.["localPath"]), _0x165634]['join'](':');
}
function pickPositiveNumber(..._0x56703a) {
  for (const _0xd57656 of _0x56703a) {
    const _0x462343 = Number(_0xd57656);
    if (Number['isFinite'](_0x462343) && _0x462343 > 0x0) {
      return _0x462343;
    }
  }
  return 0x0;
}
function getSourceVideoFrameCount(_0x1f24c9, _0x5a2f1c) {
  const _0x4b49b2 = a562_0x3bf827(_0x1f24c9, _0x5a2f1c)["item"];
  const _0x5922cd = pickPositiveNumber(_0x4b49b2?.["videoFrameCount"], _0x4b49b2?.["frameCount"], _0x1f24c9?.["videoFrameCount"], _0x1f24c9?.["frameCount"]);
  return _0x5922cd > 0x0 ? Math["round"](_0x5922cd) : 0x0;
}
function getSourceVideoDuration(_0x2ec30f, _0x484690) {
  const _0x363f79 = a562_0x3bf827(_0x2ec30f, _0x484690)["item"];
  return pickPositiveNumber(_0x363f79?.["videoDuration"], _0x363f79?.["duration"], _0x2ec30f?.["videoDuration"], _0x2ec30f?.['duration']);
}
function getRhV5SourceVideoNode({
  inEdges = [],
  nodes = {},
  promptEl = null,
  nodeData = null
}) {
  const _0x56207f = Array["isArray"](inEdges) ? inEdges : [];
  let _0x57f647 = _0x56207f["find"](_0x4d2226 => String(_0x4d2226?.["refSlot"] || '') === "sourceVideo") || null;
  !_0x57f647 && (_0x57f647 = _0x56207f["find"](_0x4a98a6 => String(nodes?.[_0x4a98a6?.['sourceId']]?.["type"] || '')["includes"]('video')) || null);
  if (_0x57f647 && nodes?.[_0x57f647['sourceId']]) {
    return {
      'node': nodes[_0x57f647["sourceId"]],
      'edge': _0x57f647
    };
  }
  const _0xd1ec05 = getAssetInputRefsFromPromptAndNode(promptEl, {
    'nodeData': nodeData,
    'allowedTypes': ["video"]
  })[0x0];
  return _0xd1ec05?.["nodeData"] ? {
    'node': _0xd1ec05['nodeData'],
    'edge': null
  } : {
    'node': null,
    'edge': null
  };
}
function getRhV5SourceVideoFrameCount({
  inEdges = [],
  nodes = {},
  promptEl = null,
  nodeData = null,
  targetFps = 0x0
} = {}) {
  const {
    node: _0x43d456,
    edge: _0xb0a4b8
  } = getRhV5SourceVideoNode({
    'inEdges': inEdges,
    'nodes': nodes,
    'promptEl': promptEl,
    'nodeData': nodeData
  });
  if (!_0x43d456) {
    return null;
  }
  const _0x42b986 = getSourceVideoFrameCount(_0x43d456, _0xb0a4b8);
  if (_0x42b986 > 0x0) {
    return _0x42b986;
  }
  const _0x5c5b70 = Number(targetFps);
  if (!Number["isFinite"](_0x5c5b70) || _0x5c5b70 <= 0x0) {
    return null;
  }
  let _0x236e50 = getSourceVideoDuration(_0x43d456, _0xb0a4b8);
  if (!(_0x236e50 > 0x0)) {
    const _0x38af3b = a562_0x3bf827(_0x43d456, _0xb0a4b8)["item"];
    const _0x422656 = pickPositiveNumber(_0x38af3b?.["videoFrameCount"], _0x38af3b?.['frameCount'], _0x43d456?.['videoFrameCount'], _0x43d456?.['frameCount']);
    const _0x2261b0 = pickPositiveNumber(_0x38af3b?.["videoFps"], _0x38af3b?.["fps"], _0x43d456?.["videoFps"], _0x43d456?.["fps"]);
    if (_0x422656 > 0x0 && _0x2261b0 > 0x0) {
      _0x236e50 = _0x422656 / _0x2261b0;
    }
  }
  return _0x236e50 > 0x0 ? Math["round"](_0x236e50 * _0x5c5b70) : null;
}
function createRunningHubAudioFallbackThumbHtml() {
  return createReferenceInputThumbnailHtml({
    'kind': "audio",
    'additionalClassName': 'rh-v5-ref-media-fallback'
  });
}
const FIXED_REF_KIND_LABEL_KEYS = Object["freeze"]({
  'text': "kind.text",
  'image': 'kind.image',
  'video': 'kind.video',
  'audio': "kind.audio"
});
const FIXED_REF_SLOT_FALLBACK_LABEL_KEYS = Object["freeze"]({
  'sourceVideo': "slots.sourceVideo",
  'refImage': "slots.refImage",
  'firstFrame': 'slots.firstFrame',
  'videoMask': "slots.videoMask",
  'maskImage': "slots.maskImage",
  'audio': "slots.audio"
});
function escapeHtmlText(_0x3fe9ac) {
  return String(_0x3fe9ac ?? '')["replace"](/&/g, '&amp;')["replace"](/</g, "&lt;")["replace"](/>/g, "&gt;");
}
function escapeHtmlAttr(_0x32b8fb) {
  return escapeHtmlText(_0x32b8fb)["replace"](/"/g, '&quot;');
}
function getFixedRefKindLabel(_0xe04540) {
  const _0x55c912 = FIXED_REF_KIND_LABEL_KEYS[String(_0xe04540 || '')];
  return _0x55c912 ? referenceInputText(_0x55c912) : '';
}
function getFixedRefSlotFallbackLabel(_0x283aea) {
  const _0x10173c = FIXED_REF_SLOT_FALLBACK_LABEL_KEYS[String(_0x283aea || '')];
  return _0x10173c ? referenceInputText(_0x10173c) : '';
}
function createRefThumbDeleteButtonHtml() {
  return "<button type=\"button\" class=\"ref-thumb-delete\" title=\"" + escapeHtmlAttr(referenceInputText('removeReference')) + "\">&times;</button>";
}
function getFixedSlotLabelText(_0x1800f1, _0x36698b) {
  const _0x4e9e8f = String(_0x36698b || '')["trim"]();
  const _0x518c92 = _0x1800f1?.["slotById"]?.[_0x4e9e8f] || null;
  return String(_0x518c92?.['label'] || '')['trim']() || getFixedRefSlotFallbackLabel(_0x4e9e8f) || getFixedRefKindLabel(_0x1800f1?.["slotKindById"]?.[_0x4e9e8f]) || _0x4e9e8f;
}
function getFixedSlotLabelHtml(_0x1f8a03, _0x47a6e5) {
  return formatInputSlotLabelHtml(getFixedSlotLabelText(_0x1f8a03, _0x47a6e5));
}
function getFixedSlotAcceptMap(_0x3dff0e) {
  const _0x247028 = {};
  (_0x3dff0e?.["visibleSlots"] || [])['forEach'](_0x187503 => {
    const _0x15d422 = String(_0x3dff0e?.["slotKindById"]?.[_0x187503] || '')["trim"]();
    if (_0x187503 && _0x15d422) {
      _0x247028[_0x187503] = _0x15d422;
    }
  });
  return _0x247028;
}
function normalizeDisplayRatioSource(_0x2192f9) {
  if (!_0x2192f9 || typeof _0x2192f9 !== "object" || Array["isArray"](_0x2192f9)) {
    return null;
  }
  const _0x1df4f6 = Array["from"](new Set([String(_0x2192f9["slot"] || _0x2192f9["refSlot"] || '')["trim"](), ...(Array["isArray"](_0x2192f9["slots"]) ? _0x2192f9['slots'] : [])]["map"](_0x245ca6 => String(_0x245ca6 || '')["trim"]())["filter"](Boolean)));
  const _0x3cfbcf = String(_0x2192f9["kind"] || '')['trim']();
  const _0xd4f1a8 = Number(_0x2192f9["fallbackIndex"] ?? _0x2192f9["inputIndex"] ?? _0x2192f9['index']);
  const _0x54f600 = Number["isFinite"](_0xd4f1a8) && _0xd4f1a8 >= 0x0 ? Math["trunc"](_0xd4f1a8) : null;
  if (_0x1df4f6["length"] === 0x0 && _0x54f600 === null) {
    return null;
  }
  return {
    ...(_0x1df4f6["length"] ? {
      'slot': _0x1df4f6[0x0],
      'slots': _0x1df4f6
    } : {}),
    ...(_0x3cfbcf ? {
      'kind': _0x3cfbcf
    } : {}),
    ...(_0x54f600 !== null ? {
      'fallbackIndex': _0x54f600
    } : {})
  };
}
function resolveConfiguredDisplayRatioSlot(_0x2bc8da, _0x1447de = {}) {
  const _0x30a0db = normalizeDisplayRatioSource(_0x2bc8da?.["manifest"]?.["inputSlots"]?.["displayAspectRatioSource"]);
  if (!_0x30a0db) {
    return null;
  }
  const _0x404053 = Array["isArray"](_0x30a0db['slots']) ? _0x30a0db["slots"] : _0x30a0db["slot"] ? [_0x30a0db["slot"]] : [];
  for (const _0x34c7d5 of _0x404053) {
    if (!_0x1447de?.[_0x34c7d5]) {
      continue;
    }
    if (_0x30a0db["kind"] && String(_0x2bc8da?.["slotKindById"]?.[_0x34c7d5] || '') !== _0x30a0db["kind"]) {
      continue;
    }
    return {
      'slot': _0x34c7d5,
      'mode': "configured"
    };
  }
  const _0x404868 = Array["isArray"](_0x2bc8da?.["visibleSlots"]) ? _0x2bc8da["visibleSlots"] : [];
  const _0x1ce80d = _0x404868['filter'](_0x57fa59 => {
    const _0x4d4961 = _0x1447de?.[_0x57fa59];
    if (!_0x4d4961) {
      return ![];
    }
    if (!_0x30a0db["kind"]) {
      return !![];
    }
    return String(_0x2bc8da?.["slotKindById"]?.[_0x57fa59] || '') === _0x30a0db["kind"];
  });
  const _0x24403e = _0x30a0db['fallbackIndex'];
  if (Number["isInteger"](_0x24403e) && _0x24403e >= 0x0 && _0x24403e < _0x1ce80d["length"]) {
    return {
      'slot': _0x1ce80d[_0x24403e],
      'mode': 'configured'
    };
  }
  return null;
}
function resolveLegacySingleReferenceVideoSlot(_0x3a43a2, _0x457929 = {}) {
  const _0x10f8fc = _0x3a43a2?.["visibleSlots"] || [];
  const _0x510450 = _0x10f8fc['length'] === 0x2 && _0x10f8fc[0x0] === "sourceVideo" && _0x10f8fc[0x1] === "refImage" && (_0x3a43a2?.["fixedSlots"] || [])["length"] === 0x2;
  if (!_0x510450 || !_0x457929?.["sourceVideo"]) {
    return null;
  }
  return {
    'slot': 'sourceVideo',
    'mode': "sourceVideoFrames"
  };
}
function resolveFixedInputDisplayRatioSlot(_0x16f17f, _0x17f8b4 = {}) {
  return resolveConfiguredDisplayRatioSlot(_0x16f17f, _0x17f8b4) || resolveLegacySingleReferenceVideoSlot(_0x16f17f, _0x17f8b4);
}
function getFixedInputRatioMediaSize(_0x508295, _0x51d47c = {}) {
  if (!_0x508295) {
    return null;
  }
  const _0x5aaf18 = String(_0x508295['kind'] || _0x508295["refType"] || '')["trim"]();
  const _0x45eeb1 = _0x508295["node"] || _0x508295["ref"]?.["nodeData"] || _0x51d47c?.[_0x508295["sourceId"]];
  if (!_0x45eeb1) {
    return null;
  }
  const _0x8b8c79 = _0x5aaf18 === "video" ? "video" : _0x5aaf18 === 'image' ? 'img' : "img, video";
  return getGenerationRatioSizeWithDom({
    'nodeId': _0x508295["sourceId"],
    'nodeData': _0x45eeb1,
    'edge': _0x508295["edge"] || null,
    'mediaSelector': _0x8b8c79,
    'includeNodeFrame': !![]
  });
}
function calcFixedInputDisplaySize(_0x1f262a, _0x4cbd43, _0x4785f2 = 0x12c) {
  const _0x5b1e14 = Number(_0x1f262a);
  const _0x716e07 = Number(_0x4cbd43);
  if (!(Number["isFinite"](_0x5b1e14) && _0x5b1e14 > 0x0)) {
    return null;
  }
  if (!(Number["isFinite"](_0x716e07) && _0x716e07 > 0x0)) {
    return null;
  }
  const _0xdab014 = Math["max"](0x1, Math["round"](Number(_0x4785f2) || 0x12c));
  if (_0x5b1e14 >= _0x716e07) {
    return {
      'width': Math["round"](_0x5b1e14 / _0x716e07 * _0xdab014),
      'height': _0xdab014
    };
  }
  return {
    'width': _0xdab014,
    'height': Math["round"](_0x716e07 / _0x5b1e14 * _0xdab014)
  };
}
export const __videoReferenceInputTest = {
  'getVideoThumbCandidate': a562_0x1a2835,
  'getVideoSourcePathForThumb': a562_0x40f3af,
  'getVideoRefMediaSignature': a562_0x99b4ef,
  'getRefSourceDisplayStateKey': getRefSourceDisplayStateKey,
  'getRhV5SourceVideoFrameCount': getRhV5SourceVideoFrameCount,
  'createRunningHubAudioFallbackThumbHtml': createRunningHubAudioFallbackThumbHtml,
  'getFixedSlotLabelHtml': getFixedSlotLabelHtml,
  'calcFixedInputDisplaySize': calcFixedInputDisplaySize
};
export function createVideoNodeReferenceInputModule(_0x2c7376) {
  const {
    store: _0x4a6811,
    api: _0x321d25,
    _syncPillLabels: _0xc081a8,
    getImage: _0x5c41ae,
    ensureThumbDecoded: _0x2760ae,
    revealRefThumbMedia: _0x556d25
  } = _0x2c7376;
  class _0x3c9a9e {
    ["_getRefSourceStateKey"](_0x5d5719, _0x2f71e6) {
      return getRefSourceDisplayStateKey(_0x5d5719, _0x2f71e6);
    }
    ['_getRhV5SourceVideoFrameCount'](_0x1b5d7a) {
      const _0x2b7f57 = _0x4a6811["getIncomingEdges"](this['nodeId']) || [];
      const _0x29e43c = typeof _0x4a6811["getStateRaw"] === "function" ? _0x4a6811["getStateRaw"]() : _0x4a6811['getState']() || {};
      const _0x508f71 = _0x29e43c["nodes"] || {};
      return getRhV5SourceVideoFrameCount({
        'inEdges': _0x2b7f57,
        'nodes': _0x508f71,
        'promptEl': this['promptEl'],
        'nodeData': _0x508f71?.[this['nodeId']] || this["_data"] || null,
        'targetFps': _0x1b5d7a
      });
    }
    ["_createAssetRefThumbData"](_0x34a25f, {
      slot = '',
      key = ''
    } = {}) {
      const _0x516241 = String(_0x34a25f?.["type"] || '')["trim"]();
      if (!_0x516241) {
        return null;
      }
      let _0x3486c9 = '';
      let _0x32db77 = '';
      if (_0x516241 === 'image') {
        const _0x851076 = this["_resolveMediaUrl"](_0x34a25f['thumbUrl'] || _0x34a25f["url"] || '');
        if (!_0x851076) {
          return null;
        }
        _0x2760ae(_0x851076);
        _0x3486c9 = createReferenceInputThumbnailHtml({
          'kind': "image",
          'thumbnailUrl': _0x851076
        });
        _0x32db77 = "asset-i|" + _0x851076;
      } else {
        if (_0x516241 === 'video') {
          const _0x3a19af = this["_resolveMediaUrl"](_0x34a25f["thumbUrl"] || '');
          _0x3a19af ? (_0x2760ae(_0x3a19af), _0x3486c9 = createReferenceInputThumbnailHtml({
            'kind': "video",
            'thumbnailUrl': _0x3a19af
          }), _0x32db77 = "asset-v|" + _0x3a19af) : (_0x3486c9 = createReferenceInputThumbnailHtml({
            'kind': 'video'
          }), _0x32db77 = 'asset-v|fallback');
        } else {
          if (_0x516241 === 'audio') {
            _0x3486c9 = createReferenceInputThumbnailHtml({
              'kind': "audio"
            });
            _0x32db77 = "asset-a|fallback";
          } else {
            if (_0x516241 === "text") {
              _0x3486c9 = createReferenceInputThumbnailHtml({
                'kind': "text"
              });
              _0x32db77 = "asset-t|" + String(_0x34a25f["content"] || _0x34a25f["label"] || '')["trim"]();
            } else {
              return null;
            }
          }
        }
      }
      const _0xd1a1df = String(_0x34a25f["assetId"] || '');
      const _0x46976d = String(_0x34a25f["itemIndex"] ?? '');
      const _0x58475d = String(_0x34a25f["assetMentionOccurrence"] ?? '');
      const _0xe676c1 = String(_0x34a25f["assetRefSource"] || "prompt");
      const _0x507365 = "asset:" + _0xd1a1df + ':' + _0x46976d;
      return {
        'key': key || "asset:" + _0xe676c1 + ':' + _0xd1a1df + ':' + _0x46976d + ':' + _0x516241 + ':' + _0x58475d,
        'edgeId': '',
        'kind': _0x516241,
        'sourceId': _0x507365,
        'assetId': _0xd1a1df,
        'assetIndex': _0x46976d,
        'assetOccurrence': _0x58475d,
        'assetRefSource': _0xe676c1,
        'refType': _0x516241,
        'node': _0x34a25f["nodeData"] || null,
        'ref': _0x34a25f,
        'html': _0x3486c9,
        'thumbHTML': _0x3486c9,
        'sig': '' + (slot ? slot + '|' : '') + _0x507365 + '|' + _0x516241 + '|' + String(_0x34a25f['url'] || '') + '|' + _0x32db77,
        'virtual': !![]
      };
    }
    ["_createTextEdgeRefThumbData"](_0xac4936, _0x2b0453) {
      const _0x2345a4 = String(_0x2b0453?.["outputText"] || _0x2b0453?.["text"] || _0x2b0453?.['content'] || _0x2b0453?.["prompt"] || '')["trim"]();
      if (!_0x2345a4) {
        return null;
      }
      return {
        'key': "edge:" + _0xac4936['id'],
        'edgeId': _0xac4936['id'],
        'kind': 'text',
        'sourceId': _0xac4936['sourceId'],
        'html': createReferenceInputThumbnailHtml({
          'kind': "text"
        }),
        'sig': 'text|' + _0xac4936['id'] + '|' + _0xac4936["sourceId"] + '|' + _0x2345a4
      };
    }
    ["_syncFixedTrailingRefItems"](_0xbd2624, _0x4a339b = []) {
      if (!_0xbd2624) {
        return;
      }
      const _0x2cdcf2 = new Map();
      _0xbd2624["querySelectorAll"]('.rh-fixed-extra-ref')['forEach'](_0x59781c => _0x2cdcf2["set"](_0x59781c["dataset"]["refKey"], _0x59781c));
      const _0x43e7a3 = new Set();
      (Array["isArray"](_0x4a339b) ? _0x4a339b : [])["forEach"](_0x500498 => {
        if (!_0x500498?.['key']) {
          return;
        }
        let _0x1d0324 = _0x2cdcf2["get"](_0x500498["key"]);
        !_0x1d0324 && (_0x1d0324 = document["createElement"]("div"), _0x1d0324["className"] = "ref-thumb-wrap rh-v5-ref-box rh-fixed-extra-ref" + (_0x500498["virtual"] ? '\x20ref-thumb-wrap--asset' : ''));
        _0x1d0324["setAttribute"]("draggable", _0x500498["virtual"] || !_0x500498["edgeId"] ? 'false' : "true");
        _0x1d0324["dataset"]["sig"] !== _0x500498["sig"] && (_0x1d0324['innerHTML'] = '' + _0x500498["html"] + createRefThumbDeleteButtonHtml(), _0x1d0324["dataset"]["sig"] = _0x500498["sig"], _0x556d25(_0x1d0324, _0x500498["sig"]));
        _0x1d0324['dataset']["refKey"] = _0x500498["key"];
        _0x1d0324["dataset"]['edgeId'] = _0x500498["edgeId"] || '';
        _0x1d0324["dataset"]["kind"] = _0x500498['kind'] || '';
        _0x1d0324["dataset"]["sourceId"] = _0x500498["sourceId"] || '';
        _0x1d0324['dataset']["refOrigin"] = _0x500498["virtual"] ? 'asset' : "node";
        _0x500498["virtual"] ? (_0x1d0324["dataset"]["assetId"] = _0x500498["assetId"] || '', _0x1d0324["dataset"]["assetIndex"] = _0x500498["assetIndex"] || '', _0x1d0324["dataset"]['assetOccurrence'] = _0x500498["assetOccurrence"] || '', _0x1d0324["dataset"]["assetRefSource"] = _0x500498["assetRefSource"] || "prompt", _0x1d0324["dataset"]["refType"] = _0x500498['refType'] || _0x500498['kind'] || '') : (delete _0x1d0324["dataset"]["assetId"], delete _0x1d0324["dataset"]['assetIndex'], delete _0x1d0324['dataset']["assetOccurrence"], delete _0x1d0324["dataset"]["assetRefSource"], delete _0x1d0324["dataset"]["refType"]);
        _0xbd2624["appendChild"](_0x1d0324);
        _0x43e7a3["add"](_0x500498["key"]);
      });
      for (const [_0x4abe79, _0xdf7f1c] of _0x2cdcf2['entries']()) {
        if (!_0x43e7a3['has'](_0x4abe79)) {
          _0xdf7f1c["remove"]();
        }
      }
    }
    ["_getFixedSlotRefThumbObjectUrlMap"]() {
      !this['_fixedSlotRefThumbObjectUrls'] && (this['_fixedSlotRefThumbObjectUrls'] = new Map());
      return this["_fixedSlotRefThumbObjectUrls"];
    }
    ['_clearObjectUrlMap'](_0x2c083b) {
      if (!_0x2c083b || _0x2c083b['size'] === 0x0) {
        return;
      }
      for (const _0x545480 of _0x2c083b["values"]()) {
        _0x545480 && String(_0x545480)["startsWith"]('blob:') && URL["revokeObjectURL"](_0x545480);
      }
      _0x2c083b["clear"]();
    }
    ["_pruneFixedSlotRefThumbObjectUrls"](_0x65e5f8 = [], _0x32f7dc = {}) {
      const _0x45e6dc = this['_getFixedSlotRefThumbObjectUrlMap']();
      const _0x109d5a = new Set();
      for (const _0x35be74 of _0x65e5f8 || []) {
        const _0x50ef04 = _0x32f7dc?.[_0x35be74?.["sourceId"]];
        if (_0x50ef04?.["thumbId"]) {
          _0x109d5a["add"](_0x50ef04['thumbId']);
        }
      }
      for (const [_0x863bb2, _0x5dd5e7] of _0x45e6dc["entries"]()) {
        if (_0x109d5a["has"](_0x863bb2)) {
          continue;
        }
        _0x5dd5e7 && String(_0x5dd5e7)["startsWith"]("blob:") && URL["revokeObjectURL"](_0x5dd5e7);
        _0x45e6dc["delete"](_0x863bb2);
      }
    }
    ["_resolveFixedMediaUrl"](_0x4cca51) {
      const _0x538f95 = String(_0x4cca51 || '')["trim"]();
      if (!_0x538f95) {
        return '';
      }
      if (typeof this["_resolveMediaUrl"] === 'function') {
        return this["_resolveMediaUrl"](_0x538f95);
      }
      return _0x538f95;
    }
    ["_resolveFixedThumbObjectUrl"](_0x4f3696) {
      const _0x3165ba = String(_0x4f3696 || '')["trim"]();
      if (!_0x3165ba) {
        return '';
      }
      const _0x3d1df1 = this['_getFixedSlotRefThumbObjectUrlMap']();
      if (_0x3d1df1['has'](_0x3165ba)) {
        return _0x3d1df1["get"](_0x3165ba);
      }
      this["_scheduleFixedThumbObjectUrl"](_0x3165ba);
      return '';
    }
    ['_scheduleFixedThumbObjectUrl'](_0x2100a1, _0x2b5dec = this["_getFixedSlotRefThumbObjectUrlMap"]()) {
      const _0x4c59c4 = String(_0x2100a1 || '')["trim"]();
      if (!_0x4c59c4) {
        return;
      }
      if (_0x2b5dec["has"](_0x4c59c4)) {
        return;
      }
      !this["_fixedRefThumbObjectUrlLoads"] && (this['_fixedRefThumbObjectUrlLoads'] = new Map());
      const _0x55e8fe = _0x2b5dec === this["_refThumbObjectUrls"] ? "generic:" + _0x4c59c4 : "fixed:" + _0x4c59c4;
      if (this["_fixedRefThumbObjectUrlLoads"]["has"](_0x55e8fe)) {
        return;
      }
      let _0x59c298 = ![];
      const _0x1421f2 = Promise["resolve"]()["then"](() => _0x5c41ae(_0x4c59c4))["then"](_0x11e97c => {
        if (!_0x11e97c || _0x2b5dec["has"](_0x4c59c4)) {
          return;
        }
        _0x2b5dec["set"](_0x4c59c4, URL["createObjectURL"](_0x11e97c));
        _0x59c298 = !![];
      })['catch'](() => {})["finally"](() => {
        this["_fixedRefThumbObjectUrlLoads"]['delete'](_0x55e8fe);
        if (_0x59c298 && this['refBarEl']) {
          this["_renderRefBar"]();
        }
      });
      this["_fixedRefThumbObjectUrlLoads"]["set"](_0x55e8fe, _0x1421f2);
    }
    ["_createFixedEdgeRefThumbData"](_0x1ec450, _0x2f3615, _0x2dc7b6, _0x510912) {
      const _0x3f6ef8 = String(_0x2dc7b6 || '')['trim']();
      if (!_0x1ec450 || !_0x2f3615 || !_0x3f6ef8) {
        return null;
      }
      if (_0x3f6ef8 === "text") {
        return this["_createTextEdgeRefThumbData"](_0x1ec450, _0x2f3615);
      }
      let _0x525f4f = '';
      let _0x438d73 = '';
      if (_0x3f6ef8 === "image") {
        let _0x3625f6 = this["_resolveFixedMediaUrl"](resolveCanvasImageLowZoomUrl(_0x2f3615));
        !_0x3625f6 && (_0x3625f6 = this['_resolveFixedThumbObjectUrl'](_0x2f3615['thumbId']));
        !_0x3625f6 && _0x2f3615["localPath"] && (_0x3625f6 = this["_resolveFixedMediaUrl"](localPathToUrl(_0x2f3615["localPath"])));
        if (!_0x3625f6) {
          return null;
        }
        _0x2760ae(_0x3625f6);
        _0x525f4f = createReferenceInputThumbnailHtml({
          'kind': "image",
          'thumbnailUrl': _0x3625f6,
          'extraHtml': createReferenceMaskBadgeHtml(_0x2f3615)
        });
        _0x438d73 = 'i|' + _0x3625f6 + '|' + getReferenceMaskSignaturePart(_0x2f3615);
      } else {
        if (_0x3f6ef8 === 'video') {
          const _0x27c287 = a562_0x99b4ef(_0x2f3615, _0x1ec450);
          const _0x37ebd8 = a562_0x1a2835(_0x2f3615, _0x1ec450);
          let _0x44bca5 = this["_resolveFixedMediaUrl"](_0x37ebd8["thumbUrl"] || _0x2f3615["imageUrl"] || '');
          !_0x44bca5 && (_0x44bca5 = this['_resolveFixedThumbObjectUrl'](_0x2f3615["thumbId"]));
          _0x44bca5 ? (_0x2760ae(_0x44bca5), _0x525f4f = createReferenceInputThumbnailHtml({
            'kind': "video",
            'thumbnailUrl': _0x44bca5
          }), _0x438d73 = 'v|' + (_0x27c287 || _0x44bca5)) : (_0x510912?.(_0x1ec450, _0x2f3615), _0x525f4f = createReferenceInputThumbnailHtml({
            'kind': 'video',
            'additionalClassName': "rh-v5-ref-media-fallback"
          }), _0x438d73 = 'v|' + (_0x27c287 || 'fallback'));
        } else {
          if (_0x3f6ef8 === 'audio') {
            const _0x3b46ce = String(_0x2f3615["localPath"] || _0x2f3615["src"] || _0x2f3615["audioUrl"] || '');
            if (!_0x3b46ce) {
              return null;
            }
            _0x525f4f = createRunningHubAudioFallbackThumbHtml();
            _0x438d73 = 'a|' + _0x3b46ce;
          } else {
            return null;
          }
        }
      }
      return {
        'key': "edge:" + _0x1ec450['id'],
        'edgeId': _0x1ec450['id'],
        'kind': _0x3f6ef8,
        'sourceId': _0x1ec450['sourceId'],
        'node': _0x2f3615,
        'edge': _0x1ec450,
        'html': _0x525f4f,
        'thumbHTML': _0x525f4f,
        'sig': _0x1ec450['id'] + '|' + _0x1ec450["sourceId"] + '|' + _0x438d73
      };
    }
    ["_syncFixedSlotEl"](_0x3f5dcc, _0x506d69, _0xabb493, _0x283765) {
      if (!_0x3f5dcc || !_0x506d69) {
        return;
      }
      const _0x18658f = String(_0x283765?.["slotKindById"]?.[_0x506d69] || '')['trim']();
      const _0x1c4b1b = _0x3f5dcc["querySelector"]("[data-slot=\"" + _0x506d69 + '\x22]');
      if (!_0xabb493) {
        let _0x38917b = _0x1c4b1b && _0x1c4b1b['classList']?.['contains']("ref-upload-slot") ? _0x1c4b1b : document["createElement"]("button");
        _0x38917b["className"] = "ref-thumb-wrap ref-upload-slot rh-v5-ref-box";
        _0x38917b["type"] = "button";
        _0x38917b["setAttribute"]("draggable", 'false');
        _0x38917b["setAttribute"]("title", getFixedSlotLabelText(_0x283765, _0x506d69));
        _0x38917b["dataset"]['slot'] = _0x506d69;
        _0x38917b["dataset"]["kind"] = _0x18658f;
        _0x38917b["dataset"]["edgeId"] = '';
        _0x38917b["dataset"]["sourceId"] = '';
        _0x38917b["dataset"]["refOrigin"] = '';
        delete _0x38917b["dataset"]["refKey"];
        delete _0x38917b['dataset']['assetId'];
        delete _0x38917b["dataset"]["assetIndex"];
        delete _0x38917b['dataset']['assetOccurrence'];
        delete _0x38917b["dataset"]["assetRefSource"];
        delete _0x38917b["dataset"]['refType'];
        const _0xab788d = getFixedSlotLabelHtml(_0x283765, _0x506d69);
        const _0xf9b91d = "empty|" + _0x506d69 + '|' + _0x18658f + '|' + _0xab788d;
        _0x38917b["dataset"]["sig"] !== _0xf9b91d && (_0x38917b["innerHTML"] = "<span class=\"ref-upload-label\">" + _0xab788d + "</span>", _0x38917b["dataset"]["sig"] = _0xf9b91d);
        if (_0x1c4b1b && _0x1c4b1b !== _0x38917b) {
          _0x1c4b1b["replaceWith"](_0x38917b);
        } else {
          if (!_0x1c4b1b) {
            _0x3f5dcc["appendChild"](_0x38917b);
          }
        }
        return;
      }
      let _0x210bd5 = _0x1c4b1b && !_0x1c4b1b["classList"]?.['contains']("ref-upload-slot") ? _0x1c4b1b : document["createElement"]("div");
      _0x210bd5["className"] = "ref-thumb-wrap rh-v5-ref-box" + (_0xabb493["virtual"] ? " ref-thumb-wrap--asset" : '');
      _0x210bd5['setAttribute']("draggable", _0xabb493["virtual"] || !_0xabb493["edgeId"] ? "false" : "true");
      const _0x59915d = _0x506d69 + '|' + (_0xabb493["sig"] || '');
      _0x210bd5["dataset"]["sig"] !== _0x59915d && (_0x210bd5["innerHTML"] = '' + _0xabb493["html"] + createRefThumbDeleteButtonHtml(), _0x210bd5["dataset"]['sig'] = _0x59915d, _0x556d25(_0x210bd5, _0x59915d));
      _0x210bd5["dataset"]["slot"] = _0x506d69;
      _0x210bd5["dataset"]['kind'] = _0xabb493["kind"] || _0x18658f;
      _0x210bd5["dataset"]['refKey'] = _0xabb493["key"] || (_0xabb493["edgeId"] ? "edge:" + _0xabb493['edgeId'] : '');
      _0x210bd5["dataset"]["edgeId"] = _0xabb493["edgeId"] || '';
      _0x210bd5["dataset"]["sourceId"] = _0xabb493["sourceId"] || '';
      _0x210bd5["dataset"]["refOrigin"] = _0xabb493["virtual"] ? "asset" : 'node';
      _0xabb493['virtual'] ? (_0x210bd5['dataset']["assetId"] = _0xabb493["assetId"] || '', _0x210bd5['dataset']["assetIndex"] = _0xabb493["assetIndex"] || '', _0x210bd5["dataset"]["assetOccurrence"] = _0xabb493["assetOccurrence"] || '', _0x210bd5["dataset"]["assetRefSource"] = _0xabb493["assetRefSource"] || 'prompt', _0x210bd5["dataset"]["refType"] = _0xabb493["refType"] || _0xabb493['kind'] || _0x18658f) : (delete _0x210bd5["dataset"]["assetId"], delete _0x210bd5["dataset"]["assetIndex"], delete _0x210bd5["dataset"]['assetOccurrence'], delete _0x210bd5["dataset"]['assetRefSource'], delete _0x210bd5["dataset"]['refType']);
      if (_0x1c4b1b && _0x1c4b1b !== _0x210bd5) {
        _0x1c4b1b["replaceWith"](_0x210bd5);
      } else {
        if (!_0x1c4b1b) {
          _0x3f5dcc["appendChild"](_0x210bd5);
        }
      }
    }
    ['_syncFixedSlotOrder'](_0x4c112a, _0x25b8d3 = []) {
      if (!_0x4c112a) {
        return;
      }
      const _0x32b104 = _0x4c112a['querySelector'](".rh-fixed-extra-ref");
      (Array["isArray"](_0x25b8d3) ? _0x25b8d3 : [])["forEach"](_0x43f45f => {
        const _0x4cf657 = _0x4c112a["querySelector"]('[data-slot=\x22' + _0x43f45f + '\x22]');
        if (!_0x4cf657) {
          return;
        }
        _0x32b104 && typeof _0x4c112a["insertBefore"] === 'function' ? _0x4c112a["insertBefore"](_0x4cf657, _0x32b104) : _0x4c112a["appendChild"](_0x4cf657);
      });
    }
    ["_syncSingleReferenceEditorRatio"](_0x1d46bb, _0x3fb268, _0x20f3bb = {}) {
      const _0x2910b7 = resolveFixedInputDisplayRatioSlot(_0x1d46bb, _0x3fb268);
      const _0x5c297f = _0x2910b7?.['slot'] || '';
      if (!_0x5c297f || !_0x3fb268?.[_0x5c297f]) {
        return;
      }
      const _0x284529 = getFixedInputRatioMediaSize(_0x3fb268[_0x5c297f], _0x20f3bb);
      const _0x42a92d = calcFixedInputDisplaySize(_0x284529?.['width'], _0x284529?.["height"]);
      if (!_0x42a92d) {
        return;
      }
      const _0xdf0f25 = typeof _0x4a6811["getStateRaw"] === "function" ? _0x4a6811["getStateRaw"]() : _0x4a6811['getState']?.();
      const _0x58a5c1 = _0xdf0f25?.["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x450d48 = Number(_0x58a5c1["width"]) || 0x12c;
      const _0xaab177 = Number(_0x58a5c1['height']) || 0x12c;
      const _0x1fe2cf = Number["isFinite"](Number(_0x58a5c1['x'])) ? Number(_0x58a5c1['x']) : 0x0;
      const _0x50de5e = Number['isFinite'](Number(_0x58a5c1['y'])) ? Number(_0x58a5c1['y']) : 0x0;
      const _0x1eba24 = _0x42a92d["width"];
      const _0x33502e = _0x42a92d["height"];
      const _0x12283f = _0x1eba24 - _0x450d48;
      const _0x35d1cc = _0x33502e - _0xaab177;
      (_0x12283f !== 0x0 || _0x35d1cc !== 0x0) && armImageSchemaRatioResizeAnimation(this, this["nodeId"], a562_0x16e0da);
      const _0x4cf7eb = {
        'width': _0x1eba24,
        'height': _0x33502e,
        'x': Math["round"](_0x1fe2cf - _0x12283f / 0x2),
        'y': Math["round"](_0x50de5e - _0x35d1cc),
        'aspectRatio': '自适应'
      };
      const _0x5ec710 = Number(_0x58a5c1['width']) !== _0x4cf7eb['width'] || Number(_0x58a5c1["height"]) !== _0x4cf7eb["height"] || Number(_0x58a5c1['x']) !== _0x4cf7eb['x'] || Number(_0x58a5c1['y']) !== _0x4cf7eb['y'] || String(_0x58a5c1['aspectRatio'] || '') !== _0x4cf7eb["aspectRatio"];
      if (_0x5ec710) {
        _0x4a6811["updateNodeData"](this['nodeId'], _0x4cf7eb);
      }
      this["_data"] = {
        ..._0x58a5c1,
        ..._0x4cf7eb
      };
      const _0xcf1084 = this["footerEl"]?.["querySelector"](".img-ratio-label");
      const _0x590f4e = this['footerEl']?.["querySelector"]('.img-ratio-icon-slot');
      if (_0xcf1084 && _0x2910b7['mode'] === "sourceVideoFrames") {
        const _0xd47398 = normalizeRhV54Fps(this["_data"]?.["rhVideoFps"]);
        const _0x110602 = Number["isFinite"](this["_data"]?.["rhVideoFrames"]) ? Math["max"](0x0, Math["trunc"](this["_data"]["rhVideoFrames"])) : 0x4d;
        const _0xd7c721 = normalizeRhVideoResolution(this["_data"]?.["rhVideoResolution"]);
        const _0x51b0f3 = _0x110602 === 0x0 ? referenceInputText("fullLength") : String(_0x110602);
        _0xcf1084["textContent"] = referenceInputText("sourceVideoFramesLabel", {
          'frames': _0x51b0f3,
          'fps': _0xd47398,
          'resolution': _0xd7c721
        });
      }
      _0x590f4e && typeof this["_getRatioIconHTML"] === 'function' && (_0x590f4e["innerHTML"] = this["_getRatioIconHTML"]("自适应"));
      (_0x12283f !== 0x0 || _0x35d1cc !== 0x0) && this["previewEl"] && typeof this["previewEl"]["animate"] === "function" && animateImageSchemaRatioResizeFlip(this, {
        'nodeId': this["nodeId"],
        'previewEl': this["previewEl"],
        'nodeData': {
          'width': _0x450d48,
          'height': _0xaab177
        },
        'patch': {
          'width': _0x1eba24,
          'height': _0x33502e
        },
        'ms': a562_0x16e0da,
        'deferStart': ![],
        'forceLayout': ![]
      });
    }
    async ["_renderManifestFixedRefBar"]({
      fixedInputConfig: _0x375269,
      inEdges: _0x5c505e,
      nodes: _0x5241ab,
      nodeData: _0x5da494,
      attachBtnHTML: _0x3b4c7f,
      ensureVideoThumb: _0xcb60bb
    }) {
      const _0xcfbe2d = (_0x375269?.['visibleSlots'] || [])["map"](_0x28f7f8 => String(_0x28f7f8 || '')["trim"]())['filter'](Boolean);
      if (!_0xcfbe2d['length']) {
        return ![];
      }
      this["_pruneFixedSlotRefThumbObjectUrls"](_0x5c505e, _0x5241ab);
      const _0x5de085 = new Set(_0xcfbe2d);
      const _0x41dfa7 = {};
      _0xcfbe2d["forEach"](_0x5c8f9f => {
        _0x41dfa7[_0x5c8f9f] = null;
      });
      const _0x4966a6 = [];
      const _0x55c22e = {
        'text': 0x0,
        'image': 0x0,
        'video': 0x0,
        'audio': 0x0
      };
      const _0x187aa2 = {};
      const _0x678b83 = [];
      for (const _0x2e1e5b of _0x5c505e || []) {
        const _0x31abe1 = _0x5241ab?.[_0x2e1e5b?.['sourceId']];
        if (!_0x31abe1) {
          continue;
        }
        const _0x33c69b = resolveEffectiveInputKind(_0x31abe1, _0x2e1e5b) || 'image';
        _0x55c22e[_0x33c69b] = Number(_0x55c22e[_0x33c69b] || 0x0) + 0x1;
        _0x187aa2[_0x2e1e5b["sourceId"]] = '@' + (getFixedRefKindLabel(_0x33c69b) || _0x33c69b) + _0x55c22e[_0x33c69b];
        if (_0x33c69b === "text") {
          const _0x162fc4 = this["_createTextEdgeRefThumbData"](_0x2e1e5b, _0x31abe1);
          if (_0x162fc4) {
            _0x4966a6["push"](_0x162fc4);
          }
          continue;
        }
        const _0x29896a = resolveFixedInputSlotForRef({
          'fixedInputConfig': _0x375269,
          'refSlot': _0x2e1e5b?.["refSlot"],
          'kind': _0x33c69b,
          'occupiedSlots': _0x41dfa7,
          'sourceNode': _0x31abe1
        });
        const _0x7109de = _0x29896a['slot'];
        if (_0x29896a["reason"] === 'kindMismatch') {
          continue;
        }
        if (_0x29896a["reason"] === "hidden" || _0x29896a["reason"] === "slotConstraint") {
          if (_0x2e1e5b?.['id']) {
            _0x678b83["push"](_0x2e1e5b['id']);
          }
          continue;
        }
        if (!_0x7109de || _0x41dfa7[_0x7109de]) {
          const _0x244b8f = this['_createFixedEdgeRefThumbData'](_0x2e1e5b, _0x31abe1, _0x33c69b, _0xcb60bb);
          if (_0x244b8f) {
            _0x4966a6["push"](_0x244b8f);
          }
          continue;
        }
        const _0x40bad6 = this["_createFixedEdgeRefThumbData"](_0x2e1e5b, _0x31abe1, _0x33c69b, _0xcb60bb);
        if (_0x40bad6) {
          _0x41dfa7[_0x7109de] = _0x40bad6;
        }
      }
      _0x678b83['length'] > 0x0 && (typeof _0x4a6811['batch'] === "function" ? _0x4a6811["batch"](() => {
        _0x678b83["forEach"](_0x3e6a90 => _0x4a6811["removeEdge"](_0x3e6a90));
      }) : _0x678b83["forEach"](_0x5a70df => _0x4a6811["removeEdge"](_0x5a70df)));
      const _0x714d7a = new Set(Object['entries'](_0x41dfa7)["filter"](([, _0x5713f1]) => !!_0x5713f1)["map"](([_0x4715f9]) => _0x4715f9));
      const _0x2802ee = buildFixedInputAssetSlotMap(this['promptEl'], {
        'slotOrderByType': _0x375269?.["slotOrderByType"] || {},
        'visibleSlots': _0xcfbe2d,
        'exclusiveGroups': _0x375269?.["exclusiveGroups"] || [],
        'slotById': _0x375269?.["slotById"] || {},
        'occupiedSlots': _0x714d7a,
        'nodeData': _0x5da494
      });
      _0xcfbe2d['forEach'](_0x13a5cc => {
        if (_0x41dfa7[_0x13a5cc]) {
          return;
        }
        const _0x5a804a = this["_createAssetRefThumbData"](_0x2802ee[_0x13a5cc], {
          'slot': _0x13a5cc
        });
        if (_0x5a804a) {
          _0x41dfa7[_0x13a5cc] = _0x5a804a;
        }
      });
      getAssetInputRefsFromPrompt(this["promptEl"], {
        'allowedTypes': ["text"]
      })["forEach"]((_0x513939, _0x1e0922) => {
        const _0x2b224f = this["_createAssetRefThumbData"](_0x513939, {
          'key': "asset-text:" + String(_0x513939["assetId"] || '') + ':' + String(_0x513939["itemIndex"] ?? '') + ':' + _0x1e0922
        });
        if (_0x2b224f) {
          _0x4966a6["push"](_0x2b224f);
        }
      });
      this["refBarEl"]["classList"]["add"]('active', "rh-v5-refbar");
      let _0x114c7f = this["refBarEl"]["querySelector"](".rh-v5-ref-container");
      const _0x514afe = !_0x114c7f || !this['refBarEl']["querySelector"](".prompt-attachment-btn");
      if (_0x514afe) {
        const _0x48266d = String(_0x375269?.["manifest"]?.["displayName"] || '')["trim"]() || String(_0x375269?.["manifest"]?.["label"] || '')['trim']() || referenceInputText('fixedInputs');
        const _0x1b2722 = renderVideoFixedInputSlotsMarkup({
          'fixedInputConfig': _0x375269
        });
        this['refBarEl']['innerHTML'] = _0x3b4c7f + " <div class=\"ref-thumb-container rh-v5-ref-container\" aria-label=\"" + escapeHtmlAttr(referenceInputText('fixedInputsAria', {
          'label': _0x48266d
        })) + '\x22>' + _0x1b2722 + "</div>";
        _0x114c7f = this["refBarEl"]['querySelector'](".rh-v5-ref-container");
      } else {
        const _0xd55e85 = String(_0x375269?.["manifest"]?.["displayName"] || '')["trim"]() || String(_0x375269?.["manifest"]?.["label"] || '')["trim"]() || referenceInputText("fixedInputs");
        _0x114c7f["setAttribute"]("aria-label", referenceInputText("fixedInputsAria", {
          'label': _0xd55e85
        }));
      }
      const _0x29dfed = Array["from"](_0x114c7f?.["querySelectorAll"]?.("[data-slot]") || [])['filter'](_0x497274 => !_0x5de085["has"](String(_0x497274?.["dataset"]?.["slot"] || '')));
      _0x29dfed["forEach"](_0x204e98 => _0x204e98['remove']());
      _0xcfbe2d["forEach"](_0x4bd7b9 => {
        this["_syncFixedSlotEl"](_0x114c7f, _0x4bd7b9, _0x41dfa7[_0x4bd7b9], _0x375269);
      });
      this["_syncFixedSlotOrder"](_0x114c7f, _0xcfbe2d);
      this["_syncFixedTrailingRefItems"](_0x114c7f, _0x4966a6);
      this["_bindFixedSlotDragSwap"](_0x114c7f, getFixedSlotAcceptMap(_0x375269));
      this["_syncSingleReferenceEditorRatio"](_0x375269, _0x41dfa7, _0x5241ab);
      this["_syncBtnIconState"]();
      _0xc081a8(this, _0x187aa2);
      return !![];
    }
    async ["_renderRefBar"]() {
      if (!this["refBarEl"]) {
        return;
      }
      if (this["_rendererMediaDeferred"] === !![]) {
        this["_renderRefBarPendingWhenVisible"] = !![];
        return;
      }
      if (this["_renderRefBarLock"]) {
        this['_renderRefBarPending'] = !![];
        return;
      }
      this["_renderRefBarLock"] = !![];
      this['_renderRefBarPending'] = ![];
      try {
        await this["_renderRefBarImpl"]();
      } finally {
        this['_renderRefBarLock'] = ![];
        this["_renderRefBarPending"] && (this["_renderRefBarPending"] = ![], this["_renderRefBar"]());
      }
    }
    async ["_renderRefBarImpl"]() {
      if (!this["refBarEl"]) {
        return;
      }
      const _0x2ec0b8 = _0x4a6811["getIncomingEdges"](this["nodeId"]);
      const _0x22aaf8 = _0x4a6811["getState"]()["nodes"];
      const _0x150e71 = _0x22aaf8?.[this["nodeId"]] || this['_data'] || null;
      const _0x25a0bf = getFixedInputSlotConfigFromManifest(_0x150e71 || {});
      const _0x80d164 = shouldHideFixedInputSlots(_0x25a0bf) ? null : _0x25a0bf;
      const _0x426071 = createPromptAttachmentButtonHTML({
        'stroke': "var(--white-90)"
      });
      const _0x4402f9 = (_0x47006e, _0x4da15a) => {
        const _0xdcdd95 = String(_0x47006e?.["sourceId"] || '');
        if (!_0xdcdd95) {
          return;
        }
        const _0x1973e3 = String(_0x47006e?.["refSlot"] || 'sourceVideo');
        const _0x41c0be = a562_0x40f3af(_0x4da15a, _0x47006e);
        if (!_0x41c0be) {
          return;
        }
        if (!(_0x41c0be['startsWith']("/output/") || _0x41c0be["startsWith"]('/data/'))) {
          return;
        }
        const _0x4d2296 = (() => {
          if (String(_0x4da15a?.["type"] || '') === "ai-video") {
            const _0x44f87a = a562_0x3bf827(_0x4da15a, _0x47006e);
            return String(_0x44f87a?.["item"]?.["videoThumbUnavailableSource"] || '')["trim"]();
          }
          return String(_0x4da15a?.["videoThumbUnavailableSource"] || '')['trim']();
        })();
        if (_0x4d2296 === _0x41c0be) {
          return;
        }
        const _0x3c6695 = _0x1973e3 + '|' + _0xdcdd95 + '|' + _0x41c0be;
        if (this["_videoThumbPending"]["has"](_0x3c6695)) {
          return;
        }
        this["_videoThumbPending"]["add"](_0x3c6695);
        _0x321d25["fetchVideoFirstFrameThumbFromServer"](_0x41c0be, {
          'nodeId': _0xdcdd95,
          'assetId': String(_0x47006e?.["sourceMediaKey"] || _0x47006e?.['id'] || '')
        })['then'](_0x244ea1 => {
          const _0x193b25 = String(_0x244ea1?.["url"] || '')['trim']();
          if (!_0x193b25) {
            return;
          }
          const _0x114314 = _0x4a6811["getState"]();
          const _0x5b3586 = _0x114314['nodes']?.[_0xdcdd95];
          if (!_0x5b3586) {
            return;
          }
          if (String(_0x5b3586['type'] || '') === 'ai-video') {
            const _0x1b889d = a562_0x3bf827(_0x5b3586, _0x47006e);
            const _0x4b9484 = Number(_0x1b889d["index"]);
            const _0x4b068b = Array["isArray"](_0x5b3586["videos"]) ? _0x5b3586["videos"] : [];
            if (!(_0x4b9484 >= 0x0 && _0x4b9484 < _0x4b068b["length"])) {
              return;
            }
            const _0x349599 = _0x4b068b[_0x4b9484] || null;
            if (!_0x349599 || typeof _0x349599 !== "object") {
              return;
            }
            if (String(_0x349599['thumbUrl'] || '')["trim"]()) {
              return;
            }
            const _0x1a8ec0 = {
              ..._0x349599,
              'thumbUrl': _0x193b25,
              'videoThumbUnavailableSource': ''
            };
            const _0x2da8a1 = _0x4b068b["slice"]();
            _0x2da8a1[_0x4b9484] = _0x1a8ec0;
            const _0x5ac8cc = {
              'videos': _0x2da8a1
            };
            const _0x228ac7 = Number(_0x5b3586["mainVideoIndex"]);
            const _0x1683f1 = Number["isFinite"](_0x228ac7) ? Math["max"](0x0, Math['trunc'](_0x228ac7)) : 0x0;
            if (_0x4b9484 === _0x1683f1) {
              _0x5ac8cc['videoThumbUnavailableSource'] = '';
            }
            if (_0x4b9484 === _0x1683f1 && !String(_0x5b3586["thumbUrl"] || '')["trim"]()) {
              _0x5ac8cc["thumbUrl"] = _0x193b25;
            }
            _0x4a6811["updateNodeData"](_0xdcdd95, _0x5ac8cc);
          } else {
            if (String(_0x5b3586['thumbUrl'] || '')["trim"]()) {
              return;
            }
            _0x4a6811['updateNodeData'](_0xdcdd95, {
              'thumbUrl': _0x193b25,
              'videoThumbUnavailableSource': ''
            });
          }
        })["catch"](() => {
          const _0x315efd = _0x4a6811["getState"]();
          const _0x5c8cf1 = _0x315efd["nodes"]?.[_0xdcdd95];
          if (!_0x5c8cf1) {
            return;
          }
          if (a562_0x40f3af(_0x5c8cf1, _0x47006e) !== _0x41c0be) {
            return;
          }
          if (String(_0x5c8cf1["type"] || '') === "ai-video") {
            const _0x5e8b28 = a562_0x3bf827(_0x5c8cf1, _0x47006e);
            const _0x2566bb = Number(_0x5e8b28['index']);
            const _0xcc3af = Array["isArray"](_0x5c8cf1["videos"]) ? _0x5c8cf1["videos"] : [];
            if (!(_0x2566bb >= 0x0 && _0x2566bb < _0xcc3af['length'])) {
              return;
            }
            const _0x173512 = _0xcc3af[_0x2566bb] || null;
            if (!_0x173512 || typeof _0x173512 !== "object") {
              return;
            }
            const _0x52f59f = _0xcc3af["slice"]();
            _0x52f59f[_0x2566bb] = {
              ..._0x173512,
              'videoThumbUnavailableSource': _0x41c0be,
              'thumbUrl': ''
            };
            const _0x78858d = {
              'videos': _0x52f59f
            };
            const _0x4ad37c = Number(_0x5c8cf1["mainVideoIndex"]);
            const _0x3f0c4c = Number["isFinite"](_0x4ad37c) ? Math['max'](0x0, Math["trunc"](_0x4ad37c)) : 0x0;
            _0x2566bb === _0x3f0c4c && (_0x78858d['videoThumbUnavailableSource'] = _0x41c0be, _0x78858d["thumbUrl"] = '');
            _0x4a6811["updateNodeData"](_0xdcdd95, _0x78858d);
          } else {
            _0x4a6811["updateNodeData"](_0xdcdd95, {
              'videoThumbUnavailableSource': _0x41c0be,
              'thumbUrl': ''
            });
          }
        })["finally"](() => {
          this["_videoThumbPending"]['delete'](_0x3c6695);
        });
      };
      const _0x2f1c76 = getFixedRefBarLayoutKey(_0x80d164);
      this['_refBarLayoutKey'] !== _0x2f1c76 && (this["_refBarLayoutKey"] = _0x2f1c76, this["refBarEl"]['classList']["remove"]("active", "rh-v5-refbar"), this["refBarEl"]["innerHTML"] = '', !_0x80d164 && this["_clearObjectUrlMap"](this["_getFixedSlotRefThumbObjectUrlMap"]()), _0x2f1c76 !== "generic" && this["_clearObjectUrlMap"](this['_refThumbObjectUrls']));
      if (_0x80d164) {
        await this["_renderManifestFixedRefBar"]({
          'fixedInputConfig': _0x80d164,
          'inEdges': _0x2ec0b8,
          'nodes': _0x22aaf8,
          'nodeData': _0x150e71,
          'attachBtnHTML': _0x426071,
          'ensureVideoThumb': _0x4402f9
        });
        return;
      }
      const _0x2fd329 = getAssetInputRefsFromPromptAndNode(this['promptEl'], {
        'nodeData': _0x150e71,
        'allowedTypes': ["text", "image", "video", 'audio'],
        'dedupe': !![]
      });
      if (_0x2ec0b8['length'] === 0x0 && _0x2fd329["length"] === 0x0) {
        this["refBarEl"]["classList"]["remove"]("rh-v5-refbar");
        this["refBarEl"]["classList"]['remove']("active");
        this["refBarEl"]["innerHTML"] = _0x426071;
        this['_syncBtnIconState']();
        _0xc081a8(this, {});
        return;
      }
      const _0x5e214e = new Set();
      for (const _0xe2d1d9 of _0x2ec0b8) {
        const _0x395109 = _0x22aaf8?.[_0xe2d1d9['sourceId']];
        if (_0x395109?.["thumbId"]) {
          _0x5e214e["add"](_0x395109["thumbId"]);
        }
      }
      for (const [_0x59a6a8, _0x638cc3] of this["_refThumbObjectUrls"]["entries"]()) {
        !_0x5e214e["has"](_0x59a6a8) && (_0x638cc3 && String(_0x638cc3)['startsWith']("blob:") && URL['revokeObjectURL'](_0x638cc3), this["_refThumbObjectUrls"]["delete"](_0x59a6a8));
      }
      let _0x48bcea = [];
      const _0x1fda77 = {
        'text': 0x0,
        'image': 0x0,
        'video': 0x0,
        'audio': 0x0
      };
      const _0x14805b = {};
      const _0x54708c = {
        'text': referenceInputText("kind.text"),
        'image': referenceInputText("kind.image"),
        'video': referenceInputText("kind.video"),
        'audio': referenceInputText("kind.audio")
      };
      for (const _0x23da61 of _0x2ec0b8) {
        const _0x47ea18 = _0x22aaf8[_0x23da61["sourceId"]];
        if (!_0x47ea18) {
          continue;
        }
        const _0x3e703a = resolveEffectiveInputKind(_0x47ea18, _0x23da61) || "image";
        if (_0x3e703a === "text") {
          const _0x4d2faa = String(_0x47ea18['outputText'] || _0x47ea18["text"] || _0x47ea18['content'] || _0x47ea18["prompt"] || '')["trim"]();
          if (!_0x4d2faa) {
            continue;
          }
        } else {
          if (_0x3e703a === 'image') {
            const _0x2623e4 = !!_0x47ea18["thumbId"] || !!_0x47ea18["thumbUrl"] || !!_0x47ea18["imageUrl"] || !!_0x47ea18["src"] || !!_0x47ea18["localPath"];
            if (!_0x2623e4) {
              continue;
            }
          } else {
            if (_0x3e703a === "video") {
              const _0x59b54b = Array["isArray"](_0x47ea18['videos']) && _0x47ea18["videos"]["length"] > 0x0 || !!_0x47ea18["thumbId"] || !!_0x47ea18["thumbUrl"] || !!_0x47ea18["videoUrl"] || !!_0x47ea18["displayLocalPath"] || !!_0x47ea18['originalLocalPath'] || !!_0x47ea18["videoLocalPath"] || !!_0x47ea18["src"] || !!_0x47ea18['localPath'] || !!_0x47ea18['url'] || !!_0x47ea18["resultUrl"] || !!_0x47ea18["sourceUrl"];
              if (!_0x59b54b) {
                continue;
              }
            } else {
              if (_0x3e703a === "audio") {
                const _0x283b36 = !!_0x47ea18["audioUrl"] || !!_0x47ea18["src"] || !!_0x47ea18["localPath"];
                if (!_0x283b36) {
                  continue;
                }
              }
            }
          }
        }
        let _0x2f5a9d = '';
        let _0x4af6a0 = '';
        if (_0x3e703a === 'image') {
          let _0xf0ec3a = this["_resolveMediaUrl"](resolveCanvasImageLowZoomUrl(_0x47ea18));
          _0x47ea18["thumbId"] && !this["_refThumbObjectUrls"]["has"](_0x47ea18['thumbId']) && this["_scheduleFixedThumbObjectUrl"](_0x47ea18["thumbId"], this['_refThumbObjectUrls']);
          !_0xf0ec3a && _0x47ea18["thumbId"] && (_0xf0ec3a = this["_refThumbObjectUrls"]["get"](_0x47ea18["thumbId"]) || '');
          !_0xf0ec3a && (_0xf0ec3a = this["_resolveMediaUrl"](localPathToUrl(_0x47ea18["localPath"])));
          if (!_0xf0ec3a) {
            continue;
          }
          _0x2760ae(_0xf0ec3a);
          _0x2f5a9d = createReferenceInputThumbnailHtml({
            'kind': "image",
            'thumbnailUrl': _0xf0ec3a,
            'extraHtml': createReferenceMaskBadgeHtml(_0x47ea18)
          });
          _0x4af6a0 = 'i|' + _0xf0ec3a + '|' + getReferenceMaskSignaturePart(_0x47ea18);
        } else {
          if (_0x3e703a === "video") {
            const _0x287dc9 = a562_0x1a2835(_0x47ea18, _0x23da61);
            const _0x4bf381 = this["_resolveMediaUrl"](_0x287dc9["thumbUrl"] || _0x47ea18["imageUrl"] || '');
            _0x4bf381 ? (_0x2760ae(_0x4bf381), _0x2f5a9d = createReferenceInputThumbnailHtml({
              'kind': 'video',
              'thumbnailUrl': _0x4bf381
            }), _0x4af6a0 = 'v|' + _0x4bf381) : (_0x4402f9(_0x23da61, _0x47ea18), _0x2f5a9d = createReferenceInputThumbnailHtml({
              'kind': "video"
            }), _0x4af6a0 = "v|fallback");
          } else {
            _0x2f5a9d = createReferenceInputThumbnailHtml({
              'kind': _0x3e703a
            });
            _0x4af6a0 = _0x3e703a + "|fallback";
          }
        }
        _0x1fda77[_0x3e703a]++;
        const _0x480ad6 = '@' + _0x54708c[_0x3e703a] + _0x1fda77[_0x3e703a];
        _0x14805b[_0x23da61['sourceId']] = _0x480ad6;
        const _0x4574fb = _0x23da61['id'] + '|' + _0x23da61['sourceId'] + '|' + _0x4af6a0;
        _0x48bcea["push"]({
          'key': "edge:" + _0x23da61['id'],
          'edgeId': _0x23da61['id'],
          'sourceId': _0x23da61["sourceId"],
          'sig': _0x4574fb,
          'thumbHTML': _0x2f5a9d
        });
      }
      _0x2fd329["forEach"]((_0x1d4092, _0x28176c) => {
        const _0x40079c = String(_0x1d4092?.["type"] || '')['trim']();
        if (!_0x40079c) {
          return;
        }
        let _0x3f14b7 = '';
        let _0x3ba9ad = '';
        if (_0x40079c === 'image') {
          const _0x452533 = this["_resolveMediaUrl"](_0x1d4092["thumbUrl"] || _0x1d4092['url'] || '');
          if (!_0x452533) {
            return;
          }
          _0x2760ae(_0x452533);
          _0x3f14b7 = createReferenceInputThumbnailHtml({
            'kind': "image",
            'thumbnailUrl': _0x452533
          });
          _0x3ba9ad = "asset-i|" + _0x452533;
        } else {
          if (_0x40079c === "video") {
            const _0x686b2 = this["_resolveMediaUrl"](_0x1d4092["thumbUrl"] || '');
            _0x686b2 ? (_0x2760ae(_0x686b2), _0x3f14b7 = createReferenceInputThumbnailHtml({
              'kind': 'video',
              'thumbnailUrl': _0x686b2
            }), _0x3ba9ad = 'asset-v|' + _0x686b2) : (_0x3f14b7 = createReferenceInputThumbnailHtml({
              'kind': "video"
            }), _0x3ba9ad = 'asset-v|fallback');
          } else {
            _0x3f14b7 = createReferenceInputThumbnailHtml({
              'kind': _0x40079c
            });
            _0x3ba9ad = "asset-" + _0x40079c + "|fallback";
          }
        }
        const _0x500414 = String(_0x1d4092["assetId"] || '');
        const _0x27d17f = String(_0x1d4092['itemIndex'] ?? '');
        const _0x99acb3 = String(_0x1d4092["assetMentionOccurrence"] ?? '');
        const _0x18e10f = String(_0x1d4092['assetRefSource'] || "prompt");
        const _0x1d1473 = "asset:" + _0x500414 + ':' + _0x27d17f;
        _0x48bcea["push"]({
          'key': 'asset:' + _0x500414 + ':' + _0x27d17f + ':' + _0x40079c + ':' + _0x28176c,
          'edgeId': '',
          'sourceId': _0x1d1473,
          'sig': _0x1d1473 + '|' + _0x40079c + '|' + String(_0x1d4092["url"] || '') + '|' + _0x3ba9ad,
          'thumbHTML': _0x3f14b7,
          'virtual': !![],
          'assetId': _0x500414,
          'assetIndex': _0x27d17f,
          'assetOccurrence': _0x99acb3,
          'assetRefSource': _0x18e10f,
          'refType': _0x40079c
        });
      });
      if (_0x48bcea['length'] === 0x0) {
        this["refBarEl"]["classList"]["remove"]('rh-v5-refbar');
        this['refBarEl']["classList"]["remove"]("active");
        this["refBarEl"]["innerHTML"] = _0x426071;
        this["_syncBtnIconState"]();
        _0xc081a8(this, {});
        return;
      }
      if (this["_isDraggingSorting"]) {
        this["_syncBtnIconState"]();
        _0xc081a8(this, _0x14805b);
        return;
      }
      this["refBarEl"]["classList"]['remove']("rh-v5-refbar");
      this["refBarEl"]['classList']['add']("active");
      let _0x319699 = this['refBarEl']["querySelector"](".ref-thumb-container");
      (!this["refBarEl"]["querySelector"]('.prompt-attachment-btn') || !_0x319699) && (this["refBarEl"]["innerHTML"] = _0x426071 + " <div class=\"ref-thumb-container\"></div>", _0x319699 = this['refBarEl']["querySelector"](".ref-thumb-container"));
      const _0x5ac860 = new Map();
      _0x319699["querySelectorAll"](".ref-thumb-wrap")['forEach'](_0xed3699 => _0x5ac860["set"](_0xed3699["dataset"]["refKey"] || "edge:" + _0xed3699["dataset"]['edgeId'], _0xed3699));
      const _0x27cf14 = new Set();
      for (let _0x4783c4 = 0x0; _0x4783c4 < _0x48bcea["length"]; _0x4783c4++) {
        const _0x30cac8 = _0x48bcea[_0x4783c4];
        let _0x261cf9 = _0x5ac860["get"](_0x30cac8["key"]);
        !_0x261cf9 && (_0x261cf9 = document["createElement"]("div"), _0x261cf9["className"] = "ref-thumb-wrap" + (_0x30cac8['virtual'] ? " ref-thumb-wrap--asset" : ''));
        _0x261cf9["setAttribute"]('draggable', _0x30cac8["virtual"] ? "false" : "true");
        _0x261cf9["dataset"]["sig"] !== _0x30cac8["sig"] && (_0x261cf9["innerHTML"] = '' + _0x30cac8["thumbHTML"] + createRefThumbDeleteButtonHtml(), _0x261cf9["dataset"]["sig"] = _0x30cac8['sig'], _0x556d25(_0x261cf9, _0x30cac8["sig"]));
        _0x261cf9["dataset"]["refKey"] = _0x30cac8["key"];
        _0x261cf9["dataset"]["edgeId"] = _0x30cac8["edgeId"];
        _0x261cf9["dataset"]["sourceId"] = _0x30cac8["sourceId"];
        _0x261cf9["dataset"]["refOrigin"] = _0x30cac8['virtual'] ? "asset" : "node";
        _0x30cac8['virtual'] ? (_0x261cf9["dataset"]["assetId"] = _0x30cac8['assetId'] || '', _0x261cf9["dataset"]["assetIndex"] = _0x30cac8["assetIndex"] || '', _0x261cf9["dataset"]["assetOccurrence"] = _0x30cac8['assetOccurrence'] || '', _0x261cf9["dataset"]['assetRefSource'] = _0x30cac8["assetRefSource"] || "prompt", _0x261cf9["dataset"]["refType"] = _0x30cac8["refType"] || '') : (delete _0x261cf9['dataset']["assetId"], delete _0x261cf9["dataset"]['assetIndex'], delete _0x261cf9['dataset']["assetOccurrence"], delete _0x261cf9['dataset']["assetRefSource"], delete _0x261cf9["dataset"]["refType"]);
        _0x319699['appendChild'](_0x261cf9);
        _0x27cf14["add"](_0x30cac8["key"]);
      }
      for (const [_0x542fee, _0x5ab457] of _0x5ac860["entries"]()) {
        if (!_0x27cf14["has"](_0x542fee)) {
          _0x5ab457["remove"]();
        }
      }
      this['_bindDragSort'](this["refBarEl"]);
      this["_syncBtnIconState"]();
      _0xc081a8(this, _0x14805b);
    }
    ["_bindFixedSlotDragSwap"](_0x3797f6, _0x23f086) {
      bindRefThumbFixedSlotDrag({
        'owner': this,
        'container': _0x3797f6,
        'store': _0x4a6811,
        'nodeId': this['nodeId'],
        'acceptMap': _0x23f086
      });
    }
    ['_bindDragSort'](_0x4994e5) {
      bindRefThumbOrderDrag({
        'owner': this,
        'container': _0x4994e5,
        'store': _0x4a6811,
        'nodeId': this["nodeId"]
      });
    }
  }
  return _0x3c9a9e["prototype"];
}