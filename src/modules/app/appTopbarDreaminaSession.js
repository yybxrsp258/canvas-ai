import { t } from '../../i18n/index.js';
import { openExternalLink } from '../../services/externalLinkService.js';
const DREAMINA_LOGIN_PAGE_URL = "https://jimeng.jianying.com/";
const DREAMINA_I18N_PREFIX = "settings.apiInput.providers.dreamina";
function trTemplate(_0x2d78c7, _0x38d955 = {}) {
  let _0x5c1ec4 = t(_0x2d78c7);
  Object["entries"](_0x38d955 || {})["forEach"](([_0x33b818, _0x574f34]) => {
    _0x5c1ec4 = _0x5c1ec4["split"]('{' + _0x33b818 + '}')["join"](String(_0x574f34 ?? ''));
  });
  return _0x5c1ec4;
}
function trDreamina(_0x3e5710, _0x304045 = {}) {
  return trTemplate(DREAMINA_I18N_PREFIX + '.' + _0x3e5710, _0x304045);
}
function normalizeDreaminaManualUrlCandidate(_0x30319a) {
  const _0x53b2be = String(_0x30319a || '')['trim']();
  if (!_0x53b2be) {
    return '';
  }
  const _0x634706 = _0x53b2be['replace'](/^[<（(【\["'“‘]+/, '')["replace"](/[>）)】\]"'”’]+$/, '')["replace"](/[，。；;、]+$/, '');
  return /^https?:\/\//["test"](_0x634706) ? _0x634706 : '';
}
export function extractDreaminaManualLinksFromOutputLines(_0x288d09) {
  const _0x336a70 = Array["isArray"](_0x288d09) ? _0x288d09 : [];
  const _0x15a292 = [];
  let _0x559bb0 = '';
  _0x336a70["forEach"](_0x175fe5 => {
    const _0x152c86 = String(_0x175fe5 || '');
    if (!_0x559bb0 && _0x152c86['includes']("请在浏览器中打开以下链接")) {
      _0x559bb0 = "__PENDING__";
    } else {
      _0x559bb0 === "__PENDING__" && (_0x559bb0 = _0x152c86["trim"]());
    }
    const _0xc0d803 = _0x152c86["match"](/https?:\/\/[^\s]+/g);
    if (!_0xc0d803) {
      return;
    }
    _0xc0d803['forEach'](_0x4b7198 => {
      const _0x44a337 = normalizeDreaminaManualUrlCandidate(_0x4b7198);
      if (_0x44a337 && !_0x15a292['includes'](_0x44a337)) {
        _0x15a292["push"](_0x44a337);
      }
    });
  });
  const _0x220485 = _0x559bb0 && _0x559bb0 !== "__PENDING__" ? normalizeDreaminaManualUrlCandidate(_0x559bb0) : '';
  const _0x2a4f0d = _0x220485 || _0x15a292["find"](_0x4a73e6 => _0x4a73e6["includes"]("/passport/web_login")) || _0x15a292["find"](_0x27484c => _0x27484c["includes"]('/passport/web/web_login')) || '';
  const _0xbe8d81 = _0x15a292["find"](_0x3035b0 => _0x3035b0['includes']('/dreamina/cli/v1/dreamina_cli_login')) || '';
  const _0x22ac3b = _0xbe8d81 || _0x15a292['find'](_0x4f6560 => _0x4f6560 !== DREAMINA_LOGIN_PAGE_URL) || '';
  return {
    'authorizeUrl': _0xbe8d81 || _0x2a4f0d || _0x22ac3b || '',
    'strictAuthorizeUrl': _0x2a4f0d,
    'callbackUrl': _0xbe8d81
  };
}
export function getDreaminaWebLoginButtonText(_0x57db35) {
  const _0x493236 = _0x57db35?.["runtime"] || {};
  const _0x2ed483 = !!_0x57db35?.['loggedIn'];
  const _0xdf93c4 = !!_0x493236?.["active"];
  if (_0xdf93c4) {
    return trDreamina("viewLogin");
  }
  return _0x2ed483 ? trDreamina('relogin') : trDreamina("login");
}
export function getDreaminaQrLoginButtonText(_0x36288b) {
  const _0x2d06c9 = _0x36288b?.["runtime"] || {};
  const _0x2ba1e0 = !!_0x2d06c9?.["active"];
  if (_0x2ba1e0) {
    return trDreamina("viewLogin");
  }
  return trDreamina("login");
}
export function getDreaminaStatusSessionKey(_0x1eab7b) {
  const _0x3e8195 = _0x1eab7b?.["runtime"] || {};
  const _0x1505a5 = Number(_0x3e8195?.["startedAt"] || 0x0);
  if (_0x1505a5 > 0x0) {
    return "login:" + _0x1505a5;
  }
  const _0x842826 = Number(_0x3e8195?.["qrVersion"] || 0x0);
  if (_0x842826 > 0x0) {
    return 'qr:' + _0x842826;
  }
  return '';
}
export function mergeDreaminaLoginRuntimeStatus(_0x491d1e = {}, _0x44e891 = {}) {
  const _0xd08aa6 = String(_0x44e891?.["phase"] || '');
  const _0x52f5ad = ["success", "reused", "done"]["includes"](_0xd08aa6);
  return {
    ...(_0x491d1e || {}),
    'loggedIn': _0x52f5ad ? !![] : !!_0x491d1e?.["loggedIn"],
    'message': String(_0x44e891?.["message"] || '')['trim']() || String(_0x491d1e?.['message'] || '')["trim"](),
    'runtime': _0x44e891 || {}
  };
}
export function reconcileDreaminaSessionUiState(_0x8f2769, _0x49696a = {}) {
  const _0x208e3b = getDreaminaStatusSessionKey(_0x8f2769);
  const _0x5e90f1 = !!_0x8f2769?.["runtime"]?.['active'];
  const _0x472c4c = !!_0x49696a["manualGuideOpen"] && Number(_0x49696a["loginLaunchRequestedAt"] || 0x0) > 0x0;
  if (_0x208e3b && _0x208e3b !== _0x49696a["currentSessionKey"]) {
    _0x49696a['currentSessionKey'] = _0x208e3b;
    _0x49696a["dismissedSessionKey"] = '';
    !_0x472c4c && (_0x49696a["manualGuideOpen"] = ![], _0x49696a['loginLaunchRequestedAt'] = 0x0);
    return !![];
  }
  if (!_0x5e90f1 && !_0x208e3b && !_0x472c4c) {
    _0x49696a["currentSessionKey"] = '';
    _0x49696a['dismissedSessionKey'] = '';
    _0x49696a["manualGuideOpen"] = ![];
    _0x49696a["loginLaunchRequestedAt"] = 0x0;
    return !![];
  }
  return ![];
}
export function shouldDreaminaManualGuideOpenByDefault(_0x23103f, _0x34f4ab = '') {
  const _0x2693b4 = _0x23103f?.["runtime"] || {};
  const _0x14a848 = String(_0x2693b4?.['loginMode'] || '');
  if (!_0x2693b4?.["active"] || !["oauth", 'web', "headless"]["includes"](_0x14a848)) {
    return ![];
  }
  const _0x5261cf = getDreaminaStatusSessionKey(_0x23103f);
  return !_0x5261cf || String(_0x34f4ab || '') !== _0x5261cf;
}
export function createDreaminaLoginSessionController({
  fetchDreaminaCliStatusFromServer: _0x40150d,
  fetchDreaminaCliLoginRuntimeFromServer: _0x4bd544,
  startDreaminaWebLoginFromServer: _0x2560a7,
  importDreaminaLoginResponseFromServer: _0x310e55,
  logoutDreaminaFromServer: _0x4632c3,
  buildDreaminaQrImageUrl: _0x231cc5,
  documentObject = globalThis["document"],
  windowObject = globalThis["window"]
} = {}) {
  const _0x4f89b4 = documentObject;
  const _0x4acc9b = windowObject;
  const _0x4cb30f = 0x55 * 0x3e8;
  const _0x885279 = {
    'pollTimer': null,
    'pollInFlight': ![],
    'pollInFlightGeneration': 0x0,
    'pollGeneration': 0x0,
    'statusRequestGeneration': 0x0,
    'lastToastKey': '',
    'lastStatus': null,
    'modalCloseTimer': null,
    'currentSessionKey': '',
    'dismissedSessionKey': '',
    'qrImageLoadError': ![],
    'lastQrImageUrl': '',
    'lastQrImageRequestedAt': 0x0,
    'lastQrImageLoadedAt': 0x0,
    'lastQrImageErrorAt': 0x0,
    'lastQrImageErrorMessage': '',
    'qrImageListenersBound': ![],
    'manualGuideOpen': ![],
    'loginLaunchRequestedAt': 0x0,
    'observer': null
  };
  function _0x1a6e56() {
    return {
      'settingsCardEl': _0x4f89b4["getElementById"]("dreaminaSettingsCard"),
      'statusTextEl': _0x4f89b4["getElementById"]("dreaminaStatusText"),
      'messageTextEl': _0x4f89b4["getElementById"]('dreaminaStatusMessage'),
      'creditTextEl': _0x4f89b4["getElementById"]('dreaminaCreditText'),
      'btnAuthEl': _0x4f89b4["getElementById"]("btnDreaminaAuth"),
      'btnQrAuthEl': _0x4f89b4["getElementById"]("btnDreaminaQrAuth"),
      'btnLogoutEl': _0x4f89b4['getElementById']("btnDreaminaLogout"),
      'modalOverlayEl': _0x4f89b4["getElementById"]("dreaminaLoginModal"),
      'modalCardEl': _0x4f89b4["getElementById"]("dreaminaLoginModalCard"),
      'modalCloseEl': _0x4f89b4["getElementById"]("dreaminaModalClose"),
      'modalMessageEl': _0x4f89b4["getElementById"]('dreaminaModalMessage'),
      'modalQrWrapEl': _0x4f89b4["getElementById"]("dreaminaModalQrWrap"),
      'modalQrImageEl': _0x4f89b4["getElementById"]('dreaminaModalQrImage'),
      'modalWaitEl': _0x4f89b4["getElementById"]("dreaminaModalWait"),
      'modalWaitTextEl': _0x4f89b4["getElementById"]("dreaminaModalWaitText"),
      'modalRetryEl': _0x4f89b4["getElementById"]("dreaminaModalRetry"),
      'manualGuideEl': _0x4f89b4['getElementById']("dreaminaManualGuide"),
      'manualAuthUrlEl': _0x4f89b4['getElementById']('dreaminaManualAuthUrl'),
      'manualImportJsonEl': _0x4f89b4["getElementById"]("dreaminaManualImportJson"),
      'manualOpenAuthEl': _0x4f89b4["getElementById"]("dreaminaManualOpenAuth"),
      'manualCopyAuthEl': _0x4f89b4["getElementById"]("dreaminaManualCopyAuth"),
      'manualImportJsonBtnEl': _0x4f89b4['getElementById']("dreaminaManualImportJsonBtn")
    };
  }
  function _0x2cb831() {
    const {
      settingsCardEl: _0x36fbbd
    } = _0x1a6e56();
    if (!_0x36fbbd) {
      return ![];
    }
    const _0x179cea = !![];
    _0x36fbbd['hidden'] = !_0x179cea;
    !_0x179cea && (_0xc4fe3f({
      'force': !![],
      'rememberDismissal': ![]
    }), _0x282b44());
    return _0x179cea;
  }
  function _0x282b44() {
    _0x885279["pollTimer"] && (clearTimeout(_0x885279['pollTimer']), _0x885279["pollTimer"] = null);
    _0x885279["pollGeneration"] += 0x1;
  }
  function _0x1d47a5() {
    const _0x4ec39b = _0x885279['pollGeneration'];
    if (_0x885279["pollTimer"] || _0x885279["pollInFlight"] && _0x885279["pollInFlightGeneration"] === _0x4ec39b) {
      return;
    }
    const _0x590b69 = async () => {
      if (_0x4ec39b !== _0x885279["pollGeneration"]) {
        return;
      }
      _0x885279["pollTimer"] = null;
      if (_0x885279['pollInFlight'] && _0x885279["pollInFlightGeneration"] === _0x4ec39b) {
        return;
      }
      _0x885279["pollInFlight"] = !![];
      _0x885279["pollInFlightGeneration"] = _0x4ec39b;
      try {
        await _0x26be1d({
          'silent': !![]
        });
      } finally {
        _0x885279["pollInFlightGeneration"] === _0x4ec39b && (_0x885279['pollInFlight'] = ![]);
        if (_0x4ec39b !== _0x885279["pollGeneration"]) {
          return;
        }
        _0x885279["lastStatus"]?.["runtime"]?.["active"] && (_0x885279["pollTimer"] = setTimeout(_0x590b69, 0x320));
      }
    };
    void _0x590b69();
  }
  function _0x1a6225() {
    _0x885279["qrImageLoadError"] = ![];
    _0x885279["lastQrImageUrl"] = '';
    _0x885279["lastQrImageRequestedAt"] = 0x0;
    _0x885279['lastQrImageLoadedAt'] = 0x0;
    _0x885279['lastQrImageErrorAt'] = 0x0;
    _0x885279['lastQrImageErrorMessage'] = '';
  }
  function _0x51e4d9(_0x43ca22, _0x28c30a = Date["now"]()) {
    const _0xd91c8b = String(_0x43ca22 || '')["trim"]();
    if (!_0xd91c8b) {
      return '';
    }
    const _0x3f6259 = _0xd91c8b["includes"]('?') ? '&' : '?';
    return '' + _0xd91c8b + _0x3f6259 + "cb=" + encodeURIComponent(String(_0x28c30a));
  }
  function _0x54898c(_0x494af0, {
    withCacheBust = ![]
  } = {}) {
    const _0x2e05e8 = Number(_0x494af0?.["qrVersion"] || 0x0);
    const _0xef728 = _0x231cc5?.(_0x2e05e8 || Date['now']()) || '';
    if (!_0xef728) {
      return '';
    }
    return withCacheBust ? _0x51e4d9(_0xef728) : _0xef728;
  }
  function _0x5ca3f5(_0x50a642) {
    const _0x19f662 = _0x50a642?.["runtime"] || {};
    const _0x4eaa7e = String(_0x19f662?.["phase"] || '');
    const _0x26ca64 = !!_0x19f662?.["qrAvailable"];
    return _0x4eaa7e === "qr_ready" && _0x26ca64 && !!_0x885279["qrImageLoadError"];
  }
  function _0x4206f5(_0x9e831) {
    const _0x5b5eae = _0x9e831?.["runtime"] || {};
    return Array['isArray'](_0x5b5eae?.["outputTail"]) ? _0x5b5eae['outputTail'] : [];
  }
  function _0x1ec285(_0x2eda18) {
    const _0x494182 = _0x4206f5(_0x2eda18);
    return _0x494182["some"](_0x108b91 => {
      const _0x49a3f0 = String(_0x108b91 || '')["toLowerCase"]();
      return _0x49a3f0["includes"]('自动打开浏览器失败') || _0x49a3f0["includes"]("open headless login page") || _0x49a3f0['includes']("executable file not found") || _0x49a3f0["includes"]("google-chrome");
    });
  }
  function _0x434862(_0x2bf1ac) {
    const _0x36e84b = _0x2bf1ac?.["runtime"] || {};
    const _0x3fc632 = extractDreaminaManualLinksFromOutputLines(_0x4206f5(_0x2bf1ac));
    return {
      ..._0x3fc632,
      'authorizeUrl': String(_0x36e84b?.['authorizeUrl'] || '')['trim']() || _0x3fc632["authorizeUrl"],
      'callbackUrl': String(_0x36e84b?.["callbackUrl"] || '')["trim"]() || _0x3fc632['callbackUrl']
    };
  }
  function _0x18b880(_0x5ae1df) {
    const {
      manualAuthUrlEl: _0x4cea74,
      manualOpenAuthEl: _0x16509b,
      manualCopyAuthEl: _0x572e91
    } = _0x1a6e56();
    if (!_0x4cea74 || !_0x16509b || !_0x572e91) {
      return;
    }
    const _0x5ab812 = _0x434862(_0x5ae1df || _0x885279["lastStatus"] || {});
    const _0x536441 = String(_0x5ab812?.['authorizeUrl'] || '')["trim"]();
    _0x4cea74["value"] = _0x536441 || trDreamina("waitingAuthUrl");
    _0x16509b["disabled"] = !_0x536441;
    _0x572e91["disabled"] = !_0x536441;
  }
  function _0x71ca1b(_0x38d645) {
    const {
      manualGuideEl: _0x371086
    } = _0x1a6e56();
    if (!_0x371086) {
      return;
    }
    _0x18b880(_0x38d645 || _0x885279["lastStatus"] || {});
    _0x371086["hidden"] = !_0x885279["manualGuideOpen"];
  }
  function _0x1e827e(_0xdb14e6 = _0x885279['lastStatus'] || {}) {
    const _0x10f335 = _0x434862(_0xdb14e6);
    return String(_0x10f335?.["authorizeUrl"] || '')["trim"]();
  }
  async function _0x5d82bf(_0x5234e2, _0x1494f3) {
    const _0x5dc5a0 = String(_0x5234e2 || '')["trim"]();
    if (!_0x5dc5a0) {
      _0x4acc9b['showToast']?.(trDreamina("missingValue", {
        'label': _0x1494f3
      }), "warning");
      return ![];
    }
    try {
      await openExternalLink(_0x5dc5a0, {
        'label': _0x1494f3
      });
      return !![];
    } catch (_0x5192fa) {}
    const _0x17da35 = await _0x41a09f(_0x5dc5a0);
    _0x17da35 ? _0x4acc9b['showToast']?.(trDreamina("browserOpenFailedCopied", {
      'label': _0x1494f3
    }), 'warning') : _0x4acc9b["showToast"]?.(trDreamina("browserOpenFailedCopyFirst", {
      'label': _0x1494f3
    }), 'warning');
    return ![];
  }
  async function _0x2ef851(_0x3f1848, _0x39a6bc) {
    const _0x3d6d28 = String(_0x3f1848 || '')["trim"]();
    if (!_0x3d6d28) {
      _0x4acc9b['showToast']?.(trDreamina('missingValue', {
        'label': _0x39a6bc
      }), "warning");
      return;
    }
    const _0x680ef6 = await _0x41a09f(_0x3d6d28);
    _0x680ef6 ? _0x4acc9b["showToast"]?.(trDreamina("copySuccess", {
      'label': _0x39a6bc
    }), "success") : _0x4acc9b['showToast']?.(trDreamina('copyFailed', {
      'label': _0x39a6bc
    }), "error");
  }
  async function _0x4841b6() {
    await _0x5d82bf(_0x1e827e(), trDreamina("authLinkLabel"));
  }
  async function _0x1e6fb9() {
    await _0x2ef851(_0x1e827e(), trDreamina("authLinkLabel"));
  }
  function _0x3d45e9(_0x33634d) {
    const _0x9c384e = String(_0x33634d || '')["trim"]();
    if (!_0x9c384e) {
      throw new Error(trDreamina("jsonPasteRequired"));
    }
    const _0x5440d9 = [];
    _0x5440d9["push"](_0x9c384e);
    const _0x49127a = _0x9c384e["match"](/```(?:json)?\s*([\s\S]*?)```/i);
    _0x49127a?.[0x1] && _0x5440d9['push'](String(_0x49127a[0x1])["trim"]());
    const _0x1b8aa1 = _0x9c384e["indexOf"]('{');
    const _0x298c50 = _0x9c384e["lastIndexOf"]('}');
    _0x1b8aa1 >= 0x0 && _0x298c50 > _0x1b8aa1 && _0x5440d9['push'](_0x9c384e['slice'](_0x1b8aa1, _0x298c50 + 0x1)["trim"]());
    for (const _0x399683 of _0x5440d9) {
      if (!_0x399683) {
        continue;
      }
      try {
        const _0x18473d = JSON["parse"](_0x399683);
        if (!_0x18473d || typeof _0x18473d !== "object" || Array["isArray"](_0x18473d)) {
          throw new Error("INVALID_OBJECT");
        }
        return _0x18473d;
      } catch (_0x2463a0) {
        if (_0x2463a0?.["message"] === "INVALID_OBJECT") {
          throw new Error(trDreamina('jsonMustBeObject'));
        }
      }
    }
    throw new Error(trDreamina("jsonFormatInvalid"));
  }
  async function _0xc49c20() {
    if (typeof _0x310e55 !== 'function') {
      _0x4acc9b["showToast"]?.(trDreamina('jsonImportUnsupported'), "error");
      return;
    }
    const {
      manualImportJsonEl: _0x19beae
    } = _0x1a6e56();
    const _0x1a138d = String(_0x19beae?.['value'] || '');
    let _0x5992bb = null;
    try {
      _0x5992bb = _0x3d45e9(_0x1a138d);
    } catch (_0x382828) {
      _0x4acc9b['showToast']?.(_0x382828?.["message"] || trDreamina('jsonParseFailed'), "warning");
      return;
    }
    try {
      const _0x490d46 = await _0x310e55(_0x5992bb);
      if (_0x490d46?.['success'] === ![]) {
        throw new Error(_0x490d46?.["message"] || trDreamina("importFailed"));
      }
      _0x490d46?.["status"] ? _0x3d154a(_0x490d46["status"]) : await _0x1b5ffe({
        'force': !![],
        'silent': !![]
      });
      _0x19beae && (_0x19beae["value"] = '');
      _0x1d47a5();
      _0x4acc9b["showToast"]?.(trDreamina("importedSyncing"), "success");
    } catch (_0x52bf0) {
      _0x4acc9b["showToast"]?.(_0x52bf0?.['message'] || trDreamina("importFailed"), "error");
    }
  }
  function _0x2a436c(_0x39b963, _0x2009a5 = {}) {
    _0x885279["qrImageLoadError"] = !!_0x39b963;
    if (_0x39b963) {
      _0x885279["lastQrImageErrorAt"] = Date["now"]();
      _0x885279["lastQrImageErrorMessage"] = String(_0x2009a5?.["message"] || '')["trim"]() || trDreamina("qrLoadFailed");
      return;
    }
    _0x885279['lastQrImageLoadedAt'] = Date['now']();
    _0x885279["lastQrImageErrorAt"] = 0x0;
    _0x885279['lastQrImageErrorMessage'] = '';
  }
  function _0x46fdcb(_0x1c1b0b, _0x1f93ac, _0x124dd6 = {}) {
    if (!_0x1c1b0b) {
      return ![];
    }
    const _0x5d54e0 = !!_0x124dd6?.["withCacheBust"];
    const _0x255b22 = _0x54898c(_0x1f93ac, {
      'withCacheBust': _0x5d54e0
    });
    if (!_0x255b22) {
      return ![];
    }
    const _0x54d61e = String(_0x1c1b0b["getAttribute"]('src') || '')["trim"]();
    if (!_0x5d54e0 && _0x54d61e === _0x255b22) {
      return ![];
    }
    _0x885279['lastQrImageUrl'] = _0x255b22;
    _0x885279['lastQrImageRequestedAt'] = Date['now']();
    _0x885279["qrImageLoadError"] = ![];
    _0x885279["lastQrImageErrorMessage"] = '';
    _0x1c1b0b['src'] = _0x255b22;
    return !![];
  }
  function _0x2ca896(_0x3c797e) {
    if (!_0x3c797e || _0x885279["qrImageListenersBound"]) {
      return;
    }
    _0x3c797e["addEventListener"]("load", () => {
      _0x2a436c(![]);
      _0x885279["lastStatus"] && _0x13b58d(_0x885279['lastStatus']);
    });
    _0x3c797e["addEventListener"]('error', () => {
      _0x2a436c(!![], {
        'message': trDreamina("qrLoadFailed")
      });
      _0x885279['lastStatus'] && _0x13b58d(_0x885279['lastStatus']);
    });
    _0x885279["qrImageListenersBound"] = !![];
  }
  function _0x172648(_0x33cf32) {
    const _0x24b1ce = Number(_0x33cf32?.["startedAt"] || 0x0);
    if (_0x24b1ce <= 0x0) {
      return 0x0;
    }
    const _0x2be5f1 = Number(_0x33cf32?.["completedAt"] || 0x0);
    const _0x44109a = _0x2be5f1 > 0x0 ? _0x2be5f1 : Date["now"]();
    return Math['max'](0x0, _0x44109a - _0x24b1ce);
  }
  function _0x136c30(_0x73690c) {
    const _0x839dce = _0x73690c?.["runtime"] || {};
    if (!_0x839dce?.['active']) {
      return ![];
    }
    const _0xc3e222 = String(_0x839dce?.["phase"] || '');
    if (!["preparing", "starting"]["includes"](_0xc3e222)) {
      return ![];
    }
    return _0x172648(_0x839dce) >= _0x4cb30f;
  }
  async function _0x41a09f(_0x2495b3) {
    const _0x5c675d = String(_0x2495b3 || '');
    if (!_0x5c675d) {
      return ![];
    }
    try {
      if (navigator?.["clipboard"]?.['writeText']) {
        await navigator["clipboard"]["writeText"](_0x5c675d);
        return !![];
      }
    } catch (_0x477fee) {}
    try {
      const _0x56c9bb = _0x4f89b4['createElement']("textarea");
      _0x56c9bb["value"] = _0x5c675d;
      _0x56c9bb['setAttribute']("readonly", 'readonly');
      _0x56c9bb["style"]['position'] = "fixed";
      _0x56c9bb["style"]["left"] = '-9999px';
      _0x4f89b4["body"]?.["appendChild"](_0x56c9bb);
      _0x56c9bb['select']();
      const _0x11343a = _0x4f89b4["execCommand"]("copy");
      _0x56c9bb['remove']();
      return !!_0x11343a;
    } catch (_0x647f6f) {
      return ![];
    }
  }
  function _0x43ad46(_0x5312dc) {
    if (!_0x5312dc || typeof _0x5312dc !== "object") {
      return trDreamina('creditPlaceholder');
    }
    const _0xf24008 = Number(_0x5312dc['total_credit'] || 0x0);
    const _0x119e5d = Number(_0x5312dc["vip_credit"] || 0x0);
    const _0x1ef48f = Number(_0x5312dc["gift_credit"] || 0x0);
    const _0x54f4e6 = Number(_0x5312dc["purchase_credit"] || 0x0);
    return trDreamina("creditTotal", {
      'total': _0xf24008,
      'vip': _0x119e5d,
      'gift': _0x1ef48f,
      'purchase': _0x54f4e6
    });
  }
  function _0x10e546(_0x52faca) {
    const _0x2f8fb0 = String(_0x52faca?.["phase"] || '');
    const _0x51a132 = Number(_0x52faca?.["completedAt"] || 0x0);
    const _0x2f6871 = _0x51a132 > 0x0 ? _0x2f8fb0 + ':' + _0x51a132 + ':' + (_0x52faca?.["error"] || '') : '';
    if (!_0x2f6871 || _0x2f6871 === _0x885279['lastToastKey']) {
      return;
    }
    _0x885279['lastToastKey'] = _0x2f6871;
    if (_0x2f8fb0 === "success") {
      _0x4acc9b["showToast"]?.(trDreamina("loginSuccess"), 'success');
      return;
    }
    if (_0x2f8fb0 === "reused") {
      _0x4acc9b['showToast']?.(trDreamina("loginReused"), "info");
      return;
    }
    _0x2f8fb0 === 'failed' && _0x4acc9b["showToast"]?.(_0x52faca?.["error"] || trDreamina("loginFailed"), "error");
  }
  function _0x38dbdb(_0xc14253) {
    const _0x1d1b8d = _0xc14253?.['runtime'] || {};
    const _0x4060ca = !!_0xc14253?.['loggedIn'];
    const _0x5d24e3 = !!_0x1d1b8d?.["active"];
    const _0x13c2f2 = String(_0x1d1b8d?.["phase"] || '');
    if (_0x5d24e3 && _0x13c2f2 === 'preparing') {
      return trDreamina("statusPreparing");
    }
    if (_0x5d24e3 && ['oauth_ready', "polling"]["includes"](_0x13c2f2)) {
      return trDreamina("statusWaitingAuth");
    }
    if (_0x5d24e3) {
      return trDreamina("statusLoggingIn");
    }
    if (_0x4060ca) {
      return trDreamina("statusLoggedIn");
    }
    return trDreamina("statusLoggedOut");
  }
  function _0x20e317(_0x1d7471) {
    return getDreaminaStatusSessionKey(_0x1d7471);
  }
  function _0x365bba(_0x508a6e) {
    reconcileDreaminaSessionUiState(_0x508a6e, _0x885279) && _0x1a6225();
  }
  function _0x308006() {
    _0x885279['modalCloseTimer'] && (clearTimeout(_0x885279["modalCloseTimer"]), _0x885279['modalCloseTimer'] = null);
  }
  function _0x5ab3fb({
    clearDismissed = ![]
  } = {}) {
    const {
      modalOverlayEl: _0x1dc5f0
    } = _0x1a6e56();
    if (!_0x1dc5f0) {
      return;
    }
    _0x308006();
    clearDismissed && (_0x885279['dismissedSessionKey'] = '');
    _0x1dc5f0["hidden"] = ![];
  }
  function _0xc4fe3f({
    force = ![],
    rememberDismissal = !![]
  } = {}) {
    const {
      modalOverlayEl: _0x278aa3,
      modalQrImageEl: _0x4ecbef,
      manualImportJsonEl: _0x403c32
    } = _0x1a6e56();
    _0x308006();
    if (rememberDismissal) {
      const _0x32801c = _0x20e317(_0x885279["lastStatus"]);
      _0x32801c && (_0x885279["dismissedSessionKey"] = _0x32801c);
    }
    if (_0x278aa3) {
      _0x278aa3['hidden'] = !![];
    }
    if (_0x4ecbef) {
      _0x4ecbef["removeAttribute"]('src');
    }
    if (_0x403c32) {
      _0x403c32['value'] = '';
    }
    _0x885279["manualGuideOpen"] = ![];
    _0x71ca1b(_0x885279["lastStatus"] || {});
  }
  function _0x1a3eef(_0x4a2b6f = 0x0) {
    _0x308006();
    _0x885279['modalCloseTimer'] = setTimeout(() => {
      _0xc4fe3f({
        'force': !![],
        'rememberDismissal': ![]
      });
    }, Math["max"](0x0, Number(_0x4a2b6f) || 0x0));
  }
  function _0x2f55e9(_0x1b0040) {
    const _0x5178a0 = _0x1b0040?.["runtime"] || {};
    const _0x3c33dc = String(_0x5178a0?.["phase"] || '');
    const _0xaee324 = ["oauth", "web", "headless"]["includes"](String(_0x5178a0?.["loginMode"] || ''));
    const _0x20d3d0 = _0x136c30(_0x1b0040);
    const _0x2b0f29 = _0x5ca3f5(_0x1b0040);
    const _0x45025d = _0x1ec285(_0x1b0040);
    if (_0x45025d) {
      return trDreamina("waitBrowserFailed");
    }
    if (shouldDreaminaManualGuideOpenByDefault(_0x1b0040, _0x885279['dismissedSessionKey'])) {
      return trDreamina('waitOpenAuth');
    }
    if (_0x20d3d0) {
      return trDreamina("waitPendingTooLong");
    }
    if (_0x2b0f29) {
      return trDreamina('waitQrDeprecated');
    }
    if (_0x3c33dc === 'failed') {
      return trDreamina("waitFailed");
    }
    if (_0x3c33dc === "oauth_ready" || _0x3c33dc === "polling") {
      return trDreamina("waitConfirm");
    }
    if (_0x3c33dc === "qr_ready") {
      return trDreamina('waitUseOAuth');
    }
    if (_0x3c33dc === "success" || _0x3c33dc === "reused") {
      return trDreamina("waitDone");
    }
    if (_0xaee324) {
      return trDreamina('waitOAuthPreparing');
    }
    return trDreamina('waitPreparing');
  }
  function _0x13b58d(_0x166d64) {
    const {
      modalCardEl: _0x2ec8f4,
      modalCloseEl: _0x11d313,
      modalMessageEl: _0x11b980,
      modalQrWrapEl: _0xdb21fa,
      modalQrImageEl: _0x112bc3,
      modalWaitEl: _0x850c2c,
      modalWaitTextEl: _0x11112c,
      modalRetryEl: _0x59ff86,
      manualGuideEl: _0xda09e
    } = _0x1a6e56();
    if (!_0x11b980) {
      return;
    }
    const _0x1899b6 = _0x166d64?.["runtime"] || {};
    const _0x2a8be0 = !!_0x1899b6?.["active"];
    const _0x13292c = String(_0x1899b6?.["phase"] || '');
    const _0x5ddc73 = !!_0x166d64?.["loggedIn"];
    const _0x3c4e41 = ["oauth", "web", "headless"]['includes'](String(_0x1899b6?.['loginMode'] || ''));
    const _0x1b96c9 = _0x136c30(_0x166d64);
    const _0xcba30e = !_0x3c4e41 && !!_0x1899b6?.['qrAvailable'] && _0x13292c === "qr_ready";
    const _0x2fd1b8 = _0x5ca3f5(_0x166d64);
    const _0x143e21 = _0x1ec285(_0x166d64);
    const _0x362cca = _0x5ddc73 || ["success", 'reused', 'done']['includes'](_0x13292c);
    _0x362cca && (_0x885279['manualGuideOpen'] = ![]);
    !_0x362cca && _0x143e21 && (_0x885279["manualGuideOpen"] = !![]);
    const _0x11b3d1 = _0x20e317(_0x166d64);
    const _0x3ff5e7 = shouldDreaminaManualGuideOpenByDefault(_0x166d64, _0x885279["dismissedSessionKey"]);
    !_0x362cca && _0x3ff5e7 && (_0x885279["manualGuideOpen"] = !![]);
    const _0x35ddeb = _0x885279['manualGuideOpen'] || (_0x2a8be0 || _0xcba30e) && (!!_0x11b3d1 ? _0x885279['dismissedSessionKey'] !== _0x11b3d1 : !![]);
    if (_0x35ddeb) {
      _0x5ab3fb();
    } else {
      ["success", 'reused', "failed", "done"]["includes"](_0x13292c) ? _0x1a3eef(_0x13292c === "failed" ? 0x0 : 0x258) : _0xc4fe3f({
        'force': !![],
        'rememberDismissal': ![]
      });
    }
    _0x2ec8f4 && _0x2ec8f4["classList"]["toggle"]('dreamina-login-modal--guide-open', !!_0x885279["manualGuideOpen"]);
    _0x11b980 && (_0x11b980['textContent'] = _0x362cca ? trDreamina('modalSynced') : _0x143e21 ? trDreamina("modalBrowserFailed") : _0x3ff5e7 ? trDreamina("modalOAuthStarted") : _0x1b96c9 ? trDreamina('modalPendingTooLong') : _0x2fd1b8 ? trDreamina('modalQrAbnormal') : _0x13292c === "failed" ? trDreamina("modalRetryAuth") : _0x13292c === "oauth_ready" || _0x13292c === "polling" ? trDreamina("modalAuthorizeOnPage") : _0xcba30e ? trDreamina("modalScanQr") : String(_0x1899b6?.["message"] || '')["trim"]() || String(_0x166d64?.["message"] || '')['trim']() || trDreamina('modalProcessing'));
    _0x11112c && (_0x11112c["textContent"] = _0x2f55e9(_0x166d64));
    _0x850c2c && (_0x850c2c["hidden"] = ![]);
    _0xdb21fa && (_0xdb21fa["hidden"] = !_0xcba30e);
    _0x112bc3 && (_0xcba30e ? _0x46fdcb(_0x112bc3, _0x1899b6) : _0x112bc3["removeAttribute"]("src"));
    _0x11d313 && (_0x11d313["disabled"] = ![]);
    _0x59ff86 && (_0x59ff86["hidden"] = ![], _0x59ff86['disabled'] = ![], _0x885279["manualGuideOpen"] ? _0x59ff86['textContent'] = trDreamina("guideCollapse") : _0x59ff86["textContent"] = _0x143e21 ? trDreamina("guideRecommended") : trDreamina("guide"));
    _0xda09e && _0x71ca1b(_0x166d64);
  }
  function _0x3d154a(_0x1af50a) {
    const {
      statusTextEl: _0xbacc96,
      messageTextEl: _0x5ef2ae,
      creditTextEl: _0x339616,
      btnAuthEl: _0x4a7774,
      btnQrAuthEl: _0x2c20b9,
      btnLogoutEl: _0x34bbc7
    } = _0x1a6e56();
    if (!_0xbacc96) {
      return;
    }
    if (!_0x2cb831()) {
      return;
    }
    const _0x27b082 = _0x1af50a?.["runtime"] || {};
    const _0x2a2dee = !!_0x1af50a?.["loggedIn"];
    const _0x29c4f7 = !!_0x27b082?.["active"];
    const _0x508638 = String(_0x27b082?.["phase"] || '');
    const _0x4cd441 = String(_0x27b082?.["message"] || '')["trim"]() || String(_0x1af50a?.["message"] || '')["trim"]() || trDreamina('notLoggedInHint');
    _0xbacc96['textContent'] = _0x38dbdb(_0x1af50a);
    _0x5ef2ae && (_0x5ef2ae['textContent'] = _0x4cd441);
    _0x339616 && (_0x339616["textContent"] = _0x2a2dee ? _0x43ad46(_0x1af50a?.["credit"]) : trDreamina('creditPlaceholder'));
    _0x4a7774 && (_0x4a7774["disabled"] = ![], _0x4a7774['textContent'] = getDreaminaWebLoginButtonText(_0x1af50a));
    _0x2c20b9 && (_0x2c20b9["hidden"] = !![], _0x2c20b9["disabled"] = !![], _0x2c20b9["textContent"] = getDreaminaQrLoginButtonText(_0x1af50a));
    _0x34bbc7 && (_0x34bbc7["disabled"] = _0x29c4f7 || !_0x2a2dee);
    if (_0x29c4f7) {
      _0x1d47a5();
    } else {
      _0x282b44();
    }
    _0x885279["lastStatus"] = _0x1af50a;
    _0x365bba(_0x1af50a);
    _0x13b58d(_0x1af50a);
    _0x10e546(_0x27b082);
  }
  async function _0x1b5ffe({
    force = ![],
    silent = ![]
  } = {}) {
    if (!_0x2cb831()) {
      return null;
    }
    if (typeof _0x40150d !== "function") {
      return null;
    }
    const _0x208e59 = ++_0x885279['statusRequestGeneration'];
    try {
      const _0x34a148 = await _0x40150d({
        'refresh': force
      });
      if (_0x208e59 !== _0x885279["statusRequestGeneration"]) {
        return _0x34a148 || {};
      }
      _0x3d154a(_0x34a148 || {});
      return _0x34a148 || {};
    } catch (_0x34a114) {
      if (_0x208e59 !== _0x885279["statusRequestGeneration"]) {
        return null;
      }
      if (!silent) {
        const _0xa5ebc = _0x34a114?.["message"] || trDreamina('fetchStatusFailed');
        _0x4acc9b["showToast"]?.(_0xa5ebc, "error");
      }
      return null;
    }
  }
  async function _0x26be1d({
    silent = ![]
  } = {}) {
    if (!_0x2cb831()) {
      return null;
    }
    if (typeof _0x4bd544 !== "function") {
      return _0x1b5ffe({
        'silent': silent
      });
    }
    try {
      const _0x39cffa = await _0x4bd544();
      const _0x388e49 = String(_0x39cffa?.["phase"] || '');
      const _0x463a82 = _0x388e49 === "idle" && !_0x39cffa?.["active"] && !Number(_0x39cffa?.["startedAt"] || 0x0) && Number(_0x885279["loginLaunchRequestedAt"] || 0x0) > 0x0;
      if (_0x463a82) {
        return _0x885279["lastStatus"] || null;
      }
      const _0x2cf129 = mergeDreaminaLoginRuntimeStatus(_0x885279["lastStatus"] || {}, _0x39cffa || {});
      _0x3d154a(_0x2cf129);
      const _0x1e09e1 = ["success", 'reused', "done"]["includes"](_0x388e49);
      const _0x3f7ffe = _0x1e09e1 || _0x388e49 === 'failed';
      if (_0x3f7ffe) {
        _0x885279["loginLaunchRequestedAt"] = 0x0;
      }
      _0x1e09e1 && _0x1b5ffe({
        'force': !![],
        'silent': !![]
      })["catch"](() => {});
      return _0x2cf129;
    } catch (_0x5a48bc) {
      if (!silent) {
        const _0x1fe7ab = _0x5a48bc?.['message'] || trDreamina("fetchStatusFailed");
        _0x4acc9b["showToast"]?.(_0x1fe7ab, "error");
      }
      return null;
    }
  }
  async function _0x20676a() {
    if (!_0x2cb831()) {
      return;
    }
    const _0x39f8e2 = _0x885279["lastStatus"]?.["runtime"] || {};
    if (_0x39f8e2?.['active']) {
      _0x5ab3fb({
        'clearDismissed': !![]
      });
      _0x885279['manualGuideOpen'] = !![];
      _0x13b58d(_0x885279["lastStatus"] || {});
      return;
    }
    const _0x192d5b = !!_0x885279["lastStatus"]?.["loggedIn"];
    if (typeof _0x2560a7 !== "function") {
      return;
    }
    _0x885279["manualGuideOpen"] = !![];
    _0x885279["loginLaunchRequestedAt"] = Date["now"]();
    _0x5ab3fb({
      'clearDismissed': !![]
    });
    try {
      const _0x170bb8 = await _0x2560a7({
        'force': _0x192d5b
      });
      if (_0x170bb8?.["success"] === ![]) {
        throw new Error(_0x170bb8?.["message"] || trDreamina("startFailed"));
      }
      _0x885279["manualGuideOpen"] = !![];
      _0x170bb8?.["status"] && _0x3d154a(_0x170bb8["status"]);
      _0x4acc9b["showToast"]?.(_0x192d5b ? trDreamina("reloginStarted") : trDreamina("loginStarted"), "info");
      _0x1d47a5();
    } catch (_0x1e07a) {
      _0x4acc9b["showToast"]?.(_0x1e07a?.["message"] || trDreamina("startFailed"), "error");
    }
  }
  async function _0x2245ac() {
    await _0x20676a();
  }
  function _0x46c132() {
    _0x885279["manualGuideOpen"] = !_0x885279["manualGuideOpen"];
    _0x13b58d(_0x885279["lastStatus"] || {});
  }
  async function _0x4c6bda() {
    if (!_0x2cb831()) {
      return;
    }
    if (typeof _0x4632c3 !== "function") {
      return;
    }
    try {
      const _0x548ea4 = await _0x4632c3();
      if (_0x548ea4?.["success"] === ![]) {
        throw new Error(_0x548ea4?.["message"] || trDreamina("logoutFailed"));
      }
      _0x548ea4?.["status"] ? _0x3d154a(_0x548ea4['status']) : await _0x1b5ffe({
        'force': !![],
        'silent': !![]
      });
      _0x282b44();
      _0x4acc9b["showToast"]?.(trDreamina("loggedOut"), "success");
    } catch (_0x224469) {
      _0x4acc9b["showToast"]?.(_0x224469?.["message"] || trDreamina("logoutFailed"), "error");
    }
  }
  function _0x4912cd() {
    const {
      btnAuthEl: _0x4c3c3b,
      btnQrAuthEl: _0x5f0611,
      btnLogoutEl: _0x59d80d,
      modalOverlayEl: _0x2acc82,
      modalCloseEl: _0x431c4a,
      modalQrImageEl: _0x5d358f,
      modalRetryEl: _0x3cccad,
      manualOpenAuthEl: _0x13566d,
      manualCopyAuthEl: _0xd60a00,
      manualImportJsonBtnEl: _0x1edc59
    } = _0x1a6e56();
    _0x2ca896(_0x5d358f);
    _0x4c3c3b?.["addEventListener"]('click', () => {
      _0x20676a()["catch"](() => {});
    });
    _0x5f0611?.["addEventListener"]("click", () => {
      _0x2245ac()["catch"](() => {});
    });
    _0x59d80d?.["addEventListener"]("click", () => {
      _0x4c6bda()['catch'](() => {});
    });
    _0x431c4a?.["addEventListener"]("click", () => {
      _0xc4fe3f({
        'force': !![]
      });
    });
    _0x3cccad?.["addEventListener"]('click', () => {
      _0x46c132();
    });
    _0x13566d?.["addEventListener"]('click', () => {
      _0x4841b6()["catch"](() => {});
    });
    _0xd60a00?.["addEventListener"]("click", () => {
      _0x1e6fb9()["catch"](() => {});
    });
    _0x1edc59?.['addEventListener']("click", () => {
      _0xc49c20()["catch"](() => {});
    });
    _0x2acc82?.["addEventListener"]("click", _0x2bbc43 => {
      if (_0x2bbc43["target"] !== _0x2acc82) {
        return;
      }
      _0xc4fe3f();
    });
    _0x4f89b4['addEventListener']("keydown", _0x3205b8 => {
      if (_0x3205b8["key"] !== "Escape") {
        return;
      }
      _0xc4fe3f();
    });
    if (_0x4f89b4['body']) {
      const _0x11f0a8 = new MutationObserver(() => {
        const _0x3c85cc = _0x2cb831();
        _0x3c85cc && _0x1b5ffe({
          'force': !![],
          'silent': !![]
        })["catch"](() => {});
      });
      _0x885279["observer"]?.["disconnect"]?.();
      _0x885279["observer"] = _0x11f0a8;
      _0x11f0a8['observe'](_0x4f89b4['body'], {
        'attributes': !![],
        'attributeFilter': ["class"]
      });
    }
  }
  return {
    'destroy'() {
      _0x885279['statusRequestGeneration'] += 0x1;
      _0x282b44();
      _0x308006();
      _0x885279['observer']?.["disconnect"]?.();
      _0x885279["observer"] = null;
    },
    'init': _0x4912cd,
    'refreshStatus': _0x1b5ffe,
    'syncDevVisibility': _0x2cb831
  };
}