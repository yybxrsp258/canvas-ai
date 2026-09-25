import { applyUpdateFromServer, checkLocalUpdatePreviewFromServer, checkUpdateFromServer, pingUpdateCheckFromServer } from '../../api/updateApi.js';
import { getLocale, t } from '../i18n/index.js';
import { desktopBridge } from '../services/desktopBridge.js';
import { createLatestStartupVisualTaskQueue, isStartupVisualComplete, waitForStartupVisualComplete } from '../services/startupVisualReadiness.js';
import { AUTO_UPDATE_PRIMARY_ACTIONS, ensureDesktopUpdateAvailable, resolveAutoUpdatePrimaryAction } from './autoUpdatePolicy.js';
const CHECK_INTERVAL = 0x3c * 0x3c * 0x3e8;
const _NS = "http://www.w3.org/2000/svg";
let _dismissedSignature = '';
let _activeBannerInfo = null;
let _desktopUpdateInfo = null;
let _desktopUpdateUnsubscribe = null;
let _desktopUpdaterActive = ![];
let _desktopInstallAfterDownload = ![];
let _desktopBannerRequestSequence = 0x0;
const _startupBannerQueue = createLatestStartupVisualTaskQueue();
const _startupAutomaticToastQueue = createLatestStartupVisualTaskQueue();
function autoUpdateText(_0xbf3c9c, _0x1c7c9c = {}) {
  return t('autoUpdate.' + _0xbf3c9c, _0x1c7c9c);
}
function _getUpdateSignature(_0x22c41d) {
  if (!_0x22c41d || typeof _0x22c41d !== "object") {
    return '';
  }
  return [_0x22c41d["previewOnly"] ? "preview" : "update", _0x22c41d['localVersion'] || '', _0x22c41d["remoteVersion"] || '', _0x22c41d["downloadUrl"] || '', _0x22c41d['previewVideoUrl'] || '', _0x22c41d['notes'] || '']['join']('|');
}
function _removeBanner() {
  _startupBannerQueue["clear"]();
  const _0x29b56e = document['getElementById']("update-banner");
  const _0x232be5 = document["getElementById"]('update-banner-backdrop');
  _0x29b56e?.["classList"]?.["remove"]?.("open");
  _0x232be5?.['classList']?.["remove"]?.('open');
  _0x29b56e?.["remove"]?.();
  _0x232be5?.['remove']?.();
  _activeBannerInfo = null;
  document["removeEventListener"]('keydown', _handleBannerKeydown);
}
function _dismissBanner(_0x6e7db7) {
  _removeBanner();
  _dismissedSignature = _getUpdateSignature(_0x6e7db7);
}
function _handleBannerKeydown(_0x30d069) {
  if (_0x30d069['key'] !== "Escape" || !document["getElementById"]('update-banner')) {
    return;
  }
  _0x30d069["preventDefault"]();
  if (typeof _activeBannerInfo?.['closeAction'] === "function") {
    _activeBannerInfo["closeAction"](_activeBannerInfo);
    return;
  }
  _removeBanner();
}
function _createSvgIcon(_0x5a57ee, _0x417dd1 = {}) {
  const _0x433641 = document["createElementNS"](_NS, 'svg');
  if (_0x417dd1["spin"]) {
    _0x433641["classList"]["add"]("spin");
  }
  _0x433641["setAttribute"]("viewBox", "0 0 24 24");
  _0x433641["setAttribute"]("fill", "none");
  _0x433641["setAttribute"]('stroke', "currentColor");
  _0x433641["setAttribute"]("stroke-width", "2.2");
  _0x433641["setAttribute"]("stroke-linecap", "round");
  _0x433641["setAttribute"]('stroke-linejoin', "round");
  const _0x3d4b8d = document["createElementNS"](_NS, "path");
  _0x3d4b8d["setAttribute"]('d', _0x5a57ee);
  _0x433641["appendChild"](_0x3d4b8d);
  return _0x433641;
}
function _createSpinSvg(_0x4de6cc) {
  const _0xba02a4 = _createSvgIcon("M21 12a9 9 0 1 1-6.219-8.56", {
    'spin': _0x4de6cc
  });
  const _0x5a5d53 = document["createElementNS"](_NS, 'polyline');
  _0x5a5d53['setAttribute']("points", "16 3 21 3 21 8");
  _0xba02a4['appendChild'](_0x5a5d53);
  return _0xba02a4;
}
function _createDownloadSvg() {
  const _0x21eaea = document["createElementNS"](_NS, "svg");
  _0x21eaea['setAttribute']("viewBox", "0 0 24 24");
  _0x21eaea["setAttribute"]("fill", "none");
  _0x21eaea["setAttribute"]("stroke", "currentColor");
  _0x21eaea["setAttribute"]("stroke-width", '2.2');
  _0x21eaea['setAttribute']("stroke-linecap", "round");
  _0x21eaea["setAttribute"]("stroke-linejoin", 'round');
  ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", 'M12\x2015V3']["forEach"](_0x1f13b9 => {
    const _0x32dff3 = document["createElementNS"](_NS, 'path');
    _0x32dff3["setAttribute"]('d', _0x1f13b9);
    _0x21eaea["appendChild"](_0x32dff3);
  });
  return _0x21eaea;
}
function _createUpdateSvg() {
  const _0x17fbd5 = document['createElementNS'](_NS, 'svg');
  _0x17fbd5["setAttribute"]('viewBox', "0 0 24 24");
  _0x17fbd5['setAttribute']("fill", 'none');
  _0x17fbd5["setAttribute"]("stroke", "currentColor");
  _0x17fbd5['setAttribute']('stroke-width', '2.2');
  _0x17fbd5['setAttribute']("stroke-linecap", "round");
  _0x17fbd5["setAttribute"]("stroke-linejoin", "round");
  ["M12 16V4", "M7 9l5-5 5 5", "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"]["forEach"](_0x23f55c => {
    const _0x2c6111 = document["createElementNS"](_NS, "path");
    _0x2c6111['setAttribute']('d', _0x23f55c);
    _0x17fbd5['appendChild'](_0x2c6111);
  });
  return _0x17fbd5;
}
function _setBtnContent(_0x232c49, _0x24dc73, _0x31a5a4) {
  if (!_0x232c49) {
    return;
  }
  _0x232c49["replaceChildren"]();
  _0x232c49["appendChild"](_0x24dc73 ? _createSpinSvg(!![]) : _createDownloadSvg());
  _0x232c49["appendChild"](document["createTextNode"]('\x20' + _0x31a5a4));
}
function _formatPercent(_0x4ff08c) {
  const _0x2b8ac6 = Math["max"](0x0, Math["min"](0x64, Number(_0x4ff08c || 0x0)));
  return Math['round'](_0x2b8ac6) + '%';
}
function _formatBannerVersion(_0xd0c4dc) {
  return String(_0xd0c4dc || '')["trim"]()["replace"](/^[vV](?=\d)/, '');
}
function _formatPubDate(_0xec48f6) {
  if (!_0xec48f6) {
    return '';
  }
  const _0x3c923c = new Date(_0xec48f6);
  if (Number["isNaN"](_0x3c923c["getTime"]())) {
    return String(_0xec48f6);
  }
  return _0x3c923c["toLocaleString"](getLocale(), {
    'year': "numeric",
    'month': "2-digit",
    'day': "2-digit",
    'hour': "2-digit",
    'minute': "2-digit"
  });
}
function _decodeHtmlText(_0x260343) {
  const _0x5538be = String(_0x260343 || '');
  if (!_0x5538be) {
    return '';
  }
  const _0x484806 = document['createElement']("textarea");
  _0x484806["innerHTML"] = _0x5538be;
  return _0x484806['value'];
}
function _htmlNotesToText(_0x3604cb) {
  let _0x2a7bfa = String(_0x3604cb || '')["trim"]();
  if (!/<\/?[a-z][\s\S]*>/i['test'](_0x2a7bfa)) {
    return _0x2a7bfa;
  }
  _0x2a7bfa = _0x2a7bfa["replace"](/<br\s*\/?>/gi, '\x0a')["replace"](/<\/(?:p|div|h[1-6]|li|ul|ol|section|article|blockquote)>/gi, '\x0a')["replace"](/<li[^>]*>/gi, '-\x20')["replace"](/<[^>]+>/g, '');
  return _decodeHtmlText(_0x2a7bfa);
}
function _buildNotesText(_0x1d4665) {
  const _0x348786 = _htmlNotesToText(_0x1d4665)['split'](/\r?\n/)["map"](_0xdcceb7 => _0xdcceb7['trim']())['filter'](Boolean);
  if (!_0x348786["length"]) {
    return autoUpdateText("notes.empty");
  }
  return _0x348786["join"]('\x0a');
}
function _cleanNotesHeading(_0x4d02ed) {
  return String(_0x4d02ed || '')["replace"](/^[\s#*>\-•]+/, '')["replace"](/^[🎉✨🐛🔧✅⚠️📌]+\s*/u, '')["replace"](/[：:]\s*$/, '')["trim"]();
}
function _isVersionTitleLine(_0x2c1790) {
  return /^(?:🎉\s*)?v?\d+(?:\.\d+){1,3}\s*版本更新/u["test"](String(_0x2c1790 || '')["trim"]()['toLowerCase']());
}
function _isReleaseFooterLine(_0x13d5f1) {
  const _0x57d9bd = String(_0x13d5f1 || '')["trim"]();
  if (!_0x57d9bd) {
    return ![];
  }
  return /^感谢各位/u["test"](_0x57d9bd) || /^(?:Canvas AI|AI-CanvasPro)[！!]/u["test"](_0x57d9bd) || /^windows版本.*下载链接[：:]/iu['test'](_0x57d9bd) || /^注[：:]/u['test'](_0x57d9bd) || /^BUG问题/u['test'](_0x57d9bd) || /^https?:\/\//i['test'](_0x57d9bd) || /反馈文档[：:]/u["test"](_0x57d9bd);
}
function _isReleaseMetaLine(_0x5959b9) {
  return /^\[[a-zA-Z][a-zA-Z0-9_-]*\]\s*:/u['test'](String(_0x5959b9 || '')["trim"]());
}
function _parseUpdateNotes(_0x31608b) {
  const _0x384294 = _buildNotesText(_0x31608b)["split"](/\r?\n/)["map"](_0x27fed4 => _0x27fed4["trim"]())['filter'](Boolean)["filter"](_0x16ae87 => !_isVersionTitleLine(_0x16ae87))["filter"](_0x2c56bc => !_isReleaseMetaLine(_0x2c56bc));
  const _0x430faf = [];
  const _0x4d809f = [];
  const _0x397cfd = [];
  let _0x517bc8 = null;
  let _0x413f7b = ![];
  const _0x953299 = (_0x574cd9 = autoUpdateText("notes.defaultSectionTitle")) => {
    !_0x517bc8 && (_0x517bc8 = {
      'title': _0x574cd9,
      'items': [],
      'paragraphs': []
    }, _0x4d809f["push"](_0x517bc8));
    return _0x517bc8;
  };
  _0x384294['forEach'](_0x332741 => {
    if (_0x413f7b || _isReleaseFooterLine(_0x332741)) {
      _0x413f7b = !![];
      _0x397cfd['push'](_0x332741);
      return;
    }
    const _0x200450 = /^[-*•]\s+/["test"](_0x332741);
    const _0x304505 = _0x332741["replace"](/^[-*•]\s+/, '')["trim"]();
    const _0x4838d4 = _cleanNotesHeading(_0x332741);
    const _0x39239c = !_0x200450 && /[：:]$/["test"](_0x332741) && /新增|修复|优化|更新|说明|注意|已知|内容/u['test'](_0x4838d4);
    if (_0x39239c && _0x4838d4) {
      _0x517bc8 = {
        'title': _0x4838d4,
        'items': [],
        'paragraphs': []
      };
      _0x4d809f["push"](_0x517bc8);
      return;
    }
    if (!_0x517bc8 && !_0x200450) {
      _0x430faf["push"](_0x332741);
      return;
    }
    const _0x587902 = _0x953299();
    if (_0x200450 && _0x304505) {
      _0x587902["items"]["push"](_0x304505);
      return;
    }
    _0x587902["paragraphs"]["push"](_0x332741);
  });
  return {
    'intro': _0x430faf,
    'sections': _0x4d809f["length"] ? _0x4d809f : [{
      'title': autoUpdateText('notes.defaultSectionTitle'),
      'items': [autoUpdateText("notes.empty")],
      'paragraphs': []
    }],
    'footer': _0x397cfd
  };
}
export const __autoUpdateNotesForTest = Object["freeze"]({
  'parse': _parseUpdateNotes
});
function _appendTextWithLinks(_0x329d12, _0x39e8aa) {
  const _0x366acf = String(_0x39e8aa || '');
  const _0x28e4e2 = /(https?:\/\/[^\s]+)/gi;
  let _0x2cbd45 = 0x0;
  let _0x587249 = _0x28e4e2["exec"](_0x366acf);
  while (_0x587249) {
    _0x587249["index"] > _0x2cbd45 && _0x329d12["appendChild"](document["createTextNode"](_0x366acf["slice"](_0x2cbd45, _0x587249["index"])));
    const _0x151561 = _0x587249[0x0]["replace"](/[),.;，。；）]+$/u, '');
    const _0x4931b2 = _0x587249[0x0]["slice"](_0x151561["length"]);
    const _0x205f92 = document["createElement"]('a');
    _0x205f92["className"] = 'update-banner-note-link';
    _0x205f92["href"] = _0x151561;
    _0x205f92["dataset"]["externalUrl"] = _0x151561;
    _0x205f92['textContent'] = _0x151561;
    _0x329d12["appendChild"](_0x205f92);
    if (_0x4931b2) {
      _0x329d12["appendChild"](document["createTextNode"](_0x4931b2));
    }
    _0x2cbd45 = _0x587249["index"] + _0x587249[0x0]["length"];
    _0x587249 = _0x28e4e2["exec"](_0x366acf);
  }
  _0x2cbd45 < _0x366acf["length"] && _0x329d12["appendChild"](document["createTextNode"](_0x366acf['slice'](_0x2cbd45)));
}
function _createNotesPanel(_0x5e0548) {
  const _0x200098 = _parseUpdateNotes(_0x5e0548);
  const _0x4ed0e5 = document["createElement"]("div");
  _0x4ed0e5["className"] = 'update-banner-notes';
  _0x4ed0e5['id'] = 'update-banner-notes';
  const _0x17e62b = document["createElement"]("div");
  _0x17e62b["className"] = "update-banner-section-title";
  _0x17e62b['textContent'] = autoUpdateText("notes.defaultSectionTitle");
  const _0xc6e7f7 = document["createElement"]("div");
  _0xc6e7f7["className"] = "update-banner-notes-scroll";
  if (_0x200098['intro']["length"]) {
    const _0x146a8c = document["createElement"]("div");
    _0x146a8c["className"] = "update-banner-note-intro";
    _0x200098["intro"]["forEach"](_0x1431ba => {
      const _0x2d4963 = document['createElement']('p');
      _0x2d4963['className'] = 'update-banner-note-paragraph';
      _appendTextWithLinks(_0x2d4963, _0x1431ba);
      _0x146a8c["appendChild"](_0x2d4963);
    });
    _0xc6e7f7["appendChild"](_0x146a8c);
  }
  _0x200098["sections"]["forEach"](_0x248fe4 => {
    const _0x58be40 = document["createElement"]('section');
    _0x58be40["className"] = "update-banner-note-section";
    const _0x552210 = document['createElement']("div");
    _0x552210["className"] = 'update-banner-note-heading';
    _0x552210["textContent"] = _0x248fe4["title"];
    _0x58be40["appendChild"](_0x552210);
    _0x248fe4["paragraphs"]["forEach"](_0x2f85a7 => {
      const _0x4f8dba = document["createElement"]('p');
      _0x4f8dba["className"] = 'update-banner-note-paragraph';
      _appendTextWithLinks(_0x4f8dba, _0x2f85a7);
      _0x58be40['appendChild'](_0x4f8dba);
    });
    if (_0x248fe4['items']["length"]) {
      const _0x1f75e2 = document['createElement']('ul');
      _0x1f75e2['className'] = "update-banner-note-list";
      _0x248fe4['items']["forEach"](_0x5dcaa0 => {
        const _0x34d6bc = document["createElement"]('li');
        _appendTextWithLinks(_0x34d6bc, _0x5dcaa0);
        _0x1f75e2['appendChild'](_0x34d6bc);
      });
      _0x58be40["appendChild"](_0x1f75e2);
    }
    _0xc6e7f7["appendChild"](_0x58be40);
  });
  if (_0x200098["footer"]["length"]) {
    const _0x4d81be = document["createElement"]("section");
    _0x4d81be["className"] = 'update-banner-note-footer';
    const _0x2516d0 = document["createElement"]('div');
    _0x2516d0["className"] = "update-banner-note-footer-title";
    _0x2516d0["textContent"] = autoUpdateText("notes.releaseFooterTitle");
    _0x4d81be["appendChild"](_0x2516d0);
    _0x200098["footer"]["forEach"](_0x995631 => {
      const _0x4e05de = document["createElement"]('p');
      _0x4e05de["className"] = "update-banner-note-paragraph";
      _appendTextWithLinks(_0x4e05de, _0x995631);
      _0x4d81be['appendChild'](_0x4e05de);
    });
    _0xc6e7f7["appendChild"](_0x4d81be);
  }
  _0x4ed0e5['appendChild'](_0x17e62b);
  _0x4ed0e5["appendChild"](_0xc6e7f7);
  return _0x4ed0e5;
}
function _normalizeHttpUrl(_0x44a3a2) {
  const _0x1eb7fb = String(_0x44a3a2 || '')["trim"]();
  if (!_0x1eb7fb) {
    return '';
  }
  const _0x14fdce = _0x1eb7fb["startsWith"]('//') ? 'https:' + _0x1eb7fb : _0x1eb7fb;
  if (!/^https?:\/\//i["test"](_0x14fdce)) {
    return '';
  }
  try {
    const _0x1fbf4c = new URL(_0x14fdce);
    if (_0x1fbf4c["protocol"] !== 'http:' && _0x1fbf4c["protocol"] !== "https:") {
      return '';
    }
    return _0x1fbf4c["toString"]();
  } catch (_0x21d148) {
    return '';
  }
}
function _isDirectVideoUrl(_0x295a05) {
  try {
    return /\.(mp4|webm|ogg|m4v|mov)$/i["test"](new URL(_0x295a05)["pathname"]);
  } catch (_0x3ec0fc) {
    return ![];
  }
}
function _isBilibiliHost(_0x576930) {
  const _0x35d8bb = String(_0x576930 || '')["toLowerCase"]();
  return _0x35d8bb === 'bilibili.com' || _0x35d8bb["endsWith"](".bilibili.com");
}
function _buildBilibiliPlayerUrl(_0x4f0e3b) {
  try {
    const _0x2aaf85 = new URL(_0x4f0e3b);
    if (!_isBilibiliHost(_0x2aaf85["hostname"])) {
      return '';
    }
    if (_0x2aaf85["hostname"]["toLowerCase"]() === "player.bilibili.com") {
      _0x2aaf85['searchParams']["set"]('autoplay', '0');
      return _0x2aaf85["toString"]();
    }
    const _0x4a0e82 = _0x2aaf85["pathname"]["match"](/\/video\/(BV[a-zA-Z0-9]+)/);
    const _0xbfe26d = _0x2aaf85["pathname"]["match"](/\/video\/av(\d+)/i);
    if (!_0x4a0e82 && !_0xbfe26d) {
      return '';
    }
    const _0x1887a4 = new URL("https://player.bilibili.com/player.html");
    _0x4a0e82 ? _0x1887a4['searchParams']["set"]('bvid', _0x4a0e82[0x1]) : _0x1887a4["searchParams"]['set']("aid", _0xbfe26d[0x1]);
    _0x1887a4["searchParams"]['set']('page', _0x2aaf85["searchParams"]["get"]('p') || '1');
    _0x1887a4['searchParams']["set"]("autoplay", '0');
    return _0x1887a4["toString"]();
  } catch (_0x5699f4) {
    return '';
  }
}
function _createPreviewVideo(_0x1061d9) {
  const _0x320183 = _normalizeHttpUrl(_0x1061d9?.["previewVideoUrl"] || _0x1061d9?.["preview_video_url"]);
  if (!_0x320183) {
    return null;
  }
  const _0x55c89c = document["createElement"]("div");
  _0x55c89c["className"] = "update-banner-video-wrap";
  const _0x1fa898 = document["createElement"]("div");
  _0x1fa898["className"] = "update-banner-video-shell";
  if (_isDirectVideoUrl(_0x320183)) {
    const _0x40962f = document["createElement"]("video");
    _0x40962f["className"] = "update-banner-video";
    _0x40962f['controls'] = !![];
    _0x40962f['playsInline'] = !![];
    _0x40962f["preload"] = "metadata";
    _0x40962f["src"] = _0x320183;
    _0x1fa898["appendChild"](_0x40962f);
    _0x55c89c["appendChild"](_0x1fa898);
    return _0x55c89c;
  }
  const _0x1d6e72 = document["createElement"]('iframe');
  _0x1d6e72["className"] = "update-banner-video-frame";
  _0x1d6e72["src"] = _buildBilibiliPlayerUrl(_0x320183) || _0x320183;
  _0x1d6e72['loading'] = "lazy";
  _0x1d6e72["allow"] = "autoplay; fullscreen; picture-in-picture";
  _0x1d6e72["allowFullscreen"] = !![];
  _0x1d6e72["referrerPolicy"] = "no-referrer-when-downgrade";
  _0x1fa898["appendChild"](_0x1d6e72);
  _0x55c89c["appendChild"](_0x1fa898);
  return _0x55c89c;
}
function _createTutorialVideoList(_0xbe8104) {
  const _0x4abda1 = Array["isArray"](_0xbe8104) ? _0xbe8104 : [];
  const _0x1b5488 = _0x4abda1["map"](_0x1bf603 => ({
    'title': String(_0x1bf603?.["title"] || '')["trim"](),
    'url': String(_0x1bf603?.["url"] || '')['trim']()
  }))["filter"](_0x84d60b => _0x84d60b["title"] && _normalizeHttpUrl(_0x84d60b["url"]));
  if (!_0x1b5488['length']) {
    return null;
  }
  const _0x1ef9f6 = document['createElement']("div");
  _0x1ef9f6["className"] = 'update-banner-video-list';
  _0x1b5488["forEach"](_0x13ffa0 => {
    const _0x4b4618 = document['createElement']("section");
    _0x4b4618["className"] = "update-banner-video-item";
    const _0x2697cb = document['createElement']("div");
    _0x2697cb["className"] = "update-banner-video-item-title";
    _0x2697cb["textContent"] = _0x13ffa0["title"];
    const _0xad24dd = _createPreviewVideo({
      'previewVideoUrl': _0x13ffa0['url']
    });
    _0x4b4618["appendChild"](_0x2697cb);
    if (_0xad24dd) {
      _0x4b4618['appendChild'](_0xad24dd);
    }
    _0x1ef9f6['appendChild'](_0x4b4618);
  });
  return _0x1ef9f6;
}
function _createTutorialLinkList(_0xc66f6a) {
  const _0x197548 = Array["isArray"](_0xc66f6a) ? _0xc66f6a : [];
  const _0x33fab1 = _0x197548["map"](_0x895a50 => ({
    'title': String(_0x895a50?.["title"] || '')['trim'](),
    'url': _normalizeHttpUrl(_0x895a50?.["url"])
  }))["filter"](_0x10e9f7 => _0x10e9f7['title'] && _0x10e9f7["url"]);
  if (!_0x33fab1["length"]) {
    return null;
  }
  const _0x57c494 = document["createElement"]("div");
  _0x57c494["className"] = "update-banner-tutorial-links";
  _0x33fab1["forEach"](_0xa0fe18 => {
    const _0x1f5f15 = document["createElement"]('div');
    _0x1f5f15["className"] = 'update-banner-tutorial-link';
    const _0x5dc55b = document['createElement']("span");
    _0x5dc55b['className'] = "update-banner-tutorial-link-label";
    _0x5dc55b["textContent"] = autoUpdateText("tutorial.linkLabel", {
      'title': _0xa0fe18["title"]
    });
    const _0x5b2d22 = document["createElement"]('a');
    _0x5b2d22['className'] = "update-banner-note-link";
    _0x5b2d22["href"] = _0xa0fe18['url'];
    _0x5b2d22["dataset"]["externalUrl"] = _0xa0fe18["url"];
    _0x5b2d22["textContent"] = _0xa0fe18["url"];
    _0x1f5f15['appendChild'](_0x5dc55b);
    _0x1f5f15['appendChild'](_0x5b2d22);
    _0x57c494["appendChild"](_0x1f5f15);
  });
  return _0x57c494;
}
function _isDesktopProgramUpdateAvailable(_0x38f77a = {}) {
  return _0x38f77a['desktopUpdaterUnavailable'] !== !![] && desktopBridge["app"]["isAvailable"]();
}
function _setProgramUpdateFallback(_0x5a4ca3, _0x543820) {
  const _0x255117 = document["getElementById"]("update-banner-btn");
  const _0x4376ee = document['getElementById']("update-banner-sub");
  _0x4376ee && _0x543820 && (_0x4376ee['hidden'] = ![], _0x4376ee["textContent"] = _0x543820, _0x4376ee['classList']["add"]('is-error'));
  _0x255117?.["classList"]?.['remove']?.("is-download");
  if (!_0x255117) {
    return;
  }
  const _0x728e07 = _isDesktopProgramUpdateAvailable(_0x5a4ca3);
  _setBtnContent(_0x255117, ![], _0x728e07 ? autoUpdateText("buttons.downloadInstall") : autoUpdateText("buttons.programUpdateUnavailable"));
  _0x255117["disabled"] = !_0x728e07;
  _0x255117['onclick'] = _0x728e07 ? () => _downloadDesktopUpdate(_0x255117, {
    'ensureAvailable': !![]
  }) : null;
}
function _setUpdateProgress(_0x4363fd, _0x5b6eff = '') {
  const _0x2d61c0 = document["getElementById"]("update-banner-progress");
  const _0x3f7736 = document["getElementById"]("update-banner-progress-bar");
  const _0x5b1428 = document['getElementById']("update-banner-progress-text");
  if (!_0x2d61c0 || !_0x3f7736 || !_0x5b1428) {
    return;
  }
  const _0x4406ef = _formatPercent(_0x4363fd);
  _0x2d61c0['hidden'] = ![];
  _0x3f7736["style"]["width"] = _0x4406ef;
  _0x5b1428["textContent"] = _0x5b6eff || autoUpdateText("progress.downloading", {
    'percent': _0x4406ef
  });
}
function _setDesktopDownloadInPlace(_0x4025f8 = {}, {
  retrying = ![]
} = {}) {
  const _0x527cea = document['getElementById']("update-banner");
  if (!_0x527cea) {
    return ![];
  }
  const _0x13621a = document["getElementById"]("update-banner-sub");
  const _0x3bc659 = document["getElementById"]('update-banner-btn');
  const _0x20ad17 = document["getElementById"]("update-banner-close");
  const _0x4baf40 = document["getElementById"]('update-banner-cancel');
  const _0x187371 = Number(_0x4025f8["retryCount"] || 0x0);
  const _0x2c293c = retrying ? autoUpdateText("progress.retrying", {
    'count': _0x187371
  }) : autoUpdateText("progress.downloading", {
    'percent': '0%'
  });
  _0x13621a && (_0x13621a["hidden"] = ![], _0x13621a['classList']['remove']("is-error"), _0x13621a["textContent"] = retrying ? autoUpdateText('status.autoRetry') : autoUpdateText("status.downloadingAutoInstall"));
  _setUpdateProgress(0x0, _0x2c293c);
  _setBtnContent(_0x3bc659, !![], retrying ? autoUpdateText('buttons.retrying') : autoUpdateText("buttons.downloading"));
  if (_0x3bc659) {
    _0x3bc659["disabled"] = !![];
  }
  if (_0x4baf40) {
    _0x4baf40["onclick"] = _cancelDesktopUpdateDownload;
  }
  _0x20ad17 && (_0x20ad17["disabled"] = ![], _0x20ad17["onclick"] = _cancelDesktopUpdateDownload);
  _activeBannerInfo = {
    ...(_activeBannerInfo || {}),
    'closeAction': _cancelDesktopUpdateDownload
  };
  return !![];
}
function _showBanner(_0x1dff50, _0x5e2aba = {}) {
  if (_startupBannerQueue['defer'](() => _showBanner(_0x1dff50, _0x5e2aba))) {
    return;
  }
  if (_0x5e2aba["replace"]) {
    _removeBanner();
  }
  if (!_0x5e2aba["ignoreDismissed"] && _dismissedSignature === _getUpdateSignature(_0x1dff50)) {
    return;
  }
  if (document["getElementById"]('update-banner')) {
    return;
  }
  const _0x52e9f1 = _0x1dff50["hasUpdate"] !== ![];
  const _0x6c1b93 = _formatBannerVersion(_0x1dff50["remoteVersion"] || autoUpdateText("versions.newVersion"));
  const _0x589248 = _formatBannerVersion(_0x1dff50["localVersion"] || autoUpdateText("versions.currentVersion"));
  const _0xaf91a0 = _formatPubDate(_0x1dff50["pubDate"]);
  const _0x7b2464 = Boolean(_0x1dff50['previewOnly']);
  const _0x54e289 = document["createElement"]("div");
  _0x54e289['id'] = "update-banner";
  _0x54e289["className"] = "update-banner";
  const _0xfbef04 = document["createElement"]("div");
  _0xfbef04['id'] = 'update-banner-backdrop';
  _0xfbef04["className"] = "update-banner-backdrop";
  _0xfbef04["setAttribute"]("aria-hidden", "true");
  const _0x48233b = document["createElement"]("div");
  _0x48233b["className"] = "update-banner-header";
  const _0x2d4df2 = document["createElement"]("span");
  _0x2d4df2["className"] = "update-banner-icon";
  _0x2d4df2["setAttribute"]("aria-hidden", "true");
  _0x2d4df2["appendChild"](_createUpdateSvg());
  const _0x31ba8d = document["createElement"]("div");
  _0x31ba8d["className"] = "update-banner-header-title";
  if (_0x1dff50["titleText"]) {
    _0x31ba8d["textContent"] = _0x1dff50["titleText"];
  } else {
    const _0x2a8876 = document["createElement"]("span");
    _0x2a8876['textContent'] = autoUpdateText("banner.versionUpdateTitle", {
      'version': _0x6c1b93
    });
    _0x31ba8d['appendChild'](_0x2a8876);
    if (_0x589248) {
      const _0x862ec5 = document["createElement"]("span");
      _0x862ec5["className"] = "update-banner-header-current";
      _0x862ec5["textContent"] = autoUpdateText("banner.currentVersionSuffix", {
        'version': _0x589248
      });
      _0x31ba8d["appendChild"](_0x862ec5);
    }
  }
  const _0x1702f4 = document["createElement"]("button");
  _0x1702f4['type'] = 'button';
  _0x1702f4["className"] = 'update-banner-close';
  _0x1702f4['id'] = "update-banner-close";
  _0x1702f4['setAttribute']("aria-label", autoUpdateText("banner.closeAria"));
  _0x1702f4["title"] = autoUpdateText("buttons.close");
  _0x1702f4["textContent"] = '×';
  _0x48233b["appendChild"](_0x2d4df2);
  _0x48233b["appendChild"](_0x31ba8d);
  _0x48233b['appendChild'](_0x1702f4);
  const _0x161463 = document["createElement"]('div');
  _0x161463["className"] = "update-banner-text";
  const _0x26e3eb = document["createElement"]('div');
  _0x26e3eb["className"] = "update-banner-sub";
  _0x26e3eb['id'] = "update-banner-sub";
  const _0x534662 = _0x7b2464 ? '' : _0xaf91a0 ? autoUpdateText('banner.subtitleWithDate', {
    'localVersion': _0x589248,
    'pubDate': _0xaf91a0
  }) : _0x52e9f1 ? '' : autoUpdateText("banner.subtitleNoUpdate", {
    'localVersion': _0x589248,
    'remoteVersion': _0x6c1b93
  });
  const _0x3fb92b = _0x1dff50['subtitleText'] || _0x534662;
  _0x26e3eb["textContent"] = _0x3fb92b;
  _0x26e3eb["hidden"] = !_0x3fb92b;
  const _0x1c31dd = document["createElement"]('div');
  _0x1c31dd["className"] = 'update-banner-progress';
  _0x1c31dd['id'] = 'update-banner-progress';
  _0x1c31dd["hidden"] = !_0x1dff50["showProgress"];
  const _0x1852d9 = document["createElement"]("div");
  _0x1852d9["className"] = 'update-banner-progress-track';
  const _0x136059 = document["createElement"]("div");
  _0x136059['className'] = "update-banner-progress-bar";
  _0x136059['id'] = "update-banner-progress-bar";
  _0x136059["style"]["width"] = _formatPercent(_0x1dff50["progressPercent"]);
  const _0x5c353c = document["createElement"]("div");
  _0x5c353c["className"] = "update-banner-progress-text";
  _0x5c353c['id'] = "update-banner-progress-text";
  _0x5c353c["textContent"] = _0x1dff50["progressText"] || autoUpdateText("progress.downloading", {
    'percent': _formatPercent(_0x1dff50["progressPercent"])
  });
  _0x1852d9["appendChild"](_0x136059);
  _0x1c31dd['appendChild'](_0x1852d9);
  _0x1c31dd['appendChild'](_0x5c353c);
  const _0x2ba8b8 = _createNotesPanel(_0x1dff50["notes"]);
  const _0x4c4d41 = _createPreviewVideo(_0x1dff50);
  const _0x5e2935 = _createTutorialLinkList(_0x1dff50["tutorialLinks"]);
  const _0x10ae07 = _createTutorialVideoList(_0x1dff50['tutorialVideos']);
  if (_0x5e2935) {
    _0x161463["appendChild"](_0x5e2935);
  }
  if (!_0x1dff50["hideSubtitle"]) {
    _0x161463['appendChild'](_0x26e3eb);
  }
  _0x161463["appendChild"](_0x1c31dd);
  if (_0x4c4d41) {
    _0x161463["appendChild"](_0x4c4d41);
  }
  if (_0x10ae07) {
    _0x161463["appendChild"](_0x10ae07);
  }
  if (!_0x1dff50['hideNotes']) {
    _0x161463['appendChild'](_0x2ba8b8);
  }
  const _0x404a85 = document["createElement"]("div");
  _0x404a85["className"] = "update-banner-actions";
  if ((_0x52e9f1 || _0x7b2464) && !_0x1dff50["hideCancelButton"]) {
    const _0x279615 = document["createElement"]("button");
    _0x279615['type'] = "button";
    _0x279615['className'] = "update-banner-btn update-banner-btn-secondary";
    _0x279615['id'] = "update-banner-cancel";
    _0x279615['textContent'] = _0x1dff50['cancelText'] || (_0x7b2464 ? autoUpdateText("buttons.close") : autoUpdateText('buttons.cancel'));
    _0x279615["onclick"] = () => {
      if (typeof _0x1dff50["cancelAction"] === 'function') {
        _0x1dff50["cancelAction"](_0x1dff50);
        return;
      }
      _removeBanner();
    };
    _0x404a85['appendChild'](_0x279615);
  }
  if (!_0x7b2464 && _0x52e9f1 && !_0x1dff50['disableSkip']) {
    const _0xe1b6c9 = document["createElement"]("button");
    _0xe1b6c9["type"] = "button";
    _0xe1b6c9["className"] = 'update-banner-btn\x20update-banner-btn-secondary';
    _0xe1b6c9["textContent"] = autoUpdateText("buttons.skipVersion");
    _0xe1b6c9["onclick"] = () => _dismissBanner(_0x1dff50);
    _0x404a85["appendChild"](_0xe1b6c9);
  }
  const _0x394112 = document["createElement"]("button");
  _0x394112["type"] = "button";
  _0x394112['className'] = 'update-banner-btn';
  _0x394112['id'] = "update-banner-btn";
  const _0x4cb8ac = resolveAutoUpdatePrimaryAction(_0x1dff50, {
    'desktopUpdaterAvailable': _isDesktopProgramUpdateAvailable(_0x1dff50)
  });
  if (_0x7b2464) {
    _0x394112["classList"]["add"]("is-primary");
    _setBtnContent(_0x394112, ![], _0x1dff50['previewCloseText'] || autoUpdateText("buttons.gotIt"));
    _0x394112["onclick"] = () => _removeBanner();
  } else {
    if (_0x4cb8ac === AUTO_UPDATE_PRIMARY_ACTIONS['INSTALL_DESKTOP']) {
      _0x394112["classList"]["add"]("is-primary");
      _setBtnContent(_0x394112, ![], autoUpdateText('buttons.restartInstall'));
      _0x394112["onclick"] = () => _installDownloadedDesktopUpdate(_0x394112);
    } else {
      if (_0x4cb8ac === AUTO_UPDATE_PRIMARY_ACTIONS["RETRY_DESKTOP"]) {
        _0x394112["classList"]["add"]("is-primary");
        _setBtnContent(_0x394112, ![], autoUpdateText('buttons.retryDownloadInstall'));
        _0x394112["onclick"] = () => _downloadDesktopUpdate(_0x394112);
      } else {
        if (_0x4cb8ac === AUTO_UPDATE_PRIMARY_ACTIONS["DOWNLOAD_DESKTOP"]) {
          _0x394112["classList"]['add']('is-primary');
          _setBtnContent(_0x394112, ![], autoUpdateText("buttons.downloadInstall"));
          _0x394112["onclick"] = () => _downloadDesktopUpdate(_0x394112, {
            'ensureAvailable': !_0x1dff50['startDesktopDownload']
          });
        } else {
          if (_0x4cb8ac === AUTO_UPDATE_PRIMARY_ACTIONS["HOT_APPLY"]) {
            _0x394112["classList"]["add"]("is-primary");
            _setBtnContent(_0x394112, ![], autoUpdateText("buttons.updateNow"));
            _0x394112["onclick"] = () => _doApply(_0x1dff50);
          } else {
            _0x4cb8ac === AUTO_UPDATE_PRIMARY_ACTIONS["CLOSE"] ? (_0x394112["classList"]["add"]("is-primary"), _setBtnContent(_0x394112, ![], autoUpdateText("buttons.gotIt")), _0x394112["onclick"] = () => _removeBanner()) : (_setBtnContent(_0x394112, ![], autoUpdateText("buttons.programUpdateUnavailable")), _0x394112["disabled"] = !![]);
          }
        }
      }
    }
  }
  _0x404a85["appendChild"](_0x394112);
  _0x54e289["appendChild"](_0x48233b);
  _0x54e289['appendChild'](_0x161463);
  _0x54e289["appendChild"](_0x404a85);
  document["body"]["appendChild"](_0xfbef04);
  document["body"]['appendChild'](_0x54e289);
  _0xfbef04["classList"]["add"]('open');
  _0x54e289['classList']["add"]('open');
  _activeBannerInfo = _0x1dff50;
  document['addEventListener']("keydown", _handleBannerKeydown);
  _0x1702f4['onclick'] = () => {
    if (typeof _0x1dff50["closeAction"] === "function") {
      _0x1dff50["closeAction"](_0x1dff50);
      return;
    }
    _removeBanner();
  };
}
async function _cancelDesktopUpdateDownload() {
  const _0x3b6110 = desktopBridge["app"];
  _desktopInstallAfterDownload = ![];
  _removeBanner();
  if (!_0x3b6110['isAvailable']()) {
    return;
  }
  try {
    const _0x586c9c = await _0x3b6110["cancelUpdateDownload"]();
    if (_0x586c9c?.['ok'] === ![]) {
      window["showToast"]?.(autoUpdateText("toasts.cancelDownloadFailed"), "error");
      return;
    }
    _0x586c9c?.['cancelled'] !== ![] && window['showToast']?.(autoUpdateText("toasts.downloadCancelled"));
  } catch (_0x3c573a) {
    window["showToast"]?.(autoUpdateText("toasts.cancelDownloadFailed"), "error");
  }
}
async function _downloadDesktopUpdate(_0x3a9d16, {
  ensureAvailable = ![]
} = {}) {
  const _0x5f3649 = desktopBridge["app"];
  if (!_0x5f3649["isAvailable"]()) {
    return;
  }
  _setBtnContent(_0x3a9d16, !![], autoUpdateText("buttons.preparingDownload"));
  _0x3a9d16['disabled'] = !![];
  _desktopInstallAfterDownload = !![];
  try {
    if (ensureAvailable) {
      const _0x5447fc = await ensureDesktopUpdateAvailable(_0x5f3649);
      if (_0x5447fc?.["state"] === "downloaded") {
        await _installDownloadedDesktopUpdate(_0x3a9d16);
        return;
      }
    }
    const _0x5a19b8 = await _0x5f3649["downloadUpdate"]();
    if (_0x5a19b8?.['ok'] === ![] && !_0x5a19b8?.["cancelled"]) {
      throw new Error("desktop update download failed");
    }
  } catch (_0x3acec8) {
    _desktopInstallAfterDownload = ![];
    _0x3a9d16["disabled"] = ![];
    _setBtnContent(_0x3a9d16, ![], autoUpdateText("buttons.downloadInstall"));
    window["showToast"]?.(autoUpdateText("toasts.programUpdateFailed"), 'error');
  }
}
async function _installDownloadedDesktopUpdate(_0x39afe7) {
  const _0x3ec080 = desktopBridge["app"];
  if (!_0x3ec080["isAvailable"]()) {
    return;
  }
  _setBtnContent(_0x39afe7, !![], autoUpdateText("buttons.restarting"));
  if (_0x39afe7) {
    _0x39afe7["disabled"] = !![];
  }
  try {
    await _0x3ec080["installDownloadedUpdate"]();
  } catch (_0x1e3a91) {
    if (_0x39afe7) {
      _0x39afe7['disabled'] = ![];
    }
    _setBtnContent(_0x39afe7, ![], autoUpdateText("buttons.restartInstall"));
    window["showToast"]?.(autoUpdateText("toasts.restartInstallFailed"));
  }
}
async function _doApply(_0x5906ca) {
  if (_0x5906ca?.["previewOnly"]) {
    window["showToast"]?.(autoUpdateText("toasts.previewOnly"));
    return;
  }
  if (!_0x5906ca?.["canHotApply"]) {
    _setProgramUpdateFallback(_0x5906ca, autoUpdateText('errors.programUpdateRequired'));
    return;
  }
  const _0x844fe2 = document["getElementById"]("update-banner-btn");
  const _0x376c30 = document["getElementById"]("update-banner-sub");
  _0x376c30?.['classList']?.["remove"]?.("is-error");
  _0x844fe2?.['classList']?.["remove"]?.("is-download");
  _setBtnContent(_0x844fe2, !![], autoUpdateText("buttons.updating"));
  if (_0x844fe2) {
    _0x844fe2["disabled"] = !![];
  }
  try {
    const _0x518cf7 = await applyUpdateFromServer();
    if (_0x518cf7["success"]) {
      _setBtnContent(_0x844fe2, !![], autoUpdateText("buttons.restartingWait"));
      const _0xafdc36 = Date['now']() + 0x7530;
      const _0x44f0b8 = async () => {
        if (Date["now"]() > _0xafdc36) {
          location["reload"]();
          return;
        }
        try {
          const _0x1129b8 = await pingUpdateCheckFromServer();
          if (_0x1129b8) {
            location["reload"]();
            return;
          }
        } catch (_0x4a6e91) {}
        setTimeout(_0x44f0b8, 0x320);
      };
      setTimeout(_0x44f0b8, 0x7d0);
      return;
    }
    _setProgramUpdateFallback(_0x5906ca, autoUpdateText("errors.hotApplyFailed", {
      'error': _0x518cf7['error'] || autoUpdateText("errors.unknownProgramUpdate")
    }));
  } catch (_0x1de8a8) {
    _setProgramUpdateFallback(_0x5906ca, autoUpdateText("errors.networkProgramUpdate"));
  }
}
async function _checkUpdate() {
  if (desktopBridge["isElectron"] || _desktopUpdaterActive) {
    return;
  }
  try {
    const _0x2480a8 = await checkUpdateFromServer();
    if (_0x2480a8?.['hasUpdate']) {
      _showBanner(_0x2480a8);
    }
  } catch (_0x33c155) {}
}
function _normalizeDesktopUpdateInfo(_0x5c00b5) {
  const _0x5dcf1f = _0x5c00b5 && typeof _0x5c00b5 === "object" ? _0x5c00b5 : {};
  return {
    'version': String(_0x5dcf1f["version"] || '')["trim"](),
    'releaseDate': _0x5dcf1f['releaseDate'] || '',
    'releaseNotes': String(_0x5dcf1f["releaseNotes"] || '')["trim"](),
    'previewVideoUrl': String(_0x5dcf1f["previewVideoUrl"] || _0x5dcf1f['preview_video_url'] || '')["trim"]()
  };
}
function _formatDesktopRemoteVersion(_0xd9a678) {
  const _0x52bfbc = String(_0xd9a678 || '')["trim"]();
  if (!_0x52bfbc || _0x52bfbc === autoUpdateText("versions.newVersion")) {
    return autoUpdateText("versions.newVersion");
  }
  return _0x52bfbc["startsWith"]('V') ? _0x52bfbc : 'V' + _0x52bfbc;
}
function _getPageLocalVersion() {
  const _0x495027 = document["querySelector"]('meta[name=\x22app-version\x22]')?.['getAttribute']("content");
  return String(_0x495027 || '')["trim"]();
}
function _isRemoteVersionNewer(_0x91265d, _0x352ff5, _0x28931b = ![]) {
  const _0x3ca5e8 = _0x3dd4a1 => String(_0x3dd4a1 || '')["replace"](/^[vV]/, '')['match'](/\d+/g)?.["map"](Number) || [];
  const _0x4c9175 = _0x3ca5e8(_0x91265d);
  const _0x5a2326 = _0x3ca5e8(_0x352ff5);
  if (!_0x4c9175['length'] || !_0x5a2326["length"]) {
    return Boolean(_0x28931b);
  }
  const _0x1e9907 = Math["max"](_0x4c9175["length"], _0x5a2326["length"]);
  for (let _0x40e5f7 = 0x0; _0x40e5f7 < _0x1e9907; _0x40e5f7 += 0x1) {
    const _0x11f32c = _0x4c9175[_0x40e5f7] || 0x0;
    const _0x20f443 = _0x5a2326[_0x40e5f7] || 0x0;
    if (_0x20f443 !== _0x11f32c) {
      return _0x20f443 > _0x11f32c;
    }
  }
  return ![];
}
async function _getDesktopLocalVersion() {
  try {
    const _0x418612 = await desktopBridge["app"]["getAppVersion"]();
    return _0x418612 ? 'V' + _0x418612 : autoUpdateText("versions.unknownVersion");
  } catch (_0x46999f) {
    return autoUpdateText("versions.unknownVersion");
  }
}
async function _showManualUpdateResult(_0x2099a5 = {}, _0x381e30 = '') {
  const _0x113b83 = _0x2099a5 && typeof _0x2099a5 === 'object' ? _0x2099a5 : {};
  const _0x17f900 = _normalizeDesktopUpdateInfo(_0x113b83);
  const _0x249d0b = _getPageLocalVersion() || _0x113b83["localVersion"] || (await _getDesktopLocalVersion());
  const _0xfcea3f = _0x113b83["remoteVersion"] || (_0x17f900["version"] ? _formatDesktopRemoteVersion(_0x17f900['version']) : autoUpdateText("versions.unknownVersion"));
  _showBanner({
    ..._0x113b83,
    'hasUpdate': ![],
    'previewOnly': ![],
    'localVersion': _0x249d0b,
    'remoteVersion': _0xfcea3f,
    'pubDate': _0x113b83['pubDate'] || _0x17f900["releaseDate"] || '',
    'subtitleText': _0x381e30 || _0x113b83["subtitleText"] || autoUpdateText("toasts.alreadyLatest"),
    'notes': _0x113b83["notes"] || _0x17f900['releaseNotes'] || '',
    'canHotApply': ![]
  }, {
    'replace': !![],
    'ignoreDismissed': !![]
  });
}
async function _showDesktopUpdateBanner(_0x1dad62, _0x2884aa = {}) {
  const _0x150489 = ++_desktopBannerRequestSequence;
  const _0x5cada6 = _normalizeDesktopUpdateInfo(_0x2884aa['info'] || _desktopUpdateInfo);
  if (_0x5cada6['version']) {
    _desktopUpdateInfo = _0x5cada6;
  }
  const _0x48169e = _0x5cada6["version"] || autoUpdateText("versions.newVersion");
  const _0x441fc4 = await _getDesktopLocalVersion();
  if (_0x150489 !== _desktopBannerRequestSequence) {
    return;
  }
  const _0x3ae87b = _formatDesktopRemoteVersion(_0x48169e);
  const _0x1d541f = _0x5cada6["releaseNotes"] || autoUpdateText("desktop.downloadedNotes");
  const _0x4fa493 = _0x1dad62 === "downloaded";
  const _0x32cafb = _0x1dad62 === "downloading";
  const _0x45573e = _0x1dad62 === 'retrying';
  const _0x5edf94 = Number(_0x2884aa["percent"] || 0x0);
  const _0x5a8085 = _0x45573e ? autoUpdateText("progress.retrying", {
    'count': Number(_0x2884aa["retryCount"] || 0x0)
  }) : autoUpdateText("progress.downloading", {
    'percent': _formatPercent(_0x5edf94)
  });
  _showBanner({
    'hasUpdate': !![],
    'localVersion': _0x441fc4,
    'remoteVersion': _0x3ae87b,
    'pubDate': _0x5cada6["releaseDate"] || '',
    'subtitleText': _0x4fa493 ? autoUpdateText("desktop.subtitleDownloaded", {
      'localVersion': _0x441fc4,
      'remoteVersion': _0x3ae87b
    }) : _0x32cafb || _0x45573e ? autoUpdateText('desktop.subtitleDownloading', {
      'localVersion': _0x441fc4,
      'remoteVersion': _0x3ae87b
    }) : autoUpdateText('desktop.subtitleAvailable', {
      'localVersion': _0x441fc4,
      'remoteVersion': _0x3ae87b
    }),
    'notes': _0x1d541f,
    'previewVideoUrl': _0x4fa493 ? '' : _0x5cada6["previewVideoUrl"],
    'canHotApply': ![],
    'startDesktopDownload': !_0x4fa493 && !_0x32cafb && !_0x45573e,
    'installDownloadedUpdate': _0x4fa493,
    'showProgress': _0x32cafb || _0x45573e,
    'hideNotes': _0x4fa493,
    'progressPercent': _0x5edf94,
    'progressText': _0x5a8085,
    'cancelText': _0x4fa493 ? autoUpdateText("buttons.later") : autoUpdateText("buttons.cancel"),
    'cancelAction': _0x32cafb || _0x45573e ? _cancelDesktopUpdateDownload : null,
    'closeAction': _0x32cafb || _0x45573e ? _cancelDesktopUpdateDownload : null,
    'disableSkip': !![],
    'hideSubtitle': ![]
  }, {
    'replace': !![],
    'ignoreDismissed': !![]
  });
}
async function _showDesktopDownloadFailedBanner(_0x3cefe9 = {}) {
  const _0x5778c6 = ++_desktopBannerRequestSequence;
  const _0x2d475e = _normalizeDesktopUpdateInfo(_0x3cefe9["info"] || _desktopUpdateInfo);
  if (_0x2d475e['version']) {
    _desktopUpdateInfo = _0x2d475e;
  }
  const _0x550b1f = _0x2d475e['version'] || autoUpdateText("versions.newVersion");
  const _0x2c1e16 = await _getDesktopLocalVersion();
  if (_0x5778c6 !== _desktopBannerRequestSequence) {
    return;
  }
  const _0x53c902 = _formatDesktopRemoteVersion(_0x550b1f);
  const _0x5d328e = Number(_0x3cefe9['retryCount'] || 0x0);
  const _0x4c7b92 = Number(_0x3cefe9["maxRetries"] || 0x0);
  const _0x3849dd = autoUpdateText("desktop.downloadFailedMessage");
  _showBanner({
    'hasUpdate': !![],
    'localVersion': _0x2c1e16,
    'remoteVersion': _0x53c902,
    'pubDate': _0x2d475e["releaseDate"] || '',
    'subtitleText': _0x4c7b92 ? autoUpdateText("desktop.downloadFailedWithRetries", {
      'message': _0x3849dd,
      'retryCount': _0x5d328e,
      'maxRetries': _0x4c7b92
    }) : _0x3849dd,
    'notes': _0x2d475e["releaseNotes"] || autoUpdateText("desktop.downloadFailedNotes"),
    'previewVideoUrl': '',
    'canHotApply': ![],
    'retryDesktopDownload': !![],
    'showProgress': ![],
    'hideNotes': !![],
    'cancelText': autoUpdateText('buttons.later'),
    'disableSkip': !![],
    'hideSubtitle': ![]
  }, {
    'replace': !![],
    'ignoreDismissed': !![]
  });
}
function _desktopEventFromState(_0x34bca1 = {}) {
  if (_0x34bca1['latestEvent']) {
    return _0x34bca1['latestEvent'];
  }
  if (!_0x34bca1["state"] || _0x34bca1['state'] === "idle") {
    return null;
  }
  const _0x38d7fc = {
    'checking': 'checking',
    'available': "available",
    'downloading': 'download-started',
    'downloaded': 'downloaded',
    'error': "download-failed",
    'installing': "installing"
  };
  const _0x5d2c62 = _0x38d7fc[_0x34bca1["state"]];
  if (!_0x5d2c62) {
    return null;
  }
  return {
    'type': _0x5d2c62,
    'state': _0x34bca1["state"],
    'info': _0x34bca1["latestInfo"] || null,
    'retryCount': _0x34bca1["retryCount"] || 0x0,
    'maxRetries': _0x34bca1['maxRetries'] || 0x0
  };
}
function _handleDesktopUpdaterEvent(_0x88a41a) {
  if (!_0x88a41a || typeof _0x88a41a !== "object") {
    return;
  }
  if (_0x88a41a["type"] === "checking") {
    _desktopBannerRequestSequence += 0x1;
    _startupBannerQueue["clear"]();
    _desktopUpdaterActive = !![];
    return;
  }
  if (_0x88a41a["type"] === "available") {
    _desktopUpdaterActive = !![];
    _startupAutomaticToastQueue["clear"]();
    void _showDesktopUpdateBanner("available", _0x88a41a);
    return;
  }
  if (_0x88a41a['type'] === "download-started") {
    _desktopBannerRequestSequence += 0x1;
    _desktopUpdaterActive = !![];
    if (_setDesktopDownloadInPlace(_0x88a41a)) {
      return;
    }
    void _showDesktopUpdateBanner("downloading", _0x88a41a);
    return;
  }
  if (_0x88a41a["type"] === 'download-retry') {
    _desktopBannerRequestSequence += 0x1;
    _desktopUpdaterActive = !![];
    if (_setDesktopDownloadInPlace(_0x88a41a, {
      'retrying': !![]
    })) {
      return;
    }
    void _showDesktopUpdateBanner('retrying', _0x88a41a);
    return;
  }
  if (_0x88a41a['type'] === 'download-progress') {
    _desktopBannerRequestSequence += 0x1;
    _desktopUpdaterActive = !![];
    if (!document["getElementById"]('update-banner-progress')) {
      void _showDesktopUpdateBanner('downloading', _0x88a41a);
      return;
    }
    _setUpdateProgress(_0x88a41a['percent'], autoUpdateText('progress.downloading', {
      'percent': _formatPercent(_0x88a41a["percent"])
    }));
    return;
  }
  if (_0x88a41a["type"] === "downloaded") {
    _desktopUpdaterActive = !![];
    if (_desktopInstallAfterDownload) {
      _desktopBannerRequestSequence += 0x1;
      _desktopInstallAfterDownload = ![];
      const _0x23aa0e = document["getElementById"]("update-banner-btn");
      const _0x5cae5f = document["getElementById"]("update-banner-sub");
      _0x5cae5f && (_0x5cae5f["classList"]["remove"]("is-error"), _0x5cae5f["textContent"] = autoUpdateText("status.downloadedRestarting"));
      _setBtnContent(_0x23aa0e, !![], autoUpdateText("buttons.restartingInstall"));
      if (_0x23aa0e) {
        _0x23aa0e["disabled"] = !![];
      }
      void _installDownloadedDesktopUpdate(_0x23aa0e);
      return;
    }
    void _showDesktopUpdateBanner("downloaded", _0x88a41a);
    return;
  }
  if (_0x88a41a["type"] === "download-failed") {
    _desktopUpdaterActive = !![];
    _desktopInstallAfterDownload = ![];
    void _showDesktopDownloadFailedBanner(_0x88a41a);
    return;
  }
  if (_0x88a41a["type"] === "download-cancelled") {
    _desktopBannerRequestSequence += 0x1;
    _desktopUpdaterActive = !![];
    _desktopInstallAfterDownload = ![];
    _removeBanner();
    return;
  }
  if (_0x88a41a["type"] === "not-available") {
    _desktopBannerRequestSequence += 0x1;
    _startupBannerQueue["clear"]();
    _desktopUpdaterActive = ![];
    _startupAutomaticToastQueue['clear']();
    _0x88a41a["manual"] && void _showManualUpdateResult(_0x88a41a["info"], autoUpdateText('toasts.alreadyLatest'));
    return;
  }
  if (_0x88a41a['type'] === 'installing') {
    _desktopBannerRequestSequence += 0x1;
    _desktopUpdaterActive = !![];
    window["showToast"]?.(autoUpdateText("toasts.installing"));
    return;
  }
  if (_0x88a41a["type"] === 'error') {
    if (_0x88a41a['skipped']) {
      return;
    }
    _desktopBannerRequestSequence += 0x1;
    _startupBannerQueue["clear"]();
    _desktopInstallAfterDownload = ![];
    const _0x2b34ff = autoUpdateText("toasts.updateFailed");
    if (_0x88a41a["manual"]) {
      void _showManualUpdateResult(_0x88a41a['info'], _0x2b34ff);
      return;
    }
    _showAutomaticUpdateToast(_0x2b34ff);
  }
}
function _showAutomaticUpdateToast(_0x3052aa) {
  const _0x2487c7 = () => window["showToast"]?.(_0x3052aa);
  if (isStartupVisualComplete()) {
    _0x2487c7();
    return;
  }
  if (_startupAutomaticToastQueue['defer'](_0x2487c7)) {
    return;
  }
  void waitForStartupVisualComplete()["then"](_0x2487c7);
}
function _bindDesktopUpdaterEvents() {
  const _0x1a43ab = desktopBridge['app'];
  if (!_0x1a43ab["isAvailable"]() || _desktopUpdateUnsubscribe) {
    return;
  }
  _desktopUpdateUnsubscribe = _0x1a43ab["onUpdaterEvent"](_handleDesktopUpdaterEvent);
  void _0x1a43ab["getUpdateState"]()["then"](_0x135359 => {
    const _0x135bb1 = _desktopEventFromState(_0x135359);
    if (_0x135bb1) {
      _handleDesktopUpdaterEvent(_0x135bb1);
    }
  })["catch"](() => {});
}
export function initAutoUpdate() {
  _bindDesktopUpdaterEvents();
  setTimeout(_checkUpdate, 0x1388);
  setTimeout(_checkUpdate, 0x4e20);
  setInterval(_checkUpdate, CHECK_INTERVAL);
}
export async function showManualUpdateCheck() {
  window["showToast"]?.(autoUpdateText("toasts.checkingUpdate"));
  let _0x2581ef = ![];
  if (desktopBridge["app"]["isAvailable"]()) {
    try {
      const _0x165297 = await desktopBridge["app"]['checkForUpdates']();
      const _0x20ad5e = _0x165297?.["skipped"] === !![] && _0x165297?.["reason"] === "not-packaged";
      _0x2581ef = _0x20ad5e;
      if (!_0x20ad5e) {
        _0x165297?.["state"] === "idle" && !document["getElementById"]("update-banner") && (await _showManualUpdateResult({}, autoUpdateText('toasts.alreadyLatest')));
        return;
      }
    } catch (_0x4e739a) {
      await _showManualUpdateResult({}, autoUpdateText("toasts.desktopCheckFailed"));
      return;
    }
  }
  try {
    let _0x2e1a12 = await checkUpdateFromServer({
      'force': !![],
      'includeCurrent': !![]
    });
    if (!_0x2e1a12?.["remoteVersion"] && !_0x2e1a12?.["notes"] && !_0x2e1a12?.["releaseUrl"]) {
      try {
        const _0x347cbb = await checkLocalUpdatePreviewFromServer();
        if (_0x347cbb?.["remoteVersion"] || _0x347cbb?.["notes"] || _0x347cbb?.['releaseUrl']) {
          _0x2e1a12 = _0x347cbb;
        }
      } catch (_0x457b6f) {}
    }
    if (_0x2e1a12?.['remoteVersion'] || _0x2e1a12?.['notes'] || _0x2e1a12?.["releaseUrl"]) {
      const _0x10ed39 = _getPageLocalVersion() || _0x2e1a12["localVersion"];
      const _0x48653c = _isRemoteVersionNewer(_0x10ed39, _0x2e1a12["remoteVersion"], _0x2e1a12['hasUpdate'] === !![]);
      const _0x9066b5 = {
        ..._0x2e1a12,
        'hasUpdate': _0x48653c,
        'previewOnly': ![],
        'localVersion': _0x10ed39,
        'desktopUpdaterUnavailable': _0x2581ef
      };
      _0x48653c ? _showBanner(_0x9066b5, {
        'replace': !![],
        'ignoreDismissed': !![]
      }) : await _showManualUpdateResult(_0x9066b5, autoUpdateText("toasts.alreadyLatest"));
      return;
    }
    await _showManualUpdateResult(_0x2e1a12, autoUpdateText("toasts.noRemoteInfo"));
  } catch (_0x54e170) {
    await _showManualUpdateResult({}, autoUpdateText("toasts.remoteCheckFailed"));
  }
}
export async function showLocalUpdatePreview() {
  try {
    window["showToast"]?.(autoUpdateText("toasts.generatingPreview"));
    const _0x3e9945 = await checkLocalUpdatePreviewFromServer();
    if (_0x3e9945?.["previewOnly"] && (_0x3e9945?.["remoteVersion"] || _0x3e9945?.["notes"])) {
      _showBanner(_0x3e9945, {
        'replace': !![],
        'ignoreDismissed': !![]
      });
      return;
    }
    window["showToast"]?.(autoUpdateText('toasts.noLocalPreview'));
  } catch (_0x54b981) {
    window["showToast"]?.(autoUpdateText("toasts.localPreviewFailed"));
  }
}
export function showTutorialVideoPanel(_0xd02460, _0xd5232b = []) {
  const _0x529ac5 = Array["isArray"](_0xd02460) ? _0xd02460 : [{
    'title': autoUpdateText("tutorial.defaultTitle"),
    'url': _0xd02460
  }];
  const _0x362228 = _formatBannerVersion(_getPageLocalVersion());
  const _0x3d4869 = _0x362228 ? autoUpdateText("tutorial.versionedTitle", {
    'version': _0x362228
  }) : autoUpdateText("tutorial.title");
  _showBanner({
    'previewOnly': !![],
    'hasUpdate': ![],
    'localVersion': '',
    'remoteVersion': _0x3d4869,
    'titleText': _0x3d4869,
    'subtitleText': autoUpdateText("tutorial.subtitle"),
    'notes': '',
    'tutorialLinks': _0xd5232b,
    'tutorialVideos': _0x529ac5,
    'canHotApply': ![],
    'hideNotes': !![],
    'hideCancelButton': !![],
    'previewCloseText': autoUpdateText("buttons.close")
  }, {
    'replace': !![],
    'ignoreDismissed': !![]
  });
}