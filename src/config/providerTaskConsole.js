import { PROVIDERS_META } from '../modules/providers.js';
export function getProviderTaskConsoleUrl(_0x15579b = {}) {
  const _0x475139 = _0x15579b['providerProfileId'] || _0x15579b['provider'];
  return PROVIDERS_META[_0x475139]?.["taskHistoryUrls"]?.[_0x15579b["adapterType"]] || '';
}