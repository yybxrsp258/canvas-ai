#!/usr/bin/env node
/**
 * UI 驱动：经 CDP 在渲染进程里执行一串步骤，用于自动化验证画布交互。
 *
 * 与 probe.mjs 的区别：本工具**不用**合成 DOM 事件，而是走 CDP 的 Input 域
 * （真实输入/按键），这样才能触发依赖真实键鼠事件的业务逻辑。
 *
 * 用法:
 *   node tools/ui-drive.mjs <steps.json> [--port 9222]
 *
 * steps.json 为数组，每步是下列之一：
 *   { "focus": "<css>" }        聚焦元素
 *   { "type":  "文本" }          向当前焦点输入文本（Input.insertText）
 *   { "key":   "Enter" }         发送按键
 *   { "click": "<css>" }         点击元素（真实鼠标事件）
 *   { "wait":  1500 }            等待毫秒
 *   { "eval":  "<表达式>" }       求值并把结果收集到输出
 *   { "label": "说明" }          给下一步的 eval 结果加标签
 *   { "shot":  "<文件路径>" }     截图
 */
import { readFile, writeFile } from 'node:fs/promises';

const args = process.argv.slice(2);
let port = 9222;
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port') { port = Number(args[++i]); continue; }
  positional.push(args[i]);
}

if (!positional[0]) {
  console.error('用法: node tools/ui-drive.mjs <steps.json> [--port 9222]');
  process.exit(1);
}
const steps = JSON.parse(await readFile(positional[0], 'utf8'));

const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const page = targets.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
if (!page) {
  console.error('未找到可调试页面目标:', JSON.stringify(targets.map((t) => t.type)));
  process.exit(1);
}

const ws = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
let nextId = 1;
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = nextId++;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params }));
});
ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  const entry = pending.get(msg.id);
  if (!entry) return;
  pending.delete(msg.id);
  msg.error ? entry.reject(new Error(JSON.stringify(msg.error))) : entry.resolve(msg.result);
});
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true });
  ws.addEventListener('error', () => reject(new Error('WebSocket 连接失败')), { once: true });
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
let label = null;

// 求值辅助：把 CSS 选择器转成安全的 JS 字符串字面量
const q = (sel) => JSON.stringify(String(sel));

async function clickAt(selector) {
  // 同一选择器常有多个匹配（含隐藏的模板节点），必须挑可见且尺寸非零的那个，
  // 否则会点到 0×0 的隐藏元素上。
  const box = await send('Runtime.evaluate', {
    expression: `(() => {
      const list = Array.from(document.querySelectorAll(${q(selector)}))
        .filter(e => e.offsetParent !== null);
      for (const e of list) {
        const r = e.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }
      }
      return null; })()`,
    returnByValue: true,
  });
  const point = box.result?.value;
  if (!point) throw new Error(`没有可见可点击的元素: ${selector}`);
  for (const type of ['mousePressed', 'mouseReleased']) {
    await send('Input.dispatchMouseEvent', {
      type, x: point.x, y: point.y, button: 'left', clickCount: 1,
    });
  }
}

