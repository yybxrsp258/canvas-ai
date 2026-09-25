import { t } from '../i18n/index.js';
export const GENERATE_ICON_HTML = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"5\"></line><polyline points=\"5 12 12 5 19 12\"></polyline></svg>";
export const GENERATE_LOADING_ICON_HTML = '<svg\x20width=\x2214\x22\x20height=\x2214\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22\x20style=\x22animation:spin\x201s\x20linear\x20infinite\x22><path\x20d=\x22M21\x2012a9\x209\x200\x201\x201-6.219-8.56\x22></path></svg>';
export const GENERATE_CANCEL_ICON_HTML = '<span\x20class=\x22v2-task-cancel-icon\x22\x20aria-hidden=\x22true\x22><svg\x20width=\x2214\x22\x20height=\x2214\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22><line\x20x1=\x229\x22\x20y1=\x229\x22\x20x2=\x2215\x22\x20y2=\x2215\x22></line><line\x20x1=\x2215\x22\x20y1=\x229\x22\x20x2=\x229\x22\x20y2=\x2215\x22></line></svg><span\x20class=\x22v2-task-cancel-spin\x22><svg\x20width=\x2214\x22\x20height=\x2214\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22><path\x20d=\x22M21\x2012a9\x209\x200\x201\x201-6.219-8.56\x22></path></svg></span></span>';
function setGenerateButtonIcon(_0x45ef56, _0x2439f6) {
  if (_0x45ef56["innerHTML"] !== _0x2439f6) {
    _0x45ef56["innerHTML"] = _0x2439f6;
  }
}
function generateButtonText(_0x1b42f0, _0x4014ee = {}) {
  return t("previewGenerateButton." + _0x1b42f0, _0x4014ee);
}
function normalizeTitle(_0x56de71) {
  const _0x2dacc5 = generateButtonText("generate");
  return String(_0x56de71 || _0x2dacc5)["trim"]() || _0x2dacc5;
}
function applyTooltip(_0x587bb8, _0x398391) {
  if (!_0x587bb8?.["dataset"]) {
    return;
  }
  const _0x567c8d = String(_0x398391 || '')["trim"]();
  if (_0x567c8d) {
    _0x587bb8["dataset"]["tooltip"] = _0x567c8d;
  } else {
    delete _0x587bb8["dataset"]["tooltip"];
  }
}
export function setGenerateButtonLoadingUi(_0x37dbb4, {
  title = generateButtonText("generate"),
  tooltip = '',
  disabled = !![],
  ariaLabel = ''
} = {}) {
  if (!_0x37dbb4) {
    return;
  }
  _0x37dbb4["disabled"] = disabled === !![];
  if (_0x37dbb4["style"]) {
    _0x37dbb4['style']["color"] = '';
  }
  _0x37dbb4["classList"]?.['remove']?.('is-rh-busy', "is-task-cancel");
  applyTooltip(_0x37dbb4, tooltip);
  const _0x2ec0f7 = normalizeTitle(ariaLabel || title);
  _0x37dbb4["setAttribute"]?.('aria-label', _0x2ec0f7);
  _0x37dbb4['title'] = normalizeTitle(title);
  setGenerateButtonIcon(_0x37dbb4, GENERATE_LOADING_ICON_HTML);
}
export function setGenerateButtonCancellableUi(_0x5268eb, {
  title = generateButtonText('clickCancelTask'),
  tooltip = generateButtonText('clickCancelTask'),
  ariaLabel = generateButtonText("cancelGenerate"),
  color = "var(--white)",
  busy = ![]
} = {}) {
  if (!_0x5268eb) {
    return;
  }
  _0x5268eb["disabled"] = ![];
  if (_0x5268eb["style"]) {
    _0x5268eb["style"]["color"] = color;
  }
  _0x5268eb["classList"]?.['toggle']?.("is-rh-busy", busy === !![]);
  _0x5268eb['classList']?.["add"]?.('is-task-cancel');
  applyTooltip(_0x5268eb, tooltip);
  _0x5268eb['setAttribute']?.("aria-label", String(ariaLabel || generateButtonText('cancelGenerate')));
  _0x5268eb['title'] = String(title || generateButtonText("clickCancelTask"));
  setGenerateButtonIcon(_0x5268eb, GENERATE_CANCEL_ICON_HTML);
}
export function resetGenerateButtonIdleUi(_0x5e4867, _0x4be700 = generateButtonText("generate")) {
  if (!_0x5e4867) {
    return;
  }
  _0x5e4867["disabled"] = ![];
  if (_0x5e4867["style"]) {
    _0x5e4867["style"]["color"] = '';
  }
  _0x5e4867["classList"]?.["remove"]?.('is-rh-busy', "is-task-cancel");
  applyTooltip(_0x5e4867, '');
  _0x5e4867["setAttribute"]?.("aria-label", normalizeTitle(_0x4be700));
  _0x5e4867['title'] = normalizeTitle(_0x4be700);
  setGenerateButtonIcon(_0x5e4867, GENERATE_ICON_HTML);
}
export function setPreviewGenerateButtonLoading(_0x345cc2) {
  setGenerateButtonLoadingUi(_0x345cc2);
}
export function resetPreviewGenerateButton(_0x260de1, _0x1a2927 = generateButtonText("generate")) {
  resetGenerateButtonIdleUi(_0x260de1, _0x1a2927);
}
export function createPreviewGenerateButtonCallbacks(_0x456b02, _0x3e2866 = generateButtonText("generate")) {
  return {
    'onStart'() {
      setPreviewGenerateButtonLoading(_0x456b02?.["btnEl"]);
    },
    'onStop'() {
      resetPreviewGenerateButton(_0x456b02?.["btnEl"], _0x3e2866);
      _0x456b02?.["_updateSubmitButtonState"]?.();
    }
  };
}