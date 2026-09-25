import { PROVIDERS_META, resolveProviderApiRoute } from '../src/modules/providers.js';
import { post, request } from './apiBase.js';
import { normalizeApimartBaseUrl } from './apimartUploadApi.js';
import { buildRunningHubQueueStatusProbeUrl, fetchRunningHubWorkflowQueueStatus as a112_0x1b5723, normalizeRunningHubQueueStatusPayload } from './runningHubQueueStatusApi.js';
import { isRunningHubUploadResponseSuccessful } from './runningHubUploadResponse.js';
const TEST_TIMEOUT_MS = 0x7530;
const TEST_UPLOAD_TIMEOUT_MS = 0xea60;
const DEFAULT_PROVIDER_TEST_IDS = Object["freeze"](['bailian', "deepseek", "apimart", 'minimax', "minimax-international", 'binghuo', 'volcengine', "volcengine-speech", "agnes-domestic", 'agnes', "grsai", "ppio", "runninghub", "runninghub-international", 'comfyui', "openai"]);
const COMPLETION_FALLBACKS = Object['freeze']({
  'apimart': {
    'model': "deepseek-v4-flash",
    'basePath': 'v1',
    'label': "DeepSeek V4 Flash",
    'skipCompletionOnModelsSuccess': !![]
  },
  'deepseek': {
    'model': "deepseek-chat",
    'basePath': 'v1',
    'label': "DeepSeek Chat",
    'skipCompletionOnModelsSuccess': !![]
  },
  'agnes': {
    'model': "agnes-2.5-flash",
    'basePath': 'v1',
    'label': "Agnes 2.5 Flash",
    'skipCompletionOnModelsSuccess': !![],
    'timeoutMs': 0x15f90
  },
  'agnes-domestic': {
    'model': "agnes-2.5-flash",
    'basePath': 'v1',
    'label': "Agnes 2.5 Flash",
    'skipCompletionOnModelsSuccess': !![],
    'timeoutMs': 0x15f90
  },
  'openai': {
    'model': "gpt-4o-mini",
    'basePath': 'v1',
    'label': "GPT-4o mini"
  },
  'ppio': {
    'basePath': "openai/v1"
  }
});
const VOLCENGINE_SPEECH_ASR_RESOURCE_ID = "volc.seedasr.auc";
const VOLCENGINE_SPEECH_TTS_RESOURCE_ID = "seed-tts-2.0";
const VOLCENGINE_SPEECH_TTS_PROBE_URL = "https://openspeech.bytedance.com/api/v3/tts/unidirectional";
const VOLCENGINE_DOUBAO_AUDIO_GENERATION_RESOURCE_ID = 'volc.service_type.10074';
const VOLCENGINE_DOUBAO_AUDIO_GENERATION_PROBE_URL = "https://openspeech.bytedance.com/api/v3/tts/create";
const VOLCENGINE_SPEECH_CAPABILITIES = Object['freeze'](["asr", "tts", 'audioGeneration']);
const PROBE_TEXT_RESPONSE_HEADERS = Object['freeze'](['x-api-status', "x-api-message"]);
const RUNNINGHUB_AUTH_FAILURE_CODES = new Set(["801", "802", "806", "811", "1002", '1014']);
const RUNNINGHUB_MODEL_API_KEY_TYPE = "SHARED";
const STEP_LABELS = Object["freeze"]({
  'config': '配置',
  'auth': '密钥',
  'asr': "录音文件识别",
  'tts': "doubao-seed-tts-2.0",
  'audioGeneration': "doubao-seed-audio-1.0",
  'service': '服务',
  'cloud': '云端',
  'model': '模型',
  'balance': '余额',
  'upload': '上传'
});
const SKIPPED_UPLOAD_PROVIDERS = Object["freeze"]({
  'openai': "OpenAI 兼容接口通常直接接收远程 URL，本轮不做独立上传测试",
  'deepseek': "DeepSeek 兼容接口当前先检测 API Key 和服务连通性，纯文本模型无需素材上传",
  'ppio': '派欧云当前链路不需要独立厂商上传，本轮只检测密钥和模型列表',
  'volcengine': "火山方舟当前先检测 API Key 和服务连通性，模型素材上传待模型接入时验证",
  'agnes': "Agnes AI 兼容接口当前先检测 API Key 和服务连通性，素材沿模型链路上传",
  'agnes-domestic': "Agnes AI 兼容接口当前先检测 API Key 和服务连通性，素材沿模型链路上传",
  'binghuo': "便宜渠道bh当前通过模型列表检测 API Token 和服务连通性，素材上传沿生成链路执行",
  'minimax': "MiniMAX 官方模型通过模型列表检测 API Key，素材上传沿生成链路执行",
  'minimax-international': "MiniMAX 官方模型通过模型列表检测 API Key，素材上传沿生成链路执行"
});
const ONE_PIXEL_PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4////fwAJ+wP9KobjigAAAABJRU5ErkJggg==";
function isPlainObject(_0x4d6540) {
  return !!_0x4d6540 && typeof _0x4d6540 === "object" && !Array["isArray"](_0x4d6540);
}
function normalizeProviderId(_0xeb95c4) {
  return String(_0xeb95c4 || '')['trim']()["toLowerCase"]();
}
function trimSlashes(_0x4b15b8) {
  return String(_0x4b15b8 || '')["replace"](/^\/+|\/+$/g, '');
}
function normalizeBaseUrl(_0x533153) {
  return String(_0x533153 || '')["trim"]()["replace"](/\/+$/, '');
}
function normalizeComfyUiBaseUrl(_0x42824b, _0x2bcea3 = '') {
  const _0x53b2bb = String(_0x42824b || _0x2bcea3 || '')["trim"]();
  if (!_0x53b2bb) {
    return '';
  }
  const _0x33428b = /^[a-z][a-z0-9+.-]*:\/\//i["test"](_0x53b2bb);
  try {
    const _0xe37c8f = new URL(_0x33428b ? _0x53b2bb : 'http://' + _0x53b2bb);
    _0xe37c8f["search"] = '';
    _0xe37c8f["hash"] = '';
    return _0xe37c8f["toString"]()['replace'](/\/+$/, '');
  } catch {
    const _0x7aa6b7 = _0x53b2bb["replace"](/[?#].*$/, '')["replace"](/\/+$/, '');
    if (!_0x7aa6b7) {
      return '';
    }
    return _0x33428b ? _0x7aa6b7 : 'http://' + _0x7aa6b7;
  }
}
function isPrivateIpv4(_0x5a52ba) {
  const _0x15e079 = String(_0x5a52ba || '')["split"]('.')["map"](_0xc5110b => Number(_0xc5110b));
  if (_0x15e079["length"] !== 0x4 || _0x15e079["some"](_0xfd0588 => !Number['isInteger'](_0xfd0588))) {
    return ![];
  }
  const [_0x3dd658, _0x3595e0] = _0x15e079;
  return _0x3dd658 === 0xa || _0x3dd658 === 0x7f || _0x3dd658 === 0xac && _0x3595e0 >= 0x10 && _0x3595e0 <= 0x1f || _0x3dd658 === 0xc0 && _0x3595e0 === 0xa8 || _0x3dd658 === 0xa9 && _0x3595e0 === 0xfe;
}
function shouldAllowCloudComfyUiBaseUrl(_0x37c29c) {
  try {
    const _0x20c541 = new URL(normalizeBaseUrl(_0x37c29c));
    const _0x568fee = _0x20c541["hostname"]["replace"](/^\[|\]$/g, '')["toLowerCase"]();
    if (!_0x568fee || _0x568fee === "localhost" || _0x568fee["endsWith"](".localhost")) {
      return ![];
    }
    if (isPrivateIpv4(_0x568fee)) {
      return ![];
    }
    if (_0x568fee === "::1" || _0x568fee["startsWith"]('fc') || _0x568fee["startsWith"]('fd')) {
      return ![];
    }
    return !![];
  } catch {
    return ![];
  }
}
function joinUrl(_0x9a5b9, _0x4c5f8b) {
  const _0x4af0b7 = normalizeBaseUrl(_0x9a5b9);
  const _0x3da3fd = trimSlashes(_0x4c5f8b);
  if (!_0x4af0b7) {
    return _0x3da3fd;
  }
  if (!_0x3da3fd) {
    return _0x4af0b7;
  }
  return _0x4af0b7 + '/' + _0x3da3fd;
}
function providerLabel(_0x46a88e) {
  return PROVIDERS_META?.[_0x46a88e]?.["label"] || _0x46a88e;
}
function providerConfigWithDefaults(_0x9057dd, _0x131a6c = {}) {
  const _0x5e250e = isPlainObject(_0x131a6c) ? _0x131a6c : {};
  const _0x53f761 = resolveProviderApiRoute(_0x9057dd, _0x5e250e)?.["apiUrl"] || _0x5e250e['apiUrl'] || PROVIDERS_META?.[_0x9057dd]?.['defaultUrl'] || '';
  if (_0x9057dd === "comfyui") {
    return {
      'apiUrl': normalizeComfyUiBaseUrl(_0x53f761),
      'cloudApiUrl': normalizeComfyUiBaseUrl(_0x5e250e["cloudApiUrl"] || _0x5e250e["cloudBaseUrl"] || ''),
      'apiKey': String(_0x5e250e['apiKey'] || '')["trim"]()["replace"](/^Bearer\s+/i, ''),
      'modelApiKey': String(_0x5e250e["modelApiKey"] || '')["trim"]()["replace"](/^Bearer\s+/i, '')
    };
  }
  return {
    'apiUrl': normalizeBaseUrl(_0x53f761),
    'apiKey': String(_0x5e250e["apiKey"] || '')["trim"]()["replace"](/^Bearer\s+/i, ''),
    'modelApiKey': String(_0x5e250e["modelApiKey"] || '')["trim"]()["replace"](/^Bearer\s+/i, '')
  };
}
function stripKnownOpenAiTail(_0x3456c5) {
  return normalizeBaseUrl(_0x3456c5)["replace"](/\/chat\/completions$/i, '')["replace"](/\/models$/i, '');
}
function buildModelsProbeUrl(_0x30eb98, _0x17a1bc) {
  const _0x4632f9 = normalizeProviderId(_0x30eb98);
  const _0x38b8b8 = stripKnownOpenAiTail(_0x17a1bc);
  if (!_0x38b8b8 || _0x38b8b8["includes"](":generateContent")) {
    return '';
  }
  if (_0x4632f9 === "bailian") {
    return joinUrl(_0x38b8b8['replace'](/\/(?:compatible-mode|api)\/v1$/i, ''), "api/v1/models");
  }
  if (_0x4632f9 === "ppio") {
    return joinUrl(_0x38b8b8["replace"](/\/openai\/v1$/i, ''), "openai/v1/models");
  }
  if (/\/v\d+(?:beta)?$/i["test"](_0x38b8b8) || /\/openai\/v1$/i["test"](_0x38b8b8)) {
    return joinUrl(_0x38b8b8, 'models');
  }
  return joinUrl(_0x38b8b8, "v1/models");
}
function buildCompletionProbeUrl(_0x4fca7d, _0x3d531f) {
  const _0x2aa06f = COMPLETION_FALLBACKS[_0x4fca7d];
  if (!_0x2aa06f) {
    return '';
  }
  const _0x10f54e = stripKnownOpenAiTail(_0x3d531f);
  if (!_0x10f54e || _0x10f54e['includes'](':generateContent')) {
    return '';
  }
  if (_0x4fca7d === 'ppio') {
    return joinUrl(_0x10f54e["replace"](/\/openai\/v1$/i, ''), _0x2aa06f['basePath']);
  }
  if (/\/v\d+(?:beta)?$/i["test"](_0x10f54e)) {
    return _0x10f54e;
  }
  return joinUrl(_0x10f54e, _0x2aa06f['basePath']);
}
function buildVolcenginePingProbeUrl(_0x3a531a) {
  const _0x4a3c8e = stripKnownOpenAiTail(_0x3a531a);
  if (!_0x4a3c8e || _0x4a3c8e["includes"](':generateContent')) {
    return '';
  }
  const _0x34b6b1 = _0x4a3c8e["replace"](/\/api\/v3$/i, '')["replace"](/\/api\/coding\/v3$/i, '');
  return joinUrl(_0x34b6b1, 'ping');
}
function buildVolcengineSpeechAsrSubmitProbeUrl(_0x29145c) {
  const _0x3cf5ad = normalizeBaseUrl(_0x29145c || PROVIDERS_META?.["volcengine-speech"]?.['defaultUrl'] || 'https://openspeech.bytedance.com/api/v3/auc/bigmodel')['replace'](/\/submit$/i, '')["replace"](/\/query$/i, '');
  return joinUrl(_0x3cf5ad, "submit");
}
function buildApimartBalanceProbeUrls(_0xffce64) {
  const _0x1bbf2e = stripKnownOpenAiTail(_0xffce64);
  if (!_0x1bbf2e || _0x1bbf2e["includes"](":generateContent")) {
    return [];
  }
  if (/\/v\d+(?:beta)?$/i["test"](_0x1bbf2e)) {
    return [joinUrl(_0x1bbf2e, "user/balance"), joinUrl(_0x1bbf2e, "balance")];
  }
  return [joinUrl(_0x1bbf2e, "v1/user/balance"), joinUrl(_0x1bbf2e, "v1/balance")];
}
function buildRunningHubAccountStatusProbeUrl(_0x7c003f) {
  const _0x41ffcd = normalizeBaseUrl(_0x7c003f || PROVIDERS_META?.["runninghub"]?.["defaultUrl"] || "https://www.runninghub.cn")["replace"](/\/openapi\/v2(?:\/.*)?$/i, '')['replace'](/\/uc\/openapi\/accountStatus$/i, '');
  return joinUrl(_0x41ffcd, "uc/openapi/accountStatus");
}
function buildComfyUiSystemStatsProbeUrl(_0x2cca02) {
  const _0xcffac7 = normalizeComfyUiBaseUrl(_0x2cca02);
  const _0x5bbfda = new URLSearchParams({
    'baseUrl': _0xcffac7
  });
  shouldAllowCloudComfyUiBaseUrl(_0xcffac7) && _0x5bbfda['set']('allowCloudBaseUrl', '1');
  return "/api/v2/comfyui/system-stats?" + _0x5bbfda["toString"]();
}
function buildGrsaiApiKeyCreditsProbeUrl(_0x1a6f03) {
  const _0x5fc948 = normalizeBaseUrl(_0x1a6f03 || PROVIDERS_META?.["grsai"]?.["defaultUrl"] || "https://grsai.dakka.com.cn")["replace"](/\/v\d+(?:beta)?$/i, '')["replace"](/\/client\/openapi\/getAPIKeyCredits$/i, '');
  return joinUrl(_0x5fc948, "client/openapi/getAPIKeyCredits");
}
function buildGrsaiAccountCreditsProbeUrl(_0x5c0bfb, _0x223fa2) {
  const _0x4e6094 = normalizeBaseUrl(_0x5c0bfb || PROVIDERS_META?.["grsai"]?.['defaultUrl'] || "https://grsai.dakka.com.cn")["replace"](/\/v\d+(?:beta)?$/i, '')["replace"](/\/client\/common\/getCredits(?:\?.*)?$/i, '')["replace"](/\/client\/openapi\/getAPIKeyCredits$/i, '');
  return joinUrl(_0x4e6094, "client/common/getCredits") + "?apikey=" + encodeURIComponent(_0x223fa2);
}
function toFiniteNumber(_0x5e11b0) {
  if (_0x5e11b0 === null || _0x5e11b0 === undefined || _0x5e11b0 === '') {
    return null;
  }
  const _0x550489 = Number(_0x5e11b0);
  return Number['isFinite'](_0x550489) ? _0x550489 : null;
}
function formatBalanceNumber(_0x4977f6) {
  const _0x43e543 = toFiniteNumber(_0x4977f6);
  if (_0x43e543 === null) {
    return '';
  }
  return new Intl["NumberFormat"]("zh-CN", {
    'maximumFractionDigits': 0x6
  })["format"](_0x43e543);
}
function formatCurrencyLabel(_0x524f39) {
  const _0x2b5e97 = String(_0x524f39 || '')["trim"]()['toUpperCase']();
  if (!_0x2b5e97 || _0x2b5e97 === "CNY" || _0x2b5e97 === "RMB" || _0x2b5e97 === "CNH") {
    return '人民币';
  }
  return _0x2b5e97;
}
export function normalizeApimartBalancePayload(_0x43068c = {}) {
  const _0x17efab = isPlainObject(_0x43068c?.['data']) && !Array['isArray'](_0x43068c["data"]) ? _0x43068c["data"] : _0x43068c;
  if (!isPlainObject(_0x17efab) || _0x17efab["success"] === ![]) {
    return null;
  }
  const _0x4e7537 = _0x17efab["unlimited_quota"] === !![];
  const _0x45c658 = toFiniteNumber(_0x17efab["remain_balance"] ?? _0x17efab["remaining_balance"] ?? _0x17efab['balance']);
  const _0x1fa778 = _0x4e7537 ? null : _0x45c658;
  const _0x1664f4 = toFiniteNumber(_0x17efab['used_balance']);
  if (!_0x4e7537 && _0x1fa778 === null) {
    return null;
  }
  const _0x15a7d6 = _0x1fa778 === null ? '' : formatBalanceNumber(_0x1fa778);
  const _0x437062 = [];
  if (_0x4e7537) {
    _0x437062['push']('额度不限');
  }
  if (_0x15a7d6) {
    _0x437062["push"]("剩余余额：" + _0x15a7d6 + " 美元");
  }
  return {
    'unlimited': _0x4e7537,
    'remaining': _0x1fa778,
    'used': _0x1664f4,
    'displayText': _0x4e7537 ? "余额 不限" : _0x15a7d6 ? "余额 " + _0x15a7d6 + " 美元" : "余额 已读取",
    'detailText': _0x437062["join"]('；') || 'APIMart\x20余额已读取'
  };
}
function normalizeRunningHubAccountStatusPayload(_0x2cf937 = {}) {
  const _0x4586fa = isPlainObject(_0x2cf937?.["data"]) && !Array["isArray"](_0x2cf937["data"]) ? _0x2cf937["data"] : _0x2cf937;
  if (!isPlainObject(_0x4586fa)) {
    return null;
  }
  if (_0x4586fa["success"] === ![]) {
    return null;
  }
  if (_0x4586fa["code"] !== undefined && Number(_0x4586fa['code']) !== 0x0) {
    return null;
  }
  const _0x27319f = isPlainObject(_0x4586fa["data"]) && !Array["isArray"](_0x4586fa['data']) ? _0x4586fa["data"] : _0x4586fa;
  const _0x150fc1 = toFiniteNumber(_0x27319f["remainCoins"] ?? _0x27319f["remain_coins"] ?? _0x27319f['coins']);
  const _0x3f1270 = toFiniteNumber(_0x27319f["remainMoney"] ?? _0x27319f["remain_money"] ?? _0x27319f["money"] ?? _0x27319f["balance"]);
  if (_0x150fc1 === null && _0x3f1270 === null) {
    return null;
  }
  const _0x1721f9 = String(_0x27319f["currency"] || "CNY")["trim"]()["toUpperCase"]() || 'CNY';
  return {
    'coins': _0x150fc1,
    'money': _0x3f1270,
    'currency': _0x1721f9,
    'apiType': String(_0x27319f["apiType"] || _0x27319f["api_type"] || '')['trim']()
  };
}
export function normalizeRunningHubBalancePayload({
  workflow: _0x736708,
  model: _0x171dc6,
  workflowQueue: _0x34deb7,
  modelQueue: _0x2cfbfe
} = {}) {
  const _0x3829de = normalizeRunningHubAccountStatusPayload(_0x736708);
  const _0x3cbf = normalizeRunningHubAccountStatusPayload(_0x171dc6);
  const _0x16b72c = normalizeRunningHubQueueStatusPayload(_0x34deb7);
  const _0x57da88 = normalizeRunningHubQueueStatusPayload(_0x2cfbfe);
  const _0x54dea3 = _0x3829de?.["coins"] ?? null;
  const _0x3651d8 = _0x3cbf?.["money"] ?? null;
  const _0x421481 = _0x16b72c?.["concurrentLimit"] ?? null;
  const _0x582370 = _0x57da88?.['concurrentLimit'] ?? null;
  if (_0x54dea3 === null && _0x3651d8 === null && _0x421481 === null && _0x582370 === null) {
    return null;
  }
  const _0x4da3e7 = _0x3cbf?.["currency"] || _0x3829de?.["currency"] || "CNY";
  const _0x29c05f = formatCurrencyLabel(_0x4da3e7);
  const _0x15b4ea = formatBalanceNumber(_0x54dea3);
  const _0x1de50c = formatBalanceNumber(_0x3651d8);
  const _0x21450a = formatBalanceNumber(_0x421481);
  const _0x4ecfd9 = formatBalanceNumber(_0x582370);
  const _0x501a8e = [];
  const _0x584dfa = [];
  if (_0x21450a && _0x4ecfd9) {
    _0x501a8e["push"]("并发上限 " + _0x21450a + '/' + _0x4ecfd9);
  } else {
    if (_0x21450a) {
      _0x501a8e["push"]("工作流并发 " + _0x21450a);
    } else {
      _0x4ecfd9 && _0x501a8e['push']("模型并发 " + _0x4ecfd9);
    }
  }
  _0x21450a && _0x584dfa["push"]("工作流并发上限：" + _0x21450a);
  _0x4ecfd9 && _0x584dfa['push']("模型并发上限：" + _0x4ecfd9);
  _0x15b4ea && (_0x501a8e["push"]("积分 " + _0x15b4ea), _0x584dfa["push"]('工作流积分：' + _0x15b4ea));
  _0x1de50c && (_0x501a8e["push"]("钱包 " + _0x1de50c + '\x20' + _0x29c05f), _0x584dfa["push"]("模型钱包：" + _0x1de50c + '\x20' + _0x29c05f));
  return {
    'workflowCredits': _0x54dea3,
    'modelWallet': _0x3651d8,
    'workflowConcurrentLimit': _0x421481,
    'modelConcurrentLimit': _0x582370,
    'workflowApiKeyType': _0x16b72c?.["apiKeyType"] || '',
    'modelApiKeyType': _0x57da88?.["apiKeyType"] || '',
    'currency': _0x4da3e7,
    'currencyLabel': _0x29c05f,
    'displayText': _0x501a8e["join"](" · ") || "余额 已读取",
    'detailText': _0x584dfa["join"]('；') || 'RunningHUB\x20账户信息已读取'
  };
}
function isSuccessfulGrsaiPayload(_0xe0c814) {
  if (!isPlainObject(_0xe0c814)) {
    return !![];
  }
  if (_0xe0c814["success"] === ![] || _0xe0c814['ok'] === ![]) {
    return ![];
  }
  const _0x2aef8a = _0xe0c814["code"] ?? _0xe0c814['statusCode'];
  if (_0x2aef8a !== undefined) {
    const _0x2b44de = Number(_0x2aef8a);
    return _0x2b44de === 0x0 || _0x2b44de === 0xc8;
  }
  return !![];
}
function unwrapGrsaiCreditsPayload(_0x25903a) {
  if (!isPlainObject(_0x25903a)) {
    return _0x25903a;
  }
  if (!isSuccessfulGrsaiPayload(_0x25903a)) {
    return null;
  }
  if (_0x25903a["data"] !== undefined) {
    return unwrapGrsaiCreditsPayload(_0x25903a["data"]);
  }
  if (_0x25903a["result"] !== undefined) {
    return unwrapGrsaiCreditsPayload(_0x25903a['result']);
  }
  return _0x25903a;
}
function extractGrsaiCreditsValue(_0x36e042, _0x786712 = new Set()) {
  const _0x50990c = toFiniteNumber(_0x36e042);
  if (_0x50990c !== null) {
    return _0x50990c;
  }
  if (!isPlainObject(_0x36e042) || _0x786712["has"](_0x36e042)) {
    return null;
  }
  _0x786712['add'](_0x36e042);
  const _0x362269 = ["currentCredits", "availableCredits", "remainingCredits", "remainCredits", "remain_credits", 'remaining_credits', "accountCredits", "account_credits", "totalCredits", "total_credits", "apiKeyCredits", "api_key_credits", "credits", 'credit', "balance", "amount"];
  for (const _0x1dc8b4 of _0x362269) {
    if (_0x36e042[_0x1dc8b4] === undefined) {
      continue;
    }
    const _0x619fcc = extractGrsaiCreditsValue(_0x36e042[_0x1dc8b4], _0x786712);
    if (_0x619fcc !== null) {
      return _0x619fcc;
    }
  }
  for (const _0xc204b2 of ['account', "user", "wallet", 'quota']) {
    if (_0x36e042[_0xc204b2] === undefined) {
      continue;
    }
    const _0xd1232d = extractGrsaiCreditsValue(_0x36e042[_0xc204b2], _0x786712);
    if (_0xd1232d !== null) {
      return _0xd1232d;
    }
  }
  return null;
}
export function normalizeGrsaiBalancePayload(_0x1c8c70 = {}, _0x384c0f = {}) {
  const _0x5e9a24 = unwrapGrsaiCreditsPayload(_0x1c8c70);
  if (_0x5e9a24 === null) {
    return null;
  }
  const _0x3a2334 = toFiniteNumber(extractGrsaiCreditsValue(_0x5e9a24));
  if (_0x3a2334 === null) {
    return null;
  }
  const _0x233a73 = formatBalanceNumber(_0x3a2334);
  const _0xc98c3f = _0x384c0f["source"] || "account";
  const _0x365d42 = _0xc98c3f === "apiKey" ? "API Key 积分" : "账户积分";
  return {
    'credits': _0x3a2334,
    'source': _0xc98c3f,
    'displayText': _0xc98c3f === "apiKey" ? "Key 积分 " + _0x233a73 : "账户积分 " + _0x233a73,
    'detailText': _0x365d42 + '：' + _0x233a73
  };
}
function stringifyProbePayload(_0x4f135d) {
  if (_0x4f135d == null) {
    return '';
  }
  if (typeof _0x4f135d === "string") {
    return _0x4f135d;
  }
  try {
    return JSON["stringify"](_0x4f135d);
  } catch {
    return String(_0x4f135d || '');
  }
}
function probeHeaderText(_0x10f71b = {}) {
  if (!isPlainObject(_0x10f71b)) {
    return '';
  }
  return PROBE_TEXT_RESPONSE_HEADERS["map"](_0x111a57 => {
    const _0x4c577e = _0x10f71b[_0x111a57];
    return _0x4c577e ? _0x111a57 + ':\x20' + _0x4c577e : '';
  })['filter'](Boolean)['join']('\x20');
}
function probeText(_0x1e15f3 = {}) {
  return [_0x1e15f3["status"] ? "HTTP " + _0x1e15f3['status'] : '', _0x1e15f3['error'] || '', probeHeaderText(_0x1e15f3["headers"]), stringifyProbePayload(_0x1e15f3["data"])]["filter"](Boolean)["join"]('\x20');
}
function normalizeErrorText(_0x4c0be9 = '') {
  return String(_0x4c0be9 || '')["replace"](/\s+/g, '\x20')["trim"]();
}
function isAuthFailure(_0x376a89 = {}) {
  const _0x19f10b = Number(_0x376a89["status"] || 0x0);
  if (_0x19f10b === 0x191 || _0x19f10b === 0x193) {
    return !![];
  }
  const _0x37a4d3 = probeText(_0x376a89)["toLowerCase"]();
  return /(?:\b401\b|\b403\b|unauthorized|forbidden|authentication\s*(?:failed|required|error)|authorization\s*(?:failed|required|error)|invalid\s+(?:x-)?api(?:-|\s*)?key|invalid\s+(?:bearer|access\s*)?token|(?:x-)?api(?:-|\s*)?key.{0,40}(?:invalid|expired|missing|required|revoked|denied)|(?:bearer|access\s*)?token.{0,40}(?:invalid|expired|missing|required|revoked|denied)|鉴权失败|认证失败|未授权|无权限|密钥.{0,20}(?:无效|过期|缺失|未配置)|令牌.{0,20}(?:无效|过期|缺失|未配置))/i["test"](_0x37a4d3);
}
function classifyProbeFailure(_0x864b98 = {}, _0x377d0 = 'provider_error') {
  const _0x461474 = Number(_0x864b98["status"] || 0x0);
  const _0x9a866b = probeText(_0x864b98)["toLowerCase"]();
  if (isAuthFailure(_0x864b98)) {
    return "auth_failed";
  }
  if (/blocked private\/reserved apiurl|unable to resolve apiurl host/i['test'](_0x9a866b)) {
    return "dns_or_proxy";
  }
  if (_0x461474 === 0x0 || /timeout|timed out|network|failed to fetch|dns|econn|请求超时|网络请求失败/i["test"](_0x9a866b)) {
    return "network_failed";
  }
  if (_0x461474 === 0x1ad || /rate limit|too many requests|限流|请求过于频繁/i["test"](_0x9a866b)) {
    return "rate_limited";
  }
  if (/insufficient|quota|balance|billing|credit|payment|额度|余额|欠费|付费|账户余额/i["test"](_0x9a866b)) {
    return 'quota_or_balance';
  }
  if (/model.+(?:not found|not exist|unavailable|no access)|模型.*(?:不存在|不可用|无权限|未开通)|no permission.*model/i["test"](_0x9a866b)) {
    return "model_unavailable";
  }
  if (_0x461474 === 0x194 || /not found|invalid url|unsupported endpoint|cannot post|cannot get|接口地址|地址不兼容/i["test"](_0x9a866b)) {
    return "bad_base_url";
  }
  return _0x377d0;
}
function getRunningHubBusinessCode(_0x24af11 = {}) {
  const _0x579741 = _0x24af11?.["data"];
  const _0x5ad7b2 = _0x579741?.["code"] ?? _0x579741?.["errorCode"] ?? _0x579741?.['error_code'];
  return _0x5ad7b2 === undefined || _0x5ad7b2 === null ? '' : String(_0x5ad7b2)["trim"]();
}
function classifyRunningHubProbeFailure(_0x2f3d8d = {}, _0x3f4bd3 = "provider_error") {
  const _0x135da6 = getRunningHubBusinessCode(_0x2f3d8d);
  const _0x4e0b41 = probeText(_0x2f3d8d);
  if (RUNNINGHUB_AUTH_FAILURE_CODES["has"](_0x135da6) || /(?:api(?:-|\s*)?key|apikey|密钥).{0,40}(?:不存在|无效|未授权|失效|user_not_found|unauthorized|invalid)/i["test"](_0x4e0b41)) {
    return 'auth_failed';
  }
  return classifyProbeFailure(_0x2f3d8d, _0x3f4bd3);
}
function humanizeCategory(_0x173c50, _0x8553a, _0x15d740 = '连接测试未通过') {
  const _0x5577f0 = providerLabel(_0x8553a);
  const _0x5471c7 = {
    'missing_key': _0x5577f0 + " 的 API Key 还没填写。",
    'missing_url': _0x5577f0 + " 的接口地址未配置。",
    'auth_failed': _0x5577f0 + " 的 API Key 无效、过期，或没有访问权限。",
    'dns_or_proxy': _0x5577f0 + '\x20的域名解析被本地安全校验拦截，请检查\x20DNS\x20或系统代理设置。',
    'network_failed': '无法连到\x20' + _0x5577f0 + '，请检查网络、本地服务或防火墙。',
    'rate_limited': _0x5577f0 + " 返回限流，请稍后再试。",
    'quota_or_balance': _0x5577f0 + " 账户额度或余额可能不足。",
    'model_unavailable': _0x5577f0 + " 的测试模型不可访问，可能未开通该模型或模型名不兼容。",
    'model_timeout': _0x5577f0 + " 的测试模型响应超时，已超过设定的 " + (COMPLETION_FALLBACKS[_0x8553a]?.["timeoutMs"] || TEST_TIMEOUT_MS) / 0x3e8 + " 秒等待时间，请稍后重试。",
    'bad_base_url': _0x5577f0 + " 的接口地址不兼容，请检查 Base URL 是否填对。",
    'upload_failed': _0x5577f0 + " 上传链路未通过，参考图/视频上传可能会失败。",
    'provider_error': _0x5577f0 + " 返回异常，稍后重试或查看厂商后台状态。",
    'unsupported': _0x5577f0 + " 暂不支持连接测试。"
  };
  return _0x5471c7[_0x173c50] || _0x15d740;
}
function isSuccessfulProbe(_0x471b86 = {}) {
  if (!_0x471b86["success"]) {
    return ![];
  }
  const _0x3c4e13 = Number(_0x471b86["status"] || 0x0);
  if (_0x3c4e13 && (_0x3c4e13 < 0xc8 || _0x3c4e13 >= 0x12c)) {
    return ![];
  }
  return !isAuthFailure(_0x471b86);
}
function summarizeFailure(_0x5a39c5 = {}, _0x4fb85e = '连接测试未通过') {
  const _0x52723f = probeText(_0x5a39c5)["trim"]();
  if (!_0x52723f) {
    return _0x4fb85e;
  }
  return _0x52723f['length'] > 0xb4 ? _0x52723f["slice"](0x0, 0xb1) + "..." : _0x52723f;
}
function summarizeVolcengineSpeechFailure(_0x5ccb7c = {}, _0x16df5a = "ASR") {
  const _0x1e44e7 = probeText(_0x5ccb7c)["trim"]();
  if (/invalid\s+x-api-key|x-api-key\s+invalid|api\s*key\s+invalid/i["test"](_0x1e44e7)) {
    return "火山语音返回 Invalid X-Api-Key：请填写火山语音 API Key 管理页里的 X-Api-Key，不要使用火山方舟 Key，并确认已开通录音文件识别。";
  }
  if (/(?:permission|denied|forbid|unauthor|not\s+authorized|no\s+access|无权限|未授权|鉴权)/i["test"](_0x1e44e7)) {
    return "火山语音 " + _0x16df5a + " 权限未通过：请确认该服务已开通，并给这个 X-Api-Key 开启访问权限。";
  }
  return summarizeFailure(_0x5ccb7c, "火山语音 " + _0x16df5a + " 测试未通过");
}
function isVolcengineSpeechValidationFailure(_0x37629e = {}) {
  const _0xf72000 = Number(_0x37629e["status"] || 0x0);
  if (isAuthFailure(_0x37629e)) {
    return ![];
  }
  if (_0xf72000 < 0x190 || _0xf72000 >= 0x1f4) {
    return ![];
  }
  const _0x5dae5e = probeText(_0x37629e);
  return /(?:\btext(?:_prompt)?\b|\bprompt\b|speaker|req_params|model_name|文本|提示词|音色|audio|codec|payload|请求体|音频)/i['test'](_0x5dae5e) || /(?:format|格式)(?!.*(?:url|endpoint|base\s*url|接口|地址))/i["test"](_0x5dae5e) || /(?:parameter|params|参数)(?!.*(?:key|token|密钥|令牌))/i["test"](_0x5dae5e) || /(?:request\s*body|body)(?!.*(?:key|token|auth))/i["test"](_0x5dae5e);
}
function makeStep(_0x2a400b, _0x179eee, _0x1b27e7, _0x457cdc = '', _0x48700e = {}) {
  return {
    'id': _0x2a400b,
    'label': STEP_LABELS[_0x2a400b] || _0x2a400b,
    'ok': Boolean(_0x179eee),
    'skipped': _0x48700e["skipped"] === !![],
    'message': _0x1b27e7,
    'detail': normalizeErrorText(_0x457cdc),
    'category': _0x48700e["category"] || ''
  };
}
function pass(_0x3767a7, _0x1ee761 = "连接测试通过", _0x25c68b = []) {
  return {
    'ok': !![],
    'providerId': _0x3767a7,
    'label': providerLabel(_0x3767a7),
    'message': '通过',
    'summary': "连接测试通过",
    'detail': _0x1ee761,
    'category': '',
    'suggestion': '',
    'steps': _0x25c68b
  };
}
function partialPass(_0x4e5fc7, _0xc35582, _0x24115e = '', _0x2a8454 = []) {
  return {
    'ok': !![],
    'partial': !![],
    'providerId': _0x4e5fc7,
    'label': providerLabel(_0x4e5fc7),
    'message': "部分通过",
    'summary': _0xc35582 || '连接测试部分通过',
    'detail': _0x24115e,
    'category': '',
    'suggestion': '',
    'steps': _0x2a8454
  };
}
function fail(_0x2e0ace, _0x514ac2, _0x2f894f = [], _0x4f6323 = "provider_error") {
  return {
    'ok': ![],
    'providerId': _0x2e0ace,
    'label': providerLabel(_0x2e0ace),
    'message': "未通过",
    'error': String(_0x514ac2 || "连接测试未通过"),
    'summary': String(_0x514ac2 || "连接测试未通过"),
    'category': _0x4f6323,
    'suggestion': humanizeCategory(_0x4f6323, _0x2e0ace, _0x514ac2),
    'steps': _0x2f894f
  };
}
function finishProviderResult(_0x181c75, _0x4806c5 = []) {
  const _0x3647d9 = _0x4806c5["find"](_0x729afa => !_0x729afa['ok'] && !_0x729afa["skipped"]);
  const _0x2340a9 = _0x4806c5["filter"](_0x47472e => _0x47472e['ok'] && !_0x47472e["skipped"] && _0x47472e['id'] !== 'config');
  const _0x56f432 = _0x4806c5["filter"](_0x402a1e => _0x402a1e['skipped']);
  if (!_0x3647d9) {
    const _0x21e48c = _0x4806c5['map'](_0x391a8f => _0x391a8f['label'] + ':\x20' + _0x391a8f["message"])["join"]('；');
    return pass(_0x181c75, _0x21e48c || "连接测试通过", _0x4806c5);
  }
  const _0x24dd53 = _0x3647d9["category"] || "provider_error";
  const _0xa8cab9 = _0x3647d9["message"] || humanizeCategory(_0x24dd53, _0x181c75);
  const _0x5b6162 = _0x4806c5["map"](_0x4a9612 => {
    const _0x4f8b38 = _0x4a9612["skipped"] ? '跳过' : _0x4a9612['ok'] ? '通过' : '失败';
    return '' + _0x4a9612['label'] + _0x4f8b38 + ':\x20' + _0x4a9612['message'];
  });
  return {
    'ok': ![],
    'partial': _0x2340a9["length"] > 0x0 || _0x56f432["length"] > 0x0,
    'providerId': _0x181c75,
    'label': providerLabel(_0x181c75),
    'message': _0x2340a9["length"] > 0x0 ? '部分通过' : "未通过",
    'error': _0xa8cab9,
    'summary': _0xa8cab9,
    'detail': _0x5b6162["join"]('；'),
    'category': _0x24dd53,
    'suggestion': humanizeCategory(_0x24dd53, _0x181c75, _0xa8cab9),
    'steps': _0x4806c5
  };
}
async function getModelsProbe(_0x290a99, _0x42aff7, _0x214bc3) {
  const _0x5ea33a = await request('/api/v2/proxy/task?apiUrl=' + encodeURIComponent(_0x42aff7), {
    'method': "GET",
    'headers': {
      'Authorization': 'Bearer\x20' + _0x214bc3
    }
  }, TEST_TIMEOUT_MS);
  if (isSuccessfulProbe(_0x5ea33a)) {
    return makeStep("auth", !![], "API Key 可用，模型列表可访问", "models");
  }
  const _0x5468f8 = classifyProbeFailure(_0x5ea33a);
  return {
    ...makeStep('auth', ![], humanizeCategory(_0x5468f8, _0x290a99), summarizeFailure(_0x5ea33a), {
      'category': _0x5468f8
    }),
    'authFailed': isAuthFailure(_0x5ea33a)
  };
}
async function completionFallbackProbe(_0x593246, _0x54ab3d, _0x4cb9a6) {
  const _0x5968aa = COMPLETION_FALLBACKS[_0x593246];
  const _0x3efc85 = buildCompletionProbeUrl(_0x593246, _0x54ab3d);
  if (!_0x5968aa?.["model"] || !_0x3efc85) {
    return makeStep("model", !![], "模型列表可访问，未执行额外模型调用", "no completion fallback", {
      'skipped': !![]
    });
  }
  const _0x1599d3 = {
    'apiUrl': _0x3efc85,
    'apiKey': _0x4cb9a6,
    'model': _0x5968aa["model"],
    'stream': ![],
    'messages': [{
      'role': "user",
      'content': "ping"
    }],
    'max_tokens': 0x1
  };
  const _0x20052c = await post("/api/v2/proxy/completions", _0x1599d3, _0x5968aa["timeoutMs"] || TEST_TIMEOUT_MS);
  if (isSuccessfulProbe(_0x20052c)) {
    return makeStep("model", !![], "测试模型 " + (_0x5968aa["label"] || _0x5968aa["model"]) + " 可访问", "chat-completions");
  }
  const _0x2007dc = classifyProbeFailure(_0x20052c, "model_unavailable");
  const _0x598f35 = _0x2007dc === 'network_failed' && /timeout|timed out|请求超时/i["test"](probeText(_0x20052c)) ? "model_timeout" : _0x2007dc;
  return makeStep('model', ![], humanizeCategory(_0x598f35, _0x593246), summarizeFailure(_0x20052c), {
    'category': _0x598f35
  });
}
async function apimartBalanceProbe(_0x4ac109, _0x5c2cfa) {
  const _0x53be1b = buildApimartBalanceProbeUrls(_0x5c2cfa['apiUrl']);
  if (_0x53be1b['length'] <= 0x0) {
    return {
      'step': makeStep('balance', !![], "余额接口地址不可用，已跳过", "no balance endpoint", {
        'skipped': !![]
      }),
      'balance': null
    };
  }
  let _0x3f0869 = null;
  for (const _0x199c39 of _0x53be1b) {
    const _0x353714 = await request("/api/v2/proxy/task?apiUrl=" + encodeURIComponent(_0x199c39), {
      'method': "GET",
      'headers': {
        'Authorization': 'Bearer\x20' + _0x5c2cfa["apiKey"]
      }
    }, TEST_TIMEOUT_MS);
    _0x3f0869 = _0x353714;
    if (isSuccessfulProbe(_0x353714)) {
      const _0x3dac7c = normalizeApimartBalancePayload(_0x353714['data']);
      if (_0x3dac7c) {
        return {
          'step': makeStep('balance', !![], _0x3dac7c["detailText"] || "APIMart 余额已读取", _0x199c39["includes"]('/user/balance') ? "apimart-user-balance" : "apimart-token-balance"),
          'balance': _0x3dac7c
        };
      }
    }
  }
  return {
    'step': makeStep("balance", !![], "余额暂未返回，连接测试继续", summarizeFailure(_0x3f0869, 'APIMart\x20余额接口未返回可识别数据'), {
      'skipped': !![]
    }),
    'balance': null
  };
}
async function grsaiCreditsProbe(_0x571a0f) {
  const _0x53c218 = await request(buildGrsaiAccountCreditsProbeUrl(_0x571a0f['apiUrl'], _0x571a0f['apiKey']), {
    'method': "GET",
    'headers': {
      'Authorization': "Bearer " + _0x571a0f["apiKey"]
    }
  }, TEST_TIMEOUT_MS);
  if (isSuccessfulProbe(_0x53c218)) {
    const _0x342ffc = normalizeGrsaiBalancePayload(_0x53c218["data"], {
      'source': "account"
    });
    if (_0x342ffc) {
      return {
        'step': makeStep("auth", !![], "API Key 可用，账户积分已读取", _0x342ffc['detailText'] || "GRSAI 账户积分已读取"),
        'balance': _0x342ffc
      };
    }
  }
  const _0x1f3415 = await request(buildGrsaiApiKeyCreditsProbeUrl(_0x571a0f["apiUrl"]), {
    'method': "POST",
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + _0x571a0f["apiKey"]
    },
    'body': JSON['stringify']({
      'apiKey': _0x571a0f['apiKey']
    })
  }, TEST_TIMEOUT_MS);
  if (!isSuccessfulProbe(_0x1f3415)) {
    const _0x16d0d6 = classifyProbeFailure(_0x1f3415);
    return {
      'step': makeStep("auth", ![], humanizeCategory(_0x16d0d6, 'grsai'), summarizeFailure(_0x1f3415, "GRSAI 积分接口请求失败"), {
        'category': _0x16d0d6
      }),
      'balance': null
    };
  }
  const _0x5a91a7 = normalizeGrsaiBalancePayload(_0x1f3415["data"], {
    'source': 'apiKey'
  });
  if (!_0x5a91a7) {
    return {
      'step': makeStep('auth', ![], 'GRSAI\x20API\x20Key\x20积分接口未返回可识别数据。', stringifyProbePayload(_0x1f3415["data"]), {
        'category': 'provider_error'
      }),
      'balance': null
    };
  }
  return {
    'step': makeStep('auth', !![], "API Key 可用，积分已读取", _0x5a91a7['detailText'] || "GRSAI API Key 积分已读取"),
    'balance': _0x5a91a7
  };
}
async function grsaiProviderProbe(_0x49ce44, _0x1f4e7c, _0xa22a26) {
  const _0x3bf9f1 = await grsaiCreditsProbe(_0x1f4e7c);
  _0xa22a26["push"](_0x3bf9f1['step']);
  const _0x4b63af = finishProviderResult(_0x49ce44, _0xa22a26);
  return _0x3bf9f1["balance"] ? {
    ..._0x4b63af,
    'balance': _0x3bf9f1['balance']
  } : _0x4b63af;
}
async function runningHubAccountStatusProbe(_0x15c014, _0x17af33) {
  const _0x57500e = String(_0x17af33 || '')["trim"]();
  if (!_0x57500e) {
    return null;
  }
  const _0x60c510 = buildRunningHubAccountStatusProbeUrl(_0x15c014["apiUrl"]);
  const _0x591fb4 = await post("/api/v2/proxy/image", {
    'apiUrl': _0x60c510,
    'apiKey': _0x57500e,
    'apikey': _0x57500e
  }, TEST_TIMEOUT_MS);
  return isSuccessfulProbe(_0x591fb4) ? _0x591fb4["data"] : null;
}
async function runningHubQueueStatusProbe(_0x387eab, _0x7670f2) {
  return a112_0x1b5723({
    ..._0x387eab,
    'apiKey': _0x7670f2
  }, {
    'timeoutMs': TEST_TIMEOUT_MS
  });
}
export async function fetchRunningHubWorkflowQueueStatus(_0x266a0c = {}) {
  const _0x1c3b3f = providerConfigWithDefaults('runninghub', _0x266a0c);
  return runningHubQueueStatusProbe(_0x1c3b3f, _0x1c3b3f["apiKey"]);
}
async function runningHubBalanceProbe(_0x54e2a2, _0x26a89a = {}) {
  const [_0x4e366f, _0x2c465c] = await Promise['all']([runningHubAccountStatusProbe(_0x54e2a2, _0x54e2a2["apiKey"]), runningHubAccountStatusProbe(_0x54e2a2, _0x54e2a2["modelApiKey"])]);
  const _0x148b9f = _0x26a89a["workflow"] || null;
  const _0x143c36 = _0x26a89a['model'] || null;
  const _0x437d9c = normalizeRunningHubBalancePayload({
    'workflow': _0x4e366f,
    'model': _0x2c465c,
    'workflowQueue': _0x148b9f,
    'modelQueue': _0x143c36
  });
  if (_0x437d9c) {
    return {
      'step': makeStep("balance", !![], _0x437d9c["detailText"] || "RunningHUB 账户信息已读取", "runninghub-account-status"),
      'balance': _0x437d9c
    };
  }
  return {
    'step': makeStep("balance", !![], "账户信息暂未返回，连接测试继续", 'RunningHUB\x20账户信息接口未返回可识别数据', {
      'skipped': !![]
    }),
    'balance': null
  };
}
function createTinyPngBlob() {
  const _0x14aefe = typeof atob === "function" ? atob(ONE_PIXEL_PNG_BASE64) : Buffer["from"](ONE_PIXEL_PNG_BASE64, "base64")["toString"]('binary');
  const _0xdcc8c6 = new Uint8Array(_0x14aefe['length']);
  for (let _0x460535 = 0x0; _0x460535 < _0x14aefe["length"]; _0x460535++) {
    _0xdcc8c6[_0x460535] = _0x14aefe["charCodeAt"](_0x460535);
  }
  return new Blob([_0xdcc8c6], {
    'type': "image/png"
  });
}
async function apimartUploadProbe(_0x12f936, _0x3b3f3c) {
  const _0x3085a7 = new FormData();
  _0x3085a7['append']("file", createTinyPngBlob(), 'aic-connection-test.png');
  _0x3085a7["append"]("contentType", "image/png");
  _0x3085a7["append"]('fileExtension', 'png');
  _0x3085a7['append']("permanent", '0');
  _0x3085a7["append"]("apiKey", _0x3b3f3c['apiKey']);
  _0x3085a7["append"]("apiUrl", normalizeApimartBaseUrl(_0x3b3f3c["apiUrl"]));
  const _0x218b06 = await post("/api/v2/proxy/apimart-upload", _0x3085a7, TEST_UPLOAD_TIMEOUT_MS);
  if (isSuccessfulProbe(_0x218b06) && (_0x218b06["data"]?.["cdnUrl"] || _0x218b06['data']?.["url"])) {
    return makeStep("upload", !![], "上传链路可用", 'apimart-upload');
  }
  const _0xf3027d = classifyProbeFailure(_0x218b06, "upload_failed");
  return makeStep("upload", ![], humanizeCategory(_0xf3027d === "provider_error" ? "upload_failed" : _0xf3027d, _0x12f936), summarizeFailure(_0x218b06, "APIMart 上传失败"), {
    'category': _0xf3027d === "provider_error" ? "upload_failed" : _0xf3027d
  });
}
async function runningHubUploadProbe(_0x1cf45a, _0x279826) {
  if (!_0x279826['modelApiKey']) {
    return makeStep("upload", !![], '未填写模型\x20API\x20Key，跳过模型上传链路', 'no\x20model\x20api\x20key', {
      'skipped': !![]
    });
  }
  const _0x5ee885 = joinUrl(_0x279826["apiUrl"], 'openapi/v2/media/upload/binary');
  const _0x30d505 = new FormData();
  _0x30d505["append"]('file', createTinyPngBlob(), "aic-connection-test.png");
  const _0x4d5cef = await request("/api/v2/proxy/upload?apiUrl=" + encodeURIComponent(_0x5ee885), {
    'method': 'POST',
    'headers': {
      'Authorization': 'Bearer\x20' + _0x279826["modelApiKey"]
    },
    'body': _0x30d505
  }, TEST_UPLOAD_TIMEOUT_MS);
  if (isSuccessfulProbe(_0x4d5cef) && isRunningHubUploadResponseSuccessful(_0x4d5cef['data'])) {
    return makeStep("upload", !![], "上传链路可用", "runninghub-upload");
  }
  const _0x5d9571 = classifyRunningHubProbeFailure(_0x4d5cef, "upload_failed");
  return makeStep("upload", ![], humanizeCategory(_0x5d9571 === "provider_error" ? "upload_failed" : _0x5d9571, _0x1cf45a), summarizeFailure(_0x4d5cef, 'RunningHUB\x20上传失败'), {
    'category': _0x5d9571 === "provider_error" ? "upload_failed" : _0x5d9571
  });
}
async function uploadProbe(_0x502ee2, _0x3cc362) {
  if (_0x502ee2 === 'apimart') {
    return apimartUploadProbe(_0x502ee2, _0x3cc362);
  }
  if (_0x502ee2 === "runninghub" || _0x502ee2 === 'runninghub-international') {
    return runningHubUploadProbe(_0x502ee2, _0x3cc362);
  }
  return makeStep("upload", !![], SKIPPED_UPLOAD_PROVIDERS[_0x502ee2] || "当前厂商无需独立上传检测", "skipped", {
    'skipped': !![]
  });
}
async function openAiLikeProviderProbe(_0x640526, _0x4ff78a) {
  const _0x44842f = providerConfigWithDefaults(_0x640526, _0x4ff78a);
  const _0x2f8da7 = [];
  let _0x339620 = null;
  let _0x44c236 = ![];
  if (!_0x44842f['apiKey']) {
    _0x2f8da7['push'](makeStep("config", ![], "API Key 未填写", '', {
      'category': "missing_key"
    }));
    return finishProviderResult(_0x640526, _0x2f8da7);
  }
  if (!_0x44842f["apiUrl"]) {
    _0x2f8da7['push'](makeStep("config", ![], '接口地址未配置', '', {
      'category': 'missing_url'
    }));
    return finishProviderResult(_0x640526, _0x2f8da7);
  }
  _0x2f8da7["push"](makeStep("config", !![], "接口地址和 API Key 已填写"));
  if (_0x640526 === 'grsai') {
    return grsaiProviderProbe(_0x640526, _0x44842f, _0x2f8da7);
  }
  const _0x1d4323 = buildModelsProbeUrl(_0x640526, _0x44842f['apiUrl']);
  if (_0x1d4323) {
    const _0x240a57 = await getModelsProbe(_0x640526, _0x1d4323, _0x44842f["apiKey"]);
    if (_0x240a57['ok']) {
      _0x2f8da7["push"](_0x240a57);
      _0x44c236 = !![];
    } else {
      if (_0x240a57['authFailed'] || _0x240a57["category"] === "dns_or_proxy" || !COMPLETION_FALLBACKS[_0x640526]?.["model"]) {
        _0x2f8da7["push"](_0x240a57);
        return finishProviderResult(_0x640526, _0x2f8da7);
      } else {
        _0x2f8da7['push'](makeStep('auth', !![], '模型列表不可用，已改用轻量模型调用继续检测', _0x240a57["detail"], {
          'skipped': !![]
        }));
      }
    }
  }
  COMPLETION_FALLBACKS[_0x640526]?.["skipCompletionOnModelsSuccess"] && _0x44c236 ? _0x2f8da7["push"](makeStep("model", !![], '模型列表可访问，未执行额外模型调用', "models", {
    'skipped': !![]
  })) : _0x2f8da7['push'](await completionFallbackProbe(_0x640526, _0x44842f["apiUrl"], _0x44842f['apiKey']));
  if (_0x2f8da7["some"](_0x5de0ed => !_0x5de0ed['ok'] && !_0x5de0ed['skipped'])) {
    return finishProviderResult(_0x640526, _0x2f8da7);
  }
  if (_0x640526 === "apimart") {
    const _0x57a9cc = await apimartBalanceProbe(_0x640526, _0x44842f);
    _0x2f8da7["push"](_0x57a9cc["step"]);
    _0x339620 = _0x57a9cc["balance"];
  }
  _0x2f8da7["push"](await uploadProbe(_0x640526, _0x44842f));
  const _0x446ae1 = finishProviderResult(_0x640526, _0x2f8da7);
  return _0x339620 ? {
    ..._0x446ae1,
    'balance': _0x339620
  } : _0x446ae1;
}
async function runningHubCredentialProbe(_0x4e5b7b, _0x2cc569, _0x59a992, {
  stepId: _0x3798e8,
  successMessage: _0x271670,
  requiredApiKeyType = ''
} = {}) {
  const _0x2cde91 = buildRunningHubQueueStatusProbeUrl(_0x2cc569["apiUrl"]);
  const _0xaa87cc = await request("/api/v2/proxy/task?apiUrl=" + encodeURIComponent(_0x2cde91), {
    'method': "GET",
    'headers': {
      'Authorization': "Bearer " + _0x59a992
    }
  }, TEST_TIMEOUT_MS);
  const _0xf33d9c = isSuccessfulProbe(_0xaa87cc) ? normalizeRunningHubQueueStatusPayload(_0xaa87cc["data"]) : null;
  if (isSuccessfulProbe(_0xaa87cc) && _0xf33d9c) {
    const _0x322777 = String(_0xf33d9c?.["apiKeyType"] || '')["trim"]()["toUpperCase"]();
    if (requiredApiKeyType && _0x322777 !== requiredApiKeyType) {
      const _0xac49d = _0x322777 || "UNKNOWN";
      return {
        'step': makeStep(_0x3798e8, ![], '模型\x20API\x20Key\x20必须使用企业级-共享\x20Key（当前类型：' + _0xac49d + '）。', "RunningHUB queue status apiKeyType=" + _0xac49d, {
          'category': "auth_failed"
        }),
        'queueStatus': _0xf33d9c
      };
    }
    return {
      'step': makeStep(_0x3798e8, !![], _0x271670, "runninghub-queue-status"),
      'queueStatus': _0xf33d9c
    };
  }
  const _0x420dfb = _0x3798e8 === 'model' ? "model_unavailable" : "provider_error";
  const _0x393088 = classifyRunningHubProbeFailure(_0xaa87cc, _0x420dfb);
  return {
    'step': makeStep(_0x3798e8, ![], humanizeCategory(_0x393088, _0x4e5b7b), summarizeFailure(_0xaa87cc, (_0x3798e8 === "model" ? '模型' : '工作流') + '\x20API\x20Key\x20测试未通过'), {
      'category': _0x393088
    }),
    'queueStatus': null
  };
}
function runningHubWorkflowProbe(_0x11351d, _0x57e501) {
  return runningHubCredentialProbe(_0x11351d, _0x57e501, _0x57e501["apiKey"], {
    'stepId': 'auth',
    'successMessage': "工作流 API Key 可用"
  });
}
function runningHubModelProbe(_0x56165f, _0x22fea3) {
  return runningHubCredentialProbe(_0x56165f, _0x22fea3, _0x22fea3["modelApiKey"], {
    'stepId': "model",
    'successMessage': "模型 API Key 可用",
    'requiredApiKeyType': RUNNINGHUB_MODEL_API_KEY_TYPE
  });
}
async function runningHubProviderProbe(_0x597d11, _0x3db35c) {
  const _0x5b80b4 = providerConfigWithDefaults(_0x597d11, _0x3db35c);
  const _0x5dde2c = [];
  const _0x1ae713 = [];
  let _0x1fd9f4 = null;
  if (_0x5b80b4["apiKey"]) {
    _0x5dde2c["push"](runningHubWorkflowProbe(_0x597d11, _0x5b80b4));
  }
  if (_0x5b80b4["modelApiKey"]) {
    _0x5dde2c["push"](runningHubModelProbe(_0x597d11, _0x5b80b4));
  }
  if (_0x5dde2c["length"] === 0x0) {
    _0x1ae713["push"](makeStep("config", ![], "API Key 未填写", '', {
      'category': "missing_key"
    }));
    return finishProviderResult(_0x597d11, _0x1ae713);
  }
  _0x1ae713["push"](makeStep("config", !![], "已填写至少一个 RunningHUB API Key"));
  const _0x9499e3 = await Promise["all"](_0x5dde2c);
  _0x1ae713['push'](..._0x9499e3['map'](_0x547e7b => _0x547e7b["step"]));
  if (!_0x1ae713["some"](_0x13ef37 => !_0x13ef37['ok'] && !_0x13ef37["skipped"])) {
    let _0x42ff92 = 0x0;
    const _0x3e6ddd = {
      'workflow': _0x5b80b4["apiKey"] ? _0x9499e3[_0x42ff92++]?.["queueStatus"] : null,
      'model': _0x5b80b4["modelApiKey"] ? _0x9499e3[_0x42ff92]?.["queueStatus"] : null
    };
    const _0x55de2f = await runningHubBalanceProbe(_0x5b80b4, _0x3e6ddd);
    _0x1ae713["push"](_0x55de2f["step"]);
    _0x1fd9f4 = _0x55de2f['balance'];
  }
  !_0x1ae713["some"](_0x1d62c2 => !_0x1d62c2['ok'] && !_0x1d62c2["skipped"]) && _0x1ae713["push"](await uploadProbe(_0x597d11, _0x5b80b4));
  const _0x194312 = finishProviderResult(_0x597d11, _0x1ae713);
  return _0x1fd9f4 ? {
    ..._0x194312,
    'balance': _0x1fd9f4
  } : _0x194312;
}
function normalizeComfyUiProbeTarget(_0x3f346c = '') {
  const _0x2d45b3 = String(_0x3f346c || '')['trim']()['toLowerCase']();
  return _0x2d45b3 === "local" || _0x2d45b3 === 'cloud' ? _0x2d45b3 : '';
}
async function comfyUiProviderProbe(_0x9f7610, _0x101f82 = {}) {
  const _0x3df852 = providerConfigWithDefaults('comfyui', _0x9f7610);
  const _0x5286e2 = normalizeComfyUiProbeTarget(_0x101f82?.["target"]);
  const _0x3ccd4e = [];
  const _0x563ab1 = _0x5286e2 ? [_0x5286e2] : ["local", ...(_0x3df852["cloudApiUrl"] ? ["cloud"] : [])];
  const _0x13efd3 = _0x563ab1["find"](_0x51fe85 => _0x51fe85 === 'cloud' ? !_0x3df852["cloudApiUrl"] : !_0x3df852["apiUrl"]);
  if (_0x13efd3) {
    const _0x1decac = _0x13efd3 === "cloud" ? '云端' : '本地';
    _0x3ccd4e["push"](makeStep("config", ![], "ComfyUI " + _0x1decac + "地址未配置", '', {
      'category': "missing_url"
    }));
    return finishProviderResult("comfyui", _0x3ccd4e);
  }
  _0x3ccd4e["push"](makeStep("config", !![], _0x5286e2 === "cloud" ? "ComfyUI 云端地址已填写" : _0x5286e2 === "local" ? 'ComfyUI\x20本地地址已填写' : _0x3df852['cloudApiUrl'] ? "ComfyUI 本地和云端地址已填写" : "ComfyUI 本地地址已填写"));
  const _0x47d72b = async (_0x1c6106, _0x402757, _0x4f000c) => {
    const _0xccd03c = await request(buildComfyUiSystemStatsProbeUrl(_0x4f000c), {
      'method': "GET"
    }, TEST_TIMEOUT_MS);
    if (isSuccessfulProbe(_0xccd03c)) {
      const _0x3d1a46 = String(_0xccd03c?.["data"]?.["system"]?.["comfyui_version"] || '')["trim"]();
      _0x3ccd4e["push"](makeStep(_0x1c6106, !![], _0x3d1a46 ? _0x402757 + " ComfyUI 服务可访问（" + _0x3d1a46 + '）' : _0x402757 + " ComfyUI 服务可访问", "system_stats"));
      return;
    }
    const _0x202c5f = classifyProbeFailure(_0xccd03c);
    _0x3ccd4e["push"](makeStep(_0x1c6106, ![], humanizeCategory(_0x202c5f, "comfyui"), summarizeFailure(_0xccd03c, _0x402757 + " ComfyUI 连接测试未通过"), {
      'category': _0x202c5f
    }));
  };
  for (const _0x199997 of _0x563ab1) {
    await _0x47d72b(_0x199997 === "cloud" ? "cloud" : "service", _0x199997 === 'cloud' ? '云端' : '本地', _0x199997 === "cloud" ? _0x3df852['cloudApiUrl'] : _0x3df852["apiUrl"]);
  }
  const _0x8875cf = finishProviderResult("comfyui", _0x3ccd4e);
  return _0x5286e2 ? {
    ..._0x8875cf,
    'label': _0x5286e2 === 'cloud' ? 'ComfyUI\x20云端' : 'ComfyUI\x20本地'
  } : _0x8875cf;
}
function buildVolcengineSpeechProbeRequestId(_0x3e0406) {
  return "aic-connection-test-" + _0x3e0406 + '-' + Date["now"]();
}
function buildVolcengineSpeechTtsProbeBody() {
  return {
    'req_params': {
      'text': '',
      'speaker': 'zh_female_vv_uranus_bigtts',
      'audio_params': {
        'format': 'mp3',
        'sample_rate': 0x5dc0
      }
    }
  };
}
function buildVolcengineDoubaoAudioGenerationProbeBody() {
  return {
    'model': "seed-audio-1.0",
    'text_prompt': '',
    'audio_config': {
      'format': "mp3",
      'sample_rate': 0x5dc0,
      'pitch_rate': 0x0,
      'speech_rate': 0x0,
      'loudness_rate': 0x0
    },
    'watermark': {}
  };
}
async function requestVolcengineSpeechProbe({
  apiKey: _0x2b3632,
  apiUrl: _0x405ed1,
  resourceId: _0x4f8c2d,
  requestIdScope: _0x5ca9f4,
  body: _0x115703
}) {
  return request('/api/v2/proxy/task?apiUrl=' + encodeURIComponent(_0x405ed1), {
    'method': "POST",
    'headers': {
      'Content-Type': 'application/json',
      'X-Api-Key': _0x2b3632,
      'X-Api-Resource-Id': _0x4f8c2d,
      'X-Api-Request-Id': buildVolcengineSpeechProbeRequestId(_0x5ca9f4)
    },
    'body': JSON['stringify'](_0x115703)
  }, TEST_TIMEOUT_MS);
}
function makeVolcengineSpeechServiceStep({
  stepId: _0x85e8db,
  serviceLabel: _0x494742,
  successMessage: _0x2da9ad,
  successDetail: _0x30a02f,
  result: _0x2c5e51
}) {
  if (isSuccessfulProbe(_0x2c5e51) || isVolcengineSpeechValidationFailure(_0x2c5e51)) {
    return makeStep(_0x85e8db, !![], _0x2da9ad, _0x30a02f);
  }
  const _0x3e740c = classifyProbeFailure(_0x2c5e51);
  return makeStep(_0x85e8db, ![], humanizeCategory(_0x3e740c, "volcengine-speech"), summarizeVolcengineSpeechFailure(_0x2c5e51, _0x494742), {
    'category': _0x3e740c
  });
}
async function volcengineSpeechAsrProbe(_0x230bc5) {
  const _0x3e31a3 = await request("/api/v2/proxy/task?apiUrl=" + encodeURIComponent(buildVolcengineSpeechAsrSubmitProbeUrl(_0x230bc5["apiUrl"])), {
    'method': "POST",
    'headers': {
      'Content-Type': "application/json",
      'X-Api-Key': _0x230bc5['apiKey'],
      'X-Api-Resource-Id': VOLCENGINE_SPEECH_ASR_RESOURCE_ID,
      'X-Api-Request-Id': buildVolcengineSpeechProbeRequestId("asr"),
      'X-Api-Sequence': '-1'
    },
    'body': JSON['stringify']({
      'user': {
        'uid': "ai-canvas-connection-test"
      },
      'audio': {
        'data': '',
        'format': 'mp3',
        'codec': "mp3",
        'rate': 0x3e80
      },
      'request': {
        'model_name': 'bigmodel'
      }
    })
  }, TEST_TIMEOUT_MS);
  return makeVolcengineSpeechServiceStep({
    'stepId': "asr",
    'serviceLabel': '录音文件识别',
    'successMessage': "录音文件识别服务可访问",
    'successDetail': 'seed-asr-submit',
    'result': _0x3e31a3
  });
}
async function volcengineSpeechTtsProbe(_0x382103) {
  const _0x1d86e7 = await requestVolcengineSpeechProbe({
    'apiKey': _0x382103['apiKey'],
    'apiUrl': VOLCENGINE_SPEECH_TTS_PROBE_URL,
    'resourceId': VOLCENGINE_SPEECH_TTS_RESOURCE_ID,
    'requestIdScope': "tts",
    'body': buildVolcengineSpeechTtsProbeBody()
  });
  return makeVolcengineSpeechServiceStep({
    'stepId': "tts",
    'serviceLabel': "doubao-seed-tts-2.0",
    'successMessage': "doubao-seed-tts-2.0 服务可访问",
    'successDetail': 'tts-unidirectional',
    'result': _0x1d86e7
  });
}
async function volcengineDoubaoAudioGenerationProbe(_0x3c6505) {
  const _0x3d538e = await requestVolcengineSpeechProbe({
    'apiKey': _0x3c6505["apiKey"],
    'apiUrl': VOLCENGINE_DOUBAO_AUDIO_GENERATION_PROBE_URL,
    'resourceId': VOLCENGINE_DOUBAO_AUDIO_GENERATION_RESOURCE_ID,
    'requestIdScope': "seed-audio",
    'body': buildVolcengineDoubaoAudioGenerationProbeBody()
  });
  return makeVolcengineSpeechServiceStep({
    'stepId': "audioGeneration",
    'serviceLabel': "doubao-seed-audio-1.0",
    'successMessage': "doubao-seed-audio-1.0 服务可访问",
    'successDetail': "tts-create",
    'result': _0x3d538e
  });
}
function normalizeVolcengineSpeechCapabilityList(_0x4809f5, _0x530e18 = VOLCENGINE_SPEECH_CAPABILITIES) {
  const _0x11244d = Array["isArray"](_0x4809f5) ? _0x4809f5 : _0x4809f5 ? [_0x4809f5] : [];
  const _0x2e14d9 = [];
  _0x11244d["forEach"](_0x2c58ca => {
    const _0x53baaa = String(_0x2c58ca || '')["trim"]();
    VOLCENGINE_SPEECH_CAPABILITIES["includes"](_0x53baaa) && !_0x2e14d9["includes"](_0x53baaa) && _0x2e14d9["push"](_0x53baaa);
  });
  return _0x2e14d9["length"] > 0x0 ? _0x2e14d9 : [..._0x530e18];
}
function normalizeVolcengineSpeechRequiredCapabilities(_0x221ca9) {
  const _0x3121fc = Array["isArray"](_0x221ca9) ? _0x221ca9 : _0x221ca9 ? [_0x221ca9] : [];
  const _0x25f28d = [];
  _0x3121fc["forEach"](_0x5460a8 => {
    const _0x4ce8cf = String(_0x5460a8 || '')["trim"]();
    VOLCENGINE_SPEECH_CAPABILITIES['includes'](_0x4ce8cf) && !_0x25f28d["includes"](_0x4ce8cf) && _0x25f28d['push'](_0x4ce8cf);
  });
  return _0x25f28d;
}
function buildVolcengineSpeechCapabilityProbes(_0x1a8482 = VOLCENGINE_SPEECH_CAPABILITIES) {
  const _0x2d77be = {
    'asr': volcengineSpeechAsrProbe,
    'tts': volcengineSpeechTtsProbe,
    'audioGeneration': volcengineDoubaoAudioGenerationProbe
  };
  return _0x1a8482["map"](_0x3a6e88 => _0x2d77be[_0x3a6e88])["filter"](_0x3203b3 => typeof _0x3203b3 === "function");
}
function finishVolcengineSpeechProviderResult(_0x3fc418, _0x372f20 = [], {
  requiredCapabilities = []
} = {}) {
  const _0x6eb396 = new Set(["config", ...requiredCapabilities]);
  const _0x57bdb3 = _0x372f20["find"](_0x131f62 => !_0x131f62['ok'] && !_0x131f62["skipped"] && _0x6eb396["has"](_0x131f62['id']));
  if (_0x57bdb3) {
    return finishProviderResult(_0x3fc418, _0x372f20);
  }
  const _0x5838c0 = _0x372f20["filter"](_0x6dda41 => VOLCENGINE_SPEECH_CAPABILITIES['includes'](_0x6dda41['id']));
  const _0x2df97e = _0x5838c0["some"](_0x54dde3 => _0x54dde3['ok']);
  const _0xbd4e8f = _0x5838c0["some"](_0x44cfc6 => !_0x44cfc6['ok'] && !_0x44cfc6["skipped"]);
  if (_0x2df97e && _0xbd4e8f) {
    const _0x425f30 = _0x372f20["map"](_0x5e628e => {
      const _0x2d28e6 = _0x5e628e['skipped'] ? '跳过' : _0x5e628e['ok'] ? '通过' : '失败';
      return '' + (_0x5e628e["label"] || _0x5e628e['id']) + _0x2d28e6 + ':\x20' + _0x5e628e["message"];
    })["join"]('；');
    return partialPass(_0x3fc418, "豆包语音 API Key 可用，部分服务未开通或无权限。", _0x425f30, _0x372f20);
  }
  return finishProviderResult(_0x3fc418, _0x372f20);
}
async function volcengineProviderProbe(_0x2d971d) {
  const _0xfcfd81 = providerConfigWithDefaults('volcengine', _0x2d971d);
  const _0x2435f5 = [];
  if (!_0xfcfd81["apiKey"]) {
    _0x2435f5["push"](makeStep("config", ![], "API Key 未填写", '', {
      'category': 'missing_key'
    }));
    return finishProviderResult('volcengine', _0x2435f5);
  }
  if (!_0xfcfd81["apiUrl"]) {
    _0x2435f5["push"](makeStep("config", ![], "接口地址未配置", '', {
      'category': "missing_url"
    }));
    return finishProviderResult("volcengine", _0x2435f5);
  }
  _0x2435f5["push"](makeStep('config', !![], "接口地址和 API Key 已填写"));
  const _0x1fb5d0 = buildVolcenginePingProbeUrl(_0xfcfd81['apiUrl']);
  if (!_0x1fb5d0) {
    _0x2435f5["push"](makeStep("auth", ![], "接口地址不兼容", _0xfcfd81["apiUrl"], {
      'category': "bad_base_url"
    }));
    return finishProviderResult("volcengine", _0x2435f5);
  }
  const _0x245a85 = await request("/api/v2/proxy/task?apiUrl=" + encodeURIComponent(_0x1fb5d0), {
    'method': "GET",
    'headers': {
      'Authorization': 'Bearer\x20' + _0xfcfd81["apiKey"]
    }
  }, TEST_TIMEOUT_MS);
  if (isSuccessfulProbe(_0x245a85)) {
    _0x2435f5["push"](makeStep("auth", !![], "方舟 API Key 可用，服务可访问", "ping"));
    _0x2435f5['push'](await uploadProbe("volcengine", _0xfcfd81));
    return finishProviderResult('volcengine', _0x2435f5);
  }
  const _0x4112ec = classifyProbeFailure(_0x245a85);
  _0x2435f5["push"](makeStep("auth", ![], humanizeCategory(_0x4112ec, "volcengine"), summarizeFailure(_0x245a85, '火山方舟\x20ping\x20测试未通过'), {
    'category': _0x4112ec
  }));
  return finishProviderResult("volcengine", _0x2435f5);
}
async function volcengineSpeechProviderProbe(_0xafcdc4, _0x5bd998 = {}) {
  const _0x157fda = "volcengine-speech";
  const _0x519da7 = providerConfigWithDefaults(_0x157fda, _0xafcdc4);
  const _0x4ffa24 = [];
  if (!_0x519da7["apiKey"]) {
    _0x4ffa24['push'](makeStep('config', ![], "API Key 未填写", '', {
      'category': 'missing_key'
    }));
    return finishProviderResult(_0x157fda, _0x4ffa24);
  }
  if (!_0x519da7["apiUrl"]) {
    _0x4ffa24["push"](makeStep("config", ![], "接口地址未配置", '', {
      'category': "missing_url"
    }));
    return finishProviderResult(_0x157fda, _0x4ffa24);
  }
  _0x4ffa24["push"](makeStep('config', !![], "接口地址和 API Key 已填写"));
  const _0x33f4cc = normalizeVolcengineSpeechCapabilityList(_0x5bd998?.['probeCapabilities'] || _0x5bd998?.["requiredCapabilities"]);
  const _0x24ddb7 = normalizeVolcengineSpeechRequiredCapabilities(_0x5bd998?.['requiredCapabilities']);
  const _0x254e32 = await Promise['all'](buildVolcengineSpeechCapabilityProbes(_0x33f4cc)["map"](_0x1cf92e => _0x1cf92e(_0x519da7)));
  _0x4ffa24["push"](..._0x254e32);
  return finishVolcengineSpeechProviderResult(_0x157fda, _0x4ffa24, {
    'requiredCapabilities': _0x24ddb7
  });
}
export async function testProviderConnection(_0x562f8f, _0x351054 = {}, _0x27d3ac = {}) {
  const _0x55b09e = normalizeProviderId(_0x562f8f);
  if (!DEFAULT_PROVIDER_TEST_IDS["includes"](_0x55b09e)) {
    return fail(_0x55b09e || "unknown", "暂不支持该厂商的连接测试");
  }
  if (_0x55b09e === 'runninghub' || _0x55b09e === "runninghub-international") {
    return runningHubProviderProbe(_0x55b09e, _0x351054);
  }
  if (_0x55b09e === "comfyui") {
    return comfyUiProviderProbe(_0x351054, _0x27d3ac);
  }
  if (_0x55b09e === "volcengine") {
    return volcengineProviderProbe(_0x351054);
  }
  if (_0x55b09e === "volcengine-speech") {
    return volcengineSpeechProviderProbe(_0x351054, _0x27d3ac);
  }
  return openAiLikeProviderProbe(_0x55b09e, _0x351054);
}
export async function testProviderConnections(_0x1daa56 = {}, _0x1cae32 = DEFAULT_PROVIDER_TEST_IDS, _0x35f9e3 = {}) {
  const _0x1c8456 = isPlainObject(_0x1daa56?.["providers"]) ? _0x1daa56["providers"] : {};
  const _0x18151d = await Promise["all"](_0x1cae32["map"](async _0x21a338 => {
    const _0x19aebc = normalizeProviderId(_0x21a338);
    const _0x5d8ebe = await testProviderConnection(_0x19aebc, _0x1c8456[_0x19aebc] || {}, _0x35f9e3);
    return [_0x19aebc, _0x5d8ebe];
  }));
  return Object["fromEntries"](_0x18151d);
}