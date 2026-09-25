const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

const target = path.resolve(__dirname, process.argv[4] || 'splash-preview.html');
const out = path.resolve(__dirname, '.preview-shot.png');
const delay = parseInt(process.argv[2] || '2400', 10);
const zoom = parseFloat(process.argv[3] || '1');

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 900, height: 760, show: false });
  await win.loadFile(target);
  if (zoom !== 1) win.webContents.setZoomFactor(zoom);
  await new Promise((r) => setTimeout(r, delay));
  const img = await win.webContents.capturePage();
  fs.writeFileSync(out, img.toPNG());
  app.exit(0);
});
