import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import a199_0x204c3f from 'node:path';
import { identifyChromeShellBrowser } from './chromeShellBrowserVersion.js';
import { attachChromeShellStartupDiagnostics } from './chromeShellStartupDiagnostics.js';
import { prepareWindowsChromeShellTaskbarIdentity } from './windowsTaskbarIdentity.js';
const TRUE_RE = /^(1|true|yes|on)$/i;
const FALSE_RE = /^(0|false|no|off)$/i;
const DEFAULT_EARLY_EXIT_GRACE_MS = 0x1388;
const CHROME_SHELL_SPAWN_ERROR_CODE = 'CHROME_SHELL_SPAWN_ERROR';
const WINDOWS_ACTIVATION_TIMEOUT_MS = 0x1770;
const TRACKED_CLOSE_GRACE_MS = 0x5dc;
const TRACKED_CLOSE_FORCE_MS = 0x9c4;
const BACKGROUND_RESPONSIVENESS_ARGS = Object['freeze'](["--disable-background-timer-throttling", "--disable-renderer-backgrounding", '--disable-backgrounding-occluded-windows']);
function envFlag(_0x2d3726, _0xb33c) {
  const _0x4cd0f6 = String(_0x2d3726?.[_0xb33c] || '')["trim"]();
  if (!_0x4cd0f6) {
    return null;
  }
  if (TRUE_RE['test'](_0x4cd0f6)) {
    return !![];
  }
  if (FALSE_RE["test"](_0x4cd0f6)) {
    return ![];
  }
  return null;
}
export function shouldUseChromeShellRuntime(_0x3cf83d = process["env"], {
  appIsPackaged = ![],
  platform = process["platform"]
} = {}) {
  const _0x2d61fb = String(_0x3cf83d?.['AIC_CANVAS_RUNTIME'] || '')['trim']()["toLowerCase"]();
  if (envFlag(_0x3cf83d, "AIC_USE_ELECTRON_CANVAS") === !![] && !(appIsPackaged && (platform === "win32" || platform === "darwin"))) {
    return ![];
  }
  if (_0x2d61fb === "electron" || _0x2d61fb === 'browser-window') {
    return ![];
  }
  if (_0x2d61fb === "chrome-shell" || _0x2d61fb === "edge-shell") {
    return !![];
  }
  if (envFlag(_0x3cf83d, 'AIC_USE_CHROME_SHELL') === !![]) {
    return !![];
  }
  // 打包态默认使用 Electron 窗口模式（chrome-shell 的就绪上报尚未稳定验证）；
  // 开发态保持原行为（可通过 AIC_CANVAS_RUNTIME=electron 覆盖）。
  return !appIsPackaged;
}
export function shouldQuitWhenAllElectronWindowsClosed({
  platform = process["platform"],
  useChromeShellRuntime = ![]
} = {}) {
  if (useChromeShellRuntime) {
    return ![];
  }
  return platform !== "darwin";
}
export function isChromeShellLaunchActive(_0x3795f5) {
  const _0x59f70b = _0x3795f5?.['process'];
  if (!_0x59f70b) {
    return ![];
  }
  return _0x59f70b["exitCode"] == null && _0x59f70b["signalCode"] == null && _0x59f70b["killed"] !== !![];
}
export function buildChromeShellAppUrl(_0x214dc8, {
  appIsPackaged = ![]
} = {}) {
  const _0x5827f9 = new URL(String(_0x214dc8 || "http://127.0.0.1:8777/"));
  _0x5827f9["searchParams"]["set"]("aicRuntime", 'chrome-shell');
  appIsPackaged ? _0x5827f9["searchParams"]["set"]("aicPackaged", '1') : _0x5827f9["searchParams"]["delete"]("aicPackaged");
  return _0x5827f9["href"];
}
export function resolveChromeShellAppIdentity(_0x14f170) {
  try {
    const _0x372ac1 = new URL(String(_0x14f170 || ''));
    if (_0x372ac1["protocol"] !== 'http:' && _0x372ac1['protocol'] !== "https:" || _0x372ac1['username'] || _0x372ac1['password'] || _0x372ac1["searchParams"]["get"]("aicRuntime") !== "chrome-shell") {
      return '';
    }
    return _0x372ac1["protocol"] + '//' + _0x372ac1["host"] + _0x372ac1["pathname"];
  } catch {
    return '';
  }
}
function candidatePathsForPlatform(_0xeecbfb = process["env"], _0xec12c3 = process["platform"]) {
  if (_0xec12c3 === 'win32') {
    const _0x37f8bf = _0xeecbfb['ProgramFiles'] || _0xeecbfb["PROGRAMFILES"] || '';
    const _0x45d89c = _0xeecbfb['ProgramFiles(x86)'] || _0xeecbfb['PROGRAMFILES_X86'] || '';
    const _0xca18be = _0xeecbfb['LOCALAPPDATA'] || '';
    return [a199_0x204c3f["join"](_0x37f8bf, "Google", "Chrome", "Application", "chrome.exe"), a199_0x204c3f['join'](_0x45d89c, "Google", "Chrome", 'Application', 'chrome.exe'), a199_0x204c3f["join"](_0xca18be, "Google", "Chrome", "Application", 'chrome.exe'), a199_0x204c3f['join'](_0x37f8bf, "Microsoft", "Edge", "Application", "msedge.exe"), a199_0x204c3f["join"](_0x45d89c, "Microsoft", 'Edge', "Application", "msedge.exe"), a199_0x204c3f["join"](_0xca18be, "Microsoft", "Edge", "Application", "msedge.exe")]["filter"](Boolean);
  }
  if (_0xec12c3 === "darwin") {
    return ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", '/Applications/Microsoft\x20Edge.app/Contents/MacOS/Microsoft\x20Edge'];
  }
  return ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/microsoft-edge", "/usr/bin/microsoft-edge-stable"];
}
export function resolveChromeShellBrowserExecutable({
  env = process["env"],
  platform = process["platform"],
  exists = existsSync,
  preferredBrowser = "auto"
} = {}) {
  const _0x4f4b12 = ['chrome', 'edge']["includes"](String(preferredBrowser)["toLowerCase"]()) ? String(preferredBrowser)["toLowerCase"]() : 'auto';
  const _0x4b1cf9 = _0x57230b => {
    if (_0x4f4b12 === "auto") {
      return !![];
    }
    const _0x153577 = a199_0x204c3f['basename'](String(_0x57230b || ''))["toLowerCase"]();
    return _0x4f4b12 === "chrome" ? ['chrome.exe', "chrome", 'google\x20chrome', "google-chrome", 'google-chrome-stable']['includes'](_0x153577) : ["msedge.exe", "msedge", "microsoft edge", 'microsoft-edge', "microsoft-edge-stable"]["includes"](_0x153577);
  };
  const _0x38b498 = String(env["AIC_CHROME_SHELL_BROWSER"] || '')["trim"]();
  if (_0x38b498 && _0x4b1cf9(_0x38b498)) {
    const _0xbe5417 = /[\\/]/["test"](_0x38b498) || a199_0x204c3f["isAbsolute"](_0x38b498);
    if (!_0xbe5417 || exists(_0x38b498)) {
      return _0x38b498;
    }
  }
  return candidatePathsForPlatform(env, platform)["filter"](_0x4b1cf9)["find"](_0x301746 => exists(_0x301746)) || '';
}
export function resolveChromeShellProfileDir({
  app: _0x11010b,
  env = process["env"],
  browserPath = ''
} = {}) {
  const _0x4f3dd4 = String(env['AIC_CHROME_SHELL_PROFILE_DIR'] || '')["trim"]();
  if (_0x4f3dd4) {
    return a199_0x204c3f["resolve"](_0x4f3dd4);
  }
  const _0x2bc8be = _0x11010b?.["getPath"]?.("sessionData") || _0x11010b?.["getPath"]?.("userData") || process["cwd"]();
  const _0x5cda35 = identifyChromeShellBrowser(browserPath || env['AIC_CHROME_SHELL_BROWSER']);
  const _0x1d092a = _0x5cda35 === "edge" ? "edge-shell-profile" : _0x5cda35 === 'chromium' ? 'chromium-shell-profile' : "chrome-shell-profile";
  return a199_0x204c3f["join"](_0x2bc8be, _0x1d092a);
}
export function prepareChromeShellTaskbarIdentity({
  app: _0x31e014,
  env = process["env"],
  platform = process["platform"],
  windowsTaskbarIdentity = null,
  exists = existsSync,
  spawnProcess = spawn,
  logEvent = null
} = {}) {
  if (!windowsTaskbarIdentity) {
    return Promise['resolve'](null);
  }
  const _0x154e51 = resolveChromeShellBrowserExecutable({
    'env': env,
    'platform': platform,
    'exists': exists
  });
  if (!_0x154e51) {
    return Promise["resolve"](null);
  }
  const _0x299bf4 = resolveChromeShellProfileDir({
    'app': _0x31e014,
    'env': env,
    'browserPath': _0x154e51
  });
  return prepareWindowsChromeShellTaskbarIdentity({
    'browserPath': _0x154e51,
    'profileDir': _0x299bf4,
    'platform': platform,
    'spawnProcess': spawnProcess,
    'logEvent': logEvent,
    ...windowsTaskbarIdentity
  });
}
function resolveRemoteDebuggingPort(_0x2c8b14 = process['env']) {
  const _0x329eb2 = String(_0x2c8b14["AIC_CHROME_SHELL_REMOTE_DEBUGGING_PORT"] || '')["trim"]();
  if (!/^\d+$/["test"](_0x329eb2)) {
    return '';
  }
  const _0x86b420 = Number['parseInt'](_0x329eb2, 0xa);
  return _0x86b420 > 0x0 && _0x86b420 <= 0xffff ? String(_0x86b420) : '';
}
function shouldActivateChromeShellWindow({
  env = process["env"],
  platform = process["platform"]
} = {}) {
  if (platform !== 'win32' && platform !== "darwin") {
    return ![];
  }
  return envFlag(env, "AIC_CHROME_SHELL_ACTIVATE_WINDOW") !== ![];
}
function resolveBackgroundResponsivenessArgs(_0xb27def = process["env"]) {
  if (envFlag(_0xb27def, "AIC_CHROME_SHELL_PREVENT_BACKGROUND_THROTTLING") === ![]) {
    return [];
  }
  return [...BACKGROUND_RESPONSIVENESS_ARGS];
}
function resolveBackgroundModeArgs(_0x554ea9 = process["env"]) {
  if (envFlag(_0x554ea9, 'AIC_CHROME_SHELL_DISABLE_BACKGROUND_MODE') === ![]) {
    return [];
  }
  return ["--disable-background-mode"];
}
function isPlainObject(_0x39e371) {
  return _0x39e371 && typeof _0x39e371 === "object" && !Array['isArray'](_0x39e371);
}
function readJsonObject(_0x2234bf, _0x33d9ef = readFileSync) {
  try {
    const _0x1c0f17 = _0x33d9ef(_0x2234bf, "utf8");
    const _0x54f0c2 = JSON["parse"](String(_0x1c0f17 || '{}'));
    return isPlainObject(_0x54f0c2) ? _0x54f0c2 : {};
  } catch {
    return {};
  }
}
function readChromePreferences(_0x39923f, _0x477d69 = readFileSync) {
  return readJsonObject(_0x39923f, _0x477d69);
}
export function writeChromeShellPreferences({
  profileDir: _0x6df98a,
  disableDevTools = ![],
  mkdir = mkdirSync,
  readFile = readFileSync,
  writeFile = writeFileSync
} = {}) {
  const _0x28ab7e = a199_0x204c3f['join'](String(_0x6df98a || ''), "Default");
  mkdir(_0x28ab7e, {
    'recursive': !![]
  });
  const _0xe87633 = a199_0x204c3f['join'](_0x28ab7e, "Preferences");
  const _0x2eeacd = readChromePreferences(_0xe87633, readFile);
  const _0x5621d4 = isPlainObject(_0x2eeacd["devtools"]) ? _0x2eeacd["devtools"] : {};
  const _0x4f957f = {
    ..._0x5621d4
  };
  delete _0x4f957f["availability"];
  const _0x3bb31a = {
    ..._0x2eeacd,
    'credentials_enable_service': ![],
    'autofill': {
      ...(_0x2eeacd["autofill"] && typeof _0x2eeacd["autofill"] === "object" ? _0x2eeacd["autofill"] : {}),
      'credit_card_enabled': ![],
      'profile_enabled': ![]
    },
    'profile': {
      ...(_0x2eeacd["profile"] && typeof _0x2eeacd["profile"] === 'object' ? _0x2eeacd["profile"] : {}),
      'password_manager_enabled': ![]
    },
    'devtools': disableDevTools ? {
      ..._0x5621d4,
      'availability': 0x2
    } : _0x4f957f
  };
  writeFile(_0xe87633, JSON["stringify"](_0x3bb31a, null, 0x2) + '\x0a', "utf8");
  return {
    'preferencesPath': _0xe87633,
    'preferences': _0x3bb31a
  };
}
function readPositiveInteger(_0x297aa1) {
  const _0x4e6c4d = Number(_0x297aa1);
  return Number['isFinite'](_0x4e6c4d) && _0x4e6c4d > 0x0 ? Math["round"](_0x4e6c4d) : 0x0;
}
function readFiniteInteger(_0x1f6e85) {
  const _0x162af7 = Number(_0x1f6e85);
  return Number["isFinite"](_0x162af7) ? Math['round'](_0x162af7) : null;
}
function readNonNegativeInteger(_0x394e67, _0x3c4ee6 = 0x0) {
  const _0x2f3b9e = Number(_0x394e67);
  if (!Number['isFinite'](_0x2f3b9e) || _0x2f3b9e < 0x0) {
    return _0x3c4ee6;
  }
  return Math['round'](_0x2f3b9e);
}
function resolveEarlyExitGraceMs(_0x2ae516 = process["env"]) {
  const _0x4ccbcc = String(_0x2ae516['AIC_CHROME_SHELL_EARLY_EXIT_GRACE_MS'] || '')["trim"]();
  if (!_0x4ccbcc) {
    return DEFAULT_EARLY_EXIT_GRACE_MS;
  }
  return readNonNegativeInteger(_0x4ccbcc, DEFAULT_EARLY_EXIT_GRACE_MS);
}
function isCleanEarlyChromeShellExit({
  code: _0x53d805,
  signal: _0x26a427,
  runtimeMs: _0x68dca5,
  graceMs: _0x3ffa2b
}) {
  return _0x53d805 === 0x0 && !_0x26a427 && _0x3ffa2b > 0x0 && _0x68dca5 >= 0x0 && _0x68dca5 < _0x3ffa2b;
}
export function normalizeChromeShellSpawnError(_0x3c4919) {
  if (_0x3c4919?.['code'] === CHROME_SHELL_SPAWN_ERROR_CODE) {
    return _0x3c4919;
  }
  const _0x187ab8 = String(_0x3c4919?.["message"] || '')["trim"]();
  const _0x195242 = new Error(_0x187ab8 ? "Chrome shell process failed to start: " + _0x187ab8 : "Chrome shell process failed to start");
  _0x195242['name'] = "ChromeShellSpawnError";
  _0x195242["code"] = CHROME_SHELL_SPAWN_ERROR_CODE;
  _0x195242["cause"] = _0x3c4919;
  _0x195242["details"] = {
    'originalCode': String(_0x3c4919?.['code'] || ''),
    'errno': _0x3c4919?.["errno"] ?? null,
    'syscall': String(_0x3c4919?.["syscall"] || ''),
    'path': String(_0x3c4919?.['path'] || '')
  };
  return _0x195242;
}
function buildWindowsActivationScript(_0x30032b) {
  const _0x2ff59e = readPositiveInteger(_0x30032b);
  if (!_0x2ff59e) {
    return '';
  }
  return ('\x0a$targetPid\x20=\x20' + _0x2ff59e + '\x0a$deadline\x20=\x20[DateTime]::UtcNow.AddMilliseconds(' + WINDOWS_ACTIVATION_TIMEOUT_MS + ")\n$typeDefinition = @'\nusing System;\nusing System.Text;\nusing System.Runtime.InteropServices;\npublic static class AicChromeShellWindowActivator {\n  public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);\n  [DllImport(\"user32.dll\")] public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);\n  [DllImport(\"user32.dll\")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);\n  [DllImport(\"user32.dll\")] public static extern int GetWindowTextLength(IntPtr hWnd);\n  [DllImport(\"user32.dll\")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);\n  [DllImport(\"user32.dll\")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT rect);\n  [DllImport(\"user32.dll\")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);\n  [DllImport(\"user32.dll\")] public static extern bool IsIconic(IntPtr hWnd);\n  [DllImport(\"user32.dll\")] public static extern bool SetForegroundWindow(IntPtr hWnd);\n  public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }\n}\n'@\nAdd-Type -TypeDefinition $typeDefinition -ErrorAction SilentlyContinue\nwhile ([DateTime]::UtcNow -lt $deadline) {\n  $script:shown = $false\n  [AicChromeShellWindowActivator]::EnumWindows({\n    param($hWnd, $lParam)\n    $windowProcessId = [uint32]0\n    [void][AicChromeShellWindowActivator]::GetWindowThreadProcessId($hWnd, [ref]$windowProcessId)\n    if ([int]$windowProcessId -ne $targetPid) { return $true }\n    $len = [AicChromeShellWindowActivator]::GetWindowTextLength($hWnd)\n    $text = New-Object System.Text.StringBuilder ([Math]::Max(256, $len + 1))\n    [void][AicChromeShellWindowActivator]::GetWindowText($hWnd, $text, $text.Capacity)\n    $title = $text.ToString()\n    $rect = New-Object AicChromeShellWindowActivator+RECT\n    [void][AicChromeShellWindowActivator]::GetWindowRect($hWnd, [ref]$rect)\n    $width = $rect.Right - $rect.Left\n    $height = $rect.Bottom - $rect.Top\n    $looksLikeAppWindow = $title -like '*SHUO Canvas*' -or $title -like '*AI Canvas*' -or ($width -gt 300 -and $height -gt 300 -and $title -notmatch 'IME')\n    if (-not $looksLikeAppWindow) { return $true }\n    [void][AicChromeShellWindowActivator]::ShowWindow($hWnd, 9)\n    [void][AicChromeShellWindowActivator]::SetForegroundWindow($hWnd)\n    $script:shown = $true\n    return $false\n  }, [IntPtr]::Zero) | Out-Null\n  if ($script:shown) { exit 0 }\n  Start-Sleep -Milliseconds 200\n}\nexit 0\n")["trim"]();
}
function buildMacActivationScript(_0x343316) {
  const _0xf0f982 = readPositiveInteger(_0x343316);
  if (!_0xf0f982) {
    return '';
  }
  return ['ObjC.import(\x22AppKit\x22);', 'const\x20app\x20=\x20$.NSRunningApplication.runningApplicationWithProcessIdentifier(' + _0xf0f982 + ');', 'if\x20(app)\x20{', "  app.activateWithOptions($.NSApplicationActivateAllWindows | $.NSApplicationActivateIgnoringOtherApps);", '}']["join"]('\x0a');
}
export function activateChromeShellWindowSoon({
  child: _0x20fc55,
  env = process['env'],
  platform = process['platform'],
  spawnProcess = spawn
} = {}) {
  if (!shouldActivateChromeShellWindow({
    'env': env,
    'platform': platform
  })) {
    return null;
  }
  const _0x5c7328 = readPositiveInteger(_0x20fc55?.['pid']);
  if (!_0x5c7328) {
    return null;
  }
  try {
    const _0x1d2232 = platform === 'darwin' ? spawnProcess("osascript", ['-l', "JavaScript", '-e', buildMacActivationScript(_0x5c7328)], {
      'stdio': 'ignore',
      'detached': !![]
    }) : spawnProcess("powershell.exe", ['-NoLogo', "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", buildWindowsActivationScript(_0x5c7328)], {
      'stdio': "ignore",
      'windowsHide': !![],
      'detached': !![]
    });
    _0x1d2232?.["unref"]?.();
    return _0x1d2232 || null;
  } catch {
    return null;
  }
}
function buildWindowsChromeShellFocusScript() {
  return ("\n$focusMode = [Environment]::GetEnvironmentVariable(\"AIC_CHROME_SHELL_FOCUS_MODE\")\n$windowAction = [Environment]::GetEnvironmentVariable(\"AIC_CHROME_SHELL_WINDOW_ACTION\")\n$targetPidText = [Environment]::GetEnvironmentVariable(\"AIC_CHROME_SHELL_TARGET_PID\")\n$expectedBrowserPath = [Environment]::GetEnvironmentVariable(\"AIC_CHROME_SHELL_EXPECTED_BROWSER_PATH\")\n$expectedProfileDir = [Environment]::GetEnvironmentVariable(\"AIC_CHROME_SHELL_EXPECTED_PROFILE_DIR\")\n$expectedAppBaseUrl = [Environment]::GetEnvironmentVariable(\"AIC_CHROME_SHELL_EXPECTED_APP_BASE_URL\")\n$timeoutText = [Environment]::GetEnvironmentVariable(\"AIC_CHROME_SHELL_FOCUS_TIMEOUT_MS\")\n$targetPid = 0\n$timeoutMs = " + WINDOWS_ACTIVATION_TIMEOUT_MS + '\x0a[void][int]::TryParse($targetPidText,\x20[ref]$targetPid)\x0a[void][int]::TryParse($timeoutText,\x20[ref]$timeoutMs)\x0a$typeDefinition\x20=\x20@\x27\x0ausing\x20System;\x0ausing\x20System.Text;\x0ausing\x20System.Runtime.InteropServices;\x0apublic\x20static\x20class\x20AicChromeShellFocus\x20{\x0a\x20\x20public\x20delegate\x20bool\x20EnumWindowsProc(IntPtr\x20hWnd,\x20IntPtr\x20lParam);\x0a\x20\x20[DllImport(\x22user32.dll\x22)]\x20public\x20static\x20extern\x20bool\x20EnumWindows(EnumWindowsProc\x20lpEnumFunc,\x20IntPtr\x20lParam);\x0a\x20\x20[DllImport(\x22user32.dll\x22)]\x20public\x20static\x20extern\x20bool\x20IsWindowVisible(IntPtr\x20hWnd);\x0a\x20\x20[DllImport(\x22user32.dll\x22,\x20CharSet\x20=\x20CharSet.Unicode)]\x20public\x20static\x20extern\x20int\x20GetWindowText(IntPtr\x20hWnd,\x20StringBuilder\x20text,\x20int\x20count);\x0a\x20\x20[DllImport(\x22user32.dll\x22)]\x20public\x20static\x20extern\x20int\x20GetWindowTextLength(IntPtr\x20hWnd);\x0a\x20\x20[DllImport(\x22user32.dll\x22)]\x20public\x20static\x20extern\x20uint\x20GetWindowThreadProcessId(IntPtr\x20hWnd,\x20out\x20uint\x20processId);\x0a\x20\x20[DllImport(\x22user32.dll\x22)]\x20public\x20static\x20extern\x20bool\x20ShowWindow(IntPtr\x20hWnd,\x20int\x20nCmdShow);\x0a\x20\x20[DllImport(\x22user32.dll\x22)]\x20public\x20static\x20extern\x20bool\x20SetForegroundWindow(IntPtr\x20hWnd);\x0a\x20\x20[DllImport(\x22user32.dll\x22)]\x20public\x20static\x20extern\x20bool\x20IsWindow(IntPtr\x20hWnd);\x0a\x20\x20[DllImport(\x22user32.dll\x22,\x20SetLastError\x20=\x20true)]\x20public\x20static\x20extern\x20bool\x20PostMessage(IntPtr\x20hWnd,\x20uint\x20message,\x20IntPtr\x20wParam,\x20IntPtr\x20lParam);\x0a\x20\x20[DllImport(\x22kernel32.dll\x22,\x20SetLastError\x20=\x20true)]\x20public\x20static\x20extern\x20IntPtr\x20OpenProcess(uint\x20access,\x20bool\x20inheritHandle,\x20uint\x20processId);\x0a\x20\x20[DllImport(\x22kernel32.dll\x22,\x20CharSet\x20=\x20CharSet.Unicode,\x20SetLastError\x20=\x20true)]\x20public\x20static\x20extern\x20bool\x20QueryFullProcessImageName(IntPtr\x20process,\x20uint\x20flags,\x20StringBuilder\x20path,\x20ref\x20uint\x20size);\x0a\x20\x20[DllImport(\x22kernel32.dll\x22)]\x20public\x20static\x20extern\x20bool\x20CloseHandle(IntPtr\x20handle);\x0a\x20\x20[DllImport(\x22shell32.dll\x22,\x20CharSet\x20=\x20CharSet.Unicode,\x20SetLastError\x20=\x20true)]\x20public\x20static\x20extern\x20IntPtr\x20CommandLineToArgvW(string\x20commandLine,\x20out\x20int\x20argumentCount);\x0a\x20\x20[DllImport(\x22kernel32.dll\x22,\x20SetLastError\x20=\x20true)]\x20public\x20static\x20extern\x20IntPtr\x20LocalFree(IntPtr\x20memory);\x0a\x20\x20public\x20static\x20string\x20GetProcessPath(uint\x20processId)\x20{\x0a\x20\x20\x20\x20IntPtr\x20process\x20=\x20OpenProcess(0x1000,\x20false,\x20processId);\x0a\x20\x20\x20\x20if\x20(process\x20==\x20IntPtr.Zero)\x20return\x20\x22\x22;\x0a\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20StringBuilder\x20path\x20=\x20new\x20StringBuilder(32768);\x0a\x20\x20\x20\x20\x20\x20uint\x20size\x20=\x20(uint)path.Capacity;\x0a\x20\x20\x20\x20\x20\x20return\x20QueryFullProcessImageName(process,\x200,\x20path,\x20ref\x20size)\x20?\x20path.ToString()\x20:\x20\x22\x22;\x0a\x20\x20\x20\x20}\x20finally\x20{\x0a\x20\x20\x20\x20\x20\x20CloseHandle(process);\x0a\x20\x20\x20\x20}\x0a\x20\x20}\x0a\x20\x20public\x20static\x20string[]\x20SplitCommandLine(string\x20commandLine)\x20{\x0a\x20\x20\x20\x20if\x20(String.IsNullOrWhiteSpace(commandLine))\x20return\x20new\x20string[0];\x0a\x20\x20\x20\x20int\x20argumentCount\x20=\x200;\x0a\x20\x20\x20\x20IntPtr\x20argumentList\x20=\x20CommandLineToArgvW(commandLine,\x20out\x20argumentCount);\x0a\x20\x20\x20\x20if\x20(argumentList\x20==\x20IntPtr.Zero\x20||\x20argumentCount\x20<=\x200)\x20return\x20new\x20string[0];\x0a\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20string[]\x20arguments\x20=\x20new\x20string[argumentCount];\x0a\x20\x20\x20\x20\x20\x20for\x20(int\x20index\x20=\x200;\x20index\x20<\x20argumentCount;\x20index++)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20IntPtr\x20argument\x20=\x20Marshal.ReadIntPtr(argumentList,\x20index\x20*\x20IntPtr.Size);\x0a\x20\x20\x20\x20\x20\x20\x20\x20arguments[index]\x20=\x20Marshal.PtrToStringUni(argument)\x20??\x20\x22\x22;\x0a\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20return\x20arguments;\x0a\x20\x20\x20\x20}\x20finally\x20{\x0a\x20\x20\x20\x20\x20\x20LocalFree(argumentList);\x0a\x20\x20\x20\x20}\x0a\x20\x20}\x0a}\x0a\x27@\x0atry\x20{\x20Add-Type\x20-TypeDefinition\x20$typeDefinition\x20-ErrorAction\x20Stop\x20}\x20catch\x20{\x20exit\x202\x20}\x0a$expectedFullPath\x20=\x20\x22\x22\x0a$expectedFullProfileDir\x20=\x20\x22\x22\x0a$expectedAppUri\x20=\x20$null\x0aif\x20(-not\x20[String]::IsNullOrWhiteSpace($expectedBrowserPath))\x20{\x0a\x20\x20try\x20{\x20$expectedFullPath\x20=\x20[IO.Path]::GetFullPath($expectedBrowserPath)\x20}\x20catch\x20{\x20exit\x202\x20}\x0a}\x0aif\x20(-not\x20[String]::IsNullOrWhiteSpace($expectedProfileDir))\x20{\x0a\x20\x20try\x20{\x20$expectedFullProfileDir\x20=\x20[IO.Path]::GetFullPath($expectedProfileDir)\x20}\x20catch\x20{\x20exit\x202\x20}\x0a}\x0aif\x20(-not\x20[String]::IsNullOrWhiteSpace($expectedAppBaseUrl))\x20{\x0a\x20\x20try\x20{\x0a\x20\x20\x20\x20$expectedAppUri\x20=\x20[Uri]$expectedAppBaseUrl\x0a\x20\x20}\x20catch\x20{\x20exit\x202\x20}\x0a}\x0aif\x20($focusMode\x20-eq\x20\x22detached\x22\x20-and\x20(\x0a\x20\x20[String]::IsNullOrWhiteSpace($expectedFullPath)\x20-or\x0a\x20\x20[String]::IsNullOrWhiteSpace($expectedFullProfileDir)\x20-or\x0a\x20\x20$null\x20-eq\x20$expectedAppUri\x0a))\x20{\x20exit\x202\x20}\x0afunction\x20Test-AicChromeShellLaunchIdentity([uint32]$processId)\x20{\x0a\x20\x20try\x20{\x0a\x20\x20\x20\x20$record\x20=\x20Get-CimInstance\x20Win32_Process\x20-Filter\x20(\x22ProcessId\x20=\x20\x22\x20+\x20$processId)\x20-ErrorAction\x20Stop\x0a\x20\x20}\x20catch\x20{\x0a\x20\x20\x20\x20return\x20$false\x0a\x20\x20}\x0a\x20\x20if\x20($null\x20-eq\x20$record)\x20{\x20return\x20$false\x20}\x0a\x20\x20$hasExpectedProfile\x20=\x20$false\x0a\x20\x20$hasExpectedApp\x20=\x20$false\x0a\x20\x20foreach\x20($argument\x20in\x20[AicChromeShellFocus]::SplitCommandLine([string]$record.CommandLine))\x20{\x0a\x20\x20\x20\x20if\x20($argument.StartsWith(\x22--user-data-dir=\x22,\x20[StringComparison]::OrdinalIgnoreCase))\x20{\x0a\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20$candidateProfile\x20=\x20[IO.Path]::GetFullPath($argument.Substring(16))\x0a\x20\x20\x20\x20\x20\x20\x20\x20$hasExpectedProfile\x20=\x20[String]::Equals(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20$candidateProfile,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20$expectedFullProfileDir,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20[StringComparison]::OrdinalIgnoreCase\x0a\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20}\x20catch\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20$hasExpectedProfile\x20=\x20$false\x0a\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20if\x20($argument.StartsWith(\x22--app=\x22,\x20[StringComparison]::OrdinalIgnoreCase))\x20{\x0a\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20$candidateAppUri\x20=\x20[Uri]$argument.Substring(6)\x0a\x20\x20\x20\x20\x20\x20\x20\x20$hasExpectedApp\x20=\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20[String]::Equals($candidateAppUri.Scheme,\x20$expectedAppUri.Scheme,\x20[StringComparison]::OrdinalIgnoreCase)\x20-and\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20[String]::Equals($candidateAppUri.Host,\x20$expectedAppUri.Host,\x20[StringComparison]::OrdinalIgnoreCase)\x20-and\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20$candidateAppUri.Port\x20-eq\x20$expectedAppUri.Port\x20-and\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20[String]::Equals($candidateAppUri.AbsolutePath,\x20$expectedAppUri.AbsolutePath,\x20[StringComparison]::Ordinal)\x20-and\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20$candidateAppUri.Query\x20-match\x20\x27(?:^|[?&])aicRuntime=chrome-shell(?:&|$)\x27\x0a\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20}\x20catch\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20$hasExpectedApp\x20=\x20$false\x0a\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20}\x0a\x20\x20}\x0a\x20\x20return\x20$hasExpectedProfile\x20-and\x20$hasExpectedApp\x0a}\x0a$deadline\x20=\x20[DateTime]::UtcNow.AddMilliseconds($timeoutMs)\x0a$script:targetWindow\x20=\x20[IntPtr]::Zero\x0awhile\x20([DateTime]::UtcNow\x20-lt\x20$deadline)\x20{\x0a\x20\x20if\x20($windowAction\x20-eq\x20\x22close\x22\x20-and\x20$script:targetWindow\x20-ne\x20[IntPtr]::Zero)\x20{\x0a\x20\x20\x20\x20if\x20(-not\x20[AicChromeShellFocus]::IsWindow($script:targetWindow))\x20{\x20exit\x200\x20}\x0a\x20\x20\x20\x20Start-Sleep\x20-Milliseconds\x20100\x0a\x20\x20\x20\x20continue\x0a\x20\x20}\x0a\x20\x20$script:succeeded\x20=\x20$false\x0a\x20\x20[AicChromeShellFocus]::EnumWindows({\x0a\x20\x20\x20\x20param($hWnd,\x20$lParam)\x0a\x20\x20\x20\x20if\x20(-not\x20[AicChromeShellFocus]::IsWindowVisible($hWnd))\x20{\x20return\x20$true\x20}\x0a\x20\x20\x20\x20$windowProcessId\x20=\x20[uint32]0\x0a\x20\x20\x20\x20[void][AicChromeShellFocus]::GetWindowThreadProcessId($hWnd,\x20[ref]$windowProcessId)\x0a\x20\x20\x20\x20if\x20($focusMode\x20-eq\x20\x22tracked\x22\x20-and\x20[int]$windowProcessId\x20-ne\x20$targetPid)\x20{\x20return\x20$true\x20}\x0a\x20\x20\x20\x20$len\x20=\x20[AicChromeShellFocus]::GetWindowTextLength($hWnd)\x0a\x20\x20\x20\x20$text\x20=\x20New-Object\x20System.Text.StringBuilder\x20([Math]::Max(256,\x20$len\x20+\x201))\x0a\x20\x20\x20\x20[void][AicChromeShellFocus]::GetWindowText($hWnd,\x20$text,\x20$text.Capacity)\x0a\x20\x20\x20\x20$title\x20=\x20$text.ToString()\x0a\x20\x20\x20\x20if\x20($focusMode\x20-eq\x20\x22detached\x22\x20-and\x20$title\x20-notlike\x20\x22*SHUO\x20Canvas*\x22\x20-and\x20$title\x20-notlike\x20\x22*AI\x20Canvas*\x22)\x20{\x20return\x20$true\x20}\x0a\x20\x20\x20\x20if\x20(-not\x20[String]::IsNullOrWhiteSpace($expectedFullPath))\x20{\x0a\x20\x20\x20\x20\x20\x20$processPath\x20=\x20[AicChromeShellFocus]::GetProcessPath($windowProcessId)\x0a\x20\x20\x20\x20\x20\x20if\x20([String]::IsNullOrWhiteSpace($processPath))\x20{\x20return\x20$true\x20}\x0a\x20\x20\x20\x20\x20\x20try\x20{\x20$processPath\x20=\x20[IO.Path]::GetFullPath($processPath)\x20}\x20catch\x20{\x20return\x20$true\x20}\x0a\x20\x20\x20\x20\x20\x20if\x20(-not\x20[String]::Equals($processPath,\x20$expectedFullPath,\x20[StringComparison]::OrdinalIgnoreCase))\x20{\x20return\x20$true\x20}\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20if\x20($focusMode\x20-eq\x20\x22detached\x22\x20-and\x20-not\x20(Test-AicChromeShellLaunchIdentity\x20$windowProcessId))\x20{\x20return\x20$true\x20}\x0a\x20\x20\x20\x20if\x20($windowAction\x20-eq\x20\x22close\x22)\x20{\x0a\x20\x20\x20\x20\x20\x20if\x20([AicChromeShellFocus]::PostMessage($hWnd,\x200x0010,\x20[IntPtr]::Zero,\x20[IntPtr]::Zero))\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20$script:targetWindow\x20=\x20$hWnd\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20$false\x0a\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20return\x20$true\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20if\x20([AicChromeShellFocus]::IsIconic($hWnd))\x20{\x0a\x20\x20\x20\x20\x20\x20[void][AicChromeShellFocus]::ShowWindow($hWnd,\x209)\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20[void][AicChromeShellFocus]::SetForegroundWindow($hWnd)\x0a\x20\x20\x20\x20$script:succeeded\x20=\x20$true\x0a\x20\x20\x20\x20return\x20$false\x0a\x20\x20},\x20[IntPtr]::Zero)\x20|\x20Out-Null\x0a\x20\x20if\x20($script:succeeded)\x20{\x20exit\x200\x20}\x0a\x20\x20Start-Sleep\x20-Milliseconds\x20150\x0a}\x0aexit\x201\x0a')["trim"]();
}
function encodePowerShellCommand(_0x5d2575) {
  return Buffer['from'](String(_0x5d2575 || ''), "utf16le")['toString']('base64');
}
function resolveChromeShellFocusTarget(_0xfb10a5) {
  const _0xfea368 = _0xfb10a5?.["detached"] === !![];
  const _0x324555 = String(_0xfb10a5?.["browserPath"] || '')["trim"]();
  const _0x454ce9 = String(_0xfb10a5?.["profileDir"] || '')["trim"]();
  const _0x155a02 = resolveChromeShellAppIdentity(_0xfb10a5?.['appUrl']);
  if (_0xfea368) {
    if (!a199_0x204c3f['win32']["isAbsolute"](_0x324555) || !a199_0x204c3f["win32"]["isAbsolute"](_0x454ce9) || !_0x155a02) {
      return null;
    }
    return {
      'mode': 'detached',
      'targetPid': 0x0,
      'expectedBrowserPath': _0x324555,
      'expectedProfileDir': _0x454ce9,
      'expectedAppIdentity': _0x155a02
    };
  }
  const _0xa90237 = readPositiveInteger(_0xfb10a5?.["process"]?.["pid"]);
  if (!_0xa90237 || !isChromeShellLaunchActive(_0xfb10a5)) {
    return null;
  }
  return {
    'mode': 'tracked',
    'targetPid': _0xa90237,
    'expectedBrowserPath': a199_0x204c3f["win32"]['isAbsolute'](_0x324555) ? _0x324555 : '',
    'expectedProfileDir': '',
    'expectedAppIdentity': ''
  };
}
export async function controlChromeShellLaunchWindow({
  launch: _0x860170,
  action = "focus",
  env = process["env"],
  platform = process["platform"],
  spawnProcess = spawn,
  timeoutMs = WINDOWS_ACTIVATION_TIMEOUT_MS,
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout
} = {}) {
  if (platform !== "win32") {
    return ![];
  }
  const _0x4689c3 = String(action || '')["trim"]()['toLowerCase']();
  if (_0x4689c3 !== "focus" && _0x4689c3 !== "close") {
    return ![];
  }
  const _0x401590 = resolveChromeShellFocusTarget(_0x860170);
  if (!_0x401590) {
    return ![];
  }
  const _0x5ef235 = Math["max"](0x64, Math["min"](0x2710, readNonNegativeInteger(timeoutMs, WINDOWS_ACTIVATION_TIMEOUT_MS)));
  let _0x42d7b8;
  try {
    _0x42d7b8 = spawnProcess("powershell.exe", ["-NoLogo", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand", encodePowerShellCommand(buildWindowsChromeShellFocusScript())], {
      'stdio': "ignore",
      'windowsHide': !![],
      'env': {
        ...env,
        'AIC_CHROME_SHELL_FOCUS_MODE': _0x401590["mode"],
        'AIC_CHROME_SHELL_WINDOW_ACTION': _0x4689c3,
        'AIC_CHROME_SHELL_TARGET_PID': String(_0x401590["targetPid"]),
        'AIC_CHROME_SHELL_EXPECTED_BROWSER_PATH': _0x401590["expectedBrowserPath"],
        'AIC_CHROME_SHELL_EXPECTED_PROFILE_DIR': _0x401590['expectedProfileDir'],
        'AIC_CHROME_SHELL_EXPECTED_APP_BASE_URL': _0x401590["expectedAppIdentity"],
        'AIC_CHROME_SHELL_FOCUS_TIMEOUT_MS': String(_0x5ef235)
      }
    });
  } catch {
    return ![];
  }
  if (typeof _0x42d7b8?.["once"] !== 'function') {
    return ![];
  }
  return new Promise(_0x26f017 => {
    let _0x5e8ea2 = ![];
    let _0x4151ed = null;
    const _0xd1c2e6 = _0x1c9326 => {
      if (_0x5e8ea2) {
        return;
      }
      _0x5e8ea2 = !![];
      if (_0x4151ed !== null) {
        clearTimeoutFn(_0x4151ed);
      }
      _0x26f017(_0x1c9326 === !![]);
    };
    _0x42d7b8["once"]("error", () => _0xd1c2e6(![]));
    _0x42d7b8['once']('exit', _0x17c413 => _0xd1c2e6(_0x17c413 === 0x0));
    _0x4151ed = setTimeoutFn(() => {
      try {
        _0x42d7b8['kill']?.();
      } catch {}
      _0xd1c2e6(![]);
    }, _0x5ef235 + 0x3e8);
  });
}
export function focusChromeShellLaunchWindow(_0xaf7c70 = {}) {
  return controlChromeShellLaunchWindow({
    ..._0xaf7c70,
    'action': "focus"
  });
}
function waitForChromeShellProcessExit({
  child: _0x29c15c,
  timeoutMs: _0x3ff673,
  setTimeoutFn: _0x2f0847,
  clearTimeoutFn: _0x480307
}) {
  const _0xe8dafd = () => _0x29c15c?.['exitCode'] !== null && _0x29c15c?.["exitCode"] !== undefined || _0x29c15c?.["signalCode"] !== null && _0x29c15c?.["signalCode"] !== undefined;
  if (_0xe8dafd()) {
    return Promise["resolve"](!![]);
  }
  return new Promise(_0x28dcba => {
    let _0x1dfa85 = ![];
    let _0x477d34 = null;
    let _0x5f4d7f = null;
    const _0x1c2a9d = _0x316228 => {
      if (_0x1dfa85) {
        return;
      }
      _0x1dfa85 = !![];
      if (_0x477d34 !== null) {
        _0x480307(_0x477d34);
      }
      _0x29c15c?.["off"]?.("exit", _0x5f4d7f);
      _0x28dcba(_0x316228 === !![]);
    };
    _0x5f4d7f = () => _0x1c2a9d(!![]);
    _0x29c15c?.['once']?.('exit', _0x5f4d7f);
    const _0x2ed932 = _0x2f0847(() => _0x1c2a9d(_0xe8dafd()), Math["max"](0x0, Number(_0x3ff673) || 0x0));
    if (_0x1dfa85) {
      _0x480307(_0x2ed932);
    } else {
      _0x477d34 = _0x2ed932;
    }
  });
}
function runWindowsTaskkill({
  pid: _0x2d7828,
  force: _0x298c70,
  spawnProcess: _0x468b75,
  timeoutMs: _0x413ac9,
  setTimeoutFn: _0x5dd8e9,
  clearTimeoutFn: _0x295b5
}) {
  return new Promise(_0x3c61ef => {
    let _0x178082 = null;
    let _0x7a6964 = ![];
    let _0x265703 = null;
    const _0x37cb6a = _0x38a576 => {
      if (_0x7a6964) {
        return;
      }
      _0x7a6964 = !![];
      if (_0x265703 !== null) {
        _0x295b5(_0x265703);
      }
      _0x3c61ef(_0x38a576 === !![]);
    };
    const _0x2fbbb6 = ["/PID", String(_0x2d7828), '/T'];
    if (_0x298c70) {
      _0x2fbbb6["push"]('/F');
    }
    try {
      _0x178082 = _0x468b75("taskkill.exe", _0x2fbbb6, {
        'windowsHide': !![],
        'stdio': "ignore"
      });
    } catch {
      _0x37cb6a(![]);
      return;
    }
    if (typeof _0x178082?.["once"] !== "function") {
      _0x37cb6a(![]);
      return;
    }
    _0x178082['once']("error", () => _0x37cb6a(![]));
    _0x178082["once"]("exit", _0xe05d8c => _0x37cb6a(_0xe05d8c === 0x0));
    const _0xdc1818 = _0x5dd8e9(() => {
      try {
        _0x178082["kill"]?.();
      } catch {}
      _0x37cb6a(![]);
    }, Math["max"](0x64, Number(_0x413ac9) || 0x0));
    if (_0x7a6964) {
      _0x295b5(_0xdc1818);
    } else {
      _0x265703 = _0xdc1818;
    }
  });
}
export async function closeChromeShellLaunchForUpdate({
  launch: _0x4e7fb3,
  env = process['env'],
  platform = process['platform'],
  spawnProcess = spawn,
  controlWindow = controlChromeShellLaunchWindow,
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout,
  gracefulTimeoutMs = TRACKED_CLOSE_GRACE_MS,
  forceTimeoutMs = TRACKED_CLOSE_FORCE_MS
} = {}) {
  if (!_0x4e7fb3) {
    return !![];
  }
  if (_0x4e7fb3["detached"] === !![]) {
    return controlWindow({
      'launch': _0x4e7fb3,
      'action': 'close',
      'env': env,
      'platform': platform,
      'spawnProcess': spawnProcess,
      'setTimeoutFn': setTimeoutFn,
      'clearTimeoutFn': clearTimeoutFn
    });
  }
  const _0x214a0b = _0x4e7fb3['process'];
  if (!_0x214a0b || _0x214a0b['exitCode'] !== null && _0x214a0b["exitCode"] !== undefined || _0x214a0b["signalCode"] !== null && _0x214a0b["signalCode"] !== undefined) {
    return !![];
  }
  if (platform === "win32" && readPositiveInteger(_0x214a0b["pid"])) {
    await runWindowsTaskkill({
      'pid': _0x214a0b["pid"],
      'force': ![],
      'spawnProcess': spawnProcess,
      'timeoutMs': gracefulTimeoutMs,
      'setTimeoutFn': setTimeoutFn,
      'clearTimeoutFn': clearTimeoutFn
    });
    if (await waitForChromeShellProcessExit({
      'child': _0x214a0b,
      'timeoutMs': gracefulTimeoutMs,
      'setTimeoutFn': setTimeoutFn,
      'clearTimeoutFn': clearTimeoutFn
    })) {
      return !![];
    }
    await runWindowsTaskkill({
      'pid': _0x214a0b["pid"],
      'force': !![],
      'spawnProcess': spawnProcess,
      'timeoutMs': forceTimeoutMs,
      'setTimeoutFn': setTimeoutFn,
      'clearTimeoutFn': clearTimeoutFn
    });
    return waitForChromeShellProcessExit({
      'child': _0x214a0b,
      'timeoutMs': forceTimeoutMs,
      'setTimeoutFn': setTimeoutFn,
      'clearTimeoutFn': clearTimeoutFn
    });
  }
  try {
    _0x214a0b["kill"]?.();
  } catch {
    return _0x214a0b["exitCode"] !== null && _0x214a0b["exitCode"] !== undefined || _0x214a0b['signalCode'] !== null && _0x214a0b["signalCode"] !== undefined;
  }
  return waitForChromeShellProcessExit({
    'child': _0x214a0b,
    'timeoutMs': gracefulTimeoutMs,
    'setTimeoutFn': setTimeoutFn,
    'clearTimeoutFn': clearTimeoutFn
  });
}
function normalizeWindowMode(_0x4c625e = {}) {
  const _0x331a04 = String(_0x4c625e["show_state"] || _0x4c625e["state"] || '')['toLowerCase']();
  const _0x3742af = _0x4c625e["fullscreen"] === !![] || _0x4c625e['isFullscreen'] === !![] || _0x4c625e['is_fullscreen'] === !![] || _0x331a04["includes"]("fullscreen");
  const _0x544d17 = _0x4c625e["maximized"] === !![] || _0x4c625e['isMaximized'] === !![] || _0x4c625e['is_maximized'] === !![] || _0x331a04['includes']("maximized");
  return {
    'fullscreen': _0x3742af,
    'maximized': _0x544d17
  };
}
function normalizeChromeWindowPlacement(_0x5b46dc = {}) {
  if (!isPlainObject(_0x5b46dc)) {
    return null;
  }
  const _0x46513f = readFiniteInteger(_0x5b46dc["left"]);
  const _0x1912fd = readFiniteInteger(_0x5b46dc["top"]);
  const _0xdf18bb = readFiniteInteger(_0x5b46dc["right"]);
  const _0x11e383 = readFiniteInteger(_0x5b46dc["bottom"]);
  const _0x3163e9 = readPositiveInteger(_0x5b46dc["width"]) || (_0x46513f !== null && _0xdf18bb !== null ? Math["max"](0x0, _0xdf18bb - _0x46513f) : 0x0);
  const _0x4ad712 = readPositiveInteger(_0x5b46dc["height"]) || (_0x1912fd !== null && _0x11e383 !== null ? Math["max"](0x0, _0x11e383 - _0x1912fd) : 0x0);
  const {
    fullscreen: _0x5de5e1,
    maximized: _0x5cd3d0
  } = normalizeWindowMode(_0x5b46dc);
  if (!_0x5de5e1 && !_0x5cd3d0 && (!_0x3163e9 || !_0x4ad712)) {
    return null;
  }
  return {
    'fullscreen': _0x5de5e1,
    'maximized': _0x5cd3d0,
    'x': _0x46513f,
    'y': _0x1912fd,
    'width': _0x3163e9,
    'height': _0x4ad712
  };
}
function collectChromeAppWindowPlacements(_0x25a558, _0x4eef05 = []) {
  if (!isPlainObject(_0x25a558)) {
    return _0x4eef05;
  }
  const _0x3cb030 = normalizeChromeWindowPlacement(_0x25a558);
  if (_0x3cb030) {
    _0x4eef05['push'](_0x3cb030);
  }
  Object["values"](_0x25a558)["forEach"](_0x368a6e => {
    collectChromeAppWindowPlacements(_0x368a6e, _0x4eef05);
  });
  return _0x4eef05;
}
function pickChromeAppWindowPlacement(_0x3a38bc = {}) {
  const _0x28155b = collectChromeAppWindowPlacements(_0x3a38bc?.["browser"]?.["app_window_placement"]);
  if (_0x28155b["length"] <= 0x0) {
    return null;
  }
  return [..._0x28155b]["sort"]((_0x584974, _0x2bf281) => {
    const _0x28388f = _0xf9d1c1 => (_0xf9d1c1["fullscreen"] ? 0x3b9aca00 : 0x0) + (_0xf9d1c1["maximized"] ? 0x5f5e100 : 0x0) + _0xf9d1c1['width'] * _0xf9d1c1["height"];
    return _0x28388f(_0x2bf281) - _0x28388f(_0x584974);
  })[0x0];
}
function readLegacyElectronWindowState(_0xff4db6, _0x12cbcd = readFileSync) {
  const _0x491421 = a199_0x204c3f['join'](a199_0x204c3f["dirname"](String(_0xff4db6 || '')), "window-state.json");
  const _0x22e4a9 = readJsonObject(_0x491421, _0x12cbcd);
  const _0x561e56 = readPositiveInteger(_0x22e4a9["width"]);
  const _0x1b3125 = readPositiveInteger(_0x22e4a9["height"]);
  const {
    fullscreen: _0x16f071,
    maximized: _0x886286
  } = normalizeWindowMode(_0x22e4a9);
  if (!_0x16f071 && !_0x886286 && (!_0x561e56 || !_0x1b3125)) {
    return null;
  }
  return {
    'fullscreen': _0x16f071,
    'maximized': _0x886286,
    'x': null,
    'y': null,
    'width': _0x561e56,
    'height': _0x1b3125
  };
}
function normalizeDisplayWorkArea(_0x367b2a) {
  const _0x433933 = isPlainObject(_0x367b2a?.['workArea']) ? _0x367b2a["workArea"] : _0x367b2a;
  if (!isPlainObject(_0x433933)) {
    return null;
  }
  const _0x2417c6 = readFiniteInteger(_0x433933['x']);
  const _0x26d7f7 = readFiniteInteger(_0x433933['y']);
  const _0x1a5be4 = readPositiveInteger(_0x433933['width']);
  const _0x529ced = readPositiveInteger(_0x433933['height']);
  if (_0x2417c6 === null || _0x26d7f7 === null || !_0x1a5be4 || !_0x529ced) {
    return null;
  }
  return {
    'x': _0x2417c6,
    'y': _0x26d7f7,
    'width': _0x1a5be4,
    'height': _0x529ced
  };
}
function hasReasonableDisplayIntersection(_0x3dde3b, _0x694f40) {
  const _0x3b0cca = Math["max"](0x0, Math['min'](_0x3dde3b['x'] + _0x3dde3b["width"], _0x694f40['x'] + _0x694f40["width"]) - Math["max"](_0x3dde3b['x'], _0x694f40['x']));
  const _0x3bbe95 = Math["max"](0x0, Math['min'](_0x3dde3b['y'] + _0x3dde3b["height"], _0x694f40['y'] + _0x694f40['height']) - Math['max'](_0x3dde3b['y'], _0x694f40['y']));
  const _0x4a620b = Math["min"](0xf0, Math["max"](0x1, _0x3dde3b["width"] * 0.2));
  const _0xab498c = Math['min'](0x78, Math['max'](0x1, _0x3dde3b["height"] * 0.2));
  return _0x3b0cca >= _0x4a620b && _0x3bbe95 >= _0xab498c;
}
function distanceFromWindowCenterToWorkArea(_0x57b3b9, _0x21a3e0) {
  const _0x3418ea = _0x57b3b9['x'] + _0x57b3b9["width"] / 0x2;
  const _0x480590 = _0x57b3b9['y'] + _0x57b3b9["height"] / 0x2;
  const _0x4f6855 = Math["min"](Math["max"](_0x3418ea, _0x21a3e0['x']), _0x21a3e0['x'] + _0x21a3e0["width"]);
  const _0x56dd48 = Math['min'](Math['max'](_0x480590, _0x21a3e0['y']), _0x21a3e0['y'] + _0x21a3e0["height"]);
  return (_0x3418ea - _0x4f6855) ** 0x2 + (_0x480590 - _0x56dd48) ** 0x2;
}
function constrainWindowStateToDisplayWorkAreas(_0x289c29, _0x1daafd) {
  if (!Array["isArray"](_0x1daafd) || !_0x289c29 || _0x289c29["fullscreen"] || _0x289c29["maximized"] || _0x289c29['x'] === null || _0x289c29['y'] === null) {
    return _0x289c29;
  }
  const _0x299f8c = _0x1daafd["map"](_0x514598 => normalizeDisplayWorkArea(_0x514598))["filter"](Boolean);
  if (_0x299f8c["length"] <= 0x0) {
    return {
      ..._0x289c29,
      'x': null,
      'y': null
    };
  }
  if (_0x299f8c['some'](_0x43d1ee => hasReasonableDisplayIntersection(_0x289c29, _0x43d1ee))) {
    return _0x289c29;
  }
  const _0x151f4e = [..._0x299f8c]['sort']((_0x512679, _0x57a6a5) => distanceFromWindowCenterToWorkArea(_0x289c29, _0x512679) - distanceFromWindowCenterToWorkArea(_0x289c29, _0x57a6a5))[0x0];
  const _0x34d5e7 = Math["min"](_0x289c29["width"], _0x151f4e["width"]);
  const _0x541848 = Math["min"](_0x289c29["height"], _0x151f4e['height']);
  return {
    ..._0x289c29,
    'x': _0x151f4e['x'] + Math['round']((_0x151f4e["width"] - _0x34d5e7) / 0x2),
    'y': _0x151f4e['y'] + Math['round']((_0x151f4e["height"] - _0x541848) / 0x2),
    'width': _0x34d5e7,
    'height': _0x541848
  };
}
function buildWindowStartupArgs(_0x419ef6) {
  if (!_0x419ef6) {
    return [];
  }
  if (_0x419ef6["fullscreen"]) {
    return ["--start-fullscreen"];
  }
  if (_0x419ef6['maximized']) {
    return ["--start-maximized"];
  }
  if (!_0x419ef6['width'] || !_0x419ef6["height"]) {
    return [];
  }
  const _0x49dfc4 = ["--window-size=" + _0x419ef6["width"] + ',' + _0x419ef6["height"]];
  _0x419ef6['x'] !== null && _0x419ef6['y'] !== null && _0x49dfc4["unshift"]("--window-position=" + _0x419ef6['x'] + ',' + _0x419ef6['y']);
  return _0x49dfc4;
}
export function resolveChromeShellWindowStartupArgs({
  profileDir: _0x4d19f2,
  readFile = readFileSync,
  displayWorkAreas = null
} = {}) {
  const _0x540c73 = a199_0x204c3f["join"](String(_0x4d19f2 || ''), "Default", "Preferences");
  const _0x1cc291 = readChromePreferences(_0x540c73, readFile);
  return buildWindowStartupArgs(constrainWindowStateToDisplayWorkAreas(pickChromeAppWindowPlacement(_0x1cc291) || readLegacyElectronWindowState(_0x4d19f2, readFile), displayWorkAreas));
}
export async function launchChromeShell({
  app: _0x5238b8,
  appUrl: _0xefbe6d,
  env = process["env"],
  platform = process['platform'],
  windowsTaskbarIdentity = null,
  windowsTaskbarIdentityPreparation = null,
  exists = existsSync,
  mkdir = mkdirSync,
  readFile = readFileSync,
  writeFile = writeFileSync,
  spawnProcess = spawn,
  logEvent = null,
  onExit = null,
  onError = null,
  now = () => Date['now'](),
  displayWorkAreas = null
} = {}) {
  const _0x3f437a = resolveChromeShellBrowserExecutable({
    'env': env,
    'platform': platform,
    'exists': exists
  });
  if (!_0x3f437a) {
    throw new Error("Chrome or Edge executable not found");
  }
  const _0x2986a1 = resolveChromeShellProfileDir({
    'app': _0x5238b8,
    'env': env,
    'browserPath': _0x3f437a
  });
  mkdir(_0x2986a1, {
    'recursive': !![]
  });
  const _0xda757d = _0x5238b8?.['isPackaged'] === !![];
  writeChromeShellPreferences({
    'profileDir': _0x2986a1,
    'disableDevTools': _0xda757d,
    'mkdir': mkdir,
    'readFile': readFile,
    'writeFile': writeFile
  });
  const _0x4330ab = buildChromeShellAppUrl(_0xefbe6d, {
    'appIsPackaged': _0xda757d
  });
  const _0x4f289f = resolveRemoteDebuggingPort(env);
  const _0x4c4b61 = resolveChromeShellWindowStartupArgs({
    'profileDir': _0x2986a1,
    'readFile': readFile,
    'displayWorkAreas': displayWorkAreas
  });
  const _0x46c68a = ["--user-data-dir=" + _0x2986a1, '--no-first-run', "--no-default-browser-check", '--enable-logging=stderr', "--autoplay-policy=no-user-gesture-required", ...resolveBackgroundModeArgs(env), ...resolveBackgroundResponsivenessArgs(env), ..._0x4c4b61, ...(_0x4f289f ? ['--remote-debugging-port=' + _0x4f289f] : []), "--app=" + _0x4330ab];
  const _0x88b6cb = windowsTaskbarIdentityPreparation ? await windowsTaskbarIdentityPreparation : await prepareWindowsChromeShellTaskbarIdentity({
    'browserPath': _0x3f437a,
    'profileDir': _0x2986a1,
    'platform': platform,
    'spawnProcess': spawnProcess,
    'logEvent': logEvent,
    ...windowsTaskbarIdentity
  });
  let _0x353412;
  let _0x100301 = 0x0;
  try {
    _0x100301 = now();
    _0x353412 = spawnProcess(_0x3f437a, _0x46c68a, {
      'stdio': ["ignore", "ignore", "pipe"],
      'windowsHide': ![]
    });
  } catch (_0x1be8da) {
    _0x88b6cb?.["cancel"]?.();
    throw normalizeChromeShellSpawnError(_0x1be8da);
  }
  const _0xaab0bf = {
    'startupDiagnostics': attachChromeShellStartupDiagnostics(_0x353412),
    'browserPath': _0x3f437a,
    'profileDir': _0x2986a1,
    'appUrl': _0x4330ab,
    'process': _0x353412,
    'spawnedAt': _0x100301,
    'detached': ![],
    'spawnError': null
  };
  _0x353412?.['once']?.('error', _0x2f48f1 => {
    const _0x149c03 = normalizeChromeShellSpawnError(_0x2f48f1);
    _0xaab0bf["spawnError"] = _0x149c03;
    _0x88b6cb?.['cancel']?.();
    onError?.(_0x149c03);
  });
  typeof onExit === "function" && _0x353412?.["once"]?.('exit', (_0x3d9dd1, _0x1c2274) => onExit({
    'code': _0x3d9dd1,
    'signal': _0x1c2274,
    'spawnedAt': _0x100301
  }));
  _0x88b6cb?.["attach"](_0x353412);
  activateChromeShellWindowSoon({
    'child': _0x353412,
    'env': env,
    'platform': platform,
    'spawnProcess': spawnProcess
  });
  return _0xaab0bf;
}
function shouldQuitWhenChromeShellExits(_0x3618ca = process["env"]) {
  return envFlag(_0x3618ca, "AIC_CHROME_SHELL_KEEP_LAUNCHER") !== !![];
}
export async function launchChromeShellWithLifecycle({
  app: _0x8a0e04,
  appUrl: _0x16885b,
  env = process['env'],
  platform = process["platform"],
  windowsTaskbarIdentity = null,
  windowsTaskbarIdentityPreparation = null,
  exists = existsSync,
  mkdir = mkdirSync,
  readFile = readFileSync,
  writeFile = writeFileSync,
  spawnProcess = spawn,
  logEvent = null,
  onClosed = null,
  onLaunchError = null,
  now = () => Date["now"](),
  displayWorkAreas = null
} = {}) {
  const _0x946254 = resolveEarlyExitGraceMs(env);
  let _0x5ea550 = null;
  _0x5ea550 = await launchChromeShell({
    'app': _0x8a0e04,
    'appUrl': _0x16885b,
    'env': env,
    'platform': platform,
    'windowsTaskbarIdentity': windowsTaskbarIdentity,
    'windowsTaskbarIdentityPreparation': windowsTaskbarIdentityPreparation,
    'exists': exists,
    'mkdir': mkdir,
    'readFile': readFile,
    'writeFile': writeFile,
    'spawnProcess': spawnProcess,
    'logEvent': logEvent,
    'now': now,
    'displayWorkAreas': displayWorkAreas,
    'onExit': ({
      code: _0x56ae6b,
      signal: _0x4ad125,
      spawnedAt: _0x119f04
    }) => {
      const _0x2fed79 = Math['max'](0x0, now() - _0x119f04);
      const _0x535da8 = {
        'code': _0x56ae6b,
        'signal': _0x4ad125,
        'runtimeMs': _0x2fed79
      };
      if (isCleanEarlyChromeShellExit({
        ..._0x535da8,
        'graceMs': _0x946254
      })) {
        if (_0x5ea550) {
          _0x5ea550['detached'] = !![];
        }
        logEvent?.({
          'type': "chrome_shell.early_exit_ignored",
          'level': "warn",
          'source': "main",
          'message': "Chrome shell process exited before the app-window grace period elapsed",
          'context': {
            ..._0x535da8,
            'graceMs': _0x946254,
            'profileDir': _0x5ea550?.['profileDir'] || '',
            'appUrl': _0x5ea550?.["appUrl"] || ''
          }
        });
        onClosed?.({
          ..._0x535da8,
          'detached': !![]
        });
        return;
      }
      if (_0x5ea550) {
        _0x5ea550["detached"] = ![];
      }
      logEvent?.({
        'type': 'chrome_shell.exited',
        'level': "info",
        'source': "main",
        'message': "Chrome shell process exited",
        'context': _0x535da8
      });
      const _0x4caf75 = onClosed?.({
        ..._0x535da8,
        'detached': ![]
      }) !== ![];
      _0x4caf75 && shouldQuitWhenChromeShellExits(env) && _0x8a0e04?.['quit']?.();
    },
    'onError': _0x40d61c => {
      const _0x1a90d1 = normalizeChromeShellSpawnError(_0x40d61c);
      if (_0x5ea550) {
        _0x5ea550["spawnError"] = _0x1a90d1;
      }
      logEvent?.({
        'type': "chrome_shell.spawn_error",
        'level': "error",
        'source': "main",
        'message': 'Chrome\x20shell\x20process\x20failed',
        'error': _0x1a90d1
      });
      onLaunchError?.(_0x1a90d1);
    }
  });
  logEvent?.({
    'type': "chrome_shell.launched",
    'level': "info",
    'source': 'main',
    'message': "Chrome shell launched",
    'context': {
      'browserPath': _0x5ea550["browserPath"],
      'profileDir': _0x5ea550["profileDir"],
      'appUrl': _0x5ea550["appUrl"]
    }
  });
  return _0x5ea550;
}
export const __chromeShellLauncherForTest = {
  'candidatePathsForPlatform': candidatePathsForPlatform,
  'envFlag': envFlag,
  'resolveRemoteDebuggingPort': resolveRemoteDebuggingPort,
  'shouldQuitWhenChromeShellExits': shouldQuitWhenChromeShellExits
};