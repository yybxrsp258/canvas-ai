import { resolveProviderRatioPayload } from '../imageRatioPolicy.js';
import { applyApimartPrivateAvatarAssetsToUrls, isApimartSeedance2PrivateAvatarModel } from './apimartPrivateAvatarAssetResolver.js';
import { normalizeApimartBaseUrl } from '../apimartUploadApi.js';
import { uploadModelApiMediaInputs } from '../mediaInputUploadRouter.js';
const APIMART_DIMENSION_TARGET_PIXELS = Object["freeze"]({
  '1K': 0x400 * 0x400,
  '2K': 0x800 * 0x800,
  '3K': 0xa00 * 0xa00,
  '4K': 0xb40 * 0xb40
});
const APIMART_DIMENSION_DEFAULT_RESOLUTION = '2K';
const APIMART_DIMENSION_ALIGN = 0x8;
const APIMART_DIMENSION_MIN = 0x200;
const APIMART_DIMENSION_MAX = 0x2000;
function parseRatioLabel(_0x2e60eb) {
  const [_0x1672a6, _0x16e069] = String(_0x2e60eb || '1:1')["split"](':');
  const _0x38f682 = Number["parseFloat"](_0x1672a6);
  const _0x44120d = Number["parseFloat"](_0x16e069);
  if (!(_0x38f682 > 0x0 && _0x44120d > 0x0)) {
    return {
      'w': 0x1,
      'h': 0x1
    };
  }
  return {
    'w': _0x38f682,
    'h': _0x44120d
  };
}
function alignDimension(_0x4cf232) {
  const _0xf0fd98 = Math["round"](Number(_0x4cf232 || 0x0) / APIMART_DIMENSION_ALIGN) * APIMART_DIMENSION_ALIGN;
  return Math["max"](APIMART_DIMENSION_MIN, Math["min"](APIMART_DIMENSION_MAX, _0xf0fd98));
}
function resolveDimensionsByResolutionAndRatio(_0x50e256, _0x124515) {
  const _0x477a8d = String(_0x50e256 || '')['trim']()['toUpperCase']();
  const _0x84baf9 = APIMART_DIMENSION_TARGET_PIXELS[_0x477a8d] || APIMART_DIMENSION_TARGET_PIXELS[APIMART_DIMENSION_DEFAULT_RESOLUTION];
  const {
    w: _0x349863,
    h: _0x54e0a1
  } = parseRatioLabel(_0x124515);
  const _0x344cea = _0x349863 / _0x54e0a1;
  const _0x4d7a51 = Math["sqrt"](_0x84baf9 / _0x344cea);
  const _0x11e113 = _0x4d7a51 * _0x344cea;
  return {
    'width': alignDimension(_0x11e113),
    'height': alignDimension(_0x4d7a51)
  };
}
function isApimartGptImage2Model(_0x3d31c5) {
  const _0x51cdc3 = String(_0x3d31c5 || '')["trim"]()["toLowerCase"]();
  return _0x51cdc3 === "apimart/gpt-image-2" || _0x51cdc3 === 'gpt-image-2';
}
function isApimartSeedanceVideoModel(_0x174820) {
  return String(_0x174820 || '')["trim"]()["replace"](/^apimart\//, '')["startsWith"]('doubao-seedance-');
}
function normalizeSeedanceVideoSize(_0x3b8e4c) {
  const _0x4decbe = String(_0x3b8e4c || '')['trim']();
  if (!_0x4decbe) {
    return "16:9";
  }
  if (_0x4decbe === "自适应" || _0x4decbe["toLowerCase"]() === "auto") {
    return "adaptive";
  }
  if (_0x4decbe === "1:1" || _0x4decbe === "3:4" || _0x4decbe === '16:9' || _0x4decbe === "4:3" || _0x4decbe === "9:16" || _0x4decbe === "21:9" || _0x4decbe === "adaptive") {
    return _0x4decbe;
  }
  return "16:9";
}
function normalizeSeedanceAspectRatio(_0x1b6d9b) {
  const _0x510f83 = String(_0x1b6d9b || '')["trim"]();
  if (_0x510f83 === "1:1" || _0x510f83 === "3:4" || _0x510f83 === "16:9" || _0x510f83 === "4:3" || _0x510f83 === '9:16' || _0x510f83 === "21:9") {
    return _0x510f83;
  }
  return "16:9";
}
function isPresentValue(_0x46ba20) {
  return _0x46ba20 !== undefined && _0x46ba20 !== null && String(_0x46ba20)["trim"]() !== '';
}
function normalizeGptImage2Resolution(_0x441457) {
  const _0x58903b = String(_0x441457 || '')['trim']()["toUpperCase"]();
  if (_0x58903b === '1K' || _0x58903b === '2K' || _0x58903b === '4K') {
    return _0x58903b["toLowerCase"]();
  }
  return '2k';
}
export function normalizeTextModel(_0x492640) {
  if (String(_0x492640 || '')["startsWith"]("apimart/")) {
    return String(_0x492640)['replace'](/^apimart\//, '');
  }
  return _0x492640;
}
export function getTextProxyApiUrl(_0x552aa0) {
  return _0x552aa0 + "/v1/chat/completions";
}
export async function buildImageRequest(_0x29f972, _0x3c5cc6, _0x173799) {
  if (!_0x29f972["model"]) {
    throw new Error("未指定模型，无法发起图像生成请求");
  }
  const _0xa35c49 = _0x173799["getProviderConfig"]('apimart');
  const _0x4bc106 = normalizeApimartBaseUrl(_0xa35c49["apiUrl"]);
  const _0x355c16 = _0xa35c49["apiKey"] || _0x29f972["apiKey"];
  if (!_0x355c16) {
    throw new Error("API Key 未配置，无法发起图像生成请求");
  }
  const _0x36cb3f = await uploadModelApiMediaInputs('image', _0x29f972["inputUrls"], _0x173799, {
    'apiKey': _0x355c16,
    'apiUrl': _0x4bc106,
    'fallbackProvider': "apimart",
    'uploadOptions': {
      'applyInputQualityProfile': !![]
    },
    'strictUpload': !![]
  });
  const _0x5508be = {
    'apimart/nano-banana-2': "gemini-3.1-flash-image-preview",
    'apimart/nano-banana-pro': "gemini-3-pro-image-preview",
    'apimart/nano-banana-dot': "gemini-2.5-flash-image-preview",
    'apimart/gpt-image-2': "gpt-image-2",
    'apimart/seedream-5.0-lite': "doubao-seedream-5-0-lite",
    'apimart/seedream-4.5': "doubao-seedance-4-5",
    'apimart/seedream-4.0': 'doubao-seedance-4-0'
  };
  const _0x54f2b3 = _0x5508be[_0x29f972["model"]] || _0x29f972['model']["replace"]("apimart/", '');
  const _0x5e1f62 = _0x29f972["model"] === "apimart/seedream-4.0" || _0x29f972["model"] === "apimart/seedream-4.5" || _0x29f972["model"] === 'apimart/seedream-5.0-lite';
  let _0x15e954 = _0x29f972["imageSize"] || '2K';
  (_0x29f972["model"] === "apimart/seedream-4.5" || _0x29f972['model'] === "apimart/seedream-5.0-lite") && _0x15e954 === '1K' && (_0x15e954 = '2K');
  _0x29f972["model"] === "apimart/seedream-5.0-lite" && _0x15e954 === '4K' && (_0x15e954 = '3K');
  isApimartGptImage2Model(_0x29f972['model']) && (_0x15e954 = normalizeGptImage2Resolution(_0x15e954));
  const _0x38c88a = resolveProviderRatioPayload({
    'provider': "apimart",
    'model': _0x29f972["model"],
    'ratioLabel': _0x29f972["resolvedRatioLabel"] || _0x29f972['aspectRatio'],
    'imageSize': _0x15e954,
    'suppressAspectRatio': _0x29f972["suppressAspectRatio"]
  });
  const _0x2b9a1a = {
    'model': _0x54f2b3,
    'prompt': _0x3c5cc6,
    'n': 0x1,
    ...(!_0x5e1f62 && {
      'resolution': _0x15e954
    })
  };
  if (!_0x29f972['suppressAspectRatio'] && _0x38c88a?.['params']?.["size"]) {
    if (_0x5e1f62) {
      const _0x3a2e90 = resolveDimensionsByResolutionAndRatio(_0x15e954, _0x38c88a["params"]["size"]);
      _0x2b9a1a["width"] = _0x3a2e90['width'];
      _0x2b9a1a['height'] = _0x3a2e90["height"];
    } else {
      _0x2b9a1a["size"] = _0x38c88a["params"]["size"];
    }
  }
  _0x36cb3f["length"] > 0x0 && (_0x2b9a1a['image_urls'] = _0x36cb3f);
  return {
    'url': "/api/v2/proxy/image",
    'headers': {
      'Content-Type': "application/json"
    },
    'body': {
      'apiUrl': _0x4bc106 + '/v1/images/generations',
      'apiKey': _0x355c16,
      ..._0x2b9a1a
    }
  };
}
export async function buildVideoRequest(_0x4da4c9, _0x246e02, _0x5420f4) {
  if (!_0x4da4c9["model"]) {
    throw new Error('未指定视频模型，无法发起视频生成请求');
  }
  const _0x3c9ef8 = _0x5420f4["getProviderConfig"]("apimart");
  const _0x45bb80 = normalizeApimartBaseUrl(_0x3c9ef8["apiUrl"]);
  const _0x156046 = _0x3c9ef8["apiKey"] || _0x4da4c9['apiKey'];
  if (!_0x156046) {
    throw new Error("API Key 未配置（厂商：Apimart），无法发起视频生成请求");
  }
  const _0x43a2e5 = {
    'apimart/luma-ray-v2': "luma-ray-v2",
    'apimart/kling-v1-5': 'kling-v1-5-gen-video',
    'apimart/happyhorse-1.0': "happyhorse-1.0",
    'apimart/doubao-seedance-2.0-fast': 'doubao-seedance-2.0-fast',
    'apimart/doubao-seedance-2.0': "doubao-seedance-2.0",
    'apimart/doubao-seedance-2.0-fast-face': "doubao-seedance-2.0-fast-face",
    'apimart/doubao-seedance-2.0-face': 'doubao-seedance-2.0-face',
    'apimart/doubao-seedance-1-5-pro': "doubao-seedance-1-5-pro",
    'apimart/doubao-seedance-1-0-pro-fast': 'doubao-seedance-1-0-pro-fast',
    'apimart/doubao-seedance-1-0-pro-quality': "doubao-seedance-1-0-pro-quality"
  };
  const _0x5c1c07 = _0x43a2e5[_0x4da4c9["model"]] || _0x4da4c9["model"]["replace"]("apimart/", '');
  const _0x15e197 = isApimartSeedanceVideoModel(_0x5c1c07);
  const _0x3c3687 = _0x5c1c07['startsWith']('doubao-seedance-2.0');
  const _0x287455 = isApimartSeedance2PrivateAvatarModel(_0x5c1c07);
  const _0x4d145c = _0x5c1c07 === "doubao-seedance-1-5-pro";
  const _0x3ef222 = _0x5c1c07["startsWith"]("doubao-seedance-1-0-pro-");
  const _0xc53814 = _0x5c1c07 === "doubao-seedance-1-0-pro-fast";
  const _0x5e4949 = [];
  if (Array['isArray'](_0x4da4c9["videos"])) {
    _0x5e4949["push"](..._0x4da4c9["videos"]);
  }
  if (Array["isArray"](_0x4da4c9["videoUrls"])) {
    _0x5e4949["push"](..._0x4da4c9["videoUrls"]);
  }
  const _0x52f616 = String(_0x4da4c9["videoUrl"] || '')["trim"]();
  if (_0x52f616) {
    _0x5e4949["unshift"](_0x52f616);
  }
  const _0x5268b4 = applyApimartPrivateAvatarAssetsToUrls(Array["from"](new Set(_0x5e4949["map"](_0x11153d => String(_0x11153d || '')["trim"]())["filter"](Boolean))), _0x4da4c9, {
    'sourceKind': "video",
    'enabled': _0x287455
  });
  if (_0x15e197 && !_0x3c3687 && _0x5268b4["length"] > 0x0) {
    throw new Error("该 APIMart Seedance 模型暂不支持视频参考");
  }
  const _0x503e00 = _0x5268b4['length'] > 0x0 && (!_0x15e197 || _0x3c3687) && _0x5420f4["processInputVideos"] ? await uploadModelApiMediaInputs("video", _0x5268b4, _0x5420f4, {
    'fallbackProvider': "runninghub",
    'strictUpload': !![]
  }) : [];
  if (_0x5268b4["length"] > 0x0 && _0x503e00["length"] <= 0x0) {
    throw new Error("APIMART 源视频上传失败：" + (typeof _0x5420f4["processInputVideos"] !== 'function' ? "缺少视频上传能力，请更新应用" : "未返回有效视频地址，请重试或重新选择视频"));
  }
  const _0x4326ba = applyApimartPrivateAvatarAssetsToUrls([String(_0x4da4c9["first"] || _0x4da4c9["firstFrameUrl"] || '')['trim'](), String(_0x4da4c9['last'] || _0x4da4c9["lastFrameUrl"] || '')['trim']()]['filter'](Boolean), _0x4da4c9, {
    'sourceKind': "image",
    'enabled': _0x287455
  });
  let _0x53a171 = [];
  if (_0xc53814 && _0x4326ba["length"] > 0x1) {
    throw new Error('Seedance\x201.0\x20Pro\x20Fast\x20不支持尾帧图，请切换\x20Quality\x20模型');
  }
  if (_0x15e197 && _0x4326ba['length'] > 0x0 && _0x5420f4["processInputImages"]) {
    const _0x5754ef = await uploadModelApiMediaInputs("image", _0x4326ba, _0x5420f4, {
      'apiKey': _0x156046,
      'apiUrl': _0x45bb80,
      'fallbackProvider': 'apimart',
      'uploadOptions': {
        'applyInputQualityProfile': !![]
      },
      'strictUpload': !![]
    });
    const _0x92fd7 = String(_0x5754ef?.[0x0] || '')['trim']();
    const _0x159413 = String(_0x5754ef?.[0x1] || '')["trim"]();
    _0x53a171 = [_0x92fd7 ? {
      'url': _0x92fd7,
      'role': "first_frame"
    } : null, _0x159413 ? {
      'url': _0x159413,
      'role': 'last_frame'
    } : null]["filter"](Boolean);
  }
  const _0x754a19 = Array["isArray"](_0x4da4c9["images"]) ? _0x4da4c9['images'] : Array["isArray"](_0x4da4c9["inputUrls"]) ? _0x4da4c9["inputUrls"] : [];
  const _0x432ab3 = applyApimartPrivateAvatarAssetsToUrls(_0x754a19, _0x4da4c9, {
    'sourceKind': "image",
    'enabled': _0x287455
  });
  const _0x117b94 = _0x15e197 && _0x53a171["length"] <= 0x0;
  const _0x452792 = _0x117b94 && _0x432ab3["length"] > 0x0 && _0x5420f4["processInputImages"] ? await uploadModelApiMediaInputs('image', _0x432ab3, _0x5420f4, {
    'apiKey': _0x156046,
    'apiUrl': _0x45bb80,
    'fallbackProvider': 'apimart',
    'uploadOptions': {
      'applyInputQualityProfile': !![]
    },
    'strictUpload': !![]
  }) : [];
  const _0x38ad59 = [];
  if (Array['isArray'](_0x4da4c9["audios"])) {
    _0x38ad59["push"](..._0x4da4c9["audios"]);
  }
  if (Array['isArray'](_0x4da4c9['audioUrls'])) {
    _0x38ad59['push'](..._0x4da4c9["audioUrls"]);
  }
  const _0x18fedc = String(_0x4da4c9["audioUrl"] || '')['trim']();
  if (_0x18fedc) {
    _0x38ad59['unshift'](_0x18fedc);
  }
  const _0x254989 = applyApimartPrivateAvatarAssetsToUrls(Array['from'](new Set(_0x38ad59['map'](_0x94bd4a => String(_0x94bd4a || '')["trim"]())["filter"](Boolean))), _0x4da4c9, {
    'sourceKind': "audio",
    'enabled': _0x287455
  });
  if (_0x15e197 && !_0x3c3687 && _0x254989["length"] > 0x0) {
    throw new Error("该 APIMart Seedance 模型暂不支持音频参考");
  }
  const _0x2ab539 = _0x3c3687 && _0x254989["length"] > 0x0 && _0x5420f4["processInputAudios"] ? await uploadModelApiMediaInputs("audio", _0x254989, _0x5420f4, {
    'fallbackProvider': "runninghub",
    'strictUpload': !![]
  }) : [];
  if (_0x15e197 && _0x254989["length"] > 0x0 && _0x2ab539["length"] <= 0x0) {
    throw new Error("APIMART 源音频上传失败：" + (typeof _0x5420f4["processInputAudios"] !== "function" ? '缺少音频上传能力，请更新应用' : "未返回有效音频地址，请重试或重新选择音频"));
  }
  if (_0x15e197) {
    const _0x17be3b = {
      'model': _0x5c1c07,
      'prompt': _0x246e02,
      'duration': _0x4da4c9["duration"] || 0x5,
      'resolution': _0x4da4c9["resolution"] || (_0x3ef222 ? "1080p" : "720p")
    };
    _0x3c3687 ? _0x17be3b["size"] = normalizeSeedanceVideoSize(_0x4da4c9['aspectRatio'] || _0x4da4c9["size"]) : _0x17be3b["aspect_ratio"] = normalizeSeedanceAspectRatio(_0x4da4c9["aspectRatio"] || _0x4da4c9['aspect_ratio']);
    if (isPresentValue(_0x4da4c9["seed"])) {
      _0x17be3b["seed"] = _0x4da4c9["seed"];
    }
    _0x4d145c && (_0x4da4c9["audio"] === !![] || _0x4da4c9["generateAudio"] === !![]) && (_0x17be3b['audio'] = !![]);
    _0x4d145c && _0x4da4c9['camerafixed'] === !![] && (_0x17be3b["camerafixed"] = !![]);
    if (_0x53a171['length'] > 0x0) {
      _0x17be3b["image_with_roles"] = _0x53a171;
    } else {
      if (_0x452792["length"] > 0x0) {
        const _0x3cf0c1 = _0x3c3687 ? 0x9 : _0x4d145c ? 0x2 : 0x1;
        _0x17be3b["image_urls"] = _0x452792['slice'](0x0, _0x3cf0c1);
      }
    }
    _0x3c3687 && _0x53a171["length"] <= 0x0 && _0x503e00["length"] > 0x0 && (_0x17be3b["video_urls"] = _0x503e00["slice"](0x0, 0x3));
    _0x3c3687 && _0x53a171["length"] <= 0x0 && _0x2ab539['length'] > 0x0 && (_0x17be3b["audio_urls"] = _0x2ab539["slice"](0x0, 0x3));
    return {
      'url': "/api/v2/proxy/image",
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': {
        'apiUrl': _0x45bb80 + "/v1/videos/generations",
        'apiKey': _0x156046,
        ..._0x17be3b
      }
    };
  }
  let _0x2745bb = '';
  if (_0x503e00["length"] > 0x0) {
    _0x2745bb = String(_0x503e00[0x0] || '')['trim']();
  } else {
    if (_0x52f616 && _0x5420f4["processInputVideos"]) {
      const _0x27d389 = await uploadModelApiMediaInputs("video", [_0x52f616], _0x5420f4, {
        'fallbackProvider': "runninghub",
        'strictUpload': !![]
      });
      _0x2745bb = String(_0x27d389?.[0x0] || '')['trim']();
      if (!_0x2745bb) {
        throw new Error("APIMART 源视频上传失败：未返回有效视频地址，请重试或重新选择视频");
      }
    }
  }
  const _0x17f907 = _0x4da4c9["inputUrls"] && _0x4da4c9['inputUrls']['length'] > 0x0 && _0x5420f4["processInputImages"] ? await uploadModelApiMediaInputs("image", _0x4da4c9["inputUrls"], _0x5420f4, {
    'apiKey': _0x156046,
    'apiUrl': _0x45bb80,
    'fallbackProvider': 'apimart',
    'uploadOptions': {
      'applyInputQualityProfile': !![]
    },
    'strictUpload': !![]
  }) : [];
  const _0x57bd5d = {
    'model': _0x5c1c07,
    'prompt': _0x246e02,
    'size': _0x4da4c9["aspectRatio"] || "16:9",
    'quality': _0x4da4c9["videoSize"] || "standard"
  };
  if (_0x4da4c9["duration"]) {
    _0x57bd5d["duration"] = _0x4da4c9["duration"];
  }
  if (_0x4da4c9["resolution"]) {
    _0x57bd5d['resolution'] = _0x4da4c9['resolution'];
  }
  if (_0x2745bb) {
    _0x57bd5d["video_url"] = _0x2745bb;
  }
  if (_0x17f907["length"] > 0x0) {
    _0x57bd5d['image_urls'] = _0x17f907;
  }
  return {
    'url': '/api/v2/proxy/image',
    'headers': {
      'Content-Type': "application/json"
    },
    'body': {
      'apiUrl': _0x45bb80 + "/v1/videos/generations",
      'apiKey': _0x156046,
      ..._0x57bd5d
    }
  };
}