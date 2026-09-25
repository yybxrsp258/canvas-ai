import { resolveRunningHubHailuoH3OmniPayload } from './runningHubHailuoH3OmniResolver.js';
import { resolveRunningHubHailuoH3AudioDrivenPayload } from './runningHubHailuoH3AudioDrivenResolver.js';
import { normalizeRunningHubInstanceType } from '../../../src/modules/runningHubInstanceTypes.js';
const VIDEO_MATTING_MAX_SOURCE_VIDEO_BYTES = 0x1e * 0x400 * 0x400;
const VIDEO_MATTING_SOURCE_VIDEO_TOO_LARGE_MESSAGE = '裁剪后视频仍超过\x2030MB，请继续裁剪或压缩';
const RUNNINGHUB_WORKFLOW_PAYLOAD_RESOLVERS = Object["freeze"]({
  'runninghubVideoV54': resolveRunningHubVideoV54Payload,
  'runninghubBerniniVideoReplaceV1': resolveRunningHubBerniniVideoReplaceV1Payload,
  'runninghubLtx23FullVideo': resolveRunningHubLtx23FullVideoPayload,
  'runninghubWan22Video': resolveRunningHubWan22VideoPayload,
  'runninghubVideoMatting': resolveRunningHubVideoMattingPayload,
  'runninghubHailuoH3AudioDriven': resolveRunningHubHailuoH3AudioDrivenPayload,
  'runninghubHailuoH3Omni': resolveRunningHubHailuoH3OmniPayload
});
const RH_WAN22_RATIO_PAIRS = Object['freeze']({
  '9:16': Object["freeze"]({
    'widthRatio': 0x9,
    'heightRatio': 0x10
  }),
  '16:9': Object['freeze']({
    'widthRatio': 0x10,
    'heightRatio': 0x9
  }),
  '1:1': Object["freeze"]({
    'widthRatio': 0x1,
    'heightRatio': 0x1
  }),
  '4:3': Object['freeze']({
    'widthRatio': 0x4,
    'heightRatio': 0x3
  }),
  '3:4': Object['freeze']({
    'widthRatio': 0x3,
    'heightRatio': 0x4
  }),
  '3:2': Object["freeze"]({
    'widthRatio': 0x3,
    'heightRatio': 0x2
  }),
  '2:3': Object["freeze"]({
    'widthRatio': 0x2,
    'heightRatio': 0x3
  }),
  '21:9': Object['freeze']({
    'widthRatio': 0x15,
    'heightRatio': 0x9
  }),
  '9:21': Object['freeze']({
    'widthRatio': 0x9,
    'heightRatio': 0x15
  }),
  '5:4': Object['freeze']({
    'widthRatio': 0x5,
    'heightRatio': 0x4
  }),
  '4:5': Object['freeze']({
    'widthRatio': 0x4,
    'heightRatio': 0x5
  }),
  '2:1': Object["freeze"]({
    'widthRatio': 0x2,
    'heightRatio': 0x1
  }),
  '1:2': Object["freeze"]({
    'widthRatio': 0x1,
    'heightRatio': 0x2
  })
});
const RH_WAN22_RESOLUTION_OPTIONS = Object["freeze"]([0x340, 0x400, 0x500, 0x5a0]);
const RH_LTX23_RESOLUTION_OPTIONS = Object['freeze']([0x400, 0x500, 0x5a0, 0x640, 0x780]);
const RH_LTX23_FPS_OPTIONS = Object["freeze"]([0x10, 0x18, 0x1e]);
const RH_VIDEO_WORKFLOW_DEFAULT_RATIO = "1:1";
export function getRunningHubWorkflowPayloadResolver(_0x3a3a96) {
  const _0x1e3f97 = String(_0x3a3a96 || '')['trim']();
  return RUNNINGHUB_WORKFLOW_PAYLOAD_RESOLVERS[_0x1e3f97] || null;
}
async function resolveRunningHubVideoV54Payload({
  executionManifest: _0x540128,
  payload: _0x359e49,
  finalPrompt: _0x2d7c5a,
  apiKey: _0x3d1a35,
  ctx: _0x236d2f,
  helpers: _0xa9ce98
}) {
  const _0x5e07a4 = _0x540128["mapping"] || {};
  const _0x4d449f = [];
  const {
    buildOpenApiVideoWorkflowRequest: _0xc88e3c,
    getMappedValue: _0x5f3c11,
    normalizeRhVideoResolution: _0x54f0fd,
    pushManifestNode: _0x2bfede,
    resolveRunningHubFirstImageInput: _0x471fbe,
    resolveRunningHubOptionalVideoInput: _0x279791,
    resolveRunningHubVideoInput: _0x3b916e,
    sourceVideoMissingMessage: _0x43d553,
    sourceVideoUploadFailedMessage: _0x5d12e2
  } = _0xa9ce98;
  const _0x5db02b = String(_0x2d7c5a || '')["trim"]() || "4K，高质量";
  _0x2bfede(_0x4d449f, _0x5e07a4['promptNode'], _0x5db02b);
  _0x2bfede(_0x4d449f, _0x5e07a4['characterIntegrationNode'], _0x359e49["characterIntegration"] === !![] ? "true" : 'false');
  const _0x935a9e = String(_0x359e49["controlMode"] || '')["trim"]();
  const _0x2db491 = _0x5f3c11(_0x935a9e, _0x5e07a4['controlModeNode'], '0');
  _0x2bfede(_0x4d449f, _0x5e07a4["controlModeNode"], _0x2db491);
  _0x2bfede(_0x4d449f, _0x5e07a4['resolutionNode'], _0x54f0fd(_0x359e49['rhVideoResolution'], _0x5e07a4["resolutionNode"]?.["defaultValue"]));
  const _0x549fca = Number(_0x359e49["frameRate"] ?? _0x359e49["rhVideoFps"] ?? _0x5e07a4["fpsNode"]?.["defaultValue"]);
  const _0x42b10f = Number['isFinite'](_0x549fca) ? Math['trunc'](_0x549fca) : 0x18;
  _0x2bfede(_0x4d449f, _0x5e07a4["fpsNode"], _0x42b10f);
  const _0x54056b = Number(_0x359e49["frameCount"] ?? _0x359e49["rhVideoFrames"] ?? _0x5e07a4["sourceVideoNode"]?.["frameCountDefaultValue"]);
  const _0x21429c = Number["isFinite"](_0x54056b) ? Math["max"](0x0, Math["trunc"](_0x54056b)) : 0x0;
  _0x2bfede(_0x4d449f, _0x5e07a4["sourceVideoNode"], _0x21429c, {
    'fieldName': _0x5e07a4["sourceVideoNode"]?.["frameCountFieldName"]
  });
  const _0x2270e5 = await _0x3b916e(_0x359e49, _0x3d1a35, {
    'missingMessage': _0x43d553,
    'uploadFailedMessage': _0x5d12e2
  });
  _0x2bfede(_0x4d449f, _0x5e07a4["sourceVideoNode"], _0x2270e5);
  const _0x3be86b = await _0x471fbe(_0x359e49, _0x3d1a35, _0x236d2f, {
    'required': !![],
    'missingMessage': "请接入参考图",
    'uploadFailedMessage': "参考图上传失败"
  });
  _0x3be86b && _0x2bfede(_0x4d449f, _0x5e07a4['refImageNode'], _0x3be86b);
  const _0x4f3a64 = await _0x279791(_0x359e49, _0x3d1a35, 'maskVideoUrl');
  _0x4f3a64 && _0x2bfede(_0x4d449f, _0x5e07a4["maskVideoNode"], _0x4f3a64);
  const _0x4f4898 = await _0x471fbe(_0x359e49, _0x3d1a35, _0x236d2f, {
    'field': "firstFrameUrl",
    'uploadFailedMessage': "首帧上传失败"
  });
  _0x4f4898 && (_0x2bfede(_0x4d449f, _0x5e07a4["firstFrameNode"], _0x4f4898), _0x2bfede(_0x4d449f, _0x5e07a4["firstFrameEnabledNode"], _0x5e07a4['firstFrameEnabledNode']?.['value'] ?? '1'));
  const _0x47ee08 = String(_0x359e49['specialMode'] || _0x359e49["rhSpecialMode"] || '');
  const _0x1fa95a = _0x47ee08 === "cameraMove";
  const _0x280c2c = !_0x1fa95a && _0x359e49["subtractSubject"] === !![];
  _0x280c2c && _0x2bfede(_0x4d449f, _0x5e07a4['subtractSubjectNode'], _0x5e07a4["subtractSubjectNode"]?.["value"] ?? "true");
  const _0x360134 = !_0x1fa95a && (_0x4f3a64 || _0x280c2c);
  if (_0x360134) {
    const _0x48abc4 = Number(_0x359e49['maskExpansion']);
    const _0x4adc65 = Number['isFinite'](_0x48abc4) ? _0x48abc4 : _0x5e07a4['maskExpansionNode']?.["defaultValue"] ?? 0x19;
    _0x2bfede(_0x4d449f, _0x5e07a4["maskExpansionNode"], _0x4adc65);
    _0x2bfede(_0x4d449f, _0x5e07a4["maskRectNode"], _0x359e49["maskRect"] === !![] ? _0x5e07a4['maskRectNode']?.["trueValue"] ?? '1' : _0x5e07a4["maskRectNode"]?.['falseValue'] ?? '0');
    _0x2bfede(_0x4d449f, _0x5e07a4['maskParamsEnabledNode'], _0x5e07a4["maskParamsEnabledNode"]?.['value'] ?? '1');
  }
  (_0x47ee08 === "longVideoOverlay" || _0x47ee08 === 'cameraMove') && _0x2bfede(_0x4d449f, _0x5e07a4["specialModeNode"], _0x5f3c11(_0x47ee08, _0x5e07a4["specialModeNode"], ''));
  _0x47ee08 === 'longVideoOverlay' && _0x2bfede(_0x4d449f, _0x5e07a4["longVideoOverlayNode"], _0x5e07a4["longVideoOverlayNode"]?.["value"] ?? '1');
  const _0xf7aa47 = Number(_0x359e49["breastJiggle"] ?? _0x359e49["rhBreastJiggle"] ?? 0x0);
  const _0x4d38ca = Number['isFinite'](_0xf7aa47) ? Math["max"](0x0, Math['min'](0x1, Math['round'](_0xf7aa47 * 0x14) / 0x14)) : 0x0;
  _0x4d38ca > 0x0 && (_0x2bfede(_0x4d449f, _0x5e07a4["breastJiggleNode"], Number(_0x4d38ca["toFixed"](0x2))), _0x2bfede(_0x4d449f, _0x5e07a4["breastJiggleEnabledNode"], _0x5e07a4['breastJiggleEnabledNode']?.["value"] ?? "true"));
  return _0xc88e3c({
    'executionManifest': _0x540128,
    'payload': _0x359e49,
    'apiKey': _0x3d1a35,
    'nodeInfoList': _0x4d449f
  });
}
function normalizeBerniniInputMode(_0x4b900f) {
  const _0x297d26 = String(_0x4b900f || '')['trim']();
  return ["none", "image", "video", "videoImage", "videoVideo"]["includes"](_0x297d26) ? _0x297d26 : 'none';
}
function resolveBerniniFunctionForMode(_0x448103, _0x46d2c9 = '') {
  const _0x276c11 = {
    'none': ["t2v"],
    'image': ['i2v', "r2v"],
    'video': ['v2v', "mv2v"],
    'videoImage': ["vi2v", "rv2v", "vrc2v"],
    'videoVideo': ["ads2v"]
  };
  const _0x2d31c1 = normalizeBerniniInputMode(_0x448103);
  const _0x5c4a75 = _0x276c11[_0x2d31c1] || _0x276c11["none"];
  const _0x448070 = String(_0x46d2c9 || '')["trim"]();
  return _0x5c4a75['includes'](_0x448070) ? _0x448070 : _0x5c4a75[0x0];
}
function resolveBerniniModeValue(_0x45883a, _0x4abfec = '') {
  const _0x3d9783 = {
    't2v': '0',
    'i2v': '1',
    'v2v': '2',
    'r2v': '3',
    'vi2v': '4',
    'rv2v': '5',
    'ads2v': '6',
    'vrc2v': '7',
    'mv2v': '8'
  };
  return _0x3d9783[resolveBerniniFunctionForMode(_0x45883a, _0x4abfec)] || '0';
}
function normalizeBerniniResolutionBase(_0x52f3a1) {
  const _0x5d5c6e = Number(_0x52f3a1);
  return [0x340, 0x400, 0x500, 0x5a0]['includes'](_0x5d5c6e) ? _0x5d5c6e : 0x400;
}
function parseBerniniAspectRatio(_0x3b736d) {
  const _0x3311fe = String(_0x3b736d || "16:9")['trim']();
  const _0x5e91f6 = _0x3311fe["toLowerCase"]();
  if (_0x3311fe === "自适应" || _0x5e91f6 === "auto" || _0x5e91f6 === "adaptive") {
    return {
      'widthRatio': 0x10,
      'heightRatio': 0x9
    };
  }
  const [_0x3eb686, _0x222387] = _0x3311fe["split"](':');
  const _0x3590ad = Number(_0x3eb686);
  const _0x3a8dbc = Number(_0x222387);
  if (_0x3590ad > 0x0 && _0x3a8dbc > 0x0) {
    return {
      'widthRatio': _0x3590ad,
      'heightRatio': _0x3a8dbc
    };
  }
  return {
    'widthRatio': 0x10,
    'heightRatio': 0x9
  };
}
function resolveBerniniAspectRatioValue(_0x418462 = {}) {
  const _0x40324c = _0x418462['rhBerniniAspectRatio'] ?? _0x418462["generationParams"]?.["rhBerniniAspectRatio"] ?? _0x418462["resolvedRatioLabel"] ?? _0x418462["aspectRatio"];
  const _0x5535e8 = String(_0x40324c || '')["trim"]();
  const _0x2dfdf8 = _0x5535e8["toLowerCase"]();
  if (_0x5535e8 === "自适应" || _0x2dfdf8 === "auto" || _0x2dfdf8 === "adaptive") {
    return _0x418462["resolvedRatioLabel"] || _0x418462['aspectRatio'] || "16:9";
  }
  return _0x40324c;
}
function roundBerniniDimensionToEight(_0x59c0a3) {
  return Math["max"](0x8, Math["round"](Number(_0x59c0a3 || 0x0) / 0x8) * 0x8);
}
function resolveBerniniDimensions({
  resolutionBase: _0x32576d,
  aspectRatio: _0x48320e
} = {}) {
  const _0x3b940a = normalizeBerniniResolutionBase(_0x32576d);
  const {
    widthRatio: _0xc8ae3a,
    heightRatio: _0x1f6efb
  } = parseBerniniAspectRatio(_0x48320e);
  if (_0xc8ae3a >= _0x1f6efb) {
    return {
      'width': _0x3b940a,
      'height': roundBerniniDimensionToEight(_0x3b940a * _0x1f6efb / _0xc8ae3a)
    };
  }
  return {
    'width': roundBerniniDimensionToEight(_0x3b940a * _0xc8ae3a / _0x1f6efb),
    'height': _0x3b940a
  };
}
async function resolveRunningHubBerniniVideoReplaceV1Payload({
  executionManifest: _0x24f768,
  payload: _0xcfbedc,
  finalPrompt: _0x342f4c,
  apiKey: _0x604d7b,
  ctx: _0xa77c2a,
  helpers: _0x48b25e
}) {
  const _0x49884a = _0x24f768["mapping"] || {};
  const _0x40d381 = [];
  const {
    buildOpenApiVideoWorkflowRequest: _0xcca89f,
    pushManifestNode: _0x423c03,
    resolveRunningHubFirstImageInput: _0x4aead1,
    resolveRunningHubOptionalVideoInput: _0x303ab5,
    resolveRunningHubVideoInput: _0x28b4c6
  } = _0x48b25e;
  let _0x3eadde = '';
  (String(_0xcfbedc["videoUrl"] || '')['trim']() || _0xcfbedc['videoFile']) && (_0x3eadde = await _0x28b4c6(_0xcfbedc, _0x604d7b, {
    'missingMessage': "请接入源视频",
    'uploadFailedMessage': '源视频上传失败'
  }));
  const _0x36f016 = await _0x4aead1(_0xcfbedc, _0x604d7b, _0xa77c2a, {
    'required': ![],
    'missingMessage': '请接入参考图像'
  });
  const _0x4b89ce = await _0x303ab5(_0xcfbedc, _0x604d7b, "referenceVideoUrl");
  const _0x19518c = _0x3eadde ? _0x4b89ce ? 'videoVideo' : _0x36f016 ? "videoImage" : "video" : _0x36f016 ? 'image' : "none";
  if (_0x4b89ce && !_0x3eadde) {
    throw new Error("参考视频需要同时接入源视频");
  }
  const _0x3a70d8 = resolveBerniniModeValue(_0x19518c, _0xcfbedc["rhBerniniFunction"] ?? _0xcfbedc['generationParams']?.['rhBerniniFunction']);
  const _0x3f366b = resolveBerniniDimensions({
    'resolutionBase': _0xcfbedc["rhVideoResolution"] ?? _0xcfbedc["generationParams"]?.["rhVideoResolution"] ?? _0xcfbedc['rhBerniniResolutionBase'] ?? _0xcfbedc["generationParams"]?.["rhBerniniResolutionBase"],
    'aspectRatio': resolveBerniniAspectRatioValue(_0xcfbedc)
  });
  _0x3eadde && _0x423c03(_0x40d381, _0x49884a["sourceVideoNode"], _0x3eadde);
  _0x36f016 && _0x19518c !== "videoVideo" && _0x423c03(_0x40d381, _0x49884a["refImageNode"], _0x36f016);
  _0x423c03(_0x40d381, _0x49884a["modeNode"], _0x3a70d8);
  const _0x12e950 = Number(_0xcfbedc["rhVideoFps"] ?? _0x49884a["fpsNode"]?.['value']);
  const _0x4686cd = Number["isFinite"](_0x12e950) ? Math["trunc"](_0x12e950) : 0x18;
  _0x423c03(_0x40d381, _0x49884a["fpsNode"], String(_0x4686cd));
  const _0x44e0a4 = Number(_0xcfbedc["rhVideoFrames"] ?? _0x49884a['framesNode']?.['value']);
  const _0x24f964 = Number['isFinite'](_0x44e0a4) ? Math['max'](0x0, Math['trunc'](_0x44e0a4)) : 0x0;
  _0x423c03(_0x40d381, _0x49884a["framesNode"], String(_0x24f964));
  _0x423c03(_0x40d381, _0x49884a['widthNode'], _0x3f366b["width"]);
  _0x423c03(_0x40d381, _0x49884a['heightNode'], _0x3f366b["height"]);
  _0x423c03(_0x40d381, _0x49884a['promptNode'], _0x342f4c || '');
  _0x19518c === "videoVideo" && _0x423c03(_0x40d381, _0x49884a["referenceVideoNode"], _0x4b89ce);
  return _0xcca89f({
    'executionManifest': _0x24f768,
    'payload': _0xcfbedc,
    'apiKey': _0x604d7b,
    'nodeInfoList': _0x40d381
  });
}
function getLtx23PayloadPathValue(_0x5002fb = {}, _0x49d48a = '') {
  const _0xc5e936 = String(_0x49d48a || '')["trim"]();
  if (!_0xc5e936) {
    return undefined;
  }
  return _0xc5e936["split"]('.')["reduce"]((_0x58fe09, _0x3a3c85) => {
    if (_0x58fe09 === undefined || _0x58fe09 === null) {
      return undefined;
    }
    return _0x58fe09[_0x3a3c85];
  }, _0x5002fb);
}
function hasLtx23InputValue(_0x5b3149) {
  if (_0x5b3149 === undefined || _0x5b3149 === null) {
    return ![];
  }
  if (typeof _0x5b3149 === 'string') {
    return _0x5b3149["trim"]() !== '';
  }
  if (Array["isArray"](_0x5b3149)) {
    return _0x5b3149["some"](_0x176c2e => hasLtx23InputValue(_0x176c2e));
  }
  return !![];
}
function resolveLtx23FirstPresentField(_0x315917 = {}, _0x50026c = []) {
  for (const _0x559b60 of _0x50026c) {
    const _0x2aa6f7 = getLtx23PayloadPathValue(_0x315917, _0x559b60);
    if (hasLtx23InputValue(_0x2aa6f7)) {
      return _0x2aa6f7;
    }
  }
  return undefined;
}
async function uploadLtx23OptionalImage({
  payload: _0x4b3633,
  apiKey: _0x1cefb5,
  ctx: _0x58612c,
  fields: _0x6d1d2e,
  rawValue: _0x584715
}) {
  const _0x26210a = _0x584715 !== undefined ? _0x584715 : resolveLtx23FirstPresentField(_0x4b3633, _0x6d1d2e);
  if (!hasLtx23InputValue(_0x26210a)) {
    return '';
  }
  const _0x509917 = _0x58612c?.["processInputImages"];
  if (typeof _0x509917 !== "function") {
    throw new Error('缺少\x20RunningHUB\x20图片上传能力');
  }
  const _0x3c299e = (Array['isArray'](_0x26210a) ? _0x26210a : [_0x26210a])["filter"](_0x146686 => hasLtx23InputValue(_0x146686));
  const _0x2089b1 = await _0x509917(_0x3c299e, _0x1cefb5, {
    'applyInputQualityProfile': !![],
    'provider': 'runninghub',
    'strictUpload': !![]
  });
  const _0x1d7c9d = String(_0x2089b1?.[0x0] || '')["trim"]();
  if (!_0x1d7c9d) {
    throw new Error("图片参考上传失败：未返回有效图片地址，请重试或重新选择图片");
  }
  return _0x1d7c9d;
}
async function uploadLtx23OptionalAudio({
  payload: _0x12354f,
  apiKey: _0x1aae75,
  helpers: _0x4b9ab7,
  rawValue: _0x306987
}) {
  const _0x199041 = getLtx23PayloadPathValue(_0x12354f, "audioFile");
  if (!hasLtx23InputValue(_0x306987) && !hasLtx23InputValue(_0x199041)) {
    return '';
  }
  const _0x491a2d = _0x4b9ab7?.["resolveRunningHubAudioInput"];
  if (typeof _0x491a2d !== "function") {
    throw new Error("缺少 RunningHUB 音频上传能力");
  }
  const _0x47e6fc = hasLtx23InputValue(_0x306987) ? {
    ..._0x12354f,
    'audioUrl': _0x306987
  } : _0x12354f;
  const _0x12d51f = await _0x491a2d(_0x47e6fc, _0x1aae75, {
    'required': !![],
    'missingMessage': "音频参考上传失败"
  });
  return String(_0x12d51f || '')['trim']();
}
function resolveLtx23AspectRatio(_0x28d576 = {}) {
  const _0x1f3fc0 = String(_0x28d576["rhLtx23AspectRatio"] ?? _0x28d576["generationParams"]?.["rhLtx23AspectRatio"] ?? _0x28d576['resolvedRatioLabel'] ?? _0x28d576["generationParams"]?.["resolvedRatioLabel"] ?? _0x28d576["aspectRatio"] ?? _0x28d576["generationParams"]?.['aspectRatio'] ?? RH_VIDEO_WORKFLOW_DEFAULT_RATIO)["trim"]();
  const _0x3bd89d = _0x1f3fc0["toLowerCase"]();
  const _0x201197 = _0x1f3fc0 === "自适应" || _0x3bd89d === "auto" || _0x3bd89d === 'adaptive' ? String(_0x28d576['resolvedRatioLabel'] || _0x28d576["generationParams"]?.["resolvedRatioLabel"] || _0x28d576["aspectRatio"] || _0x28d576["generationParams"]?.["aspectRatio"] || RH_VIDEO_WORKFLOW_DEFAULT_RATIO)["trim"]() : _0x1f3fc0;
  return RH_WAN22_RATIO_PAIRS[_0x201197] ? _0x201197 : RH_VIDEO_WORKFLOW_DEFAULT_RATIO;
}
function resolveLtx23Resolution(_0x10080 = {}) {
  const _0x30680b = Number(_0x10080["rhVideoResolution"] ?? _0x10080['generationParams']?.["rhVideoResolution"] ?? 0x500);
  return RH_LTX23_RESOLUTION_OPTIONS["includes"](_0x30680b) ? _0x30680b : 0x500;
}
function resolveLtx23Dimensions(_0x1ed09e = {}) {
  const {
    widthRatio: _0x1d0488,
    heightRatio: _0x1219a9
  } = RH_WAN22_RATIO_PAIRS[resolveLtx23AspectRatio(_0x1ed09e)] || RH_WAN22_RATIO_PAIRS[RH_VIDEO_WORKFLOW_DEFAULT_RATIO];
  const _0x5d146d = resolveLtx23Resolution(_0x1ed09e);
  if (_0x1d0488 === _0x1219a9) {
    return {
      'width': _0x5d146d,
      'height': _0x5d146d
    };
  }
  if (_0x1d0488 > _0x1219a9) {
    return {
      'width': _0x5d146d,
      'height': ceilWan22DimensionToSixteen(_0x5d146d * _0x1219a9 / _0x1d0488)
    };
  }
  return {
    'width': ceilWan22DimensionToSixteen(_0x5d146d * _0x1d0488 / _0x1219a9),
    'height': _0x5d146d
  };
}
function resolveLtx23Seconds(_0x1a3a92 = {}, _0x15c401 = {}) {
  const _0x351e2f = Number(_0x1a3a92["rhVideoSeconds"] ?? _0x1a3a92["generationParams"]?.['rhVideoSeconds'] ?? _0x15c401["secondsNode"]?.["defaultValue"] ?? 0x8);
  return Number["isFinite"](_0x351e2f) ? Math["max"](0x1, Math["trunc"](_0x351e2f)) : 0x8;
}
function resolveLtx23Fps(_0x4d2f64 = {}, _0x4aada9 = {}) {
  const _0x127627 = Number(_0x4d2f64["rhVideoFps"] ?? _0x4d2f64["generationParams"]?.["rhVideoFps"] ?? _0x4aada9["fpsNode"]?.["defaultValue"] ?? 0x18);
  return RH_LTX23_FPS_OPTIONS["includes"](_0x127627) ? _0x127627 : 0x18;
}
async function resolveRunningHubLtx23FullVideoPayload({
  executionManifest: _0x4ef3cd,
  payload: _0x3be8a9,
  finalPrompt: _0x1d47f3,
  apiKey: _0xec2522,
  ctx: _0x37e3af,
  helpers: _0xa7a827
}) {
  const _0x5d243c = _0x4ef3cd['mapping'] || {};
  const _0x4d28c2 = [];
  const {
    buildOpenApiVideoWorkflowRequest: _0x502fa6,
    pushManifestNode: _0x17eb17
  } = _0xa7a827;
  const _0x1ef83c = ["refImageUrl", "refImage", "imageUrl", "inputUrls.0"];
  const _0x188203 = ["audioUrl", "audio", "inputAudios.0"];
  const _0x36a617 = resolveLtx23FirstPresentField(_0x3be8a9, _0x1ef83c);
  const _0x323971 = resolveLtx23FirstPresentField(_0x3be8a9, _0x188203);
  const _0x559991 = await uploadLtx23OptionalImage({
    'payload': _0x3be8a9,
    'apiKey': _0xec2522,
    'ctx': _0x37e3af,
    'fields': _0x1ef83c,
    'rawValue': _0x36a617
  });
  const _0x238bea = await uploadLtx23OptionalAudio({
    'payload': _0x3be8a9,
    'apiKey': _0xec2522,
    'helpers': _0xa7a827,
    'rawValue': _0x323971
  });
  _0x559991 && _0x17eb17(_0x4d28c2, _0x5d243c["imageNode"], _0x559991);
  _0x238bea && _0x17eb17(_0x4d28c2, _0x5d243c["audioNode"], _0x238bea);
  const _0x3a732a = resolveLtx23Dimensions(_0x3be8a9);
  _0x17eb17(_0x4d28c2, _0x5d243c['textToVideoNode'], _0x559991 ? "false" : "true");
  _0x17eb17(_0x4d28c2, _0x5d243c["customAudioNode"], _0x238bea ? "true" : "false");
  _0x17eb17(_0x4d28c2, _0x5d243c['secondsNode'], resolveLtx23Seconds(_0x3be8a9, _0x5d243c));
  _0x17eb17(_0x4d28c2, _0x5d243c["widthNode"], _0x3a732a['width']);
  _0x17eb17(_0x4d28c2, _0x5d243c['heightNode'], _0x3a732a["height"]);
  _0x17eb17(_0x4d28c2, _0x5d243c["fpsNode"], resolveLtx23Fps(_0x3be8a9, _0x5d243c));
  _0x17eb17(_0x4d28c2, _0x5d243c['promptNode'], _0x1d47f3 || '');
  return _0x502fa6({
    'executionManifest': _0x4ef3cd,
    'payload': _0x3be8a9,
    'apiKey': _0xec2522,
    'nodeInfoList': _0x4d28c2
  });
}
function getWan22PayloadPathValue(_0x2c2a5b = {}, _0x929baf = '') {
  const _0x39bbef = String(_0x929baf || '')["trim"]();
  if (!_0x39bbef) {
    return undefined;
  }
  return _0x39bbef["split"]('.')["reduce"]((_0x3e89d0, _0x1d8d6a) => {
    if (_0x3e89d0 === undefined || _0x3e89d0 === null) {
      return undefined;
    }
    return _0x3e89d0[_0x1d8d6a];
  }, _0x2c2a5b);
}
function hasWan22InputValue(_0x56bbb7) {
  if (_0x56bbb7 === undefined || _0x56bbb7 === null) {
    return ![];
  }
  if (typeof _0x56bbb7 === 'string') {
    return _0x56bbb7["trim"]() !== '';
  }
  if (Array["isArray"](_0x56bbb7)) {
    return _0x56bbb7['some'](_0x3d4395 => hasWan22InputValue(_0x3d4395));
  }
  return !![];
}
function resolveWan22FirstPresentField(_0x18d84f = {}, _0x4c36b3 = []) {
  for (const _0x3f47d8 of _0x4c36b3) {
    const _0x36035b = getWan22PayloadPathValue(_0x18d84f, _0x3f47d8);
    if (hasWan22InputValue(_0x36035b)) {
      return _0x36035b;
    }
  }
  return undefined;
}
async function uploadWan22OptionalImage({
  payload: _0x1e5d16,
  apiKey: _0x132582,
  ctx: _0x576d8f,
  fields: _0x86770a,
  rawValue: _0x2aa975,
  label: _0x547c27
}) {
  const _0xdcff78 = _0x2aa975 !== undefined ? _0x2aa975 : resolveWan22FirstPresentField(_0x1e5d16, _0x86770a);
  if (!hasWan22InputValue(_0xdcff78)) {
    return '';
  }
  const _0x47496a = _0x576d8f?.['processInputImages'];
  if (typeof _0x47496a !== 'function') {
    throw new Error("缺少 RunningHUB 图片上传能力");
  }
  const _0x1b0344 = (Array["isArray"](_0xdcff78) ? _0xdcff78 : [_0xdcff78])["filter"](_0x1251cb => hasWan22InputValue(_0x1251cb));
  const _0x1326ca = await _0x47496a(_0x1b0344, _0x132582, {
    'applyInputQualityProfile': !![],
    'provider': 'runninghub',
    'strictUpload': !![]
  });
  const _0x277c45 = String(_0x1326ca?.[0x0] || '')["trim"]();
  if (!_0x277c45) {
    throw new Error(_0x547c27 + "上传失败：未返回有效图片地址，请重试或重新选择图片");
  }
  return _0x277c45;
}
function resolveWan22AspectRatio(_0x2627f7 = {}) {
  const _0x8cfc7b = String(_0x2627f7['rhWan22AspectRatio'] ?? _0x2627f7["generationParams"]?.["rhWan22AspectRatio"] ?? _0x2627f7["resolvedRatioLabel"] ?? _0x2627f7['generationParams']?.['resolvedRatioLabel'] ?? _0x2627f7["aspectRatio"] ?? _0x2627f7["generationParams"]?.["aspectRatio"] ?? RH_VIDEO_WORKFLOW_DEFAULT_RATIO)["trim"]();
  const _0x5b683f = _0x8cfc7b["toLowerCase"]();
  const _0x258c3f = _0x8cfc7b === "自适应" || _0x5b683f === "auto" || _0x5b683f === 'adaptive' ? String(_0x2627f7["resolvedRatioLabel"] || _0x2627f7["generationParams"]?.["resolvedRatioLabel"] || _0x2627f7["aspectRatio"] || _0x2627f7["generationParams"]?.["aspectRatio"] || RH_VIDEO_WORKFLOW_DEFAULT_RATIO)["trim"]() : _0x8cfc7b;
  return RH_WAN22_RATIO_PAIRS[_0x258c3f] ? _0x258c3f : RH_VIDEO_WORKFLOW_DEFAULT_RATIO;
}
function resolveWan22Resolution(_0xcb8abd = {}) {
  const _0x4f8e3e = Number(_0xcb8abd["rhVideoResolution"] ?? _0xcb8abd["generationParams"]?.['rhVideoResolution'] ?? 0x340);
  return RH_WAN22_RESOLUTION_OPTIONS["includes"](_0x4f8e3e) ? _0x4f8e3e : 0x340;
}
function ceilWan22DimensionToSixteen(_0x2df6de) {
  return Math['max'](0x10, Math["ceil"](Number(_0x2df6de || 0x0) / 0x10) * 0x10);
}
function resolveWan22Dimensions(_0x3883be = {}) {
  const {
    widthRatio: _0x253f6a,
    heightRatio: _0x1f2b6d
  } = RH_WAN22_RATIO_PAIRS[resolveWan22AspectRatio(_0x3883be)] || RH_WAN22_RATIO_PAIRS[RH_VIDEO_WORKFLOW_DEFAULT_RATIO];
  const _0x508257 = resolveWan22Resolution(_0x3883be);
  if (_0x253f6a === _0x1f2b6d) {
    return {
      'width': _0x508257,
      'height': _0x508257
    };
  }
  if (_0x253f6a > _0x1f2b6d) {
    return {
      'width': _0x508257,
      'height': ceilWan22DimensionToSixteen(_0x508257 * _0x1f2b6d / _0x253f6a)
    };
  }
  return {
    'width': ceilWan22DimensionToSixteen(_0x508257 * _0x253f6a / _0x1f2b6d),
    'height': _0x508257
  };
}
function resolveWan22FrameCount(_0x517cf8 = {}, _0x17e8ce = {}) {
  const _0x4ecfef = Number(_0x517cf8["rhVideoFrames"] ?? _0x517cf8["generationParams"]?.['rhVideoFrames'] ?? _0x17e8ce["framesNode"]?.['defaultValue'] ?? 0x51);
  return Number["isFinite"](_0x4ecfef) ? Math["max"](0x1, Math["trunc"](_0x4ecfef)) : 0x51;
}
async function resolveRunningHubWan22VideoPayload({
  executionManifest: _0x2a2347,
  payload: _0x2e1dd1,
  finalPrompt: _0x48a13d,
  apiKey: _0x38d0ac,
  ctx: _0x481e14,
  helpers: _0x4e5172
}) {
  const _0x3b3ba3 = _0x2a2347["mapping"] || {};
  const _0x522c12 = [];
  const {
    buildOpenApiVideoWorkflowRequest: _0x3c47ad,
    pushManifestNode: _0x505ca3
  } = _0x4e5172;
  const _0x5eca09 = ["firstFrameUrl", 'firstFrame', 'inputUrls.0'];
  const _0x2b4da0 = ["lastFrameUrl", "lastFrame", 'inputUrls.1'];
  const _0x16a650 = resolveWan22FirstPresentField(_0x2e1dd1, _0x5eca09);
  const _0x27b24f = resolveWan22FirstPresentField(_0x2e1dd1, _0x2b4da0);
  if (hasWan22InputValue(_0x27b24f) && !hasWan22InputValue(_0x16a650)) {
    throw new Error('尾帧需要同时接入首帧');
  }
  const _0x4f3307 = await uploadWan22OptionalImage({
    'payload': _0x2e1dd1,
    'apiKey': _0x38d0ac,
    'ctx': _0x481e14,
    'fields': _0x5eca09,
    'rawValue': _0x16a650,
    'label': '首帧'
  });
  const _0x4a8cf4 = await uploadWan22OptionalImage({
    'payload': _0x2e1dd1,
    'apiKey': _0x38d0ac,
    'ctx': _0x481e14,
    'fields': _0x2b4da0,
    'rawValue': _0x27b24f,
    'label': '尾帧'
  });
  _0x4f3307 && _0x505ca3(_0x522c12, _0x3b3ba3["firstFrameNode"], _0x4f3307);
  _0x4a8cf4 && _0x505ca3(_0x522c12, _0x3b3ba3["lastFrameNode"], _0x4a8cf4);
  const _0x2a0e8c = resolveWan22Dimensions(_0x2e1dd1);
  _0x505ca3(_0x522c12, _0x3b3ba3["modeNode"], _0x4f3307 ? _0x4a8cf4 ? '2' : '1' : '0');
  _0x505ca3(_0x522c12, _0x3b3ba3["widthNode"], _0x2a0e8c["width"]);
  _0x505ca3(_0x522c12, _0x3b3ba3["heightNode"], _0x2a0e8c["height"]);
  _0x505ca3(_0x522c12, _0x3b3ba3["framesNode"], resolveWan22FrameCount(_0x2e1dd1, _0x3b3ba3));
  _0x505ca3(_0x522c12, _0x3b3ba3["promptNode"], _0x48a13d || '');
  return _0x3c47ad({
    'executionManifest': _0x2a2347,
    'payload': _0x2e1dd1,
    'apiKey': _0x38d0ac,
    'nodeInfoList': _0x522c12
  });
}
async function resolveRunningHubVideoMattingPayload({
  executionManifest: _0x14d54f,
  payload: _0x2987bd,
  apiKey: _0x447e8d,
  ctx: _0x30543f,
  helpers: _0x553983
}) {
  const _0x552a16 = _0x14d54f["mapping"] || {};
  const _0x561113 = [];
  const {
    buildTaskCreateVideoWorkflowRequest: _0x4795af,
    getRunningHubWorkflowBaseUrl: _0x2f1b2f,
    normalizeRhVideoFps: _0x1fbb99,
    normalizeRhVideoResolution: _0x396581,
    normalizeVideoMattingMaskModeIndex: _0x2194a3,
    pushManifestNode: _0x4fdd83
  } = _0x553983;
  const _0x1cc223 = String(_0x2987bd["maskImageDataUrl"] || '')["trim"]();
  const _0x132119 = String(_0x2987bd["videoUrl"] || '')["trim"]();
  const _0x5cadf9 = _0x2f1b2f(_0x2987bd);
  if (!_0x132119) {
    throw new Error("请接入源视频");
  }
  const _0x37ce4d = _0x30543f["processInputVideos"];
  if (typeof _0x37ce4d !== "function") {
    throw new Error("缺少 RunningHUB 视频上传能力");
  }
  const _0x402fb7 = await _0x37ce4d([_0x132119], _0x447e8d, {
    'strictUpload': !![],
    'maxBytes': VIDEO_MATTING_MAX_SOURCE_VIDEO_BYTES,
    'maxBytesMessage': VIDEO_MATTING_SOURCE_VIDEO_TOO_LARGE_MESSAGE,
    'apiUrl': _0x5cadf9
  });
  const _0x2f50ab = String(_0x402fb7?.[0x0] || '')["trim"]();
  if (!_0x2f50ab) {
    throw new Error("源视频上传失败：未返回有效视频地址，请重试或重新选择视频");
  }
  if (_0x1cc223) {
    const _0x424684 = _0x30543f["processInputImages"];
    if (typeof _0x424684 !== "function") {
      throw new Error("缺少 RunningHUB 图片上传能力");
    }
    const _0x51e42d = await _0x424684([_0x1cc223], _0x447e8d, {
      'compress': ![],
      'provider': "runninghub",
      'strictUpload': !![],
      'apiUrl': _0x5cadf9
    });
    const _0xe704c9 = String(_0x51e42d?.[0x0] || '')["trim"]();
    if (!_0xe704c9) {
      throw new Error("擦除遮罩上传失败：未返回有效遮罩地址，请重新绘制遮罩后重试");
    }
    const _0x13f759 = Number(_0x2987bd['sourceFrameCount'] ?? _0x2987bd['frameCount']);
    const _0x8aa777 = Number['isFinite'](_0x13f759) ? Math['max'](0x1, Math['trunc'](_0x13f759)) : 0x1;
    _0x4fdd83(_0x561113, _0x552a16["maskVideoNode"], _0x2f50ab);
    _0x4fdd83(_0x561113, _0x552a16["maskFrameCapNode"], String(_0x8aa777));
    _0x4fdd83(_0x561113, _0x552a16['maskFpsNode'], String(_0x1fbb99(_0x2987bd['rhVideoFps'] ?? _0x2987bd['frameRate'])));
    _0x4fdd83(_0x561113, _0x552a16["maskResolutionNode"], String(_0x396581(_0x2987bd['rhVideoResolution'], 0x400)));
    _0x4fdd83(_0x561113, _0x552a16["maskImageNode"], _0xe704c9);
    const _0x345a39 = normalizeRunningHubInstanceType(_0x2987bd["rhInstanceType"]);
    return {
      'url': "/api/v2/video/matting/run",
      'headers': {
        'Content-Type': "application/json"
      },
      'body': {
        'apiKey': _0x447e8d,
        'apiUrl': _0x5cadf9,
        'appId': _0x552a16['maskAppId'],
        'nodeInfoList': _0x561113,
        'instanceType': _0x345a39,
        'usePersonalQueue': "false"
      },
      'adapterTrace': {
        'source': 'manifest',
        'executionId': _0x14d54f['id'],
        'modelId': _0x2987bd["model"]
      },
      'isAsync': !![],
      'taskIdPath': "taskId",
      'useOpenapiQuery': !![],
      'pollUrlBuilder': () => _0x5cadf9 + "/openapi/v2/query",
      'resultExtractor': _0x6a6222 => _0x6a6222['status'] === "COMPLETED" && Array["isArray"](_0x6a6222["results"]) ? _0x6a6222["results"]['map'](_0x59c4c7 => _0x59c4c7["videoUrl"] || _0x59c4c7["url"])['filter'](Boolean) : []
    };
  }
  _0x4fdd83(_0x561113, _0x552a16['noMaskVideoNode'], _0x2f50ab);
  const _0x380369 = _0x2987bd["frameRate"] || _0x2987bd["rhVideoFps"];
  if (_0x380369) {
    _0x4fdd83(_0x561113, _0x552a16["noMaskFpsNode"], String(_0x380369));
  }
  _0x2987bd["rhVideoResolution"] !== undefined && _0x2987bd["rhVideoResolution"] !== null && _0x4fdd83(_0x561113, _0x552a16['noMaskResolutionNode'], String(_0x396581(_0x2987bd["rhVideoResolution"])));
  const _0x4b88f0 = _0x2987bd['pos_points'] ?? _0x2987bd["positive"] ?? '';
  const _0x111e74 = _0x2987bd["neg_points"] ?? _0x2987bd["negative"] ?? '';
  _0x4fdd83(_0x561113, _0x552a16["positiveNode"], Array["isArray"](_0x4b88f0) ? JSON['stringify'](_0x4b88f0) : String(_0x4b88f0 || ''));
  _0x4fdd83(_0x561113, _0x552a16["negativeNode"], Array["isArray"](_0x111e74) ? JSON["stringify"](_0x111e74) : String(_0x111e74 || ''));
  const _0x379b98 = _0x2987bd['frameRate'] || _0x2987bd["rhVideoFps"] || _0x2987bd["fps"];
  const _0x259be1 = Number['isFinite'](_0x2987bd["timeSec"]) && Number["isFinite"](Number(_0x379b98)) ? Math["max"](0x0, Math["round"](Number(_0x2987bd['timeSec']) * Number(_0x379b98))) : _0x2987bd["frame_index"] !== undefined && _0x2987bd["frame_index"] !== null ? _0x2987bd['frame_index'] : 0x0;
  _0x4fdd83(_0x561113, _0x552a16['frameIndexNode'], String(_0x259be1));
  _0x4fdd83(_0x561113, _0x552a16['maskModeNode'], _0x2194a3(_0x2987bd["rhMaskMode"]));
  return _0x4795af({
    'executionManifest': _0x14d54f,
    'payload': _0x2987bd,
    'apiKey': _0x447e8d,
    'nodeInfoList': _0x561113
  });
}