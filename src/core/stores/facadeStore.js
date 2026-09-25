import { createLegacyKernelStore } from './legacyKernelStore.js';
import { createGraphStore } from './graphStore.js';
import { createUiStore } from './uiStore.js';
import { createWorkspaceStore } from './workspaceStore.js';
import { withGraphMutationBoundary } from './graphMutationBoundary.js';
function createFacadeStoreFromCore(_0x234ff4) {
  if (!_0x234ff4 || typeof _0x234ff4 !== "object") {
    throw new TypeError("[facadeStore] createFacadeStoreFromCore() 需要传入有效的 coreStore");
  }
  _0x234ff4 = withGraphMutationBoundary(_0x234ff4);
  const _0x2181d6 = createGraphStore(_0x234ff4);
  const _0x231ed8 = createUiStore(_0x234ff4);
  const _0x432a28 = createWorkspaceStore(_0x234ff4);
  return {
    ..._0x234ff4,
    'graphStore': _0x2181d6,
    'uiStore': _0x231ed8,
    'workspaceStore': _0x432a28,
    'getDomainStores'() {
      return {
        'graphStore': _0x2181d6,
        'uiStore': _0x231ed8,
        'workspaceStore': _0x432a28
      };
    }
  };
}
function createFacadeStore() {
  const _0xf16707 = createLegacyKernelStore();
  return createFacadeStoreFromCore(_0xf16707);
}
export { createFacadeStore, createFacadeStoreFromCore };