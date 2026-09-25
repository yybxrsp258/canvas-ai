import { t } from '../i18n/index.js';
export const STORYBOARD_SCRIPT_NODE_TYPE = "storyboard-script";
export const STORYBOARD_SCRIPT_DEFAULT_NAME = "分镜脚本";
export const STORYBOARD_SCRIPT_DEFAULT_VIEW_MODE = "list";
export const STORYBOARD_SCRIPT_DEFAULT_MEDIA_MODE = 'image';
export const STORYBOARD_SCRIPT_TEXT_PROVIDER = "volcengine";
export const STORYBOARD_SCRIPT_TEXT_MODEL = 'volcengine/doubao-seed-2-0-lite-260428';
export const STORYBOARD_SCRIPT_DEFAULT_SIZE = Object['freeze']({
  'width': 0x400,
  'height': 0x240
});
function storyboardScriptText(_0x1cd67f, _0x47ec2c = {}) {
  return t('storyboardScript.' + _0x1cd67f, _0x47ec2c);
}
export function getStoryboardScriptDefaultName() {
  return storyboardScriptText("defaultName");
}
const STORYBOARD_SCRIPT_COLUMN_LABELS = Object['freeze'](['镜号', '时长', '景别', '场景', "画面描述", '角色', "角色描述", "角色动作", '情绪', "角色图", '参考', "图片提示词", "视频提示词", '对白', '音效']);
export const STORYBOARD_SCRIPT_COLUMNS = Object['freeze'](STORYBOARD_SCRIPT_COLUMN_LABELS["map"](_0x367421 => Object['freeze']({
  'key': _0x367421,
  'label': _0x367421
})));
export const STORYBOARD_SCRIPT_TABLE_EXPORT_MIME = "text/csv;charset=utf-8";
const STORYBOARD_SCRIPT_IMAGE_MODE_COLUMN_KEYS = new Set(['镜号', '时长', '景别', '场景', "画面描述", '角色描述', "角色动作", '情绪', '角色图', '参考', "图片提示词"]);
const STORYBOARD_SCRIPT_VIDEO_MODE_COLUMN_KEYS = new Set(['镜号', '时长', '景别', '场景', "画面描述", "角色描述", "角色动作", '情绪', "角色图", '参考', "视频提示词", '对白', '音效']);
const STORYBOARD_SCRIPT_ALWAYS_VISIBLE_COLUMN_KEYS = new Set(['镜号']);
const STORYBOARD_SCRIPT_VIEW_MODES = new Set(['list', "card"]);
const STORYBOARD_SCRIPT_MEDIA_MODES = new Set(["image", "video"]);
const STORYBOARD_SCRIPT_SCHEMA_VERSION = 'storyboard-script.v1';
export function normalizeStoryboardScriptViewMode(_0x3d1bcc) {
  const _0x439c29 = String(_0x3d1bcc || '')['trim']();
  return STORYBOARD_SCRIPT_VIEW_MODES["has"](_0x439c29) ? _0x439c29 : STORYBOARD_SCRIPT_DEFAULT_VIEW_MODE;
}
export function normalizeStoryboardScriptMediaMode(_0x59601c) {
  const _0x5280cf = String(_0x59601c || '')['trim']();
  return STORYBOARD_SCRIPT_MEDIA_MODES["has"](_0x5280cf) ? _0x5280cf : STORYBOARD_SCRIPT_DEFAULT_MEDIA_MODE;
}
function getStoryboardScriptAllowedColumnKeys(_0x578e61) {
  return normalizeStoryboardScriptMediaMode(_0x578e61) === 'video' ? STORYBOARD_SCRIPT_VIDEO_MODE_COLUMN_KEYS : STORYBOARD_SCRIPT_IMAGE_MODE_COLUMN_KEYS;
}
function hasStoryboardScriptColumnValue(_0x11b2c3, _0x4ae530) {
  const _0x5c0a41 = String(_0x4ae530 || '');
  return (Array['isArray'](_0x11b2c3) ? _0x11b2c3 : [])["some"](_0x15dfc6 => {
    if (!_0x15dfc6 || typeof _0x15dfc6 !== "object" || Array["isArray"](_0x15dfc6)) {
      return ![];
    }
    return formatTableCellValue(_0x15dfc6[_0x5c0a41])["trim"]()["length"] > 0x0;
  });
}
export function getStoryboardScriptDisplayColumns({
  mediaMode = STORYBOARD_SCRIPT_DEFAULT_MEDIA_MODE,
  rows = []
} = {}) {
  const _0x253e7f = getStoryboardScriptAllowedColumnKeys(mediaMode);
  const _0x4b65c2 = Array["isArray"](rows) ? rows : normalizeStoryboardScriptRows(rows);
  return STORYBOARD_SCRIPT_COLUMNS["filter"](_0x142026 => {
    if (!_0x253e7f["has"](_0x142026["key"])) {
      return ![];
    }
    if (STORYBOARD_SCRIPT_ALWAYS_VISIBLE_COLUMN_KEYS["has"](_0x142026["key"])) {
      return !![];
    }
    return hasStoryboardScriptColumnValue(_0x4b65c2, _0x142026["key"]);
  });
}
export function normalizeStoryboardScriptSelectedRowIndexes(_0x3df103, _0x44978d = 0x0) {
  if (!Array['isArray'](_0x3df103)) {
    return [];
  }
  const _0x3ac6f9 = Number["isFinite"](_0x44978d) ? Math["max"](0x0, Math['trunc'](_0x44978d)) : 0x0;
  const _0x25f67f = new Set();
  const _0x69a533 = [];
  _0x3df103["forEach"](_0x2f73eb => {
    const _0x561ad8 = Number(_0x2f73eb);
    if (!Number['isInteger'](_0x561ad8) || _0x561ad8 < 0x0 || _0x561ad8 >= _0x3ac6f9) {
      return;
    }
    if (_0x25f67f["has"](_0x561ad8)) {
      return;
    }
    _0x25f67f["add"](_0x561ad8);
    _0x69a533["push"](_0x561ad8);
  });
  return _0x69a533;
}
function parseJsonRows(_0x3f7868) {
  if (typeof _0x3f7868 !== "string") {
    return _0x3f7868;
  }
  const _0x3aca28 = _0x3f7868["trim"]();
  if (!_0x3aca28) {
    return [];
  }
  try {
    return JSON['parse'](_0x3aca28);
  } catch {
    return [];
  }
}
function parseJsonObject(_0x4714ba) {
  if (_0x4714ba && typeof _0x4714ba === 'object' && !Array["isArray"](_0x4714ba)) {
    return _0x4714ba;
  }
  if (typeof _0x4714ba !== "string") {
    return null;
  }
  const _0x432816 = _0x4714ba['trim']();
  if (!_0x432816) {
    return null;
  }
  try {
    const _0x51cc3c = JSON['parse'](_0x432816);
    return _0x51cc3c && typeof _0x51cc3c === "object" && !Array["isArray"](_0x51cc3c) ? _0x51cc3c : null;
  } catch {
    return null;
  }
}
function pickRowsContainer(_0x4a4cc8) {
  const _0x3d6b37 = parseJsonRows(_0x4a4cc8);
  if (Array["isArray"](_0x3d6b37)) {
    return _0x3d6b37;
  }
  if (!_0x3d6b37 || typeof _0x3d6b37 !== "object") {
    return [];
  }
  if (Array["isArray"](_0x3d6b37['rows'])) {
    return _0x3d6b37['rows'];
  }
  if (Array["isArray"](_0x3d6b37["shots"])) {
    return _0x3d6b37["shots"];
  }
  if (Array["isArray"](_0x3d6b37['scenes'])) {
    return _0x3d6b37["scenes"];
  }
  if (Array["isArray"](_0x3d6b37["items"])) {
    return _0x3d6b37["items"];
  }
  return [];
}
function normalizeFiniteNumber(_0x488f04) {
  const _0x1f8572 = Number(_0x488f04);
  return Number["isFinite"](_0x1f8572) ? _0x1f8572 : null;
}
function normalizePositiveDimension(_0x53636d, _0x4ba612) {
  const _0x44ba35 = Number(_0x53636d);
  return Number["isFinite"](_0x44ba35) && _0x44ba35 > 0x0 ? _0x44ba35 : _0x4ba612;
}
export function resolveStoryboardScriptResizeMinSize(_0x4d4b56 = {}) {
  return {
    'width': normalizePositiveDimension(_0x4d4b56?.["resizeMinWidth"], STORYBOARD_SCRIPT_DEFAULT_SIZE["width"]),
    'height': normalizePositiveDimension(_0x4d4b56?.["resizeMinHeight"], STORYBOARD_SCRIPT_DEFAULT_SIZE["height"])
  };
}
function parseClockDurationSeconds(_0x3d261c) {
  const _0x49ccc5 = String(_0x3d261c || '')["trim"]()['split'](':');
  if (_0x49ccc5["length"] < 0x2 || _0x49ccc5['length'] > 0x3) {
    return null;
  }
  const _0x2c7181 = _0x49ccc5["map"](_0x4be76a => Number(_0x4be76a));
  if (_0x2c7181["some"](_0x48e3e0 => !Number['isFinite'](_0x48e3e0) || _0x48e3e0 < 0x0)) {
    return null;
  }
  if (_0x2c7181["length"] === 0x2) {
    return _0x2c7181[0x0] * 0x3c + _0x2c7181[0x1];
  }
  return _0x2c7181[0x0] * 0xe10 + _0x2c7181[0x1] * 0x3c + _0x2c7181[0x2];
}
function parseDurationSeconds(_0x538c5f) {
  const _0x37ec53 = normalizeFiniteNumber(_0x538c5f);
  if (_0x37ec53 != null) {
    return _0x37ec53;
  }
  const _0x5972dc = String(_0x538c5f || '')["trim"]();
  if (!_0x5972dc) {
    return null;
  }
  const _0x3c05e6 = parseClockDurationSeconds(_0x5972dc);
  if (_0x3c05e6 != null) {
    return _0x3c05e6;
  }
  const _0x979c37 = [..._0x5972dc['matchAll'](/\d+(?:\.\d+)?/g)]['map'](_0x440f57 => Number(_0x440f57[0x0]));
  if (_0x979c37["length"] === 0x0) {
    return null;
  }
  const _0x5df859 = /[-~～—–至到]/["test"](_0x5972dc) && _0x979c37["length"] >= 0x2;
  if (_0x5df859) {
    return (_0x979c37[0x0] + _0x979c37[0x1]) / 0x2;
  }
  return _0x979c37[0x0];
}
function getRowsTotalDurationSeconds(_0xe2dc18) {
  const _0x427ea7 = _0xe2dc18["reduce"]((_0x33ec69, _0x584c02) => {
    const _0xdc9af2 = parseDurationSeconds(_0x584c02?.['时长'] ?? _0x584c02?.["duration"] ?? _0x584c02?.['durationText']);
    return _0xdc9af2 == null ? _0x33ec69 : _0x33ec69 + _0xdc9af2;
  }, 0x0);
  return _0x427ea7 > 0x0 ? Number(_0x427ea7['toFixed'](0x3)) : null;
}
export function normalizeStoryboardScriptRows(_0x598bb1) {
  return pickRowsContainer(_0x598bb1)["filter"](_0x257a6d => _0x257a6d && typeof _0x257a6d === "object" && !Array['isArray'](_0x257a6d))['map'](_0x722489 => {
    const _0x54cbd6 = _0x722489['场景'] ?? _0x722489['场景标签'] ?? _0x722489["sceneTags"] ?? _0x722489["scene"] ?? _0x722489['location'];
    return _0x54cbd6 == null ? {
      ..._0x722489
    } : {
      ..._0x722489,
      '场景': _0x54cbd6
    };
  });
}
function formatTableCellValue(_0x2c9c68) {
  if (_0x2c9c68 == null) {
    return '';
  }
  if (typeof _0x2c9c68 === 'string') {
    return _0x2c9c68;
  }
  if (typeof _0x2c9c68 === "number" || typeof _0x2c9c68 === "boolean") {
    return String(_0x2c9c68);
  }
  try {
    return JSON["stringify"](_0x2c9c68);
  } catch {
    return String(_0x2c9c68);
  }
}
function escapeCsvCell(_0x5d735d) {
  const _0x5f3769 = formatTableCellValue(_0x5d735d)["replace"](/\r\n?/g, '\x0a');
  if (!/[",\n]/["test"](_0x5f3769)) {
    return _0x5f3769;
  }
  return '\x22' + _0x5f3769['replace'](/"/g, '\x22\x22') + '\x22';
}
export function serializeStoryboardScriptRowsToCsv(_0x4bfae8, _0x3d008 = STORYBOARD_SCRIPT_COLUMNS) {
  const _0xfee707 = normalizeStoryboardScriptRows(_0x4bfae8);
  const _0x5ca83d = Array['isArray'](_0x3d008) && _0x3d008['length'] ? _0x3d008 : STORYBOARD_SCRIPT_COLUMNS;
  const _0x3a8fea = _0x5ca83d["map"](_0x23eab0 => String(_0x23eab0?.['key'] || ''));
  const _0x4755a8 = _0x5ca83d["map"](_0x504efe => _0x504efe?.["label"] || _0x504efe?.["key"] || '');
  const _0xa4dd58 = [_0x4755a8["map"](escapeCsvCell)["join"](','), ..._0xfee707["map"](_0x2cb378 => _0x3a8fea["map"](_0x5c5640 => escapeCsvCell(_0x2cb378?.[_0x5c5640]))["join"](','))];
  return '\ufeff' + _0xa4dd58["join"]('\x0d\x0a') + '\x0d\x0a';
}
export function buildCanonicalStoryboardScriptJson(_0xad9ab0 = {}) {
  const _0x1456a2 = _0xad9ab0 && typeof _0xad9ab0 === "object" && !Array['isArray'](_0xad9ab0) ? _0xad9ab0 : {
    'rows': _0xad9ab0
  };
  const _0x44a7e = parseJsonObject(_0x1456a2['rawJson']);
  const _0x377940 = Array["isArray"](_0x1456a2['rows']) ? _0x1456a2["rows"] : _0x44a7e ? _0x44a7e : _0x1456a2;
  const _0x1484ee = normalizeStoryboardScriptRows(_0x377940);
  const _0xa35feb = _0x1456a2["detectedIntent"] && typeof _0x1456a2['detectedIntent'] === "object" ? _0x1456a2["detectedIntent"] : _0x44a7e?.["detectedIntent"] && typeof _0x44a7e['detectedIntent'] === "object" ? _0x44a7e["detectedIntent"] : {};
  const _0x1eb377 = {
    ..._0xa35feb,
    'shotCount': _0x1484ee["length"]
  };
  const _0x552492 = getRowsTotalDurationSeconds(_0x1484ee);
  if (_0x552492 != null) {
    _0x1eb377["totalDurationSeconds"] = _0x552492;
  } else {
    const _0x309936 = normalizeFiniteNumber(_0xa35feb['totalDurationSeconds']);
    if (_0x309936 != null) {
      _0x1eb377['totalDurationSeconds'] = _0x309936;
    }
  }
  const _0x1c6bd4 = String(_0x1456a2['title'] || _0x44a7e?.["title"] || '')['trim']() || getStoryboardScriptDefaultName();
  const _0x35ab40 = {
    'schemaVersion': STORYBOARD_SCRIPT_SCHEMA_VERSION,
    'title': _0x1c6bd4,
    'detectedIntent': _0x1eb377,
    'rows': _0x1484ee
  };
  const _0x22a346 = Array['isArray'](_0x1456a2["warnings"]) ? _0x1456a2['warnings'] : Array["isArray"](_0x44a7e?.["warnings"]) ? _0x44a7e["warnings"] : [];
  if (_0x22a346["length"] > 0x0) {
    _0x35ab40["warnings"] = [..._0x22a346];
  }
  return _0x35ab40;
}
export function serializeCanonicalStoryboardScriptJson(_0x2599b2 = {}) {
  return JSON['stringify'](buildCanonicalStoryboardScriptJson(_0x2599b2), null, 0x2);
}
export function createDefaultStoryboardScriptState(_0x5e05d0 = {}) {
  if (typeof _0x5e05d0 === 'string') {
    const _0x2693cf = normalizeStoryboardScriptRows(_0x5e05d0);
    const _0x5a986c = serializeCanonicalStoryboardScriptJson({
      'rawJson': _0x5e05d0,
      'rows': _0x2693cf
    });
    return {
      'version': 0x1,
      'viewMode': STORYBOARD_SCRIPT_DEFAULT_VIEW_MODE,
      'mediaMode': STORYBOARD_SCRIPT_DEFAULT_MEDIA_MODE,
      'rawJson': _0x5e05d0,
      'canonicalJson': _0x5a986c,
      'rows': _0x2693cf,
      'selectedRowIndexes': [],
      'selectionMode': ![]
    };
  }
  const _0x515f14 = _0x5e05d0 && typeof _0x5e05d0 === "object" ? _0x5e05d0 : {};
  const _0x1de360 = typeof _0x515f14["rawJson"] === "string" ? _0x515f14["rawJson"] : '';
  const _0x45dead = Array['isArray'](_0x515f14["rows"]) ? _0x515f14["rows"] : _0x1de360 ? _0x1de360 : [];
  const _0x53aceb = normalizeStoryboardScriptRows(_0x45dead);
  const _0x273a85 = buildCanonicalStoryboardScriptJson({
    ..._0x515f14,
    'rawJson': _0x1de360,
    'rows': _0x53aceb
  });
  return {
    ..._0x515f14,
    'version': 0x1,
    'viewMode': normalizeStoryboardScriptViewMode(_0x515f14['viewMode']),
    'mediaMode': normalizeStoryboardScriptMediaMode(_0x515f14["mediaMode"]),
    'rawJson': _0x1de360,
    'canonicalJson': JSON["stringify"](_0x273a85, null, 0x2),
    'rows': _0x53aceb,
    'title': _0x273a85['title'],
    'detectedIntent': _0x273a85["detectedIntent"],
    'selectedRowIndexes': normalizeStoryboardScriptSelectedRowIndexes(_0x515f14["selectedRowIndexes"], _0x53aceb["length"]),
    'selectionMode': _0x515f14['selectionMode'] === !![]
  };
}
export function createStoryboardScriptNodeData({
  id: _0x5812fd,
  x = 0x0,
  y = 0x0,
  width = STORYBOARD_SCRIPT_DEFAULT_SIZE["width"],
  height = STORYBOARD_SCRIPT_DEFAULT_SIZE["height"],
  name = getStoryboardScriptDefaultName(),
  storyboardScript = {}
} = {}) {
  const _0x222fe7 = normalizePositiveDimension(width, STORYBOARD_SCRIPT_DEFAULT_SIZE["width"]);
  const _0x3124fc = normalizePositiveDimension(height, STORYBOARD_SCRIPT_DEFAULT_SIZE["height"]);
  return {
    'id': _0x5812fd,
    'type': STORYBOARD_SCRIPT_NODE_TYPE,
    'x': x,
    'y': y,
    'width': _0x222fe7,
    'height': _0x3124fc,
    'resizeMinWidth': _0x222fe7,
    'resizeMinHeight': _0x3124fc,
    'name': name,
    'storyboardScript': createDefaultStoryboardScriptState(storyboardScript)
  };
}