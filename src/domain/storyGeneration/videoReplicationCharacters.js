export const REPLICATION_CHARACTER_ROLES = Object["freeze"]({
  'main': '主角',
  'supporting': '配角',
  'background': "背景人物",
  'uncertain': '待确认'
});
export const REPLICATION_SUBJECT_TYPES = Object["freeze"]({
  'person': '人物',
  'animal': '动物',
  'uncertain': '待确认'
});
export function getVideoReplicationCharacterRoster(_0x487ee5 = {}) {
  return (_0x487ee5['characters'] || [])["map"](_0x1b8564 => {
    const _0x5a03e3 = (_0x487ee5['events'] || [])["filter"](_0x1453fe => _0x1453fe['characterIds']["includes"](_0x1b8564['id']));
    return {
      ..._0x1b8564,
      'role': _0x1b8564["role"] || "uncertain",
      'subjectType': _0x1b8564["subjectType"] || 'uncertain',
      'eventCount': _0x5a03e3["length"],
      'firstSeenSec': _0x5a03e3[0x0]?.["startSec"] ?? null,
      'dialogueCount': (_0x487ee5["events"] || [])["reduce"]((_0x44b419, _0x3d99f9) => _0x44b419 + _0x3d99f9["dialogue"]["filter"](_0x466df7 => _0x466df7["speakerId"] === _0x1b8564['id'])["length"], 0x0)
    };
  })['sort']((_0x169e7b, _0x3592a7) => {
    const _0x123cd0 = {
      'main': 0x0,
      'supporting': 0x1,
      'uncertain': 0x2,
      'background': 0x3
    };
    return _0x123cd0[_0x169e7b['role']] - _0x123cd0[_0x3592a7["role"]] || (_0x169e7b["firstSeenSec"] ?? Infinity) - (_0x3592a7["firstSeenSec"] ?? Infinity);
  });
}
export function getVideoReplicationCharacterSummary(_0x213838 = {}) {
  const _0x25db01 = getVideoReplicationCharacterRoster(_0x213838);
  return {
    'total': _0x25db01['length'],
    'people': _0x25db01["filter"](_0x5b6a94 => _0x5b6a94['subjectType'] === "person")["length"],
    'animals': _0x25db01["filter"](_0x310b59 => _0x310b59['subjectType'] === "animal")["length"],
    'main': _0x25db01['filter'](_0x189383 => _0x189383["role"] === 'main')["length"],
    'uncertain': _0x25db01["filter"](_0x1c97ca => _0x1c97ca["role"] === "uncertain" || _0x1c97ca["identityNotes"])["length"]
  };
}