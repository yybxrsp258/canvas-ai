import { openAsBlob } from 'node:fs';
import a263_0x3280ac from 'node:path';
import { transcribeBailianAudio } from '../../api/bailianAsrApi.js';
import { normalizeDoubaoAsrSegments, runDoubaoAsrTranscription } from './doubaoAsrClient.js';
export function createAudioVoiceCloudAsrAdapters({
  getDoubaoAsrConfig: _0x11222d,
  getBailianAsrConfig: _0x3a5de0,
  runDoubaoAsrTranscription: _0x518c34 = runDoubaoAsrTranscription,
  runBailianAsrTranscription = async ({
    audioAbs: _0xb79858,
    queue: _0x5200e3,
    task: _0x35f414,
    ..._0x223b92
  }) => transcribeBailianAudio({
    ..._0x223b92,
    'audio': await openAsBlob(_0xb79858, {
      'type': "audio/mpeg"
    }),
    'filename': a263_0x3280ac["basename"](_0xb79858),
    'throwIfCancelled': () => _0x5200e3["throwIfCancelled"](_0x35f414),
    'onProgress': (_0x3eae5e, _0x541c99) => _0x5200e3["emitProgress"](_0x35f414, _0x3eae5e, _0x541c99, {
      'stage': "transcribe"
    })
  })
} = {}) {
  return {
    'doubao': {
      'getConfig': _0x11222d,
      'run': _0x518c34,
      'normalize': normalizeDoubaoAsrSegments
    },
    'bailian': {
      'getConfig': _0x3a5de0,
      'run': runBailianAsrTranscription,
      'normalize': _0x23fcfd => _0x23fcfd["segments"]
    }
  };
}