import { showContextMenu } from './interaction/contextMenuPresenter.js';
import { TEXT_CONTEXT_MENU_TARGET_SELECTOR } from './textInputContextMenu.js';
import { t } from '../i18n/index.js';
const workspaceContextMenuText = _0x5ca4db => t("workspaceContextMenu." + _0x5ca4db);
function isEditableContextTarget(_0x2f3f07) {
  return Boolean(_0x2f3f07?.['closest']?.(TEXT_CONTEXT_MENU_TARGET_SELECTOR));
}
function compactItems(_0x1938ab = []) {
  const _0x5b3a47 = [];
  for (const _0x266c57 of _0x1938ab) {
    if (!_0x266c57) {
      continue;
    }
    const _0x12a963 = _0x266c57 === "sep" || _0x266c57?.['type'] === "separator";
    if (_0x12a963 && (!_0x5b3a47["length"] || _0x5b3a47['at'](-0x1) === "sep")) {
      continue;
    }
    _0x5b3a47["push"](_0x12a963 ? "sep" : _0x266c57);
  }
  if (_0x5b3a47['at'](-0x1) === 'sep') {
    _0x5b3a47["pop"]();
  }
  return _0x5b3a47;
}
function actionItem(_0x3d053b, _0x1a3204, _0x1cccca = {}) {
  if (typeof _0x1a3204 !== "function") {
    return null;
  }
  return {
    'label': _0x3d053b,
    'action': _0x1a3204,
    ..._0x1cccca
  };
}
export function createWorkspaceProjectContextMenuItems({
  archived = ![],
  onOpen = null,
  onRename = null,
  onDuplicate = null,
  onCollect = null,
  onArchive = null,
  onDelete = null
} = {}) {
  return compactItems([actionItem(workspaceContextMenuText('openProject'), onOpen, {
    'icon': "folder-open",
    'shortcutActionId': 'context-workspace-open-project'
  }), 'sep', actionItem(workspaceContextMenuText('renameProject'), onRename, {
    'icon': 'edit',
    'shortcutActionId': "context-workspace-rename-project"
  }), actionItem(workspaceContextMenuText("duplicateProject"), onDuplicate, {
    'icon': "duplicate",
    'shortcutActionId': "context-workspace-duplicate-project"
  }), actionItem(workspaceContextMenuText("collectProject"), onCollect, {
    'icon': "download",
    'shortcutActionId': "context-workspace-collect-project"
  }), actionItem(workspaceContextMenuText(archived ? "unarchiveProject" : "archiveProject"), onArchive, {
    'icon': archived ? 'unarchive' : 'archive',
    'shortcutActionId': archived ? "context-workspace-unarchive-project" : "context-workspace-archive-project"
  }), "sep", actionItem(workspaceContextMenuText("deleteProject"), onDelete, {
    'danger': !![],
    'icon': 'delete',
    'shortcutActionId': "context-workspace-delete-project"
  })]);
}
export function createWorkspaceEntityContextMenuItems({
  activateLabel = workspaceContextMenuText('view'),
  activateIcon = "enable",
  activateShortcutActionId = '',
  onActivate = null,
  deleteLabel = workspaceContextMenuText("delete"),
  deleteIcon = "delete",
  deleteShortcutActionId = '',
  onDelete = null,
  deleteDisabled = ![],
  extraItems = []
} = {}) {
  return compactItems([actionItem(activateLabel, onActivate, {
    'icon': activateIcon,
    'shortcutActionId': activateShortcutActionId
  }), ...extraItems, onDelete ? "sep" : null, actionItem(deleteLabel, onDelete, {
    'danger': !![],
    'disabled': deleteDisabled === !![],
    'icon': deleteIcon,
    'shortcutActionId': deleteShortcutActionId
  })]);
}
export function bindWorkspaceEntityContextMenu(_0xff467f, {
  resolveItems = () => [],
  presentMenu = showContextMenu,
  beforeOpen = null
} = {}) {
  if (!_0xff467f?.["addEventListener"] || typeof resolveItems !== "function") {
    return () => {};
  }
  let _0x440f71 = null;
  const _0xb72d4c = () => {
    _0x440f71?.['close']?.();
    _0x440f71 = null;
  };
  const _0x526047 = _0x159f85 => {
    if (isEditableContextTarget(_0x159f85?.['target'])) {
      return;
    }
    const _0x2b54b3 = _0x159f85?.["defaultPrevented"] === !![];
    _0x159f85?.["preventDefault"]?.();
    _0x159f85?.["stopPropagation"]?.();
    if (_0x2b54b3) {
      _0xb72d4c();
      return;
    }
    const _0x32dc22 = compactItems(resolveItems(_0x159f85));
    _0xb72d4c();
    if (!_0x32dc22["length"]) {
      return;
    }
    beforeOpen?.(_0x159f85);
    _0x440f71 = presentMenu(Number(_0x159f85?.['clientX']) || 0x0, Number(_0x159f85?.['clientY']) || 0x0, _0x32dc22, {
      'ensureItemIcons': !![],
      'ownerElement': _0x159f85?.["target"]?.["isConnected"] === ![] ? _0xff467f : _0x159f85?.['target'],
      'ownerRoot': _0xff467f
    }) || null;
  };
  _0xff467f["addEventListener"]("contextmenu", _0x526047);
  return () => {
    _0xff467f["removeEventListener"]?.('contextmenu', _0x526047);
    _0xb72d4c();
  };
}