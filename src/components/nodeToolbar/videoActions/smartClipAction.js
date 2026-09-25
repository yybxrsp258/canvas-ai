import { t } from '../../../i18n/index.js';
function videoToolbarText(_0x404145, _0xc0e29c = {}) {
  return t("nodeToolbar.video." + _0x404145, _0xc0e29c);
}
export function bindVideoSmartClipAction(_0x298a64) {
  const {
    toolbarEl: _0x4b6b39,
    nodeData: _0x4dc649,
    store: _0x146ac0,
    findAvailablePosition: _0x1a482f,
    detectScenes: _0x226957,
    getNodeSpawnPrefs: _0x2cc966,
    buildSourceMediaNodePayload: _0x27d41b,
    getAutoMediaSizeByShortSide: _0x8e0188,
    _getLatestNodeData: _0x3e4736
  } = _0x298a64;
  const _0x31959e = _0x4b6b39["querySelector"](".act-smart-clip");
  _0x31959e && _0x31959e["addEventListener"]("click", async _0xba4421 => {
    _0xba4421["stopPropagation"]();
    const _0x46505a = _0x3e4736();
    const _0x2bf5f7 = _0x46505a["src"] || _0x46505a["videoUrl"];
    if (!_0x2bf5f7) {
      window["showToast"]?.(videoToolbarText("invalidVideoSource"), "error");
      return;
    }
    const _0x18a74b = _0x31959e["querySelector"]('svg');
    if (_0x18a74b) {
      _0x18a74b["classList"]["add"]("v2-spinning");
    }
    try {
      window["showToast"]?.(videoToolbarText("analyzingScenes"), "info");
      const _0x285fbd = await _0x226957({
        'videoUrl': _0x2bf5f7,
        'provider': "grsai",
        'sensitivity': 0.5
      });
      if (_0x285fbd["sceneCount"] <= 0x1) {
        window['showToast']?.(videoToolbarText("extractNoSegments"), 'info');
        return;
      }
      const {
        direction: _0x5db036,
        spacing: _0x2d3dc2,
        avoidOverlap: _0xc75b93
      } = _0x2cc966();
      const _0x519a0d = _0x146ac0["getState"]()["nodes"][_0x4dc649['id']];
      if (!_0x519a0d) {
        window['showToast']?.(videoToolbarText("sourceNodeMissing"), "error");
        return;
      }
      const _0x1068a4 = [];
      let _0x5f2b76 = 0x0;
      for (let _0x375e8b = 0x0; _0x375e8b < _0x285fbd["sceneCount"]; _0x375e8b++) {
        const _0x44da3e = _0x375e8b < _0x285fbd['sceneChanges']["length"] ? _0x285fbd["sceneChanges"][_0x375e8b] : 0x64;
        const _0x265ff9 = _0x5db036 === "down" ? 'down' : "right";
        const _0x1becec = Number(_0x519a0d['x']) || 0x0;
        const _0x25465f = Number(_0x519a0d['y']) || 0x0;
        const _0xd38fbc = Number(_0x519a0d["width"]) || 0x200;
        const _0x43a171 = Number(_0x519a0d["height"]) || 0x120;
        const _0x582c04 = _0x8e0188(_0xd38fbc, _0x43a171);
        const _0x1171ae = _0x1becec + _0xd38fbc + _0x2d3dc2;
        const _0x25797b = _0x265ff9 === "down" ? _0x25465f + _0x43a171 + _0x2d3dc2 * (_0x375e8b + 0x1) : _0x25465f + Math["round"]((_0x43a171 - _0x582c04['height']) / 0x2);
        const _0x2c5888 = _0xc75b93 ? _0x1a482f(_0x146ac0["getState"]()["nodes"] || {}, _0x1171ae, _0x25797b, _0x582c04["width"], _0x582c04["height"], _0x2d3dc2, _0x265ff9) : {
          'x': _0x1171ae,
          'y': _0x25797b
        };
        const _0x3be06a = "source-video-scene-" + Date['now']() + '-' + _0x375e8b + '-' + Math['random']()["toString"](0x24)["slice"](0x2, 0x6);
        _0x146ac0["addNode"](_0x27d41b({
          'id': _0x3be06a,
          'type': "source-video",
          'name': videoToolbarText("sceneNodeName", {
            'index': _0x375e8b + 0x1
          }),
          'src': _0x46505a["src"],
          'localPath': _0x46505a["localPath"],
          'clipStart': _0x5f2b76,
          'clipEnd': _0x44da3e,
          'x': _0x2c5888['x'],
          'y': _0x2c5888['y'],
          'width': _0x582c04["width"],
          'height': _0x582c04["height"],
          'needsAutoResize': ![]
        }));
        _0x1068a4["push"](_0x3be06a);
        _0x5f2b76 = _0x44da3e;
      }
      _0x1068a4["length"] > 0x0 && (_0x146ac0["setSelectedNodes"](_0x1068a4), window["showToast"]?.(videoToolbarText("sceneNodesCreated", {
        'count': _0x1068a4["length"]
      }), "success"));
    } catch (_0x3e06af) {
      console["error"]('智能剪辑失败:', _0x3e06af);
      window['showToast']?.(videoToolbarText("smartClipFailedRetry"), "error");
    } finally {
      if (_0x18a74b) {
        _0x18a74b["classList"]['remove']("v2-spinning");
      }
    }
  });
}