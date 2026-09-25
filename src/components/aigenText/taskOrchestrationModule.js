import { appendAssetMentionToPrompt, getPromptInputSubmitLabelFromPillNode, insertPresetPromptIntoEditor, previewPresetPromptInEditor, resolveTextReferenceContent, shouldUsePromptPreviewForPreset } from '../../modules/nodePromptShared.js';
import { resolvePromptPresetTemplate } from '../../modules/promptPresetTemplate.js';
import { isPreviewModeEnabled, isPreviewNodeLoading, startPreviewNodeLoading } from '../../modules/previewMode.js';
import { createPreviewGenerateButtonCallbacks } from '../../modules/previewGenerateButtonUi.js';
import { resolveGenerationInputImageUrl } from '../../services/imageReferenceUrlService.js';
import { submitTask } from '../../core/generationTaskRuntime.js';
import { localPathToUrl } from '../../utils/localMediaPath.js';
import { isModelApiModel, resolveModelExecution, resolveModelProvider } from '../../manifests/index.js';
import { showProviderApiKeyMissingToastForError } from '../../modules/providerApiKeyMissingToast.js';
import { guardModelGenerationCredentials } from '../../modules/modelCredentialUi.js';
import { buildTextGenerationFailurePatch, buildTextGenerationResultPatch, isTextGenerationTimeoutError } from './textGenerationResultRenderer.js';
import { t as a362_0x6a8287 } from '../../i18n/index.js';
import { resolveModelGenerationProviderProfileId } from '../../modules/modelProviderProfileSelection.js';
function toLocalPathUrl(_0x1cc787) {
  return localPathToUrl(_0x1cc787);
}
function pickResultItem(_0x44664a, _0x3de24d) {
  if (!Array["isArray"](_0x44664a) || _0x44664a["length"] === 0x0) {
    return null;
  }
  const _0x3a4ea6 = Number(_0x3de24d);
  const _0x2497cc = Number["isFinite"](_0x3a4ea6) ? Math["max"](0x0, Math["trunc"](_0x3a4ea6)) : 0x0;
  return _0x44664a[Math['min'](_0x2497cc, _0x44664a["length"] - 0x1)] || null;
}
function resolveImageRefUrl(_0x4289f0) {
  return resolveGenerationInputImageUrl(_0x4289f0);
}
function resolveVideoRefUrl(_0xacc06e) {
  const _0x178497 = pickResultItem(_0xacc06e?.["videos"], _0xacc06e?.["mainVideoIndex"]);
  return [String(_0x178497?.["videoUrl"] || '')['trim'](), String(_0x178497?.["url"] || '')["trim"](), String(_0x178497?.["src"] || '')["trim"](), toLocalPathUrl(_0x178497?.["localPath"]), String(_0xacc06e?.["videoUrl"] || '')["trim"](), String(_0xacc06e?.['src'] || '')['trim'](), toLocalPathUrl(_0xacc06e?.['localPath']), String(_0xacc06e?.["thumbUrl"] || '')["trim"](), String(_0xacc06e?.['imageUrl'] || '')["trim"](), String(_0x178497?.["thumbUrl"] || '')["trim"](), toLocalPathUrl(_0x178497?.["thumbLocalPath"]), String(_0x178497?.["poster"] || '')["trim"]()]["find"](Boolean) || '';
}
function resolveAudioRefUrl(_0x83c5cb) {
  const _0x1956a2 = pickResultItem(_0x83c5cb?.["audios"], _0x83c5cb?.['mainAudioIndex']);
  return [String(_0x1956a2?.["audioUrl"] || '')["trim"](), String(_0x1956a2?.["url"] || '')['trim'](), String(_0x1956a2?.["src"] || '')["trim"](), toLocalPathUrl(_0x1956a2?.["localPath"]), String(_0x83c5cb?.["audioUrl"] || '')['trim'](), String(_0x83c5cb?.["src"] || '')['trim'](), toLocalPathUrl(_0x83c5cb?.["localPath"])]["find"](Boolean) || '';
}
const REFERENCE_LABEL_ALIASES = Object["freeze"]({
  'text': Object["freeze"](['文本', "Text"]),
  'image': Object["freeze"](['图片', "Image"]),
  'video': Object["freeze"](['视频', 'Video']),
  'audio': Object["freeze"](['音频', "Audio"]),
  'other': Object["freeze"](['节点', "Node"])
});
function getReferenceTypeLabel(_0x28dc33) {
  const _0xc1984c = {
    'text': a362_0x6a8287("aigenText.refs.types.text"),
    'image': a362_0x6a8287("aigenText.refs.types.image"),
    'video': a362_0x6a8287("aigenText.refs.types.video"),
    'audio': a362_0x6a8287("aigenText.refs.types.audio"),
    'other': a362_0x6a8287("aigenText.refs.types.other")
  };
  return _0xc1984c[_0x28dc33] || _0xc1984c['other'];
}
function buildReferenceLabelAliases(_0x41136f, _0x3b08f5) {
  const _0x5e30ff = ['@' + getReferenceTypeLabel(_0x41136f) + _0x3b08f5, ...(REFERENCE_LABEL_ALIASES[_0x41136f] || [])["map"](_0x1ff43a => '@' + _0x1ff43a + _0x3b08f5)];
  return Array['from'](new Set(_0x5e30ff));
}
function isRunningHubImageToTextModel(_0x2546bb, _0x3b52a4) {
  return _0x3b52a4 === 'runninghub' && isModelApiModel(_0x2546bb, _0x3b52a4) && String(_0x2546bb || '')["endsWith"]("/image-to-text");
}
export function createAIGenTextNodeTaskOrchestrationModule(_0x554ecd) {
  const {
    store: _0x4450e3,
    api: _0x809afb,
    getDisplayModelName: _0x5cffed,
    ensureThumbDecoded: _0x5791bb,
    revealRefThumbMedia: _0x2fafda,
    commit: _0x1bba1c,
    TEXT_TOOLBAR_HTML: _0x2baee2,
    bindTextToolbarEvents: _0x531f1f,
    getPromptPresets: _0x4a6dc2,
    openCustomPresetsManager: _0x12db71,
    startLoading: _0x591994,
    stopLoading: _0x473e7e,
    bindRefThumbHoverPreview: _0x154793,
    checkSlashTrigger: _0x3c1f03,
    handleSlashKeyboardNavigation: _0x1cd124,
    closeSlashMenu: _0x47fd5a,
    activateMenuKeyboard: _0x20e192,
    _checkAtTrigger: _0x139e50,
    _populateMentionMenu: _0x4b8c8b,
    _handleMentionMenuKeyboard: _0xbbdd9e,
    _handlePillKeyboard: _0x4cbc6e,
    _rehydratePromptPills: _0x2ccca1,
    _handlePillHover: _0x19ba6a,
    _handlePillOut: _0x55b076,
    _syncEdgesOrderFromPills: _0x7818bb,
    _syncPillLabels: _0x1da275,
    getCustomTextModels: _0xa2e677,
    saveCustomTextModels: _0x282c1f
  } = _0x554ecd;
  class _0x3df77b {
    async ["_buildPayload"](_0x16848d = null) {
      const _0x55e5c9 = _0x4450e3["getState"]();
      const _0x3e1d9a = _0x4450e3['getIncomingEdges'](this["nodeId"]);
      const _0x4b3645 = _0x55e5c9["nodes"] || {};
      const _0x2a5052 = {
        'text': [],
        'image': [],
        'video': [],
        'audio': []
      };
      const _0x84d1d1 = {
        'text': 0x0,
        'image': 0x0,
        'video': 0x0,
        'audio': 0x0
      };
      _0x3e1d9a["forEach"](_0x557b72 => {
        const _0x1c81cf = _0x4b3645[_0x557b72["sourceId"]];
        if (!_0x1c81cf) {
          return;
        }
        let _0x47609b = '';
        const _0x508e54 = _0x1c81cf["type"] || '';
        if (_0x508e54 === "text" || _0x508e54 === "source-text" || _0x508e54 === "ai-text") {
          _0x47609b = "text";
        } else {
          if (_0x508e54 === 'source-image' || _0x508e54 === "ai-image") {
            _0x47609b = "image";
          } else {
            if (_0x508e54 === "source-video" || _0x508e54 === "video" || _0x508e54 === "ai-video") {
              _0x47609b = "video";
            } else {
              if (_0x508e54 === "source-audio" || _0x508e54 === 'audio' || _0x508e54 === "ai-audio") {
                _0x47609b = 'audio';
              } else {
                _0x47609b = "other";
              }
            }
          }
        }
        let _0x2911cc = '';
        let _0x45fb62 = '';
        if (_0x47609b === 'text') {
          _0x2911cc = resolveTextReferenceContent(_0x1c81cf);
        } else {
          if (_0x47609b === "image") {
            _0x45fb62 = resolveImageRefUrl(_0x1c81cf);
            if (!_0x45fb62) {
              return;
            }
          } else {
            if (_0x47609b === "video") {
              _0x45fb62 = resolveVideoRefUrl(_0x1c81cf);
              if (!_0x45fb62) {
                return;
              }
            } else {
              if (_0x47609b === "audio") {
                _0x45fb62 = resolveAudioRefUrl(_0x1c81cf);
                if (!_0x45fb62) {
                  return;
                }
              } else {
                _0x45fb62 = String(_0x1c81cf["src"] || _0x1c81cf["imageUrl"] || '')['trim']();
                if (!_0x45fb62) {
                  return;
                }
              }
            }
          }
        }
        _0x84d1d1[_0x47609b]++;
        const _0x43c38c = buildReferenceLabelAliases(_0x47609b, _0x84d1d1[_0x47609b]);
        const _0x17de3b = _0x43c38c[0x0];
        _0x2a5052[_0x47609b]["push"]({
          'label': _0x17de3b,
          'labels': _0x43c38c,
          'content': _0x2911cc,
          'url': _0x45fb62,
          'used': ![],
          'type': _0x47609b,
          'sourceId': String(_0x557b72["sourceId"] || '')
        });
      });
      const _0x55cd15 = [..._0x2a5052["text"], ..._0x2a5052["image"], ..._0x2a5052["video"], ..._0x2a5052["audio"]];
      const _0x45514a = {};
      const _0x5a398a = {};
      _0x55cd15["forEach"](_0x3596a4 => {
        (_0x3596a4["labels"] || [_0x3596a4["label"]])["forEach"](_0x4c1f14 => {
          _0x45514a[_0x4c1f14["replace"](/\s+/g, '')] = _0x3596a4;
        });
        if (_0x3596a4["sourceId"]) {
          _0x5a398a[_0x3596a4["sourceId"]] = _0x3596a4;
        }
      });
      let _0xfdb8be = [];
      let _0x56caa3 = [];
      let _0x936391 = [];
      let _0x193807 = [];
      const _0x5b6827 = [];
      const _0x41b440 = {
        'image': 0x0,
        'video': 0x0,
        'audio': 0x0
      };
      const _0x138eca = _0x54f0b9 => {
        if (!_0x54f0b9?.["url"]) {
          return;
        }
        if (!_0xfdb8be["includes"](_0x54f0b9["url"])) {
          _0xfdb8be["push"](_0x54f0b9['url']);
        }
        _0x54f0b9["type"] === 'image' && !_0x56caa3['includes'](_0x54f0b9["url"]) && _0x56caa3['push'](_0x54f0b9["url"]);
        _0x54f0b9["type"] === "video" && !_0x936391["includes"](_0x54f0b9['url']) && _0x936391["push"](_0x54f0b9["url"]);
        _0x54f0b9["type"] === "audio" && !_0x193807["includes"](_0x54f0b9["url"]) && _0x193807['push'](_0x54f0b9["url"]);
      };
      const _0x478909 = _0x453715 => {
        let _0x429a1a = '';
        const _0x3d603b = _0x15e209 => {
          for (const _0x348277 of _0x15e209["childNodes"]) {
            if (_0x348277["nodeType"] === Node["TEXT_NODE"]) {
              _0x429a1a += _0x348277["textContent"];
            } else {
              if (_0x348277["nodeType"] === Node["ELEMENT_NODE"]) {
                if (_0x348277["classList"]['contains']("ref-pill")) {
                  const _0x451220 = _0x348277["dataset"]["nodeId"] || '';
                  const _0x27d3a9 = _0x348277["dataset"]['label'] || _0x348277["textContent"]["trim"]();
                  const _0x52968e = [];
                  if (appendAssetMentionToPrompt({
                    'domNode': _0x348277,
                    'rawLabel': _0x27d3a9,
                    'promptParts': _0x52968e,
                    'inputRefs': _0x5b6827,
                    'mediaCounts': _0x41b440
                  })) {
                    _0x429a1a += _0x52968e["join"]('');
                    _0x5b6827["forEach"](_0x138eca);
                    continue;
                  }
                  const _0x59a913 = getPromptInputSubmitLabelFromPillNode(_0x348277, _0x27d3a9) || _0x27d3a9;
                  const _0x1e0417 = _0x59a913["replace"](/\s+/g, '');
                  const _0xf5cfda = _0x451220 && _0x5a398a[_0x451220] || _0x45514a[_0x1e0417];
                  const _0x42db5a = getPromptInputSubmitLabelFromPillNode(_0x348277, _0xf5cfda?.["label"] || _0x59a913) || _0x59a913;
                  if (_0xf5cfda) {
                    _0xf5cfda["used"] = !![];
                    if (_0xf5cfda["content"]) {
                      _0x429a1a += '\x20' + _0xf5cfda["content"] + '\x20';
                    } else {
                      _0xf5cfda["url"] && (_0x429a1a += '\x20' + _0x42db5a + '\x20', _0x138eca(_0xf5cfda));
                    }
                  } else {
                    _0x429a1a += '\x20' + _0x42db5a + '\x20';
                  }
                } else {
                  _0x348277["tagName"] === 'BR' ? _0x429a1a += '\x0a' : _0x3d603b(_0x348277);
                }
              }
            }
          }
        };
        if (!_0x453715) {
          return '';
        }
        _0x3d603b(_0x453715);
        let _0x39d849 = _0x429a1a['replace'](/[\s\u00A0]+/g, '\x20')["trim"]();
        _0x16848d ? _0x39d849 = resolvePromptPresetTemplate(_0x16848d, _0x39d849) : _0x39d849 = _0x39d849 || '';
        return _0x39d849;
      };
      let _0xf1281f = _0x478909(this["promptEl"]);
      const _0x5c0a43 = _0x55cd15['flatMap'](_0x4afd33 => (_0x4afd33["labels"] || [_0x4afd33["label"]])["map"](_0x3c21cb => ({
        'ref': _0x4afd33,
        'label': _0x3c21cb
      })))['sort']((_0x12c9f0, _0x5c66f5) => _0x5c66f5["label"]["length"] - _0x12c9f0['label']["length"]);
      _0x5c0a43['forEach'](({
        ref: _0xc6c572,
        label: _0x5997ee
      }) => {
        if (!_0xc6c572["used"]) {
          const _0x206e57 = new RegExp(_0x5997ee["replace"](/[.*+?^${}()|[\]\\]/g, "\\$&")['replace'](/\s+/g, "[\\s\\u00A0]*"), 'g');
          if (_0x206e57["test"](_0xf1281f)) {
            _0xc6c572["used"] = !![];
            if (_0xc6c572["content"]) {
              _0xf1281f = _0xf1281f["replace"](_0x206e57, '\x20' + _0xc6c572["content"] + '\x20');
            } else {
              _0xc6c572["url"] && (_0xf1281f = _0xf1281f["replace"](_0x206e57, '\x20' + _0x5997ee["trim"]() + '\x20'), _0x138eca(_0xc6c572));
            }
          }
        }
      });
      let _0x370c7f = '';
      _0x2a5052["text"]["forEach"](_0x20e695 => {
        !_0x20e695['used'] && _0x20e695["content"] && (_0x370c7f += _0x20e695["content"] + '\x0a', _0x20e695["used"] = !![]);
      });
      _0x370c7f && (_0xf1281f = _0x370c7f + _0xf1281f);
      _0x55cd15['forEach'](_0x1d1f70 => {
        !_0x1d1f70["used"] && _0x1d1f70["url"] && !_0xfdb8be["includes"](_0x1d1f70["url"]) && _0x138eca(_0x1d1f70);
      });
      if (!_0xf1281f) {
        window['showToast']?.(a362_0x6a8287("aigenText.task.promptRequired"), "warn");
        return null;
      }
      const _0x235d9a = _0xa2e677();
      const _0x21f349 = this["_data"]["model"] || "apimart/kimi-k2-instruct";
      const _0x4b7cab = resolveModelProvider(_0x21f349, '', {
        'allowProviderHint': ![]
      });
      let _0xa06a52 = this['_data']["provider"];
      if (_0x235d9a["includes"](_0x21f349)) {
        _0xa06a52 = "custom";
      } else {
        if (_0x4b7cab) {
          _0xa06a52 = _0x4b7cab;
        } else {
          !_0xa06a52 && (_0xa06a52 = (_0x21f349["startsWith"]("gemini") || _0x21f349['startsWith']("gpt") || _0x21f349['startsWith']("claude")) && !_0x21f349["includes"]('/') ? "grsai" : 'openai');
        }
      }
      if (isRunningHubImageToTextModel(_0x21f349, _0xa06a52) && _0x56caa3["length"] === 0x0) {
        window["showToast"]?.(a362_0x6a8287("aigenText.task.imageReferenceRequired"), "warn");
        return null;
      }
      const _0x1b18e7 = _0x4b3645?.[this["nodeId"]] || this["_data"] || {};
      const _0x376637 = _0x1b18e7?.["providerProfileId"] || this["_data"]?.["providerProfileId"];
      const _0x54ac03 = resolveModelGenerationProviderProfileId(_0x21f349, _0xa06a52, _0x376637);
      return {
        'prompt': _0xf1281f,
        'inputUrls': _0xfdb8be,
        'inputImageUrls': _0x56caa3,
        'inputVideoUrls': _0x936391,
        'inputAudioUrls': _0x193807,
        'model': _0x21f349,
        'provider': _0xa06a52,
        ...(_0x54ac03 ? {
          'providerProfileId': _0x54ac03
        } : {}),
        'generationParams': _0x1b18e7?.["generationParams"] && typeof _0x1b18e7['generationParams'] === "object" && !Array['isArray'](_0x1b18e7['generationParams']) ? {
          ..._0x1b18e7["generationParams"]
        } : {},
        'nodeId': this['nodeId']
      };
    }
    ['_getPreviewGenerateButtonLoadingOptions']() {
      return createPreviewGenerateButtonCallbacks(this, a362_0x6a8287("aigenText.generate"));
    }
    async ["runGeneration"](_0xfc5d50 = {}) {
      return this['_onGenerate'](null, _0xfc5d50);
    }
    ["cancelGeneration"]() {
      return {
        'ok': ![],
        'status': "not-cancellable",
        'message': "Text generation is not cancellable yet."
      };
    }
    ["getGenerationStatus"]() {
      const _0x5bcd31 = _0x4450e3["getState"]?.()?.["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x475ab4 = String(_0x5bcd31["jobStatus"] || _0x5bcd31['textJobStatus'] || (this["_isGenerating"] ? "running" : "idle"));
      return {
        'nodeId': this["nodeId"],
        'jobStatus': _0x475ab4,
        'isGenerating': this["_isGenerating"] === !![] || _0x475ab4 === "running" || _0x475ab4 === "pending",
        'taskId': String(_0x5bcd31["taskId"] || _0x5bcd31["asyncTaskId"] || ''),
        'cancellable': ![],
        'resumable': ![]
      };
    }
    async ["_onGenerate"](_0x4ec5cb = null, _0x2500af = {}) {
      if (this["_isGenerating"]) {
        return;
      }
      if (_0x2500af?.['insertPrompt'] === !![]) {
        insertPresetPromptIntoEditor({
          'storeApi': _0x4450e3,
          'nodeId': this["nodeId"],
          'promptEl': this["promptEl"],
          'template': _0x4ec5cb,
          'inEdges': _0x4450e3["getIncomingEdges"](this["nodeId"]),
          'nodes': _0x4450e3["getState"]()['nodes'] || {},
          'allowedAssetTypes': ["text", "image", 'video', "audio"]
        });
        this['_updateSubmitButtonState']?.();
        return;
      }
      if (shouldUsePromptPreviewForPreset(_0x4ec5cb)) {
        const _0x5f174c = await this["_buildPayload"](_0x4ec5cb);
        if (!_0x5f174c) {
          return;
        }
        previewPresetPromptInEditor({
          'storeApi': _0x4450e3,
          'nodeId': this["nodeId"],
          'promptEl': this["promptEl"],
          'promptText': _0x5f174c['prompt']
        });
        return;
      }
      if (isPreviewModeEnabled()) {
        !isPreviewNodeLoading(this["nodeId"]) && startPreviewNodeLoading(this["nodeId"], this["previewEl"], this["_getPreviewGenerateButtonLoadingOptions"]());
        return;
      }
      const _0x4cbe4a = _0x4450e3["getState"]?.()?.["nodes"]?.[this["nodeId"]] || this["_data"] || {};
      const _0x36f5be = guardModelGenerationCredentials({
        'modelId': _0x4cbe4a?.["model"],
        'provider': _0x4cbe4a?.['provider'],
        'providerProfileId': _0x4cbe4a?.["providerProfileId"] || _0x4cbe4a?.["rhProviderProfileId"]
      });
      if (!_0x36f5be["ready"]) {
        return;
      }
      const _0x4e1d8d = await this["_buildPayload"](_0x4ec5cb);
      if (!_0x4e1d8d) {
        return;
      }
      const _0x39741d = resolveModelExecution(_0x4e1d8d["model"], {
        'providerHint': _0x4e1d8d["provider"]
      }) || resolveModelExecution(_0x4e1d8d["model"]);
      const _0x1d0d6b = _0x39741d?.["executionManifest"]?.["adapterType"] || "modelApi";
      const _0x14100f = _0x39741d?.['executionManifest']?.['id'] || "text." + (_0x4e1d8d["provider"] || this['_data']["provider"] || "modelApi") + '.' + (_0x4e1d8d["model"] || this['_data']['model'] || "default");
      this["_isGenerating"] = !![];
      _0x591994(this['previewEl']);
      const _0x20911d = Date["now"]();
      this['_updateSubmitButtonState']?.();
      let _0x5bf93e = null;
      try {
        _0x5bf93e = await submitTask({
          'sourceNodeId': this["nodeId"],
          'targetNodeId': this["nodeId"],
          'trigger': "node",
          'taskType': "text-generation",
          'provider': _0x4e1d8d['provider'] || this["_data"]["provider"] || '',
          'adapterType': _0x1d0d6b,
          'modelId': _0x4e1d8d['model'] || this["_data"]["model"] || '',
          'executionId': _0x14100f,
          'payload': _0x4e1d8d,
          'cancellable': ![],
          'resumable': ![],
          'async': ![],
          'submit': () => _0x809afb["generateText"](_0x4e1d8d),
          'resultBuilder': async (_0x4ec03d, _0x51948d) => {
            const _0x38009e = buildTextGenerationResultPatch(_0x4ec03d, {
              'startedAt': _0x51948d["startedAt"]
            });
            return _0x38009e;
          },
          'failureBuilder': (_0x1a5fe2, _0xe24b46) => {
            const _0xfa133c = buildTextGenerationFailurePatch({
              'error': _0x1a5fe2 || a362_0x6a8287("aigenText.task.generationFailed"),
              'startedAt': _0xe24b46["startedAt"]
            });
            return _0xfa133c;
          },
          'parseError': _0x28e0c7 => _0x28e0c7?.["message"] || a362_0x6a8287("aigenText.task.generationFailed")
        }, {
          'store': _0x4450e3,
          'startedAt': _0x20911d
        });
        if (_0x5bf93e["status"] === "failed") {
          const _0x1e2cec = _0x5bf93e["error"];
          console["error"]("[AIGenTextNode] 生成失败:", _0x1e2cec);
          const _0x5e6292 = showProviderApiKeyMissingToastForError(_0x1e2cec, {
            'providerId': _0x4e1d8d?.['providerProfileId'] || _0x4e1d8d?.["provider"],
            'model': _0x4e1d8d?.["model"],
            'adapterType': _0x1d0d6b
          });
          !_0x5e6292 && !isTextGenerationTimeoutError(_0x1e2cec) && window["showToast"]?.(a362_0x6a8287("aigenText.task.generationFailedWithError", {
            'error': _0x1e2cec?.["message"] || _0x1e2cec
          }), "error");
        }
        return _0x5bf93e;
      } finally {
        this['_isGenerating'] = ![];
        this['_updateSubmitButtonState']?.();
        _0x473e7e(this["previewEl"]);
      }
    }
  }
  return _0x3df77b["prototype"];
}