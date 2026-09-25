import { STORYBOARD_3D_ACTIONS } from './characterRig.js';
import { DIRECTOR_CAMERA_MOTIONS, applyDirectorCameraMotion, applyDirectorObjectPath } from './directorAuthoring.js';
import { normalizeStoryboard3DShotAnimation, upsertStoryboard3DCameraKeyframe } from './shotAnimation.js';
import { DIRECTOR_CAMERA_PRESETS, createDirectorCameraPreset } from './directorCameraPresets.js';
import { renderDirectorFollowPanel, changeDirectorFollow, clickDirectorFollow } from './directorFollowPanel.js';
import { DirectorCharacterPanel } from './directorCharacterPanel.js';
import { DirectorScenePanel } from './directorScenePanel.js';
import { DirectorDeliveryPanel } from './directorDeliveryPanel.js';
import { DirectorGenerationPanel } from './directorGenerationPanel.js';
import { DirectorMobileCamera } from './directorMobileCamera.js';
const escapeHtml = _0x2d2e98 => String(_0x2d2e98 ?? '')["replaceAll"]('&', "&amp;")["replaceAll"]('\x22', "&quot;")["replaceAll"]('<', "&lt;")["replaceAll"]('>', "&gt;");
const options = (_0x5f5a42, _0xe3d5b1) => _0x5f5a42["map"](([_0x4121f6, _0x46ece8]) => '<option\x20value=\x22' + escapeHtml(_0x4121f6) + '\x22\x20' + (_0x4121f6 === _0xe3d5b1 ? "selected" : '') + '>' + escapeHtml(_0x46ece8) + '</option>')["join"]('');
const input = (_0x58c092, _0x595ae9, _0x4fe1e5, _0x59236c = '') => "<label>" + _0x58c092 + "<input type=\"number\" step=\"0.1\" value=\"" + _0x4fe1e5 + "\" data-director-field=\"" + _0x595ae9 + '\x22\x20' + _0x59236c + "></label>";
export class DirectorTimelinePanel {
  constructor(_0x20b95a) {
    this["timeline"] = _0x20b95a;
    this["characters"] = new DirectorCharacterPanel(this);
    this["scenePanel"] = new DirectorScenePanel(this);
    this["delivery"] = new DirectorDeliveryPanel(this);
    this["generation"] = new DirectorGenerationPanel(this);
    this["mobile"] = new DirectorMobileCamera(this);
    this['open'] = ![];
    this['drafts'] = new Map();
  }
  ["draft"](_0x3e85f2, _0x1c149e) {
    const _0x4a9515 = _0x3e85f2['id'] + ':' + (_0x1c149e?.['id'] || "camera");
    if (!this["drafts"]["has"](_0x4a9515)) {
      this['drafts']["set"](_0x4a9515, {
        'preset': "push",
        'cameraPreset': "front-medium",
        'duration': 0x3,
        'amount': 0x3,
        'append': ![],
        'start': 0x0,
        'actionId': "walking-left",
        'speed': 0x1,
        'orient': !![],
        'points': [],
        'span': 0xc,
        'pathDuration': 0x3
      });
    }
    return this["drafts"]['get'](_0x4a9515);
  }
  ["context"]() {
    const _0x9beec3 = this['timeline']["_context"]();
    const _0x407b91 = _0x9beec3["scene"]?.['objects']["find"](_0x33e4ee => _0x33e4ee['id'] === _0x9beec3["editorState"]["selectedObjectIds"]?.['at'](-0x1));
    return {
      ..._0x9beec3,
      'object': _0x407b91 && !["group", "camera", "light"]['includes'](_0x407b91['type']) ? _0x407b91 : null
    };
  }
  ['render']() {
    if (!this['open']) {
      return '';
    }
    const {
      scene: _0x59f238,
      shot: _0x548eeb,
      object: _0x4b82a5
    } = this["context"]();
    if (!_0x548eeb) {
      return '';
    }
    const _0x470fc9 = this["draft"](_0x548eeb, _0x4b82a5);
    const _0x3d1d77 = normalizeStoryboard3DShotAnimation(_0x548eeb["animation"]);
    const _0x54e20a = _0x3d1d77['cameraConstraint'];
    const _0x51a197 = [['', '无'], ..._0x59f238['objects']['filter'](_0x36d7d6 => !["camera", 'group', "light"]["includes"](_0x36d7d6["type"]))["map"](_0x267242 => [_0x267242['id'], _0x267242["name"]])];
    const _0x243647 = _0x4b82a5?.["transform"]['position'] || [0x0, 0x0, 0x0];
    const _0x23980d = _0x470fc9["points"]["map"](_0x368b45 => 0x32 + (_0x368b45[0x0] - _0x243647[0x0]) / _0x470fc9["span"] * 0x64 + ',' + (0x32 + (_0x368b45[0x2] - _0x243647[0x2]) / _0x470fc9["span"] * 0x64));
    const _0x27acab = _0x3d1d77["actionClips"]["filter"](_0x650e01 => _0x650e01['objectId'] === _0x4b82a5?.['id']);
    return '<div\x20class=\x22storyboard-3d-director-panel\x22\x20data-director-panel>\x0a\x20\x20\x20\x20\x20\x20' + this["timeline"]['cameraPath']['render'](_0x3d1d77) + "\n      " + this['characters']["render"]() + "\n      " + this["scenePanel"]["render"]() + "\n      " + this["delivery"]['render']() + '\x0a\x20\x20\x20\x20\x20\x20' + this['generation']["render"]() + "\n      " + this["mobile"]["render"]() + "\n      <fieldset><legend>摄像机运镜</legend><div class=\"storyboard-3d-director-fields\">\n        <label>机位<select data-director-field=\"cameraPreset\">" + options(DIRECTOR_CAMERA_PRESETS['map'](_0x3b2f48 => [_0x3b2f48['id'], _0x3b2f48["name"]]), _0x470fc9["cameraPreset"]) + "</select></label><button type=\"button\" data-storyboard-3d-action=\"timeline-director-camera-preset\">应用到当前帧</button>\n      </div><div class=\"storyboard-3d-director-fields\">\n        <label>预设<select data-director-field=\"preset\">" + options(DIRECTOR_CAMERA_MOTIONS, _0x470fc9["preset"]) + '</select></label>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + input("时长 / 秒", "duration", _0x470fc9["duration"], "min=\"0.1\" max=\"3600\"") + input("移动距离 / 米", "amount", _0x470fc9["amount"], 'min=\x220.1\x22\x20max=\x22100\x22') + "\n        <label><input type=\"checkbox\" data-director-field=\"append\" " + (_0x470fc9['append'] ? 'checked' : '') + ">追加到末尾</label>\n        <button type=\"button\" data-storyboard-3d-action=\"timeline-director-motion\">应用运镜</button>\n      </div><div class=\"storyboard-3d-director-fields\">\n        <label>跟随目标<select data-director-constraint=\"followObjectId\">" + options(_0x51a197, _0x54e20a["followObjectId"]) + "</select></label>\n        <label>注视目标<select data-director-constraint=\"lookAtObjectId\">" + options(_0x51a197, _0x54e20a['lookAtObjectId']) + "</select></label>\n        <label><input type=\"checkbox\" data-director-constraint=\"followHeading\" " + (_0x54e20a["followHeading"] ? 'checked' : '') + ">跟随朝向</label>\n        <label>注视高度 / 米<input type=\"number\" step=\"0.1\" value=\"" + _0x54e20a["lookAtOffset"][0x1] + '\x22\x20data-director-constraint=\x22lookAtHeight\x22></label>\x0a\x20\x20\x20\x20\x20\x20</div>' + renderDirectorFollowPanel(_0x3d1d77, _0x51a197) + "</fieldset>\n      <fieldset><legend>" + escapeHtml(_0x4b82a5?.["name"] || "选择角色或物体后编排走位与动作") + "</legend>\n        <div class=\"storyboard-3d-director-fields\">" + input('开始\x20/\x20秒', "start", _0x470fc9["start"], "min=\"0\" max=\"3599.9\"") + input("走位 / 动作时长", "pathDuration", _0x470fc9['pathDuration'], "min=\"0.1\" max=\"3600\"") + "\n          " + input("地图范围 / 米", 'span', _0x470fc9["span"], "min=\"2\" max=\"200\"") + "\n          <label><input type=\"checkbox\" data-director-field=\"orient\" " + (_0x470fc9["orient"] ? "checked" : '') + '>朝向路径</label>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22storyboard-3d-director-path-row\x22><button\x20type=\x22button\x22\x20class=\x22storyboard-3d-director-path-map\x22\x20data-storyboard-3d-action=\x22timeline-director-point\x22\x20aria-label=\x22俯视走位图，点击添加路径点\x22\x20' + (_0x4b82a5 ? '' : "disabled") + ">\n          <svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><path d=\"M50 0V100 M0 50H100\"/><polyline points=\"" + _0x23980d['join']('\x20') + "\"/>" + _0x23980d["map"]((_0xbb730f, _0x219531) => '<circle\x20cx=\x22' + _0xbb730f["split"](',')[0x0] + "\" cy=\"" + _0xbb730f["split"](',')[0x1] + '\x22\x20r=\x221.8\x22/><text\x20x=\x22' + (Number(_0xbb730f["split"](',')[0x0]) + 0x2) + "\" y=\"" + (Number(_0xbb730f["split"](',')[0x1]) - 0x2) + '\x22>' + (_0x219531 + 0x1) + "</text>")["join"]('') + '<text\x20x=\x2252\x22\x20y=\x228\x22>−Z</text><text\x20x=\x2289\x22\x20y=\x2248\x22>+X</text></svg>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</button><div\x20class=\x22storyboard-3d-director-path-points\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x470fc9["points"]["map"]((_0x372ba1, _0x5f153e) => "<div><b>" + (_0x5f153e + 0x1) + "</b>" + _0x372ba1["map"]((_0x2af823, _0x662cf) => '<input\x20aria-label=\x22路径点\x20' + (_0x5f153e + 0x1) + '\x20' + ['X', 'Y', 'Z'][_0x662cf] + '\x22\x20type=\x22number\x22\x20step=\x220.1\x22\x20value=\x22' + _0x2af823["toFixed"](0x2) + '\x22\x20data-director-point=\x22' + _0x5f153e + "\" data-axis=\"" + _0x662cf + '\x22>')["join"]('') + "<button type=\"button\" data-storyboard-3d-action=\"timeline-director-remove-point\" data-index=\"" + _0x5f153e + "\" aria-label=\"删除路径点 " + (_0x5f153e + 0x1) + "\">×</button></div>")["join"]('') || "点击俯视图设置走位；首点自动使用物体当前位置。") + "\n        </div></div><div class=\"storyboard-3d-director-fields\"><button type=\"button\" data-storyboard-3d-action=\"timeline-director-path\" " + (_0x4b82a5 && _0x470fc9["points"]["length"] > 0x1 ? '' : "disabled") + ">生成走位关键帧</button><button type=\"button\" data-storyboard-3d-action=\"timeline-director-clear-path\">清空路径草稿</button></div>\n        " + (_0x4b82a5?.['type'] === 'character' ? '<div\x20class=\x22storyboard-3d-director-fields\x22><label>动作<select\x20data-director-field=\x22actionId\x22>' + options(STORYBOARD_3D_ACTIONS["map"](_0x5b1f9a => [_0x5b1f9a['id'], _0x5b1f9a["name"]]), _0x470fc9['actionId']) + '</select></label>' + input('播放倍速', "speed", _0x470fc9["speed"], "min=\"0.1\" max=\"4\"") + '<button\x20type=\x22button\x22\x20data-storyboard-3d-action=\x22timeline-director-add-clip\x22>添加动作片段</button></div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22storyboard-3d-director-clips\x22>' + _0x27acab["map"](_0x394ab4 => '<div\x20data-director-clip=\x22' + escapeHtml(_0x394ab4['id']) + '\x22><strong>' + escapeHtml(STORYBOARD_3D_ACTIONS["find"](_0x3a39e7 => _0x3a39e7['id'] === _0x394ab4["actionId"])?.['name']) + "</strong>" + ["start", "end", "speed"]["map"](_0x4c6232 => "<label>" + {
      'start': '开始',
      'end': '结束',
      'speed': '倍速'
    }[_0x4c6232] + "<input type=\"number\" step=\"0.1\" value=\"" + _0x394ab4[_0x4c6232] + "\" data-director-clip-field=\"" + _0x4c6232 + "\"></label>")["join"]('') + "<button type=\"button\" data-storyboard-3d-action=\"timeline-director-copy-clip\" data-clip-id=\"" + escapeHtml(_0x394ab4['id']) + "\">复制到末尾</button><button type=\"button\" data-storyboard-3d-action=\"timeline-director-delete-clip\" data-clip-id=\"" + escapeHtml(_0x394ab4['id']) + "\">删除</button></div>")['join']('') + "</div>" : '') + "\n      </fieldset>\n    </div>";
  }
  ["mutate"](_0x210edc, _0x46bf85) {
    this["timeline"]["stopPlayback"]({
      'render': ![]
    });
    this['timeline']["_mutateAnimation"]("director-motion", _0x210edc, _0x46bf85);
    const {
      shot: _0x46b03f
    } = this["context"]();
    if (_0x46b03f) {
      this['timeline']["_sampleAt"](this["timeline"]["_timeForShot"](_0x46b03f));
    }
  }
  ['handleClick'](_0x862d5d, _0xded2d9, _0x1f673f) {
    if (this["mobile"]["click"](_0x862d5d)) {
      return !![];
    }
    if (this["generation"]['click'](_0x862d5d, _0xded2d9)) {
      return !![];
    }
    if (this["delivery"]["click"](_0x862d5d, _0xded2d9)) {
      return !![];
    }
    if (this["scenePanel"]["click"](_0x862d5d, _0xded2d9)) {
      return !![];
    }
    if (this['characters']["click"](_0x862d5d)) {
      return !![];
    }
    if (clickDirectorFollow(this, _0x862d5d, _0xded2d9)) {
      return !![];
    }
    if (this['timeline']['cameraPath']["handleClick"](_0x862d5d)) {
      return !![];
    }
    if (!_0x862d5d["startsWith"]("timeline-director-")) {
      return ![];
    }
    if (_0x862d5d === "timeline-director-toggle") {
      this['open'] = !this["open"];
      !this['open'] && (this["timeline"]["cameraPath"]["stop"](), this['mobile']['disconnect']({
        'render': ![]
      }));
      if (this["open"]) {
        this["timeline"]["expandDirectorPanel"]?.();
      }
      this["timeline"]["requestRender"]?.();
      return !![];
    }
    const {
      scene: _0x17b872,
      shot: _0x1e45de,
      object: _0x36bcef
    } = this["context"]();
    if (!_0x1e45de || _0xded2d9["disabled"]) {
      return !![];
    }
    const _0x2cb43e = this['draft'](_0x1e45de, _0x36bcef);
    try {
      switch (_0x862d5d) {
        case "timeline-director-camera-preset":
          this["mutate"]("应用机位预设", _0x3b17f6 => upsertStoryboard3DCameraKeyframe(_0x3b17f6, {
            'time': this["timeline"]["_timeForShot"](_0x1e45de),
            'camera': createDirectorCameraPreset(_0x17b872, {
              'preset': _0x2cb43e["cameraPreset"],
              'objectId': _0x36bcef?.['id'],
              'camera': _0x1e45de["camera"]
            })
          }));
          break;
        case 'timeline-director-motion':
          this['mutate']("应用摄像机运镜", _0x164603 => applyDirectorCameraMotion(_0x164603, {
            ..._0x2cb43e,
            'camera': _0x164603["cameraConstraint"]['followObjectId'] ? _0x1e45de["camera"] : this["timeline"]["readCurrentCamera"]?.() || _0x1e45de["camera"]
          }));
          break;
        case "timeline-director-point":
          {
            if (!_0x36bcef || !_0x1f673f || _0x2cb43e["points"]['length'] >= 0x64) {
              break;
            }
            const _0x411708 = _0xded2d9["getBoundingClientRect"]();
            if (!_0x2cb43e["points"]["length"]) {
              _0x2cb43e['points']["push"]([..._0x36bcef["transform"]["position"]]);
            }
            const _0x182a32 = _0x36bcef["transform"]["position"];
            _0x2cb43e['points']["push"]([_0x182a32[0x0] + ((_0x1f673f["clientX"] - _0x411708["left"]) / _0x411708["width"] - 0.5) * _0x2cb43e['span'], _0x182a32[0x1], _0x182a32[0x2] + ((_0x1f673f["clientY"] - _0x411708['top']) / _0x411708["height"] - 0.5) * _0x2cb43e["span"]]);
            break;
          }
        case "timeline-director-remove-point":
          _0x2cb43e['points']["splice"](Number(_0xded2d9['dataset']['index']), 0x1);
          break;
        case "timeline-director-clear-path":
          _0x2cb43e['points'] = [];
          break;
        case "timeline-director-path":
          this["mutate"]("生成物体走位", _0x61e21a => applyDirectorObjectPath(_0x61e21a, {
            ..._0x2cb43e,
            'duration': _0x2cb43e['pathDuration'],
            'object': _0x36bcef
          }));
          break;
        case "timeline-director-add-clip":
          if (_0x36bcef?.["type"] !== "character") {
            break;
          }
          this["mutate"]("添加角色动作片段", _0x26bd37 => normalizeStoryboard3DShotAnimation({
            ..._0x26bd37,
            'actionClips': [..._0x26bd37["actionClips"], {
              'id': "clip-" + globalThis['crypto']['randomUUID'](),
              'objectId': _0x36bcef['id'],
              'actionId': _0x2cb43e["actionId"],
              'start': _0x2cb43e['start'],
              'end': _0x2cb43e['start'] + _0x2cb43e["pathDuration"],
              'speed': _0x2cb43e['speed']
            }]
          }));
          break;
        case "timeline-director-delete-clip":
          this["mutate"]("删除动作片段", _0x1ce52e => ({
            ..._0x1ce52e,
            'actionClips': _0x1ce52e["actionClips"]["filter"](_0x291cb4 => _0x291cb4['id'] !== _0xded2d9['dataset']["clipId"])
          }));
          break;
        case "timeline-director-copy-clip":
          this["mutate"]('复制动作片段', _0x4faa3f => {
            const _0x5f238d = _0x4faa3f['actionClips']['find'](_0xb75a4f => _0xb75a4f['id'] === _0xded2d9["dataset"]['clipId']);
            if (!_0x5f238d) {
              return _0x4faa3f;
            }
            const _0x12f32d = Math['max'](..._0x4faa3f["actionClips"]['filter'](_0x74db8c => _0x74db8c['objectId'] === _0x5f238d["objectId"])["map"](_0x5a9e92 => _0x5a9e92["end"]));
            if (_0x12f32d + _0x5f238d["end"] - _0x5f238d['start'] > 0xe10) {
              throw new Error('动作片段超过时长上限。');
            }
            return normalizeStoryboard3DShotAnimation({
              ..._0x4faa3f,
              'actionClips': [..._0x4faa3f['actionClips'], {
                ..._0x5f238d,
                'id': "clip-" + globalThis["crypto"]["randomUUID"](),
                'start': _0x12f32d,
                'end': _0x12f32d + _0x5f238d["end"] - _0x5f238d['start']
              }]
            });
          });
          break;
      }
      this["timeline"]["requestRender"]?.();
    } catch (_0x57d088) {
      this["timeline"]["setMessage"]?.(_0x57d088["message"]);
    }
    return !![];
  }
  ["handleChange"](_0x28cef9) {
    if (this['generation']["change"](_0x28cef9)) {
      return !![];
    }
    if (this["delivery"]["change"](_0x28cef9)) {
      return !![];
    }
    if (this["scenePanel"]["change"](_0x28cef9)) {
      return !![];
    }
    if (this["characters"]['change'](_0x28cef9)) {
      return !![];
    }
    if (changeDirectorFollow(this, _0x28cef9)) {
      return !![];
    }
    if (this["timeline"]['cameraPath']["handleChange"](_0x28cef9)) {
      return !![];
    }
    const _0x7f44db = _0x28cef9["target"];
    const {
      shot: _0x1b57aa,
      object: _0x15b8f7
    } = this["context"]();
    if (!_0x1b57aa) {
      return ![];
    }
    const _0x50af3e = this["draft"](_0x1b57aa, _0x15b8f7);
    if (_0x7f44db['matches']?.('[data-director-field]')) {
      const _0x5469a = _0x7f44db['dataset']["directorField"];
      _0x50af3e[_0x5469a] = _0x7f44db["type"] === "checkbox" ? _0x7f44db["checked"] : _0x7f44db["type"] === 'number' ? Number(_0x7f44db["value"]) : _0x7f44db["value"];
      if (_0x5469a === 'span') {
        _0x50af3e['span'] = Math["max"](0x2, Math["min"](0xc8, Number(_0x50af3e["span"]) || 0xc));
      }
      if (_0x5469a === "span") {
        this["refreshMap"]();
      }
      return !![];
    }
    if (_0x7f44db["matches"]?.("[data-director-point]")) {
      const _0x42131e = _0x50af3e['points'][Number(_0x7f44db['dataset']["directorPoint"])];
      const _0x4f09cd = Number(_0x7f44db['value']);
      if (_0x42131e && Number['isFinite'](_0x4f09cd)) {
        _0x42131e[Number(_0x7f44db["dataset"]["axis"])] = _0x4f09cd;
      }
      this["refreshMap"]();
      return !![];
    }
    if (_0x7f44db["matches"]?.("[data-director-constraint]")) {
      const _0x586ef3 = _0x7f44db['dataset']["directorConstraint"];
      this["mutate"]('修改摄像机跟随与注视', _0x51ed16 => {
        if (_0x586ef3 === "lookAtHeight") {
          _0x51ed16['cameraConstraint']["lookAtOffset"][0x1] = Number(_0x7f44db["value"]) || 0x0;
        } else {
          _0x51ed16["cameraConstraint"][_0x586ef3] = _0x7f44db["type"] === "checkbox" ? _0x7f44db["checked"] : _0x7f44db['value'];
        }
        return normalizeStoryboard3DShotAnimation(_0x51ed16);
      });
      return !![];
    }
    if (_0x7f44db["matches"]?.("[data-director-clip-field]")) {
      const _0x1370aa = _0x7f44db["closest"]("[data-director-clip]")?.["dataset"]["directorClip"];
      if (_0x1b57aa["animation"]["actionClips"]["find"](_0x46a7f1 => _0x46a7f1['id'] === _0x1370aa)?.[_0x7f44db["dataset"]["directorClipField"]] === Number(_0x7f44db["value"])) {
        return !![];
      }
      this['mutate']("调整动作片段", _0x3685a0 => {
        const _0x27e3c2 = _0x3685a0['actionClips']["find"](_0x55c07c => _0x55c07c['id'] === _0x1370aa);
        if (_0x27e3c2) {
          _0x27e3c2[_0x7f44db['dataset']["directorClipField"]] = Number(_0x7f44db["value"]);
        }
        return normalizeStoryboard3DShotAnimation(_0x3685a0);
      });
      return !![];
    }
    return ![];
  }
  ["refreshMap"]() {
    const _0x420c20 = this["timeline"]["getRoot"]?.()?.["querySelector"](".storyboard-3d-director-path-map svg");
    if (!_0x420c20) {
      return;
    }
    const _0x62c3d7 = _0x420c20["ownerDocument"]["createElement"]("template");
    _0x62c3d7["innerHTML"] = this['render']();
    const _0x3e4f31 = _0x62c3d7["content"]["querySelector"](".storyboard-3d-director-path-map svg");
    if (_0x3e4f31) {
      _0x420c20["replaceWith"](_0x3e4f31);
    }
  }
  ["destroy"]() {
    this['mobile']["destroy"]();
    this["delivery"]['destroy']();
    this["scenePanel"]['destroy']();
    this["drafts"]['clear']();
  }
}