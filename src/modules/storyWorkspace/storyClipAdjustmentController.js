import { sanitizePromptHtmlForCommit } from '../nodePromptShared.js';
import { applyStoryClipAdjustmentCandidate, buildStoryClipAdjustmentGenerationKey, clearStoryClipAdjustmentUndo, discardStoryClipAdjustmentCandidate, getStoryClipPromptLockedTokens, restoreStoryClipPromptHistoryEntry, serializeStoryClipPromptElement, setStoryClipAdjustmentCandidate } from './storyClipAdjustment.js';
import { renderStoryClipPromptMentions } from './storyClipMentions.js';
import { formatStoryClockDuration, normalizeDurationSeconds } from './storyPlanningData.js';
import { isStoryMinimaxH3PromptMode, normalizeStoryPromptMode } from './storyPromptModes.js';
import { normalizeStorySceneMaxSeconds } from './storyProjectPlanning.js';
import { normalizeStoryPromptLanguage } from '../../domain/storyGeneration/promptLanguage.js';
function normalizeText(_0x5a90e1) {
  return String(_0x5a90e1 || '')["trim"]();
}
export function createStoryClipAdjustmentController({
  state: _0x584de9,
  root: _0x14244a,
  documentObject = globalThis["document"],
  adjustClipPrompt = null,
  getSelection = () => ({
    'episode': null,
    'clip': null
  }),
  projectTasks = {},
  applyClipVideoSettings = () => {},
  schedulePersistence = () => {},
  render = () => {},
  refreshPromptRestore = () => ![],
  refreshReferenceSummary = () => {},
  refreshTimeline = () => {},
  notifyTextTaskComplete = () => {},
  showToast = () => {},
  showTaskApiKeyError = () => ![],
  showTaskResultToast = () => ![]
} = {}) {
  const _0x476855 = projectTasks["createToken"] || (() => null);
  const _0x1631f3 = projectTasks["isLive"] || (() => ![]);
  const _0x3dd32f = projectTasks["isCurrent"] || (() => ![]);
  const _0x4cc4fa = projectTasks["syncEntry"] || (() => ![]);
  const _0xd33ea6 = new Map();
  function _0xe3cd85(_0x9b84f8, _0x30c95a) {
    if (_0xd33ea6["get"](_0x9b84f8) !== _0x30c95a) {
      return;
    }
    _0xd33ea6["delete"](_0x9b84f8);
    _0x584de9["clipAdjustmentGeneratingIds"] = (_0x584de9['clipAdjustmentGeneratingIds'] || [])['filter'](_0x17484b => _0x17484b !== _0x9b84f8);
  }
  function _0x3a66f6({
    close = ![]
  } = {}) {
    if (close) {
      _0x584de9['clipAdjustmentOpen'] = ![];
    }
    _0x584de9["clipAdjustmentInstruction"] = '';
    _0x584de9['clipAdjustmentPromptMode'] = '';
    _0x584de9["clipAdjustmentPromptModeOpen"] = ![];
    _0x584de9["clipAdjustmentLanguage"] = '';
    _0x584de9["clipAdjustmentLanguageOpen"] = ![];
    _0x584de9["clipPromptHistoryOpen"] = ![];
  }
  function _0x4e018d(_0x5064cc = '') {
    const _0x4a1de9 = documentObject["createElement"]("div");
    _0x4a1de9['innerHTML'] = String(_0x5064cc || '');
    return _0x4a1de9;
  }
  function _0x33b10a(_0x47fe09) {
    const _0x107b39 = _0x47fe09['id'] === _0x584de9['selectedClipId'] ? _0x14244a?.["querySelector"]?.("[data-story-clip-prompt]") : null;
    const _0x158c63 = _0x107b39 ? sanitizePromptHtmlForCommit(_0x107b39["innerHTML"]) : sanitizePromptHtmlForCommit(renderStoryClipPromptMentions(_0x47fe09?.["prompt"] || '', {
      'assets': _0x584de9["data"]?.["assets"] || [],
      'episode': getSelection()["episode"],
      'clipFrames': _0x584de9['data']?.["clipFrames"] || []
    }));
    const _0xd6df41 = _0x107b39 || _0x4e018d(_0x158c63);
    return {
      'sourcePromptHtml': _0x158c63,
      'sourcePromptText': serializeStoryClipPromptElement(_0xd6df41),
      'lockedTokens': getStoryClipPromptLockedTokens(_0xd6df41),
      'officialPromptHtml': sanitizePromptHtmlForCommit(_0x47fe09?.["prompt"] || '')
    };
  }
  function _0x514bad(_0xf05c41, _0x278775) {
    const _0x1572ea = _0x584de9['data']?.["project"] || {};
    return {
      'projectTitle': _0x1572ea["title"],
      'sourceMode': _0x1572ea['sourceMode'],
      'targetLocale': _0xf05c41?.["replication"]?.['targetLocale'] || _0x1572ea['replication']?.["targetLocale"] || 'source',
      'sourceLanguage': _0xf05c41?.["replication"]?.['sourceAnalysis']?.["sourceLanguage"] || '',
      'storySummary': _0x1572ea['summary'],
      'episodeNumber': _0xf05c41?.['number'],
      'episodeTitle': _0xf05c41?.["title"],
      'episodeSynopsis': _0xf05c41?.["synopsis"],
      'clipTitle': _0x278775?.['title'],
      'clipScript': _0x278775?.["script"],
      'creativeIntent': _0x278775?.["creativeIntent"],
      'transition': _0x278775?.["transition"]
    };
  }
  function _0x1d5c7c(_0xaabfaa) {
    if (!_0xaabfaa) {
      return ![];
    }
    const _0x1d626d = (_0xaabfaa['clips'] || [])["reduce"]((_0x487f0a, _0x11b57c) => _0x487f0a + normalizeDurationSeconds(_0x11b57c?.["durationSec"] || _0x11b57c?.["durationSeconds"] || _0x11b57c?.["duration"]), 0x0);
    _0xaabfaa["durationSec"] = Number(_0x1d626d['toFixed'](0x1));
    _0xaabfaa["duration"] = formatStoryClockDuration(_0xaabfaa["durationSec"]);
    return !![];
  }
  async function _0x3eca48({
    instructionOverride = '',
    promptModeOverride = '',
    languageOverride = '',
    selectionOverride = null,
    sourceOverride = null,
    contextOverride = null,
    projectTokenOverride = null,
    execution = {
      'model': _0x584de9["models"]["text"],
      'provider': _0x584de9["textProvider"],
      'providerProfileId': _0x584de9['textProviderProfileId']
    },
    reserved = ![],
    reservation = null,
    reopenOnError = !![]
  } = {}) {
    if (typeof adjustClipPrompt !== "function") {
      showToast("AI 调整服务尚未初始化。", "error");
      return ![];
    }
    const {
      episode: _0x5de7a3,
      clip: _0x4d917c
    } = selectionOverride || getSelection();
    if (!_0x5de7a3 || !_0x4d917c) {
      return ![];
    }
    const _0x26c6fa = normalizeText(_0x4d917c['id']);
    const _0x58e545 = new Set((Array["isArray"](_0x584de9["clipAdjustmentGeneratingIds"]) ? _0x584de9['clipAdjustmentGeneratingIds'] : [])["map"](_0x52d463 => normalizeText(_0x52d463)));
    const _0x1e0c1d = buildStoryClipAdjustmentGenerationKey(projectTokenOverride?.['data']?.["project"]?.['id'] || _0x584de9['data']?.["project"]?.['id'], _0x5de7a3['id'], _0x26c6fa);
    if (!_0x1e0c1d || !reserved && _0x58e545["has"](_0x1e0c1d)) {
      return ![];
    }
    const _0xdd3620 = normalizeText(reserved ? instructionOverride : instructionOverride || _0x584de9['clipAdjustmentInstruction']);
    const _0x16104a = normalizeStoryPromptMode(_0x4d917c["promptMode"] || _0x5de7a3["promptMode"] || (projectTokenOverride?.["data"] || _0x584de9["data"])["project"]?.['planning']?.['promptMode'], {
      'allowDeveloperModes': !![]
    });
    const _0x84e801 = normalizeStoryPromptMode(promptModeOverride || !reserved && _0x584de9["clipAdjustmentPromptMode"] || _0x16104a, {
      'allowDeveloperModes': !![]
    });
    const _0x190448 = _0x84e801 !== _0x16104a;
    const _0x5c64e2 = _0x4d917c['requiredDialogueLanguage'] || '';
    const _0x667c1a = normalizeStoryPromptLanguage((reserved ? languageOverride : languageOverride || _0x584de9['clipAdjustmentLanguage']) || _0x5c64e2);
    if (!_0xdd3620 && !_0x190448 && !_0x667c1a) {
      showToast("请选择提示词模式、转换语言，或填写调整要求。", "warn");
      _0x14244a?.["querySelector"]?.('[data-story-clip-adjustment-instruction]')?.["focus"]();
      return ![];
    }
    const _0x16fa49 = sourceOverride || _0x33b10a(_0x4d917c);
    if (!_0x16fa49["sourcePromptText"]) {
      showToast("当前片段还没有可调整的视频提示词。", "warn");
      return ![];
    }
    const _0x106c42 = projectTokenOverride || _0x476855();
    if (!_0x1631f3(_0x106c42)) {
      return ![];
    }
    const _0x3d87e4 = _0x5de7a3['id'];
    const _0x13ff63 = normalizeDurationSeconds(_0x4d917c["durationSec"] || _0x4d917c['durationSeconds'] || _0x4d917c["duration"]);
    const _0xf21a83 = normalizeStorySceneMaxSeconds(_0x106c42['data']["project"]?.['planning']?.["sceneMaxSeconds"]);
    const _0x529bb1 = isStoryMinimaxH3PromptMode(_0x84e801) ? Math["min"](0xf, _0xf21a83) : _0xf21a83;
    _0x58e545["add"](_0x1e0c1d);
    _0x584de9["clipAdjustmentGeneratingIds"] = [..._0x58e545];
    _0x3dd32f(_0x106c42) && (_0x584de9["clipAdjustmentOpen"] = ![], _0x584de9['clipAdjustmentInstruction'] = '', _0x584de9["clipAdjustmentPromptModeOpen"] = ![], _0x584de9["clipAdjustmentLanguageOpen"] = ![], _0x584de9["clipPromptHistoryOpen"] = ![]);
    if (!reserved) {
      render();
    }
    try {
      const _0x58a0ac = Boolean(_0x667c1a && !_0xdd3620 && !_0x190448);
      const _0x527aaa = await adjustClipPrompt({
        'scope': 'prompt',
        'instruction': _0xdd3620,
        'currentPrompt': _0x16fa49["sourcePromptText"],
        'selection': null,
        'preserveAssetRefs': !![],
        'preserveDuration': _0x58a0ac,
        'lockedAssetTokens': _0x16fa49["lockedTokens"]["assetTokens"],
        'lockedDurationTokens': _0x58a0ac ? _0x16fa49["lockedTokens"]["durationTokens"] : [],
        'duration': _0x4d917c["duration"],
        'maxDurationSeconds': _0x529bb1,
        'context': contextOverride || _0x514bad(_0x5de7a3, _0x4d917c),
        'sourcePromptMode': _0x16104a,
        'targetPromptMode': _0x84e801,
        'targetLanguage': _0x667c1a || _0x4d917c['promptLanguage'],
        ...execution
      });
      if (!_0x1631f3(_0x106c42)) {
        return ![];
      }
      const _0x2494bd = _0x106c42["data"]["episodes"]["find"](_0x5dc825 => _0x5dc825['id'] === _0x3d87e4);
      const _0x4eea2e = _0x2494bd?.["clips"]?.["find"](_0x4a8235 => _0x4a8235['id'] === _0x26c6fa);
      if (!_0x4eea2e) {
        return ![];
      }
      if ((_0x4eea2e["requiredDialogueLanguage"] || '') !== _0x5c64e2) {
        throw new Error("对白语言设置已变化，请按最新语言重新调整提示词。");
      }
      const _0x40bbb8 = sanitizePromptHtmlForCommit(renderStoryClipPromptMentions(_0x527aaa['candidateText'], {
        'assets': _0x106c42["data"]["assets"],
        'episode': _0x2494bd,
        'clipFrames': _0x106c42["data"]['clipFrames']
      }));
      setStoryClipAdjustmentCandidate(_0x4eea2e, {
        'id': 'candidate-' + Date["now"](),
        'scope': 'prompt',
        'instruction': _0xdd3620,
        'promptText': _0x527aaa["candidateText"],
        'promptHtml': _0x40bbb8,
        'sourcePromptHtml': _0x16fa49["officialPromptHtml"],
        'preserveAssetRefs': !![],
        'preserveDuration': _0x58a0ac,
        'sourceDurationSeconds': _0x13ff63,
        'candidateDurationSeconds': _0x527aaa["candidateDurationSeconds"],
        'sourcePromptMode': _0x16104a,
        'targetPromptMode': _0x84e801,
        'targetLanguage': _0x667c1a || _0x4d917c["promptLanguage"] || '',
        'maxDurationSeconds': _0x529bb1,
        'modelId': execution['model'],
        'provider': execution['provider'],
        'createdAt': Date['now']()
      });
      _0x4cc4fa(_0x106c42);
      schedulePersistence({
        'immediate': !![]
      });
      _0x3dd32f(_0x106c42) && _0x584de9["selectedClipId"] === _0x26c6fa && (_0x584de9["clipAdjustmentOpen"] = ![], _0x584de9['clipAdjustmentInstruction'] = '', _0x584de9["clipAdjustmentPromptMode"] = '', _0x584de9['clipAdjustmentPromptModeOpen'] = ![], _0x584de9["clipAdjustmentLanguage"] = '', _0x584de9['clipAdjustmentLanguageOpen'] = ![]);
      notifyTextTaskComplete("AI 调整完成，请在右侧选择提示词版本。", _0x106c42, {
        'episodeId': _0x3d87e4,
        'clipId': _0x26c6fa
      }, {
        'notificationMessage': "片段视频提示词 AI 调整完成。"
      });
      return !![];
    } catch (_0x5c5fd9) {
      if (!_0x1631f3(_0x106c42)) {
        return ![];
      }
      const _0x4eecc0 = showTaskApiKeyError(_0x5c5fd9, {
        'provider': execution["provider"],
        'modelId': execution['model']
      });
      !_0x4eecc0 && showTaskResultToast(_0x5c5fd9?.["message"] || '候选版本生成失败。', 'error', _0x5c5fd9);
      reopenOnError && _0x3dd32f(_0x106c42) && _0x584de9['selectedClipId'] === _0x26c6fa && (_0x584de9['clipAdjustmentOpen'] = !![], _0x584de9["clipAdjustmentInstruction"] = _0xdd3620, _0x584de9['clipAdjustmentPromptMode'] = _0x84e801, _0x584de9["clipAdjustmentLanguage"] = _0x667c1a, _0x584de9["clipAdjustmentPromptModeOpen"] = ![]);
      return ![];
    } finally {
      _0xe3cd85(_0x1e0c1d, reservation);
      if (_0x3dd32f(_0x106c42)) {
        render();
      }
    }
  }
  async function _0x5f13c9(_0x30043b = {}) {
    const {
      episode: _0x21ff9f,
      clip: _0x32dbcf
    } = getSelection();
    if (!_0x21ff9f || !_0x32dbcf) {
      return ![];
    }
    const _0x26a421 = new Set(_0x584de9["selectedClipGenerationIds"] || []);
    const _0x597d1d = _0x584de9["clipSelectionMode"] && !_0x30043b['single'] ? (_0x21ff9f["clips"] || [])["filter"](_0x145f31 => _0x26a421["has"](_0x145f31['id'])) : [_0x32dbcf];
    const _0x470212 = normalizeText(_0x30043b['instructionOverride'] || _0x584de9["clipAdjustmentInstruction"]);
    const _0x515673 = _0x30043b["promptModeOverride"] || _0x584de9["clipAdjustmentPromptMode"];
    const _0x2a8aa6 = _0x30043b["languageOverride"] || _0x584de9['clipAdjustmentLanguage'];
    if (!_0x597d1d["length"]) {
      showToast("请先选择要调整提示词的片段。", 'warn');
      return ![];
    }
    const _0x54b484 = _0x476855();
    const _0x52e6a6 = new Set(_0x584de9["clipAdjustmentGeneratingIds"] || []);
    const _0xde7162 = _0x597d1d["flatMap"](_0xf6ae7b => {
      const _0x43aa47 = buildStoryClipAdjustmentGenerationKey(_0x584de9["data"]?.["project"]?.['id'], _0x21ff9f['id'], _0xf6ae7b['id']);
      const _0x1e4ee4 = _0xf6ae7b['promptMode'] || _0x21ff9f["promptMode"] || _0x584de9["data"]["project"]?.["planning"]?.["promptMode"];
      if (!_0x43aa47 || _0x52e6a6["has"](_0x43aa47)) {
        return [];
      }
      if (!_0x470212 && !_0x2a8aa6 && (!_0x515673 || _0x515673 === _0x1e4ee4)) {
        return [];
      }
      _0x52e6a6['add'](_0x43aa47);
      return [{
        'key': _0x43aa47,
        'selectionOverride': {
          'episode': {
            ..._0x21ff9f
          },
          'clip': {
            ..._0xf6ae7b
          }
        },
        'sourceOverride': _0x33b10a(_0xf6ae7b),
        'contextOverride': _0x514bad(_0x21ff9f, _0xf6ae7b)
      }];
    });
    if (!_0xde7162["length"]) {
      showToast("请选择转换语言、不同的提示词模式或填写要求；正在调整的片段不会重复提交。", "info");
      return ![];
    }
    const _0x2a6fc4 = {
      'model': _0x584de9["models"]["text"],
      'provider': _0x584de9["textProvider"],
      'providerProfileId': _0x584de9["textProviderProfileId"]
    };
    const _0x4b1a26 = Symbol('clip-adjustment-batch');
    _0xde7162["forEach"](_0x3a81e7 => _0xd33ea6["set"](_0x3a81e7["key"], _0x4b1a26));
    _0x584de9["clipAdjustmentGeneratingIds"] = [..._0x52e6a6];
    _0x584de9["clipAdjustmentOpen"] = ![];
    render();
    let _0x18517e = 0x0;
    const _0x2d4d0d = [];
    try {
      await Promise["all"](Array["from"]({
        'length': Math["min"](0x3, _0xde7162["length"])
      }, async () => {
        while (_0x18517e < _0xde7162['length']) {
          const _0x4f87fa = _0xde7162[_0x18517e++];
          if (!_0x1631f3(_0x54b484)) {
            break;
          }
          _0x2d4d0d['push'](await _0x3eca48({
            ..._0x30043b,
            ..._0x4f87fa,
            'instructionOverride': _0x470212,
            'promptModeOverride': _0x515673,
            'languageOverride': _0x2a8aa6,
            'execution': _0x2a6fc4,
            'reserved': !![],
            'reservation': _0x4b1a26,
            'projectTokenOverride': _0x54b484,
            'reopenOnError': _0xde7162["length"] === 0x1 && _0x30043b["reopenOnError"] !== ![]
          }));
        }
      }));
      return _0x2d4d0d["some"](Boolean);
    } finally {
      _0xde7162["forEach"](_0x34b617 => _0xe3cd85(_0x34b617['key'], _0x4b1a26));
      if (_0x3dd32f(_0x54b484)) {
        render();
      }
    }
  }
  function _0x509a69() {
    const {
      episode: _0x15440b,
      clip: _0x53b907
    } = getSelection();
    const _0x1533d2 = _0x53b907?.["promptAdjustment"]?.["candidate"];
    if (!_0x53b907 || !_0x1533d2) {
      return ![];
    }
    if (sanitizePromptHtmlForCommit(_0x53b907["prompt"] || '') !== sanitizePromptHtmlForCommit(_0x1533d2['sourcePromptHtml'] || '')) {
      showToast("当前提示词已变化，请基于最新内容重新生成候选。", "warn");
      return ![];
    }
    if (!applyStoryClipAdjustmentCandidate(_0x53b907)) {
      showToast("候选提示词语言与最新对白语言不一致，请重新选择语言并调整。", 'warn');
      return ![];
    }
    clearStoryClipAdjustmentUndo(_0x53b907);
    _0x1d5c7c(_0x15440b);
    applyClipVideoSettings(_0x53b907);
    _0x3a66f6({
      'close': !![]
    });
    schedulePersistence({
      'immediate': !![]
    });
    render();
    showToast("已使用 AI 调整后的提示词。", "success");
    return !![];
  }
  function _0x3b7253(_0xa3525b) {
    const {
      episode: _0x2785b4,
      clip: _0x100f99
    } = getSelection();
    if (!_0x100f99) {
      return ![];
    }
    const _0x327c77 = _0x14244a?.['querySelector']?.("[data-story-clip-prompt]");
    _0x327c77 && (_0x100f99["prompt"] = sanitizePromptHtmlForCommit(_0x327c77["innerHTML"]));
    const _0xed7c79 = restoreStoryClipPromptHistoryEntry(_0x100f99, _0xa3525b);
    if (!_0xed7c79) {
      return ![];
    }
    _0x1d5c7c(_0x2785b4);
    _0x3a66f6({
      'close': !![]
    });
    schedulePersistence({
      'immediate': !![]
    });
    if (!refreshPromptRestore()) {
      render();
    }
    refreshReferenceSummary();
    refreshTimeline();
    showToast("已恢复提示词历史版本。", "success");
    return !![];
  }
  function _0x54a004() {
    const {
      clip: _0x23f135
    } = getSelection();
    if (!discardStoryClipAdjustmentCandidate(_0x23f135)) {
      return ![];
    }
    _0x3a66f6({
      'close': !![]
    });
    schedulePersistence({
      'immediate': !![]
    });
    render();
    showToast('已保留原提示词版本。', "info");
    return !![];
  }
  function _0x3f8cd1() {
    const {
      clip: _0x207da3
    } = getSelection();
    const _0x377f72 = _0x207da3?.["promptAdjustment"]?.["candidate"];
    if (!_0x377f72) {
      return ![];
    }
    void _0x5f13c9({
      'instructionOverride': _0x377f72["instruction"] || "保持人物、场景和素材引用不变，重新生成一个提示词版本。",
      'promptModeOverride': _0x377f72["targetPromptMode"],
      'languageOverride': _0x377f72['targetLanguage'],
      'single': !![],
      'reopenOnError': ![]
    });
    return !![];
  }
  return Object['freeze']({
    'applySelected': _0x509a69,
    'discardSelected': _0x54a004,
    'generateCandidate': _0x5f13c9,
    'regenerateSelected': _0x3f8cd1,
    'resetUi': _0x3a66f6,
    'restorePromptHistory': _0x3b7253
  });
}