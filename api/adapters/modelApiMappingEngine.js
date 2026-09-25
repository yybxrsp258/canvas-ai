function isPlainObject(_0xd85725) {
  return !!_0xd85725 && typeof _0xd85725 === "object" && !Array["isArray"](_0xd85725);
}
function isPresentValue(_0x566a62) {
  if (_0x566a62 === undefined || _0x566a62 === null) {
    return ![];
  }
  if (typeof _0x566a62 === "string") {
    return _0x566a62["trim"]() !== '';
  }
  if (Array["isArray"](_0x566a62)) {
    return _0x566a62["length"] > 0x0;
  }
  return !![];
}
export function getPathValue(_0x23dea3, _0x13fb37) {
  const _0x42d19e = String(_0x13fb37 || '')["trim"]();
  if (!_0x42d19e) {
    return undefined;
  }
  return _0x42d19e['split']('.')["reduce"]((_0x4fbe82, _0x59acce) => {
    if (_0x4fbe82 === undefined || _0x4fbe82 === null) {
      return undefined;
    }
    return _0x4fbe82[_0x59acce];
  }, _0x23dea3);
}
export function setPathValue(_0x2bf397, _0x44ad50, _0x3ab834) {
  const _0x41b57a = String(_0x44ad50 || '')["trim"]();
  if (!_0x41b57a) {
    return _0x2bf397;
  }
  const _0x3cbd58 = _0x41b57a["split"]('.')["filter"](Boolean);
  if (_0x3cbd58["length"] === 0x0) {
    return _0x2bf397;
  }
  let _0x1b493b = _0x2bf397;
  for (let _0x33102d = 0x0; _0x33102d < _0x3cbd58["length"] - 0x1; _0x33102d += 0x1) {
    const _0x392111 = _0x3cbd58[_0x33102d];
    if (!isPlainObject(_0x1b493b[_0x392111])) {
      _0x1b493b[_0x392111] = {};
    }
    _0x1b493b = _0x1b493b[_0x392111];
  }
  _0x1b493b[_0x3cbd58[_0x3cbd58["length"] - 0x1]] = _0x3ab834;
  return _0x2bf397;
}
function normalizeFieldList(_0x57321c) {
  const _0x117797 = _0x57321c?.["fields"] !== undefined ? _0x57321c['fields'] : _0x57321c?.['field'];
  const _0x415541 = Array["isArray"](_0x117797) ? _0x117797 : [_0x117797];
  return _0x415541["map"](_0x173243 => String(_0x173243 || '')["trim"]())["filter"](Boolean);
}
function resolveFirstPayloadValue(_0x708bae, _0x38d450) {
  for (const _0x93bc4e of _0x38d450) {
    const _0x6a828 = getPathValue(_0x708bae, _0x93bc4e);
    if (isPresentValue(_0x6a828)) {
      return _0x6a828;
    }
  }
  return undefined;
}
function valuesEqual(_0x180c12, _0x5205a1) {
  if (typeof _0x5205a1 === "boolean") {
    const _0x2aec4c = String(_0x180c12 ?? '')["trim"]()["toLowerCase"]();
    return _0x180c12 === _0x5205a1 || _0x2aec4c === String(_0x5205a1);
  }
  if (typeof _0x5205a1 === "number") {
    return Number(_0x180c12) === _0x5205a1;
  }
  return String(_0x180c12 ?? '')["trim"]() === String(_0x5205a1 ?? '')["trim"]();
}
function evaluateWhenRule(_0x3a0f99, _0x4eddca) {
  if (!_0x3a0f99 || typeof _0x3a0f99 !== "object") {
    return !![];
  }
  const _0x337212 = _0x3a0f99["field"] ? resolveFirstPayloadValue(_0x4eddca["payload"] || {}, normalizeFieldList({
    'field': _0x3a0f99["field"]
  })) : undefined;
  const _0x407725 = isPresentValue(_0x337212);
  if (Object['prototype']["hasOwnProperty"]["call"](_0x3a0f99, "exists")) {
    if (Boolean(_0x3a0f99["exists"]) !== _0x407725) {
      return ![];
    }
  }
  if (_0x3a0f99['truthy'] === !![] && !Boolean(_0x337212)) {
    return ![];
  }
  if (_0x3a0f99["falsy"] === !![] && Boolean(_0x337212)) {
    return ![];
  }
  if (Object["prototype"]['hasOwnProperty']["call"](_0x3a0f99, "equals") && !valuesEqual(_0x337212, _0x3a0f99["equals"])) {
    return ![];
  }
  if (Object["prototype"]["hasOwnProperty"]["call"](_0x3a0f99, "notEquals") && valuesEqual(_0x337212, _0x3a0f99["notEquals"])) {
    return ![];
  }
  if (Array["isArray"](_0x3a0f99['in']) && !_0x3a0f99['in']["some"](_0x4ae827 => valuesEqual(_0x337212, _0x4ae827))) {
    return ![];
  }
  if (Array["isArray"](_0x3a0f99["notIn"]) && _0x3a0f99["notIn"]["some"](_0x28ff83 => valuesEqual(_0x337212, _0x28ff83))) {
    return ![];
  }
  return !![];
}
function shouldApplyEntry(_0x379ad8, _0x273c23) {
  if (!_0x379ad8?.["when"]) {
    return !![];
  }
  if (Array["isArray"](_0x379ad8["when"])) {
    return _0x379ad8["when"]["every"](_0x1b4153 => evaluateWhenRule(_0x1b4153, _0x273c23));
  }
  return evaluateWhenRule(_0x379ad8["when"], _0x273c23);
}
function normalizeMappingEntries(_0x2f419e) {
  if (Array["isArray"](_0x2f419e)) {
    return _0x2f419e;
  }
  if (Array["isArray"](_0x2f419e?.["entries"])) {
    return _0x2f419e['entries'];
  }
  return [];
}
function resolveEntrySourceValue(_0x542369, _0x268a56) {
  const _0x35bff0 = String(_0x542369?.["from"] || '')["trim"]();
  if (_0x35bff0 === "prompt") {
    return _0x268a56["finalPrompt"] || '';
  }
  if (_0x35bff0 === "param") {
    return resolveFirstPayloadValue(_0x268a56["payload"] || {}, normalizeFieldList(_0x542369));
  }
  if (_0x35bff0 === "inputImages") {
    return _0x268a56["inputImages"] || [];
  }
  if (_0x35bff0 === "inputVideos") {
    return _0x268a56["inputVideos"] || [];
  }
  if (_0x35bff0 === "inputAudios") {
    return _0x268a56["inputAudios"] || [];
  }
  if (_0x35bff0 === "model") {
    return _0x268a56['modelToken'] || '';
  }
  if (_0x35bff0 === "constant") {
    return Object["prototype"]["hasOwnProperty"]["call"](_0x542369, "value") ? _0x542369['value'] : _0x542369["defaultValue"];
  }
  return undefined;
}
function normalizeTransformList(_0x44139b) {
  if (!_0x44139b) {
    return [];
  }
  return Array["isArray"](_0x44139b) ? _0x44139b : [_0x44139b];
}
async function applyTransforms(_0x347829, _0x1591e3, _0x4a5a2d, _0x55e13c) {
  let _0x290737 = _0x347829;
  for (const _0x47bffa of normalizeTransformList(_0x1591e3?.["transform"])) {
    const _0xf6b2ee = typeof _0x47bffa === 'string' ? {
      'name': _0x47bffa
    } : isPlainObject(_0x47bffa) ? _0x47bffa : {
      'name': ''
    };
    const _0x297a7d = String(_0xf6b2ee["name"] || '')["trim"]();
    if (!_0x297a7d) {
      continue;
    }
    const _0x467c8c = _0x55e13c?.[_0x297a7d];
    if (typeof _0x467c8c !== "function") {
      throw new Error("Unsupported model API bodyMapping transform: " + _0x297a7d);
    }
    _0x290737 = await _0x467c8c(_0x290737, {
      'entry': _0x1591e3,
      'context': _0x4a5a2d,
      'spec': _0xf6b2ee
    });
  }
  return _0x290737;
}
export async function buildBodyFromMapping({
  bodyMapping: _0x5e30c5,
  context: _0xf9b2da,
  transforms = {}
}) {
  const _0x4ac36d = {};
  const _0x1e9f16 = normalizeMappingEntries(_0x5e30c5);
  const _0xfd8083 = {
    ..._0xf9b2da,
    'body': _0x4ac36d
  };
  for (const _0x3b36c0 of _0x1e9f16) {
    if (!_0x3b36c0?.["path"] || !shouldApplyEntry(_0x3b36c0, _0xfd8083)) {
      continue;
    }
    let _0x25d51a = resolveEntrySourceValue(_0x3b36c0, _0xfd8083);
    !isPresentValue(_0x25d51a) && Object["prototype"]["hasOwnProperty"]['call'](_0x3b36c0, 'defaultValue') && (_0x25d51a = _0x3b36c0["defaultValue"]);
    _0x25d51a = await applyTransforms(_0x25d51a, _0x3b36c0, _0xfd8083, transforms);
    if (_0x3b36c0["omitWhenEmpty"] === !![] && !isPresentValue(_0x25d51a)) {
      continue;
    }
    setPathValue(_0x4ac36d, _0x3b36c0["path"], _0x25d51a);
  }
  return _0x4ac36d;
}
function collectValuesByPath(_0x1b8e6f, _0x2e7c5a) {
  const _0x58606d = String(_0x2e7c5a || '')["trim"]()['split']('.')["filter"](Boolean);
  if (_0x58606d["length"] === 0x0) {
    return [];
  }
  const _0x450bca = (_0x1a5b6a, _0x3b24d6) => {
    if (_0x1a5b6a === undefined || _0x1a5b6a === null) {
      return [];
    }
    if (_0x3b24d6 >= _0x58606d["length"]) {
      return Array['isArray'](_0x1a5b6a) ? _0x1a5b6a : [_0x1a5b6a];
    }
    const _0x43ff71 = _0x58606d[_0x3b24d6];
    if (_0x43ff71["endsWith"]('[]')) {
      const _0x246ba8 = _0x43ff71['slice'](0x0, -0x2);
      const _0x521282 = _0x246ba8 ? _0x1a5b6a?.[_0x246ba8] : _0x1a5b6a;
      if (!Array["isArray"](_0x521282)) {
        return [];
      }
      return _0x521282['flatMap'](_0x576e6b => _0x450bca(_0x576e6b, _0x3b24d6 + 0x1));
    }
    return _0x450bca(_0x1a5b6a?.[_0x43ff71], _0x3b24d6 + 0x1);
  };
  return _0x450bca(_0x1b8e6f, 0x0)["flatMap"](_0x372255 => Array["isArray"](_0x372255) ? _0x372255 : [_0x372255]);
}
export function resolveMappedResponseValues(_0x30f8b5, _0x559f61 = []) {
  const _0x1f48ca = Array["isArray"](_0x559f61) ? _0x559f61 : [_0x559f61];
  const _0x557fa9 = [];
  for (const _0x4bd7c6 of _0x1f48ca) {
    for (const _0x7ec361 of collectValuesByPath(_0x30f8b5, _0x4bd7c6)) {
      if (_0x7ec361 && typeof _0x7ec361 === "object") {
        const _0x52a9b2 = _0x7ec361["url"] || _0x7ec361["imageUrl"] || _0x7ec361["image_url"] || _0x7ec361["videoUrl"] || _0x7ec361["video_url"] || _0x7ec361['fileUrl'];
        if (_0x52a9b2) {
          _0x557fa9["push"](String(_0x52a9b2)["trim"]());
        }
        continue;
      }
      const _0x3efb23 = String(_0x7ec361 ?? '')["trim"]();
      if (_0x3efb23) {
        _0x557fa9["push"](_0x3efb23);
      }
    }
  }
  return Array["from"](new Set(_0x557fa9["filter"](Boolean)));
}
function normalizeImageMimeType(_0x5ac923, _0x3acb65 = "image/png") {
  const _0x49b9ab = String(_0x5ac923 || '')['trim']()["toLowerCase"]();
  if (/^image\/[a-z0-9.+-]{1,64}$/['test'](_0x49b9ab)) {
    return _0x49b9ab;
  }
  const _0x46a30f = String(_0x3acb65 || '')["trim"]()["toLowerCase"]();
  return /^image\/[a-z0-9.+-]{1,64}$/["test"](_0x46a30f) ? _0x46a30f : "image/png";
}
function normalizeImageBase64DataUrl(_0x16c274, _0x2e9ca3) {
  const _0x149151 = String(_0x16c274 || '')['trim']();
  if (/^data:image\/[a-z0-9.+-]{1,64};base64,[a-z0-9+/=_-]+$/i["test"](_0x149151)) {
    return _0x149151;
  }
  const _0x269a65 = _0x149151["replace"](/\s+/g, '');
  if (!_0x269a65 || !/^[a-z0-9+/=_-]+$/i["test"](_0x269a65)) {
    return '';
  }
  try {
    const _0xc5c351 = atob(_0x269a65["slice"](0x0, 0x18)["replace"](/-/g, '+')["replace"](/_/g, '/'));
    if (_0xc5c351["startsWith"]('ÿØÿ')) {
      _0x2e9ca3 = "image/jpeg";
    } else {
      if (_0xc5c351["startsWith"]("PNG\r\n\n")) {
        _0x2e9ca3 = "image/png";
      } else {
        if (/^GIF8[79]a/["test"](_0xc5c351)) {
          _0x2e9ca3 = 'image/gif';
        } else {
          if (_0xc5c351["startsWith"]('RIFF') && _0xc5c351["slice"](0x8, 0xc) === "WEBP") {
            _0x2e9ca3 = "image/webp";
          }
        }
      }
    }
  } catch {}
  return "data:" + _0x2e9ca3 + ";base64," + _0x269a65;
}
export function resolveMappedImageResponseValues(_0x3fa6e7, _0x5e85e9 = {}) {
  const _0x3f1f0a = resolveMappedResponseValues(_0x3fa6e7, _0x5e85e9?.["resultPaths"] || _0x5e85e9?.["paths"]);
  const _0x3d1464 = Array['isArray'](_0x5e85e9?.["base64Paths"]) ? _0x5e85e9['base64Paths'] : [];
  const _0xc1c619 = Array["isArray"](_0x5e85e9?.["base64MimeTypePaths"]) ? _0x5e85e9["base64MimeTypePaths"] : [];
  const _0x59ff62 = _0xc1c619["flatMap"](_0x58d7bf => collectValuesByPath(_0x3fa6e7, _0x58d7bf));
  const _0x4d66a7 = normalizeImageMimeType(_0x5e85e9?.["base64DefaultMimeType"]);
  const _0x392059 = _0x3d1464["flatMap"](_0x196021 => collectValuesByPath(_0x3fa6e7, _0x196021));
  const _0x274d4f = _0x392059["map"]((_0x2249bd, _0x4f3317) => normalizeImageBase64DataUrl(_0x2249bd, normalizeImageMimeType(_0x59ff62[_0x4f3317], _0x4d66a7)))["filter"](Boolean);
  return Array["from"](new Set([..._0x3f1f0a, ..._0x274d4f]));
}
export function resolveMappedResponseValue(_0x26aa70, _0x4dcd74 = []) {
  return resolveMappedResponseValues(_0x26aa70, _0x4dcd74)[0x0] || '';
}