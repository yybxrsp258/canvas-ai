import { get as a111_0x23734c, post as a111_0x28b471 } from './requester.js';
export async function fetchPromptPresetsFromServer() {
  try {
    const _0x2874f2 = await a111_0x23734c("/api/v2/user/presets", {
      'provider': "local"
    });
    return _0x2874f2 && typeof _0x2874f2 === "object" ? _0x2874f2 : {};
  } catch {
    return {};
  }
}
export async function fetchPromptPresetSettingsFromServer() {
  try {
    const _0x2f4b49 = await a111_0x23734c("/api/v2/user/presets/settings", {
      'provider': "local"
    });
    return _0x2f4b49 && typeof _0x2f4b49 === "object" ? _0x2f4b49 : {};
  } catch {
    return {};
  }
}
export async function savePromptPresetSettingsToServer({
  defaultQuickCaptureNodeType = ''
} = {}) {
  return await a111_0x28b471("/api/v2/user/presets/settings", {
    'defaultQuickCaptureNodeType': defaultQuickCaptureNodeType
  }, {
    'provider': "local"
  });
}
export async function savePromptPresetToServer({
  nodeType: _0x5467bb,
  title: _0x3cff78,
  desc = '',
  template: _0x4d3127,
  triggerMode = '',
  thumbnailDataUrl = '',
  thumbLocalPath = '',
  originalTitle = '',
  installId = ''
} = {}) {
  return await a111_0x28b471("/api/v2/user/presets/save", {
    'nodeType': _0x5467bb,
    'title': _0x3cff78,
    'desc': desc,
    'template': _0x4d3127,
    'triggerMode': triggerMode,
    'thumbnailDataUrl': thumbnailDataUrl,
    'thumbLocalPath': thumbLocalPath,
    'originalTitle': originalTitle,
    'installId': installId
  }, {
    'provider': "local"
  });
}
export async function deletePromptPresetFromServer({
  nodeType: _0x50563f,
  title: _0x5bd3d1
} = {}) {
  return await a111_0x28b471("/api/v2/user/presets/delete", {
    'nodeType': _0x50563f,
    'title': _0x5bd3d1
  }, {
    'provider': 'local'
  });
}