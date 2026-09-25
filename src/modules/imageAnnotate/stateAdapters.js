import { IMAGE_MODELS } from '../../config/modelConfig.js';
import { buildImageFunctionModelCatalog, findImageFunctionProviderByModel, getDefaultImageFunctionModelState } from '../imageFunctionModelMenu.js';
export const LOCAL_EDIT_STATE_KEY = 'localEditState';
const LOCAL_EDIT_TOOLS = new Set(['brush', "eraser"]);
const clampPersistedLocalEditBrushSize = _0x34044c => Math["max"](0x1, Math["min"](0x78, Number(_0x34044c) || 0x28));
const normalizePersistedLocalEditTool = _0x598115 => {
  const _0x3ac8b6 = String(_0x598115 || '')['trim']();
  return LOCAL_EDIT_TOOLS['has'](_0x3ac8b6) ? _0x3ac8b6 : "brush";
};
export const buildGenerationModelCatalog = (_0x3eeb5d = IMAGE_MODELS) => {
  return buildImageFunctionModelCatalog(_0x3eeb5d);
};
export const findProviderKeyByModel = (_0x4b10f5, _0x585932) => {
  const _0x161bbe = String(_0x585932 || '')["trim"]();
  if (!_0x161bbe) {
    return null;
  }
  for (const [_0x4327ae, _0x593699] of Object['entries'](_0x4b10f5 || {})) {
    const _0x36dc7b = Array["isArray"](_0x593699?.["models"]) ? _0x593699["models"] : [];
    if (_0x36dc7b["some"](_0x59ef79 => _0x59ef79?.['id'] === _0x161bbe)) {
      return _0x4327ae;
    }
  }
  return findImageFunctionProviderByModel(_0x4b10f5, _0x161bbe);
};
export const buildSeedreamMigrationPatch = _0x357000 => {
  void _0x357000;
  return null;
};
export const normalizePersistedLocalEditCommand = _0x5a9961 => {
  if (!_0x5a9961 || typeof _0x5a9961 !== "object") {
    return null;
  }
  const _0x58de70 = String(_0x5a9961['type'] || '')["trim"]();
  if (_0x58de70 === 'brush' || _0x58de70 === "eraser") {
    const _0x2b68d0 = Array["isArray"](_0x5a9961["points"]) ? _0x5a9961["points"] : [];
    const _0x12bb5c = _0x2b68d0["map"](_0x201ea4 => ({
      'x': Number(_0x201ea4?.['x']),
      'y': Number(_0x201ea4?.['y'])
    }))['filter'](_0x3e4b76 => Number["isFinite"](_0x3e4b76['x']) && Number["isFinite"](_0x3e4b76['y']));
    const _0xa95b10 = Number(_0x5a9961["sizeWorld"]);
    if (!_0x12bb5c["length"] || !Number["isFinite"](_0xa95b10)) {
      return null;
    }
    return {
      'type': _0x58de70,
      'sizeWorld': _0xa95b10,
      'points': _0x12bb5c
    };
  }
  if (_0x58de70 === "rect") {
    const _0xeca749 = Number(_0x5a9961['x1']);
    const _0x315caa = Number(_0x5a9961['y1']);
    const _0x5f58d9 = Number(_0x5a9961['x2']);
    const _0x596fe4 = Number(_0x5a9961['y2']);
    const _0x9c0a5b = Number(_0x5a9961["sizeWorld"]);
    if (!Number['isFinite'](_0xeca749) || !Number["isFinite"](_0x315caa) || !Number['isFinite'](_0x5f58d9) || !Number['isFinite'](_0x596fe4) || !Number["isFinite"](_0x9c0a5b)) {
      return null;
    }
    return {
      'type': _0x58de70,
      'color': String(_0x5a9961["color"] || ''),
      'sizeWorld': _0x9c0a5b,
      'x1': _0xeca749,
      'y1': _0x315caa,
      'x2': _0x5f58d9,
      'y2': _0x596fe4
    };
  }
  if (_0x58de70 === "fill") {
    const _0x232841 = Number(_0x5a9961['x']);
    const _0x18687c = Number(_0x5a9961['y']);
    if (!Number["isFinite"](_0x232841) || !Number["isFinite"](_0x18687c)) {
      return null;
    }
    return {
      'type': _0x58de70,
      'x': _0x232841,
      'y': _0x18687c,
      'color': String(_0x5a9961["color"] || '')
    };
  }
  return null;
};
export const readLocalEditState = _0x5c8fa2 => {
  const _0x1fe718 = _0x5c8fa2?.[LOCAL_EDIT_STATE_KEY];
  if (!_0x1fe718 || typeof _0x1fe718 !== 'object') {
    return null;
  }
  return buildLocalEditState(_0x1fe718);
};
export const buildLocalEditState = ({
  scene: _0x219ea3,
  promptText: _0x140b45,
  commands: _0x321ba9,
  tool: _0x3a279e,
  brushSizePx: _0x2ca523
} = {}) => ({
  'scene': _0x219ea3 === "erase" ? "erase" : "repaint",
  'promptText': String(_0x140b45 || ''),
  'commands': Array["isArray"](_0x321ba9) ? _0x321ba9["map"](_0x43cff2 => normalizePersistedLocalEditCommand(_0x43cff2))["filter"](Boolean) : [],
  'tool': normalizePersistedLocalEditTool(_0x3a279e),
  'brushSizePx': clampPersistedLocalEditBrushSize(_0x2ca523)
});
export const getDefaultGenerationModelState = (_0x23607f = buildGenerationModelCatalog()) => {
  return getDefaultImageFunctionModelState(_0x23607f);
};