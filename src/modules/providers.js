import { getModelManifest } from '../manifests/index.js';
import { translateManifestText } from '../i18n/manifestText.js';
import { AGNES_DOMESTIC_PROFILE_ID, AGNES_INTERNATIONAL_PROFILE_ID, AGNES_MODEL_API_PROFILES } from './agnesProviderProfiles.js';
import { MINIMAX_DOMESTIC_PROFILE_ID, MINIMAX_INTERNATIONAL_PROFILE_ID, MINIMAX_MODEL_API_PROFILES } from './minimaxProviderProfiles.js';
import { RUNNINGHUB_DOMESTIC_PROFILE_ID, RUNNINGHUB_INTERNATIONAL_PROFILE_ID, RUNNINGHUB_MODEL_API_PROFILES } from './runningHubProviderProfiles.js';
export const APIMART_ROUTE_IDS = Object["freeze"]({
  'DOMESTIC_1': "domestic1",
  'DOMESTIC_2': "domestic2",
  'OVERSEAS': 'overseas'
});
export const APIMART_API_ROUTES = Object["freeze"]([Object["freeze"]({
  'id': APIMART_ROUTE_IDS["DOMESTIC_1"],
  'label': "国内线路1",
  'apiUrl': "https://api.apib.ai"
}), Object["freeze"]({
  'id': APIMART_ROUTE_IDS['DOMESTIC_2'],
  'label': "国内线路2",
  'apiUrl': "https://api.aishuch.com"
}), Object["freeze"]({
  'id': APIMART_ROUTE_IDS['OVERSEAS'],
  'label': '海外线路',
  'apiUrl': "https://api.apimart.ai"
})]);
export const DEFAULT_APIMART_ROUTE_ID = APIMART_ROUTE_IDS["DOMESTIC_1"];
export const DEFAULT_APIMART_API_URL = APIMART_API_ROUTES["find"](_0x406b4b => _0x406b4b['id'] === DEFAULT_APIMART_ROUTE_ID)?.["apiUrl"] || "https://api.apib.ai";
export const GRSAI_API_ROUTES = Object["freeze"]([Object['freeze']({
  'id': 'domestic',
  'apiUrl': "https://grsai.dakka.com.cn"
}), Object["freeze"]({
  'id': "global",
  'apiUrl': 'https://grsaiapi.com'
})]);
function normalizeRouteApiUrl(_0x573379) {
  return String(_0x573379 || '')["trim"]()["replace"](/\/+$/, '')['replace'](/\/v1$/i, '');
}
export function getApimartRouteById(_0x161334) {
  const _0xcbb0f5 = String(_0x161334 || '')["trim"]();
  return APIMART_API_ROUTES['find'](_0x2128b1 => _0x2128b1['id'] === _0xcbb0f5) || APIMART_API_ROUTES["find"](_0x3045f9 => _0x3045f9['id'] === DEFAULT_APIMART_ROUTE_ID);
}
export function getApimartApiUrlForRoute(_0x238a9b) {
  return getApimartRouteById(_0x238a9b)?.['apiUrl'] || DEFAULT_APIMART_API_URL;
}
export function resolveApimartRouteByApiUrl(_0x2dab0c) {
  const _0x3e7f09 = normalizeRouteApiUrl(_0x2dab0c);
  if (!_0x3e7f09) {
    return null;
  }
  return APIMART_API_ROUTES["find"](_0x2e49c1 => normalizeRouteApiUrl(_0x2e49c1["apiUrl"]) === _0x3e7f09) || null;
}
export const getDisplayModelName = _0x20e6d2 => {
  if (!_0x20e6d2) {
    return '';
  }
  const _0x5d620c = getModelManifest(_0x20e6d2);
  if (_0x5d620c?.["displayName"]) {
    return translateManifestText(_0x5d620c['displayName']);
  }
  const _0x137156 = {
    'minimax/minimax-m2.5-highspeed': "MiniMax M2.5-highspeed",
    'qwen/qwen3.5-397b-a17b': "Qwen3.5-397B-A17B",
    'deepseek/deepseek-v3.2': 'DeepSeek-V3.2',
    'moonshotai/kimi-k2.5': "Kimi K2.5",
    'apimart/gemini-3.1-pro-preview': "Gemini 3.1 Pro Preview",
    'apimart/gemini-3-flash-preview-nothinking': "Gemini 3 Flash (No Thinking)",
    'gpt-image-2': "GPT image 2",
    'gpt-image-2-vip': "GPT image 2",
    'nano-banana-fast': "Nanobanana",
    'nano-banana-pro': "NanobananaPRO",
    'nano-banana-pro-vt': 'NanobananaPRO',
    'nano-banana-pro-cl': "NanobananaPRO",
    'nano-banana-pro-vip': "NanobananaPRO",
    'nano-banana-pro-4k-vip': "NanobananaPRO",
    'nano-banana-2': "Nanobanana2",
    'nano-banana-2-cl': 'Nanobanana2',
    'nano-banana-2-4k-cl': 'Nanobanana2',
    'seedance-2.0-fast': "Seedance 2.0 Fast",
    'seedance-2.0': "Seedance 2.0",
    'aicanvas/text-lite': "Canvas AI Text Lite",
    'aicanvas/text-pro': "Canvas AI Text Pro",
    'aicanvas/image-lite': 'Canvas\x20AI\x20Image\x20Lite',
    'aicanvas/image-pro': "Canvas AI Image Pro"
  };
  return translateManifestText(_0x137156[_0x20e6d2] || _0x20e6d2);
};
export const PROVIDERS_META = {
  'bailian': {
    'id': "bailian",
    'label': "阿里云百炼",
    'defaultUrl': "https://dashscope.aliyuncs.com",
    'logoPath': "images/qwen.svg"
  },
  'deepseek': {
    'id': "deepseek",
    'label': "DeepSeek",
    'defaultUrl': "https://api.deepseek.com",
    'logoPath': "images/deepseek.svg"
  },
  'grsai': {
    'id': "grsai",
    'label': 'GRSAI',
    'defaultUrl': GRSAI_API_ROUTES[0x0]['apiUrl'],
    'apiRoutes': GRSAI_API_ROUTES,
    'defaultRouteId': "domestic",
    'logoPath': "images/grsai.png"
  },
  'openai': {
    'id': "openai",
    'label': "OpenAI",
    'defaultUrl': 'https://api.openai.com',
    'logoPath': null
  },
  'ppio': {
    'id': "ppio",
    'label': '派欧云',
    'defaultUrl': "https://api.ppio.com",
    'logoPath': 'images/ppio.png'
  },
  'apimart': {
    'id': "apimart",
    'label': "APIMart",
    'defaultUrl': DEFAULT_APIMART_API_URL,
    'apiRoutes': APIMART_API_ROUTES,
    'defaultRouteId': DEFAULT_APIMART_ROUTE_ID,
    'logoPath': null
  },
  [MINIMAX_DOMESTIC_PROFILE_ID]: {
    'id': MINIMAX_DOMESTIC_PROFILE_ID,
    'label': 'MiniMAX官方（国内版）',
    'defaultUrl': MINIMAX_MODEL_API_PROFILES[MINIMAX_DOMESTIC_PROFILE_ID]["apiUrl"],
    'logoPath': "images/minimax-logo.avif"
  },
  [MINIMAX_INTERNATIONAL_PROFILE_ID]: {
    'id': MINIMAX_INTERNATIONAL_PROFILE_ID,
    'label': "MiniMAX官方（国际版）",
    'defaultUrl': MINIMAX_MODEL_API_PROFILES[MINIMAX_INTERNATIONAL_PROFILE_ID]["apiUrl"],
    'logoPath': "images/minimax-logo.avif"
  },
  [AGNES_DOMESTIC_PROFILE_ID]: {
    'id': AGNES_DOMESTIC_PROFILE_ID,
    'label': 'Agnes\x20AI（国内版）',
    'defaultUrl': AGNES_MODEL_API_PROFILES[AGNES_DOMESTIC_PROFILE_ID]["apiUrl"],
    'logoPath': null
  },
  [AGNES_INTERNATIONAL_PROFILE_ID]: {
    'id': AGNES_INTERNATIONAL_PROFILE_ID,
    'label': "Agnes AI（国际版）",
    'defaultUrl': AGNES_MODEL_API_PROFILES[AGNES_INTERNATIONAL_PROFILE_ID]["apiUrl"],
    'logoPath': null
  },
  'binghuo': {
    'id': "binghuo",
    'label': "便宜渠道bh",
    'defaultUrl': "https://api.7tai.cc",
    'logoPath': null
  },
  'volcengine': {
    'id': 'volcengine',
    'label': '火山方舟',
    'defaultUrl': 'https://ark.cn-beijing.volces.com/api/v3',
    'logoPath': "images/volcengine.svg"
  },
  'volcengine-speech': {
    'id': 'volcengine-speech',
    'label': '豆包语音',
    'defaultUrl': "https://openspeech.bytedance.com/api/v3/auc/bigmodel",
    'logoPath': "images/volcengine.svg"
  },
  [RUNNINGHUB_DOMESTIC_PROFILE_ID]: {
    'id': RUNNINGHUB_DOMESTIC_PROFILE_ID,
    'label': "RunningHUB（国内版）",
    'taskHistoryUrls': {
      'workflow': "https://www.runninghub.cn/call-api/bill-task"
    },
    'defaultUrl': RUNNINGHUB_MODEL_API_PROFILES[RUNNINGHUB_DOMESTIC_PROFILE_ID]["apiUrl"],
    'logoPath': "images/RH.png"
  },
  [RUNNINGHUB_INTERNATIONAL_PROFILE_ID]: {
    'id': RUNNINGHUB_INTERNATIONAL_PROFILE_ID,
    'label': "RunningHUB（国际版）",
    'defaultUrl': RUNNINGHUB_MODEL_API_PROFILES[RUNNINGHUB_INTERNATIONAL_PROFILE_ID]["apiUrl"],
    'logoPath': "images/RH.png"
  },
  'runninghubwf': {
    'id': 'runninghubwf',
    'label': 'RunningHUB工作流',
    'taskHistoryUrls': {
      'workflow': "https://www.runninghub.cn/call-api/bill-task"
    },
    'defaultUrl': 'https://www.runninghub.cn',
    'logoPath': "images/RH.png"
  },
  'comfyui': {
    'id': "comfyui",
    'label': 'ComfyUI',
    'defaultUrl': "http://127.0.0.1:8188",
    'logoPath': null
  },
  'dreamina': {
    'id': "dreamina",
    'label': '即梦',
    'defaultUrl': '',
    'logoPath': null
  },
  'aicanvas': {
    'id': "aicanvas",
    'label': 'Canvas\x20AI',
    'defaultUrl': '',
    'logoPath': 'images/favicon.svg'
  }
};
export function resolveProviderApiRoute(_0x1b844f, _0x359a44 = {}) {
  const _0x5332e6 = PROVIDERS_META[_0x1b844f];
  const _0x1d7d54 = _0x5332e6?.["apiRoutes"];
  if (!_0x1d7d54) {
    return null;
  }
  const _0x154435 = String(_0x359a44["apiUrl"] || '')['trim']()["replace"](/\/+$/, '');
  const _0x1e09ea = _0x1d7d54["find"](_0xaada00 => normalizeRouteApiUrl(_0xaada00['apiUrl']) === normalizeRouteApiUrl(_0x154435));
  if (_0x154435) {
    return {
      'apiUrl': _0x154435,
      'routeId': _0x1e09ea?.['id'] || ''
    };
  }
  const _0x1220f5 = _0x1d7d54["find"](_0x73a473 => _0x73a473['id'] === _0x359a44["routeId"]) || _0x1d7d54["find"](_0x83a27e => _0x83a27e['id'] === _0x5332e6['defaultRouteId']);
  return {
    'apiUrl': _0x1220f5['apiUrl'],
    'routeId': _0x1220f5['id']
  };
}
export function getAllProviderIds() {
  return Object["keys"](PROVIDERS_META);
}