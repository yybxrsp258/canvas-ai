import { openDebugRequestWindow } from '../../modules/debugRequestWindow.js';
import { sanitizePromptHtml } from '../../utils/dom.js';
import { isPreviewModeEnabled, syncPreviewNodeLoading } from '../../modules/previewMode.js';
import { setupPromptBoxResize, syncPromptBoxSizeFromData } from './promptBoxResizeUi.js';
import { createNodeResizeHandle } from './nodeResizeUi.js';
import { DEBUG_WRENCH_ICON_HTML, buildFinalApiDebugPreview } from '../../utils/debugRequestPreview.js';
import { getNodeDefaultSize } from '../../services/fileService.js';
import { bindNodeFooterController, bindNodeModelMenuTrigger, closeNodeFooterMenus } from '../shared/nodeFooterControls.js';
import { onLocaleChange, t } from '../../i18n/index.js';
import { flushPromptHtmlCommit, handlePromptPaste, handlePromptSelectAll, schedulePromptHtmlCommit, shouldSubmitPromptByKeyboard } from '../../modules/nodePromptShared.js';
import { shouldSkipPromptTriggerForBulkInput } from '../../modules/promptTriggerComposition.js';
import { renderAIGenTextModelSelectorMarkup } from './modelSelector.js';
import { bindAIGenTextRuntimeParameterControls } from './runtimeModelParameterControls.js';
import { renderMarkdownToHtml } from './markdownRenderer.js';
import { syncTextResultSources } from './textResultSources.js';
import { textResultImagePresentationText } from '../../utils/textResultImages.js';
import { bindReadonlyTextSelection } from './readonlyTextSelection.js';
import { createPromptPresetTriggerController } from '../promptPresetTrigger.js';
import { attachNodePromptExpansion } from '../nodePromptExpansion.js';
import { createModelProviderProfileControl } from '../shared/modelProviderProfileControl.js';
import { buildModelProviderProfileSelectionPatch } from '../../modules/modelProviderProfileSelection.js';
import { buildModelGenerationParamsSelectionPatch } from '../../modules/modelGenerationParamMemory.js';
import { bindModelCredentialMenu, syncModelCredentialMenu } from '../../modules/modelCredentialUi.js';
import { bindGenerationNodeCredentialLifecycle } from '../shared/generationNodeCredentialLifecycle.js';
export function createAIGenTextNodeUiModule(_0x46c75c) {
  const {
    store: _0x1e2cf8,
    api: _0x3d2e6f,
    getDisplayModelName: _0x38c0af,
    ensureThumbDecoded: _0xfaf05a,
    revealRefThumbMedia: _0x50af74,
    commit: _0x51e5c9,
    TEXT_TOOLBAR_HTML: _0x592c99,
    bindTextToolbarEvents: _0xd9468,
    getPromptPresets: _0x2cfc72,
    openCustomPresetsManager: _0x16a352,
    startLoading: _0x243986,
    stopLoading: _0x1794e0,
    bindRefThumbHoverPreview: _0x4c14c8,
    checkSlashTrigger: _0x404ddd,
    handleSlashKeyboardNavigation: _0x3e2607,
    closeSlashMenu: _0x3b3bcc,
    activateMenuKeyboard: _0x51c86b,
    _checkAtTrigger: _0x3a2a0e,
    _populateMentionMenu: _0xbdf53f,
    _handleMentionMenuKeyboard: _0x22e6cc,
    _handlePillKeyboard: _0x19c349,
    _rehydratePromptPills: _0x2fe395,
    _handlePillHover: _0x4e450b,
    _handlePillOut: _0x3c3d41,
    _syncEdgesOrderFromPills: _0x3dd74a,
    _syncPillLabels: _0xaeeb5f,
    getCustomTextModels: _0x525c5d,
    saveCustomTextModels: _0x76d039
  } = _0x46c75c;
  const _0x2a0e0d = () => typeof _0x1e2cf8['getStateRaw'] === 'function' ? _0x1e2cf8["getStateRaw"]() : _0x1e2cf8['getState']();
  const _0xe70354 = 0x78;
  class _0x3aeb6f {
    ["mount"]() {
      const _0x4e4043 = document["createElement"]("div");
      _0x4e4043["className"] = "aigen-node-root aigen-text-node-root";
      this['_root'] = _0x4e4043;
      _0x4e4043["innerHTML"] = _0x592c99;
      this["previewEl"] = document["createElement"]("div");
      this["previewEl"]["className"] = "img-node-preview aigen-node-preview-fill aigen-text-preview";
      this["outputEl"] = document["createElement"]("div");
      this["outputEl"]["className"] = "text-output-content aigen-text-output";
      this['outputEl']['setAttribute']("contenteditable", "false");
      const _0x1206c9 = document["createElement"]("div");
      _0x1206c9["className"] = "img-node-placeholder aigen-media-placeholder aigen-text-placeholder";
      _0x1206c9["textContent"] = t("aigenText.previewPlaceholder");
      this['_placeholderEl'] = _0x1206c9;
      this["previewEl"]["appendChild"](this["outputEl"]);
      this["previewEl"]["appendChild"](_0x1206c9);
      syncPreviewNodeLoading(this['nodeId'], this["previewEl"], this["_getPreviewGenerateButtonLoadingOptions"]?.());
      this["_unbindOutputTextSelection"] = bindReadonlyTextSelection(this["outputEl"], {
        'onActivate': () => this['_enterOutputEditMode'](),
        'onDeactivate': () => this['_commitOutputScrollTop']()
      });
      this["outputEl"]["addEventListener"]('blur', () => {
        this["outputEl"]['setAttribute']('contenteditable', "false");
        this["outputEl"]['style']["cursor"] = '';
        this["_commitOutputScrollTop"]();
      });
      this["outputEl"]['addEventListener']('wheel', _0x1650bc => {
        _0x1650bc["stopPropagation"]();
      }, {
        'passive': ![]
      });
      this["outputEl"]["addEventListener"]("scroll", () => {
        this["_markOutputScrollTopDirty"]();
      });
      if (this["_data"]["outputText"]) {
        this["_renderOutputText"](this["_data"]["outputText"]);
      }
      this['outputEl']['scrollTop'] = this["_outputScrollTop"];
      _0x4e4043["appendChild"](this["previewEl"]);
      const _0x4fea30 = document["createElement"]('div');
      _0x4fea30["className"] = "text-prompt-panel";
      this['_promptPanel'] = _0x4fea30;
      this["_modelProviderProfileControl"]?.["remove"]?.();
      this['_modelProviderProfileControl'] = createModelProviderProfileControl({
        'panel': _0x4fea30,
        'getNodeData': () => _0x2a0e0d()["nodes"]?.[this["nodeId"]] || this["_data"] || {},
        'onChange': _0x99a0c6 => _0x1e2cf8["updateNodeData"](this["nodeId"], _0x99a0c6)
      });
      _0x4fea30['addEventListener']("pointerdown", _0x3f8507 => {
        _0x3f8507['stopPropagation']();
      });
      _0x4fea30["addEventListener"]("dblclick", _0x453100 => {
        !_0x453100["target"]['closest']('.prompt-textarea') && !_0x453100["target"]["closest"](".text-output-content") && (_0x453100["preventDefault"](), _0x453100['stopPropagation']());
      });
      this["refBarEl"] = document["createElement"]("div");
      this["refBarEl"]['className'] = "node-ref-bar";
      _0x4fea30["appendChild"](this["refBarEl"]);
      this["refBarEl"]["addEventListener"]("click", _0x9ec09f => {
        const _0x45ea76 = _0x9ec09f["target"]["closest"](".ref-thumb-delete");
        if (_0x45ea76) {
          _0x9ec09f["stopPropagation"]();
          _0x9ec09f['preventDefault']();
          const _0x104ede = _0x45ea76["closest"](".ref-thumb-wrap")?.['dataset']['edgeId'];
          if (_0x104ede) {
            _0x1e2cf8["removeEdge"](_0x104ede);
          }
          return;
        }
        const _0x36fd41 = _0x9ec09f["target"]["closest"](".prompt-attachment-btn");
        if (!_0x36fd41) {
          return;
        }
        if (_0x9ec09f["_pickConnectHandled"]) {
          return;
        }
        _0x9ec09f['stopPropagation']();
        _0x9ec09f["preventDefault"]();
        const _0x2268bc = _0x1e2cf8["getState"]()["pickConnectMode"];
        _0x2268bc && _0x2268bc['active'] && _0x2268bc["sourceNodeId"] === this["nodeId"] ? _0x1e2cf8["setPickConnectMode"]({
          'active': ![]
        }) : _0x1e2cf8['setPickConnectMode']({
          'active': !![],
          'sourceNodeId': this["nodeId"],
          'handleDirection': "left"
        });
      });
      this["refBarEl"]["addEventListener"]("pointerdown", _0x5018ac => {
        if (_0x5018ac["target"]["closest"](".prompt-attachment-btn, .ref-thumb-delete")) {
          _0x5018ac["stopPropagation"]();
        }
      });
      this["_unbindRefThumbHoverPreview"] = _0x4c14c8(this['refBarEl']);
      const _0x1179f0 = document['createElement']("div");
      _0x1179f0["className"] = "prompt-input-wrapper";
      _0x1179f0["classList"]['add']("is-resizable");
      this["_promptInputWrap"] = _0x1179f0;
      this['promptEl'] = document['createElement']("div");
      this["promptEl"]["className"] = "prompt-textarea custom-textarea";
      this["promptEl"]["contentEditable"] = "true";
      this["promptEl"]['spellcheck'] = ![];
      this['promptEl']["dataset"]["placeholder"] = t("aigenText.promptPlaceholder");
      document['documentElement']["classList"]["add"]("node-prompt-styles-ready");
      this["_flushPromptHtmlCommit"] = () => flushPromptHtmlCommit(this);
      this["promptEl"]["addEventListener"]('input', _0x22e2c0 => {
        schedulePromptHtmlCommit(this);
        this["_checkAtTrigger"](_0x22e2c0);
        _0x404ddd(_0x22e2c0, {
          'promptEl': this["promptEl"],
          'nodeType': this["_data"]["type"],
          'nodeId': this["nodeId"],
          'onGenerate': (_0x11d523, _0x2d785e) => this["_onGenerate"](_0x11d523, _0x2d785e)
        });
        if (shouldSkipPromptTriggerForBulkInput(_0x22e2c0)) {
          return;
        }
        _0x3dd74a(this);
        this['_updateSubmitButtonState']();
      });
      this["promptEl"]["addEventListener"]("blur", () => {
        flushPromptHtmlCommit(this);
      });
      this["promptEl"]["addEventListener"]("mouseover", _0x22ec1a => _0x4e450b(_0x22ec1a, this));
      this['promptEl']["addEventListener"]("mouseout", _0x139562 => _0x3c3d41(_0x139562, this));
      this['promptEl']["addEventListener"]('keydown', _0xdc29bc => {
        if (handlePromptSelectAll(this, _0xdc29bc)) {
          return;
        }
        if (_0x22e6cc(_0xdc29bc)) {
          return;
        }
        if (_0x3e2607(_0xdc29bc)) {
          return;
        }
        if (shouldSubmitPromptByKeyboard(_0xdc29bc)) {
          _0xdc29bc["preventDefault"]();
          flushPromptHtmlCommit(this);
          this["btnEl"]?.['click']();
          return;
        }
        _0x19c349(this, _0xdc29bc);
      });
      this["promptEl"]['addEventListener']('paste', _0x53fba1 => {
        handlePromptPaste(this, _0x53fba1);
      });
      this["_data"]["prompt"] && (this["promptEl"]["innerHTML"] = sanitizePromptHtml(this["_data"]['prompt']), _0x2fe395(this));
      _0x1179f0["appendChild"](this["promptEl"]);
      this["_syncPromptBoxSizeFromData"](this["_data"]);
      this["_setupPromptBoxResize"]();
      _0x4fea30["appendChild"](_0x1179f0);
      this['_promptPresetTrigger']?.["remove"]?.();
      this["_promptPresetTrigger"] = createPromptPresetTriggerController({
        'panel': _0x4fea30,
        'getPromptEl': () => this["promptEl"],
        'getNodeType': () => this["_data"]?.["type"],
        'getNodeId': () => this["nodeId"],
        'onGenerate': (_0x308a4b, _0x3e0416) => this["_onGenerate"](_0x308a4b, _0x3e0416)
      });
      const _0x40aece = document["createElement"]('div');
      _0x40aece['className'] = "prompt-panel-footer";
      const _0x2e4166 = String(this["_data"]["provider"] || '')["trim"]()["toLowerCase"]();
      const _0x122371 = this['_data']["model"] || "apimart/kimi-k2-instruct";
      _0x40aece['innerHTML'] = "\n          " + renderAIGenTextModelSelectorMarkup({
        'modelId': _0x122371,
        'provider': _0x2e4166,
        'providerProfileId': this["_data"]["providerProfileId"],
        'getDisplayModelName': _0x38c0af
      }) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22prompt-actions\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22prompt-submit\x20debug-wrench-btn\x22\x20title=\x22' + t("aigenText.debugApiParams") + "\" data-aigen-text-title=\"debugApiParams\">\n              " + DEBUG_WRENCH_ICON_HTML + "\n            </button>\n            <button type=\"button\" class=\"prompt-submit img-gen-btn\" title=\"" + t('aigenText.generate') + '\x22\x20data-aigen-text-title=\x22generate\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<svg\x20width=\x2214\x22\x20height=\x2214\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22><line\x20x1=\x2212\x22\x20y1=\x2219\x22\x20x2=\x2212\x22\x20y2=\x225\x22/><polyline\x20points=\x225\x2012\x2012\x205\x2019\x2012\x22/></svg>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>';
      this['modelWrap'] = _0x40aece["querySelector"](".img-model-wrap");
      this["btnEl"] = _0x40aece["querySelector"](".img-gen-btn");
      this['_runtimeParameterController']?.["destroy"]?.();
      this["_runtimeParameterController"] = bindAIGenTextRuntimeParameterControls(_0x40aece, {
        'modelId': _0x122371,
        'nodeId': this["nodeId"],
        'store': _0x1e2cf8
      });
      const _0xd31c5d = _0x40aece["querySelector"](".debug-wrench-btn");
      this["_syncAigenTextLocale"] = () => {
        this["_placeholderEl"] && (this["_placeholderEl"]["textContent"] = t("aigenText.previewPlaceholder"));
        this["promptEl"] && (this["promptEl"]["dataset"]["placeholder"] = t("aigenText.promptPlaceholder"));
        _0x40aece["querySelector"]("[data-aigen-text-locale=\"customModelTitle\"]")?.["replaceChildren"](document["createTextNode"](t("aigenText.customModelTitle")));
        _0x40aece["querySelector"]("[data-aigen-text-locale=\"customModelSubtitle\"]")?.["replaceChildren"](document['createTextNode'](t("aigenText.customModelSubtitle")));
        _0xd31c5d?.['setAttribute']("title", t("aigenText.debugApiParams"));
        this["btnEl"]?.['setAttribute']("title", t("aigenText.generate"));
        this["_lastRefHTML"] = '';
        this['_renderRefBar']?.();
        this["_updateSubmitButtonState"]?.();
        this["_renderCustomTextModelSubmenu"]?.();
        syncTextResultSources(this);
      };
      this["_unbindLocaleChange"]?.();
      this["_unbindLocaleChange"] = onLocaleChange(() => this["_syncAigenTextLocale"]?.());
      this["_syncAigenTextLocale"]();
      const _0x53c814 = _0x40aece["querySelector"](".img-model-btn-trigger");
      const _0x432095 = _0x40aece["querySelector"](".img-model-menu");
      const _0x139be4 = _0x40aece["querySelector"](".img-model-label");
      const _0x3a4021 = _0x432095?.["querySelector"](".grsai-submenu");
      const _0x5badb7 = _0x432095?.['querySelector']('.ppio-submenu');
      const _0x314098 = _0x432095?.["querySelector"](".apimart-submenu");
      const _0x1fea2f = _0x432095?.["querySelector"](".agnes-submenu");
      const _0x257b12 = _0x432095?.["querySelector"](".runninghub-submenu");
      const _0x5c2044 = _0x432095?.["querySelector"](".volcengine-submenu");
      const _0x5b2a46 = Object['freeze']({
        'grsai': _0x3a4021,
        'ppio': _0x5badb7,
        'apimart': _0x314098,
        'agnes': _0x1fea2f,
        'runninghub': _0x257b12,
        'volcengine': _0x5c2044
      });
      const _0x40efe9 = _0x5cba5d => {
        const _0x397ee0 = _0x5cba5d?.["querySelector"]("img, svg, div");
        const _0x17bd04 = _0x53c814?.["firstElementChild"];
        if (!_0x17bd04 || !_0x397ee0 || _0x397ee0["classList"]["contains"]('fmi-content')) {
          return;
        }
        const _0xe20bfc = _0x397ee0['cloneNode'](!![]);
        _0xe20bfc['removeAttribute']?.('style');
        _0xe20bfc["classList"]?.["remove"]('text-model-icon', "node-menu-icon");
        _0xe20bfc["classList"]?.['add']('text-model-icon-small');
        _0xe20bfc["tagName"]?.['toLowerCase']() === 'svg' && (_0xe20bfc["setAttribute"]("width", '12'), _0xe20bfc["setAttribute"]("height", '12'), _0xe20bfc["classList"]["add"]("node-menu-icon-small"));
        _0x17bd04['replaceWith'](_0xe20bfc);
      };
      const _0x2d3fa5 = (_0x40df86, _0xcdeac5, _0xbd7803) => {
        const _0x334b4c = _0x40df86?.["dataset"]?.["value"];
        if (!_0x334b4c) {
          return;
        }
        const _0x423fb9 = _0x40df86["dataset"]["provider"] || _0xcdeac5;
        const _0xff3b67 = _0x1e2cf8["getState"]()["nodes"]?.[this["nodeId"]] || this['_data'] || {};
        const _0x5b0faa = buildModelProviderProfileSelectionPatch(_0xff3b67, _0x334b4c, _0x40df86?.["dataset"]?.["credentialResolvedProviderProfileId"]);
        const _0x53cf53 = _0x40df86["querySelector"]('.fmi-title') || _0x40df86["querySelector"](".floating-menu-label");
        _0x139be4["textContent"] = _0x53cf53 ? _0x53cf53['textContent'] : _0x334b4c;
        _0x432095['querySelectorAll']('.floating-menu-item')["forEach"](_0x4c5d04 => _0x4c5d04["classList"]["remove"]('active'));
        _0x40df86["classList"]["add"]("active");
        _0x432095["classList"]["remove"]("show");
        if (_0xbd7803) {
          _0xbd7803['style']["display"] = 'none';
        }
        const _0x1112f4 = buildModelGenerationParamsSelectionPatch(_0xff3b67, _0x334b4c);
        _0x1e2cf8["updateNodeData"](this["nodeId"], {
          'model': _0x334b4c,
          'provider': _0x423fb9,
          ..._0x5b0faa,
          ..._0x1112f4
        });
        this["_runtimeParameterController"]?.["setModel"]?.(_0x334b4c);
        _0x40efe9(_0x40df86);
      };
      _0x432095?.["addEventListener"]('click', _0x25ff76 => {
        const _0x5da5b5 = _0x25ff76["target"]?.["closest"]?.(".floating-menu-item");
        if (!_0x5da5b5 || !_0x432095["contains"](_0x5da5b5)) {
          return;
        }
        const _0x5a29c4 = Object["entries"](_0x5b2a46);
        const _0x10d1cc = _0x5a29c4["find"](([, _0x317adf]) => _0x317adf?.["contains"](_0x5da5b5)) || (_0x5da5b5["dataset"]["provider"] ? [String(_0x5da5b5["dataset"]['provider'] || ''), _0x5da5b5['closest'](".node-model-submenu")] : null);
        if (!_0x10d1cc) {
          return;
        }
        _0x25ff76["stopPropagation"]();
        _0x2d3fa5(_0x5da5b5, _0x10d1cc[0x0], _0x10d1cc[0x1]);
      });
      _0xd31c5d?.["addEventListener"]("click", _0x1f3ea5 => {
        _0x1f3ea5["stopPropagation"]();
        if (globalThis["window"]?.["DEV_MODE"] !== !![]) {
          return;
        }
        flushPromptHtmlCommit(this);
        openDebugRequestWindow({
          'prepare': async () => {
            const _0x5b0506 = typeof this["_buildPayload"] === "function" ? await this["_buildPayload"]() : {
              'prompt': this["promptEl"]?.["innerText"]?.["trim"]() || '',
              'nodeType': this["_data"]["type"]
            };
            if (!_0x5b0506) {
              throw new Error("请先填写提示词或连接参考素材。");
            }
            return buildFinalApiDebugPreview(await _0x3d2e6f['buildGenerateTextRequest'](_0x5b0506));
          }
        });
      });
      this["_footerControllerCleanup"]?.();
      this["_footerControllerCleanup"] = bindGenerationNodeCredentialLifecycle(this, bindNodeFooterController(_0x40aece));
      bindNodeModelMenuTrigger({
        'root': _0x40aece,
        'trigger': _0x53c814,
        'menu': _0x432095,
        'closeOthers': () => closeNodeFooterMenus(_0x40aece, _0x432095),
        'activateMenuKeyboard': _0x51c86b
      });
      const _0x1f5509 = {
        'listenConfigChanges': ![],
        'getProviderProfileId': () => {
          const _0x3dbe33 = _0x1e2cf8["getState"]?.()?.["nodes"]?.[this["nodeId"]] || this["_data"] || {};
          return _0x3dbe33["providerProfileId"] || _0x3dbe33['rhProviderProfileId'] || '';
        }
      };
      this["_modelCredentialMenuCleanup"]?.();
      this["_modelCredentialMenuCleanup"] = bindModelCredentialMenu(_0x432095, _0x1f5509);
      _0x53c814?.["addEventListener"]("click", () => {
        void syncModelCredentialMenu(_0x432095, _0x1f5509);
      });
      const _0x51c272 = _0x432095["querySelector"]('[data-custom-toggle]');
      const _0x5a194a = _0x432095['querySelector'](".custom-submenu");
      let _0x42a07e = null;
      const _0x3d7b46 = () => {
        clearTimeout(_0x42a07e);
        if (_0x5a194a) {
          _0x5a194a["style"]["display"] = 'flex';
        }
      };
      const _0x24300a = (_0x233fa2 = 0x78) => {
        _0x42a07e = setTimeout(() => {
          if (_0x5a194a && _0x5a194a["querySelector"]("input:focus")) {
            return;
          }
          if (_0x5a194a) {
            _0x5a194a['style']["display"] = 'none';
          }
        }, _0x233fa2);
      };
      _0x51c272 && (_0x51c272["addEventListener"]("mouseenter", _0x3d7b46), _0x51c272['addEventListener']("mouseleave", () => _0x24300a()));
      _0x5a194a && (_0x5a194a["addEventListener"]('mouseenter', _0x3d7b46), _0x5a194a['addEventListener']("mouseleave", () => _0x24300a()), _0x5a194a['addEventListener']('click', _0x2202b6 => _0x2202b6["stopPropagation"]()), _0x5a194a["addEventListener"]('pointerdown', _0x37e6c0 => _0x37e6c0["stopPropagation"]()));
      const _0x3bcf4a = () => {
        if (!_0x5a194a) {
          return;
        }
        const _0x507d19 = _0x525c5d();
        const _0x2beea5 = this["_data"]["model"] || '';
        _0x5a194a['innerHTML'] = '';
        _0x507d19['forEach']((_0x2a0381, _0x50493a) => {
          const _0x5bc545 = document["createElement"]("div");
          _0x5bc545["className"] = "floating-menu-item custom-model-item" + (_0x2beea5 === _0x2a0381 ? '\x20active' : '');
          _0x5bc545["dataset"]['value'] = _0x2a0381;
          _0x5bc545["innerHTML"] = "\n                    <div class=\"text-model-icon text-model-icon-badge custom-model-icon\">OA</div>\n                    <span class=\"custom-model-label\">" + _0x2a0381 + "</span>\n                    <span class=\"custom-model-del\">×</span>\n                ";
          const _0x1606d9 = _0x5bc545['querySelector'](".custom-model-del");
          _0x5bc545["addEventListener"]("mouseenter", () => {
            if (_0x1606d9) {
              _0x1606d9["classList"]['add']('show');
            }
          });
          _0x5bc545['addEventListener']("mouseleave", () => {
            if (_0x1606d9) {
              _0x1606d9["classList"]["remove"]('show');
            }
          });
          _0x5bc545["addEventListener"]('click', _0x590b87 => {
            if (_0x590b87['target']['closest']('.custom-model-del')) {
              return;
            }
            _0x139be4["textContent"] = _0x2a0381;
            _0x432095["querySelectorAll"]('.floating-menu-item')["forEach"](_0x57a539 => _0x57a539["classList"]["remove"]("active"));
            _0x3a4021?.["querySelectorAll"](".floating-menu-item")['forEach'](_0x47e565 => _0x47e565["classList"]["remove"]("active"));
            _0x5badb7?.['querySelectorAll']('.floating-menu-item')["forEach"](_0x57e1fb => _0x57e1fb["classList"]["remove"]("active"));
            _0x5a194a["querySelectorAll"](".floating-menu-item")["forEach"](_0xe90af9 => _0xe90af9['classList']["remove"]("active"));
            _0x5bc545['classList']["add"]("active");
            _0x432095["classList"]["remove"]("show");
            _0x5a194a["style"]["display"] = "none";
            const _0x2d0ad7 = _0x1e2cf8["getState"]()['nodes']?.[this["nodeId"]] || this['_data'] || {};
            _0x1e2cf8["updateNodeData"](this['nodeId'], {
              'model': _0x2a0381,
              'provider': "custom",
              ...buildModelGenerationParamsSelectionPatch(_0x2d0ad7, _0x2a0381)
            });
            this['_runtimeParameterController']?.['setModel']?.(_0x2a0381);
            const _0x17275c = _0x53c814['firstElementChild'];
            if (_0x17275c) {
              const _0x339737 = document['createElementNS']("http://www.w3.org/2000/svg", "svg");
              _0x339737["setAttribute"]("width", '12');
              _0x339737['setAttribute']("height", '12');
              _0x339737['setAttribute']("viewBox", "0 0 24 24");
              _0x339737["setAttribute"]('fill', "none");
              _0x339737['setAttribute']("stroke", "currentColor");
              _0x339737['setAttribute']("stroke-width", '2');
              _0x339737["innerHTML"] = "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" ry=\"2\"/><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\"/><line x1=\"9\" y1=\"1\" x2=\"9\" y2=\"4\"/><line x1=\"15\" y1=\"1\" x2=\"15\" y2=\"4\"/><line x1=\"9\" y1=\"20\" x2=\"9\" y2=\"23\"/><line x1=\"15\" y1=\"20\" x2=\"15\" y2=\"23\"/><line x1=\"20\" y1=\"9\" x2=\"23\" y2=\"9\"/><line x1=\"20\" y1=\"14\" x2=\"23\" y2=\"14\"/><line x1=\"1\" y1=\"9\" x2=\"4\" y2=\"9\"/><line x1=\"1\" y1=\"14\" x2=\"4\" y2=\"14\"/>";
              _0x17275c['replaceWith'](_0x339737);
            }
          });
          _0x1606d9?.['addEventListener']("click", _0x59659d => {
            _0x59659d["stopPropagation"]();
            const _0x5ce566 = _0x525c5d()["filter"]((_0x3a5421, _0x3671e8) => _0x3671e8 !== _0x50493a);
            _0x76d039(_0x5ce566);
            _0x3bcf4a();
          });
          _0x5a194a["appendChild"](_0x5bc545);
        });
        if (_0x507d19["length"] > 0x0) {
          const _0x2e5c8b = document["createElement"]("div");
          _0x2e5c8b["className"] = 'custom-model-separator';
          _0x5a194a['appendChild'](_0x2e5c8b);
        }
        const _0x2a0a23 = document['createElement']("div");
        _0x2a0a23["className"] = "floating-menu-item custom-model-add";
        _0x2a0a23["innerHTML"] = "\n                <svg class=\"custom-model-add-icon\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"/><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"/></svg>\n                <span class=\"custom-model-add-label\">" + t('aigenText.customModel.addModel') + "</span>\n            ";
        _0x2a0a23["addEventListener"]("click", _0x4e8272 => {
          _0x4e8272["stopPropagation"]();
          _0x2a0a23["innerHTML"] = '';
          _0x2a0a23["classList"]["add"]("editing");
          const _0xb3b6d8 = document['createElement']("input");
          _0xb3b6d8["type"] = 'text';
          _0xb3b6d8["placeholder"] = t("aigenText.customModel.namePlaceholder");
          _0xb3b6d8["className"] = 'custom-model-input';
          const _0x2178d9 = document['createElement']("button");
          _0x2178d9['type'] = "button";
          _0x2178d9["textContent"] = t("aigenText.customModel.confirm");
          _0x2178d9['className'] = 'custom-model-confirm';
          const _0x16b546 = () => {
            const _0x249153 = _0xb3b6d8['value']["trim"]();
            if (!_0x249153) {
              return;
            }
            const _0x58be6e = _0x525c5d();
            !_0x58be6e['includes'](_0x249153) && (_0x58be6e["push"](_0x249153), _0x76d039(_0x58be6e));
            _0x3bcf4a();
          };
          _0xb3b6d8["addEventListener"]('keydown', _0x5a8482 => {
            _0x5a8482["stopPropagation"]();
            if (_0x5a8482["key"] === 'Enter') {
              _0x16b546();
            }
          });
          _0xb3b6d8['addEventListener']("keyup", _0x163c79 => _0x163c79["stopPropagation"]());
          _0xb3b6d8["addEventListener"]("keypress", _0x2876ca => _0x2876ca["stopPropagation"]());
          _0xb3b6d8["addEventListener"]("click", _0x37b230 => _0x37b230["stopPropagation"]());
          _0x2178d9["addEventListener"]("click", _0x2384a1 => {
            _0x2384a1["stopPropagation"]();
            _0x16b546();
          });
          _0x2a0a23["appendChild"](_0xb3b6d8);
          _0x2a0a23["appendChild"](_0x2178d9);
          _0xb3b6d8["focus"]();
        });
        _0x5a194a['appendChild'](_0x2a0a23);
      };
      this["_renderCustomTextModelSubmenu"] = _0x3bcf4a;
      _0x3bcf4a();
      this["btnEl"]["addEventListener"]("click", () => {
        flushPromptHtmlCommit(this);
        this["_onGenerate"]();
      });
      _0x4fea30["appendChild"](_0x40aece);
      _0x4e4043["appendChild"](_0x4fea30);
      attachNodePromptExpansion(this, {
        'panel': _0x4fea30
      });
      this["_renderRefBar"]();
      const _0x49bd87 = _0x4e4043["querySelector"](".node-floating-toolbar");
      _0xd9468(_0x49bd87, this["_data"], () => this["_getOutputRawText"]?.() || '');
      const _0x51d6f7 = createNodeResizeHandle(this, {
        'store': _0x1e2cf8,
        'getStateSnapshot': _0x2a0e0d,
        'commit': _0x51e5c9
      });
      _0x4e4043["appendChild"](_0x51d6f7);
      this["_updateSubmitButtonState"]();
      return _0x4e4043;
    }
    ["_enterOutputEditMode"]() {
      this["outputEl"] && this["outputEl"]["setAttribute"]("contenteditable", "false");
      this['_commitOutputScrollTop']();
      const _0x206d06 = _0x1e2cf8['getState']()["selectedNodeIds"];
      if (!_0x206d06["includes"](this['nodeId'])) {
        _0x1e2cf8["setSelectedNodes"]([this["nodeId"]]);
      }
    }
    ["_captureOutputScrollTop"]() {
      this['_outputScrollTop'] = Math['max'](0x0, Number(this["outputEl"]?.["scrollTop"] || 0x0));
      return this['_outputScrollTop'];
    }
    ["_markOutputScrollTopDirty"]() {
      this["_captureOutputScrollTop"]();
      this["_outputScrollTopDirty"] = !![];
      this["_scheduleOutputScrollTopCommit"]();
    }
    ["_scheduleOutputScrollTopCommit"]() {
      this["_outputScrollTopCommitTimer"] && clearTimeout(this["_outputScrollTopCommitTimer"]);
      this["_outputScrollTopCommitTimer"] = setTimeout(() => {
        this["_outputScrollTopCommitTimer"] = null;
        this["_commitOutputScrollTop"]();
      }, _0xe70354);
    }
    ["_commitOutputScrollTop"]() {
      if (!this["outputEl"] || !this["nodeId"]) {
        return 0x0;
      }
      this['_outputScrollTopCommitTimer'] && (clearTimeout(this['_outputScrollTopCommitTimer']), this["_outputScrollTopCommitTimer"] = null);
      const _0x38b5d7 = this["_captureOutputScrollTop"]();
      this["_outputScrollTopDirty"] = ![];
      const _0x4010e7 = typeof _0x1e2cf8['getStateRaw'] === "function" ? _0x1e2cf8["getStateRaw"]()?.["nodes"]?.[this["nodeId"]] : _0x1e2cf8["getState"]?.()?.['nodes']?.[this["nodeId"]];
      if (Number(_0x4010e7?.["outputScrollTop"]) === _0x38b5d7) {
        return _0x38b5d7;
      }
      typeof _0x1e2cf8['updateNodeData'] === "function" && _0x1e2cf8['updateNodeData'](this["nodeId"], {
        'outputScrollTop': _0x38b5d7
      });
      return _0x38b5d7;
    }
    ["_getOutputRawText"](_0x525b38 = this["_data"]) {
      const _0x3b1044 = typeof this['nodeId'] === "string" ? this['nodeId'] : '';
      const _0x4b24a0 = _0x3b1044 && typeof _0x1e2cf8["getStateRaw"] === 'function' ? _0x1e2cf8["getStateRaw"]()?.["nodes"]?.[_0x3b1044] : null;
      return String(_0x4b24a0?.["outputText"] ?? _0x525b38?.['outputText'] ?? '');
    }
    ['_renderOutputText'](_0x3dee85 = this['_getOutputRawText']()) {
      if (!this["outputEl"]) {
        return;
      }
      const _0x290ef6 = String(_0x3dee85 ?? '');
      this["_lastRenderedOutputText"] = _0x290ef6;
      this["_lastRenderedOutputImagesSignature"] = JSON["stringify"](this['_data']["outputImages"] || []);
      if (!_0x290ef6) {
        this['outputEl']["replaceChildren"]();
        this["outputEl"]['style']['display'] = 'none';
        if (this['_placeholderEl']) {
          this['_placeholderEl']["style"]['display'] = "flex";
        }
        return;
      }
      this["outputEl"]["innerHTML"] = renderMarkdownToHtml(textResultImagePresentationText(_0x290ef6, this["_data"]["outputImages"]));
      syncTextResultSources(this);
      this["outputEl"]["style"]["display"] = "block";
      if (this["_placeholderEl"]) {
        this['_placeholderEl']['style']["display"] = "none";
      }
    }
    ['_handlePreviewDblclick'](_0x57cd64) {
      if (!isPreviewModeEnabled()) {
        return;
      }
      _0x57cd64?.['stopPropagation']?.();
    }
    ['_syncPromptBoxSizeFromData'](_0x160e69 = this["_data"]) {
      syncPromptBoxSizeFromData(this, _0x160e69);
    }
    ['_setupPromptBoxResize']() {
      setupPromptBoxResize(this, {
        'store': _0x1e2cf8,
        'getStateSnapshot': _0x2a0e0d
      });
    }
  }
  return _0x3aeb6f['prototype'];
}