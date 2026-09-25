import { registerSidebarSubmenu } from '../sidebarSubmenuController.js';
import { createProviderSettingsController } from './appTopbarProviderConnection.js';
export function createAppTopbarAndConfig({
  store: _0x5c6b89,
  fetchApiConfigFromServer: _0x21784f,
  getApiConfigSnapshot: _0x3663e1,
  saveApiConfigToServer: _0x369192,
  testProviderConnections: _0x1e96d8,
  discoverCustomProvider: _0x1d2973,
  analyzeCustomProviderDocumentation: _0x6b5bc1,
  buildCustomProviderManifestDraft: _0x1f0549,
  validateCustomProviderManifestDraft: _0x281cb1,
  saveCustomProviderManifestBundle: _0x189d44,
  listCustomProviderManifestBundles: _0x145a2f,
  deleteCustomProviderManifestBundle: _0x42edf0,
  refreshManifestModelNodeUis: _0x38723d,
  fetchDreaminaCliStatusFromServer: _0x5905fa,
  fetchDreaminaCliLoginRuntimeFromServer: _0xb65ff1,
  startDreaminaHeadlessLoginFromServer: _0x7fbc3d,
  startDreaminaHeadlessReloginFromServer: _0x135bf2,
  startDreaminaWebLoginFromServer: _0x30ded5,
  importDreaminaLoginResponseFromServer: _0x1490b4,
  logoutDreaminaFromServer: _0x4726ae,
  buildDreaminaQrImageUrl: _0x5609e3,
  showError: _0x2efb66
} = {}) {
  const _0xbfde14 = createProviderSettingsController({
    'store': _0x5c6b89,
    'configPort': {
      'fetchConfig': _0x21784f,
      'getConfigSnapshot': _0x3663e1,
      'saveConfig': _0x369192,
      'testConnections': _0x1e96d8
    },
    'customProviderPort': {
      'discoverCustomProvider': _0x1d2973,
      'analyzeCustomProviderDocumentation': _0x6b5bc1,
      'buildCustomProviderManifestDraft': _0x1f0549,
      'validateCustomProviderManifestDraft': _0x281cb1,
      'saveCustomProviderManifestBundle': _0x189d44,
      'listCustomProviderManifestBundles': _0x145a2f,
      'deleteCustomProviderManifestBundle': _0x42edf0
    },
    'dreaminaPort': {
      'fetchDreaminaCliStatusFromServer': _0x5905fa,
      'fetchDreaminaCliLoginRuntimeFromServer': _0xb65ff1,
      'startDreaminaHeadlessLoginFromServer': _0x7fbc3d,
      'startDreaminaHeadlessReloginFromServer': _0x135bf2,
      'startDreaminaWebLoginFromServer': _0x30ded5,
      'importDreaminaLoginResponseFromServer': _0x1490b4,
      'logoutDreaminaFromServer': _0x4726ae,
      'buildDreaminaQrImageUrl': _0x5609e3
    },
    'uiPort': {
      'refreshManifestModelNodeUis': _0x38723d,
      'showError': _0x2efb66
    }
  });
  function _0xbaa416() {
    const _0x4666ea = document["getElementById"]("projectNameText");
    _0x4666ea && (_0x4666ea['addEventListener']('keydown', _0x167e7c => {
      if (_0x167e7c["key"] !== "Enter") {
        return;
      }
      _0x167e7c["preventDefault"]();
      _0x4666ea["blur"]();
    }), _0x4666ea['addEventListener']("click", () => {
      _0x4666ea["focus"]();
    }));
    const _0x326fd3 = document["getElementById"]("userAvatar");
    const _0x231b74 = document["getElementById"]("avatarMenu");
    _0x326fd3 && _0x231b74 && registerSidebarSubmenu({
      'key': "settings",
      'button': _0x326fd3,
      'panel': _0x231b74,
      'openClass': "open",
      'isOpen': () => _0x231b74["classList"]["contains"]('open')
    });
  }
  function _0x5afdb1() {
    _0xbaa416();
    _0xbfde14["init"]();
  }
  return {
    'destroy': _0xbfde14['destroy'],
    'init': _0x5afdb1
  };
}