import { normalizeGenerationParams, normalizeGenerationParamsByModel } from '../modelGenerationParamMemory.js';
const STORAGE_KEY = 'aiCanvas.agentModelSettings.v1';
const DEFAULT_AGENT_MODEL_SETTINGS = Object["freeze"]({
  'provider': "volcengine",
  'model': "volcengine/doubao-seed-2-1-turbo-260628",
  'providerProfileId': '',
  'providerProfileIdByModel': Object["freeze"]({}),
  'generationParams': Object["freeze"]({}),
  'generationParamsByModel': Object["freeze"]({}),
  'temperature': 0x0,
  'executionMode': "manual"
});
function getWindowObject(_0x38923d) {
  if (_0x38923d) {
    return _0x38923d;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  return null;
}
function normalizeProviderProfileMemory(_0x176550) {
  if (!_0x176550 || typeof _0x176550 !== "object" || Array["isArray"](_0x176550)) {
    return {};
  }
  return Object['fromEntries'](Object["entries"](_0x176550)["map"](([_0x79d086, _0x205ddd]) => [String(_0x79d086 || '')['trim'](), String(_0x205ddd || '')["trim"]()])['filter'](([_0x1d96f3, _0x3683d4]) => _0x1d96f3 && _0x3683d4));
}
function normalizeSettings(_0x3091c4 = {}) {
  const _0x18dd19 = String(_0x3091c4['executionMode'] || '')["trim"]() === 'auto' ? 'auto' : "manual";
  const _0x4a9fd2 = String(_0x3091c4['provider'] || '')["trim"]();
  const _0x48893c = String(_0x3091c4["model"] || '')['trim']();
  const _0x25af5e = Boolean(_0x4a9fd2 && _0x48893c);
  return {
    'provider': _0x25af5e ? _0x4a9fd2 : DEFAULT_AGENT_MODEL_SETTINGS["provider"],
    'model': _0x25af5e ? _0x48893c : DEFAULT_AGENT_MODEL_SETTINGS['model'],
    'providerProfileId': String(_0x3091c4["providerProfileId"] || '')['trim'](),
    'providerProfileIdByModel': normalizeProviderProfileMemory(_0x3091c4["providerProfileIdByModel"]),
    'generationParams': normalizeGenerationParams(_0x3091c4["generationParams"]),
    'generationParamsByModel': normalizeGenerationParamsByModel(_0x3091c4["generationParamsByModel"]),
    'temperature': Number["isFinite"](Number(_0x3091c4["temperature"])) ? Math["max"](0x0, Math["min"](0x2, Number(_0x3091c4["temperature"]))) : DEFAULT_AGENT_MODEL_SETTINGS['temperature'],
    'executionMode': _0x18dd19
  };
}
export function createAgentModelSettings({
  windowObject = undefined
} = {}) {
  const _0xd06d5d = getWindowObject(windowObject);
  function _0x106e3e() {
    try {
      const _0x5d05f5 = _0xd06d5d?.["localStorage"]?.["getItem"]?.(STORAGE_KEY);
      if (!_0x5d05f5) {
        return {
          ...DEFAULT_AGENT_MODEL_SETTINGS
        };
      }
      return normalizeSettings({
        ...DEFAULT_AGENT_MODEL_SETTINGS,
        ...JSON["parse"](_0x5d05f5)
      });
    } catch {
      return {
        ...DEFAULT_AGENT_MODEL_SETTINGS
      };
    }
  }
  function _0x2cdc09(_0x277d5b = {}) {
    const _0x38bde5 = normalizeSettings({
      ..._0x106e3e(),
      ..._0x277d5b
    });
    try {
      _0xd06d5d?.["localStorage"]?.["setItem"]?.(STORAGE_KEY, JSON["stringify"](_0x38bde5));
    } catch {}
    return _0x38bde5;
  }
  return {
    'getSettings': _0x106e3e,
    'updateSettings': _0x2cdc09
  };
}
export { DEFAULT_AGENT_MODEL_SETTINGS };