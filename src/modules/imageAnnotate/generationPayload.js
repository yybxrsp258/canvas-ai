const canvasToBlob = (_0x196522, _0x2d571d) => new Promise(_0x2d1001 => _0x196522["toBlob"](_0x2d1001, _0x2d571d));
const createSceneCanvas = ({
  documentRef: _0x3af993,
  naturalW: _0x180890,
  naturalH: _0x2ea616
}) => {
  const _0x3a9722 = _0x3af993["createElement"]("canvas");
  _0x3a9722["width"] = _0x180890;
  _0x3a9722['height'] = _0x2ea616;
  return _0x3a9722;
};
const buildEraseInputCanvas = ({
  documentRef: _0x44e978,
  loaded: _0x43eac8,
  maskCanvas: _0x587f81,
  naturalW: _0x3e6efa,
  naturalH: _0x42e204
}) => {
  const _0x5ebc98 = createSceneCanvas({
    'documentRef': _0x44e978,
    'naturalW': _0x3e6efa,
    'naturalH': _0x42e204
  });
  const _0x13a254 = _0x5ebc98["getContext"]('2d');
  _0x13a254["drawImage"](_0x43eac8, 0x0, 0x0, _0x3e6efa, _0x42e204);
  const _0x5ccdcf = createSceneCanvas({
    'documentRef': _0x44e978,
    'naturalW': _0x3e6efa,
    'naturalH': _0x42e204
  });
  const _0x57ed75 = _0x5ccdcf["getContext"]('2d');
  _0x57ed75["fillStyle"] = "#00FF00";
  _0x57ed75["fillRect"](0x0, 0x0, _0x3e6efa, _0x42e204);
  _0x57ed75["save"]();
  _0x57ed75["globalCompositeOperation"] = "destination-in";
  _0x57ed75["drawImage"](_0x587f81, 0x0, 0x0);
  _0x57ed75["restore"]();
  _0x13a254["drawImage"](_0x5ccdcf, 0x0, 0x0);
  return _0x5ebc98;
};
const buildRepaintInputCanvas = ({
  documentRef: _0x32a91d,
  loaded: _0x2341e8,
  maskCanvas: _0x19bd56,
  naturalW: _0x1e93c3,
  naturalH: _0x3ad7b4
}) => {
  const _0x8c7fdd = createSceneCanvas({
    'documentRef': _0x32a91d,
    'naturalW': _0x1e93c3,
    'naturalH': _0x3ad7b4
  });
  const _0x3d286e = _0x8c7fdd["getContext"]('2d');
  _0x3d286e["drawImage"](_0x2341e8, 0x0, 0x0, _0x1e93c3, _0x3ad7b4);
  _0x3d286e["save"]();
  _0x3d286e["globalCompositeOperation"] = "destination-out";
  _0x3d286e["drawImage"](_0x19bd56, 0x0, 0x0);
  _0x3d286e["restore"]();
  return _0x8c7fdd;
};
export const buildGenerationPayload = async ({
  scene: _0x196e40,
  commands: _0x4329b2,
  promptText: _0x2709ef,
  node: _0xfd2f8b,
  imgUrl: _0xce7c9e,
  model: _0x4f7300,
  provider: _0x42b707,
  imageSize: _0x5b42ff,
  erasePrompt: _0x2a35a3,
  loadImage: _0x4a18fe,
  createSelectionMaskCanvas: _0x75437,
  getModelProvider: _0x364891,
  notify = () => {},
  documentRef = null,
  urlApi = null
} = {}) => {
  const _0x4d5d64 = documentRef || globalThis["document"];
  const _0xb88d2 = urlApi || globalThis["URL"];
  const _0x5b0d4c = Array['isArray'](_0x4329b2) ? _0x4329b2 : [];
  if (_0x196e40 === "erase") {
    if (!_0x5b0d4c["length"]) {
      notify("请先涂抹要消除的区域", "warn");
      return null;
    }
    const _0x441fd5 = await _0x4a18fe(_0xce7c9e);
    const _0x1e6762 = _0x441fd5['naturalWidth'] || _0x441fd5['width'];
    const _0x5da94c = _0x441fd5["naturalHeight"] || _0x441fd5["height"];
    const _0x11297e = _0x1e6762 / (_0xfd2f8b?.["width"] || 0x1);
    const _0x4070b2 = _0x5da94c / (_0xfd2f8b?.["height"] || 0x1);
    const _0x2bf357 = _0x75437(_0x1e6762, _0x5da94c, _0x11297e, _0x4070b2);
    const _0x1bb4b8 = buildEraseInputCanvas({
      'documentRef': _0x4d5d64,
      'loaded': _0x441fd5,
      'maskCanvas': _0x2bf357,
      'naturalW': _0x1e6762,
      'naturalH': _0x5da94c
    });
    const _0x356333 = await canvasToBlob(_0x1bb4b8, "image/png");
    if (!_0x356333) {
      throw new Error("消除输入图导出失败");
    }
    const _0x3a252e = _0xb88d2["createObjectURL"](_0x356333);
    return {
      'payload': {
        'prompt': _0x2a35a3,
        'model': _0x4f7300,
        'provider': _0x42b707 || _0x364891(_0x4f7300),
        'imageSize': _0x5b42ff || '1K',
        'batchSize': 0x1,
        'inputUrls': [_0x3a252e],
        'suppressAspectRatio': !![]
      },
      'inputUrl': _0x3a252e,
      'naturalWidth': _0x1e6762,
      'naturalHeight': _0x5da94c
    };
  }
  if (_0x196e40 === "repaint") {
    const _0x3bc455 = String(_0x2709ef || '')["trim"]();
    if (!_0x5b0d4c['length']) {
      notify("请先选中要重绘的区域", 'warn');
      return null;
    }
    if (!_0x3bc455) {
      notify("请输入重绘提示词", "warn");
      return null;
    }
    const _0x37594b = await _0x4a18fe(_0xce7c9e);
    const _0x31a636 = _0x37594b['naturalWidth'] || _0x37594b["width"];
    const _0x113123 = _0x37594b['naturalHeight'] || _0x37594b["height"];
    const _0x112a99 = _0x31a636 / (_0xfd2f8b?.["width"] || 0x1);
    const _0x42a2e7 = _0x113123 / (_0xfd2f8b?.["height"] || 0x1);
    const _0xba3e08 = _0x75437(_0x31a636, _0x113123, _0x112a99, _0x42a2e7);
    const _0x3b1dd2 = buildRepaintInputCanvas({
      'documentRef': _0x4d5d64,
      'loaded': _0x37594b,
      'maskCanvas': _0xba3e08,
      'naturalW': _0x31a636,
      'naturalH': _0x113123
    });
    const _0x28a7d8 = await canvasToBlob(_0x3b1dd2, "image/png");
    if (!_0x28a7d8) {
      throw new Error('重绘输入图导出失败');
    }
    const _0x3f1c5b = _0xb88d2['createObjectURL'](_0x28a7d8);
    return {
      'payload': {
        'prompt': _0x3bc455,
        'model': _0x4f7300,
        'provider': _0x42b707 || _0x364891(_0x4f7300),
        'imageSize': _0x5b42ff || '1K',
        'batchSize': 0x1,
        'inputUrls': [_0x3f1c5b],
        'suppressAspectRatio': !![]
      },
      'inputUrl': _0x3f1c5b,
      'naturalWidth': _0x31a636,
      'naturalHeight': _0x113123
    };
  }
  return null;
};