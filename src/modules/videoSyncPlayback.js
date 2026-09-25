import { getVideoCurrentSource, playVideoWithRecovery } from '../components/video-node/mediaPlaybackRecovery.js';
import { attachMediaElementPlaybackSource, isMediaElementPlaybackSource } from '../services/desktopMediaBlobSource.js';
import { resolveCanvasVideoDisplayUrl } from '../services/canvasMediaLocalService.js';
import { claimExternalVideoPlayback, releaseExternalVideoPlayback } from '../components/shared/hoverVideoPlaybackLifecycle.js';
import { localPathToUrl } from '../utils/localMediaPath.js';
import { t } from '../i18n/index.js';
const PLAYABLE_VIDEO_TYPES = new Set(["source-video", "video", "ai-video"]);
const GROUP_NODE_TYPE = 'group';
const SYNC_PLAYBACK_CLASS = 'is-sync-video-playing';
let activeSyncVideoPlaybackSession = null;
let syncVideoPlaybackSessionSequence = 0x0;
const syncVideoPlaybackStateListeners = new Set();
export function getSyncVideoPlaybackState() {
  const _0x88c83a = activeSyncVideoPlaybackSession?.["isCurrent"]?.() === !![];
  return {
    'active': _0x88c83a,
    'loop': _0x88c83a && activeSyncVideoPlaybackSession?.["loop"] === !![]
  };
}
function notifySyncVideoPlaybackState() {
  const _0x4b3226 = getSyncVideoPlaybackState();
  for (const _0x3f59ff of syncVideoPlaybackStateListeners) {
    try {
      _0x3f59ff(_0x4b3226);
    } catch {}
  }
}
export function subscribeSyncVideoPlaybackState(_0x4cb2cc) {
  if (typeof _0x4cb2cc !== "function") {
    return () => {};
  }
  syncVideoPlaybackStateListeners['add'](_0x4cb2cc);
  try {
    _0x4cb2cc(getSyncVideoPlaybackState());
  } catch {}
  return () => syncVideoPlaybackStateListeners["delete"](_0x4cb2cc);
}
function syncPlaybackText(_0x4ba972, _0x494562 = {}) {
  return t("videoSyncPlayback." + _0x4ba972, _0x494562);
}
function normalizeText(_0x28b29e) {
  return String(_0x28b29e || '')["trim"]();
}
function toNodeList(_0x98a0d5) {
  if (!_0x98a0d5 || typeof _0x98a0d5 !== "object") {
    return [];
  }
  return Object["values"](_0x98a0d5)["filter"](_0x14c88b => _0x14c88b && typeof _0x14c88b === 'object');
}
function compareCanvasOrder(_0x5e07d7, _0x462550) {
  const _0x39541c = Number(_0x5e07d7?.['y']) || 0x0;
  const _0x16f7ff = Number(_0x462550?.['y']) || 0x0;
  if (_0x39541c !== _0x16f7ff) {
    return _0x39541c - _0x16f7ff;
  }
  const _0x345cf9 = Number(_0x5e07d7?.['x']) || 0x0;
  const _0x37b3f9 = Number(_0x462550?.['x']) || 0x0;
  if (_0x345cf9 !== _0x37b3f9) {
    return _0x345cf9 - _0x37b3f9;
  }
  return normalizeText(_0x5e07d7?.['id'])['localeCompare'](normalizeText(_0x462550?.['id']));
}
function normalizePlayableUrl(_0x39a335) {
  const _0x2a099e = normalizeText(_0x39a335);
  if (!_0x2a099e) {
    return '';
  }
  if (_0x2a099e["startsWith"]("http://") || _0x2a099e["startsWith"]('https://') || _0x2a099e['startsWith']("blob:") || _0x2a099e["startsWith"]("data:") || _0x2a099e["startsWith"]("aic-local-preview:")) {
    return _0x2a099e;
  }
  const _0x1f1f74 = localPathToUrl(_0x2a099e);
  if (_0x1f1f74) {
    return _0x1f1f74;
  }
  if (_0x2a099e['startsWith']('/')) {
    return _0x2a099e;
  }
  return '';
}
function resolveVideoSource(_0x9c4a30 = {}) {
  const _0x588f4e = normalizePlayableUrl(resolveCanvasVideoDisplayUrl(_0x9c4a30));
  if (_0x588f4e) {
    return _0x588f4e;
  }
  for (const _0x26030c of ["displayLocalPath", 'localPath', 'originalLocalPath', "videoLocalPath", "capturePreviewUrl", "src", "videoUrl", "url", 'resultUrl', "sourceUrl"]) {
    const _0x1a9fee = normalizePlayableUrl(_0x9c4a30?.[_0x26030c]);
    if (_0x1a9fee) {
      return _0x1a9fee;
    }
  }
  return '';
}
function isUnavailableVideoRecord(_0xb7478e = {}) {
  return !!normalizeText(_0xb7478e?.["error"]) || _0xb7478e?.["mediaUnavailable"] === !![] || _0xb7478e?.["videoUnavailable"] === !![];
}
function getMainVideoRecord(_0x3935de) {
  const _0x3dfbc6 = Array['isArray'](_0x3935de?.["videos"]) ? _0x3935de["videos"] : [];
  if (_0x3dfbc6["length"] === 0x0) {
    return null;
  }
  const _0x16a010 = Number(_0x3935de?.["mainVideoIndex"]);
  const _0x5a6cc3 = Number["isFinite"](_0x16a010) ? Math["max"](0x0, Math['min'](_0x3dfbc6["length"] - 0x1, Math['trunc'](_0x16a010))) : 0x0;
  return {
    'record': _0x3dfbc6[_0x5a6cc3],
    'index': _0x5a6cc3
  };
}
export function resolveCanvasNodePlayableVideoEntry(_0x1f34c2) {
  if (!PLAYABLE_VIDEO_TYPES["has"](normalizeText(_0x1f34c2?.["type"]))) {
    return null;
  }
  if (isUnavailableVideoRecord(_0x1f34c2)) {
    return null;
  }
  if (normalizeText(_0x1f34c2?.["type"]) === 'ai-video') {
    const _0x4325ef = getMainVideoRecord(_0x1f34c2);
    if (_0x4325ef?.["record"]) {
      if (isUnavailableVideoRecord(_0x4325ef["record"])) {
        return null;
      }
      const _0x1cda71 = resolveVideoSource(_0x4325ef["record"]) || resolveVideoSource(_0x1f34c2);
      return _0x1cda71 ? {
        'nodeId': normalizeText(_0x1f34c2['id']),
        'videoIndex': _0x4325ef["index"],
        'source': _0x1cda71,
        'node': _0x1f34c2,
        'record': _0x4325ef["record"]
      } : null;
    }
  }
  const _0x465d71 = resolveVideoSource(_0x1f34c2);
  return _0x465d71 ? {
    'nodeId': normalizeText(_0x1f34c2['id']),
    'videoIndex': 0x0,
    'source': _0x465d71,
    'node': _0x1f34c2,
    'record': _0x1f34c2
  } : null;
}
function collectVideoEntriesForNode(_0x1be357) {
  const _0x306192 = resolveCanvasNodePlayableVideoEntry(_0x1be357);
  return _0x306192 ? [_0x306192] : [];
}
function buildChildrenByParent(_0x1bf75b) {
  const _0x2e4d87 = new Map();
  for (const _0x132d91 of toNodeList(_0x1bf75b)) {
    const _0x471013 = normalizeText(_0x132d91?.['parentId']);
    if (!_0x471013) {
      continue;
    }
    if (!_0x2e4d87['has'](_0x471013)) {
      _0x2e4d87["set"](_0x471013, []);
    }
    _0x2e4d87["get"](_0x471013)["push"](_0x132d91);
  }
  for (const _0x3278c9 of _0x2e4d87["values"]()) {
    _0x3278c9["sort"](compareCanvasOrder);
  }
  return _0x2e4d87;
}
function pushUniqueEntry(_0x2cdddb, _0x5679f3, _0x57ab7f) {
  const _0x393f6d = normalizeText(_0x57ab7f?.["nodeId"]);
  if (!_0x393f6d) {
    return;
  }
  const _0x440d67 = _0x393f6d + ':' + (Number(_0x57ab7f?.['videoIndex']) || 0x0);
  if (_0x5679f3['has'](_0x440d67)) {
    return;
  }
  _0x5679f3["add"](_0x440d67);
  _0x2cdddb["push"]({
    ..._0x57ab7f,
    'key': _0x440d67
  });
}
function collectGroupEntriesInto({
  nodes: _0x1ef815,
  groupId: _0x5ad689,
  childrenByParent: _0x3376ec,
  result: _0x2789a3,
  seen: _0x1889d6,
  visitedGroups: _0x4a32b7
}) {
  const _0x2a315d = normalizeText(_0x5ad689);
  if (!_0x2a315d || _0x4a32b7["has"](_0x2a315d)) {
    return;
  }
  _0x4a32b7["add"](_0x2a315d);
  const _0x3515ca = _0x3376ec["get"](_0x2a315d) || [];
  for (const _0xd1f967 of _0x3515ca) {
    const _0x21813f = normalizeText(_0xd1f967?.['id']);
    if (!_0x21813f) {
      continue;
    }
    if (normalizeText(_0xd1f967?.["type"]) === GROUP_NODE_TYPE) {
      collectGroupEntriesInto({
        'nodes': _0x1ef815,
        'groupId': _0x21813f,
        'childrenByParent': _0x3376ec,
        'result': _0x2789a3,
        'seen': _0x1889d6,
        'visitedGroups': _0x4a32b7
      });
      continue;
    }
    for (const _0x4a194f of collectVideoEntriesForNode(_0x1ef815?.[_0x21813f] || _0xd1f967)) {
      pushUniqueEntry(_0x2789a3, _0x1889d6, _0x4a194f);
    }
  }
}
export function collectGroupSyncPlayableVideoEntries(_0x24557f, _0x533079) {
  const _0x378ce8 = _0x24557f?.[_0x533079];
  if (!_0x378ce8 || normalizeText(_0x378ce8?.["type"]) !== GROUP_NODE_TYPE) {
    return [];
  }
  const _0x3ae761 = [];
  const _0x56cd6e = new Set();
  collectGroupEntriesInto({
    'nodes': _0x24557f,
    'groupId': _0x533079,
    'childrenByParent': buildChildrenByParent(_0x24557f),
    'result': _0x3ae761,
    'seen': _0x56cd6e,
    'visitedGroups': new Set()
  });
  return _0x3ae761;
}
export function collectSelectedSyncPlayableVideoEntries(_0x669c0b, _0x49514f = []) {
  const _0x379abb = new Set((Array["isArray"](_0x49514f) ? _0x49514f : [])["map"](_0x598ff0 => normalizeText(_0x598ff0))["filter"](Boolean));
  if (_0x379abb["size"] === 0x0) {
    return [];
  }
  const _0x16ab59 = [];
  const _0x3c4143 = new Set();
  const _0x5781fb = buildChildrenByParent(_0x669c0b);
  const _0x2d36de = toNodeList(_0x669c0b)['filter'](_0x2f8cfe => _0x379abb["has"](normalizeText(_0x2f8cfe?.['id'])))['sort'](compareCanvasOrder);
  for (const _0x39f22f of _0x2d36de) {
    const _0x266567 = normalizeText(_0x39f22f?.["type"]);
    if (_0x266567 === GROUP_NODE_TYPE) {
      collectGroupEntriesInto({
        'nodes': _0x669c0b,
        'groupId': _0x39f22f['id'],
        'childrenByParent': _0x5781fb,
        'result': _0x16ab59,
        'seen': _0x3c4143,
        'visitedGroups': new Set()
      });
      continue;
    }
    for (const _0x742a61 of collectVideoEntriesForNode(_0x39f22f)) {
      pushUniqueEntry(_0x16ab59, _0x3c4143, _0x742a61);
    }
  }
  return _0x16ab59;
}
export function getSelectedSyncPlayableVideoCount(_0x52da8e, _0x169f5b = []) {
  return collectSelectedSyncPlayableVideoEntries(_0x52da8e, _0x169f5b)["length"];
}
export function findCanvasVideoElementForEntry(_0x4d2ef1, _0x1d3e50) {
  const _0x2a9a09 = _0x4d2ef1 || globalThis["document"];
  if (!_0x2a9a09 || typeof _0x2a9a09["getElementById"] !== 'function') {
    return null;
  }
  const _0x1faf86 = _0x2a9a09["getElementById"](normalizeText(_0x1d3e50?.["nodeId"]));
  if (!_0x1faf86 || typeof _0x1faf86["querySelector"] !== "function") {
    return null;
  }
  const _0x45701c = Math["max"](0x0, Math["trunc"](Number(_0x1d3e50?.['videoIndex']) || 0x0));
  return _0x1faf86["querySelector"]("video[data-idx=\"" + _0x45701c + '\x22]') || _0x1faf86["querySelector"](".video-player") || _0x1faf86["querySelector"]("video");
}
function findWrapperForEntry(_0x35e7c7, _0x1163b2) {
  const _0x309f2c = _0x35e7c7 || globalThis["document"];
  if (!_0x309f2c || typeof _0x309f2c["getElementById"] !== "function") {
    return null;
  }
  return _0x309f2c["getElementById"](normalizeText(_0x1163b2?.['nodeId']));
}
function safePause(_0x12d36b) {
  try {
    _0x12d36b?.["pause"]?.();
  } catch {}
}
function setSyncPlaybackChromeHidden(_0x24e8f6, _0x264d7f) {
  _0x24e8f6?.['classList']?.['toggle']?.(SYNC_PLAYBACK_CLASS, !!_0x264d7f);
}
function restoreSyncPlaybackChrome(_0x249f0d) {
  setSyncPlaybackChromeHidden(_0x249f0d, ![]);
}
function installSyncPlaybackChromeRestore(_0x1b6d03, _0x90dd78, {
  restoreOnEnded = !![]
} = {}) {
  if (!_0x1b6d03 || !_0x90dd78) {
    return () => {};
  }
  let _0x1d27c7 = ![];
  const _0x224e62 = restoreOnEnded ? ["pause", "ended", "error"] : ['pause', "error"];
  const _0x2f5a2f = () => {
    if (_0x1d27c7) {
      return;
    }
    _0x1d27c7 = !![];
    for (const _0x46362c of _0x224e62) {
      _0x1b6d03["removeEventListener"]?.(_0x46362c, _0x2f5a2f);
    }
    restoreSyncPlaybackChrome(_0x90dd78);
  };
  for (const _0x3a3252 of _0x224e62) {
    _0x1b6d03["addEventListener"]?.(_0x3a3252, _0x2f5a2f);
  }
  return _0x2f5a2f;
}
function isSpaceInteraction(_0x53e5c7) {
  return _0x53e5c7?.["code"] === "Space" || _0x53e5c7?.["key"] === '\x20' || _0x53e5c7?.["key"] === "Space";
}
function beginSyncVideoPlaybackSession({
  targets: _0x1a583d,
  loop = ![],
  documentObject: _0x49be61,
  windowObject: _0x3ce1f3,
  shouldStopOnPointerEvent: _0x3858fc
}) {
  const _0x33d5f6 = loop === !![];
  const _0x2eae9f = Object["freeze"]({
    'kind': 'sync-video-playback',
    'id': ++syncVideoPlaybackSessionSequence
  });
  let _0x14b0f6 = 'preparing';
  let _0x1cf430 = ![];
  let _0x112cda = _0x1a583d["filter"](_0x1e4556 => _0x1e4556["videoEl"]);
  const _0x1bafeb = new Map();
  const _0x289aeb = _0x1bbff8 => {
    const _0x440767 = _0x1bafeb["get"](_0x1bbff8) || [];
    _0x1bafeb["delete"](_0x1bbff8);
    while (_0x440767["length"] > 0x0) {
      _0x440767["pop"]()?.();
    }
  };
  const _0x22c78a = (_0x3a4785, {
    pause = ![]
  } = {}) => {
    _0x289aeb(_0x3a4785);
    releaseExternalVideoPlayback(_0x3a4785["videoEl"], _0x2eae9f);
    _0x3a4785["cleanupChrome"]?.();
    _0x3a4785["videoEl"]["loop"] = ![];
    if (pause) {
      safePause(_0x3a4785['videoEl']);
    }
    _0x112cda = _0x112cda['filter'](_0x22cd76 => _0x22cd76 !== _0x3a4785);
  };
  const _0x1cda29 = ({
    pauseTargets = !![]
  } = {}) => {
    if (_0x1cf430) {
      return ![];
    }
    _0x1cf430 = !![];
    _0x14b0f6 = 'stopped';
    const _0x3b856f = activeSyncVideoPlaybackSession === _0x5acc7c;
    if (_0x3b856f) {
      activeSyncVideoPlaybackSession = null;
    }
    _0x49be61?.["removeEventListener"]?.("pointerdown", _0x26dab2, !![]);
    _0x3ce1f3?.["removeEventListener"]?.("keydown", _0x3cb1cc, !![]);
    for (const _0x178504 of [..._0x112cda]) {
      _0x22c78a(_0x178504, {
        'pause': pauseTargets
      });
    }
    if (_0x3b856f) {
      notifySyncVideoPlaybackState();
    }
    return !![];
  };
  const _0x45d152 = (_0x38bab8, _0x3701ae, _0xaa25ca) => {
    _0x38bab8["videoEl"]["addEventListener"]?.(_0x3701ae, _0xaa25ca);
    const _0x5a5ea4 = _0x1bafeb["get"](_0x38bab8) || [];
    _0x5a5ea4["push"](() => _0x38bab8["videoEl"]["removeEventListener"]?.(_0x3701ae, _0xaa25ca));
    _0x1bafeb['set'](_0x38bab8, _0x5a5ea4);
  };
  const _0x5acc7c = {
    'owner': _0x2eae9f,
    'loop': _0x33d5f6,
    'isCurrent'() {
      return !_0x1cf430 && activeSyncVideoPlaybackSession === _0x5acc7c;
    },
    'activate'(_0x51f115) {
      if (!_0x5acc7c["isCurrent"]()) {
        return ![];
      }
      const _0x2d44f7 = new Set(_0x51f115);
      for (const _0x20431d of [..._0x112cda]) {
        if (_0x2d44f7["has"](_0x20431d)) {
          continue;
        }
        _0x22c78a(_0x20431d, {
          'pause': !![]
        });
      }
      const _0x5e7a90 = _0x33d5f6 ? 0x2 : 0x1;
      if (_0x112cda["length"] < _0x5e7a90) {
        return ![];
      }
      _0x14b0f6 = "active";
      for (const _0x570d80 of _0x112cda) {
        const _0x431fd = () => {
          if (_0x14b0f6 !== 'active' || !_0x5acc7c['isCurrent']()) {
            return;
          }
          if (_0x33d5f6) {
            _0x5acc7c["stop"]();
            return;
          }
          _0x22c78a(_0x570d80);
          if (_0x112cda["length"] === 0x0) {
            _0x1cda29({
              'pauseTargets': ![]
            });
          }
        };
        const _0x555e9c = _0x33d5f6 ? ["pause", "error"] : ["pause", "ended", 'error'];
        for (const _0x360435 of _0x555e9c) {
          _0x45d152(_0x570d80, _0x360435, _0x431fd);
        }
      }
      const _0x14159c = _0x112cda["filter"](_0x28716d => _0x28716d["videoEl"]?.["paused"] === !![] || _0x28716d["videoEl"]?.["isConnected"] === ![]);
      if (_0x33d5f6 && _0x14159c["length"] > 0x0) {
        _0x5acc7c["stop"]();
        return ![];
      }
      for (const _0x41f9b3 of _0x14159c) {
        _0x22c78a(_0x41f9b3);
      }
      if (_0x112cda['length'] === 0x0) {
        _0x1cda29({
          'pauseTargets': ![]
        });
        return ![];
      }
      return _0x5acc7c["isCurrent"]();
    },
    'stop'() {
      return _0x1cda29({
        'pauseTargets': !![]
      });
    }
  };
  const _0x26dab2 = _0x4e5cdc => {
    if (typeof _0x3858fc === "function") {
      try {
        if (_0x3858fc(_0x4e5cdc) === ![]) {
          return;
        }
      } catch {}
    }
    _0x5acc7c["stop"]();
  };
  const _0x3cb1cc = _0x58f252 => {
    if (isSpaceInteraction(_0x58f252)) {
      _0x5acc7c["stop"]();
    }
  };
  activeSyncVideoPlaybackSession = _0x5acc7c;
  for (const _0x18760a of _0x112cda) {
    claimExternalVideoPlayback(_0x18760a["videoEl"], _0x2eae9f);
  }
  _0x33d5f6 && (_0x49be61?.["addEventListener"]?.("pointerdown", _0x26dab2, !![]), _0x3ce1f3?.["addEventListener"]?.("keydown", _0x3cb1cc, !![]));
  notifySyncVideoPlaybackState();
  return _0x5acc7c;
}
export function stopActiveSyncVideoPlayback() {
  return activeSyncVideoPlaybackSession?.["stop"]?.() === !![];
}
export function stopActiveSyncVideoLoopPlayback() {
  if (activeSyncVideoPlaybackSession?.["loop"] !== !![]) {
    return ![];
  }
  return stopActiveSyncVideoPlayback();
}
function pauseOutsideTargetVideos(_0x392d0c, _0x1fef95) {
  const _0x364394 = _0x392d0c || globalThis["document"];
  if (!_0x364394 || typeof _0x364394["querySelectorAll"] !== "function") {
    return;
  }
  const _0x41a1f3 = new Set(_0x1fef95["filter"](Boolean));
  _0x364394["querySelectorAll"]('video')["forEach"](_0x1427ea => {
    if (_0x41a1f3["has"](_0x1427ea)) {
      return;
    }
    safePause(_0x1427ea);
  });
}
function waitForMetadata(_0x469395, _0x23b16b = 0x1f4) {
  if (!_0x469395 || Number(_0x469395['readyState'] || 0x0) >= 0x1) {
    return Promise["resolve"](!![]);
  }
  return new Promise(_0x312a27 => {
    let _0x178d0e = ![];
    const _0x517380 = _0x3ae717 => {
      if (_0x178d0e) {
        return;
      }
      _0x178d0e = !![];
      clearTimeout(_0x37e7b4);
      _0x469395["removeEventListener"]?.('loadedmetadata', _0x21f303);
      _0x469395["removeEventListener"]?.("loadeddata", _0x21f303);
      _0x469395['removeEventListener']?.("error", _0x44e9b2);
      _0x312a27(_0x3ae717);
    };
    const _0x21f303 = () => _0x517380(!![]);
    const _0x44e9b2 = () => _0x517380(![]);
    const _0x37e7b4 = setTimeout(() => _0x517380(![]), _0x23b16b);
    _0x469395["addEventListener"]?.('loadedmetadata', _0x21f303);
    _0x469395["addEventListener"]?.("loadeddata", _0x21f303);
    _0x469395["addEventListener"]?.('error', _0x44e9b2);
  });
}
async function ensureVideoSource(_0x1021c8, _0x5f4f1e, _0x16bf38, {
  shouldAssign: _0x3b7817
} = {}) {
  if (!_0x1021c8) {
    return ![];
  }
  if (typeof _0x3b7817 === "function" && _0x3b7817() !== !![]) {
    return ![];
  }
  const _0x1b5ba7 = getVideoCurrentSource(_0x1021c8);
  const _0x5a8fc4 = normalizeText(_0x5f4f1e);
  if (!_0x5a8fc4) {
    return !!_0x1b5ba7;
  }
  if (_0x1b5ba7 === _0x5a8fc4 || isMediaElementPlaybackSource(_0x1021c8, _0x5a8fc4)) {
    return !![];
  }
  await _0x16bf38(_0x1021c8, _0x5a8fc4, {
    'preload': 'auto',
    'warmRanges': ![],
    'load': ![],
    'shouldAssign': _0x3b7817
  });
  if (typeof _0x3b7817 === "function" && _0x3b7817() !== !![]) {
    return ![];
  }
  return !!getVideoCurrentSource(_0x1021c8);
}
async function prepareVideoForSync(_0x1aad9a, _0x33e259, _0x355423, {
  loop = ![],
  shouldContinue: _0x5d4859
} = {}) {
  safePause(_0x1aad9a);
  const _0x4a3c82 = () => typeof _0x5d4859 !== "function" || _0x5d4859() === !![];
  if (!_0x4a3c82()) {
    return ![];
  }
  const _0x1278a2 = await ensureVideoSource(_0x1aad9a, _0x33e259, _0x355423, {
    'shouldAssign': _0x5d4859
  });
  if (!_0x1278a2) {
    return ![];
  }
  await waitForMetadata(_0x1aad9a);
  if (!_0x4a3c82()) {
    return ![];
  }
  try {
    _0x1aad9a["currentTime"] = 0x0;
  } catch {}
  _0x1aad9a["loop"] = loop === !![];
  return !![];
}
export async function syncPlayVideoEntries({
  entries = [],
  root = globalThis["document"],
  showToast = globalThis["window"]?.["showToast"],
  playWithRecovery = playVideoWithRecovery,
  attachSource = attachMediaElementPlaybackSource,
  loop = ![],
  documentObject = root || globalThis["document"],
  windowObject = documentObject?.["defaultView"] || globalThis["window"],
  shouldStopOnPointerEvent: _0x8f8d96
} = {}) {
  stopActiveSyncVideoPlayback();
  const _0x5a5abc = Array["isArray"](entries) ? entries : [];
  if (_0x5a5abc["length"] < 0x2) {
    showToast?.(syncPlaybackText("fewerThanTwo"), "warn");
    return {
      'played': 0x0,
      'total': _0x5a5abc["length"],
      'missing': 0x0,
      'failed': 0x0
    };
  }
  const _0x126a64 = _0x5a5abc["map"](_0x1d8a03 => {
    const _0x2dfe31 = findWrapperForEntry(root, _0x1d8a03);
    return {
      'entry': _0x1d8a03,
      'wrapper': _0x2dfe31,
      'videoEl': findCanvasVideoElementForEntry(root, _0x1d8a03)
    };
  });
  const _0x51ea1a = _0x126a64["map"](_0x111cae => _0x111cae['videoEl'])['filter'](Boolean);
  const _0x3d870a = loop === !![];
  const _0xfa4638 = beginSyncVideoPlaybackSession({
    'targets': _0x126a64,
    'loop': _0x3d870a,
    'documentObject': documentObject,
    'windowObject': windowObject,
    'shouldStopOnPointerEvent': _0x8f8d96
  });
  const _0x18de5d = () => _0xfa4638["isCurrent"]();
  pauseOutsideTargetVideos(root, _0x51ea1a);
  let _0x54b626 = 0x0;
  let _0x5ae288 = 0x0;
  const _0x327457 = [];
  await Promise["all"](_0x126a64["map"](async _0x1cb640 => {
    const {
      entry: _0x2fa4a2,
      videoEl: _0xdc067f
    } = _0x1cb640;
    if (!_0xdc067f) {
      _0x54b626 += 0x1;
      return;
    }
    const _0x3c0701 = await prepareVideoForSync(_0xdc067f, _0x2fa4a2["source"], attachSource, {
      'loop': _0x3d870a,
      'shouldContinue': _0x18de5d
    });
    if (!_0x3c0701) {
      _0x5ae288 += 0x1;
      return;
    }
    _0x327457["push"](_0x1cb640);
  }));
  if (!_0xfa4638["isCurrent"]()) {
    return {
      'played': 0x0,
      'total': _0x5a5abc["length"],
      'missing': _0x54b626,
      'failed': _0x5ae288
    };
  }
  if (_0x327457["length"] < 0x2) {
    _0xfa4638["stop"]();
    const _0x584f63 = _0x54b626 > 0x0 ? syncPlaybackText("selectedUnmounted") : syncPlaybackText('fewerThanTwo');
    showToast?.(_0x584f63, "warn");
    return {
      'played': 0x0,
      'total': _0x5a5abc["length"],
      'missing': _0x54b626,
      'failed': _0x5ae288
    };
  }
  const _0x3ed5cd = _0x327457['map'](_0x5dec1d => {
    const {
      videoEl: _0x56e6c4,
      wrapper: _0x20a1be
    } = _0x5dec1d;
    setSyncPlaybackChromeHidden(_0x20a1be, !![]);
    const _0x29159b = installSyncPlaybackChromeRestore(_0x56e6c4, _0x20a1be, {
      'restoreOnEnded': !_0x3d870a
    });
    _0x5dec1d["cleanupChrome"] = _0x29159b;
    return _0x29159b;
  });
  const _0x509ccc = await Promise["all"](_0x327457["map"](({
    entry: _0x426047,
    videoEl: _0x27be78
  }, _0x61ea14) => playWithRecovery(_0x27be78, {
    'label': "sync-video:" + _0x426047["nodeId"] + ':' + _0x426047["videoIndex"],
    'ensureSrc': () => ensureVideoSource(_0x27be78, _0x426047['source'], attachSource, {
      'shouldAssign': _0x18de5d
    }),
    'allowConcurrent': !![],
    'shouldContinue': _0x18de5d,
    'shouldRecover': () => _0x27be78["isConnected"] !== ![] && !_0x27be78['paused']
  })['catch'](() => {
    _0x3ed5cd[_0x61ea14]?.();
    return ![];
  })));
  _0x509ccc["forEach"]((_0x3ff2c2, _0x5d3338) => {
    if (!_0x3ff2c2) {
      _0x3ed5cd[_0x5d3338]?.();
    }
  });
  const _0x1aa694 = _0x509ccc["filter"](Boolean)["length"];
  _0x5ae288 += _0x509ccc["length"] - _0x1aa694;
  if (!_0xfa4638["isCurrent"]()) {
    _0x3ed5cd['forEach'](_0x145e35 => _0x145e35?.());
    _0x327457["forEach"](({
      videoEl: _0x13e5d5
    }) => {
      _0x13e5d5["loop"] = ![];
      safePause(_0x13e5d5);
    });
    return {
      'played': 0x0,
      'total': _0x5a5abc['length'],
      'missing': _0x54b626,
      'failed': _0x5ae288
    };
  }
  if (_0x3d870a) {
    const _0xe361c = _0x327457["filter"]((_0xd58772, _0x323be3) => _0x509ccc[_0x323be3]);
    if (_0xe361c['length'] < 0x2) {
      _0xfa4638["stop"]();
      showToast?.(syncPlaybackText("fewerThanTwo"), "warn");
      return {
        'played': 0x0,
        'total': _0x5a5abc["length"],
        'missing': _0x54b626,
        'failed': _0x5ae288
      };
    }
    if (_0xfa4638["activate"](_0xe361c) !== !![]) {
      _0xfa4638["stop"]();
      return {
        'played': 0x0,
        'total': _0x5a5abc["length"],
        'missing': _0x54b626,
        'failed': _0x5ae288
      };
    }
  } else {
    const _0x5b1a98 = _0x327457["filter"]((_0x5e03c8, _0x47c677) => _0x509ccc[_0x47c677]);
    _0x5b1a98["length"] === 0x0 ? _0xfa4638["stop"]() : _0xfa4638['activate'](_0x5b1a98);
  }
  if (_0x1aa694 > 0x0) {
    showToast?.(syncPlaybackText('playedCount', {
      'count': _0x1aa694
    }), "success");
  } else {
    _0x54b626 > 0x0 ? showToast?.(syncPlaybackText("selectedUnmounted"), "warn") : showToast?.(syncPlaybackText("none"), "warn");
  }
  return {
    'played': _0x1aa694,
    'total': _0x5a5abc["length"],
    'missing': _0x54b626,
    'failed': _0x5ae288
  };
}
export function syncPlaySelectedVideos({
  selectedIds: _0x3958e0,
  state: _0x2874b1,
  root = globalThis["document"],
  showToast = globalThis['window']?.["showToast"],
  ..._0x111173
} = {}) {
  const _0x247d7f = _0x2874b1?.['nodes'] || {};
  return syncPlayVideoEntries({
    'entries': collectSelectedSyncPlayableVideoEntries(_0x247d7f, _0x3958e0),
    'root': root,
    'showToast': showToast,
    ..._0x111173
  });
}
export function syncPlayGroupVideos({
  groupId: _0x5c1b9d,
  state: _0x100027,
  root = globalThis['document'],
  showToast = globalThis["window"]?.["showToast"],
  ..._0x4dab27
} = {}) {
  const _0x5d7bb0 = _0x100027?.["nodes"] || {};
  return syncPlayVideoEntries({
    'entries': collectGroupSyncPlayableVideoEntries(_0x5d7bb0, _0x5c1b9d),
    'root': root,
    'showToast': showToast,
    ..._0x4dab27
  });
}