import { resolveContextMenuIconDefinition } from '../utils/contextMenuIconCatalog.js';
const SVG_NS = "http://www.w3.org/2000/svg";
export function createContextMenuIcon(_0x51f458, {
  documentObject = globalThis['document'],
  size = 0x12,
  stroke = 'currentColor'
} = {}) {
  if (typeof documentObject?.['createElementNS'] !== "function") {
    return null;
  }
  const _0x57a774 = resolveContextMenuIconDefinition(_0x51f458);
  if (!_0x57a774) {
    return null;
  }
  const _0x32f6d4 = documentObject['createElementNS'](SVG_NS, "svg");
  for (const [_0x5e6b62, _0x46e6d8] of Object["entries"]({
    'width': size,
    'height': size,
    'viewBox': "0 0 24 24",
    'fill': "none",
    'stroke': stroke,
    'stroke-width': "1.8",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    'aria-hidden': 'true',
    'data-context-menu-icon': _0x57a774['id']
  })) {
    _0x32f6d4["setAttribute"](_0x5e6b62, String(_0x46e6d8));
  }
  if (_0x32f6d4["dataset"]) {
    _0x32f6d4["dataset"]["contextMenuIcon"] = _0x57a774['id'];
  }
  for (const [_0x54f122, _0x5e964f] of _0x57a774["shapes"]) {
    const _0x74ba74 = documentObject["createElementNS"](SVG_NS, _0x54f122);
    for (const [_0x581f2, _0x3bdc2a] of Object["entries"](_0x5e964f)) {
      _0x74ba74["setAttribute"](_0x581f2, String(_0x3bdc2a));
    }
    _0x32f6d4['appendChild'](_0x74ba74);
  }
  return _0x32f6d4;
}