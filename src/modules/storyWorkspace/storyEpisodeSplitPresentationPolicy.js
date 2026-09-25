const normalizeText = _0x120bf5 => String(_0x120bf5 ?? '')['trim']();
export function isStoryEpisodeExperimentalSplitAvailable(_0x39e7a0 = globalThis["window"]) {
  return _0x39e7a0?.["DEV_MODE"] === !![];
}
export function shouldUseStoryEpisodeExperimentalSplit(_0x174b1c = {}) {
  return _0x174b1c?.["experimentalSplitMode"] === !![];
}
export function resolveStoryEpisodeExperimentalErrorMessage(_0x88d57e, {
  retryActionLabel = "开发测试"
} = {}) {
  const _0x514efe = normalizeText(_0x88d57e?.["message"] || _0x88d57e);
  const _0x2145aa = typeof _0x88d57e?.["getUserMessage"] === 'function' ? normalizeText(_0x88d57e["getUserMessage"]()) : '';
  const _0x4bd74a = _0x2145aa || _0x514efe;
  if (/api\s*key|密钥|额度|余额|未登录|未授权/iu['test'](_0x4bd74a) || /缺少(?:可用的)?(?:场景资产|剧本正文|标题)|请先选择可用的文本模型|场景资产(?:未完整覆盖|存在重复绑定)|请先重新提取场景资产/u['test'](_0x4bd74a)) {
    return _0x4bd74a["replaceAll"]('资产', '素材');
  }
  const _0x3b8980 = normalizeText(retryActionLabel) || "开发测试";
  return "本次分镜生成未完成，已保存当前进度。请稍后再次点击“" + _0x3b8980 + "”继续。";
}