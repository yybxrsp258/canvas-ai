# Canvas AI 开发进度与后续计划

> 交接文档。原应用为 **SHUO Canvas v0.7.14**（Electron + 原生 ESM + Python 后端），
> 本仓库是它的功能复刻版，基于**反混淆原版源码**构建。
> 最后更新：2026-09-20（P0 完成）

---

## 0. 一句话现状

**应用可开发态运行、核心链路（画布 / 生成 / 剧本 / 语音）已实测跑通；
打包版已跑通（Electron 窗口模式），NSIS 安装包已生成，下一步为 P1 模型清单接口。**

---

## 1. 环境与启动

### 开发态运行

```bash
cd "D:/shuoCAN/Canvas ai"
AIC_CANVAS_RUNTIME=electron npx electron .
```

> **`AIC_CANVAS_RUNTIME=electron` 不能省**。原版 `shouldUseChromeShellRuntime()`
> 末尾是 `return true`，**默认走 Chrome Shell 模式**（启动真实 Chrome 并经 CDP 控制）。
> 开发态走 Electron 窗口模式更稳定。

### 相关命令

```bash
npm run icon            # 生成 build/app-icon.ico（自有图形，非原版素材）
npm run backend:freeze  # PyInstaller 冻结后端 → .electron-runtime/runtime/backend/
npm run dist            # 出 NSIS 安装包 → dist/Canvas AI-0.1.0-setup.exe
npm run dist:dir        # 只出解包目录，便于快速验证布局
python tools/make-icon.py
```

### 打包时的网络要求

npm 走淘宝镜像，但 Electron 二进制与 electron-builder 的 winCodeSign/nsis 产物
默认从 GitHub 下载会失败，需要：

```bash
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
```

---

### 2. ✅ 已解决的中断点（P0 打包版跑通）

| 项 | 状态 |
|---|---|
| `server.py` 的顺序错误（`NameError`） | ✅ 已修复 |
| chrome-shell 的**鉴权放宽**（Origin/Referer 策略） | ✅ 代码已写（备用） |
| chrome-shell 的**桌面桥反向代理** | ✅ 代码已写（备用） |
| **打包态默认改为 Electron 窗口模式** | ✅ 已修复并验证 |
| 重新冻结后端 + 重新打包 | ✅ 完成 |
| 打包版启动实测 | ✅ 通过 |

### 解决方案

由于 chrome-shell 模式的就绪上报链路仍存在不确定性，采用了文档建议的**退步方案**：
将 `shouldUseChromeShellRuntime()` 末尾的 `return true` 改为 `return !appIsPackaged`，
打包态默认走 Electron 窗口模式（已验证稳定），开发态行为不变。

chrome-shell 相关的两个修复（鉴权放宽 + 桌面桥代理）仍保留在代码中，
未来若需要可通过 `AIC_CANVAS_RUNTIME=chrome-shell` 环境变量显式启用。

### 验收结果（2026-09-20，最终）

对当前打包产物 `dist/win-unpacked/Canvas AI.exe`（`app.asar` 构建于 18:00:48）
清空日志后重新启动，`desktop.log.jsonl` 中新会话（10:06 UTC）仅记录：

- `renderer.diagnostics_ready` ✅ 渲染层就绪（Electron 窗口模式）
- `power_save_blocker.started` ✅
- **无 `chrome_shell.*` 事件**（未走 chrome-shell 模式）
- **无 `updater.checking` / `updater.error`**（`scheduleUpdateCheck` 检测到
  `app-update.yml` 不存在后直接返回，ENOENT 告警已彻底消除）
- **无 `app.startup_failed`**
- 后端 exe 正确拉起：`resources/runtime/backend/canvasai-backend.exe`
- NSIS 安装包已生成：`dist/Canvas AI-0.1.0-setup.exe`（350MB）

> 注：日志里更早的 `chrome_shell.startup_failed`（09:29 UTC）与 `updater.error`
> （09:50 UTC）均为**旧构建的残留条目**，早于当前 `app.asar` 的构建时间，
> 与当前产物无关。

---

## 3. 未完成清单（按优先级）

### P0 — 打包版跑通 ✅ 已完成

- [x] 重新冻结后端 + 重新打包 + 实测启动
- [x] 确认 `resources/runtime/backend/canvasai-backend.exe` 在包内被主进程拉起
- [x] 打包态默认改用 Electron 窗口模式（稳定可靠）
- [x] chrome-shell 修复代码保留（可通过 env 显式启用）
- [ ] 装一次 NSIS 安装包，确认安装→启动→卸载流程（需人工操作）

### P1 — 模型清单接口 ✅ 无需实现

- [x] `GET /api/v2/model-catalog?provider=binghuo`
  - **结论：该接口实际不会被调用。**
    渲染层的调用入口（`appPanels.js` 中的订阅面板初始化函数）已被改为空实现，
    模型列表完全由 `src/manifests/` 本地清单提供（已实测可用）。
  - `src/modules/modelCatalogService.js` 为死代码，保留但不影响运行。
  - 如未来需要远程目录，可重新启用并实现此接口。

