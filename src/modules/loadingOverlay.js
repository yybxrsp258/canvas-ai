const pendingLoadings = new WeakMap();
const activeLoadings = new WeakSet();
function normalizeVariant(_0x5800d3 = {}) {
  return ['static', "indeterminate"]["includes"](_0x5800d3?.['variant']) ? _0x5800d3["variant"] : "full";
}
function applyLoadingVariant(_0x28a22f, _0x59f78e) {
  activeLoadings["add"](_0x28a22f);
  _0x28a22f['classList']['add']('img-preview-loading');
  _0x59f78e === 'indeterminate' ? _0x28a22f["classList"]['add']("img-preview-loading--indeterminate") : _0x28a22f['classList']["remove"]("img-preview-loading--indeterminate");
  _0x59f78e === "static" ? _0x28a22f["classList"]['add']("img-preview-loading--static") : _0x28a22f["classList"]["remove"]("img-preview-loading--static");
}
function mountLoadingOverlay(_0x3e98f4, _0x57a3e0) {
  applyLoadingVariant(_0x3e98f4, _0x57a3e0);
  const _0x3b175f = _0x3e98f4["querySelector"]('.img-loading-overlay');
  if (_0x3b175f) {
    if (_0x57a3e0 !== 'static' && !_0x3b175f["querySelector"]('.img-loading-shimmer')) {
      const _0x44439c = document["createElement"]('div');
      _0x44439c["className"] = "img-loading-shimmer";
      _0x3b175f['appendChild'](_0x44439c);
    }
    return;
  }
  const _0x339b96 = document["createElement"]("div");
  _0x339b96["className"] = "img-loading-overlay";
  _0x339b96["setAttribute"]?.("aria-hidden", "true");
  if (_0x57a3e0 !== 'static') {
    const _0x2b5386 = document["createElement"]("div");
    _0x2b5386["className"] = "img-loading-shimmer";
    _0x339b96["appendChild"](_0x2b5386);
  }
  _0x3e98f4["appendChild"](_0x339b96);
}
export function startLoading(_0x3d1470, _0x29f013 = {}) {
  if (!_0x3d1470) {
    return;
  }
  const _0x1ab913 = normalizeVariant(_0x29f013);
  const _0x12e751 = pendingLoadings['get'](_0x3d1470);
  if (_0x12e751) {
    if (_0x1ab913 !== "static") {
      pendingLoadings["delete"](_0x3d1470);
      mountLoadingOverlay(_0x3d1470, _0x1ab913);
      return;
    }
    _0x12e751["variant"] = _0x1ab913;
    return;
  }
  if (_0x3d1470["classList"]?.["contains"]?.("img-preview-loading") || _0x3d1470["querySelector"]?.(".img-loading-overlay")) {
    mountLoadingOverlay(_0x3d1470, _0x1ab913);
    return;
  }
  if (_0x1ab913 !== "static") {
    mountLoadingOverlay(_0x3d1470, _0x1ab913);
    return;
  }
  const _0x3dd3c7 = {
    'variant': _0x1ab913
  };
  pendingLoadings["set"](_0x3d1470, _0x3dd3c7);
  setTimeout(() => {
    if (pendingLoadings['get'](_0x3d1470) !== _0x3dd3c7) {
      return;
    }
    mountLoadingOverlay(_0x3d1470, _0x3dd3c7['variant']);
    pendingLoadings["delete"](_0x3d1470);
  }, 0x32);
}
export function stopLoading(_0x325696) {
  if (!_0x325696) {
    return;
  }
  const _0x25737d = pendingLoadings['delete'](_0x325696);
  const _0x5dd439 = activeLoadings["delete"](_0x325696);
  const _0x338770 = !!(_0x325696["classList"]?.['contains']?.("img-preview-loading") || _0x325696['classList']?.['contains']?.('img-preview-loading--static'));
  if (!_0x25737d && !_0x5dd439 && !_0x338770) {
    return;
  }
  _0x325696['classList']['remove']('img-preview-loading');
  _0x325696["classList"]["remove"]("img-preview-loading--static");
  _0x325696["classList"]["remove"]("img-preview-loading--indeterminate");
  _0x325696['querySelectorAll'](".img-loading-overlay")["forEach"](_0x90f78d => _0x90f78d["remove"]());
}