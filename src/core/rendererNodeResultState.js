const GENERATION_NODE_TYPES = ["ai-image", 'ai-text', "ai-video", 'ai-audio'];
const IMAGE_RESULT_FIELDS = ['src', "url", "imageUrl", "sourceUrl", "resultUrl", "thumbUrl", "localPath", 'originalLocalPath', "displayLocalPath", 'thumbLocalPath', 'thumbId'];
const VIDEO_RESULT_FIELDS = ["src", "url", "videoUrl", 'sourceUrl', "resultUrl", "videoLocalPath", "localPath", "originalLocalPath", "displayLocalPath", "thumbId", "thumbUrl", "posterUrl", "posterLocalPath", "thumbLocalPath", "videoThumbSrc", "videoMetaSrc"];
const AUDIO_RESULT_FIELDS = ["audioUrl", "url", "src", "resultUrl", "localPath"];
function matchesNodeType(_0x2aed0c, _0x51157d, _0x51d699) {
  if (typeof _0x51d699 === 'function') {
    return _0x51d699(_0x2aed0c, _0x51157d);
  }
  return String(_0x2aed0c?.['type'] || '') === _0x51157d;
}
function hasStringValue(_0x2ac53c) {
  return String(_0x2ac53c || '')["trim"]()["length"] > 0x0;
}
function hasAnyField(_0x180ae7, _0x10c8c0) {
  if (!_0x180ae7 || typeof _0x180ae7 !== "object") {
    return ![];
  }
  return _0x10c8c0['some'](_0x5de0c7 => hasStringValue(_0x180ae7[_0x5de0c7]));
}
function hasAnyResultItem(_0x2f9b2a, _0x4ebb10) {
  if (!Array['isArray'](_0x2f9b2a)) {
    return ![];
  }
  return _0x2f9b2a['some'](_0x52a2d9 => hasAnyField(_0x52a2d9, _0x4ebb10));
}
export function hasDisplayableImageResult(_0x516490) {
  return hasAnyField(_0x516490, IMAGE_RESULT_FIELDS) || hasAnyResultItem(_0x516490?.["images"], IMAGE_RESULT_FIELDS);
}
export function hasDisplayableVideoResult(_0x328f5d) {
  const _0x448e8a = Array["isArray"](_0x328f5d?.["videos"]) ? _0x328f5d["videos"] : [];
  if (hasAnyResultItem(_0x448e8a, VIDEO_RESULT_FIELDS)) {
    return !![];
  }
  if (_0x448e8a["some"](_0x394cd9 => hasStringValue(_0x394cd9?.["error"]))) {
    return ![];
  }
  return hasAnyField(_0x328f5d, VIDEO_RESULT_FIELDS);
}
export function hasDisplayableAudioResult(_0x3d7cc4) {
  return hasAnyField(_0x3d7cc4, AUDIO_RESULT_FIELDS) || hasAnyResultItem(_0x3d7cc4?.["audios"], AUDIO_RESULT_FIELDS);
}
export function hasDisplayableNodeResult(_0x4992d7, _0x2a67b9) {
  if (matchesNodeType(_0x4992d7, "ai-image", _0x2a67b9)) {
    return hasDisplayableImageResult(_0x4992d7);
  }
  if (matchesNodeType(_0x4992d7, 'ai-text', _0x2a67b9)) {
    return hasStringValue(_0x4992d7?.["outputText"]);
  }
  if (matchesNodeType(_0x4992d7, "ai-video", _0x2a67b9)) {
    return hasDisplayableVideoResult(_0x4992d7);
  }
  if (matchesNodeType(_0x4992d7, 'ai-audio', _0x2a67b9)) {
    return hasDisplayableAudioResult(_0x4992d7);
  }
  return ![];
}
export function isNodeMissingResult(_0x445b79, _0x7d1083) {
  if (!_0x445b79 || !GENERATION_NODE_TYPES["some"](_0x35d524 => matchesNodeType(_0x445b79, _0x35d524, _0x7d1083))) {
    return ![];
  }
  return !hasDisplayableNodeResult(_0x445b79, _0x7d1083);
}
export function syncNodeResultClass(_0xab30ca, _0x23bd18, _0x5a5f42) {
  if (!_0xab30ca?.["classList"]) {
    return;
  }
  isNodeMissingResult(_0x23bd18, _0x5a5f42) ? _0xab30ca['classList']['add']('no-result') : _0xab30ca["classList"]["remove"]("no-result");
}