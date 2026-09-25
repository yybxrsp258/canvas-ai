import { ApiError, ErrorType } from '../ApiError.js';
const MODEL_ERROR_CODE_MAP = {
  0x3e8: {
    'type': ErrorType["SERVER_ERROR"],
    'message': '未知错误，请联系技术支持排查。',
    'retryable': ![]
  },
  0x3e9: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': "请求链接无效，请检查调用的 API Endpoint 是否正确。",
    'retryable': ![]
  },
  0x3ea: {
    'type': ErrorType["AUTH_ERROR"],
    'message': "API Key 无效，请检查 API Key 是否配置正确或已被禁用。",
    'retryable': ![]
  },
  0x3eb: {
    'type': ErrorType["RATE_LIMIT"],
    'message': "请求频率超限，请降低并发请求频率。",
    'retryable': !![]
  },
  0x3ec: {
    'type': ErrorType["TASK_FAILED"],
    'message': "任务不存在或已过期，请确认任务 ID 是否正确。",
    'retryable': ![]
  },
  0x3ed: {
    'type': ErrorType["SERVER_ERROR"],
    'message': "系统内部错误，请稍后重试。",
    'retryable': !![]
  },
  0x3ee: {
    'type': ErrorType["TASK_TIMEOUT"],
    'message': '任务执行超时，请尝试重新提交。',
    'retryable': !![]
  },
  0x3ef: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': "请求参数校验失败，请检查参数格式、类型或文件有效性。",
    'retryable': ![]
  },
  0x3f0: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': "文件大小超出限制，请参考文档中的文件大小上限。",
    'retryable': ![]
  },
  0x3f1: {
    'type': ErrorType['INVALID_PARAMS'],
    'message': "请求方法不支持，请确认请求方式是否正确。",
    'retryable': ![]
  },
  0x3f2: {
    'type': ErrorType["SERVICE_UNAVAILABLE"],
    'message': "服务暂不可用，系统维护或临时故障，请稍后重试。",
    'retryable': !![]
  },
  0x3f3: {
    'type': ErrorType["RATE_LIMIT"],
    'message': '模型负载较高，请稍后重试。',
    'retryable': !![]
  },
  0x3f4: {
    'type': ErrorType['SERVER_ERROR'],
    'message': '模型响应异常，请重试。',
    'retryable': !![]
  },
  0x3f5: {
    'type': ErrorType['SERVER_ERROR'],
    'message': '文件处理失败，请检查输入文件链接或文件完整性。',
    'retryable': !![]
  },
  0x3f6: {
    'type': ErrorType["FORBIDDEN"],
    'message': '权限不足，标准模型\x20API\x20仅限企业级共享\x20API\x20Key\x20调用。',
    'retryable': ![]
  },
  0x3f7: {
    'type': ErrorType["TASK_FAILED"],
    'message': "生成失败，任务处理过程中出现异常，请尝试重新提交。",
    'retryable': !![]
  },
  0x5dd: {
    'type': ErrorType['CONTENT_FILTERED'],
    'message': "内容安全审查未通过，请修改提示词或图片。",
    'retryable': ![]
  },
  0x5e0: {
    'type': ErrorType["TIMEOUT"],
    'message': '模型响应超时，请稍后重试。',
    'retryable': !![]
  },
  0x5e1: {
    'type': ErrorType["CONTENT_FILTERED"],
    'message': "不支持真人图像处理，请修改提示词或参考图。",
    'retryable': ![]
  },
  0x5e2: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': '音频克隆\x20ID\x20重复，请更换唯一的\x20voiceId。',
    'retryable': ![]
  },
  0x5ec: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': "外部文件下载失败，请检查 URL 是否可访问后重试。",
    'retryable': !![]
  },
  0x5ed: {
    'type': ErrorType["SERVER_ERROR"],
    'message': "文件上传失败，请重试。",
    'retryable': !![]
  },
  0x5ee: {
    'type': ErrorType['INVALID_PARAMS'],
    'message': "Base64 解码失败，请检查 Base64 字符串格式。",
    'retryable': ![]
  },
  0x5ef: {
    'type': ErrorType["SERVER_ERROR"],
    'message': "内容处理异常，处理输入内容时出现非预期错误，请重试。",
    'retryable': !![]
  },
  0x5f0: {
    'type': ErrorType["RATE_LIMIT"],
    'message': '账号并发达到上限，请等待已有任务完成后再发起新请求。',
    'retryable': !![]
  }
};
const MESSAGE_HINT_TO_CODE = {
  'UNKNOWN\x20ERROR': 0x3e8,
  'INVALID\x20URL': 0x3e9,
  'INVALID\x20API\x20KEY': 0x3ea,
  'RATE\x20LIMIT\x20EXCEEDED': 0x3eb,
  'TASK\x20NOT\x20FOUND': 0x3ec,
  'INTERNAL\x20SERVER\x20ERROR': 0x3ed,
  'TASK\x20EXECUTION\x20TIMED\x20OUT': 0x3ee,
  'INVALID\x20PARAMETERS': 0x3ef,
  'FILE\x20SIZE\x20LIMIT\x20EXCEEDED': 0x3f0,
  'HTTP\x20METHOD\x20NOT\x20SUPPORTED': 0x3f1,
  'SERVICE\x20UNAVAILABLE': 0x3f2,
  'MODEL\x20IS\x20CURRENTLY\x20BUSY': 0x3f3,
  'MODEL\x20RESPONSE\x20EXCEPTION': 0x3f4,
  'FILE\x20PROCESSING\x20FAILED': 0x3f5,
  'ACCESS\x20DENIED': 0x3f6,
  'GENERATION\x20FAILED': 0x3f7,
  'CONTENT\x20SECURITY\x20AUDIT\x20FAILED': 0x5dd,
  'MODEL\x20TIMED\x20OUT': 0x5e0,
  'UPSTREAM\x20SERVICE\x20TIMED\x20OUT': 0x5e0,
  'REAL\x20PEOPLE\x20PROHIBITED': 0x5e1,
  'VOICE\x20ID\x20DUPLICATE': 0x5e2,
  'EXTERNAL\x20DOWNLOAD\x20FAILED': 0x5ec,
  'UPLOAD\x20FAILED': 0x5ed,
  'BASE64\x20DECODE\x20FAILED': 0x5ee,
  'CONTENT\x20PROCESSING\x20EXCEPTION': 0x5ef,
  'CONCURRENCY\x20LIMIT\x20REACHED': 0x5f0
};
function toNumberCode(_0x4786b6) {
  if (typeof _0x4786b6 === 'number' && Number["isFinite"](_0x4786b6)) {
    return _0x4786b6;
  }
  if (typeof _0x4786b6 === "string") {
    const _0x24a33a = _0x4786b6["trim"]();
    if (/^\d+$/["test"](_0x24a33a)) {
      return Number(_0x24a33a);
    }
  }
  return null;
}
function toMessageString(_0x225114, _0x1252a9 = new Set()) {
  if (_0x225114 === undefined || _0x225114 === null) {
    return '';
  }
  if (typeof _0x225114 === 'string') {
    return _0x225114["trim"]();
  }
  if (typeof _0x225114 === 'number' || typeof _0x225114 === 'boolean') {
    return String(_0x225114);
  }
  if (typeof _0x225114 !== "object" || _0x1252a9['has'](_0x225114)) {
    return '';
  }
  _0x1252a9['add'](_0x225114);
  const _0x524241 = [_0x225114['message'], _0x225114["errorMessage"], _0x225114["error_message"], _0x225114["msg"], _0x225114['reason'], _0x225114['detail'], _0x225114["details"]];
  for (const _0x53e9f4 of _0x524241) {
    if (_0x53e9f4 === _0x225114) {
      continue;
    }
    const _0x488042 = toMessageString(_0x53e9f4, _0x1252a9);
    if (_0x488042) {
      return _0x488042;
    }
  }
  try {
    return JSON["stringify"](_0x225114);
  } catch {
    return '';
  }
}
function collectCandidateObjects(_0x131751) {
  if (!_0x131751 || typeof _0x131751 !== 'object') {
    return [];
  }
  const _0x522ebf = [];
  const _0x4be392 = [_0x131751];
  const _0x5387d7 = new Set();
  while (_0x4be392['length'] && _0x522ebf["length"] < 0x64) {
    const _0x584253 = _0x4be392["shift"]();
    if (!_0x584253 || typeof _0x584253 !== "object" || _0x5387d7['has'](_0x584253)) {
      continue;
    }
    _0x5387d7["add"](_0x584253);
    if (Array["isArray"](_0x584253)) {
      _0x4be392['push'](..._0x584253);
      continue;
    }
    _0x522ebf["push"](_0x584253);
    _0x4be392["push"](_0x584253["data"], _0x584253["result"], _0x584253["output"], _0x584253["response"], _0x584253['error'], _0x584253["failedReason"], _0x584253['reason'], _0x584253["results"]);
  }
  return _0x522ebf;
}
function extractMessage(_0x3cd367) {
  const _0x3d6d5b = collectCandidateObjects(_0x3cd367);
  for (const _0x343617 of _0x3d6d5b) {
    const _0x47681d = [_0x343617?.["errorMessage"], _0x343617?.["message"], _0x343617?.["error"], _0x343617?.["msg"], _0x343617?.["reason"], _0x343617?.["detail"]];
    for (const _0x4631c6 of _0x47681d) {
      const _0x1c8ce7 = toMessageString(_0x4631c6);
      if (_0x1c8ce7) {
        return _0x1c8ce7;
      }
    }
  }
  return '';
}
function extractErrorCode(_0x29cc91) {
  const _0x3f6f35 = collectCandidateObjects(_0x29cc91);
  for (const _0x5a4cc9 of _0x3f6f35) {
    const _0x140e8d = toNumberCode(_0x5a4cc9["errorCode"]) ?? toNumberCode(_0x5a4cc9["error_code"]);
    if (_0x140e8d !== null && _0x140e8d !== 0x0) {
      return _0x140e8d;
    }
  }
  for (const _0x584285 of _0x3f6f35) {
    const _0x47d3a8 = toNumberCode(_0x584285["code"]);
    if (_0x47d3a8 !== null && _0x47d3a8 !== 0x0) {
      return _0x47d3a8;
    }
  }
  for (const _0x4a2b4a of _0x3f6f35) {
    const _0x56fe5f = toMessageString(_0x4a2b4a["errorMessage"] || _0x4a2b4a["message"] || _0x4a2b4a["error"] || _0x4a2b4a["msg"])["toUpperCase"]();
    if (!_0x56fe5f) {
      continue;
    }
    for (const [_0x327e0f, _0x2004b8] of Object["entries"](MESSAGE_HINT_TO_CODE)) {
      if (_0x56fe5f["includes"](_0x327e0f)) {
        return _0x2004b8;
      }
    }
  }
  return null;
}
function buildMappedError(_0x226522, _0x430d8f, _0x119f6a) {
  const _0x36a6e4 = MODEL_ERROR_CODE_MAP[_0x226522];
  if (!_0x36a6e4) {
    return null;
  }
  const _0x109354 = toMessageString(_0x119f6a);
  const _0x208279 = _0x226522 === 0x5e0 && _0x109354['toUpperCase']()["includes"]("UPSTREAM SERVICE TIMED OUT");
  const _0x3386d1 = _0x109354 && !_0x208279 && !_0x36a6e4["message"]['includes'](_0x109354) ? _0x36a6e4["message"] + " 上游详情：" + _0x109354 : _0x36a6e4["message"];
  return new ApiError({
    'type': _0x36a6e4["type"],
    'provider': "runninghub",
    'code': _0x226522,
    'message': _0x3386d1,
    'status': _0x430d8f,
    'retryable': _0x36a6e4["retryable"]
  });
}
export function parseError(_0x4ca971, _0x261770) {
  if (!_0x4ca971) {
    return null;
  }
  const _0xdb4e04 = extractMessage(_0x4ca971);
  const _0x188609 = extractErrorCode(_0x4ca971);
  if (_0x188609 !== null) {
    const _0x479a09 = buildMappedError(_0x188609, _0x261770, _0xdb4e04);
    if (_0x479a09) {
      return _0x479a09;
    }
  }
  if (_0x261770 >= 0x190) {
    return ApiError['fromHttpStatus'](_0x261770, "runninghub", _0xdb4e04);
  }
  return null;
}
export function parseTaskError(_0x8107e7) {
  if (!_0x8107e7 || typeof _0x8107e7 !== "object") {
    return null;
  }
  const _0x3c7556 = extractMessage(_0x8107e7);
  const _0xbc98e1 = extractErrorCode(_0x8107e7);
  if (_0xbc98e1 !== null) {
    const _0x203f70 = buildMappedError(_0xbc98e1, null, _0x3c7556);
    if (_0x203f70) {
      return _0x203f70;
    }
  }
  const _0x1dc027 = collectCandidateObjects(_0x8107e7)["map"](_0x208fc0 => String(_0x208fc0['status'] || _0x208fc0["taskStatus"] || _0x208fc0['task_status'] || '')['toUpperCase']())["filter"](Boolean);
  const _0x5768c0 = _0x1dc027[0x0] || '';
  if (_0x5768c0 === 'TIMEOUT') {
    return ApiError["taskTimeout"]("runninghub");
  }
  if (_0x5768c0 === "FAILED" || _0x5768c0 === 'ERROR') {
    const _0x38b2ac = _0x3c7556 || "任务执行失败";
    return ApiError["taskFailed"]("runninghub", _0x38b2ac);
  }
  return null;
}
export default {
  'parseError': parseError,
  'parseTaskError': parseTaskError
};