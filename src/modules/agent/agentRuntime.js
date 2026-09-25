import { canvasCommandRegistry } from '../canvasCommands/index.js';
import { buildAgentContext } from './agentContextBuilder.js';
import { buildSelectedAgentSkillUsage } from './agentSkillUsage.js';
import { createAgentConversationCapabilityRuntime } from './agentConversationCapabilityRuntime.js';
import { validateAgentPlan } from './agentPlanValidator.js';
import { executeAgentActions } from './agentActionExecutor.js';
import { createAgentSessionStore } from './agentSessionStore.js';
import { createAgentTaskBindingRuntime } from './agentTaskBindingRuntime.js';
import { createAgentPlanLifecycle } from './agentPlanLifecycle.js';
import { getLocale } from '../../i18n/index.js';
import { buildAgentToolResult, deriveAgentCapabilityDiscovery, deriveAgentRuntimeProvenance, fingerprintAgentAction } from './agentToolResult.js';
import { registerAgentDiscoveryCommands } from './agentDiscoveryCommands.js';
import { createAgentLoopActionBudget, isAgentLoopRecoveryEditMessage, isAgentLoopRetryMessage, recordAgentLoopActionBudgetResult, shouldRetryAgentLoopNoop, validateAgentLoopActionBudget } from './agentLoopRecovery.js';
import { shouldUseCreativeDefaults } from './agentClarificationPolicy.js';
import { verifyAgentLoopCompletionEvidence } from './agentCompletionEvidence.js';
import { selectAgentLoopPlanAction } from './agentLoopPlanSelection.js';
import { createAgentPrecreatedNodeRuntime, doesActionConsumePrecreatedNode, normalizeAgentPrecreatedNode } from './agentPrecreatedNode.js';
import { buildAgentExecutionDiagnostic, buildAgentPlannerDiagnostic, buildAgentPlannerRecovery } from './agentFailureDiagnostic.js';
import { hasAgentCanvasActionIntent, routeAgentTurn } from './agentTurnRouter.js';
import { createAgentConversationCanvasTransferRuntime } from './agentConversationCanvasTransferRuntime.js';
import { createAgentAssistantConversationRuntime } from './agentAssistantConversationRuntime.js';
import { getAgentContinuationSkillIds } from './agentAssistantConversation.js';
const DEFAULT_MAX_LOOP_STEPS = 0x10;
const PLANNER_NETWORK_RETRY_LIMIT = 0x1;
function isTransientPlannerNetworkError(_0x431331) {
  const _0x58f5e2 = [_0x431331?.["name"], _0x431331?.['code'], _0x431331?.["message"]]["map"](_0x240340 => String(_0x240340 || '')['trim']())["filter"](Boolean)["join"]('\x20')["toLowerCase"]();
  return /failed to fetch|fetch failed|network(?: request)? (?:error|failed|failure)|networkerror/['test'](_0x58f5e2) || /econnreset|econnrefused|enotfound|enetunreach|socket hang up/["test"](_0x58f5e2) || /网络(?:连接|请求)?失败|网络错误|无法连接/['test'](_0x58f5e2);
}
const RUNTIME_TEXT = Object["freeze"]({
  'zh-CN': Object['freeze']({
    'actionExecutionFailed': 'Agent\x20动作执行失败。',
    'done': '已执行。',
    'emptyMessage': "Agent 消息为空。",
    'noPendingClarification': "当前没有待回答的问题。",
    'noPendingPlan': "当前没有待确认的计划。",
    'noPendingRecovery': '当前没有可恢复的失败计划。',
    'noInterruptedRun': '当前没有需要结束的\x20Agent\x20任务。',
    'noUndoableRun': "当前没有可撤销的 Agent 画布操作，或画布在任务后已经发生变化。",
    'runResumed': "正在从上次中断的位置继续。",
    'runDiscarded': "已结束上次 Agent 任务。已完成的画布操作不会撤销，已经提交的生成仍会继续。",
    'runUndone': '已撤销\x20Agent\x20本轮对画布的修改。',
    'recoveryKept': "已保留准备步骤。你可以修改提示词或换模型后重新规划。",
    'planCancelled': "已取消执行。",
    'plannerFailed': "Agent 规划失败。",
    'plannerRetryAvailable': 'Agent\x20规划失败，但原任务已保留。回复“重试”或“？”即可继续。',
    'plannerReturnedNoAction': "Agent 没有返回可执行的画布动作，原任务已保留。回复“重试”继续。",
    'plannerMissing': "Agent 文本模型尚未配置。",
    'preActionsFailed': 'Agent\x20准备步骤执行失败。',
    'reset': 'Agent\x20会话已重置。',
    'runStopped': "Agent 已停止。",
    'loopLimitReached': "Agent 已达到本轮最大步骤数，已停止以避免重复执行。",
    'loopRepeatedAction': "Agent 尝试重复执行已完成的动作，已停止。",
    'loopRepeatedActionCorrection': "这个动作已经成功完成。不要再次执行；请根据工具结果继续下一个尚未完成的动作，或在任务完成时返回空 actions。",
    'loopDuplicateBudgetCorrection': "用户要求的副本数量已经满足，或这个复制动作会超过数量。不要再复制节点；请继续生成、拼贴等剩余步骤，完成后返回空 actions。",
    'loopCompletionEvidenceCorrection': "尚未验证到本轮创建的目标节点。必须先成功执行节点创建，再声称已经创建；不要把查询、选择或计划当作完成。",
    'loopResumeExpired': "待继续的 Agent 运行已失效，请重新发起。",
    'creativeDefaultsInstruction': '请自行采用合理的专业默认值完成创作；风格、构图、配色和提示词由你决定，不要再次追问这些可推断细节。',
    'confirmFallback': "请确认后继续执行。",
    'cancelNotice': "取消只会取消待确认的生成，不会撤回已完成的创建、连接或排列。",
    'retry': '重试',
    'editPrompt': '修改提示词',
    'changeModel': "换模型",
    'keepPrepared': "只保留已创建节点",
    'nodeCreate': "创建节点",
    'nodeCreateImage': "创建图片节点",
    'nodeCreateVideo': "创建视频节点",
    'nodeCreateAudio': "创建音频节点",
    'nodeCreateText': "创建文本节点",
    'graphConnect': "连接节点",
    'layoutAlign': "对齐节点",
    'layoutArrangeRow': "横向排列节点",
    'layoutArrangeColumn': "纵向排列节点",
    'layoutArrangeGrid': "网格排列节点",
    'generationRun': '开始生成',
    'generationRunBatch': "批量开始生成",
    'nodeSetParams': '设置生成参数',
    'nodeSetPrompt': "写入提示词",
    'nodeDelete': "删除节点",
    'selectedImageInput': "当前选中的图片节点",
    'inputNode': "输入节点",
    'traceSummary': "策略摘要",
    'noInputSource': "无输入节点",
    'defaultModel': "节点默认模型",
    'chatFallback': '可以，我们先聊。需要我创建、生成或修改画布时，请明确说出要执行的操作。',
    'chatIntentRequired': "我先不动当前画布。可以继续讨论；如果需要我创建、生成、连接、排列或修改节点，请明确告诉我要执行的操作。",
    'taskStarted': "生成已开始：{nodeLabel} 正在生成，完成后我会继续更新这里。",
    'taskPending': "生成已提交：{nodeLabel} 正在排队或生成中。",
    'taskWaiting': '生成任务正在执行，全部完成后\x20Agent\x20会自动继续后续步骤。',
    'taskResumed': "生成任务已结束，Agent 正在继续后续步骤。",
    'taskCompleted': "生成已完成：结果已写入 {nodeLabel}。",
    'taskFailed': "生成失败：{nodeLabel}。{error}",
    'taskCancelled': "生成已取消：{nodeLabel}。",
    'textPlacedOnCanvas': "已将文案放入画布文本节点。",
    'textSourceMissing': "没有找到可放入画布的上一条文案，请先让我生成或修改文案。",
    'promptTransferTargetRequired': "请先只选择一个要写入提示词的节点，然后重试。",
    'promptTransferConfirmation': "将把这版文案写入选中节点的提示词，请确认后继续。",
    'promptTransferCompleted': "已将文案写入选中节点的提示词。"
  }),
  'en-US': Object["freeze"]({
    'actionExecutionFailed': "Agent action execution failed.",
    'done': 'Done.',
    'emptyMessage': "Agent message is empty.",
    'noPendingClarification': 'No\x20pending\x20clarification.',
    'noPendingPlan': 'No\x20pending\x20plan\x20to\x20confirm.',
    'noPendingRecovery': 'No\x20failed\x20plan\x20can\x20be\x20recovered.',
    'noInterruptedRun': "There is no Agent run to end.",
    'noUndoableRun': "There is no undoable Agent canvas run, or the canvas changed after it.",
    'runResumed': "Resuming from the interrupted Agent checkpoint.",
    'runDiscarded': "Ended the previous Agent run. Completed canvas changes stay in place, and submitted generations keep running.",
    'runUndone': "Undid the Agent's canvas changes from this run.",
    'recoveryKept': "Prepared steps are kept. You can edit the prompt or switch model before replanning.",
    'planCancelled': "Plan cancelled.",
    'plannerFailed': "Agent planner failed.",
    'plannerRetryAvailable': "Agent planning failed, but the original task was preserved. Reply “retry” or “?” to continue.",
    'plannerReturnedNoAction': "The Agent returned no executable canvas action. The original task was preserved; reply “retry” to continue.",
    'plannerMissing': "Agent planner is not configured.",
    'preActionsFailed': "Agent pre-confirmation actions failed.",
    'reset': "Agent session reset.",
    'runStopped': 'Agent\x20run\x20stopped.',
    'loopLimitReached': 'The\x20Agent\x20reached\x20the\x20step\x20limit\x20and\x20stopped\x20to\x20avoid\x20repeated\x20actions.',
    'loopRepeatedAction': 'The\x20Agent\x20tried\x20to\x20repeat\x20a\x20completed\x20action\x20and\x20was\x20stopped.',
    'loopRepeatedActionCorrection': "This action already succeeded. Do not execute it again; use the tool result to continue with the next unfinished action, or return empty actions when done.",
    'loopDuplicateBudgetCorrection': "The requested copy count is already satisfied, or this action would exceed it. Do not duplicate more nodes; continue with generation, collage, or other unfinished work, then return empty actions.",
    'loopCompletionEvidenceCorrection': "The requested node has not been verified as created in this run. Complete node creation before claiming success; do not treat discovery, selection, or planning as completion.",
    'loopResumeExpired': "The pending Agent run is no longer valid. Please start it again.",
    'creativeDefaultsInstruction': "Use reasonable professional defaults and make the creative choices yourself, including style, composition, color, and prompt. Do not ask again for inferable details.",
    'confirmFallback': "Please confirm this action plan.",
    'cancelNotice': "Cancel only cancels the pending generation. It will not undo created nodes, connections, or layout changes.",
    'retry': "Retry",
    'editPrompt': "Edit prompt",
    'changeModel': "Switch model",
    'keepPrepared': "Keep prepared nodes",
    'nodeCreate': "Create node",
    'nodeCreateImage': 'Create\x20image\x20node',
    'nodeCreateVideo': "Create video node",
    'nodeCreateAudio': "Create audio node",
    'nodeCreateText': "Create text node",
    'graphConnect': 'Connect\x20nodes',
    'layoutAlign': 'Align\x20nodes',
    'layoutArrangeRow': "Arrange nodes horizontally",
    'layoutArrangeColumn': "Arrange nodes vertically",
    'layoutArrangeGrid': "Arrange nodes in a grid",
    'generationRun': "Start generation",
    'generationRunBatch': "Start batch generation",
    'nodeSetParams': "Set generation parameters",
    'nodeSetPrompt': "Set prompt",
    'nodeDelete': "Delete node",
    'selectedImageInput': "Selected image node",
    'inputNode': "Input node",
    'traceSummary': "Policy summary",
    'noInputSource': "No input node",
    'defaultModel': "Node default model",
    'chatFallback': "Sure, we can talk first. Tell me explicitly when you want me to create, generate, or modify the canvas.",
    'chatIntentRequired': "I will leave the canvas unchanged for now. We can keep discussing; tell me explicitly if you want me to create, generate, connect, arrange, or edit nodes.",
    'taskStarted': "Generation started: {nodeLabel} is running. I will update this chat when it finishes.",
    'taskPending': "Generation submitted: {nodeLabel} is queued or running.",
    'taskWaiting': 'Generation\x20is\x20running.\x20The\x20Agent\x20will\x20continue\x20automatically\x20when\x20all\x20tasks\x20finish.',
    'taskResumed': "Generation finished. The Agent is continuing with the remaining steps.",
    'taskCompleted': "Generation complete: the result was written to {nodeLabel}.",
    'taskFailed': "Generation failed: {nodeLabel}. {error}",
    'taskCancelled': 'Generation\x20cancelled:\x20{nodeLabel}.',
    'textPlacedOnCanvas': "Placed the copy in a canvas text node.",
    'textSourceMissing': "I could not find a previous assistant draft to place on the canvas.",
    'promptTransferTargetRequired': "Select exactly one node whose prompt should receive the copy, then try again.",
    'promptTransferConfirmation': "The selected node prompt will be replaced with this copy. Confirm to continue.",
    'promptTransferCompleted': "Placed the copy in the selected node prompt."
  })
});
function normalizeRuntimeLocale(_0x1a42c5 = getLocale()) {
  return String(_0x1a42c5 || '')["toLowerCase"]()["startsWith"]('en') ? "en-US" : "zh-CN";
}
function runtimeText(_0x1b1c8d, _0x20b055 = getLocale()) {
  const _0x252cb5 = normalizeRuntimeLocale(_0x20b055);
  return RUNTIME_TEXT[_0x252cb5]?.[_0x1b1c8d] || RUNTIME_TEXT["zh-CN"][_0x1b1c8d] || _0x1b1c8d;
}
function formatRuntimeText(_0x863016, _0x396c6f = {}, _0x482c77 = getLocale()) {
  return runtimeText(_0x863016, _0x482c77)["replace"](/\{(\w+)\}/g, (_0x46e2fa, _0x12a218) => _0x396c6f[_0x12a218] == null ? '' : String(_0x396c6f[_0x12a218]));
}
function createFailedReply(_0x3d692f, _0x330f4f = {}) {
  return {
    'ok': ![],
    'status': 'failed',
    'reply': _0x3d692f,
    'message': _0x3d692f,
    ..._0x330f4f
  };
}
function summarizeExecution(_0x25dee8, _0x2f0d9c = getLocale()) {
  if (_0x25dee8['ok']) {
    return runtimeText("done", _0x2f0d9c);
  }
  return _0x25dee8["message"] || runtimeText('actionExecutionFailed', _0x2f0d9c);
}
function isSafeAction(_0x1d3581 = {}) {
  return String(_0x1d3581['riskLevel'] || "safe") === "safe";
}
function createChatReply(_0x3d3dc2, _0x19c051 = {}) {
  const _0xb8a5a6 = String(_0x3d3dc2 || '');
  return {
    'ok': !![],
    'status': "chat",
    'reply': _0xb8a5a6,
    'message': _0xb8a5a6,
    ..._0x19c051
  };
}
function hasExplicitCanvasActionIntent(_0x1240de = '', _0x5e0a08 = {}) {
  return hasAgentCanvasActionIntent(_0x1240de, _0x5e0a08);
}
function shouldHoldCanvasActionsForChat(_0x23c609 = {}, _0x24e3ce = '', _0x14b149 = {}) {
  if (_0x23c609["status"] !== "ready" && _0x23c609['status'] !== "need_confirmation") {
    return ![];
  }
  if (!Array["isArray"](_0x23c609["plan"]?.["actions"]) || _0x23c609['plan']["actions"]["length"] === 0x0) {
    return ![];
  }
  return !hasExplicitCanvasActionIntent(_0x24e3ce, _0x14b149);
}
function getState({
  store: _0x5097d9,
  commandContext: _0x18d673
} = {}) {
  return _0x5097d9?.["getStateRaw"]?.() || _0x5097d9?.['getState']?.() || _0x18d673?.["store"]?.["getStateRaw"]?.() || _0x18d673?.["store"]?.["getState"]?.() || {};
}
function getProjectId(_0x333cd5 = {}) {
  return String(_0x333cd5["commandContext"]?.["windowObject"]?.['currentProjectId'] || globalThis["window"]?.["currentProjectId"] || 'default_v2_project');
}
function getCollectionSize(_0x5eb561) {
  if (Array['isArray'](_0x5eb561)) {
    return _0x5eb561["length"];
  }
  if (_0x5eb561 && typeof _0x5eb561 === "object") {
    return Object["keys"](_0x5eb561)['length'];
  }
  return 0x0;
}
function buildCanvasSnapshotDigest(_0x16e80a = {}) {
  const _0x10c8af = getState(_0x16e80a);
  return {
    'projectId': getProjectId(_0x16e80a),
    'nodeCount': getCollectionSize(_0x10c8af["nodes"]),
    'edgeCount': getCollectionSize(_0x10c8af['edges']),
    'selectedNodeIds': Array['isArray'](_0x10c8af["selectedNodeIds"]) ? _0x10c8af["selectedNodeIds"]["map"](_0x41cd15 => String(_0x41cd15 || ''))["filter"](Boolean) : []
  };
}
function getPlainObject(_0x17b35b) {
  return _0x17b35b && typeof _0x17b35b === 'object' && !Array["isArray"](_0x17b35b) ? _0x17b35b : {};
}
export function createAgentRuntime({
  store: _0x170bcf,
  commandContext: _0x1944be,
  commandRegistry = canvasCommandRegistry,
  sessionStore = createAgentSessionStore(),
  planner = null,
  buildContext = buildAgentContext,
  validatePlan = validateAgentPlan,
  executeActions = executeAgentActions,
  localeProvider = getLocale,
  assistant = null,
  projectMemoryStore = null,
  externalToolRegistry = null,
  skillRegistry = null,
  skillAuthor = null,
  saveSkill = null,
  deleteSkill = null,
  setSkillEnabled = null,
  loopMode = ![],
  maxLoopSteps = DEFAULT_MAX_LOOP_STEPS
} = {}) {
  registerAgentDiscoveryCommands(commandRegistry);
  let _0x323351 = 0x0;
  let _0x12daf8 = null;
  let _0x2fb448 = null;
  let _0x2c088e = null;
  let _0x465139 = null;
  let _0x4a2895 = null;
  let _0x4b3811 = 0x0;
  const _0xca29f1 = new Map();
  const _0x532e42 = new Map();
  let _0x545a0b = null;
  function _0x2e11aa() {
    return normalizeRuntimeLocale(localeProvider?.() || getLocale());
  }
  const _0x359a49 = createAgentPlanLifecycle({
    'readCanvasState': () => getState({
      'store': _0x170bcf,
      'commandContext': _0x1944be
    }),
    'localeProvider': _0x2e11aa,
    'formatText': _0x36c41c => runtimeText(_0x36c41c, _0x2e11aa()),
    'isSafeAction': isSafeAction
  });
  const _0x43bcd6 = createAgentPrecreatedNodeRuntime({
    'plannerAvailable': () => typeof planner === 'function',
    'hasCanvasActionIntent': hasExplicitCanvasActionIntent,
    'readCanvasState': () => getState({
      'store': _0x170bcf,
      'commandContext': _0x1944be
    }),
    'executeActions': _0x338d79,
    'buildExecutionOptions': _0x2744f7,
    'isActiveRun': _0x33c208,
    'sessionStore': sessionStore,
    'markUnfinishedOperation': _0x5a1dd9,
    'commandContext': _0x1944be
  });
  const _0x1fd2b2 = createAgentConversationCapabilityRuntime({
    'sessionStore': sessionStore,
    'skillRegistry': skillRegistry,
    'author': skillAuthor,
    'saveSkill': saveSkill,
    'deleteSkill': deleteSkill,
    'setSkillEnabled': setSkillEnabled,
    'projectMemoryStore': projectMemoryStore,
    'externalToolRegistry': externalToolRegistry,
    'localeProvider': _0x2e11aa,
    'isActiveRun': _0x33c208
  });
  const _0x1c950f = createAgentConversationCanvasTransferRuntime({
    'sessionStore': sessionStore,
    'readCanvasState': () => getState({
      'store': _0x170bcf,
      'commandContext': _0x1944be
    }),
    'executeActions': _0x338d79,
    'handlePlan': _0x147d86,
    'buildExecutionGuard': _0x2744f7,
    'isActiveRun': _0x33c208,
    'createStoppedReply': _0x1887fc,
    'commandContext': _0x1944be,
    'text': _0x1e495c => runtimeText(_0x1e495c, _0x2e11aa())
  });
  const _0x33901e = createAgentAssistantConversationRuntime({
    'sessionStore': sessionStore,
    'replyFromMessage': _0x25f8f6,
    'isActiveRun': _0x33c208,
    'createFailedReply': createFailedReply,
    'handleUserMessage': _0x45f29f,
    'prepareExternalInformation': _0x1fd2b2["prepareExternalInformation"],
    'createStoppedReply': _0x1887fc,
    'getSignal': () => _0x4a2895?.['signal'],
    'startRun': () => {
      _0x21fc2b();
      const _0x373221 = "agent-run-" + ++_0x323351;
      sessionStore["setCurrentRun"]?.({
        'id': _0x373221,
        'status': "planning",
        'stopped': ![]
      });
      return _0x373221;
    },
    'text': _0x5d7228 => runtimeText(_0x5d7228, _0x2e11aa())
  });
  function _0x5588b1() {
    return String(sessionStore["getActiveConversation"]?.()?.['id'] || '')["trim"]();
  }
  function _0x16e0e1(_0x471aad = '') {
    return String(sessionStore["getCurrentRun"]?.()?.['id'] || _0x471aad || "agent-turn-" + _0x323351)["trim"]();
  }
  function _0x304775(_0x54be4e, _0x5c3367, {
    channel = ''
  } = {}) {
    const _0x477453 = buildSelectedAgentSkillUsage({
      'context': _0x54be4e,
      'userMessage': _0x5c3367,
      'channel': channel
    });
    if (!_0x477453) {
      return null;
    }
    const _0x3aa470 = _0x16e0e1();
    const _0x74a59e = JSON["stringify"]([_0x477453["channel"], _0x477453['skillSnapshots']["map"](_0xf927fb => [_0xf927fb['id'], _0xf927fb['match']])]);
    if (_0x532e42['get'](_0x3aa470) === _0x74a59e) {
      return _0x477453;
    }
    _0x532e42["set"](_0x3aa470, _0x74a59e);
    _0x532e42['size'] > 0x64 && _0x532e42["delete"](_0x532e42["keys"]()["next"]()['value']);
    sessionStore["recordRunEvent"]?.({
      'runId': _0x3aa470,
      ..._0x477453,
      'status': "selected"
    });
    return _0x477453;
  }
  function _0xd50bc8(_0x4b16e4 = "agent-turn") {
    const _0x1ffa86 = String(sessionStore["getCurrentRun"]?.()?.['id'] || '')["trim"]();
    return _0x1ffa86 || _0x4b16e4 + '-' + ++_0x323351;
  }
  function _0x33c208(_0x330133 = '') {
    const _0x2722dd = String(_0x330133 || '')['trim']();
    if (!_0x2722dd) {
      return !![];
    }
    const _0x368430 = sessionStore["getCurrentRun"]?.();
    return _0x368430?.['id'] === _0x2722dd && _0x368430['stopped'] !== !![];
  }
  function _0x1887fc() {
    return createFailedReply(runtimeText("runStopped", _0x2e11aa()), {
      'status': "stopped"
    });
  }
  function _0x2744f7(_0x26f921 = '') {
    const _0x18457a = String(_0x26f921 || '')["trim"]();
    if (!_0x18457a) {
      return {};
    }
    return {
      'agentRunId': _0x18457a,
      'shouldContinue': () => _0x33c208(_0x18457a),
      'createNodeSequenceKey': 'agent-command-plan-' + _0x18457a
    };
  }
  function _0x2aca7f(_0x476bf9 = '') {
    const _0x50b9c0 = String(_0x476bf9 || '')["trim"]();
    if (!_0x50b9c0 || _0xca29f1['has'](_0x50b9c0)) {
      return _0xca29f1["get"](_0x50b9c0) || null;
    }
    const _0x557d48 = _0x1944be?.['history']?.["createCheckpoint"]?.() || null;
    const _0x59bcc8 = {
      'runId': _0x50b9c0,
      'conversationId': _0x5588b1(),
      'projectId': getProjectId({
        'commandContext': _0x1944be
      }),
      'start': _0x557d48,
      'end': _0x557d48
    };
    _0xca29f1["set"](_0x50b9c0, _0x59bcc8);
    return _0x59bcc8;
  }
  function _0x1ccebd(_0x472712 = '') {
    const _0xf928e3 = _0x2aca7f(_0x472712);
    if (!_0xf928e3) {
      return null;
    }
    _0xf928e3["end"] = _0x1944be?.["history"]?.["createCheckpoint"]?.() || _0xf928e3["end"];
    _0xf928e3['start']?.['id'] && _0xf928e3["end"]?.['id'] && _0xf928e3['start']['id'] !== _0xf928e3['end']['id'] && (_0x545a0b = {
      ..._0xf928e3
    });
    return _0xf928e3;
  }
  async function _0x338d79(_0xcccde0 = [], _0x2db36b = {}) {
    const _0x325da4 = Array["isArray"](_0xcccde0) ? _0xcccde0 : [];
    const _0x5574aa = String(_0x2db36b['agentRunId'] || sessionStore["getCurrentRun"]?.()?.['id'] || "agent-run-" + _0x323351)['trim']();
    const _0xfc56d2 = Math["max"](0x0, Math["trunc"](Number(sessionStore["getCurrentRun"]?.()?.["step"] || 0x0)));
    _0x2aca7f(_0x5574aa);
    const _0x440afa = _0x325da4['map']((_0x37426f, _0x5cfc5b) => {
      const _0x374136 = fingerprintAgentAction(_0x37426f);
      const _0x5e9799 = {
        'id': _0x5574aa + ':' + _0xfc56d2 + ':' + _0x5cfc5b + ':' + _0x374136 + ':' + ++_0x4b3811,
        'runId': _0x5574aa,
        'conversationId': _0x5588b1(),
        'projectId': getProjectId({
          'commandContext': _0x1944be
        }),
        'step': _0xfc56d2,
        'commandId': String(_0x37426f?.["type"] || _0x37426f?.["commandId"] || '')["trim"](),
        'fingerprint': _0x374136,
        'status': "running",
        'startedAt': Date["now"]()
      };
      sessionStore['upsertOperation']?.(_0x5e9799);
      return _0x5e9799;
    });
    const _0x3a0e92 = await executeActions(_0x325da4, _0x2db36b);
    const _0x221d28 = Array["isArray"](_0x3a0e92?.["results"]) ? _0x3a0e92['results'] : [];
    _0x440afa['forEach']((_0xf2c47a, _0xa7b02b) => {
      const _0x251fe1 = _0x221d28[_0xa7b02b] || null;
      const _0x914334 = _0x325da4[_0xa7b02b] || {};
      const _0x474fcc = _0x251fe1 ? deriveAgentRuntimeProvenance({
        'action': _0x914334,
        'execution': {
          'ok': _0x251fe1['ok'] === !![],
          'status': _0x251fe1['ok'] === !![] ? 'success' : 'failed',
          'results': [_0x251fe1]
        }
      }) : {
        'createdNodeIds': [],
        'createdEdgeIds': []
      };
      sessionStore["upsertOperation"]?.({
        ..._0xf2c47a,
        'status': _0x251fe1 ? _0x251fe1['ok'] === !![] ? "success" : "failed" : "skipped",
        'ok': _0x251fe1 ? _0x251fe1['ok'] === !![] : null,
        'errorCode': String(_0x251fe1?.["errorCode"] || ''),
        'verificationStatus': String(_0x251fe1?.["verification"]?.["status"] || ''),
        'repairAttempts': Math["max"](0x0, Math["min"](0x1, Math["trunc"](Number(_0x251fe1?.["verification"]?.["attempts"] || 0x0)))),
        'createdNodeIds': _0x474fcc["createdNodeIds"],
        'createdEdgeIds': _0x474fcc["createdEdgeIds"],
        'completedAt': Date["now"]()
      });
    });
    _0x1ccebd(_0x5574aa);
    return _0x3a0e92;
  }
  function _0x2b060a(_0x49b4c7, {
    taskMessages = [],
    recoveryCheckpoint = null
  } = {}) {
    const _0x25c0c2 = _0x2fb448["getPending"](_0x49b4c7['runId']);
    if (_0x25c0c2["length"] === 0x0) {
      return null;
    }
    const _0x4af9ca = (sessionStore["getTaskBindings"]?.() || [])["filter"](_0x982a2e => _0x982a2e["turnId"] === _0x49b4c7["runId"]);
    const _0x5a4cfa = {
      ..._0x49b4c7,
      'pendingKind': "task_wait",
      'waitingTaskBindingIds': _0x4af9ca["map"](_0x3a10bc => _0x3a10bc['id']),
      ...(recoveryCheckpoint ? {
        'taskRecoveryCheckpoint': recoveryCheckpoint
      } : {})
    };
    sessionStore['setPendingLoopRun']?.(_0x5a4cfa);
    _0x5a1dd9(_0x49b4c7['originalMessage']);
    sessionStore["setCurrentRun"]?.({
      'id': _0x49b4c7["runId"],
      'status': "waiting_tasks",
      'stopped': ![],
      'step': _0x49b4c7["step"]
    });
    sessionStore["recordRunEvent"]?.({
      'runId': _0x49b4c7["runId"],
      'type': "task.waiting",
      'status': "waiting_tasks",
      'step': _0x49b4c7['step'],
      'message': runtimeText("taskWaiting", _0x2e11aa())
    });
    const _0xc5fe8 = runtimeText('taskWaiting', _0x2e11aa());
    sessionStore["pushHistory"]?.({
      'role': "assistant",
      'status': "waiting_tasks",
      'content': _0xc5fe8
    });
    return {
      'ok': !![],
      'status': 'waiting_tasks',
      'reply': _0xc5fe8,
      'taskMessages': taskMessages
    };
  }
  function _0x1c6eb0() {
    if (_0x465139) {
      return;
    }
    const _0x1395c1 = sessionStore["getPendingLoopRun"]?.();
    if (_0x1395c1?.['pendingKind'] !== "task_wait" || !_0x33c208(_0x1395c1["runId"])) {
      return;
    }
    const _0x4e4f46 = _0x2fb448['getSettlement'](_0x1395c1["waitingTaskBindingIds"] || []);
    if (!_0x4e4f46["settled"]) {
      return;
    }
    sessionStore["clearPendingLoopRun"]?.();
    _0x465139 = Promise["resolve"]()["then"](async () => {
      if (!_0x33c208(_0x1395c1["runId"]) || !_0x32a3b1(_0x1395c1)) {
        return null;
      }
      const {
        allSucceeded: _0x2b73a7
      } = _0x4e4f46;
      sessionStore["recordRunEvent"]?.({
        'runId': _0x1395c1['runId'],
        'type': 'task.resumed',
        'status': _0x2b73a7 ? "planning" : "failed",
        'step': _0x1395c1["step"],
        'message': runtimeText("taskResumed", _0x2e11aa())
      });
      if (!_0x2b73a7) {
        const _0x33d09a = _0x4e4f46["failureMessage"];
        const _0xe21584 = _0x1395c1["taskRecoveryCheckpoint"];
        if (_0xe21584?.["action"] && _0xe21584?.["loopState"]) {
          return _0x131a7a({
            ..._0xe21584['loopState'],
            'runId': _0x1395c1["runId"]
          }, _0xe21584["action"], {
            'ok': ![],
            'status': "failed",
            'errorCode': "ASYNC_TASK_FAILED",
            'message': _0x33d09a,
            'results': [{
              'ok': ![],
              'errorCode': "ASYNC_TASK_FAILED",
              'message': _0x33d09a
            }],
            'raw': {
              'result': {
                'failedIndex': 0x0
              }
            }
          });
        }
        return _0x320f57(_0x1395c1, _0x33d09a);
      }
      _0x21fc2b();
      return _0x2142f2({
        ..._0x1395c1,
        'pendingKind': '',
        'waitingTaskBindingIds': [],
        'taskRecoveryCheckpoint': null,
        'validationFeedback': [...(_0x1395c1["validationFeedback"] || []), {
          'step': _0x1395c1['step'],
          'commandId': 'generation.run',
          'status': "tasks_completed",
          'ok': !![],
          'message': runtimeText('taskResumed', _0x2e11aa())
        }]["slice"](-0x4)
      });
    })["catch"](_0x3c5c87 => {
      _0x33c208(_0x1395c1["runId"]) && _0x320f57(_0x1395c1, String(_0x3c5c87?.["message"] || runtimeText("actionExecutionFailed", _0x2e11aa())));
    })["finally"](() => {
      _0x465139 = null;
    });
  }
  _0x2fb448 = createAgentTaskBindingRuntime({
    'store': _0x170bcf,
    'sessionStore': sessionStore,
    'readCanvasState': () => getState({
      'store': _0x170bcf,
      'commandContext': _0x1944be
    }),
    'getActiveConversationId': _0x5588b1,
    'getCurrentTurnId': _0x16e0e1,
    'formatText': (_0x34f37d, _0x5b8967) => formatRuntimeText(_0x34f37d, _0x5b8967, _0x2e11aa()),
    'onBindingsChanged': _0x1c6eb0
  });
  _0x2fb448["start"]();
  const _0x4813d0 = sessionStore["getPendingLoopRun"]?.();
  _0x4813d0?.["pendingKind"] === "task_wait" && _0x32a3b1(_0x4813d0) && (sessionStore["setCurrentRun"]?.({
    'id': _0x4813d0["runId"],
    'status': "waiting_tasks",
    'stopped': ![],
    'step': _0x4813d0["step"]
  }), _0x2fb448["sync"](getState({
    'store': _0x170bcf,
    'commandContext': _0x1944be
  })));
  function _0x5a1dd9(_0x5beac5) {
    sessionStore["markUnfinishedOperation"]?.({
      'lastPlanSummary': _0x5beac5,
      'lastCanvasSnapshotDigest': buildCanvasSnapshotDigest({
        'store': _0x170bcf,
        'commandContext': _0x1944be
      })
    });
  }
  function _0x1d9fc0() {
    sessionStore["clearUnfinishedOperation"]?.();
  }
  function _0x3114a9(_0x2688e3 = "superseded") {
    _0x33901e['stop']();
    const _0x4ce4de = _0x4a2895;
    _0x4a2895 = null;
    if (!_0x4ce4de || _0x4ce4de["signal"]["aborted"]) {
      return;
    }
    try {
      _0x4ce4de["abort"](_0x2688e3);
    } catch {
      _0x4ce4de["abort"]();
    }
  }
  function _0x21fc2b() {
    _0x3114a9('superseded');
    _0x4a2895 = typeof AbortController === "function" ? new AbortController() : null;
    return _0x4a2895;
  }
  function _0x4bd7c9() {
    return {
      'conversationId': _0x5588b1(),
      'projectId': getProjectId({
        'commandContext': _0x1944be
      })
    };
  }
  function _0x32a3b1(_0x126099 = {}) {
    const _0x3e1166 = _0x4bd7c9();
    return String(_0x126099["conversationId"] || '') === _0x3e1166["conversationId"] && String(_0x126099["projectId"] || '') === _0x3e1166['projectId'];
  }
  function _0x162662({
    runId: _0xfb3997,
    message: _0x3100a9,
    plannerExtra = {}
  } = {}) {
    return {
      'runId': _0xfb3997,
      'originalMessage': String(_0x3100a9 || ''),
      'plannerExtra': {
        ...plannerExtra
      },
      ..._0x4bd7c9(),
      'step': 0x0,
      'toolResults': [],
      'validationFeedback': [],
      'runtimeProvenance': {
        'createdNodeIds': [],
        'createdEdgeIds': []
      },
      'actionBudget': createAgentLoopActionBudget(_0x3100a9),
      'completedFingerprints': [],
      'failedFingerprints': {},
      'validationFailureCounts': {},
      'noActionRetryCount': 0x0,
      'disclosedCommandIds': [],
      'disclosedModelIds': []
    };
  }
  function _0x3a9c14(_0x20b000, _0x3de6a0, _0x1443e7) {
    const _0x1c22f2 = deriveAgentCapabilityDiscovery({
      'action': _0x3de6a0,
      'execution': _0x1443e7
    });
    const _0x4fc325 = [...new Set([...(_0x20b000["disclosedCommandIds"] || []), ..._0x1c22f2['commandIds']])];
    const _0x1d6921 = [...new Set([...(_0x20b000["disclosedModelIds"] || []), ..._0x1c22f2["modelIds"]])];
    (_0x4fc325["length"] !== (_0x20b000["disclosedCommandIds"] || [])["length"] || _0x1d6921["length"] !== (_0x20b000['disclosedModelIds'] || [])["length"]) && sessionStore["recordTrace"]?.({
      'type': "agent_capability_discovered",
      'step': _0x20b000["step"],
      'sourceCommandId': _0x3de6a0["type"],
      'commandIds': _0x1c22f2["commandIds"],
      'modelIds': _0x1c22f2["modelIds"]
    });
    return {
      ..._0x20b000,
      'disclosedCommandIds': _0x4fc325,
      'disclosedModelIds': _0x1d6921
    };
  }
  function _0x11c4be(_0xe94f57 = {}) {
    const _0x2f3032 = normalizeAgentPrecreatedNode(_0xe94f57["precreatedNode"]);
    return {
      'enabled': !![],
      'step': Number(_0xe94f57['step'] || 0x0),
      'maxSteps': Math["max"](0x1, Number(maxLoopSteps || DEFAULT_MAX_LOOP_STEPS)),
      'toolResults': Array["isArray"](_0xe94f57["toolResults"]) ? _0xe94f57["toolResults"] : [],
      'validationFeedback': Array["isArray"](_0xe94f57["validationFeedback"]) ? _0xe94f57['validationFeedback'] : [],
      'runtimeProvenance': _0xe94f57["runtimeProvenance"] || {},
      ...(_0x2f3032 ? {
        'precreatedNode': _0x2f3032
      } : {}),
      ...(_0xe94f57['recoveryInstruction'] ? {
        'recoveryInstruction': String(_0xe94f57["recoveryInstruction"])
      } : {}),
      ...(_0xe94f57["clarificationAnswer"] ? {
        'clarificationAnswer': String(_0xe94f57["clarificationAnswer"])
      } : {}),
      'instruction': "Return at most one canvas action. After a tool result, decide the next single action or finish with actions []. Never repeat a successful action."
    };
  }
  function _0x320f57(_0x5285ef, _0xdf89e1, _0x5d023a = {}) {
    sessionStore['clearPendingLoopRun']?.();
    sessionStore["clearPendingPlan"]?.();
    sessionStore["clearPendingClarification"]?.();
    _0x1d9fc0();
    sessionStore["pushHistory"]?.({
      'role': "assistant",
      'status': "failed",
      'content': _0xdf89e1
    });
    _0x33c208(_0x5285ef["runId"]) && sessionStore["setCurrentRun"]?.({
      'id': _0x5285ef["runId"],
      'status': "failed",
      'stopped': ![]
    });
    return createFailedReply(_0xdf89e1, _0x5d023a);
  }
  function _0x5c035b(_0x34ad74, _0x451ac9, _0x201d7b = {}) {
    const _0x6bacc8 = String(_0x451ac9 || runtimeText('plannerRetryAvailable', _0x2e11aa()));
    const _0xf73958 = buildAgentPlannerDiagnostic({
      'loopState': _0x34ad74,
      'validation': _0x201d7b["validation"] || null,
      'cause': _0x201d7b["cause"] || '',
      'reason': _0x201d7b['diagnosticReason'] || '',
      'locale': _0x2e11aa()
    });
    const _0x16563d = buildAgentPlannerRecovery({
      'originalMessage': _0x34ad74["originalMessage"],
      'locale': _0x2e11aa()
    });
    const _0x3cc2d4 = {
      ..._0x34ad74,
      'pendingKind': "planner_retry",
      'plannerFailureMessage': _0x6bacc8,
      'plannerDiagnostic': _0xf73958
    };
    sessionStore["setPendingLoopRun"]?.(_0x3cc2d4);
    sessionStore["clearPendingPlan"]?.();
    sessionStore["clearPendingClarification"]?.();
    _0x5a1dd9(_0x34ad74["originalMessage"]);
    sessionStore["pushHistory"]?.({
      'role': "assistant",
      'status': "failed",
      'content': _0x6bacc8,
      'diagnostic': _0xf73958
    });
    _0x33c208(_0x34ad74["runId"]) && sessionStore["setCurrentRun"]?.({
      'id': _0x34ad74['runId'],
      'status': "failed",
      'stopped': ![],
      'step': _0x34ad74["step"]
    });
    sessionStore["recordRunEvent"]?.({
      'runId': _0x34ad74["runId"],
      'type': "planner.retry_available",
      'status': "failed",
      'step': _0x34ad74["step"],
      'errorCode': _0xf73958["errorCode"],
      'message': _0x6bacc8
    });
    return createFailedReply(_0x6bacc8, {
      'retryable': !![],
      'diagnostic': _0xf73958,
      'recovery': _0x16563d
    });
  }
  function _0x131a7a(_0x3c9bb5, _0x56eafa, _0x972024) {
    const _0x2268fb = String(_0x972024?.['message'] || runtimeText('actionExecutionFailed', _0x2e11aa()));
    const _0x159519 = {
      'status': 'ready',
      'reply': _0x2268fb,
      'actions': [_0x56eafa],
      'requiresConfirmation': ![]
    };
    const {
      recovery: _0x18b0f6,
      retryPlan: _0x1730e0
    } = _0x359a49["recover"](_0x972024, _0x159519);
    const _0x44596f = buildAgentExecutionDiagnostic({
      'execution': _0x972024,
      'recovery': _0x18b0f6,
      'step': _0x3c9bb5["step"],
      'completedSteps': (_0x3c9bb5['toolResults'] || [])["filter"](_0x160ea4 => _0x160ea4?.['ok'] === !![])["length"],
      'locale': _0x2e11aa()
    });
    sessionStore["clearPendingLoopRun"]?.();
    sessionStore["clearPendingPlan"]?.();
    sessionStore["clearPendingClarification"]?.();
    _0x18b0f6 ? (sessionStore["setPendingRecovery"]?.({
      'plan': _0x1730e0,
      'recovery': _0x18b0f6,
      'loopCheckpoint': {
        ..._0x3c9bb5,
        'pendingKind': '',
        'pendingValidatedPlan': null
      },
      'loopAction': _0x56eafa
    }), _0x5a1dd9(_0x359a49["describe"]({
      'recovery': _0x18b0f6
    }))) : (sessionStore["clearPendingRecovery"]?.(), _0x1d9fc0());
    sessionStore["pushHistory"]?.({
      'role': "assistant",
      'status': 'failed',
      'content': _0x2268fb,
      'execution': _0x972024,
      'recovery': _0x18b0f6,
      'diagnostic': _0x44596f
    });
    _0x33c208(_0x3c9bb5["runId"]) && sessionStore["setCurrentRun"]?.({
      'id': _0x3c9bb5['runId'],
      'status': "failed",
      'stopped': ![],
      'step': _0x3c9bb5["step"]
    });
    sessionStore["recordRunEvent"]?.({
      'runId': _0x3c9bb5["runId"],
      'type': "action.recovery_available",
      'status': "failed",
      'step': _0x3c9bb5["step"],
      'commandId': _0x56eafa?.['type'],
      'errorCode': _0x44596f["errorCode"],
      'message': _0x2268fb
    });
    return createFailedReply(_0x2268fb, {
      'execution': _0x972024,
      'diagnostic': _0x44596f,
      ...(_0x18b0f6 ? {
        'recovery': _0x18b0f6
      } : {})
    });
  }
  function _0x1e822a(_0x39481f, _0x4ff20b, _0x384465, {
    confirmed = ![]
  } = {}) {
    const _0x3549b2 = _0x2fb448["registerExecution"](_0x384465, {
      'turnId': _0x39481f["runId"]
    });
    const _0x34123b = fingerprintAgentAction(_0x4ff20b);
    const _0x5744ab = buildAgentToolResult({
      'step': _0x39481f['step'],
      'action': _0x4ff20b,
      'execution': _0x384465
    });
    let _0x545353 = {
      ..._0x39481f,
      'pendingKind': '',
      'pendingValidatedPlan': null,
      'precreatedNode': _0x384465['ok'] === !![] && doesActionConsumePrecreatedNode(_0x4ff20b, _0x39481f['precreatedNode']) ? null : _0x39481f["precreatedNode"] || null,
      'step': _0x39481f["step"] + 0x1,
      'toolResults': [...(_0x39481f["toolResults"] || []), _0x5744ab],
      'runtimeProvenance': deriveAgentRuntimeProvenance({
        'action': _0x4ff20b,
        'execution': _0x384465,
        'previous': _0x39481f["runtimeProvenance"]
      }),
      'actionBudget': recordAgentLoopActionBudgetResult(_0x39481f['actionBudget'], _0x4ff20b, _0x384465),
      'completedFingerprints': _0x384465['ok'] ? [...(_0x39481f["completedFingerprints"] || []), _0x34123b] : _0x39481f['completedFingerprints'] || [],
      'failedFingerprints': _0x384465['ok'] ? Object["fromEntries"](Object["entries"](_0x39481f["failedFingerprints"] || {})['filter'](([_0x1ddd9e]) => _0x1ddd9e !== _0x34123b)) : {
        ...(_0x39481f['failedFingerprints'] || {}),
        [_0x34123b]: Number(_0x39481f["failedFingerprints"]?.[_0x34123b] || 0x0) + 0x1
      }
    };
    _0x545353 = _0x3a9c14(_0x545353, _0x4ff20b, _0x384465);
    sessionStore["recordTrace"]?.({
      'type': "agent_loop_tool_result",
      'step': _0x545353["step"],
      'commandId': _0x4ff20b["type"],
      'ok': _0x384465['ok'] === !![],
      ...(confirmed ? {
        'confirmed': !![]
      } : {})
    });
    _0x384465['ok'] === !![] && (sessionStore["setPendingLoopRun"]?.({
      ..._0x545353,
      'pendingKind': "interrupted"
    }), _0x5a1dd9(_0x545353["originalMessage"]));
    return {
      'nextLoop': _0x545353,
      'taskMessages': _0x3549b2,
      'recoveryCheckpoint': {
        'loopState': {
          ..._0x39481f,
          'pendingKind': '',
          'pendingValidatedPlan': null
        },
        'action': _0x4ff20b
      }
    };
  }
  async function _0x4e6115({
    checkpoint = null,
    displayMessage = '',
    recoveryInstruction = ''
  } = {}) {
    const _0x491b10 = checkpoint || sessionStore['getPendingLoopRun']?.();
    if (_0x491b10?.['pendingKind'] !== "planner_retry" || !_0x32a3b1(_0x491b10)) {
      return createFailedReply(runtimeText("noPendingRecovery", _0x2e11aa()));
    }
    const _0x437941 = "agent-run-" + ++_0x323351;
    _0x21fc2b();
    sessionStore["clearPendingLoopRun"]?.();
    sessionStore["setCurrentRun"]?.({
      'id': _0x437941,
      'status': "planning",
      'stopped': ![]
    });
    displayMessage && sessionStore['pushHistory']?.({
      'role': "user",
      'content': displayMessage
    });
    return _0x2142f2({
      ..._0x491b10,
      'runId': _0x437941,
      'recoveryInstruction': String(recoveryInstruction || _0x491b10["recoveryInstruction"] || '')["trim"](),
      'pendingKind': '',
      'plannerFailureMessage': '',
      'plannerDiagnostic': null,
      'noActionRetryCount': 0x0
    });
  }
  async function _0x1e429c({
    displayMessage = ''
  } = {}) {
    const _0x62fdbc = sessionStore["getPendingLoopRun"]?.();
    if (!_0x62fdbc || !_0x32a3b1(_0x62fdbc)) {
      return createFailedReply(runtimeText("noPendingRecovery", _0x2e11aa()));
    }
    if (_0x62fdbc["pendingKind"] === "planner_retry") {
      return _0x4e6115({
        'checkpoint': _0x62fdbc,
        'displayMessage': displayMessage
      });
    }
    if (["clarification", "task_wait"]["includes"](String(_0x62fdbc["pendingKind"] || ''))) {
      return createFailedReply(runtimeText("noPendingRecovery", _0x2e11aa()));
    }
    const _0x55779b = "agent-run-" + ++_0x323351;
    _0x21fc2b();
    sessionStore['clearPendingLoopRun']?.();
    sessionStore["clearPendingPlan"]?.();
    sessionStore["setCurrentRun"]?.({
      'id': _0x55779b,
      'status': 'planning',
      'stopped': ![],
      'step': _0x62fdbc["step"]
    });
    displayMessage && sessionStore["pushHistory"]?.({
      'role': 'user',
      'content': displayMessage
    });
    sessionStore["pushHistory"]?.({
      'role': 'assistant',
      'status': "planning",
      'content': runtimeText('runResumed', _0x2e11aa())
    });
    return _0x2142f2({
      ..._0x62fdbc,
      'runId': _0x55779b,
      'pendingKind': '',
      'pendingValidatedPlan': null,
      'validationFeedback': Array["isArray"](_0x62fdbc["validationFeedback"]) ? _0x62fdbc["validationFeedback"] : [],
      'validationFailureCounts': _0x62fdbc["validationFailureCounts"] || {}
    });
  }
  function _0x44c9dc() {
    const _0x1e9a8b = sessionStore["getPendingLoopRun"]?.();
    const _0x3768ee = sessionStore["getPendingPlan"]?.();
    const _0x5819d5 = sessionStore["getPendingRecovery"]?.();
    const _0x2f1360 = sessionStore["getPendingClarification"]?.();
    const _0x23442e = sessionStore["getActiveConversation"]?.();
    if (!_0x1e9a8b && !_0x3768ee && !_0x5819d5 && !_0x2f1360 && _0x23442e?.['hasUnfinishedOperation'] !== !![]) {
      return createFailedReply(runtimeText("noInterruptedRun", _0x2e11aa()));
    }
    _0x3114a9("discarded");
    const _0x317d60 = sessionStore["stopCurrentRun"]?.() || null;
    sessionStore["clearPendingLoopRun"]?.();
    sessionStore['clearPendingPlan']?.();
    sessionStore["clearPendingRecovery"]?.();
    sessionStore['clearPendingClarification']?.();
    _0x1d9fc0();
    const _0x4cc773 = runtimeText("runDiscarded", _0x2e11aa());
    sessionStore["pushHistory"]?.({
      'role': "assistant",
      'status': "discarded",
      'content': _0x4cc773
    });
    return {
      'ok': !![],
      'status': 'discarded',
      'reply': _0x4cc773,
      'run': _0x317d60
    };
  }
  function _0x23fa27() {
    const _0x418c7a = _0x545a0b;
    const _0x19c0d4 = Boolean(_0x418c7a && _0x418c7a["conversationId"] === _0x5588b1() && _0x418c7a["projectId"] === getProjectId({
      'commandContext': _0x1944be
    }));
    const _0x1955a1 = _0x2fb448["getPending"](_0x418c7a?.["runId"]);
    if (!_0x19c0d4 || !_0x418c7a?.["start"]?.['id'] || !_0x418c7a?.["end"]?.['id'] || _0x1955a1['length'] > 0x0) {
      return createFailedReply(runtimeText("noUndoableRun", _0x2e11aa()));
    }
    const _0x177364 = _0x1944be?.["history"]?.['undoToCheckpoint']?.(_0x418c7a['start'], {
      'expectedHead': _0x418c7a["end"]
    });
    if (_0x177364?.['ok'] !== !![]) {
      return createFailedReply(runtimeText("noUndoableRun", _0x2e11aa()), {
        'errorCode': _0x177364?.['errorCode'] || "AGENT_UNDO_UNAVAILABLE"
      });
    }
    for (const _0x500914 of sessionStore['getOperationLedger']?.() || []) {
      if (_0x500914["runId"] !== _0x418c7a["runId"] || _0x500914["status"] !== 'success') {
        continue;
      }
      sessionStore["upsertOperation"]?.({
        ..._0x500914,
        'status': 'undone'
      });
    }
    sessionStore["recordRunEvent"]?.({
      'runId': _0x418c7a['runId'],
      'type': "run.undone",
      'status': "undone",
      'message': runtimeText("runUndone", _0x2e11aa())
    });
    sessionStore["pushHistory"]?.({
      'role': "assistant",
      'status': "success",
      'content': runtimeText('runUndone', _0x2e11aa())
    });
    _0x545a0b = null;
    return {
      'ok': !![],
      'status': 'undone',
      'reply': runtimeText("runUndone", _0x2e11aa()),
      'undone': _0x177364["undone"]
    };
  }
  function _0x13ad03(_0x8ca416, _0x38ad34 = {}) {
    const _0x4f68b6 = Object["values"](_0x8ca416["failedFingerprints"] || {})["some"](_0x45bea9 => Number(_0x45bea9 || 0x0) > 0x0);
    if (_0x4f68b6) {
      const _0x5736d6 = [...(_0x8ca416["toolResults"] || [])]["reverse"]()['find'](_0x305829 => _0x305829?.['ok'] === ![]);
      return _0x320f57(_0x8ca416, String(_0x5736d6?.["message"] || runtimeText("actionExecutionFailed", _0x2e11aa())), {
        'toolResults': _0x8ca416["toolResults"]
      });
    }
    const _0x3d0a9b = String(_0x38ad34["reply"] || runtimeText('done', _0x2e11aa()));
    const _0x491831 = _0x8ca416['toolResults']["length"] > 0x0;
    const _0x3e2030 = _0x491831 ? "success" : "chat";
    sessionStore["clearPendingLoopRun"]?.();
    sessionStore["clearPendingPlan"]?.();
    sessionStore['clearPendingClarification']?.();
    _0x1d9fc0();
    sessionStore["pushHistory"]?.({
      'role': 'assistant',
      'status': _0x3e2030,
      'content': _0x3d0a9b
    });
    _0x33c208(_0x8ca416["runId"]) && sessionStore['setCurrentRun']?.({
      'id': _0x8ca416['runId'],
      'status': _0x3e2030,
      'stopped': ![]
    });
    return {
      'ok': !![],
      'status': _0x3e2030,
      'reply': _0x3d0a9b,
      'message': _0x3d0a9b,
      'plan': _0x38ad34,
      'toolResults': _0x8ca416["toolResults"]
    };
  }
  async function _0x2142f2(_0x400314) {
    if (!_0x32a3b1(_0x400314)) {
      return _0x320f57(_0x400314, runtimeText("loopResumeExpired", _0x2e11aa()));
    }
    const _0x38672e = Math["max"](0x1, Math["trunc"](Number(maxLoopSteps || DEFAULT_MAX_LOOP_STEPS)));
    while (_0x400314["step"] <= _0x38672e) {
      if (!_0x33c208(_0x400314["runId"])) {
        return _0x1887fc();
      }
      sessionStore["setCurrentRun"]?.({
        'id': _0x400314['runId'],
        'status': 'planning',
        'stopped': ![],
        'step': _0x400314["step"]
      });
      let _0x48136a;
      try {
        _0x48136a = await _0x1e304d(_0x400314["originalMessage"], {
          ..._0x400314["plannerExtra"],
          'loopState': _0x11c4be(_0x400314),
          'signal': _0x4a2895?.["signal"],
          'disclosedCommandIds': _0x400314["disclosedCommandIds"],
          'disclosedModelIds': _0x400314["disclosedModelIds"]
        });
        _0x400314["plannerNetworkRetryCount"] = 0x0;
      } catch (_0x3f06ee) {
        if (!_0x33c208(_0x400314['runId']) || _0x4a2895?.["signal"]?.['aborted']) {
          return _0x1887fc();
        }
        const _0x3c2958 = Number(_0x400314["plannerNetworkRetryCount"] || 0x0);
        if (isTransientPlannerNetworkError(_0x3f06ee) && _0x3c2958 < PLANNER_NETWORK_RETRY_LIMIT) {
          _0x400314["plannerNetworkRetryCount"] = _0x3c2958 + 0x1;
          sessionStore["recordTrace"]?.({
            'type': "agent_loop_planner_network_retry",
            'step': _0x400314["step"],
            'attempt': _0x400314['plannerNetworkRetryCount']
          });
          continue;
        }
        return _0x5c035b(_0x400314, runtimeText("plannerRetryAvailable", _0x2e11aa()), {
          'cause': String(_0x3f06ee?.["message"] || runtimeText('plannerFailed', _0x2e11aa()))
        });
      }
      if (!_0x33c208(_0x400314['runId'])) {
        return _0x1887fc();
      }
      const _0x268226 = Array['isArray'](_0x48136a?.["actions"]) ? _0x48136a["actions"] : [];
      if (_0x268226["length"] === 0x0 && !['need_clarification', "failed"]["includes"](_0x48136a?.["status"])) {
        const _0x4faf44 = hasExplicitCanvasActionIntent(_0x400314["originalMessage"], _0x400314["plannerExtra"]);
        const _0x50e2bb = verifyAgentLoopCompletionEvidence({
          'userMessage': _0x400314['originalMessage'],
          'plannerExtra': _0x400314["plannerExtra"],
          'runtimeProvenance': _0x400314["runtimeProvenance"],
          'canvasState': getState({
            'store': _0x170bcf,
            'commandContext': _0x1944be
          })
        });
        if (_0x4faf44 && _0x50e2bb['ok'] === ![]) {
          const _0x31c989 = "completion:" + (_0x50e2bb["requestedNodeType"] || 'unknown');
          const _0x58cd93 = Number(_0x400314["validationFailureCounts"]?.[_0x31c989] || 0x0) + 0x1;
          const _0x3042ec = runtimeText("loopCompletionEvidenceCorrection", _0x2e11aa());
          if (_0x58cd93 <= 0x2) {
            _0x400314['validationFailureCounts'] = {
              ..._0x400314["validationFailureCounts"],
              [_0x31c989]: _0x58cd93
            };
            _0x400314["validationFeedback"] = [...(_0x400314["validationFeedback"] || []), {
              'step': _0x400314["step"],
              'commandId': "agent.plan",
              'status': 'validation_failed',
              'ok': ![],
              'errorCode': _0x50e2bb["errorCode"],
              'message': _0x3042ec,
              'details': _0x50e2bb
            }]["slice"](-0x4);
            sessionStore["recordTrace"]?.({
              'type': 'agent_loop_completion_evidence_retry',
              'step': _0x400314["step"],
              'retryCount': _0x58cd93,
              'requestedNodeType': _0x50e2bb["requestedNodeType"]
            });
            continue;
          }
          return _0x5c035b(_0x400314, runtimeText("plannerReturnedNoAction", _0x2e11aa()), {
            'diagnosticReason': _0x50e2bb["errorCode"]
          });
        }
        if (_0x400314["toolResults"]['length'] > 0x0 || _0x48136a?.["status"] === "chat" || !_0x4faf44) {
          return _0x13ad03(_0x400314, _0x48136a);
        }
        if (shouldRetryAgentLoopNoop({
          'hasActionIntent': _0x4faf44,
          'toolResultCount': _0x400314['toolResults']["length"],
          'retryCount': _0x400314["noActionRetryCount"],
          'status': _0x48136a?.["status"]
        })) {
          _0x400314["noActionRetryCount"] = Number(_0x400314["noActionRetryCount"] || 0x0) + 0x1;
          sessionStore["recordTrace"]?.({
            'type': "agent_loop_no_action_retry",
            'step': _0x400314['step'],
            'reply': String(_0x48136a?.["reply"] || '')
          });
          continue;
        }
        return _0x5c035b(_0x400314, runtimeText('plannerReturnedNoAction', _0x2e11aa()), {
          'diagnosticReason': "no_action"
        });
      }
      if (_0x400314["step"] >= _0x38672e && _0x268226["length"] > 0x0) {
        return _0x320f57(_0x400314, runtimeText("loopLimitReached", _0x2e11aa()));
      }
      _0x268226['length'] > 0x1 && sessionStore["recordTrace"]?.({
        'type': "agent_loop_multiple_actions_compacted",
        'step': _0x400314['step'],
        'actionTypes': _0x268226["map"](_0x5ecb9f => _0x5ecb9f?.["type"])
      });
      const _0x52e187 = [];
      const _0x54ab9f = _0x6112c3 => validatePlan(_0x6112c3, {
        'commandRegistry': commandRegistry,
        'commandContext': _0x1944be,
        'agentContext': _0x12daf8,
        'userMessage': _0x400314["originalMessage"],
        'runtimeProvenance': _0x400314["runtimeProvenance"],
        'traceRecorder': _0xf05ba6 => {
          _0x52e187['push'](_0xf05ba6);
          sessionStore["recordTrace"]?.(_0xf05ba6);
        }
      });
      const _0x2418e6 = selectAgentLoopPlanAction({
        'rawPlan': _0x48136a,
        'actions': _0x268226,
        'validate': _0x54ab9f,
        'completedFingerprints': _0x400314['completedFingerprints'],
        'fingerprint': fingerprintAgentAction,
        'onCompletedPrefix': (_0x53cdd7, _0x58c407) => sessionStore["recordTrace"]?.({
          'type': 'agent_loop_completed_prefix_skipped',
          'step': _0x400314["step"],
          'commandId': _0x53cdd7["type"],
          'actionIndex': _0x58c407
        })
      });
      const _0x559b21 = _0x2418e6['plan'];
      const _0xd6f240 = _0x2418e6["validation"];
      if (!_0xd6f240['ok']) {
        if (_0xd6f240["errorCode"] === "AGENT_PLAN_FAILED") {
          return _0x5c035b(_0x400314, runtimeText("plannerRetryAvailable", _0x2e11aa()), {
            'validation': _0xd6f240
          });
        }
        const _0x45ece9 = _0x559b21?.["actions"]?.[0x0] || null;
        const _0x5dd0c2 = !_0x45ece9 && _0xd6f240["errorCode"] === "AGENT_PLAN_INVALID";
        const _0x4d0a92 = ["UNKNOWN_AGENT_ACTION", 'DEFERRED_AGENT_ACTION', "BLOCKED_AGENT_ACTION"]["includes"](String(_0xd6f240["errorCode"] || ''));
        if ((_0x45ece9 || _0x5dd0c2) && !_0x4d0a92) {
          const _0x54b182 = _0x45ece9?.["type"] || "agent.plan";
          const _0x5218c2 = _0x45ece9 ? fingerprintAgentAction(_0x45ece9) : "agent.plan:" + String(_0x48136a?.['status'] || 'unknown') + ':' + _0xd6f240["errorCode"];
          const _0x53fbbc = Number(_0x400314["validationFailureCounts"]?.[_0x5218c2] || 0x0) + 0x1;
          if (_0x53fbbc <= 0x2) {
            _0x400314["validationFailureCounts"] = {
              ..._0x400314['validationFailureCounts'],
              [_0x5218c2]: _0x53fbbc
            };
            _0x400314["validationFeedback"] = [...(_0x400314["validationFeedback"] || []), {
              'step': _0x400314["step"],
              'commandId': _0x54b182,
              'status': "validation_failed",
              'ok': ![],
              'errorCode': _0xd6f240["errorCode"],
              'message': _0xd6f240["message"]
            }]["slice"](-0x4);
            sessionStore["recordTrace"]?.({
              'type': "agent_loop_validation_retry",
              'step': _0x400314["step"],
              'commandId': _0x54b182,
              'errorCode': _0xd6f240['errorCode']
            });
            continue;
          }
          return _0x5c035b(_0x400314, runtimeText('plannerRetryAvailable', _0x2e11aa()), {
            'validation': _0xd6f240
          });
        }
        return _0x320f57(_0x400314, _0xd6f240['message'], {
          'validation': _0xd6f240
        });
      }
      if (_0x400314["step"] === 0x0 && shouldHoldCanvasActionsForChat(_0xd6f240, _0x400314["originalMessage"], _0x400314['plannerExtra'])) {
        return _0x13ad03(_0x400314, {
          ..._0xd6f240["plan"],
          'status': 'chat',
          'actions': [],
          'reply': _0xd6f240["plan"]['reply'] || runtimeText('chatIntentRequired', _0x2e11aa())
        });
      }
      if (_0xd6f240["status"] === "chat") {
        return _0x13ad03(_0x400314, _0xd6f240["plan"]);
      }
      if (_0xd6f240["status"] === 'need_clarification') {
        if (shouldUseCreativeDefaults({
          'userMessage': _0x400314["originalMessage"],
          'plan': _0xd6f240['plan'],
          'agentContext': _0x12daf8,
          'toolResultCount': _0x400314["toolResults"]["length"]
        })) {
          const _0x5007e3 = 'agent.plan:unnecessary_clarification';
          const _0x332b83 = Number(_0x400314["validationFailureCounts"]?.[_0x5007e3] || 0x0) + 0x1;
          if (_0x332b83 <= 0x2) {
            _0x400314['validationFailureCounts'] = {
              ..._0x400314["validationFailureCounts"],
              [_0x5007e3]: _0x332b83
            };
            _0x400314['clarificationAnswer'] = runtimeText("creativeDefaultsInstruction", _0x2e11aa());
            _0x400314["validationFeedback"] = [...(_0x400314["validationFeedback"] || []), {
              'step': _0x400314['step'],
              'commandId': 'agent.plan',
              'status': 'validation_failed',
              'ok': ![],
              'errorCode': "UNNECESSARY_CLARIFICATION",
              'message': _0x400314["clarificationAnswer"]
            }]["slice"](-0x4);
            sessionStore["recordTrace"]?.({
              'type': "agent_loop_clarification_replaced_with_defaults",
              'step': _0x400314['step'],
              'retryCount': _0x332b83
            });
            continue;
          }
        }
        const _0x1f4fad = {
          ..._0x400314,
          'pendingKind': "clarification"
        };
        const _0x1db4f2 = {
          ..._0xd6f240["plan"],
          'originalMessage': _0x400314["originalMessage"],
          'targetKind': _0x400314['plannerExtra']?.["targetKind"] || '',
          'inputRefs': _0x400314["plannerExtra"]?.["inputRefs"] || []
        };
        sessionStore["setPendingLoopRun"]?.(_0x1f4fad);
        sessionStore["setPendingClarification"]?.(_0x1db4f2);
        _0x5a1dd9(_0xd6f240["plan"]['question'] || _0xd6f240["plan"]['reply']);
        sessionStore["pushHistory"]?.({
          'role': "assistant",
          'status': "need_clarification",
          'content': _0xd6f240['plan']["question"]
        });
        return {
          'ok': !![],
          'status': "need_clarification",
          'reply': _0xd6f240['plan']["reply"] || _0xd6f240["plan"]['question'],
          'question': _0xd6f240["plan"]['question'],
          'options': _0xd6f240["plan"]["options"],
          'plan': _0xd6f240["plan"]
        };
      }
      const _0x434dcc = _0xd6f240["plan"]['actions'][0x0];
      const _0x390124 = fingerprintAgentAction(_0x434dcc);
      if (_0x400314["completedFingerprints"]["includes"](_0x390124)) {
        const _0x269a42 = 'completed:' + _0x390124;
        const _0x4b3786 = Number(_0x400314["validationFailureCounts"]?.[_0x269a42] || 0x0) + 0x1;
        if (_0x4b3786 <= 0x2) {
          const _0x36f079 = runtimeText('loopRepeatedActionCorrection', _0x2e11aa());
          _0x400314["validationFailureCounts"] = {
            ..._0x400314['validationFailureCounts'],
            [_0x269a42]: _0x4b3786
          };
          _0x400314["validationFeedback"] = [...(_0x400314["validationFeedback"] || []), {
            'step': _0x400314["step"],
            'commandId': _0x434dcc['type'],
            'status': 'validation_failed',
            'ok': ![],
            'errorCode': "ACTION_ALREADY_COMPLETED",
            'message': _0x36f079
          }]["slice"](-0x4);
          sessionStore["recordTrace"]?.({
            'type': 'agent_loop_repeated_action_corrected',
            'step': _0x400314['step'],
            'commandId': _0x434dcc["type"],
            'repeatCount': _0x4b3786
          });
          continue;
        }
        return _0x320f57(_0x400314, runtimeText("loopRepeatedAction", _0x2e11aa()));
      }
      const _0x13cad6 = validateAgentLoopActionBudget(_0x434dcc, _0x400314["actionBudget"]);
      if (!_0x13cad6['ok']) {
        const _0x5c0a91 = 'budget:' + _0x13cad6["errorCode"];
        const _0x436f8d = Number(_0x400314['validationFailureCounts']?.[_0x5c0a91] || 0x0) + 0x1;
        const _0x5f12b5 = runtimeText('loopDuplicateBudgetCorrection', _0x2e11aa());
        _0x400314['validationFailureCounts'] = {
          ..._0x400314["validationFailureCounts"],
          [_0x5c0a91]: _0x436f8d
        };
        _0x400314["validationFeedback"] = [...(_0x400314['validationFeedback'] || []), {
          'step': _0x400314["step"],
          'commandId': _0x434dcc["type"],
          'status': "validation_failed",
          'ok': ![],
          'errorCode': _0x13cad6["errorCode"],
          'message': _0x5f12b5,
          'details': _0x13cad6
        }]["slice"](-0x4);
        sessionStore["recordTrace"]?.({
          'type': "agent_loop_action_budget_rejected",
          'step': _0x400314["step"],
          'commandId': _0x434dcc["type"],
          ..._0x13cad6
        });
        if (_0x436f8d <= 0x2) {
          continue;
        }
        return _0x5c035b(_0x400314, runtimeText('plannerRetryAvailable', _0x2e11aa()), {
          'validation': {
            'errorCode': _0x13cad6['errorCode'],
            'plan': {
              'actions': [_0x434dcc]
            }
          }
        });
      }
      if (_0xd6f240["status"] === "need_confirmation") {
        const _0x3e73a7 = _0x359a49["review"](_0xd6f240['plan'], {
          'debugTrace': _0x52e187
        });
        const _0x10811d = {
          ..._0x400314,
          'pendingKind': "confirmation",
          'pendingValidatedPlan': _0x3e73a7
        };
        sessionStore['setPendingLoopRun']?.(_0x10811d);
        sessionStore["setPendingPlan"]?.(_0x3e73a7);
        _0x5a1dd9(_0x359a49['describe']({
          'plan': _0x3e73a7
        }));
        sessionStore["pushHistory"]?.({
          'role': "assistant",
          'status': "need_confirmation",
          'content': _0x3e73a7['reply']
        });
        return {
          'ok': !![],
          'status': 'need_confirmation',
          'reply': _0x3e73a7['reply'] || runtimeText("confirmFallback", _0x2e11aa()),
          'riskLevel': _0xd6f240["riskLevel"],
          'plan': _0x3e73a7
        };
      }
      sessionStore["setCurrentRun"]?.({
        'id': _0x400314['runId'],
        'status': "executing",
        'stopped': ![],
        'step': _0x400314["step"]
      });
      const _0x447a18 = await _0x338d79([_0x434dcc], {
        'commandContext': _0x1944be,
        'precreatedNode': _0x400314['precreatedNode'],
        ..._0x2744f7(_0x400314['runId'])
      });
      if (!_0x33c208(_0x400314["runId"])) {
        return {
          ..._0x1887fc(),
          'execution': _0x447a18
        };
      }
      const _0x146e66 = _0x2fb448["registerExecution"](_0x447a18, {
        'turnId': _0x400314['runId']
      });
      const _0x353d56 = buildAgentToolResult({
        'step': _0x400314["step"],
        'action': _0x434dcc,
        'execution': _0x447a18
      });
      _0x400314["toolResults"] = [..._0x400314["toolResults"], _0x353d56];
      _0x400314["runtimeProvenance"] = deriveAgentRuntimeProvenance({
        'action': _0x434dcc,
        'execution': _0x447a18,
        'previous': _0x400314["runtimeProvenance"]
      });
      _0x400314["actionBudget"] = recordAgentLoopActionBudgetResult(_0x400314['actionBudget'], _0x434dcc, _0x447a18);
      _0x400314 = _0x3a9c14(_0x400314, _0x434dcc, _0x447a18);
      _0x447a18['ok'] === !![] && doesActionConsumePrecreatedNode(_0x434dcc, _0x400314["precreatedNode"]) && (_0x400314["precreatedNode"] = null);
      if (_0x447a18['ok']) {
        _0x400314['completedFingerprints'] = [..._0x400314["completedFingerprints"], _0x390124];
        const _0x49d925 = {
          ..._0x400314["failedFingerprints"]
        };
        delete _0x49d925[_0x390124];
        _0x400314['failedFingerprints'] = _0x49d925;
      } else {
        const _0x44ff87 = Number(_0x400314["failedFingerprints"][_0x390124] || 0x0) + 0x1;
        _0x400314["failedFingerprints"] = {
          ..._0x400314["failedFingerprints"],
          [_0x390124]: _0x44ff87
        };
        if (_0x44ff87 > 0x1) {
          return _0x320f57(_0x400314, _0x447a18['message'] || runtimeText("actionExecutionFailed", _0x2e11aa()), {
            'execution': _0x447a18
          });
        }
      }
      _0x400314['step'] += 0x1;
      sessionStore["recordTrace"]?.({
        'type': "agent_loop_tool_result",
        'step': _0x400314["step"],
        'commandId': _0x434dcc['type'],
        'ok': _0x447a18['ok'] === !![]
      });
      _0x447a18['ok'] === !![] && (sessionStore["setPendingLoopRun"]?.({
        ..._0x400314,
        'pendingKind': "interrupted"
      }), _0x5a1dd9(_0x400314["originalMessage"]));
      const _0x2b7d9d = _0x2b060a(_0x400314, {
        'taskMessages': _0x146e66
      });
      if (_0x2b7d9d) {
        return _0x2b7d9d;
      }
    }
    return _0x320f57(_0x400314, runtimeText("loopLimitReached", _0x2e11aa()));
  }
  async function _0x1e304d(_0x526150, _0x1f4abc = {}) {
    if (typeof planner !== "function") {
      return createFailedReply(runtimeText("plannerMissing", _0x2e11aa()));
    }
    const _0x4f8bf7 = String(_0x1f4abc["loopState"]?.["recoveryInstruction"] || '')["trim"]();
    const _0x49cc6c = _0x4f8bf7 ? String(_0x526150 || '') + '\x0a' + _0x4f8bf7 : _0x526150;
    const _0x5e6111 = buildContext({
      'store': _0x170bcf || _0x1944be?.["store"],
      'commandRegistry': commandRegistry,
      'sessionStore': sessionStore,
      'userMessage': _0x49cc6c,
      'intent': _0x1f4abc["intent"],
      'targetKind': _0x1f4abc["targetKind"],
      'inputRefs': _0x1f4abc["inputRefs"],
      'contextBudgetChars': _0x1f4abc['contextBudgetChars'],
      'disclosedCommandIds': _0x1f4abc['disclosedCommandIds'],
      'disclosedModelIds': _0x1f4abc["disclosedModelIds"],
      'selectedSkillIds': _0x1f4abc['selectedSkillIds'],
      ...(skillRegistry ? {
        'skillRegistry': skillRegistry
      } : {})
    });
    _0x12daf8 = _0x5e6111;
    _0x304775(_0x5e6111, _0x49cc6c, {
      'channel': 'canvas.plan'
    });
    sessionStore['recordTrace']?.({
      'type': "capability_context_routed",
      'namespaces': _0x5e6111['capabilityRouting']?.["selectedNamespaces"] || [],
      'commandIds': (_0x5e6111["commands"] || [])["map"](_0x3ef24c => _0x3ef24c['id']),
      'skillIds': (_0x5e6111["skills"] || [])["map"](_0x21b3f3 => _0x21b3f3['id']),
      'modelIds': (_0x5e6111["canvas"]?.["availableModels"] || [])["map"](_0x32948c => _0x32948c["modelId"]),
      'estimatedChars': Number(_0x5e6111["contextBudget"]?.["estimatedChars"] || 0x0),
      'schemaIntegrity': _0x5e6111["contextBudget"]?.['schemaIntegrity'] !== ![]
    });
    return planner({
      'message': _0x526150,
      'context': _0x5e6111,
      'history': sessionStore["getHistory"]?.() || [],
      'pendingClarification': sessionStore["getPendingClarification"]?.(),
      'onTrace': _0x4b8088 => sessionStore["recordTrace"]?.(_0x4b8088),
      ..._0x1f4abc
    });
  }
  async function _0x25f8f6(_0x5004f1, _0x6c68f4 = {}) {
    if (typeof assistant !== "function") {
      return null;
    }
    const _0x5bd891 = buildContext({
      'store': _0x170bcf || _0x1944be?.["store"],
      'commandRegistry': commandRegistry,
      'sessionStore': sessionStore,
      'userMessage': _0x5004f1,
      'intent': _0x6c68f4["intent"],
      'targetKind': _0x6c68f4["targetKind"],
      'inputRefs': _0x6c68f4["inputRefs"],
      'contextBudgetChars': _0x6c68f4["contextBudgetChars"],
      'selectedSkillIds': _0x6c68f4["selectedSkillIds"],
      ...(skillRegistry ? {
        'skillRegistry': skillRegistry
      } : {})
    });
    _0x12daf8 = _0x5bd891;
    _0x6c68f4["onSkillsSelected"]?.(_0x5bd891["skills"] || []);
    const _0x88cbed = _0x6c68f4['assistantChoice'] === !![] ? {
      'channel': 'assistant.message',
      'reason': "conversation-choice"
    } : routeAgentTurn({
      'message': _0x5004f1,
      'intent': _0x6c68f4["intent"],
      'clarificationAnswer': Boolean(_0x6c68f4["clarificationAnswer"]),
      'pendingPlan': Boolean(_0x6c68f4["pendingPlan"]),
      'conversationHistory': _0x6c68f4['conversationHistory'] || []
    });
    _0x304775(_0x5bd891, _0x5004f1, {
      'channel': _0x88cbed["channel"]
    });
    sessionStore["recordTrace"]?.({
      'type': "agent_turn_routed",
      'channel': _0x88cbed["channel"],
      'reason': _0x88cbed["reason"]
    });
    const _0x4aacb9 = await assistant({
      'message': _0x5004f1,
      'context': _0x5bd891,
      'history': sessionStore["getHistory"]?.() || [],
      'signal': _0x4a2895?.["signal"],
      'onTrace': _0x20eecc => sessionStore["recordTrace"]?.(_0x20eecc),
      ..._0x6c68f4
    });
    return {
      ...(typeof _0x4aacb9 === "string" ? {
        'reply': _0x4aacb9
      } : _0x4aacb9),
      'selectedSkillIds': (_0x5bd891["skills"] || [])["map"](_0x5238ce => _0x5238ce['id'])
    };
  }
  async function _0x8a19df(_0x419e0e, {
    turnId = ''
  } = {}) {
    if (!_0x33c208(turnId)) {
      return _0x1887fc();
    }
    const _0x4a8e9c = await _0x338d79(_0x419e0e["plan"]['actions'], {
      'commandContext': _0x1944be,
      'initialScope': _0x419e0e["plan"]["scope"] || _0x419e0e['plan']["aliases"] || {},
      ..._0x2744f7(turnId)
    });
    if (!_0x33c208(turnId)) {
      return {
        ..._0x1887fc(),
        'execution': _0x4a8e9c
      };
    }
    let _0x1c5edf = [];
    const _0x5c4e4b = _0x4a8e9c['ok'] ? _0x419e0e["plan"]["completionReply"] || (_0x419e0e["plan"]["preExecutedActions"]?.["length"] > 0x0 ? summarizeExecution(_0x4a8e9c, _0x2e11aa()) : _0x419e0e["plan"]["reply"] || summarizeExecution(_0x4a8e9c, _0x2e11aa())) : summarizeExecution(_0x4a8e9c, _0x2e11aa());
    const _0x377edf = _0x4a8e9c['ok'] ? {
      'recovery': null,
      'retryPlan': _0x419e0e["plan"]
    } : _0x359a49["recover"](_0x4a8e9c, _0x419e0e["plan"]);
    const {
      recovery: _0x262879,
      retryPlan: _0x55ce64
    } = _0x377edf;
    const _0x3f20a5 = _0x4a8e9c['ok'] ? null : buildAgentExecutionDiagnostic({
      'execution': _0x4a8e9c,
      'recovery': _0x262879,
      'step': sessionStore['getCurrentRun']?.()?.["step"] || 0x0,
      'locale': _0x2e11aa()
    });
    if (_0x4a8e9c['ok']) {
      sessionStore["clearPendingPlan"]?.();
      sessionStore["clearPendingRecovery"]?.();
      _0x1d9fc0();
    } else {
      _0x262879 ? (sessionStore["clearPendingPlan"]?.(), sessionStore["setPendingRecovery"]?.({
        'plan': _0x55ce64,
        'recovery': _0x262879
      }), _0x5a1dd9(_0x359a49["describe"]({
        'recovery': _0x262879
      }))) : (sessionStore["clearPendingPlan"]?.(), sessionStore["clearPendingRecovery"]?.(), _0x1d9fc0());
    }
    sessionStore["pushHistory"]?.({
      'role': 'assistant',
      'status': _0x4a8e9c['ok'] ? "success" : "failed",
      'content': _0x5c4e4b,
      'execution': _0x4a8e9c,
      'recovery': _0x262879,
      'diagnostic': _0x3f20a5
    });
    _0x1c5edf = _0x2fb448['registerExecution'](_0x4a8e9c, {
      'turnId': _0x16e0e1(turnId)
    });
    return {
      'ok': _0x4a8e9c['ok'],
      'status': _0x4a8e9c['status'],
      'reply': _0x5c4e4b,
      'plan': _0x419e0e["plan"],
      'execution': _0x4a8e9c,
      'taskMessages': _0x1c5edf,
      ...(_0x262879 ? {
        'recovery': _0x262879
      } : {}),
      ...(_0x3f20a5 ? {
        'diagnostic': _0x3f20a5
      } : {})
    };
  }
  async function _0x1a1009(_0x11ffaf, {
    turnId = ''
  } = {}) {
    if (!_0x33c208(turnId)) {
      return _0x1887fc();
    }
    const {
      prefix: _0x234278,
      pending: _0x251049
    } = _0x359a49['partition'](_0x11ffaf["plan"]);
    if (_0x234278["length"] === 0x0) {
      return {
        'ok': !![],
        'plan': _0x11ffaf["plan"],
        'preExecution': null
      };
    }
    const _0x2f7325 = await _0x338d79(_0x234278, {
      'commandContext': _0x1944be,
      ..._0x2744f7(turnId)
    });
    if (!_0x33c208(turnId)) {
      return {
        ..._0x1887fc(),
        'execution': _0x2f7325
      };
    }
    if (!_0x2f7325['ok']) {
      sessionStore["pushHistory"]?.({
        'role': "assistant",
        'status': "failed",
        'content': _0x2f7325["message"] || runtimeText("preActionsFailed", _0x2e11aa()),
        'execution': _0x2f7325
      });
      return {
        'ok': ![],
        'status': "failed",
        'reply': _0x2f7325["message"] || runtimeText("preActionsFailed", _0x2e11aa()),
        'message': _0x2f7325["message"] || runtimeText('preActionsFailed', _0x2e11aa()),
        'execution': _0x2f7325
      };
    }
    return {
      'ok': !![],
      'preExecution': _0x2f7325,
      'plan': {
        ..._0x11ffaf["plan"],
        'actions': _0x251049,
        'preExecutedActions': _0x234278,
        'scope': _0x2f7325["raw"]?.["result"]?.["aliases"] || {}
      }
    };
  }
  async function _0x147d86(_0x276d78, {
    agentContext = _0x12daf8,
    userMessage = '',
    plannerExtra = {},
    turnId = '',
    confirmationReply = '',
    completionReply = ''
  } = {}) {
    if (!_0x33c208(turnId)) {
      return _0x1887fc();
    }
    const _0x342cad = [];
    const _0xffa02f = validatePlan(_0x276d78, {
      'commandRegistry': commandRegistry,
      'commandContext': _0x1944be,
      'agentContext': agentContext,
      'userMessage': userMessage,
      'traceRecorder': _0x151604 => {
        _0x342cad["push"](_0x151604);
        sessionStore["recordTrace"]?.(_0x151604);
      }
    });
    if (!_0xffa02f['ok']) {
      sessionStore["pushHistory"]?.({
        'role': 'assistant',
        'status': "failed",
        'content': _0xffa02f["message"]
      });
      return createFailedReply(_0xffa02f["message"], {
        'validation': _0xffa02f
      });
    }
    if (_0xffa02f["status"] === "chat") {
      const _0x493ee3 = _0xffa02f['plan']["reply"] || runtimeText("chatFallback", _0x2e11aa());
      sessionStore["pushHistory"]?.({
        'role': 'assistant',
        'status': "chat",
        'content': _0x493ee3
      });
      return createChatReply(_0x493ee3, {
        'plan': _0xffa02f["plan"]
      });
    }
    if (shouldHoldCanvasActionsForChat(_0xffa02f, userMessage, plannerExtra)) {
      const _0x4b0203 = _0xffa02f["plan"]["reply"] || runtimeText("chatIntentRequired", _0x2e11aa());
      sessionStore["recordTrace"]?.({
        'type': "canvas_action_held_for_chat",
        'actionTypes': (_0xffa02f["plan"]["actions"] || [])["map"](_0x3c7026 => _0x3c7026["type"]),
        'reason': 'missing\x20explicit\x20canvas\x20action\x20intent'
      });
      sessionStore["pushHistory"]?.({
        'role': "assistant",
        'status': 'chat',
        'content': _0x4b0203
      });
      return createChatReply(_0x4b0203, {
        'plan': {
          ..._0xffa02f["plan"],
          'status': 'chat',
          'actions': [],
          'requiresConfirmation': ![]
        },
        'heldActions': _0xffa02f["plan"]["actions"]
      });
    }
    if (_0xffa02f["status"] === "need_clarification") {
      sessionStore['setPendingClarification']?.(_0xffa02f['plan']);
      sessionStore['pushHistory']?.({
        'role': "assistant",
        'status': "need_clarification",
        'content': _0xffa02f["plan"]["question"]
      });
      return {
        'ok': !![],
        'status': "need_clarification",
        'reply': _0xffa02f["plan"]["reply"] || _0xffa02f["plan"]["question"],
        'question': _0xffa02f["plan"]['question'],
        'options': _0xffa02f["plan"]['options'],
        'plan': _0xffa02f["plan"]
      };
    }
    if (_0xffa02f["status"] === "need_confirmation") {
      const _0x78ddd5 = await _0x1a1009(_0xffa02f, {
        'turnId': turnId
      });
      if (!_0x78ddd5['ok']) {
        return _0x78ddd5;
      }
      if (confirmationReply) {
        _0x78ddd5["plan"]["reply"] = confirmationReply;
      }
      if (completionReply) {
        _0x78ddd5['plan']["completionReply"] = completionReply;
      }
      _0x78ddd5["plan"] = _0x359a49["review"](_0x78ddd5["plan"], {
        'debugTrace': _0x342cad
      });
      sessionStore["setPendingPlan"]?.(_0x78ddd5["plan"]);
      _0x5a1dd9(_0x359a49["describe"]({
        'plan': _0x78ddd5["plan"]
      }));
      sessionStore["pushHistory"]?.({
        'role': "assistant",
        'status': "need_confirmation",
        'content': _0x78ddd5["plan"]["reply"]
      });
      return {
        'ok': !![],
        'status': "need_confirmation",
        'reply': _0x78ddd5["plan"]['reply'] || runtimeText("confirmFallback", _0x2e11aa()),
        'riskLevel': _0xffa02f["riskLevel"],
        'plan': _0x78ddd5["plan"],
        'preExecution': _0x78ddd5["preExecution"]
      };
    }
    return _0x8a19df(_0xffa02f, {
      'turnId': turnId
    });
  }
  async function _0x45f29f(_0x50bf2f, _0x424860 = {}) {
    const _0x149ef8 = String(_0x50bf2f || '')['trim']();
    if (!_0x149ef8) {
      return createFailedReply(runtimeText('emptyMessage', _0x2e11aa()));
    }
    _0x424860 = {
      ..._0x424860,
      'conversationHistory': sessionStore["getHistory"]?.() || []
    };
    (!hasExplicitCanvasActionIntent(_0x149ef8, _0x424860) || _0x424860["assistantChoice"] === !![]) && (_0x424860 = {
      ..._0x424860,
      'selectedSkillIds': _0x424860["selectedSkillIds"]?.["length"] ? _0x424860['selectedSkillIds'] : getAgentContinuationSkillIds(_0x149ef8, sessionStore["getHistory"]?.() || [])
    });
    const _0x33188d = _0x1fd2b2['getPendingSkillConversation']();
    const _0x240a7d = loopMode === !![] ? sessionStore["getPendingLoopRun"]?.() : null;
    if (_0x240a7d && !["clarification", 'task_wait']["includes"](String(_0x240a7d["pendingKind"] || '')) && isAgentLoopRetryMessage(_0x149ef8) && _0x32a3b1(_0x240a7d)) {
      return _0x1e429c({
        'displayMessage': _0x149ef8
      });
    }
    if (sessionStore['getPendingClarification']?.() && !_0x33188d && !_0x424860["pendingPlan"] && !_0x424860["clarificationAnswer"]) {
      return _0x5248e9(_0x149ef8, {
        ..._0x424860,
        'displayAnswer': _0x149ef8
      });
    }
    const _0xc6f62a = loopMode === !![] ? sessionStore["getPendingLoopRun"]?.() : null;
    if (_0xc6f62a?.['pendingKind'] === 'planner_retry' && isAgentLoopRetryMessage(_0x149ef8) && _0x32a3b1(_0xc6f62a)) {
      return _0x4e6115({
        'checkpoint': _0xc6f62a,
        'displayMessage': _0x149ef8
      });
    }
    if (_0xc6f62a?.['pendingKind'] === "planner_retry" && isAgentLoopRecoveryEditMessage(_0x149ef8) && _0x32a3b1(_0xc6f62a)) {
      return _0x4e6115({
        'checkpoint': _0xc6f62a,
        'displayMessage': _0x149ef8,
        'recoveryInstruction': _0x149ef8
      });
    }
    const _0x2d8121 = 'agent-run-' + ++_0x323351;
    _0x21fc2b();
    sessionStore['clearPendingPlan']?.();
    sessionStore["clearPendingRecovery"]?.();
    sessionStore['clearPendingClarification']?.();
    sessionStore["clearPendingLoopRun"]?.();
    _0x1d9fc0();
    sessionStore["setCurrentRun"]?.({
      'id': _0x2d8121,
      'status': 'planning',
      'stopped': ![]
    });
    const _0x138deb = Array['isArray'](_0x424860["documentFiles"]) && _0x424860["documentFiles"]["length"] > 0x0;
    sessionStore["pushHistory"]?.({
      'role': "user",
      'content': _0x149ef8,
      'inputRefs': Array["isArray"](_0x424860['displayInputRefs']) ? _0x424860['displayInputRefs'] : Array["isArray"](_0x424860["inputRefs"]) ? _0x424860["inputRefs"] : []
    });
    const _0x46abbe = _0x424860["assistantChoice"] === !![] ? null : await _0x1fd2b2["handleCommand"]({
      'message': _0x149ef8,
      'pendingSkillConversation': _0x33188d,
      'runId': _0x2d8121,
      'signal': _0x4a2895?.["signal"]
    });
    if (_0x46abbe) {
      return _0x46abbe;
    }
    const _0x2d5932 = _0x138deb || _0x424860["assistantChoice"] === !![] ? null : await _0x1c950f["handle"](_0x149ef8, _0x2d8121);
    if (_0x2d5932) {
      return _0x2d5932;
    }
    if (typeof assistant === "function" && (_0x138deb || _0x424860["assistantChoice"] === !![] || !hasExplicitCanvasActionIntent(_0x149ef8, _0x424860))) {
      return _0x33901e["handle"](_0x149ef8, _0x424860, _0x2d8121);
    }
    if (loopMode === !![]) {
      let _0x174828 = _0x162662({
        'runId': _0x2d8121,
        'message': _0x149ef8,
        'plannerExtra': _0x424860
      });
      _0x174828 = await _0x43bcd6["reserve"](_0x174828);
      if (!_0x33c208(_0x2d8121)) {
        return _0x1887fc();
      }
      return _0x2142f2(_0x174828);
    }
    let _0x3a16dd;
    try {
      _0x3a16dd = await _0x1e304d(_0x149ef8, {
        ..._0x424860,
        'signal': _0x4a2895?.["signal"]
      });
    } catch (_0x4c48a6) {
      if (!_0x33c208(_0x2d8121) || _0x4a2895?.["signal"]?.["aborted"]) {
        return _0x1887fc();
      }
      const _0xe94af3 = _0x4c48a6?.["message"] || runtimeText("plannerFailed", _0x2e11aa());
      sessionStore["pushHistory"]?.({
        'role': 'assistant',
        'status': "failed",
        'content': _0xe94af3
      });
      sessionStore['setCurrentRun']?.({
        'id': _0x2d8121,
        'status': "failed",
        'stopped': ![]
      });
      return createFailedReply(_0xe94af3);
    }
    if (!_0x33c208(_0x2d8121)) {
      return _0x1887fc();
    }
    const _0x309b16 = await _0x147d86(_0x3a16dd, {
      'userMessage': _0x149ef8,
      'plannerExtra': _0x424860,
      'turnId': _0x2d8121
    });
    _0x33c208(_0x2d8121) && sessionStore["setCurrentRun"]?.({
      'id': _0x2d8121,
      'status': _0x309b16["status"],
      'stopped': ![]
    });
    return _0x309b16;
  }
  async function _0x5248e9(_0x36b0b5, _0x3321ab = {}) {
    const _0x45e63d = sessionStore["getPendingClarification"]?.();
    if (!_0x45e63d) {
      return createFailedReply(runtimeText("noPendingClarification", _0x2e11aa()));
    }
    const _0x323aef = loopMode === !![] ? sessionStore['getPendingLoopRun']?.() : null;
    sessionStore['clearPendingClarification']?.();
    const _0x416f43 = String(_0x3321ab["displayAnswer"] || _0x36b0b5 || '')["trim"]();
    if (_0x323aef?.["pendingKind"] === "clarification") {
      const _0xed1035 = 'agent-run-' + ++_0x323351;
      _0x21fc2b();
      sessionStore['clearPendingLoopRun']?.();
      sessionStore["setCurrentRun"]?.({
        'id': _0xed1035,
        'status': "planning",
        'stopped': ![]
      });
      if (_0x416f43) {
        sessionStore["pushHistory"]?.({
          'role': "user",
          'content': _0x416f43
        });
      }
      return _0x2142f2({
        ..._0x323aef,
        'runId': _0xed1035,
        'pendingKind': '',
        'clarificationAnswer': String(_0x36b0b5 || _0x416f43),
        'plannerExtra': {
          ..._0x323aef["plannerExtra"],
          ..._0x3321ab,
          'clarificationAnswer': _0x36b0b5,
          'pendingPlan': _0x45e63d
        }
      });
    }
    if (loopMode === !![] && _0x45e63d["originalMessage"]) {
      const _0x599930 = "agent-run-" + ++_0x323351;
      _0x21fc2b();
      sessionStore["setCurrentRun"]?.({
        'id': _0x599930,
        'status': "planning",
        'stopped': ![]
      });
      if (_0x416f43) {
        sessionStore['pushHistory']?.({
          'role': 'user',
          'content': _0x416f43
        });
      }
      const _0x1d114e = _0x162662({
        'runId': _0x599930,
        'message': _0x45e63d['originalMessage'],
        'plannerExtra': {
          ..._0x3321ab,
          'targetKind': _0x45e63d['targetKind'] || _0x3321ab["targetKind"],
          'inputRefs': _0x45e63d["inputRefs"] || _0x3321ab["inputRefs"] || []
        }
      });
      return _0x2142f2({
        ..._0x1d114e,
        'clarificationAnswer': String(_0x36b0b5 || _0x416f43)
      });
    }
    const _0x31565c = {
      ..._0x3321ab,
      'clarificationAnswer': _0x36b0b5,
      'pendingPlan': _0x45e63d
    };
    delete _0x31565c["displayAnswer"];
    return _0x45f29f(_0x416f43, _0x31565c);
  }
  async function _0x4a82b3(_0x5d8750 = {}) {
    const _0x41727d = _0x5588b1();
    const _0x21d17a = sessionStore["getPendingPlan"]?.();
    if (!_0x21d17a) {
      return createFailedReply(runtimeText("noPendingPlan", _0x2e11aa()));
    }
    const _0x2c921e = getPlainObject(_0x5d8750["params"] || _0x5d8750);
    if (Object["keys"](_0x2c921e)["length"] === 0x0) {
      return createFailedReply(runtimeText('nodeSetParams', _0x2e11aa()));
    }
    const _0x364411 = _0x21d17a["confirmationSummary"] || _0x359a49["review"](_0x21d17a)["confirmationSummary"];
    const _0x276c37 = (Array["isArray"](_0x364411['generation']?.['nodeIds']) ? _0x364411["generation"]["nodeIds"] : [_0x364411["generation"]?.['nodeId']])["map"](_0x4f57a4 => String(_0x4f57a4 || '')["trim"]())["filter"](Boolean);
    if (_0x276c37['length'] === 0x0) {
      return createFailedReply(runtimeText("noPendingPlan", _0x2e11aa()));
    }
    const _0x4f14be = await _0x338d79(_0x276c37["map"](_0x3f97f8 => ({
      'type': 'node.setParams',
      'args': {
        'nodeId': _0x3f97f8,
        'params': _0x2c921e
      }
    })), {
      'commandContext': _0x1944be
    });
    if (_0x5588b1() !== _0x41727d || sessionStore["getPendingPlan"]?.() !== _0x21d17a) {
      return {
        ..._0x1887fc(),
        'stale': !![]
      };
    }
    if (!_0x4f14be['ok']) {
      return createFailedReply(_0x4f14be["message"] || runtimeText("actionExecutionFailed", _0x2e11aa()), {
        'execution': _0x4f14be
      });
    }
    const _0x34f78f = _0x359a49["review"](_0x21d17a, {
      'debugTraceSummary': _0x364411["debugTraceSummary"] || []
    });
    sessionStore["setPendingPlan"]?.(_0x34f78f);
    _0x5a1dd9(_0x359a49['describe']({
      'plan': _0x34f78f
    }));
    return {
      'ok': !![],
      'status': "need_confirmation",
      'reply': _0x34f78f['reply'] || runtimeText('confirmFallback', _0x2e11aa()),
      'plan': _0x34f78f,
      'execution': _0x4f14be
    };
  }
  return {
    'sessionStore': sessionStore,
    'handleUserMessage': _0x45f29f,
    'reviseAssistantTurn': _0x3edfcc => _0x33901e['revise'](_0x3edfcc),
    'selectAssistantVersion': _0x33901e["selectVersion"],
    'answerClarification': _0x5248e9,
    'getPendingAssistantChoice': _0x33901e['getPendingChoice'],
    'answerAssistantChoice': _0x33901e["answerChoice"],
    'updatePendingGenerationParams': _0x4a82b3,
    async 'confirmPendingPlan'(_0x9dc4ac = {}) {
      if (_0x2c088e) {
        return _0x2c088e;
      }
      const _0x4faa2f = loopMode === !![] ? sessionStore['getPendingLoopRun']?.() : null;
      if (_0x4faa2f?.['pendingKind'] === "confirmation") {
        const _0x154862 = _0x4faa2f["pendingValidatedPlan"];
        const _0x5618c5 = _0x154862?.['actions']?.[0x0];
        if (!_0x5618c5 || !_0x32a3b1(_0x4faa2f)) {
          sessionStore['clearPendingLoopRun']?.();
          sessionStore["clearPendingPlan"]?.();
          return createFailedReply(runtimeText('loopResumeExpired', _0x2e11aa()));
        }
        sessionStore["clearPendingLoopRun"]?.();
        sessionStore["clearPendingPlan"]?.();
        const _0x250971 = String(_0x9dc4ac['displayAnswer'] || '')["trim"]();
        _0x250971 && sessionStore["pushHistory"]?.({
          'role': "user",
          'content': _0x250971
        });
        _0x21fc2b();
        sessionStore["setCurrentRun"]?.({
          'id': _0x4faa2f['runId'],
          'status': 'executing',
          'stopped': ![],
          'step': _0x4faa2f["step"]
        });
        _0x2c088e = (async () => {
          sessionStore["recordRunEvent"]?.({
            'runId': _0x4faa2f["runId"],
            'type': 'approval.confirmed',
            'status': "executing",
            'step': _0x4faa2f["step"],
            'commandId': _0x5618c5["type"]
          });
          const _0xb86367 = await _0x338d79([_0x5618c5], {
            'commandContext': _0x1944be,
            'precreatedNode': _0x4faa2f["precreatedNode"],
            ..._0x2744f7(_0x4faa2f["runId"])
          });
          if (!_0x33c208(_0x4faa2f['runId'])) {
            return {
              ..._0x1887fc(),
              'execution': _0xb86367
            };
          }
          const {
            nextLoop: _0xea91a3,
            taskMessages: _0x5de2c1,
            recoveryCheckpoint: _0x41f225
          } = _0x1e822a(_0x4faa2f, _0x5618c5, _0xb86367, {
            'confirmed': !![]
          });
          if (!_0xb86367['ok']) {
            return _0x131a7a(_0x4faa2f, _0x5618c5, _0xb86367);
          }
          const _0x3bab2 = _0x2b060a(_0xea91a3, {
            'taskMessages': _0x5de2c1,
            'recoveryCheckpoint': _0x41f225
          });
          if (_0x3bab2) {
            return _0x3bab2;
          }
          return _0x2142f2(_0xea91a3);
        })();
        try {
          return await _0x2c088e;
        } finally {
          _0x2c088e = null;
        }
      }
      const _0x331f09 = sessionStore["getPendingPlan"]?.();
      if (!_0x331f09) {
        return createFailedReply(runtimeText('noPendingPlan', _0x2e11aa()));
      }
      sessionStore["clearPendingPlan"]?.();
      const _0x341e0b = String(_0x9dc4ac['displayAnswer'] || '')["trim"]();
      _0x341e0b && sessionStore["pushHistory"]?.({
        'role': "user",
        'content': _0x341e0b
      });
      sessionStore["recordRunEvent"]?.({
        'runId': sessionStore["getCurrentRun"]?.()?.['id'],
        'type': "approval.confirmed",
        'status': 'executing',
        'commandId': _0x331f09['actions']?.[0x0]?.["type"]
      });
      _0x2c088e = _0x8a19df({
        'ok': !![],
        'status': "ready",
        'plan': {
          ..._0x331f09,
          'status': "ready",
          'requiresConfirmation': ![]
        }
      }, {
        'turnId': _0xd50bc8("agent-confirm")
      });
      try {
        return await _0x2c088e;
      } finally {
        _0x2c088e = null;
      }
    },
    async 'retryFailedPlan'() {
      const _0x3175e2 = sessionStore['getPendingRecovery']?.();
      if (!_0x3175e2?.["plan"]) {
        return createFailedReply(runtimeText('noPendingRecovery', _0x2e11aa()));
      }
      if (_0x3175e2['loopCheckpoint'] && _0x3175e2["loopAction"]) {
        if (!_0x32a3b1(_0x3175e2['loopCheckpoint'])) {
          sessionStore["clearPendingRecovery"]?.();
          _0x1d9fc0();
          return createFailedReply(runtimeText("loopResumeExpired", _0x2e11aa()));
        }
        const _0x2dd46b = 'agent-run-' + ++_0x323351;
        const _0x36e2f1 = {
          ..._0x3175e2['loopCheckpoint'],
          'runId': _0x2dd46b,
          'pendingKind': '',
          'pendingValidatedPlan': null
        };
        const _0x1188e6 = _0x3175e2["loopAction"];
        _0x21fc2b();
        sessionStore["clearPendingRecovery"]?.();
        sessionStore['setCurrentRun']?.({
          'id': _0x2dd46b,
          'status': "executing",
          'stopped': ![],
          'step': _0x36e2f1["step"]
        });
        const _0x3927d9 = await _0x338d79([_0x1188e6], {
          'commandContext': _0x1944be,
          'initialScope': _0x3175e2["plan"]["scope"] || _0x3175e2["plan"]["aliases"] || {},
          'precreatedNode': _0x36e2f1["precreatedNode"],
          ..._0x2744f7(_0x2dd46b)
        });
        if (!_0x33c208(_0x2dd46b)) {
          return {
            ..._0x1887fc(),
            'execution': _0x3927d9
          };
        }
        const {
          nextLoop: _0x4b2d48,
          taskMessages: _0x45adf6,
          recoveryCheckpoint: _0x5c3736
        } = _0x1e822a(_0x36e2f1, _0x1188e6, _0x3927d9);
        if (!_0x3927d9['ok']) {
          return _0x131a7a(_0x36e2f1, _0x1188e6, _0x3927d9);
        }
        const _0x289d0a = _0x2b060a(_0x4b2d48, {
          'taskMessages': _0x45adf6,
          'recoveryCheckpoint': _0x5c3736
        });
        if (_0x289d0a) {
          return _0x289d0a;
        }
        return _0x2142f2(_0x4b2d48);
      }
      return _0x8a19df({
        'ok': !![],
        'status': "ready",
        'plan': {
          ..._0x3175e2["plan"],
          'status': "ready",
          'requiresConfirmation': ![]
        }
      }, {
        'turnId': _0xd50bc8("agent-retry")
      });
    },
    async 'retryPlannerRun'() {
      return _0x4e6115();
    },
    'resumeInterruptedRun': _0x1e429c,
    'discardInterruptedRun': _0x44c9dc,
    'undoLastAgentRun': _0x23fa27,
    'getInterruptedRun'() {
      const _0x4dca69 = sessionStore['getPendingLoopRun']?.();
      return _0x4dca69 && _0x32a3b1(_0x4dca69) ? _0x4dca69 : null;
    },
    'getLastUndoableRun'() {
      if (!_0x545a0b || _0x545a0b["conversationId"] !== _0x5588b1() || _0x545a0b['projectId'] !== getProjectId({
        'commandContext': _0x1944be
      })) {
        return null;
      }
      return {
        'runId': _0x545a0b['runId']
      };
    },
    'keepPreparedPlan'() {
      sessionStore["clearPendingRecovery"]?.();
      sessionStore['clearPendingPlan']?.();
      _0x1d9fc0();
      const _0x462336 = runtimeText('recoveryKept', _0x2e11aa());
      sessionStore["pushHistory"]?.({
        'role': "assistant",
        'status': 'recovery_kept',
        'content': _0x462336
      });
      return {
        'ok': !![],
        'status': "recovery_kept",
        'reply': _0x462336
      };
    },
    'cancelPendingPlan'() {
      const _0x5e2180 = sessionStore["getPendingPlan"]?.();
      const _0x29e2da = sessionStore['getCurrentRun']?.();
      sessionStore["recordRunEvent"]?.({
        'runId': _0x29e2da?.['id'],
        'type': "approval.cancelled",
        'status': 'cancelled',
        'step': _0x29e2da?.["step"],
        'commandId': _0x5e2180?.['actions']?.[0x0]?.["type"]
      });
      sessionStore["clearPendingPlan"]?.();
      sessionStore["clearPendingLoopRun"]?.();
      sessionStore['clearPendingClarification']?.();
      _0x1d9fc0();
      const _0x2d1932 = runtimeText('planCancelled', _0x2e11aa());
      sessionStore["pushHistory"]?.({
        'role': 'assistant',
        'status': 'cancelled',
        'content': _0x2d1932
      });
      return {
        'ok': !![],
        'status': 'cancelled',
        'reply': _0x2d1932
      };
    },
    'stop'() {
      const _0x1d6670 = _0x33901e["stop"]();
      const _0x3baa07 = sessionStore["stopCurrentRun"]?.();
      _0x3114a9("stopped");
      sessionStore["clearPendingLoopRun"]?.();
      sessionStore['clearPendingPlan']?.();
      sessionStore["clearPendingClarification"]?.();
      _0x1d9fc0();
      const _0x626d0e = runtimeText("runStopped", _0x2e11aa());
      _0x3baa07 && !_0x1d6670 && sessionStore["pushHistory"]?.({
        'role': "assistant",
        'status': "stopped",
        'content': _0x626d0e
      });
      return {
        'ok': !![],
        'status': "stopped",
        'reply': _0x626d0e,
        'run': _0x3baa07,
        ...(_0x1d6670?.["error"] ? {
          'notice': _0x1d6670["error"]["message"]
        } : {})
      };
    },
    'resetSession'() {
      _0x3114a9("reset");
      sessionStore["reset"]?.();
      _0x1d9fc0();
      return {
        'ok': !![],
        'status': "reset",
        'reply': runtimeText("reset", _0x2e11aa())
      };
    },
    'startNewConversation'() {
      _0x3114a9("conversation_changed");
      return sessionStore["startNewConversation"]?.() || null;
    },
    'switchConversation'(_0x4c8ebe) {
      _0x3114a9('conversation_changed');
      return sessionStore["switchConversation"]?.(_0x4c8ebe) || null;
    },
    'deleteConversation'(_0x43ad41) {
      if (String(_0x43ad41 || '')["trim"]() === sessionStore["getActiveConversation"]?.()?.['id']) {
        _0x3114a9("conversation_changed");
      }
      return sessionStore["deleteConversation"]?.(_0x43ad41) || null;
    },
    'listConversations'() {
      return sessionStore['listConversations']?.() || [];
    },
    'getActiveConversation'() {
      return sessionStore["getActiveConversation"]?.() || null;
    },
    'dispose'() {
      _0x3114a9("disposed");
      _0x2fb448?.["dispose"]?.();
    }
  };
}