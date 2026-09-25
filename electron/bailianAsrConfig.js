import { readFileSync } from 'node:fs';
import a194_0x41f51e from 'node:path';
export function createBailianAsrConfigResolver({
  getUserRoot: _0x80717,
  getSecureSettingsStore: _0x39c273
} = {}) {
  return () => {
    let _0x139bd3 = {};
    try {
      _0x139bd3 = JSON["parse"](readFileSync(a194_0x41f51e["join"](_0x80717(), "config.json"), "utf8"))?.["providers"]?.["bailian"] || {};
    } catch {}
    const _0x5d7f46 = 'apiConfig.providers.bailian.apiKey';
    let _0xd8292 = '';
    try {
      _0xd8292 = _0x39c273?.()["getMany"]?.([_0x5d7f46])?.[_0x5d7f46] || '';
    } catch {}
    return {
      'apiKey': String(_0xd8292 || _0x139bd3['apiKey'] || '')["trim"](),
      'baseUrl': String(_0x139bd3["apiUrl"] || '')["trim"]()
    };
  };
}