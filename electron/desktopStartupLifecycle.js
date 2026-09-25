export function createDesktopStartupLifecycle({
  app: _0x44a115,
  getSpawnedServer: _0x36027c,
  probeServer: _0x4def2c,
  clearPortBeforeStart: _0x159549,
  ensureServerRunning: _0x5d42bc,
  setTimer = setTimeout,
  clearTimer = clearTimeout
} = {}) {
  let _0x197fd3 = null;
  let _0xb18a90 = ![];
  let _0x48aed3 = ![];
  function _0x23c40a() {
    if (_0x197fd3 !== null) {
      clearTimer(_0x197fd3);
    }
    _0x197fd3 = null;
  }
  function _0x1d7ee6() {
    if (!_0xb18a90) {
      return;
    }
    throw Object["assign"](new Error('Desktop\x20startup\x20cancelled\x20during\x20shutdown'), {
      'code': 'AIC_DESKTOP_STARTUP_CANCELLED'
    });
  }
  return {
    'requestStart'(_0x71ba98) {
      if (_0xb18a90) {
        if (!_0x48aed3) {
          if (_0x71ba98) {
            _0x44a115["relaunch"]({
              'args': _0x71ba98
            });
          } else {
            _0x44a115["relaunch"]();
          }
          _0x48aed3 = !![];
        }
        return ![];
      }
      _0x23c40a();
      return !![];
    },
    'onShellClosed'({
      isQuittingForUpdate: _0x3e2271,
      hasUnsavedChanges: _0x3d214e
    }) {
      _0x23c40a();
      if (_0xb18a90 || _0x3e2271) {
        return ![];
      }
      if (!_0x3d214e) {
        return !![];
      }
      const _0x52d978 = setTimer(() => {
        if (_0x197fd3 !== _0x52d978) {
          return;
        }
        _0x197fd3 = null;
        _0x44a115["quit"]();
      }, 0x4b0);
      _0x197fd3 = _0x52d978;
      return ![];
    },
    'beginQuit'() {
      _0xb18a90 = !![];
      _0x23c40a();
    },
    'isQuitting': () => _0xb18a90,
    'assertStarting': _0x1d7ee6,
    async 'prepareBackend'() {
      try {
        _0x1d7ee6();
        const _0x2ceb9d = _0x36027c();
        const _0x2d6725 = () => _0x2ceb9d && _0x36027c() === _0x2ceb9d && _0x2ceb9d['exitCode'] === null && _0x2ceb9d["signalCode"] === null && !_0x2ceb9d["killed"];
        const _0xa4eb8a = _0x2d6725() && (await _0x4def2c());
        _0x1d7ee6();
        if (_0xa4eb8a && _0x2d6725()) {
          return;
        }
        await _0x159549();
        _0x1d7ee6();
        await _0x5d42bc();
      } finally {
        _0x1d7ee6();
      }
    }
  };
}