# Canvas AI

AI 创作画布桌面应用。节点式无限画布 + 多模态生成（图像 / 视频 / 音频 / 文本）+ 剧本工作室，Electron 打包为 Windows 桌面端，本地 Python 进程提供后端能力。

> 开发进度、已知坑与后续计划见 [DEV-STATUS.md](DEV-STATUS.md)。

## 技术栈

| 层 | 选型 |
|---|---|
| 桌面壳 | Electron 43（主进程原生 Node，无框架） |
| 渲染层 | 原生 ESM（无 Vue/React），自定义画布渲染 |
| 后端 | Python 3 标准库 `http.server`，PyInstaller 冻结为单文件 exe |
| 打包 | electron-builder → NSIS 安装包；electron-updater 自更新 |
| 端侧能力 | MediaPipe（姿态/视觉）、Three.js（均为 `vendor/` 内置副本） |
| 原生辅助 | C/C++ 编译的截图助手与窗口尺寸守卫 |

## 目录结构

```
electron/     主进程：窗口、后端拉起、素材索引、Agent 能力、菜单（104 个模块）
src/          渲染层：core / modules / components / services / ui / i18n / config
  modules/    画布节点与功能模块（267 项）
api/          渲染层调用的 API 客户端层（107 项）
backend/      后端业务服务模块（Python）
server.py     后端入口：静态 web 根 + /api/v2 路由 + 就绪探针
styles/       样式表（静态合并产物，见下方约定）
native/       原生助手源码与编译产物
tools/        构建、图标、发布、OSS 上传脚本
vendor/       第三方前端库的内置副本
build/        应用图标等资源
```

## 环境要求

- Node.js ≥ 20（含 npm）
- Python 3.11（开发态源码运行后端；打包需要 PyInstaller）
- Windows 10/11 x64

## 启动

```bash
npm install
AIC_CANVAS_RUNTIME=electron npx electron .
```

`AIC_CANVAS_RUNTIME=electron` 不可省略：默认运行时分支会走 Chrome Shell 模式（拉起真实 Chrome 并经 CDP 控制），开发态用 Electron 窗口模式更稳定。

主进程以源码方式拉起后端：`python server.py --host=127.0.0.1 --port=8777`，渲染层请求需带 `X-AIC-Local-Token` 头（令牌由主进程通过环境变量注入）。

## 常用命令

| 命令 | 作用 |
|---|---|
| `npm start` | 启动应用 |
| `npm run icon` | 由 `tools/make-icon.py` 生成 `build/app-icon.ico` |
| `npm run backend:freeze` | PyInstaller 冻结后端到 `.electron-runtime/runtime/backend/` |
| `npm run dist:dir` | 只产出解包目录，快速验证打包布局 |
| `npm run dist` | 产出 NSIS 安装包到 `dist/` |
| `npm run release` | 版本发布流程（`tools/release.mjs`） |
| `npm run publish:oss` | 上传更新包到对象存储（`tools/publish-oss.mjs`） |

打包时 Electron 与 electron-builder 的 winCodeSign / nsis 二进制默认从 GitHub 拉取，国内网络需切镜像：

```bash
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
export ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
```

## 配置与凭证

对象存储凭证不入库。按需复制模板后填入真实值：

```bash
cp tools/oss.credentials.example.json tools/oss.credentials.json
```

`tools/oss.credentials.json`、`配置文件（不要泄露了）.txt`、`venv/`、`dist/`、`.userdata/`、`native/**/bin` 产物等均已在 `.gitignore` 中排除，提交前请勿强行 `git add -f`。

## 开发约定

- **样式**：`styles/` 下的子目录文件不会被单独加载，实际生效的是静态合并产物。新增样式须同时写入子源文件与合并后的 `styles/story-workspace.css` 一类目标文件。
- **代码形态**：仓库内源码为压缩/混淆形态，编辑时注意保持格式一致。
- **图标**：修改应用图标必须重新打包并清理系统图标缓存，否则看到的仍是旧图标。

## 分支

`main` 为唯一长期分支。
