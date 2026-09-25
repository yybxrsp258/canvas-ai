export const VIDEO_TOOLBAR_ACTIONS = Object["freeze"](["clip", "segment-retake", "voice-replace", 'reverse', 'extract-keyframes', "keying", 'storyboard-script', "apimart-face-detect", "fullscreen", 'upload', 'download', "reset-size", "to-gif", 'hd', "depth-video", "replace", "remove", "separate-av"]);
const DEFAULT_VIDEO_TOOLBAR_LAYOUT = Object["freeze"]({
  'outsidePrimary': Object["freeze"](['clip', "segment-retake", "voice-replace", "reverse", 'extract-keyframes', "keying", "storyboard-script", "apimart-face-detect"]),
  'outsideSecondary': Object["freeze"](["fullscreen", "upload", "download", "reset-size"]),
  'more': Object["freeze"](['to-gif', 'hd', "depth-video", "replace", "remove", "separate-av"])
});
const ZONE_KEYS = Object['freeze'](["outsidePrimary", 'outsideSecondary', "more"]);
function cloneDefaultLayout() {
  return {
    'outsidePrimary': [...DEFAULT_VIDEO_TOOLBAR_LAYOUT['outsidePrimary']],
    'outsideSecondary': [...DEFAULT_VIDEO_TOOLBAR_LAYOUT['outsideSecondary']],
    'more': [...DEFAULT_VIDEO_TOOLBAR_LAYOUT["more"]]
  };
}
function normalizeAction(_0x371349) {
  const _0x2fe324 = String(_0x371349 || '')["trim"]();
  return VIDEO_TOOLBAR_ACTIONS["includes"](_0x2fe324) ? _0x2fe324 : '';
}
function appendNormalizedAction(_0x1839d8, _0x20e6a0) {
  if (_0x20e6a0 === 'upload') {
    const _0x50d74f = _0x1839d8['indexOf']("download");
    if (_0x50d74f >= 0x0) {
      _0x1839d8["splice"](_0x50d74f, 0x0, _0x20e6a0);
      return;
    }
  }
  _0x1839d8['push'](_0x20e6a0);
}
export function getDefaultVideoToolbarLayout() {
  return cloneDefaultLayout();
}
export function normalizeVideoToolbarLayout(_0x1df4e7) {
  const _0x59f564 = cloneDefaultLayout();
  if (!_0x1df4e7 || typeof _0x1df4e7 !== "object") {
    return _0x59f564;
  }
  const _0x2ff843 = {
    'outsidePrimary': [],
    'outsideSecondary': [],
    'more': []
  };
  const _0x44209d = new Set();
  for (const _0x32a649 of ZONE_KEYS) {
    const _0x4ab65c = Array["isArray"](_0x1df4e7[_0x32a649]) ? _0x1df4e7[_0x32a649] : [];
    for (const _0x711fd5 of _0x4ab65c) {
      const _0xf35d30 = normalizeAction(_0x711fd5);
      if (!_0xf35d30 || _0x44209d["has"](_0xf35d30)) {
        continue;
      }
      _0x44209d["add"](_0xf35d30);
      _0x2ff843[_0x32a649]["push"](_0xf35d30);
    }
  }
  for (const _0x13bdf0 of VIDEO_TOOLBAR_ACTIONS) {
    if (_0x44209d["has"](_0x13bdf0)) {
      continue;
    }
    if (_0x59f564['outsidePrimary']["includes"](_0x13bdf0)) {
      appendNormalizedAction(_0x2ff843["outsidePrimary"], _0x13bdf0);
      continue;
    }
    if (_0x59f564["outsideSecondary"]["includes"](_0x13bdf0)) {
      appendNormalizedAction(_0x2ff843["outsideSecondary"], _0x13bdf0);
      continue;
    }
    appendNormalizedAction(_0x2ff843["more"], _0x13bdf0);
  }
  return _0x2ff843;
}
export function serializeVideoToolbarLayout(_0x31d6fe) {
  const _0x37284f = normalizeVideoToolbarLayout(_0x31d6fe);
  return JSON["stringify"]({
    'outsidePrimary': _0x37284f["outsidePrimary"],
    'outsideSecondary': _0x37284f['outsideSecondary'],
    'more': _0x37284f["more"]
  });
}