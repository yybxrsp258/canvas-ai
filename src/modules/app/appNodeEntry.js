import { openDebugRequestWindow } from '../debugRequestWindow.js';
import { getViewportScreenCenter, screenToWorld } from '../../core/math.js';
import { createPanorama360NodeData, createPanoramaSceneNodeData } from '../panoramaSceneNode/sceneNode.js';
import { createStoryboardScriptNodeData } from '../../core/storyboardScriptFactory.js';
import { createEmptyCollageNodeData } from '../collage/collageFactory.js';
import { createWhiteboardNodeData } from '../whiteboard/whiteboardNodeData.js';
import { t } from '../../i18n/index.js';
import { isNodeCreationTypeEnabled } from '../nodeCreationMenuCatalog.js';
import { normalizeCanvasToolbarPlacement } from '../canvasToolbarPlacement.js';
const DEV_ONLY_NODE_TYPES = new Set();
export function createSpecialNodeDataByType({
  type: _0xe6ed80,
  id: _0x2b4dab,
  x: _0x4b8079,
  y: _0x52a463,
  width: _0x101741,
  height: _0x52a589,
  name: _0x147bde
}) {
  if (_0xe6ed80 === 'panorama-scene') {
    return createPanoramaSceneNodeData({
      'id': _0x2b4dab,
      'x': _0x4b8079,
      'y': _0x52a463,
      'width': _0x101741,
      'height': _0x52a589,
      'name': _0x147bde
    });
  }
  if (_0xe6ed80 === 'panorama-360') {
    return createPanorama360NodeData({
      'id': _0x2b4dab,
      'x': _0x4b8079,
      'y': _0x52a463,
      'width': _0x101741,
      'height': _0x52a589,
      'name': _0x147bde
    });
  }
  if (_0xe6ed80 === "storyboard-script") {
    return createStoryboardScriptNodeData({
      'id': _0x2b4dab,
      'x': _0x4b8079,
      'y': _0x52a463,
      'width': _0x101741,
      'height': _0x52a589,
      'name': _0x147bde
    });
  }
  if (_0xe6ed80 === "collage") {
    return createEmptyCollageNodeData({
      'id': _0x2b4dab,
      'x': _0x4b8079,
      'y': _0x52a463,
      'width': _0x101741,
      'height': _0x52a589,
      'name': _0x147bde || t("nodeCreation.items.collage.defaultName")
    });
  }
  if (_0xe6ed80 === "whiteboard") {
    return createWhiteboardNodeData({
      'id': _0x2b4dab,
      'x': _0x4b8079,
      'y': _0x52a463,
      'width': _0x101741,
      'height': _0x52a589,
      'name': _0x147bde || '白板'
    });
  }
  if (_0xe6ed80 === 'web-preview') {
    return {
      'id': _0x2b4dab,
      'type': _0xe6ed80,
      'x': _0x4b8079,
      'y': _0x52a463,
      'width': _0x101741,
      'height': _0x52a589,
      'name': _0x147bde || t("nodeCreation.items.webPreview.defaultName")
    };
  }
  return null;
}
function isDevModeOn() {
  return window["DEV_MODE"] === !![] || document["body"]["classList"]["contains"]("dev-mode");
}
function isDevOnlyNodeType(_0x5692ee) {
  return DEV_ONLY_NODE_TYPES["has"](String(_0x5692ee || ''));
}
function resolveNodeSize(_0x3b0d3f, _0x16a342, {
  forDrop = ![]
} = {}) {
  let {
    width: _0x17f8c1,
    height: _0xa93c0d
  } = _0x16a342(_0x3b0d3f);
  forDrop && _0x3b0d3f === "test-video" && (_0x17f8c1 = 0x12c, _0xa93c0d = 0x12c);
  forDrop && _0x3b0d3f === 'scene-detection' && (_0x17f8c1 = 0x190, _0xa93c0d = 0x1f4);
  return {
    'width': _0x17f8c1,
    'height': _0xa93c0d
  };
}
export function initAppNodeEntry({
  graphStore: _0x46e815,
  wrap: _0x51d739,
  btnAddEl: _0x1d3198,
  nodeMenuEl: _0x50184e,
  initCanvasContextMenu: _0x2dacde,
  getNodeDefaultSize: _0x491185,
  executeCommand: _0x59d9a9,
  getCanvasToolbarPlacement: _0x316f0d
} = {}) {
  const _0x344d06 = () => {
    const _0x5c251d = isDevModeOn();
    document["querySelectorAll"](".nam-item[data-type]")["forEach"](_0x1b40cf => {
      const _0x1ffb50 = isDevOnlyNodeType(_0x1b40cf["dataset"]['type']);
      const _0x52fe24 = !isNodeCreationTypeEnabled(_0x1b40cf["dataset"]["type"]) || _0x1ffb50 && !_0x5c251d;
      _0x1b40cf['hidden'] = _0x52fe24;
      _0x1b40cf['setAttribute']("aria-hidden", _0x52fe24 ? 'true' : "false");
    });
  };
  const _0x110926 = (_0x1a3dcf, _0x118b1f, _0x5acc80, _0x43fd37 = {}) => {
    if (_0x1a3dcf === "debug") {
      return openDebugRequestWindow({
        'outputText': "点击生成按钮旁的调试按钮，查看当前请求参数。"
      });
    }
    if (typeof _0x59d9a9 !== "function") {
      throw new Error("appNodeEntry requires executeCommand for canvas mutations.");
    }
    const {
      width: _0x22bc5d,
      height: _0x2c3df1
    } = resolveNodeSize(_0x1a3dcf, _0x491185, _0x43fd37);
    _0x59d9a9("create_node", {
      'type': _0x1a3dcf,
      'x': _0x118b1f - _0x22bc5d / 0x2,
      'y': _0x5acc80 - _0x2c3df1 / 0x2,
      'width': _0x22bc5d,
      'height': _0x2c3df1,
      'name': _0x1a3dcf === "media-clip" ? t("nodeCreation.items.mediaClip.defaultName") : ''
    });
  };
  const _0x5b21a3 = _0x5264da => {
    const {
      viewport: _0x2bebe7
    } = _0x46e815["getState"]();
    const _0x1f5b13 = getViewportScreenCenter(_0x2bebe7, window["innerWidth"], window["innerHeight"]);
    const _0x236f0d = screenToWorld(_0x1f5b13['x'], _0x1f5b13['y'], _0x2bebe7);
    _0x110926(_0x5264da, _0x236f0d['x'], _0x236f0d['y']);
  };
  if (_0x1d3198) {
    let _0x353f9a = null;
    let _0x370242 = '';
    let _0x5dba0e = null;
    const _0x59d153 = () => {
      clearTimeout(_0x353f9a);
      _0x353f9a = null;
    };
    const _0x1b00c7 = () => {
      _0x59d153();
      _0x370242 = '';
      _0x5dba0e && (document["removeEventListener"]("pointerdown", _0x5dba0e, !![]), _0x5dba0e = null);
      document["querySelector"]('#v2PickerOverlay')?.['remove']();
    };
    const _0x1d1dcd = () => {
      if (_0x370242 === "pinned") {
        return;
      }
      _0x59d153();
      _0x353f9a = setTimeout(_0x1b00c7, 0xc8);
    };
    const _0x264ce9 = _0xc908c9 => {
      const _0x519a2b = document["querySelector"]?.("#v2PickerOverlay .v2-node-picker");
      if (!_0x519a2b?.['getBoundingClientRect']) {
        return;
      }
      const _0x5c34f4 = document["querySelector"]?.(".header")?.["getBoundingClientRect"]?.()["bottom"] || 0x0;
      const _0x5e61c4 = Math["max"](0xc, _0x5c34f4 + 0xc);
      const _0x522462 = 0xc;
      const _0x291e09 = Math["max"](0xb4, _0xc908c9["top"] - _0x522462 - _0x5e61c4);
      _0x519a2b["style"]['maxHeight'] = _0x291e09 + 'px';
      _0x519a2b["style"]["transformOrigin"] = "bottom left";
      const _0x4dbc20 = _0x519a2b['getBoundingClientRect']();
      const _0x3cf83a = Number(_0x519a2b["offsetHeight"]) || _0x4dbc20['height'];
      const _0x5b51e3 = Math["max"](0xc, window["innerWidth"] - _0x4dbc20["width"] - 0xc);
      _0x519a2b["style"]['left'] = Math["min"](Math["max"](_0xc908c9["left"], 0xc), _0x5b51e3) + 'px';
      _0x519a2b["style"]["top"] = Math["max"](_0x5e61c4, _0xc908c9['top'] - _0x522462 - _0x3cf83a) + 'px';
    };
    const _0x56f838 = _0x4026f0 => {
      const _0xf01046 = document["querySelector"]?.("#v2PickerOverlay .v2-node-picker");
      if (!_0xf01046?.["getBoundingClientRect"]) {
        return;
      }
      const _0x132771 = 0xc;
      const _0x2ebdd2 = _0xf01046["getBoundingClientRect"]();
      const _0x144061 = Number(_0xf01046["offsetWidth"]) || _0x2ebdd2["width"];
      if (!(_0x144061 > 0x0)) {
        return;
      }
      _0xf01046["style"]["left"] = Math["max"](0xc, _0x4026f0["left"] - _0x132771 - _0x144061) + 'px';
      _0xf01046["style"]["transformOrigin"] = 'top\x20right';
    };
    const _0xc5324e = _0x5b39c0 => {
      const _0x4e629b = document["querySelector"]("#v2PickerOverlay");
      if (!_0x4e629b) {
        return;
      }
      _0x59d153();
      _0x370242 = _0x5b39c0;
      _0x4e629b['style']["pointerEvents"] = 'none';
      const _0x12e151 = _0x4e629b["querySelector"](".v2-node-picker");
      _0x12e151 && (_0x12e151["style"]["pointerEvents"] = "auto", _0x12e151["addEventListener"]("mouseenter", _0x59d153), _0x12e151['addEventListener']("mouseleave", _0x1d1dcd));
      _0x5dba0e && document["removeEventListener"]("pointerdown", _0x5dba0e, !![]);
      _0x5dba0e = _0x47e2ce => {
        if (_0x12e151?.["contains"](_0x47e2ce["target"]) || _0x1d3198['contains'](_0x47e2ce["target"])) {
          _0x59d153();
          return;
        }
        _0x1b00c7();
      };
      const _0x490c0e = _0x5dba0e;
      requestAnimationFrame(() => _0x5dba0e === _0x490c0e && _0x490c0e && document["addEventListener"]("pointerdown", _0x490c0e, !![]));
    };
    const _0x3e6006 = _0x6cce14 => {
      _0x59d153();
      _0x370242 = _0x6cce14;
      const _0x4c6376 = _0x1d3198["getBoundingClientRect"]();
      const _0x3210d4 = normalizeCanvasToolbarPlacement(_0x316f0d?.());
      let _0x18f6b6 = _0x4c6376['right'] + 0xc;
      if (_0x3210d4 === "bottom") {
        _0x18f6b6 = _0x4c6376["left"];
      } else {
        if (_0x3210d4 === "right") {
          _0x18f6b6 = _0x4c6376["left"] - 0xc;
        }
      }
      _0x2dacde["_showPicker"]?.(_0x18f6b6, _0x4c6376["top"], !![]);
      if (_0x3210d4 === 'bottom') {
        _0x264ce9(_0x4c6376);
      } else {
        _0x3210d4 === 'right' && _0x56f838(_0x4c6376);
      }
      document["querySelector"]('#v2PickerOverlay')?.["classList"]["add"]("is-sidebar-picker");
      requestAnimationFrame(() => _0xc5324e(_0x6cce14));
    };
    _0x1d3198["addEventListener"]("click", _0x2d979f => {
      _0x2d979f["preventDefault"]();
      _0x2d979f["stopPropagation"]();
      _0x3e6006("pinned");
    });
    _0x1d3198["addEventListener"]("mouseenter", () => {
      _0x59d153();
      if (document["querySelector"]("#v2PickerOverlay")) {
        return;
      }
      _0x3e6006("hover");
    });
    _0x1d3198["addEventListener"]("mouseleave", _0x1d1dcd);
  }
  document["addEventListener"]("click", _0x22211f => {
    _0x50184e && _0x50184e["style"]["display"] !== 'none' && !_0x22211f['target']["closest"]('#nodeMenu') && !_0x22211f["target"]["closest"]("#btnAdd") && (_0x50184e['style']['display'] = "none");
  });
  _0x344d06();
  if (document["body"]) {
    const _0xa24cd3 = new MutationObserver(() => {
      _0x344d06();
    });
    _0xa24cd3["observe"](document['body'], {
      'attributes': !![],
      'attributeFilter': ["class"]
    });
  }
  document["querySelectorAll"](".nam-item")["forEach"](_0x3ef7e5 => {
    _0x3ef7e5["setAttribute"]("draggable", isNodeCreationTypeEnabled(_0x3ef7e5["dataset"]["type"]) ? "true" : "false");
    _0x3ef7e5["addEventListener"]("dragstart", _0x29379a => {
      const _0x5ee1da = _0x29379a['currentTarget']["dataset"]["type"];
      if (!isNodeCreationTypeEnabled(_0x5ee1da)) {
        _0x29379a["preventDefault"]();
        return;
      }
      if (isDevOnlyNodeType(_0x5ee1da) && !isDevModeOn()) {
        _0x29379a["preventDefault"]();
        return;
      }
      _0x29379a["dataTransfer"]["setData"]("application/v2-node-type", _0x5ee1da);
      _0x29379a["dataTransfer"]["effectAllowed"] = "copy";
    });
    _0x3ef7e5["addEventListener"]("click", _0x4413b9 => {
      _0x4413b9["stopPropagation"]();
      const _0x178701 = _0x3ef7e5["dataset"]["type"];
      if (!_0x178701 || _0x178701 === "resource") {
        return;
      }
      if (!isNodeCreationTypeEnabled(_0x178701)) {
        return;
      }
      if (isDevOnlyNodeType(_0x178701) && !isDevModeOn()) {
        return;
      }
      _0x5b21a3(_0x178701);
      if (_0x50184e) {
        _0x50184e["style"]['display'] = "none";
      }
    });
  });
  _0x51d739["addEventListener"]('dragover', _0x3c04aa => {
    _0x3c04aa["dataTransfer"]["types"]["includes"]("application/v2-node-type") && (_0x3c04aa["preventDefault"](), _0x3c04aa["dataTransfer"]["dropEffect"] = "copy");
  });
  _0x51d739["addEventListener"]("drop", _0x37e835 => {
    const _0x43e44d = _0x37e835["dataTransfer"]["getData"]('application/v2-node-type');
    if (!_0x43e44d) {
      return;
    }
    if (!isNodeCreationTypeEnabled(_0x43e44d)) {
      return;
    }
    if (isDevOnlyNodeType(_0x43e44d) && !isDevModeOn()) {
      return;
    }
    _0x37e835["preventDefault"]();
    const {
      viewport: _0x8ab841
    } = _0x46e815["getState"]();
    const _0x3b18d1 = screenToWorld(_0x37e835['clientX'], _0x37e835["clientY"], _0x8ab841);
    _0x110926(_0x43e44d, _0x3b18d1['x'], _0x3b18d1['y'], {
      'forDrop': !![]
    });
  });
}