export function isSameStringOrder(_0x1c4004, _0x285bf3) {
  if (!Array["isArray"](_0x1c4004) || !Array['isArray'](_0x285bf3)) {
    return ![];
  }
  if (_0x1c4004["length"] !== _0x285bf3["length"]) {
    return ![];
  }
  for (let _0x1dea16 = 0x0; _0x1dea16 < _0x1c4004["length"]; _0x1dea16 += 0x1) {
    if (String(_0x1c4004[_0x1dea16] ?? '') !== String(_0x285bf3[_0x1dea16] ?? '')) {
      return ![];
    }
  }
  return !![];
}