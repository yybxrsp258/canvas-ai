import { execFile } from 'node:child_process';
import { resolveWindowsSystemToolPath } from './windowsSystemTools.js';
export async function disableWindowsWindowTransitions(_0x2bc426, {
  platform = process['platform'],
  ownerPid = process["pid"],
  execFileFn = execFile
} = {}) {
  if (platform !== "win32") {
    return {
      'ok': !![],
      'skipped': !![]
    };
  }
  if (_0x2bc426?.['isDestroyed']?.()) {
    return {
      'ok': ![],
      'reason': "window-unavailable"
    };
  }
  let _0x30c99c;
  try {
    const _0x1d4416 = _0x2bc426?.["getNativeWindowHandle"]?.();
    if (!Buffer['isBuffer'](_0x1d4416) || ![0x4, 0x8]["includes"](_0x1d4416["length"])) {
      throw new Error("invalid-handle");
    }
    _0x30c99c = _0x1d4416["length"] === 0x8 ? _0x1d4416['readBigUInt64LE']() : BigInt(_0x1d4416["readUInt32LE"]());
    if (_0x30c99c <= 0x0n || _0x30c99c > 0x7fffffffffffffffn || !Number["isSafeInteger"](ownerPid) || ownerPid <= 0x0) {
      throw new Error('invalid-handle');
    }
  } catch {
    return {
      'ok': ![],
      'reason': 'window-unavailable'
    };
  }
  const _0x55d106 = "\n$ErrorActionPreference = 'Stop'\nAdd-Type -TypeDefinition @'\nusing System;\nusing System.Runtime.InteropServices;\npublic static class ShuoWindowTransitions {\n  [DllImport(\"user32.dll\")]\n  private static extern uint GetWindowThreadProcessId(IntPtr hwnd, out uint processId);\n  [DllImport(\"dwmapi.dll\")]\n  private static extern int DwmSetWindowAttribute(IntPtr hwnd, uint attribute, ref int value, uint size);\n  public static int Disable(long handle, uint expectedPid) {\n    IntPtr hwnd = new IntPtr(handle);\n    uint actualPid;\n    if (GetWindowThreadProcessId(hwnd, out actualPid) == 0 || actualPid != expectedPid) return -1;\n    int disabled = 1;\n    // DWMWA_TRANSITIONS_FORCEDISABLED = 3, BOOL occupies four bytes.\n    return DwmSetWindowAttribute(hwnd, 3, ref disabled, 4);\n  }\n}\n'@\n$result = [ShuoWindowTransitions]::Disable([long]::Parse('" + _0x30c99c + "'), [uint32]" + ownerPid + ")\nif ($result -ne 0) { throw \"DwmSetWindowAttribute failed: $result\" }\n[Console]::Out.WriteLine('APPLIED')\n";
  return new Promise(_0x13a256 => {
    const _0x15db76 = (_0x207a54, _0x3879f8) => _0x13a256(!_0x207a54 && String(_0x3879f8 || '')["trim"]() === 'APPLIED' && !_0x2bc426["isDestroyed"]?.() ? {
      'ok': !![]
    } : {
      'ok': ![],
      'reason': "native-transitions-unavailable"
    });
    try {
      execFileFn(resolveWindowsSystemToolPath("powershell"), ["-NoLogo", "-NoProfile", '-NonInteractive', "-ExecutionPolicy", "Bypass", "-EncodedCommand", Buffer["from"](_0x55d106, 'utf16le')["toString"]("base64")], {
        'windowsHide': !![],
        'timeout': 0x1388,
        'maxBuffer': 0x4000,
        'encoding': "utf8"
      }, _0x15db76);
    } catch (_0x275185) {
      _0x15db76(_0x275185);
    }
  });
}