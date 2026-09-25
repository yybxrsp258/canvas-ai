import { onLocaleChange, t } from '../../i18n/index.js';
import { activateMenuKeyboard } from '../../modules/floatingMenuKeyboard.js';
import { bindNodeFooterController, bindNodeModelMenuTrigger, closeNodeFooterMenus, createFloatingModelMenuPortal } from '../shared/nodeFooterControls.js';
import { escapeNodeMenuHtml } from '../shared/nodeModelMenu.js';
import { buildTextModelSmallIconHTML, buildTextProviderMenuGroupsHTML, findTextModelMenuItem } from './apimartTextModelMenu.js';
import { getCustomTextModels, saveCustomTextModels } from './customTextModels.js';
import { API_CONFIG_CHANGED_EVENT } from '../../../api/configApi.js';
import { buildModelProviderProfileSelectionPatch, getModelProviderProfileIds, getNextModelProviderProfileId, resolveModelProviderProfileId } from '../../modules/modelProviderProfileSelection.js';
import { getModelProviderProfileReadiness, getModelProviderProfileShortLabel, getModelProviderProfileStyleId, requestModelProviderProfileSelection, resolveConfiguredModelProviderProfileId } from '../shared/modelProviderProfileControl.js';
import { bindModelCredentialMenu, syncModelCredentialMenu } from '../../modules/modelCredentialUi.js';
export const DEFAULT_AIGEN_TEXT_MODEL_ID = 'apimart/kimi-k2-instruct';
const CARET_HTML = "<svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" class=\"node-menu-caret\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>";
const FALLBACK_ICON_HTML = "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"/></svg>";
function resolveModelLabel(_0x49cb51, _0x479fa2) {
  return _0x479fa2?.(_0x49cb51) || findTextModelMenuItem(_0x49cb51)?.["title"] || _0x49cb51 || "选择模型";
}
function resolveTriggerIcon(_0x23cde6, _0x84801b) {
  const _0x3a0deb = buildTextModelSmallIconHTML(_0x23cde6);
  if (_0x3a0deb) {
    return _0x3a0deb;
  }
  if (['custom', 'openai']["includes"](String(_0x84801b || '')["toLowerCase"]())) {
    return '<div\x20class=\x22text-model-icon-small\x20text-model-icon-badge\x22>OA</div>';
  }
  return FALLBACK_ICON_HTML;
}
export function buildAIGenTextModelMenuMarkup({
  activeModel = DEFAULT_AIGEN_TEXT_MODEL_ID,
  allowedModelIds: _0x20e757
} = {}) {
  const _0x21e809 = Array["isArray"](_0x20e757);
  const _0xc49a4d = _0x21e809 ? '' : "<div class=\"custom-group-header floating-menu-item node-menu-group-header\" data-custom-toggle data-node-menu-submenu=\".custom-submenu\">\n          <div class=\"text-model-icon text-model-icon-badge\">OA</div>\n          <div class=\"fmi-content\">\n            <div class=\"fmi-title\" data-aigen-text-locale=\"customModelTitle\">" + t("aigenText.customModelTitle") + "</div>\n            <div class=\"fmi-sub\" data-aigen-text-locale=\"customModelSubtitle\">" + t("aigenText.customModelSubtitle") + "</div>\n          </div>\n          <svg width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" class=\"node-menu-caret\"><polyline points=\"9 18 15 12 9 6\"></polyline></svg>\n        </div>\n        <div class=\"custom-submenu node-model-submenu node-menu-submenu\"></div>";
  return _0xc49a4d + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + buildTextProviderMenuGroupsHTML(activeModel, {
    'allowedModelIds': _0x20e757
  });
}
export function renderAIGenTextModelSelectorMarkup({
  modelId = DEFAULT_AIGEN_TEXT_MODEL_ID,
  provider = '',
  providerProfileId = '',
  includeRunningHubInternational = ![],
  getDisplayModelName: _0x552c68,
  className = '',
  allowedModelIds: _0x5bcdc1
} = {}) {
  const _0x5844fb = String(modelId || DEFAULT_AIGEN_TEXT_MODEL_ID);
  const _0x412f5f = resolveModelProviderProfileId({
    'model': _0x5844fb,
    'providerProfileId': providerProfileId
  });
  const _0x5a40aa = includeRunningHubInternational ? "<button type=\"button\" class=\"model-provider-profile-selector-toggle" + (getModelProviderProfileIds(_0x5844fb)["length"] > 0x1 ? '' : '\x20is-hidden') + '\x22\x20data-provider-profile-id=\x22' + escapeNodeMenuHtml(getModelProviderProfileStyleId(_0x412f5f)) + "\" data-provider-profile-value=\"" + escapeNodeMenuHtml(_0x412f5f) + '\x22>' + escapeNodeMenuHtml(getModelProviderProfileShortLabel(_0x412f5f)) + "</button>" : '';
  const _0x5f0f91 = ["img-model-pills", "aigen-text-model-selector", className]["filter"](Boolean)["join"]('\x20');
  return "<div class=\"" + escapeNodeMenuHtml(_0x5f0f91) + '\x22\x20data-aigen-text-model-selector>\x0a\x20\x20\x20\x20<div\x20class=\x22img-model-wrap\x22>\x0a\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22img-pill-btn\x20img-model-btn-trigger\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + resolveTriggerIcon(_0x5844fb, provider) + "\n        <span class=\"img-model-label\">" + escapeNodeMenuHtml(resolveModelLabel(_0x5844fb, _0x552c68)) + "</span>\n        " + CARET_HTML + '\x0a\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22floating-menu\x20img-model-menu\x20node-model-menu\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + buildAIGenTextModelMenuMarkup({
    'activeModel': _0x5844fb,
    'allowedModelIds': _0x5bcdc1
  }) + "\n      </div>\n    </div>\n    " + _0x5a40aa + "\n    <div class=\"ui-schema-placement ui-schema-mode-slot\" data-aigen-text-ui-schema-mode-slot hidden></div>\n  </div>";
}
function createCustomModelItem(_0x360aaf, _0x59cb91, _0x568bcd) {
  const _0x198c5b = _0x360aaf["createElement"]('div');
  _0x198c5b['className'] = 'floating-menu-item\x20custom-model-item' + (_0x568bcd === _0x59cb91 ? " active" : '');
  _0x198c5b["dataset"]["value"] = _0x59cb91;
  _0x198c5b['dataset']["provider"] = "custom";
  const _0x4ea529 = _0x360aaf["createElement"]("div");
  _0x4ea529["className"] = 'text-model-icon\x20text-model-icon-badge\x20custom-model-icon';
  _0x4ea529["textContent"] = 'OA';
  const _0x753e3 = _0x360aaf["createElement"]('span');
  _0x753e3["className"] = "custom-model-label";
  _0x753e3["textContent"] = _0x59cb91;
  const _0x230fa6 = _0x360aaf['createElement']("span");
  _0x230fa6["className"] = "custom-model-del";
  _0x230fa6["textContent"] = '×';
  _0x198c5b["addEventListener"]("mouseenter", () => _0x230fa6["classList"]['add']('show'));
  _0x198c5b["addEventListener"]('mouseleave', () => _0x230fa6["classList"]["remove"]("show"));
  _0x198c5b["append"](_0x4ea529, _0x753e3, _0x230fa6);
  return {
    'item': _0x198c5b,
    'remove': _0x230fa6
  };
}
export function bindAIGenTextModelSelector(_0x2c386c, {
  modelId = DEFAULT_AIGEN_TEXT_MODEL_ID,
  provider = '',
  providerProfileId = '',
  providerProfileIdByModel: _0x548b03 = {},
  getDisplayModelName: _0x4b36c4,
  onChange: _0x4a184d,
  getProfileReadiness = getModelProviderProfileReadiness,
  ensureProfileReady: _0x3ddc51,
  onProfileUnavailable: _0x1e9ae0,
  documentObject = globalThis["document"],
  windowObject = globalThis["window"],
  menuPortalHost = null,
  menuPortalClass = 'aigen-text-model-menu-portal',
  menuPortalSubmenuPlacement = "viewport-auto"
} = {}) {
  const _0x1550de = _0x2c386c?.["matches"]?.('[data-aigen-text-model-selector]') || _0x2c386c?.["dataset"]?.["aigenTextModelSelector"] !== undefined;
  const _0x45991b = _0x1550de ? _0x2c386c : _0x2c386c?.["querySelector"]?.('[data-aigen-text-model-selector]');
  if (!_0x45991b || !documentObject) {
    return {
      'destroy'() {}
    };
  }
  const _0x313d3d = _0x45991b["querySelector"](".img-model-wrap");
  const _0x431421 = _0x45991b["querySelector"]('.img-model-btn-trigger');
  const _0x30a73a = _0x45991b["querySelector"](".img-model-menu");
  const _0x191ab3 = _0x45991b["querySelector"](".img-model-label");
  const _0x11e523 = _0x45991b["querySelector"]('.custom-submenu');
  const _0x6cb1bf = _0x45991b["querySelector"]('.model-provider-profile-selector-toggle');
  let _0x1328fc = String(modelId || DEFAULT_AIGEN_TEXT_MODEL_ID);
  let _0x27a165 = String(provider || findTextModelMenuItem(_0x1328fc)?.['provider'] || '');
  let _0x390c55 = _0x548b03 && typeof _0x548b03 === "object" ? {
    ..._0x548b03
  } : {};
  let _0x23c978 = resolveModelProviderProfileId({
    'model': _0x1328fc,
    'providerProfileId': providerProfileId
  });
  const _0x534909 = [];
  let _0x5d0f27 = null;
  const _0x2e8fd4 = () => {
    if (_0x5d0f27) {
      _0x5d0f27["close"]();
      return;
    }
    _0x30a73a?.["classList"]['remove']("show");
  };
  const _0x18f814 = _0x317e2d => _0x317e2d['stopPropagation']();
  _0x45991b["addEventListener"]("pointerdown", _0x18f814);
  _0x534909["push"](() => _0x45991b['removeEventListener']('pointerdown', _0x18f814));
  const _0x4a15e0 = () => {
    if (_0x191ab3) {
      _0x191ab3["textContent"] = resolveModelLabel(_0x1328fc, _0x4b36c4);
    }
    const _0x23e057 = resolveTriggerIcon(_0x1328fc, _0x27a165);
    const _0x1d380f = documentObject['createElement']("template");
    _0x1d380f["innerHTML"] = _0x23e057["trim"]();
    const _0x1d6b31 = _0x1d380f['content']?.['firstElementChild'];
    const _0x502114 = _0x431421?.["firstElementChild"];
    if (_0x502114 && _0x1d6b31) {
      _0x502114["replaceWith"](_0x1d6b31);
    }
  };
  const _0x34a70d = () => {
    if (!_0x6cb1bf) {
      return;
    }
    const _0x44765f = getModelProviderProfileIds(_0x1328fc);
    const _0x405b49 = _0x44765f['length'] > 0x1;
    _0x6cb1bf["classList"]["toggle"]("is-hidden", !_0x405b49);
    if (!_0x405b49) {
      return;
    }
    const _0x38056c = {
      'model': _0x1328fc,
      'providerProfileId': _0x23c978,
      'providerProfileIdByModel': _0x390c55
    };
    const _0x2f16ef = resolveModelProviderProfileId(_0x38056c);
    const _0x442e27 = resolveConfiguredModelProviderProfileId(_0x38056c, getProfileReadiness);
    let _0x1ab006 = _0x38056c;
    if (_0x442e27 && _0x442e27 !== _0x2f16ef) {
      const _0x208ca5 = buildModelProviderProfileSelectionPatch(_0x38056c, _0x1328fc, _0x442e27);
      _0x23c978 = _0x208ca5['providerProfileId'];
      _0x390c55 = _0x208ca5['providerProfileIdByModel'] || {};
      _0x1ab006 = {
        ..._0x38056c,
        ..._0x208ca5
      };
    }
    const _0x4625be = getNextModelProviderProfileId(_0x1ab006);
    const _0x3d4b0f = getModelProviderProfileShortLabel(_0x442e27);
    const _0x52996c = getModelProviderProfileShortLabel(_0x4625be);
    _0x6cb1bf['textContent'] = _0x3d4b0f;
    _0x6cb1bf["dataset"]["providerProfileId"] = getModelProviderProfileStyleId(_0x442e27);
    _0x6cb1bf["dataset"]['providerProfileValue'] = _0x442e27;
    _0x6cb1bf["title"] = '当前' + _0x3d4b0f + "线路，点击切换到" + _0x52996c;
    _0x6cb1bf["setAttribute"]('aria-label', '当前' + _0x3d4b0f + "线路，点击切换到" + _0x52996c);
  };
  const _0x78d332 = (_0x33db79, _0x4415d4, _0x588587) => {
    const _0x9dc81b = String(_0x33db79 || '')['trim']();
    if (!_0x9dc81b) {
      return;
    }
    const _0x58168f = buildModelProviderProfileSelectionPatch({
      'model': _0x1328fc,
      'providerProfileId': _0x23c978,
      'providerProfileIdByModel': _0x390c55
    }, _0x9dc81b, _0x588587);
    _0x1328fc = _0x9dc81b;
    _0x27a165 = String(_0x4415d4 || findTextModelMenuItem(_0x9dc81b)?.["provider"] || '')["trim"]();
    _0x23c978 = _0x58168f['providerProfileId'];
    _0x390c55 = _0x58168f['providerProfileIdByModel'] || {};
    _0x30a73a?.["querySelectorAll"]('.floating-menu-item[data-value]')['forEach'](_0x3a8ffc => {
      _0x3a8ffc['classList']["toggle"]('active', _0x3a8ffc['dataset']["value"] === _0x1328fc);
    });
    _0x2e8fd4();
    _0x4a15e0();
    _0x34a70d();
    _0x4a184d?.({
      'modelId': _0x1328fc,
      'provider': _0x27a165,
      'providerProfileId': _0x23c978,
      'providerProfileIdByModel': _0x390c55
    });
  };
  const _0x2a2f35 = () => {
    if (!_0x11e523) {
      return;
    }
    _0x11e523["replaceChildren"]();
    const _0x405e4b = getCustomTextModels();
    _0x405e4b['forEach']((_0x5bf6ae, _0x5f01e1) => {
      const {
        item: _0x23a199,
        remove: _0x1a93ee
      } = createCustomModelItem(documentObject, _0x5bf6ae, _0x1328fc);
      _0x1a93ee["addEventListener"]("click", _0x34fb7f => {
        _0x34fb7f["preventDefault"]();
        _0x34fb7f["stopPropagation"]();
        saveCustomTextModels(_0x405e4b["filter"]((_0x43e2a6, _0x3f4e37) => _0x3f4e37 !== _0x5f01e1));
        _0x2a2f35();
      });
      _0x11e523["appendChild"](_0x23a199);
    });
    if (_0x405e4b["length"]) {
      const _0x917e8b = documentObject["createElement"]('div');
      _0x917e8b["className"] = "custom-model-separator";
      _0x11e523['appendChild'](_0x917e8b);
    }
    const _0x370532 = documentObject['createElement']("div");
    _0x370532["className"] = "floating-menu-item custom-model-add";
    _0x370532["innerHTML"] = "<svg class=\"custom-model-add-icon\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"/><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"/></svg><span class=\"custom-model-add-label\">" + t("aigenText.customModel.addModel") + "</span>";
    _0x370532["addEventListener"]("click", _0x1ed979 => {
      _0x1ed979['preventDefault']();
      _0x1ed979["stopPropagation"]();
      _0x370532['replaceChildren']();
      _0x370532["classList"]['add']('editing');
      const _0x2cd427 = documentObject["createElement"]("input");
      _0x2cd427["type"] = "text";
      _0x2cd427["className"] = 'custom-model-input';
      _0x2cd427["placeholder"] = t("aigenText.customModel.namePlaceholder");
      const _0x3ac3a2 = documentObject['createElement']("button");
      _0x3ac3a2["type"] = "button";
      _0x3ac3a2['className'] = "custom-model-confirm";
      _0x3ac3a2["textContent"] = t('aigenText.customModel.confirm');
      const _0x18eb75 = () => {
        const _0x4d5934 = _0x2cd427["value"]["trim"]();
        if (!_0x4d5934) {
          return;
        }
        const _0x39f189 = getCustomTextModels();
        if (!_0x39f189["includes"](_0x4d5934)) {
          saveCustomTextModels([..._0x39f189, _0x4d5934]);
        }
        _0x2a2f35();
      };
      _0x2cd427["addEventListener"]("keydown", _0x1d487d => {
        _0x1d487d["stopPropagation"]();
        if (_0x1d487d["key"] === "Enter") {
          _0x18eb75();
        }
      });
      _0x2cd427["addEventListener"]('click', _0x13c949 => _0x13c949["stopPropagation"]());
      _0x3ac3a2['addEventListener']("click", _0x47a230 => {
        _0x47a230["stopPropagation"]();
        _0x18eb75();
      });
      _0x370532["append"](_0x2cd427, _0x3ac3a2);
      _0x2cd427['focus']();
    });
    _0x11e523['appendChild'](_0x370532);
  };
  const _0x130681 = _0x261209 => {
    const _0x5ef3ab = _0x261209["target"]?.["closest"]?.('.floating-menu-item[data-value]');
    if (!_0x5ef3ab || !_0x30a73a?.["contains"](_0x5ef3ab) || _0x5ef3ab['dataset']["disabled"] === "true") {
      return;
    }
    _0x261209["stopPropagation"]();
    _0x78d332(_0x5ef3ab['dataset']["value"], _0x5ef3ab['dataset']["provider"], _0x5ef3ab["dataset"]['credentialResolvedProviderProfileId']);
  };
  _0x30a73a?.["addEventListener"]('click', _0x130681);
  _0x534909["push"](() => _0x30a73a?.['removeEventListener']("click", _0x130681));
  const _0x4aafd5 = _0x38cbee => {
    _0x38cbee["preventDefault"]();
    _0x38cbee["stopPropagation"]();
    const _0x4d8e52 = {
      'model': _0x1328fc,
      'providerProfileId': _0x23c978,
      'providerProfileIdByModel': _0x390c55
    };
    const _0x57098e = getNextModelProviderProfileId(_0x4d8e52);
    if (!_0x57098e) {
      return;
    }
    void requestModelProviderProfileSelection({
      'nodeData': _0x4d8e52,
      'targetProfileId': _0x57098e,
      'getProfileReadiness': getProfileReadiness,
      'ensureProfileReady': _0x3ddc51,
      'onUnavailable': _0x1e9ae0,
      'onChange': _0x2f272d => {
        _0x23c978 = _0x2f272d['providerProfileId'];
        _0x390c55 = _0x2f272d["providerProfileIdByModel"] || {};
        _0x34a70d();
        void syncModelCredentialMenu(_0x30a73a, {
          'documentObject': documentObject,
          'getProviderProfileId': () => _0x23c978
        });
        _0x4a184d?.({
          'modelId': _0x1328fc,
          'provider': _0x27a165,
          'providerProfileId': _0x23c978,
          'providerProfileIdByModel': _0x390c55
        });
      }
    });
  };
  _0x6cb1bf?.['addEventListener']("click", _0x4aafd5);
  _0x534909['push'](() => _0x6cb1bf?.["removeEventListener"]("click", _0x4aafd5));
  _0x534909['push'](bindNodeFooterController(_0x45991b, {
    'onOutsideClose': () => _0x5d0f27?.["close"]?.()
  }));
  if (menuPortalHost?.["appendChild"] && _0x30a73a && _0x431421) {
    _0x5d0f27 = createFloatingModelMenuPortal({
      'menu': _0x30a73a,
      'trigger': _0x431421,
      'host': menuPortalHost,
      'documentObject': documentObject,
      'windowObject': windowObject,
      'portalClass': menuPortalClass,
      'submenuPlacement': menuPortalSubmenuPlacement
    });
    const _0x1a6c93 = _0x4cd433 => {
      _0x4cd433["stopPropagation"]();
      const _0x329bce = !_0x5d0f27["isOpen"]();
      closeNodeFooterMenus(_0x45991b);
      _0x329bce ? _0x5d0f27['open']() : _0x5d0f27["close"]();
    };
    const _0x5a11c8 = _0x3f645a => _0x3f645a["stopPropagation"]();
    _0x431421["addEventListener"]("click", _0x1a6c93);
    _0x30a73a["addEventListener"]("click", _0x5a11c8);
    _0x534909["push"](() => {
      _0x431421["removeEventListener"]("click", _0x1a6c93);
      _0x30a73a["removeEventListener"]("click", _0x5a11c8);
      _0x5d0f27?.["destroy"]?.();
      _0x5d0f27 = null;
    });
  } else {
    _0x534909["push"](bindNodeModelMenuTrigger({
      'root': _0x45991b,
      'trigger': _0x431421,
      'menu': _0x30a73a,
      'closeOthers': () => closeNodeFooterMenus(_0x45991b, _0x30a73a),
      'activateMenuKeyboard': activateMenuKeyboard
    }));
  }
  const _0x39ca5c = onLocaleChange(() => {
    _0x45991b['querySelector']("[data-aigen-text-locale=\"customModelTitle\"]")?.["replaceChildren"](documentObject['createTextNode'](t("aigenText.customModelTitle")));
    _0x45991b["querySelector"]("[data-aigen-text-locale=\"customModelSubtitle\"]")?.["replaceChildren"](documentObject['createTextNode'](t('aigenText.customModelSubtitle')));
    _0x2a2f35();
    _0x4a15e0();
  });
  _0x534909["push"](_0x39ca5c);
  const _0x5a5839 = () => {
    _0x34a70d();
  };
  globalThis['window']?.["addEventListener"]?.(API_CONFIG_CHANGED_EVENT, _0x5a5839);
  _0x534909["push"](() => globalThis["window"]?.["removeEventListener"]?.(API_CONFIG_CHANGED_EVENT, _0x5a5839));
  _0x2a2f35();
  _0x4a15e0();
  _0x34a70d();
  const _0x5637bb = bindModelCredentialMenu(_0x30a73a, {
    'documentObject': documentObject,
    'getProviderProfileId': () => _0x23c978
  });
  return {
    'modelWrap': _0x313d3d,
    'trigger': _0x431421,
    'menu': _0x30a73a,
    'getSelection': () => ({
      'modelId': _0x1328fc,
      'provider': _0x27a165,
      'providerProfileId': _0x23c978,
      'providerProfileIdByModel': _0x390c55
    }),
    'setSelection': ({
      modelId: _0xe02925,
      provider: _0x2b9d95,
      providerProfileId: _0x3d7743,
      providerProfileIdByModel: _0x107bcc
    } = {}) => {
      const _0x5e1ccb = _0x1328fc;
      _0x1328fc = String(_0xe02925 || _0x1328fc);
      _0x27a165 = String(_0x2b9d95 || findTextModelMenuItem(_0x1328fc)?.['provider'] || _0x27a165);
      const _0x198d8a = buildModelProviderProfileSelectionPatch({
        'model': _0x5e1ccb,
        'providerProfileId': _0x23c978,
        'providerProfileIdByModel': _0x107bcc || _0x390c55
      }, _0x1328fc, _0x3d7743);
      _0x23c978 = _0x198d8a['providerProfileId'];
      _0x390c55 = _0x198d8a["providerProfileIdByModel"] || {};
      _0x2a2f35();
      _0x4a15e0();
      _0x34a70d();
    },
    'destroy'() {
      _0x5637bb?.();
      _0x534909['forEach'](_0x1bc15c => _0x1bc15c?.());
    }
  };
}