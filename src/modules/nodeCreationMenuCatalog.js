import { t } from '../i18n/index.js';
const NODE_CREATION_ITEMS = Object["freeze"]({
  'ai-text': Object['freeze']({
    'type': "ai-text",
    'label': '文本',
    'defaultName': '文本',
    'subtitle': "文案、脚本、提示词"
  }),
  'ai-image': Object["freeze"]({
    'type': 'ai-image',
    'label': '图像',
    'defaultName': '图像',
    'subtitle': "图片、海报、角色素材"
  }),
  'ai-video': Object["freeze"]({
    'type': "ai-video",
    'label': '视频',
    'defaultName': '视频',
    'subtitle': "短片、转场、动态镜头"
  }),
  'ai-audio': Object['freeze']({
    'type': "ai-audio",
    'label': '音频',
    'defaultName': '音频',
    'subtitle': "配音、音效、音乐"
  }),
  'source-text': Object["freeze"]({
    'type': "source-text",
    'label': "源文本",
    'defaultName': '源文本',
    'subtitle': "文案、脚本、提示词输入"
  }),
  'source-image': Object["freeze"]({
    'type': "source-image",
    'label': "源图像",
    'defaultName': '源图像',
    'subtitle': "参考图、首帧、素材"
  }),
  'source-video': Object["freeze"]({
    'type': "source-video",
    'label': '源视频',
    'defaultName': "源视频",
    'subtitle': "参考、剪辑、视频输入"
  }),
  'source-audio': Object["freeze"]({
    'type': "source-audio",
    'label': "源音频",
    'defaultName': "源音频",
    'subtitle': "配音、音乐、声音参考"
  }),
  'comment-note': Object["freeze"]({
    'type': "comment-note",
    'label': '注释',
    'defaultName': '',
    'subtitle': "说明、备注、待办"
  }),
  'web-preview': Object["freeze"]({
    'type': "web-preview",
    'label': '浏览器',
    'defaultName': '浏览器',
    'badge': "BETA",
    'subtitle': "输入网址并在画布内浏览",
    'creationDisabled': !![]
  }),
  'panorama-scene': Object["freeze"]({
    'type': "panorama-scene",
    'label': "3D导演台",
    'defaultName': "3D导演台",
    'subtitle': '3D\x20场景、人物、机位'
  }),
  'panorama-360': Object["freeze"]({
    'type': "panorama-360",
    'label': "360全景图",
    'defaultName': "360全景图",
    'subtitle': '全景画面与空间关系'
  }),
  'storyboard': Object["freeze"]({
    'type': 'storyboard',
    'label': "宫格图",
    'defaultName': '宫格图',
    'subtitle': '空白\x203×3\x20宫格图'
  }),
  'storyboard-script': Object["freeze"]({
    'type': "storyboard-script",
    'label': "分镜脚本",
    'defaultName': "分镜脚本",
    'badge': "BETA",
    'subtitle': "镜头表、提示词、节奏"
  }),
  'collage': Object["freeze"]({
    'type': "collage",
    'label': '拼图',
    'defaultName': '拼图',
    'subtitle': '图片排版与导出'
  }),
  'whiteboard': Object["freeze"]({
    'type': "whiteboard",
    'label': '白板',
    'defaultName': '白板',
    'badge': 'BETA',
    'subtitle': "画图、标注、文字说明"
  }),
  'media-clip': Object['freeze']({
    'type': "media-clip",
    'label': '剪辑',
    'defaultName': '剪辑',
    'badge': "BETA",
    'subtitle': "音视频剪切整理"
  }),
  'debug': Object["freeze"]({
    'type': "debug",
    'label': "调试窗口",
    'defaultName': "调试窗口",
    'devOnly': !![],
    'subtitle': "查看 Payload 与任务状态"
  })
});
const NODE_CREATION_ITEM_I18N_KEYS = Object["freeze"]({
  'ai-text': 'aiText',
  'ai-image': "aiImage",
  'ai-video': 'aiVideo',
  'ai-audio': "aiAudio",
  'source-text': "sourceText",
  'source-image': "sourceImage",
  'source-video': "sourceVideo",
  'source-audio': "sourceAudio",
  'comment-note': "commentNote",
  'web-preview': "webPreview",
  'panorama-scene': "panoramaScene",
  'panorama-360': "panorama360",
  'storyboard': 'storyboard',
  'storyboard-script': 'storyboardScript',
  'collage': "collage",
  'whiteboard': 'whiteboard',
  'media-clip': "mediaClip",
  'debug': "debug"
});
const NODE_CREATION_SECTIONS = Object["freeze"]({
  'generation': Object["freeze"]({
    'id': 'generation',
    'label': "生成节点",
    'itemTypes': Object["freeze"](["ai-text", 'ai-image', 'ai-video', "ai-audio"])
  }),
  'source': Object["freeze"]({
    'id': "source",
    'label': "源节点",
    'itemTypes': Object["freeze"](["source-text", 'source-image', "source-video", 'source-audio'])
  }),
  'function': Object["freeze"]({
    'id': "function",
    'label': "功能节点",
    'itemTypes': Object['freeze'](["panorama-scene", "panorama-360", "storyboard", "storyboard-script", "collage", "whiteboard", "web-preview", "media-clip", "debug", "comment-note"])
  })
});
const NODE_CREATION_SECTION_I18N_KEYS = Object["freeze"]({
  'generation': "nodeCreation.sections.generation",
  'source': 'nodeCreation.sections.source',
  'function': "nodeCreation.sections.function"
});
export const PICKER_NODE_CREATION_SECTION_IDS = Object["freeze"](["generation", "function"]);
export const CONTEXT_NODE_CREATION_SECTION_IDS = Object["freeze"](["generation", 'source', "function"]);
export const NODE_CREATION_UPLOAD_ITEM = Object["freeze"]({
  get 'label'() {
    return t('nodeCreation.upload.label');
  },
  get 'subtitle'() {
    return t("nodeCreation.upload.subtitle");
  }
});
export function getNodeCreationMenuItem(_0x570f22) {
  const _0x2740fd = NODE_CREATION_ITEMS[String(_0x570f22 || '')] || null;
  if (!_0x2740fd) {
    return null;
  }
  const _0x14be0b = NODE_CREATION_ITEM_I18N_KEYS[_0x2740fd["type"]];
  if (!_0x14be0b) {
    return _0x2740fd;
  }
  return {
    ..._0x2740fd,
    'label': t('nodeCreation.items.' + _0x14be0b + ".label"),
    'defaultName': t("nodeCreation.items." + _0x14be0b + '.defaultName'),
    'subtitle': t('nodeCreation.items.' + _0x14be0b + ".subtitle")
  };
}
export function isNodeCreationTypeEnabled(_0x245f43) {
  const _0x13386a = NODE_CREATION_ITEMS[String(_0x245f43 || '')];
  return _0x13386a?.["creationDisabled"] !== !![];
}
export function getNodeCreationMenuSections(_0x151c8d, {
  includeDevOnly = ![]
} = {}) {
  return (Array["isArray"](_0x151c8d) ? _0x151c8d : [])["map"](_0x16044a => {
    const _0x5dfbbb = NODE_CREATION_SECTIONS[_0x16044a];
    if (!_0x5dfbbb) {
      return null;
    }
    const _0x71bccc = _0x5dfbbb["itemTypes"]['map'](_0x15fdc8 => getNodeCreationMenuItem(_0x15fdc8))['filter'](_0x15a098 => _0x15a098 && _0x15a098['creationDisabled'] !== !![] && (includeDevOnly || _0x15a098["devOnly"] !== !![]));
    if (_0x71bccc['length'] === 0x0) {
      return null;
    }
    const _0xc5e1ee = NODE_CREATION_SECTION_I18N_KEYS[_0x5dfbbb['id']];
    return {
      'id': _0x5dfbbb['id'],
      'label': _0xc5e1ee ? t(_0xc5e1ee) : _0x5dfbbb['label'],
      'items': _0x71bccc
    };
  })["filter"](Boolean);
}