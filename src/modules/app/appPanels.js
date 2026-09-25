import { showManualUpdateCheck, showTutorialVideoPanel } from '../AutoUpdate.js';
import { t } from '../../i18n/index.js';
import { initEmptyCanvasShortcuts } from '../canvasShortcuts/emptyCanvasShortcuts.js';
import { initEmptyCanvasOnboarding } from '../canvasOnboarding/emptyCanvasOnboarding.js';
import { beginModalInteraction } from '../../services/modalInteractionScope.js';
export function isSubscriptionAuthorizationClearAvailable(_0x926bf = globalThis["window"]) {
  const _0x547157 = Boolean(_0x926bf?.["AI_CANVAS_IS_DEV_BUILD"] || _0x926bf?.['LOCAL_DEV_BUILD']);
  return _0x547157 && _0x926bf?.["DEV_MODE"] === !![];
}
export function resolveSubscriptionStatusMessageKey(_0x131a66 = {}) {
  if (_0x131a66["loading"]) {
    return "settings.subscription.loading";
  }
  if (String(_0x131a66["status"] || '')["toLowerCase"]() === "active") {
    return _0x131a66['authorizationTier'] === "annual-vip" ? 'settings.subscription.annualVipAuthorization' : "settings.subscription.vipAuthorization";
  }
  if (_0x131a66["status"] === "expired") {
    return "settings.subscription.expired";
  }
  return "settings.subscription.inactive";
}
// 使用教程页内容暂空，后续再补充教程视频与链接。

