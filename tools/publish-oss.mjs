// 把 dist/ 下的自更新产物上传到阿里云 OSS 公共读 bucket。
// 本机没有 node/npm，用 Electron 内置 node 执行：
//   ELECTRON_RUN_AS_NODE=1 ./node_modules/electron/dist/electron.exe tools/publish-oss.mjs --dry-run
//
// 凭证来源（二选一）：环境变量 OSS_ACCESS_KEY_ID / OSS_ACCESS_KEY_SECRET，
// 或 tools/oss.credentials.json（见 tools/oss.credentials.example.json，勿提交到公开仓库）。
//
// 上传顺序固定为 exe → blockmap → latest.yml：latest.yml 是客户端读取的版本清单，
// 必须最后落盘，否则会出现"清单已更新但安装包还没传完"的窗口期。
import { createHash, createHmac } from 'node:crypto';
import { createReadStream, existsSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PLACEHOLDER = /YOUR_BUCKET|YOUR_REGION/;

function parseArgs(argv) {
  const args = { dryRun: false, verify: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--probe') args.probe = true;
    else if (a === '--no-verify') args.verify = false;
    else if (a === '-h' || a === '--help') args.help = true;
    else throw new Error(`未知参数：${a}`);
  }
  return args;
}

function readPublishTarget() {
  const ymlPath = path.join(ROOT, 'electron-builder.yml');
  const yml = readFileSync(ymlPath, 'utf8');
  const block = yml.split(/^publish:\s*$/m)[1];
  if (!block) throw new Error('electron-builder.yml 里找不到 publish: 段');
  const url = (block.match(/^\s+url:\s*(\S+)\s*$/m) || [])[1];
  if (!url) throw new Error('publish 段缺少 url 字段');
  if (PLACEHOLDER.test(url)) {
    throw new Error(
      `publish.url 仍是占位符：${url}\n` +
        `请先把 electron-builder.yml 里的 YOUR_BUCKET / oss-cn-hangzhou 换成真实值。`
    );
  }
  const parsed = new URL(url);
  const labels = parsed.hostname.split('.');
  const isOssDomain = parsed.hostname.endsWith('.aliyuncs.com');
  const bucket = isOssDomain ? labels[0] : process.env.OSS_BUCKET;
  const region = isOssDomain ? labels[1] : process.env.OSS_REGION;
  if (!bucket || !region) {
    throw new Error('publish.url 像自定义域名，无法推导 bucket/地域，请设 OSS_BUCKET 与 OSS_REGION 环境变量');
  }
  return {
    baseUrl: url.replace(/\/+$/, ''),
    bucket,
    region,
    uploadHost: `${bucket}.${region}.aliyuncs.com`,
    keyPrefix: parsed.pathname.replace(/^\/+/, '').replace(/\/+$/, ''),
  };
}

function readCredentials() {
  const fromEnv = {
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  };
  if (fromEnv.accessKeyId && fromEnv.accessKeySecret) return fromEnv;
  const file = path.join(ROOT, 'tools', 'oss.credentials.json');
  if (existsSync(file)) {
    const parsed = JSON.parse(readFileSync(file, 'utf8'));
    if (parsed.accessKeyId && parsed.accessKeySecret) {
      return { accessKeyId: parsed.accessKeyId, accessKeySecret: parsed.accessKeySecret };
    }
  }
  throw new Error(
    '缺少 OSS 凭证：设 OSS_ACCESS_KEY_ID / OSS_ACCESS_KEY_SECRET，或填 tools/oss.credentials.json'
  );
}

function readLatestYml() {
  const file = path.join(DIST, 'latest.yml');
  if (!existsSync(file)) {
    throw new Error(
      'dist/latest.yml 不存在。若还没打包，先跑 tools/pack-dist.cjs；若已打包过，说明 electron-builder 没生成版本清单，' +
        '检查 electron-builder.yml 里 publish 段是否完整（provider: generic + url）。'
    );
  }
  const text = readFileSync(file, 'utf8');
  const version = (text.match(/^version:\s*(.+)$/m) || [])[1]?.trim();
  const artifact = (text.match(/^path:\s*(.+)$/m) || [])[1]?.trim();
  const sha512 = (text.match(/^sha512:\s*(.+)$/m) || [])[1]?.trim();
  if (!version || !artifact || !sha512) throw new Error('dist/latest.yml 缺 version/path/sha512 字段');
  return { file, text, version, artifact: artifact.replace(/^["']|["']$/g, ''), sha512 };
}

function sha512Base64(file) {
  return createHash('sha512').update(readFileSync(file)).digest('base64');
}

function formatBytes(n) {
  return n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${(n / 1024).toFixed(1)} KB`;
}

// OSS 头签名（V1）：无 Content-MD5、无 x-oss-* 头，StringToSign 中间两项留空。
function authorization({ method, key, contentType, date, bucket, credentials }) {
  const stringToSign = `${method}\n\n${contentType}\n${date}\n/${bucket}/${key}`;
  const signature = createHmac('sha1', credentials.accessKeySecret)
    .update(stringToSign, 'utf8')
    .digest('base64');
  return `OSS ${credentials.accessKeyId}:${signature}`;
}

// 首次运行最可能踩到的两个 OSS 报错，直接把排查方向写进错误里
function hintFor(body) {
  if (body.includes('RequestTimeTooSkewed')) {
    return '\n  → 本机时钟与 OSS 相差超过 15 分钟，校准系统时间后重试';
  }
  if (body.includes('SignatureDoesNotMatch')) {
    return '\n  → 签名不匹配：确认 AccessKey 属于该 bucket 所在账号；若 bucket 要求签名版本 4，请改用 ossutil 上传';
  }
  if (body.includes('AccessDenied')) {
    return '\n  → 该 AccessKey 没有这个 bucket 的写入权限，或在 OSS 开启了"阻止公共访问"';
  }
  return '';
}

function putObject({ target, credentials, key, file, contentType, cacheControl }) {
  const size = statSync(file).size;
  const date = new Date().toUTCString();
  const encodedPath = `/${key.split('/').map(encodeURIComponent).join('/')}`;
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: target.uploadHost,
        port: 443,
        method: 'PUT',
        path: encodedPath,
        headers: {
          Date: date,
          'Content-Type': contentType,
          'Content-Length': size,
          'Cache-Control': cacheControl,
          Authorization: authorization({
            method: 'PUT',
            key,
            contentType,
            date,
            bucket: target.bucket,
            credentials,
          }),
        },
      },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.statusCode);
          else reject(new Error(`PUT ${key} 失败：HTTP ${res.statusCode} ${body.slice(0, 400)}${hintFor(body)}`));
        });
      }
    );
    req.on('error', reject);
    let sent = 0;
    let nextMark = 0;
    const stream = createReadStream(file, { highWaterMark: 1024 * 1024 });
    stream.on('data', (chunk) => {
      sent += chunk.length;
      if (sent >= nextMark) {
        nextMark = sent + Math.max(size / 10, 1024 * 1024);
        process.stdout.write(`    进度 ${Math.min(100, Math.round((sent / size) * 100))}%  ${formatBytes(sent)}/${formatBytes(size)}\r`);
      }
    });
    stream.on('error', reject);
    stream.pipe(req);
  });
}

// 300MB 单次 PUT 在这条链路上会中途 ECONNRESET，而 OSS 的 PUT 是整体覆盖、天然幂等，
// 所以直接整对象重传（不做分片续传），退避后重试即可。
const TRANSIENT_UPLOAD_ERROR = /ECONNRESET|EPIPE|ETIMEDOUT|ECONNREFUSED|EAI_AGAIN|ENOTFOUND|socket hang up|请求超时|aborted/i;

async function putObjectWithRetry(opts, attempts = 5) {
  for (let i = 1; ; i++) {
    try {
      return await putObject(opts);
    } catch (e) {
      const message = String((e && e.message) || e);
      if (i >= attempts || !TRANSIENT_UPLOAD_ERROR.test(message)) throw e;
      const waitMs = i * 5000;
      console.warn(`\n[oss] 重试   ${opts.key} 第 ${i} 次失败（${message}），${waitMs / 1000}s 后整对象重传`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
}

function deleteObject({ target, credentials, key }) {
  const date = new Date().toUTCString();
  const encodedPath = `/${key.split('/').map(encodeURIComponent).join('/')}`;
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: target.uploadHost,
        port: 443,
        method: 'DELETE',
        path: encodedPath,
        headers: {
          Date: date,
          Authorization: authorization({ method: 'DELETE', key, contentType: '', date, bucket: target.bucket, credentials }),
        },
      },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.statusCode);
          else reject(new Error(`DELETE ${key} 失败：HTTP ${res.statusCode} ${body.slice(0, 400)}`));
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

// 本机 DNS 解析外网域名可能要 10 秒以上、GET 偶发 ECONNRESET，
// 所以不用 fetch（undici 的连接超时会先炸），改用 https 自己控超时并重试。
function getTextOnce(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request(
      { host: parsed.hostname, port: 443, method: 'GET', path: parsed.pathname + parsed.search },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, text: body }));
      }
    );
    const timer = setTimeout(() => req.destroy(new Error(`请求超时 ${timeoutMs}ms`)), timeoutMs);
    req.on('error', (e) => {
      clearTimeout(timer);
      reject(e);
    });
    req.on('close', () => clearTimeout(timer));
    req.end();
  });
}

async function getTextRetry(url, attempts = 3, timeoutMs = 30000) {
  let lastError = null;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await getTextOnce(url, timeoutMs);
    } catch (e) {
      lastError = e;
      if (i < attempts) console.warn(`[oss] 重试   第 ${i} 次回读失败（${e.message}），继续重试`);
    }
  }
  throw lastError;
}

// 传 330MB 之前先确认凭证能签名、bucket 能公共读：放一个几十字节的对象，回读，再删掉。
async function probe(target, credentials) {
  const name = `_probe-${Date.now()}.txt`;
  const key = [target.keyPrefix, name].filter(Boolean).join('/');
  const temp = path.join(os.tmpdir(), `canvas-ai-probe-${Date.now()}.txt`);
  const body = `canvas-ai update probe ${new Date().toISOString()}`;
  writeFileSync(temp, body);
  try {
    await putObject({ target, credentials, key, file: temp, contentType: 'text/plain; charset=utf-8', cacheControl: 'no-store' });
    console.log(`[oss] 写入   ${key}`);
    let status;
    let text;
    try {
      ({ status, text } = await getTextRetry(`${target.baseUrl}/${encodeURIComponent(name)}`));
    } catch (e) {
      console.warn(`[oss] 警告   公共回读请求失败（${e.message}）：签名与写入已验证通过，回读失败多半是本机网络对 GET 不稳定，换个网络再试。`);
      return;
    }
    if (status !== 200) {
      console.warn(`[oss] 警告   公共回读返回 HTTP ${status}：写入成功但 bucket 不是公共读，客户端将取不到更新。`);
      return;
    }
    if (text !== body) {
      console.warn('[oss] 警告   公共回读的内容与写入不一致（中间有 CDN 或缓存？）。');
      return;
    }
    console.log('[oss] 回读   内容一致，公共读正常');
  } finally {
    try {
      await deleteObject({ target, credentials, key });
      console.log('[oss] 清理   已删除探针对象');
    } catch (e) {
      console.warn(`[oss] 警告   探针对象 ${key} 删除失败，需手动清理：${e.message}`);
    }
    rmSync(temp, { force: true });
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`用法：publish-oss.mjs [--dry-run] [--probe] [--no-verify]

上传 dist/ 下的 setup.exe、setup.exe.blockmap、latest.yml 到 electron-builder.yml 里
publish.url 指向的 OSS 路径，顺序为 exe → blockmap → latest.yml。

  --dry-run    只解析配置、校验本地产物，不发任何请求（也不需要凭证）
  --probe      连通性自检：写一个小对象 → 公共回读 → 删除，验证签名与公共读
  --no-verify  上传后不回头 GET latest.yml 校验公共读可达性`);
    return;
  }

  const target = readPublishTarget();
  if (args.probe) {
    console.log(`[oss] 目标   https://${target.uploadHost}/${target.keyPrefix}/`);
    await probe(target, readCredentials());
    return;
  }
  const latest = readLatestYml();
  const credentials = args.dryRun ? null : readCredentials();
  const key = (name) => [target.keyPrefix, name].filter(Boolean).join('/');

  console.log(`[oss] 目标   https://${target.uploadHost}/${target.keyPrefix}/`);
  console.log(`[oss] 公开   ${target.baseUrl}/`);
  console.log(`[oss] 版本   ${latest.version}`);

  const exe = path.join(DIST, latest.artifact);
  if (!existsSync(exe)) throw new Error(`dist 下找不到安装包：${latest.artifact}`);
  const blockmap = `${exe}.blockmap`;
  if (!existsSync(blockmap)) throw new Error(`dist 下找不到差分包：${latest.artifact}.blockmap`);

  const actual = sha512Base64(exe);
  if (actual !== latest.sha512) {
    throw new Error(`安装包与 latest.yml 的 sha512 不一致，产物已损坏或版本错位：\n  文件 ${actual}\n  清单 ${latest.sha512}`);
  }
  console.log(`[oss] 校验   sha512 一致，${formatBytes(statSync(exe).size)}`);

  const plan = [
    { file: exe, name: latest.artifact, contentType: 'application/octet-stream', cacheControl: 'public, max-age=31536000, immutable' },
    { file: blockmap, name: `${latest.artifact}.blockmap`, contentType: 'application/octet-stream', cacheControl: 'public, max-age=31536000, immutable' },
    { file: latest.file, name: 'latest.yml', contentType: 'text/yaml; charset=utf-8', cacheControl: 'no-cache, no-store, must-revalidate' },
  ];

  for (const item of plan) {
    const objectKey = key(item.name);
    if (args.dryRun) {
      console.log(`[dry-run] PUT ${objectKey}  ${formatBytes(statSync(item.file).size)}`);
      continue;
    }
    console.log(`[oss] 上传   ${objectKey}`);
    await putObjectWithRetry({ target, credentials, key: objectKey, file: item.file, contentType: item.contentType, cacheControl: item.cacheControl });
    process.stdout.write('    OK\n');
  }

  if (args.dryRun || !args.verify) return;

  const latestUrl = `${target.baseUrl}/latest.yml`;
  try {
    const { status, text } = await getTextRetry(latestUrl);
    if (status !== 200) {
      console.warn(`[oss] 警告   回读 ${latestUrl} 返回 HTTP ${status}：bucket 未公共读？或 CDN 有缓存。`);
      return;
    }
    if (text.replace(/\s+/g, ' ').trim() !== latest.text.replace(/\s+/g, ' ').trim()) {
      console.warn('[oss] 警告   回读的 latest.yml 与本地不一致，可能有 CDN 缓存了旧版本清单。');
      return;
    }
    console.log(`[oss] 回读   ${latestUrl} 内容与本地一致`);
    console.log('[oss] 完成：老版本客户端下次启动即可检测到该更新');
  } catch (e) {
    console.warn(`[oss] 警告   回读失败（${e.message}），未能确认公共读；本机网络对 GET 不稳定时属正常，可换网络重试 --probe。`);
  }
}

main().catch((e) => {
  console.error(`[oss] 失败：${e && e.message ? e.message : e}`);
  process.exit(1);
});