### P2 — 需要外部资源的功能（接口契约已完整，缺数据源）

- [ ] **人物替换**（`/api/v2/person-replacement/*`）
      需模型包（GB 级）。当前返回 `{state:'not-installed'}` 与 `MODEL_PACK_REQUIRED`。
- [ ] **3D 场景**（`/api/v2/storyboard3d/model-pack`）同上
- [ ] **剧本素材本地抽取**（`/api/v2/story-workspace/assets/extract-local`）
      需 `paddlenlp/PP-UIE-0.5B`；当前提示"请改用 AI 抽取"（LLM 路径是默认，可用）
- [ ] **语音工作室本地 ASR**（FunASR / Sortformer）
      `backend/services/` 里已有原版的明文脚本，但需 GB 级模型与 torch

### P3 — 其他

- [ ] **协作**：需协作服务器（`api/canvasCollaborationApi.js` 要求 HTTPS + Bearer）
- [x] **自更新**：`publish: null` 时跳过检查，避免 ENOENT 告警（已修复 `scheduleUpdateCheck`）
- [ ] **i18n 残留**：`zh-CN.js` 里仍有已废弃的 `subscription` 文案块（界面已移除，
      属死字符串，不影响运行）

---

## 4. 已完成部分（按阶段）

### Phase 0 — 反混淆 ✅
1,773 个文件全部还原，0 失败、0 语法错误、**0 导出符号丢失**。
工具：`tools/deobfuscate.mjs`（webcrack，**须 `unminify:false`**）、`tools/validate.mjs`。

### Phase 1 — 骨架 ✅
应用启动、渲染层从本地 Python 后端加载、显示空画布（已截屏确认）。

### Phase 2 — 画布核心 ✅
画布引擎随反混淆完整恢复（`v2Renderer`、虚拟化、minimap、viewport）。
项目持久化已实现并端到端验证（`window._v2SaveProject()` → 落盘 → 回填）。

### Phase 3 — 生成链路 ✅
- 出站代理 `/api/v2/proxy/{image,completions,task,upload,upload-local-media,apimart-upload}`
- 产物落盘 `save_output` / `output-files` + 媒体服务（`/output/*` 等）
- **用真实百炼 key 端到端验证**：画布文本节点选 `DeepSeek V4 Flash` 生成，
  2.1s 返回真实回答并回填节点

### Phase 4 — 工作室内核 ✅（可用部分）
- **剧本工作室**：文档导入（txt/GBK/docx/PDF）+ **剧本生成实测通过**
  （LLM 返回完整结构化输出：故事契约 / 因果剧情节点 / 人物小传）
- **语音工作室**：云端 ASR **闭环实测通过**（TTS 生成语音 → ASR 转写完全正确）
- 图像/视频/音频工具集：走 Electron 媒体任务 IPC，无需后端

### Phase 5 — 外围与集成 ✅（可用部分）
- 8 个设置面板全部渲染正常
- **Agent 实测通过**（回答带画布上下文）
- Canvas MCP（修好 enable 契约后正常）
- 对象存储（S3 兼容，**SigV4 用 AWS 官方测试向量验证**；假 S3 端到端验证）
- 素材库、CLI 登录面板

### 品牌与商业化清理 ✅
渲染 DOM 残留为 **`{}`（零）**。含：VIP/订阅/激活门禁（逻辑 + 界面）、
原版品牌（多种大小写/连字符/转义写法）、**3 处推广返利链接**、原作者署名、
原厂商微信号。详见「已知坑」第 3 条。

---

## 5. 已知坑（都踩过，别再踩）

1. **反混淆必须关掉 webcrack 的 `unminify`**
   它会把 `if (x === undefined) x = EXPR;` 合并进参数默认值，对 async 函数产生
   非法的 `x = await ...`。关掉后字符串数组还原能力不受影响。

2. **重启应用前必须杀干净进程**
   主进程有单实例锁，残留进程会让新启动静默转发后退出，**探针会连到旧实例**，
   造成"改动没生效"的假象。**按可执行路径匹配**清理（否则会误杀本机的 IDA 进程）：
   ```bash
   powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { \$_.ExecutablePath -like '*Canvas ai*' } | ForEach-Object { Stop-Process -Id \$_.ProcessId -Force }"
   ```

3. **品牌串有五种形态**，只替换带空格的那种必漏：
   `SHUO Canvas` / `Shuo Canvas` / `SHUO\x20Canvas`（转义空格）/ `SHUO-Canvas` /
   **拆成两个 span 的** `<span>SHUO</span><span>CANVAS</span>`（启动动画字标）。
   另外 **`electron/` 目录容易被漏扫**——`globalCaptureWindow.html` 就在那里。

4. **搜返利链接要用通用模式**
   `[?&](aff|invite|inviteCode|ref|referral|code)=`。
   只搜已知值（如 `aff=ashuoai`）会漏掉 `api.7tai.cc/register?aff=U8lx`。

