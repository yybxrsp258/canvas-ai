import { fetchUserShortcutsFromServer, saveUserShortcutsToServer } from '../../api/shortcutsApi.js';
import { onLocaleChange, t } from '../i18n/index.js';
import { desktopBridge } from '../services/desktopBridge.js';
import { openSettingsPanel, closeSettingsPanel, activateSettingsPane } from './settings/panelSettings.js';
import { SAVED_WORKFLOW_LIBRARY_ENTRY_ENABLED } from '../config/productFeatures.js';
import { CONTEXT_MENU_SHORTCUTS, isContextMenuShortcut } from '../utils/contextMenuShortcutCatalog.js';
const DEFAULT_PRESET_NAME = '默认预设';
const ASHUO_PRESET_NAME = "内置预设";
const CUSTOM_PRESET_NAME = '用户自定义';
const SHORTCUT_GROUP_I18N_KEYS = Object['freeze']({
  '通用': "general",
  '全局快捷键': 'globalShortcuts',
  '编辑与选择': 'editSelection',
  '设置开关': "settingToggles",
  '创建节点': "createNodes",
  '侧边栏': 'sidebar',
  '画笔功能': "brushTools",
  '图像功能': "imageTools",
  '视频功能': "videoTools",
  '音频功能': "audioTools",
  '剪辑功能': 'clipTools',
  '文本功能': 'textTools',
  '3D导演台': 'panoramaStage',
  '右键菜单·画布': "contextCanvas",
  '右键菜单·素材与文件': 'contextMaterials',
  '右键菜单·项目与工作区': "contextProjects",
  '右键菜单·功能面板': "contextFeatures",
  '右键菜单·网页预览': "contextWebPreview"
});
function _formatI18nMessage(_0x45914f, _0x2543ae = {}) {
  let _0x4d7f5a = String(_0x45914f || '');
  Object["entries"](_0x2543ae || {})["forEach"](([_0x12ede9, _0x2c60e9]) => {
    _0x4d7f5a = _0x4d7f5a["split"]('{' + _0x12ede9 + '}')['join'](String(_0x2c60e9 ?? ''));
  });
  return _0x4d7f5a;
}
function _tShortcut(_0x3df729, _0x59352b, _0x4926a7 = {}) {
  const _0x303b22 = "settings.shortcuts." + _0x3df729;
  const _0x3a18e8 = t(_0x303b22);
  return _formatI18nMessage(_0x3a18e8 === _0x303b22 ? _0x59352b : _0x3a18e8, _0x4926a7);
}
function _translateShortcutGroup(_0x3623af) {
  const _0x212986 = SHORTCUT_GROUP_I18N_KEYS[_0x3623af];
  return _0x212986 ? _tShortcut("groups." + _0x212986, _0x3623af) : _0x3623af;
}
function _translateShortcutAction(_0x25d6ca, _0x1a4f2e) {
  return _tShortcut("actions." + _0x25d6ca, _0x1a4f2e || _0x25d6ca);
}
export const DEFAULT_SHORTCUTS = {
  'zoom-in': {
    'label': '放大',
    'keys': ["Ctrl", '+'],
    'group': '通用'
  },
  'zoom-out': {
    'label': '缩小',
    'keys': ['Ctrl', '-'],
    'group': '通用'
  },
  'fit-all': {
    'label': "聚焦节点/适应画布",
    'keys': [],
    'group': '通用'
  },
  'minimap': {
    'label': "小地图",
    'keys': ['M'],
    'group': '通用'
  },
  'pan-canvas': {
    'label': "拖动画布（按住）",
    'keys': ['Space'],
    'group': '通用'
  },
  'copy': {
    'label': '复制',
    'keys': ["Ctrl", 'C'],
    'group': "编辑与选择"
  },
  'copy-media': {
    'label': "复制图像",
    'keys': ["Ctrl", "Shift", 'C'],
    'group': '编辑与选择'
  },
  'cut': {
    'label': '剪切',
    'keys': ["Ctrl", 'X'],
    'group': '编辑与选择'
  },
  'canvas-screenshot': {
    'label': "画布截图",
    'keys': ["Alt", 'Q'],
    'group': "全局快捷键"
  },
  'global-capture-launcher': {
    'label': "选中文本：打开加入画布浮窗",
    'keys': ["Alt", 'C'],
    'group': '全局快捷键'
  },
  'global-text-preset': {
    'label': "选中文本：新建提示词预设草稿",
    'keys': [],
    'group': "全局快捷键"
  },
  'duplicate-with-edges': {
    'label': "拖拽创建连线副本",
    'keys': ["Alt"],
    'group': "编辑与选择"
  },
  'paste': {
    'label': '粘贴',
    'keys': ["Ctrl", 'V'],
    'group': '编辑与选择'
  },
  'undo': {
    'label': '撤销',
    'keys': ["Ctrl", 'Z'],
    'group': "编辑与选择"
  },
  'redo': {
    'label': '重做',
    'keys': ['Ctrl', 'Y'],
    'group': "编辑与选择"
  },
  'delete': {
    'label': '删除',
    'keys': ["Delete"],
    'alternateKeys': [["Delete"], ["Backspace"]],
    'group': '编辑与选择'
  },
  'select-all': {
    'label': '全选',
    'keys': ["Ctrl", 'A'],
    'group': '编辑与选择'
  },
  'multi-select': {
    'label': "多选节点（配合点击）",
    'keys': ["Shift"],
    'group': "编辑与选择"
  },
  'group': {
    'label': '编组',
    'keys': ["Ctrl", 'G'],
    'group': "编辑与选择"
  },
  'align-feature': {
    'label': "多选对齐功能",
    'keys': ["Tab"],
    'group': '通用'
  },
  'grid-dots': {
    'label': '显示网格点',
    'keys': ['G'],
    'group': '设置开关'
  },
  'toggle-connection-lines': {
    'label': '显示/隐藏连接线',
    'keys': ['B'],
    'group': "设置开关"
  },
  'toggle-selection-related-highlight': {
    'label': '点击节点时高亮关联节点',
    'keys': [],
    'group': "设置开关"
  },
  'snap-guides': {
    'label': "辅助线吸附",
    'keys': ["Shift", ';'],
    'group': "设置开关"
  },
  'snap-grid': {
    'label': "网格吸附开关",
    'keys': ["Shift", 'G'],
    'group': "设置开关"
  },
  'toggle-title-follows-zoom': {
    'label': "标题跟随画布缩放",
    'keys': [],
    'group': "设置开关"
  },
  'toggle-media-node-resize': {
    'label': '图像视频节点缩放',
    'keys': [],
    'group': "设置开关"
  },
  'toggle-prompt-box-resize': {
    'label': "允许提示词栏下拉",
    'keys': [],
    'group': "设置开关"
  },
  'toggle-node-avoid-overlap': {
    'label': "新节点自动避让",
    'keys': [],
    'group': "设置开关"
  },
  'reset-media-size': {
    'label': "恢复节点默认大小",
    'keys': ['Shift', 'R'],
    'group': '编辑与选择'
  },
  'add-reference': {
    'label': "添加参考",
    'keys': ['X'],
    'group': '编辑与选择'
  },
  'toggle-agent': {
    'label': "打开/关闭 Canvas AI Agent",
    'keys': ['T'],
    'group': "侧边栏"
  },
  'create-text': {
    'label': '创建源文本节点',
    'keys': [],
    'group': "创建节点"
  },
  'create-comment-note': {
    'label': '创建注释节点',
    'keys': ['N'],
    'group': '创建节点'
  },
  'create-ai-text': {
    'label': "创建生成文本节点",
    'keys': ['Q'],
    'group': '创建节点'
  },
  'create-ai-image': {
    'label': "创建生成图像节点",
    'keys': ['W'],
    'group': "创建节点"
  },
  'create-ai-video': {
    'label': "创建生成视频节点",
    'keys': ['E'],
    'group': "创建节点"
  },
  'create-ai-audio': {
    'label': "创建生成音频节点",
    'keys': ['R'],
    'group': "创建节点"
  },
  'upload-file': {
    'label': "上传文件",
    'keys': [],
    'group': "创建节点"
  },
  'cut-edge': {
    'label': "剪刀（切断连线）",
    'keys': ["Ctrl"],
    'group': '编辑与选择'
  },
  'save': {
    'label': "保存画布",
    'keys': ["Ctrl", 'S'],
    'group': '通用'
  },
  'open-settings': {
    'label': "打开设置",
    'keys': ["Ctrl", ','],
    'group': '通用'
  },
  'open-canvas-projects': {
    'label': "打开画布项目",
    'keys': [],
    'group': '侧边栏'
  },
  'open-assets': {
    'label': '打开素材',
    'keys': [],
    'group': "侧边栏"
  },
  'open-workflows': {
    'label': "打开工作流",
    'keys': [],
    'group': "侧边栏",
    'hidden': !SAVED_WORKFLOW_LIBRARY_ENTRY_ENABLED,
    'disabled': !SAVED_WORKFLOW_LIBRARY_ENTRY_ENABLED
  },
  'open-node-manager': {
    'label': "打开/关闭节点管理",
    'keys': [],
    'group': "侧边栏"
  },
  'open-files': {
    'label': "打开文件管理",
    'keys': [],
    'group': "侧边栏"
  },
  'open-task-center': {
    'label': "打开任务进程",
    'keys': [],
    'group': '侧边栏'
  },
  'open-custom-ai-app': {
    'label': "打开自定义AI应用",
    'keys': [],
    'group': "侧边栏"
  },
  'escape-all': {
    'label': "取消/关闭所有菜单弹窗",
    'keys': ["Escape"],
    'group': '通用',
    'hidden': !![]
  },
  'editor-tool-brush': {
    'label': '画笔（切换模式）',
    'keys': ['B'],
    'group': '画笔功能'
  },
  'editor-tool-rect': {
    'label': '矩形',
    'keys': [],
    'group': '画笔功能'
  },
  'editor-tool-eraser': {
    'label': "橡皮擦",
    'keys': ['E'],
    'group': "画笔功能"
  },
  'editor-tool-bucket': {
    'label': '油漆桶',
    'keys': ['G'],
    'group': "画笔功能"
  },
  'editor-clear': {
    'label': '清空',
    'keys': ['R'],
    'group': "画笔功能"
  },
  'image-tool-matting': {
    'label': '遮罩编辑器',
    'keys': ['1'],
    'group': "图像功能"
  },
  'image-tool-repaint': {
    'label': '重绘',
    'keys': ['2'],
    'group': '图像功能'
  },
  'image-tool-erase': {
    'label': '消除',
    'keys': ['3'],
    'group': "图像功能"
  },
  'image-tool-hd': {
    'label': '高清',
    'keys': ['4'],
    'group': "图像功能"
  },
  'image-tool-expand': {
    'label': '扩图',
    'keys': ['5'],
    'group': "图像功能"
  },
  'image-tool-auto-subject': {
    'label': "自动识别主体",
    'keys': ['6'],
    'group': "图像功能"
  },
  'image-tool-multigrid': {
    'label': "宫格裁剪",
    'keys': ['7'],
    'group': "图像功能"
  },
  'image-tool-multiangle': {
    'label': "控制角度",
    'keys': ['8'],
    'group': "图像功能"
  },
  'image-tool-annotate': {
    'label': "图像编辑",
    'keys': ['9'],
    'group': "图像功能"
  },
  'image-tool-crop': {
    'label': '裁剪',
    'keys': ['0'],
    'group': '图像功能'
  },
  'image-tool-fullscreen': {
    'label': "全屏显示",
    'keys': ['-'],
    'group': "图像功能"
  },
  'image-tool-download': {
    'label': '下载',
    'keys': ['='],
    'group': '图像功能'
  },
  'video-tool-clip': {
    'label': "裁剪视频",
    'keys': ['1'],
    'group': "视频功能"
  },
  'video-tool-separate-av': {
    'label': "音画分离",
    'keys': ['6'],
    'group': "视频功能"
  },
  'video-tool-capture-frame': {
    'label': '截取当前帧',
    'keys': ['C'],
    'group': "视频功能"
  },
  'video-tool-keying': {
    'label': '抠像',
    'keys': ['2'],
    'group': "视频功能"
  },
  'video-tool-hd': {
    'label': '高清',
    'keys': ['3'],
    'group': "视频功能"
  },
  'video-tool-fullscreen': {
    'label': '全屏显示',
    'keys': ['4'],
    'group': "视频功能"
  },
  'video-tool-download': {
    'label': '下载',
    'keys': ['5'],
    'group': "视频功能"
  },
  'ms-sync-video-play': {
    'label': '同步播放视频',
    'keys': [],
    'group': '视频功能'
  },
  'audio-tool-clip': {
    'label': "裁剪音频",
    'keys': ['1'],
    'group': "音频功能"
  },
  'audio-tool-speed': {
    'label': '倍速',
    'keys': ['2'],
    'group': "音频功能"
  },
  'audio-tool-download': {
    'label': '下载',
    'keys': ['3'],
    'group': "音频功能"
  },
  'clip-tool-crop': {
    'label': '剪辑裁剪',
    'keys': ['C'],
    'group': "剪辑功能"
  },
  'text-tool-copy': {
    'label': '复制',
    'keys': ['1'],
    'group': "文本功能"
  },
  'text-tool-fullscreen': {
    'label': '全屏显示',
    'keys': ['2'],
    'group': "文本功能"
  },
  'panorama-scene-tool-toggle-mouse': {
    'label': '鼠标',
    'keys': ['V'],
    'group': "3D导演台"
  },
  'panorama-scene-tool-move': {
    'label': '移动',
    'keys': ['W'],
    'group': '3D导演台'
  },
  'panorama-scene-tool-scale': {
    'label': '缩放',
    'keys': ['E'],
    'group': "3D导演台"
  },
  'panorama-scene-tool-rotate': {
    'label': '旋转',
    'keys': ['R'],
    'group': "3D导演台"
  },
  'panorama-scene-reset-view': {
    'label': "重置视角",
    'keys': [],
    'group': "3D导演台"
  },
  'panorama-scene-capture': {
    'label': '截图',
    'keys': ['C'],
    'group': "3D导演台"
  },
  'panorama-scene-camera-create': {
    'label': "创建机位书签",
    'keys': ['`'],
    'group': "3D导演台"
  },
  'panorama-scene-camera-1': {
    'label': "跳转机位书签 1",
    'keys': ['1'],
    'group': "3D导演台"
  },
  'panorama-scene-camera-2': {
    'label': '跳转机位书签\x202',
    'keys': ['2'],
    'group': "3D导演台"
  },
  'panorama-scene-camera-3': {
    'label': "跳转机位书签 3",
    'keys': ['3'],
    'group': '3D导演台'
  },
  'panorama-scene-camera-4': {
    'label': "跳转机位书签 4",
    'keys': ['4'],
    'group': "3D导演台"
  },
  'panorama-scene-camera-5': {
    'label': '跳转机位书签\x205',
    'keys': ['5'],
    'group': "3D导演台"
  },
  'panorama-scene-camera-6': {
    'label': "跳转机位书签 6",
    'keys': ['6'],
    'group': "3D导演台"
  },
  'panorama-scene-camera-7': {
    'label': "跳转机位书签 7",
    'keys': ['7'],
    'group': '3D导演台'
  },
  'panorama-scene-camera-8': {
    'label': "跳转机位书签 8",
    'keys': ['8'],
    'group': '3D导演台'
  },
  'panorama-scene-camera-9': {
    'label': '跳转机位书签\x209',
    'keys': ['9'],
    'group': '3D导演台'
  },
  'panorama-scene-camera-0': {
    'label': "跳转机位书签 10",
    'keys': [],
    'group': "3D导演台"
  },
  'panorama-scene-camera-save-1': {
    'label': '保存当前视图到机位书签\x201',
    'keys': ["Ctrl", '1'],
    'group': "3D导演台"
  },
  'panorama-scene-camera-save-2': {
    'label': "保存当前视图到机位书签 2",
    'keys': ["Ctrl", '2'],
    'group': "3D导演台"
  },
  'panorama-scene-camera-save-3': {
    'label': '保存当前视图到机位书签\x203',
    'keys': ["Ctrl", '3'],
    'group': "3D导演台"
  },
  'panorama-scene-camera-save-4': {
    'label': "保存当前视图到机位书签 4",
    'keys': ['Ctrl', '4'],
    'group': "3D导演台"
  },
  'panorama-scene-camera-save-5': {
    'label': "保存当前视图到机位书签 5",
    'keys': ["Ctrl", '5'],
    'group': '3D导演台'
  },
  'panorama-scene-camera-save-6': {
    'label': "保存当前视图到机位书签 6",
    'keys': ['Ctrl', '6'],
    'group': "3D导演台"
  },
  'panorama-scene-camera-save-7': {
    'label': "保存当前视图到机位书签 7",
    'keys': ["Ctrl", '7'],
    'group': "3D导演台"
  },
  'panorama-scene-camera-save-8': {
    'label': "保存当前视图到机位书签 8",
    'keys': ["Ctrl", '8'],
    'group': "3D导演台"
  },
  'panorama-scene-camera-save-9': {
    'label': "保存当前视图到机位书签 9",
    'keys': ["Ctrl", '9'],
    'group': '3D导演台'
  },
  'panorama-scene-camera-save-0': {
    'label': '保存当前视图到机位书签\x2010',
    'keys': [],
    'group': "3D导演台"
  },
  ...CONTEXT_MENU_SHORTCUTS
};
export const PRESETS = {
  [DEFAULT_PRESET_NAME]: {},
  [ASHUO_PRESET_NAME]: {
    'fit-all': ['F'],
    'redo': ["Ctrl", "Shift", 'Z'],
    'delete': ['D'],
    'snap-guides': [';'],
    'snap-grid': ['L'],
    'grid-dots': ['.'],
    'ms-sync-video-play': ['G'],
    'create-text': [],
    'open-settings': ['K'],
    'open-assets': ['A'],
    'open-files': ['Z']
  }
};
const BUILTIN_PRESET_NAMES = new Set(Object["keys"](PRESETS));
const MODIFIER_ONLY_SHORTCUT_ACTIONS = new Set(["cut-edge", "duplicate-with-edges", 'multi-select']);
const FIXED_GLOBAL_SHORTCUT_BINDINGS = Object["freeze"]({
  'delete': Object['freeze']([Object["freeze"](["Delete"])])
});
let _shortcuts = {};
let _currentPreset = ASHUO_PRESET_NAME;
let _recordingAction = null;
let _shortcutSearchQuery = '';
let _saveRevision = 0x0;
let _saveLoopPromise = null;
function _setRecordingAction(_0x54427b) {
  _recordingAction = _0x54427b || null;
  typeof window !== "undefined" && (window["__aicShortcutRecording"] = !!_recordingAction);
}
const DEFAULT_SHORTCUT_MIGRATIONS = {
  'panorama-scene-tool-move': {
    'from': ['Q'],
    'to': ['W']
  },
  'panorama-scene-tool-scale': {
    'from': ['W'],
    'to': ['E']
  },
  'panorama-scene-tool-rotate': {
    'from': ['E'],
    'to': ['R']
  },
  'panorama-scene-reset-view': {
    'from': ['R'],
    'to': []
  }
};
const DEFAULT_PRESET_SHORTCUT_MIGRATIONS = {
  'fit-all': {
    'from': ['Ctrl', '0'],
    'to': []
  }
};
const ASHUO_PRESET_SHORTCUT_MIGRATIONS = {
  'redo': {
    'from': ['Ctrl', 'Y'],
    'to': ["Ctrl", "Shift", 'Z']
  },
  'open-assets': {
    'from': [],
    'to': ['A']
  },
  'open-files': {
    'from': [],
    'to': ['Z']
  }
};
const BUILTIN_PRESET_SHORTCUT_MIGRATIONS = {
  'add-reference': {
    'from': [],
    'to': ['X']
  },
  'create-text': {
    'from': ['T'],
    'to': []
  }
};
function _emitShortcutsUpdated() {
  window["dispatchEvent"](new CustomEvent('shortcuts-updated'));
}
const _TOOLBAR_SHORTCUT_PREFIX_BY_NODE_TYPE = {
  'source-image': 'image-tool-',
  'ai-image': "image-tool-",
  'image': "image-tool-",
  'source-video': "video-tool-",
  'ai-video': 'video-tool-',
  'video': "video-tool-",
  'source-audio': "audio-tool-",
  'ai-audio': "audio-tool-",
  'audio': "audio-tool-",
  'media-clip': 'clip-tool-',
  'source-text': "text-tool-",
  'ai-text': "text-tool-",
  'text': 'text-tool-'
};
const _PANORAMA_SCENE_NODE_TYPES = new Set(['panorama-scene', 'panorama-360']);
function _isPanoramaSceneShortcut(_0x48dd05) {
  const _0x30bc12 = String(_0x48dd05 || '')['trim']();
  return _0x30bc12['startsWith']("panorama-scene-tool-") || _0x30bc12["startsWith"]("panorama-scene-camera-") || _0x30bc12["startsWith"]('panorama-scene-camera-save-') || _0x30bc12 === "panorama-scene-camera-create" || _0x30bc12 === "panorama-scene-reset-view" || _0x30bc12 === "panorama-scene-capture";
}
function _isNodeToolbarAction(_0x46532e) {
  return /^(image|video|audio|clip|text)-tool-/['test'](String(_0x46532e || ''));
}
function _isEditorShortcut(_0x373b30) {
  return String(_0x373b30 || '')["trim"]()["startsWith"]("editor-");
}
function _isCreateNodeShortcut(_0x22ad58) {
  return String(_0x22ad58 || '')['trim']()["startsWith"]('create-');
}
function _isGlobalShortcut(_0x35afa9) {
  const _0x354839 = String(_0x35afa9 || '')["trim"]();
  if (!_0x354839) {
    return ![];
  }
  return !isContextMenuShortcut(_0x354839) && !_isEditorShortcut(_0x354839) && !_isNodeToolbarAction(_0x354839) && !_isPanoramaSceneShortcut(_0x354839) && !_isCreateNodeShortcut(_0x354839);
}
function _isPanoramaSceneNodeType(_0x4a8af0) {
  return _PANORAMA_SCENE_NODE_TYPES["has"](String(_0x4a8af0 || '')["trim"]());
}
function _isPanoramaSceneEditingContext(_0x2f4f38) {
  return _isPanoramaSceneNodeType(_0x2f4f38?.["selectedNodeType"]) && _0x2f4f38?.["panoramaSceneEditing"] === !![];
}
function _filterShortcutMatchesByContext(_0x2e7d90, _0x1132b1 = {}) {
  let _0x31bd2a = Array['isArray'](_0x2e7d90) ? [..._0x2e7d90] : [];
  !(Number(_0x1132b1["selectedSyncPlayableVideoCount"]) >= 0x2) && (_0x31bd2a = _0x31bd2a["filter"](_0x57f553 => _0x57f553 !== "ms-sync-video-play"));
  _0x1132b1["featureModeActive"] && (_0x31bd2a = _0x31bd2a["filter"](_0xd3f9bc => !_isNodeToolbarAction(_0xd3f9bc)));
  _0x1132b1["alignFeatureEnabled"] === ![] && (_0x31bd2a = _0x31bd2a["filter"](_0x2593fb => _0x2593fb !== "align-feature"));
  _0x1132b1["mediaClipExpandedEditing"] === !![] && (_0x31bd2a = _0x31bd2a["filter"](_0x101e23 => _0x101e23 !== "pan-canvas"));
  _isPanoramaSceneEditingContext(_0x1132b1) && (_0x31bd2a = _0x31bd2a["filter"](_0xa9dd5e => !_isNodeToolbarAction(_0xa9dd5e) && !_isCreateNodeShortcut(_0xa9dd5e)));
  return _0x31bd2a;
}
function _resolveToolbarShortcutMatch(_0x1c9099, _0x401fcf) {
  const _0x54919e = _TOOLBAR_SHORTCUT_PREFIX_BY_NODE_TYPE[String(_0x401fcf || '')['trim']()];
  if (!_0x54919e) {
    return null;
  }
  return _0x1c9099['find'](_0x4e09bd => _0x4e09bd["startsWith"](_0x54919e)) || null;
}
function _resolveShortcutMatch(_0x3a2410, _0x44b6f7 = {}) {
  if (!Array["isArray"](_0x3a2410) || _0x3a2410["length"] === 0x0) {
    return null;
  }
  if (_0x44b6f7["mattingActive"] || _0x44b6f7["annotateActive"] || _0x44b6f7["videoKeyingActive"]) {
    const _0x19de26 = _0x3a2410["find"](_0x380d72 => _isEditorShortcut(_0x380d72));
    if (_0x19de26) {
      return _0x19de26;
    }
  }
  if (_isPanoramaSceneEditingContext(_0x44b6f7)) {
    const _0x406130 = _0x3a2410["find"](_0x4e7100 => _isPanoramaSceneShortcut(_0x4e7100));
    if (_0x406130) {
      return _0x406130;
    }
  }
  const _0x13909d = _resolveToolbarShortcutMatch(_0x3a2410, _0x44b6f7["selectedNodeType"]);
  if (_0x13909d) {
    return _0x13909d;
  }
  const _0x5c36eb = _0x3a2410["find"](_0x32fe76 => _isGlobalShortcut(_0x32fe76));
  if (_0x5c36eb) {
    return _0x5c36eb;
  }
  const _0x516ed1 = _0x3a2410["find"](_0x5c2a07 => _isCreateNodeShortcut(_0x5c2a07));
  if (_0x516ed1) {
    return _0x516ed1;
  }
  return null;
}
function _getShortcutBindingStrings(_0x5af8be, _0x285440) {
  if (_0x285440?.["disabled"] === !![]) {
    return [];
  }
  const _0x5d73fa = [];
  Array["isArray"](_0x285440?.["keys"]) && _0x285440["keys"]["length"] > 0x0 && _0x5d73fa["push"](_0x285440["keys"]);
  Array["isArray"](_0x285440?.["alternateKeys"]) && _0x285440["alternateKeys"]["forEach"](_0x51501b => {
    Array["isArray"](_0x51501b) && _0x51501b["length"] > 0x0 && _0x5d73fa['push'](_0x51501b);
  });
  const _0x47d002 = FIXED_GLOBAL_SHORTCUT_BINDINGS[_0x5af8be] || [];
  _0x47d002["forEach"](_0x25e8a4 => _0x5d73fa['push'](_0x25e8a4));
  return _0x5d73fa["map"](_0x45817b => _toShortcutBindingString(_0x45817b));
}
function _normalizeShortcutToken(_0xeddb47) {
  const _0x5257b0 = String(_0xeddb47 || '')['trim']();
  if (!_0x5257b0) {
    return '';
  }
  const _0x4ea0f4 = _0x5257b0["toLowerCase"]();
  if (_0x4ea0f4 === "ctrl" || _0x4ea0f4 === "control" || _0x4ea0f4 === "meta") {
    return "Ctrl";
  }
  if (_0x4ea0f4 === "shift") {
    return 'Shift';
  }
  if (_0x4ea0f4 === "alt") {
    return 'Alt';
  }
  if (_0x4ea0f4 === "space") {
    return "Space";
  }
  if (_0x4ea0f4 === 'backquote' || _0x5257b0 === '`' || _0x5257b0 === '~') {
    return '`';
  }
  if (_0x5257b0["length"] === 0x1) {
    return _0x5257b0["toUpperCase"]();
  }
  return _0x5257b0;
}
function _normalizeShortcutMainKey(_0x40e976) {
  const _0x258de5 = String(_0x40e976?.["code"] || '')["trim"]();
  const _0x26b1c9 = String(_0x40e976?.["key"] || '')["trim"]();
  if (_0x258de5 === "Backquote") {
    return '`';
  }
  if (_0x258de5 === "Space") {
    return "Space";
  }
  if (_0x258de5 === "Delete" || _0x26b1c9 === "Del") {
    return "Delete";
  }
  if (_0x258de5 === "Backspace") {
    return "Backspace";
  }
  return _normalizeShortcutToken(_0x40e976?.["key"] === '\x20' ? "Space" : _0x40e976?.["key"]);
}
function _normalizeShortcutKeys(_0x21e74d) {
  if (!Array["isArray"](_0x21e74d)) {
    return [];
  }
  const _0x15b652 = _0x21e74d["map"](_0x7f0f89 => _normalizeShortcutToken(_0x7f0f89))["filter"](Boolean);
  const _0x385835 = [];
  if (_0x15b652["includes"]("Ctrl")) {
    _0x385835["push"]("Ctrl");
  }
  if (_0x15b652["includes"]("Shift")) {
    _0x385835['push']("Shift");
  }
  if (_0x15b652["includes"]("Alt")) {
    _0x385835['push']("Alt");
  }
  const _0x3d54b3 = _0x15b652['filter'](_0x532ef7 => _0x532ef7 !== "Ctrl" && _0x532ef7 !== "Shift" && _0x532ef7 !== "Alt");
  return [..._0x385835, ..._0x3d54b3];
}
function _buildShortcutKeysFromEvent(_0xb17264) {
  const _0x1216cf = [];
  if (_0xb17264['ctrlKey'] || _0xb17264["metaKey"]) {
    _0x1216cf['push']("Ctrl");
  }
  if (_0xb17264["shiftKey"]) {
    _0x1216cf["push"]("Shift");
  }
  if (_0xb17264["altKey"]) {
    _0x1216cf["push"]('Alt');
  }
  const _0x1914a7 = _normalizeShortcutMainKey(_0xb17264);
  !["Ctrl", "Shift", "Alt", '']['includes'](_0x1914a7) && _0x1216cf['push'](_0x1914a7);
  return _0x1216cf;
}
function _toShortcutBindingString(_0x392ca7) {
  return _normalizeShortcutKeys(_0x392ca7)["join"]('+')["toUpperCase"]();
}
function _isContextualShortcutConflictExempt(_0x14e3a8, _0x2fac5a, _0x33bc2b) {
  const _0x45d719 = new Set([_0x14e3a8, _0x2fac5a]);
  if (_0x33bc2b === 'B') {
    return _0x45d719["has"]("toggle-connection-lines") && _0x45d719["has"]("editor-tool-brush");
  }
  if (_0x33bc2b === 'G') {
    return _0x45d719["has"]("ms-sync-video-play") && _0x45d719["has"]("editor-tool-bucket");
  }
  return ![];
}
function _resolveSavedShortcutKeys(_0x5c1ee6, _0x117d52, _0x421f35, _0x2cc86d = {}) {
  const _0x49ba44 = Array["isArray"](_0x117d52);
  const _0x3d826c = _0x49ba44 ? _normalizeShortcutKeys(_0x117d52) : [];
  if (_0x5c1ee6 === "global-text-preset" && _0x49ba44 && _toShortcutBindingString(_0x3d826c) === "ALT+C") {
    return [];
  }
  if (_0x2cc86d["rawSavedPresetName"] === CUSTOM_PRESET_NAME) {
    return _0x49ba44 ? _0x3d826c : _normalizeShortcutKeys(_0x421f35);
  }
  const _0x338c0d = _0x2cc86d["savedPresetName"] === DEFAULT_PRESET_NAME ? DEFAULT_PRESET_SHORTCUT_MIGRATIONS[_0x5c1ee6] : _0x2cc86d["savedPresetName"] === ASHUO_PRESET_NAME ? ASHUO_PRESET_SHORTCUT_MIGRATIONS[_0x5c1ee6] : null;
  const _0x1d4500 = BUILTIN_PRESET_NAMES["has"](_0x2cc86d["savedPresetName"]) ? BUILTIN_PRESET_SHORTCUT_MIGRATIONS[_0x5c1ee6] : null;
  if (_0x49ba44 && _0x338c0d && _toShortcutBindingString(_0x3d826c) === _toShortcutBindingString(_0x338c0d["from"])) {
    return _normalizeShortcutKeys(_0x338c0d['to']);
  }
  if (_0x49ba44 && _0x1d4500 && _toShortcutBindingString(_0x3d826c) === _toShortcutBindingString(_0x1d4500["from"])) {
    return _normalizeShortcutKeys(_0x1d4500['to']);
  }
  const _0x24e375 = DEFAULT_SHORTCUT_MIGRATIONS[_0x5c1ee6];
  if (_0x49ba44 && _0x24e375 && _toShortcutBindingString(_0x3d826c) === _toShortcutBindingString(_0x24e375['from'])) {
    return _normalizeShortcutKeys(_0x24e375['to']);
  }
  return _0x49ba44 ? _0x3d826c : _normalizeShortcutKeys(_0x421f35);
}
function _resolveSavedAlternateKeys(_0x20ab51, _0x45eeca, _0x2e8ebf) {
  const _0x4f8d75 = Array["isArray"](_0x20ab51?.["alternateKeys"]) ? _0x20ab51["alternateKeys"] : _0x2e8ebf === CUSTOM_PRESET_NAME ? [] : _0x45eeca;
  if (!Array["isArray"](_0x4f8d75)) {
    return [];
  }
  return _0x4f8d75['map'](_0x5ebac8 => _normalizeShortcutKeys(_0x5ebac8))["filter"](_0x449992 => _0x449992["length"] > 0x0);
}
function _normalizePresetName(_0x4f2624) {
  const _0x4d2afb = String(_0x4f2624 || '')['trim']();
  if (_0x4d2afb === "自定义") {
    return CUSTOM_PRESET_NAME;
  }
  if (BUILTIN_PRESET_NAMES["has"](_0x4d2afb)) {
    return _0x4d2afb;
  }
  if (_0x4d2afb === CUSTOM_PRESET_NAME) {
    return CUSTOM_PRESET_NAME;
  }
  return ASHUO_PRESET_NAME;
}
function _buildPresetShortcuts(_0x3d64f8) {
  const _0x52ed58 = _normalizePresetName(_0x3d64f8);
  const _0x4a87f3 = PRESETS[_0x52ed58] || {};
  return Object['fromEntries'](Object['entries'](DEFAULT_SHORTCUTS)['map'](([_0x51263e, _0x63aa37]) => [_0x51263e, {
    ..._0x63aa37,
    'keys': _normalizeShortcutKeys(_0x4a87f3[_0x51263e] ?? [..._0x63aa37["keys"]])
  }]));
}
function _shortcutsMatchPreset(_0x4857e8, _0x2d236a) {
  const _0x20525d = _buildPresetShortcuts(_0x2d236a);
  return Object['entries'](_0x20525d)["every"](([_0x3cd808, _0x2c8d3b]) => {
    const _0x18d592 = _0x4857e8?.[_0x3cd808]?.["keys"] || [];
    return _toShortcutBindingString(_0x18d592) === _toShortcutBindingString(_0x2c8d3b['keys']);
  });
}
function _inferPresetName(_0x4dcceb, _0xd3f718) {
  if (_normalizePresetName(_0xd3f718) === CUSTOM_PRESET_NAME) {
    return CUSTOM_PRESET_NAME;
  }
  if (_shortcutsMatchPreset(_0x4dcceb, DEFAULT_PRESET_NAME)) {
    return DEFAULT_PRESET_NAME;
  }
  if (_shortcutsMatchPreset(_0x4dcceb, ASHUO_PRESET_NAME)) {
    return ASHUO_PRESET_NAME;
  }
  return CUSTOM_PRESET_NAME;
}
async function _loadFromServer() {
  const _0x3211f8 = _saveRevision;
  try {
    const _0x4e7766 = await fetchUserShortcutsFromServer();
    if (_0x3211f8 !== _saveRevision) {
      return;
    }
    if (_0x4e7766 && _0x4e7766['shortcuts'] && Object["keys"](_0x4e7766['shortcuts'])['length'] > 0x0) {
      const _0x4b157d = String(_0x4e7766['preset'] || '')["trim"]();
      const _0x1c8a60 = _normalizePresetName(_0x4b157d);
      const _0x7d30ff = BUILTIN_PRESET_NAMES["has"](_0x1c8a60) ? _0x1c8a60 : ASHUO_PRESET_NAME;
      const _0x551ac2 = _buildPresetShortcuts(_0x7d30ff);
      _shortcuts = Object['fromEntries'](Object["entries"](_0x551ac2)["map"](([_0xa14055, _0x5403e9]) => [_0xa14055, _0x4e7766["shortcuts"][_0xa14055] ? {
        ..._0x5403e9,
        'keys': _resolveSavedShortcutKeys(_0xa14055, _0x4e7766["shortcuts"][_0xa14055]['keys'], _0x5403e9["keys"], {
          'savedPresetName': _0x1c8a60,
          'rawSavedPresetName': _0x4b157d
        }),
        'alternateKeys': _resolveSavedAlternateKeys(_0x4e7766["shortcuts"][_0xa14055], _0x5403e9["alternateKeys"], _0x4b157d)
      } : {
        ..._0x5403e9,
        'keys': _normalizeShortcutKeys(_0x5403e9['keys'])
      }]));
      _currentPreset = _inferPresetName(_shortcuts, _0x1c8a60);
      if (_shortcuts['matting-auto']) {
        _shortcuts["matting-auto"]["keys"] = [];
      }
      _updatePresetSelect();
      _render();
      _syncShortcutsToGlobal();
      _emitShortcutsUpdated();
    } else {
      _applyPreset(ASHUO_PRESET_NAME, ![]);
      _syncShortcutsToGlobal();
    }
  } catch {
    if (_0x3211f8 !== _saveRevision) {
      return;
    }
    _applyPreset(ASHUO_PRESET_NAME, ![]);
    _syncShortcutsToGlobal();
  }
}
function _createShortcutSavePayload() {
  return {
    'preset': _currentPreset,
    'shortcuts': Object['fromEntries'](Object['entries'](_shortcuts)["map"](([_0x40d14a, _0x2af55e]) => [_0x40d14a, {
      'keys': _0x2af55e["keys"],
      ...(Array['isArray'](_0x2af55e["alternateKeys"]) ? {
        'alternateKeys': _0x2af55e['alternateKeys']
      } : {})
    }]))
  };
}
function _saveToServer() {
  _saveRevision += 0x1;
  if (_saveLoopPromise) {
    return _saveLoopPromise;
  }
  _saveLoopPromise = (async () => {
    while (!![]) {
      const _0x2de42a = _saveRevision;
      const _0x47acdd = _createShortcutSavePayload();
      try {
        await saveUserShortcutsToServer(_0x47acdd);
        _syncShortcutsToGlobal();
      } catch (_0x386c16) {
        console["warn"]("[shortcuts] save failed:", _0x386c16);
      }
      if (_0x2de42a === _saveRevision) {
        break;
      }
    }
  })()["finally"](() => {
    _saveLoopPromise = null;
  });
  return _saveLoopPromise;
}
function _syncShortcutsToGlobal() {
  if (typeof window === 'undefined') {
    return;
  }
  window['__aicConfiguredShortcutBindings'] = Array["from"](new Set(Object["entries"](_shortcuts)["flatMap"](([_0x46428a, _0x31f27a]) => _getShortcutBindingStrings(_0x46428a, _0x31f27a))));
  const _0x25f7e5 = {};
  const _0x13b7bd = ['editor-tool-brush', "editor-tool-eraser", "editor-tool-bucket", "editor-clear"];
  _0x13b7bd['forEach'](_0x335183 => {
    if (_shortcuts[_0x335183]?.["keys"]?.["length"] > 0x0) {
      const _0x1fa3f3 = _shortcuts[_0x335183]["keys"][_shortcuts[_0x335183]["keys"]["length"] - 0x1];
      _0x25f7e5[_0x335183] = _0x1fa3f3["toUpperCase"]();
    }
  });
  window['_mattingShortcuts'] = _0x25f7e5;
  _syncCanvasScreenshotShortcutToElectron();
  _syncGlobalTextCaptureShortcutsToElectron();
}
function _syncCanvasScreenshotShortcutToElectron() {
  if (typeof window === "undefined") {
    return;
  }
  if (!desktopBridge["screenshot"]["isAvailable"]()) {
    return;
  }
  const _0x33417d = Array["isArray"](_shortcuts?.["canvas-screenshot"]?.["keys"]) ? _shortcuts["canvas-screenshot"]['keys'] : DEFAULT_SHORTCUTS["canvas-screenshot"]["keys"];
  try {
    const _0x59aec2 = desktopBridge["screenshot"]["updateGlobalShortcut"]({
      'keys': _0x33417d
    });
    _0x59aec2 && typeof _0x59aec2["catch"] === "function" && _0x59aec2["catch"](_0x53a609 => {
      console["warn"]("[shortcuts] failed to sync global screenshot shortcut:", _0x53a609);
    });
  } catch (_0x9072d8) {
    console["warn"]('[shortcuts]\x20failed\x20to\x20sync\x20global\x20screenshot\x20shortcut:', _0x9072d8);
  }
}
function _syncGlobalTextCaptureShortcutsToElectron() {
  if (typeof window === "undefined") {
    return;
  }
  if (!desktopBridge['textPreset']["isAvailable"]()) {
    return;
  }
  ["global-capture-launcher", "global-text-preset"]["forEach"](_0x225372 => {
    const _0x274780 = Array["isArray"](_shortcuts?.[_0x225372]?.["keys"]) ? _shortcuts[_0x225372]["keys"] : DEFAULT_SHORTCUTS[_0x225372]["keys"];
    try {
      const _0x4c0959 = desktopBridge['textPreset']["updateGlobalShortcut"]({
        'actionId': _0x225372,
        'keys': _0x274780
      });
      _0x4c0959 && typeof _0x4c0959["catch"] === "function" && _0x4c0959['catch'](_0x396b67 => {
        console["warn"]("[shortcuts] failed to sync " + _0x225372 + " global shortcut:", _0x396b67);
      });
    } catch (_0x2f8af4) {
      console["warn"]('[shortcuts]\x20failed\x20to\x20sync\x20' + _0x225372 + " global shortcut:", _0x2f8af4);
    }
  });
}
function _applyPreset(_0x33a171, _0xd24df3 = !![]) {
  const _0x7bd212 = _normalizePresetName(_0x33a171);
  if (!BUILTIN_PRESET_NAMES["has"](_0x7bd212)) {
    return;
  }
  _currentPreset = _0x7bd212;
  _shortcuts = _buildPresetShortcuts(_0x7bd212);
  _render();
  _syncShortcutsToGlobal();
  _emitShortcutsUpdated();
  if (_0xd24df3) {
    _saveToServer();
  }
}
function _getPresetControls() {
  if (typeof document === 'undefined') {
    return {};
  }
  const _0x16dda3 = document["getElementById"]("shortcutsPresetSelect");
  const _0x312acc = document["getElementById"]("shortcutsPresetControl");
  const _0x1888bf = document['getElementById']("shortcutsPresetTrigger");
  const _0x23ee0e = document["getElementById"]("shortcutsPresetTriggerText");
  const _0x2d7c9b = document["getElementById"]("shortcutsPresetMenu");
  const _0x1c504e = _0x2d7c9b?.["querySelectorAll"] ? Array["from"](_0x2d7c9b['querySelectorAll'](".settings-preset-option")) : [];
  return {
    'select': _0x16dda3,
    'control': _0x312acc,
    'trigger': _0x1888bf,
    'triggerText': _0x23ee0e,
    'menu': _0x2d7c9b,
    'options': _0x1c504e
  };
}
function _getPresetLabel(_0x3409e5) {
  const {
    select: _0x9ddae4,
    options: _0x5fa9c2
  } = _getPresetControls();
  const _0x428f44 = _0x9ddae4?.["options"] ? Array['from'](_0x9ddae4["options"])["find"](_0x22da14 => _0x22da14["value"] === _0x3409e5) : null;
  const _0x4f8a8f = _0x5fa9c2["find"](_0x677b1a => _0x677b1a["dataset"]?.['value'] === _0x3409e5);
  return _0x428f44?.["textContent"] || _0x4f8a8f?.["textContent"] || _0x3409e5;
}
function _setPresetMenuOpen(_0x4f923b, {
  focusOption = ![],
  focusTrigger = ![]
} = {}) {
  const {
    control: _0xb18be6,
    trigger: _0x2b760c,
    menu: _0x8d51e1,
    options: _0x8160a8
  } = _getPresetControls();
  if (!_0xb18be6 || !_0x2b760c || !_0x8d51e1) {
    return;
  }
  _0xb18be6['classList']['toggle']("is-open", _0x4f923b);
  _0x2b760c['setAttribute']("aria-expanded", _0x4f923b ? "true" : "false");
  _0x8d51e1["hidden"] = !_0x4f923b;
  if (_0x4f923b && focusOption) {
    const _0x5c67a4 = _0x8160a8["find"](_0x4a82a1 => _0x4a82a1["dataset"]?.["value"] === _currentPreset && !_0x4a82a1["disabled"]);
    const _0x157e65 = _0x8160a8["find"](_0x4c1253 => !_0x4c1253['disabled']);
    (_0x5c67a4 || _0x157e65)?.["focus"]?.();
  } else {
    !_0x4f923b && focusTrigger && _0x2b760c["focus"]?.();
  }
}
function _isPresetMenuOpen() {
  const {
    control: _0x476b21
  } = _getPresetControls();
  return !!_0x476b21?.["classList"]?.["contains"]("is-open");
}
function _selectPresetFromUi(_0x25e41b) {
  if (_normalizePresetName(_0x25e41b) === CUSTOM_PRESET_NAME) {
    _updatePresetSelect();
    _setPresetMenuOpen(![], {
      'focusTrigger': !![]
    });
    return;
  }
  const _0x410b67 = _normalizePresetName(_0x25e41b);
  _applyPreset(_0x410b67, !![]);
  _updatePresetSelect();
  _setPresetMenuOpen(![], {
    'focusTrigger': !![]
  });
  window["showToast"]?.(_tShortcut("presetSwitched", '已切换预设：' + _0x410b67, {
    'preset': _getPresetLabel(_0x410b67)
  }));
}
function _movePresetOptionFocus(_0x28c7a3) {
  const {
    options: _0x3ce88c
  } = _getPresetControls();
  const _0x297c5c = _0x3ce88c["filter"](_0x5b7dd8 => !_0x5b7dd8["disabled"]);
  if (_0x297c5c["length"] === 0x0) {
    return;
  }
  const _0x1b3d32 = document["activeElement"];
  let _0x3b3f56 = _0x297c5c["indexOf"](_0x1b3d32);
  _0x3b3f56 < 0x0 && (_0x3b3f56 = _0x297c5c["findIndex"](_0x57a712 => _0x57a712["dataset"]?.["value"] === _currentPreset));
  const _0x3d2748 = (Math["max"](_0x3b3f56, 0x0) + _0x28c7a3 + _0x297c5c["length"]) % _0x297c5c["length"];
  _0x297c5c[_0x3d2748]?.["focus"]?.();
}
function _updatePresetSelect() {
  const {
    select: _0xcf8ba3,
    triggerText: _0x2f9061,
    options: _0x1d668d
  } = _getPresetControls();
  if (_0xcf8ba3) {
    _0xcf8ba3["value"] = _currentPreset;
  }
  if (_0x2f9061) {
    _0x2f9061["textContent"] = _getPresetLabel(_currentPreset);
  }
  _0x1d668d['forEach'](_0x416b0f => {
    const _0x83270c = _0x416b0f["dataset"]?.["value"] === _currentPreset;
    _0x416b0f["classList"]['toggle']("is-active", _0x83270c);
    _0x416b0f["setAttribute"]("aria-selected", _0x83270c ? "true" : "false");
  });
}
function _initPresetSelect() {
  const {
    select: _0x228054,
    control: _0x1d0c7e,
    trigger: _0x295894,
    menu: _0x55bab4
  } = _getPresetControls();
  _0x228054 && !_0x228054["dataset"]["presetSelectBound"] && (_0x228054["dataset"]["presetSelectBound"] = 'true', _0x228054["addEventListener"]("change", () => {
    _selectPresetFromUi(_0x228054['value']);
  }));
  if (!_0x1d0c7e || !_0x295894 || !_0x55bab4 || _0x295894["dataset"]["presetSelectBound"]) {
    _updatePresetSelect();
    return;
  }
  _0x295894["dataset"]["presetSelectBound"] = "true";
  _0x295894["addEventListener"]("click", () => {
    _setPresetMenuOpen(!_isPresetMenuOpen(), {
      'focusOption': !![]
    });
  });
  _0x295894['addEventListener']("keydown", _0x32b8c9 => {
    (_0x32b8c9['key'] === "ArrowDown" || _0x32b8c9["key"] === "Enter" || _0x32b8c9["key"] === '\x20') && (_0x32b8c9["preventDefault"](), _setPresetMenuOpen(!![], {
      'focusOption': !![]
    }));
  });
  _0x55bab4["addEventListener"]("click", _0x285148 => {
    const _0x6640d = _0x285148["target"]?.["closest"]?.(".settings-preset-option");
    if (!_0x6640d || _0x6640d['disabled']) {
      return;
    }
    _selectPresetFromUi(_0x6640d["dataset"]["value"]);
  });
  _0x55bab4["addEventListener"]("keydown", _0x1ce1f7 => {
    if (_0x1ce1f7["key"] === "Escape") {
      _0x1ce1f7["preventDefault"]();
      _setPresetMenuOpen(![], {
        'focusTrigger': !![]
      });
    } else {
      if (_0x1ce1f7['key'] === 'ArrowDown') {
        _0x1ce1f7["preventDefault"]();
        _movePresetOptionFocus(0x1);
      } else {
        if (_0x1ce1f7["key"] === "ArrowUp") {
          _0x1ce1f7['preventDefault']();
          _movePresetOptionFocus(-0x1);
        } else {
          if (_0x1ce1f7["key"] === "Enter" || _0x1ce1f7["key"] === '\x20') {
            _0x1ce1f7["preventDefault"]();
            const _0xe1d366 = document["activeElement"]?.["closest"]?.('.settings-preset-option');
            if (_0xe1d366 && !_0xe1d366["disabled"]) {
              _selectPresetFromUi(_0xe1d366["dataset"]['value']);
            }
          }
        }
      }
    }
  });
  document["addEventListener"]("pointerdown", _0x3585fd => {
    if (!_isPresetMenuOpen()) {
      return;
    }
    if (typeof _0x1d0c7e["contains"] === "function" && _0x1d0c7e["contains"](_0x3585fd['target'])) {
      return;
    }
    _setPresetMenuOpen(![]);
  });
  _updatePresetSelect();
}
function _normalizeShortcutSearchText(_0x444587) {
  return String(_0x444587 || '')["trim"]()["toLocaleLowerCase"]();
}
function _matchesShortcutSearch(_0x27160d, _0x272e41, _0x5788e7, _0x43577f) {
  const _0x50b20f = _normalizeShortcutSearchText(_0x43577f);
  if (!_0x50b20f) {
    return !![];
  }
  const _0xcf7c69 = _getShortcutBindingStrings(_0x27160d, _0x272e41);
  const _0x2b25f7 = _0xcf7c69["length"] > 0x0 ? _0xcf7c69["flatMap"](_0x4fcf87 => [_0x4fcf87, _0x4fcf87["replaceAll"]('+', '\x20')]) : [_tShortcut("unset", "未设置")];
  const _0x3d9448 = _normalizeShortcutSearchText([_0x27160d, _0x272e41["label"], _translateShortcutAction(_0x27160d, _0x272e41["label"]), _0x5788e7, _translateShortcutGroup(_0x5788e7), ..._0x2b25f7]["join"]('\x20'));
  return _0x50b20f["split"](/\s+/)['filter'](Boolean)["every"](_0x24f6fd => _0x3d9448["includes"](_0x24f6fd));
}
function _render() {
  const _0x18b0ce = document["getElementById"]("shortcutsContent");
  if (!_0x18b0ce) {
    return;
  }
  _0x18b0ce["replaceChildren"]();
  const _0xe43f96 = {};
  Object['entries'](_shortcuts)["forEach"](([_0x4dee25, _0x186ac9]) => {
    if (_0x186ac9["hidden"]) {
      return;
    }
    if (!_matchesShortcutSearch(_0x4dee25, _0x186ac9, _0x186ac9["group"], _shortcutSearchQuery)) {
      return;
    }
    if (!_0xe43f96[_0x186ac9["group"]]) {
      _0xe43f96[_0x186ac9["group"]] = [];
    }
    _0xe43f96[_0x186ac9['group']]['push']({
      'id': _0x4dee25,
      ..._0x186ac9
    });
  });
  if (Object['keys'](_0xe43f96)["length"] === 0x0 && _normalizeShortcutSearchText(_shortcutSearchQuery)) {
    const _0x27b317 = document['createElement']("div");
    _0x27b317["className"] = "sc-empty";
    _0x27b317["setAttribute"]("role", "status");
    _0x27b317["setAttribute"]("aria-live", "polite");
    _0x27b317['textContent'] = _tShortcut("noResults", "没有找到匹配的快捷键");
    _0x18b0ce["appendChild"](_0x27b317);
    return;
  }
  Object["entries"](_0xe43f96)['forEach'](([_0x4c6af5, _0x2eae69]) => {
    const _0x342d59 = document['createElement']("div");
    _0x342d59["className"] = 'sc-section';
    const _0x475b96 = document["createElement"]('div');
    _0x475b96["className"] = "sc-section-title";
    _0x475b96['textContent'] = _translateShortcutGroup(_0x4c6af5);
    _0x342d59["appendChild"](_0x475b96);
    _0x2eae69["forEach"](_0x45d18d => {
      const _0xa046f5 = document["createElement"]("div");
      _0xa046f5['className'] = "sc-item";
      const _0x205924 = document["createElement"]("span");
      _0x205924["className"] = 'sc-label';
      _0x205924["textContent"] = _translateShortcutAction(_0x45d18d['id'], _0x45d18d["label"]);
      const _0x57c23e = document["createElement"]("div");
      _0x57c23e["className"] = 'sc-keys';
      _0x57c23e["dataset"]["action"] = _0x45d18d['id'];
      _0x57c23e["replaceChildren"]();
      if (_recordingAction === _0x45d18d['id']) {
        const _0x573bdb = document["createElement"]("kbd");
        _0x573bdb["className"] = "kbd-v2 recording";
        _0x573bdb["textContent"] = _tShortcut("recording", "录制中...");
        _0x57c23e["appendChild"](_0x573bdb);
      } else {
        if (_0x45d18d["keys"]["length"] > 0x0) {
          _0x45d18d["keys"]['forEach'](_0x18f275 => {
            const _0x845930 = document["createElement"]("kbd");
            _0x845930['className'] = "kbd-v2";
            _0x845930["textContent"] = _0x18f275;
            _0x57c23e["appendChild"](_0x845930);
          });
        } else {
          const _0x3c2d54 = document["createElement"]("kbd");
          _0x3c2d54['className'] = "kbd-v2";
          _0x3c2d54["textContent"] = _tShortcut("unset", '未设置');
          _0x57c23e['appendChild'](_0x3c2d54);
        }
      }
      _0x57c23e["addEventListener"]("click", () => _startRecording(_0x45d18d['id']));
      _0xa046f5["appendChild"](_0x205924);
      _0xa046f5["appendChild"](_0x57c23e);
      _0x342d59["appendChild"](_0xa046f5);
    });
    _0x18b0ce['appendChild'](_0x342d59);
  });
}
function _initShortcutSearch() {
  const _0xd4d3ce = document['getElementById']("shortcutsSearchInput");
  if (!_0xd4d3ce) {
    return;
  }
  _shortcutSearchQuery = _0xd4d3ce["value"] || '';
  if (_0xd4d3ce["dataset"]["shortcutSearchBound"]) {
    _render();
    return;
  }
  _0xd4d3ce["dataset"]['shortcutSearchBound'] = "true";
  _0xd4d3ce["addEventListener"]('input', _0x4d6107 => {
    _shortcutSearchQuery = _0x4d6107["target"]?.['value'] || '';
    _render();
  });
  _0xd4d3ce["addEventListener"]('keydown', _0x1747e4 => {
    if (_0x1747e4["key"] !== "Escape" || !_0xd4d3ce['value']) {
      return;
    }
    _0x1747e4['preventDefault']();
    _0x1747e4["stopPropagation"]();
    _0xd4d3ce["value"] = '';
    _shortcutSearchQuery = '';
    _render();
  });
}
function _startRecording(_0x196017) {
  if (_recordingAction) {
    return;
  }
  _setRecordingAction(_0x196017);
  _render();
}
export function detectShortcutConflict(_0x132e83, _0x2052db, _0x4e3a2d) {
  if (!_0x132e83 || typeof _0x132e83 !== "object") {
    return null;
  }
  const _0x36dbb6 = _toShortcutBindingString(_0x4e3a2d);
  if (!_0x36dbb6) {
    return null;
  }
  for (const [_0x33794, _0x576e44] of Object["entries"](_0x132e83)) {
    if (_0x33794 === _0x2052db) {
      continue;
    }
    if (_getShortcutBindingStrings(_0x33794, _0x576e44)["includes"](_0x36dbb6)) {
      if (_isContextualShortcutConflictExempt(_0x2052db, _0x33794, _0x36dbb6)) {
        continue;
      }
      return {
        'id': _0x33794,
        'label': _0x576e44["label"] || _0x33794
      };
    }
  }
  return null;
}
function _stopRecording(_0x52d895) {
  if (!_recordingAction) {
    return;
  }
  if (_0x52d895 && _0x52d895["length"] > 0x0) {
    const _0x20a1ad = detectShortcutConflict(_shortcuts, _recordingAction, _0x52d895);
    if (_0x20a1ad) {
      window["showToast"]?.(_tShortcut("conflict", '快捷键冲突：已被「' + _0x20a1ad["label"] + "」占用", {
        'label': _translateShortcutAction(_0x20a1ad['id'], _0x20a1ad["label"])
      }), "warn");
      _setRecordingAction(null);
      _render();
      return;
    }
    _shortcuts[_recordingAction]["keys"] = _normalizeShortcutKeys(_0x52d895);
    _shortcuts[_recordingAction]["alternateKeys"] = [];
    _currentPreset = CUSTOM_PRESET_NAME;
    _updatePresetSelect();
    _syncShortcutsToGlobal();
    _emitShortcutsUpdated();
    _saveToServer();
    window["showToast"]?.(_tShortcut("updated", "快捷键已更新"), 'success');
  }
  _setRecordingAction(null);
  _render();
}
function _reset() {
  _applyPreset(DEFAULT_PRESET_NAME, !![]);
  _updatePresetSelect();
  window["showToast"]?.(_tShortcut('restored', "已恢复默认快捷键"));
}
export function openShortcuts() {
  if (!openSettingsPanel()) {
    return;
  }
  activateSettingsPane("shortcuts");
  _render();
  _updatePresetSelect();
}
export function closeShortcuts() {
  closeSettingsPanel();
  _recordingAction && (_setRecordingAction(null), _render());
}
export function getShortcuts() {
  return _shortcuts;
}
export function getShortcutLabel(_0x515c85, _0x394ead = '') {
  const _0x2144a5 = String(_0x515c85 || '')["trim"]();
  if (!_0x2144a5) {
    return _0x394ead;
  }
  const _0x133721 = getShortcutKeys(_0x2144a5);
  return _0x133721['length'] > 0x0 ? _0x133721["join"]('\x20') : '';
}
export function getShortcutKeys(_0x34e1d8) {
  const _0x38faca = String(_0x34e1d8 || '')['trim']();
  if (!_0x38faca) {
    return [];
  }
  const _0x3c8d2d = _shortcuts[_0x38faca] || DEFAULT_SHORTCUTS[_0x38faca];
  return Array["isArray"](_0x3c8d2d?.['keys']) ? _0x3c8d2d["keys"]["filter"](Boolean) : [];
}
export function resolveShortcutActionForEvent(_0x230bc7, _0xb2e48f = []) {
  const _0x196f5d = _toShortcutBindingString(_buildShortcutKeysFromEvent(_0x230bc7));
  if (!_0x196f5d) {
    return null;
  }
  for (const _0x3f75a8 of _0xb2e48f) {
    const _0x33b895 = String(_0x3f75a8 || '')["trim"]();
    if (!_0x33b895) {
      continue;
    }
    const _0x2b8f74 = _shortcuts[_0x33b895] || DEFAULT_SHORTCUTS[_0x33b895];
    if (_getShortcutBindingStrings(_0x33b895, _0x2b8f74)["includes"](_0x196f5d)) {
      return _0x33b895;
    }
  }
  return null;
}
export function getInitialShortcuts() {
  return _buildPresetShortcuts(ASHUO_PRESET_NAME);
}
export function getCurrentPreset() {
  return _currentPreset;
}
export function isRecording() {
  return !!_recordingAction;
}
export function handleShortcutKeydown(_0x42da7d, _0x154a5c = {}) {
  if (_recordingAction) {
    return null;
  }
  const _0x228fd0 = _toShortcutBindingString(_buildShortcutKeysFromEvent(_0x42da7d));
  let _0xe1249a = [];
  for (const [_0x4227e9, _0x4511b1] of Object['entries'](_shortcuts)) {
    _getShortcutBindingStrings(_0x4227e9, _0x4511b1)["includes"](_0x228fd0) && _0xe1249a["push"](_0x4227e9);
  }
  _0xe1249a = _filterShortcutMatchesByContext(_0xe1249a, _0x154a5c);
  if (_0xe1249a['length'] === 0x0) {
    if (_0x42da7d?.["shiftKey"] === !![] && _0x154a5c?.["featureModeActive"] !== !![]) {
      const _0x1aacc4 = _shortcuts["ms-sync-video-play"];
      const _0x197ab1 = _toShortcutBindingString(_buildShortcutKeysFromEvent({
        'ctrlKey': _0x42da7d?.["ctrlKey"],
        'metaKey': _0x42da7d?.["metaKey"],
        'shiftKey': ![],
        'altKey': _0x42da7d?.["altKey"],
        'key': _0x42da7d?.["key"],
        'code': _0x42da7d?.["code"]
      }));
      const _0x51e56e = _getShortcutBindingStrings("ms-sync-video-play", _0x1aacc4)["includes"](_0x197ab1);
      if (_0x51e56e && Number(_0x154a5c?.['selectedSyncPlayableVideoCount']) >= 0x2) {
        return 'ms-sync-video-loop-play';
      }
    }
    return null;
  }
  return _resolveShortcutMatch(_0xe1249a, _0x154a5c);
}
function _handleRecordingKeydown(_0x2cc674) {
  if (!_recordingAction) {
    return;
  }
  _0x2cc674["preventDefault"]();
  _0x2cc674["stopImmediatePropagation"]();
  if (_0x2cc674["key"] === "Escape") {
    _stopRecording(null);
    return;
  }
  const _0x181ebe = _buildShortcutKeysFromEvent(_0x2cc674);
  const _0x2e5c1a = _normalizeShortcutMainKey(_0x2cc674);
  const _0x6be320 = MODIFIER_ONLY_SHORTCUT_ACTIONS["has"](_recordingAction);
  _0x181ebe["length"] > 0x0 && (_0x6be320 || !["Ctrl", "Shift", "Alt", '']["includes"](_0x2e5c1a)) && _stopRecording(_0x181ebe);
}
if (typeof document !== "undefined" && document?.["addEventListener"]) {
  onLocaleChange(() => {
    _render();
    _updatePresetSelect();
  });
  const recordingEventTarget = typeof window !== "undefined" && window?.["addEventListener"] ? window : document;
  recordingEventTarget['addEventListener']("keydown", _handleRecordingKeydown, !![]);
  typeof window !== "undefined" && window?.["addEventListener"] && window['addEventListener']("settings-panel-closed", () => {
    if (!_recordingAction) {
      return;
    }
    _stopRecording(null);
  });
  document["addEventListener"]('DOMContentLoaded', () => {
    _loadFromServer();
    document["getElementById"]("btnShortcutsClose")?.["addEventListener"]("click", closeShortcuts);
    document["getElementById"]("btnResetShortcuts")?.["addEventListener"]("click", _0x2f2147 => {
      _0x2f2147["stopPropagation"]();
      _reset();
    });
    document["getElementById"]('btnShortcutsClose')?.["addEventListener"]("click", closeShortcuts);
    document["getElementById"]("btnShortcuts")?.["addEventListener"]("click", _0xa5d71a => {
      _0xa5d71a["stopPropagation"]();
      document["getElementById"]("avatarMenu")?.["classList"]["remove"]("open");
      openShortcuts();
    });
    _initPresetSelect();
    _initShortcutSearch();
  });
}