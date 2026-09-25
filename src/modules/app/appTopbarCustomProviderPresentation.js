export const CUSTOM_PROVIDER_TUTORIAL_URL = "https://docs.qq.com/doc/DYkZOamhTa3FCd1VR";
export function appendCustomProviderDiscoverySource(_0x4c7a1d, _0x105f96, _0x19c983) {
  if (!["documentation", "video-contracts", "model-capabilities"]["includes"](_0x105f96["discoverySource"])) {
    return;
  }
  const _0x40f352 = _0x4c7a1d["ownerDocument"]["createElement"]("span");
  _0x40f352["className"] = 'custom-provider-model-kind-tag';
  _0x40f352["dataset"]["customProviderDiscoverySource"] = _0x105f96["discoverySource"];
  _0x40f352["textContent"] = _0x19c983(_0x105f96["availability"] === "available" ? "sourceLiveCapabilities" : "sourceDocumentation");
  _0x4c7a1d["append"](_0x40f352);
}
export function createCustomProviderEditorShell({
  documentObject: _0x456231,
  editorId: _0x1f772b,
  tutorialLabel = '',
  discoverLabel = '',
  deleteAriaLabel = ''
} = {}) {
  if (!_0x456231?.["createElement"]) {
    throw new TypeError('createCustomProviderEditorShell\x20requires\x20a\x20document');
  }
  const _0x14b0f4 = _0x456231["createElement"]("div");
  _0x14b0f4['className'] = "custom-provider-editor-item";
  _0x14b0f4["dataset"]["customProviderEditorId"] = _0x1f772b;
  const _0x3ab352 = _0x456231["createElement"]("div");
  _0x3ab352['className'] = "custom-provider-editor-item-head";
  const _0x36570d = _0x456231["createElement"]("button");
  _0x36570d["type"] = "button";
  _0x36570d["className"] = "custom-provider-editor-tab";
  _0x36570d["dataset"]['customProviderEditorTab'] = '';
  _0x36570d["setAttribute"]('aria-selected', "false");
  const _0x3f299c = _0x456231["createElement"]("span");
  _0x3f299c["className"] = "custom-provider-editor-item-title";
  _0x3f299c["dataset"]["customProviderEditorTitle"] = '';
  _0x36570d['append'](_0x3f299c);
  const _0x3f3586 = _0x456231["createElement"]("div");
  _0x3f3586['className'] = "custom-provider-editor-item-actions";
  const _0x2aad0f = _0x456231["createElement"]("button");
  _0x2aad0f["type"] = "button";
  _0x2aad0f["className"] = "settings-provider-guide-btn custom-provider-tutorial-btn";
  _0x2aad0f["dataset"]["customProviderTutorial"] = '';
  _0x2aad0f['dataset']["externalUrl"] = CUSTOM_PROVIDER_TUTORIAL_URL;
  _0x2aad0f["textContent"] = tutorialLabel;
  const _0x13e168 = _0x456231["createElement"]("button");
  _0x13e168["type"] = "button";
  _0x13e168["className"] = 'custom-provider-primary-btn\x20custom-provider-discover-btn';
  _0x13e168["dataset"]["customProviderDiscover"] = '';
  _0x13e168['textContent'] = discoverLabel;
  const _0x3b9c2f = _0x456231["createElement"]("button");
  _0x3b9c2f["type"] = "button";
  _0x3b9c2f["className"] = "custom-provider-delete-btn canvas-tab-close";
  _0x3b9c2f['dataset']["customProviderDelete"] = '';
  _0x3b9c2f['setAttribute']("aria-label", deleteAriaLabel);
  _0x3b9c2f["textContent"] = '×';
  _0x3f3586["append"](_0x2aad0f, _0x13e168);
  _0x3ab352['append'](_0x36570d, _0x3b9c2f);
  _0x14b0f4["append"](_0x3ab352, _0x3f3586);
  return _0x14b0f4;
}