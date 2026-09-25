export const DEFAULT_NODE_SIZE = {
  'width': 0x118,
  'height': 0xc8
};
export const ZOOM_LIMITS = {
  'min': 0.1,
  'max': 0x3,
  'default': 0x1
};
export const GRID = {
  'size': 0x14,
  'snapThreshold': 0xa
};
export const MINIMAP = {
  'size': 0xc8,
  'padding': 0x258
};
export const NODE_TYPES = {
  'SOURCE_IMAGE': "sourceImage",
  'SOURCE_TEXT': "sourceText",
  'SOURCE_AUDIO': "sourceAudio",
  'SOURCE_VIDEO': "sourceVideo",
  'AI_GENERATE': 'aiGenerate',
  'AI_GEN_TEXT': "aiGenText",
  'AI_GEN_IMAGE': "aiGenImage",
  'AI_GEN_VIDEO': "aiGenVideo",
  'AI_GEN_AUDIO': "aiGenAudio",
  'GROUP': "group",
  'DEBUG': "debug",
  'STORYBOARD': 'storyboard'
};
export const NODE_TYPE_LABELS = {
  [NODE_TYPES['SOURCE_IMAGE']]: "源图片",
  [NODE_TYPES["SOURCE_TEXT"]]: '源文本',
  [NODE_TYPES["SOURCE_AUDIO"]]: "源音频",
  [NODE_TYPES["SOURCE_VIDEO"]]: "源视频",
  [NODE_TYPES["AI_GENERATE"]]: "AI 生成",
  [NODE_TYPES['AI_GEN_TEXT']]: 'AI\x20文本',
  [NODE_TYPES['AI_GEN_IMAGE']]: "AI 图像",
  [NODE_TYPES['AI_GEN_VIDEO']]: "AI 视频",
  [NODE_TYPES["AI_GEN_AUDIO"]]: "AI 音频",
  [NODE_TYPES["GROUP"]]: '组',
  [NODE_TYPES["DEBUG"]]: '调试',
  [NODE_TYPES["STORYBOARD"]]: '故事板'
};
export const THUMBNAIL = {
  'maxWidth': 0x320,
  'maxHeight': 0x320,
  'quality': 0.8,
  'format': 'image/jpeg'
};
export const IMAGE_COMPRESSION = {
  'maxDimension': 0x320,
  'quality': 0.6,
  'format': "image/jpeg"
};
export const SUPPORTED_IMAGE_FORMATS = ['.jpg', '.jpeg', '.png', ".gif", '.webp', ".svg", ".bmp", '.avif'];
export const MAX_FILE_SIZE = 0xa * 0x400 * 0x400;
export const DB_CONFIG = {
  'name': "TapNowCanvasDB",
  'version': 0x2,
  'storeName': 'images',
  'thumbnailStoreName': "thumbnails"
};
export const STORAGE_KEYS = {
  'SETTINGS': "tapnow_settings",
  'RECENT_FILES': "tapnow_recent_files",
  'USER_PREFERENCES': "tapnow_user_preferences"
};
export const ANIMATION_DURATION = {
  'fast': 0x96,
  'normal': 0x12c,
  'slow': 0x1f4
};
export const DRAG = {
  'threshold': 0x5,
  'edgeHandleSize': 0xc
};
export const EDGE = {
  'strokeWidth': 0x2,
  'hoverStrokeWidth': 0x4,
  'color': "var(--indigo)",
  'hoverColor': "var(--indigo-text)"
};
export const API_BASE = '';
export const API_ENDPOINTS = {
  'USER_FILE': _0x229fd0 => "/api/v2/user/" + _0x229fd0,
  'PROJECTS': "/api/v2/projects",
  'IMAGES': "/api/v2/images"
};
export const REQUEST_TIMEOUT = 0x7530;
export const MAX_RETRY_COUNT = 0x3;
export const MODIFIER_KEYS = {
  'CTRL': "Ctrl",
  'SHIFT': 'Shift',
  'ALT': "Alt",
  'META': "Meta"
};
export const COMMON_SHORTCUTS = {
  'COPY': ["Ctrl", 'C'],
  'PASTE': ["Ctrl", 'V'],
  'CUT': ['Ctrl', 'X'],
  'UNDO': ["Ctrl", 'Z'],
  'REDO': ["Shift", 'Ctrl', 'Z'],
  'SELECT_ALL': ['Ctrl', 'A'],
  'SAVE': ["Ctrl", 'S'],
  'DELETE': ['Delete'],
  'ESCAPE': ["Escape"]
};
export const ERROR_TYPES = {
  'NETWORK': "NETWORK_ERROR",
  'VALIDATION': "VALIDATION_ERROR",
  'NOT_FOUND': "NOT_FOUND",
  'PERMISSION': "PERMISSION_DENIED",
  'UNKNOWN': "UNKNOWN_ERROR"
};
export const ERROR_MESSAGES = {
  [ERROR_TYPES["NETWORK"]]: "网络连接失败，请检查网络设置",
  [ERROR_TYPES["VALIDATION"]]: '数据验证失败',
  [ERROR_TYPES["NOT_FOUND"]]: "请求的资源不存在",
  [ERROR_TYPES['PERMISSION']]: "权限不足",
  [ERROR_TYPES["UNKNOWN"]]: '发生未知错误'
};
export const THEME_MODES = {
  'LIGHT': "light",
  'DARK': "dark",
  'SYSTEM': 'system'
};
export const COLORS = {
  'primary': "var(--indigo)",
  'primaryHover': "var(--indigo-text)",
  'success': "var(--green)",
  'warning': "var(--gold)",
  'error': "var(--red)",
  'info': "var(--blue)"
};