import { post } from './requester.js';
import { ensureConfig, getProviderConfig } from './configApi.js';
import { normalizeRunningHubModelApiProfileId } from '../src/modules/runningHubProviderProfiles.js';
export function parseRunningHubResourceReference(_0x57d86c, _0x2cd7b8, _0x59ac5c) {
  const _0x44d571 = String(_0x57d86c || '')["trim"]();
  let _0x2f77e8 = _0x44d571;
  let _0x2790de = _0x2cd7b8;
  let _0x53ea4a = normalizeRunningHubModelApiProfileId(_0x59ac5c);
  if (/^\d{1,30}$/["test"](_0x44d571) && _0x2cd7b8 === 'auto') {
    throw new Error("仅凭 ID 无法识别类型，请粘贴 RunningHub AI 应用或工作流的完整链接");
  }
  if (!/^\d{1,30}$/["test"](_0x44d571)) {
    let _0x5a99ba;
    try {
      _0x5a99ba = new URL(_0x44d571);
    } catch {
      throw new Error("请输入 RunningHub ID 或完整链接");
    }
    if (_0x5a99ba["protocol"] !== "https:" || !/^(www\.)?runninghub\.(cn|ai)$/["test"](_0x5a99ba["hostname"]) || _0x5a99ba["port"] || _0x5a99ba["username"] || _0x5a99ba["password"]) {
      throw new Error("请使用 RunningHub 官方国内或国际站链接");
    }
    if (_0x2cd7b8 === "auto") {
      _0x2790de = /^\/(?:workflow|post|openapi\/v2\/run\/workflow)\//["test"](_0x5a99ba["pathname"]) ? 'runninghub-workflow' : "runninghub-ai-app";
    }
    const _0x2a2de5 = _0x2790de === "runninghub-workflow" ? /^\/(?:workflow|post|openapi\/v2\/run\/workflow)\/(\d{1,30})\/?$/ : /^\/(?:ai-detail|openapi\/v2\/run\/ai-app)\/(\d{1,30})\/?$/;
    _0x2f77e8 = _0x5a99ba["pathname"]["match"](_0x2a2de5)?.[0x1];
    if (!_0x2f77e8) {
      throw new Error(_0x2cd7b8 === "runninghub-workflow" ? "请提供工作流链接，不是 AI 应用链接" : "请提供 AI 应用链接，不是工作流链接");
    }
    _0x53ea4a = _0x5a99ba['hostname']['endsWith'](".ai") ? "runninghub-international" : 'runninghub';
  }
  return {
    'resourceId': _0x2f77e8,
    'providerProfileId': _0x53ea4a,
    'sourceType': _0x2790de
  };
}
export async function fetchRunningHubDefinition({
  reference: _0x5c0f42,
  sourceType: _0x53f248,
  profileId: _0x17130a,
  signal: _0x993309
}) {
  if (!["runninghub-ai-app", 'runninghub-workflow', "auto"]['includes'](_0x53f248)) {
    throw new Error("不支持的 RunningHub 来源类型");
  }
  const _0x38f5f7 = parseRunningHubResourceReference(_0x5c0f42, _0x53f248, _0x17130a);
  await ensureConfig();
  if (_0x993309?.["aborted"]) {
    throw new DOMException("已取消", "AbortError");
  }
  const _0x2d7038 = getProviderConfig(_0x38f5f7["providerProfileId"])?.["apiKey"];
  if (!_0x2d7038) {
    throw new Error("请先在设置中配置对应站点的 RunningHub API Key");
  }
  const _0x2b01b9 = await post("/api/v2/runninghubwf/definition", {
    ..._0x38f5f7,
    'apiKey': _0x2d7038
  }, {
    'provider': "runninghubwf",
    'signal': _0x993309,
    'timeout': 0x88b8
  });
  if (Number(_0x2b01b9?.["code"]) !== 0x0 || !_0x2b01b9?.["data"]) {
    throw new Error('RunningHub\x20未返回有效配置');
  }
  const _0x24979f = _0x2b01b9["data"];
  if (_0x38f5f7["sourceType"] === "runninghub-workflow") {
    const _0x29f6c6 = typeof _0x24979f["prompt"] === "string" ? JSON["parse"](_0x24979f["prompt"]) : _0x24979f["prompt"];
    if (!_0x29f6c6 || typeof _0x29f6c6 !== "object" || Array["isArray"](_0x29f6c6)) {
      throw new Error("RunningHub 未返回 API 格式工作流");
    }
    return {
      ..._0x38f5f7,
      'input': JSON["stringify"]({
        'workflowId': _0x38f5f7["resourceId"],
        'workflow': _0x29f6c6,
        'providerProfileId': _0x38f5f7["providerProfileId"]
      }),
      'name': "RH 工作流 " + _0x38f5f7["resourceId"]
    };
  }
  if (!Array["isArray"](_0x24979f["nodeInfoList"]) || !_0x24979f["nodeInfoList"]["length"]) {
    throw new Error("该 AI 应用没有返回可编辑参数，请检查应用权限");
  }
  const _0xe8e5e2 = _0x24979f["nodeInfoList"]['map'](_0x12c5c2 => Object["fromEntries"](['nodeId', "nodeName", "fieldName", "fieldValue", "fieldType", "fieldData", 'description']["filter"](_0x5a2f2b => Object['hasOwn'](_0x12c5c2, _0x5a2f2b))["map"](_0x28bb0b => [_0x28bb0b, _0x12c5c2[_0x28bb0b]])));
  return {
    ..._0x38f5f7,
    'name': String(_0x24979f['webappName'] || 'RH\x20AI应用\x20' + _0x38f5f7['resourceId']),
    'input': JSON["stringify"]({
      'appId': _0x38f5f7["resourceId"],
      'nodeInfoList': _0xe8e5e2,
      'providerProfileId': _0x38f5f7['providerProfileId']
    })
  };
}