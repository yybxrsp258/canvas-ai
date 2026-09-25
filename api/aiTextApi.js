import * as a46_0x17b0f3 from './adapters/PpioAdapter.js';
import { enableTextRequestStreaming, readTextEventStream, shouldRetryWithoutTextStreaming } from './textEventStream.js';
import { buildTextRequestFromManifest } from './adapters/ModelApiManifestNormalizer.js';
import { extractTextResponseMetadata } from './adapters/textResponseMetadata.js';
import { ensureConfig, getProviderConfig } from './configApi.js';
import { applyCameraAngleToPrompt } from './cameraPromptApi.js';
import { fetchWithTimeout, fetchWithTimeoutWithSignal, buildApiUrl } from './apiBase.js';
import { resolveMappedResponseValue } from './adapters/modelApiMappingEngine.js';
import { processInputImages, processInputImagesPreserveOrder, uploadToRunningHub } from './imageUploadApi.js';
import { processInputVideos } from './videoUploadApi.js';
import { uploadModelApiMediaInputs } from './mediaInputUploadRouter.js';
import { uploadInputsToVolcengineFiles } from './volcengineFileApi.js';
import { get as a46_0x29a398 } from './requester.js';
import { generateTextWithCliProvider } from './cliProviderApi.js';
import { prepareCliTextImageInputs } from './cliTextInputs.js';
import { encodeTextMediaInputs } from './textInlineMediaInputs.js';
import { isModelApiModel, normalizeProviderId, resolveModelExecution } from '../src/manifests/index.js';
import { buildChatCompletionsStructuredOutput, getTextStructuredOutputRequestMeta, shouldFallbackTextStructuredOutput } from './adapters/textStructuredOutput.js';
import { ApiError, parseError, parseNetworkError } from './errors/index.js';
import { buildRunningHubModelApiUrl, resolveRunningHubModelApiProfileId, resolveRunningHubModelApiBaseUrl } from '../src/modules/runningHubProviderProfiles.js';
import { normalizeModelProviderProfileId } from '../src/modules/modelProviderProfileSelection.js';
const GENERATION_TIMEOUT = 0x5 * 0x3c * 0x3e8;
const MIN_GENERATION_TIMEOUT = 0x1e * 0x3e8;
const MAX_GENERATION_TIMEOUT = 0xf * 0x3c * 0x3e8;
const IMAGE_MENTION_RE = /@图片\d+/g;
const VIDEO_MENTION_RE = /@视频\d+/g;
const AUDIO_MENTION_RE = /@音频\d+/g;
const GPT_TEXT_VIDEO_MEDIA_RE = /\.(?:mp4|mov|m4v|webm|mkv|avi|mpeg|mpg|3gp)(?:[?#].*)?$/i;
const GPT_TEXT_AUDIO_MEDIA_RE = /\.(?:mp3|wav|m4a|aac|flac|ogg|opus|wma)(?:[?#].*)?$/i;
const GPT_TEXT_UNSUPPORTED_MEDIA_RE = /\.(?:mp4|mov|m4v|webm|mkv|avi|mpeg|mpg|3gp|mp3|wav|m4a|aac|flac|ogg|opus|wma)(?:[?#].*)?$/i;
const RUNNINGHUB_CONTACT_SHEET_MAX_SIDE_PX = 0x800;
const RUNNINGHUB_CONTACT_SHEET_GAP_PX = 0x18;
const RUNNINGHUB_CONTACT_SHEET_MIN_CELL_PX = 0x100;
const RUNNINGHUB_CONTACT_SHEET_COLOR_TOKENS = Object["freeze"]({
  'background': "--canvas-contact-sheet-bg",
  'cellBackground': "--canvas-contact-sheet-cell-bg",
  'cellStroke': "--canvas-contact-sheet-cell-stroke",
  'badgeBackground': '--canvas-contact-sheet-badge-bg',
  'badgeText': '--canvas-contact-sheet-badge-text'
});
const RUNNINGHUB_CONTACT_SHEET_COLOR_FALLBACKS = Object["freeze"]({
  'background': "white",
  'cellBackground': "whitesmoke",
  'cellStroke': "gainsboro",
  'badgeBackground': "midnightblue",
  'badgeText': "white"
});
function normalizeInputUrls(_0x891b20) {
  return Array["isArray"](_0x891b20) ? _0x891b20['map'](_0x314bd8 => String(_0x314bd8 || '')["trim"]())["filter"](Boolean) : [];
}
function hasUnsupportedGptTextMediaUrl(_0x1cfcd1) {
  return normalizeInputUrls(_0x1cfcd1)["some"](_0x324ef5 => GPT_TEXT_UNSUPPORTED_MEDIA_RE["test"](_0x324ef5));
}
function isLikelyVideoUrl(_0x480631) {
  return GPT_TEXT_VIDEO_MEDIA_RE["test"](String(_0x480631 || '')["trim"]());
}
function isLikelyAudioUrl(_0xa94e66) {
  return GPT_TEXT_AUDIO_MEDIA_RE["test"](String(_0xa94e66 || '')["trim"]());
}
function hasUnsupportedGptTextAudioUrl(_0x14d7d2) {
  return normalizeInputUrls(_0x14d7d2)["some"](_0x2efae8 => isLikelyAudioUrl(_0x2efae8));
}
function splitChatCompletionInputUrls(_0x4045cb) {
  const _0x153df2 = [];
  const _0x30d2d7 = [];
  const _0x26b1c7 = [];
  for (const _0x20da68 of normalizeInputUrls(_0x4045cb)) {
    if (isLikelyVideoUrl(_0x20da68)) {
      _0x30d2d7["push"](_0x20da68);
    } else {
      isLikelyAudioUrl(_0x20da68) ? _0x26b1c7["push"](_0x20da68) : _0x153df2["push"](_0x20da68);
    }
  }
  return {
    'imageUrls': _0x153df2,
    'videoUrls': _0x30d2d7,
    'audioUrls': _0x26b1c7
  };
}
function resolveChatCompletionInputUrls({
  providerId = '',
  mediaPolicy = '',
  inputUrls: _0x157f24,
  inputImageUrls: _0x44e6d9,
  inputVideoUrls: _0x493c4e,
  inputAudioUrls: _0x35abdf
}) {
  const _0x329aa0 = String(mediaPolicy || '')["trim"]()["toLowerCase"]();
  const _0x3a650c = normalizeInputUrls(_0x157f24);
  const _0x45af7b = normalizeInputUrls(_0x44e6d9);
  const _0x21ed2f = normalizeInputUrls(_0x493c4e);
  const _0x3aeece = normalizeInputUrls(_0x35abdf);
  const _0x45c488 = splitChatCompletionInputUrls(_0x3a650c);
  if (_0x329aa0 === "text-only") {
    if (_0x3a650c["length"] > 0x0 || _0x45af7b['length'] > 0x0 || _0x21ed2f["length"] > 0x0 || _0x3aeece["length"] > 0x0) {
      const _0xf66e76 = formatTextProviderLabel(providerId);
      throw new Error(_0xf66e76 + " 文本模型暂不支持图片、视频或音频参考，请仅输入文本");
    }
    return [];
  }
  if (_0x329aa0 === "image-video-audio") {
    return {
      'inputUrls': _0x3a650c,
      'inputImageUrls': _0x45af7b['length'] > 0x0 ? _0x45af7b : _0x45c488["imageUrls"],
      'inputVideoUrls': _0x21ed2f["length"] > 0x0 ? _0x21ed2f : _0x45c488["videoUrls"],
      'inputAudioUrls': _0x3aeece["length"] > 0x0 ? _0x3aeece : _0x45c488["audioUrls"],
      'allowVideo': !![],
      'allowAudio': !![],
      'mediaPolicy': _0x329aa0
    };
  }
  if (_0x329aa0 === "image-video") {
    if (_0x45c488["audioUrls"]["length"] > 0x0 || _0x3aeece["length"] > 0x0 || hasUnsupportedGptTextAudioUrl(_0x45af7b) || hasUnsupportedGptTextAudioUrl(_0x21ed2f)) {
      const _0x36748f = formatTextProviderLabel(providerId);
      throw new Error(_0x36748f + '\x20文本模型暂不支持音频参考，请改用图片或视频参考');
    }
    return {
      'inputUrls': _0x3a650c,
      'inputImageUrls': _0x45af7b["length"] > 0x0 ? _0x45af7b : _0x45c488["imageUrls"],
      'inputVideoUrls': _0x21ed2f["length"] > 0x0 ? _0x21ed2f : _0x45c488["videoUrls"],
      'allowVideo': !![],
      'mediaPolicy': _0x329aa0
    };
  }
  if (_0x329aa0 !== 'image-only') {
    return _0x3a650c;
  }
  if (_0x21ed2f['length'] > 0x0 || hasUnsupportedGptTextMediaUrl(_0x3a650c) || hasUnsupportedGptTextMediaUrl(_0x45af7b)) {
    const _0x19ee27 = formatTextProviderLabel(providerId);
    throw new Error(_0x19ee27 + " 文本模型已统一使用 GPT 图文格式，暂不支持视频或音频参考，请改用图片参考");
  }
  return _0x45af7b['length'] > 0x0 ? _0x45af7b : _0x3a650c;
}
const RUNNINGHUB_POLL_INTERVAL_MS = 0xbb8;
function sleep(_0xf2c5f0, _0x331f0f = null) {
  if (!_0x331f0f) {
    return new Promise(_0x5abd9c => setTimeout(_0x5abd9c, _0xf2c5f0));
  }
  if (_0x331f0f["aborted"]) {
    return Promise["reject"](new DOMException("Aborted", "AbortError"));
  }
  return new Promise((_0x4db5a4, _0x4fdfb8) => {
    const _0x45493e = setTimeout(() => {
      _0x331f0f["removeEventListener"]('abort', _0x1318c6);
      _0x4db5a4();
    }, _0xf2c5f0);
    const _0x1318c6 = () => {
      clearTimeout(_0x45493e);
      _0x4fdfb8(new DOMException("Aborted", "AbortError"));
    };
    _0x331f0f["addEventListener"]("abort", _0x1318c6, {
      'once': !![]
    });
  });
}
function resolveGenerationTimeoutMs(_0x42e847 = {}) {
  if (_0x42e847?.["disableRequestTimeout"] === !![]) {
    return null;
  }
  const _0x37237d = _0x42e847?.['requestTimeoutMs'] ?? _0x42e847?.["timeoutMs"];
  const _0x5b9663 = Number(_0x37237d);
  if (!Number["isFinite"](_0x5b9663) || _0x5b9663 <= 0x0) {
    return GENERATION_TIMEOUT;
  }
  return Math["min"](MAX_GENERATION_TIMEOUT, Math['max'](MIN_GENERATION_TIMEOUT, Math["trunc"](_0x5b9663)));
}
function resolveCssColorValue(_0x2c13b3, _0x392d43 = new Set()) {
  const _0x46a61b = String(_0x2c13b3 || '')["trim"]();
  if (!_0x46a61b) {
    return '';
  }
  const _0x43f67d = /^var\(\s*(--[A-Za-z0-9_-]+)\s*(?:,\s*([^)]+?)\s*)?\)$/["exec"](_0x46a61b);
  if (!_0x43f67d) {
    return _0x46a61b;
  }
  const _0x211b2d = _0x43f67d[0x1];
  const _0x1abc9b = (_0x43f67d[0x2] || '')["trim"]();
  if (_0x392d43["has"](_0x211b2d)) {
    return resolveCssColorValue(_0x1abc9b, _0x392d43);
  }
  _0x392d43["add"](_0x211b2d);
  return readDocumentCssColorToken(_0x211b2d, _0x392d43) || resolveCssColorValue(_0x1abc9b, _0x392d43);
}
function readDocumentCssColorToken(_0x4a41e0, _0x2723d5 = new Set()) {
  const _0x21e7e3 = globalThis?.['document']?.["documentElement"];
  const _0xd6010b = globalThis?.["getComputedStyle"] || globalThis?.["window"]?.["getComputedStyle"];
  if (!_0x21e7e3 || typeof _0xd6010b !== 'function') {
    return '';
  }
  const _0x76ce90 = _0xd6010b(_0x21e7e3)["getPropertyValue"](_0x4a41e0)["trim"]();
  if (!_0x76ce90) {
    return '';
  }
  return resolveCssColorValue(_0x76ce90, _0x2723d5);
}
function getRunningHubContactSheetPalette() {
  return {
    'background': readDocumentCssColorToken(RUNNINGHUB_CONTACT_SHEET_COLOR_TOKENS["background"]) || RUNNINGHUB_CONTACT_SHEET_COLOR_FALLBACKS["background"],
    'cellBackground': readDocumentCssColorToken(RUNNINGHUB_CONTACT_SHEET_COLOR_TOKENS["cellBackground"]) || RUNNINGHUB_CONTACT_SHEET_COLOR_FALLBACKS['cellBackground'],
    'cellStroke': readDocumentCssColorToken(RUNNINGHUB_CONTACT_SHEET_COLOR_TOKENS["cellStroke"]) || RUNNINGHUB_CONTACT_SHEET_COLOR_FALLBACKS["cellStroke"],
    'badgeBackground': readDocumentCssColorToken(RUNNINGHUB_CONTACT_SHEET_COLOR_TOKENS['badgeBackground']) || RUNNINGHUB_CONTACT_SHEET_COLOR_FALLBACKS["badgeBackground"],
    'badgeText': readDocumentCssColorToken(RUNNINGHUB_CONTACT_SHEET_COLOR_TOKENS["badgeText"]) || RUNNINGHUB_CONTACT_SHEET_COLOR_FALLBACKS["badgeText"]
  };
}
function pickFirstNonEmptyString(_0x533215) {
  for (const _0x4c5d56 of _0x533215) {
    if (typeof _0x4c5d56 === "string" && _0x4c5d56["trim"]()) {
      return _0x4c5d56["trim"]();
    }
  }
  return '';
}
function extractChatMessageText(_0x4488a9) {
  if (typeof _0x4488a9 === "string") {
    return _0x4488a9["trim"]();
  }
  if (!Array["isArray"](_0x4488a9)) {
    return '';
  }
  return _0x4488a9["map"](_0x46f069 => {
    if (typeof _0x46f069 === "string") {
      return _0x46f069["trim"]();
    }
    if (typeof _0x46f069?.["text"] === "string") {
      return _0x46f069["text"]["trim"]();
    }
    if (typeof _0x46f069?.["content"] === "string") {
      return _0x46f069['content']["trim"]();
    }
    return '';
  })['filter'](Boolean)["join"]('\x0a');
}
function isRunningHubTextModel(_0x29a66d, _0x4dd244) {
  return _0x29a66d === 'runninghub' && isModelApiModel(_0x4dd244, 'runninghub');
}
const MANIFEST_REQUIRED_TEXT_PROVIDERS = Object["freeze"](new Set(['agnes', 'apimart', 'bailian', "deepseek", "grsai", "ppio", 'runninghub', "volcengine"]));
function formatTextProviderLabel(_0x3c8628) {
  const _0x2d5633 = normalizeProviderId(_0x3c8628);
  if (_0x2d5633 === 'agnes') {
    return "Agnes AI";
  }
  if (_0x2d5633 === "apimart") {
    return "APIMart";
  }
  if (_0x2d5633 === "deepseek") {
    return "DeepSeek";
  }
  if (_0x2d5633 === 'grsai') {
    return "GRSAI";
  }
  if (_0x2d5633 === "ppio") {
    return "PPIO";
  }
  if (_0x2d5633 === "runninghub") {
    return "RunningHub";
  }
  if (_0x2d5633 === "volcengine") {
    return "Volcengine";
  }
  return _0x2d5633 || "Text";
}
function resolveTextExecution(_0x35ab9b = {}, _0x4e7544 = '') {
  const _0x4a48dd = normalizeProviderId(_0x35ab9b?.["provider"]);
  if (_0x4a48dd === "custom" || _0x4a48dd === 'openai') {
    return null;
  }
  return resolveModelExecution(_0x4e7544 || _0x35ab9b?.["model"], {
    'providerHint': _0x4a48dd
  }) || resolveModelExecution(_0x4e7544 || _0x35ab9b?.["model"]);
}
function resolveTextProviderId(_0xd10363 = {}, _0x2871cd = '', _0x112d29 = null) {
  if (_0xd10363["provider"] === "custom") {
    return "openai";
  }
  return normalizeProviderId(_0x112d29?.["modelManifest"]?.['provider'] || _0xd10363["provider"]);
}
function isManifestBackedTextExecution(_0x47acae) {
  return _0x47acae?.["modelManifest"]?.['kind'] === "text" && _0x47acae?.["executionManifest"]?.["kind"] === "text" && _0x47acae?.["modelManifest"]?.["adapterType"] === "modelApi" && _0x47acae?.["executionManifest"]?.["adapterType"] === "modelApi";
}
function isCliTextRuntimeExecution(_0x37f5da) {
  return _0x37f5da?.["modelManifest"]?.['kind'] === "text" && _0x37f5da?.["executionManifest"]?.["kind"] === "text" && _0x37f5da?.["modelManifest"]?.['adapterType'] === "localRuntime" && _0x37f5da?.['executionManifest']?.['adapterType'] === "localRuntime" && _0x37f5da?.["executionManifest"]?.["runtime"] === "cliText" && !!_0x37f5da?.["executionManifest"]?.["extensions"]?.['cliProvider'];
}
function buildFinalTextPrompt(_0x48b61d = {}) {
  return applyCameraAngleToPrompt(_0x48b61d["prompt"], _0x48b61d["cameraAngle"]);
}
async function generateCliRuntimeText(_0x4e2b7c, _0x571672) {
  const _0xb9e486 = prepareCliTextImageInputs(_0x4e2b7c, _0x571672['modelManifest']);
  const _0x5e47d2 = String(_0x571672?.['executionManifest']?.["extensions"]?.["cliProvider"] || '')["trim"]();
  if (!_0x5e47d2) {
    throw new Error("CLI text runtime manifest missing cliProvider");
  }
  const _0x3f00ff = _0x4e2b7c?.["generationParams"] && typeof _0x4e2b7c["generationParams"] === "object" && !Array["isArray"](_0x4e2b7c["generationParams"]) ? _0x4e2b7c["generationParams"] : {};
  const _0x324f0b = {};
  ["cliModel", 'reasoningEffort']['forEach'](_0x1aacfc => {
    const _0x105bb8 = String(_0x3f00ff[_0x1aacfc] || '')["trim"]();
    if (_0x105bb8) {
      _0x324f0b[_0x1aacfc] = _0x105bb8;
    }
  });
  return generateTextWithCliProvider({
    'provider': _0x5e47d2,
    'prompt': buildFinalTextPrompt(_0x4e2b7c),
    'systemPrompt': String(_0x4e2b7c?.["systemPrompt"] || '')['trim'](),
    ...(_0x4e2b7c?.["structuredOutput"] && typeof _0x4e2b7c["structuredOutput"] === "object" ? {
      'structuredOutput': _0x4e2b7c['structuredOutput']
    } : {}),
    ...(Object["keys"](_0x324f0b)["length"] ? {
      'generationParams': _0x324f0b
    } : {}),
    'timeoutMs': resolveGenerationTimeoutMs(_0x4e2b7c),
    'disableRequestTimeout': _0x4e2b7c?.['disableRequestTimeout'] === !![],
    'onText': _0x4e2b7c?.["onText"],
    'signal': _0x4e2b7c?.["signal"],
    'inputImageUrls': await _0xb9e486
  });
}
function getTextManifestMissingError(_0x937603, _0x268f41 = '') {
  const _0x571d05 = formatTextProviderLabel(_0x268f41);
  if (_0x268f41) {
    return new Error(_0x571d05 + " text model API manifest missing: " + _0x937603);
  }
  return new Error("Text model API manifest missing: " + _0x937603);
}
function assertTextManifestResolution(_0x72583e, _0x2d941b, _0x45654c) {
  if (isManifestBackedTextExecution(_0x45654c)) {
    return;
  }
  if (!_0x2d941b || MANIFEST_REQUIRED_TEXT_PROVIDERS["has"](normalizeProviderId(_0x2d941b))) {
    throw getTextManifestMissingError(_0x72583e, _0x2d941b);
  }
}
function parseRunningHubResponseData(_0x28a347) {
  if (!_0x28a347) {
    return {};
  }
  if (typeof _0x28a347 === "object") {
    return _0x28a347;
  }
  const _0x37bf0a = String(_0x28a347 || '')['trim']();
  if (!_0x37bf0a) {
    return {};
  }
  try {
    return JSON["parse"](_0x37bf0a);
  } catch {}
  const _0xce973c = extractSseJsonSnapshots(_0x37bf0a);
  if (_0xce973c["length"] > 0x0) {
    const _0x3df2b4 = normalizeChatCompletionSnapshots(_0xce973c);
    if (_0x3df2b4) {
      return _0x3df2b4;
    }
    for (const _0x204948 of _0xce973c) {
      if (getRunningHubTaskId(_0x204948)) {
        return _0x204948;
      }
    }
    return _0xce973c[_0xce973c['length'] - 0x1];
  }
  throw new Error("无法解析 RunningHUB 文本接口响应");
}
function extractSseJsonSnapshots(_0x307f1f) {
  const _0x4fbf45 = String(_0x307f1f || '')['split']('\x0a')["filter"](_0x51b2c7 => _0x51b2c7['trim']()["startsWith"]("data:"));
  if (_0x4fbf45["length"] === 0x0) {
    return [];
  }
  const _0x50111a = [];
  for (const _0x4b8b32 of _0x4fbf45) {
    const _0x1e3345 = String(_0x4b8b32 || '')['trim']()["replace"](/^data:\s*/, '')["trim"]();
    if (!_0x1e3345 || _0x1e3345 === "[DONE]") {
      continue;
    }
    try {
      _0x50111a["push"](JSON["parse"](_0x1e3345));
    } catch {}
  }
  return _0x50111a;
}
function normalizeChatCompletionSnapshots(_0x5831a1) {
  const _0x455e75 = [];
  let _0x2a4bc6 = null;
  let _0xcb88c0 = '';
  let _0x433162 = "assistant";
  for (const _0x439040 of _0x5831a1 || []) {
    if (!_0x439040 || typeof _0x439040 !== 'object') {
      continue;
    }
    const _0x5b4aa0 = _0x439040['choices'] || _0x439040['data']?.["choices"] || [];
    if (!Array["isArray"](_0x5b4aa0) || _0x5b4aa0["length"] === 0x0) {
      continue;
    }
    _0x2a4bc6 = _0x439040;
    for (const _0x4fe045 of _0x5b4aa0) {
      if (!_0x4fe045 || typeof _0x4fe045 !== "object") {
        continue;
      }
      if (_0x4fe045["finish_reason"]) {
        _0xcb88c0 = _0x4fe045["finish_reason"];
      }
      if (typeof _0x4fe045['delta']?.['role'] === "string") {
        _0x433162 = _0x4fe045["delta"]['role'] || _0x433162;
      }
      if (typeof _0x4fe045["message"]?.["role"] === "string") {
        _0x433162 = _0x4fe045["message"]["role"] || _0x433162;
      }
      if (typeof _0x4fe045["delta"]?.['content'] === "string") {
        _0x455e75["push"](_0x4fe045["delta"]["content"]);
      }
      if (typeof _0x4fe045["message"]?.["content"] === "string") {
        _0x455e75["push"](_0x4fe045["message"]['content']);
      }
      if (typeof _0x4fe045['text'] === 'string') {
        _0x455e75['push'](_0x4fe045["text"]);
      }
    }
  }
  const _0x3f8425 = _0x455e75['join']('');
  if (!_0x3f8425) {
    return null;
  }
  return {
    'id': _0x2a4bc6?.['id'] || '',
    'object': 'chat.completion',
    'choices': [{
      'index': 0x0,
      'message': {
        'role': _0x433162,
        'content': _0x3f8425
      },
      'finish_reason': _0xcb88c0 || "stop"
    }]
  };
}
function getRunningHubTaskId(_0x3f3746) {
  return String(_0x3f3746?.["taskId"] || _0x3f3746?.["task_id"] || _0x3f3746?.["data"]?.["taskId"] || _0x3f3746?.["data"]?.["task_id"] || _0x3f3746?.["data"]?.['id'] || _0x3f3746?.['id'] || '')["trim"]();
}
function isChatCompletionResponse(_0x59d1ab) {
  const _0x8a609d = _0x59d1ab?.["choices"] || _0x59d1ab?.['data']?.["choices"];
  if (Array['isArray'](_0x8a609d)) {
    return !![];
  }
  const _0x5afb1c = String(_0x59d1ab?.["object"] || _0x59d1ab?.["data"]?.["object"] || '');
  return _0x5afb1c["startsWith"]("chat.completion");
}
function stringifyRunningHubReason(_0x4546fd) {
  if (_0x4546fd == null) {
    return '';
  }
  if (typeof _0x4546fd === "string") {
    return _0x4546fd["trim"]();
  }
  if (typeof _0x4546fd === "object") {
    const _0x391102 = pickFirstNonEmptyString([_0x4546fd["message"], _0x4546fd["errorMessage"], _0x4546fd["error"], _0x4546fd["msg"], _0x4546fd["reason"], _0x4546fd["detail"]]);
    if (_0x391102) {
      return _0x391102;
    }
    try {
      return JSON["stringify"](_0x4546fd);
    } catch {}
  }
  return String(_0x4546fd || '')['trim']();
}
function getRunningHubTextErrorMessage(_0x305c2b, _0x2d4913 = '文本生成失败') {
  return pickFirstNonEmptyString([_0x305c2b?.["errorMessage"], _0x305c2b?.["message"], _0x305c2b?.["error"], _0x305c2b?.["msg"], stringifyRunningHubReason(_0x305c2b?.['failedReason']), stringifyRunningHubReason(_0x305c2b?.["reason"])]) || _0x2d4913;
}
function sanitizeGeneratedText(_0x23787e) {
  return String(_0x23787e || '')["replace"](/<think>[\s\S]*?<\/think>\n?/g, '')['trim']();
}
function hasImageMentions(_0x2929ce) {
  return /@图片\d+/['test'](String(_0x2929ce || ''));
}
function hasVideoMentions(_0x898f7b) {
  return /@视频\d+/["test"](String(_0x898f7b || ''));
}
function hasAudioMentions(_0x2b06ab) {
  return /@音频\d+/['test'](String(_0x2b06ab || ''));
}
function resolveInputFetchUrl(_0x1ac99e) {
  const _0x2f4ef4 = String(_0x1ac99e || '')["trim"]();
  if (!_0x2f4ef4) {
    return '';
  }
  if (/^(?:https?:|data:|blob:)/i["test"](_0x2f4ef4)) {
    return _0x2f4ef4;
  }
  if (_0x2f4ef4["startsWith"]('/')) {
    return buildApiUrl(_0x2f4ef4);
  }
  return _0x2f4ef4;
}
function loadCanvasImageFromObjectUrl(_0x262b03) {
  return new Promise((_0x5ae173, _0x191cf5) => {
    const _0x2d4666 = globalThis?.["Image"];
    if (typeof _0x2d4666 !== "function") {
      _0x191cf5(new Error('当前环境不支持图片加载'));
      return;
    }
    const _0x4bc2e4 = new _0x2d4666();
    "crossOrigin" in _0x4bc2e4 && (_0x4bc2e4["crossOrigin"] = "anonymous");
    _0x4bc2e4["onload"] = () => _0x5ae173(_0x4bc2e4);
    _0x4bc2e4["onerror"] = () => _0x191cf5(new Error("图片加载失败"));
    _0x4bc2e4["src"] = _0x262b03;
  });
}
async function loadCanvasImageSource(_0x2e9aa2) {
  const _0x14f9cd = globalThis?.["createImageBitmap"];
  if (typeof _0x14f9cd === "function") {
    const _0x4392a6 = await _0x14f9cd(_0x2e9aa2);
    const _0x291f37 = Number(_0x4392a6?.["width"] || 0x0);
    const _0x273580 = Number(_0x4392a6?.['height'] || 0x0);
    if (_0x291f37 > 0x0 && _0x273580 > 0x0) {
      return {
        'handle': _0x4392a6,
        'width': _0x291f37,
        'height': _0x273580,
        'dispose': () => _0x4392a6?.["close"]?.()
      };
    }
    _0x4392a6?.['close']?.();
  }
  const _0x215026 = globalThis?.["URL"];
  if (typeof _0x215026?.["createObjectURL"] !== 'function') {
    throw new Error("当前环境不支持多图合成");
  }
  const _0x5899b4 = _0x215026["createObjectURL"](_0x2e9aa2);
  try {
    const _0x55389a = await loadCanvasImageFromObjectUrl(_0x5899b4);
    const _0xb1ec1e = Number(_0x55389a?.["naturalWidth"] || _0x55389a?.["width"] || 0x0);
    const _0x24c233 = Number(_0x55389a?.['naturalHeight'] || _0x55389a?.['height'] || 0x0);
    if (!(_0xb1ec1e > 0x0 && _0x24c233 > 0x0)) {
      throw new Error('图片尺寸无效');
    }
    return {
      'handle': _0x55389a,
      'width': _0xb1ec1e,
      'height': _0x24c233,
      'dispose': () => _0x215026["revokeObjectURL"]?.(_0x5899b4)
    };
  } catch (_0x5a6674) {
    _0x215026["revokeObjectURL"]?.(_0x5899b4);
    throw _0x5a6674;
  }
}
function createCanvasTarget(_0x5375e9, _0x57ae31) {
  const _0x189c80 = globalThis?.["OffscreenCanvas"];
  if (typeof _0x189c80 === "function") {
    const _0x10f7a6 = new _0x189c80(_0x5375e9, _0x57ae31);
    return {
      'canvas': _0x10f7a6,
      'toBlob': async () => {
        if (typeof _0x10f7a6['convertToBlob'] === 'function') {
          return await _0x10f7a6["convertToBlob"]({
            'type': 'image/png'
          });
        }
        return null;
      }
    };
  }
  if (typeof document !== "undefined" && typeof document["createElement"] === "function") {
    const _0x3729ca = document["createElement"]('canvas');
    _0x3729ca["width"] = _0x5375e9;
    _0x3729ca["height"] = _0x57ae31;
    return {
      'canvas': _0x3729ca,
      'toBlob': async () => await new Promise(_0x328f8b => {
        if (typeof _0x3729ca['toBlob'] !== "function") {
          _0x328f8b(null);
          return;
        }
        _0x3729ca["toBlob"](_0xaf2a2 => _0x328f8b(_0xaf2a2), "image/png");
      })
    };
  }
  throw new Error("当前环境不支持多图合成");
}
function resolveRunningHubContactSheetGrid(_0x583359) {
  const _0x6e864c = Math["max"](0x1, Math["trunc"](Number(_0x583359) || 0x1));
  const _0x27444a = _0x6e864c === 0x2 ? 0x2 : Math["ceil"](Math["sqrt"](_0x6e864c));
  const _0x4157f3 = Math["ceil"](_0x6e864c / _0x27444a);
  return {
    'cols': _0x27444a,
    'rows': _0x4157f3
  };
}
function resolveRunningHubContactSheetCellSize(_0xd94668, _0x43cfd4) {
  const _0x23e625 = RUNNINGHUB_CONTACT_SHEET_MAX_SIDE_PX;
  const _0x2808ca = RUNNINGHUB_CONTACT_SHEET_GAP_PX;
  const _0x4ef7ee = Math["floor"]((_0x23e625 - _0x2808ca * (_0xd94668 + 0x1)) / _0xd94668);
  const _0x34ebce = Math['floor']((_0x23e625 - _0x2808ca * (_0x43cfd4 + 0x1)) / _0x43cfd4);
  return Math["max"](RUNNINGHUB_CONTACT_SHEET_MIN_CELL_PX, Math["min"](_0x4ef7ee, _0x34ebce));
}
async function composeRunningHubMultiImageBlob(_0x152119) {
  const _0x5ba979 = normalizeInputUrls(_0x152119);
  const _0x392e70 = [];
  for (const _0x51e3de of _0x5ba979) {
    try {
      const _0x16034e = await a46_0x29a398(resolveInputFetchUrl(_0x51e3de), {
        'provider': 'remote',
        'buildUrl': ![],
        'responseType': "blob"
      });
      const _0x442d38 = await loadCanvasImageSource(_0x16034e);
      _0x392e70["push"]({
        'blob': _0x16034e,
        'source': _0x442d38
      });
    } catch {}
  }
  if (_0x392e70["length"] === 0x0) {
    throw new Error("参考图片处理失败，无法合成多图输入");
  }
  if (_0x392e70["length"] === 0x1) {
    const _0x291b3f = _0x392e70[0x0]["blob"];
    _0x392e70[0x0]['source']?.["dispose"]?.();
    return _0x291b3f;
  }
  try {
    const {
      cols: _0xa76afb,
      rows: _0x4bcde
    } = resolveRunningHubContactSheetGrid(_0x392e70["length"]);
    const _0x509618 = RUNNINGHUB_CONTACT_SHEET_GAP_PX;
    const _0x593ee6 = resolveRunningHubContactSheetCellSize(_0xa76afb, _0x4bcde);
    const _0x45315d = getRunningHubContactSheetPalette();
    const _0x39e76f = _0xa76afb * _0x593ee6 + _0x509618 * (_0xa76afb + 0x1);
    const _0x43f79d = _0x4bcde * _0x593ee6 + _0x509618 * (_0x4bcde + 0x1);
    const {
      canvas: _0x52e3cd,
      toBlob: _0x15aed2
    } = createCanvasTarget(_0x39e76f, _0x43f79d);
    const _0x349dba = _0x52e3cd?.["getContext"]?.('2d');
    if (!_0x349dba || typeof _0x349dba["drawImage"] !== 'function') {
      throw new Error("当前环境不支持多图合成");
    }
    _0x349dba["fillStyle"] = _0x45315d["background"];
    _0x349dba['fillRect']?.(0x0, 0x0, _0x39e76f, _0x43f79d);
    const _0x54f8cf = Math["max"](0x1e, Math['round'](_0x593ee6 * 0.14));
    const _0x201b6f = Math["max"](0x10, Math['round'](_0x54f8cf * 0.48));
    _0x392e70["forEach"]((_0x109f89, _0x4bf054) => {
      const _0x59d17c = Math['floor'](_0x4bf054 / _0xa76afb);
      const _0x383d3d = _0x4bf054 % _0xa76afb;
      const _0x2bf144 = _0x509618 + _0x383d3d * (_0x593ee6 + _0x509618);
      const _0x12db84 = _0x509618 + _0x59d17c * (_0x593ee6 + _0x509618);
      _0x349dba["fillStyle"] = _0x45315d["cellBackground"];
      _0x349dba["fillRect"]?.(_0x2bf144, _0x12db84, _0x593ee6, _0x593ee6);
      const _0x438d5a = Math["max"](0x1, Number(_0x109f89["source"]["width"] || 0x1));
      const _0x24cdb7 = Math["max"](0x1, Number(_0x109f89['source']["height"] || 0x1));
      const _0x39d558 = Math["min"](_0x593ee6 / _0x438d5a, _0x593ee6 / _0x24cdb7);
      const _0x2e1af7 = Math['max'](0x1, Math["round"](_0x438d5a * _0x39d558));
      const _0x3af5f1 = Math["max"](0x1, Math["round"](_0x24cdb7 * _0x39d558));
      const _0x367349 = _0x2bf144 + Math["round"]((_0x593ee6 - _0x2e1af7) / 0x2);
      const _0x5ac21e = _0x12db84 + Math["round"]((_0x593ee6 - _0x3af5f1) / 0x2);
      _0x349dba['drawImage'](_0x109f89["source"]["handle"], _0x367349, _0x5ac21e, _0x2e1af7, _0x3af5f1);
      _0x349dba["strokeStyle"] = _0x45315d['cellStroke'];
      _0x349dba["lineWidth"] = 0x2;
      _0x349dba['strokeRect']?.(_0x2bf144 + 0x1, _0x12db84 + 0x1, _0x593ee6 - 0x2, _0x593ee6 - 0x2);
      _0x349dba['fillStyle'] = _0x45315d["badgeBackground"];
      _0x349dba["fillRect"]?.(_0x2bf144 + 0xc, _0x12db84 + 0xc, _0x54f8cf, _0x54f8cf);
      _0x349dba['fillStyle'] = _0x45315d["badgeText"];
      _0x349dba["font"] = "600 " + _0x201b6f + "px sans-serif";
      _0x349dba["textAlign"] = "center";
      _0x349dba["textBaseline"] = "middle";
      _0x349dba["fillText"]?.(String(_0x4bf054 + 0x1), _0x2bf144 + 0xc + _0x54f8cf / 0x2, _0x12db84 + 0xc + _0x54f8cf / 0x2);
    });
    const _0x5cfe5c = await _0x15aed2();
    if (!_0x5cfe5c) {
      throw new Error('多图合成失败');
    }
    return _0x5cfe5c;
  } finally {
    _0x392e70["forEach"](_0x4dac01 => {
      _0x4dac01["source"]?.["dispose"]?.();
    });
  }
}
async function buildRunningHubTextImageUrl(_0x1b9f62, _0x307621, _0x2b0d27 = {}) {
  const _0x12a587 = normalizeInputUrls(_0x1b9f62);
  if (_0x12a587['length'] === 0x0) {
    return '';
  }
  if (_0x12a587["length"] === 0x1) {
    const _0x33da7b = await processInputImages(_0x12a587, _0x307621, {
      'applyInputQualityProfile': !![],
      'provider': "runninghub",
      'preferFree': ![],
      'strictUpload': !![],
      'apiUrl': _0x2b0d27["apiUrl"]
    });
    return String(_0x33da7b[0x0] || '')["trim"]();
  }
  const _0x444151 = await composeRunningHubMultiImageBlob(_0x12a587);
  return String(await uploadToRunningHub(_0x444151, _0x307621, {
    'apiUrl': _0x2b0d27["apiUrl"]
  }))["trim"]();
}
function mergeAdjacentTextParts(_0xd93f65, {
  createTextPart: _0x9b3e68,
  isTextPart: _0x2fe38a
}) {
  const _0x27be9c = [];
  let _0x592f9d = '';
  const _0x1e62ca = () => {
    if (!_0x592f9d) {
      return;
    }
    _0x27be9c['push'](_0x9b3e68(_0x592f9d));
    _0x592f9d = '';
  };
  for (const _0x3cbae3 of _0xd93f65) {
    if (!_0x3cbae3) {
      continue;
    }
    if (_0x2fe38a(_0x3cbae3)) {
      _0x592f9d += String(_0x3cbae3["text"] || '');
      continue;
    }
    _0x1e62ca();
    _0x27be9c["push"](_0x3cbae3);
  }
  _0x1e62ca();
  return _0x27be9c;
}
function buildPromptMediaParts(_0x1e4340, _0xad1e17, {
  createTextPart: _0x599c43,
  isTextPart: _0x438c3f
}, _0x476cec = {}) {
  const _0x360a78 = String(_0x1e4340 || '');
  const _0x3fe423 = normalizePromptMediaGroups(_0xad1e17, _0x476cec);
  const _0x47d861 = _0x3fe423['some'](_0x498e41 => _0x498e41["parts"]["length"] > 0x0);
  if (!_0x47d861) {
    return _0x360a78 ? [_0x599c43(_0x360a78)] : [];
  }
  const _0x143732 = [];
  const _0x19d8c0 = new Set();
  const _0x405a2c = [];
  for (const _0x17d9a1 of _0x3fe423) {
    _0x17d9a1['mentionRe']["lastIndex"] = 0x0;
    let _0x38f614;
    while (_0x38f614 = _0x17d9a1['mentionRe']['exec'](_0x360a78)) {
      const _0x1bb3a9 = Number["parseInt"](_0x38f614[0x0]['replace'](/\D+/g, ''), 0xa);
      const _0x39ed9b = Number["isFinite"](_0x1bb3a9) ? Math['max'](0x0, _0x1bb3a9 - 0x1) : -0x1;
      _0x405a2c['push']({
        'index': _0x38f614["index"],
        'endIndex': _0x38f614["index"] + _0x38f614[0x0]["length"],
        'text': _0x38f614[0x0],
        'group': _0x17d9a1,
        'mediaIndex': _0x39ed9b
      });
    }
  }
  _0x405a2c["sort"]((_0x3b1cdf, _0x4b5390) => _0x3b1cdf["index"] - _0x4b5390['index'] || _0x3b1cdf["endIndex"] - _0x4b5390['endIndex']);
  let _0x512964 = 0x0;
  for (const _0x5beb93 of _0x405a2c) {
    if (_0x5beb93['index'] < _0x512964) {
      continue;
    }
    const _0x62f1b7 = _0x360a78['slice'](_0x512964, _0x5beb93['index']);
    _0x62f1b7 && _0x143732["push"](_0x599c43(_0x62f1b7));
    const _0x37b165 = _0x5beb93["group"]["parts"][_0x5beb93["mediaIndex"]];
    _0x37b165 ? (_0x143732['push'](_0x37b165), _0x19d8c0["add"](_0x5beb93["group"]["kind"] + ':' + _0x5beb93["mediaIndex"])) : _0x143732["push"](_0x599c43(_0x5beb93["text"]));
    _0x512964 = _0x5beb93['endIndex'];
  }
  const _0x3d285b = _0x360a78['slice'](_0x512964);
  _0x3d285b && _0x143732["push"](_0x599c43(_0x3d285b));
  _0x3fe423["forEach"](_0x2f8561 => {
    _0x2f8561["parts"]["forEach"]((_0x1abf22, _0xffeae1) => {
      _0x1abf22 && !_0x19d8c0["has"](_0x2f8561["kind"] + ':' + _0xffeae1) && _0x143732["push"](_0x1abf22);
    });
  });
  if (_0x143732['length'] === 0x0) {
    return _0x3fe423["flatMap"](_0x180d5b => _0x180d5b["parts"]["filter"](Boolean));
  }
  return mergeAdjacentTextParts(_0x143732, {
    'createTextPart': _0x599c43,
    'isTextPart': _0x438c3f
  });
}
function normalizePromptMediaGroups(_0x36456a, _0x5220fa = {}) {
  const _0x194075 = Array['isArray'](_0x36456a) && _0x36456a["some"](_0x1c98d5 => _0x1c98d5 && Array["isArray"](_0x1c98d5["parts"])) ? _0x36456a : [{
    'kind': "image",
    'mentionRe': IMAGE_MENTION_RE,
    'parts': _0x36456a,
    'preserveSlots': _0x5220fa?.["preserveSlots"] === !![]
  }];
  return _0x194075["map"]((_0x52c447, _0x209dc8) => {
    const _0x1d3a23 = _0x52c447?.["preserveSlots"] === !![] || _0x5220fa?.["preserveSlots"] === !![];
    const _0x4cbda2 = Array["isArray"](_0x52c447?.["parts"]) ? _0x1d3a23 ? _0x52c447["parts"]["slice"]() : _0x52c447["parts"]["filter"](Boolean) : [];
    return {
      'kind': String(_0x52c447?.['kind'] || "media" + _0x209dc8),
      'mentionRe': _0x52c447?.["mentionRe"] || IMAGE_MENTION_RE,
      'parts': _0x4cbda2
    };
  });
}
function normalizeChatCompletionMediaInput(_0x2d4437, _0x39f504 = {}) {
  const _0x29bb3e = _0x2d4437 && typeof _0x2d4437 === 'object' && !Array["isArray"](_0x2d4437) ? _0x2d4437 : {};
  const _0x8a4efe = normalizeInputUrls(_0x29bb3e["inputUrls"] !== undefined ? _0x29bb3e['inputUrls'] : _0x2d4437);
  const _0x1ea103 = String(_0x39f504["mediaPolicy"] || _0x29bb3e["mediaPolicy"] || '')['trim']()["toLowerCase"]();
  const _0x9072d8 = _0x39f504["allowVideo"] === !![] || _0x29bb3e["allowVideo"] === !![] || _0x1ea103 === "image-video" || _0x1ea103 === "image-video-audio";
  const _0x5008b5 = _0x39f504['allowAudio'] === !![] || _0x29bb3e['allowAudio'] === !![] || _0x1ea103 === "image-video-audio";
  const _0x34169a = normalizeInputUrls(_0x39f504["inputImageUrls"]);
  const _0x1a1003 = normalizeInputUrls(_0x29bb3e["inputImageUrls"]);
  const _0x2fae15 = normalizeInputUrls(_0x39f504["inputVideoUrls"]);
  const _0x4f6ebb = normalizeInputUrls(_0x29bb3e["inputVideoUrls"]);
  const _0x4c8d1d = normalizeInputUrls(_0x39f504['inputAudioUrls']);
  const _0x4d92f2 = normalizeInputUrls(_0x29bb3e["inputAudioUrls"]);
  const _0x4e200b = splitChatCompletionInputUrls(_0x8a4efe);
  return {
    'inputImageUrls': _0x34169a["length"] > 0x0 ? _0x34169a : _0x1a1003["length"] > 0x0 ? _0x1a1003 : _0x9072d8 ? _0x4e200b["imageUrls"] : _0x8a4efe,
    'inputVideoUrls': _0x9072d8 ? _0x2fae15["length"] > 0x0 ? _0x2fae15 : _0x4f6ebb["length"] > 0x0 ? _0x4f6ebb : _0x4e200b["videoUrls"] : [],
    'inputAudioUrls': _0x5008b5 ? _0x4c8d1d["length"] > 0x0 ? _0x4c8d1d : _0x4d92f2['length'] > 0x0 ? _0x4d92f2 : _0x4e200b['audioUrls'] : []
  };
}
function resolveChatCompletionVideoUrl(_0x5378f9, _0x530bcb) {
  const _0x4fd3ca = String(_0x5378f9 || '')['trim']();
  if (!_0x4fd3ca) {
    return '';
  }
  const _0x1ba48f = normalizeProviderId(_0x530bcb);
  if (_0x1ba48f === "volcengine") {
    if (/^https?:\/\//i["test"](_0x4fd3ca)) {
      return _0x4fd3ca;
    }
    throw new Error("火山方舟视频输入需要公网可访问的视频 URL，当前本地视频无法直接发送");
  }
  if (_0x1ba48f === "grsai") {
    if (/^https?:\/\//i["test"](_0x4fd3ca)) {
      return _0x4fd3ca;
    }
    throw new Error("GRSAI 视频理解需要公网视频 URL；请配置 RunningHub 上传或启用对象存储");
  }
  return resolveInputFetchUrl(_0x4fd3ca);
}
function inferGeminiNativeMediaMimeType(_0x13877f, _0x16d8cc) {
  const _0x8e5edf = String(_0x13877f || '')["trim"]()["toLowerCase"]()["split"](/[?#]/, 0x1)[0x0];
  if (_0x16d8cc === "image") {
    if (_0x8e5edf["endsWith"](".png")) {
      return "image/png";
    }
    if (_0x8e5edf['endsWith'](".webp")) {
      return "image/webp";
    }
    if (_0x8e5edf["endsWith"](".gif")) {
      return 'image/gif';
    }
    return 'image/jpeg';
  }
  if (_0x8e5edf["endsWith"](".webm")) {
    return "video/webm";
  }
  if (_0x8e5edf["endsWith"](".mov")) {
    return "video/quicktime";
  }
  if (_0x8e5edf["endsWith"]('.mpeg') || _0x8e5edf['endsWith'](".mpg")) {
    return "video/mpeg";
  }
  return "video/mp4";
}
function createGeminiNativeFilePart(_0x2265b0, _0x2b2b4d) {
  const _0x3423bb = String(_0x2265b0 || '')["trim"]();
  if (!/^https?:\/\//i["test"](_0x3423bb)) {
    throw new Error("Gemini 原生" + (_0x2b2b4d === "video" ? '视频' : '图片') + "输入需要公网可访问的 URL");
  }
  return {
    'fileData': {
      'mimeType': inferGeminiNativeMediaMimeType(_0x3423bb, _0x2b2b4d),
      'fileUri': _0x3423bb
    }
  };
}
async function buildGeminiNativeVideoUserParts(_0x308ce2, _0x5e07d6, _0x53701b, _0x1170e8, _0x570bea = {}) {
  const _0x17a1e4 = normalizeChatCompletionMediaInput(_0x5e07d6, {
    ..._0x570bea,
    'allowVideo': !![],
    'mediaPolicy': _0x570bea["mediaPolicy"] || "image-video"
  });
  const _0x8970de = String(_0x570bea["uploadProvider"] || _0x1170e8)['trim']();
  const _0x44b9d9 = String(_0x570bea['imageUploadProvider'] || _0x8970de)["trim"]();
  const _0x6135d3 = String(_0x570bea["videoUploadProvider"] || _0x8970de)['trim']();
  const _0x626adb = {
    'getProviderConfig': getProviderConfig,
    'processInputImages': processInputImages,
    'processInputVideos': processInputVideos
  };
  const _0x365566 = _0x1a9879 => {
    const _0x537e79 = normalizeProviderId(_0x1a9879) === normalizeProviderId(_0x1170e8);
    return {
      'fallbackProvider': _0x1a9879,
      ...(_0x537e79 ? {
        'apiKey': _0x53701b,
        'apiUrl': _0x570bea["apiUrl"]
      } : {}),
      'reusePublicUrls': !![],
      'strictUpload': !![]
    };
  };
  const _0x26d721 = _0x17a1e4['inputImageUrls']["length"] > 0x0 ? await uploadModelApiMediaInputs('image', _0x17a1e4['inputImageUrls'], _0x626adb, _0x365566(_0x44b9d9)) : [];
  const _0x10d626 = _0x570bea["videoInputEncoding"] === 'base64';
  const _0x5c8d74 = _0x10d626 ? await encodeTextMediaInputs(_0x17a1e4["inputVideoUrls"], "video", _0x37d990 => a46_0x29a398(resolveInputFetchUrl(_0x37d990), {
    'provider': "remote",
    'responseType': "blob",
    'timeout': GENERATION_TIMEOUT,
    'buildUrl': ![],
    'retries': 0x0,
    'signal': _0x570bea["signal"]
  })) : _0x17a1e4["inputVideoUrls"]['length'] > 0x0 ? await uploadModelApiMediaInputs("video", _0x17a1e4["inputVideoUrls"], _0x626adb, _0x365566(_0x6135d3)) : [];
  const _0x3758ec = _0x26d721["map"](_0x57ed9c => createGeminiNativeFilePart(_0x57ed9c, "image"));
  const _0x14a718 = _0x5c8d74["map"](_0x4b322f => {
    if (!_0x10d626) {
      return createGeminiNativeFilePart(_0x4b322f, 'video');
    }
    const _0x114ed0 = _0x4b322f["indexOf"](',');
    return {
      'inlineData': {
        'mimeType': _0x4b322f["slice"](0x5, _0x4b322f["indexOf"](';')),
        'data': _0x4b322f["slice"](_0x114ed0 + 0x1)
      }
    };
  });
  if (hasImageMentions(_0x308ce2) && _0x17a1e4['inputImageUrls']["length"] > 0x0 && _0x3758ec["length"] === 0x0) {
    throw new Error("参考图片处理失败，无法映射 @图片 引用");
  }
  if (hasVideoMentions(_0x308ce2) && _0x17a1e4["inputVideoUrls"]["length"] > 0x0 && _0x14a718["length"] === 0x0) {
    throw new Error("参考视频处理失败，无法映射 @视频 引用");
  }
  return buildPromptMediaParts(_0x308ce2, [{
    'kind': 'image',
    'mentionRe': IMAGE_MENTION_RE,
    'parts': _0x3758ec,
    'preserveSlots': !![]
  }, {
    'kind': "video",
    'mentionRe': VIDEO_MENTION_RE,
    'parts': _0x14a718,
    'preserveSlots': !![]
  }], {
    'createTextPart': _0x17e380 => ({
      'text': _0x17e380
    }),
    'isTextPart': _0x123cf9 => !!_0x123cf9 && typeof _0x123cf9["text"] === "string"
  });
}
async function buildVolcengineResponsesUserContent(_0x17bc1c, _0x5d9ead, _0x22ebfb, _0x5021cb, _0x17cf1a = {}) {
  const _0x418949 = String(_0x17cf1a['mediaPolicy'] || "image-video")['trim']()['toLowerCase']();
  const _0xd49e03 = normalizeChatCompletionMediaInput(_0x5d9ead, {
    ..._0x17cf1a,
    'allowVideo': !![],
    'allowAudio': _0x17cf1a["allowAudio"] === !![] || _0x418949 === "image-video-audio",
    'mediaPolicy': _0x418949
  });
  const _0x3eb595 = String(_0x17cf1a["model"] || '')["trim"]();
  const _0x446dc7 = _0x17cf1a["forceCustomProviderFreeImageHost"] === !![];
  const _0x2a77f5 = _0xd49e03["inputImageUrls"]["length"] > 0x0 ? _0x446dc7 ? await processInputImagesPreserveOrder(_0xd49e03['inputImageUrls'], '', {
    'applyInputQualityProfile': !![],
    'provider': 'freeImageHost',
    'strictUpload': !![]
  }) : await uploadInputsToVolcengineFiles(_0xd49e03["inputImageUrls"], _0x22ebfb, {
    'baseUrl': _0x17cf1a["baseUrl"],
    'kind': "image",
    'model': _0x3eb595
  }) : [];
  const _0x112d6b = _0xd49e03['inputVideoUrls']['length'] > 0x0 ? await uploadInputsToVolcengineFiles(_0xd49e03["inputVideoUrls"], _0x22ebfb, {
    'baseUrl': _0x17cf1a["baseUrl"],
    'kind': "video",
    'model': _0x3eb595,
    'videoFps': _0x17cf1a['videoFps'] ?? 0.3
  }) : [];
  const _0xcb204e = _0xd49e03["inputAudioUrls"]["length"] > 0x0 ? await uploadInputsToVolcengineFiles(_0xd49e03["inputAudioUrls"], _0x22ebfb, {
    'baseUrl': _0x17cf1a["baseUrl"],
    'kind': 'audio',
    'model': _0x3eb595
  }) : [];
  const _0x568702 = _0x2a77f5["map"](_0x57a510 => {
    const _0x59f23e = String(_0x57a510 || '')["trim"]();
    if (!_0x59f23e) {
      return null;
    }
    return _0x446dc7 ? {
      'type': "input_image",
      'image_url': _0x59f23e
    } : {
      'type': "input_image",
      'file_id': _0x59f23e
    };
  });
  const _0x295394 = _0x112d6b["map"](_0x5251d2 => String(_0x5251d2 || '')["trim"]() ? {
    'type': "input_video",
    'file_id': _0x5251d2
  } : null);
  const _0x15a00e = _0xcb204e["map"](_0x281f21 => String(_0x281f21 || '')["trim"]() ? {
    'type': "input_audio",
    'file_id': _0x281f21
  } : null);
  if (hasImageMentions(_0x17bc1c) && _0xd49e03["inputImageUrls"]['length'] > 0x0 && _0x568702["filter"](Boolean)["length"] === 0x0) {
    throw new Error('参考图片处理失败，无法映射\x20@图片\x20引用');
  }
  if (hasVideoMentions(_0x17bc1c) && _0xd49e03["inputVideoUrls"]["length"] > 0x0 && _0x295394['filter'](Boolean)["length"] === 0x0) {
    throw new Error("参考视频处理失败，无法映射 @视频 引用");
  }
  if (hasAudioMentions(_0x17bc1c) && _0xd49e03['inputAudioUrls']['length'] > 0x0 && _0x15a00e['filter'](Boolean)['length'] === 0x0) {
    throw new Error("参考音频处理失败，无法映射 @音频 引用");
  }
  return buildPromptMediaParts(_0x17bc1c, [{
    'kind': 'image',
    'mentionRe': IMAGE_MENTION_RE,
    'parts': _0x568702,
    'preserveSlots': !![]
  }, {
    'kind': "video",
    'mentionRe': VIDEO_MENTION_RE,
    'parts': _0x295394,
    'preserveSlots': !![]
  }, {
    'kind': "audio",
    'mentionRe': AUDIO_MENTION_RE,
    'parts': _0x15a00e,
    'preserveSlots': !![]
  }], {
    'createTextPart': _0x235b62 => ({
      'type': "input_text",
      'text': _0x235b62
    }),
    'isTextPart': _0x5a68cb => !!_0x5a68cb && _0x5a68cb['type'] === 'input_text'
  });
}
async function buildChatCompletionUserContent(_0x2cb1b1, _0x27cdb7, _0x2837a8, _0x417ab3, _0x31e82f = {}) {
  const _0x461710 = normalizeChatCompletionMediaInput(_0x27cdb7, _0x31e82f);
  const _0xd10152 = _0x461710["inputImageUrls"];
  const _0x45bb8a = _0x461710['inputVideoUrls'];
  const _0x279d9b = normalizeProviderId(_0x417ab3);
  const _0x352a45 = _0x31e82f["forceCustomProviderFreeImageHost"] === !![] || _0x279d9b === 'custom';
  const _0x46490f = _0x279d9b === 'apimart' || _0x279d9b === "grsai" || _0x279d9b === "runninghub";
  const _0x3a8e9d = _0x352a45 || !_0x46490f ? "freeImageHost" : _0x279d9b;
  const _0x5855a9 = _0x46490f && !_0x352a45 ? _0x2837a8 : '';
  const _0x39d6aa = _0x31e82f["mediaInputEncoding"] === "base64";
  const _0x53f46a = _0x4a4eae => a46_0x29a398(resolveInputFetchUrl(_0x4a4eae), {
    'provider': 'remote',
    'responseType': 'blob',
    'timeout': GENERATION_TIMEOUT,
    'buildUrl': ![],
    'retries': 0x0,
    'signal': _0x31e82f["signal"]
  });
  const _0x283e11 = _0x39d6aa ? await encodeTextMediaInputs(_0xd10152, "image", _0x53f46a) : _0xd10152['length'] > 0x0 ? await processInputImagesPreserveOrder(_0xd10152, _0x5855a9, {
    'applyInputQualityProfile': !![],
    'provider': _0x3a8e9d,
    'preferFree': _0x3a8e9d === 'freeImageHost',
    'strictUpload': _0x31e82f["strictUpload"] === !![] || _0x352a45 || _0x279d9b === "agnes"
  }) : [];
  const _0x58e947 = _0x39d6aa ? await encodeTextMediaInputs(_0x45bb8a, "video", _0x53f46a) : _0x45bb8a["length"] > 0x0 ? await uploadModelApiMediaInputs("video", _0x45bb8a, {
    'getProviderConfig': getProviderConfig,
    'processInputVideos': processInputVideos
  }, {
    'fallbackProvider': "runninghub",
    ...(_0x279d9b === "runninghub" ? {
      'apiKey': _0x2837a8,
      'apiUrl': _0x31e82f["apiUrl"],
      'providerProfileId': _0x31e82f["providerProfileId"]
    } : {}),
    'strictUpload': !![],
    'reusePublicUrls': !![]
  }) : _0x45bb8a;
  const _0x33f384 = _0x283e11["map"](_0x5525ba => String(_0x5525ba || '')["trim"]() ? {
    'type': "image_url",
    'image_url': {
      'url': _0x5525ba
    }
  } : null);
  const _0x5094e8 = _0x33f384["filter"](Boolean);
  if (hasImageMentions(_0x2cb1b1) && _0xd10152["length"] > 0x0 && _0x5094e8['length'] === 0x0) {
    throw new Error("参考图片处理失败，无法映射 @图片 引用");
  }
  const _0x326a21 = _0x58e947["map"](_0x475fc4 => {
    const _0xd6999e = resolveChatCompletionVideoUrl(_0x475fc4, _0x417ab3);
    return _0xd6999e ? {
      'type': "video_url",
      'video_url': {
        'url': _0xd6999e
      }
    } : null;
  });
  const _0x2478aa = _0x326a21["filter"](Boolean);
  if (hasVideoMentions(_0x2cb1b1) && _0x45bb8a["length"] > 0x0 && _0x2478aa["length"] === 0x0) {
    throw new Error("参考视频处理失败，无法映射 @视频 引用");
  }
  const _0x5aab76 = buildPromptMediaParts(_0x2cb1b1, [{
    'kind': "image",
    'mentionRe': IMAGE_MENTION_RE,
    'parts': _0x33f384,
    'preserveSlots': !![]
  }, {
    'kind': "video",
    'mentionRe': VIDEO_MENTION_RE,
    'parts': _0x326a21,
    'preserveSlots': !![]
  }], {
    'createTextPart': _0x92028e => ({
      'type': "text",
      'text': _0x92028e
    }),
    'isTextPart': _0x178351 => !!_0x178351 && _0x178351["type"] === 'text'
  });
  if (_0x5aab76["length"] === 0x1 && _0x5aab76[0x0]?.["type"] === 'text') {
    return _0x5aab76[0x0]["text"];
  }
  return _0x5aab76["length"] > 0x0 ? _0x5aab76 : String(_0x2cb1b1 || '');
}
export async function buildGenerateTextRequest(_0x1ac540) {
  await ensureConfig();
  const _0xa6dbb6 = buildFinalTextPrompt(_0x1ac540);
  const _0x3ef4b6 = _0x1ac540["model"] || 'gemini-3.1-pro';
  const _0x5816fb = resolveTextExecution(_0x1ac540, _0x3ef4b6);
  const _0x55c955 = resolveTextProviderId(_0x1ac540, _0x3ef4b6, _0x5816fb);
  assertTextManifestResolution(_0x3ef4b6, _0x55c955, _0x5816fb);
  const _0x59ae0f = normalizeModelProviderProfileId(_0x5816fb?.["modelManifest"] || _0x3ef4b6, _0x1ac540["providerProfileId"]);
  const _0x11abfe = isRunningHubTextModel(_0x55c955, _0x3ef4b6) ? _0x59ae0f || resolveRunningHubModelApiProfileId(_0x5816fb?.["modelManifest"]?.["modelId"] || _0x3ef4b6, _0x1ac540["providerProfileId"]) : '';
  const _0x59a661 = getProviderConfig(_0x59ae0f || _0x11abfe || _0x55c955);
  const _0x563004 = _0x11abfe ? {
    ..._0x59a661,
    'apiUrl': resolveRunningHubModelApiBaseUrl(_0x11abfe)
  } : _0x59a661;
  const _0x3f7ef5 = _0x563004["apiUrl"]["replace"](/\/v1\/?$/, '');
  const _0x2f78ee = isRunningHubTextModel(_0x55c955, _0x3ef4b6) ? _0x563004["modelApiKey"] || _0x1ac540['apiKey'] : _0x1ac540["apiKey"] || _0x563004['apiKey'];
  if (!_0x2f78ee) {
    throw ApiError["authError"](_0x55c955, null, "API Key 未配置（厂商：" + _0x55c955 + "），无法发起文本生成请求");
  }
  const _0x1cabed = normalizeInputUrls(_0x1ac540["inputUrls"]);
  const _0x5d77fe = normalizeInputUrls(_0x1ac540["inputImageUrls"]);
  const _0x1b6e77 = normalizeInputUrls(_0x1ac540["inputVideoUrls"]);
  const _0x5b8d38 = normalizeInputUrls(_0x1ac540['inputAudioUrls']);
  if (isManifestBackedTextExecution(_0x5816fb)) {
    const _0x2e3f4f = await buildTextRequestFromManifest({
      ..._0x1ac540,
      'model': _0x3ef4b6,
      'inputUrls': _0x1cabed,
      'inputImageUrls': _0x5d77fe,
      'inputVideoUrls': _0x1b6e77,
      'inputAudioUrls': _0x5b8d38
    }, _0xa6dbb6, {
      'getProviderConfig': getProviderConfig,
      'buildRunningHubTextImageUrl': buildRunningHubTextImageUrl,
      'resolveChatCompletionInputUrls': resolveChatCompletionInputUrls,
      'buildChatCompletionUserContent': buildChatCompletionUserContent,
      'buildGeminiNativeVideoUserParts': buildGeminiNativeVideoUserParts,
      'buildVolcengineResponsesUserContent': buildVolcengineResponsesUserContent
    }, {
      'expectedProvider': _0x55c955
    });
    if (_0x2e3f4f) {
      return _0x2e3f4f;
    }
    throw getTextManifestMissingError(_0x3ef4b6, _0x55c955);
  }
  const _0x21dc12 = resolveChatCompletionInputUrls({
    'providerId': _0x55c955,
    'inputUrls': _0x1cabed,
    'inputImageUrls': _0x5d77fe,
    'inputVideoUrls': _0x1b6e77,
    'inputAudioUrls': _0x5b8d38
  });
  const _0x1c9490 = await buildChatCompletionUserContent(_0xa6dbb6, _0x21dc12, _0x2f78ee, _0x55c955);
  const _0xfce4be = {
    'model': _0x3ef4b6,
    'stream': ![],
    'messages': [{
      'role': "system",
      'content': _0x1ac540["systemPrompt"] || "You are a helpful assistant."
    }, {
      'role': "user",
      'content': _0x1c9490
    }],
    ...(Math["trunc"](Number(_0x1ac540['maxOutputTokens']) || 0x0) > 0x0 ? {
      'max_tokens': Math["trunc"](Number(_0x1ac540["maxOutputTokens"]))
    } : {}),
    ...buildChatCompletionsStructuredOutput(_0x1ac540["structuredOutput"])
  };
  const _0x3acdfd = getTextStructuredOutputRequestMeta(_0x1ac540["structuredOutput"]);
  if (_0x55c955 === "ppio" || _0x55c955 === 'openai' || _0x55c955 === "grsai") {
    let _0xcaca62;
    if (_0x55c955 === "ppio") {
      _0xcaca62 = a46_0x17b0f3["getTextProxyApiUrl"](_0x3f7ef5);
    } else {
      if (_0x3f7ef5["includes"](":generateContent") || _0x3f7ef5["includes"]("/v1beta/models") || _0x3f7ef5['endsWith']("/chat/completions") || _0x3f7ef5["includes"]("/api/") && _0x3f7ef5["split"]('/api/')["length"] > 0x1) {
        _0xcaca62 = _0x3f7ef5;
      } else {
        if (_0x3f7ef5["endsWith"]("/api")) {
          _0xcaca62 = _0x3f7ef5;
        } else {
          _0x3f7ef5["endsWith"]("/v1") ? _0xcaca62 = _0x3f7ef5 : _0xcaca62 = _0x3f7ef5 + "/v1";
        }
      }
    }
    return {
      'url': '/api/v2/proxy/completions',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': {
        'apiUrl': _0xcaca62,
        'apiKey': _0x2f78ee,
        ..._0xfce4be
      },
      'isProxy': !![],
      'structuredOutput': _0x3acdfd
    };
  }
  let _0x44aae5;
  if (_0x3f7ef5["includes"](":generateContent") || _0x3f7ef5["includes"]("/v1beta/models") || _0x3f7ef5["endsWith"]("/chat/completions") || _0x3f7ef5["includes"]('/api/') && _0x3f7ef5["split"]("/api/")["length"] > 0x1) {
    _0x44aae5 = _0x3f7ef5;
  } else {
    if (_0x3f7ef5["endsWith"]("/api")) {
      _0x44aae5 = _0x3f7ef5 + '/v1/chat/completions';
    } else {
      _0x3f7ef5["endsWith"]('/v1') ? _0x44aae5 = _0x3f7ef5 + '/chat/completions' : _0x44aae5 = _0x3f7ef5 + "/v1/chat/completions";
    }
  }
  return {
    'url': _0x44aae5,
    'headers': {
      'Content-Type': "application/json",
      'Authorization': "Bearer " + _0x2f78ee
    },
    'body': _0xfce4be,
    'isProxy': ![],
    'structuredOutput': _0x3acdfd
  };
}
function parseTextResponse(_0xe818bd, _0x4d11ad) {
  const _0x3dfdcc = '';
  const _0x136f76 = _0xe818bd["length"];
  const _0x445006 = _0xe818bd["slice"](0x0, 0x190);
  const _0x177930 = _0xe818bd["slice"](Math["max"](0x0, _0x136f76 - 0x190));
  const _0x1ea7c9 = /<!doctype\s+html|<html[\s>]/i["test"](_0x445006);
  const _0x1dc4fd = _0xe818bd["replace"](/^\uFEFF/, '')['trim']();
  let _0x3d6e96;
  try {
    _0x3d6e96 = JSON["parse"](_0x1dc4fd);
  } catch (_0x274f6a) {
    const _0x2aa056 = _0x1dc4fd["indexOf"]('{');
    const _0x15e0b6 = _0x1dc4fd["lastIndexOf"]('}');
    if (_0x2aa056 !== -0x1 && _0x15e0b6 > _0x2aa056) {
      try {
        _0x3d6e96 = JSON["parse"](_0x1dc4fd['slice'](_0x2aa056, _0x15e0b6 + 0x1));
      } catch {}
    }
    if (!_0x3d6e96) {
      const _0x2d9e85 = _0x1dc4fd["split"]('\x0a')["filter"](_0x875f2d => _0x875f2d["trim"]()["startsWith"]("data:"));
      if (_0x2d9e85['length'] > 0x0) {
        const _0x297b6d = _0x2d9e85[_0x2d9e85["length"] - 0x1]['replace'](/^data:\s*/, '')["trim"]();
        if (_0x297b6d === "[DONE]") {
          const _0x35eae7 = _0x2d9e85["filter"](_0xb8b5d5 => _0xb8b5d5["replace"](/^data:\s*/, '')["trim"]() !== "[DONE]");
          if (_0x35eae7["length"] > 0x0) {
            const _0x2554a8 = _0x35eae7[_0x35eae7["length"] - 0x1]["replace"](/^data:\s*/, '')["trim"]();
            _0x3d6e96 = JSON['parse'](_0x2554a8);
          } else {
            throw new ApiError({
              'type': "PARSE_ERROR",
              'message': "服务端返回了空响应",
              'status': _0x4d11ad,
              'retryable': ![]
            });
          }
        } else {
          try {
            _0x3d6e96 = JSON["parse"](_0x297b6d);
          } catch (_0x51452a) {
            throw new ApiError({
              'type': 'PARSE_ERROR',
              'message': "无法解析服务端响应: " + _0x51452a["message"],
              'status': _0x4d11ad,
              'retryable': ![]
            });
          }
        }
      } else {
        throw new ApiError({
          'type': "PARSE_ERROR",
          'message': '服务端返回的不是可解析的\x20JSON。HTTP\x20' + _0x4d11ad + (_0x3dfdcc ? '\x20(' + _0x3dfdcc + ')' : '') + "，长度 " + _0x136f76 + '。\x0a' + (_0x1ea7c9 ? "响应看起来像 HTML（常见原因：网关/防火墙拦截、API 地址错误、上游返回了错误页）。\n" : '') + "响应片段(截断)：\n[开头]\n" + _0x445006 + "\n[结尾]\n" + _0x177930,
          'status': _0x4d11ad,
          'retryable': ![]
        });
      }
    }
  }
  return _0x3d6e96;
}
function extractTextContent(_0x35e6a5, _0x19793d = null) {
  const _0x1f25a5 = Array["isArray"](_0x35e6a5?.['output']) ? _0x35e6a5["output"] : Array["isArray"](_0x35e6a5?.["data"]?.["output"]) ? _0x35e6a5["data"]["output"] : [];
  const _0x340e0b = _0x1f25a5["filter"](_0x1c293b => (_0x1c293b?.["type"] === 'message' || _0x1c293b?.['role'] === 'assistant') && Array["isArray"](_0x1c293b?.['content']))['at'](-0x1);
  const _0x583f2e = (_0x340e0b?.['content'] || [])["map"](_0x58ccd6 => typeof _0x58ccd6?.['text'] === "string" ? _0x58ccd6['text']["trim"]() : typeof _0x58ccd6?.['content'] === 'string' ? _0x58ccd6["content"]['trim']() : '')["filter"](Boolean)["join"]('\x0a');
  if (_0x583f2e) {
    return _0x583f2e;
  }
  const _0x8a3236 = resolveMappedResponseValue(_0x35e6a5, _0x19793d?.["resultPaths"] || _0x19793d?.["textFields"] || []);
  if (_0x8a3236) {
    return _0x8a3236;
  }
  const _0x1b284e = _0x35e6a5?.["choices"] || _0x35e6a5?.["data"]?.["choices"];
  let _0x5a6072 = extractChatMessageText(_0x1b284e?.[0x0]?.["message"]?.["content"]);
  !_0x5a6072 && (_0x5a6072 = extractChatMessageText(_0x1b284e?.[0x0]?.["delta"]?.["content"]));
  !_0x5a6072 && (_0x5a6072 = extractChatMessageText(_0x1b284e?.[0x0]?.['message']?.['reasoning_content']));
  !_0x5a6072 && (_0x5a6072 = extractChatMessageText(_0x1b284e?.[0x0]?.['delta']?.['reasoning_content']));
  if (!_0x5a6072) {
    const _0x5d9f63 = _0x35e6a5?.["data"]?.['candidates']?.[0x0]?.["content"]?.['parts'] || _0x35e6a5?.["candidates"]?.[0x0]?.['content']?.['parts'] || [];
    if (Array["isArray"](_0x5d9f63)) {
      const _0x4658c7 = _0x5d9f63["filter"](_0x5019bd => _0x5019bd?.['thought'] !== !![])["map"](_0x3a41d4 => String(_0x3a41d4?.['text'] || '')["trim"]())['filter'](Boolean)["join"]('\x0a');
      _0x5a6072 = _0x4658c7 || _0x5d9f63["map"](_0x3e7e2b => String(_0x3e7e2b?.["text"] || '')['trim']())["filter"](Boolean)['at'](-0x1) || '';
    }
  }
  if (!_0x5a6072) {
    const _0x2c72f9 = _0x1f25a5['flatMap'](_0x167eec => Array["isArray"](_0x167eec?.["content"]) ? _0x167eec["content"] : []);
    _0x5a6072 = pickFirstNonEmptyString(_0x2c72f9["map"](_0x20b025 => _0x20b025?.["text"])) || pickFirstNonEmptyString(_0x2c72f9['map'](_0x4cef46 => _0x4cef46?.["content"])) || pickFirstNonEmptyString([_0x35e6a5?.["output_text"], _0x35e6a5?.["data"]?.["output_text"]]);
  }
  if (!_0x5a6072) {
    const _0x3048eb = Array["isArray"](_0x35e6a5?.['results']) ? _0x35e6a5["results"] : Array["isArray"](_0x35e6a5?.['data']?.["results"]) ? _0x35e6a5["data"]["results"] : [];
    _0x5a6072 = pickFirstNonEmptyString(_0x3048eb["map"](_0x45e3e6 => _0x45e3e6?.["text"])) || pickFirstNonEmptyString([_0x35e6a5?.["text"], _0x35e6a5?.["output"], typeof _0x35e6a5?.['content'] === "string" ? _0x35e6a5["content"] : '', _0x35e6a5?.['markdown'], _0x35e6a5?.["caption"], _0x35e6a5?.["data"]?.['text'], _0x35e6a5?.["data"]?.["output"], typeof _0x35e6a5?.["data"]?.["content"] === "string" ? _0x35e6a5["data"]["content"] : '']);
  }
  return _0x5a6072;
}
async function pollRunningHubTextTask(_0x4fe40f, _0x5350e5, _0x2eac2c, _0x12ae02, _0x470b66 = GENERATION_TIMEOUT, _0xb480f = null) {
  const _0x17892c = Date["now"]();
  while (_0x470b66 === null || Date['now']() - _0x17892c < _0x470b66) {
    await sleep(RUNNINGHUB_POLL_INTERVAL_MS, _0xb480f);
    const _0x48210e = await fetchWithOptionalTimeout(buildApiUrl("/api/v2/proxy/image"), {
      'method': 'POST',
      'headers': {
        'Content-Type': "application/json"
      },
      'body': JSON['stringify']({
        'apiUrl': buildRunningHubModelApiUrl(_0x12ae02, "/openapi/v2/query"),
        'apiKey': _0x5350e5,
        'taskId': _0x4fe40f
      })
    }, _0x470b66 === null ? null : 0x7530, _0xb480f);
    if (!_0x48210e['ok']) {
      const _0x51af9c = await _0x48210e['text']()["catch"](() => '');
      let _0x31fc78;
      try {
        _0x31fc78 = JSON["parse"](_0x51af9c);
      } catch {
        _0x31fc78 = {
          'error': _0x51af9c
        };
      }
      throw parseError(_0x2eac2c, _0x31fc78, _0x48210e["status"]);
    }
    const _0xeba873 = parseRunningHubResponseData(await _0x48210e['text']());
    const _0x387e20 = Number(_0xeba873?.["code"]);
    if (Number["isFinite"](_0x387e20)) {
      if (_0x387e20 === 0x324 || _0x387e20 === 0x32d) {
        continue;
      }
      if (_0x387e20 !== 0x0) {
        throw new Error(getRunningHubTextErrorMessage(_0xeba873, "文本任务轮询失败"));
      }
    }
    const _0x2af2c1 = _0xeba873?.['data'] && typeof _0xeba873["data"] === "object" ? _0xeba873["data"] : _0xeba873;
    const _0x8ba837 = String(_0x2af2c1?.["status"] || '')["toUpperCase"]();
    if (['SUCCESS', "SUCCEEDED", "COMPLETED"]["includes"](_0x8ba837)) {
      return _0x2af2c1;
    }
    if (["FAILED", "FAIL", "ERROR", "CANCELLED", 'CANCELED']["includes"](_0x8ba837)) {
      throw new Error(getRunningHubTextErrorMessage(_0x2af2c1, "文本任务执行失败"));
    }
  }
  throw new Error('文本任务超时，请稍后重试');
}
function fetchWithOptionalTimeout(_0x4fb25a, _0x45f1db, _0x32e5c0, _0x588d20 = null) {
  if (_0x588d20) {
    return fetchWithTimeoutWithSignal(_0x4fb25a, _0x45f1db, _0x32e5c0, _0x588d20);
  }
  if (_0x32e5c0 === null) {
    return fetch(_0x4fb25a, _0x45f1db);
  }
  return fetchWithTimeout(_0x4fb25a, _0x45f1db, _0x32e5c0);
}
async function sendGenerateTextRequest(_0x4b49a0, _0x4f91f0, _0x4b0417 = null) {
  const _0x16c337 = _0x4b49a0["isProxy"] ? buildApiUrl(_0x4b49a0['url']) : _0x4b49a0["url"];
  const _0x4db8cb = _0x4b49a0["isProxy"] && _0x4b49a0['body'] && typeof _0x4b49a0["body"] === "object" && !Array["isArray"](_0x4b49a0['body']) ? {
    ..._0x4b49a0["body"]
  } : _0x4b49a0["body"];
  if (_0x4b49a0["isProxy"] && _0x4db8cb && typeof _0x4db8cb === "object" && !Array["isArray"](_0x4db8cb)) {
    if (_0x4f91f0 === null) {
      _0x4db8cb["disableRequestTimeout"] = !![];
    } else {
      _0x4f91f0 !== GENERATION_TIMEOUT && (_0x4db8cb['requestTimeoutMs'] = _0x4f91f0);
    }
  }
  return await fetchWithOptionalTimeout(_0x16c337, {
    'method': "POST",
    'headers': _0x4b49a0["headers"],
    'body': JSON["stringify"](_0x4db8cb)
  }, _0x4f91f0, _0x4b0417);
}
function createGeneratedTextResult(_0x39f484, _0x49c35d = null, _0x357e47 = null, _0x54b3d6 = '') {
  const _0x1eeffd = String(_0x54b3d6 || '')["trim"]();
  return {
    'text': sanitizeGeneratedText(_0x39f484),
    ...(_0x49c35d ? {
      'structuredOutputFallback': _0x49c35d
    } : {}),
    ...(_0x357e47 ? {
      'transportTiming': _0x357e47
    } : {}),
    ...(_0x1eeffd ? {
      'finishReason': _0x1eeffd
    } : {})
  };
}
function getGeneratedTextFinishReason(_0x34c012) {
  return String(_0x34c012?.["finishReason"] || _0x34c012?.['finish_reason'] || _0x34c012?.["choices"]?.[0x0]?.["finish_reason"] || _0x34c012?.['data']?.["choices"]?.[0x0]?.['finish_reason'] || _0x34c012?.["candidates"]?.[0x0]?.["finishReason"] || _0x34c012?.["data"]?.["candidates"]?.[0x0]?.["finishReason"] || _0x34c012?.["output"]?.['at']?.(-0x1)?.["status"] || _0x34c012?.["data"]?.["output"]?.['at']?.(-0x1)?.['status'] || '')["trim"]();
}
function getTextTransportTimeMs() {
  return typeof globalThis["performance"]?.["now"] === 'function' ? globalThis["performance"]["now"]() : Date["now"]();
}
export async function generateText(_0x4938d2) {
  const _0x4a46a = _0x4938d2?.["model"] || "gemini-3.1-pro";
  const _0x47c3d = resolveTextExecution(_0x4938d2, _0x4a46a);
  if (isCliTextRuntimeExecution(_0x47c3d)) {
    return generateCliRuntimeText(_0x4938d2, _0x47c3d);
  }
  let _0x56d301 = enableTextRequestStreaming(await buildGenerateTextRequest(_0x4938d2), _0x4938d2?.["onText"]);
  const _0x9df87d = resolveTextProviderId(_0x4938d2, _0x4a46a, _0x47c3d);
  const _0x35e81a = resolveGenerationTimeoutMs(_0x4938d2);
  let _0xe76e68 = null;
  const _0x31c6e7 = getTextTransportTimeMs();
  let _0x373755 = _0x31c6e7;
  let _0x18fa2f = _0x31c6e7;
  let _0x3cd59d = _0x31c6e7;
  const _0x19eec4 = () => ({
    'responseHeadersMs': Math["max"](0x0, _0x373755 - _0x31c6e7),
    'responseBodyMs': Math["max"](0x0, _0x3cd59d - _0x18fa2f),
    'totalMs': Math["max"](0x0, getTextTransportTimeMs() - _0x31c6e7)
  });
  let _0x347508;
  try {
    _0x347508 = await sendGenerateTextRequest(_0x56d301, _0x35e81a, _0x4938d2?.["signal"]);
    _0x373755 = getTextTransportTimeMs();
  } catch (_0x3a589a) {
    throw parseNetworkError(_0x9df87d, _0x3a589a, _0x35e81a);
  }
  let _0x403696 = '';
  if (!_0x347508['ok']) {
    _0x403696 = await _0x347508['text']()['catch'](() => '');
    if (shouldRetryWithoutTextStreaming(_0x56d301, _0x347508['status'], _0x403696)) {
      _0x56d301 = {
        ..._0x56d301,
        'body': {
          ..._0x56d301["body"],
          'stream': ![]
        }
      };
      try {
        _0x347508 = await sendGenerateTextRequest(_0x56d301, _0x35e81a, _0x4938d2?.["signal"]);
        _0x373755 = getTextTransportTimeMs();
      } catch (_0x505f6d) {
        throw parseNetworkError(_0x9df87d, _0x505f6d, _0x35e81a);
      }
      _0x403696 = _0x347508['ok'] ? '' : await _0x347508['text']()["catch"](() => '');
    }
    if (shouldFallbackTextStructuredOutput(_0x56d301["structuredOutput"], _0x347508['status'])) {
      const _0x3f1030 = _0x56d301["body"]?.['stream'] === !![] ? _0x4938d2?.["onText"] : null;
      _0xe76e68 = {
        'mode': 'prompt',
        'status': Number(_0x347508["status"]) || 0x0
      };
      _0x56d301 = enableTextRequestStreaming(await buildGenerateTextRequest({
        ..._0x4938d2,
        'structuredOutput': null
      }), _0x3f1030);
      try {
        _0x347508 = await sendGenerateTextRequest(_0x56d301, _0x35e81a, _0x4938d2?.["signal"]);
        _0x373755 = getTextTransportTimeMs();
      } catch (_0x2b1bc6) {
        throw parseNetworkError(_0x9df87d, _0x2b1bc6, _0x35e81a);
      }
      _0x403696 = _0x347508['ok'] ? '' : await _0x347508["text"]()['catch'](() => '');
    }
  }
  if (!_0x347508['ok']) {
    let _0x2be34c;
    try {
      _0x2be34c = JSON["parse"](_0x403696);
    } catch {
      _0x2be34c = {
        'error': _0x403696
      };
    }
    throw parseError(_0x9df87d, _0x2be34c, _0x347508["status"]);
  }
  _0x18fa2f = getTextTransportTimeMs();
  if ((_0x56d301["body"]?.["stream"] === !![] || typeof _0x4938d2?.["onText"] === "function") && /text\/event-stream/i["test"](_0x347508['headers']['get']("content-type") || '')) {
    const _0x2c2bcb = await readTextEventStream(_0x347508, {
      'onText': _0x4938d2["onText"],
      'signal': _0x4938d2["signal"],
      'timeoutMs': _0x35e81a === null ? null : _0x35e81a - (_0x18fa2f - _0x31c6e7)
    });
    _0x3cd59d = getTextTransportTimeMs();
    return {
      ...createGeneratedTextResult(_0x2c2bcb['text'], _0xe76e68, _0x19eec4(), _0x2c2bcb['finishReason']),
      ...extractTextResponseMetadata(_0x2c2bcb["finalResponse"], _0x56d301)
    };
  }
  let _0x15166b;
  try {
    _0x15166b = await _0x347508['text']();
  } catch (_0x5c2f1e) {
    throw parseNetworkError(_0x9df87d, _0x5c2f1e, _0x35e81a);
  }
  _0x3cd59d = getTextTransportTimeMs();
  if (isRunningHubTextModel(_0x9df87d, _0x4938d2['model'])) {
    const _0x38dd77 = parseRunningHubResponseData(_0x15166b);
    const _0x2ebc7c = Number(_0x38dd77?.["code"]);
    if (Number['isFinite'](_0x2ebc7c) && _0x2ebc7c !== 0x0) {
      throw new Error(getRunningHubTextErrorMessage(_0x38dd77, "文本任务创建失败"));
    }
    const _0x59a255 = extractTextContent(_0x38dd77, _0x56d301["responseMapping"]);
    if (_0x59a255) {
      return createGeneratedTextResult(_0x59a255, _0xe76e68, _0x19eec4(), getGeneratedTextFinishReason(_0x38dd77));
    }
    let _0x377230 = _0x38dd77;
    const _0x38d79b = String(_0x38dd77?.["status"] || _0x38dd77?.["data"]?.['status'] || '')["toUpperCase"]();
    const _0x1ef78b = isChatCompletionResponse(_0x38dd77) ? '' : getRunningHubTaskId(_0x38dd77);
    if (["RUNNING", "PENDING", "QUEUED", "SUBMITTED"]["includes"](_0x38d79b) || _0x1ef78b && !["SUCCESS", 'SUCCEEDED', 'COMPLETED']["includes"](_0x38d79b)) {
      if (!_0x1ef78b) {
        throw new Error("RunningHUB 文本任务创建成功但未返回 taskId");
      }
      _0x377230 = await pollRunningHubTextTask(_0x1ef78b, _0x56d301["body"]["apiKey"], _0x9df87d, resolveRunningHubModelApiProfileId(resolveTextExecution(_0x4938d2, _0x4938d2["model"])?.["modelManifest"]?.["modelId"] || _0x4938d2["model"], _0x4938d2?.["providerProfileId"]), _0x35e81a, _0x4938d2?.['signal']);
    } else {
      if (["FAILED", "FAIL", 'ERROR', "CANCELLED", "CANCELED"]['includes'](_0x38d79b)) {
        throw new Error(getRunningHubTextErrorMessage(_0x38dd77, '文本任务创建失败'));
      }
    }
    const _0x4df601 = extractTextContent(_0x377230, _0x56d301["responseMapping"]);
    if (!_0x4df601) {
      throw new ApiError({
        'type': 'PARSE_ERROR',
        'provider': _0x9df87d,
        'message': "RunningHUB 未返回文本内容",
        'raw': _0x377230,
        'retryable': ![]
      });
    }
    return createGeneratedTextResult(_0x4df601, _0xe76e68, _0x19eec4(), getGeneratedTextFinishReason(_0x377230));
  }
  const _0x4e06a1 = parseTextResponse(_0x15166b, _0x347508["status"]);
  if (_0x4e06a1?.['error']) {
    throw parseError(_0x9df87d, _0x4e06a1, _0x347508["status"]);
  }
  const _0xfb34ca = extractTextContent(_0x4e06a1, _0x56d301["responseMapping"]);
  if (!_0xfb34ca) {
    throw new ApiError({
      'type': "PARSE_ERROR",
      'provider': _0x9df87d,
      'message': '服务端未返回文本内容',
      'raw': _0x4e06a1,
      'retryable': ![]
    });
  }
  return {
    ...createGeneratedTextResult(_0xfb34ca, _0xe76e68, _0x19eec4(), getGeneratedTextFinishReason(_0x4e06a1)),
    ...extractTextResponseMetadata(_0x4e06a1, _0x56d301)
  };
}