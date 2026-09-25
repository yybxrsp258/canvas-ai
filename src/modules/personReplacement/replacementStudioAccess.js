import { REPLACEMENT_STUDIO_VIP_MODEL_ID } from '../subscriptionAccess.js';
const REPLACEMENT_STUDIO_VIP_PROVIDER = "aicanvas";
export function isReplacementStudioAuthorized(_0x278e51 = globalThis["window"]) {
  const _0x22e6bf = _0x278e51?.["isModelAllowedBySubscription"];
  return typeof _0x22e6bf === "function" && _0x22e6bf(REPLACEMENT_STUDIO_VIP_MODEL_ID, REPLACEMENT_STUDIO_VIP_PROVIDER) === !![];
}
export function requestReplacementStudioAuthorization({
  windowObject = globalThis["window"],
  onSuccess = null
} = {}) {
  if (typeof windowObject?.["openSubscriptionDialog"] === "function") {
    windowObject["openSubscriptionDialog"]({
      'modelId': REPLACEMENT_STUDIO_VIP_MODEL_ID,
      'provider': REPLACEMENT_STUDIO_VIP_PROVIDER,
      'onSuccess': onSuccess
    });
    return !![];
  }
  windowObject?.['showToast']?.("需要VIP授权，请先激活CDKEY", "warn");
  return ![];
}