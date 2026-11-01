# ui

Piksel 的 Web 界面包集合。6 个子项目统一在本仓库维护，各自是可独立安装、更新的
`web` 类型包（`dytes.json`），发布后位于 Piksel 的 `web/<name>/`。

## 子项目

| 目录 | 包名 | 版本 | 作用 | 主要依赖 |
| --- | --- | --- | --- | --- |
| [chat_ui](chat_ui/README.md) | `chat_ui` | 1.0.12 | AI 对话界面：会话、消息、附件、模型调用 | `chatllm`、`info_lib` |
| [init_ui](init_ui/README.md) | `init` | 1.0.20 | 首次启动与初始化：路由、侧边栏、设计软件选择 | `info_lib`、`pages`、`stylesheet` |
| [material_ui](material_ui/README.md) | `material` | 1.0.4 | 素材库：素材文件、类型、版本、标签 | `material_lib`、`info_lib` |
| [plugins_ui](plugins_ui/README.md) | `plugins` | 1.0.9 | 插件管理：列表、分类、安装与更新 | `plugin_lib` |
| [setting_ui](setting_ui/README.md) | `setting` | 1.0.9 | 系统与设计设置 | `info_lib` |
| [workspace_ui](workspace_ui/README.md) | `workspace` | 1.0.5 | 工作区 / 项目：项目、版本、设计文件 | `workspace_lib`、`info_lib` |

版本以各目录下的 `dytes.json` 为准。

## 目录结构

```text
ui/
├── chat_ui/          # 对话界面
├── init_ui/          # 初始化与路由
├── material_ui/      # 素材库
├── plugins_ui/       # 插件管理
├── setting_ui/       # 设置
├── workspace_ui/     # 工作区 / 项目
└── README.md
```

每个子项目结构一致：

```text
<project>/
├── index.html        # 入口页面
├── deno.json         # Deno 任务与依赖映射
├── dytes.json        # 包清单（名称、版本、exports、init）
├── src/
│   ├── app.ts        # 应用入口
│   ├── setup.ts      # 安装 / 更新时执行的 init 脚本
│   ├── apis/         # 能力调用封装（含 *.md 接口说明）
│   ├── rout/ route/  # 路由与事件
│   └── view/         # 模板与视图
├── todo/             # 子项目待办（部分项目）
└── test/ tests/      # 前端测试
```

## 开发

前置：Deno 2.x；使用 Tailwind 的项目还需要 Node.js 20+。

```bash
cd <project>

deno task view     # 本地预览
deno task pack     # 打包产物到 assets/
deno task screen   # 在 screen 宿主中运行
```

构建后，`assets/` 中的文件由 `dytes.json` 的 `exports` 映射为分发文件名，
`src/setup.ts` 在安装 / 更新时执行。

> 各项目的 `deno.json` 存在映射与入口差异，待处理项分别记录在各自的
> `todo/ui-upgrade.md`；打包前先按待办确认 `@funxdata/toolkit` 映射与 `pack` 入口。

## 发布

统一使用 `dytes publish`，不再使用旧的 `publish.exe`：

```bash
cd <project>
deno task pack
dytes publish --dry-run   # 预览
dytes publish             # 上传并更新 packages.json
```

也可以在 GitHub Actions 中调用：

```yaml
      - uses: dytescn/dytes@v0.1.9
        with:
          command: publish
```

## 文档

- 子项目说明：各目录下的 `README.md`
- 接口与数据结构：`<project>/src/apis/*.md`
- 子项目待办：`<project>/todo/*.md`
- 对话侧重点：
  - [chat_ui/todo/01-socket-followup.md](chat_ui/todo/01-socket-followup.md) —— 对话 socket 化后续
  - [chat_ui/todo/02-assistant-ui-lightweight.md](chat_ui/todo/02-assistant-ui-lightweight.md) —— 界面轻量化与 Tailwind 治理

## 约定

- 子项目不再各自保留 `.git`，统一在本仓库提交；
- `node_modules/`、`publish.exe`、`assets/` 构建产物不提交（见各级 `.gitignore`）；
- 修改包版本时同步更新 `dytes.json` 与 `deno.json`，保证 `exports` 产物名一致；
- 跨仓库协议（HTTP 路径、FFI 符号、`dytes.json` 字段）以 Piksel 体系文档为准。
