const MAX_EVENT_QUEUE_SIZE = 0xa0;
const MIN_VIEWPORT_WIDTH = 0x140;
const MIN_VIEWPORT_HEIGHT = 0xb4;
const MAX_VIEWPORT_WIDTH = 0x780;
const MAX_VIEWPORT_HEIGHT = 0x4b0;
const SNAPSHOT_QUALITY = 0x48;
const SCREENCAST_QUALITY = 0x3a;
const SCREENCAST_MAX_WIDTH = 0x500;
const SCREENCAST_MAX_HEIGHT = 0x320;
const SCREENCAST_MIN_FRAME_INTERVAL_MS = 0x18;
const EVENT_WAIT_MIN_MS = 0x32;
const EVENT_WAIT_MAX_MS = 0x1388;
function clampNumber(_0x1fcfa7, _0x5e840a, _0x249c7e, _0x1c99b6) {
  const _0x539880 = Number(_0x1fcfa7);
  if (!Number["isFinite"](_0x539880)) {
    return _0x1c99b6;
  }
  return Math["max"](_0x5e840a, Math["min"](_0x249c7e, Math["round"](_0x539880)));
}
function normalizeNodeId(_0x1913a2) {
  return String(_0x1913a2 || '')["trim"]();
}
function normalizeTabId(_0x30905c) {
  return String(_0x30905c || '')['trim']() || 'default';
}
function normalizeHttpUrl(_0x342298) {
  try {
    const _0x494da6 = new URL(String(_0x342298 || '')["trim"]());
    if (_0x494da6["protocol"] !== 'http:' && _0x494da6["protocol"] !== 'https:') {
      return '';
    }
    return _0x494da6['href'];
  } catch {
    return '';
  }
}
function toEntryKey(_0x48d769, _0x429027) {
  return normalizeNodeId(_0x48d769) + '\x00' + normalizeTabId(_0x429027);
}
function normalizeViewport(_0x3a8f5e = {}) {
  const _0x13b187 = Math["max"](0.05, Number(_0x3a8f5e?.['zoomFactor']) || 0x1);
  const _0x56e1bd = _0x3a8f5e?.["bounds"] && typeof _0x3a8f5e["bounds"] === 'object' ? _0x3a8f5e["bounds"] : {};
  const _0x376118 = clampNumber(_0x56e1bd["width"], 0x1, MAX_VIEWPORT_WIDTH, 0x3c0);
  const _0x2b1ad7 = clampNumber(_0x56e1bd["height"], 0x1, MAX_VIEWPORT_HEIGHT, 0x258);
  return {
    'width': clampNumber(_0x376118 / _0x13b187, MIN_VIEWPORT_WIDTH, MAX_VIEWPORT_WIDTH, 0x3c0),
    'height': clampNumber(_0x2b1ad7 / _0x13b187, MIN_VIEWPORT_HEIGHT, MAX_VIEWPORT_HEIGHT, 0x258),
    'visualWidth': _0x376118,
    'visualHeight': _0x2b1ad7,
    'zoomFactor': _0x13b187
  };
}
function createReferenceSnapshotExpression() {
  return "(() => ({\n    pageUrl: String(location.href || \"\"),\n    pageTitle: String(document.title || \"\"),\n    selectedText: String(globalThis.getSelection?.()?.toString?.() || \"\").slice(0, 5000),\n  }))()";
}
function normalizeInputModifiers(_0x5e53c5 = {}) {
  return (_0x5e53c5['altKey'] ? 0x1 : 0x0) | (_0x5e53c5["ctrlKey"] ? 0x2 : 0x0) | (_0x5e53c5["metaKey"] ? 0x4 : 0x0) | (_0x5e53c5["shiftKey"] ? 0x8 : 0x0);
}
function normalizeMouseButton(_0x4690cd) {
  if (_0x4690cd === 0x0 || _0x4690cd === 'left') {
    return 'left';
  }
  if (_0x4690cd === 0x1 || _0x4690cd === "middle") {
    return 'middle';
  }
  if (_0x4690cd === 0x2 || _0x4690cd === "right") {
    return 'right';
  }
  if (_0x4690cd === 0x3 || _0x4690cd === "back") {
    return "back";
  }
  if (_0x4690cd === 0x4 || _0x4690cd === "forward") {
    return "forward";
  }
  return "none";
}
export function createChromeShellWebPreviewManager({
  client: _0x4aadaf,
  logEvent = null,
  now = () => Date["now"](),
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout
} = {}) {
  if (!_0x4aadaf || typeof _0x4aadaf["send"] !== 'function') {
    throw new TypeError("Chrome CDP client is required");
  }
  const _0x22d959 = new Map();
  const _0x434ab7 = new Map();
  const _0x4d8583 = [];
  const _0x268183 = new Set();
  let _0x5bba14 = 0x0;
  let _0x580755 = ![];
  function _0x361633() {
    return _0x4d8583["splice"](0x0, _0x4d8583['length']);
  }
  function _0x145416() {
    if (_0x4d8583["length"] === 0x0 || _0x268183["size"] === 0x0) {
      return;
    }
    const _0x1ba4ed = _0x268183["values"]()["next"]()["value"];
    _0x268183["delete"](_0x1ba4ed);
    if (_0x1ba4ed["timer"]) {
      clearTimeoutFn(_0x1ba4ed["timer"]);
    }
    _0x1ba4ed["resolve"](_0x361633());
  }
  function _0x3f3aea(_0x4fccbe, _0x198fdf = {}, _0x70ad4a = '') {
    const _0x1dd7af = normalizeNodeId(_0x4fccbe);
    const _0xffc4f5 = normalizeTabId(_0x70ad4a);
    if (_0x198fdf?.["type"] === "snapshot") {
      for (let _0x7ad030 = _0x4d8583['length'] - 0x1; _0x7ad030 >= 0x0; _0x7ad030 -= 0x1) {
        const _0x53fdcf = _0x4d8583[_0x7ad030];
        _0x53fdcf?.["type"] === 'snapshot' && _0x53fdcf['nodeId'] === _0x1dd7af && _0x53fdcf['tabId'] === _0xffc4f5 && _0x4d8583['splice'](_0x7ad030, 0x1);
      }
    }
    _0x4d8583['push']({
      'nodeId': _0x1dd7af,
      'tabId': _0xffc4f5,
      ..._0x198fdf,
      'sequence': ++_0x5bba14,
      'createdAt': now()
    });
    while (_0x4d8583["length"] > MAX_EVENT_QUEUE_SIZE) {
      _0x4d8583["shift"]();
    }
    _0x145416();
  }
  function _0x3e1e5c(_0x8d3de9, _0x3eb69b, _0xb0f8ef, _0x165919 = null) {
    logEvent?.({
      'type': _0x8d3de9,
      'level': "warn",
      'source': "main",
      'message': _0x3eb69b,
      'error': _0xb0f8ef,
      'context': _0x165919 ? {
        'nodeId': _0x165919["nodeId"],
        'tabId': _0x165919["tabId"],
        'url': _0x165919["url"] || _0x165919["requestedUrl"] || ''
      } : {}
    });
  }
  async function _0x3a3afa() {
    return _0x4aadaf["send"]('Target.createTarget', {
      'url': 'about:blank',
      'background': !![],
      'focus': ![]
    });
  }
  async function _0x2c6e08(_0x270e60, _0x1f0fad) {
    if (!_0x270e60?.["sessionId"]) {
      return ![];
    }
    const _0x1a2eb1 = _0x270e60["viewportWidth"] !== _0x1f0fad['width'] || _0x270e60["viewportHeight"] !== _0x1f0fad["height"];
    _0x270e60['visualWidth'] = _0x1f0fad["visualWidth"];
    _0x270e60["visualHeight"] = _0x1f0fad["visualHeight"];
    _0x270e60["zoomFactor"] = _0x1f0fad["zoomFactor"];
    if (!_0x1a2eb1) {
      return ![];
    }
    _0x270e60['viewportWidth'] = _0x1f0fad["width"];
    _0x270e60['viewportHeight'] = _0x1f0fad['height'];
    await _0x4aadaf["send"]("Emulation.setDeviceMetricsOverride", {
      'width': _0x1f0fad["width"],
      'height': _0x1f0fad["height"],
      'deviceScaleFactor': 0x1,
      'mobile': ![]
    }, _0x270e60["sessionId"]);
    return !![];
  }
  async function _0x1688df(_0x392d88) {
    if (!_0x392d88?.["sessionId"]) {
      return {
        'canGoBack': ![],
        'canGoForward': ![]
      };
    }
    try {
      const _0x448084 = await _0x4aadaf["send"]("Page.getNavigationHistory", {}, _0x392d88["sessionId"]);
      const _0x1d0367 = Array["isArray"](_0x448084?.['entries']) ? _0x448084["entries"] : [];
      const _0x1e5250 = Math["max"](0x0, Number(_0x448084?.["currentIndex"]) || 0x0);
      return {
        'canGoBack': _0x1e5250 > 0x0,
        'canGoForward': _0x1e5250 < _0x1d0367["length"] - 0x1
      };
    } catch {
      return {
        'canGoBack': ![],
        'canGoForward': ![]
      };
    }
  }
  async function _0x218241(_0x1907be) {
    const _0x31946a = await _0x1688df(_0x1907be);
    if (_0x1907be['disposing'] || _0x22d959['get'](_0x1907be["key"]) !== _0x1907be) {
      return _0x31946a;
    }
    _0x3f3aea(_0x1907be["nodeId"], {
      'type': "navigation-state",
      ..._0x31946a
    }, _0x1907be["tabId"]);
    return _0x31946a;
  }
  async function _0x5ccdf7(_0x136871) {
    if (_0x580755 || _0x136871?.['disposing'] || !_0x136871?.["sessionId"] || _0x136871['active'] !== !![] || _0x136871["screencastActive"] || _0x136871["capturePending"]) {
      if (_0x136871?.['capturePending']) {
        _0x136871['captureQueued'] = !![];
      }
      return ![];
    }
    _0x136871['capturePending'] = !![];
    try {
      let _0x136f21;
      let _0x2c3698 = "image/webp";
      try {
        _0x136f21 = await _0x4aadaf['send']("Page.captureScreenshot", {
          'format': "webp",
          'quality': SNAPSHOT_QUALITY,
          'fromSurface': !![],
          'optimizeForSpeed': !![]
        }, _0x136871["sessionId"]);
      } catch {
        _0x2c3698 = "image/jpeg";
        _0x136f21 = await _0x4aadaf['send']("Page.captureScreenshot", {
          'format': "jpeg",
          'quality': SNAPSHOT_QUALITY,
          'fromSurface': !![],
          'optimizeForSpeed': !![]
        }, _0x136871["sessionId"]);
      }
      const _0x12fce8 = String(_0x136f21?.["data"] || '')["trim"]();
      if (!_0x12fce8 || _0x136871["disposing"] || _0x136871["screencastActive"] || _0x22d959["get"](_0x136871["key"]) !== _0x136871) {
        return ![];
      }
      _0x3f3aea(_0x136871["nodeId"], {
        'type': "snapshot",
        'surfaceMode': "remote-snapshot",
        'dataUrl': "data:" + _0x2c3698 + ";base64," + _0x12fce8,
        'freezeToken': "ready",
        'width': _0x136871["visualWidth"] || _0x136871["viewportWidth"] || 0x0,
        'height': _0x136871["visualHeight"] || _0x136871['viewportHeight'] || 0x0,
        'zoomFactor': _0x136871["zoomFactor"] || 0x1
      }, _0x136871["tabId"]);
      return !![];
    } catch (_0x574edc) {
      _0x3e1e5c('chrome_web_preview.snapshot_failed', 'Chrome\x20browser\x20node\x20snapshot\x20failed', _0x574edc, _0x136871);
      return ![];
    } finally {
      _0x136871['capturePending'] = ![];
      _0x136871["captureQueued"] && (_0x136871["captureQueued"] = ![], void _0x5ccdf7(_0x136871));
    }
  }
  function _0x3d1224(_0x14a296, _0x2a3b9b = 0x5a) {
    if (!_0x14a296 || _0x14a296["disposing"]) {
      return;
    }
    if (_0x14a296["screencastActive"]) {
      return;
    }
    if (_0x14a296["inputCaptureTimer"]) {
      clearTimeoutFn(_0x14a296["inputCaptureTimer"]);
    }
    _0x14a296["inputCaptureTimer"] = setTimeoutFn(() => {
      _0x14a296["inputCaptureTimer"] = null;
      void _0x5ccdf7(_0x14a296);
    }, Math["max"](0x0, Number(_0x2a3b9b) || 0x0));
  }
  function _0x1e15df(_0x1bb825) {
    return Boolean(_0x1bb825 && !_0x1bb825["disposing"] && !_0x1bb825["screencastUnavailable"] && _0x1bb825['active'] === !![] && _0x1bb825['visible'] === !![] && _0x1bb825["selected"] === !![]);
  }
  function _0x320363(_0x71fbc0) {
    return {
      'format': 'jpeg',
      'quality': SCREENCAST_QUALITY,
      'maxWidth': Math['min'](SCREENCAST_MAX_WIDTH, Math["max"](0x1, _0x71fbc0['viewportWidth'] || 0x1)),
      'maxHeight': Math["min"](SCREENCAST_MAX_HEIGHT, Math["max"](0x1, _0x71fbc0["viewportHeight"] || 0x1)),
      'everyNthFrame': 0x1
    };
  }
  async function _0x4c5e34(_0x16dd7d, {
    restart = ![]
  } = {}) {
    if (!_0x16dd7d || _0x16dd7d['disposing'] || !_0x16dd7d['sessionId']) {
      return ![];
    }
    _0x16dd7d["screencastDesired"] = _0x1e15df(_0x16dd7d);
    if (restart && _0x16dd7d['screencastActive']) {
      _0x16dd7d["screencastRestartRequested"] = !![];
    }
    if (_0x16dd7d["screencastReconcilePromise"]) {
      return _0x16dd7d["screencastReconcilePromise"];
    }
    _0x16dd7d["screencastReconcilePromise"] = (async () => {
      while (!_0x16dd7d["disposing"]) {
        const _0xe5554 = _0x1e15df(_0x16dd7d);
        const _0x58ac75 = _0x16dd7d["screencastActive"] && (!_0xe5554 || _0x16dd7d["screencastRestartRequested"]);
        if (_0x58ac75) {
          _0x16dd7d['screencastRestartRequested'] = ![];
          if (_0x16dd7d["screencastFrameTimer"]) {
            clearTimeoutFn(_0x16dd7d["screencastFrameTimer"]);
          }
          _0x16dd7d["screencastFrameTimer"] = null;
          _0x16dd7d["pendingScreencastFrame"] = null;
          try {
            await _0x4aadaf["send"]("Page.stopScreencast", {}, _0x16dd7d["sessionId"]);
          } catch (_0x2be2d7) {
            _0x3e1e5c('chrome_web_preview.screencast_stop_failed', "Chrome browser node live stream stop failed", _0x2be2d7, _0x16dd7d);
          }
          _0x16dd7d["screencastActive"] = ![];
          continue;
        }
        if (_0xe5554 && !_0x16dd7d["screencastActive"]) {
          try {
            await _0x4aadaf["send"]("Target.activateTarget", {
              'targetId': _0x16dd7d["targetId"]
            });
            await _0x4aadaf["send"]("Page.startScreencast", _0x320363(_0x16dd7d), _0x16dd7d["sessionId"]);
            _0x16dd7d["screencastActive"] = !![];
            _0x16dd7d["lastScreencastEmitAt"] = 0x0;
          } catch (_0x59d277) {
            _0x16dd7d["screencastUnavailable"] = !![];
            _0x16dd7d["screencastDesired"] = ![];
            _0x3e1e5c("chrome_web_preview.screencast_start_failed", "Chrome browser node live stream start failed; using snapshots", _0x59d277, _0x16dd7d);
          }
          continue;
        }
        break;
      }
      return _0x16dd7d['screencastActive'];
    })()["finally"](() => {
      _0x16dd7d['screencastReconcilePromise'] = null;
    });
    return _0x16dd7d['screencastReconcilePromise'];
  }
  function _0x5afaca(_0x1eb0a1, _0x3df49b) {
    if (!_0x3df49b || !_0x1eb0a1?.['screencastActive'] || !_0x1eb0a1["active"] || !_0x1eb0a1["visible"] || _0x1eb0a1["disposing"]) {
      return ![];
    }
    _0x1eb0a1["lastScreencastEmitAt"] = now();
    _0x3f3aea(_0x1eb0a1["nodeId"], {
      'type': "snapshot",
      'surfaceMode': "remote-snapshot",
      'streaming': !![],
      'dataUrl': "data:image/jpeg;base64," + _0x3df49b,
      'freezeToken': "live",
      'width': _0x1eb0a1["visualWidth"] || _0x1eb0a1["viewportWidth"] || 0x0,
      'height': _0x1eb0a1["visualHeight"] || _0x1eb0a1["viewportHeight"] || 0x0,
      'zoomFactor': _0x1eb0a1["zoomFactor"] || 0x1
    }, _0x1eb0a1["tabId"]);
    return !![];
  }
  function _0x19acfa(_0x4b9e97, _0x2f6285) {
    const _0x1eab8c = now() - _0x4b9e97["lastScreencastEmitAt"];
    if (_0x4b9e97['lastScreencastEmitAt'] === 0x0 || _0x1eab8c >= SCREENCAST_MIN_FRAME_INTERVAL_MS) {
      if (_0x4b9e97["screencastFrameTimer"]) {
        clearTimeoutFn(_0x4b9e97['screencastFrameTimer']);
      }
      _0x4b9e97['screencastFrameTimer'] = null;
      _0x4b9e97["pendingScreencastFrame"] = null;
      return _0x5afaca(_0x4b9e97, _0x2f6285);
    }
    _0x4b9e97["pendingScreencastFrame"] = _0x2f6285;
    if (_0x4b9e97["screencastFrameTimer"]) {
      return ![];
    }
    _0x4b9e97["screencastFrameTimer"] = setTimeoutFn(() => {
      _0x4b9e97["screencastFrameTimer"] = null;
      const _0x42e144 = _0x4b9e97['pendingScreencastFrame'];
      _0x4b9e97["pendingScreencastFrame"] = null;
      _0x5afaca(_0x4b9e97, _0x42e144);
    }, Math['max'](0x0, SCREENCAST_MIN_FRAME_INTERVAL_MS - _0x1eab8c));
    return ![];
  }
  async function _0x289795(_0x43f70c, _0x32a4df) {
    if (!_0x43f70c?.['sessionId'] || !_0x32a4df || _0x43f70c["url"] === _0x32a4df) {
      return ![];
    }
    _0x43f70c['url'] = _0x32a4df;
    _0x43f70c['requestedUrl'] = _0x32a4df;
    _0x3f3aea(_0x43f70c["nodeId"], {
      'type': "loading",
      'url': _0x32a4df,
      'holdSnapshot': ![]
    }, _0x43f70c["tabId"]);
    const _0x121ca6 = await _0x4aadaf["send"]('Page.navigate', {
      'url': _0x32a4df
    }, _0x43f70c["sessionId"]);
    if (_0x121ca6?.["errorText"]) {
      _0x3f3aea(_0x43f70c["nodeId"], {
        'type': "failed",
        'url': _0x32a4df,
        'message': String(_0x121ca6['errorText'])
      }, _0x43f70c['tabId']);
      return ![];
    }
    return !![];
  }
  async function _0xa94d5a(_0x129a58, _0x9a240b) {
    const _0x1e02aa = await _0x3a3afa();
    _0x129a58["targetId"] = String(_0x1e02aa?.["targetId"] || '');
    if (!_0x129a58['targetId']) {
      throw new Error("Chrome did not create a browser target");
    }
    const _0x38c8ba = await _0x4aadaf["send"]("Target.attachToTarget", {
      'targetId': _0x129a58["targetId"],
      'flatten': !![]
    });
    _0x129a58['sessionId'] = String(_0x38c8ba?.["sessionId"] || '');
    if (!_0x129a58["sessionId"]) {
      throw new Error("Chrome did not attach to the browser target");
    }
    _0x434ab7["set"](_0x129a58["sessionId"], _0x129a58);
    await _0x4aadaf["send"]("Page.enable", {}, _0x129a58['sessionId']);
    await _0x4aadaf["send"]("Runtime.enable", {}, _0x129a58["sessionId"]);
    await _0x2c6e08(_0x129a58, normalizeViewport(_0x9a240b));
    _0x129a58["ready"] = !![];
    if (_0x129a58['disposing']) {
      return;
    }
    await _0x289795(_0x129a58, normalizeHttpUrl(_0x9a240b?.["webUrl"]));
  }
  function _0x55ee8e(_0x57fec6) {
    const _0x29b4d9 = normalizeNodeId(_0x57fec6?.["nodeId"]);
    const _0x4d0927 = normalizeTabId(_0x57fec6?.["tabId"]);
    const _0x102c1c = {
      'key': toEntryKey(_0x29b4d9, _0x4d0927),
      'nodeId': _0x29b4d9,
      'tabId': _0x4d0927,
      'targetId': '',
      'sessionId': '',
      'requestedUrl': '',
      'url': '',
      'ready': ![],
      'disposing': ![],
      'active': _0x57fec6?.["active"] === !![],
      'visible': _0x57fec6?.["visible"] === !![],
      'selected': _0x57fec6?.["selected"] === !![],
      'capturePending': ![],
      'captureQueued': ![],
      'inputCaptureTimer': null,
      'screencastActive': ![],
      'screencastDesired': ![],
      'screencastUnavailable': ![],
      'screencastRestartRequested': ![],
      'screencastReconcilePromise': null,
      'lastScreencastEmitAt': 0x0,
      'screencastFrameTimer': null,
      'pendingScreencastFrame': null,
      'viewportWidth': 0x0,
      'viewportHeight': 0x0,
      'visualWidth': 0x0,
      'visualHeight': 0x0,
      'zoomFactor': 0x1,
      'readyPromise': null
    };
    _0x22d959["set"](_0x102c1c["key"], _0x102c1c);
    _0x102c1c["readyPromise"] = _0xa94d5a(_0x102c1c, _0x57fec6)['catch'](_0x516aa1 => {
      _0x3e1e5c("chrome_web_preview.create_failed", "Chrome browser node target creation failed", _0x516aa1, _0x102c1c);
      _0x3f3aea(_0x102c1c['nodeId'], {
        'type': 'failed',
        'message': String(_0x516aa1?.["message"] || _0x516aa1 || 'Browser\x20target\x20failed')
      }, _0x102c1c["tabId"]);
      throw _0x516aa1;
    });
    return _0x102c1c;
  }
  async function _0x1150b8(_0x2e2858) {
    const _0x1cf70f = normalizeNodeId(_0x2e2858?.['nodeId']);
    const _0x3cf03e = normalizeTabId(_0x2e2858?.['tabId']);
    const _0x1756d4 = toEntryKey(_0x1cf70f, _0x3cf03e);
    const _0x575fcc = normalizeHttpUrl(_0x2e2858?.["webUrl"]);
    if (!_0x1cf70f || !_0x575fcc) {
      return null;
    }
    const _0x96a02 = _0x22d959["get"](_0x1756d4) || _0x55ee8e(_0x2e2858);
    const _0x3c1d99 = _0x96a02['active'] !== !![] && _0x2e2858?.["active"] === !![];
    const _0x559750 = _0x96a02["selected"] !== !![] && _0x2e2858?.['selected'] === !![];
    _0x96a02["active"] = _0x2e2858?.["active"] === !![];
    _0x96a02["visible"] = _0x2e2858?.['visible'] === !![];
    _0x96a02['selected'] = _0x2e2858?.['selected'] === !![];
    try {
      await _0x96a02['readyPromise'];
      if (_0x96a02['disposing']) {
        return null;
      }
      const _0x2549f5 = await _0x2c6e08(_0x96a02, normalizeViewport(_0x2e2858));
      const _0x1a6693 = await _0x289795(_0x96a02, _0x575fcc);
      await _0x4c5e34(_0x96a02, {
        'restart': _0x2549f5
      });
      _0x96a02['active'] && !_0x96a02["screencastActive"] && !_0x1a6693 && (_0x3c1d99 || _0x559750 || _0x2549f5) && void _0x5ccdf7(_0x96a02);
      return _0x96a02;
    } catch {
      return null;
    }
  }
  async function _0x271cda(_0x9e348d) {
    if (!_0x9e348d || _0x9e348d["disposing"]) {
      return ![];
    }
    _0x9e348d['disposing'] = !![];
    _0x22d959["delete"](_0x9e348d["key"]);
    if (_0x9e348d["inputCaptureTimer"]) {
      clearTimeoutFn(_0x9e348d["inputCaptureTimer"]);
    }
    _0x9e348d["inputCaptureTimer"] = null;
    if (_0x9e348d["screencastFrameTimer"]) {
      clearTimeoutFn(_0x9e348d["screencastFrameTimer"]);
    }
    _0x9e348d["screencastFrameTimer"] = null;
    _0x9e348d["pendingScreencastFrame"] = null;
    if (_0x9e348d["sessionId"]) {
      _0x434ab7["delete"](_0x9e348d['sessionId']);
    }
    try {
      await _0x9e348d["readyPromise"];
    } catch {}
    if (_0x9e348d['screencastActive'] && _0x9e348d["sessionId"]) {
      try {
        await _0x4aadaf["send"]("Page.stopScreencast", {}, _0x9e348d['sessionId']);
      } catch {}
      _0x9e348d["screencastActive"] = ![];
    }
    if (_0x9e348d["sessionId"]) {
      _0x434ab7["delete"](_0x9e348d["sessionId"]);
    }
    if (_0x9e348d["targetId"]) {
      try {
        await _0x4aadaf["send"]("Target.closeTarget", {
          'targetId': _0x9e348d["targetId"]
        });
      } catch {}
    }
    return !![];
  }
  async function _0x39fb14(_0x5db1e4 = {}) {
    const _0x539a3a = _0x434ab7['get'](String(_0x5db1e4?.["sessionId"] || ''));
    if (!_0x539a3a || _0x539a3a["disposing"]) {
      return;
    }
    const _0x2bf08b = _0x5db1e4?.["params"] || {};
    if (_0x5db1e4["method"] === "Page.frameStartedLoading") {
      _0x539a3a["requestedUrl"] && _0x3f3aea(_0x539a3a["nodeId"], {
        'type': 'loading',
        'url': _0x539a3a["requestedUrl"],
        'holdSnapshot': ![]
      }, _0x539a3a["tabId"]);
      return;
    }
    if (_0x5db1e4["method"] === "Page.frameNavigated") {
      const _0xb564d6 = _0x2bf08b?.["frame"] || {};
      const _0x442a81 = normalizeHttpUrl(_0xb564d6?.["url"]);
      !_0xb564d6?.["parentId"] && _0x442a81 && (_0x539a3a["url"] = _0x442a81, _0x539a3a['requestedUrl'] = _0x442a81, _0x3f3aea(_0x539a3a["nodeId"], {
        'type': 'navigated',
        'url': _0x442a81
      }, _0x539a3a["tabId"]));
      return;
    }
    if (_0x5db1e4["method"] === "Page.loadEventFired") {
      _0x3f3aea(_0x539a3a['nodeId'], {
        'type': 'loaded'
      }, _0x539a3a["tabId"]);
      await Promise["all"]([_0x218241(_0x539a3a), _0x539a3a['screencastActive'] ? Promise["resolve"](!![]) : _0x5ccdf7(_0x539a3a)]);
      return;
    }
    if (_0x5db1e4["method"] === "Page.screencastFrame") {
      const _0x195baf = Number(_0x2bf08b?.["sessionId"]);
      Number['isFinite'](_0x195baf) && void _0x4aadaf["send"]("Page.screencastFrameAck", {
        'sessionId': _0x195baf
      }, _0x539a3a["sessionId"])["catch"](() => {});
      _0x19acfa(_0x539a3a, String(_0x2bf08b?.["data"] || '')['trim']());
      return;
    }
    _0x5db1e4["method"] === "Inspector.targetCrashed" && _0x3f3aea(_0x539a3a["nodeId"], {
      'type': "failed",
      'message': "浏览器页面进程已退出"
    }, _0x539a3a["tabId"]);
  }
  const _0x3b437d = typeof _0x4aadaf["onEvent"] === 'function' ? _0x4aadaf["onEvent"](_0x174379 => {
    void _0x39fb14(_0x174379);
  }) : () => {};
  async function _0x50e238(_0x3ce3b6 = {}) {
    const _0x4c5a33 = normalizeNodeId(_0x3ce3b6?.["nodeId"]);
    const _0x5886c3 = normalizeTabId(_0x3ce3b6?.["tabId"]);
    const _0x319631 = String(_0x3ce3b6?.["action"] || '')['trim']();
    if (!_0x4c5a33) {
      return {
        'ok': ![],
        'error': "missing-node"
      };
    }
    const _0x4626af = _0x22d959['get'](toEntryKey(_0x4c5a33, _0x5886c3));
    if (!_0x4626af) {
      return {
        'ok': ![],
        'error': "missing-view"
      };
    }
    try {
      await _0x4626af["readyPromise"];
      if (!_0x4626af["sessionId"] || _0x4626af["disposing"]) {
        return {
          'ok': ![],
          'error': "missing-view"
        };
      }
      if (_0x319631 === "reload") {
        _0x3f3aea(_0x4c5a33, {
          'type': 'loading',
          'url': _0x4626af["url"],
          'holdSnapshot': ![]
        }, _0x5886c3);
        await _0x4aadaf["send"]("Page.reload", {
          'ignoreCache': !![]
        }, _0x4626af["sessionId"]);
      } else {
        if (_0x319631 === "back" || _0x319631 === "forward") {
          const _0x4ac6f0 = await _0x4aadaf["send"]('Page.getNavigationHistory', {}, _0x4626af["sessionId"]);
          const _0x573b9f = Array["isArray"](_0x4ac6f0?.['entries']) ? _0x4ac6f0["entries"] : [];
          const _0x2eda90 = Math["max"](0x0, Number(_0x4ac6f0?.["currentIndex"]) || 0x0);
          const _0x42750f = _0x319631 === "back" ? _0x2eda90 - 0x1 : _0x2eda90 + 0x1;
          const _0x18b8ad = _0x573b9f[_0x42750f];
          if (_0x18b8ad?.['id'] == null) {
            const _0x5079bb = await _0x1688df(_0x4626af);
            _0x3f3aea(_0x4c5a33, {
              'type': 'blocked',
              'message': _0x319631 === "back" ? "没有上一页" : "没有下一页"
            }, _0x5886c3);
            return {
              'ok': ![],
              'error': "no-history",
              ..._0x5079bb
            };
          }
          await _0x4aadaf["send"]('Page.navigateToHistoryEntry', {
            'entryId': _0x18b8ad['id']
          }, _0x4626af['sessionId']);
        } else {
          if (_0x319631 === 'dispatch-input') {
            const _0x5c9d29 = _0x3ce3b6?.['input'] && typeof _0x3ce3b6["input"] === "object" ? _0x3ce3b6["input"] : {};
            const _0x425342 = normalizeInputModifiers(_0x5c9d29);
            if (_0x5c9d29['kind'] === "mouse") {
              const _0x43b6d3 = String(_0x5c9d29["type"] || '');
              if (!["mousePressed", 'mouseReleased', "mouseMoved", "mouseWheel"]["includes"](_0x43b6d3)) {
                return {
                  'ok': ![],
                  'error': "unsupported-input"
                };
              }
              const _0x13c3cc = Math["max"](0x0, Math["min"](0x1, Number(_0x5c9d29["xRatio"]) || 0x0));
              const _0xcd7fc8 = Math['max'](0x0, Math["min"](0x1, Number(_0x5c9d29["yRatio"]) || 0x0));
              await _0x4aadaf['send']("Input.dispatchMouseEvent", {
                'type': _0x43b6d3,
                'x': _0x13c3cc * Math["max"](0x1, _0x4626af["viewportWidth"] || 0x1),
                'y': _0xcd7fc8 * Math['max'](0x1, _0x4626af['viewportHeight'] || 0x1),
                'modifiers': _0x425342,
                'button': normalizeMouseButton(_0x5c9d29["button"]),
                'buttons': Math["max"](0x0, Number(_0x5c9d29['buttons']) || 0x0),
                'clickCount': Math["max"](0x0, Number(_0x5c9d29["clickCount"]) || 0x0),
                ...(_0x43b6d3 === 'mouseWheel' ? {
                  'deltaX': Number(_0x5c9d29["deltaX"]) || 0x0,
                  'deltaY': Number(_0x5c9d29["deltaY"]) || 0x0
                } : {})
              }, _0x4626af["sessionId"]);
              if (_0x43b6d3 !== "mousePressed") {
                _0x3d1224(_0x4626af);
              }
            } else {
              if (_0x5c9d29["kind"] === "key") {
                const _0x32a726 = _0x5c9d29['type'] === 'keyUp' ? "keyUp" : 'keyDown';
                await _0x4aadaf["send"]('Input.dispatchKeyEvent', {
                  'type': _0x32a726,
                  'modifiers': _0x425342,
                  'key': String(_0x5c9d29['key'] || ''),
                  'code': String(_0x5c9d29['code'] || ''),
                  'text': _0x32a726 === "keyDown" ? String(_0x5c9d29["text"] || '') : '',
                  'unmodifiedText': _0x32a726 === "keyDown" ? String(_0x5c9d29["text"] || '') : '',
                  'windowsVirtualKeyCode': Math["max"](0x0, Number(_0x5c9d29["keyCode"]) || 0x0),
                  'nativeVirtualKeyCode': Math["max"](0x0, Number(_0x5c9d29["keyCode"]) || 0x0),
                  'autoRepeat': _0x5c9d29["repeat"] === !![]
                }, _0x4626af["sessionId"]);
                if (_0x32a726 === "keyUp") {
                  _0x3d1224(_0x4626af);
                }
              } else {
                if (_0x5c9d29["kind"] === "text") {
                  await _0x4aadaf["send"]("Input.insertText", {
                    'text': String(_0x5c9d29['text'] || '')
                  }, _0x4626af["sessionId"]);
                  _0x3d1224(_0x4626af);
                } else {
                  return {
                    'ok': ![],
                    'error': "unsupported-input"
                  };
                }
              }
            }
            return {
              'ok': !![],
              'action': _0x319631,
              'tabId': _0x5886c3
            };
          } else {
            if (_0x319631 === "capture-reference") {
              const [_0x3ec9ae, _0x164641, _0x3bf301] = await Promise["all"]([_0x4aadaf['send']('Runtime.evaluate', {
                'expression': createReferenceSnapshotExpression(),
                'returnByValue': !![],
                'awaitPromise': !![]
              }, _0x4626af["sessionId"]), _0x4aadaf['send']("Page.captureScreenshot", {
                'format': "webp",
                'quality': SNAPSHOT_QUALITY,
                'fromSurface': !![],
                'optimizeForSpeed': !![]
              }, _0x4626af["sessionId"]), _0x1688df(_0x4626af)]);
              const _0x155d39 = _0x3ec9ae?.["result"]?.["value"] || {};
              return {
                'ok': !![],
                'action': _0x319631,
                'tabId': _0x5886c3,
                'pageUrl': String(_0x155d39?.['pageUrl'] || _0x4626af["url"] || _0x4626af["requestedUrl"] || ''),
                'pageTitle': String(_0x155d39?.['pageTitle'] || ''),
                'selectedText': String(_0x155d39?.["selectedText"] || '')["slice"](0x0, 0x1388),
                'screenshotDataUrl': _0x164641?.["data"] ? "data:image/webp;base64," + _0x164641["data"] : '',
                'capturedAt': new Date(now())["toISOString"](),
                ..._0x3bf301
              };
            } else {
              return {
                'ok': ![],
                'error': "unsupported-action"
              };
            }
          }
        }
      }
      return {
        'ok': !![],
        'action': _0x319631,
        'tabId': _0x5886c3,
        ...(await _0x218241(_0x4626af))
      };
    } catch (_0x30baa4) {
      _0x3e1e5c("chrome_web_preview.control_failed", "Chrome browser node control failed", _0x30baa4, _0x4626af);
      return {
        'ok': ![],
        'error': String(_0x30baa4?.['message'] || _0x30baa4 || "control-failed")
      };
    }
  }
  return {
    async 'syncViews'(_0x34e8c0 = {}) {
      if (_0x580755) {
        return {
          'ok': ![],
          'error': "disposed"
        };
      }
      const _0x445bb6 = Array["isArray"](_0x34e8c0?.["views"]) ? _0x34e8c0["views"] : [];
      const _0x502df9 = new Set();
      const _0x369a19 = [];
      for (const _0xdcc737 of _0x445bb6) {
        const _0x328901 = normalizeNodeId(_0xdcc737?.['nodeId']);
        const _0x36ce82 = normalizeTabId(_0xdcc737?.["tabId"]);
        const _0x297866 = normalizeHttpUrl(_0xdcc737?.['webUrl']);
        if (!_0x328901 || !_0x297866) {
          continue;
        }
        _0x502df9['add'](toEntryKey(_0x328901, _0x36ce82));
        _0x369a19["push"](_0x1150b8(_0xdcc737));
      }
      await Promise["all"](_0x369a19);
      await Promise["all"]([..._0x22d959["values"]()]['filter'](_0x54e3c8 => !_0x502df9['has'](_0x54e3c8['key']))["map"](_0x6975b4 => _0x271cda(_0x6975b4)));
      return {
        'ok': !![],
        'count': _0x22d959["size"],
        'visibleCount': [..._0x22d959['values']()]["filter"](_0x3b4db1 => _0x3b4db1["visible"])["length"]
      };
    },
    async 'disposeViews'(_0x24ffe3 = {}) {
      const _0x140976 = new Set(Array["isArray"](_0x24ffe3?.["nodeIds"]) ? _0x24ffe3["nodeIds"]["map"](normalizeNodeId)["filter"](Boolean) : []);
      const _0x36e0ab = new Set(Array['isArray'](_0x24ffe3?.["tabIds"]) ? _0x24ffe3["tabIds"]["map"](normalizeTabId)["filter"](Boolean) : []);
      const _0x30f100 = [..._0x22d959["values"]()]["filter"](_0x19ab86 => {
        if (_0x140976["size"] > 0x0 && !_0x140976["has"](_0x19ab86["nodeId"])) {
          return ![];
        }
        if (_0x36e0ab['size'] > 0x0 && !_0x36e0ab["has"](_0x19ab86["tabId"])) {
          return ![];
        }
        return _0x140976["size"] > 0x0 || _0x36e0ab["size"] > 0x0 || _0x24ffe3?.["all"] === !![];
      });
      const _0x55f592 = await Promise['all'](_0x30f100["map"](_0x271cda));
      return {
        'ok': !![],
        'disposed': _0x55f592["filter"](Boolean)["length"]
      };
    },
    'controlView': _0x50e238,
    'consumeEvents'() {
      return _0x361633();
    },
    'waitForEvents'(_0x27bf82 = {}) {
      if (_0x580755) {
        return Promise['resolve']([]);
      }
      if (_0x4d8583["length"] > 0x0) {
        return Promise["resolve"](_0x361633());
      }
      const _0x5c66a6 = clampNumber(_0x27bf82?.["waitMs"], EVENT_WAIT_MIN_MS, EVENT_WAIT_MAX_MS, 0x3e8);
      return new Promise(_0x4004f7 => {
        const _0x100a83 = {
          'resolve': _0x4004f7,
          'timer': null
        };
        _0x100a83['timer'] = setTimeoutFn(() => {
          _0x268183["delete"](_0x100a83);
          _0x4004f7([]);
        }, _0x5c66a6);
        _0x268183["add"](_0x100a83);
      });
    },
    async 'dispose'() {
      if (_0x580755) {
        return;
      }
      _0x580755 = !![];
      _0x3b437d?.();
      await Promise["all"]([..._0x22d959['values']()]["map"](_0x271cda));
      _0x434ab7["clear"]();
      _0x4d8583['length'] = 0x0;
      for (const _0x58ca74 of _0x268183) {
        if (_0x58ca74["timer"]) {
          clearTimeoutFn(_0x58ca74["timer"]);
        }
        _0x58ca74["resolve"]([]);
      }
      _0x268183["clear"]();
      _0x4aadaf["close"]?.();
    },
    '_getEntry'(_0x20cf0b, _0x2e484d) {
      return _0x22d959['get'](toEntryKey(_0x20cf0b, _0x2e484d)) || null;
    }
  };
}
export const __chromeShellWebPreviewManagerForTest = {
  'normalizeHttpUrl': normalizeHttpUrl,
  'normalizeInputModifiers': normalizeInputModifiers,
  'normalizeMouseButton': normalizeMouseButton,
  'normalizeViewport': normalizeViewport,
  'toEntryKey': toEntryKey
};