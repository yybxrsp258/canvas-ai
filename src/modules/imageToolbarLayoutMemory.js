export const IMAGE_TOOLBAR_ACTIONS = Object["freeze"](["matting", 'local-edit', 'hd', "depth-image", "mj-variation", "mj-hd", "expand", "auto-subject", "apimart-face-detect", "panorama-360", 'multigrid', "multiangle", "annotate", 'crop', "fullscreen", "upload", "download", 'reset-size']);
const DEFAULT_IMAGE_TOOLBAR_LAYOUT = Object["freeze"]({
  'outsidePrimary': Object["freeze"](["mj-variation", 'mj-hd', "matting", "expand", 'apimart-face-detect', "panorama-360", "multigrid", "multiangle"]),
  'outsideSecondary': Object['freeze'](["annotate", "crop", "fullscreen", "upload", 'download', "reset-size"]),
  'more': Object["freeze"](["local-edit", 'hd', "depth-image", 'auto-subject'])
});
const ZONE_KEYS = Object['freeze'](["outsidePrimary", "outsideSecondary", "more"]);
function cloneDefaultLayout() {
  return {
    'outsidePrimary': [...DEFAULT_IMAGE_TOOLBAR_LAYOUT["outsidePrimary"]],
    'outsideSecondary': [...DEFAULT_IMAGE_TOOLBAR_LAYOUT["outsideSecondary"]],
    'more': [...DEFAULT_IMAGE_TOOLBAR_LAYOUT['more']]
  };
}
function normalizeAction(_0x5c6cc5) {
  const _0x1f5b94 = String(_0x5c6cc5 || '')['trim']();
  return IMAGE_TOOLBAR_ACTIONS["includes"](_0x1f5b94) ? _0x1f5b94 : '';
}
function appendNormalizedAction(_0x35ac00, _0x8a3dd) {
  if (_0x8a3dd === "upload") {
    const _0x2cb205 = _0x35ac00['indexOf']("download");
    if (_0x2cb205 >= 0x0) {
      _0x35ac00["splice"](_0x2cb205, 0x0, _0x8a3dd);
      return;
    }
  }
  _0x35ac00['push'](_0x8a3dd);
}
export function getDefaultImageToolbarLayout() {
  return cloneDefaultLayout();
}
export function normalizeImageToolbarLayout(_0x45c7ba) {
  const _0x40305e = cloneDefaultLayout();
  if (!_0x45c7ba || typeof _0x45c7ba !== "object") {
    return _0x40305e;
  }
  const _0x379d7e = {
    'outsidePrimary': [],
    'outsideSecondary': [],
    'more': []
  };
  const _0x32f2e4 = new Set();
  for (const _0x3b0414 of ZONE_KEYS) {
    const _0x3d551b = Array["isArray"](_0x45c7ba[_0x3b0414]) ? _0x45c7ba[_0x3b0414] : [];
    for (const _0x286846 of _0x3d551b) {
      const _0x2d371a = normalizeAction(_0x286846);
      if (!_0x2d371a || _0x32f2e4['has'](_0x2d371a)) {
        continue;
      }
      _0x32f2e4['add'](_0x2d371a);
      _0x379d7e[_0x3b0414]["push"](_0x2d371a);
    }
  }
  for (const _0x2ce007 of IMAGE_TOOLBAR_ACTIONS) {
    if (_0x32f2e4["has"](_0x2ce007)) {
      continue;
    }
    if (_0x40305e["outsidePrimary"]["includes"](_0x2ce007)) {
      appendNormalizedAction(_0x379d7e["outsidePrimary"], _0x2ce007);
      continue;
    }
    if (_0x40305e['outsideSecondary']['includes'](_0x2ce007)) {
      appendNormalizedAction(_0x379d7e['outsideSecondary'], _0x2ce007);
      continue;
    }
    appendNormalizedAction(_0x379d7e["more"], _0x2ce007);
  }
  return _0x379d7e;
}
export function serializeImageToolbarLayout(_0x4fa1e7) {
  const _0x47e744 = normalizeImageToolbarLayout(_0x4fa1e7);
  return JSON["stringify"]({
    'outsidePrimary': _0x47e744['outsidePrimary'],
    'outsideSecondary': _0x47e744['outsideSecondary'],
    'more': _0x47e744["more"]
  });
}