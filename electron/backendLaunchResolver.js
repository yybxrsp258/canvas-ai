import a190_0x350baf from 'node:path';
export function resolveNativeBackendExecutable({
  runtimeRoot: _0x1f9883,
  platform = process["platform"]
}) {
  const _0x417edd = platform === "win32" ? "canvasai-backend.exe" : "canvasai-backend";
  return a190_0x350baf["join"](_0x1f9883, 'backend', _0x417edd);
}
export function resolveBackendLaunchSpec({
  appIsPackaged: _0x13a73b,
  appRoot: _0x16c48b,
  runtimeRoot: _0x1af351,
  platform = process["platform"],
  existsSync: _0x2adde6,
  pythonCommand: _0x2bb871
}) {
  if (!_0x13a73b) {
    return {
      'kind': 'python-source',
      'command': _0x2bb871,
      'args': ["server.py"],
      'cwd': _0x16c48b
    };
  }
  const _0x31a178 = resolveNativeBackendExecutable({
    'runtimeRoot': _0x1af351,
    'platform': platform
  });
  if (!_0x2adde6(_0x31a178)) {
    throw new Error("Packaged backend executable is missing: " + _0x31a178 + ". Rebuild the native backend before packaging.");
  }
  return {
    'kind': "native-backend",
    'command': _0x31a178,
    'args': [],
    'cwd': _0x16c48b
  };
}