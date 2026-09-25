import { getImageInputUploadQualityMode, setImageInputUploadQualityMode } from '../../services/imageInputUploadQualityService.js';
export function initImageInputUploadQualitySettings() {
  const _0x2c6f87 = document["querySelectorAll"]('#imageInputUploadQualityGroup\x20.cursor-size-btn[data-upload-quality]');
  if (!_0x2c6f87["length"]) {
    return;
  }
  const _0x2e4d5a = _0x5d8d0c => {
    const _0x243639 = setImageInputUploadQualityMode(_0x5d8d0c);
    _0x2c6f87["forEach"](_0x15d3dc => {
      _0x15d3dc["classList"]['toggle']('active', _0x15d3dc["dataset"]["uploadQuality"] === _0x243639);
      _0x15d3dc["setAttribute"]?.("aria-pressed", String(_0x15d3dc["dataset"]["uploadQuality"] === _0x243639));
    });
  };
  _0x2e4d5a(getImageInputUploadQualityMode());
  _0x2c6f87['forEach'](_0x425a2e => {
    _0x425a2e['addEventListener']("click", () => _0x2e4d5a(_0x425a2e["dataset"]["uploadQuality"]));
  });
}