import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta["url"]);
const WINDOWS_FINE_TUNED_SELECTION_APPS = Object["freeze"]({
  'excludeClipboardCursorDetect': ["acrobat.exe", "wps.exe", "cajviewer.exe"],
  'includeClipboardDelayRead': ["acrobat.exe", "wps.exe", 'cajviewer.exe', "foxitphantom.exe"]
});
function loadDefaultSelectionHook() {
  return require("selection-hook");
}
const WINDOWS_CAPTURE_WORKER_SCRIPT = String["raw"]`
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
Add-Type -AssemblyName System.Windows.Forms
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

public static class AicGlobalCopyInput {
  private const uint InputKeyboard = 1;
  private const uint KeyEventKeyUp = 0x0002;
  private const ushort VirtualKeyControl = 0x11;
  private const ushort VirtualKeyC = 0x43;

  [StructLayout(LayoutKind.Sequential)]
  private struct Input {
    public uint type;
    public InputUnion data;
  }

  [StructLayout(LayoutKind.Explicit)]
  private struct InputUnion {
    [FieldOffset(0)]
    public KeyboardInput keyboard;
    [FieldOffset(0)]
    public MouseInput mouse;
    [FieldOffset(0)]
    public HardwareInput hardware;
  }

  [StructLayout(LayoutKind.Sequential)]
  private struct KeyboardInput {
    public ushort virtualKey;
    public ushort scanCode;
    public uint flags;
    public uint time;
    public UIntPtr extraInfo;
  }

  [StructLayout(LayoutKind.Sequential)]
  private struct MouseInput {
    public int x;
    public int y;
    public uint mouseData;
    public uint flags;
    public uint time;
    public UIntPtr extraInfo;
  }

  [StructLayout(LayoutKind.Sequential)]
  private struct HardwareInput {
    public uint message;
    public ushort lowParam;
    public ushort highParam;
  }

  [DllImport("user32.dll")]
  public static extern short GetAsyncKeyState(int virtualKey);

  [DllImport("user32.dll")]
  public static extern uint GetClipboardSequenceNumber();

  [DllImport("user32.dll", SetLastError = true)]
  private static extern uint SendInput(uint inputCount, Input[] inputs, int inputSize);

  private static Input CreateKeyInput(ushort virtualKey, bool keyUp) {
    Input input = new Input();
    input.type = InputKeyboard;
    input.data.keyboard.virtualKey = virtualKey;
    input.data.keyboard.flags = keyUp ? KeyEventKeyUp : 0;
    return input;
  }

  public static bool IsCaptureChordKeyDown() {
    int[] keys = new int[] {
      0x10, 0x11, 0x12, 0x43,
      0x5B, 0x5C,
      0xA0, 0xA1, 0xA2, 0xA3, 0xA4, 0xA5
    };
    foreach (int key in keys) {
      if ((GetAsyncKeyState(key) & 0x8000) != 0) return true;
    }
    return false;
  }

  public static bool SendCopy() {
    Input[] inputs = new Input[] {
      CreateKeyInput(VirtualKeyControl, false),
      CreateKeyInput(VirtualKeyC, false),
      CreateKeyInput(VirtualKeyC, true),
      CreateKeyInput(VirtualKeyControl, true)
    };
    return SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(Input))) == inputs.Length;
  }
}
'@

[Console]::Out.WriteLine('READY')
[Console]::Out.Flush()
while (($line = [Console]::In.ReadLine()) -ne $null) {
  if ($line -eq 'EXIT') { break }
  if (-not $line.StartsWith('COPY:')) { continue }
  $commandParts = $line.Split(':', 3)
  if ($commandParts.Length -ne 3) { continue }
  $requestId = $commandParts[1]
  $strategy = $commandParts[2]
  $status = 'NO_SELECTION'
  try {
    $keysReleased = $false
    for ($attempt = 0; $attempt -lt 60; $attempt += 1) {
      if (-not [AicGlobalCopyInput]::IsCaptureChordKeyDown()) {
        $keysReleased = $true
        break
      }
      Start-Sleep -Milliseconds 10
    }
    if (-not $keysReleased) {
      $status = 'KEYS_HELD'
    } else {
      [Console]::Out.WriteLine('KEYS_RELEASED')
      [Console]::Out.Flush()
      $before = [AicGlobalCopyInput]::GetClipboardSequenceNumber()
      $copySent = $false
      if ($strategy -eq 'INPUT') {
        if (-not [AicGlobalCopyInput]::SendCopy()) {
          $status = 'SEND_FAILED'
        } else {
          $copySent = $true
        }
      } elseif ($strategy -eq 'SENDKEYS') {
        [System.Windows.Forms.SendKeys]::SendWait('^c')
        $copySent = $true
      } else {
        $status = 'INVALID_STRATEGY'
      }
      if ($copySent) {
        $clipboardWaitAttempts = if ($strategy -eq 'INPUT') { 60 } else { 100 }
        for ($clipboardAttempt = 0; $clipboardAttempt -lt $clipboardWaitAttempts; $clipboardAttempt += 1) {
          Start-Sleep -Milliseconds 10
          if ([AicGlobalCopyInput]::GetClipboardSequenceNumber() -ne $before) {
            $status = 'OK'
            break
          }
        }
      }
    }
  } catch {
    $status = 'FAILED'
  }
  [Console]::Out.WriteLine(('RESULT:{0}:{1}' -f $requestId, $status))
  [Console]::Out.Flush()
}
`["trim"]();
function resolveWindowsWorkerCommand() {
  return {
    'command': "powershell.exe",
    'args': ["-NoLogo", "-NoProfile", "-NonInteractive", '-ExecutionPolicy', 'Bypass', '-Command', WINDOWS_CAPTURE_WORKER_SCRIPT]
  };
}
function mapWindowsWorkerStatus(_0x5673d3) {
  if (_0x5673d3 === 'OK') {
    return {
      'ok': !![]
    };
  }
  if (_0x5673d3 === 'NO_SELECTION') {
    return {
      'ok': ![],
      'reason': "no-selection"
    };
  }
  if (_0x5673d3 === "KEYS_HELD") {
    return {
      'ok': ![],
      'reason': "shortcut-keys-still-held"
    };
  }
  return {
    'ok': ![],
    'reason': "copy-command-failed",
    'workerStatus': _0x5673d3
  };
}
const WINDOWS_COPY_STRATEGIES = Object['freeze'](['INPUT', "SENDKEYS"]);
function shouldRetryWindowsCopy(_0x17e3e2) {
  if (_0x17e3e2?.["reason"] === "no-selection") {
    return !![];
  }
  return _0x17e3e2?.["reason"] === 'copy-command-failed' && (_0x17e3e2?.["workerStatus"] === 'SEND_FAILED' || _0x17e3e2?.["workerStatus"] === "FAILED");
}
export function createSelectedTextCaptureController({
  platform = process["platform"],
  spawnProcess = spawn,
  loadSelectionHook = loadDefaultSelectionHook,
  startupTimeoutMs = 0xdac,
  timeoutMs = 0x9c4,
  windowsCopyStrategies = WINDOWS_COPY_STRATEGIES,
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout,
  onKeyReleased = () => {}
} = {}) {
  let _0x21f0ed = ![];
  let _0x8e65a4 = 0x0;
  let _0x5b4c30 = null;
  let _0xa6787a = null;
  let _0x2c85ae = ![];
  const _0x4f7d10 = new Map();
  const _0x2cc906 = Array["from"](new Set((Array['isArray'](windowsCopyStrategies) ? windowsCopyStrategies : WINDOWS_COPY_STRATEGIES)["filter"](_0x10aa9e => WINDOWS_COPY_STRATEGIES["includes"](_0x10aa9e))));
  if (_0x2cc906["length"] === 0x0) {
    _0x2cc906["push"](...WINDOWS_COPY_STRATEGIES);
  }
  function _0x3d1187(_0x57c265, _0x304346) {
    if (_0x57c265["readySettled"]) {
      return;
    }
    _0x57c265['readySettled'] = !![];
    if (_0x57c265["startupTimer"] !== null) {
      clearTimeoutFn(_0x57c265['startupTimer']);
    }
    _0x57c265["startupTimer"] = null;
    _0x57c265["resolveReady"](_0x304346);
  }
  function _0x12d427(_0x24ca14, _0x253744) {
    const _0xd70e00 = _0x4f7d10['get'](_0x24ca14);
    if (!_0xd70e00) {
      return;
    }
    _0x4f7d10["delete"](_0x24ca14);
    clearTimeoutFn(_0xd70e00['timer']);
    _0xd70e00["resolve"](_0x253744);
  }
  function _0x4212a9(_0x443d85, _0x1a0827, {
    kill = ![]
  } = {}) {
    if (!_0x443d85 || _0x443d85["closed"]) {
      return;
    }
    _0x443d85["closed"] = !![];
    if (_0x5b4c30 === _0x443d85) {
      _0x5b4c30 = null;
    }
    _0x3d1187(_0x443d85, _0x1a0827);
    _0x4f7d10["forEach"]((_0x468cbd, _0x4200b6) => {
      if (_0x468cbd["worker"] === _0x443d85) {
        _0x12d427(_0x4200b6, _0x1a0827);
      }
    });
    if (kill) {
      try {
        _0x443d85["child"]['kill']?.();
      } catch {}
    }
  }
  function _0x48913b(_0x544e87, _0x5a4be3) {
    const _0x812e0c = String(_0x5a4be3 || '')['trim']();
    if (!_0x812e0c || _0x544e87["closed"]) {
      return;
    }
    if (_0x812e0c === "KEYS_RELEASED") {
      onKeyReleased({
        'keysReleased': !![]
      });
      return;
    }
    if (_0x812e0c === 'READY') {
      _0x544e87["ready"] = !![];
      _0x3d1187(_0x544e87, {
        'ok': !![]
      });
      return;
    }
    const _0x420ebf = /^RESULT:([^:]+):([A-Z_]+)$/['exec'](_0x812e0c);
    if (!_0x420ebf) {
      return;
    }
    _0x12d427(_0x420ebf[0x1], mapWindowsWorkerStatus(_0x420ebf[0x2]));
  }
  function _0x270b6a(_0x500ebc, _0x1c483c) {
    _0x500ebc["outputBuffer"] += String(_0x1c483c || '');
    let _0x579f26 = _0x500ebc["outputBuffer"]['indexOf']('\x0a');
    while (_0x579f26 >= 0x0) {
      _0x48913b(_0x500ebc, _0x500ebc['outputBuffer']["slice"](0x0, _0x579f26));
      _0x500ebc["outputBuffer"] = _0x500ebc['outputBuffer']["slice"](_0x579f26 + 0x1);
      _0x579f26 = _0x500ebc["outputBuffer"]['indexOf']('\x0a');
    }
  }
  function _0x676a1c() {
    if (_0x21f0ed) {
      return Promise['resolve']({
        'ok': ![],
        'reason': "capture-controller-destroyed"
      });
    }
    if (_0x5b4c30 && !_0x5b4c30["closed"]) {
      return _0x5b4c30["readyPromise"];
    }
    const _0x3ea175 = resolveWindowsWorkerCommand();
    let _0x420d13 = null;
    try {
      _0x420d13 = spawnProcess(_0x3ea175['command'], _0x3ea175['args'], {
        'stdio': ["pipe", "pipe", "ignore"],
        'windowsHide': !![]
      });
    } catch (_0x419390) {
      return Promise["resolve"]({
        'ok': ![],
        'reason': "copy-command-failed",
        'error': String(_0x419390?.["message"] || _0x419390 || '')
      });
    }
    const _0x36946e = {
      'child': _0x420d13,
      'closed': ![],
      'outputBuffer': '',
      'ready': ![],
      'readySettled': ![],
      'resolveReady': null,
      'startupTimer': null
    };
    _0x36946e["readyPromise"] = new Promise(_0x46c68f => {
      _0x36946e["resolveReady"] = _0x46c68f;
    });
    _0x5b4c30 = _0x36946e;
    _0x420d13['stdout']?.['on']?.("data", _0x44ebb2 => _0x270b6a(_0x36946e, _0x44ebb2));
    _0x420d13['stdin']?.['on']?.('error', _0x3df6bf => {
      _0x4212a9(_0x36946e, {
        'ok': ![],
        'reason': 'copy-command-failed',
        'error': String(_0x3df6bf?.["message"] || _0x3df6bf || '')
      });
    });
    _0x420d13["once"]?.("error", _0x121de7 => {
      _0x4212a9(_0x36946e, {
        'ok': ![],
        'reason': "copy-command-failed",
        'error': String(_0x121de7?.["message"] || _0x121de7 || '')
      });
    });
    _0x420d13["once"]?.('exit', _0x2f6d47 => {
      _0x4212a9(_0x36946e, {
        'ok': ![],
        'reason': "copy-command-failed",
        'exitCode': Number(_0x2f6d47)
      });
    });
    _0x36946e["startupTimer"] = setTimeoutFn(() => {
      _0x4212a9(_0x36946e, {
        'ok': ![],
        'reason': 'copy-worker-startup-timeout'
      }, {
        'kill': !![]
      });
    }, startupTimeoutMs);
    return _0x36946e["readyPromise"];
  }
  function _0x1b42ce() {
    const _0x27cad8 = _0xa6787a;
    _0xa6787a = null;
    if (!_0x27cad8) {
      return;
    }
    try {
      _0x27cad8['stop']?.();
    } catch {}
    try {
      _0x27cad8['cleanup']?.();
    } catch {}
  }
  function _0x580d70() {
    if (_0xa6787a) {
      return {
        'ok': !![]
      };
    }
    if (_0x2c85ae || _0x21f0ed || !["win32", 'darwin', 'linux']["includes"](platform)) {
      return {
        'ok': ![],
        'reason': "native-selection-unavailable"
      };
    }
    let _0x19cf8f = null;
    try {
      const _0x499270 = loadSelectionHook?.();
      const _0xa9bd4b = _0x499270?.["default"] || _0x499270;
      if (typeof _0xa9bd4b !== 'function') {
        _0x2c85ae = !![];
        return {
          'ok': ![],
          'reason': "native-selection-unavailable"
        };
      }
      _0x19cf8f = new _0xa9bd4b();
      _0x19cf8f['on']?.("error", () => {});
      _0x19cf8f['on']?.("key-up", _0x5354da => {
        if (_0x21f0ed || platform === "win32" && Number(_0x5354da?.["flags"]) & 0x10) {
          return;
        }
        onKeyReleased(_0x5354da);
      });
      _0x19cf8f["setSelectionPassiveMode"]?.(!![]);
      const _0x29045a = _0xa9bd4b["FineTunedListType"] || {};
      platform === "win32" && typeof _0x19cf8f["setFineTunedList"] === "function" && (Number["isInteger"](_0x29045a["EXCLUDE_CLIPBOARD_CURSOR_DETECT"]) && _0x19cf8f["setFineTunedList"](_0x29045a["EXCLUDE_CLIPBOARD_CURSOR_DETECT"], WINDOWS_FINE_TUNED_SELECTION_APPS['excludeClipboardCursorDetect']), Number["isInteger"](_0x29045a['INCLUDE_CLIPBOARD_DELAY_READ']) && _0x19cf8f["setFineTunedList"](_0x29045a['INCLUDE_CLIPBOARD_DELAY_READ'], WINDOWS_FINE_TUNED_SELECTION_APPS["includeClipboardDelayRead"]));
      if (_0x19cf8f["start"]?.() !== !![]) {
        try {
          _0x19cf8f["cleanup"]?.();
        } catch {}
        _0x2c85ae = !![];
        return {
          'ok': ![],
          'reason': "native-selection-start-failed"
        };
      }
      _0xa6787a = _0x19cf8f;
      return {
        'ok': !![]
      };
    } catch (_0x1e7d94) {
      _0x2c85ae = !![];
      try {
        _0x19cf8f?.["stop"]?.();
      } catch {}
      try {
        _0x19cf8f?.["cleanup"]?.();
      } catch {}
      return {
        'ok': ![],
        'reason': "native-selection-unavailable",
        'error': String(_0x1e7d94?.["message"] || _0x1e7d94 || '')
      };
    }
  }
  function _0x3bcd54(_0x4921a5, _0x3c4917) {
    const _0x2b5bf6 = String(++_0x8e65a4);
    return new Promise(_0x4abe72 => {
      const _0x204ce4 = setTimeoutFn(() => {
        _0x12d427(_0x2b5bf6, {
          'ok': ![],
          'reason': "copy-command-timeout"
        });
        _0x4212a9(_0x4921a5, {
          'ok': ![],
          'reason': 'copy-command-timeout'
        }, {
          'kill': !![]
        });
      }, timeoutMs);
      _0x4f7d10["set"](_0x2b5bf6, {
        'resolve': _0x4abe72,
        'timer': _0x204ce4,
        'worker': _0x4921a5
      });
      try {
        _0x4921a5["child"]["stdin"]?.["write"]?.("COPY:" + _0x2b5bf6 + ':' + _0x3c4917 + '\x0a');
      } catch (_0x5c743f) {
        _0x12d427(_0x2b5bf6, {
          'ok': ![],
          'reason': "copy-command-failed",
          'error': String(_0x5c743f?.["message"] || _0x5c743f || '')
        });
        _0x4212a9(_0x4921a5, {
          'ok': ![],
          'reason': "copy-command-failed"
        }, {
          'kill': !![]
        });
      }
    });
  }
  async function _0x9cf189() {
    const _0x4874f6 = await _0x676a1c();
    if (!_0x4874f6?.['ok']) {
      return _0x4874f6;
    }
    const _0x4f388f = _0x5b4c30;
    if (!_0x4f388f || _0x4f388f['closed'] || !_0x4f388f["ready"]) {
      return {
        'ok': ![],
        'reason': "copy-worker-unavailable"
      };
    }
    let _0x5275e1 = {
      'ok': ![],
      'reason': "copy-command-failed"
    };
    for (let _0x277e30 = 0x0; _0x277e30 < _0x2cc906["length"]; _0x277e30 += 0x1) {
      _0x5275e1 = await _0x3bcd54(_0x4f388f, _0x2cc906[_0x277e30]);
      if (_0x5275e1?.['ok'] === !![]) {
        return _0x5275e1;
      }
      if (_0x277e30 >= _0x2cc906["length"] - 0x1 || !shouldRetryWindowsCopy(_0x5275e1)) {
        return _0x5275e1;
      }
    }
    return _0x5275e1;
  }
  function _0x3c990c() {
    try {
      const _0x57ad59 = _0xa6787a["getCurrentSelection"]?.();
      const _0x15ca8b = typeof _0x57ad59?.['text'] === "string" ? _0x57ad59["text"] : '';
      if (!_0x15ca8b["trim"]()) {
        return {
          'ok': ![],
          'reason': "no-selection"
        };
      }
      return {
        'ok': !![],
        'text': _0x15ca8b,
        'source': "selection-hook",
        'programName': String(_0x57ad59?.["programName"] || ''),
        'method': Number(_0x57ad59?.["method"]) || 0x0
      };
    } catch (_0x163bae) {
      _0x1b42ce();
      return {
        'ok': ![],
        'reason': "native-selection-failed",
        'error': String(_0x163bae?.["message"] || _0x163bae || '')
      };
    }
  }
  async function _0x50ca3f() {
    const _0x41d174 = _0x580d70();
    if (!_0x41d174['ok'] || !_0xa6787a) {
      return _0x9cf189();
    }
    const _0x163bef = _0x3c990c();
    if (_0x163bef?.['ok']) {
      return _0x163bef;
    }
    return _0x9cf189();
  }
  async function _0x1961fb() {
    const _0x1cd0f3 = _0x580d70();
    if (platform !== 'win32') {
      return _0x1cd0f3;
    }
    const _0x313aec = await _0x676a1c();
    return _0x1cd0f3?.['ok'] || _0x313aec?.['ok'] ? {
      'ok': !![]
    } : _0x313aec || _0x1cd0f3;
  }
  function _0x2a9afd() {
    if (_0x21f0ed) {
      return Promise["resolve"]({
        'ok': ![],
        'reason': "capture-controller-destroyed"
      });
    }
    if (platform === 'win32') {
      return _0x50ca3f();
    }
    if (!['darwin', 'linux']["includes"](platform)) {
      return Promise["resolve"]({
        'ok': ![],
        'reason': "unsupported-platform"
      });
    }
    const _0x1b6ed4 = _0x580d70();
    return Promise["resolve"](_0x1b6ed4['ok'] ? _0x3c990c() : _0x1b6ed4);
  }
  function _0x3bfe78() {
    if (_0x21f0ed) {
      return;
    }
    _0x21f0ed = !![];
    _0x1b42ce();
    const _0x533070 = _0x5b4c30;
    if (!_0x533070) {
      return;
    }
    try {
      _0x533070['child']["stdin"]?.["write"]?.("EXIT\n");
      _0x533070['child']['stdin']?.["end"]?.();
    } catch {}
    _0x4212a9(_0x533070, {
      'ok': ![],
      'reason': "capture-controller-destroyed"
    }, {
      'kill': !![]
    });
  }
  return {
    'capture': _0x2a9afd,
    'destroy': _0x3bfe78,
    'prewarm': _0x1961fb,
    'isKeyReleaseTrackingAvailable': () => Boolean(_0xa6787a) && !_0x21f0ed
  };
}
export async function copySelectedTextToClipboard(_0x47d93e = {}) {
  const _0x2077b5 = createSelectedTextCaptureController(_0x47d93e);
  try {
    return await _0x2077b5["capture"]();
  } finally {
    _0x2077b5['destroy']();
  }
}
export const __selectedTextCaptureForTest = {
  'mapWindowsWorkerStatus': mapWindowsWorkerStatus,
  'shouldRetryWindowsCopy': shouldRetryWindowsCopy,
  'resolveWindowsWorkerCommand': resolveWindowsWorkerCommand,
  'WINDOWS_CAPTURE_WORKER_SCRIPT': WINDOWS_CAPTURE_WORKER_SCRIPT
};