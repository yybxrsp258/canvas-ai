import { createToolbarDivider, createToolbarHtml, createToolbarIconButton } from '../nodeToolbar/buttonFactory.js';
import { t } from '../../i18n/index.js';
function panoramaSceneText(_0x48be03, _0x59bc4f = {}) {
  return t('panoramaSceneNode.' + _0x48be03, _0x59bc4f);
}
const ICONS = {
  'close': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/></svg>",
  'navigate': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><path\x20d=\x22m5\x203\x2010\x208-6\x201\x202\x207-3\x201-2-7-4\x203z\x22/></svg>',
  'fly': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><path\x20d=\x22M12\x203v18M3\x2012h18\x22/><path\x20d=\x22m12\x203-3\x204h6zM21\x2012l-4-3v6zM12\x2021l3-4H9zM3\x2012l4\x203V9z\x22/></svg>',
  'frame': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><path\x20d=\x22M8\x203H5a2\x202\x200\x200\x200-2\x202v3m18\x200V5a2\x202\x200\x200\x200-2-2h-3m0\x2018h3a2\x202\x200\x200\x200\x202-2v-3M3\x2016v3a2\x202\x200\x200\x200\x202\x202h3\x22/><circle\x20cx=\x2212\x22\x20cy=\x2212\x22\x20r=\x223\x22/></svg>',
  'move': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M12 3v18M3 12h18\"/><path d=\"m7 8 5-5 5 5\"/><path d=\"m7 16 5 5 5-5\"/><path d=\"m8 7-5 5 5 5\"/><path d=\"m16 7 5 5-5 5\"/></svg>",
  'rotate': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M20 11a8 8 0 1 1-2.34-5.66\"/><path d=\"M20 4v7h-7\"/></svg>",
  'scale': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M4 20h16\"/><path d=\"M4 20V4\"/><path d=\"m9 9 6 6\"/><path d=\"M15 9H9v6\"/></svg>",
  'transformSpace': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M5 19V8m0 11h11\"/><path d=\"m5 8-2 3m2-3 2 3\"/><path d=\"m16 19-3-2m3 2-3 2\"/><circle cx=\"5\" cy=\"19\" r=\"1\"/></svg>",
  'snap': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M6 3v8a6 6 0 0 0 12 0V3\"/><path d=\"M6 7h4M14 7h4\"/></svg>",
  'ground': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><path\x20d=\x22M3\x2018h18M6\x2014h12\x22/><path\x20d=\x22M12\x203v11m-4-4\x204\x204\x204-4\x22/></svg>',
  'uniform': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><rect\x20x=\x225\x22\x20y=\x225\x22\x20width=\x2214\x22\x20height=\x2214\x22/><path\x20d=\x22M9\x205V3m6\x202V3M9\x2021v-2m6\x202v-2M5\x209H3m2\x206H3m18-6h-2m2\x206h-2\x22/></svg>',
  'upload': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M12 16V4\"/><path d=\"m7 9 5-5 5 5\"/><path d=\"M4 20h16\"/></svg>",
  'fullscreen': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3\"/></svg>",
  'collapseToggle': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"m6 15 6-6 6 6\"/></svg>"
};
export const PANORAMA_SCENE_MODE_TOOLBAR_HTML = createToolbarHtml({
  'toolbarClass': 'v2-panorama-mode-toolbar',
  'items': [createToolbarIconButton({
    'action': 'exit-edit',
    'tooltip': panoramaSceneText("toolbar.closeEdit"),
    'label': panoramaSceneText('toolbar.closeEdit'),
    'iconSvg': ICONS["close"],
    'extraClass': "panorama-scene-close-btn"
  }), createToolbarDivider(), createToolbarIconButton({
    'action': "navigate",
    'tooltip': panoramaSceneText("toolbar.mouse"),
    'label': panoramaSceneText("toolbar.mouse"),
    'iconSvg': ICONS["navigate"],
    'extraClass': 'panorama-scene-tool-btn'
  }), createToolbarIconButton({
    'action': "fly-mode",
    'tooltip': panoramaSceneText("toolbar.flyMode"),
    'label': panoramaSceneText('toolbar.flyMode'),
    'iconSvg': ICONS["fly"],
    'extraClass': "panorama-scene-tool-btn panorama-scene-navigation-option"
  }), createToolbarIconButton({
    'action': "frame-selection",
    'tooltip': panoramaSceneText("toolbar.frameSelection"),
    'label': panoramaSceneText('toolbar.frameSelection'),
    'iconSvg': ICONS['frame'],
    'extraClass': "panorama-scene-tool-btn panorama-scene-navigation-option"
  }), createToolbarIconButton({
    'action': "move",
    'tooltip': panoramaSceneText("toolbar.move"),
    'label': panoramaSceneText("toolbar.move"),
    'iconSvg': ICONS["move"],
    'extraClass': "panorama-scene-tool-btn"
  }), createToolbarIconButton({
    'action': "scale",
    'tooltip': panoramaSceneText("toolbar.scale"),
    'label': panoramaSceneText('toolbar.scale'),
    'iconSvg': ICONS["scale"],
    'extraClass': 'panorama-scene-tool-btn'
  }), createToolbarIconButton({
    'action': 'rotate',
    'tooltip': panoramaSceneText("toolbar.rotate"),
    'label': panoramaSceneText("toolbar.rotate"),
    'iconSvg': ICONS['rotate'],
    'extraClass': "panorama-scene-tool-btn"
  }), createToolbarDivider(), createToolbarIconButton({
    'action': "transform-space",
    'tooltip': panoramaSceneText("toolbar.transformWorld"),
    'label': panoramaSceneText("toolbar.transformWorld"),
    'iconSvg': ICONS['transformSpace'],
    'extraClass': "panorama-scene-tool-btn panorama-scene-transform-option"
  }), createToolbarIconButton({
    'action': 'snap-toggle',
    'tooltip': panoramaSceneText("toolbar.snap"),
    'label': panoramaSceneText("toolbar.snap"),
    'iconSvg': ICONS['snap'],
    'extraClass': "panorama-scene-tool-btn panorama-scene-transform-option"
  }), createToolbarIconButton({
    'action': "ground-lock",
    'tooltip': panoramaSceneText("toolbar.groundLock"),
    'label': panoramaSceneText("toolbar.groundLock"),
    'iconSvg': ICONS["ground"],
    'extraClass': "panorama-scene-tool-btn panorama-scene-transform-option"
  }), createToolbarIconButton({
    'action': "uniform-scale",
    'tooltip': panoramaSceneText("toolbar.uniformScale"),
    'label': panoramaSceneText('toolbar.uniformScale'),
    'iconSvg': ICONS["uniform"],
    'extraClass': "panorama-scene-tool-btn panorama-scene-transform-option"
  }), createToolbarDivider(), createToolbarIconButton({
    'action': "fullscreen",
    'tooltip': panoramaSceneText('toolbar.fullscreen'),
    'label': panoramaSceneText("toolbar.fullscreen"),
    'iconSvg': ICONS["fullscreen"],
    'extraClass': 'panorama-scene-tool-btn'
  }), createToolbarIconButton({
    'action': 'collapse-node',
    'tooltip': panoramaSceneText("toolbar.collapse"),
    'label': panoramaSceneText("toolbar.collapse"),
    'iconSvg': ICONS['collapseToggle'],
    'extraClass': "panorama-scene-tool-btn panorama-scene-toolbar-btn--collapse"
  })]
});
export const PANORAMA_360_MODE_TOOLBAR_HTML = createToolbarHtml({
  'toolbarClass': 'v2-panorama-mode-toolbar',
  'items': [createToolbarIconButton({
    'action': 'exit-edit',
    'tooltip': panoramaSceneText('toolbar.closeEdit'),
    'label': panoramaSceneText('toolbar.closeEdit'),
    'iconSvg': ICONS["close"],
    'extraClass': "panorama-scene-close-btn"
  }), createToolbarDivider(), createToolbarIconButton({
    'action': 'upload-panorama',
    'tooltip': panoramaSceneText("toolbar.uploadPanorama"),
    'label': panoramaSceneText("toolbar.uploadPanorama"),
    'iconSvg': ICONS["upload"],
    'extraClass': 'panorama-scene-tool-btn'
  }), createToolbarIconButton({
    'action': "fullscreen",
    'tooltip': panoramaSceneText("toolbar.fullscreen"),
    'label': panoramaSceneText('toolbar.fullscreen'),
    'iconSvg': ICONS["fullscreen"],
    'extraClass': 'panorama-scene-tool-btn'
  }), createToolbarIconButton({
    'action': 'collapse-node',
    'tooltip': panoramaSceneText("toolbar.collapse"),
    'label': panoramaSceneText("toolbar.collapse"),
    'iconSvg': ICONS['collapseToggle'],
    'extraClass': "panorama-scene-tool-btn panorama-scene-toolbar-btn--collapse"
  })]
});
export const PANORAMA_MODE_TOOLBAR_HTML = PANORAMA_SCENE_MODE_TOOLBAR_HTML;