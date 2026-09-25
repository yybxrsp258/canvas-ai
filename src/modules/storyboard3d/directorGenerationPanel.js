import { getDirectorPanoramaModels } from './directorGenerationService.js';
import { restoreDirectorLayerVersion } from './directorGeneratedLayers.js';
const escape = _0x4b8ec3 => String(_0x4b8ec3 ?? '')["replaceAll"]('&', "&amp;")["replaceAll"]('\x22', '&quot;')["replaceAll"]('<', "&lt;");
export class DirectorGenerationPanel {
  constructor(_0x218dad) {
    this['panel'] = _0x218dad;
    this['prompt'] = '';
    this["kind"] = "layer";
    this["layerId"] = '';
    this["model"] = '';
    this["files"] = [];
  }
  ["render"]() {
    const {
      project: _0xd445c8,
      scene: _0x1f1eee
    } = this["panel"]["context"]();
    const _0x17eec6 = getDirectorPanoramaModels();
    if (!_0x17eec6["some"](_0x456ad1 => _0x456ad1["modelId"] === this["model"])) {
      this["model"] = _0x17eec6[0x0]?.["modelId"] || '';
    }
    const _0x16d7fd = (_0xd445c8["generationJobs"] || [])['filter'](_0x24f951 => _0x24f951["sceneId"] === _0x1f1eee['id'])["slice"](-0x8)["reverse"]();
    const _0x24e215 = _0x16d7fd["some"](_0xf2d62c => _0xf2d62c["status"] === "running");
    return '<fieldset\x20data-director-generation><legend>AI\x20生成层与全景</legend><div\x20class=\x22storyboard-3d-director-fields\x22>\x0a\x20\x20\x20\x20\x20\x20<label>任务<select\x20data-director-generation=\x22kind\x22><option\x20value=\x22layer\x22\x20' + (this["kind"] === "layer" ? "selected" : '') + ">可编辑场景层</option><option value=\"panorama\" " + (this["kind"] === 'panorama' ? "selected" : '') + '>球面全景图片</option></select></label>\x0a\x20\x20\x20\x20\x20\x20' + (this["kind"] === 'panorama' ? "<label>图像模型<select data-director-generation=\"model\">" + _0x17eec6["map"](_0x331c3c => "<option value=\"" + escape(_0x331c3c['modelId']) + '\x22\x20' + (this["model"] === _0x331c3c["modelId"] ? "selected" : '') + '>' + escape(_0x331c3c["providerLabel"]) + " · " + escape(_0x331c3c['label']) + "</option>")["join"]('') + "</select></label>" : '<label>结果位置<select\x20data-director-generation=\x22layerId\x22><option\x20value=\x22\x22>插入新生成层</option>' + (_0x1f1eee["generatedLayers"] || [])["map"](_0x8a4317 => "<option value=\"" + escape(_0x8a4317['id']) + '\x22\x20' + (_0x8a4317['id'] === this["layerId"] ? "selected" : '') + ">替换 " + escape(_0x8a4317["name"]) + '</option>')["join"]('') + "</select></label>") + "\n      <label>参考图片（最多 6 张）<input type=\"file\" accept=\"image/*\" multiple data-director-generation-files></label><span>" + this["files"]['map'](_0x39f582 => escape(_0x39f582['name']))["join"]('、') + "</span>\n      <label>场景描述<textarea rows=\"3\" maxlength=\"5000\" data-director-generation=\"prompt\">" + escape(this["prompt"]) + '</textarea></label>\x0a\x20\x20\x20\x20\x20\x20<button\x20data-storyboard-3d-action=\x22timeline-generation-start\x22\x20' + (_0x24e215 ? "disabled" : '') + '>' + (_0x24e215 ? "后台生成中…" : "开始生成") + "</button>\n    </div>" + (_0x24e215 ? "<progress aria-label=\"正在生成\"></progress>" : '') + '\x0a\x20\x20\x20\x20' + _0x16d7fd["map"](_0x360113 => '<p\x20role=\x22status\x22>' + escape(_0x360113["message"]) + " · " + escape(_0x360113["model"]) + '</p>')["join"]('') + "\n    " + (_0x1f1eee["generatedLayers"] || [])["map"](_0x44f59a => "<details><summary>" + escape(_0x44f59a['name']) + '\x20·\x20' + _0x44f59a["objectIds"]['length'] + '\x20个对象\x20·\x20' + _0x44f59a['versions']["length"] + " 个历史版本</summary>" + _0x44f59a["versions"]['map'](_0x46d517 => '<button\x20data-storyboard-3d-action=\x22timeline-generation-restore\x22\x20data-layer-id=\x22' + escape(_0x44f59a['id']) + "\" data-version-id=\"" + escape(_0x46d517['id']) + '\x22>恢复\x20' + escape(_0x46d517["name"]) + "</button>")['join']('') + "</details>")["join"]('') + "</fieldset>";
  }
  ["change"](_0x29f410) {
    const _0x10d160 = _0x29f410["target"];
    if (_0x10d160["matches"]?.('[data-director-generation-files]')) {
      const _0x1db39c = Array["from"](_0x10d160['files'] || []);
      _0x10d160['value'] = '';
      if (_0x1db39c["length"] > 0x6 || _0x1db39c["some"](_0x423e66 => !_0x423e66["type"]['startsWith']("image/") || _0x423e66["size"] > 0x20 * 0x400 * 0x400)) {
        this["panel"]["timeline"]['setMessage']?.("最多选择 6 张图片，每张不超过 32 MB。");
      } else {
        this["files"] = _0x1db39c;
        this["panel"]["timeline"]["requestRender"]?.();
      }
      return !![];
    }
    if (!_0x10d160["matches"]?.("[data-director-generation]")) {
      return ![];
    }
    this[_0x10d160["dataset"]["directorGeneration"]] = _0x10d160["value"];
    if (_0x10d160["dataset"]["directorGeneration"] === "kind") {
      this["panel"]["timeline"]["requestRender"]?.();
    }
    return !![];
  }
  ["click"](_0xf5d6bf, _0x5ee87e) {
    if (!_0xf5d6bf["startsWith"]("timeline-generation-")) {
      return ![];
    }
    const {
      project: _0x3d9bcb,
      scene: _0x4b6e83
    } = this["panel"]['context']();
    const _0x375d99 = this["panel"]["timeline"];
    if (_0xf5d6bf === "timeline-generation-start") {
      if (!this["prompt"]['trim']()) {
        _0x375d99['setMessage']?.("请输入场景描述。");
        return !![];
      }
      const _0x12b337 = _0x375d99["getGenerationContext"]?.() || {};
      _0x375d99['requestGeneration']?.({
        'projectId': _0x3d9bcb['id'],
        'sceneId': _0x4b6e83['id'],
        'prompt': this["prompt"],
        'kind': this["kind"],
        'layerId': this["layerId"],
        'model': this["kind"] === "panorama" ? this["model"] : _0x12b337["model"],
        'provider': _0x12b337["provider"],
        'assets': _0x12b337["assets"],
        'files': this["files"]
      });
    }
    if (_0xf5d6bf === "timeline-generation-restore") {
      this["panel"]["scenePanel"]['mutate']("恢复生成层历史", _0x10ccc4 => restoreDirectorLayerVersion(_0x10ccc4, _0x5ee87e['dataset']["layerId"], _0x5ee87e["dataset"]["versionId"]));
    }
    return !![];
  }
}