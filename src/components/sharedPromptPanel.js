import { openDebugRequestWindow } from '../modules/debugRequestWindow.js';
import { buildGenerateTextRequest } from '../../api/aiTextApi.js';
import a506_0x52685f from '../core/stores/appStore.js';
import { getDisplayModelName } from '../modules/providers.js';
import { bindRefThumbHoverPreview } from '../modules/refThumbHoverPreview.js';
import { checkSlashTrigger, handleSlashKeyboardNavigation } from '../modules/slashMenu.js';
import { activateMenuKeyboard } from '../modules/floatingMenuKeyboard.js';
import { _checkAtTrigger, _handleMentionMenuKeyboard, _handlePillHover, _handlePillKeyboard, _handlePillOut, _rehydratePromptPills, _syncEdgesOrderFromPills, flushPromptHtmlCommit, handlePromptPaste, handlePromptSelectAll, handleRefThumbDeleteClick, schedulePromptHtmlCommit, shouldSubmitPromptByKeyboard } from '../modules/nodePromptShared.js';
import { sanitizePromptHtml } from '../utils/dom.js';
import { DEBUG_WRENCH_ICON_HTML, buildFinalApiDebugPreview } from '../utils/debugRequestPreview.js';
import { getNodeDefaultSize } from '../services/fileService.js';
import { buildTextModelSmallIconHTML, buildTextProviderMenuGroupsHTML } from './aigenText/apimartTextModelMenu.js';
import { getCustomTextModels, saveCustomTextModels } from './aigenText/customTextModels.js';
import { setupPromptBoxResize, syncPromptBoxSizeFromData } from './aigenText/promptBoxResizeUi.js';
import { createPromptAttachmentButtonHTML } from './refAttachmentButton.js';
import { createPromptPresetTriggerController } from './promptPresetTrigger.js';
import { bindNodeFooterController, bindNodeModelMenuTrigger, closeNodeFooterMenus } from './shared/nodeFooterControls.js';
import { t } from '../i18n/index.js';
function sharedPromptPanelText(_0x5057d0, _0x18a72d = {}) {
  return t('sharedPromptPanel.' + _0x5057d0, _0x18a72d);
}
function escapeSharedPromptPanelHtml(_0x4594c3) {
  return String(_0x4594c3 ?? '')["replace"](/&/g, '&amp;')["replace"](/</g, "&lt;")["replace"](/>/g, "&gt;")["replace"](/"/g, "&quot;");
}
export function buildSharedPromptPanel(_0x5ce019, _0x5272a1 = {}) {
  const _0x397efc = document["createElement"]("div");
  _0x397efc["className"] = "text-prompt-panel";
  _0x5ce019["_promptPanel"] = _0x397efc;
  const _0x4af114 = () => typeof a506_0x52685f["getStateRaw"] === 'function' ? a506_0x52685f["getStateRaw"]() : a506_0x52685f["getState"]();
  _0x397efc['addEventListener']("pointerdown", _0x1c2fcb => {
    _0x1c2fcb['stopPropagation']();
  });
  _0x397efc['addEventListener']("dblclick", _0x388dfd => {
    !_0x388dfd['target']["closest"]('.prompt-textarea') && (_0x388dfd['preventDefault'](), _0x388dfd['stopPropagation']());
  });
  _0x5ce019['refBarEl'] = document["createElement"]("div");
  _0x5ce019["refBarEl"]["className"] = "node-ref-bar";
  _0x397efc["appendChild"](_0x5ce019['refBarEl']);
  _0x5ce019["refBarEl"]["addEventListener"]("click", _0x5f1789 => {
    if (handleRefThumbDeleteClick(_0x5ce019, _0x5f1789)) {
      return;
    }
    const _0x102412 = _0x5f1789["target"]["closest"](".prompt-attachment-btn");
    if (!_0x102412) {
      return;
    }
    if (_0x5f1789["_pickConnectHandled"]) {
      return;
    }
    _0x5f1789["stopPropagation"]();
    _0x5f1789["preventDefault"]();
    const _0x1c71bd = a506_0x52685f["getState"]()["pickConnectMode"];
    _0x1c71bd && _0x1c71bd["active"] && _0x1c71bd['sourceNodeId'] === _0x5ce019["nodeId"] ? a506_0x52685f["setPickConnectMode"]({
      'active': ![]
    }) : a506_0x52685f["setPickConnectMode"]({
      'active': !![],
      'sourceNodeId': _0x5ce019["nodeId"],
      'handleDirection': "left"
    });
  });
  _0x5ce019["refBarEl"]['addEventListener']("pointerdown", _0x5ddd9b => {
    if (_0x5ddd9b['target']["closest"](".prompt-attachment-btn, .ref-thumb-delete")) {
      _0x5ddd9b['stopPropagation']();
    }
  });
  _0x5ce019['_unbindRefThumbHoverPreview']?.();
  _0x5ce019['_unbindRefThumbHoverPreview'] = bindRefThumbHoverPreview(_0x5ce019["refBarEl"]);
  const _0x44d9fa = document['createElement']("div");
  _0x44d9fa["className"] = "prompt-input-wrapper";
  _0x44d9fa['classList']["add"]("is-resizable");
  _0x5ce019['_promptInputWrap'] = _0x44d9fa;
  _0x5ce019["promptEl"] = document["createElement"]('div');
  _0x5ce019["promptEl"]["className"] = "prompt-textarea custom-textarea";
  _0x5ce019["promptEl"]["dataset"]['nodeId'] = _0x5ce019["nodeId"];
  _0x5ce019["promptEl"]["contentEditable"] = 'true';
  _0x5ce019["promptEl"]['spellcheck'] = ![];
  _0x5ce019["promptEl"]['dataset']["placeholder"] = _0x5272a1["placeholder"] || sharedPromptPanelText("promptPlaceholder");
  _0x5ce019['_flushPromptHtmlCommit'] = () => flushPromptHtmlCommit(_0x5ce019);
  _0x5ce019['promptEl']["addEventListener"]("input", _0x4d1d19 => {
    schedulePromptHtmlCommit(_0x5ce019);
    _checkAtTrigger(_0x5ce019, _0x4d1d19);
    checkSlashTrigger(_0x4d1d19, {
      'promptEl': _0x5ce019['promptEl'],
      'nodeType': _0x5ce019['_data']?.["type"],
      'nodeId': _0x5ce019["nodeId"],
      'onGenerate': (_0x5e53c6, _0x2fe14f) => _0x5ce019["_onGenerate"]?.(_0x5e53c6, _0x2fe14f)
    });
    _syncEdgesOrderFromPills(_0x5ce019);
    _0x5ce019['_updateSubmitButtonState']?.();
  });
  _0x5ce019['promptEl']["addEventListener"]("blur", () => {
    flushPromptHtmlCommit(_0x5ce019);
  });
  _0x5ce019["promptEl"]["addEventListener"]('mouseover', _0x15212f => _handlePillHover(_0x15212f, _0x5ce019));
  _0x5ce019['promptEl']["addEventListener"]("mouseout", _0x4ccdc9 => _handlePillOut(_0x4ccdc9, _0x5ce019));
  _0x5ce019["promptEl"]["addEventListener"]("keydown", _0x36c5f8 => {
    if (handlePromptSelectAll(_0x5ce019, _0x36c5f8)) {
      return;
    }
    if (_handleMentionMenuKeyboard(_0x36c5f8)) {
      return;
    }
    if (handleSlashKeyboardNavigation(_0x36c5f8)) {
      return;
    }
    if (shouldSubmitPromptByKeyboard(_0x36c5f8)) {
      _0x36c5f8["preventDefault"]();
      flushPromptHtmlCommit(_0x5ce019);
      _0x5ce019['btnEl']?.["click"]();
      return;
    }
    _handlePillKeyboard(_0x5ce019, _0x36c5f8);
  });
  _0x5ce019['promptEl']["addEventListener"]("paste", _0x2edec3 => {
    handlePromptPaste(_0x5ce019, _0x2edec3);
  });
  _0x5ce019["_data"]["prompt"] && (_0x5ce019['promptEl']["innerHTML"] = sanitizePromptHtml(_0x5ce019["_data"]['prompt']), _rehydratePromptPills(_0x5ce019));
  _0x44d9fa['appendChild'](_0x5ce019["promptEl"]);
  _0x5ce019["_syncPromptBoxSizeFromData"] = (_0x30f512 = _0x5ce019["_data"]) => syncPromptBoxSizeFromData(_0x5ce019, _0x30f512);
  _0x5ce019["_syncPromptBoxSizeFromData"](_0x5ce019["_data"]);
  setupPromptBoxResize(_0x5ce019, {
    'store': a506_0x52685f,
    'getStateSnapshot': _0x4af114
  });
  _0x397efc['appendChild'](_0x44d9fa);
  const _0x5325bd = document["createElement"]("div");
  _0x5325bd["className"] = 'prompt-panel-footer\x20text-prompt-actions';
  const _0x50f141 = [];
  _0x5ce019["_promptPresetTrigger"]?.["remove"]?.();
  _0x5ce019["_promptPresetTrigger"] = createPromptPresetTriggerController({
    'panel': _0x397efc,
    'getPromptEl': () => _0x5ce019['promptEl'],
    'getNodeType': () => _0x5ce019["_data"]?.["type"],
    'getNodeId': () => _0x5ce019["nodeId"],
    'onGenerate': (_0x4f5fca, _0x22a718) => _0x5ce019["_onGenerate"]?.(_0x4f5fca, _0x22a718)
  });
  _0x50f141["push"](() => {
    _0x5ce019["_promptPresetTrigger"]?.["remove"]();
    _0x5ce019["_promptPresetTrigger"] = null;
  });
  if (_0x5272a1?.["modelMenu"]) {
    const _0x1ceb79 = _0x5272a1["modelMenu"];
    const _0x8c80a6 = String(_0x1ceb79["provider"] || "volcengine")["trim"]();
    const _0x431821 = Array["isArray"](_0x1ceb79["providers"]) ? _0x1ceb79["providers"]["map"](_0x12c002 => String(_0x12c002)["toLowerCase"]()) : null;
    const _0x1ead51 = _0x1ceb79['allowCustomModels'] !== ![];
    const _0x2ee50f = String(_0x1ceb79['model'] || _0x5ce019["_data"]?.['model'] || _0x5ce019["_data"]?.["storyboardScript"]?.["model"] || _0x1ceb79["defaultModel"] || '')['trim']();
    const _0x37bf2b = () => {
      const _0x4223e0 = buildTextModelSmallIconHTML(_0x2ee50f);
      if (_0x4223e0) {
        return _0x4223e0;
      }
      if (_0x8c80a6 === "custom" || _0x8c80a6 === "openai") {
        return '<div\x20class=\x22text-model-icon-small\x20text-model-icon-badge\x22>OA</div>';
      }
      return "<div class=\"text-model-icon-small text-model-icon-badge\">AI</div>";
    };
    const _0x19b222 = document["createElement"]("div");
    _0x19b222["className"] = "img-model-pills";
    _0x19b222["innerHTML"] = "\n      <div class=\"img-model-wrap\">\n        <button type=\"button\" class=\"img-pill-btn img-model-btn-trigger\">\n          " + _0x37bf2b() + "\n          <span class=\"img-model-label\">" + getDisplayModelName(_0x2ee50f) + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<svg\x20width=\x2210\x22\x20height=\x2210\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20class=\x22node-menu-caret\x22><polyline\x20points=\x226\x209\x2012\x2015\x2018\x209\x22></polyline></svg>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22floating-menu\x20img-model-menu\x20node-model-menu\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x1ead51 ? "<div class=\"custom-group-header floating-menu-item node-menu-group-header\" data-custom-toggle data-node-menu-submenu=\".custom-submenu\">\n            <div class=\"text-model-icon text-model-icon-badge\">OA</div>\n            <div class=\"fmi-content\">\n              <div class=\"fmi-title\">" + escapeSharedPromptPanelHtml(sharedPromptPanelText("customModelTitle")) + "</div>\n              <div class=\"fmi-sub\">" + escapeSharedPromptPanelHtml(sharedPromptPanelText("customModelSubtitle")) + "</div>\n            </div>\n            <svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" class=\"node-menu-caret\"><polyline points=\"9 18 15 12 9 6\"></polyline></svg>\n          </div>\n          <div class=\"custom-submenu node-model-submenu node-menu-submenu\"></div>" : '') + "\n          " + buildTextProviderMenuGroupsHTML(_0x2ee50f, {
      'providers': _0x431821,
      'allowedModelIds': _0x1ceb79['allowedModelIds']
    }) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20</div>';
    _0x5325bd['appendChild'](_0x19b222);
    const _0x141087 = _0x19b222['querySelector'](".img-model-wrap");
    const _0xd14291 = _0x19b222["querySelector"](".img-model-btn-trigger");
    const _0x5c3881 = _0x19b222["querySelector"](".img-model-menu");
    const _0x44596c = _0x19b222["querySelector"](".img-model-label");
    const _0xc27c95 = Object["freeze"]({
      'grsai': _0x5c3881?.["querySelector"](".grsai-submenu"),
      'ppio': _0x5c3881?.["querySelector"](".ppio-submenu"),
      'apimart': _0x5c3881?.["querySelector"](".apimart-submenu"),
      'agnes': _0x5c3881?.['querySelector'](".agnes-submenu"),
      'runninghub': _0x5c3881?.['querySelector'](".runninghub-submenu"),
      'volcengine': _0x5c3881?.["querySelector"](".volcengine-submenu")
    });
    const _0x3846a1 = _0x9437f4 => {
      const _0x18f0da = _0x9437f4?.["querySelector"]("img, svg, div");
      const _0x457b04 = _0xd14291?.["firstElementChild"];
      if (!_0x457b04 || !_0x18f0da || _0x18f0da["classList"]?.["contains"]('fmi-content')) {
        return;
      }
      const _0x507916 = _0x18f0da["cloneNode"](!![]);
      _0x507916['removeAttribute']?.("style");
      _0x507916["classList"]?.["remove"]("text-model-icon", 'node-menu-icon');
      _0x507916["classList"]?.["add"]("text-model-icon-small");
      _0x507916["tagName"]?.['toLowerCase']() === "svg" && (_0x507916['setAttribute']('width', '12'), _0x507916["setAttribute"]("height", '12'), _0x507916["classList"]['add']("node-menu-icon-small"));
      _0x457b04["replaceWith"](_0x507916);
    };
    const _0x478d6e = (_0x5713e2, _0xb00e9c, _0x2f38a5) => {
      const _0x4f5b10 = String(_0x5713e2?.["dataset"]?.["value"] || '')['trim']();
      if (!_0x4f5b10) {
        return;
      }
      const _0x5b84d9 = String(_0x5713e2["dataset"]['provider'] || _0xb00e9c || _0x8c80a6)['trim']();
      const _0x4f8c06 = _0x5713e2["querySelector"](".fmi-title") || _0x5713e2["querySelector"](".floating-menu-label") || _0x5713e2["querySelector"]('.custom-model-label');
      if (_0x44596c) {
        _0x44596c['textContent'] = _0x4f8c06?.["textContent"] || _0x4f5b10;
      }
      _0x5c3881?.['querySelectorAll'](".floating-menu-item")["forEach"](_0x353bf3 => _0x353bf3['classList']["remove"]('active'));
      _0x5713e2["classList"]["add"]("active");
      _0x5c3881?.["classList"]["remove"]("show");
      if (_0x2f38a5) {
        _0x2f38a5['style']["display"] = "none";
      }
      _0x3846a1(_0x5713e2);
      typeof _0x1ceb79['onSelect'] === 'function' ? _0x1ceb79['onSelect']({
        'modelId': _0x4f5b10,
        'provider': _0x5b84d9,
        'item': _0x5713e2,
        'self': _0x5ce019
      }) : a506_0x52685f["updateNodeData"](_0x5ce019["nodeId"], {
        'model': _0x4f5b10,
        'provider': _0x5b84d9
      });
    };
    _0x5c3881?.["addEventListener"]("click", _0x30aa1f => {
      const _0x3cc339 = _0x30aa1f["target"]?.["closest"]?.(".floating-menu-item");
      if (!_0x3cc339 || !_0x5c3881['contains'](_0x3cc339)) {
        return;
      }
      if (!_0x3cc339['dataset']["value"]) {
        return;
      }
      const _0x4f89a1 = Object['entries'](_0xc27c95)["find"](([, _0x1d75ec]) => _0x1d75ec?.["contains"](_0x3cc339));
      if (_0x4f89a1) {
        _0x30aa1f["stopPropagation"]();
        _0x478d6e(_0x3cc339, _0x4f89a1[0x0], _0x4f89a1[0x1]);
        return;
      }
      if (!_0x1ead51) {
        return;
      }
      const _0x443a5e = _0x5c3881["querySelector"](".custom-submenu");
      _0x443a5e?.['contains'](_0x3cc339) && (_0x30aa1f["stopPropagation"](), _0x478d6e(_0x3cc339, "custom", _0x443a5e));
    });
    const _0x34d93d = _0x5c3881?.["querySelector"](".custom-submenu");
    _0x1ead51 && _0x34d93d?.["addEventListener"]("pointerdown", _0x529870 => {
      _0x529870['stopPropagation']();
    });
    const _0x2cc822 = () => {
      if (!_0x1ead51 || !_0x34d93d) {
        return;
      }
      const _0x5b5d2b = getCustomTextModels();
      const _0x3f44d8 = _0x5ce019["_data"]?.["model"] || '';
      _0x34d93d['replaceChildren']();
      _0x5b5d2b["forEach"]((_0x2fb7d8, _0x4a14da) => {
        const _0x3adfd4 = document["createElement"]('div');
        _0x3adfd4["className"] = 'floating-menu-item\x20custom-model-item' + (_0x3f44d8 === _0x2fb7d8 ? '\x20active' : '');
        _0x3adfd4["dataset"]['value'] = _0x2fb7d8;
        const _0x38b349 = document["createElement"]("div");
        _0x38b349['className'] = "text-model-icon text-model-icon-badge custom-model-icon";
        _0x38b349["textContent"] = 'OA';
        const _0x2f72e6 = document['createElement']("span");
        _0x2f72e6["className"] = 'custom-model-label';
        _0x2f72e6['textContent'] = _0x2fb7d8;
        const _0x3069f0 = document["createElement"]("span");
        _0x3069f0['className'] = "custom-model-del";
        _0x3069f0["textContent"] = '×';
        _0x3adfd4["appendChild"](_0x38b349);
        _0x3adfd4["appendChild"](_0x2f72e6);
        _0x3adfd4["appendChild"](_0x3069f0);
        _0x3adfd4["addEventListener"]("mouseenter", () => {
          _0x3069f0['classList']["add"]("show");
        });
        _0x3adfd4["addEventListener"]("mouseleave", () => {
          _0x3069f0["classList"]['remove']('show');
        });
        _0x3069f0["addEventListener"]("click", _0x4a5a78 => {
          _0x4a5a78["stopPropagation"]();
          saveCustomTextModels(getCustomTextModels()["filter"]((_0x54981f, _0x43b2a6) => _0x43b2a6 !== _0x4a14da));
          _0x2cc822();
        });
        _0x34d93d["appendChild"](_0x3adfd4);
      });
      if (_0x5b5d2b["length"] > 0x0) {
        const _0x1e79b5 = document["createElement"]("div");
        _0x1e79b5["className"] = 'custom-model-separator';
        _0x34d93d['appendChild'](_0x1e79b5);
      }
      const _0x4e00df = document['createElement']('div');
      _0x4e00df["className"] = "floating-menu-item custom-model-add";
      _0x4e00df["innerHTML"] = "\n        <svg class=\"custom-model-add-icon\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"/><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"/></svg>\n        <span class=\"custom-model-add-label\">" + escapeSharedPromptPanelHtml(sharedPromptPanelText("addModel")) + "</span>";
      _0x4e00df["addEventListener"]("click", _0x27d5fd => {
        _0x27d5fd['stopPropagation']();
        _0x4e00df["replaceChildren"]();
        _0x4e00df["classList"]["add"]("editing");
        const _0x14da33 = document["createElement"]("input");
        _0x14da33["type"] = "text";
        _0x14da33["placeholder"] = sharedPromptPanelText("modelNamePlaceholder");
        _0x14da33["className"] = "custom-model-input";
        const _0xf724f5 = document["createElement"]("button");
        _0xf724f5['type'] = "button";
        _0xf724f5["textContent"] = sharedPromptPanelText("confirm");
        _0xf724f5["className"] = "custom-model-confirm";
        const _0x51289b = () => {
          const _0x8a9723 = _0x14da33["value"]["trim"]();
          if (!_0x8a9723) {
            return;
          }
          const _0x29c3ea = getCustomTextModels();
          !_0x29c3ea['includes'](_0x8a9723) && (_0x29c3ea["push"](_0x8a9723), saveCustomTextModels(_0x29c3ea));
          _0x2cc822();
        };
        _0x14da33["addEventListener"]("keydown", _0x12c799 => {
          _0x12c799["stopPropagation"]();
          if (_0x12c799["key"] === "Enter") {
            _0x51289b();
          }
        });
        _0x14da33['addEventListener']("keyup", _0x49ffce => _0x49ffce["stopPropagation"]());
        _0x14da33["addEventListener"]('keypress', _0x494ac => _0x494ac["stopPropagation"]());
        _0x14da33['addEventListener']("click", _0x394972 => _0x394972['stopPropagation']());
        _0xf724f5["addEventListener"]("click", _0x3e9604 => {
          _0x3e9604["stopPropagation"]();
          _0x51289b();
        });
        _0x4e00df["appendChild"](_0x14da33);
        _0x4e00df['appendChild'](_0xf724f5);
        _0x14da33["focus"]();
      });
      _0x34d93d["appendChild"](_0x4e00df);
    };
    if (_0x1ead51) {
      _0x2cc822();
    }
    const _0x2e38df = bindNodeModelMenuTrigger({
      'root': _0x5325bd,
      'trigger': _0xd14291,
      'menu': _0x5c3881,
      'closeOthers': () => closeNodeFooterMenus(_0x5325bd, _0x5c3881),
      'activateMenuKeyboard': activateMenuKeyboard
    });
    const _0x13d415 = bindNodeFooterController(_0x5325bd);
    _0x50f141["push"](_0x2e38df, _0x13d415);
    _0x5ce019["modelWrap"] = _0x141087;
  }
  const _0x5ed4c7 = document["createElement"]("div");
  _0x5ed4c7['className'] = "prompt-actions";
  const _0x49f592 = document["createElement"]("button");
  _0x49f592["type"] = "button";
  _0x49f592["className"] = "prompt-submit debug-wrench-btn";
  _0x49f592["title"] = sharedPromptPanelText("debugApiParams");
  _0x49f592["innerHTML"] = DEBUG_WRENCH_ICON_HTML;
  _0x49f592["addEventListener"]("click", _0x58cdca => {
    _0x58cdca['stopPropagation']();
    if (globalThis["window"]?.["DEV_MODE"] !== !![]) {
      return;
    }
    flushPromptHtmlCommit(_0x5ce019);
    openDebugRequestWindow({
      'prepare': async () => {
        const _0x26f91d = typeof _0x5ce019['_buildPayload'] === "function" ? await _0x5ce019["_buildPayload"]() : {
          'prompt': _0x5ce019["promptEl"]?.["innerText"]?.['trim']() || '',
          'nodeType': _0x5ce019["_data"]["type"]
        };
        if (!_0x26f91d) {
          throw new Error("请先填写提示词或连接参考素材。");
        }
        return buildFinalApiDebugPreview(await buildGenerateTextRequest(_0x26f91d));
      }
    });
  });
  _0x5ce019["btnEl"] = document["createElement"]("button");
  _0x5ce019['btnEl']["type"] = "button";
  _0x5ce019["btnEl"]["className"] = "prompt-submit img-gen-btn";
  _0x5ce019['btnEl']['title'] = _0x5272a1["btnTitle"] || sharedPromptPanelText("generate");
  _0x5ce019['btnEl']['innerHTML'] = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"5\"/><polyline points=\"5 12 12 5 19 12\"/></svg>";
  _0x5ce019["btnEl"]["addEventListener"]("click", _0x12c50a => {
    _0x12c50a["stopPropagation"]();
    flushPromptHtmlCommit(_0x5ce019);
    _0x5ce019["_onGenerate"]?.();
  });
  _0x5ed4c7["appendChild"](_0x49f592);
  _0x5ed4c7["appendChild"](_0x5ce019['btnEl']);
  _0x5325bd["appendChild"](_0x5ed4c7);
  _0x397efc['appendChild'](_0x5325bd);
  _0x5ce019["_sharedPanelCleanup"] = () => {
    _0x50f141["forEach"](_0x3892c0 => _0x3892c0?.());
  };
  _0x5ce019['_updateSubmitButtonState']?.();
  return _0x397efc;
}