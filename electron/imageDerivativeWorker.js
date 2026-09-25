import { readFile } from 'node:fs/promises';
import a229_0x4994ac from 'node:path';
import { createKeyedOperationQueue } from './keyedOperationQueue.js';
export async function renderImageDerivativePayload(source) {
  const image = new Image();
  const canvas = document.createElement('canvas');
  try {
    image.src = source;
    await image.decode();
    const originalWidth = image.naturalWidth;
    const originalHeight = image.naturalHeight;
    if (!(originalWidth > 0 && originalHeight > 0)) {
      throw new Error('Invalid image dimensions');
    }
    const render = maxEdge => {
      const scale = Math.min(1, maxEdge / Math.max(originalWidth, originalHeight));
      canvas.width = Math.max(1, Math.round(originalWidth * scale));
      canvas.height = Math.max(1, Math.round(originalHeight * scale));
      const context = canvas.getContext('2d');
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png').split(',')[1];
    };
    return {
      originalWidth,
      originalHeight,
      display: render(1280),
      thumb: render(320)
    };
  } finally {
    image.src = '';
    canvas.width = 0;
    canvas.height = 0;
  }
}
export function createImageDerivativeWorker({
  BrowserWindow: _0x357e7c,
  timeoutMs = 0x7530
}) {
  const _0x5e5fcc = createKeyedOperationQueue();
  return _0x4e56ca => _0x5e5fcc["run"]('image-derivatives', async () => {
    const _0x23e2a3 = new _0x357e7c({
      'show': ![],
      'width': 0x1,
      'height': 0x1,
      'webPreferences': {
        'sandbox': !![],
        'contextIsolation': !![],
        'nodeIntegration': ![],
        'backgroundThrottling': ![]
      }
    });
    let _0x50e485;
    try {
      const _0x4b00fb = async () => {
        await _0x23e2a3["loadURL"]("data:text/html,<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; img-src data:;\">");
        const _0x48e79f = {
          '.svg': "image/svg+xml",
          '.jpg': "image/jpeg",
          '.jpeg': "image/jpeg",
          '.webp': "image/webp",
          '.gif': "image/gif",
          '.avif': "image/avif",
          '.bmp': "image/bmp"
        }[a229_0x4994ac["extname"](_0x4e56ca)["toLowerCase"]()] || "image/png";
        const _0x965255 = 'data:' + _0x48e79f + ";base64," + (await readFile(_0x4e56ca))["toString"]("base64");
        if (_0x23e2a3["isDestroyed"]()) {
          throw new Error("Image derivative worker closed");
        }
        const _0x485ba5 = await _0x23e2a3["webContents"]["executeJavaScript"]('(' + renderImageDerivativePayload["toString"]() + ')(' + JSON["stringify"](_0x965255) + ')');
        return {
          'originalWidth': _0x485ba5["originalWidth"],
          'originalHeight': _0x485ba5["originalHeight"],
          'displayPng': Buffer["from"](_0x485ba5['display'], "base64"),
          'thumbPng': Buffer["from"](_0x485ba5["thumb"], "base64")
        };
      };
      return await Promise['race']([_0x4b00fb(), new Promise((_0x3dad3d, _0x37a98a) => {
        _0x50e485 = setTimeout(() => _0x37a98a(new Error("Image derivative worker timed out")), timeoutMs);
      })]);
    } finally {
      clearTimeout(_0x50e485);
      if (!_0x23e2a3["isDestroyed"]()) {
        _0x23e2a3['destroy']();
      }
    }
  });
}