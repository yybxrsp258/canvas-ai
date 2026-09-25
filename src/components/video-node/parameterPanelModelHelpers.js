import { getModelManifest, getModelsByKind } from '../../manifests/index.js';
import { APIMART_DREAMINA_VIDEO_DEFAULT_MODEL, resolveDreaminaStyleVideoProvider, isApimartDreaminaVideoModel } from '../../modules/dreaminaVideoModelHelper.js';
import { renderNodeMenuItem } from '../shared/nodeModelMenu.js';
import { renderComfyUiCloudWorkflowLogoHtml, renderComfyUiLocalWorkflowLogoHtml, renderComfyUiWorkflowLogoHtmlFromIconKind } from '../shared/customAiAppLogo.js';
import { translateManifestText } from '../../i18n/manifestText.js';
import { buildModelProviderProfileBadgesHtml } from '../shared/modelProviderProfileControl.js';
export const RH_VIDEO_RESOLUTION_OPTIONS = Object["freeze"]([0x340, 0x400, 0x500, 0x5a0, 0x640, 0x6e0, 0x780]);
const RH_STANDARD_FPS_OPTIONS = Object['freeze']([0x10, 0x18]);
const RH_V54_FPS_OPTIONS = Object["freeze"]([0x10, 0x18, 0x1e]);
const RH_MIN_VIDEO_RESOLUTION = 0x340;
export function escapeHtml(_0x227bf9) {
  return String(_0x227bf9 || '')["replace"](/&/g, "&amp;")["replace"](/</g, "&lt;")["replace"](/>/g, "&gt;")["replace"](/"/g, "&quot;")["replace"](/'/g, "&#39;");
}
function isAllowedVideoModel(_0x193af5, _0x12b871 = []) {
  const _0x4e36ed = (Array['isArray'](_0x12b871) ? _0x12b871 : [])['map'](_0x37a51c => String(_0x37a51c || '')["trim"]())["filter"](Boolean);
  return !_0x4e36ed["length"] || _0x4e36ed['includes'](String(_0x193af5 || '')["trim"]());
}
export function buildRunningHubVideoWorkflowMenuItems(_0x342cf4, {
  allowedModelIds = []
} = {}) {
  const _0x1e468b = getModelsByKind('video')["filter"](_0x31bb73 => _0x31bb73?.['provider'] === "runninghubwf" && _0x31bb73?.["adapterType"] === "workflow" && _0x31bb73?.["extensions"]?.["rhAiApp"] === undefined && isAllowedVideoModel(_0x31bb73?.["modelId"], allowedModelIds) && !(_0x31bb73?.['uiPlacement']?.["includes"]("toolbar") && !_0x31bb73?.["uiPlacement"]?.["includes"]("modelMenu")));
  return _0x1e468b["map"](_0x17cc47 => {
    return renderNodeMenuItem({
      'modelId': _0x17cc47["modelId"],
      'provider': _0x17cc47['provider'] || "runninghubwf",
      'label': _0x17cc47["displayName"],
      'description': _0x17cc47["description"] || '',
      'icon': _0x17cc47["icon"] || 'images/RH.png',
      'iconAlt': 'runninghub',
      'vip': _0x17cc47['vip'] === !![]
    }, {
      'activeModel': _0x342cf4
    });
  })['join']('');
}
export function buildRhAiAppVideoMenuItems(_0x11e699, {
  allowedModelIds = []
} = {}) {
  const _0x20d146 = getModelsByKind("video")['filter'](_0x5bddf4 => _0x5bddf4?.["provider"] === 'runninghubwf' && _0x5bddf4?.["adapterType"] === "workflow" && _0x5bddf4?.['extensions']?.["rhAiApp"] !== undefined && String(_0x5bddf4?.["extensions"]?.["rhAiApp"]?.["appKey"] || '')['trim']() && isAllowedVideoModel(_0x5bddf4?.["modelId"], allowedModelIds) && !(_0x5bddf4?.["uiPlacement"]?.["includes"]("toolbar") && !_0x5bddf4?.["uiPlacement"]?.['includes']('modelMenu')))['sort']((_0x402f00, _0x6fa6d4) => Number(getManifestVideoMenu(_0x402f00)?.["order"] || 0x0) - Number(getManifestVideoMenu(_0x6fa6d4)?.["order"] || 0x0));
  return _0x20d146['map'](_0x4d962b => {
    const _0x4ba686 = getManifestVideoMenu(_0x4d962b);
    return renderNodeMenuItem({
      'modelId': _0x4d962b["modelId"],
      'provider': _0x4d962b["provider"] || "runninghubwf",
      'label': _0x4ba686?.["label"] || _0x4d962b["displayName"],
      'description': _0x4ba686?.["subtitle"] || _0x4d962b["description"] || '',
      'icon': _0x4d962b["icon"] || "images/RH.png",
      'iconAlt': 'runninghub',
      'vip': _0x4d962b["vip"] === !![]
    }, {
      'activeModel': _0x11e699
    });
  })['join']('');
}
export function buildRunningHubVideoModelApiMenuItems(_0x40070f, {
  allowedModelIds = []
} = {}) {
  const _0x17f467 = getModelsByKind("video")["filter"](_0x324ab7 => {
    if (_0x324ab7?.["provider"] !== "runninghub") {
      return ![];
    }
    if (_0x324ab7?.['adapterType'] !== "modelApi") {
      return ![];
    }
    if (!isAllowedVideoModel(_0x324ab7?.['modelId'], allowedModelIds)) {
      return ![];
    }
    if (_0x324ab7?.["uiPlacement"]?.["includes"]("toolbar") && !_0x324ab7?.['uiPlacement']?.['includes']("modelMenu")) {
      return ![];
    }
    return getManifestVideoMenu(_0x324ab7)?.['role'] === "runninghubModel";
  })["sort"]((_0x538d19, _0x1c579f) => Number(getManifestVideoMenu(_0x538d19)?.["order"] || 0x0) - Number(getManifestVideoMenu(_0x1c579f)?.["order"] || 0x0));
  return _0x17f467["map"](_0x599b4d => renderNodeMenuItem({
    'modelId': _0x599b4d["modelId"],
    'provider': _0x599b4d["provider"] || 'runninghub',
    'label': getManifestVideoMenu(_0x599b4d)?.["label"] || _0x599b4d["displayName"],
    'description': getManifestVideoMenu(_0x599b4d)?.['subtitle'] || _0x599b4d["description"] || '',
    'icon': _0x599b4d["icon"] || "images/RH.png",
    'iconAlt': "runninghub",
    'vip': _0x599b4d["vip"] === !![],
    'badgeHtml': buildModelProviderProfileBadgesHtml(_0x599b4d, {
      'vip': _0x599b4d['vip'] === !![]
    })
  }, {
    'activeModel': _0x40070f
  }))["join"]('');
}
export function getDefaultRunningHubVideoWorkflowModelId() {
  return getModelsByKind("video")["find"](_0x169807 => _0x169807?.['provider'] === "runninghubwf" && _0x169807?.["adapterType"] === 'workflow' && !(_0x169807?.["uiPlacement"]?.["includes"]("toolbar") && !_0x169807?.["uiPlacement"]?.["includes"]('modelMenu')))?.["modelId"] || '';
}
export function buildApimartVideoLogoHTML(_0x35f213 = 0x14) {
  const _0x3d0eee = Number(_0x35f213) || 0x14;
  const _0x2d96f2 = _0x3d0eee <= 0xc ? "node-menu-icon-small" : "node-menu-icon";
  return "<div class=\"" + _0x2d96f2 + " node-menu-icon-badge node-menu-icon-apimart\">AM</div>";
}
export function buildMinimaxVideoLogoHTML(_0x2b267c = 0x14) {
  const _0x456c34 = Number(_0x2b267c) || 0x14;
  const _0x467f5b = _0x456c34 <= 0xc ? "node-menu-icon-small" : "node-menu-icon";
  return "<img src=\"images/minimax-logo.avif\" class=\"" + _0x467f5b + '\x22\x20alt=\x22MiniMAX\x22>';
}
export function buildAgnesVideoLogoHTML(_0x443da7 = 0x14) {
  const _0x5ac289 = Number(_0x443da7) || 0x14;
  const _0x46cfc0 = _0x5ac289 <= 0xc ? "node-menu-icon-small" : "node-menu-icon";
  return "<div class=\"" + _0x46cfc0 + " node-menu-icon-badge node-menu-icon-badge-dark\">AG</div>";
}
export function buildBinghuoVideoLogoHTML(_0x48d4b6 = 0x14) {
  const _0x3e8ff2 = Number(_0x48d4b6) || 0x14;
  const _0x20d860 = _0x3e8ff2 <= 0xc ? "node-menu-icon-small" : "node-menu-icon";
  return "<div class=\"" + _0x20d860 + " node-menu-icon-badge\">BH</div>";
}
export function buildDreaminaVideoLogoHTML(_0x67b5e8 = 0x14) {
  const _0x20d0fd = Number(_0x67b5e8) || 0x14;
  if (_0x20d0fd <= 0xc) {
    return "<img src=\"images/jimeng.png\" class=\"image-model-trigger-icon image-model-trigger-icon-dreamina\" alt=\"dreamina\">";
  }
  return '<img\x20src=\x22images/jimeng.png\x22\x20class=\x22node-menu-icon\x22\x20alt=\x22dreamina\x22>';
}
export function buildVolcengineVideoLogoHTML(_0x52ebbd = 0x14) {
  const _0x16b1c7 = Number(_0x52ebbd) || 0x14;
  const _0x6c132d = _0x16b1c7 <= 0xc ? "node-menu-icon-small" : "node-menu-icon";
  return "<img src=\"images/volcengine.svg\" class=\"" + _0x6c132d + '\x22\x20alt=\x22volcengine\x22>';
}
function getManifestVideoMenu(_0x37fdf3) {
  return _0x37fdf3?.["extensions"]?.['videoMenu'] || null;
}
function getCustomProviderMeta(_0x22cbc6) {
  const _0x2fffaa = _0x22cbc6?.["extensions"]?.["customProvider"];
  return _0x2fffaa && typeof _0x2fffaa === "object" ? _0x2fffaa : null;
}
export function buildCustomProviderVideoLogoHTML(_0xc91d0d = {}, _0x1a04c8 = 0x14) {
  const _0x3774ac = _0xc91d0d?.["extensions"] ? getCustomProviderMeta(_0xc91d0d) : _0xc91d0d;
  const _0x4a51da = String(_0x3774ac?.['badge'] || 'CP')["trim"]()['slice'](0x0, 0x2) || 'CP';
  const _0x495e40 = Number(_0x1a04c8) || 0x14;
  const _0x4ed23a = _0x495e40 <= 0xc ? 'node-menu-icon-small' : "node-menu-icon";
  return "<div class=\"" + _0x4ed23a + " node-menu-icon-badge\">" + escapeHtml(_0x4a51da) + "</div>";
}
function getComfyUiVideoWorkflowLogoClassName(_0x502031 = 0x14) {
  const _0x5affbc = Number(_0x502031) || 0x14;
  return _0x5affbc <= 0xc ? "node-menu-icon-small" : "node-menu-icon";
}
export function buildComfyUiCloudVideoLogoHTML(_0x19736f = 0x14) {
  return renderComfyUiCloudWorkflowLogoHtml({
    'className': getComfyUiVideoWorkflowLogoClassName(_0x19736f)
  });
}
export function buildComfyUiLocalVideoLogoHTML(_0x1366fa = 0x14) {
  return renderComfyUiLocalWorkflowLogoHtml({
    'className': getComfyUiVideoWorkflowLogoClassName(_0x1366fa)
  });
}
export function getComfyUiVideoWorkflowIconHtml(_0x51c06b = {}, _0x5acbb9 = 0x14) {
  const _0x4451d6 = String(_0x51c06b?.["iconKind"] || '')["trim"]();
  return renderComfyUiWorkflowLogoHtmlFromIconKind(_0x4451d6, {
    'className': getComfyUiVideoWorkflowLogoClassName(_0x5acbb9)
  });
}
function buildComfyUiVideoWorkflowMenuItems(_0x469d91, _0x2ac369) {
  const _0x516a27 = String(_0x2ac369 || '')["trim"]();
  return getModelsByKind('video')["filter"](_0x1077ae => {
    const _0x442531 = getManifestVideoMenu(_0x1077ae);
    return _0x1077ae?.['provider'] === 'comfyui' && _0x1077ae?.["adapterType"] === "workflow" && String(_0x1077ae?.["extensions"]?.["comfyUiWorkflow"]?.['appKey'] || '')['trim']() && _0x442531?.["group"] === _0x516a27 && !(_0x1077ae?.['uiPlacement']?.["includes"]('toolbar') && !_0x1077ae?.["uiPlacement"]?.['includes']("modelMenu"));
  })['sort']((_0x23df33, _0x14780a) => Number(getManifestVideoMenu(_0x23df33)?.["order"] || 0x0) - Number(getManifestVideoMenu(_0x14780a)?.["order"] || 0x0))["map"](_0x397919 => {
    const _0x37f389 = getManifestVideoMenu(_0x397919);
    return renderNodeMenuItem({
      'modelId': _0x397919["modelId"],
      'provider': _0x397919['provider'] || "comfyui",
      'label': _0x37f389?.['label'] || _0x397919["displayName"],
      'description': _0x37f389?.["subtitle"] || _0x397919["description"] || '',
      'iconHtml': getComfyUiVideoWorkflowIconHtml(_0x37f389),
      'vip': _0x397919['vip'] === !![]
    }, {
      'activeModel': _0x469d91
    });
  })["join"]('');
}
export function buildComfyUiCloudVideoWorkflowMenuItems(_0x2d6b86) {
  return buildComfyUiVideoWorkflowMenuItems(_0x2d6b86, "comfyUiCloudWorkflow");
}
export function buildComfyUiLocalVideoWorkflowMenuItems(_0x46da0d) {
  return buildComfyUiVideoWorkflowMenuItems(_0x46da0d, "comfyUiLocalWorkflow");
}
export function buildComfyUiVideoWorkflowMenuGroups(_0xf61d5) {
  const _0x4e583c = buildComfyUiCloudVideoWorkflowMenuItems(_0xf61d5);
  const _0x153228 = buildComfyUiLocalVideoWorkflowMenuItems(_0xf61d5);
  return [...(_0x4e583c ? [{
    'id': "comfyui-cloud-workflow",
    'headerClass': 'comfyui-cloud-workflow-group-header',
    'submenuClass': "comfyui-cloud-workflow-submenu",
    'toggleAttr': 'data-comfyui-cloud-workflow-toggle',
    'label': '云端工作流',
    'subtitle': "保存的 ComfyUI 云端工作流",
    'iconHtml': buildComfyUiCloudVideoLogoHTML(),
    'itemsHtml': _0x4e583c
  }] : []), ...(_0x153228 ? [{
    'id': "comfyui-local-workflow",
    'headerClass': "comfyui-local-workflow-group-header",
    'submenuClass': 'comfyui-local-workflow-submenu',
    'toggleAttr': "data-comfyui-local-workflow-toggle",
    'label': "本地工作流",
    'subtitle': "保存的 ComfyUI 本地工作流",
    'iconHtml': buildComfyUiLocalVideoLogoHTML(),
    'itemsHtml': _0x153228
  }] : [])];
}
export function buildCustomProviderVideoMenuGroups(_0x43d4ae) {
  const _0x5893c8 = new Map();
  getModelsByKind('video')['forEach'](_0xacaeb9 => {
    const _0x4638d6 = getManifestVideoMenu(_0xacaeb9);
    const _0x391411 = getCustomProviderMeta(_0xacaeb9);
    if (!_0x4638d6 || !_0x391411) {
      return;
    }
    if (_0x4638d6['role'] && _0x4638d6["role"] !== 'customProviderModel') {
      return;
    }
    const _0x3ffbed = String(_0xacaeb9?.['provider'] || _0x4638d6['group'] || '')["trim"]();
    if (!_0x3ffbed) {
      return;
    }
    !_0x5893c8["has"](_0x3ffbed) && _0x5893c8["set"](_0x3ffbed, {
      'providerId': _0x3ffbed,
      'displayName': _0x391411["displayName"] || _0x3ffbed,
      'subtitle': _0x4638d6["subtitle"] || 'Custom\x20provider',
      'badge': _0x391411["badge"] || _0x4638d6["badge"] || 'CP',
      'items': []
    });
    _0x5893c8["get"](_0x3ffbed)["items"]['push'](_0xacaeb9);
  });
  return Array["from"](_0x5893c8["values"]())["map"](_0x1e79e6 => {
    const _0x408b5e = _0x1e79e6['providerId']["replace"](/[^A-Za-z0-9_-]/g, '-');
    const _0xbeb9ae = {
      'badge': _0x1e79e6["badge"]
    };
    return {
      'id': "custom-provider-video-" + _0x408b5e,
      'headerClass': "custom-provider-video-group-header custom-provider-video-group-" + _0x408b5e,
      'submenuClass': 'custom-provider-video-submenu-' + _0x408b5e,
      'toggleAttr': "data-custom-provider-video-toggle",
      'label': _0x1e79e6['displayName'],
      'subtitle': _0x1e79e6["subtitle"],
      'iconHtml': buildCustomProviderVideoLogoHTML(_0xbeb9ae),
      'itemsHtml': _0x1e79e6['items']["sort"]((_0x28def9, _0x627a0f) => Number(getManifestVideoMenu(_0x28def9)?.['order'] || 0x0) - Number(getManifestVideoMenu(_0x627a0f)?.["order"] || 0x0))["map"](_0x80478a => {
        const _0x516046 = getManifestVideoMenu(_0x80478a);
        return renderNodeMenuItem({
          'modelId': _0x80478a['modelId'],
          'provider': _0x80478a["provider"],
          'label': _0x516046?.["label"] || _0x80478a["displayName"],
          'description': _0x516046?.["subtitle"] || _0x80478a['description'] || '',
          'iconHtml': buildCustomProviderVideoLogoHTML(_0x80478a),
          'vip': _0x80478a["vip"] === !![]
        }, {
          'activeModel': _0x43d4ae
        });
      })["join"]('')
    };
  });
}
function getManifestDreaminaStyleVideo(_0x24e8bd) {
  return _0x24e8bd?.["extensions"]?.["dreaminaStyleVideo"] || null;
}
function getVideoManifestByMenuRole(_0x4fcb48) {
  return getModelsByKind("video")["filter"](_0x33e207 => getManifestVideoMenu(_0x33e207)?.['role'] === _0x4fcb48)["sort"]((_0x1638a0, _0x383440) => Number(getManifestVideoMenu(_0x1638a0)?.['order'] || 0x0) - Number(getManifestVideoMenu(_0x383440)?.['order'] || 0x0))[0x0] || null;
}
function getApimartVideoModelMenuManifests() {
  return getModelsByKind('video')["filter"](_0x2f5a70 => {
    if (_0x2f5a70?.["provider"] !== "apimart") {
      return ![];
    }
    if (_0x2f5a70?.["adapterType"] !== "modelApi") {
      return ![];
    }
    return getManifestVideoMenu(_0x2f5a70)?.["role"] === "apimartModel";
  })['sort']((_0x253cb9, _0x45b4b6) => Number(getManifestVideoMenu(_0x253cb9)?.["order"] || 0x0) - Number(getManifestVideoMenu(_0x45b4b6)?.['order'] || 0x0));
}
function getMinimaxVideoModelMenuManifests() {
  return getModelsByKind("video")["filter"](_0x222b6c => {
    if (_0x222b6c?.["provider"] !== 'minimax') {
      return ![];
    }
    if (_0x222b6c?.["adapterType"] !== "modelApi") {
      return ![];
    }
    return getManifestVideoMenu(_0x222b6c)?.['role'] === "minimaxOfficialModel";
  })["sort"]((_0x2aa271, _0x1f51cb) => Number(getManifestVideoMenu(_0x2aa271)?.["order"] || 0x0) - Number(getManifestVideoMenu(_0x1f51cb)?.["order"] || 0x0));
}
function getAgnesVideoModelMenuManifests() {
  return getModelsByKind("video")["filter"](_0x23c2ab => {
    if (_0x23c2ab?.['provider'] !== 'agnes') {
      return ![];
    }
    if (_0x23c2ab?.["adapterType"] !== 'modelApi') {
      return ![];
    }
    return getManifestVideoMenu(_0x23c2ab)?.["role"] === "agnesModel";
  })["sort"]((_0xe96683, _0x438f46) => Number(getManifestVideoMenu(_0xe96683)?.['order'] || 0x0) - Number(getManifestVideoMenu(_0x438f46)?.["order"] || 0x0));
}
function getBinghuoVideoModelMenuManifests() {
  return getModelsByKind('video')["filter"](_0x5adfe4 => {
    if (_0x5adfe4?.['provider'] !== 'binghuo') {
      return ![];
    }
    if (_0x5adfe4?.['adapterType'] !== "modelApi") {
      return ![];
    }
    return getManifestVideoMenu(_0x5adfe4)?.["role"] === 'binghuoModel';
  })["sort"]((_0x25b421, _0x204165) => Number(getManifestVideoMenu(_0x25b421)?.["order"] || 0x0) - Number(getManifestVideoMenu(_0x204165)?.['order'] || 0x0));
}
export function getDreaminaTaskModelMenuItems(_0x353ac1, _0x53af97 = "dreamina", {
  allowedModelIds = []
} = {}) {
  const _0x37b473 = String(_0x53af97 || "dreamina")["trim"]()['toLowerCase']();
  const _0x27e95a = String(_0x353ac1 || '')['trim']();
  const _0x6336b0 = new Set((Array["isArray"](allowedModelIds) ? allowedModelIds : [])["map"](_0x4714ee => String(_0x4714ee || '')["trim"]())["filter"](Boolean));
  return getModelsByKind("video")['filter'](_0x189099 => {
    if (_0x189099?.["provider"] !== _0x37b473) {
      return ![];
    }
    if (_0x6336b0["size"] > 0x0 && !_0x6336b0['has'](String(_0x189099?.["modelId"] || '')["trim"]())) {
      return ![];
    }
    const _0x47e7c6 = getManifestDreaminaStyleVideo(_0x189099);
    if (!_0x47e7c6) {
      return ![];
    }
    return Array["isArray"](_0x47e7c6["taskTypes"]) && _0x47e7c6['taskTypes']["includes"](_0x27e95a);
  })["sort"]((_0x43be3e, _0x23045d) => Number(getManifestDreaminaStyleVideo(_0x43be3e)?.["order"] || 0x0) - Number(getManifestDreaminaStyleVideo(_0x23045d)?.['order'] || 0x0))["map"](_0x1e0cfa => {
    const _0x32607a = getManifestDreaminaStyleVideo(_0x1e0cfa);
    return {
      'model': _0x1e0cfa["modelId"],
      'title': translateManifestText(_0x32607a["title"] || _0x1e0cfa['displayName'] || _0x1e0cfa["modelId"]),
      'subtitle': translateManifestText(_0x32607a['subtitleByTaskType']?.[_0x27e95a] || _0x32607a["subtitle"] || _0x1e0cfa["description"] || '')
    };
  });
}
export function getDreaminaTaskModelMenuMeta(_0x4a5d9f, _0x55cc28 = '') {
  const _0x340087 = getModelManifest(_0x4a5d9f);
  const _0x2f048b = resolveDreaminaStyleVideoProvider(_0x4a5d9f, _0x55cc28);
  if (!_0x340087 || _0x340087["provider"] !== _0x2f048b) {
    return null;
  }
  const _0x1fc947 = getManifestDreaminaStyleVideo(_0x340087);
  if (!_0x1fc947) {
    return null;
  }
  return {
    'title': translateManifestText(_0x1fc947["title"] || _0x340087["displayName"] || _0x340087["modelId"]),
    'subtitle': translateManifestText(_0x1fc947['subtitle'] || _0x340087["description"] || '')
  };
}
export function buildDreaminaOfficialVideoMenuItems() {
  const _0x69a489 = getVideoManifestByMenuRole("dreaminaOfficial");
  const _0x5ec48c = getManifestVideoMenu(_0x69a489);
  if (!_0x69a489 || !_0x5ec48c) {
    return [];
  }
  return [{
    'modelId': _0x69a489["modelId"],
    'provider': _0x69a489["provider"],
    'label': _0x5ec48c['label'] || _0x69a489['displayName'],
    'subtitle': _0x5ec48c["subtitle"] || _0x69a489["description"] || '',
    'iconHtml': buildDreaminaVideoLogoHTML(0x14),
    'vip': ![]
  }];
}
export function buildVolcengineOfficialVideoMenuItems(_0x2b0316 = '', _0xb9b51 = '') {
  const _0x164f6b = getVideoManifestByMenuRole('volcengineOfficial');
  const _0x57627f = getManifestVideoMenu(_0x164f6b);
  if (!_0x164f6b || !_0x57627f) {
    return [];
  }
  const _0x389053 = resolveDreaminaStyleVideoProvider(_0x2b0316, _0xb9b51);
  const _0x3af732 = getModelManifest(_0x2b0316);
  return [{
    'modelId': _0x164f6b["modelId"],
    'provider': _0x164f6b['provider'],
    'label': _0x57627f['label'] || _0x164f6b["displayName"],
    'subtitle': _0x57627f["subtitle"] || _0x164f6b['description'] || '',
    'iconHtml': buildVolcengineVideoLogoHTML(0x14),
    'active': _0x389053 === "volcengine" && !!_0x3af732?.["extensions"]?.['dreaminaStyleVideo'],
    'vip': _0x164f6b["vip"] === !![]
  }];
}
export function buildApimartVideoMenuItemsHtml(_0x513e6f, _0x464d2a, {
  allowedModelIds = []
} = {}) {
  const _0xf8ff6b = getVideoManifestByMenuRole("apimartDreaminaEntry");
  const _0x2ac237 = getManifestVideoMenu(_0xf8ff6b);
  const _0x1fb653 = _0xf8ff6b?.['modelId'] || APIMART_DREAMINA_VIDEO_DEFAULT_MODEL;
  const _0x29b57f = (Array["isArray"](allowedModelIds) ? allowedModelIds : [])["map"](_0x28c5fc => String(_0x28c5fc || '')["trim"]())['filter'](Boolean);
  const _0x5719c8 = !_0x29b57f["length"] || _0x29b57f["some"](_0x23faf => {
    const _0x822f1 = getModelManifest(_0x23faf);
    return _0x822f1?.["provider"] === "apimart" && !!_0x822f1?.["extensions"]?.["dreaminaStyleVideo"];
  });
  return [...(_0x5719c8 ? [renderNodeMenuItem({
    'modelId': _0x1fb653,
    'provider': "apimart",
    'label': _0x2ac237?.['label'] || "即梦视频",
    'description': _0x2ac237?.["subtitle"] || '',
    'iconHtml': buildDreaminaVideoLogoHTML(0x14),
    'active': isApimartDreaminaVideoModel(_0x513e6f, _0x464d2a),
    'attrs': {
      'data-apimart-jimeng': '1'
    }
  })] : []), ...getApimartVideoModelMenuManifests()["filter"](_0x5301f8 => isAllowedVideoModel(_0x5301f8?.["modelId"], _0x29b57f))["map"](_0xe8d6f4 => {
    const _0x55aa44 = getManifestVideoMenu(_0xe8d6f4);
    return renderNodeMenuItem({
      'modelId': _0xe8d6f4["modelId"],
      'provider': "apimart",
      'label': _0xe8d6f4['displayName'],
      'description': _0x55aa44?.["disabledValue"] ? _0xe8d6f4["description"] || '' : _0x55aa44?.['subtitle'] || _0xe8d6f4["description"] || '',
      'iconHtml': buildApimartVideoLogoHTML(0x14),
      'vip': _0xe8d6f4["vip"] === !![],
      'attrs': {
        'data-apimart-video-model': '1'
      }
    }, {
      'activeModel': _0x513e6f
    });
  })]["join"]('');
}
export function buildMinimaxVideoMenuItemsHtml(_0x4015ca) {
  return getMinimaxVideoModelMenuManifests()["map"](_0x1ef8b8 => {
    const _0x3afa17 = getManifestVideoMenu(_0x1ef8b8);
    return renderNodeMenuItem({
      'modelId': _0x1ef8b8['modelId'],
      'provider': "minimax",
      'label': _0x3afa17?.["label"] || _0x1ef8b8['displayName'],
      'description': _0x3afa17?.["subtitle"] || _0x1ef8b8["description"] || '',
      'iconHtml': buildMinimaxVideoLogoHTML(0x14),
      'badgeHtml': buildModelProviderProfileBadgesHtml(_0x1ef8b8)
    }, {
      'activeModel': _0x4015ca
    });
  })["join"]('');
}
export function buildAgnesVideoMenuItemsHtml(_0x21b514) {
  return getAgnesVideoModelMenuManifests()["map"](_0x4becf8 => {
    const _0x4242ba = getManifestVideoMenu(_0x4becf8);
    return renderNodeMenuItem({
      'modelId': _0x4becf8["modelId"],
      'provider': "agnes",
      'label': _0x4242ba?.["label"] || _0x4becf8["displayName"],
      'description': _0x4242ba?.["subtitle"] || _0x4becf8["description"] || '',
      'iconHtml': buildAgnesVideoLogoHTML(0x14),
      'vip': _0x4becf8["vip"] === !![],
      'badgeHtml': buildModelProviderProfileBadgesHtml(_0x4becf8, {
        'vip': _0x4becf8["vip"] === !![]
      })
    }, {
      'activeModel': _0x21b514
    });
  })["join"]('');
}
export function buildBinghuoVideoMenuItemsHtml(_0xf86c8d) {
  return getBinghuoVideoModelMenuManifests()["map"](_0x363644 => {
    const _0x3a1a84 = getManifestVideoMenu(_0x363644);
    return renderNodeMenuItem({
      'modelId': _0x363644['modelId'],
      'provider': 'binghuo',
      'label': _0x3a1a84?.['label'] || _0x363644["displayName"],
      'priceText': _0x3a1a84?.["priceText"] || '',
      'description': _0x3a1a84?.["subtitle"] || _0x363644["description"] || '',
      'iconHtml': buildBinghuoVideoLogoHTML(0x14),
      'disabled': _0x3a1a84?.["disabled"] === !![]
    }, {
      'activeModel': _0xf86c8d
    });
  })["join"]('');
}
export function buildDreaminaTaskModelMenuHtml(_0x4cae87, _0x1ae053, _0x3b9b82 = 'dreamina', _0x53acad = {}) {
  const _0x2cf277 = resolveDreaminaStyleVideoProvider(_0x4cae87, _0x3b9b82);
  const _0x4bd4eb = getDreaminaTaskModelMenuItems(_0x1ae053, _0x2cf277, _0x53acad);
  const _0x503d91 = _0x2cf277 === 'apimart' ? buildApimartVideoLogoHTML(0x14) : _0x2cf277 === "volcengine" ? buildVolcengineVideoLogoHTML(0x14) : "<img src=\"images/jimeng.png\" class=\"node-menu-icon\" alt=\"dreamina\">";
  if (!_0x4bd4eb["length"]) {
    return renderNodeMenuItem({
      'label': "智能多帧",
      'description': "暂未开放模型切换",
      'iconHtml': _0x503d91,
      'disabled': !![]
    });
  }
  return _0x4bd4eb["map"](_0xcf2a39 => renderNodeMenuItem({
    'modelId': _0xcf2a39["model"],
    'provider': _0x2cf277,
    'label': _0xcf2a39['title'],
    'description': _0xcf2a39['subtitle'],
    'iconHtml': _0x503d91,
    'active': _0x4cae87 === _0xcf2a39['model'],
    'attrs': {
      'data-dreamina-task-model': '1'
    }
  }))["join"]('');
}
export function getRhV54FpsOptions() {
  return RH_V54_FPS_OPTIONS;
}
export function normalizeRhStandardFps(_0x42ad43) {
  const _0xba9f81 = Number(_0x42ad43);
  return RH_STANDARD_FPS_OPTIONS["includes"](_0xba9f81) ? _0xba9f81 : 0x18;
}
export function normalizeRhV54Fps(_0x5ea08e) {
  const _0x425f9b = Number(_0x5ea08e);
  return getRhV54FpsOptions()["includes"](_0x425f9b) ? _0x425f9b : 0x18;
}
export function normalizeRhVideoResolution(_0x307372) {
  const _0x4435a6 = Number(_0x307372);
  return Number["isFinite"](_0x4435a6) ? Math['max'](RH_MIN_VIDEO_RESOLUTION, Math["trunc"](_0x4435a6)) : RH_MIN_VIDEO_RESOLUTION;
}
export function arePlainObjectsEqual(_0x1ee908, _0x49d70b) {
  return JSON["stringify"](_0x1ee908 || {}) === JSON['stringify'](_0x49d70b || {});
}