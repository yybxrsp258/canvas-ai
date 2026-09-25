import { Buffer } from 'node:buffer';
import a306_0x27d1ba from 'node:path';
const MAX_FAILURE_TEXT_LENGTH = 0x7d0;
const WINDOWS_SYSTEM_TOOLS = Object['freeze']({
  'netstat': {
    'fallback': "netstat.exe",
    'relativePath': ['System32', "netstat.exe"]
  },
  'powershell': {
    'fallback': "powershell.exe",
    'relativePath': ['System32', "WindowsPowerShell", "v1.0", "powershell.exe"]
  },
  'taskkill': {
    'fallback': 'taskkill.exe',
    'relativePath': ["System32", "taskkill.exe"]
  }
});
function resolveWindowsRoot(_0x53d899 = process["env"]) {
  const _0x73261e = [_0x53d899?.["SystemRoot"], _0x53d899?.["SYSTEMROOT"], _0x53d899?.['WINDIR'], _0x53d899?.["windir"]];
  for (const _0x59c2a1 of _0x73261e) {
    const _0x37df20 = String(_0x59c2a1 || '')["trim"]()["replace"](/^"|"$/g, '');
    if (a306_0x27d1ba["win32"]["isAbsolute"](_0x37df20)) {
      return _0x37df20;
    }
  }
  return '';
}
export function resolveWindowsSystemToolPath(_0x35f4d9, {
  env = process["env"]
} = {}) {
  const _0x5ad4ba = WINDOWS_SYSTEM_TOOLS[String(_0x35f4d9 || '')["trim"]()["toLowerCase"]()];
  if (!_0x5ad4ba) {
    throw new TypeError("Unsupported Windows system tool: " + _0x35f4d9);
  }
  const _0x168b63 = resolveWindowsRoot(env);
  return _0x168b63 ? a306_0x27d1ba['win32']["join"](_0x168b63, ..._0x5ad4ba["relativePath"]) : _0x5ad4ba['fallback'];
}
function normalizeFailureText(_0x311e2f) {
  const _0x32abbe = Buffer['isBuffer'](_0x311e2f) ? _0x311e2f['toString']("utf8") : String(_0x311e2f ?? '');
  return _0x32abbe["slice"](0x0, MAX_FAILURE_TEXT_LENGTH);
}
export function describeSystemCommandFailure(_0xb079f2) {
  const _0x3afac5 = {};
  for (const _0x59a01d of ["code", "errno", "status", 'signal', 'syscall', 'path']) {
    if (_0xb079f2?.[_0x59a01d] !== undefined) {
      _0x3afac5[_0x59a01d] = _0xb079f2[_0x59a01d];
    }
  }
  const _0x256409 = normalizeFailureText(_0xb079f2?.["message"]);
  const _0xca0784 = normalizeFailureText(_0xb079f2?.["stderr"]);
  if (_0x256409) {
    _0x3afac5['message'] = _0x256409;
  }
  if (_0xca0784) {
    _0x3afac5["stderr"] = _0xca0784;
  }
  return _0x3afac5;
}
export const __windowsSystemToolsForTest = {
  'resolveWindowsRoot': resolveWindowsRoot
};