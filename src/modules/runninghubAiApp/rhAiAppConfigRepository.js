import { desktopBridge } from '../../services/desktopBridge.js';
import { SOURCE_TYPES, SOURCE_TYPE_KEYS, COMFYUI_WORKFLOW_STATE_SCOPE, normalizeSourceType, isComfyUiSource, isRunningHubSource } from './rhAiAppSources.js';
import { RUNNINGHUB_DOMESTIC_PROFILE_ID, normalizeRunningHubModelApiProfileId, resolveRunningHubSiteProfileIdFromUrl } from '../runningHubProviderProfiles.js';
const PANEL_KIND_KEYS = Object["freeze"](["image", "video", "audio"]);
const DEFAULT_AI_APP_NAME = "未命名 AI应用";
const SAVED_APPS_STORAGE_KEY = "aiCanvas.runningHubAiApp.savedApps.v1";
const PANEL_DRAFT_STORAGE_KEY = "aiCanvas.runningHubAiApp.panelDraft.v1";
const CUSTOM_AI_APP_STORAGE_SAVE_DELAY_MS = 0xfa;
function normalizeKind(_0x15e3cb) {
  return PANEL_KIND_KEYS["includes"](_0x15e3cb) ? _0x15e3cb : "image";
}
function cloneComponentDrafts(_0x480fa6 = []) {
  return Array['isArray'](_0x480fa6) ? _0x480fa6["map"](_0x478207 => ({
    ..._0x478207
  })) : [];
}
function normalizeAppName(_0x2a7ec1) {
  const _0x42b48b = String(_0x2a7ec1 || '')['trim']();
  return _0x42b48b || DEFAULT_AI_APP_NAME;
}
function normalizeAppDescription(_0x22371d) {
  return String(_0x22371d || '')['trim']();
}
function normalizePromptHelpTooltip(_0x972eb5) {
  return String(_0x972eb5 || '')["trim"]();
}
function buildKindStateKey(_0x182b23, _0x28d259) {
  const _0x5f3443 = normalizeKind(_0x28d259);
  const _0x46307e = normalizeSourceType(_0x182b23);
  const _0x31c254 = isComfyUiSource(_0x46307e) ? COMFYUI_WORKFLOW_STATE_SCOPE : isRunningHubSource(_0x46307e) ? SOURCE_TYPES['runninghub'] : _0x46307e;
  return _0x31c254 ? _0x31c254 + ':' + _0x5f3443 : _0x5f3443;
}
function buildLegacyKindStateKey(_0xf87a2e, _0x2d3165) {
  const _0x360451 = normalizeKind(_0x2d3165);
  const _0x2ac631 = normalizeSourceType(_0xf87a2e);
  return _0x2ac631 ? _0x2ac631 + ':' + _0x360451 : _0x360451;
}
function createSavedAppId() {
  const _0x564719 = typeof globalThis['crypto']?.["randomUUID"] === "function" ? globalThis["crypto"]["randomUUID"]() : Date["now"]() + '-' + Math["random"]()["toString"](0x24)["slice"](0x2, 0xa);
  return 'rh-ai-app-' + _0x564719;
}
function serializeSavedAppRecord(_0x22204a = {}) {
  return {
    'id': String(_0x22204a['id'] || '')["trim"](),
    'sourceType': normalizeSourceType(_0x22204a["sourceType"]) || SOURCE_TYPES["runninghub"],
    'kind': normalizeKind(_0x22204a["kind"]),
    'runningHubProfileId': normalizeRunningHubModelApiProfileId(_0x22204a["runningHubProfileId"] || resolveRunningHubSiteProfileIdFromUrl(_0x22204a["input"]) || RUNNINGHUB_DOMESTIC_PROFILE_ID),
    'name': normalizeAppName(_0x22204a["name"]),
    'description': normalizeAppDescription(_0x22204a["description"]),
    'promptHelpTooltip': normalizePromptHelpTooltip(_0x22204a["promptHelpTooltip"]),
    'input': String(_0x22204a["input"] || ''),
    'componentDraftKey': String(_0x22204a["componentDraftKey"] || ''),
    'componentDrafts': cloneComponentDrafts(_0x22204a["componentDrafts"]),
    'createdAt': String(_0x22204a['createdAt'] || ''),
    'updatedAt': String(_0x22204a['updatedAt'] || '')
  };
}
function normalizeSavedAppRecord(_0x5492fd = {}) {
  const _0x233012 = serializeSavedAppRecord(_0x5492fd);
  if (!_0x233012['id'] || !_0x233012["input"]['trim']()) {
    return null;
  }
  return _0x233012;
}
function loadSavedAppsFromStorage(_0x302f71, _0x28ab3a) {
  try {
    const _0x553305 = _0x302f71?.['getItem']?.(SAVED_APPS_STORAGE_KEY);
    const _0xa79f6b = _0x553305 ? JSON["parse"](_0x553305) : [];
    if (!Array['isArray'](_0xa79f6b)) {
      return [];
    }
    return _0xa79f6b["map"](normalizeSavedAppRecord)["filter"](Boolean);
  } catch (_0x4b02c4) {
    _0x28ab3a("[RH AI App] load saved apps failed:", _0x4b02c4);
    return [];
  }
}
function saveSavedAppsToStorage(_0x226396, _0x17e58a = [], _0x5d7835) {
  try {
    const _0xe7728e = _0x17e58a["map"](serializeSavedAppRecord);
    _0x226396?.['setItem']?.(SAVED_APPS_STORAGE_KEY, JSON["stringify"](_0xe7728e));
  } catch (_0x45a58b) {
    _0x5d7835("[RH AI App] save saved apps failed:", _0x45a58b);
  }
}
function createEmptyKindState() {
  return {
    'input': '',
    'appName': DEFAULT_AI_APP_NAME,
    'appDescription': '',
    'promptHelpTooltip': '',
    'runningHubProfileId': '',
    'savedAppId': '',
    'componentDraftKey': '',
    'componentDrafts': [],
    'componentCandidates': [],
    'currentBundle': null,
    'errorMessage': ''
  };
}
function createInitialKindStates() {
  const _0x410f20 = PANEL_KIND_KEYS["reduce"]((_0x2b8f89, _0x4b72c0) => {
    _0x2b8f89[_0x4b72c0] = createEmptyKindState();
    return _0x2b8f89;
  }, {});
  SOURCE_TYPE_KEYS["forEach"](_0x109c0f => {
    PANEL_KIND_KEYS["forEach"](_0x3fb3eb => {
      _0x410f20[buildKindStateKey(_0x109c0f, _0x3fb3eb)] = createEmptyKindState();
    });
  });
  return _0x410f20;
}
function serializeKindStateForStorage(_0x5e0b61 = {}) {
  return {
    'sourceType': normalizeSourceType(_0x5e0b61["sourceType"]),
    'definitionReference': String(_0x5e0b61["definitionReference"] || ''),
    'input': String(_0x5e0b61['input'] || ''),
    'appName': normalizeAppName(_0x5e0b61["appName"]),
    'appDescription': normalizeAppDescription(_0x5e0b61['appDescription']),
    'promptHelpTooltip': normalizePromptHelpTooltip(_0x5e0b61['promptHelpTooltip']),
    'runningHubProfileId': String(_0x5e0b61["runningHubProfileId"] || '')['trim']() ? normalizeRunningHubModelApiProfileId(_0x5e0b61["runningHubProfileId"]) : '',
    'savedAppId': String(_0x5e0b61["savedAppId"] || ''),
    'componentDraftKey': String(_0x5e0b61["componentDraftKey"] || ''),
    'componentDrafts': cloneComponentDrafts(_0x5e0b61['componentDrafts']),
    'componentCandidates': cloneComponentDrafts(_0x5e0b61['componentCandidates']),
    'errorMessage': String(_0x5e0b61['errorMessage'] || '')
  };
}
function normalizeStoredKindState(_0x4ac6e0 = {}) {
  return {
    ...createEmptyKindState(),
    ...serializeKindStateForStorage(_0x4ac6e0),
    'currentBundle': null
  };
}
function normalizeKindStates(_0x2bf3c6 = {}) {
  const _0x5762cd = createInitialKindStates();
  Object["entries"](_0x2bf3c6 || {})["forEach"](([_0x38a882, _0x3219e0]) => {
    if (!_0x38a882) {
      return;
    }
    _0x5762cd[_0x38a882] = normalizeStoredKindState(_0x3219e0);
  });
  return _0x5762cd;
}
function loadPanelDraftFromStorage(_0x35487e, _0x28913c) {
  try {
    const _0x2c9052 = _0x35487e?.['getItem']?.(PANEL_DRAFT_STORAGE_KEY);
    const _0x4cf41b = _0x2c9052 ? JSON['parse'](_0x2c9052) : null;
    if (!_0x4cf41b || typeof _0x4cf41b !== "object") {
      return null;
    }
    return normalizePanelDraftPayload(_0x4cf41b);
  } catch (_0x32a744) {
    _0x28913c("[RH AI App] load panel draft failed:", _0x32a744);
    return null;
  }
}
function savePanelDraftToStorage(_0x1189b8, _0x31387b, _0x59fbc1) {
  try {
    const _0x111474 = serializePanelDraftForStorage(_0x31387b);
    _0x1189b8?.["setItem"]?.(PANEL_DRAFT_STORAGE_KEY, JSON["stringify"](_0x111474));
  } catch (_0x157dd9) {
    _0x59fbc1("[RH AI App] save panel draft failed:", _0x157dd9);
  }
}
function serializePanelDraftForStorage({
  sourceType = '',
  kind = "image",
  kindStates = {}
} = {}) {
  return {
    'sourceType': normalizeSourceType(sourceType),
    'kind': normalizeKind(kind),
    'kindStates': Object["keys"](kindStates || {})["reduce"]((_0x22dc4d, _0x5eabd9) => {
      _0x22dc4d[_0x5eabd9] = serializeKindStateForStorage(kindStates[_0x5eabd9]);
      return _0x22dc4d;
    }, {})
  };
}
function normalizePanelDraftPayload(_0x37d3f2 = {}) {
  if (!_0x37d3f2 || typeof _0x37d3f2 !== "object") {
    return null;
  }
  const _0x43d9f4 = _0x37d3f2["kindStates"] && typeof _0x37d3f2["kindStates"] === "object" ? _0x37d3f2["kindStates"] : {};
  return {
    'sourceType': normalizeSourceType(_0x37d3f2["sourceType"]),
    'kind': normalizeKind(_0x37d3f2["kind"]),
    'kindStates': normalizeKindStates(_0x43d9f4)
  };
}
function normalizeCustomAiAppStoragePayload(_0xd3aa10 = {}) {
  const _0x3dc184 = Array["isArray"](_0xd3aa10?.['savedApps']) ? _0xd3aa10['savedApps']["map"](normalizeSavedAppRecord)["filter"](Boolean) : [];
  return {
    'ok': _0xd3aa10?.['ok'] !== ![],
    'hasData': _0xd3aa10?.['hasData'] === !![],
    'storageRoot': String(_0xd3aa10?.["storageRoot"] || ''),
    'savedApps': _0x3dc184,
    'panelDraft': normalizePanelDraftPayload(_0xd3aa10?.['panelDraft'])
  };
}
function buildCustomAiAppStoragePayload({
  savedApps = [],
  sourceType = '',
  kind = "image",
  kindStates = {}
} = {}) {
  return {
    'savedApps': savedApps["map"](serializeSavedAppRecord),
    'panelDraft': serializePanelDraftForStorage({
      'sourceType': sourceType,
      'kind': kind,
      'kindStates': kindStates
    })
  };
}
function getCustomAiAppStorageBridge(_0x3204f2) {
  return _0x3204f2?.["isAvailable"]?.() === !![] ? _0x3204f2 : null;
}
async function readCustomAiAppsFromFileStorage(_0x50c39f) {
  const _0x58e6b8 = getCustomAiAppStorageBridge(_0x50c39f);
  if (!_0x58e6b8) {
    return null;
  }
  const _0x21d652 = await _0x58e6b8["read"]();
  return normalizeCustomAiAppStoragePayload(_0x21d652);
}
async function writeCustomAiAppsToFileStorage(_0xb8c1f2, _0x1e20ff) {
  const _0x46d3e0 = getCustomAiAppStorageBridge(_0xb8c1f2);
  if (!_0x46d3e0) {
    return null;
  }
  return await _0x46d3e0["write"](_0x1e20ff);
}
export function createRhAiAppConfigRepository({
  storage = globalThis["window"]?.["localStorage"] || globalThis["localStorage"],
  externalBridge = desktopBridge["customAiApps"],
  windowObject = globalThis['window'] || globalThis,
  getSnapshot = () => ({}),
  applyExternalSnapshot = () => {},
  onWarning = (..._0x1e1e9b) => console['warn'](..._0x1e1e9b)
} = {}) {
  let _0x2ef77b = ![];
  let _0x418e17 = ![];
  let _0x3483fe = ![];
  let _0x5de0b5 = 0x0;
  const _0x420fbc = () => {
    if (!_0x5de0b5) {
      return;
    }
    windowObject?.["clearTimeout"]?.(_0x5de0b5);
    _0x5de0b5 = 0x0;
  };
  const _0x5ccffd = {
    'loadLocalSeed'() {
      const _0x3dc152 = loadPanelDraftFromStorage(storage, onWarning);
      const _0x12eba0 = loadSavedAppsFromStorage(storage, onWarning);
      return {
        'panelDraft': _0x3dc152,
        'savedApps': _0x12eba0,
        'hasData': Boolean(_0x3dc152) || _0x12eba0["length"] > 0x0
      };
    },
    'saveSavedApps'(_0x5e427c = []) {
      saveSavedAppsToStorage(storage, _0x5e427c, onWarning);
      _0x5ccffd["scheduleExternalPersist"]();
    },
    'savePanelDraft'(_0x2d51f0 = {}) {
      savePanelDraftToStorage(storage, _0x2d51f0, onWarning);
      _0x5ccffd['scheduleExternalPersist']();
    },
    'createInitialKindStates': createInitialKindStates,
    'createEmptyKindState': createEmptyKindState,
    'getKindStateKey': buildKindStateKey,
    'getLegacyKindStateKey': buildLegacyKindStateKey,
    'buildSavedAppRecord'(_0x4fab0d = {}, _0x3846c4 = null) {
      const _0x51aafd = new Date()['toISOString']();
      return serializeSavedAppRecord({
        ..._0x3846c4,
        ..._0x4fab0d,
        'id': String(_0x3846c4?.['id'] || _0x4fab0d?.['id'] || '')["trim"]() || createSavedAppId(),
        'createdAt': _0x3846c4?.["createdAt"] || _0x4fab0d?.["createdAt"] || _0x51aafd,
        'updatedAt': _0x51aafd
      });
    },
    async 'hydrateExternalStorage'({
      hasLocalSeed = ![]
    } = {}) {
      try {
        const _0xdee20c = await readCustomAiAppsFromFileStorage(externalBridge);
        if (!_0xdee20c) {
          return null;
        }
        _0x2ef77b = !![];
        if (_0x3483fe) {
          await _0x5ccffd["flushExternalPersist"]();
          return _0xdee20c;
        }
        if (_0xdee20c["hasData"]) {
          _0x418e17 = !![];
          try {
            await applyExternalSnapshot(_0xdee20c);
          } finally {
            _0x418e17 = ![];
            _0x3483fe = ![];
          }
          return _0xdee20c;
        }
        hasLocalSeed && (await _0x5ccffd["flushExternalPersist"]());
        return _0xdee20c;
      } catch (_0x587ede) {
        onWarning('[RH\x20AI\x20App]\x20hydrate\x20file\x20storage\x20failed:', _0x587ede);
        return null;
      }
    },
    'scheduleExternalPersist'() {
      if (_0x418e17 || !getCustomAiAppStorageBridge(externalBridge)) {
        return ![];
      }
      if (!_0x2ef77b) {
        _0x3483fe = !![];
        return ![];
      }
      _0x3483fe = ![];
      _0x420fbc();
      _0x5de0b5 = windowObject?.['setTimeout']?.(() => void _0x5ccffd["flushExternalPersist"](), CUSTOM_AI_APP_STORAGE_SAVE_DELAY_MS);
      return !![];
    },
    async 'flushExternalPersist'() {
      if (!getCustomAiAppStorageBridge(externalBridge)) {
        return null;
      }
      _0x420fbc();
      const _0x3d9ca1 = buildCustomAiAppStoragePayload(getSnapshot());
      try {
        const _0x2dc394 = await writeCustomAiAppsToFileStorage(externalBridge, _0x3d9ca1);
        _0x3483fe = ![];
        return _0x2dc394;
      } catch (_0x37d6f5) {
        onWarning("[RH AI App] persist file storage failed:", _0x37d6f5);
        return null;
      }
    },
    'dispose'() {
      _0x420fbc();
    }
  };
  return Object["freeze"](_0x5ccffd);
}