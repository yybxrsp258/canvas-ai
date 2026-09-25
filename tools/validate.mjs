#!/usr/bin/env node
/**
 * 校验反混淆产物：
 *   1. 每个还原文件都能作为 ES module 解析（语法有效）
 *   2. 还原前后的导出符号集合一致（语义未丢失）
 *
 * 用法:
 *   node tools/validate.mjs <origDirOrFile>=<deobDirOrFile> [...]
 */
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from '@babel/parser';

const PARSER_OPTS = {
  sourceType: 'module',
  errorRecovery: false,
  plugins: [
    'importAttributes',
    'topLevelAwait',
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    'dynamicImport',
    'exportDefaultFrom',
    'exportNamespaceFrom',
  ],
};

async function walk(target, out = []) {
  const st = await stat(target);
  if (st.isFile()) {
    if (target.endsWith('.js')) out.push(target);
    return out;
  }
  for (const entry of await readdir(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.isFile() && entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

function collectPattern(node, names) {
  if (!node) return;
  switch (node.type) {
    case 'Identifier': names.add(node.name); break;
    case 'ObjectPattern': for (const p of node.properties) collectPattern(p.value ?? p.argument, names); break;
    case 'ArrayPattern': for (const el of node.elements) collectPattern(el, names); break;
    case 'AssignmentPattern': collectPattern(node.left, names); break;
    case 'RestElement': collectPattern(node.argument, names); break;
  }
}

function exportNames(ast) {
  const names = new Set();
  for (const node of ast.program.body) {
    if (node.type === 'ExportNamedDeclaration') {
      const d = node.declaration;
      if (d) {
        if (d.declarations) for (const dec of d.declarations) collectPattern(dec.id, names);
        else if (d.id) names.add(d.id.name);
      }
      for (const spec of node.specifiers || []) {
        names.add(spec.exported?.name ?? spec.exported?.value ?? '?');
      }
    } else if (node.type === 'ExportDefaultDeclaration') {
      names.add('default');
    } else if (node.type === 'ExportAllDeclaration') {
      names.add(`*from:${node.source.value}`);
    }
  }
  return [...names].sort();
}

function tryParse(code) {
  try { return { ast: parse(code, PARSER_OPTS), error: null }; }
  catch (e) { return { ast: null, error: e.message.split('\n')[0] }; }
}

const pairs = process.argv.slice(2).map((a) => {
  const idx = a.lastIndexOf('=');
  return { orig: a.slice(0, idx), deob: a.slice(idx + 1) };
});

if (!pairs.length) {
  console.error('用法: node tools/validate.mjs <origDirOrFile>=<deobDirOrFile> [...]');
  process.exit(1);
}

const report = { generatedAt: new Date().toISOString(), pairs: [] };
let grandTotal = 0, grandParseFail = 0, grandExportMismatch = 0;

for (const { orig, deob } of pairs) {
  const deobIsFile = (await stat(deob)).isFile();
  const files = await walk(deob);
  const entry = { orig, deob, total: files.length, parseFailures: [], exportMismatches: [], missingOriginal: [] };

  console.log(`\n=== ${orig}  ->  ${deob}  (${files.length} 文件) ===`);

  for (const file of files) {
    const rel = deobIsFile ? path.basename(file) : path.relative(deob, file);
    const origFile = deobIsFile ? orig : path.join(orig, rel);

    const deobCode = await readFile(file, 'utf8');
    const d = tryParse(deobCode);
    if (d.error) {
      entry.parseFailures.push({ file: rel, error: d.error });
      console.log(`  解析失败  ${rel}: ${d.error}`);
      continue;
    }

    let origCode;
    try { origCode = await readFile(origFile, 'utf8'); }
    catch { entry.missingOriginal.push(rel); continue; }

    const o = tryParse(origCode);
    if (o.error) continue; // 原文件本身解析失败则跳过比对

    const a = exportNames(o.ast), b = exportNames(d.ast);
    if (a.length !== b.length || a.some((x, i) => x !== b[i])) {
      const lost = a.filter((x) => !b.includes(x));
      const added = b.filter((x) => !a.includes(x));
      entry.exportMismatches.push({ file: rel, lost, added });
      console.log(`  导出不一致  ${rel}  丢失:[${lost}] 新增:[${added}]`);
    }
  }

  const ok = entry.total - entry.parseFailures.length;
  console.log(`  语法有效: ${ok}/${entry.total}　　导出不一致: ${entry.exportMismatches.length}　　缺原文件: ${entry.missingOriginal.length}`);
  grandTotal += entry.total;
  grandParseFail += entry.parseFailures.length;
  grandExportMismatch += entry.exportMismatches.length;
  report.pairs.push(entry);
}

report.summary = { total: grandTotal, parseFailures: grandParseFail, exportMismatches: grandExportMismatch };
await writeFile('.reference/validate-report.json', JSON.stringify(report, null, 2), 'utf8');

console.log(`\n========== 总汇总 ==========`);
console.log(`文件总数: ${grandTotal}`);
console.log(`语法失败: ${grandParseFail}`);
console.log(`导出不一致: ${grandExportMismatch}`);
console.log(`报告: .reference/validate-report.json`);
if (grandParseFail || grandExportMismatch) process.exitCode = 1;
