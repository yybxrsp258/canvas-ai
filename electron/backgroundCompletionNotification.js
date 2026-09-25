function normalizeText(_0x5ccb0a, _0xd08e69 = '', _0x9caf52 = 0xa0) {
  const _0x3b2eb7 = String(_0x5ccb0a || _0xd08e69 || '')["replace"](/\s+/g, '\x20')["trim"]();
  return _0x3b2eb7["slice"](0x0, _0x9caf52);
}
const IMAGE_ICON_EXTENSION_RE = /\.(?:png|jpe?g|webp|gif|bmp|avif)$/i;
function normalizeThumbnailLocalPath(_0x26b6c6) {
  const _0x2bfba3 = String(_0x26b6c6 || '')["trim"]()["slice"](0x0, 0x200);
  const _0x36b8dd = _0x2bfba3['split'](/[?#]/, 0x1)[0x0];
  return IMAGE_ICON_EXTENSION_RE["test"](_0x36b8dd) ? _0x36b8dd : '';
}
function resolveNotificationIcon(_0x58c588, _0x5dee06) {
  if (typeof _0x5dee06 !== 'function') {
    return '';
  }
  const _0x2b4a08 = normalizeThumbnailLocalPath(_0x58c588?.["thumbnailLocalPath"]);
  if (!_0x2b4a08) {
    return '';
  }
  try {
    const _0xb758ac = String(_0x5dee06(_0x2b4a08) || '')["trim"]();
    return IMAGE_ICON_EXTENSION_RE["test"](_0xb758ac) ? _0xb758ac : '';
  } catch {
    return '';
  }
}
function isWindowFocused(_0x3c6801) {
  try {
    return !!_0x3c6801 && !_0x3c6801["isDestroyed"]?.() && _0x3c6801["isFocused"]?.() === !![];
  } catch {
    return ![];
  }
}
function normalizeNavigation(_0x1c247e = {}) {
  if (!_0x1c247e || typeof _0x1c247e !== "object" || Array["isArray"](_0x1c247e)) {
    return null;
  }
  const _0x5f5a93 = normalizeText(_0x1c247e["source"], '', 0x28);
  const _0x22453b = normalizeText(_0x1c247e["projectId"], '', 0x78);
  if (_0x5f5a93 === "canvas") {
    const _0x250704 = normalizeText(_0x1c247e['nodeId'], '', 0x78);
    return _0x250704 ? {
      'source': _0x5f5a93,
      'projectId': _0x22453b,
      'nodeId': _0x250704,
      'canvasId': normalizeText(_0x1c247e["canvasId"], '', 0x78)
    } : null;
  }
  if (!_0x5f5a93 || !_0x22453b) {
    return null;
  }
  const _0x3ffbe5 = Math["max"](0x1, Math["min"](_0x5f5a93 === "replacement-studio" ? 0x5 : 0x3, Math["trunc"](Number(_0x1c247e['step']) || 0x1)));
  return {
    'source': _0x5f5a93,
    'projectId': _0x22453b,
    'step': _0x3ffbe5,
    'outlineSectionId': normalizeText(_0x1c247e["outlineSectionId"], '', 0x78),
    'assetId': normalizeText(_0x1c247e["assetId"], '', 0x78),
    'episodeId': normalizeText(_0x1c247e["episodeId"], '', 0x78),
    'clipId': normalizeText(_0x1c247e['clipId'], '', 0x78)
  };
}
function escapeToastXml(_0x402233) {
  return String(_0x402233)["replace"](/[&<>"']/g, _0x107198 => ({
    '&': "&amp;",
    '<': "&lt;",
    '>': "&gt;",
    '\x22': '&quot;',
    '\x27': "&apos;"
  })[_0x107198]);
}
function createWindowsToastXml({
  title: _0x5bdf27,
  body: _0x3cfa98,
  icon: _0x26ea4d
}) {
  const _0x48fb07 = _0x26ea4d ? '<image\x20placement=\x22appLogoOverride\x22\x20src=\x22' + escapeToastXml(_0x26ea4d) + '\x22/>' : '';
  return "<toast duration=\"long\"><visual><binding template=\"ToastGeneric\"><text>" + escapeToastXml(_0x5bdf27) + "</text><text>" + escapeToastXml(_0x3cfa98) + '</text>' + _0x48fb07 + "</binding></visual><audio silent=\"true\"/></toast>";
}
export function createBackgroundCompletionNotifier({
  Notification: _0x29f214,
  getMainWindow: _0x32e50d,
  focusMainWindow: _0x3b62ff,
  onClick: _0x9576bb,
  logEvent: _0xf5cc0a,
  resolveNotificationIconPath: _0x2c1957,
  appName = "Canvas AI",
  platform = process['platform'],
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout
} = {}) {
  const _0x4bfc4f = [];
  const _0x48f32d = new Set();
  let _0x2cec63 = 0x0;
  return {
    'showGenerationComplete'(_0x4a0bd5 = {}) {
      const _0x569d5f = typeof _0x32e50d === 'function' ? _0x32e50d() : null;
      if (isWindowFocused(_0x569d5f)) {
        return {
          'success': !![],
          'shown': ![],
          'reason': "window-focused"
        };
      }
      if (typeof _0x29f214?.["isSupported"] === "function" && !_0x29f214["isSupported"]()) {
        return {
          'success': !![],
          'shown': ![],
          'reason': "unsupported"
        };
      }
      const _0x37e6ca = normalizeText(_0x4a0bd5?.["title"], appName, 0x50);
      const _0x4a405b = normalizeText(_0x4a0bd5?.['body'], '生成任务已完成。', 0xb4);
      const _0x8951d7 = normalizeNavigation(_0x4a0bd5?.["navigation"]);
      const _0x552d5c = resolveNotificationIcon(_0x4a0bd5, _0x2c1957);
      let _0x29d7f = () => {};
      try {
        const _0x5a4bc5 = new _0x29f214({
          'title': _0x37e6ca,
          'body': _0x4a405b,
          'silent': !![],
          'timeoutType': "default",
          ...(_0x552d5c ? {
            'icon': _0x552d5c
          } : {}),
          ...(platform === "win32" ? {
            'toastXml': createWindowsToastXml({
              'title': _0x37e6ca,
              'body': _0x4a405b,
              'icon': _0x552d5c
            })
          } : {})
        });
        _0x48f32d["add"](_0x5a4bc5);
        let _0x1df0e3 = null;
        let _0x5e4f6b = ![];
        _0x29d7f = (_0x3cf6db = ![]) => {
          if (_0x5e4f6b) {
            return;
          }
          _0x5e4f6b = !![];
          clearTimeoutFn(_0x1df0e3);
          _0x48f32d["delete"](_0x5a4bc5);
          if (_0x3cf6db) {
            _0x5a4bc5['close']?.();
          }
        };
        const _0x401eca = () => {
          if (_0x5e4f6b) {
            return;
          }
          clearTimeoutFn(_0x1df0e3);
          _0x1df0e3 = setTimeoutFn(() => _0x29d7f(!![]), 0x2710);
          _0x1df0e3?.["unref"]?.();
        };
        _0x5a4bc5['on']?.("show", _0x401eca);
        _0x5a4bc5['on']?.("close", _0x5b6251 => {
          if (_0x5b6251?.["reason"] !== 'timedOut') {
            _0x29d7f();
          }
        });
        _0x5a4bc5['on']?.("failed", (_0x355d3e, _0x48ded3) => {
          _0x29d7f();
          const _0x47b70a = String(_0x48ded3?.["message"] || _0x48ded3 || 'Unknown\x20notification\x20error');
          console['warn']("[electron] completion notification failed:", _0x47b70a);
          _0xf5cc0a?.({
            'type': 'notification.generation_complete_failed',
            'level': 'warn',
            'source': 'main',
            'message': "Generation completion notification failed",
            'error': _0x47b70a,
            'context': {
              'title': _0x37e6ca
            }
          });
        });
        _0x5a4bc5['on']?.("click", () => {
          if (_0x5e4f6b) {
            return;
          }
          _0xf5cc0a?.({
            'type': "notification.generation_complete_clicked",
            'source': "main",
            'message': "Generation completion notification clicked",
            'context': {
              'navigation': _0x8951d7
            }
          });
          const _0x1f70d9 = _0x31da1f => _0xf5cc0a?.({
            'type': "notification.generation_complete_focus_failed",
            'level': "warn",
            'source': "main",
            'message': "Could not focus completion window",
            'error': String(_0x31da1f?.["message"] || _0x31da1f)
          });
          try {
            const _0x515371 = _0x3b62ff?.();
            Promise['resolve'](_0x515371)["then"](_0x43734e => {
              if (_0x43734e === ![]) {
                _0x1f70d9("Window activation returned false");
              }
            }, _0x1f70d9);
          } catch (_0x5f0b48) {
            _0x1f70d9(_0x5f0b48);
          }
          _0x29d7f(!![]);
          if (_0x8951d7) {
            _0x2cec63 += 0x1;
            const _0x5ae485 = {
              ..._0x8951d7,
              'eventId': "completion-" + Date["now"]() + '-' + _0x2cec63,
              'createdAt': Date['now']()
            };
            _0x4bfc4f['push'](_0x5ae485);
            while (_0x4bfc4f["length"] > 0x28) {
              _0x4bfc4f['shift']();
            }
            if (typeof _0x9576bb === "function") {
              _0x9576bb(_0x5ae485);
            }
          }
        });
        _0x401eca();
        _0x5a4bc5["show"]?.();
        return {
          'success': !![],
          'shown': !![]
        };
      } catch (_0x370c56) {
        _0x29d7f();
        console["warn"]("[electron] failed to show completion notification:", _0x370c56);
        _0xf5cc0a?.({
          'type': "notification.generation_complete_failed",
          'level': "warn",
          'source': 'main',
          'message': "Generation completion notification failed",
          'error': String(_0x370c56?.["message"] || _0x370c56),
          'context': {
            'title': _0x37e6ca
          }
        });
        return {
          'success': ![],
          'shown': ![],
          'error': String(_0x370c56?.["message"] || _0x370c56)
        };
      }
    },
    'consumeClickEvents'() {
      return _0x4bfc4f["splice"](0x0, _0x4bfc4f["length"]);
    }
  };
}
export const __backgroundCompletionNotificationForTest = {
  'isWindowFocused': isWindowFocused,
  'normalizeNavigation': normalizeNavigation,
  'normalizeThumbnailLocalPath': normalizeThumbnailLocalPath,
  'resolveNotificationIcon': resolveNotificationIcon,
  'normalizeText': normalizeText
};