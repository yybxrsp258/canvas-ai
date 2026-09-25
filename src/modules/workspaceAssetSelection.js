function normalizeText(_0x4fdee0) {
  return String(_0x4fdee0 ?? '')["trim"]();
}
export function toggleWorkspaceAssetSelectAll(_0x1d714c = [], _0x1bb5fd = []) {
  const _0x45d162 = (Array["isArray"](_0x1d714c) ? _0x1d714c : [])['map'](_0x148de5 => normalizeText(_0x148de5?.['id']))['filter'](Boolean);
  const _0xd46983 = new Set((Array["isArray"](_0x1bb5fd) ? _0x1bb5fd : [])["map"](normalizeText)["filter"](Boolean));
  const _0x29b089 = _0x45d162['length'] > 0x0 && _0x45d162['every'](_0x51d533 => _0xd46983["has"](_0x51d533));
  return _0x29b089 ? [] : _0x45d162;
}
export function toggleWorkspaceAssetSelection(_0x311a59 = [], _0x1573ad = '', _0x30d995 = ![]) {
  const _0x3d1c3c = normalizeText(_0x1573ad);
  const _0x2e0795 = (Array["isArray"](_0x311a59) ? _0x311a59 : [])['map'](normalizeText)["filter"](Boolean);
  if (!_0x30d995 || !_0x3d1c3c) {
    return _0x2e0795;
  }
  return _0x2e0795['includes'](_0x3d1c3c) ? _0x2e0795['filter'](_0x1b2a54 => _0x1b2a54 !== _0x3d1c3c) : [..._0x2e0795, _0x3d1c3c];
}
export function resolveWorkspaceCardMultiSelection({
  selectedIds = [],
  itemId = '',
  activeItemId = '',
  selectionMode = ![],
  shiftKey = ![],
  enabled = !![]
} = {}) {
  const _0x57596d = (Array["isArray"](selectedIds) ? selectedIds : [])["map"](normalizeText)["filter"](Boolean);
  const _0x53485f = normalizeText(itemId);
  const _0x119dae = enabled === !![] && Boolean(_0x53485f) && (selectionMode === !![] || shiftKey === !![]);
  if (!_0x119dae) {
    return {
      'handled': ![],
      'selectionMode': selectionMode === !![],
      'selectedIds': _0x57596d
    };
  }
  if (shiftKey === !![] && selectionMode !== !![]) {
    return {
      'handled': !![],
      'selectionMode': !![],
      'selectedIds': [...new Set([normalizeText(activeItemId), _0x53485f]["filter"](Boolean))]
    };
  }
  return {
    'handled': !![],
    'selectionMode': !![],
    'selectedIds': toggleWorkspaceAssetSelection(_0x57596d, _0x53485f, !![])
  };
}
export function renderWorkspaceAssetSelectionActions({
  selectionMode = ![],
  selectedCount = 0x0,
  allSelected = ![],
  primaryActionHtml = '',
  enterSelectionLabel = '多选',
  selectAllLabel = '全选',
  clearSelectionLabel = "取消全选"
} = {}) {
  if (!selectionMode) {
    return primaryActionHtml + "<button type=\"button\" class=\"story-secondary-button workspace-selection-trigger\" data-workspace-action=\"toggle-asset-selection\" data-story-action=\"toggle-asset-selection\">" + enterSelectionLabel + "</button>";
  }
  const _0x5bee98 = Math["max"](0x0, Math["trunc"](Number(selectedCount) || 0x0));
  return '<button\x20type=\x22button\x22\x20class=\x22story-secondary-button\x22\x20data-workspace-action=\x22toggle-all-assets\x22\x20data-story-action=\x22toggle-all-assets\x22\x20aria-pressed=\x22' + allSelected + '\x22>' + (allSelected ? clearSelectionLabel : selectAllLabel) + "</button><button type=\"button\" class=\"story-secondary-button\" data-workspace-action=\"cancel-asset-selection\" data-story-action=\"cancel-asset-selection\">取消</button>" + (_0x5bee98 || primaryActionHtml ? primaryActionHtml : '');
}