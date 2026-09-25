import { buildApiUrl } from './apiUrl.js';
import { ApiError, ErrorType } from './errors/ApiError.js';
import { parseError, parseNetworkError } from './errors/ErrorParser.js';
import { logDiagnosticEvent } from '../src/services/diagnosticsService.js';
const DEFAULT_TIMEOUT = 0x7530;
function isAbsoluteUrl(_0x3c48fd) {
  return /^https?:\/\//i['test'](_0x3c48fd);
}
function getRuntimeDeviceId() {
  return String(globalThis["window"]?.['__aicDeviceId'] || globalThis["__aicDeviceId"] || '')["trim"]();
}
function shouldAttachDeviceIdHeader(_0x427b67, _0x21d211, _0x3eb20a) {
  if (String(_0x21d211 || '')["trim"]()['toLowerCase']() === "local") {
    return !![];
  }
  if (_0x3eb20a === ![]) {
    return ![];
  }
  return !isAbsoluteUrl(String(_0x427b67 || ''));
}
function withDeviceIdHeader(_0x2b93be, _0x3e26af, _0x18ce2c, _0x501006) {
  const _0x28446d = getRuntimeDeviceId();
  if (!_0x28446d || !shouldAttachDeviceIdHeader(_0x3e26af, _0x18ce2c, _0x501006)) {
    return _0x2b93be || {};
  }
  const _0x5d0fdf = "X-AIC-Device-Id";
  if (typeof Headers !== "undefined" && _0x2b93be instanceof Headers) {
    const _0xd5156b = new Headers(_0x2b93be);
    if (!_0xd5156b['has'](_0x5d0fdf)) {
      _0xd5156b["set"](_0x5d0fdf, _0x28446d);
    }
    return _0xd5156b;
  }
  const _0x3d18b8 = {
    ...(_0x2b93be || {})
  };
  const _0x5c2d18 = Object['keys'](_0x3d18b8)['some'](_0x32827c => String(_0x32827c || '')["toLowerCase"]() === _0x5d0fdf["toLowerCase"]());
  if (!_0x5c2d18) {
    _0x3d18b8[_0x5d0fdf] = _0x28446d;
  }
  return _0x3d18b8;
}
function sleep(_0x473db1) {
  return new Promise(_0x2226ed => setTimeout(_0x2226ed, _0x473db1));
}
async function fetchWithTimeout(_0x41edc5, _0x2b9a5b = {}, _0x141a1b = DEFAULT_TIMEOUT, _0x5ac0ad, _0x1c42da) {
  const _0x30ce29 = new AbortController();
  const _0x2cbf96 = setTimeout(() => _0x30ce29["abort"](), _0x141a1b);
  let _0x3761d3 = null;
  if (_0x5ac0ad) {
    if (_0x5ac0ad["aborted"]) {
      _0x30ce29["abort"]();
    } else {
      _0x3761d3 = () => _0x30ce29["abort"]();
      _0x5ac0ad["addEventListener"]("abort", _0x3761d3, {
        'once': !![]
      });
    }
  }
  try {
    const _0x49eeca = await fetch(_0x41edc5, {
      ..._0x2b9a5b,
      'signal': _0x30ce29["signal"]
    });
    return await _0x1c42da(_0x49eeca);
  } finally {
    clearTimeout(_0x2cbf96);
    if (_0x5ac0ad && _0x3761d3) {
      _0x5ac0ad["removeEventListener"]("abort", _0x3761d3);
    }
  }
}
function shouldRetryError(_0x4522f1, _0x2b3b2a, _0x3affd5, _0x4587cb) {
  if (_0x4587cb?.["aborted"]) {
    return ![];
  }
  return !!_0x4522f1?.["retryable"] && _0x2b3b2a < _0x3affd5;
}
function shouldRetryRateLimit(_0x13d0c9, _0x5770a3, _0x238f2d, _0x2d3690) {
  if (_0x2d3690?.["aborted"] || _0x13d0c9?.["type"] !== ErrorType['RATE_LIMIT']) {
    return ![];
  }
  return _0x5770a3 < _0x238f2d;
}
function safeUrlForDiagnostics(_0x2de3d3) {
  const _0x78b2ae = String(_0x2de3d3 || '');
  try {
    const _0x31f71c = new URL(_0x78b2ae, "http://local.invalid");
    if (_0x78b2ae['startsWith']('/') || _0x78b2ae["startsWith"]("http://local.invalid")) {
      return _0x31f71c["pathname"];
    }
    return '' + _0x31f71c["origin"] + _0x31f71c['pathname'];
  } catch {
    return _0x78b2ae["split"](/[?#]/, 0x1)[0x0] || '';
  }
}
function reportRequestFailure({
  fullUrl: _0x3531f6,
  method: _0x476f6e,
  provider: _0x108e52,
  apiErr: _0x483aa4,
  attempt: _0x103215,
  retries: _0x1db159
}) {
  void logDiagnosticEvent({
    'type': "api.request_failed",
    'level': 'warn',
    'source': "renderer",
    'message': _0x483aa4?.['message'] || "API request failed",
    'context': {
      'method': _0x476f6e,
      'url': safeUrlForDiagnostics(_0x3531f6),
      'provider': _0x108e52,
      'status': _0x483aa4?.['status'] || _0x483aa4?.['statusCode'] || 0x0,
      'errorType': _0x483aa4?.["type"] || _0x483aa4?.["name"] || '',
      'retryable': Boolean(_0x483aa4?.["retryable"]),
      'attempts': _0x103215 + 0x1,
      'retries': _0x1db159
    },
    'stack': _0x483aa4?.["stack"] || ''
  });
}
async function parseResponseBody(_0x5c7203, _0x5b7edc) {
  if (_0x5b7edc === "blob") {
    return await _0x5c7203["blob"]();
  }
  if (_0x5b7edc === 'text') {
    return await _0x5c7203['text']();
  }
  if (_0x5b7edc === 'auto') {
    const _0x26030b = _0x5c7203["headers"]["get"]("content-type") || '';
    if (_0x26030b["includes"]("application/json")) {
      return await _0x5c7203["json"]();
    }
    const _0x3d222c = await _0x5c7203['text']();
    try {
      return JSON["parse"](_0x3d222c);
    } catch {
      return _0x3d222c;
    }
  }
  return await _0x5c7203["json"]();
}
async function parseErrorBody(_0xcc7a23) {
  try {
    const _0x1d088f = await _0xcc7a23["text"]();
    try {
      const _0x5c2052 = JSON["parse"](_0x1d088f);
      return _0x5c2052;
    } catch {
      return {
        'error': _0x1d088f || "HTTP " + _0xcc7a23["status"]
      };
    }
  } catch (_0xb94e7d) {
    if (_0xb94e7d?.['name'] === "AbortError") {
      throw _0xb94e7d;
    }
    return {
      'error': "HTTP " + _0xcc7a23["status"]
    };
  }
}
export async function requester(_0x1bee43) {
  const {
    url: _0x1cd873,
    method = 'GET',
    headers = {},
    body: _0x595963,
    timeout = DEFAULT_TIMEOUT,
    signal: _0x362b7c,
    retries = 0x0,
    retryDelay = 0x258,
    rateLimitRetries = 0x2,
    responseType = "auto",
    allow404Null = ![],
    provider = "unknown",
    errorParser: _0x40004b,
    buildUrl = !![],
    returnMeta = ![]
  } = _0x1bee43 || {};
  let _0x4926b1 = _0x1cd873 || '';
  buildUrl && !isAbsoluteUrl(_0x4926b1) && (_0x4926b1 = buildApiUrl(_0x4926b1));
  const _0x168ecd = withDeviceIdHeader(headers, _0x1cd873, provider, buildUrl);
  let _0x2106bd = 0x0;
  let _0x5d0f2a = 0x0;
  while (!![]) {
    try {
      return await fetchWithTimeout(_0x4926b1, {
        'method': method,
        'headers': _0x168ecd,
        'body': _0x595963
      }, timeout, _0x362b7c, async _0x3e7903 => {
        if (_0x3e7903["status"] === 0x194 && allow404Null) {
          return returnMeta ? {
            'data': null,
            'status': 0x194,
            'headers': _0x3e7903['headers']
          } : null;
        }
        if (!_0x3e7903['ok']) {
          const _0x253b0d = await parseErrorBody(_0x3e7903);
          const _0x18dcd8 = typeof _0x40004b === "function" ? _0x40004b(provider, _0x253b0d, _0x3e7903['status']) : parseError(provider, _0x253b0d, _0x3e7903["status"]);
          throw _0x18dcd8 || ApiError["fromHttpStatus"](_0x3e7903['status'], provider);
        }
        const _0x1fd2c7 = await parseResponseBody(_0x3e7903, responseType);
        return returnMeta ? {
          'data': _0x1fd2c7,
          'status': _0x3e7903["status"],
          'headers': _0x3e7903["headers"]
        } : _0x1fd2c7;
      });
    } catch (_0x198677) {
      const _0x465d20 = _0x198677 instanceof ApiError ? _0x198677 : parseNetworkError(provider, _0x198677, timeout);
      if (shouldRetryError(_0x465d20, _0x2106bd, retries, _0x362b7c)) {
        _0x2106bd++;
        await sleep(retryDelay * _0x2106bd);
        continue;
      }
      // 429 是提供商侧限流而非请求错误，等几秒通常即可恢复；批量生成时一次限流
      // 不应让整条任务失败，这里独立于 retries 做指数退避重试。
      if (shouldRetryRateLimit(_0x465d20, _0x5d0f2a, rateLimitRetries, _0x362b7c)) {
        await sleep(0x1388 * Math["pow"](0x2, _0x5d0f2a));
        _0x5d0f2a++;
        continue;
      }
      reportRequestFailure({
        'fullUrl': _0x4926b1,
        'method': method,
        'provider': provider,
        'apiErr': _0x465d20,
        'attempt': _0x2106bd,
        'retries': retries
      });
      throw _0x465d20;
    }
  }
}
export function get(_0x39bd6c, _0x5dbda2 = {}) {
  return requester({
    'url': _0x39bd6c,
    'method': 'GET',
    ..._0x5dbda2
  });
}
export function del(_0x59a066, _0x37fba5 = {}) {
  return requester({
    'url': _0x59a066,
    'method': "DELETE",
    ..._0x37fba5
  });
}
export function post(_0x4cb731, _0x5f1296, _0x4a89f8 = {}) {
  const _0x38973a = {
    ...(_0x4a89f8["headers"] || {})
  };
  let _0x253095 = _0x5f1296;
  _0x5f1296 !== undefined && !(_0x5f1296 instanceof FormData) && !(_0x5f1296 instanceof Blob) && !(_0x5f1296 instanceof ArrayBuffer) && (_0x38973a['Content-Type'] = _0x38973a["Content-Type"] || "application/json", _0x253095 = typeof _0x5f1296 === "string" ? _0x5f1296 : JSON["stringify"](_0x5f1296));
  return requester({
    'url': _0x4cb731,
    'method': "POST",
    'headers': _0x38973a,
    'body': _0x253095,
    ..._0x4a89f8
  });
}