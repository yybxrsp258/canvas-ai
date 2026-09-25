import { pathToFileURL } from 'node:url';
const xml = _0x5bd353 => String(_0x5bd353 ?? '')["replace"](/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')["replace"](/&/g, "&amp;")["replace"](/</g, "&lt;")["replace"](/>/g, "&gt;")["replace"](/"/g, "&quot;")["replace"](/'/g, "&apos;");
export function premiereMediaPathUrl(_0x1b25ae) {
  const _0x15b950 = /^[a-z]:[\\/]|^\\\\/i["test"](_0x1b25ae);
  const _0x320688 = pathToFileURL(_0x1b25ae, {
    'windows': _0x15b950
  })['href'];
  return _0x320688["replace"](/^file:\/\/\/([a-z]):\//i, "file://localhost/$1%3A/")["replace"](/^file:\/\/\//, "file://localhost/");
}
export function xmlFrameRate(_0x28b8a2) {
  const _0x4f746e = Math["round"](_0x28b8a2 * 0x3e9 / 0x3e8);
  const _0x2dbee3 = Math["abs"](_0x28b8a2 - _0x4f746e * 0x3e8 / 0x3e9) < 0.002;
  return "<rate><timebase>" + (_0x2dbee3 ? _0x4f746e : Math['ceil'](_0x28b8a2)) + '</timebase><ntsc>' + (_0x2dbee3 ? 'TRUE' : "FALSE") + "</ntsc></rate>";
}
function videoCharacteristics(_0x507d07) {
  return '<samplecharacteristics>' + xmlFrameRate(_0x507d07["fps"]) + '<width>' + _0x507d07["width"] + "</width><height>" + _0x507d07["height"] + "</height><anamorphic>FALSE</anamorphic><pixelaspectratio>square</pixelaspectratio><fielddominance>none</fielddominance></samplecharacteristics>";
}
function sourceFrames(_0x3d2f6c, _0x181915 = "video") {
  return _0x181915 === 'audio' ? Math["ceil"](_0x3d2f6c["audioDurationSec"] * _0x3d2f6c["fps"] - 1e-7) : _0x3d2f6c["frameCount"] || Math['ceil'](_0x3d2f6c["durationSec"] * _0x3d2f6c["fps"] - 1e-7);
}
export function buildPremiereXml(_0x8118a7, _0xb2f4b9) {
  const _0x46c19d = new Set();
  const _0x576ebf = new Map(_0x8118a7["media"]["map"]((_0x27054e, _0x32072b) => [_0x27054e['id'], "file-" + (_0x32072b + 0x1)]));
  const _0x2e7292 = _0xeb4d83 => {
    const _0x48eb7d = _0x576ebf["get"](_0xeb4d83['id']);
    if (_0x46c19d["has"](_0x48eb7d)) {
      return '<file\x20id=\x22' + _0x48eb7d + "\"/>";
    }
    _0x46c19d["add"](_0x48eb7d);
    const _0x2f1a5f = Math['max'](sourceFrames(_0xeb4d83), _0xeb4d83['hasAudio'] ? sourceFrames(_0xeb4d83, "audio") : 0x0);
    return "<file id=\"" + _0x48eb7d + "\"><name>" + xml(_0xeb4d83["name"]) + "</name><pathurl>" + xml(premiereMediaPathUrl(_0xb2f4b9["get"](_0xeb4d83['id']))) + '</pathurl>' + xmlFrameRate(_0xeb4d83['fps']) + '<duration>' + _0x2f1a5f + '</duration><media><video>' + videoCharacteristics(_0xeb4d83) + "</video>" + (_0xeb4d83["hasAudio"] ? "<audio><samplecharacteristics><depth>16</depth><samplerate>" + _0xeb4d83['sampleRate'] + "</samplerate></samplecharacteristics><channelcount>" + _0xeb4d83["channels"] + "</channelcount></audio>" : '') + "</media></file>";
  };
  const _0x4206f6 = _0x8118a7['tracks']['map']((_0x12bd57, _0x5b42ea) => ({
    ..._0x12bd57,
    'typeIndex': _0x8118a7["tracks"]["slice"](0x0, _0x5b42ea + 0x1)['filter'](_0x715263 => _0x715263["type"] === _0x12bd57['type'])["length"]
  }));
  const _0x599b35 = _0x195ca3 => _0x4206f6["flatMap"](_0x3f7bfe => _0x3f7bfe["clips"]["flatMap"]((_0x150d2a, _0x5d2575) => _0x150d2a["slot"] === _0x195ca3["slot"] && _0x150d2a["mediaId"] === _0x195ca3["mediaId"] ? ["<link><linkclipref>" + _0x150d2a['id'] + "</linkclipref><mediatype>" + _0x3f7bfe["type"] + '</mediatype><trackindex>' + _0x3f7bfe["typeIndex"] + '</trackindex><clipindex>' + (_0x5d2575 + 0x1) + "</clipindex>" + (_0x3f7bfe["type"] === "audio" ? "<groupindex>1</groupindex>" : '') + '</link>'] : []));
  const _0x5d0340 = _0xbfe1f2 => "<track" + (_0xbfe1f2["type"] === "audio" ? '\x20premiereTrackType=\x22Stereo\x22\x20currentExplodedTrackIndex=\x220\x22\x20totalExplodedTrackCount=\x222\x22' : '') + "><name>" + xml(_0xbfe1f2["name"]) + "</name>" + _0xbfe1f2["clips"]['map'](_0x5c8116 => {
    const _0x25d6fe = _0x5c8116["source"];
    const _0x1ca4e7 = sourceFrames(_0x25d6fe, _0xbfe1f2['type']);
    const _0x3a6030 = Math["floor"](_0x5c8116["sourceStartSec"] * _0x25d6fe["fps"] + 1e-7);
    const _0x5788cc = _0x5c8116["fullSource"] ? _0x1ca4e7 : Math['min'](_0x1ca4e7, Math['ceil']((_0x5c8116["sourceStartSec"] + _0x5c8116['durationSec']) * _0x25d6fe["fps"] - 1e-7));
    const _0x3ba497 = Math["min"](_0x8118a7["width"] / _0x25d6fe["width"], _0x8118a7["height"] / _0x25d6fe['height']) * 0x64;
    const _0xeb6f6c = _0xbfe1f2["type"] === 'video' && Math['abs'](_0x3ba497 - 0x64) > 1e-7 ? "<filter><effect><name>Basic Motion</name><effectid>basic</effectid><effectcategory>motion</effectcategory><effecttype>motion</effecttype><mediatype>video</mediatype><parameter><parameterid>scale</parameterid><name>Scale</name><value>" + _0x3ba497 + "</value></parameter></effect></filter>" : '';
    return "<clipitem id=\"" + _0x5c8116['id'] + '\x22' + (_0xbfe1f2["type"] === "audio" ? " premiereChannelType=\"" + (_0x25d6fe["channels"] === 0x1 ? "mono" : "stereo") + '\x22' : '') + "><name>" + xml(_0x5c8116["name"]) + "</name><enabled>TRUE</enabled><duration>" + _0x1ca4e7 + '</duration>' + xmlFrameRate(_0x25d6fe["fps"]) + "<start>" + _0x5c8116["startFrame"] + "</start><end>" + _0x5c8116["endFrame"] + "</end><in>" + _0x3a6030 + '</in><out>' + _0x5788cc + "</out>" + _0x2e7292(_0x25d6fe) + (_0xbfe1f2["type"] === "audio" ? "<sourcetrack><mediatype>audio</mediatype><trackindex>1</trackindex></sourcetrack>" : '') + _0xeb6f6c + _0x599b35(_0x5c8116)["join"]('') + '</clipitem>';
  })["join"]('') + "<enabled>" + (_0xbfe1f2["muted"] ? "FALSE" : "TRUE") + "</enabled><locked>FALSE</locked></track>";
  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE xmeml>\n<xmeml version=\"5\"><sequence id=\"sequence-1\"><name>" + xml(_0x8118a7["name"]) + "</name><duration>" + _0x8118a7["durationFrames"] + "</duration>" + xmlFrameRate(_0x8118a7["fps"]) + "<media><video><format>" + videoCharacteristics(_0x8118a7) + "</format>" + _0x4206f6["filter"](_0x33f289 => _0x33f289["type"] === "video")["map"](_0x5d0340)["join"]('') + "</video><audio><numOutputChannels>2</numOutputChannels><format><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics></format>" + _0x4206f6["filter"](_0x88073e => _0x88073e['type'] === "audio")["map"](_0x5d0340)["join"]('') + "</audio></media></sequence></xmeml>\n";
}