import a298_0x8b3eb from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, stat, rm, writeFile } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { runToolCapture } from '../toolCapture.js';
import { normalizeTimelineMediaMetadata, resolveTimelinePlan, validateTimelineRequest } from './timelinePlan.js';
import { buildPremiereXml } from './premiereXml.js';
import { buildJianyingDraft } from './jianyingDraft.js';
import { findJianyingDraftDirectory } from './jianyingDraftLocation.js';
function safeName(_0xaf9739) {
  const _0x455629 = String(_0xaf9739 || "剪辑工程")["trim"]()['replace'](/[\\/:*?"<>|\x00-\x1f]/g, '_')["slice"](0x0, 0x46)['replace'](/[. ]+$/g, '') || "剪辑工程";
  return /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i["test"](_0x455629) ? '_' + _0x455629 : _0x455629;
}
async function createProjectDirectory(_0x18e441, _0x93a821) {
  const _0x2e5cd6 = safeName(_0x93a821);
  for (let _0x52e6d1 = 0x1; _0x52e6d1 <= 0x2710; _0x52e6d1 += 0x1) {
    const _0x40df93 = a298_0x8b3eb["join"](_0x18e441, _0x52e6d1 === 0x1 ? _0x2e5cd6 : _0x2e5cd6 + '\x20(' + _0x52e6d1 + ')');
    try {
      await mkdir(_0x40df93);
      return _0x40df93;
    } catch (_0x283fb6) {
      if (_0x283fb6["code"] !== "EEXIST") {
        throw _0x283fb6;
      }
    }
  }
  throw new Error("同名工程过多，请更换项目名称或保存目录");
}
export function createTimelineExportOperation({
  showOpenDialog: _0x4012e1,
  getDefaultDirectory: _0x45da6b,
  rememberDirectory = async () => {},
  resolveLocalVirtualPath: _0x5e2be1,
  getRuntimeToolOrFallback: _0x48a7ef,
  findDraftDirectory = findJianyingDraftDirectory,
  probeMedia = async _0x55a2c8 => normalizeTimelineMediaMetadata(JSON['parse'](String(await runToolCapture(_0x48a7ef('ffprobe'), ['-v', 'error', '-show_streams', "-show_format", "-of", 'json', _0x55a2c8], {
    'timeoutMs': 0x7530,
    'windowsHide': !![]
  }))))
} = {}) {
  return async (_0x1d888b = {}) => {
    const _0xe9cf28 = validateTimelineRequest(_0x1d888b);
    const _0x2fd8f1 = new Map();
    for (const _0x42f574 of _0xe9cf28["media"]) {
      const _0x17a497 = _0x5e2be1(_0x42f574['localPath']);
      if (!_0x17a497 || !a298_0x8b3eb["isAbsolute"](_0x17a497)) {
        throw new Error("工程素材路径不可用");
      }
      if (!(await stat(_0x17a497))["isFile"]()) {
        throw new Error(_0x42f574["name"] + "不是有效视频文件");
      }
      _0x2fd8f1['set'](_0x42f574['id'], _0x17a497);
    }
    let _0x416839 = _0xe9cf28["format"] === "jianying-draft" ? await findDraftDirectory() : '';
    let _0x103383 = '';
    let _0x201d46 = ![];
    if (_0x416839 && a298_0x8b3eb['isAbsolute'](_0x416839)) {
      try {
        _0x103383 = await createProjectDirectory(_0x416839, _0xe9cf28["name"]);
        _0x201d46 = !![];
      } catch (_0x18f857) {
        if (!["ENOENT", "ENOTDIR", "EACCES", "EPERM", "EROFS"]["includes"](_0x18f857["code"])) {
          throw _0x18f857;
        }
      }
    }
    if (!_0x103383) {
      const _0x4a6152 = await _0x4012e1({
        'title': _0xe9cf28["format"] === "jianying-draft" ? '选择剪映草稿位置（将在其中新建草稿）' : "选择 Premiere 工程保存目录",
        'defaultPath': _0x45da6b(),
        'properties': ['openDirectory', "createDirectory"]
      });
      if (_0x4a6152["canceled"] || !_0x4a6152["filePaths"]?.[0x0]) {
        return {
          'success': ![],
          'canceled': !![]
        };
      }
      _0x416839 = _0x4a6152['filePaths'][0x0];
      if (!a298_0x8b3eb['isAbsolute'](_0x416839)) {
        throw new Error("工程保存目录无效");
      }
      _0x103383 = await createProjectDirectory(_0x416839, _0xe9cf28["name"]);
    }
    const _0x41733e = AbortSignal["timeout"](0x19 * 0x3c * 0x3e8);
    try {
      await mkdir(a298_0x8b3eb["join"](_0x103383, "media"));
      const _0x1d5315 = new Map();
      const _0x1dcf36 = new Map();
      for (const [_0x3c234e, _0x7a3866] of _0xe9cf28["media"]['entries']()) {
        _0x41733e['throwIfAborted']();
        const _0x3a42a7 = _0x2fd8f1["get"](_0x7a3866['id']);
        const _0x4a03f7 = a298_0x8b3eb["extname"](_0x3a42a7)["toLowerCase"]();
        if (!/^\.[a-z0-9]{1,10}$/['test'](_0x4a03f7)) {
          throw new Error(_0x7a3866["name"] + "的文件扩展名无效");
        }
        const _0x23b756 = a298_0x8b3eb["join"](_0x103383, 'media', String(_0x3c234e + 0x1)["padStart"](0x3, '0') + '-' + safeName(_0x7a3866['name']) + _0x4a03f7);
        await pipeline(createReadStream(_0x3a42a7), createWriteStream(_0x23b756, {
          'flags': 'wx'
        }), {
          'signal': _0x41733e
        });
        _0x1dcf36["set"](_0x7a3866['id'], await probeMedia(_0x23b756));
        _0x1d5315["set"](_0x7a3866['id'], _0x23b756);
      }
      _0x41733e['throwIfAborted']();
      const _0x33b8ec = resolveTimelinePlan(_0xe9cf28, _0x1dcf36);
      const _0xa0e92c = _0xe9cf28['format'] === "premiere-xml" ? new Map([["timeline.xml", buildPremiereXml(_0x33b8ec, _0x1d5315)]]) : buildJianyingDraft(_0x33b8ec, _0x1d5315, _0x103383);
      const _0x1c3443 = _0xe9cf28["format"] === "premiere-xml" ? "在 Premiere 中选择 文件 → 导入，打开 timeline.xml。\n若移动了工程文件夹，请在定位媒体时选择本文件夹中的 media 目录。\n" : (_0x201d46 ? "草稿已自动保存到本机剪映草稿目录，刷新草稿列表或重启剪映即可。" : "请将本草稿文件夹放在剪映专业版 设置 → 草稿位置 对应的目录中，再刷新草稿列表或重启剪映。") + "\n若移动了草稿文件夹，请在打开时重新定位 media 目录中的素材。\n";
      _0xa0e92c["set"]("导入说明.txt", _0x1c3443 + "\n原视频与替换视频各一轨，对应音频各一轨；缺少素材的位置留空。\n等长镜头紧接排列；替换视频或音频更长时才延后下一镜头，较短轨道留空。\n视频素材已完整复制，替换视频未裁切、未变速；替换片段较短时保留原镜头范围。\n保留 media 文件夹。修改工程不会改变 SHUO Canvas 中的原始素材。\n");
      for (const [_0x4c65cc, _0x42dd23] of _0xa0e92c) {
        await writeFile(a298_0x8b3eb["join"](_0x103383, _0x4c65cc), _0x42dd23, {
          'encoding': "utf8",
          'flag': 'wx',
          'signal': _0x41733e
        });
      }
      if (!_0x201d46) {
        await rememberDirectory(_0x416839);
      }
      return {
        'success': !![],
        'canceled': ![],
        'directory': _0x103383,
        'autoDetected': _0x201d46,
        'format': _0xe9cf28["format"],
        'path': a298_0x8b3eb["join"](_0x103383, _0xe9cf28["format"] === 'premiere-xml' ? "timeline.xml" : 'draft_content.json'),
        'mediaCount': _0x1d5315["size"],
        'durationSec': _0x33b8ec["durationSec"]
      };
    } catch (_0x3dd2b9) {
      a298_0x8b3eb["dirname"](a298_0x8b3eb["resolve"](_0x103383)) === a298_0x8b3eb["resolve"](_0x416839) && (await rm(_0x103383, {
        'recursive': !![],
        'force': !![]
      })["catch"](() => {}));
      throw _0x3dd2b9;
    }
  };
}