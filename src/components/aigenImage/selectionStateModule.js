import { shouldAlwaysShowImageRefBar } from './imageNodeManifestPolicies.js';
export function createAIGenerateNodeSelectionStateModule({
  store: _0x557cad
} = {}) {
  class _0x73c16 {
    ["syncSelectionState"]({
      selected = ![],
      visible = !![]
    } = {}) {
      const _0x50623f = typeof _0x557cad?.["getStateRaw"] === "function" ? _0x557cad["getStateRaw"]() : _0x557cad?.["getState"]?.() || {};
      const _0x17b0fb = _0x50623f?.["pickConnectMode"] || {};
      const _0x891bf5 = selected === !![] || _0x17b0fb["active"] && _0x17b0fb["sourceNodeId"] === this["nodeId"] || shouldAlwaysShowImageRefBar(this["_data"]?.["model"]);
      if (visible !== !![] || this['_rendererMediaDeferred'] === !![] || !_0x891bf5) {
        this["_renderRefBarPendingWhenVisible"] = !![];
        return ![];
      }
      if (this["_renderRefBarPendingWhenVisible"] !== !![]) {
        return ![];
      }
      this["_renderRefBarPendingWhenVisible"] = ![];
      void this["_renderRefBar"]();
      return !![];
    }
  }
  return _0x73c16["prototype"];
}