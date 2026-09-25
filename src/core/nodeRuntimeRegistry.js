function normalizeNodeId(_0x32fff8) {
  return String(_0x32fff8 || '')['trim']();
}
function hasGenerationRuntimeMethod(_0x2df335 = {}) {
  return typeof _0x2df335['runGeneration'] === "function" || typeof _0x2df335["getGenerationStatus"] === "function" || typeof _0x2df335["cancelGeneration"] === "function" || typeof _0x2df335['resumeGeneration'] === "function";
}
export function createNodeRuntimeRegistry() {
  const _0x89543b = new Map();
  const _0x47c5dc = new Map();
  return {
    'registerResolver'(_0x3ddba1, _0x413a44) {
      if (typeof _0x413a44 !== "function") {
        throw new TypeError('Node\x20runtime\x20resolver\x20must\x20be\x20a\x20function');
      }
      _0x47c5dc["set"](_0x3ddba1, _0x413a44);
      return () => {
        if (_0x47c5dc["get"](_0x3ddba1) === _0x413a44) {
          _0x47c5dc["delete"](_0x3ddba1);
        }
      };
    },
    'resolve'(_0x5c0946, _0x489865 = {}) {
      const _0x546daf = normalizeNodeId(_0x5c0946);
      const _0x5891ac = _0x489865["store"]?.["getStateRaw"]?.()?.['nodes']?.[_0x546daf] || _0x489865['store']?.["getState"]?.()?.["nodes"]?.[_0x546daf];
      if (_0x5891ac && _0x47c5dc["has"](_0x5891ac['type'])) {
        return _0x47c5dc["get"](_0x5891ac["type"])(_0x546daf, _0x489865);
      }
      return _0x546daf ? _0x89543b["get"](_0x546daf) || null : null;
    },
    'register'(_0xe2144a, _0x5d8c0a = {}) {
      const _0x211e04 = normalizeNodeId(_0xe2144a);
      if (!_0x211e04 || !_0x5d8c0a || typeof _0x5d8c0a !== "object") {
        return null;
      }
      if (!hasGenerationRuntimeMethod(_0x5d8c0a)) {
        return null;
      }
      _0x89543b['set'](_0x211e04, _0x5d8c0a);
      return _0x5d8c0a;
    },
    'unregister'(_0x1915f9) {
      const _0x46da7e = normalizeNodeId(_0x1915f9);
      if (!_0x46da7e) {
        return ![];
      }
      return _0x89543b["delete"](_0x46da7e);
    },
    'get'(_0x19f36c) {
      const _0x312110 = normalizeNodeId(_0x19f36c);
      return _0x312110 ? _0x89543b["get"](_0x312110) || null : null;
    },
    'clear'() {
      _0x89543b["clear"]();
    }
  };
}
export const nodeRuntimeRegistry = createNodeRuntimeRegistry();
export default nodeRuntimeRegistry;