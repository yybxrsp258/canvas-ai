import { renderRequestDebugButton } from '../debugRequestWindow.js';
import { renderStoryGenerationSpinner } from './storyAsyncButtonPresentation.js';
function escapeHtml(_0x585114) {
  return String(_0x585114 ?? '')["replaceAll"]('&', '&amp;')['replaceAll']('<', '&lt;')["replaceAll"]('>', "&gt;")["replaceAll"]('\x22', "&quot;")["replaceAll"]('\x27', "&#39;");
}
function normalizeText(_0x2918ba) {
  return String(_0x2918ba ?? '')["trim"]();
}
function defaultLocalPathToUrl(_0x229bda) {
  return normalizeText(_0x229bda);
}
function defaultIsUsableImageUrl(_0x41d2e2) {
  return Boolean(normalizeText(_0x41d2e2));
}
function defaultRenderImageOrEmpty({
  imageUrl = '',
  alt = '',
  className = ''
} = {}) {
  return imageUrl ? '<img\x20class=\x22' + escapeHtml(className) + "\" src=\"" + escapeHtml(imageUrl) + "\" alt=\"" + escapeHtml(alt) + "\" loading=\"lazy\" decoding=\"async\" draggable=\"false\">" : '<div\x20class=\x22' + escapeHtml(className) + " is-empty\" role=\"img\" aria-label=\"" + escapeHtml(alt) + "\"></div>";
}
function defaultRenderEpisodeCardActionIcon() {
  return '';
}
export function createStoryClipProductionPresentation({
  localPathToUrl = defaultLocalPathToUrl,
  isUsableImageUrl = defaultIsUsableImageUrl,
  renderImageOrEmpty = defaultRenderImageOrEmpty,
  renderDeleteIcon = () => '',
  renderEpisodeCardActionIcon = defaultRenderEpisodeCardActionIcon
} = {}) {
  function _0xd5a473(_0x189be3 = {}) {
    const _0xd6b4ef = [_0x189be3["posterUrl"], _0x189be3["thumbUrl"], _0x189be3['thumbnailUrl'], _0x189be3['coverUrl'], localPathToUrl(_0x189be3["posterLocalPath"]), localPathToUrl(_0x189be3["thumbLocalPath"]), localPathToUrl(_0x189be3['thumbnailLocalPath'])];
    return _0xd6b4ef["map"](_0x57b768 => normalizeText(_0x57b768))["find"](isUsableImageUrl) || '';
  }
  function _0x1b6d5e(_0xdb0509 = {}) {
    const _0x365be7 = Array["isArray"](_0xdb0509?.["video"]?.["results"]) ? _0xdb0509["video"]["results"]["filter"](_0x235cda => _0x235cda && typeof _0x235cda === 'object') : [];
    if (!_0x365be7['length']) {
      return [];
    }
    const _0x5c32df = Math["max"](0x0, Math["min"](_0x365be7["length"] - 0x1, Math['trunc'](Number(_0xdb0509?.["video"]?.['activeIndex']) || 0x0)));
    return [_0x365be7[_0x5c32df], ..._0x365be7["filter"]((_0x3bd7db, _0x29df4b) => _0x29df4b !== _0x5c32df)]["filter"](_0x27c7c8 => !normalizeText(_0x27c7c8["error"]));
  }
  function _0x202914(_0x4608cb = {}) {
    const _0xa19111 = Array["isArray"](_0x4608cb?.["clips"]) ? _0x4608cb['clips'] : [];
    for (const _0x1b4564 of _0xa19111) {
      for (const _0x4d7fe6 of _0x1b6d5e(_0x1b4564)) {
        const _0x22b5a7 = _0xd5a473(_0x4d7fe6);
        if (_0x22b5a7) {
          return {
            'kind': "image",
            'url': _0x22b5a7,
            'source': 'video-result'
          };
        }
      }
    }
    const _0x572cdc = normalizeText(_0x4608cb?.["coverUrl"]);
    if (isUsableImageUrl(_0x572cdc)) {
      return {
        'kind': "image",
        'url': _0x572cdc,
        'source': "episode-cover"
      };
    }
    return {
      'kind': 'empty',
      'url': '',
      'source': 'empty'
    };
  }
  function _0x109ea1(_0x31c8d8 = {}) {
    const _0x26c452 = _0x31c8d8["media"] || {
      'kind': "empty",
      'url': '',
      'source': "empty"
    };
    const _0x2c16d3 = normalizeText(_0x31c8d8["title"]) || '第\x20' + (_0x31c8d8["number"] || '') + '\x20集';
    if (_0x26c452["kind"] === "image") {
      return "<img class=\"story-episode-cover\" src=\"" + escapeHtml(_0x26c452['url']) + "\" alt=\"" + escapeHtml(_0x2c16d3) + "\" data-story-episode-cover-source=\"" + escapeHtml(_0x26c452["source"]) + "\" loading=\"lazy\" decoding=\"async\" draggable=\"false\">";
    }
    return renderImageOrEmpty({
      'imageUrl': '',
      'alt': _0x2c16d3,
      'className': "story-episode-cover"
    });
  }
  function _0xf422de(_0x3d22f7 = {}) {
    const {
      id = '',
      number = '',
      sequenceLabel = '第\x20' + number + '\x20集',
      title = '',
      status = '',
      characterCount = 0x0,
      sceneCount = 0x0,
      propCount = 0x0,
      clipCount = 0x0,
      isChecked = ![],
      isSelectionMode = ![],
      isSplitting = ![],
      disabled = ![],
      actionKind = "generate",
      actionLabel: _0x46a1f4 = '',
      experimentalActionMarkup = '',
      requestDebugMarkup = '',
      splitDraftMarkup = ''
    } = _0x3d22f7;
    const _0x197279 = isSelectionMode ? '' + (isChecked ? "取消选择" : '选择') + sequenceLabel + '：' + title : '' + (actionKind === 'edit' ? '进入' : '生成') + sequenceLabel + (actionKind === 'edit' ? '编辑' : '分镜脚本') + '：' + title;
    const _0x2a4fef = isSelectionMode ? '' : actionKind === "generate" ? "<span class=\"story-episode-primary-actions\"><button type=\"button\" class=\"story-episode-enter story-episode-enter--" + escapeHtml(actionKind) + '\x22\x20data-story-action=\x22split-episode\x22\x20data-story-episode-id=\x22' + escapeHtml(id) + "\" aria-label=\"" + escapeHtml(_0x197279) + '\x22\x20' + (disabled ? 'disabled' : '') + " aria-busy=\"" + isSplitting + '\x22>' + (isSplitting ? renderStoryGenerationSpinner({
      'button': !![]
    }) : renderEpisodeCardActionIcon(actionKind)) + '<span\x20class=\x22story-episode-enter-label\x22>' + escapeHtml(isSplitting ? '生成中' : _0x46a1f4) + "</span></button>" + renderRequestDebugButton('data-story-action=\x22debug-episode-split-request\x22\x20data-story-episode-id=\x22' + escapeHtml(id) + '\x22\x20' + (disabled ? 'disabled' : '')) + "</span>" : '<span\x20class=\x22story-episode-enter\x20story-episode-enter--' + escapeHtml(actionKind) + "\" aria-hidden=\"true\">" + renderEpisodeCardActionIcon(actionKind) + "<span class=\"story-episode-enter-label\">" + escapeHtml(_0x46a1f4) + "</span></span>";
    const _0x2d4428 = actionKind === "edit";
    const _0x457264 = isSelectionMode || !_0x2d4428 ? '' : "<button type=\"button\" class=\"story-episode-regenerate story-episode-enter story-regenerate-button\" data-story-action=\"regenerate-episode\" data-story-episode-id=\"" + escapeHtml(id) + "\" aria-label=\"重新生成" + escapeHtml(sequenceLabel) + '\x22\x20' + (disabled ? "disabled" : '') + " aria-busy=\"" + isSplitting + '\x22>' + (isSplitting ? renderStoryGenerationSpinner({
      'button': !![]
    }) : renderEpisodeCardActionIcon('regenerate')) + '<span\x20class=\x22story-episode-enter-label\x22>' + (isSplitting ? "重新生成中" : "重新生成") + '</span></button>';
    const _0x2e7ee5 = !isSelectionMode && Boolean(experimentalActionMarkup || requestDebugMarkup);
    const _0x1856e0 = _0x2e7ee5 ? "<div class=\"story-episode-utility-actions\">" + experimentalActionMarkup + requestDebugMarkup + "</div>" + _0x457264 : _0x457264;
    const _0x58201b = '\x0a\x20\x20\x20\x20\x20\x20' + (isSelectionMode ? "<span class=\"story-asset-select-indicator\" aria-hidden=\"true\">" + (isChecked ? '✓' : '') + '</span>' : '') + "\n      " + _0x109ea1(_0x3d22f7) + "\n      <span class=\"story-episode-copy\">\n        <span class=\"story-episode-status\">" + escapeHtml(status) + '</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22story-episode-title\x22>' + escapeHtml(sequenceLabel) + '：' + escapeHtml(title) + "</span>\n        <span class=\"story-episode-summary\">角色 " + characterCount + " · 场景 " + sceneCount + '\x20·\x20道具\x20' + propCount + " · 片段 " + (clipCount || "待拆分") + "</span>\n        " + _0x2a4fef + "\n      </span>";
    const _0x3542ca = isSelectionMode || actionKind === 'edit';
    const _0x2ce9e2 = _0x3542ca ? '<button\x20type=\x22button\x22\x20class=\x22story-episode-open\x22\x20data-story-select-episode=\x22' + escapeHtml(id) + '\x22\x20data-story-open-episode=\x22' + escapeHtml(id) + "\" aria-label=\"" + escapeHtml(_0x197279) + '\x22\x20aria-pressed=\x22' + (isSelectionMode ? String(isChecked) : 'false') + '\x22\x20' + (disabled ? "disabled aria-disabled=\"true\"" : '') + '>' + _0x58201b + '\x0a\x20\x20\x20\x20</button>' : '<div\x20class=\x22story-episode-open\x20story-episode-open--static\x22\x20data-story-select-episode=\x22' + escapeHtml(id) + "\" aria-label=\"" + escapeHtml(_0x197279) + '\x22>' + _0x58201b + "\n    </div>";
    return "<article class=\"story-episode-card " + (_0x2e7ee5 ? "has-developer-actions has-inline-actions" : '') + '\x20' + (isSelectionMode ? "is-selection-mode" : '') + '\x20' + (isChecked ? "is-checked" : '') + '\x20' + (isSplitting ? 'is-splitting' : '') + "\" data-story-marquee-item data-story-marquee-id=\"" + escapeHtml(id) + "\" aria-busy=\"" + isSplitting + "\">\n    " + _0x2ce9e2 + "\n    " + _0x1856e0 + "\n    " + (isSelectionMode ? '' : splitDraftMarkup) + "\n    " + (isSplitting ? "<div class=\"story-episode-loading storyboard-script-loading-overlay\" role=\"status\" aria-live=\"polite\">\n      <div class=\"storyboard-script-loading-spinner\"></div>\n      <div class=\"storyboard-script-loading-label\">正在拆分" + escapeHtml(sequenceLabel) + "</div>\n      <div class=\"storyboard-script-loading-bar\"><div class=\"storyboard-script-loading-bar-fill\"></div></div>\n    </div>" : '') + '\x0a\x20\x20</article>';
  }
  function _0x4e968c(_0x316998 = {}) {
    if (_0x316998["kind"] === "card") {
      return _0xf422de(_0x316998["card"]);
    }
    const _0x172caa = Array["isArray"](_0x316998['cards']) ? _0x316998["cards"] : [];
    const _0x2fe923 = _0x316998['batchControl'] || {};
    const _0x27939b = Math["max"](0x0, Math["trunc"](Number(_0x316998["selectedCount"]) || 0x0));
    const _0x10a2b5 = _0x2fe923["operation"] === "splitting-selected";
    const _0x375d30 = _0x2fe923['operation'] === "splitting-all";
    const _0x561ce6 = _0x10a2b5 || _0x375d30;
    const _0x39cb3e = _0x561ce6 ? "<button type=\"button\" class=\"story-primary-button story-main-action-button\" data-story-action=\"cancel-episode-split-batch\" " + (_0x2fe923['cancelRequested'] ? "disabled" : '') + '\x20aria-busy=\x22true\x22>' + renderStoryGenerationSpinner({
      'button': !![]
    }) + escapeHtml(_0x2fe923["cancelRequested"] ? '正在停止' : '停止批量拆分') + '</button>' : '';
    return "<div class=\"story-episodes-page story-content-page " + (_0x316998["experimentalMode"] ? "is-experimental-split-mode" : '') + "\" data-story-marquee-page-surface=\"episodes\" data-story-experimental-mode=\"" + Boolean(_0x316998["experimentalMode"]) + "\">\n    <header class=\"story-page-heading\">\n      <div>\n        <span class=\"story-eyebrow\">" + escapeHtml(_0x316998["eyebrow"] || "剧本拆分结果") + "</span>\n        <h2>" + escapeHtml(_0x316998['title'] || "分集视频") + '</h2>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-heading-actions\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + (_0x316998["experimentalModeToggleMarkup"] || '') + (_0x316998["splitTextModelSelectorMarkup"] ? '\x0a\x20\x20\x20\x20\x20\x20' + _0x316998["splitTextModelSelectorMarkup"] : '') + "\n        " + (_0x316998["selectionMode"] ? "<button type=\"button\" class=\"story-secondary-button\" data-story-action=\"toggle-all-episodes\" aria-pressed=\"" + Boolean(_0x316998["allEpisodesSelected"]) + '\x22\x20' + (_0x2fe923["disabled"] || !_0x172caa["length"] ? "disabled" : '') + '>' + (_0x316998["allEpisodesSelected"] ? "取消全选" : '全选') + '</button><button\x20type=\x22button\x22\x20class=\x22story-secondary-button\x22\x20data-story-action=\x22cancel-episode-selection\x22>取消多选</button>' + (_0x561ce6 ? _0x39cb3e : "<button type=\"button\" class=\"story-primary-button story-main-action-button\" data-story-action=\"split-selected-episodes\" " + (_0x2fe923['disabled'] || !_0x27939b ? "disabled" : '') + " aria-busy=\"false\">拆分选中" + (_0x27939b ? '\x20(' + _0x27939b + ')' : '') + "</button>") : "<button type=\"button\" class=\"story-secondary-button workspace-selection-trigger\" data-story-action=\"toggle-episode-selection\" " + (_0x2fe923["disabled"] || !_0x172caa["length"] ? "disabled" : '') + ">多选</button>" + (_0x561ce6 ? _0x39cb3e : "<button type=\"button\" class=\"story-primary-button story-main-action-button\" data-story-action=\"split-all-episodes\" " + (_0x2fe923["disabled"] || !_0x172caa["length"] ? "disabled" : '') + '\x20aria-busy=\x22false\x22>批量拆分</button>')) + "\n      </div>\n    </header>\n    <p class=\"story-page-description\">" + escapeHtml(_0x316998["description"] || '每一集会形成一套片段脚本；确认后可创建为新的画布页面。') + "</p>\n    <div class=\"story-episode-grid\">\n      " + _0x172caa['map'](_0xf422de)["join"]('') + '\x0a\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20' + (_0x316998["footerMarkup"] || '') + "\n  </div>";
  }
  function _0x30072d(_0x313544 = {}) {
    if (isUsableImageUrl(_0x313544["imageUrl"])) {
      return "<img class=\"story-episode-asset-image story-episode-library-asset-image\" src=\"" + escapeHtml(_0x313544['imageUrl']) + "\" alt=\"" + escapeHtml(_0x313544['name']) + "\" loading=\"lazy\" decoding=\"async\">";
    }
    return "<div class=\"story-episode-asset-image story-episode-library-asset-fallback\" data-media-type=\"" + escapeHtml(_0x313544["mediaKind"] || "other") + "\" role=\"img\" aria-label=\"" + escapeHtml(_0x313544["name"] + '，' + _0x313544["typeLabel"] + '素材') + "\"><span>" + escapeHtml(_0x313544['typeLabel']) + '</span></div>';
  }
  function _0x498111(_0x2768ff = []) {
    if (!_0x2768ff["length"]) {
      return {
        'count': 0x0,
        'markup': '<div\x20class=\x22story-episode-asset-empty\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<strong>画布素材库暂无可引用素材</strong>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<span>在画布中把节点加入素材库后，可在这里直接拖入片段提示词。</span>\x0a\x20\x20\x20\x20\x20\x20</div>'
      };
    }
    const _0x4c8681 = new Map();
    _0x2768ff["forEach"](_0x5eec81 => {
      const _0x5236e3 = normalizeText(_0x5eec81['sourceAssetId']) || "ungrouped";
      !_0x4c8681["has"](_0x5236e3) && _0x4c8681["set"](_0x5236e3, {
        'name': normalizeText(_0x5eec81["assetName"]) || "未分组素材",
        'assets': []
      });
      _0x4c8681["get"](_0x5236e3)['assets']["push"](_0x5eec81);
    });
    return {
      'count': _0x2768ff["length"],
      'markup': Array["from"](_0x4c8681["entries"]())["map"](([_0x4a49c6, _0x4929c0]) => "<section data-story-episode-library-group=\"" + escapeHtml(_0x4a49c6) + "\">\n      <h3>" + escapeHtml(_0x4929c0['name']) + " · " + _0x4929c0["assets"]['length'] + " 项</h3>\n      <div class=\"story-episode-asset-grid story-episode-library-asset-grid\">\n        " + _0x4929c0['assets']["map"](_0xf86cb0 => '<button\x20type=\x22button\x22\x20draggable=\x22true\x22\x20data-story-reference-asset=\x22' + escapeHtml(_0xf86cb0['sourceAssetId']) + "\" data-story-reference-asset-index=\"" + Math["max"](0x0, Math["trunc"](Number(_0xf86cb0["sourceItemIndex"]) || 0x0)) + "\" data-story-reference-source=\"library\" data-story-reference-media-type=\"" + escapeHtml(_0xf86cb0["mediaKind"]) + '\x22\x20aria-label=\x22引用总素材\x20' + escapeHtml(_0xf86cb0["name"]) + "，仅可拖入提示词\">\n          " + _0x30072d(_0xf86cb0) + "\n          <span>" + escapeHtml(_0xf86cb0["name"]) + "</span>\n          <small>" + escapeHtml(_0xf86cb0["role"]) + "</small>\n        </button>")["join"]('') + '\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</section>')['join']('')
    };
  }
  function _0x1764bf(_0x42073a) {
    const _0x20713c = _0x42073a === 'frames' ? '<rect\x20x=\x224\x22\x20y=\x225\x22\x20width=\x2216\x22\x20height=\x2214\x22\x20rx=\x222\x22/><path\x20d=\x22m7\x2015\x203.5-3.5\x202.5\x202.5\x202-2\x202\x203\x22/><circle\x20cx=\x2215.5\x22\x20cy=\x229\x22\x20r=\x221.25\x22/>' : _0x42073a === "library" ? '<rect\x20x=\x224\x22\x20y=\x224\x22\x20width=\x227\x22\x20height=\x227\x22\x20rx=\x221.5\x22/><rect\x20x=\x2213\x22\x20y=\x224\x22\x20width=\x227\x22\x20height=\x227\x22\x20rx=\x221.5\x22/><rect\x20x=\x224\x22\x20y=\x2213\x22\x20width=\x227\x22\x20height=\x227\x22\x20rx=\x221.5\x22/><rect\x20x=\x2213\x22\x20y=\x2213\x22\x20width=\x227\x22\x20height=\x227\x22\x20rx=\x221.5\x22/>' : "<path d=\"M4 6.5h6l1.7 2H20v9.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z\"/><path d=\"M4 9h16\"/>";
    return "<span class=\"story-episode-asset-tab-icon\" data-icon=\"" + _0x42073a + '\x22\x20aria-hidden=\x22true\x22><svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22>' + _0x20713c + "</svg></span>";
  }
  function _0x7897f(_0x3a8aa0 = {}) {
    const _0x4011cd = Array['isArray'](_0x3a8aa0["assets"]) ? _0x3a8aa0["assets"] : [];
    const _0x3fde94 = Array["isArray"](_0x3a8aa0['frames']) ? _0x3a8aa0["frames"] : [];
    const _0x51e226 = Array["isArray"](_0x3a8aa0["clips"]) ? _0x3a8aa0["clips"] : [];
    const _0x5db2d0 = ["assets", "frames", "library"]["includes"](_0x3a8aa0["activeTab"]) ? _0x3a8aa0["activeTab"] : "assets";
    const _0x1f1d3a = _0x498111(Array["isArray"](_0x3a8aa0["libraryAssets"]) ? _0x3a8aa0["libraryAssets"] : []);
    const _0x25ec81 = ["character", "scene", "prop"]['map'](_0x5ada59 => '<section>\x0a\x20\x20\x20\x20\x20\x20<h3>' + escapeHtml(_0x3a8aa0["assetKindLabels"]?.[_0x5ada59] || _0x5ada59) + '</h3>\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22story-episode-asset-grid\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20' + _0x4011cd["filter"](_0x2c0e68 => _0x2c0e68["kind"] === _0x5ada59)['map'](_0x30ef91 => '<button\x20type=\x22button\x22\x20draggable=\x22true\x22\x20data-story-reference-asset=\x22' + escapeHtml(_0x30ef91['id']) + "\" aria-label=\"引用素材 " + escapeHtml(_0x30ef91["name"]) + "，仅可拖入提示词\">\n          " + renderImageOrEmpty({
      'imageUrl': _0x30ef91['imageUrl'],
      'alt': _0x30ef91["name"],
      'className': "story-episode-asset-image"
    }) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span>' + escapeHtml(_0x30ef91['name']) + "</span>\n        </button>")["join"]('') + "\n      </div>\n    </section>")["join"]('');
    const _0x39e6ba = new Map();
    _0x3fde94["forEach"](_0x9cc060 => {
      const _0x4d44ac = normalizeText(_0x9cc060['clipId']) || "unassigned";
      if (!_0x39e6ba["has"](_0x4d44ac)) {
        _0x39e6ba['set'](_0x4d44ac, []);
      }
      _0x39e6ba["get"](_0x4d44ac)["push"](_0x9cc060);
    });
    const _0x5aa993 = _0x51e226["map"]((_0x49261c, _0x44ebf7) => {
      const _0x1ded43 = normalizeText(_0x49261c?.['id']);
      return {
        'clipId': _0x1ded43,
        'label': normalizeText(_0x49261c?.["title"]) || "片段 " + (_0x44ebf7 + 0x1),
        'frames': _0x39e6ba['get'](_0x1ded43) || []
      };
    })["filter"](_0x2095c4 => _0x2095c4["frames"]["length"] > 0x0);
    const _0x22b220 = new Set(_0x5aa993["map"](_0x5015d1 => _0x5015d1['clipId']));
    _0x39e6ba["forEach"]((_0x59f023, _0xbc81e4) => {
      if (_0x22b220["has"](_0xbc81e4)) {
        return;
      }
      _0x5aa993['push']({
        'clipId': _0xbc81e4,
        'label': normalizeText(_0x59f023[0x0]?.["clipTitle"]) || "其他片段",
        'frames': _0x59f023
      });
    });
    const _0x1778ef = _0x5aa993['length'] ? _0x5aa993['map'](_0x4644cd => "<section class=\"story-episode-frame-section\" data-story-clip-frame-group=\"" + escapeHtml(_0x4644cd["clipId"]) + "\">\n        <h3>" + escapeHtml(_0x4644cd["label"]) + '\x20·\x20' + _0x4644cd["frames"]['length'] + " 项</h3>\n        <div class=\"story-episode-asset-grid story-episode-frame-grid\">\n          " + _0x4644cd["frames"]['map'](_0x3d22be => {
      const _0x246704 = _0x3d22be['mediaType'] === "video";
      const _0x4f2122 = '删除' + (_0x246704 ? "视频片段" : '片段帧') + '\x20' + _0x3d22be["name"];
      const _0xa828c7 = _0x246704 ? "<div class=\"story-episode-frame-video-wrap\">\n                  <video class=\"story-episode-asset-image story-episode-frame-video\" src=\"" + escapeHtml(_0x3d22be["mediaUrl"]) + '\x22' + (_0x3d22be["imageUrl"] ? " poster=\"" + escapeHtml(_0x3d22be["imageUrl"]) + '\x22' : '') + " muted playsinline preload=\"metadata\" aria-label=\"" + escapeHtml(_0x3d22be['name']) + '\x22></video>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20class=\x22story-episode-frame-video-badge\x22\x20aria-hidden=\x22true\x22>视频</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>' : renderImageOrEmpty({
        'imageUrl': _0x3d22be["imageUrl"],
        'alt': _0x3d22be["name"],
        'className': "story-episode-asset-image story-episode-frame-image"
      });
      return '<div\x20class=\x22story-episode-frame-card\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20draggable=\x22true\x22\x20data-story-reference-asset=\x22' + escapeHtml(_0x3d22be["mentionId"]) + "\" data-story-reference-frame=\"" + escapeHtml(_0x3d22be['id']) + "\" data-story-reference-media-type=\"" + escapeHtml(_0x3d22be["mediaType"]) + "\" aria-label=\"引用" + (_0x246704 ? "裁剪视频" : "片段帧") + '\x20' + escapeHtml(_0x3d22be["name"]) + "，仅可拖入提示词\" aria-busy=\"" + (_0x3d22be['captureSavePending'] === !![]) + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + _0xa828c7 + "\n                <span>" + escapeHtml(_0x3d22be["name"]) + "</span>\n              </button>\n              <button type=\"button\" class=\"story-action-icon-button is-danger story-project-delete-trigger story-card-delete-button story-episode-frame-delete-trigger\" data-story-action=\"delete-clip-frame\" data-story-clip-frame-id=\"" + escapeHtml(_0x3d22be['id']) + "\" aria-label=\"" + escapeHtml(_0x4f2122) + '\x22\x20' + (_0x3d22be["captureSavePending"] === !![] ? "disabled" : '') + '>' + renderDeleteIcon() + "</button>\n            </div>";
    })["join"]('') + "\n        </div>\n      </section>")['join']('') : "<div class=\"story-episode-asset-empty\">\n        <strong>还没有片段帧</strong>\n        <span>在右侧视频预览中截取当前帧，或点击裁剪按钮提取视频片段。</span>\n      </div>";
    return "<aside class=\"story-episode-assets\" data-story-episode-asset-rail data-active-tab=\"" + _0x5db2d0 + "\">\n    <header class=\"story-episode-asset-rail-header\">\n      <div class=\"story-episode-asset-rail-tabs\" role=\"tablist\" aria-label=\"剧本素材类型\">\n        <button type=\"button\" class=\"" + (_0x5db2d0 === 'assets' ? "is-active" : '') + '\x22\x20data-story-episode-asset-tab=\x22assets\x22\x20role=\x22tab\x22\x20aria-selected=\x22' + (_0x5db2d0 === "assets") + "\">\n          " + _0x1764bf('assets') + "<span class=\"story-episode-asset-tab-label\">本集素材</span><span class=\"story-episode-asset-count\" data-story-episode-asset-count=\"assets\">" + _0x4011cd["length"] + "</span>\n        </button>\n        <button type=\"button\" class=\"" + (_0x5db2d0 === "frames" ? "is-active" : '') + "\" data-story-episode-asset-tab=\"frames\" role=\"tab\" aria-selected=\"" + (_0x5db2d0 === "frames") + "\">\n          " + _0x1764bf("frames") + "<span class=\"story-episode-asset-tab-label\">片段帧</span><span class=\"story-episode-asset-count\" data-story-episode-asset-count=\"frames\">" + _0x3fde94["length"] + "</span>\n        </button>\n        <button type=\"button\" class=\"" + (_0x5db2d0 === "library" ? "is-active" : '') + '\x22\x20data-story-episode-asset-tab=\x22library\x22\x20role=\x22tab\x22\x20aria-selected=\x22' + (_0x5db2d0 === 'library') + "\">\n          " + _0x1764bf('library') + '<span\x20class=\x22story-episode-asset-tab-label\x22>总素材</span><span\x20class=\x22story-episode-asset-count\x22\x20data-story-episode-asset-count=\x22library\x22>' + _0x1f1d3a["count"] + "</span>\n        </button>\n      </div>\n      <small data-story-episode-asset-help>" + escapeHtml(_0x3a8aa0["helpText"]) + "</small>\n    </header>\n    <div class=\"story-episode-asset-rail-viewport\">\n      <div class=\"story-episode-asset-rail-track\" data-story-episode-asset-rail-track>\n        <div class=\"story-episode-asset-rail-page " + (_0x5db2d0 === "assets" ? "is-active" : '') + '\x22\x20data-story-episode-asset-panel=\x22assets\x22\x20role=\x22tabpanel\x22\x20aria-hidden=\x22' + (_0x5db2d0 !== "assets") + "\">\n          " + _0x25ec81 + "\n        </div>\n        <div class=\"story-episode-asset-rail-page " + (_0x5db2d0 === "frames" ? "is-active" : '') + "\" data-story-episode-asset-panel=\"frames\" role=\"tabpanel\" aria-hidden=\"" + (_0x5db2d0 !== "frames") + '\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20' + _0x1778ef + "\n        </div>\n        <div class=\"story-episode-asset-rail-page " + (_0x5db2d0 === "library" ? "is-active" : '') + "\" data-story-episode-asset-panel=\"library\" role=\"tabpanel\" aria-hidden=\"" + (_0x5db2d0 !== 'library') + "\">\n          " + _0x1f1d3a["markup"] + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</div>\x0a\x20\x20</aside>';
  }
  function _0x545ce2(_0x5e8c25 = {}) {
    const _0x505c7e = _0x5e8c25["ratios"] || {
      'left': 0x18,
      'center': 0x2c
    };
    const _0x15db4b = '<div\x20class=\x22story-episode-detail-page\x22>\x0a\x20\x20\x20\x20' + (_0x5e8c25['assetRailMarkup'] || '') + "\n    <div class=\"story-episode-splitter story-episode-splitter--assets panel-resize-handle panel-resize-handle--transient\" data-story-episode-splitter=\"assets\" role=\"separator\" aria-orientation=\"vertical\" aria-label=\"调整本集素材区域宽度\" aria-valuemin=\"14\" aria-valuemax=\"34\" aria-valuenow=\"" + Math['round'](Number(_0x505c7e["left"]) || 0x0) + "\" tabindex=\"0\"></div>\n    <section class=\"story-clip-editor\">\n      <header>\n        <h2>" + escapeHtml(_0x5e8c25["title"] || '片段脚本') + "</h2>\n      </header>\n      <div class=\"story-clip-context-row\">\n        <div class=\"story-clip-meta\">\n          " + (Array["isArray"](_0x5e8c25["clipMeta"]) ? _0x5e8c25["clipMeta"] : [])["map"](_0x560db2 => '<span>' + escapeHtml(_0x560db2) + '</span>')["join"]('') + "\n        </div>\n        " + (_0x5e8c25["referenceSummary"] || '') + "\n      </div>\n      " + (_0x5e8c25['promptSurface'] || '') + '\x0a\x20\x20\x20\x20</section>\x0a\x20\x20\x20\x20<div\x20class=\x22story-episode-splitter\x20story-episode-splitter--preview\x20panel-resize-handle\x20panel-resize-handle--transient\x22\x20data-story-episode-splitter=\x22preview\x22\x20role=\x22separator\x22\x20aria-orientation=\x22vertical\x22\x20aria-label=\x22调整脚本与视频结果区域宽度\x22\x20aria-valuemin=\x2238\x22\x20aria-valuemax=\x2276\x22\x20aria-valuenow=\x22' + Math["round"]((Number(_0x505c7e["left"]) || 0x0) + (Number(_0x505c7e["center"]) || 0x0)) + "\" tabindex=\"0\"></div>\n    <section class=\"story-video-preview\" data-story-clip-navigation=\"" + Boolean(_0x5e8c25["hasMultipleClips"]) + '\x22\x20' + (_0x5e8c25["hasMultipleClips"] ? "tabindex=\"0\" aria-label=\"滚动鼠标滚轮或按左右方向键切换上一幕、下一幕\"" : '') + ">\n      " + (_0x5e8c25['navigationMarkup'] || '') + "\n      <div class=\"story-clip-preview-slide\" data-story-clip-preview-slide>\n        " + (_0x5e8c25["videoPreview"] || '') + '\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20</section>\x0a\x20\x20\x20\x20' + (_0x5e8c25["timeline"] || '') + "\n  </div>";
    return _0x5e8c25["episodeRailMarkup"] ? "<div class=\"workspace-episode-production story-replication-episode-production\" data-story-replication-episode-production>" + _0x5e8c25["episodeRailMarkup"] + _0x15db4b + "</div>" : _0x15db4b;
  }
  return Object["freeze"]({
    'renderAssetRail': _0x7897f,
    'renderDetail': _0x545ce2,
    'renderOverview': _0x4e968c,
    'resolveEpisodeCardMedia': _0x202914
  });
}