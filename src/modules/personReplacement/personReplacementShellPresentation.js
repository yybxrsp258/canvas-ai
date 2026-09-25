import { localPathToUrl } from '../../utils/localMediaPath.js';
import { getWorkspaceProjectHomeEntries, renderWorkspaceProjectCard, renderWorkspaceProjectSortControl } from '../workspaceProjectHome.js';
import { SMART_CLIP_FPS_OPTIONS } from '../../services/smartClipJobService.js';
import { t } from '../../i18n/index.js';
import { getPersonReplacementCharacterBaseImageRef } from './personReplacementProject.js';
import { getPersonReplacementProjectTaskSummary, isPersonReplacementSourceProcessing } from './personReplacementProjectSession.js';
import { PERSON_REPLACEMENT_STEPS, getPersonReplacementStepCompletion, getPersonReplacementStepGate } from './personReplacementWorkflow.js';
import { REPLACEMENT_STUDIO_NAME } from './replacementStudioTerminology.js';
function escapeHtml(_0x82af75) {
  return String(_0x82af75 ?? '')["replaceAll"]('&', '&amp;')["replaceAll"]('<', "&lt;")["replaceAll"]('>', "&gt;")["replaceAll"]('\x22', "&quot;")["replaceAll"]('\x27', "&#39;");
}
function normalizeText(_0x4d07a5, _0xb5813d = '') {
  const _0x7f022f = String(_0x4d07a5 ?? '')["trim"]();
  return _0x7f022f || _0xb5813d;
}
function normalizeMediaUrl(_0x597749) {
  const _0xe0502b = normalizeText(_0x597749);
  return _0xe0502b ? localPathToUrl(_0xe0502b) || _0xe0502b : '';
}
function clamp(_0x1126ca, _0x387b6e, _0x5a6826, _0x58ffba = _0x387b6e) {
  const _0x269b1d = Number(_0x1126ca);
  if (!Number["isFinite"](_0x269b1d)) {
    return _0x58ffba;
  }
  return Math["max"](_0x387b6e, Math["min"](_0x5a6826, _0x269b1d));
}
function renderVideoIcon() {
  return "<svg class=\"person-replacement-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"14\" height=\"14\" rx=\"3\"/><path d=\"m17 10 4-2v8l-4-2\"/></svg>";
}
function smartClipPanelText(_0x38eab2, _0x5577e9 = {}) {
  return t("videoClip.smartPanel." + _0x38eab2, _0x5577e9);
}
function renderSmartClipSettingLabel(_0x394d3a, _0x1e3a76) {
  return "<span class=\"person-replacement-smart-clip-setting-label\">" + escapeHtml(_0x394d3a) + "<span class=\"rh-tip\" data-tooltip=\"" + escapeHtml(_0x1e3a76) + "\" aria-label=\"" + escapeHtml(_0x1e3a76) + "\">!</span></span>";
}
function renderSmartClipModeOptions(_0x53b4e5) {
  const _0x169a2f = [["stable", smartClipPanelText("modeStable")], ['balanced', smartClipPanelText("modeBalanced")], ['sensitive', smartClipPanelText("modeSensitive")]];
  return _0x169a2f["map"](([_0x2e8545, _0x541c88]) => '<button\x20type=\x22button\x22\x20class=\x22person-replacement-smart-clip-option\x20' + (_0x53b4e5 === _0x2e8545 ? "is-active" : '') + "\" data-person-replacement-action=\"set-smart-clip-mode\" data-smart-clip-mode=\"" + _0x2e8545 + "\" aria-pressed=\"" + (_0x53b4e5 === _0x2e8545) + '\x22>' + escapeHtml(_0x541c88) + "</button>")["join"]('');
}
function renderSmartClipSettingsPanel(_0x407229) {
  const _0x33bb37 = _0x407229["settings"]["smartClipMode"];
  const _0x4b96f5 = _0x407229["settings"]["smartClipFps"];
  return "<div class=\"person-replacement-smart-clip-settings-panel\" role=\"dialog\" aria-label=\"" + escapeHtml(smartClipPanelText("title")) + '\x22>\x0a\x20\x20\x20\x20<strong\x20class=\x22person-replacement-smart-clip-settings-title\x22>' + escapeHtml(smartClipPanelText("title")) + "</strong>\n    <div class=\"person-replacement-smart-clip-setting-row\">\n      " + renderSmartClipSettingLabel(smartClipPanelText("mode"), smartClipPanelText("modeTip")) + "\n      <div class=\"person-replacement-smart-clip-option-group\" role=\"group\" aria-label=\"" + escapeHtml(smartClipPanelText("mode")) + "\">\n        " + renderSmartClipModeOptions(_0x33bb37) + "\n      </div>\n    </div>\n    <div class=\"person-replacement-smart-clip-setting-row\">\n      " + renderSmartClipSettingLabel(smartClipPanelText("fps"), smartClipPanelText("fpsTip")) + "\n      <div class=\"person-replacement-smart-clip-option-group\" role=\"group\" aria-label=\"" + escapeHtml(smartClipPanelText('fps')) + "\">\n        " + SMART_CLIP_FPS_OPTIONS["map"](_0x470eab => "<button type=\"button\" class=\"person-replacement-smart-clip-option person-replacement-smart-clip-fps-option " + (_0x4b96f5 === _0x470eab ? "is-active" : '') + "\" data-person-replacement-action=\"set-smart-clip-fps\" data-smart-clip-fps=\"" + _0x470eab + "\" aria-pressed=\"" + (_0x4b96f5 === _0x470eab) + '\x22>' + escapeHtml(smartClipPanelText("fpsValue", {
    'fps': _0x470eab
  })) + "</button>")["join"]('') + "\n      </div>\n    </div>\n    <p class=\"person-replacement-smart-clip-settings-hint\">" + escapeHtml(smartClipPanelText('hintDefault')) + "</p>\n  </div>";
}
function renderSmartClipSettings(_0x494d1d) {
  const _0x73c66f = _0x494d1d["workspace"]["smartClipSettingsOpen"] === !![];
  return '<div\x20class=\x22person-replacement-smart-clip-settings\x22\x20data-person-replacement-smart-clip-settings>\x0a\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-secondary-button\x20person-replacement-settings-trigger\x20' + (_0x73c66f ? "is-active" : '') + "\" data-person-replacement-action=\"toggle-smart-clip-settings\" aria-haspopup=\"dialog\" aria-expanded=\"" + _0x73c66f + "\">设置</button>\n    " + (_0x73c66f ? renderSmartClipSettingsPanel(_0x494d1d) : '') + '\x0a\x20\x20</div>';
}
function renderStepNavigation(_0x3ab8c3) {
  const _0x3bd2f6 = getPersonReplacementStepCompletion(_0x3ab8c3);
  return "<nav class=\"story-step-navigation person-replacement-story-steps\" data-active-step=\"" + _0x3ab8c3['workspace']["step"] + '\x22\x20aria-label=\x22人物替换流程\x22>\x0a\x20\x20\x20\x20' + PERSON_REPLACEMENT_STEPS["map"](_0x2376b6 => {
    const _0x58be20 = getPersonReplacementStepGate(_0x3ab8c3, _0x2376b6['id'], _0x3bd2f6);
    const _0x268931 = ['story-step', _0x3ab8c3["workspace"]['step'] === _0x2376b6['id'] ? "is-active" : '', _0x58be20["allowed"] ? '' : "is-locked"]["filter"](Boolean)["join"]('\x20');
    return "<button type=\"button\" class=\"" + _0x268931 + "\" data-person-replacement-action=\"select-step\" data-person-replacement-step=\"" + _0x2376b6['id'] + "\" aria-current=\"" + (_0x3ab8c3["workspace"]["step"] === _0x2376b6['id'] ? "step" : "false") + "\" aria-keyshortcuts=\"" + _0x2376b6['id'] + "\" aria-disabled=\"" + !_0x58be20['allowed'] + '\x22' + (_0x58be20["allowed"] ? '' : '\x20title=\x22' + escapeHtml(_0x58be20["message"]) + '\x22') + '><span>' + _0x2376b6['id'] + '</span>' + escapeHtml(_0x2376b6["label"]) + "</button>";
  })["join"]('') + '\x0a\x20\x20</nav>';
}
function getStepGuidance(_0x248044, _0x545961) {
  const _0x4f1386 = Math["trunc"](clamp(_0x248044['workspace']?.["step"], 0x1, 0x5, 0x1));
  const _0x370253 = getPersonReplacementStepCompletion(_0x248044);
  const _0x105bd1 = (Array['isArray'](_0x248044["characters"]) ? _0x248044["characters"] : [])["filter"](_0x169b43 => getPersonReplacementCharacterBaseImageRef(_0x169b43))["length"];
  const _0x10f649 = (Array["isArray"](_0x248044["scenes"]) ? _0x248044["scenes"] : [])["filter"](_0x2cb663 => getPersonReplacementCharacterBaseImageRef(_0x2cb663))["length"];
  const _0xb8334c = _0x105bd1 + _0x10f649;
  const _0x319230 = Array["isArray"](_0x248044["shots"]) ? _0x248044['shots'] : [];
  const _0x165594 = _0x319230['filter'](_0x583926 => normalizeText(_0x583926?.["resultVideoRef"]))["length"];
  const _0x12d09d = Math["max"](0x0, Math["trunc"](Number(_0x545961(_0x248044)) || 0x0));
  const _0x11a5f8 = Boolean(normalizeText(_0x248044["audio"]?.["replacementAudioRef"]));
  const _0x2d8816 = Boolean(_0x248044["output"]?.["originalMasterRef"] && (_0x248044["output"]?.['finalVideoRef'] || _0x248044["output"]?.['visualMasterRef']));
  const _0x4cde6b = _0x248044["output"]?.['composeStatus'] === 'succeeded' && _0x2d8816;
  const _0x135ca2 = _0x2d8816 && !_0x4cde6b;
  if (_0x4f1386 === 0x1) {
    return _0x370253["assetSettingsComplete"] ? {
      'title': "替换素材已应用",
      'detail': "已应用 " + _0xb8334c + " 个替换素材，可以继续进入图像替换"
    } : {
      'title': "请添加人物或场景素材",
      'detail': '至少添加\x201\x20个人物或场景素材，才能进入图像替换'
    };
  }
  if (_0x4f1386 === 0x2) {
    return _0x370253["imageReplacementComplete"] ? {
      'title': '图像替换输入已应用',
      'detail': '可以继续生成替换图，或进入视频替换'
    } : {
      'title': "请绑定替换人物或场景",
      'detail': "可先进入视频替换；添加人物或场景绑定后才能继续声音克隆"
    };
  }
  if (_0x4f1386 === 0x3) {
    if (!_0x370253["imageReplacementComplete"]) {
      return {
        'title': "请绑定替换人物或场景",
        'detail': "至少绑定 1 个人物或场景，才能进入声音克隆"
      };
    }
    if (_0x165594 > 0x0) {
      return {
        'title': "替换视频已生成",
        'detail': '已生成\x20' + _0x165594 + '/' + _0x319230["length"] + '\x20个片段，可以继续进入声音克隆'
      };
    }
    return {
      'title': '视频替换已就绪',
      'detail': '可以生成替换视频，也可以继续进入声音克隆'
    };
  }
  if (_0x4f1386 === 0x4) {
    if (_0x11a5f8) {
      return {
        'title': "替换音轨已应用",
        'detail': '可以继续进入合成视频，检查并生成最终视频'
      };
    }
    if (_0x12d09d > 0x0) {
      return {
        'title': "声音参考已应用",
        'detail': '已应用\x20' + _0x12d09d + " 个声音参考，可以继续克隆声音或进入合成视频"
      };
    }
    return {
      'title': '可添加声音参考',
      'detail': '上传人物声音参考后可克隆音轨，也可以直接进入合成视频'
    };
  }
  if (_0x135ca2) {
    return {
      'title': "旧合成视频仍可查看",
      'detail': "图像或片段已更新，重新生成对应替换视频后再合成"
    };
  }
  if (_0x4cde6b) {
    return {
      'title': '完整画面已就绪',
      'detail': "可以切换原声或替换声预览，导出时再封装当前音轨"
    };
  }
  if (_0x165594 > 0x0) {
    return {
      'title': "替换片段可以合成",
      'detail': "已有 " + _0x165594 + '/' + _0x319230["length"] + '\x20个片段可用于合成'
    };
  }
  return {
    'title': '请先生成替换视频',
    'detail': "返回视频替换生成至少一个片段后，即可创建合成预览"
  };
}
function getCurrentCanvasSyncMenuCopy(_0x1007fb) {
  const _0x259450 = Math['trunc'](Number(_0x1007fb) || 0x1);
  const _0x1b94ab = {
    0x1: ["同步素材设定到画布", '同步当前人物素材与分组'],
    0x2: ['同步图像替换到画布', '同步当前关键帧、素材、提示词与替换结果图'],
    0x3: ["同步视频替换到画布", "同步当前原视频、替换图与替换视频"],
    0x4: ["同步声音克隆到画布", "同步当前原音频、参考音频与替换音频"],
    0x5: ["同步所有片段到画布", '按镜头顺序同步已有的替换视频片段']
  };
  const [_0x57217d, _0x334be7] = _0x1b94ab[_0x259450] || _0x1b94ab[0x5];
  return {
    'label': _0x57217d,
    'detail': _0x334be7
  };
}
function renderProjectToolbarActions(_0x3e0cfe, _0x16f4de = {}) {
  const _0x1e737b = _0x3e0cfe["workspace"]["step"] === 0x5;
  const _0x86f031 = getCurrentCanvasSyncMenuCopy(_0x3e0cfe['workspace']["step"]);
  const _0x90b4ef = _0x16f4de["canvasSyncPending"] === !![];
  const _0x3aa101 = _0x16f4de["exportOutputPending"] === !![];
  const _0xe63531 = '<div\x20class=\x22story-canvas-sync-menu-wrap' + (_0x90b4ef ? " is-loading" : '') + "\" data-person-replacement-output-menu=\"canvas\" data-person-replacement-canvas-sync-pending=\"" + _0x90b4ef + "\">\n    <button type=\"button\" class=\"story-workbench-action-button story-canvas-sync-trigger story-menu-trigger" + (_0x90b4ef ? '\x20is-loading' : '') + "\" data-person-replacement-action=\"toggle-output-menu\" data-person-replacement-output-menu-trigger=\"canvas\" aria-haspopup=\"menu\" aria-expanded=\"false\" aria-busy=\"" + _0x90b4ef + '\x22' + (_0x90b4ef ? " disabled" : '') + ">\n      " + (_0x90b4ef ? '<span\x20class=\x22storyboard-script-loading-spinner\x20person-replacement-canvas-sync-spinner\x22\x20aria-hidden=\x22true\x22></span>' : '') + "<span>" + (_0x90b4ef ? '加入中…' : '加入画布') + "</span>" + (_0x90b4ef ? '' : "<span class=\"story-canvas-sync-chevron\" aria-hidden=\"true\"></span>") + '\x0a\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20<div\x20class=\x22story-canvas-sync-menu\x22\x20role=\x22menu\x22\x20aria-label=\x22同步人物替换项目到画布\x22\x20aria-hidden=\x22true\x22>\x0a\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-canvas-sync-option\x22\x20data-person-replacement-output-menu-item\x20data-person-replacement-action=\x22sync-all-clips-to-canvas\x22\x20role=\x22menuitem\x22' + (_0x90b4ef ? " aria-disabled=\"true\" disabled" : '') + ">\n        <strong>" + _0x86f031['label'] + '</strong><small>' + _0x86f031["detail"] + "</small>\n      </button>\n      <button type=\"button\" class=\"story-canvas-sync-option\" data-person-replacement-output-menu-item data-person-replacement-action=\"sync-project-to-canvas\" role=\"menuitem\"" + (_0x90b4ef ? " aria-disabled=\"true\" disabled" : '') + ">\n        <strong>同步整个项目到画布</strong><small>按当前进度同步素材、图像、视频、音频与合成节点</small>\n      </button>\n    </div>\n  </div>";
  const _0x2ca393 = _0x1e737b ? "<div class=\"story-canvas-sync-menu-wrap story-clip-export-menu-wrap" + (_0x3aa101 ? " is-loading" : '') + '\x22\x20data-person-replacement-output-menu=\x22export\x22\x20data-person-replacement-export-pending=\x22' + _0x3aa101 + "\">\n      <button type=\"button\" class=\"story-workbench-action-button story-canvas-sync-trigger story-menu-trigger" + (_0x3aa101 ? " is-loading" : '') + "\" data-person-replacement-action=\"toggle-output-menu\" data-person-replacement-output-menu-trigger=\"export\" aria-haspopup=\"menu\" aria-expanded=\"false\" aria-busy=\"" + _0x3aa101 + '\x22' + (_0x3aa101 ? " disabled" : '') + '>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x3aa101 ? '<span\x20class=\x22storyboard-script-loading-spinner\x20person-replacement-export-spinner\x22\x20aria-hidden=\x22true\x22></span>' : '') + "<span>" + (_0x3aa101 ? "导出中…" : '导出') + "</span>" + (_0x3aa101 ? '' : "<span class=\"story-canvas-sync-chevron\" aria-hidden=\"true\"></span>") + "\n      </button>\n      <div class=\"story-canvas-sync-menu story-clip-export-menu\" role=\"menu\" aria-label=\"导出人物替换结果\" aria-hidden=\"true\">\n        <div class=\"person-replacement-export-menu-group\" data-person-replacement-export-group>\n          <button type=\"button\" class=\"story-canvas-sync-option person-replacement-export-menu-group-trigger\" data-person-replacement-output-menu-item data-person-replacement-export-submenu-trigger=\"video\" role=\"menuitem\" aria-haspopup=\"menu\" aria-expanded=\"false\"" + (_0x3aa101 ? " aria-disabled=\"true\" disabled" : '') + ">\n            <span><strong>导出视频</strong><small>导出成片或全部替换素材</small></span><i aria-hidden=\"true\"></i>\n          </button>\n          <div class=\"person-replacement-export-submenu\" data-person-replacement-export-submenu=\"video\" role=\"menu\" aria-label=\"导出视频\" aria-hidden=\"true\">\n            <button type=\"button\" class=\"story-canvas-sync-option\" data-person-replacement-action=\"export-final-video\" role=\"menuitem\"" + (_0x3aa101 ? '\x20aria-disabled=\x22true\x22\x20disabled' : '') + ">\n              <strong>完整视频（当前音轨）</strong><small>将完整替换画面与下方选择的音轨封装后导出</small>\n            </button>\n            <button type=\"button\" class=\"story-canvas-sync-option\" data-person-replacement-action=\"export-all-clips-and-images\" role=\"menuitem\"" + (_0x3aa101 ? " aria-disabled=\"true\" disabled" : '') + ">\n              <strong>所有替换结果</strong><small>导出替换视频、替换音频及对应替换图</small>\n            </button>\n          </div>\n        </div>\n        <div class=\"person-replacement-export-menu-group\" data-person-replacement-export-group>\n          <button type=\"button\" class=\"story-canvas-sync-option person-replacement-export-menu-group-trigger\" data-person-replacement-output-menu-item data-person-replacement-export-submenu-trigger=\"project\" role=\"menuitem\" aria-haspopup=\"menu\" aria-expanded=\"false\"" + (_0x3aa101 ? " aria-disabled=\"true\" disabled" : '') + ">\n            <span><strong>导出项目</strong><small>导出到剪辑软件继续处理</small></span><i aria-hidden=\"true\"></i>\n          </button>\n          <div class=\"person-replacement-export-submenu\" data-person-replacement-export-submenu=\"project\" role=\"menu\" aria-label=\"导出项目\" aria-hidden=\"true\">\n            <button type=\"button\" class=\"story-canvas-sync-option\" data-person-replacement-action=\"export-premiere-xml\" role=\"menuitem\"" + (_0x3aa101 ? " aria-disabled=\"true\" disabled" : '') + ">\n              <strong>Premiere XML</strong><small>原片与替换片段、对应音频分四轨，包含素材</small>\n            </button>\n            <button type=\"button\" class=\"story-canvas-sync-option\" data-person-replacement-action=\"export-jianying-draft\" role=\"menuitem\"" + (_0x3aa101 ? " aria-disabled=\"true\" disabled" : '') + ">\n              <strong>剪映草稿</strong><small>保留完整替换片段和轨道空位，包含素材</small>\n            </button>\n          </div>\n        </div>\n      </div>\n    </div>" : '';
  return "<div class=\"person-replacement-toolbar-actions" + (_0x1e737b ? " person-replacement-preview-actions person-replacement-preview-actions--toolbar" : '') + '\x22>' + _0xe63531 + _0x2ca393 + "</div>";
}
function renderHeader(_0xbe2f5, _0x49689b = {}) {
  return "<header class=\"story-workspace-toolbar\"" + (_0x49689b["canvasSyncPending"] === !![] ? " aria-hidden=\"true\" inert" : '') + ">\n    <div class=\"story-project-toolbar person-replacement-story-toolbar\">\n      <button type=\"button\" class=\"story-toolbar-back\" data-person-replacement-action=\"back-home\" aria-label=\"返回人物替换项目\"><span class=\"story-toolbar-back-icon\" aria-hidden=\"true\"></span><span>人物替换项目</span></button>\n      " + renderStepNavigation(_0xbe2f5) + '\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22person-replacement-toolbar-side\x22>' + renderProjectToolbarActions(_0xbe2f5, _0x49689b) + "</div>\n    </div>\n  </header>";
}
function renderSourceQueue(_0x92397e) {
  if (!_0x92397e["sources"]['length']) {
    return '';
  }
  return "<div class=\"person-replacement-import-queue workspace-video-import-grid\">\n    " + _0x92397e["sources"]['map']((_0x27b025, _0x24e215) => {
    const _0x435062 = _0x27b025["processingStatus"] === "uploading" ? "正在上传" : _0x27b025["processingStatus"] === 'failed' ? '上传失败' : "已加入";
    const _0x3cae5c = normalizeMediaUrl(_0x27b025["thumbnailRef"]);
    const _0x52bd04 = normalizeText(_0x92397e["sourcePreviewRefs"]?.[_0x27b025['id']]);
    const _0x37f539 = normalizeMediaUrl(_0x52bd04 || _0x27b025["videoRef"]);
    const _0x1a0f70 = _0x27b025["fileName"] || '视频\x20' + (_0x24e215 + 0x1);
    return "<article class=\"person-replacement-import-item workspace-video-import-item\">\n        <div class=\"person-replacement-import-thumbnail workspace-video-import-thumbnail\">\n          " + (_0x3cae5c ? "<img src=\"" + escapeHtml(_0x3cae5c) + "\" alt=\"" + escapeHtml(_0x1a0f70) + '\x20视频封面\x22\x20draggable=\x22false\x22>' : _0x37f539 ? "<video src=\"" + escapeHtml(_0x37f539) + "\" preload=\"" + (_0x52bd04 ? "auto" : 'metadata') + "\" muted playsinline aria-label=\"" + escapeHtml(_0x1a0f70) + " 视频缩略图\" draggable=\"false\"></video>" : "<span class=\"workspace-video-import-placeholder\">" + renderVideoIcon() + '</span>') + "\n          <span class=\"person-replacement-import-status workspace-video-import-status\">" + escapeHtml(_0x435062) + "</span>\n          <button type=\"button\" class=\"person-replacement-import-remove workspace-video-import-remove\" data-person-replacement-action=\"remove-source\" data-source-id=\"" + escapeHtml(_0x27b025['id']) + "\" aria-label=\"删除 " + escapeHtml(_0x1a0f70) + '\x22>×</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22person-replacement-import-copy\x20workspace-video-import-copy\x22><strong>' + escapeHtml(_0x1a0f70) + "</strong></div>\n      </article>";
  })["join"]('') + "\n  </div>";
}
function normalizeProjectTimestamp(_0x118c56) {
  const _0x16adad = Number(_0x118c56);
  if (Number["isFinite"](_0x16adad) && _0x16adad > 0x0) {
    return _0x16adad;
  }
  const _0x40c8a5 = Date["parse"](_0x118c56 || '');
  return Number["isFinite"](_0x40c8a5) ? _0x40c8a5 : 0x0;
}
function buildPersonProjectHomeEntry(_0x1b1524 = {}) {
  const _0x3376d0 = normalizeText(_0x1b1524['id']);
  const _0x14ce89 = Array['isArray'](_0x1b1524["shots"]) ? _0x1b1524['shots'] : [];
  return {
    'id': _0x3376d0,
    'title': normalizeText(_0x1b1524["title"], "未命名人物替换项目"),
    'createdAt': normalizeProjectTimestamp(_0x1b1524["createdAt"]),
    'updatedAt': normalizeProjectTimestamp(_0x1b1524["updatedAt"]),
    'archivedAt': normalizeProjectTimestamp(_0x1b1524["archivedAt"]),
    'data': {
      'project': {
        'id': _0x3376d0,
        'title': normalizeText(_0x1b1524["title"], '未命名人物替换项目')
      },
      'episodes': _0x14ce89
    },
    'personReplacementProject': _0x1b1524
  };
}
function getPersonProjectCoverImageUrls(_0x398d9e = {}) {
  return (Array["isArray"](_0x398d9e["shots"]) ? _0x398d9e['shots'] : [])["flatMap"](_0x41f5e3 => [_0x41f5e3?.['replacementImageRef'], _0x41f5e3?.["keyframeRef"]])["map"](normalizeMediaUrl)['filter']((_0x2d1619, _0x4a3c6b, _0x246b2a) => _0x2d1619 && _0x246b2a['indexOf'](_0x2d1619) === _0x4a3c6b)["slice"](0x0, 0x3);
}
function getHomeProjectPresentation(_0x3f12d8) {
  const _0x5da0ca = Array["isArray"](_0x3f12d8['libraryProjects']) ? _0x3f12d8['libraryProjects'] : [];
  const _0x441b5e = _0x5da0ca["map"](buildPersonProjectHomeEntry)["filter"](_0x26fd68 => _0x26fd68['id']);
  const _0x4a6a0f = _0x3f12d8["workspace"]["showArchivedProjects"] === !![];
  const _0x4673ab = _0x441b5e["filter"](_0x3520fc => _0x3520fc['archivedAt'] > 0x0)["length"];
  const _0x29b61f = getWorkspaceProjectHomeEntries(_0x441b5e, {
    'query': _0x3f12d8["workspace"]["projectSearchQuery"],
    'sortOrder': _0x3f12d8["workspace"]["projectSortOrder"],
    'showArchived': _0x4a6a0f
  });
  return {
    'archivedProjectCount': _0x4673ab,
    'projectEntries': _0x441b5e,
    'showArchivedProjects': _0x4a6a0f,
    'visibleProjects': _0x29b61f
  };
}
function renderHomeProjectResults(_0x559814, _0x1e6fa0 = getHomeProjectPresentation(_0x559814)) {
  const {
    projectEntries: _0x121535,
    showArchivedProjects: _0x2fb119,
    visibleProjects: _0x32d31e
  } = _0x1e6fa0;
  return _0x121535["length"] ? "<div class=\"story-project-grid\">\n      " + _0x32d31e['map'](_0x55511d => renderWorkspaceProjectCard(_0x55511d, {
    'isDeleteConfirming': _0x559814["workspace"]["pendingDeleteProjectId"] === _0x55511d['id'],
    'isMenuOpen': _0x559814["workspace"]["openProjectMenuId"] === _0x55511d['id'],
    'fallbackTitle': "未命名人物替换项目",
    'itemCount': _0x55511d["personReplacementProject"]?.["shots"]?.['length'] || 0x0,
    'itemLabel': "个片段",
    'coverImageUrls': getPersonProjectCoverImageUrls(_0x55511d['personReplacementProject']),
    'emptyCoverLabel': "人物替换项目",
    'coverAltPrefix': '人物替换项目封面',
    'taskSummary': getPersonReplacementProjectTaskSummary(_0x55511d['personReplacementProject'])
  }))["join"]('') + "\n      " + (_0x32d31e["length"] ? '' : "<div class=\"story-project-filter-empty\"><strong>" + (_0x2fb119 ? '没有匹配的归档项目' : "没有匹配的人物替换项目") + "</strong><span>可以尝试其他搜索词，或清空搜索条件。</span></div>") + "\n      " + (_0x2fb119 ? '' : "<button type=\"button\" class=\"story-project-create-tile\" data-person-replacement-action=\"choose-source-videos\" aria-label=\"新建人物替换项目\"><span aria-hidden=\"true\">+</span><strong>新建人物替换项目</strong></button>") + "\n    </div>" : "<div class=\"story-project-empty\">\n      <strong>还没有人物替换项目</strong>\n      <span>加入视频并开始处理后，项目会保存在当前用户项目数据中。</span>\n      <button type=\"button\" class=\"story-primary-button story-project-empty-action\" data-person-replacement-action=\"choose-source-videos\">创建第一个项目</button>\n    </div>";
}
function renderHome(_0x5a600e) {
  const _0x28cbfb = getHomeProjectPresentation(_0x5a600e);
  const {
    archivedProjectCount: _0x303e90,
    showArchivedProjects: _0x360d37
  } = _0x28cbfb;
  const _0x164818 = isPersonReplacementSourceProcessing(_0x5a600e);
  const _0x454e88 = !_0x164818 && _0x5a600e["sources"]["some"](_0x2d135 => normalizeText(_0x2d135["videoRef"]));
  const _0x5a2298 = _0x164818 ? '' : renderSourceQueue(_0x5a600e);
  const _0x231d0c = _0x164818 ? " disabled" : '';
  return "<main class=\"story-home-page\">\n    <section class=\"story-home-hero\">\n      <span class=\"story-eyebrow\">Canvas AI · " + REPLACEMENT_STUDIO_NAME + "</span>\n      <h1>完整替换视频中的人物与声音</h1>\n      <div class=\"story-home-composer\">\n        <div class=\"story-home-composer-body\">\n          <div class=\"story-home-composer-panel story-upload-drop workspace-video-import-panel person-replacement-video-drop " + (_0x5a2298 ? "has-sources" : '') + "\" data-person-replacement-video-drop>\n            " + (_0x5a2298 || "<strong>导入原始视频</strong>\n            <p>可一次选择或拖入一个或多个视频，导入后将在这里显示。</p>\n            <div class=\"story-upload-actions\"><button type=\"button\" class=\"story-secondary-button\" data-person-replacement-action=\"choose-source-videos\"" + _0x231d0c + ">选择视频</button></div>") + "\n          </div>\n        </div>\n        <div class=\"story-home-model-bar\">\n          <div class=\"story-home-model-controls person-replacement-home-source-controls\">\n            <button type=\"button\" class=\"story-secondary-button\" data-person-replacement-action=\"choose-source-videos\"" + _0x231d0c + '>加入视频</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22person-replacement-home-flow-hint\x22>处理时切分镜头并抽帧检测；跳过时保留整段视频并抽帧检测。</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22person-replacement-home-process-actions\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22story-secondary-button\x22\x20data-person-replacement-action=\x22process-sources\x22\x20data-processing-mode=\x22skip\x22\x20' + (_0x454e88 ? '' : "disabled") + ">跳过处理</button>\n            " + renderSmartClipSettings(_0x5a600e) + "\n            <button type=\"button\" class=\"story-primary-button story-home-generate\" data-person-replacement-action=\"process-sources\" data-processing-mode=\"cut\" " + (_0x454e88 ? '' : "disabled") + "><span>开始处理</span><span class=\"story-generate-arrow\" aria-hidden=\"true\">→</span></button>\n          </div>\n        </div>\n      </div>\n    </section>\n    <section class=\"story-projects-section\">\n      <div class=\"story-section-heading\">\n        <div><h2>" + (_0x360d37 ? "已归档项目" : '我的人物替换项目') + "</h2></div>\n        <div class=\"story-project-list-controls\">\n          <button type=\"button\" class=\"story-project-import-button\" data-story-action=\"import-project\" data-person-replacement-action=\"import-project\">导入项目</button>\n          <label class=\"story-project-search\"><span aria-hidden=\"true\">⌕</span><input type=\"search\" data-story-project-search value=\"" + escapeHtml(_0x5a600e["workspace"]["projectSearchQuery"] || '') + '\x22\x20placeholder=\x22搜索项目名称\x22\x20autocomplete=\x22off\x22\x20aria-label=\x22搜索人物替换项目\x22></label>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + renderWorkspaceProjectSortControl(_0x5a600e["workspace"]['projectSortOrder']) + "\n          <button type=\"button\" class=\"story-project-archive-toggle " + (_0x360d37 ? "is-active" : '') + '\x22\x20data-story-action=\x22toggle-archived-projects\x22\x20aria-pressed=\x22' + _0x360d37 + '\x22>' + (_0x360d37 ? "返回项目" : "已归档 " + _0x303e90) + '</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20' + renderHomeProjectResults(_0x5a600e, _0x28cbfb) + "\n    </section>\n  </main>";
}
function renderStepFooter(_0x29fec4, _0x1ec365, {
  nextLabel = '下一步',
  hidePrevious = ![]
} = {}) {
  const _0xb171 = getPersonReplacementStepGate(_0x29fec4, _0x29fec4["workspace"]["step"] + 0x1);
  const _0x35712c = _0x29fec4['workspace']['step'] < PERSON_REPLACEMENT_STEPS["length"] && !_0xb171['allowed'];
  const _0xe6fea5 = isPersonReplacementSourceProcessing(_0x29fec4);
  const _0xe6671e = _0x35712c || _0xe6fea5;
  const _0x3f420c = getStepGuidance(_0x29fec4, _0x1ec365);
  return '<footer\x20class=\x22story-page-footer\x20person-replacement-step-footer\x22>\x0a\x20\x20\x20\x20<div><strong\x20data-person-replacement-guidance-role=\x22footer-title\x22>' + escapeHtml(_0x3f420c["title"]) + "</strong><small data-person-replacement-guidance-role=\"footer-detail\">" + escapeHtml(_0x3f420c['detail']) + "</small></div>\n    <div class=\"story-page-footer-actions\">\n      " + (hidePrevious ? '' : "<button type=\"button\" class=\"story-secondary-button button-press-feedback\" data-person-replacement-action=\"previous-step\"><span>上一步</span></button>") + "\n      <button type=\"button\" class=\"story-next-button" + (_0xe6fea5 ? " is-processing" : _0x35712c ? " is-locked" : '') + "\" data-person-replacement-action=\"next-step\" aria-disabled=\"" + _0xe6671e + "\" aria-busy=\"" + _0xe6fea5 + '\x22' + (_0xe6671e ? " title=\"" + escapeHtml(_0xe6fea5 ? "视频处理中，请稍候" : _0xb171["message"]) + '\x22' : '') + "><span>" + escapeHtml(nextLabel) + "</span><span class=\"story-next-arrow\" data-person-replacement-next-indicator=\"arrow\" aria-hidden=\"true\"" + (_0xe6fea5 ? " hidden" : '') + ">→</span><span class=\"storyboard-script-loading-spinner person-replacement-step-next-spinner\" data-person-replacement-next-indicator=\"spinner\" aria-hidden=\"true\"" + (_0xe6fea5 ? '' : " hidden") + "></span></button>\n    </div>\n  </footer>";
}
function renderCanvasSyncLoadingOverlay(_0x1250e1 = {}) {
  if (_0x1250e1['canvasSyncPending'] !== !![]) {
    return '';
  }
  return "<div class=\"person-replacement-canvas-sync-loading storyboard-script-loading-overlay\" data-person-replacement-canvas-sync-loading role=\"status\" aria-live=\"polite\" aria-label=\"正在加入画布\" tabindex=\"-1\">\n    <span class=\"storyboard-script-loading-spinner person-replacement-canvas-sync-spinner person-replacement-canvas-sync-overlay-spinner\" aria-hidden=\"true\"></span>\n    <strong class=\"storyboard-script-loading-label\">正在加入画布</strong>\n    <small>同步完成后将自动跳转到画布</small>\n  </div>";
}
function createProjectTaskStatusElement(_0x4b24e6, _0x2d2bf8, {
  className: _0x59c2b0,
  dataAttribute: _0x28972f
} = {}) {
  const _0x2217a4 = _0x4b24e6?.['ownerDocument'];
  if (!_0x2217a4?.["createElement"] || !_0x2d2bf8?.["appendChild"]) {
    return null;
  }
  const _0x59d7a6 = _0x2217a4["createElement"]("span");
  _0x59d7a6['className'] = _0x59c2b0;
  _0x59d7a6["setAttribute"](_0x28972f, '');
  _0x2d2bf8["appendChild"](_0x59d7a6);
  return _0x59d7a6;
}
function syncStatus(_0x4a0819, _0x27f5f7, _0x498834) {
  if (!_0x4a0819) {
    return;
  }
  const _0x13b939 = isPersonReplacementSourceProcessing(_0x27f5f7);
  const _0x166dae = getStepGuidance(_0x27f5f7, _0x498834);
  const _0x7031a = _0x4a0819["querySelector"]?.("[data-person-replacement-guidance-role=\"footer-title\"]");
  const _0x2f84e9 = _0x4a0819['querySelector']?.('[data-person-replacement-guidance-role=\x22footer-detail\x22]');
  if (_0x7031a) {
    _0x7031a["textContent"] = _0x166dae["title"];
  }
  if (_0x2f84e9) {
    _0x2f84e9["textContent"] = _0x166dae['detail'];
  }
  const _0x369271 = _0x4a0819["querySelector"]?.('[data-person-replacement-action=\x22next-step\x22]');
  if (_0x369271) {
    const _0x5278e9 = getPersonReplacementStepGate(_0x27f5f7, _0x27f5f7["workspace"]["step"] + 0x1);
    const _0x855a1c = _0x27f5f7['workspace']["step"] < PERSON_REPLACEMENT_STEPS["length"] && !_0x5278e9["allowed"];
    const _0x40516f = _0x855a1c || _0x13b939;
    _0x369271['classList']?.["toggle"]?.("is-locked", _0x855a1c && !_0x13b939);
    _0x369271["classList"]?.["toggle"]?.("is-processing", _0x13b939);
    _0x369271["setAttribute"]?.("aria-disabled", String(_0x40516f));
    _0x369271["setAttribute"]?.("aria-busy", String(_0x13b939));
    _0x40516f ? _0x369271["setAttribute"]?.("title", _0x13b939 ? "视频处理中，请稍候" : _0x5278e9["message"]) : _0x369271["removeAttribute"]?.("title");
  }
  const _0xe6a916 = _0x4a0819['querySelector']?.('[data-person-replacement-next-indicator=\x22arrow\x22]');
  const _0x181965 = _0x4a0819["querySelector"]?.("[data-person-replacement-next-indicator=\"spinner\"]");
  if (_0xe6a916) {
    _0xe6a916['hidden'] = _0x13b939;
  }
  if (_0x181965) {
    _0x181965['hidden'] = !_0x13b939;
  }
  if (_0x27f5f7["workspace"]['view'] !== "home") {
    return;
  }
  const _0x16a7c8 = Array["from"](_0x4a0819["querySelectorAll"]?.("[data-workspace-open-project]") || [])["find"](_0x2c7bb0 => normalizeText(_0x2c7bb0?.["dataset"]?.["workspaceOpenProject"]) === normalizeText(_0x27f5f7['id']));
  if (!_0x16a7c8) {
    return;
  }
  let _0x5ad438 = _0x16a7c8['querySelector']?.("[data-workspace-project-status]");
  let _0x46869c = _0x16a7c8["querySelector"]?.("[data-workspace-project-inline-status].has-task-error");
  const _0x21cb3e = getPersonReplacementProjectTaskSummary(_0x27f5f7);
  const _0x575acd = _0x21cb3e["activeCount"] > 0x0;
  const _0x161b25 = !_0x575acd && _0x21cb3e["failedCount"] > 0x0;
  _0x16a7c8["classList"]?.["toggle"]?.("is-generating", _0x575acd);
  _0x16a7c8["classList"]?.["toggle"]?.('has-task-error', _0x161b25);
  if (_0x575acd) {
    _0x46869c?.["remove"]?.();
    _0x5ad438 ||= createProjectTaskStatusElement(_0x16a7c8, _0x16a7c8, {
      'className': "story-project-status is-generating",
      'dataAttribute': "data-workspace-project-status"
    });
    if (!_0x5ad438) {
      return;
    }
    _0x5ad438["classList"]?.['add']?.("is-generating");
    _0x5ad438["textContent"] = _0x21cb3e['label'];
    _0x5ad438['setAttribute']?.('role', "status");
    _0x5ad438["setAttribute"]?.("aria-live", "polite");
    return;
  }
  _0x5ad438?.["remove"]?.();
  if (!_0x161b25) {
    _0x46869c?.["remove"]?.();
    return;
  }
  const _0x107e5f = _0x16a7c8["querySelector"]?.('.story-project-card-meta');
  _0x46869c ||= createProjectTaskStatusElement(_0x16a7c8, _0x107e5f, {
    'className': "story-project-inline-status has-task-error",
    'dataAttribute': 'data-workspace-project-inline-status'
  });
  if (!_0x46869c) {
    return;
  }
  _0x46869c["textContent"] = _0x21cb3e['label'];
  _0x46869c['setAttribute']?.("role", "status");
  _0x46869c["setAttribute"]?.("aria-live", "polite");
}
export function createPersonReplacementShellPresentation({
  resolveVoiceReferenceCount = () => 0x0
} = {}) {
  return Object["freeze"]({
    'renderCanvasSyncLoadingOverlay': renderCanvasSyncLoadingOverlay,
    'renderHeader': renderHeader,
    'renderHome': renderHome,
    'renderHomeProjectResults': renderHomeProjectResults,
    'renderSmartClipSettingsPanel': renderSmartClipSettingsPanel,
    'renderStepFooter': (_0x13a164, _0x3590ab) => renderStepFooter(_0x13a164, resolveVoiceReferenceCount, _0x3590ab),
    'renderToolbarActions': renderProjectToolbarActions,
    'syncStatus': (_0x3277a2, _0x261a3b) => syncStatus(_0x3277a2, _0x261a3b, resolveVoiceReferenceCount)
  });
}