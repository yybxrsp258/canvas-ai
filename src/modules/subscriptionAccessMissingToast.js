import { openSettingsPanelToField } from './settings/panelSettings.js';
const SUBSCRIPTION_PANE_NAME = "subscription";
const SUBSCRIPTION_FIELD_IDS = Object["freeze"](['subscriptionCdkeyInput']);
export function isSubscriptionAccessConfigurationMessage(_0x2c375d) {
  const _0x3839fd = String(_0x2c375d || '')['trim']();
  if (!_0x3839fd) {
    return ![];
  }
  return /(?:请先|需要[^，。]*(?:激活|输入)|请输入)[^，。]*(?:cdkey|订阅|授权)/i["test"](_0x3839fd) || /(?:vip|subscription|license|cdkey).*(?:required\b|activate\b|enter\b)|(?:activate\b|enter\b).*(?:cdkey|subscription|license)/i["test"](_0x3839fd);
}
export function openSubscriptionAccessSettings(_0x59a65c = {}) {
  const _0x4f680d = Array['isArray'](_0x59a65c["fieldIds"]) ? _0x59a65c["fieldIds"] : SUBSCRIPTION_FIELD_IDS;
  return openSettingsPanelToField({
    'paneName': _0x59a65c["paneName"] || SUBSCRIPTION_PANE_NAME,
    'fieldIds': _0x4f680d,
    'select': _0x59a65c['select'] !== ![],
    'highlight': _0x59a65c['highlight'] !== ![]
  });
}