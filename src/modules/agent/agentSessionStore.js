import { normalizeAgentRunEvent, replayAgentRunEvents } from './agentRunEventLog.js';
import { normalizeAgentOperation } from './agentDurableRunState.js';
import { normalizeAgentSkillUsageSnapshots } from './agentSkillUsage.js';
import { compareAgentSessionProjection, createAgentMessageSessionEvent, createAgentOperationSessionEvent, createAgentRunSessionEvent, createAgentTaskSessionEvent, projectAgentSessionEvents } from './agentSessionEventLog.js';
const DEFAULT_RECENT_COMMAND_LIMIT = 0x32;
const DEFAULT_TRACE_LIMIT = 0x50;
const DEFAULT_RUN_EVENT_LIMIT = 0xf0;
export function createAgentSessionStore({
  recentCommandLimit = DEFAULT_RECENT_COMMAND_LIMIT,
  traceLimit = DEFAULT_TRACE_LIMIT,
  runEventLimit = DEFAULT_RUN_EVENT_LIMIT,
  conversationStore = null
} = {}) {
  const _0xd997f = {
    'history': [],
    'contextDigest': null,
    'recentCommands': [],
    'debugTrace': [],
    'runEvents': [],
    'sessionEvents': [],
    'operationLedger': [],
    'taskBindings': [],
    'pendingPlan': null,
    'pendingRecovery': null,
    'pendingClarification': null,
    'pendingLoopRun': null,
    'currentRun': null
  };
  const _0x3458c1 = new Set();
  const _0x5654f1 = new Set();
  let _0x149b5a = '';
  let _0x71ff78 = '';
  let _0x325e96 = 0x0;
  function _0x846f8c(_0x4c3c7f, _0x2389e5 = null) {
    try {
      return JSON["parse"](JSON["stringify"](_0x4c3c7f));
    } catch {
      return _0x2389e5;
    }
  }
  function _0x28922f(_0x2f028c = null, {
    preserveRuntime = ![]
  } = {}) {
    _0x71ff78 = String(_0x2f028c?.["projectId"] || '');
    _0x149b5a = _0x2f028c ? _0x71ff78 + '::' + String(_0x2f028c['id'] || '') : '';
    _0xd997f['history'] = Array['isArray'](_0x2f028c?.["messages"]) ? _0x2f028c['messages']["map"](_0x1c47a5 => ({
      ..._0x1c47a5
    })) : [];
    _0xd997f['contextDigest'] = _0x2f028c?.["contextDigest"] ? _0x846f8c(_0x2f028c['contextDigest'], null) : null;
    _0xd997f["runEvents"] = Array['isArray'](_0x2f028c?.["runEvents"]) ? _0x2f028c["runEvents"]["map"](_0x153cae => ({
      ..._0x153cae
    })) : [];
    _0xd997f["sessionEvents"] = Array["isArray"](_0x2f028c?.["sessionEvents"]) ? _0x846f8c(_0x2f028c["sessionEvents"], []) : [];
    _0x325e96 = _0xd997f["sessionEvents"]["reduce"]((_0x1f024f, _0x55614e) => Math["max"](_0x1f024f, Number(_0x55614e?.["seq"] || 0x0)), 0x0);
    _0xd997f["operationLedger"] = Array["isArray"](_0x2f028c?.["operationLedger"]) ? _0x2f028c["operationLedger"]["map"](_0x43adff => ({
      ..._0x43adff
    })) : [];
    _0xd997f["taskBindings"] = Array['isArray'](_0x2f028c?.["taskBindings"]) ? _0x846f8c(_0x2f028c["taskBindings"], []) : [];
    !preserveRuntime && (_0xd997f['pendingLoopRun'] = _0x2f028c?.["resumeCheckpoint"] ? _0x846f8c(_0x2f028c['resumeCheckpoint'], null) : null, _0xd997f["pendingClarification"] = _0x2f028c?.['pendingClarification'] ? _0x846f8c(_0x2f028c["pendingClarification"], null) : null);
  }
  function _0x2827eb() {
    _0xd997f["recentCommands"] = [];
    _0xd997f["debugTrace"] = [];
    _0xd997f["taskBindings"] = [];
    _0xd997f["pendingPlan"] = null;
    _0xd997f["pendingRecovery"] = null;
    _0xd997f["pendingLoopRun"] = null;
    _0xd997f["currentRun"] = null;
  }
  function _0x490db5() {
    const _0x5c2290 = conversationStore?.["ensureActiveConversation"]?.({
      'preferLatestWithMessages': !![]
    }) || null;
    if (_0x5c2290) {
      _0x28922f(_0x5c2290);
    }
    return _0x5c2290;
  }
  function _0x1c35b4() {
    const _0x5eda64 = conversationStore?.['getActiveConversationId']?.();
    return _0x5eda64 ? conversationStore?.["getConversation"]?.(_0x5eda64) || null : null;
  }
  function _0x10d251() {
    const _0x352f9d = _0x1c35b4();
    const _0x26433b = Boolean(_0x352f9d?.["projectId"] && String(_0x352f9d['projectId']) !== _0x71ff78);
    const _0x5a87ed = _0x26433b ? conversationStore?.["ensureActiveConversation"]?.({
      'preferLatestWithMessages': !![]
    }) || null : _0x352f9d || conversationStore?.["ensureActiveConversation"]?.() || null;
    const _0x2e2d35 = _0x5a87ed ? String(_0x5a87ed["projectId"] || '') + '::' + String(_0x5a87ed['id'] || '') : '';
    _0x2e2d35 !== _0x149b5a && (_0x2827eb(), _0x28922f(_0x5a87ed));
    return _0x5a87ed;
  }
  function _0x48a7ed() {
    return _0x10d251();
  }
  function _0x59b5a8() {
    const _0x338d45 = projectAgentSessionEvents(_0xd997f['sessionEvents']);
    return {
      'history': [..._0xd997f["history"]],
      'contextDigest': _0x846f8c(_0xd997f["contextDigest"], null),
      'recentCommands': [..._0xd997f["recentCommands"]],
      'debugTrace': [..._0xd997f['debugTrace']],
      'runEvents': [..._0xd997f['runEvents']],
      'sessionEvents': _0x846f8c(_0xd997f["sessionEvents"], []),
      'sessionProjection': _0x338d45,
      'sessionProjectionParity': compareAgentSessionProjection({
        'projection': _0x338d45,
        'messages': _0xd997f["history"],
        'runEvents': _0xd997f["runEvents"],
        'operationLedger': _0xd997f["operationLedger"],
        'taskBindings': _0xd997f["taskBindings"]
      }),
      'operationLedger': _0x846f8c(_0xd997f['operationLedger'], []),
      'taskBindings': _0x846f8c(_0xd997f["taskBindings"], []),
      'pendingPlan': _0xd997f['pendingPlan'],
      'pendingRecovery': _0xd997f["pendingRecovery"],
      'pendingClarification': _0xd997f["pendingClarification"],
      'pendingLoopRun': _0xd997f["pendingLoopRun"],
      'currentRun': _0xd997f['currentRun'],
      'activeConversation': _0x48a7ed()
    };
  }
  function _0x40ab46(_0x306397 = {}) {
    const _0x48721a = _0x59b5a8();
    for (const _0x2f4991 of _0x3458c1) {
      try {
        _0x2f4991(_0x48721a, _0x306397);
      } catch {}
    }
  }
  function _0x3ba3d7(_0x3d62ea = {}) {
    _0x10d251();
    const _0x4abe25 = conversationStore?.["getActiveConversationId"]?.();
    if (!_0x4abe25) {
      return null;
    }
    const _0x1bf5f7 = conversationStore?.["updateConversation"]?.(_0x4abe25, _0x3d62ea) || null;
    _0x1bf5f7?.['sessionEvents'] && (_0xd997f['sessionEvents'] = _0x846f8c(_0x1bf5f7["sessionEvents"], []), _0x325e96 = _0xd997f["sessionEvents"]["reduce"]((_0x1b9223, _0x17bab9) => Math["max"](_0x1b9223, Number(_0x17bab9?.['seq'] || 0x0)), 0x0));
    return _0x1bf5f7;
  }
  function _0x62ae02(_0x5cf284, _0x1422c0 = {}) {
    const _0xd31807 = _0x1c35b4();
    const _0xd78356 = ++_0x325e96;
    const _0x5652fe = _0x5cf284({
      'id': (_0xd31807?.['id'] || "agent-session") + ":event:" + _0xd78356,
      'seq': _0xd78356,
      'conversationId': _0xd31807?.['id'] || "in-memory",
      'projectId': _0xd31807?.['projectId'] || '',
      ..._0x1422c0
    });
    if (!_0x5652fe) {
      return null;
    }
    _0xd997f["sessionEvents"]["push"](_0x5652fe);
    return _0x5652fe;
  }
  function _0x83cc80() {
    _0x2827eb();
    _0xd997f["runEvents"] = [];
    _0xd997f["pendingClarification"] = null;
    _0x40ab46({
      'type': "runtime_cleared"
    });
  }
  _0x490db5();
  function _0x1dc8d3(_0x2b4a22 = {}) {
    _0x10d251();
    const _0x124469 = {
      ..._0x2b4a22,
      'ts': _0x2b4a22['ts'] || Date['now']()
    };
    _0xd997f["history"]["push"](_0x124469);
    if (_0xd997f["history"]["length"] > 0x64) {
      _0xd997f["history"]['splice'](0x0, _0xd997f["history"]['length'] - 0x64);
    }
    const _0x1d1fe7 = conversationStore?.["getActiveConversationId"]?.();
    if (_0x1d1fe7) {
      const _0x2edb5c = conversationStore?.["appendMessage"]?.(_0x1d1fe7, {
        ..._0x124469,
        'turnId': String(_0x2b4a22["turnId"] || _0xd997f["currentRun"]?.['id'] || '')["trim"](),
        'itemId': String(_0x2b4a22["itemId"] || '')['trim']()
      });
      if (_0x2edb5c) {
        _0x28922f(_0x2edb5c, {
          'preserveRuntime': !![]
        });
      }
    } else {
      _0x62ae02(createAgentMessageSessionEvent, {
        'turnId': String(_0x2b4a22["turnId"] || _0xd997f['currentRun']?.['id'] || '')['trim'](),
        'itemId': String(_0x2b4a22["itemId"] || "agent-message-" + _0xd997f["history"]["length"])["trim"](),
        'message': _0x124469
      });
    }
    _0x40ab46({
      'type': "history",
      'entry': _0x124469
    });
  }
  let _0x16b25f = 0x0;
  function _0x1876bc(_0x449e14 = {}) {
    _0x10d251();
    const _0x2e8133 = _0x48a7ed();
    const _0x3c5593 = normalizeAgentRunEvent({
      ..._0x449e14,
      'id': _0x449e14['id'] || 'agent-event-' + Date["now"]()["toString"](0x24) + '-' + ++_0x16b25f,
      'conversationId': _0x449e14["conversationId"] || _0x2e8133?.['id'] || '',
      'projectId': _0x449e14["projectId"] || _0x2e8133?.['projectId'] || ''
    });
    if (!_0x3c5593) {
      return null;
    }
    _0xd997f["runEvents"]["push"](_0x3c5593);
    _0xd997f["runEvents"]["length"] > runEventLimit && _0xd997f["runEvents"]["splice"](0x0, _0xd997f["runEvents"]["length"] - runEventLimit);
    const _0x4514b0 = conversationStore?.["getActiveConversationId"]?.();
    if (_0x4514b0) {
      const _0x318748 = conversationStore?.["appendRunEvent"]?.(_0x4514b0, _0x3c5593);
      _0x318748 && (_0xd997f["runEvents"] = [...(_0x318748["runEvents"] || [])], _0xd997f['sessionEvents'] = _0x846f8c(_0x318748["sessionEvents"], []));
    } else {
      _0x62ae02(createAgentRunSessionEvent, {
        'runEvent': _0x3c5593
      });
    }
    _0x40ab46({
      'type': 'run_event',
      'event': _0x3c5593
    });
    return {
      ..._0x3c5593
    };
  }
  function _0x30a1bc(_0x1a0232 = {}) {
    const _0x27f55f = String(_0x1a0232['id'] || '')["trim"]();
    const _0x125c7e = String(_0x1a0232["nodeId"] || _0x1a0232["targetNodeId"] || '')["trim"]();
    if (!_0x27f55f || !_0x125c7e) {
      return null;
    }
    return {
      'id': _0x27f55f,
      'conversationId': String(_0x1a0232['conversationId'] || '')['trim'](),
      'turnId': String(_0x1a0232['turnId'] || '')["trim"](),
      'nodeId': _0x125c7e,
      'targetNodeId': String(_0x1a0232["targetNodeId"] || _0x125c7e)["trim"](),
      'taskId': String(_0x1a0232["taskId"] || '')["trim"](),
      'commandId': String(_0x1a0232["commandId"] || "generation.run")["trim"](),
      'status': String(_0x1a0232["status"] || '')["trim"](),
      'messageStatus': String(_0x1a0232['messageStatus'] || '')["trim"](),
      'createdAt': Number(_0x1a0232["createdAt"] || Date["now"]()) || Date['now'](),
      'updatedAt': Number(_0x1a0232['updatedAt'] || Date["now"]()) || Date["now"](),
      'notifiedTerminal': _0x1a0232["notifiedTerminal"] === !![]
    };
  }
  function _0x10af37(_0x3faa10 = {}) {
    return _0xd97a93([_0x3faa10])[0x0] || null;
  }
  function _0xd97a93(_0x691f21 = []) {
    _0x10d251();
    const _0x5bbe28 = [];
    for (const _0x55cdc2 of Array["isArray"](_0x691f21) ? _0x691f21 : []) {
      const _0x1fc63f = _0x30a1bc(_0x55cdc2);
      if (!_0x1fc63f) {
        continue;
      }
      const _0x5e2c66 = _0xd997f["taskBindings"]['findIndex'](_0x591797 => _0x591797['id'] === _0x1fc63f['id']);
      _0x5e2c66 >= 0x0 ? (_0xd997f["taskBindings"][_0x5e2c66] = {
        ..._0xd997f["taskBindings"][_0x5e2c66],
        ..._0x1fc63f,
        'updatedAt': _0x1fc63f['updatedAt'] || Date["now"]()
      }, _0x5bbe28["push"]({
        ..._0xd997f['taskBindings'][_0x5e2c66]
      })) : (_0xd997f["taskBindings"]["push"](_0x1fc63f), _0x5bbe28["push"]({
        ..._0x1fc63f
      }));
    }
    if (_0x5bbe28['length'] === 0x0) {
      return [];
    }
    const _0x372db9 = _0x3ba3d7({
      'taskBindings': _0xd997f["taskBindings"]
    });
    !_0x372db9 && _0x5bbe28['forEach'](_0x2a94ec => {
      _0x62ae02(createAgentTaskSessionEvent, {
        'taskBinding': _0x2a94ec
      });
    });
    _0x40ab46({
      'type': "task_bindings",
      'bindings': _0x5bbe28
    });
    return _0x5bbe28;
  }
  function _0x5a49f2(_0x3329fa, _0x57d28c = {}) {
    const _0x548c26 = String(_0x3329fa || '')["trim"]();
    const _0x25ffa7 = _0xd997f['taskBindings']["findIndex"](_0x12f830 => _0x12f830['id'] === _0x548c26);
    if (_0x25ffa7 < 0x0) {
      return null;
    }
    _0xd997f["taskBindings"][_0x25ffa7] = _0x30a1bc({
      ..._0xd997f['taskBindings'][_0x25ffa7],
      ..._0x57d28c,
      'id': _0x548c26,
      'updatedAt': Date["now"]()
    });
    const _0x29a09f = _0x3ba3d7({
      'taskBindings': _0xd997f['taskBindings']
    });
    !_0x29a09f && _0x62ae02(createAgentTaskSessionEvent, {
      'taskBinding': _0xd997f["taskBindings"][_0x25ffa7]
    });
    _0x40ab46({
      'type': 'task_binding',
      'binding': _0xd997f["taskBindings"][_0x25ffa7]
    });
    return {
      ..._0xd997f["taskBindings"][_0x25ffa7]
    };
  }
  return {
    'getPersistenceError': () => conversationStore?.["getPersistenceError"]?.() || '',
    'retryPersistence': () => conversationStore?.["retryPersistence"]?.() ?? !![],
    'subscribe'(_0x49f411) {
      if (typeof _0x49f411 !== "function") {
        throw new TypeError('[agentSessionStore]\x20subscribe()\x20requires\x20a\x20function');
      }
      _0x3458c1["add"](_0x49f411);
      _0x49f411(null, {
        'type': "init"
      });
      return () => _0x3458c1['delete'](_0x49f411);
    },
    'getState'() {
      _0x10d251();
      return _0x59b5a8();
    },
    'pushHistory': _0x1dc8d3,
    'subscribeAssistantStream'(_0x5ecab7) {
      _0x5654f1["add"](_0x5ecab7);
      return () => _0x5654f1["delete"](_0x5ecab7);
    },
    'isConversationLoaded'(_0x3a2e3e) {
      return _0x149b5a === _0x71ff78 + '::' + _0x3a2e3e || !_0x149b5a && !_0x3a2e3e;
    },
    'emitAssistantStream'(_0x4a3883) {
      for (const _0x27f64e of _0x5654f1) {
        try {
          _0x27f64e(_0x4a3883);
        } catch {}
      }
    },
    'replaceConversationMessages'(_0x330991, {
      conversationId = ''
    } = {}) {
      const _0x17bb43 = _0x10d251();
      if (String(_0x17bb43?.['id'] || '') !== conversationId || _0x330991["length"] !== _0xd997f["history"]["length"]) {
        return ![];
      }
      const _0x4d9ca0 = _0xd997f["history"];
      const _0x1cafe5 = _0x3ba3d7({
        'messages': _0x330991
      });
      if (_0x1cafe5) {
        _0x28922f(_0x1cafe5, {
          'preserveRuntime': !![]
        });
      } else {
        _0xd997f["history"] = _0x330991;
        _0x330991["forEach"]((_0x369bcc, _0x4281b6) => {
          if (JSON["stringify"](_0x369bcc) === JSON["stringify"](_0x4d9ca0[_0x4281b6])) {
            return;
          }
          _0x62ae02(createAgentMessageSessionEvent, {
            'itemId': _0x369bcc["itemId"] || 'agent-message-' + (_0x4281b6 + 0x1),
            'turnId': _0x369bcc["turnId"],
            'message': _0x369bcc,
            'previousMessage': _0x4d9ca0[_0x4281b6]
          });
        });
      }
      _0x40ab46({
        'type': 'history_replaced'
      });
      return !![];
    },
    'getHistory'() {
      _0x10d251();
      return [..._0xd997f["history"]];
    },
    'getContextDigest'() {
      _0x10d251();
      return _0x846f8c(_0xd997f["contextDigest"], null);
    },
    'setContextDigest'(_0x5145c5, {
      conversationId = ''
    } = {}) {
      const _0x20a66c = _0x10d251();
      const _0x4a8514 = String(_0x20a66c?.['id'] || '')["trim"]();
      const _0x2c67a9 = String(conversationId || _0x4a8514)["trim"]();
      if (!_0x2c67a9) {
        _0xd997f["contextDigest"] = _0x846f8c(_0x5145c5, null);
        _0x40ab46({
          'type': "context_digest",
          'contextDigest': _0xd997f['contextDigest']
        });
        return _0x846f8c(_0xd997f["contextDigest"], null);
      }
      const _0x48f6fa = conversationStore?.["updateConversation"]?.(_0x2c67a9, {
        'contextDigest': _0x5145c5 || null
      }) || null;
      _0x48f6fa && _0x2c67a9 === _0x4a8514 && (_0xd997f["contextDigest"] = _0x846f8c(_0x48f6fa['contextDigest'], null), _0x40ab46({
        'type': 'context_digest',
        'contextDigest': _0xd997f['contextDigest']
      }));
      return _0x846f8c(_0x48f6fa?.["contextDigest"] || null, null);
    },
    'recordCommand'(_0x126db3 = {}) {
      _0xd997f["recentCommands"]["push"]({
        'commandId': String(_0x126db3["commandId"] || ''),
        'ok': _0x126db3['result']?.['ok'] !== ![],
        'errorCode': _0x126db3["result"]?.["errorCode"] || '',
        'message': _0x126db3["result"]?.["message"] || '',
        'riskLevel': _0x126db3["riskLevel"] || '',
        'ts': _0x126db3['ts'] || Date["now"]()
      });
      _0xd997f["recentCommands"]['length'] > recentCommandLimit && _0xd997f["recentCommands"]["splice"](0x0, _0xd997f["recentCommands"]["length"] - recentCommandLimit);
    },
    'getRecentCommands'() {
      return [..._0xd997f["recentCommands"]];
    },
    'recordTrace'(_0x130fad = {}) {
      const _0x253e3d = String(_0x130fad["type"] || '')["trim"]();
      if (!_0x253e3d) {
        return;
      }
      _0xd997f["debugTrace"]["push"]({
        ..._0x130fad,
        'type': _0x253e3d,
        'ts': _0x130fad['ts'] || Date["now"]()
      });
      _0xd997f['debugTrace']['length'] > traceLimit && _0xd997f["debugTrace"]["splice"](0x0, _0xd997f['debugTrace']["length"] - traceLimit);
      if (_0x253e3d === "agent_loop_tool_result") {
        _0x1876bc({
          'runId': _0xd997f["currentRun"]?.['id'],
          'type': "tool.completed",
          'step': _0x130fad["step"],
          'commandId': _0x130fad["commandId"],
          'ok': _0x130fad['ok'],
          'confirmed': _0x130fad["confirmed"]
        });
      } else {
        if (_0x253e3d === "agent_capability_discovered") {
          _0x1876bc({
            'runId': _0xd997f["currentRun"]?.['id'],
            'type': "capability.discovered",
            'step': _0x130fad["step"],
            'commandId': _0x130fad['sourceCommandId'],
            'commandIds': _0x130fad['commandIds'],
            'modelIds': _0x130fad['modelIds']
          });
        } else {
          if (_0x253e3d === "canvas_action_held_for_chat") {
            _0x1876bc({
              'runId': _0xd997f["currentRun"]?.['id'],
              'type': "action.held",
              'message': _0x130fad["reason"]
            });
          } else {
            if (_0x253e3d === "agent_skill_context_injected") {
              const _0x324123 = String(_0xd997f["currentRun"]?.['id'] || '')["trim"]();
              if (!_0x324123) {
                return;
              }
              const _0x2a7bc4 = normalizeAgentSkillUsageSnapshots(_0x130fad["skills"]);
              const _0x529d15 = JSON["stringify"]([_0x130fad['channel'] || '', _0x2a7bc4]);
              const _0x31499f = [..._0xd997f["runEvents"]]["reverse"]()["find"](_0x503c42 => _0x503c42["type"] === "skill.injected" && _0x503c42["runId"] === _0x324123);
              const _0x427075 = _0x31499f ? JSON["stringify"]([_0x31499f["channel"] || '', _0x31499f["skillSnapshots"] || []]) : '';
              if (_0x529d15 === _0x427075) {
                return;
              }
              _0x1876bc({
                'runId': _0x324123,
                'type': "skill.injected",
                'status': "injected",
                'channel': _0x130fad["channel"],
                'skillIds': _0x130fad["skillIds"],
                'skillSnapshots': _0x2a7bc4
              });
            }
          }
        }
      }
    },
    'getDebugTrace'() {
      return [..._0xd997f["debugTrace"]];
    },
    'upsertOperation'(_0x52a79f = {}) {
      _0x10d251();
      const _0x4ffa86 = normalizeAgentOperation(_0x52a79f);
      if (!_0x4ffa86) {
        return null;
      }
      if (_0x4ffa86["conversationId"] && _0x4ffa86["conversationId"] !== _0x48a7ed()?.['id']) {
        const _0x510e4b = conversationStore?.["getConversation"]?.(_0x4ffa86["conversationId"]);
        if (!_0x510e4b || _0x4ffa86["projectId"] && _0x510e4b["projectId"] !== _0x4ffa86["projectId"]) {
          return null;
        }
        const _0x3a00c1 = _0x510e4b["operationLedger"]["findIndex"](_0x423aaf => _0x423aaf['id'] === _0x4ffa86['id']);
        if (_0x3a00c1 < 0x0) {
          return null;
        }
        _0x510e4b['operationLedger'][_0x3a00c1] = {
          ..._0x510e4b["operationLedger"][_0x3a00c1],
          ..._0x4ffa86
        };
        conversationStore["updateConversation"](_0x510e4b['id'], {
          'operationLedger': _0x510e4b["operationLedger"]
        });
        return _0x846f8c(_0x510e4b["operationLedger"][_0x3a00c1], null);
      }
      const _0xf428cf = _0xd997f["operationLedger"]["findIndex"](_0x3a98ab => _0x3a98ab['id'] === _0x4ffa86['id']);
      _0xf428cf >= 0x0 ? _0xd997f["operationLedger"][_0xf428cf] = {
        ..._0xd997f["operationLedger"][_0xf428cf],
        ..._0x4ffa86
      } : _0xd997f["operationLedger"]["push"](_0x4ffa86);
      _0xd997f['operationLedger'] = _0xd997f["operationLedger"]["slice"](-0x78);
      const _0x42fa15 = _0x3ba3d7({
        'operationLedger': _0xd997f["operationLedger"]
      });
      !_0x42fa15 && _0x62ae02(createAgentOperationSessionEvent, {
        'operation': _0xf428cf >= 0x0 ? _0xd997f['operationLedger'][_0xf428cf] : _0x4ffa86
      });
      _0x40ab46({
        'type': "operation",
        'operation': _0x4ffa86
      });
      return _0x846f8c(_0xf428cf >= 0x0 ? _0xd997f["operationLedger"][_0xf428cf] : _0x4ffa86, null);
    },
    'getOperationLedger'() {
      _0x10d251();
      return _0x846f8c(_0xd997f["operationLedger"], []);
    },
    'getSessionEvents'() {
      _0x10d251();
      return _0x846f8c(_0xd997f["sessionEvents"], []);
    },
    'getSessionProjection'() {
      _0x10d251();
      return projectAgentSessionEvents(_0xd997f["sessionEvents"]);
    },
    'getSessionProjectionParity'() {
      _0x10d251();
      return _0x59b5a8()["sessionProjectionParity"];
    },
    'recordRunEvent': _0x1876bc,
    'getRunEvents'({
      runId = ''
    } = {}) {
      _0x10d251();
      const _0x32f79c = String(runId || '')["trim"]();
      return _0xd997f["runEvents"]["filter"](_0x1519d0 => !_0x32f79c || _0x1519d0["runId"] === _0x32f79c)["map"](_0x3ad6b8 => ({
        ..._0x3ad6b8
      }));
    },
    'replayRun'(_0x22f1ff = '') {
      _0x10d251();
      return replayAgentRunEvents(_0xd997f["runEvents"], {
        'runId': _0x22f1ff
      });
    },
    'upsertTaskBinding': _0x10af37,
    'upsertTaskBindings': _0xd97a93,
    'updateTaskBinding': _0x5a49f2,
    'getTaskBindings'() {
      return _0x846f8c(_0xd997f["taskBindings"], []);
    },
    'setPendingPlan'(_0x18da8d) {
      _0xd997f["pendingPlan"] = _0x18da8d || null;
      _0x18da8d && _0x1876bc({
        'runId': _0xd997f["currentRun"]?.['id'],
        'type': 'approval.requested',
        'status': 'need_confirmation'
      });
    },
    'getPendingPlan'() {
      return _0xd997f["pendingPlan"];
    },
    'clearPendingPlan'() {
      _0xd997f["pendingPlan"] = null;
    },
    'setPendingRecovery'(_0x549e6e) {
      _0xd997f['pendingRecovery'] = _0x549e6e || null;
    },
    'getPendingRecovery'() {
      return _0xd997f["pendingRecovery"];
    },
    'clearPendingRecovery'() {
      _0xd997f["pendingRecovery"] = null;
    },
    'setPendingClarification'(_0x56000a) {
      _0x10d251();
      _0xd997f["pendingClarification"] = _0x56000a || null;
      _0x3ba3d7({
        'pendingClarification': _0x56000a || null
      });
    },
    'getPendingClarification'() {
      _0x10d251();
      return _0xd997f['pendingClarification'];
    },
    'clearPendingClarification'() {
      _0x10d251();
      _0xd997f["pendingClarification"] = null;
      _0x3ba3d7({
        'pendingClarification': null
      });
    },
    'setPendingLoopRun'(_0x3a4245) {
      _0x10d251();
      _0xd997f["pendingLoopRun"] = _0x3a4245 || null;
      _0x3ba3d7({
        'resumeCheckpoint': _0x3a4245 || null
      });
    },
    'getPendingLoopRun'() {
      _0x10d251();
      return _0xd997f["pendingLoopRun"];
    },
    'clearPendingLoopRun'() {
      _0x10d251();
      _0xd997f['pendingLoopRun'] = null;
      _0x3ba3d7({
        'resumeCheckpoint': null
      });
    },
    'setCurrentRun'(_0x4aa69d) {
      _0xd997f["currentRun"] = _0x4aa69d || null;
      _0x4aa69d && _0x1876bc({
        'runId': _0x4aa69d['id'],
        'type': 'run.status',
        'status': _0x4aa69d['status'],
        'step': _0x4aa69d["step"]
      });
    },
    'getCurrentRun'() {
      return _0xd997f["currentRun"];
    },
    'stopCurrentRun'() {
      _0xd997f["currentRun"] && (_0xd997f["currentRun"] = {
        ..._0xd997f["currentRun"],
        'stopped': !![],
        'status': "stopped"
      });
      _0xd997f["currentRun"] && _0x1876bc({
        'runId': _0xd997f["currentRun"]['id'],
        'type': "run.status",
        'status': "stopped",
        'step': _0xd997f["currentRun"]['step']
      });
      return _0xd997f['currentRun'];
    },
    'updateActiveConversation': _0x3ba3d7,
    'markUnfinishedOperation'({
      lastPlanSummary = '',
      lastCanvasSnapshotDigest = null
    } = {}) {
      return _0x3ba3d7({
        'hasUnfinishedOperation': !![],
        'lastPlanSummary': lastPlanSummary,
        'lastCanvasSnapshotDigest': lastCanvasSnapshotDigest
      });
    },
    'clearUnfinishedOperation'() {
      return _0x3ba3d7({
        'hasUnfinishedOperation': ![],
        'lastPlanSummary': ''
      });
    },
    'getActiveConversation': _0x48a7ed,
    'listConversations'() {
      return conversationStore?.["listConversations"]?.() || [];
    },
    'startNewConversation'() {
      _0x83cc80();
      const _0x3338a5 = conversationStore?.['createConversation']?.() || null;
      _0x28922f(_0x3338a5);
      return _0x3338a5;
    },
    'switchConversation'(_0x4c1e95) {
      const _0x5b4797 = conversationStore?.["setActiveConversationId"]?.(_0x4c1e95);
      if (!_0x5b4797) {
        return null;
      }
      _0x83cc80();
      _0x28922f(_0x5b4797);
      return _0x5b4797;
    },
    'deleteConversation'(_0x36e33a) {
      if (String(_0x36e33a || '')["trim"]() !== _0x48a7ed()?.['id']) {
        return conversationStore?.["deleteConversation"]?.(_0x36e33a) || null;
      }
      _0x83cc80();
      const _0x1a55e0 = conversationStore?.['deleteConversation']?.(_0x36e33a) || null;
      _0x28922f(_0x1a55e0);
      return _0x1a55e0;
    },
    'reset'() {
      _0x83cc80();
    }
  };
}