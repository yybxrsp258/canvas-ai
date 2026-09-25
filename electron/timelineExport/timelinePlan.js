const MAX_MEDIA = 0x1f4;
const MAX_SLOTS = 0x7d0;
function number(_0x2f06b5, _0x3b0fc2 = 0x0) {
  const _0x1aecbf = Number(_0x2f06b5 ?? _0x3b0fc2);
  if (!Number["isFinite"](_0x1aecbf) || _0x1aecbf < 0x0 || _0x1aecbf > 0x15180 * 0x7) {
    throw new Error("剪辑工程包含无效的时间或尺寸");
  }
  return _0x1aecbf;
}
export function validateTimelineRequest(_0x4d4eb3 = {}) {
  if (!["premiere-xml", 'jianying-draft']["includes"](_0x4d4eb3["format"])) {
    throw new Error("不支持的剪辑工程格式");
  }
  if (!Array['isArray'](_0x4d4eb3['media']) || !_0x4d4eb3["media"]["length"] || _0x4d4eb3["media"]["length"] > MAX_MEDIA || !Array['isArray'](_0x4d4eb3['slots']) || !_0x4d4eb3["slots"]['length'] || _0x4d4eb3["slots"]['length'] > MAX_SLOTS || !Array["isArray"](_0x4d4eb3["tracks"]) || !_0x4d4eb3["tracks"]["length"] || _0x4d4eb3['tracks']['length'] > 0x10) {
    throw new Error("剪辑工程的素材或轨道数量无效");
  }
  const _0x5d42bd = new Set();
  const _0x4f93cc = _0x4d4eb3['media']["map"](_0x2a0311 => {
    const _0x551e2c = String(_0x2a0311?.['id'] || '');
    if (!_0x551e2c || _0x551e2c["length"] > 0x64 || _0x5d42bd["has"](_0x551e2c) || typeof _0x2a0311['localPath'] !== "string") {
      throw new Error("剪辑工程素材标识无效");
    }
    _0x5d42bd["add"](_0x551e2c);
    return {
      'id': _0x551e2c,
      'localPath': _0x2a0311["localPath"],
      'name': String(_0x2a0311["name"] || _0x551e2c)["slice"](0x0, 0x78)
    };
  });
  const _0x6eb251 = _0x4d4eb3["slots"]["map"](_0x335aff => {
    if (_0x335aff["durationMediaId"] && !_0x5d42bd["has"](_0x335aff['durationMediaId'])) {
      throw new Error("镜头时长引用无效");
    }
    return {
      'durationMediaId': _0x335aff["durationMediaId"] || '',
      'sourceStartSec': number(_0x335aff["sourceStartSec"]),
      'durationSec': _0x335aff["durationSec"] == null ? null : number(_0x335aff['durationSec'])
    };
  });
  const _0x5773b7 = _0x4d4eb3["tracks"]["map"](_0x15d8fa => {
    if (!["video", "audio"]["includes"](_0x15d8fa["type"]) || !Array["isArray"](_0x15d8fa['clips']) || _0x15d8fa["clips"]['length'] > MAX_SLOTS) {
      throw new Error("剪辑工程轨道无效");
    }
    const _0x5a5302 = new Set();
    return {
      'type': _0x15d8fa["type"],
      'name': String(_0x15d8fa["name"] || _0x15d8fa['type'])["slice"](0x0, 0x78),
      'muted': _0x15d8fa['muted'] === !![],
      'clips': _0x15d8fa["clips"]["map"](_0x58aa63 => {
        if (!Number['isInteger'](_0x58aa63["slot"]) || _0x58aa63['slot'] < 0x0 || _0x58aa63["slot"] >= _0x6eb251["length"] || _0x5a5302["has"](_0x58aa63["slot"]) || !_0x5d42bd['has'](_0x58aa63["mediaId"])) {
          throw new Error('剪辑工程片段引用无效');
        }
        _0x5a5302["add"](_0x58aa63["slot"]);
        return {
          'slot': _0x58aa63['slot'],
          'mediaId': _0x58aa63["mediaId"],
          'name': String(_0x58aa63["name"] || '片段')['slice'](0x0, 0x78),
          'sourceStartSec': number(_0x58aa63['sourceStartSec']),
          'sourceDurationSec': _0x58aa63["sourceDurationSec"] == null ? null : number(_0x58aa63["sourceDurationSec"])
        };
      })["sort"]((_0x2180a4, _0x47ba2f) => _0x2180a4["slot"] - _0x47ba2f["slot"])
    };
  });
  return {
    'format': _0x4d4eb3["format"],
    'name': String(_0x4d4eb3["name"] || "剪辑工程")["slice"](0x0, 0x78),
    'media': _0x4f93cc,
    'slots': _0x6eb251,
    'tracks': _0x5773b7
  };
}
export function parseFrameRate(_0x10b994) {
  const [_0x541bb7, _0x3d9c6d = '1'] = String(_0x10b994 || '0')["split"]('/');
  return Number(_0x541bb7) / Number(_0x3d9c6d) || 0x0;
}
export function timelineFrameRate(_0x2d849b) {
  const _0x40b064 = Math["round"](_0x2d849b * 0x3e9 / 0x3e8);
  return Math["abs"](_0x2d849b - _0x40b064 * 0x3e8 / 0x3e9) < 0.002 ? _0x40b064 * 0x3e8 / 0x3e9 : Math["ceil"](_0x2d849b);
}
export const timelineMicroseconds = _0x5b71c1 => Math["ceil"](_0x5b71c1 * 0xf4240 - 0.00001);
function streamDuration(_0x28623b) {
  return Number(_0x28623b?.["duration_ts"]) * parseFrameRate(_0x28623b?.["time_base"]) || Number(_0x28623b?.['duration']) || 0x0;
}
export function normalizeTimelineMediaMetadata(_0x5aed09 = {}) {
  const _0x3a4fb2 = _0x5aed09["streams"]?.["find"](_0x293ab7 => _0x293ab7['codec_type'] === "video" && !_0x293ab7["disposition"]?.["attached_pic"]);
  const _0x4c107b = _0x5aed09["streams"]?.["find"](_0x584200 => _0x584200["codec_type"] === "audio");
  const _0x123d14 = parseFrameRate(_0x3a4fb2?.['avg_frame_rate']) || parseFrameRate(_0x3a4fb2?.["r_frame_rate"]);
  const _0x5f41af = Number(_0x3a4fb2?.["nb_frames"]) || 0x0;
  const _0x37b853 = _0x5f41af && _0x123d14 ? _0x5f41af / _0x123d14 : 0x0;
  const _0x5a071a = streamDuration(_0x3a4fb2);
  const _0x50e059 = _0x37b853 && Math["abs"](_0x37b853 - _0x5a071a) < 0.000001 ? _0x37b853 : Math["max"](_0x5a071a, _0x37b853) || Number(_0x5aed09["format"]?.['duration']) || 0x0;
  if (!_0x3a4fb2 || !(_0x50e059 > 0x0) || !(_0x123d14 > 0x0) || _0x123d14 > 0xf0 || !(_0x3a4fb2['width'] > 0x0) || !(_0x3a4fb2["height"] > 0x0)) {
    throw new Error("无法读取视频的真实时长或帧率");
  }
  return {
    'durationSec': _0x50e059,
    'fps': _0x123d14,
    'frameCount': _0x5f41af,
    'width': _0x3a4fb2["width"],
    'height': _0x3a4fb2['height'],
    'hasAudio': Boolean(_0x4c107b),
    'channels': Number(_0x4c107b?.["channels"]) || 0x0,
    'sampleRate': Number(_0x4c107b?.["sample_rate"]) || 0xbb80,
    'audioDurationSec': _0x4c107b ? streamDuration(_0x4c107b) || _0x50e059 : 0x0
  };
}
export function resolveTimelinePlan(_0x1343fa, _0x16453b) {
  const _0x27f748 = _0x1343fa["media"]["map"](_0x51a246 => ({
    ..._0x51a246,
    ..._0x16453b["get"](_0x51a246['id'])
  }));
  const _0x2acd44 = new Map(_0x27f748["map"](_0x4891db => [_0x4891db['id'], _0x4891db]));
  const _0x42757b = timelineFrameRate(Math["max"](..._0x27f748["map"](_0x3f4ef0 => _0x3f4ef0['fps'])));
  const _0x2bdafd = _0x5ce68e => Math["ceil"](_0x5ce68e * _0x42757b - 1e-7);
  const _0x954351 = _0x1343fa["slots"]["map"](_0x246842 => {
    const _0x5a4652 = _0x2acd44["get"](_0x246842["durationMediaId"]);
    const _0x326054 = _0x5a4652 ? Math["max"](0x0, _0x5a4652['durationSec'] - _0x246842["sourceStartSec"]) : Infinity;
    const _0x5cf9ec = Math["min"](_0x246842["durationSec"] ?? _0x326054, _0x326054);
    if (!(_0x5cf9ec > 0x0) || !Number["isFinite"](_0x5cf9ec)) {
      throw new Error('空镜头缺少有效时长');
    }
    return _0x5cf9ec;
  });
  const _0x4b3252 = _0x1343fa["tracks"]['map']((_0x31c03e, _0x28164f) => ({
    ..._0x31c03e,
    'clips': _0x31c03e["clips"]['flatMap'](_0x1aeb39 => {
      const _0x119815 = _0x2acd44["get"](_0x1aeb39["mediaId"]);
      if (_0x31c03e["type"] === 'audio' && !_0x119815["hasAudio"]) {
        return [];
      }
      const _0x18dc95 = _0x31c03e['type'] === "audio" ? _0x119815["audioDurationSec"] : _0x119815["durationSec"];
      const _0x2b59d0 = _0x18dc95 - _0x1aeb39["sourceStartSec"];
      const _0x241dec = Math['min'](_0x2b59d0, _0x1aeb39['sourceDurationSec'] ?? Infinity);
      if (!(_0x241dec > 0x0)) {
        throw new Error(_0x1aeb39["name"] + "的素材范围已超出文件时长");
      }
      _0x954351[_0x1aeb39['slot']] = Math["max"](_0x954351[_0x1aeb39["slot"]], _0x241dec);
      return [{
        ..._0x1aeb39,
        'id': "clip-" + _0x28164f + '-' + _0x1aeb39["slot"],
        'source': _0x119815,
        'durationSec': _0x241dec,
        'durationUs': timelineMicroseconds(_0x241dec),
        'fullSource': _0x1aeb39["sourceStartSec"] === 0x0 && _0x241dec >= _0x18dc95 - 1e-7
      }];
    })
  }));
  let _0x43d894 = 0x0;
  let _0x124127 = 0x0;
  const _0x52be62 = _0x954351["map"](_0x4cd2ca => {
    const _0x53a330 = _0x2bdafd(_0x4cd2ca);
    const _0x100fb2 = timelineMicroseconds(_0x4cd2ca);
    const _0x2e1933 = {
      'startFrame': _0x43d894,
      'durationFrames': _0x53a330,
      'startSec': _0x124127 / 0xf4240,
      'startUs': _0x124127,
      'durationSec': _0x4cd2ca,
      'durationUs': _0x100fb2
    };
    _0x43d894 += _0x53a330;
    _0x124127 += _0x100fb2;
    return _0x2e1933;
  });
  const _0x32976b = _0x4b3252["map"](_0x2b0832 => ({
    ..._0x2b0832,
    'clips': _0x2b0832["clips"]["map"](_0x5a43cb => {
      const _0x176003 = _0x52be62[_0x5a43cb["slot"]];
      return {
        ..._0x5a43cb,
        'startFrame': _0x176003["startFrame"],
        'endFrame': _0x176003["startFrame"] + _0x2bdafd(_0x5a43cb['durationSec']),
        'startSec': _0x176003["startSec"],
        'startUs': _0x176003["startUs"]
      };
    })
  }));
  return {
    ..._0x1343fa,
    'media': _0x27f748,
    'fps': _0x42757b,
    'width': _0x27f748[0x0]['width'],
    'height': _0x27f748[0x0]["height"],
    'slots': _0x52be62,
    'tracks': _0x32976b,
    'durationFrames': _0x43d894,
    'durationSec': _0x124127 / 0xf4240,
    'durationUs': _0x124127
  };
}