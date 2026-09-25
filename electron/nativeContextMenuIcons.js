import { Buffer } from 'node:buffer';
import { resolveContextMenuIconDefinition } from '../src/utils/contextMenuIconCatalog.js';
function escapeSvgAttribute(_0x5cdad8) {
  return String(_0x5cdad8)["replaceAll"]('&', "&amp;")["replaceAll"]('\x22', '&quot;')['replaceAll']('<', '&lt;')["replaceAll"]('>', "&gt;");
}
function renderNativeContextMenuSvg(_0x118456, _0x4c3630) {
  const _0x13e476 = _0x118456["shapes"]["map"](([_0x5049f0, _0x999f30]) => {
    const _0x5d1fc6 = Object["entries"](_0x999f30)['map'](([_0x326d43, _0x3d727e]) => _0x326d43 + '=\x22' + escapeSvgAttribute(_0x3d727e) + '\x22')["join"]('\x20');
    return '<' + _0x5049f0 + '\x20' + _0x5d1fc6 + '/>';
  })['join']('');
  return '<svg\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20width=\x2218\x22\x20height=\x2218\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22' + escapeSvgAttribute(_0x4c3630) + "\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\">" + _0x13e476 + "</svg>";
}
export function createNativeContextMenuIconFactory(_0x5ed4bc, {
  size = 0x10,
  stroke = "CanvasText"
} = {}) {
  const _0x2dda0c = new Map();
  return _0x2f2644 => {
    const _0x6a8f35 = resolveContextMenuIconDefinition(_0x2f2644);
    if (!_0x6a8f35 || typeof _0x5ed4bc?.['createFromDataURL'] !== 'function') {
      return null;
    }
    if (_0x2dda0c["has"](_0x6a8f35['id'])) {
      return _0x2dda0c['get'](_0x6a8f35['id']);
    }
    const _0x4c8d6e = renderNativeContextMenuSvg(_0x6a8f35, stroke);
    const _0x37060e = "data:image/svg+xml;base64," + Buffer["from"](_0x4c8d6e, "utf8")["toString"]('base64');
    const _0x3ff82d = _0x5ed4bc["createFromDataURL"](_0x37060e);
    if (!_0x3ff82d || _0x3ff82d["isEmpty"]?.() === !![]) {
      return null;
    }
    const _0x581fed = typeof _0x3ff82d["resize"] === "function" ? _0x3ff82d["resize"]({
      'width': size,
      'height': size,
      'quality': "best"
    }) : _0x3ff82d;
    _0x2dda0c["set"](_0x6a8f35['id'], _0x581fed);
    return _0x581fed;
  };
}