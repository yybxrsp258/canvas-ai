export function createLinkCursor(_0x7179f4 = {}) {
  const _0x38f4c8 = _0x7179f4 && typeof _0x7179f4 === 'object' ? _0x7179f4 : {};
  const _0x314d6c = {
    'small': 0x18,
    'medium': 0x24,
    'large': 0x30
  };
  const _0x172079 = {
    'small': 0x4,
    'medium': 0x6,
    'large': 0x8
  };
  const _0x32e479 = Object["prototype"]["hasOwnProperty"]["call"](_0x314d6c, _0x38f4c8["size"]) ? _0x38f4c8["size"] : "small";
  const _0x158678 = _0x38f4c8["strokeColor"] || "white";
  const _0x3fd921 = _0x38f4c8["fillColor"] || "white";
  const _0x3e8de4 = _0x38f4c8["fillOpacity"] ?? "0.18";
  const _0x1c28fe = _0x38f4c8["fallback"] || "crosshair";
  const _0x6c3779 = _0x314d6c[_0x32e479];
  const _0x350331 = _0x172079[_0x32e479];
  const _0x3e07b9 = _0x32e479 === "small" ? _0x1c28fe : 'var(--viewport-edge-cursor,\x20' + createLinkCursor({
    ..._0x38f4c8,
    'size': "small"
  })["replace"](/, [^,]+$/, '') + '),\x20' + _0x1c28fe;
  const _0x278307 = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + _0x6c3779 + "\" height=\"" + _0x6c3779 + '\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22' + _0x158678 + "\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 4l7.07 16.97 2.51-7.39 7.39-2.51L4 4z\" fill=\"" + _0x3fd921 + "\" fill-opacity=\"" + _0x3e8de4 + "\"/><circle cx=\"20\" cy=\"20\" r=\"2.5\" fill=\"" + _0x158678 + "\"/><path d=\"M12 12 Q 17 12 19 18\" stroke-dasharray=\"3 3\"/></svg>";
  return 'url(\x22data:image/svg+xml;charset=utf-8,' + encodeURIComponent(_0x278307) + "\") " + _0x350331 + '\x20' + _0x350331 + ',\x20' + _0x3e07b9;
}
export function createRotateCursor(_0x439525 = {}) {
  const _0x47a12a = _0x439525 && typeof _0x439525 === 'object' ? _0x439525 : {};
  const _0x1c5887 = _0x47a12a["strokeColor"] || "#17191f";
  const _0x259b72 = _0x47a12a["outlineColor"] || "#ffffff";
  const _0x31e3ce = _0x47a12a["fallback"] || "grab";
  const _0x11d4f9 = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"28\" height=\"28\" viewBox=\"0 0 28 28\" fill=\"none\"><path d=\"M20.7 8.1A9 9 0 1 0 22 18.3\" stroke=\"" + _0x259b72 + '\x22\x20stroke-width=\x224.2\x22\x20stroke-linecap=\x22round\x22/><path\x20d=\x22M20.7\x208.1A9\x209\x200\x201\x200\x2022\x2018.3\x22\x20stroke=\x22' + _0x1c5887 + "\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M16.5 7.9h4.6V3.3\" stroke=\"" + _0x259b72 + '\x22\x20stroke-width=\x224.2\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22/><path\x20d=\x22M16.5\x207.9h4.6V3.3\x22\x20stroke=\x22' + _0x1c5887 + '\x22\x20stroke-width=\x222\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22/></svg>';
  return 'url(\x22data:image/svg+xml;charset=utf-8,' + encodeURIComponent(_0x11d4f9) + "\") 14 14, " + _0x31e3ce;
}
export function getCursorSize() {
  return localStorage["getItem"]("v2-cursor-style") || localStorage["getItem"]('cursorSize') || "small";
}