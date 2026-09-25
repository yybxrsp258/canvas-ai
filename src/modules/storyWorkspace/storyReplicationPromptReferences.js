import { protectStoryPromptPills } from './storyClipPromptReferences.js';
import { normalizeStoryPromptMode } from './storyPromptModes.js';
const text = _0x10750b => String(_0x10750b ?? '')["trim"]();
const escapeRegExp = _0x357f27 => _0x357f27["replace"](/[.*+?^${}()|[\]\\]/gu, "\\$&");
const ref = _0x46592e => text(_0x46592e?.['planningRef'] || _0x46592e?.["ref"] || _0x46592e?.['id']);
const matchesRef = (_0x255a66, _0x148cdb) => [text(_0x255a66?.['id']), ref(_0x255a66)]["includes"](text(_0x148cdb));
const mention = (_0x5672b7, _0x2542c7) => '@' + text(_0x5672b7["name"]) + (text(_0x2542c7?.["name"]) ? " · " + text(_0x2542c7["name"]) : '');
function compactCharacterReferenceHeaders(_0x3bc73c, _0x50f8d6) {
  const _0x5d7495 = new Map();
  const _0xe7e058 = "character-reference-header";
  for (const {
    asset: _0x2ed907,
    appearance: _0x143521,
    token: _0x48a0c6
  } of _0x50f8d6) {
    if (_0x2ed907["kind"] !== 'character') {
      continue;
    }
    const _0x58f796 = new RegExp("(^|\\n|<div>|<p>|<br\\s*/?>)" + escapeRegExp(_0x48a0c6) + '：人物外观、发型和服装以该参考图为准。', 'gu');
    _0x3bc73c = _0x3bc73c["replace"](_0x58f796, (_0x4b6310, _0x4c573c) => {
      const _0x1c7f7c = _0x5d7495["size"] === 0x0;
      _0x5d7495["set"](_0x2ed907['id'] + ':' + _0x143521['id'], _0x48a0c6);
      return _0x4c573c + (_0x1c7f7c ? _0xe7e058 : '');
    });
  }
  return _0x3bc73c['replace'](_0xe7e058, '人物形象、发型与服装分别参考\x20' + [..._0x5d7495["values"]()]['join']('、') + '。');
}
function compactSeedanceReplicationLines(_0xa31fdb, _0x558c36, _0x5b5f75) {
  const _0x49d293 = _0x3056f9 => {
    for (const _0x587a76 of _0x558c36) {
      _0x3056f9 = _0x3056f9['split'](_0x587a76["token"])["join"](mention(_0x587a76["asset"], _0x587a76["appearance"]));
    }
    return _0x3056f9["trim"]();
  };
  const _0x5e788b = _0xa31fdb['split']('\x0a');
  const _0x3b99a1 = _0x5e788b['findIndex'](_0x126eff => _0x126eff["startsWith"]("人物站位："));
  const _0xf84a79 = _0x5e788b["findIndex"](_0x46145c => /^分镜1\b/u['test'](_0x46145c));
  if (_0x3b99a1 >= 0x0 && _0xf84a79 > _0x3b99a1) {
    const _0x1f6dca = _0x5e788b[_0x3b99a1]["slice"]('人物站位：'["length"]);
    !_0x49d293(_0x5e788b[_0xf84a79])["includes"](_0x49d293(_0x1f6dca)) && (_0x5e788b[_0xf84a79] = _0x5e788b[_0xf84a79]["replace"]('：', '：' + _0x1f6dca + '\x20'));
    _0x5e788b[_0x3b99a1] = '';
  }
  let _0x462d6d = -0x1;
  return _0x5e788b['map'](_0x482c44 => {
    const _0x3ea0d0 = _0x482c44['match'](/^分镜(\d+)\b/u)?.[0x1];
    if (_0x3ea0d0) {
      _0x462d6d = Number(_0x3ea0d0) - 0x1;
    }
    if (_0x5b5f75["shots"]?.[_0x462d6d]?.["dialogue"] && /^音效：(?:人声对话|激动的人声对话)[。.]?$/u["test"](_0x482c44)) {
      return '';
    }
    return _0x482c44["replace"](/^发声与口型约束：本分镜仅(.+?)发声并同步口型；(.+?)其他画面角色保持静默，不张嘴、不做说话口型。$/u, (_0xb81924, _0x204902, _0x58fc85) => "发声与口型约束：" + _0x204902 + '说话时口型同步；' + _0x58fc85['replace'](/及$/u, '') + "保持沉默。")['replace'](/^发声与口型约束：本分镜仅(.+?)发声并同步口型；其他画面角色保持静默，不张嘴、不做说话口型。$/u, "发声与口型约束：$1说话时口型同步，其他角色保持沉默。")["replace"](/^发声与口型约束：本分镜对白按标注顺序轮流发声；每句仅当前标注的说话人发声并同步口型；其余角色保持静默，不张嘴、不做说话口型。$/u, "发声与口型约束：按台词顺序轮流说话，当前说话人口型同步，其他角色保持沉默。");
  })["filter"](Boolean)["join"]('\x0a');
}
export function getStoryReplicationCharacterDisplayLabel(_0x3ffa27, _0x591aec, _0x23c996 = []) {
  if (_0x3ffa27?.["kind"] !== "character" || !_0x3ffa27["replicationSource"]) {
    return '';
  }
  const _0x47749c = _0x23c996["filter"](_0xa0c1bc => _0xa0c1bc["kind"] === "character");
  const _0x2e4d7b = _0x47749c["findIndex"](_0x3c0dc1 => _0x3c0dc1['id'] === _0x3ffa27['id']);
  if (_0x2e4d7b < 0x0) {
    return '';
  }
  const _0x124d28 = _0x3ffa27["appearances"] || [];
  const _0xf5f22e = _0x124d28["findIndex"](_0x5b2678 => _0x5b2678['id'] === _0x591aec?.['id']);
  return '角色' + (_0x2e4d7b + 0x1) + " · " + (_0x591aec?.["sourceOrigin"] === "library" ? "替换形象" : "参考形象") + (_0x124d28["length"] > 0x1 ? _0xf5f22e + 0x1 : '');
}
function selectedCharacters(_0x56ea76, _0x2dcc9a) {
  const _0x253fc3 = new Map();
  for (const _0x206a44 of _0x56ea76) {
    for (const _0x33e636 of _0x206a44['assetUsages'] || []) {
      const _0x5abeae = _0x2dcc9a["filter"](_0x58e00b => matchesRef(_0x58e00b, _0x33e636["assetRef"]));
      const _0x4e9887 = _0x5abeae['length'] === 0x1 ? _0x5abeae[0x0] : null;
      if (_0x4e9887?.["kind"] !== "character") {
        continue;
      }
      const _0x333edd = _0x4e9887["appearances"] || [];
      const _0x28b3f3 = _0x33e636["appearanceRef"] ? _0x333edd["find"](_0x2e5cb5 => matchesRef(_0x2e5cb5, _0x33e636["appearanceRef"])) : _0x333edd["find"](_0x7611a1 => _0x7611a1['id'] === _0x4e9887["baseAppearanceId"]) || _0x333edd[0x0];
      if (!_0x28b3f3) {
        continue;
      }
      const _0x10e789 = _0x253fc3['get'](_0x4e9887['id']);
      if (!_0x10e789) {
        _0x253fc3['set'](_0x4e9887['id'], {
          'asset': _0x4e9887,
          'appearance': _0x28b3f3
        });
      } else {
        if (_0x10e789["appearance"]?.['id'] !== _0x28b3f3['id']) {
          _0x253fc3["set"](_0x4e9887['id'], {
            'asset': _0x4e9887,
            'appearance': null
          });
        }
      }
    }
  }
  return [..._0x253fc3["values"]()]["filter"](_0x2a86e0 => _0x2a86e0['appearance']);
}
export function syncStoryReplicationPromptReferences(_0x518138, _0x42f9b7 = {}, _0x4adad6 = []) {
  const _0xfb0d39 = normalizeStoryPromptMode(_0x42f9b7['promptMode'], {
    'allowDeveloperModes': !![]
  }) === "seedance-2.0";
  const _0x367f52 = protectStoryPromptPills(_0x518138);
  let _0x54e0a1 = _0x367f52["source"];
  const _0x5b79ba = [];
  const _0x2b605f = _0x236bc2 => {
    const _0x5ea269 = 'replication-text-' + _0x5b79ba["length"] + '';
    _0x5b79ba["push"]({
      'token': _0x5ea269,
      'content': _0x236bc2
    });
    return _0x5ea269;
  };
  const _0x341f20 = [];
  for (const _0x461a6e of _0x4adad6) {
    for (const _0x3b4fa6 of _0x461a6e["appearances"] || []) {
      const _0x3601c7 = mention(_0x461a6e, _0x3b4fa6);
      _0x341f20["push"]({
        'asset': _0x461a6e,
        'appearance': _0x3b4fa6,
        'label': _0x3601c7
      });
    }
  }
  const _0xd71cc5 = [];
  const _0x1b6a82 = new Map([..._0x54e0a1["matchAll"](/((?:<|&lt;)Subject \d+(?:>|&gt;)) 是角色 ([^，\n]+)，/gu)]["map"](_0x2212cc => [_0x2212cc[0x2], _0x2212cc[0x1]]));
  _0x54e0a1 = _0x54e0a1["replace"](/((?:<|&lt;)Subject \d+(?:>|&gt;)) 是角色 [^，\n]+，/gu, '$1\x20是人物参考，');
  const _0x19a653 = new Map(_0x341f20["map"](_0x11b23d => [_0x11b23d["label"], _0x11b23d]));
  const _0x62aa49 = [..._0x19a653['keys']()]["sort"]((_0x2e9588, _0x511f8f) => _0x511f8f["length"] - _0x2e9588["length"]);
  if (_0x62aa49["length"]) {
    _0x54e0a1 = _0x54e0a1["replace"](new RegExp(_0x62aa49["map"](escapeRegExp)["join"]('|'), 'gu'), _0x3062f0 => {
      const _0x460d18 = _0x2b605f(_0x3062f0);
      _0xd71cc5['push']({
        ..._0x19a653["get"](_0x3062f0),
        'token': _0x460d18
      });
      return _0x460d18;
    });
  }
  for (const _0xcee90e of _0x367f52['pills']) {
    const _0x43faa6 = _0x341f20["find"](({
      asset: _0x352907,
      appearance: _0x5b987d
    }) => _0xcee90e["html"]["includes"]("data-asset-id=\"story-asset:" + encodeURIComponent(_0x352907['id']) + ':' + encodeURIComponent(_0x5b987d['id']) + '\x22'));
    if (_0x43faa6) {
      _0xd71cc5["push"]({
        ..._0x43faa6,
        'token': _0xcee90e["token"]
      });
    }
  }
  for (const {
    asset: _0x364dcf,
    token: _0x40e15e
  } of _0xd71cc5) {
    if (_0x364dcf["kind"] !== "character") {
      continue;
    }
    const _0x1f5146 = escapeRegExp(_0x40e15e);
    const _0x33e4f3 = '(^|\x5cn|<div>|<p>|<br\x5cs*/?>)';
    _0x54e0a1 = _0x54e0a1["replace"](new RegExp(_0x33e4f3 + "将(?:<|&lt;)" + _0x1f5146 + '(?:>|&gt;)[^\x5cn]*?定义为(?:<|&lt;)[^\x5cn]*?(?:>|&gt;)。(?:人物外观、发型和服装以该参考图为准。)?', 'gu'), (_0x1ba0e2, _0x551a6c) => '' + _0x551a6c + _0x40e15e + "：人物外观、发型和服装以该参考图为准。");
    _0x54e0a1 = _0x54e0a1['replace'](new RegExp('' + _0x33e4f3 + _0x1f5146 + "：定义为[^。\\n]*。", 'gu'), (_0x221fac, _0xa4f952) => '' + _0xa4f952 + _0x40e15e + '：人物外观、发型和服装以该参考图为准。');
  }
  if (_0xfb0d39) {
    _0x54e0a1 = compactCharacterReferenceHeaders(_0x54e0a1, _0xd71cc5);
  }
  _0x54e0a1 = _0x54e0a1["replace"](/(?:<d>|&lt;d&gt;)[\s\S]*?(?:<\/d>|&lt;\/d&gt;)/gu, _0x2b605f)["replace"](/<[^>]+>/gu, _0x2b605f)["replace"](/“[^”]*”|「[^」]*」|"[^"\n]*"|&quot;[\s\S]*?&quot;/gu, _0x2b605f);
  _0x54e0a1 = _0x54e0a1["replace"](/(^|\n)(声音设定（[^\n]*?）：)([^\n]*)/gu, (_0x3fcda0, _0x4275f0, _0xc8fba9, _0x3b4f1a) => _0x4275f0 + _0xc8fba9 + _0x2b605f(_0x3b4f1a));
  _0x54e0a1 = _0x54e0a1["replace"](/(^|\n)((?:本片段场景设定在|本片段道具设定|画外音)：[^\n]*)/gu, (_0xb882a9, _0x5dc46e, _0x3fed50) => _0x5dc46e + _0x2b605f(_0x3fed50));
  const _0x3f0009 = _0x4adad6["filter"](_0x513391 => _0x513391['kind'] !== 'character')['map'](_0x5e54da => text(_0x5e54da['name']))["filter"](Boolean)['sort']((_0x1ccc85, _0x145056) => _0x145056["length"] - _0x1ccc85["length"]);
  if (_0x3f0009["length"]) {
    _0x54e0a1 = _0x54e0a1['replace'](new RegExp(_0x3f0009["map"](escapeRegExp)["join"]('|'), 'gu'), _0x2b605f);
  }
  const _0xb0643e = _0x42f9b7["shots"] || [];
  if (_0xfb0d39) {
    _0x54e0a1 = compactSeedanceReplicationLines(_0x54e0a1, _0xd71cc5, _0x42f9b7);
  }
  const _0x42bfdb = selectedCharacters(_0xb0643e, _0x4adad6);
  let _0x5d0ede = _0x42bfdb;
  _0x54e0a1 = _0x54e0a1['split']('\x0a')["map"](_0x21e60d => {
    const _0x208e8b = _0x21e60d["replace"](/\uE002replication-text-(\d+)\uE003/gu, (_0x167d43, _0x49520d) => _0x5b79ba[_0x49520d]?.["content"]["startsWith"]('<') ? '' : _0x167d43);
    const _0x5b1235 = _0x208e8b['match'](/^(?:分镜|镜头|\[Shot )(\d+)/u)?.[0x1];
    if (_0x5b1235) {
      _0x5d0ede = selectedCharacters([_0xb0643e[Number(_0x5b1235) - 0x1] || {}], _0x4adad6);
    } else {
      const _0x2fe6c4 = _0x208e8b["match"](/^(\d+)-(\d+)秒：/u)?.[0x1];
      if (_0x2fe6c4 != null) {
        _0x5d0ede = selectedCharacters(_0xb0643e['filter'](_0x7fcb04 => Number(_0x7fcb04["startSec"]) === Number(_0x2fe6c4)), _0x4adad6);
      }
    }
    const _0x12b658 = new Map();
    for (const _0x252c88 of _0x5d0ede) {
      const _0x25a379 = text(_0x252c88['asset']["name"]);
      _0x12b658["set"](_0x25a379, _0x12b658["has"](_0x25a379) ? null : _0x252c88);
    }
    const _0x1f8729 = [..._0x5d0ede, ..._0xd71cc5]["filter"](({
      asset: _0x49c17f,
      appearance: _0x4a8cee
    }) => _0x49c17f["kind"] === "character" && _0x4a8cee?.["sourceOrigin"] === 'library' && _0x4a8cee['imageUrl']);
    for (const {
      asset: _0x566b1d,
      appearance: _0x26ad2a,
      token: _0x141650
    } of _0x1f8729) {
      const _0x9d822e = text(_0x26ad2a["name"]);
      const _0x522df5 = _0x141650 || text(_0x566b1d['name']);
      if (!_0x9d822e || !_0x522df5) {
        continue;
      }
      _0x21e60d = _0x21e60d['replace'](new RegExp('(' + escapeRegExp(_0x522df5) + ")[ \\t]*[（(]" + escapeRegExp(_0x9d822e) + '[）)](?![\x20\x5ct]*[：:])', 'gu'), '$1');
    }
    const _0x2d73af = [..._0x12b658["keys"]()]["filter"](Boolean)["sort"]((_0x2f0702, _0x4e2f76) => _0x4e2f76['length'] - _0x2f0702["length"]);
    if (!_0x2d73af["length"]) {
      return _0x21e60d;
    }
    return _0x21e60d["replace"](new RegExp(_0x2d73af['map'](escapeRegExp)["join"]('|'), 'gu'), (_0x4fe0df, _0x46e384) => {
      if (_0x21e60d[_0x46e384 - 0x1] === '@') {
        return _0x4fe0df;
      }
      const _0x39e977 = _0x12b658['get'](_0x4fe0df);
      if (!_0x39e977) {
        return _0x4fe0df;
      }
      if (_0x1b6a82["has"](_0x4fe0df)) {
        return _0x1b6a82["get"](_0x4fe0df);
      }
      const _0x2b949b = _0xd71cc5["find"](_0x3c8160 => _0x3c8160['token']["startsWith"]('') && _0x3c8160["asset"]['id'] === _0x39e977["asset"]['id'] && _0x3c8160["appearance"]['id'] === _0x39e977["appearance"]['id']);
      return _0x2b949b?.["token"] || mention(_0x39e977["asset"], _0x39e977["appearance"]);
    });
  })["join"]('\x0a');
  for (const {
    token: _0x3ffffa,
    content: _0x52ae81
  } of _0x5b79ba['reverse']()) {
    _0x54e0a1 = _0x54e0a1["split"](_0x3ffffa)["join"](_0x52ae81);
  }
  return _0x367f52['restore'](_0x54e0a1);
}