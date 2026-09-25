export function visibleTextStreamContent(_0x5ccbd5) {
  let _0x17ad56 = String(_0x5ccbd5 || '')['replace'](/<think>[\s\S]*?(?:<\/think>\n?|$)/gu, '');
  for (let _0x36ae81 = Math["min"](0x6, _0x17ad56["length"]); _0x36ae81 > 0x0; _0x36ae81--) {
    if ("<think>"['startsWith'](_0x17ad56['slice'](-_0x36ae81))) {
      _0x17ad56 = _0x17ad56["slice"](0x0, -_0x36ae81);
      break;
    }
  }
  return _0x17ad56;
}
export function enableTextRequestStreaming(_0x16ece9, _0x43b539) {
  const _0x265e86 = String(_0x16ece9?.["body"]?.["apiUrl"] || _0x16ece9?.["url"] || '')["split"]('?')[0x0];
  const _0x4a5885 = /(?:\/chat\/completions|\/responses|\/proxy\/completions)\/?$/u["test"](_0x265e86) || _0x16ece9?.["url"] === '/api/v2/proxy/completions';
  if (typeof _0x43b539 !== "function" || !_0x4a5885 || !(Array["isArray"](_0x16ece9["body"]?.["messages"]) || Array['isArray'](_0x16ece9['body']?.["input"]))) {
    return _0x16ece9;
  }
  return {
    ..._0x16ece9,
    'body': {
      ..._0x16ece9["body"],
      'stream': !![]
    }
  };
}
export function shouldRetryWithoutTextStreaming(_0x4cc5e8, _0xc774bb, _0x53612f) {
  return _0x4cc5e8?.["body"]?.["stream"] === !![] && [0x190, 0x1a6]["includes"](_0xc774bb) && /\bstream(?:ing)?\b|流式/iu['test'](_0x53612f) && /not supported|unsupported|not available|must be false|不支持|不允许/iu['test'](_0x53612f);
}
export async function readTextEventStream(_0x27f765, {
  onText: _0x3beb80,
  signal: _0x25b2c3,
  timeoutMs = null
} = {}) {
  const _0x215bfb = _0x27f765["body"]["getReader"]();
  const _0x48b4cb = new TextDecoder();
  let _0x42c075 = '';
  let _0x55429e = '';
  let _0x134893 = ![];
  let _0xd19f66 = '';
  let _0x5dc6de = null;
  let _0x331b16 = null;
  const _0x5d83bd = _0x1bb363 => {
    _0x5dc6de = _0x1bb363;
    void _0x215bfb["cancel"]()['catch'](() => {});
  };
  const _0x2cece2 = () => _0x5d83bd(new DOMException('Request\x20aborted', "AbortError"));
  const _0x32cde9 = timeoutMs == null ? null : setTimeout(() => _0x5d83bd(new Error("回答超时，已保留收到的内容")), Math["max"](0x1, timeoutMs));
  _0x25b2c3?.["addEventListener"]("abort", _0x2cece2, {
    'once': !![]
  });
  if (_0x25b2c3?.["aborted"]) {
    _0x2cece2();
  }
  function _0x5241c5(_0x11742e) {
    const _0x3a223c = _0x11742e['split'](/\r?\n/u)["filter"](_0x5396ed => _0x5396ed["startsWith"]('data:'))['map'](_0x82194c => _0x82194c["slice"](0x5)["replace"](/^ /u, ''))["join"]('\x0a');
    if (!_0x3a223c["trim"]()) {
      return;
    }
    if (_0x3a223c["trim"]() === '[DONE]') {
      _0x134893 = !![];
      return;
    }
    const _0x427b04 = JSON["parse"](_0x3a223c);
    if (_0x427b04["error"] || ["error", "response.failed"]["includes"](_0x427b04["type"])) {
      throw new Error(_0x427b04["error"]?.["message"] || _0x427b04["response"]?.['error']?.['message'] || "回答流中断，请重试");
    }
    const _0x41a5aa = _0x427b04["choices"]?.["find"](_0x4c9727 => !_0x4c9727['index']) || null;
    let _0x467ffb = _0x41a5aa?.["delta"]?.["content"];
    if (_0x427b04['type'] === "response.output_text.delta") {
      _0x467ffb = _0x427b04["delta"];
    }
    if (typeof _0x467ffb === 'string' && _0x467ffb) {
      _0x55429e += _0x467ffb;
      if (_0x55429e['length'] > 0xf4240) {
        throw new Error("回答超过长度限制，请分段生成");
      }
      _0x3beb80?.(visibleTextStreamContent(_0x55429e));
    }
    _0x41a5aa?.["finish_reason"] && (_0xd19f66 = _0x41a5aa["finish_reason"], _0x134893 = !![]);
    if (_0x427b04['type'] === 'response.incomplete') {
      throw new Error("回答未完整结束，请重试或分段生成");
    }
    _0x427b04["type"] === "response.completed" && (_0x134893 = !![], _0x331b16 = _0x427b04["response"]);
  }
  try {
    while (!![]) {
      const {
        value: _0x13c223,
        done: _0x2b511b
      } = await _0x215bfb['read']();
      if (_0x5dc6de) {
        throw _0x5dc6de;
      }
      _0x42c075 += _0x2b511b ? _0x48b4cb['decode']() : _0x48b4cb["decode"](_0x13c223, {
        'stream': !![]
      });
      let _0x1cedec;
      while (_0x1cedec = /\r?\n\r?\n/u["exec"](_0x42c075)) {
        _0x5241c5(_0x42c075["slice"](0x0, _0x1cedec["index"]));
        _0x42c075 = _0x42c075['slice'](_0x1cedec["index"] + _0x1cedec[0x0]["length"]);
      }
      if (_0x42c075['length'] > 0x1e8480) {
        throw new Error('回答流格式异常');
      }
      if (_0x2b511b) {
        break;
      }
      if (_0x134893 && _0x42c075["trim"]() === '') {
        break;
      }
    }
    if (_0x42c075["trim"]()) {
      _0x5241c5(_0x42c075);
    }
    if (!_0x134893) {
      throw new Error("回答流意外中断，未收到结束标记");
    }
    const _0x108a5f = visibleTextStreamContent(_0x55429e);
    if (!_0x108a5f["trim"]()) {
      throw new Error("服务端未返回文本内容");
    }
    return {
      'text': _0x108a5f,
      'finishReason': _0xd19f66,
      'finalResponse': _0x331b16
    };
  } finally {
    clearTimeout(_0x32cde9);
    _0x25b2c3?.["removeEventListener"]("abort", _0x2cece2);
    await _0x215bfb["cancel"]()["catch"](() => {});
    _0x215bfb['releaseLock']();
  }
}