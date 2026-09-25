import { createWorkspaceEntityContextMenuItems, createWorkspaceProjectContextMenuItems } from '../workspaceEntityContextMenu.js';
import { t } from '../../i18n/index.js';
import { createWorkspaceAssetLibraryContextMenuItems, resolveWorkspaceLibraryContextSelection } from '../workspaceAssetLibraryContextMenu.js';
import { createStoryAssetSettingsProjection } from './storyAssetSettingsProjection.js';
const assetSettingsProjection = createStoryAssetSettingsProjection();
function libraryAssignmentItems(_0x4d251b, _0x447785, _0x3e066b, _0x2baa5a, _0x34b9f0) {
  if (_0x447785["assetFilter"] !== "library") {
    return [];
  }
  const _0x2344e2 = _0x447785["data"]?.["project"]?.['id'];
  const _0xe4ae2e = resolveWorkspaceLibraryContextSelection(_0x4d251b, _0x447785["assetSelectionMode"], _0x447785["selectedAssetIds"]);
  const _0x35445b = _0x3e066b["filter"](_0x2e1ca5 => _0xe4ae2e['includes'](_0x2e1ca5['id']) && _0x2e1ca5["mediaKind"] === "image" && (_0x2e1ca5["sourceUrl"] || _0x2e1ca5["imageUrl"]))["map"](_0x29fb42 => _0x29fb42['id']);
  const _0xd13055 = assetSettingsProjection["projectAssetControl"]("library-selection", {
    'projectAssets': _0x447785['data']?.['assets'],
    'getTabLabel': _0x2baa5a,
    'selectedCount': _0x35445b["length"]
  });
  const _0x4a9fe2 = (_0x1134a3, _0x5dbbad, _0x5044d7) => {
    if (_0x447785['data']?.['project']?.['id'] !== _0x2344e2 || _0x447785['assetFilter'] !== 'library') {
      return;
    }
    _0x34b9f0["addLibraryAssets"]?.(_0x35445b, _0x1134a3, _0x5dbbad, _0x5044d7);
  };
  return createWorkspaceAssetLibraryContextMenuItems({
    'selectedCount': _0x35445b["length"],
    'selectionMode': _0x447785['assetSelectionMode'],
    'items': _0xd13055["targetGroups"]['map'](_0x305bda => ({
      'label': _0x305bda["label"],
      'subItems': _0x305bda["targets"]['length'] ? _0x305bda["targets"]["map"](_0x3a0df8 => ({
        'label': _0x3a0df8["name"],
        'subItems': [..._0x3a0df8["appearances"]["map"](_0x1810bb => ({
          'label': normalizeText(_0x1810bb['name']) || "未命名形象",
          'disabled': _0x35445b['length'] !== 0x1,
          'action': () => _0x4a9fe2(_0x3a0df8['id'], _0x1810bb['id'], ![])
        })), {
          'label': "新增形象",
          'icon': 'add',
          'action': () => _0x4a9fe2(_0x3a0df8['id'], '', !![])
        }]
      })) : [{
        'label': "本剧暂无可绑定的" + _0x305bda["label"],
        'disabled': !![]
      }]
    }))
  });
}
const contextMenuText = _0x26278b => t("workspaceContextMenu." + _0x26278b);
function normalizeText(_0x1e8aa7) {
  return String(_0x1e8aa7 ?? '')["trim"]();
}
export function resolveStoryWorkspaceContextMenuItems({
  event: _0x135b09,
  root: _0x51013a,
  projects = [],
  commands = {},
  state = {},
  libraryAssets = [],
  getTabLabel: _0x5d2634
} = {}) {
  const _0x390740 = _0x135b09?.["target"];
  const _0x5a4ea9 = _0x390740?.["closest"]?.("[data-story-open-project]");
  if (_0x5a4ea9 && _0x51013a?.["contains"]?.(_0x5a4ea9)) {
    const _0xaae26 = normalizeText(_0x5a4ea9['dataset']["storyOpenProject"]);
    const _0x3465f8 = (Array["isArray"](projects) ? projects : [])["find"](_0x5bc19b => normalizeText(_0x5bc19b?.['id'] || _0x5bc19b?.['data']?.['project']?.['id']) === _0xaae26);
    const _0x1b8431 = Number(_0x3465f8?.["archivedAt"] || 0x0) > 0x0;
    return createWorkspaceProjectContextMenuItems({
      'archived': _0x1b8431,
      'onOpen': () => commands["openProject"]?.(_0xaae26),
      'onRename': () => commands["renameProject"]?.(_0xaae26),
      'onDuplicate': () => commands["duplicateProject"]?.(_0xaae26),
      'onCollect': () => commands["collectProject"]?.(_0xaae26),
      'onArchive': () => commands["setProjectArchived"]?.(_0xaae26, !_0x1b8431),
      'onDelete': () => commands['requestDeleteProject']?.(_0xaae26)
    });
  }
  const _0x9f61ac = _0x390740?.["closest"]?.(".story-media-history-entry");
  if (_0x9f61ac && _0x51013a?.['contains']?.(_0x9f61ac)) {
    const _0x446ed6 = _0x9f61ac['querySelector']?.(".story-media-history-item");
    const _0x24878d = _0x9f61ac["querySelector"]?.(".story-card-delete-control");
    return createWorkspaceEntityContextMenuItems({
      'activateLabel': contextMenuText("switchVersion"),
      'activateIcon': 'update',
      'activateShortcutActionId': 'context-story-switch-version',
      'onActivate': _0x446ed6 ? () => _0x446ed6["click"]?.() : null,
      'deleteLabel': contextMenuText('deleteVersion'),
      'deleteShortcutActionId': "context-story-delete-version",
      'onDelete': _0x24878d ? () => _0x24878d["click"]?.() : null,
      'deleteDisabled': _0x24878d?.["disabled"] === !![]
    });
  }
  const _0x3b7688 = _0x390740?.["closest"]?.('.story-clip-card[data-story-clip-id]');
  if (_0x3b7688 && _0x51013a?.["contains"]?.(_0x3b7688)) {
    const _0x418445 = _0x3b7688["closest"]?.(".story-clip-card-shell");
    const _0x60e765 = _0x418445?.["querySelector"]?.(".story-card-delete-control");
    return createWorkspaceEntityContextMenuItems({
      'activateLabel': contextMenuText('selectClip'),
      'activateIcon': "enable",
      'activateShortcutActionId': "context-story-select-clip",
      'onActivate': () => _0x3b7688["click"]?.(),
      'deleteLabel': contextMenuText("deleteClip"),
      'deleteShortcutActionId': "context-story-delete-clip",
      'onDelete': _0x60e765 ? () => _0x60e765["click"]?.() : null,
      'deleteDisabled': _0x60e765?.["disabled"] === !![]
    });
  }
  const _0x26848f = _0x390740?.["closest"]?.("[data-story-asset-id]");
  if (_0x26848f && _0x51013a?.["contains"]?.(_0x26848f)) {
    const _0x134d95 = _0x26848f["closest"]?.(".story-asset-card-shell");
    const _0x4e9630 = _0x134d95?.["querySelector"]?.('.story-card-delete-control');
    return createWorkspaceEntityContextMenuItems({
      'activateLabel': contextMenuText("viewAsset"),
      'activateIcon': 'enable',
      'activateShortcutActionId': "context-story-view-asset",
      'onActivate': () => _0x26848f['click']?.(),
      'extraItems': libraryAssignmentItems(_0x26848f["dataset"]["storyAssetId"], state, libraryAssets, _0x5d2634, commands),
      'deleteLabel': contextMenuText("deleteAsset"),
      'deleteShortcutActionId': 'context-story-delete-asset',
      'onDelete': _0x4e9630 ? () => _0x4e9630['click']?.() : null,
      'deleteDisabled': _0x4e9630?.["disabled"] === !![]
    });
  }
  return [];
}