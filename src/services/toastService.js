import { inferProviderIdFromApiKeyMessage, isApiKeyConfigurationMessage, openProviderApiKeySettings } from '../modules/providerApiKeyMissingToast.js';
import { isSubscriptionAccessConfigurationMessage, openSubscriptionAccessSettings } from '../modules/subscriptionAccessMissingToast.js';
import { logDiagnosticEvent } from './diagnosticsService.js';
const DEFAULT_DURATION = 0xb54;
const ALERT_DURATION = 0x1388;
const SETTINGS_ACTION_LABEL = "去设置";
const ICONS = {
  'ok': '',
  'warn': '⚠️',
  'error': '✕',
  'success': '✓'
};
function resolveToastActionOptions(_0x4bb462, _0x1c4269 = {}) {
  if (_0x1c4269?.["actionLabel"] || typeof _0x1c4269?.['onAction'] === "function") {
    return _0x1c4269 || {};
  }
  if (isApiKeyConfigurationMessage(_0x4bb462)) {
    const _0x349c21 = inferProviderIdFromApiKeyMessage(_0x4bb462);
    return {
      ...(_0x1c4269 || {}),
      'actionLabel': SETTINGS_ACTION_LABEL,
      'onAction': () => {
        openProviderApiKeySettings({
          'providerId': _0x349c21,
          'message': _0x4bb462
        });
      }
    };
  }
  if (isSubscriptionAccessConfigurationMessage(_0x4bb462)) {
    return {
      ...(_0x1c4269 || {}),
      'actionLabel': SETTINGS_ACTION_LABEL,
      'onAction': () => {
        openSubscriptionAccessSettings();
      }
    };
  }
  return _0x1c4269 || {};
}
export function showToast(_0x6d7fb9, _0x4969af = 'ok', _0x16f4e6, _0x2fec00 = {}) {
  const _0x59192e = _0x4969af === "warning" ? "warn" : _0x4969af;
  (_0x59192e === "error" || _0x59192e === "warn") && void logDiagnosticEvent({
    'type': "ui.alert_presented",
    'level': _0x59192e,
    'source': "renderer",
    'message': String(_0x6d7fb9 || 'User-visible\x20alert'),
    'context': {
      'toastType': _0x59192e
    }
  });
  const _0x3695e8 = document['getElementById']("v2-toast-wrap");
  if (!_0x3695e8) {
    console["warn"]("[Toast]", _0x6d7fb9);
    return;
  }
  const _0x190394 = _0x59192e === "error" || _0x59192e === 'warn';
  const _0x3a3b63 = _0x190394 ? ALERT_DURATION : DEFAULT_DURATION;
  const _0x9bad02 = Number["isFinite"](Number(_0x16f4e6)) ? Math["max"](0x0, Number(_0x16f4e6)) : _0x3a3b63;
  const _0x6b813 = _0x190394 ? Math["max"](ALERT_DURATION, _0x9bad02) : _0x9bad02;
  const _0x3e576c = ICONS[_0x59192e] ?? '';
  const _0xba7ef = document["createElement"]("div");
  const _0x213232 = () => {
    _0xba7ef["remove"]();
    _0x3695e8["childElementCount"] === 0x0 && _0x3695e8["matches"]?.(":popover-open") && _0x3695e8["hidePopover"]();
  };
  _0xba7ef["style"]?.["setProperty"]('--toast-exit-delay', Math["max"](0x0, _0x6b813 - 0x12c) + 'ms');
  _0xba7ef["className"] = "v2-toast" + (_0x59192e !== 'ok' ? '\x20' + _0x59192e : '');
  _0x6b813 > DEFAULT_DURATION && !_0x190394 && _0xba7ef['classList']['add']('is-long');
  if (_0x3e576c) {
    const _0x269ced = document["createElement"]("span");
    _0x269ced["className"] = 'v2-toast-icon';
    _0x269ced["textContent"] = _0x3e576c;
    _0xba7ef["appendChild"](_0x269ced);
  }
  const _0x532654 = document["createElement"]('span');
  _0x532654["textContent"] = _0x6d7fb9;
  _0xba7ef["appendChild"](_0x532654);
  const _0x47d4ba = resolveToastActionOptions(_0x6d7fb9, _0x2fec00);
  if (typeof _0x47d4ba?.["onClick"] === "function") {
    const _0x41d0c1 = _0x2b97e8 => {
      if (_0x2b97e8?.['type'] === 'keydown' && !['Enter', '\x20']["includes"](_0x2b97e8["key"])) {
        return;
      }
      _0x2b97e8?.["preventDefault"]?.();
      try {
        _0x47d4ba["onClick"]();
      } finally {
        _0x213232();
      }
    };
    _0xba7ef['classList']["add"]("is-clickable");
    _0xba7ef["setAttribute"]("role", "button");
    _0xba7ef["setAttribute"]('tabindex', '0');
    _0xba7ef["setAttribute"]("aria-label", String(_0x47d4ba["ariaLabel"] || _0x6d7fb9 + "，点击查看")["trim"]());
    _0xba7ef["addEventListener"]("click", _0x41d0c1);
    _0xba7ef["addEventListener"]("keydown", _0x41d0c1);
  }
  const _0x56df92 = String(_0x47d4ba?.["actionLabel"] || '')["trim"]();
  if (_0x56df92 && typeof _0x47d4ba?.["onAction"] === "function") {
    const _0x35fdcd = document["createElement"]("button");
    _0x35fdcd['type'] = 'button';
    _0x35fdcd["className"] = 'v2-toast-action';
    _0x35fdcd["textContent"] = _0x56df92;
    _0x35fdcd['addEventListener']("click", _0x221646 => {
      _0x221646["preventDefault"]();
      _0x221646["stopPropagation"]();
      try {
        _0x47d4ba["onAction"]();
      } finally {
        _0x213232();
      }
    });
    _0xba7ef["appendChild"](_0x35fdcd);
  }
  _0x3695e8["appendChild"](_0xba7ef);
  if (typeof _0x3695e8["showPopover"] === "function") {
    _0x3695e8["setAttribute"]('popover', "manual");
    if (_0x3695e8["matches"](':popover-open')) {
      _0x3695e8["hidePopover"]();
    }
    _0x3695e8['showPopover']();
  }
  setTimeout(_0x213232, _0x6b813);
}
export function showSuccess(_0x57288c, _0x2c2750) {
  showToast(_0x57288c, "success", _0x2c2750);
}
export function showError(_0x2bb3ef, _0x302a62) {
  showToast(_0x2bb3ef, "error", _0x302a62);
}
export function showWarning(_0x2f7e46, _0x489e66) {
  showToast(_0x2f7e46, "warn", _0x489e66);
}
export function initToastService() {
  window['showToast'] = showToast;
  window["showSuccess"] = showSuccess;
  window['showError'] = showError;
  window["showWarning"] = showWarning;
}