import { formatPersonReplacementPersonLabel } from './personReplacementPromptIdentity.js';
export const PERSON_REPLACEMENT_PROMPT_MODE_POSITIONING = 'positioning';
export const PERSON_REPLACEMENT_PROMPT_MODE_REGULAR = 'regular';
export const PERSON_REPLACEMENT_PROMPT_MODE_MANUAL = "manual";
export const PERSON_REPLACEMENT_PROMPT_MODE_TEST = "annotated-source-test";
export const isPersonReplacementTestModeAvailable = () => globalThis['window']?.["DEV_MODE"] === !![];
export const PERSON_REPLACEMENT_MARKER_COLORS = ["--annotate-red", "--cyan", '--annotate-yellow', '--annotate-green', "--annotate-purple", "--annotate-orange", '--group-pink', "--cyan-text"];
export function getPersonReplacementPromptMarker(_0x112481, _0xaf31d0, _0x388f06, _0x5402a9 = 0x0) {
  if (_0x112481 === PERSON_REPLACEMENT_PROMPT_MODE_MANUAL) {
    return null;
  }
  const _0x4cc761 = _0x388f06 === 0x1 ? '人物' : _0x388f06 === 0x2 ? ['左侧', '右侧'][_0xaf31d0] : _0x388f06 === 0x3 ? ['左侧', '中间', '右侧'][_0xaf31d0] : String(_0xaf31d0 + 0x1);
  const _0x454393 = _0x112481 === PERSON_REPLACEMENT_PROMPT_MODE_POSITIONING || _0x112481 === PERSON_REPLACEMENT_PROMPT_MODE_TEST;
  return {
    'label': _0x454393 ? formatPersonReplacementPersonLabel(_0xaf31d0)['replace']('人物', '') : _0x4cc761,
    'subject': _0x388f06 > 0x3 ? "从左到右第" + (_0xaf31d0 + 0x1) + "个人物" : _0x388f06 === 0x1 ? '人物' : _0x4cc761 + '人物',
    'referenceSlot': _0x5402a9,
    'colorToken': _0x454393 && _0x5402a9 ? PERSON_REPLACEMENT_MARKER_COLORS[_0xaf31d0 % PERSON_REPLACEMENT_MARKER_COLORS['length']] : ''
  };
}
export function normalizePersonReplacementPromptMode(_0x56f0c5) {
  if (_0x56f0c5 === PERSON_REPLACEMENT_PROMPT_MODE_MANUAL || _0x56f0c5 === PERSON_REPLACEMENT_PROMPT_MODE_TEST) {
    return _0x56f0c5;
  }
  return _0x56f0c5 === PERSON_REPLACEMENT_PROMPT_MODE_POSITIONING ? PERSON_REPLACEMENT_PROMPT_MODE_POSITIONING : PERSON_REPLACEMENT_PROMPT_MODE_REGULAR;
}
function describePromptSubject({
  marker: _0x5cdfb5,
  person: _0x39b396
}, _0x488e77) {
  if (_0x488e77 === PERSON_REPLACEMENT_PROMPT_MODE_TEST) {
    return _0x5cdfb5["label"] + '框内的人物';
  }
  if (_0x488e77 === PERSON_REPLACEMENT_PROMPT_MODE_POSITIONING) {
    return "中（定位图" + _0x5cdfb5["label"] + "框）的人物";
  }
  const _0x99a927 = String(_0x39b396["genderHint"] || '')["trim"]()['toLowerCase']();
  const _0x5804da = ['male', "man", '男', '男性', '男人']["includes"](_0x99a927) ? '男人' : ["female", "woman", '女', '女性', '女人']["includes"](_0x99a927) ? '女人' : '人';
  if (_0x5cdfb5["subject"]["startsWith"]("从左到右")) {
    return _0x5cdfb5["subject"]["replace"](/人物$/u, '人');
  }
  return {
    '左侧人物': "左边的" + _0x5804da,
    '中间人物': "中间的" + _0x5804da,
    '右侧人物': "右边的" + _0x5804da,
    '人物': '中的' + _0x5804da
  }[_0x5cdfb5["subject"]];
}
export function buildPersonReplacementPositioningPrompt(_0x5106e4, _0x39d796 = 0x0, _0x16a70b = PERSON_REPLACEMENT_PROMPT_MODE_POSITIONING, _0x182887 = 0x0) {
  const _0xfd31d4 = {
    'full-person': '完整人物',
    'visible-part': "当前可见部分",
    'clothing': '服装',
    'arm-hand': "手臂和手部",
    'face-hair': "脸部和头发",
    'feet': '脚部'
  };
  return [_0x16a70b === PERSON_REPLACEMENT_PROMPT_MODE_TEST ? "编辑图1，框和标签仅用于指认要替换的人物，输出时去除这些框和标签。" : _0x182887 ? '图' + _0x182887 + "为人物定位图，字母框对应图1中要替换的人物。" : '', ..._0x5106e4["map"](_0x3ddb9f => _0x3ddb9f["scopeRequirement"]['scope'] === "full-person" ? '把图1' + describePromptSubject(_0x3ddb9f, _0x16a70b) + "替换成" + _0x3ddb9f["reference"]["label"] + '。' : '把图1' + describePromptSubject(_0x3ddb9f, _0x16a70b) + '的' + _0xfd31d4[_0x3ddb9f['scopeRequirement']['scope']] + '替换成' + _0x3ddb9f["reference"]["label"] + "中人物的对应部分。"), _0x39d796 ? "把图1的背景替换成图" + _0x39d796 + '的场景。' : '']["filter"](Boolean)["join"]('\x0a');
}
export function composePersonReplacementImagePrompt(_0x5829fb = {}, _0x79c79b = '') {
  if (_0x5829fb["promptMode"] === PERSON_REPLACEMENT_PROMPT_MODE_MANUAL) {
    return String(_0x79c79b);
  }
  if (!String(_0x79c79b)['trim']()) {
    return _0x5829fb['prompt'];
  }
  return [_0x5829fb["guidedBindingPrompt"], _0x79c79b]["filter"](Boolean)['join']('\x0a\x0a');
}