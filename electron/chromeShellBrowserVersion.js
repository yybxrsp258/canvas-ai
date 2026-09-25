import { spawnSync } from 'node:child_process';
import { Buffer } from 'node:buffer';
import { unlinkSync } from 'node:fs';
import a198_0x15b027 from 'node:path';
import { resolveWindowsSystemToolPath } from './windowsSystemTools.js';
export const DEFAULT_MIN_CHROME_VERSION = '148.0.7778.280';
export const DEFAULT_MIN_EDGE_VERSION = "148.0.0.0";
export const DEFAULT_MIN_CHROMIUM_VERSION = DEFAULT_MIN_CHROME_VERSION;
const VERSION_CHECK_TIMEOUT_MS = 0x1388;
const SUPPORTED_BROWSER_KINDS = new Set(['chrome', "edge", "chromium"]);
const WINDOWS_BROWSER_PATH_ENV_NAME = "AIC_CHROME_SHELL_BROWSER_PATH_BASE64";
const WINDOWS_VERSION_SCRIPT = ["$encodedTarget = $env:" + WINDOWS_BROWSER_PATH_ENV_NAME, "if (-not $encodedTarget) { exit 2 }", "$target = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($encodedTarget))", 'if\x20(-not\x20$target)\x20{\x20exit\x202\x20}', "$item = Get-Item -LiteralPath $target -ErrorAction Stop", "[Console]::Out.Write($item.VersionInfo.ProductVersion)"]["join"](';\x20');
function parseVersionParts(_0x42a679) {
  const _0x295e33 = String(_0x42a679 || '')["match"](/\b(\d+(?:\.\d+){1,3})\b/);
  if (!_0x295e33) {
    return null;
  }
  const _0x65ffb3 = _0x295e33[0x1]["split"]('.')["map"](_0x2eea57 => Number['parseInt'](_0x2eea57, 0xa));
  if (_0x65ffb3["some"](_0x31d941 => !Number["isFinite"](_0x31d941) || _0x31d941 < 0x0)) {
    return null;
  }
  while (_0x65ffb3["length"] < 0x4) {
    _0x65ffb3["push"](0x0);
  }
  return {
    'text': _0x295e33[0x1],
    'parts': _0x65ffb3
  };
}
export function compareBrowserVersions(_0x3821b5, _0x6f5285) {
  const _0xd5bbed = parseVersionParts(_0x3821b5);
  const _0x9156db = parseVersionParts(_0x6f5285);
  if (!_0xd5bbed || !_0x9156db) {
    return null;
  }
  for (let _0x3162a0 = 0x0; _0x3162a0 < 0x4; _0x3162a0 += 0x1) {
    if (_0xd5bbed['parts'][_0x3162a0] < _0x9156db["parts"][_0x3162a0]) {
      return -0x1;
    }
    if (_0xd5bbed["parts"][_0x3162a0] > _0x9156db["parts"][_0x3162a0]) {
      return 0x1;
    }
  }
  return 0x0;
}
export function identifyChromeShellBrowser(_0x5b76a7) {
  const _0x247cf3 = a198_0x15b027["basename"](String(_0x5b76a7 || ''))["toLowerCase"]();
  if (_0x247cf3 === 'chrome.exe' || _0x247cf3 === 'chrome' || _0x247cf3 === "google chrome" || _0x247cf3 === 'google-chrome' || _0x247cf3 === "google-chrome-stable") {
    return 'chrome';
  }
  if (_0x247cf3 === 'msedge.exe' || _0x247cf3 === "msedge" || _0x247cf3 === "microsoft edge" || _0x247cf3 === 'microsoft-edge' || _0x247cf3 === "microsoft-edge-stable") {
    return "edge";
  }
  if (_0x247cf3 === "chromium" || _0x247cf3 === "chromium-browser") {
    return 'chromium';
  }
  return 'unknown';
}
function extractVersionFromProcessResult(_0x252be4) {
  if (_0x252be4?.['status'] !== 0x0 || _0x252be4?.["error"] || _0x252be4?.["signal"]) {
    return '';
  }
  return parseVersionParts(_0x252be4?.['stdout'])?.['text'] || '';
}
export function readBrowserExecutableVersion({
  browserPath: _0x310fe2,
  env = process["env"],
  platform = process["platform"],
  spawnProcess = spawnSync
} = {}) {
  const _0x46abae = String(_0x310fe2 || '')["trim"]();
  if (!_0x46abae) {
    return '';
  }
  try {
    if (platform === 'win32') {
      const _0x1b35fa = spawnProcess(resolveWindowsSystemToolPath('powershell', {
        'env': env
      }), ["-NoLogo", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", WINDOWS_VERSION_SCRIPT], {
        'encoding': "utf8",
        'env': {
          ...env,
          [WINDOWS_BROWSER_PATH_ENV_NAME]: Buffer["from"](_0x46abae, 'utf8')["toString"]("base64")
        },
        'timeout': VERSION_CHECK_TIMEOUT_MS,
        'windowsHide': !![]
      });
      return extractVersionFromProcessResult(_0x1b35fa);
    }
    const _0x3f63a9 = spawnProcess(_0x46abae, ["--version"], {
      'encoding': "utf8",
      'timeout': VERSION_CHECK_TIMEOUT_MS,
      'windowsHide': !![]
    });
    return extractVersionFromProcessResult(_0x3f63a9);
  } catch {
    return '';
  }
}
function resolveMinimumBrowserVersion(_0x40260b, _0x1929b2 = process['env']) {
  const _0x589b89 = _0x40260b === "edge" ? "AIC_CHROME_SHELL_MIN_EDGE_VERSION" : _0x40260b === "chromium" ? "AIC_CHROME_SHELL_MIN_CHROMIUM_VERSION" : "AIC_CHROME_SHELL_MIN_CHROME_VERSION";
  const _0x3d2b36 = parseVersionParts(_0x1929b2?.[_0x589b89])?.["text"];
  if (_0x3d2b36) {
    return _0x3d2b36;
  }
  if (_0x40260b === 'edge') {
    return DEFAULT_MIN_EDGE_VERSION;
  }
  if (_0x40260b === "chromium") {
    return DEFAULT_MIN_CHROMIUM_VERSION;
  }
  return DEFAULT_MIN_CHROME_VERSION;
}
function clearRememberedBrowserChoice(_0x56b59d, _0x3fabc0 = unlinkSync) {
  if (!_0x56b59d) {
    return;
  }
  try {
    _0x3fabc0(_0x56b59d);
  } catch {}
}
export function inspectChromeShellBrowserVersion({
  browserPath: _0x384c7d,
  env = process["env"],
  platform = process["platform"],
  spawnProcess = spawnSync
} = {}) {
  const _0x210d8d = identifyChromeShellBrowser(_0x384c7d);
  const _0x6815d9 = resolveMinimumBrowserVersion(_0x210d8d, env);
  if (!SUPPORTED_BROWSER_KINDS["has"](_0x210d8d)) {
    return {
      'browserKind': _0x210d8d,
      'browserPath': String(_0x384c7d || ''),
      'version': '',
      'minimumVersion': _0x6815d9,
      'checked': ![],
      'outdated': !![],
      'reason': 'unsupported-browser'
    };
  }
  const _0x8058fd = readBrowserExecutableVersion({
    'browserPath': _0x384c7d,
    'env': env,
    'platform': platform,
    'spawnProcess': spawnProcess
  });
  const _0x55aa14 = compareBrowserVersions(_0x8058fd, _0x6815d9);
  if (_0x55aa14 === null) {
    return {
      'browserKind': _0x210d8d,
      'browserPath': String(_0x384c7d || ''),
      'version': '',
      'minimumVersion': _0x6815d9,
      'checked': ![],
      'outdated': !![],
      'reason': "version-unavailable"
    };
  }
  return {
    'browserKind': _0x210d8d,
    'browserPath': String(_0x384c7d || ''),
    'version': _0x8058fd,
    'minimumVersion': _0x6815d9,
    'checked': !![],
    'outdated': _0x55aa14 < 0x0,
    'reason': _0x55aa14 < 0x0 ? 'version-too-old' : "supported"
  };
}
export async function checkChromeShellBrowserVersionBeforeLaunch({
  browserPath: _0x3687b6,
  edgeBrowserPath = '',
  preferencePath = '',
  env = process["env"],
  platform = process["platform"],
  spawnProcess = spawnSync,
  logEvent = null,
  unlink = unlinkSync
} = {}) {
  clearRememberedBrowserChoice(preferencePath, unlink);
  const _0x41516c = inspectChromeShellBrowserVersion({
    'browserPath': _0x3687b6,
    'env': env,
    'platform': platform,
    'spawnProcess': spawnProcess
  });
  logEvent?.({
    'type': 'chrome_shell.browser_version_checked',
    'level': _0x41516c['outdated'] ? "warn" : 'info',
    'source': "main",
    'message': _0x41516c["reason"] === "version-unavailable" ? "Browser version could not be verified" : _0x41516c["outdated"] ? "Browser version is below the supported minimum" : "Browser version check completed",
    'context': _0x41516c
  });
  if (_0x41516c["checked"] && !_0x41516c["outdated"]) {
    return {
      'continueLaunch': !![],
      'action': "continue",
      'browserPath': _0x41516c["browserPath"],
      'inspection': _0x41516c
    };
  }
  let _0x35bfa2 = null;
  if (edgeBrowserPath && a198_0x15b027["resolve"](edgeBrowserPath) !== a198_0x15b027["resolve"](_0x41516c['browserPath'])) {
    _0x35bfa2 = inspectChromeShellBrowserVersion({
      'browserPath': edgeBrowserPath,
      'env': env,
      'platform': platform,
      'spawnProcess': spawnProcess
    });
    logEvent?.({
      'type': "chrome_shell.fallback_browser_version_checked",
      'level': _0x35bfa2["checked"] && !_0x35bfa2["outdated"] ? "info" : "warn",
      'source': "main",
      'message': 'Fallback\x20browser\x20version\x20check\x20completed',
      'context': _0x35bfa2
    });
    if (_0x35bfa2["checked"] && !_0x35bfa2["outdated"]) {
      logEvent?.({
        'type': "chrome_shell.safe_browser_fallback_selected",
        'level': "warn",
        'source': "main",
        'message': "Unsafe primary browser was replaced with a validated Edge fallback",
        'context': {
          'primary': _0x41516c,
          'fallback': _0x35bfa2
        }
      });
      return {
        'continueLaunch': !![],
        'action': "edge-fallback",
        'browserPath': _0x35bfa2["browserPath"],
        'inspection': _0x41516c,
        'fallbackInspection': _0x35bfa2
      };
    }
  }
  logEvent?.({
    'type': 'chrome_shell.electron_fallback_required',
    'level': 'error',
    'source': 'main',
    'message': "No validated external browser is available; Electron fallback is required",
    'context': {
      'primary': _0x41516c,
      'fallback': _0x35bfa2
    }
  });
  return {
    'continueLaunch': ![],
    'action': 'electron-fallback',
    'browserPath': _0x41516c["browserPath"],
    'inspection': _0x41516c,
    'fallbackInspection': _0x35bfa2
  };
}
export const __chromeShellBrowserVersionForTest = {
  'WINDOWS_VERSION_SCRIPT': WINDOWS_VERSION_SCRIPT,
  'clearRememberedBrowserChoice': clearRememberedBrowserChoice,
  'parseVersionParts': parseVersionParts,
  'resolveMinimumBrowserVersion': resolveMinimumBrowserVersion
};