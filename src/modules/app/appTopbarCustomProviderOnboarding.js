import { openExternalLink } from '../../services/externalLinkService.js';
import { t } from '../../i18n/index.js';
import { registerManifestBundle, unregisterManifestBundle } from '../../manifests/index.js';
import { trackRuntimeManifestLoad } from '../../manifests/runtimeManifestReadiness.js';
import { CUSTOM_PROVIDER_VIP_MODEL_ID } from '../subscriptionAccess.js';
import { applyCustomProviderModelSelectionState, captureCustomProviderModelSelectionScroll, getCustomProviderModelActionState, getCustomProviderModelsNeedingVerification, getCustomProviderSaveStatus, getRememberedCustomProviderConfigs, handleCustomProviderResultWheel, isCustomProviderAccessAllowed, isCustomProviderModelCapabilityRecognized, mergeCustomProviderDiscoveryCapabilities, mergeCustomProviderRecognizedProfiles, resolveCustomProviderDocumentationFailureKey, restoreCustomProviderModelSelectionScroll, scrollCustomProviderModelListFromWheel, stabilizeCustomProviderEditorListHeight } from './appTopbarCustomProviderPolicy.js';
import { createCustomProviderEditorShell, appendCustomProviderDiscoverySource } from './appTopbarCustomProviderPresentation.js';
import { createProviderStatusTooltipController } from './providerStatusTooltipController.js';
const PROVIDER_TEST_STATUS_CLASSES = ["settings-provider-status--testing", 'settings-provider-status--success', "settings-provider-status--partial", "settings-provider-status--danger", "settings-provider-status--configured", "settings-provider-status--unconfigured"];
const CUSTOM_PROVIDER_SELECTABLE_KINDS = ["text", "image", "video", "audio"];
const CUSTOM_PROVIDER_FILTER_KINDS = ["all", ...CUSTOM_PROVIDER_SELECTABLE_KINDS, "unknown"];
const CUSTOM_PROVIDER_DOCUMENTATION_EXTENSIONS = new Set([".md", ".txt", ".json", ".yaml", ".yml", ".html", ".htm"]);
const CUSTOM_PROVIDER_DOCUMENTATION_MAX_BYTES = 0x200000;
const CUSTOM_PROVIDER_KIND_LABEL_KEYS = {
  'all': "kindAll",
  'text': "kindText",
  'image': "kindImage",
  'video': "kindVideo",
  'audio': 'kindAudio',
  'embedding': "kindEmbedding",
  'unknown': "kindUnknown"
};
function trTemplate(_0x311da7, _0x1bf6e3 = {}) {
  let _0x5d6c51 = t(_0x311da7);
  Object['entries'](_0x1bf6e3 || {})["forEach"](([_0x2ad697, _0xb8bbf9]) => {
    _0x5d6c51 = _0x5d6c51["split"]('{' + _0x2ad697 + '}')["join"](String(_0xb8bbf9 ?? ''));
  });
  return _0x5d6c51;
}
function trApiInput(_0x4cf159, _0x188c7c = {}) {
  return trTemplate("settings.apiInput." + _0x4cf159, _0x188c7c);
}
// api/customProviderDiscoveryApi.js 的每个函数都经 apiBase.request 再包一层，返回
// {success, data:<真实负载>}；这里统一拆一层，否则发现列表恒为空、保存恒失败。
function unwrapCustomProviderResult(_0x3c93ad) {
  if (_0x3c93ad && typeof _0x3c93ad === 'object' && _0x3c93ad["success"] !== undefined && _0x3c93ad["data"] !== undefined) {
    return _0x3c93ad["data"] || {};
  }
  return _0x3c93ad || {};
}
function trCustomProvider(_0x22975b, _0x3a4d15 = {}) {
  return trApiInput("customProvider." + _0x22975b, _0x3a4d15);
}
function markNonLoginTextInput(_0x331dd8) {
  if (!_0x331dd8) {
    return;
  }
  _0x331dd8["autocomplete"] = "off";
  _0x331dd8["setAttribute"]("autocomplete", 'off');
  _0x331dd8['setAttribute']("autocapitalize", "off");
  _0x331dd8["setAttribute"]("spellcheck", 'false');
  _0x331dd8["setAttribute"]('data-form-type', "other");
}
function markApiSecretInput(_0x2e32df) {
  if (!_0x2e32df) {
    return;
  }
  _0x2e32df["autocomplete"] = "new-password";
  _0x2e32df["setAttribute"]("autocomplete", "new-password");
  _0x2e32df["setAttribute"]('autocapitalize', "off");
  _0x2e32df["setAttribute"]("spellcheck", "false");
  _0x2e32df['setAttribute']("data-lpignore", "true");
  _0x2e32df["setAttribute"]("data-1p-ignore", "true");
  _0x2e32df["setAttribute"]("data-form-type", "other");
}
export function createCustomProviderOnboardingController({
  store: _0x3a309c,
  saveApiConfigToServer: _0x580e8b,
  discoverCustomProvider: _0x280dbb,
  analyzeCustomProviderDocumentation: _0x1d89c6,
  buildCustomProviderManifestDraft: _0x4fbe39,
  validateCustomProviderManifestDraft: _0x312285,
  saveCustomProviderManifestBundle: _0x3efd0d,
  listCustomProviderManifestBundles: _0x2f7f81,
  deleteCustomProviderManifestBundle: _0x32b64c,
  refreshManifestModelNodeUis: _0x5149ec,
  showError = null,
  syncModelServiceReadinessSummary = () => {},
  getConfigSnapshot = () => ({}),
  onConfigSnapshotChange = () => {},
  documentObject = globalThis["document"],
  windowObject = globalThis["window"]
} = {}) {
  const _0x2b3e46 = documentObject;
  const _0xc7b3c8 = windowObject;
  let _0x2854cd = getConfigSnapshot() || {};
  const _0x2ffe8e = createProviderStatusTooltipController();
  const _0xbf840e = new Map();
  function _0x576ab5(_0x119f6e) {
    _0x2854cd = _0x119f6e || {};
    onConfigSnapshotChange(_0x2854cd);
  }
  function _0x182af1() {
    return {
      'cardEl': _0x2b3e46["getElementById"]("customProviderDiscoveryCard"),
      'statusEl': _0x2b3e46['getElementById']("customProviderDiscoveryStatus"),
      'editorListEl': _0x2b3e46['getElementById']("customProviderEditors"),
      'addBtnEl': _0x2b3e46["getElementById"]("btnCustomProviderAdd"),
      'editorEl': _0x2b3e46["getElementById"]("customProviderEditor")
    };
  }
  const _0xda3e2c = {
    'activeEditorId': "custom-provider-editor-1",
    'editorSequence': 0x1,
    'editorStates': new Map()
  };
  function _0x35b743() {
    const {
      editorListEl: _0x485081
    } = _0x182af1();
    return Array["from"](_0x485081?.["querySelectorAll"]?.("[data-custom-provider-editor-id]") || []);
  }
  function _0x558f19(_0x47d1c3) {
    return {
      'baseUrlEl': _0x47d1c3?.["querySelector"]?.('[data-custom-provider-base-url]') || _0x2b3e46["getElementById"]("customProviderBaseUrl"),
      'apiKeyEl': _0x47d1c3?.['querySelector']?.("[data-custom-provider-api-key]") || _0x2b3e46["getElementById"]("customProviderApiKey"),
      'documentationUrlEl': _0x47d1c3?.["querySelector"]?.("[data-custom-provider-documentation-url]") || _0x2b3e46["getElementById"]("customProviderDocumentationUrl"),
      'documentationFileEl': _0x47d1c3?.["querySelector"]?.("[data-custom-provider-documentation-file]") || _0x2b3e46['querySelector']("#customProviderDiscoveryCard [data-custom-provider-documentation-file]")
    };
  }
  function _0xdab9ee(_0x1d6f70) {
    return String(_0x1d6f70?.["dataset"]?.["customProviderEditorId"] || '')["trim"]();
  }
  function _0x3fbd69(_0x3e31a8) {
    const _0x4e0dd0 = _0xdab9ee(_0x3e31a8);
    if (!_0x4e0dd0) {
      return {
        'discovery': null,
        'provider': null,
        'activeKindFilter': "all",
        'selectedModelKeys': new Set(),
        'assignedModelKinds': new Map(),
        'kindToolbarOpenKeys': new Set(),
        'verifyingModelKeys': new Set(),
        'isAddingModels': ![],
        'documentationDocument': null,
        'titleText': '',
        'titleManuallyEdited': ![]
      };
    }
    !_0xda3e2c["editorStates"]["has"](_0x4e0dd0) && _0xda3e2c["editorStates"]["set"](_0x4e0dd0, {
      'discovery': null,
      'provider': null,
      'activeKindFilter': "all",
      'selectedModelKeys': new Set(),
      'assignedModelKinds': new Map(),
      'kindToolbarOpenKeys': new Set(),
      'verifyingModelKeys': new Set(),
      'isAddingModels': ![],
      'documentationDocument': null,
      'titleText': '',
      'titleManuallyEdited': ![]
    });
    return _0xda3e2c["editorStates"]["get"](_0x4e0dd0);
  }
  function _0x4edf5d(_0x3620fd) {
    return {
      'bodyEl': _0x3620fd?.["querySelector"]?.("[data-custom-provider-editor-body]"),
      'tabBtnEl': _0x3620fd?.["querySelector"]?.('[data-custom-provider-editor-tab]'),
      'deleteBtnEl': _0x3620fd?.["querySelector"]?.("[data-custom-provider-delete]"),
      'discoverBtnEl': _0x3620fd?.["querySelector"]?.('[data-custom-provider-discover]'),
      'resultEl': _0x3620fd?.["querySelector"]?.("[data-custom-provider-result]"),
      'resultInnerEl': _0x3620fd?.["querySelector"]?.("[data-custom-provider-result-inner]"),
      'actionsEl': _0x3620fd?.["querySelector"]?.("[data-custom-provider-actions]"),
      'saveSelectedBtnEl': _0x3620fd?.["querySelector"]?.('[data-custom-provider-save-selected]'),
      'verifyParamsBtnEl': _0x3620fd?.["querySelector"]?.("[data-custom-provider-verify-params]")
    };
  }
  function _0x4e8955(_0x296cee = null) {
    const _0x313eef = _0xdab9ee(_0x296cee) || _0xda3e2c["activeEditorId"];
    _0x35b743()["forEach"](_0x54ea48 => {
      const _0x3fd1c7 = _0xdab9ee(_0x54ea48) === _0x313eef;
      const {
        bodyEl: _0x45c9e5,
        tabBtnEl: _0x118f79
      } = _0x4edf5d(_0x54ea48);
      _0x54ea48['classList']['toggle']("is-active", _0x3fd1c7);
      _0x45c9e5 && (_0x45c9e5["hidden"] = !_0x3fd1c7, _0x45c9e5["setAttribute"]("aria-hidden", _0x3fd1c7 ? "false" : "true"));
      _0x118f79 && _0x118f79["setAttribute"]("aria-selected", _0x3fd1c7 ? "true" : "false");
    });
  }
  function _0x2675fa(_0xc9f851, _0x12b2e7 = {}) {
    if (!_0xc9f851) {
      return;
    }
    const _0x216b6d = String(_0xc9f851["dataset"]["customProviderEditorId"] || '')["trim"]();
    if (!_0x216b6d) {
      return;
    }
    const _0x45083a = _0xda3e2c["activeEditorId"] !== _0x216b6d;
    const {
      editorListEl: _0x10fd9d
    } = _0x182af1();
    stabilizeCustomProviderEditorListHeight(_0x10fd9d);
    _0xda3e2c["activeEditorId"] = _0x216b6d;
    _0x4e8955(_0xc9f851);
    stabilizeCustomProviderEditorListHeight(_0x10fd9d);
    if (_0x45083a || _0x12b2e7['clearStatus']) {
      _0x1a03b8('', '');
    }
  }
  function _0x510f24() {
    const _0x42aca1 = _0x35b743();
    const _0x597cff = _0x42aca1["find"](_0x24bb46 => String(_0x24bb46['dataset']["customProviderEditorId"] || '') === _0xda3e2c["activeEditorId"]);
    return _0x597cff || _0x42aca1['find'](_0x2c2c60 => _0x2c2c60["classList"]["contains"]("is-active")) || _0x42aca1[0x0] || null;
  }
  function _0x52cffc() {
    return _0x558f19(_0x510f24());
  }
  function _0x2770dd(_0x591e67) {
    const _0x3dc967 = String(_0x591e67 || '')["trim"]();
    return _0x3dc967 ? "custom-provider:" + _0x3dc967 : '';
  }
  function _0x1fc148(_0x3a8387) {
    return _0xbf840e["get"](_0x2770dd(_0x3a8387)) || null;
  }
  function _0x4e8e31(_0x4e83c9) {
    const _0x330746 = _0x3fbd69(_0x4e83c9);
    const _0x566761 = String(_0x330746["provider"]?.["providerId"] || '')['trim']();
    if (_0x566761) {
      return _0x566761;
    }
    return String(_0x2db9fa(_0x4e83c9)["providerId"] || '')["trim"]();
  }
  function _0x1574fc(_0x59b6a0) {
    const _0x144925 = _0x4e8e31(_0x59b6a0);
    if (!_0x144925) {
      return ![];
    }
    const _0x4fecd1 = _0x3fbd69(_0x59b6a0);
    const _0x1aba7a = _0x2770dd(_0x144925);
    return !!_0x4fecd1["provider"] || _0xbf840e["has"](_0x1aba7a);
  }
  function _0xc05002(_0x2128f4) {
    return String(_0x2128f4 || '')["trim"]()["replace"](/\s+/g, '\x20');
  }
  function _0x49b66c(_0x5203eb) {
    const _0x41b423 = _0x35b743();
    const _0x3cb5a5 = Math["max"](0x0, _0x41b423["indexOf"](_0x5203eb));
    return trCustomProvider("providerDraftTitle", {
      'index': _0x3cb5a5 + 0x1
    });
  }
  function _0x6b9c13(_0x1faa2a) {
    const _0x112550 = _0x3fbd69(_0x1faa2a);
    return _0xc05002(_0x112550["titleText"]) || _0x49b66c(_0x1faa2a);
  }
  function _0x3a5a33(_0x5424ff) {
    const _0x6869a0 = _0x5424ff?.["querySelector"]?.("[data-custom-provider-editor-title]");
    const _0xc09041 = _0x5424ff?.['querySelector']?.("[data-custom-provider-editor-tab]");
    const _0x9ceaf2 = _0x6b9c13(_0x5424ff);
    _0x6869a0 && (_0x6869a0["removeAttribute"]("data-i18n"), _0x6869a0["textContent"] = _0x9ceaf2);
    _0xc09041?.["setAttribute"]("aria-label", _0x9ceaf2);
  }
  function _0xa3131c() {
    _0x35b743()["forEach"](_0x3ba677 => {
      _0x3a5a33(_0x3ba677);
    });
  }
  function _0x1841dc(_0x38cb7d, _0x27d6f4, _0x274acc = {}) {
    if (!_0x38cb7d) {
      return;
    }
    const _0xe6f363 = _0x3fbd69(_0x38cb7d);
    const _0x198a3f = _0xc05002(_0x27d6f4);
    _0xe6f363["titleText"] = _0x198a3f;
    if (_0x274acc["manual"] === !![]) {
      _0xe6f363["titleManuallyEdited"] = !![];
    } else {
      _0x274acc['manual'] === ![] && (_0xe6f363['titleManuallyEdited'] = ![]);
    }
    _0x3a5a33(_0x38cb7d);
  }
  function _0x1ffa3a(_0x1a5e46) {
    if (!_0x1a5e46) {
      return;
    }
    const _0x59da06 = _0x3fbd69(_0x1a5e46);
    _0x59da06['titleText'] = '';
    _0x59da06['titleManuallyEdited'] = ![];
    _0x3a5a33(_0x1a5e46);
  }
  function _0x56a95d(_0x347543, _0x5c6f73) {
    if (!_0x347543) {
      return;
    }
    const _0x186fed = _0x3fbd69(_0x347543);
    if (_0x186fed['titleManuallyEdited']) {
      return;
    }
    const _0x209aea = _0xc05002(_0x5c6f73);
    if (!_0x209aea) {
      return;
    }
    _0x186fed["titleText"] = _0x209aea;
    _0x3a5a33(_0x347543);
  }
  function _0x484f28(_0x5326ad) {
    if (!_0x5326ad) {
      return;
    }
    const {
      tabBtnEl: _0xb049c6,
      deleteBtnEl: _0x378810
    } = _0x4edf5d(_0x5326ad);
    if (!_0xb049c6 || _0x5326ad["querySelector"]('[data-custom-provider-editor-title-input]')) {
      return;
    }
    const _0x37ba2d = _0x3fbd69(_0x5326ad);
    const _0x2bb3ee = _0x37ba2d['titleText'];
    const _0x22a420 = !!_0x37ba2d["titleManuallyEdited"];
    const _0xaf8271 = _0x6b9c13(_0x5326ad);
    const _0x4b32ad = _0x2b3e46["createElement"]("input");
    _0x4b32ad['type'] = "text";
    _0x4b32ad['className'] = "custom-provider-editor-title-input";
    _0x4b32ad['dataset']["customProviderEditorTitleInput"] = '';
    _0x4b32ad["value"] = _0xaf8271;
    _0x4b32ad['setAttribute']("aria-label", _0xaf8271);
    let _0x29b1ac = ![];
    const _0x51ab28 = _0x104d47 => {
      if (_0x29b1ac) {
        return;
      }
      _0x29b1ac = !![];
      _0x4b32ad['removeEventListener']('blur', _0x35b760);
      _0x4b32ad['removeEventListener']("keydown", _0x5731b8);
      if (_0x104d47) {
        const _0x200d24 = _0xc05002(_0x4b32ad["value"]);
        _0x200d24 ? _0x22a420 || _0x200d24 !== _0xaf8271 ? _0x1841dc(_0x5326ad, _0x200d24, {
          'manual': !![]
        }) : (_0x37ba2d["titleText"] = _0x2bb3ee, _0x37ba2d["titleManuallyEdited"] = _0x22a420, _0x3a5a33(_0x5326ad)) : (_0x37ba2d["titleText"] = _0x2bb3ee, _0x37ba2d["titleManuallyEdited"] = _0x22a420, _0x3a5a33(_0x5326ad));
      } else {
        _0x37ba2d["titleText"] = _0x2bb3ee;
        _0x37ba2d["titleManuallyEdited"] = _0x22a420;
        _0x3a5a33(_0x5326ad);
      }
      _0xb049c6["hidden"] = ![];
      _0x4b32ad["remove"]();
      _0xb049c6["focus"]?.();
    };
    function _0x35b760() {
      _0x51ab28(!![]);
    }
    function _0x5731b8(_0x2bf5ec) {
      if (_0x2bf5ec['key'] === "Enter") {
        _0x2bf5ec["preventDefault"]();
        _0x51ab28(!![]);
      } else {
        _0x2bf5ec["key"] === "Escape" && (_0x2bf5ec["preventDefault"](), _0x51ab28(![]));
      }
    }
    _0x4b32ad["addEventListener"]('blur', _0x35b760);
    _0x4b32ad["addEventListener"]("keydown", _0x5731b8);
    _0xb049c6["hidden"] = !![];
    _0xb049c6["parentElement"]?.["insertBefore"](_0x4b32ad, _0x378810 || _0xb049c6["nextSibling"]);
    _0x4b32ad['focus']?.();
    _0x4b32ad['select']?.();
  }
  function _0xe18797() {
    const _0x3e012a = _0x35b743();
    _0x3e012a["forEach"](_0x4c2eac => {
      const {
        deleteBtnEl: _0x2015d7
      } = _0x4edf5d(_0x4c2eac);
      if (_0x2015d7) {
        _0x2015d7['hidden'] = _0x3e012a["length"] <= 0x1 && !_0x1574fc(_0x4c2eac);
      }
    });
  }
  function _0x1ec207(_0x34555c) {
    const _0x4e1b7f = _0x35b743();
    if (!_0x34555c || _0x4e1b7f["length"] <= 0x1) {
      return;
    }
    const _0x31c7f9 = _0xdab9ee(_0x34555c);
    const _0x12baee = _0x4e1b7f['indexOf'](_0x34555c);
    const _0x388989 = _0x4e1b7f[_0x12baee + 0x1] || _0x4e1b7f[_0x12baee - 0x1] || null;
    _0xda3e2c["editorStates"]["delete"](_0x31c7f9);
    _0x34555c['remove']();
    _0xa3131c();
    _0xe18797();
    _0x388989 && _0x2675fa(_0x388989, {
      'clearStatus': !![]
    });
  }
  async function _0x5b9ba3(_0x2f7076) {
    if (typeof _0x580e8b !== "function") {
      return;
    }
    const _0x4bfcc3 = String(_0x2f7076 || '')["trim"]();
    if (!_0x4bfcc3 || !_0x2854cd?.["providers"]?.[_0x4bfcc3]) {
      return;
    }
    const _0xaeb9a0 = {
      ...(_0x2854cd["providers"] || {})
    };
    delete _0xaeb9a0[_0x4bfcc3];
    const _0x39d22e = {
      ...(_0x2854cd || {}),
      'providers': _0xaeb9a0
    };
    await _0x580e8b(_0x39d22e);
    _0x576ab5(_0x39d22e);
    syncModelServiceReadinessSummary(_0x39d22e);
    _0x5149ec?.();
  }
  async function _0x5ab098(_0x1e9d4c) {
    const _0x576b41 = String(_0x1e9d4c || '')['trim']();
    if (!_0x576b41) {
      return;
    }
    const _0xeb88cd = _0x2770dd(_0x576b41);
    const _0x185b74 = _0xbf840e["get"](_0xeb88cd);
    if (typeof _0x32b64c === "function" && _0xeb88cd) {
      try {
        await _0x32b64c(_0xeb88cd);
      } catch (_0x5bb623) {
        const _0x3da390 = String(_0x5bb623?.["message"] || _0x5bb623 || '')["toLowerCase"]();
        if (!_0x3da390["includes"]('not\x20found') && !_0x3da390["includes"]("404")) {
          throw _0x5bb623;
        }
      }
    }
    if (_0x185b74) {
      try {
        unregisterManifestBundle(_0x185b74);
      } catch (_0x1ecc65) {
        console["warn"]("[Custom Provider] unregister deleted bundle failed:", _0x1ecc65);
      }
      _0xbf840e['delete'](_0xeb88cd);
    }
    await _0x5b9ba3(_0x576b41);
  }
  function _0x5efb21(_0x5a5105) {
    const {
      baseUrlEl: _0x2f5be7,
      apiKeyEl: _0x5a27e0,
      documentationUrlEl: _0x4a2f90,
      documentationFileEl: _0x164746
    } = _0x558f19(_0x5a5105);
    if (_0x2f5be7) {
      _0x2f5be7['value'] = '';
    }
    if (_0x5a27e0) {
      _0x5a27e0["value"] = '';
    }
    if (_0x4a2f90) {
      _0x4a2f90["value"] = '';
    }
    if (_0x164746) {
      _0x164746["value"] = '';
    }
    _0x3fbd69(_0x5a5105)['documentationDocument'] = null;
    _0x5a5105?.["dataset"] && (delete _0x5a5105["dataset"]["customProviderProviderId"], delete _0x5a5105['dataset']['customProviderSyncedBundle']);
    _0x5e3c22(_0x5a5105);
    _0x1ffa3a(_0x5a5105);
    _0x1a03b8('', '');
  }
  async function _0x1aa61d(_0x5cd3c5, _0x18d6ae) {
    if (!_0x5cd3c5) {
      return;
    }
    const _0x7bf356 = _0x1574fc(_0x5cd3c5);
    const _0x59d296 = _0x7bf356 ? _0x4e8e31(_0x5cd3c5) : '';
    if (_0x18d6ae) {
      _0x18d6ae["disabled"] = !![];
    }
    try {
      _0x7bf356 && (await _0x5ab098(_0x59d296));
      const _0x5c3ed6 = _0x35b743();
      _0x5c3ed6["length"] <= 0x1 ? (_0x5efb21(_0x5cd3c5), _0xa3131c(), _0xe18797(), _0x2675fa(_0x5cd3c5, {
        'clearStatus': !![]
      })) : _0x1ec207(_0x5cd3c5);
      if (_0x59d296) {
        const _0x210f77 = trCustomProvider("deleteSuccess");
        const _0x603960 = getRememberedCustomProviderConfigs(_0x2854cd?.["providers"])["length"] ? "configured" : 'unconfigured';
        _0x1a03b8(_0x603960, trApiInput("statuses." + _0x603960));
        _0xc7b3c8['showToast']?.(_0x210f77, "success");
      }
    } catch (_0x3dd512) {
      const _0x24ca9c = trCustomProvider("deleteFailed", {
        'error': _0x3dd512?.["message"] || trApiInput('diagnostics.unknownError')
      });
      _0x1a03b8("danger", trApiInput("diagnostics.failed"), _0x24ca9c);
      _0xc7b3c8["showToast"]?.(_0x24ca9c, "error", 0x2328);
    } finally {
      if (_0x18d6ae) {
        _0x18d6ae["disabled"] = ![];
      }
    }
  }
  function _0xe7c48a() {
    const _0x127311 = 'custom-provider-editor-' + (_0xda3e2c["editorSequence"] + 0x1);
    _0xda3e2c['editorSequence'] += 0x1;
    const _0xf458c = createCustomProviderEditorShell({
      'documentObject': _0x2b3e46,
      'editorId': _0x127311,
      'tutorialLabel': trCustomProvider("tutorial"),
      'discoverLabel': trCustomProvider("discover"),
      'deleteAriaLabel': trCustomProvider('deleteProviderDraft')
    });
    const _0x2bfa49 = _0x2b3e46["createElement"]("div");
    _0x2bfa49['className'] = 'custom-provider-editor-item-body';
    _0x2bfa49["dataset"]["customProviderEditorBody"] = '';
    _0x2bfa49["hidden"] = !![];
    _0x2bfa49["setAttribute"]("aria-hidden", 'true');
    const _0x7d6f9d = _0x2b3e46["createElement"]("div");
    _0x7d6f9d['className'] = 'custom-provider-discovery-grid';
    const _0x4703da = _0x2b3e46["createElement"]('div');
    _0x4703da["className"] = 'custom-provider-discovery-field\x20custom-provider-discovery-field--wide';
    const _0x3efda4 = _0x330d5c('settings-label', trCustomProvider("baseUrl"));
    const _0x4f3848 = _0x2b3e46["createElement"]('input');
    _0x4f3848["type"] = "text";
    _0x4f3848["className"] = 'settings-input';
    _0x4f3848["placeholder"] = trCustomProvider("baseUrlPlaceholder");
    _0x4f3848["dataset"]["customProviderBaseUrl"] = '';
    markNonLoginTextInput(_0x4f3848);
    _0x4703da["append"](_0x3efda4, _0x4f3848);
    const _0x58370d = _0x2b3e46["createElement"]("div");
    _0x58370d['className'] = "custom-provider-discovery-field custom-provider-discovery-field--wide";
    const _0xf053df = _0x330d5c("settings-label", trCustomProvider('apiKey'));
    const _0x2220d8 = _0x2b3e46['createElement']('input');
    _0x2220d8["type"] = "password";
    _0x2220d8['className'] = "settings-input";
    _0x2220d8["placeholder"] = trCustomProvider("apiKeyPlaceholder");
    _0x2220d8["dataset"]["customProviderApiKey"] = '';
    markApiSecretInput(_0x2220d8);
    _0x58370d["append"](_0xf053df, _0x2220d8);
    const _0x551c3c = _0x2b3e46['createElement']("div");
    _0x551c3c["className"] = 'custom-provider-discovery-field\x20custom-provider-discovery-field--wide';
    const _0x5c8a04 = _0x330d5c("settings-label", trCustomProvider("documentationUrl"));
    _0x5c8a04['append'](_0x1f0031(trCustomProvider("documentationAgentHint")));
    const _0x4ce17b = _0x2b3e46["createElement"]("input");
    _0x4ce17b['type'] = "text";
    _0x4ce17b["className"] = "settings-input";
    _0x4ce17b["placeholder"] = trCustomProvider('documentationUrlPlaceholder');
    _0x4ce17b["dataset"]['customProviderDocumentationUrl'] = '';
    markNonLoginTextInput(_0x4ce17b);
    const _0x5c004c = _0x2b3e46["createElement"]("div");
    _0x5c004c["className"] = "custom-provider-documentation-input-row";
    const _0x3c0a77 = _0x2b3e46["createElement"]("button");
    _0x3c0a77["type"] = "button";
    _0x3c0a77["className"] = "settings-save-btn settings-btn-ghost custom-provider-documentation-file-btn";
    _0x3c0a77["dataset"]["customProviderSelectDocument"] = '';
    _0x3c0a77["textContent"] = trCustomProvider("selectDocumentationFile");
    const _0x32b7fa = _0x2b3e46["createElement"]('input');
    _0x32b7fa['type'] = "file";
    _0x32b7fa["hidden"] = !![];
    _0x32b7fa['accept'] = ".md,.txt,.json,.yaml,.yml,.html,.htm";
    _0x32b7fa['dataset']["customProviderDocumentationFile"] = '';
    _0x5c004c["append"](_0x4ce17b, _0x3c0a77, _0x32b7fa);
    _0x551c3c["append"](_0x5c8a04, _0x5c004c);
    _0x7d6f9d["append"](_0x4703da, _0x58370d, _0x551c3c);
    const _0x506dec = _0x2b3e46["createElement"]("div");
    _0x506dec['className'] = 'custom-provider-discovery-result';
    _0x506dec["dataset"]["customProviderResult"] = '';
    _0x506dec['hidden'] = !![];
    _0x506dec['setAttribute']('aria-hidden', "true");
    const _0x1bc707 = _0x2b3e46['createElement']("div");
    _0x1bc707["className"] = "custom-provider-discovery-result-inner";
    _0x1bc707["dataset"]["customProviderResultInner"] = '';
    _0x506dec["append"](_0x1bc707);
    const _0x227860 = _0x2b3e46["createElement"]("div");
    _0x227860["className"] = "custom-provider-discovery-actions";
    _0x227860['dataset']["customProviderActions"] = '';
    _0x227860["hidden"] = !![];
    const _0x4d66cb = _0x2b3e46['createElement']("button");
    _0x4d66cb["type"] = "button";
    _0x4d66cb["className"] = "settings-save-btn settings-btn-ghost settings-api-test-btn";
    _0x4d66cb["dataset"]['customProviderVerifyParams'] = '';
    const _0x35151f = _0x2b3e46['querySelector']("[data-provider-test] .settings-btn-icon")?.["cloneNode"](!![]);
    if (_0x35151f) {
      _0x4d66cb["append"](_0x35151f);
    }
    const _0x6614ae = _0x2b3e46["createElement"]("span");
    _0x6614ae["className"] = "settings-btn-label";
    _0x6614ae["dataset"]["i18n"] = "settings.apiInput.customProvider.verifyParameters";
    _0x6614ae['textContent'] = trCustomProvider('verifyParameters');
    _0x4d66cb["append"](_0x6614ae);
    _0x4d66cb['hidden'] = !![];
    _0x4d66cb["disabled"] = !![];
    const _0x36fb5d = _0x2b3e46["createElement"]("button");
    _0x36fb5d['type'] = "button";
    _0x36fb5d["className"] = 'settings-save-btn';
    _0x36fb5d["dataset"]["customProviderSaveSelected"] = '';
    _0x36fb5d["dataset"]["i18n"] = "settings.apiInput.customProvider.addModels";
    _0x36fb5d['textContent'] = trCustomProvider("addModels");
    _0x36fb5d["hidden"] = !![];
    _0x36fb5d["disabled"] = !![];
    _0x227860["append"](_0x4d66cb, _0x36fb5d);
    _0x2bfa49['append'](_0x7d6f9d, _0x506dec, _0x227860);
    _0xf458c["append"](_0x2bfa49);
    return _0xf458c;
  }
  function _0x52fd72() {
    const _0x3dbb6b = _0x35b743();
    _0x3dbb6b["forEach"]((_0x25b53f, _0x52af7a) => {
      !_0x25b53f["dataset"]["customProviderEditorId"] && (_0x25b53f["dataset"]["customProviderEditorId"] = "custom-provider-editor-" + (_0x52af7a + 0x1));
      const _0x2d8f5a = String(_0x25b53f["dataset"]["customProviderEditorId"] || '')["match"](/(\d+)$/);
      _0x2d8f5a && (_0xda3e2c["editorSequence"] = Math['max'](_0xda3e2c["editorSequence"], Number(_0x2d8f5a[0x1]) || 0x1));
    });
    _0x2675fa(_0x510f24() || _0x3dbb6b[0x0]);
    _0xa3131c();
    _0xe18797();
    _0x4e8955(_0x510f24());
  }
  function _0x52a397(_0x5a639d) {
    const _0x258fdb = String(_0x5a639d || '')["trim"]();
    if (!_0x258fdb) {
      return '';
    }
    if (/^[a-z][a-z0-9+.-]*:\/\//i["test"](_0x258fdb)) {
      return _0x258fdb;
    }
    return "https://" + _0x258fdb;
  }
  function _0x3b7e96(_0x4d2fdd) {
    const _0x3c6163 = _0x52a397(_0x4d2fdd);
    if (!_0x3c6163) {
      return '';
    }
    try {
      return new URL(_0x3c6163)["hostname"]["replace"](/^www\./i, '');
    } catch {
      return String(_0x4d2fdd || '')['trim']()['replace'](/^[a-z][a-z0-9+.-]*:\/\//i, '')['split'](/[/?#]/)[0x0]["replace"](/^www\./i, '');
    }
  }
  function _0x3eb186(_0x11b075) {
    return _0x3b7e96(_0x11b075) || '';
  }
  function _0x3ff081(_0x15589a) {
    const _0x535c6b = (_0x3b7e96(_0x15589a) || String(_0x15589a || '')["trim"]())['toLowerCase']();
    const _0x59c207 = _0x535c6b["replace"](/[^a-z0-9_-]+/g, '_')["replace"](/^_+|_+$/g, '')['replace'](/_{2,}/g, '_');
    const _0x2e3359 = _0x59c207 || "provider";
    return _0x2e3359['startsWith']("custom_") ? _0x2e3359 : 'custom_' + _0x2e3359;
  }
  function _0x35c83c(_0x38778a) {
    const _0x3d9b69 = _0x3fbd69(_0x38778a);
    const _0x2b27d7 = String(_0x3d9b69["provider"]?.['providerId'] || '')['trim']();
    if (_0x2b27d7) {
      return _0x2b27d7;
    }
    const _0x4a1bad = _0x2db9fa(_0x38778a);
    return _0x4a1bad["baseUrl"] ? String(_0x4a1bad['providerId'] || '')["trim"]() : '';
  }
  function _0xeca0cb(_0x4e81e2, _0x3140d3) {
    const _0x6f5d9c = String(_0x3140d3 || '')["trim"]();
    if (!_0x6f5d9c) {
      return ![];
    }
    return _0x35b743()["some"](_0x5a5375 => _0x5a5375 !== _0x4e81e2 && _0x35c83c(_0x5a5375) === _0x6f5d9c);
  }
  function _0x34d05b(_0x1ac226, _0x2256c4) {
    if (!_0xeca0cb(_0x1ac226, _0x2256c4)) {
      return ![];
    }
    const _0x4d5a40 = trCustomProvider("duplicateProviderDomain");
    const {
      baseUrlEl: _0x24220c
    } = _0x558f19(_0x1ac226);
    _0x1a03b8("danger", trApiInput("diagnostics.failed"), _0x4d5a40);
    _0xc7b3c8["showToast"]?.(_0x4d5a40, 'warn', 0x1b58);
    _0x24220c?.["focus"]?.();
    return !![];
  }
  function _0x2880c6(_0x1dd4df) {
    const _0x5d485b = String(_0x1dd4df || 'unknown')["trim"]()['toLowerCase']();
    const _0xa5acd7 = CUSTOM_PROVIDER_KIND_LABEL_KEYS[_0x5d485b] || CUSTOM_PROVIDER_KIND_LABEL_KEYS["unknown"];
    return trCustomProvider(_0xa5acd7);
  }
  function _0x467f83(_0x388eb) {
    return String(_0x388eb || '')['trim']()["toLowerCase"]() === 'documented' ? trCustomProvider("capabilityDocumented") : trCustomProvider('capabilityUnverified');
  }
  function _0x2aa782(_0x940e3c) {
    return String(_0x940e3c || '')['trim']()['toLowerCase']() === "documented" ? trCustomProvider('capabilityDocumentedHint') : trCustomProvider("capabilityUnverifiedHint");
  }
  function _0x1a03b8(_0x463334, _0x20e094, _0x390f51 = '') {
    const {
      statusEl: _0x3e2fe4
    } = _0x182af1();
    if (!_0x3e2fe4) {
      return;
    }
    _0x2ffe8e["bind"](_0x3e2fe4);
    _0x3e2fe4['classList']['remove'](...PROVIDER_TEST_STATUS_CLASSES);
    const _0x5534bf = String(_0x20e094 || '')['trim']();
    if (!_0x5534bf) {
      _0x2ffe8e["hide"](_0x3e2fe4);
      _0x3e2fe4["hidden"] = !![];
      _0x3e2fe4["textContent"] = '';
      delete _0x3e2fe4["dataset"]["detail"];
      _0x3e2fe4["removeAttribute"]('title');
      _0x3e2fe4["removeAttribute"]("aria-label");
      _0x3e2fe4["removeAttribute"]("tabindex");
      _0x3e2fe4["removeAttribute"]("data-provider-test-tooltip");
      return;
    }
    const _0x236a69 = String(_0x463334 || '')["trim"]();
    _0x236a69 && _0x3e2fe4["classList"]["add"]('settings-provider-status--' + _0x236a69);
    _0x3e2fe4["textContent"] = _0x5534bf;
    const _0x4f9c9c = String(_0x390f51 || '')['trim']();
    _0x4f9c9c ? (_0x3e2fe4["dataset"]['detail'] = _0x4f9c9c, _0x3e2fe4["setAttribute"]('data-provider-test-tooltip', _0x4f9c9c), _0x3e2fe4["setAttribute"]("aria-label", _0x4f9c9c), _0x3e2fe4["setAttribute"]("tabindex", '0')) : (_0x2ffe8e["hide"](_0x3e2fe4), delete _0x3e2fe4["dataset"]['detail'], _0x3e2fe4['removeAttribute']("data-provider-test-tooltip"), _0x3e2fe4["removeAttribute"]("aria-label"), _0x3e2fe4["removeAttribute"]('tabindex'));
    _0x3e2fe4["removeAttribute"]("title");
    _0x3e2fe4["hidden"] = ![];
  }
  function _0x50c248(_0x17b30c, _0x320b48) {
    if (!_0x17b30c) {
      return () => {};
    }
    const _0x4f4997 = _0x17b30c['querySelector']?.(".settings-btn-label");
    const _0x17a473 = _0x4f4997?.["textContent"] || _0x17b30c["textContent"];
    _0x17b30c["disabled"] = !![];
    if (_0x4f4997) {
      _0x4f4997["textContent"] = _0x320b48;
    } else {
      _0x17b30c["textContent"] = _0x320b48;
    }
    return () => {
      _0x17b30c["disabled"] = ![];
      if (_0x4f4997) {
        _0x4f4997["textContent"] = _0x17a473;
      } else {
        _0x17b30c["textContent"] = _0x17a473;
      }
    };
  }
  function _0x10d413(_0xda6c6f) {
    const _0x724ba4 = String(_0xda6c6f || '')["trim"]()["toLowerCase"]()['match'](/(\.[^.]+)$/);
    return _0x724ba4?.[0x1] || '';
  }
  function _0x497553(_0x36e494) {
    const _0x49c6c7 = _0x3fbd69(_0x36e494);
    _0x49c6c7['documentationDocument'] = null;
    const {
      documentationFileEl: _0x5a5e7e
    } = _0x558f19(_0x36e494);
    if (_0x5a5e7e) {
      _0x5a5e7e['value'] = '';
    }
  }
  async function _0x5a67b3(_0xfb8fa7, _0x3ef1c8) {
    const _0x10495b = _0x3ef1c8?.['files']?.[0x0];
    if (!_0xfb8fa7 || !_0x10495b) {
      return;
    }
    const _0xebb9ad = _0x10d413(_0x10495b["name"]);
    if (!CUSTOM_PROVIDER_DOCUMENTATION_EXTENSIONS['has'](_0xebb9ad)) {
      _0x497553(_0xfb8fa7);
      _0xc7b3c8["showToast"]?.(trCustomProvider("localDocumentationUnsupported"), 'warn');
      return;
    }
    if (Number(_0x10495b["size"] || 0x0) > CUSTOM_PROVIDER_DOCUMENTATION_MAX_BYTES) {
      _0x497553(_0xfb8fa7);
      _0xc7b3c8['showToast']?.(trCustomProvider("localDocumentationTooLarge"), "warn");
      return;
    }
    try {
      const _0x40b9c0 = await _0x10495b['text']();
      const _0xb9f4fe = _0x3fbd69(_0xfb8fa7);
      _0xb9f4fe["documentationDocument"] = {
        'name': String(_0x10495b['name'] || '')["trim"](),
        'contentType': String(_0x10495b["type"] || '')['trim'](),
        'text': _0x40b9c0
      };
      const {
        documentationUrlEl: _0x40e6bd
      } = _0x558f19(_0xfb8fa7);
      _0x40e6bd && (_0x40e6bd["value"] = trCustomProvider('localDocumentationSelected', {
        'name': _0x10495b['name']
      }));
    } catch (_0x57163f) {
      _0x497553(_0xfb8fa7);
      _0xc7b3c8["showToast"]?.(trCustomProvider('localDocumentationReadFailed', {
        'error': _0x57163f?.['message'] || trApiInput('diagnostics.unknownError')
      }), "error");
    }
  }
  function _0x2db9fa(_0x54ecff = _0x510f24()) {
    const {
      baseUrlEl: _0x1c668a,
      apiKeyEl: _0x16a901,
      documentationUrlEl: _0xa4d97e
    } = _0x558f19(_0x54ecff);
    const _0x6a6e42 = _0x52a397(_0x1c668a?.["value"]);
    const _0x5697cd = String(_0x16a901?.["value"] || '')["trim"]();
    const _0x59def4 = _0x3fbd69(_0x54ecff);
    const _0x2b5054 = _0x59def4["documentationDocument"];
    const _0x1cc0d4 = _0x2b5054 ? '' : String(_0xa4d97e?.["value"] || '')['trim']();
    const _0x10e6e2 = _0x3eb186(_0x6a6e42);
    const _0x56219e = _0x3ff081(_0x6a6e42);
    return {
      'name': _0x10e6e2,
      'providerId': _0x56219e,
      'baseUrl': _0x6a6e42,
      'apiKey': _0x5697cd,
      'documentationUrl': _0x1cc0d4,
      'documentationDocument': _0x2b5054
    };
  }
  function _0x335ba9(_0x3a43b6 = {}) {
    const {
      baseUrlEl: _0x23ffaa,
      apiKeyEl: _0x1ad5d4
    } = _0x558f19(_0x35b743()[0x0]);
    const _0x4169f5 = _0x3a43b6?.['openai'] || {};
    _0x23ffaa && !String(_0x23ffaa["value"] || '')["trim"]() && _0x4169f5["apiUrl"] && (_0x23ffaa['value'] = _0x4169f5["apiUrl"]);
    _0x1ad5d4 && !String(_0x1ad5d4["value"] || '')["trim"]() && _0x4169f5["apiKey"] && (_0x1ad5d4['value'] = _0x4169f5["apiKey"]);
  }
  function _0x330d5c(_0x53828f, _0x3ea8e3) {
    const _0x3e415f = _0x2b3e46["createElement"]('div');
    _0x3e415f["className"] = _0x53828f;
    _0x3e415f['textContent'] = String(_0x3ea8e3 || '');
    return _0x3e415f;
  }
  function _0x1f0031(_0x419103) {
    const _0x10b0ac = String(_0x419103 || '')["trim"]();
    const _0x48ed8e = _0x2b3e46["createElement"]("button");
    _0x48ed8e["type"] = 'button';
    _0x48ed8e['className'] = 'custom-provider-info-tip';
    _0x48ed8e["setAttribute"]("aria-label", _0x10b0ac);
    _0x48ed8e['textContent'] = '!';
    _0x48ed8e["dataset"]["tooltip"] = _0x10b0ac;
    return _0x48ed8e;
  }
  function _0xc6fd2d(_0x2f19fd = {}) {
    return String(_0x2f19fd?.["upstreamModelId"] || '')["trim"]();
  }
  function _0x4865f3(_0x1db2d3 = {}) {
    const _0x1450e9 = [...(Array["isArray"](_0x1db2d3?.["models"]) ? _0x1db2d3["models"] : []), ...(Array["isArray"](_0x1db2d3?.["unknown"]) ? _0x1db2d3["unknown"] : [])];
    const _0xf9c800 = new Set();
    return _0x1450e9["filter"](_0x19bf6d => {
      const _0x135878 = _0xc6fd2d(_0x19bf6d);
      if (!_0x135878 || _0xf9c800["has"](_0x135878)) {
        return ![];
      }
      _0xf9c800["add"](_0x135878);
      return !![];
    });
  }
  function _0x79d623(_0xce6f7a, _0xfcc7c9 = {}) {
    const _0x36caa5 = String(_0xfcc7c9?.['kind'] || "unknown")["trim"]()["toLowerCase"]();
    const _0x3b57f5 = _0x3fbd69(_0xce6f7a)['assignedModelKinds']["get"](_0xc6fd2d(_0xfcc7c9));
    // 用户手动指定的类型优先于按模型名的启发式判断，否则 nano-banana 这类
    // 名字里没有 image/video 字眼的模型永远只能当文本模型用。
    if (CUSTOM_PROVIDER_SELECTABLE_KINDS["includes"](_0x3b57f5)) {
      return _0x3b57f5;
    }
    return CUSTOM_PROVIDER_SELECTABLE_KINDS["includes"](_0x36caa5) ? _0x36caa5 : 'unknown';
  }
  function _0x5dd623(_0x9f8623, _0x571c54 = []) {
    return (Array["isArray"](_0x571c54) ? _0x571c54 : [])['filter'](_0x4597ec => CUSTOM_PROVIDER_SELECTABLE_KINDS["includes"](_0x79d623(_0x9f8623, _0x4597ec)));
  }
  function _0x2f71be(_0x34e03e) {
    const _0x1bb54d = _0x3fbd69(_0x34e03e);
    _0x1bb54d['activeKindFilter'] = "all";
    _0x1bb54d["selectedModelKeys"] = new Set();
    _0x1bb54d["assignedModelKinds"] = new Map();
    _0x1bb54d["kindToolbarOpenKeys"] = new Set();
    _0x1bb54d["verifyingModelKeys"] = new Set();
  }
  function _0x266c8d(_0x4ac28c, _0x1adca0 = []) {
    const _0xfba10f = _0x3fbd69(_0x4ac28c);
    const _0x3d8c23 = CUSTOM_PROVIDER_FILTER_KINDS['includes'](_0xfba10f["activeKindFilter"]) ? _0xfba10f["activeKindFilter"] : 'all';
    const _0x28b041 = Array["isArray"](_0x1adca0) ? _0x1adca0 : [];
    if (_0x3d8c23 === "all") {
      return _0x28b041;
    }
    return _0x28b041["filter"](_0x1c33aa => _0x79d623(_0x4ac28c, _0x1c33aa) === _0x3d8c23);
  }
  function _0x3df2a1(_0x4ac28c, _0x363252 = []) {
    const _0x1cd704 = new Map(CUSTOM_PROVIDER_FILTER_KINDS['filter'](_0x4b8d2d => _0x4b8d2d !== "all")["map"](_0x25a1f9 => [_0x25a1f9, 0x0]));
    (Array['isArray'](_0x363252) ? _0x363252 : [])["forEach"](_0x52d0f5 => {
      const _0x354640 = _0x79d623(_0x4ac28c, _0x52d0f5);
      _0x1cd704["set"](_0x354640, (_0x1cd704["get"](_0x354640) || 0x0) + 0x1);
    });
    return _0x1cd704;
  }
  function _0x331750(_0x5c9d7d = _0x510f24()) {
    const _0x41cb31 = _0x3fbd69(_0x5c9d7d);
    const _0x4a34db = _0x41cb31["discovery"] || {};
    const _0x139e81 = _0x41cb31["selectedModelKeys"];
    const _0x528bc7 = _0x4865f3(_0x4a34db);
    return _0x5dd623(_0x5c9d7d, _0x528bc7)["filter"](_0xe8f9e6 => _0x139e81['has'](_0xc6fd2d(_0xe8f9e6)))["map"](_0x4fc931 => ({
      ..._0x4fc931,
      'kind': _0x79d623(_0x5c9d7d, _0x4fc931)
    }));
  }
  function _0x3d7a4f(_0x5afc61 = _0x510f24()) {
    const {
      saveSelectedBtnEl: _0x3f1426,
      verifyParamsBtnEl: _0x588f85,
      actionsEl: _0x1b3076
    } = _0x4edf5d(_0x5afc61);
    if (!_0x3f1426) {
      return;
    }
    const _0x5a80aa = _0x331750(_0x5afc61)["length"];
    const _0x48b25f = _0x3fbd69(_0x5afc61);
    const _0x180598 = !!_0x48b25f["discovery"];
    const _0xec4f19 = _0x5afc61?.['dataset']?.['customProviderSyncedBundle'] === "true";
    const _0x37cfe0 = getCustomProviderModelActionState({
      'hasDiscovery': _0x180598,
      'hasSavedBundle': _0xec4f19,
      'isAddingModels': _0x48b25f["isAddingModels"] === !![],
      'selectedCount': _0x5a80aa
    });
    _0x3f1426["disabled"] = _0x37cfe0["saveDisabled"];
    _0x3f1426["hidden"] = _0x37cfe0["saveHidden"];
    _0x3f1426['dataset']["i18n"] = "settings.apiInput.customProvider." + _0x37cfe0["saveLabelKey"];
    _0x3f1426["textContent"] = trCustomProvider(_0x37cfe0["saveLabelKey"]);
    _0x588f85 && (_0x588f85["hidden"] = _0x37cfe0['verifyHidden'], _0x588f85['disabled'] = _0x37cfe0["verifyDisabled"]);
    if (_0x1b3076) {
      _0x1b3076["hidden"] = _0x37cfe0["actionsHidden"];
    }
  }
  function _0x1723f9(_0x5cdb24) {
    if (!_0x5cdb24 || _0x5cdb24['hidden']) {
      return;
    }
    _0x5cdb24["classList"]["remove"]('is-open');
    _0x5cdb24["setAttribute"]("aria-hidden", "true");
    _0xc7b3c8["setTimeout"]?.(() => {
      if (!_0x5cdb24['classList']["contains"]("is-open")) {
        _0x5cdb24["hidden"] = !![];
      }
    }, 0x104);
  }
  function _0x326fb3(_0x4a415) {
    if (!_0x4a415) {
      return;
    }
    _0x4a415['hidden'] = ![];
    _0x4a415["setAttribute"]("aria-hidden", "false");
    _0xc7b3c8["requestAnimationFrame"]?.(() => {
      _0x4a415["classList"]["add"]('is-open');
    }) || _0x4a415["classList"]["add"]("is-open");
  }
  function _0x5e3c22(_0x53a3f2 = _0x510f24()) {
    const {
      resultEl: _0x571028,
      resultInnerEl: _0x52fce5,
      saveSelectedBtnEl: _0x7f3958,
      verifyParamsBtnEl: _0xb2a29c,
      actionsEl: _0x2fb96a
    } = _0x4edf5d(_0x53a3f2);
    _0x52fce5?.["replaceChildren"]();
    _0x1723f9(_0x571028);
    _0x7f3958 && (_0x7f3958["hidden"] = !![], _0x7f3958["disabled"] = !![]);
    if (_0xb2a29c) {
      _0xb2a29c["hidden"] = !![];
    }
    if (_0x2fb96a) {
      _0x2fb96a['hidden'] = !![];
    }
    const _0x4dece4 = _0x3fbd69(_0x53a3f2);
    _0x4dece4['discovery'] = null;
    _0x4dece4['provider'] = null;
    _0x4dece4['activeKindFilter'] = "all";
    _0x4dece4["selectedModelKeys"] = new Set();
    _0x4dece4['assignedModelKinds'] = new Map();
    _0x4dece4['kindToolbarOpenKeys'] = new Set();
    _0x4dece4["verifyingModelKeys"] = new Set();
    _0x4dece4["isAddingModels"] = ![];
  }
  function _0x18fabc(_0x365c49, _0x3da677 = {}) {
    const _0x1d83c6 = _0xc6fd2d(_0x3da677);
    const _0x32ba67 = _0x3fbd69(_0x365c49);
    const _0x23b9d3 = String(_0x3da677?.["kind"] || "unknown")["trim"]()["toLowerCase"]();
    const _0x3befa5 = _0x79d623(_0x365c49, _0x3da677);
    const _0x5caec6 = _0x23b9d3 === "unknown" && _0x3befa5 === 'unknown';
    const _0x3ade80 = _0x32ba67["selectedModelKeys"]["has"](_0x1d83c6) && !_0x5caec6;
    const _0x47912f = _0x32ba67["verifyingModelKeys"]?.["has"](_0x1d83c6) === !![];
    const _0x3ec76d = _0x2b3e46["createElement"]('label');
    _0x3ec76d["className"] = 'custom-provider-model-option';
    _0x3ec76d["dataset"]['customProviderModelKey'] = _0x1d83c6;
    _0x3ec76d["dataset"]["customProviderDetectedKind"] = _0x23b9d3;
    const _0x44a6cb = String(_0x3da677?.["capabilityStatus"] || "unverified")["trim"]()["toLowerCase"]();
    _0x3ec76d["dataset"]['customProviderCapabilityStatus'] = _0x44a6cb;
    if (_0x23b9d3 === "unknown") {
      _0x3ec76d['tabIndex'] = 0x0;
    }
    _0x3ec76d["classList"]["toggle"]("is-selected", _0x3ade80);
    _0x3ec76d["classList"]["toggle"]("is-verifying", _0x47912f);
    if (_0x47912f) {
      _0x3ec76d['setAttribute']("aria-busy", "true");
    }
    const _0x533914 = _0x2b3e46["createElement"]("input");
    _0x533914["type"] = "checkbox";
    _0x533914["className"] = 'custom-provider-model-option-checkbox';
    _0x533914["dataset"]["customProviderModelCheckbox"] = '';
    _0x533914["checked"] = _0x3ade80;
    _0x533914["disabled"] = _0x5caec6 || _0x47912f;
    _0x533914["setAttribute"]("aria-label", _0x5caec6 ? trCustomProvider("classifyBeforeSelecting") : String(_0x3da677["upstreamModelId"] || ''));
    const _0x6396ef = _0x2b3e46["createElement"]("span");
    _0x6396ef["className"] = 'custom-provider-model-option-title';
    _0x6396ef["textContent"] = String(_0x3da677['upstreamModelId'] || '');
    _0x3ec76d["append"](_0x533914, _0x6396ef);
    appendCustomProviderDiscoverySource(_0x3ec76d, _0x3da677, trCustomProvider);
    const _0x6a79f6 = _0x3da677?.["isSaved"] === !![];
    if (_0x47912f) {
      const _0xc7eb72 = _0x2b3e46["createElement"]("span");
      _0xc7eb72['className'] = "custom-provider-model-verifying";
      _0xc7eb72["setAttribute"]("aria-label", trCustomProvider("verifyingParameters"));
      _0xc7eb72["title"] = trCustomProvider('verifyingParameters');
      const _0x3bac97 = _0x2b3e46['createElement']("span");
      _0x3bac97['className'] = 'custom-provider-model-loading-spinner';
      _0x3bac97["setAttribute"]("aria-hidden", 'true');
      _0xc7eb72["append"](_0x3bac97);
      _0x3ec76d["append"](_0xc7eb72);
    } else {
      if (_0x6a79f6 && _0x44a6cb !== "verified") {
        const _0xb7cc87 = _0x2b3e46["createElement"]('span');
        _0xb7cc87['className'] = "custom-provider-model-kind-tag";
        _0xb7cc87['classList']["toggle"]("is-success", isCustomProviderModelCapabilityRecognized(_0x3da677));
        _0xb7cc87['textContent'] = _0x467f83(_0x44a6cb);
        _0xb7cc87['title'] = _0x2aa782(_0x44a6cb);
        _0x3ec76d["append"](_0xb7cc87);
      }
    }
    const _0x4b3a7c = _0x32ba67["assignedModelKinds"]["has"](_0x1d83c6) ||
      _0x32ba67["kindToolbarOpenKeys"]?.["has"]?.(_0x1d83c6) === !![] ||
      _0x23b9d3 === "unknown";
    if (!_0x4b3a7c && _0x3befa5 !== 'unknown') {
      // 类型标签本身可点开：用户可以纠正启发式误判（例如把 nano-banana 改判为图像）。
      const _0x30c484 = _0x2b3e46["createElement"]("button");
      _0x30c484["type"] = "button";
      _0x30c484["className"] = 'custom-provider-model-kind-tag is-interactive';
      _0x30c484["dataset"]["customProviderKindToggle"] = _0x1d83c6;
      _0x30c484["setAttribute"]("aria-label", trCustomProvider("modelKindLabel"));
      _0x30c484["setAttribute"]("aria-expanded", "false");
      _0x30c484["textContent"] = _0x2880c6(_0x3befa5);
      _0x3ec76d["append"](_0x30c484);
    }
    if (_0x4b3a7c) {
      const _0x86ca1f = _0x56bf99(_0x365c49, _0x3da677);
      _0x3ec76d["append"](_0x86ca1f);
    }
    return _0x3ec76d;
  }
  function _0x45de0e(_0x11bcb6, _0x2a46db = []) {
    const _0x5f35b0 = _0x3df2a1(_0x11bcb6, _0x2a46db);
    const _0x39f9a0 = _0x3fbd69(_0x11bcb6);
    const _0x53872f = _0x2b3e46["createElement"]("div");
    _0x53872f['className'] = "custom-provider-kind-filter-row";
    CUSTOM_PROVIDER_FILTER_KINDS["forEach"](_0xd18772 => {
      if (_0xd18772 === "unknown" && !(_0x5f35b0['get']('unknown') > 0x0)) {
        return;
      }
      const _0x3677fc = _0x2b3e46["createElement"]("button");
      _0x3677fc["type"] = 'button';
      _0x3677fc["className"] = "custom-provider-kind-filter";
      _0x3677fc["dataset"]["customProviderKindFilter"] = _0xd18772;
      _0x3677fc['classList']['toggle']("is-active", _0xd18772 === _0x39f9a0["activeKindFilter"]);
      _0x3677fc["setAttribute"]("aria-pressed", _0xd18772 === _0x39f9a0["activeKindFilter"] ? "true" : "false");
      const _0x2c2d54 = _0xd18772 === 'all' ? _0x2a46db["length"] : _0x5f35b0['get'](_0xd18772) || 0x0;
      _0x3677fc["textContent"] = _0x2880c6(_0xd18772) + '\x20' + _0x2c2d54;
      _0x53872f["append"](_0x3677fc);
    });
    return _0x53872f;
  }
  function _0x56bf99(_0x2eb85f, _0x230b9c = {}) {
    const _0x578058 = _0xc6fd2d(_0x230b9c);
    const _0xe8db29 = _0x79d623(_0x2eb85f, _0x230b9c);
    const _0x5df9f4 = _0x2b3e46["createElement"]("div");
    _0x5df9f4["className"] = 'custom-provider-model-kind-toolbar';
    _0x5df9f4["dataset"]["customProviderModelKindToolbar"] = _0x578058;
    _0x5df9f4["setAttribute"]("aria-label", trCustomProvider("modelKindLabel"));
    const _0x5ce87a = _0x2b3e46['createElement']("span");
    _0x5ce87a["className"] = "custom-provider-model-kind-toolbar-label";
    _0x5ce87a["textContent"] = trCustomProvider("modelKindLabel");
    _0x5df9f4['append'](_0x5ce87a);
    CUSTOM_PROVIDER_SELECTABLE_KINDS["forEach"](_0xa22ce6 => {
      const _0x308dec = _0x2b3e46["createElement"]("button");
      _0x308dec['type'] = 'button';
      _0x308dec['className'] = "custom-provider-model-kind-button";
      _0x308dec["dataset"]["customProviderAssignKind"] = _0xa22ce6;
      const _0x526a73 = _0xe8db29 === _0xa22ce6;
      _0x308dec["classList"]["toggle"]("is-active", _0x526a73);
      _0x308dec["setAttribute"]("aria-pressed", String(_0x526a73));
      _0x308dec["textContent"] = _0x2880c6(_0xa22ce6);
      _0x5df9f4["append"](_0x308dec);
    });
    return _0x5df9f4;
  }
  function _0xb91b1f() {
    const _0x4b40b6 = _0x2b3e46["createElement"]("div");
    _0x4b40b6["className"] = "custom-provider-selection-head";
    _0x4b40b6['append'](_0x330d5c('custom-provider-result-title', trCustomProvider("selectModels")));
    _0x4b40b6["append"](_0x1f0031(trCustomProvider("selectionHint")));
    return _0x4b40b6;
  }
  function _0x397a5f(_0x544a95) {
    const _0x446ec4 = _0x2b3e46['createElement']("div");
    _0x446ec4["className"] = "custom-provider-result-heading";
    _0x446ec4['append'](_0xb91b1f(), _0x330d5c('custom-provider-result-title\x20custom-provider-result-summary', _0x544a95));
    return _0x446ec4;
  }
  function _0xf9ac01(_0x118cd8) {
    const _0x2a7c9e = _0x3fbd69(_0x118cd8)['manualModelDraft'] || {};
    const _0x1e6f70 = _0x2b3e46["createElement"]("div");
    _0x1e6f70["className"] = "custom-provider-manual-add";
    const _0x5a2b47 = _0x2b3e46["createElement"]("span");
    _0x5a2b47["className"] = "custom-provider-manual-add-hint";
    _0x5a2b47["textContent"] = trCustomProvider("manualModelHint");
    const _0x49d0e1 = _0x2b3e46["createElement"]("input");
    _0x49d0e1["type"] = "text";
    _0x49d0e1["className"] = "custom-provider-manual-add-id";
    _0x49d0e1["dataset"]["customProviderManualModelId"] = '';
    _0x49d0e1["setAttribute"]("placeholder", trCustomProvider("manualModelIdPlaceholder"));
    _0x49d0e1["value"] = String(_0x2a7c9e['id'] || '');
    const _0x3b7f52 = _0x2b3e46["createElement"]("select");
    _0x3b7f52["className"] = "custom-provider-manual-add-kind";
    _0x3b7f52["dataset"]["customProviderManualModelKind"] = '';
    CUSTOM_PROVIDER_SELECTABLE_KINDS["forEach"](_0x4f8a2c => {
      const _0x2d1b90 = _0x2b3e46["createElement"]("option");
      _0x2d1b90["value"] = _0x4f8a2c;
      _0x2d1b90["textContent"] = _0x2880c6(_0x4f8a2c);
      _0x3b7f52["append"](_0x2d1b90);
    });
    const _0x1a5f80 = _0x3fbd69(_0x118cd8)["activeKindFilter"];
    _0x3b7f52["value"] = CUSTOM_PROVIDER_SELECTABLE_KINDS["includes"](_0x2a7c9e['kind']) ? _0x2a7c9e['kind'] : CUSTOM_PROVIDER_SELECTABLE_KINDS["includes"](_0x1a5f80) ? _0x1a5f80 : 'text';
    const _0x6c4a1f = _0x2b3e46["createElement"]("button");
    _0x6c4a1f['type'] = 'button';
    _0x6c4a1f["className"] = "custom-provider-manual-add-button";
    _0x6c4a1f['dataset']["customProviderAddManualModel"] = '';
    _0x6c4a1f["textContent"] = trCustomProvider("addManualModel");
    _0x1e6f70["append"](_0x5a2b47, _0x49d0e1, _0x3b7f52, _0x6c4a1f);
    return _0x1e6f70;
  }
  function _0xb7d3e2(_0x4501bd, _0x10a5e2) {
    if (!_0x4501bd) {
      return;
    }
    const _0x5cd20f = _0x3fbd69(_0x4501bd);
    const _0x27fa19 = _0x10a5e2?.["closest"]?.(".custom-provider-manual-add") || _0x4501bd;
    const _0x2b8f4a = String(_0x27fa19?.["querySelector"]?.("[data-custom-provider-manual-model-id]")?.["value"] || '')["trim"]();
    const _0x5c7b12 = String(_0x27fa19?.["querySelector"]?.("[data-custom-provider-manual-model-kind]")?.["value"] || 'text')["trim"]()["toLowerCase"]();
    if (!_0x2b8f4a) {
      _0xc7b3c8["showToast"]?.(trCustomProvider("manualModelIdPlaceholder"), "warn");
      return;
    }
    const _0x13a68f = CUSTOM_PROVIDER_SELECTABLE_KINDS["includes"](_0x5c7b12) ? _0x5c7b12 : 'text';
    if (!_0x5cd20f["discovery"]) {
      _0x5cd20f["discovery"] = {
        'provider': _0x5cd20f['provider'] || {},
        'models': [],
        'unknown': [],
        'warnings': []
      };
    }
    const _0x445073 = _0x5cd20f['discovery'];
    _0x445073['models'] = Array['isArray'](_0x445073['models']) ? _0x445073['models'] : [];
    _0x445073['unknown'] = Array['isArray'](_0x445073['unknown']) ? _0x445073['unknown'] : [];
    const _0x5d2e84 = _0x4865f3(_0x445073)["some"](_0x220c8d => _0xc6fd2d(_0x220c8d) === _0x2b8f4a);
    if (_0x5d2e84) {
      _0xc7b3c8["showToast"]?.(trCustomProvider("manualModelDuplicate", {
        'id': _0x2b8f4a
      }), "warn");
      return;
    }
    _0x445073["models"]["push"]({
      'upstreamModelId': _0x2b8f4a,
      'kind': _0x13a68f,
      'capabilityStatus': "unverified",
      'isManual': !![]
    });
    _0x5cd20f["selectedModelKeys"]["add"](_0x2b8f4a);
    _0x5cd20f['manualModelDraft'] = {
      'id': '',
      'kind': _0x13a68f
    };
    _0x5cd20f["provider"] = {
      ...(_0x5cd20f['provider'] || {}),
      'name': _0x2af58f(_0x4501bd, _0x5cd20f['provider'])
    };
    delete _0x4501bd["dataset"]["customProviderSyncedBundle"];
    _0x5cd20f["activeKindFilter"] = "all";
    _0x4934a9(_0x4501bd, _0x445073, _0x5cd20f['provider']);
    _0xc7b3c8["showToast"]?.(trCustomProvider("manualModelAdded", {
      'id': _0x2b8f4a
    }), "success");
  }
  function _0x1efa1d(_0x401395, _0x1a84cb = []) {
    const _0xbe2a48 = _0x266c8d(_0x401395, _0x1a84cb);
    const _0x539ec6 = _0x2b3e46["createElement"]("div");
    _0x539ec6["className"] = "custom-provider-selection";
    _0x539ec6["append"](_0x45de0e(_0x401395, _0x1a84cb));
    const _0x4f37f6 = _0x2b3e46["createElement"]("div");
    _0x4f37f6['className'] = "custom-provider-model-options";
    _0x4f37f6["classList"]['toggle']('has-kind-toolbar', _0xbe2a48["some"](_0x2558bc => String(_0x2558bc?.["kind"] || 'unknown')['trim']()["toLowerCase"]() === "unknown"));
    _0xbe2a48["forEach"](_0x433bed => _0x4f37f6["append"](_0x18fabc(_0x401395, _0x433bed)));
    if (_0xbe2a48["length"] > 0x0) {
      _0x539ec6["append"](_0x4f37f6);
    }
    if (_0x1a84cb["length"] === 0x0) {
      _0x539ec6['append'](_0x330d5c("custom-provider-bundle-empty", trCustomProvider('noModelsDiscovered')));
    } else {
      _0xbe2a48['length'] === 0x0 && _0x539ec6["append"](_0x330d5c("custom-provider-bundle-empty", trCustomProvider("noModelsInFilter")));
    }
    _0x539ec6["append"](_0xf9ac01(_0x401395));
    return _0x539ec6;
  }
  function _0x4934a9(_0x1ff795, _0x5f0122 = {}, _0x46f332 = {}) {
    const {
      resultEl: _0x5ad994,
      resultInnerEl: _0x30b44c
    } = _0x4edf5d(_0x1ff795);
    if (!_0x5ad994 || !_0x30b44c) {
      return;
    }
    const _0x2809a4 = _0x4865f3(_0x5f0122);
    const _0x32fde0 = Array["isArray"](_0x5f0122["unknown"]) ? _0x5f0122["unknown"] : [];
    const _0x469028 = _0x5dd623(_0x1ff795, _0x2809a4);
    _0x30b44c["replaceChildren"]();
    _0x30b44c["append"](_0x397a5f(trCustomProvider("resultSummary", {
      'count': _0x2809a4["length"],
      'supported': _0x469028['length'],
      'unknown': _0x32fde0["length"]
    })));
    _0x30b44c["append"](_0x1efa1d(_0x1ff795, _0x2809a4));
    _0x326fb3(_0x5ad994);
    _0x3d7a4f(_0x1ff795);
  }
  function _0x5d00d3(_0x58dd11, _0x1b9322 = {}, _0x21857c = {}) {
    const {
      resultEl: _0x4a761e
    } = _0x4edf5d(_0x58dd11);
    const _0x4489dd = captureCustomProviderModelSelectionScroll(_0x4a761e);
    _0x4934a9(_0x58dd11, _0x1b9322, _0x21857c);
    restoreCustomProviderModelSelectionScroll(_0x4a761e, _0x4489dd);
  }
  function _0x507874() {
    const {
      editorListEl: _0x1a1d27,
      addBtnEl: _0x99123b
    } = _0x182af1();
    if (!_0x1a1d27) {
      return;
    }
    const _0x237831 = _0xe7c48a();
    _0x1a1d27["insertBefore"](_0x237831, _0x99123b || null);
    _0xa3131c();
    _0xe18797();
    _0x2675fa(_0x237831, {
      'clearResult': !![]
    });
    _0x1a03b8('', '');
    const {
      baseUrlEl: _0x2fb7a9
    } = _0x558f19(_0x237831);
    _0x2fb7a9?.["focus"]?.();
  }
  function _0x44d371(_0x191404 = {}) {
    return String(_0x191404?.["sourceId"] || _0x191404?.["bundle"]?.['sourceId'] || '')["trim"]();
  }
  function _0x2e4099(_0x30104a) {
    return String(_0x30104a || '')["replace"](/^custom-provider:/, '')["trim"]();
  }
  function _0x3a0f45(_0x45fbc1 = {}) {
    const _0x57152b = _0x45fbc1?.["bundle"] && typeof _0x45fbc1["bundle"] === "object" ? _0x45fbc1["bundle"] : {};
    const _0x3da61c = _0x57152b["provider"] && typeof _0x57152b["provider"] === "object" ? _0x57152b["provider"] : {};
    const _0xccc3fd = _0x2e4099(_0x44d371(_0x45fbc1));
    const _0x294404 = String(_0x3da61c["providerId"] || _0x45fbc1["providerId"] || _0xccc3fd)["trim"]();
    const _0x56dac3 = String(_0x3da61c['baseUrl'] || _0x3da61c["apiUrl"] || '')["trim"]();
    const _0x14d41c = String(_0x3da61c["name"] || _0x45fbc1['displayName'] || _0x3eb186(_0x56dac3) || _0x294404)["trim"]();
    return {
      ..._0x3da61c,
      'providerId': _0x294404,
      'name': _0x14d41c,
      'baseUrl': _0x56dac3
    };
  }
  function _0x25e9e6(_0x24ef4e) {
    if (!_0x24ef4e) {
      return '';
    }
    const _0x2a65d1 = _0x3fbd69(_0x24ef4e);
    return String(_0x2a65d1["provider"]?.["providerId"] || _0x24ef4e["dataset"]?.["customProviderProviderId"] || '')['trim']();
  }
  function _0x215003(_0x57462a) {
    const _0x3d3ba3 = String(_0x57462a || '')["trim"]();
    if (!_0x3d3ba3) {
      return null;
    }
    return _0x35b743()["find"](_0x4a5674 => _0x25e9e6(_0x4a5674) === _0x3d3ba3) || null;
  }
  function _0x484b54(_0x3d8bd1) {
    if (!_0x3d8bd1) {
      return ![];
    }
    const _0xe1f10b = _0x3fbd69(_0x3d8bd1);
    const {
      baseUrlEl: _0x576970,
      apiKeyEl: _0x16050d,
      documentationUrlEl: _0x2221c2
    } = _0x558f19(_0x3d8bd1);
    return !_0xe1f10b["provider"] && !_0xe1f10b["discovery"] && !_0xe1f10b['titleText'] && !String(_0x576970?.['value'] || '')["trim"]() && !String(_0x16050d?.["value"] || '')["trim"]() && !String(_0x2221c2?.["value"] || '')["trim"]() && !_0xe1f10b["documentationDocument"];
  }
  function _0x4ee5d2() {
    return _0x35b743()["find"](_0x484b54) || null;
  }
  function _0x1d2604() {
    const {
      editorListEl: _0x7320a0,
      addBtnEl: _0x317e4a
    } = _0x182af1();
    if (!_0x7320a0) {
      return null;
    }
    const _0x54b3ab = _0xe7c48a();
    _0x7320a0["insertBefore"](_0x54b3ab, _0x317e4a || null);
    return _0x54b3ab;
  }
  function _0x170da6(_0x25f5b4 = {}) {
    return getCustomProviderManifestUpstreamModelId(_0x25f5b4);
  }
  function _0x34f2ca(_0x49b864 = {}) {
    const _0x3c82f9 = Array["isArray"](_0x49b864?.["models"]) ? _0x49b864["models"]["map"](_0x530c41 => {
      const _0x3e2d3b = _0x530c41?.["extensions"]?.["customProvider"]?.["capability"] || {};
      return {
        'upstreamModelId': _0x170da6(_0x530c41),
        'kind': String(_0x530c41?.["kind"] || '')["trim"]()["toLowerCase"](),
        'isSaved': !![],
        'capabilityStatus': String(_0x3e2d3b?.["status"] || "unverified")["trim"]()["toLowerCase"](),
        'capabilitySource': String(_0x3e2d3b?.["source"] || "stored-bundle")["trim"]()
      };
    })["filter"](_0x4c55ff => _0x4c55ff["upstreamModelId"] && _0x4c55ff['kind']) : [];
    return {
      'provider': _0x49b864?.["provider"] || {},
      'models': _0x3c82f9,
      'unknown': []
    };
  }
  function _0x192997(_0x98ff4, _0x540be6 = {}) {
    if (!_0x98ff4) {
      return;
    }
    const _0x16b3a4 = _0x540be6?.["bundle"] && typeof _0x540be6["bundle"] === "object" ? _0x540be6['bundle'] : {};
    const _0x56a12a = _0x3a0f45(_0x540be6);
    if (!_0x56a12a["providerId"]) {
      return;
    }
    const _0x2e1168 = _0x34f2ca(_0x16b3a4);
    _0x2e1168["provider"] = _0x56a12a;
    const _0x412f36 = _0x3fbd69(_0x98ff4);
    const _0x52df1f = _0x25e9e6(_0x98ff4);
    const _0x107071 = _0x52df1f === _0x56a12a["providerId"] && _0x412f36["titleManuallyEdited"] && _0xc05002(_0x412f36["titleText"]);
    const _0x3f0447 = _0x52df1f === _0x56a12a["providerId"] && !!_0x412f36['documentationDocument'];
    const {
      baseUrlEl: _0x3eaf96,
      apiKeyEl: _0x4e2ff2,
      documentationUrlEl: _0x28b4dd,
      documentationFileEl: _0x55297a
    } = _0x558f19(_0x98ff4);
    const _0x5f0885 = _0x2854cd?.["providers"]?.[_0x56a12a['providerId']] || {};
    if (_0x3eaf96) {
      _0x3eaf96["value"] = _0x56a12a["baseUrl"] || _0x5f0885['apiUrl'] || '';
    }
    if (_0x4e2ff2) {
      _0x4e2ff2["value"] = _0x5f0885["apiKey"] || '';
    }
    _0x28b4dd && !_0x3f0447 && (_0x28b4dd["value"] = String(_0x56a12a['documentationUrl'] || _0x5f0885["documentationUrl"] || '')["trim"]());
    if (!_0x3f0447) {
      if (_0x55297a) {
        _0x55297a["value"] = '';
      }
      _0x412f36["documentationDocument"] = null;
    }
    _0x98ff4["dataset"]["customProviderProviderId"] = _0x56a12a["providerId"];
    _0x98ff4["dataset"]["customProviderSyncedBundle"] = "true";
    _0x412f36['provider'] = _0x56a12a;
    _0x412f36["discovery"] = _0x2e1168;
    _0x412f36["isAddingModels"] = ![];
    const _0x29d303 = _0x2e1168["unknown"]["length"] > 0x0;
    _0x412f36["activeKindFilter"] = CUSTOM_PROVIDER_FILTER_KINDS["includes"](_0x412f36['activeKindFilter']) && (_0x412f36["activeKindFilter"] !== "unknown" || _0x29d303) ? _0x412f36["activeKindFilter"] : "all";
    _0x412f36["selectedModelKeys"] = new Set(_0x5dd623(_0x98ff4, _0x2e1168["models"])["map"](_0xc6fd2d));
    _0x412f36['assignedModelKinds'] = new Map();
    _0x412f36['kindToolbarOpenKeys'] = new Set();
    !_0x107071 ? _0x1841dc(_0x98ff4, _0x56a12a["name"], {
      'manual': !![]
    }) : _0x3a5a33(_0x98ff4);
    _0x4934a9(_0x98ff4, _0x2e1168, _0x56a12a);
  }
  function _0x523cfe(_0x1510dd) {
    if (!_0x1510dd) {
      return;
    }
    if (_0x35b743()["length"] <= 0x1) {
      _0x5efb21(_0x1510dd);
      _0x2675fa(_0x1510dd, {
        'clearStatus': !![]
      });
      return;
    }
    _0x1ec207(_0x1510dd);
  }
  function _0x3a6997(_0xcaa7db = []) {
    const {
      editorListEl: _0x22d650
    } = _0x182af1();
    if (!_0x22d650) {
      return;
    }
    const _0x3694b7 = (Array['isArray'](_0xcaa7db) ? _0xcaa7db : [])["filter"](_0xfa1d79 => _0xfa1d79?.["bundle"] && _0x3a0f45(_0xfa1d79)["providerId"]);
    const _0x4ac90 = new Set(_0x3694b7['map'](_0x172994 => _0x3a0f45(_0x172994)["providerId"]));
    _0x3694b7["forEach"](_0x5b491a => {
      const _0x3e45d4 = _0x3a0f45(_0x5b491a);
      const _0x4308f1 = _0x215003(_0x3e45d4['providerId']) || _0x4ee5d2() || _0x1d2604();
      _0x192997(_0x4308f1, _0x5b491a);
    });
    _0x35b743()['forEach'](_0x41445c => {
      const _0x19d2d7 = _0x25e9e6(_0x41445c);
      _0x41445c["dataset"]?.["customProviderSyncedBundle"] === 'true' && _0x19d2d7 && !_0x4ac90['has'](_0x19d2d7) && _0x523cfe(_0x41445c);
    });
    _0x35b743()["length"] === 0x0 && _0x1d2604();
    _0xa3131c();
    _0xe18797();
    _0x4e8955(_0x510f24());
  }
  function _0x51ae8b(_0x2f31f8 = {}) {
    getRememberedCustomProviderConfigs(_0x2f31f8)['forEach'](_0x558551 => {
      const _0x557786 = _0x215003(_0x558551["providerId"]) || _0x4ee5d2() || _0x1d2604();
      if (!_0x557786) {
        return;
      }
      const _0x5f502c = _0x3fbd69(_0x557786);
      const {
        baseUrlEl: _0xb65695,
        apiKeyEl: _0x2e52d3,
        documentationUrlEl: _0x1588e0
      } = _0x558f19(_0x557786);
      if (_0xb65695) {
        _0xb65695["value"] = _0x558551["baseUrl"];
      }
      if (_0x2e52d3) {
        _0x2e52d3['value'] = _0x558551['apiKey'];
      }
      _0x1588e0 && !_0x5f502c["documentationDocument"] && (_0x1588e0["value"] = _0x558551["documentationUrl"]);
      _0x557786['dataset']["customProviderProviderId"] = _0x558551['providerId'];
      !_0x5f502c["provider"] && (_0x5f502c["provider"] = {
        'providerId': _0x558551['providerId'],
        'name': _0x558551['name'],
        'baseUrl': _0x558551["baseUrl"],
        'documentationUrl': _0x558551["documentationUrl"]
      });
      !_0x5f502c['discovery'] && _0x1841dc(_0x557786, _0x558551["name"], {
        'manual': !![]
      });
    });
    _0x35b743()["forEach"](_0x1a1eb0 => {
      const _0x1548f0 = _0x25e9e6(_0x1a1eb0);
      if (!_0x1548f0) {
        return;
      }
      const _0x4b3a29 = _0x2f31f8?.[_0x1548f0] || {};
      const {
        baseUrlEl: _0x10c08b,
        apiKeyEl: _0x5d6695,
        documentationUrlEl: _0x25f7ab
      } = _0x558f19(_0x1a1eb0);
      if (_0x10c08b && _0x4b3a29['apiUrl']) {
        _0x10c08b["value"] = _0x4b3a29["apiUrl"];
      }
      if (_0x5d6695 && _0x4b3a29["apiKey"]) {
        _0x5d6695["value"] = _0x4b3a29['apiKey'];
      }
      _0x25f7ab && !_0x3fbd69(_0x1a1eb0)["documentationDocument"] && _0x4b3a29["documentationUrl"] && (_0x25f7ab["value"] = _0x4b3a29["documentationUrl"]);
    });
    _0xa3131c();
    _0xe18797();
    _0x4e8955(_0x510f24());
  }
  function _0x5ebecb(_0x592076 = {}) {
    const _0x374003 = _0x592076?.["bundle"];
    const _0x3971e3 = String(_0x592076?.["sourceId"] || _0x374003?.['sourceId'] || '')['trim']();
    if (!_0x3971e3 || !_0x374003) {
      return ![];
    }
    let _0x17ec56 = ![];
    const _0x2b4e6f = _0xbf840e["get"](_0x3971e3);
    if (_0x2b4e6f) {
      try {
        unregisterManifestBundle(_0x2b4e6f);
        _0x17ec56 = !![];
      } catch (_0x44edce) {
        console['warn']("[Custom Provider] unregister previous bundle failed:", _0x44edce);
      }
    }
    try {
      registerManifestBundle(_0x374003);
      _0xbf840e["set"](_0x3971e3, _0x374003);
      _0x17ec56 = !![];
    } catch (_0x4886a9) {
      console['warn']("[Custom Provider] register bundle failed:", _0x4886a9);
      _0xbf840e["delete"](_0x3971e3);
    }
    return _0x17ec56;
  }
  function _0x5f24a3(_0x34cf76 = []) {
    let _0xadc44d = ![];
    const _0x51657a = new Set();
    _0x34cf76['forEach'](_0x37af3e => {
      const _0x58c504 = _0x37af3e?.["bundle"];
      const _0x35acd8 = String(_0x37af3e?.["sourceId"] || _0x58c504?.["sourceId"] || '')["trim"]();
      if (!_0x35acd8 || !_0x58c504) {
        return;
      }
      _0x51657a["add"](_0x35acd8);
      if (_0x5ebecb(_0x37af3e)) {
        _0xadc44d = !![];
      }
    });
    [..._0xbf840e['entries']()]['forEach'](([_0x543f07, _0x2a8976]) => {
      if (_0x51657a["has"](_0x543f07)) {
        return;
      }
      try {
        unregisterManifestBundle(_0x2a8976);
        _0xadc44d = !![];
      } catch (_0x47b944) {
        console["warn"]('[Custom\x20Provider]\x20unregister\x20stale\x20bundle\x20failed:', _0x47b944);
      }
      _0xbf840e["delete"](_0x543f07);
    });
    return _0xadc44d;
  }
  function _0x5b5b0f(_0x3ab39d, _0x2bfe66, _0x3dc086, _0x28d3c3 = {}) {
    const _0x4d5681 = _0x2bfe66?.["item"] && typeof _0x2bfe66['item'] === 'object' ? _0x2bfe66["item"] : {};
    const _0x4962b1 = _0x4d5681?.["bundle"] && typeof _0x4d5681["bundle"] === 'object' ? _0x4d5681["bundle"] : _0x3dc086;
    const _0xb916f = String(_0x4d5681?.['sourceId'] || _0x4962b1?.['sourceId'] || '')["trim"]();
    const _0x249600 = {
      ..._0x4d5681,
      'sourceId': _0xb916f,
      'bundle': _0x4962b1
    };
    const _0x3f1137 = _0x3fbd69(_0x3ab39d);
    _0x3f1137["discovery"] = mergeCustomProviderDiscoveryCapabilities(_0x3f1137['discovery'], _0x4962b1);
    _0x3f1137["provider"] = {
      ...(_0x3f1137["provider"] || {}),
      ...(_0x4962b1?.["provider"] || {}),
      ...(_0x28d3c3 || {})
    };
    _0x3f1137["isAddingModels"] = ![];
    _0x3ab39d["dataset"]["customProviderProviderId"] = String(_0x3f1137['provider']?.["providerId"] || '')['trim']();
    _0x3ab39d["dataset"]['customProviderSyncedBundle'] = 'true';
    _0x5ebecb(_0x249600) && _0x5149ec?.();
    return _0x4962b1;
  }
  async function _0x30a2ff(_0x2cb662 = {}) {
    const _0x44a0a2 = !!_0x2cb662["silent"];
    if (typeof _0x2f7f81 !== "function") {
      !_0x44a0a2 && _0x1a03b8('danger', trCustomProvider("apiUnsupported"));
      return [];
    }
    try {
      const _0x1ead1f = unwrapCustomProviderResult(await _0x2f7f81());
      const _0x37dac5 = Array["isArray"](_0x1ead1f?.["items"]) ? _0x1ead1f["items"] : [];
      const _0x13bb7a = _0x5f24a3(_0x37dac5);
      _0x3a6997(_0x37dac5);
      if (_0x13bb7a) {
        _0x5149ec?.();
      }
      if (!_0x44a0a2) {
        _0x1a03b8('', '');
      }
      return _0x37dac5;
    } catch (_0x1d8272) {
      const _0x25c476 = trCustomProvider("loadBundlesFailed", {
        'error': _0x1d8272?.["message"] || trApiInput("diagnostics.unknownError")
      });
      !_0x44a0a2 && (_0x1a03b8("danger", trApiInput("diagnostics.failed"), _0x25c476), _0xc7b3c8["showToast"]?.(_0x25c476, 'error'));
      return [];
    }
  }
  async function _0x30869f(_0x5368a2 = {}, _0x5d1e8f = '') {
    if (typeof _0x580e8b !== 'function') {
      return;
    }
    const _0x2df86c = String(_0x5368a2['providerId'] || '')["trim"]();
    if (!_0x2df86c) {
      return;
    }
    const _0x5717b0 = {
      ...(_0x2854cd?.['providers'] || {})
    };
    _0x5717b0[_0x2df86c] = {
      ...(_0x5717b0[_0x2df86c] || {}),
      'apiUrl': String(_0x5368a2["baseUrl"] || _0x5368a2['apiUrl'] || '')['trim'](),
      'apiKey': String(_0x5d1e8f || '')["trim"](),
      'label': String(_0x5368a2["name"] || _0x2df86c)["trim"](),
      'documentationUrl': String(_0x5368a2["documentationUrl"] || '')["trim"]()
    };
    const _0x28c208 = {
      ...(_0x2854cd || {}),
      'providers': _0x5717b0
    };
    await _0x580e8b(_0x28c208);
    _0x576ab5(_0x28c208);
    syncModelServiceReadinessSummary(_0x28c208);
    _0x5149ec?.();
  }
  function _0x2af58f(_0x3b8a1b, _0x255fe6 = {}) {
    return _0xc05002(_0x6b9c13(_0x3b8a1b)) || String(_0x255fe6["name"] || '')["trim"]() || _0x3eb186(_0x255fe6["baseUrl"]);
  }
  function _0x2be44f(_0xaecf47 = null) {
    if (typeof _0xc7b3c8["openSubscriptionDialog"] === "function") {
      _0xc7b3c8["openSubscriptionDialog"]({
        'modelId': CUSTOM_PROVIDER_VIP_MODEL_ID,
        'provider': 'aicanvas',
        'onSuccess': _0xaecf47
      });
      return;
    }
    _0xc7b3c8["showToast"]?.(trCustomProvider('vipRequired'), "warn");
  }
  function _0x3caa61(_0xca45d6 = null) {
    const _0x5ed90e = _0x3a309c?.["getStateRaw"]?.()["subscription"] || {};
    if (isCustomProviderAccessAllowed(_0x5ed90e)) {
      return !![];
    }
    _0x2be44f(_0xca45d6);
    return ![];
  }
  async function _0x43ea6a(_0x347d99, _0x8aeb90) {
    if (!_0x3caa61(() => {
      _0x43ea6a(_0x347d99, _0x8aeb90)['catch'](() => {});
    })) {
      return;
    }
    if (typeof _0x280dbb !== "function") {
      _0x1a03b8('danger', trCustomProvider("apiUnsupported"));
      _0xc7b3c8["showToast"]?.(trCustomProvider("apiUnsupported"), 'error');
      return;
    }
    _0x2675fa(_0x347d99);
    const _0x338f41 = _0x2db9fa(_0x347d99);
    if (!_0x338f41['baseUrl'] || !_0x338f41["apiKey"]) {
      const {
        baseUrlEl: _0x4f99d5,
        apiKeyEl: _0x55f032
      } = _0x558f19(_0x347d99);
      _0x1a03b8('danger', trApiInput("diagnostics.failed"));
      _0xc7b3c8["showToast"]?.(trCustomProvider("fillRequired"), "warn");
      if (!_0x338f41["baseUrl"]) {
        _0x4f99d5?.["focus"]?.();
      } else {
        _0x55f032?.["focus"]?.();
      }
      return;
    }
    if (_0x34d05b(_0x347d99, _0x338f41["providerId"])) {
      return;
    }
    const _0x566bf6 = _0x50c248(_0x8aeb90, trCustomProvider("discovering"));
    try {
      _0x1a03b8("testing", trCustomProvider("discovering"));
      const {
        documentationDocument: _0x502891,
        ..._0x56720a
      } = _0x338f41;
      const _0x14a1a2 = _0x1fc148(_0x338f41["providerId"]);
      const _0x48b107 = unwrapCustomProviderResult(await _0x280dbb(_0x56720a));
      const _0x17602a = mergeCustomProviderDiscoveryCapabilities(_0x48b107, _0x14a1a2);
      const _0x33e4c1 = {
        ...(_0x17602a['provider'] || {}),
        'name': _0x338f41["name"],
        'providerId': _0x338f41["providerId"],
        'baseUrl': _0x17602a["provider"]?.["baseUrl"] || _0x338f41['baseUrl'],
        'documentationUrl': _0x338f41['documentationUrl'] || _0x17602a['provider']?.["documentationUrl"] || ''
      };
      _0x56a95d(_0x347d99, _0x33e4c1["name"]);
      const _0x6b4cb0 = {
        ..._0x33e4c1,
        'name': _0x2af58f(_0x347d99, _0x33e4c1)
      };
      await _0x30869f(_0x6b4cb0, _0x338f41["apiKey"]);
      _0x347d99["dataset"]["customProviderProviderId"] = _0x6b4cb0["providerId"];
      delete _0x347d99["dataset"]["customProviderSyncedBundle"];
      _0x2f71be(_0x347d99);
      const _0x23ce12 = _0x3fbd69(_0x347d99);
      _0x23ce12["discovery"] = _0x17602a;
      _0x23ce12["provider"] = _0x6b4cb0;
      _0x23ce12['isAddingModels'] = !![];
      const _0x5c8077 = _0x558f19(_0x347d99);
      if (_0x5c8077["baseUrlEl"]) {
        _0x5c8077["baseUrlEl"]["value"] = _0x6b4cb0["baseUrl"];
      }
      _0x5c8077["documentationUrlEl"] && !_0x23ce12["documentationDocument"] && (_0x5c8077["documentationUrlEl"]['value'] = _0x6b4cb0["documentationUrl"]);
      _0x4934a9(_0x347d99, _0x17602a, _0x6b4cb0);
      _0xe18797();
      const _0x271bcd = _0x4865f3(_0x17602a);
      const _0x57036f = _0x5dd623(_0x347d99, _0x271bcd)['length'];
      if (_0x57036f === 0x0) {
        const _0x251f15 = trCustomProvider("configSavedNoSupportedModels");
        _0x1a03b8('partial', _0x251f15);
        _0xc7b3c8['showToast']?.(_0x251f15, "warn", 0x2328);
        return;
      }
      _0x1a03b8(_0x17602a["warnings"]?.['length'] ? "partial" : "success", trCustomProvider("resultSummary", {
        'count': _0x271bcd['length'],
        'supported': _0x57036f,
        'unknown': Array['isArray'](_0x17602a["unknown"]) ? _0x17602a["unknown"]["length"] : 0x0
      }), _0x17602a["warnings"]?.["length"] ? trCustomProvider("sourceIncomplete") : '');
    } catch (_0x443df0) {
      const _0x4f9d31 = trCustomProvider("saveFailed", {
        'error': _0x443df0?.["message"] || trApiInput('diagnostics.unknownError')
      });
      _0x1a03b8("danger", trApiInput('diagnostics.failed'), _0x4f9d31);
      _0xc7b3c8["showToast"]?.(_0x4f9d31, "error", 0x2328);
    } finally {
      _0x566bf6();
    }
  }
  async function _0xe819fb(_0x126ac0, _0x261af2) {
    if (!_0x3caa61(() => {
      _0xe819fb(_0x126ac0, _0x261af2)['catch'](() => {});
    })) {
      return;
    }
    if (typeof _0x4fbe39 !== "function" || typeof _0x312285 !== "function" || typeof _0x3efd0d !== "function") {
      _0x1a03b8("danger", trCustomProvider("apiUnsupported"));
      _0xc7b3c8["showToast"]?.(trCustomProvider("apiUnsupported"), "error");
      return;
    }
    const _0x5ab26d = _0x331750(_0x126ac0);
    if (_0x5ab26d['length'] === 0x0) {
      _0xc7b3c8["showToast"]?.(trCustomProvider("noModelsSelected"), "warn");
      return;
    }
    const _0xdf7ebf = _0x2db9fa(_0x126ac0);
    if (_0x34d05b(_0x126ac0, _0xdf7ebf["providerId"])) {
      return;
    }
    const _0x46fc23 = _0x3fbd69(_0x126ac0);
    const _0x3d4497 = {
      ...(_0x46fc23['provider'] || {}),
      'name': _0x2af58f(_0x126ac0, _0x46fc23["provider"]),
      'providerId': _0x46fc23['provider']?.["providerId"] || _0xdf7ebf["providerId"],
      'baseUrl': _0x46fc23['provider']?.["baseUrl"] || _0xdf7ebf['baseUrl'],
      'documentationUrl': _0xdf7ebf["documentationUrl"]
    };
    const _0x4a5f10 = _0x1fc148(_0x3d4497['providerId']);
    const _0x4296e8 = _0x50c248(_0x261af2, trCustomProvider('validating'));
    try {
      _0x1a03b8("testing", trCustomProvider('validating'));
      const _0x2842de = unwrapCustomProviderResult(await _0x4fbe39({
        'provider': _0x3d4497,
        'models': _0x5ab26d
      }));
      const _0x37ff76 = mergeCustomProviderRecognizedProfiles(_0x2842de?.["bundle"], _0x4a5f10);
      const _0x4dd214 = Array["isArray"](_0x37ff76?.["models"]) ? _0x37ff76['models']["length"] : 0x0;
      if (_0x4dd214 === 0x0) {
        throw new Error(trCustomProvider("noSupportedModels"));
      }
      const _0xd4ee02 = unwrapCustomProviderResult(await _0x312285(_0x37ff76));
      if (!_0xd4ee02?.['ok']) {
        throw new Error(Array["isArray"](_0xd4ee02?.["errors"]) && _0xd4ee02["errors"]['length'] ? _0xd4ee02['errors']["join"](';\x20') : trApiInput('diagnostics.failed'));
      }
      const _0x4661d4 = _0xd4ee02['bundle'] || _0x37ff76;
      await _0x30869f(_0x3d4497, _0xdf7ebf['apiKey']);
      const _0x4122d8 = unwrapCustomProviderResult(await _0x3efd0d(_0x4661d4));
      const _0x499c38 = _0x5b5b0f(_0x126ac0, _0x4122d8, _0x4661d4, _0x3d4497);
      _0x5d00d3(_0x126ac0, _0x46fc23['discovery'], _0x46fc23["provider"]);
      const _0x2a219a = getCustomProviderSaveStatus(_0x499c38?.['models']);
      const _0x4756b2 = trCustomProvider(_0x2a219a["key"], _0x2a219a);
      _0x1a03b8("success", _0x4756b2);
      _0xc7b3c8["showToast"]?.(_0x4756b2, "success");
    } catch (_0x55b00e) {
      const _0x10609f = trCustomProvider("saveFailed", {
        'error': _0x55b00e?.["message"] || trApiInput('diagnostics.unknownError')
      });
      _0x1a03b8("danger", trApiInput("diagnostics.failed"), _0x10609f);
      _0xc7b3c8["showToast"]?.(_0x10609f, "error", 0x2328);
    } finally {
      _0x4296e8();
    }
  }
  function _0x2f41c2(_0x3c9c65) {
    const _0x2b4939 = _0x3c9c65?.['message'] || trApiInput("diagnostics.unknownError");
    const _0x34d3e3 = _0x2b4939["includes"]("Automatic API documentation discovery failed") ? trCustomProvider("documentationAutoDiscoveryFailed") : _0x2b4939;
    const _0x5580a2 = trCustomProvider("parameterVerificationFailed", {
      'error': _0x34d3e3
    });
    console['error']("[Custom Provider] 模型参数验证失败:", _0x3c9c65);
    try {
      _0x1a03b8('danger', _0x5580a2, _0x34d3e3);
    } catch (_0x4b6529) {
      console["error"]("[Custom Provider] 无法更新参数验证状态:", _0x4b6529);
    }
    let _0x28249a = ![];
    try {
      typeof _0xc7b3c8["showToast"] === "function" && (_0xc7b3c8["showToast"](_0x5580a2, "error", 0x2328), _0x28249a = !![]);
    } catch (_0x492e1e) {
      console["error"]('[Custom\x20Provider]\x20无法显示参数验证提示:', _0x492e1e);
    }
    if (!_0x28249a) {
      try {
        showError?.(_0x5580a2);
      } catch (_0x502510) {
        console["error"]("[Custom Provider] 无法显示参数验证错误:", _0x502510);
      }
    }
  }
  async function _0x2ee52b(_0x3c4da6, _0x8b2f10) {
    try {
      await _0x280fba(_0x3c4da6, _0x8b2f10);
    } catch (_0x2f1196) {
      _0x2f41c2(_0x2f1196);
    }
  }
  async function _0x280fba(_0x118c8c, _0xff563f) {
    if (!_0x3caa61(() => {
      _0x2ee52b(_0x118c8c, _0xff563f)['catch'](_0x2f41c2);
    })) {
      return;
    }
    if (typeof _0x1d89c6 !== 'function' || typeof _0x4fbe39 !== "function" || typeof _0x312285 !== 'function' || typeof _0x3efd0d !== "function") {
      _0x1a03b8("danger", trCustomProvider("apiUnsupported"));
      _0xc7b3c8["showToast"]?.(trCustomProvider('apiUnsupported'), 'error');
      return;
    }
    const _0x4f800e = _0x2db9fa(_0x118c8c);
    const _0x3a33d2 = _0x331750(_0x118c8c);
    if (_0x3a33d2["length"] === 0x0) {
      const _0x1ea7f6 = trCustomProvider("noModelsSelected");
      _0x1a03b8("partial", _0x1ea7f6);
      _0xc7b3c8["showToast"]?.(_0x1ea7f6, "warn");
      return;
    }
    const _0x5dbc57 = _0x3a33d2;
    const _0x3ce957 = _0x3fbd69(_0x118c8c);
    if (_0x34d05b(_0x118c8c, _0x4f800e["providerId"])) {
      return;
    }
    const _0x3502d5 = {
      ...(_0x3ce957["provider"] || {}),
      'name': _0x2af58f(_0x118c8c, _0x3ce957['provider']),
      'providerId': _0x3ce957['provider']?.["providerId"] || _0x4f800e['providerId'],
      'baseUrl': _0x3ce957["provider"]?.['baseUrl'] || _0x4f800e["baseUrl"],
      'documentationUrl': _0x4f800e['documentationUrl']
    };
    const _0x69962 = _0x1fc148(_0x3502d5["providerId"]);
    const {
      resultEl: _0x425072
    } = _0x4edf5d(_0x118c8c);
    const _0x1cb755 = captureCustomProviderModelSelectionScroll(_0x425072);
    _0x3ce957["verifyingModelKeys"] = new Set(_0x3a33d2['map'](_0xc6fd2d)['filter'](Boolean));
    _0x4934a9(_0x118c8c, _0x3ce957['discovery'], _0x3ce957["provider"]);
    restoreCustomProviderModelSelectionScroll(_0x425072, _0x1cb755);
    const _0x2c810e = _0x50c248(_0xff563f, trCustomProvider("verifyingParameters"));
    try {
      _0x1a03b8('testing', trCustomProvider("analyzingDocumentation"));
      const _0x8425fb = unwrapCustomProviderResult(await _0x1d89c6({
        'apiKey': _0x4f800e["apiKey"],
        'provider': _0x3502d5,
        'models': _0x5dbc57,
        'documentationUrl': _0x4f800e["documentationUrl"],
        'documentationDocument': _0x4f800e["documentationDocument"]
      }));
      if (_0x8425fb?.["agentUnavailable"]) {
        throw new Error(trCustomProvider("documentationAgentUnavailable"));
      }
      if (!_0x8425fb?.['bundle']) {
        throw new Error(trCustomProvider("documentationNoMatchingProfile"));
      }
      const _0x4d4efd = Number(_0x8425fb?.['analysis']?.["documentedModels"] || 0x0);
      if (_0x4d4efd <= 0x0) {
        throw new Error(trCustomProvider(resolveCustomProviderDocumentationFailureKey(_0x8425fb?.["analysis"])));
      }
      const _0x5e2c1b = unwrapCustomProviderResult(await _0x4fbe39({
        'provider': _0x3502d5,
        'models': _0x3a33d2
      }));
      const _0x3ca409 = mergeCustomProviderRecognizedProfiles(_0x5e2c1b?.["bundle"], _0x69962);
      const _0x17bbce = mergeCustomProviderRecognizedProfiles(_0x3ca409, _0x8425fb["bundle"]);
      const _0x4249b5 = unwrapCustomProviderResult(await _0x312285(_0x17bbce));
      if (!_0x4249b5?.['ok']) {
        throw new Error(Array["isArray"](_0x4249b5?.["errors"]) && _0x4249b5["errors"]['length'] ? _0x4249b5["errors"]["join"](';\x20') : trApiInput("diagnostics.failed"));
      }
      const _0x3e9ae6 = _0x4249b5['bundle'] || _0x17bbce;
      await _0x30869f(_0x3502d5, _0x4f800e['apiKey']);
      const _0xf87941 = unwrapCustomProviderResult(await _0x3efd0d(_0x3e9ae6));
      const _0x2ba968 = _0x5b5b0f(_0x118c8c, _0xf87941, _0x3e9ae6, _0x3502d5);
      const _0x49d29a = Array["isArray"](_0x2ba968?.["models"]) ? _0x2ba968['models']["length"] : 0x0;
      const _0x5495e6 = (Array["isArray"](_0x2ba968?.["models"]) ? _0x2ba968['models'] : [])["filter"](isCustomProviderModelCapabilityRecognized)["length"];
      const _0x539a0f = Number(_0x8425fb?.['analysis']?.['agentRepairAttempts'] || 0x0) > 0x0;
      const _0x5333c8 = _0x5495e6 < _0x49d29a ? _0x539a0f ? "parametersVerifiedPartialAfterRepair" : "parametersVerifiedPartial" : _0x539a0f ? "parametersVerifiedAfterRepair" : "parametersVerified";
      const _0x366139 = trCustomProvider(_0x5333c8, {
        'count': _0x49d29a,
        'documented': _0x5495e6
      });
      _0x1a03b8(_0x5495e6 < _0x49d29a ? 'partial' : 'success', _0x366139);
      _0xc7b3c8["showToast"]?.(_0x366139, _0x5495e6 < _0x49d29a ? "warn" : "success", _0x5495e6 < _0x49d29a ? 0x2328 : undefined);
    } finally {
      _0x3ce957["verifyingModelKeys"] = new Set();
      _0x4934a9(_0x118c8c, _0x3ce957["discovery"], _0x3ce957["provider"]);
      restoreCustomProviderModelSelectionScroll(_0x425072, _0x1cb755);
      _0x2c810e();
    }
  }
  function _0x5c71eb() {
    const {
      cardEl: _0x1be326,
      editorEl: _0x116988
    } = _0x182af1();
    if (!_0x1be326) {
      return;
    }
    _0x52fd72();
    _0x116988?.["addEventListener"]('focusin', _0x34af7c => {
      const _0x49cffa = _0x34af7c['target']?.["closest"]?.('[data-custom-provider-editor-id]');
      _0x49cffa && _0x116988["contains"](_0x49cffa) && _0x2675fa(_0x49cffa);
    });
    _0x116988?.["addEventListener"]("wheel", _0x1f3709 => handleCustomProviderResultWheel(_0x1f3709, _0x116988), {
      'passive': ![]
    });
    _0x116988?.['addEventListener']("click", _0x339599 => {
      const _0x3eba5f = _0x339599['target']?.['closest']?.("[data-custom-provider-editor-id]");
      _0x3eba5f && _0x116988["contains"](_0x3eba5f) && _0x2675fa(_0x3eba5f);
      const _0x4bd8f5 = _0x339599["target"]?.['closest']?.("[data-custom-provider-add]");
      if (_0x4bd8f5 && _0x116988["contains"](_0x4bd8f5)) {
        _0x507874();
        return;
      }
      const _0x1bb54e = _0x339599['target']?.["closest"]?.("[data-custom-provider-delete]");
      if (_0x1bb54e && _0x116988["contains"](_0x1bb54e)) {
        const _0x5606b2 = _0x1bb54e["closest"]("[data-custom-provider-editor-id]");
        _0x1aa61d(_0x5606b2, _0x1bb54e)['catch'](() => {});
        return;
      }
      const _0x4c6026 = _0x339599["target"]?.["closest"]?.('[data-custom-provider-select-document]');
      if (_0x4c6026 && _0x116988["contains"](_0x4c6026)) {
        const _0xd198e2 = _0x4c6026['closest']("[data-custom-provider-editor-id]");
        const {
          documentationFileEl: _0x535678
        } = _0x558f19(_0xd198e2);
        if (_0x535678) {
          _0x535678["value"] = '';
        }
        _0x535678?.['click']?.();
        return;
      }
      const _0xf8cfef = _0x339599['target']?.['closest']?.("[data-custom-provider-discover]");
      if (_0xf8cfef && _0x116988["contains"](_0xf8cfef)) {
        const _0x178391 = _0xf8cfef["closest"]("[data-custom-provider-editor-id]");
        _0x43ea6a(_0x178391, _0xf8cfef)["catch"](() => {});
        return;
      }
      const _0x2b8657 = _0x339599["target"]?.["closest"]?.("[data-custom-provider-save-selected]");
      if (_0x2b8657 && _0x116988["contains"](_0x2b8657)) {
        const _0xeea13c = _0x2b8657["closest"]('[data-custom-provider-editor-id]');
        _0xe819fb(_0xeea13c, _0x2b8657)["catch"](() => {});
        return;
      }
      const _0x30a2ca = _0x339599['target']?.["closest"]?.("[data-custom-provider-verify-params]");
      if (_0x30a2ca && _0x116988["contains"](_0x30a2ca)) {
        const _0x517639 = _0x30a2ca["closest"]("[data-custom-provider-editor-id]");
        _0x2ee52b(_0x517639, _0x30a2ca)["catch"](_0x2f41c2);
        return;
      }
      const _0x4a19d7 = _0x339599["target"]?.["closest"]?.("[data-custom-provider-add-manual-model]");
      if (_0x4a19d7 && _0x116988["contains"](_0x4a19d7)) {
        _0x339599["preventDefault"]();
        _0x339599["stopPropagation"]();
        const _0x2e7a15 = _0x4a19d7["closest"]("[data-custom-provider-editor-id]");
        _0xb7d3e2(_0x2e7a15, _0x4a19d7);
        return;
      }
      const _0x45daee = _0x339599["target"]?.["closest"]?.("[data-custom-provider-kind-filter]");
      if (_0x45daee && _0x116988["contains"](_0x45daee)) {
        const _0x5799df = _0x45daee["closest"]('[data-custom-provider-editor-id]');
        const _0x16807e = String(_0x45daee['dataset']['customProviderKindFilter'] || "all");
        if (!CUSTOM_PROVIDER_FILTER_KINDS["includes"](_0x16807e)) {
          return;
        }
        const _0x5282ab = _0x3fbd69(_0x5799df);
        _0x5282ab["activeKindFilter"] = _0x16807e;
        _0x5282ab["provider"] = {
          ...(_0x5282ab['provider'] || {}),
          'name': _0x2af58f(_0x5799df, _0x5282ab["provider"])
        };
        _0x4934a9(_0x5799df, _0x5282ab["discovery"], _0x5282ab['provider']);
        return;
      }
      const _0x39c9b3 = _0x339599['target']?.["closest"]?.("[data-custom-provider-assign-kind]");
      if (_0x39c9b3 && _0x116988["contains"](_0x39c9b3)) {
        _0x339599["preventDefault"]();
        _0x339599["stopPropagation"]();
        const _0x1396ed = _0x39c9b3["closest"]('[data-custom-provider-editor-id]');
        const _0x410da3 = _0x39c9b3["closest"]("[data-custom-provider-model-kind-toolbar]");
        const _0x455a1a = String(_0x410da3?.["dataset"]["customProviderModelKindToolbar"] || '');
        const _0x4995fb = String(_0x39c9b3["dataset"]["customProviderAssignKind"] || '');
        if (!_0x1396ed || !_0x455a1a || !CUSTOM_PROVIDER_SELECTABLE_KINDS['includes'](_0x4995fb)) {
          return;
        }
        const _0x543d14 = _0x3fbd69(_0x1396ed);
        _0x543d14["assignedModelKinds"]["set"](_0x455a1a, _0x4995fb);
        _0x543d14['selectedModelKeys']["add"](_0x455a1a);
        delete _0x1396ed["dataset"]["customProviderSyncedBundle"];
        _0x5d00d3(_0x1396ed, _0x543d14["discovery"], _0x543d14["provider"]);
        return;
      }
      const _0x3f0a71 = _0x339599['target']?.["closest"]?.("[data-custom-provider-kind-toggle]");
      if (_0x3f0a71 && _0x116988["contains"](_0x3f0a71)) {
        _0x339599["preventDefault"]();
        _0x339599["stopPropagation"]();
        const _0x3548e9 = _0x3f0a71["closest"]("[data-custom-provider-editor-id]");
        const _0x2eb7d1 = String(_0x3f0a71["dataset"]["customProviderKindToggle"] || '');
        if (!_0x3548e9 || !_0x2eb7d1) {
          return;
        }
        const _0x489cba = _0x3fbd69(_0x3548e9);
        _0x489cba["kindToolbarOpenKeys"].add(_0x2eb7d1);
        delete _0x3548e9["dataset"]["customProviderSyncedBundle"];
        _0x5d00d3(_0x3548e9, _0x489cba["discovery"], _0x489cba["provider"]);
        return;
      }
    });
    _0x116988?.["addEventListener"]("dblclick", _0x648ac5 => {
      const _0x1495f8 = _0x648ac5["target"]?.["closest"]?.("[data-custom-provider-editor-tab]");
      if (!_0x1495f8 || !_0x116988["contains"](_0x1495f8)) {
        return;
      }
      const _0x40a971 = _0x1495f8["closest"]("[data-custom-provider-editor-id]");
      _0x2675fa(_0x40a971);
      _0x484f28(_0x40a971);
    });
    _0x116988["addEventListener"]('change', _0x3c9561 => {
      const _0x29614f = _0x3c9561["target"]?.["closest"]?.("[data-custom-provider-documentation-file]");
      if (_0x29614f && _0x116988["contains"](_0x29614f)) {
        const _0x242749 = _0x29614f["closest"]("[data-custom-provider-editor-id]");
        _0x5a67b3(_0x242749, _0x29614f)['catch'](() => {});
        return;
      }
      const _0x4c7f20 = _0x3c9561["target"]?.["closest"]?.("[data-custom-provider-manual-model-kind]");
      if (_0x4c7f20 && _0x116988["contains"](_0x4c7f20)) {
        const _0x1b6a04 = _0x4c7f20["closest"]("[data-custom-provider-editor-id]");
        if (_0x1b6a04) {
          const _0x2c9e13 = _0x3fbd69(_0x1b6a04);
          _0x2c9e13['manualModelDraft'] = {
            'id': String(_0x2c9e13['manualModelDraft']?.['id'] || ''),
            'kind': String(_0x4c7f20["value"] || 'text')
          };
        }
        return;
      }
      const _0x236639 = _0x3c9561["target"]?.["closest"]?.("[data-custom-provider-model-checkbox]");
      if (!_0x236639 || !_0x116988["contains"](_0x236639)) {
        return;
      }
      const _0x323599 = _0x236639["closest"]("[data-custom-provider-model-key]");
      const _0x3f8cb8 = _0x236639['closest']("[data-custom-provider-editor-id]");
      if (_0x323599 && _0x3f8cb8) {
        const _0x49fd10 = String(_0x323599["dataset"]["customProviderModelKey"] || '');
        if (!_0x49fd10) {
          return;
        }
        const _0x514d90 = _0x3fbd69(_0x3f8cb8);
        const _0x3a91ef = String(_0x323599["dataset"]['customProviderDetectedKind'] || "unknown");
        const _0x1337b6 = !!_0x236639["checked"];
        const _0x24d8b3 = applyCustomProviderModelSelectionState(_0x514d90, {
          'modelKey': _0x49fd10,
          'detectedKind': _0x3a91ef,
          'selected': _0x1337b6
        });
        delete _0x3f8cb8["dataset"]['customProviderSyncedBundle'];
        if (_0x24d8b3) {
          _0x5d00d3(_0x3f8cb8, _0x514d90["discovery"], _0x514d90["provider"]);
          return;
        }
        _0x323599["classList"]["toggle"]('is-selected', _0x1337b6);
        _0x3d7a4f(_0x3f8cb8);
      }
    });
    _0x116988["addEventListener"]("input", _0x219a29 => {
      const _0x58b2f1 = _0x219a29["target"]?.["closest"]?.("[data-custom-provider-manual-model-id]");
      if (_0x58b2f1 && _0x116988['contains'](_0x58b2f1)) {
        const _0x39d70a = _0x58b2f1["closest"]("[data-custom-provider-editor-id]");
        if (_0x39d70a) {
          const _0x4a0f88 = _0x3fbd69(_0x39d70a);
          _0x4a0f88['manualModelDraft'] = {
            'id': String(_0x58b2f1["value"] || ''),
            'kind': String(_0x4a0f88['manualModelDraft']?.['kind'] || 'text')
          };
        }
        return;
      }
      const _0x3322a8 = _0x219a29["target"]?.["closest"]?.("[data-custom-provider-documentation-url]");
      if (!_0x3322a8 || !_0x116988['contains'](_0x3322a8)) {
        return;
      }
      const _0x3e70e1 = _0x3322a8['closest']("[data-custom-provider-editor-id]");
      _0x3fbd69(_0x3e70e1)["documentationDocument"] && _0x497553(_0x3e70e1);
    });
    trackRuntimeManifestLoad(_0x30a2ff({
      'silent': !![]
    }))['catch'](() => {});
  }
  return {
    'init': _0x5c71eb,
    'refreshBundles': _0x30a2ff,
    'syncConfigSnapshot'(_0x5ec322) {
      _0x2854cd = _0x5ec322 || {};
    },
    'syncDefaults': _0x335ba9,
    'syncEditorCredentials': _0x51ae8b
  };
}