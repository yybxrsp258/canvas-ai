import { markStoryReplicationPromptsStale } from './storyReplicationPromptFreshness.js';
const text = _0x135ab1 => String(_0x135ab1 ?? '')['trim']();
export function getStoryReplicationSubjects(_0x1f329e) {
  return (_0x1f329e["episodes"] || [])["flatMap"](_0x4ee0c1 => (_0x4ee0c1["replication"]?.["sourceAnalysis"]?.["characters"] || [])["map"](_0x8299e => ({
    'episodeId': _0x4ee0c1['id'],
    'character': _0x8299e,
    'key': _0x4ee0c1['id'] + ':' + _0x8299e['id'],
    'episodeTitle': _0x4ee0c1["title"]
  })));
}
export function captureStoryReplicationAssetSources(_0x15f11a) {
  if (_0x15f11a["project"]?.["sourceMode"] !== "video-replication") {
    return;
  }
  const _0x32eca5 = getStoryReplicationSubjects(_0x15f11a);
  const _0x2b9357 = _0x15f11a['project']["replication"]["characterBindings"] ||= {};
  for (const _0x43cc8b of _0x15f11a['assets'] || []) {
    if (!_0x43cc8b["replicationSource"]) {
      _0x43cc8b["replicationSource"] = {
        'name': _0x43cc8b["name"],
        'description': _0x43cc8b["description"],
        'ref': _0x43cc8b['ref']
      };
    }
  }
  for (const _0x4ff9d8 of _0x32eca5) {
    if (_0x2b9357[_0x4ff9d8["key"]]) {
      continue;
    }
    const _0x3b7ebd = _0x15f11a['assets']['filter'](_0x4a864f => _0x4a864f['kind'] === "character" && (text(_0x4a864f["replicationSource"]?.['name']) === _0x4ff9d8["character"]['name'] || text(_0x4a864f['replicationSource']?.["ref"]) === _0x4ff9d8['character']['id']) && (!_0x4a864f['sourceChapterIds']?.["length"] || _0x4a864f['sourceChapterIds']["includes"](_0x4ff9d8["episodeId"])));
    if (_0x3b7ebd["length"] === 0x1) {
      _0x2b9357[_0x4ff9d8["key"]] = _0x3b7ebd[0x0]['id'];
    }
  }
}
export function getStoryReplicationBindingError(_0x44b386) {
  if (_0x44b386["project"]?.["sourceMode"] !== 'video-replication') {
    return '';
  }
  const _0x33e63d = _0x44b386['project']["replication"]?.['characterBindings'] || {};
  const _0x5b0ab8 = getStoryReplicationSubjects(_0x44b386)["filter"](_0x46c6b1 => !_0x44b386["assets"]["some"](_0x207a87 => _0x207a87['kind'] === "character" && _0x207a87['id'] === _0x33e63d[_0x46c6b1["key"]]));
  return _0x5b0ab8["length"] ? "请先为 " + _0x5b0ab8["length"] + " 个原片角色选择对应的新角色；保留原形象时也请选择对应素材。" : '';
}
export function updateStoryReplicationReplacement(_0xb97f18, {
  field: _0xf45314,
  key: _0x3fbc93,
  value: _0x1412b1
} = {}) {
  if (_0xb97f18["project"]?.["sourceMode"] !== 'video-replication') {
    return ![];
  }
  const _0xaca0b6 = _0xb97f18["project"]["replication"];
  if (_0xf45314 === "characterBinding") {
    if (!getStoryReplicationSubjects(_0xb97f18)["some"](_0x1c5f1d => _0x1c5f1d['key'] === _0x3fbc93) || _0x1412b1 && !_0xb97f18["assets"]['some'](_0x5bd0b5 => _0x5bd0b5['id'] === _0x1412b1 && _0x5bd0b5['kind'] === 'character')) {
      return ![];
    }
    if (_0xaca0b6["characterBindings"]?.[_0x3fbc93] === text(_0x1412b1)) {
      return ![];
    }
    (_0xaca0b6['characterBindings'] ||= {})[_0x3fbc93] = text(_0x1412b1);
    markStoryReplicationPromptsStale(_0xb97f18, getStoryReplicationSubjects(_0xb97f18)["find"](_0x545833 => _0x545833["key"] === _0x3fbc93)["episodeId"]);
  } else {
    if (_0xf45314 === "targetLocale" && ["source", "zh-CN", "ja-JP", "ko-KR", 'en-US']["includes"](_0x1412b1)) {
      const _0x142cab = (_0xb97f18["episodes"] || [])['filter'](_0x9137a3 => !_0x9137a3["replication"]?.["targetLocale"]);
      const _0x23ed89 = _0x142cab['some'](_0x1f3f0c => (_0x1f3f0c["clips"] || [])["some"](_0x48c74c => _0x48c74c["promptLanguage"] && _0x48c74c["promptLanguage"] !== _0x1412b1));
      if (_0xaca0b6["targetLocale"] === _0x1412b1 && !_0x23ed89) {
        return ![];
      }
      _0xaca0b6['targetLocale'] = _0x1412b1;
      for (const _0x19a2e2 of _0x142cab) {
        markStoryReplicationPromptsStale(_0xb97f18, _0x19a2e2['id']);
        for (const _0x58f4eb of _0x19a2e2['clips'] || []) {
          if (_0x58f4eb["promptLanguage"] === _0x1412b1) {
            delete _0x58f4eb["requiredDialogueLanguage"];
          } else {
            _0x58f4eb["requiredDialogueLanguage"] = _0x1412b1;
          }
        }
      }
    } else {
      return ![];
    }
  }
  return !![];
}