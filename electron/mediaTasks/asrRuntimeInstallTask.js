import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream, existsSync, readFileSync } from 'node:fs';
import { mkdir, readdir, rm, rename, writeFile } from 'node:fs/promises';
import a260_0x270b07 from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import a260_0x37de9e from 'extract-zip';
import { resolveAsrRuntimeBaseDir, resolveAsrRuntimeInstallDir, resolveAsrRuntimePythonCommand, resolveAsrRuntimeStatePath } from '../asrRuntimeResolver.js';
import { resolvePreferredRuntimePythonCommand } from '../pythonRuntimeResolver.js';
const ASR_RUNTIME_STAGE = Object["freeze"]({
  'CHECK': "asr-runtime-check",
  'MANIFEST': "asr-runtime-manifest",
  'DOWNLOAD': 'asr-runtime-download',
  'EXTRACT': 'asr-runtime-extract',
  'VERIFY': "asr-runtime-verify"
});
function normalizeText(_0x47df15) {
  return String(_0x47df15 || '')["trim"]();
}
function normalizeUrl(_0x59cba3) {
  const _0x56e688 = normalizeText(_0x59cba3);
  if (!_0x56e688) {
    return '';
  }
  try {
    const _0x9d33b4 = new URL(_0x56e688);
    return _0x9d33b4['protocol'] === "http:" || _0x9d33b4["protocol"] === "https:" ? _0x9d33b4['href'] : '';
  } catch {
    return '';
  }
}
function normalizePlatform(_0x42f22e = process['platform']) {
  const _0x179352 = normalizeText(_0x42f22e)["toLowerCase"]();
  return _0x179352 || process['platform'];
}
function normalizeArch(_0x586b5b = process["arch"]) {
  const _0x2b831a = normalizeText(_0x586b5b)["toLowerCase"]();
  return _0x2b831a || process["arch"];
}
function normalizeManifestPackage(_0x4780c8 = {}) {
  if (!_0x4780c8 || typeof _0x4780c8 !== "object") {
    return null;
  }
  const _0x406139 = normalizeUrl(_0x4780c8["url"]);
  const _0x24fb4c = Array["isArray"](_0x4780c8["mirrors"]) ? _0x4780c8['mirrors']["map"](_0x22fe7a => normalizeUrl(typeof _0x22fe7a === "string" ? _0x22fe7a : _0x22fe7a?.["url"]))["filter"](Boolean) : [];
  return {
    'version': normalizeText(_0x4780c8["version"]),
    'platform': normalizePlatform(_0x4780c8["platform"]),
    'arch': normalizeArch(_0x4780c8['arch']),
    'url': _0x406139,
    'mirrors': _0x24fb4c,
    'sha256': normalizeText(_0x4780c8["sha256"])["toLowerCase"](),
    'size': Number(_0x4780c8["size"] || 0x0) || 0x0
  };
}
export function selectAsrRuntimePackage(_0x2e07fe = {}, {
  platform = process['platform'],
  arch = process["arch"]
} = {}) {
  const _0x1a450c = normalizePlatform(platform);
  const _0x6d0493 = normalizeArch(arch);
  const _0x1e47df = Array["isArray"](_0x2e07fe?.["packages"]) ? _0x2e07fe['packages']["map"](normalizeManifestPackage)["filter"](Boolean) : [normalizeManifestPackage(_0x2e07fe)]['filter'](Boolean);
  return _0x1e47df["find"](_0x3a4103 => _0x3a4103['platform'] === _0x1a450c && _0x3a4103["arch"] === _0x6d0493 && (_0x3a4103["url"] || _0x3a4103["mirrors"]["length"])) || null;
}
function getPackageDownloadUrl(_0x125ad6 = {}) {
  return normalizeUrl(_0x125ad6["url"]) || _0x125ad6['mirrors']?.["find"](Boolean) || '';
}
async function hashFileSha256(_0x8e1583) {
  const _0x4c57db = createHash("sha256");
  for await (const _0x2865cd of createReadStream(_0x8e1583)) {
    _0x4c57db['update'](_0x2865cd);
  }
  return _0x4c57db["digest"]("hex");
}
async function downloadToFile({
  fetchImpl = fetch,
  queue: _0x13aa1d,
  task: _0x4b9e69,
  targetPath: _0x16fb0e,
  url: _0xdca9a8
} = {}) {
  const _0x28e1fb = await fetchImpl(_0xdca9a8);
  if (!_0x28e1fb?.['ok']) {
    throw new Error("ASR runtime download failed: HTTP " + (_0x28e1fb?.["status"] || 'unknown'));
  }
  const _0x30f5c5 = Number(_0x28e1fb['headers']?.["get"]?.("content-length") || 0x0) || 0x0;
  let _0x332a4c = 0x0;
  const _0x80754f = _0x28e1fb["body"]?.["getReader"] ? Readable["fromWeb"](_0x28e1fb["body"]) : _0x28e1fb["body"];
  if (!_0x80754f) {
    throw new Error("ASR runtime download response is empty");
  }
  await mkdir(a260_0x270b07["dirname"](_0x16fb0e), {
    'recursive': !![]
  });
  await pipeline(_0x80754f, async function* (_0x30ed8e) {
    for await (const _0x258198 of _0x30ed8e) {
      _0x332a4c += Buffer['byteLength'](_0x258198);
      if (_0x30f5c5 > 0x0) {
        const _0x5c82d8 = Math["max"](0x0, Math["min"](0x1, _0x332a4c / _0x30f5c5));
        _0x13aa1d?.["emitProgress"]?.(_0x4b9e69, 0.18 + _0x5c82d8 * 0.42, "Downloading subtitle component " + Math["round"](_0x5c82d8 * 0x64) + '%', {
          'stage': ASR_RUNTIME_STAGE['DOWNLOAD']
        });
      }
      yield _0x258198;
    }
  }, createWriteStream(_0x16fb0e));
}
async function readManifest({
  fetchImpl = fetch,
  manifestUrl = ''
} = {}) {
  const _0x11e08d = normalizeUrl(manifestUrl);
  if (!_0x11e08d) {
    throw new Error('ASR\x20runtime\x20manifest\x20URL\x20is\x20not\x20configured');
  }
  const _0x4d4c12 = await fetchImpl(_0x11e08d);
  if (!_0x4d4c12?.['ok']) {
    throw new Error('ASR\x20runtime\x20manifest\x20request\x20failed:\x20HTTP\x20' + (_0x4d4c12?.['status'] || "unknown"));
  }
  return await _0x4d4c12["json"]();
}
function resolvePythonInExtractedRuntime(_0xa4fa02, _0x26d083 = process["platform"]) {
  return resolvePreferredRuntimePythonCommand({
    'existsSync': existsSync,
    'fallbackCommand': '',
    'platform': _0x26d083,
    'runtimeRoot': _0xa4fa02
  });
}
async function resolveExtractedRuntimeRoot(_0x2ff571, _0x5a7be2 = process["platform"]) {
  if (resolvePythonInExtractedRuntime(_0x2ff571, _0x5a7be2)) {
    return _0x2ff571;
  }
  const _0x494978 = await readdir(_0x2ff571, {
    'withFileTypes': !![]
  });
  const _0x2c38eb = _0x494978["filter"](_0xcd12c4 => _0xcd12c4["isDirectory"]())["map"](_0x3e61d2 => a260_0x270b07["join"](_0x2ff571, _0x3e61d2['name']));
  if (_0x2c38eb["length"] === 0x1 && resolvePythonInExtractedRuntime(_0x2c38eb[0x0], _0x5a7be2)) {
    return _0x2c38eb[0x0];
  }
  throw new Error("ASR runtime archive must contain a python runtime directory");
}
async function writeCurrentRuntimeState({
  arch: _0x2151e5,
  manifestUrl: _0x41c0b1,
  platform: _0x392123,
  runtimeRoot: _0x21dd35,
  sha256: _0x583130,
  statePath: _0x13cb7b,
  version: _0x2d207c
}) {
  await mkdir(a260_0x270b07['dirname'](_0x13cb7b), {
    'recursive': !![]
  });
  await writeFile(_0x13cb7b, JSON["stringify"]({
    'version': _0x2d207c,
    'runtimeRoot': _0x21dd35,
    'platform': _0x392123,
    'arch': _0x2151e5,
    'sha256': _0x583130,
    'manifestUrl': _0x41c0b1,
    'installedAt': Date["now"]()
  }, null, 0x2) + '\x0a', 'utf8');
}
async function runAsrRuntimeSmoke({
  appRoot: _0x46f5ee,
  pythonCommand: _0x29617c,
  queue: _0xaed177,
  task: _0x16ee98
} = {}) {
  if (!_0x29617c) {
    throw new Error("ASR Python runtime is unavailable");
  }
  await _0xaed177["runProcess"](_0x16ee98, _0x29617c, ['-c', ["import torch", "import torchaudio", "import funasr", "import modelscope", 'from\x20nemo.collections.asr.models\x20import\x20SortformerEncLabelModel', "print('asr runtime smoke ok')"]["join"](';\x20')], {
    'cwd': _0x46f5ee,
    'progressMessage': "Verifying subtitle component"
  });
}
export function createAsrRuntimeInstallMediaTaskHandler({
  appRoot = process["cwd"](),
  fetchImpl = fetch,
  getAsrRuntimeManifestUrl = () => '',
  getUserDataRoot = () => '',
  resolveFallbackPythonCommand = () => '',
  platform = process['platform'],
  arch = process["arch"]
} = {}) {
  return async (_0xa01b72, _0xd9cb5e) => {
    const _0x499019 = normalizeText(getUserDataRoot?.());
    if (!_0x499019) {
      throw new Error('User\x20data\x20directory\x20is\x20unavailable');
    }
    const _0xf9d79 = _0xa01b72?.["payload"]?.["args"]?.['forceRepair'] === !![];
    _0xd9cb5e["emitProgress"](_0xa01b72, 0.03, "Checking subtitle component", {
      'stage': ASR_RUNTIME_STAGE['CHECK']
    });
    const _0x5bd66a = resolveAsrRuntimePythonCommand({
      'userDataRoot': _0x499019,
      'existsSync': existsSync,
      'readFileSync': readFileSync,
      'fallbackCommand': '',
      'platform': platform
    });
    if (_0x5bd66a && !_0xf9d79) {
      return {
        'success': !![],
        'available': !![],
        'source': 'installed',
        'pythonCommand': _0x5bd66a
      };
    }
    const _0x4913bb = normalizeText(resolveFallbackPythonCommand?.());
    if (!_0xf9d79 && _0x4913bb && existsSync(_0x4913bb)) {
      try {
        await runAsrRuntimeSmoke({
          'appRoot': appRoot,
          'pythonCommand': _0x4913bb,
          'queue': _0xd9cb5e,
          'task': _0xa01b72
        });
        return {
          'success': !![],
          'available': !![],
          'source': 'bundled',
          'pythonCommand': _0x4913bb
        };
      } catch {}
    }
    _0xd9cb5e["emitProgress"](_0xa01b72, 0.1, "Loading subtitle component manifest", {
      'stage': ASR_RUNTIME_STAGE["MANIFEST"]
    });
    const _0x9ac89b = normalizeUrl(_0xa01b72?.["payload"]?.["args"]?.["manifestUrl"]) || normalizeUrl(getAsrRuntimeManifestUrl?.());
    const _0x52f095 = await readManifest({
      'fetchImpl': fetchImpl,
      'manifestUrl': _0x9ac89b
    });
    const _0x235246 = selectAsrRuntimePackage(_0x52f095, {
      'platform': platform,
      'arch': arch
    });
    if (!_0x235246) {
      throw new Error("No ASR runtime package for " + platform + '-' + arch);
    }
    const _0x1f0711 = getPackageDownloadUrl(_0x235246);
    const _0xa05297 = _0x235246['version'] || normalizeText(_0x52f095?.["version"]) || "unknown";
    const _0xf65bc6 = resolveAsrRuntimeBaseDir(_0x499019);
    const _0x3fcc64 = resolveAsrRuntimeInstallDir({
      'userDataRoot': _0x499019,
      'version': _0xa05297
    });
    const _0x5b517b = resolveAsrRuntimeStatePath(_0x499019);
    const _0xa0f225 = a260_0x270b07["join"](_0xf65bc6, "_tmp", _0xa01b72['id']);
    const _0x352758 = a260_0x270b07['join'](_0xa0f225, 'asr-runtime.zip');
    const _0x17e6be = a260_0x270b07["join"](_0xa0f225, "extract");
    await rm(_0xa0f225, {
      'recursive': !![],
      'force': !![]
    });
    await mkdir(_0x17e6be, {
      'recursive': !![]
    });
    await downloadToFile({
      'fetchImpl': fetchImpl,
      'queue': _0xd9cb5e,
      'task': _0xa01b72,
      'targetPath': _0x352758,
      'url': _0x1f0711
    });
    if (_0x235246["sha256"]) {
      const _0x42fa5e = await hashFileSha256(_0x352758);
      if (_0x42fa5e["toLowerCase"]() !== _0x235246['sha256']) {
        throw new Error("ASR runtime checksum verification failed");
      }
    }
    _0xd9cb5e["emitProgress"](_0xa01b72, 0.68, 'Extracting\x20subtitle\x20component', {
      'stage': ASR_RUNTIME_STAGE["EXTRACT"]
    });
    await a260_0x37de9e(_0x352758, {
      'dir': _0x17e6be
    });
    const _0x311567 = await resolveExtractedRuntimeRoot(_0x17e6be, platform);
    await rm(_0x5b517b, {
      'force': !![]
    });
    await rm(_0x3fcc64, {
      'recursive': !![],
      'force': !![]
    });
    await mkdir(a260_0x270b07["dirname"](_0x3fcc64), {
      'recursive': !![]
    });
    await rename(_0x311567, _0x3fcc64);
    const _0x416aee = resolvePreferredRuntimePythonCommand({
      'existsSync': existsSync,
      'fallbackCommand': '',
      'platform': platform,
      'runtimeRoot': _0x3fcc64
    });
    _0xd9cb5e['emitProgress'](_0xa01b72, 0.84, "Verifying subtitle component", {
      'stage': ASR_RUNTIME_STAGE["VERIFY"]
    });
    await runAsrRuntimeSmoke({
      'appRoot': appRoot,
      'pythonCommand': _0x416aee,
      'queue': _0xd9cb5e,
      'task': _0xa01b72
    });
    await writeCurrentRuntimeState({
      'arch': arch,
      'manifestUrl': _0x9ac89b,
      'platform': platform,
      'runtimeRoot': _0x3fcc64,
      'sha256': _0x235246['sha256'],
      'statePath': _0x5b517b,
      'version': _0xa05297
    });
    await rm(_0xa0f225, {
      'recursive': !![],
      'force': !![]
    });
    return {
      'success': !![],
      'available': !![],
      'source': 'downloaded',
      'version': _0xa05297,
      'runtimeRoot': _0x3fcc64
    };
  };
}