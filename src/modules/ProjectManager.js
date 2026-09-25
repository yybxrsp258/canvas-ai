import { generateId } from '../core/math.js';
import * as a1303_0x3d792c from './project.js';
import { getProjects as a1303_0x5c2361, createProject as a1303_0x11bd29, deleteProject as a1303_0x3493ea } from '../../api/legacyProjectsApi.js';
import { getLocale, t } from '../i18n/index.js';
function projectManagerText(_0x56972a, _0x120939 = {}) {
  return t('projectManager.' + _0x56972a, _0x120939);
}
const projectGallery = document['getElementById']("projectGallery");
const projectGrid = document['getElementById']("projectGrid");
const ProjectManager = {
  'setProjectOperations'(_0x356161) {
    this["_projectOperations"] = _0x356161;
  },
  async 'getProjects'() {
    return await a1303_0x5c2361();
  },
  async 'createProject'(_0x3ef422) {
    if (!_0x3ef422) {
      const _0x45e0bb = new Date();
      _0x3ef422 = projectManagerText("defaultProjectName", {
        'date': _0x45e0bb["toLocaleString"](getLocale())
      });
    }
    const _0x2feefe = generateId('proj');
    return await a1303_0x11bd29(_0x2feefe, _0x3ef422);
  },
  async 'loadProject'(_0x210100, _0x11d5fe) {
    try {
      if (!this['_projectOperations']) {
        throw new Error('Canvas\x20project\x20operations\x20are\x20unavailable');
      }
      const _0x3be205 = await this["_projectOperations"]["openProject"](_0x210100, _0x11d5fe);
      if (!_0x3be205) {
        return ![];
      }
      if (projectGallery) {
        projectGallery["classList"]["add"]("hidden");
      }
      document["body"]["classList"]["remove"]("in-gallery");
      localStorage["setItem"]("tapnow_last_project_v2", _0x210100);
      return !![];
    } catch (_0x549a65) {
      console["error"]('Failed\x20to\x20load\x20project:', _0x549a65);
      alert(projectManagerText("loadFailed"));
    }
  },
  async 'saveCurrentProject'() {
    if (window["CanvasTabManager"]) {
      const _0xcc482f = window["CanvasTabManager"];
      const _0x2c7db4 = _0xcc482f['getActiveCanvasId']?.() || _0xcc482f["_activeId"] || '';
      const _0x5a25cd = _0xcc482f["getCanvasProjectContext"]?.(_0x2c7db4) || {
        'projectId': window["currentProjectId"] || '',
        'projectName': window['currentProjectId'] || ''
      };
      if (!_0x2c7db4 || !_0x5a25cd["projectId"]) {
        return;
      }
      const _0x1df928 = _0xcc482f['getMultiDataSnapshot']({
        'sanitizeForPersistence': !![]
      });
      const _0x3ef7d5 = _0x1df928['canvases']?.["find"](_0x1c488d => _0x1c488d?.['id'] === _0x2c7db4);
      if (!_0x3ef7d5) {
        return;
      }
      const _0x49ccb3 = {
        'canvases': [_0x3ef7d5],
        'activeCanvasId': _0x2c7db4
      };
      const _0x128eaf = _0xcc482f['captureCanvasSaveCheckpoint']?.(_0x2c7db4);
      const _0x19674b = await a1303_0x3d792c["saveProject"](_0x5a25cd['projectId'], _0x49ccb3);
      _0x19674b?.["success"] && (_0xcc482f['setCanvasProjectContext']?.(_0x2c7db4, {
        ..._0x5a25cd,
        'projectId': _0x19674b["projectId"] || String(_0x19674b['filename'] || _0x5a25cd['projectId'])["replace"](/\.(?:aicanvas|aicproj|json)$/i, ''),
        'filename': _0x19674b['filename'] || _0x5a25cd["filename"] || '',
        'isTemporary': ![]
      }), _0xcc482f["markCanvasClean"]?.(_0x2c7db4, {
        'checkpoint': _0x128eaf
      }));
    }
  },
  'showConfirm'(_0x136da9, _0x3fe1dc, _0x11979d) {
    const _0x5829f5 = document['createElement']("div");
    _0x5829f5["className"] = "custom-confirm-overlay";
    const _0xe41efb = document["createElement"]("div");
    _0xe41efb["className"] = 'custom-confirm-box';
    const _0x485207 = document['createElement']("div");
    _0x485207['className'] = "confirm-title";
    _0x485207["textContent"] = _0x136da9;
    const _0x2627e9 = document["createElement"]("div");
    _0x2627e9["className"] = "confirm-msg";
    _0x2627e9["textContent"] = _0x3fe1dc;
    const _0x3a9f26 = document["createElement"]('div');
    _0x3a9f26["className"] = "confirm-btns";
    const _0xd2906a = document["createElement"]('button');
    _0xd2906a["type"] = "button";
    _0xd2906a["className"] = "confirm-btn confirm-cancel";
    _0xd2906a["textContent"] = projectManagerText('confirm.cancel');
    const _0x21ba22 = document["createElement"]('button');
    _0x21ba22["type"] = "button";
    _0x21ba22['className'] = 'confirm-btn\x20confirm-ok';
    _0x21ba22['textContent'] = projectManagerText('confirm.deleteConfirm');
    _0x3a9f26['appendChild'](_0xd2906a);
    _0x3a9f26["appendChild"](_0x21ba22);
    _0xe41efb["appendChild"](_0x485207);
    _0xe41efb['appendChild'](_0x2627e9);
    _0xe41efb["appendChild"](_0x3a9f26);
    _0x5829f5["appendChild"](_0xe41efb);
    document['body']["appendChild"](_0x5829f5);
    const _0x2c7ebe = () => _0x5829f5["remove"]();
    _0xd2906a["onclick"] = _0x2c7ebe;
    _0x21ba22['onclick'] = () => {
      _0x11979d();
      _0x2c7ebe();
    };
    _0x5829f5["onclick"] = _0x1a7244 => {
      if (_0x1a7244['target'] === _0x5829f5) {
        _0x2c7ebe();
      }
    };
  },
  async 'deleteProject'(_0x377954) {
    this["showConfirm"](projectManagerText("deleteConfirm.title"), projectManagerText('deleteConfirm.message'), async () => {
      try {
        await a1303_0x3493ea(_0x377954);
        window["currentProjectId"] === _0x377954 ? this["showGallery"]() : this["renderGallery"]();
      } catch (_0x3ee7bf) {
        console["error"]("Failed to delete project:", _0x3ee7bf);
      }
    });
  },
  'showGallery'() {
    window["currentProjectId"] = null;
    if (projectGallery) {
      projectGallery["classList"]['remove']("hidden");
    }
    document["body"]["classList"]["add"]("in-gallery");
    this["renderGallery"]();
  },
  async 'renderGallery'() {
    if (!projectGrid) {
      return;
    }
    const _0x3c5ab5 = await this['getProjects']();
    projectGrid['replaceChildren']();
    const _0x81603f = document["createElement"]("div");
    _0x81603f["className"] = "project-card new-project-card";
    const _0x14b3be = 'http://www.w3.org/2000/svg';
    const _0x1f253f = document["createElement"]("div");
    _0x1f253f["className"] = 'pc-preview\x20new-project-preview';
    const _0x259bcc = document["createElementNS"](_0x14b3be, "svg");
    _0x259bcc["setAttribute"]("width", '32');
    _0x259bcc['setAttribute']("height", '32');
    _0x259bcc["setAttribute"]("viewBox", "0 0 24 24");
    _0x259bcc["setAttribute"]('fill', "none");
    _0x259bcc["setAttribute"]('stroke', "currentColor");
    _0x259bcc["setAttribute"]("stroke-width", "1.5");
    const _0x2a3212 = document["createElementNS"](_0x14b3be, "line");
    _0x2a3212['setAttribute']('x1', '12');
    _0x2a3212["setAttribute"]('y1', '5');
    _0x2a3212["setAttribute"]('x2', '12');
    _0x2a3212['setAttribute']('y2', '19');
    const _0x239490 = document["createElementNS"](_0x14b3be, "line");
    _0x239490["setAttribute"]('x1', '5');
    _0x239490["setAttribute"]('y1', '12');
    _0x239490["setAttribute"]('x2', '19');
    _0x239490["setAttribute"]('y2', '12');
    _0x259bcc["appendChild"](_0x2a3212);
    _0x259bcc["appendChild"](_0x239490);
    _0x1f253f["appendChild"](_0x259bcc);
    const _0x22436e = document['createElement']('div');
    _0x22436e["className"] = "pc-info";
    const _0x18ddd1 = document["createElement"]("div");
    _0x18ddd1['className'] = "pc-title";
    _0x18ddd1["textContent"] = projectManagerText("newProject");
    _0x22436e["appendChild"](_0x18ddd1);
    _0x81603f["appendChild"](_0x1f253f);
    _0x81603f["appendChild"](_0x22436e);
    window["showGlobalLoading"] = function (_0x442ede = projectManagerText("loading"), _0x5e8ff6 = {}) {
      let _0x12054c = document["getElementById"]("v2-global-loading");
      if (!_0x12054c) {
        _0x12054c = document["createElement"]("div");
        _0x12054c['id'] = "v2-global-loading";
        _0x12054c["className"] = "project-global-loading";
        const _0x333944 = document["createElementNS"](_0x14b3be, 'svg');
        _0x333944["setAttribute"]("width", '18');
        _0x333944["setAttribute"]('height', '18');
        _0x333944["setAttribute"]("viewBox", "0 0 24 24");
        _0x333944["setAttribute"]("fill", "none");
        _0x333944['setAttribute']("stroke", "currentColor");
        _0x333944["setAttribute"]("stroke-width", '2');
        _0x333944["classList"]["add"]("spin");
        const _0x312bfe = document["createElementNS"](_0x14b3be, "path");
        _0x312bfe["setAttribute"]('d', "M21 12a9 9 0 1 1-6.219-8.56");
        _0x333944["appendChild"](_0x312bfe);
        const _0x5744d9 = document["createElement"]("div");
        _0x5744d9["className"] = "v2-global-loading-body";
        const _0x5b3c61 = document["createElement"]('span');
        _0x5b3c61["className"] = "v2-global-loading-label";
        const _0xee5ed8 = document["createElement"]("progress");
        _0xee5ed8["className"] = "v2-global-loading-progress";
        _0xee5ed8['max'] = 0x1;
        _0xee5ed8["value"] = 0x0;
        _0xee5ed8['hidden'] = !![];
        _0x12054c["appendChild"](_0x333944);
        _0x5744d9['appendChild'](_0x5b3c61);
        _0x5744d9["appendChild"](_0xee5ed8);
        _0x12054c["appendChild"](_0x5744d9);
        document["body"]['appendChild'](_0x12054c);
      }
      const _0xab2f61 = _0x12054c["querySelector"](".v2-global-loading-label");
      const _0x203f3e = _0x12054c["querySelector"](".v2-global-loading-progress");
      if (_0xab2f61) {
        _0xab2f61['textContent'] = _0x442ede;
      }
      const _0x561f94 = Number(_0x5e8ff6?.["progress"]);
      const _0x37249f = Number['isFinite'](_0x561f94) && _0x561f94 >= 0x0;
      if (_0x203f3e) {
        _0x203f3e["hidden"] = !_0x37249f;
        if (_0x37249f) {
          _0x203f3e["value"] = Math["max"](0x0, Math["min"](0x1, _0x561f94));
        }
      }
      void _0x12054c["offsetWidth"];
      _0x12054c["classList"]["add"]("is-visible");
    };
    window["updateGlobalLoading"] = function (_0x478cf1 = {}) {
      const _0x101e91 = document["getElementById"]('v2-global-loading');
      if (!_0x101e91) {
        return;
      }
      const _0x3072f7 = typeof _0x478cf1 === "string" ? {
        'text': _0x478cf1
      } : _0x478cf1 || {};
      const _0x50bbc1 = _0x101e91['querySelector']('.v2-global-loading-label');
      const _0xcaca20 = _0x101e91['querySelector'](".v2-global-loading-progress");
      const _0x409cbd = String(_0x3072f7["text"] || _0x3072f7['message'] || '')["trim"]();
      if (_0x409cbd && _0x50bbc1) {
        _0x50bbc1["textContent"] = _0x409cbd;
      }
      const _0x331547 = Number(_0x3072f7["progress"]);
      const _0x3380fe = Number["isFinite"](_0x331547) && _0x331547 >= 0x0;
      if (_0xcaca20) {
        _0xcaca20["hidden"] = !_0x3380fe;
        if (_0x3380fe) {
          _0xcaca20["value"] = Math["max"](0x0, Math["min"](0x1, _0x331547));
        }
      }
    };
    window['hideGlobalLoading'] = function () {
      const _0x2da4e0 = document["getElementById"]("v2-global-loading");
      _0x2da4e0 && (_0x2da4e0["classList"]["remove"]("is-visible"), setTimeout(() => _0x2da4e0["remove"](), 0xfa));
    };
    _0x81603f['onclick'] = async () => {
      const _0x43df20 = await this["createProject"]();
      _0x43df20 && (await this["loadProject"](_0x43df20));
    };
    projectGrid['appendChild'](_0x81603f);
    _0x3c5ab5['sort']((_0x5f2bbd, _0x564c6a) => _0x564c6a['lastModified'] - _0x5f2bbd["lastModified"])["forEach"](_0x3bb140 => {
      const _0x19e59f = document["createElement"]("div");
      _0x19e59f['className'] = "project-card";
      const _0x38d0bb = new Date(_0x3bb140["lastModified"])['toLocaleString'](getLocale(), {
        'month': 'numeric',
        'day': "numeric",
        'hour': "2-digit",
        'minute': "2-digit"
      });
      const _0x1d9e47 = document["createElement"]("div");
      _0x1d9e47["className"] = 'pc-preview';
      if (_0x3bb140["thumbnail"] && _0x3bb140["thumbnail"]["type"] === 'image' && _0x3bb140["thumbnail"]['data']) {
        const _0x4724f0 = document["createElement"]('img');
        _0x4724f0["src"] = _0x3bb140["thumbnail"]["data"];
        _0x1d9e47["appendChild"](_0x4724f0);
      } else {
        if (_0x3bb140["thumbnail"] && _0x3bb140['thumbnail']["type"] === "text" && _0x3bb140["thumbnail"]['data']) {
          const _0x5678a8 = document["createElement"]('div');
          _0x5678a8["className"] = 'pc-text-snippet';
          _0x5678a8["textContent"] = _0x3bb140['thumbnail']["data"];
          _0x1d9e47["appendChild"](_0x5678a8);
        } else {
          const _0x3fe092 = document["createElement"]("div");
          _0x3fe092["className"] = 'pc-logo';
          _0x3fe092["textContent"] = 'Canvas\x20AI';
          _0x1d9e47['appendChild'](_0x3fe092);
        }
      }
      const _0x178498 = document["createElement"]("div");
      _0x178498["className"] = "pc-info";
      const _0x2fcc31 = document['createElement']("div");
      _0x2fcc31['className'] = 'pc-title';
      _0x2fcc31["textContent"] = _0x3bb140["name"];
      const _0x549320 = document["createElement"]("div");
      _0x549320["className"] = 'pc-meta';
      const _0x212257 = document["createElement"]('span');
      _0x212257["className"] = "pc-time";
      _0x212257["textContent"] = _0x38d0bb;
      const _0x333fad = document['createElement']('span');
      _0x333fad['className'] = "pc-delete";
      _0x333fad["dataset"]['id'] = _0x3bb140['id'];
      _0x333fad['textContent'] = projectManagerText('delete');
      _0x549320['appendChild'](_0x212257);
      _0x549320["appendChild"](_0x333fad);
      _0x178498['appendChild'](_0x2fcc31);
      _0x178498["appendChild"](_0x549320);
      _0x19e59f["appendChild"](_0x1d9e47);
      _0x19e59f["appendChild"](_0x178498);
      _0x19e59f['onclick'] = async _0x55296f => {
        const _0x1be357 = _0x55296f['target']["closest"]('.pc-delete');
        if (_0x1be357) {
          _0x55296f["stopPropagation"]();
          await this["deleteProject"](_0x3bb140['id']);
          return;
        }
        await this["loadProject"](_0x3bb140['id'], _0x3bb140['name']);
      };
      projectGrid["appendChild"](_0x19e59f);
    });
  }
};
export default ProjectManager;
export { ProjectManager };