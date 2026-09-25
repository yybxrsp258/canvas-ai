import { spawn } from 'node:child_process';
import a258_0x201ff2 from 'node:path';
const TERMINAL_STATUSES = new Set(["complete", "failed", "cancelled"]);
const RETRYABLE_SPAWN_ERROR_CODES = new Set(["UNKNOWN", "EBUSY", "EACCES"]);
const DEFAULT_SPAWN_RETRY_DELAY_MS = 0xb4;
const DEFAULT_SPAWN_MAX_ATTEMPTS = 0x2;
const MIN_TASK_PRIORITY = -0x64;
const MAX_TASK_PRIORITY = 0x64;
function clampProgress(_0x58f09c) {
  const _0x378aa0 = Number(_0x58f09c);
  if (!Number['isFinite'](_0x378aa0)) {
    return 0x0;
  }
  return Math["max"](0x0, Math['min'](0x1, _0x378aa0));
}
function normalizeTaskPriority(_0x390a7d) {
  const _0x50fb20 = Number(_0x390a7d);
  if (!Number["isFinite"](_0x50fb20)) {
    return 0x0;
  }
  return Math["max"](MIN_TASK_PRIORITY, Math['min'](MAX_TASK_PRIORITY, Math["trunc"](_0x50fb20)));
}
function buildActiveMigrationIdentity(_0x1dc216, _0x205f3c = {}) {
  const _0x1e4e90 = String(_0x205f3c?.["migrationKey"] || '')["trim"]();
  if (!_0x1e4e90) {
    return '';
  }
  return JSON['stringify']([String(_0x1dc216 || '')["trim"](), String(_0x205f3c?.['purpose'] || '')["trim"](), _0x1e4e90]);
}
function createDefaultTaskId() {
  return 'media-task-' + Date["now"]() + '-' + Math["random"]()["toString"](0x10)["slice"](0x2);
}
function parseFfmpegTimeSeconds(_0x558380) {
  const _0x26bda0 = String(_0x558380 || '')["match"](/time=(\d{2}):(\d{2}):(\d{2})(?:[.,](\d+))?/);
  if (!_0x26bda0) {
    return null;
  }
  const _0x497a96 = Number(_0x26bda0[0x1]) || 0x0;
  const _0xeb09fd = Number(_0x26bda0[0x2]) || 0x0;
  const _0x244517 = Number(_0x26bda0[0x3]) || 0x0;
  const _0x37b8c7 = Number('0.' + (_0x26bda0[0x4] || '0')) || 0x0;
  return _0x497a96 * 0xe10 + _0xeb09fd * 0x3c + _0x244517 + _0x37b8c7;
}
function delay(_0x5612fc) {
  return new Promise(_0x251c94 => {
    setTimeout(_0x251c94, _0x5612fc);
  });
}
function getCommandLabel(_0x560ad2) {
  const _0x108d45 = String(_0x560ad2 || '')['trim']();
  if (!_0x108d45) {
    return "media tool";
  }
  const _0x24edc4 = a258_0x201ff2["basename"](_0x108d45);
  return _0x24edc4 || _0x108d45;
}
function shouldRetrySpawnError(_0x24c393, _0x946fc2, _0x176798) {
  if (_0x946fc2 >= _0x176798) {
    return ![];
  }
  const _0x2345ee = String(_0x24c393?.['code'] || '')['toUpperCase']();
  return RETRYABLE_SPAWN_ERROR_CODES["has"](_0x2345ee);
}
export function createProcessStartError(_0x2a755c, _0x8eae84, _0x4102d7, _0xad2399, _0x1a6428) {
  const _0x516fe9 = getCommandLabel(_0x2a755c);
  const _0x5232dc = String(_0xad2399?.['message'] || _0xad2399 || 'unknown\x20error');
  const _0x57f35e = new Error("Failed to start " + _0x516fe9 + ':\x20' + _0x5232dc, {
    'cause': _0xad2399 instanceof Error ? _0xad2399 : undefined
  });
  _0x57f35e["name"] = "MediaTaskProcessStartError";
  _0x57f35e["command"] = String(_0x2a755c || '');
  _0x57f35e["commandLabel"] = _0x516fe9;
  _0x57f35e["args"] = Array["isArray"](_0x8eae84) ? _0x8eae84['map'](_0x5200c2 => String(_0x5200c2)) : [];
  _0x57f35e["cwd"] = String(_0x4102d7?.["cwd"] || '');
  _0x57f35e["attempt"] = _0x1a6428;
  if (_0xad2399?.['code'] != null) {
    _0x57f35e["code"] = _0xad2399["code"];
  }
  if (_0xad2399?.['errno'] != null) {
    _0x57f35e["errno"] = _0xad2399['errno'];
  }
  if (_0xad2399?.["syscall"] != null) {
    _0x57f35e["syscall"] = _0xad2399["syscall"];
  }
  if (_0xad2399?.["path"] != null) {
    _0x57f35e['path'] = _0xad2399["path"];
  }
  return _0x57f35e;
}
export class MediaTaskCancelledError extends Error {
  constructor(_0x16a2ea = 'Media\x20task\x20cancelled') {
    super(_0x16a2ea);
    this["name"] = "MediaTaskCancelledError";
  }
}
export class MediaTaskProcessTimeoutError extends Error {
  constructor(_0x1237cd, _0x22e271) {
    super(getCommandLabel(_0x1237cd) + '\x20timed\x20out\x20after\x20' + _0x22e271 + 'ms');
    this["name"] = "MediaTaskProcessTimeoutError";
    this["code"] = "MEDIA_TASK_PROCESS_TIMEOUT";
    this["command"] = String(_0x1237cd || '');
    this["commandLabel"] = getCommandLabel(_0x1237cd);
    this['timeoutMs'] = _0x22e271;
  }
}
export class MediaTaskQueue {
  constructor({
    concurrency = 0x2,
    handlers = {},
    onUpdate = null,
    onActivity = null,
    idFactory = createDefaultTaskId,
    spawnImpl = spawn
  } = {}) {
    this['concurrency'] = Math["max"](0x1, Math["trunc"](Number(concurrency) || 0x1));
    this["handlers"] = {
      ...handlers
    };
    this["onUpdate"] = typeof onUpdate === 'function' ? onUpdate : () => {};
    this['onActivity'] = typeof onActivity === "function" ? onActivity : () => {};
    this["idFactory"] = typeof idFactory === "function" ? idFactory : createDefaultTaskId;
    this["spawnImpl"] = typeof spawnImpl === "function" ? spawnImpl : spawn;
    this["tasks"] = new Map();
    this['waiting'] = [];
    this["activeMigrationTasks"] = new Map();
    this["active"] = 0x0;
  }
  ['setHandler'](_0x493820, _0x1afce3) {
    const _0x555ad0 = String(_0x493820 || '')['trim']();
    if (!_0x555ad0 || typeof _0x1afce3 !== "function") {
      return;
    }
    this["handlers"][_0x555ad0] = _0x1afce3;
  }
  ["enqueue"](_0x1bed29 = {}) {
    const _0x35735f = String(_0x1bed29?.["kind"] || '')["trim"]();
    if (!_0x35735f) {
      throw new Error("Missing media task kind");
    }
    const _0x494ac2 = this["handlers"][_0x35735f];
    if (typeof _0x494ac2 !== "function") {
      throw new Error('Unsupported\x20media\x20task\x20kind:\x20' + _0x35735f);
    }
    const _0x340ee6 = buildActiveMigrationIdentity(_0x35735f, _0x1bed29);
    if (_0x340ee6) {
      const _0x135176 = this['activeMigrationTasks']['get'](_0x340ee6);
      if (_0x135176 && !TERMINAL_STATUSES['has'](_0x135176['status'])) {
        return this['_snapshot'](_0x135176);
      }
      this["activeMigrationTasks"]["delete"](_0x340ee6);
    }
    const _0x1ef0ef = String(_0x1bed29?.["taskId"] || '')['trim']() || this["idFactory"]();
    const _0x2d3a05 = {
      'id': _0x1ef0ef,
      'taskId': _0x1ef0ef,
      'kind': _0x35735f,
      'nodeId': String(_0x1bed29?.['nodeId'] || '')["trim"](),
      'payload': {
        ..._0x1bed29,
        'kind': _0x35735f,
        'taskId': _0x1ef0ef
      },
      'cancellable': _0x1bed29?.['cancellable'] === !![],
      'priority': normalizeTaskPriority(_0x1bed29?.["priority"]),
      'status': "waiting",
      'progress': 0x0,
      'stage': '',
      'message': '',
      'error': '',
      'result': null,
      'child': null,
      'cancelRequested': ![],
      'migrationIdentity': _0x340ee6,
      'createdAt': Date['now'](),
      'startedAt': 0x0,
      'finishedAt': 0x0
    };
    this["tasks"]["set"](_0x1ef0ef, _0x2d3a05);
    _0x340ee6 && this['activeMigrationTasks']["set"](_0x340ee6, _0x2d3a05);
    this['waiting']["push"](_0x2d3a05);
    this["_emit"](_0x2d3a05);
    this["_pump"]();
    return this["_snapshot"](_0x2d3a05);
  }
  ['cancel'](_0x5a89a0, _0x4b5213 = {}) {
    const _0x2f2b04 = String(_0x5a89a0 || '')["trim"]();
    const _0x5db368 = this["tasks"]["get"](_0x2f2b04);
    if (!_0x5db368) {
      return {
        'ok': ![],
        'error': "Task not found"
      };
    }
    if (_0x4b5213?.['onlyIfWaiting'] === !![] && _0x5db368["status"] !== "waiting") {
      return {
        'ok': !![],
        'skipped': !![],
        'reason': TERMINAL_STATUSES["has"](_0x5db368["status"]) ? "task-already-finished" : "task-already-started",
        'task': this["_snapshot"](_0x5db368)
      };
    }
    if (TERMINAL_STATUSES['has'](_0x5db368['status'])) {
      return {
        'ok': !![],
        'task': this['_snapshot'](_0x5db368)
      };
    }
    _0x5db368["cancelRequested"] = !![];
    if (_0x5db368["status"] === 'waiting') {
      this["waiting"] = this['waiting']["filter"](_0x138415 => _0x138415['id'] !== _0x2f2b04);
      this['_finish'](_0x5db368, "cancelled", {
        'progress': _0x5db368["progress"],
        'message': 'Cancelled'
      });
      this["_pump"]();
      return {
        'ok': !![],
        'task': this["_snapshot"](_0x5db368)
      };
    }
    if (_0x5db368['child'] && typeof _0x5db368['child']["kill"] === 'function') {
      try {
        _0x5db368["child"]['kill']();
      } catch {}
    }
    this["_emit"](_0x5db368, {
      'message': "Cancelling"
    });
    return {
      'ok': !![],
      'task': this['_snapshot'](_0x5db368)
    };
  }
  ['get'](_0x52ee15) {
    const _0x4646b7 = this["tasks"]["get"](String(_0x52ee15 || '')["trim"]());
    return _0x4646b7 ? this["_snapshot"](_0x4646b7) : null;
  }
  ['list']({
    limit = 0x64
  } = {}) {
    const _0x2062bb = Math["max"](0x1, Math['min'](0x1f4, Math["trunc"](Number(limit) || 0x64)));
    return [...this["tasks"]["values"]()]["sort"]((_0x26c907, _0x53590a) => Number(_0x53590a["createdAt"] || 0x0) - Number(_0x26c907["createdAt"] || 0x0))["slice"](0x0, _0x2062bb)["map"](_0x40edf8 => this['_snapshot'](_0x40edf8));
  }
  ['getActivity']() {
    return this["_activitySnapshot"]();
  }
  ["emitProgress"](_0x3ba56a, _0x41e09c, _0xda004d = '', _0x5039d9 = {}) {
    if (!_0x3ba56a || TERMINAL_STATUSES["has"](_0x3ba56a["status"])) {
      return;
    }
    _0x3ba56a["progress"] = clampProgress(_0x41e09c);
    if (_0x5039d9["stage"] != null) {
      _0x3ba56a['stage'] = String(_0x5039d9["stage"] || '');
    }
    if (_0xda004d) {
      _0x3ba56a["message"] = String(_0xda004d);
    }
    this['_emit'](_0x3ba56a);
  }
  ["isCancelled"](_0x148277) {
    return _0x148277?.['cancelRequested'] === !![];
  }
  ["throwIfCancelled"](_0x46eef0) {
    if (this["isCancelled"](_0x46eef0)) {
      throw new MediaTaskCancelledError();
    }
  }
  ["runProcess"](_0x2f9e76, _0x333780, _0x42e878 = [], _0x489416 = {}) {
    this["throwIfCancelled"](_0x2f9e76);
    return new Promise((_0x24ae93, _0x5401b7) => {
      const _0x498daf = [];
      const _0x2f679a = [];
      const _0x87eafd = Number(_0x489416["durationSec"] || 0x0);
      const _0x1992a6 = _0x489416["input"] !== null && _0x489416["input"] !== undefined;
      let _0xf39592 = clampProgress(_0x489416["initialProgress"] || _0x2f9e76["progress"] || 0x0);
      let _0x48987b = ![];
      const _0x38c945 = (_0x219757, _0x3053eb) => {
        if (_0x48987b) {
          return;
        }
        _0x48987b = !![];
        _0x2f9e76["child"] = null;
        _0x219757(_0x3053eb);
      };
      const _0x2f19ce = Math["max"](0x1, Math["trunc"](Number(_0x489416['spawnMaxAttempts'] || DEFAULT_SPAWN_MAX_ATTEMPTS) || 0x1));
      const _0x167f67 = Math['max'](0x0, Math["trunc"](Number(_0x489416['spawnRetryDelayMs'] ?? DEFAULT_SPAWN_RETRY_DELAY_MS) || 0x0));
      const _0x1261dd = Math["max"](0x0, Math["trunc"](Number(_0x489416["timeoutMs"] || 0x0) || 0x0));
      const _0x136e6e = async (_0x5d9219 = 0x1) => {
        if (_0x48987b) {
          return;
        }
        try {
          this["throwIfCancelled"](_0x2f9e76);
        } catch (_0x61dcd8) {
          _0x38c945(_0x5401b7, _0x61dcd8);
          return;
        }
        let _0xa789ef = null;
        try {
          _0xa789ef = this["spawnImpl"](_0x333780, _0x42e878, {
            'cwd': _0x489416["cwd"],
            'env': _0x489416["env"],
            'stdio': _0x1992a6 ? ["pipe", "pipe", "pipe"] : ['ignore', "pipe", "pipe"],
            'windowsHide': !![]
          });
        } catch (_0x1882f9) {
          if (shouldRetrySpawnError(_0x1882f9, _0x5d9219, _0x2f19ce)) {
            await delay(_0x167f67);
            await _0x136e6e(_0x5d9219 + 0x1);
            return;
          }
          _0x38c945(_0x5401b7, createProcessStartError(_0x333780, _0x42e878, _0x489416, _0x1882f9, _0x5d9219));
          return;
        }
        _0x2f9e76["child"] = _0xa789ef;
        let _0x6b23df = ![];
        let _0x5dd234 = null;
        const _0x36c3c5 = () => {
          if (_0x5dd234) {
            clearTimeout(_0x5dd234);
          }
          _0x5dd234 = null;
        };
        const _0x4f877f = (_0x4bfb69, _0x233f3c) => {
          if (_0x6b23df || _0x48987b) {
            return;
          }
          _0x6b23df = !![];
          if (_0x2f9e76["child"] === _0xa789ef) {
            _0x2f9e76["child"] = null;
          }
          _0x36c3c5();
          _0x38c945(_0x4bfb69, _0x233f3c);
        };
        const _0x29d333 = async _0x182e06 => {
          if (_0x6b23df || _0x48987b) {
            return;
          }
          _0x6b23df = !![];
          _0x36c3c5();
          if (_0x2f9e76["child"] === _0xa789ef) {
            _0x2f9e76["child"] = null;
          }
          if (shouldRetrySpawnError(_0x182e06, _0x5d9219, _0x2f19ce) && !this["isCancelled"](_0x2f9e76)) {
            await delay(_0x167f67);
            await _0x136e6e(_0x5d9219 + 0x1);
            return;
          }
          _0x38c945(_0x5401b7, createProcessStartError(_0x333780, _0x42e878, _0x489416, _0x182e06, _0x5d9219));
        };
        _0xa789ef["stdout"]?.['on']("data", _0x4ca743 => _0x498daf['push'](Buffer["from"](_0x4ca743)));
        _0xa789ef["stderr"]?.['on']('data', _0x2ec53a => {
          const _0xd77be5 = Buffer["from"](_0x2ec53a);
          _0x2f679a["push"](_0xd77be5);
          if (_0x87eafd > 0x0) {
            const _0x5af4de = parseFfmpegTimeSeconds(_0xd77be5["toString"]('utf8'));
            if (_0x5af4de != null) {
              const _0xb7c123 = clampProgress(_0x5af4de / _0x87eafd);
              _0xb7c123 >= _0xf39592 + 0.01 && (_0xf39592 = _0xb7c123, this['emitProgress'](_0x2f9e76, _0xb7c123, _0x489416["progressMessage"] || ''));
            }
          }
        });
        _0xa789ef['once']("error", _0x34b3b1 => {
          void _0x29d333(_0x34b3b1);
        });
        _0xa789ef['once']('exit', (_0x2462be, _0x49501e) => {
          if (_0x6b23df || _0x48987b) {
            return;
          }
          if (this["isCancelled"](_0x2f9e76)) {
            _0x4f877f(_0x5401b7, new MediaTaskCancelledError());
            return;
          }
          if (_0x2462be === 0x0) {
            _0x4f877f(_0x24ae93, {
              'stdout': Buffer["concat"](_0x498daf),
              'stderr': Buffer["concat"](_0x2f679a),
              'code': _0x2462be,
              'signal': _0x49501e
            });
            return;
          }
          const _0x4e2f38 = Buffer["concat"](_0x2f679a)["toString"]("utf8")['trim']() || _0x333780 + '\x20exited\x20with\x20' + (_0x2462be ?? _0x49501e ?? 'unknown');
          _0x4f877f(_0x5401b7, new Error(_0x4e2f38));
        });
        _0x1261dd > 0x0 && (_0x5dd234 = setTimeout(() => {
          if (_0x6b23df || _0x48987b) {
            return;
          }
          const _0x2f7457 = new MediaTaskProcessTimeoutError(_0x333780, _0x1261dd);
          try {
            _0xa789ef["kill"]();
          } catch {}
          _0x4f877f(_0x5401b7, _0x2f7457);
        }, _0x1261dd), _0x5dd234["unref"]?.());
        _0x1992a6 && _0xa789ef["stdin"] && _0xa789ef["stdin"]["end"](_0x489416["input"]);
      };
      void _0x136e6e();
    });
  }
  ["_pump"]() {
    while (this["active"] < this["concurrency"] && this['waiting']["length"] > 0x0) {
      let _0x22afe2 = 0x0;
      for (let _0x219a79 = 0x1; _0x219a79 < this["waiting"]['length']; _0x219a79 += 0x1) {
        const _0x30e06a = normalizeTaskPriority(this['waiting'][_0x219a79]?.["priority"]);
        const _0x459c23 = normalizeTaskPriority(this['waiting'][_0x22afe2]?.["priority"]);
        if (_0x30e06a > _0x459c23) {
          _0x22afe2 = _0x219a79;
        }
      }
      const [_0x2f8d3c] = this["waiting"]["splice"](_0x22afe2, 0x1);
      if (!_0x2f8d3c || TERMINAL_STATUSES["has"](_0x2f8d3c["status"])) {
        continue;
      }
      this['_run'](_0x2f8d3c);
    }
  }
  async ["_run"](_0x5a9c3b) {
    this["active"] += 0x1;
    _0x5a9c3b["status"] = "processing";
    _0x5a9c3b["startedAt"] = Date["now"]();
    _0x5a9c3b["progress"] = Math["max"](_0x5a9c3b["progress"], 0.01);
    this['_emit'](_0x5a9c3b);
    try {
      const _0x4fa064 = await this["handlers"][_0x5a9c3b["kind"]](_0x5a9c3b, this);
      this["throwIfCancelled"](_0x5a9c3b);
      this['_finish'](_0x5a9c3b, "complete", {
        'progress': 0x1,
        'message': 'Complete',
        'result': _0x4fa064 && typeof _0x4fa064 === "object" ? _0x4fa064 : {}
      });
    } catch (_0x51b413) {
      _0x51b413 instanceof MediaTaskCancelledError || this["isCancelled"](_0x5a9c3b) ? this["_finish"](_0x5a9c3b, 'cancelled', {
        'message': "Cancelled",
        'error': ''
      }) : this["_finish"](_0x5a9c3b, "failed", {
        'message': "Failed",
        'error': String(_0x51b413?.["message"] || _0x51b413)
      });
    } finally {
      this['active'] -= 0x1;
      this["_pump"]();
    }
  }
  ["_finish"](_0x1ad49a, _0x237b51, _0x13f084 = {}) {
    _0x1ad49a["status"] = _0x237b51;
    _0x1ad49a["migrationIdentity"] && this["activeMigrationTasks"]["get"](_0x1ad49a['migrationIdentity']) === _0x1ad49a && this["activeMigrationTasks"]["delete"](_0x1ad49a['migrationIdentity']);
    _0x1ad49a["finishedAt"] = Date["now"]();
    _0x1ad49a["child"] = null;
    if (_0x13f084["progress"] != null) {
      _0x1ad49a['progress'] = clampProgress(_0x13f084["progress"]);
    }
    if (_0x13f084["stage"] != null) {
      _0x1ad49a["stage"] = String(_0x13f084["stage"] || '');
    }
    if (_0x13f084["message"] != null) {
      _0x1ad49a["message"] = String(_0x13f084["message"] || '');
    }
    if (_0x13f084['error'] != null) {
      _0x1ad49a['error'] = String(_0x13f084['error'] || '');
    }
    if (_0x13f084['result'] != null) {
      _0x1ad49a["result"] = _0x13f084["result"];
    }
    this['_emit'](_0x1ad49a);
  }
  ["_emit"](_0x1b0882, _0x44a5b9 = {}) {
    if (!_0x1b0882) {
      return;
    }
    if (_0x44a5b9['progress'] != null) {
      _0x1b0882["progress"] = clampProgress(_0x44a5b9["progress"]);
    }
    if (_0x44a5b9["message"] != null) {
      _0x1b0882["message"] = String(_0x44a5b9['message'] || '');
    }
    if (_0x44a5b9["error"] != null) {
      _0x1b0882["error"] = String(_0x44a5b9["error"] || '');
    }
    if (_0x44a5b9['result'] != null) {
      _0x1b0882["result"] = _0x44a5b9["result"];
    }
    this["onUpdate"](this["_snapshot"](_0x1b0882));
    this["_emitActivity"]();
  }
  ["_emitActivity"]() {
    this["onActivity"](this["_activitySnapshot"]());
  }
  ["_activitySnapshot"]() {
    const _0x49f662 = [...this['tasks']["values"]()]["filter"](_0x47d4a8 => _0x47d4a8["status"] === "processing")["map"](_0x2e8596 => this["_snapshot"](_0x2e8596));
    const _0x545d95 = this["waiting"]["filter"](_0x4123d6 => _0x4123d6["status"] === 'waiting')["length"];
    const _0x45e853 = _0x49f662['length'] > 0x0 ? _0x49f662["reduce"]((_0x253493, _0x285f64) => _0x253493 + clampProgress(_0x285f64["progress"]), 0x0) / _0x49f662["length"] : 0x0;
    return {
      'activeCount': _0x49f662["length"],
      'waitingCount': _0x545d95,
      'totalCount': _0x49f662["length"] + _0x545d95,
      'progress': clampProgress(_0x45e853),
      'activeTasks': _0x49f662
    };
  }
  ["_snapshot"](_0x1cff32) {
    return {
      'taskId': _0x1cff32['id'],
      'nodeId': _0x1cff32["nodeId"],
      'assetId': _0x1cff32["payload"]?.['assetId'] || '',
      'kind': _0x1cff32["kind"],
      'purpose': String(_0x1cff32["payload"]?.["purpose"] || ''),
      'cancellable': _0x1cff32['cancellable'] === !![],
      'priority': normalizeTaskPriority(_0x1cff32["priority"]),
      'status': _0x1cff32["status"],
      'progress': clampProgress(_0x1cff32["progress"]),
      'stage': _0x1cff32["stage"] || '',
      'message': _0x1cff32["message"] || '',
      'error': _0x1cff32['error'] || '',
      'result': _0x1cff32["result"] || null,
      'createdAt': _0x1cff32["createdAt"],
      'startedAt': _0x1cff32['startedAt'],
      'finishedAt': _0x1cff32['finishedAt']
    };
  }
}
export function __parseFfmpegTimeSecondsForTest(_0x5c0627) {
  return parseFfmpegTimeSeconds(_0x5c0627);
}