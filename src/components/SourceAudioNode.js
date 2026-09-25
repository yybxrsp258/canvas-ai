import a514_0xc6b696 from '../core/stores/appStore.js';
import { bindRendererMediaPlaybackPin } from './shared/rendererMediaPlaybackPin.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { uploadFile } from '../modules/project.js';
import { cancelAudioSeparationTaskForNode, getRunningAudioSeparationTaskForNode, maybeResumeAudioSeparationLeader, runAudioSeparationFromNode } from '../modules/AudioSeparationController.js';
import { registerStaticInnerHTML, setStaticInnerHTML } from '../utils/dom.js';
import { startLoading, stopLoading } from '../modules/loadingOverlay.js';
import a514_0x2edcd6 from '../modules/AudioClipController.js';
import { SOURCE_AUDIO_TOOLBAR_HTML } from './NodeToolbarConfig.js';
import { getAudioNodeWaveformPath } from '../utils/audioWaveform.js';
import { createAudioPlaybackProgressController } from '../utils/audioPlaybackProgress.js';
import { normalizeAudioDurationSec, pickAudioDurationSec } from '../services/audioMetadataService.js';
import { beginAudioPlayback, registerAudioPlaybackClient } from '../modules/audioPlaybackCoordinator.js';
import { resolveCanvasAudioUrl } from '../services/canvasMediaLocalService.js';
import { attachMediaElementPlaybackSource, clearDesktopMediaPlaybackSourceMetadata, getMediaElementCurrentSource, getMediaElementPlaybackSourceKey, isMediaElementPlaybackSource } from '../services/desktopMediaBlobSource.js';
import { shouldShowGenerationResultLoadingUi } from '../core/generationTaskUiState.js';
import { localPathToUrl, pickResultLocalPath, urlToLocalPath } from '../utils/localMediaPath.js';
import { bindRunningHubToolbarTaskButton } from './nodeToolbar/runningHubToolbarTaskButton.js';
import { bindAudioDownloadAction } from './nodeToolbar/audioActions/downloadAction.js';
import { bindAudioVoiceStudioAction } from './nodeToolbar/audioActions/voiceStudioAction.js';
import { bindPreviewUploadToolbarAction } from '../modules/previewUploadEntry.js';
const WAVE = 'M10,40\x20L10,40\x20M15,30\x20L15,50\x20M20,20\x20L20,60\x20M25,35\x20L25,45\x20M30,25\x20L30,55\x20M35,15\x20L35,65\x20M40,30\x20L40,50\x20M45,38\x20L45,42\x20M50,22\x20L50,58\x20M55,18\x20L55,62\x20M60,28\x20L60,52\x20M65,32\x20L65,48\x20M70,24\x20L70,56\x20M75,36\x20L75,44\x20M80,20\x20L80,60\x20M85,16\x20L85,64\x20M90,26\x20L90,54\x20M95,34\x20L95,46\x20M100,22\x20L100,58\x20M105,18\x20L105,62\x20M110,30\x20L110,50\x20M115,38\x20L115,42\x20M120,15\x20L120,65\x20M125,25\x20L125,55\x20M130,35\x20L130,45\x20M135,20\x20L135,60\x20M140,30\x20L140,50\x20M145,40\x20L145,40\x20M150,25\x20L150,55\x20M155,15\x20L155,65\x20M160,30\x20L160,50\x20M165,38\x20L165,42\x20M170,22\x20L170,58\x20M175,18\x20L175,62\x20M180,28\x20L180,52\x20M185,32\x20L185,48\x20M190,24\x20L190,56';
const AUDIO_PLAY_LOADING_DEADLINE_MS = 0x1388;
function sourceAudioText(_0x548955, _0x760bac = {}) {
  return t("sourceAudioNode." + _0x548955, _0x760bac);
}
const _SOURCE_AUDIO_NODE_TEMPLATE_ID = "node:source-audio";
registerStaticInnerHTML(_SOURCE_AUDIO_NODE_TEMPLATE_ID, SOURCE_AUDIO_TOOLBAR_HTML + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22node-card\x20media-card\x20audio-card\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22waveform\x20waveform-bg\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<svg\x20width=\x22100%\x22\x20height=\x2280\x22\x20viewBox=\x220\x200\x20200\x2080\x22\x20preserveAspectRatio=\x22none\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<path\x20d=\x22' + WAVE + "\" stroke=\"var(--blue)\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n            <path d=\"M0,40 L200,40\" stroke=\"var(--blue)\" stroke-width=\"1\" stroke-dasharray=\"2 4\" opacity=\"0.4\"/>\n          </svg>\n        </div>\n        <div class=\"waveform waveform-unplayed\">\n          <svg width=\"100%\" height=\"80\" viewBox=\"0 0 200 80\" preserveAspectRatio=\"none\">\n            <path d=\"" + WAVE + "\" stroke=\"var(--blue)\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n            <path d=\"M0,40 L200,40\" stroke=\"var(--blue)\" stroke-width=\"1\" stroke-dasharray=\"2 4\" opacity=\"0.4\"/>\n          </svg>\n        </div>\n        <div class=\"media-progress-line\"></div>\n        <div class=\"media-progress-bar\"></div>\n        \n        <div class=\"node-upload-hint audio-upload-hint source-upload-hint\">\n          <button type=\"button\" class=\"upload-btn audio-upload-btn source-upload-btn\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"17 8 12 3 7 8\"/><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"15\"/></svg>\n          </button>\n        </div>\n\n        <div class=\"audio-controls\">\n           <button type=\"button\" class=\"audio-play-btn\">\n              <svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg>\n           </button>\n           <div class=\"audio-time-wrap\">\n             <span class=\"audio-time-display\">0:00 / 0:00</span>\n           </div>\n        </div>\n        <audio class=\"audio-player\"></audio>\n        <div class=\"node-port out-port\"></div>\n        <div class=\"node-resizer\"></div>\n      </div>");
export class SourceAudioNode {
  constructor(_0x39123d) {
    this["_data"] = _0x39123d;
    this['el'] = document['createElement']('div');
    this['id'] = _0x39123d['id'];
    this['el']["className"] = "v2-node-component";
    this["_currentSrc"] = null;
    this["_objUrl"] = null;
    this["_waveKey"] = null;
    this["_waveformLocalPath"] = '';
    this['_waveToken'] = 0x0;
    this["_cancelDeferredWaveform"] = null;
    this["_waveformAbortController"] = null;
    this["_progressController"] = null;
    this["_audioDurationProbeToken"] = 0x0;
    this['_audioLoadToken'] = 0x0;
    this["_audioLoadInFlightSource"] = '';
    this["_audioLoadInFlightPreload"] = '';
    this['_audioPlayAttemptToken'] = 0x0;
    this["_audioPlayDeadlineTimer"] = null;
    this["_audioPlayPending"] = ![];
    this["_playbackResumeSource"] = '';
    this["_playbackResumeTime"] = 0x0;
    this["_isUploading"] = ![];
    this["_unsubscribeLocale"] = null;
    this["_toolbarActionCleanups"] = [];
  }
  ["_resolveAudioSrc"](_0xf156eb) {
    return resolveCanvasAudioUrl(_0xf156eb);
  }
  ["mount"]() {
    this['_clearToolbarActionBindings']();
    this["_subscribeLocaleChanges"]();
    const _0x148de8 = this['el'];
    setStaticInnerHTML(_0x148de8, _SOURCE_AUDIO_NODE_TEMPLATE_ID);
    this["_card"] = _0x148de8["querySelector"](".media-card");
    this["_audio"] = _0x148de8["querySelector"]('.audio-player');
    this['_audio']["preload"] = 'none';
    this["_playBtn"] = _0x148de8["querySelector"]('.audio-play-btn');
    this['_timeEl'] = _0x148de8["querySelector"]('.audio-time-display');
    this["_bar"] = _0x148de8["querySelector"](".media-progress-bar");
    this["_wavePlayed"] = _0x148de8["querySelector"](".waveform-unplayed");
    this["_progressLine"] = _0x148de8["querySelector"](".media-progress-line");
    this['_hint'] = _0x148de8["querySelector"](".node-upload-hint");
    this["_uploadBtn"] = _0x148de8["querySelector"]('.upload-btn');
    this["_clipBtn"] = _0x148de8['querySelector'](".act-clip, .clip-btn");
    this["_separateBtn"] = _0x148de8["querySelector"](".act-separate, .separate-btn");
    this["_voiceStudioBtn"] = _0x148de8["querySelector"](".act-voice-studio");
    this["_speedBtn"] = _0x148de8["querySelector"]('.act-speed,\x20.speed-btn');
    this["_toolbarUploadBtn"] = _0x148de8["querySelector"](".act-upload");
    this["_downloadBtn"] = _0x148de8['querySelector']('.act-download,\x20.download-btn');
    this["_syncLocaleTexts"]();
    {
      const _0x52fe10 = _0x148de8["querySelectorAll"](".waveform-bg svg path");
      this['_waveBgPath'] = _0x52fe10 && _0x52fe10["length"] ? _0x52fe10[0x0] : null;
      const _0x246af7 = _0x148de8['querySelectorAll'](".waveform-unplayed svg path");
      this["_waveFgPath"] = _0x246af7 && _0x246af7["length"] ? _0x246af7[0x0] : null;
    }
    this["_progressController"] = createAudioPlaybackProgressController({
      'audioEl': this["_audio"],
      'wavePlayedEl': this["_wavePlayed"],
      'progressLineEl': this["_progressLine"],
      'timeEl': this["_timeEl"],
      'trackEl': this["_bar"],
      'formatTime': _0x280349 => this["_fmt"](_0x280349),
      'shouldSuppressSync': () => this["_isSeeking"] || this['_bar']?.['dataset']["dragging"] === "true"
    })["attach"]();
    const _0x4377c3 = _0x148de8["querySelector"](".node-floating-toolbar");
    if (_0x4377c3) {
      _0x4377c3["addEventListener"]("pointerdown", _0x1349be => _0x1349be["stopPropagation"]());
    }
    this["_input"] = document["createElement"]("input");
    this["_input"]["type"] = "file";
    this["_input"]["accept"] = "audio/*";
    this["_input"]["style"]['display'] = 'none';
    _0x148de8["appendChild"](this["_input"]);
    this["_uploadBtn"]["addEventListener"]("pointerdown", _0xc7f2e3 => {
      _0xc7f2e3["stopPropagation"]();
      this["_input"]["click"]();
    });
    this["_card"]["addEventListener"]('dblclick', _0x4c0c05 => {
      _0x4c0c05["stopPropagation"]();
    });
    let _0x3b50db = {
      'x': 0x0,
      'y': 0x0
    };
    this["_card"]["addEventListener"]("pointerdown", _0x3fb25c => {
      if (_0x3fb25c['target']["closest"](".media-progress-bar")) {
        return;
      }
      _0x3b50db = {
        'x': _0x3fb25c["clientX"],
        'y': _0x3fb25c["clientY"]
      };
    });
    this["_card"]['addEventListener']('pointerup', _0x2deaa2 => {
      if (_0x2deaa2["target"]["closest"]('.media-progress-bar') || _0x2deaa2["target"]["closest"](".audio-play-btn") || _0x2deaa2['target']["closest"](".upload-btn") || _0x2deaa2["target"]["closest"](".node-floating-toolbar")) {
        return;
      }
      const _0x5be2f9 = Math["hypot"](_0x2deaa2["clientX"] - _0x3b50db['x'], _0x2deaa2['clientY'] - _0x3b50db['y']);
      if (_0x5be2f9 < 0x5) {
        const _0x4580b3 = this["_card"]["getBoundingClientRect"]();
        const _0x3cd558 = Math["max"](0x0, Math["min"](0x1, (_0x2deaa2["clientX"] - _0x4580b3["left"]) / _0x4580b3["width"]));
        const _0x1918da = this["_readAudioDurationSec"]();
        if (this["_audio"] && _0x1918da > 0x0) {
          const _0x18783b = _0x3cd558 * _0x1918da;
          this["_audio"]["currentTime"] = _0x18783b;
          this["_progressController"]?.['sync']({
            'currentTime': _0x18783b,
            'duration': _0x1918da,
            'force': !![],
            'showLine': !![]
          });
        }
      }
    });
    this["_bar"]?.["addEventListener"]('click', _0x218d40 => {
      this["_seekTo"](_0x218d40["clientX"]);
    });
    this["_input"]['addEventListener']("change", async _0xa4df8d => {
      const _0xb640b2 = _0xa4df8d["target"]["files"][0x0];
      if (!_0xb640b2) {
        return;
      }
      startLoading(this["_card"], {
        'variant': "static"
      });
      this['_progressController']?.["reset"]();
      const _0xc41b89 = Array["from"](this["_uploadBtn"]['childNodes'])['map'](_0x2f656b => _0x2f656b['cloneNode'](!![]));
      this['_isUploading'] = !![];
      this['_uploadBtn']['textContent'] = sourceAudioText("upload.uploading");
      this["_uploadBtn"]["style"]["pointerEvents"] = "none";
      try {
        const _0x5a4f49 = window["currentProjectId"] || "default_v2_project";
        const _0x20853a = await uploadFile(_0xb640b2, _0x5a4f49);
        const _0x50a7ef = _0xb640b2["name"]["replace"](/\.[^/.]+$/, '');
        a514_0xc6b696["renameNode"](this['id'], _0x50a7ef);
        const _0x19a17b = document["getElementById"](this['id']);
        const _0x3ab122 = _0x19a17b?.["__v2_name_el"];
        if (_0x3ab122) {
          _0x3ab122["textContent"] = _0x50a7ef;
        }
        const _0x35e4c5 = _0x20853a["url"];
        const _0x445c15 = pickResultLocalPath(_0x20853a) || urlToLocalPath(_0x35e4c5);
        a514_0xc6b696["updateNodeData"](this['id'], {
          'src': _0x35e4c5,
          'localPath': _0x445c15,
          'audioDuration': Number(_0x20853a["audioDuration"] || _0x20853a["duration"] || 0x0) || 0x0,
          'assetId': _0x20853a["assetId"] || '',
          'originalLocalPath': _0x20853a["originalLocalPath"] || _0x20853a['localPath'] || '',
          'waveformLocalPath': _0x20853a['waveformLocalPath'] || '',
          'derivativeStatus': _0x20853a["derivativeStatus"] || _0x20853a["status"] || '',
          'mediaTaskId': _0x20853a['mediaTaskId'] || '',
          'mediaTaskKind': _0x20853a["mediaTaskKind"] || '',
          'mediaTaskStatus': _0x20853a['mediaTaskStatus'] || '',
          'mediaTaskProgress': Number(_0x20853a["mediaTaskProgress"] || 0x0) || 0x0,
          'mediaTaskError': _0x20853a["mediaTaskError"] || '',
          'fileName': _0x20853a["filename"] || _0xb640b2["name"]
        });
      } catch (_0x23a868) {
        console["error"]('音频上传失败:', _0x23a868);
        window["showToast"](sourceAudioText("upload.failedRetry"));
        stopLoading(this["_card"]);
        this["_currentSrc"] && this['_progressController']?.["sync"]({
          'force': !![],
          'showLine': !![]
        });
      } finally {
        this["_uploadBtn"]["replaceChildren"](..._0xc41b89["map"](_0x2996aa => _0x2996aa["cloneNode"](!![])));
        this['_uploadBtn']['style']['pointerEvents'] = 'auto';
        this['_isUploading'] = ![];
        this["_syncLocaleTexts"]();
        this['_input']["value"] = '';
      }
    });
    this['_playBtn']['addEventListener']("pointerdown", _0xd00689 => {
      _0xd00689["stopPropagation"]();
      this['_audio']["paused"] && this["_currentSrc"] ? this["_playAudio"]() : this["_audio"]["pause"]();
    });
    const _0x299f96 = [0x1, 1.25, 1.5, 0x2];
    let _0x1c9bd9 = 0x0;
    this["_speedBtn"]?.["addEventListener"]('pointerdown', _0x108078 => {
      _0x108078["stopPropagation"]();
      _0x1c9bd9 = (_0x1c9bd9 + 0x1) % _0x299f96["length"];
      const _0x271563 = _0x299f96[_0x1c9bd9];
      this["_audio"]["playbackRate"] = _0x271563;
      this['_speedBtn']["textContent"] = _0x271563['toFixed'](0x1) + 'x';
    });
    this['_clipBtn']?.["addEventListener"]("pointerdown", _0x28c7d8 => {
      _0x28c7d8["stopPropagation"]();
      a514_0x2edcd6['init'](this['id']);
    });
    this["_toolbarActionCleanups"]['push'](bindRunningHubToolbarTaskButton({
      'button': this["_separateBtn"],
      'getTask': () => getRunningAudioSeparationTaskForNode(this['id']),
      'cancelTask': () => cancelAudioSeparationTaskForNode(this['id'], {
        'notify': !![]
      }),
      'cancelTooltip': sourceAudioText("toolbar.cancelAudioSeparation"),
      'eventTypes': ["pointerdown", "click"]
    }));
    this["_separateBtn"]?.["addEventListener"]("pointerdown", _0x2bcacf => {
      if (getRunningAudioSeparationTaskForNode(this['id'])) {
        _0x2bcacf["preventDefault"]();
        _0x2bcacf["stopPropagation"]();
        void cancelAudioSeparationTaskForNode(this['id'], {
          'notify': !![]
        });
        return;
      }
      _0x2bcacf["stopPropagation"]();
      void runAudioSeparationFromNode(this['id']);
    });
    this["_toolbarActionCleanups"]['push'](bindPreviewUploadToolbarAction({
      'button': this["_toolbarUploadBtn"]
    }), bindAudioDownloadAction({
      'button': this["_downloadBtn"],
      'getNodeData': () => a514_0xc6b696["getState"]()['nodes']?.[this['id']] || this["_data"] || {},
      'getAudioElement': () => this["_audio"],
      'notifyMissing': () => window["showToast"]?.(sourceAudioText("download.missingAudio"), "warn")
    }), bindAudioVoiceStudioAction({
      'button': this["_voiceStudioBtn"],
      'getNodeId': () => this['id']
    }));
    this["_audio"]['addEventListener']('play', () => this["_setIcon"](![]));
    this["_audio"]["addEventListener"]("pause", () => {
      this['_setPlaybackBuffering'](![]);
      this["_setIcon"](!![]);
    });
    this["_audio"]["addEventListener"]("waiting", () => {
      if (this['_audio']?.["paused"] === ![]) {
        this['_setPlaybackBuffering'](!![]);
      }
    });
    this["_audio"]['addEventListener']("playing", () => {
      this["_setPlaybackBuffering"](![]);
    });
    this["_audio"]["addEventListener"]('ended', () => {
      this['_setPlaybackBuffering'](![]);
    });
    this["_unregisterAudioPlaybackClient"]?.();
    this['_unregisterAudioPlaybackClient'] = registerAudioPlaybackClient(this['id'], {
      'stopForExternalPlayback': () => this["_stopAudioForExternalPlayback"]()
    });
    this['_releaseRendererPlaybackPin']?.();
    this["_releaseRendererPlaybackPin"] = bindRendererMediaPlaybackPin(this['_audio'], this['id']);
    const _0x27dea0 = this["_resolveAudioSrc"](this["_data"]);
    if (_0x27dea0) {
      this["_prepareAudio"](_0x27dea0);
      if (this["_hint"]) {
        this["_hint"]["style"]["display"] = "block";
      }
    } else {
      this["_progressController"]?.["reset"]();
      if (this["_hint"]) {
        this["_hint"]['style']["display"] = "block";
      }
    }
    this["_syncGeneratingUi"](this["_data"], _0x27dea0);
    maybeResumeAudioSeparationLeader(this['id']);
    return _0x148de8;
  }
  ['_syncGeneratingUi'](_0x1b8b68, _0xe2504c) {
    const _0x423003 = shouldShowGenerationResultLoadingUi(_0x1b8b68, {
      'hasResult': !!_0xe2504c
    });
    if (this["_uploadBtn"]) {
      this["_uploadBtn"]["disabled"] = _0x423003;
    }
    if (_0x423003) {
      startLoading(this["_card"], {
        'variant': "full"
      });
      if (this['_hint']) {
        this['_hint']["style"]["display"] = 'none';
      }
      return;
    }
    stopLoading(this["_card"]);
    this['_clearResolvedAudioTimer'](_0x1b8b68, _0xe2504c);
    if (!_0xe2504c && this["_hint"]) {
      this['_hint']["style"]["display"] = "block";
    }
  }
  ['_clearResolvedAudioTimer'](_0x301be7, _0x35261d) {
    if (!_0x35261d || !_0x301be7 || typeof _0x301be7 !== "object") {
      return;
    }
    if (!_0x301be7["generationStartTime"] && _0x301be7["generationDuration"] == null) {
      return;
    }
    const _0x2e154b = a514_0xc6b696['getState']()["nodes"]?.[this['id']];
    if (!_0x2e154b) {
      return;
    }
    const _0x10a7d5 = {};
    if (_0x2e154b['generationStartTime']) {
      _0x10a7d5['generationStartTime'] = null;
    }
    if (_0x2e154b["generationDuration"] != null) {
      _0x10a7d5['generationDuration'] = null;
    }
    if (_0x2e154b["isGenerating"] === !![]) {
      _0x10a7d5["isGenerating"] = ![];
    }
    Object["keys"](_0x10a7d5)["length"] > 0x0 && a514_0xc6b696['updateNodeData'](this['id'], _0x10a7d5);
  }
  ["_seekTo"](_0x3c231d) {
    const _0x2a569e = this['_readAudioDurationSec']();
    if (!this["_audio"] || _0x2a569e <= 0x0) {
      return;
    }
    const _0x2ee2bc = this['_bar']["getBoundingClientRect"]();
    if (_0x2ee2bc["width"] === 0x0) {
      return;
    }
    let _0x394023 = (_0x3c231d - _0x2ee2bc["left"]) / _0x2ee2bc["width"];
    _0x394023 = Math['max'](0x0, Math["min"](0x1, _0x394023));
    const _0x3ca91c = _0x394023 * _0x2a569e;
    if (!isFinite(_0x3ca91c)) {
      return;
    }
    this["_isSeeking"] = !![];
    this["_audio"]["currentTime"] = _0x3ca91c;
    this['_progressController']?.["sync"]({
      'currentTime': _0x3ca91c,
      'duration': _0x2a569e,
      'force': !![],
      'showLine': !![]
    });
    this['_audio']["addEventListener"]("seeked", () => {
      this["_isSeeking"] = ![];
      this['_progressController']?.["sync"]({
        'force': !![],
        'showLine': !![]
      });
    }, {
      'once': !![]
    });
  }
  ["_getAudioElementSource"]() {
    return getMediaElementPlaybackSourceKey(this["_audio"]);
  }
  ["_getAudioElementCurrentSource"]() {
    return getMediaElementCurrentSource(this["_audio"]);
  }
  ["_isAudioElementReady"]() {
    if (!this["_audio"] || !this["_getAudioElementCurrentSource"]()) {
      return ![];
    }
    const _0x261128 = Number(this['_audio']["readyState"] || 0x0);
    return _0x261128 >= 0x2;
  }
  ['_readAudioDurationSec']() {
    const _0x1c0d5e = normalizeAudioDurationSec(this["_audio"]?.["duration"]);
    const _0x7eddb0 = a514_0xc6b696['getStateRaw']()["nodes"]?.[this['id']];
    const _0x3e2ddd = pickAudioDurationSec(_0x7eddb0?.["audioDuration"], !_0x7eddb0 ? this["_data"]?.["audioDuration"] : 0x0);
    if (_0x3e2ddd > 0x0) {
      if (!(_0x1c0d5e > 0x0)) {
        return _0x3e2ddd;
      }
      const _0x94849b = Math["max"](0x1, _0x3e2ddd * 0.25);
      if (Math['abs'](_0x3e2ddd - _0x1c0d5e) > _0x94849b) {
        return _0x3e2ddd;
      }
    }
    return _0x1c0d5e;
  }
  ["_syncKnownAudioDurationUi"]({
    currentTime = 0x0,
    showLine = ![]
  } = {}) {
    const _0xe5606f = this["_readAudioDurationSec"]();
    if (!(_0xe5606f > 0x0)) {
      return ![];
    }
    const _0x46a0bb = Number(currentTime);
    const _0x201629 = Number["isFinite"](_0x46a0bb) ? Math["max"](0x0, Math["min"](_0x46a0bb, _0xe5606f)) : 0x0;
    const _0xf4c63e = this["_progressController"]?.['sync']({
      'currentTime': _0x201629,
      'duration': _0xe5606f,
      'force': !![],
      'showLine': showLine
    });
    if (!showLine) {
      this["_progressController"]?.['hideLine']?.();
    }
    !_0xf4c63e && this['_timeEl'] && (this['_timeEl']['textContent'] = this["_fmt"](_0x201629) + '\x20/\x20' + this['_fmt'](_0xe5606f));
    return !![];
  }
  ["_applyResolvedAudioDuration"](_0x32948d, _0x17c96a = this['_currentSrc']) {
    if (_0x17c96a && this["_currentSrc"] !== _0x17c96a) {
      return ![];
    }
    const _0x5cec4d = normalizeAudioDurationSec(_0x32948d);
    if (!(_0x5cec4d > 0x0)) {
      return ![];
    }
    const _0x30a488 = a514_0xc6b696["getStateRaw"]()['nodes']?.[this['id']];
    const _0x471fa9 = pickAudioDurationSec(_0x30a488?.["audioDuration"], this['_data']?.["audioDuration"]);
    if (_0x471fa9 > 0x0) {
      if (Math["abs"](_0x471fa9 - _0x5cec4d) <= 0.001) {
        return this['_syncKnownAudioDurationUi']({
          'currentTime': this["_audio"]?.["currentTime"] || 0x0,
          'showLine': Number(this["_audio"]?.["currentTime"] || 0x0) > 0x0
        });
      }
      const _0x27e61f = Math["max"](0x1, _0x471fa9 * 0.25);
      if (Math["abs"](_0x471fa9 - _0x5cec4d) > _0x27e61f) {
        return ![];
      }
    }
    _0x30a488 ? (a514_0xc6b696['updateNodeData'](this['id'], {
      'audioDuration': _0x5cec4d
    }), this["_data"] = {
      ...(this["_data"] || {}),
      'audioDuration': _0x5cec4d
    }, this["_syncKnownAudioDurationUi"]({
      'currentTime': this["_audio"]?.['currentTime'] || 0x0,
      'showLine': Number(this["_audio"]?.["currentTime"] || 0x0) > 0x0
    })) : (this["_data"] = {
      ...(this["_data"] || {}),
      'audioDuration': _0x5cec4d
    }, this['_syncKnownAudioDurationUi']({
      'currentTime': this["_audio"]?.["currentTime"] || 0x0,
      'showLine': Number(this["_audio"]?.["currentTime"] || 0x0) > 0x0
    }));
    return !![];
  }
  ['_rewindEndedAudioIfNeeded']() {
    if (!this['_audio']) {
      return;
    }
    const _0x2fb0b2 = this["_readAudioDurationSec"]();
    if (!(_0x2fb0b2 > 0x0)) {
      return;
    }
    const _0x4b250e = Number(this["_audio"]["currentTime"] || 0x0);
    const _0x1dcefe = Number["isFinite"](_0x4b250e) && _0x4b250e >= _0x2fb0b2 - 0.05;
    if (this["_audio"]["ended"] !== !![] && !_0x1dcefe) {
      return;
    }
    try {
      this['_audio']["currentTime"] = 0x0;
    } catch {}
    this['_progressController']?.["sync"]({
      'currentTime': 0x0,
      'duration': _0x2fb0b2,
      'force': !![],
      'showLine': !![]
    });
  }
  ["_setPlaybackBuffering"](_0x435656) {
    const _0x513c61 = this['_playBtn'];
    if (!_0x513c61) {
      return;
    }
    _0x513c61["classList"]?.["toggle"]?.('is-buffering', _0x435656 === !![]);
    if (_0x435656 === !![]) {
      _0x513c61["setAttribute"]?.('aria-busy', "true");
    } else {
      _0x513c61["removeAttribute"]?.('aria-busy');
    }
  }
  ['_clearPlaybackResume']() {
    this["_playbackResumeSource"] = '';
    this["_playbackResumeTime"] = 0x0;
  }
  ["_restorePlaybackPosition"](_0x462d1a) {
    if (!this["_audio"] || Number(this["_audio"]['readyState'] || 0x0) < 0x1 || this["_currentSrc"] !== _0x462d1a || this["_playbackResumeSource"] !== _0x462d1a) {
      return ![];
    }
    const _0x3321e8 = Number(this['_playbackResumeTime'] || 0x0);
    let _0x52a508 = Number["isFinite"](_0x3321e8) ? Math["max"](0x0, _0x3321e8) : 0x0;
    const _0x216472 = this["_readAudioDurationSec"]();
    if (_0x216472 > 0x0) {
      _0x52a508 = Math["min"](_0x52a508, _0x216472);
      if (_0x52a508 >= _0x216472 - 0.05) {
        _0x52a508 = 0x0;
      }
    }
    try {
      this["_audio"]["currentTime"] = _0x52a508;
    } catch {
      return ![];
    }
    this["_clearPlaybackResume"]();
    _0x216472 > 0x0 && this['_progressController']?.["sync"]({
      'currentTime': _0x52a508,
      'duration': _0x216472,
      'force': !![],
      'showLine': _0x52a508 > 0x0
    });
    return !![];
  }
  ['_clearAudioElementSource']() {
    this["_setPlaybackBuffering"](![]);
    this["_audioPlayPending"] = ![];
    if (!this["_audio"]) {
      return;
    }
    this['_audioPlayAttemptToken'] = Number(this["_audioPlayAttemptToken"] || 0x0) + 0x1;
    this["_audioPlayDeadlineTimer"] && (clearTimeout(this['_audioPlayDeadlineTimer']), this["_audioPlayDeadlineTimer"] = null);
    this["_audioLoadToken"] = Number(this['_audioLoadToken'] || 0x0) + 0x1;
    this["_audioLoadInFlightSource"] = '';
    this["_audioLoadInFlightPreload"] = '';
    try {
      this["_audio"]['pause']?.();
    } catch {}
    this["_audio"]["removeAttribute"]?.('src');
    clearDesktopMediaPlaybackSourceMetadata(this["_audio"]);
    this["_audio"]["preload"] = "none";
    try {
      this["_audio"]['load']?.();
    } catch {}
  }
  ['_bindAudioLoadHandlers'](_0x209c1b) {
    if (!this["_audio"]) {
      return;
    }
    const _0x4dbf4c = () => {
      this["_currentSrc"] === _0x209c1b && (this["_rememberAudioDuration"](_0x209c1b), this['_restorePlaybackPosition'](_0x209c1b));
    };
    this['_audio']["onloadedmetadata"] = _0x4dbf4c;
    this['_audio']["ondurationchange"] = _0x4dbf4c;
    const _0x3e5bf6 = () => {
      this['_currentSrc'] === _0x209c1b && (this["_rememberAudioDuration"](_0x209c1b), this['_setPlaybackBuffering'](![]));
    };
    this['_audio']['onloadeddata'] = _0x3e5bf6;
    this["_audio"]["oncanplay"] = _0x3e5bf6;
    this["_audio"]["onplaying"] = _0x3e5bf6;
    this["_audio"]["onerror"] = () => {
      if (this['_currentSrc'] === _0x209c1b) {
        this["_setPlaybackBuffering"](![]);
      }
    };
  }
  ["_prepareAudio"](_0x4cae85) {
    if (!_0x4cae85) {
      typeof this["_cancelDeferredWaveform"] === "function" && (this['_cancelDeferredWaveform'](), this['_cancelDeferredWaveform'] = null);
      this['_cancelWaveformRequest']();
      this['_clearAudioElementSource']();
      this["_currentSrc"] = null;
      this["_clearPlaybackResume"]();
      this['_progressController']?.["reset"]();
      this["_audioDurationProbeToken"] += 0x1;
      stopLoading(this["_card"]);
      return;
    }
    const _0x117582 = this["_currentSrc"];
    const _0x417d5b = _0x117582 !== _0x4cae85;
    _0x417d5b && (this["_progressController"]?.["reset"](), this["_clearPlaybackResume"]());
    this["_currentSrc"] = _0x4cae85;
    if (_0x417d5b && _0x117582) {
      const _0x4462cb = a514_0xc6b696['getState']()["nodes"]?.[this['id']];
      Number(_0x4462cb?.["audioDuration"] || 0x0) > 0x0 && a514_0xc6b696['updateNodeData'](this['id'], {
        'audioDuration': 0x0
      });
    }
    const _0x5237f5 = !!this["_getAudioElementCurrentSource"]();
    const _0x574720 = _0x5237f5 && isMediaElementPlaybackSource(this["_audio"], _0x4cae85);
    this["_getAudioElementSource"]() && !_0x574720 && this["_clearAudioElementSource"]();
    if (!_0x574720) {
      this['_audio']["preload"] = "none";
    }
    this["_bindAudioLoadHandlers"](_0x4cae85);
    this["_syncKnownAudioDurationUi"]({
      'currentTime': 0x0,
      'showLine': ![]
    });
    stopLoading(this["_card"]);
    void this['_ensureWaveform'](_0x4cae85);
    if (this["_hint"]) {
      this["_hint"]['style']["display"] = "block";
    }
  }
  ["prepareRendererVisibleAudioSurface"]() {
    return ![];
  }
  async ["hydrateDeferredMedia"]() {
    return ![];
  }
  async ["_loadAudio"](_0x33d639, {
    showLoading = !![],
    preload = "auto"
  } = {}) {
    if (!_0x33d639) {
      this['_prepareAudio']('');
      return ![];
    }
    const _0x434391 = preload === "metadata" ? "metadata" : "auto";
    const _0x12fad8 = this["_currentSrc"];
    const _0x2e4f07 = _0x12fad8 !== _0x33d639;
    _0x2e4f07 && (this['_progressController']?.["reset"](), this['_clearPlaybackResume']());
    this["_currentSrc"] = _0x33d639;
    const _0x2c6d75 = Number(this["_audioLoadToken"] || 0x0) + 0x1;
    this['_audioLoadToken'] = _0x2c6d75;
    this['_audioLoadInFlightSource'] = _0x33d639;
    this["_audioLoadInFlightPreload"] = _0x434391;
    try {
      const _0x4bb63b = !!this["_getAudioElementCurrentSource"]();
      const _0x38c1ce = !isMediaElementPlaybackSource(this["_audio"], _0x33d639) || !_0x4bb63b;
      const _0x466ba2 = Number(this['_audio']?.["networkState"] || 0x0);
      const _0x259edb = Number(this['_audio']?.['readyState'] || 0x0);
      const _0xd529c0 = !_0x38c1ce && _0x259edb === 0x0 && (_0x466ba2 === 0x0 || _0x466ba2 === 0x1 || _0x466ba2 === 0x3);
      this["_bindAudioLoadHandlers"](_0x33d639);
      if (!_0x38c1ce && this["_isAudioElementReady"]()) {
        _0x434391 === 'auto' && this["_audio"]["preload"] !== 'auto' && (this["_audio"]["preload"] = "auto");
        this["_setPlaybackBuffering"](![]);
        return !![];
      }
      showLoading && (_0x38c1ce || _0xd529c0) && this["_setPlaybackBuffering"](!![]);
      if (this["_audioLoadToken"] !== _0x2c6d75 || this["_currentSrc"] !== _0x33d639) {
        if (showLoading) {
          this["_setPlaybackBuffering"](![]);
        }
        return ![];
      }
      if (!_0x38c1ce) {
        const _0x5a2ba9 = _0x434391 === "auto" || this['_audio']["preload"] === 'auto' ? "auto" : "metadata";
        this['_audio']["preload"] !== _0x5a2ba9 && (this["_audio"]["preload"] = _0x5a2ba9);
        if (_0xd529c0) {
          try {
            this["_audio"]['load']?.();
          } catch {}
        }
      } else {
        await attachMediaElementPlaybackSource(this["_audio"], _0x33d639, {
          'preload': _0x434391,
          'warmRanges': ![],
          'shouldAssign': () => this["_audioLoadToken"] === _0x2c6d75 && this["_currentSrc"] === _0x33d639 && this["_audio"]?.["isConnected"] !== ![]
        });
      }
      if (this["_isAudioElementReady"]()) {
        this["_setPlaybackBuffering"](![]);
      }
      if (this['_hint']) {
        this["_hint"]["style"]["display"] = "block";
      }
      return !![];
    } finally {
      this["_audioLoadToken"] === _0x2c6d75 && (this["_audioLoadInFlightSource"] = '', this['_audioLoadInFlightPreload'] = '');
    }
  }
  ["_cancelWaveformRequest"]() {
    this["_waveformLoadingKey"] = '';
    this["_waveToken"] = Number(this["_waveToken"] || 0x0) + 0x1;
    const _0x5ac52d = this["_waveformAbortController"];
    this["_waveformAbortController"] = null;
    try {
      _0x5ac52d?.["abort"]?.();
    } catch {}
  }
  async ['_ensureWaveform'](_0x27e723) {
    const _0x20b877 = String(_0x27e723 || '')['trim']();
    if (!_0x20b877 || this['_rendererWaveformVisible'] !== !![]) {
      return;
    }
    const _0x137ddb = JSON["stringify"]([_0x20b877, this["_data"]?.["waveformLocalPath"] || '']);
    if (_0x137ddb === this["_waveformLoadingKey"]) {
      return;
    }
    this['_cancelWaveformRequest']();
    if (_0x137ddb === this['_waveformLoadedKey']) {
      return;
    }
    this["_waveformLoadingKey"] = _0x137ddb;
    const _0x2844c9 = this["_waveToken"];
    const _0x5b3673 = typeof AbortController === 'function' ? new AbortController() : null;
    this["_waveformAbortController"] = _0x5b3673;
    this["_waveKey"] = _0x20b877;
    const _0x58c46a = localPathToUrl(this["_data"]?.["waveformLocalPath"]);
    this["_waveformLocalPath"] = String(this["_data"]?.["waveformLocalPath"] || '')["trim"]();
    let _0x26892f = 0x0;
    const _0x5b4035 = {
      'width': 0xc8,
      'height': 0x50,
      'samples': 0xbe,
      'signal': _0x5b3673?.['signal'],
      'onDuration': this["_readAudioDurationSec"]() > 0x0 ? undefined : _0x2068f0 => {
        _0x26892f = _0x2068f0;
      }
    };
    let _0x20b16b = '';
    try {
      _0x20b16b = await getAudioNodeWaveformPath(_0x20b877, _0x58c46a, _0x5b4035);
    } finally {
      this['_waveformAbortController'] === _0x5b3673 && (this["_waveformAbortController"] = null, this["_waveformLoadingKey"] = '');
    }
    if (_0x5b3673?.["signal"]?.["aborted"]) {
      return;
    }
    if (!this["_audio"] || !this['el'] || !this['el']["isConnected"]) {
      return;
    }
    if (_0x2844c9 !== this['_waveToken']) {
      return;
    }
    this["_applyResolvedAudioDuration"](_0x26892f, _0x20b877);
    if (!_0x20b16b) {
      return;
    }
    this["_waveformLoadedKey"] = _0x137ddb;
    if (this["_waveBgPath"]) {
      this["_waveBgPath"]["setAttribute"]('d', _0x20b16b);
    }
    if (this["_waveFgPath"]) {
      this["_waveFgPath"]['setAttribute']('d', _0x20b16b);
    }
  }
  ["_fmt"](_0x1678f7) {
    if (!_0x1678f7 || isNaN(_0x1678f7)) {
      return "0:00";
    }
    return Math["floor"](_0x1678f7 / 0x3c) + ':' + String(Math["floor"](_0x1678f7 % 0x3c))["padStart"](0x2, '0');
  }
  ['setRendererAudioSurfaceVisible'](_0x435daa) {
    if (this["_rendererWaveformVisible"] === _0x435daa) {
      return;
    }
    this["_rendererWaveformVisible"] = _0x435daa;
    if (_0x435daa) {
      void this["_ensureWaveform"](this["_currentSrc"]);
    } else {
      this["_cancelWaveformRequest"]();
    }
  }
  ["_setIcon"](_0x1bbbe4) {
    const _0x1d0a45 = this["_playBtn"]['querySelector']("svg");
    if (!_0x1d0a45) {
      return;
    }
    const _0x534e14 = 'http://www.w3.org/2000/svg';
    while (_0x1d0a45["firstChild"]) {
      _0x1d0a45["removeChild"](_0x1d0a45['firstChild']);
    }
    if (_0x1bbbe4) {
      const _0x3355be = document['createElementNS'](_0x534e14, "polygon");
      _0x3355be["setAttribute"]("points", "5 3 19 12 5 21 5 3");
      _0x1d0a45["appendChild"](_0x3355be);
    } else {
      const _0x404893 = document['createElementNS'](_0x534e14, "rect");
      _0x404893["setAttribute"]('x', '6');
      _0x404893["setAttribute"]('y', '4');
      _0x404893["setAttribute"]("width", '4');
      _0x404893["setAttribute"]("height", '16');
      const _0x42f9d5 = document["createElementNS"](_0x534e14, "rect");
      _0x42f9d5["setAttribute"]('x', '14');
      _0x42f9d5["setAttribute"]('y', '4');
      _0x42f9d5["setAttribute"]("width", '4');
      _0x42f9d5['setAttribute']("height", '16');
      _0x1d0a45["appendChild"](_0x404893);
      _0x1d0a45['appendChild'](_0x42f9d5);
    }
  }
  ["update"](_0x47f304) {
    this['_data'] = _0x47f304;
    if (!this['_audio']) {
      return;
    }
    const _0xa9720e = this["_resolveAudioSrc"](_0x47f304);
    this["_syncGeneratingUi"](_0x47f304, _0xa9720e);
    if (_0xa9720e && _0xa9720e !== this["_currentSrc"]) {
      this["_prepareAudio"](_0xa9720e);
    } else {
      if (_0xa9720e) {
        this["_syncKnownAudioDurationUi"]({
          'currentTime': this["_audio"]?.['currentTime'] || 0x0,
          'showLine': Number(this['_audio']?.["currentTime"] || 0x0) > 0x0
        });
        String(_0x47f304?.["waveformLocalPath"] || '')["trim"]() !== this['_waveformLocalPath'] && void this["_ensureWaveform"](_0xa9720e);
      } else {
        !_0xa9720e && (typeof this['_cancelDeferredWaveform'] === 'function' && (this["_cancelDeferredWaveform"](), this["_cancelDeferredWaveform"] = null), this["_cancelWaveformRequest"](), this["_clearAudioElementSource"](), this["_currentSrc"] = null, this["_clearPlaybackResume"](), this["_progressController"]?.["reset"](), this["_audioDurationProbeToken"] += 0x1, this['_hint'] && (this["_hint"]['style']['display'] = shouldShowGenerationResultLoadingUi(_0x47f304) ? "none" : "block"));
      }
    }
    maybeResumeAudioSeparationLeader(this['id']);
    this["_label"] && _0x47f304['name'] && document["activeElement"] !== this["_label"] && (this["_label"]["innerText"] = _0x47f304["name"]);
  }
  async ["_playAudio"]() {
    if (!this['_audio'] || !this['_currentSrc'] || this['_audioPlayPending'] === !![]) {
      return;
    }
    this["_audioPlayPending"] = !![];
    beginAudioPlayback(this['id']);
    const _0x42e35f = this["_currentSrc"];
    const _0x3a8671 = Number(this["_audioPlayAttemptToken"] || 0x0) + 0x1;
    this["_audioPlayAttemptToken"] = _0x3a8671;
    if (this["_audioPlayDeadlineTimer"]) {
      clearTimeout(this['_audioPlayDeadlineTimer']);
    }
    const _0x1daf6c = () => {
      if (this['_audioPlayAttemptToken'] !== _0x3a8671) {
        return;
      }
      this["_audioPlayPending"] = ![];
      this["_audioPlayDeadlineTimer"] && (clearTimeout(this["_audioPlayDeadlineTimer"]), this["_audioPlayDeadlineTimer"] = null);
    };
    this["_audioPlayDeadlineTimer"] = setTimeout(() => {
      if (this["_audioPlayAttemptToken"] !== _0x3a8671 || this["_currentSrc"] !== _0x42e35f) {
        return;
      }
      this["_audioPlayDeadlineTimer"] = null;
      this["_clearAudioElementSource"]();
      this["_setIcon"](!![]);
    }, AUDIO_PLAY_LOADING_DEADLINE_MS);
    let _0x1c8634 = ![];
    try {
      _0x1c8634 = await this["_loadAudio"](_0x42e35f, {
        'showLoading': !![],
        'preload': "metadata"
      });
    } catch (_0x218481) {
      _0x1daf6c();
      this["_setPlaybackBuffering"](![]);
      if (_0x218481?.["name"] !== "AbortError") {
        console["warn"]('[source-audio]\x20load\x20failed:', _0x218481);
      }
      return;
    }
    if (!_0x1c8634 || !this['_getAudioElementCurrentSource']()) {
      _0x1daf6c();
      this['_setPlaybackBuffering'](![]);
      return;
    }
    this["_restorePlaybackPosition"](_0x42e35f);
    this["_rewindEndedAudioIfNeeded"]();
    let _0x333191;
    try {
      _0x333191 = this["_audio"]["play"]();
    } catch (_0x655d95) {
      _0x1daf6c();
      this['_setPlaybackBuffering'](![]);
      console["warn"]('[source-audio]\x20play\x20failed:', _0x655d95);
      return;
    }
    _0x333191 && typeof _0x333191["catch"] === "function" ? _0x333191["then"](() => {
      _0x1daf6c();
      this["_rememberAudioDuration"]();
      this['_setPlaybackBuffering'](![]);
    })["catch"](_0x4c8bda => {
      _0x1daf6c();
      this["_setPlaybackBuffering"](![]);
      if (_0x4c8bda?.["name"] === "AbortError") {
        return;
      }
      console["warn"]('[source-audio]\x20play\x20failed:', _0x4c8bda);
    }) : (_0x1daf6c(), this["_setPlaybackBuffering"](![]));
  }
  ["_stopAudioForExternalPlayback"]() {
    if (!this['_audio']) {
      return;
    }
    typeof this['_cancelDeferredWaveform'] === "function" && (this["_cancelDeferredWaveform"](), this["_cancelDeferredWaveform"] = null);
    const _0x3d0808 = !!this["_getAudioElementCurrentSource"]();
    const _0x2e5a3a = !!this["_audioLoadInFlightSource"];
    if (_0x3d0808 && this["_currentSrc"]) {
      const _0x10c8c2 = Number(this["_audio"]["currentTime"] || 0x0);
      const _0x52b340 = Number["isFinite"](_0x10c8c2) ? Math['max'](0x0, _0x10c8c2) : 0x0;
      this["_playbackResumeSource"] = this["_currentSrc"];
      this["_playbackResumeTime"] = _0x52b340;
      this['_syncKnownAudioDurationUi']({
        'currentTime': _0x52b340,
        'showLine': _0x52b340 > 0x0
      });
    }
    (_0x3d0808 || _0x2e5a3a) && (this["_clearAudioElementSource"](), _0x3d0808 && this["_syncKnownAudioDurationUi"]({
      'currentTime': this['_playbackResumeTime'],
      'showLine': this['_playbackResumeTime'] > 0x0
    }));
    this["_setPlaybackBuffering"](![]);
    this["_setIcon"](!![]);
  }
  ["getRendererMediaState"]() {
    return {
      'deferred': ![],
      'interactionActive': this['_isSeeking'] === !![]
    };
  }
  ['suspendRendererMedia']() {
    this['setRendererAudioSurfaceVisible'](![]);
    if (!this["_audio"] || this["_audio"]["paused"] === ![]) {
      return ![];
    }
    this['_stopAudioForExternalPlayback']();
    return !![];
  }
  ['_rememberAudioDuration'](_0x3ceb4c = this['_currentSrc']) {
    if (!this["_audio"] || _0x3ceb4c && this["_currentSrc"] !== _0x3ceb4c) {
      return;
    }
    const _0x15997f = this['_readAudioDurationSec']();
    if (!(_0x15997f > 0x0)) {
      return;
    }
    this['_applyResolvedAudioDuration'](_0x15997f, _0x3ceb4c);
  }
  ["_subscribeLocaleChanges"]() {
    if (this["_unsubscribeLocale"]) {
      return;
    }
    this["_unsubscribeLocale"] = onLocaleChange(() => this["_syncLocaleTexts"]());
  }
  ["_setUploadButtonLabel"](_0x11d333) {
    if (!this['_uploadBtn']) {
      return;
    }
    const _0xa5d5a3 = this['_uploadBtn']["querySelector"]('svg')?.["cloneNode"](!![]);
    this["_uploadBtn"]["replaceChildren"]();
    if (_0xa5d5a3) {
      this['_uploadBtn']['appendChild'](_0xa5d5a3);
    }
    this['_uploadBtn']['appendChild'](document["createTextNode"]('\x20' + _0x11d333));
  }
  ["_syncLocaleTexts"]() {
    if (!this["_uploadBtn"]) {
      return;
    }
    if (this['_isUploading']) {
      this["_uploadBtn"]['textContent'] = sourceAudioText("upload.uploading");
      return;
    }
    this['_setUploadButtonLabel'](sourceAudioText("upload.button"));
  }
  ["_clearToolbarActionBindings"]() {
    if (!Array['isArray'](this["_toolbarActionCleanups"])) {
      this["_toolbarActionCleanups"] = [];
      return;
    }
    for (const _0x5ec49d of this["_toolbarActionCleanups"]["splice"](0x0)) {
      _0x5ec49d();
    }
  }
  ["unmount"]() {
    this["_rendererWaveformVisible"] = ![];
    this["_releaseRendererPlaybackPin"]?.();
    this["_releaseRendererPlaybackPin"] = null;
    this["_clearToolbarActionBindings"]();
    this["_unsubscribeLocale"]?.();
    this["_unsubscribeLocale"] = null;
    this["_unregisterAudioPlaybackClient"]?.();
    this["_unregisterAudioPlaybackClient"] = null;
    this["_progressController"]?.["destroy"]();
    this["_progressController"] = null;
    typeof this['_cancelDeferredWaveform'] === "function" && (this["_cancelDeferredWaveform"](), this["_cancelDeferredWaveform"] = null);
    this["_cancelWaveformRequest"]();
    this["_clearAudioElementSource"]();
  }
}