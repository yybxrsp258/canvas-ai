import { requester } from './requester.js';
import { runTaskSingleFlight } from './taskSingleFlight.js';
import { buildImageNodeStorageFields, hasImageDerivativeFields } from '../src/services/imageDerivativeService.js';
import { buildCanvasLocalImageFields } from '../src/services/canvasMediaLocalService.js';
import { ensureDreaminaVideoModelForTask, getDreaminaVideoModelVersion, normalizeDreaminaVideoDuration, normalizeDreaminaVideoAspectRatio, normalizeDreaminaVideoModel, normalizeDreaminaVideoResolution, normalizeDreaminaVideoRouteMode, resolveDreaminaVideoTaskType, validateDreaminaVideoRouteSelection } from '../src/modules/dreaminaVideoModelHelper.js';
import { localPathToUrl, normalizeLocalPath } from '../src/utils/localMediaPath.js';
const DREAMINA_SUBMIT_TIMEOUT = 0xafc8;
const DREAMINA_QUERY_TIMEOUT = 0xea60;
const DREAMINA_POLL_INTERVAL = 0x7d0;
const DREAMINA_MAX_WAIT = 0xa * 0x3c * 0x3e8;
const DREAMINA_QUERY_RETRIES = 0x2;
const DREAMINA_QUERY_RETRY_DELAY = 0x15e;
const DREAMINA_MAX_TRANSIENT_ERRORS = 0xc;
export const DREAMINA_POLL_TIMEOUT_CODE = "DREAMINA_POLL_TIMEOUT";
const DREAMINA_QUEUE_HINTS = ["queue", 'queued', "waiting", "wait", "pending"];
const DREAMINA_TRANSIENT_ERROR_HINTS = ["timeout", "time out", 'timed\x20out', '超时', '网络', "network", 'connect', "connection", "socket", "econn", 'enotfound', "eai_again", 'temporary', "temporarily", '暂时', '稍后', "busy", "service unavailable", 'rate\x20limit', "too many requests", "429", "500", '502', "503", "504"];
function toStatus(_0x44ba47) {
  const _0x58bb20 = String(_0x44ba47 || '')['trim']()["toLowerCase"]();
  if (["success", "succeeded", "done", "finish", "finished"]["includes"](_0x58bb20)) {
    return "success";
  }
  if (['fail', 'failed', "error"]["includes"](_0x58bb20)) {
    return "failed";
  }
  if (["cancelled", "canceled"]["includes"](_0x58bb20)) {
    return "cancelled";
  }
  return "pending";
}
function collectPayloadObjects(..._0x2bff1e) {
  const _0x1c3366 = [];
  const _0x365d52 = new Set();
  const _0x3d10b8 = (_0x26b144, _0x17a083 = 0x0) => {
    if (!_0x26b144 || _0x17a083 > 0x5) {
      return;
    }
    if (Array["isArray"](_0x26b144)) {
      _0x26b144['forEach'](_0x11df8a => _0x3d10b8(_0x11df8a, _0x17a083 + 0x1));
      return;
    }
    if (typeof _0x26b144 !== "object") {
      return;
    }
    if (_0x365d52["has"](_0x26b144)) {
      return;
    }
    _0x365d52["add"](_0x26b144);
    _0x1c3366["push"](_0x26b144);
    ["data", "result", "queryResult", "listTask", "task", "tasks"]["forEach"](_0x3bc1ad => _0x3d10b8(_0x26b144[_0x3bc1ad], _0x17a083 + 0x1));
  };
  _0x2bff1e["forEach"](_0x2a610e => _0x3d10b8(_0x2a610e, 0x0));
  return _0x1c3366;
}
function firstPayloadString(_0x3c283c, _0x4fc03c) {
  for (const _0x143495 of _0x3c283c) {
    for (const _0x49d585 of _0x4fc03c) {
      const _0x376dd6 = String(_0x143495?.[_0x49d585] || '')["trim"]();
      if (_0x376dd6) {
        return _0x376dd6;
      }
    }
  }
  return '';
}
function extractDreaminaRawStatus(_0x1cb2a1, _0xf4cd19) {
  const _0x458d9f = collectPayloadObjects(_0x1cb2a1, _0xf4cd19)["map"](_0x42b680 => firstPayloadString([_0x42b680], ['status', "gen_status", "genStatus"])["toLowerCase"]())['filter'](Boolean);
  if (_0x458d9f["some"](_0x5dea83 => ["fail", "failed", "error"]["includes"](_0x5dea83))) {
    return "failed";
  }
  if (_0x458d9f["some"](_0x11b68b => ["success", "succeeded", "done", 'finish', 'finished']["includes"](_0x11b68b))) {
    return "success";
  }
  return '';
}
function extractDreaminaRawFailReason(_0x19d529, _0x1befa7) {
  return firstPayloadString(collectPayloadObjects(_0x19d529, _0x1befa7), ['failReason', "fail_reason", "failureReason", 'failure_reason']);
}
function extractDreaminaRawErrorMessage(_0x1dbdf2, _0x1a1cba) {
  return firstPayloadString(collectPayloadObjects(_0x1dbdf2, _0x1a1cba), ["error", "errorMessage", "message", 'msg']);
}
function isDreaminaTerminalFailureMessage(_0x4dfedc) {
  const _0x2193f7 = String(_0x4dfedc || '')["trim"]()["toLowerCase"]();
  if (!_0x2193f7) {
    return ![];
  }
  return ['失败', "审核未通过", '内容安全', '安全审核', '违规', '敏感', "不符合", '拦截', '风控', "failed", 'failure', "error", "review failed", "content safety", "content filter", "violation", "sensitive", "flagged", 'blocked', "not allowed"]["some"](_0x86b09 => _0x2193f7["includes"](_0x86b09));
}
function normalizeResolutionType(_0x245036) {
  const _0x24f5df = String(_0x245036 || '')['trim']();
  if (!_0x24f5df) {
    return '';
  }
  return _0x24f5df['toLowerCase']();
}
function normalizeDreaminaGenerateNum(_0xe33ec9 = {}) {
  const _0xa2c08f = _0xe33ec9?.['generateNum'] ?? _0xe33ec9?.["generate_num"] ?? _0xe33ec9?.['batchSize'] ?? 0x1;
  const _0x2dc4d2 = Number["parseInt"](_0xa2c08f, 0xa);
  if (!Number['isFinite'](_0x2dc4d2)) {
    return 0x1;
  }
  return Math["max"](0x1, Math["min"](0xa, _0x2dc4d2));
}
function toTrimmedArray(_0x1783d6) {
  if (!Array["isArray"](_0x1783d6)) {
    return [];
  }
  const _0x2068bc = [];
  _0x1783d6["forEach"](_0x23c91b => {
    const _0x82776d = String(_0x23c91b || '')['trim']();
    if (_0x82776d) {
      _0x2068bc["push"](_0x82776d);
    }
  });
  return _0x2068bc;
}
function basenameFromPath(_0x4a364f) {
  const _0x4c18f7 = String(_0x4a364f || '')["trim"]()["replace"](/\\/g, '/');
  if (!_0x4c18f7) {
    return '';
  }
  return _0x4c18f7["split"]('/')["filter"](Boolean)["pop"]() || '';
}
export function normalizeDreaminaErrorMessage(_0x5d623a) {
  const _0x2d37a3 = String(_0x5d623a || '')["trim"]();
  if (!_0x2d37a3) {
    return '';
  }
  const _0x2463ed = _0x2d37a3["toLowerCase"]();
  if (_0x2463ed["includes"]("do request:") && (_0x2463ed["includes"]("context deadline exceeded") || _0x2463ed["includes"]('client.timeout') || _0x2463ed["includes"]("awaiting headers"))) {
    return '即梦官方生成接口响应超时，本次没有拿到任务ID。网页可用不代表\x20CLI\x20生成接口稳定，请稍后重试；如果连续出现，请切换网络/代理或重新登录即梦后再试。';
  }
  let _0x44bba4 = _0x2d37a3["match"](/upload resource\s+"([^"]+)"\s*:\s*upload (video|audio)\s*:\s*duration\s+([0-9.]+)\s+seconds\s+is\s+out\s+of\s+allowed\s+range\s+\[\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\]/i);
  !_0x44bba4 && (_0x44bba4 = _0x2d37a3["match"](/upload (video|audio)\s*:\s*duration\s+([0-9.]+)\s+seconds\s+is\s+out\s+of\s+allowed\s+range\s+\[\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\]/i), _0x44bba4 && (_0x44bba4 = ['', '', ..._0x44bba4["slice"](0x1)]));
  if (_0x44bba4) {
    const [, _0xb88983, _0x200744, _0x475778, _0x44e736, _0x1959d2] = _0x44bba4;
    const _0x20253d = String(_0x200744 || '')["toLowerCase"]() === 'audio';
    const _0x53d925 = basenameFromPath(_0xb88983);
    const _0x122b74 = _0x20253d ? "源音频" : '源视频';
    const _0x337b24 = _0x53d925 ? '“' + _0x53d925 + '”' : _0x122b74;
    const _0x2efb1c = _0x20253d ? "请将音频裁剪到 " + _0x1959d2 + '\x20秒以内后再上传。' : "请将视频裁剪到 " + _0x1959d2 + " 秒以内，建议裁到 14.9 秒后再上传。";
    return '上传' + _0x122b74 + '失败：' + _0x337b24 + '时长\x20' + _0x475778 + '\x20秒，超出即梦允许范围（' + _0x44e736 + '-' + _0x1959d2 + " 秒）。" + _0x2efb1c;
  }
  return _0x2d37a3;
}
function normalizeDreaminaThrownError(_0x190378) {
  if (_0x190378 && typeof _0x190378 === "object") {
    const _0x2b095d = normalizeDreaminaErrorMessage(_0x190378["message"]);
    if (_0x2b095d) {
      _0x190378["message"] = _0x2b095d;
    }
  }
  return _0x190378;
}
function normalizeModelVersion(_0x4a8f2d) {
  const _0x5c6446 = String(_0x4a8f2d?.["modelVersion"] || '')["trim"]();
  if (_0x5c6446) {
    return _0x5c6446;
  }
  const _0x482aa9 = String(_0x4a8f2d?.["model"] || '')['trim']();
  if (!_0x482aa9["startsWith"]("dreamina/")) {
    return '';
  }
  const _0x3e3882 = _0x482aa9["slice"]('dreamina/'["length"])['trim']();
  if (_0x3e3882 === "text2image" || _0x3e3882 === "image2image" || _0x3e3882 === 'text2video' || _0x3e3882 === "image2video") {
    return '';
  }
  return _0x3e3882;
}
function normalizeDreaminaRatio(_0x557a00, _0x70175d) {
  const _0x534cde = String(_0x557a00?.["aspectRatio"] || '')["trim"]();
  if (!_0x534cde) {
    return '';
  }
  if (_0x534cde === "自适应" || _0x534cde === "auto") {
    return _0x70175d ? '' : "1:1";
  }
  return _0x534cde;
}
function toLocalPath(_0x1d61a5) {
  return normalizeLocalPath(_0x1d61a5);
}
function toLocalUrl(_0x18f7df) {
  return localPathToUrl(_0x18f7df);
}
function normalizeOutputsArray(_0x315e3c) {
  const _0x12dc5a = [];
  const _0x3c9ce4 = new Set();
  const _0x361a85 = new Set(['data', 'result', 'results', "output", "outputs", "raw", "queryResult", "image", "images", "image_list", "imageList", "image_infos", 'imageInfos', "video", "videos", 'video_list', "videoList", "video_infos", "videoInfos", "media", "medias", 'media_list', 'mediaList', "file", 'files', 'file_list', "fileList", "resource", "resources", 'download', "downloads", "content", 'contents']);
  const _0x55635c = ['url', "uri", "download_url", 'downloadUrl', "file_url", 'fileUrl', "media_url", "mediaUrl", "image_url", "imageUrl", 'origin_image_url', "originImageUrl", "original_image_url", "originalImageUrl", "result_image_url", "resultImageUrl", "video_url", "videoUrl", "cover_url", "coverUrl", 'src'];
  const _0x3de6aa = ["local_path", "localPath", "path", "file_path", "filePath", 'download_path', "downloadPath", "local_uri", "localUri"];
  const _0x329597 = (_0x159d6f, _0x42f021) => {
    for (const _0x4f44d3 of _0x42f021) {
      const _0x3ef3f7 = String(_0x159d6f?.[_0x4f44d3] || '')['trim']();
      if (_0x3ef3f7) {
        return _0x3ef3f7;
      }
    }
    return '';
  };
  const _0x31a7cf = _0x5936f3 => {
    if (!_0x5936f3 || typeof _0x5936f3 !== 'object') {
      return;
    }
    const _0x1f0e9e = _0x329597(_0x5936f3, _0x55635c);
    const _0x4c6fd9 = _0x329597(_0x5936f3, _0x3de6aa);
    const _0x13ca5f = String(_0x5936f3?.['mimeType'] || _0x5936f3?.["mime_type"] || '')["trim"]();
    if (!_0x1f0e9e && !_0x4c6fd9) {
      return;
    }
    const _0x55957d = [_0x1f0e9e, _0x4c6fd9, _0x13ca5f]["join"]('|');
    if (_0x3c9ce4['has'](_0x55957d)) {
      return;
    }
    _0x3c9ce4["add"](_0x55957d);
    _0x12dc5a["push"](_0x5936f3);
  };
  const _0xc1e242 = _0x1c905c => {
    const _0x575106 = String(_0x1c905c || '')["trim"]();
    const _0x7d376b = _0x575106["toLowerCase"]();
    if (_0x7d376b['includes']("input") || _0x7d376b["includes"]("reference") || _0x7d376b["includes"]("prompt")) {
      return ![];
    }
    return _0x361a85['has'](_0x575106) || _0x7d376b['includes']('output') || _0x7d376b["includes"]("result") || _0x7d376b["includes"]("image") || _0x7d376b['includes']("video") || _0x7d376b['includes']("media") || _0x7d376b["includes"]("file") || _0x7d376b["includes"]("url") || _0x7d376b["includes"]("uri");
  };
  const _0xe8d1f9 = (_0x37d2ff, _0x3ef14a = 0x0) => {
    if (!_0x37d2ff || _0x3ef14a > 0x8) {
      return;
    }
    if (typeof _0x37d2ff === "string") {
      const _0xfaf512 = _0x37d2ff["trim"]();
      if (/^https?:\/\//i["test"](_0xfaf512)) {
        _0x31a7cf({
          'url': _0xfaf512
        });
      }
      return;
    }
    if (Array['isArray'](_0x37d2ff)) {
      _0x37d2ff["forEach"](_0x43ccc0 => _0xe8d1f9(_0x43ccc0, _0x3ef14a + 0x1));
      return;
    }
    if (typeof _0x37d2ff !== 'object') {
      return;
    }
    _0x31a7cf({
      'url': _0x329597(_0x37d2ff, _0x55635c),
      'localPath': _0x329597(_0x37d2ff, _0x3de6aa),
      'mimeType': String(_0x37d2ff?.["mimeType"] || _0x37d2ff?.["mime_type"] || '')['trim'](),
      ...(hasImageDerivativeFields(_0x37d2ff) ? buildImageNodeStorageFields(_0x37d2ff) : {})
    });
    Object["entries"](_0x37d2ff)["forEach"](([_0x3df69c, _0x355165]) => {
      if (_0xc1e242(_0x3df69c)) {
        _0xe8d1f9(_0x355165, _0x3ef14a + 0x1);
      }
    });
  };
  _0xe8d1f9(_0x315e3c);
  return _0x12dc5a['map'](_0x4b319c => {
    const _0x9b7c64 = toLocalPath(_0x4b319c?.["localPath"]);
    return {
      'url': String(_0x4b319c?.["url"] || '')["trim"](),
      'localPath': _0x9b7c64,
      'localUrl': toLocalUrl(_0x9b7c64),
      'mimeType': String(_0x4b319c?.['mimeType'] || '')["trim"](),
      ...(hasImageDerivativeFields(_0x4b319c) ? buildImageNodeStorageFields(_0x4b319c) : {})
    };
  })["filter"](_0x2537c4 => _0x2537c4['url'] || _0x2537c4["localPath"]);
}
function hasDreaminaUsableOutputs(_0x36a0df) {
  return normalizeOutputsArray(_0x36a0df)['length'] > 0x0;
}
function normalizeQueueMetric(_0x3c6d8a) {
  const _0x4ffb08 = Number(_0x3c6d8a);
  if (!Number["isFinite"](_0x4ffb08) || _0x4ffb08 < 0x0) {
    return null;
  }
  return Math["trunc"](_0x4ffb08);
}
function normalizeQueueStatus(_0x23e194) {
  return String(_0x23e194 || '')["trim"]()["toLowerCase"]();
}
function isDreaminaQueuedState(_0xf6f7ec, _0xf78a19) {
  if (_0xf6f7ec !== "pending") {
    return ![];
  }
  if (!_0xf78a19) {
    return ![];
  }
  return DREAMINA_QUEUE_HINTS["some"](_0x448fe3 => _0xf78a19["includes"](_0x448fe3));
}
function phaseToLabel(_0x3a9afc, _0x58cb69 = '') {
  if (_0x3a9afc === "queued") {
    return '排队中';
  }
  if (_0x3a9afc === 'generating') {
    return '生成中';
  }
  if (_0x3a9afc === "syncing") {
    return "正在同步结果";
  }
  if (_0x3a9afc === "done") {
    return "已完成";
  }
  if (_0x3a9afc === 'failed') {
    return String(_0x58cb69 || '')["trim"]() || "查询失败";
  }
  return "处理中";
}
function sleep(_0x94c4b) {
  return new Promise(_0x35ee4c => setTimeout(_0x35ee4c, _0x94c4b));
}
function includesTransientHint(_0xd7fabd) {
  const _0x297ad8 = String(_0xd7fabd || '')["trim"]()["toLowerCase"]();
  if (!_0x297ad8) {
    return ![];
  }
  return DREAMINA_TRANSIENT_ERROR_HINTS['some'](_0x310b11 => _0x297ad8["includes"](_0x310b11));
}
function isTransientDreaminaError(_0xcc827c) {
  if (_0xcc827c?.["dreaminaReturnedError"] === !![]) {
    return ![];
  }
  const _0xc072da = String(_0xcc827c?.["code"] || '')["trim"]()["toUpperCase"]();
  const _0x3d54f9 = String(_0xcc827c?.["type"] || '')['trim']()["toUpperCase"]();
  const _0x264b90 = Number(_0xcc827c?.["status"]);
  if (_0xc072da === "TIMEOUT" || _0xc072da === "ETIMEDOUT" || _0xc072da === "ECONNRESET" || _0xc072da === "ECONNREFUSED" || _0xc072da === "ENOTFOUND" || _0xc072da === "EAI_AGAIN") {
    return !![];
  }
  if (_0x3d54f9 === "TIMEOUT" || _0x3d54f9 === "NETWORK_ERROR" || _0x3d54f9 === "DNS_ERROR" || _0x3d54f9 === "RATE_LIMIT" || _0x3d54f9 === "SERVER_ERROR" || _0x3d54f9 === "SERVICE_UNAVAILABLE") {
    return !![];
  }
  if (_0x264b90 === 0x1ad || _0x264b90 >= 0x1f4) {
    return !![];
  }
  return includesTransientHint(_0xcc827c?.["message"] || _0xcc827c);
}
export function normalizeDreaminaTaskSnapshot(_0x3546a2, _0xbff503 = {}) {
  const _0x27e3e9 = String(_0xbff503?.["submitId"] || _0x3546a2?.["submitId"] || _0x3546a2?.["raw"]?.['submitId'] || '')["trim"]();
  const _0x2da2b4 = normalizeOutputsArray(_0x3546a2);
  const _0x4e9fc4 = toStatus(_0x3546a2?.["status"]);
  const _0x507985 = _0x3546a2?.["raw"] && typeof _0x3546a2['raw'] === "object" && !Array['isArray'](_0x3546a2['raw']) ? _0x3546a2["raw"] : {};
  const _0x5b08d2 = extractDreaminaRawStatus(_0x3546a2, _0x507985);
  const _0x543ce7 = normalizeQueueStatus(_0x507985["queue_status"] || _0x507985["queueStatus"] || _0x3546a2?.["queueStatus"]);
  const _0x4b457a = normalizeQueueMetric(_0x507985["queue_idx"] ?? _0x507985["queueIndex"] ?? _0x3546a2?.["queueIndex"]);
  const _0x19a299 = normalizeQueueMetric(_0x507985['queue_length'] ?? _0x507985["queueLength"] ?? _0x3546a2?.["queueLength"]);
  const _0x3ee8bc = extractDreaminaRawFailReason(_0x3546a2, _0x507985);
  const _0x51d620 = extractDreaminaRawErrorMessage(_0x3546a2, _0x507985);
  const _0x1817e8 = _0x5b08d2 === "failed" || _0x4e9fc4 === 'failed';
  const _0x564550 = _0x1817e8 || isDreaminaTerminalFailureMessage(_0x51d620) ? _0x51d620 : '';
  const _0x54e2c4 = _0x3ee8bc || _0x564550;
  const _0x32556d = _0x1817e8 || _0x54e2c4 ? 'failed' : _0x5b08d2 || _0x4e9fc4;
  let _0x2f9ca0 = 'generating';
  if (_0x32556d === 'failed') {
    _0x2f9ca0 = "failed";
  } else {
    if (_0x32556d === "cancelled") {
      _0x2f9ca0 = 'cancelled';
    } else {
      if (_0x32556d === "success") {
        _0x2f9ca0 = _0x2da2b4["length"] > 0x0 ? 'done' : "syncing";
      } else {
        isDreaminaQueuedState(_0x32556d, _0x543ce7) && (_0x2f9ca0 = "queued");
      }
    }
  }
  const _0x1b6e89 = _0x32556d === "failed" ? 'failed' : _0x32556d === "cancelled" ? "cancelled" : _0x32556d === "success" && _0x2da2b4['length'] > 0x0 ? "success" : "pending";
  return {
    'submitId': _0x27e3e9,
    'status': _0x1b6e89,
    'phase': _0x2f9ca0,
    'label': phaseToLabel(_0x2f9ca0, _0x54e2c4),
    'queueStatus': _0x543ce7,
    'queueIndex': _0x4b457a,
    'queueLength': _0x19a299,
    'outputs': _0x2da2b4,
    'failReason': _0x54e2c4,
    'raw': _0x507985,
    'isTerminal': _0x2f9ca0 === 'done' || _0x2f9ca0 === 'failed' || _0x2f9ca0 === "cancelled",
    'hasOutputs': _0x2da2b4["length"] > 0x0,
    'lastCheckedAt': Date["now"]()
  };
}
function postJson(_0x5b8bc1, _0x1d931e) {
  return requester({
    'url': _0x5b8bc1,
    'method': "POST",
    'provider': "dreamina",
    'timeout': DREAMINA_SUBMIT_TIMEOUT,
    'headers': {
      'Content-Type': "application/json"
    },
    'body': JSON["stringify"](_0x1d931e || {})
  });
}
export async function submitDreaminaText2Image(_0x5c493a) {
  return postJson("/api/v2/dreamina/text2image", _0x5c493a);
}
export async function submitDreaminaImage2Image(_0x523839) {
  return postJson("/api/v2/dreamina/image2image", _0x523839);
}
export async function submitDreaminaImageUpscale(_0x32d50d) {
  return postJson('/api/v2/dreamina/image_upscale', _0x32d50d);
}
export async function submitDreaminaText2Video(_0x4248cf) {
  return postJson("/api/v2/dreamina/text2video", _0x4248cf);
}
export async function submitDreaminaImage2Video(_0x54d3ef) {
  return postJson("/api/v2/dreamina/image2video", _0x54d3ef);
}
export async function submitDreaminaFrames2Video(_0x42574a) {
  return postJson('/api/v2/dreamina/frames2video', _0x42574a);
}
export async function submitDreaminaMultiframe2Video(_0x1f5d37) {
  return postJson('/api/v2/dreamina/multiframe2video', _0x1f5d37);
}
export async function submitDreaminaMultimodal2Video(_0x47a2b7) {
  return postJson("/api/v2/dreamina/multimodal2video", _0x47a2b7);
}
export async function cancelDreaminaVideoQueueTask(_0x50fafe) {
  const _0x3880b1 = String(_0x50fafe || '')["trim"]();
  if (!_0x3880b1) {
    throw new Error("submitId 不能为空");
  }
  const _0x4d5c4f = await postJson("/api/v2/dreamina/video_queue/cancel", {
    'submitId': _0x3880b1
  });
  if (_0x4d5c4f?.["success"] === ![]) {
    throw new Error(_0x4d5c4f?.["message"] || "取消即梦视频队列任务失败");
  }
  return _0x4d5c4f || {};
}
export async function queryDreaminaResult(_0x2bcc3a, _0x2cc357 = {}) {
  const _0x33cf69 = String(_0x2bcc3a || '')["trim"]();
  if (!_0x33cf69) {
    throw new Error('submitId\x20不能为空');
  }
  const _0x27c4f6 = _0x2cc357?.["autoDownload"] !== ![];
  const _0x3b3885 = new URLSearchParams({
    'submitId': _0x33cf69,
    'autoDownload': _0x27c4f6 ? '1' : '0'
  });
  const _0x2cb705 = await requester({
    'url': "/api/v2/dreamina/query_result?" + _0x3b3885["toString"](),
    'method': "GET",
    'provider': "dreamina",
    'signal': _0x2cc357?.["signal"],
    'timeout': DREAMINA_QUERY_TIMEOUT,
    'retries': Number["isFinite"](Number(_0x2cc357?.['retries'])) ? Math['max'](0x0, Math["trunc"](Number(_0x2cc357['retries']))) : DREAMINA_QUERY_RETRIES,
    'retryDelay': Number["isFinite"](Number(_0x2cc357?.["retryDelay"])) ? Math["max"](0x0, Math["trunc"](Number(_0x2cc357["retryDelay"]))) : DREAMINA_QUERY_RETRY_DELAY
  });
  if (_0x2cb705?.['success'] === ![]) {
    const _0x5606e9 = new Error(normalizeDreaminaErrorMessage(_0x2cb705?.["message"]) || '即梦任务查询失败');
    _0x5606e9["code"] = "DREAMINA_RETURNED_ERROR";
    _0x5606e9["dreaminaReturnedError"] = !![];
    throw _0x5606e9;
  }
  return _0x2cb705 || {};
}
async function pollDreaminaUntilDoneOnce(_0x535276, _0x45fc9d = {}) {
  const _0x4b0e9a = Number(_0x45fc9d?.['maxWaitMs'] || DREAMINA_MAX_WAIT);
  const _0x36da20 = Number(_0x45fc9d?.['intervalMs'] || DREAMINA_POLL_INTERVAL);
  const _0x495740 = Number["isFinite"](Number(_0x45fc9d?.["maxTransientErrors"])) ? Math["max"](0x0, Math["trunc"](Number(_0x45fc9d["maxTransientErrors"]))) : DREAMINA_MAX_TRANSIENT_ERRORS;
  const _0x38ca7a = Date["now"]();
  let _0xafa794 = null;
  let _0x5c8b28 = 0x0;
  while (Date["now"]() - _0x38ca7a < _0x4b0e9a) {
    if (_0x45fc9d?.['signal']?.["aborted"]) {
      throw new Error("CANCELLED");
    }
    let _0x2b042e = null;
    try {
      _0xafa794 = await queryDreaminaResult(_0x535276, {
        'autoDownload': !![]
      });
      _0x2b042e = normalizeDreaminaTaskSnapshot(_0xafa794, {
        'submitId': _0x535276
      });
    } catch (_0x331252) {
      if (_0x45fc9d?.["signal"]?.["aborted"] || _0x331252?.['name'] === "AbortError" || _0x331252?.["message"] === 'CANCELLED') {
        throw _0x331252;
      }
      if (isTransientDreaminaError(_0x331252)) {
        _0x5c8b28 += 0x1;
        if (_0x5c8b28 > _0x495740) {
          const _0x2dfc60 = new Error('即梦任务查询连续异常（' + _0x5c8b28 + " 次），请稍后重试");
          _0x2dfc60["code"] = "DREAMINA_QUERY_TRANSIENT_EXHAUSTED";
          _0x2dfc60["submitId"] = String(_0x535276 || '')["trim"]();
          _0x2dfc60["cause"] = _0x331252;
          throw _0x2dfc60;
        }
        await sleep(_0x36da20);
        continue;
      }
      throw _0x331252;
    }
    _0x5c8b28 = 0x0;
    typeof _0x45fc9d?.["onProgress"] === "function" && (await _0x45fc9d["onProgress"](_0x2b042e));
    const _0x1069c9 = toStatus(_0x2b042e?.["status"]);
    if (_0x1069c9 === 'cancelled') {
      throw new Error('CANCELLED');
    }
    if (_0x1069c9 === 'failed') {
      return _0xafa794;
    }
    if (_0x1069c9 === 'success' && hasDreaminaUsableOutputs(_0xafa794)) {
      return _0xafa794;
    }
    await sleep(_0x36da20);
  }
  try {
    const _0x47977b = await queryDreaminaResult(_0x535276, {
      'autoDownload': !![]
    });
    const _0x37849e = normalizeDreaminaTaskSnapshot(_0x47977b, {
      'submitId': _0x535276
    });
    typeof _0x45fc9d?.["onProgress"] === 'function' && (await _0x45fc9d["onProgress"](_0x37849e));
    const _0x13c179 = toStatus(_0x37849e?.['status']);
    if (_0x13c179 === 'cancelled') {
      throw new Error('CANCELLED');
    }
    if (_0x13c179 === "failed") {
      return _0x47977b;
    }
    if (_0x13c179 === "success" && hasDreaminaUsableOutputs(_0x47977b)) {
      return _0x47977b;
    }
    _0xafa794 = _0x47977b;
  } catch (_0x4bc7af) {
    throw _0x4bc7af;
  }
  const _0x3de9d6 = Number['isFinite'](_0x4b0e9a) && _0x4b0e9a > 0x0 ? Math["max"](0x1, Math["ceil"](_0x4b0e9a / 0xea60)) : 0x0;
  const _0x388d95 = new Error(_0x3de9d6 > 0x0 ? '即梦任务处理超时（已等待约\x20' + _0x3de9d6 + " 分钟）" : '即梦任务处理超时，请稍后重试');
  _0x388d95["code"] = DREAMINA_POLL_TIMEOUT_CODE;
  _0x388d95["submitId"] = String(_0x535276 || '')["trim"]();
  throw _0x388d95;
}
export async function pollDreaminaUntilDone(_0x4c7dfb, _0x174459 = {}) {
  const _0x18e5ed = String(_0x4c7dfb || '')["trim"]();
  const _0x5772a3 = String(_0x174459?.['taskKind'] || _0x174459?.['kind'] || "task")["trim"]() || "task";
  return runTaskSingleFlight({
    'provider': "dreamina",
    'kind': _0x5772a3,
    'submitId': _0x18e5ed
  }, () => pollDreaminaUntilDoneOnce(_0x18e5ed, _0x174459));
}
function getDreaminaImageUpscaleInputImage(_0x67383a = {}) {
  const _0x480220 = String(_0x67383a?.["inputUrlsBySlot"]?.["image"] || '')["trim"]();
  if (_0x480220) {
    return _0x480220;
  }
  const _0x31868e = String(_0x67383a?.["image"] || _0x67383a?.["imageUrl"] || _0x67383a?.["inputImage"] || '')["trim"]();
  if (_0x31868e) {
    return _0x31868e;
  }
  const _0x4e4b5f = Array["isArray"](_0x67383a?.["inputUrls"]) ? _0x67383a["inputUrls"] : [];
  return String(_0x4e4b5f["find"](_0x1f0800 => String(_0x1f0800 || '')["trim"]()) || '')["trim"]();
}
function normalizeDreaminaImageUpscaleResolution(_0x1cb1ac = {}) {
  const _0x39cc60 = normalizeResolutionType(_0x1cb1ac?.["resolutionType"] ?? _0x1cb1ac?.["resolution_type"] ?? _0x1cb1ac?.["imageSize"]);
  if (_0x39cc60 === '4k' || _0x39cc60 === '8k') {
    return _0x39cc60;
  }
  return '2k';
}
export function buildDreaminaImageUpscaleSubmitPayload(_0x4f3a8c = {}) {
  const _0x4b3d04 = getDreaminaImageUpscaleInputImage(_0x4f3a8c);
  if (!_0x4b3d04) {
    throw new Error("即梦图片超清/放大需要 1 张输入图片");
  }
  return {
    'image': _0x4b3d04,
    'resolutionType': normalizeDreaminaImageUpscaleResolution(_0x4f3a8c)
  };
}
export async function runDreaminaImageUpscaleGeneration(_0x345db4, _0x299d10 = {}) {
  const _0x2ec188 = await submitDreaminaImageUpscale(buildDreaminaImageUpscaleSubmitPayload(_0x345db4));
  if (_0x2ec188?.["success"] === ![]) {
    throw new Error(normalizeDreaminaErrorMessage(_0x2ec188?.["message"]) || "即梦图片超清/放大任务提交失败");
  }
  const _0x3875bf = String(_0x2ec188?.["submitId"] || '')["trim"]();
  if (!_0x3875bf) {
    throw new Error("即梦图片超清/放大任务提交失败：未返回 submitId");
  }
  _0x299d10?.["onTaskMeta"]?.({
    'taskId': _0x3875bf,
    'submitId': _0x3875bf,
    'provider': "dreamina",
    'kind': "image"
  });
  _0x299d10?.["onTaskId"]?.(_0x3875bf);
  const _0x5aa8ba = await pollDreaminaUntilDone(_0x3875bf, {
    ..._0x299d10,
    'taskKind': 'image'
  });
  const _0x541e60 = normalizeDreaminaTaskSnapshot(_0x5aa8ba, {
    'submitId': _0x3875bf
  });
  if (_0x541e60?.["phase"] === "failed") {
    throw new Error(normalizeDreaminaErrorMessage(_0x541e60?.["failReason"]) || "即梦图片超清/放大失败");
  }
  const _0x2ff480 = Array["isArray"](_0x541e60?.["outputs"]) ? _0x541e60["outputs"] : [];
  if (!_0x2ff480["length"]) {
    throw new Error('即梦图片超清/放大完成，但没有可用输出');
  }
  return _0x2ff480["map"](_0x494da0 => {
    const _0x394730 = _0x494da0["localUrl"] || _0x494da0["url"];
    return {
      'sourceId': null,
      'thumbId': null,
      'sourceUrl': _0x494da0["url"] || _0x394730,
      'thumbUrl': _0x394730,
      'imageUrl': _0x394730,
      'localPath': _0x494da0["localPath"] || '',
      ...(hasImageDerivativeFields(_0x494da0) ? buildCanvasLocalImageFields(_0x494da0) : {})
    };
  });
}
export async function runDreaminaImageGeneration(_0x22d97b, _0x39926e = {}) {
  const _0x3b6d5a = String(_0x22d97b?.["prompt"] || '')["trim"]();
  const _0x5e2fa3 = Array["isArray"](_0x22d97b?.["inputUrls"]) ? _0x22d97b['inputUrls']["filter"](Boolean) : [];
  const _0x3f4040 = _0x5e2fa3['length'] > 0x0;
  const _0x2eeced = normalizeDreaminaRatio(_0x22d97b, _0x3f4040);
  const _0x2bd015 = normalizeResolutionType(_0x22d97b?.["imageSize"]);
  const _0x2fd1ec = normalizeModelVersion(_0x22d97b);
  const _0x158c25 = normalizeDreaminaGenerateNum(_0x22d97b);
  const _0x90b96d = {
    'prompt': _0x3b6d5a
  };
  if (_0x2eeced) {
    _0x90b96d['ratio'] = _0x2eeced;
  }
  if (_0x2bd015) {
    _0x90b96d["resolutionType"] = _0x2bd015;
  }
  if (_0x2fd1ec) {
    _0x90b96d["modelVersion"] = _0x2fd1ec;
  }
  if (_0x158c25 > 0x1) {
    _0x90b96d["generateNum"] = _0x158c25;
  }
  let _0x1dca67 = null;
  _0x5e2fa3["length"] > 0x0 ? _0x1dca67 = await submitDreaminaImage2Image({
    'images': _0x5e2fa3,
    ..._0x90b96d
  }) : _0x1dca67 = await submitDreaminaText2Image({
    ..._0x90b96d
  });
  if (_0x1dca67?.["success"] === ![]) {
    throw new Error(normalizeDreaminaErrorMessage(_0x1dca67?.["message"]) || '即梦图片任务提交失败');
  }
  const _0x2e3e06 = String(_0x1dca67?.["submitId"] || '')['trim']();
  if (!_0x2e3e06) {
    throw new Error("即梦图片任务提交失败：未返回 submitId");
  }
  _0x39926e?.["onTaskMeta"]?.({
    'taskId': _0x2e3e06,
    'submitId': _0x2e3e06,
    'provider': "dreamina",
    'kind': 'image'
  });
  _0x39926e?.["onTaskId"]?.(_0x2e3e06);
  const _0x4adeb7 = await pollDreaminaUntilDone(_0x2e3e06, {
    ..._0x39926e,
    'taskKind': 'image'
  });
  const _0xf2dac8 = normalizeDreaminaTaskSnapshot(_0x4adeb7, {
    'submitId': _0x2e3e06
  });
  if (_0xf2dac8?.["phase"] === "failed") {
    throw new Error(normalizeDreaminaErrorMessage(_0xf2dac8?.["failReason"]) || "即梦图片生成失败");
  }
  const _0x14c64d = Array["isArray"](_0xf2dac8?.['outputs']) ? _0xf2dac8["outputs"] : [];
  if (!_0x14c64d["length"]) {
    throw new Error("即梦图片生成完成，但没有可用输出");
  }
  return _0x14c64d["map"](_0x23fc0e => {
    const _0x6c89ce = _0x23fc0e["localUrl"] || _0x23fc0e['url'];
    return {
      'sourceId': null,
      'thumbId': null,
      'sourceUrl': _0x23fc0e['url'] || _0x6c89ce,
      'thumbUrl': _0x6c89ce,
      'imageUrl': _0x6c89ce,
      'localPath': _0x23fc0e["localPath"] || '',
      ...(hasImageDerivativeFields(_0x23fc0e) ? buildCanvasLocalImageFields(_0x23fc0e) : {})
    };
  });
}
export function buildDreaminaVideoSubmitRequest(_0x55ded3 = {}) {
  const _0x6354e9 = toTrimmedArray(Array["isArray"](_0x55ded3?.["images"]) && _0x55ded3["images"]["length"] ? _0x55ded3["images"] : _0x55ded3?.['inputUrls']);
  const _0x510a82 = toTrimmedArray(_0x55ded3?.['videos']);
  const _0x555562 = toTrimmedArray(_0x55ded3?.["audios"]);
  const _0x526432 = normalizeDreaminaVideoRouteMode(_0x55ded3?.["dreaminaRouteMode"], _0x55ded3?.['mode']);
  const _0x21ce1c = String(_0x55ded3?.["dreaminaTaskType"] || '')["trim"]() || resolveDreaminaVideoTaskType({
    'routeMode': _0x526432,
    'imageCount': _0x6354e9['length'],
    'videoCount': _0x510a82['length'],
    'audioCount': _0x555562["length"]
  });
  const _0x2f3cb4 = validateDreaminaVideoRouteSelection({
    'routeMode': _0x526432,
    'taskType': _0x21ce1c,
    'model': _0x55ded3?.['model'],
    'provider': _0x55ded3?.["provider"],
    'imageCount': _0x6354e9["length"],
    'videoCount': _0x510a82["length"],
    'audioCount': _0x555562["length"]
  });
  if (_0x2f3cb4) {
    throw new Error(_0x2f3cb4);
  }
  const _0x4338e0 = String(_0x55ded3?.["prompt"] || '')["trim"]();
  const _0x577fdc = String(_0x55ded3?.['model'] || '')["trim"]();
  const _0x109ce2 = normalizeDreaminaVideoModel(_0x577fdc, _0x55ded3?.["provider"]);
  if (_0x577fdc && _0x577fdc !== "dreamina/text2video" && !getDreaminaVideoModelVersion(_0x109ce2, "dreamina")) {
    throw new Error("即梦 CLI 不支持视频模型：" + _0x577fdc);
  }
  const _0x156f12 = ensureDreaminaVideoModelForTask(_0x21ce1c, _0x109ce2, "dreamina") || _0x109ce2;
  const _0xe647e2 = getDreaminaVideoModelVersion(_0x156f12, "dreamina") || String(_0x55ded3?.['modelVersion'] || '')["trim"]() || normalizeModelVersion(_0x55ded3);
  const _0x51e5f8 = String(_0x55ded3?.["installId"] || '')["trim"]();
  const _0x3dced2 = normalizeDreaminaVideoResolution(_0x21ce1c, _0x156f12, _0x55ded3?.["videoResolution"] || _0x55ded3?.["videoSize"] || _0x55ded3?.["resolution"], "dreamina");
  const _0xe8e13d = normalizeDreaminaVideoAspectRatio(_0x55ded3?.["aspectRatio"]);
  const _0x1563f3 = normalizeDreaminaVideoDuration(_0x21ce1c, _0x156f12, _0x55ded3?.["duration"], "dreamina");
  if (_0x21ce1c === "text2video") {
    if (!_0x4338e0) {
      throw new Error('文生视频需要填写提示词');
    }
    return {
      'taskType': _0x21ce1c,
      'url': "/api/v2/dreamina/text2video",
      'body': {
        'prompt': _0x4338e0,
        'duration': _0x1563f3,
        'ratio': _0xe8e13d,
        'videoResolution': _0x3dced2,
        ...(_0x51e5f8 ? {
          'installId': _0x51e5f8
        } : {}),
        ...(_0xe647e2 ? {
          'modelVersion': _0xe647e2
        } : {})
      }
    };
  }
  if (_0x21ce1c === 'image2video') {
    const _0x53fb4b = String(_0x55ded3?.["image"] || _0x6354e9[0x0] || '')["trim"]();
    if (!_0x4338e0) {
      throw new Error("首帧生视频需要填写提示词");
    }
    if (!_0x53fb4b) {
      throw new Error("首帧生视频至少需要 1 张图片");
    }
    return {
      'taskType': _0x21ce1c,
      'url': "/api/v2/dreamina/image2video",
      'body': {
        'image': _0x53fb4b,
        'prompt': _0x4338e0,
        'duration': _0x1563f3,
        'videoResolution': _0x3dced2,
        ...(_0x51e5f8 ? {
          'installId': _0x51e5f8
        } : {}),
        ...(_0xe647e2 ? {
          'modelVersion': _0xe647e2
        } : {})
      }
    };
  }
  if (_0x21ce1c === "frames2video") {
    const _0x3c4464 = String(_0x55ded3?.["first"] || _0x6354e9[0x0] || '')['trim']();
    const _0x166307 = String(_0x55ded3?.["last"] || _0x6354e9[0x1] || '')['trim']();
    if (!_0x4338e0) {
      throw new Error("首尾帧模式需要填写提示词");
    }
    if (!_0x3c4464 || !_0x166307) {
      throw new Error('首尾帧模式至少需要\x202\x20张图片');
    }
    return {
      'taskType': _0x21ce1c,
      'url': "/api/v2/dreamina/frames2video",
      'body': {
        'first': _0x3c4464,
        'last': _0x166307,
        'prompt': _0x4338e0,
        'duration': _0x1563f3,
        'videoResolution': _0x3dced2,
        ...(_0x51e5f8 ? {
          'installId': _0x51e5f8
        } : {}),
        ...(_0xe647e2 ? {
          'modelVersion': _0xe647e2
        } : {})
      }
    };
  }
  if (_0x21ce1c === "multiframe2video") {
    const _0x5e1680 = _0x6354e9["slice"](0x0, 0x14);
    if (_0x5e1680["length"] < 0x2) {
      throw new Error("多帧叙事至少需要 2 张图片");
    }
    const _0x4a3748 = Array["isArray"](_0x55ded3?.["transitionPrompts"]) ? _0x55ded3["transitionPrompts"]['map'](_0x1c2f36 => String(_0x1c2f36 || '')["trim"]()) : [];
    const _0x18d93c = Array["isArray"](_0x55ded3?.["transitionDurations"]) ? _0x55ded3['transitionDurations'] : [];
    const _0x16fad6 = Math["max"](0x0, _0x5e1680["length"] - 0x1);
    const _0x48c78f = [];
    const _0x4f9ece = [];
    for (let _0x2a6416 = 0x0; _0x2a6416 < _0x16fad6; _0x2a6416 += 0x1) {
      _0x48c78f["push"](String(_0x4a3748[_0x2a6416] || '')["trim"]() || _0x4338e0);
      const _0x544baf = Number(_0x18d93c[_0x2a6416]);
      _0x4f9ece['push'](Number["isFinite"](_0x544baf) && _0x544baf > 0x0 ? Math["max"](0x1, Math["trunc"](_0x544baf)) : 0x3);
    }
    const _0x569387 = {
      'images': _0x5e1680
    };
    if (_0x51e5f8) {
      _0x569387["installId"] = _0x51e5f8;
    }
    if (_0x5e1680["length"] === 0x2) {
      if (!(_0x48c78f[0x0] || _0x4338e0)) {
        throw new Error('两张图的多帧叙事需要提示词');
      }
      _0x569387["prompt"] = _0x48c78f[0x0] || _0x4338e0;
      _0x569387["duration"] = _0x4f9ece[0x0] || _0x1563f3 || 0x3;
    } else {
      if (!_0x48c78f['every'](_0x42eb7b => String(_0x42eb7b || '')["trim"]())) {
        throw new Error("多帧叙事的每段 transition prompt 都不能为空");
      }
      _0x569387["transitionPrompts"] = _0x48c78f;
      _0x569387['transitionDurations'] = _0x4f9ece;
    }
    return {
      'taskType': _0x21ce1c,
      'url': "/api/v2/dreamina/multiframe2video",
      'body': _0x569387
    };
  }
  if (_0x21ce1c === "multimodal2video") {
    if (!_0x6354e9["length"] && !_0x510a82['length']) {
      throw new Error("全能参考至少需要 1 个图片或视频参考");
    }
    return {
      'taskType': _0x21ce1c,
      'url': "/api/v2/dreamina/multimodal2video",
      'body': {
        'images': _0x6354e9,
        'videos': _0x510a82,
        'audios': _0x555562,
        'prompt': _0x4338e0,
        'duration': _0x1563f3,
        'ratio': _0xe8e13d,
        'videoResolution': _0x3dced2,
        ...(_0x51e5f8 ? {
          'installId': _0x51e5f8
        } : {}),
        ...(_0xe647e2 ? {
          'modelVersion': _0xe647e2
        } : {})
      }
    };
  }
  throw new Error("未识别的即梦视频任务类型");
}
export async function runDreaminaVideoGeneration(_0x4ef7c9, _0x1d1c52 = {}) {
  const _0x304511 = buildDreaminaVideoSubmitRequest(_0x4ef7c9 || {});
  let _0x1a8e22 = null;
  try {
    if (_0x304511["url"] === "/api/v2/dreamina/text2video") {
      _0x1a8e22 = await submitDreaminaText2Video(_0x304511["body"]);
    } else {
      if (_0x304511["url"] === "/api/v2/dreamina/image2video") {
        _0x1a8e22 = await submitDreaminaImage2Video(_0x304511['body']);
      } else {
        if (_0x304511["url"] === "/api/v2/dreamina/frames2video") {
          _0x1a8e22 = await submitDreaminaFrames2Video(_0x304511["body"]);
        } else {
          if (_0x304511["url"] === "/api/v2/dreamina/multiframe2video") {
            _0x1a8e22 = await submitDreaminaMultiframe2Video(_0x304511["body"]);
          } else {
            if (_0x304511['url'] === "/api/v2/dreamina/multimodal2video") {
              _0x1a8e22 = await submitDreaminaMultimodal2Video(_0x304511["body"]);
            } else {
              throw new Error("未知的即梦视频请求路由");
            }
          }
        }
      }
    }
  } catch (_0x2e2352) {
    throw normalizeDreaminaThrownError(_0x2e2352);
  }
  if (_0x1a8e22?.["success"] === ![]) {
    const _0x2bd7ba = new Error(normalizeDreaminaErrorMessage(_0x1a8e22?.["message"]) || "即梦视频任务提交失败");
    if (_0x1a8e22?.["code"] != null) {
      _0x2bd7ba["code"] = String(_0x1a8e22["code"] || '');
    }
    _0x1a8e22?.["requiredModelId"] != null && (_0x2bd7ba["requiredModelId"] = String(_0x1a8e22["requiredModelId"] || '')["trim"]());
    _0x1a8e22?.["subscriptionStatus"] != null && (_0x2bd7ba["subscriptionStatus"] = String(_0x1a8e22["subscriptionStatus"] || '')["trim"]());
    _0x1a8e22?.['reasonCode'] != null && (_0x2bd7ba['reasonCode'] = String(_0x1a8e22["reasonCode"] || '')["trim"]());
    _0x2bd7ba["contactText"] = String(_0x1a8e22?.["contactText"] || '')["trim"]();
    _0x2bd7ba['contactUrl'] = String(_0x1a8e22?.["contactUrl"] || '')['trim']();
    throw _0x2bd7ba;
  }
  const _0x46e967 = String(_0x1a8e22?.["submitId"] || '')["trim"]();
  if (!_0x46e967) {
    throw new Error('即梦视频任务提交失败：未返回\x20submitId');
  }
  _0x1d1c52?.["onTaskMeta"]?.({
    'taskId': _0x46e967,
    'submitId': _0x46e967,
    'provider': 'dreamina',
    'kind': 'video'
  });
  _0x1d1c52?.["onTaskId"]?.(_0x46e967);
  const _0xbf02d3 = await pollDreaminaUntilDone(_0x46e967, {
    ..._0x1d1c52,
    'taskKind': "video"
  });
  const _0x27f697 = normalizeDreaminaTaskSnapshot(_0xbf02d3, {
    'submitId': _0x46e967
  });
  if (_0x27f697?.["phase"] === "failed") {
    throw new Error(normalizeDreaminaErrorMessage(_0x27f697?.["failReason"]) || "即梦视频生成失败");
  }
  const _0x653b60 = Array["isArray"](_0x27f697?.["outputs"]) ? _0x27f697["outputs"] : [];
  if (!_0x653b60["length"]) {
    throw new Error("即梦视频生成完成，但没有可用输出");
  }
  const _0x5ded84 = _0x653b60["map"](_0x421668 => ({
    'videoUrl': _0x421668["localUrl"] || _0x421668["url"],
    'localPath': _0x421668["localPath"] || ''
  }));
  return {
    'isBatch': _0x5ded84["length"] > 0x1,
    'videos': _0x5ded84,
    'videoUrl': _0x5ded84[0x0]?.["videoUrl"] || '',
    'localPath': _0x5ded84[0x0]?.['localPath'] || ''
  };
}