for (const step of steps) {
  try {
    // label 可与动作同处一步：先记标签，再继续执行该步的动作
    if (step.label !== undefined) label = step.label;

    const actions = ['wait', 'focus', 'type', 'key', 'click', 'clickXY', 'clickText', 'clickAncestor', 'eval', 'shot'];
    if (!actions.some((k) => step[k] !== undefined)) {
      if (step.label === undefined) console.error('未知步骤:', JSON.stringify(step));
      continue;
    }

    if (step.focus !== undefined) {
      await send('Runtime.evaluate', {
        expression: `document.querySelector(${q(step.focus)})?.focus()`,
      });
    }

    if (step.type !== undefined) {
      await send('Input.insertText', { text: String(step.type) });
    }

    if (step.key !== undefined) {
      const map = { Enter: { code: 'Enter', keyCode: 13, text: '\r' }, Escape: { code: 'Escape', keyCode: 27 } };
      const k = map[step.key] || { code: step.key, keyCode: 0 };
      for (const type of ['keyDown', 'keyUp']) {
        await send('Input.dispatchKeyEvent', {
          type, code: k.code, key: k.code, windowsVirtualKeyCode: k.keyCode,
          text: type === 'keyDown' ? k.text : undefined,
        });
      }
    }

    if (step.click !== undefined) {
      await clickAt(step.click);
    }

    // 按可见文本点击：取最内层匹配元素（层级浅的容器会让点击落空）
    if (step.clickText !== undefined) {
      const want = JSON.stringify(String(step.clickText));
      const found = await send('Runtime.evaluate', {
        expression: `(() => { const want = ${want};
          const els = Array.from(document.querySelectorAll('*')).filter(e => e.offsetParent !== null && (e.textContent || '').trim() === want);
          if (!els.length) return null;
          els.sort((a, b) => a.querySelectorAll('*').length - b.querySelectorAll('*').length);
          const r = els[0].getBoundingClientRect();
          if (r.width === 0 && r.height === 0) return null;
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`,
        returnByValue: true,
      });
      const point = found.result?.value;
      if (!point) throw new Error(`未找到可见文本: ${step.clickText}`);
      for (const type of ['mousePressed', 'mouseReleased']) {
        await send('Input.dispatchMouseEvent', {
          type, x: point.x, y: point.y, button: 'left', clickCount: 1,
        });
      }
    }

    // 按文本定位后点击其指定的祖先元素。
    // 浮层菜单里标题往往是内层 div，真正带点击处理的是外层 .floating-menu-item。
    if (step.clickAncestor !== undefined) {
      const text = JSON.stringify(String(step.clickAncestor.text));
      const within = JSON.stringify(String(step.clickAncestor.within || '*'));
      const found = await send('Runtime.evaluate', {
        expression: `(() => {
          const want = ${text};
          const els = Array.from(document.querySelectorAll('*')).filter(e =>
            e.offsetParent !== null && (e.textContent || '').trim() === want);
          if (!els.length) return null;
          els.sort((a, b) => a.querySelectorAll('*').length - b.querySelectorAll('*').length);
          const target = els[0].closest(${within});
          if (!target) return null;
          const r = target.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) return null;
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`,
        returnByValue: true,
      });
      const point = found.result?.value;
      if (!point) throw new Error(`未找到可点击祖先: ${step.clickAncestor.text} in ${step.clickAncestor.within}`);
      for (const type of ['mousePressed', 'mouseReleased']) {
        await send('Input.dispatchMouseEvent', {
          type, x: point.x, y: point.y, button: 'left', clickCount: 1,
        });
      }
    }

    // 按坐标点击：用于点击空白处关闭浮层菜单
    if (step.clickXY !== undefined) {
      const [x, y] = step.clickXY;
      for (const type of ['mousePressed', 'mouseReleased']) {
        await send('Input.dispatchMouseEvent', {
          type, x: Number(x), y: Number(y), button: 'left', clickCount: 1,
        });
      }
    }

    if (step.wait !== undefined) {
      await sleep(Number(step.wait) || 0);
    }

    if (step.eval !== undefined) {
      const r = await send('Runtime.evaluate', {
        expression: String(step.eval), awaitPromise: true, returnByValue: true,
      });
      const value = r.exceptionDetails
        ? `ERR: ${r.exceptionDetails.exception?.description || 'eval failed'}`
        : r.result?.value;
      results.push({ label: label ?? null, value });
      label = null;
    }

    if (step.shot !== undefined) {
      const r = await send('Page.captureScreenshot', { format: 'png' });
      await writeFile(step.shot, Buffer.from(r.data, 'base64'));
      results.push({ label: label ?? null, value: `screenshot -> ${step.shot}` });
      label = null;
    }
  } catch (err) {
    results.push({ label: label ?? null, error: String(err.message || err) });
    label = null;
  }
}

console.log(JSON.stringify(results, null, 2));
ws.close();
