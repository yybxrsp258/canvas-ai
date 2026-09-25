const text = _0x51c41d => String(_0x51c41d ?? '')['trim']();
const escapeRegExp = _0xbb286e => _0xbb286e["replace"](/[.*+?^${}()|[\]\\]/gu, "\\$&");
const escapeHtml = _0xa070e7 => _0xa070e7["replace"](/&/gu, "&amp;")["replace"](/</gu, "&lt;")["replace"](/>/gu, "&gt;")["replace"](/"/gu, "&quot;");
export function protectStoryPromptPills(_0x53910b = '') {
  const _0x256dde = [];
  const _0x2ca961 = String(_0x53910b);
  const _0x552cb8 = /<span\b[^>]*\bclass\s*=\s*["'][^"']*\bref-pill\b[^"']*["'][^>]*>/giu;
  let _0x1812c3 = '';
  let _0x370ff7 = 0x0;
  let _0x3d0001;
  while (_0x3d0001 = _0x552cb8['exec'](_0x2ca961)) {
    const _0x3d868d = /<\/?span\b[^>]*>/giu;
    _0x3d868d["lastIndex"] = _0x552cb8['lastIndex'];
    let _0x3132ea = 0x1;
    let _0x1f6676 = _0x552cb8["lastIndex"];
    let _0x2368c9;
    while (_0x3132ea && (_0x2368c9 = _0x3d868d["exec"](_0x2ca961))) {
      _0x3132ea += /^<\//u["test"](_0x2368c9[0x0]) ? -0x1 : 0x1;
      _0x1f6676 = _0x3d868d['lastIndex'];
    }
    if (_0x3132ea) {
      break;
    }
    const _0x44cd16 = "story-pill-" + _0x256dde['length'] + '';
    _0x256dde["push"]({
      'token': _0x44cd16,
      'html': _0x2ca961["slice"](_0x3d0001['index'], _0x1f6676)
    });
    _0x1812c3 += _0x2ca961["slice"](_0x370ff7, _0x3d0001["index"]) + _0x44cd16;
    _0x370ff7 = _0x1f6676;
    _0x552cb8["lastIndex"] = _0x1f6676;
  }
  return {
    'source': _0x1812c3 + _0x2ca961["slice"](_0x370ff7),
    'pills': _0x256dde,
    'restore': _0x539e17 => _0x256dde["reduce"]((_0x201850, _0x383a04) => _0x201850["split"](_0x383a04["token"])["join"](_0x383a04['html']), _0x539e17)
  };
}
export function syncStoryClipPromptReferences(_0x584298, _0x4c302e = []) {
  const _0x3158dd = protectStoryPromptPills(_0x584298 || '');
  let _0x369601 = _0x3158dd['source'];
  const _0x19574b = _0x3158dd["pills"]['length'] > 0x0;
  _0x4c302e['some'](_0x12a57b => _0x12a57b["replicationSource"]) && (_0x369601 = _0x369601["split"]('\x0a')["filter"](_0x20d900 => text(_0x20d900) !== "保留原视频的视觉风格、场景和道具")["join"]('\x0a'));
  for (const _0x2f2e62 of _0x4c302e) {
    for (const _0x3bc1dc of _0x2f2e62["appearances"] || []) {
      const _0x306733 = '@' + text(_0x2f2e62['name']) + (text(_0x3bc1dc["name"]) ? " · " + text(_0x3bc1dc["name"]) : '');
      const _0x10e89a = new RegExp("<span\\b(?=[^>]*\\bdata-label=\"" + escapeRegExp(escapeHtml(_0x306733["slice"](0x1))) + '\x22)[^>]*>[\x5cs\x5cS]*?<\x5c/span>', 'gu');
      const _0x49ee01 = _0x3158dd["pills"]["filter"](_0x41b535 => {
        _0x10e89a['lastIndex'] = 0x0;
        return _0x41b535["html"]['includes']("data-asset-id=\"story-asset:" + encodeURIComponent(_0x2f2e62['id']) + ':' + encodeURIComponent(_0x3bc1dc['id']) + '\x22') || _0x10e89a["test"](_0x41b535["html"]);
      })["map"](_0x384b52 => _0x384b52["token"]);
      const _0x4c2d66 = [_0x306733, ..._0x49ee01];
      if (_0x2f2e62["kind"] === "character" && _0x3bc1dc['sourceOrigin'] === "library" && _0x3bc1dc["imageUrl"]) {
        for (const _0x48c4b1 of new Set(_0x4c2d66)) {
          const _0xcd43ae = _0x48c4b1 !== _0x306733;
          const _0x30e468 = _0xcd43ae ? "&lt;" : '<';
          const _0x10a41c = _0xcd43ae ? "&gt;" : '>';
          const _0x5fb887 = _0xcd43ae ? escapeHtml(text(_0x2f2e62['name'])) : text(_0x2f2e62['name']);
          const _0xee6e1a = new RegExp("(^|\\n|<div>|<p>|<br\\s*/?>)将" + _0x30e468 + escapeRegExp(_0x48c4b1) + _0x10a41c + '[^\x5cn]*?定义为' + _0x30e468 + escapeRegExp(_0x5fb887) + _0x10a41c + "。(?=$|\\n|</div>|</p>|<br\\s*/?>)", 'gu');
          _0x369601 = _0x369601["replace"](_0xee6e1a, (_0x5b2e26, _0xe73907) => _0xe73907 + '将' + _0x30e468 + _0x48c4b1 + _0x10a41c + "定义为" + _0x30e468 + _0x5fb887 + _0x10a41c + "。人物外观、发型和服装以该参考图为准。");
        }
        if (_0x4c2d66["some"](_0x1d671c => _0x369601["includes"](_0x1d671c))) {
          _0x369601 = _0x369601['split']('\x0a')["filter"](_0x247278 => !_0x247278["startsWith"]('声音设定（' + _0x2f2e62["name"] + '）：'))["join"]('\x0a');
        }
      }
      if (_0x2f2e62['replicationSource'] && ["scene", "prop"]["includes"](_0x2f2e62['kind']) && !text(_0x3bc1dc['imageUrl'])) {
        const _0x61e527 = text(_0x3bc1dc["description"] || _0x2f2e62["description"]);
        const _0x2643ad = '' + text(_0x2f2e62["name"]) + (_0x61e527 ? '（' + _0x61e527 + '）' : '');
        _0x369601 = _0x369601['replace'](new RegExp(escapeRegExp(_0x306733) + '(?=$|[。；;，,：:\x5cs<>])', 'gu'), () => _0x2643ad);
        if (_0x19574b) {
          for (const _0x44fdff of _0x49ee01) {
            _0x369601 = _0x369601['split'](_0x44fdff)['join'](escapeHtml(_0x2643ad));
          }
        }
      }
    }
  }
  return _0x3158dd["restore"](_0x369601["trim"]());
}