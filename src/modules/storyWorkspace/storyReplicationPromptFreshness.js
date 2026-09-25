import { buildStoryReplicationAdaptationInput } from '../../../api/storyReplicationAdaptationApi.js';
export function getStoryReplicationPromptInputKey(_0x56205f, _0x48a3f3) {
  return JSON['stringify'](buildStoryReplicationAdaptationInput({
    'project': _0x56205f["project"],
    'episode': _0x48a3f3,
    'assets': _0x56205f["assets"]
  }));
}
export function isStoryReplicationPromptStale(_0x58cfc0, _0x4c78f3) {
  if (_0x58cfc0?.["project"]?.['sourceMode'] !== 'video-replication' || !_0x4c78f3?.['clips']?.["length"]) {
    return ![];
  }
  return _0x4c78f3["replication"]?.["promptsStale"] === !![] || Boolean(_0x4c78f3['replication']?.['promptInputKey'] && _0x4c78f3['replication']["promptInputKey"] !== getStoryReplicationPromptInputKey(_0x58cfc0, _0x4c78f3));
}
export function markStoryReplicationPromptsStale(_0x188014, _0x87b18e = '') {
  for (const _0x296af2 of _0x188014["episodes"] || []) {
    if (_0x296af2["clips"]?.["length"] && (!_0x87b18e || _0x296af2['id'] === _0x87b18e)) {
      _0x296af2["replication"]["promptsStale"] = !![];
    }
  }
}