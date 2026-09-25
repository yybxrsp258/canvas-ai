import { mkdirSync } from 'node:fs';
function withZipExtension(_0x2f640a) {
  const _0x1f92f2 = String(_0x2f640a || '')["trim"]();
  if (!_0x1f92f2) {
    return '';
  }
  return _0x1f92f2['toLowerCase']()["endsWith"](".zip") ? _0x1f92f2 : _0x1f92f2 + ".zip";
}
export function createDiagnosticsCapabilityOperations({
  diagnostics: _0x3a848f,
  logDir: _0x15a7aa,
  showSaveDialog: _0x44b7e8,
  openFolder: _0x5b3c5c
} = {}) {
  if (typeof _0x3a848f?.["createPackage"] !== "function") {
    throw new TypeError("diagnostics.createPackage must be a function");
  }
  if (typeof _0x3a848f?.['getSuggestedPackagePath'] !== 'function') {
    throw new TypeError("diagnostics.getSuggestedPackagePath must be a function");
  }
  if (typeof _0x44b7e8 !== "function") {
    throw new TypeError('showSaveDialog\x20must\x20be\x20a\x20function');
  }
  if (typeof _0x5b3c5c !== "function") {
    throw new TypeError("openFolder must be a function");
  }
  return Object['freeze']({
    async 'createPackage'(_0x3bba7d = {}) {
      const _0x24dd9e = _0x3bba7d && typeof _0x3bba7d === "object" ? _0x3bba7d : {};
      const _0x28d92e = await _0x44b7e8({
        'title': '保存诊断包',
        'defaultPath': _0x3a848f["getSuggestedPackagePath"](),
        'filters': [{
          'name': 'ZIP\x20archive',
          'extensions': ["zip"]
        }]
      });
      if (_0x28d92e?.["canceled"] || !_0x28d92e?.["filePath"]) {
        return {
          'ok': ![],
          'success': ![],
          'canceled': !![]
        };
      }
      const _0x3552d5 = await _0x3a848f["createPackage"]({
        'aiAnalysisReport': _0x24dd9e["aiAnalysisReport"],
        'outputPath': withZipExtension(_0x28d92e['filePath'])
      });
      return {
        ..._0x3552d5,
        'success': !![],
        'canceled': ![]
      };
    },
    'openLogsFolder'() {
      mkdirSync(_0x15a7aa, {
        'recursive': !![]
      });
      const _0x27a22f = _0x5b3c5c(_0x15a7aa) || {};
      return {
        'ok': !![],
        'foregroundRequested': _0x27a22f["foregroundRequested"] === !![]
      };
    }
  });
}