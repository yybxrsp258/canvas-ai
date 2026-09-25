import { getModelsByKind } from '../../manifests/index.js';
import { escapeNodeMenuHtml, renderNodeModelMenu, renderNodeModelTrigger } from '../shared/nodeModelMenu.js';
import { renderComfyUiCloudWorkflowLogoHtml, renderComfyUiLocalWorkflowLogoHtml, renderComfyUiWorkflowLogoHtmlFromIconKind } from '../shared/customAiAppLogo.js';
import { t } from '../../i18n/index.js';
import { buildModelProviderProfileBadgesHtml } from '../shared/modelProviderProfileControl.js';
function audioModelMenuText(_0x218ba9, _0x521926 = {}) {
  return t("audioModelMenu." + _0x218ba9, _0x521926);
}
function isSavedRhAiAppManifest(_0x32c752) {
  return Boolean(String(_0x32c752?.["extensions"]?.["rhAiApp"]?.["appKey"] || '')["trim"]());
}
function isSavedComfyUiWorkflowManifest(_0x41ef0e) {
  return Boolean(String(_0x41ef0e?.["extensions"]?.["comfyUiWorkflow"]?.["appKey"] || '')["trim"]());
}
function buildComfyUiAudioWorkflowIconHtml(_0x189d87) {
  return renderComfyUiWorkflowLogoHtmlFromIconKind(_0x189d87, {
    'className': "node-menu-icon"
  });
}
function getCustomProviderMeta(_0x323544) {
  const _0x12e3f1 = _0x323544?.["extensions"]?.["customProvider"];
  return _0x12e3f1 && typeof _0x12e3f1 === "object" ? _0x12e3f1 : null;
}
function buildCustomProviderAudioLogoHtml(_0x32331f = {}, _0x77b7c = 'node-menu-icon') {
  const _0x57da7b = String(_0x32331f?.["badge"] || 'CP')["trim"]()['slice'](0x0, 0x2) || 'CP';
  return "<div class=\"" + escapeNodeMenuHtml(_0x77b7c) + " node-menu-icon-badge\">" + escapeNodeMenuHtml(_0x57da7b) + "</div>";
}
function getAudioMenuIconHtml(_0x381a66 = {}) {
  const _0x2ede92 = String(_0x381a66?.['iconKind'] || '')["trim"]();
  if (_0x2ede92 === "comfyUiCloudWorkflowBadge" || _0x2ede92 === "comfyUiLocalWorkflowBadge") {
    return buildComfyUiAudioWorkflowIconHtml(_0x2ede92);
  }
  if (_0x2ede92 === "customProviderBadge") {
    return buildCustomProviderAudioLogoHtml(_0x381a66);
  }
  return '';
}
function getAudioMenuMeta(_0x9d7d7) {
  if (_0x9d7d7?.["extensions"]?.["rhAiApp"] && !isSavedRhAiAppManifest(_0x9d7d7)) {
    return null;
  }
  if (_0x9d7d7?.["extensions"]?.["comfyUiWorkflow"] && !isSavedComfyUiWorkflowManifest(_0x9d7d7)) {
    return null;
  }
  const _0x287711 = _0x9d7d7?.["extensions"]?.["audioMenu"];
  if (_0x287711 && typeof _0x287711 === "object") {
    return _0x9d7d7?.["extensions"]?.["rhAiApp"] ? {
      ..._0x287711,
      'group': 'rhAiApp'
    } : _0x287711;
  }
  if (_0x9d7d7?.["extensions"]?.["rhAiApp"]) {
    return {
      'group': "rhAiApp",
      'order': 0x3e7
    };
  }
  return null;
}
const AUDIO_MENU_GROUP_CONFIG = Object['freeze']({
  'rhAiApp': Object['freeze']({
    'id': "rhAiApp",
    'label': "RH AI应用",
    'subtitle': "自定义 RunningHub AI App",
    'icon': "images/RH.png",
    'iconAlt': "runninghub",
    'order': 0x5
  }),
  'comfyUiCloudWorkflow': Object["freeze"]({
    'id': "comfyUiCloudWorkflow",
    'label': "云端工作流",
    'subtitle': "保存的 ComfyUI 云端工作流",
    'iconHtml': renderComfyUiCloudWorkflowLogoHtml({
      'className': "node-menu-icon"
    }),
    'order': 0x6
  }),
  'comfyUiLocalWorkflow': Object['freeze']({
    'id': "comfyUiLocalWorkflow",
    'label': "本地工作流",
    'subtitle': "保存的 ComfyUI 本地工作流",
    'iconHtml': renderComfyUiLocalWorkflowLogoHtml({
      'className': "node-menu-icon"
    }),
    'order': 0x7
  }),
  'runninghubWorkflow': Object["freeze"]({
    'id': "runninghub",
    'labelKey': 'runninghub.label',
    'subtitleKey': "runninghub.subtitle",
    'icon': 'images/RH.png',
    'iconAlt': "runninghub",
    'order': 0xa
  }),
  'runninghubModel': Object['freeze']({
    'id': "runninghubModel",
    'label': "RunningHub模型",
    'subtitle': '语音合成\x20·\x20音乐创作\x20·\x20声音克隆',
    'icon': "images/RH.png",
    'iconAlt': "runninghub",
    'order': 0xf
  }),
  'volcengineSpeech': Object["freeze"]({
    'id': 'volcengineSpeech',
    'label': '火山语音',
    'subtitle': "豆包语音大模型",
    'icon': "images/volcengine.svg",
    'iconAlt': 'volcengine-speech',
    'order': 0x14
  })
});
function getGroupConfig(_0xcd19ed) {
  const _0x4f32b4 = String(_0xcd19ed || '')["trim"]();
  if (AUDIO_MENU_GROUP_CONFIG[_0x4f32b4]) {
    return AUDIO_MENU_GROUP_CONFIG[_0x4f32b4];
  }
  return Object["freeze"]({
    'id': _0x4f32b4 || "other",
    'label': _0x4f32b4 || '其他',
    'subtitle': '',
    'icon': "images/RH.png",
    'iconAlt': _0x4f32b4 || '',
    'order': 0x64
  });
}
function isAudioModelMenuManifest(_0x1e1447) {
  const _0x1a406d = getAudioMenuMeta(_0x1e1447);
  if (!_0x1a406d?.["group"]) {
    return ![];
  }
  if (!_0x1e1447?.["provider"]) {
    return ![];
  }
  if (_0x1e1447?.["kind"] !== "audio") {
    return ![];
  }
  const _0x498a7d = Array["isArray"](_0x1e1447?.["uiPlacement"]) ? _0x1e1447["uiPlacement"] : ["modelMenu"];
  return !(_0x498a7d["includes"]("toolbar") && !_0x498a7d["includes"]("modelMenu"));
}
export function getAudioWorkflowMenuManifests() {
  return getModelsByKind('audio')["filter"](isAudioModelMenuManifest)['sort']((_0x244b9c, _0x414731) => {
    const _0x228fa = Number(getGroupConfig(getAudioMenuMeta(_0x244b9c)?.['group'])?.["order"]);
    const _0x17248f = Number(getGroupConfig(getAudioMenuMeta(_0x414731)?.["group"])?.["order"]);
    const _0x11d435 = Number["isFinite"](_0x228fa) ? _0x228fa : 0x0;
    const _0x1d62a8 = Number["isFinite"](_0x17248f) ? _0x17248f : 0x0;
    if (_0x11d435 !== _0x1d62a8) {
      return _0x11d435 - _0x1d62a8;
    }
    const _0x311492 = Number(getAudioMenuMeta(_0x244b9c)?.['order']);
    const _0x3d645b = Number(getAudioMenuMeta(_0x414731)?.["order"]);
    const _0x4ec388 = Number["isFinite"](_0x311492) ? _0x311492 : 0x0;
    const _0x37d939 = Number["isFinite"](_0x3d645b) ? _0x3d645b : 0x0;
    if (_0x4ec388 !== _0x37d939) {
      return _0x4ec388 - _0x37d939;
    }
    return String(_0x244b9c["modelId"] || '')["localeCompare"](String(_0x414731["modelId"] || ''));
  });
}
function getGroupLabel(_0x1647d1) {
  if (_0x1647d1["labelKey"]) {
    return audioModelMenuText(_0x1647d1["labelKey"]);
  }
  return _0x1647d1['label'] || _0x1647d1['id'];
}
function getGroupSubtitle(_0x36aae2) {
  if (_0x36aae2["subtitleKey"]) {
    return audioModelMenuText(_0x36aae2["subtitleKey"]);
  }
  return _0x36aae2["subtitle"] || '';
}
export function buildAudioWorkflowItems(_0x57ad46 = {}) {
  return getAudioWorkflowMenuManifests()["map"](_0x1eb557 => {
    const _0x5694f8 = getAudioMenuMeta(_0x1eb557) || {};
    const _0xef1bd = getCustomProviderMeta(_0x1eb557);
    const _0x4496dd = getAudioMenuIconHtml({
      ..._0x5694f8,
      ...(_0xef1bd?.["badge"] ? {
        'badge': _0xef1bd["badge"]
      } : {})
    });
    return Object['freeze']({
      'key': _0x1eb557['modelId'],
      'label': _0x5694f8["label"] || _0x1eb557["displayName"],
      'subtitle': _0x5694f8["subtitle"] || _0x1eb557["description"] || '',
      'icon': _0x5694f8["icon"] || _0x1eb557["icon"] || "images/RH.png",
      'iconAlt': _0x5694f8["iconAlt"] || (_0x1eb557["provider"] === "runninghubwf" ? 'runninghub' : _0x1eb557["provider"] || ''),
      'iconHtml': _0x4496dd,
      'provider': _0x1eb557["provider"] || '',
      'providerDisplayName': _0xef1bd?.["displayName"] || '',
      'providerBadge': _0xef1bd?.["badge"] || '',
      'adapterType': _0x1eb557["adapterType"] || '',
      'executionId': _0x1eb557["executionId"] || '',
      'async': _0x1eb557["async"] === !![],
      'cancellable': _0x1eb557['cancellable'] === !![],
      'vip': _0x1eb557["vip"] === !![],
      'group': _0x5694f8['group'] || '',
      'validate': _0x57ad46[_0x1eb557["modelId"]] || (() => '')
    });
  });
}
function groupWorkflowItems(_0x500ed8 = []) {
  const _0x320c4a = new Map();
  _0x500ed8['forEach'](_0x2f6f17 => {
    const _0x203719 = String(_0x2f6f17?.["group"] || "runninghubWorkflow");
    const _0x3ce555 = getGroupConfig(_0x203719);
    const _0x461502 = !AUDIO_MENU_GROUP_CONFIG[_0x203719] && String(_0x2f6f17?.["providerDisplayName"] || '')["trim"]();
    !_0x320c4a["has"](_0x3ce555['id']) && _0x320c4a["set"](_0x3ce555['id'], {
      ..._0x3ce555,
      'label': _0x461502 ? _0x2f6f17["providerDisplayName"] : getGroupLabel(_0x3ce555),
      'subtitle': _0x461502 ? "Custom provider" : getGroupSubtitle(_0x3ce555),
      'iconHtml': _0x461502 ? buildCustomProviderAudioLogoHtml({
        'badge': _0x2f6f17["providerBadge"] || 'CP'
      }) : _0x3ce555["iconHtml"],
      'icon': _0x461502 ? undefined : _0x3ce555["icon"],
      'iconAlt': _0x461502 ? '' : _0x3ce555['iconAlt'],
      'order': _0x461502 ? 0x1e : _0x3ce555["order"],
      'items': []
    });
    _0x320c4a["get"](_0x3ce555['id'])['items']["push"]({
      'modelId': _0x2f6f17["key"],
      'provider': _0x2f6f17["provider"] || '',
      'label': _0x2f6f17["label"],
      'subtitle': _0x2f6f17["subtitle"],
      'iconHtml': _0x2f6f17["iconHtml"] || undefined,
      'icon': _0x2f6f17["icon"] || _0x3ce555["icon"],
      'iconAlt': _0x2f6f17["iconAlt"] || _0x3ce555["iconAlt"],
      'vip': _0x2f6f17['vip'] === !![],
      'badgeHtml': buildModelProviderProfileBadgesHtml(_0x2f6f17["key"], {
        'vip': _0x2f6f17["vip"] === !![]
      })
    });
  });
  return Array["from"](_0x320c4a['values']())['sort']((_0x2be58b, _0xfcc2a4) => {
    const _0x51a98b = Number(_0x2be58b["order"]);
    const _0x4e6488 = Number(_0xfcc2a4["order"]);
    return (Number["isFinite"](_0x51a98b) ? _0x51a98b : 0x0) - (Number["isFinite"](_0x4e6488) ? _0x4e6488 : 0x0);
  });
}
export function buildAudioWorkflowMenuGroups(_0xbb6abd = []) {
  return groupWorkflowItems(_0xbb6abd);
}
export function buildAudioModelMenuHtml({
  activeModel = '',
  workflowItems = []
} = {}) {
  return renderNodeModelMenu({
    'kind': "audio",
    'activeModel': activeModel,
    'groups': groupWorkflowItems(workflowItems)
  });
}
export function buildAudioModelTriggerHtml({
  label = '',
  activeProvider = '',
  icon = '',
  iconAlt = '',
  iconHtml = ''
} = {}) {
  const _0x11432e = String(activeProvider || '')["trim"]();
  const _0x5eb19e = String(icon || '')["trim"]() || (_0x11432e === "volcengine-speech" ? "images/volcengine.svg" : 'images/RH.png');
  const _0x1b9cf7 = String(iconAlt || '')["trim"]() || (_0x11432e === "volcengine-speech" ? 'volcengine-speech' : 'runninghub');
  const _0x2b57e7 = String(iconHtml || '')["trim"]() || '<img\x20src=\x22' + escapeNodeMenuHtml(_0x5eb19e) + '\x22\x20style=\x22width:14px;height:14px;object-fit:contain;border-radius:3px;flex-shrink:0;\x22\x20alt=\x22' + escapeNodeMenuHtml(_0x1b9cf7) + '\x22>';
  return renderNodeModelTrigger({
    'iconHtml': _0x2b57e7,
    'label': label
  });
}