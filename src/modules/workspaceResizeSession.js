export function beginWorkspaceResizeSession({
  event: _0x47c53c,
  splitter: _0x27a8d1,
  layout: _0x58ff9f,
  orientation = "horizontal",
  windowObject = globalThis['window'],
  body = globalThis['document']?.["body"],
  resizingClass = '',
  onRatio: _0x194c45,
  onFinish = null
} = {}) {
  if (!_0x47c53c || !_0x27a8d1 || !_0x58ff9f || typeof _0x194c45 !== 'function') {
    return ![];
  }
  if (_0x47c53c['isPrimary'] === ![] || Number["isFinite"](_0x47c53c["button"]) && _0x47c53c["button"] !== 0x0) {
    return ![];
  }
  const _0x5cc88d = _0x58ff9f["getBoundingClientRect"]?.();
  const _0x5235c3 = orientation === "vertical";
  const _0x1bca1b = _0x5235c3 ? Number(_0x5cc88d?.["height"]) : Number(_0x5cc88d?.["width"]);
  if (!(_0x1bca1b > 0x0)) {
    return ![];
  }
  _0x47c53c['preventDefault']?.();
  _0x47c53c["stopPropagation"]?.();
  const _0x49c742 = _0x47c53c["pointerId"];
  try {
    _0x27a8d1["setPointerCapture"]?.(_0x49c742);
  } catch {}
  _0x27a8d1["classList"]?.["add"]?.("is-active");
  if (resizingClass) {
    body?.["classList"]?.['add']?.(resizingClass);
  }
  const _0x292ade = _0x39423c => !Number["isFinite"](Number(_0x49c742)) || !Number["isFinite"](Number(_0x39423c?.["pointerId"])) || Number(_0x39423c["pointerId"]) === Number(_0x49c742);
  const _0x588103 = _0x5a1454 => {
    if (!_0x292ade(_0x5a1454)) {
      return;
    }
    const _0x58d1fc = _0x5235c3 ? _0x5a1454?.["clientY"] : _0x5a1454?.["clientX"];
    const _0x1e5a34 = _0x5235c3 ? _0x5cc88d["top"] : _0x5cc88d["left"];
    _0x194c45((Number(_0x58d1fc) - Number(_0x1e5a34 || 0x0)) / _0x1bca1b * 0x64, _0x5a1454);
  };
  const _0x36ac6a = _0x4b2464 => {
    if (!_0x292ade(_0x4b2464)) {
      return;
    }
    if (resizingClass) {
      body?.["classList"]?.["remove"]?.(resizingClass);
    }
    _0x27a8d1["classList"]?.["remove"]?.("is-active");
    try {
      _0x27a8d1["hasPointerCapture"]?.(_0x49c742) && _0x27a8d1["releasePointerCapture"](_0x49c742);
    } catch {}
    windowObject?.["removeEventListener"]?.("pointermove", _0x588103);
    windowObject?.["removeEventListener"]?.("pointerup", _0x36ac6a);
    windowObject?.['removeEventListener']?.("pointercancel", _0x36ac6a);
    onFinish?.(_0x4b2464);
  };
  windowObject?.['addEventListener']?.("pointermove", _0x588103);
  windowObject?.["addEventListener"]?.("pointerup", _0x36ac6a);
  windowObject?.["addEventListener"]?.("pointercancel", _0x36ac6a);
  return !![];
}
export function beginWorkspaceHorizontalResizeSession(_0x53ac8c = {}) {
  return beginWorkspaceResizeSession({
    ..._0x53ac8c,
    'orientation': "horizontal"
  });
}
export function beginWorkspaceVerticalResizeSession(_0x58cd42 = {}) {
  return beginWorkspaceResizeSession({
    ..._0x58cd42,
    'orientation': "vertical"
  });
}