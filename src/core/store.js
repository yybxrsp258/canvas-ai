import a675_0x1f8403, { createStore } from './stores/appStore.js';
let hasWarnedLegacyEntry = ![];
function warnLegacyEntryOnce() {
  if (hasWarnedLegacyEntry) {
    return;
  }
  hasWarnedLegacyEntry = !![];
  try {
    console["warn"]('[store]\x20`src/core/store.js`\x20已进入兼容阶段，请迁移到\x20`src/core/stores/appStore.js`\x20或\x20graph/ui/workspace\x20分域入口。');
  } catch {}
}
warnLegacyEntryOnce();
export default a675_0x1f8403;
export { createStore };