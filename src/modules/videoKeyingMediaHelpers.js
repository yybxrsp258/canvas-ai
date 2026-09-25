import { attachMediaElementPlaybackSource } from '../services/desktopMediaBlobSource.js';
export function getVideoElementSource(_0x5dc4dc) {
  return String(_0x5dc4dc?.["getAttribute"]?.("src") || _0x5dc4dc?.["currentSrc"] || _0x5dc4dc?.['src'] || '')["trim"]();
}
export function setVideoKeyingMediaKeepAlive(_0x184914, _0x3951f5) {
  if (!_0x184914?.['dataset']) {
    return;
  }
  if (_0x3951f5) {
    _0x184914["dataset"]["desktopMediaKeepAlive"] = "video-keying";
    return;
  }
  _0x184914["dataset"]['desktopMediaKeepAlive'] === "video-keying" && delete _0x184914["dataset"]["desktopMediaKeepAlive"];
}
export async function attachVideoKeyingPlaybackSource(_0x39ea48, _0x1d9379, _0x526059 = {}) {
  const _0x593ad8 = String(_0x1d9379 || '')['trim']();
  if (!_0x39ea48 || !_0x593ad8) {
    return ![];
  }
  await attachMediaElementPlaybackSource(_0x39ea48, _0x593ad8, {
    'preload': "metadata",
    ..._0x526059
  });
  return !!getVideoElementSource(_0x39ea48);
}