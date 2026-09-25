export function createStartupHelpers({
  appDisplayName: _0x5b4f62,
  appOrigin: _0x4ea135,
  getMainWindow: _0xb47cce,
  logDiagnosticEvent: _0x743456,
  shellApi: _0x56d368,
  normalizeExternalUrl: _0x15011c,
  formatExternalUrlForLog: _0x4b8320
}) {
  const _0x45e166 = _0x5a466c => new Promise(_0x4470db => {
    setTimeout(_0x4470db, _0x5a466c);
  });
  function _0x1cb197(_0x368f72) {
    return String(_0x368f72 ?? '')["replace"](/&/g, "&amp;")["replace"](/</g, "&lt;")["replace"](/>/g, "&gt;")["replace"](/"/g, "&quot;")["replace"](/'/g, "&#39;");
  }
  function _0x36381e(_0x2430fb = {}) {
    const _0x2d8d7a = String(_0x2430fb["kind"] || 'loading');
    const _0x186f97 = _0x1cb197(_0x2430fb["title"] || _0x5b4f62 + '\x20正在启动');
    const _0xfd2934 = _0x1cb197(_0x2430fb["detail"] || '');
    const _0x40c44d = _0x1cb197(_0x2430fb['hint'] || '');
    const _0x3a64cf = _0x2d8d7a === "error";
    return '<!doctype\x20html>\x0a<html>\x0a<head>\x0a\x20\x20<meta\x20charset=\x22utf-8\x22>\x0a\x20\x20<title>' + _0x186f97 + '</title>\x0a\x20\x20<style>\x0a\x20\x20\x20\x20:root\x20{\x0a\x20\x20\x20\x20\x20\x20color-scheme:\x20light\x20dark;\x0a\x20\x20\x20\x20\x20\x20font-family:\x20\x22Segoe\x20UI\x22,\x20Arial,\x20sans-serif;\x0a\x20\x20\x20\x20\x20\x20background:\x20Canvas;\x0a\x20\x20\x20\x20\x20\x20color:\x20CanvasText;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20body\x20{\x0a\x20\x20\x20\x20\x20\x20margin:\x200;\x0a\x20\x20\x20\x20\x20\x20min-height:\x20100vh;\x0a\x20\x20\x20\x20\x20\x20display:\x20grid;\x0a\x20\x20\x20\x20\x20\x20place-items:\x20center;\x0a\x20\x20\x20\x20\x20\x20background:\x20Canvas;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20main\x20{\x0a\x20\x20\x20\x20\x20\x20width:\x20min(560px,\x20calc(100vw\x20-\x2056px));\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20h1\x20{\x0a\x20\x20\x20\x20\x20\x20margin:\x200\x200\x2014px;\x0a\x20\x20\x20\x20\x20\x20font-size:\x2024px;\x0a\x20\x20\x20\x20\x20\x20font-weight:\x20650;\x0a\x20\x20\x20\x20\x20\x20letter-spacing:\x200;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20p\x20{\x0a\x20\x20\x20\x20\x20\x20margin:\x208px\x200;\x0a\x20\x20\x20\x20\x20\x20color:\x20GrayText;\x0a\x20\x20\x20\x20\x20\x20line-height:\x201.55;\x0a\x20\x20\x20\x20\x20\x20font-size:\x2014px;\x0a\x20\x20\x20\x20}\x0a\x20\x20\x20\x20.mark\x20{\x0a\x20\x20\x20\x20\x20\x20width:\x2040px;\x0a\x20\x20\x20\x20\x20\x20height:\x2040px;\x0a\x20\x20\x20\x20\x20\x20border-radius:\x2050%;\x0a\x20\x20\x20\x20\x20\x20margin-bottom:\x2022px;\x0a\x20\x20\x20\x20\x20\x20border:\x203px\x20solid\x20' + (_0x3a64cf ? "Mark" : "AccentColor") + ';\x0a\x20\x20\x20\x20\x20\x20border-top-color:\x20transparent;\x0a\x20\x20\x20\x20\x20\x20animation:\x20' + (_0x3a64cf ? "none" : "spin 0.9s linear infinite") + ";\n    }\n    @keyframes spin {\n      to { transform: rotate(360deg); }\n    }\n  </style>\n</head>\n<body>\n  <main>\n    <div class=\"mark\"></div>\n    <h1>" + _0x186f97 + "</h1>\n    " + (_0xfd2934 ? "<p>" + _0xfd2934 + "</p>" : '') + "\n    " + (_0x40c44d ? "<p>" + _0x40c44d + "</p>" : '') + "\n  </main>\n</body>\n</html>";
  }
  function _0x3e6930(_0x5c93f6) {
    const _0x32794a = _0xb47cce();
    if (!_0x32794a || _0x32794a["isDestroyed"]()) {
      return;
    }
    const _0x1a781b = _0x36381e(_0x5c93f6);
    void _0x32794a["loadURL"]("data:text/html;charset=utf-8," + encodeURIComponent(_0x1a781b));
  }
  function _0x4cdc6a(_0x3703d5) {
    try {
      const _0x3c14a7 = new URL(_0x3703d5);
      return _0x3c14a7['origin'] === _0x4ea135;
    } catch {
      return ![];
    }
  }
  function _0x511449(_0x3360da) {
    const _0x305aaf = _0x15011c(_0x3360da);
    if (!_0x305aaf) {
      _0x743456({
        'type': "external_link.blocked",
        'level': 'warn',
        'source': "main",
        'message': "Blocked external link",
        'context': {
          'reason': 'invalid-or-disallowed-protocol'
        }
      });
      return {
        'ok': ![],
        'error': '不允许打开该外部链接'
      };
    }
    void _0x56d368["openExternal"](_0x305aaf);
    _0x743456({
      'type': "external_link.opened",
      'level': 'info',
      'source': "main",
      'message': 'Opened\x20external\x20link',
      'context': {
        'url': _0x4b8320(_0x305aaf)
      }
    });
    return {
      'ok': !![],
      'url': _0x305aaf
    };
  }
  return {
    'delay': _0x45e166,
    'loadStartupStatus': _0x3e6930,
    'isLocalAppUrl': _0x4cdc6a,
    'openExternalUrl': _0x511449
  };
}