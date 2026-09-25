import { ApiError, ErrorType } from '../ApiError.js';
const RH_ERROR_CODE_MAP = {
  0x12d: {
    'type': ErrorType['INVALID_PARAMS'],
    'message': '参数错误：必填参数缺失或类型不符，请核对文档'
  },
  0x17c: {
    'type': ErrorType['INVALID_PARAMS'],
    'message': '工作流不存在：指定的工作流\x20ID\x20无效'
  },
  0x19c: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': "API 路径拼写错误：请检查接口 URL 是否正确"
  },
  0x19f: {
    'type': ErrorType["RATE_LIMIT"],
    'message': "独占型 API 机器数不足：资源紧张，请等待 30-120 秒后重试",
    'retryable': !![]
  },
  0x1a0: {
    'type': ErrorType["INSUFFICIENT_BALANCE"],
    'message': '钱包余额不足：账户余额不足，请充值',
    'retryable': ![]
  },
  0x1a5: {
    'type': ErrorType["RATE_LIMIT"],
    'message': "共享型 API 并发上限：并发达上限，请自行排队或联系扩容",
    'retryable': !![]
  },
  0x1a7: {
    'type': ErrorType["TASK_FAILED"],
    'message': "未找到指定任务：任务 ID 错误或已被清理",
    'retryable': ![]
  },
  0x1b1: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': "工作流校验未通过：节点参数或连接逻辑错误，请查看 msg 详情"
  },
  0x1b3: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': '未找到任务用户\x20API\x20实例：48G显存机器调用时请添加参数\x20\x22instanceType\x22:\x20\x22plus\x22'
  },
  0x1b4: {
    'type': ErrorType["FORBIDDEN"],
    'message': "独占会员到期：独占资源服务已到期",
    'retryable': ![]
  },
  0x1f4: {
    'type': ErrorType["SERVER_ERROR"],
    'message': "未知错误：服务端异常，请联系技术支持",
    'retryable': !![]
  },
  0x321: {
    'type': ErrorType["FORBIDDEN"],
    'message': "免费用户不支持 API Key：请升级账户等级",
    'retryable': ![]
  },
  0x322: {
    'type': ErrorType["AUTH_ERROR"],
    'message': "API Key 未授权/已失效：密钥错误或已被禁用",
    'retryable': ![]
  },
  0x323: {
    'type': ErrorType['INVALID_PARAMS'],
    'message': 'nodeInfoList\x20不匹配：节点\x20ID\x20或字段名与工作流定义不一致'
  },
  0x324: {
    'type': ErrorType['INVALID_PARAMS'],
    'message': "任务正在运行中：请勿重复提交，建议轮询结果",
    'retryable': ![]
  },
  0x325: {
    'type': ErrorType["TASK_FAILED"],
    'message': "任务状态异常：任务可能已被中断或取消",
    'retryable': ![]
  },
  0x326: {
    'type': ErrorType["AUTH_ERROR"],
    'message': '未找到对应用户：Key\x20关联的用户信息不存在',
    'retryable': ![]
  },
  0x327: {
    'type': ErrorType['TASK_FAILED'],
    'message': "未找到对应任务：无法查询到该 ID 的任务记录",
    'retryable': ![]
  },
  0x328: {
    'type': ErrorType["SERVER_ERROR"],
    'message': "文件上传失败：存储服务异常或网络中断",
    'retryable': !![]
  },
  0x329: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': "文件大小超出限制：上传的文件体积过大",
    'retryable': ![]
  },
  0x32a: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': "未保存或未运行工作流：请在平台保存并手动运行一次该工作流",
    'retryable': ![]
  },
  0x32b: {
    'type': ErrorType["AUTH_ERROR"],
    'message': "企业版 API Key 无效：密钥错误或无企业权限",
    'retryable': ![]
  },
  0x32c: {
    'type': ErrorType['INSUFFICIENT_BALANCE'],
    'message': "企业版余额不足：企业账户资金耗尽",
    'retryable': ![]
  },
  0x32d: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': "任务已排队：任务已受理，无需重试",
    'retryable': ![]
  },
  0x385: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': "WebApp 不存在：关联的应用 ID 错误",
    'retryable': ![]
  },
  0x3e8: {
    'type': ErrorType["SERVER_ERROR"],
    'message': "未知错误：请重试或联系支持",
    'retryable': !![]
  },
  0x3e9: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': "请求链接无效：请检查您的调用链接",
    'retryable': ![]
  },
  0x3ea: {
    'type': ErrorType["AUTH_ERROR"],
    'message': "API Key 无效：请检查您的密钥",
    'retryable': ![]
  },
  0x3eb: {
    'type': ErrorType["RATE_LIMIT"],
    'message': "请求频率超限：请降低请求速度",
    'retryable': !![]
  },
  0x3ec: {
    'type': ErrorType["TASK_FAILED"],
    'message': "任务不存在或已过期：请检查任务 ID",
    'retryable': ![]
  },
  0x3ed: {
    'type': ErrorType["SERVER_ERROR"],
    'message': '系统内部错误：请稍后重试',
    'retryable': !![]
  },
  0x3ee: {
    'type': ErrorType['TASK_TIMEOUT'],
    'message': "任务执行超时：请重试",
    'retryable': !![]
  },
  0x3ef: {
    'type': ErrorType['INVALID_PARAMS'],
    'message': "参数校验失败：请检查输入参数",
    'retryable': ![]
  },
  0x3f0: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': "文件大小超出限制：请压缩文件后重试",
    'retryable': ![]
  },
  0x3f1: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': "请求方法不支持：请查阅文档确认 (GET/POST)",
    'retryable': ![]
  },
  0x3f2: {
    'type': ErrorType['SERVICE_UNAVAILABLE'],
    'message': "服务暂不可用：请稍后重试",
    'retryable': !![]
  },
  0x3f3: {
    'type': ErrorType["RATE_LIMIT"],
    'message': "系统繁忙：请求量大，请稍后重试",
    'retryable': !![]
  },
  0x3f4: {
    'type': ErrorType['SERVER_ERROR'],
    'message': '上游服务响应异常：请联系技术支持或稍后重试',
    'retryable': !![]
  },
  0x3f5: {
    'type': ErrorType['SERVER_ERROR'],
    'message': '文件处理失败：请检查链接或重新上传',
    'retryable': !![]
  },
  0x3f6: {
    'type': ErrorType["FORBIDDEN"],
    'message': "访问被拒绝：标准模型 API 仅限企业级-共享 API Key 调用",
    'retryable': ![]
  },
  0x3f7: {
    'type': ErrorType["TASK_FAILED"],
    'message': "生成失败：请重试",
    'retryable': !![]
  },
  0x44d: {
    'type': ErrorType["INVALID_PARAMS"],
    'message': "节点信息异常：工作流节点数据解析错误",
    'retryable': ![]
  },
  0x5dd: {
    'type': ErrorType["CONTENT_FILTERED"],
    'message': "内容审核未通过：请修改提示词或图片",
    'retryable': ![]
  },
  0x5e0: {
    'type': ErrorType["TIMEOUT"],
    'message': "模型响应超时：请稍后重试",
    'retryable': !![]
  },
  0x5e1: {
    'type': ErrorType["CONTENT_FILTERED"],
    'message': "禁止生成真人：请修改提示词或参考图",
    'retryable': ![]
  }
};
const RH_ERROR_MSG_MAP = {
  'PARAMS_INVALID': 0x12d,
  'WORKFLOW_NOT_EXISTS': 0x17c,
  'TOKEN_INVALID': 0x19c,
  'TASK_INSTANCE_MAXED': 0x19f,
  'TASK_CREATE_FAILED_BY_NOT_ENOUGH_WALLET': 0x1a0,
  'TASK_QUEUE_MAXED': 0x1a5,
  'TASK_NOT_FOUNED': 0x1a7,
  'VALIDATE_PROMPT_FAILED': 0x1b1,
  'TASK_USER_EXCLAPI_INSTANCE_NOT_FOUND': 0x1b3,
  'TASK_USER_EXCLAPI_REQUIRED': 0x1b4,
  'UNKNOWN_ERROR': 0x1f4,
  'APIKEY_UNSUPPORTED_FREE_USER': 0x321,
  'APIKEY_UNAUTHORIZED': 0x322,
  'APIKEY_INVALID_NODE_INFO': 0x323,
  'APIKEY_TASK_IS_RUNNING': 0x324,
  'APIKEY_TASK_STATUS_ERROR': 0x325,
  'APIKEY_USER_NOT_FOUND': 0x326,
  'APIKEY_TASK_NOT_FOUND': 0x327,
  'APIKEY_UPLOAD_FAILED': 0x328,
  'APIKEY_FILE_SIZE_EXCEEDED': 0x329,
  'WORKFLOW_NOT_SAVED_OR_NOT_RUNNING': 0x32a,
  'CORPAPIKEY_INVALID': 0x32b,
  'CORPAPIKEY_INSUFFICIENT_FUNDS': 0x32c,
  'APIKEY_TASK_IS_QUEUED': 0x32d,
  'WEBAPP_NOT_EXISTS': 0x385
};
function isPlainObject(_0x49263c) {
  return !!_0x49263c && typeof _0x49263c === "object" && !Array["isArray"](_0x49263c);
}
function toNonEmptyString(_0x41d4cb) {
  const _0x213e84 = String(_0x41d4cb ?? '')["trim"]();
  return _0x213e84 || '';
}
function toMessageString(_0x55563e) {
  if (isPlainObject(_0x55563e)) {
    return toNonEmptyString(_0x55563e["errorMessage"] || _0x55563e["message"] || _0x55563e["error"] || _0x55563e["msg"]);
  }
  return toNonEmptyString(_0x55563e);
}
function parseJsonObject(_0x3a053e) {
  const _0x55d0d4 = toNonEmptyString(_0x3a053e);
  if (!_0x55d0d4 || !/^[{[]/['test'](_0x55d0d4)) {
    return null;
  }
  try {
    const _0x58176a = JSON["parse"](_0x55d0d4);
    return _0x58176a && typeof _0x58176a === "object" ? _0x58176a : null;
  } catch {
    return null;
  }
}
function collectCandidateObjects(_0x80cb85) {
  if (!_0x80cb85 || typeof _0x80cb85 !== "object") {
    return [];
  }
  const _0x2c5979 = [];
  const _0x2d6c5d = _0x188a57 => {
    if (isPlainObject(_0x188a57)) {
      _0x2c5979['push'](_0x188a57);
    }
  };
  const _0x29a998 = _0x5196d4 => {
    if (!Array['isArray'](_0x5196d4)) {
      return;
    }
    _0x5196d4['forEach'](_0x2d6c5d);
  };
  _0x2d6c5d(_0x80cb85);
  _0x29a998(_0x80cb85);
  _0x2d6c5d(_0x80cb85["data"]);
  _0x2d6c5d(_0x80cb85["result"]);
  _0x2d6c5d(_0x80cb85["output"]);
  _0x2d6c5d(_0x80cb85["response"]);
  _0x29a998(_0x80cb85["data"]);
  _0x29a998(_0x80cb85["results"]);
  return _0x2c5979;
}
function extractFailureBaseMessage(_0x265727, _0x12333e) {
  const _0x4febe5 = collectCandidateObjects(_0x265727);
  for (const _0x34e0d8 of _0x4febe5) {
    const _0x1c2ef4 = [_0x34e0d8["errorMessage"], _0x34e0d8["error"], _0x34e0d8["message"], _0x34e0d8["msg"], _0x34e0d8['failure_reason']];
    for (const _0x34d7a9 of _0x1c2ef4) {
      const _0x1d6fb4 = toMessageString(_0x34d7a9);
      if (_0x1d6fb4) {
        return _0x1d6fb4;
      }
    }
  }
  return toNonEmptyString(_0x12333e) || "任务执行失败";
}
function extractDetailFromText(_0x392ed4) {
  const _0x59d551 = toNonEmptyString(_0x392ed4);
  if (!_0x59d551) {
    return {
      'nodeId': '',
      'exceptionMessage': ''
    };
  }
  const _0x1f8308 = _0x59d551["match"](/["']?node_id["']?\s*[:=]\s*["']?([^"',}\]\n\r]*)/i);
  const _0x410c62 = _0x59d551['match'](/["']?exception_message["']?\s*[:=]\s*["']?([^"',}\]\n\r]*)/i);
  return {
    'nodeId': toNonEmptyString(_0x1f8308?.[0x1]),
    'exceptionMessage': toNonEmptyString(_0x410c62?.[0x1])
  };
}
function extractDetailFromValue(_0x3d3dbc) {
  const _0x43f16c = parseJsonObject(_0x3d3dbc);
  const _0x4dccd6 = _0x43f16c || _0x3d3dbc;
  if (isPlainObject(_0x4dccd6)) {
    const _0x57d66e = toNonEmptyString(_0x4dccd6["node_id"] || _0x4dccd6["nodeId"]);
    const _0x6fa5c5 = toNonEmptyString(_0x4dccd6["exception_message"] || _0x4dccd6['exceptionMessage']);
    if (_0x57d66e || _0x6fa5c5) {
      return {
        'nodeId': _0x57d66e,
        'exceptionMessage': _0x6fa5c5
      };
    }
  }
  if (typeof _0x4dccd6 === "string") {
    return extractDetailFromText(_0x4dccd6);
  }
  return {
    'nodeId': '',
    'exceptionMessage': ''
  };
}
function extractFailedReasonDetails(_0x5f2d3e) {
  const _0x5e0a13 = collectCandidateObjects(_0x5f2d3e);
  for (const _0x448040 of _0x5e0a13) {
    const _0x260c4e = extractDetailFromValue(_0x448040);
    if (_0x260c4e["nodeId"] || _0x260c4e["exceptionMessage"]) {
      return _0x260c4e;
    }
    const _0x19823b = _0x448040["failedReason"] ?? _0x448040['failed_reason'];
    const _0x27a7d7 = extractDetailFromValue(_0x19823b);
    if (_0x27a7d7["nodeId"] || _0x27a7d7["exceptionMessage"]) {
      return _0x27a7d7;
    }
    const _0x2fdc43 = extractDetailFromValue(_0x448040["data"]?.["failedReason"] ?? _0x448040['data']?.["failed_reason"]);
    if (_0x2fdc43["nodeId"] || _0x2fdc43["exceptionMessage"]) {
      return _0x2fdc43;
    }
  }
  return {
    'nodeId': '',
    'exceptionMessage': ''
  };
}
export function appendRunningHubFailureDetails(_0x33b1b3, _0x4f9f12) {
  const _0x975bb3 = toNonEmptyString(_0x33b1b3) || "任务执行失败";
  const {
    nodeId: _0x5b81d4,
    exceptionMessage: _0x4568be
  } = extractFailedReasonDetails(_0x4f9f12);
  const _0x1b888e = [_0x975bb3];
  if (_0x5b81d4) {
    _0x1b888e["push"]('node_id:\x20' + _0x5b81d4);
  }
  if (_0x4568be) {
    _0x1b888e["push"]('exception_message:\x20' + _0x4568be);
  }
  return _0x1b888e["join"]('\x0a');
}
export function formatRunningHubFailureMessage(_0x20f548, _0x36b071 = '任务执行失败') {
  return appendRunningHubFailureDetails(extractFailureBaseMessage(_0x20f548, _0x36b071), _0x20f548);
}
function extractErrorCode(_0x199d41) {
  const _0x4d8227 = collectCandidateObjects(_0x199d41);
  for (const _0x59bfde of _0x4d8227) {
    const _0x49e848 = [_0x59bfde['code'], _0x59bfde['errorCode'], _0x59bfde["error_code"]];
    for (const _0x46db0e of _0x49e848) {
      const _0x28d68e = toNonEmptyString(_0x46db0e);
      if (!_0x28d68e || _0x28d68e === '0') {
        continue;
      }
      const _0x25c260 = Number(_0x28d68e);
      if (Number["isFinite"](_0x25c260)) {
        return _0x25c260;
      }
      const _0x442559 = RH_ERROR_MSG_MAP[_0x28d68e["toUpperCase"]()];
      if (_0x442559) {
        return _0x442559;
      }
    }
  }
  for (const _0x658710 of _0x4d8227) {
    const _0x233cb5 = toMessageString(_0x658710["msg"] || _0x658710["message"] || _0x658710['errorMessage'] || _0x658710["error"]);
    for (const [_0x36fd27, _0x35477f] of Object["entries"](RH_ERROR_MSG_MAP)) {
      if (_0x233cb5["includes"](_0x36fd27)) {
        return _0x35477f;
      }
    }
  }
  return null;
}
export function parseError(_0x5e6551, _0x10101a) {
  if (!_0x5e6551) {
    return null;
  }
  const _0x47fcac = parseTaskError(_0x5e6551);
  if (_0x47fcac) {
    return _0x47fcac;
  }
  const _0x1c732d = extractErrorCode(_0x5e6551);
  if (_0x1c732d && RH_ERROR_CODE_MAP[_0x1c732d]) {
    const _0x58be9b = RH_ERROR_CODE_MAP[_0x1c732d];
    return new ApiError({
      'type': _0x58be9b['type'],
      'provider': "runninghub",
      'code': _0x1c732d,
      'message': appendRunningHubFailureDetails(_0x58be9b["message"], _0x5e6551),
      'status': _0x10101a,
      'retryable': _0x58be9b['retryable'] ?? (_0x1c732d >= 0x3ed && _0x1c732d !== 0x3f7)
    });
  }
  const _0x3f5485 = _0x5e6551["errorMessage"] || _0x5e6551["error"] || _0x5e6551["message"] || _0x5e6551["msg"] || '';
  const _0x1a0cb2 = String(_0x3f5485)["toUpperCase"]();
  if (_0x1a0cb2["includes"]('BALANCE') || _0x1a0cb2['includes']("WALLET") || _0x1a0cb2['includes']('余额') || _0x1a0cb2["includes"]('资金')) {
    return ApiError['insufficientBalance']("runninghub", _0x1c732d || _0x10101a);
  }
  if (_0x10101a === 0x191 || _0x1a0cb2["includes"]("API_KEY") || _0x1a0cb2["includes"]('UNAUTHORIZED') || _0x1a0cb2['includes']('AUTH')) {
    return ApiError["authError"]("runninghub", _0x1c732d || _0x10101a, _0x3f5485);
  }
  if (_0x10101a === 0x1ad || _0x1a0cb2["includes"]('RATE_LIMIT') || _0x1a0cb2['includes']('TOO_MANY') || _0x1a0cb2['includes']('繁忙')) {
    return ApiError["rateLimit"]("runninghub", _0x1c732d || _0x10101a);
  }
  if (_0x1a0cb2["includes"]("CONTENT") || _0x1a0cb2['includes']('审核') || _0x1a0cb2["includes"]('真人') || _0x1a0cb2["includes"]("PHOTOREALISTIC")) {
    return ApiError['contentFiltered']("runninghub", _0x3f5485);
  }
  const _0x474771 = (_0x5e6551['status'] || '')['toUpperCase']();
  if (_0x474771 === "FAILED" || _0x474771 === "ERROR") {
    return ApiError['taskFailed']('runninghub', formatRunningHubFailureMessage(_0x5e6551, _0x3f5485 || "任务执行失败"));
  }
  if (_0x10101a >= 0x190) {
    return ApiError["fromHttpStatus"](_0x10101a, "runninghub", _0x3f5485);
  }
  return null;
}
export function parseTaskError(_0x26db58) {
  if (!_0x26db58) {
    return null;
  }
  const _0x37418b = collectCandidateObjects(_0x26db58)["find"](_0x265633 => {
    const _0xc30f89 = String(_0x265633["status"] || _0x265633['taskStatus'] || _0x265633["task_status"] || '')['toUpperCase']();
    return _0xc30f89 === "FAILED" || _0xc30f89 === "ERROR";
  });
  const _0x4aad38 = _0x37418b ? "FAILED" : (_0x26db58["status"] || _0x26db58["taskStatus"] || '')["toUpperCase"]();
  if (_0x4aad38 === "FAILED" || _0x4aad38 === "ERROR") {
    const _0x319137 = _0x37418b || _0x26db58;
    const _0x1001bc = extractFailureBaseMessage(_0x319137, "未知错误");
    for (const [_0x13f72b, _0x53ffb2] of Object["entries"](RH_ERROR_MSG_MAP)) {
      if (_0x1001bc['includes'](_0x13f72b) && RH_ERROR_CODE_MAP[_0x53ffb2]) {
        const _0x5cffe8 = RH_ERROR_CODE_MAP[_0x53ffb2];
        return new ApiError({
          'type': _0x5cffe8["type"],
          'provider': "runninghub",
          'code': _0x53ffb2,
          'message': appendRunningHubFailureDetails(_0x5cffe8['message'], _0x319137),
          'retryable': _0x5cffe8['retryable'] ?? ![]
        });
      }
    }
    return ApiError["taskFailed"]('runninghub', formatRunningHubFailureMessage(_0x319137, _0x1001bc));
  }
  if (_0x4aad38 === 'TIMEOUT') {
    return ApiError['taskTimeout']('runninghub');
  }
  return null;
}
export default {
  'parseError': parseError,
  'parseTaskError': parseTaskError
};