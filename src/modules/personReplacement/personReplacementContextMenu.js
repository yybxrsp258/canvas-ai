import { createWorkspaceEntityContextMenuItems, createWorkspaceProjectContextMenuItems } from '../workspaceEntityContextMenu.js';
import { t } from '../../i18n/index.js';
import { createWorkspaceAssetLibraryContextMenuItems, resolveWorkspaceLibraryContextSelection } from '../workspaceAssetLibraryContextMenu.js';
import { PERSON_REPLACEMENT_LIBRARY_TARGETS, getPersonReplacementSelectableAssets } from './personReplacementAssetSettingsPresentation.js';
function libraryAssignmentItems(_0x359c0e, _0x32c257, _0x4e0f2b) {
  const _0x3ff8d6 = _0x32c257?.['workspace'];
  if (_0x3ff8d6?.['characterAssetTab'] !== "library") {
    return [];
  }
  const _0x3adffe = resolveWorkspaceLibraryContextSelection(_0x359c0e, _0x3ff8d6["assetSelectionMode"], _0x3ff8d6["selectedAssetIds"]);
  const _0x33d002 = getPersonReplacementSelectableAssets(_0x32c257, "library")['filter'](_0xbe66f8 => _0x3adffe['includes'](_0xbe66f8['id']))['map'](_0x1b252c => _0x1b252c['id']);
  return createWorkspaceAssetLibraryContextMenuItems({
    'selectedCount': _0x33d002["length"],
    'selectionMode': _0x3ff8d6["assetSelectionMode"],
    'items': PERSON_REPLACEMENT_LIBRARY_TARGETS["map"](({
      kind: _0x3b8637,
      label: _0xf8461e
    }) => ({
      'label': _0xf8461e,
      'action': () => _0x4e0f2b["addLibraryAssets"]?.(_0x33d002, _0x3b8637)
    }))
  });
}
const contextMenuText = _0x36e9fe => t("workspaceContextMenu." + _0x36e9fe);
function normalizeText(_0x492d20) {
  return String(_0x492d20 ?? '')['trim']();
}
export function resolvePersonReplacementContextMenuItems({
  event: _0x438a9b,
  root: _0x485647,
  projects = [],
  commands = {},
  project = null
} = {}) {
  const _0x10f7f9 = _0x438a9b?.["target"];
  const _0x28090b = _0x10f7f9?.["closest"]?.("[data-story-open-project]");
  if (_0x28090b && _0x485647?.["contains"]?.(_0x28090b)) {
    const _0x54a461 = normalizeText(_0x28090b['dataset']["storyOpenProject"]);
    const _0x597562 = (Array["isArray"](projects) ? projects : [])["find"](_0xaa5f67 => normalizeText(_0xaa5f67?.['id']) === _0x54a461);
    const _0x24866b = Number(_0x597562?.["archivedAt"] || 0x0) > 0x0;
    return createWorkspaceProjectContextMenuItems({
      'archived': _0x24866b,
      'onOpen': () => commands['openProject']?.(_0x54a461),
      'onRename': () => commands['renameProject']?.(_0x54a461),
      'onDuplicate': () => commands["duplicateProject"]?.(_0x54a461),
      'onCollect': () => commands["collectProject"]?.(_0x54a461),
      'onArchive': () => commands["setProjectArchived"]?.(_0x54a461, !_0x24866b),
      'onDelete': () => commands["requestDeleteProject"]?.(_0x54a461)
    });
  }
  const _0x3f2f5f = _0x10f7f9?.["closest"]?.(".story-media-history-entry");
  if (_0x3f2f5f && _0x485647?.['contains']?.(_0x3f2f5f)) {
    const _0xfb794d = _0x3f2f5f["querySelector"]?.(".story-media-history-item");
    const _0x125ea1 = _0x3f2f5f["querySelector"]?.(".story-card-delete-control");
    return createWorkspaceEntityContextMenuItems({
      'activateLabel': contextMenuText("switchResult"),
      'activateIcon': "update",
      'activateShortcutActionId': "context-person-switch-result",
      'onActivate': _0xfb794d ? () => _0xfb794d["click"]?.() : null,
      'deleteLabel': contextMenuText('deleteResult'),
      'deleteShortcutActionId': "context-person-delete-result",
      'onDelete': _0x125ea1 ? () => _0x125ea1['click']?.() : null,
      'deleteDisabled': _0x125ea1?.['disabled'] === !![]
    });
  }
  const _0xe1736e = _0x10f7f9?.["closest"]?.("[data-story-asset-id]");
  if (_0xe1736e && _0x485647?.["contains"]?.(_0xe1736e)) {
    const _0x53f021 = _0xe1736e["dataset"]["personReplacementShotCard"] === "true";
    const _0x3d183e = _0xe1736e['closest']?.(".story-asset-card-shell, .story-clip-card-shell");
    const _0x299499 = _0x3d183e?.["querySelector"]?.(".story-card-delete-control");
    return createWorkspaceEntityContextMenuItems({
      'activateLabel': contextMenuText(_0x53f021 ? "selectClip" : "viewAsset"),
      'activateIcon': "enable",
      'activateShortcutActionId': _0x53f021 ? "context-story-select-clip" : "context-story-view-asset",
      'onActivate': () => _0xe1736e['click']?.(),
      'extraItems': _0x53f021 ? [] : libraryAssignmentItems(_0xe1736e["dataset"]["storyAssetId"], project, commands),
      'deleteLabel': contextMenuText(_0x53f021 ? 'deleteClip' : "deleteAsset"),
      'deleteShortcutActionId': _0x53f021 ? 'context-story-delete-clip' : "context-story-delete-asset",
      'onDelete': _0x299499 ? () => _0x299499["click"]?.() : null,
      'deleteDisabled': _0x299499?.["disabled"] === !![]
    });
  }
  return [];
}