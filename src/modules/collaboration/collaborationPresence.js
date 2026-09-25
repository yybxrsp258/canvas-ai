import { screenToWorld, worldToScreen, projectPointToViewportEdge, spreadViewportBoundaryPoint } from '../../core/math.js';
import { loadCursorMetrics } from '../../../api/cursorAssetApi.js';
import { readOffscreenMembers, subscribeCollaborationPreferences } from './collaborationPreferences.js';
import { collaborationMemberColor } from './collaborationMemberColor.js';
import { drawCollaborationMediaStatus } from './collaborationMediaStatus.js';
import { getViewportPanPreview, VIEWPORT_PAN_PREVIEW_FRAME_EVENT } from '../../core/viewportPanPreview.js';
import { readNodeGeometryPreview, subscribeNodeGeometryPreview } from '../../core/nodeGeometryPreview.js';
import { createCollaborationGeometry } from './collaborationGeometry.js';
export function createCollaborationPresence({
  store: _0x40056c,
  getSession: _0x2a6978,
  drawComments = () => {},
  documentObject = document,
  windowObject = window
}) {
  const _0xd9cba3 = documentObject["createElement"]('div');
  _0xd9cba3["className"] = "collaboration-presence";
  _0xd9cba3["setAttribute"]("aria-label", "协作成员位置");
  documentObject["body"]["append"](_0xd9cba3);
  const _0x47c239 = new Map();
  const _0x5f3ebc = createCollaborationGeometry({
    'store': _0x40056c,
    'getSession': _0x2a6978,
    'windowObject': windowObject
  });
  const _0x16737f = new Map();
  let _0x58b16e = null;
  let _0x2fb62d = null;
  let _0xfc2731 = null;
  let _0xedb2db = ![];
  let _0x10d7f4 = '';
  let _0x3c5a93 = readOffscreenMembers();
  const _0x2656ef = () => ({
    ..._0x40056c["getStateRaw"]()['viewport'],
    ...getViewportPanPreview()
  });
  const _0x2246fb = () => {
    const _0x101a4a = documentObject['querySelector'](".v2-canvas-stage");
    return _0x101a4a?.["getBoundingClientRect"]() || {
      'left': 0x0,
      'top': 0x0,
      'width': windowObject["innerWidth"],
      'height': windowObject["innerHeight"]
    };
  };
  function _0x1b59f3() {
    const _0x4c0557 = windowObject["getComputedStyle"](documentObject["documentElement"])['getPropertyValue']("--pointer-cursor-image");
    const _0x22d7cd = _0x4c0557["match"](/url\(["']?([^"')]+)["']?\)/)?.[0x1];
    if (!_0x22d7cd || _0x10d7f4 === _0x22d7cd) {
      return;
    }
    _0x10d7f4 = _0x22d7cd;
    void loadCursorMetrics(_0x22d7cd)['then'](_0x3d698a => {
      if (_0xedb2db || _0x10d7f4 !== _0x22d7cd) {
        return;
      }
      _0xd9cba3["style"]["setProperty"]("--member-cursor-width", _0x3d698a["width"] + 'px');
      _0xd9cba3["style"]["setProperty"]("--member-cursor-height", _0x3d698a["height"] + 'px');
      _0xd9cba3["style"]["setProperty"]("--member-hotspot-x", _0x3d698a["hotspot"]['x'] + 'px');
      _0xd9cba3["style"]["setProperty"]("--member-hotspot-y", _0x3d698a["hotspot"]['y'] + 'px');
    })["catch"](() => {});
  }
  const _0x3277dc = () => {
    _0xfc2731 = null;
    clearTimeout(_0x58b16e);
    _0x58b16e = null;
    _0x5f3ebc["update"]();
    const _0x5b48d1 = _0x2a6978();
    const _0x2b26c7 = _0x5b48d1?.['state'];
    const _0x4f70ff = _0x2246fb();
    _0xd9cba3["hidden"] = !_0x2b26c7 || _0x4f70ff["width"] <= 0x0 || _0x4f70ff['height'] <= 0x0;
    let _0x4c7374 = _0x2656ef();
    if (_0x2b26c7?.["locateView"]) {
      const _0x2eb5bc = _0x2b26c7["locateView"];
      _0x2b26c7['locateView'] = null;
      _0x2b26c7["followActorId"] = '';
      const _0x506c59 = worldToScreen(_0x2eb5bc['x'], _0x2eb5bc['y'], {
        ..._0x4c7374,
        'zoom': _0x2eb5bc["zoom"]
      });
      _0x40056c["updateViewport"](_0x4c7374['x'] + _0x4f70ff["left"] + _0x4f70ff['width'] / 0x2 - _0x506c59['x'], _0x4c7374['y'] + _0x4f70ff["top"] + _0x4f70ff["height"] / 0x2 - _0x506c59['y'], _0x2eb5bc['zoom']);
      _0x4c7374 = _0x40056c["getStateRaw"]()["viewport"];
    }
    const _0x5822cb = _0x2b26c7?.["presence"]?.["find"](_0x4c30f8 => _0x4c30f8["actorId"] === _0x2b26c7['locateActorId']);
    if (_0x5822cb && Number["isFinite"](_0x5822cb['x']) && Number['isFinite'](_0x5822cb['y'])) {
      const _0x1dbec0 = worldToScreen(_0x5822cb['x'], _0x5822cb['y'], _0x4c7374);
      _0x2b26c7["locateActorId"] = '';
      _0x40056c['updateViewport'](_0x4c7374['x'] + _0x4f70ff["left"] + _0x4f70ff['width'] / 0x2 - _0x1dbec0['x'], _0x4c7374['y'] + _0x4f70ff['top'] + _0x4f70ff["height"] / 0x2 - _0x1dbec0['y'], _0x4c7374['zoom']);
      _0x4c7374 = _0x40056c["getStateRaw"]()["viewport"];
    }
    const _0x35e082 = _0x2b26c7?.['presence']?.['find'](_0x3c7228 => _0x3c7228['actorId'] === _0x2b26c7["followActorId"] && _0x3c7228['clientId'] !== _0x2b26c7["clientId"] && (!_0x3c7228['expiresAt'] || _0x3c7228["expiresAt"] * 0x3e8 > Date['now']()));
    if (_0x2b26c7?.["followActorId"] && !_0x35e082) {
      _0x5b48d1['follow']('');
    }
    if (_0x35e082?.["view"]) {
      const _0x127b43 = worldToScreen(_0x35e082['view']['x'], _0x35e082['view']['y'], {
        ..._0x4c7374,
        'zoom': _0x35e082["view"]["zoom"]
      });
      const _0x2ffdc5 = _0x4c7374['x'] + _0x4f70ff["left"] + _0x4f70ff["width"] / 0x2 - _0x127b43['x'];
      const _0x3cf7c9 = _0x4c7374['y'] + _0x4f70ff["top"] + _0x4f70ff["height"] / 0x2 - _0x127b43['y'];
      if (Math['abs'](_0x2ffdc5 - _0x4c7374['x']) > 0.1 || Math["abs"](_0x3cf7c9 - _0x4c7374['y']) > 0.1 || _0x4c7374["zoom"] !== _0x35e082['view']["zoom"]) {
        _0x40056c["updateViewport"](_0x2ffdc5, _0x3cf7c9, _0x35e082['view']['zoom']);
      }
      _0x4c7374 = _0x40056c["getStateRaw"]()["viewport"];
    }
    const _0x13f6c4 = new Set();
    const _0x7ccea3 = [];
    const _0x595dca = (_0x2c7400, _0x4342cf) => {
      _0x13f6c4["add"](_0x2c7400);
      if (!_0x47c239["has"](_0x2c7400)) {
        const _0x4b75c6 = documentObject["createElement"]("div");
        _0x4b75c6["className"] = _0x4342cf;
        if (_0x4342cf === 'collaboration-cursor') {
          const _0x54c891 = documentObject["createElement"]("span");
          _0x54c891['className'] = "collaboration-cursor-shape";
          const _0x2ff9d1 = documentObject["createElement"]("span");
          _0x2ff9d1["className"] = "collaboration-direction-arrow";
          const _0x5d072e = documentObject["createElement"]('span');
          _0x5d072e['className'] = "collaboration-cursor-name";
          _0x4b75c6["append"](_0x54c891, _0x2ff9d1, _0x5d072e);
          _0x4b75c6["addEventListener"]("click", () => _0x2a6978()?.["locate"](_0x4b75c6["dataset"]["actorId"]));
          _0x4b75c6["addEventListener"]("keydown", _0x258e08 => {
            (_0x258e08["key"] === "Enter" || _0x258e08["key"] === '\x20') && (_0x258e08["preventDefault"](), _0x2a6978()?.["locate"](_0x4b75c6['dataset']["actorId"]));
          });
        }
        _0xd9cba3["append"](_0x4b75c6);
        _0x47c239["set"](_0x2c7400, _0x4b75c6);
      }
      return _0x47c239["get"](_0x2c7400);
    };
    for (const _0xb7e3e4 of _0x2b26c7?.["presence"] || []) {
      if (_0xb7e3e4["clientId"] === _0x2b26c7['clientId']) {
        continue;
      }
      if (_0xb7e3e4["expiresAt"] && _0xb7e3e4['expiresAt'] * 0x3e8 < Date["now"]()) {
        continue;
      }
      const _0x28ba44 = collaborationMemberColor(_0x2b26c7["members"]?.["find"](_0x50cff4 => _0x50cff4['id'] === _0xb7e3e4['actorId']) || {
        'id': _0xb7e3e4["actorId"]
      });
      const _0x543316 = Object['keys'](_0x2b26c7["locks"] || {})["filter"](_0xbbe556 => _0x2b26c7['locks'][_0xbbe556]["clientId"] === _0xb7e3e4["clientId"] && _0x2b26c7["locks"][_0xbbe556]['expiresAt'] * 0x3e8 > Date["now"]());
      for (const _0x29ff5e of new Set([...(_0xb7e3e4["selected"] || []), ..._0x543316])) {
        const _0x20de92 = readNodeGeometryPreview(_0x29ff5e, _0x40056c["getStateRaw"]()["nodes"][_0x29ff5e]);
        if (!_0x20de92 || !_0x20de92["width"] || !_0x20de92['height']) {
          continue;
        }
        const _0x2fe934 = _0x595dca(_0xb7e3e4["clientId"] + ':' + _0x29ff5e, "collaboration-selection");
        const _0x515d5a = worldToScreen(_0x20de92['x'], _0x20de92['y'], _0x4c7374);
        _0x2fe934['style']['transform'] = "translate(" + _0x515d5a['x'] + 'px,\x20' + _0x515d5a['y'] + "px)";
        _0x2fe934["style"]["width"] = _0x20de92["width"] * _0x4c7374['zoom'] + 'px';
        _0x2fe934["style"]["height"] = _0x20de92["height"] * _0x4c7374["zoom"] + 'px';
        _0x2fe934["dataset"]["member"] = _0x543316['includes'](_0x29ff5e) ? _0xb7e3e4['name'] + " · 正在编辑" : _0xb7e3e4["name"];
        _0x2fe934["dataset"]["nodeId"] = _0x29ff5e;
        _0x2fe934["style"]["setProperty"]('--member-color', _0x28ba44);
      }
      if (_0xb7e3e4['x'] == null || _0xb7e3e4['y'] == null) {
        continue;
      }
      const _0x55a02d = _0x595dca(_0xb7e3e4["clientId"], "collaboration-cursor");
      const _0x1621cb = worldToScreen(_0xb7e3e4['x'], _0xb7e3e4['y'], _0x4c7374);
      const _0x49244b = projectPointToViewportEdge(_0x1621cb, _0x4f70ff);
      const _0x5b260f = _0x49244b['outside'] ? spreadViewportBoundaryPoint(_0x49244b, _0x4f70ff, _0x7ccea3) : _0x1621cb;
      _0x55a02d["style"]["transform"] = "translate(" + _0x5b260f['x'] + "px, " + _0x5b260f['y'] + "px)";
      _0x55a02d["style"]['setProperty']("--member-color", _0x28ba44);
      _0x55a02d["style"]['setProperty']("--member-direction", _0x49244b["angle"] + "deg");
      _0x55a02d["classList"]['toggle']("is-offscreen", _0x49244b['outside']);
      _0x55a02d["classList"]["toggle"]("is-right", _0x5b260f['x'] > _0x4f70ff["left"] + _0x4f70ff["width"] / 0x2);
      _0x55a02d["classList"]["toggle"]("is-bottom", _0x5b260f['y'] > _0x4f70ff["top"] + _0x4f70ff["height"] - 0x3c);
      const _0x4e180a = _0x55a02d["querySelector"]('.collaboration-cursor-name');
      if (_0x4e180a["textContent"] !== _0xb7e3e4['name']) {
        _0x4e180a['textContent'] = _0xb7e3e4["name"];
      }
      _0x55a02d["dataset"]['member'] = _0xb7e3e4["name"];
      _0x55a02d["dataset"]["actorId"] = _0xb7e3e4["actorId"];
      _0x55a02d["setAttribute"]("role", "button");
      _0x55a02d["tabIndex"] = _0x49244b['outside'] && _0x3c5a93 ? 0x0 : -0x1;
      _0x55a02d["setAttribute"]("aria-label", '定位\x20' + _0xb7e3e4["name"]);
      _0x55a02d["hidden"] = _0x49244b["outside"] && !_0x3c5a93;
    }
    const _0x13f6ec = new Set(_0x2b26c7?.["editingPending"] || []);
    for (const _0x3130e2 of _0x16737f['keys']()) {
      if (!_0x13f6ec["has"](_0x3130e2)) {
        _0x16737f["delete"](_0x3130e2);
      }
    }
    for (const _0x19fcd4 of _0x13f6ec) {
      if (!_0x16737f["has"](_0x19fcd4)) {
        _0x16737f["set"](_0x19fcd4, Date['now']());
      }
      if (Date["now"]() - _0x16737f["get"](_0x19fcd4) < 0xc8) {
        continue;
      }
      const _0x25fa39 = readNodeGeometryPreview(_0x19fcd4, _0x40056c['getStateRaw']()["nodes"][_0x19fcd4]);
      if (_0x25fa39 !== _0x40056c["getStateRaw"]()["nodes"][_0x19fcd4]) {
        continue;
      }
      if (!_0x25fa39) {
        continue;
      }
      const _0x5013d2 = _0x595dca('editing:' + _0x19fcd4, "collaboration-media-status collaboration-feedback is-pending");
      const _0x4001a5 = worldToScreen(_0x25fa39['x'], _0x25fa39['y'], _0x4c7374);
      _0x5013d2['style']["transform"] = "translate(" + _0x4001a5['x'] + "px, " + _0x4001a5['y'] + "px)";
      _0x5013d2["textContent"] = "正在获取编辑权限…";
      _0x5013d2['setAttribute']("role", 'status');
    }
    drawCollaborationMediaStatus({
      'state': _0x2b26c7,
      'nodes': _0x40056c["getStateRaw"]()["nodes"],
      'viewport': _0x4c7374,
      'bounds': _0x4f70ff,
      'entryFor': _0x595dca,
      'getSession': _0x2a6978,
      'documentObject': documentObject
    });
    drawComments({
      'state': _0x2b26c7,
      'nodes': _0x40056c["getStateRaw"]()["nodes"],
      'selected': _0x40056c["getStateRaw"]()['selectedNodeIds'],
      'viewport': _0x4c7374,
      'bounds': _0x4f70ff,
      'entryFor': _0x595dca
    });
    for (const [_0xca62f0, _0x4f82c7] of _0x47c239) {
      !_0x13f6c4["has"](_0xca62f0) && (_0x4f82c7["remove"](), _0x47c239['delete'](_0xca62f0));
    }
    if (_0x13f6ec["size"] || _0x5f3ebc["active"]()) {
      _0x58b16e = setTimeout(() => {
        if (!_0xedb2db && !_0xfc2731) {
          _0xfc2731 = windowObject["requestAnimationFrame"](_0x3277dc);
        }
      }, 0xc8);
    }
  };
  const _0x548ebe = () => {
    if (_0xedb2db) {
      return;
    }
    const _0x1e672b = _0x2656ef();
    const _0xd47504 = _0x2246fb();
    _0x2a6978()?.['setPresence']({
      ...(_0x2fb62d ? screenToWorld(_0x2fb62d['x'], _0x2fb62d['y'], _0x1e672b) : {}),
      'view': {
        ...screenToWorld(_0xd47504["left"] + _0xd47504["width"] / 0x2, _0xd47504['top'] + _0xd47504["height"] / 0x2, _0x1e672b),
        'zoom': _0x1e672b['zoom']
      },
      'selected': [...(_0x40056c["getStateRaw"]()["selectedNodeIds"] || [])]
    });
    if (!_0xfc2731) {
      _0xfc2731 = windowObject["requestAnimationFrame"](_0x3277dc);
    }
  };
  const _0x202c7f = subscribeCollaborationPreferences(_0x137877 => {
    _0x3c5a93 = _0x137877;
    _0x548ebe();
  });
  const _0x54cfb5 = subscribeNodeGeometryPreview(() => {
    if (!_0xedb2db && !_0xfc2731) {
      _0xfc2731 = windowObject["requestAnimationFrame"](_0x3277dc);
    }
  });
  const _0xf04d77 = new windowObject["MutationObserver"](_0x1b59f3);
  _0xf04d77["observe"](documentObject["documentElement"], {
    'attributes': !![],
    'attributeFilter': ["style", "class"]
  });
  _0x1b59f3();
  windowObject['addEventListener']("resize", _0x548ebe);
  windowObject["addEventListener"](VIEWPORT_PAN_PREVIEW_FRAME_EVENT, _0x548ebe);
  const _0x3aeebe = _0x94df87 => {
    if (!_0x94df87['target']["closest"]?.(".v2-canvas-stage")) {
      return;
    }
    _0x2fb62d = {
      'x': _0x94df87["clientX"],
      'y': _0x94df87["clientY"]
    };
    _0x2a6978()?.["setPresence"](screenToWorld(_0x2fb62d['x'], _0x2fb62d['y'], _0x2656ef()));
  };
  documentObject["addEventListener"]("pointermove", _0x3aeebe, {
    'passive': !![]
  });
  const _0x352715 = _0x573ac1 => {
    if (_0x573ac1['type'] === "keydown" && ["Shift", "Control", "Alt", "Meta"]["includes"](_0x573ac1["key"])) {
      return;
    }
    const _0xe775e5 = _0x573ac1["target"]["closest"]?.(".v2-canvas-stage, [data-node-id]") || _0x573ac1["type"] === "keydown" && _0x573ac1["target"] === documentObject['body'];
    if (_0xe775e5 && _0x2a6978()?.["state"]["followActorId"]) {
      _0x2a6978()["follow"]('');
    }
  };
  const _0x55c0df = ["pointerdown", 'wheel', 'keydown'];
  for (const _0x19c148 of _0x55c0df) {
    documentObject['addEventListener'](_0x19c148, _0x352715, {
      'capture': !![],
      'passive': !![]
    });
  }
  const _0x4463e3 = _0x40056c["subscribeSelector"](_0x428892 => [_0x428892["_nodesRev"], _0x428892['viewport']['x'], _0x428892["viewport"]['y'], _0x428892["viewport"]["zoom"], _0x428892["viewport"]["_screenOriginX"], _0x428892['viewport']["_screenOriginY"], ...(_0x428892['selectedNodeIds'] || [])]["join"](':'), _0x548ebe);
  return {
    'redraw': _0x548ebe,
    'destroy'() {
      _0xedb2db = !![];
      clearTimeout(_0x58b16e);
      _0x5f3ebc["clear"]();
      _0x4463e3();
      _0x202c7f();
      _0x54cfb5();
      _0xf04d77["disconnect"]();
      windowObject["removeEventListener"]('resize', _0x548ebe);
      windowObject["removeEventListener"](VIEWPORT_PAN_PREVIEW_FRAME_EVENT, _0x548ebe);
      documentObject['removeEventListener']("pointermove", _0x3aeebe);
      for (const _0x8138b5 of _0x55c0df) {
        documentObject['removeEventListener'](_0x8138b5, _0x352715, !![]);
      }
      if (_0xfc2731) {
        windowObject["cancelAnimationFrame"](_0xfc2731);
      }
      _0xd9cba3["remove"]();
    }
  };
}