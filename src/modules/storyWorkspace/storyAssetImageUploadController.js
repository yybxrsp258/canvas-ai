import { uploadFile } from '../../services/projectService.js';
import { buildCanvasLocalImageFields } from '../../services/canvasMediaLocalService.js';
import { ensureStoryAssetBaseAppearance, getStoryAssetAppearances, normalizeStoryAssetAppearance } from './storyAssetAppearances.js';
import { buildStoryBackgroundTaskId } from './storyBackgroundTasks.js';
export function createStoryAssetImageUploadController({
  state: _0x2e1e72,
  createProjectToken: _0x3ba20,
  isProjectTaskLive: _0x17b704,
  isProjectTaskCurrent: _0x40f738,
  getSelectedAppearance: _0x50d6a3,
  isLoading: _0x4e0425,
  setGenerating: _0x234771,
  startTask: _0x2239c7,
  finishTask: _0x95b065,
  applyImageResult: _0x341a82,
  refresh: _0x3fd5d7,
  showToast: _0x2e4a01,
  saveFile = uploadFile
} = {}) {
  const _0x560a64 = new Set();
  const _0x3bdadb = (_0x5f3445, {
    appendAppearance = ![]
  } = {}) => {
    const _0x496579 = _0x3ba20();
    const _0x56f393 = _0x496579["data"]?.["assets"]?.["find"](_0x1e6479 => _0x1e6479['id'] === _0x5f3445);
    return {
      'projectToken': _0x496579,
      'assetId': _0x5f3445,
      'appearanceId': _0x56f393 && _0x50d6a3(_0x2e1e72, _0x56f393)?.['id'],
      'appendAppearance': appendAppearance && _0x496579["data"]?.['project']?.["sourceMode"] === "video-replication" && _0x56f393?.['kind'] === "character"
    };
  };
  async function _0x2994bc(_0x373c79, _0x78ad8b) {
    if (!_0x373c79 || !_0x78ad8b) {
      return ![];
    }
    if (!/^image\//iu['test'](_0x373c79["type"] || '') && !/\.(png|jpe?g|webp|gif|bmp|avif|svg|tiff?|heic|heif)$/iu['test'](_0x373c79["name"] || '')) {
      _0x2e4a01('请拖入图片文件。', "warn");
      return ![];
    }
    const {
      projectToken: _0x249f7f,
      assetId: _0x1eaf59,
      appearanceId: _0x3019c9
    } = _0x78ad8b;
    const _0x3d2a8a = _0x249f7f["data"]?.["assets"]?.["find"](_0x285c73 => _0x285c73['id'] === _0x1eaf59);
    const _0x44e081 = getStoryAssetAppearances(_0x3d2a8a)["find"](_0x40cf65 => _0x40cf65['id'] === _0x3019c9);
    if (!_0x3d2a8a || _0x3d2a8a["isLibraryAsset"] || !_0x44e081 || !_0x17b704(_0x249f7f)) {
      return ![];
    }
    const _0x4e4519 = _0x249f7f["projectId"] + ':' + _0x1eaf59 + ':' + _0x3019c9;
    if (_0x560a64["has"](_0x4e4519) || _0x40f738(_0x249f7f) && _0x4e0425(_0x2e1e72, _0x1eaf59, _0x3019c9)) {
      _0x2e4a01("请等待当前生成或上传任务完成。", "info");
      return ![];
    }
    _0x560a64["add"](_0x4e4519);
    const _0x2a9fda = buildStoryBackgroundTaskId('asset-image-upload', {
      'assetId': _0x1eaf59,
      'appearanceId': _0x3019c9
    });
    const _0x26cd70 = () => _0x17b704(_0x249f7f) && _0x249f7f["data"]?.['assets']?.["includes"](_0x3d2a8a) && getStoryAssetAppearances(_0x3d2a8a)["includes"](_0x44e081);
    _0x40f738(_0x249f7f) && (_0x234771(_0x2e1e72, _0x1eaf59, _0x3019c9, !![]), _0x3fd5d7(_0x1eaf59));
    _0x2239c7(_0x249f7f, {
      'id': _0x2a9fda,
      'type': "asset-image-upload",
      'scope': {
        'assetId': _0x1eaf59,
        'appearanceId': _0x3019c9
      },
      'label': '上传' + (_0x3d2a8a["name"] || '素材') + '图片',
      'message': "正在保存本地图片"
    });
    try {
      const _0x13d65f = await saveFile(_0x373c79, _0x249f7f["projectId"]);
      if (!_0x26cd70()) {
        if (_0x17b704(_0x249f7f)) {
          _0x95b065(_0x249f7f, _0x2a9fda, {
            'status': "cancelled",
            'message': "目标形象已移除"
          });
        }
        return ![];
      }
      const _0x460f75 = _0x78ad8b["appendAppearance"] ? normalizeStoryAssetAppearance({
        'id': _0x1eaf59 + "-upload-" + crypto["randomUUID"](),
        'sourceOrigin': "upload",
        'prompt': _0x44e081["prompt"],
        'description': _0x44e081["description"]
      }, {
        'assetId': _0x1eaf59,
        'index': _0x3d2a8a["appearances"]["length"]
      }) : _0x44e081;
      _0x341a82(_0x3d2a8a, _0x460f75, buildCanvasLocalImageFields(_0x13d65f));
      if (_0x78ad8b["appendAppearance"]) {
        _0x3d2a8a["appearances"]["push"](_0x460f75);
        ensureStoryAssetBaseAppearance(_0x3d2a8a);
        if (_0x40f738(_0x249f7f)) {
          _0x2e1e72["assetAppearanceIndexes"] = {
            ..._0x2e1e72["assetAppearanceIndexes"],
            [_0x1eaf59]: _0x3d2a8a["appearances"]["length"] - 0x1
          };
        }
      }
      _0x95b065(_0x249f7f, _0x2a9fda, {
        'status': 'succeeded',
        'message': '本地图片已保存'
      });
      return !![];
    } catch (_0x2fda99) {
      if (!_0x17b704(_0x249f7f)) {
        return ![];
      }
      _0x95b065(_0x249f7f, _0x2a9fda, {
        'status': "failed",
        'message': '本地图片保存失败',
        'error': _0x2fda99?.["message"] || '素材保存失败，请稍后重试。'
      });
      if (_0x40f738(_0x249f7f)) {
        _0x2e4a01(_0x2fda99?.["message"] || "素材保存失败，请稍后重试。", "error");
      }
      return ![];
    } finally {
      _0x560a64["delete"](_0x4e4519);
      _0x40f738(_0x249f7f) && (_0x234771(_0x2e1e72, _0x1eaf59, _0x3019c9, ![]), _0x3fd5d7(_0x1eaf59));
    }
  }
  return {
    'capture': _0x3bdadb,
    'upload': _0x2994bc
  };
}
export function bindStoryAssetImageDrop(_0xfe5d8b, {
  state: _0x59e1e6,
  capture: _0x51e22e,
  upload: _0x34517f
} = {}) {
  let _0xd38c01 = null;
  const _0x48495b = () => {
    _0xd38c01?.['classList']["remove"]('is-image-drop-target');
    _0xd38c01 = null;
  };
  const _0x9b6d69 = _0x4a869c => {
    if (_0x59e1e6['view'] !== "project" || _0x59e1e6["step"] !== 0x2 || _0x59e1e6["assetFilter"] === "library") {
      return null;
    }
    const _0x5df867 = _0x4a869c["target"]["closest"]?.("[data-story-asset-id]") || _0x4a869c["target"]['closest']?.('.story-asset-card-shell')?.["querySelector"]('[data-story-asset-id]');
    if (!_0x5df867 || !_0xfe5d8b["contains"](_0x5df867)) {
      return null;
    }
    const _0x38c26c = _0x59e1e6["data"]?.["assets"]?.["find"](_0x2e30fe => _0x2e30fe['id'] === _0x5df867['dataset']["storyAssetId"]);
    return _0x38c26c && !_0x38c26c["isLibraryAsset"] ? _0x5df867 : null;
  };
  const _0x2e51d5 = _0x245d04 => {
    const _0x541db5 = _0x9b6d69(_0x245d04);
    if (!_0x541db5 || !Array["from"](_0x245d04["dataTransfer"]?.["types"] || [])["includes"]('Files')) {
      return;
    }
    _0x245d04["preventDefault"]();
    _0x245d04['stopPropagation']();
    _0x245d04["dataTransfer"]["dropEffect"] = "copy";
    _0xd38c01 !== _0x541db5 && (_0x48495b(), _0xd38c01 = _0x541db5, _0x541db5['classList']["add"]("is-image-drop-target"));
  };
  const _0x5027a3 = _0x4a7e0c => {
    if (_0xd38c01 && !_0xd38c01["contains"](_0x4a7e0c["relatedTarget"])) {
      _0x48495b();
    }
  };
  const _0x1892cb = _0x396bfa => {
    const _0x3fdf82 = _0x9b6d69(_0x396bfa);
    _0x48495b();
    if (!_0x3fdf82 || !_0x396bfa["dataTransfer"]?.["files"]?.["length"]) {
      return;
    }
    _0x396bfa['preventDefault']();
    _0x396bfa["stopPropagation"]();
    const _0x1882ea = _0x51e22e(_0x3fdf82["dataset"]["storyAssetId"], {
      'appendAppearance': !![]
    });
    void _0x34517f(_0x396bfa["dataTransfer"]["files"][0x0], _0x1882ea);
  };
  _0xfe5d8b["addEventListener"]("dragover", _0x2e51d5, !![]);
  _0xfe5d8b['addEventListener']('dragleave', _0x5027a3, !![]);
  _0xfe5d8b["addEventListener"]("drop", _0x1892cb, !![]);
  return {
    'destroy'() {
      _0x48495b();
      _0xfe5d8b["removeEventListener"]('dragover', _0x2e51d5, !![]);
      _0xfe5d8b['removeEventListener']("dragleave", _0x5027a3, !![]);
      _0xfe5d8b['removeEventListener']("drop", _0x1892cb, !![]);
    }
  };
}