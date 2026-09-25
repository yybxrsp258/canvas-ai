import { THUMBNAIL, IMAGE_COMPRESSION } from '../utils/constants.js';
import { fetchRemoteBlob } from '../../api/projectsV2Api.js';
export async function generateThumbnail(_0x488d2c, _0xe331c8 = THUMBNAIL["maxWidth"], _0x54fab0 = THUMBNAIL["maxHeight"]) {
  if (!_0x488d2c) {
    return '';
  }
  return new Promise(_0x48ee0a => {
    const _0x34bad7 = new Image();
    _0x34bad7["crossOrigin"] = "anonymous";
    _0x34bad7["onload"] = () => {
      const _0x15e6a3 = document["createElement"]("canvas");
      const _0x358cd4 = _0x15e6a3["getContext"]('2d');
      let _0x560974 = _0x34bad7['naturalWidth'];
      let _0x427502 = _0x34bad7["naturalHeight"];
      _0x560974 > _0x427502 ? _0x560974 > _0xe331c8 && (_0x427502 *= _0xe331c8 / _0x560974, _0x560974 = _0xe331c8) : _0x427502 > _0x54fab0 && (_0x560974 *= _0x54fab0 / _0x427502, _0x427502 = _0x54fab0);
      _0x15e6a3["width"] = _0x560974;
      _0x15e6a3["height"] = _0x427502;
      _0x358cd4['drawImage'](_0x34bad7, 0x0, 0x0, _0x560974, _0x427502);
      const _0x578380 = _0x15e6a3["toDataURL"](THUMBNAIL["format"], THUMBNAIL["quality"]);
      _0x15e6a3["width"] = 0x0;
      _0x15e6a3["height"] = 0x0;
      _0x48ee0a(_0x578380);
    };
    _0x34bad7['onerror'] = () => {
      _0x48ee0a('');
    };
    _0x34bad7["src"] = _0x488d2c;
  });
}
export async function compressImage(_0x36efe9, _0x363d69 = IMAGE_COMPRESSION["maxDimension"], _0x1b0dbe = IMAGE_COMPRESSION["quality"]) {
  return new Promise((_0x560bf8, _0x137536) => {
    const _0x5ad118 = new Image();
    let _0x58fdb5 = '';
    let _0xef6d63;
    const _0x59fa60 = (_0x270176, _0x194d0d) => {
      _0x5ad118["onload"] = null;
      _0x5ad118["onerror"] = null;
      if (_0x58fdb5) {
        URL["revokeObjectURL"](_0x58fdb5);
      }
      _0x58fdb5 = '';
      _0xef6d63 && (_0xef6d63["width"] = 0x0, _0xef6d63["height"] = 0x0);
      if (_0x270176) {
        _0x137536(_0x270176);
      } else {
        _0x560bf8(_0x194d0d);
      }
    };
    _0x5ad118["crossOrigin"] = "Anonymous";
    _0x5ad118["onload"] = () => {
      try {
        let {
          width: _0x538791,
          height: _0x264846
        } = _0x5ad118;
        (_0x538791 > _0x363d69 || _0x264846 > _0x363d69) && (_0x538791 > _0x264846 ? (_0x264846 = Math['round'](_0x264846 * _0x363d69 / _0x538791), _0x538791 = _0x363d69) : (_0x538791 = Math['round'](_0x538791 * _0x363d69 / _0x264846), _0x264846 = _0x363d69));
        _0xef6d63 = document["createElement"]("canvas");
        _0xef6d63["width"] = _0x538791;
        _0xef6d63["height"] = _0x264846;
        const _0x55c42c = _0xef6d63["getContext"]('2d');
        _0x55c42c['drawImage'](_0x5ad118, 0x0, 0x0, _0x538791, _0x264846);
        _0xef6d63['toBlob'](_0xdb58ca => {
          _0xdb58ca ? _0x59fa60(null, _0xdb58ca) : _0x59fa60(new Error("Canvas toBlob failed"));
        }, IMAGE_COMPRESSION["format"], _0x1b0dbe);
      } catch (_0x3c31f0) {
        _0x59fa60(_0x3c31f0);
      }
    };
    _0x5ad118["onerror"] = _0x46d02d => {
      console["warn"]('[imageUtils.js]\x20跨域或加载失败，跳过本地压缩', _0x46d02d);
      _0x59fa60(_0x46d02d);
    };
    fetchRemoteBlob(_0x36efe9)["then"](_0x37cd37 => {
      _0x58fdb5 = URL["createObjectURL"](_0x37cd37);
      _0x5ad118["src"] = _0x58fdb5;
    })['catch'](_0x3d5ff4 => {
      _0x5ad118["src"] = _0x36efe9;
    });
  });
}