// 发版入口：同步版本号 → 调用 tools/pack-dist.cjs 打包 → 调用 tools/publish-oss.mjs 上传。
// 本机没有 node/npm，用 Electron 内置 node 执行：
//   ELECTRON_RUN_AS_NODE=1 ./node_modules/electron/dist/electron.exe tools/release.mjs 0.1.3
//
// 版本号真源是 package.json，但 index.html 的 <meta name="app-version"> 是 UI 实际显示
// 且主进程读取的版本（electron/main.js readAppVersionFromIndexHtml），两处必须一起改，
// 而 electron-updater 比对的只有 package.json 的 version —— 不一致就会出现"显示 0.1.2 却提示已是最新"。
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKG = path.join(ROOT, 'package.json');
const INDEX = path.join(ROOT, 'index.html');
const BUILDER_YML = path.join(ROOT, 'electron-builder.yml');

function parseArgs(argv) {
  const args = { version: null, build: true, publish: true, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--no-build') args.build = false;
    else if (a === '--no-publish') args.publish = false;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '-h' || a === '--help') args.help = true;
    else if (a.startsWith('-')) throw new Error(`未知参数：${a}`);
    else if (!args.version) args.version = a;
    else throw new Error(`多余参数：${a}`);
  }
  return args;
}

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

function bumpVersions(next) {
  if (!/^\d+\.\d+\.\d+$/.test(next)) {
    throw new Error(`版本号必须是 X.Y.Z 三段数字，收到：${next}`);
  }
  const pkgRaw = readFileSync(PKG, 'utf8');
  const current = JSON.parse(pkgRaw).version;
  if (compareVersions(next, current) === 0) {
    console.log(`[release] 版本已是 ${next}，跳过版本同步（按重试发布处理）`);
    return;
  }
  if (compareVersions(next, current) < 0) {
    throw new Error(`新版本号 ${next} 必须大于当前 ${current}：electron-updater 只认严格递增的版本`);
  }
  const pkgNext = pkgRaw.replace(/("version"\s*:\s*")[^"]+(")/, `$1${next}$2`);
  if (pkgNext === pkgRaw) throw new Error('package.json 里没找到 version 字段');

  const indexRaw = readFileSync(INDEX, 'utf8');
  const pattern = /(<meta\s+name=["']app-version["']\s+content=["'])[^"']+(["'])/i;
  if (!pattern.test(indexRaw)) throw new Error('index.html 里没找到 app-version meta');
  const indexNext = indexRaw.replace(pattern, `$1${next}$2`);

  writeFileSync(PKG, pkgNext);
  writeFileSync(INDEX, indexNext);
  console.log(`[release] 版本号 ${current} → ${next}（package.json + index.html）`);
}

function assertPublishTargetReady() {
  const yml = readFileSync(BUILDER_YML, 'utf8');
  const url = (yml.split(/^publish:\s*$/m)[1] || '').match(/^\s+url:\s*(\S+)\s*$/m)?.[1] || '';
  if (!url || /YOUR_BUCKET|YOUR_REGION/.test(url)) {
    throw new Error(
      'electron-builder.yml 的 publish.url 还是占位符，先把 bucket 名与地域换成真实值再发版：\n' +
        '  publish.url 是客户端更新源的唯一真源，会被写进安装包内的 app-update.yml，改错了老版本就永久失联。'
    );
  }
}

function assertAppNotRunning() {
  const res = spawnSync('tasklist', ['/FI', 'IMAGENAME eq Canvas AI.exe', '/NH'], { encoding: 'utf8' });
  if (res.stdout && res.stdout.includes('Canvas AI.exe')) {
    console.warn('[release] 警告：Canvas AI 正在运行，打包可能因文件占用失败（EBUSY）。建议先退出应用。');
  }
}

function run(script, extraArgs = []) {
  const res = spawnSync(process.execPath, [path.join(ROOT, 'tools', script), ...extraArgs], {
    stdio: 'inherit',
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
  });
  if (res.status !== 0) throw new Error(`${script} 退出码 ${res.status}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.version) {
    console.log(`用法：release.mjs <X.Y.Z> [--no-build] [--no-publish] [--dry-run]

  X.Y.Z        新版本号，必须大于当前 package.json 里的版本
  --no-build   只改版本号，不打包
  --no-publish 打包但不传 OSS
  --dry-run    打包后以 dry-run 方式打印将上传的对象`);
    if (!args.version && !args.help) process.exit(1);
    return;
  }
  if (args.publish) assertPublishTargetReady();

  bumpVersions(args.version);

  if (!args.build) return;
  assertAppNotRunning();
  console.log('[release] 开始打包');
  run('pack-dist.cjs');

  if (!args.publish) {
    console.log(`[release] 打包完成：dist/ 下 ${args.version} 的三件套已就绪，未上传`);
    return;
  }
  console.log('[release] 开始上传 OSS');
  run('publish-oss.mjs', args.dryRun ? ['--dry-run'] : []);
  console.log('[release] 完成');
}

try {
  main();
} catch (e) {
  console.error(`[release] 失败：${e && e.message ? e.message : e}`);
  process.exit(1);
}
