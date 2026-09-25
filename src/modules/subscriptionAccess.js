import { fetchUserSettingsFromServer, saveUserSettingsToServer } from '../../api/userSettingsApi.js';
import { fetchSubscriptionStatus, activateCdkey, clearSubscriptionAuthorization as a1592_0x19d49a } from '../../api/subscriptionApi.js';
import { t } from '../i18n/index.js';
import { desktopBridge } from '../services/desktopBridge.js';
const subscriptionGateManifest = {
  'schemaVersion': "1.0",
  'gates': [{
    'key': "runninghubVideoV54",
    'modelId': "runninghub/2041741496667348994",
    'workflowId': "2041741496667348994",
    'displayName': '视频编辑V5.4',
    'aliases': ["video_edit_v54", 'video_edit.pro'],
    'legacyAliases': [{
      'value': "2041741496667348994",
      'deleteWhen': "Remove after subscriptionAccess tests, backend subscription gate tests, entitlement payloads, and saved projects all stop accepting bare RunningHub workflow IDs for this gate."
    }]
  }, {
    'key': "runninghubVideoBerniniV1",
    'modelId': "runninghub/2062515720147259393",
    'workflowId': "2062515720147259393",
    'displayName': "新全能视频替换BERNINI V1",
    'aliases': ["video_edit_v54", "video_edit.pro", "ai-app/2062515720147259393"]
  }, {
    'key': "runninghubVideoScail2V1",
    'modelId': 'runninghub/2064961300823896065',
    'workflowId': "2064961300823896065",
    'displayName': "视频编辑Scail V1",
    'aliases': ['video_edit_v54', 'video_edit.pro', 'ai-app/2064961300823896065']
  }, {
    'key': 'runninghubVideoScailV2',
    'modelId': "runninghub/2065463417577762818",
    'workflowId': "2065463417577762818",
    'additionalWorkflowIds': ['2086838666336784386'],
    'displayName': "视频编辑Scail V2",
    'aliases': ["video_edit_v54", "video_edit.pro", "ai-app/2065463417577762818", "ai-app/2086838666336784386"]
  }, {
    'key': "runninghubVideoHailuoH3AudioDriven",
    'modelId': "runninghub/2092941359513694209",
    'workflowId': "2092941359513694209",
    'additionalWorkflowIds': ["2093687111078051842"],
    'displayName': '海螺H3音频驱动'
  }, {
    'key': 'runninghubVideoHd',
    'modelId': "runninghub/2047787809091620866",
    'workflowId': '2047787809091620866',
    'displayName': "视频高清",
    'aliases': ["video_hd_vip", 'video_hd.pro', "ai-app/2047787809091620866"],
    'legacyAliases': [{
      'value': "2047787809091620866",
      'deleteWhen': "Remove after subscriptionAccess tests, backend subscription gate tests, entitlement payloads, and saved projects all stop accepting bare RunningHub workflow IDs for this gate."
    }]
  }, {
    'key': "runninghubCommercialDigitalHuman",
    'modelId': "runninghub/2055639633148563458",
    'workflowId': "2055639633148563458",
    'displayName': "商业级数字人",
    'aliases': ["commercial_digital_human", "commercial_digital_human.pro", 'ai-app/2055639633148563458']
  }, {
    'key': "runninghubPersonFullAngleV4",
    'modelId': "runninghub/1989779993284800514",
    'workflowId': '1989779993284800514',
    'displayName': '人物全角度V4',
    'aliases': ["person_full_angle_v4", 'person_full_angle.pro', "ai-app/1989779993284800514"]
  }, {
    'key': "runninghubAdvancedVoiceClone",
    'modelId': "runninghub/2050165249344585729",
    'workflowId': "2050165249344585729",
    'displayName': '进阶声音克隆',
    'aliases': ["advanced_voice_clone", "voice_clone.pro", "ai-app/2050165249344585729"],
    'legacyAliases': [{
      'value': "2050165249344585729",
      'deleteWhen': "Remove after subscriptionAccess tests, backend subscription gate tests, entitlement payloads, and saved projects all stop accepting bare RunningHub workflow IDs for this gate."
    }]
  }, {
    'key': "dreaminaVideoVip",
    'modelId': "dreamina/video_vip",
    'workflowId': '',
    'displayName': "即梦视频",
    'aliases': ["dreamina_video_vip", "dreamina.video_vip"],
    'providers': ["dreamina"],
    'modelPrefixes': ["dreamina/"]
  }, {
    'key': 'audioVoiceStudio',
    'modelId': 'feature/audio_voice_studio',
    'workflowId': '',
    'displayName': "语音工作室",
    'aliases': ['audio_voice_studio', "voice_studio.pro"],
    'providers': ["aicanvas"],
    'allowAnyActiveSubscription': !![]
  }, {
    'key': 'replacementStudio',
    'modelId': 'feature/replacement_studio',
    'workflowId': '',
    'displayName': '替换工作室',
    'aliases': ["replacement_studio", "replacement_studio.pro"],
    'providers': ['aicanvas'],
    'allowAnyActiveSubscription': !![]
  }, {
    'key': "runninghubAiApp",
    'modelId': "feature/rh_ai_app",
    'workflowId': '',
    'displayName': "RH AI应用",
    'aliases': ["rh_ai_app", "runninghub_ai_app.pro"],
    'modelPrefixes': ["runninghub/ai-app-"],
    'allowAnyActiveSubscription': !![]
  }, {
    'key': "binghuoVideo",
    'modelId': 'feature/binghuo_video',
    'workflowId': '',
    'displayName': "便宜渠道视频",
    'aliases': ['binghuo_video', 'binghuo_video.pro'],
    'providers': ["binghuo"],
    'modelPrefixes': ["binghuo/"],
    'allowAnyActiveSubscription': !![]
  }, {
    'key': 'customProvider',
    'modelId': "feature/custom_provider",
    'workflowId': '',
    'displayName': "自定义中转站",
    'aliases': ['custom_provider', "custom_provider.pro"],
    'allowAnyActiveSubscription': !![]
  }]
};
function freezeSubscriptionGateLegacyAlias(_0x2e8976, _0x56c5f9) {
  const _0x541516 = _0x2e8976 && typeof _0x2e8976 === "object" ? _0x2e8976 : {};
  const _0x5b4621 = String(_0x541516['value'] || '')['trim']();
  const _0x1c268c = String(_0x541516["deleteWhen"] || '')["trim"]();
  if (!_0x5b4621 || !_0x1c268c) {
    throw new Error("Invalid subscription gate legacy alias: " + (_0x56c5f9 || "unknown"));
  }
  return Object['freeze']({
    'value': _0x5b4621,
    'deleteWhen': _0x1c268c
  });
}
function freezeSubscriptionGateEntry(_0x402e08) {
  const _0x3ec45d = _0x402e08 && typeof _0x402e08 === "object" ? _0x402e08 : {};
  const _0x441d85 = String(_0x3ec45d["key"] || '')["trim"]();
  return Object['freeze']({
    'key': _0x441d85,
    'modelId': String(_0x3ec45d['modelId'] || '')["trim"](),
    'workflowId': String(_0x3ec45d["workflowId"] || '')['trim'](),
    'additionalWorkflowIds': Object["freeze"](Array["isArray"](_0x3ec45d["additionalWorkflowIds"]) ? _0x3ec45d["additionalWorkflowIds"]['map'](_0x517717 => String(_0x517717 || '')["trim"]())["filter"](Boolean) : []),
    'displayName': String(_0x3ec45d["displayName"] || '')["trim"](),
    'aliases': Object["freeze"](Array["isArray"](_0x3ec45d["aliases"]) ? _0x3ec45d["aliases"]["map"](_0x540a44 => String(_0x540a44 || '')["trim"]())['filter'](Boolean) : []),
    'legacyAliases': Object["freeze"](Array["isArray"](_0x3ec45d["legacyAliases"]) ? _0x3ec45d["legacyAliases"]['map'](_0x353538 => freezeSubscriptionGateLegacyAlias(_0x353538, _0x441d85)) : []),
    'providers': Object["freeze"](Array["isArray"](_0x3ec45d["providers"]) ? _0x3ec45d["providers"]["map"](_0x8ba65e => String(_0x8ba65e || '')["trim"]()["toLowerCase"]())["filter"](Boolean) : []),
    'modelPrefixes': Object["freeze"](Array["isArray"](_0x3ec45d["modelPrefixes"]) ? _0x3ec45d["modelPrefixes"]["map"](_0x28440e => String(_0x28440e || '')["trim"]())["filter"](Boolean) : []),
    'allowAnyActiveSubscription': _0x3ec45d["allowAnyActiveSubscription"] === !![]
  });
}
function requireSubscriptionGateEntries() {
  const _0x2bdaac = String(subscriptionGateManifest?.["schemaVersion"] || '')['trim']();
  const _0x2c9e95 = subscriptionGateManifest?.["gates"];
  if (_0x2bdaac !== "1.0" || !Array['isArray'](_0x2c9e95)) {
    throw new Error('Invalid\x20subscription\x20gate\x20manifest');
  }
  const _0x15f27b = _0x2c9e95["map"](_0x5db3b2 => freezeSubscriptionGateEntry(_0x5db3b2));
  if (_0x15f27b['some'](_0x345cf9 => !_0x345cf9['modelId'])) {
    throw new Error("Invalid subscription gate manifest entry: missing modelId");
  }
  return Object['freeze'](_0x15f27b);
}
export const SUBSCRIPTION_GATE_MANIFESTS = requireSubscriptionGateEntries();
const SUBSCRIPTION_GATE_CANONICAL_EXCLUDES = new Set(Array['isArray'](subscriptionGateManifest?.["canonicalExcludes"]) ? subscriptionGateManifest["canonicalExcludes"]["map"](_0x55e0b1 => String(_0x55e0b1 || '')["trim"]())["filter"](Boolean) : []);
const SUBSCRIPTION_GATE_BY_KEY = Object['freeze'](Object["fromEntries"](SUBSCRIPTION_GATE_MANIFESTS["filter"](_0x4e64ee => _0x4e64ee["key"])["map"](_0x15a7f6 => [_0x15a7f6["key"], _0x15a7f6])));
function requireSubscriptionGateModelId(_0x34eb6e) {
  const _0x18b775 = SUBSCRIPTION_GATE_BY_KEY[_0x34eb6e];
  if (!_0x18b775?.["modelId"]) {
    throw new Error("Missing subscription gate manifest entry: " + _0x34eb6e);
  }
  return _0x18b775["modelId"];
}
function getSubscriptionGateAlias(_0x41d50b, _0x1516fb) {
  const _0x5545d3 = String(_0x1516fb || '')["trim"]();
  if (!_0x5545d3) {
    return '';
  }
  return getSubscriptionGateAliasValues(_0x41d50b)['find'](_0x572b8b => _0x572b8b["startsWith"](_0x5545d3)) || '';
}
function getSubscriptionGateAliasValues(_0x44a3ec) {
  return [...(Array['isArray'](_0x44a3ec?.['aliases']) ? _0x44a3ec["aliases"] : []), ...(Array["isArray"](_0x44a3ec?.["legacyAliases"]) ? _0x44a3ec["legacyAliases"]["map"](_0x3aab03 => _0x3aab03["value"]) : [])]["map"](_0x2a250b => String(_0x2a250b || '')["trim"]())["filter"](Boolean);
}
export const DEFAULT_VIP_GATE_MODEL_ID = requireSubscriptionGateModelId('runninghubVideoV54');
export const V54_VIP_MODEL_ID = DEFAULT_VIP_GATE_MODEL_ID;
export const RH_VIDEO_HD_VIP_MODEL_ID = requireSubscriptionGateModelId("runninghubVideoHd");
export const RH_VIDEO_HD_VIP_AI_APP_MODEL_ID = getSubscriptionGateAlias(SUBSCRIPTION_GATE_BY_KEY["runninghubVideoHd"], "ai-app/");
export const RH_ADVANCED_VOICE_CLONE_VIP_MODEL_ID = requireSubscriptionGateModelId('runninghubAdvancedVoiceClone');
export const RH_ADVANCED_VOICE_CLONE_VIP_AI_APP_MODEL_ID = getSubscriptionGateAlias(SUBSCRIPTION_GATE_BY_KEY["runninghubAdvancedVoiceClone"], "ai-app/");
export const DREAMINA_VIDEO_VIP_MODEL_ID = requireSubscriptionGateModelId('dreaminaVideoVip');
export const AUDIO_VOICE_STUDIO_VIP_MODEL_ID = requireSubscriptionGateModelId("audioVoiceStudio");
export const REPLACEMENT_STUDIO_VIP_MODEL_ID = requireSubscriptionGateModelId('replacementStudio');
export const RH_AI_APP_VIP_MODEL_ID = requireSubscriptionGateModelId("runninghubAiApp");
export const CUSTOM_PROVIDER_VIP_MODEL_ID = requireSubscriptionGateModelId("customProvider");
export const VIDEO_VIP_MODEL_IDS = Array["from"](new Set(SUBSCRIPTION_GATE_MANIFESTS['map'](_0x2a49c3 => _0x2a49c3["modelId"])));
const VIDEO_VIP_MODEL_ID_SET = new Set(VIDEO_VIP_MODEL_IDS);
const SUBSCRIPTION_GATE_BY_MODEL_ID = Object["freeze"](Object['fromEntries'](SUBSCRIPTION_GATE_MANIFESTS['map'](_0x418c38 => [_0x418c38['modelId'], _0x418c38])));
const VIP_MODEL_ID_CANONICAL_ALIASES = Object["freeze"](Object["fromEntries"](SUBSCRIPTION_GATE_MANIFESTS["flatMap"](_0xf4aff0 => [[_0xf4aff0["modelId"], _0xf4aff0["modelId"]], ...getSubscriptionGateAliasValues(_0xf4aff0)['map'](_0x2a80b3 => [_0x2a80b3, _0xf4aff0["modelId"]]), ...(_0xf4aff0["workflowId"] ? [['runninghub/' + _0xf4aff0['workflowId'], _0xf4aff0["modelId"]]] : []), ..._0xf4aff0["additionalWorkflowIds"]['map'](_0xe7e805 => ["runninghub/" + _0xe7e805, _0xf4aff0["modelId"]])])['filter'](([_0x165d44, _0x36df77]) => _0x165d44 && _0x36df77)));
const VIP_MODEL_PROVIDER_RULES = SUBSCRIPTION_GATE_MANIFESTS["flatMap"](_0x3e6889 => _0x3e6889['providers']["map"](_0x240470 => [_0x240470, _0x3e6889["modelId"]]));
const VIP_MODEL_PREFIX_RULES = SUBSCRIPTION_GATE_MANIFESTS["flatMap"](_0x107aa2 => _0x107aa2["modelPrefixes"]['map'](_0x506758 => [_0x506758, _0x107aa2["modelId"]]));
const VIP_MODEL_ID_CANONICAL_EXCLUDES = SUBSCRIPTION_GATE_CANONICAL_EXCLUDES;
const VIP_MODEL_DISPLAY_NAMES = Object['freeze'](Object["fromEntries"](SUBSCRIPTION_GATE_MANIFESTS["map"](_0xe4810e => [_0xe4810e['modelId'], _0xe4810e["displayName"] || _0xe4810e["modelId"]])));
const VIP_MODEL_KEY_ALIAS_MAP = Object["freeze"](Object["fromEntries"](SUBSCRIPTION_GATE_MANIFESTS["map"](_0x143a39 => [_0x143a39['modelId'], Object["freeze"]([_0x143a39['modelId'], ...getSubscriptionGateAliasValues(_0x143a39)])])));
const normalizeVipModelId = _0x40ab4f => {
  const _0x4d5d74 = String(_0x40ab4f || '')["trim"]();
  if (!_0x4d5d74) {
    return '';
  }
  if (VIP_MODEL_ID_CANONICAL_EXCLUDES["has"](_0x4d5d74)) {
    return _0x4d5d74;
  }
  const _0x5ed9dd = VIP_MODEL_ID_CANONICAL_ALIASES[_0x4d5d74];
  if (_0x5ed9dd) {
    return _0x5ed9dd;
  }
  const _0x4c4bea = VIP_MODEL_PREFIX_RULES['find'](([_0x1d43c8]) => _0x4d5d74['startsWith'](_0x1d43c8));
  if (_0x4c4bea) {
    return _0x4c4bea[0x1];
  }
  return _0x4d5d74;
};
const INSTALL_ID_KEY = "aic-install-id";
const DEVICE_ID_KEY = "aic-device-id";
const V54_LOCAL_UNLOCK_KEY = "aic-v54-vip-unlocked";
const SUBSCRIPTION_CONTACT_IMAGE_URL_FALLBACK = "";
const SUBSCRIPTION_CONTACT_WECHAT_FALLBACK = "";
let _fetchSubscriptionStatusImpl = fetchSubscriptionStatus;
let _activateCdkeyImpl = activateCdkey;
let _clearSubscriptionAuthorizationImpl = a1592_0x19d49a;
function getSubscriptionContactTextFallback(_0x44ba7a = '') {
  return t("settings.subscription.contact", {}, _0x44ba7a ? {
    'locale': _0x44ba7a
  } : {});
}
function isDefaultSubscriptionContactText(_0x593a4d) {
  const _0x253b60 = String(_0x593a4d || '')["trim"]();
  if (!_0x253b60) {
    return !![];
  }
  return _0x253b60 === getSubscriptionContactTextFallback("zh-CN") || _0x253b60 === getSubscriptionContactTextFallback("en-US");
}
function normalizeSubscriptionContactText(_0x6394b2) {
  const _0x3b561d = String(_0x6394b2 || '')['trim']();
  return isDefaultSubscriptionContactText(_0x3b561d) ? '' : _0x3b561d;
}
export function createDefaultSubscriptionState() {
  return {
    'loading': ![],
    'status': 'none',
    'expiresAt': null,
    'entitledModelKeys': [],
    'entitledModelIds': [],
    'planCodes': [],
    'planNames': [],
    'licensedProductCodes': [],
    'authorizationTier': "none",
    'error': null,
    'lastSyncAt': 0x0,
    'contactText': '',
    'contactUrl': SUBSCRIPTION_CONTACT_IMAGE_URL_FALLBACK,
    'contactWechat': SUBSCRIPTION_CONTACT_WECHAT_FALLBACK,
    'deviceId': ''
  };
}
function _normalizeStatus(_0x3982c0) {
  const _0x3cdb7b = String(_0x3982c0 || '')["trim"]()["toLowerCase"]();
  if (_0x3cdb7b === "active") {
    return "active";
  }
  if (_0x3cdb7b === "expired") {
    return 'expired';
  }
  return "none";
}
export function isActivationRequestAccepted(_0x53ad7e) {
  const _0xc4a4e = _0x53ad7e && typeof _0x53ad7e === 'object' ? _0x53ad7e : {};
  return _0xc4a4e?.["success"] === !![] || Number(_0xc4a4e?.["code"]) === 0x0 || String(_0xc4a4e?.["status"] || '')["trim"]()["toLowerCase"]() === "active";
}
export function isActivationConfirmed(_0x1d3727, _0x3db995) {
  return isActivationRequestAccepted(_0x1d3727) && isSubscriptionActive(_0x3db995 || {});
}
function _toExpirySeconds(_0x756f00) {
  if (_0x756f00 == null || _0x756f00 === '') {
    return null;
  }
  const _0x456635 = Number(_0x756f00);
  if (Number["isFinite"](_0x456635) && _0x456635 > 0x0) {
    return _0x456635 > 0x174876e800 ? Math["floor"](_0x456635 / 0x3e8) : Math["floor"](_0x456635);
  }
  const _0x10d7ac = Date["parse"](String(_0x756f00));
  if (!Number["isFinite"](_0x10d7ac) || _0x10d7ac <= 0x0) {
    return null;
  }
  return Math["floor"](_0x10d7ac / 0x3e8);
}
export function extractSubscriptionExpiresAt(_0x5d6406) {
  const _0x40cbe7 = _0x5d6406 && typeof _0x5d6406 === 'object' ? _0x5d6406 : {};
  const _0x15fcbc = _0x40cbe7['data'] && typeof _0x40cbe7["data"] === 'object' ? _0x40cbe7['data'] : _0x40cbe7;
  const _0x3714a3 = _0x15fcbc?.["expiresAt"] ?? _0x15fcbc?.['expires_at'] ?? _0x15fcbc?.["expireAt"] ?? _0x15fcbc?.["expire_at"] ?? _0x15fcbc?.["expiryAt"] ?? _0x15fcbc?.["expiry_at"] ?? _0x15fcbc?.["expiry"] ?? _0x15fcbc?.['expiredAt'] ?? _0x15fcbc?.["expired_at"] ?? _0x15fcbc?.["endAt"] ?? _0x15fcbc?.["end_at"] ?? _0x15fcbc?.['validUntil'] ?? _0x15fcbc?.["valid_until"] ?? _0x15fcbc?.["deadlineAt"] ?? _0x15fcbc?.["deadline_at"] ?? _0x15fcbc?.["deadline"] ?? null;
  return _toExpirySeconds(_0x3714a3);
}
export function resolveSubscriptionAuthorizationTier(_0x586f21) {
  // 复刻版不复用原版的订阅 / CD-Key 体系：恒视为最高等级已授权，
  // 使 isSubscriptionActive() 恒为 true。任何功能都不因授权状态被拦截。
  return "annual-vip";
}
export function isSubscriptionActive(_0x5182e1) {
  return resolveSubscriptionAuthorizationTier(_0x5182e1) !== "none";
}
export function resolveVipGateModelId(_0x1546de, _0x3c06d1 = '') {
  const _0x36d54d = normalizeVipModelId(_0x1546de);
  if (VIP_MODEL_ID_CANONICAL_EXCLUDES['has'](_0x36d54d)) {
    return _0x36d54d;
  }
  if (VIDEO_VIP_MODEL_ID_SET["has"](_0x36d54d)) {
    return _0x36d54d;
  }
  const _0x2972e2 = String(_0x3c06d1 || '')["trim"]()['toLowerCase']();
  const _0x5ce72c = _0x2972e2 ? VIP_MODEL_PROVIDER_RULES["find"](([_0x6f3a1a]) => _0x6f3a1a === _0x2972e2) : null;
  if (_0x5ce72c) {
    return _0x5ce72c[0x1];
  }
  return _0x36d54d;
}
export function getVipModelDisplayName(_0xb81701, _0x219f2a = '') {
  const _0xfe3336 = resolveVipGateModelId(_0xb81701, _0x219f2a);
  return VIP_MODEL_DISPLAY_NAMES[_0xfe3336] || _0xfe3336 || "model";
}
export function isVipModel(_0x1042d0, _0x1c11e1 = '') {
  // 复刻版不存在"VIP 模型"这一概念：所有模型一律按普通模型处理。
  // isModelAllowed() 的首个分支即恒真，模型选择与生成链路不再有任何授权拦截。
  return ![];
}
function getVipModelKeyAliases(_0xdcc7cd) {
  const _0x3ecaa3 = normalizeVipModelId(_0xdcc7cd);
  return Array['from'](new Set(VIP_MODEL_KEY_ALIAS_MAP[_0x3ecaa3] || []));
}
export function setLocalVipUnlocked(_0x23651d) {
  try {
    _0x23651d ? globalThis['localStorage']?.["setItem"](V54_LOCAL_UNLOCK_KEY, '1') : globalThis["localStorage"]?.["removeItem"](V54_LOCAL_UNLOCK_KEY);
  } catch {}
}
export function isModelAllowed(_0x51ba7b, _0x3e3909, _0x482fba = '') {
  const _0x2aa738 = String(_0x51ba7b || '')["trim"]();
  const _0x3f9b55 = resolveVipGateModelId(_0x2aa738, _0x482fba);
  if (!isVipModel(_0x3f9b55)) {
    return !![];
  }
  if (!isSubscriptionActive(_0x3e3909 || {})) {
    return ![];
  }
  if (SUBSCRIPTION_GATE_BY_MODEL_ID[_0x3f9b55]?.["allowAnyActiveSubscription"]) {
    return !![];
  }
  const _0x4a0027 = _0x3e3909 && typeof _0x3e3909 === "object" ? _0x3e3909 : {};
  const _0x251677 = Array['isArray'](_0x4a0027['entitledModelIds']) ? _0x4a0027["entitledModelIds"]["map"](_0x35894e => normalizeVipModelId(_0x35894e))["filter"](Boolean) : [];
  if (_0x251677["length"] > 0x0) {
    return _0x251677["includes"](_0x3f9b55);
  }
  const _0x1e1525 = Array["isArray"](_0x4a0027["entitledModelKeys"]) ? _0x4a0027['entitledModelKeys']["map"](_0x598235 => String(_0x598235 || '')["trim"]()["toLowerCase"]())["filter"](Boolean) : [];
  if (_0x1e1525["length"] > 0x0) {
    const _0x24dc92 = getVipModelKeyAliases(_0x3f9b55);
    if (_0x24dc92["length"] === 0x0) {
      return ![];
    }
    return _0x24dc92["some"](_0xf91ef1 => _0x1e1525["includes"](String(_0xf91ef1)["toLowerCase"]()));
  }
  return !![];
}
function _generateInstallId() {
  const _0x34bc90 = Date["now"]() + '-' + Math["random"]();
  let _0x85729e = 0x0;
  for (let _0x4040d7 = 0x0; _0x4040d7 < _0x34bc90["length"]; _0x4040d7 += 0x1) {
    _0x85729e = _0x85729e * 0x1f + _0x34bc90["charCodeAt"](_0x4040d7) >>> 0x0;
  }
  return "aic-" + Date["now"]()["toString"](0x24) + '-' + _0x85729e["toString"](0x24);
}
function _generateDeviceId() {
  return "aicdev-" + Date["now"]()['toString'](0x24) + '-' + Math['random']()["toString"](0x24)["slice"](0x2, 0xa);
}
function _publishInstallId(_0x129115) {
  const _0x1b384b = String(_0x129115 || '')['trim']();
  if (!_0x1b384b) {
    return '';
  }
  try {
    window['__aicInstallId'] = _0x1b384b;
  } catch {}
  try {
    globalThis["__aicInstallId"] = _0x1b384b;
  } catch {}
  return _0x1b384b;
}
function _publishDeviceId(_0x470c99) {
  const _0x3de09a = String(_0x470c99 || '')['trim']();
  if (!_0x3de09a) {
    return '';
  }
  try {
    window["__aicDeviceId"] = _0x3de09a;
  } catch {}
  try {
    globalThis["__aicDeviceId"] = _0x3de09a;
  } catch {}
  try {
    localStorage["setItem"](DEVICE_ID_KEY, _0x3de09a);
  } catch {}
  return _0x3de09a;
}
function _clearPublishedSubscriptionIdentity() {
  try {
    delete window['__aicInstallId'];
  } catch {}
  try {
    delete window["__aicDeviceId"];
  } catch {}
  try {
    delete globalThis["__aicInstallId"];
  } catch {}
  try {
    delete globalThis["__aicDeviceId"];
  } catch {}
}
function _clearLocalSubscriptionIdentity() {
  try {
    localStorage['removeItem'](INSTALL_ID_KEY);
  } catch {}
  try {
    localStorage["removeItem"](DEVICE_ID_KEY);
  } catch {}
  setLocalVipUnlocked(![]);
  _clearPublishedSubscriptionIdentity();
}
function readLocalInstallId() {
  try {
    return String(localStorage["getItem"](INSTALL_ID_KEY) || '')["trim"]();
  } catch {
    return '';
  }
}
async function readServerSettingsForSubscriptionIdentity() {
  try {
    return (await fetchUserSettingsFromServer()) || {};
  } catch {
    return {};
  }
}
export async function ensureDeviceId(_0x19ffe3 = '') {
  const _0x5a005f = String(_0x19ffe3 || globalThis["window"]?.["__aicInstallId"] || globalThis["__aicInstallId"] || '')["trim"]();
  try {
    const _0x2c1ad5 = await desktopBridge["app"]['getDeviceId']({
      'installId': _0x5a005f
    });
    const _0x122156 = String(_0x2c1ad5 || '')['trim']();
    if (_0x122156) {
      return _publishDeviceId(_0x122156);
    }
  } catch {}
  try {
    const _0x4f3c74 = String(localStorage["getItem"](DEVICE_ID_KEY) || '')['trim']();
    if (_0x4f3c74) {
      return _publishDeviceId(_0x4f3c74);
    }
  } catch {}
  const _0x211eb5 = _0x5a005f || _generateDeviceId();
  return _publishDeviceId(_0x211eb5);
}
export async function ensureInstallId() {
  const _0xe2baca = desktopBridge["isChromeShell"];
  if (!_0xe2baca) {
    const _0x528362 = readLocalInstallId();
    if (_0x528362) {
      _publishInstallId(_0x528362);
      await ensureDeviceId(_0x528362);
      return _0x528362;
    }
  }
  const _0x5b609f = await readServerSettingsForSubscriptionIdentity();
  const _0x12118e = String(_0x5b609f["installId"] || '')["trim"]();
  if (_0x12118e) {
    try {
      localStorage["setItem"](INSTALL_ID_KEY, _0x12118e);
    } catch {}
    _publishInstallId(_0x12118e);
    await ensureDeviceId(_0x12118e);
    return _0x12118e;
  }
  const _0x4f1c71 = readLocalInstallId();
  if (_0x4f1c71) {
    try {
      await saveUserSettingsToServer({
        ..._0x5b609f,
        'installId': _0x4f1c71
      });
    } catch {}
    _publishInstallId(_0x4f1c71);
    await ensureDeviceId(_0x4f1c71);
    return _0x4f1c71;
  }
  const _0xcef718 = _generateInstallId();
  try {
    localStorage["setItem"](INSTALL_ID_KEY, _0xcef718);
  } catch {}
  try {
    await saveUserSettingsToServer({
      ..._0x5b609f,
      'installId': _0xcef718
    });
  } catch {}
  _publishInstallId(_0xcef718);
  await ensureDeviceId(_0xcef718);
  return _0xcef718;
}
export function normalizeSubscriptionPayload(_0x1b9b51) {
  const _0x373499 = createDefaultSubscriptionState();
  const _0x3955b6 = _0x1b9b51 && typeof _0x1b9b51 === "object" ? _0x1b9b51 : {};
  const _0x29c355 = _0x3955b6["data"] && typeof _0x3955b6['data'] === 'object' ? _0x3955b6["data"] : _0x3955b6;
  const _0x4e9dfa = String(_0x29c355?.["status"] || _0x29c355?.["subscriptionStatus"] || _0x29c355?.["state"] || '')["trim"]()['toLowerCase']();
  let _0x3c61fc = _normalizeStatus(_0x4e9dfa);
  const _0x4271eb = extractSubscriptionExpiresAt(_0x29c355);
  const _0x4447aa = Array["isArray"](_0x29c355?.["entitledModelIds"]) ? _0x29c355["entitledModelIds"] : Array["isArray"](_0x29c355?.['entitled_model_ids']) ? _0x29c355['entitled_model_ids'] : Array['isArray'](_0x29c355?.["modelIds"]) ? _0x29c355["modelIds"] : [];
  const _0x27f778 = _0x4447aa["map"](_0xd3706e => normalizeVipModelId(_0xd3706e))["filter"](Boolean);
  const _0x2f4a91 = Array["isArray"](_0x29c355?.["entitledModelKeys"]) ? _0x29c355['entitledModelKeys'] : Array['isArray'](_0x29c355?.["entitled_model_keys"]) ? _0x29c355["entitled_model_keys"] : Array["isArray"](_0x29c355?.["modelKeys"]) ? _0x29c355['modelKeys'] : [];
  const _0x3923d7 = _0x2f4a91["map"](_0x5a0eb2 => String(_0x5a0eb2 || '')["trim"]())["filter"](Boolean);
  const _0x1a256b = _0x29c355?.["contactText"] ?? _0x29c355?.["contact_text"] ?? _0x373499["contactText"];
  const _0x3dc3f4 = _0x29c355?.["contactUrl"] ?? _0x29c355?.["contact_url"] ?? _0x373499['contactUrl'];
  const _0x5ebb8e = _0x29c355?.["contactWechat"] ?? _0x29c355?.["contact_wechat"] ?? _0x29c355?.["wechatId"] ?? _0x29c355?.["wechat_id"] ?? _0x29c355?.["wechat"] ?? _0x373499["contactWechat"];
  const _0x5ef93c = _0x29c355?.["deviceId"] ?? _0x29c355?.["device_id"] ?? _0x373499['deviceId'];
  const _0x46545a = Array['isArray'](_0x29c355?.["planCodes"]) ? _0x29c355["planCodes"] : Array["isArray"](_0x29c355?.["plan_codes"]) ? _0x29c355["plan_codes"] : [];
  const _0x17c606 = Array["isArray"](_0x29c355?.["planNames"]) ? _0x29c355["planNames"] : Array['isArray'](_0x29c355?.["plan_names"]) ? _0x29c355["plan_names"] : [];
  const _0x56f8b4 = Array['isArray'](_0x29c355?.["licensedProductCodes"]) || Array['isArray'](_0x29c355?.["licensed_product_codes"]) || Array["isArray"](_0x29c355?.["eligibleProductCodes"]) || Array['isArray'](_0x29c355?.["eligible_product_codes"]);
  const _0x30dee4 = Array["isArray"](_0x29c355?.["licensedProductCodes"]) ? _0x29c355["licensedProductCodes"] : Array["isArray"](_0x29c355?.["licensed_product_codes"]) ? _0x29c355["licensed_product_codes"] : Array["isArray"](_0x29c355?.['eligibleProductCodes']) ? _0x29c355['eligibleProductCodes'] : Array["isArray"](_0x29c355?.["eligible_product_codes"]) ? _0x29c355['eligible_product_codes'] : [];
  const _0x12eb84 = Array["from"](new Set(_0x30dee4["map"](_0x26e055 => String(_0x26e055 || '')['trim']()["toLowerCase"]())["filter"](Boolean)));
  _0x3c61fc === 'active' && _0x56f8b4 && !_0x12eb84['includes']('aicanvas') && (_0x3c61fc = 'none');
  const _0x3e5182 = {
    ..._0x373499,
    'status': _0x3c61fc,
    'expiresAt': _0x4271eb,
    'entitledModelKeys': _0x3923d7,
    'entitledModelIds': _0x27f778,
    'planCodes': _0x46545a["map"](_0x2e85f7 => String(_0x2e85f7 || '')['trim']())['filter'](Boolean),
    'planNames': _0x17c606["map"](_0x3ef099 => String(_0x3ef099 || '')['trim']())["filter"](Boolean),
    'licensedProductCodes': _0x12eb84,
    'contactText': normalizeSubscriptionContactText(_0x1a256b),
    'contactUrl': String(_0x3dc3f4 || _0x373499["contactUrl"]),
    'contactWechat': String(_0x5ebb8e || _0x373499["contactWechat"]),
    'deviceId': String(_0x5ef93c || '')
  };
  _0x3e5182["authorizationTier"] = resolveSubscriptionAuthorizationTier(_0x3e5182);
  return _0x3e5182;
}
export async function pullSubscriptionState(_0x33f150, _0x209c0a = '') {
  const _0x15dbd5 = String(_0x209c0a || '')["trim"]() || (await ensureDeviceId(_0x33f150));
  const _0x39f323 = await _fetchSubscriptionStatusImpl(_0x33f150, _0x15dbd5);
  const _0x195f1b = normalizeSubscriptionPayload(_0x39f323 || {});
  setLocalVipUnlocked(isSubscriptionActive(_0x195f1b));
  return _0x195f1b;
}
export async function submitCdkey(_0x3205bc, _0x1027d3, _0x2e94a9 = '') {
  const _0x1feb35 = String(_0x2e94a9 || '')["trim"]() || (await ensureDeviceId(_0x3205bc));
  const _0x48174d = await _activateCdkeyImpl({
    'installId': _0x3205bc,
    'cdkey': _0x1027d3,
    'deviceId': _0x1feb35
  });
  return _0x48174d && typeof _0x48174d === 'object' ? _0x48174d : {};
}
export async function clearSubscriptionAuthorization() {
  const _0x28dd44 = String(globalThis['window']?.['__aicInstallId'] || globalThis["__aicInstallId"] || '')["trim"]();
  const _0x469af1 = String(globalThis["window"]?.["__aicDeviceId"] || globalThis["__aicDeviceId"] || '')["trim"]();
  const _0x15b1a7 = await _clearSubscriptionAuthorizationImpl({
    'installId': _0x28dd44,
    'deviceId': _0x469af1
  });
  _clearLocalSubscriptionIdentity();
  return _0x15b1a7 && typeof _0x15b1a7 === "object" ? _0x15b1a7 : {};
}
export function __setSubscriptionApiForTest({
  fetchSubscriptionStatusImpl: _0x202d9a,
  activateCdkeyImpl: _0x19ce2c,
  clearSubscriptionAuthorizationImpl: _0x2cf168
} = {}) {
  _fetchSubscriptionStatusImpl = typeof _0x202d9a === "function" ? _0x202d9a : fetchSubscriptionStatus;
  _activateCdkeyImpl = typeof _0x19ce2c === 'function' ? _0x19ce2c : activateCdkey;
  _clearSubscriptionAuthorizationImpl = typeof _0x2cf168 === 'function' ? _0x2cf168 : a1592_0x19d49a;
}

