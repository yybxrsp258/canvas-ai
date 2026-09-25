// 分发版打包 harness：用项目自带 Electron 当 node 驱动 electron-builder。
// 关键点（缺任一即失败）：process.noAsar、npm_config_user_agent=bun 绕开 npm 依赖收集、
// fs-extra copyFile 的 EBUSY/EPERM 重试补丁（深信服瞬时独占扫描）。
process.noAsar = true;
process.env.npm_config_user_agent = 'bun';

const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');

const fsExtra = require(path.join(ROOT, 'node_modules', 'fs-extra'));
const origCopyFile = fsExtra.copyFile;
fsExtra.copyFile = async (src, dest, ...rest) => {
  for (let i = 0; i < 30; i++) {
    try {
      return await origCopyFile(src, dest, ...rest);
    } catch (e) {
      const retryable = e && (e.code === 'EBUSY' || e.code === 'EPERM');
      if (!retryable || i === 29) throw e;
      try { fs.unlinkSync(dest); } catch (_) {}
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
};

// 依赖收集走磁盘遍历：确保 package-lock.json 不在场
const lock = path.join(ROOT, 'package-lock.json');
const lockBak = path.join(ROOT, '.package-lock.json.packbak');
let movedLock = false;
if (fs.existsSync(lock)) {
  fs.renameSync(lock, lockBak);
  movedLock = true;
}

const { build } = require(path.join(ROOT, 'node_modules', 'electron-builder', 'out', 'builder.js'));

build({
  win: [],
  x64: true,
  projectDir: ROOT,
})
  .then((out) => {
    if (movedLock && !fs.existsSync(lock)) fs.renameSync(lockBak, lock);
    console.log('PACK_OK');
    console.log(Array.isArray(out) ? out.join('\n') : out);
    process.exit(0);
  })
  .catch((e) => {
    if (movedLock && !fs.existsSync(lock)) fs.renameSync(lockBak, lock);
    console.error('PACK_FAIL', e && e.stack || e);
    process.exit(1);
  });
