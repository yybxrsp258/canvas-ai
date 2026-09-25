import { renderRequestDebugButton } from '../debugRequestWindow.js';
import { PERSON_REPLACEMENT_DEFAULT_IMAGE_MODEL_ID, getPersonReplacementActiveImageResultIndex, getPersonReplacementImageResults, getPersonReplacementVideoResults, resolvePersonReplacementImageResultRef, resolvePersonReplacementImageSourceRef, resolvePersonReplacementTargetCharacterId } from './personReplacementProject.js';
import { resolvePersonReplacementImageGenerationState } from './personReplacementImageGeneration.js';
import { buildPersonReplacementPromptPackage } from './personReplacementPromptCompiler.js';
import { getPersonReplacementBoxedPeople, resolvePersonReplacementDetectionLabel } from './personReplacementSourceIdentity.js';
import { localPathToUrl } from '../../utils/localMediaPath.js';
import { renderAIGenImageModelSelectorMarkup } from '../../components/aigenImage/modelSelector.js';
import { renderWorkspaceAssetLoadingOverlay } from '../workspaceAssetPresentation.js';
import { renderPersonReplacementPreviewArrow } from './personReplacementAssetPresentation.js';
import { renderWorkspaceImageDownloadButton } from '../workspaceImageDownload.js';
import { renderWorkspaceUploadIcon } from '../workspaceActionIcons.js';
import { normalizePersonReplacementLayout } from './personReplacementProjectSession.js';
import { renderPersonReplacementPromptHtml } from './personReplacementPromptMentions.js';
import { resolvePersonReplacementSourcePlaybackRef } from './personReplacementSourcePlayback.js';
import { renderPersonReplacementPromptModeControl, isPersonReplacementManualPromptMode, PERSON_REPLACEMENT_MANUAL_ENHANCEMENT_TOOLTIP } from './personReplacementPromptControls.js';
import { buildPersonReplacementImageGate } from './personReplacementImageGate.js';
function normalizeText(_0x186a10) {
  return String(_0x186a10 ?? '')["trim"]();
}
export function syncPersonReplacementImageStageFrame(_0x36b134) {
  const _0x20984f = Math["max"](0x0, Number(_0x36b134?.["naturalWidth"]) || 0x0);
  const _0x2e760e = Math["max"](0x0, Number(_0x36b134?.["naturalHeight"]) || 0x0);
  const _0x1e9aac = _0x36b134?.["closest"]?.('[data-person-replacement-keyframe-stage]');
  if (!(_0x20984f > 0x0 && _0x2e760e > 0x0) || !_0x1e9aac?.["style"]) {
    return ![];
  }
  _0x1e9aac["style"]["setProperty"]("--frame-aspect", _0x20984f + " / " + _0x2e760e);
  _0x1e9aac["style"]['setProperty']("--frame-width", String(_0x20984f));
  _0x1e9aac["style"]["setProperty"]('--frame-height', String(_0x2e760e));
  _0x36b134["setAttribute"]?.("width", String(_0x20984f));
  _0x36b134["setAttribute"]?.("height", String(_0x2e760e));
  const _0x23a201 = _0x1e9aac["parentElement"];
  const _0x533ba9 = _0x23a201?.['getBoundingClientRect']?.();
  const _0x273176 = Math["max"](0x0, Number(_0x23a201?.["clientWidth"]) || Number(_0x533ba9?.["width"]) || 0x0);
  const _0x49a094 = Math["max"](0x0, Number(_0x23a201?.['clientHeight']) || Number(_0x533ba9?.["height"]) || 0x0);
  if (_0x273176 > 0x0 && _0x49a094 > 0x0) {
    const _0x548ec9 = _0x20984f / _0x2e760e;
    const _0x1ea93f = _0x273176 / _0x49a094;
    const _0x1f6805 = _0x1ea93f > _0x548ec9 ? _0x49a094 * _0x548ec9 : _0x273176;
    const _0x2e1d3d = _0x1ea93f > _0x548ec9 ? _0x49a094 : _0x273176 / _0x548ec9;
    _0x1e9aac["style"]["setProperty"]("width", _0x1f6805 + 'px');
    _0x1e9aac["style"]["setProperty"]('height', _0x2e1d3d + 'px');
  }
  return !![];
}
function resolveSelectedShot(_0x387d62 = {}) {
  const _0xf7354a = Array["isArray"](_0x387d62?.['shots']) ? _0x387d62["shots"] : [];
  const _0xee17dd = normalizeText(_0x387d62?.["workspace"]?.["selectedShotId"]);
  return _0xf7354a["find"](_0x3d4156 => normalizeText(_0x3d4156?.['id']) === _0xee17dd) || _0xf7354a[0x0] || null;
}
function buildIdentityPresentation({
  project = {},
  shot = {},
  boxedPeople = [],
  duplicateRoleLabels = [],
  mappedPersonIds = []
} = {}) {
  const _0x352873 = new Set(duplicateRoleLabels);
  const _0x401cc1 = new Set(mappedPersonIds);
  const _0x5a90fc = normalizeText(shot?.['id']);
  return boxedPeople['map']((_0x1e217e, _0x578aae) => {
    const _0x245603 = resolvePersonReplacementDetectionLabel(_0x1e217e, _0x578aae, project, _0x5a90fc);
    const _0x2db129 = resolvePersonReplacementTargetCharacterId(project, _0x1e217e);
    const _0x594a71 = _0x401cc1['has'](normalizeText(_0x1e217e?.['id']));
    const _0x311cc4 = _0x352873["has"](_0x245603);
    return {
      'person': _0x1e217e,
      'personId': normalizeText(_0x1e217e?.['id']),
      'sourceCharacterId': normalizeText(_0x1e217e?.["sourceCharacterId"]),
      'targetCharacterId': _0x2db129,
      'label': _0x245603,
      'mapped': _0x594a71,
      'duplicateRole': _0x311cc4,
      'eligible': _0x594a71 && !_0x311cc4
    };
  });
}
function hasProjectDerivedArtifacts(_0x4e3eca = {}) {
  const _0x29c622 = _0x4e3eca?.["output"] || {};
  return Boolean(normalizeText(_0x4e3eca?.["audio"]?.["originalAudioRef"]) || normalizeText(_0x29c622["originalMasterRef"]) || normalizeText(_0x29c622["visualMasterRef"]) || normalizeText(_0x29c622["finalVideoRef"]) || normalizeText(_0x29c622['finalAudioTrack']) || normalizeText(_0x29c622["composeStatus"])["toLowerCase"]() === 'succeeded' || Array["isArray"](_0x29c622["composedShotIds"]) && _0x29c622["composedShotIds"]["some"](_0x1ef8f1 => normalizeText(_0x1ef8f1)));
}
function buildResultPresentation(_0x1f1903 = {}, _0x5e0e1a = null) {
  const _0x2fb928 = getPersonReplacementImageResults(_0x5e0e1a);
  const _0x567faa = getPersonReplacementActiveImageResultIndex(_0x5e0e1a, _0x2fb928);
  const _0x47b543 = _0x2fb928[_0x567faa] || null;
  const _0x1c8a36 = resolvePersonReplacementImageResultRef(_0x47b543) || normalizeText(_0x5e0e1a?.["replacementImageRef"]);
  const _0x5ead01 = Boolean(getPersonReplacementVideoResults(_0x5e0e1a)["length"] || normalizeText(_0x5e0e1a?.['resultVideoRef']) || normalizeText(_0x5e0e1a?.["generationStatus"]) && normalizeText(_0x5e0e1a?.["generationStatus"])["toLowerCase"]() !== "pending" || normalizeText(_0x5e0e1a?.["error"]));
  const _0x159bb8 = hasProjectDerivedArtifacts(_0x1f1903);
  return {
    'results': _0x2fb928,
    'active': _0x47b543,
    'activeIndex': _0x567faa,
    'activeRef': _0x1c8a36,
    'activePrompt': normalizeText(_0x5e0e1a?.["imagePrompt"]),
    'resultPrompt': Object["prototype"]['hasOwnProperty']["call"](_0x47b543 || {}, "userPrompt") ? normalizeText(_0x47b543?.["userPrompt"]) : '',
    'hasHistory': _0x2fb928["length"] > 0x1,
    'downstream': {
      'shotHasDerivedArtifacts': _0x5ead01,
      'projectHasDerivedArtifacts': _0x159bb8,
      'invalidationRequired': _0x5ead01 || _0x159bb8
    }
  };
}
export function buildPersonReplacementImagePresentation(_0x5544ec = {}, _0x49ad3c = []) {
  const _0x49d826 = resolveSelectedShot(_0x5544ec);
  const _0xb6adff = normalizeText(_0x49d826?.['id']);
  const _0x25dcc3 = _0x49d826 ? buildPersonReplacementPromptPackage({
    'project': _0x5544ec,
    'shot': _0x49d826
  }) : null;
  const _0x29cc45 = _0x49d826 ? getPersonReplacementBoxedPeople(_0x49d826) : [];
  const _0x23e422 = buildPersonReplacementImageGate({
    'project': _0x5544ec,
    'shot': _0x49d826 || {},
    'promptPackage': _0x25dcc3
  });
  const _0x5f2b33 = _0x23e422["duplicateRoleLabels"];
  const _0x1295f3 = resolvePersonReplacementImageGenerationState(_0x5544ec?.["workspace"], _0xb6adff);
  const _0x2401f0 = new Set((Array["isArray"](_0x49ad3c) ? _0x49ad3c : [])["map"](normalizeText)['filter'](Boolean));
  const _0x4f5c31 = Boolean(_0xb6adff && (_0x1295f3["status"] === "running" && normalizeText(_0x1295f3["shotId"]) === _0xb6adff || _0x2401f0["has"](_0xb6adff)));
  return {
    'selectedShot': _0x49d826,
    'selectedShotId': _0xb6adff,
    'sourceImageRef': resolvePersonReplacementImageSourceRef(_0x49d826),
    'promptPackage': _0x25dcc3,
    'boxedPeople': _0x29cc45,
    'identities': buildIdentityPresentation({
      'project': _0x5544ec,
      'shot': _0x49d826,
      'boxedPeople': _0x29cc45,
      'duplicateRoleLabels': _0x5f2b33,
      'mappedPersonIds': _0x23e422["mappedPersonIds"]
    }),
    'gate': _0x23e422,
    'generation': {
      'state': _0x1295f3,
      'loading': _0x4f5c31
    },
    'result': buildResultPresentation(_0x5544ec, _0x49d826)
  };
}
function escapeHtml(_0x3f9029) {
  return String(_0x3f9029 ?? '')["replaceAll"]('&', "&amp;")["replaceAll"]('<', "&lt;")["replaceAll"]('>', "&gt;")["replaceAll"]('\x22', "&quot;")['replaceAll']('\x27', "&#39;");
}
function normalizeMediaUrl(_0x567cad) {
  const _0x1b2572 = normalizeText(_0x567cad);
  return _0x1b2572 ? localPathToUrl(_0x1b2572) || _0x1b2572 : '';
}
function renderPromptEnhancementControl(_0x23271d = {}, {
  disabled = ![],
  pendingShotIds = [],
  model = {}
} = {}) {
  const _0x4920b6 = isPersonReplacementManualPromptMode(_0x23271d);
  disabled = disabled || _0x4920b6;
  const _0x1c9c92 = !_0x4920b6 && _0x23271d["settings"]?.["replacementPromptEnhancementEnabled"] === !![];
  const _0x23d69b = normalizeText(model['displayName'] || model['modelId']) || '未配置';
  const _0x37610b = model["supportsImage"] === ![] ? "当前画布 Agent 模型“" + _0x23d69b + "”不支持图片理解。开启增强前，请在画布 Agent 面板切换为支持视觉理解的模型。按钮高亮表示已开启，再次点击关闭。" : "开启后，使用画布 Agent 当前模型分析原图和人物参考图，补充姿态、视线、遮挡、光线、景深及画面质感，并加入移除原有影视字幕的要求。保留当前替换模式和人物绑定，会增加一次语言模型调用和等待时间。当前模型：" + _0x23d69b + "。可在画布 Agent 面板更换模型。按钮高亮表示已开启，再次点击关闭。";
  return '<div\x20class=\x22person-replacement-prompt-controls\x22>' + renderPersonReplacementPromptModeControl(_0x23271d, {
    'pendingShotIds': pendingShotIds
  }) + "<button type=\"button\" class=\"story-secondary-button person-replacement-toggle-button person-replacement-prompt-enhancement-toggle\" data-person-replacement-action=\"toggle-prompt-enhancement\" aria-pressed=\"" + _0x1c9c92 + "\" data-auto-tooltip=\"" + escapeHtml(_0x37610b) + '\x22\x20data-tooltip=\x22' + escapeHtml(_0x4920b6 ? PERSON_REPLACEMENT_MANUAL_ENHANCEMENT_TOOLTIP : _0x37610b) + '\x22\x20' + (disabled ? "disabled" : '') + ">AI 提示词增强</button></div>";
}
function renderImageReplacementGenerateButton(_0x35a48f, {
  presentation = {},
  shotBatchGenerationActive = ![],
  shotBatchCancelRequested = ![]
} = {}) {
  const _0x327839 = presentation["selectedShot"] || null;
  const _0x38a21e = _0x35a48f["workspace"]['shotSelectionMode'] === !![];
  const _0x498cad = Array["isArray"](_0x35a48f["workspace"]["selectedShotIds"]) ? _0x35a48f["workspace"]['selectedShotIds']['length'] : 0x0;
  const _0x4e5520 = new Set(Array["isArray"](_0x35a48f["workspace"]["selectedShotIds"]) ? _0x35a48f["workspace"]["selectedShotIds"]["map"](normalizeText)["filter"](Boolean) : []);
  const _0x2ed79e = _0x35a48f["shots"]["some"](_0x5d0f60 => {
    if (!_0x4e5520["has"](normalizeText(_0x5d0f60['id']))) {
      return ![];
    }
    const _0x4b0502 = buildPersonReplacementImagePresentation({
      ..._0x35a48f,
      'workspace': {
        ..._0x35a48f["workspace"],
        'selectedShotId': normalizeText(_0x5d0f60['id'])
      }
    });
    return !_0x4b0502["gate"]["sceneOnly"] && _0x4b0502["gate"]['duplicateRoleLabels']["length"] > 0x0;
  });
  const _0x354d06 = Boolean(presentation["generation"]?.['loading']);
  const _0x505717 = _0x498cad ? '\x20(' + _0x498cad + ')' : '';
  const _0x28dbd0 = _0x38a21e ? shotBatchGenerationActive ? shotBatchCancelRequested ? '正在停止' + _0x505717 : "取消运行" + _0x505717 : "批量生成替换图" + _0x505717 : _0x354d06 ? "生成中" : '生成替换图';
  const _0x4260cb = _0x38a21e ? !_0x498cad || _0x2ed79e || shotBatchCancelRequested : !_0x327839 || !presentation['gate']?.["eligible"] || _0x354d06;
  return "<button type=\"button\" class=\"story-asset-generate-button\" aria-busy=\"" + shotBatchGenerationActive + "\" data-person-replacement-action=\"generate-replacement-image\" " + (_0x4260cb ? "disabled" : '') + '>' + _0x28dbd0 + '</button>';
}
function renderImageReplacementPage(_0x4ed7c4, _0x4c8f44 = {}, {
  buildIdentityView: _0x10fce5,
  renderShotTimeline: _0x5510e5,
  renderLayoutSplitter: _0x365873,
  renderFooter: _0x481e17,
  renderSmartDetectTrigger: _0x3ccc4f
}) {
  const _0xc7d12f = buildPersonReplacementImagePresentation(_0x4ed7c4, _0x4c8f44["shotBatchGeneratingShotIds"]);
  const _0x24828a = _0xc7d12f['selectedShot'];
  const _0x1eb0ac = _0xc7d12f["sourceImageRef"];
  const _0x4e6ca6 = _0x4c8f44["cutEditorOpen"] === !![];
  const _0x1f58af = _0x4c8f44["omitShotTimeline"] === !![];
  const _0x4bb806 = _0x4c8f44['cutEditorSoundEnabled'] === !![];
  const _0x127345 = _0x4e6ca6 ? Array['isArray'](_0x4c8f44["cutEditorDraft"]) ? _0x4c8f44["cutEditorDraft"]["find"](_0xa739da => _0xa739da["shotId"] === normalizeText(_0x4c8f44["cutEditorPreviewShotId"])) : null : null;
  const _0x15b142 = _0x4e6ca6 ? _0x4ed7c4["shots"]["find"](_0x2cc47d => _0x2cc47d['id'] === normalizeText(_0x4c8f44['cutEditorPreviewShotId'])) || _0x4ed7c4["shots"]["find"](_0x597d2b => _0x597d2b['id'] === normalizeText(_0x127345?.["originShotId"])) || _0x24828a : _0x24828a;
  const _0x33a42b = _0x4e6ca6 ? _0x4ed7c4["sources"]["find"](_0x4e0059 => _0x4e0059['id'] === _0x15b142?.["sourceId"]) : null;
  const _0x20a729 = resolvePersonReplacementSourcePlaybackRef({
    'runtimePreviewRef': _0x4ed7c4['sourcePreviewRefs']?.[_0x15b142?.['sourceId']],
    'source': _0x33a42b,
    'sourceShot': _0x15b142
  });
  const _0x30f47b = normalizeMediaUrl(_0x20a729);
  const _0x1847af = /^aic-local-preview:/iu["test"](_0x30f47b) ? "crossorigin=\"anonymous\" " : '';
  const _0x1e3cfb = Boolean(_0x4e6ca6 && _0x30f47b && normalizeText(_0x4c8f44["cutEditorBufferedMediaRef"]) === _0x30f47b);
  const _0x787d94 = normalizeMediaUrl(_0x15b142?.['keyframeRef'] || _0x24828a?.["keyframeRef"]);
  const _0x253fe6 = _0xc7d12f["generation"]["state"];
  const _0x26b906 = _0xc7d12f["generation"]["loading"];
  const _0x4221b4 = Boolean(!isPersonReplacementManualPromptMode(_0x4ed7c4) && _0x26b906 && _0x4ed7c4['settings']?.["replacementPromptEnhancementEnabled"] === !![] && !_0x253fe6['promptEnhancement']);
  const _0x58b8a7 = normalizeText(_0x4c8f44['promptEnhancementModel']?.["displayName"] || _0x4c8f44['promptEnhancementModel']?.['modelId']) || '画布\x20Agent\x20当前模型';
  const _0x124fe7 = _0x4221b4 ? {
    'title': "AI 提示词增强中",
    'description': "正在使用" + _0x58b8a7 + "分析原图与参考图，完成后将自动开始生成替换图。"
  } : !isPersonReplacementManualPromptMode(_0x4ed7c4) && _0x253fe6["promptEnhancement"] ? {
    'title': "替换图生成中",
    'description': "增强提示词已与默认提示词叠加，正在等待生成结果。"
  } : {
    'title': "替换图生成中",
    'description': "正在等待生成结果，完成后会自动显示。"
  };
  const _0x5c04db = _0xc7d12f['result']["results"];
  const _0x513d75 = _0xc7d12f['result']["activeIndex"];
  const _0x4e98b7 = _0xc7d12f["result"]["hasHistory"];
  const _0xcb2ebb = _0x4e98b7 ? '' + renderPersonReplacementPreviewArrow("previous", {
    'action': "previous-replacement-image-result",
    'label': '切换到上一个替换图结果',
    'className': "person-replacement-image-result-arrow"
  }) + renderPersonReplacementPreviewArrow("next", {
    'action': "next-replacement-image-result",
    'label': "切换到下一个替换图结果",
    'className': "person-replacement-image-result-arrow"
  }) : '';
  const _0x467bff = _0x4e6ca6 ? _0x15b142?.["frame"] : _0x24828a?.["frame"];
  const _0x26a0a6 = Math["max"](0x1, Number(_0x467bff?.["width"]) || 0x10);
  const _0x465868 = Math['max'](0x1, Number(_0x467bff?.["height"]) || 0x9);
  const _0x24951a = "--frame-aspect:" + _0x26a0a6 + " / " + _0x465868 + ";--frame-width:" + _0x26a0a6 + ";--frame-height:" + _0x465868;
  const _0x5e433a = _0xc7d12f["boxedPeople"];
  const _0x3777e4 = new Set(_0xc7d12f['gate']["duplicateRoleLabels"]);
  const _0x3f216e = _0x10fce5(_0x4ed7c4, _0xc7d12f, {
    'people': _0x5e433a,
    'duplicateRoleLabels': _0x3777e4
  });
  const _0x34a739 = (_0x3777e4["size"] ? "<p class=\"person-replacement-limit-warning person-replacement-role-conflict-warning\">同一镜头内角色不能重复：" + escapeHtml([..._0x3777e4]["join"]('、')) + "。请修改红色框中的角色名。</p>" : '') + (_0xc7d12f["gate"]["blockers"]['some'](_0x333dbd => ['image-limit', "reference-review"]["includes"](_0x333dbd)) ? "<p class=\"person-replacement-limit-warning\" role=\"alert\"" + (_0xc7d12f['gate']['blockers']["includes"]('reference-review') ? " data-person-replacement-reference-review-warning" : '') + '>' + escapeHtml(_0xc7d12f['gate']["message"]) + "</p>" : '');
  const _0x189687 = _0x24828a?.["analysisStatus"] === 'failed' ? "人物检测失败" : _0x24828a?.['people']?.["length"] ? "检测结果缺少人物框" : "当前帧未检测到人物（可替换主体）";
  const _0x1019f7 = _0x24828a?.['analysisStatus'] === "failed" ? _0x24828a["error"] || "错误详情未保留，请用原视频新建项目重试后生成诊断包。" : '怪物、兽人等人形角色可能被人体模型漏检，可直接框选主体。';
  const _0x672f5 = "<div class=\"person-replacement-detection-empty\"><strong>" + _0x189687 + "</strong><span>" + escapeHtml(_0x1019f7) + "</span></div>";
  const _0x277b90 = _0x5e433a["length"] > 0x0;
  const _0x34b539 = _0x277b90 ? "<button type=\"button\" class=\"person-replacement-secondary-button person-replacement-clear-people-button\" data-person-replacement-action=\"clear-shot-people\" data-shot-id=\"" + escapeHtml(_0x24828a?.['id'] || '') + "\" aria-label=\"清空全部人物框\">清空</button>" : "<button type=\"button\" class=\"person-replacement-secondary-button person-replacement-clear-people-button\" aria-hidden=\"true\" tabindex=\"-1\" disabled>清空</button>";
  const _0x14be17 = 'person-replacement-keyframe-display\x20person-replacement-middle-preview-slide' + (_0x4e6ca6 ? " is-cut-editor-open" : '');
  const _0x3d3656 = !_0x4e6ca6 && !_0x277b90;
  const _0x46f197 = _0x4e6ca6 ? _0x3ccc4f({
    'smartDetectOpen': _0x4c8f44["cutEditorSmartDetectOpen"] === !![],
    'smartDetecting': _0x4c8f44["cutEditorSmartDetecting"] === !![],
    'disabled': Boolean(_0x4c8f44["cutEditorSubmitting"] || _0x4c8f44["cutEditorSmartDetecting"])
  }) : _0x34b539;
  const _0x12530f = "<div class=\"person-replacement-keyframe-tools" + (_0x3d3656 ? " is-layout-placeholder" : '') + '\x22' + (_0x3d3656 ? '\x20aria-hidden=\x22true\x22\x20inert' : '') + '>' + _0x46f197 + '</div>';
  const _0x3f25c3 = _0x4ed7c4["shots"]["length"] > 0x1;
  const _0x1044ef = _0x3f25c3 ? '' + renderPersonReplacementPreviewArrow("previous", {
    'action': "previous-shot",
    'label': '上一个片段',
    'className': "person-replacement-shot-navigation-arrow"
  }) + renderPersonReplacementPreviewArrow('next', {
    'action': "next-shot",
    'label': "下一个片段",
    'className': "person-replacement-shot-navigation-arrow"
  }) : '';
  const _0x21109c = _0x3f25c3 ? " aria-label=\"滚动鼠标滚轮或按左右方向键切换片段\"" : '';
  const _0x3f1f79 = _0x4e6ca6 && _0x20a729 ? "<div class=\"" + _0x14be17 + '\x22>' + _0x12530f + "<div class=\"person-replacement-keyframe-stage-shell\"><div class=\"person-replacement-shot-clip-stage\" data-person-replacement-shot-cut-preview-stage data-person-replacement-video-playback-stage=\"cut-editor\" data-shot-id=\"" + escapeHtml(_0x15b142?.['id'] || '') + "\" style=\"" + _0x24951a + "\"><video aria-label=\"镜头切口预览\" " + _0x1847af + "preload=\"" + (_0x1e3cfb ? "none" : "auto") + "\" playsinline " + (_0x4bb806 ? '' : "muted ") + (_0x1e3cfb ? '' : "src=\"" + escapeHtml(_0x30f47b) + '\x22\x20') + (_0x787d94 ? "poster=\"" + escapeHtml(_0x787d94) + '\x22' : '') + " data-person-replacement-shot-cut-video data-source-id=\"" + escapeHtml(_0x15b142?.["sourceId"] || '') + "\"></video></div></div></div>" : _0x1eb0ac ? "<div class=\"" + _0x14be17 + '\x22' + (_0x3f25c3 ? " data-person-replacement-shot-wheel=\"true\"" : '') + '>' + _0x12530f + "<div class=\"person-replacement-keyframe-stage-shell\"><div class=\"person-replacement-keyframe-stage\" data-person-replacement-keyframe-stage data-story-marquee-surface=\"people\" data-shot-id=\"" + escapeHtml(_0x24828a?.['id'] || '') + '\x22\x20tabindex=\x220\x22\x20aria-keyshortcuts=\x22Control\x20D\x20Delete\x22\x20style=\x22' + _0x24951a + '\x22' + _0x21109c + "><img src=\"" + escapeHtml(normalizeMediaUrl(_0x1eb0ac)) + "\" alt=\"" + (_0x24828a?.["imageIterationReferenceRef"] ? "图像1参考图" : "视频首帧") + "\" width=\"" + _0x26a0a6 + '\x22\x20height=\x22' + _0x465868 + '\x22>' + (_0x5e433a["length"] ? _0x3f216e['detectionBoxesHtml'] : _0x672f5) + "</div></div>" + _0x1044ef + "</div>" : "<div class=\"person-replacement-inline-empty\">视频仍在抽帧或没有可用首帧</div>";
  const _0x331963 = normalizePersonReplacementLayout(_0x4ed7c4['workspace']["replacementLayout"]);
  const _0x57afa3 = "--person-replacement-left-width:" + _0x331963['left'] + "%;--person-replacement-right-width:" + _0x331963["right"] + '%;--person-replacement-center-top:' + _0x331963["centerTop"] + '%;';
  const _0x12cc87 = renderPromptEnhancementControl(_0x4ed7c4, {
    'pendingShotIds': _0x4c8f44["shotBatchGeneratingShotIds"],
    'disabled': Boolean(_0x26b906 || _0x4c8f44['shotBatchGenerationActive']),
    'model': _0x4c8f44['promptEnhancementModel']
  });
  return "<div class=\"person-replacement-production-page\">\n    <div class=\"person-replacement-four-panel-layout\" data-person-replacement-layout style=\"" + _0x57afa3 + "\">\n       " + _0x3f216e["targetAssetRailHtml"] + "\n       " + _0x365873("left", _0x331963) + '\x0a\x20\x20\x20\x20\x20\x20\x20<section\x20class=\x22person-replacement-keyframe-panel\x20person-replacement-middle-layout\x22>' + _0x3f1f79 + _0x365873('center', _0x331963) + (_0x1f58af ? '' : _0x5510e5(_0x4ed7c4, {
    ..._0x4c8f44,
    'allowCutEditing': !![]
  })) + "</section>\n      " + _0x365873("right", _0x331963) + "\n      <aside class=\"person-replacement-generation-panel person-replacement-image-generation-panel\">\n        <div class=\"person-replacement-generation-preview " + (_0x26b906 ? "img-preview-loading" : '') + '\x22\x20aria-busy=\x22' + _0x26b906 + '\x22' + (_0x4e98b7 ? " data-person-replacement-image-result-wheel=\"true\" aria-label=\"滚动鼠标滚轮切换生成结果\"" : '') + '>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22person-replacement-image-preview-slide\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0xc7d12f["result"]["activeRef"] ? "<img src=\"" + escapeHtml(normalizeMediaUrl(_0xc7d12f["result"]["activeRef"])) + '\x22\x20alt=\x22替换结果\x20' + (_0x513d75 + 0x1) + "\" width=\"" + _0x26a0a6 + "\" height=\"" + _0x465868 + '\x22>' : "<span>生成结果显示在这里</span>") + "\n          </div>\n          " + (_0x26b906 ? renderWorkspaceAssetLoadingOverlay(_0x124fe7) : '') + "\n          <div class=\"story-asset-preview-actions person-replacement-result-actions\">\n            " + renderWorkspaceImageDownloadButton({
    'action': "download-replacement-image",
    'enabled': Boolean(_0xc7d12f["result"]['activeRef']),
    'className': "person-replacement-result-download"
  }) + "\n            <button type=\"button\" class=\"story-upload-replace story-character-voice-upload-button person-replacement-result-upload\" data-story-action=\"upload-replacement-image\" aria-label=\"上传替换图片\" " + (!_0x24828a || _0x26b906 ? "disabled" : '') + '>' + renderWorkspaceUploadIcon() + "</button>\n          </div>\n          " + _0xcb2ebb + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x5c04db["length"] ? '<div\x20class=\x22person-replacement-image-result-meta\x22\x20aria-label=\x22生成结果\x20' + (_0x513d75 + 0x1) + '/' + _0x5c04db["length"] + "\"><span>" + (_0x513d75 + 0x1) + '/' + _0x5c04db["length"] + '</span></div>' : '') + "\n        </div>\n        " + _0x365873('center', _0x331963, {
    'label': "调整结果预览与提示词区域高度"
  }) + "\n        <div class=\"story-asset-detail-copy person-replacement-generation-copy\"><div class=\"story-asset-prompt-field person-replacement-prompt-field\"><div class=\"person-replacement-prompt-field-heading\">" + _0x3f216e["promptReferenceInputsHtml"] + _0x12cc87 + '</div><div\x20class=\x22prompt-input-wrapper\x20is-resizable\x20person-replacement-prompt-input-wrapper\x22><div\x20class=\x22prompt-textarea\x20custom-textarea\x20story-asset-prompt-editor\x20person-replacement-prompt-editor\x22\x20contenteditable=\x22true\x22\x20role=\x22textbox\x22\x20aria-label=\x22图像替换提示词\x22\x20data-placeholder=\x22描述替换效果，输入\x20@\x20引用左侧素材图\x22\x20data-person-replacement-field=\x22image-prompt\x22\x20data-shot-id=\x22' + escapeHtml(_0x24828a?.['id'] || '') + '\x22>' + renderPersonReplacementPromptHtml(_0xc7d12f['result']["activePrompt"]) + "</div></div></div>" + (_0xc7d12f["gate"]['overflowPersonIds']['length'] ? "<p class=\"person-replacement-limit-warning\">单次最多 8 个目标人物</p>" : '') + (_0xc7d12f['gate']["unresolvedOrientationPersonIds"]["length"] ? "<p class=\"person-replacement-limit-warning person-replacement-orientation-warning\">还有 " + _0xc7d12f["gate"]["unresolvedOrientationPersonIds"]['length'] + " 个人物未确认朝向，确认后才能生成。</p>" : '') + _0x34a739 + "<div class=\"story-asset-generation-bar prompt-panel-footer\">" + renderAIGenImageModelSelectorMarkup({
    'modelId': _0x4ed7c4["settings"]["replacementImageModelId"] || PERSON_REPLACEMENT_DEFAULT_IMAGE_MODEL_ID,
    'provider': _0x4ed7c4["settings"]["replacementImageProvider"],
    'generationParams': _0x4ed7c4["settings"]['replacementImageGenerationParams'] || {},
    'providerProfileId': _0x4ed7c4["settings"]['replacementImageProviderProfileId'],
    'providerProfileIdByModel': _0x4ed7c4["settings"]['replacementImageProviderProfileIdByModel'],
    'showSchemaControls': !![],
    'excludeRunningHubWorkflowModels': !![],
    'className': "story-asset-image-model-selector person-replacement-image-model-selector"
  }) + renderRequestDebugButton("data-story-action=\"debug-generation-image\"") + renderImageReplacementGenerateButton(_0x4ed7c4, {
    'presentation': _0xc7d12f,
    ..._0x4c8f44
  }) + "</div>" + (_0x253fe6['error'] ? '<p\x20class=\x22person-replacement-error\x22>' + escapeHtml(_0x253fe6["error"]) + "</p>" : '') + "</div>\n      </aside>\n   </div>" + _0x481e17(_0x4ed7c4, {
    'nextLabel': "进入视频替换"
  }) + "\n  </div>";
}
function cloneFrozenPresentationValue(_0x305569) {
  if (Array["isArray"](_0x305569)) {
    return Object["freeze"](_0x305569["map"](cloneFrozenPresentationValue));
  }
  if (!_0x305569 || typeof _0x305569 !== "object") {
    return _0x305569;
  }
  return Object['freeze'](Object["fromEntries"](Object["entries"](_0x305569)['map'](([_0x291ed9, _0x231ad5]) => [_0x291ed9, cloneFrozenPresentationValue(_0x231ad5)])));
}
function buildReadonlyImagePresentation(_0x2b0308, _0x29a773) {
  const _0x2e9164 = buildPersonReplacementImagePresentation(_0x2b0308, _0x29a773);
  return Object['freeze']({
    'selectedShot': _0x2e9164["selectedShot"] ? cloneFrozenPresentationValue(_0x2e9164["selectedShot"]) : null,
    'selectedShotId': _0x2e9164["selectedShotId"],
    'sourceImageRef': _0x2e9164['sourceImageRef'],
    'promptPackage': _0x2e9164["promptPackage"] ? cloneFrozenPresentationValue(_0x2e9164["promptPackage"]) : null,
    'boxedPeople': cloneFrozenPresentationValue(_0x2e9164['boxedPeople']),
    'identities': cloneFrozenPresentationValue(_0x2e9164['identities']),
    'gate': cloneFrozenPresentationValue(_0x2e9164["gate"]),
    'generation': cloneFrozenPresentationValue(_0x2e9164['generation']),
    'result': cloneFrozenPresentationValue(_0x2e9164["result"])
  });
}
export function syncPersonReplacementImagePromptGate(_0xc5a440, _0x45694c, _0x190680 = {}) {
  const _0x337607 = _0xc5a440?.["querySelector"]?.("[data-person-replacement-action=\"generate-replacement-image\"]");
  const _0x3545ad = _0xc5a440?.["ownerDocument"];
  if (!_0x337607 || !_0x3545ad?.["createElement"]) {
    return;
  }
  const _0x3ee045 = buildReadonlyImagePresentation(_0x45694c, _0x190680["shotBatchGeneratingShotIds"]);
  const _0x2b619d = _0x3545ad['createElement']("template");
  _0x2b619d['innerHTML'] = renderImageReplacementGenerateButton(_0x45694c, {
    ..._0x190680,
    'presentation': _0x3ee045
  });
  _0x337607["disabled"] = _0x2b619d["content"]['firstElementChild']['disabled'];
  let _0x42a872 = _0xc5a440["querySelector"]("[data-person-replacement-reference-review-warning]");
  if (!_0x3ee045["gate"]['blockers']["includes"]("reference-review")) {
    _0x42a872?.["remove"]();
    return;
  }
  !_0x42a872 && (_0x42a872 = _0x3545ad["createElement"]('p'), _0x42a872["className"] = 'person-replacement-limit-warning', _0x42a872["setAttribute"]("role", "alert"), _0x42a872['setAttribute']("data-person-replacement-reference-review-warning", ''), _0x337607['closest'](".prompt-panel-footer")?.["before"](_0x42a872));
  _0x42a872["textContent"] = _0x3ee045['gate']["message"];
}
export function createPersonReplacementImagePresentation({
  buildIdentityView = () => ({
    'detectionBoxesHtml': '',
    'promptReferenceInputsHtml': '',
    'targetAssetRailHtml': ''
  }),
  renderShotTimeline = () => '',
  renderLayoutSplitter = () => '',
  renderFooter = () => '',
  renderSmartDetectTrigger = () => ''
} = {}) {
  const _0xf1f1fa = Object["freeze"]({
    'buildIdentityView': buildIdentityView,
    'renderShotTimeline': renderShotTimeline,
    'renderLayoutSplitter': renderLayoutSplitter,
    'renderFooter': renderFooter,
    'renderSmartDetectTrigger': renderSmartDetectTrigger
  });
  return Object["freeze"]({
    'build': buildReadonlyImagePresentation,
    'render': (_0x376e48, _0x4764d1 = {}) => renderImageReplacementPage(_0x376e48, _0x4764d1, _0xf1f1fa),
    'renderGenerateButton': renderImageReplacementGenerateButton
  });
}