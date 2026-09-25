import a283_0x17df8b from 'node:path';
const RUNTIME_DIRNAME = 'runtime';
const DEV_RUNTIME_DIR = a283_0x17df8b["join"](".electron-runtime", "runtime");
const CERTIFI_CA_BUNDLE_RELATIVE_PATH = a283_0x17df8b["join"]("site-packages", "certifi", "cacert.pem");
function normalizeRoot(_0x5b5dab) {
  return String(_0x5b5dab || '')["trim"]();
}
function getDirectoryEntryName(_0x12542c) {
  return typeof _0x12542c === "string" ? _0x12542c : String(_0x12542c?.["name"] || '');
}
function isDirectoryEntry(_0x449ffb) {
  return typeof _0x449ffb?.["isDirectory"] === "function" ? _0x449ffb['isDirectory']() : !![];
}
function collectPythonLibCaBundleCandidates({
  pythonRoot: _0x54c4ab,
  readdirSync: _0x11610a
}) {
  const _0x40cf51 = a283_0x17df8b["join"](_0x54c4ab, "lib");
  let _0x56af60 = [];
  try {
    _0x56af60 = _0x11610a(_0x40cf51, {
      'withFileTypes': !![]
    });
  } catch {
    return [];
  }
  return _0x56af60["filter"](_0x5959c9 => isDirectoryEntry(_0x5959c9))["map"](_0x503157 => getDirectoryEntryName(_0x503157))["filter"](_0x8f4e71 => /^python\d+(?:\.\d+)*$/i['test'](_0x8f4e71))["map"](_0x4af5f8 => a283_0x17df8b["join"](_0x40cf51, _0x4af5f8, CERTIFI_CA_BUNDLE_RELATIVE_PATH));
}
export function resolveRuntimeRoot({
  appIsPackaged = ![],
  appRoot = '',
  resourcesPath = ''
} = {}) {
  const _0x6dcbdf = normalizeRoot(appIsPackaged ? resourcesPath : appRoot);
  if (!_0x6dcbdf) {
    return '';
  }
  return appIsPackaged ? a283_0x17df8b["join"](_0x6dcbdf, RUNTIME_DIRNAME) : a283_0x17df8b['join'](_0x6dcbdf, DEV_RUNTIME_DIR);
}
export function resolveRuntimeToolPath({
  name: _0x35352b,
  runtimeRoot: _0x4f94b7,
  appIsPackaged = !![],
  appRoot = '',
  platform = process["platform"],
  existsSync = () => ![]
} = {}) {
  const _0x471d0b = String(_0x35352b || '')['trim']();
  const _0x646b3c = normalizeRoot(_0x4f94b7);
  if (!_0x471d0b || !_0x646b3c) {
    return '';
  }
  const _0x5d29bd = platform === 'win32' && !_0x471d0b["toLowerCase"]()["endsWith"](".exe") ? _0x471d0b + '.exe' : _0x471d0b;
  const _0x3bb7d0 = [a283_0x17df8b["join"](_0x646b3c, "ffmpeg", "bin", _0x5d29bd)];
  !appIsPackaged && platform === "win32" && normalizeRoot(appRoot) && _0x3bb7d0["unshift"](a283_0x17df8b["join"](appRoot, "vendor", "ffmpeg", 'windows-x64', "bin", _0x5d29bd));
  return _0x3bb7d0["find"](_0x5377ad => existsSync(_0x5377ad)) || '';
}
export function resolveRuntimeDreaminaCliPath({
  runtimeRoot: _0x33a49f,
  platform = process["platform"],
  existsSync = () => ![]
} = {}) {
  const _0x5c2be8 = normalizeRoot(_0x33a49f);
  if (!_0x5c2be8) {
    return '';
  }
  const _0x5c4c42 = platform === "win32" ? 'dreamina.exe' : "dreamina";
  const _0x23f98e = a283_0x17df8b["join"](_0x5c2be8, 'dreamina', _0x5c4c42);
  return existsSync(_0x23f98e) ? _0x23f98e : '';
}
export function resolveRuntimePythonCaBundlePath({
  runtimeRoot: _0x1678b3,
  existsSync = () => ![],
  readdirSync = () => []
} = {}) {
  const _0x546294 = normalizeRoot(_0x1678b3);
  if (!_0x546294) {
    return '';
  }
  const _0x250caa = a283_0x17df8b["join"](_0x546294, "python");
  const _0x227a85 = [a283_0x17df8b["join"](_0x546294, "backend", "certifi", "cacert.pem"), a283_0x17df8b["join"](_0x250caa, "Lib", CERTIFI_CA_BUNDLE_RELATIVE_PATH), ...collectPythonLibCaBundleCandidates({
    'pythonRoot': _0x250caa,
    'readdirSync': readdirSync
  })];
  return _0x227a85['find'](_0x38cbd6 => existsSync(_0x38cbd6)) || '';
}
export function buildRuntimePythonCertificateEnv({
  runtimeRoot: _0x44e596,
  existsSync = () => ![],
  readdirSync = () => [],
  env = {}
} = {}) {
  const _0x5a9e2f = [env["REQUESTS_CA_BUNDLE"], env["SSL_CERT_FILE"]]["map"](_0x3e0f51 => normalizeRoot(_0x3e0f51))["find"](_0x1d93a1 => _0x1d93a1 && existsSync(_0x1d93a1));
  const _0x1885c6 = _0x5a9e2f || resolveRuntimePythonCaBundlePath({
    'runtimeRoot': _0x44e596,
    'existsSync': existsSync,
    'readdirSync': readdirSync
  });
  if (!_0x1885c6) {
    return {};
  }
  return {
    'SSL_CERT_FILE': _0x1885c6,
    'REQUESTS_CA_BUNDLE': _0x1885c6
  };
}
export function buildRuntimeToolEnv({
  runtimeRoot: _0x44439a,
  appIsPackaged = !![],
  appRoot = '',
  platform = process['platform'],
  existsSync = () => ![]
} = {}) {
  const _0x559154 = normalizeRoot(_0x44439a) ? a283_0x17df8b["join"](_0x44439a, "codex", platform === "win32" ? "codex.exe" : "codex") : '';
  return {
    'AIC_FFMPEG_EXE': resolveRuntimeToolPath({
      'name': "ffmpeg",
      'runtimeRoot': _0x44439a,
      'appIsPackaged': appIsPackaged,
      'appRoot': appRoot,
      'platform': platform,
      'existsSync': existsSync
    }),
    'AIC_FFPROBE_EXE': resolveRuntimeToolPath({
      'name': "ffprobe",
      'runtimeRoot': _0x44439a,
      'appIsPackaged': appIsPackaged,
      'appRoot': appRoot,
      'platform': platform,
      'existsSync': existsSync
    }),
    'AIC_DREAMINA_CLI_EXE': resolveRuntimeDreaminaCliPath({
      'runtimeRoot': _0x44439a,
      'platform': platform,
      'existsSync': existsSync
    }),
    ...(_0x559154 && existsSync(_0x559154) ? {
      'AIC_CODEX_CLI_EXE': _0x559154
    } : {})
  };
}