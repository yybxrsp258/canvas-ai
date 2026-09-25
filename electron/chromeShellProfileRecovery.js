import { existsSync, renameSync } from 'node:fs';
import a200_0x5dbd90 from 'node:path';
const CHROME_SHELL_RENDERER_READY_TIMEOUT = "CHROME_SHELL_RENDERER_READY_TIMEOUT";
const DEFAULT_MAX_RECOVERY_ATTEMPTS = 0x1;
const PROFILE_DIR_PATTERN = /^(chrome|chromium|edge)-shell-profile$/i;
const RENAME_RETRY_DELAYS_MS = [0xc8, 0x190, 0x320, 0x4b0, 0x578];
const RETRYABLE_RENAME_CODES = new Set(["EPERM", 'EACCES', 'EBUSY']);
function createProfileRecoveryError(_0xab19c8, _0x555da3, _0x58f8c8 = null) {
  const _0x5b218f = new Error(_0xab19c8, _0x58f8c8 ? {
    'cause': _0x58f8c8
  } : undefined);
  _0x5b218f["code"] = _0x555da3;
  return _0x5b218f;
}
function formatRecoveryTimestamp(_0x10356c) {
  const _0xeed713 = _0x10356c instanceof Date ? _0x10356c : new Date(_0x10356c);
  if (!Number['isFinite'](_0xeed713["getTime"]())) {
    throw createProfileRecoveryError("Chrome shell profile recovery timestamp is invalid", "CHROME_SHELL_PROFILE_RECOVERY_TIMESTAMP_INVALID");
  }
  return _0xeed713["toISOString"]()["replace"](/[-:]/g, '')["replace"]('T', '-')['slice'](0x0, 0xf);
}
function resolveRecoveryPaths({
  sessionDataRoot: _0x5db493,
  profileDir: _0x5594ef
} = {}) {
  const _0x81dc99 = a200_0x5dbd90['resolve'](String(_0x5db493 || ''));
  const _0x1ef249 = a200_0x5dbd90['resolve'](String(_0x5594ef || ''));
  if (!String(_0x5db493 || '')["trim"]() || !String(_0x5594ef || '')["trim"]() || a200_0x5dbd90['dirname'](_0x1ef249) !== _0x81dc99 || !PROFILE_DIR_PATTERN['test'](a200_0x5dbd90["basename"](_0x1ef249))) {
    throw createProfileRecoveryError('Chrome\x20shell\x20profile\x20recovery\x20path\x20is\x20outside\x20sessionData', 'CHROME_SHELL_PROFILE_RECOVERY_PATH_INVALID');
  }
  return {
    'profileDir': _0x1ef249,
    'sessionDataRoot': _0x81dc99
  };
}
function resolveAvailableBackupDir({
  profileDir: _0x221586,
  exists: _0x1a8ab2,
  now: _0x2fb195
} = {}) {
  const _0xba5858 = formatRecoveryTimestamp(_0x2fb195());
  const _0x328ffd = _0x221586 + '.recovery-' + _0xba5858;
  if (!_0x1a8ab2(_0x328ffd)) {
    return _0x328ffd;
  }
  for (let _0x19b9c8 = 0x1; _0x19b9c8 <= 0x3e7; _0x19b9c8 += 0x1) {
    const _0x4a39af = _0x328ffd + '-' + _0x19b9c8;
    if (!_0x1a8ab2(_0x4a39af)) {
      return _0x4a39af;
    }
  }
  throw createProfileRecoveryError("Chrome shell profile recovery backup name is unavailable", "CHROME_SHELL_PROFILE_RECOVERY_BACKUP_UNAVAILABLE");
}
export function createChromeShellProfileRecovery({
  sessionDataRoot: _0x1644b3,
  profileDir: _0x177a77,
  exists = existsSync,
  rename = renameSync,
  now = () => new Date(),
  delay = _0x53bcfe => new Promise(_0xa453e6 => setTimeout(_0xa453e6, _0x53bcfe))
} = {}) {
  const _0x4e271e = resolveRecoveryPaths({
    'sessionDataRoot': _0x1644b3,
    'profileDir': _0x177a77
  });
  function _0x4ea552() {
    if (!exists(_0x4e271e["profileDir"])) {
      throw createProfileRecoveryError("Chrome shell profile recovery source is missing", "CHROME_SHELL_PROFILE_RECOVERY_SOURCE_MISSING");
    }
    const _0x42f5de = resolveAvailableBackupDir({
      'profileDir': _0x4e271e['profileDir'],
      'exists': exists,
      'now': now
    });
    try {
      rename(_0x4e271e["profileDir"], _0x42f5de);
    } catch (_0x2ff0dd) {
      throw createProfileRecoveryError("Chrome shell profile could not be backed up for recovery", "CHROME_SHELL_PROFILE_RECOVERY_RENAME_FAILED", _0x2ff0dd);
    }
    return {
      'rotated': !![],
      'profileDir': _0x4e271e["profileDir"],
      'backupDir': _0x42f5de
    };
  }
  async function _0x450295() {
    for (let _0x38209b = 0x0;; _0x38209b += 0x1) {
      try {
        return {
          ..._0x4ea552(),
          'renameAttempts': _0x38209b + 0x1
        };
      } catch (_0x4d722c) {
        _0x4d722c["renameAttempts"] = _0x38209b + 0x1;
        if (_0x4d722c['code'] !== 'CHROME_SHELL_PROFILE_RECOVERY_RENAME_FAILED' || !RETRYABLE_RENAME_CODES["has"](_0x4d722c['cause']?.["code"]) || _0x38209b >= RENAME_RETRY_DELAYS_MS['length']) {
          throw _0x4d722c;
        }
        await delay(RENAME_RETRY_DELAYS_MS[_0x38209b]);
      }
    }
  }
  return {
    'rotate': _0x4ea552,
    'rotateWhenReleased': _0x450295
  };
}
function isRendererReadyTimeout(_0x1f52f1) {
  return _0x1f52f1?.["code"] === CHROME_SHELL_RENDERER_READY_TIMEOUT;
}
export async function runChromeShellStartupWithProfileRecovery({
  startAttempt: _0x22702f,
  rotateProfile: _0x33517c,
  maxRecoveryAttempts = DEFAULT_MAX_RECOVERY_ATTEMPTS,
  logEvent = null
} = {}) {
  if (typeof _0x22702f !== "function") {
    throw new TypeError('Chrome\x20shell\x20startup\x20attempt\x20factory\x20is\x20required');
  }
  if (typeof _0x33517c !== "function") {
    throw new TypeError('Chrome\x20shell\x20profile\x20recovery\x20operation\x20is\x20required');
  }
  const _0x58d23a = Math['max'](0x0, Math["min"](0x1, Math["trunc"](Number(maxRecoveryAttempts) || 0x0)));
  let _0x50fab9 = 0x0;
  let _0x52bf6d = '';
  while (!![]) {
    try {
      const _0x4dd1eb = await _0x22702f({
        'attemptNumber': _0x50fab9 + 0x1,
        'recoveryCount': _0x50fab9
      });
      _0x50fab9 > 0x0 && logEvent?.({
        'type': "chrome_shell.profile_recovery_succeeded",
        'level': "info",
        'source': 'main',
        'message': 'Chrome\x20shell\x20started\x20with\x20a\x20recovered\x20browser\x20profile',
        'context': {
          'recoveryCount': _0x50fab9,
          'backupName': a200_0x5dbd90["basename"](_0x52bf6d)
        }
      });
      return {
        'runtime': _0x4dd1eb,
        'profileRecovery': {
          'recovered': _0x50fab9 > 0x0,
          'recoveryCount': _0x50fab9,
          'backupDir': _0x52bf6d
        }
      };
    } catch (_0x897a1a) {
      if (!isRendererReadyTimeout(_0x897a1a) || _0x50fab9 >= _0x58d23a) {
        _0x50fab9 > 0x0 && logEvent?.({
          'type': "chrome_shell.profile_recovery_failed",
          'level': "error",
          'source': "main",
          'message': "Chrome shell still failed after browser profile recovery",
          'error': _0x897a1a,
          'context': {
            'recoveryCount': _0x50fab9
          }
        });
        throw _0x897a1a;
      }
      logEvent?.({
        'type': "chrome_shell.profile_recovery_started",
        'level': "warn",
        'source': 'main',
        'message': "Chrome shell renderer timed out; browser profile recovery started",
        'error': _0x897a1a,
        'context': {
          'recoveryCount': _0x50fab9
        }
      });
      let _0x38bbc7;
      try {
        _0x38bbc7 = await _0x33517c({
          'error': _0x897a1a,
          'recoveryCount': _0x50fab9
        });
      } catch (_0x2232a6) {
        _0x897a1a['profileRecoveryError'] = _0x2232a6;
        logEvent?.({
          'type': "chrome_shell.profile_recovery_failed",
          'level': "error",
          'source': 'main',
          'message': "Chrome shell browser profile could not be backed up",
          'error': _0x2232a6,
          'context': {
            'recoveryCount': _0x50fab9,
            'renameAttempts': _0x2232a6['renameAttempts'] || 0x1,
            'filesystemCode': _0x2232a6["cause"]?.["code"] || ''
          }
        });
        throw _0x897a1a;
      }
      if (_0x38bbc7?.['rotated'] !== !![]) {
        const _0x39457c = createProfileRecoveryError("Chrome shell browser profile recovery did not rotate the profile", 'CHROME_SHELL_PROFILE_RECOVERY_NOT_ROTATED');
        _0x897a1a["profileRecoveryError"] = _0x39457c;
        throw _0x897a1a;
      }
      _0x50fab9 += 0x1;
      _0x52bf6d = String(_0x38bbc7["backupDir"] || '');
      logEvent?.({
        'type': "chrome_shell.profile_rotated",
        'level': "warn",
        'source': "main",
        'message': 'Chrome\x20shell\x20browser\x20profile\x20was\x20backed\x20up\x20before\x20retry',
        'context': {
          'recoveryCount': _0x50fab9,
          'backupName': a200_0x5dbd90["basename"](_0x52bf6d),
          'renameAttempts': _0x38bbc7["renameAttempts"] || 0x1
        }
      });
    }
  }
}
export const __chromeShellProfileRecoveryForTest = {
  'CHROME_SHELL_RENDERER_READY_TIMEOUT': CHROME_SHELL_RENDERER_READY_TIMEOUT,
  'DEFAULT_MAX_RECOVERY_ATTEMPTS': DEFAULT_MAX_RECOVERY_ATTEMPTS,
  'formatRecoveryTimestamp': formatRecoveryTimestamp,
  'resolveRecoveryPaths': resolveRecoveryPaths
};