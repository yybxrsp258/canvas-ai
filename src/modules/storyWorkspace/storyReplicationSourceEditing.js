import { invalidateStoryVideoReplicationAssetLocalization, applyStoryVideoReplicationAnalysis, syncStoryVideoReplicationProject } from './storyVideoReplication.js';
import { REPLICATION_CHARACTER_ROLES, REPLICATION_SUBJECT_TYPES } from '../../domain/storyGeneration/videoReplicationCharacters.js';
function canEdit(_0x28dd5a) {
  return _0x28dd5a?.['replication']?.["sourceAnalysis"] && !_0x28dd5a['clips']?.["length"] && !["queued", "uploading", 'analyzing']["includes"](_0x28dd5a['replication']['status']);
}
function commitSourceEdit(_0x5617e9, _0x88ef72) {
  _0x88ef72['replication']["sourceAnalysis"]["revision"] = (_0x88ef72['replication']['sourceAnalysis']['revision'] || 0x0) + 0x1;
  applyStoryVideoReplicationAnalysis(_0x88ef72, {
    'sourceAnalysis': _0x88ef72["replication"]["sourceAnalysis"]
  });
  syncStoryVideoReplicationProject(_0x5617e9);
  invalidateStoryVideoReplicationAssetLocalization(_0x5617e9);
}
export function editStoryReplicationSource(_0x48aba0, _0x53bbf6, {
  kind: _0x160c87,
  id: _0x520e43,
  index: _0x5119a4,
  field: _0x177d61,
  value: _0x300a13
} = {}) {
  const _0x5141fb = _0x53bbf6?.['replication']?.["sourceAnalysis"];
  if (!canEdit(_0x53bbf6)) {
    return ![];
  }
  const _0x3e8664 = _0x5141fb["events"]["find"](_0x44b581 => _0x44b581['id'] === _0x520e43);
  let _0x3d855f;
  if (_0x160c87 === "story" && _0x177d61 === 'synopsis') {
    _0x3d855f = _0x5141fb;
  }
  if (_0x160c87 === "character" && ["name", 'description', "identityNotes", 'role', "roleEvidence", 'subjectType']["includes"](_0x177d61)) {
    if (_0x177d61 === "role" && !Object["hasOwn"](REPLICATION_CHARACTER_ROLES, _0x300a13)) {
      return ![];
    }
    if (_0x177d61 === "subjectType" && !Object["hasOwn"](REPLICATION_SUBJECT_TYPES, _0x300a13)) {
      return ![];
    }
    _0x3d855f = _0x5141fb['characters']['find'](_0x1c5470 => _0x1c5470['id'] === _0x520e43);
  }
  if (_0x160c87 === 'event' && _0x177d61 === "visual") {
    _0x3d855f = _0x3e8664;
  }
  if (_0x160c87 === "dialogue" && ["speakerId", "text", "uncertain"]['includes'](_0x177d61)) {
    _0x3d855f = _0x3e8664?.["dialogue"]?.[Number(_0x5119a4)];
    if (_0x177d61 === 'speakerId' && _0x300a13 && !_0x5141fb['characters']["some"](_0x380a5a => _0x380a5a['id'] === _0x300a13)) {
      return ![];
    }
  }
  if (!_0x3d855f) {
    return ![];
  }
  const _0x5ca948 = _0x177d61 === "uncertain" ? _0x300a13 === !![] : String(_0x300a13 ?? '')["trim"]();
  if (_0x3d855f[_0x177d61] === _0x5ca948) {
    return ![];
  }
  if (_0x177d61 === "name" && !_0x5ca948) {
    return ![];
  }
  _0x3d855f[_0x177d61] = _0x5ca948;
  commitSourceEdit(_0x48aba0, _0x53bbf6);
  return !![];
}
export function mergeStoryReplicationCharacters(_0x31f80b, _0x1bb4d7, _0x4def5b, _0xa983a4) {
  const _0x4e548a = _0x1bb4d7?.["replication"]?.["sourceAnalysis"];
  if (!canEdit(_0x1bb4d7) || _0x4def5b === _0xa983a4) {
    return ![];
  }
  const _0x2cd4c0 = _0x4e548a['characters']["find"](_0x133c10 => _0x133c10['id'] === _0x4def5b);
  const _0x157809 = _0x4e548a["characters"]['find'](_0x576fe7 => _0x576fe7['id'] === _0xa983a4);
  if (!_0x2cd4c0 || !_0x157809) {
    return ![];
  }
  for (const _0x3977f8 of _0x4e548a["events"]) {
    _0x3977f8["characterIds"] = [...new Set(_0x3977f8['characterIds']["map"](_0x1b5db7 => _0x1b5db7 === _0x4def5b ? _0xa983a4 : _0x1b5db7))];
    _0x3977f8['dialogue']["forEach"](_0x4b0928 => {
      if (_0x4b0928["speakerId"] === _0x4def5b) {
        _0x4b0928["speakerId"] = _0xa983a4;
      }
    });
  }
  _0x157809["identityNotes"] = [_0x157809['identityNotes'], _0x2cd4c0['identityNotes']]["filter"](Boolean)["join"]('\x0a');
  _0x4e548a['characters'] = _0x4e548a["characters"]["filter"](_0x3044a2 => _0x3044a2 !== _0x2cd4c0);
  if (_0x31f80b['project']['replication']?.["characterBindings"]) {
    delete _0x31f80b['project']['replication']["characterBindings"][_0x1bb4d7['id'] + ':' + _0x4def5b];
  }
  commitSourceEdit(_0x31f80b, _0x1bb4d7);
  return !![];
}
export function addStoryReplicationCharacter(_0x57ae2f, _0x5e5844, {
  timeSec: _0xb86562,
  name = "新人物"
} = {}) {
  if (!canEdit(_0x5e5844)) {
    return null;
  }
  const _0x1664d4 = _0x5e5844["replication"]["sourceAnalysis"];
  const _0x5a3c46 = _0x1664d4["events"]["find"](_0x5a8673 => Number(_0xb86562) >= _0x5a8673['startSec'] && Number(_0xb86562) < _0x5a8673["endSec"]);
  if (!_0x5a3c46) {
    return null;
  }
  let _0x3eacb6 = 0x1;
  while (_0x1664d4["characters"]["some"](_0xf111f1 => _0xf111f1['id'] === 'person-' + _0x3eacb6)) {
    _0x3eacb6 += 0x1;
  }
  const _0x36a175 = {
    'id': "person-" + _0x3eacb6,
    'name': String(name)["trim"]() || '新人物',
    'description': '',
    'role': 'uncertain',
    'subjectType': "person",
    'roleEvidence': '',
    'identityNotes': "用户补录，请核对外观与出场片段",
    'representativeTimeSec': Number(_0xb86562)
  };
  _0x1664d4["characters"]["push"](_0x36a175);
  _0x5a3c46["characterIds"]["push"](_0x36a175['id']);
  commitSourceEdit(_0x57ae2f, _0x5e5844);
  return _0x36a175;
}
export function removeStoryReplicationCharacter(_0x337a96, _0x4eda25, _0x1bbc66) {
  if (!canEdit(_0x4eda25)) {
    return ![];
  }
  const _0x2f86d2 = _0x4eda25["replication"]['sourceAnalysis'];
  if (!_0x2f86d2["characters"]['some'](_0x5030fd => _0x5030fd['id'] === _0x1bbc66)) {
    return ![];
  }
  _0x2f86d2["characters"] = _0x2f86d2['characters']["filter"](_0x4db2e8 => _0x4db2e8['id'] !== _0x1bbc66);
  for (const _0x31e62c of _0x2f86d2['events']) {
    _0x31e62c["characterIds"] = _0x31e62c['characterIds']["filter"](_0x22ff20 => _0x22ff20 !== _0x1bbc66);
    for (const _0x18d9e8 of _0x31e62c["dialogue"]) {
      _0x18d9e8["speakerId"] === _0x1bbc66 && (_0x18d9e8["speakerId"] = '', _0x18d9e8["uncertain"] = !![]);
    }
  }
  if (_0x337a96["project"]["replication"]?.["characterBindings"]) {
    delete _0x337a96["project"]["replication"]["characterBindings"][_0x4eda25['id'] + ':' + _0x1bbc66];
  }
  commitSourceEdit(_0x337a96, _0x4eda25);
  return !![];
}
export function setStoryReplicationCharacterPresence(_0x56e34f, _0x25d2d0, {
  characterId: _0xd1c97a,
  eventId: _0x4b04ad,
  present: _0x362594
} = {}) {
  if (!canEdit(_0x25d2d0)) {
    return ![];
  }
  const _0x5069e9 = _0x25d2d0['replication']['sourceAnalysis'];
  const _0x2588a4 = _0x5069e9['characters']["find"](_0x49503f => _0x49503f['id'] === _0xd1c97a);
  const _0xc00152 = _0x5069e9["events"]['find'](_0x42fe7b => _0x42fe7b['id'] === _0x4b04ad);
  if (!_0x2588a4 || !_0xc00152 || _0xc00152["characterIds"]["includes"](_0xd1c97a) === _0x362594) {
    return ![];
  }
  const _0x594b2b = _0x5069e9['events']["filter"](_0x4a53ba => _0x4a53ba !== _0xc00152 && _0x4a53ba['characterIds']["includes"](_0xd1c97a));
  if (!_0x362594 && !_0x594b2b["length"]) {
    return ![];
  }
  _0xc00152["characterIds"] = _0x362594 ? [..._0xc00152['characterIds'], _0xd1c97a] : _0xc00152["characterIds"]["filter"](_0x4a16d0 => _0x4a16d0 !== _0xd1c97a);
  !_0x362594 && _0x2588a4["representativeTimeSec"] >= _0xc00152["startSec"] && _0x2588a4["representativeTimeSec"] < _0xc00152["endSec"] && (_0x2588a4["representativeTimeSec"] = _0x594b2b[0x0]["startSec"], delete _0x2588a4["frame"], delete _0x2588a4["portrait"]);
  commitSourceEdit(_0x56e34f, _0x25d2d0);
  return !![];
}