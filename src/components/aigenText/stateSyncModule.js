import { sanitizePromptHtml } from '../../utils/dom.js';
import { clearVirtualizedPromptCommit, isVirtualizedPromptEditorCurrent } from '../../modules/promptPasteVirtualization.js';
import { createReferenceMaskBadgeHtml, getReferenceMaskSignaturePart, hasReferenceMask } from '../../modules/refThumbMaskBadge.js';
import { createReferenceInputThumbnailHtml, resolveReferenceVideoThumbnail } from '../../modules/referenceInputThumbnail.js';
import { resolveEffectiveInputKind } from '../../modules/modelInputPolicy.js';
import { createPromptAttachmentButtonHTML } from '../refAttachmentButton.js';
import { bindRefThumbOrderDrag } from '../../modules/refThumbDragController.js';
import { resolvePromptTextWithTextRefs, resolveTextReferenceContent } from '../../modules/nodePromptShared.js';
import { isTaskTerminal, resolveGenerationButtonMode, shouldShowGenerationBusyUi } from '../../core/generationTaskUiState.js';
import { resetGenerateButtonIdleUi, setGenerateButtonLoadingUi } from '../../modules/previewGenerateButtonUi.js';
import { t } from '../../i18n/index.js';
import { syncTextResultSources } from './textResultSources.js';
import { applyModelCredentialButtonState, resetModelCredentialButtonState } from '../../modules/modelCredentialUi.js';
export function createAIGenTextNodeStateSyncModule(_0xed943d) {
  const {
    store: _0x2e6c05,
    api: _0x571275,
    getDisplayModelName: _0x82d663,
    ensureThumbDecoded: _0x56f08e,
    revealRefThumbMedia: _0x2d00de,
    commit: _0x5bd8fd,
    TEXT_TOOLBAR_HTML: _0x20dcf1,
    bindTextToolbarEvents: _0x15243e,
    getPromptPresets: _0x186372,
    openCustomPresetsManager: _0x26903c,
    startLoading: _0x20ee8e,
    stopLoading: _0x4f1354,
    bindRefThumbHoverPreview: _0xcf4882,
    checkSlashTrigger: _0x57ca39,
    handleSlashKeyboardNavigation: _0x3fcc90,
    closeSlashMenu: _0x5b80a1,
    activateMenuKeyboard: _0x516d1d,
    _checkAtTrigger: _0x5b8f13,
    _populateMentionMenu: _0x1182c9,
    _handleMentionMenuKeyboard: _0x3c5fc8,
    _handlePillKeyboard: _0x1ea424,
    _rehydratePromptPills: _0x2e8c19,
    _handlePillHover: _0x50ace1,
    _handlePillOut: _0x38faf9,
    _syncEdgesOrderFromPills: _0x50c109,
    _syncPillLabels: _0x57bb50,
    getCustomTextModels: _0x5b8827,
    saveCustomTextModels: _0xe7cf13
  } = _0xed943d;
  class _0x5239b2 {
    ["_getStoreStateForRead"]() {
      if (typeof _0x2e6c05["getStateRaw"] === "function") {
        return _0x2e6c05["getStateRaw"]();
      }
      if (typeof _0x2e6c05['getState'] === 'function') {
        return _0x2e6c05["getState"]();
      }
      return {};
    }
    ["_getEffectiveSubmitPromptText"]() {
      const _0x377f2f = this["_getStoreStateForRead"]();
      return resolvePromptTextWithTextRefs({
        'promptEl': this['promptEl'],
        'inEdges': typeof _0x2e6c05["getIncomingEdges"] === "function" ? _0x2e6c05["getIncomingEdges"](this["nodeId"]) : [],
        'nodes': _0x377f2f?.["nodes"] || {}
      });
    }
    ['_updateSubmitButtonState']() {
      if (!this["btnEl"]) {
        return;
      }
      const _0x10eb63 = this['_getEffectiveSubmitPromptText']();
      const _0x57931a = this["_getStoreStateForRead"]()['nodes']?.[this["nodeId"]] || this["_data"] || {};
      const _0x156713 = resolveGenerationButtonMode(this['_isGenerating'] && _0x57931a?.['jobStatus'] !== "error" ? {
        ..._0x57931a,
        'isGenerating': !![],
        'jobStatus': _0x57931a["jobStatus"] || "running"
      } : _0x57931a, {
        'cancellable': _0x57931a?.["taskCancellable"] === !![]
      });
      if (_0x156713["busy"]) {
        setGenerateButtonLoadingUi(this["btnEl"], {
          'title': t("aigenText.generate"),
          'disabled': _0x156713["disabled"],
          'ariaLabel': t("aigenText.generate")
        });
        this["btnEl"]["disabled"] = _0x156713["disabled"];
        this["btnEl"]['style']['cursor'] = _0x156713["cursor"];
        return;
      }
      resetGenerateButtonIdleUi(this["btnEl"], t("aigenText.generate"));
      resetModelCredentialButtonState(this["btnEl"]);
      !_0x10eb63 ? (this["btnEl"]["disabled"] = !![], this['btnEl']["style"]["cursor"] = 'var(--unavailable-cursor)') : (this['btnEl']["disabled"] = ![], this['btnEl']["style"]['cursor'] = '', applyModelCredentialButtonState(this["btnEl"], {
        'modelId': _0x57931a?.['model'],
        'provider': _0x57931a?.["provider"],
        'providerProfileId': _0x57931a?.['providerProfileId'] || _0x57931a?.["rhProviderProfileId"]
      }));
    }
    ['update'](_0x18f29e) {
      this['_data'] = _0x18f29e;
      if (shouldShowGenerationBusyUi(_0x18f29e)) {
        this['_isGenerating'] = !![];
        this['previewEl'] && typeof _0x20ee8e === "function" && _0x20ee8e(this['previewEl']);
      } else {
        isTaskTerminal(_0x18f29e) && (this["_isGenerating"] = ![], this["previewEl"] && typeof _0x4f1354 === 'function' && _0x4f1354(this["previewEl"]));
      }
      const _0x32c26d = this["outputEl"]?.["classList"]?.['contains']?.('is-text-selection-active') === !![];
      const _0x5f2237 = this["_outputScrollTopDirty"] === !![];
      const _0x4eae9a = String(_0x18f29e["outputText"] || '');
      const _0x31c213 = _0x4eae9a !== this["_lastRenderedOutputText"] || JSON["stringify"](_0x18f29e['outputImages'] || []) !== this["_lastRenderedOutputImagesSignature"];
      !_0x32c26d && !_0x5f2237 && Number['isFinite'](_0x18f29e["outputScrollTop"]) && (this["_outputScrollTop"] = Math["max"](0x0, _0x18f29e["outputScrollTop"]));
      const _0x131b2a = this["outputEl"] && document["activeElement"] === this["outputEl"] && this["outputEl"]["getAttribute"]?.("contenteditable") === "true";
      !_0x131b2a && !_0x32c26d && _0x31c213 && this["outputEl"] && this["_renderOutputText"]?.(_0x4eae9a);
      if (!_0x32c26d && !_0x131b2a) {
        syncTextResultSources(this);
      }
      this["outputEl"] && document["activeElement"] !== this['outputEl'] && !_0x32c26d && !_0x5f2237 && (this['outputEl']['scrollTop'] = this["_outputScrollTop"]);
      const _0x23375e = this["_getStoreStateForRead"]()["pickConnectMode"];
      if (this["_placeholderEl"]) {
        const _0x1d4a30 = this["_placeholderEl"]['querySelector'](".placeholder-icon-svg");
        _0x1d4a30 && (_0x23375e["active"] && _0x23375e["sourceNodeId"] === this['nodeId'] ? _0x1d4a30['classList']["add"]('is-pick-connecting') : _0x1d4a30["classList"]["remove"]("is-pick-connecting"));
      }
      const _0x8f35db = this["refBarEl"]?.["querySelector"]('.prompt-attachment-btn');
      if (_0x8f35db) {
        const _0x3e4870 = _0x8f35db['querySelector'](".btn-icon");
        if (_0x3e4870) {
          const _0x4dec65 = _0x23375e["active"] && _0x23375e["sourceNodeId"] === this["nodeId"];
          _0x3e4870['style']['transition'] = 'opacity\x200.2s\x20ease,\x20transform\x200.2s\x20ease';
          _0x3e4870["style"]['opacity'] = _0x4dec65 ? '0' : '';
          _0x3e4870["style"]["transform"] = _0x4dec65 ? "scale(0.4)" : '';
        }
      }
      if (document["activeElement"] !== this["promptEl"] && _0x18f29e["prompt"] !== undefined) {
        if (!isVirtualizedPromptEditorCurrent(this, _0x18f29e["prompt"])) {
          const _0x33fbd2 = sanitizePromptHtml(_0x18f29e["prompt"] || '');
          this["promptEl"]?.['innerHTML'] !== _0x33fbd2 && (clearVirtualizedPromptCommit(this), this["promptEl"]["innerHTML"] = _0x33fbd2, _0x2e8c19(this));
        }
      }
      this["_syncPromptBoxSizeFromData"]?.(_0x18f29e);
      this["_modelProviderProfileControl"]?.['sync']();
      this["_runtimeParameterController"]?.["sync"]?.(_0x18f29e);
      const _0x268c72 = this["modelWrap"]?.["querySelector"](".img-model-label");
      if (_0x268c72 && _0x18f29e["model"]) {
        _0x268c72["textContent"] = _0x82d663(_0x18f29e['model']);
      }
      const _0x4ab637 = this["_getStoreStateForRead"]();
      const _0x25bebe = _0x4ab637['nodes'] || {};
      const _0x1ac01a = _0x2e6c05["getIncomingEdges"](this["nodeId"]);
      const _0xb70c25 = (_0x585cd4, _0x37b538) => {
        if (!_0x585cd4) {
          return '0';
        }
        const _0x4e6bf7 = resolveEffectiveInputKind(_0x585cd4, _0x37b538);
        const _0x20be87 = _0x585cd4["_bizRev"] ?? '';
        const _0x43ba5a = hasReferenceMask(_0x585cd4);
        const _0x2590a5 = !!resolveTextReferenceContent(_0x585cd4);
        const _0x1e0885 = !!_0x585cd4["thumbId"] || !!_0x585cd4["thumbUrl"] || !!_0x585cd4["imageUrl"] || !!_0x585cd4["src"] || !!_0x585cd4["localPath"];
        const _0x11f786 = Array['isArray'](_0x585cd4["videos"]) && _0x585cd4["videos"]["length"] > 0x0 || !!_0x585cd4["thumbId"] || !!_0x585cd4['thumbUrl'] || !!_0x585cd4["videoUrl"] || !!_0x585cd4["src"] || !!_0x585cd4['localPath'];
        const _0xece221 = !!_0x585cd4["audioUrl"] || !!_0x585cd4['src'] || !!_0x585cd4["localPath"];
        if (_0x4e6bf7 === "text") {
          return 't:' + _0x20be87 + ':' + (_0x2590a5 ? 0x1 : 0x0);
        }
        if (_0x4e6bf7 === "video") {
          const _0x4caf29 = resolveReferenceVideoThumbnail(_0x585cd4, _0x37b538)["thumbUrl"];
          return 'v:' + _0x20be87 + ':' + (_0x11f786 ? 0x1 : 0x0) + ':' + _0x4caf29;
        }
        if (_0x4e6bf7 === "audio") {
          return 'a:' + _0x20be87 + ':' + (_0xece221 ? 0x1 : 0x0);
        }
        return 'i:' + _0x20be87 + ':' + (_0x1e0885 ? 0x1 : 0x0) + ':' + (_0x43ba5a ? 0x1 : 0x0);
      };
      const _0x5a6f3a = [..._0x1ac01a];
      const _0x52ecb3 = _0x5a6f3a["map"](_0x3a2cc1 => _0x3a2cc1['id'] + ':' + _0x3a2cc1['sourceId'] + ':' + String(_0x3a2cc1?.["refSlot"] || '') + ':' + String(_0x3a2cc1?.["sourceMediaKey"] || '') + ':' + _0xb70c25(_0x25bebe[_0x3a2cc1['sourceId']], _0x3a2cc1))["join"]('|');
      _0x52ecb3 !== this["_lastEdgeSig"] && (this["_lastEdgeSig"] = _0x52ecb3, this["_renderRefBar"]());
      this["_updateSubmitButtonState"]();
    }
    ["_renderRefBar"]() {
      if (!this["refBarEl"]) {
        return;
      }
      const _0x2d553a = _0x2e6c05['getState']();
      const _0x1f4c53 = _0x2d553a["nodes"] || {};
      const _0x115600 = _0x2e6c05['getIncomingEdges'](this["nodeId"]);
      this["_lastInEdgeCount"] = _0x115600["length"];
      const _0x5dda69 = createPromptAttachmentButtonHTML();
      if (_0x115600['length'] === 0x0) {
        const _0x4e5d0f = _0x5dda69;
        this['_lastRefHTML'] !== _0x4e5d0f && (this["_lastRefHTML"] = _0x4e5d0f, this["refBarEl"]["classList"]["remove"]('active'), this["refBarEl"]["innerHTML"] = _0x4e5d0f);
        this["_syncBtnIconState"]();
        return;
      }
      const _0x2c8c12 = {
        'text': 0x0,
        'image': 0x0,
        'video': 0x0,
        'audio': 0x0
      };
      const _0x3f429d = [];
      const _0x15d024 = {};
      _0x115600['forEach'](_0x59826f => {
        const _0x40da84 = _0x1f4c53[_0x59826f["sourceId"]];
        if (!_0x40da84) {
          return;
        }
        const _0x27096e = resolveEffectiveInputKind(_0x40da84, _0x59826f) || "other";
        _0x2c8c12[_0x27096e] = (_0x2c8c12[_0x27096e] || 0x0) + 0x1;
        const _0x4b6638 = {
          'text': t("aigenText.refs.types.text"),
          'image': t("aigenText.refs.types.image"),
          'video': t("aigenText.refs.types.video"),
          'audio': t('aigenText.refs.types.audio'),
          'group': t("aigenText.refs.types.group"),
          'other': t("aigenText.refs.types.other")
        };
        const _0x1cbad2 = '@' + _0x4b6638[_0x27096e] + _0x2c8c12[_0x27096e];
        _0x15d024[_0x59826f["sourceId"]] = _0x1cbad2;
        let _0x59bf74 = '';
        const _0x43373a = String(_0x40da84["src"] || _0x40da84["imageUrl"] || _0x40da84["thumbUrl"] || '')['trim']();
        if (_0x27096e === "image" && _0x43373a) {
          _0x56f08e(_0x43373a);
          _0x59bf74 = createReferenceInputThumbnailHtml({
            'kind': "image",
            'thumbnailUrl': _0x43373a,
            'extraHtml': createReferenceMaskBadgeHtml(_0x40da84)
          });
        } else {
          if (_0x27096e === "text") {
            const _0x1f61a9 = resolveTextReferenceContent(_0x40da84);
            if (!_0x1f61a9) {
              return;
            }
            _0x59bf74 = createReferenceInputThumbnailHtml({
              'kind': "text"
            });
          } else {
            if (_0x27096e === "video") {
              const _0x27c1ba = Array["isArray"](_0x40da84["videos"]) && _0x40da84['videos']["length"] > 0x0 || !!_0x40da84["thumbId"] || !!_0x40da84['thumbUrl'] || !!_0x40da84['videoUrl'] || !!_0x40da84["src"] || !!_0x40da84["localPath"];
              if (!_0x27c1ba) {
                return;
              }
              const _0x164392 = resolveReferenceVideoThumbnail(_0x40da84, _0x59826f)["thumbUrl"];
              if (_0x164392) {
                _0x56f08e(_0x164392);
              }
              _0x59bf74 = createReferenceInputThumbnailHtml({
                'kind': "video",
                'thumbnailUrl': _0x164392
              });
            } else {
              if (_0x27096e === 'audio') {
                const _0x1b1f70 = !!_0x40da84["audioUrl"] || !!_0x40da84["src"] || !!_0x40da84["localPath"];
                if (!_0x1b1f70) {
                  return;
                }
                _0x59bf74 = createReferenceInputThumbnailHtml({
                  'kind': "audio"
                });
              } else {
                if (_0x27096e === "group" || _0x27096e === "other") {
                  const _0x3965a7 = _0x27096e === 'group';
                  const _0x5eaaf5 = _0x3965a7 ? _0x40da84['color'] || "var(--indigo)" : "var(--text-muted)";
                  const _0x19f359 = (_0x40da84["name"] || (_0x3965a7 ? t("aigenText.refs.groupShortName") : t("aigenText.refs.nodeShortName")))["substring"](0x0, 0x2)["toUpperCase"]();
                  _0x59bf74 = "<div class=\"ref-thumb-media\" style=\"display:flex;align-items:center;justify-content:center;background:" + _0x5eaaf5 + "33;border:1px solid " + _0x5eaaf5 + "80;box-sizing:border-box;\">\n                    <span style=\"color:" + _0x5eaaf5 + ';font-size:12px;font-weight:bold;letter-spacing:1px;user-select:none;\x22>' + _0x19f359 + "</span>\n                </div>";
                }
              }
            }
          }
        }
        _0x59bf74 && _0x3f429d["push"]({
          'edgeId': _0x59826f['id'],
          'sourceId': _0x59826f["sourceId"],
          'type': _0x27096e,
          'label': _0x1cbad2,
          'index': _0x3f429d["length"],
          'sig': _0x27096e + '|' + _0x59826f['id'] + '|' + _0x59826f["sourceId"] + '|' + _0x59bf74 + '|' + getReferenceMaskSignaturePart(_0x40da84),
          'thumbHTML': _0x59bf74
        });
      });
      if (_0x3f429d["length"] === 0x0) {
        const _0x4af1ab = _0x5dda69;
        this["_lastRefHTML"] !== _0x4af1ab && (this["_lastRefHTML"] = _0x4af1ab, this["refBarEl"]["classList"]["remove"]('active'), this['refBarEl']["innerHTML"] = _0x4af1ab);
        this["_syncBtnIconState"]();
        _0x57bb50(this, _0x15d024);
        return;
      }
      if (this["_isDraggingSorting"]) {
        this["_syncBtnIconState"]();
        _0x57bb50(this, _0x15d024);
        return;
      }
      this["_lastRefHTML"] = "__has-items__";
      this["refBarEl"]['classList']["add"]("active");
      let _0x5cb133 = this["refBarEl"]['querySelector'](".prompt-attachment-btn");
      let _0x5ecc4b = this["refBarEl"]["querySelector"](".ref-thumb-container");
      (!_0x5cb133 || !_0x5ecc4b) && (this['refBarEl']["innerHTML"] = _0x5dda69 + " <div class=\"ref-thumb-container\"></div>", _0x5cb133 = this["refBarEl"]["querySelector"]('.prompt-attachment-btn'), _0x5ecc4b = this["refBarEl"]['querySelector'](".ref-thumb-container"));
      const _0x375c7f = new Map();
      _0x5ecc4b["querySelectorAll"](".ref-thumb-wrap")["forEach"](_0x111ef0 => _0x375c7f["set"](String(_0x111ef0?.["dataset"]?.['edgeId'] || ''), _0x111ef0));
      const _0x329b93 = new Set();
      for (const _0x520d66 of _0x3f429d) {
        const _0x2a8768 = String(_0x520d66["edgeId"] || '');
        if (!_0x2a8768) {
          continue;
        }
        let _0x307ec0 = _0x375c7f["get"](_0x2a8768);
        !_0x307ec0 && (_0x307ec0 = document["createElement"]("div"), _0x307ec0["className"] = "ref-thumb-wrap");
        _0x307ec0["setAttribute"]("draggable", "true");
        _0x307ec0["dataset"]['sig'] !== _0x520d66["sig"] && (_0x307ec0["innerHTML"] = _0x520d66["thumbHTML"] + "<button type=\"button\" class=\"ref-thumb-delete\" title=\"" + t('aigenText.refs.removeReference') + "\">&times;</button>", _0x307ec0["dataset"]["sig"] = _0x520d66["sig"], _0x2d00de(_0x307ec0, _0x520d66["sig"]));
        _0x307ec0['dataset']["edgeId"] = _0x2a8768;
        _0x307ec0['dataset']["sourceId"] = _0x520d66["sourceId"] || '';
        _0x307ec0["dataset"]["type"] = _0x520d66['type'] || '';
        _0x307ec0["dataset"]['label'] = _0x520d66["label"] || '';
        _0x307ec0['dataset']["index"] = String(_0x520d66["index"] ?? '');
        _0x5ecc4b["appendChild"](_0x307ec0);
        _0x329b93['add'](_0x2a8768);
      }
      for (const [_0x1e84ca, _0x50195d] of _0x375c7f["entries"]()) {
        if (!_0x329b93["has"](_0x1e84ca)) {
          _0x50195d["remove"]();
        }
      }
      this["_bindDragSort"](this["refBarEl"]);
      this["_syncBtnIconState"]();
      _0x57bb50(this, _0x15d024);
    }
    ["_syncBtnIconState"]() {
      const _0xf60e7c = _0x2e6c05["getState"]()["pickConnectMode"];
      const _0x1350de = this["refBarEl"]?.["querySelector"](".btn-icon");
      if (!_0x1350de) {
        return;
      }
      _0xf60e7c && _0xf60e7c["active"] && _0xf60e7c['sourceNodeId'] === this["nodeId"] ? (_0x1350de["style"]["opacity"] = '0', _0x1350de["style"]["transform"] = "scale(0.4)", _0x1350de["style"]["transition"] = "opacity 0.2s ease, transform 0.2s ease") : (_0x1350de["style"]["opacity"] = '', _0x1350de["style"]["transform"] = '');
    }
    ["_bindDragSort"](_0x16a427) {
      bindRefThumbOrderDrag({
        'owner': this,
        'container': _0x16a427,
        'store': _0x2e6c05,
        'nodeId': this["nodeId"]
      });
    }
  }
  return _0x5239b2["prototype"];
}