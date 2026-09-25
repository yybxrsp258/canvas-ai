export function registerAgentSkillsIpcHandlers({
  ipcMain: _0x599fd9,
  agentSkillOperations: _0x7082ce
}) {
  _0x599fd9["handle"]("agentSkills:list", () => _0x7082ce["list"]());
  _0x599fd9["handle"]('agentSkills:openRoot', () => _0x7082ce["openRoot"]());
  _0x599fd9["handle"]("agentSkills:installFromFolder", () => _0x7082ce['installFromFolder']());
  _0x599fd9["handle"]("agentSkills:saveManaged", (_0x62a9c7, _0x5281ee) => _0x7082ce["saveManagedDefinition"](_0x5281ee));
  _0x599fd9["handle"]("agentSkills:deleteInstalled", (_0x53ad16, _0x4a1845) => _0x7082ce["deleteInstalled"](_0x4a1845));
}