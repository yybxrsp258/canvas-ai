import { createStoryVideoPlayback } from './storyVideoPlayback.js';
import { renderStoryReplicationReview, renderStoryReplicationReviewTab, renderStoryReplicationTimeRail, renderStoryReplicationCast, renderStoryReplicationEvidenceSummary, syncStoryReplicationReviewStatus } from './storyReplicationReviewPresentation.js';
import { editStoryReplicationSource, addStoryReplicationCharacter, removeStoryReplicationCharacter, mergeStoryReplicationCharacters, setStoryReplicationCharacterPresence } from './storyReplicationSourceEditing.js';
import { renderStoryReplicationCharacterSummary } from './storyReplicationCharacterPresentation.js';
import { createStoryReplicationPortraitEditor } from './storyReplicationPortraitController.js';
import { captureStoryReplicationRepresentativeFrame } from './storyReplicationRepresentativeFrames.js';
import { bindStoryReplicationSelects } from './storyReplicationSelects.js';
export function bindStoryReplicationReview(_0x413109, {
  state: _0x365dc3,
  createProjectToken: _0x35e626,
  isProjectTaskLive: _0x530335,
  syncProjectEntry: _0x1f121e,
  schedulePersistence: _0x57b3a8,
  refreshFooter: _0x2d356d,
  showToast: _0x7117c7,
  captureFrame = captureStoryReplicationRepresentativeFrame,
  reanalyze: _0x4a032a
} = {}) {
  const _0x40cffb = _0x413109["querySelector"]("[data-replication-review-host]");
  if (!_0x40cffb) {
    return null;
  }
  let _0x16837b = null;
  let _0x4b4f88 = null;
  let _0x1473dc = "story";
  let _0x1037f7 = ![];
  let _0x2f57d2 = 0x0;
  let _0x100f25 = '';
  let _0x3ae7f4 = null;
  let _0x4bef68 = null;
  let _0x54469a = null;
  const _0x4a3079 = _0xb7bbf6 => _0x530335(_0xb7bbf6["token"]) && _0xb7bbf6['episode']["replication"]["sourceAnalysis"] === _0xb7bbf6["source"];
  const _0x9028bb = _0x4a0f26 => !_0x1037f7 && _0x16837b === _0x4a0f26 && _0x4a3079(_0x4a0f26);
  const _0x47fe6a = () => ["uploading", "analyzing"]["includes"](_0x16837b?.["episode"]["replication"]["status"]);
  function _0x42632c(_0x4b987e = '') {
    if (_0x16837b && _0x9028bb(_0x16837b)) {
      syncStoryReplicationReviewStatus(_0x40cffb, _0x16837b["episode"], {
        'busy': _0x16837b["busy"] === !![] || _0x47fe6a(),
        'message': _0x4b987e
      });
    }
    _0x54469a?.['sync']();
  }
  function _0x57c2df(_0x192cf4) {
    _0x1f121e(_0x192cf4["token"]);
    _0x57b3a8({
      'immediate': !![]
    });
    _0x2d356d();
    for (const _0x4f0ca9 of _0x40cffb['querySelectorAll']("[data-replication-roster-summary], [data-replication-review-summary]")) {
      _0x4f0ca9['textContent'] = _0x4f0ca9["hasAttribute"]("data-replication-review-summary") ? renderStoryReplicationEvidenceSummary(_0x192cf4["source"]) : renderStoryReplicationCharacterSummary(_0x192cf4["source"]);
    }
    if (_0x9028bb(_0x192cf4)) {
      _0x40cffb["querySelector"]("[data-replication-cast]")['innerHTML'] = renderStoryReplicationCast(_0x192cf4['episode']);
    }
  }
  function _0x35aeaa() {
    _0x54469a?.["destroy"]();
    _0x54469a = null;
    _0x4bef68?.["destroy"]();
    _0x4bef68 = null;
    _0x2f57d2 += 0x1;
    _0x3ae7f4?.();
    _0x4b4f88?.["destroy"]();
    const _0x45d8d6 = _0x40cffb["querySelector"]('video');
    _0x45d8d6 && (_0x45d8d6["removeAttribute"]("src"), _0x45d8d6["load"]());
    _0x4b4f88 = null;
    _0x16837b = null;
    _0x40cffb['replaceChildren']();
    _0x40cffb["hidden"] = !![];
    _0x413109["querySelector"]("[data-story-replication-grid]")?.["removeAttribute"]("hidden");
  }
  function _0x35e34f({
    preserveScroll = ![]
  } = {}) {
    const _0x350c92 = _0x40cffb["querySelector"]("[data-replication-fields]")["scrollTop"];
    _0x54469a?.["destroy"]();
    _0x4bef68?.["destroy"]();
    _0x4bef68 = null;
    _0x40cffb["querySelector"]("[data-replication-fields]")["innerHTML"] = renderStoryReplicationReviewTab(_0x16837b["episode"], _0x1473dc);
    _0x54469a = bindStoryReplicationSelects(_0x40cffb);
    _0x40cffb['querySelectorAll']('[data-replication-tab]')["forEach"](_0x51c989 => {
      _0x51c989["setAttribute"]("aria-pressed", String(_0x51c989["dataset"]["replicationTab"] === _0x1473dc));
    });
    _0x40cffb["querySelector"]("[data-replication-fields]")["scrollTop"] = preserveScroll ? _0x350c92 : 0x0;
    _0x42632c();
  }
  async function _0x26712a(_0x39fae2, {
    play = ![]
  } = {}) {
    const _0x49aced = _0x16837b;
    const _0x18f685 = ++_0x2f57d2;
    _0x3ae7f4?.();
    const _0x3187c5 = _0x40cffb["querySelector"]("video");
    const _0x241d1c = _0x40cffb["querySelector"]("[data-replication-seeking]");
    _0x241d1c["hidden"] = ![];
    _0x42632c("正在定位原片画面…");
    try {
      if (!(await _0x4b4f88['warm']()) || !_0x9028bb(_0x49aced) || _0x18f685 !== _0x2f57d2) {
        return;
      }
      _0x3187c5["readyState"] < 0x1 && (await new Promise(_0x2d50fd => {
        const _0x560862 = () => {
          clearTimeout(_0x2dfdcf);
          _0x3187c5['removeEventListener']('loadedmetadata', _0x560862);
          _0x3187c5["removeEventListener"]('error', _0x560862);
          if (_0x3ae7f4 === _0x560862) {
            _0x3ae7f4 = null;
          }
          _0x2d50fd();
        };
        const _0x2dfdcf = setTimeout(_0x560862, 0x1f40);
        _0x3ae7f4 = _0x560862;
        _0x3187c5["addEventListener"]("loadedmetadata", _0x560862, {
          'once': !![]
        });
        _0x3187c5["addEventListener"]("error", _0x560862, {
          'once': !![]
        });
      }));
      if (!_0x9028bb(_0x49aced) || _0x18f685 !== _0x2f57d2) {
        return;
      }
      if (_0x3187c5["readyState"] < 0x1) {
        _0x42632c('原视频加载失败，请检查源文件后重试。');
        return;
      }
      _0x3187c5['pause']();
      _0x3187c5['currentTime'] = Math["min"](Math['max'](0x0, _0x39fae2), Math['max'](0x0, _0x3187c5['duration'] - 0.001));
      if (play) {
        await _0x3187c5["play"]();
      }
      _0x42632c();
    } finally {
      if (_0x9028bb(_0x49aced) && _0x18f685 === _0x2f57d2) {
        _0x241d1c['hidden'] = !![];
      }
    }
  }
  async function _0x306d51(_0x3ba80e, _0x8bc794) {
    if (_0x3ba80e["dataset"]["replicationCrop"]) {
      _0x4bef68?.["destroy"]();
      const _0x3392bd = _0x8bc794['source']["characters"]["find"](_0x23996e => _0x23996e['id'] === _0x3ba80e["dataset"]["replicationCrop"]);
      _0x4bef68 = createStoryReplicationPortraitEditor({
        'card': _0x3ba80e["closest"]("[data-replication-character]"),
        'character': _0x3392bd,
        'capture': _0x30a65a => captureFrame({
          ..._0x30a65a,
          'videoRef': _0x8bc794["episode"]['sourceVideo']["videoRef"],
          'projectId': _0x8bc794["token"]["projectId"]
        }),
        'isActive': () => _0x4a3079(_0x8bc794) && _0x8bc794["source"]['characters']["includes"](_0x3392bd),
        'showToast': _0x7117c7,
        'onSaved': () => {
          _0x57c2df(_0x8bc794);
          if (_0x9028bb(_0x8bc794)) {
            _0x35e34f({
              'preserveScroll': !![]
            });
          }
        }
      });
      return;
    }
    if (_0x3ba80e["hasAttribute"]("data-replication-add-character")) {
      const _0x3711ad = _0x40cffb["querySelector"]("video");
      if (_0x3711ad["readyState"] < 0x2 || _0x3711ad["seeking"]) {
        _0x7117c7('请先定位并等待当前人物画面加载。', "warn");
        return;
      }
      const _0x574b24 = addStoryReplicationCharacter(_0x8bc794["token"]["data"], _0x8bc794['episode'], {
        'timeSec': _0x3711ad['currentTime']
      });
      _0x574b24 && (_0x57c2df(_0x8bc794), _0x35e34f({
        'preserveScroll': !![]
      }));
      return;
    }
    if (_0x3ba80e["dataset"]["replicationRemoveCharacter"]) {
      removeStoryReplicationCharacter(_0x8bc794["token"]["data"], _0x8bc794["episode"], _0x3ba80e['dataset']["replicationRemoveCharacter"]) && (_0x57c2df(_0x8bc794), _0x35e34f({
        'preserveScroll': !![]
      }));
      return;
    }
    if (_0x3ba80e["hasAttribute"]("data-replication-reanalyze") && _0x4a032a) {
      _0x8bc794['busy'] = !![];
      _0x42632c('正在重新分析原片…');
      try {
        await _0x4a032a(_0x8bc794["episode"]['id']);
        !_0x1037f7 && _0x16837b === _0x8bc794 && _0x530335(_0x8bc794["token"]) && (_0x8bc794["source"] = _0x8bc794["episode"]["replication"]['sourceAnalysis'], _0x40cffb["querySelector"](".story-source-time-rail")["innerHTML"] = renderStoryReplicationTimeRail(_0x8bc794["source"]), _0x57c2df(_0x8bc794), _0x35e34f({
          'preserveScroll': !![]
        }));
      } catch (_0x446faf) {
        if (_0x9028bb(_0x8bc794)) {
          _0x7117c7(_0x446faf?.['message'] || "重新分析失败，已保留原分析记录。", 'error');
        }
      } finally {
        _0x8bc794["busy"] = ![];
        if (_0x9028bb(_0x8bc794)) {
          _0x42632c(_0x8bc794["episode"]['replication']['error'] || '');
        }
      }
      return;
    }
  }
  async function _0x278b19(_0x14677f) {
    const _0x12e364 = _0x14677f["target"]["closest"]("button");
    if (!_0x12e364 || _0x12e364["disabled"]) {
      return;
    }
    const _0x591dc1 = _0x12e364["dataset"]["replicationOpen"];
    if (_0x591dc1) {
      const _0x329d31 = _0x365dc3["data"]["episodes"]["find"](_0xb4dba2 => _0xb4dba2['id'] === _0x591dc1);
      if (!_0x329d31?.["replication"]["sourceAnalysis"]) {
        return;
      }
      _0x35aeaa();
      _0x16837b = {
        'episode': _0x329d31,
        'source': _0x329d31['replication']["sourceAnalysis"],
        'token': _0x35e626()
      };
      _0x100f25 = _0x329d31["replication"]["status"];
      _0x1473dc = "story";
      _0x40cffb['hidden'] = ![];
      _0x40cffb["innerHTML"] = renderStoryReplicationReview(_0x329d31);
      _0x54469a = bindStoryReplicationSelects(_0x40cffb);
      _0x413109["querySelector"]("[data-story-replication-grid]")?.["setAttribute"]("hidden", '');
      _0x4b4f88 = createStoryVideoPlayback({
        'videoEl': _0x40cffb["querySelector"]("video"),
        'sourceUrl': _0x329d31["sourceVideo"]["videoRef"],
        'preferStreamingSource': !![],
        'ownerId': "story-source:" + _0x16837b['token']['projectId'] + ':' + _0x329d31['id']
      });
      _0x42632c();
      void _0x26712a(0x0)["catch"](() => _0x42632c('原视频加载失败，请重试。'));
      return;
    }
    if (!_0x16837b || !_0x40cffb["contains"](_0x12e364)) {
      return;
    }
    if (_0x12e364["hasAttribute"]("data-replication-close")) {
      _0x35aeaa();
      return;
    }
    if (_0x12e364["dataset"]['replicationTab']) {
      _0x1473dc = _0x12e364["dataset"]["replicationTab"];
      _0x35e34f();
      return;
    }
    if (_0x12e364["dataset"]['replicationCharacterLink']) {
      _0x1473dc = "characters";
      _0x35e34f();
      [..._0x40cffb["querySelectorAll"]("[data-replication-character]")]["find"](_0xeb256b => _0xeb256b["dataset"]["replicationCharacter"] === _0x12e364["dataset"]["replicationCharacterLink"])?.["scrollIntoView"]({
        'block': "nearest"
      });
      return;
    }
    if (_0x12e364['hasAttribute']('data-replication-seek')) {
      void _0x26712a(Number(_0x12e364['dataset']['replicationSeek']), {
        'play': _0x12e364["hasAttribute"]("data-replication-listen")
      })['catch'](() => _0x42632c("原视频定位或播放失败，请重试。"));
      return;
    }
    if (_0x16837b['busy'] || _0x47fe6a() || _0x16837b["episode"]["clips"]?.["length"]) {
      return;
    }
    const _0x1444a6 = _0x16837b;
    await _0x306d51(_0x12e364, _0x1444a6);
    if (_0x12e364['dataset']["replicationCapture"]) {
      _0x1444a6["busy"] = !![];
      _0x42632c("正在保存人物代表画面…");
      try {
        if (_0x12e364["dataset"]["replicationCapture"]) {
          const _0x4f42a8 = _0x1444a6['source']["characters"]["find"](_0x44fd89 => _0x44fd89['id'] === _0x12e364['dataset']['replicationCapture']);
          const _0x509ef0 = _0x40cffb["querySelector"]("video");
          if (_0x509ef0['readyState'] < 0x2) {
            throw new Error("请先等待原视频画面加载完成。");
          }
          const _0x4927ac = Number(_0x509ef0["currentTime"]);
          if (!_0x1444a6["source"]["events"]["some"](_0x2bc56c => _0x2bc56c["characterIds"]["includes"](_0x4f42a8['id']) && _0x4927ac >= _0x2bc56c['startSec'] && _0x4927ac < _0x2bc56c["endSec"])) {
            throw new Error('当前时间不在该角色的出场片段内，请先定位其出场画面。');
          }
          const _0x40e4f2 = await captureFrame({
            'videoRef': _0x1444a6["episode"]['sourceVideo']['videoRef'],
            'timeSec': _0x4927ac,
            'projectId': _0x1444a6['token']['projectId'],
            'isActive': () => _0x4a3079(_0x1444a6)
          });
          _0x40e4f2 && _0x4a3079(_0x1444a6) && (_0x4f42a8["frame"] = _0x40e4f2, _0x4f42a8["frameError"] = '', delete _0x4f42a8["portrait"], _0x57c2df(_0x1444a6));
        }
        if (_0x9028bb(_0x1444a6)) {
          _0x35e34f({
            'preserveScroll': !![]
          });
        }
      } catch (_0x14dace) {
        if (_0x9028bb(_0x1444a6)) {
          _0x7117c7(_0x14dace?.["message"] || "操作失败，请重试。", "error");
        }
      } finally {
        _0x1444a6["busy"] = ![];
        if (_0x9028bb(_0x1444a6)) {
          _0x42632c(_0x1444a6["episode"]["replication"]["error"] || '');
        }
      }
    }
  }
  function _0x409a39(_0x5afeeb) {
    const _0x4bc365 = _0x5afeeb["target"];
    if (_0x16837b && !_0x16837b['busy'] && !_0x47fe6a() && (_0x4bc365["dataset"]["replicationMerge"] || _0x4bc365["dataset"]["replicationPresence"])) {
      const _0x94f600 = _0x4bc365["dataset"]["replicationMerge"] ? mergeStoryReplicationCharacters(_0x16837b['token']['data'], _0x16837b["episode"], _0x4bc365["dataset"]["replicationMerge"], _0x4bc365['value']) : setStoryReplicationCharacterPresence(_0x16837b["token"]["data"], _0x16837b["episode"], {
        'characterId': _0x4bc365["dataset"]["replicationPresence"],
        'eventId': _0x4bc365["dataset"]['eventId'],
        'present': _0x4bc365["checked"]
      });
      if (_0x94f600) {
        _0x57c2df(_0x16837b);
        _0x35e34f({
          'preserveScroll': !![]
        });
      } else {
        _0x4bc365["dataset"]["replicationPresence"] && (_0x4bc365["checked"] = !_0x4bc365["checked"], _0x7117c7("角色至少保留一个出场片段；误检角色请直接删除。", 'warn'));
      }
      return;
    }
    if (!_0x16837b || _0x16837b['busy'] || _0x47fe6a() || !_0x4bc365["dataset"]["replicationEdit"]) {
      return;
    }
    const _0x3675b1 = editStoryReplicationSource(_0x16837b['token']["data"], _0x16837b["episode"], {
      'kind': _0x4bc365['dataset']['replicationEdit'],
      'id': _0x4bc365["dataset"]['id'],
      'field': _0x4bc365['dataset']["field"],
      'index': _0x4bc365["dataset"]["index"],
      'value': _0x4bc365['type'] === "checkbox" ? _0x4bc365["checked"] : _0x4bc365["value"]
    });
    if (_0x3675b1) {
      _0x57c2df(_0x16837b);
      _0x42632c();
      if (_0x4bc365['dataset']['field'] === 'name') {
        _0x4bc365["closest"]("[data-replication-character]")?.["querySelector"]("[data-replication-character-heading]")?.["replaceChildren"](_0x4bc365["value"]);
      }
    }
  }
  _0x413109['addEventListener']("click", _0x278b19);
  _0x413109['addEventListener']('change', _0x409a39);
  function _0x3905a8(_0x5b9248) {
    if (!_0x16837b || _0x5b9248['detail']["episodeId"] !== _0x16837b['episode']['id'] || !_0x9028bb(_0x16837b)) {
      return;
    }
    _0x100f25 !== _0x16837b['episode']['replication']['status'] && (_0x100f25 = _0x16837b['episode']["replication"]['status'], _0x35e34f());
    _0x42632c(_0x16837b['episode']["replication"]['message'] || _0x16837b["episode"]["replication"]["error"] || '');
  }
  _0x413109["addEventListener"]('story-replication-updated', _0x3905a8);
  return {
    'destroy'() {
      _0x1037f7 = !![];
      _0x35aeaa();
      _0x413109['removeEventListener']("click", _0x278b19);
      _0x413109["removeEventListener"]("change", _0x409a39);
      _0x413109['removeEventListener']("story-replication-updated", _0x3905a8);
    }
  };
}