import { extractStoryboardVideoFramesFromServer } from '../../api/storyboardVideoFrameApi.js';
import { waitForVideoFrame } from '../components/videoFrameCapture.js';
import { attachMediaElementPlaybackSource } from '../services/desktopMediaBlobSource.js';
import { localPathToUrl } from '../utils/localMediaPath.js';
const THUMB_METADATA_TIMEOUT_MS = 0x1f40;
const THUMB_SEEK_TIMEOUT_MS = 0x640;
function normalizeText(_0x32e3cd) {
  return String(_0x32e3cd || '')["trim"]();
}
function getVideoSource(_0x385a78) {
  return normalizeText(_0x385a78?.["getAttribute"]?.("src") || _0x385a78?.["currentSrc"] || _0x385a78?.["src"]);
}
function resolveFrameUrl(_0x4a4453) {
  return normalizeText(_0x4a4453?.["url"] || _0x4a4453?.["localUrl"]) || localPathToUrl(_0x4a4453?.["localPath"] || _0x4a4453?.['path']);
}
function setThumbState(_0x55fc2e, _0x342aa5) {
  for (const _0x171dd6 of Array["isArray"](_0x55fc2e) ? _0x55fc2e : []) {
    if (_0x171dd6?.["dataset"]) {
      _0x171dd6["dataset"]["thumbnailState"] = _0x342aa5;
    }
    _0x171dd6?.["classList"]?.["add"]("video-timeline-thumbnail");
    _0x171dd6?.["setAttribute"]?.("aria-busy", 'false');
  }
}
function setThumbBackground(_0x203ef1, _0x5e93df, _0x49b3d9 = '') {
  const _0x226a9f = normalizeText(_0x5e93df);
  if (!_0x203ef1?.["style"] || !_0x226a9f) {
    return ![];
  }
  const _0x1a380d = [_0x226a9f, normalizeText(_0x49b3d9)]["filter"](Boolean)["filter"]((_0x20c0e7, _0x5c7c3c, _0x1c38e3) => _0x1c38e3["indexOf"](_0x20c0e7) === _0x5c7c3c);
  _0x203ef1["style"]['backgroundImage'] = _0x1a380d['map'](_0x269b47 => "url(" + JSON["stringify"](_0x269b47) + ')')["join"](',\x20');
  return !![];
}
export function paintVideoTimelineThumbnailUrls(_0x465f39, _0xc585d3, _0x478907 = 'ready') {
  const _0x5f0531 = Array["isArray"](_0x465f39) ? _0x465f39 : [];
  const _0x1f3db2 = (Array["isArray"](_0xc585d3) ? _0xc585d3 : [_0xc585d3])["map"](normalizeText)['filter'](Boolean);
  if (!_0x5f0531["length"] || !_0x1f3db2["length"]) {
    return 0x0;
  }
  for (let _0x4b1fd3 = 0x0; _0x4b1fd3 < _0x5f0531['length']; _0x4b1fd3 += 0x1) {
    const _0x52e2d0 = Math['min'](_0x1f3db2["length"] - 0x1, Math["floor"]((_0x4b1fd3 + 0.5) * _0x1f3db2["length"] / _0x5f0531['length']));
    setThumbBackground(_0x5f0531[_0x4b1fd3], _0x1f3db2[_0x52e2d0], _0x1f3db2[0x0]);
  }
  setThumbState(_0x5f0531, _0x478907);
  return _0x5f0531['length'];
}
function waitForLoadedMetadata(_0xdd9fcc, _0x45c2ff) {
  if (Number(_0xdd9fcc?.["readyState"] || 0x0) >= 0x1) {
    return Promise["resolve"](!![]);
  }
  return new Promise((_0x1b1b42, _0x4735f6) => {
    let _0x16d1c7 = ![];
    let _0x1bde40 = null;
    const _0x4b2557 = () => {
      _0xdd9fcc["removeEventListener"]?.("loadedmetadata", _0x4b23ab);
      _0xdd9fcc['removeEventListener']?.("durationchange", _0x4b23ab);
      _0xdd9fcc["removeEventListener"]?.("error", _0x511224);
      _0xdd9fcc["removeEventListener"]?.("abort", _0x511224);
      if (_0x1bde40) {
        globalThis["clearTimeout"](_0x1bde40);
      }
    };
    const _0x291643 = _0x4dacd6 => {
      if (_0x16d1c7) {
        return;
      }
      _0x16d1c7 = !![];
      _0x4b2557();
      if (_0x4dacd6) {
        _0x4735f6(_0x4dacd6);
      } else {
        _0x1b1b42(!![]);
      }
    };
    const _0x4b23ab = () => _0x291643();
    const _0x511224 = () => _0x291643(new Error("video thumbnail source failed to load"));
    _0xdd9fcc["addEventListener"]?.("loadedmetadata", _0x4b23ab);
    _0xdd9fcc["addEventListener"]?.("durationchange", _0x4b23ab);
    _0xdd9fcc['addEventListener']?.("error", _0x511224);
    _0xdd9fcc["addEventListener"]?.('abort', _0x511224);
    _0x1bde40 = globalThis["setTimeout"](() => _0x291643(new Error('video\x20thumbnail\x20metadata\x20timed\x20out')), _0x45c2ff);
  });
}
function seekVideo(_0x3cee9e, _0x2c4cc1, _0x5d64ab) {
  const _0x5eec60 = Math["max"](0x0, Number(_0x2c4cc1) || 0x0);
  if (Math["abs"]((Number(_0x3cee9e?.["currentTime"]) || 0x0) - _0x5eec60) <= 0.02 && Number(_0x3cee9e?.["readyState"] || 0x0) >= 0x2 && _0x3cee9e?.['seeking'] !== !![]) {
    return Promise["resolve"](!![]);
  }
  return new Promise((_0x50d324, _0x558dfb) => {
    let _0x4a9d33 = ![];
    let _0x567b32 = null;
    const _0x421d56 = () => {
      _0x3cee9e["removeEventListener"]?.('seeked', _0x39d23c);
      _0x3cee9e["removeEventListener"]?.("timeupdate", _0x39d23c);
      _0x3cee9e["removeEventListener"]?.('error', _0x5b6fdf);
      _0x3cee9e['removeEventListener']?.('abort', _0x5b6fdf);
      if (_0x567b32) {
        globalThis["clearTimeout"](_0x567b32);
      }
    };
    const _0x10d3a0 = _0x277b90 => {
      if (_0x4a9d33) {
        return;
      }
      _0x4a9d33 = !![];
      _0x421d56();
      if (_0x277b90) {
        _0x558dfb(_0x277b90);
      } else {
        _0x50d324(!![]);
      }
    };
    const _0x39d23c = () => {
      if (_0x3cee9e?.["seeking"] !== !![]) {
        _0x10d3a0();
      }
    };
    const _0x5b6fdf = () => _0x10d3a0(new Error('video\x20thumbnail\x20seek\x20failed'));
    _0x3cee9e["addEventListener"]?.("seeked", _0x39d23c);
    _0x3cee9e["addEventListener"]?.("timeupdate", _0x39d23c);
    _0x3cee9e["addEventListener"]?.("error", _0x5b6fdf);
    _0x3cee9e["addEventListener"]?.("abort", _0x5b6fdf);
    _0x567b32 = globalThis["setTimeout"](() => _0x10d3a0(new Error("video thumbnail seek timed out")), _0x5d64ab);
    try {
      _0x3cee9e['currentTime'] = _0x5eec60;
    } catch (_0x32cca3) {
      _0x10d3a0(_0x32cca3 instanceof Error ? _0x32cca3 : new Error(String(_0x32cca3)));
    }
  });
}
export async function extractClientVideoTimelineFrameUrls({
  src: _0x199e86,
  count: _0xad698b,
  isCurrent = () => !![],
  documentRef = globalThis["document"],
  attachMediaSource = attachMediaElementPlaybackSource,
  waitForFrame = waitForVideoFrame,
  onDuration: _0x231a5f
} = {}) {
  const _0x82aa67 = normalizeText(_0x199e86);
  const _0x25bbfb = Math["max"](0x1, Math["trunc"](Number(_0xad698b) || 0x0));
  if (!_0x82aa67 || !documentRef?.["createElement"]) {
    return [];
  }
  const _0x29f081 = documentRef['createElement']("video");
  _0x29f081["muted"] = !![];
  _0x29f081['playsInline'] = !![];
  _0x29f081["preload"] = "auto";
  _0x29f081["crossOrigin"] = 'anonymous';
  _0x29f081["setAttribute"]?.("aria-hidden", 'true');
  _0x29f081["style"] && (_0x29f081["style"]["position"] = 'fixed', _0x29f081["style"]['left'] = "-10000px", _0x29f081['style']["top"] = "-10000px", _0x29f081["style"]['width'] = "1px", _0x29f081["style"]["height"] = "1px", _0x29f081["style"]["opacity"] = '0', _0x29f081["style"]["pointerEvents"] = "none");
  documentRef["body"]?.["appendChild"]?.(_0x29f081);
  let _0x4116ea = null;
  try {
    await attachMediaSource(_0x29f081, _0x82aa67, {
      'preload': 'auto'
    });
    if (!getVideoSource(_0x29f081)) {
      throw new Error('video\x20thumbnail\x20source\x20is\x20empty');
    }
    await waitForLoadedMetadata(_0x29f081, THUMB_METADATA_TIMEOUT_MS);
    if (!isCurrent()) {
      return [];
    }
    const _0x3cfbcf = await waitForFrame(_0x29f081, {
      'timeoutMs': 0x1388
    });
    if (!_0x3cfbcf) {
      throw new Error("video thumbnail frame timed out");
    }
    const _0x4fd911 = Number(_0x29f081["duration"]);
    if (!Number["isFinite"](_0x4fd911) || _0x4fd911 <= 0x0) {
      throw new Error("video thumbnail duration is unavailable");
    }
    if (!isCurrent()) {
      return [];
    }
    _0x231a5f?.(_0x4fd911);
    const _0x489940 = Math["max"](0x1, Number(_0x29f081["videoWidth"]) || 0x1);
    const _0x57817a = Math["max"](0x1, Number(_0x29f081["videoHeight"]) || 0x1);
    const _0x41eb55 = 0x2c;
    const _0x44e10f = Math["max"](0x1, Math["min"](0xf0, Math["round"](_0x489940 / _0x57817a * _0x41eb55)));
    _0x4116ea = documentRef["createElement"]("canvas");
    _0x4116ea["width"] = _0x44e10f;
    _0x4116ea["height"] = _0x41eb55;
    const _0xd28665 = _0x4116ea["getContext"]?.('2d', {
      'willReadFrequently': ![]
    });
    if (!_0xd28665) {
      throw new Error("video thumbnail canvas is unavailable");
    }
    const _0x1c3c9b = [];
    for (let _0x4032ce = 0x0; _0x4032ce < _0x25bbfb; _0x4032ce += 0x1) {
      if (!isCurrent()) {
        return [];
      }
      const _0x13c2ce = Math['min'](Math['max'](0x0, _0x4fd911 - 0.05), (_0x4032ce + 0.5) / _0x25bbfb * _0x4fd911);
      await seekVideo(_0x29f081, _0x13c2ce, THUMB_SEEK_TIMEOUT_MS);
      const _0x22057f = await waitForFrame(_0x29f081, {
        'timeoutMs': 0x708
      });
      if (!_0x22057f) {
        throw new Error("video thumbnail frame timed out after seek");
      }
      _0xd28665['clearRect'](0x0, 0x0, _0x44e10f, _0x41eb55);
      _0xd28665["drawImage"](_0x29f081, 0x0, 0x0, _0x44e10f, _0x41eb55);
      const _0x12366a = _0x4116ea["toDataURL"]("image/jpeg", 0.72);
      if (!_0x12366a) {
        throw new Error("video thumbnail export returned no data");
      }
      _0x1c3c9b['push'](_0x12366a);
    }
    return _0x1c3c9b;
  } finally {
    try {
      _0x29f081["pause"]?.();
      _0x29f081["removeAttribute"]?.("src");
      _0x29f081["load"]?.();
    } catch {}
    _0x29f081["remove"]?.();
    if (_0x4116ea) {
      _0x4116ea["width"] = _0x4116ea['height'] = 0x0;
    }
  }
}
export async function renderVideoTimelineThumbnails({
  src: _0x3c2d89,
  posterUrl: _0x4012d5,
  thumbs: _0x30a480,
  isCurrent = () => !![],
  extractServerFrames = extractStoryboardVideoFramesFromServer,
  extractClientFrames = extractClientVideoTimelineFrameUrls,
  onDuration: _0x431faf
} = {}) {
  const _0x5709b5 = Array["isArray"](_0x30a480) ? _0x30a480 : [];
  const _0x2b7258 = normalizeText(_0x3c2d89);
  const _0x41be7c = normalizeText(_0x4012d5);
  const _0x53aa96 = [];
  if (!_0x5709b5["length"]) {
    return {
      'source': 'empty',
      'errors': _0x53aa96
    };
  }
  if (!isCurrent()) {
    return {
      'source': 'cancelled',
      'errors': _0x53aa96
    };
  }
  if (_0x41be7c) {
    paintVideoTimelineThumbnailUrls(_0x5709b5, [_0x41be7c], 'poster');
  } else {
    setThumbState(_0x5709b5, 'loading');
  }
  if (!_0x2b7258) {
    setThumbState(_0x5709b5, _0x41be7c ? "poster" : 'failed');
    return {
      'source': _0x41be7c ? "poster" : 'empty',
      'errors': _0x53aa96
    };
  }
  for (const _0x4e82d9 of _0x5709b5) {
    _0x4e82d9?.["setAttribute"]?.("aria-busy", "true");
  }
  try {
    const _0x4dd135 = await extractServerFrames(_0x2b7258, {
      'maxFrames': _0x5709b5["length"],
      'exactCount': !![]
    });
    if (!isCurrent()) {
      return {
        'source': "cancelled",
        'errors': _0x53aa96
      };
    }
    const _0x253db8 = (Array['isArray'](_0x4dd135?.["frames"]) ? _0x4dd135['frames'] : [])['map'](resolveFrameUrl)['filter'](Boolean);
    if (!_0x253db8["length"]) {
      throw new Error("server returned no video thumbnails");
    }
    const _0x2492c6 = Number(_0x4dd135?.['duration']);
    if (Number["isFinite"](_0x2492c6) && _0x2492c6 > 0x0) {
      _0x431faf?.(_0x2492c6);
    }
    paintVideoTimelineThumbnailUrls(_0x5709b5, _0x253db8, "server");
    return {
      'source': "server",
      'errors': _0x53aa96
    };
  } catch (_0x5437ce) {
    _0x53aa96["push"](_0x5437ce instanceof Error ? _0x5437ce : new Error(String(_0x5437ce)));
  }
  if (!isCurrent()) {
    return {
      'source': 'cancelled',
      'errors': _0x53aa96
    };
  }
  try {
    const _0x2e950e = await extractClientFrames({
      'src': _0x2b7258,
      'count': _0x5709b5["length"],
      'isCurrent': isCurrent,
      'onDuration': _0x509796 => {
        if (isCurrent()) {
          _0x431faf?.(_0x509796);
        }
      }
    });
    if (!isCurrent()) {
      return {
        'source': "cancelled",
        'errors': _0x53aa96
      };
    }
    if (!Array["isArray"](_0x2e950e) || !_0x2e950e["some"](Boolean)) {
      throw new Error("browser returned no video thumbnails");
    }
    paintVideoTimelineThumbnailUrls(_0x5709b5, _0x2e950e, 'client');
    return {
      'source': "client",
      'errors': _0x53aa96
    };
  } catch (_0x33446c) {
    _0x53aa96["push"](_0x33446c instanceof Error ? _0x33446c : new Error(String(_0x33446c)));
  }
  if (!isCurrent()) {
    return {
      'source': "cancelled",
      'errors': _0x53aa96
    };
  }
  setThumbState(_0x5709b5, _0x41be7c ? "poster" : "failed");
  return {
    'source': _0x41be7c ? "poster" : "empty",
    'errors': _0x53aa96
  };
}