import a368_0x270436 from '../core/stores/appStore.js';
import { getDisplayModelName } from '../modules/providers.js';
import { ensureThumbDecoded, revealRefThumbMedia } from '../modules/refThumbMediaReveal.js';
import { commit } from '../modules/history.js';
import { TEXT_TOOLBAR_HTML, bindTextToolbarEvents } from './NodeToolbarConfig.js';
import { getPromptPresets, openCustomPresetsManager } from '../modules/promptPresets.js';
import { startLoading, stopLoading } from '../modules/loadingOverlay.js';
import { buildGenerateTextRequest, generateText } from '../../api/aiTextApi.js';
import { getCustomTextModels, saveCustomTextModels } from './aigenText/customTextModels.js';
import { bindRefThumbHoverPreview } from '../modules/refThumbHoverPreview.js';
import { createReferenceMaskBadgeHtml } from '../modules/refThumbMaskBadge.js';
import { createReferenceInputThumbnailHtml, resolveReferenceVideoThumbnail } from '../modules/referenceInputThumbnail.js';
import { localPathToUrl } from '../utils/localMediaPath.js';
import { t as a368_0x21d6b9 } from '../i18n/index.js';
import { checkSlashTrigger, handleSlashKeyboardNavigation, closeSlashMenu } from '../modules/slashMenu.js';
import { activateMenuKeyboard } from '../modules/floatingMenuKeyboard.js';
import { createPromptAttachmentButtonHTML } from './refAttachmentButton.js';
import { _checkAtTrigger, _populateMentionMenu, _handleMentionMenuKeyboard, _handlePillKeyboard, _rehydratePromptPills, _handlePillHover, _handlePillOut, _syncEdgesOrderFromPills, _syncPillLabels, flushPromptHtmlCommit, handlePromptPaste, handlePromptSelectAll, schedulePromptHtmlCommit } from '../modules/nodePromptShared.js';
import { createAIGenTextNodeUiModule } from './aigenText/uiModule.js';
import { createAIGenTextNodeStateSyncModule } from './aigenText/stateSyncModule.js';
import { createAIGenTextNodeTaskOrchestrationModule } from './aigenText/taskOrchestrationModule.js';
const api = {
  'buildGenerateTextRequest': buildGenerateTextRequest,
  'generateText': generateText
};
const AI_GEN_TEXT_NODE_MODULE_DEPS = {
  'store': a368_0x270436,
  'api': api,
  'getDisplayModelName': getDisplayModelName,
  'ensureThumbDecoded': ensureThumbDecoded,
  'revealRefThumbMedia': revealRefThumbMedia,
  'commit': commit,
  'TEXT_TOOLBAR_HTML': TEXT_TOOLBAR_HTML,
  'bindTextToolbarEvents': bindTextToolbarEvents,
  'getPromptPresets': getPromptPresets,
  'openCustomPresetsManager': openCustomPresetsManager,
  'startLoading': startLoading,
  'stopLoading': stopLoading,
  'bindRefThumbHoverPreview': bindRefThumbHoverPreview,
  'checkSlashTrigger': checkSlashTrigger,
  'handleSlashKeyboardNavigation': handleSlashKeyboardNavigation,
  'closeSlashMenu': closeSlashMenu,
  'activateMenuKeyboard': activateMenuKeyboard,
  '_checkAtTrigger': _checkAtTrigger,
  '_populateMentionMenu': _populateMentionMenu,
  '_handleMentionMenuKeyboard': _handleMentionMenuKeyboard,
  '_handlePillKeyboard': _handlePillKeyboard,
  '_rehydratePromptPills': _rehydratePromptPills,
  '_handlePillHover': _handlePillHover,
  '_handlePillOut': _handlePillOut,
  '_syncEdgesOrderFromPills': _syncEdgesOrderFromPills,
  '_syncPillLabels': _syncPillLabels,
  'handlePromptPaste': handlePromptPaste,
  'handlePromptSelectAll': handlePromptSelectAll,
  'getCustomTextModels': getCustomTextModels,
  'saveCustomTextModels': saveCustomTextModels
};
export class AIGenTextNode {
  constructor(_0xda7cde) {
    this['_data'] = _0xda7cde;
    this["nodeId"] = _0xda7cde['id'];
    this['previewEl'] = null;
    this['outputEl'] = null;
    this["refBarEl"] = null;
    this["promptEl"] = null;
    this["btnEl"] = null;
    this["modelWrap"] = null;
    this["_dragSrcIdx"] = null;
    this['_dragBounds'] = [];
    this["_lastEdgeSig"] = null;
    this["_outputScrollTop"] = Number["isFinite"](_0xda7cde?.["outputScrollTop"]) ? Math["max"](0x0, _0xda7cde["outputScrollTop"]) : 0x0;
    this['_outputScrollTopDirty'] = ![];
    this["_outputScrollTopCommitTimer"] = null;
    this["_lastRenderedOutputText"] = '';
    this["_footerControllerCleanup"] = null;
    this["_modelProviderProfileControl"] = null;
    this["_runtimeParameterController"] = null;
  }
  ['_checkAtTrigger'](_0x17e818) {
    return _checkAtTrigger(this, _0x17e818);
  }
  ["_populateMentionMenu"](_0x27f9f8, _0x475d8b, _0x3d8cc4, _0x401393 = '', _0x3903f8 = -0x1, _0x11d2a1 = null) {
    return _populateMentionMenu(this, {
      'x': _0x27f9f8,
      'y': _0x475d8b,
      'triggerRange': _0x3d8cc4,
      'query': _0x401393,
      'atIndex': _0x3903f8,
      'pillToEdit': _0x11d2a1
    });
  }
  ["_handlePillKeyboard"](_0x318cc6) {
    return _handlePillKeyboard(this, _0x318cc6);
  }
  ["unmount"]() {
    this["_commitOutputScrollTop"]?.();
    this["_flushPromptHtmlCommit"]?.();
    this["_unbindOutputTextSelection"]?.();
    this["_unbindOutputTextSelection"] = null;
    this["_unbindLocaleChange"]?.();
    this["_unbindLocaleChange"] = null;
    this["_footerControllerCleanup"]?.();
    this["_footerControllerCleanup"] = null;
    this["_modelProviderProfileControl"]?.["remove"]();
    this["_modelProviderProfileControl"] = null;
    this['_runtimeParameterController']?.["destroy"]?.();
    this['_runtimeParameterController'] = null;
    this['_promptPresetTrigger']?.["remove"]();
    this['_promptPresetTrigger'] = null;
    this["_promptExpansion"]?.["remove"]();
    this['_promptExpansion'] = null;
  }
}
const aiGenTextNodeUiModule = createAIGenTextNodeUiModule(AI_GEN_TEXT_NODE_MODULE_DEPS);
const aiGenTextNodeStateSyncModule = createAIGenTextNodeStateSyncModule(AI_GEN_TEXT_NODE_MODULE_DEPS);
const aiGenTextNodeTaskOrchestrationModule = createAIGenTextNodeTaskOrchestrationModule(AI_GEN_TEXT_NODE_MODULE_DEPS);
function applyClassPrototypeMethods(_0x32b2e5, _0x5b9ef1) {
  if (!_0x5b9ef1) {
    return;
  }
  const _0x3b9edd = Object['getOwnPropertyDescriptors'](_0x5b9ef1);
  delete _0x3b9edd['constructor'];
  Object["defineProperties"](_0x32b2e5, _0x3b9edd);
}
applyClassPrototypeMethods(AIGenTextNode['prototype'], aiGenTextNodeUiModule);
applyClassPrototypeMethods(AIGenTextNode["prototype"], aiGenTextNodeStateSyncModule);
applyClassPrototypeMethods(AIGenTextNode["prototype"], aiGenTextNodeTaskOrchestrationModule);
export function _renderSharedRefBar(_0x53d858) {
  if (!_0x53d858["refBarEl"]) {
    return;
  }
  const _0xdbc88e = a368_0x270436["getState"]();
  const _0x52a12a = _0xdbc88e["nodes"] || {};
  const _0x1260d1 = a368_0x270436["getIncomingEdges"](_0x53d858["nodeId"]);
  let _0x3ea722 = {
    'text': 0x0,
    'image': 0x0,
    'video': 0x0,
    'audio': 0x0
  };
  const _0x55a45d = {};
  const _0x53989f = createPromptAttachmentButtonHTML();
  if (_0x53d858["_isDraggingSorting"]) {
    _syncPillLabels(_0x53d858, _0x55a45d);
    return;
  }
  const _0x32857c = _0x43786a => {
    return localPathToUrl(_0x43786a);
  };
  const _0x36cc21 = _0x234f96 => {
    const _0x2b9318 = String(_0x234f96 || '')['trim']()['toLowerCase']();
    if (!_0x2b9318) {
      return ![];
    }
    if (_0x2b9318["startsWith"]("data:image/")) {
      return !![];
    }
    return /\.(png|jpe?g|webp|gif|bmp|svg|avif)(\?|#|$)/i["test"](_0x2b9318);
  };
  const _0x20fa1e = _0x326bd0 => {
    return String(_0x326bd0?.['src'] || '')["trim"]() || _0x32857c(_0x326bd0?.["localPath"]) || String(_0x326bd0?.['imageUrl'] || '')['trim']() || String(_0x326bd0?.["thumbUrl"] || '')['trim']();
  };
  const _0x2db6f9 = _0x1f70ee => {
    const _0x14be55 = [String(_0x1f70ee?.["thumbUrl"] || '')["trim"](), String(_0x1f70ee?.["imageUrl"] || '')['trim'](), String(_0x1f70ee?.['src'] || '')['trim'](), _0x32857c(_0x1f70ee?.["localPath"]), String(_0x1f70ee?.["audioUrl"] || '')["trim"]()]["filter"](Boolean);
    return _0x14be55["find"](_0x51e92b => _0x36cc21(_0x51e92b)) || '';
  };
  const _0x4f2961 = [];
  for (const _0x340439 of _0x1260d1) {
    const _0x584622 = _0x52a12a[_0x340439["sourceId"]];
    if (!_0x584622) {
      continue;
    }
    const _0x597bb8 = _0x584622["type"] || '';
    let _0x431fdf = '';
    if (_0x597bb8 === "text" || _0x597bb8 === "source-text" || _0x597bb8 === 'ai-text') {
      _0x3ea722["text"]++;
      _0x431fdf = "text";
    } else {
      if (_0x597bb8 === "source-image" || _0x597bb8 === "ai-image") {
        _0x3ea722["image"]++;
        _0x431fdf = 'image';
      } else {
        if (_0x597bb8 === "source-video" || _0x597bb8 === 'video' || _0x597bb8 === "ai-video") {
          _0x3ea722["video"]++;
          _0x431fdf = 'video';
        } else {
          (_0x597bb8 === "source-audio" || _0x597bb8 === "audio" || _0x597bb8 === "ai-audio") && (_0x3ea722["audio"]++, _0x431fdf = "audio");
        }
      }
    }
    if (_0x431fdf) {
      const _0x48d543 = {
        'text': a368_0x21d6b9("aigenText.refs.types.text"),
        'image': a368_0x21d6b9("aigenText.refs.types.image"),
        'video': a368_0x21d6b9("aigenText.refs.types.video"),
        'audio': a368_0x21d6b9("aigenText.refs.types.audio")
      };
      const _0x364a3d = '@' + (_0x48d543[_0x431fdf] || _0x431fdf) + _0x3ea722[_0x431fdf];
      _0x55a45d[_0x340439["sourceId"]] = _0x364a3d;
    }
    let _0x204b13 = '';
    if (_0x597bb8 === "source-image") {
      const _0x17e852 = _0x20fa1e(_0x584622);
      if (_0x17e852) {
        ensureThumbDecoded(_0x17e852);
      }
      _0x204b13 = createReferenceInputThumbnailHtml({
        'kind': "image",
        'thumbnailUrl': _0x17e852,
        'extraHtml': createReferenceMaskBadgeHtml(_0x584622)
      });
    } else {
      if (_0x597bb8 === 'ai-image') {
        const _0x108326 = _0x20fa1e(_0x584622);
        if (_0x108326) {
          ensureThumbDecoded(_0x108326);
        }
        _0x204b13 = createReferenceInputThumbnailHtml({
          'kind': "image",
          'thumbnailUrl': _0x108326,
          'extraHtml': createReferenceMaskBadgeHtml(_0x584622)
        });
      } else {
        if (_0x597bb8 === "source-text" || _0x597bb8 === "text") {
          _0x204b13 = createReferenceInputThumbnailHtml({
            'kind': "text"
          });
        } else {
          if (_0x597bb8 === 'ai-text') {
            const _0xe9593c = String(_0x584622["outputText"] || _0x584622["text"] || _0x584622["content"] || _0x584622["prompt"] || '')['trim']();
            if (!_0xe9593c) {
              continue;
            }
            _0x204b13 = createReferenceInputThumbnailHtml({
              'kind': "text"
            });
          } else {
            if (_0x597bb8 === 'source-video' || _0x597bb8 === "video" || _0x597bb8 === 'ai-video') {
              const _0x50b992 = resolveReferenceVideoThumbnail(_0x584622, _0x340439)['thumbUrl'];
              if (_0x50b992) {
                ensureThumbDecoded(_0x50b992);
              }
              _0x204b13 = createReferenceInputThumbnailHtml({
                'kind': "video",
                'thumbnailUrl': _0x50b992
              });
            } else {
              if (_0x597bb8 === "source-audio" || _0x597bb8 === "audio" || _0x597bb8 === 'ai-audio') {
                const _0x2d1628 = _0x2db6f9(_0x584622);
                if (_0x2d1628) {
                  ensureThumbDecoded(_0x2d1628);
                }
                _0x204b13 = createReferenceInputThumbnailHtml({
                  'kind': "audio",
                  'thumbnailUrl': _0x2d1628
                });
              }
            }
          }
        }
      }
    }
    if (!_0x204b13) {
      continue;
    }
    const _0x167dd4 = String(_0x584622["mask"] || '')["trim"]() ? 'm1' : 'm0';
    const _0x162519 = Number["isFinite"](Number(_0x584622['mainVideoIndex'])) ? Math["max"](0x0, Math['trunc'](Number(_0x584622['mainVideoIndex']))) : 0x0;
    const _0x4b49ea = Array["isArray"](_0x584622["videos"]) ? _0x584622["videos"][_0x162519] || _0x584622['videos'][0x0] : null;
    const _0x2aacb8 = _0x597bb8 + '|' + _0x340439['id'] + '|' + _0x340439["sourceId"] + '|' + (_0x584622["src"] || _0x584622["imageUrl"] || _0x584622['thumbUrl'] || _0x584622["videoUrl"] || _0x584622['audioUrl'] || '') + '|' + (_0x584622["localPath"] || '') + '|' + (_0x584622["thumbId"] || '') + '|' + (_0x4b49ea?.['thumbUrl'] || '') + '|' + (_0x4b49ea?.["localPath"] || '') + '|' + (_0x4b49ea?.["videoUrl"] || '') + '|' + _0x167dd4;
    _0x4f2961["push"]({
      'edgeId': _0x340439['id'],
      'sourceId': _0x340439['sourceId'],
      'sig': _0x2aacb8,
      'thumb': _0x204b13
    });
  }
  if (_0x4f2961['length'] === 0x0) {
    const _0x40a7ab = !!_0x53d858["refBarEl"]['querySelector'](".ref-thumb-wrap");
    const _0x42f9c7 = !!_0x53d858['refBarEl']["querySelector"]('.ref-thumb-container');
    (_0x53d858['_lastRefHTML'] !== _0x53989f || _0x40a7ab || _0x42f9c7) && (_0x53d858['_lastRefHTML'] = _0x53989f, _0x53d858["refBarEl"]['classList']["remove"]('active'), _0x53d858['refBarEl']["innerHTML"] = _0x53989f);
    _syncPillLabels(_0x53d858, _0x55a45d);
    return;
  }
  _0x53d858['_lastRefHTML'] = "__has-items__";
  _0x53d858["refBarEl"]["classList"]["add"]("active");
  let _0x4ee659 = _0x53d858["refBarEl"]["querySelector"](".prompt-attachment-btn");
  let _0x2d0135 = _0x53d858['refBarEl']["querySelector"](".ref-thumb-container");
  (!_0x4ee659 || !_0x2d0135) && (_0x53d858["refBarEl"]["innerHTML"] = _0x53989f + " <div class=\"ref-thumb-container\"></div>", _0x4ee659 = _0x53d858["refBarEl"]['querySelector'](".prompt-attachment-btn"), _0x2d0135 = _0x53d858["refBarEl"]["querySelector"](".ref-thumb-container"));
  const _0x637d86 = new Map();
  _0x2d0135['querySelectorAll'](".ref-thumb-wrap")["forEach"](_0x36bd9b => _0x637d86["set"](_0x36bd9b["dataset"]["edgeId"], _0x36bd9b));
  const _0x9fbaa4 = new Set();
  for (const _0x3ecb9a of _0x4f2961) {
    let _0x383101 = _0x637d86["get"](_0x3ecb9a["edgeId"]);
    !_0x383101 && (_0x383101 = document["createElement"]('div'), _0x383101["className"] = 'ref-thumb-wrap');
    _0x383101["dataset"]['sig'] !== _0x3ecb9a["sig"] && (_0x383101["innerHTML"] = _0x3ecb9a['thumb'] + '<button\x20type=\x22button\x22\x20class=\x22ref-thumb-delete\x22\x20title=\x22' + a368_0x21d6b9("aigenText.refs.remove") + "\">×</button>", _0x383101["dataset"]['sig'] = _0x3ecb9a["sig"], revealRefThumbMedia(_0x383101, _0x3ecb9a["sig"]));
    _0x383101["dataset"]['edgeId'] = _0x3ecb9a["edgeId"];
    _0x383101["dataset"]["sourceId"] = _0x3ecb9a["sourceId"];
    _0x2d0135["appendChild"](_0x383101);
    _0x9fbaa4["add"](_0x3ecb9a["edgeId"]);
  }
  for (const [_0xf247a2, _0x1e21f1] of _0x637d86["entries"]()) {
    if (!_0x9fbaa4['has'](_0xf247a2)) {
      _0x1e21f1["remove"]();
    }
  }
  _syncPillLabels(_0x53d858, _0x55a45d);
}