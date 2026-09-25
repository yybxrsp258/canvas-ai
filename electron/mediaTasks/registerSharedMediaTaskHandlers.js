import { createAudioComposeMediaTaskHandler } from './audioComposeTask.js';
import { createAsrRuntimeInstallMediaTaskHandler } from './asrRuntimeInstallTask.js';
import { createAudioVoiceComposeMediaTaskHandler } from './audioVoiceComposeTask.js';
import { createAudioVoiceModelPrepareMediaTaskHandler, createAudioVoiceAnalyzeMediaTaskHandler, createFunasrGpuTorchInstallMediaTaskHandler, createFunasrModelPrepareMediaTaskHandler, createFunasrRuntimeCheckMediaTaskHandler } from './audioVoiceAnalyzeTask.js';
import { createMediaClipExportTaskHandler } from './mediaClipExportTask.js';
import { createVideoReverseMediaTaskHandler } from './videoReverseTask.js';
import { createVideoToGifMediaTaskHandler } from './videoToGifTask.js';
export function registerSharedMediaTaskHandlers(_0x2e4765, _0x34c603 = {}) {
  if (!_0x2e4765 || typeof _0x2e4765["setHandler"] !== "function") {
    return;
  }
  _0x2e4765["setHandler"]("asrRuntimeInstall", createAsrRuntimeInstallMediaTaskHandler({
    'appRoot': _0x34c603["appRoot"],
    'getAsrRuntimeManifestUrl': _0x34c603['getAsrRuntimeManifestUrl'],
    'getUserDataRoot': _0x34c603["getUserDataRoot"],
    'resolveFallbackPythonCommand': _0x34c603['resolveFallbackPythonCommand']
  }));
  _0x2e4765['setHandler']("audioCompose", createAudioComposeMediaTaskHandler({
    'createOutputFilename': _0x34c603["createOutputFilename"],
    'ffprobeHasAudio': _0x34c603["ffprobeHasAudio"],
    'getOutputDir': _0x34c603['getOutputDir'],
    'getRuntimeToolOrFallback': _0x34c603["getRuntimeToolOrFallback"],
    'resolveMediaTaskSource': _0x34c603["resolveMediaTaskSource"],
    'toOutputLocalPath': _0x34c603["toOutputLocalPath"]
  }));
  _0x2e4765["setHandler"]("audioVoiceCompose", createAudioVoiceComposeMediaTaskHandler({
    'createOutputFilename': _0x34c603['createOutputFilename'],
    'ffprobeVideoMeta': _0x34c603["ffprobeVideoMeta"],
    'getOutputDir': _0x34c603["getOutputDir"],
    'getRuntimeToolOrFallback': _0x34c603['getRuntimeToolOrFallback'],
    'runFfmpegTask': _0x34c603["runFfmpegTask"],
    'resolveMediaTaskSource': _0x34c603["resolveMediaTaskSource"],
    'toOutputLocalPath': _0x34c603["toOutputLocalPath"]
  }));
  _0x2e4765["setHandler"]("audioVoiceAnalyze", createAudioVoiceAnalyzeMediaTaskHandler({
    'createOutputFilename': _0x34c603['createOutputFilename'],
    'ffprobeHasAudio': _0x34c603["ffprobeHasAudio"],
    'ffprobeVideoMeta': _0x34c603["ffprobeVideoMeta"],
    'getDoubaoAsrConfig': _0x34c603["getDoubaoAsrConfig"],
    'getBailianAsrConfig': _0x34c603["getBailianAsrConfig"],
    'getFunasrModelRootDir': _0x34c603["getFunasrModelRootDir"],
    'getPythonCertificateEnv': _0x34c603["getPythonCertificateEnv"],
    'getSortformerModelRootDir': _0x34c603["getSortformerModelRootDir"],
    'getOutputDir': _0x34c603["getOutputDir"],
    'getRuntimeToolOrFallback': _0x34c603["getRuntimeToolOrFallback"],
    'resolveMediaTaskSource': _0x34c603["resolveMediaTaskSource"],
    'resolvePythonCommand': _0x34c603["resolvePythonCommand"],
    'appRoot': _0x34c603['appRoot'],
    'toOutputLocalPath': _0x34c603["toOutputLocalPath"]
  }));
  _0x2e4765["setHandler"]("audioVoiceModelPrepare", createAudioVoiceModelPrepareMediaTaskHandler({
    'getFunasrModelRootDir': _0x34c603["getFunasrModelRootDir"],
    'getPythonCertificateEnv': _0x34c603["getPythonCertificateEnv"],
    'getSortformerModelRootDir': _0x34c603['getSortformerModelRootDir'],
    'resolvePythonCommand': _0x34c603["resolvePythonCommand"],
    'appRoot': _0x34c603["appRoot"]
  }));
  _0x2e4765['setHandler']("funasrModelPrepare", createFunasrModelPrepareMediaTaskHandler({
    'getFunasrModelRootDir': _0x34c603["getFunasrModelRootDir"],
    'getPythonCertificateEnv': _0x34c603["getPythonCertificateEnv"],
    'resolvePythonCommand': _0x34c603["resolvePythonCommand"],
    'appRoot': _0x34c603["appRoot"]
  }));
  _0x2e4765["setHandler"]("funasrRuntimeCheck", createFunasrRuntimeCheckMediaTaskHandler({
    'getFunasrModelRootDir': _0x34c603["getFunasrModelRootDir"],
    'getPythonCertificateEnv': _0x34c603["getPythonCertificateEnv"],
    'resolvePythonCommand': _0x34c603["resolvePythonCommand"],
    'appRoot': _0x34c603["appRoot"]
  }));
  _0x2e4765["setHandler"]("funasrGpuTorchInstall", createFunasrGpuTorchInstallMediaTaskHandler({
    'getFunasrModelRootDir': _0x34c603["getFunasrModelRootDir"],
    'getPythonCertificateEnv': _0x34c603["getPythonCertificateEnv"],
    'resolvePythonCommand': _0x34c603["resolvePythonCommand"],
    'appRoot': _0x34c603["appRoot"]
  }));
  _0x2e4765["setHandler"]("mediaClipExport", createMediaClipExportTaskHandler({
    'createOutputFilename': _0x34c603["createOutputFilename"],
    'ffprobeHasAudio': _0x34c603["ffprobeHasAudio"],
    'ffprobeVideoMeta': _0x34c603["ffprobeVideoMeta"],
    'getOutputDir': _0x34c603["getOutputDir"],
    'getRuntimeToolOrFallback': _0x34c603["getRuntimeToolOrFallback"],
    'runFfmpegTask': _0x34c603["runFfmpegTask"],
    'resolveMediaTaskSource': _0x34c603["resolveMediaTaskSource"],
    'toOutputLocalPath': _0x34c603["toOutputLocalPath"]
  }));
  _0x2e4765["setHandler"]("videoReverse", createVideoReverseMediaTaskHandler({
    'createOutputFilename': _0x34c603["createOutputFilename"],
    'ffprobeHasAudio': _0x34c603['ffprobeHasAudio'],
    'ffprobeVideoMeta': _0x34c603["ffprobeVideoMeta"],
    'getOutputDir': _0x34c603["getOutputDir"],
    'getRuntimeToolOrFallback': _0x34c603['getRuntimeToolOrFallback'],
    'runFfmpegTask': _0x34c603["runFfmpegTask"],
    'resolveMediaTaskSource': _0x34c603["resolveMediaTaskSource"],
    'toOutputLocalPath': _0x34c603["toOutputLocalPath"]
  }));
  _0x2e4765["setHandler"]("videoToGif", createVideoToGifMediaTaskHandler({
    'createOutputFilename': _0x34c603["createOutputFilename"],
    'ffprobeVideoMeta': _0x34c603["ffprobeVideoMeta"],
    'getOutputDir': _0x34c603["getOutputDir"],
    'getRuntimeToolOrFallback': _0x34c603["getRuntimeToolOrFallback"],
    'runFfmpegTask': _0x34c603['runFfmpegTask'],
    'resolveMediaTaskSource': _0x34c603["resolveMediaTaskSource"],
    'toOutputLocalPath': _0x34c603["toOutputLocalPath"]
  }));
}