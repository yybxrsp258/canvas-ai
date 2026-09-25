import { fetchRemoteBlob } from '../../api/projectsV2Api.js';
let _ctx = null;
const _cache = new Map();
const _bufferCache = new Map();
const _bufferInflight = new Map();
const _decodeQueue = [];
let _activeDecodes = 0x0;
const MAX_CONCURRENT_AUDIO_DECODES = 0x2;
const MAX_WAVEFORM_PATHS = 0x100;
function _cachePath(_0x344f86, _0x5bd645, _0x604d2b = 0x0) {
  if (!_0x5bd645) {
    return;
  }
  _cache["delete"](_0x344f86);
  _cache['set'](_0x344f86, {
    'path': _0x5bd645,
    'duration': Number["isFinite"](_0x604d2b) && _0x604d2b > 0x0 ? _0x604d2b : 0x0
  });
  while (_cache["size"] > MAX_WAVEFORM_PATHS) {
    _cache["delete"](_cache["keys"]()["next"]()['value']);
  }
}
function _readWaveformResult(_0x19e66d, _0x542670) {
  const _0x25ada0 = Number(_0x19e66d?.["duration"]);
  if (Number['isFinite'](_0x25ada0) && _0x25ada0 > 0x0) {
    _0x542670?.(_0x25ada0);
  }
  return _0x19e66d?.['path'] || '';
}
function _queueAudioDecode(_0xd3d906, _0x3bce7e) {
  return new Promise(_0x5c1029 => {
    const _0x1a520e = () => {
      const _0x322b42 = _decodeQueue["indexOf"](_0x4f84f2);
      _0x322b42 >= 0x0 && (_decodeQueue['splice'](_0x322b42, 0x1), _0x5c1029(null));
    };
    const _0x4f84f2 = async () => {
      _0x3bce7e?.["removeEventListener"]("abort", _0x1a520e);
      _activeDecodes += 0x1;
      try {
        _0x5c1029(_0x3bce7e?.['aborted'] ? null : await _0xd3d906());
      } catch {
        _0x5c1029(null);
      } finally {
        _activeDecodes -= 0x1;
        while (_activeDecodes < MAX_CONCURRENT_AUDIO_DECODES && _decodeQueue['length']) {
          void _decodeQueue['shift']()();
        }
      }
    };
    if (_0x3bce7e?.["aborted"]) {
      return _0x5c1029(null);
    }
    if (_activeDecodes < MAX_CONCURRENT_AUDIO_DECODES) {
      void _0x4f84f2();
    } else {
      _decodeQueue["push"](_0x4f84f2);
      _0x3bce7e?.["addEventListener"]("abort", _0x1a520e, {
        'once': !![]
      });
    }
  });
}
function _queueDeferredTask(_0x41bdd4) {
  if (typeof _0x41bdd4 !== "function") {
    return () => {};
  }
  let _0x15958e = ![];
  if (typeof queueMicrotask === "function") {
    queueMicrotask(() => {
      if (!_0x15958e) {
        _0x41bdd4();
      }
    });
    return () => {
      _0x15958e = !![];
    };
  }
  const _0x6acd50 = setTimeout(() => {
    if (!_0x15958e) {
      _0x41bdd4();
    }
  }, 0x0);
  return () => {
    _0x15958e = !![];
    clearTimeout(_0x6acd50);
  };
}
export function deferWaveformPathUntilAudioReady(_0x1b1ab2, _0x59c50a) {
  if (typeof _0x59c50a !== "function") {
    return () => {};
  }
  if (!_0x1b1ab2 || typeof _0x1b1ab2["addEventListener"] !== "function") {
    return _queueDeferredTask(_0x59c50a);
  }
  let _0x4a8a48 = null;
  let _0x57a291 = ![];
  const _0x4712eb = () => {
    _0x1b1ab2["removeEventListener"]("loadeddata", _0x19a286);
    _0x1b1ab2["removeEventListener"]('error', _0x19aa70);
  };
  const _0x19a286 = () => {
    _0x4712eb();
    if (_0x57a291) {
      return;
    }
    _0x4a8a48 = _queueDeferredTask(() => {
      _0x4a8a48 = null;
      if (!_0x57a291) {
        _0x59c50a();
      }
    });
  };
  const _0x19aa70 = () => {
    _0x4712eb();
  };
  Number(_0x1b1ab2["readyState"] || 0x0) >= 0x2 ? _0x4a8a48 = _queueDeferredTask(() => {
    _0x4a8a48 = null;
    if (!_0x57a291) {
      _0x59c50a();
    }
  }) : (_0x1b1ab2["addEventListener"]("loadeddata", _0x19a286, {
    'once': !![]
  }), _0x1b1ab2["addEventListener"]("error", _0x19aa70, {
    'once': !![]
  }));
  return () => {
    _0x57a291 = !![];
    _0x4712eb();
    typeof _0x4a8a48 === 'function' && (_0x4a8a48(), _0x4a8a48 = null);
  };
}
function _getAudioContext() {
  if (_ctx) {
    return _ctx;
  }
  const _0x1c51e9 = globalThis['window']?.['AudioContext'] || globalThis['window']?.['webkitAudioContext'];
  if (!_0x1c51e9) {
    return null;
  }
  try {
    _ctx = new _0x1c51e9();
  } catch {
    return null;
  }
  return _ctx;
}
function _decodeAudioData(_0x27fd63, _0x12b134) {
  return new Promise((_0x89d35c, _0x3aae04) => {
    const _0x17a218 = _0x27fd63["decodeAudioData"](_0x12b134, _0x89d35c, _0x3aae04);
    if (_0x17a218 && typeof _0x17a218["then"] === 'function') {
      _0x17a218["then"](_0x89d35c)['catch'](_0x3aae04);
    }
  });
}
function _buildMinMaxBarsPath(_0x3f4565, {
  width: _0x5d8d21,
  height: _0x58d8bb,
  samples: _0x1f763c
}) {
  const _0x943543 = Number(_0x5d8d21) || 0xc8;
  const _0x41538a = Number(_0x58d8bb) || 0x50;
  const _0x2f583f = Math['max'](0x28, Math["min"](0x190, Math['round'](Number(_0x1f763c) || 0xb4)));
  const _0x235719 = _0x41538a / 0x2;
  const _0x429de1 = Math["max"](0x1, Math['round'](_0x41538a * 0.08));
  const _0x15f9cc = Math['max'](0x1, _0x235719 - _0x429de1);
  const _0x284719 = Math["max"](0x1, Number(_0x3f4565?.["numberOfChannels"]) || 0x1);
  const _0x1ac576 = Number(_0x3f4565?.["length"]) || 0x0;
  if (!_0x1ac576) {
    return '';
  }
  const _0x40dbb9 = [];
  for (let _0x3a7ddb = 0x0; _0x3a7ddb < _0x284719; _0x3a7ddb++) {
    try {
      _0x40dbb9["push"](_0x3f4565["getChannelData"](_0x3a7ddb));
    } catch (_0x2614be) {}
  }
  if (!_0x40dbb9["length"]) {
    return '';
  }
  const _0x33eb5f = Math['max'](0x1, Math["floor"](_0x1ac576 / _0x2f583f));
  let _0x317fcd = '';
  for (let _0x13edcd = 0x0; _0x13edcd < _0x2f583f; _0x13edcd++) {
    const _0x44d245 = _0x13edcd * _0x33eb5f;
    const _0x49df33 = Math["min"](_0x1ac576, _0x44d245 + _0x33eb5f);
    let _0x3c4d01 = 0x1;
    let _0x42d34f = -0x1;
    for (let _0x448865 = 0x0; _0x448865 < _0x40dbb9["length"]; _0x448865++) {
      const _0x8b02ac = _0x40dbb9[_0x448865];
      for (let _0x2e30c4 = _0x44d245; _0x2e30c4 < _0x49df33; _0x2e30c4++) {
        const _0x4cf625 = _0x8b02ac[_0x2e30c4] || 0x0;
        if (_0x4cf625 < _0x3c4d01) {
          _0x3c4d01 = _0x4cf625;
        }
        if (_0x4cf625 > _0x42d34f) {
          _0x42d34f = _0x4cf625;
        }
      }
    }
    const _0x2fcac4 = Math["min"](0x1, Math["max"](Math['abs'](_0x3c4d01), Math["abs"](_0x42d34f)));
    const _0x35da4b = _0x235719 - _0x2fcac4 * _0x15f9cc;
    const _0x5bec06 = _0x235719 + _0x2fcac4 * _0x15f9cc;
    const _0x5b6df7 = (_0x13edcd + 0.5) / _0x2f583f * _0x943543;
    _0x317fcd += 'M' + _0x5b6df7["toFixed"](0x2) + ',' + _0x35da4b["toFixed"](0x2) + '\x20L' + _0x5b6df7["toFixed"](0x2) + ',' + _0x5bec06["toFixed"](0x2) + '\x20';
  }
  return _0x317fcd["trim"]();
}
function _buildBarsPathFromPeaks(_0x39e31b, {
  width: _0x3d5825,
  height: _0x4c1cfa,
  samples: _0x3c92f2
}) {
  const _0x1d1ac1 = Array["isArray"](_0x39e31b) ? _0x39e31b : [];
  if (!_0x1d1ac1["length"]) {
    return '';
  }
  const _0x1fafad = Number(_0x3d5825) || 0xc8;
  const _0x26fb30 = Number(_0x4c1cfa) || 0x50;
  const _0x41de9a = Math["max"](0x1, Math["min"](_0x1d1ac1["length"], Math["round"](Number(_0x3c92f2) || _0x1d1ac1["length"])));
  const _0x3feab = _0x26fb30 / 0x2;
  const _0x5a3dce = Math["max"](0x1, Math["round"](_0x26fb30 * 0.08));
  const _0x41b0a4 = Math["max"](0x1, _0x3feab - _0x5a3dce);
  let _0x41950d = '';
  for (let _0x377438 = 0x0; _0x377438 < _0x41de9a; _0x377438++) {
    const _0x64ac6e = Math["min"](_0x1d1ac1['length'] - 0x1, Math["floor"](_0x377438 / _0x41de9a * _0x1d1ac1["length"]));
    const _0x3216ca = Math["min"](0x1, Math['max'](0x0, Number(_0x1d1ac1[_0x64ac6e]) || 0x0));
    const _0x10717d = _0x3feab - _0x3216ca * _0x41b0a4;
    const _0xaf404f = _0x3feab + _0x3216ca * _0x41b0a4;
    const _0xc22aff = (_0x377438 + 0.5) / _0x41de9a * _0x1fafad;
    _0x41950d += 'M' + _0xc22aff["toFixed"](0x2) + ',' + _0x10717d['toFixed'](0x2) + '\x20L' + _0xc22aff['toFixed'](0x2) + ',' + _0xaf404f["toFixed"](0x2) + '\x20';
  }
  return _0x41950d["trim"]();
}
export async function getWaveformBarsPathFromPersistedUrl(_0x4129fb, {
  width = 0xc8,
  height = 0x50,
  samples = 0xb4,
  signal: _0x129b9c
} = {}) {
  const _0x1b8795 = String(_0x4129fb || '')["trim"]();
  if (!_0x1b8795) {
    return '';
  }
  const _0x27adc8 = "persisted:" + _0x1b8795 + '|' + width + '|' + height + '|' + samples;
  const _0x1f7cf7 = _cache["get"](_0x27adc8);
  if (_0x1f7cf7) {
    return _0x1f7cf7["path"];
  }
  try {
    const _0xf7ab97 = await fetchRemoteBlob(_0x1b8795, {
      'signal': _0x129b9c
    });
    const _0x10464d = JSON["parse"](await _0xf7ab97["text"]());
    const _0x9752a1 = _buildBarsPathFromPeaks(_0x10464d?.['peaks'], {
      'width': width,
      'height': height,
      'samples': samples
    });
    _cachePath(_0x27adc8, _0x9752a1);
    return _0x9752a1;
  } catch {
    return '';
  }
}
function _createDecodedAudioBufferJob(_0x5e28fd, _0xebc4b2) {
  const _0x47bfc4 = typeof AbortController === "function" ? new AbortController() : null;
  const _0x4e349c = {
    'consumers': 0x0,
    'controller': _0x47bfc4,
    'settled': ![],
    'promise': null
  };
  _0x4e349c["promise"] = _queueAudioDecode(async () => {
    let _0x37d8de;
    try {
      const _0x3600e8 = await fetchRemoteBlob(_0x5e28fd, {
        'signal': _0x47bfc4?.["signal"]
      });
      _0x37d8de = await _0x3600e8['arrayBuffer']();
    } catch {
      return null;
    }
    if (!_0x37d8de || _0x47bfc4?.['signal']?.["aborted"]) {
      return null;
    }
    try {
      const _0x13a3c7 = await _decodeAudioData(_0xebc4b2, _0x37d8de);
      return _0x47bfc4?.["signal"]?.["aborted"] ? null : _0x13a3c7 || null;
    } catch {
      return null;
    }
  }, _0x47bfc4?.["signal"])['finally'](() => {
    _0x4e349c['settled'] = !![];
    if (_bufferInflight['get'](_0x5e28fd) === _0x4e349c) {
      _bufferInflight['delete'](_0x5e28fd);
    }
  });
  _bufferInflight["set"](_0x5e28fd, _0x4e349c);
  return _0x4e349c;
}
async function _waitForDecodedAudioBufferJob(_0x204d39, _0x2ea34e) {
  if (!_0x204d39 || _0x2ea34e?.["aborted"]) {
    return null;
  }
  _0x204d39["consumers"] += 0x1;
  let _0x208543 = ![];
  let _0x357c4d = null;
  const _0x4463ff = _0x2ea34e ? new Promise(_0x1877d4 => {
    _0x357c4d = () => {
      _0x208543 = !![];
      _0x1877d4(null);
    };
    _0x2ea34e["addEventListener"]('abort', _0x357c4d, {
      'once': !![]
    });
  }) : null;
  try {
    return await (_0x4463ff ? Promise['race']([_0x204d39["promise"], _0x4463ff]) : _0x204d39["promise"]);
  } finally {
    if (_0x2ea34e && _0x357c4d) {
      _0x2ea34e["removeEventListener"]("abort", _0x357c4d);
    }
    _0x204d39["consumers"] = Math["max"](0x0, _0x204d39["consumers"] - 0x1);
    _0x208543 && !_0x204d39['settled'] && _0x204d39['consumers'] === 0x0 && _0x204d39["controller"]?.["abort"]();
  }
}
async function _getDecodedAudioBufferFromUrl(_0x2d93f0, {
  signal: _0x15b1e6,
  cacheBuffer = !![]
} = {}) {
  const _0x495aaa = String(_0x2d93f0 || '')["trim"]();
  if (!_0x495aaa || _0x15b1e6?.["aborted"]) {
    return null;
  }
  const _0x35e147 = _getAudioContext();
  if (!_0x35e147) {
    return null;
  }
  let _0x20cbcd = _bufferCache["get"](_0x495aaa);
  if (!_0x20cbcd) {
    const _0x15f20c = _bufferInflight['get'](_0x495aaa);
    const _0x124db8 = !_0x15f20c || _0x15f20c["settled"] || _0x15f20c['controller']?.["signal"]?.["aborted"] ? _createDecodedAudioBufferJob(_0x495aaa, _0x35e147) : _0x15f20c;
    _0x20cbcd = await _waitForDecodedAudioBufferJob(_0x124db8, _0x15b1e6);
    if (_0x20cbcd && cacheBuffer) {
      _bufferCache["set"](_0x495aaa, _0x20cbcd);
    }
  }
  return _0x20cbcd || null;
}
export async function getAudioDurationFromUrl(_0x32fee9, _0xd056f8 = {}) {
  const _0x5d192e = await _getDecodedAudioBufferFromUrl(_0x32fee9, _0xd056f8);
  const _0x5703c7 = Number(_0x5d192e?.["duration"] || 0x0);
  return Number['isFinite'](_0x5703c7) && _0x5703c7 > 0x0 ? _0x5703c7 : 0x0;
}
export async function getWaveformBarsPathFromUrl(_0x41c7d8, {
  width = 0xc8,
  height = 0x50,
  samples = 0xb4,
  signal: _0x1ba15f,
  cacheBuffer = !![],
  onDuration: _0x24e76a
} = {}) {
  const _0x48c1e0 = String(_0x41c7d8 || '')['trim']();
  if (!_0x48c1e0) {
    return '';
  }
  const _0x46e8cd = _0x48c1e0 + '|' + width + '|' + height + '|' + samples;
  const _0x43e6c7 = _cache["get"](_0x46e8cd);
  if (_0x43e6c7) {
    return _readWaveformResult(_0x43e6c7, _0x24e76a);
  }
  const _0xfb2ab6 = await _getDecodedAudioBufferFromUrl(_0x48c1e0, {
    'signal': _0x1ba15f,
    'cacheBuffer': cacheBuffer
  });
  if (!_0xfb2ab6 || _0x1ba15f?.['aborted']) {
    return '';
  }
  const _0x38450b = _buildMinMaxBarsPath(_0xfb2ab6, {
    'width': width,
    'height': height,
    'samples': samples
  });
  _cachePath(_0x46e8cd, _0x38450b, _0xfb2ab6["duration"]);
  return _readWaveformResult({
    'path': _0x38450b,
    'duration': _0xfb2ab6['duration']
  }, _0x24e76a);
}
export async function getAudioNodeWaveformPath(_0x70e66f, _0x599619, _0x9fc9d = {}) {
  if (_0x9fc9d["signal"]?.["aborted"]) {
    return '';
  }
  const _0x3db722 = JSON["stringify"](['audio-node', _0x70e66f, _0x599619, _0x9fc9d["width"], _0x9fc9d["height"], _0x9fc9d["samples"]]);
  const _0x19a0e0 = _cache["get"](_0x3db722);
  if (_0x19a0e0 && (_0x19a0e0['duration'] > 0x0 || !_0x9fc9d["onDuration"])) {
    return _readWaveformResult(_0x19a0e0, _0x9fc9d["onDuration"]);
  }
  const _0x486963 = _0x599619 ? await getWaveformBarsPathFromPersistedUrl(_0x599619, _0x9fc9d) : '';
  if (_0x9fc9d["signal"]?.['aborted']) {
    return '';
  }
  let _0x9be4bb = 0x0;
  if (_0x486963) {
    _0x9fc9d['onDuration'] && (_0x9be4bb = await getAudioDurationFromUrl(_0x70e66f, {
      'signal': _0x9fc9d['signal'],
      'cacheBuffer': ![]
    }));
    if (_0x9fc9d["signal"]?.["aborted"]) {
      return '';
    }
    _cachePath(_0x3db722, _0x486963, _0x9be4bb);
    return _readWaveformResult({
      'path': _0x486963,
      'duration': _0x9be4bb
    }, _0x9fc9d["onDuration"]);
  }
  const _0x3a1074 = await getWaveformBarsPathFromUrl(_0x70e66f, {
    ..._0x9fc9d,
    'cacheBuffer': ![],
    'onDuration': _0x4d839d => {
      _0x9be4bb = _0x4d839d;
    }
  });
  if (_0x9fc9d['signal']?.["aborted"]) {
    return '';
  }
  _cachePath(_0x3db722, _0x3a1074, _0x9be4bb);
  return _readWaveformResult({
    'path': _0x3a1074,
    'duration': _0x9be4bb
  }, _0x9fc9d["onDuration"]);
}