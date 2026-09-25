import { getActiveStoryboard3DScene, getActiveStoryboard3DShot, migrateStoryboard3DProject, summarizeStoryboard3DProject } from './projectModel.js';
import { bindAIGenTextModelSelector, renderAIGenTextModelSelectorMarkup } from '../../components/aigenText/modelSelector.js';
import { getDisplayModelName } from '../providers.js';
import { getStoryboard3DTextModelIds, resolveStoryboard3DTextModelSelection } from './modelSelection.js';
import { STORYBOARD_3D_PROMPT_MAX_CHARACTERS } from './projectGeneration.js';
import { containWorkspaceContextMenu } from '../workspaceContextMenuGuard.js';
function escapeHtml(_0x22f8c7) {
  return String(_0x22f8c7 ?? '')['replaceAll']('&', "&amp;")["replaceAll"]('<', "&lt;")["replaceAll"]('>', '&gt;')["replaceAll"]('\x22', "&quot;")["replaceAll"]('\x27', '&#39;');
}
function normalizeText(_0x33cc44) {
  return String(_0x33cc44 || '')["trim"]();
}
function normalizeSearchText(_0x29013c) {
  return normalizeText(_0x29013c)["toLocaleLowerCase"]("zh-CN");
}
function formatModelPackSize(_0x44b26d) {
  const _0xc367f0 = Math['max'](0x0, Number(_0x44b26d) || 0x0);
  if (!_0xc367f0) {
    return '';
  }
  return Math["max"](0x1, Math["round"](_0xc367f0 / (0x400 * 0x400))) + '\x20MB';
}
function formatDownloadedBytes(_0x27b18c) {
  const _0x642fb4 = Math['max'](0x0, Number(_0x27b18c) || 0x0);
  if (_0x642fb4 < 0x400) {
    return Math["floor"](_0x642fb4) + '\x20B';
  }
  if (_0x642fb4 < 0x400 * 0x400) {
    return (_0x642fb4 / 0x400)['toFixed'](0x1) + '\x20KB';
  }
  return (_0x642fb4 / (0x400 * 0x400))['toFixed'](0x1) + " MB";
}
function getModelPackInstallProgress(_0x5595a7 = {}) {
  const _0x31483b = _0x5595a7?.["installProgress"] && typeof _0x5595a7["installProgress"] === "object" ? _0x5595a7["installProgress"] : {};
  const _0x2416ea = Math["max"](0x0, Number(_0x31483b["downloadedBytes"]) || 0x0);
  const _0xc1c7f9 = Math["max"](0x0, Number(_0x31483b["totalBytes"]) || Number(_0x5595a7?.['downloadBytes']) || 0x0);
  const _0xbb7d70 = _0xc1c7f9 > 0x0 ? _0x2416ea / _0xc1c7f9 * 0x64 : 0x0;
  return {
    'state': normalizeText(_0x31483b["state"]),
    'downloadedBytes': _0x2416ea,
    'totalBytes': _0xc1c7f9,
    'percent': Math["min"](0x64, Math['max'](0x0, Number(_0x31483b["percent"]) || _0xbb7d70)),
    'currentSource': normalizeText(_0x31483b["currentSource"]),
    'completedSources': Math["max"](0x0, Math["floor"](Number(_0x31483b["completedSources"]) || 0x0)),
    'totalSources': Math["max"](0x0, Math['floor'](Number(_0x31483b["totalSources"]) || 0x0)),
    'message': normalizeText(_0x31483b["message"])
  };
}
function getModelPackProgressMessage(_0x58fb0e) {
  if (_0x58fb0e["message"]) {
    return _0x58fb0e["message"];
  }
  if (_0x58fb0e['state'] === 'extracting') {
    return '正在解压并校验模型';
  }
  if (_0x58fb0e["state"] === "installing") {
    return '正在安装模型素材';
  }
  if (_0x58fb0e["state"] === "complete") {
    return "模型包下载完成";
  }
  return '正在下载模型包';
}
export function isStoryboard3DModelPackReady(_0x5ad898 = {}) {
  return _0x5ad898?.["installed"] === !![] && Array["isArray"](_0x5ad898?.["assets"]) && _0x5ad898["assets"]["length"] > 0x0;
}
export function formatStoryboard3DProjectUpdatedAt(_0x446286, {
  now = Date["now"]()
} = {}) {
  const _0xa89ba8 = Number(_0x446286 || 0x0);
  if (!Number['isFinite'](_0xa89ba8) || _0xa89ba8 <= 0x0) {
    return "刚刚更新";
  }
  const _0x2c48e6 = Math['max'](0x0, Number(now) - _0xa89ba8);
  const _0x56a9cf = 0x3c * 0x3e8;
  const _0x5022c0 = 0x3c * _0x56a9cf;
  const _0x18d365 = 0x18 * _0x5022c0;
  if (_0x2c48e6 < _0x56a9cf) {
    return "刚刚更新";
  }
  if (_0x2c48e6 < _0x5022c0) {
    return Math['max'](0x1, Math['floor'](_0x2c48e6 / _0x56a9cf)) + " 分钟前";
  }
  if (_0x2c48e6 < _0x18d365) {
    return Math["max"](0x1, Math['floor'](_0x2c48e6 / _0x5022c0)) + " 小时前";
  }
  if (_0x2c48e6 < _0x18d365 * 0x7) {
    return Math["max"](0x1, Math["floor"](_0x2c48e6 / _0x18d365)) + '\x20天前';
  }
  return new Date(_0xa89ba8)["toLocaleDateString"]('zh-CN', {
    'year': "numeric",
    'month': "2-digit",
    'day': "2-digit"
  });
}
export function getStoryboard3DWorkspaceProjects(_0x8085 = {}) {
  const _0x45b334 = Array['isArray'](_0x8085?.["storyboard3dProjects"]) ? _0x8085["storyboard3dProjects"] : [];
  return _0x45b334['filter'](_0x554a23 => _0x554a23 && typeof _0x554a23 === "object" && normalizeText(_0x554a23['id']))["map"](_0x2053e6 => {
    const _0x424eb2 = migrateStoryboard3DProject(_0x2053e6);
    const _0xb67ae2 = getActiveStoryboard3DScene(_0x424eb2);
    const _0x42686b = getActiveStoryboard3DShot(_0x424eb2);
    const _0x3a652b = summarizeStoryboard3DProject(_0x424eb2);
    return {
      'projectId': _0x424eb2['id'],
      'title': _0x424eb2["name"],
      'previewUrl': _0x42686b?.['thumbnailUrl'] || '',
      'activeSceneName': _0xb67ae2?.["name"] || '未命名场景',
      ..._0x3a652b,
      'updatedAt': Number(_0x424eb2['updatedAt'] || 0x0)
    };
  })["sort"]((_0x1332bc, _0xfb4ac2) => _0xfb4ac2["updatedAt"] - _0x1332bc["updatedAt"] || _0x1332bc["title"]["localeCompare"](_0xfb4ac2["title"], "zh-CN"));
}
export function filterStoryboard3DWorkspaceProjects(_0x27b0d4 = [], _0x1129ce = '') {
  const _0x1de545 = normalizeSearchText(_0x1129ce);
  if (!_0x1de545) {
    return [..._0x27b0d4];
  }
  return _0x27b0d4["filter"](_0x382048 => normalizeSearchText((_0x382048?.["title"] || '') + '\x20' + (_0x382048?.["activeSceneName"] || ''))["includes"](_0x1de545));
}
function renderCubeIcon(_0x20f0f1 = '') {
  return "<svg class=\"" + escapeHtml(_0x20f0f1) + "\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\">\n    <path d=\"m12 3 8 4.5v9L12 21l-8-4.5v-9z\"/>\n    <path d=\"m4 7.5 8 4.5 8-4.5M12 12v9\"/>\n    <circle cx=\"12\" cy=\"8\" r=\"1.5\"/>\n  </svg>";
}
function renderProjectPreview(_0x439366) {
  if (_0x439366["previewUrl"]) {
    return "<img src=\"" + escapeHtml(_0x439366["previewUrl"]) + "\" alt=\"" + escapeHtml(_0x439366['title']) + " 的镜头预览\">";
  }
  return "<div class=\"storyboard-3d-home-project-placeholder\" aria-hidden=\"true\">\n    <span class=\"storyboard-3d-home-grid-plane\"></span>\n    " + renderCubeIcon('storyboard-3d-home-placeholder-icon') + "\n    <small>" + escapeHtml(_0x439366['activeSceneName']) + '</small>\x0a\x20\x20</div>';
}
export function renderStoryboard3DProjectCard(_0x2fdd51, _0x5f2f22, {
  menuOpen = ![],
  editing = ![],
  editingName = '',
  confirmingDelete = ![]
} = {}) {
  const _0x2dee59 = _0x2fdd51["title"] + '\x20' + _0x2fdd51["activeSceneName"];
  const _0x1e6b10 = escapeHtml(_0x2fdd51["projectId"]);
  return "<article class=\"storyboard-3d-home-project-card" + (menuOpen ? '\x20is-menu-open' : '') + (editing ? " is-renaming" : '') + (confirmingDelete ? '\x20is-delete-confirming' : '') + "\" data-storyboard-3d-project-id=\"" + _0x1e6b10 + "\" data-storyboard-3d-project-search=\"" + escapeHtml(normalizeSearchText(_0x2dee59)) + "\">\n    <button type=\"button\" class=\"storyboard-3d-home-project-preview\" data-storyboard-3d-home-action=\"open-project\" data-storyboard-3d-project-id=\"" + _0x1e6b10 + "\" aria-label=\"打开项目 " + escapeHtml(_0x2fdd51['title']) + '\x22>\x0a\x20\x20\x20\x20\x20\x20' + renderProjectPreview(_0x2fdd51) + "\n    </button>\n    " + (confirmingDelete ? "<div class=\"storyboard-3d-home-project-delete-confirm\" role=\"group\" aria-label=\"确认删除项目 " + escapeHtml(_0x2fdd51["title"]) + "\">\n          <button type=\"button\" class=\"storyboard-3d-home-project-delete-confirm-button is-danger\" data-storyboard-3d-home-action=\"confirm-project-delete\" data-storyboard-3d-project-id=\"" + _0x1e6b10 + "\">删除</button>\n          <button type=\"button\" class=\"storyboard-3d-home-project-delete-confirm-button\" data-storyboard-3d-home-action=\"cancel-project-delete\" data-storyboard-3d-project-id=\"" + _0x1e6b10 + '\x22>取消</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>' : '<button\x20type=\x22button\x22\x20class=\x22storyboard-3d-home-project-more\x22\x20data-storyboard-3d-home-action=\x22toggle-project-menu\x22\x20data-storyboard-3d-project-id=\x22' + _0x1e6b10 + "\" aria-label=\"" + escapeHtml(_0x2fdd51["title"]) + " 的更多选项\" aria-haspopup=\"menu\" aria-expanded=\"" + menuOpen + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20aria-hidden=\x22true\x22>•••</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22storyboard-3d-home-project-menu\x22\x20role=\x22menu\x22\x20aria-label=\x22' + escapeHtml(_0x2fdd51["title"]) + " 的项目操作\" " + (menuOpen ? '' : "hidden") + '>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20role=\x22menuitem\x22\x20data-storyboard-3d-home-action=\x22clone-project\x22\x20data-storyboard-3d-project-id=\x22' + _0x1e6b10 + '\x22>克隆</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20role=\x22menuitem\x22\x20data-storyboard-3d-home-action=\x22start-project-rename\x22\x20data-storyboard-3d-project-id=\x22' + _0x1e6b10 + "\">重命名</button>\n          <button type=\"button\" class=\"is-danger\" role=\"menuitem\" data-storyboard-3d-home-action=\"delete-project\" data-storyboard-3d-project-id=\"" + _0x1e6b10 + "\">删除</button>\n        </div>") + "\n    <span class=\"storyboard-3d-home-project-copy\">\n      <span class=\"storyboard-3d-home-project-heading\">\n        " + (editing ? "<input type=\"text\" value=\"" + escapeHtml(editingName) + "\" maxlength=\"120\" data-storyboard-3d-project-rename-input data-storyboard-3d-project-id=\"" + _0x1e6b10 + '\x22\x20aria-label=\x22重命名项目\x20' + escapeHtml(_0x2fdd51['title']) + '\x22>' : "<button type=\"button\" class=\"storyboard-3d-home-project-title\" data-storyboard-3d-home-action=\"start-project-rename\" data-storyboard-3d-project-id=\"" + _0x1e6b10 + "\" title=\"点击重命名\"><strong>" + escapeHtml(_0x2fdd51["title"]) + "</strong></button>") + "\n        <small>" + escapeHtml(formatStoryboard3DProjectUpdatedAt(_0x2fdd51["updatedAt"], {
    'now': _0x5f2f22
  })) + "</small>\n      </span>\n      <button type=\"button\" class=\"storyboard-3d-home-project-details\" data-storyboard-3d-home-action=\"open-project\" data-storyboard-3d-project-id=\"" + _0x1e6b10 + "\" aria-label=\"打开项目 " + escapeHtml(_0x2fdd51['title']) + "\">\n        <span class=\"storyboard-3d-home-visually-hidden\">" + escapeHtml(_0x2fdd51['title']) + "</span>\n        <span class=\"storyboard-3d-home-project-scene\">当前场景 · " + escapeHtml(_0x2fdd51["activeSceneName"]) + "</span>\n        <span class=\"storyboard-3d-home-project-stats\">\n          <span><b>" + _0x2fdd51['sceneCount'] + "</b> 场景</span>\n          <span><b>" + _0x2fdd51["shotCount"] + '</b>\x20镜头</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span><b>' + _0x2fdd51["objectCount"] + '</b>\x20物体</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</span>\x0a\x20\x20\x20\x20\x20\x20</button>\x0a\x20\x20\x20\x20</span>\x0a\x20\x20</article>';
}
function renderHome({
  projects: _0x5ba554,
  searchQuery: _0x3bf684,
  prompt: _0x578f9b,
  modelId: _0x1ca3b7,
  provider: _0x1d5e58,
  isGenerating: _0x4c48b5,
  generationStatus: _0xddac5,
  generationError: _0x48d406,
  modelPackStatus: _0x5ed132,
  modelPackDialogOpen: _0x448f9c,
  referenceImageUrl: _0x55dd26,
  referenceImageName: _0x397a3b,
  referenceImages = [],
  openProjectMenuId: _0x1ab3ae,
  editingProjectId: _0xe1a780,
  editingProjectName: _0x1074e8,
  confirmingDeleteProjectId: _0x1d3d1a
}) {
  const _0x39ceee = Date["now"]();
  const _0x398406 = isStoryboard3DModelPackReady(_0x5ed132);
  const _0x320cd6 = Boolean(normalizeText(_0x578f9b) && _0x1ca3b7 && _0x1d5e58 && _0x398406);
  const _0x3a30b8 = _0x5ed132?.["state"] === "installing";
  const _0x5d6d5c = Math["max"](0x0, Math["floor"](Number(_0x5ed132?.["assetCount"]) || 0x0), Array["isArray"](_0x5ed132?.["assets"]) ? _0x5ed132["assets"]["length"] : 0x0);
  const _0xc12def = formatModelPackSize(_0x5ed132?.["downloadBytes"]);
  const _0x7fd87 = getModelPackInstallProgress(_0x5ed132);
  const _0x4cb5a4 = [_0x5d6d5c ? _0x5d6d5c["toLocaleString"]("zh-CN") + '\x20项素材' : '', _0xc12def ? '约\x20' + _0xc12def : '']["filter"](Boolean)["join"](" · ");
  return "<div class=\"storyboard-3d-workspace-home-page\">\n    <section class=\"storyboard-3d-home-hero\">\n      <span class=\"storyboard-3d-home-eyebrow\">Canvas AI · Previz Studio</span>\n      <h1>先在空间里走一遍，再把镜头交给生成模型</h1>\n      <p>用场景、人物、道具和机位搭建可持续编辑的 3D 预演项目，让镜头关系在生成前就清晰可控。</p>\n      <div class=\"storyboard-3d-home-composer " + (_0x4c48b5 ? "is-generating" : '') + '\x22\x20aria-busy=\x22' + (_0x4c48b5 ? "true" : "false") + "\">\n        <div class=\"storyboard-3d-home-prompt-wrap\">\n          <label for=\"storyboard3DHomePrompt\">描述想要搭建的 3D 场景</label>\n          <textarea id=\"storyboard3DHomePrompt\" data-storyboard-3d-prompt-input maxlength=\"" + STORYBOARD_3D_PROMPT_MAX_CHARACTERS + "\" placeholder=\"例如：雨夜的旧车站，站台中央有一张长椅，两个人隔着行李箱对坐，使用低机位中景。\">" + escapeHtml(_0x578f9b) + "</textarea>\n          <div class=\"storyboard-3d-home-prompt-meta\">\n            <p>AI 会规划场景类型、可用素材、空间位置和首个镜头，生成后仍可逐项编辑。</p>\n            <span data-storyboard-3d-prompt-count>" + _0x578f9b["length"] + '\x20/\x20' + STORYBOARD_3D_PROMPT_MAX_CHARACTERS + "</span>\n          </div>\n        </div>\n        <div class=\"storyboard-3d-home-model-bar\">\n          " + renderAIGenTextModelSelectorMarkup({
    'modelId': _0x1ca3b7,
    'provider': _0x1d5e58,
    'getDisplayModelName': getDisplayModelName,
    'className': "storyboard-3d-home-text-model-selector",
    'allowedModelIds': getStoryboard3DTextModelIds()
  }) + "\n          <div class=\"storyboard-3d-home-composer-actions\">\n            <input type=\"file\" accept=\"image/*\" multiple data-storyboard-3d-reference-image-input hidden>\n            <button type=\"button\" class=\"storyboard-3d-home-reference-button\" data-storyboard-3d-home-action=\"choose-reference-image\">\n              <span aria-hidden=\"true\">▧</span><span>参考图</span>\n            </button>\n            <button type=\"button\" class=\"storyboard-3d-home-primary storyboard-3d-home-generate\" data-storyboard-3d-home-action=\"generate-project\" " + (_0x320cd6 && !_0x4c48b5 ? '' : "disabled") + ">\n              <span data-storyboard-3d-generate-label>" + escapeHtml(_0x4c48b5 ? _0xddac5 || "正在创建 3D 场景" : "生成 3D 场景") + "</span>\n              <span class=\"storyboard-3d-home-generate-arrow\" aria-hidden=\"true\">→</span>\n            </button>\n          </div>\n        </div>\n        " + (referenceImages["length"] ? referenceImages : _0x55dd26 ? [{
    'url': _0x55dd26,
    'name': _0x397a3b
  }] : [])["map"]((_0x5d31f1, _0x9116f3) => "<div class=\"storyboard-3d-home-reference-preview\" data-storyboard-3d-reference-preview>\n              <img src=\"" + escapeHtml(_0x5d31f1["url"]) + "\" alt=\"参考图 " + (_0x9116f3 + 0x1) + "\">\n              <span><strong>" + escapeHtml(_0x5d31f1["name"] || "参考图") + '</strong><small>' + (_0x9116f3 + 0x1) + '\x20/\x206\x20·\x20AI\x20估计人物、物品和空间关系</small></span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20data-storyboard-3d-home-action=\x22remove-reference-image\x22\x20data-reference-index=\x22' + _0x9116f3 + "\" aria-label=\"移除参考图 " + (_0x9116f3 + 0x1) + "\">×</button>\n            </div>")["join"]('') + "\n        " + (!_0x398406 && _0x5ed132?.['state'] !== "checking" ? '<div\x20class=\x22storyboard-3d-home-model-pack-hint\x22\x20role=\x22status\x22>需要先下载基础轻量模型包，场景\x20Agent\x20才能调用固定素材搭建场景。</div>' : '') + "\n        <div class=\"storyboard-3d-home-generation-error\" data-storyboard-3d-generation-error role=\"alert\" " + (_0x48d406 ? '' : "hidden") + '>' + escapeHtml(_0x48d406) + "</div>\n        <div class=\"storyboard-3d-home-generation-loading storyboard-script-loading-overlay\" data-storyboard-3d-generation-loading role=\"status\" aria-live=\"polite\" " + (_0x4c48b5 ? '' : "hidden") + '>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22storyboard-script-loading-spinner\x22></div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22storyboard-script-loading-label\x22\x20data-storyboard-3d-generation-loading-label>' + escapeHtml(_0xddac5 || "正在创建 3D 场景") + "</div>\n          <div class=\"storyboard-script-loading-bar\"><div class=\"storyboard-script-loading-bar-fill\"></div></div>\n        </div>\n      </div>\n    </section>\n\n    <section class=\"storyboard-3d-home-projects\" aria-labelledby=\"storyboard3DHomeProjectsTitle\">\n      <div class=\"storyboard-3d-home-section-heading\">\n        <div>\n          <span class=\"storyboard-3d-home-eyebrow\">独立项目 · " + _0x5ba554["length"] + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<h2\x20id=\x22storyboard3DHomeProjectsTitle\x22>我的3D场景项目</h2>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x5ba554["length"] ? "<label class=\"storyboard-3d-home-search\">\n              <span aria-hidden=\"true\">⌕</span>\n              <input type=\"search\" value=\"" + escapeHtml(_0x3bf684) + "\" data-storyboard-3d-project-search-input placeholder=\"搜索项目或场景\" aria-label=\"搜索 3D 场景项目\">\n            </label>" : '') + "\n      </div>\n      " + (_0x5ba554["length"] ? "<div class=\"storyboard-3d-home-project-grid\">\n            " + _0x5ba554["map"](_0x2a7502 => renderStoryboard3DProjectCard(_0x2a7502, _0x39ceee, {
    'menuOpen': _0x2a7502["projectId"] === _0x1ab3ae,
    'editing': _0x2a7502["projectId"] === _0xe1a780,
    'editingName': _0x2a7502["projectId"] === _0xe1a780 ? _0x1074e8 : _0x2a7502["title"],
    'confirmingDelete': _0x2a7502["projectId"] === _0x1d3d1a
  }))['join']('') + "\n            <button type=\"button\" class=\"storyboard-3d-home-create-card\" data-storyboard-3d-home-action=\"new-project\">\n              <span aria-hidden=\"true\">+</span><strong>新建 3D 场景项目</strong><small>创建空场景与首个镜头</small>\n            </button>\n          </div>\n          <div class=\"storyboard-3d-home-search-empty\" data-storyboard-3d-search-empty hidden>\n            <strong>没有找到匹配的项目</strong><span>换一个项目名称或场景名称试试。</span>\n          </div>" : "<div class=\"storyboard-3d-home-empty-projects\">\n            <div>" + renderCubeIcon("storyboard-3d-home-empty-icon") + "</div>\n            <strong>还没有 3D 场景项目</strong>\n            <span>创建项目后，它会保存在当前用户项目数据中。</span>\n            <button type=\"button\" class=\"storyboard-3d-home-primary\" data-storyboard-3d-home-action=\"new-project\">创建第一个项目</button>\n          </div>") + "\n    </section>\n    " + (_0x448f9c ? '<div\x20class=\x22storyboard-3d-model-pack-backdrop\x22\x20data-storyboard-3d-model-pack-dialog\x20role=\x22presentation\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<section\x20class=\x22storyboard-3d-model-pack-dialog\x22\x20role=\x22dialog\x22\x20aria-modal=\x22true\x22\x20aria-labelledby=\x22storyboard3DModelPackTitle\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22storyboard-3d-model-pack-mark\x22\x20aria-hidden=\x22true\x22>' + renderCubeIcon() + "</span>\n            <div>\n              <span class=\"storyboard-3d-home-eyebrow\">首次使用准备</span>\n              <h2 id=\"storyboard3DModelPackTitle\">下载 3D 场景基础模型包</h2>\n              <p>场景 Agent 只会调用这个固定的轻量素材库来搭建人物、家具和环境物品，不会在线搜索模型。素材以性能友好的中低复杂度模型为主，未下载时无法生成 3D 场景。</p>\n              " + (_0x4cb5a4 ? "<small>" + escapeHtml(_0x4cb5a4) + " · 按需加载，不会一次性占用内存</small>" : '') + "\n              <small>下载渠道：本地服务通过 HTTPS 从 Kenney 官方与 OpenGameArt 镜像获取，并在安装前校验文件。</small>\n              " + (_0x3a30b8 ? "<div class=\"storyboard-3d-model-pack-progress\" data-storyboard-3d-model-pack-progress>\n                    <div class=\"storyboard-3d-model-pack-progress-heading\">\n                      <strong>" + escapeHtml(getModelPackProgressMessage(_0x7fd87)) + '</strong>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span>' + Math["round"](_0x7fd87['percent']) + "%</span>\n                    </div>\n                    <progress max=\"100\" value=\"" + _0x7fd87["percent"] + '\x22\x20aria-label=\x22模型包下载进度\x22>' + Math["round"](_0x7fd87["percent"]) + "%</progress>\n                    <div class=\"storyboard-3d-model-pack-progress-meta\">\n                      <span>" + escapeHtml(formatDownloadedBytes(_0x7fd87["downloadedBytes"])) + " / " + escapeHtml(formatDownloadedBytes(_0x7fd87["totalBytes"])) + "</span>\n                      " + (_0x7fd87["totalSources"] ? "<span>" + _0x7fd87["completedSources"] + " / " + _0x7fd87["totalSources"] + " 个资源包</span>" : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x7fd87["currentSource"] ? "<small title=\"" + escapeHtml(_0x7fd87["currentSource"]) + "\">下载源 · " + escapeHtml(_0x7fd87["currentSource"]) + "</small>" : '') + "\n                  </div>" : '') + "\n              " + (_0x5ed132?.['error'] ? "<small class=\"storyboard-3d-model-pack-error\">" + escapeHtml(_0x5ed132['error']) + "</small>" : '') + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<footer>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20data-storyboard-3d-home-action=\x22skip-model-pack\x22\x20' + (_0x3a30b8 ? 'disabled' : '') + ">暂不下载</button>\n              <button type=\"button\" class=\"storyboard-3d-home-primary\" data-storyboard-3d-home-action=\"install-model-pack\" " + (_0x3a30b8 ? 'disabled' : '') + '>' + (_0x3a30b8 ? "正在下载模型包…" : "下载模型包") + '</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</footer>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</section>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>' : '') + "\n  </div>";
}
export class Storyboard3DWorkspaceHome {
  constructor({
    getProjects: _0x275f9a,
    onCreateProject: _0x3fc747,
    onGenerateProject: _0x465eca,
    onOpenProject: _0x3f17b2,
    onCloneProject: _0x152008,
    onRenameProject: _0x38830a,
    onDeleteProject: _0x3c342a,
    onNotify: _0x30a067,
    modelPackApi = null,
    documentObject = globalThis["document"],
    urlApi = globalThis["URL"],
    setTimeoutFn = globalThis["setTimeout"],
    clearTimeoutFn = globalThis["clearTimeout"],
    modelPackProgressPollIntervalMs = 0x15e
  } = {}) {
    this["document"] = documentObject;
    this["getProjects"] = _0x275f9a;
    this["onCreateProject"] = _0x3fc747;
    this['onGenerateProject'] = _0x465eca;
    this["onOpenProject"] = _0x3f17b2;
    this["onCloneProject"] = _0x152008;
    this['onRenameProject'] = _0x38830a;
    this["onDeleteProject"] = _0x3c342a;
    this["onNotify"] = _0x30a067;
    this["modelPackApi"] = modelPackApi;
    this["urlApi"] = urlApi;
    this["setTimeoutFn"] = setTimeoutFn;
    this["clearTimeoutFn"] = clearTimeoutFn;
    this["modelPackProgressPollIntervalMs"] = Math["min"](0x1f4, Math["max"](0xfa, Number(modelPackProgressPollIntervalMs) || 0x15e));
    this["root"] = null;
    this["searchQuery"] = '';
    this["prompt"] = '';
    const _0x5bb98f = resolveStoryboard3DTextModelSelection();
    this["modelId"] = _0x5bb98f['modelId'];
    this["provider"] = _0x5bb98f['provider'];
    this["isGenerating"] = ![];
    this["generationStatus"] = '';
    this['generationError'] = '';
    this["modelPackStatus"] = {
      'state': 'checking',
      'installed': ![],
      'assets': [],
      'error': ''
    };
    this["modelPackDialogOpen"] = ![];
    this["referenceImageUrl"] = '';
    this["referenceImageName"] = '';
    this["referenceImages"] = [];
    this["openProjectMenuId"] = '';
    this['editingProjectId'] = '';
    this['editingProjectName'] = '';
    this["confirmingDeleteProjectId"] = '';
    this["_modelPackCheckPromise"] = null;
    this["_modelPackProgressTimer"] = null;
    this["_modelPackProgressPollGeneration"] = 0x0;
    this["_destroyed"] = ![];
    this["_promptForMissingModelPack"] = ![];
    this["_modelSelectorController"] = null;
    this["_handleClick"] = this["_handleClick"]['bind'](this);
    this["_handleInput"] = this["_handleInput"]["bind"](this);
    this["_handleChange"] = this["_handleChange"]["bind"](this);
    this['_handleKeyDown'] = this["_handleKeyDown"]["bind"](this);
  }
  ["mount"]() {
    if (this["root"] || !this["document"]?.['body']) {
      return this["root"];
    }
    const _0x3286a9 = this["document"]["createElement"]("section");
    _0x3286a9['id'] = "storyboard3DWorkspaceHome";
    _0x3286a9['className'] = "storyboard-3d-workspace-home";
    _0x3286a9["hidden"] = !![];
    _0x3286a9["setAttribute"]("aria-hidden", "true");
    _0x3286a9["setAttribute"]("aria-label", "3D 场景预演项目首页");
    _0x3286a9["dataset"]["uiStop"] = '1';
    _0x3286a9["addEventListener"]("contextmenu", containWorkspaceContextMenu);
    _0x3286a9['addEventListener']("pointerdown", _0x4c1c37 => _0x4c1c37['stopPropagation']());
    _0x3286a9["addEventListener"]('wheel', _0x3503ca => _0x3503ca["stopPropagation"](), {
      'passive': !![]
    });
    _0x3286a9["addEventListener"]('click', this["_handleClick"]);
    _0x3286a9["addEventListener"]('input', this["_handleInput"]);
    _0x3286a9["addEventListener"]("change", this["_handleChange"]);
    _0x3286a9["addEventListener"]("keydown", this['_handleKeyDown']);
    this['document']["body"]["appendChild"](_0x3286a9);
    this["root"] = _0x3286a9;
    this["_destroyed"] = ![];
    void this['_refreshModelPackStatus']({
      'promptIfMissing': ![]
    });
    return _0x3286a9;
  }
  ["_readProjects"]() {
    const _0xfbd0c9 = this["getProjects"]?.();
    return Array["isArray"](_0xfbd0c9) ? _0xfbd0c9 : [];
  }
  ["render"]() {
    if (!this['root']) {
      return;
    }
    const _0x3ac0b8 = this["root"]["scrollTop"];
    const _0x4c76f8 = this['root']["contains"](this["document"]?.['activeElement']) ? this["document"]["activeElement"]?.['getAttribute']?.("data-storyboard-3d-project-id") || '' : '';
    this['_modelSelectorController']?.['destroy']?.();
    this["root"]["innerHTML"] = renderHome({
      'projects': this['_readProjects'](),
      'searchQuery': this["searchQuery"],
      'prompt': this["prompt"],
      'modelId': this['modelId'],
      'provider': this["provider"],
      'isGenerating': this['isGenerating'],
      'generationStatus': this["generationStatus"],
      'generationError': this['generationError'],
      'modelPackStatus': this["modelPackStatus"],
      'modelPackDialogOpen': this["modelPackDialogOpen"],
      'referenceImageUrl': this['referenceImageUrl'],
      'referenceImageName': this["referenceImageName"],
      'referenceImages': this["referenceImages"],
      'openProjectMenuId': this["openProjectMenuId"],
      'editingProjectId': this["editingProjectId"],
      'editingProjectName': this['editingProjectName'],
      'confirmingDeleteProjectId': this["confirmingDeleteProjectId"]
    });
    this["_bindModelSelector"]();
    this["_applySearch"]();
    this["root"]["scrollTop"] = _0x3ac0b8;
    const _0x8b61fc = this["root"]["querySelector"]("[data-storyboard-3d-project-rename-input]");
    if (_0x8b61fc) {
      _0x8b61fc["focus"]();
      _0x8b61fc['select']?.();
    } else {
      _0x4c76f8 && this["focusProject"](_0x4c76f8);
    }
  }
  ["_bindModelSelector"]() {
    const _0x390c3c = this["root"]?.["querySelector"]("[data-aigen-text-model-selector]");
    if (!_0x390c3c) {
      return;
    }
    this["_modelSelectorController"] = bindAIGenTextModelSelector(_0x390c3c, {
      'modelId': this["modelId"],
      'provider': this['provider'],
      'getDisplayModelName': getDisplayModelName,
      'documentObject': this['document'],
      'onChange': ({
        modelId: _0x455584
      }) => {
        const _0x3d274c = resolveStoryboard3DTextModelSelection(_0x455584);
        this["modelId"] = _0x3d274c["modelId"];
        this["provider"] = _0x3d274c["provider"];
        this["_syncGenerationUi"]();
      }
    });
  }
  ["_syncGenerationUi"]() {
    if (!this["root"]) {
      return;
    }
    const _0xca7ec0 = Boolean(normalizeText(this['prompt']) && this["modelId"] && this['provider'] && isStoryboard3DModelPackReady(this["modelPackStatus"]));
    const _0x2b9475 = this['root']['querySelector']('[data-storyboard-3d-home-action=\x22generate-project\x22]');
    if (_0x2b9475) {
      _0x2b9475['disabled'] = !_0xca7ec0 || this['isGenerating'];
    }
    const _0xfc2384 = this['root']["querySelector"]('[data-storyboard-3d-generate-label]');
    _0xfc2384 && (_0xfc2384['textContent'] = this["isGenerating"] ? this["generationStatus"] || '正在创建\x203D\x20场景' : "生成 3D 场景");
    const _0x37dfa9 = this['root']['querySelector'](".storyboard-3d-home-composer");
    _0x37dfa9?.["classList"]["toggle"]('is-generating', this["isGenerating"]);
    _0x37dfa9?.['setAttribute']('aria-busy', this["isGenerating"] ? "true" : "false");
    const _0x88ce15 = this["root"]["querySelector"]("[data-storyboard-3d-generation-loading]");
    if (_0x88ce15) {
      _0x88ce15["hidden"] = !this["isGenerating"];
    }
    const _0x1ced91 = this["root"]["querySelector"]("[data-storyboard-3d-generation-loading-label]");
    _0x1ced91 && (_0x1ced91["textContent"] = this["generationStatus"] || "正在创建 3D 场景");
    const _0x5a1a7b = this["root"]["querySelector"]("[data-storyboard-3d-generation-error]");
    _0x5a1a7b && (_0x5a1a7b['hidden'] = !this["generationError"], _0x5a1a7b["textContent"] = this["generationError"]);
    const _0x1d732a = this["root"]['querySelector']("[data-storyboard-3d-prompt-count]");
    _0x1d732a && (_0x1d732a["textContent"] = this['prompt']["length"] + '\x20/\x20' + STORYBOARD_3D_PROMPT_MAX_CHARACTERS);
  }
  async ["_generateProject"]() {
    if (this['isGenerating']) {
      return null;
    }
    if (!isStoryboard3DModelPackReady(this['modelPackStatus'])) {
      this["generationError"] = "请先下载 3D 场景基础模型包。";
      this["modelPackDialogOpen"] = !![];
      this["render"]();
      return null;
    }
    const _0x22e0de = normalizeText(this["prompt"]);
    if (!_0x22e0de) {
      this["generationError"] = "请先描述要搭建的 3D 场景。";
      this["_syncGenerationUi"]();
      return null;
    }
    if (typeof this["onGenerateProject"] !== "function") {
      this["generationError"] = "3D 场景生成功能尚未初始化。";
      this['_syncGenerationUi']();
      return null;
    }
    this["isGenerating"] = !![];
    this["generationStatus"] = "正在规划场景、物体与镜头";
    this["generationError"] = '';
    this["_syncGenerationUi"]();
    const _0x281d5b = this['referenceImages']["filter"](_0x197a15 => _0x197a15["file"])['map'](_0x2e44ec => this["urlApi"]["createObjectURL"](_0x2e44ec['file']));
    try {
      const _0x5bcb3a = await this["onGenerateProject"]({
        'prompt': _0x22e0de,
        'model': this['modelId'],
        'provider': this["provider"],
        'assets': this['modelPackStatus']["assets"],
        'inputImageUrls': _0x281d5b['length'] ? _0x281d5b : this["referenceImageUrl"] ? [this["referenceImageUrl"]] : [],
        'onProgress': ({
          message: _0x463b2a
        } = {}) => {
          this["generationStatus"] = normalizeText(_0x463b2a) || "正在创建 3D 场景";
          this['_syncGenerationUi']();
        }
      });
      this["isGenerating"] = ![];
      this["generationStatus"] = '';
      this['onNotify']?.("3D 场景项目创建完成。", "success");
      this["_syncGenerationUi"]();
      return _0x5bcb3a;
    } catch (_0x604048) {
      this['isGenerating'] = ![];
      this["generationStatus"] = '';
      this["generationError"] = normalizeText(_0x604048?.['message']) || "3D 场景创建失败，请稍后重试。";
      this['onNotify']?.(this['generationError'], 'error');
      this["_syncGenerationUi"]();
      return null;
    } finally {
      _0x281d5b["forEach"](_0x55e2dd => this["urlApi"]['revokeObjectURL'](_0x55e2dd));
    }
  }
  ['_applySearch']() {
    if (!this["root"]) {
      return;
    }
    const _0x59fd1a = normalizeSearchText(this["searchQuery"]);
    let _0x572346 = 0x0;
    this['root']["querySelectorAll"]("[data-storyboard-3d-project-search]")["forEach"](_0x4c21a0 => {
      const _0x1bbfe6 = _0x4c21a0["getAttribute"]('data-storyboard-3d-project-search') || '';
      const _0x138a50 = !_0x59fd1a || _0x1bbfe6['includes'](_0x59fd1a);
      _0x4c21a0["hidden"] = !_0x138a50;
      if (_0x138a50) {
        _0x572346 += 0x1;
      }
    });
    const _0x18a0f6 = this["root"]['querySelector']("[data-storyboard-3d-search-empty]");
    if (_0x18a0f6) {
      _0x18a0f6["hidden"] = _0x572346 > 0x0 || !_0x59fd1a;
    }
  }
  ["_findProject"](_0x2da4f5) {
    const _0x4b2d6b = normalizeText(_0x2da4f5);
    return this["_readProjects"]()["find"](_0xbec07e => _0xbec07e['projectId'] === _0x4b2d6b) || null;
  }
  ["_cloneProject"](_0x1b813a) {
    const _0x2b979a = this["_findProject"](_0x1b813a);
    if (!_0x2b979a) {
      return ![];
    }
    try {
      const _0x54fa17 = this['onCloneProject']?.(_0x2b979a["projectId"]);
      if (!_0x54fa17) {
        this["onNotify"]?.("克隆项目失败。", "error");
        return ![];
      }
      this["onNotify"]?.("已克隆：" + _0x2b979a["title"], "success");
      this["render"]();
      return _0x54fa17;
    } catch (_0x17ea22) {
      this["onNotify"]?.(_0x17ea22?.["message"] || "克隆项目失败。", "error");
      return ![];
    }
  }
  ["_startProjectRename"](_0x4418e1) {
    const _0x117631 = this["_findProject"](_0x4418e1);
    if (!_0x117631) {
      return ![];
    }
    this["openProjectMenuId"] = '';
    this['confirmingDeleteProjectId'] = '';
    this["editingProjectId"] = _0x117631["projectId"];
    this['editingProjectName'] = _0x117631["title"];
    this["render"]();
    return !![];
  }
  ["_commitProjectRename"]({
    render = !![]
  } = {}) {
    const _0x2067db = this["editingProjectId"];
    const _0x5a7cc6 = this["_findProject"](_0x2067db);
    const _0x3e6e8d = normalizeText(this['editingProjectName'])["slice"](0x0, 0x78);
    if (!_0x5a7cc6) {
      this["_cancelProjectRename"]({
        'render': render
      });
      return ![];
    }
    if (!_0x3e6e8d) {
      this["onNotify"]?.("项目名称不能为空。", "error");
      if (render) {
        this["render"]();
      }
      return ![];
    }
    if (_0x3e6e8d === _0x5a7cc6["title"]) {
      this['_cancelProjectRename']({
        'render': render
      });
      return _0x5a7cc6;
    }
    try {
      const _0x43f156 = this["onRenameProject"]?.(_0x2067db, _0x3e6e8d);
      if (!_0x43f156) {
        this['onNotify']?.("重命名项目失败。", "error");
        if (render) {
          this["render"]();
        }
        return ![];
      }
      this["editingProjectId"] = '';
      this['editingProjectName'] = '';
      this["onNotify"]?.('已重命名：' + _0x3e6e8d, 'success');
      if (render) {
        this["render"]();
      }
      return _0x43f156;
    } catch (_0x8c990d) {
      this["onNotify"]?.(_0x8c990d?.["message"] || "重命名项目失败。", "error");
      if (render) {
        this["render"]();
      }
      return ![];
    }
  }
  ["_cancelProjectRename"]({
    render = !![]
  } = {}) {
    const _0x3f388a = Boolean(this['editingProjectId']);
    this["editingProjectId"] = '';
    this["editingProjectName"] = '';
    if (render && _0x3f388a) {
      this["render"]();
    }
    return _0x3f388a;
  }
  ['_closeProjectMenu']() {
    if (!this["openProjectMenuId"]) {
      return ![];
    }
    this['openProjectMenuId'] = '';
    this["root"]?.["querySelectorAll"](".storyboard-3d-home-project-card.is-menu-open")["forEach"](_0x2ee499 => _0x2ee499["classList"]["remove"]("is-menu-open"));
    this["root"]?.['querySelectorAll']('.storyboard-3d-home-project-menu:not([hidden])')["forEach"](_0x2ecc51 => {
      _0x2ecc51["hidden"] = !![];
    });
    this["root"]?.["querySelectorAll"]('[data-storyboard-3d-home-action=\x22toggle-project-menu\x22]')["forEach"](_0x39b99d => _0x39b99d["setAttribute"]('aria-expanded', "false"));
    return !![];
  }
  ["_deleteProject"](_0x591f1b) {
    const _0x969c3f = this['_findProject'](_0x591f1b);
    if (!_0x969c3f || this["confirmingDeleteProjectId"] !== _0x969c3f['projectId']) {
      return ![];
    }
    try {
      const _0x250ced = this['onDeleteProject']?.(_0x969c3f["projectId"]);
      if (!_0x250ced) {
        this["onNotify"]?.('删除项目失败。', "error");
        this["render"]();
        return ![];
      }
      this['confirmingDeleteProjectId'] = '';
      this['onNotify']?.("已删除：" + _0x969c3f['title'], "success");
      this['render']();
      return !![];
    } catch (_0x571f62) {
      this["onNotify"]?.(_0x571f62?.["message"] || '删除项目失败。', "error");
      this["render"]();
      return ![];
    }
  }
  ["_startProjectDelete"](_0x51cb82) {
    const _0x9e1a06 = this['_findProject'](_0x51cb82);
    if (!_0x9e1a06) {
      return ![];
    }
    this["openProjectMenuId"] = '';
    this["_cancelProjectRename"]({
      'render': ![]
    });
    this['confirmingDeleteProjectId'] = _0x9e1a06["projectId"];
    this["render"]();
    [...(this['root']?.["querySelectorAll"]('[data-storyboard-3d-home-action=\x22confirm-project-delete\x22]') || [])]['find'](_0x2fbeaa => _0x2fbeaa["getAttribute"]("data-storyboard-3d-project-id") === _0x9e1a06['projectId'])?.["focus"]?.();
    return !![];
  }
  ["_cancelProjectDelete"]({
    render = !![],
    focusProjectId = ''
  } = {}) {
    const _0x208be5 = this['confirmingDeleteProjectId'] || normalizeText(focusProjectId);
    const _0x2ca43d = Boolean(this["confirmingDeleteProjectId"]);
    this["confirmingDeleteProjectId"] = '';
    if (render && _0x2ca43d) {
      this["render"]();
    }
    render && _0x208be5 && [...(this["root"]?.["querySelectorAll"]("[data-storyboard-3d-home-action=\"toggle-project-menu\"]") || [])]["find"](_0x311973 => _0x311973["getAttribute"]("data-storyboard-3d-project-id") === _0x208be5)?.['focus']?.();
    return _0x2ca43d;
  }
  ["_handleClick"](_0x2254d7) {
    const _0x141bf9 = _0x2254d7["target"]["closest"]("[data-storyboard-3d-home-action]");
    if (!_0x141bf9 || !this["root"]?.["contains"](_0x141bf9)) {
      this['_closeProjectMenu']();
      return;
    }
    const _0x3756ed = _0x141bf9['getAttribute']("data-storyboard-3d-home-action");
    const _0x3276bf = _0x141bf9['getAttribute']('data-storyboard-3d-project-id') || '';
    if (_0x3756ed === "toggle-project-menu") {
      this["_cancelProjectDelete"]({
        'render': ![]
      });
      this["openProjectMenuId"] = this["openProjectMenuId"] === _0x3276bf ? '' : _0x3276bf;
      this["_cancelProjectRename"]({
        'render': ![]
      });
      this["render"]();
      this["openProjectMenuId"] && [...(this['root']?.["querySelectorAll"]("[data-storyboard-3d-home-action=\"clone-project\"]") || [])]['find'](_0x4495b5 => _0x4495b5["getAttribute"]("data-storyboard-3d-project-id") === _0x3276bf)?.["focus"]?.();
      return;
    }
    if (_0x3756ed === "clone-project") {
      this["openProjectMenuId"] = '';
      this["_cloneProject"](_0x3276bf);
      return;
    }
    if (_0x3756ed === "start-project-rename") {
      this["_startProjectRename"](_0x3276bf);
      return;
    }
    if (_0x3756ed === "delete-project") {
      this["_startProjectDelete"](_0x3276bf);
      return;
    }
    if (_0x3756ed === "confirm-project-delete") {
      if (this["confirmingDeleteProjectId"] === _0x3276bf) {
        this["_deleteProject"](_0x3276bf);
      }
      return;
    }
    if (_0x3756ed === "cancel-project-delete") {
      this["_cancelProjectDelete"]({
        'focusProjectId': _0x3276bf
      });
      return;
    }
    this['_closeProjectMenu']();
    if (_0x3756ed === "choose-reference-image") {
      this["root"]?.["querySelector"]("[data-storyboard-3d-reference-image-input]")?.["click"]();
      return;
    }
    if (_0x3756ed === 'remove-reference-image') {
      const _0x4d87c5 = Number(_0x141bf9["dataset"]["referenceIndex"]);
      if (Number["isInteger"](_0x4d87c5) && this["referenceImages"][_0x4d87c5]) {
        this['urlApi']?.["revokeObjectURL"]?.(this["referenceImages"][_0x4d87c5]['url']);
        this["referenceImages"]["splice"](_0x4d87c5, 0x1);
        this["referenceImageUrl"] = this["referenceImages"][0x0]?.['url'] || '';
        this["referenceImageName"] = this["referenceImages"][0x0]?.["name"] || '';
      } else {
        this["_clearReferenceImage"]();
      }
      this["render"]();
      return;
    }
    if (_0x3756ed === 'install-model-pack') {
      void this["_installModelPack"]();
      return;
    }
    if (_0x3756ed === "skip-model-pack") {
      this['modelPackDialogOpen'] = ![];
      this["generationError"] = "未下载模型包，暂时不能生成 3D 场景。";
      this["render"]();
      return;
    }
    if (_0x3756ed === "generate-project") {
      this["_generateProject"]();
      return;
    }
    if (_0x3756ed === 'new-project') {
      this["onCreateProject"]?.();
      return;
    }
    _0x3756ed === "open-project" && this['onOpenProject']?.(_0x3276bf);
  }
  ["_handleInput"](_0x5969dc) {
    if (_0x5969dc["target"]['matches']("[data-storyboard-3d-project-rename-input]")) {
      this["editingProjectName"] = String(_0x5969dc["target"]["value"] || '')["slice"](0x0, 0x78);
      return;
    }
    if (_0x5969dc["target"]["matches"]("[data-storyboard-3d-prompt-input]")) {
      this["prompt"] = String(_0x5969dc["target"]['value'] || '')['slice'](0x0, STORYBOARD_3D_PROMPT_MAX_CHARACTERS);
      this["generationError"] = '';
      this['_syncGenerationUi']();
      return;
    }
    if (!_0x5969dc["target"]["matches"]('[data-storyboard-3d-project-search-input]')) {
      return;
    }
    this["searchQuery"] = String(_0x5969dc["target"]["value"] || '');
    this["_applySearch"]();
  }
  ["_handleChange"](_0x3df679) {
    if (_0x3df679["target"]["matches"]('[data-storyboard-3d-project-rename-input]')) {
      this["_commitProjectRename"]({
        'render': ![]
      });
      this["setTimeoutFn"]?.(() => {
        if (!this['_destroyed']) {
          this['render']();
        }
      }, 0x0);
      return;
    }
    if (!_0x3df679["target"]["matches"]('[data-storyboard-3d-reference-image-input]')) {
      return;
    }
    const _0x5e51a6 = Array["from"](_0x3df679["target"]["files"] || []);
    _0x3df679["target"]["value"] = '';
    if (!_0x5e51a6['length']) {
      return;
    }
    if (_0x5e51a6["some"](_0x2929c5 => !String(_0x2929c5['type'] || '')["toLowerCase"]()['startsWith']('image/') || _0x2929c5["size"] > 0x20 * 0x400 * 0x400) || this["referenceImages"]['length'] + _0x5e51a6['length'] > 0x6) {
      this["generationError"] = "最多添加 6 张参考图，每张图片不超过 32 MB。";
      this["_syncGenerationUi"]();
      return;
    }
    this["referenceImages"]["push"](..._0x5e51a6["map"](_0xed8158 => ({
      'file': _0xed8158,
      'url': this["urlApi"]?.["createObjectURL"]?.(_0xed8158) || '',
      'name': String(_0xed8158['name'] || '参考图')
    })));
    this['referenceImageUrl'] = this['referenceImages'][0x0]?.["url"] || '';
    this["referenceImageName"] = this["referenceImages"][0x0]?.['name'] || '';
    !this["referenceImageUrl"] && (this['generationError'] = "无法读取参考图，请重新选择。");
    this["render"]();
  }
  ["_clearReferenceImage"]() {
    for (const _0x40f91f of new Set([this['referenceImageUrl'], ...this["referenceImages"]["map"](_0x4d9988 => _0x4d9988["url"])]["filter"](Boolean))) {
      this["urlApi"]?.["revokeObjectURL"]?.(_0x40f91f);
    }
    this["referenceImages"] = [];
    this["referenceImageUrl"] = '';
    this["referenceImageName"] = '';
  }
  async ['_refreshModelPackStatus']({
    promptIfMissing = ![]
  } = {}) {
    if (promptIfMissing) {
      this['_promptForMissingModelPack'] = !![];
    }
    if (this['modelPackStatus']["state"] === "installing") {
      return this["modelPackStatus"];
    }
    if (this["_modelPackCheckPromise"]) {
      return this["_modelPackCheckPromise"];
    }
    if (typeof this["modelPackApi"]?.["getStatus"] !== "function") {
      this["modelPackStatus"] = {
        'state': "error",
        'installed': ![],
        'assets': [],
        'error': '模型包服务尚未初始化。'
      };
      if (this["_promptForMissingModelPack"]) {
        this['modelPackDialogOpen'] = !![];
      }
      this["render"]();
      return this["modelPackStatus"];
    }
    this["modelPackStatus"] = {
      ...this["modelPackStatus"],
      'state': "checking",
      'error': ''
    };
    this["_syncGenerationUi"]();
    const _0x310e5c = Promise["resolve"](this['modelPackApi']["getStatus"]())['then'](_0x1713f1 => {
      const _0x1e4137 = Array["isArray"](_0x1713f1?.["assets"]) ? _0x1713f1['assets'] : [];
      const _0x46e96d = _0x1713f1?.["installed"] === !![] && _0x1e4137['length'] > 0x0;
      this["modelPackStatus"] = {
        ..._0x1713f1,
        'state': _0x46e96d ? 'installed' : "missing",
        'installed': _0x46e96d,
        'assets': _0x1e4137,
        'error': ''
      };
      this["modelPackDialogOpen"] = !_0x46e96d && this["_promptForMissingModelPack"];
      this["render"]();
      return this["modelPackStatus"];
    })["catch"](_0x24075c => {
      this["modelPackStatus"] = {
        'state': "error",
        'installed': ![],
        'assets': [],
        'error': normalizeText(_0x24075c?.['message']) || "无法检测模型包状态。"
      };
      if (this['_promptForMissingModelPack']) {
        this["modelPackDialogOpen"] = !![];
      }
      this['render']();
      return this['modelPackStatus'];
    })["finally"](() => {
      this["_modelPackCheckPromise"] = null;
    });
    this["_modelPackCheckPromise"] = _0x310e5c;
    return _0x310e5c;
  }
  async ["_installModelPack"]() {
    if (this["modelPackStatus"]["state"] === 'installing') {
      return null;
    }
    if (typeof this["modelPackApi"]?.['install'] !== "function") {
      this['modelPackStatus'] = {
        ...this["modelPackStatus"],
        'error': "模型包下载服务尚未初始化。"
      };
      this["render"]();
      return null;
    }
    this["modelPackDialogOpen"] = !![];
    this['modelPackStatus'] = {
      ...this["modelPackStatus"],
      'state': "installing",
      'installed': ![],
      'error': '',
      'installProgress': {
        'state': 'downloading',
        'downloadedBytes': 0x0,
        'totalBytes': Math['max'](0x0, Number(this["modelPackStatus"]['downloadBytes']) || 0x0),
        'percent': 0x0,
        'currentSource': '',
        'completedSources': 0x0,
        'totalSources': 0x0,
        'message': "正在连接模型包下载源"
      }
    };
    this['render']();
    try {
      const _0x47f972 = this["modelPackApi"]["install"]();
      this["_startModelPackProgressPolling"]();
      const _0x14003c = await _0x47f972;
      const _0x53d486 = Array["isArray"](_0x14003c?.["assets"]) ? _0x14003c['assets'] : [];
      if (_0x14003c?.['installed'] !== !![] || _0x53d486["length"] === 0x0) {
        throw new Error("模型包下载未完成，请重试。");
      }
      this["_stopModelPackProgressPolling"]();
      this["modelPackStatus"] = {
        ..._0x14003c,
        'state': 'installed',
        'installed': !![],
        'assets': _0x53d486,
        'error': ''
      };
      this["modelPackDialogOpen"] = ![];
      this["generationError"] = '';
      this['onNotify']?.("3D 场景基础模型包下载完成。", 'success');
      this["render"]();
      return this['modelPackStatus'];
    } catch (_0x573145) {
      this['_stopModelPackProgressPolling']();
      try {
        const _0x21709d = await this["modelPackApi"]["getStatus"]?.();
        const _0x5391a9 = Array['isArray'](_0x21709d?.["assets"]) ? _0x21709d["assets"] : [];
        if (_0x21709d?.["installed"] === !![] && _0x5391a9["length"] > 0x0) {
          this["modelPackStatus"] = {
            ..._0x21709d,
            'state': "installed",
            'installed': !![],
            'assets': _0x5391a9,
            'error': ''
          };
          this['modelPackDialogOpen'] = ![];
          this['generationError'] = '';
          this["onNotify"]?.('3D\x20场景基础模型包下载完成。', "success");
          this["render"]();
          return this["modelPackStatus"];
        }
      } catch {}
      this["modelPackStatus"] = {
        'state': "error",
        'installed': ![],
        'assets': [],
        'error': normalizeText(_0x573145?.['message']) || "模型包下载失败，请稍后重试。"
      };
      this["modelPackDialogOpen"] = !![];
      this["render"]();
      return null;
    }
  }
  ["_startModelPackProgressPolling"]() {
    this["_stopModelPackProgressPolling"]();
    if (typeof this['modelPackApi']?.['getStatus'] !== "function") {
      return;
    }
    const _0x24e369 = ++this['_modelPackProgressPollGeneration'];
    const _0x23218e = async () => {
      if (this['_destroyed'] || _0x24e369 !== this["_modelPackProgressPollGeneration"] || this['modelPackStatus']["state"] !== "installing") {
        return;
      }
      try {
        const _0x343533 = await this['modelPackApi']['getStatus']();
        if (this["_destroyed"] || _0x24e369 !== this['_modelPackProgressPollGeneration'] || this["modelPackStatus"]["state"] !== "installing") {
          return;
        }
        this["modelPackStatus"] = {
          ...this["modelPackStatus"],
          ..._0x343533,
          'state': 'installing',
          'installed': ![],
          'assets': this['modelPackStatus']['assets'],
          'error': ''
        };
        this['render']();
      } catch {}
      if (this["_destroyed"] || _0x24e369 !== this['_modelPackProgressPollGeneration'] || this["modelPackStatus"]["state"] !== "installing") {
        return;
      }
      this["_modelPackProgressTimer"] = this["setTimeoutFn"]?.(_0x23218e, this["modelPackProgressPollIntervalMs"]);
    };
    void _0x23218e();
  }
  ["_stopModelPackProgressPolling"]() {
    this["_modelPackProgressPollGeneration"] += 0x1;
    this["_modelPackProgressTimer"] !== null && (this["clearTimeoutFn"]?.(this["_modelPackProgressTimer"]), this["_modelPackProgressTimer"] = null);
  }
  ["_handleKeyDown"](_0x35af01) {
    if (_0x35af01["key"] === "Escape" && this["confirmingDeleteProjectId"]) {
      _0x35af01["preventDefault"]();
      this["_cancelProjectDelete"]();
      return;
    }
    if (_0x35af01["target"]['matches']("[data-storyboard-3d-project-rename-input]")) {
      if (_0x35af01['isComposing']) {
        return;
      }
      if (_0x35af01["key"] === "Enter") {
        _0x35af01["preventDefault"]();
        this["editingProjectName"] = String(_0x35af01["target"]['value'] || '')["slice"](0x0, 0x78);
        this['_commitProjectRename']();
      } else {
        _0x35af01["key"] === "Escape" && (_0x35af01["preventDefault"](), this['_cancelProjectRename']());
      }
      return;
    }
    if (!_0x35af01["target"]["matches"]("[data-storyboard-3d-prompt-input]")) {
      return;
    }
    if (_0x35af01["isComposing"] || _0x35af01["key"] !== "Enter" || !_0x35af01["ctrlKey"] && !_0x35af01["metaKey"]) {
      return;
    }
    _0x35af01['preventDefault']();
    this['_generateProject']();
  }
  ["show"]() {
    this["mount"]();
    if (!this["root"]) {
      return null;
    }
    this["render"]();
    this["root"]["hidden"] = ![];
    this["root"]['setAttribute']("aria-hidden", "false");
    void this['_refreshModelPackStatus']({
      'promptIfMissing': !![]
    });
    return this;
  }
  ["hide"]() {
    if (!this["root"]) {
      return ![];
    }
    this["openProjectMenuId"] = '';
    this["editingProjectId"] = '';
    this["editingProjectName"] = '';
    this["confirmingDeleteProjectId"] = '';
    this["root"]["hidden"] = !![];
    this["root"]["setAttribute"]('aria-hidden', "true");
    return !![];
  }
  ["isVisible"]() {
    return Boolean(this['root'] && !this["root"]['hidden']);
  }
  ["focusProject"](_0xa81687) {
    const _0x243fe1 = String(_0xa81687 || '')["trim"]();
    if (!_0x243fe1 || !this['root'] || this["root"]['hidden']) {
      return ![];
    }
    const _0x36657b = [...this["root"]["querySelectorAll"](".storyboard-3d-home-project-details[data-storyboard-3d-home-action=\"open-project\"]")]["find"](_0x47884a => _0x47884a['getAttribute']("data-storyboard-3d-project-id") === _0x243fe1);
    if (!_0x36657b || typeof _0x36657b["focus"] !== "function") {
      return ![];
    }
    _0x36657b["focus"]({
      'preventScroll': !![]
    });
    return !![];
  }
  ["destroy"]() {
    this["_destroyed"] = !![];
    this['_stopModelPackProgressPolling']();
    if (!this["root"]) {
      return;
    }
    this["root"]["removeEventListener"]("contextmenu", containWorkspaceContextMenu);
    this["root"]["removeEventListener"]("click", this["_handleClick"]);
    this['root']["removeEventListener"]('input', this["_handleInput"]);
    this['root']["removeEventListener"]("change", this["_handleChange"]);
    this["root"]["removeEventListener"]("keydown", this['_handleKeyDown']);
    this['_modelSelectorController']?.["destroy"]?.();
    this['_modelSelectorController'] = null;
    this["_clearReferenceImage"]();
    this["root"]["remove"]();
    this["root"] = null;
  }
}
export function initStoryboard3DWorkspaceHome(_0x2ff9a6 = {}) {
  const _0x1e1d33 = new Storyboard3DWorkspaceHome(_0x2ff9a6);
  _0x1e1d33["mount"]();
  return _0x1e1d33;
}