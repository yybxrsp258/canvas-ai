import a296_0x404c04 from 'node:path';
import { homedir } from 'node:os';
import { stat } from 'node:fs/promises';
export async function findJianyingExecutable({
  platform = process["platform"],
  localAppData = process["env"]["LOCALAPPDATA"] || a296_0x404c04['join'](homedir(), "AppData", "Local"),
  inspect = stat
} = {}) {
  if (platform !== "win32" || !a296_0x404c04['isAbsolute'](localAppData)) {
    return '';
  }
  const _0x344c7f = a296_0x404c04["join"](localAppData, "JianyingPro", 'Apps', "JianyingPro.exe");
  try {
    return (await inspect(_0x344c7f))['isFile']() ? _0x344c7f : '';
  } catch {
    return '';
  }
}
export function createOpenJianyingOperation({
  openPath: _0x5d82f1,
  findExecutable = findJianyingExecutable
} = {}) {
  return async () => {
    try {
      const _0x5251ef = await findExecutable();
      if (!_0x5251ef) {
        return {
          'success': ![],
          'error': '未找到剪映启动程序，请手动打开剪映。'
        };
      }
      const _0x1bcd3 = await _0x5d82f1(_0x5251ef);
      if (_0x1bcd3) {
        throw new Error(_0x1bcd3);
      }
      return {
        'success': !![]
      };
    } catch {
      return {
        'success': ![],
        'error': "暂时无法自动打开剪映，请手动打开。"
      };
    }
  };
}