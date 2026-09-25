import { resolveAssetMentionRef } from '../assetMentionRegistry.js';
import { prependStoryDialogueLanguageConstraint } from '../../domain/storyGeneration/promptLanguage.js';
import { resolvePromptTextWithTextRefs } from '../nodePromptShared.js';
import { applyStoryClipDialogueVoiceGuidance } from './storyPlanningData.js';
import { getStoryAssetIdFromMentionNodeId, getStoryEpisodeCharacterVoiceEnabled, renderStoryClipPromptMentions, resolveStoryClipAssetMentionRefs } from './storyClipMentions.js';
import { storyClipProduction } from './storyClipProduction.js';
import { isStoryMinimaxH3PromptMode, serializeStoryPromptForMode } from './storyPromptModes.js';
import { resolveStoryClipVideoGenerationSettings } from './storyVideoGenerationSettings.js';
import { resolveStoryVideoReplicationClipVoiceAssetIds } from './storyVideoReplication.js';
function normalizeText(_0x43a0f6) {
  return String(_0x43a0f6 ?? '')["trim"]();
}
export function createStoryClipProductionWorkspaceController({
  state: _0x1c2a5b,
  root: _0x44d7a0,
  documentObject = globalThis["document"],
  windowObject = globalThis["window"] || globalThis,
  activeControllers: _0x202f8f,
  projectTasks: _0x28f47c,
  createGenerationController: _0x56a731,
  render: _0x33b3c0,
  refreshGeneration: _0x1d7058,
  persistWorkspaceNow: _0x207e89,
  schedulePersistence: _0x4a41ef,
  showToast: _0x1146fd,
  showTaskApiKeyError: _0x2a3459,
  showTaskResultToast: _0x39651a,
  showNavigableTaskResultToast: _0x3c7849,
  notifyNavigableGenerationComplete: _0x44849a
} = {}) {
  if (!_0x1c2a5b || !_0x44d7a0 || !documentObject || !(_0x202f8f instanceof Map) || typeof _0x28f47c?.['createToken'] !== "function" || typeof _0x28f47c?.["isLive"] !== 'function' || typeof _0x28f47c?.['isCurrent'] !== "function" || typeof _0x28f47c?.["register"] !== "function" || typeof _0x28f47c?.['createBatch'] !== 'function' || typeof _0x28f47c?.['syncBatch'] !== "function" || typeof _0x56a731 !== "function" || typeof _0x33b3c0 !== "function" || typeof _0x1d7058 !== 'function' || typeof _0x207e89 !== "function" || typeof _0x4a41ef !== "function" || typeof _0x1146fd !== 'function' || typeof _0x2a3459 !== "function" || typeof _0x39651a !== "function" || typeof _0x3c7849 !== "function" || typeof _0x44849a !== "function") {
    throw new TypeError("Story clip production requires task, generation, persistence, and presentation adapters.");
  }
  function _0x1f9590(_0x258e0b = {}) {
    if (_0x258e0b['type'] === "selection-missing") {
      _0x1146fd("请先选择要生成的片段。", "warn");
      return !![];
    }
    if (_0x258e0b["type"] === "empty-prompt") {
      _0x1146fd('请先填写视频提示词。', "warn");
      return !![];
    }
    if (_0x258e0b['type'] === "provider-error") {
      return _0x2a3459(_0x258e0b["error"], {
        'providerId': _0x258e0b['provider'],
        'model': _0x258e0b['modelId']
      });
    }
    if (_0x258e0b["type"] === 'single-failed') {
      const _0x350e1c = _0x2a3459(_0x258e0b["error"], {
        'providerId': _0x258e0b['provider'],
        'model': _0x258e0b["modelId"]
      });
      !_0x350e1c && _0x39651a(_0x258e0b['error']?.["getUserMessage"]?.() || _0x258e0b["error"]?.['message'] || "片段视频生成失败。", "error", _0x258e0b['error']);
      return !![];
    }
    if (_0x258e0b['type'] === 'single-complete') {
      (_0x258e0b["result"]?.['status'] === "success" || _0x258e0b["result"]?.['ok'] === !![]) && _0x3c7849("片段视频生成完成。", 'success', _0x258e0b['projectToken'], {
        'episodeId': _0x258e0b['episodeId'],
        'clipId': _0x258e0b["clipId"]
      });
      return !![];
    }
    if (_0x258e0b["type"] === "batch-complete") {
      if (_0x258e0b["cancelRequested"]) {
        _0x3c7849("批量生成已停止：完成 " + _0x258e0b["succeeded"] + " 个，失败 " + _0x258e0b["failed"] + " 个，停止 " + _0x258e0b['cancelled'] + '\x20个。', _0x258e0b["failed"] ? "warn" : "info", _0x258e0b["projectToken"], {
          'episodeId': _0x258e0b["episodeId"],
          'clipId': _0x258e0b["clipId"]
        });
        return !![];
      }
      const _0x19a2d0 = _0x258e0b["firstFailure"]?.["reason"] === 'empty-prompt' ? "部分片段缺少视频提示词。" : _0x258e0b['firstFailure']?.["error"]?.["getUserMessage"]?.() || _0x258e0b["firstFailure"]?.["error"]?.['message'] || "部分片段生成失败。";
      _0x44849a(_0x258e0b["failed"] ? "完成 " + _0x258e0b['succeeded'] + " 个，失败 " + _0x258e0b["failed"] + '\x20个。' + _0x19a2d0 : "已完成 " + _0x258e0b["succeeded"] + " 个片段视频。", _0x258e0b["projectToken"], {
        'episodeId': _0x258e0b["episodeId"],
        'clipId': _0x258e0b['clipId']
      }, {
        'tone': _0x258e0b['failed'] ? "warn" : "success",
        'details': _0x258e0b["firstFailure"]?.["error"] || _0x258e0b['firstFailure'],
        'showResultToast': _0x258e0b["suppressToast"] !== !![]
      });
      return !![];
    }
    return ![];
  }
  function _0x41ddb8(_0x2d557a, _0x15c39c, _0x5410ba = null, _0x2e1528 = _0x1c2a5b["data"]) {
    const _0x1aec25 = _0x5410ba || documentObject['createElement']("div");
    !_0x5410ba && (_0x1aec25['innerHTML'] = renderStoryClipPromptMentions(_0x15c39c?.['prompt'] || '', {
      'assets': _0x2e1528["assets"],
      'episode': _0x2d557a,
      'clipFrames': _0x2e1528["clipFrames"]
    }));
    const _0x3c5103 = [];
    const _0x434a58 = resolveStoryVideoReplicationClipVoiceAssetIds(_0x2e1528, _0x15c39c);
    const _0x1ef8ce = _0x434a58 == null ? null : new Set(_0x434a58);
    const _0x1d7de3 = _0x17579e => {
      if (_0x1ef8ce && !_0x1ef8ce["has"](_0x17579e)) {
        return ![];
      }
      return getStoryEpisodeCharacterVoiceEnabled(_0x2d557a, _0x17579e);
    };
    const _0x59df47 = resolvePromptTextWithTextRefs({
      'promptEl': _0x1aec25,
      'assetInputRefs': _0x3c5103,
      'assetMediaCounts': {
        'image': 0x0,
        'video': 0x0,
        'audio': 0x0
      },
      'allowedAssetTypes': ["text", 'image', "video", "audio"],
      'resolveAssetMentionRef': _0x1cec25 => resolveStoryClipAssetMentionRefs(_0x1cec25, _0x2e1528["assets"], {
        'voiceEnabled': _0x1d7de3(getStoryAssetIdFromMentionNodeId(_0x1cec25["dataset"]?.['assetId'])),
        'clipFrames': _0x2e1528["clipFrames"],
        'resolveExternalAssetRef': resolveAssetMentionRef
      }),
      'dedupeAssetMentions': !![]
    });
    const _0x3675fc = _0x2e1528["project"]?.["sourceMode"] === "video-replication" ? applyStoryClipDialogueVoiceGuidance(_0x59df47, _0x15c39c, _0x2e1528["assets"]) : _0x59df47;
    const _0x4ea45d = _0x15c39c?.["promptMode"] || _0x2d557a?.['promptMode'] || _0x2e1528["project"]?.["planning"]?.["promptMode"];
    if (isStoryMinimaxH3PromptMode(_0x4ea45d) && !_0x3c5103["some"](_0xa6c0a7 => ["image", 'video']['includes'](_0xa6c0a7?.["type"]))) {
      for (let _0x2091ea = _0x3c5103["length"] - 0x1; _0x2091ea >= 0x0; _0x2091ea -= 0x1) {
        if (_0x3c5103[_0x2091ea]?.["type"] === "audio") {
          _0x3c5103["splice"](_0x2091ea, 0x1);
        }
      }
    }
    return {
      'prompt': prependStoryDialogueLanguageConstraint(serializeStoryPromptForMode(_0x3675fc, _0x4ea45d), {
        'clip': _0x15c39c,
        'episode': _0x2d557a,
        'project': _0x2e1528["project"]
      }),
      'assetInputRefs': _0x3c5103
    };
  }
  const _0x3c0ef7 = storyClipProduction["createRuntime"]({
    'state': _0x1c2a5b,
    'projectAdapter': _0x28f47c,
    'generationAdapter': {
      'controllers': _0x202f8f,
      'resolvePrompt': ({
        episode: _0x450312,
        clip: _0x49ced9,
        displayedClip: _0x4aa94c,
        projectToken: _0x4b13e7
      }) => {
        const _0x12e658 = normalizeText(_0x49ced9?.['id']) === normalizeText(_0x4aa94c?.['id']) ? _0x44d7a0["querySelector"]('[data-story-clip-prompt]') : null;
        return _0x41ddb8(_0x450312, _0x49ced9, _0x12e658, _0x4b13e7["data"]);
      },
      'resolveSettings': ({
        clip: _0x33cb32,
        projectToken: _0xe7460e
      }) => resolveStoryClipVideoGenerationSettings(_0x33cb32, _0xe7460e, {
        'fallbackModelId': _0x1c2a5b["models"]['video'],
        'fallbackProvider': _0x1c2a5b["videoProvider"]
      }),
      'resolveInstallId': async () => {
        let _0x3bb119 = normalizeText(windowObject?.["__aicInstallId"] || globalThis["__aicInstallId"]);
        if (typeof windowObject?.["ensureSubscriptionInstallId"] === "function") {
          try {
            _0x3bb119 = normalizeText(await windowObject["ensureSubscriptionInstallId"]()) || _0x3bb119;
          } catch {}
        }
        return _0x3bb119;
      },
      'createController': ({
        episode: _0x1b2ae9,
        clip: _0x32fbee,
        projectToken: _0x487231,
        batch: _0x2b83b6
      }) => _0x56a731(_0x487231, _0x1b2ae9['id'], _0x32fbee['id'], _0x32fbee, _0x2b83b6)
    },
    'projectionAdapter': {
      'render': _0x33b3c0,
      'refreshGeneration': _0x1d7058,
      'persist': ({
        immediate = ![]
      } = {}) => {
        if (immediate) {
          return _0x207e89();
        }
        _0x4a41ef();
        return Promise["resolve"](!![]);
      },
      'present': _0x1f9590
    }
  });
  return {
    'cancelBatch': () => _0x3c0ef7['cancelBatch'](),
    'generateSelection': () => _0x3c0ef7["generateSelection"](),
    'present': _0x1f9590,
    'resolveGenerationPrompt': _0x41ddb8,
    'runtime': _0x3c0ef7
  };
}