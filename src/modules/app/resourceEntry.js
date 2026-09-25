import { buildImageNodeStorageFields } from '../../services/imageDerivativeService.js';
import { pickResultLocalPath, urlToLocalPath } from '../../utils/localMediaPath.js';
import { t } from '../../i18n/index.js';
export function registerResourceUploadEntry({
  store: _0x1abd0a,
  uploadFile: _0x261ff4,
  getBaseName: _0x2dbc41,
  getCurrentProjectId: _0x4c3f5f
}) {
  const _0x146785 = async _0x5af1c5 => {
    const _0x4e2362 = _0x5af1c5?.["detail"]?.['id'];
    const _0x9a0675 = _0x5af1c5?.["detail"]?.["file"];
    if (!_0x4e2362 || !_0x9a0675) {
      return;
    }
    const _0x35f2b1 = _0x1abd0a["getState"]()["nodes"][_0x4e2362];
    if (!_0x35f2b1) {
      return;
    }
    try {
      const _0x54ae13 = _0x4c3f5f?.() || 'default_v2_project';
      const _0xd6f5bd = await _0x261ff4(_0x9a0675, _0x54ae13);
      const _0x2813bc = _0x2dbc41(_0x9a0675["name"]);
      if (_0x2813bc) {
        _0x1abd0a['renameNode'](_0x4e2362, _0x2813bc);
      }
      const _0x1c033d = document["getElementById"](_0x4e2362);
      const _0x28238a = _0x1c033d?.['__v2_name_el'];
      if (_0x28238a && _0x2813bc) {
        _0x28238a['textContent'] = _0x2813bc;
      }
      const _0x1a7900 = _0xd6f5bd['url'];
      const _0x3689ca = pickResultLocalPath(_0xd6f5bd) || urlToLocalPath(_0x1a7900);
      _0x1abd0a['updateNodeData'](_0x4e2362, {
        'src': _0x1a7900,
        'localPath': _0x3689ca,
        'assetId': _0xd6f5bd["assetId"] || '',
        'originalLocalPath': _0xd6f5bd["originalLocalPath"] || _0xd6f5bd["localPath"] || '',
        'posterLocalPath': _0xd6f5bd['posterLocalPath'] || '',
        'waveformLocalPath': _0xd6f5bd["waveformLocalPath"] || '',
        'derivativeStatus': _0xd6f5bd["derivativeStatus"] || _0xd6f5bd["status"] || '',
        'mediaTaskId': _0xd6f5bd["mediaTaskId"] || '',
        'mediaTaskKind': _0xd6f5bd["mediaTaskKind"] || '',
        'mediaTaskStatus': _0xd6f5bd["mediaTaskStatus"] || '',
        'mediaTaskProgress': Number(_0xd6f5bd["mediaTaskProgress"] || 0x0) || 0x0,
        'mediaTaskError': _0xd6f5bd["mediaTaskError"] || '',
        ...buildImageNodeStorageFields(_0xd6f5bd),
        'fileName': _0x9a0675['name'] || _0xd6f5bd['filename']
      });
    } catch (_0x4a14e7) {
      console["error"]("上传失败:", _0x4a14e7);
      window["showToast"](t("previewUpload.uploadFailed"));
    }
  };
  window["addEventListener"]("v2:resource-upload", _0x146785);
  return () => window["removeEventListener"]('v2:resource-upload', _0x146785);
}