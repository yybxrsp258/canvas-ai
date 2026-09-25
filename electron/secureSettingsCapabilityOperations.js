export function createSecureSettingsCapabilityOperations({
  getSecureSettingsStore: _0x3e02a0,
  normalizeSecureSettingsKeys: _0x36fd92
} = {}) {
  const _0x14d66b = _0x4ecb38 => String(_0x4ecb38?.["message"] || _0x4ecb38);
  const _0x5b334a = 'Invalid\x20secure\x20setting\x20key';
  return {
    'get'(_0xcdd3d = {}) {
      let _0x4cdc27 = ![];
      try {
        const _0x15e9a1 = _0x3e02a0();
        _0x4cdc27 = _0x15e9a1?.["isAvailable"]?.() === !![];
        const _0x561383 = _0x36fd92(_0xcdd3d);
        return {
          'ok': !![],
          'available': _0x4cdc27,
          'values': _0x4cdc27 && _0x561383["length"] > 0x0 ? _0x15e9a1["getMany"](_0x561383) : {}
        };
      } catch (_0x42a560) {
        return {
          'ok': ![],
          'available': _0x4cdc27,
          'values': {},
          'error': _0x14d66b(_0x42a560)
        };
      }
    },
    'set'(_0x2b6691 = {}) {
      let _0x5b61bb = ![];
      try {
        const _0x1fa562 = _0x3e02a0();
        _0x5b61bb = _0x1fa562?.["isAvailable"]?.() === !![];
        if (!_0x5b61bb) {
          return {
            'ok': ![],
            'available': _0x5b61bb,
            'error': '安全存储不可用'
          };
        }
        const [_0x1a5d2d = ''] = _0x36fd92({
          'key': _0x2b6691?.['key']
        });
        if (!_0x1a5d2d) {
          return {
            'ok': ![],
            'available': _0x5b61bb,
            'error': _0x5b334a
          };
        }
        _0x1fa562["set"](_0x1a5d2d, _0x2b6691?.["value"]);
        return {
          'ok': !![],
          'available': _0x5b61bb
        };
      } catch (_0x1a4306) {
        return {
          'ok': ![],
          'available': _0x5b61bb,
          'error': _0x14d66b(_0x1a4306)
        };
      }
    },
    'delete'(_0x1e77c8 = {}) {
      let _0x1feef4 = ![];
      try {
        const _0x14e052 = _0x3e02a0();
        _0x1feef4 = _0x14e052?.['isAvailable']?.() === !![];
        if (!_0x1feef4) {
          return {
            'ok': ![],
            'available': _0x1feef4,
            'error': "安全存储不可用"
          };
        }
        const [_0x716d0a = ''] = _0x36fd92({
          'key': _0x1e77c8?.['key']
        });
        if (!_0x716d0a) {
          return {
            'ok': ![],
            'available': _0x1feef4,
            'error': _0x5b334a
          };
        }
        _0x14e052["delete"](_0x716d0a);
        return {
          'ok': !![],
          'available': _0x1feef4
        };
      } catch (_0x2dd0b5) {
        return {
          'ok': ![],
          'available': _0x1feef4,
          'error': _0x14d66b(_0x2dd0b5)
        };
      }
    }
  };
}