// --------------------------------------------------------------------------
// 复刻版无订阅 / CD-Key 体系：把渲染层用于 VIP 门禁判定的 window 全局固化为
// “恒已授权”。audioVoicePanel / RunningHubAiAppManager / replacementStudioAccess
// 等仍读取 window.isModelAllowedBySubscription；若该全局缺失，它们会回退成
// “未授权”并弹出“需要 VIP 授权，请先激活 CDKEY”。此处在模块加载时安装这些全局，
// 使所有功能一律放行，且永不展示激活 / 订阅界面。本模块被上述消费方 import，
// 故自执行安装即可覆盖全部入口。
// --------------------------------------------------------------------------
export function installSubscriptionAccessGlobals(_0xhostOverride) {
  const _host = _0xhostOverride || (typeof window !== 'undefined' ? window : globalThis);
  if (!_host) {
    return;
  }
  try {
    _host['isModelAllowedBySubscription'] = function (_modelId, _state, _gateId) {
      try {
        return isModelAllowed(_modelId, _state, _gateId);
      } catch {
        return !![];
      }
    };
    _host['isSubscriptionActive'] = function (_state) {
      try {
        return isSubscriptionActive(_state);
      } catch {
        return !![];
      }
    };
    _host['getSubscriptionState'] = function () {
      return {
        'status': 'active',
        'authorized': !![],
        'vip': !![]
      };
    };
    // 兜底：即便某处仍尝试打开订阅对话框，也直接视为已授权并回调成功，
    // 绝不展示任何激活 / CDKEY 界面。
    _host['openSubscriptionDialog'] = function (_options) {
      const _onSuccess = _options && typeof _options === 'object' ? _options['onSuccess'] : null;
      if (typeof _onSuccess === 'function') {
        try {
          _onSuccess();
        } catch {}
      }
    };
  } catch {}
}

installSubscriptionAccessGlobals();