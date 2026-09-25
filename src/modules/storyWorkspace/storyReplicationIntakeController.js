import { renderStoryHomeComposerBody } from './storyHomePresentation.js';
import { syncStoryReplicationSelection } from './storyVideoReplicationPresentation.js';
import { resolveWorkspaceCardMultiSelection } from '../workspaceAssetSelection.js';
import { createStoryMarqueeSelectionController } from './storyMarqueeSelection.js';
export function syncStoryReplicationHomeSources(_0x18ee2f, _0x514800) {
  const _0x152910 = _0x18ee2f["querySelector"]('[data-story-replication-upload-list]');
  if (!_0x152910) {
    return;
  }
  const _0x1af93b = _0x18ee2f['ownerDocument']["createElement"]('template');
  _0x1af93b["innerHTML"] = renderStoryHomeComposerBody(_0x514800);
  const _0x260d15 = _0x1af93b["content"];
  const _0x1361ee = _0x260d15['querySelector']("[data-story-replication-upload-list]");
  const _0x438382 = new Map([..._0x152910["children"]]["map"](_0x53c7a4 => [_0x53c7a4["dataset"]["replicationSourceKey"], _0x53c7a4]));
  const _0x3ebedd = [..._0x1361ee["children"]];
  const _0x148d1f = new Set(_0x3ebedd["map"](_0x2dd968 => _0x2dd968["dataset"]["replicationSourceKey"]));
  const _0x3459bb = _0x152910["scrollTop"];
  for (const [_0x1634a5, _0x14f152] of _0x438382) {
    if (!_0x148d1f["has"](_0x1634a5)) {
      _0x14f152["remove"]();
    }
  }
  _0x3ebedd["forEach"]((_0xdc51f9, _0xa6337) => {
    const _0x51a508 = _0x438382["get"](_0xdc51f9["dataset"]["replicationSourceKey"]);
    const _0x36c591 = _0x51a508 || _0xdc51f9;
    _0x36c591['querySelector']("[data-story-replication-file-index]")["dataset"]["storyReplicationFileIndex"] = String(_0xa6337);
    if (_0x152910["children"][_0xa6337] !== _0x36c591) {
      _0x152910['insertBefore'](_0x36c591, _0x152910['children'][_0xa6337] || null);
    }
  });
  _0x152910["hidden"] = _0x1361ee["hidden"];
  _0x152910["scrollTop"] = _0x3459bb;
  _0x18ee2f['querySelector']('.story-replication-upload')["classList"]["toggle"]('has-sources', !_0x1361ee["hidden"]);
  _0x18ee2f["querySelector"](".story-replication-upload-empty")['hidden'] = !_0x1361ee["hidden"];
}
export function bindStoryReplicationIntake(_0xf52396, {
  state: _0x3abd80,
  analyze: _0x54e7a4,
  sync: _0x18ec39,
  persist: _0x431d0b
} = {}) {
  const _0x130e50 = _0xf52396["querySelector"]("[data-story-replication-grid]");
  const _0x4b286c = () => _0x3abd80["data"]['episodes']["filter"](_0x2c7eae => ["pending", "failed"]['includes'](_0x2c7eae['replication']?.["status"]));
  const _0x4c2dad = () => _0x3abd80["data"]["episodes"]['some'](_0x3451b2 => ['queued', "uploading", "analyzing"]['includes'](_0x3451b2["replication"]?.["status"]));
  const _0x5901b0 = () => syncStoryReplicationSelection(_0xf52396, _0x3abd80);
  const _0x2539e6 = _0x45eab5 => {
    _0x3abd80["replicationSelectionMode"] = !![];
    for (const _0x22db39 of _0x4b286c()) {
      _0x22db39["replication"]['selectedForAnalysis'] = _0x45eab5['includes'](_0x22db39['id']);
    }
    _0x5901b0();
    _0x18ec39();
    _0x431d0b();
  };
  const _0x4b00d4 = () => {
    _0x3abd80["replicationSelectionMode"] = ![];
    for (const _0x3d6093 of _0x3abd80["data"]['episodes']) {
      _0x3d6093["replication"]["selectedForAnalysis"] = ![];
    }
    _0x5901b0();
    _0x18ec39();
    _0x431d0b();
  };
  const _0x531a43 = _0x130e50 ? createStoryMarqueeSelectionController({
    'root': _0xf52396["closest"]('.story-workspace-root') || _0xf52396,
    'documentObject': _0xf52396["ownerDocument"],
    'windowObject': _0xf52396["ownerDocument"]["defaultView"],
    'surfaceSelector': "[data-story-replication-grid]",
    'itemSelector': ".story-replication-card:is(.is-pending, .is-failed)",
    'blockedControlSelector': 'button,\x20input,\x20select,\x20[draggable=\x27true\x27]',
    'getItemId': _0x492519 => _0x492519["dataset"]['storyReplicationEpisodeId'],
    'getConfig': () => ({
      'enabled': !_0x4c2dad(),
      'selectedIds': _0x4b286c()["filter"](_0x37c3e2 => _0x37c3e2['replication']["selectedForAnalysis"])["map"](_0x6e72fc => _0x6e72fc['id']),
      'commit': _0x2539e6
    })
  }) : null;
  const _0x1a3120 = _0x2430f2 => _0x531a43?.["begin"](_0x2430f2);
  const _0x45817c = _0x28f38b => {
    if (_0x28f38b["key"] === "Escape" && _0x3abd80["replicationSelectionMode"]) {
      _0x4b00d4();
    }
  };
  const _0x27983a = _0x2ec2a3 => {
    if (_0x531a43?.['consumeClick'](_0x2ec2a3)) {
      return;
    }
    const _0x35c6f6 = _0x2ec2a3["target"]['closest']("[data-replication-selection]");
    if (_0x35c6f6 && !_0x35c6f6["disabled"]) {
      const _0x59ae78 = _0x35c6f6['dataset']['replicationSelection'];
      if (_0x59ae78 === "all") {
        _0x2539e6(_0x4b286c()["every"](_0x4e9b40 => _0x4e9b40["replication"]["selectedForAnalysis"]) ? [] : _0x4b286c()["map"](_0x1bf917 => _0x1bf917['id']));
      } else {
        if (_0x59ae78 === 'cancel') {
          _0x4b00d4();
        } else {
          for (const _0x579a67 of _0x3abd80["data"]["episodes"]) {
            _0x579a67["replication"]["selectedForAnalysis"] = ![];
          }
          _0x3abd80["replicationSelectionMode"] = _0x59ae78 === "enter";
          _0x5901b0();
          _0x18ec39();
          _0x431d0b();
        }
      }
      return;
    }
    const _0x127412 = _0x2ec2a3['target']["closest"]("[data-replication-card-action]");
    if (_0x127412 && !_0x127412['disabled']) {
      const _0x53525c = _0x127412["dataset"]['replicationCardAction'];
      if (_0x3abd80["replicationSelectionMode"] || _0x2ec2a3["shiftKey"]) {
        if (!_0x4b286c()["some"](_0x2840c3 => _0x2840c3['id'] === _0x53525c) || _0x4c2dad()) {
          return;
        }
        _0x2ec2a3["stopImmediatePropagation"]();
        const _0x516887 = resolveWorkspaceCardMultiSelection({
          'selectedIds': _0x4b286c()["filter"](_0x3271ce => _0x3271ce["replication"]["selectedForAnalysis"])['map'](_0x54f11f => _0x54f11f['id']),
          'itemId': _0x53525c,
          'selectionMode': _0x3abd80["replicationSelectionMode"],
          'shiftKey': _0x2ec2a3["shiftKey"]
        });
        _0x2539e6(_0x516887['selectedIds']);
      } else {
        if (!_0x127412["hasAttribute"]("data-replication-open")) {
          void _0x54e7a4({
            'episodeId': _0x53525c
          });
        }
      }
      return;
    }
    const _0xed1463 = _0x2ec2a3['target']["closest"]("[data-replication-analyze], [data-story-action='analyze-all-replication']");
    if (!_0xed1463 || _0xed1463["disabled"]) {
      return;
    }
    void _0x54e7a4({
      'all': _0xed1463["dataset"]["replicationAnalyze"] === "all" || _0xed1463["dataset"]['storyAction'] === "analyze-all-replication"
    });
  };
  _0xf52396["addEventListener"]('click', _0x27983a);
  _0xf52396["addEventListener"]('pointerdown', _0x1a3120);
  _0xf52396["addEventListener"]("keydown", _0x45817c);
  _0xf52396['addEventListener']("story-replication-updated", _0x5901b0);
  _0x5901b0();
  return {
    'destroy'() {
      _0x531a43?.['destroy']();
      _0xf52396["removeEventListener"]("pointerdown", _0x1a3120);
      _0xf52396['removeEventListener']("keydown", _0x45817c);
      _0xf52396["removeEventListener"]('story-replication-updated', _0x5901b0);
      _0xf52396["removeEventListener"]("click", _0x27983a);
    }
  };
}