import { pickClosestRatio, resolveProviderRatioPayload } from '../imageRatioPolicy.js';
import { uploadModelApiMediaInputs } from '../mediaInputUploadRouter.js';
const PPIO_MIN_PIXELS = 0xa00 * 0x5a0;
const PPIO_MAX_PIXELS = 0x9ec290;
const PPIO_MIN_RATIO = 0x1 / 0x10;
const PPIO_MAX_RATIO = 0x10;
const PPIO_ALIGN_STEP = 0x40;
const PPIO_DEFAULT_SIZE = "2048x2048";
const PPIO_DEFAULT_QUALITY = '2K';
const PPIO_DEFAULT_RATIO = '1:1';
const PPIO_QUALITY_PIXEL_MAP = Object["freeze"]({
  '1K': 0x400 * 0x400,
  '2K': 0x800 * 0x800,
  '3K': 0xa00 * 0xa00,
  '4K': 0xb40 * 0xb40
});
const PPIO_RATIO_OPTIONS = Object["freeze"]([Object['freeze']({
  'label': '1:1',
  'w': 0x1,
  'h': 0x1
}), Object["freeze"]({
  'label': "9:16",
  'w': 0x9,
  'h': 0x10
}), Object["freeze"]({
  'label': "16:9",
  'w': 0x10,
  'h': 0x9
}), Object['freeze']({
  'label': "3:4",
  'w': 0x3,
  'h': 0x4
}), Object["freeze"]({
  'label': '4:3',
  'w': 0x4,
  'h': 0x3
}), Object['freeze']({
  'label': "3:2",
  'w': 0x3,
  'h': 0x2
}), Object['freeze']({
  'label': '2:3',
  'w': 0x2,
  'h': 0x3
}), Object["freeze"]({
  'label': '5:4',
  'w': 0x5,
  'h': 0x4
}), Object['freeze']({
  'label': "4:5",
  'w': 0x4,
  'h': 0x5
}), Object['freeze']({
  'label': "21:9",
  'w': 0x15,
  'h': 0x9
})]);
const PPIO_RATIO_LABEL_SET = new Set(PPIO_RATIO_OPTIONS["map"](_0x53d87a => _0x53d87a["label"]));
function normalizePpioQuality(_0x19d648) {
  const _0x7cb509 = String(_0x19d648 || '')['trim']()['toUpperCase']();
  return PPIO_QUALITY_PIXEL_MAP[_0x7cb509] ? _0x7cb509 : PPIO_DEFAULT_QUALITY;
}
function normalizePpioAspectRatioLabel(_0x50873b) {
  const _0x3f244f = String(_0x50873b || '')["trim"]();
  if (!_0x3f244f) {
    return PPIO_DEFAULT_RATIO;
  }
  const _0x51e92c = _0x3f244f["replace"](/[：∶]/g, ':')['replace'](/\s+/g, '');
  const _0x4e04d2 = _0x51e92c['toLowerCase']();
  if (_0x4e04d2 === "auto" || _0x4e04d2 === 'adaptive' || _0x51e92c === "自适应" || _0x51e92c === '默认') {
    return PPIO_DEFAULT_RATIO;
  }
  if (!_0x51e92c["includes"](':')) {
    return PPIO_DEFAULT_RATIO;
  }
  const [_0x3110f6, _0x2651f0] = _0x51e92c["split"](':');
  const _0x5e2434 = Number['parseFloat'](_0x3110f6);
  const _0x77056d = Number["parseFloat"](_0x2651f0);
  if (!(_0x5e2434 > 0x0 && _0x77056d > 0x0)) {
    return PPIO_DEFAULT_RATIO;
  }
  const _0x3c767b = pickClosestRatio(_0x5e2434, _0x77056d, PPIO_RATIO_OPTIONS);
  return PPIO_RATIO_LABEL_SET['has'](_0x3c767b) ? _0x3c767b : PPIO_DEFAULT_RATIO;
}
function calculatePpioSizeFromTargetPixels(_0x3241fc, _0x1c3f96) {
  const [_0x34c6fa, _0x1dfb2a] = String(_0x1c3f96 || PPIO_DEFAULT_RATIO)["split"](':');
  const _0xe9b4a = Number["parseFloat"](_0x34c6fa) || 0x1;
  const _0x38a779 = Number["parseFloat"](_0x1dfb2a) || 0x1;
  const _0x5bdd1f = Math["max"](PPIO_MIN_RATIO, Math["min"](PPIO_MAX_RATIO, _0xe9b4a / _0x38a779));
  const _0x3ed0b2 = Math["max"](PPIO_MIN_PIXELS, Math['min'](PPIO_MAX_PIXELS, Number(_0x3241fc) || PPIO_QUALITY_PIXEL_MAP['2K']));
  let _0x1cd4a4 = Math["round"](Math['sqrt'](_0x3ed0b2 / _0x5bdd1f));
  let _0x2c07c0 = Math['round'](_0x1cd4a4 * _0x5bdd1f);
  _0x2c07c0 = Math['max'](PPIO_ALIGN_STEP, Math["round"](_0x2c07c0 / PPIO_ALIGN_STEP) * PPIO_ALIGN_STEP);
  _0x1cd4a4 = Math["max"](PPIO_ALIGN_STEP, Math['round'](_0x1cd4a4 / PPIO_ALIGN_STEP) * PPIO_ALIGN_STEP);
  return _0x2c07c0 + 'x' + _0x1cd4a4;
}
function buildPpioSizeTable() {
  const _0x1e07b3 = Object["entries"](PPIO_QUALITY_PIXEL_MAP)["map"](([_0x577b34, _0x3593a0]) => {
    const _0x44b144 = PPIO_RATIO_OPTIONS["map"](_0x5e21b0 => [_0x5e21b0['label'], calculatePpioSizeFromTargetPixels(_0x3593a0, _0x5e21b0["label"])]);
    return [_0x577b34, Object["freeze"](Object["fromEntries"](_0x44b144))];
  });
  return Object["freeze"](Object['fromEntries'](_0x1e07b3));
}
const PPIO_SIZE_TABLE = buildPpioSizeTable();
function resolvePpioSize(_0xeea0ca, _0x371b9e) {
  const _0x3d3103 = normalizePpioQuality(_0xeea0ca);
  const _0x2849be = normalizePpioAspectRatioLabel(_0x371b9e);
  return PPIO_SIZE_TABLE?.[_0x3d3103]?.[_0x2849be] || PPIO_SIZE_TABLE?.[PPIO_DEFAULT_QUALITY]?.[PPIO_DEFAULT_RATIO] || PPIO_DEFAULT_SIZE;
}
async function buildPpioSeedreamRequest(_0x18da30, _0x170b07, _0x3b7a8f, _0x351b18, _0x1ff85d = {}) {
  const {
    imageField = "image",
    supportBatch = ![]
  } = _0x1ff85d;
  const _0x223390 = _0x351b18["getProviderConfig"]('ppio');
  const _0x3dbd7b = _0x223390["apiUrl"]["replace"](/\/+$/, '');
  const _0x3eda0a = _0x223390["apiKey"] || _0x170b07["apiKey"];
  if (!_0x3eda0a) {
    throw new Error("PPIO API Key 未配置，无法发起图像生成请求");
  }
  const _0x13d3c6 = await uploadModelApiMediaInputs('image', _0x170b07["inputUrls"], _0x351b18, {
    'strictUpload': !![],
    'uploadOptions': {
      'applyInputQualityProfile': !![]
    }
  });
  if (_0x170b07["inputUrls"]?.['length'] > 0x0 && _0x13d3c6["length"] === 0x0) {
    throw new Error('参考图片上传失败：未返回有效图片地址，已停止生成，请重试或重新选择图片');
  }
  const _0x39e60b = resolveProviderRatioPayload({
    'provider': 'ppio',
    'model': _0x170b07['model'],
    'ratioLabel': _0x170b07["resolvedRatioLabel"] || _0x170b07['aspectRatio'],
    'imageSize': _0x170b07["imageSize"],
    'suppressAspectRatio': _0x170b07["suppressAspectRatio"]
  });
  const _0x6be1bd = {
    'prompt': _0x3b7a8f,
    'watermark': ![],
    ...(!_0x170b07["suppressImageSize"] && {
      'size': resolvePpioSize(_0x170b07["imageSize"], _0x39e60b?.["resolvedRatioLabel"] || _0x170b07['aspectRatio'])
    })
  };
  _0x18da30 !== "4.0" && (_0x6be1bd["optimize_prompt_options"] = {
    'mode': "standard"
  });
  supportBatch && _0x170b07["batchSize"] && _0x170b07["batchSize"] > 0x1 && (_0x6be1bd["max_images"] = _0x170b07['batchSize']);
  _0x13d3c6['length'] > 0x0 && (_0x6be1bd[imageField] = _0x13d3c6);
  return {
    'url': "/api/v2/proxy/image",
    'headers': {
      'Content-Type': "application/json"
    },
    'body': {
      'apiUrl': _0x3dbd7b + "/v3/seedream-" + _0x18da30,
      'apiKey': _0x3eda0a,
      ..._0x6be1bd
    }
  };
}
export async function buildImageRequest(_0x24c0a0, _0x5ad585, _0x431a4a) {
  if (_0x24c0a0["model"] === "ppio/seedream-5.0-lite") {
    return buildPpioSeedreamRequest("5.0-lite", _0x24c0a0, _0x5ad585, _0x431a4a, {
      'imageField': "image"
    });
  }
  if (_0x24c0a0["model"] === "ppio/seedream-4.5") {
    return buildPpioSeedreamRequest('4.5', _0x24c0a0, _0x5ad585, _0x431a4a, {
      'imageField': "image"
    });
  }
  if (_0x24c0a0["model"] === "ppio/seedream-4.0") {
    return buildPpioSeedreamRequest("4.0", _0x24c0a0, _0x5ad585, _0x431a4a, {
      'imageField': 'images',
      'supportBatch': !![]
    });
  }
  throw new Error('PPIO\x20暂不支持模型\x20' + (_0x24c0a0["model"] || '(未指定)'));
}
export function getTextProxyApiUrl(_0x4bbd2e) {
  return _0x4bbd2e + '/openai/v1';
}