import { createToolbarIconButton } from './buttonFactory.js';
import { NODE_ANNOTATE_ICON_SVG, NODE_TOOLBAR_MORE_ICON_SVG } from '../sharedIconMarkup.js';
import { t } from '../../i18n/index.js';
function toolbarText(_0x2a2d51) {
  return t("nodeToolbar." + _0x2a2d51);
}
const FACE_DETECTION_ICON_SVG = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 8V6a2 2 0 0 1 2-2h2\"/><path d=\"M16 4h2a2 2 0 0 1 2 2v2\"/><path d=\"M20 16v2a2 2 0 0 1-2 2h-2\"/><path d=\"M8 20H6a2 2 0 0 1-2-2v-2\"/><circle cx=\"12\" cy=\"12\" r=\"5.5\"/><path d=\"M9.5 10.5h.01\"/><path d=\"M14.5 10.5h.01\"/><path d=\"M9.5 14.5c1.5 1.2 3.5 1.2 5 0\"/></svg>";
const UPLOAD_ICON_SVG = '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22><path\x20d=\x22M21\x2015v4a2\x202\x200\x200\x201-2\x202H5a2\x202\x200\x200\x201-2-2v-4\x22/><polyline\x20points=\x2217\x208\x2012\x203\x207\x208\x22/><line\x20x1=\x2212\x22\x20y1=\x223\x22\x20x2=\x2212\x22\x20y2=\x2215\x22/></svg>';
const IMAGE_TOOLBAR_BUTTON_POOL = [createToolbarIconButton({
  'action': "depth-image",
  'tooltip': toolbarText("image.depthImage"),
  'label': toolbarText("image.depthImage"),
  'iconSvg': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"m12 3 9 5-9 5-9-5 9-5Z\"/><path d=\"m3 12 9 5 9-5M3 16l9 5 9-5\"/></svg>"
}), createToolbarIconButton({
  'action': "matting",
  'tooltip': toolbarText("image.matting"),
  'label': toolbarText("image.matting"),
  'iconSvg': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"3\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/><path d=\"M12 7A5 5 0 0 1 12 17L12 7Z\" fill=\"currentColor\" fill-opacity=\"0.28\" stroke=\"none\"/><path d=\"M7 17l2-2\"/><path d=\"M8.5 18.5l-1-1\"/></svg>"
}), createToolbarIconButton({
  'action': "local-edit",
  'tooltip': toolbarText('image.localEdit'),
  'label': toolbarText("image.localEdit"),
  'iconSvg': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><rect x=\"3.5\" y=\"4.5\" width=\"13\" height=\"13\" rx=\"2\"/><path d=\"m3.5 14 3-3a2 2 0 0 1 2.8 0L12 13.7\"/><path d=\"M18.5 3.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6Z\" fill=\"currentColor\" stroke=\"none\"/><path d=\"m14 18 5-5 2 2-5 5-3 1 1-3Z\"/></svg>"
}), createToolbarIconButton({
  'action': 'hd',
  'tooltip': toolbarText('image.hd'),
  'label': toolbarText('image.hd'),
  'iconSvg': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M12 3v18m9-9H3m14.48-6.36L6.52 17.64m10.96 0L6.52 6.36\"/></svg>"
}), createToolbarIconButton({
  'action': "mj-variation",
  'tooltip': toolbarText("image.mjVariation"),
  'label': toolbarText("image.mjVariation"),
  'extraClass': 'is-apimart-mj-action\x20is-apimart-mj-variation',
  'iconSvg': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22><path\x20d=\x22M4\x207h6a4\x204\x200\x200\x201\x204\x204v6\x22/><path\x20d=\x22M14\x2011a4\x204\x200\x200\x201\x204-4h2\x22/><path\x20d=\x22m17\x204\x203\x203-3\x203\x22/><path\x20d=\x22m11\x2014\x203\x203\x203-3\x22/></svg>'
}), createToolbarIconButton({
  'action': 'mj-hd',
  'tooltip': toolbarText("image.mjHd"),
  'label': toolbarText("image.mjHd"),
  'extraClass': "is-apimart-mj-action is-apimart-mj-hd",
  'iconSvg': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 19h14\"/><path d=\"M7 16V8\"/><path d=\"M17 16V8\"/><path d=\"M7 12h10\"/><path d=\"m12 2 .8 2.2L15 5l-2.2.8L12 8l-.8-2.2L9 5l2.2-.8Z\"/><path d=\"m19 6 .5 1.2 1.2.5-1.2.5L19 9.4l-.5-1.2-1.2-.5 1.2-.5Z\"/></svg>"
}), createToolbarIconButton({
  'action': "expand",
  'tooltip': toolbarText('image.expand'),
  'label': toolbarText("image.expand"),
  'iconSvg': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7\"/></svg>"
}), createToolbarIconButton({
  'action': "auto-subject",
  'tooltip': toolbarText('image.autoSubject'),
  'label': toolbarText("image.autoSubject"),
  'iconSvg': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"/></svg>"
}), createToolbarIconButton({
  'action': "apimart-face-detect",
  'tooltip': toolbarText("image.faceDetectTooltip"),
  'label': toolbarText('image.faceDetect'),
  'iconSvg': FACE_DETECTION_ICON_SVG
}), createToolbarIconButton({
  'action': "panorama-360",
  'tooltip': toolbarText("image.panorama360"),
  'label': toolbarText("image.panorama360"),
  'iconSvg': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><circle\x20cx=\x2212\x22\x20cy=\x2212\x22\x20r=\x228\x22/><path\x20d=\x22M4\x2012h16\x22/><path\x20d=\x22M12\x204a12\x2012\x200\x200\x200\x200\x2016\x22/><path\x20d=\x22M12\x204a12\x2012\x200\x200\x201\x200\x2016\x22/><path\x20d=\x22M3\x208c3-2\x206-3\x209-3s6\x201\x209\x203\x22/><path\x20d=\x22M3\x2016c3\x202\x206\x203\x209\x203s6-1\x209-3\x22/></svg>'
}), createToolbarIconButton({
  'action': "multigrid",
  'tooltip': toolbarText("image.multigrid"),
  'label': toolbarText('image.multigrid'),
  'iconSvg': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"></rect><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"></rect></svg>"
}), createToolbarIconButton({
  'action': "multiangle",
  'tooltip': toolbarText('image.multiangle'),
  'label': toolbarText("image.multiangle"),
  'iconSvg': "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"/><path d=\"M12 22V12\"/><path d=\"M12 12 3.27 7.73\"/><path d=\"M12 12l8.73-4.27\"/></svg>"
}), createToolbarIconButton({
  'action': "annotate",
  'tooltip': toolbarText('image.annotate'),
  'label': toolbarText('image.annotate'),
  'iconSvg': NODE_ANNOTATE_ICON_SVG
}), createToolbarIconButton({
  'action': "crop",
  'tooltip': toolbarText("image.crop"),
  'label': toolbarText('image.crop'),
  'iconSvg': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><path\x20d=\x22M6\x202v14a2\x202\x200\x200\x200\x202\x202h14M18\x2022V8a2\x202\x200\x200\x200-2-2H2\x22/></svg>'
}), createToolbarIconButton({
  'action': "fullscreen",
  'tooltip': toolbarText('common.fullscreen'),
  'label': toolbarText("common.fullscreen"),
  'iconSvg': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><path\x20d=\x22M8\x203H5a2\x202\x200\x200\x200-2\x202v3m18\x200V5a2\x202\x200\x200\x200-2-2h-3m0\x2018h3a2\x202\x200\x200\x200\x202-2v-3M3\x2016v3a2\x202\x200\x200\x200\x202\x202h3\x22/></svg>'
}), createToolbarIconButton({
  'action': 'upload',
  'tooltip': toolbarText("common.upload"),
  'label': toolbarText("common.upload"),
  'iconSvg': UPLOAD_ICON_SVG
}), createToolbarIconButton({
  'action': "download",
  'tooltip': toolbarText("common.download"),
  'label': toolbarText("common.download"),
  'iconSvg': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><path\x20d=\x22M21\x2015v4a2\x202\x200\x200\x201-2\x202H5a2\x202\x200\x200\x201-2-2v-4\x22/><polyline\x20points=\x227\x2010\x2012\x2015\x2017\x2010\x22/><line\x20x1=\x2212\x22\x20y1=\x2215\x22\x20x2=\x2212\x22\x20y2=\x223\x22/></svg>'
}), createToolbarIconButton({
  'action': "reset-size",
  'tooltip': toolbarText("common.resetSize"),
  'label': toolbarText("common.resetSize"),
  'iconSvg': '<svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20width=\x2216\x22\x20height=\x2216\x22><path\x20d=\x22M3\x2012a9\x209\x200\x200\x201\x2015.36-6.36\x22/><path\x20d=\x22M21\x2012a9\x209\x200\x200\x201-15.36\x206.36\x22/><polyline\x20points=\x2221\x203\x2021\x209\x2015\x209\x22/><polyline\x20points=\x223\x2021\x203\x2015\x209\x2015\x22/></svg>'
})]["join"]("\n      ");
export const IMAGE_TOOLBAR_HTML = "\n<div class=\"node-floating-toolbar v2-img-toolbar\">\n  <div class=\"v2-img-toolbar-main\">\n    <div class=\"v2-img-toolbar-zone v2-img-toolbar-zone-primary\" data-zone=\"outside-primary\"></div>\n    " + createToolbarIconButton({
  'action': "more-tools",
  'tooltip': toolbarText("image.more"),
  'label': toolbarText("image.more"),
  'iconSvg': NODE_TOOLBAR_MORE_ICON_SVG
}) + "\n    <div class=\"ftb-divider v2-img-toolbar-main-divider\"></div>\n    <div class=\"v2-img-toolbar-zone v2-img-toolbar-zone-secondary\" data-zone=\"outside-secondary\"></div>\n  </div>\n  <div class=\"v2-img-toolbar-more-menu\" data-role=\"more-menu\" hidden>\n    <div class=\"v2-img-toolbar-more-title\">" + toolbarText("image.moreTools") + "</div>\n    <div class=\"v2-img-toolbar-more-inline\">\n      <div class=\"v2-img-toolbar-zone v2-img-toolbar-zone-more\" data-zone=\"more\"></div>\n      <div class=\"ftb-divider v2-img-toolbar-customize-divider\"></div>\n      <button class=\"ftb-btn v2-img-toolbar-customize-toggle act-customize-tools\" type=\"button\" data-tooltip=\"" + toolbarText("image.customizeTip") + "\" aria-label=\"" + toolbarText("image.customize") + '\x22>' + toolbarText("image.customize") + "</button>\n    </div>\n  </div>\n  <div class=\"v2-img-toolbar-button-pool\" data-role=\"button-pool\" hidden>\n      " + IMAGE_TOOLBAR_BUTTON_POOL + '\x0a\x20\x20</div>\x0a</div>\x0a';