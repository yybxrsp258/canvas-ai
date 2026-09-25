import a487_0x421707 from '../core/stores/appStore.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { detectScenes } from '../../api/sceneDetectionApi.js';
import { getDisplayModelName, PROVIDERS_META } from '../modules/providers.js';
import { startLoading, stopLoading } from '../modules/loadingOverlay.js';
import { generateId, findAvailablePosition } from '../core/math.js';
import { getNodeSpawnPrefs } from '../modules/nodeSpawn.js';
import { buildSourceMediaNodePayload, getAutoMediaSizeByShortSide } from '../services/fileService.js';
import { saveTextDownload } from '../services/downloadSaveService.js';
function sceneDetectionText(_0x350aef, _0x4da441 = {}) {
  return t('sceneDetectionNode.' + _0x350aef, _0x4da441);
}
const _SCENE_DETECTION_NODE_TEMPLATE = '\x0a\x20\x20<div\x20class=\x22node-card\x20scene-detection-card\x22\x20style=\x22width:\x20100%;\x20height:\x20100%;\x20padding:\x2016px;\x20background:\x20var(--white-05);\x20border:\x201px\x20solid\x20var(--stroke-08);\x20border-radius:\x2018px;\x20overflow:\x20hidden;\x20position:\x20relative;\x20display:\x20flex;\x20flex-direction:\x20column;\x20pointer-events:\x20auto;\x22>\x0a\x20\x20\x20\x20<div\x20class=\x22scene-detection-header\x22\x20style=\x22display:\x20flex;\x20justify-content:\x20space-between;\x20align-items:\x20center;\x20margin-bottom:\x2016px;\x22>\x0a\x20\x20\x20\x20\x20\x20<h3\x20class=\x22scene-detection-title\x22\x20style=\x22margin:\x200;\x20font-size:\x2016px;\x20font-weight:\x20600;\x20color:\x20var(--text-primary);\x22></h3>\x0a\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22detect-btn\x22\x20style=\x22background:\x20var(--blue);\x20color:\x20white;\x20border:\x20none;\x20border-radius:\x208px;\x20padding:\x206px\x2012px;\x20font-size:\x2012px;\x20cursor:\x20var(--link-cursor);\x22>\x0a\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20<div\x20class=\x22scene-detection-input\x22\x20style=\x22margin-bottom:\x2016px;\x22>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22input-label\x20scene-video-source-label\x22\x20style=\x22font-size:\x2012px;\x20color:\x20var(--text-muted);\x20margin-bottom:\x208px;\x22></div>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22ref-bar\x22\x20style=\x22border:\x201px\x20dashed\x20var(--stroke-20);\x20border-radius:\x208px;\x20padding:\x2012px;\x20display:\x20flex;\x20align-items:\x20center;\x20justify-content:\x20center;\x20min-height:\x2060px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22ref-placeholder\x22\x20style=\x22color:\x20var(--text-muted);\x20font-size:\x2012px;\x22></div>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20<div\x20class=\x22scene-detection-settings\x22\x20style=\x22margin-bottom:\x2016px;\x22>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22input-label\x20scene-sensitivity-label\x22\x20style=\x22font-size:\x2012px;\x20color:\x20var(--text-muted);\x20margin-bottom:\x208px;\x22></div>\x0a\x20\x20\x20\x20\x20\x20<input\x20type=\x22range\x22\x20class=\x22sensitivity-slider\x22\x20min=\x220.1\x22\x20max=\x221\x22\x20step=\x220.1\x22\x20value=\x220.5\x22\x20style=\x22width:\x20100%;\x20accent-color:\x20var(--blue);\x22>\x0a\x20\x20\x20\x20\x20\x20<div\x20style=\x22display:\x20flex;\x20justify-content:\x20space-between;\x20font-size:\x2011px;\x20color:\x20var(--text-secondary);\x20margin-top:\x204px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22scene-sensitivity-low\x22></span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22scene-sensitivity-high\x22></span>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20<div\x20class=\x22scene-detection-results\x22\x20style=\x22flex:\x201;\x20border:\x201px\x20solid\x20var(--stroke-10);\x20border-radius:\x208px;\x20padding:\x2012px;\x20overflow-y:\x20auto;\x20margin-bottom:\x2016px;\x22>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22results-placeholder\x22\x20style=\x22color:\x20var(--text-muted);\x20font-size:\x2012px;\x20text-align:\x20center;\x20padding:\x2020px\x200;\x22>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22scene-list\x22\x20style=\x22display:\x20none;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22scene-count\x22\x20style=\x22font-size:\x2012px;\x20font-weight:\x20600;\x20margin-bottom:\x208px;\x22><span\x20class=\x22scene-count-prefix\x22></span>\x20<span\x20class=\x22count\x22>0</span>\x20<span\x20class=\x22scene-count-suffix\x22></span></div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22scene-timeline\x22\x20style=\x22position:\x20relative;\x20height:\x2040px;\x20background:\x20var(--white-10);\x20border-radius:\x204px;\x20margin-bottom:\x2012px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22timeline-markers\x22\x20style=\x22position:\x20absolute;\x20top:\x200;\x20left:\x200;\x20right:\x200;\x20height:\x20100%;\x20display:\x20flex;\x20align-items:\x20center;\x22></div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22scene-items\x22\x20style=\x22display:\x20flex;\x20flex-direction:\x20column;\x20gap:\x208px;\x22></div>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x0a\x20\x20\x20\x20<div\x20class=\x22scene-detection-actions\x22\x20style=\x22display:\x20flex;\x20gap:\x208px;\x22>\x0a\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22auto-clip-btn\x22\x20style=\x22flex:\x201;\x20background:\x20var(--green);\x20color:\x20white;\x20border:\x20none;\x20border-radius:\x208px;\x20padding:\x208px\x2016px;\x20font-size:\x2012px;\x20cursor:\x20var(--link-cursor);\x20display:\x20none;\x22>\x0a\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22export-btn\x22\x20style=\x22flex:\x201;\x20background:\x20var(--purple);\x20color:\x20white;\x20border:\x20none;\x20border-radius:\x208px;\x20padding:\x208px\x2016px;\x20font-size:\x2012px;\x20cursor:\x20var(--link-cursor);\x20display:\x20none;\x22>\x0a\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</div>\x0a';
export class SceneDetectionNode {
  constructor(_0x217a78) {
    this["_data"] = _0x217a78;
    this["nodeId"] = _0x217a78['id'];
    this['el'] = document["createElement"]('div');
    this['el']["className"] = 'v2-node-component';
    this["_videoSource"] = null;
    this['_detectionResults'] = null;
    this["_isDetecting"] = ![];
    this["_sensitivity"] = 0.5;
    this["_unsubscribeLocale"] = null;
  }
  ["mount"]() {
    this["_subscribeLocaleChanges"]();
    const _0x707a3b = this['el'];
    _0x707a3b['innerHTML'] = _SCENE_DETECTION_NODE_TEMPLATE;
    this["_card"] = _0x707a3b['querySelector'](".scene-detection-card");
    this["_title"] = _0x707a3b["querySelector"](".scene-detection-title");
    this['_detectBtn'] = _0x707a3b["querySelector"](".detect-btn");
    this["_videoSourceLabel"] = _0x707a3b['querySelector'](".scene-video-source-label");
    this["_refBar"] = _0x707a3b["querySelector"](".ref-bar");
    this["_refPlaceholder"] = _0x707a3b['querySelector'](".ref-placeholder");
    this['_sensitivityLabel'] = _0x707a3b['querySelector'](".scene-sensitivity-label");
    this["_sensitivityLow"] = _0x707a3b['querySelector'](".scene-sensitivity-low");
    this["_sensitivityHigh"] = _0x707a3b["querySelector"]('.scene-sensitivity-high');
    this["_sensitivitySlider"] = _0x707a3b["querySelector"](".sensitivity-slider");
    this["_resultsContainer"] = _0x707a3b["querySelector"](".scene-detection-results");
    this["_resultsPlaceholder"] = _0x707a3b["querySelector"](".results-placeholder");
    this["_sceneList"] = _0x707a3b["querySelector"]('.scene-list');
    this["_sceneCountPrefix"] = _0x707a3b["querySelector"]('.scene-count-prefix');
    this['_sceneCountSuffix'] = _0x707a3b["querySelector"](".scene-count-suffix");
    this["_sceneCount"] = _0x707a3b['querySelector']('.scene-count\x20.count');
    this["_timelineMarkers"] = _0x707a3b["querySelector"](".timeline-markers");
    this["_sceneItems"] = _0x707a3b["querySelector"](".scene-items");
    this['_autoClipBtn'] = _0x707a3b["querySelector"]('.auto-clip-btn');
    this['_exportBtn'] = _0x707a3b["querySelector"](".export-btn");
    this["_detectBtn"]["addEventListener"]("click", () => this['_startDetection']());
    this["_sensitivitySlider"]["addEventListener"]('input', _0x8ac021 => {
      this["_sensitivity"] = parseFloat(_0x8ac021["target"]["value"]);
    });
    this['_autoClipBtn']["addEventListener"]("click", () => this["_autoClip"]());
    this['_exportBtn']['addEventListener']("click", () => void this['_exportScenes']());
    this["_syncLocaleTexts"]();
    this["_checkVideoInput"]();
    return _0x707a3b;
  }
  ["_checkVideoInput"]() {
    const _0x1288c5 = a487_0x421707['getIncomingEdges'](this["nodeId"]) || [];
    if (_0x1288c5["length"] > 0x0) {
      const _0xbf3c9b = _0x1288c5[0x0];
      const _0x563ede = a487_0x421707["getState"]()["nodes"][_0xbf3c9b["sourceId"]];
      _0x563ede && (_0x563ede["type"] === "source-video" || _0x563ede['type']["includes"]("video")) && (this["_videoSource"] = _0x563ede, this["_refPlaceholder"]["textContent"] = _0x563ede["name"] || sceneDetectionText('input.videoSource'), this["_refBar"]['style']["borderStyle"] = "solid", this['_refBar']["style"]["borderColor"] = "var(--blue)");
    }
  }
  async ["_startDetection"]() {
    if (!this['_videoSource']) {
      window["showToast"](sceneDetectionText("toasts.connectVideoFirst"), "error");
      return;
    }
    if (this["_isDetecting"]) {
      return;
    }
    const _0xc62345 = this["_videoSource"]['src'] || this["_videoSource"]["videoUrl"];
    if (!_0xc62345) {
      window['showToast'](sceneDetectionText("toasts.invalidVideoSource"), "error");
      return;
    }
    this["_isDetecting"] = !![];
    startLoading(this["_card"]);
    this["_detectBtn"]['textContent'] = sceneDetectionText("actions.detecting");
    this["_detectBtn"]['disabled'] = !![];
    try {
      const _0x2bcfad = await detectScenes({
        'videoUrl': _0xc62345,
        'provider': 'grsai',
        'sensitivity': this["_sensitivity"]
      });
      this["_detectionResults"] = _0x2bcfad;
      this["_displayResults"](_0x2bcfad);
      a487_0x421707["updateNodeData"](this["nodeId"], {
        'sceneDetectionResults': _0x2bcfad
      });
      window["showToast"](sceneDetectionText("toasts.detected", {
        'count': _0x2bcfad["sceneCount"]
      }), "success");
    } catch (_0x17c70f) {
      console["error"]("场景检测失败:", _0x17c70f);
      window["showToast"](sceneDetectionText("toasts.detectFailed"), "error");
    } finally {
      this["_isDetecting"] = ![];
      stopLoading(this['_card']);
      this['_detectBtn']["textContent"] = sceneDetectionText('actions.startDetection');
      this["_detectBtn"]["disabled"] = ![];
    }
  }
  ["_displayResults"](_0x28a5c7) {
    this["_resultsPlaceholder"]['style']['display'] = 'none';
    this["_sceneList"]["style"]['display'] = "block";
    this["_autoClipBtn"]["style"]['display'] = "block";
    this["_exportBtn"]["style"]["display"] = "block";
    this["_sceneCount"]["textContent"] = _0x28a5c7["sceneCount"];
    this["_timelineMarkers"]["innerHTML"] = '';
    const _0x362ace = _0x28a5c7["sceneChanges"];
    _0x362ace['forEach']((_0x1b07c7, _0x10baf5) => {
      const _0x27fcc7 = document['createElement']("div");
      _0x27fcc7["style"]["position"] = 'absolute';
      _0x27fcc7["style"]["left"] = _0x1b07c7 / 0x64 * 0x64 + '%';
      _0x27fcc7["style"]["width"] = "2px";
      _0x27fcc7["style"]["height"] = "100%";
      _0x27fcc7['style']["background"] = "var(--red)";
      _0x27fcc7["style"]['cursor'] = "var(--link-cursor)";
      _0x27fcc7["title"] = sceneDetectionText('timeline.changeAt', {
        'time': this['_formatTime'](_0x1b07c7)
      });
      this["_timelineMarkers"]['appendChild'](_0x27fcc7);
    });
    this["_sceneItems"]['innerHTML'] = '';
    let _0x59a4b9 = 0x0;
    for (let _0x523c1a = 0x0; _0x523c1a < _0x28a5c7["sceneCount"]; _0x523c1a++) {
      const _0x5d3e4d = _0x523c1a < _0x28a5c7["sceneChanges"]['length'] ? _0x28a5c7["sceneChanges"][_0x523c1a] : 0x64;
      const _0x4a4637 = document["createElement"]("div");
      _0x4a4637["className"] = "scene-item";
      _0x4a4637["style"]["display"] = 'flex';
      _0x4a4637["style"]["justifyContent"] = "space-between";
      _0x4a4637["style"]["alignItems"] = "center";
      _0x4a4637["style"]["padding"] = '8px';
      _0x4a4637["style"]["background"] = "var(--white-10)";
      _0x4a4637["style"]['borderRadius'] = '4px';
      const _0x4e5fe1 = sceneDetectionText("scene.label", {
        'index': _0x523c1a + 0x1
      });
      const _0x2eabcd = sceneDetectionText("actions.clip");
      _0x4a4637["innerHTML"] = "\n        <div style=\"font-size: 12px;\">" + _0x4e5fe1 + '</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22font-size:\x2011px;\x20color:\x20var(--text-secondary);\x22>' + this["_formatTime"](_0x59a4b9) + " - " + this['_formatTime'](_0x5d3e4d) + "</div>\n        <button type=\"button\" class=\"clip-btn\" data-index=\"" + _0x523c1a + "\" style=\"background: var(--blue); color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 10px; cursor: var(--link-cursor);\">\n          " + _0x2eabcd + "\n        </button>\n      ";
      this['_sceneItems']["appendChild"](_0x4a4637);
      _0x59a4b9 = _0x5d3e4d;
    }
    this["_sceneItems"]['querySelectorAll']('.clip-btn')['forEach'](_0x2e57da => {
      _0x2e57da['addEventListener']("click", _0x764bfc => {
        const _0x33d075 = parseInt(_0x764bfc["target"]["dataset"]["index"]);
        this["_clipScene"](_0x33d075);
      });
    });
  }
  ['_formatTime'](_0x585058) {
    const _0xfed9b0 = Math["floor"](_0x585058 / 0x3c);
    const _0xbe7e12 = Math["floor"](_0x585058 % 0x3c);
    return _0xfed9b0 + ':' + _0xbe7e12["toString"]()["padStart"](0x2, '0');
  }
  ['_autoClip']() {
    if (!this['_detectionResults']) {
      return;
    }
    const _0x1a2065 = this['_detectionResults']['sceneChanges'];
    let _0x3e0357 = 0x0;
    for (let _0x55ee71 = 0x0; _0x55ee71 < this["_detectionResults"]["sceneCount"]; _0x55ee71++) {
      const _0x4f639f = _0x55ee71 < _0x1a2065["length"] ? _0x1a2065[_0x55ee71] : 0x64;
      this['_createClipNode'](_0x3e0357, _0x4f639f, _0x55ee71 + 0x1);
      _0x3e0357 = _0x4f639f;
    }
    window["showToast"](sceneDetectionText("toasts.createdClipNodes", {
      'count': this["_detectionResults"]['sceneCount']
    }), "success");
  }
  ["_clipScene"](_0x1ed376) {
    if (!this["_detectionResults"]) {
      return;
    }
    const _0x3e89c4 = this['_detectionResults']["sceneChanges"];
    let _0x2a89ea = 0x0;
    let _0x468238 = 0x64;
    for (let _0x8dff = 0x0; _0x8dff <= _0x1ed376; _0x8dff++) {
      if (_0x8dff === _0x1ed376) {
        _0x468238 = _0x8dff < _0x3e89c4['length'] ? _0x3e89c4[_0x8dff] : 0x64;
        break;
      }
      _0x2a89ea = _0x3e89c4[_0x8dff];
    }
    this["_createClipNode"](_0x2a89ea, _0x468238, _0x1ed376 + 0x1);
    window["showToast"](sceneDetectionText('toasts.createdSceneClipNode', {
      'index': _0x1ed376 + 0x1
    }), 'success');
  }
  ["_createClipNode"](_0x2b8e1e, _0x45b4b9, _0x2be971) {
    if (!this["_videoSource"]) {
      return;
    }
    const {
      spacing: _0x35d98a,
      direction: _0x149616,
      avoidOverlap: _0xd2a4fd
    } = getNodeSpawnPrefs();
    const _0x482f73 = _0x149616 === "down" ? "down" : 'right';
    const _0x3049b1 = Number(this["_data"]['x']) || 0x0;
    const _0x470dae = Number(this['_data']['y']) || 0x0;
    const _0x572fd8 = Number(this['_data']['width']) || 0x200;
    const _0x1ee02f = Number(this["_data"]['height']) || 0x120;
    const _0xfec4b6 = getAutoMediaSizeByShortSide(_0x572fd8, _0x1ee02f);
    const _0x27520c = _0x3049b1 + _0x572fd8 + _0x35d98a;
    const _0x13f1c3 = _0x482f73 === "down" ? _0x470dae + _0x1ee02f + _0x35d98a : _0x470dae + Math['round']((_0x1ee02f - _0xfec4b6["height"]) / 0x2);
    const _0x476a2e = _0xd2a4fd ? findAvailablePosition(a487_0x421707['getState']()["nodes"] || {}, _0x27520c, _0x13f1c3, _0xfec4b6["width"], _0xfec4b6["height"], _0x35d98a, _0x482f73) : {
      'x': _0x27520c,
      'y': _0x13f1c3
    };
    const _0x13e4c4 = generateId('node');
    a487_0x421707["addNode"](buildSourceMediaNodePayload({
      'id': _0x13e4c4,
      'type': "source-video",
      'name': sceneDetectionText('scene.label', {
        'index': _0x2be971
      }),
      'src': this["_videoSource"]["src"],
      'localPath': this["_videoSource"]["localPath"],
      'clipStart': _0x2b8e1e,
      'clipEnd': _0x45b4b9,
      'x': _0x476a2e['x'],
      'y': _0x476a2e['y'],
      'width': _0xfec4b6["width"],
      'height': _0xfec4b6["height"],
      'needsAutoResize': ![]
    }));
    a487_0x421707["addEdge"]({
      'id': generateId("edge"),
      'sourceId': this['nodeId'],
      'targetId': _0x13e4c4,
      'refSlot': "scene"
    });
  }
  async ['_exportScenes']() {
    if (!this['_detectionResults']) {
      return;
    }
    const _0x511353 = {
      'videoSource': this["_videoSource"]?.['name'] || sceneDetectionText('export.unknownVideo'),
      'sceneCount': this["_detectionResults"]["sceneCount"],
      'scenes': []
    };
    let _0x7414e9 = 0x0;
    for (let _0xe618ac = 0x0; _0xe618ac < this["_detectionResults"]["sceneCount"]; _0xe618ac++) {
      const _0x5bc633 = _0xe618ac < this['_detectionResults']["sceneChanges"]["length"] ? this["_detectionResults"]["sceneChanges"][_0xe618ac] : 0x64;
      _0x511353['scenes']["push"]({
        'number': _0xe618ac + 0x1,
        'startTime': _0x7414e9,
        'endTime': _0x5bc633,
        'duration': _0x5bc633 - _0x7414e9
      });
      _0x7414e9 = _0x5bc633;
    }
    try {
      const _0x4be9d6 = await saveTextDownload({
        'filename': "scenes_" + Date["now"]() + ".json",
        'content': JSON["stringify"](_0x511353, null, 0x2),
        'mimeType': 'application/json',
        'filterName': "JSON"
      });
      if (_0x4be9d6?.["canceled"]) {
        return;
      }
    } catch (_0x539272) {
      window["showToast"]?.(String(_0x539272?.["message"] || _0x539272), "error");
      return;
    }
    window["showToast"](sceneDetectionText('toasts.exported'), "success");
  }
  ['update'](_0x1cebd4) {
    this['_data'] = _0x1cebd4;
    this['_checkVideoInput']();
    _0x1cebd4["sceneDetectionResults"] && (this["_detectionResults"] = _0x1cebd4["sceneDetectionResults"], this["_displayResults"](_0x1cebd4["sceneDetectionResults"]));
  }
  ["_subscribeLocaleChanges"]() {
    if (this["_unsubscribeLocale"]) {
      return;
    }
    this["_unsubscribeLocale"] = onLocaleChange(() => {
      this['_syncLocaleTexts']();
      if (this["_detectionResults"]) {
        this["_displayResults"](this["_detectionResults"]);
      }
    });
  }
  ["_syncLocaleTexts"]() {
    if (this['_title']) {
      this["_title"]['textContent'] = sceneDetectionText("title");
    }
    this["_detectBtn"] && (this['_detectBtn']["textContent"] = this["_isDetecting"] ? sceneDetectionText('actions.detecting') : sceneDetectionText('actions.startDetection'));
    this["_videoSourceLabel"] && (this["_videoSourceLabel"]['textContent'] = sceneDetectionText("input.videoSource"));
    this["_refPlaceholder"] && (this['_refPlaceholder']['textContent'] = this["_videoSource"]?.["name"] || (this["_videoSource"] ? sceneDetectionText("input.videoSource") : sceneDetectionText("input.dropVideoHere")));
    this["_sensitivityLabel"] && (this["_sensitivityLabel"]["textContent"] = sceneDetectionText("settings.sensitivity"));
    this["_sensitivityLow"] && (this["_sensitivityLow"]['textContent'] = sceneDetectionText("settings.low"));
    this['_sensitivityHigh'] && (this["_sensitivityHigh"]["textContent"] = sceneDetectionText("settings.high"));
    this['_resultsPlaceholder'] && (this["_resultsPlaceholder"]["textContent"] = sceneDetectionText("results.placeholder"));
    this["_sceneCountPrefix"] && (this["_sceneCountPrefix"]["textContent"] = sceneDetectionText('results.countPrefix'));
    this["_sceneCountSuffix"] && (this['_sceneCountSuffix']["textContent"] = sceneDetectionText('results.countSuffix'));
    this["_autoClipBtn"] && (this['_autoClipBtn']["textContent"] = sceneDetectionText('actions.autoClip'));
    this["_exportBtn"] && (this["_exportBtn"]['textContent'] = sceneDetectionText('actions.exportScenes'));
  }
  ["unmount"]() {
    this["_unsubscribeLocale"]?.();
    this["_unsubscribeLocale"] = null;
  }
}