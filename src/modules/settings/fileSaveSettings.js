import { fetchFileSavePathMigrationStatus, fetchUserSettingsFromServer, saveUserSettingsToServer, startFileSavePathMigration } from '../../../api/userSettingsApi.js';
import { enqueueElectronMediaTask, waitForElectronMediaTask } from '../../../api/localMediaTaskApi.js';
import { t } from '../../i18n/index.js';
import { isAudioVoiceLocalAsrRuntimeFailure } from '../audioVoiceLocalAsrRuntime.js';
import { showError, showSuccess } from '../../services/toastService.js';
import { desktopBridge } from '../../services/desktopBridge.js';
const MIGRATION_POLL_INTERVAL_MS = 0x15e;
const ASR_RUNTIME_INSTALL_TIMEOUT_MS = 0x5a * 0x3c * 0x3e8;
const AUDIO_VOICE_MODEL_PREPARE_TIMEOUT_MS = 0x3c * 0x3c * 0x3e8;
const FUNASR_GPU_TORCH_INSTALL_TIMEOUT_MS = 0x5a * 0x3c * 0x3e8;
const ROOT_FIELD_ID = "fileSaveRootDir";
const ROOT_BUTTON_ID = "btnFileSaveRootDirPick";
const SUBTITLE_RECOGNITION_ENGINE_GROUP_ID = 'subtitleRecognitionEngineGroup';
const SUBTITLE_RECOGNITION_MODEL_BUTTON_ID = "btnSubtitleRecognitionModelPrepare";
const SUBTITLE_RECOGNITION_STATUS_ID = "subtitleRecognitionStatus";
const SUBTITLE_RECOGNITION_DEFAULTS = Object['freeze']({
  'engine': "cpu",
  'modelStatus': "notDownloaded",
  'modelStatusByEngine': Object["freeze"]({}),
  'modelRootKey': '',
  'modelPreparedAt': 0x0
});
const FIELD_IDS = {
  'canvasDir': 'fileSaveCanvasDir',
  'dataDir': "fileSaveDataDir",
  'outputDir': "fileSaveOutputDir"
};
const MANAGED_DIR_NAMES = {
  'canvasDir': "projects",
  'dataDir': "data",
  'outputDir': "output"
};
const MIGRATION_STAGE_I18N_KEYS = Object["freeze"]({
  '准备迁移文件': 'migration.preparing',
  '正在创建迁移任务': "migration.creatingTask",
  '正在迁移文件': "migration.migrating",
  '正在迁移输出文件保存路径': "migration.migrateOutput",
  '迁移完成': 'migration.done'
});
let currentFileSaveUserSettings = {};
let subtitleRecognitionSettings = {
  ...SUBTITLE_RECOGNITION_DEFAULTS
};
let subtitleRecognitionPrepareState = {
  'status': "idle",
  'progress': 0x0,
  'message': ''
};
let stopSubtitleRecognitionTaskUpdateListener = null;
let activeSubtitleRecognitionTaskId = '';
function fileSaveText(_0x5d003e, _0x1beb6f = {}) {
  return t('settings.fileSave.' + _0x5d003e, _0x1beb6f);
}
function errorMessage(_0x50d1c4) {
  if (typeof _0x50d1c4 === "string") {
    return _0x50d1c4 || fileSaveText("runtime.unknownError");
  }
  return _0x50d1c4?.['message'] || fileSaveText("runtime.unknownError");
}
function getInput(_0x4e4ea5) {
  return document["getElementById"](FIELD_IDS[_0x4e4ea5]);
}
function getRootInput() {
  return document["getElementById"](ROOT_FIELD_ID);
}
function getRootPickButton() {
  return document["getElementById"](ROOT_BUTTON_ID);
}
function normalizeText(_0x38a1de) {
  return String(_0x38a1de || '')['trim']();
}
function normalizeSubtitleRecognitionEngine(_0x261aa0) {
  return String(_0x261aa0 || '')["trim"]()["toLowerCase"]() === "gpu" ? "gpu" : "cpu";
}
function normalizeSubtitleRecognitionModelStatus(_0x3a169c) {
  const _0x25c031 = String(_0x3a169c || '')["trim"]();
  return _0x25c031 === 'ready' ? "ready" : "notDownloaded";
}
function normalizeSubtitleRecognitionEngineStatus(_0x1c4781 = {}) {
  return {
    'modelStatus': normalizeSubtitleRecognitionModelStatus(_0x1c4781?.['modelStatus']),
    'modelRootKey': normalizeText(_0x1c4781?.['modelRootKey']),
    'modelPreparedAt': Number(_0x1c4781?.["modelPreparedAt"] || 0x0) || 0x0
  };
}
function normalizeSubtitleRecognitionStatusByEngine(_0x47a3a3 = {}, _0x15e480 = "cpu") {
  const _0x1901f0 = _0x47a3a3?.["modelStatusByEngine"] || {};
  const _0x17fa3d = {};
  for (const _0x324d37 of ['cpu', "gpu"]) {
    const _0x231acd = normalizeSubtitleRecognitionEngine(_0x324d37);
    const _0xe62797 = _0x1901f0?.[_0x231acd];
    _0xe62797 && typeof _0xe62797 === 'object' && (_0x17fa3d[_0x231acd] = normalizeSubtitleRecognitionEngineStatus(_0xe62797));
  }
  const _0xddc625 = normalizeSubtitleRecognitionEngine(_0x15e480);
  Object['keys'](_0x17fa3d)["length"] === 0x0 && !_0x17fa3d[_0xddc625] && _0x47a3a3?.["modelStatus"] === "ready" && (_0x17fa3d[_0xddc625] = normalizeSubtitleRecognitionEngineStatus(_0x47a3a3));
  return _0x17fa3d;
}
function normalizeSubtitleRecognitionSettings(_0x448c89 = {}) {
  const _0x478517 = normalizeSubtitleRecognitionEngine(_0x448c89?.["engine"]);
  const _0x3dfe57 = normalizeSubtitleRecognitionStatusByEngine(_0x448c89, _0x478517);
  const _0x47871b = Object["keys"](_0x3dfe57)['length'] > 0x0;
  const _0x299e7b = _0x3dfe57[_0x478517] || normalizeSubtitleRecognitionEngineStatus(_0x47871b ? {} : _0x448c89);
  return {
    ...SUBTITLE_RECOGNITION_DEFAULTS,
    ...(_0x448c89 || {}),
    'engine': _0x478517,
    'modelStatusByEngine': _0x3dfe57,
    'modelStatus': normalizeSubtitleRecognitionModelStatus(_0x299e7b["modelStatus"]),
    'modelRootKey': normalizeText(_0x299e7b["modelRootKey"]),
    'modelPreparedAt': Number(_0x299e7b['modelPreparedAt'] || 0x0) || 0x0
  };
}
function translateMigrationStage(_0x588105) {
  const _0x494441 = normalizeText(_0x588105);
  if (!_0x494441) {
    return '';
  }
  const _0x3718f8 = MIGRATION_STAGE_I18N_KEYS[_0x494441];
  return _0x3718f8 ? fileSaveText(_0x3718f8) : _0x494441;
}
function trimTrailingPathSeparators(_0x491fc9) {
  const _0x378474 = normalizeText(_0x491fc9);
  if (/^[a-zA-Z]:[\\/]*$/['test'](_0x378474)) {
    return _0x378474["slice"](0x0, 0x2) + '\x5c';
  }
  if (_0x378474 === '/' || _0x378474 === '\x5c') {
    return _0x378474;
  }
  return _0x378474["replace"](/[\\/]+$/g, '');
}
function getPathSeparator(_0x3c398a) {
  const _0x3a0f83 = normalizeText(_0x3c398a);
  return _0x3a0f83["includes"]('\x5c') && !_0x3a0f83['includes']('/') ? '\x5c' : '/';
}
function joinPath(_0x192555, _0x3453b6) {
  const _0xd781f1 = trimTrailingPathSeparators(_0x192555);
  if (!_0xd781f1) {
    return '';
  }
  if (_0xd781f1 === '/' || _0xd781f1 === '\x5c') {
    return '' + _0xd781f1 + _0x3453b6;
  }
  if (/^[a-zA-Z]:\\$/["test"](_0xd781f1)) {
    return '' + _0xd781f1 + _0x3453b6;
  }
  return '' + _0xd781f1 + getPathSeparator(_0xd781f1) + _0x3453b6;
}
function pathKey(_0x17816d) {
  return trimTrailingPathSeparators(_0x17816d)['replace'](/\\/g, '/')["toLowerCase"]();
}
function pathBasename(_0x4ae5cb) {
  const _0x30b53f = trimTrailingPathSeparators(_0x4ae5cb)["replace"](/\\/g, '/');
  const _0x1819fa = _0x30b53f['split']('/')["filter"](Boolean);
  return _0x1819fa['at'](-0x1) || '';
}
function normalizeParentPath(_0x5f18be) {
  const _0x4e1d1a = trimTrailingPathSeparators(_0x5f18be);
  const _0x357e4d = _0x4e1d1a["match"](/^(.*)[\\/][^\\/]+$/);
  if (!_0x357e4d) {
    return '';
  }
  const _0xffe6d3 = trimTrailingPathSeparators(_0x357e4d[0x1]);
  return /^[a-zA-Z]:$/["test"](_0xffe6d3) ? _0xffe6d3 + '\x5c' : _0xffe6d3;
}
function buildManagedPaths(_0x279843) {
  const _0x335c56 = trimTrailingPathSeparators(_0x279843);
  return {
    'canvasDir': joinPath(_0x335c56, MANAGED_DIR_NAMES["canvasDir"]),
    'dataDir': joinPath(_0x335c56, MANAGED_DIR_NAMES['dataDir']),
    'outputDir': joinPath(_0x335c56, MANAGED_DIR_NAMES["outputDir"])
  };
}
function inferManagedRoot(_0x179111) {
  const _0x35895c = normalizeFileSavePaths(_0x179111);
  const _0x284b12 = [];
  for (const [_0xfaa789, _0x6ee895] of Object["entries"](MANAGED_DIR_NAMES)) {
    const _0x23ae21 = normalizeText(_0x35895c?.[_0xfaa789]);
    if (!_0x23ae21 || pathBasename(_0x23ae21)['toLowerCase']() !== _0x6ee895["toLowerCase"]()) {
      return '';
    }
    _0x284b12["push"](normalizeParentPath(_0x23ae21));
  }
  const [_0x3433ba] = _0x284b12;
  if (!_0x3433ba) {
    return '';
  }
  return _0x284b12["every"](_0x28acb8 => pathKey(_0x28acb8) === pathKey(_0x3433ba)) ? _0x3433ba : '';
}
function inferDataDirFromTempDir(_0x1a1d10) {
  const _0x5ad61f = normalizeText(_0x1a1d10)['replace'](/\\/g, '/');
  if (!_0x5ad61f) {
    return '';
  }
  return /\/uploads\/?$/i['test'](_0x5ad61f) ? _0x5ad61f["replace"](/\/uploads\/?$/i, '') : _0x5ad61f;
}
function normalizeFileSavePaths(_0x4b89df) {
  return {
    ...(_0x4b89df || {}),
    'dataDir': normalizeText(_0x4b89df?.["dataDir"]) || inferDataDirFromTempDir(_0x4b89df?.['tempDir'])
  };
}
function getSettingsRootDir(_0x1c68ce = {}) {
  return normalizeText(_0x1c68ce?.["fileSavePathsMeta"]?.["rootDir"]) || inferManagedRoot(_0x1c68ce?.['fileSavePaths'] || {});
}
function getCurrentRootKey(_0x438074 = currentFileSaveUserSettings) {
  return pathKey(getSettingsRootDir(_0x438074));
}
function getSubtitleRecognitionEngineStatus(_0x25a04d, _0x33dffb = _0x25a04d?.["engine"]) {
  const _0x18812f = normalizeSubtitleRecognitionSettings(_0x25a04d);
  const _0x1330de = normalizeSubtitleRecognitionEngine(_0x33dffb || _0x18812f["engine"]);
  return _0x18812f['modelStatusByEngine']?.[_0x1330de] || (_0x1330de === _0x18812f['engine'] ? normalizeSubtitleRecognitionEngineStatus(_0x18812f) : null);
}
function modelStatusForCurrentRoot(_0x423829, _0x204290 = getCurrentRootKey(), _0x72dc08 = _0x423829?.["engine"]) {
  const _0x2b092f = getSubtitleRecognitionEngineStatus(_0x423829, _0x72dc08);
  if (!_0x2b092f || _0x2b092f['modelStatus'] !== 'ready') {
    return 'notDownloaded';
  }
  return _0x2b092f["modelRootKey"] && pathKey(_0x2b092f["modelRootKey"]) === pathKey(_0x204290) ? "ready" : 'notDownloaded';
}
function getSubtitleRecognitionElements() {
  return {
    'group': document["getElementById"](SUBTITLE_RECOGNITION_ENGINE_GROUP_ID),
    'modelButton': document["getElementById"](SUBTITLE_RECOGNITION_MODEL_BUTTON_ID),
    'status': document["getElementById"](SUBTITLE_RECOGNITION_STATUS_ID)
  };
}
function subtitleRecognitionText(_0x1dfee3, _0xcc72a7 = {}) {
  return fileSaveText("subtitleRecognition." + _0x1dfee3, _0xcc72a7);
}
function syncSubtitleRecognitionEngineButtons(_0x591c2a) {
  const _0x11d0c4 = getSubtitleRecognitionElements()["group"];
  if (!_0x11d0c4) {
    return;
  }
  _0x11d0c4["querySelectorAll"]?.('[data-subtitle-recognition-engine]')?.['forEach'](_0x209175 => {
    const _0x2a9e3d = normalizeSubtitleRecognitionEngine(_0x209175["dataset"]?.['subtitleRecognitionEngine']) === _0x591c2a;
    _0x209175["classList"]["toggle"]("active", _0x2a9e3d);
    _0x209175["setAttribute"]?.("aria-pressed", _0x2a9e3d ? 'true' : "false");
    _0x209175["disabled"] = subtitleRecognitionPrepareState["status"] === "downloading" || subtitleRecognitionPrepareState['status'] === "installing" || subtitleRecognitionPrepareState["status"] === "checking";
  });
}
function getSubtitleRecognitionStatusLabel() {
  if (subtitleRecognitionPrepareState['status'] === "downloading") {
    return subtitleRecognitionText('status.downloading', {
      'percent': clampPercent(subtitleRecognitionPrepareState["progress"] * 0x64) + '%'
    });
  }
  if (subtitleRecognitionPrepareState["status"] === "installing") {
    return subtitleRecognitionText('status.installing', {
      'percent': clampPercent(subtitleRecognitionPrepareState["progress"] * 0x64) + '%'
    });
  }
  if (subtitleRecognitionPrepareState['status'] === "checking") {
    return subtitleRecognitionText("status.checking");
  }
  if (subtitleRecognitionPrepareState["status"] === "gpuRequired") {
    return subtitleRecognitionText("status.gpuRequired");
  }
  if (subtitleRecognitionPrepareState["status"] === "error") {
    return subtitleRecognitionText("status.retry");
  }
  const _0x4849ef = getCurrentRootKey();
  const _0x1b23a0 = modelStatusForCurrentRoot(subtitleRecognitionSettings, _0x4849ef, subtitleRecognitionSettings["engine"]);
  return _0x1b23a0 === "ready" ? subtitleRecognitionText("status.ready") : subtitleRecognitionText("status.download");
}
function renderSubtitleRecognitionSettings() {
  const _0x29e4f6 = getSubtitleRecognitionElements();
  const _0x28efb7 = normalizeSubtitleRecognitionEngine(subtitleRecognitionSettings["engine"]);
  syncSubtitleRecognitionEngineButtons(_0x28efb7);
  if (_0x29e4f6["modelButton"]) {
    const _0x202581 = subtitleRecognitionPrepareState["status"] === "downloading";
    const _0x4936b9 = subtitleRecognitionPrepareState["status"] === "installing";
    const _0x477dfd = subtitleRecognitionPrepareState["status"] === "checking";
    const _0x1f72f8 = subtitleRecognitionPrepareState["status"] !== "error" && subtitleRecognitionPrepareState["status"] !== "gpuRequired" && subtitleRecognitionPrepareState["status"] !== "checking" && subtitleRecognitionPrepareState['status'] !== "installing" && modelStatusForCurrentRoot(subtitleRecognitionSettings, getCurrentRootKey(), subtitleRecognitionSettings["engine"]) === 'ready';
    _0x29e4f6["modelButton"]['textContent'] = getSubtitleRecognitionStatusLabel();
    _0x29e4f6['modelButton']["disabled"] = _0x202581 || _0x477dfd || _0x4936b9;
    _0x29e4f6['modelButton']["classList"]["toggle"]("is-success", _0x1f72f8);
    _0x29e4f6["modelButton"]['classList']["toggle"]("is-error", subtitleRecognitionPrepareState["status"] === "error");
    _0x29e4f6["modelButton"]["classList"]["toggle"]("is-warning", subtitleRecognitionPrepareState["status"] === "gpuRequired");
    _0x29e4f6["modelButton"]['classList']["toggle"]("is-busy", _0x202581 || _0x477dfd || _0x4936b9);
  }
  if (_0x29e4f6['status']) {
    const _0x4f572e = normalizeText(subtitleRecognitionPrepareState["message"]);
    _0x29e4f6["status"]["textContent"] = _0x4f572e;
    _0x29e4f6["status"]["classList"]["toggle"]("is-error", subtitleRecognitionPrepareState["status"] === "error");
    _0x29e4f6["status"]["classList"]['toggle']("is-warning", subtitleRecognitionPrepareState["status"] === "gpuRequired");
    _0x29e4f6['status']["classList"]["toggle"]('is-success', modelStatusForCurrentRoot(subtitleRecognitionSettings, getCurrentRootKey(), subtitleRecognitionSettings["engine"]) === "ready");
  }
}
function clearSubtitleRecognitionTaskUpdateListener() {
  stopSubtitleRecognitionTaskUpdateListener?.();
  stopSubtitleRecognitionTaskUpdateListener = null;
  activeSubtitleRecognitionTaskId = '';
}
function installSubtitleRecognitionTaskUpdateListener(_0x435525, _0x28a5ce = "downloading") {
  clearSubtitleRecognitionTaskUpdateListener();
  const _0x3ad6ed = normalizeText(_0x435525);
  if (!_0x3ad6ed || !desktopBridge["mediaTask"]['isAvailable']()) {
    return;
  }
  activeSubtitleRecognitionTaskId = _0x3ad6ed;
  stopSubtitleRecognitionTaskUpdateListener = desktopBridge['mediaTask']['onUpdate'](_0x1e9d0f => {
    if (normalizeText(_0x1e9d0f?.["taskId"]) !== activeSubtitleRecognitionTaskId) {
      return;
    }
    const _0x5eb91f = Math["max"](0x0, Math["min"](0x1, Number(_0x1e9d0f?.["progress"] || 0x0) || 0x0));
    subtitleRecognitionPrepareState = {
      'status': _0x28a5ce,
      'progress': _0x5eb91f,
      'message': normalizeText(_0x1e9d0f?.["message"])
    };
    renderSubtitleRecognitionSettings();
  });
}
async function saveSubtitleRecognitionSettings(_0x2b2d52 = {}, {
  silent = !![]
} = {}) {
  const _0x6f3073 = await fetchUserSettingsFromServer()["catch"](() => currentFileSaveUserSettings || {});
  const _0x2f9b4e = getCurrentRootKey(_0x6f3073);
  const _0x29c560 = normalizeSubtitleRecognitionSettings(_0x6f3073?.["subtitleRecognition"] || {});
  const _0x43383f = normalizeSubtitleRecognitionEngine(_0x2b2d52["engine"] || _0x29c560["engine"]);
  const _0x311e8d = {
    ...(_0x29c560["modelStatusByEngine"] || {})
  };
  const _0x683a15 = Object["prototype"]["hasOwnProperty"]["call"](_0x2b2d52, "modelStatus");
  const _0x2131b6 = normalizeSubtitleRecognitionModelStatus(_0x2b2d52['modelStatus']);
  _0x683a15 && (_0x311e8d[_0x43383f] = normalizeSubtitleRecognitionEngineStatus({
    'modelStatus': _0x2131b6,
    'modelRootKey': _0x2131b6 === "ready" ? _0x2f9b4e : '',
    'modelPreparedAt': _0x2131b6 === "ready" ? _0x2b2d52["modelPreparedAt"] || Date["now"]() : 0x0
  }));
  const _0x229b3 = normalizeSubtitleRecognitionSettings({
    ..._0x29c560,
    ..._0x2b2d52,
    'engine': _0x43383f,
    'modelStatusByEngine': _0x311e8d,
    ...(_0x683a15 ? {
      'modelStatus': _0x2131b6,
      'modelRootKey': _0x2131b6 === "ready" ? _0x2f9b4e : '',
      'modelPreparedAt': _0x2131b6 === "ready" ? _0x2b2d52['modelPreparedAt'] || Date["now"]() : 0x0
    } : {})
  });
  currentFileSaveUserSettings = {
    ...(_0x6f3073 || {}),
    'subtitleRecognition': _0x229b3
  };
  const _0x50e1e1 = await saveUserSettingsToServer(currentFileSaveUserSettings);
  _0x50e1e1?.["settings"] && typeof _0x50e1e1["settings"] === "object" && (currentFileSaveUserSettings = _0x50e1e1["settings"]);
  subtitleRecognitionSettings = normalizeSubtitleRecognitionSettings(currentFileSaveUserSettings["subtitleRecognition"] || _0x229b3);
  renderSubtitleRecognitionSettings();
  if (!silent) {
    showSuccess(subtitleRecognitionText('saved'));
  }
  return subtitleRecognitionSettings;
}
function isGpuRuntimeUnavailableError(_0x121d72) {
  const _0xbc96e7 = errorMessage(_0x121d72)['toLowerCase']();
  return _0xbc96e7["includes"]("gpu acceleration was selected") || _0xbc96e7['includes']('cuda\x20is\x20not\x20available') || _0xbc96e7["includes"]('cpu-only\x20pytorch') || _0xbc96e7["includes"]("cpu-only torch") || _0xbc96e7["includes"]("requires pytorch") || _0xbc96e7['includes']("cuda") && _0xbc96e7["includes"]("not available");
}
function isGpuRuntimeUnavailableCode(_0x3ed710) {
  return new Set(["gpu_unavailable", "cuda_unavailable", "torch_cpu_only", 'torch_missing'])["has"](String(_0x3ed710 || ''));
}
function isGpuRuntimeUnavailableResult(_0x3dac93 = {}) {
  return _0x3dac93?.["available"] === ![] && (isGpuRuntimeUnavailableCode(_0x3dac93?.["code"]) || isGpuRuntimeUnavailableError(_0x3dac93?.["message"] || ''));
}
function getGpuRuntimeUnavailableMessage(_0x3ea9e9 = {}) {
  const _0x1fe805 = String(_0x3ea9e9?.["code"] || '');
  const _0x83b126 = normalizeText(_0x3ea9e9?.["gpuName"]);
  if (_0x1fe805 === "torch_cpu_only") {
    return _0x83b126 ? subtitleRecognitionText("runtime.torchCpuOnlyWithGpu", {
      'gpu': _0x83b126
    }) : subtitleRecognitionText("runtime.torchCpuOnly");
  }
  if (_0x1fe805 === "torch_missing") {
    return subtitleRecognitionText('runtime.torchMissing');
  }
  if (_0x1fe805 === "cuda_unavailable") {
    return subtitleRecognitionText("runtime.cudaUnavailable");
  }
  return subtitleRecognitionText("runtime.gpuUnavailable");
}
async function checkSubtitleRecognitionRuntime(_0xcb621, {
  showFailureToast = !![]
} = {}) {
  const _0x4c6ab1 = normalizeSubtitleRecognitionEngine(_0xcb621);
  subtitleRecognitionPrepareState = {
    'status': "checking",
    'progress': 0x0,
    'message': _0x4c6ab1 === "gpu" ? subtitleRecognitionText("runtime.checkingGpu") : subtitleRecognitionText("status.checking")
  };
  renderSubtitleRecognitionSettings();
  try {
    const _0x4450df = await enqueueElectronMediaTask({
      'kind': "funasrRuntimeCheck",
      'cancellable': !![],
      'args': {
        'engine': _0x4c6ab1
      }
    }, {
      'wait': !![],
      'timeout': 0x2 * 0x3c * 0x3e8
    });
    if (isGpuRuntimeUnavailableResult(_0x4450df)) {
      subtitleRecognitionPrepareState = {
        'status': "gpuRequired",
        'progress': 0x0,
        'message': getGpuRuntimeUnavailableMessage(_0x4450df),
        'code': String(_0x4450df?.["code"] || ''),
        'gpuName': normalizeText(_0x4450df?.["gpuName"])
      };
      renderSubtitleRecognitionSettings();
      return {
        'available': ![],
        'engine': _0x4c6ab1
      };
    }
    if (!_0x4450df || _0x4450df["available"] === ![]) {
      const _0x16f9f2 = errorMessage(_0x4450df?.['message']);
      String(_0x4450df?.["code"] || '') === "funasr_missing" && (await saveSubtitleRecognitionSettings({
        'engine': _0x4c6ab1,
        'modelStatus': "notDownloaded"
      }));
      subtitleRecognitionPrepareState = {
        'status': "error",
        'progress': 0x0,
        'message': _0x16f9f2,
        'repairRequired': String(_0x4450df?.['code'] || '') === "funasr_missing"
      };
      renderSubtitleRecognitionSettings();
      showFailureToast && showError(subtitleRecognitionText("runtimeCheckFailed", {
        'error': _0x16f9f2
      }));
      return {
        'available': ![],
        'engine': _0x4c6ab1
      };
    }
    subtitleRecognitionPrepareState = {
      'status': "idle",
      'progress': 0x0,
      'message': ''
    };
    renderSubtitleRecognitionSettings();
    return {
      'available': !![],
      'engine': _0x4c6ab1
    };
  } catch (_0x4c3d98) {
    const _0x193d9e = isGpuRuntimeUnavailableError(_0x4c3d98);
    subtitleRecognitionPrepareState = {
      'status': _0x193d9e ? "gpuRequired" : 'error',
      'progress': 0x0,
      'code': _0x193d9e ? "gpu_unavailable" : '',
      'repairRequired': !_0x193d9e && isAudioVoiceLocalAsrRuntimeFailure(_0x4c3d98),
      'message': _0x193d9e ? subtitleRecognitionText('runtime.gpuUnavailable') : errorMessage(_0x4c3d98)
    };
    renderSubtitleRecognitionSettings();
    !_0x193d9e && showFailureToast && showError(subtitleRecognitionText("runtimeCheckFailed", {
      'error': errorMessage(_0x4c3d98)
    }));
    return {
      'available': ![],
      'engine': _0x4c6ab1
    };
  }
}
function shouldInstallSubtitleRecognitionGpuRuntime() {
  return normalizeSubtitleRecognitionEngine(subtitleRecognitionSettings["engine"]) === "gpu" && subtitleRecognitionPrepareState['status'] === "gpuRequired";
}
async function installSubtitleRecognitionGpuRuntime() {
  if (subtitleRecognitionPrepareState['status'] === "installing") {
    return;
  }
  subtitleRecognitionPrepareState = {
    'status': "installing",
    'progress': 0x0,
    'message': subtitleRecognitionText("runtime.installingGpuTorch")
  };
  renderSubtitleRecognitionSettings();
  try {
    const _0x161e1a = await enqueueElectronMediaTask({
      'kind': 'funasrGpuTorchInstall',
      'args': {
        'engine': "gpu"
      }
    });
    const _0x5e2e89 = normalizeText(_0x161e1a?.['taskId']);
    if (!_0x5e2e89) {
      throw new Error(subtitleRecognitionText("runtime.noTaskId"));
    }
    installSubtitleRecognitionTaskUpdateListener(_0x5e2e89, 'installing');
    await waitForElectronMediaTask(_0x5e2e89, {
      'timeout': FUNASR_GPU_TORCH_INSTALL_TIMEOUT_MS,
      'diagnosticPayload': {
        'kind': "funasrGpuTorchInstall"
      }
    });
    clearSubtitleRecognitionTaskUpdateListener();
    subtitleRecognitionPrepareState = {
      'status': "idle",
      'progress': 0x1,
      'message': ''
    };
    renderSubtitleRecognitionSettings();
    showSuccess(subtitleRecognitionText("gpuInstallReadyToast"));
    await checkSubtitleRecognitionRuntime('gpu');
  } catch (_0x2c76f8) {
    clearSubtitleRecognitionTaskUpdateListener();
    subtitleRecognitionPrepareState = {
      'status': "gpuRequired",
      'progress': 0x0,
      'message': errorMessage(_0x2c76f8),
      'code': "gpu_install_failed"
    };
    renderSubtitleRecognitionSettings();
    showError(subtitleRecognitionText('gpuInstallFailed', {
      'error': errorMessage(_0x2c76f8)
    }));
  }
}
async function prepareSubtitleRecognitionModel() {
  if (subtitleRecognitionPrepareState["status"] === 'downloading' || subtitleRecognitionPrepareState["status"] === "installing") {
    return;
  }
  let _0x38e6db = subtitleRecognitionPrepareState["repairRequired"] === !![];
  subtitleRecognitionPrepareState = {
    'status': 'downloading',
    'progress': 0x0,
    'message': subtitleRecognitionText("status.downloading", {
      'percent': '0%'
    })
  };
  renderSubtitleRecognitionSettings();
  try {
    const _0x21e285 = await enqueueElectronMediaTask({
      'kind': "asrRuntimeInstall",
      'args': {
        'engine': normalizeSubtitleRecognitionEngine(subtitleRecognitionSettings["engine"]),
        ...(_0x38e6db ? {
          'forceRepair': !![]
        } : {})
      }
    });
    const _0x5a7958 = normalizeText(_0x21e285?.["taskId"]);
    if (!_0x5a7958) {
      throw new Error(subtitleRecognitionText('runtime.noTaskId'));
    }
    installSubtitleRecognitionTaskUpdateListener(_0x5a7958);
    await waitForElectronMediaTask(_0x5a7958, {
      'timeout': ASR_RUNTIME_INSTALL_TIMEOUT_MS,
      'diagnosticPayload': {
        'kind': "asrRuntimeInstall"
      }
    });
    _0x38e6db = ![];
    clearSubtitleRecognitionTaskUpdateListener();
    subtitleRecognitionPrepareState = {
      'status': 'downloading',
      'progress': 0x0,
      'message': subtitleRecognitionText("status.downloading", {
        'percent': '0%'
      })
    };
    renderSubtitleRecognitionSettings();
    const _0x59fe15 = await enqueueElectronMediaTask({
      'kind': "audioVoiceModelPrepare",
      'args': {
        'engine': normalizeSubtitleRecognitionEngine(subtitleRecognitionSettings["engine"]),
        'downloadModelIfMissing': !![]
      }
    });
    const _0x33be4a = normalizeText(_0x59fe15?.["taskId"]);
    if (!_0x33be4a) {
      throw new Error(subtitleRecognitionText("runtime.noTaskId"));
    }
    installSubtitleRecognitionTaskUpdateListener(_0x33be4a);
    await waitForElectronMediaTask(_0x33be4a, {
      'timeout': AUDIO_VOICE_MODEL_PREPARE_TIMEOUT_MS,
      'diagnosticPayload': {
        'kind': "audioVoiceModelPrepare"
      }
    });
    clearSubtitleRecognitionTaskUpdateListener();
    subtitleRecognitionPrepareState = {
      'status': "idle",
      'progress': 0x1,
      'message': ''
    };
    await saveSubtitleRecognitionSettings({
      'engine': normalizeSubtitleRecognitionEngine(subtitleRecognitionSettings["engine"]),
      'modelStatus': "ready",
      'modelPreparedAt': Date['now']()
    });
    showSuccess(subtitleRecognitionText("readyToast"));
  } catch (_0x1904e2) {
    clearSubtitleRecognitionTaskUpdateListener();
    const _0xd1d367 = normalizeSubtitleRecognitionEngine(subtitleRecognitionSettings['engine']) === 'gpu' && isGpuRuntimeUnavailableError(_0x1904e2);
    subtitleRecognitionPrepareState = {
      'status': _0xd1d367 ? 'gpuRequired' : "error",
      'progress': 0x0,
      'code': _0xd1d367 ? "gpu_unavailable" : '',
      'repairRequired': _0x38e6db,
      'message': _0xd1d367 ? subtitleRecognitionText("runtime.gpuUnavailable") : errorMessage(_0x1904e2)
    };
    renderSubtitleRecognitionSettings();
    showError(_0xd1d367 ? subtitleRecognitionText("gpuUnavailableToast") : subtitleRecognitionText("prepareFailed", {
      'error': errorMessage(_0x1904e2)
    }));
  }
}
function applyPathsToInputs(_0x23cd66) {
  const _0x57ef0b = normalizeFileSavePaths(_0x23cd66);
  const _0x2890e6 = getRootInput();
  if (_0x2890e6) {
    _0x2890e6["value"] = inferManagedRoot(_0x57ef0b);
  }
  for (const _0x4b9c62 of Object["keys"](FIELD_IDS)) {
    const _0x171a54 = getInput(_0x4b9c62);
    if (_0x171a54) {
      _0x171a54['value'] = normalizeText(_0x57ef0b?.[_0x4b9c62]);
    }
  }
}
function setInputsDisabled(_0x271cb5) {
  const _0xf0aa47 = getRootInput();
  const _0x31e37a = getRootPickButton();
  if (_0xf0aa47) {
    _0xf0aa47['disabled'] = !!_0x271cb5;
  }
  if (_0x31e37a) {
    _0x31e37a["disabled"] = !!_0x271cb5;
  }
  for (const _0x17a475 of Object["keys"](FIELD_IDS)) {
    const _0x5568ef = getInput(_0x17a475);
    if (_0x5568ef) {
      _0x5568ef["disabled"] = !!_0x271cb5;
    }
  }
}
function readPathsFromInputs() {
  const _0x42ba05 = normalizeText(getRootInput()?.["value"]);
  if (_0x42ba05) {
    return buildManagedPaths(_0x42ba05);
  }
  return {
    'canvasDir': normalizeText(getInput("canvasDir")?.["value"]),
    'dataDir': normalizeText(getInput("dataDir")?.["value"]),
    'outputDir': normalizeText(getInput("outputDir")?.["value"])
  };
}
function validateRequired(_0x3f55d5) {
  if (!normalizeText(getRootInput()?.["value"]) && !_0x3f55d5["canvasDir"] && !_0x3f55d5["dataDir"] && !_0x3f55d5["outputDir"]) {
    return fileSaveText("validation.chooseRoot");
  }
  if (!_0x3f55d5["canvasDir"]) {
    return fileSaveText('validation.projectPath');
  }
  if (!_0x3f55d5["dataDir"]) {
    return fileSaveText("validation.dataPath");
  }
  if (!_0x3f55d5["outputDir"]) {
    return fileSaveText("validation.outputPath");
  }
  return '';
}
function setSaving(_0x24801f, _0x479553) {
  if (!_0x24801f) {
    return;
  }
  _0x24801f["disabled"] = !!_0x479553;
  _0x24801f["textContent"] = _0x479553 ? fileSaveText("runtime.saving") : fileSaveText("save");
}
function getDirectoryPicker() {
  return desktopBridge['dialog']["isAvailable"]() ? _0x25e964 => desktopBridge["dialog"]["selectDirectory"](_0x25e964) : null;
}
function readSelectedDirectory(_0x114e61) {
  if (!_0x114e61 || _0x114e61["canceled"]) {
    return '';
  }
  if (_0x114e61["success"] === ![]) {
    return '';
  }
  return normalizeText(_0x114e61['path'] || _0x114e61['filePath'] || _0x114e61['filePaths']?.[0x0]);
}
function getPickButtonLabel(_0x150ca2) {
  return normalizeText(_0x150ca2?.["querySelector"]?.('span')?.['textContent'] || _0x150ca2?.["textContent"] || fileSaveText('runtime.choose'));
}
function setPickButtonLabel(_0xce4fc5, _0x3879cb) {
  const _0x4aad88 = _0xce4fc5?.["querySelector"]?.("span");
  if (_0x4aad88) {
    _0x4aad88["textContent"] = _0x3879cb;
  } else {
    _0xce4fc5 && (_0xce4fc5["textContent"] = _0x3879cb);
  }
}
function syncDerivedInputsFromRoot() {
  const _0x255af7 = normalizeText(getRootInput()?.['value']);
  if (!_0x255af7) {
    return;
  }
  applyPathsToInputs(buildManagedPaths(_0x255af7));
}
async function pickRootDirectory() {
  const _0xe9036e = getRootInput();
  const _0x3fa61d = getDirectoryPicker();
  if (!_0xe9036e || typeof _0x3fa61d !== 'function') {
    showError(fileSaveText("runtime.pickerUnsupported"));
    return;
  }
  const _0x2640ea = getRootPickButton();
  const _0x1fb547 = getPickButtonLabel(_0x2640ea);
  _0x2640ea && (_0x2640ea["disabled"] = !![], setPickButtonLabel(_0x2640ea, fileSaveText("runtime.choosing")));
  try {
    const _0x5e7804 = await _0x3fa61d({
      'title': fileSaveText("runtime.pickTitle"),
      'defaultPath': normalizeText(_0xe9036e["value"])
    });
    const _0xc5ab76 = readSelectedDirectory(_0x5e7804);
    _0xc5ab76 && (_0xe9036e["value"] = _0xc5ab76, syncDerivedInputsFromRoot(), _0xe9036e['focus']?.());
  } catch (_0x376e6e) {
    console["error"]("[Settings] 选择保存目录失败:", _0x376e6e);
    showError(fileSaveText('runtime.pickFailed', {
      'error': errorMessage(_0x376e6e)
    }));
  } finally {
    _0x2640ea && (_0x2640ea["disabled"] = ![], setPickButtonLabel(_0x2640ea, _0x1fb547));
  }
}
function bindDirectoryPickers() {
  const _0x378b27 = getRootInput();
  _0x378b27 && !_0x378b27["__fileSaveRootInputBound"] && (_0x378b27["__fileSaveRootInputBound"] = !![], _0x378b27['addEventListener']('input', syncDerivedInputsFromRoot));
  const _0x412eaa = getRootPickButton();
  _0x412eaa && !_0x412eaa["__fileSaveDirectoryPickerBound"] && (_0x412eaa["__fileSaveDirectoryPickerBound"] = !![], _0x412eaa['addEventListener']("click", () => {
    void pickRootDirectory();
  }));
}
function bindSubtitleRecognitionSettings() {
  const _0x92dc64 = getSubtitleRecognitionElements();
  _0x92dc64["group"] && !_0x92dc64['group']["__subtitleRecognitionEngineBound"] && (_0x92dc64["group"]["__subtitleRecognitionEngineBound"] = !![], _0x92dc64["group"]['querySelectorAll']?.('[data-subtitle-recognition-engine]')?.["forEach"](_0x1a1746 => {
    _0x1a1746["addEventListener"]("click", async () => {
      const _0x50532e = normalizeSubtitleRecognitionEngine(_0x1a1746["dataset"]?.["subtitleRecognitionEngine"]);
      subtitleRecognitionSettings = normalizeSubtitleRecognitionSettings({
        ...subtitleRecognitionSettings,
        'engine': _0x50532e
      });
      subtitleRecognitionPrepareState = {
        'status': 'idle',
        'progress': 0x0,
        'message': ''
      };
      renderSubtitleRecognitionSettings();
      try {
        await saveSubtitleRecognitionSettings({
          'engine': _0x50532e
        });
        await checkSubtitleRecognitionRuntime(_0x50532e);
      } catch (_0x2e7ce5) {
        console["error"]("[Settings] save subtitle recognition engine failed:", _0x2e7ce5);
        showError(subtitleRecognitionText("saveFailed", {
          'error': errorMessage(_0x2e7ce5)
        }));
      }
    });
  }));
  _0x92dc64["modelButton"] && !_0x92dc64["modelButton"]["__subtitleRecognitionPrepareBound"] && (_0x92dc64["modelButton"]["__subtitleRecognitionPrepareBound"] = !![], _0x92dc64['modelButton']["addEventListener"]("click", () => {
    if (shouldInstallSubtitleRecognitionGpuRuntime()) {
      return installSubtitleRecognitionGpuRuntime();
    }
    return prepareSubtitleRecognitionModel();
  }));
}
function sleep(_0x582d1f) {
  return new Promise(_0x5e86ae => setTimeout(_0x5e86ae, _0x582d1f));
}
function getMigrationElements() {
  return {
    'card': document['getElementById']("fileSaveMigrationCard"),
    'stage': document['getElementById']('fileSaveMigrationStage'),
    'percent': document["getElementById"]("fileSaveMigrationPercent"),
    'bar': document["getElementById"]("fileSaveMigrationBar"),
    'processed': document["getElementById"]('fileSaveMigrationProcessed'),
    'copied': document["getElementById"]("fileSaveMigrationCopied"),
    'skipped': document["getElementById"]("fileSaveMigrationSkipped"),
    'failed': document["getElementById"]("fileSaveMigrationFailed"),
    'current': document['getElementById']("fileSaveMigrationCurrent"),
    'errors': document['getElementById']("fileSaveMigrationErrors")
  };
}
function clampPercent(_0x2a28b8) {
  const _0x2614f7 = Number(_0x2a28b8);
  if (!Number['isFinite'](_0x2614f7)) {
    return 0x0;
  }
  return Math["max"](0x0, Math["min"](0x64, Math["round"](_0x2614f7)));
}
function renderMigrationErrors(_0x4480c7, _0x3292e2) {
  if (!_0x4480c7) {
    return;
  }
  const _0x288e3a = Array["isArray"](_0x3292e2) ? _0x3292e2 : [];
  _0x4480c7["replaceChildren"]();
  _0x4480c7["hidden"] = _0x288e3a["length"] === 0x0;
  for (const _0x509493 of _0x288e3a["slice"](0x0, 0x14)) {
    const _0x2994a8 = document["createElement"]("div");
    _0x2994a8["className"] = "settings-file-migration-error";
    const _0x4bbd57 = normalizeText(_0x509493?.['path'] || _0x509493?.['localPath'] || '');
    const _0x55bd0c = normalizeText(_0x509493?.["error"] || fileSaveText("migration.itemFailed"));
    _0x2994a8["textContent"] = _0x4bbd57 ? _0x4bbd57 + " · " + _0x55bd0c : _0x55bd0c;
    _0x4480c7['appendChild'](_0x2994a8);
  }
}
function renderMigrationStatus(_0x19c6a8) {
  const _0x27a3c9 = getMigrationElements();
  if (!_0x27a3c9["card"]) {
    return;
  }
  _0x27a3c9["card"]["hidden"] = ![];
  const _0x3921d9 = clampPercent(_0x19c6a8?.["progress"]);
  if (_0x27a3c9["percent"]) {
    _0x27a3c9["percent"]["textContent"] = _0x3921d9 + '%';
  }
  if (_0x27a3c9["bar"]) {
    _0x27a3c9["bar"]["style"]["width"] = _0x3921d9 + '%';
  }
  _0x27a3c9["stage"] && (_0x27a3c9['stage']['textContent'] = translateMigrationStage(_0x19c6a8?.["stage"]) || fileSaveText("migration.migrating"));
  const _0x2db5aa = Number(_0x19c6a8?.["processedFiles"] || 0x0);
  const _0x49b923 = Number(_0x19c6a8?.["totalFiles"] || 0x0);
  _0x27a3c9["processed"] && (_0x27a3c9["processed"]["textContent"] = _0x2db5aa + " / " + (_0x49b923 || _0x2db5aa));
  if (_0x27a3c9["copied"]) {
    _0x27a3c9['copied']["textContent"] = String(Number(_0x19c6a8?.["copiedCount"] || 0x0));
  }
  if (_0x27a3c9['skipped']) {
    _0x27a3c9["skipped"]['textContent'] = String(Number(_0x19c6a8?.["skippedCount"] || 0x0));
  }
  if (_0x27a3c9['failed']) {
    _0x27a3c9["failed"]["textContent"] = String(Number(_0x19c6a8?.["failedCount"] || 0x0));
  }
  const _0x3d1737 = normalizeText(_0x19c6a8?.['currentFile']);
  _0x27a3c9["current"] && (_0x27a3c9["current"]["textContent"] = _0x3d1737 ? fileSaveText('migration.current', {
    'file': _0x3d1737
  }) : '', _0x27a3c9["current"]["title"] = _0x3d1737);
  renderMigrationErrors(_0x27a3c9["errors"], _0x19c6a8?.["errors"]);
}
function resetMigrationStatus() {
  const _0x53f27c = getMigrationElements();
  if (_0x53f27c["card"]) {
    _0x53f27c["card"]["hidden"] = !![];
  }
  if (_0x53f27c['stage']) {
    _0x53f27c['stage']["textContent"] = fileSaveText("migration.preparing");
  }
  if (_0x53f27c["percent"]) {
    _0x53f27c["percent"]["textContent"] = '0%';
  }
  if (_0x53f27c["bar"]) {
    _0x53f27c["bar"]["style"]["width"] = '0%';
  }
  if (_0x53f27c['processed']) {
    _0x53f27c["processed"]['textContent'] = "0 / 0";
  }
  if (_0x53f27c["copied"]) {
    _0x53f27c['copied']["textContent"] = '0';
  }
  if (_0x53f27c["skipped"]) {
    _0x53f27c["skipped"]["textContent"] = '0';
  }
  if (_0x53f27c["failed"]) {
    _0x53f27c["failed"]['textContent'] = '0';
  }
  _0x53f27c['current'] && (_0x53f27c['current']["textContent"] = '', _0x53f27c["current"]["title"] = '');
  renderMigrationErrors(_0x53f27c["errors"], []);
}
function isMigrationFinished(_0x15659c) {
  const _0x16560e = normalizeText(_0x15659c?.["status"]);
  return _0x16560e === "done" || _0x16560e === "error";
}
async function pollMigrationUntilFinished(_0x4c6dcf) {
  let _0x3da4e9 = null;
  while (!![]) {
    await sleep(MIGRATION_POLL_INTERVAL_MS);
    _0x3da4e9 = await fetchFileSavePathMigrationStatus(_0x4c6dcf);
    renderMigrationStatus(_0x3da4e9);
    if (isMigrationFinished(_0x3da4e9)) {
      return _0x3da4e9;
    }
  }
}
function buildMigrationSummary(_0x1e3cd5) {
  const _0x3bb4f2 = Number(_0x1e3cd5?.["copiedCount"] || 0x0);
  const _0x2d7f8f = Number(_0x1e3cd5?.['skippedCount'] || 0x0);
  const _0x7bb951 = Number(_0x1e3cd5?.['failedCount'] || 0x0);
  return fileSaveText("migration.summary", {
    'copied': _0x3bb4f2,
    'skipped': _0x2d7f8f,
    'failed': _0x7bb951
  });
}
async function saveSettingsWithMigration(_0x3c715e) {
  try {
    renderMigrationStatus({
      'status': 'pending',
      'stage': fileSaveText("migration.creatingTask"),
      'progress': 0x0
    });
    const _0x137585 = await startFileSavePathMigration(_0x3c715e);
    renderMigrationStatus(_0x137585);
    const _0xb1ab3d = normalizeText(_0x137585?.["jobId"]);
    if (!_0xb1ab3d) {
      throw new Error(fileSaveText("migration.noJobId"));
    }
    const _0x139e93 = await pollMigrationUntilFinished(_0xb1ab3d);
    if (normalizeText(_0x139e93?.["status"]) !== 'done') {
      throw new Error(_0x139e93?.["error"] || fileSaveText("migration.failedMessage"));
    }
    return _0x139e93;
  } catch (_0x12bc86) {
    if (Number(_0x12bc86?.["status"] || _0x12bc86?.["statusCode"] || 0x0) === 0x194) {
      const _0x2bf2d1 = await saveUserSettingsToServer(_0x3c715e);
      const _0xcfa007 = {
        'status': 'done',
        'progress': 0x64,
        'copiedCount': 0x0,
        'skippedCount': 0x0,
        'failedCount': 0x0,
        'settings': _0x2bf2d1?.["settings"]
      };
      renderMigrationStatus(_0xcfa007);
      return _0xcfa007;
    }
    throw _0x12bc86;
  }
}
export function initFileSaveSettings() {
  const _0x39bcce = document["getElementById"]('btnFileSavePathsSave');
  if (!_0x39bcce) {
    return;
  }
  bindDirectoryPickers();
  bindSubtitleRecognitionSettings();
  fetchUserSettingsFromServer()['then'](_0x12eea1 => {
    currentFileSaveUserSettings = _0x12eea1 || {};
    applyPathsToInputs(_0x12eea1?.["fileSavePaths"] || {});
    subtitleRecognitionSettings = normalizeSubtitleRecognitionSettings({
      ...(_0x12eea1?.["subtitleRecognition"] || {}),
      'modelStatus': modelStatusForCurrentRoot(_0x12eea1?.['subtitleRecognition'] || {}, getCurrentRootKey(_0x12eea1))
    });
    subtitleRecognitionPrepareState = {
      'status': "idle",
      'progress': 0x0,
      'message': ''
    };
    renderSubtitleRecognitionSettings();
  })["catch"](_0x3e8f4c => {
    console["error"]("[Settings] 加载文件与保存路径失败:", _0x3e8f4c);
    showError(fileSaveText("runtime.loadFailed"));
  });
  resetMigrationStatus();
  _0x39bcce["addEventListener"]("click", async () => {
    const _0x3439fd = readPathsFromInputs();
    const _0x5f1368 = validateRequired(_0x3439fd);
    if (_0x5f1368) {
      showError(_0x5f1368);
      return;
    }
    setSaving(_0x39bcce, !![]);
    setInputsDisabled(!![]);
    resetMigrationStatus();
    try {
      const _0x5128a5 = await fetchUserSettingsFromServer()['catch'](() => ({}));
      currentFileSaveUserSettings = _0x5128a5 || {};
      const _0x34b88b = pathKey(getSettingsRootDir(_0x5128a5));
      const _0x32c5b4 = pathKey(normalizeText(getRootInput()?.["value"]));
      const _0x3b0650 = _0x32c5b4 && _0x32c5b4 !== _0x34b88b;
      const _0xb7bff4 = await saveSettingsWithMigration({
        ...(_0x5128a5 || {}),
        'fileSavePaths': _0x3439fd,
        'fileSavePathsMeta': {
          ...(_0x5128a5?.["fileSavePathsMeta"] || {}),
          'source': 'user',
          'mode': normalizeText(getRootInput()?.["value"]) ? "root" : "custom",
          'rootDir': normalizeText(getRootInput()?.["value"]),
          'updatedAt': Date['now']()
        },
        ...(_0x3b0650 ? {
          'subtitleRecognition': normalizeSubtitleRecognitionSettings({
            ...(_0x5128a5?.['subtitleRecognition'] || {}),
            'modelStatus': 'notDownloaded',
            'modelStatusByEngine': {},
            'modelRootKey': ''
          })
        } : {})
      });
      const _0x123bf5 = _0xb7bff4?.["settings"] || (await fetchUserSettingsFromServer());
      currentFileSaveUserSettings = _0x123bf5 || {};
      applyPathsToInputs(_0x123bf5?.["fileSavePaths"] || _0x3439fd);
      subtitleRecognitionSettings = normalizeSubtitleRecognitionSettings({
        ...(_0x123bf5?.["subtitleRecognition"] || subtitleRecognitionSettings),
        'modelStatus': modelStatusForCurrentRoot(_0x123bf5?.['subtitleRecognition'] || subtitleRecognitionSettings, getCurrentRootKey(_0x123bf5))
      });
      subtitleRecognitionPrepareState = {
        'status': "idle",
        'progress': 0x0,
        'message': ''
      };
      renderSubtitleRecognitionSettings();
      Number(_0xb7bff4?.["failedCount"] || 0x0) > 0x0 ? showError(fileSaveText("runtime.partialMigrationFailed", {
        'summary': buildMigrationSummary(_0xb7bff4)
      })) : showSuccess(buildMigrationSummary(_0xb7bff4));
    } catch (_0x48c2b7) {
      console["error"]('[Settings]\x20保存文件与保存路径失败:', _0x48c2b7);
      showError(fileSaveText('runtime.saveFailed', {
        'error': errorMessage(_0x48c2b7)
      }));
    } finally {
      setSaving(_0x39bcce, ![]);
      setInputsDisabled(![]);
    }
  });
}