import { updateStoryReplicationReplacement } from './storyReplicationReplacement.js';
import { renderStoryReplicationAssetComparison } from './storyReplicationReplacementPresentation.js';
import { isStoryReplicationPromptStale } from './storyReplicationPromptFreshness.js';
import { bindStoryReplicationSelects } from './storyReplicationSelects.js';
export function bindStoryReplicationReplacements(_0x501397, {
  state: _0x281260,
  createProjectToken: _0xfc755e,
  isProjectTaskLive: _0x23b7b3,
  syncProjectEntry: _0x2864b7,
  schedulePersistence: _0xadc276
} = {}) {
  const _0x339fba = _0x501397["querySelector"]("[data-replication-replacements]");
  if (!_0x339fba) {
    return null;
  }
  const _0x59ea56 = bindStoryReplicationSelects(_0x339fba);
  const _0x35da2b = _0x501397['querySelector']("[data-replication-toggle-settings]");
  const _0x295480 = () => {
    _0x59ea56["close"]();
    _0x339fba["hidden"] = !_0x339fba['hidden'];
    _0x35da2b["setAttribute"]("aria-expanded", String(!_0x339fba['hidden']));
  };
  const _0x1a23fe = _0xfc755e();
  const _0x441d8e = _0x2933a6 => {
    const _0x3fca56 = _0x2933a6['target'];
    if (!_0x23b7b3(_0x1a23fe) || _0x281260['data'] !== _0x1a23fe['data']) {
      return;
    }
    if (!updateStoryReplicationReplacement(_0x1a23fe["data"], {
      'field': _0x3fca56["dataset"]["replicationReplacement"],
      'key': _0x3fca56["dataset"]["sourceKey"],
      'value': _0x3fca56["value"]
    })) {
      return;
    }
    _0x2864b7(_0x1a23fe);
    _0xadc276({
      'immediate': !![]
    });
    _0x501397["querySelectorAll"](".story-asset-card[data-story-asset-id]")['forEach'](_0x76fc8f => {
      const _0x524396 = _0x1a23fe["data"]["assets"]["find"](_0x49e29a => _0x49e29a['id'] === _0x76fc8f["dataset"]["storyAssetId"]);
      const _0x1a595a = _0x76fc8f["querySelector"]('.story-replacement-comparison');
      if (_0x524396 && _0x1a595a) {
        _0x1a595a['outerHTML'] = renderStoryReplicationAssetComparison(_0x281260, _0x524396);
      }
    });
    _0x339fba["querySelector"]("[data-replication-replacement-status]")['textContent'] = _0x1a23fe["data"]["episodes"]["some"](_0x135f51 => isStoryReplicationPromptStale(_0x1a23fe['data'], _0x135f51)) ? '替换设置已保存，已有分段提示词待更新；继续时可重新生成。' : "人物与语言设置已保存，将用于后续分段提示词。";
  };
  _0x339fba['addEventListener']('change', _0x441d8e);
  _0x35da2b?.["addEventListener"]("click", _0x295480);
  return {
    'destroy'() {
      _0x59ea56['destroy']();
      _0x35da2b?.["removeEventListener"]("click", _0x295480);
      _0x339fba["removeEventListener"]("change", _0x441d8e);
    }
  };
}