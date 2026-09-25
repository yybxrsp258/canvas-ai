const TOP_LEVEL_IMAGE_FIELDS = Object["freeze"](["imageUrl", "localPath", "thumbUrl", 'thumbId']);
const IMAGE_RECORD_FIELDS = Object['freeze'](["imageUrl", "sourceUrl", "localPath", "originalLocalPath", 'displayLocalPath', 'thumbLocalPath', "thumbUrl", "thumbId"]);
function hasValue(_0x199b56) {
  return String(_0x199b56 || '')["trim"]()['length'] > 0x0;
}
function hasDisplayableImageRecord(_0x5671f7) {
  if (!_0x5671f7 || typeof _0x5671f7 !== "object") {
    return ![];
  }
  if (_0x5671f7['error']) {
    return ![];
  }
  return IMAGE_RECORD_FIELDS["some"](_0x402b7d => hasValue(_0x5671f7[_0x402b7d]));
}
export function hasAIGenMaskPreviewBaseImage(_0x5699b8) {
  if (!_0x5699b8 || typeof _0x5699b8 !== "object") {
    return ![];
  }
  const _0x127586 = Array["isArray"](_0x5699b8['images']) ? _0x5699b8['images'] : [];
  if (_0x127586['some'](_0x2f20ad => hasDisplayableImageRecord(_0x2f20ad))) {
    return !![];
  }
  return TOP_LEVEL_IMAGE_FIELDS['some'](_0x203445 => hasValue(_0x5699b8[_0x203445]));
}