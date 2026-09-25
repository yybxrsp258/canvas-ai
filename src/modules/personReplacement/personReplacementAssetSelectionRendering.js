import { reconcileElementTree } from './personReplacementShotSelectionRendering.js';
export function syncPersonReplacementAssetSelection(_0x1c629b, _0xf24d, {
  targetRail = ![]
} = {}) {
  const _0x4fdc5f = _0x1c629b?.["ownerDocument"];
  if (!_0x4fdc5f?.["createElement"]) {
    return ![];
  }
  const _0x45b05c = _0x4fdc5f["createElement"]("template");
  _0x45b05c["innerHTML"] = _0xf24d;
  const _0x4a064c = targetRail ? [".person-replacement-target-assets"] : [".story-assets-callout", ".story-asset-grid"];
  const _0x1e2203 = _0x4a064c['map'](_0x2d3bc2 => [_0x1c629b["querySelector"](_0x2d3bc2), _0x45b05c["content"]["querySelector"](_0x2d3bc2)]);
  if (_0x1e2203["some"](([_0x3f8219, _0x3e9e58]) => !_0x3f8219 || !_0x3e9e58)) {
    return ![];
  }
  for (const [_0xf28431, _0x29875c] of _0x1e2203) {
    reconcileElementTree(_0xf28431, _0x29875c, {
      'preserveChildNodes': !![]
    });
  }
  return !![];
}