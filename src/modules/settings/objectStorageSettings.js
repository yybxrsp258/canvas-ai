import { API_CONFIG_CHANGED_EVENT, getApiConfigSnapshot, getObjectStorageConfig, saveApiConfigToServer } from '../../../api/configApi.js';
import { normalizeObjectStorageConfig, testObjectStorageConnection, validateObjectStorageConfig } from '../../../api/objectStorageApi.js';
import { getObjectStorageProviderProfile, isObjectStorageProviderVerified, markObjectStorageProviderVerified, normalizeObjectStorageSettings, serializeObjectStorageSettings, updateObjectStorageProviderProfile } from '../../../api/objectStorageProfiles.js';
import { t } from '../../i18n/index.js';
const FIELD_IDS = Object["freeze"](["objectStorageEndpoint", "objectStorageRegion", "objectStorageBucket", 'objectStorageAccessKeyId', "objectStorageSecretAccessKey", "objectStoragePublicBaseUrl"]);
const OBJECT_STORAGE_TUTORIAL_URL = "https://docs.qq.com/doc/DYkZOamhTa3FCd1VR";
const PROVIDER_UI = Object['freeze']({
  'cloudflare-r2': Object["freeze"]({
    'i18nKey': "cloudflareR2",
    'badge': 'R2',
    'consoleUrl': 'https://dash.cloudflare.com/?to=%2F%3Aaccount%2Fr2%2Foverview',
    'tutorialUrl': OBJECT_STORAGE_TUTORIAL_URL,
    'showEndpoint': !![],
    'showRegion': ![],
    'showAddressingStyle': ![],
    'endpointPlaceholder': "https://<account-id>.r2.cloudflarestorage.com",
    'regionPlaceholder': 'auto',
    'bucketPlaceholder': "aicanvas-assets",
    'publicUrlPlaceholder': "https://assets.example.com"
  }),
  'tencent-cos': Object["freeze"]({
    'i18nKey': "tencentCos",
    'badge': 'COS',
    'consoleUrl': 'https://console.cloud.tencent.com/cos',
    'tutorialUrl': OBJECT_STORAGE_TUTORIAL_URL,
    'showEndpoint': ![],
    'showRegion': !![],
    'showAddressingStyle': ![],
    'endpointPlaceholder': '',
    'regionPlaceholder': "ap-guangzhou",
    'bucketPlaceholder': "examplebucket-1250000000",
    'publicUrlPlaceholder': "https://examplebucket-1250000000.cos.ap-guangzhou.myqcloud.com"
  }),
  'aliyun-oss': Object["freeze"]({
    'i18nKey': "aliyunOss",
    'badge': "OSS",
    'consoleUrl': "https://oss.console.aliyun.com/overview",
    'tutorialUrl': OBJECT_STORAGE_TUTORIAL_URL,
    'showEndpoint': ![],
    'showRegion': !![],
    'showAddressingStyle': ![],
    'endpointPlaceholder': '',
    'regionPlaceholder': "cn-hangzhou",
    'bucketPlaceholder': "aicanvas-assets",
    'publicUrlPlaceholder': 'https://aicanvas-assets.oss-cn-hangzhou.aliyuncs.com'
  }),
  's3-compatible': Object["freeze"]({
    'i18nKey': "s3Compatible",
    'badge': 'S3',
    'consoleUrl': '',
    'tutorialUrl': '',
    'showEndpoint': !![],
    'showRegion': !![],
    'showAddressingStyle': !![],
    'endpointPlaceholder': "https://storage.example.com",
    'regionPlaceholder': "us-east-1",
    'bucketPlaceholder': 'aicanvas-assets',
    'publicUrlPlaceholder': 'https://assets.example.com'
  })
});
function tr(_0x520d14, _0x61e4d5 = {}) {
  let _0x287c2b = t('settings.objectStorage.' + _0x520d14);
  Object["entries"](_0x61e4d5)["forEach"](([_0x1ed5c4, _0x9ef318]) => {
    _0x287c2b = _0x287c2b["split"]('{' + _0x1ed5c4 + '}')["join"](String(_0x9ef318 ?? ''));
  });
  return _0x287c2b;
}
function getElements(_0x207e4c = globalThis["document"]) {
  if (!_0x207e4c) {
    return {};
  }
  const _0x2544d5 = {
    'card': _0x207e4c["getElementById"]('objectStorageConfigCard'),
    'enabledOn': _0x207e4c['getElementById']("btnObjectStorageEnabledOn"),
    'enabledOff': _0x207e4c['getElementById']("btnObjectStorageEnabledOff"),
    'test': _0x207e4c["getElementById"]("btnObjectStorageTest"),
    'status': _0x207e4c['getElementById']("objectStorageStatus"),
    'providerButtons': Array["from"](_0x207e4c["querySelectorAll"]?.("[data-object-storage-provider]") || []),
    'providerBadge': _0x207e4c["getElementById"]('objectStorageProviderBadge'),
    'providerTitle': _0x207e4c['getElementById']("objectStorageProviderTitle"),
    'providerConsole': _0x207e4c["getElementById"]('objectStorageProviderConsole'),
    'providerTutorial': _0x207e4c['getElementById']("objectStorageProviderTutorial"),
    'providerDescription': _0x207e4c["getElementById"]("objectStorageProviderDescription"),
    'endpointField': _0x207e4c["getElementById"]("objectStorageEndpointField"),
    'regionField': _0x207e4c['getElementById']("objectStorageRegionField"),
    'addressingStyleField': _0x207e4c['getElementById']("objectStorageAddressingStyleField"),
    'addressingPath': _0x207e4c["getElementById"]("objectStorageAddressingPath"),
    'addressingVirtualHosted': _0x207e4c['getElementById']("objectStorageAddressingVirtualHosted"),
    'accessKeyIdLabel': _0x207e4c['getElementById']('objectStorageAccessKeyIdLabel'),
    'secretAccessKeyLabel': _0x207e4c['getElementById']("objectStorageSecretAccessKeyLabel")
  };
  FIELD_IDS["forEach"](_0x88b58f => {
    _0x2544d5[_0x88b58f] = _0x207e4c['getElementById'](_0x88b58f);
  });
  return _0x2544d5;
}
function setToggleButtonState(_0x440afc, _0x523cb1) {
  if (!_0x440afc) {
    return;
  }
  _0x440afc["classList"]?.["toggle"]("active", _0x523cb1);
  _0x440afc["setAttribute"]?.("aria-pressed", _0x523cb1 ? "true" : "false");
}
function isObjectStorageBusy(_0x548438) {
  return _0x548438["card"]?.["dataset"]?.['objectStorageToggleBusy'] === 'true';
}
export function setObjectStorageFormEnabled(_0x20cf04, _0x11d8b8) {
  const _0x36a074 = _0x11d8b8 === !![];
  setToggleButtonState(_0x20cf04["enabledOn"], _0x36a074);
  setToggleButtonState(_0x20cf04["enabledOff"], !_0x36a074);
  FIELD_IDS["forEach"](_0x131569 => {
    if (_0x20cf04[_0x131569]) {
      _0x20cf04[_0x131569]["disabled"] = isObjectStorageBusy(_0x20cf04);
    }
  });
  _0x20cf04["test"] && (_0x20cf04["test"]["disabled"] = isObjectStorageBusy(_0x20cf04));
  _0x20cf04['card']?.['dataset'] && (_0x20cf04["card"]["dataset"]["objectStorageEnabled"] = _0x36a074 ? "true" : "false");
}
function setStatus(_0x4e5ecf, _0x174d75, _0x2444a4) {
  const _0x1880e8 = _0x4e5ecf["status"];
  if (!_0x1880e8) {
    return;
  }
  _0x1880e8["textContent"] = String(_0x2444a4 || '');
  _0x1880e8["classList"]?.["toggle"]("is-success", _0x174d75 === "success");
  _0x1880e8["classList"]?.["toggle"]("is-error", _0x174d75 === 'error');
  _0x1880e8['classList']?.["toggle"]("is-warning", _0x174d75 === 'warning');
}
function setObjectStorageToggleBusy(_0xb0e939, _0x2920a6) {
  const _0x5d127a = _0x2920a6 === !![];
  if (_0xb0e939['enabledOn']) {
    _0xb0e939['enabledOn']["disabled"] = _0x5d127a;
  }
  if (_0xb0e939["enabledOff"]) {
    _0xb0e939['enabledOff']["disabled"] = _0x5d127a;
  }
  FIELD_IDS["forEach"](_0x14ce95 => {
    if (_0xb0e939[_0x14ce95]) {
      _0xb0e939[_0x14ce95]["disabled"] = _0x5d127a;
    }
  });
  _0xb0e939['providerButtons']?.['forEach'](_0x2c98f => {
    _0x2c98f["disabled"] = _0x5d127a;
  });
  if (_0xb0e939["addressingPath"]) {
    _0xb0e939["addressingPath"]["disabled"] = _0x5d127a;
  }
  _0xb0e939['addressingVirtualHosted'] && (_0xb0e939['addressingVirtualHosted']["disabled"] = _0x5d127a);
  _0xb0e939["test"] && (_0xb0e939['test']["disabled"] = _0x5d127a);
  _0xb0e939['card']?.["dataset"] && (_0xb0e939["card"]["dataset"]["objectStorageToggleBusy"] = _0x5d127a ? "true" : "false");
  _0x5d127a ? _0xb0e939["card"]?.['setAttribute']?.('aria-busy', "true") : _0xb0e939["card"]?.["removeAttribute"]?.('aria-busy');
}
function getSelectedProviderId(_0x400554, _0x36c805 = {}) {
  const _0xaec240 = _0x400554["providerButtons"]?.["find"](_0xc7dbc3 => _0xc7dbc3['classList']?.["contains"]("is-active") || _0xc7dbc3["getAttribute"]?.('aria-pressed') === "true");
  if (_0xaec240?.["dataset"]?.["objectStorageProvider"]) {
    return _0xaec240["dataset"]["objectStorageProvider"];
  }
  return normalizeObjectStorageSettings(_0x36c805)["providerId"];
}
function setProviderButtonState(_0x1bb0e5, _0x25cf42, _0x1ed14a) {
  _0x1bb0e5["providerButtons"]?.["forEach"](_0x45eb35 => {
    const _0x17724f = _0x45eb35["dataset"]?.['objectStorageProvider'];
    const _0x2cb0d3 = _0x17724f === _0x25cf42;
    const _0x2c0bba = isObjectStorageProviderVerified(_0x1ed14a, _0x17724f);
    const _0x64514a = PROVIDER_UI[_0x17724f];
    _0x45eb35['classList']?.["toggle"]("is-active", _0x2cb0d3);
    _0x45eb35["classList"]?.["toggle"]("is-verified", _0x2c0bba);
    _0x45eb35['setAttribute']?.("aria-pressed", _0x2cb0d3 ? 'true' : "false");
    _0x45eb35["dataset"] && (_0x45eb35["dataset"]["objectStorageVerified"] = _0x2c0bba ? "true" : 'false');
    if (_0x64514a) {
      const _0x1dd412 = tr("providers." + _0x64514a["i18nKey"] + '.title');
      _0x45eb35['setAttribute']?.("aria-label", _0x2c0bba ? _0x1dd412 + '，' + tr("status.ready") : _0x1dd412);
    }
  });
}
function setAddressingStyleState(_0x1e8744, _0xe2711b) {
  const _0x3c88bd = _0xe2711b === "virtual-hosted";
  setToggleButtonState(_0x1e8744['addressingPath'], !_0x3c88bd);
  setToggleButtonState(_0x1e8744['addressingVirtualHosted'], _0x3c88bd);
}
function getAddressingStyle(_0x2e77a5) {
  return _0x2e77a5["addressingVirtualHosted"]?.['classList']?.["contains"]("active") ? 'virtual-hosted' : "path";
}
function setHidden(_0x3c7162, _0x29e533) {
  if (_0x3c7162) {
    _0x3c7162["hidden"] = _0x29e533 === !![];
  }
}
function setPlaceholder(_0xc6c64d, _0x5603a1) {
  if (!_0xc6c64d) {
    return;
  }
  _0xc6c64d["placeholder"] = String(_0x5603a1 || '');
  _0xc6c64d["removeAttribute"]?.("data-i18n-placeholder");
}
function renderProviderPresentation(_0x51a2cd, _0x5e44b8, _0x94137b) {
  const _0x1cf52d = PROVIDER_UI[_0x5e44b8] || PROVIDER_UI["cloudflare-r2"];
  const _0xc13b53 = "providers." + _0x1cf52d['i18nKey'];
  _0x51a2cd["providerBadge"] && (_0x51a2cd["providerBadge"]["textContent"] = _0x1cf52d["badge"]);
  _0x51a2cd['providerTitle'] && (_0x51a2cd['providerTitle']["textContent"] = tr(_0xc13b53 + ".title"), _0x51a2cd["providerTitle"]["setAttribute"]?.("data-i18n", "settings.objectStorage." + _0xc13b53 + ".title"));
  _0x51a2cd['providerDescription'] && (_0x51a2cd['providerDescription']["textContent"] = tr(_0xc13b53 + ".desc"), _0x51a2cd['providerDescription']["setAttribute"]?.("data-i18n", "settings.objectStorage." + _0xc13b53 + '.desc'));
  [["accessKeyIdLabel", _0x51a2cd["accessKeyIdLabel"]], ["secretAccessKeyLabel", _0x51a2cd["secretAccessKeyLabel"]]]["forEach"](([_0x196bfb, _0x5698ff]) => {
    if (!_0x5698ff) {
      return;
    }
    _0x5698ff['textContent'] = tr(_0xc13b53 + '.' + _0x196bfb);
    _0x5698ff["setAttribute"]?.("data-i18n", "settings.objectStorage." + _0xc13b53 + '.' + _0x196bfb);
  });
  _0x51a2cd["providerConsole"] && (setHidden(_0x51a2cd['providerConsole'], !_0x1cf52d["consoleUrl"]), _0x51a2cd["providerConsole"]["dataset"]['externalUrl'] = _0x1cf52d["consoleUrl"], _0x51a2cd["providerConsole"]['setAttribute']?.('data-external-url', _0x1cf52d["consoleUrl"]), _0x1cf52d['consoleUrl'] ? (_0x51a2cd["providerConsole"]["textContent"] = tr(_0xc13b53 + ".console"), _0x51a2cd["providerConsole"]["setAttribute"]?.('data-i18n', "settings.objectStorage." + _0xc13b53 + ".console")) : (_0x51a2cd['providerConsole']["textContent"] = '', _0x51a2cd["providerConsole"]["removeAttribute"]?.("data-i18n")));
  _0x51a2cd["providerTutorial"] && (setHidden(_0x51a2cd['providerTutorial'], !_0x1cf52d['tutorialUrl']), _0x51a2cd["providerTutorial"]['dataset']['externalUrl'] = _0x1cf52d["tutorialUrl"], _0x51a2cd['providerTutorial']["setAttribute"]?.("data-external-url", _0x1cf52d['tutorialUrl']));
  setHidden(_0x51a2cd["endpointField"], !_0x1cf52d["showEndpoint"]);
  setHidden(_0x51a2cd["regionField"], !_0x1cf52d['showRegion']);
  setHidden(_0x51a2cd["addressingStyleField"], !_0x1cf52d["showAddressingStyle"]);
  setPlaceholder(_0x51a2cd["objectStorageEndpoint"], _0x1cf52d["endpointPlaceholder"]);
  setPlaceholder(_0x51a2cd["objectStorageRegion"], _0x1cf52d["regionPlaceholder"]);
  setPlaceholder(_0x51a2cd["objectStorageBucket"], _0x1cf52d['bucketPlaceholder']);
  setPlaceholder(_0x51a2cd["objectStoragePublicBaseUrl"], _0x1cf52d['publicUrlPlaceholder']);
  setAddressingStyleState(_0x51a2cd, _0x94137b['addressingStyle']);
}
export function collectObjectStorageFormConfig(_0x180372, _0x3cac28 = getObjectStorageConfig()) {
  const _0x4cba4a = normalizeObjectStorageSettings(_0x3cac28);
  const _0x5768e1 = getSelectedProviderId(_0x180372, _0x4cba4a);
  const _0x8b901c = getObjectStorageProviderProfile(_0x4cba4a, _0x5768e1);
  const _0x445300 = updateObjectStorageProviderProfile(_0x4cba4a, _0x5768e1, {
    'endpoint': _0x180372["objectStorageEndpoint"]?.["value"],
    'region': _0x180372['objectStorageRegion']?.["value"],
    'bucket': _0x180372["objectStorageBucket"]?.["value"],
    'accessKeyId': _0x180372["objectStorageAccessKeyId"]?.['value'],
    'secretAccessKey': _0x180372['objectStorageSecretAccessKey']?.["value"],
    'sessionToken': _0x8b901c["sessionToken"],
    'publicBaseUrl': _0x180372['objectStoragePublicBaseUrl']?.['value'],
    'addressingStyle': getAddressingStyle(_0x180372)
  });
  return serializeObjectStorageSettings({
    ..._0x445300,
    'enabled': _0x180372["enabledOn"]?.["classList"]?.["contains"]("active") === !![]
  });
}
export function renderObjectStorageForm(_0x457d52, _0x33cecd = {}) {
  const _0x5639c0 = normalizeObjectStorageSettings(_0x33cecd);
  const _0x4cf008 = getObjectStorageProviderProfile(_0x5639c0, _0x5639c0['providerId']);
  setProviderButtonState(_0x457d52, _0x5639c0["providerId"], _0x5639c0);
  renderProviderPresentation(_0x457d52, _0x5639c0["providerId"], _0x4cf008);
  _0x457d52["objectStorageEndpoint"] && (_0x457d52["objectStorageEndpoint"]['value'] = _0x4cf008["endpoint"]);
  _0x457d52["objectStorageRegion"] && (_0x457d52['objectStorageRegion']["value"] = _0x4cf008["region"]);
  _0x457d52['objectStorageBucket'] && (_0x457d52['objectStorageBucket']["value"] = _0x4cf008["bucket"]);
  _0x457d52["objectStorageAccessKeyId"] && (_0x457d52["objectStorageAccessKeyId"]["value"] = _0x4cf008["accessKeyId"]);
  _0x457d52["objectStorageSecretAccessKey"] && (_0x457d52['objectStorageSecretAccessKey']["value"] = _0x4cf008["secretAccessKey"]);
  _0x457d52["objectStoragePublicBaseUrl"] && (_0x457d52["objectStoragePublicBaseUrl"]["value"] = _0x4cf008["publicBaseUrl"]);
  setObjectStorageFormEnabled(_0x457d52, _0x5639c0["enabled"]);
  setStatus(_0x457d52, _0x5639c0["enabled"] ? "warning" : '', _0x5639c0["enabled"] ? tr("status.enabled") : tr("status.disabled"));
}
function setTestButtonBusy(_0x4b356b, _0x3cbb2c, _0xf9dd5f, _0x36c8b9) {
  if (!_0x4b356b) {
    return;
  }
  _0x4b356b['classList']?.["toggle"]("is-testing", _0x3cbb2c === !![]);
  _0x4b356b['setAttribute']?.("aria-busy", _0x3cbb2c ? "true" : 'false');
  _0x4b356b["textContent"] = _0x3cbb2c ? _0xf9dd5f : _0x36c8b9;
}
export async function saveObjectStorageEnabledState(_0x216648, _0x213dba, {
  getCurrentConfig = getObjectStorageConfig,
  getCurrentSnapshot = getApiConfigSnapshot,
  saveConfig = saveApiConfigToServer
} = {}) {
  if (isObjectStorageBusy(_0x216648)) {
    return {
      'ok': ![],
      'ignored': !![]
    };
  }
  const _0x5de475 = getCurrentConfig();
  setObjectStorageFormEnabled(_0x216648, _0x213dba);
  const _0x5236e1 = collectObjectStorageFormConfig(_0x216648, _0x5de475);
  if (_0x213dba && !isObjectStorageProviderVerified(_0x5236e1, _0x5236e1["providerId"])) {
    const _0xc5f68f = serializeObjectStorageSettings({
      ..._0x5236e1,
      'enabled': ![]
    });
    renderObjectStorageForm(_0x216648, _0xc5f68f);
    const _0xf6909e = tr("status.testRequired");
    setStatus(_0x216648, "warning", _0xf6909e);
    return {
      'ok': ![],
      'blocked': !![],
      'message': _0xf6909e,
      'objectStorage': _0xc5f68f
    };
  }
  setObjectStorageToggleBusy(_0x216648, !![]);
  setStatus(_0x216648, 'warning', tr("actions.saving"));
  try {
    const _0x140420 = _0x213dba ? serializeObjectStorageSettings({
      ..._0x5236e1,
      'enabled': !![]
    }) : serializeObjectStorageSettings({
      ..._0x5236e1,
      'enabled': ![]
    });
    if (_0x213dba) {
      validateObjectStorageConfig(_0x140420);
    }
    await saveConfig({
      ...getCurrentSnapshot(),
      'objectStorage': _0x140420
    });
    const _0x14a810 = _0x213dba ? tr("status.savedEnabled") : tr("status.savedDisabled");
    setStatus(_0x216648, _0x213dba ? 'success' : '', _0x14a810);
    return {
      'ok': !![],
      'message': _0x14a810,
      'objectStorage': _0x140420
    };
  } catch (_0x5a2a86) {
    renderObjectStorageForm(_0x216648, _0x5de475);
    const _0x27140c = tr('status.saveFailed', {
      'error': _0x5a2a86?.['message'] || tr('status.unknownError')
    });
    setStatus(_0x216648, "error", _0x27140c);
    return {
      'ok': ![],
      'error': _0x5a2a86,
      'message': _0x27140c
    };
  } finally {
    setObjectStorageToggleBusy(_0x216648, ![]);
  }
}
export async function saveObjectStorageFieldChanges(_0x3940ef, {
  getCurrentConfig = getObjectStorageConfig,
  getCurrentSnapshot = getApiConfigSnapshot,
  saveConfig = saveApiConfigToServer
} = {}) {
  if (isObjectStorageBusy(_0x3940ef)) {
    return {
      'ok': ![],
      'ignored': !![]
    };
  }
  const _0x34edf0 = getCurrentConfig();
  const _0x3b3366 = normalizeObjectStorageSettings(_0x34edf0)["enabled"];
  setObjectStorageToggleBusy(_0x3940ef, !![]);
  setStatus(_0x3940ef, "warning", tr("actions.saving"));
  try {
    const _0x22cd90 = collectObjectStorageFormConfig(_0x3940ef, _0x34edf0);
    const _0x37b171 = _0x3b3366 && !_0x22cd90["enabled"];
    _0x22cd90['enabled'] && validateObjectStorageConfig(_0x22cd90);
    await saveConfig({
      ...getCurrentSnapshot(),
      'objectStorage': _0x22cd90
    });
    renderObjectStorageForm(_0x3940ef, _0x22cd90);
    const _0x2e65d7 = _0x37b171 ? tr('status.changedRequiresRetest') : tr("status.saveSuccess");
    setStatus(_0x3940ef, _0x37b171 ? 'warning' : "success", _0x2e65d7);
    return {
      'ok': !![],
      'disabledAfterChange': _0x37b171,
      'message': _0x2e65d7,
      'objectStorage': _0x22cd90
    };
  } catch (_0x18b868) {
    renderObjectStorageForm(_0x3940ef, _0x34edf0);
    const _0x436e51 = tr('status.saveFailed', {
      'error': _0x18b868?.["message"] || tr("status.unknownError")
    });
    setStatus(_0x3940ef, 'error', _0x436e51);
    return {
      'ok': ![],
      'error': _0x18b868,
      'message': _0x436e51
    };
  } finally {
    setObjectStorageToggleBusy(_0x3940ef, ![]);
  }
}
export async function saveObjectStorageProviderSelection(_0x3fe43b, _0x34557b, {
  getCurrentConfig = getObjectStorageConfig,
  getCurrentSnapshot = getApiConfigSnapshot,
  saveConfig = saveApiConfigToServer
} = {}) {
  if (isObjectStorageBusy(_0x3fe43b) || !Object['prototype']['hasOwnProperty']["call"](PROVIDER_UI, _0x34557b)) {
    return {
      'ok': ![],
      'ignored': !![]
    };
  }
  const _0x23ad01 = getCurrentConfig();
  const _0xa44885 = normalizeObjectStorageSettings(_0x23ad01)["enabled"];
  const _0x2d56c8 = collectObjectStorageFormConfig(_0x3fe43b, _0x23ad01);
  if (_0x2d56c8["providerId"] === _0x34557b) {
    return {
      'ok': !![],
      'ignored': !![],
      'objectStorage': _0x2d56c8
    };
  }
  let _0x52092f = serializeObjectStorageSettings({
    ..._0x2d56c8,
    'providerId': _0x34557b,
    'enabled': _0xa44885
  });
  let _0x3a86f6 = _0xa44885 && !_0x52092f['enabled'];
  if (_0x52092f["enabled"]) {
    try {
      validateObjectStorageConfig(_0x52092f);
    } catch {
      _0x52092f = serializeObjectStorageSettings({
        ..._0x52092f,
        'enabled': ![]
      });
      _0x3a86f6 = !![];
    }
  }
  renderObjectStorageForm(_0x3fe43b, _0x52092f);
  setObjectStorageToggleBusy(_0x3fe43b, !![]);
  setStatus(_0x3fe43b, 'warning', tr("actions.saving"));
  try {
    await saveConfig({
      ...getCurrentSnapshot(),
      'objectStorage': _0x52092f
    });
    renderObjectStorageForm(_0x3fe43b, _0x52092f);
    const _0x5dc679 = PROVIDER_UI[_0x34557b];
    const _0x52a900 = tr("providers." + _0x5dc679["i18nKey"] + '.title');
    const _0xa9dbfd = _0x3a86f6 ? tr("status.providerSelectedDisabled", {
      'provider': _0x52a900
    }) : tr("status.providerSelected", {
      'provider': _0x52a900
    });
    setStatus(_0x3fe43b, _0x3a86f6 ? 'warning' : 'success', _0xa9dbfd);
    return {
      'ok': !![],
      'disabledAfterSelection': _0x3a86f6,
      'message': _0xa9dbfd,
      'objectStorage': _0x52092f
    };
  } catch (_0x26df49) {
    renderObjectStorageForm(_0x3fe43b, _0x23ad01);
    const _0x550826 = tr('status.saveFailed', {
      'error': _0x26df49?.["message"] || tr("status.unknownError")
    });
    setStatus(_0x3fe43b, "error", _0x550826);
    return {
      'ok': ![],
      'error': _0x26df49,
      'message': _0x550826
    };
  } finally {
    setObjectStorageToggleBusy(_0x3fe43b, ![]);
  }
}
export async function verifyObjectStorageConnection(_0x4c9bd5, {
  getCurrentConfig = getObjectStorageConfig,
  getCurrentSnapshot = getApiConfigSnapshot,
  testConnection = testObjectStorageConnection,
  saveConfig = saveApiConfigToServer,
  now = Date["now"]
} = {}) {
  if (isObjectStorageBusy(_0x4c9bd5)) {
    return {
      'ok': ![],
      'ignored': !![]
    };
  }
  const _0x574890 = tr("actions.test");
  const _0x3ed28b = getCurrentConfig();
  let _0x2408b8;
  try {
    _0x2408b8 = collectObjectStorageFormConfig(_0x4c9bd5, _0x3ed28b);
    validateObjectStorageConfig(_0x2408b8, {
      'requireEnabled': ![]
    });
    setObjectStorageToggleBusy(_0x4c9bd5, !![]);
    setTestButtonBusy(_0x4c9bd5['test'], !![], tr('actions.testing'), _0x574890);
    setStatus(_0x4c9bd5, "warning", tr("status.testing"));
    const _0x538adb = await testConnection(_0x2408b8);
    const _0xfc3b5e = serializeObjectStorageSettings(markObjectStorageProviderVerified(_0x2408b8, _0x2408b8["providerId"], {
      'verifiedAt': now()
    }));
    await saveConfig({
      ...getCurrentSnapshot(),
      'objectStorage': _0xfc3b5e
    });
    renderObjectStorageForm(_0x4c9bd5, _0xfc3b5e);
    const _0x3721af = _0x538adb?.['cleanupOk'] === ![] ? '\x20' + tr("status.testCleanupWarning") : '';
    const _0x489528 = '' + tr('status.testSuccess') + _0x3721af;
    setStatus(_0x4c9bd5, "success", _0x489528);
    return {
      'ok': !![],
      'message': _0x489528,
      'objectStorage': _0xfc3b5e,
      'result': _0x538adb
    };
  } catch (_0x525685) {
    const _0x5c4e5e = tr("status.testFailed", {
      'error': _0x525685?.["message"] || tr('status.unknownError')
    });
    setStatus(_0x4c9bd5, "error", _0x5c4e5e);
    return {
      'ok': ![],
      'error': _0x525685,
      'message': _0x5c4e5e,
      'objectStorage': _0x2408b8
    };
  } finally {
    setTestButtonBusy(_0x4c9bd5["test"], ![], tr("actions.testing"), _0x574890);
    setObjectStorageToggleBusy(_0x4c9bd5, ![]);
  }
}
function showToast(_0x28c563, _0x3d14c6 = '') {
  globalThis['window']?.['showToast']?.(_0x28c563, _0x3d14c6);
}
export function initObjectStorageSettings({
  documentObject = globalThis["document"],
  windowObject = globalThis["window"]
} = {}) {
  const _0x17911e = getElements(documentObject);
  if (!_0x17911e["card"] || _0x17911e["card"]["dataset"]?.['objectStorageBound'] === "true") {
    return ![];
  }
  _0x17911e["card"]["dataset"]['objectStorageBound'] = "true";
  renderObjectStorageForm(_0x17911e, getObjectStorageConfig());
  const _0x463be2 = async _0x43dffd => {
    const _0x584938 = await saveObjectStorageEnabledState(_0x17911e, _0x43dffd);
    if (_0x584938["ignored"]) {
      return;
    }
    showToast(_0x584938['ok'] ? tr('status.saveSuccess') : _0x584938["message"], _0x584938['ok'] ? '' : _0x584938['blocked'] ? 'warning' : "error");
  };
  _0x17911e["enabledOn"]?.["addEventListener"]("click", () => {
    void _0x463be2(!![]);
  });
  _0x17911e['enabledOff']?.['addEventListener']('click', () => {
    void _0x463be2(![]);
  });
  _0x17911e["providerButtons"]?.["forEach"](_0x11324f => {
    _0x11324f["addEventListener"]?.("click", async () => {
      const _0x2d8cde = await saveObjectStorageProviderSelection(_0x17911e, _0x11324f["dataset"]?.["objectStorageProvider"]);
      !_0x2d8cde['ok'] && !_0x2d8cde["ignored"] && showToast(_0x2d8cde['message'], "error");
    });
  });
  FIELD_IDS["forEach"](_0x3300f0 => {
    _0x17911e[_0x3300f0]?.["addEventListener"]("change", async () => {
      const _0x1d5c5a = await saveObjectStorageFieldChanges(_0x17911e);
      !_0x1d5c5a['ok'] && !_0x1d5c5a["ignored"] && showToast(_0x1d5c5a["message"], 'error');
    });
  });
  const _0x3d96b4 = _0x12f15f => {
    setAddressingStyleState(_0x17911e, _0x12f15f);
    void saveObjectStorageFieldChanges(_0x17911e)["then"](_0x144c94 => {
      !_0x144c94['ok'] && !_0x144c94["ignored"] && showToast(_0x144c94["message"], "error");
    });
  };
  _0x17911e["addressingPath"]?.["addEventListener"]("click", () => {
    _0x3d96b4("path");
  });
  _0x17911e["addressingVirtualHosted"]?.["addEventListener"]("click", () => {
    _0x3d96b4("virtual-hosted");
  });
  _0x17911e["test"]?.['addEventListener']('click', async () => {
    const _0x347cdd = await verifyObjectStorageConnection(_0x17911e);
    if (_0x347cdd['ignored']) {
      return;
    }
    showToast(_0x347cdd['message'], _0x347cdd['ok'] ? '' : "error");
  });
  windowObject?.["addEventListener"]?.(API_CONFIG_CHANGED_EVENT, () => {
    renderObjectStorageForm(_0x17911e, getObjectStorageConfig());
  });
  return !![];
}
export const __objectStorageSettingsForTest = Object["freeze"]({
  'FIELD_IDS': FIELD_IDS,
  'PROVIDER_UI': PROVIDER_UI,
  'getElements': getElements
});