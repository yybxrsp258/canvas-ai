const AGENT_SKILL_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;
const AGENT_SKILL_MARKDOWN_MAX_CHARS = 0x80 * 0x400;
const AGENT_SKILL_INSTRUCTIONS_MAX_CHARS = 0x18 * 0x400;
export const MANAGED_AGENT_SKILL_OWNER = "canvas-ai";
function normalizeText(_0x9e3252, _0x43264d = 0x0) {
  const _0x90cacd = String(_0x9e3252 == null ? '' : _0x9e3252)["trim"]();
  return _0x43264d > 0x0 ? _0x90cacd['slice'](0x0, _0x43264d) : _0x90cacd;
}
function parseScalar(_0x5e632f = '') {
  const _0x2ddebd = String(_0x5e632f || '')["trim"]();
  if (!_0x2ddebd) {
    return '';
  }
  if (_0x2ddebd === "true") {
    return !![];
  }
  if (_0x2ddebd === "false") {
    return ![];
  }
  if (_0x2ddebd === "null") {
    return null;
  }
  if (/^-?\d+(?:\.\d+)?$/["test"](_0x2ddebd)) {
    return Number(_0x2ddebd);
  }
  if (_0x2ddebd["startsWith"]('[') && _0x2ddebd["endsWith"](']')) {
    try {
      return JSON['parse'](_0x2ddebd);
    } catch {}
  }
  if (_0x2ddebd["startsWith"]('\x22') && _0x2ddebd['endsWith']('\x22') || _0x2ddebd["startsWith"]('\x27') && _0x2ddebd["endsWith"]('\x27')) {
    return _0x2ddebd["slice"](0x1, -0x1);
  }
  return _0x2ddebd;
}
function parseFrontmatter(_0x5ca9f5 = '') {
  const _0x41f6b1 = {};
  let _0x3590f2 = null;
  let _0x5d755f = null;
  let _0x1c9e8a = -0x1;
  const _0x1a0557 = String(_0x5ca9f5 || '')["split"](/\r?\n/);
  const _0x2cc876 = (_0x3e2f3c, _0x4e5afd) => {
    for (let _0x908cd1 = _0x3e2f3c + 0x1; _0x908cd1 < _0x1a0557['length']; _0x908cd1 += 0x1) {
      const _0x44bbf8 = _0x1a0557[_0x908cd1];
      if (!_0x44bbf8['trim']() || _0x44bbf8["trimStart"]()['startsWith']('#')) {
        continue;
      }
      const _0xe74cb4 = _0x44bbf8["length"] - _0x44bbf8["trimStart"]()["length"];
      if (_0xe74cb4 <= _0x4e5afd) {
        return {};
      }
      return _0x44bbf8["trim"]()["startsWith"]('-\x20') ? [] : {};
    }
    return {};
  };
  for (let _0x3e9139 = 0x0; _0x3e9139 < _0x1a0557["length"]; _0x3e9139 += 0x1) {
    const _0x1093d4 = _0x1a0557[_0x3e9139];
    if (!_0x1093d4["trim"]() || _0x1093d4["trimStart"]()["startsWith"]('#')) {
      continue;
    }
    const _0x4139d0 = _0x1093d4["length"] - _0x1093d4["trimStart"]()['length'];
    const _0x28304f = _0x1093d4['trim']();
    if (_0x28304f["startsWith"]('-\x20') && _0x5d755f && _0x4139d0 > _0x1c9e8a) {
      _0x5d755f['push'](parseScalar(_0x28304f["slice"](0x2)));
      continue;
    }
    const _0x8752e4 = _0x28304f['indexOf'](':');
    if (_0x8752e4 <= 0x0) {
      continue;
    }
    const _0x4debc0 = _0x28304f['slice'](0x0, _0x8752e4)["trim"]();
    const _0x5d64c7 = _0x28304f['slice'](_0x8752e4 + 0x1)["trim"]();
    if (_0x4139d0 === 0x0) {
      _0x5d755f = null;
      _0x1c9e8a = -0x1;
      !_0x5d64c7 ? (_0x41f6b1[_0x4debc0] = _0x2cc876(_0x3e9139, _0x4139d0), _0x3590f2 = _0x41f6b1[_0x4debc0], Array['isArray'](_0x3590f2) && (_0x5d755f = _0x3590f2, _0x1c9e8a = _0x4139d0)) : (_0x41f6b1[_0x4debc0] = parseScalar(_0x5d64c7), _0x3590f2 = null);
      continue;
    }
    if (!_0x3590f2 || Array["isArray"](_0x3590f2) || typeof _0x3590f2 !== "object") {
      continue;
    }
    !_0x5d64c7 ? (_0x3590f2[_0x4debc0] = _0x2cc876(_0x3e9139, _0x4139d0), _0x5d755f = Array["isArray"](_0x3590f2[_0x4debc0]) ? _0x3590f2[_0x4debc0] : null, _0x1c9e8a = _0x5d755f ? _0x4139d0 : -0x1) : (_0x3590f2[_0x4debc0] = parseScalar(_0x5d64c7), _0x5d755f = null, _0x1c9e8a = -0x1);
  }
  return _0x41f6b1;
}
function stringArray(_0x5a9940) {
  const _0x5ddf55 = Array["isArray"](_0x5a9940) ? _0x5a9940 : typeof _0x5a9940 === "string" && _0x5a9940["trim"]() ? _0x5a9940["split"](',') : [];
  return [...new Set(_0x5ddf55['map'](_0x2ec148 => normalizeText(_0x2ec148, 0xa0))["filter"](Boolean))];
}
function normalizeResources(_0x36df9b = []) {
  return (Array['isArray'](_0x36df9b) ? _0x36df9b : [])["map"]((_0x509579 = {}) => ({
    'name': normalizeText(_0x509579['name'], 0xa0),
    'content': normalizeText(_0x509579['content'], 0x10 * 0x400)
  }))["filter"](_0x531546 => _0x531546['name'] && _0x531546["content"])["slice"](0x0, 0x18);
}
function getField(_0x5e731e, _0x33b65e, ..._0x53d8a2) {
  for (const _0x1b37a4 of _0x53d8a2) {
    if (Object["prototype"]["hasOwnProperty"]["call"](_0x33b65e, _0x1b37a4)) {
      return _0x33b65e[_0x1b37a4];
    }
    if (Object["prototype"]["hasOwnProperty"]['call'](_0x5e731e, _0x1b37a4)) {
      return _0x5e731e[_0x1b37a4];
    }
  }
  return undefined;
}
function failure(_0x5b4c2c, _0x2913b1, _0x2902c8 = '') {
  return {
    'ok': ![],
    'errorCode': _0x5b4c2c,
    'message': _0x2913b1,
    'packageId': normalizeText(_0x2902c8, 0x64)
  };
}
export function parseAgentSkillMarkdown(_0xe9a7b2 = '', {
  packageId = '',
  source = "installed",
  resourceNames = [],
  resources = [],
  hasScripts = ![]
} = {}) {
  const _0x3429d5 = String(_0xe9a7b2 || '')["replace"](/^\uFEFF/, '');
  if (_0x3429d5["length"] > AGENT_SKILL_MARKDOWN_MAX_CHARS) {
    return failure("SKILL_MD_TOO_LARGE", "SKILL.md exceeds the supported size limit.", packageId);
  }
  const _0x36a789 = _0x3429d5["match"](/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)([\s\S]*)$/);
  if (!_0x36a789) {
    return failure("MISSING_SKILL_FRONTMATTER", 'SKILL.md\x20must\x20start\x20with\x20YAML\x20frontmatter.', packageId);
  }
  const _0x392613 = parseFrontmatter(_0x36a789[0x1]);
  const _0x1f3656 = _0x392613['metadata'] && typeof _0x392613["metadata"] === "object" ? _0x392613["metadata"] : {};
  const _0x5ceffb = normalizeText(_0x392613["name"] || _0x392613['id'])["toLowerCase"]();
  if (!AGENT_SKILL_ID_PATTERN["test"](_0x5ceffb)) {
    return failure("INVALID_SKILL_ID", 'Skill\x20name\x20must\x20use\x20lowercase\x20letters,\x20numbers,\x20and\x20hyphens.', packageId);
  }
  const _0x3a6909 = normalizeText(_0x392613["description"], 0x258);
  if (!_0x3a6909) {
    return failure('MISSING_SKILL_DESCRIPTION', "Skill description is required.", packageId);
  }
  const _0x56e0ac = getField(_0x392613, _0x1f3656, "scriptsEnabled", "scripts-enabled") === !![];
  if (_0x56e0ac) {
    return failure("SKILL_SCRIPTS_NOT_SUPPORTED", "Skill script execution is not enabled in this runtime.", packageId);
  }
  const _0x26312e = stringArray(getField(_0x392613, _0x1f3656, "triggers"));
  const _0x4ca346 = stringArray(getField(_0x392613, _0x1f3656, 'appliesWhen', "applies-when"));
  const _0x45c1c2 = stringArray(getField(_0x392613, _0x1f3656, "commands", 'canvas-commands'));
  const _0x13f0d7 = stringArray(getField(_0x392613, _0x1f3656, "requiredInputs", "required-inputs"));
  const _0x1f8efd = stringArray(getField(_0x392613, _0x1f3656, "missingInputQuestions", 'missing-input-questions'));
  const _0xcf8eae = getField(_0x392613, _0x1f3656, "manualOnly", 'manual-only');
  const _0x2f4646 = normalizeText(_0x36a789[0x2], AGENT_SKILL_INSTRUCTIONS_MAX_CHARS);
  return {
    'ok': !![],
    'skill': {
      'schemaVersion': 0x1,
      'id': _0x5ceffb,
      'title': normalizeText(getField(_0x392613, _0x1f3656, "title"), 0x78) || _0x5ceffb,
      'description': _0x3a6909,
      'category': normalizeText(getField(_0x392613, _0x1f3656, "category"), 0x50) || "general",
      'version': normalizeText(getField(_0x392613, _0x1f3656, "version"), 0x28) || "local",
      'riskLevel': normalizeText(getField(_0x392613, _0x1f3656, 'riskLevel', "risk-level"), 0x14) || "safe",
      'recommendedModelKind': normalizeText(getField(_0x392613, _0x1f3656, "recommendedModelKind", "recommended-model-kind"), 0x28),
      'triggers': _0x26312e,
      'appliesWhen': _0x4ca346,
      'requiredInputs': _0x13f0d7,
      'missingInputQuestions': _0x1f8efd,
      'commands': _0x45c1c2,
      'defaultParams': {},
      'manualOnly': _0xcf8eae === !![],
      'managedBy': normalizeText(getField(_0x392613, _0x1f3656, "managedBy", "managed-by"), 0x50),
      'instructions': _0x2f4646,
      'source': normalizeText(source, 0x28) || "installed",
      'packageId': normalizeText(packageId, 0x64) || _0x5ceffb,
      'resourceNames': stringArray(resourceNames)['slice'](0x0, 0x18),
      'resources': normalizeResources(resources),
      'execution': {
        'scriptsAvailable': hasScripts === !![],
        'scriptsEnabled': ![]
      }
    }
  };
}
function yamlQuoted(_0x314b1c) {
  return JSON['stringify'](String(_0x314b1c == null ? '' : _0x314b1c));
}
export function serializeManagedAgentSkillDefinition({
  id = '',
  title = '',
  description = '',
  triggers = [],
  instructions = ''
} = {}) {
  const _0xf9f02b = normalizeText(id, 0x40)["toLowerCase"]();
  if (!AGENT_SKILL_ID_PATTERN["test"](_0xf9f02b)) {
    return failure("INVALID_SKILL_ID", "Skill name must use lowercase letters, numbers, and hyphens.", _0xf9f02b);
  }
  const _0x110505 = normalizeText(description, 0x258);
  if (!_0x110505) {
    return failure("MISSING_SKILL_DESCRIPTION", "Skill description is required.", _0xf9f02b);
  }
  const _0x4b702a = normalizeText(instructions, AGENT_SKILL_INSTRUCTIONS_MAX_CHARS);
  if (!_0x4b702a) {
    return failure("MISSING_SKILL_INSTRUCTIONS", "Skill instructions are required.", _0xf9f02b);
  }
  const _0x34e059 = normalizeText(title, 0x78) || _0xf9f02b;
  const _0x1d3a32 = stringArray(triggers)["slice"](0x0, 0x18);
  const _0x1b5737 = _0x1d3a32["map"](_0x580a48 => "    - " + yamlQuoted(_0x580a48));
  const _0x2c6020 = ["---", "name: " + _0xf9f02b, "description: " + yamlQuoted(_0x110505), 'metadata:', "  title: " + yamlQuoted(_0x34e059), "  managed-by: " + MANAGED_AGENT_SKILL_OWNER, ...(_0x1b5737["length"] > 0x0 ? ["  triggers:", ..._0x1b5737] : []), "---", '', _0x4b702a, '']["join"]('\x0a');
  return {
    'ok': !![],
    'markdown': _0x2c6020,
    'definition': {
      'id': _0xf9f02b,
      'title': _0x34e059,
      'description': _0x110505,
      'triggers': _0x1d3a32,
      'instructions': _0x4b702a,
      'managedBy': MANAGED_AGENT_SKILL_OWNER
    }
  };
}
export const agentSkillPackageInternals = Object["freeze"]({
  'parseFrontmatter': parseFrontmatter,
  'parseScalar': parseScalar,
  'yamlQuoted': yamlQuoted
});