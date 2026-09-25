import { createCanvasCommandError } from './commandRegistry.js';
import a972_0x245b7c from '../../core/nodeRuntimeRegistry.js';
function getState(_0x227078) {
  return _0x227078["store"]?.['getStateRaw']?.() || _0x227078["store"]?.["getState"]?.() || {};
}
function getNode(_0xc0c989, _0xc0fe87) {
  const _0x630507 = String(_0xc0fe87 || '')["trim"]();
  return _0x630507 ? getState(_0xc0c989)["nodes"]?.[_0x630507] || null : null;
}
function getNodeRuntime(_0x8c8f43, _0x557d6f) {
  const _0x5269e6 = _0x8c8f43['nodeRuntimeRegistry'] || a972_0x245b7c;
  return typeof _0x5269e6?.["resolve"] === "function" ? _0x5269e6["resolve"](_0x557d6f, {
    'store': _0x8c8f43["store"]
  }) : _0x5269e6?.["get"]?.(_0x557d6f) || null;
}
function validateNodeId(_0x45f0e4 = {}, _0x4af0b8 = {}, _0x1131fd = "generation command", {
  allowOptions = ![]
} = {}) {
  const _0x4c9abb = String(_0x45f0e4["nodeId"] || '')["trim"]();
  if (!_0x4c9abb) {
    return {
      'ok': ![],
      'errorCode': "MISSING_NODE_ID",
      'message': _0x1131fd + " requires nodeId."
    };
  }
  if (!getNode(_0x4af0b8, _0x4c9abb)) {
    return {
      'ok': ![],
      'errorCode': "NODE_NOT_FOUND",
      'message': "Canvas node not found: " + _0x4c9abb
    };
  }
  return {
    'args': {
      'nodeId': _0x4c9abb,
      'options': allowOptions && _0x45f0e4["options"] && typeof _0x45f0e4["options"] === "object" ? _0x45f0e4["options"] : {}
    }
  };
}
async function cancelViaRuntime(_0x12bc0c, _0x1a364d) {
  const _0x1e9fd2 = _0x1a364d["generationRuntime"] || {};
  if (typeof _0x1e9fd2["cancelTask"] !== "function") {
    throw createCanvasCommandError("GENERATION_CANCEL_UNAVAILABLE", "generation.cancel did not find public cancelGeneration() or a task runtime cancel entry.");
  }
  const _0x1486f3 = await _0x1e9fd2["cancelTask"](_0x12bc0c["nodeId"], {
    'store': _0x1a364d["store"],
    'abortLocal': !![]
  });
  if (!_0x1486f3?.['ok']) {
    throw createCanvasCommandError("GENERATION_CANCEL_UNAVAILABLE", 'generation.cancel\x20did\x20not\x20find\x20a\x20cancellable\x20public\x20generation\x20task.', _0x1486f3 || null);
  }
  return _0x1486f3;
}
function getStoreStatus(_0x1b8e8e = {}) {
  return {
    'jobStatus': String(_0x1b8e8e['jobStatus'] || _0x1b8e8e["storyboardScript"]?.["jobStatus"] || (_0x1b8e8e["isGenerating"] ? "running" : "idle")),
    'isGenerating': _0x1b8e8e['isGenerating'] === !![] || _0x1b8e8e['storyboardScript']?.["isGenerating"] === !![] || String(_0x1b8e8e["storyboardScript"]?.["jobStatus"] || '') === "running",
    'taskId': String(_0x1b8e8e["taskId"] || _0x1b8e8e['rhTaskId'] || _0x1b8e8e["asyncTaskId"] || '')
  };
}
function pickGenerationTaskId(_0x1a3a39 = {}, _0x19b0bb = {}) {
  return String(_0x1a3a39?.["taskId"] || _0x1a3a39?.["targetTaskId"] || _0x1a3a39?.["result"]?.["taskId"] || _0x19b0bb['taskId'] || _0x19b0bb["rhTaskId"] || _0x19b0bb["asyncTaskId"] || '')["trim"]();
}
function normalizeGenerationStatus(_0x12bcc8 = {}, _0x3b3469 = {}) {
  const _0x1f5432 = _0x12bcc8?.["status"] || _0x12bcc8?.["jobStatus"] || _0x12bcc8?.["result"]?.['status'] || _0x3b3469["jobStatus"] || _0x3b3469["rhTaskStatus"] || _0x3b3469["asyncTaskStatus"] || '';
  const _0x1aa3a6 = String(_0x1f5432 || '')["trim"]()["toLowerCase"]();
  if (_0x1aa3a6) {
    return _0x1aa3a6;
  }
  if (_0x12bcc8?.['ok'] === ![]) {
    return "failed";
  }
  if (_0x12bcc8?.['ok'] === !![]) {
    return 'success';
  }
  return '';
}
const GENERATION_FAILURE_STATUSES = new Set(['failed', "fail", "error", "cancelled", 'canceled']);
const GENERATION_NOT_STARTED_STATUSES = new Set(['', "idle", "ready"]);
function isGenerationFailureStatus(_0x48babd = '') {
  return GENERATION_FAILURE_STATUSES["has"](String(_0x48babd || '')["trim"]()["toLowerCase"]());
}
function summarizeGenerationRunResult(_0x4fe2d3, _0x10e84b, _0x2bb790 = {}) {
  const _0x5727d9 = getNode(_0x2bb790, _0x4fe2d3) || {};
  const _0xe359b = pickGenerationTaskId(_0x10e84b, _0x5727d9);
  const _0x411b74 = normalizeGenerationStatus(_0x10e84b, _0x5727d9);
  const _0x159844 = String(_0x411b74 || '')["trim"]()["toLowerCase"]();
  const _0x290b33 = getStoreStatus(_0x5727d9);
  const _0x5008e4 = GENERATION_NOT_STARTED_STATUSES["has"](_0x159844) && !_0xe359b && _0x290b33["isGenerating"] !== !![];
  const _0xc2fba0 = _0x10e84b?.['ok'] === ![] || isGenerationFailureStatus(_0x159844) || _0x5008e4;
  return {
    'nodeId': _0x4fe2d3,
    'targetNodeId': String(_0x10e84b?.["targetNodeId"] || _0x4fe2d3),
    'status': _0xc2fba0 ? "failed" : _0x159844,
    'taskId': _0xe359b,
    ...(_0xc2fba0 ? {
      'errorCode': String(_0x10e84b?.["errorCode"] || (_0x5008e4 ? "GENERATION_NOT_STARTED" : "GENERATION_RUN_FAILED")),
      'message': String(_0x10e84b?.["message"] || (_0x5008e4 ? "Generation did not start. Check the node prompt, required inputs, and credentials." : "Generation failed."))
    } : {}),
    'value': _0x10e84b
  };
}
function validateBatchNodeIds(_0x33eb0f = {}, _0x1cebd9 = {}) {
  const _0x1c4824 = Array['isArray'](_0x33eb0f["nodeIds"]) ? [...new Set(_0x33eb0f["nodeIds"]["map"](_0x5347ee => String(_0x5347ee || '')['trim']())["filter"](Boolean))] : [];
  if (_0x1c4824["length"] === 0x0) {
    return {
      'ok': ![],
      'errorCode': "MISSING_NODE_IDS",
      'message': "generation.runBatch requires nodeIds."
    };
  }
  if (_0x1c4824["length"] > 0xc) {
    return {
      'ok': ![],
      'errorCode': 'GENERATION_BATCH_TOO_LARGE',
      'message': "generation.runBatch supports at most 12 nodes per batch."
    };
  }
  for (const _0x1d3ce6 of _0x1c4824) {
    if (!getNode(_0x1cebd9, _0x1d3ce6)) {
      return {
        'ok': ![],
        'errorCode': "NODE_NOT_FOUND",
        'message': "Canvas node not found: " + _0x1d3ce6
      };
    }
  }
  return {
    'args': {
      'nodeIds': _0x1c4824,
      'options': _0x33eb0f["options"] && typeof _0x33eb0f['options'] === 'object' ? _0x33eb0f["options"] : {}
    }
  };
}
function summarizeBatchStatus(_0x1e03d6 = []) {
  const _0x48431d = _0x1e03d6["map"](_0x157e23 => String(_0x157e23["status"] || '')["toLowerCase"]());
  if (_0x48431d['length'] === 0x0) {
    return '';
  }
  if (_0x48431d["every"](_0x5ad6 => _0x5ad6 === _0x48431d[0x0])) {
    return _0x48431d[0x0];
  }
  if (_0x48431d["some"](_0x29e8e6 => _0x29e8e6 === "failed" || _0x29e8e6 === 'error')) {
    return "partial_failed";
  }
  if (_0x48431d['some'](_0x3c0586 => ["submitted", "pending", "running"]["includes"](_0x3c0586))) {
    return 'pending';
  }
  return "mixed";
}
export function registerGenerationCommands(_0x4ea910) {
  _0x4ea910['register']({
    'id': "generation.runBatch",
    'description': "Run generation for multiple prepared canvas nodes as one confirmed batch. Prefer this when two or more nodes should start generation together.",
    'riskLevel': 'confirm',
    'argsSchema': {
      'required': ['nodeIds'],
      'properties': {
        'nodeIds': {
          'type': "array",
          'items': {
            'type': "string"
          },
          'maxItems': 0xc
        },
        'options': {
          'type': "object"
        }
      },
      'defaults': {
        'options': {}
      }
    },
    'capabilitySchema': {
      'reads': ['nodes', "nodeRuntimeRegistry"],
      'writes': ['nodes', "generationTasks"],
      'requiresMountedRuntime': ![]
    },
    'returnSchema': {
      'aliasFields': ['nodeIds', "status", 'results']
    },
    'validate'(_0x211b81 = {}, _0x4366f9 = {}) {
      return validateBatchNodeIds(_0x211b81, _0x4366f9);
    },
    async 'execute'(_0x536ae4, _0x35d0b3) {
      for (const _0x3c4d96 of _0x536ae4['nodeIds']) {
        const _0x56851f = getNodeRuntime(_0x35d0b3, _0x3c4d96);
        if (!_0x56851f) {
          throw createCanvasCommandError("GENERATION_NODE_NOT_MOUNTED", "Canvas node generation runtime is not registered: " + _0x3c4d96, {
            'nodeId': _0x3c4d96
          });
        }
        if (typeof _0x56851f["runGeneration"] !== "function") {
          throw createCanvasCommandError("GENERATION_RUN_UNAVAILABLE", "generation.runBatch did not find runGeneration() for node: " + _0x3c4d96, {
            'nodeId': _0x3c4d96
          });
        }
      }
      const _0x47d9f9 = await Promise["all"](_0x536ae4["nodeIds"]["map"](async _0x1af0d3 => {
        try {
          const _0x2693f4 = await getNodeRuntime(_0x35d0b3, _0x1af0d3)["runGeneration"](_0x536ae4["options"]);
          return summarizeGenerationRunResult(_0x1af0d3, _0x2693f4, _0x35d0b3);
        } catch (_0x498626) {
          return {
            'nodeId': _0x1af0d3,
            'targetNodeId': _0x1af0d3,
            'status': "failed",
            'taskId': '',
            'errorCode': String(_0x498626?.['errorCode'] || "GENERATION_RUN_FAILED"),
            'message': String(_0x498626?.['message'] || "Generation failed.")
          };
        }
      }));
      const _0x1d1fca = _0x47d9f9['filter'](_0x11f093 => isGenerationFailureStatus(_0x11f093["status"]));
      if (_0x1d1fca['length'] === _0x47d9f9['length']) {
        throw createCanvasCommandError("GENERATION_BATCH_NOT_STARTED", _0x1d1fca[0x0]?.["message"] || "No generation task in the batch was started.", {
          'nodeIds': [..._0x536ae4["nodeIds"]],
          'results': _0x47d9f9
        });
      }
      return {
        'nodeIds': [..._0x536ae4["nodeIds"]],
        'status': summarizeBatchStatus(_0x47d9f9),
        'results': _0x47d9f9
      };
    }
  });
  _0x4ea910['register']({
    'id': "generation.run",
    'description': 'Run\x20generation\x20for\x20a\x20canvas\x20node.',
    'riskLevel': "confirm",
    'argsSchema': {
      'required': ["nodeId"],
      'properties': {
        'nodeId': {
          'type': "string"
        },
        'options': {
          'type': "object"
        }
      },
      'defaults': {
        'options': {}
      }
    },
    'capabilitySchema': {
      'reads': ["nodes", "nodeRuntimeRegistry"],
      'writes': ["nodes", "generationTasks"],
      'requiresMountedRuntime': ![]
    },
    'returnSchema': {
      'aliasFields': ['nodeId', 'targetNodeId', "status", 'taskId', "value"]
    },
    'validate'(_0xfd655f = {}, _0x571878 = {}) {
      return validateNodeId(_0xfd655f, _0x571878, "generation.run", {
        'allowOptions': !![]
      });
    },
    async 'execute'(_0x280841, _0x338f34) {
      const _0x2a25a5 = getNodeRuntime(_0x338f34, _0x280841["nodeId"]);
      if (!_0x2a25a5) {
        throw createCanvasCommandError('GENERATION_NODE_NOT_MOUNTED', 'Canvas\x20node\x20generation\x20runtime\x20is\x20not\x20registered:\x20' + _0x280841["nodeId"], {
          'nodeId': _0x280841['nodeId']
        });
      }
      if (typeof _0x2a25a5["runGeneration"] !== "function") {
        throw createCanvasCommandError("GENERATION_RUN_UNAVAILABLE", "generation.run did not find a registered runGeneration() entry for the node.", {
          'nodeId': _0x280841['nodeId']
        });
      }
      const _0x5d2aec = await _0x2a25a5["runGeneration"](_0x280841["options"]);
      const _0x32594e = summarizeGenerationRunResult(_0x280841["nodeId"], _0x5d2aec, _0x338f34);
      if (isGenerationFailureStatus(_0x32594e['status'])) {
        throw createCanvasCommandError(_0x32594e['errorCode'] || 'GENERATION_RUN_FAILED', _0x32594e["message"] || "Generation failed.", _0x32594e);
      }
      return _0x32594e;
    }
  });
  _0x4ea910["register"]({
    'id': "generation.cancel",
    'description': "Cancel generation for a canvas node.",
    'riskLevel': "confirm",
    'argsSchema': {
      'required': ["nodeId"],
      'properties': {
        'nodeId': {
          'type': 'string'
        },
        'options': {
          'type': 'object'
        }
      },
      'defaults': {
        'options': {}
      }
    },
    'capabilitySchema': {
      'reads': ["nodes", "nodeRuntimeRegistry", 'generationRuntime'],
      'writes': ["nodes", "generationTasks"],
      'requiresMountedRuntime': ![]
    },
    'returnSchema': {
      'aliasFields': ["nodeId", 'value', 'source']
    },
    'validate'(_0x42f813 = {}, _0x4403cc = {}) {
      return validateNodeId(_0x42f813, _0x4403cc, "generation.cancel", {
        'allowOptions': !![]
      });
    },
    async 'execute'(_0x287f2c, _0x1ed2c3) {
      const _0x360022 = getNodeRuntime(_0x1ed2c3, _0x287f2c['nodeId']);
      if (typeof _0x360022?.["cancelGeneration"] === "function") {
        const _0x1c5a69 = await _0x360022["cancelGeneration"](_0x287f2c["options"]);
        if (_0x1c5a69?.['ok'] === ![]) {
          throw createCanvasCommandError("GENERATION_CANCEL_UNAVAILABLE", _0x1c5a69["message"] || "generation.cancel was rejected by the node.", _0x1c5a69);
        }
        return {
          'nodeId': _0x287f2c['nodeId'],
          'value': _0x1c5a69,
          'source': 'node'
        };
      }
      const _0x1a0626 = await cancelViaRuntime(_0x287f2c, _0x1ed2c3);
      return {
        'nodeId': _0x287f2c['nodeId'],
        'value': _0x1a0626,
        'source': "runtime"
      };
    }
  });
  _0x4ea910["register"]({
    'id': "generation.resume",
    'description': "Resume generation for a canvas node.",
    'riskLevel': "confirm",
    'argsSchema': {
      'required': ["nodeId"],
      'properties': {
        'nodeId': {
          'type': "string"
        },
        'options': {
          'type': "object"
        }
      },
      'defaults': {
        'options': {}
      }
    },
    'capabilitySchema': {
      'reads': ['nodes', "nodeRuntimeRegistry"],
      'writes': ["nodes", 'generationTasks'],
      'requiresMountedRuntime': ![]
    },
    'returnSchema': {
      'aliasFields': ["nodeId", 'value']
    },
    'validate'(_0x5f0491 = {}, _0x45cd4f = {}) {
      return validateNodeId(_0x5f0491, _0x45cd4f, 'generation.resume', {
        'allowOptions': !![]
      });
    },
    async 'execute'(_0x11c405, _0x3b5ac8) {
      const _0x27d097 = getNodeRuntime(_0x3b5ac8, _0x11c405["nodeId"]);
      if (typeof _0x27d097?.['resumeGeneration'] !== 'function') {
        throw createCanvasCommandError('GENERATION_RESUME_UNAVAILABLE', 'generation.resume\x20did\x20not\x20find\x20a\x20registered\x20resumeGeneration()\x20entry\x20for\x20the\x20node.', {
          'nodeId': _0x11c405["nodeId"]
        });
      }
      const _0x374c37 = await _0x27d097["resumeGeneration"](_0x11c405['options']);
      return {
        'nodeId': _0x11c405["nodeId"],
        'value': _0x374c37
      };
    }
  });
  _0x4ea910['register']({
    'id': 'generation.getStatus',
    'description': 'Get\x20generation\x20status\x20for\x20a\x20canvas\x20node.',
    'riskLevel': 'safe',
    'argsSchema': {
      'required': ["nodeId"],
      'properties': {
        'nodeId': {
          'type': "string"
        }
      }
    },
    'capabilitySchema': {
      'reads': ['nodes', "nodeRuntimeRegistry"],
      'writes': []
    },
    'returnSchema': {
      'aliasFields': ['nodeId', "status", "source"]
    },
    'validate'(_0x3d9020 = {}, _0x16e8df = {}) {
      return validateNodeId(_0x3d9020, _0x16e8df, 'generation.getStatus');
    },
    'execute'(_0xd23689, _0x1d07bf) {
      const _0x269563 = getNodeRuntime(_0x1d07bf, _0xd23689["nodeId"]);
      if (typeof _0x269563?.['getGenerationStatus'] === "function") {
        return {
          'nodeId': _0xd23689['nodeId'],
          'status': _0x269563["getGenerationStatus"](),
          'source': 'node'
        };
      }
      return {
        'nodeId': _0xd23689["nodeId"],
        'status': getStoreStatus(getNode(_0x1d07bf, _0xd23689["nodeId"]) || {}),
        'source': "store"
      };
    }
  });
}