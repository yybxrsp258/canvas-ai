import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import a262_0xcc99b9 from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveApplicationResourceRoot } from '../applicationResourceRoot.js';
import { createAudioVoiceCloudAsrAdapters } from './audioVoiceCloudAsr.js';
import { createProcessStartError, MediaTaskCancelledError } from '../mediaTaskQueue.js';
import { runDoubaoAsrTranscription } from './doubaoAsrClient.js';
export { buildDoubaoAsrHeaders, buildDoubaoAsrSubmitBody, normalizeDoubaoAsrSegments, runDoubaoAsrTranscription } from './doubaoAsrClient.js';
const __filename = fileURLToPath(import.meta["url"]);
const __dirname = a262_0xcc99b9["dirname"](__filename);
const DEFAULT_APP_ROOT = resolveApplicationResourceRoot(a262_0xcc99b9["resolve"](__dirname, '..', '..'));
const AUDIO_VOICE_ASR_STAGE = Object["freeze"]({
  'MODEL_DOWNLOAD': 'model-download',
  'MODEL_PREPARE': "model-prepare",
  'TRANSCRIBE': 'transcribe',
  'DIARIZATION_MODEL_DOWNLOAD': "diarization-model-download",
  'DIARIZATION_MODEL_PREPARE': "diarization-model-prepare",
  'DIARIZE': "diarize",
  'SLICE': "slice"
});
const FUNASR_GPU_TORCH_STAGE = Object["freeze"]({
  'CHECK': 'gpu-torch-check',
  'INSTALL': "gpu-torch-install",
  'VERIFY': "gpu-torch-verify"
});
const FUNASR_STAGE_RANGES = Object['freeze']({
  'model-download': [0.08, 0.32],
  'model-prepare': [0.32, 0.42],
  'transcribe': [0.42, 0.52],
  'diarization-model-download': [0.52, 0.64],
  'diarization-model-prepare': [0.64, 0.7],
  'diarize': [0.7, 0.8]
});
function resolveAsrProgressMessage(_0x2ed281 = '', _0x5e4e16 = '') {
  const _0xe44869 = String(_0x5e4e16 || '')['trim']();
  if (_0xe44869 && !/funasr|paraformer|modelscope/i['test'](_0xe44869)) {
    return _0xe44869;
  }
  switch (_0x2ed281) {
    case AUDIO_VOICE_ASR_STAGE["MODEL_DOWNLOAD"]:
      return "Preparing subtitle recognition model";
    case AUDIO_VOICE_ASR_STAGE["MODEL_PREPARE"]:
      return "Preparing recognition runtime";
    case AUDIO_VOICE_ASR_STAGE['TRANSCRIBE']:
      return "Recognizing subtitles";
    default:
      return "Preparing subtitle recognition";
  }
}
const FUNASR_DEFAULT_MODEL = Object["freeze"]({
  'model': "paraformer-zh",
  'vadModel': 'fsmn-vad',
  'puncModel': "ct-punc-c",
  'spkModel': 'cam++'
});
const SORTFORMER_DEFAULT_MODEL_FILE = "diar_streaming_sortformer_4spk-v2.1.nemo";
const SORTFORMER_DEFAULT_MODEL_URL = "https://huggingface.co/nvidia/diar_streaming_sortformer_4spk-v2.1/resolve/main/diar_streaming_sortformer_4spk-v2.1.nemo";
const FUNASR_TRANSCRIPT_MERGE_DEFAULTS = Object['freeze']({
  'maxGapMs': 0x320,
  'maxDurationMs': 0x2710,
  'maxTextChars': 0x64
});
const DIARIZATION_SPEAKER_RECONCILE_DEFAULTS = Object["freeze"]({
  'maxBridgeGapMs': 0x78
});
const DEFAULT_FUNASR_GPU_TORCH_INDEX_URL = "https://download.pytorch.org/whl/cu128";
const DEFAULT_FUNASR_GPU_TORCH_PACKAGES = Object["freeze"](['torch==2.11.0+cu128', 'torchaudio==2.11.0+cu128']);
function toNumber(_0x199de4, _0x550485 = 0x0) {
  const _0x1ad66a = Number(_0x199de4);
  return Number["isFinite"](_0x1ad66a) ? _0x1ad66a : _0x550485;
}
function clamp(_0x3c5629, _0x10bf85, _0x2800b2) {
  return Math['max'](_0x10bf85, Math["min"](_0x2800b2, _0x3c5629));
}
function normalizePositiveSeconds(_0x519fc5, _0x3e71cd) {
  const _0x28491a = toNumber(_0x519fc5, _0x3e71cd);
  return _0x28491a > 0x0 ? _0x28491a : _0x3e71cd;
}
function normalizeSilenceOptions(_0xf9400d = {}) {
  const _0x4fad8d = Math["round"](toNumber(_0xf9400d["noiseDb"], -0x23));
  const _0x41e8b8 = normalizePositiveSeconds(_0xf9400d["minSilenceSec"], 0.35);
  const _0x436a79 = Math["max"](0x0, Math['round'](toNumber(_0xf9400d["paddingMs"], 0x50)));
  return {
    'noiseDb': _0x4fad8d,
    'minSilenceSec': _0x41e8b8,
    'paddingMs': _0x436a79
  };
}
function normalizeAsrProvider(_0x3fb071 = {}) {
  return String(_0x3fb071['asrProvider'] || '')['trim']()['toLowerCase']();
}
function normalizeDiarizationProvider(_0x4089e1 = {}) {
  const _0x1587f7 = String(_0x4089e1["diarizationProvider"] || '')['trim']()["toLowerCase"]();
  if (['none', "off", "disabled", "false"]['includes'](_0x1587f7)) {
    return "none";
  }
  return "sortformer";
}
function resolveSortformerModelRootFromFunasrRoot(_0x29803f = '') {
  const _0x4bf820 = String(_0x29803f || '')['trim']();
  if (!_0x4bf820) {
    return '';
  }
  return a262_0xcc99b9['join'](a262_0xcc99b9["dirname"](a262_0xcc99b9['resolve'](_0x4bf820)), "sortformer");
}
export function normalizeFunasrEngine(_0x21e509) {
  return String(_0x21e509 || '')["trim"]()["toLowerCase"]() === "gpu" ? "gpu" : 'cpu';
}
export function parseSilenceDetectRanges(_0x2e608d = '', _0x4b4178 = 0x0) {
  const _0x952a4c = String(_0x2e608d || '');
  const _0x361ee1 = Math['max'](0x0, toNumber(_0x4b4178, 0x0));
  const _0x1a0356 = /silence_(start|end):\s*([0-9]+(?:\.[0-9]+)?)/g;
  const _0x454af2 = [];
  let _0x1a98c5 = null;
  let _0x3f5f73 = null;
  while (_0x3f5f73 = _0x1a0356['exec'](_0x952a4c)) {
    const _0x282b5e = _0x3f5f73[0x1];
    const _0x14ef8a = clamp(toNumber(_0x3f5f73[0x2], 0x0), 0x0, _0x361ee1 || Number["MAX_SAFE_INTEGER"]);
    if (_0x282b5e === "start") {
      _0x1a98c5 = _0x14ef8a;
      continue;
    }
    _0x1a98c5 != null && _0x14ef8a > _0x1a98c5 && (_0x454af2["push"]({
      'startSec': _0x1a98c5,
      'endSec': _0x14ef8a
    }), _0x1a98c5 = null);
  }
  _0x1a98c5 != null && _0x361ee1 > _0x1a98c5 && _0x454af2["push"]({
    'startSec': _0x1a98c5,
    'endSec': _0x361ee1
  });
  return _0x454af2["sort"]((_0x2cadff, _0x55fd66) => _0x2cadff["startSec"] - _0x55fd66["startSec"]);
}
function mergeShortSpeechSegments(_0x31ff8b, _0x9c5ff1) {
  const _0x22888d = [];
  for (const _0x28b50f of _0x31ff8b) {
    const _0x4ece97 = _0x28b50f["endSec"] - _0x28b50f['startSec'];
    if (_0x4ece97 >= _0x9c5ff1 || _0x22888d["length"] === 0x0) {
      _0x22888d["push"]({
        ..._0x28b50f
      });
      continue;
    }
    _0x22888d[_0x22888d["length"] - 0x1]["endSec"] = _0x28b50f['endSec'];
  }
  return _0x22888d['filter'](_0x5cf1de => _0x5cf1de["endSec"] - _0x5cf1de["startSec"] > 0.05);
}
export function buildAudioVoiceSpeechSegments({
  silenceRanges = [],
  durationSec = 0x0,
  paddingMs = 0x50,
  minSpeechSec = 0.25
} = {}) {
  const _0xa57e88 = Math["max"](0x0, toNumber(durationSec, 0x0));
  if (_0xa57e88 <= 0x0) {
    return [];
  }
  const _0x5715b6 = [];
  let _0x474c76 = 0x0;
  for (const _0x442087 of silenceRanges) {
    const _0x328df6 = clamp(toNumber(_0x442087["startSec"], 0x0), 0x0, _0xa57e88);
    const _0x4f90dc = clamp(toNumber(_0x442087['endSec'], _0x328df6), _0x328df6, _0xa57e88);
    if (_0x328df6 > _0x474c76) {
      _0x5715b6['push']({
        'startSec': _0x474c76,
        'endSec': _0x328df6
      });
    }
    _0x474c76 = Math["max"](_0x474c76, _0x4f90dc);
  }
  if (_0x474c76 < _0xa57e88) {
    _0x5715b6['push']({
      'startSec': _0x474c76,
      'endSec': _0xa57e88
    });
  }
  const _0x9e11fa = _0x5715b6['length'] ? mergeShortSpeechSegments(_0x5715b6, Math["max"](0.05, toNumber(minSpeechSec, 0.25))) : [{
    'startSec': 0x0,
    'endSec': _0xa57e88
  }];
  const _0x12973d = Math['max'](0x0, toNumber(paddingMs, 0x0)) / 0x3e8;
  const _0x3d6f7c = [];
  let _0x143806 = 0x0;
  for (const _0x278ca0 of _0x9e11fa) {
    const _0x14f071 = clamp(_0x278ca0["startSec"] - _0x12973d, _0x143806, _0xa57e88);
    const _0x2a93c7 = clamp(_0x278ca0['endSec'] + _0x12973d, _0x14f071, _0xa57e88);
    if (_0x2a93c7 - _0x14f071 <= 0.05) {
      continue;
    }
    _0x3d6f7c["push"]({
      'startMs': Math["round"](_0x14f071 * 0x3e8),
      'endMs': Math['round'](_0x2a93c7 * 0x3e8)
    });
    _0x143806 = _0x2a93c7;
  }
  return _0x3d6f7c["length"] ? _0x3d6f7c : [{
    'startMs': 0x0,
    'endMs': Math["round"](_0xa57e88 * 0x3e8)
  }];
}
function formatSec(_0x61db8e) {
  return (Math["max"](0x0, Number(_0x61db8e) || 0x0) / 0x3e8)['toFixed'](0x3);
}
export function buildAudioVoiceSegmentCutArgs({
  sourceAudioAbs: _0x5b536e,
  outAbs: _0x2cd655,
  startMs: _0x3d9a2e,
  endMs: _0x4e0161
} = {}) {
  const _0x52624e = Math['max'](0x1, Math['round'](Number(_0x4e0161 || 0x0) - Number(_0x3d9a2e || 0x0)));
  return ['-y', "-ss", formatSec(_0x3d9a2e), '-i', _0x5b536e, '-t', formatSec(_0x52624e), "-vn", "-c:a", "libmp3lame", "-b:a", "192k", _0x2cd655];
}
export function normalizeFunasrTranscriptSegments(_0x14469a = {}, _0x159a61 = 0x0) {
  const _0x321eec = Math["max"](0x0, Math["round"](Number(_0x159a61 || 0x0) * 0x3e8));
  const _0x3e8d5e = Array["isArray"](_0x14469a?.["segments"]) ? _0x14469a["segments"] : Array['isArray'](_0x14469a) ? _0x14469a : [];
  const _0x530a25 = [];
  for (const _0xc8f271 of _0x3e8d5e) {
    const _0x8e3487 = clamp(Math["round"](Number(_0xc8f271?.['startMs'] || 0x0)), 0x0, _0x321eec || Number["MAX_SAFE_INTEGER"]);
    const _0x19e66a = clamp(Math["round"](Number(_0xc8f271?.["endMs"] || 0x0)), _0x8e3487, _0x321eec || Number["MAX_SAFE_INTEGER"]);
    if (_0x19e66a - _0x8e3487 <= 0.05) {
      continue;
    }
    const _0x2a9143 = normalizeSpeakerLabel(_0xc8f271?.["speaker"] ?? _0xc8f271?.["spk"] ?? _0xc8f271?.['speakerId']);
    const _0x4c0f75 = {
      'startMs': _0x8e3487,
      'endMs': _0x19e66a,
      'sourceText': String(_0xc8f271?.["sourceText"] || _0xc8f271?.['text'] || '')['trim']()
    };
    if (_0x2a9143) {
      _0x4c0f75["speaker"] = _0x2a9143;
    }
    _0x530a25['push'](_0x4c0f75);
  }
  return _0x530a25["sort"]((_0x5ccf94, _0x3b0cfd) => _0x5ccf94["startMs"] - _0x3b0cfd['startMs']);
}
export function normalizeDiarizationSegments(_0x33fc68 = {}, _0x2c6c63 = 0x0) {
  const _0x3866ce = Math['max'](0x0, Math["round"](Number(_0x2c6c63 || 0x0) * 0x3e8));
  const _0xe3c51c = Array["isArray"](_0x33fc68?.["segments"]) ? _0x33fc68['segments'] : Array["isArray"](_0x33fc68) ? _0x33fc68 : [];
  const _0x5b5615 = [];
  for (const _0x4c98dc of _0xe3c51c) {
    const _0xf03b4d = clamp(Math['round'](Number(_0x4c98dc?.['startMs'] || 0x0)), 0x0, _0x3866ce || Number['MAX_SAFE_INTEGER']);
    const _0x4ce153 = clamp(Math['round'](Number(_0x4c98dc?.['endMs'] || 0x0)), _0xf03b4d, _0x3866ce || Number["MAX_SAFE_INTEGER"]);
    if (_0x4ce153 - _0xf03b4d <= 0.05) {
      continue;
    }
    const _0x34ca05 = normalizeSpeakerLabel(_0x4c98dc?.["speaker"] ?? _0x4c98dc?.['label'] ?? _0x4c98dc?.["spk"] ?? _0x4c98dc?.["speakerId"]);
    if (!_0x34ca05) {
      continue;
    }
    _0x5b5615["push"]({
      'startMs': _0xf03b4d,
      'endMs': _0x4ce153,
      'speaker': _0x34ca05
    });
  }
  return _0x5b5615["sort"]((_0xcfc94, _0x526e36) => _0xcfc94["startMs"] - _0x526e36['startMs']);
}
function normalizeSpeakerLabel(_0x39f4f3) {
  if (_0x39f4f3 == null) {
    return '';
  }
  return String(_0x39f4f3)['trim']();
}
function transcriptTextLength(_0x115c0e = '') {
  return Array["from"](String(_0x115c0e || '')["trim"]())["length"];
}
function joinTranscriptText(_0x2e57ac = '', _0x185718 = '') {
  const _0x4e18b3 = String(_0x2e57ac || '')["trim"]();
  const _0x70645e = String(_0x185718 || '')["trim"]();
  if (!_0x4e18b3) {
    return _0x70645e;
  }
  if (!_0x70645e) {
    return _0x4e18b3;
  }
  const _0x46b82e = _0x4e18b3["slice"](-0x1);
  const _0x1fa3aa = _0x70645e["slice"](0x0, 0x1);
  const _0x120a62 = /[A-Za-z0-9,.;:!?)]/["test"](_0x46b82e) && /[A-Za-z0-9(]/["test"](_0x1fa3aa);
  return '' + _0x4e18b3 + (_0x120a62 ? '\x20' : '') + _0x70645e;
}
function mergeSpeakerLabel(_0x3281b8 = '', _0x2e2c23 = '') {
  const _0xb42482 = normalizeSpeakerLabel(_0x3281b8);
  const _0x259719 = normalizeSpeakerLabel(_0x2e2c23);
  return _0xb42482 && _0x259719 && _0xb42482 === _0x259719 ? _0xb42482 : '';
}
function hasStrongTranscriptBoundary(_0x2c6a41 = '') {
  return /[。！？!?…]$/["test"](String(_0x2c6a41 || '')["trim"]());
}
function canMergeFunasrTranscriptSegments(_0xd9c6b2 = {}, _0x149445 = {}, _0x2a0ef5 = {}) {
  if (!mergeSpeakerLabel(_0xd9c6b2["speaker"], _0x149445["speaker"])) {
    return ![];
  }
  const _0x55505f = Math["max"](0x0, Math["round"](toNumber(_0x2a0ef5["maxGapMs"], FUNASR_TRANSCRIPT_MERGE_DEFAULTS["maxGapMs"])));
  const _0x58dc61 = Math["max"](0x1, Math["round"](toNumber(_0x2a0ef5["maxDurationMs"], FUNASR_TRANSCRIPT_MERGE_DEFAULTS['maxDurationMs'])));
  const _0x1e7f97 = Math['max'](0x1, Math['round'](toNumber(_0x2a0ef5['maxTextChars'], FUNASR_TRANSCRIPT_MERGE_DEFAULTS["maxTextChars"])));
  const _0x272cf6 = Math["round"](Number(_0x149445["startMs"] || 0x0) - Number(_0xd9c6b2['endMs'] || 0x0));
  if (_0x272cf6 > _0x55505f) {
    return ![];
  }
  const _0x53ceed = Math["min"](Number(_0xd9c6b2["startMs"] || 0x0), Number(_0x149445["startMs"] || 0x0));
  const _0x5a7e76 = Math['max'](Number(_0xd9c6b2["endMs"] || 0x0), Number(_0x149445["endMs"] || 0x0));
  if (_0x5a7e76 - _0x53ceed > _0x58dc61) {
    return ![];
  }
  const _0x5e0cfe = joinTranscriptText(_0xd9c6b2["sourceText"], _0x149445['sourceText']);
  return transcriptTextLength(_0x5e0cfe) <= _0x1e7f97;
}
function shouldBridgeDiarizationSpeakerChange(_0x170b1c = {}, _0x81ca7d = {}, _0x37a8d7 = {}, _0x2ccb98 = {}) {
  const _0x4305a4 = mergeSpeakerLabel(_0x170b1c?.["speaker"] ?? _0x170b1c?.["spk"] ?? _0x170b1c?.["speakerId"], _0x81ca7d?.["speaker"] ?? _0x81ca7d?.["spk"] ?? _0x81ca7d?.["speakerId"]);
  if (!_0x4305a4) {
    return ![];
  }
  const _0x8df5c2 = normalizeSpeakerLabel(_0x37a8d7?.["speaker"]);
  const _0x582a22 = normalizeSpeakerLabel(_0x2ccb98?.['speaker']);
  if (!_0x8df5c2 || !_0x582a22 || _0x8df5c2 === _0x582a22) {
    return ![];
  }
  const _0x26bb71 = Math["max"](0x0, Math["round"](Number(_0x2ccb98?.["startMs"] || 0x0) - Number(_0x37a8d7?.['endMs'] || 0x0)));
  const _0x51e310 = Math["max"](0x0, Math["round"](DIARIZATION_SPEAKER_RECONCILE_DEFAULTS["maxBridgeGapMs"]));
  if (_0x26bb71 > _0x51e310) {
    return ![];
  }
  if (hasStrongTranscriptBoundary(_0x37a8d7?.["sourceText"] ?? _0x170b1c?.["sourceText"] ?? _0x170b1c?.["text"])) {
    return ![];
  }
  return canMergeFunasrTranscriptSegments({
    ..._0x37a8d7,
    'speaker': _0x8df5c2
  }, {
    ..._0x2ccb98,
    'speaker': _0x8df5c2
  });
}
function reconcileDiarizationSpeakerChanges(_0x45d72f = [], _0x2280bd = []) {
  const _0x50c53e = Array['isArray'](_0x45d72f) ? _0x45d72f : [];
  const _0x27e274 = (Array["isArray"](_0x2280bd) ? _0x2280bd : [])['map'](_0x92da2b => ({
    ..._0x92da2b
  }));
  for (let _0x3d664d = 0x1; _0x3d664d < _0x27e274["length"]; _0x3d664d += 0x1) {
    const _0x296c35 = _0x27e274[_0x3d664d - 0x1];
    const _0x390b80 = _0x27e274[_0x3d664d];
    shouldBridgeDiarizationSpeakerChange(_0x50c53e[_0x3d664d - 0x1], _0x50c53e[_0x3d664d], _0x296c35, _0x390b80) && (_0x390b80["speaker"] = normalizeSpeakerLabel(_0x296c35["speaker"]));
  }
  return _0x27e274;
}
export function mergeFunasrTranscriptSegments(_0x5487dc = [], _0x4e4439 = {}) {
  const _0x2f3bf3 = [];
  for (const _0x202034 of Array["isArray"](_0x5487dc) ? _0x5487dc : []) {
    const _0x495a05 = Math["max"](0x0, Math["round"](Number(_0x202034?.["startMs"] || 0x0)));
    const _0x203b7d = Math["max"](_0x495a05, Math["round"](Number(_0x202034?.["endMs"] || 0x0)));
    if (_0x203b7d - _0x495a05 <= 0.05) {
      continue;
    }
    const _0xc82f81 = normalizeSpeakerLabel(_0x202034?.["speaker"] ?? _0x202034?.["spk"] ?? _0x202034?.["speakerId"]);
    const _0x361c6c = {
      'startMs': _0x495a05,
      'endMs': _0x203b7d,
      'sourceText': String(_0x202034?.["sourceText"] || _0x202034?.["text"] || '')["trim"]()
    };
    if (_0xc82f81) {
      _0x361c6c['speaker'] = _0xc82f81;
    }
    const _0x5e6ac7 = _0x2f3bf3[_0x2f3bf3["length"] - 0x1];
    if (_0x5e6ac7 && canMergeFunasrTranscriptSegments(_0x5e6ac7, _0x361c6c, _0x4e4439)) {
      _0x5e6ac7["endMs"] = Math["max"](_0x5e6ac7["endMs"], _0x361c6c["endMs"]);
      _0x5e6ac7["sourceText"] = joinTranscriptText(_0x5e6ac7["sourceText"], _0x361c6c["sourceText"]);
      const _0x3ce349 = mergeSpeakerLabel(_0x5e6ac7["speaker"], _0x361c6c["speaker"]);
      _0x3ce349 ? _0x5e6ac7['speaker'] = _0x3ce349 : delete _0x5e6ac7['speaker'];
      continue;
    }
    _0x2f3bf3["push"](_0x361c6c);
  }
  return _0x2f3bf3;
}
function stripTranscriptSpeakerLabels(_0xe80633 = []) {
  return (Array['isArray'](_0xe80633) ? _0xe80633 : [])['map'](_0xac3fc4 => ({
    'startMs': Math["max"](0x0, Math["round"](Number(_0xac3fc4?.["startMs"] || 0x0))),
    'endMs': Math["max"](0x0, Math["round"](Number(_0xac3fc4?.['endMs'] || 0x0))),
    'sourceText': String(_0xac3fc4?.["sourceText"] || _0xac3fc4?.["text"] || '')["trim"]()
  }))["filter"](_0x3eca3a => _0x3eca3a["endMs"] > _0x3eca3a['startMs']);
}
function overlapMs(_0x2fa748 = {}, _0x3c9e8c = {}) {
  const _0xb523de = Math["max"](Number(_0x2fa748["startMs"] || 0x0), Number(_0x3c9e8c["startMs"] || 0x0));
  const _0x12b9ec = Math["min"](Number(_0x2fa748["endMs"] || 0x0), Number(_0x3c9e8c["endMs"] || 0x0));
  return Math["max"](0x0, Math['round'](_0x12b9ec - _0xb523de));
}
export function assignDiarizationSpeakersToTranscriptSegments(_0x345502 = [], _0x48f5ed = []) {
  const _0x53e80f = normalizeDiarizationSegments(_0x48f5ed);
  const _0x3717f0 = stripTranscriptSpeakerLabels(_0x345502);
  const _0x3fa49f = _0x3717f0["map"](_0x573c27 => {
    const _0xde50c9 = new Map();
    for (const _0x47255d of _0x53e80f) {
      const _0x579c24 = overlapMs(_0x573c27, _0x47255d);
      if (_0x579c24 <= 0x0) {
        continue;
      }
      const _0x56bd7b = normalizeSpeakerLabel(_0x47255d["speaker"]);
      if (!_0x56bd7b) {
        continue;
      }
      _0xde50c9["set"](_0x56bd7b, (_0xde50c9["get"](_0x56bd7b) || 0x0) + _0x579c24);
    }
    let _0x1d507b = '';
    let _0x21529e = 0x0;
    for (const [_0xd96658, _0x31002b] of _0xde50c9["entries"]()) {
      _0x31002b > _0x21529e && (_0x1d507b = _0xd96658, _0x21529e = _0x31002b);
    }
    return _0x1d507b ? {
      ..._0x573c27,
      'speaker': _0x1d507b
    } : _0x573c27;
  });
  return reconcileDiarizationSpeakerChanges(_0x345502, _0x3fa49f);
}
export function hasRecognizedTranscriptText(_0x1b196f = []) {
  return _0x1b196f["some"](_0x548aa2 => String(_0x548aa2?.["sourceText"] || '')["trim"]());
}
export function mapFunasrProgressToOverall(_0x57c182, _0x11f37c) {
  const _0x202deb = String(_0x57c182 || '')["trim"]();
  const _0x51a7ab = FUNASR_STAGE_RANGES[_0x202deb] || FUNASR_STAGE_RANGES["transcribe"];
  const _0x4cf6ca = clamp(Number(_0x11f37c || 0x0), 0x0, 0x1);
  return _0x51a7ab[0x0] + (_0x51a7ab[0x1] - _0x51a7ab[0x0]) * _0x4cf6ca;
}
export function buildFunasrTranscriptionArgs({
  audioAbs: _0x34f643,
  modelRoot: _0x247caa,
  durationSec: _0x37ac04,
  downloadModelIfMissing = !![],
  engine = "cpu",
  model = FUNASR_DEFAULT_MODEL["model"],
  vadModel = FUNASR_DEFAULT_MODEL['vadModel'],
  puncModel = FUNASR_DEFAULT_MODEL["puncModel"],
  spkModel = FUNASR_DEFAULT_MODEL["spkModel"],
  prepareOnly = ![],
  checkRuntimeOnly = ![]
} = {}) {
  const _0x4ef001 = ['-m', "backend.services.funasr_transcription_service", "--model-root", _0x247caa, "--duration-ms", String(Math["max"](0x0, Math["round"](Number(_0x37ac04 || 0x0) * 0x3e8))), '--model', model, "--vad-model", vadModel, "--punc-model", puncModel, '--engine', normalizeFunasrEngine(engine)];
  const _0x1ba1c2 = String(spkModel || '')["trim"]();
  if (_0x1ba1c2) {
    _0x4ef001["push"]("--spk-model", _0x1ba1c2);
  }
  if (checkRuntimeOnly) {
    _0x4ef001["push"]("--check-runtime-only");
  } else {
    prepareOnly ? _0x4ef001["push"]("--prepare-only") : _0x4ef001["splice"](0x2, 0x0, "--audio", _0x34f643);
  }
  if (downloadModelIfMissing) {
    _0x4ef001['push']("--download-model-if-missing");
  }
  return _0x4ef001;
}
export function buildSortformerDiarizationArgs({
  audioAbs: _0x5691f6,
  modelRoot: _0x3063b7,
  durationSec: _0x55aba1,
  downloadModelIfMissing = !![],
  engine = "cpu",
  modelUrl = SORTFORMER_DEFAULT_MODEL_URL,
  modelFile = SORTFORMER_DEFAULT_MODEL_FILE,
  prepareOnly = ![],
  checkRuntimeOnly = ![]
} = {}) {
  const _0x5d32f2 = ['-m', 'backend.services.sortformer_diarization_service', "--model-root", _0x3063b7, "--duration-ms", String(Math["max"](0x0, Math["round"](Number(_0x55aba1 || 0x0) * 0x3e8))), '--model-url', String(modelUrl || SORTFORMER_DEFAULT_MODEL_URL), "--model-file", String(modelFile || SORTFORMER_DEFAULT_MODEL_FILE), "--engine", normalizeFunasrEngine(engine)];
  if (checkRuntimeOnly) {
    _0x5d32f2["push"]('--check-runtime-only');
  } else {
    prepareOnly ? _0x5d32f2['push']("--prepare-only") : _0x5d32f2["splice"](0x2, 0x0, '--audio', _0x5691f6);
  }
  if (downloadModelIfMissing) {
    _0x5d32f2['push']('--download-model-if-missing');
  }
  return _0x5d32f2;
}
export function buildFunasrEnv(_0x2e2eb4, _0x245224 = process["env"], _0x4918b7 = {}) {
  const _0x237172 = a262_0xcc99b9["resolve"](_0x2e2eb4);
  const _0x35aae2 = a262_0xcc99b9["join"](_0x237172, "cache");
  const _0x4fd71c = a262_0xcc99b9["join"](_0x237172, "models");
  const _0x562044 = a262_0xcc99b9["join"](_0x237172, "torch");
  const _0x286073 = a262_0xcc99b9['join'](_0x237172, "pip-cache");
  const _0xaa8d09 = a262_0xcc99b9['join'](_0x237172, "tmp");
  mkdirSync(_0x35aae2, {
    'recursive': !![]
  });
  mkdirSync(_0x4fd71c, {
    'recursive': !![]
  });
  mkdirSync(_0x562044, {
    'recursive': !![]
  });
  mkdirSync(_0x286073, {
    'recursive': !![]
  });
  mkdirSync(_0xaa8d09, {
    'recursive': !![]
  });
  return {
    ..._0x245224,
    ..._0x4918b7,
    'AIC_FUNASR_MODEL_ROOT': _0x237172,
    'MODELSCOPE_CACHE': _0x4fd71c,
    'MODELSCOPE_HOME': _0x35aae2,
    'HF_HOME': _0x35aae2,
    'HUGGINGFACE_HUB_CACHE': _0x4fd71c,
    'TRANSFORMERS_CACHE': _0x4fd71c,
    'TORCH_HOME': _0x562044,
    'PIP_CACHE_DIR': _0x286073,
    'PIP_DISABLE_PIP_VERSION_CHECK': '1',
    'XDG_CACHE_HOME': _0x35aae2,
    'TMPDIR': _0xaa8d09,
    'TEMP': _0xaa8d09,
    'TMP': _0xaa8d09,
    'PYTHONIOENCODING': 'utf-8',
    'PYTHONUTF8': '1'
  };
}
export function buildSortformerEnv(_0x41a0fc, _0x109213 = process['env'], _0x1751a9 = {}) {
  const _0x1c9ef8 = a262_0xcc99b9["resolve"](_0x41a0fc);
  const _0x51ecf0 = a262_0xcc99b9["join"](_0x1c9ef8, 'cache');
  const _0x2e81d3 = a262_0xcc99b9['join'](_0x1c9ef8, "models");
  const _0x346697 = a262_0xcc99b9["join"](_0x1c9ef8, "torch");
  const _0x4422d4 = a262_0xcc99b9['join'](_0x1c9ef8, "pip-cache");
  const _0x53b5ab = a262_0xcc99b9["join"](_0x1c9ef8, "tmp");
  mkdirSync(_0x51ecf0, {
    'recursive': !![]
  });
  mkdirSync(_0x2e81d3, {
    'recursive': !![]
  });
  mkdirSync(_0x346697, {
    'recursive': !![]
  });
  mkdirSync(_0x4422d4, {
    'recursive': !![]
  });
  mkdirSync(_0x53b5ab, {
    'recursive': !![]
  });
  return {
    ..._0x109213,
    ..._0x1751a9,
    'AIC_SORTFORMER_MODEL_ROOT': _0x1c9ef8,
    'HF_HOME': _0x51ecf0,
    'HUGGINGFACE_HUB_CACHE': _0x2e81d3,
    'TORCH_HOME': _0x346697,
    'PIP_CACHE_DIR': _0x4422d4,
    'PIP_DISABLE_PIP_VERSION_CHECK': '1',
    'XDG_CACHE_HOME': _0x51ecf0,
    'TMPDIR': _0x53b5ab,
    'TEMP': _0x53b5ab,
    'TMP': _0x53b5ab,
    'PYTHONIOENCODING': 'utf-8',
    'PYTHONUTF8': '1',
    'HF_HUB_DISABLE_TELEMETRY': '1',
    'WANDB_DISABLED': "true"
  };
}
function normalizePackageList(_0x367024, _0x565ce0 = []) {
  const _0x5c9a8 = Array["isArray"](_0x367024) ? _0x367024 : [];
  const _0x3e1f6f = _0x5c9a8["map"](_0x4754f7 => String(_0x4754f7 || '')['trim']())["filter"](Boolean);
  return _0x3e1f6f["length"] ? _0x3e1f6f : [..._0x565ce0];
}
export function buildFunasrGpuTorchInstallArgs({
  indexUrl = DEFAULT_FUNASR_GPU_TORCH_INDEX_URL,
  packages = DEFAULT_FUNASR_GPU_TORCH_PACKAGES
} = {}) {
  const _0x430be1 = String(indexUrl || '')["trim"]() || DEFAULT_FUNASR_GPU_TORCH_INDEX_URL;
  const _0x3c0431 = normalizePackageList(packages, DEFAULT_FUNASR_GPU_TORCH_PACKAGES);
  return ['-m', 'pip', "install", "--upgrade", "--prefer-binary", "--no-input", "--disable-pip-version-check", "--index-url", _0x430be1, ..._0x3c0431];
}
function parseFirstLine(_0x527410 = '') {
  return String(_0x527410 || '')['split'](/\r?\n/)["map"](_0x3bafd9 => _0x3bafd9["trim"]())["find"](Boolean) || '';
}
async function detectNvidiaGpuNameForInstall({
  queue: _0x2ee8c9,
  task: _0x48e0f6
} = {}) {
  _0x2ee8c9?.["emitProgress"]?.(_0x48e0f6, 0.04, "Checking NVIDIA GPU", {
    'stage': FUNASR_GPU_TORCH_STAGE["CHECK"]
  });
  const _0x508846 = await _0x2ee8c9["runProcess"](_0x48e0f6, 'nvidia-smi', ["--query-gpu=name", "--format=csv,noheader"]);
  const _0x43ee48 = parseFirstLine(_0x508846["stdout"]?.["toString"]('utf8'));
  if (!_0x43ee48) {
    throw new Error("No NVIDIA GPU was detected");
  }
  return _0x43ee48;
}
export function runPipInstallProcess({
  appRoot = DEFAULT_APP_ROOT,
  env: _0x5d5b2a,
  pipArgs = [],
  pythonCommand: _0x5a3966,
  queue: _0xa56aa,
  spawnImpl = spawn,
  task: _0x531678
} = {}) {
  if (!_0x5a3966) {
    throw new Error("Python runtime is unavailable");
  }
  return new Promise((_0x1af7d0, _0x25452b) => {
    _0xa56aa?.["throwIfCancelled"]?.(_0x531678);
    const _0x30e955 = spawnImpl(_0x5a3966, pipArgs, {
      'cwd': appRoot,
      'env': _0x5d5b2a,
      'stdio': ['ignore', "pipe", 'pipe'],
      'windowsHide': !![]
    });
    _0x531678['child'] = _0x30e955;
    const _0x21e7f5 = [];
    const _0x57312a = [];
    let _0x43ee16 = 0.12;
    const _0x3d4ced = (_0x58f344 = "Installing GPU acceleration component") => {
      _0x43ee16 = Math["min"](0.88, _0x43ee16 + 0.015);
      _0xa56aa?.["emitProgress"]?.(_0x531678, _0x43ee16, _0x58f344, {
        'stage': FUNASR_GPU_TORCH_STAGE["INSTALL"]
      });
    };
    const _0x871f3e = setInterval(() => {
      if (_0xa56aa?.["isCancelled"]?.(_0x531678)) {
        try {
          _0x30e955['kill']();
        } catch {}
        return;
      }
      _0x3d4ced();
    }, 0x7d0);
    const _0x3f10f2 = (_0x2e2e0e, _0x15edf9) => {
      clearInterval(_0x871f3e);
      if (_0x531678["child"] === _0x30e955) {
        _0x531678["child"] = null;
      }
      _0x2e2e0e(_0x15edf9);
    };
    const _0x5ab046 = _0x4d74ee => {
      const _0x36e588 = Buffer['from'](_0x4d74ee)['toString']("utf8");
      /downloading|installing|collecting/i["test"](_0x36e588) && _0x3d4ced('Installing\x20CUDA\x20PyTorch');
    };
    _0x30e955["stdout"]?.['on']("data", _0x3f0281 => {
      _0x21e7f5["push"](Buffer["from"](_0x3f0281));
      _0x5ab046(_0x3f0281);
    });
    _0x30e955["stderr"]?.['on']("data", _0x3a4782 => {
      _0x57312a["push"](Buffer["from"](_0x3a4782));
      _0x5ab046(_0x3a4782);
    });
    _0x30e955['once']('error', _0x6888df => _0x3f10f2(_0x25452b, createProcessStartError(_0x5a3966, pipArgs, {
      'cwd': appRoot
    }, _0x6888df, 0x1)));
    _0x30e955["once"]('exit', (_0x569559, _0x491ab9) => {
      if (_0xa56aa?.["isCancelled"]?.(_0x531678)) {
        _0x3f10f2(_0x25452b, new MediaTaskCancelledError());
        return;
      }
      if (_0x569559 === 0x0) {
        _0x3f10f2(_0x1af7d0, {
          'stdout': Buffer['concat'](_0x21e7f5),
          'stderr': Buffer['concat'](_0x57312a),
          'code': _0x569559,
          'signal': _0x491ab9
        });
        return;
      }
      const _0xb5291 = Buffer["concat"](_0x57312a)["toString"]("utf8")['trim']() || Buffer["concat"](_0x21e7f5)["toString"]("utf8")['trim']() || "pip install exited with " + (_0x569559 ?? _0x491ab9 ?? "unknown");
      _0x3f10f2(_0x25452b, new Error(_0xb5291));
    });
  });
}
function parseJsonLine(_0x5c1ea8) {
  const _0x20715d = String(_0x5c1ea8 || '')["trim"]();
  if (!_0x20715d || !_0x20715d['startsWith']('{')) {
    return null;
  }
  try {
    return JSON['parse'](_0x20715d);
  } catch {
    return null;
  }
}
export function runFunasrTranscriptionProcess({
  appRoot = DEFAULT_APP_ROOT,
  audioAbs: _0x2bf21e,
  downloadModelIfMissing = !![],
  durationSec = 0x0,
  engine = "cpu",
  modelRoot: _0x15523c,
  prepareOnly = ![],
  checkRuntimeOnly = ![],
  pythonCommand: _0x298694,
  certificateEnv = {},
  queue: _0x50c12a,
  spawnImpl = spawn,
  task: _0x201762
} = {}) {
  if (!_0x298694) {
    throw new Error('Python\x20runtime\x20is\x20unavailable');
  }
  if (!_0x15523c) {
    throw new Error("FunASR model directory is unavailable");
  }
  mkdirSync(_0x15523c, {
    'recursive': !![]
  });
  return new Promise((_0x82dec6, _0x3f4d51) => {
    _0x50c12a?.["throwIfCancelled"]?.(_0x201762);
    const _0x3c8513 = buildFunasrTranscriptionArgs({
      'audioAbs': _0x2bf21e,
      'modelRoot': _0x15523c,
      'durationSec': durationSec,
      'downloadModelIfMissing': downloadModelIfMissing,
      'engine': engine,
      'prepareOnly': prepareOnly,
      'checkRuntimeOnly': checkRuntimeOnly
    });
    const _0x558d88 = spawnImpl(_0x298694, _0x3c8513, {
      'cwd': appRoot,
      'env': buildFunasrEnv(_0x15523c, process['env'], certificateEnv),
      'stdio': ["ignore", 'pipe', "pipe"],
      'windowsHide': !![]
    });
    _0x201762["child"] = _0x558d88;
    let _0xed0fc1 = null;
    let _0x3449d2 = null;
    let _0x2cdea7 = '';
    let _0x1ad688 = '';
    let _0x2c704e = AUDIO_VOICE_ASR_STAGE["MODEL_DOWNLOAD"];
    let _0x7b3f18 = mapFunasrProgressToOverall(_0x2c704e, 0x0);
    const _0x3efa33 = (_0x4ad3f5, _0x4c0637, _0x577003 = '') => {
      _0x2c704e = String(_0x4ad3f5 || _0x2c704e);
      _0x7b3f18 = Math["max"](_0x7b3f18, mapFunasrProgressToOverall(_0x2c704e, _0x4c0637));
      _0x50c12a?.["emitProgress"]?.(_0x201762, _0x7b3f18, resolveAsrProgressMessage(_0x2c704e, _0x577003), {
        'stage': _0x2c704e
      });
    };
    const _0x20c167 = setInterval(() => {
      if (_0x50c12a?.["isCancelled"]?.(_0x201762)) {
        try {
          _0x558d88["kill"]();
        } catch {}
        return;
      }
      const _0x18eded = FUNASR_STAGE_RANGES[_0x2c704e] || FUNASR_STAGE_RANGES["transcribe"];
      const _0x303cd7 = Math["min"](_0x18eded[0x1] - 0.01, _0x7b3f18 + 0.006);
      _0x303cd7 > _0x7b3f18 && (_0x7b3f18 = _0x303cd7, _0x50c12a?.["emitProgress"]?.(_0x201762, _0x303cd7, resolveAsrProgressMessage(_0x2c704e), {
        'stage': _0x2c704e
      }));
    }, 0x5dc);
    const _0x9f6f3b = (_0x50024d, _0x177752) => {
      clearInterval(_0x20c167);
      if (_0x201762["child"] === _0x558d88) {
        _0x201762['child'] = null;
      }
      _0x50024d(_0x177752);
    };
    const _0x117369 = _0x523292 => {
      const _0x213efe = parseJsonLine(_0x523292);
      if (!_0x213efe) {
        return;
      }
      if (_0x213efe["type"] === "progress") {
        _0x3efa33(_0x213efe['stage'], _0x213efe["progress"], _0x213efe["message"]);
      } else {
        if (_0x213efe["type"] === "result") {
          _0xed0fc1 = _0x213efe;
        } else {
          _0x213efe["type"] === 'error' && (_0x3449d2 = _0x213efe);
        }
      }
    };
    _0x558d88['stdout']?.['on']("data", _0x9e1ab0 => {
      _0x2cdea7 += Buffer["from"](_0x9e1ab0)["toString"]('utf8');
      const _0x4a3b27 = _0x2cdea7['split'](/\r?\n/);
      _0x2cdea7 = _0x4a3b27["pop"]() || '';
      _0x4a3b27["forEach"](_0x117369);
    });
    _0x558d88['stderr']?.['on']("data", _0x48525a => {
      _0x1ad688 += Buffer["from"](_0x48525a)['toString']("utf8");
    });
    _0x558d88["once"]("error", _0x30f508 => _0x9f6f3b(_0x3f4d51, createProcessStartError(_0x298694, _0x3c8513, {
      'cwd': appRoot
    }, _0x30f508, 0x1)));
    _0x558d88["once"]("exit", (_0x118808, _0x50aac2) => {
      if (_0x2cdea7) {
        _0x117369(_0x2cdea7);
      }
      if (_0x50c12a?.['isCancelled']?.(_0x201762)) {
        _0x9f6f3b(_0x3f4d51, new MediaTaskCancelledError());
        return;
      }
      if (_0x118808 === 0x0 && _0xed0fc1) {
        _0x9f6f3b(_0x82dec6, _0xed0fc1);
        return;
      }
      const _0x4e8403 = String(_0x3449d2?.["message"] || '')["trim"]() || _0x1ad688["trim"]() || "FunASR exited with " + (_0x118808 ?? _0x50aac2 ?? "unknown");
      _0x9f6f3b(_0x3f4d51, new Error(_0x4e8403));
    });
  });
}
export function runSortformerDiarizationProcess({
  appRoot = DEFAULT_APP_ROOT,
  audioAbs: _0x4c1f35,
  downloadModelIfMissing = !![],
  durationSec = 0x0,
  engine = 'cpu',
  modelRoot: _0x25eb18,
  pythonCommand: _0x362afa,
  certificateEnv = {},
  prepareOnly = ![],
  checkRuntimeOnly = ![],
  queue: _0x20cec7,
  spawnImpl = spawn,
  task: _0x43aa29
} = {}) {
  if (!_0x362afa) {
    throw new Error("Python runtime is unavailable");
  }
  if (!_0x25eb18) {
    throw new Error("Sortformer model directory is unavailable");
  }
  mkdirSync(_0x25eb18, {
    'recursive': !![]
  });
  return new Promise((_0x580b23, _0x3395c2) => {
    _0x20cec7?.['throwIfCancelled']?.(_0x43aa29);
    const _0x5d649a = buildSortformerDiarizationArgs({
      'audioAbs': _0x4c1f35,
      'modelRoot': _0x25eb18,
      'durationSec': durationSec,
      'downloadModelIfMissing': downloadModelIfMissing,
      'engine': engine,
      'prepareOnly': prepareOnly,
      'checkRuntimeOnly': checkRuntimeOnly
    });
    const _0x5bd14f = spawnImpl(_0x362afa, _0x5d649a, {
      'cwd': appRoot,
      'env': buildSortformerEnv(_0x25eb18, process["env"], certificateEnv),
      'stdio': ["ignore", "pipe", 'pipe'],
      'windowsHide': !![]
    });
    _0x43aa29['child'] = _0x5bd14f;
    let _0x28758f = null;
    let _0x327894 = null;
    let _0x898a91 = '';
    let _0x571b7d = '';
    let _0x52f9a6 = 0.52;
    const _0x3ed9ff = setInterval(() => {
      if (_0x20cec7?.["isCancelled"]?.(_0x43aa29)) {
        try {
          _0x5bd14f['kill']();
        } catch {}
        return;
      }
      _0x52f9a6 = Math["min"](0.79, _0x52f9a6 + 0.004);
      _0x20cec7?.["emitProgress"]?.(_0x43aa29, _0x52f9a6, "Preparing speaker separation", {
        'stage': AUDIO_VOICE_ASR_STAGE["DIARIZATION_MODEL_PREPARE"]
      });
    }, 0x7d0);
    const _0x55a4a9 = (_0x52de5f, _0x1ba54a) => {
      clearInterval(_0x3ed9ff);
      if (_0x43aa29["child"] === _0x5bd14f) {
        _0x43aa29['child'] = null;
      }
      _0x52de5f(_0x1ba54a);
    };
    const _0x268674 = _0x156e13 => {
      const _0x10ab4d = parseJsonLine(_0x156e13);
      if (!_0x10ab4d) {
        return;
      }
      if (_0x10ab4d["type"] === "progress") {
        const _0x55a589 = mapFunasrProgressToOverall(_0x10ab4d["stage"], _0x10ab4d["progress"]);
        _0x52f9a6 = Math["max"](_0x52f9a6, _0x55a589);
        _0x20cec7?.["emitProgress"]?.(_0x43aa29, _0x52f9a6, _0x10ab4d['message'] || "Separating speakers", {
          'stage': _0x10ab4d["stage"] || AUDIO_VOICE_ASR_STAGE["DIARIZE"]
        });
      } else {
        if (_0x10ab4d["type"] === "result") {
          _0x28758f = _0x10ab4d;
        } else {
          _0x10ab4d['type'] === "error" && (_0x327894 = _0x10ab4d);
        }
      }
    };
    _0x5bd14f["stdout"]?.['on']("data", _0xc9ba8 => {
      _0x898a91 += Buffer["from"](_0xc9ba8)["toString"]("utf8");
      const _0x32cfc8 = _0x898a91["split"](/\r?\n/);
      _0x898a91 = _0x32cfc8['pop']() || '';
      _0x32cfc8['forEach'](_0x268674);
    });
    _0x5bd14f["stderr"]?.['on']("data", _0x58cfec => {
      _0x571b7d += Buffer["from"](_0x58cfec)['toString']("utf8");
    });
    _0x5bd14f['once']('error', _0x48f3df => _0x55a4a9(_0x3395c2, createProcessStartError(_0x362afa, _0x5d649a, {
      'cwd': appRoot
    }, _0x48f3df, 0x1)));
    _0x5bd14f["once"]('exit', (_0x316a0f, _0x452538) => {
      if (_0x898a91) {
        _0x268674(_0x898a91);
      }
      if (_0x20cec7?.["isCancelled"]?.(_0x43aa29)) {
        _0x55a4a9(_0x3395c2, new MediaTaskCancelledError());
        return;
      }
      if (_0x316a0f === 0x0 && _0x28758f) {
        _0x55a4a9(_0x580b23, _0x28758f);
        return;
      }
      const _0xae9489 = String(_0x327894?.["message"] || '')["trim"]() || _0x571b7d["trim"]() || "Sortformer exited with " + (_0x316a0f ?? _0x452538 ?? "unknown");
      _0x55a4a9(_0x3395c2, new Error(_0xae9489));
    });
  });
}
async function detectSpeechSegmentsWithSilence({
  durationSec: _0x1c614f,
  getRuntimeToolOrFallback: _0x1596c5,
  options: _0x50542c,
  queue: _0x2e2a1e,
  sourceAbs: _0x2897cf,
  task: _0x27d5e9
}) {
  _0x2e2a1e['emitProgress'](_0x27d5e9, 0.12, "Detecting voice segments", {
    'stage': AUDIO_VOICE_ASR_STAGE["TRANSCRIBE"]
  });
  const _0x2c6fc9 = await _0x2e2a1e['runProcess'](_0x27d5e9, _0x1596c5("ffmpeg"), ['-hide_banner', '-i', _0x2897cf, "-vn", "-af", 'silencedetect=noise=' + _0x50542c['noiseDb'] + "dB:d=" + _0x50542c['minSilenceSec'], '-f', "null", '-']);
  const _0x5177de = Buffer['concat']([_0x2c6fc9["stdout"] || Buffer["alloc"](0x0), _0x2c6fc9['stderr'] || Buffer['alloc'](0x0)])['toString']('utf8');
  return buildAudioVoiceSpeechSegments({
    'silenceRanges': parseSilenceDetectRanges(_0x5177de, _0x1c614f),
    'durationSec': _0x1c614f,
    'paddingMs': _0x50542c["paddingMs"]
  })["map"](_0x241e28 => ({
    ..._0x241e28,
    'sourceText': ''
  }));
}
async function extractAsrAudio({
  asrAudioAbs: _0x318c3a,
  getRuntimeToolOrFallback: _0x1ed471,
  queue: _0x48d4a7,
  sourceAbs: _0x514078,
  task: _0x17b18c
}) {
  _0x48d4a7["emitProgress"](_0x17b18c, 0.04, "Preparing audio for subtitles", {
    'stage': AUDIO_VOICE_ASR_STAGE['MODEL_PREPARE']
  });
  await _0x48d4a7['runProcess'](_0x17b18c, _0x1ed471("ffmpeg"), ['-y', '-i', _0x514078, "-map", "0:a:0", "-vn", "-ac", '1', "-ar", "16000", "-c:a", "pcm_s16le", _0x318c3a]);
}
async function extractDoubaoAsrAudio({
  asrAudioAbs: _0x29098e,
  getRuntimeToolOrFallback: _0x3c487c,
  queue: _0x468f0a,
  sourceAbs: _0x4e8e2d,
  task: _0x166057
}) {
  _0x468f0a["emitProgress"](_0x166057, 0.04, "Preparing audio for subtitles", {
    'stage': AUDIO_VOICE_ASR_STAGE["MODEL_PREPARE"]
  });
  await _0x468f0a["runProcess"](_0x166057, _0x3c487c("ffmpeg"), ['-y', '-i', _0x4e8e2d, "-map", '0:a:0', "-vn", '-ac', '1', "-ar", "16000", '-c:a', "libmp3lame", "-b:a", "64k", _0x29098e]);
}
export function createAudioVoiceAnalyzeMediaTaskHandler({
  createOutputFilename: _0x513e6b,
  ffprobeHasAudio: _0x221ac5,
  ffprobeVideoMeta: _0x280301,
  getDoubaoAsrConfig: _0x122191,
  getBailianAsrConfig: _0x511a24,
  getFunasrModelRootDir: _0x551f3a,
  getPythonCertificateEnv: _0x2fb456,
  getSortformerModelRootDir: _0x28898e,
  getOutputDir: _0x78eb7b,
  getRuntimeToolOrFallback: _0x3a130c,
  resolveMediaTaskSource: _0x26441a,
  resolvePythonCommand: _0x25f819,
  runDoubaoAsrTranscription: _0x11411d = runDoubaoAsrTranscription,
  runBailianAsrTranscription: _0x3bc853,
  runFunasrTranscription = runFunasrTranscriptionProcess,
  runSortformerDiarization = runSortformerDiarizationProcess,
  toOutputLocalPath: _0x370cd9,
  appRoot = DEFAULT_APP_ROOT
}) {
  const _0x18b76f = createAudioVoiceCloudAsrAdapters({
    'getDoubaoAsrConfig': _0x122191,
    'getBailianAsrConfig': _0x511a24,
    'runDoubaoAsrTranscription': _0x11411d,
    'runBailianAsrTranscription': _0x3bc853
  });
  return async (_0x44562c, _0x139c32) => {
    const _0x20d880 = _0x26441a(_0x44562c["payload"]["src"]);
    const _0x1cd9a0 = _0x44562c['payload']['args'] || {};
    const _0x3c9223 = normalizeSilenceOptions(_0x1cd9a0);
    const _0x15b809 = await _0x280301(_0x139c32, _0x44562c, _0x20d880);
    const _0x2eb271 = !!(_0x15b809["width"] && _0x15b809["height"]);
    if (!(await _0x221ac5(_0x139c32, _0x44562c, _0x20d880))) {
      if (!_0x2eb271) {
        throw new Error("Source media has no audio stream");
      }
      throw new Error("Source video has no audio stream");
    }
    const _0x3b3fda = Math["max"](0x0, Number(_0x15b809['duration'] || 0x0));
    if (!(_0x3b3fda > 0x0)) {
      throw new Error("Source media duration is unavailable");
    }
    const _0x48d638 = a262_0xcc99b9["join"](_0x78eb7b(), 'AudioVoiceAnalyze');
    const _0x3e784f = a262_0xcc99b9["join"](_0x78eb7b(), 'AudioVoiceSegments');
    mkdirSync(_0x48d638, {
      'recursive': !![]
    });
    mkdirSync(_0x3e784f, {
      'recursive': !![]
    });
    const _0x542ea8 = normalizeAsrProvider(_0x1cd9a0);
    const _0x1e6f8f = Object["hasOwn"](_0x18b76f, _0x542ea8) ? _0x18b76f[_0x542ea8] : null;
    const _0x25ab15 = _0x542ea8 === "funasr";
    let _0x4cbd84 = '';
    let _0xf6231d = [];
    let _0x143586 = '';
    let _0x2473c3 = '';
    let _0x19da4c = '';
    let _0x3e4b6f = "none";
    if (_0x1e6f8f || _0x25ab15) {
      _0x139c32["emitProgress"](_0x44562c, 0.02, "Preparing subtitle recognition model", {
        'stage': _0x25ab15 ? AUDIO_VOICE_ASR_STAGE["MODEL_DOWNLOAD"] : AUDIO_VOICE_ASR_STAGE["MODEL_PREPARE"]
      });
      const _0x8e797b = _0x513e6b("source_asr", _0x1e6f8f ? "mp3" : 'wav');
      const _0x46fdfd = a262_0xcc99b9["join"](_0x48d638, _0x8e797b);
      await (_0x1e6f8f ? extractDoubaoAsrAudio : extractAsrAudio)({
        'asrAudioAbs': _0x46fdfd,
        'getRuntimeToolOrFallback': _0x3a130c,
        'queue': _0x139c32,
        'sourceAbs': _0x20d880,
        'task': _0x44562c
      });
      if (_0x1e6f8f) {
        const _0x3ec90c = _0x1e6f8f["getConfig"]?.() || {};
        _0x143586 = String(_0x3ec90c["baseUrl"] || _0x3ec90c["apiUrl"] || '')["trim"]();
        const _0x28b01c = await _0x1e6f8f["run"]({
          'audioAbs': _0x46fdfd,
          'credentials': _0x3ec90c,
          'durationSec': _0x3b3fda,
          'queue': _0x139c32,
          'task': _0x44562c
        });
        const _0x466b07 = mergeFunasrTranscriptSegments(_0x1e6f8f["normalize"](_0x28b01c, _0x3b3fda));
        hasRecognizedTranscriptText(_0x466b07) ? _0xf6231d = _0x466b07 : _0x4cbd84 = "empty";
      } else {
        _0x2473c3 = String(_0x551f3a?.() || '')["trim"]();
        if (!_0x2473c3) {
          throw new Error("FunASR model directory is unavailable");
        }
        mkdirSync(_0x2473c3, {
          'recursive': !![]
        });
        _0x3e4b6f = normalizeDiarizationProvider(_0x1cd9a0);
        const _0x4a5c7f = await runFunasrTranscription({
          'appRoot': appRoot,
          'audioAbs': _0x46fdfd,
          'downloadModelIfMissing': _0x1cd9a0["downloadModelIfMissing"] !== ![],
          'durationSec': _0x3b3fda,
          'engine': normalizeFunasrEngine(_0x1cd9a0["engine"]),
          'modelRoot': _0x2473c3,
          'pythonCommand': _0x25f819?.(),
          'certificateEnv': _0x2fb456?.() || {},
          'queue': _0x139c32,
          'task': _0x44562c
        });
        const _0x28d7a1 = normalizeFunasrTranscriptSegments(_0x4a5c7f, _0x3b3fda);
        let _0x49ffcc = stripTranscriptSpeakerLabels(_0x28d7a1);
        if (_0x3e4b6f === 'sortformer' && _0x28d7a1["length"]) {
          _0x19da4c = String(_0x28898e?.() || resolveSortformerModelRootFromFunasrRoot(_0x2473c3))["trim"]();
          if (!_0x19da4c) {
            throw new Error("Sortformer model directory is unavailable");
          }
          mkdirSync(_0x19da4c, {
            'recursive': !![]
          });
          _0x139c32["emitProgress"](_0x44562c, 0.52, "Preparing speaker separation model", {
            'stage': AUDIO_VOICE_ASR_STAGE['DIARIZATION_MODEL_DOWNLOAD']
          });
          const _0x5c612d = await runSortformerDiarization({
            'appRoot': appRoot,
            'audioAbs': _0x46fdfd,
            'downloadModelIfMissing': _0x1cd9a0["downloadModelIfMissing"] !== ![],
            'durationSec': _0x3b3fda,
            'engine': normalizeFunasrEngine(_0x1cd9a0['engine']),
            'modelRoot': _0x19da4c,
            'pythonCommand': _0x25f819?.(),
            'certificateEnv': _0x2fb456?.() || {},
            'queue': _0x139c32,
            'task': _0x44562c
          });
          _0x49ffcc = assignDiarizationSpeakersToTranscriptSegments(_0x28d7a1, normalizeDiarizationSegments(_0x5c612d, _0x3b3fda));
        }
        const _0x25aed2 = mergeFunasrTranscriptSegments(_0x49ffcc);
        hasRecognizedTranscriptText(_0x25aed2) ? _0xf6231d = _0x25aed2 : _0x4cbd84 = "empty";
      }
    }
    !_0xf6231d["length"] && (_0xf6231d = await detectSpeechSegmentsWithSilence({
      'durationSec': _0x3b3fda,
      'getRuntimeToolOrFallback': _0x3a130c,
      'options': _0x3c9223,
      'queue': _0x139c32,
      'sourceAbs': _0x20d880,
      'task': _0x44562c
    }));
    const _0x1cf4ac = _0x513e6b("source_audio", 'mp3');
    const _0x368d54 = a262_0xcc99b9['join'](_0x48d638, _0x1cf4ac);
    const _0xe0b015 = _0x370cd9('AudioVoiceAnalyze', _0x1cf4ac);
    _0x139c32["emitProgress"](_0x44562c, 0.56, "Extracting source audio", {
      'stage': AUDIO_VOICE_ASR_STAGE["SLICE"]
    });
    await _0x139c32["runProcess"](_0x44562c, _0x3a130c("ffmpeg"), ['-y', '-i', _0x20d880, "-map", "0:a:0", "-vn", "-c:a", "libmp3lame", "-b:a", '192k', _0x368d54]);
    const _0x37d382 = [];
    for (let _0x4ad0a7 = 0x0; _0x4ad0a7 < _0xf6231d["length"]; _0x4ad0a7 += 0x1) {
      const _0x445021 = _0xf6231d[_0x4ad0a7];
      const _0x134454 = _0x513e6b("segment_" + (_0x4ad0a7 + 0x1), "mp3");
      const _0x3ab0a2 = a262_0xcc99b9["join"](_0x3e784f, _0x134454);
      const _0x11e6c0 = _0x370cd9('AudioVoiceSegments', _0x134454);
      _0x139c32["emitProgress"](_0x44562c, Math['min'](0.95, 0.62 + _0x4ad0a7 / Math['max'](0x1, _0xf6231d["length"]) * 0.33), 'Cutting\x20sentence\x20audio', {
        'stage': AUDIO_VOICE_ASR_STAGE["SLICE"]
      });
      await _0x139c32["runProcess"](_0x44562c, _0x3a130c('ffmpeg'), buildAudioVoiceSegmentCutArgs({
        'sourceAudioAbs': _0x368d54,
        'outAbs': _0x3ab0a2,
        'startMs': _0x445021["startMs"],
        'endMs': _0x445021['endMs']
      }));
      _0x37d382["push"]({
        'id': "audio-voice-segment-" + (_0x4ad0a7 + 0x1),
        'startMs': _0x445021["startMs"],
        'endMs': _0x445021['endMs'],
        'sourceText': String(_0x445021["sourceText"] || ''),
        ...(_0x445021['speaker'] ? {
          'speaker': _0x445021["speaker"]
        } : {}),
        'sourceAudioLocalPath': _0x11e6c0,
        'sourceAudioUrl': '/' + _0x11e6c0
      });
    }
    return {
      'success': !![],
      'durationSec': _0x3b3fda,
      'sourceAudio': {
        'localPath': _0xe0b015,
        'url': '/' + _0xe0b015
      },
      'asr': {
        'provider': _0x1e6f8f || _0x25ab15 ? _0x542ea8 : "silence",
        'baseUrl': _0x143586,
        'modelRoot': _0x25ab15 ? _0x2473c3 : '',
        'diarizationProvider': _0x3e4b6f,
        'diarizationModelRoot': _0x19da4c,
        'fallbackReason': _0x4cbd84
      },
      'segments': _0x37d382
    };
  };
}
export function createFunasrModelPrepareMediaTaskHandler({
  getFunasrModelRootDir: _0x444c88,
  getPythonCertificateEnv: _0x4fe653,
  resolvePythonCommand: _0x1a2389,
  runFunasrTranscription = runFunasrTranscriptionProcess,
  appRoot = DEFAULT_APP_ROOT
} = {}) {
  return async (_0x309170, _0x3cae00) => {
    const _0x400d42 = _0x309170?.["payload"]?.["args"] || {};
    const _0x1d7fc1 = normalizeFunasrEngine(_0x400d42['engine']);
    const _0x58842b = String(_0x444c88?.() || '')["trim"]();
    if (!_0x58842b) {
      throw new Error("FunASR model directory is unavailable");
    }
    mkdirSync(_0x58842b, {
      'recursive': !![]
    });
    _0x3cae00?.['emitProgress']?.(_0x309170, 0.01, "Preparing subtitle recognition model", {
      'stage': AUDIO_VOICE_ASR_STAGE["MODEL_DOWNLOAD"]
    });
    const _0x194809 = await runFunasrTranscription({
      'appRoot': appRoot,
      'downloadModelIfMissing': _0x400d42['downloadModelIfMissing'] !== ![],
      'engine': _0x1d7fc1,
      'modelRoot': _0x58842b,
      'prepareOnly': !![],
      'pythonCommand': _0x1a2389?.(),
      'certificateEnv': _0x4fe653?.() || {},
      'queue': _0x3cae00,
      'task': _0x309170
    });
    return {
      'success': !![],
      'provider': 'funasr',
      'engine': _0x1d7fc1,
      'ready': !![],
      'prepared': _0x194809?.["prepared"] !== ![]
    };
  };
}
export function createAudioVoiceModelPrepareMediaTaskHandler({
  getFunasrModelRootDir: _0x46c837,
  getPythonCertificateEnv: _0xa490c4,
  getSortformerModelRootDir: _0x5164b4,
  resolvePythonCommand: _0x1af378,
  runFunasrTranscription = runFunasrTranscriptionProcess,
  runSortformerDiarization = runSortformerDiarizationProcess,
  appRoot = DEFAULT_APP_ROOT
} = {}) {
  return async (_0x1afe19, _0x2f86ac) => {
    const _0x589624 = _0x1afe19?.["payload"]?.["args"] || {};
    const _0x5a9a30 = normalizeFunasrEngine(_0x589624["engine"]);
    const _0x54c244 = String(_0x46c837?.() || '')["trim"]();
    if (!_0x54c244) {
      throw new Error("FunASR model directory is unavailable");
    }
    mkdirSync(_0x54c244, {
      'recursive': !![]
    });
    const _0x4e4d1a = String(_0x5164b4?.() || resolveSortformerModelRootFromFunasrRoot(_0x54c244))["trim"]();
    if (!_0x4e4d1a) {
      throw new Error("Sortformer model directory is unavailable");
    }
    mkdirSync(_0x4e4d1a, {
      'recursive': !![]
    });
    _0x2f86ac?.['emitProgress']?.(_0x1afe19, 0.01, "Preparing subtitle recognition model", {
      'stage': AUDIO_VOICE_ASR_STAGE["MODEL_DOWNLOAD"]
    });
    await runFunasrTranscription({
      'appRoot': appRoot,
      'downloadModelIfMissing': _0x589624["downloadModelIfMissing"] !== ![],
      'engine': _0x5a9a30,
      'modelRoot': _0x54c244,
      'prepareOnly': !![],
      'pythonCommand': _0x1af378?.(),
      'certificateEnv': _0xa490c4?.() || {},
      'queue': _0x2f86ac,
      'task': _0x1afe19
    });
    _0x2f86ac?.["emitProgress"]?.(_0x1afe19, 0.52, "Preparing speaker separation model", {
      'stage': AUDIO_VOICE_ASR_STAGE["DIARIZATION_MODEL_DOWNLOAD"]
    });
    const _0x45e32e = await runSortformerDiarization({
      'appRoot': appRoot,
      'downloadModelIfMissing': _0x589624["downloadModelIfMissing"] !== ![],
      'engine': _0x5a9a30,
      'modelRoot': _0x4e4d1a,
      'prepareOnly': !![],
      'pythonCommand': _0x1af378?.(),
      'certificateEnv': _0xa490c4?.() || {},
      'queue': _0x2f86ac,
      'task': _0x1afe19
    });
    _0x2f86ac?.["emitProgress"]?.(_0x1afe19, 0x1, "Audio voice models are ready", {
      'stage': AUDIO_VOICE_ASR_STAGE["DIARIZE"]
    });
    return {
      'success': !![],
      'provider': "audioVoice",
      'asrProvider': "funasr",
      'diarizationProvider': "sortformer",
      'engine': _0x5a9a30,
      'ready': !![],
      'funasrModelRoot': _0x54c244,
      'sortformerModelRoot': _0x4e4d1a,
      'prepared': _0x45e32e?.["prepared"] !== ![]
    };
  };
}
export function createFunasrRuntimeCheckMediaTaskHandler({
  getFunasrModelRootDir: _0x4999da,
  getPythonCertificateEnv: _0x529340,
  resolvePythonCommand: _0x523617,
  runFunasrTranscription = runFunasrTranscriptionProcess,
  appRoot = DEFAULT_APP_ROOT
} = {}) {
  return async (_0xebc74b, _0x4d9a70) => {
    const _0x588f7a = _0xebc74b?.["payload"]?.["args"] || {};
    const _0x1f4449 = normalizeFunasrEngine(_0x588f7a["engine"]);
    const _0x14de33 = String(_0x4999da?.() || '')["trim"]();
    if (!_0x14de33) {
      throw new Error("FunASR model directory is unavailable");
    }
    mkdirSync(_0x14de33, {
      'recursive': !![]
    });
    _0x4d9a70?.["emitProgress"]?.(_0xebc74b, 0.01, 'Checking\x20recognition\x20runtime', {
      'stage': AUDIO_VOICE_ASR_STAGE['MODEL_PREPARE']
    });
    const _0x420f11 = await runFunasrTranscription({
      'appRoot': appRoot,
      'checkRuntimeOnly': !![],
      'downloadModelIfMissing': ![],
      'engine': _0x1f4449,
      'modelRoot': _0x14de33,
      'pythonCommand': _0x523617?.(),
      'certificateEnv': _0x529340?.() || {},
      'queue': _0x4d9a70,
      'task': _0xebc74b
    });
    return {
      'success': !![],
      'provider': 'funasr',
      'engine': _0x1f4449,
      'available': _0x420f11?.['available'] !== ![],
      'code': String(_0x420f11?.["code"] || ''),
      'message': String(_0x420f11?.["message"] || ''),
      'device': String(_0x420f11?.["device"] || '')
    };
  };
}
export function createFunasrGpuTorchInstallMediaTaskHandler({
  getFunasrModelRootDir: _0x46ec16,
  getPythonCertificateEnv: _0xaa8661,
  resolvePythonCommand: _0x4abff4,
  runPipInstall = runPipInstallProcess,
  runFunasrTranscription = runFunasrTranscriptionProcess,
  torchIndexUrl = DEFAULT_FUNASR_GPU_TORCH_INDEX_URL,
  torchPackages = DEFAULT_FUNASR_GPU_TORCH_PACKAGES,
  appRoot = DEFAULT_APP_ROOT
} = {}) {
  return async (_0x106337, _0x584cfe) => {
    const _0x4b63b0 = _0x106337?.["payload"]?.["args"] || {};
    const _0x353ca6 = String(_0x46ec16?.() || '')["trim"]();
    if (!_0x353ca6) {
      throw new Error('FunASR\x20model\x20directory\x20is\x20unavailable');
    }
    mkdirSync(_0x353ca6, {
      'recursive': !![]
    });
    const _0x1a95a7 = _0x4abff4?.();
    if (!_0x1a95a7) {
      throw new Error("Python runtime is unavailable");
    }
    const _0x3aaf8f = await detectNvidiaGpuNameForInstall({
      'queue': _0x584cfe,
      'task': _0x106337
    });
    const _0x3fad38 = buildFunasrGpuTorchInstallArgs({
      'indexUrl': _0x4b63b0["torchIndexUrl"] || torchIndexUrl,
      'packages': Array["isArray"](_0x4b63b0["torchPackages"]) ? _0x4b63b0['torchPackages'] : torchPackages
    });
    _0x584cfe?.["emitProgress"]?.(_0x106337, 0.12, "Installing GPU acceleration component", {
      'stage': FUNASR_GPU_TORCH_STAGE["INSTALL"]
    });
    await runPipInstall({
      'appRoot': appRoot,
      'env': buildFunasrEnv(_0x353ca6, process['env'], _0xaa8661?.() || {}),
      'pipArgs': _0x3fad38,
      'pythonCommand': _0x1a95a7,
      'queue': _0x584cfe,
      'task': _0x106337
    });
    _0x584cfe?.["emitProgress"]?.(_0x106337, 0.9, "Verifying GPU acceleration", {
      'stage': FUNASR_GPU_TORCH_STAGE["VERIFY"]
    });
    const _0x2be200 = await runFunasrTranscription({
      'appRoot': appRoot,
      'checkRuntimeOnly': !![],
      'downloadModelIfMissing': ![],
      'engine': "gpu",
      'modelRoot': _0x353ca6,
      'pythonCommand': _0x1a95a7,
      'queue': _0x584cfe,
      'task': _0x106337
    });
    if (_0x2be200?.["available"] === ![]) {
      throw new Error(String(_0x2be200?.["message"] || 'GPU\x20acceleration\x20is\x20still\x20unavailable'));
    }
    return {
      'success': !![],
      'provider': "funasr",
      'engine': "gpu",
      'gpuName': _0x3aaf8f,
      'installed': !![],
      'verified': !![],
      'device': String(_0x2be200?.["device"] || "cuda:0"),
      'torchVersion': String(_0x2be200?.["torchVersion"] || ''),
      'torchCuda': String(_0x2be200?.["torchCuda"] || '')
    };
  };
}