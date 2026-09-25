#!/usr/bin/env node
/**
 * 渲染进程探针：经 CDP 连入 Electron 渲染进程，在页面里求值并打印结果。
 *
 * 用法:
 *   node tools/probe.mjs <表达式文件|表达式字符串> [--port 9222]
 *
 * 应用需带 --remote-debugging-port 启动，例如：
 *   AIC_CANVAS_RUNTIME=electron npx electron . --remote-debugging-port=9222
 */
import { readFile } from 'node:fs/promises';

const args = process.argv.slice(2);
let port = 9222;
const exprParts = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port') { port = Number(args[++i]); continue; }
  exprParts.push(args[i]);
}

// 单个参数且像文件路径时按文件读取，方便写多行表达式
let expression = exprParts.join(' ');
if (exprParts.length === 1 && /\.(mjs|js|txt)$/.test(exprParts[0])) {
  expression = await readFile(exprParts[0], 'utf8');
}

if (!expression) {
  console.error('用法: node tools/probe.mjs <表达式文件|表达式字符串> [--port 9222]');
  process.exit(1);
}

const res = await fetch(`http://127.0.0.1:${port}/json`);
const targets = await res.json();
const page = targets.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
if (!page) {
  console.error('未找到可调试的页面目标。已启动 --remote-debugging-port 吗？');
  console.error('目标列表:', JSON.stringify(targets.map((t) => ({ type: t.type, url: t.url })), null, 2));
  process.exit(1);
}

const ws = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
let nextId = 1;

function send(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  const entry = pending.get(msg.id);
  if (!entry) return;
  pending.delete(msg.id);
  if (msg.error) entry.reject(new Error(JSON.stringify(msg.error)));
  else entry.resolve(msg.result);
});

await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true });
  ws.addEventListener('error', (e) => reject(new Error('WebSocket 连接失败: ' + (e.message || 'unknown'))), { once: true });
});

const result = await send('Runtime.evaluate', {
  expression,
  awaitPromise: true,
  returnByValue: true,
});

if (result.exceptionDetails) {
  console.error('页面内求值抛错:');
  console.error(result.exceptionDetails.exception?.description || JSON.stringify(result.exceptionDetails));
  process.exitCode = 1;
} else {
  const value = result.result?.value;
  console.log(typeof value === 'string' ? value : JSON.stringify(value, null, 2));
}

ws.close();
