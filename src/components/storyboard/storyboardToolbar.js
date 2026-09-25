import { t } from '../../i18n/index.js';
const SVG_NS = 'http://www.w3.org/2000/svg';
export function storyboardToolbarText(_0x260c37, _0x5a23e6 = {}) {
  return t("storyboard.toolbar." + _0x260c37, _0x5a23e6);
}
export function createStoryboardToolbarSvg(_0x1fae3e, _0xb696cc, _0xa7de78) {
  const _0x12f814 = document['createElementNS'](SVG_NS, 'svg');
  _0x12f814["setAttribute"]("width", String(_0x1fae3e));
  _0x12f814['setAttribute']('height', String(_0xb696cc));
  _0x12f814["setAttribute"]("viewBox", "0 0 24 24");
  _0x12f814["setAttribute"]("fill", "none");
  _0x12f814["setAttribute"]("stroke", "currentColor");
  _0x12f814["setAttribute"]("stroke-width", String(_0xa7de78));
  return _0x12f814;
}
function createSvgElement(_0x41b47f, _0x5ae12e = {}) {
  const _0xd4071 = document["createElementNS"](SVG_NS, _0x41b47f);
  for (const [_0x39ef75, _0x2ed7c3] of Object["entries"](_0x5ae12e)) {
    _0xd4071["setAttribute"](_0x39ef75, String(_0x2ed7c3));
  }
  return _0xd4071;
}
export function createStoryboardCustomGridIcon() {
  const _0x16786c = createStoryboardToolbarSvg(0x10, 0x10, 0x2);
  _0x16786c["appendChild"](createSvgElement('rect', {
    'x': 0x4,
    'y': 0x4,
    'width': 0x10,
    'height': 0x10,
    'rx': 0x2
  }));
  _0x16786c["appendChild"](createSvgElement("path", {
    'd': "M10 4v16"
  }));
  _0x16786c['appendChild'](createSvgElement("path", {
    'd': "M4 14h16"
  }));
  _0x16786c["appendChild"](createSvgElement("circle", {
    'cx': 0xa,
    'cy': 0x9,
    'r': 1.6
  }));
  _0x16786c["appendChild"](createSvgElement("circle", {
    'cx': 0xf,
    'cy': 0xe,
    'r': 1.6
  }));
  return _0x16786c;
}
export function setStoryboardSplitLinesButtonContent(_0x5a58ae) {
  if (!_0x5a58ae) {
    return;
  }
  _0x5a58ae['replaceChildren'](createStoryboardCustomGridIcon());
}
function createToolbarChevron() {
  const _0x2f0429 = createStoryboardToolbarSvg(0xa, 0xa, 2.5);
  _0x2f0429["classList"]["add"]("ftb-chevron");
  _0x2f0429["setAttribute"]("stroke", "var(--text-primary)");
  _0x2f0429["style"]["marginLeft"] = "2px";
  _0x2f0429["style"]["transition"] = 'transform\x200.2s\x20cubic-bezier(0.34,\x201.56,\x200.64,\x201)';
  _0x2f0429["appendChild"](createSvgElement("polyline", {
    'points': '6\x209\x2012\x2015\x2018\x209'
  }));
  return _0x2f0429;
}
function createToolbarDivider() {
  const _0x1b50a8 = document["createElement"]("div");
  _0x1b50a8["className"] = 'ftb-divider';
  Object['assign'](_0x1b50a8["style"], {
    'width': "1px",
    'height': "14px",
    'background': 'var(--white-10)',
    'margin': "0 4px"
  });
  return _0x1b50a8;
}
function createAspectButton(_0x33e467) {
  const _0x3459ea = document["createElement"]('button');
  _0x3459ea['className'] = "ftb-btn act-aspect";
  _0x3459ea['setAttribute']('aria-label', storyboardToolbarText('toggleAspect'));
  const _0x162b77 = createStoryboardToolbarSvg(0xe, 0xe, 0x2);
  _0x162b77['appendChild'](createSvgElement("rect", {
    'x': 0x3,
    'y': 0x3,
    'width': 0x12,
    'height': 0x12,
    'rx': 0x2,
    'ry': 0x2
  }));
  const _0xee854 = document["createElement"]("span");
  _0xee854["textContent"] = storyboardToolbarText("aspectLabel", {
    'aspectRatio': _0x33e467["aspectRatio"] || "1:1"
  });
  _0x3459ea["appendChild"](_0x162b77);
  _0x3459ea["appendChild"](_0xee854);
  _0x3459ea["appendChild"](createToolbarChevron());
  return _0x3459ea;
}
function createGridButton(_0x191512) {
  const _0x347d3d = document["createElement"]("button");
  _0x347d3d["className"] = "ftb-btn act-grid";
  _0x347d3d["setAttribute"]("aria-label", storyboardToolbarText("toggleGrid"));
  const _0x1677fd = createStoryboardToolbarSvg(0xe, 0xe, 0x2);
  [{
    'x': 0x3,
    'y': 0x3
  }, {
    'x': 0xe,
    'y': 0x3
  }, {
    'x': 0xe,
    'y': 0xe
  }, {
    'x': 0x3,
    'y': 0xe
  }]["forEach"](_0x3ed63b => {
    _0x1677fd["appendChild"](createSvgElement("rect", {
      'x': _0x3ed63b['x'],
      'y': _0x3ed63b['y'],
      'width': 0x7,
      'height': 0x7
    }));
  });
  const _0x531ed3 = document["createElement"]('span');
  _0x531ed3["textContent"] = storyboardToolbarText("gridLabel", {
    'cols': _0x191512["cols"] || 0x2,
    'rows': _0x191512['rows'] || 0x2
  });
  _0x347d3d["appendChild"](_0x1677fd);
  _0x347d3d['appendChild'](_0x531ed3);
  _0x347d3d["appendChild"](createToolbarChevron());
  return _0x347d3d;
}
function createSplitLinesButton() {
  const _0x3f0fa8 = document['createElement']("button");
  _0x3f0fa8["className"] = 'ftb-btn\x20icon-only\x20storyboard-split-lines-trigger\x20act-split-lines';
  _0x3f0fa8["dataset"]['tooltip'] = storyboardToolbarText("adjustSplitLines");
  _0x3f0fa8["setAttribute"]("aria-label", storyboardToolbarText("adjustSplitLines"));
  setStoryboardSplitLinesButtonContent(_0x3f0fa8);
  return _0x3f0fa8;
}
function createEditButton(_0x228e1e) {
  const _0x4ddc64 = document["createElement"]("button");
  _0x4ddc64['className'] = "ftb-btn icon-only act-edit";
  if (_0x228e1e) {
    _0x4ddc64["classList"]["add"]("active");
  }
  _0x4ddc64['dataset']['tooltip'] = _0x228e1e ? storyboardToolbarText('exitEdit') : storyboardToolbarText("edit");
  _0x4ddc64['setAttribute']('aria-label', _0x228e1e ? storyboardToolbarText('exitEdit') : storyboardToolbarText("edit"));
  const _0x129229 = createStoryboardToolbarSvg(0x10, 0x10, 0x2);
  _0x129229["appendChild"](createSvgElement("path", {
    'd': "M12 20h9"
  }));
  _0x129229['appendChild'](createSvgElement('path', {
    'd': 'M16.5\x203.5a2.121\x202.121\x200\x200\x201\x203\x203L7\x2019l-4\x201\x201-4L16.5\x203.5z'
  }));
  _0x4ddc64["appendChild"](_0x129229);
  return _0x4ddc64;
}
function createComposeButton() {
  const _0x1cd4d3 = document["createElement"]("button");
  _0x1cd4d3["className"] = "ftb-btn icon-only act-compose";
  _0x1cd4d3["dataset"]["tooltip"] = storyboardToolbarText("compose");
  _0x1cd4d3["setAttribute"]('aria-label', storyboardToolbarText("compose"));
  const _0x5910ab = createStoryboardToolbarSvg(0x10, 0x10, 0x2);
  _0x5910ab['appendChild'](createSvgElement("path", {
    'd': 'M12\x203v18m9-9H3'
  }));
  _0x1cd4d3["appendChild"](_0x5910ab);
  return _0x1cd4d3;
}
function createClearButton() {
  const _0x279ca6 = document["createElement"]('button');
  _0x279ca6["className"] = "ftb-btn icon-only act-clear";
  _0x279ca6["dataset"]["tooltip"] = storyboardToolbarText("clear");
  _0x279ca6["setAttribute"]('aria-label', storyboardToolbarText("clear"));
  const _0x4228ee = createStoryboardToolbarSvg(0x10, 0x10, 0x2);
  _0x4228ee["appendChild"](createSvgElement("polyline", {
    'points': "3 6 5 6 21 6"
  }));
  _0x4228ee["appendChild"](createSvgElement("path", {
    'd': "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
  }));
  _0x279ca6["appendChild"](_0x4228ee);
  return _0x279ca6;
}
function createCollapseButton(_0x90c1aa) {
  const _0xd4bcca = document["createElement"]("button");
  _0xd4bcca["className"] = "ftb-btn icon-only act-collapse";
  _0xd4bcca["dataset"]["tooltip"] = _0x90c1aa ? storyboardToolbarText('expand') : storyboardToolbarText('collapse');
  _0xd4bcca['setAttribute']('aria-label', _0x90c1aa ? storyboardToolbarText('expand') : storyboardToolbarText("collapse"));
  const _0x48f6bd = createStoryboardToolbarSvg(0x10, 0x10, 0x2);
  _0x48f6bd["appendChild"](createSvgElement('polyline', {
    'points': _0x90c1aa ? "6 9 12 15 18 9" : '18\x2015\x2012\x209\x206\x2015'
  }));
  _0xd4bcca["appendChild"](_0x48f6bd);
  return _0xd4bcca;
}
export function createStoryboardToolbar({
  data: _0x510cdb,
  isEditing = ![],
  isCollapsed = ![]
} = {}) {
  const _0x368576 = document['createElement']("div");
  _0x368576["className"] = "node-floating-toolbar storyboard-toolbar";
  Object["assign"](_0x368576["style"], {
    'display': 'flex',
    'alignItems': "center",
    'gap': "4px"
  });
  _0x368576["appendChild"](createAspectButton(_0x510cdb || {}));
  _0x368576["appendChild"](createGridButton(_0x510cdb || {}));
  _0x368576["appendChild"](createToolbarDivider());
  _0x368576['appendChild'](createSplitLinesButton());
  _0x368576["appendChild"](createEditButton(isEditing));
  _0x368576['appendChild'](createComposeButton());
  _0x368576['appendChild'](createClearButton());
  _0x368576["appendChild"](createCollapseButton(isCollapsed));
  return _0x368576;
}