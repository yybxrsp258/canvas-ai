import { logDiagnosticEvent } from '../src/services/diagnosticsService.js';
import { desktopBridge } from '../src/services/desktopBridge.js';
import { normalizeLocalPath } from '../src/utils/localMediaPath.js';
import { requester } from './requester.js';
const TERMINAL_STATUSES = new Set(['complete', "failed", "cancelled"]);
const DIAGNOSTIC_SRC_TAIL_LENGTH = 0x60;
const SOURCE_REQUIRED_KINDS = new Set(["audioCut", "audioWaveform", "audioVoiceAnalyze", 'audioVoiceCompose', "videoAudioSeparate", "videoAudioMux", 'videoCut', 'mediaClipExport', 'videoFirstFrame', "videoPoster", "videoReverse", "videoToGif"]);
const MULTI_SOURCE_KINDS = new Set(["videoCompose", 'audioCompose']);
function toMessage(_0x27e713, _0x2b0538 = "Media task failed") {
  if (typeof _0x27e713 === "string") {
    return _0x27e713;
  }
  if (_0x27e713?.["message"]) {
    return String(_0x27e713["message"]);
  }
  return String(_0x27e713 || _0x2b0538);
}
function normalizeDiagnosticSrc(_0x592c6e) {
  const _0x5544b2 = String(_0x592c6e || '')['trim']();
  return _0x5544b2;
}
function digestDiagnosticSrc(_0x457e3b) {
  const _0xfbf876 = normalizeDiagnosticSrc(_0x457e3b);
  if (!_0xfbf876) {
    return '';
  }
  let _0x4a29b7 = 0x811c9dc5;
  for (let _0x538a70 = 0x0; _0x538a70 < _0xfbf876["length"]; _0x538a70 += 0x1) {
    _0x4a29b7 ^= _0xfbf876["charCodeAt"](_0x538a70);
    _0x4a29b7 = Math['imul'](_0x4a29b7, 0x1000193) >>> 0x0;
  }
  return _0x4a29b7['toString'](0x10)["padStart"](0x8, '0');
}
function summarizeDiagnosticSrc(_0x5ccf04) {
  const _0xe0f013 = normalizeDiagnosticSrc(_0x5ccf04);
  const _0x144c89 = _0xe0f013['replace'](/\\/g, '/');
  const _0x20b0a9 = _0x144c89["split"]('/')["filter"](Boolean);
  const _0x4c06a0 = _0x20b0a9["length"] > 0x2 ? _0x20b0a9["slice"](-0x2)["join"]('/') : _0x20b0a9['join']('/') || _0x144c89;
  return {
    'srcDigest': digestDiagnosticSrc(_0xe0f013),
    'srcTail': _0x4c06a0 ? _0x4c06a0["slice"](-DIAGNOSTIC_SRC_TAIL_LENGTH) : '',
    'srcLength': _0xe0f013["length"]
  };
}
function firstDefined(..._0x2c24e0) {
  for (const _0x375b77 of _0x2c24e0) {
    if (_0x375b77 !== undefined && _0x375b77 !== null) {
      return _0x375b77;
    }
  }
  return '';
}
function normalizePayloadSrcs(_0x11e9ec = {}) {
  return Array['isArray'](_0x11e9ec?.["srcs"]) ? _0x11e9ec['srcs'] : Array["isArray"](_0x11e9ec?.['args']?.['srcs']) ? _0x11e9ec["args"]["srcs"] : [];
}
function normalizePayloadAudioClipSources(_0x455f53 = {}) {
  const _0x44b556 = Array['isArray'](_0x455f53?.['args']?.["audioClips"]) ? _0x455f53["args"]["audioClips"] : Array["isArray"](_0x455f53?.['audioClips']) ? _0x455f53["audioClips"] : [];
  return _0x44b556["map"](_0x3aba95 => firstDefined(_0x3aba95?.["src"], _0x3aba95?.["sourceKey"], _0x3aba95?.["localPath"], _0x3aba95?.["path"]));
}
function normalizePayloadAudioVoiceClipSources(_0x40f101 = {}) {
  const _0x3ee6f4 = Array["isArray"](_0x40f101?.["args"]?.["clips"]) ? _0x40f101["args"]["clips"] : Array["isArray"](_0x40f101?.['clips']) ? _0x40f101['clips'] : [];
  return _0x3ee6f4["map"](_0x38f2c0 => firstDefined(_0x38f2c0?.['src'], _0x38f2c0?.["localPath"], _0x38f2c0?.["path"], _0x38f2c0?.['audioUrl']));
}
function normalizeVirtualMediaSource(_0x24abea) {
  return normalizeLocalPath(_0x24abea);
}
function isValidMediaTaskSource(_0x115d91) {
  return !!normalizeVirtualMediaSource(_0x115d91);
}
function getPayloadSources(_0x4d743a = {}, _0x59ae24 = undefined) {
  const _0x18aca6 = normalizePayloadSrcs(_0x4d743a);
  const _0x52afba = _0x59ae24 !== undefined ? _0x59ae24 : firstDefined(_0x4d743a?.['src'], _0x4d743a?.['originalLocalPath'], _0x4d743a?.['localPath'], _0x18aca6[0x0]);
  return {
    ...summarizeDiagnosticSrc(_0x52afba),
    'srcsCount': _0x18aca6["length"]
  };
}
function validateMediaTaskSources(_0x42e020 = {}) {
  const _0x1c4cd2 = String(_0x42e020?.["kind"] || '')['trim']();
  const _0x4ee316 = normalizePayloadSrcs(_0x42e020);
  const _0x1ac017 = MULTI_SOURCE_KINDS["has"](_0x1c4cd2) || _0x4ee316["length"] > 0x0;
  if (_0x1ac017) {
    const _0x2c6946 = _0x1c4cd2 === "videoCompose" && _0x42e020?.["args"]?.["includeAudio"] === ![] ? 0x1 : MULTI_SOURCE_KINDS["has"](_0x1c4cd2) ? 0x2 : 0x1;
    if (_0x4ee316["length"] < _0x2c6946) {
      return {
        'index': 0x0,
        'value': '',
        'reason': "missing"
      };
    }
    for (let _0x17debf = 0x0; _0x17debf < _0x4ee316['length']; _0x17debf += 0x1) {
      if (!isValidMediaTaskSource(_0x4ee316[_0x17debf])) {
        return {
          'index': _0x17debf,
          'value': _0x4ee316[_0x17debf],
          'reason': "invalid"
        };
      }
    }
    return null;
  }
  const _0x2ddde5 = firstDefined(_0x42e020?.["src"], _0x42e020?.['originalLocalPath'], _0x42e020?.['localPath']);
  const _0x1599ec = _0x42e020?.['src'] !== undefined || _0x42e020?.["originalLocalPath"] !== undefined || _0x42e020?.["localPath"] !== undefined;
  if (!SOURCE_REQUIRED_KINDS["has"](_0x1c4cd2) && !_0x1599ec) {
    return null;
  }
  if (!isValidMediaTaskSource(_0x2ddde5)) {
    return {
      'index': 0x0,
      'value': _0x2ddde5,
      'reason': normalizeDiagnosticSrc(_0x2ddde5) ? "invalid" : "missing"
    };
  }
  if (_0x1c4cd2 === "mediaClipExport") {
    const _0x587ca0 = firstDefined(_0x42e020?.["args"]?.["audioSrc"], _0x42e020?.["audioSrc"]);
    const _0x31e534 = _0x42e020?.["args"]?.['audioSrc'] !== undefined || _0x42e020?.["audioSrc"] !== undefined;
    if (_0x31e534 && !isValidMediaTaskSource(_0x587ca0)) {
      return {
        'index': 0x1,
        'value': _0x587ca0,
        'reason': normalizeDiagnosticSrc(_0x587ca0) ? "invalid" : "missing"
      };
    }
    const _0x304dd9 = normalizePayloadAudioClipSources(_0x42e020);
    for (let _0x275c23 = 0x0; _0x275c23 < _0x304dd9["length"]; _0x275c23 += 0x1) {
      if (!isValidMediaTaskSource(_0x304dd9[_0x275c23])) {
        return {
          'index': _0x275c23 + 0x1,
          'value': _0x304dd9[_0x275c23],
          'reason': normalizeDiagnosticSrc(_0x304dd9[_0x275c23]) ? "invalid" : "missing"
        };
      }
    }
  }
  if (_0x1c4cd2 === "videoAudioMux") {
    const _0x2b7441 = firstDefined(_0x42e020?.["args"]?.['audioSrc'], _0x42e020?.['audioSrc']);
    if (!isValidMediaTaskSource(_0x2b7441)) {
      return {
        'index': 0x1,
        'value': _0x2b7441,
        'reason': normalizeDiagnosticSrc(_0x2b7441) ? 'invalid' : 'missing'
      };
    }
  }
  if (_0x1c4cd2 === "audioVoiceCompose") {
    const _0x7bed53 = normalizePayloadAudioVoiceClipSources(_0x42e020);
    if (_0x7bed53['length'] <= 0x0) {
      return {
        'index': 0x1,
        'value': '',
        'reason': "missing"
      };
    }
    for (let _0x283e97 = 0x0; _0x283e97 < _0x7bed53["length"]; _0x283e97 += 0x1) {
      if (!isValidMediaTaskSource(_0x7bed53[_0x283e97])) {
        return {
          'index': _0x283e97 + 0x1,
          'value': _0x7bed53[_0x283e97],
          'reason': normalizeDiagnosticSrc(_0x7bed53[_0x283e97]) ? "invalid" : "missing"
        };
      }
    }
  }
  return null;
}
function buildDiagnosticContext(_0x888d78 = {}, _0x1432a0 = {}) {
  const _0x2d410d = getPayloadSources(_0x888d78, _0x1432a0['sourceValue']);
  const _0xd77a2c = {
    'taskId': String(_0x1432a0['taskId'] || _0x888d78?.['taskId'] || ''),
    'kind': String(_0x1432a0["kind"] || _0x888d78?.["kind"] || ''),
    'nodeId': String(_0x1432a0["nodeId"] || _0x888d78?.['nodeId'] || ''),
    'assetId': String(_0x1432a0["assetId"] || _0x888d78?.["assetId"] || ''),
    'srcDigest': _0x2d410d["srcDigest"],
    'srcTail': _0x2d410d["srcTail"],
    'srcLength': _0x2d410d["srcLength"],
    'srcsCount': _0x2d410d['srcsCount'],
    'status': String(_0x1432a0['status'] || ''),
    'error': toMessage(_0x1432a0["error"] || '')
  };
  const _0x65d768 = Number(_0x1432a0['invalidSourceIndex']);
  Number["isFinite"](_0x65d768) && (_0xd77a2c['invalidSourceIndex'] = _0x65d768);
  return _0xd77a2c;
}
function logMediaTaskFailure(_0x2c3700, _0x162d95 = {}, _0x13e844 = {}) {
  void logDiagnosticEvent({
    'type': _0x2c3700,
    'level': "error",
    'source': 'renderer',
    'message': toMessage(_0x13e844["error"] || _0x13e844["status"] || _0x2c3700),
    'context': buildDiagnosticContext(_0x162d95, _0x13e844)
  });
}
function getMediaTaskBridge() {
  return desktopBridge["mediaTask"]["isAvailable"]() ? desktopBridge['mediaTask'] : null;
}
export function canUseElectronMediaTask() {
  return !!getMediaTaskBridge();
}
export function waitForElectronMediaTask(_0x2d4395, {
  timeout = 0x0,
  diagnosticPayload = {}
} = {}) {
  const _0x5db649 = getMediaTaskBridge();
  const _0x6299c0 = String(_0x2d4395 || '')['trim']();
  if (!_0x5db649 || !_0x6299c0) {
    const _0x353ddb = new Error("Electron media task API unavailable");
    logMediaTaskFailure("media_task.wait_failed", diagnosticPayload, {
      'taskId': _0x6299c0,
      'status': !_0x5db649 ? "bridge_unavailable" : "missing_task_id",
      'error': _0x353ddb
    });
    return Promise['reject'](_0x353ddb);
  }
  return new Promise((_0x25174b, _0x3d14ce) => {
    let _0x370ada = ![];
    let _0xed6b1a = null;
    const _0x3182c7 = _0x5db649["onUpdate"](_0x6922b1 => {
      if (String(_0x6922b1?.['taskId'] || '') !== _0x6299c0) {
        return;
      }
      const _0x245651 = String(_0x6922b1?.['status'] || '');
      if (!TERMINAL_STATUSES["has"](_0x245651)) {
        return;
      }
      if (_0x370ada) {
        return;
      }
      _0x370ada = !![];
      _0x3182c7?.();
      if (_0xed6b1a) {
        clearTimeout(_0xed6b1a);
      }
      if (_0x245651 === 'complete') {
        _0x25174b(_0x6922b1?.["result"] || {});
      } else {
        if (_0x245651 === "cancelled") {
          const _0x5113f4 = new Error("Media task cancelled");
          logMediaTaskFailure("media_task.wait_failed", diagnosticPayload, {
            ..._0x6922b1,
            'taskId': _0x6299c0,
            'status': _0x245651,
            'error': _0x5113f4
          });
          _0x3d14ce(_0x5113f4);
        } else {
          const _0x17939b = new Error(_0x6922b1?.["error"] || 'Media\x20task\x20failed');
          logMediaTaskFailure('media_task.wait_failed', diagnosticPayload, {
            ..._0x6922b1,
            'taskId': _0x6299c0,
            'status': _0x245651,
            'error': _0x17939b
          });
          _0x3d14ce(_0x17939b);
        }
      }
    });
    timeout > 0x0 && (_0xed6b1a = setTimeout(() => {
      if (_0x370ada) {
        return;
      }
      _0x370ada = !![];
      _0x3182c7?.();
      const _0x53c8c2 = new Error("Media task timeout");
      logMediaTaskFailure("media_task.wait_failed", diagnosticPayload, {
        'taskId': _0x6299c0,
        'status': "timeout",
        'error': _0x53c8c2
      });
      _0x3d14ce(_0x53c8c2);
    }, timeout));
  });
}
export async function enqueueElectronMediaTask(_0x3b4ccb = {}, _0x341521 = {}) {
  const _0x9ec019 = getMediaTaskBridge();
  if (!_0x9ec019) {
    return null;
  }
  const _0x27fba6 = validateMediaTaskSources(_0x3b4ccb);
  if (_0x27fba6) {
    const _0x42184f = new Error(_0x27fba6["reason"] === "missing" ? 'Missing\x20media\x20source\x20path' : "Invalid media source path");
    logMediaTaskFailure('media_task.enqueue_invalid_source', _0x3b4ccb, {
      'status': "invalid_source",
      'error': _0x42184f,
      'invalidSourceIndex': _0x27fba6["index"],
      'sourceValue': _0x27fba6["value"]
    });
    throw _0x42184f;
  }
  let _0x54dd34;
  try {
    _0x54dd34 = await _0x9ec019['enqueue'](_0x3b4ccb);
  } catch (_0x2beef3) {
    logMediaTaskFailure('media_task.enqueue_failed', _0x3b4ccb, {
      'status': 'enqueue_failed',
      'error': _0x2beef3
    });
    throw _0x2beef3;
  }
  if (_0x341521["wait"] === !![]) {
    const _0xe07f85 = _0x54dd34?.["taskId"] || _0x3b4ccb?.["taskId"] || '';
    return await waitForElectronMediaTask(_0xe07f85, {
      ..._0x341521,
      'diagnosticPayload': {
        ..._0x3b4ccb,
        'taskId': _0xe07f85
      }
    });
  }
  return _0x54dd34;
}
export async function cancelElectronMediaTask(_0x29da22) {
  const _0x20d00b = getMediaTaskBridge();
  if (!_0x20d00b) {
    return {
      'ok': ![],
      'error': "Electron media task API unavailable"
    };
  }
  return await _0x20d00b["cancel"]({
    'taskId': _0x29da22
  });
}
export async function listElectronMediaTasks(_0x4da2c2 = {}) {
  const _0x2a87e0 = getMediaTaskBridge();
  if (!_0x2a87e0) {
    return {
      'tasks': []
    };
  }
  return await _0x2a87e0['list'](_0x4da2c2);
}
function buildBackendBodyFromElectronPayload(_0x22c9b1 = {}) {
  const _0x4e523c = String(_0x22c9b1?.["kind"] || '')["trim"]();
  const _0x2d8780 = _0x22c9b1?.["args"] || {};
  if (_0x4e523c === "audioCut") {
    return {
      'src': _0x22c9b1['src'],
      'start': _0x2d8780["start"] ?? _0x22c9b1["start"],
      'end': _0x2d8780["end"] ?? _0x22c9b1["end"]
    };
  }
  return {
    'src': _0x22c9b1["src"],
    'start': _0x2d8780["videoStart"] ?? _0x2d8780["start"] ?? _0x22c9b1['videoStart'] ?? _0x22c9b1['start'],
    'end': _0x2d8780["videoEnd"] ?? _0x2d8780["end"] ?? _0x22c9b1["videoEnd"] ?? _0x22c9b1["end"],
    'audioSrc': _0x2d8780["audioSrc"] ?? _0x22c9b1["audioSrc"],
    'audioStart': _0x2d8780["audioStart"] ?? _0x22c9b1["audioStart"],
    'audioEnd': _0x2d8780["audioEnd"] ?? _0x22c9b1["audioEnd"],
    'fps': _0x2d8780["fps"] ?? _0x22c9b1["fps"]
  };
}
export async function runLocalMediaClipExport(_0x280fb8 = {}, _0x5ef79e = {}) {
  const _0x3444d8 = _0x280fb8?.["electronPayload"] || _0x280fb8;
  const _0x25568e = _0x280fb8?.['outputType'] === "audio" || _0x3444d8?.["kind"] === "audioCut" ? 'audio' : "video";
  const _0x3bdb22 = Number(_0x5ef79e["timeout"] || 0x0) || 0x927c0;
  if (canUseElectronMediaTask()) {
    return await enqueueElectronMediaTask(_0x3444d8, {
      'wait': !![],
      'timeout': _0x3bdb22
    });
  }
  const _0x52d098 = _0x280fb8?.['backendBody'] || buildBackendBodyFromElectronPayload(_0x3444d8);
  const _0x2d3bc9 = await requester({
    'url': _0x25568e === "audio" ? "/api/v2/audio/cut" : "/api/v2/video/clip_export",
    'method': "POST",
    'provider': "local",
    'headers': {
      'Content-Type': "application/json"
    },
    'body': JSON["stringify"](_0x52d098),
    'timeout': _0x3bdb22,
    'allow404Null': !![],
    'returnMeta': !![]
  });
  if (!_0x2d3bc9?.["data"]) {
    throw new Error('Local\x20media\x20clip\x20export\x20API\x20unavailable');
  }
  return _0x2d3bc9['data'];
}