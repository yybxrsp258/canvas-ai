import a1069_0x20ad01 from '../core/stores/appStore.js';
export function createHistory({
  store: _0x9c4a94,
  max = 0x32
} = {}) {
  const _0x49154c = _0x9c4a94 && (typeof _0x9c4a94["getHistorySnapshot"] === "function" || typeof _0x9c4a94["getState"] === 'function');
  const _0x35d2ae = _0x9c4a94 && (typeof _0x9c4a94["loadHistorySnapshot"] === "function" || typeof _0x9c4a94["loadState"] === "function");
  if (!_0x49154c || !_0x35d2ae) {
    throw new TypeError('[history]\x20createHistory()\x20需要传入具备\x20history\x20snapshot/loadState\x20能力的\x20store');
  }
  const _0x32d848 = Number["isFinite"](max) && max > 0x0 ? Math["floor"](max) : 0x32;
  const _0x23277a = [];
  const _0x551527 = [];
  const _0x2d5b61 = [];
  let _0x59453a = 0x0;
  function _0x28ca87(_0x200b86 = _0x35cdc0()) {
    return {
      'id': "history-" + ++_0x59453a,
      'snapshot': _0x200b86
    };
  }
  function _0x35cdc0() {
    if (typeof _0x9c4a94["getHistorySnapshot"] === "function") {
      return _0x9c4a94['getHistorySnapshot']();
    }
    const _0x3efc9a = _0x9c4a94["getState"]();
    return {
      'nodes': _0x3efc9a["nodes"],
      'edges': _0x3efc9a['edges']
    };
  }
  function _0x51000d(_0x5e7766) {
    if (typeof _0x9c4a94["loadHistorySnapshot"] === "function") {
      _0x9c4a94["loadHistorySnapshot"](_0x5e7766);
      return;
    }
    const _0x32ebcc = typeof _0x9c4a94["getState"] === 'function' ? _0x9c4a94["getState"]()?.['viewport'] : undefined;
    _0x9c4a94["loadState"](_0x32ebcc ? {
      ..._0x5e7766,
      'viewport': _0x32ebcc
    } : _0x5e7766);
  }
  function _0x196e7c() {
    const _0x2dfd07 = _0x9c4a94["getGraphMutationPolicy"]?.()?.["history"];
    if (_0x2dfd07) {
      return _0x2dfd07["commit"]();
    }
    const _0x5e3303 = _0x28ca87();
    _0x23277a["push"](_0x5e3303);
    _0x23277a["length"] > _0x32d848 && _0x23277a["shift"]();
    _0x551527["length"] = 0x0;
    _0x2d5b61["forEach"](_0xb3fc74 => {
      try {
        _0xb3fc74();
      } catch (_0x3e1672) {
        console['error']("[history] 存档回调执行异常:", _0x3e1672);
      }
    });
    return {
      'id': _0x5e3303['id']
    };
  }
  function _0x43fa47(_0xb0999f) {
    typeof _0xb0999f === 'function' && _0x2d5b61["push"](_0xb0999f);
  }
  function _0x39e489() {
    _0x23277a['length'] = 0x0;
    _0x551527['length'] = 0x0;
    _0x23277a["push"](_0x28ca87());
  }
  function _0x490c33() {
    const _0x4ed214 = _0x9c4a94["getGraphMutationPolicy"]?.()?.["history"];
    if (_0x4ed214) {
      return _0x4ed214['undo']();
    }
    if (_0x23277a["length"] < 0x2) {
      console["log"]('[history]\x20已到达最早的历史记录，无法继续撤销');
      return;
    }
    const _0x3093a5 = _0x23277a["pop"]();
    _0x551527["push"](_0x3093a5);
    const _0x31e3c8 = _0x23277a[_0x23277a["length"] - 0x1];
    _0x51000d(_0x31e3c8["snapshot"]);
    console["log"]("[history] undo ← undoStack:" + _0x23277a['length'] + " redoStack:" + _0x551527["length"]);
  }
  function _0x57353e() {
    const _0x43fdb3 = _0x9c4a94["getGraphMutationPolicy"]?.()?.["history"];
    if (_0x43fdb3) {
      return _0x43fdb3["redo"]();
    }
    if (_0x551527['length'] === 0x0) {
      console["log"]("[history] 没有可重做的操作");
      return;
    }
    const _0x34d7f8 = _0x551527["pop"]();
    _0x23277a["push"](_0x34d7f8);
    _0x51000d(_0x34d7f8["snapshot"]);
    console["log"]('[history]\x20redo\x20→\x20undoStack:' + _0x23277a["length"] + " redoStack:" + _0x551527["length"]);
  }
  function _0x430adf() {
    const _0xa99864 = _0x9c4a94["getGraphMutationPolicy"]?.()?.["history"];
    if (_0xa99864) {
      return _0xa99864["getHistoryInfo"]();
    }
    return {
      'undoCount': _0x23277a["length"],
      'redoCount': _0x551527['length']
    };
  }
  function _0x4046e0() {
    if (_0x9c4a94['getGraphMutationPolicy']?.()?.["history"]) {
      return null;
    }
    const _0x2f11ae = _0x23277a['at'](-0x1) || null;
    return _0x2f11ae ? {
      'id': _0x2f11ae['id']
    } : null;
  }
  function _0x34e830(_0x4f2fb7, {
    expectedHead = null
  } = {}) {
    if (_0x9c4a94["getGraphMutationPolicy"]?.()?.["history"]) {
      return {
        'ok': ![],
        'errorCode': "COLLABORATION_HISTORY_UNSUPPORTED",
        'undone': 0x0
      };
    }
    const _0x4141ce = String(_0x4f2fb7?.['id'] || _0x4f2fb7 || '')["trim"]();
    const _0x3a8463 = String(expectedHead?.['id'] || expectedHead || '')["trim"]();
    const _0x45e7cb = _0x23277a['at'](-0x1) || null;
    if (!_0x4141ce || !_0x45e7cb) {
      return {
        'ok': ![],
        'errorCode': "HISTORY_CHECKPOINT_MISSING",
        'undone': 0x0
      };
    }
    if (_0x3a8463 && _0x45e7cb['id'] !== _0x3a8463) {
      return {
        'ok': ![],
        'errorCode': "HISTORY_HEAD_CHANGED",
        'undone': 0x0
      };
    }
    const _0x2bb807 = _0x23277a["findIndex"](_0xd37a7e => _0xd37a7e['id'] === _0x4141ce);
    if (_0x2bb807 < 0x0) {
      return {
        'ok': ![],
        'errorCode': "HISTORY_CHECKPOINT_EXPIRED",
        'undone': 0x0
      };
    }
    const _0x5b1746 = _0x23277a["length"] - 0x1 - _0x2bb807;
    if (_0x5b1746 <= 0x0) {
      return {
        'ok': ![],
        'errorCode': "HISTORY_NO_CHANGES",
        'undone': 0x0
      };
    }
    for (let _0x208ea7 = 0x0; _0x208ea7 < _0x5b1746; _0x208ea7 += 0x1) {
      _0x490c33();
    }
    return {
      'ok': !![],
      'checkpoint': {
        'id': _0x4141ce
      },
      'undone': _0x5b1746
    };
  }
  return {
    'commit': _0x196e7c,
    'reset': _0x39e489,
    'onCommit': _0x43fa47,
    'undo': _0x490c33,
    'redo': _0x57353e,
    'getHistoryInfo': _0x430adf,
    'createCheckpoint': _0x4046e0,
    'undoToCheckpoint': _0x34e830
  };
}
const _defaultHistory = createHistory({
  'store': a1069_0x20ad01,
  'max': 0x32
});
export function commit() {
  return _defaultHistory["commit"]();
}
export function resetHistory() {
  return _defaultHistory["reset"]();
}
export function onCommit(_0x846835) {
  return _defaultHistory["onCommit"](_0x846835);
}
export function undo() {
  return _defaultHistory["undo"]();
}
export function redo() {
  return _defaultHistory["redo"]();
}
export function getHistoryInfo() {
  return _defaultHistory["getHistoryInfo"]();
}
export function createHistoryCheckpoint() {
  return _defaultHistory['createCheckpoint']();
}
export function undoToHistoryCheckpoint(_0x2f3a02, _0xec749d = {}) {
  return _defaultHistory['undoToCheckpoint'](_0x2f3a02, _0xec749d);
}