import { sanitizePromptHtml } from '../../utils/dom.js';
import { clearVirtualizedPromptCommit, isVirtualizedPromptEditorCurrent } from '../../modules/promptPasteVirtualization.js';
import { createReferenceInputThumbnailHtml, resolveReferenceVideoThumbnail } from '../../modules/referenceInputThumbnail.js';
import { createReferenceMaskBadgeHtml } from '../../modules/refThumbMaskBadge.js';
import { getAssetInputRefsFromPromptAndNode, isRunningHubWorkflowNode } from '../../modules/nodePromptShared.js';
import { getFixedInputSlotConfigFromManifest } from '../../modules/fixedInputAssetRefs.js';
import { stopPreviewNodeLoading } from '../../modules/previewMode.js';
import { resolveCanvasImageDisplayUrl } from '../../services/canvasMediaLocalService.js';
import { shouldShowGenerationBusyUi } from '../../core/generationTaskUiState.js';
import { getTargetInputPolicy, isRhPersonReplaceWorkflowModel, isInputKindAllowed, resolveEffectiveInputKind } from '../../modules/modelInputPolicy.js';
import { collectRefThumbIds, resolveRefImageCandidateUrls, resolveVersionedRefImageRenderSources } from './referenceImageSources.js';
import { isDreaminaTerminalGenerationState, isFailureGenerationUiState, isTerminalGenerationUiState, resetGenerateButtonIdleUi } from './generationUiState.js';
import { bindRefThumbFixedSlotDrag } from '../../modules/refThumbDragController.js';
import { createPromptAttachmentButtonHTML } from '../refAttachmentButton.js';
import { syncAdaptiveImageInputRatio } from './adaptiveImageInputRatio.js';
import { t } from '../../i18n/index.js';
import { getImageInputGateUploadedUrl, getImageNodeInputGate, getImageNodeRootClass, shouldAlwaysShowImageRefBar } from './imageNodeManifestPolicies.js';
import { renderManifestFixedImageRefBar } from './fixedImageRefBar.js';
import { bindImageRefThumbOrderDrag, escapeRefBarHtml, formatRefUploadLabel, syncImageRefBarButtonIcon } from './refBarUiHelpers.js';
import { syncImageModelTriggerIcon } from './uiModuleModelHelpers.js';
import { scheduleCurrentRefThumbObjectUrl, syncRefThumbObjectUrlScope } from './refThumbObjectUrlScope.js';
export { resolveRefImageCandidateUrls, resolveRefImageRenderSources } from './referenceImageSources.js';
export function createAIGenerateNodeStateSyncModule(_0x4bbc54) {
  const {
    store: _0x46a9b1,
    api: _0x21c58f,
    getDisplayModelName: _0x527338,
    _handlePillHover: _0x1a34c4,
    _handlePillOut: _0x19cafa,
    _syncEdgesOrderFromPills: _0x3bec29,
    _syncPillLabels: _0x5ee45d,
    _checkAtTrigger: _0x4bf35e,
    _populateMentionMenu: _0x2514cf,
    _insertMentionPill: _0x1dff15,
    _handlePillKeyboard: _0xe83bd3,
    _rehydratePromptPills: _0x4be2ac,
    _handleMentionMenuKeyboard: _0x120d32,
    TEXT_TOOLBAR_HTML: _0xc1ea39,
    bindTextToolbarEvents: _0x248c6a,
    IMAGE_TOOLBAR_HTML: _0x58d5f0,
    bindImageToolbarEvents: _0x26631b,
    showDevToast: _0x38b2f9,
    getImage: _0x575fee,
    openNodeImagePreview: _0x2ce420,
    getPromptPresets: _0x5a5607,
    openCustomPresetsManager: _0x5d9b87,
    startLoading: _0x517bc4,
    stopLoading: _0x1c031b,
    bindRefThumbHoverPreview: _0x1f787e,
    ensureThumbDecoded: _0xb45855,
    revealRefThumbMedia: _0x32d229,
    getRefKindByNodeType: _0x26a722,
    uploadFile: _0x37fccd,
    ensureConfig: _0x53315e,
    getProviderConfig: _0x18d131,
    generateId: _0x46813b,
    checkSlashTrigger: _0x567930,
    handleSlashKeyboardNavigation: _0x578b93,
    closeSlashMenu: _0x3bd4e6,
    activateMenuKeyboard: _0x4c1f0d,
    ImageFreeAngleController: _0x4f4f96
  } = _0x4bbc54;
  class _0x28b92e {
    ["_getStoreStateForRead"]() {
      return typeof _0x46a9b1["getStateRaw"] === 'function' ? _0x46a9b1["getStateRaw"]() : _0x46a9b1['getState']();
    }
    ["_syncRefThumbObjectUrlScope"](_0x14a400, _0x9134a8) {
      return syncRefThumbObjectUrlScope(this, _0x14a400, _0x9134a8, collectRefThumbIds);
    }
    ["_scheduleRefThumbObjectUrl"](_0x3a73a7) {
      return scheduleCurrentRefThumbObjectUrl(this, _0x3a73a7, {
        'store': _0x46a9b1,
        'getImage': _0x575fee,
        'collectRefThumbIds': collectRefThumbIds
      });
    }
    ["_shouldRenderRefBarNow"](_0x3da3c6, _0x818333) {
      const _0xee53ec = Array["isArray"](_0x3da3c6?.['selectedNodeIds']) ? _0x3da3c6["selectedNodeIds"] : [];
      if (_0xee53ec["includes"](this["nodeId"])) {
        return !![];
      }
      if (_0x818333?.["active"] && _0x818333?.["sourceNodeId"] === this["nodeId"]) {
        return !![];
      }
      return shouldAlwaysShowImageRefBar(this['_data']?.["model"]);
    }
    ["update"](_0x5e9352) {
      const _0x19f1e0 = Number(_0x5e9352?.['_bizRev']);
      const _0x330f86 = Number(this['_data']?.["_bizRev"]);
      if (Number["isFinite"](_0x19f1e0) && Number["isFinite"](_0x330f86) && _0x19f1e0 < _0x330f86) {
        return;
      }
      const _0x29738c = this["_normalizeDreaminaNodeData"](_0x5e9352);
      const _0x1395ac = this["_data"]?.["model"];
      const _0x1830de = this["_data"]?.["rhAnimeRealRefUrl"];
      _0x5e9352 = _0x29738c;
      this["_data"] = _0x5e9352;
      const _0x16db17 = _0x1395ac !== _0x5e9352?.["model"];
      const _0x14039f = _0x1830de !== _0x5e9352?.["rhAnimeRealRefUrl"];
      const _0x3c537c = shouldShowGenerationBusyUi(_0x5e9352);
      const _0x369456 = isTerminalGenerationUiState(_0x5e9352);
      const _0x247997 = isFailureGenerationUiState(_0x5e9352);
      if (_0x3c537c) {
        this["_isGenerating"] = !![];
        this["previewEl"] && typeof _0x517bc4 === 'function' && _0x517bc4(this["previewEl"]);
      } else {
        if (_0x369456) {
          this["_isGenerating"] = ![];
          isDreaminaTerminalGenerationState(_0x5e9352) && (this["_dreaminaActiveSubmitId"] = '');
          stopPreviewNodeLoading(this["nodeId"]);
          if (this["previewEl"]) {
            _0x1c031b(this["previewEl"]);
          }
          resetGenerateButtonIdleUi(this["btnEl"]);
        }
      }
      this["_rendererMediaDeferred"] !== !![] && (this["_loadAndDisplayImage"](), this['_applyMaskPreview'](_0x5e9352['maskPreviewUrl'] || _0x5e9352['maskPreview']));
      const _0x33e654 = this["_getStoreStateForRead"]();
      const _0x109e08 = _0x33e654['pickConnectMode'] || {};
      if (this['_placeholderEl']) {
        const _0xdf4e3f = this["_placeholderEl"]["querySelector"](".placeholder-icon-svg");
        _0xdf4e3f && (_0x109e08["active"] && _0x109e08["sourceNodeId"] === this["nodeId"] ? _0xdf4e3f["classList"]["add"]("is-pick-connecting") : _0xdf4e3f["classList"]['remove']("is-pick-connecting"));
      }
      const _0x3bc1d1 = this["_attachBtnIcon"];
      if (_0x3bc1d1) {
        const _0x4f18c4 = _0x109e08['active'] && _0x109e08["sourceNodeId"] === this["nodeId"];
        _0x3bc1d1["style"]["transition"] = "opacity 0.2s ease, transform 0.2s ease";
        _0x3bc1d1["style"]["opacity"] = _0x4f18c4 ? '0' : '';
        _0x3bc1d1["style"]["transform"] = _0x4f18c4 ? 'scale(0.4)' : '';
        _0x3bc1d1["style"]["pointerEvents"] = _0x4f18c4 ? 'none' : '';
      }
      if (document['activeElement'] !== this["promptEl"] && _0x5e9352['prompt'] !== undefined) {
        if (!isVirtualizedPromptEditorCurrent(this, _0x5e9352['prompt'])) {
          const _0x409c4d = sanitizePromptHtml(_0x5e9352["prompt"] || '');
          this['promptEl']["innerHTML"] !== _0x409c4d && (clearVirtualizedPromptCommit(this), this['promptEl']['innerHTML'] = _0x409c4d, _0x4be2ac(this));
        }
      }
      this["_syncPromptPlaceholder"]?.(_0x5e9352);
      this["_syncPromptInputVisibility"]?.(_0x5e9352);
      this['_syncPromptBoxSizeFromData']?.(_0x5e9352);
      this["_generationNodeHelpTip"]?.["sync"]();
      this["_modelProviderProfileControl"]?.["sync"]();
      const _0x2d5579 = this["modelWrap"]?.["querySelector"](".img-model-label");
      if (_0x2d5579 && _0x5e9352["model"]) {
        _0x2d5579['textContent'] = _0x527338(_0x5e9352["model"]);
      }
      syncImageModelTriggerIcon(this["modelWrap"]?.["querySelector"]('.img-model-btn-trigger'), _0x5e9352);
      this["_applyModelParamVisibility"](_0x5e9352);
      const _0x3ff08c = getImageNodeRootClass(_0x5e9352["model"]);
      const _0x11ab1b = isRhPersonReplaceWorkflowModel(_0x5e9352["model"]);
      this["_root"] && (this["_root"]["classList"]["toggle"]("rh-anime-real-node", _0x3ff08c === "rh-anime-real-node"), _0x3ff08c && _0x3ff08c !== 'rh-anime-real-node' && this["_root"]["classList"]["add"](_0x3ff08c), _0x11ab1b ? this["_root"]["classList"]["add"]("rh-person-replace-v3-node") : this["_root"]['classList']["remove"]("rh-person-replace-v3-node"));
      const _0x2ce2d8 = this['_shouldRenderRefBarNow'](_0x33e654, _0x109e08);
      const _0x41ff91 = _0x46a9b1["getIncomingEdges"](this["nodeId"]);
      const _0x5d4a68 = _0x33e654['nodes'] || {};
      this["_syncRefThumbObjectUrlScope"](_0x41ff91, _0x5d4a68);
      syncAdaptiveImageInputRatio(this, {
        'store': _0x46a9b1,
        'nodeId': this["nodeId"],
        'inEdges': _0x41ff91,
        'nodes': _0x5d4a68,
        'targetNodeData': _0x5d4a68?.[this["nodeId"]] || _0x5e9352 || {}
      });
      if (this["_rendererMediaDeferred"] === !![] || !_0x2ce2d8) {
        this["_renderRefBarPendingWhenVisible"] = !![];
      } else {
        const _0x581836 = [..._0x41ff91];
        const _0x21a1b3 = _0x581836["map"](_0x45dc13 => {
          const _0x3348cb = _0x5d4a68[_0x45dc13['sourceId']] || null;
          const _0x4048a3 = _0x3348cb && (typeof _0x3348cb['_bizRev'] === "number" || typeof _0x3348cb["_bizRev"] === "string") ? String(_0x3348cb['_bizRev']) : '';
          const _0x243b54 = _0x3348cb?.["thumbId"] ? String(_0x3348cb["thumbId"]) : '';
          const _0x664c33 = String(_0x3348cb?.["mask"] || '')["trim"]() ? 'm1' : 'm0';
          const _0x430e7f = String(_0x45dc13?.["refSlot"] || '');
          const _0x534e2f = String(_0x45dc13?.["sourceMediaKey"] || '');
          return _0x45dc13['id'] + ':' + _0x45dc13["sourceId"] + ':' + _0x430e7f + ':' + _0x534e2f + ':' + _0x4048a3 + ':' + _0x243b54 + ':' + _0x664c33;
        })["join"]('|');
        (_0x16db17 || _0x14039f || this['_renderRefBarPendingWhenVisible'] || _0x21a1b3 !== this['_lastEdgeSig']) && (this["_renderRefBarPendingWhenVisible"] = ![], this['_lastEdgeSig'] = _0x21a1b3, this["_renderRefBar"]());
      }
      if (!_0x247997) {
        this['resumeGeneration']?.();
      }
      this["_updateSubmitButtonState"]();
    }
    async ["_renderRefBar"]() {
      if (!this['refBarEl']) {
        return;
      }
      if (this['_rendererMediaDeferred'] === !![]) {
        return void (this["_renderRefBarPendingWhenVisible"] = !![]);
      }
      const _0x583f51 = this["_getStoreStateForRead"]();
      const _0x347223 = _0x583f51?.['pickConnectMode'] || {};
      if (!this["_shouldRenderRefBarNow"](_0x583f51, _0x347223)) {
        this["_renderRefBarPendingWhenVisible"] = !![];
        return;
      }
      if (this["_renderRefBarLock"]) {
        this['_renderRefBarPending'] = !![];
        return;
      }
      this["_renderRefBarLock"] = !![];
      this["_renderRefBarPending"] = ![];
      try {
        await this["_renderRefBarImpl"]();
      } finally {
        this["_renderRefBarLock"] = ![];
        this["_renderRefBarPending"] && (this["_renderRefBarPending"] = ![], this["_renderRefBar"]());
      }
    }
    async ["_renderRefBarImpl"]() {
      if (!this["refBarEl"]) {
        return;
      }
      const _0xc55fb3 = this['_getStoreStateForRead']();
      const _0x565c2e = Object["values"](_0xc55fb3["edges"] || {});
      const _0x3bffea = _0xc55fb3['nodes'] || {};
      const _0x4b13af = _0x46a9b1["getIncomingEdges"](this['nodeId']);
      this['_syncRefThumbObjectUrlScope'](_0x4b13af, _0x3bffea);
      const _0x362daf = getImageNodeInputGate(this["_data"]?.["model"]);
      const _0x4384ad = String(_0x362daf["kind"] || '')["trim"]();
      const _0x122b09 = Number(_0x362daf["max"]);
      const _0x257e28 = isRhPersonReplaceWorkflowModel(this['_data']?.["model"]);
      const _0x7e4ce0 = getImageInputGateUploadedUrl(this["_data"], _0x362daf);
      const _0x39c941 = _0x3bffea?.[this["nodeId"]] || this['_data'] || {};
      const _0xa2ef17 = getTargetInputPolicy(_0x39c941);
      const _0x4ba382 = getFixedInputSlotConfigFromManifest(_0x39c941);
      syncAdaptiveImageInputRatio(this, {
        'store': _0x46a9b1,
        'nodeId': this["nodeId"],
        'inEdges': _0x4b13af,
        'nodes': _0x3bffea,
        'targetNodeData': _0x39c941
      });
      const _0x5a7c97 = createPromptAttachmentButtonHTML({
        'stroke': "var(--white-80)"
      });
      const _0xf560ef = () => {
        let _0x50d44c = this["refBarEl"]["querySelector"](".prompt-attachment-btn");
        let _0x1a7a16 = this["refBarEl"]["querySelector"](".ref-thumb-container");
        (!_0x50d44c || !_0x1a7a16) && (this["refBarEl"]["innerHTML"] = _0x5a7c97 + " <div class=\"ref-thumb-container\"></div>", _0x50d44c = this["refBarEl"]['querySelector']('.prompt-attachment-btn'), _0x1a7a16 = this["refBarEl"]["querySelector"](".ref-thumb-container"), this["_attachBtnIcon"] = _0x50d44c ? _0x50d44c["querySelector"](".btn-icon") : null);
        return {
          'attachBtn': _0x50d44c,
          'thumbContainer': _0x1a7a16
        };
      };
      let _0x4f68b1 = [];
      const _0x26c8a5 = {
        'text': 0x0,
        'image': 0x0,
        'video': 0x0,
        'audio': 0x0
      };
      const _0x5a5164 = {};
      for (const _0x4c0815 of _0x4b13af) {
        const _0x56cdca = _0x3bffea[_0x4c0815["sourceId"]];
        if (!_0x56cdca) {
          continue;
        }
        const _0x3acd19 = resolveEffectiveInputKind(_0x56cdca, _0x4c0815);
        if (!_0x3acd19) {
          continue;
        }
        if (!isInputKindAllowed(_0xa2ef17, _0x3acd19)) {
          continue;
        }
        if (_0x4384ad && _0x3acd19 !== _0x4384ad) {
          continue;
        }
        if (_0x4384ad && Number["isFinite"](_0x122b09) && _0x26c8a5[_0x4384ad] >= _0x122b09) {
          continue;
        }
        if (_0x257e28 && _0x3acd19 !== "image") {
          continue;
        }
        if (_0x257e28 && _0x26c8a5['image'] >= 0x2) {
          continue;
        }
        _0x26c8a5[_0x3acd19]++;
        const _0x342148 = {
          'text': t('aigenImage.refs.types.text'),
          'image': t("aigenImage.refs.types.image"),
          'video': t("aigenImage.refs.types.video"),
          'audio': t("aigenImage.refs.types.audio")
        };
        const _0x54325d = '@' + _0x342148[_0x3acd19] + _0x26c8a5[_0x3acd19];
        _0x5a5164[_0x4c0815["sourceId"]] = _0x54325d;
        let _0x1f5646 = '';
        let _0x6c29be = '';
        let _0x3ad904 = '';
        let _0x3525de = '';
        if (_0x3acd19 === 'image') {
          let _0x4004c7 = '';
          for (const _0x5ed884 of collectRefThumbIds(_0x56cdca)) {
            _0x4004c7 = this['_refThumbObjectUrls']['get'](_0x5ed884) || '';
            if (!_0x4004c7) {
              this["_scheduleRefThumbObjectUrl"](_0x5ed884);
            }
            if (_0x4004c7) {
              break;
            }
          }
          ({
            thumbSrc: _0x6c29be,
            previewSrc: _0x3ad904,
            mediaIdentityKey: _0x3525de
          } = resolveVersionedRefImageRenderSources(_0x56cdca, _0x4c0815, {
            'thumbBlobUrl': _0x4004c7
          }));
        }
        let _0x5e439c = resolveCanvasImageDisplayUrl(_0x56cdca);
        !_0x5e439c && _0x56cdca["thumbId"] && (this["_refThumbObjectUrls"]["has"](_0x56cdca["thumbId"]) ? _0x5e439c = this["_refThumbObjectUrls"]["get"](_0x56cdca["thumbId"]) : this["_scheduleRefThumbObjectUrl"](_0x56cdca["thumbId"]));
        if (!_0x5e439c) {
          const _0x37d895 = resolveRefImageCandidateUrls(_0x56cdca);
          _0x5e439c = _0x37d895[0x0] || '';
        }
        _0x3acd19 === "image" && (_0x5e439c = _0x6c29be || _0x5e439c);
        if (_0x3acd19 === "image" && _0x5e439c) {
          _0xb45855(_0x5e439c);
          _0x3ad904 && _0x3ad904 !== _0x5e439c && _0xb45855(_0x3ad904);
          _0x1f5646 = createReferenceInputThumbnailHtml({
            'kind': "image",
            'thumbnailUrl': _0x5e439c,
            'extraHtml': createReferenceMaskBadgeHtml(_0x56cdca)
          });
        } else {
          if (_0x3acd19 === 'text') {
            const _0x2e9b60 = _0x56cdca["type"] === "ai-text";
            if (_0x2e9b60 && !_0x56cdca["outputText"]) {
              continue;
            }
            _0x1f5646 = createReferenceInputThumbnailHtml({
              'kind': "text"
            });
          } else {
            if (_0x3acd19 === 'video') {
              _0x5e439c = resolveReferenceVideoThumbnail(_0x56cdca, _0x4c0815)["thumbUrl"];
              if (_0x5e439c) {
                _0xb45855(_0x5e439c);
              }
              _0x1f5646 = createReferenceInputThumbnailHtml({
                'kind': "video",
                'thumbnailUrl': _0x5e439c
              });
            } else {
              _0x3acd19 === "audio" && (_0x1f5646 = createReferenceInputThumbnailHtml({
                'kind': "audio"
              }));
            }
          }
        }
        if (_0x1f5646) {
          const _0x357c9e = String(_0x56cdca["mask"] || '')['trim']() ? 'm1' : 'm0';
          const _0x164837 = _0x3acd19 + '|' + _0x4c0815['id'] + '|' + _0x4c0815["sourceId"] + '|' + (_0x5e439c || '') + '|' + (_0x3ad904 || '') + '|' + _0x3525de + '|' + _0x357c9e;
          _0x4f68b1['push']({
            'key': 'edge:' + _0x4c0815['id'],
            'edgeId': _0x4c0815['id'],
            'sourceId': _0x4c0815["sourceId"],
            'refSlot': _0x4c0815["refSlot"] || '',
            'type': _0x3acd19,
            'label': _0x54325d,
            'sig': _0x164837,
            'thumbHTML': _0x1f5646,
            'thumbSrc': _0x6c29be || _0x5e439c || '',
            'previewSrc': _0x3ad904 || _0x5e439c || ''
          });
        }
      }
      isInputKindAllowed(_0xa2ef17, "image") && getAssetInputRefsFromPromptAndNode(this["promptEl"], {
        'nodeData': _0x39c941,
        'allowedTypes': ['image'],
        'dedupe': !isRunningHubWorkflowNode(_0x39c941) && !_0x4ba382
      })["forEach"]((_0x5cb79d, _0x56c102) => {
        const _0xdf740a = resolveEffectiveInputKind(_0x5cb79d);
        if (_0xdf740a !== 'image' || !isInputKindAllowed(_0xa2ef17, _0xdf740a)) {
          return;
        }
        const _0x1a80e2 = String(_0x5cb79d['thumbUrl'] || _0x5cb79d["url"] || '')["trim"]();
        if (!_0x1a80e2) {
          return;
        }
        _0xb45855(_0x1a80e2);
        const _0x4cd90d = String(_0x5cb79d['assetId'] || '');
        const _0x5a03ae = String(_0x5cb79d['itemIndex'] ?? '');
        const _0x2237c1 = String(_0x5cb79d["assetMentionOccurrence"] ?? '');
        const _0x365f50 = String(_0x5cb79d["assetRefSource"] || "prompt");
        const _0x19849e = "asset:" + _0x4cd90d + ':' + _0x5a03ae;
        const _0x136f26 = 'asset:' + _0x365f50 + ':' + _0x4cd90d + ':' + _0x5a03ae + ":image:" + _0x56c102;
        _0x4f68b1["push"]({
          'key': _0x136f26,
          'edgeId': '',
          'sourceId': _0x19849e,
          'refSlot': '',
          'type': "image",
          'label': _0x5cb79d["label"] || _0x5cb79d['name'] || t("aigenImage.refs.referenceImage"),
          'sig': _0x136f26 + '|' + String(_0x5cb79d["url"] || '') + '|' + _0x1a80e2,
          'thumbHTML': createReferenceInputThumbnailHtml({
            'kind': "image",
            'thumbnailUrl': _0x1a80e2
          }),
          'thumbSrc': _0x1a80e2,
          'previewSrc': String(_0x5cb79d['url'] || _0x1a80e2),
          'virtual': !![],
          'assetId': _0x4cd90d,
          'assetIndex': _0x5a03ae,
          'assetOccurrence': _0x2237c1,
          'assetRefSource': _0x365f50,
          'refType': "image"
        });
      });
      if (_0x257e28) {
        const _0x414175 = ['replaceTarget', 'replacedImage'];
        const _0x39ada0 = () => {
          const _0x122391 = !!this["refBarEl"]["querySelector"]("[data-ref-slot=\"replaceTarget\"]");
          const _0x288bc7 = !!this["refBarEl"]['querySelector']("[data-ref-slot=\"replacedImage\"]");
          let _0x2979e2 = this['refBarEl']['querySelector'](".prompt-attachment-btn");
          let _0x10f396 = this["refBarEl"]["querySelector"](".ref-thumb-container");
          if (!_0x2979e2 || !_0x10f396 || !_0x122391 || !_0x288bc7) {
            const _0x56a7fd = t("aigenImage.refs.replaceTarget");
            const _0x549c28 = t('aigenImage.refs.replacedImage');
            this["refBarEl"]["innerHTML"] = _0x5a7c97 + " <div class=\"ref-thumb-container\"><div class=\"ref-thumb-wrap ref-upload-slot\" data-ref-slot=\"replaceTarget\" data-slot=\"replaceTarget\" data-kind=\"image\" draggable=\"false\" title=\"" + escapeRefBarHtml(_0x56a7fd) + '\x22><span\x20class=\x22ref-upload-label\x22>' + formatRefUploadLabel(_0x56a7fd) + "</span></div><div class=\"ref-thumb-wrap ref-upload-slot\" data-ref-slot=\"replacedImage\" data-slot=\"replacedImage\" data-kind=\"image\" draggable=\"false\" title=\"" + escapeRefBarHtml(_0x549c28) + "\"><span class=\"ref-upload-label\">" + formatRefUploadLabel(_0x549c28) + "</span></div></div>";
            _0x2979e2 = this["refBarEl"]["querySelector"](".prompt-attachment-btn");
            _0x10f396 = this["refBarEl"]["querySelector"](".ref-thumb-container");
            this["_attachBtnIcon"] = _0x2979e2 ? _0x2979e2["querySelector"]('.btn-icon') : null;
          }
          const _0xb3b3f5 = this['refBarEl']["querySelector"]("[data-ref-slot=\"replaceTarget\"]");
          const _0x1c4132 = this['refBarEl']["querySelector"]('[data-ref-slot=\x22replacedImage\x22]');
          return {
            'targetEl': _0xb3b3f5,
            'sourceEl': _0x1c4132,
            'container': _0x10f396
          };
        };
        const {
          targetEl: _0x3e922e,
          sourceEl: _0x381e2d,
          container: _0x1cc8f4
        } = _0x39ada0();
        _0x3e922e["style"]['order'] = String(_0x4ba382['slotById']["replaceTarget"]['displayOrder']);
        _0x381e2d["style"]['order'] = String(_0x4ba382['slotById']['replacedImage']["displayOrder"]);
        this["_lastRefHTML"] = "__rh-person-replace-v3__";
        this["refBarEl"]['classList']["add"]("active");
        const _0x2d83ec = _0x306878 => String(_0x306878?.["key"] || _0x306878?.["edgeId"] || '');
        const _0xfb46f8 = new Set();
        const _0x200289 = new Map();
        const _0x5e1f41 = [{
          'key': _0x414175[0x0],
          'el': _0x3e922e,
          'title': t("aigenImage.refs.replaceTarget"),
          'emptyHtml': formatRefUploadLabel(t('aigenImage.refs.replaceTarget'))
        }, {
          'key': _0x414175[0x1],
          'el': _0x381e2d,
          'title': t('aigenImage.refs.replacedImage'),
          'emptyHtml': formatRefUploadLabel(t("aigenImage.refs.replacedImage"))
        }];
        for (const _0x48e6dc of _0x4f68b1) {
          const _0x405008 = _0x2d83ec(_0x48e6dc);
          if (!_0x405008 || _0xfb46f8['has'](_0x405008)) {
            continue;
          }
          const _0x2784d4 = String(_0x48e6dc["refSlot"] || '');
          if (!_0x414175["includes"](_0x2784d4)) {
            continue;
          }
          if (_0x200289["has"](_0x2784d4)) {
            continue;
          }
          _0x200289["set"](_0x2784d4, _0x48e6dc);
          _0xfb46f8["add"](_0x405008);
        }
        for (const _0x3d77f6 of _0x4f68b1) {
          const _0x3a8f91 = _0x2d83ec(_0x3d77f6);
          if (!_0x3a8f91 || _0xfb46f8["has"](_0x3a8f91)) {
            continue;
          }
          for (const _0x56c495 of _0x414175) {
            if (!_0x200289['has'](_0x56c495)) {
              _0x200289["set"](_0x56c495, _0x3d77f6);
              _0xfb46f8['add'](_0x3a8f91);
              break;
            }
          }
        }
        const _0x2a98a1 = (_0x1a2fe6, _0x3a497c, _0x4df237) => {
          const _0x403932 = document['createElement']("div");
          _0x403932['className'] = 'ref-thumb-wrap\x20ref-upload-slot';
          _0x403932["dataset"]["refSlot"] = _0x1a2fe6;
          _0x403932["dataset"]["slot"] = _0x1a2fe6;
          _0x403932['dataset']["kind"] = "image";
          _0x403932["title"] = _0x3a497c;
          _0x403932["setAttribute"]('draggable', "false");
          _0x403932["innerHTML"] = "<span class=\"ref-upload-label\">" + _0x4df237 + "</span>";
          return _0x403932;
        };
        const _0x431a21 = (_0x5cb3e3, _0x505da9, _0x47238f) => {
          const _0x2565a0 = document["createElement"]("div");
          _0x2565a0["className"] = "ref-thumb-wrap" + (_0x47238f["virtual"] ? " ref-thumb-wrap--asset" : '');
          _0x2565a0["dataset"]["refSlot"] = _0x5cb3e3;
          _0x2565a0["dataset"]["slot"] = _0x5cb3e3;
          _0x2565a0["dataset"]['kind'] = "image";
          _0x2565a0["title"] = _0x505da9;
          _0x2565a0["setAttribute"]("draggable", _0x47238f["virtual"] ? "false" : "true");
          return _0x2565a0;
        };
        for (const _0x452df6 of _0x5e1f41) {
          const _0x402233 = _0x200289["get"](_0x452df6["key"]) || null;
          let _0x380794 = _0x452df6['el'];
          if (!_0x380794) {
            continue;
          }
          if (_0x402233 && _0x380794["classList"]?.["contains"]?.('ref-upload-slot')) {
            const _0x4e3d38 = _0x431a21(_0x452df6['key'], _0x452df6["title"], _0x402233);
            _0x380794['replaceWith'](_0x4e3d38);
            _0x380794 = _0x4e3d38;
            _0x452df6['el'] = _0x4e3d38;
          } else {
            if (!_0x402233 && !_0x380794["classList"]?.["contains"]?.("ref-upload-slot")) {
              const _0x193b4f = _0x2a98a1(_0x452df6["key"], _0x452df6["title"], _0x452df6["emptyHtml"]);
              _0x380794['replaceWith'](_0x193b4f);
              _0x380794 = _0x193b4f;
              _0x452df6['el'] = _0x193b4f;
            }
          }
          _0x380794["dataset"]["refSlot"] = _0x452df6['key'];
          _0x380794["dataset"]["slot"] = _0x452df6["key"];
          _0x380794["dataset"]["kind"] = "image";
          _0x380794["title"] = _0x452df6["title"];
          if (_0x402233) {
            _0x380794["className"] = 'ref-thumb-wrap' + (_0x402233["virtual"] ? " ref-thumb-wrap--asset" : '');
            _0x380794["classList"]?.['remove']?.("ref-upload-slot");
            _0x380794['setAttribute']("draggable", _0x402233["virtual"] ? "false" : "true");
            _0x380794["dataset"]["refKey"] = _0x2d83ec(_0x402233);
            _0x380794["dataset"]["edgeId"] = _0x402233["edgeId"] || '';
            _0x380794['dataset']['sourceId'] = _0x402233["sourceId"] || '';
            _0x380794["dataset"]["refOrigin"] = _0x402233["virtual"] ? "asset" : "node";
            _0x402233["virtual"] ? (_0x380794["dataset"]["assetId"] = _0x402233["assetId"] || '', _0x380794["dataset"]["assetIndex"] = _0x402233['assetIndex'] || '', _0x380794["dataset"]["assetOccurrence"] = _0x402233["assetOccurrence"] || '', _0x380794["dataset"]["assetRefSource"] = _0x402233["assetRefSource"] || "prompt", _0x380794["dataset"]["refType"] = _0x402233["refType"] || _0x402233['type'] || '') : (delete _0x380794['dataset']["assetId"], delete _0x380794["dataset"]["assetIndex"], delete _0x380794['dataset']["assetOccurrence"], delete _0x380794["dataset"]['assetRefSource'], delete _0x380794["dataset"]["refType"]);
            _0x380794["dataset"]["sig"] !== _0x402233["sig"] && (_0x380794['innerHTML'] = _0x402233["thumbHTML"] + "<button type=\"button\" class=\"ref-thumb-delete\" title=\"" + t('aigenImage.refs.removeReference') + "\">&times;</button>", _0x380794["dataset"]["sig"] = _0x402233["sig"], _0x32d229(_0x380794, _0x402233["sig"]));
            if (_0x402233['thumbSrc']) {
              _0x380794["dataset"]["thumbSrc"] = _0x402233["thumbSrc"];
            } else {
              delete _0x380794["dataset"]["thumbSrc"];
            }
            if (_0x402233["previewSrc"]) {
              _0x380794["dataset"]["previewSrc"] = _0x402233["previewSrc"];
            } else {
              delete _0x380794['dataset']["previewSrc"];
            }
          } else {
            _0x380794["className"] = "ref-thumb-wrap ref-upload-slot";
            _0x380794["setAttribute"]("draggable", "false");
            if (_0x380794["dataset"]['refKey']) {
              delete _0x380794["dataset"]["refKey"];
            }
            if (_0x380794["dataset"]['edgeId']) {
              delete _0x380794["dataset"]["edgeId"];
            }
            if (_0x380794["dataset"]["sourceId"]) {
              delete _0x380794["dataset"]["sourceId"];
            }
            if (_0x380794["dataset"]["refOrigin"]) {
              delete _0x380794["dataset"]["refOrigin"];
            }
            if (_0x380794["dataset"]["assetId"]) {
              delete _0x380794["dataset"]["assetId"];
            }
            if (_0x380794['dataset']["assetIndex"]) {
              delete _0x380794['dataset']['assetIndex'];
            }
            if (_0x380794['dataset']["assetOccurrence"]) {
              delete _0x380794["dataset"]["assetOccurrence"];
            }
            if (_0x380794["dataset"]['assetRefSource']) {
              delete _0x380794["dataset"]["assetRefSource"];
            }
            if (_0x380794['dataset']["refType"]) {
              delete _0x380794["dataset"]["refType"];
            }
            if (_0x380794['dataset']["sig"]) {
              delete _0x380794['dataset']["sig"];
            }
            if (_0x380794["dataset"]['thumbSrc']) {
              delete _0x380794["dataset"]["thumbSrc"];
            }
            if (_0x380794['dataset']["previewSrc"]) {
              delete _0x380794['dataset']["previewSrc"];
            }
            const _0x9b2a18 = "<span class=\"ref-upload-label\">" + _0x452df6["emptyHtml"] + "</span>";
            if (_0x380794["innerHTML"] !== _0x9b2a18) {
              _0x380794["innerHTML"] = _0x9b2a18;
            }
          }
        }
        bindRefThumbFixedSlotDrag({
          'owner': this,
          'container': _0x1cc8f4,
          'store': _0x46a9b1,
          'nodeId': this["nodeId"],
          'acceptMap': {
            'replaceTarget': "image",
            'replacedImage': 'image'
          }
        });
        this["_syncBtnIconState"]();
        _0x5ee45d(this, {});
        return;
      }
      if (_0x4ba382 && renderManifestFixedImageRefBar({
        'owner': this,
        'refBarEl': this["refBarEl"],
        'promptEl': this["promptEl"],
        'attachBtnHTML': _0x5a7c97,
        'fixedInputConfig': _0x4ba382,
        'items': _0x4f68b1,
        'targetNodeData': _0x39c941,
        'sourceIdToLabel': _0x5a5164,
        'store': _0x46a9b1,
        'nodeId': this["nodeId"],
        'ensureThumbDecoded': _0xb45855,
        'revealRefThumbMedia': _0x32d229,
        'syncPillLabels': _0x5ee45d
      })) {
        return;
      }
      if (this['_isDraggingSorting']) {
        this["_syncBtnIconState"]();
        _0x5ee45d(this, _0x5a5164);
        return;
      }
      if (_0x4f68b1["length"] > 0x0) {
        this["refBarEl"]['classList']["add"]("active");
        this['refBarEl']['classList']['remove']("rh-v5-refbar");
        const _0x408092 = this["_lastRefHTML"];
        this["_lastRefHTML"] = "__has-items__";
        const {
          thumbContainer: _0x327566
        } = _0xf560ef();
        String(_0x408092 || '')["startsWith"]("__rh-") && _0x327566["querySelectorAll"](".ref-thumb-wrap")["forEach"](_0x128def => _0x128def["remove"]());
        _0x327566['querySelectorAll'](".ref-upload-slot")['forEach'](_0x3a0bf0 => _0x3a0bf0['remove']());
        _0x327566["querySelectorAll"]('.ref-thumb-wrap')["forEach"](_0x31a967 => {
          const _0x5bc665 = String(_0x31a967?.["dataset"]?.["refKey"] || '')["trim"]() || (String(_0x31a967?.["dataset"]?.["edgeId"] || '')["trim"]() ? 'edge:' + String(_0x31a967["dataset"]["edgeId"])["trim"]() : '');
          if (!_0x5bc665) {
            _0x31a967["remove"]();
          }
        });
        const _0x58c9fe = new Map();
        _0x327566["querySelectorAll"](".ref-thumb-wrap")['forEach'](_0xc7878d => {
          const _0x224e01 = String(_0xc7878d?.["dataset"]?.['edgeId'] || '')["trim"]();
          const _0x1a9d7f = String(_0xc7878d?.["dataset"]?.["refKey"] || '')["trim"]() || (_0x224e01 ? 'edge:' + _0x224e01 : '');
          if (!_0x1a9d7f) {
            return;
          }
          _0x58c9fe["set"](_0x1a9d7f, _0xc7878d);
        });
        const _0x54289c = new Set();
        for (let _0x1506fd = 0x0; _0x1506fd < _0x4f68b1['length']; _0x1506fd++) {
          const _0x423f70 = _0x4f68b1[_0x1506fd];
          const _0x30b63d = String(_0x423f70["key"] || _0x423f70["edgeId"] || '');
          if (!_0x30b63d) {
            continue;
          }
          let _0x363214 = _0x58c9fe["get"](_0x30b63d);
          !_0x363214 && (_0x363214 = document['createElement']('div'), _0x363214["className"] = "ref-thumb-wrap" + (_0x423f70["virtual"] ? " ref-thumb-wrap--asset" : ''));
          _0x363214["setAttribute"]('draggable', _0x423f70['virtual'] ? "false" : 'true');
          _0x363214["dataset"]["sig"] !== _0x423f70["sig"] && (_0x363214['innerHTML'] = _0x423f70["thumbHTML"] + '<button\x20type=\x22button\x22\x20class=\x22ref-thumb-delete\x22\x20title=\x22' + t("aigenImage.refs.removeReference") + "\">&times;</button>", _0x363214["dataset"]["sig"] = _0x423f70['sig'], _0x32d229(_0x363214, _0x423f70["sig"]));
          _0x363214["dataset"]["refKey"] = _0x30b63d;
          _0x363214["dataset"]['edgeId'] = _0x423f70["edgeId"] || '';
          _0x363214["dataset"]["sourceId"] = _0x423f70["sourceId"];
          _0x363214["dataset"]['refOrigin'] = _0x423f70["virtual"] ? 'asset' : "node";
          _0x423f70["virtual"] ? (_0x363214["dataset"]["assetId"] = _0x423f70["assetId"] || '', _0x363214["dataset"]["assetIndex"] = _0x423f70["assetIndex"] || '', _0x363214['dataset']['assetOccurrence'] = _0x423f70["assetOccurrence"] || '', _0x363214["dataset"]["assetRefSource"] = _0x423f70["assetRefSource"] || "prompt", _0x363214["dataset"]["refType"] = _0x423f70['refType'] || _0x423f70["type"] || '') : (delete _0x363214["dataset"]["assetId"], delete _0x363214["dataset"]["assetIndex"], delete _0x363214["dataset"]["assetOccurrence"], delete _0x363214["dataset"]['assetRefSource'], delete _0x363214['dataset']['refType']);
          _0x363214["dataset"]["type"] = _0x423f70["type"];
          _0x363214["dataset"]["label"] = _0x423f70['label'];
          _0x363214["dataset"]["index"] = String(_0x1506fd);
          if (_0x423f70["thumbSrc"]) {
            _0x363214["dataset"]["thumbSrc"] = _0x423f70["thumbSrc"];
          } else {
            delete _0x363214["dataset"]['thumbSrc'];
          }
          if (_0x423f70["previewSrc"]) {
            _0x363214["dataset"]["previewSrc"] = _0x423f70["previewSrc"];
          } else {
            delete _0x363214["dataset"]["previewSrc"];
          }
          _0x327566["appendChild"](_0x363214);
          _0x54289c['add'](_0x30b63d);
        }
        for (const [_0x14bf2c, _0x2805f8] of _0x58c9fe["entries"]()) {
          if (!_0x54289c["has"](_0x14bf2c)) {
            _0x2805f8["remove"]();
          }
        }
        this['_bindDragSort'](this["refBarEl"]);
      } else {
        if (_0x4384ad === "image") {
          this['refBarEl']["classList"]['remove']('rh-v5-refbar');
          const _0x452647 = t("aigenImage.refs.uploadReference");
          const _0x32f17e = _0x5a7c97 + " <div class=\"ref-thumb-container\">" + (_0x7e4ce0 ? "<div class=\"ref-thumb-wrap ref-upload-slot\" data-ref-src=\"upload\">" + createReferenceInputThumbnailHtml({
            'kind': "image",
            'thumbnailUrl': _0x7e4ce0
          }) + "<button type=\"button\" class=\"ref-upload-delete\" title=\"" + t("aigenImage.refs.removeReference") + "\">&times;</button></div>" : "<button type=\"button\" class=\"ref-thumb-wrap ref-upload-slot\" title=\"" + escapeRefBarHtml(_0x452647) + "\"><span class=\"ref-upload-label\">" + formatRefUploadLabel(_0x452647) + "</span></button>") + '</div>';
          if (this["_lastRefHTML"] !== _0x32f17e) {
            this["_lastRefHTML"] = _0x32f17e;
            this['refBarEl']["classList"]["add"]("active");
            this["refBarEl"]["innerHTML"] = _0x32f17e;
            const _0x188193 = this["refBarEl"]["querySelector"](".prompt-attachment-btn");
            this["_attachBtnIcon"] = _0x188193 ? _0x188193["querySelector"](".btn-icon") : null;
          }
        } else {
          this["refBarEl"]["classList"]['remove']('active');
          this["refBarEl"]["classList"]["remove"]("rh-v5-refbar");
          this["_lastRefHTML"] = "__empty__";
          const {
            thumbContainer: _0x24f61c
          } = _0xf560ef();
          _0x24f61c["querySelectorAll"](".ref-thumb-wrap")['forEach'](_0x4844b1 => _0x4844b1["remove"]());
        }
      }
      this['_syncBtnIconState']();
      _0x5ee45d(this, _0x5a5164);
    }
    ["_syncBtnIconState"]() {
      syncImageRefBarButtonIcon({
        'refBarEl': this["refBarEl"],
        'pickMode': this["_getStoreStateForRead"]()["pickConnectMode"],
        'nodeId': this["nodeId"]
      });
    }
    ["_bindDragSort"](_0x5cdfa9) {
      bindImageRefThumbOrderDrag({
        'owner': this,
        'refBar': _0x5cdfa9,
        'store': _0x46a9b1,
        'nodeId': this["nodeId"]
      });
    }
  }
  return _0x28b92e["prototype"];
}