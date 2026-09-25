import a180_0xdd13fa from 'node:path';
import { randomUUID } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { MANAGED_AGENT_SKILL_OWNER, parseAgentSkillMarkdown, serializeManagedAgentSkillDefinition } from '../src/modules/agent/agentSkillPackage.js';
const MAX_SKILL_PACKAGES = 0x64;
const MAX_SKILL_MD_BYTES = 0x80 * 0x400;
const MAX_RESOURCE_NAMES = 0x18;
const MAX_RESOURCE_BYTES = 0x10 * 0x400;
const MAX_RESOURCE_TOTAL_BYTES = 0x30 * 0x400;
function isInsideRoot(_0x17cc3a, _0x5efeb3) {
  const _0xa54f97 = a180_0xdd13fa["relative"](_0x17cc3a, _0x5efeb3);
  return _0xa54f97 === '' || !_0xa54f97["startsWith"]('..') && !a180_0xdd13fa["isAbsolute"](_0xa54f97);
}
async function isPlainDirectory(_0x4fcf81) {
  try {
    const _0x10e8d7 = await lstat(_0x4fcf81);
    return _0x10e8d7["isDirectory"]() && !_0x10e8d7["isSymbolicLink"]();
  } catch {
    return ![];
  }
}
async function readResourceSnapshot(_0x232891) {
  const _0x27226f = a180_0xdd13fa["join"](_0x232891, "references");
  if (!(await isPlainDirectory(_0x27226f))) {
    return {
      'resourceNames': [],
      'resources': []
    };
  }
  const _0x35f8f8 = await readdir(_0x27226f, {
    'withFileTypes': !![]
  });
  const _0x3e231f = _0x35f8f8["filter"](_0x4a0ee9 => _0x4a0ee9["isFile"]() && !_0x4a0ee9["isSymbolicLink"]())["map"](_0x3b1279 => _0x3b1279["name"])['filter'](_0x3adf93 => /\.(?:md|txt|json)$/i["test"](_0x3adf93))["sort"]((_0x472e54, _0x26e88b) => _0x472e54["localeCompare"](_0x26e88b))["slice"](0x0, MAX_RESOURCE_NAMES);
  const _0x289b9b = [];
  let _0x14c400 = 0x0;
  for (const _0x1471d9 of _0x3e231f) {
    const _0x3ac54b = a180_0xdd13fa["join"](_0x27226f, _0x1471d9);
    try {
      const _0x564a80 = await lstat(_0x3ac54b);
      if (!_0x564a80["isFile"]() || _0x564a80['isSymbolicLink']()) {
        continue;
      }
      if (_0x564a80["size"] > MAX_RESOURCE_BYTES || _0x14c400 + _0x564a80["size"] > MAX_RESOURCE_TOTAL_BYTES) {
        continue;
      }
      const _0x4f8a20 = await readFile(_0x3ac54b, "utf8");
      _0x14c400 += _0x564a80["size"];
      _0x289b9b["push"]({
        'name': "references/" + _0x1471d9,
        'content': _0x4f8a20
      });
    } catch {}
  }
  return {
    'resourceNames': _0x3e231f["map"](_0x2c1d18 => "references/" + _0x2c1d18),
    'resources': _0x289b9b
  };
}
function operationFailure(_0x41d9f5, _0x291432) {
  return {
    'success': ![],
    'canceled': ![],
    'errorCode': _0x41d9f5,
    'message': String(_0x291432 || _0x41d9f5)["slice"](0x0, 0x12c)
  };
}
async function pathExists(_0x1d76ea) {
  try {
    await lstat(_0x1d76ea);
    return !![];
  } catch (_0xe8bf4c) {
    if (_0xe8bf4c?.['code'] === 'ENOENT') {
      return ![];
    }
    throw _0xe8bf4c;
  }
}
export function createAgentSkillCapabilityOperations({
  getUserDataRoot: _0x5d32d3,
  showOpenDialog: _0x3d9197,
  openFolder: _0x1c5bdd
} = {}) {
  function _0x4699cd() {
    const _0x50d30c = String(_0x5d32d3?.() || '')["trim"]();
    if (!_0x50d30c) {
      throw new Error("User data directory is unavailable.");
    }
    const _0xf8532f = a180_0xdd13fa["resolve"](_0x50d30c);
    return {
      'userDataRoot': _0xf8532f,
      'skillsRoot': a180_0xdd13fa["join"](_0xf8532f, "skills")
    };
  }
  return {
    async 'list'() {
      const {
        skillsRoot: _0xb3e364
      } = _0x4699cd();
      await mkdir(_0xb3e364, {
        'recursive': !![]
      });
      const _0x57d89a = (await readdir(_0xb3e364, {
        'withFileTypes': !![]
      }))['filter'](_0x372058 => _0x372058['isDirectory']() && !_0x372058['isSymbolicLink']())["sort"]((_0x2e9a0d, _0x43f479) => _0x2e9a0d["name"]['localeCompare'](_0x43f479['name']))["slice"](0x0, MAX_SKILL_PACKAGES);
      const _0x34c67b = [];
      const _0x2882e1 = [];
      for (const _0x28d5c8 of _0x57d89a) {
        const _0x111dd7 = a180_0xdd13fa["resolve"](_0xb3e364, _0x28d5c8['name']);
        if (!isInsideRoot(_0xb3e364, _0x111dd7) || !(await isPlainDirectory(_0x111dd7))) {
          continue;
        }
        const _0x3d5900 = a180_0xdd13fa["join"](_0x111dd7, "SKILL.md");
        try {
          const _0x516eb6 = await lstat(_0x3d5900);
          if (!_0x516eb6["isFile"]() || _0x516eb6["isSymbolicLink"]()) {
            throw new Error("SKILL.md is not a plain file");
          }
          if (_0x516eb6["size"] > MAX_SKILL_MD_BYTES) {
            _0x2882e1["push"]({
              'packageId': _0x28d5c8['name'],
              'errorCode': "SKILL_MD_TOO_LARGE",
              'message': "SKILL.md exceeds the supported size limit."
            });
            continue;
          }
          const _0x501d6e = await readFile(_0x3d5900, "utf8");
          const _0x4cb132 = await readResourceSnapshot(_0x111dd7);
          _0x34c67b['push']({
            'packageId': _0x28d5c8["name"],
            'markdown': _0x501d6e,
            ..._0x4cb132,
            'hasScripts': await isPlainDirectory(a180_0xdd13fa['join'](_0x111dd7, "scripts"))
          });
        } catch (_0x44cfb1) {
          _0x2882e1['push']({
            'packageId': _0x28d5c8["name"],
            'errorCode': _0x44cfb1?.['code'] === "ENOENT" ? "SKILL_MD_NOT_FOUND" : "SKILL_MD_READ_FAILED",
            'message': String(_0x44cfb1?.["message"] || _0x44cfb1 || 'Unable\x20to\x20read\x20SKILL.md')["slice"](0x0, 0x12c)
          });
        }
      }
      return {
        'rootPath': _0xb3e364,
        'packages': _0x34c67b,
        'diagnostics': _0x2882e1
      };
    },
    async 'openRoot'() {
      if (typeof _0x1c5bdd !== 'function') {
        return operationFailure("SKILL_FOLDER_OPEN_UNAVAILABLE", "Skill folder opening is unavailable.");
      }
      const {
        skillsRoot: _0x349bbf
      } = _0x4699cd();
      await mkdir(_0x349bbf, {
        'recursive': !![]
      });
      await _0x1c5bdd(_0x349bbf);
      return {
        'success': !![],
        'canceled': ![],
        'rootPath': _0x349bbf
      };
    },
    async 'installFromFolder'() {
      if (typeof _0x3d9197 !== "function") {
        return operationFailure("SKILL_IMPORT_UNAVAILABLE", "Skill folder import is unavailable.");
      }
      const {
        userDataRoot: _0x3a4b0d,
        skillsRoot: _0xb5656a
      } = _0x4699cd();
      await mkdir(_0xb5656a, {
        'recursive': !![]
      });
      const _0x1ab8d8 = await _0x3d9197({
        'title': '导入\x20Agent\x20Skill\x20文件夹',
        'defaultPath': _0x3a4b0d,
        'properties': ['openDirectory']
      });
      if (_0x1ab8d8?.['canceled'] || !_0x1ab8d8?.["filePaths"]?.[0x0]) {
        return {
          'success': ![],
          'canceled': !![]
        };
      }
      const _0xacb0ae = a180_0xdd13fa['resolve'](String(_0x1ab8d8["filePaths"][0x0] || ''));
      if (!(await isPlainDirectory(_0xacb0ae))) {
        return operationFailure("SKILL_SOURCE_INVALID", 'Selected\x20Skill\x20source\x20is\x20not\x20a\x20plain\x20folder.');
      }
      const _0x573062 = a180_0xdd13fa['join'](_0xacb0ae, "SKILL.md");
      let _0x2d8939 = '';
      try {
        const _0x1428f5 = await lstat(_0x573062);
        if (!_0x1428f5["isFile"]() || _0x1428f5["isSymbolicLink"]()) {
          return operationFailure("SKILL_MD_READ_FAILED", "SKILL.md is not a plain file.");
        }
        if (_0x1428f5["size"] > MAX_SKILL_MD_BYTES) {
          return operationFailure("SKILL_MD_TOO_LARGE", 'SKILL.md\x20exceeds\x20the\x20supported\x20size\x20limit.');
        }
        _0x2d8939 = await readFile(_0x573062, "utf8");
      } catch (_0x594aa4) {
        return operationFailure(_0x594aa4?.["code"] === "ENOENT" ? "SKILL_MD_NOT_FOUND" : "SKILL_MD_READ_FAILED", _0x594aa4?.['message'] || "Unable to read SKILL.md.");
      }
      const _0x58b346 = parseAgentSkillMarkdown(_0x2d8939, {
        'packageId': a180_0xdd13fa["basename"](_0xacb0ae),
        'source': 'installed'
      });
      if (!_0x58b346['ok']) {
        return operationFailure(_0x58b346["errorCode"], _0x58b346["message"]);
      }
      const _0x486790 = _0x58b346["skill"]['id'];
      const _0x1b0926 = a180_0xdd13fa["resolve"](_0xb5656a, _0x486790);
      if (!isInsideRoot(_0xb5656a, _0x1b0926) || a180_0xdd13fa["dirname"](_0x1b0926) !== _0xb5656a) {
        return operationFailure("SKILL_DESTINATION_INVALID", 'Skill\x20destination\x20is\x20invalid.');
      }
      if (await pathExists(_0x1b0926)) {
        return operationFailure("SKILL_ALREADY_INSTALLED", "Skill " + _0x486790 + " is already installed.");
      }
      const _0xe30d89 = a180_0xdd13fa["join"](_0x3a4b0d, 'skill-install-staging');
      const _0x1565f7 = a180_0xdd13fa["join"](_0xe30d89, _0x486790 + '-' + randomUUID());
      const _0x4ec6ea = await readResourceSnapshot(_0xacb0ae);
      const _0x464a73 = await isPlainDirectory(a180_0xdd13fa["join"](_0xacb0ae, "scripts"));
      try {
        await mkdir(_0x1565f7, {
          'recursive': !![]
        });
        await writeFile(a180_0xdd13fa["join"](_0x1565f7, "SKILL.md"), _0x2d8939, "utf8");
        if (_0x4ec6ea["resources"]['length'] > 0x0) {
          const _0x363d1b = a180_0xdd13fa["join"](_0x1565f7, "references");
          await mkdir(_0x363d1b, {
            'recursive': !![]
          });
          for (const _0x534b17 of _0x4ec6ea["resources"]) {
            await writeFile(a180_0xdd13fa['join'](_0x363d1b, a180_0xdd13fa["basename"](_0x534b17["name"])), _0x534b17["content"], 'utf8');
          }
        }
        await rename(_0x1565f7, _0x1b0926);
      } catch (_0x504129) {
        if (_0x504129?.["code"] === 'EEXIST') {
          return operationFailure("SKILL_ALREADY_INSTALLED", "Skill " + _0x486790 + " is already installed.");
        }
        return operationFailure("SKILL_INSTALL_FAILED", _0x504129?.["message"] || 'Skill\x20installation\x20failed.');
      } finally {
        isInsideRoot(_0xe30d89, _0x1565f7) && (await rm(_0x1565f7, {
          'recursive': !![],
          'force': !![]
        })['catch'](() => {}));
      }
      return {
        'success': !![],
        'canceled': ![],
        'skillId': _0x486790,
        'rootPath': _0x1b0926,
        'importedResources': _0x4ec6ea['resources']["length"],
        'skippedResources': Math['max'](0x0, _0x4ec6ea["resourceNames"]["length"] - _0x4ec6ea['resources']['length']),
        'scriptsSkipped': _0x464a73
      };
    },
    async 'saveManagedDefinition'(_0x11a42a = {}) {
      const _0x4f2798 = _0x11a42a?.['mode'] === "update" ? "update" : "create";
      const _0x2e3dc4 = serializeManagedAgentSkillDefinition(_0x11a42a);
      if (!_0x2e3dc4['ok']) {
        return operationFailure(_0x2e3dc4['errorCode'], _0x2e3dc4['message']);
      }
      const {
        userDataRoot: _0x4ed935,
        skillsRoot: _0x481586
      } = _0x4699cd();
      await mkdir(_0x481586, {
        'recursive': !![]
      });
      const _0x2a7585 = _0x2e3dc4["definition"]['id'];
      const _0x590d0c = a180_0xdd13fa["resolve"](_0x481586, _0x2a7585);
      if (!isInsideRoot(_0x481586, _0x590d0c) || a180_0xdd13fa['dirname'](_0x590d0c) !== _0x481586) {
        return operationFailure("SKILL_DESTINATION_INVALID", "Skill destination is invalid.");
      }
      if (_0x4f2798 === "create") {
        if (await pathExists(_0x590d0c)) {
          return operationFailure('SKILL_ALREADY_INSTALLED', "Skill " + _0x2a7585 + '\x20is\x20already\x20installed.');
        }
        const _0x4d1077 = a180_0xdd13fa["join"](_0x4ed935, "skill-install-staging");
        const _0x243374 = a180_0xdd13fa["join"](_0x4d1077, _0x2a7585 + '-' + randomUUID());
        try {
          await mkdir(_0x243374, {
            'recursive': !![]
          });
          await writeFile(a180_0xdd13fa["join"](_0x243374, "SKILL.md"), _0x2e3dc4["markdown"], "utf8");
          await rename(_0x243374, _0x590d0c);
        } catch (_0x32094) {
          if (_0x32094?.["code"] === "EEXIST") {
            return operationFailure("SKILL_ALREADY_INSTALLED", "Skill " + _0x2a7585 + " is already installed.");
          }
          return operationFailure('SKILL_SAVE_FAILED', _0x32094?.['message'] || "Skill save failed.");
        } finally {
          isInsideRoot(_0x4d1077, _0x243374) && (await rm(_0x243374, {
            'recursive': !![],
            'force': !![]
          })["catch"](() => {}));
        }
        return {
          'success': !![],
          'canceled': ![],
          'skillId': _0x2a7585,
          'mode': _0x4f2798
        };
      }
      if (!(await isPlainDirectory(_0x590d0c))) {
        return operationFailure('SKILL_NOT_FOUND', "Skill " + _0x2a7585 + " was not found.");
      }
      const _0x427beb = a180_0xdd13fa['join'](_0x590d0c, "SKILL.md");
      try {
        const _0x15aa39 = await lstat(_0x427beb);
        if (!_0x15aa39["isFile"]() || _0x15aa39["isSymbolicLink"]() || _0x15aa39['size'] > MAX_SKILL_MD_BYTES) {
          return operationFailure("SKILL_NOT_EDITABLE", "Skill is not editable in the app.");
        }
        const _0x385fb8 = await readFile(_0x427beb, 'utf8');
        const _0x592169 = parseAgentSkillMarkdown(_0x385fb8, {
          'packageId': _0x2a7585,
          'source': "installed"
        });
        if (!_0x592169['ok'] || _0x592169["skill"]['id'] !== _0x2a7585 || _0x592169["skill"]["managedBy"] !== MANAGED_AGENT_SKILL_OWNER) {
          return operationFailure("SKILL_NOT_EDITABLE", "Skill is not editable in the app.");
        }
      } catch (_0x2f5fd7) {
        return operationFailure(_0x2f5fd7?.["code"] === "ENOENT" ? 'SKILL_NOT_FOUND' : "SKILL_SAVE_FAILED", _0x2f5fd7?.['message'] || "Skill save failed.");
      }
      const _0x17a586 = a180_0xdd13fa["join"](_0x590d0c, ".SKILL.md." + randomUUID() + '.tmp');
      try {
        await writeFile(_0x17a586, _0x2e3dc4["markdown"], "utf8");
        await rename(_0x17a586, _0x427beb);
      } catch (_0x508571) {
        return operationFailure("SKILL_SAVE_FAILED", _0x508571?.['message'] || 'Skill\x20save\x20failed.');
      } finally {
        await rm(_0x17a586, {
          'force': !![]
        })["catch"](() => {});
      }
      return {
        'success': !![],
        'canceled': ![],
        'skillId': _0x2a7585,
        'mode': _0x4f2798
      };
    },
    async 'deleteInstalled'(_0x4eb006 = {}) {
      const _0x403d34 = String(_0x4eb006?.['id'] || '')["trim"]()["toLowerCase"]();
      if (!/^[a-z0-9][a-z0-9-]{0,63}$/["test"](_0x403d34)) {
        return operationFailure('INVALID_SKILL_ID', "Skill id is invalid.");
      }
      if (_0x4eb006?.['confirmed'] !== !![]) {
        return operationFailure("SKILL_DELETE_CONFIRMATION_REQUIRED", "Deleting a Skill requires explicit confirmation.");
      }
      const {
        skillsRoot: _0x59bdde
      } = _0x4699cd();
      await mkdir(_0x59bdde, {
        'recursive': !![]
      });
      const _0x1e95fe = a180_0xdd13fa["resolve"](_0x59bdde, _0x403d34);
      if (!isInsideRoot(_0x59bdde, _0x1e95fe) || a180_0xdd13fa['dirname'](_0x1e95fe) !== _0x59bdde) {
        return operationFailure("SKILL_DESTINATION_INVALID", "Skill destination is invalid.");
      }
      if (!(await isPlainDirectory(_0x1e95fe))) {
        return operationFailure('SKILL_NOT_FOUND', 'Skill\x20' + _0x403d34 + " was not found.");
      }
      const _0xffd939 = a180_0xdd13fa["join"](_0x1e95fe, "SKILL.md");
      try {
        const _0x253f1a = await lstat(_0xffd939);
        if (!_0x253f1a["isFile"]() || _0x253f1a["isSymbolicLink"]()) {
          return operationFailure("SKILL_DELETE_FAILED", "Skill package is not a plain package.");
        }
        const _0x498ae6 = parseAgentSkillMarkdown(await readFile(_0xffd939, 'utf8'), {
          'packageId': _0x403d34,
          'source': "installed"
        });
        if (!_0x498ae6['ok'] || _0x498ae6["skill"]['id'] !== _0x403d34) {
          return operationFailure('SKILL_DELETE_FAILED', 'Skill\x20package\x20identity\x20is\x20invalid.');
        }
        await rm(_0x1e95fe, {
          'recursive': !![],
          'force': ![]
        });
      } catch (_0x51f3e6) {
        return operationFailure(_0x51f3e6?.['code'] === "ENOENT" ? "SKILL_NOT_FOUND" : "SKILL_DELETE_FAILED", _0x51f3e6?.["message"] || "Skill deletion failed.");
      }
      return {
        'success': !![],
        'canceled': ![],
        'skillId': _0x403d34
      };
    }
  };
}
export const agentSkillCapabilityInternals = Object['freeze']({
  'isInsideRoot': isInsideRoot,
  'pathExists': pathExists
});