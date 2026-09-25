import a295_0x50715f from 'node:path';
import { homedir } from 'node:os';
import { constants } from 'node:fs';
import { access, readFile, stat } from 'node:fs/promises';
export function readJianyingDraftPathSetting(_0x2cec4d) {
  let _0x8f4e48 = '';
  for (const _0x481f04 of _0x2cec4d["split"](/\r?\n/)) {
    const _0x55b01d = _0x481f04["trim"]();
    if (_0x55b01d["startsWith"]('[')) {
      _0x8f4e48 = _0x55b01d;
    }
    if (_0x8f4e48 !== "[General]") {
      continue;
    }
    const _0x548ef8 = /^currentCustomDraftPath\s*=(.*)$/["exec"](_0x55b01d);
    if (!_0x548ef8) {
      continue;
    }
    return _0x548ef8[0x1]['trim']()["replace"](/^"(.*)"$/, '$1')["replace"](/\\(\\|x[0-9a-fA-F]{1,4})/g, (_0xa0c6c3, _0x196ec8) => _0x196ec8 === '\x5c' ? '\x5c' : String["fromCharCode"](parseInt(_0x196ec8['slice'](0x1), 0x10)));
  }
  return '';
}
export async function findJianyingDraftDirectory({
  platform = process["platform"],
  localAppData = process["env"]["LOCALAPPDATA"] || a295_0x50715f['join'](homedir(), "AppData", "Local"),
  read = readFile,
  inspect = stat,
  checkAccess = access
} = {}) {
  if (platform !== "win32" || !a295_0x50715f["isAbsolute"](localAppData)) {
    return '';
  }
  const _0x2f3f08 = a295_0x50715f['join'](localAppData, "JianyingPro", "User Data");
  const _0x1f14b0 = a295_0x50715f['join'](_0x2f3f08, "Config", "globalSetting");
  let _0x47a649 = '';
  try {
    if ((await inspect(_0x1f14b0))["size"] > 0x400 * 0x400) {
      return '';
    }
    _0x47a649 = readJianyingDraftPathSetting(await read(_0x1f14b0, "utf8"));
  } catch (_0x1bb02d) {
    if (_0x1bb02d["code"] !== "ENOENT") {
      return '';
    }
  }
  const _0x417c39 = _0x47a649 || a295_0x50715f['join'](_0x2f3f08, "Projects", "com.lveditor.draft");
  if (!a295_0x50715f['isAbsolute'](_0x417c39)) {
    return '';
  }
  try {
    if (!(await inspect(_0x417c39))['isDirectory']()) {
      return '';
    }
    await checkAccess(_0x417c39, constants["W_OK"]);
    return a295_0x50715f['resolve'](_0x417c39);
  } catch {
    return '';
  }
}