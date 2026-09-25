import { createCanvasProjectSaveController } from './canvasProjectSaveController.js';
import { buildCanvasProjectContext, createCanvasProjectOperations } from './canvasProjectOperations.js';
import { clearElement, setStaticInnerHTML, setText } from '../utils/dom.js';
import { stripCanvasProjectFileExtension } from '../utils/canvasProjectFileNames.js';
import { canUseDesktopProjectApi, exportDesktopProjectPackage, importDesktopProjectPackage, openDesktopProject } from '../services/desktopProjectService.js';
import { deleteV2ProjectFromServer, fetchV2ProjectsFromServer } from '../../api/projectsV2Api.js';
import { showContextMenu } from './interaction/contextMenuPresenter.js';
import { closeSidebarSubmenu, registerSidebarSubmenu } from './sidebarSubmenuController.js';
import { t } from '../i18n/index.js';
import { desktopBridge } from '../services/desktopBridge.js';
import { assertCanvasProjectSaveAllowed } from '../services/canvasProjectAccess.js';
import { createCanvasProjectBadge } from '../components/sharedProjectIcon.js';
import { CANVAS_TOOLBAR_PLACEMENT_EVENT, normalizeCanvasToolbarPlacement } from './canvasToolbarPlacement.js';
function projectDropdownText(_0x27b7e9, _0x20bbf1 = {}) {
  return t('projectDropdown.' + _0x27b7e9, _0x20bbf1);
}
function stripProjectFileExtensionFromName(_0x347575) {
  return stripCanvasProjectFileExtension(_0x347575);
}
const CanvasProjectDropdownManager = {
  'init'(_0x3b58a9 = {}) {
    const _0x934712 = 0xc;
    const _0x1d2018 = 0xc;
    const _0x54449c = document["getElementById"]('btnCanvasLogo');
    const _0x30d0e8 = document["getElementById"]('canvasProjDropdown');
    const _0xb03efb = _0x30d0e8?.["querySelector"](".cpd-header");
    const _0xe07462 = document["getElementById"]("canvasProjList");
    const _0x1d0ae2 = document["getElementById"]("btnCloseProjDropdown");
    const _0x1e0cbf = document["getElementById"]('btnNewCanvas');
    const _0x2a7912 = document["getElementById"]("saveDialogOverlay");
    const _0x32a90a = document['getElementById']("saveDialogInput");
    const _0x5c1f59 = document['getElementById']("saveDialogCancel");
    const _0x52ec92 = document["getElementById"]("saveDialogConfirm");
    const _0x4e6ca3 = typeof _0x3b58a9["getCanvasToolbarPlacement"] === 'function' ? _0x3b58a9['getCanvasToolbarPlacement'] : () => "left";
    const _0x4ecc71 = typeof _0x3b58a9['onWorkspaceProjectPackageImported'] === "function" ? _0x3b58a9["onWorkspaceProjectPackageImported"] : null;
    let _0x5e767b = null;
    const _0xac9c09 = _0x3b58a9['projectWorkspaceSessions'] || {
      async 'save'() {},
      async 'load'() {
        return null;
      },
      async 'clear'() {},
      async 'move'() {}
    };
    let _0xe6d9e1 = 0x0;
    let _0x1e9cb9 = ![];
    if (!_0x54449c || !_0x30d0e8 || !_0x2a7912) {
      return;
    }
    const _0x4ec9d9 = _0x3b58a9["projectOperations"] || createCanvasProjectOperations({
      'getCanvasManager': () => window["CanvasTabManager"],
      'getActiveProjectContext': _0x138309,
      'onProjectHydrated': _0x3b58a9["onProjectHydrated"],
      'renameTemporaryProject': _0x3b58a9['renameTemporaryProject'],
      'projectWorkspaceSessions': _0xac9c09,
      'applySourceNames': _0xc9e12c => window["_v2ApplySourceNamesFromFileNameToCanvas"]?.(_0xc9e12c),
      'requestCacheSave': () => window["_triggerLocalCacheSave"]?.()
    });
    document["body"]['appendChild'](_0x30d0e8);
    function _0x1b98e7() {
      if (!_0x54449c || !_0x30d0e8) {
        return;
      }
      const _0x269637 = _0x54449c["getBoundingClientRect"]();
      const _0x5c93f0 = _0x30d0e8["classList"]["contains"]('open');
      if (!_0x5c93f0) {
        _0x30d0e8['classList']["add"]('open');
      }
      const _0x2fc024 = _0x30d0e8['getBoundingClientRect']()["height"] || _0x30d0e8["offsetHeight"] || 0x0;
      const _0x2ad538 = _0x30d0e8["getBoundingClientRect"]()["width"] || _0x30d0e8["offsetWidth"] || 0x0;
      const _0x3e4f18 = normalizeCanvasToolbarPlacement(_0x4e6ca3());
      _0x30d0e8["dataset"]["placement"] = _0x3e4f18;
      if (_0x3e4f18 === "bottom") {
        const _0x387f08 = window['innerWidth'] - _0x2ad538 - _0x1d2018;
        const _0x3d90f3 = _0x269637["left"] + (_0x269637['width'] - _0x2ad538) / 0x2;
        const _0x18cb6e = _0x387f08 <= _0x1d2018 ? _0x1d2018 : Math["min"](Math["max"](_0x3d90f3, _0x1d2018), _0x387f08);
        const _0x3d4ce1 = Math["max"](_0x1d2018, _0x269637["top"] - _0x934712 - _0x2fc024);
        _0x30d0e8['style']["left"] = _0x18cb6e + 'px';
        _0x30d0e8["style"]["top"] = _0x3d4ce1 + 'px';
        if (!_0x5c93f0) {
          _0x30d0e8["classList"]["remove"]('open');
        }
        return;
      }
      const _0x32c4c8 = _0x269637['top'] + (_0x269637['height'] - _0x2fc024) / 0x2;
      const _0x478aaa = window['innerHeight'] - _0x2fc024 - _0x1d2018;
      const _0x253b70 = _0x478aaa <= _0x1d2018 ? _0x1d2018 : Math['min'](Math['max'](_0x32c4c8, _0x1d2018), _0x478aaa);
      const _0x2a008e = Math["max"](_0x1d2018, window["innerWidth"] - _0x2ad538 - _0x1d2018);
      const _0x59863a = _0x3e4f18 === "right" ? _0x269637["left"] - _0x934712 - _0x2ad538 : _0x269637["right"] + _0x934712;
      const _0x2da39f = Math['min'](Math["max"](_0x59863a, _0x1d2018), _0x2a008e);
      _0x30d0e8["style"]["left"] = _0x2da39f + 'px';
      _0x30d0e8["style"]['top'] = _0x253b70 + 'px';
      if (!_0x5c93f0) {
        _0x30d0e8['classList']["remove"]("open");
      }
    }
    function _0x1f04da(_0x454aa1) {
      const _0x14b8a5 = new Date(_0x454aa1 * 0x3e8);
      return _0x14b8a5["getFullYear"]() + '-' + String(_0x14b8a5["getMonth"]() + 0x1)["padStart"](0x2, '0') + '-' + String(_0x14b8a5["getDate"]())["padStart"](0x2, '0') + '\x20' + String(_0x14b8a5["getHours"]())['padStart'](0x2, '0') + ':' + String(_0x14b8a5["getMinutes"]())["padStart"](0x2, '0');
    }
    function _0x16c016() {
      const _0x64c4ca = document["getElementById"]("projectNameText");
      return String(_0x64c4ca?.["textContent"] || '')['trim']() || projectDropdownText("unnamedCanvas");
    }
    function _0x5e1455() {
      const _0xd7dc3b = window["CanvasTabManager"];
      const _0x2f651e = String(_0xd7dc3b?.["getActiveCanvasId"]?.() || _0xd7dc3b?.["_activeId"] || '')["trim"]();
      const _0x23fd50 = Array["isArray"](_0xd7dc3b?.['_canvases']) ? _0xd7dc3b["_canvases"] : [];
      const _0x4c9b71 = _0x23fd50["find"](_0x1198e7 => String(_0x1198e7?.['id'] || '') === _0x2f651e) || _0x23fd50[0x0];
      return String(_0x4c9b71?.["name"] || '')['trim']();
    }
    function _0x223cbf(_0x31f372) {
      const _0x27fb90 = String(_0x31f372 || '')["trim"]();
      if (!_0x27fb90) {
        return !![];
      }
      const _0x2f5296 = new Set(["新项目", "New project", projectDropdownText("unnamedCanvas"), t('project.newProject'), t("projectManager.newProjectFallback"), t("projectLifecycle.untitledProject"), t("projectLifecycle.untitledCanvas"), t("projectLifecycle.defaultCanvas"), t("canvasTabs.defaultCanvasName"), t("canvasTabs.untitledCanvas")]['map'](_0x5434cd => String(_0x5434cd || '')['trim']())["filter"](Boolean));
      if (_0x2f5296["has"](_0x27fb90)) {
        return !![];
      }
      return /^(?:画布|Canvas)\s+\d+$/i["test"](_0x27fb90);
    }
    function _0x1c6d4c(_0x3567d6) {
      return stripProjectFileExtensionFromName(_0x3567d6)["replace"](/\s+/g, '\x20')['trim']()['toLowerCase']();
    }
    function _0x1c19bd(_0x3efc21, _0xef8d5) {
      const _0x4b6ad4 = _0x1c6d4c(_0xef8d5);
      if (!_0x4b6ad4) {
        return ![];
      }
      return [_0x3efc21?.["name"], _0x3efc21?.["filename"]]["some"](_0x377392 => _0x1c6d4c(_0x377392) === _0x4b6ad4);
    }
    async function _0x5b3e06(_0xb76dd1) {
      const _0x4d9144 = await fetchV2ProjectsFromServer();
      return _0x4d9144["some"](_0x54e501 => _0x1c19bd(_0x54e501, _0xb76dd1));
    }
    function _0x3c6856() {
      const _0x5dafaf = _0x5e1455();
      if (_0x5dafaf) {
        return _0x5dafaf;
      }
      return _0x16c016();
    }
    function _0x1f9d23() {
      return window["CanvasTabManager"]?.["getMultiDataSnapshot"]?.({
        'sanitizeForPersistence': !![]
      }) || {
        'canvases': [],
        'activeCanvasId': null
      };
    }
    function _0x192b24() {
      return stripProjectFileExtensionFromName(window['currentProjectId'] || window["_v2CurrentFile"] || '');
    }
    function _0x138309() {
      return window['CanvasTabManager']?.['getCanvasProjectContext']?.() || {
        'projectId': window["currentProjectId"] || '',
        'filename': window['_v2CurrentFile'] || '',
        'projectName': _0x16c016(),
        'recentId': window["_v2CurrentRecentProjectId"] || '',
        'displayPath': window["_v2CurrentProjectDisplayPath"] || '',
        'lastModified': Number(window["_v2CurrentProjectLastModified"] || 0x0) || 0x0,
        'isTemporary': ![],
        'workspaceProjectScoped': window["_v2WorkspaceProjectScoped"] !== ![]
      };
    }
    function _0x1b8bd0() {
      const _0x4cdd6c = _0x1f9d23();
      if (window["_v2WorkspaceProjectScoped"] === !![]) {
        return _0x4cdd6c;
      }
      const _0x57b385 = Array["isArray"](_0x4cdd6c?.["canvases"]) ? _0x4cdd6c["canvases"] : [];
      const _0x147628 = _0x57b385['find'](_0x549031 => _0x549031?.['id'] === _0x4cdd6c["activeCanvasId"]) || _0x57b385[0x0] || null;
      return {
        ..._0x4cdd6c,
        'canvases': _0x147628 ? [_0x147628] : [],
        'activeCanvasId': _0x147628?.['id'] || null
      };
    }
    async function _0x4da778(_0xeed53e = '') {
      const _0x3e855e = _0x192b24();
      const _0x2fafb7 = new Set([_0xeed53e, _0x3e855e]["map"](stripProjectFileExtensionFromName)['filter'](Boolean));
      window['CanvasTabManager']?.["hasDirtyCanvases"]?.() === !![] && (await _0xac9c09["save"]({
        'projectId': _0x3e855e,
        'projectName': _0x16c016(),
        'multiData': _0x1b8bd0(),
        'hasUnsavedChanges': !![]
      }), _0x2fafb7["delete"](_0x3e855e));
      await Promise["all"](Array["from"](_0x2fafb7, _0x211f08 => _0xac9c09["clear"](_0x211f08)));
    }
    function _0x430910(_0x12e4fa = {}) {
      const _0x18f9c4 = _0x1f9d23();
      const _0x2936d1 = Array["isArray"](_0x18f9c4?.["canvases"]) ? _0x18f9c4['canvases'] : [];
      if (!_0x2936d1['length']) {
        return {
          'projectName': String(_0x12e4fa["projectName"] || _0x16c016())["trim"](),
          'multiData': _0x18f9c4
        };
      }
      const _0x51283c = String(_0x12e4fa['canvasId'] || window["CanvasTabManager"]?.["getActiveCanvasId"]?.() || _0x18f9c4["activeCanvasId"] || '')['trim']();
      const _0x3020b7 = _0x2936d1["find"](_0x37f5b0 => String(_0x37f5b0?.['id'] || '') === _0x51283c) || _0x2936d1['find'](_0x243b0d => String(_0x243b0d?.['id'] || '') === String(_0x18f9c4["activeCanvasId"] || '')) || _0x2936d1[0x0];
      const _0x59bc06 = String(_0x12e4fa['projectName'] || _0x3020b7?.["name"] || _0x16c016())['trim']();
      const _0x50b65e = _0x3020b7 && _0x12e4fa["renameActiveCanvas"] ? {
        ..._0x3020b7,
        'name': _0x59bc06
      } : _0x3020b7;
      return {
        'projectName': _0x59bc06,
        'multiData': {
          ..._0x18f9c4,
          'canvases': _0x50b65e ? [_0x50b65e] : [],
          'activeCanvasId': _0x50b65e?.['id'] || _0x51283c || null
        }
      };
    }
    function _0x5d1ba5(_0x47f406 = [], _0x17abb8 = 0x3) {
      const _0x3b1a8d = Array["isArray"](_0x47f406) ? _0x47f406["map"](_0x25da35 => String(_0x25da35?.["localPath"] || _0x25da35?.["url"] || _0x25da35 || '')['trim']())["filter"](Boolean) : [];
      if (!_0x3b1a8d["length"]) {
        return '';
      }
      const _0x22ec9c = _0x3b1a8d["slice"](0x0, _0x17abb8)['join'](projectDropdownText("listSeparator"));
      return _0x3b1a8d["length"] > _0x17abb8 ? projectDropdownText("listMore", {
        'items': _0x22ec9c,
        'count': _0x3b1a8d["length"]
      }) : _0x22ec9c;
    }
    function _0x268802(_0x53f49c = {}) {
      if (_0x53f49c['code'] === "MISSING_LOCAL_ASSETS") {
        const _0x4c7cba = _0x5d1ba5(_0x53f49c["missing"]);
        return _0x4c7cba ? projectDropdownText('packageExport.missingLocalWithSummary', {
          'summary': _0x4c7cba
        }) : projectDropdownText("packageExport.missingLocal");
      }
      if (_0x53f49c["code"] === 'REMOTE_MEDIA_NOT_LOCALIZED') {
        const _0x3bc518 = _0x5d1ba5(_0x53f49c["remoteMedia"]);
        return _0x3bc518 ? projectDropdownText("packageExport.remoteNotLocalizedWithSummary", {
          'summary': _0x3bc518
        }) : projectDropdownText("packageExport.remoteNotLocalized");
      }
      return _0x53f49c["message"] || projectDropdownText("packageExport.failed");
    }
    function _0x5c3fa9(_0x4dd9da = []) {
      const _0x4e5379 = Array["isArray"](_0x4dd9da) ? _0x4dd9da : [];
      const _0x3d31eb = _0x4e5379["filter"](_0x1042e7 => _0x1042e7?.["type"] === "missing-original-video-fallback")["length"];
      if (_0x3d31eb <= 0x0) {
        return '';
      }
      return projectDropdownText("packageExport.missingOriginalVideos", {
        'count': _0x3d31eb
      });
    }
    function _0x146544(_0x33ad4c = "pkg") {
      return _0x33ad4c + '-' + Date["now"]() + '-' + Math['random']()['toString'](0x24)["slice"](0x2, 0x8);
    }
    let _0xc9032a = null;
    function _0x5b332e(_0x2f60c9) {
      const _0x3582c9 = Math["max"](0x0, Math["floor"]((Date["now"]() - _0x2f60c9) / 0x3e8));
      if (_0x3582c9 < 0x3c) {
        return projectDropdownText("elapsedSeconds", {
          'seconds': _0x3582c9
        });
      }
      const _0x3b9cc5 = Math["floor"](_0x3582c9 / 0x3c);
      const _0x3c99ae = String(_0x3582c9 % 0x3c)['padStart'](0x2, '0');
      return projectDropdownText("elapsedMinutesSeconds", {
        'minutes': _0x3b9cc5,
        'seconds': _0x3c99ae
      });
    }
    function _0x25170e(_0x36fa42 = {}) {
      const _0x1dd228 = String(_0x36fa42?.["message"] || projectDropdownText("packageProcessing"))["trim"]();
      const _0xbd9929 = Number(_0x36fa42?.["progress"]);
      if (!Number["isFinite"](_0xbd9929) || _0xbd9929 < 0x0) {
        return _0x1dd228;
      }
      return _0x1dd228 + '\x20·\x20' + Math["round"](Math["max"](0x0, Math['min'](0x1, _0xbd9929)) * 0x64) + '%';
    }
    function _0x4a4537(_0x8f0f6d = {}) {
      if (!_0xc9032a) {
        return;
      }
      const {
        root: _0x3768ba,
        titleEl: _0x10427e,
        messageEl: _0x4e5ac9,
        elapsedEl: _0x3a93aa,
        progressEl: _0x1492e6,
        startedAt: _0x1600ce
      } = _0xc9032a;
      const _0x5096ba = String(_0x8f0f6d?.["title"] || projectDropdownText("collectingCurrentProject"))["trim"]();
      const _0x808b85 = _0x25170e(_0x8f0f6d);
      const _0x4fd30b = _0x5b332e(_0x1600ce);
      const _0x4b8552 = Number(_0x8f0f6d?.['progress']);
      const _0x199e7e = Number['isFinite'](_0x4b8552) && _0x4b8552 >= 0x0;
      setText(_0x10427e, _0x5096ba);
      setText(_0x4e5ac9, _0x808b85);
      setText(_0x3a93aa, _0x4fd30b);
      _0x3768ba["setAttribute"]('aria-label', _0x5096ba + '，' + _0x808b85 + '，' + _0x4fd30b);
      _0x199e7e ? _0x3768ba["classList"]["add"]("has-progress") : _0x3768ba['classList']["remove"]("has-progress");
      _0x1492e6["hidden"] = !_0x199e7e;
      if (_0x199e7e) {
        _0x1492e6['value'] = Math["max"](0x0, Math["min"](0x1, _0x4b8552));
      }
      _0xc9032a['lastPayload'] = _0x8f0f6d;
    }
    function _0x1789c6(_0x2096ff = {}) {
      if (typeof document === "undefined" || !document["body"]) {
        return;
      }
      if (_0xc9032a?.["root"]) {
        _0x4a4537(_0x2096ff);
        return;
      }
      document["getElementById"]?.("project-package-loading")?.["remove"]?.();
      const _0x3d4d00 = document["createElement"]('div');
      _0x3d4d00['id'] = "project-package-loading";
      _0x3d4d00["className"] = 'project-package-loading\x20is-visible';
      _0x3d4d00["setAttribute"]("role", "status");
      _0x3d4d00["setAttribute"]("aria-live", "polite");
      const _0x560eed = document["createElement"]("div");
      _0x560eed["className"] = "project-package-loading-panel";
      const _0x1f0232 = document["createElement"]("div");
      _0x1f0232["className"] = 'project-package-loading-spinner';
      _0x1f0232['setAttribute']("aria-hidden", 'true');
      const _0x39e1e8 = document["createElement"]("div");
      _0x39e1e8["className"] = "project-package-loading-body";
      const _0x5be689 = document["createElement"]('div');
      _0x5be689["className"] = "project-package-loading-title";
      const _0x3d79f0 = document["createElement"]("div");
      _0x3d79f0["className"] = "project-package-loading-message";
      const _0x477fec = document["createElement"]("div");
      _0x477fec['className'] = "project-package-loading-meta";
      const _0x17f3eb = document["createElement"]("span");
      _0x17f3eb["className"] = "project-package-loading-elapsed";
      _0x477fec["appendChild"](_0x17f3eb);
      const _0x39ed6e = document["createElement"]("progress");
      _0x39ed6e["className"] = 'project-package-loading-progress';
      _0x39ed6e["max"] = 0x1;
      _0x39ed6e["value"] = 0x0;
      _0x39ed6e["hidden"] = !![];
      _0x39e1e8['appendChild'](_0x5be689);
      _0x39e1e8['appendChild'](_0x3d79f0);
      _0x39e1e8["appendChild"](_0x477fec);
      _0x39e1e8["appendChild"](_0x39ed6e);
      _0x560eed["appendChild"](_0x1f0232);
      _0x560eed["appendChild"](_0x39e1e8);
      _0x3d4d00["appendChild"](_0x560eed);
      document["body"]["appendChild"](_0x3d4d00);
      const _0x4ae755 = typeof window["setInterval"] === "function" ? window["setInterval"]['bind'](window) : setInterval;
      _0xc9032a = {
        'root': _0x3d4d00,
        'titleEl': _0x5be689,
        'messageEl': _0x3d79f0,
        'elapsedEl': _0x17f3eb,
        'progressEl': _0x39ed6e,
        'startedAt': Date["now"](),
        'lastPayload': _0x2096ff,
        'timerId': _0x4ae755(() => {
          _0x4a4537(_0xc9032a?.["lastPayload"] || {});
        }, 0x3e8)
      };
      _0x4a4537(_0x2096ff);
    }
    function _0x43fee8(_0x1f805b = {}) {
      if (!_0xc9032a) {
        _0x1789c6(_0x1f805b);
      }
      _0x4a4537(_0x1f805b);
    }
    async function _0x3cdf1a() {
      if (typeof window["requestAnimationFrame"] === "function") {
        await new Promise(_0x27abe5 => {
          window["requestAnimationFrame"](() => {
            window["requestAnimationFrame"](_0x27abe5);
          });
        });
        return;
      }
      const _0x268e7e = typeof window["setTimeout"] === "function" ? window['setTimeout']["bind"](window) : setTimeout;
      await new Promise(_0x5762c1 => _0x268e7e(_0x5762c1, 0x0));
    }
    async function _0x2a5a34(_0x18bb0d = projectDropdownText("loadingProjectDefault")) {
      _0x1789c6({
        'title': projectDropdownText('loadingProjectTitle'),
        'message': _0x18bb0d
      });
      await _0x3cdf1a();
    }
    function _0x42fd4c() {
      if (!_0xc9032a) {
        return;
      }
      const _0x2acd58 = _0xc9032a;
      _0xc9032a = null;
      const _0xd9b3f7 = typeof window["clearInterval"] === "function" ? window["clearInterval"]["bind"](window) : clearInterval;
      const _0x53ccc3 = typeof window["setTimeout"] === "function" ? window['setTimeout']["bind"](window) : setTimeout;
      _0xd9b3f7(_0x2acd58["timerId"]);
      _0x2acd58["root"]["classList"]["remove"]("is-visible");
      _0x2acd58["root"]["classList"]["add"]("is-hiding");
      _0x53ccc3(() => _0x2acd58['root']["remove"]?.(), 0xb4);
    }
    function _0x17e126(_0x2ae620, {
      title = projectDropdownText("collectingCurrentProject")
    } = {}) {
      if (!desktopBridge["project"]["isAvailable"]()) {
        return () => {};
      }
      const _0x4871f5 = desktopBridge['project']["onPackageProgress"]((_0x428510 = {}) => {
        if (String(_0x428510?.["operationId"] || '') !== _0x2ae620) {
          return;
        }
        _0x43fee8({
          'title': title,
          ..._0x428510
        });
      });
      return typeof _0x4871f5 === "function" ? _0x4871f5 : () => {};
    }
    function _0x4ac8c4(_0x2cd138) {
      if (!_0x2cd138) {
        return;
      }
      _0x2cd138['classList']["remove"]("is-shaking");
      void _0x2cd138["offsetWidth"];
      _0x2cd138["classList"]['add']("is-shaking");
      window["setTimeout"](() => {
        _0x2cd138['classList']['remove']("is-shaking");
      }, 0xf0);
    }
    function _0xd64379(_0xc6c230, _0x7ef6f3, _0x2a65b8) {
      _0x4ac8c4(_0xc6c230);
      window["setTimeout"](() => {
        _0x7ef6f3["hidden"] = !![];
        _0x2a65b8["hidden"] = ![];
      }, 0xb4);
    }
    function _0x18119b() {
      _0x5e767b?.["close"]?.();
      _0x5e767b = null;
    }
    function _0x246585(_0x57abdf) {
      return !!_0x57abdf?.["closest"]?.("[data-sidebar-submenu-owner=\"canvas-project\"]");
    }
    async function _0x6cc779(_0x1e9af0, _0x509611, _0xb8c08f = {}) {
      const _0x2c2781 = await _0x4ec9d9["renameProject"](_0x1e9af0, _0x509611);
      const _0x4f4a85 = _0x2c2781["name"];
      _0x1e9af0["name"] = _0x4f4a85;
      if (_0x2c2781['filename']) {
        _0x1e9af0["filename"] = _0x2c2781["filename"];
      }
      _0xb8c08f["showSuccessToast"] !== ![] && _0x148696(projectDropdownText('renamed', {
        'name': _0x4f4a85
      }));
      if (_0xb8c08f["refreshList"] !== ![]) {
        await _0x12e59b();
      }
      return {
        ..._0x2c2781,
        'name': _0x4f4a85,
        'filename': _0x2c2781["filename"] || _0x1e9af0["filename"]
      };
    }
    function _0x482d99(_0x95568, _0x1662ca) {
      _0x18119b();
      if (!_0x1662ca || _0x1662ca["parentElement"]?.['querySelector']?.('.cpd-item-rename-input')) {
        return;
      }
      const _0x3a99f7 = String(_0x95568?.["name"] || stripProjectFileExtensionFromName(_0x95568?.["filename"]) || '')["trim"]();
      const _0x11dd3d = document["createElement"]("input");
      _0x11dd3d["type"] = "text";
      _0x11dd3d["className"] = "cpd-item-rename-input";
      _0x11dd3d['value'] = _0x3a99f7;
      _0x11dd3d['setAttribute']('aria-label', projectDropdownText("renameAria", {
        'name': _0x3a99f7
      }));
      let _0x53904f = ![];
      let _0x4d820f = ![];
      const _0x1d6da2 = () => {
        _0x11dd3d["remove"]?.();
        _0x1662ca["hidden"] = ![];
      };
      const _0x4c0727 = () => {
        if (_0x4d820f) {
          return;
        }
        _0x4d820f = !![];
        _0x1d6da2();
      };
      const _0x54236b = async () => {
        if (_0x4d820f || _0x53904f) {
          return;
        }
        const _0xc4e9a = String(_0x11dd3d["value"] || '')["replace"](/\s+/g, '\x20')['trim']();
        if (!_0xc4e9a || _0xc4e9a === _0x3a99f7) {
          _0x4c0727();
          return;
        }
        _0x53904f = !![];
        _0x11dd3d['disabled'] = !![];
        try {
          await _0x6cc779(_0x95568, _0xc4e9a, {
            'refreshList': ![]
          });
          setText(_0x1662ca, _0xc4e9a);
          _0x4d820f = !![];
          _0x1d6da2();
          await _0x12e59b();
        } catch (_0x457cb3) {
          _0x53904f = ![];
          _0x11dd3d["disabled"] = ![];
          _0x148696(_0x457cb3?.["message"] || projectDropdownText("renameFailed"), "error");
          _0x11dd3d["focus"]?.();
          _0x11dd3d['select']?.();
        }
      };
      _0x11dd3d["addEventListener"]("keydown", _0xa2e45 => {
        if (_0xa2e45["key"] === "Enter") {
          _0xa2e45["preventDefault"]();
          void _0x54236b();
          return;
        }
        _0xa2e45["key"] === "Escape" && (_0xa2e45["preventDefault"](), _0x4c0727());
      });
      _0x11dd3d["addEventListener"]('blur', () => {
        void _0x54236b();
      });
      _0x1662ca["hidden"] = !![];
      _0x1662ca["parentElement"]?.["appendChild"](_0x11dd3d);
      _0x11dd3d["focus"]?.();
      _0x11dd3d["select"]?.();
    }
    function _0x6996cc() {
      return _0xe07462?.["querySelector"]?.(".cpd-item-rename-input") || null;
    }
    function _0x54a939(_0x4f1d12, _0x42ce90) {
      return !!_0x4f1d12 && (_0x42ce90 === _0x4f1d12 || _0x4f1d12["contains"]?.(_0x42ce90));
    }
    function _0x2517b9(_0x3f7356) {
      _0x3f7356["preventDefault"]?.();
      _0x3f7356["stopPropagation"]?.();
      _0x3f7356["stopImmediatePropagation"]?.();
    }
    _0xe07462?.["addEventListener"]("pointerdown", _0x533efd => {
      const _0xe0715c = _0x6996cc();
      if (!_0xe0715c || _0x54a939(_0xe0715c, _0x533efd["target"])) {
        return;
      }
      _0x1e9cb9 = !![];
      setTimeout(() => {
        _0x1e9cb9 = ![];
      }, 0x0);
      _0x2517b9(_0x533efd);
      _0xe0715c['blur']?.();
    }, !![]);
    _0xe07462?.['addEventListener']("click", _0x21b46f => {
      const _0x2e705a = _0x6996cc();
      if (_0x2e705a && _0x54a939(_0x2e705a, _0x21b46f["target"])) {
        return;
      }
      if (!_0x2e705a && !_0x1e9cb9) {
        return;
      }
      _0x1e9cb9 = ![];
      _0x2517b9(_0x21b46f);
      _0x2e705a?.["blur"]?.();
    }, !![]);
    function _0x40d5dd(_0x53259f, _0x4cfb6b, _0x5ef886) {
      _0x53259f["preventDefault"]();
      _0x53259f["stopPropagation"]();
      _0x18119b();
      _0x5e767b = showContextMenu(Number(_0x53259f["clientX"] || _0x53259f["pageX"] || 0x0), Number(_0x53259f['clientY'] || _0x53259f['pageY'] || 0x0), [{
        'label': projectDropdownText('contextMenu.rename'),
        'icon': "edit",
        'shortcutActionId': 'context-project-rename',
        'action': () => _0x482d99(_0x4cfb6b, _0x5ef886["nameEl"])
      }, {
        'label': projectDropdownText("contextMenu.delete"),
        'icon': "delete",
        'danger': !![],
        'shortcutActionId': "context-project-delete",
        'action': () => _0xd64379(_0x5ef886["item"], _0x5ef886["deleteButton"], _0x5ef886["confirmPanel"])
      }], {
        'ensureItemIcons': !![],
        'ownerElement': _0x5ef886["item"],
        'ownerRoot': _0x5ef886["item"]?.["parentElement"] || _0x5ef886["item"],
        'sidebarSubmenuOwner': "canvas-project"
      });
    }
    function _0x577dbf(_0x38dc68) {
      const _0x456913 = _0x38dc68?.['getBoundingClientRect']?.();
      if (!_0x456913) {
        return null;
      }
      const _0x187ffe = Number(_0x456913["left"] ?? 0x0);
      const _0x49932d = Number(_0x456913["top"] ?? 0x0);
      const _0x452535 = Number(_0x456913["width"]);
      const _0x481255 = Number(_0x456913['height']);
      const _0x4ba20d = Number(_0x456913["right"]);
      const _0x1d63a4 = Number(_0x456913["bottom"]);
      const _0x56743f = Number["isFinite"](_0x452535) && _0x452535 > 0x0 ? _0x452535 : Number["isFinite"](_0x4ba20d) ? _0x4ba20d - _0x187ffe : 0x0;
      const _0x21edd3 = Number['isFinite'](_0x481255) && _0x481255 > 0x0 ? _0x481255 : Number['isFinite'](_0x1d63a4) ? _0x1d63a4 - _0x49932d : 0x0;
      if (!Number['isFinite'](_0x187ffe) || !Number["isFinite"](_0x49932d) || !Number["isFinite"](_0x56743f) || !Number["isFinite"](_0x21edd3) || _0x56743f <= 0x0 || _0x21edd3 <= 0x0) {
        return null;
      }
      return {
        'left': _0x187ffe,
        'top': _0x49932d,
        'width': _0x56743f,
        'height': _0x21edd3,
        'right': _0x187ffe + _0x56743f,
        'bottom': _0x49932d + _0x21edd3
      };
    }
    function _0xfc7452(_0x399d6d) {
      if (!_0x399d6d) {
        return null;
      }
      const _0x14b3ca = Number(window["innerWidth"] || 0x0);
      const _0xd8e278 = Number(window["innerHeight"] || 0x0);
      if (_0x14b3ca <= 0x0 || _0xd8e278 <= 0x0) {
        return _0x399d6d;
      }
      const _0x342482 = Math['max'](0x0, _0x399d6d['left']);
      const _0x273a3c = Math['max'](0x0, _0x399d6d['top']);
      const _0x46a287 = Math['min'](_0x14b3ca, _0x399d6d['right']);
      const _0x28dccd = Math['min'](_0xd8e278, _0x399d6d["bottom"]);
      const _0x475103 = _0x46a287 - _0x342482;
      const _0x15b259 = _0x28dccd - _0x273a3c;
      if (_0x475103 <= 0x0 || _0x15b259 <= 0x0) {
        return _0x399d6d;
      }
      return {
        'left': _0x342482,
        'top': _0x273a3c,
        'width': _0x475103,
        'height': _0x15b259,
        'right': _0x46a287,
        'bottom': _0x28dccd
      };
    }
    function _0x247f43() {
      const _0x28762d = window["matchMedia"]?.("(prefers-reduced-motion: reduce)")?.["matches"];
      if (_0x28762d) {
        return;
      }
      const _0x20ee5a = _0x577dbf(document["getElementById"]("v2-canvas")) || _0x577dbf(document['getElementById']("v2-wrap"));
      const _0x55cf61 = _0xfc7452(_0x20ee5a);
      const _0x4f957f = _0x577dbf(_0x54449c || document["getElementById"]("btnCanvasLogo"));
      if (!_0x55cf61 || !_0x4f957f) {
        return;
      }
      const _0xf8b4a2 = _0x55cf61["width"] / _0x55cf61["height"] || 0x4 / 0x3;
      let _0x2f248a = Math["min"](_0x55cf61["width"], Math["max"](0x8c, Math["min"](0x168, _0x55cf61["width"] * 0.42)));
      let _0x56e9f2 = _0x2f248a / _0xf8b4a2;
      const _0x407472 = Math["min"](_0x55cf61["height"], Math['max'](0x60, Math["min"](0xf0, _0x55cf61["height"] * 0.42)));
      _0x56e9f2 > _0x407472 && (_0x56e9f2 = _0x407472, _0x2f248a = _0x56e9f2 * _0xf8b4a2);
      _0x2f248a = Math["max"](0x1, Math['round'](_0x2f248a));
      _0x56e9f2 = Math["max"](0x1, Math["round"](_0x56e9f2));
      const _0x39d91a = _0x55cf61["left"] + _0x55cf61['width'] / 0x2;
      const _0x4fe2df = _0x55cf61["top"] + _0x55cf61["height"] / 0x2;
      const _0x135ec0 = _0x4f957f["left"] + _0x4f957f['width'] / 0x2;
      const _0xd1b7e0 = _0x4f957f["top"] + _0x4f957f['height'] / 0x2;
      const _0x38510b = Math["round"](_0x39d91a - _0x2f248a / 0x2);
      const _0x41c00f = Math["round"](_0x4fe2df - _0x56e9f2 / 0x2);
      const _0x239102 = _0x135ec0 - _0x39d91a;
      const _0x5bfe51 = _0xd1b7e0 - _0x4fe2df;
      const _0x49f097 = document["createElement"]("div");
      _0x49f097["className"] = "v2-project-save-fly";
      _0x49f097["style"]['left'] = _0x38510b + 'px';
      _0x49f097["style"]["top"] = _0x41c00f + 'px';
      _0x49f097["style"]["width"] = _0x2f248a + 'px';
      _0x49f097["style"]["height"] = _0x56e9f2 + 'px';
      document["body"]["appendChild"](_0x49f097);
      const _0x4a7321 = (() => {
        let _0x56c930 = ![];
        return () => {
          if (_0x56c930) {
            return;
          }
          _0x56c930 = !![];
          _0x49f097['remove']?.();
          _0x54449c?.["animate"] && _0x54449c["animate"]([{
            'transform': "scale(1)",
            'filter': "brightness(1)"
          }, {
            'transform': "scale(1.08)",
            'filter': "brightness(1.2)"
          }, {
            'transform': 'scale(1)',
            'filter': "brightness(1)"
          }], {
            'duration': 0x104,
            'easing': "cubic-bezier(0.2, 0, 0, 1)"
          });
        };
      })();
      if (typeof _0x49f097['animate'] === "function") {
        const _0x4b78b6 = _0x49f097["animate"]([{
          'transform': 'translate(0,0)\x20scale(1)',
          'opacity': 0x1
        }, {
          'transform': 'translate(' + _0x239102 + "px," + _0x5bfe51 + "px) scale(0.12)",
          'opacity': 0.18
        }], {
          'duration': 0x230,
          'easing': "cubic-bezier(0.2, 0, 0, 1)"
        });
        _0x4b78b6["onfinish"] = _0x4a7321;
        _0x4b78b6["oncancel"] = _0x4a7321;
        return;
      }
      window["setTimeout"](_0x4a7321, 0x230);
    }
    async function _0xcba5ac(_0x34e076) {
      return !!(await _0x4ec9d9['appendProject'](_0x34e076, {
        'applySourceNames': !![]
      }));
    }
    async function _0x5dc2d9(_0x1e47d9) {
      return !!(await _0x4ec9d9["appendProject"](_0x1e47d9));
    }
    async function _0x351497(_0x1bb02b = '') {
      let _0x200ec2 = ![];
      try {
        _0x1bb02b && (await _0x2a5a34(projectDropdownText("readingLocalProject")), _0x200ec2 = !![]);
        const _0x1c222d = await openDesktopProject({
          'recentId': _0x1bb02b
        });
        if (!_0x1c222d || _0x1c222d["canceled"]) {
          return;
        }
        !_0x200ec2 ? (await _0x2a5a34(projectDropdownText("renderingCanvas")), _0x200ec2 = !![]) : (_0x43fee8({
          'title': projectDropdownText("loadingProjectTitle"),
          'message': projectDropdownText("renderingCanvas")
        }), await _0x3cdf1a());
        (await _0xcba5ac(_0x1c222d)) && (closeSidebarSubmenu("canvas-project"), _0x148696(projectDropdownText("opened", {
          'name': _0x1c222d["projectName"] || _0x1c222d["filename"]
        })));
      } catch (_0x386035) {
        console["error"]('[desktopProject]\x20open\x20failed:', _0x386035);
        _0x148696(_0x386035?.['message'] || projectDropdownText("openLocalFailed"), 'error');
      } finally {
        _0x42fd4c();
      }
    }
    const {
      saveProject: _0x1729bd,
      saveProjectAsLocal: _0x162477,
      saveCurrentProjectFromShortcut: _0x3d5c39
    } = createCanvasProjectSaveController({
      'windowObject': window,
      'getRoot': () => document["getElementById"]("v2-wrap"),
      'getProjectPackageExportSource': _0x430910,
      'getActiveCanvasProjectContext': _0x138309,
      'getCurrentProjectName': _0x16c016,
      'buildProjectContextFromLoadResult': buildCanvasProjectContext,
      'reconcileProjectSessionAfterSave': _0x4da778,
      'playProjectSaveAbsorb': _0x247f43,
      'fetchProjects': _0x12e59b,
      'openSaveDialog': _0x13a5dd,
      'getShortcutSaveProjectName': _0x3c6856,
      'isAutoGeneratedProjectName': _0x223cbf,
      'projectNameExistsInProjectList': _0x5b3e06,
      'showToast': _0x148696
    });
    async function _0x166ce5(_0x5d9626 = {}) {
      const _0x1e2439 = _0x146544("export-package");
      const _0x375049 = _0x17e126(_0x1e2439, {
        'title': projectDropdownText('collectingCurrentProject')
      });
      try {
        const _0x23426b = _0x430910(_0x5d9626);
        const _0x4405d9 = _0x138309();
        const _0x2e533c = await exportDesktopProjectPackage(_0x23426b["projectName"] || _0x16c016(), _0x23426b["multiData"], {
          'projectId': _0x4405d9["projectId"],
          'recentId': _0x4405d9["recentId"],
          'displayPath': _0x4405d9['displayPath'],
          'operationId': _0x1e2439
        });
        if (!_0x2e533c || _0x2e533c["canceled"]) {
          return;
        }
        if (_0x2e533c["blocked"]) {
          console['warn']("[desktopProject] export package blocked:", _0x2e533c);
          _0x148696(_0x268802(_0x2e533c), "error");
          return;
        }
        if (!_0x2e533c["success"]) {
          _0x148696(_0x2e533c["message"] || projectDropdownText("packageExport.failed"), "error");
          return;
        }
        const _0x515293 = _0x5c3fa9(_0x2e533c["warnings"]);
        if (_0x515293) {
          console["warn"]("[desktopProject] export package warnings:", _0x2e533c['warnings']);
          _0x148696(projectDropdownText('packageExport.collectedWithWarning', {
            'filename': _0x2e533c["filename"] || projectDropdownText("packageFallback"),
            'warning': _0x515293
          }), 'warn');
          return;
        }
        _0x148696(projectDropdownText("packageExport.collected", {
          'filename': _0x2e533c["filename"] || projectDropdownText('packageFallback')
        }));
      } catch (_0x5e3c32) {
        console["error"]('[desktopProject]\x20export\x20package\x20failed:', _0x5e3c32);
        _0x148696(_0x5e3c32?.["message"] || projectDropdownText("packageExport.failed"), "error");
      } finally {
        _0x375049();
        _0x42fd4c();
      }
    }
    async function _0x36961f({
      path = '',
      file = null
    } = {}) {
      const _0x5b3aa7 = _0x146544('import-package');
      const _0x4108b8 = _0x17e126(_0x5b3aa7, {
        'title': projectDropdownText("loadingProjectTitle")
      });
      try {
        (path || file) && (await _0x2a5a34(projectDropdownText("readingProjectPackage")));
        const _0x4d0e50 = await importDesktopProjectPackage({
          'path': path,
          'file': file,
          'operationId': _0x5b3aa7
        });
        if (!_0x4d0e50 || _0x4d0e50["canceled"]) {
          return _0x4d0e50;
        }
        if (_0x4d0e50["projectType"] && _0x4d0e50["projectType"] !== "canvas") {
          if (!_0x4ecc71) {
            throw new Error('当前版本无法打开此类型的项目包。');
          }
          await _0x4ecc71(_0x4d0e50);
          closeSidebarSubmenu("canvas-project");
          _0x148696('“' + (_0x4d0e50['projectName'] || '项目') + "”已导入。");
          return _0x4d0e50;
        }
        !_0xc9032a ? await _0x2a5a34(projectDropdownText("renderingProjectPackage")) : (_0x43fee8({
          'title': projectDropdownText("loadingProjectTitle"),
          'message': projectDropdownText("renderingProjectPackage")
        }), await _0x3cdf1a());
        (await _0x5dc2d9(_0x4d0e50)) && (closeSidebarSubmenu("canvas-project"), _0x148696(projectDropdownText("packageImport.loaded", {
          'name': _0x4d0e50["projectName"] || _0x4d0e50["filename"]
        })));
        return _0x4d0e50;
      } catch (_0x1e881a) {
        console['error']("[desktopProject] import package failed:", _0x1e881a);
        _0x148696(_0x1e881a?.["message"] || projectDropdownText("packageImport.failed"), "error");
        return null;
      } finally {
        _0x4108b8();
        _0x42fd4c();
      }
    }
    function _0x69adb1(_0x346912 = '') {
      return _0x36961f({
        'path': _0x346912
      });
    }
    function _0x333a1d(_0x3987ae) {
      return _0x36961f({
        'file': _0x3987ae
      });
    }
    async function _0x20fe7e(_0x6a9172) {
      if (!_0x6a9172 || typeof _0x6a9172 !== "object") {
        return;
      }
      if (_0x6a9172["success"] === ![]) {
        _0x148696(_0x6a9172["error"] || projectDropdownText('externalOpenFailed'), "error");
        return;
      }
      if (_0x6a9172["kind"] === "projectPackage") {
        await _0x69adb1(_0x6a9172["path"] || _0x6a9172["filePath"] || '');
        return;
      }
      try {
        await _0x2a5a34(projectDropdownText('renderingCanvas'));
        (await _0xcba5ac(_0x6a9172)) && (closeSidebarSubmenu('canvas-project'), _0x148696(projectDropdownText("opened", {
          'name': _0x6a9172['projectName'] || _0x6a9172['filename']
        })));
      } catch (_0x595431) {
        console["error"]("[desktopProject] external open failed:", _0x595431);
        _0x148696(_0x595431?.["message"] || projectDropdownText("externalOpenFailed"), "error");
      } finally {
        _0x42fd4c();
      }
    }
    async function _0x1f7908(_0x41031e) {
      const _0x44e62c = Array["isArray"](_0x41031e) ? _0x41031e : [];
      for (const _0x2b0050 of _0x44e62c) {
        await _0x20fe7e(_0x2b0050);
      }
    }
    async function _0x13a61b() {
      if (!desktopBridge["project"]["isAvailable"]()) {
        return;
      }
      try {
        await _0x1f7908(await desktopBridge["project"]["consumeExternalOpenRequests"]());
      } catch (_0x94ee61) {
        console["error"]('[desktopProject]\x20consume\x20external\x20open\x20failed:', _0x94ee61);
        _0x148696(_0x94ee61?.["message"] || projectDropdownText('externalOpenFailed'), "error");
      }
    }
    function _0x5d1324() {
      if (!desktopBridge['project']["isAvailable"]()) {
        return;
      }
      if (window["__aiCanvasExternalProjectOpenInstalled"]) {
        return;
      }
      window['__aiCanvasExternalProjectOpenInstalled'] = !![];
      desktopBridge["project"]["onExternalOpen"](_0x3142f2 => {
        void _0x1f7908(_0x3142f2);
      });
      void _0x13a61b();
    }
    function _0x4871d2({
      iconId: _0xf8a250,
      title: _0x2e4427,
      onClick: _0x281910
    }) {
      const _0x3bfa55 = document['createElement']("button");
      _0x3bfa55['type'] = "button";
      _0x3bfa55["className"] = "cpd-local-action-btn";
      _0x3bfa55['dataset']['tooltip'] = _0x2e4427;
      _0x3bfa55["setAttribute"]('aria-label', _0x2e4427);
      setStaticInnerHTML(_0x3bfa55, _0xf8a250);
      _0x3bfa55["addEventListener"]("click", _0x5d5133 => {
        _0x5d5133['preventDefault']();
        _0x5d5133["stopPropagation"]();
        _0x281910?.();
      });
      return _0x3bfa55;
    }
    function _0x338a8a() {
      if (!canUseDesktopProjectApi() || !_0xb03efb) {
        return;
      }
      let _0x22eb62 = _0xb03efb["querySelector"]('.cpd-local-actions');
      if (_0x22eb62) {
        return;
      }
      _0x22eb62 = document["createElement"]("div");
      _0x22eb62['className'] = "cpd-local-actions";
      _0x22eb62["appendChild"](_0x4871d2({
        'iconId': "iconFolderOpen18",
        'title': projectDropdownText("actions.openLocal"),
        'onClick': () => _0x351497()
      }));
      _0x22eb62["appendChild"](_0x4871d2({
        'iconId': 'iconSaveAs18',
        'title': projectDropdownText('actions.saveAsLocal'),
        'onClick': () => _0x162477()
      }));
      _0x22eb62["appendChild"](_0x4871d2({
        'iconId': "iconPackageExport18",
        'title': projectDropdownText('actions.collectCurrent'),
        'onClick': () => _0x166ce5()
      }));
      _0x22eb62["appendChild"](_0x4871d2({
        'iconId': "iconPackageImport18",
        'title': projectDropdownText("actions.loadPackage"),
        'onClick': () => _0x69adb1()
      }));
      const _0x68ebc0 = _0xb03efb["querySelector"](".cpd-close");
      _0xb03efb['insertBefore'](_0x22eb62, _0x68ebc0 || null);
    }
    async function _0x12e59b() {
      const _0x5e3848 = ++_0xe6d9e1;
      _0x338a8a();
      clearElement(_0xe07462);
      const _0x14be20 = document["createElement"]("div");
      _0x14be20["className"] = "cpd-loading";
      _0x14be20["setAttribute"]("role", 'status');
      _0x14be20["setAttribute"]("aria-live", "polite");
      _0x14be20["setAttribute"]("aria-busy", "true");
      const _0x29734e = document["createElement"]("span");
      _0x29734e["className"] = "project-package-loading-spinner";
      _0x29734e["setAttribute"]("aria-hidden", "true");
      const _0x3fead0 = document['createElement']('span');
      setText(_0x3fead0, projectDropdownText("loading"));
      _0x14be20["appendChild"](_0x29734e);
      _0x14be20["appendChild"](_0x3fead0);
      _0xe07462["appendChild"](_0x14be20);
      requestAnimationFrame(_0x1b98e7);
      try {
        const _0x2622a0 = await fetchV2ProjectsFromServer();
        if (_0x5e3848 !== _0xe6d9e1) {
          return;
        }
        if (!_0x2622a0["length"]) {
          clearElement(_0xe07462);
          const _0x378188 = document["createElement"]('div');
          _0x378188["className"] = "cpd-empty";
          setText(_0x378188, projectDropdownText("emptyProjects"));
          _0xe07462['appendChild'](_0x378188);
          requestAnimationFrame(_0x1b98e7);
          return;
        }
        clearElement(_0xe07462);
        _0x2622a0["forEach"](_0x29c5d4 => {
          const _0x1be03b = document['createElement']("div");
          _0x1be03b["className"] = "cpd-item";
          _0x1be03b["dataset"]["filename"] = _0x29c5d4['filename'];
          _0x1be03b['dataset']['name'] = _0x29c5d4["name"];
          const _0x592631 = document["createElement"]('div');
          _0x592631["className"] = 'cpd-item-left';
          const _0x15b04d = document["createElement"]('div');
          _0x15b04d["className"] = "cpd-item-icon";
          setStaticInnerHTML(_0x15b04d, "cpdProjectItemIcon16");
          const _0x5794ae = window["CanvasTabManager"]?.['findCanvasIdByProjectIdentity']?.({
            'filename': _0x29c5d4["filename"],
            'projectName': _0x29c5d4["name"]
          });
          const _0x3ff4ba = _0x5794ae && createCanvasProjectBadge(window["CanvasTabManager"]?.["getCanvasProjectAccess"]?.(_0x5794ae));
          if (_0x3ff4ba) {
            _0x15b04d["replaceChildren"](_0x3ff4ba);
          }
          const _0x2e49aa = document['createElement']('div');
          _0x2e49aa['className'] = 'cpd-item-info';
          const _0x4b54f2 = document['createElement']('div');
          _0x4b54f2["className"] = "cpd-item-name";
          setText(_0x4b54f2, _0x29c5d4["name"]);
          _0x2e49aa['appendChild'](_0x4b54f2);
          _0x592631["appendChild"](_0x15b04d);
          _0x592631["appendChild"](_0x2e49aa);
          const _0xb8bf47 = document["createElement"]("div");
          _0xb8bf47['className'] = "cpd-item-actions";
          _0x1be03b["appendChild"](_0x592631);
          _0x1be03b['appendChild'](_0xb8bf47);
          const _0x249d42 = document["createElement"]('div');
          _0x249d42["className"] = "cpd-item-delete";
          setStaticInnerHTML(_0x249d42, "iconTrash18");
          const _0x4203c6 = document["createElement"]("div");
          _0x4203c6["className"] = "cpd-confirm-panel";
          _0x4203c6["hidden"] = !![];
          const _0x4ffad8 = document["createElement"]("button");
          _0x4ffad8["type"] = "button";
          _0x4ffad8["className"] = "cpd-confirm-btn cpd-confirm-btn--danger";
          _0x4ffad8["textContent"] = '✔';
          _0x4ffad8["setAttribute"]("aria-label", projectDropdownText("confirm"));
          const _0xbfc951 = document['createElement']("button");
          _0xbfc951["type"] = 'button';
          _0xbfc951["className"] = "cpd-confirm-btn cpd-confirm-btn--neutral";
          _0xbfc951["textContent"] = '×';
          _0xbfc951["setAttribute"]("aria-label", projectDropdownText("cancel"));
          _0x4203c6["appendChild"](_0x4ffad8);
          _0x4203c6["appendChild"](_0xbfc951);
          _0xb8bf47['appendChild'](_0x249d42);
          _0xb8bf47["appendChild"](_0x4203c6);
          _0x592631["addEventListener"]("click", _0x2708cc => {
            _0x2708cc["stopPropagation"]();
            const _0x32b513 = _0x6996cc();
            if (_0x32b513) {
              !_0x54a939(_0x32b513, _0x2708cc['target']) && _0x32b513['blur']?.();
              return;
            }
            if (_0x1e9cb9) {
              _0x1e9cb9 = ![];
              return;
            }
            _0x33c7f2(_0x29c5d4['filename'], _0x29c5d4['name']);
          });
          _0x249d42['addEventListener']('click', _0x33527d => {
            _0x33527d['stopPropagation']();
            _0xd64379(_0x1be03b, _0x249d42, _0x4203c6);
          });
          _0xbfc951["addEventListener"]("click", _0x3876ae => {
            _0x3876ae['stopPropagation']();
            _0x4203c6["hidden"] = !![];
            _0x249d42["hidden"] = ![];
          });
          _0x4ffad8["addEventListener"]("click", async _0x8fa9d5 => {
            _0x8fa9d5["stopPropagation"]();
            _0x4ffad8['textContent'] = "...";
            const _0x307014 = await deleteV2ProjectFromServer(_0x29c5d4["filename"]);
            _0x307014 ? (await _0xac9c09["clear"](_0x29c5d4["filename"]), _0x148696(projectDropdownText("deleted")), _0x12e59b()) : (_0x148696(projectDropdownText('deleteFailed')), _0x4ffad8["textContent"] = '✔');
          });
          _0x1be03b["addEventListener"]("contextmenu", _0x3fe703 => {
            _0x40d5dd(_0x3fe703, _0x29c5d4, {
              'item': _0x1be03b,
              'nameEl': _0x4b54f2,
              'deleteButton': _0x249d42,
              'confirmPanel': _0x4203c6
            });
          });
          _0xe07462["appendChild"](_0x1be03b);
        });
        requestAnimationFrame(_0x1b98e7);
      } catch (_0x31816d) {
        if (_0x5e3848 !== _0xe6d9e1) {
          return;
        }
        clearElement(_0xe07462);
        const _0x329bd4 = document["createElement"]("div");
        _0x329bd4['className'] = "cpd-empty";
        setText(_0x329bd4, projectDropdownText("listLoadFailed"));
        _0xe07462["appendChild"](_0x329bd4);
        requestAnimationFrame(_0x1b98e7);
      }
    }
    async function _0x33c7f2(_0x426065, _0x14dfd7) {
      try {
        const _0x5bd6c5 = await _0x4ec9d9["openProject"](_0x426065, _0x14dfd7, {
          'onProgress': async _0x487b1a => {
            _0x487b1a === 'reading' ? await _0x2a5a34(projectDropdownText("readingProjectData")) : (_0x43fee8({
              'title': projectDropdownText("loadingProjectTitle"),
              'message': projectDropdownText("renderingCanvas")
            }), await _0x3cdf1a());
          }
        });
        if (!_0x5bd6c5) {
          return ![];
        }
        closeSidebarSubmenu("canvas-project");
        _0x148696(projectDropdownText("loaded", {
          'name': _0x5bd6c5['canvasName']
        }));
        return _0x5bd6c5;
      } catch (_0xa8ce64) {
        console["error"]("load project error:", _0xa8ce64);
        _0x148696(_0xa8ce64?.["message"] || projectDropdownText('loadFailed'), "error");
      } finally {
        _0x42fd4c();
      }
    }
    window['_v2SaveProject'] = _0x1729bd;
    window["_v2OpenProjectInCanvasTab"] = _0x33c7f2;
    window["_v2SaveProjectAsLocal"] = _0x162477;
    window["_v2ExportCurrentProjectPackage"] = _0x166ce5;
    window["_v2ImportProjectPackageByPath"] = _0x69adb1;
    window["_v2ImportProjectPackageFile"] = _0x333a1d;
    window['_v2LoadImportedCanvasProjectPackage'] = _0x5dc2d9;
    function _0x148696(_0x124a23, _0x3212d7 = 'ok') {
      window['showToast'](_0x124a23, _0x3212d7);
    }
    function _0x1242df() {
      if (!_0x54449c || !_0x30d0e8) {
        return;
      }
      _0x1b98e7();
      _0x30d0e8["classList"]["add"]("open");
      requestAnimationFrame(_0x1b98e7);
      _0x12e59b();
    }
    function _0x1f0510() {
      _0xe6d9e1 += 0x1;
      _0x18119b();
      _0x30d0e8['classList']["remove"]("open");
    }
    registerSidebarSubmenu({
      'key': "canvas-project",
      'button': _0x54449c,
      'panel': _0x30d0e8,
      'open': _0x1242df,
      'close': _0x1f0510,
      'isOpen': () => _0x30d0e8["classList"]['contains']("open"),
      'ignorePointerDown': _0x2269b4 => _0x246585(_0x2269b4?.["target"]),
      'openClass': "open"
    });
    _0x1d0ae2?.["addEventListener"]('click', _0x4e4b7c => {
      _0x4e4b7c['preventDefault']();
      _0x4e4b7c["stopPropagation"]();
      closeSidebarSubmenu("canvas-project");
    });
    _0x1e0cbf?.['addEventListener']("click", () => {
      closeSidebarSubmenu("canvas-project");
      window["CanvasTabManager"]?.['addCanvas']?.();
      _0x148696(projectDropdownText("newCanvasCreated"));
    });
    let _0x556f9f = null;
    let _0x4a0937 = '';
    function _0x13a5dd(_0x77d628 = {}) {
      _0x556f9f?.(![]);
      _0x556f9f = null;
      try {
        assertCanvasProjectSaveAllowed(_0x430910(_0x77d628)["multiData"], window["CanvasTabManager"]);
      } catch (_0x19cdce) {
        _0x148696(_0x19cdce["message"], "warn");
        return;
      }
      const _0x58e811 = window['CanvasTabManager']["_canvases"]["find"](_0x277b43 => _0x277b43['id'] === window["CanvasTabManager"]["_activeId"]);
      _0x4a0937 = window['CanvasTabManager']["getActiveCanvasId"]();
      _0x32a90a["value"] = String(_0x77d628["defaultName"] || _0x58e811?.['name'] || projectDropdownText("unnamedCanvas"))['trim']();
      _0x2a7912["classList"]["add"]("open");
      setTimeout(() => {
        _0x32a90a["focus"]();
        _0x32a90a['select']();
      }, 0x50);
      return new Promise(_0x13b5e8 => {
        _0x556f9f = _0x13b5e8;
      });
    }
    window["_openSaveDialog"] = _0x13a5dd;
    window["_v2SaveProjectFromShortcut"] = _0x3d5c39;
    CanvasProjectDropdownManager["renameCurrentProject"] = async _0x1d2f9c => {
      const _0x53ca8c = _0x138309();
      const _0xb73ba1 = _0x53ca8c?.['isTemporary'] !== !![] && !!(_0x53ca8c?.["filename"] || _0x53ca8c?.["projectId"]);
      const _0xfc2489 = await _0x4ec9d9['renameCurrentProject'](_0x1d2f9c);
      _0xfc2489 && _0xb73ba1 && (_0x148696(projectDropdownText("renamed", {
        'name': _0xfc2489
      })), await _0x12e59b());
      return _0xfc2489;
    };
    function _0x558a6f() {
      _0x2a7912["classList"]["remove"]("open");
      _0x556f9f?.(![]);
      _0x556f9f = null;
    }
    _0x5c1f59?.["addEventListener"]("click", _0x558a6f);
    _0x52ec92?.["addEventListener"]('click', () => {
      if (window["CanvasTabManager"]["getActiveCanvasId"]() !== _0x4a0937) {
        _0x558a6f();
        return;
      }
      const _0x2717dd = _0x32a90a['value']['trim']() || projectDropdownText("unnamedCanvas");
      const _0x142c51 = _0x556f9f;
      _0x556f9f = null;
      _0x558a6f();
      void _0x1729bd(_0x2717dd, {
        'renameActiveCanvas': !![],
        'saveAs': !![]
      })['then'](_0x9ceed0 => _0x142c51?.(_0x9ceed0 === !![]), () => _0x142c51?.(![]));
    });
    _0x32a90a?.["addEventListener"]("keydown", _0x1e5b8c => {
      _0x1e5b8c["key"] === "Enter" && (_0x1e5b8c["preventDefault"](), _0x52ec92["click"]());
      _0x1e5b8c["key"] === "Escape" && (_0x1e5b8c["preventDefault"](), _0x558a6f());
    });
    _0x5d1324();
    window["addEventListener"]("resize", () => {
      _0x30d0e8["classList"]['contains']("open") && _0x1b98e7();
    });
    window["addEventListener"](CANVAS_TOOLBAR_PLACEMENT_EVENT, () => {
      _0x30d0e8["classList"]["contains"]('open') && _0x1b98e7();
    });
  }
};
export default CanvasProjectDropdownManager;
export { CanvasProjectDropdownManager };