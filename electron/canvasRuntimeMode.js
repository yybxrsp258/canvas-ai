import { shouldUseChromeShellRuntime } from './chromeShellLauncher.js';
export function createCanvasRuntimeModeController({
  env = process["env"],
  appIsPackaged = ![],
  platform = process["platform"]
} = {}) {
  let _0x47cbda = ![];
  return {
    'shouldUseChromeShellRuntime'() {
      return !_0x47cbda && shouldUseChromeShellRuntime(env, {
        'appIsPackaged': appIsPackaged,
        'platform': platform
      });
    },
    'useElectronForCurrentLaunch'() {
      _0x47cbda = !![];
    }
  };
}