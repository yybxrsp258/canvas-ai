class CameraPromptMapper {
  constructor() {
    this["AZIMUTH_OPTIONS"] = [{
      'key': 'frontView',
      'promptKey': "front view",
      'value': 0x0
    }, {
      'key': "frontRightQuarterView",
      'promptKey': "front-right quarter view",
      'value': -0x2d
    }, {
      'key': 'rightSideView',
      'promptKey': "right side view",
      'value': -0x5a
    }, {
      'key': "backRightQuarterView",
      'promptKey': "back-right quarter view",
      'value': -0x87
    }, {
      'key': "backView",
      'promptKey': "back view",
      'value': 0xb4
    }, {
      'key': "backLeftQuarterView",
      'promptKey': "back-left quarter view",
      'value': 0x87
    }, {
      'key': "leftSideView",
      'promptKey': "left side view",
      'value': 0x5a
    }, {
      'key': "frontLeftQuarterView",
      'promptKey': "front-left quarter view",
      'value': 0x2d
    }];
    this["ELEVATION_OPTIONS"] = [{
      'key': 'lowAngleShot',
      'promptKey': 'low-angle\x20shot',
      'value': -0x1e
    }, {
      'key': "eyeLevelShot",
      'promptKey': "eye-level shot",
      'value': 0x0
    }, {
      'key': "elevatedShot",
      'promptKey': "elevated shot",
      'value': 0x1e
    }, {
      'key': "highAngleShot",
      'promptKey': "high-angle shot",
      'value': 0x3c
    }];
    this["ZOOM_RANGES"] = [{
      'key': "wideShot",
      'promptKey': "wide shot",
      'min': 0.1,
      'max': 0.85,
      'centerValue': 0.5
    }, {
      'key': 'mediumShot',
      'promptKey': "medium shot",
      'min': 0.85,
      'max': 1.5,
      'centerValue': 1.2
    }, {
      'key': "closeUp",
      'promptKey': "close-up",
      'min': 1.5,
      'max': 0x2,
      'centerValue': 1.8
    }];
  }
  ['normalizeAzimuth'](_0x11e584) {
    let _0x3cf913 = _0x11e584 % 0x168;
    if (_0x3cf913 > 0xb4) {
      _0x3cf913 -= 0x168;
    }
    if (_0x3cf913 <= -0xb4) {
      _0x3cf913 += 0x168;
    }
    return _0x3cf913;
  }
  ["findClosestAzimuth"](_0x32a93f) {
    const _0x46ac0e = this['normalizeAzimuth'](_0x32a93f);
    let _0x1bc572 = this["AZIMUTH_OPTIONS"][0x0];
    let _0x197da8 = Math['abs'](_0x46ac0e - _0x1bc572["value"]);
    for (const _0x4fc079 of this['AZIMUTH_OPTIONS']) {
      const _0x516b87 = Math["abs"](_0x46ac0e - _0x4fc079['value']);
      _0x516b87 < _0x197da8 && (_0x197da8 = _0x516b87, _0x1bc572 = _0x4fc079);
    }
    return _0x1bc572;
  }
  ["findClosestElevation"](_0x19ecae) {
    let _0x44df09 = this['ELEVATION_OPTIONS'][0x0];
    let _0x3201ac = Math["abs"](_0x19ecae - _0x44df09["value"]);
    for (const _0x11b2da of this['ELEVATION_OPTIONS']) {
      const _0x14bf4d = Math["abs"](_0x19ecae - _0x11b2da["value"]);
      _0x14bf4d < _0x3201ac && (_0x3201ac = _0x14bf4d, _0x44df09 = _0x11b2da);
    }
    return _0x44df09;
  }
  ["findZoomRange"](_0xf9a9da) {
    for (const _0x3e60ec of this["ZOOM_RANGES"]) {
      if (_0xf9a9da >= _0x3e60ec["min"] && _0xf9a9da < _0x3e60ec["max"]) {
        return _0x3e60ec;
      }
    }
    return this["ZOOM_RANGES"][this["ZOOM_RANGES"]["length"] - 0x1];
  }
  ['generatePrompt'](_0x5b0b5d) {
    if (!_0x5b0b5d) {
      return '';
    }
    const {
      rotation = 0x23,
      pitch = 0x14,
      scale = 0.5
    } = _0x5b0b5d;
    const _0x23d124 = this['findZoomRange'](scale)['promptKey'];
    const _0x8e2dd2 = this["findClosestAzimuth"](rotation)["promptKey"];
    const _0xbcba73 = this["findClosestElevation"](pitch)["promptKey"];
    return "switch the camera perspective: " + _0x23d124 + ',\x20' + _0x8e2dd2 + ',\x20' + _0xbcba73;
  }
}
const cameraPromptMapper = new CameraPromptMapper();
export function applyCameraAngleToPrompt(_0x39204f, _0x10fd7e) {
  const _0x4e32d7 = String(_0x39204f || '');
  if (!_0x10fd7e) {
    return _0x4e32d7;
  }
  const _0x488bd3 = cameraPromptMapper["generatePrompt"](_0x10fd7e);
  if (!_0x488bd3) {
    return _0x4e32d7;
  }
  return _0x488bd3 + (_0x4e32d7 ? ',\x20' + _0x4e32d7 : '');
}