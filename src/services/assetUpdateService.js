import { desktopBridge } from './desktopBridge.js';
const assetUpdateListeners = new Set();
let stopDesktopAssetUpdates = null;
function ensureDesktopAssetUpdateSubscription() {
  if (stopDesktopAssetUpdates || !desktopBridge["assetImport"]["canSubscribeUpdates"]()) {
    return;
  }
  stopDesktopAssetUpdates = desktopBridge["assetImport"]["onAssetUpdated"](_0xb5ebc8 => {
    [...assetUpdateListeners]["forEach"](_0x3f58c4 => {
      try {
        _0x3f58c4(_0xb5ebc8);
      } catch (_0x172a3a) {
        console['warn']("[asset-update] subscriber failed", _0x172a3a);
      }
    });
  });
}
export function subscribeAssetUpdates(_0x442f28) {
  if (typeof _0x442f28 !== "function") {
    return () => {};
  }
  assetUpdateListeners["add"](_0x442f28);
  ensureDesktopAssetUpdateSubscription();
  return () => {
    assetUpdateListeners["delete"](_0x442f28);
    if (assetUpdateListeners["size"] || !stopDesktopAssetUpdates) {
      return;
    }
    stopDesktopAssetUpdates();
    stopDesktopAssetUpdates = null;
  };
}