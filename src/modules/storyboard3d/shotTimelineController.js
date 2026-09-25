import { STORYBOARD_3D_OBJECT_ANIMATION_PROPERTIES, getStoryboard3DObjectAnimationTrack, normalizeStoryboard3DShotAnimation, removeStoryboard3DAnimationKeyframe, sampleStoryboard3DShotAnimation, updateStoryboard3DShotAnimationSettings, upsertStoryboard3DCameraKeyframe, upsertStoryboard3DObjectKeyframe } from './shotAnimation.js';
import { syncStoryboard3DCameraObjectFromShot } from './projectModel.js';
import { DirectorTimelinePanel } from './directorTimelinePanel.js';
import { TimelineKeyframeDrag } from './timelineKeyframeDrag.js';
import { DirectorCameraPathController } from './directorCameraPathController.js';
import { DirectorTimelineEditing } from './directorTimelineEditing.js';
import { renderDirectorCameraKeyEditor } from './directorCameraKeyEditor.js';
import { DirectorClipTimeline } from './directorClipTimeline.js';
import { DirectorMultiView } from './directorMultiView.js';
const PROPERTY_LABELS = Object["freeze"]({
  'position': '位置',
  'rotation': '旋转',
  'scale': '缩放'
});
const TOOL_PROPERTIES = Object["freeze"]({
  'move': "position",
  'rotate': 'rotation',
  'scale': "scale"
});
function escapeHtml(_0x7d9be9) {
  return String(_0x7d9be9 ?? '')['replace'](/&/g, "&amp;")["replace"](/</g, "&lt;")['replace'](/>/g, "&gt;")["replace"](/"/g, "&quot;")["replace"](/'/g, "&#39;");
}
function clamp(_0x2b7baa, _0xb73133, _0x23f45f) {
  return Math["min"](_0x23f45f, Math["max"](_0xb73133, Number(_0x2b7baa) || 0x0));
}
function getSceneContext(_0x1d4e1b) {
  const _0x3bf8f1 = Array["isArray"](_0x1d4e1b?.['scenes']) ? _0x1d4e1b['scenes'] : [];
  const _0x3ab8ff = _0x3bf8f1["find"](_0x49a730 => _0x49a730['id'] === _0x1d4e1b?.['activeSceneId']) || _0x3bf8f1[0x0] || null;
  const _0x12fd96 = Array["isArray"](_0x3ab8ff?.['shots']) ? _0x3ab8ff["shots"] : [];
  const _0x149257 = _0x12fd96["find"](_0x1a63b4 => _0x1a63b4['id'] === _0x3ab8ff?.["activeShotId"]) || _0x12fd96[0x0] || null;
  return {
    'scene': _0x3ab8ff,
    'shot': _0x149257
  };
}
function createObjectTransforms(_0xc0c792) {
  return Object["fromEntries"]((_0xc0c792?.["objects"] || [])["map"](_0x567795 => [_0x567795['id'], _0x567795["transform"]]));
}
function cloneCameraState(_0x53803d) {
  return {
    ..._0x53803d,
    'position': [..._0x53803d['position']],
    'target': [..._0x53803d["target"]]
  };
}
function normalizeAnimation(_0x3b669f, _0x48599c) {
  return normalizeStoryboard3DShotAnimation(_0x48599c?.['animation'], {
    'camera': _0x48599c?.["camera"],
    'objectIds': new Set((_0x3b669f?.['objects'] || [])['map'](_0x2f6d48 => _0x2f6d48['id'])),
    'objectTransforms': createObjectTransforms(_0x3b669f)
  });
}
function getKeyframeCount(_0x332c8b) {
  return _0x332c8b["cameraKeyframes"]["length"] + _0x332c8b["objectTracks"]["reduce"]((_0x52dd2f, _0x3597a4) => _0x52dd2f + STORYBOARD_3D_OBJECT_ANIMATION_PROPERTIES['reduce']((_0x12b5ae, _0xbb447b) => _0x12b5ae + _0x3597a4[_0xbb447b + "Keyframes"]["length"], 0x0), 0x0);
}
function formatFrameTime(_0x3540f4, _0x25f89e) {
  return Math["round"](_0x3540f4 * _0x25f89e) + 'f';
}
function renderKeyframes(_0x137c5f, _0x32faf1, _0x476f59 = {}) {
  return _0x137c5f["map"](_0x11d2b3 => {
    const _0x2bf016 = _0x32faf1['duration'] > 0x0 ? _0x11d2b3["time"] / _0x32faf1["duration"] * 0x64 : 0x0;
    const _0xe09534 = _0x476f59['keyframeId'] === _0x11d2b3['id'];
    return "<button type=\"button\" class=\"storyboard-3d-timeline-keyframe " + (_0xe09534 ? "is-selected" : '') + "\" style=\"--storyboard-3d-keyframe-position:" + _0x2bf016 + "%\" data-storyboard-3d-action=\"timeline-select-keyframe\" data-keyframe-id=\"" + escapeHtml(_0x11d2b3['id']) + "\" data-keyframe-type=\"" + escapeHtml(_0x476f59['type'] || '') + "\" data-object-id=\"" + escapeHtml(_0x476f59['objectId'] || '') + "\" data-property=\"" + escapeHtml(_0x476f59["property"] || '') + "\" data-keyframe-time=\"" + _0x11d2b3["time"] + "\" aria-label=\"关键帧 " + _0x11d2b3["time"]["toFixed"](0x2) + " 秒，第 " + formatFrameTime(_0x11d2b3["time"], _0x32faf1["fps"]) + "\" title=\"" + _0x11d2b3["time"]["toFixed"](0x2) + "s · " + formatFrameTime(_0x11d2b3["time"], _0x32faf1["fps"]) + '\x22></button>';
  })["join"]('');
}
function renderPropertyLinks(_0x2dcd01, _0x5c4ade) {
  return STORYBOARD_3D_OBJECT_ANIMATION_PROPERTIES["map"](_0x2e12e1 => "<button type=\"button\" class=\"storyboard-3d-timeline-property-link " + (_0x5c4ade === _0x2e12e1 ? "is-active" : '') + '\x22\x20data-storyboard-3d-action=\x22timeline-set-object-property\x22\x20data-object-id=\x22' + escapeHtml(_0x2dcd01) + "\" data-property=\"" + _0x2e12e1 + '\x22>' + PROPERTY_LABELS[_0x2e12e1] + '</button>')['join']('<span\x20aria-hidden=\x22true\x22>/</span>');
}
function renderAddKeyframeButton({
  action: _0x24b6c2,
  label: _0x344631,
  objectId = '',
  property = ''
}) {
  return "<button type=\"button\" class=\"storyboard-3d-timeline-row-add\" data-storyboard-3d-action=\"" + _0x24b6c2 + "\" data-object-id=\"" + escapeHtml(objectId) + '\x22\x20data-property=\x22' + escapeHtml(property) + '\x22\x20aria-label=\x22为' + escapeHtml(_0x344631) + "添加关键帧\" title=\"为" + escapeHtml(_0x344631) + "添加关键帧\">+</button>";
}
function renderTimelineLane({
  animation: _0x3b5372,
  keyframes: _0x160316,
  selection: _0x1267cb,
  className = '',
  label: _0x595a6e
}) {
  return "<div class=\"storyboard-3d-timeline-lane " + className + "\" data-timeline-lane-label=\"" + escapeHtml(_0x595a6e || '') + '\x22>\x0a\x20\x20\x20\x20<span\x20class=\x22storyboard-3d-timeline-lane-line\x22\x20aria-hidden=\x22true\x22></span>\x0a\x20\x20\x20\x20' + renderKeyframes(_0x160316, _0x3b5372, _0x1267cb) + "\n  </div>";
}
function renderCameraTrack(_0x378dc9, _0x22f5c5) {
  return '<div\x20class=\x22storyboard-3d-timeline-row\x20is-camera\x22>\x0a\x20\x20\x20\x20<div\x20class=\x22storyboard-3d-timeline-track-label\x22>\x0a\x20\x20\x20\x20\x20\x20<div><strong>摄像机</strong><small>位置\x20/\x20目标\x20/\x20焦距</small></div>\x0a\x20\x20\x20\x20\x20\x20' + renderAddKeyframeButton({
    'action': "timeline-add-camera-keyframe",
    'label': "摄像机"
  }) + "\n    </div>\n    " + renderTimelineLane({
    'animation': _0x378dc9,
    'keyframes': _0x378dc9['cameraKeyframes'],
    'selection': {
      ..._0x22f5c5,
      'type': "camera"
    },
    'className': 'is-camera',
    'label': "摄像机"
  }) + "\n  </div>";
}
function renderObjectTrack({
  object: _0x567174,
  animation: _0x1ec753,
  activeProperty: _0x3b8595,
  expanded: _0x56215f,
  selected: _0x141a57,
  selectedKeyframe: _0x441c56
}) {
  const _0x2aaf50 = getStoryboard3DObjectAnimationTrack(_0x1ec753, _0x567174['id']) || {
    'positionKeyframes': [],
    'rotationKeyframes': [],
    'scaleKeyframes': []
  };
  const _0x121c9c = _0x567174["name"] + '\x20·\x20' + PROPERTY_LABELS[_0x3b8595];
  const _0x36c962 = '<div\x20class=\x22storyboard-3d-timeline-object-summary\x20' + (_0x141a57 ? "is-selected" : '') + "\">\n    <button type=\"button\" class=\"storyboard-3d-timeline-disclosure " + (_0x56215f ? "is-expanded" : '') + "\" data-storyboard-3d-action=\"timeline-toggle-object\" data-object-id=\"" + escapeHtml(_0x567174['id']) + '\x22\x20aria-label=\x22' + (_0x56215f ? '折叠' : '展开') + escapeHtml(_0x567174["name"]) + "轨道\" aria-expanded=\"" + _0x56215f + '\x22>' + (_0x56215f ? '折叠' : '展开') + "</button>\n    <div><strong>" + escapeHtml(_0x567174['name']) + "</strong><span>" + renderPropertyLinks(_0x567174['id'], _0x3b8595) + "</span></div>\n    " + (_0x56215f ? '' : renderAddKeyframeButton({
    'action': "timeline-add-object-keyframe",
    'label': _0x121c9c,
    'objectId': _0x567174['id'],
    'property': _0x3b8595
  })) + "\n  </div>";
  if (!_0x56215f) {
    return '<div\x20class=\x22storyboard-3d-timeline-row\x20is-object\x20is-' + _0x3b8595 + '\x20' + (_0x141a57 ? "is-selected" : '') + "\">\n      " + _0x36c962 + '\x0a\x20\x20\x20\x20\x20\x20' + renderTimelineLane({
      'animation': _0x1ec753,
      'keyframes': _0x2aaf50[_0x3b8595 + "Keyframes"],
      'selection': {
        ..._0x441c56,
        'type': "object",
        'objectId': _0x567174['id'],
        'property': _0x3b8595
      },
      'className': 'is-' + _0x3b8595,
      'label': _0x121c9c
    }) + "\n    </div>";
  }
  const _0x39bc10 = STORYBOARD_3D_OBJECT_ANIMATION_PROPERTIES["map"](_0x4574b5 => '<div\x20class=\x22storyboard-3d-timeline-row\x20is-object-property\x20is-' + _0x4574b5 + "\">\n      <div class=\"storyboard-3d-timeline-property-label\"><span aria-hidden=\"true\"></span>" + PROPERTY_LABELS[_0x4574b5] + renderAddKeyframeButton({
    'action': "timeline-add-object-keyframe",
    'label': _0x567174["name"] + " · " + PROPERTY_LABELS[_0x4574b5],
    'objectId': _0x567174['id'],
    'property': _0x4574b5
  }) + "</div>\n      " + renderTimelineLane({
    'animation': _0x1ec753,
    'keyframes': _0x2aaf50[_0x4574b5 + "Keyframes"],
    'selection': {
      ..._0x441c56,
      'type': "object",
      'objectId': _0x567174['id'],
      'property': _0x4574b5
    },
    'className': "is-" + _0x4574b5,
    'label': _0x567174["name"] + " · " + PROPERTY_LABELS[_0x4574b5]
  }) + '\x0a\x20\x20\x20\x20</div>')["join"]('');
  return "<div class=\"storyboard-3d-timeline-object-group " + (_0x141a57 ? "is-selected" : '') + "\">\n    <div class=\"storyboard-3d-timeline-row is-object-summary\">" + _0x36c962 + "<div class=\"storyboard-3d-timeline-lane is-summary\"></div></div>\n    " + _0x39bc10 + "\n  </div>";
}
function renderRuler(_0x518f7c, _0x9d3655) {
  const _0x30fc10 = 0x6;
  const _0x266517 = Array["from"]({
    'length': _0x30fc10 + 0x1
  }, (_0x2ef051, _0x1d2389) => {
    const _0x3af09e = _0x518f7c['duration'] * _0x1d2389 / _0x30fc10;
    return "<span style=\"--storyboard-3d-tick-position:" + _0x1d2389 / _0x30fc10 * 0x64 + "%\"><strong>" + _0x3af09e['toFixed'](_0x3af09e % 0x1 === 0x0 ? 0x0 : 0x1) + "s</strong><small>" + formatFrameTime(_0x3af09e, _0x518f7c['fps']) + '</small></span>';
  })["join"]('');
  return "<div class=\"storyboard-3d-timeline-row is-ruler\">\n    <div class=\"storyboard-3d-timeline-ruler-label\">轨道</div>\n    <div class=\"storyboard-3d-timeline-ruler\">\n      " + _0x266517 + "\n      <input type=\"range\" min=\"0\" max=\"" + _0x518f7c["duration"] + "\" step=\"" + 0x1 / _0x518f7c["fps"] + '\x22\x20value=\x22' + _0x9d3655 + "\" data-storyboard-3d-timeline-scrubber aria-label=\"镜头动画播放头\">\n    </div>\n  </div>";
}
function findSelectedKeyframe(_0x1db730, _0x5babfe) {
  if (!_0x5babfe?.["keyframeId"]) {
    return null;
  }
  if (_0x5babfe["type"] === "camera") {
    const _0x238f48 = _0x1db730["cameraKeyframes"]["find"](_0x58699f => _0x58699f['id'] === _0x5babfe["keyframeId"]);
    return _0x238f48 ? {
      ..._0x5babfe,
      'keyframe': _0x238f48
    } : null;
  }
  const _0x6f7c84 = _0x1db730["objectTracks"]["find"](_0x2d9547 => _0x2d9547["objectId"] === _0x5babfe['objectId']);
  const _0x1a0e33 = _0x6f7c84?.[_0x5babfe['property'] + 'Keyframes']?.["find"](_0x2b0291 => _0x2b0291['id'] === _0x5babfe["keyframeId"]);
  return _0x1a0e33 ? {
    ..._0x5babfe,
    'keyframe': _0x1a0e33
  } : null;
}
function renderSelectedKeyframeEditor(_0x358af1, _0x55128a, _0x80c52e) {
  const _0x4a2835 = findSelectedKeyframe(_0x358af1, _0x55128a);
  if (!_0x4a2835) {
    return "<footer class=\"storyboard-3d-timeline-key-editor is-empty\"><span>选择关键帧后可编辑数值与缓动</span></footer>";
  }
  const {
    keyframe: _0x1736b4
  } = _0x4a2835;
  const _0x187299 = "<label class=\"storyboard-3d-timeline-easing\">时间 / 秒<input type=\"number\" min=\"0\" max=\"3600\" step=\"" + 0x1 / _0x358af1['fps'] + "\" value=\"" + _0x1736b4["time"] + "\" data-storyboard-3d-timeline-key-time></label><button type=\"button\" data-storyboard-3d-action=\"timeline-copy-keyframe\">复制到播放头</button>";
  const _0x34c1e1 = _0x80c52e?.["objects"]?.["find"](_0x3f6860 => _0x3f6860['id'] === _0x4a2835["objectId"]);
  if (_0x4a2835["type"] === "camera") {
    return "<footer class=\"storyboard-3d-timeline-key-editor\">\n      <strong>摄像机关键帧</strong><span>" + _0x1736b4['time']["toFixed"](0x2) + "s · " + formatFrameTime(_0x1736b4["time"], _0x358af1["fps"]) + '</span>\x0a\x20\x20\x20\x20\x20\x20<span>焦距\x20' + Number(_0x1736b4['camera']["focalLength"])["toFixed"](0x1) + 'mm</span>\x0a\x20\x20\x20\x20\x20\x20' + renderDirectorCameraKeyEditor(_0x1736b4) + "\n      " + _0x187299 + "\n      <button type=\"button\" data-storyboard-3d-action=\"timeline-delete-keyframe\">删除关键帧</button>\n    </footer>";
  }
  const _0x24fa2b = _0x4a2835['property'] === "rotation";
  return "<footer class=\"storyboard-3d-timeline-key-editor\" data-selected-object-id=\"" + escapeHtml(_0x4a2835['objectId']) + "\" data-selected-property=\"" + _0x4a2835['property'] + "\">\n    <strong>" + escapeHtml(_0x34c1e1?.['name'] || _0x4a2835['objectId']) + " · " + PROPERTY_LABELS[_0x4a2835["property"]] + '</strong>\x0a\x20\x20\x20\x20<span>' + _0x1736b4["time"]["toFixed"](0x2) + 's\x20·\x20' + formatFrameTime(_0x1736b4["time"], _0x358af1["fps"]) + "</span>\n    " + _0x187299 + "\n    <div class=\"storyboard-3d-timeline-key-values\">" + ['X', 'Y', 'Z']["map"]((_0x3d7094, _0xb2d1b2) => "<label><span>" + _0x3d7094 + (_0x24fa2b ? '°' : '') + "</span><input type=\"number\" step=\"" + (_0x24fa2b ? '1' : '0.01') + "\" value=\"" + (_0x24fa2b ? Number(_0x1736b4["value"][_0xb2d1b2]) * 0xb4 / Math['PI'] : Number(_0x1736b4['value'][_0xb2d1b2]))["toFixed"](_0x24fa2b ? 0x1 : 0x2) + "\" data-storyboard-3d-timeline-key-value=\"" + _0xb2d1b2 + "\"></label>")["join"]('') + "</div>\n    <label class=\"storyboard-3d-timeline-easing\"><span>缓动</span><select data-storyboard-3d-timeline-key-easing>" + [["linear", '线性'], ['ease-in', '渐入'], ["ease-out", '渐出'], ["ease-in-out", "渐入渐出"]]["map"](([_0x1fff70, _0x5215de]) => "<option value=\"" + _0x1fff70 + '\x22\x20' + (_0x1736b4['easing'] === _0x1fff70 ? 'selected' : '') + '>' + _0x5215de + '</option>')["join"]('') + "</select></label>\n    <button type=\"button\" data-storyboard-3d-action=\"timeline-delete-keyframe\">删除关键帧</button>\n  </footer>";
}
export function renderStoryboard3DShotTimeline({
  scene: _0x28c0f8,
  shot: _0x12c679,
  selectedObjectIds = [],
  activeTool = "select",
  currentTime = 0x0,
  playing = ![],
  autoKey = ![],
  expandedObjectIds = new Set(),
  activeProperties = new Map(),
  selectedKeyframe = null,
  directorPanel = '',
  editingToolbar = '',
  clipTracks = ''
} = {}) {
  if (!_0x28c0f8 || !_0x12c679) {
    return '';
  }
  const _0x4bd545 = normalizeAnimation(_0x28c0f8, _0x12c679);
  const _0x300e61 = clamp(currentTime, 0x0, _0x4bd545["duration"]);
  const _0x1c79e6 = selectedObjectIds['at'](-0x1) || '';
  const _0x231696 = (_0x28c0f8["objects"] || [])["filter"](_0x194932 => _0x194932["visible"] !== ![] && _0x194932["type"] !== "group" && _0x194932["type"] !== 'camera');
  const _0x49ed14 = _0x231696['map'](_0xca221 => renderObjectTrack({
    'object': _0xca221,
    'animation': _0x4bd545,
    'activeProperty': activeProperties["get"](_0xca221['id']) || TOOL_PROPERTIES[activeTool] || "position",
    'expanded': expandedObjectIds["has"](_0xca221['id']),
    'selected': _0xca221['id'] === _0x1c79e6,
    'selectedKeyframe': selectedKeyframe
  }))["join"]('');
  const _0x1c0833 = _0x4bd545["duration"] > 0x0 ? _0x300e61 / _0x4bd545["duration"] * 0x64 : 0x0;
  const _0x51f4b1 = Math["round"](_0x4bd545["duration"] * _0x4bd545["fps"]);
  return '<section\x20class=\x22storyboard-3d-shot-timeline\x20' + (playing ? "is-playing" : '') + "\" data-storyboard-3d-shot-timeline data-shot-id=\"" + escapeHtml(_0x12c679['id']) + '\x22\x20style=\x22--storyboard-3d-playhead-position:' + _0x1c0833 + "%\">\n    <header class=\"storyboard-3d-timeline-toolbar\">\n      <div class=\"storyboard-3d-timeline-playback\">\n        <button type=\"button\" data-storyboard-3d-action=\"timeline-go-start\">首帧</button>\n        <button type=\"button\" class=\"storyboard-3d-timeline-play\" data-storyboard-3d-action=\"timeline-toggle-play\">" + (playing ? '暂停' : '播放') + "</button>\n        <button type=\"button\" data-storyboard-3d-action=\"timeline-go-end\">末帧</button>\n      </div>\n      <output data-storyboard-3d-timeline-frame>" + Math["round"](_0x300e61 * _0x4bd545["fps"]) + 'f</output><span>/\x20' + _0x51f4b1 + "f</span>\n      <label><span>时长</span><input type=\"number\" min=\"0.1\" max=\"3600\" step=\"0.5\" value=\"" + _0x4bd545['duration'] + "\" data-storyboard-3d-timeline-setting=\"duration\"></label>\n      <label><span>FPS</span><select data-storyboard-3d-timeline-setting=\"fps\">" + [0xc, 0x18, 0x19, 0x1e, 0x32, 0x3c]['map'](_0x32ba51 => "<option value=\"" + _0x32ba51 + '\x22\x20' + (_0x4bd545["fps"] === _0x32ba51 ? "selected" : '') + '>' + _0x32ba51 + "</option>")["join"]('') + '</select></label>\x0a\x20\x20\x20\x20\x20\x20<label\x20class=\x22storyboard-3d-timeline-auto-key\x22><input\x20type=\x22checkbox\x22\x20data-storyboard-3d-timeline-auto-key\x20' + (autoKey ? "checked" : '') + "><span>自动 K 帧</span></label>\n      <label><input type=\"checkbox\" data-storyboard-3d-timeline-setting=\"loop\" " + (_0x4bd545["loop"] ? "checked" : '') + ">循环</label>\n      <button type=\"button\" data-storyboard-3d-action=\"timeline-director-toggle\" aria-expanded=\"" + Boolean(directorPanel) + "\">导演编排</button>\n      <strong>当前镜头独立时间轴 · " + escapeHtml(_0x12c679["name"]) + "</strong>\n      <small>" + getKeyframeCount(_0x4bd545) + " 个关键帧</small>\n    </header>\n    <div class=\"storyboard-3d-timeline-grid\">" + editingToolbar + "\n      " + directorPanel + "\n      <div class=\"storyboard-3d-timeline-tracks\">\n      " + renderRuler(_0x4bd545, _0x300e61) + "\n      " + renderCameraTrack(_0x4bd545, selectedKeyframe) + "\n      " + clipTracks + "\n      " + (_0x49ed14 || '<div\x20class=\x22storyboard-3d-timeline-empty\x22>选择或添加模型后即可创建变换关键帧</div>') + '\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22storyboard-3d-timeline-playhead\x22\x20aria-hidden=\x22true\x22><span></span></div>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20' + renderSelectedKeyframeEditor(_0x4bd545, selectedKeyframe, _0x28c0f8) + "\n  </section>";
}
export class Storyboard3DShotTimelineController {
  constructor({
    windowObject = globalThis["window"],
    getProject: _0x5ea942,
    getEditorState: _0x444075,
    getRoot: _0x303c4a,
    getRuntime: _0x120e89,
    getBinaryAssetRepository: _0x203e30,
    getImportedModel: _0x215189,
    importProject: _0x8c35be,
    sendResults: _0x39ff2f,
    getGenerationContext: _0x9fc8f3,
    requestGeneration: _0x40aede,
    readCurrentCamera: _0xa97e2f,
    previewSample: _0x494925,
    clearPreview: _0x4fc2f1,
    commitMutation: _0x1fb938,
    requestRender: _0x44d9d8,
    expandDirectorPanel: _0x4eaa03,
    setMessage: _0x17ef2e
  } = {}) {
    this["window"] = windowObject;
    this["getProject"] = _0x5ea942;
    this["getEditorState"] = _0x444075;
    this["getRoot"] = _0x303c4a;
    this["getRuntime"] = _0x120e89;
    this["getBinaryAssetRepository"] = _0x203e30;
    this["getImportedModel"] = _0x215189;
    this["importProject"] = _0x8c35be;
    this["sendResults"] = _0x39ff2f;
    this["getGenerationContext"] = _0x9fc8f3;
    this["requestGeneration"] = _0x40aede;
    this["readCurrentCamera"] = _0xa97e2f;
    this["previewSample"] = _0x494925;
    this["clearPreview"] = _0x4fc2f1;
    this["commitMutation"] = _0x1fb938;
    this["requestRender"] = _0x44d9d8;
    this["expandDirectorPanel"] = _0x4eaa03;
    this["setMessage"] = _0x17ef2e;
    this["currentTimes"] = new Map();
    this["activeProperties"] = new Map();
    this['expandedObjectIds'] = new Set();
    this["selectedKeyframe"] = null;
    this['drawerOpen'] = ![];
    this["autoKey"] = ![];
    this['playing'] = ![];
    this['playbackFrame'] = null;
    this["playbackStartedAt"] = 0x0;
    this["playbackStartTime"] = 0x0;
    this["activeShotId"] = '';
    this["hasPreview"] = ![];
    this["directorPanel"] = new DirectorTimelinePanel(this);
    this["cameraPath"] = new DirectorCameraPathController(this);
    this["editing"] = new DirectorTimelineEditing(this);
    this["clips"] = new DirectorClipTimeline(this);
    this["multiView"] = new DirectorMultiView(this);
    this["keyframeDrag"] = new TimelineKeyframeDrag(this);
  }
  ['_context']() {
    const _0x453892 = this["getProject"]?.();
    const {
      scene: _0x229acb,
      shot: _0x1a7e63
    } = getSceneContext(_0x453892);
    const _0x46c10f = this["getEditorState"]?.() || {};
    return {
      'project': _0x453892,
      'scene': _0x229acb,
      'shot': _0x1a7e63,
      'editorState': _0x46c10f
    };
  }
  ['_timeForShot'](_0x5c2a02) {
    const _0x4902a9 = normalizeStoryboard3DShotAnimation(_0x5c2a02?.["animation"], {
      'camera': _0x5c2a02?.["camera"]
    });
    return clamp(this['currentTimes']["get"](_0x5c2a02?.['id']) || 0x0, 0x0, _0x4902a9["duration"]);
  }
  ["_setTime"](_0x1595b7, _0x30e246) {
    if (!_0x1595b7?.['id']) {
      return 0x0;
    }
    const _0x1b538f = normalizeStoryboard3DShotAnimation(_0x1595b7['animation'], {
      'camera': _0x1595b7["camera"]
    });
    const _0x27fc42 = clamp(_0x30e246, 0x0, _0x1b538f["duration"]);
    this['currentTimes']["set"](_0x1595b7['id'], _0x27fc42);
    return _0x27fc42;
  }
  ["_syncShot"](_0x146339) {
    const _0x3d3011 = _0x146339?.['id'] || '';
    if (_0x3d3011 === this["activeShotId"]) {
      return;
    }
    if (this["cameraPath"]["active"]) {
      this["cameraPath"]["stop"]();
    }
    this["stopPlayback"]({
      'render': ![],
      'clear': !![]
    });
    this["activeShotId"] = _0x3d3011;
    this["selectedKeyframe"] = null;
    this["hasPreview"] = ![];
  }
  ["render"]() {
    this["keyframeDrag"]['bind']();
    const {
      scene: _0xfa1325,
      shot: _0x167ab4,
      editorState: _0x2222e7
    } = this['_context']();
    if (!_0xfa1325 || !_0x167ab4) {
      return '';
    }
    this['_syncShot'](_0x167ab4);
    return renderStoryboard3DShotTimeline({
      'scene': _0xfa1325,
      'shot': _0x167ab4,
      'selectedObjectIds': _0x2222e7["selectedObjectIds"] || [],
      'activeTool': _0x2222e7["activeTool"],
      'currentTime': this['_timeForShot'](_0x167ab4),
      'playing': this['playing'],
      'autoKey': this["autoKey"],
      'expandedObjectIds': this['expandedObjectIds'],
      'activeProperties': this["activeProperties"],
      'selectedKeyframe': this["selectedKeyframe"],
      'directorPanel': this['directorPanel']["render"](),
      'editingToolbar': this["editing"]["render"](),
      'clipTracks': this["clips"]["render"](normalizeAnimation(_0xfa1325, _0x167ab4))
    });
  }
  ["_mutateAnimation"](_0x55f514, _0x138190, _0x1769a5) {
    this["commitMutation"]?.({
      'type': _0x55f514,
      'label': _0x138190,
      'mutate': _0x1ec02b => {
        const {
          scene: _0x124678,
          shot: _0x479d8f
        } = getSceneContext(_0x1ec02b);
        if (!_0x124678 || !_0x479d8f) {
          return _0x1ec02b;
        }
        _0x479d8f["animation"] = _0x1769a5(normalizeAnimation(_0x124678, _0x479d8f), {
          'scene': _0x124678,
          'shot': _0x479d8f
        });
        const _0x36239a = _0x479d8f["animation"]["cameraKeyframes"][0x0];
        _0x36239a?.["camera"] && (_0x479d8f["camera"] = cloneCameraState(_0x36239a["camera"]), syncStoryboard3DCameraObjectFromShot(_0x124678, _0x479d8f));
        _0x479d8f["updatedAt"] = Date["now"]();
        return _0x1ec02b;
      }
    });
  }
  ["_sampleAt"](_0x48e467) {
    const {
      scene: _0x2584cb,
      shot: _0x24d226
    } = this['_context']();
    if (!_0x2584cb || !_0x24d226) {
      return null;
    }
    const _0x1989e9 = this['_setTime'](_0x24d226, _0x48e467);
    const _0x31125d = sampleStoryboard3DShotAnimation(_0x24d226['animation'], _0x1989e9, {
      'camera': _0x24d226["camera"],
      'objectTransforms': createObjectTransforms(_0x2584cb),
      'objects': _0x2584cb["objects"]
    });
    this['hasPreview'] = !![];
    if (!this["cameraPath"]["preview"](_0x31125d)) {
      this["previewSample"]?.(_0x31125d);
    }
    this['_syncDisplay'](_0x1989e9, _0x24d226);
    return _0x31125d;
  }
  ['_syncDisplay'](_0x34a9d3, _0x1fa9d8) {
    const _0xe710bd = this["getRoot"]?.();
    const _0x351380 = _0xe710bd?.['querySelector']?.("[data-storyboard-3d-shot-timeline]");
    if (!_0x351380 || _0x351380["dataset"]["shotId"] !== _0x1fa9d8?.['id']) {
      return;
    }
    const _0x464b95 = normalizeStoryboard3DShotAnimation(_0x1fa9d8["animation"], {
      'camera': _0x1fa9d8["camera"]
    });
    const _0x4ff443 = _0x464b95['duration'] > 0x0 ? _0x34a9d3 / _0x464b95["duration"] * 0x64 : 0x0;
    _0x351380["style"]["setProperty"]("--storyboard-3d-playhead-position", _0x4ff443 + '%');
    const _0x237741 = _0x351380['querySelector']?.("[data-storyboard-3d-timeline-frame]");
    if (_0x237741) {
      _0x237741["textContent"] = Math["round"](_0x34a9d3 * _0x464b95["fps"]) + 'f';
    }
    const _0x22e82d = _0x351380["querySelector"]?.("[data-storyboard-3d-timeline-scrubber]");
    if (_0x22e82d) {
      _0x22e82d["value"] = String(_0x34a9d3);
    }
  }
  ['_schedulePlayback']() {
    const _0x66201b = this["window"]?.["requestAnimationFrame"]?.["bind"](this["window"]) || globalThis["requestAnimationFrame"]?.["bind"](globalThis);
    if (!_0x66201b || !this["playing"]) {
      return;
    }
    this['playbackFrame'] = _0x66201b(_0x1407a3 => {
      if (!this['playing']) {
        return;
      }
      const {
        shot: _0x2b3a45
      } = this["_context"]();
      if (!_0x2b3a45) {
        return this["stopPlayback"]();
      }
      const _0x5e8636 = normalizeStoryboard3DShotAnimation(_0x2b3a45["animation"], {
        'camera': _0x2b3a45["camera"]
      });
      const _0x24755c = Math["max"](0x0, (_0x1407a3 - this['playbackStartedAt']) / 0x3e8);
      let _0x178b03 = this['playbackStartTime'] + _0x24755c * (this["playbackRate"] || 0x1);
      if (_0x5e8636["loop"] && _0x5e8636['duration'] > 0x0) {
        _0x178b03 %= _0x5e8636['duration'];
      }
      if (!_0x5e8636["loop"] && _0x178b03 >= _0x5e8636['duration']) {
        this["_sampleAt"](_0x5e8636["duration"]);
        this["stopPlayback"]({
          'clear': ![]
        });
        return;
      }
      this["_sampleAt"](_0x178b03);
      this['_schedulePlayback']();
    });
  }
  ['startPlayback']() {
    const {
      shot: _0x5a7073
    } = this["_context"]();
    if (!_0x5a7073) {
      return ![];
    }
    const _0x18635d = normalizeStoryboard3DShotAnimation(_0x5a7073["animation"], {
      'camera': _0x5a7073['camera']
    });
    const _0x5db43a = this["_timeForShot"](_0x5a7073);
    this['playing'] = !![];
    this['playbackStartTime'] = _0x5db43a >= _0x18635d["duration"] ? 0x0 : _0x5db43a;
    this["currentTimes"]['set'](_0x5a7073['id'], this['playbackStartTime']);
    this["playbackStartedAt"] = this["window"]?.["performance"]?.["now"]?.() || globalThis["performance"]?.['now']?.() || Date["now"]();
    this["requestRender"]?.();
    this['_sampleAt'](this["playbackStartTime"]);
    this['_schedulePlayback']();
    return !![];
  }
  ["stopPlayback"]({
    render = !![],
    clear = ![]
  } = {}) {
    const _0x47f917 = this['window']?.["cancelAnimationFrame"]?.["bind"](this["window"]) || globalThis["cancelAnimationFrame"]?.["bind"](globalThis);
    if (this["playbackFrame"] != null) {
      _0x47f917?.(this['playbackFrame']);
    }
    const _0x4e0b65 = this["playing"];
    this['playbackFrame'] = null;
    this["playing"] = ![];
    clear && (this['hasPreview'] = ![], this["clearPreview"]?.());
    if (render && _0x4e0b65) {
      this["requestRender"]?.();
    }
  }
  ["togglePlayback"]() {
    if (this['playing']) {
      this['stopPlayback']({
        'clear': ![]
      });
      return !![];
    }
    return this['startPlayback']();
  }
  ["_activeProperty"](_0x1d64a0, _0x4d8117) {
    return this["activeProperties"]["get"](_0x1d64a0) || TOOL_PROPERTIES[_0x4d8117] || "position";
  }
  ["isDrawerOpen"]() {
    return this["drawerOpen"];
  }
  ["_syncDrawerPresentation"]() {
    const _0xd763ec = this["getRoot"]?.();
    const _0x499137 = _0xd763ec?.["querySelector"]?.(".storyboard-3d-viewport-column");
    const _0x4acf84 = _0xd763ec?.['querySelector']?.('.storyboard-3d-shot-dock');
    const _0xc4ec1d = _0xd763ec?.["querySelector"]?.(".storyboard-3d-shot-keyframe-trigger");
    const _0x1e001b = _0xd763ec?.["querySelector"]?.(".storyboard-3d-timeline-drawer-handle");
    const _0x4c2c96 = _0xd763ec?.['querySelector']?.('.storyboard-3d-timeline-drawer-content');
    if (!_0x499137 || !_0x4acf84 || !_0xc4ec1d || !_0x1e001b || !_0x4c2c96) {
      return ![];
    }
    const _0x197b19 = this['drawerOpen'];
    _0x499137["classList"]["toggle"]('is-timeline-open', _0x197b19);
    _0x499137['classList']["toggle"]("is-timeline-collapsed", !_0x197b19);
    _0x4acf84["classList"]['toggle']("is-timeline-open", _0x197b19);
    _0x4acf84["classList"]['toggle']("is-timeline-collapsed", !_0x197b19);
    _0xc4ec1d["classList"]["toggle"]('is-active', _0x197b19);
    _0xc4ec1d["setAttribute"]("aria-expanded", String(_0x197b19));
    _0x1e001b["classList"]["toggle"]("is-open", _0x197b19);
    _0x1e001b["setAttribute"]("aria-expanded", String(_0x197b19));
    const _0x550ea0 = _0x197b19 ? '下拉收起关键帧时间轴' : '上拉展开关键帧时间轴';
    _0x1e001b["setAttribute"]("aria-label", _0x550ea0);
    _0x4c2c96["setAttribute"]("aria-hidden", String(!_0x197b19));
    _0x4c2c96['inert'] = !_0x197b19;
    if (_0x197b19) {
      _0x4c2c96['removeAttribute']("inert");
    } else {
      _0x4c2c96["setAttribute"]("inert", '');
    }
    return !![];
  }
  ["setDrawerOpen"](_0x24796f) {
    const _0x559270 = _0x24796f === !![];
    if (_0x559270 === this["drawerOpen"]) {
      return ![];
    }
    this["drawerOpen"] = _0x559270;
    !_0x559270 && (this["directorPanel"]["mobile"]['disconnect']({
      'render': ![]
    }), this["multiView"]["destroy"](), this["cameraPath"]['stop'](), this['stopPlayback']({
      'render': ![],
      'clear': !![]
    }));
    if (!this["_syncDrawerPresentation"]()) {
      this["requestRender"]?.();
    }
    return !![];
  }
  ["handleClick"](_0x1bd511, _0x4bc6d3, _0x158b81) {
    if (!String(_0x1bd511 || '')["startsWith"]("timeline-")) {
      return ![];
    }
    if (_0x1bd511 === "timeline-select-keyframe" && this["keyframeDrag"]["consumeClick"](_0x158b81)) {
      return !![];
    }
    if (this["editing"]["handleClick"](_0x1bd511, _0x4bc6d3, _0x158b81)) {
      return !![];
    }
    if (this["clips"]["handleClick"](_0x1bd511, _0x4bc6d3, _0x158b81)) {
      return !![];
    }
    if (this["directorPanel"]['handleClick'](_0x1bd511, _0x4bc6d3, _0x158b81)) {
      return !![];
    }
    if (_0x1bd511 === 'timeline-toggle-drawer') {
      this["setDrawerOpen"](!this['drawerOpen']);
      return !![];
    }
    const {
      scene: _0xb8ad64,
      shot: _0x6f952a,
      editorState: _0x5b2000
    } = this["_context"]();
    if (!_0xb8ad64 || !_0x6f952a) {
      return !![];
    }
    if (_0x1bd511 === "timeline-toggle-play") {
      this["togglePlayback"]();
      return !![];
    }
    if (_0x1bd511 === 'timeline-go-start' || _0x1bd511 === "timeline-go-end") {
      this["stopPlayback"]({
        'render': ![],
        'clear': ![]
      });
      const _0x516e4c = normalizeAnimation(_0xb8ad64, _0x6f952a);
      this['_sampleAt'](_0x1bd511 === "timeline-go-start" ? 0x0 : _0x516e4c['duration']);
      this['requestRender']?.();
      return !![];
    }
    if (_0x1bd511 === 'timeline-toggle-object') {
      const _0xcab9f = _0x4bc6d3["dataset"]["objectId"];
      if (this["expandedObjectIds"]['has'](_0xcab9f)) {
        this['expandedObjectIds']["delete"](_0xcab9f);
      } else {
        this['expandedObjectIds']["add"](_0xcab9f);
      }
      this['requestRender']?.();
      return !![];
    }
    if (_0x1bd511 === "timeline-set-object-property") {
      const _0x4fa02f = _0x4bc6d3["dataset"]["objectId"];
      const _0x10cbec = _0x4bc6d3["dataset"]["property"];
      STORYBOARD_3D_OBJECT_ANIMATION_PROPERTIES['includes'](_0x10cbec) && (this["activeProperties"]["set"](_0x4fa02f, _0x10cbec), this["requestRender"]?.());
      return !![];
    }
    if (_0x1bd511 === "timeline-add-camera-keyframe") {
      const _0x54c321 = this['readCurrentCamera']?.();
      if (!_0x54c321) {
        this["setMessage"]?.("当前摄像机状态不可用。");
        return !![];
      }
      const _0x1fa0f2 = this["_timeForShot"](_0x6f952a);
      this["_mutateAnimation"]("add-camera-keyframe", "Add camera keyframe", _0x30fc2e => upsertStoryboard3DCameraKeyframe(_0x30fc2e, {
        'time': _0x1fa0f2,
        'camera': _0x54c321
      }));
      this["setMessage"]?.("已在 " + formatFrameTime(_0x1fa0f2, normalizeAnimation(_0xb8ad64, _0x6f952a)["fps"]) + " 添加摄像机关键帧。");
      return !![];
    }
    if (_0x1bd511 === "timeline-add-object-keyframe") {
      const _0x10476c = _0x4bc6d3["dataset"]["objectId"] || _0x5b2000["selectedObjectIds"]?.['at'](-0x1);
      const _0x2cb88b = _0x4bc6d3["dataset"]["property"] || this["_activeProperty"](_0x10476c, _0x5b2000["activeTool"]);
      const _0x5f4873 = _0xb8ad64["objects"]['find'](_0x5f2988 => _0x5f2988['id'] === _0x10476c);
      if (!_0x5f4873 || !STORYBOARD_3D_OBJECT_ANIMATION_PROPERTIES["includes"](_0x2cb88b)) {
        return !![];
      }
      const _0x5e527c = this['_timeForShot'](_0x6f952a);
      this["_mutateAnimation"]("add-object-keyframe", 'Add\x20object\x20keyframe', _0x2efef1 => upsertStoryboard3DObjectKeyframe(_0x2efef1, {
        'objectId': _0x10476c,
        'property': _0x2cb88b,
        'time': _0x5e527c,
        'transform': _0x5f4873["transform"]
      }));
      this['setMessage']?.("已为“" + _0x5f4873["name"] + '”的' + PROPERTY_LABELS[_0x2cb88b] + '添加关键帧。');
      return !![];
    }
    if (_0x1bd511 === "timeline-select-keyframe") {
      this["stopPlayback"]({
        'render': ![],
        'clear': ![]
      });
      this['selectedKeyframe'] = {
        'shotId': _0x6f952a['id'],
        'type': _0x4bc6d3["dataset"]['keyframeType'],
        'objectId': _0x4bc6d3["dataset"]["objectId"] || '',
        'property': _0x4bc6d3['dataset']["property"] || '',
        'keyframeId': _0x4bc6d3["dataset"]["keyframeId"]
      };
      this["_sampleAt"](Number(_0x4bc6d3["dataset"]["keyframeTime"]) || 0x0);
      this['requestRender']?.();
      return !![];
    }
    if (_0x1bd511 === 'timeline-copy-keyframe') {
      const _0x16c42d = this["selectedKeyframe"];
      const _0x2aa041 = this['_timeForShot'](_0x6f952a);
      this["_mutateAnimation"]('copy-animation-keyframe', "复制关键帧", _0xa2d98e => {
        const _0x5340ef = findSelectedKeyframe(_0xa2d98e, _0x16c42d);
        if (!_0x5340ef) {
          return _0xa2d98e;
        }
        return _0x16c42d["type"] === 'camera' ? upsertStoryboard3DCameraKeyframe(_0xa2d98e, {
          ..._0x5340ef["keyframe"],
          'time': _0x2aa041
        }) : upsertStoryboard3DObjectKeyframe(_0xa2d98e, {
          ..._0x16c42d,
          ..._0x5340ef["keyframe"],
          'time': _0x2aa041
        });
      });
      return !![];
    }
    if (_0x1bd511 === "timeline-delete-keyframe") {
      if (!this["selectedKeyframe"]) {
        return !![];
      }
      const _0x1a1497 = {
        ...this["selectedKeyframe"]
      };
      this["_mutateAnimation"]("delete-animation-keyframe", "Delete animation keyframe", _0x418e8f => removeStoryboard3DAnimationKeyframe(_0x418e8f, _0x1a1497));
      this["selectedKeyframe"] = null;
      return !![];
    }
    return !![];
  }
  ["handleInput"](_0xa5183d) {
    if (_0xa5183d["target"]?.["matches"]?.("[data-storyboard-3d-timeline-scrubber]")) {
      this["stopPlayback"]({
        'render': ![],
        'clear': ![]
      });
      this["_sampleAt"](Number(_0xa5183d["target"]["value"]) || 0x0);
      return !![];
    }
    return ![];
  }
  ["handleChange"](_0x71cb8f) {
    if (this['editing']["handleChange"](_0x71cb8f)) {
      return !![];
    }
    if (this["directorPanel"]["handleChange"](_0x71cb8f)) {
      return !![];
    }
    const {
      scene: _0x44c8c2,
      shot: _0x403f9e
    } = this["_context"]();
    if (!_0x44c8c2 || !_0x403f9e) {
      return ![];
    }
    if (_0x71cb8f['target']?.["matches"]?.('[data-storyboard-3d-timeline-auto-key]')) {
      this['autoKey'] = _0x71cb8f["target"]["checked"] === !![];
      this["requestRender"]?.();
      return !![];
    }
    if (_0x71cb8f["target"]?.["matches"]?.('[data-storyboard-3d-timeline-setting]')) {
      const _0x46fc73 = _0x71cb8f['target']["dataset"]["storyboard3dTimelineSetting"];
      const _0x5f5376 = _0x46fc73 === "loop" ? _0x71cb8f["target"]["checked"] : Number(_0x71cb8f["target"]['value']);
      this["_mutateAnimation"]('update-animation-settings', 'Update\x20animation\x20settings', _0x181381 => updateStoryboard3DShotAnimationSettings(_0x181381, {
        [_0x46fc73]: _0x5f5376
      }));
      return !![];
    }
    if (_0x71cb8f["target"]?.["matches"]?.('[data-storyboard-3d-timeline-key-time]')) {
      const _0x389e8d = Number(_0x71cb8f['target']["value"]);
      if (!Number["isFinite"](_0x389e8d)) {
        return !![];
      }
      this["_mutateAnimation"]("move-animation-keyframe", "移动关键帧", _0x244bf8 => {
        const _0x3e66b8 = findSelectedKeyframe(_0x244bf8, this["selectedKeyframe"]);
        if (!_0x3e66b8) {
          return _0x244bf8;
        }
        const _0x447191 = Math['max'](0x0, Math["min"](0xe10, Math["round"](_0x389e8d * _0x244bf8['fps']) / _0x244bf8["fps"]));
        const _0x3e017a = _0x3e66b8["type"] === "camera" ? _0x244bf8["cameraKeyframes"] : _0x244bf8["objectTracks"]["find"](_0x2316e9 => _0x2316e9["objectId"] === _0x3e66b8["objectId"])?.[_0x3e66b8['property'] + "Keyframes"];
        if (_0x3e017a['some'](_0x50620e => _0x50620e['id'] !== _0x3e66b8["keyframe"]['id'] && Math["abs"](_0x50620e["time"] - _0x447191) < 0.5 / _0x244bf8["fps"])) {
          this["setMessage"]?.('该帧已有关键帧，请选择其他时间。');
          return _0x244bf8;
        }
        _0x3e66b8["keyframe"]["time"] = _0x447191;
        return normalizeStoryboard3DShotAnimation(_0x244bf8);
      });
      return !![];
    }
    if (_0x71cb8f["target"]?.["matches"]?.("[data-storyboard-3d-timeline-key-value]")) {
      const _0x5a2224 = this['selectedKeyframe'];
      if (!_0x5a2224 || _0x5a2224["type"] !== "object") {
        return !![];
      }
      const _0x34179a = Number(_0x71cb8f["target"]["dataset"]["storyboard3dTimelineKeyValue"]);
      const _0x8404d1 = Number(_0x71cb8f['target']['value']);
      const _0x10ff1b = _0x5a2224["property"] === "rotation" ? _0x8404d1 * Math['PI'] / 0xb4 : _0x8404d1;
      this["_mutateAnimation"]("update-animation-keyframe", "Update animation keyframe", _0x1439a0 => {
        const _0x3a92b8 = _0x1439a0["objectTracks"]["find"](_0x3be48a => _0x3be48a["objectId"] === _0x5a2224['objectId']);
        const _0x413412 = _0x3a92b8?.[_0x5a2224["property"] + "Keyframes"]?.["find"](_0x4ccca3 => _0x4ccca3['id'] === _0x5a2224['keyframeId']);
        _0x413412 && _0x34179a >= 0x0 && _0x34179a < 0x3 && Number["isFinite"](_0x10ff1b) && (_0x413412['value'][_0x34179a] = _0x10ff1b);
        return normalizeStoryboard3DShotAnimation(_0x1439a0);
      });
      return !![];
    }
    if (_0x71cb8f["target"]?.["matches"]?.("[data-storyboard-3d-timeline-key-easing]")) {
      const _0x32b0d0 = this['selectedKeyframe'];
      if (!_0x32b0d0 || _0x32b0d0["type"] !== 'object') {
        return !![];
      }
      const _0x3bef29 = String(_0x71cb8f['target']["value"] || "ease-in-out");
      this["_mutateAnimation"]("update-animation-easing", 'Update\x20animation\x20easing', _0x4176c6 => {
        const _0x3f274b = _0x4176c6["objectTracks"]["find"](_0x54d4fa => _0x54d4fa["objectId"] === _0x32b0d0["objectId"]);
        const _0x14f781 = _0x3f274b?.[_0x32b0d0["property"] + "Keyframes"]?.["find"](_0x111f0f => _0x111f0f['id'] === _0x32b0d0["keyframeId"]);
        if (_0x14f781) {
          _0x14f781["easing"] = _0x3bef29;
        }
        return normalizeStoryboard3DShotAnimation(_0x4176c6);
      });
      return !![];
    }
    return ![];
  }
  ["isAutoKeyEnabled"]() {
    return this["autoKey"];
  }
  ['recordCameraKeyframe'](_0x5d9b40) {
    if (!this["autoKey"] || !_0x5d9b40) {
      return ![];
    }
    const {
      shot: _0x45c694
    } = this["_context"]();
    if (!_0x45c694) {
      return ![];
    }
    const _0x585acf = this["_timeForShot"](_0x45c694);
    this['_mutateAnimation']("auto-key-camera", 'Auto\x20key\x20camera', _0x1a41be => upsertStoryboard3DCameraKeyframe(_0x1a41be, {
      'time': _0x585acf,
      'camera': _0x5d9b40
    }));
    return !![];
  }
  ['recordObjectTransforms'](_0x34a81e, _0x48863e) {
    if (!this['autoKey']) {
      return ![];
    }
    const {
      scene: _0x50642c,
      shot: _0x1307aa
    } = this["_context"]();
    if (!_0x50642c || !_0x1307aa) {
      return ![];
    }
    const _0x29190a = TOOL_PROPERTIES[_0x48863e] || 'position';
    const _0x431759 = this["_timeForShot"](_0x1307aa);
    this["_mutateAnimation"]("auto-key-objects", "Auto key objects", _0x187996 => {
      let _0x5e8376 = _0x187996;
      Object["entries"](_0x34a81e || {})["forEach"](([_0xf43dce, _0x11e681]) => {
        _0x5e8376 = upsertStoryboard3DObjectKeyframe(_0x5e8376, {
          'objectId': _0xf43dce,
          'property': _0x29190a,
          'time': _0x431759,
          'transform': _0x11e681
        });
      });
      return _0x5e8376;
    });
    return !![];
  }
  ["getPreviewTransform"](_0x5120e8) {
    if (!this['hasPreview']) {
      return null;
    }
    const {
      scene: _0x219d2f,
      shot: _0x3b309b
    } = this["_context"]();
    if (!_0x219d2f || !_0x3b309b) {
      return null;
    }
    return sampleStoryboard3DShotAnimation(_0x3b309b["animation"], this["_timeForShot"](_0x3b309b), {
      'camera': _0x3b309b["camera"],
      'objectTransforms': createObjectTransforms(_0x219d2f)
    })['objectTransforms'][_0x5120e8] || null;
  }
  ['syncPreview']() {
    this["editing"]['sync']();
    this["clips"]["bind"]();
    this["cameraPath"]["sync"]();
    if (this["directorPanel"]["mobile"]["pairing"]) {
      this["directorPanel"]["mobile"]["sync"]();
      return;
    }
    if (!this['hasPreview'] || this["playing"]) {
      return;
    }
    const {
      shot: _0x5125fa
    } = this["_context"]();
    if (_0x5125fa) {
      this['_sampleAt'](this["_timeForShot"](_0x5125fa));
    }
  }
  ["destroy"]() {
    this["multiView"]["destroy"]();
    this["editing"]["destroy"]();
    this["clips"]["destroy"]();
    this["cameraPath"]['destroy']();
    this["keyframeDrag"]['destroy']();
    this["directorPanel"]["destroy"]();
    this["stopPlayback"]({
      'render': ![],
      'clear': !![]
    });
    this["currentTimes"]["clear"]();
    this["activeProperties"]["clear"]();
    this["expandedObjectIds"]["clear"]();
    this['selectedKeyframe'] = null;
    this["drawerOpen"] = ![];
  }
}
export function createStoryboard3DShotTimelineController(_0x20175f) {
  return new Storyboard3DShotTimelineController(_0x20175f);
}