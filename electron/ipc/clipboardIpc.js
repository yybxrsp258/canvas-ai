export function registerClipboardIpcHandlers({
  ipcMain: _0x852e95,
  clipboardOperations: _0x480fd8
}) {
  _0x852e95["handle"]('clipboard:writeImage', (_0xd77355, _0xc80d67) => _0x480fd8['writeImage'](_0xc80d67));
  _0x852e95['handle']("clipboard:readImage", () => _0x480fd8["readImage"]());
  _0x852e95["handle"]("clipboard:writeFileReferences", (_0x5f0c11, _0x16fbe2) => _0x480fd8["writeFileReferences"](_0x16fbe2));
  _0x852e95["handle"]("clipboard:readFileReferences", () => _0x480fd8['readFileReferences']());
  _0x852e95['handle']('clipboard:writeText', (_0x30f7e9, _0x18243d) => _0x480fd8["writeText"](_0x18243d));
  _0x852e95["handle"]('clipboard:readText', () => _0x480fd8["readText"]());
}