import { get as a92_0x44dfbe, post as a92_0x1aec84, del as a92_0x253c54 } from './requester.js';
export async function getProjects() {
  try {
    const _0x375f07 = await a92_0x44dfbe('/api/projects', {
      'provider': "local"
    });
    return Array['isArray'](_0x375f07) ? _0x375f07 : [];
  } catch (_0x456085) {
    console["error"]("Failed to get projects:", _0x456085);
    return [];
  }
}
export async function createProject(_0x57ce42, _0x5abe48) {
  try {
    await a92_0x1aec84("/api/projects", {
      'id': _0x57ce42,
      'name': _0x5abe48
    }, {
      'provider': "local"
    });
    return _0x57ce42;
  } catch (_0x1ad13a) {
    console["error"]('Failed\x20to\x20create\x20project:', _0x1ad13a);
    return null;
  }
}
export async function deleteProject(_0x36d5e2) {
  try {
    await a92_0x253c54('/api/projects?id=' + _0x36d5e2, {
      'provider': "local"
    });
    return !![];
  } catch (_0x4c2eec) {
    console['error']('Failed\x20to\x20delete\x20project:', _0x4c2eec);
    return ![];
  }
}