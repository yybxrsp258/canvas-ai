import { maskDebugPayloadSecrets } from './debugRequestMasking.js';
import { buildDebugJsonPreview } from './debugImagePreview.js';
export function buildGenerationDebugPreview({
  payload: _0x1b2970,
  promptPackage: _0x1a0947,
  notes = ''
} = {}) {
  if (!_0x1b2970) {
    throw new Error("当前输入尚未构造出生成请求，请检查模型、提示词和素材。");
  }
  const _0x5331c4 = maskDebugPayloadSecrets(_0x1b2970);
  return {
    'tabs': [{
      'label': '提示词',
      'content': String(_0x5331c4["prompt"] || '')
    }, {
      'label': "生成输入",
      ...buildDebugJsonPreview(_0x5331c4)
    }, {
      'label': "参考图顺序",
      ...buildDebugReferenceImages(_0x1a0947?.["referenceImages"] || (_0x1b2970["inputUrls"] || [])["map"]((_0x6d0237, _0x13232a) => ({
        'slot': _0x13232a + 0x1,
        'ref': _0x6d0237
      })))
    }, {
      'label': "预览说明",
      'content': "以上为真实生成链路组装的输入，尚未上传媒体或提交生成。厂商请求中的上传 URL、文件 ID 和任务 ID 在执行时确定。" + (notes ? '\x0a\x0a' + notes : '')
    }]
  };
}
function buildDebugReferenceImages(_0x4cc0b9) {
  return buildDebugJsonPreview(maskDebugPayloadSecrets(_0x4cc0b9), {
    'imageContext': !![]
  });
}