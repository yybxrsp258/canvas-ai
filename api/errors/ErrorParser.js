import * as a76_0x172bb9 from './parsers/PpioErrorParser.js';
import * as a76_0x192257 from './parsers/ApimartErrorParser.js';
import * as a76_0x41374d from './parsers/RunningHubErrorParser.js';
import * as a76_0x16a782 from './parsers/RunningHubModelErrorParser.js';
import * as a76_0x15b7a7 from './parsers/GrsaiErrorParser.js';
import * as a76_0x584d82 from './parsers/AgnesErrorParser.js';
import * as a76_0x20671e from './parsers/ComfyUiErrorParser.js';
import * as a76_0x5eed12 from './parsers/VolcengineSpeechErrorParser.js';
import * as a76_0x10c2d5 from './parsers/VolcengineErrorParser.js';
import { ApiError, ErrorType } from './ApiError.js';
const PARSERS = {
  'ppio': a76_0x172bb9,
  'apimart': a76_0x192257,
  'runninghub': a76_0x16a782,
  'runninghubwf': a76_0x41374d,
  'grsai': a76_0x15b7a7,
  'agnes': a76_0x584d82,
  'comfyui': a76_0x20671e,
  'volcengine-speech': a76_0x5eed12,
  'volcengine': a76_0x10c2d5,
  'ppio/gemini': a76_0x172bb9,
  'runninghub-model': a76_0x16a782
};
function getParser(_0x1019f3) {
  if (!_0x1019f3) {
    return null;
  }
  const _0x2d862e = _0x1019f3["toLowerCase"]()["trim"]();
  return PARSERS[_0x2d862e] || null;
}
function isPlainObject(_0x162756) {
  return !!_0x162756 && typeof _0x162756 === "object" && !Array['isArray'](_0x162756);
}
function stringifyErrorValue(_0x572a27) {
  if (_0x572a27 === undefined || _0x572a27 === null) {
    return '';
  }
  if (typeof _0x572a27 === "string") {
    return _0x572a27;
  }
  if (typeof _0x572a27 === "number" || typeof _0x572a27 === 'boolean') {
    return String(_0x572a27);
  }
  if (isPlainObject(_0x572a27)) {
    const _0x37fb6d = _0x572a27["message"] || _0x572a27["errorMessage"] || _0x572a27['error_message'] || _0x572a27['reason'] || _0x572a27['detail'] || _0x572a27["details"] || _0x572a27['msg'];
    if (_0x37fb6d !== undefined && _0x37fb6d !== null && _0x37fb6d !== _0x572a27) {
      const _0x41b25b = stringifyErrorValue(_0x37fb6d);
      if (_0x41b25b) {
        return _0x41b25b;
      }
    }
    try {
      return JSON["stringify"](_0x572a27);
    } catch {
      return '';
    }
  }
  return String(_0x572a27 || '');
}
function firstErrorText(..._0x46198a) {
  for (const _0x523818 of _0x46198a) {
    const _0xe26fef = stringifyErrorValue(_0x523818)["trim"]();
    if (_0xe26fef) {
      return _0xe26fef;
    }
  }
  return '';
}
function preserveRawErrorContext(_0x4bfbc4, _0x5f0375, _0x445a96) {
  if (!_0x4bfbc4) {
    return _0x4bfbc4;
  }
  if (_0x4bfbc4["raw"] === undefined) {
    _0x4bfbc4["raw"] = _0x5f0375;
  }
  const _0x40a672 = Number(_0x445a96);
  _0x4bfbc4["status"] == null && _0x445a96 !== null && _0x445a96 !== undefined && _0x445a96 !== '' && Number['isFinite'](_0x40a672) && (_0x4bfbc4["status"] = _0x40a672);
  return _0x4bfbc4;
}
export function parseError(_0x3ec270, _0x40c856, _0xcc9f03) {
  const _0x31f325 = getParser(_0x3ec270);
  if (_0x31f325?.["parseError"]) {
    const _0x5881bf = _0x31f325["parseError"](_0x40c856, _0xcc9f03);
    if (_0x5881bf) {
      return preserveRawErrorContext(_0x5881bf, _0x40c856, _0xcc9f03);
    }
    if (Number(_0xcc9f03) < 0x190) {
      return null;
    }
  }
  return preserveRawErrorContext(parseGenericError(_0x3ec270, _0x40c856, _0xcc9f03), _0x40c856, _0xcc9f03);
}
export function parseTaskError(_0x334e21, _0x16115c) {
  const _0x33a93d = getParser(_0x334e21);
  if (_0x33a93d?.["parseTaskError"]) {
    return _0x33a93d["parseTaskError"](_0x16115c);
  }
  if (_0x16115c) {
    const _0x12fd7c = (_0x16115c['status'] || '')['toLowerCase']();
    if (_0x12fd7c === 'failed' || _0x12fd7c === 'error') {
      const _0x52f666 = firstErrorText(_0x16115c["error"], _0x16115c["errorMessage"], _0x16115c['message'], _0x16115c["failure_reason"], "未知错误");
      return ApiError["taskFailed"](_0x334e21, _0x52f666);
    }
  }
  return null;
}
export function parseNetworkError(_0x435ad3, _0x50bd8d, _0x2eafaa) {
  const _0x595c51 = _0x50bd8d?.["message"] || '';
  if (_0x50bd8d?.["name"] === "AbortError" || _0x595c51['includes']("timeout") || _0x595c51["includes"]("TIMEOUT")) {
    if (_0x435ad3 === "local") {
      return new ApiError({
        'type': ErrorType["TIMEOUT"],
        'provider': _0x435ad3,
        'message': "本地服务响应超时（" + (_0x2eafaa ? Math["round"](_0x2eafaa / 0x3e8) + '秒' : '未知') + "），请稍后重试；若持续超时，请重启应用后再试",
        'raw': _0x50bd8d,
        'retryable': !![]
      });
    }
    return ApiError["timeout"](_0x435ad3, _0x2eafaa);
  }
  if (_0x595c51["includes"]('DNS') || _0x595c51["includes"]("ENOTFOUND") || _0x595c51["includes"]("getaddrinfo")) {
    return new ApiError({
      'type': ErrorType['DNS_ERROR'],
      'provider': _0x435ad3,
      'message': "无法解析服务器地址，请检查网络配置",
      'raw': _0x50bd8d,
      'retryable': !![]
    });
  }
  if (_0x595c51["includes"]("Failed to fetch") || _0x595c51["includes"]("NETWORK") || _0x595c51["includes"]("ECONNREFUSED") || _0x595c51["includes"]('ECONNRESET')) {
    return new ApiError({
      'type': ErrorType["NETWORK_ERROR"],
      'provider': _0x435ad3,
      'message': _0x435ad3 === "local" ? "无法连接本地服务，请稍后重试；若持续失败，请重启应用后再试" : "网络连接失败，请检查网络或代理设置",
      'raw': _0x50bd8d,
      'retryable': !![]
    });
  }
  return ApiError["networkError"](_0x435ad3, _0x50bd8d);
}
export function applyManifestErrorRules(_0x458cf2, _0x5e1a5b, _0x53779c = {}) {
  if (!_0x458cf2 || !Array["isArray"](_0x5e1a5b) || _0x5e1a5b["length"] === 0x0) {
    return _0x458cf2;
  }
  const _0x305bf2 = String(_0x53779c["phase"] || "any")["trim"]()["toLowerCase"]();
  const _0x5b9c13 = String(_0x53779c["provider"] || _0x458cf2["provider"] || 'unknown')["trim"]();
  const _0x9007ab = Number(_0x458cf2["status"] ?? _0x458cf2["code"]);
  const _0x3dec4c = Number["isInteger"](_0x9007ab) ? _0x9007ab : null;
  const _0x294c3c = firstErrorText(_0x458cf2['message'], _0x458cf2['raw']?.["error"]?.["message"], _0x458cf2["raw"]?.["error"], _0x458cf2["raw"]?.["message"], _0x458cf2["raw"]);
  const _0x21502a = _0x294c3c['toLocaleLowerCase']();
  for (const _0x2e3dc8 of _0x5e1a5b) {
    if (!_0x2e3dc8 || typeof _0x2e3dc8 !== "object" || Array["isArray"](_0x2e3dc8)) {
      continue;
    }
    const _0x5d1987 = String(_0x2e3dc8["phase"] || "any")['trim']()["toLowerCase"]();
    if (_0x5d1987 !== "any" && _0x5d1987 !== _0x305bf2) {
      continue;
    }
    const _0x4ba856 = Array['isArray'](_0x2e3dc8["httpStatuses"]) ? _0x2e3dc8["httpStatuses"]["map"](Number)["filter"](Number['isInteger']) : [];
    if (_0x4ba856["length"] > 0x0 && (_0x3dec4c === null || !_0x4ba856["includes"](_0x3dec4c))) {
      continue;
    }
    const _0x9dcefc = Array['isArray'](_0x2e3dc8["messageIncludesAny"]) ? _0x2e3dc8["messageIncludesAny"]["map"](_0x3af0fd => String(_0x3af0fd || '')["trim"]()['toLocaleLowerCase']())["filter"](Boolean) : [];
    if (_0x9dcefc['length'] > 0x0 && !_0x9dcefc["some"](_0x597ff3 => _0x21502a["includes"](_0x597ff3))) {
      continue;
    }
    if (_0x4ba856['length'] === 0x0 && _0x9dcefc['length'] === 0x0) {
      continue;
    }
    const _0x4dca5a = String(_0x2e3dc8["userMessage"] || '')["trim"]();
    const _0x242c3d = String(_0x2e3dc8["hint"] || '')["trim"]();
    const _0x5b743c = _0x4dca5a || _0x294c3c || _0x458cf2["message"] || "请求失败";
    const _0x2cab26 = _0x242c3d && !_0x5b743c['includes'](_0x242c3d) ? _0x5b743c + '；' + _0x242c3d : _0x5b743c;
    const _0x58fc33 = new ApiError({
      'type': String(_0x2e3dc8["type"] || ErrorType["UNKNOWN"])["trim"]()["toUpperCase"](),
      'provider': _0x5b9c13,
      'code': _0x458cf2["code"],
      'status': _0x3dec4c ?? _0x458cf2['status'],
      'message': _0x2cab26,
      'retryable': _0x2e3dc8["retryable"] === !![],
      'raw': _0x458cf2["raw"] ?? _0x458cf2
    });
    _0x58fc33['hint'] = _0x242c3d;
    _0x58fc33["manifestRuleMatched"] = !![];
    return _0x58fc33;
  }
  return _0x458cf2;
}
function parseGenericError(_0x5820af, _0x4bb2ce, _0x4fc567) {
  let _0xb99c8e = '';
  let _0x5d5661 = _0x4fc567 >= 0x190 ? _0x4fc567 : undefined;
  if (typeof _0x4bb2ce === "string") {
    _0xb99c8e = _0x4bb2ce;
  } else {
    _0x4bb2ce && typeof _0x4bb2ce === "object" && (_0xb99c8e = firstErrorText(_0x4bb2ce["error"]?.['message'], _0x4bb2ce["error"], _0x4bb2ce["message"], _0x4bb2ce["errorMessage"], _0x4bb2ce["error_message"], _0x4bb2ce["failure_reason"], _0x4bb2ce["reason"], _0x4bb2ce["detail"], _0x4bb2ce['details'], _0x4bb2ce["msg"]), _0x5d5661 = _0x4bb2ce["code"] || _0x4bb2ce["error"]?.["code"] || _0x4bb2ce["errorCode"] || _0x4bb2ce["error_code"] || _0x5d5661);
  }
  const _0x3487e0 = String(_0xb99c8e)["toUpperCase"]();
  if ((String(_0x5d5661 || '') + '\x20' + _0xb99c8e)["toUpperCase"]()["includes"]("FREETIERONLY")) {
    return new ApiError({
      "type": ErrorType["INSUFFICIENT_BALANCE"],
      "provider": _0x5820af,
      "code": _0x5d5661,
      "message": "API Key 有效，但该账号已开启“仅使用免费额度”且免费额度已用完；请在百炼控制台关闭“免费额度用完即停”或充值后重试",
      "retryable": ![]
    });
  }
  if (_0x3487e0["includes"]("BALANCE") || _0x3487e0["includes"]('余额') || _0x3487e0["includes"]("QUOTA")) {
    return ApiError["insufficientBalance"](_0x5820af, _0x5d5661);
  }
  if (_0x4fc567 === 0x1ad || /\b(?:RATE[\s_-]*(?:LIMIT\w*|EXCEEDED)|TOO[\s_-]+MANY[\s_-]+REQUESTS|THROTTL(?:E|ED|ING))\b|请求过于频繁|限流/i["test"](_0xb99c8e)) {
    return ApiError["rateLimit"](_0x5820af, _0x5d5661);
  }
  if (_0x3487e0["includes"]("AUTH") || _0x3487e0["includes"]("KEY") || _0x4fc567 === 0x191) {
    return ApiError["authError"](_0x5820af, _0x5d5661, _0xb99c8e);
  }
  if (_0x3487e0['includes']("CONTENT") || _0x3487e0["includes"]("FILTER") || _0x3487e0["includes"]('SAFETY')) {
    return ApiError["contentFiltered"](_0x5820af, _0xb99c8e);
  }
  if (_0x4fc567 >= 0x190) {
    return ApiError["fromHttpStatus"](_0x4fc567, _0x5820af, _0xb99c8e);
  }
  return new ApiError({
    'type': ErrorType["UNKNOWN"],
    'provider': _0x5820af,
    'code': _0x5d5661,
    'message': _0xb99c8e || "未知错误",
    'status': _0x4fc567
  });
}
export function parseBatchErrors(_0x16d0e2, _0x3ba90a) {
  return _0x3ba90a['map']((_0x31981d, _0x28fb81) => {
    if (_0x31981d['success']) {
      return null;
    }
    const _0x269049 = parseError(_0x16d0e2, _0x31981d["error"], _0x31981d["status"]);
    _0x269049["batchIndex"] = _0x28fb81;
    return _0x269049;
  })['filter'](Boolean);
}
export default {
  'parseError': parseError,
  'parseTaskError': parseTaskError,
  'parseNetworkError': parseNetworkError,
  'applyManifestErrorRules': applyManifestErrorRules,
  'parseBatchErrors': parseBatchErrors
};