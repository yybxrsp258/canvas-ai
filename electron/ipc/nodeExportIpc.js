export function registerNodeExportIpcHandlers({
  ipcMain: _0x595c9f,
  exportSelectedNodesPackage: _0x498402,
  saveMediaFile: _0x5915fa,
  saveTextFile: _0x108cc9,
  saveMediaFiles: _0x2d7cf8,
  saveTimeline: _0x2d4ce8,
  openJianying: _0x2eaf0f
}) {
  _0x595c9f["handle"]("nodeExport:openJianying", async () => {
    if (typeof _0x2eaf0f !== "function") {
      return {
        'success': ![],
        'error': '当前环境无法打开剪映'
      };
    }
    return _0x2eaf0f();
  });
  _0x595c9f['handle']('nodeExport:saveTimeline', async (_0x55a9f1, _0x9ccd61) => {
    if (typeof _0x2d4ce8 !== "function") {
      throw new Error('当前环境不支持导出剪辑工程');
    }
    return _0x2d4ce8(_0x9ccd61 || {});
  });
  _0x595c9f["handle"]("nodeExport:exportSelected", async (_0x56137c, _0x5ed69c) => {
    if (typeof _0x498402 !== "function") {
      throw new Error("当前环境不支持批量下载节点");
    }
    return await _0x498402(_0x5ed69c || {});
  });
  _0x595c9f["handle"]("nodeExport:saveMedia", async (_0x1dacd9, _0x32cd9d) => {
    if (typeof _0x5915fa !== "function") {
      throw new Error("当前环境不支持保存媒体文件");
    }
    return await _0x5915fa(_0x32cd9d || {});
  });
  _0x595c9f["handle"]("nodeExport:saveText", async (_0x122749, _0x530cf7) => {
    if (typeof _0x108cc9 !== "function") {
      throw new Error("当前环境不支持保存文本文件");
    }
    return await _0x108cc9(_0x530cf7 || {});
  });
  _0x595c9f["handle"]("nodeExport:saveMediaFiles", async (_0x65d2ef, _0x425299) => {
    if (typeof _0x2d7cf8 !== 'function') {
      throw new Error("当前环境不支持批量保存媒体文件");
    }
    return await _0x2d7cf8(_0x425299 || {});
  });
}