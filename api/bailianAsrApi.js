export const BAILIAN_ASR_MODEL = "qwen-audio-3.0-asr-flash-filetrans";
export const BAILIAN_ASR_BASE_URL = "https://dashscope.aliyuncs.com";
export function normalizeBailianAsrSegments(_0x215105 = {}, _0x48591b = 0x0) {
  if (!Array["isArray"](_0x215105["transcripts"])) {
    throw new Error('百炼未返回有效的语音识别结果');
  }
  const _0x5dd545 = _0x48591b > 0x0 ? Math['round'](_0x48591b * 0x3e8) : Infinity;
  return _0x215105["transcripts"]["flatMap"](_0x11df63 => (_0x11df63["sentences"] || [])["flatMap"](_0x422130 => {
    const _0x22fd4b = Number(_0x422130["begin_time"]);
    const _0x38f6f8 = Number(_0x422130["end_time"]);
    if (!Number["isFinite"](_0x22fd4b) || !Number["isFinite"](_0x38f6f8) || _0x22fd4b < 0x0 || _0x38f6f8 <= _0x22fd4b) {
      return [];
    }
    const _0x3e9b56 = Math['min'](_0x5dd545, Math["round"](_0x22fd4b));
    const _0xe2da65 = Math["min"](_0x5dd545, Math["round"](_0x38f6f8));
    if (_0xe2da65 <= _0x3e9b56) {
      return [];
    }
    return [{
      'startMs': _0x3e9b56,
      'endMs': _0xe2da65,
      'sourceText': String(_0x422130['text'] || '')["trim"](),
      ...(_0x422130["speaker_id"] != null ? {
        'speaker': String(_0x422130["speaker_id"])
      } : {})
    }];
  }))['sort']((_0x1eabc2, _0x1516bd) => _0x1eabc2["startMs"] - _0x1516bd["startMs"]);
}
function requireHttps(_0x35f644) {
  const _0x49623e = new URL(_0x35f644);
  if (_0x49623e['protocol'] !== "https:" || _0x49623e['username'] || _0x49623e["password"]) {
    throw new Error("百炼接口需要有效的 HTTPS 地址");
  }
  return _0x49623e;
}
export async function transcribeBailianAudio({
  audio: _0x256371,
  filename = "speech.mp3",
  credentials = {},
  durationSec = 0x0,
  fetchImpl = globalThis["fetch"],
  throwIfCancelled = () => {},
  onProgress = () => {},
  timeoutMs = 0x28 * 0x3c * 0x3e8,
  pollIntervalMs = 0x7d0,
  sleep = _0x347c22 => new Promise(_0xf487b5 => setTimeout(_0xf487b5, _0x347c22)),
  now = Date["now"]
} = {}) {
  const _0x5ee35f = String(credentials["apiKey"] || '')["trim"]();
  if (!_0x5ee35f) {
    throw new Error('请在设置\x20>\x20API\x20Key\x20>\x20阿里云百炼填写\x20API\x20Key');
  }
  if (!(_0x256371?.["size"] > 0x0)) {
    throw new Error("待识别音频为空");
  }
  if (durationSec > 0xc * 0x3c * 0x3c || _0x256371['size'] > 0x2 * 0x400 ** 0x3) {
    throw new Error("百炼录音识别最多支持 12 小时、2 GB 文件");
  }
  const _0x58a09c = requireHttps(credentials["baseUrl"] || credentials["apiUrl"] || BAILIAN_ASR_BASE_URL)["origin"];
  const _0x20cb3f = {
    'Authorization': "Bearer " + _0x5ee35f
  };
  const _0x24f126 = now() + timeoutMs;
  const _0x54261f = () => {
    throwIfCancelled();
    if (now() >= _0x24f126) {
      throw new Error("百炼语音识别超时，请重试");
    }
  };
  const _0x390950 = async (_0x1cb06c, _0x22c343 = {}, _0x3b8c4e = !![]) => {
    _0x54261f();
    requireHttps(_0x1cb06c);
    const _0x4e14b8 = new AbortController();
    const _0x5daf7e = setTimeout(() => _0x4e14b8["abort"](), Math["min"](0x1d4c0, _0x24f126 - now()));
    const _0x85494f = setInterval(() => {
      try {
        _0x54261f();
      } catch {
        _0x4e14b8["abort"]();
      }
    }, 0xc8);
    try {
      const _0x5c13e5 = await fetchImpl(_0x1cb06c, {
        ..._0x22c343,
        'signal': _0x4e14b8["signal"],
        'redirect': "error"
      });
      _0x54261f();
      if (!_0x5c13e5['ok']) {
        if ([0x191, 0x193]["includes"](_0x5c13e5["status"])) {
          throw new Error("阿里云百炼 API Key 无效或没有模型访问权限");
        }
        const _0x25efd1 = typeof _0x5c13e5["json"] === "function" ? await _0x5c13e5['json']()["catch"](() => ({})) : {};
        throw new Error(String(_0x25efd1?.["message"] || _0x25efd1?.["code"] || '百炼语音请求失败（HTTP\x20' + _0x5c13e5["status"] + '）'));
      }
      const _0x452f0a = _0x3b8c4e ? await _0x5c13e5["json"]() : null;
      _0x54261f();
      if (_0x452f0a?.["code"]) {
        throw new Error(String(_0x452f0a["message"] || _0x452f0a["code"]));
      }
      return _0x452f0a;
    } catch (_0x496600) {
      _0x54261f();
      const _0x2b39d6 = _0x496600?.["name"] === "AbortError" ? "百炼语音请求超时，请重试" : String(_0x496600?.['message'] || _0x496600);
      throw new Error(_0x2b39d6['split'](_0x5ee35f)["join"]("***"));
    } finally {
      clearTimeout(_0x5daf7e);
      clearInterval(_0x85494f);
    }
  };
  onProgress(0.1, 'Uploading\x20audio\x20to\x20Bailian');
  const {
    data: _0x22edef
  } = await _0x390950(_0x58a09c + "/api/v1/uploads?action=getPolicy&model=" + BAILIAN_ASR_MODEL, {
    'headers': _0x20cb3f
  });
  const _0x123351 = {
    'OSSAccessKeyId': "oss_access_key_id",
    'Signature': "signature",
    'policy': "policy",
    'x-oss-object-acl': "x_oss_object_acl",
    'x-oss-forbid-overwrite': 'x_oss_forbid_overwrite'
  };
  if (!_0x22edef?.["upload_dir"] || !_0x22edef["upload_host"] || Object["values"](_0x123351)["some"](_0xce2d9d => _0x22edef[_0xce2d9d] == null)) {
    throw new Error("百炼未返回有效的上传凭证");
  }
  if (!(Number(_0x22edef["max_file_size_mb"]) > 0x0) || _0x256371["size"] > Number(_0x22edef["max_file_size_mb"]) * 0x400 ** 0x2) {
    throw new Error("音频超过百炼临时上传大小限制（" + (Number(_0x22edef['max_file_size_mb']) || 0x0) + " MB）");
  }
  const _0xcdad34 = _0x22edef['upload_dir'] + '/' + filename;
  const _0x4d5e29 = new FormData();
  for (const [_0x2b6eb0, _0x415a05] of Object['entries'](_0x123351)) {
    _0x4d5e29["append"](_0x2b6eb0, String(_0x22edef[_0x415a05]));
  }
  _0x4d5e29['append']("key", _0xcdad34);
  _0x4d5e29['append']("success_action_status", "200");
  _0x4d5e29['append']('file', _0x256371, filename);
  await _0x390950(_0x22edef["upload_host"], {
    'method': "POST",
    'body': _0x4d5e29
  }, ![]);
  onProgress(0.16, "Submitting Bailian subtitle recognition");
  let _0x15b038 = await _0x390950(_0x58a09c + "/api/v1/services/audio/asr/transcription", {
    'method': "POST",
    'headers': {
      ..._0x20cb3f,
      'Content-Type': "application/json",
      'X-DashScope-Async': "enable",
      'X-DashScope-OssResourceResolve': "enable"
    },
    'body': JSON['stringify']({
      'model': BAILIAN_ASR_MODEL,
      'input': {
        'file_urls': ['oss://' + _0xcdad34]
      },
      'parameters': {
        'channel_id': [0x0],
        'diarization_enabled': !![]
      }
    })
  });
  const _0x3c397c = _0x15b038?.["output"]?.["task_id"];
  if (!_0x3c397c) {
    throw new Error("百炼未返回语音识别任务 ID");
  }
  let _0x4c938d = 0.22;
  while (!![]) {
    _0x54261f();
    const _0x1c54f5 = _0x15b038?.["output"] || {};
    if (_0x1c54f5["task_status"] === "SUCCEEDED") {
      const _0x1516a0 = _0x1c54f5["results"]?.[0x0];
      if (_0x1516a0?.['subtask_status'] !== 'SUCCEEDED' || !_0x1516a0['transcription_url']) {
        throw new Error(String(_0x1516a0?.["message"] || _0x1516a0?.["code"] || "百炼音频转写子任务失败")['split'](_0x5ee35f)["join"]('***'));
      }
      const _0x2a44b4 = await _0x390950(_0x1516a0["transcription_url"]);
      return {
        'segments': normalizeBailianAsrSegments(_0x2a44b4, durationSec)
      };
    }
    if (!["PENDING", "RUNNING"]["includes"](_0x1c54f5["task_status"])) {
      throw new Error(String(_0x1c54f5["message"] || _0x1c54f5["code"] || "百炼语音任务失败：" + (_0x1c54f5["task_status"] || "UNKNOWN"))["split"](_0x5ee35f)["join"]("***"));
    }
    for (let _0x2a94c1 = pollIntervalMs; _0x2a94c1 > 0x0; _0x2a94c1 -= 0xc8) {
      await sleep(Math["min"](_0x2a94c1, 0xc8));
      _0x54261f();
    }
    _0x4c938d = Math["min"](0.52, _0x4c938d + 0.025);
    onProgress(_0x4c938d, "Recognizing subtitles with Bailian");
    _0x15b038 = await _0x390950(_0x58a09c + "/api/v1/tasks/" + encodeURIComponent(_0x3c397c), {
      'headers': _0x20cb3f
    });
  }
}