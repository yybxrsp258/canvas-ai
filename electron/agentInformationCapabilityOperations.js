import { lookup as a179_0x2ab787 } from 'node:dns/promises';
import a179_0x49e6f2 from 'node:http';
import a179_0x173790 from 'node:https';
import a179_0x394d8d from 'node:net';
export const AGENT_URL_READER_MAX_BYTES = 0x400 * 0x400;
export const AGENT_URL_READER_MAX_CHARS = 0xea60;
export const AGENT_URL_READER_TIMEOUT_MS = 0x3a98;
const MAX_REDIRECTS = 0x4;
const ALLOWED_PORTS = new Set(['', '80', '443']);
const BLOCKED_HOST_SUFFIXES = [".localhost", ".local", ".internal", '.home', ".lan"];
function createCapabilityError(_0x381e90, _0x20e7c6) {
  const _0xf59569 = new Error(_0x20e7c6);
  _0xf59569['code'] = _0x381e90;
  return _0xf59569;
}
function normalizeHostname(_0x3aac8e = '') {
  return String(_0x3aac8e || '')["trim"]()["toLowerCase"]()["replace"](/^\[|\]$/g, '')["replace"](/\.$/, '');
}
function isBlockedIpv4(_0xa4dc05 = '') {
  const _0xaa05dd = String(_0xa4dc05)["split"]('.')['map'](Number);
  if (_0xaa05dd["length"] !== 0x4 || _0xaa05dd["some"](_0x2421a5 => !Number["isInteger"](_0x2421a5) || _0x2421a5 < 0x0 || _0x2421a5 > 0xff)) {
    return !![];
  }
  const [_0x4ae461, _0x5a3f40, _0x30d4d7] = _0xaa05dd;
  return _0x4ae461 === 0x0 || _0x4ae461 === 0xa || _0x4ae461 === 0x7f || _0x4ae461 === 0x64 && _0x5a3f40 >= 0x40 && _0x5a3f40 <= 0x7f || _0x4ae461 === 0xa9 && _0x5a3f40 === 0xfe || _0x4ae461 === 0xac && _0x5a3f40 >= 0x10 && _0x5a3f40 <= 0x1f || _0x4ae461 === 0xc0 && _0x5a3f40 === 0x0 && _0x30d4d7 === 0x0 || _0x4ae461 === 0xc0 && _0x5a3f40 === 0x0 && _0x30d4d7 === 0x2 || _0x4ae461 === 0xc0 && _0x5a3f40 === 0xa8 || _0x4ae461 === 0xc6 && (_0x5a3f40 === 0x12 || _0x5a3f40 === 0x13) || _0x4ae461 === 0xc6 && _0x5a3f40 === 0x33 && _0x30d4d7 === 0x64 || _0x4ae461 === 0xcb && _0x5a3f40 === 0x0 && _0x30d4d7 === 0x71 || _0x4ae461 >= 0xe0;
}
function isBlockedIpv6(_0x35a767 = '') {
  const _0x34ad2f = String(_0x35a767 || '')['toLowerCase']()["split"]('%')[0x0];
  if (!_0x34ad2f || _0x34ad2f === '::' || _0x34ad2f === "::1") {
    return !![];
  }
  if (_0x34ad2f["startsWith"]('::')) {
    return !![];
  }
  const _0xfc57db = Number["parseInt"](_0x34ad2f["split"](':')[0x0] || '0', 0x10);
  return (_0xfc57db & 0xe000) !== 0x2000 || _0x34ad2f['startsWith']("2001:db8:");
}
export function isPublicAgentInformationAddress(_0x412f0b = '') {
  const _0x290205 = a179_0x394d8d["isIP"](String(_0x412f0b || ''));
  if (_0x290205 === 0x4) {
    return !isBlockedIpv4(_0x412f0b);
  }
  if (_0x290205 === 0x6) {
    return !isBlockedIpv6(_0x412f0b);
  }
  return ![];
}
export function normalizeAgentInformationUrl(_0x432da9 = '') {
  let _0x1e1c77;
  try {
    _0x1e1c77 = new URL(String(_0x432da9 || '')["trim"]());
  } catch {
    throw createCapabilityError("INVALID_URL", '请输入有效的\x20HTTP\x20或\x20HTTPS\x20URL。');
  }
  if (!['http:', "https:"]["includes"](_0x1e1c77["protocol"])) {
    throw createCapabilityError('UNSUPPORTED_URL_PROTOCOL', "仅支持 HTTP 或 HTTPS URL。");
  }
  if (_0x1e1c77["username"] || _0x1e1c77["password"]) {
    throw createCapabilityError("URL_CREDENTIALS_FORBIDDEN", "URL 不能包含用户名或密码。");
  }
  if (!ALLOWED_PORTS["has"](_0x1e1c77["port"])) {
    throw createCapabilityError("URL_PORT_FORBIDDEN", "URL 读取仅允许标准 HTTP/HTTPS 端口。");
  }
  const _0x23f7cd = normalizeHostname(_0x1e1c77["hostname"]);
  if (!_0x23f7cd || _0x23f7cd === 'localhost' || BLOCKED_HOST_SUFFIXES['some'](_0x4b0e0b => _0x23f7cd["endsWith"](_0x4b0e0b))) {
    throw createCapabilityError('PRIVATE_URL_FORBIDDEN', "不能读取本机或内部网络地址。");
  }
  if (a179_0x394d8d["isIP"](_0x23f7cd) && !isPublicAgentInformationAddress(_0x23f7cd)) {
    throw createCapabilityError("PRIVATE_URL_FORBIDDEN", '不能读取私有、保留或本机网络地址。');
  }
  _0x1e1c77["hash"] = '';
  return _0x1e1c77;
}
async function resolvePinnedAddress(_0x553362, _0x4f1741) {
  const _0x173e1f = normalizeHostname(_0x553362["hostname"]);
  if (a179_0x394d8d["isIP"](_0x173e1f)) {
    return {
      'address': _0x173e1f,
      'family': a179_0x394d8d["isIP"](_0x173e1f)
    };
  }
  let _0x2d074d;
  try {
    _0x2d074d = await _0x4f1741(_0x173e1f, {
      'all': !![],
      'verbatim': !![]
    });
  } catch {
    throw createCapabilityError("URL_DNS_FAILED", "无法解析该 URL 的主机名。");
  }
  const _0x1ca297 = (Array['isArray'](_0x2d074d) ? _0x2d074d : [_0x2d074d])['map'](_0x481904 => typeof _0x481904 === 'string' ? {
    'address': _0x481904,
    'family': a179_0x394d8d['isIP'](_0x481904)
  } : {
    'address': String(_0x481904?.["address"] || ''),
    'family': Number(_0x481904?.["family"] || 0x0)
  })["filter"](_0x480734 => _0x480734["address"] && _0x480734["family"]);
  if (_0x1ca297["length"] === 0x0) {
    throw createCapabilityError('URL_DNS_FAILED', "无法解析该 URL 的主机名。");
  }
  if (_0x1ca297['some'](_0xa3ec59 => !isPublicAgentInformationAddress(_0xa3ec59['address']))) {
    throw createCapabilityError('PRIVATE_URL_FORBIDDEN', "URL 解析到了私有、保留或本机网络地址。");
  }
  return _0x1ca297[0x0];
}
function requestPinnedUrl(_0x56423e, {
  address: _0x4357b5,
  family: _0x25e0c6,
  signal: _0x3b51c7,
  timeoutMs: _0x5e9ed1,
  maxBytes: _0x49b1be
} = {}) {
  return new Promise((_0x3f879e, _0x816272) => {
    if (_0x3b51c7?.["aborted"]) {
      _0x816272(createCapabilityError("URL_READ_ABORTED", "URL 读取已取消。"));
      return;
    }
    const _0x35f384 = _0x56423e["protocol"] === "https:" ? a179_0x173790 : a179_0x49e6f2;
    const _0xd8db1d = _0x56423e["protocol"] === "https:" ? 0x1bb : 0x50;
    const _0x396bb0 = _0x56423e["port"] ? _0x56423e['hostname'] + ':' + _0x56423e["port"] : _0x56423e["hostname"];
    let _0xb08b25 = ![];
    let _0x47cf45 = null;
    const _0x22d7ce = (_0x314c20, _0x1156e6) => {
      if (_0xb08b25) {
        return;
      }
      _0xb08b25 = !![];
      if (_0x47cf45) {
        clearTimeout(_0x47cf45);
      }
      _0x3b51c7?.["removeEventListener"]?.('abort', _0x9a1a07);
      _0x314c20(_0x1156e6);
    };
    const _0x3872b7 = _0x35f384["request"]({
      'protocol': _0x56423e["protocol"],
      'hostname': _0x4357b5,
      'family': _0x25e0c6,
      'port': Number(_0x56423e["port"] || _0xd8db1d),
      'path': '' + (_0x56423e["pathname"] || '/') + (_0x56423e["search"] || ''),
      'method': "GET",
      'servername': normalizeHostname(_0x56423e["hostname"]),
      'rejectUnauthorized': !![],
      'headers': {
        'Host': _0x396bb0,
        'Accept': "text/html,application/xhtml+xml,text/plain,application/json,application/xml;q=0.9,*/*;q=0.1",
        'Accept-Encoding': "identity",
        'User-Agent': "SHUO-Canvas-Agent-URL-Reader/1.0"
      }
    }, _0x496e32 => {
      const _0x17e4f4 = Number(_0x496e32["statusCode"] || 0x0);
      const _0x555639 = _0x496e32["headers"] || {};
      if (_0x17e4f4 >= 0x12c && _0x17e4f4 < 0x190 && _0x555639["location"]) {
        _0x496e32["resume"]();
        _0x22d7ce(_0x3f879e, {
          'status': _0x17e4f4,
          'headers': _0x555639,
          'body': Buffer["alloc"](0x0)
        });
        return;
      }
      const _0xcf1325 = [];
      let _0x485d2c = 0x0;
      _0x496e32['on']("data", _0xa70fb2 => {
        const _0x7e9335 = Buffer["isBuffer"](_0xa70fb2) ? _0xa70fb2 : Buffer["from"](_0xa70fb2);
        _0x485d2c += _0x7e9335["length"];
        if (_0x485d2c > _0x49b1be) {
          _0x496e32["destroy"](createCapabilityError('URL_RESPONSE_TOO_LARGE', "网页响应超过 " + _0x49b1be + " 字节限制。"));
          return;
        }
        _0xcf1325["push"](_0x7e9335);
      });
      _0x496e32['on']("end", () => _0x22d7ce(_0x3f879e, {
        'status': _0x17e4f4,
        'headers': _0x555639,
        'body': Buffer['concat'](_0xcf1325)
      }));
      _0x496e32['on']("error", _0x1f4612 => _0x22d7ce(_0x816272, _0x1f4612));
    });
    const _0x9a1a07 = () => _0x3872b7["destroy"](createCapabilityError("URL_READ_ABORTED", "URL 读取已取消。"));
    _0x3b51c7?.["addEventListener"]?.("abort", _0x9a1a07, {
      'once': !![]
    });
    _0x47cf45 = setTimeout(() => _0x3872b7["destroy"](createCapabilityError("URL_READ_TIMEOUT", 'URL\x20读取超时。')), _0x5e9ed1);
    _0x3872b7['setTimeout'](_0x5e9ed1, () => _0x3872b7["destroy"](createCapabilityError("URL_READ_TIMEOUT", "URL 读取超时。")));
    _0x3872b7['on']('error', _0x42a63a => _0x22d7ce(_0x816272, _0x42a63a));
    _0x3872b7["end"]();
  });
}
function getHeader(_0x3555cf = {}, _0x343dbb = '') {
  const _0xdb3651 = _0x3555cf[String(_0x343dbb || '')["toLowerCase"]()];
  return Array["isArray"](_0xdb3651) ? String(_0xdb3651[0x0] || '') : String(_0xdb3651 || '');
}
function decodeBody(_0x346cc2, _0x363771 = '') {
  const _0x2363c0 = String(_0x363771)['match'](/charset\s*=\s*["']?([^;\s"']+)/i)?.[0x1] || "utf-8";
  try {
    return new TextDecoder(_0x2363c0)["decode"](_0x346cc2);
  } catch {
    return new TextDecoder("utf-8")["decode"](_0x346cc2);
  }
}
function decodeHtmlEntities(_0x2f68e6 = '') {
  const _0x2aa81b = {
    'amp': '&',
    'apos': '\x27',
    'gt': '>',
    'lt': '<',
    'nbsp': '\x20',
    'quot': '\x22'
  };
  return String(_0x2f68e6)['replace'](/&(#x[0-9a-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/gi, (_0x4555e9, _0x87ed46) => {
    if (_0x87ed46[0x0] !== '#') {
      return _0x2aa81b[_0x87ed46["toLowerCase"]()] || _0x4555e9;
    }
    const _0x1422da = _0x87ed46[0x1]?.["toLowerCase"]() === 'x' ? 0x10 : 0xa;
    const _0xeb20ff = _0x1422da === 0x10 ? _0x87ed46['slice'](0x2) : _0x87ed46['slice'](0x1);
    const _0x29d00d = Number["parseInt"](_0xeb20ff, _0x1422da);
    try {
      return Number["isFinite"](_0x29d00d) ? String["fromCodePoint"](_0x29d00d) : _0x4555e9;
    } catch {
      return _0x4555e9;
    }
  });
}
function normalizeExtractedText(_0x5449bd = '') {
  return String(_0x5449bd || '')["replace"](/\r\n?/g, '\x0a')['replace'](/[\t\f\v ]+/g, '\x20')["replace"](/ *\n */g, '\x0a')['replace'](/\n{3,}/g, '\x0a\x0a')["trim"]();
}
export function extractAgentInformationHtml(_0x4104e8 = '') {
  const _0x75d8c = String(_0x4104e8 || '');
  const _0x4360ee = normalizeExtractedText(decodeHtmlEntities(_0x75d8c["match"](/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[0x1]?.["replace"](/<[^>]+>/g, '\x20') || ''));
  const _0x3d89fb = normalizeExtractedText(decodeHtmlEntities(_0x75d8c['replace'](/<head\b[^>]*>[\s\S]*?<\/head>/gi, '\x20')["replace"](/<title\b[^>]*>[\s\S]*?<\/title>/gi, '\x20')["replace"](/<!--[\s\S]*?-->/g, '\x20')["replace"](/<(script|style|noscript|svg|template)\b[^>]*>[\s\S]*?<\/\1>/gi, '\x20')["replace"](/<(?:br|hr)\b[^>]*>/gi, '\x0a')["replace"](/<\/(?:address|article|aside|blockquote|dd|div|dl|dt|footer|form|h[1-6]|header|li|main|nav|ol|p|pre|section|table|tr|ul)>/gi, '\x0a')["replace"](/<[^>]+>/g, '\x20')));
  return {
    'title': _0x4360ee,
    'content': _0x3d89fb
  };
}
function isSupportedTextContentType(_0xd61399 = '') {
  const _0x25040c = String(_0xd61399 || '')['split'](';')[0x0]["trim"]()['toLowerCase']();
  return !_0x25040c || _0x25040c["startsWith"]('text/') || ["application/json", "application/ld+json", 'application/xhtml+xml', "application/xml"]["includes"](_0x25040c);
}
export function createAgentInformationCapabilityOperations({
  resolveHostname = a179_0x2ab787,
  requestUrl = requestPinnedUrl,
  timeoutMs = AGENT_URL_READER_TIMEOUT_MS,
  maxBytes = AGENT_URL_READER_MAX_BYTES,
  maxChars = AGENT_URL_READER_MAX_CHARS
} = {}) {
  async function _0x40486f(_0x379c87 = {}) {
    let _0x1450f9 = normalizeAgentInformationUrl(_0x379c87["url"]);
    const _0x423b33 = _0x1450f9["toString"]();
    for (let _0x5ea3a4 = 0x0; _0x5ea3a4 <= MAX_REDIRECTS; _0x5ea3a4 += 0x1) {
      const _0x2a7ca2 = await resolvePinnedAddress(_0x1450f9, resolveHostname);
      const _0x322f2c = await requestUrl(_0x1450f9, {
        ..._0x2a7ca2,
        'signal': _0x379c87["signal"],
        'timeoutMs': timeoutMs,
        'maxBytes': maxBytes
      });
      if (_0x322f2c["status"] >= 0x12c && _0x322f2c["status"] < 0x190) {
        const _0x1b5d26 = getHeader(_0x322f2c["headers"], 'location');
        if (!_0x1b5d26) {
          throw createCapabilityError("URL_REDIRECT_INVALID", "网页返回了无效重定向。");
        }
        if (_0x5ea3a4 === MAX_REDIRECTS) {
          throw createCapabilityError("URL_TOO_MANY_REDIRECTS", "网页重定向次数过多。");
        }
        _0x1450f9 = normalizeAgentInformationUrl(new URL(_0x1b5d26, _0x1450f9)["toString"]());
        continue;
      }
      if (_0x322f2c["status"] < 0xc8 || _0x322f2c['status'] >= 0x12c) {
        throw createCapabilityError("URL_HTTP_ERROR", "网页请求失败（HTTP " + (_0x322f2c["status"] || 0x0) + '）。');
      }
      const _0x2e6f1b = getHeader(_0x322f2c["headers"], 'content-type');
      const _0xb94a1e = getHeader(_0x322f2c['headers'], "content-encoding")["trim"]()['toLowerCase']();
      if (_0xb94a1e && _0xb94a1e !== 'identity') {
        throw createCapabilityError("UNSUPPORTED_URL_CONTENT_ENCODING", "网页返回了不支持的内容编码：" + _0xb94a1e + '。');
      }
      if (!isSupportedTextContentType(_0x2e6f1b)) {
        throw createCapabilityError("UNSUPPORTED_URL_CONTENT_TYPE", "当前仅支持网页和文本 URL，暂不支持 " + (_0x2e6f1b || '该文件类型') + '。');
      }
      const _0x4a4d58 = decodeBody(_0x322f2c["body"], _0x2e6f1b);
      const _0x540936 = /(?:text\/html|application\/xhtml\+xml)/i["test"](_0x2e6f1b) ? extractAgentInformationHtml(_0x4a4d58) : {
        'title': '',
        'content': normalizeExtractedText(_0x4a4d58)
      };
      if (!_0x540936["content"]) {
        throw createCapabilityError("URL_CONTENT_EMPTY", "网页没有可读取的正文内容。");
      }
      const _0x1cd3c8 = _0x540936["content"]["length"] > maxChars;
      return {
        'success': !![],
        'source': {
          'requestedUrl': _0x423b33,
          'finalUrl': _0x1450f9["toString"](),
          'title': _0x540936["title"],
          'contentType': _0x2e6f1b["split"](';')[0x0]["trim"]()["toLowerCase"](),
          'content': _0x1cd3c8 ? _0x540936['content']["slice"](0x0, maxChars) : _0x540936["content"],
          'byteLength': _0x322f2c['body']["length"],
          'truncated': _0x1cd3c8,
          'trust': 'untrusted_external'
        }
      };
    }
    throw createCapabilityError("URL_TOO_MANY_REDIRECTS", '网页重定向次数过多。');
  }
  return {
    'readUrl': _0x40486f
  };
}
export const __agentInformationCapabilityForTest = Object["freeze"]({
  'requestPinnedUrl': requestPinnedUrl
});