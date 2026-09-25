import { getDisplayModelName } from '../../modules/providers.js';
import { activateMenuKeyboard } from '../../modules/floatingMenuKeyboard.js';
import { getModelManifest } from '../../manifests/index.js';
import { t } from '../../i18n/index.js';
import { bindImageModelMenuGroups } from './imageModelMenuBinding.js';
import { bindModelUiSchemaControls, buildModelUiSchemaDefaultParams, renderModelUiSchemaControls, sanitizeModelUiSchemaParams } from './uiSchemaRenderer.js';
import { buildUiSchemaVisibilitySignature } from './uiSchemaVisibility.js';
import { closeNodeFooterMenus, createFloatingModelMenuPortal, createFloatingUiSchemaPopupPortal } from '../shared/nodeFooterControls.js';
import { ADVANCED_SETTINGS_TUNE_ICON_MARKUP } from '../sharedIconMarkup.js';
import { renderNodeModelMenu } from '../shared/nodeModelMenu.js';
import { buildModelProviderProfileSelectionPatch } from '../../modules/modelProviderProfileSelection.js';
import { bindModelCredentialMenu, syncModelCredentialMenu } from '../../modules/modelCredentialUi.js';
import { buildImageModelMenuHTML, renderImageModelTriggerIconHTML } from './uiModuleModelHelpers.js';
function escapeHtml(_0x29d88c) {
  return String(_0x29d88c ?? '')['replace'](/&/g, "&amp;")["replace"](/</g, "&lt;")['replace'](/>/g, "&gt;")["replace"](/"/g, "&quot;")["replace"](/'/g, "&#39;");
}
function getPlainObject(_0x1229d2) {
  return _0x1229d2 && typeof _0x1229d2 === 'object' && !Array["isArray"](_0x1229d2) ? {
    ..._0x1229d2
  } : {};
}
function renderStandaloneSchemaControls(_0x376eeb, _0x2c32fc = {}, _0x5b276e = []) {
  const _0x281ef1 = renderModelUiSchemaControls(_0x376eeb, _0x2c32fc, {
    'placement': "mode",
    'variant': 'pillMenu',
    'excludeFieldIds': _0x5b276e
  });
  const _0x2a5472 = renderModelUiSchemaControls(_0x376eeb, _0x2c32fc, {
    'placement': "resolution",
    'variant': "resolutionPill",
    'excludeFieldIds': _0x5b276e
  });
  const _0x4a8a17 = renderModelUiSchemaControls(_0x376eeb, _0x2c32fc, {
    'placement': "advanced",
    'variant': 'advancedRow',
    'excludeFieldIds': _0x5b276e
  });
  const _0x126753 = renderModelUiSchemaControls(_0x376eeb, _0x2c32fc, {
    'placement': "instance",
    'variant': "instanceToggle",
    'excludeFieldIds': _0x5b276e
  });
  return {
    'mode': _0x281ef1,
    'resolution': _0x2a5472,
    'advanced': _0x4a8a17,
    'instance': _0x126753
  };
}
export function renderAIGenImageModelSelectorMarkup({
  modelId = '',
  provider = '',
  className = '',
  generationParams = {},
  providerProfileId = '',
  providerProfileIdByModel = {},
  showSchemaControls = ![],
  excludeRunningHubWorkflowModels = ![],
  allowedWorkflowModelIds = null,
  modelMenuGroups = null,
  excludeFieldIds = [],
  showCaret = ![]
} = {}) {
  const _0x5d3667 = String(modelId || '')['trim']();
  const _0x752079 = {
    'model': _0x5d3667,
    'provider': provider,
    'generationParams': getPlainObject(generationParams),
    'providerProfileId': String(providerProfileId || '')['trim'](),
    'providerProfileIdByModel': getPlainObject(providerProfileIdByModel)
  };
  const _0x5af1dc = showSchemaControls ? renderStandaloneSchemaControls(_0x5d3667, _0x752079, excludeFieldIds) : {
    'mode': '',
    'resolution': '',
    'advanced': '',
    'instance': ''
  };
  const _0x128a12 = escapeHtml(t("aigenImage.controls.advancedSettings"));
  return "<div class=\"img-model-pills aigen-image-model-selector " + escapeHtml(className) + "\" data-aigen-image-model-selector>\n    <div class=\"img-model-wrap\">\n      <button type=\"button\" class=\"img-pill-btn img-model-btn-trigger\" aria-expanded=\"false\">\n        " + renderImageModelTriggerIconHTML({
    'model': _0x5d3667,
    'provider': provider
  }) + "\n        <span class=\"img-model-label\">" + escapeHtml(getDisplayModelName(_0x5d3667)) + "</span>\n        " + (showCaret ? "<svg class=\"image-model-selector-caret\" width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" aria-hidden=\"true\"><path d=\"m6 9 6 6 6-6\"/></svg>" : '') + "\n      </button>\n      " + (Array["isArray"](modelMenuGroups) ? renderNodeModelMenu({
    'groups': modelMenuGroups,
    'activeModel': _0x5d3667,
    'kind': 'image'
  }) : buildImageModelMenuHTML({
    'activeModel': _0x5d3667,
    'excludeRunningHubWorkflowModels': excludeRunningHubWorkflowModels,
    'allowedWorkflowModelIds': allowedWorkflowModelIds
  })) + "\n    </div>\n    " + (showSchemaControls ? '<div\x20class=\x22ui-schema-placement\x20ui-schema-mode-slot\x22\x20style=\x22' + (_0x5af1dc['mode'] ? '' : "display:none;") + '\x22>' + _0x5af1dc["mode"] + "</div>\n    <div class=\"ui-schema-placement ui-schema-resolution-slot\" style=\"" + (_0x5af1dc["resolution"] ? '' : 'display:none;') + '\x22>' + _0x5af1dc['resolution'] + '</div>\x0a\x20\x20\x20\x20<div\x20class=\x22rh-adv-wrap\x22\x20style=\x22position:relative;' + (_0x5af1dc['advanced'] ? '' : 'display:none;') + "\">\n      <button type=\"button\" class=\"img-pill-btn rh-adv-btn advanced-settings-icon-button\" data-tooltip=\"" + _0x128a12 + "\" aria-label=\"" + _0x128a12 + '\x22\x20aria-expanded=\x22false\x22>' + ADVANCED_SETTINGS_TUNE_ICON_MARKUP + "</button>\n    </div>\n    <div class=\"ui-schema-placement ui-schema-instance-slot\" style=\"" + (_0x5af1dc["instance"] ? '' : "display:none;") + '\x22>' + _0x5af1dc["instance"] + "</div>\n    <div class=\"rh-adv-panel\">" + _0x5af1dc['advanced'] + "</div>" : '') + "\n  </div>";
}
export function bindAIGenImageModelSelector(_0x166d27, {
  modelId = '',
  provider = '',
  generationParams = {},
  generationParamsByModel = {},
  providerProfileId = '',
  providerProfileIdByModel = {},
  showSchemaControls = ![],
  onChange: _0x46d003,
  documentObject = globalThis['document'],
  windowObject = globalThis['window'],
  floatingMenuHost = null,
  modelSubmenuPlacement = "viewport-auto",
  schemaPopupPlacement = "inline",
  excludeFieldIds = []
} = {}) {
  const _0x22b77e = _0x166d27?.["matches"]?.("[data-aigen-image-model-selector]") ? _0x166d27 : _0x166d27?.['querySelector']?.('[data-aigen-image-model-selector]');
  if (!_0x22b77e || !documentObject) {
    return {
      'destroy'() {}
    };
  }
  const _0x366db4 = _0x22b77e['querySelector'](".img-model-btn-trigger");
  const _0x28a571 = _0x22b77e["querySelector"]('.img-model-label');
  const _0xf7c2b9 = _0x22b77e['querySelector'](".img-model-menu");
  const _0x581183 = createFloatingModelMenuPortal({
    'menu': _0xf7c2b9,
    'trigger': _0x366db4,
    'host': floatingMenuHost,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'portalClass': "aigen-image-model-menu-portal",
    'submenuPlacement': modelSubmenuPlacement
  });
  const _0x133df8 = createFloatingUiSchemaPopupPortal({
    'selector': _0x22b77e,
    'host': floatingMenuHost,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'placement': schemaPopupPlacement,
    'contextClass': "aigen-image-menu-context"
  });
  let _0x3d58cf = String(modelId || '')["trim"]();
  let _0x3aff28 = String(provider || '')["trim"]();
  const _0x32588a = "standalone-image-model-selector";
  let _0x2588c4 = {
    'model': _0x3d58cf,
    'provider': _0x3aff28,
    'generationParams': getPlainObject(generationParams),
    'generationParamsByModel': getPlainObject(generationParamsByModel),
    'providerProfileId': String(providerProfileId || '')["trim"](),
    'providerProfileIdByModel': getPlainObject(providerProfileIdByModel)
  };
  let _0x12a3d1 = null;
  let _0x49bf76 = '';
  const _0x4b1a25 = () => {
    if (_0x28a571) {
      _0x28a571["textContent"] = getDisplayModelName(_0x3d58cf);
    }
    const _0x3f1968 = documentObject['createElement']("template");
    _0x3f1968['innerHTML'] = renderImageModelTriggerIconHTML({
      'model': _0x3d58cf,
      'provider': _0x3aff28
    })['trim']();
    const _0x1d7f14 = _0x3f1968['content']['firstElementChild'];
    if (_0x1d7f14 && _0x366db4?.["firstElementChild"]) {
      _0x366db4["firstElementChild"]["replaceWith"](_0x1d7f14);
    }
  };
  const _0x56aaa5 = _0x2f716b => _0x2f716b["stopPropagation"]();
  const _0x153a59 = () => {
    _0x133df8["close"]();
    _0x22b77e['querySelectorAll'](".ui-schema-floating-menu")["forEach"](_0x1105fa => _0x1105fa["classList"]['remove']("show"));
    _0x22b77e['querySelectorAll'](".ui-schema-popup")["forEach"](_0x4ce93d => {
      _0x4ce93d["style"]['display'] = 'none';
    });
  };
  const _0x35cd85 = _0x207374 => {
    _0x207374['stopPropagation']();
    const _0x3c8fdf = !_0x581183["isOpen"]();
    _0x153a59();
    _0x22b77e["querySelector"](".rh-adv-panel")?.["classList"]["remove"]('show');
    _0x22b77e["querySelector"]('.rh-adv-btn')?.["setAttribute"]("aria-expanded", "false");
    _0x3c8fdf ? (_0x581183['open'](), activateMenuKeyboard(_0xf7c2b9)) : _0x581183['close']();
  };
  const _0x2c1bc6 = _0xdee38d => {
    if (_0x22b77e["contains"](_0xdee38d["target"]) || _0x581183["contains"](_0xdee38d["target"]) || _0x133df8["contains"](_0xdee38d['target'])) {
      return;
    }
    _0x581183['close']();
    _0x153a59();
    _0x22b77e['querySelector'](".rh-adv-panel")?.['classList']['remove']('show');
    _0x22b77e['querySelector']('.rh-adv-btn')?.["setAttribute"]("aria-expanded", "false");
  };
  const _0x47f723 = (_0x2e7ee1, _0x1121fe, _0x33fda2, _0x6eaa80 = {}) => {
    const _0xc8019b = String(_0x2e7ee1?.["model"] || '')['trim']();
    const _0x30fbc3 = String(_0x1121fe || '')["trim"]();
    const _0x26f29f = getPlainObject(_0x2e7ee1?.['generationParamsByModel']);
    _0xc8019b && (_0x26f29f[_0xc8019b] = getPlainObject(_0x2e7ee1?.['generationParams']));
    const _0x18083b = _0x30fbc3 ? _0x26f29f[_0x30fbc3] : undefined;
    const _0x158359 = buildModelUiSchemaDefaultParams(_0x30fbc3);
    const _0x419369 = new Set((getModelManifest(_0x30fbc3)?.["uiSchema"]?.["fields"] || [])["map"](_0x494871 => String(_0x494871?.['id'] || '')["trim"]()));
    const _0x2c5ff3 = {};
    _0x419369["forEach"](_0x4a0148 => {
      Object["prototype"]["hasOwnProperty"]["call"](_0x6eaa80, _0x4a0148) && (_0x2c5ff3[_0x4a0148] = _0x6eaa80[_0x4a0148]);
    });
    const _0x363d9c = sanitizeModelUiSchemaParams(_0x30fbc3, {
      ..._0x158359,
      ...getPlainObject(_0x18083b),
      ...getPlainObject(_0x6eaa80["generationParams"]),
      ..._0x2c5ff3
    });
    const {
      generationParams: _0x294fa5,
      ..._0x2d4e8a
    } = _0x6eaa80;
    _0x419369["forEach"](_0x1b82e1 => delete _0x2d4e8a[_0x1b82e1]);
    const _0xfa6c8b = buildModelProviderProfileSelectionPatch(_0x2e7ee1, _0x30fbc3, _0x6eaa80?.["providerProfileId"]);
    return {
      ..._0x2d4e8a,
      ..._0xfa6c8b,
      'model': _0x30fbc3,
      'provider': _0x33fda2,
      'generationParams': _0x363d9c,
      'generationParamsByModel': _0x26f29f
    };
  };
  const _0x23de83 = () => {
    if (!showSchemaControls) {
      return;
    }
    _0x133df8['close']();
    _0x49bf76 = buildUiSchemaVisibilitySignature(_0x3d58cf, _0x2588c4);
    const _0x2024ba = renderStandaloneSchemaControls(_0x3d58cf, _0x2588c4, excludeFieldIds);
    const _0x589208 = (_0x5ec68d, _0x58eed5) => {
      const _0x54f841 = _0x22b77e["querySelector"](_0x5ec68d);
      if (!_0x54f841) {
        return;
      }
      _0x54f841["innerHTML"] = _0x58eed5;
      _0x54f841["style"]["display"] = _0x58eed5 ? '' : "none";
    };
    _0x589208(".ui-schema-mode-slot", _0x2024ba["mode"]);
    _0x589208('.ui-schema-resolution-slot', _0x2024ba['resolution']);
    _0x589208(".ui-schema-instance-slot", _0x2024ba["instance"]);
    const _0x41575a = _0x22b77e["querySelector"](".rh-adv-panel");
    if (_0x41575a) {
      _0x41575a["innerHTML"] = _0x2024ba["advanced"];
    }
    const _0x1580ad = _0x22b77e['querySelector'](".rh-adv-wrap");
    if (_0x1580ad) {
      _0x1580ad['style']["display"] = _0x2024ba["advanced"] ? '' : "none";
    }
    !_0x2024ba["advanced"] && (_0x41575a?.['classList']["remove"]("show"), _0x22b77e['querySelector'](".rh-adv-btn")?.["setAttribute"]('aria-expanded', 'false'));
    _0x12a3d1?.();
    _0x12a3d1 = bindModelUiSchemaControls(_0x22b77e, {
      'nodeId': _0x32588a,
      'nodeData': _0x2588c4,
      'store': _0x170836
    });
  };
  const _0x170836 = {
    'getState': () => ({
      'nodes': {
        [_0x32588a]: _0x2588c4
      }
    }),
    'updateNodeData': (_0x4140c3, _0x4c8b3b = {}) => {
      _0x2588c4 = {
        ..._0x2588c4,
        ..._0x4c8b3b
      };
      _0x3d58cf = String(_0x2588c4["model"] || _0x3d58cf)['trim']();
      _0x3aff28 = String(_0x2588c4['provider'] || _0x3aff28)["trim"]();
      _0x4b1a25();
      const _0x52a809 = buildUiSchemaVisibilitySignature(_0x3d58cf, _0x2588c4);
      _0x52a809 !== _0x49bf76 && _0x23de83();
      _0x46d003?.({
        'modelId': _0x3d58cf,
        'provider': _0x3aff28,
        'generationParams': getPlainObject(_0x2588c4["generationParams"]),
        'generationParamsByModel': getPlainObject(_0x2588c4['generationParamsByModel']),
        'providerProfileId': String(_0x2588c4["providerProfileId"] || '')["trim"](),
        'providerProfileIdByModel': getPlainObject(_0x2588c4["providerProfileIdByModel"]),
        'patch': {
          ..._0x4c8b3b
        }
      });
    }
  };
  bindImageModelMenuGroups({
    'modelMenu': _0xf7c2b9,
    'modelTrigger': _0x366db4,
    'modelLabel': _0x28a571,
    'nodeId': _0x32588a,
    'store': _0x170836,
    'fallbackNodeData': _0x2588c4,
    'buildModelPatch': _0x47f723,
    'afterSelect': () => _0x581183["close"]()
  });
  const _0x18f1b9 = bindModelCredentialMenu(_0xf7c2b9, {
    'documentObject': documentObject,
    'getProviderProfileId': () => String(_0x2588c4["providerProfileId"] || _0x2588c4["rhProviderProfileId"] || '')['trim']()
  });
  _0x22b77e["addEventListener"]('pointerdown', _0x56aaa5);
  _0xf7c2b9?.["addEventListener"]("pointerdown", _0x56aaa5);
  _0x366db4?.["addEventListener"]('click', _0x35cd85);
  const _0x1f9a45 = _0x22b77e["querySelector"](".rh-adv-btn");
  const _0x1d9c7f = _0x22b77e['querySelector'](".rh-adv-panel");
  const _0x10ece0 = _0x30151d => {
    _0x30151d["stopPropagation"]();
    _0x153a59();
    const _0x249da5 = _0x1d9c7f?.["classList"]["toggle"]("show") === !![];
    _0x1f9a45?.["setAttribute"]("aria-expanded", String(_0x249da5));
    _0x581183["close"]();
  };
  const _0x40a595 = _0x4a4120 => {
    _0x581183["close"]();
    closeNodeFooterMenus(_0x22b77e, null, {
      'preserveAdvPanel': _0x4a4120?.['detail']?.["fieldEl"] || null
    });
    _0x1f9a45?.["setAttribute"]("aria-expanded", String(_0x1d9c7f?.['classList']["contains"]("show") === !![]));
  };
  _0x1f9a45?.['addEventListener']('click', _0x10ece0);
  _0x1d9c7f?.['addEventListener']('click', _0x56aaa5);
  _0x22b77e["addEventListener"]("ui-schema-menu-before-open", _0x40a595);
  documentObject["addEventListener"]('click', _0x2c1bc6);
  _0x23de83();
  return {
    'closeMenus'() {
      _0x581183["close"]();
      _0x153a59();
      _0x1d9c7f?.["classList"]["remove"]("show");
      _0x1f9a45?.["setAttribute"]('aria-expanded', "false");
    },
    'applyProviderProfilePatch'(_0x27f56f = {}) {
      _0x170836["updateNodeData"](_0x32588a, {
        'providerProfileId': String(_0x27f56f["providerProfileId"] || '')['trim'](),
        'providerProfileIdByModel': getPlainObject(_0x27f56f["providerProfileIdByModel"] || _0x2588c4['providerProfileIdByModel'])
      });
      void syncModelCredentialMenu(_0xf7c2b9, {
        'documentObject': documentObject,
        'getProviderProfileId': () => String(_0x2588c4["providerProfileId"] || '')["trim"]()
      });
      return !![];
    },
    'destroy'() {
      _0x133df8["destroy"]();
      _0x12a3d1?.();
      _0x18f1b9?.();
      _0x581183['destroy']();
      _0x22b77e["removeEventListener"]("pointerdown", _0x56aaa5);
      _0xf7c2b9?.["removeEventListener"]('pointerdown', _0x56aaa5);
      _0x366db4?.["removeEventListener"]("click", _0x35cd85);
      _0x1f9a45?.["removeEventListener"]("click", _0x10ece0);
      _0x1d9c7f?.['removeEventListener']("click", _0x56aaa5);
      _0x22b77e["removeEventListener"]("ui-schema-menu-before-open", _0x40a595);
      documentObject['removeEventListener']("click", _0x2c1bc6);
    }
  };
}