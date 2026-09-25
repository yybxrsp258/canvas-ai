import { loadCompletionSoundSettings } from './completionSoundService.js';
import { desktopBridge } from './desktopBridge.js';
import { t } from '../i18n/index.js';
import { ensureVideoResultThumbnail } from '../../api/videoResultThumbnailApi.js';
import { normalizeLocalPath } from '../utils/localMediaPath.js';
const IMAGE_FILE_EXTENSION_RE = /\.(?:png|jpe?g|webp|gif|bmp|avif)$/i;
const clickSubscribers = new Set();
let unsubscribeDesktopClicks = null;
export function dispatchCompletionClick(_0x2a83fe) {
  for (const _0x59e5c0 of clickSubscribers) {
    try {
      _0x59e5c0(_0x2a83fe);
    } catch (_0x110801) {
      console["warn"]('[completionNotification]\x20navigation\x20failed:', _0x110801);
    }
  }
}
function showCompletionToast(_0xc1ba10) {
  const _0x881189 = _0xc1ba10?.["navigation"];
  if (!["canvas", 'replacement-studio']['includes'](_0x881189?.["source"])) {
    return;
  }
  const _0x5290c2 = normalizeText(_0xc1ba10['nodeName'] || _0xc1ba10["node"]?.["name"] || _0xc1ba10['node']?.["title"]);
  const _0x5101b3 = normalizeText(_0xc1ba10["body"]) || (_0x5290c2 ? t("coreServices.completion.notificationNodeBody", {
    'name': _0x5290c2
  }) : t("coreServices.completion.notificationBody"));
  const _0xa33234 = {
    ..._0x881189
  };
  globalThis["window"]?.["showToast"]?.(_0x5101b3, "success", 0x2710, {
    'ariaLabel': _0x5101b3 + "，点击查看结果",
    'onClick': () => dispatchCompletionClick(_0xa33234)
  });
}
function getNotificationApi() {
  return desktopBridge['notification'];
}
function normalizeText(_0x309546) {
  return String(_0x309546 || '')["replace"](/\s+/g, '\x20')["trim"]();
}
function normalizeMediaKind(_0x60572c) {
  const _0x2d9bc1 = normalizeText(_0x60572c)["toLowerCase"]();
  if (_0x2d9bc1 === "video" || _0x2d9bc1["includes"]("video")) {
    return "video";
  }
  if (_0x2d9bc1 === "image" || _0x2d9bc1["includes"]("image")) {
    return "image";
  }
  return '';
}
function getPrimaryMediaItem(_0x2f6b87 = {}, _0x35e2b7 = '') {
  const _0x30710c = _0x35e2b7 === "video" ? "videos" : 'images';
  const _0x6a624a = _0x35e2b7 === 'video' ? "mainVideoIndex" : "mainImageIndex";
  const _0x8c0e28 = Array["isArray"](_0x2f6b87?.[_0x30710c]) ? _0x2f6b87[_0x30710c] : [];
  if (_0x8c0e28["length"] === 0x0) {
    return _0x2f6b87;
  }
  const _0x1ae178 = Math["max"](0x0, Math["trunc"](Number(_0x2f6b87?.[_0x6a624a]) || 0x0));
  const _0x22b3a5 = _0x8c0e28[_0x1ae178] || _0x8c0e28["find"](_0x43e840 => _0x43e840 && !_0x43e840["error"]);
  return _0x22b3a5 && typeof _0x22b3a5 === "object" ? {
    ..._0x2f6b87,
    ..._0x22b3a5
  } : _0x2f6b87;
}
function resolveMediaKind(_0x3e5b7b = {}, _0x58e0af = {}) {
  const _0x486f2e = [_0x3e5b7b?.['mediaKind'], _0x58e0af?.["outputType"], _0x58e0af?.["taskType"], _0x58e0af?.["type"]];
  for (const _0x42ab54 of _0x486f2e) {
    const _0x503b14 = normalizeMediaKind(_0x42ab54);
    if (_0x503b14) {
      return _0x503b14;
    }
  }
  if (Array["isArray"](_0x58e0af?.["videos"]) || normalizeText(_0x58e0af?.["videoUrl"] || _0x58e0af?.['outputVideoUrl'])) {
    return 'video';
  }
  if (Array["isArray"](_0x58e0af?.["images"]) || normalizeText(_0x58e0af?.["imageUrl"] || _0x58e0af?.["outputUrl"])) {
    return "image";
  }
  return '';
}
function resolveImageThumbnailLocalPath(_0x167be3 = {}) {
  const _0x10d787 = [_0x167be3?.["thumbLocalPath"], _0x167be3?.['thumbnailLocalPath'], _0x167be3?.['posterLocalPath'], _0x167be3?.["displayLocalPath"], _0x167be3?.['localPath'], _0x167be3?.["originalLocalPath"], _0x167be3?.["thumbUrl"], _0x167be3?.["thumbnailUrl"], _0x167be3?.["posterUrl"], _0x167be3?.["imageUrl"], _0x167be3?.["sourceUrl"], _0x167be3?.["outputUrl"]];
  for (const _0x35b0af of _0x10d787) {
    const _0x4ec5b5 = normalizeLocalPath(_0x35b0af);
    if (_0x4ec5b5 && IMAGE_FILE_EXTENSION_RE["test"](_0x4ec5b5)) {
      return _0x4ec5b5;
    }
  }
  return '';
}
export async function buildGenerationCompleteNotificationRequest(_0x47df8b = {}, {
  ensureVideoThumbnail = ensureVideoResultThumbnail
} = {}) {
  const _0x24b514 = _0x47df8b?.['node'] && typeof _0x47df8b["node"] === "object" && !Array["isArray"](_0x47df8b["node"]) ? _0x47df8b["node"] : {};
  const _0x4b6bee = normalizeText(_0x47df8b?.["nodeName"] || _0x24b514?.["name"] || _0x24b514?.["title"]);
  const _0x285602 = resolveMediaKind(_0x47df8b, _0x24b514);
  let _0x1a3bad = getPrimaryMediaItem(_0x24b514, _0x285602);
  if (_0x285602 === "video" && typeof ensureVideoThumbnail === "function") {
    try {
      _0x1a3bad = await ensureVideoThumbnail(_0x1a3bad);
    } catch {}
  }
  const _0x385784 = _0x285602 === "image" || _0x285602 === 'video' ? resolveImageThumbnailLocalPath(_0x1a3bad) : '';
  const _0x33a5ab = _0x4b6bee ? t('coreServices.completion.notificationNodeBody', {
    'name': _0x4b6bee
  }) : t("coreServices.completion.notificationBody");
  return {
    'title': normalizeText(_0x47df8b?.['title']) || "Canvas AI",
    'body': normalizeText(_0x47df8b?.["body"]) || _0x33a5ab,
    ...(_0x385784 ? {
      'thumbnailLocalPath': _0x385784
    } : {}),
    ...(_0x47df8b?.['navigation'] && typeof _0x47df8b["navigation"] === 'object' ? {
      'navigation': {
        ..._0x47df8b["navigation"]
      }
    } : {})
  };
}
export function subscribeGenerationCompleteNotificationClicks(_0x336389) {
  if (typeof _0x336389 !== "function") {
    return () => {};
  }
  clickSubscribers["add"](_0x336389);
  !unsubscribeDesktopClicks && (unsubscribeDesktopClicks = getNotificationApi()?.["onGenerationCompleteClick"]?.(dispatchCompletionClick) || (() => {}));
  return () => {
    clickSubscribers['delete'](_0x336389);
    if (clickSubscribers["size"]) {
      return;
    }
    unsubscribeDesktopClicks?.();
    unsubscribeDesktopClicks = null;
  };
}
export function showGenerationCompleteNotification(_0x432834 = {}) {
  showCompletionToast(_0x432834);
  const _0xf2f98f = getNotificationApi();
  const _0x2762c4 = _0xf2f98f?.['showGenerationComplete'];
  if (_0xf2f98f?.["isAvailable"]?.() === ![] || typeof _0x2762c4 !== "function") {
    return Promise["resolve"]({
      'success': !![],
      'shown': ![],
      'reason': "unavailable"
    });
  }
  const _0x9439e3 = (async () => {
    const _0x5d30ce = await loadCompletionSoundSettings();
    if (_0x5d30ce["notificationEnabled"] === ![]) {
      return {
        'success': !![],
        'shown': ![],
        'reason': "disabled"
      };
    }
    const _0x51a631 = await buildGenerationCompleteNotificationRequest(_0x432834);
    return _0x2762c4(_0x51a631);
  })();
  _0x9439e3 && typeof _0x9439e3["catch"] === "function" && _0x9439e3['catch'](_0x42cb2b => {
    console["warn"]("[completionNotification] show failed:", _0x42cb2b);
  });
  return _0x9439e3;
}