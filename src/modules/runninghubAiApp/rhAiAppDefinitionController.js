import { fetchRunningHubDefinition } from '../../../api/runningHubDefinitionApi.js';
import { isRunningHubSource, SOURCE_TYPES } from './rhAiAppSources.js';
import { parseRunningHubAiAppInput } from './rhAiAppImport.js';
import { createRunningHubWorkflowComponentDrafts } from './rhWorkflowImport.js';
import { resolveRunningHubModelApiBaseUrl } from '../runningHubProviderProfiles.js';
export function createRhAiAppDefinitionController(_0x524f30, {
  fetchDefinition = fetchRunningHubDefinition
} = {}) {
  let _0x30b27f = null;
  let _0x32f4f2 = null;
  let _0x19151a = null;
  let _0x477cb1 = null;
  let _0x533f95 = null;
  const _0x52a73c = _0x5c38bc => {
    const _0x3344f2 = _0x524f30["workflowInputFieldEl"]?.['querySelector']("[data-role=\"workflow-input-shell\"]");
    _0x3344f2?.['setAttribute']("aria-busy", String(_0x5c38bc));
    _0x3344f2?.["classList"]['toggle']("is-loading", _0x5c38bc);
  };
  const _0x46a9f3 = _0x11c717 => {
    if (!_0x533f95) {
      return;
    }
    _0x533f95["disabled"] = _0x11c717;
    _0x533f95['setAttribute']("aria-busy", String(_0x11c717));
    _0x533f95['classList']["toggle"]("is-loading", _0x11c717);
    _0x533f95["querySelector"]("span")['textContent'] = _0x11c717 ? '正在获取…' : '获取配置';
  };
  const _0x5d4dc2 = {
    'syncInputSource'() {
      if (!isRunningHubSource(_0x524f30["sourceType"])) {
        return;
      }
      const _0x4de8a5 = _0x524f30['_getInputText']();
      let _0x1a9163;
      try {
        _0x1a9163 = JSON["parse"](_0x4de8a5);
      } catch {}
      let _0x30a646;
      let _0x31ee20;
      let _0xdf96ed = _0x524f30["runningHubProfileId"];
      if (_0x1a9163?.["workflow"]) {
        _0x31ee20 = createRunningHubWorkflowComponentDrafts(_0x4de8a5)['parsed']['workflowId'];
        _0x30a646 = SOURCE_TYPES["runninghubWorkflow"];
      } else {
        const _0x1a2019 = parseRunningHubAiAppInput(_0x4de8a5);
        if (!_0x1a2019['body']['appId'] && !_0x1a2019['body']["aiAppId"] && _0x1a2019["body"]["workflowId"]) {
          return;
        }
        _0x31ee20 = _0x1a2019['appId'];
        _0xdf96ed = _0x1a2019["providerProfileId"] || _0xdf96ed;
        _0x30a646 = SOURCE_TYPES["runninghub"];
      }
      _0x524f30["sourceType"] !== _0x30a646 && (_0x524f30["savedAppId"] = '', _0x524f30["componentDrafts"] = [], _0x524f30["componentCandidates"] = [], _0x524f30['componentDraftKey'] = '', _0x524f30["promptHelpTooltip"] = '', _0x524f30['sourceType'] = _0x30a646, _0x524f30["_syncSourceView"]());
      _0x524f30["definitionReference"] = _0x5d4dc2["getSavedReference"]({
        'sourceType': _0x30a646,
        'runningHubProfileId': _0xdf96ed,
        'input': JSON['stringify']({
          'appId': _0x31ee20
        })
      });
      _0x5d4dc2["sync"]();
    },
    'beginFileRead'() {
      _0x5d4dc2["cancel"]();
      window["clearTimeout"](_0x524f30["parseTimer"]);
      const _0x151d3a = {};
      _0x32f4f2 = _0x151d3a;
      _0x524f30['workflowInputCollapsed'] = ![];
      _0x524f30["_syncWorkflowInputCollapsed"]();
      _0x52a73c(!![]);
      return {
        'isCurrent': () => _0x32f4f2 === _0x151d3a,
        'finish'() {
          _0x32f4f2 === _0x151d3a && (_0x32f4f2 = null, _0x52a73c(![]));
        }
      };
    },
    'getSavedReference'(_0x241224) {
      if (!isRunningHubSource(_0x241224["sourceType"])) {
        return '';
      }
      try {
        const _0x4ae731 = JSON["parse"](_0x241224["input"]);
        const _0x2d1c26 = _0x4ae731["workflowId"] || _0x4ae731['appId'];
        if (!/^\d{1,30}$/["test"](String(_0x2d1c26 || ''))) {
          return '';
        }
        return resolveRunningHubModelApiBaseUrl(_0x241224["runningHubProfileId"]) + '/' + (_0x241224["sourceType"] === 'runninghub-workflow' ? "workflow" : "ai-detail") + '/' + _0x2d1c26;
      } catch {
        return '';
      }
    },
    'mount'() {
      _0x19151a = document['createElement']('div');
      _0x19151a["className"] = "rh-ai-app-definition";
      _0x19151a["innerHTML"] = '<label\x20class=\x22rh-ai-app-label\x22\x20for=\x22rh-definition-reference\x22>RunningHub\x20链接</label>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22rh-ai-app-definition-row\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<input\x20id=\x22rh-definition-reference\x22\x20data-role=\x22definition-reference\x22\x20type=\x22text\x22\x20autocomplete=\x22off\x22\x20spellcheck=\x22false\x22\x20/>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20type=\x22button\x22\x20class=\x22rh-ai-app-secondary\x22\x20data-action=\x22fetch-definition\x22><svg\x20viewBox=\x220\x200\x2024\x2024\x22\x20aria-hidden=\x22true\x22><path\x20d=\x22M20\x207v5h-5M4\x2017v-5h5M6\x207a7\x207\x200\x200\x201\x2012\x200l2\x205M4\x2012l2\x205a7\x207\x200\x200\x200\x2012\x200\x22/></svg><span>获取配置</span></button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>';
      _0x524f30["workflowInputFieldEl"]["prepend"](_0x19151a);
      _0x477cb1 = _0x19151a["querySelector"]("input");
      _0x533f95 = _0x19151a["querySelector"]("button");
      _0x477cb1["addEventListener"]('input', () => {
        _0x5d4dc2["cancel"]();
        _0x524f30["definitionReference"] = _0x477cb1["value"];
        _0x524f30['_saveKindState']();
      });
      _0x477cb1['addEventListener']("keydown", _0x44ca50 => {
        if (_0x44ca50['key'] !== "Enter" || _0x44ca50["isComposing"]) {
          return;
        }
        _0x44ca50['preventDefault']();
        void _0x5d4dc2["load"]();
      });
      _0x524f30["textarea"]["addEventListener"]('input', _0x5d4dc2["cancel"]);
      _0x524f30["panel"]["addEventListener"]("input", _0x5e92e3 => {
        if (_0x5e92e3["target"] !== _0x477cb1) {
          _0x5d4dc2["cancel"]();
        }
      });
      _0x524f30['panel']["addEventListener"]("click", () => {
        if (_0x32f4f2) {
          _0x5d4dc2["cancel"]();
        }
      }, !![]);
      _0x533f95["addEventListener"]("click", () => void _0x5d4dc2["load"]());
      _0x5d4dc2["sync"]();
    },
    'sync'() {
      if (!_0x19151a) {
        return;
      }
      _0x19151a["hidden"] = !isRunningHubSource(_0x524f30['sourceType']);
      _0x477cb1['placeholder'] = "粘贴 AI 应用或工作流链接，自动识别类型";
      _0x477cb1["value"] = _0x524f30["definitionReference"] || '';
    },
    'cancel'() {
      _0x32f4f2 = null;
      _0x52a73c(![]);
      const _0x2b94ec = _0x30b27f;
      _0x30b27f = null;
      _0x2b94ec?.['abort']();
      _0x46a9f3(![]);
    },
    async 'load'() {
      if (_0x30b27f || !isRunningHubSource(_0x524f30["sourceType"])) {
        return;
      }
      if (!_0x524f30['_guardRunningHubAiAppAccess']()) {
        return;
      }
      _0x5d4dc2['cancel']();
      const _0x4616d2 = new AbortController();
      _0x30b27f = _0x4616d2;
      const _0x37559d = {
        'sourceType': _0x524f30["sourceType"],
        'kind': _0x524f30['kind'],
        'profileId': _0x524f30["runningHubProfileId"],
        'reference': _0x477cb1["value"]["trim"]()
      };
      const _0x6af7e7 = _0x524f30["_getInputText"]();
      _0x46a9f3(!![]);
      _0x524f30["_setError"]('');
      try {
        const _0xf816b = await fetchDefinition({
          ..._0x37559d,
          'sourceType': "auto",
          'signal': _0x4616d2["signal"]
        });
        if (_0x30b27f !== _0x4616d2 || _0x524f30['sourceType'] !== _0x37559d['sourceType'] || _0x524f30["kind"] !== _0x37559d["kind"] || _0x524f30["_getInputText"]() !== _0x6af7e7) {
          return;
        }
        window["clearTimeout"](_0x524f30["parseTimer"]);
        _0x524f30["_clearCurrentDraftIdentity"]();
        _0x524f30["componentDrafts"] = [];
        _0x524f30['componentCandidates'] = [];
        _0x524f30["componentDraftKey"] = '';
        _0x524f30['sourceType'] = _0xf816b["sourceType"];
        _0x524f30['runningHubProfileId'] = _0xf816b["providerProfileId"];
        _0x524f30["definitionReference"] = _0x37559d["reference"];
        _0x524f30['textarea']["value"] = _0xf816b["input"];
        _0x524f30["appName"] = _0xf816b["name"];
        _0x524f30["_syncSourceView"]();
        _0x524f30["_parseNow"]();
      } catch (_0x16dcb7) {
        if (_0x30b27f !== _0x4616d2 || _0x4616d2["signal"]["aborted"]) {
          return;
        }
        _0x524f30["_setError"](_0x16dcb7?.['message'] || '获取配置失败，请重试');
        _0x524f30["_saveKindState"]();
      } finally {
        _0x30b27f === _0x4616d2 && (_0x30b27f = null, _0x46a9f3(![]));
      }
    }
  };
  return _0x5d4dc2;
}