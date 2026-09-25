function getDominantWheelDelta(_0x2e2602) {
  const _0x36f5e7 = Number(_0x2e2602?.["deltaX"]) || 0x0;
  const _0x1d88dd = Number(_0x2e2602?.['deltaY']) || 0x0;
  return Math["abs"](_0x36f5e7) > Math["abs"](_0x1d88dd) ? _0x36f5e7 : _0x1d88dd;
}
function getWheelDeltaMultiplier(_0x32a879, _0x43b3a7) {
  if (Number(_0x32a879) === 0x1) {
    return 0x10;
  }
  if (Number(_0x32a879) === 0x2) {
    return Math['max'](0x1, Number(_0x43b3a7) || 0x1);
  }
  return 0x1;
}
const SCROLLABLE_OVERFLOW_VALUES = new Set(['auto', "scroll", "overlay"]);
function canConsumeWheelDelta(_0x2d1a0e, _0x1e533c, _0x1af84e = {}) {
  const _0x4b788d = Number(_0x1e533c?.["deltaX"]) || 0x0;
  const _0x1744ff = Number(_0x1e533c?.["deltaY"]) || 0x0;
  const _0x2b3b44 = ({
    delta: _0x222121,
    overflow: _0x14dedf,
    scrollPosition: _0x23f77a,
    scrollSize: _0x5c3986,
    clientSize: _0x232248
  }) => {
    if (!_0x222121 || !SCROLLABLE_OVERFLOW_VALUES["has"](String(_0x14dedf || ''))) {
      return ![];
    }
    const _0x11269c = Math["max"](0x0, (Number(_0x5c3986) || 0x0) - (Number(_0x232248) || 0x0));
    if (!(_0x11269c > 0x0)) {
      return ![];
    }
    const _0x53e2eb = Math["max"](0x0, Math["min"](_0x11269c, Number(_0x23f77a) || 0x0));
    return _0x222121 > 0x0 ? _0x53e2eb < _0x11269c : _0x53e2eb > 0x0;
  };
  return _0x2b3b44({
    'delta': _0x4b788d,
    'overflow': _0x1af84e['overflowX'],
    'scrollPosition': _0x2d1a0e?.["scrollLeft"],
    'scrollSize': _0x2d1a0e?.["scrollWidth"],
    'clientSize': _0x2d1a0e?.["clientWidth"]
  }) || _0x2b3b44({
    'delta': _0x1744ff,
    'overflow': _0x1af84e["overflowY"],
    'scrollPosition': _0x2d1a0e?.["scrollTop"],
    'scrollSize': _0x2d1a0e?.['scrollHeight'],
    'clientSize': _0x2d1a0e?.["clientHeight"]
  });
}
function hasNestedWheelConsumer(_0x3fdd49, _0x1b3cc7, {
  getComputedStyle = null
} = {}) {
  const _0x1e8e65 = _0x3fdd49?.["target"];
  const _0x29abe4 = getComputedStyle || _0x1e8e65?.["ownerDocument"]?.["defaultView"]?.["getComputedStyle"]?.['bind'](_0x1e8e65["ownerDocument"]['defaultView']) || globalThis["getComputedStyle"];
  if (typeof _0x29abe4 !== "function") {
    return ![];
  }
  for (let _0x497a7f = _0x1e8e65; _0x497a7f && _0x497a7f !== _0x1b3cc7; _0x497a7f = _0x497a7f["parentElement"]) {
    if (canConsumeWheelDelta(_0x497a7f, _0x3fdd49, _0x29abe4(_0x497a7f))) {
      return !![];
    }
  }
  return ![];
}
export function scrollElementHorizontallyWithWheel(_0x42eb7e, _0x139272, {
  stopPropagation = ![]
} = {}) {
  if (!_0x139272) {
    return ![];
  }
  const _0x7257c3 = Math["max"](0x0, Number(_0x139272["clientWidth"]) || 0x0);
  const _0xa054fc = Math["max"](0x0, (Number(_0x139272["scrollWidth"]) || 0x0) - _0x7257c3);
  if (!_0xa054fc) {
    return ![];
  }
  const _0x4cc5a1 = getDominantWheelDelta(_0x42eb7e);
  if (!_0x4cc5a1) {
    return ![];
  }
  const _0x1abae9 = _0x4cc5a1 * getWheelDeltaMultiplier(_0x42eb7e?.["deltaMode"], _0x7257c3);
  const _0x16217f = Math["max"](0x0, Math["min"](_0xa054fc, Number(_0x139272["scrollLeft"]) || 0x0));
  const _0xae5b55 = Math["max"](0x0, Math['min'](_0xa054fc, _0x16217f + _0x1abae9));
  if (_0xae5b55 === _0x16217f) {
    return ![];
  }
  _0x139272["scrollLeft"] = _0xae5b55;
  _0x42eb7e?.['preventDefault']?.();
  if (stopPropagation) {
    _0x42eb7e?.['stopPropagation']?.();
  }
  return !![];
}
export function scrollClosestElementHorizontallyWithWheel(_0xe551e5, _0x28aba7, {
  boundaryRoot = null,
  stopPropagation = ![],
  preserveNestedScrollable = ![],
  getComputedStyle = null
} = {}) {
  const _0x5004aa = _0xe551e5?.["target"]?.["closest"]?.(_0x28aba7);
  if (!_0x5004aa || boundaryRoot && !boundaryRoot['contains']?.(_0x5004aa)) {
    return ![];
  }
  if (preserveNestedScrollable && hasNestedWheelConsumer(_0xe551e5, _0x5004aa, {
    'getComputedStyle': getComputedStyle
  })) {
    return ![];
  }
  return scrollElementHorizontallyWithWheel(_0xe551e5, _0x5004aa, {
    'stopPropagation': stopPropagation
  });
}