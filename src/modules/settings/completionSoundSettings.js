import { fetchUserSettingsFromServer, saveUserSettingsToServer } from '../../../api/userSettingsApi.js';
import { COMPLETION_SOUND_DEFAULTS, BUILT_IN_COMPLETION_SOUND_PATH, normalizeCompletionSoundSettings, previewCompletionSound, setCompletionSoundSettingsCache } from '../../services/completionSoundService.js';
import { showError, showSuccess } from '../../services/toastService.js';
import { t } from '../../i18n/index.js';
import { desktopBridge } from '../../services/desktopBridge.js';
function completionSoundText(_0x4ae80c, _0x2b78d5 = {}) {
  return t("settings.completionSound." + _0x4ae80c, _0x2b78d5);
}
const ELEMENT_IDS = Object["freeze"]({
  'enabledGroup': "completionSoundEnabledGroup",
  'notificationEnabledGroup': 'completionNotificationEnabledGroup',
  'volumeSlider': "completionSoundVolumeSlider",
  'volumeValue': "completionSoundVolumeValue",
  'fileControl': 'completionSoundFileControl',
  'fileSelect': "completionSoundFileSelect",
  'fileTrigger': "completionSoundFileTrigger",
  'fileTriggerText': "completionSoundFileTriggerText",
  'fileMenu': "completionSoundFileMenu",
  'openFolderButton': "btnCompletionSoundOpenFolder",
  'refreshButton': "btnCompletionSoundRefresh",
  'previewButton': "btnCompletionSoundPreview",
  'status': "completionSoundStatus"
});
let currentSettings = normalizeCompletionSoundSettings(COMPLETION_SOUND_DEFAULTS);
let currentUserSettings = {};
let currentFiles = [];
function getElement(_0x239a93) {
  return document['getElementById'](_0x239a93);
}
function normalizeText(_0x301050) {
  return String(_0x301050 || '')["trim"]();
}
function normalizePathKey(_0x5d7713) {
  return normalizeText(_0x5d7713)["replace"](/\\/g, '/')['toLowerCase']();
}
function clampVolumePercent(_0x10c1ea) {
  const _0x276425 = Number(_0x10c1ea);
  if (!Number["isFinite"](_0x276425)) {
    return Math["round"](COMPLETION_SOUND_DEFAULTS['volume'] * 0x64);
  }
  return Math["max"](0x0, Math['min'](0x64, Math["round"](_0x276425)));
}
function isBuiltInNotifyPath(_0x40e056) {
  const _0x53d892 = normalizePathKey(_0x40e056);
  return _0x53d892["endsWith"]("/assets/sounds/notify.mp3") || _0x53d892 === BUILT_IN_COMPLETION_SOUND_PATH;
}
function readSettingsFromControls() {
  const _0x33984b = clampVolumePercent(getElement(ELEMENT_IDS["volumeSlider"])?.["value"]);
  return normalizeCompletionSoundSettings({
    ...currentSettings,
    'volume': _0x33984b / 0x64,
    'selectedFilePath': normalizeText(getElement(ELEMENT_IDS["fileSelect"])?.["value"]) || BUILT_IN_COMPLETION_SOUND_PATH
  });
}
function setStatus(_0x417e62 = '', _0x550c2f = '') {
  const _0x12a47c = getElement(ELEMENT_IDS["status"]);
  if (!_0x12a47c) {
    return;
  }
  _0x12a47c["textContent"] = _0x417e62;
  _0x12a47c["classList"]["toggle"]("is-error", _0x550c2f === "error");
  _0x12a47c["classList"]["toggle"]("is-success", _0x550c2f === "success");
}
function syncEnabledButtons(_0x5af8dd) {
  const _0xff2d91 = getElement(ELEMENT_IDS["enabledGroup"]);
  if (!_0xff2d91) {
    return;
  }
  _0xff2d91["querySelectorAll"]('.cursor-size-btn')["forEach"](_0x366b44 => {
    const _0x583fb9 = _0x366b44["dataset"]["completionSoundEnabled"] === 'on';
    _0x366b44["classList"]["toggle"]("active", _0x583fb9 === _0x5af8dd);
    _0x366b44['setAttribute']?.("aria-pressed", String(_0x583fb9 === _0x5af8dd));
  });
}
function syncNotificationEnabledButtons(_0x2e4f5f) {
  const _0x2e0679 = getElement(ELEMENT_IDS['notificationEnabledGroup']);
  if (!_0x2e0679) {
    return;
  }
  _0x2e0679['querySelectorAll']('.cursor-size-btn')["forEach"](_0x6c4797 => {
    const _0x6ecbcc = _0x6c4797['dataset']["completionNotificationEnabled"] === 'on';
    _0x6c4797["classList"]["toggle"]('active', _0x6ecbcc === _0x2e4f5f);
    _0x6c4797["setAttribute"]?.("aria-pressed", String(_0x6ecbcc === _0x2e4f5f));
  });
}
function renderSettings(_0x5ad5bd) {
  currentSettings = normalizeCompletionSoundSettings(_0x5ad5bd);
  setCompletionSoundSettingsCache(currentSettings);
  syncEnabledButtons(currentSettings["enabled"]);
  syncNotificationEnabledButtons(currentSettings["notificationEnabled"]);
  const _0x8055c5 = clampVolumePercent(currentSettings["volume"] * 0x64);
  const _0x45d612 = getElement(ELEMENT_IDS["volumeSlider"]);
  const _0x286656 = getElement(ELEMENT_IDS["volumeValue"]);
  if (_0x45d612) {
    _0x45d612["value"] = String(_0x8055c5);
  }
  if (_0x286656) {
    _0x286656["textContent"] = _0x8055c5 + '%';
  }
}
function selectFilePathFromList(_0x291183, _0x18c88e) {
  const _0x402517 = normalizePathKey(_0x18c88e);
  const _0x3efe48 = _0x291183["find"](_0x29b7be => normalizePathKey(_0x29b7be?.["path"]) === _0x402517);
  if (_0x3efe48?.["path"]) {
    return _0x3efe48["path"];
  }
  if (isBuiltInNotifyPath(_0x18c88e)) {
    const _0x6defb = _0x291183['find'](_0x81ba8a => normalizeText(_0x81ba8a?.["name"])["toLowerCase"]() === 'notify.mp3');
    if (_0x6defb?.["path"]) {
      return _0x6defb["path"];
    }
  }
  return _0x291183[0x0]?.["path"] || BUILT_IN_COMPLETION_SOUND_PATH;
}
function renderFileOptions(_0x487405, _0xc38e93 = '') {
  currentFiles = Array["isArray"](_0x487405) ? _0x487405 : [];
  const _0xf1b57b = getElement(ELEMENT_IDS["fileSelect"]);
  const _0x21c24d = getElement(ELEMENT_IDS['fileTriggerText']);
  const _0x48127e = getElement(ELEMENT_IDS["fileMenu"]);
  if (!_0xf1b57b) {
    return;
  }
  _0xf1b57b["replaceChildren"]();
  _0x48127e?.['replaceChildren']?.();
  const _0x5a9770 = selectFilePathFromList(currentFiles, _0xc38e93);
  if (currentFiles["length"] === 0x0) {
    const _0x2de455 = document["createElement"]("option");
    _0x2de455["value"] = BUILT_IN_COMPLETION_SOUND_PATH;
    _0x2de455['textContent'] = "notify.mp3";
    _0xf1b57b['appendChild'](_0x2de455);
    _0xf1b57b["value"] = BUILT_IN_COMPLETION_SOUND_PATH;
    if (_0x21c24d) {
      _0x21c24d['textContent'] = "notify.mp3";
    }
    return;
  }
  for (const _0x207e85 of currentFiles) {
    const _0x4e9133 = normalizeText(_0x207e85?.['path']);
    if (!_0x4e9133) {
      continue;
    }
    const _0x1d0b51 = document['createElement']('option');
    _0x1d0b51["value"] = _0x4e9133;
    _0x1d0b51["textContent"] = normalizeText(_0x207e85?.["name"]) || _0x4e9133;
    _0xf1b57b['appendChild'](_0x1d0b51);
    const _0x52cc9b = document["createElement"]("button");
    _0x52cc9b["type"] = 'button';
    _0x52cc9b["className"] = "settings-preset-option";
    _0x52cc9b['dataset']['value'] = _0x4e9133;
    _0x52cc9b["textContent"] = _0x1d0b51["textContent"];
    _0x52cc9b["setAttribute"]?.("role", "option");
    _0x48127e?.["appendChild"]?.(_0x52cc9b);
  }
  _0xf1b57b["value"] = _0x5a9770;
  syncFileMenuSelection(_0x5a9770);
}
function getSelectedFileLabel(_0xd32880) {
  const _0xd72f5d = normalizePathKey(_0xd32880);
  const _0x531670 = currentFiles["find"](_0x10834b => normalizePathKey(_0x10834b?.["path"]) === _0xd72f5d);
  return normalizeText(_0x531670?.["name"]) || "notify.mp3";
}
function syncFileMenuSelection(_0x28f174) {
  const _0xbdd84 = getElement(ELEMENT_IDS["fileSelect"]);
  const _0x4b85a9 = getElement(ELEMENT_IDS["fileTriggerText"]);
  const _0x570eab = getElement(ELEMENT_IDS["fileMenu"]);
  if (_0xbdd84) {
    _0xbdd84['value'] = _0x28f174;
  }
  if (_0x4b85a9) {
    _0x4b85a9["textContent"] = getSelectedFileLabel(_0x28f174);
  }
  _0x570eab?.['querySelectorAll']?.('.settings-preset-option')?.['forEach'](_0x577661 => {
    const _0x42a180 = normalizePathKey(_0x577661['dataset']?.["value"]) === normalizePathKey(_0x28f174);
    _0x577661['classList']["toggle"]("is-active", _0x42a180);
    _0x577661["setAttribute"]?.("aria-selected", _0x42a180 ? 'true' : "false");
  });
}
function setFileMenuOpen(_0x26b8f1, {
  focusMenu = ![],
  focusTrigger = ![]
} = {}) {
  const _0x2e8940 = getElement(ELEMENT_IDS['fileControl']);
  const _0x2e903f = getElement(ELEMENT_IDS["fileTrigger"]);
  const _0xd412d = getElement(ELEMENT_IDS["fileMenu"]);
  if (!_0x2e8940 || !_0x2e903f || !_0xd412d) {
    return;
  }
  _0x2e8940['classList']["toggle"]("is-open", !!_0x26b8f1);
  _0x2e903f['setAttribute']?.("aria-expanded", _0x26b8f1 ? "true" : "false");
  _0xd412d["hidden"] = !_0x26b8f1;
  if (_0x26b8f1 && focusMenu) {
    const _0xd7c081 = Array["from"](_0xd412d["querySelectorAll"]?.('.settings-preset-option') || [])["find"](_0x43e674 => _0x43e674['classList']?.["contains"]("is-active")) || _0xd412d['querySelectorAll']?.(".settings-preset-option")?.[0x0];
    _0xd7c081?.["focus"]?.();
  } else {
    !_0x26b8f1 && focusTrigger && _0x2e903f['focus']?.();
  }
}
function isFileMenuOpen() {
  return !!getElement(ELEMENT_IDS["fileControl"])?.["classList"]?.["contains"]("is-open");
}
async function selectCompletionSoundFile(_0x51ae42) {
  const _0x1f8e37 = selectFilePathFromList(currentFiles, _0x51ae42);
  currentSettings = normalizeCompletionSoundSettings({
    ...currentSettings,
    'selectedFilePath': _0x1f8e37
  });
  syncFileMenuSelection(_0x1f8e37);
  setCompletionSoundSettingsCache(currentSettings);
  setFileMenuOpen(![], {
    'focusTrigger': !![]
  });
  await saveCompletionSoundSettings(currentSettings, {
    'silent': !![]
  });
}
async function saveCompletionSoundSettings(_0x430448, {
  silent = ![]
} = {}) {
  const _0x122da9 = normalizeCompletionSoundSettings({
    ..._0x430448,
    'updatedAt': Date["now"]()
  });
  currentSettings = _0x122da9;
  setCompletionSoundSettingsCache(_0x122da9);
  try {
    const _0x339328 = await fetchUserSettingsFromServer()["catch"](() => currentUserSettings || {});
    currentUserSettings = {
      ...(_0x339328 || {}),
      'completionSound': _0x122da9
    };
    const _0x2f966c = await saveUserSettingsToServer(currentUserSettings);
    _0x2f966c?.["settings"] && typeof _0x2f966c["settings"] === 'object' && (currentUserSettings = _0x2f966c["settings"]);
    if (!silent) {
      showSuccess(completionSoundText("saved"));
    }
    return _0x122da9;
  } catch (_0x40e4bd) {
    console["error"]('[completionSoundSettings]\x20save\x20failed:', _0x40e4bd);
    showError(completionSoundText('saveFailed', {
      'error': _0x40e4bd?.['message'] || completionSoundText('unknownError')
    }));
    throw _0x40e4bd;
  }
}
async function loadSystemSoundFiles({
  saveSelected = ![]
} = {}) {
  if (!desktopBridge["notificationSound"]['isAvailable']()) {
    renderFileOptions([], currentSettings["selectedFilePath"]);
    setStatus(completionSoundText("listUnsupported"), 'error');
    return [];
  }
  try {
    setStatus(completionSoundText("readingSystemSounds"));
    const _0x562316 = await desktopBridge["notificationSound"]["listSystemSounds"]();
    const _0x5b38c0 = Array["isArray"](_0x562316?.["files"]) ? _0x562316["files"] : [];
    const _0x2a1d69 = selectFilePathFromList(_0x5b38c0, currentSettings['selectedFilePath']);
    renderFileOptions(_0x5b38c0, _0x2a1d69);
    currentSettings = normalizeCompletionSoundSettings({
      ...currentSettings,
      'selectedFilePath': _0x2a1d69
    });
    setCompletionSoundSettingsCache(currentSettings);
    setStatus(_0x5b38c0["length"] ? completionSoundText("foundMp3Files", {
      'count': _0x5b38c0["length"]
    }) : completionSoundText("emptyMp3Directory"), _0x5b38c0["length"] ? "success" : '');
    if (saveSelected) {
      await saveCompletionSoundSettings(currentSettings, {
        'silent': !![]
      });
    }
    return _0x5b38c0;
  } catch (_0x108c4f) {
    console['error']("[completionSoundSettings] list system sounds failed:", _0x108c4f);
    renderFileOptions([], currentSettings["selectedFilePath"]);
    setStatus(completionSoundText("listFailed", {
      'error': _0x108c4f?.["message"] || completionSoundText("unknownError")
    }), "error");
    return [];
  }
}
function bindEvents() {
  const _0x23e169 = getElement(ELEMENT_IDS["enabledGroup"]);
  _0x23e169 && !_0x23e169["__completionSoundBound"] && (_0x23e169["__completionSoundBound"] = !![], _0x23e169["querySelectorAll"]('.cursor-size-btn')['forEach'](_0x1a8010 => {
    _0x1a8010["addEventListener"]("click", async () => {
      const _0x318114 = _0x1a8010["dataset"]["completionSoundEnabled"] === 'on';
      const _0x7545ad = normalizeCompletionSoundSettings({
        ...currentSettings,
        'enabled': _0x318114
      });
      renderSettings(_0x7545ad);
      await saveCompletionSoundSettings(_0x7545ad, {
        'silent': !![]
      });
    });
  }));
  const _0x341e5b = getElement(ELEMENT_IDS["notificationEnabledGroup"]);
  _0x341e5b && !_0x341e5b["__completionSoundBound"] && (_0x341e5b["__completionSoundBound"] = !![], _0x341e5b["querySelectorAll"]('.cursor-size-btn')['forEach'](_0x470ff9 => {
    _0x470ff9["addEventListener"]('click', async () => {
      const _0x4b9f1e = _0x470ff9["dataset"]["completionNotificationEnabled"] === 'on';
      const _0x182a95 = normalizeCompletionSoundSettings({
        ...currentSettings,
        'notificationEnabled': _0x4b9f1e
      });
      renderSettings(_0x182a95);
      await saveCompletionSoundSettings(_0x182a95, {
        'silent': !![]
      });
    });
  }));
  const _0x3de7aa = getElement(ELEMENT_IDS["volumeSlider"]);
  _0x3de7aa && !_0x3de7aa["__completionSoundBound"] && (_0x3de7aa["__completionSoundBound"] = !![], _0x3de7aa["addEventListener"]("input", () => {
    const _0x115a3d = clampVolumePercent(_0x3de7aa["value"]);
    const _0x51aa68 = getElement(ELEMENT_IDS["volumeValue"]);
    if (_0x51aa68) {
      _0x51aa68['textContent'] = _0x115a3d + '%';
    }
  }), _0x3de7aa["addEventListener"]("change", async () => {
    await saveCompletionSoundSettings(readSettingsFromControls(), {
      'silent': !![]
    });
  }));
  const _0x7ce2fc = getElement(ELEMENT_IDS["fileSelect"]);
  _0x7ce2fc && !_0x7ce2fc["__completionSoundBound"] && (_0x7ce2fc["__completionSoundBound"] = !![], _0x7ce2fc["addEventListener"]("change", async () => {
    await saveCompletionSoundSettings(readSettingsFromControls(), {
      'silent': !![]
    });
  }));
  const _0x556870 = getElement(ELEMENT_IDS["fileTrigger"]);
  const _0x2a3a7c = getElement(ELEMENT_IDS['fileMenu']);
  _0x556870 && _0x2a3a7c && !_0x556870['__completionSoundBound'] && (_0x556870['__completionSoundBound'] = !![], _0x556870["addEventListener"]('click', () => {
    setFileMenuOpen(!isFileMenuOpen(), {
      'focusMenu': !![]
    });
  }), _0x556870["addEventListener"]('keydown', _0x266175 => {
    (_0x266175["key"] === "ArrowDown" || _0x266175["key"] === "Enter" || _0x266175["key"] === '\x20') && (_0x266175["preventDefault"]?.(), setFileMenuOpen(!![], {
      'focusMenu': !![]
    }));
  }), _0x2a3a7c['addEventListener']("click", _0x2db557 => {
    const _0x334f3f = _0x2db557["target"]?.["closest"]?.(".settings-preset-option");
    if (!_0x334f3f || _0x334f3f["disabled"]) {
      return;
    }
    void selectCompletionSoundFile(_0x334f3f["dataset"]['value']);
  }), _0x2a3a7c['addEventListener']('keydown', _0x68bbe3 => {
    if (_0x68bbe3['key'] === "Escape") {
      _0x68bbe3["preventDefault"]?.();
      setFileMenuOpen(![], {
        'focusTrigger': !![]
      });
    } else {
      if (_0x68bbe3["key"] === 'Enter' || _0x68bbe3["key"] === '\x20') {
        _0x68bbe3["preventDefault"]?.();
        const _0x40d767 = document["activeElement"]?.['closest']?.('.settings-preset-option');
        if (_0x40d767 && !_0x40d767["disabled"]) {
          void selectCompletionSoundFile(_0x40d767["dataset"]["value"]);
        }
      }
    }
  }), typeof document['addEventListener'] === "function" && document["addEventListener"]('pointerdown', _0x47edb0 => {
    if (!isFileMenuOpen()) {
      return;
    }
    const _0x5802ed = getElement(ELEMENT_IDS["fileControl"]);
    if (typeof _0x5802ed?.["contains"] === "function" && _0x5802ed["contains"](_0x47edb0["target"])) {
      return;
    }
    setFileMenuOpen(![]);
  }));
  getElement(ELEMENT_IDS['openFolderButton'])?.["addEventListener"]("click", async () => {
    if (!desktopBridge["notificationSound"]["isAvailable"]()) {
      showError(completionSoundText("openFolderUnsupported"));
      return;
    }
    try {
      await desktopBridge["notificationSound"]['openSystemSoundFolder']();
    } catch (_0x511d03) {
      showError(completionSoundText("openFolderFailed", {
        'error': _0x511d03?.['message'] || completionSoundText('unknownError')
      }));
    }
  });
  getElement(ELEMENT_IDS["refreshButton"])?.['addEventListener']('click', () => {
    void loadSystemSoundFiles({
      'saveSelected': !![]
    });
  });
  getElement(ELEMENT_IDS["previewButton"])?.["addEventListener"]("click", async () => {
    await previewCompletionSound(readSettingsFromControls());
  });
}
export function initCompletionSoundSettings() {
  if (!getElement(ELEMENT_IDS["enabledGroup"])) {
    return;
  }
  bindEvents();
  renderSettings(COMPLETION_SOUND_DEFAULTS);
  renderFileOptions([], BUILT_IN_COMPLETION_SOUND_PATH);
  fetchUserSettingsFromServer()["then"](async _0x3513e2 => {
    currentUserSettings = _0x3513e2 || {};
    renderSettings(_0x3513e2?.["completionSound"] || COMPLETION_SOUND_DEFAULTS);
    await loadSystemSoundFiles({
      'saveSelected': ![]
    });
  })['catch'](_0x18d0cd => {
    console["error"]("[completionSoundSettings] load failed:", _0x18d0cd);
    showError(completionSoundText("loadFailed"));
  });
}
export const __completionSoundSettingsForTest = {
  'renderSettings': renderSettings,
  'renderFileOptions': renderFileOptions,
  'readSettingsFromControls': readSettingsFromControls,
  'getCurrentSettings': () => currentSettings,
  'getCurrentFiles': () => currentFiles,
  'selectFilePathFromList': selectFilePathFromList
};