5. **`/api/v2/desktop/*` 在 Electron 模式下不需要实现**（走 preload IPC），
   但 **chrome-shell 模式下必须代理到主进程桌面桥**。判断功能"要不要后端"时先分清这一点。

6. **CDP 坐标是视口坐标**，而 `Page.captureScreenshot` 默认会捕获超出视口的内容——
   元素 `y` 大于 `innerHeight` 时截图里看得见却点不到，需先 `scrollIntoView`。
   （工具：`tools/ui-drive.mjs`）

7. **冻结产物必须落在 `.electron-runtime/runtime/backend/`**
   （`extraResources` 的源是 `.electron-runtime/runtime`），
   否则打出来的包里**会缺后端 exe**，应用启动即失败。

8. **`files` 里不要显式写 `node_modules/**/*`**
   会覆盖 electron-builder 对 devDependencies 的自动过滤，把 electron-builder 自己也打进去。

9. **百炼 ASR 的坑**（若做本地/云端 ASR）：
   结果**不在轮询响应里**，在 `output.transcription_url` 指向的 JSON；
   上传的扩展名必须与真实格式一致；TTS 产出的 WAV 头部 size 是流式占位值，
   需先用 ffmpeg `-c copy` 重写。

10. **供应链/数据路径**：渲染层的本地媒体路径**只认三种相对前缀**
    （`output/`、`data/uploads/`、`data/assets/`），
    拒绝 Windows 绝对路径；`localPathToUrl(p)` 就是 `'/' + p`。

---

## 6. 关键文件地图

```
server.py                       后端入口（53 精确 + 12 前缀路由）
backend/services/
  ├── json_file_store.py        原子写 JSON（用户数据/项目/素材/工作流）
  ├── remote_proxy_service.py   厂商出站代理（SigV4 无关，纯 HTTP 转发）
  ├── object_storage_service.py S3 SigV4 签名与上传
  ├── document_text_service.py  剧本导入（txt/GBK/docx/PDF）
  ├── outbound_http_transport.py 原版明文模块，统一 TLS 策略
  ├── funasr_transcription_service.py     原版明文（ASR，需模型）
  └── sortformer_diarization_service.py   原版明文（说话人分离，需模型）

electron/                       主进程（130 JS + 6 html/cjs，已反混淆）
  ├── backendLaunchResolver.js  后端启动解析（打包态找 canvasai-backend.exe）
  ├── applicationResourceRoot.js 打包态 web 根 = <resources>/webapp
  └── secureSettingsStore.js    密钥加密存储（safeStorage）

src/, api/                      渲染层（已反混淆）
tools/
  ├── deobfuscate.mjs           批量反混淆
  ├── validate.mjs              语法 + 导出符号校验
  ├── probe.mjs                 CDP 求值探查
  ├── ui-drive.mjs              CDP 真实键鼠驱动（含 clickText/clickAncestor）
  └── make-icon.py              生成应用图标

electron-builder.yml            打包配置
DEV-STATUS.md                   本文档
.reference/                     原版提取物、反混淆报告、测试脚本（非交付物，可清理）
.electron-runtime/runtime/      内置运行时：ffmpeg / codex / dreamina / backend
```

---

## 7. 验证方法

### 开发态起服务自测

```bash
AIC_APP_ROOT="D:/shuoCAN/Canvas ai" AIC_LOCAL_TOKEN=tok python server.py --host=127.0.0.1 --port=8799
curl -i http://127.0.0.1:8799/api/v2/runtime/info    # 应有 x-aicanvas-server: Canvas AI
```

### 驱动 UI（无需人工点击）

```bash
# 启动时带调试端口
AIC_CANVAS_RUNTIME=electron npx electron . --remote-debugging-port=9222

# 求值探查
node tools/probe.mjs "document.title" --port 9222

# 逐步操作（steps.json 见 .reference/*.json 示例）
node tools/ui-drive.mjs .reference/steps-xxx.json --port 9222
```

### 与原版对照

原版安装在 `D:\shuoCAN\SHUO Canvas\`，可**并排操作比对**——
这是"功能一致"最直接的验收手段。

---

## 8. 测试用凭据

百炼（阿里云）API Key 已存在于应用的安全存储中（key 名
`apiConfig.providers.bailian.apiKey`），可直接用于生成/ASR 实测。
如需重新写入，可在设置 →「模型服务(apikey)」→「阿里云百炼」填入。

---

## 9. 建议的下一步顺序

1. ~~**重新打包并跑通打包版**（P0）~~ ✅ 已完成
2. ~~**决定 chrome-shell 与 Electron 模式的默认**~~ ✅ 已改为打包态默认 Electron
3. 装一次 NSIS 安装包做完整验收（需人工操作）
4. ~~**模型清单接口（P1）**~~ ✅ 确认不需要实现（渲染层已不调用）
5. 之后考虑需要外部资源的功能（P2）
