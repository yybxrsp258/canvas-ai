import { createToolbarHtml, createToolbarIconButton } from '../nodeToolbar/buttonFactory.js';
import { t } from '../../i18n/index.js';
function panoramaSceneText(_0x304737, _0x58d8ca = {}) {
  return t("panoramaSceneNode." + _0x304737, _0x58d8ca);
}
const ICONS = {
  'cube': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"m12 2 8 4.5v11L12 22 4 17.5v-11L12 2Z\"/><path d=\"M12 22V11.5\"/><path d=\"M20 6.5 12 11.5 4 6.5\"/></svg>",
  'mannequin': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><circle cx=\"12\" cy=\"5\" r=\"2.5\"/><path d=\"M12 8v7\"/><path d=\"M8.5 12.5 12 9l3.5 3.5\"/><path d=\"M9 21l3-6 3 6\"/></svg>",
  'assets': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"m12 2 8 4.5v11L12 22 4 17.5v-11L12 2Z\"/><path d=\"m4 6.5 8 5 8-5\"/><path d=\"M12 11.5V22\"/><path d=\"m8 4.2 8 5\"/></svg>",
  'pose': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><circle\x20cx=\x2212\x22\x20cy=\x224\x22\x20r=\x222\x22/><path\x20d=\x22M12\x206v6m0\x200-4\x208m4-8\x204\x208M7\x209l5\x203\x205-3\x22/></svg>',
  'grid': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M3 3h18v18H3z\"/><path d=\"M3 9h18M9 3v18M15 3v18M3 15h18\"/></svg>",
  'capture': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><path\x20d=\x22M4\x208h3l2-2h6l2\x202h3v10H4z\x22/><circle\x20cx=\x2212\x22\x20cy=\x2213\x22\x20r=\x223.5\x22/></svg>',
  'camera': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M4 7h12a2 2 0 0 1 2 2v8H4z\"/><path d=\"m16 11 4-2v8l-4-2\"/><circle cx=\"10\" cy=\"13\" r=\"2.5\"/></svg>",
  'timeline': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><path\x20d=\x22M4\x206v12M20\x206v12M4\x2012h16\x22/><circle\x20cx=\x229\x22\x20cy=\x2212\x22\x20r=\x222\x22/><circle\x20cx=\x2216\x22\x20cy=\x2212\x22\x20r=\x222\x22/></svg>',
  'focus': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M12 4v3\"/><path d=\"M12 17v3\"/><path d=\"M4 12h3\"/><path d=\"M17 12h3\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/></svg>",
  'reset': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><path\x20d=\x22M3\x2012a9\x209\x200\x201\x200\x203-6.7\x22/><path\x20d=\x22M3\x204v5h5\x22/></svg>'
};
export const PANORAMA_SCENE_BOTTOM_TOOLBAR_HTML = createToolbarHtml({
  'toolbarClass': "panorama-scene-fixed-toolbar",
  'items': [createToolbarIconButton({
    'action': 'cube',
    'tooltip': panoramaSceneText('toolbar.createCube'),
    'label': panoramaSceneText("toolbar.createCube"),
    'iconSvg': ICONS["cube"],
    'extraClass': 'panorama-scene-fixed-toolbar__btn\x20panorama-scene-fixed-toolbar__btn--cube'
  }), createToolbarIconButton({
    'action': "asset-library",
    'tooltip': panoramaSceneText("toolbar.assetLibrary"),
    'label': panoramaSceneText("toolbar.assetLibrary"),
    'iconSvg': ICONS['assets'],
    'extraClass': "panorama-scene-fixed-toolbar__btn panorama-scene-fixed-toolbar__btn--assets"
  }), createToolbarIconButton({
    'action': "mannequin-entry",
    'tooltip': panoramaSceneText("toolbar.mannequin"),
    'label': panoramaSceneText("toolbar.mannequin"),
    'iconSvg': ICONS["mannequin"],
    'extraClass': "panorama-scene-fixed-toolbar__btn panorama-scene-fixed-toolbar__btn--mannequin"
  }), createToolbarIconButton({
    'action': "pose-editor",
    'tooltip': panoramaSceneText("toolbar.poseEditor"),
    'label': panoramaSceneText("toolbar.poseEditor"),
    'iconSvg': ICONS["pose"],
    'extraClass': "panorama-scene-fixed-toolbar__btn panorama-scene-fixed-toolbar__btn--pose"
  }), createToolbarIconButton({
    'action': "grid",
    'tooltip': panoramaSceneText("toolbar.grid"),
    'label': panoramaSceneText("toolbar.grid"),
    'iconSvg': ICONS["grid"],
    'extraClass': "panorama-scene-fixed-toolbar__btn panorama-scene-fixed-toolbar__btn--grid"
  }), createToolbarIconButton({
    'action': "capture",
    'tooltip': panoramaSceneText("toolbar.capture"),
    'label': panoramaSceneText("toolbar.capture"),
    'iconSvg': ICONS["capture"],
    'extraClass': "panorama-scene-fixed-toolbar__btn panorama-scene-fixed-toolbar__btn--capture"
  }), createToolbarIconButton({
    'action': 'camera',
    'tooltip': panoramaSceneText("toolbar.createCameraBookmark"),
    'label': panoramaSceneText("toolbar.createCameraBookmark"),
    'iconSvg': ICONS["camera"],
    'extraClass': "panorama-scene-fixed-toolbar__btn panorama-scene-fixed-toolbar__btn--camera"
  }), createToolbarIconButton({
    'action': "timeline",
    'tooltip': panoramaSceneText('toolbar.cameraTimeline'),
    'label': panoramaSceneText('toolbar.cameraTimeline'),
    'iconSvg': ICONS["timeline"],
    'extraClass': "panorama-scene-fixed-toolbar__btn panorama-scene-fixed-toolbar__btn--timeline"
  }), createToolbarIconButton({
    'action': "focus",
    'tooltip': panoramaSceneText("toolbar.focus"),
    'label': panoramaSceneText("toolbar.focus"),
    'iconSvg': ICONS['focus'],
    'extraClass': 'panorama-scene-fixed-toolbar__btn\x20panorama-scene-fixed-toolbar__btn--focus'
  }), createToolbarIconButton({
    'action': "reset-view",
    'tooltip': panoramaSceneText("toolbar.resetView"),
    'label': panoramaSceneText("toolbar.resetView"),
    'iconSvg': ICONS["reset"],
    'extraClass': "panorama-scene-fixed-toolbar__btn panorama-scene-fixed-toolbar__btn--reset"
  })]
});