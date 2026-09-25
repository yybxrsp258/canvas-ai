import { beginZoomFpsSession, endZoomFpsSession } from '../perf/perfProbe.js';
import { setCanvasMediaSchedulerPaused } from '../canvasMediaScheduler.js';
import { screenToViewportPoint } from '../../core/math.js';
import { canvasZoomAfterWheel } from '../../core/canvasZoom.js';
const WHEEL_ZOOM_PREVIEW_OWNER = "wheel-zoom";
export function createZoomController({
  store: _0x4745f1,
  viewportPreview: _0x2f7a6d
}) {
  if (typeof _0x2f7a6d?.['acquire'] !== "function" || typeof _0x2f7a6d?.["update"] !== 'function' || typeof _0x2f7a6d?.["commit"] !== "function") {
    throw new TypeError("[ZoomController] viewportPreview is required");
  }
  let _0x39903a = 0x0;
  let _0x40146b = 0x0;
  let _0x28afdb = 0x0;
  let _0xee0d8f = 0x0;
  let _0x4eff4c = 0x0;
  let _0x4c96a7;
  let _0x1e8807 = ![];
  const _0x537307 = "is-edge-interaction-lite";
  const _0x142349 = 0.24;
  const _0x5ef8b7 = 0.48;
  const _0x2f385f = 0x3;
  const _0x3fb8fe = 0xa0;
  const _0x2a9a60 = 0x78;
  const _0x4879d7 = 'wheel-zoom';
  function _0x1d151(_0x93afb2, _0x47282d) {
    const _0x4ca5e1 = Object["keys"](_0x93afb2?.["edges"] || {})['length'];
    const _0x1581d1 = typeof window !== "undefined" ? window["_edgeDomCache"] : null;
    return _0x47282d >= _0x142349 && _0x47282d <= _0x5ef8b7 && _0x4ca5e1 >= _0x2f385f && _0x1581d1 && _0x1581d1['size'] > 0x0;
  }
  function _0x4bfc70(_0x33f760) {
    if (typeof document === "undefined" || !document?.['body']?.["classList"]) {
      return;
    }
    document["body"]['classList']["toggle"](_0x537307, !!_0x33f760);
  }
  function _0x3dd15b(_0xdb730f) {
    if (typeof requestAnimationFrame === "function") {
      return requestAnimationFrame(_0xdb730f);
    }
    return setTimeout(_0xdb730f, 0x0);
  }
  function _0x5069ec() {
    _0x40146b && (clearTimeout(_0x40146b), _0x40146b = 0x0);
    setCanvasMediaSchedulerPaused(!![], {
      'bypassPriority': 0x3e8,
      'source': _0x4879d7
    });
  }
  function _0x193126() {
    if (_0x40146b) {
      clearTimeout(_0x40146b);
    }
    _0x40146b = setTimeout(() => {
      _0x40146b = 0x0;
      setCanvasMediaSchedulerPaused(![], {
        'source': _0x4879d7
      });
    }, _0x2a9a60);
  }
  function _0xd6498f(_0x4cfc63) {
    const _0x43e567 = typeof _0x4cfc63?.["_v2UpdateSidePlusNow"] === 'function' ? _0x4cfc63["_v2UpdateSidePlusNow"] : _0x4cfc63?.['_v2UpdateSidePlus'];
    if (typeof _0x43e567 !== "function") {
      return;
    }
    if (_0x4c96a7 !== undefined) {
      _0x43e567(_0xee0d8f, _0x4eff4c, {
        'pointerTarget': _0x4c96a7
      });
      return;
    }
    _0x43e567(_0xee0d8f, _0x4eff4c);
  }
  function _0x2cc726() {
    if (!_0x28afdb) {
      return;
    }
    const _0x2b0c89 = _0x28afdb;
    _0x28afdb = 0x0;
    if (typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(_0x2b0c89);
      return;
    }
    clearTimeout(_0x2b0c89);
  }
  function _0x6d9341() {
    if (!_0x1e8807) {
      return null;
    }
    _0x1e8807 = ![];
    _0x39903a && (clearTimeout(_0x39903a), _0x39903a = 0x0);
    const _0x525e1f = typeof document !== "undefined" && document && document["body"];
    const _0x334bff = typeof window !== 'undefined' ? window : null;
    const _0x1cc648 = _0x2f7a6d["commit"](WHEEL_ZOOM_PREVIEW_OWNER);
    if (_0x525e1f) {
      document["body"]["classList"]["remove"]('is-zooming');
    }
    _0x4bfc70(![]);
    endZoomFpsSession('wheel-zoom');
    _0x2cc726();
    _0x1cc648 && (_0x334bff?.['_v2FlushMinimapViewportPreview']?.(_0x1cc648), _0x4745f1["updateViewport"](_0x1cc648['x'], _0x1cc648['y'], _0x1cc648["zoom"]), _0x4745f1["markViewportPersist"](), _0xd6498f(_0x334bff));
    _0x334bff?.["v2Renderer"]?.["releaseViewportInteractionBusy"]?.();
    _0x193126();
    return _0x1cc648;
  }
  function _0x55ee43() {
    if (_0x39903a) {
      clearTimeout(_0x39903a);
    }
    const _0x33f970 = setTimeout(() => {
      if (_0x39903a !== _0x33f970) {
        return;
      }
      _0x39903a = 0x0;
      _0x6d9341();
    }, _0x3fb8fe);
    _0x39903a = _0x33f970;
  }
  function _0x320dd4(_0x27c8e4, _0x16744, _0x53a078, _0x386242) {
    if (!Number["isFinite"](_0x53a078) || _0x53a078 === 0x0) {
      return ![];
    }
    const _0x54cb68 = _0x4745f1["getStateRaw"]();
    const _0x596a6b = _0x2f7a6d['acquire'](WHEEL_ZOOM_PREVIEW_OWNER, _0x54cb68?.["viewport"]);
    if (!_0x596a6b) {
      return ![];
    }
    const _0x5d13e4 = typeof document !== "undefined" && document && document["body"];
    const _0xf251a3 = typeof window !== "undefined" ? window : null;
    if (_0x5d13e4) {
      document['body']["classList"]["add"]('is-zooming');
    }
    _0xf251a3?.["v2Renderer"]?.['markViewportInteractionBusy']?.();
    _0x5069ec();
    beginZoomFpsSession("wheel-zoom");
    const _0x129df9 = _0x596a6b;
    const _0xd8f8a7 = screenToViewportPoint(_0x27c8e4, _0x16744, _0x129df9);
    const _0x1c6502 = canvasZoomAfterWheel(_0x129df9['zoom'], _0x53a078);
    const _0xcf3aa = _0xd8f8a7['x'] - (_0xd8f8a7['x'] - _0x129df9['x']) * (_0x1c6502 / _0x129df9["zoom"]);
    const _0x295a36 = _0xd8f8a7['y'] - (_0xd8f8a7['y'] - _0x129df9['y']) * (_0x1c6502 / _0x129df9["zoom"]);
    const _0x4bbf09 = {
      ..._0x129df9,
      'x': _0xcf3aa,
      'y': _0x295a36,
      'zoom': _0x1c6502
    };
    _0x2f7a6d['update'](WHEEL_ZOOM_PREVIEW_OWNER, _0x4bbf09);
    _0xf251a3?.["_v2ScheduleMinimapViewportPreview"]?.(_0x4bbf09);
    _0x4bfc70(_0x1d151(_0x54cb68, _0x1c6502));
    _0x1e8807 = !![];
    _0x55ee43();
    _0xee0d8f = _0xf251a3?.["_lastMx"] || _0x27c8e4;
    _0x4eff4c = _0xf251a3?.['_lastMy'] || _0x16744;
    _0x4c96a7 = _0x386242;
    if (!_0x28afdb) {
      const _0x4262f1 = _0x3dd15b(() => {
        if (_0x28afdb !== _0x4262f1) {
          return;
        }
        _0x28afdb = 0x0;
        _0xd6498f(_0xf251a3);
      });
      _0x28afdb = _0x4262f1;
    }
    return !![];
  }
  return {
    'handleWheel': _0x320dd4,
    'settleWheelZoom': _0x6d9341
  };
}