export function createAppPanels({
  store: _0x21d5ae,
  setTextWithLineBreaks: _0x3cdf9e,
  executeCommand: _0x1d44bb,
  focusNodes: _0x11044e,
  commit: _0xefa12d,
  getNodeDefaultSize: _0x4661c9,
  createDefaultSubscriptionState: _0x140cb4,
  isModelAllowed: _0x28c66b,
  isSubscriptionActive: _0x457258,
  isActivationRequestAccepted: _0x1faf2f,
  normalizeSubscriptionPayload: _0x53e6cc,
  ensureInstallId: _0x3c56a4,
  pullSubscriptionState: _0x4a0bc0,
  submitCdkey: _0x4572a9,
  clearSubscriptionAuthorization: _0x4c6f58,
  DEFAULT_VIP_GATE_MODEL_ID: _0x7548b,
  ensureDeviceId: _0x2bc955,
  modelCatalogService: _0x536d19,
  refreshManifestModelNodeUis: _0x5c4991,
  subscriptionIdentityTimeoutMs = 0x3a98
} = {}) {
  const _0x19d012 = "";
  const _0x5d12d8 = "";
  const _0xe959fb = "";
  function _0x710313(_0x5b2259) {
    const _0x235bf1 = String(_0x5b2259 || '')["trim"]();
    if (!_0x235bf1) {
      return '';
    }
    if (/^https?:\/\//i['test'](_0x235bf1)) {
      return _0x235bf1;
    }
    if (_0x235bf1["startsWith"]('/')) {
      return _0x235bf1;
    }
    return '';
  }
  function _0x148a37() {
    return [];
  }
  function _0x1699d9() {
    return [];
  }
  // 复刻版没有订阅中心：对应设置面板已从 index.html 移除，故此处为空实现。
  //
  // 原函数除订阅面板外，还顺带拉了「服务端模型目录」（loadCachedCatalog / sync / clear）。
  // 那套目录按订阅权益过滤返回，需要 Install-Id / Device-Id 向厂商权益服务鉴权；
  // 本项目不做订阅体系，缺该来源，故一并去除。模型列表由 src/manifests/ 的本地清单提供。
  function _0x543662() {}

  function _0x3a1ebe() {
    const _0x1b00c9 = document["getElementById"]('aiPanel');
    const _0x5c877d = document["getElementById"]("aiPanelToggle");
    if (_0x1b00c9 && _0x5c877d) {
      const _0x51065f = "http://www.w3.org/2000/svg";
      function _0x29f731(_0x4d2e18) {
        _0x5c877d["replaceChildren"]();
        const _0xe4a3e7 = document["createElementNS"](_0x51065f, "svg");
        _0xe4a3e7["setAttribute"]("width", '14');
        _0xe4a3e7["setAttribute"]("height", '14');
        _0xe4a3e7["setAttribute"]("viewBox", '0\x200\x2024\x2024');
        _0xe4a3e7["setAttribute"]("fill", "none");
        _0xe4a3e7["setAttribute"]("stroke", "currentColor");
        _0xe4a3e7["setAttribute"]("stroke-width", '2');
        const _0x8c9f10 = document["createElementNS"](_0x51065f, "polyline");
        _0x8c9f10["setAttribute"]("points", _0x4d2e18 ? "15 18 9 12 15 6" : '9\x2018\x2015\x2012\x209\x206');
        _0xe4a3e7['appendChild'](_0x8c9f10);
        _0x5c877d["appendChild"](_0xe4a3e7);
      }
      _0x5c877d["addEventListener"]("click", () => {
        _0x1b00c9['classList']["toggle"]('collapsed');
        _0x29f731(_0x1b00c9["classList"]['contains']("collapsed"));
      });
    }
    const _0xccbb4b = document['getElementById']("aiTipGot");
    const _0x42e99d = document["getElementById"]("aiTipCard");
    _0xccbb4b && _0x42e99d && _0xccbb4b["addEventListener"]('click', () => {
      _0x42e99d['style']["opacity"] = '0';
      _0x42e99d["style"]['maxHeight'] = '0px';
      setTimeout(() => _0x42e99d["remove"](), 0x140);
    });
    const _0x3195b0 = document["getElementById"]("aiTextarea");
    _0x3195b0 && _0x3195b0['addEventListener']("input", () => {
      _0x3195b0["style"]["height"] = 'auto';
      _0x3195b0["style"]["height"] = Math["min"](_0x3195b0["scrollHeight"], 0x78) + 'px';
    });
    const _0x40a6fb = document["getElementById"]("aiMessages");
    const _0x3d1077 = document['getElementById']("aiStartBtn");
    const _0xdbe5c7 = document["getElementById"]("aiStartWrap");
    const _0x450c4f = document['getElementById']("aiSend");
    function _0x3d3ab6() {
      return [t("appPanels.aiAssistant.responses.idea"), t("appPanels.aiAssistant.responses.prompt"), t('appPanels.aiAssistant.responses.connect'), t("appPanels.aiAssistant.responses.optimize")];
    }
    function _0xe2c5ff(_0x60b713) {
      if (!_0x40a6fb) {
        return;
      }
      const _0x2421e7 = document['createElement']("div");
      _0x2421e7["className"] = "ai-msg ai";
      const _0xbe4d36 = document['createElement']("div");
      _0xbe4d36["className"] = "ai-msg-avatar";
      _0xbe4d36["textContent"] = 'A';
      const _0x546585 = document["createElement"]('div');
      _0x546585['className'] = "ai-msg-bubble";
      _0x3cdf9e(_0x546585, _0x60b713);
      _0x2421e7["appendChild"](_0xbe4d36);
      _0x2421e7['appendChild'](_0x546585);
      _0x40a6fb["appendChild"](_0x2421e7);
      _0x40a6fb["scrollTop"] = _0x40a6fb["scrollHeight"];
    }
    function _0x149ab1(_0x1e5237) {
      if (!_0x40a6fb) {
        return;
      }
      const _0x5da5e2 = document["createElement"]('div');
      _0x5da5e2['className'] = "ai-msg user";
      const _0x2f9288 = document["createElement"]("div");
      _0x2f9288["className"] = 'ai-msg-avatar';
      _0x2f9288["style"]["background"] = 'var(--indigo)';
      _0x2f9288["textContent"] = 'U';
      const _0xa92940 = document["createElement"]("div");
      _0xa92940["className"] = "ai-msg-bubble";
      _0x3cdf9e(_0xa92940, _0x1e5237);
      _0x5da5e2['appendChild'](_0x2f9288);
      _0x5da5e2['appendChild'](_0xa92940);
      _0x40a6fb["appendChild"](_0x5da5e2);
      _0x40a6fb['scrollTop'] = _0x40a6fb["scrollHeight"];
    }
    function _0x30d2ff() {
      if (!_0x3195b0) {
        return;
      }
      const _0x29c65f = _0x3195b0['value']["trim"]();
      if (!_0x29c65f) {
        return;
      }
      _0x149ab1(_0x29c65f);
      _0x3195b0["value"] = '';
      _0x3195b0["style"]['height'] = "auto";
      if (_0xdbe5c7) {
        _0xdbe5c7["style"]["display"] = "none";
      }
      const _0x3bb46c = document["createElement"]("div");
      _0x3bb46c["className"] = 'ai-msg\x20ai\x20loading';
      const _0x20243c = document["createElement"]("div");
      _0x20243c['className'] = 'ai-msg-avatar';
      _0x20243c["textContent"] = 'A';
      const _0x42a1f8 = document["createElement"]("div");
      _0x42a1f8["className"] = 'ai-msg-bubble';
      for (let _0x3003d1 = 0x0; _0x3003d1 < 0x3; _0x3003d1 += 0x1) {
        const _0x15ac8c = document['createElement']("span");
        _0x15ac8c["className"] = "dot";
        _0x42a1f8["appendChild"](_0x15ac8c);
      }
      _0x3bb46c["appendChild"](_0x20243c);
      _0x3bb46c["appendChild"](_0x42a1f8);
      _0x40a6fb["appendChild"](_0x3bb46c);
      _0x40a6fb["scrollTop"] = _0x40a6fb["scrollHeight"];
      setTimeout(() => {
        _0x3bb46c["remove"]();
        const _0xe4df9 = _0x3d3ab6();
        const _0x30e9b0 = _0xe4df9[Math["floor"](Math['random']() * _0xe4df9["length"])];
        _0xe2c5ff(_0x30e9b0);
      }, 0x4b0);
    }
    _0x3d1077 && _0x3d1077["addEventListener"]("click", () => {
      if (_0xdbe5c7) {
        _0xdbe5c7["style"]["display"] = "none";
      }
      _0xe2c5ff(t("appPanels.aiAssistant.greeting"));
      if (_0x3195b0) {
        _0x3195b0["focus"]();
      }
    });
    if (_0x450c4f) {
      _0x450c4f["addEventListener"]("click", _0x30d2ff);
    }
    _0x3195b0 && _0x3195b0['addEventListener']("keydown", _0x459053 => {
      _0x459053["key"] === "Enter" && !_0x459053["shiftKey"] && (_0x459053['preventDefault'](), _0x30d2ff());
    });
  }
  function _0x1b6cf9() {
    initEmptyCanvasShortcuts({
      'store': _0x21d5ae,
      'executeCommand': _0x1d44bb,
      'focusNodes': _0x11044e,
      'commit': _0xefa12d,
      'getNodeDefaultSize': _0x4661c9
    });
    initEmptyCanvasOnboarding({
      'store': _0x21d5ae
    });
  }
  function _0x36c3f6() {
    const _0x21e0e1 = document["getElementById"]("aboutOverlay");
    const _0x165a22 = document['getElementById']("aboutClose");
    const _0x2bac2f = document["querySelector"]("meta[name=\"app-version\"]")?.["getAttribute"]("content") || "V0.0.1";
    const _0xc5ce44 = document["getElementById"]("aboutVersion");
    if (_0xc5ce44) {
      _0xc5ce44["innerText"] = _0x2bac2f;
    }
    function _0x2c913e() {
      if (_0x21e0e1) {
        _0x21e0e1["style"]["display"] = "flex";
      }
    }
    function _0x1bf46a() {
      if (_0x21e0e1) {
        _0x21e0e1["style"]["display"] = 'none';
      }
    }
    function _0x169d63() {
      document["getElementById"]('avatarMenu')?.["classList"]["remove"]("open");
    }
    document["getElementById"]('btnAbout')?.['addEventListener']("click", _0x10dc7b => {
      _0x10dc7b["stopPropagation"]();
      _0x169d63();
      _0x2c913e();
    });
    document["getElementById"]("btnTutorial")?.['addEventListener']("click", _0x1439df => {
      _0x1439df["stopPropagation"]();
      _0x169d63();
      showTutorialVideoPanel(_0x148a37(), _0x1699d9());
    });
    document["getElementById"]("btnCheckForUpdates")?.["addEventListener"]("click", _0x2fcd2f => {
      _0x2fcd2f['stopPropagation']();
      _0x169d63();
      void showManualUpdateCheck();
    });
    document["querySelectorAll"]("#btnGithubOfficial, #btnFeatureFeedback")["forEach"](_0x157f09 => {
      _0x157f09['addEventListener']("click", () => {
        _0x169d63();
      });
    });
    _0x165a22?.['addEventListener']('click', _0x1bf46a);
    _0x21e0e1?.["addEventListener"]("click", _0x4eff18 => {
      if (_0x4eff18['target'] === _0x21e0e1) {
        _0x1bf46a();
      }
    });
    let _0x159f72 = 0x0;
    let _0x53fd28 = null;
    _0xc5ce44?.["addEventListener"]("click", () => {
      _0x159f72++;
      clearTimeout(_0x53fd28);
      if (_0x159f72 >= 0x7) {
        _0x159f72 = 0x0;
        window["DEV_MODE"] = !window["DEV_MODE"];
        document['body']["classList"]["toggle"]("dev-mode", window['DEV_MODE']);
        window['dispatchEvent'](new CustomEvent('dev-mode-changed', {
          'detail': {
            'enabled': window["DEV_MODE"]
          }
        }));
        _0x1bf46a();
        window["showToast"]?.(window["DEV_MODE"] ? t("appPanels.devMode.entered") : t("appPanels.devMode.exited"));
      } else {
        _0x159f72 >= 0x4 && window["showToast"]?.(t("appPanels.devMode.clickHint", {
          'count': 0x7 - _0x159f72,
          'action': window["DEV_MODE"] ? t("appPanels.devMode.exitAction") : t('appPanels.devMode.enterAction')
        }));
      }
      _0x53fd28 = setTimeout(() => {
        _0x159f72 = 0x0;
      }, 0x7d0);
    });
  }
  function _0x444873() {
    const _0x1f6d52 = document["getElementById"]("feedbackGroupOverlay");
    const _0x381346 = document["getElementById"]("btnFeedbackGroup");
    const _0x4cd3c3 = document["getElementById"]('feedbackGroupClose');
    const _0x5a96cb = document["getElementById"]("feedbackGroupQrImage");
    const _0x475528 = document["getElementById"]('feedbackGroupQrError');
    function _0x16ef04() {
      document["getElementById"]("avatarMenu")?.["classList"]["remove"]("open");
    }
    function _0x12c195() {
      return _0xe959fb;
    }
    function _0x16e2cc() {
      _0x16ef04();
      if (!_0x1f6d52) {
        return;
      }
      if (_0x475528) {
        _0x475528["hidden"] = !![];
      }
      _0x5a96cb && (_0x5a96cb['hidden'] = ![], _0x5a96cb["loading"] = "lazy", _0x5a96cb["decoding"] = "async", _0x5a96cb["referrerPolicy"] = "no-referrer", _0x5a96cb['src'] = _0x12c195());
      _0x1f6d52['hidden'] = ![];
      _0x4cd3c3?.["focus"]?.({
        'preventScroll': !![]
      });
    }
    function _0x3ee3c1() {
      if (_0x1f6d52) {
        _0x1f6d52['hidden'] = !![];
      }
    }
    _0x381346?.['addEventListener']("click", _0x171ac8 => {
      _0x171ac8["stopPropagation"]();
      _0x16e2cc();
    });
    _0x4cd3c3?.['addEventListener']("click", _0x3ee3c1);
    _0x1f6d52?.["addEventListener"]("click", _0x236f4a => {
      if (_0x236f4a["target"] === _0x1f6d52) {
        _0x3ee3c1();
      }
    });
    _0x5a96cb?.["addEventListener"]('error', () => {
      _0x5a96cb["hidden"] = !![];
      if (_0x475528) {
        _0x475528["hidden"] = ![];
      }
    });
    document["addEventListener"]('keydown', _0x28e830 => {
      _0x28e830['key'] === 'Escape' && _0x1f6d52 && !_0x1f6d52['hidden'] && _0x3ee3c1();
    });
  }
  function _0x2d2e89() {
    _0x543662();
    _0x3a1ebe();
    _0x1b6cf9();
    _0x444873();
    _0x36c3f6();
  }
  return {
    'init': _0x2d2e89
  };
}