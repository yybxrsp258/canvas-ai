import { registerStaticInnerHTML } from '../../utils/dom.js';
import { createToolbarHtml, createToolbarIconButton } from './buttonFactory.js';
import { t } from '../../i18n/index.js';
function toolbarText(_0xdb54b3) {
  return t("nodeToolbar." + _0xdb54b3);
}
const CLIP_ICON = '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><circle\x20cx=\x226\x22\x20cy=\x226\x22\x20r=\x223\x22/><circle\x20cx=\x226\x22\x20cy=\x2218\x22\x20r=\x223\x22/><line\x20x1=\x2220\x22\x20y1=\x224\x22\x20x2=\x228.12\x22\x20y2=\x2215.88\x22/><line\x20x1=\x2214.47\x22\x20y1=\x2214.48\x22\x20x2=\x2220\x22\x20y2=\x2220\x22/><line\x20x1=\x228.12\x22\x20y1=\x228.12\x22\x20x2=\x2212\x22\x20y2=\x2212\x22/></svg>';
const SEPARATE_ICON = '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><path\x20d=\x22M4\x2015v-6\x22/><path\x20d=\x22M8\x2018V6\x22/><path\x20d=\x22M12\x204v16\x22/><path\x20d=\x22M16\x206v12\x22/><path\x20d=\x22M20\x209v6\x22/><path\x20d=\x22M12\x203v18\x22/></svg>';
const VOICE_STUDIO_ICON = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 10v4\"/><path d=\"M8 7v10\"/><path d=\"M12 4v16\"/><path d=\"M16 8v8\"/><path d=\"M20 11v2\"/></svg>";
const SPEED_ICON = '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><circle\x20cx=\x2212\x22\x20cy=\x2212\x22\x20r=\x2210\x22/><polyline\x20points=\x2212\x206\x2012\x2012\x2016\x2014\x22/></svg>';
const UPLOAD_ICON = '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22><path\x20d=\x22M21\x2015v4a2\x202\x200\x200\x201-2\x202H5a2\x202\x200\x200\x201-2-2v-4\x22/><polyline\x20points=\x2217\x208\x2012\x203\x207\x208\x22/><line\x20x1=\x2212\x22\x20y1=\x223\x22\x20x2=\x2212\x22\x20y2=\x2215\x22/></svg>';
const DOWNLOAD_ICON = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"7 10 12 15 17 10\"/><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"/></svg>";
function createAudioToolbarItems() {
  const _0x1a6123 = [createToolbarIconButton({
    'action': "clip",
    'tooltip': toolbarText("audio.clip"),
    'label': toolbarText("audio.clip"),
    'iconSvg': CLIP_ICON
  }), createToolbarIconButton({
    'action': 'separate',
    'tooltip': toolbarText("audio.separate"),
    'label': toolbarText("audio.separate"),
    'iconSvg': SEPARATE_ICON
  }), createToolbarIconButton({
    'action': 'voice-studio',
    'tooltip': toolbarText("audio.voiceStudio"),
    'label': toolbarText('audio.voiceStudio'),
    'iconSvg': VOICE_STUDIO_ICON
  }), createToolbarIconButton({
    'action': 'speed',
    'tooltip': toolbarText("audio.speed"),
    'label': toolbarText("audio.speed"),
    'iconSvg': SPEED_ICON
  })];
  _0x1a6123["push"](createToolbarIconButton({
    'action': 'upload',
    'tooltip': toolbarText("common.upload"),
    'label': toolbarText("common.upload"),
    'iconSvg': UPLOAD_ICON
  }), createToolbarIconButton({
    'action': "download",
    'tooltip': toolbarText('common.download'),
    'label': toolbarText("common.download"),
    'iconSvg': DOWNLOAD_ICON
  }));
  return _0x1a6123;
}
export const SOURCE_AUDIO_TOOLBAR_HTML = createToolbarHtml({
  'toolbarClass': "audio-toolbar",
  'items': createAudioToolbarItems()
});
export const AUDIO_TOOLBAR_HTML = createToolbarHtml({
  'toolbarClass': "audio-toolbar",
  'items': createAudioToolbarItems()
});
registerStaticInnerHTML("toolbar:audio", AUDIO_TOOLBAR_HTML);
registerStaticInnerHTML("toolbar:source-audio", SOURCE_AUDIO_TOOLBAR_HTML);