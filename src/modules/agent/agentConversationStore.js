import { normalizeAgentRunEvent } from './agentRunEventLog.js';
import { normalizeAgentReplyVersions } from './agentReplyVersions.js';
import { normalizeAgentOperationLedger, normalizeAgentResumeCheckpoint, normalizeAgentTaskBindings } from './agentDurableRunState.js';
import { createAgentMessageSessionEvent, createAgentOperationSessionEvent, createAgentRunSessionEvent, createAgentSessionEventsFromLegacyState, createAgentTaskSessionEvent, normalizeAgentSessionEvent } from './agentSessionEventLog.js';
import { normalizeAgentContextDigest } from './agentContextDigest.js';
import { normalizeAgentAssistantContext } from './agentAssistantConversation.js';
import { AGENT_MESSAGE_CONTENT_LIMIT, compactAgentConversationText } from './agentConversationText.js';
export const AGENT_CONVERSATION_STORAGE_KEY = "aiCanvas.agentConversations.v1";
const AGENT_CONVERSATION_SCHEMA_VERSION = 0x2;
const DEFAULT_PROJECT_ID = 'default_v2_project';
const DEFAULT_CONVERSATION_TITLE = "新对话";
const MAX_MESSAGE_CONTENT_CHARS = AGENT_MESSAGE_CONTENT_LIMIT;
const MAX_TITLE_CHARS = 0x28;
const MAX_SUMMARY_CHARS = 0xf0;
const MAX_MEDIA_URL_CHARS = 0x7d0;
const MAX_MEDIA_NAME_CHARS = 0x78;
const MAX_MEDIA_ITEMS = 0xc;
const MAX_RUN_EVENTS = 0x78;
const MAX_PENDING_ORIGINAL_MESSAGE_CHARS = 0xfa0;
const MAX_PENDING_QUESTION_CHARS = 0x4b0;
const MAX_PENDING_OPTIONS = 0xc;
const MAX_PENDING_INPUT_REFS = 0xc;
const MAX_MESSAGE_INPUT_REFS = 0xc;
const MAX_DIAGNOSTIC_TEXT_CHARS = 0x168;
const MESSAGE_TYPES = new Set(['text', "task_status", "task_result"]);
function getWindowObject(_0x55f98b) {
  if (_0x55f98b) {
    return _0x55f98b;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  return null;
}
function normalizeProjectId(_0x43e153) {
  return String(_0x43e153 || '')["trim"]() || DEFAULT_PROJECT_ID;
}
function normalizeTimestamp(_0x46f433, _0x141df2) {
  const _0x369347 = Number(_0x46f433);
  return Number["isFinite"](_0x369347) && _0x369347 > 0x0 ? _0x369347 : _0x141df2;
}
function normalizeBoolean(_0x5a448d) {
  return _0x5a448d === !![];
}
function normalizeMessageType(_0x132bd9) {
  const _0x249dfa = String(_0x132bd9 || "text")["trim"]();
  return MESSAGE_TYPES['has'](_0x249dfa) ? _0x249dfa : "text";
}
function stripText(_0x51d288) {
  return String(_0x51d288 || '')['replace'](/\s+/g, '\x20')["trim"]();
}
function truncateText(_0x195245, _0x3abe99) {
  const _0x30abcb = stripText(_0x195245);
  if (_0x30abcb['length'] <= _0x3abe99) {
    return _0x30abcb;
  }
  return _0x30abcb["slice"](0x0, Math['max'](0x0, _0x3abe99 - 0x3)) + "...";
}
function truncateMessageContent(_0x15e6b2, _0x43e298) {
  const _0x101fe7 = String(_0x15e6b2 || '')["replace"](/\r\n?/g, '\x0a')["trim"]();
  return compactAgentConversationText(_0x101fe7, _0x43e298);
}
function cloneJson(_0x509db4) {
  try {
    return JSON["parse"](JSON["stringify"](_0x509db4));
  } catch {
    return null;
  }
}
function normalizeTaskMediaText(_0x2c9d06 = '', _0x2998c9 = MAX_MEDIA_URL_CHARS) {
  const _0x5b3549 = String(_0x2c9d06 || '')["trim"]();
  if (!_0x5b3549 || /^data:/i["test"](_0x5b3549)) {
    return '';
  }
  if (_0x5b3549["length"] <= _0x2998c9) {
    return _0x5b3549;
  }
  return _0x5b3549["slice"](0x0, _0x2998c9);
}
function normalizeTaskMediaItem(_0x189d4c = {}, _0x105217 = '') {
  if (!_0x189d4c || typeof _0x189d4c !== "object" || Array['isArray'](_0x189d4c)) {
    return null;
  }
  const _0x39483f = normalizeTaskMediaText(_0x189d4c['url']);
  const _0x5d5a7c = normalizeTaskMediaText(_0x189d4c['thumbUrl']);
  if (!_0x39483f && !_0x5d5a7c) {
    return null;
  }
  const _0x123ca7 = {
    'url': _0x39483f || _0x5d5a7c,
    'thumbUrl': _0x5d5a7c || _0x39483f
  };
  const _0x2c5206 = normalizeTaskMediaText(_0x189d4c["name"] || _0x105217, MAX_MEDIA_NAME_CHARS);
  if (_0x2c5206) {
    _0x123ca7["name"] = _0x2c5206;
  }
  return _0x123ca7;
}
function normalizeTaskMedia(_0x312941 = {}) {
  if (!_0x312941 || typeof _0x312941 !== 'object' || Array["isArray"](_0x312941)) {
    return null;
  }
  const _0x45882e = String(_0x312941["kind"] || '')["trim"]();
  if (_0x45882e !== "image") {
    return null;
  }
  const _0x188192 = normalizeTaskMediaText(_0x312941["name"], MAX_MEDIA_NAME_CHARS);
  const _0xbca6ce = (Array["isArray"](_0x312941["items"]) ? _0x312941["items"] : [])["map"](_0x22b187 => normalizeTaskMediaItem(_0x22b187, _0x188192))["filter"](Boolean)["slice"](0x0, MAX_MEDIA_ITEMS);
  const _0x274b1e = normalizeTaskMediaItem(_0x312941, _0x188192);
  const _0x1d363d = _0xbca6ce["length"] > 0x0 ? _0xbca6ce : _0x274b1e ? [_0x274b1e] : [];
  if (_0x1d363d['length'] === 0x0) {
    return null;
  }
  const _0x45599c = _0x1d363d[0x0];
  const _0x42ea0b = {
    'kind': 'image'
  };
  _0x42ea0b["url"] = _0x45599c["url"];
  _0x42ea0b["thumbUrl"] = _0x45599c["thumbUrl"];
  if (_0x188192) {
    _0x42ea0b["name"] = _0x188192;
  }
  (_0x1d363d['length'] > 0x1 || Array["isArray"](_0x312941["items"])) && (_0x42ea0b["items"] = _0x1d363d);
  return _0x42ea0b;
}
function normalizeTaskSummary(_0x573224 = {}) {
  if (!_0x573224 || typeof _0x573224 !== 'object' || Array["isArray"](_0x573224)) {
    return null;
  }
  const _0x116dc7 = String(_0x573224["nodeId"] || _0x573224["targetNodeId"] || '')["trim"]();
  if (!_0x116dc7) {
    return null;
  }
  const _0x364eec = {
    'nodeId': _0x116dc7,
    'taskId': String(_0x573224['taskId'] || '')["trim"](),
    'commandId': String(_0x573224["commandId"] || 'generation.run')['trim'](),
    'status': String(_0x573224["status"] || '')['trim'](),
    'resultKind': String(_0x573224["resultKind"] || _0x573224["kind"] || '')["trim"]()
  };
  const _0x222880 = normalizeTaskMedia(_0x573224['media']);
  if (_0x222880) {
    _0x364eec["media"] = _0x222880;
  }
  return _0x364eec;
}
function normalizePendingInputRef(_0x2cd4c1 = {}) {
  if (!_0x2cd4c1 || typeof _0x2cd4c1 !== "object" || Array["isArray"](_0x2cd4c1)) {
    return null;
  }
  const _0x2c88ac = String(_0x2cd4c1["nodeId"] || _0x2cd4c1['id'] || '')['trim']();
  if (!_0x2c88ac) {
    return null;
  }
  const _0x322443 = {
    'nodeId': _0x2c88ac,
    'type': String(_0x2cd4c1["type"] || '')["trim"](),
    'kind': String(_0x2cd4c1["kind"] || '')["trim"](),
    'name': truncateText(_0x2cd4c1["name"] || '', MAX_MEDIA_NAME_CHARS),
    'label': truncateText(_0x2cd4c1["label"] || _0x2cd4c1["name"] || '', MAX_MEDIA_NAME_CHARS),
    'source': String(_0x2cd4c1["source"] || '')['trim']()
  };
  const _0x28fa01 = normalizeTaskMediaText(_0x2cd4c1["thumbUrl"]);
  if (_0x28fa01) {
    _0x322443["thumbUrl"] = _0x28fa01;
  }
  return _0x322443;
}
function normalizeMessageInputRef(_0x4aab7b = {}) {
  if (!_0x4aab7b || typeof _0x4aab7b !== "object" || Array['isArray'](_0x4aab7b)) {
    return null;
  }
  const _0x3dfafc = String(_0x4aab7b['nodeId'] || _0x4aab7b['id'] || '')["trim"]();
  if (!_0x3dfafc) {
    return null;
  }
  const _0x28e537 = {
    'nodeId': _0x3dfafc,
    'type': String(_0x4aab7b["type"] || '')["trim"](),
    'kind': String(_0x4aab7b["kind"] || '')['trim'](),
    'name': truncateText(_0x4aab7b["name"] || '', MAX_MEDIA_NAME_CHARS),
    'label': truncateText(_0x4aab7b["label"] || _0x4aab7b["name"] || '', MAX_MEDIA_NAME_CHARS),
    'source': String(_0x4aab7b["source"] || '')["trim"]()
  };
  const _0x4a02d4 = normalizeTaskMediaText(_0x4aab7b["thumbUrl"]);
  if (_0x4a02d4) {
    _0x28e537["thumbUrl"] = _0x4a02d4;
  }
  return _0x28e537;
}
function normalizePendingClarification(_0x502963 = {}) {
  if (!_0x502963 || typeof _0x502963 !== "object" || Array["isArray"](_0x502963)) {
    return null;
  }
  const _0x1e5475 = truncateText(_0x502963['originalMessage'] || '', MAX_PENDING_ORIGINAL_MESSAGE_CHARS);
  const _0x34a93b = truncateText(_0x502963["question"] || _0x502963['reply'] || '', MAX_PENDING_QUESTION_CHARS);
  if (!_0x1e5475 || !_0x34a93b) {
    return null;
  }
  return {
    'originalMessage': _0x1e5475,
    'question': _0x34a93b,
    'reply': truncateText(_0x502963["reply"] || _0x34a93b, MAX_PENDING_QUESTION_CHARS),
    'options': (Array["isArray"](_0x502963["options"]) ? _0x502963["options"] : [])['map'](_0x3f4ec7 => ({
      'id': String(_0x3f4ec7?.['id'] || '')["trim"](),
      'label': truncateText(_0x3f4ec7?.["label"] || _0x3f4ec7?.['id'] || '', MAX_TITLE_CHARS)
    }))["filter"](_0x2da43d => _0x2da43d['id'] && _0x2da43d['label'])['slice'](0x0, MAX_PENDING_OPTIONS),
    'targetKind': String(_0x502963['targetKind'] || '')["trim"](),
    'operation': String(_0x502963["operation"] || '')["trim"]()["slice"](0x0, 0x28),
    'skillId': String(_0x502963["skillId"] || '')["trim"]()["slice"](0x0, 0x40),
    'phase': String(_0x502963['phase'] || '')["trim"]()["slice"](0x0, 0x3c),
    'inputRefs': (Array["isArray"](_0x502963["inputRefs"]) ? _0x502963['inputRefs'] : [])["map"](normalizePendingInputRef)["filter"](Boolean)["slice"](0x0, MAX_PENDING_INPUT_REFS)
  };
}
function normalizeFailureDiagnostic(_0x472fe5 = {}) {
  if (!_0x472fe5 || typeof _0x472fe5 !== 'object' || Array["isArray"](_0x472fe5)) {
    return null;
  }
  const _0x5b460a = String(_0x472fe5['phase'] || '')["trim"]();
  const _0x46c5e1 = truncateText(_0x472fe5["summary"] || '', MAX_DIAGNOSTIC_TEXT_CHARS);
  if (!_0x5b460a || !_0x46c5e1) {
    return null;
  }
  const _0x34d1dc = {
    'phase': _0x5b460a,
    'phaseLabel': truncateText(_0x472fe5["phaseLabel"] || _0x5b460a, MAX_TITLE_CHARS),
    'summary': _0x46c5e1,
    'detail': truncateText(_0x472fe5["detail"] || '', MAX_DIAGNOSTIC_TEXT_CHARS),
    'errorCode': String(_0x472fe5["errorCode"] || '')['trim']()["slice"](0x0, 0x50),
    'step': Math["max"](0x1, Math["trunc"](Number(_0x472fe5["step"] || 0x1))),
    'completedSteps': Math["max"](0x0, Math['trunc'](Number(_0x472fe5['completedSteps'] || 0x0))),
    'retryable': _0x472fe5['retryable'] === !![]
  };
  const _0x221bed = String(_0x472fe5["sourceErrorCode"] || '')["trim"]()["slice"](0x0, 0x50);
  const _0x20e69d = String(_0x472fe5["commandId"] || '')["trim"]()["slice"](0x0, 0x78);
  if (_0x221bed) {
    _0x34d1dc["sourceErrorCode"] = _0x221bed;
  }
  if (_0x20e69d) {
    _0x34d1dc["commandId"] = _0x20e69d;
  }
  return _0x34d1dc;
}
function createDefaultId(_0x4f191c) {
  return "agent-conv-" + Number(_0x4f191c || Date["now"]())['toString'](0x24) + '-' + Math["random"]()['toString'](0x24)["slice"](0x2, 0x8);
}
function normalizeMessage(_0xfed77d = {}, _0x1f25c6 = Date["now"]()) {
  const _0x283849 = String(_0xfed77d["role"] || 'assistant')["trim"]() || "assistant";
  const _0x2ebd50 = truncateMessageContent(_0xfed77d["content"] || _0xfed77d['reply'] || _0xfed77d["message"] || _0xfed77d["question"] || '', MAX_MESSAGE_CONTENT_CHARS);
  const _0x58a964 = String(_0xfed77d["status"] || '')["trim"]();
  const _0x2280c3 = normalizeTimestamp(_0xfed77d['ts'], _0x1f25c6);
  if (!_0x2ebd50 && !_0x58a964) {
    return null;
  }
  const _0xc9211d = normalizeMessageType(_0xfed77d["messageType"] || _0xfed77d["type"]);
  const _0x9d427b = {
    'role': _0x283849,
    'content': _0x2ebd50,
    'status': _0x58a964,
    'ts': _0x2280c3
  };
  const _0x39f042 = String(_0xfed77d["itemId"] || '')["trim"]();
  const _0x195625 = String(_0xfed77d["turnId"] || '')["trim"]();
  if (_0x39f042) {
    _0x9d427b["itemId"] = _0x39f042;
  }
  if (_0x195625) {
    _0x9d427b["turnId"] = _0x195625;
  }
  if (_0x283849 === "user") {
    const _0x93a7ad = (Array["isArray"](_0xfed77d["inputRefs"]) ? _0xfed77d["inputRefs"] : [])["map"](normalizeMessageInputRef)['filter'](Boolean)["slice"](0x0, MAX_MESSAGE_INPUT_REFS);
    if (_0x93a7ad["length"] > 0x0) {
      _0x9d427b['inputRefs'] = _0x93a7ad;
    }
  }
  if (_0x283849 === "assistant") {
    const _0x4d3dc0 = normalizeAgentAssistantContext(_0xfed77d["assistantContext"]);
    if (_0x4d3dc0) {
      _0x9d427b["assistantContext"] = _0x4d3dc0;
    }
    const _0x385be1 = normalizeAgentReplyVersions(_0xfed77d["replyVersions"]);
    if (_0x385be1) {
      _0x9d427b["replyVersions"] = _0x385be1;
    }
    const _0x232316 = normalizeFailureDiagnostic(_0xfed77d["diagnostic"]);
    if (_0x232316) {
      _0x9d427b["diagnostic"] = _0x232316;
    }
  }
  if (_0xc9211d !== "text") {
    _0x9d427b["messageType"] = _0xc9211d;
    const _0x575d13 = normalizeTaskSummary(_0xfed77d['task'] || _0xfed77d["taskBinding"]);
    if (_0x575d13) {
      _0x9d427b["task"] = _0x575d13;
    }
  }
  return _0x9d427b;
}
function inferLegacyPendingClarification(_0x5cf56e = []) {
  for (let _0x358b5f = _0x5cf56e["length"] - 0x1; _0x358b5f >= 0x0; _0x358b5f -= 0x1) {
    const _0x3fe92f = _0x5cf56e[_0x358b5f];
    if (_0x3fe92f?.["role"] !== "assistant" || _0x3fe92f?.["status"] !== 'need_clarification' || !_0x3fe92f?.['content']) {
      continue;
    }
    const _0x546bda = _0x5cf56e["slice"](_0x358b5f + 0x1)['some'](_0x3ae4fb => _0x3ae4fb?.['role'] === "assistant" && ["success", "chat", "need_confirmation", "cancelled", "stopped"]["includes"](String(_0x3ae4fb?.["status"] || '')));
    if (_0x546bda) {
      return null;
    }
    for (let _0x555075 = _0x358b5f - 0x1; _0x555075 >= 0x0; _0x555075 -= 0x1) {
      const _0x47a72e = _0x5cf56e[_0x555075];
      if (_0x47a72e?.["role"] !== "user" || !_0x47a72e?.["content"]) {
        continue;
      }
      return normalizePendingClarification({
        'originalMessage': _0x47a72e["content"],
        'question': _0x3fe92f["content"],
        'reply': _0x3fe92f["content"]
      });
    }
    return null;
  }
  return null;
}
function createTitleFromMessage(_0x46ecad = {}) {
  if (String(_0x46ecad['role'] || '') !== 'user') {
    return '';
  }
  return truncateText(_0x46ecad['content'], MAX_TITLE_CHARS);
}
function normalizeConversation(_0x45f61b = {}, _0x42b249 = Date["now"]()) {
  const _0x1188a9 = String(_0x45f61b['id'] || '')['trim']();
  if (!_0x1188a9) {
    return null;
  }
  const _0x1d04ac = normalizeProjectId(_0x45f61b['projectId']);
  const _0x19ef6c = normalizeTimestamp(_0x45f61b["createdAt"], _0x42b249);
  const _0x328653 = normalizeTimestamp(_0x45f61b['updatedAt'], _0x19ef6c);
  const _0x38e8e1 = Array['isArray'](_0x45f61b['messages']) ? _0x45f61b["messages"]["map"]((_0x2efecf, _0x5a6196) => normalizeMessage({
    ..._0x2efecf,
    'itemId': String(_0x2efecf?.["itemId"] || '')["trim"]() || _0x1188a9 + ":message:" + (_0x5a6196 + 0x1)
  }, _0x328653))["filter"](Boolean) : [];
  const _0x202e71 = Array['isArray'](_0x45f61b["runEvents"]) ? _0x45f61b["runEvents"]["map"](_0x3040ba => normalizeAgentRunEvent(_0x3040ba, _0x328653))['filter'](Boolean)["slice"](-MAX_RUN_EVENTS) : [];
  const _0x381bf3 = normalizeAgentOperationLedger(_0x45f61b["operationLedger"], _0x328653);
  const _0xc04540 = normalizeAgentTaskBindings(_0x45f61b["taskBindings"]);
  const _0x3eac56 = Array["isArray"](_0x45f61b["sessionEvents"]) ? _0x45f61b["sessionEvents"]["map"]((_0x369ed2, _0x4f465d) => normalizeAgentSessionEvent(_0x369ed2, {
    'fallbackTs': _0x328653,
    'fallbackSeq': _0x4f465d + 0x1
  }))["filter"](Boolean) : [];
  const _0xe51854 = _0x3eac56["length"] > 0x0 ? _0x3eac56 : createAgentSessionEventsFromLegacyState({
    'conversationId': _0x1188a9,
    'projectId': _0x1d04ac,
    'messages': _0x38e8e1,
    'runEvents': _0x202e71,
    'operationLedger': _0x381bf3,
    'taskBindings': _0xc04540
  });
  const _0x4b301d = Object["prototype"]["hasOwnProperty"]["call"](_0x45f61b, "pendingClarification");
  return {
    'id': _0x1188a9,
    'projectId': _0x1d04ac,
    'title': truncateText(_0x45f61b["title"] || DEFAULT_CONVERSATION_TITLE, MAX_TITLE_CHARS) || DEFAULT_CONVERSATION_TITLE,
    'createdAt': _0x19ef6c,
    'updatedAt': _0x328653,
    'messages': _0x38e8e1,
    'runEvents': _0x202e71,
    'operationLedger': _0x381bf3,
    'taskBindings': _0xc04540,
    'sessionEvents': _0xe51854,
    'resumeCheckpoint': normalizeAgentResumeCheckpoint(_0x45f61b['resumeCheckpoint']),
    'pendingClarification': _0x4b301d ? normalizePendingClarification(_0x45f61b["pendingClarification"]) : inferLegacyPendingClarification(_0x38e8e1),
    'contextDigest': normalizeAgentContextDigest(_0x45f61b["contextDigest"]),
    'lastPlanSummary': truncateText(_0x45f61b["lastPlanSummary"] || '', MAX_SUMMARY_CHARS),
    'lastCanvasSnapshotDigest': _0x45f61b["lastCanvasSnapshotDigest"] && typeof _0x45f61b["lastCanvasSnapshotDigest"] === "object" ? cloneJson(_0x45f61b["lastCanvasSnapshotDigest"]) || null : null,
    'hasUnfinishedOperation': normalizeBoolean(_0x45f61b["hasUnfinishedOperation"]),
    'archived': normalizeBoolean(_0x45f61b['archived'])
  };
}
function normalizeStorageState(_0x534835 = {}, _0x5c1fd4 = Date["now"]()) {
  const _0x4eaa51 = _0x534835["activeByProjectId"] && typeof _0x534835['activeByProjectId'] === "object" ? Object["fromEntries"](Object['entries'](_0x534835["activeByProjectId"])['map'](([_0x18af6d, _0x13c43c]) => [normalizeProjectId(_0x18af6d), String(_0x13c43c || '')["trim"]()])["filter"](([, _0xd6304a]) => _0xd6304a)) : {};
  const _0x5aa172 = Array["isArray"](_0x534835["conversations"]) ? _0x534835["conversations"]['map'](_0x14891e => normalizeConversation(_0x14891e, _0x5c1fd4))["filter"](Boolean) : [];
  return {
    'schemaVersion': AGENT_CONVERSATION_SCHEMA_VERSION,
    'activeByProjectId': _0x4eaa51,
    'conversations': _0x5aa172
  };
}
function getNextSessionEventSequence(_0x297a4a = []) {
  return (Array['isArray'](_0x297a4a) ? _0x297a4a : [])["reduce"]((_0x1956a7, _0x4907b6) => Math["max"](_0x1956a7, Number(_0x4907b6?.["seq"] || 0x0)), 0x0) + 0x1;
}
function appendSessionEventSnapshot(_0x21e56b, _0x446840, _0x11b93d = {}, _0x4371ec = Date["now"]()) {
  const _0x346670 = Array["isArray"](_0x21e56b?.["sessionEvents"]) ? _0x21e56b['sessionEvents'] : [];
  const _0x252288 = getNextSessionEventSequence(_0x346670);
  const _0x59f096 = _0x446840({
    'id': _0x21e56b['id'] + ":event:" + _0x252288,
    'seq': _0x252288,
    'conversationId': _0x21e56b['id'],
    'projectId': _0x21e56b["projectId"],
    ..._0x11b93d
  });
  if (!_0x59f096) {
    return _0x346670;
  }
  return [..._0x346670, {
    ..._0x59f096,
    'ts': _0x59f096['ts'] || _0x4371ec
  }];
}
function appendChangedDurableStateEvents(_0x38b8de, _0x83b56d, _0x59826a = {}, _0x531bd6 = Date["now"]()) {
  let _0x4dcf3e = Array["isArray"](_0x38b8de["sessionEvents"]) ? _0x38b8de["sessionEvents"] : [];
  const _0xc9b15c = (_0x5e80b6, _0x217286) => {
    _0x4dcf3e = appendSessionEventSnapshot({
      ..._0x38b8de,
      'sessionEvents': _0x4dcf3e
    }, _0x5e80b6, _0x217286, _0x531bd6);
  };
  if (Array['isArray'](_0x59826a["messages"])) {
    const _0x566164 = new Map(_0x38b8de["messages"]['map'](_0x588e74 => [_0x588e74['itemId'], _0x588e74]));
    for (const _0x5f2038 of _0x83b56d['messages']) {
      if (JSON["stringify"](_0x566164['get'](_0x5f2038["itemId"])) === JSON["stringify"](_0x5f2038)) {
        continue;
      }
      _0xc9b15c(createAgentMessageSessionEvent, {
        'itemId': _0x5f2038["itemId"],
        'turnId': _0x5f2038['turnId'],
        'message': _0x5f2038,
        'previousMessage': _0x566164["get"](_0x5f2038['itemId'])
      });
    }
  }
  if (Array["isArray"](_0x59826a["operationLedger"])) {
    const _0x35cdd8 = new Map((_0x38b8de["operationLedger"] || [])["map"](_0x4079f2 => [_0x4079f2['id'], _0x4079f2]));
    for (const _0x28147b of _0x83b56d['operationLedger'] || []) {
      if (JSON['stringify'](_0x35cdd8["get"](_0x28147b['id']) || null) === JSON["stringify"](_0x28147b)) {
        continue;
      }
      _0xc9b15c(createAgentOperationSessionEvent, {
        'operation': _0x28147b
      });
    }
  }
  if (Array["isArray"](_0x59826a["taskBindings"])) {
    const _0xb01c48 = new Map((_0x38b8de["taskBindings"] || [])['map'](_0x43d158 => [_0x43d158['id'], _0x43d158]));
    for (const _0x1e6f51 of _0x83b56d['taskBindings'] || []) {
      if (JSON["stringify"](_0xb01c48["get"](_0x1e6f51['id']) || null) === JSON['stringify'](_0x1e6f51)) {
        continue;
      }
      _0xc9b15c(createAgentTaskSessionEvent, {
        'taskBinding': _0x1e6f51
      });
    }
  }
  return _0x4dcf3e;
}
function sortConversations(_0x5bd0b6 = []) {
  return [..._0x5bd0b6]["sort"]((_0x5b94cb, _0x4cf395) => Number(_0x4cf395["updatedAt"] || 0x0) - Number(_0x5b94cb['updatedAt'] || 0x0));
}
function hasMessages(_0x2b76ec = {}) {
  return Array['isArray'](_0x2b76ec["messages"]) && _0x2b76ec['messages']["length"] > 0x0;
}
function findLatestConversationWithMessages(_0x59c7cc = []) {
  return _0x59c7cc["find"](_0x43bd9b => hasMessages(_0x43bd9b)) || null;
}
export function createAgentConversationStore({
  persistence = null,
  windowObject = undefined,
  getProjectId = () => DEFAULT_PROJECT_ID,
  now = () => Date["now"](),
  idFactory = undefined
} = {}) {
  const _0x2fae44 = getWindowObject(windowObject);
  let _0x1c46a2 = null;
  let _0x47773e = '';
  function _0x11c881() {
    try {
      return normalizeProjectId(getProjectId?.());
    } catch {
      return DEFAULT_PROJECT_ID;
    }
  }
  function _0x3499a5(_0x3fd94b) {
    if (typeof idFactory === 'function') {
      const _0x4f7aa2 = String(idFactory({
        'now': _0x3fd94b,
        'projectId': _0x11c881()
      }) || '')["trim"]();
      if (_0x4f7aa2) {
        return _0x4f7aa2;
      }
    }
    return createDefaultId(_0x3fd94b);
  }
  function _0x41f962() {
    if (persistence) {
      return normalizeStorageState(persistence["read"]() || {}, now());
    }
    if (_0x1c46a2) {
      return normalizeStorageState(_0x1c46a2, now());
    }
    try {
      const _0xac36cb = _0x2fae44?.["localStorage"]?.["getItem"]?.(AGENT_CONVERSATION_STORAGE_KEY);
      if (!_0xac36cb) {
        return normalizeStorageState({}, now());
      }
      return normalizeStorageState(JSON["parse"](_0xac36cb), now());
    } catch {
      return normalizeStorageState({}, now());
    }
  }
  function _0x29cf6c(_0x314ebe, {
    required = ![]
  } = {}) {
    const _0xb8f1d7 = normalizeStorageState(_0x314ebe, now());
    if (persistence) {
      persistence["write"](_0xb8f1d7);
      return _0xb8f1d7;
    }
    try {
      if (!_0x2fae44?.['localStorage']?.["setItem"]) {
        throw new Error("Storage unavailable");
      }
      _0x2fae44["localStorage"]["setItem"](AGENT_CONVERSATION_STORAGE_KEY, JSON["stringify"](_0xb8f1d7));
      _0x1c46a2 = null;
      _0x47773e = '';
    } catch {
      if (required) {
        throw new Error('会话存储空间不足或不可用，旧版本已保留，请释放空间后重试');
      }
      _0x1c46a2 = _0xb8f1d7;
      _0x47773e = "会话未保存，内容暂存于内存。请勿关闭应用；释放存储空间后重新打开 Agent 即可重试保存。";
    }
    return _0xb8f1d7;
  }
  function _0x5392f9(_0x123145 = {}) {
    const _0x5d2267 = normalizeTimestamp(_0x123145["createdAt"] || _0x123145["updatedAt"], now());
    return normalizeConversation({
      'id': _0x123145['id'] || _0x3499a5(_0x5d2267),
      'projectId': _0x123145["projectId"] || _0x11c881(),
      'title': _0x123145['title'] || DEFAULT_CONVERSATION_TITLE,
      'createdAt': _0x5d2267,
      'updatedAt': _0x5d2267,
      'messages': _0x123145["messages"] || [],
      'runEvents': _0x123145["runEvents"] || [],
      'operationLedger': _0x123145["operationLedger"] || [],
      'taskBindings': _0x123145["taskBindings"] || [],
      'sessionEvents': _0x123145["sessionEvents"] || [],
      'resumeCheckpoint': _0x123145["resumeCheckpoint"] || null,
      'pendingClarification': _0x123145["pendingClarification"] || null,
      'contextDigest': _0x123145["contextDigest"] || null,
      'lastPlanSummary': _0x123145["lastPlanSummary"] || '',
      'lastCanvasSnapshotDigest': _0x123145["lastCanvasSnapshotDigest"] || null,
      'hasUnfinishedOperation': _0x123145["hasUnfinishedOperation"] === !![],
      'archived': _0x123145["archived"] === !![]
    }, _0x5d2267);
  }
  function _0x3789e0(_0x3a48b2 = _0x41f962()) {
    const _0x36df77 = _0x11c881();
    return sortConversations(_0x3a48b2['conversations']["filter"](_0x5cca35 => _0x5cca35["projectId"] === _0x36df77 && _0x5cca35["archived"] !== !![]));
  }
  function _0x40f81f(_0x3a613d, _0xb6fda) {
    const _0x2dcd3f = String(_0xb6fda || '')["trim"]();
    return _0x3a613d['conversations']["find"](_0x328d50 => _0x328d50['id'] === _0x2dcd3f) || null;
  }
  function _0x2e3737({
    preferLatestWithMessages = ![]
  } = {}) {
    const _0x35fb19 = _0x41f962();
    const _0x20a190 = _0x11c881();
    const _0x4e6733 = _0x35fb19['activeByProjectId'][_0x20a190] || '';
    const _0x5ae869 = _0x4e6733 ? _0x40f81f(_0x35fb19, _0x4e6733) : null;
    const _0x4b210a = _0x3789e0(_0x35fb19);
    const _0x230962 = findLatestConversationWithMessages(_0x4b210a);
    if (_0x5ae869 && _0x5ae869['projectId'] === _0x20a190 && _0x5ae869['archived'] !== !![]) {
      if (preferLatestWithMessages && !hasMessages(_0x5ae869) && _0x230962 && _0x230962['id'] !== _0x5ae869['id']) {
        _0x35fb19["activeByProjectId"][_0x20a190] = _0x230962['id'];
        _0x29cf6c(_0x35fb19);
        return cloneJson(_0x230962);
      }
      return cloneJson(_0x5ae869);
    }
    const _0x45c7d5 = _0x230962 || _0x4b210a[0x0] || null;
    if (_0x45c7d5) {
      _0x35fb19['activeByProjectId'][_0x20a190] = _0x45c7d5['id'];
      _0x29cf6c(_0x35fb19);
      return cloneJson(_0x45c7d5);
    }
    const _0x39620a = _0x5392f9({
      'projectId': _0x20a190
    });
    _0x35fb19['conversations']["push"](_0x39620a);
    _0x35fb19['activeByProjectId'][_0x20a190] = _0x39620a['id'];
    _0x29cf6c(_0x35fb19);
    return cloneJson(_0x39620a);
  }
  function _0x22fc95() {
    return _0x3789e0()["map"](_0x49c22c => cloneJson(_0x49c22c));
  }
  function _0x3bb6f6(_0x222bbb) {
    const _0x6a2a95 = _0x41f962();
    const _0x1723b5 = _0x40f81f(_0x6a2a95, _0x222bbb);
    return _0x1723b5 ? cloneJson(_0x1723b5) : null;
  }
  function _0x19e99d(_0x64d662 = {}) {
    const _0x21fcaf = _0x41f962();
    const _0x5f4ca6 = _0x5392f9(_0x64d662);
    _0x21fcaf["conversations"]["push"](_0x5f4ca6);
    _0x21fcaf["activeByProjectId"][_0x5f4ca6['projectId']] = _0x5f4ca6['id'];
    _0x29cf6c(_0x21fcaf);
    return cloneJson(_0x5f4ca6);
  }
  function _0x2e7338(_0x4c014f, _0x31d43b = {}) {
    const _0x3c8cf7 = _0x41f962();
    const _0x2a0de6 = String(_0x4c014f || '')["trim"]();
    const _0x25d3cb = _0x3c8cf7["conversations"]["findIndex"](_0x3c74a1 => _0x3c74a1['id'] === _0x2a0de6);
    if (_0x25d3cb < 0x0) {
      return null;
    }
    const _0x56cf2f = _0x3c8cf7["conversations"][_0x25d3cb];
    const _0x5a506e = normalizeTimestamp(_0x31d43b["updatedAt"], now());
    const _0x28022e = normalizeConversation({
      ..._0x56cf2f,
      ..._0x31d43b,
      'id': _0x56cf2f['id'],
      'projectId': _0x56cf2f["projectId"],
      'createdAt': _0x56cf2f["createdAt"],
      'updatedAt': _0x5a506e,
      'messages': Array['isArray'](_0x31d43b['messages']) ? _0x31d43b["messages"] : _0x56cf2f["messages"],
      'runEvents': Array['isArray'](_0x31d43b["runEvents"]) ? _0x31d43b['runEvents'] : _0x56cf2f["runEvents"],
      'operationLedger': Array["isArray"](_0x31d43b["operationLedger"]) ? _0x31d43b["operationLedger"] : _0x56cf2f["operationLedger"],
      'taskBindings': Array["isArray"](_0x31d43b["taskBindings"]) ? _0x31d43b["taskBindings"] : _0x56cf2f['taskBindings'],
      'sessionEvents': Array["isArray"](_0x31d43b["sessionEvents"]) ? _0x31d43b["sessionEvents"] : _0x56cf2f['sessionEvents']
    }, _0x5a506e);
    !Array["isArray"](_0x31d43b['sessionEvents']) && (_0x28022e["sessionEvents"] = appendChangedDurableStateEvents(_0x56cf2f, _0x28022e, _0x31d43b, _0x5a506e));
    _0x3c8cf7['conversations'][_0x25d3cb] = _0x28022e;
    _0x29cf6c(_0x3c8cf7, {
      'required': Array['isArray'](_0x31d43b["messages"]) && _0x31d43b["messages"]["some"](_0x2a379f => _0x2a379f["replyVersions"])
    });
    return cloneJson(_0x28022e);
  }
  function _0x43ffcc(_0x2a06fe, _0x4dc715 = {}) {
    const _0x2f0a5e = _0x41f962();
    const _0x26b090 = String(_0x2a06fe || '')['trim']();
    const _0x1dd231 = _0x2f0a5e['conversations']["findIndex"](_0xa2539e => _0xa2539e['id'] === _0x26b090);
    if (_0x1dd231 < 0x0) {
      return null;
    }
    const _0x56705e = _0x2f0a5e["conversations"][_0x1dd231];
    const _0x201b2a = normalizeTimestamp(_0x4dc715['ts'], now());
    const _0xeaf42a = normalizeMessage({
      ..._0x4dc715,
      'itemId': String(_0x4dc715['itemId'] || '')["trim"]() || _0x26b090 + ':message:' + (_0x56705e["messages"]["length"] + 0x1)
    }, _0x201b2a);
    if (!_0xeaf42a) {
      return cloneJson(_0x2f0a5e['conversations'][_0x1dd231]);
    }
    const _0x19ef8f = [..._0x56705e["messages"], _0xeaf42a];
    const _0x48b14b = _0x56705e['title'] === DEFAULT_CONVERSATION_TITLE ? createTitleFromMessage(_0xeaf42a) : '';
    const _0x14b8c9 = normalizeConversation({
      ..._0x56705e,
      'title': _0x48b14b || _0x56705e["title"],
      'updatedAt': _0x201b2a,
      'messages': _0x19ef8f,
      'sessionEvents': appendSessionEventSnapshot(_0x56705e, createAgentMessageSessionEvent, {
        'turnId': String(_0x4dc715["turnId"] || '')['trim'](),
        'itemId': String(_0x4dc715['itemId'] || '')["trim"]() || _0x26b090 + ":message:" + _0x19ef8f["length"],
        'message': _0xeaf42a
      }, _0x201b2a)
    }, _0x201b2a);
    _0x2f0a5e["conversations"][_0x1dd231] = _0x14b8c9;
    _0x29cf6c(_0x2f0a5e);
    return cloneJson(_0x14b8c9);
  }
  function _0x360b3a(_0x4fe3e0, _0x119d2b = {}) {
    const _0xa549f2 = _0x41f962();
    const _0x5b8476 = String(_0x4fe3e0 || '')["trim"]();
    const _0x55a623 = _0xa549f2["conversations"]["findIndex"](_0x40ac80 => _0x40ac80['id'] === _0x5b8476);
    if (_0x55a623 < 0x0) {
      return null;
    }
    const _0x15c402 = normalizeTimestamp(_0x119d2b['ts'], now());
    const _0x18592f = normalizeAgentRunEvent(_0x119d2b, _0x15c402);
    if (!_0x18592f) {
      return cloneJson(_0xa549f2['conversations'][_0x55a623]);
    }
    const _0x32597a = _0xa549f2["conversations"][_0x55a623];
    const _0x30e564 = normalizeConversation({
      ..._0x32597a,
      'updatedAt': _0x15c402,
      'runEvents': [...(_0x32597a["runEvents"] || []), _0x18592f]["slice"](-MAX_RUN_EVENTS),
      'sessionEvents': appendSessionEventSnapshot(_0x32597a, createAgentRunSessionEvent, {
        'runEvent': _0x18592f
      }, _0x15c402)
    }, _0x15c402);
    _0xa549f2["conversations"][_0x55a623] = _0x30e564;
    _0x29cf6c(_0xa549f2);
    return cloneJson(_0x30e564);
  }
  function _0x131077(_0x24325c) {
    const _0x12b4fc = _0x41f962();
    const _0x4f32a4 = String(_0x24325c || '')["trim"]();
    if (!_0x4f32a4) {
      return _0x2e3737();
    }
    _0x12b4fc['conversations'] = _0x12b4fc["conversations"]["filter"](_0x11e0ec => _0x11e0ec['id'] !== _0x4f32a4);
    for (const [_0x50aaa4, _0x40b0c3] of Object['entries'](_0x12b4fc["activeByProjectId"])) {
      if (_0x40b0c3 === _0x4f32a4) {
        delete _0x12b4fc["activeByProjectId"][_0x50aaa4];
      }
    }
    _0x29cf6c(_0x12b4fc);
    return _0x2e3737();
  }
  function _0x569491(_0x4bdb04) {
    const _0x2964ed = _0x41f962();
    const _0x305993 = _0x11c881();
    const _0x28e65f = _0x40f81f(_0x2964ed, _0x4bdb04);
    if (!_0x28e65f || _0x28e65f["projectId"] !== _0x305993 || _0x28e65f["archived"] === !![]) {
      return null;
    }
    _0x2964ed['activeByProjectId'][_0x305993] = _0x28e65f['id'];
    _0x29cf6c(_0x2964ed);
    return cloneJson(_0x28e65f);
  }
  function _0x3bed17() {
    return _0x2e3737()?.['id'] || '';
  }
  return {
    'getPersistenceError': () => _0x47773e,
    'retryPersistence'() {
      if (_0x1c46a2) {
        _0x29cf6c(_0x1c46a2);
      }
      return !_0x1c46a2;
    },
    'listConversations': _0x22fc95,
    'getConversation': _0x3bb6f6,
    'createConversation': _0x19e99d,
    'updateConversation': _0x2e7338,
    'appendMessage': _0x43ffcc,
    'appendRunEvent': _0x360b3a,
    'deleteConversation': _0x131077,
    'setActiveConversationId': _0x569491,
    'getActiveConversationId': _0x3bed17,
    'ensureActiveConversation': _0x2e3737
  };
}