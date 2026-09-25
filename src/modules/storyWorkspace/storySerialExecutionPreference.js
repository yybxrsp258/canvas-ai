// 剧本工作区「串行执行」偏好：部分模型服务（如 Agnes AI 的低配套餐）不支持并发请求，
// 开启后素材形象批量生图、片段批量生成视频将逐个执行（上一个结束后自动开始下一个）。
const KEY = 'v2-story-serial-execution';
const TOGGLE_SELECTOR = '[data-story-serial-execution-toggle]';
let memoryValue = false;

try {
  if (globalThis['localStorage']) {
    memoryValue = globalThis['localStorage'].getItem(KEY) === 'on';
  }
} catch {}

export function readStorySerialExecution() {
  return memoryValue;
}

export function setStorySerialExecution(enabled) {
  memoryValue = Boolean(enabled);
  try {
    globalThis['localStorage']?.['setItem'](KEY, memoryValue ? 'on' : 'off');
  } catch {}
  syncStorySerialExecutionToggles();
  return memoryValue;
}

function syncStorySerialExecutionToggles() {
  const doc = globalThis['document'];
  if (!doc || typeof doc['querySelectorAll'] !== 'function') {
    return;
  }
  [...doc['querySelectorAll'](TOGGLE_SELECTOR)]['forEach'](node => {
    node['setAttribute']('aria-pressed', String(memoryValue));
    if (node['hasAttribute']('aria-checked')) {
      node['setAttribute']('aria-checked', String(memoryValue));
    }
    node['classList'] && node['classList']['toggle']('is-active', memoryValue);
    const stateNode = typeof node['querySelector'] === 'function'
      ? node['querySelector']('[data-story-serial-execution-state]')
      : null;
    if (stateNode) {
      stateNode['textContent'] = memoryValue ? '已开启' : '已关闭';
    }
  });
}

let delegationBound = false;
function ensureDelegationBound() {
  const doc = globalThis['document'];
  if (delegationBound || !doc || typeof doc['addEventListener'] !== 'function') {
    return;
  }
  delegationBound = true;
  doc['addEventListener']('click', event => {
    const target = event && event['target'];
    const node = typeof target?.['closest'] === 'function' ? target['closest'](TOGGLE_SELECTOR) : null;
    if (!node || node['hasAttribute']('disabled')) {
      return;
    }
    event['preventDefault']?.();
    setStorySerialExecution(!memoryValue);
  });
}
ensureDelegationBound();

// 片段多选操作行里的开关胶囊。
export function renderStorySerialExecutionToggle() {
  ensureDelegationBound();
  const active = memoryValue;
  return '<button type="button" class="story-serial-execution-toggle' + (active ? ' is-active' : '') + '" data-story-serial-execution-toggle aria-pressed="' + active + '" title="模型服务不支持并发时开启：批量任务将逐个执行，上一个完成后自动开始下一个">串行执行<small data-story-serial-execution-state>' + (active ? '已开启' : '已关闭') + '</small></button>';
}

// 素材批量生成下拉菜单里的开关项。
export function renderStorySerialExecutionMenuitem() {
  ensureDelegationBound();
  const active = memoryValue;
  return '<button type="button" role="menuitemcheckbox" aria-checked="' + active + '" class="story-asset-batch-serial-toggle' + (active ? ' is-active' : '') + '" data-story-serial-execution-toggle aria-pressed="' + active + '"><span class="story-asset-batch-mode-icon"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5h14M3 10h9M3 15h5"/></svg></span><span>串行执行<small data-story-serial-execution-state>' + (active ? '已开启' : '已关闭') + '</small></span></button>';
}
