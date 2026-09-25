#!/usr/bin/env node
/**
 * 批量反混淆：用 webcrack 还原 javascript-obfuscator 处理过的文件。
 *
 * 用法:
 *   node tools/deobfuscate.mjs <srcDir> <outDir> [--limit N] [--filter SUBSTR] [--report FILE]
 *
 * 逐文件独立处理（每个文件的字符串数组是自包含的），失败不影响其他文件。
 */
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { webcrack } from 'webcrack';

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { flags[key] = next; i++; }
      else flags[key] = true;
    } else positional.push(a);
  }
  return { positional, flags };
}

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.isFile() && entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

const { positional, flags } = parseArgs(process.argv.slice(2));
const [srcDir, outDir] = positional;

if (!srcDir || !outDir) {
  console.error('用法: node tools/deobfuscate.mjs <srcDir> <outDir> [--limit N] [--filter SUBSTR] [--report FILE]');
  process.exit(1);
}

const limit = flags.limit ? Number(flags.limit) : Infinity;
const filter = flags.filter ? String(flags.filter) : null;

const norm = (p) => p.split(path.sep).join('/');
const srcIsFile = (await stat(srcDir)).isFile();
let files = srcIsFile ? [srcDir] : await walk(srcDir);
if (filter) files = files.filter((f) => norm(f).includes(filter));
files.sort((a, b) => a.localeCompare(b));

// --sample N: 沿排序后的列表等距抽样，覆盖各区域而非只取开头
if (flags.sample) {
  const n = Number(flags.sample);
  if (n > 0 && files.length > n) {
    const step = files.length / n;
    files = Array.from({ length: n }, (_, i) => files[Math.floor(i * step)]);
  }
}
if (Number.isFinite(limit)) files = files.slice(0, limit);

console.log(`源目录: ${srcDir}`);
console.log(`输出目录: ${outDir}`);
console.log(`待处理: ${files.length} 个文件${filter ? ` (过滤: ${filter})` : ''}\n`);

const report = { srcDir, outDir, startedAt: new Date().toISOString(), total: files.length, ok: [], failed: [], unchanged: [] };

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const rel = srcIsFile ? path.basename(file) : path.relative(srcDir, file);
  const dest = path.join(outDir, rel);
  const tag = `[${i + 1}/${files.length}]`;
  try {
    const code = await readFile(file, 'utf8');
    // unpack: false —— 这些文件是原生 ESM 模块，不是打包产物，无需拆包
    // unminify: false —— 实测该 stage 会把函数体里的
    //   `if (x === undefined) x = EXPR;` 合并进参数默认值 `x = EXPR`，
    //   对 async 函数会生成非法的 `x = await ...`（语法错误），
    //   且会改变默认值的求值时机。关掉后字符串数组还原能力不受影响
    //   （解码器、轮转器、查表调用均照常清除），结构反而更贴近原版。
    const result = await webcrack(code, { unpack: false, unminify: false });
    const outCode = result.code;

    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, outCode, 'utf8');

    const shrank = code.length - outCode.length;
    if (outCode === code) report.unchanged.push(rel);
    else report.ok.push({ file: rel, before: code.length, after: outCode.length, saved: shrank });
    console.log(`${tag} OK   ${rel}  ${code.length} -> ${outCode.length} (-${shrank})`);
  } catch (err) {
    report.failed.push({ file: rel, error: String(err && err.message ? err.message : err) });
    console.error(`${tag} FAIL ${rel}  ${err && err.message ? err.message : err}`);
  }
}

// 未变化的文件仍然写入，保证输出树完整
report.finishedAt = new Date().toISOString();
const reportPath = flags.report || path.join(outDir, '_deobfuscate-report.json');
await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');

const totalSaved = report.ok.reduce((s, r) => s + r.saved, 0);
console.log(`\n=== 汇总 ===`);
console.log(`成功: ${report.ok.length}   失败: ${report.failed.length}   未变化: ${report.unchanged.length}`);
console.log(`体积减少: ${totalSaved} 字节`);
console.log(`报告: ${reportPath}`);
if (report.failed.length) {
  console.log(`\n失败文件:`);
  for (const f of report.failed) console.log(`  ${f.file}: ${f.error}`);
  process.exitCode = 1;
}
