import a181_0x319e57 from 'node:path';
export function resolveApplicationResourceRoot(_0x2c97da) {
  return a181_0x319e57["basename"](_0x2c97da) === 'app.asar' ? a181_0x319e57["join"](a181_0x319e57["dirname"](_0x2c97da), "webapp") : _0x2c97da;
}