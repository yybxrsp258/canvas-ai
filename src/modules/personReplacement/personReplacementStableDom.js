function nodeKey(_0x30d547) {
  if (_0x30d547['nodeType'] === 0x3 && !_0x30d547["nodeValue"]['trim']()) {
    let _0x2886ca = _0x30d547["nextSibling"];
    while (_0x2886ca?.["nodeType"] === 0x3 && !_0x2886ca["nodeValue"]["trim"]()) {
      _0x2886ca = _0x2886ca["nextSibling"];
    }
    return "space:" + (_0x2886ca ? nodeKey(_0x2886ca) : 'end');
  }
  if (_0x30d547["nodeType"] !== 0x1) {
    return String(_0x30d547["nodeType"]);
  }
  if (_0x30d547["matches"](".story-asset-card-shell")) {
    const _0x41a920 = _0x30d547["querySelector"](":scope > [data-story-asset-id]");
    if (_0x41a920) {
      return _0x30d547["tagName"] + ':shell:' + _0x41a920["dataset"]["storyAssetId"];
    }
  }
  const _0x2d1511 = _0x30d547["dataset"] || {};
  const _0x408491 = _0x2d1511['personReplacementShotCard'] === "true" ? _0x2d1511["shotId"] : _0x2d1511["storyAssetId"] || _0x2d1511["personReplacementVideoReferenceKey"] || _0x2d1511["slot"];
  const _0x59fb32 = _0x2d1511['personReplacementAction'] || _0x2d1511["storyAction"];
  const _0x426b12 = _0x408491 ? "item:" + _0x408491 : _0x59fb32 ? "action:" + _0x59fb32 + ':' + (_0x2d1511["characterId"] || _0x2d1511["sourceId"] || _0x2d1511['shotId'] || '') : _0x30d547['id'] || String(_0x30d547["getAttribute"]("class") || '')["split"](/\s+/)['find'](_0x3e21e3 => _0x3e21e3 && !_0x3e21e3["startsWith"]('is-')) || '';
  return _0x30d547["tagName"] + ':' + _0x426b12;
}
export function reconcilePersonReplacementStableDom(_0x12a69b, _0x1aa8d8, {
  preserveSelector = '',
  syncAttributes: _0xce46ef,
  syncImage: _0xfd4cc7
} = {}) {
  const _0x25a008 = (_0x4909d4, _0x3ed412) => {
    if (preserveSelector && _0x4909d4["matches"]?.(preserveSelector) && _0x3ed412["matches"]?.(preserveSelector)) {
      return;
    }
    if (_0x4909d4["nodeType"] !== 0x1) {
      if (_0x4909d4['nodeValue'] !== _0x3ed412["nodeValue"]) {
        _0x4909d4["nodeValue"] = _0x3ed412["nodeValue"];
      }
      return;
    }
    if (_0x4909d4["tagName"] === "IMG") {
      _0xfd4cc7(_0x4909d4, _0x3ed412);
      return;
    }
    _0xce46ef(_0x4909d4, _0x3ed412);
    const _0x464141 = new Set(_0x4909d4['childNodes']);
    const _0x479ce2 = [..._0x3ed412["childNodes"]]["map"](_0x267687 => {
      const _0x395cb1 = nodeKey(_0x267687);
      const _0x3dfbfd = [..._0x464141]["find"](_0xace7d0 => nodeKey(_0xace7d0) === _0x395cb1);
      if (_0x3dfbfd) {
        _0x464141["delete"](_0x3dfbfd);
      }
      return {
        'child': _0x267687,
        'match': _0x3dfbfd
      };
    });
    for (const _0x33c274 of _0x464141) {
      _0x33c274['remove']();
    }
    let _0x119430 = _0x4909d4['firstChild'];
    for (const {
      child: _0x5801ea,
      match: _0x97dacc
    } of _0x479ce2) {
      if (_0x97dacc) {
        _0x25a008(_0x97dacc, _0x5801ea);
        if (_0x97dacc !== _0x119430) {
          _0x4909d4['insertBefore'](_0x97dacc, _0x119430);
        }
        _0x119430 = _0x97dacc["nextSibling"];
      } else {
        _0x4909d4["insertBefore"](_0x5801ea, _0x119430);
      }
    }
  };
  _0x25a008(_0x12a69b, _0x1aa8d8);
  return !![];
}