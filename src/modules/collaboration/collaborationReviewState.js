export function createCollaborationReviewState({
  rpc: _0x525edc,
  current: _0xe3bc45,
  initialRevision: _0x598973,
  onChange: _0x1fbef2,
  onComment = () => {}
}) {
  let _0x1c5920 = {
    'revision': -0x1,
    'summaries': [],
    'activities': [],
    'loading': ![],
    'error': ''
  };
  let _0x28b447 = null;
  let _0x590eeb = -0x1;
  let _0x4d3be8 = Number["isInteger"](_0x598973) ? _0x598973 : -0x1;
  const _0x1dc6cd = _0x50358a => {
    _0xe3bc45() && (_0x1c5920 = {
      ..._0x1c5920,
      ..._0x50358a
    }, _0x1fbef2(_0x1c5920));
  };
  function _0x279b2d(_0x2d51bc = _0x590eeb, _0x2bc276 = ![]) {
    if (!_0xe3bc45() || !Number["isInteger"](_0x2d51bc)) {
      return Promise["resolve"]();
    }
    _0x590eeb = Math["max"](_0x590eeb, _0x2d51bc);
    if (_0x28b447) {
      return _0x28b447;
    }
    if (!_0x2bc276 && _0x1c5920['revision'] >= _0x590eeb && !_0x1c5920['error']) {
      return Promise["resolve"]();
    }
    _0x1dc6cd({
      'loading': !![],
      'error': ''
    });
    _0x28b447 = (async () => {
      try {
        do {
          const _0x548c28 = await _0x525edc({
            'action': 'reviewRead'
          });
          if (!_0xe3bc45()) {
            return;
          }
          if (!Number["isInteger"](_0x548c28["revision"]) || !Array["isArray"](_0x548c28["summaries"]) || !Array["isArray"](_0x548c28['activities'])) {
            throw new Error("协作动态响应无效");
          }
          const _0x5dc758 = _0x4d3be8 < 0x0 ? [] : _0x548c28["activities"]['filter'](_0x2d96ee => _0x2d96ee["seq"] > _0x4d3be8 && _0x2d96ee["kind"] === "comment")['sort']((_0x4b91dd, _0xe3e7f4) => _0x4b91dd['seq'] - _0xe3e7f4['seq']);
          _0x4d3be8 = Math["max"](_0x4d3be8, _0x548c28['revision']);
          for (const _0x235753 of _0x5dc758) {
            onComment(_0x235753);
          }
          _0x1dc6cd({
            ..._0x548c28,
            'error': ''
          });
        } while (_0xe3bc45() && _0x1c5920['revision'] < _0x590eeb);
      } catch (_0x4059f8) {
        _0x1dc6cd({
          'error': _0x4059f8["name"] === "AbortError" ? '' : _0x4059f8["message"]
        });
      } finally {
        _0x28b447 = null;
        _0x1dc6cd({
          'loading': ![]
        });
      }
    })();
    return _0x28b447;
  }
  return {
    'snapshot': () => _0x1c5920,
    'refresh': _0x279b2d,
    async 'readNode'(_0x64d7e2) {
      const _0x477143 = await _0x525edc({
        'action': "commentRead",
        'nodeId': _0x64d7e2
      });
      if (!_0xe3bc45()) {
        throw new DOMException("Aborted", 'AbortError');
      }
      return _0x477143;
    },
    async 'write'(_0x4134f6, _0x47fce9) {
      if (!_0xe3bc45()) {
        throw new DOMException('Aborted', "AbortError");
      }
      const _0x375129 = await _0x525edc({
        'action': _0x4134f6,
        ..._0x47fce9
      });
      if (!_0xe3bc45()) {
        throw new DOMException('Aborted', "AbortError");
      }
      await _0x279b2d(_0x375129["revision"]);
      return _0x375129;
    }
  };
}