import { API_CONFIG_CHANGED_EVENT, ensureConfig, isApiConfigLoaded } from '../../api/configApi.js';
import { CLI_PROVIDER_STATUS_CHANGED_EVENT } from '../../api/cliProviderApi.js';
import { DREAMINA_CLI_STATUS_CHANGED_EVENT } from '../../api/dreaminaCliApi.js';
import { ensureModelGenerationReadiness, getModelGenerationReadiness } from '../services/modelGenerationReadiness.js';
import { getModelProviderProfileIds, resolveReadyModelProviderProfileId } from './modelProviderProfileSelection.js';
import { t } from '../i18n/index.js';
import { showCliLoginMissingToast } from './cliLoginMissingToast.js';
import { showProviderApiKeyMissingToast } from './providerApiKeyMissingToast.js';
const CREDENTIAL_BUTTON_CLASS = "is-credential-required";
const CREDENTIAL_BADGE_SELECTOR = "[data-model-credential-badge]";
const CREDENTIAL_MENU_ITEM_SELECTOR = ['.node-menu-item[data-value]', '.node-menu-item[data-credential-model]']["join"](',\x20');
const CREDENTIAL_STATUS_EVENTS = Object['freeze']([API_CONFIG_CHANGED_EVENT, CLI_PROVIDER_STATUS_CHANGED_EVENT, DREAMINA_CLI_STATUS_CHANGED_EVENT]);
const CREDENTIAL_STATUS_SUBSCRIPTIONS = new WeakMap();
const CREDENTIAL_STATUS_REVISIONS = new WeakMap();
const MODEL_CREDENTIAL_MENU_SYNC_STATES = new WeakMap();
const MODEL_CREDENTIAL_ITEM_SYNC_STATES = new WeakMap();
function getCredentialStatusRevision(_0x3a05e7 = globalThis['window']) {
  if (!_0x3a05e7?.["addEventListener"]) {
    return null;
  }
  let _0x330833 = CREDENTIAL_STATUS_REVISIONS["get"](_0x3a05e7);
  if (!_0x330833) {
    _0x330833 = {
      'revision': 0x0
    };
    const _0x3ffb28 = () => {
      _0x330833["revision"] += 0x1;
    };
    CREDENTIAL_STATUS_EVENTS["forEach"](_0x3dd3b2 => {
      _0x3a05e7["addEventListener"](_0x3dd3b2, _0x3ffb28, !![]);
    });
    CREDENTIAL_STATUS_REVISIONS["set"](_0x3a05e7, _0x330833);
  }
  return _0x330833["revision"];
}
function bindModelCredentialStatusEvents(_0x2f628b, _0x299623 = globalThis['window']) {
  if (typeof _0x2f628b !== "function" || !_0x299623?.["addEventListener"]) {
    return () => {};
  }
  let _0x15b6f2 = CREDENTIAL_STATUS_SUBSCRIPTIONS["get"](_0x299623);
  if (!_0x15b6f2) {
    const _0x4acd11 = new Set();
    const _0x577899 = _0x19ea33 => {
      [..._0x4acd11]["forEach"](_0x1e46c7 => _0x1e46c7(_0x19ea33));
    };
    _0x15b6f2 = {
      'dispatch': _0x577899,
      'listeners': _0x4acd11
    };
    CREDENTIAL_STATUS_SUBSCRIPTIONS["set"](_0x299623, _0x15b6f2);
    CREDENTIAL_STATUS_EVENTS["forEach"](_0x2ba0cc => {
      _0x299623["addEventListener"](_0x2ba0cc, _0x577899);
    });
  }
  _0x15b6f2["listeners"]["add"](_0x2f628b);
  let _0x3e9043 = !![];
  return () => {
    if (!_0x3e9043) {
      return;
    }
    _0x3e9043 = ![];
    _0x15b6f2['listeners']["delete"](_0x2f628b);
    if (_0x15b6f2["listeners"]["size"] > 0x0) {
      return;
    }
    CREDENTIAL_STATUS_EVENTS["forEach"](_0x32df73 => {
      _0x299623["removeEventListener"]?.(_0x32df73, _0x15b6f2["dispatch"]);
    });
    CREDENTIAL_STATUS_SUBSCRIPTIONS["delete"](_0x299623);
  };
}
function getMenuItemCredentialContext(_0x57f7eb) {
  return {
    'modelId': String(_0x57f7eb?.["dataset"]?.["credentialModel"] || _0x57f7eb?.["dataset"]?.["value"] || '')["trim"](),
    'providerId': String(_0x57f7eb?.["dataset"]?.['provider'] || '')["trim"]()
  };
}
function showMissingCredential(_0x49c7a7) {
  if (!_0x49c7a7 || _0x49c7a7['status'] !== "missing") {
    return ![];
  }
  if (_0x49c7a7["requirementType"] === "cliLogin") {
    showCliLoginMissingToast(_0x49c7a7["message"], {
      'providerId': _0x49c7a7['cliProviderId'],
      'fieldIds': _0x49c7a7["fieldIds"]
    });
    return !![];
  }
  showProviderApiKeyMissingToast(_0x49c7a7["message"], {
    'providerId': _0x49c7a7["configProviderId"] || _0x49c7a7["providerId"],
    'fieldIds': _0x49c7a7["fieldIds"],
    'keyType': _0x49c7a7['keyType'],
    'adapterType': _0x49c7a7["adapterType"],
    'model': _0x49c7a7['modelId']
  });
  return !![];
}
export function guardModelGenerationCredentials(_0x694e9a = {}) {
  let _0x5b7f41 = getModelGenerationReadiness(_0x694e9a);
  if (_0x5b7f41["status"] === "loading" && _0x694e9a["waitForConfig"] === !![]) {
    return ensureModelGenerationReadiness(_0x694e9a)['then'](_0x534ce2 => {
      if (_0x534ce2["ready"]) {
        return _0x534ce2;
      }
      showMissingCredential(_0x534ce2);
      return _0x534ce2;
    });
  }
  if (_0x5b7f41["status"] === 'loading') {
    return {
      ..._0x5b7f41,
      'ready': !![],
      'status': 'deferred',
      'reason': "runtime-check-pending"
    };
  }
  if (_0x5b7f41["ready"]) {
    return _0x5b7f41;
  }
  showMissingCredential(_0x5b7f41);
  return _0x5b7f41;
}
export function resetModelCredentialButtonState(_0x243b1d) {
  if (!_0x243b1d) {
    return;
  }
  const _0x5065ee = _0x243b1d["dataset"] || {};
  _0x243b1d["classList"]?.["remove"](CREDENTIAL_BUTTON_CLASS);
  _0x5065ee['credentialUiApplied'] === "true" && (_0x5065ee['credentialHadTitle'] === "true" ? _0x243b1d["setAttribute"]?.("title", _0x5065ee['credentialOriginalTitle'] || '') : _0x243b1d["removeAttribute"]?.("title"), _0x5065ee['credentialHadAriaLabel'] === "true" ? _0x243b1d["setAttribute"]?.("aria-label", _0x5065ee["credentialOriginalAriaLabel"] || '') : _0x243b1d["removeAttribute"]?.("aria-label"), _0x243b1d["style"] && (_0x243b1d["style"]["cursor"] = _0x5065ee['credentialOriginalCursor'] || ''));
  delete _0x5065ee["credentialProvider"];
  delete _0x5065ee["credentialField"];
  delete _0x5065ee["credentialUiApplied"];
  delete _0x5065ee["credentialHadTitle"];
  delete _0x5065ee["credentialOriginalTitle"];
  delete _0x5065ee["credentialHadAriaLabel"];
  delete _0x5065ee['credentialOriginalAriaLabel'];
  delete _0x5065ee["credentialOriginalCursor"];
}
export function applyModelCredentialButtonState(_0x531662, _0x543fc5 = {}) {
  if (!_0x531662) {
    return null;
  }
  const _0x400251 = getModelGenerationReadiness(_0x543fc5);
  resetModelCredentialButtonState(_0x531662);
  if (_0x400251["status"] !== 'missing') {
    return _0x400251;
  }
  const _0x4aed69 = _0x531662["dataset"] || {};
  _0x4aed69['credentialUiApplied'] = "true";
  _0x4aed69["credentialHadTitle"] = String(_0x531662["hasAttribute"]?.('title'));
  _0x4aed69["credentialOriginalTitle"] = _0x531662['getAttribute']?.("title") || '';
  _0x4aed69["credentialHadAriaLabel"] = String(_0x531662["hasAttribute"]?.("aria-label"));
  _0x4aed69["credentialOriginalAriaLabel"] = _0x531662["getAttribute"]?.("aria-label") || '';
  _0x4aed69['credentialOriginalCursor'] = _0x531662["style"]?.["cursor"] || '';
  _0x531662["classList"]?.["add"](CREDENTIAL_BUTTON_CLASS);
  _0x4aed69["credentialProvider"] = _0x400251["configProviderId"] || _0x400251['providerId'];
  _0x4aed69['credentialField'] = _0x400251["credentialField"];
  _0x531662['disabled'] = ![];
  _0x531662['title'] = _0x400251["message"];
  _0x531662["setAttribute"]?.("aria-label", _0x400251["message"]);
  _0x531662["style"]["cursor"] = "var(--link-cursor)";
  return _0x400251;
}
export function bindModelCredentialButtonState(_0x13201d, _0x5251e8 = {}) {
  if (!_0x13201d) {
    return () => {};
  }
  const _0x39f548 = typeof _0x5251e8["getCredentialOptions"] === 'function' ? _0x5251e8["getCredentialOptions"] : () => _0x5251e8["credentialOptions"] || {};
  const _0x1aa878 = () => {
    if (_0x13201d['isConnected'] === ![]) {
      return null;
    }
    if (typeof _0x5251e8["onRefresh"] === "function") {
      return _0x5251e8["onRefresh"](_0x13201d);
    }
    const _0x51eb51 = _0x39f548();
    if (!_0x51eb51) {
      resetModelCredentialButtonState(_0x13201d);
      return null;
    }
    return applyModelCredentialButtonState(_0x13201d, _0x51eb51);
  };
  const _0x49223c = bindModelCredentialStatusEvents(_0x1aa878, _0x5251e8['windowObject'] || globalThis["window"]);
  if (_0x5251e8["syncOnBind"] !== ![]) {
    _0x1aa878();
  }
  return _0x49223c;
}
function clearMenuItemCredentialState(_0x949e38) {
  _0x949e38["classList"]?.['remove']("needs-model-credential");
  _0x949e38["classList"]?.["remove"]("needs-model-api-authorization");
  if (_0x949e38["dataset"]['credentialHadTitle'] === 'true') {
    _0x949e38["setAttribute"]?.("title", _0x949e38["dataset"]["credentialOriginalTitle"] || '');
  } else {
    _0x949e38['dataset']["credentialStateApplied"] === "true" && _0x949e38["removeAttribute"]?.("title");
  }
  delete _0x949e38["dataset"]['credentialMissing'];
  delete _0x949e38["dataset"]["credentialProvider"];
  delete _0x949e38["dataset"]["credentialField"];
  delete _0x949e38["dataset"]["credentialKeyType"];
  delete _0x949e38['dataset']["credentialFieldIds"];
  delete _0x949e38["dataset"]['credentialMessage'];
  delete _0x949e38["dataset"]["credentialResolvedProviderProfileId"];
  delete _0x949e38["dataset"]['credentialStateApplied'];
  delete _0x949e38["dataset"]["credentialHadTitle"];
  delete _0x949e38["dataset"]['credentialOriginalTitle'];
  _0x949e38["querySelector"]?.(CREDENTIAL_BADGE_SELECTOR)?.['remove']?.();
}
function markMenuItemCredentialMissing(_0xf595b1, _0xfdaa9e, _0x443ee3) {
  _0xf595b1["dataset"]["credentialStateApplied"] = 'true';
  _0xf595b1["dataset"]["credentialHadTitle"] = String(_0xf595b1["hasAttribute"]?.("title"));
  _0xf595b1["dataset"]['credentialOriginalTitle'] = _0xf595b1['getAttribute']?.("title") || '';
  _0xf595b1["classList"]?.["add"]("needs-model-credential");
  const _0x787bc8 = _0xfdaa9e["requirementType"] !== "cliLogin";
  _0x787bc8 && _0xf595b1["classList"]?.['add']('needs-model-api-authorization');
  _0xf595b1['dataset']["credentialMissing"] = "true";
  _0xf595b1["dataset"]["credentialProvider"] = _0xfdaa9e["configProviderId"] || _0xfdaa9e["providerId"];
  _0xf595b1['dataset']["credentialField"] = _0xfdaa9e["credentialField"];
  _0xf595b1["dataset"]['credentialKeyType'] = _0xfdaa9e['keyType'] || '';
  _0xf595b1["dataset"]['credentialFieldIds'] = JSON['stringify'](_0xfdaa9e["fieldIds"] || []);
  _0xf595b1['dataset']["credentialMessage"] = _0xfdaa9e["message"];
  _0xf595b1["setAttribute"]?.("title", _0xfdaa9e['message']);
  const _0x7b08b5 = _0x443ee3?.["createElement"]?.("span");
  if (!_0x7b08b5) {
    return;
  }
  _0x7b08b5["className"] = "floating-menu-badge floating-menu-badge-warning model-credential-badge";
  _0x7b08b5["dataset"]['modelCredentialBadge'] = "true";
  _0x7b08b5["textContent"] = t("settings.apiInput.readiness.requiredShort");
  _0xf595b1["appendChild"]?.(_0x7b08b5);
}
function getMenuItemCredentialStateSignature(_0x4e7028, _0x3d7890) {
  return JSON["stringify"]([_0x3d7890 || '', _0x4e7028?.['status'] || '', _0x4e7028?.["reason"] || '', _0x4e7028?.["requirementType"] || '', _0x4e7028?.["configProviderId"] || _0x4e7028?.["providerId"] || '', _0x4e7028?.["credentialField"] || '', _0x4e7028?.["keyType"] || '', _0x4e7028?.["fieldIds"] || [], _0x4e7028?.["message"] || '', t("settings.apiInput.readiness.requiredShort")]);
}
function hasExpectedMenuItemCredentialState(_0x33d49e, _0x2d4be7) {
  const _0x8a9e40 = _0x2d4be7?.["status"] === 'missing';
  const _0x36e772 = _0x33d49e['classList']?.["contains"]?.("needs-model-credential") === !![];
  const _0x2f1204 = Boolean(_0x33d49e["querySelector"]?.(CREDENTIAL_BADGE_SELECTOR));
  return _0x8a9e40 ? _0x36e772 && _0x2f1204 : !_0x36e772 && !_0x2f1204;
}
function applyMenuItemCredentialState(_0x2a405c, _0x30c982, _0x28951f, _0x403f82) {
  const _0x23fc27 = getMenuItemCredentialStateSignature(_0x30c982, _0x28951f);
  if (MODEL_CREDENTIAL_ITEM_SYNC_STATES["get"](_0x2a405c) === _0x23fc27 && hasExpectedMenuItemCredentialState(_0x2a405c, _0x30c982)) {
    return;
  }
  clearMenuItemCredentialState(_0x2a405c);
  _0x28951f && (_0x2a405c["dataset"]['credentialResolvedProviderProfileId'] = _0x28951f);
  _0x30c982?.["status"] === 'missing' && markMenuItemCredentialMissing(_0x2a405c, _0x30c982, _0x403f82);
  MODEL_CREDENTIAL_ITEM_SYNC_STATES["set"](_0x2a405c, _0x23fc27);
}
function getMenuItemProviderProfileId(_0x155d80, _0x28764c, _0x2bf5e5, _0x243b18, _0x5d9325) {
  const _0x226beb = _0x5d9325 !== undefined ? _0x5d9325 : _0x28764c["getProviderProfileId"]?.({
    'item': _0x155d80,
    'modelId': _0x2bf5e5,
    'providerId': _0x243b18
  });
  const _0x1b15e3 = _0x226beb || _0x155d80["dataset"]?.["providerProfileId"] || '';
  const _0x458b64 = getModelProviderProfileIds(_0x2bf5e5);
  if (_0x458b64["length"] === 0x0) {
    return _0x1b15e3;
  }
  if (_0x458b64["length"] === 0x1) {
    return _0x458b64[0x0];
  }
  return resolveReadyModelProviderProfileId(_0x2bf5e5, _0x1b15e3, _0x4a7f93 => {
    const _0x328aa8 = getModelGenerationReadiness({
      'modelId': _0x2bf5e5,
      'provider': _0x243b18,
      'providerProfileId': _0x4a7f93
    });
    if (_0x328aa8["status"] === "loading") {
      return null;
    }
    return _0x328aa8["ready"];
  });
}
function getMenuCredentialSyncDescriptor(_0x2f41fc, _0x10cbb8) {
  const _0x29207d = [..._0x2f41fc["querySelectorAll"](CREDENTIAL_MENU_ITEM_SELECTOR)];
  const _0x187bd3 = _0x10cbb8["windowObject"] || globalThis['window'];
  const _0x97c622 = getCredentialStatusRevision(_0x187bd3);
  if (_0x97c622 === null) {
    return {
      'cacheKey': null,
      'items': _0x29207d
    };
  }
  const _0x2ee309 = _0x10cbb8["getProviderProfileId"];
  if (typeof _0x2ee309 === "function" && _0x2ee309["length"] > 0x0 && typeof _0x10cbb8["getCredentialSyncKey"] !== 'function') {
    return {
      'cacheKey': null,
      'items': _0x29207d
    };
  }
  let _0x46755b = '';
  let _0x24dcc0;
  try {
    const _0x4a88c1 = _0x2ee309?.();
    _0x46755b = String(_0x4a88c1 || '');
    (typeof _0x2ee309 !== "function" || _0x2ee309["length"] === 0x0) && (_0x24dcc0 = _0x46755b);
  } catch {
    return {
      'cacheKey': null,
      'items': _0x29207d
    };
  }
  const _0x51f1a4 = String(_0x10cbb8["getCredentialSyncKey"]?.() || '');
  const _0x530611 = _0x29207d["map"](_0xd8abe0 => [_0xd8abe0["dataset"]?.['credentialModel'] || '', _0xd8abe0["dataset"]?.["value"] || '', _0xd8abe0["dataset"]?.["provider"] || '', _0xd8abe0["dataset"]?.['providerProfileId'] || '']["join"]('\x1f'))["join"]('\x1e');
  const _0x51e812 = t('settings.apiInput.readiness.requiredShort');
  return {
    'cacheKey': [_0x97c622, _0x46755b, _0x51f1a4, _0x51e812, _0x530611]['join']('\x1d'),
    'items': _0x29207d,
    'sharedProviderProfileId': _0x24dcc0
  };
}
function isSameMenuCredentialSync(_0xfe7e20, _0x51b1f7) {
  return Boolean(_0xfe7e20 && _0xfe7e20["cacheKey"] === _0x51b1f7["cacheKey"] && _0xfe7e20["items"]['length'] === _0x51b1f7['items']["length"] && _0x51b1f7["items"]["every"]((_0x290eb7, _0x165654) => _0xfe7e20["items"][_0x165654] === _0x290eb7));
}
export function syncModelCredentialMenu(_0x24306f, _0x2f2695 = {}) {
  if (!_0x24306f?.["querySelectorAll"]) {
    return;
  }
  const _0x408bff = () => {
    const _0x3ec1a0 = _0x2f2695["documentObject"] || globalThis["document"];
    const _0x191658 = getMenuCredentialSyncDescriptor(_0x24306f, _0x2f2695);
    const _0x37b9e6 = MODEL_CREDENTIAL_MENU_SYNC_STATES['get'](_0x24306f);
    if (_0x191658["cacheKey"] !== null && isSameMenuCredentialSync(_0x37b9e6, _0x191658)) {
      return _0x37b9e6['promise'];
    }
    const _0x3cc775 = {
      'cacheKey': _0x191658["cacheKey"],
      'items': _0x191658["items"],
      'promise': null
    };
    _0x191658["cacheKey"] !== null ? MODEL_CREDENTIAL_MENU_SYNC_STATES["set"](_0x24306f, _0x3cc775) : MODEL_CREDENTIAL_MENU_SYNC_STATES["delete"](_0x24306f);
    const _0x33a441 = () => _0x191658["cacheKey"] === null || MODEL_CREDENTIAL_MENU_SYNC_STATES["get"](_0x24306f) === _0x3cc775;
    _0x3cc775["promise"] = Promise["resolve"]()["then"](() => Promise["all"](_0x191658["items"]["map"](async _0x1c30ee => {
      if (!_0x33a441()) {
        return;
      }
      const {
        modelId: _0x5bf4ea,
        providerId: _0x1af587
      } = getMenuItemCredentialContext(_0x1c30ee);
      const _0xdd6f47 = {
        'modelId': _0x5bf4ea,
        'provider': _0x1af587,
        'providerProfileId': getMenuItemProviderProfileId(_0x1c30ee, _0x2f2695, _0x5bf4ea, _0x1af587, _0x191658["sharedProviderProfileId"])
      };
      let _0x5ab359 = getModelGenerationReadiness(_0xdd6f47);
      _0x5ab359["reason"] === "cli-status-loading" && (_0x5ab359 = await ensureModelGenerationReadiness(_0xdd6f47)["catch"](() => _0x5ab359));
      if (!_0x33a441()) {
        return;
      }
      applyMenuItemCredentialState(_0x1c30ee, _0x5ab359, _0xdd6f47["providerProfileId"], _0x3ec1a0);
    })));
    return _0x3cc775['promise'];
  };
  if (isApiConfigLoaded()) {
    return _0x408bff();
  }
  return ensureConfig()['catch'](() => {})["then"](_0x408bff);
}
export function bindModelCredentialMenu(_0x85a61, _0x55d79f = {}) {
  if (!_0x85a61?.["addEventListener"]) {
    return () => {};
  }
  const _0x16027a = _0x55d79f["windowObject"] || globalThis["window"];
  getCredentialStatusRevision(_0x16027a);
  const _0x4b1e7c = () => {
    void syncModelCredentialMenu(_0x85a61, _0x55d79f);
  };
  const _0x43afc7 = _0x4080b4 => {
    const _0x5bd0b7 = _0x4080b4["target"]?.["closest"]?.(CREDENTIAL_MENU_ITEM_SELECTOR);
    if (!_0x5bd0b7 || !_0x85a61["contains"]?.(_0x5bd0b7)) {
      return;
    }
    const {
      modelId: _0x9fce46,
      providerId: _0xaf5fd1
    } = getMenuItemCredentialContext(_0x5bd0b7);
    const _0x4400b5 = getMenuItemProviderProfileId(_0x5bd0b7, _0x55d79f, _0x9fce46, _0xaf5fd1);
    _0x4400b5 && (_0x5bd0b7['dataset']["credentialResolvedProviderProfileId"] = _0x4400b5);
    const _0x1dbafe = getModelGenerationReadiness({
      'modelId': _0x9fce46,
      'provider': _0xaf5fd1,
      'providerProfileId': _0x4400b5
    });
    if (_0x1dbafe['status'] !== "missing") {
      return;
    }
    _0x4080b4["preventDefault"]?.();
    _0x4080b4['stopImmediatePropagation']?.();
    _0x4080b4["stopPropagation"]?.();
    showMissingCredential(_0x1dbafe);
  };
  _0x85a61['addEventListener']('click', _0x43afc7, !![]);
  const _0x3e09f3 = _0x55d79f["listenConfigChanges"] === ![] ? () => {} : bindModelCredentialStatusEvents(_0x4b1e7c, _0x16027a);
  _0x4b1e7c();
  return () => {
    _0x85a61['removeEventListener']?.('click', _0x43afc7, !![]);
    _0x3e09f3();
  };
}