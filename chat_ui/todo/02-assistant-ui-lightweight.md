# TODO 02：assistant-ui 轻量化与 Tailwind 样式治理

> 状态：**需求文档（未开工）**。基于当前仓库代码与两份线上 CSS 的实测结论整理。
> 关联：`todo/01-socket-followup.md`（CU-01 ~ CU-08）、`index.html`、`src/view/*`、`src/rout/*`。
> 约定：沿用现有纯模板字符串 + `TplToHtml` 的实现方式，不引入 React/Vue/assistant-ui 运行时。

---

## 0. 现状事实（调研结论）

### 0.1 代码结构

| 层 | 文件 | 职责 |
| --- | --- | --- |
| 入口 | `src/router.ts`、`src/app.ts` | 路由注册、样式注入、初始化各模块 |
| 视图模板 | `src/view/app.ts`、`chat_content.ts`、`chat_msg.ts`、`chat_form.ts`、`slidebar.ts`、`header.ts`、`tabs.ts` | 模板字符串（含大量 `aui-*` 类名与 `data-slot`） |
| 逻辑 | `src/rout/app.ts`、`chat_msg.ts`、`chat_form.ts`、`slidebar.ts`、`header.ts`、`render_msg.ts` | 渲染、事件、分页 |
| 接口 | `src/apis/chatllm.ts`、`cloud.ts`、`sessions.ts`、`messages.ts`、`attachments.ts` | WebSocket `/soket` 调用 chatllm |
| 工具 | `src/utils/input_watch.ts`、`time.ts`、`uuid.ts` | 输入框事件、时间分组 |
| 测试 | `tests/chatllm_api.test.ts` | 只有 1 个集成测试文件 |

规模约 2,035 行 TS，其中视图模板约 600 行，**大量代码是 assistant-ui 的类名与结构照搬**，但运行时并不使用 assistant-ui。

### 0.2 CSS 体积与加载链路（实测）

| 文件 | 体积 | 行数 | 说明 |
| --- | --- | --- | --- |
| `assets/css/base.css` | 463,611 B | 7 | 首行 `@import "tailwindcss"`（浏览器端无效），其后是完整 Tailwind v4 产物 + 自定义样式，含约 1,000 个 utility 类 |
| `assets/css/release.css` | 669,730 B | 19,454 | Tailwind v4.1.18 **全量未压缩**产物 + 自定义动画/样式 |
| `assets/css/marked.css` | 32,312 B | 1,247 | Markdown 样式 |
| `assets/css/test.css` | 12,401 B | 357 | 旧版精简样式，与 `release.css` 末尾内容重复 |
| 主框架 `css-manage33031.css` | 250,682 B | 1（压缩） | 3,487 条规则，含自己的 reset 与一套 utility 类 |

实际加载链路：

- `index.html` → 主框架 CSS + `base.css`
- `src/app.ts` → 运行时再注入 `release.css` + `marked.css`

即页面同时加载 **两份完整 Tailwind 产物**（`base.css` + `release.css`），未压缩总量约 **1.41 MB**（不含字体图标），其中绝大部分是未使用的 utility。

### 0.3 按需生成的实测结果

用仓库内已安装的 `tailwindcss@4.3.3` + `@tailwindcss/postcss@4.1.18` 扫描 `src/` 与 `index.html` 生成：

| 指标 | 结果 |
| --- | --- |
| 未压缩 | 34,496 B |
| gzip | 6,268 B |
| 规则数 | 416 |

对比当前两份产物合计 1.13 MB，**可裁剪 97% 以上**。该结果尚未包含聊天模块自定义动画/组件样式（预计 +10~20 KB）。

### 0.4 主框架与 Tailwind 的冲突（已在浏览器中实测）

主框架 CSS 全部为**无层（unlayered）**规则，而 Tailwind v4 的 `theme/base/components/utilities` 都在 `@layer` 内。按 CSS Cascade Layers 规则，**无层普通声明优先于所有分层声明**（与选择器权重无关）。实测结果：

| 冲突点 | 主框架 | Tailwind | 实际计算值 |
| --- | --- | --- | --- |
| `.p-4` | `padding: .25rem` | `padding: 1rem` | **4px**（主框架胜） |
| `.m-2` | `margin: .125rem` | `margin: .5rem` | **2px**（主框架胜） |
| `--color-gray-500` | `:root` 中定义 | `@layer theme` 中定义 | **主框架值**（theme 层被压制） |
| `--breakpoint-sm/md/lg/xl` | 576 / 768 / 992 / 1200 | 640 / 768 / 1024 / 1280 | 主框架值，响应式断点整体偏移 |
| `*` reset | `margin:0;padding:0;border:0 solid` | preflight 在 `@layer base` | 主框架 reset 优先 |

模板中使用的 270 个类名里，有 **25 个与主框架同名**：`p-2`、`pb-4`、`pb-8`、`pt-2`、`pt-4`、`mb-14`、`mb-6`、`ml-2`、`ml-auto`、`mt-2`、`pr-2`、`pl-8`、`gap-2`、`border`、`grid`、`overflow-hidden`、`text-center`、`transition-all`、`outline-none`、`bg-transparent`、`cursor-pointer`、`justify-center`、`justify-end`、`justify-start`、`left-0`。另有 4 个 `vg-*` / `search-*` 类是有意复用主框架组件，不在此列。

主框架的间距单位是 **1 单位 = 1px**（`p-2 = 0.125rem = 2px`），Tailwind 是 **1 单位 = 4px**（`p-2 = 0.5rem = 8px`），同名类实际间距只有设计值的 1/4。另外主框架 `.overflow-hidden` 额外带 `position: relative`，`.transition-all` 的时长也不同。

### 0.5 “实时渲染 Tailwind”可行性（已实测）

| 方案 | 可行性 | 代价 | 结论 |
| --- | --- | --- | --- |
| 浏览器端 `@tailwindcss/browser@4`（CDN/JSR） | **可行**：页面加载后动态插入的 DOM 能被 MutationObserver 扫描并生成样式（实测动态元素 `p-4` = 16px、自定义 `--color-brand` 生效） | 脚本传输 68.9 KB；首次编译有延迟/FOUC；每条新消息都会触发扫描；生产环境不推荐 | 仅用于开发预览 |
| 构建期按需生成 + `--watch` | **可行且推荐**：`@tailwindcss/postcss` 已在 `node_modules`，扫描 `src/` 即可 | 需要新增一个构建任务；产物从 1.13 MB 降到约 35~55 KB | **采用** |
| 继续使用现有静态产物 | 可行但不可持续 | 两份全量产物重复、无压缩、类名冲突 | 废弃 |

**结论**：当前框架可以实时渲染 Tailwind，但生产应走“构建期按需 + 开发期 watch”，不要在页面中常驻 `@tailwindcss/browser`。

---

## 1. 任务总表

| ID | 需求 | 优先级 | 主要文件 | 验收 |
| --- | --- | --- | --- | --- |
| CU-09 | 用轻量组件块替换 assistant-ui 结构（对应需求 1） | P0 | 新增 `src/ui/*`，改造 `src/view/*`、`src/rout/*` | 每个块 ≤ 150 行；模板类名数量下降 ≥ 60%；页面视觉与交互不回退 |
| CU-10 | CSS 轻量化：单份产物 + 按需生成 + 压缩（对应需求 2） | P0 | `deno.json`、新增 `src/styles/*`、`assets/css/*` | 页面只加载 1 份 Tailwind；`chat.css` ≤ 60 KB（gzip ≤ 15 KB）；删除 `release.css`/`base.css` 双份 |
| CU-11 | 确认并落地 Tailwind 渲染方式（对应需求 3） | P0 | `deno.json`、`src/styles/app.css`、构建脚本 | `deno task build:css` 可复现生成；开发期 watch 可用；生产不加载浏览器版 |
| CU-12 | 补齐 AI 对话功能模块（对应需求 4） | P1 | `src/rout/*`、`src/apis/*`、`src/view/*` | 见 §2.4 功能表；P0 项全部可用 |
| CU-13 | 主框架 CSS 冲突治理（对应需求 5） | P0 | `src/view/*`、`src/styles/*`、`index.html` | 计算样式断言通过；同名 utility 不再互相覆盖 |

---

## 2. 任务详情

### 2.1 CU-09：轻量组件块（需求 1）

**目标**：把 assistant-ui 的 primitive 结构整理成 chat_ui 自己的“块”，每块一个文件、一个纯函数、一份短模板；去掉照搬的长类名与重复 SVG。

**块映射表**：

| assistant-ui primitive | 当前实现 | 目标块 | 说明 |
| --- | --- | --- | --- |
| `ThreadPrimitive.Root` | `src/view/app.ts` | `src/ui/shell.ts` | 页面骨架、侧栏/主区布局 |
| `ThreadList` / `ThreadListItem` | `src/view/slidebar.ts` | `src/ui/thread-list.ts` | 新对话、分组、加载更多、菜单入口 |
| `Message` / `UserMessage` / `AssistantMessage` | `src/view/chat_msg.ts` | `src/ui/message.ts` | 用户/助手消息、状态、时间 |
| `ActionBar` / `Copy` / `Reload` | 现有模板中被删减，只剩 timing 按钮 | `src/ui/message-actions.ts` | 复制、重新生成、更多 |
| `Composer` / `ComposerInput` / `ComposerSend` | `src/view/chat_form.ts` + `src/utils/input_watch.ts` | `src/ui/composer.ts` | 输入区、发送键、placeholder |
| `ThreadWelcome` | `chat_form.ts` 中“开始新的设计” | `src/ui/welcome.ts` | 空态与建议提示 |
| `Attachment` / `AttachmentPreview` | `src/rout/chat_form.ts` 内联 DOM | `src/ui/attachment.ts` | 附件卡片、大小、移除 |
| `ThreadHeader` | `src/view/header.ts` | `src/ui/header.ts` | 标题编辑、归档、侧栏开关 |
| `Tooltip` / `DropdownMenu` | `src/view/tabs.ts` | `src/ui/menu.ts` | 会话上下文菜单 |
| 图标（内联 SVG） | 各模板重复 | `src/ui/icons.ts` | 统一 `icon(name, size)` |
| 基础按钮 | 每个按钮 40+ 类名 | `src/ui/button.ts` | `button({ variant, size, icon })` |
| 消息列表/滚动 | `src/rout/render_msg.ts` | `src/ui/message-list.ts` | 追加/前插/滚动到底 |

**块骨架（示例，实际约 60~100 行）**：

```ts
// src/ui/message.ts —— 单条消息块
import { escapeHtml } from "../utils/html.ts";
import { icon } from "./icons.ts";

export interface MessageProps {
  role: "user" | "assistant";
  messageId: string;
  html: string;          // assistant 已由 chatllm 转好 HTML；user 必须转义
  duration?: string;
  status?: "streaming" | "complete" | "error";
}

export const messageBlock = (p: MessageProps): string => `
<div class="aui-msg aui-msg--${p.role}" data-slot="message" data-role="${p.role}"
     data-message-id="${p.messageId}" data-status="${p.status ?? "complete"}">
  <div class="aui-msg__content aui-md" data-slot="message-content">
    ${p.role === "user" ? escapeHtml(p.html) : p.html}
  </div>
  <div class="aui-msg__actions" data-slot="message-actions">
    <button class="aui-btn aui-btn--icon" data-action="copy" aria-label="复制">
      ${icon("copy", 14)}
    </button>
    ${p.role === "assistant" ? `
    <button class="aui-btn aui-btn--icon" data-action="regenerate" aria-label="重新生成">
      ${icon("refresh", 14)}
    </button>` : ""}
    ${p.duration ? `<span class="aui-msg__timing">${p.duration}</span>` : ""}
  </div>
</div>`;
```

**规则**：

1. 块 = 纯函数 `render(props) => string`，不持有事件；事件仍由 `src/rout/*` 统一委托。
2. 结构类用短语义类（`.aui-msg`、`.aui-btn`），视觉细节进 `src/styles/components.css` 的 `@layer components`。
3. 保留 `data-slot` / `data-action`，便于测试与后续替换。
4. 单个块文件 ≤ 150 行；`src/ui/icons.ts` 统一 SVG，模板中不再出现内联 `<svg>`。
5. 迁移顺序：`icons` → `button` → `message` → `composer` → `thread-list` → `header` → `menu`。

**测试**：`tests/ui_blocks.test.ts` —— 每个块渲染后包含预期的 `data-slot`/`data-role`；用户内容被转义；assistant HTML 原样输出；无重复 SVG。

**验收**：`src/view/*` 中 class 属性总字符数下降 ≥ 60%；页面消息、输入、侧栏、归档、重命名、附件选择行为与现在一致。

---

### 2.2 CU-10：CSS 轻量化（需求 2）

**现状问题**：

1. `base.css` 与 `release.css` 是两份完整 Tailwind 产物，内容高度重复；
2. 均为全量 utility（含 `.bg-red-500`、`.text-cyan-700` 等未使用类）；
3. `base.css` 首行残留 `@import "tailwindcss"`，浏览器会尝试请求不存在的路径；
4. `release.css` 未压缩（19,454 行）；`test.css` 是旧副本，与 `release.css` 末尾重复；
5. `app.ts` 运行时注入样式，与 `index.html` 的静态加载并存，难以控制顺序。

**方案**：

1. 新建唯一入口 `src/styles/app.css`：

   ```css
   @import "tailwindcss" source(none);
   @source "../";
   @source "../../index.html";

   @theme { /* 颜色、字体、圆角、断点，见 CU-13 */ }

   @layer components { /* 组件块样式 */ }
   /* 自定义动画、markdown 样式按需引入 */
   ```

2. 新增构建任务（`deno.json`）：

   ```json
   "build:css": "deno run -A npm:@tailwindcss/cli@4.3.3 -i src/styles/app.css -o assets/css/chat.css --minify",
   "watch:css": "deno run -A npm:@tailwindcss/cli@4.3.3 -i src/styles/app.css -o assets/css/chat.css --watch"
   ```

   > 若不允许新增 npm 包，则用已安装的 `@tailwindcss/postcss` + `postcss` + `esbuild`/`cssnano` 写一个 `scripts/build_css.ts`，等价产出。

3. 产物合并为一份 `assets/css/chat.css`；删除 `release.css`、`base.css`、`test.css`：
   - `index.html` 只保留主框架 CSS + 字体图标；
   - `chat.css` 由 `chat.js` 运行时按 `data-chat-css` 幂等注入（保留现有逻辑，只改文件名）；
   - `dytes.json` 的 `exports` 同步改为 `./assets/css/chat.css`。
4. `marked.css`：仅在有 assistant 消息时加载，或把 `.markdown-body` 规则裁剪进 `chat.css`（目标 ≤ 10 KB）。
5. 压缩阈值写入验收：`chat.css` ≤ 60 KB（gzip ≤ 15 KB）。

**实测基线**（扫描当前 `src/` + `index.html`）：

- 未压缩 34,496 B / gzip 6,268 B / 416 条规则；
- 加上组件与动画样式后预计 45~55 KB，仍远低于当前 1.13 MB。

**测试**：

- `tests/css_build.test.ts`：产物存在、体积阈值、不得包含 `@import "tailwindcss"`、不得包含未使用的示例类（如 `.bg-red-500`，若源码未使用）；
- 构建可复现：连续两次构建 hash 一致；
- 页面手工检查：首屏无样式闪烁、Markdown、代码块、暗色类名不回归。

**验收**：页面只加载 1 份 Tailwind 产物；Network 面板中 CSS 总量相比现在下降 ≥ 90%。

---

### 2.3 CU-11：Tailwind 渲染方式确认（需求 3）

**结论**：当前框架**可以**实时渲染 Tailwind，但不建议在生产使用浏览器端方案。

| 方案 | 实测/依据 | 适用 |
| --- | --- | --- |
| `@tailwindcss/browser@4.3.3` | 动态插入的 DOM 在 500ms 后被扫描，`p-4` = 16px、自定义主题色生效；CDN 传输 68.9 KB | 开发预览、演示 |
| 构建期按需 + watch | `tailwindcss@4.3.3`、`@tailwindcss/postcss@4.1.18` 已在 `node_modules`；生成 34.5 KB | **生产采用** |
| 现有静态产物 | 两份全量产物、无压缩、类名冲突 | 废弃 |

**落地要求**：

1. `deno task build:css` / `watch:css` 进 `deno.json`，CI 或发布前必须执行；
2. 产物提交到 `assets/css/chat.css`（与现有发布方式一致）；
3. 不允许在 `index.html` 或 `app.ts` 中引入 `@tailwindcss/browser`；
4. 模板新增类名后必须重新构建，否则样式缺失——在 README/任务说明中注明。

**验证**：`deno task build:css` 成功；`deno check src/app.ts` 通过；构建后页面样式完整。

---

### 2.4 CU-12：AI 对话功能模块（需求 4）

**现有能力**：会话列表/搜索（前端过滤）、分页加载、新建对话、发送消息、标题编辑、置顶/归档、附件选择与存储、历史消息上滑加载。

**缺口与建议**（P0 为先补）：

| 模块 | 现状 | 建议 | 依赖 |
| --- | --- | --- | --- |
| 发送中状态 / 防重复提交 | 输入层有 `isSending`，但按钮与输入未整体禁用，失败无占位 | **P0**：`setSending` 统一禁用输入/附件/按钮；失败恢复并提示（与 CU-02 合并） | 无 |
| 流式输出 | `chat` 一次性返回，最长 120s | **P0**：确认 `/soket` 是否支持 chunk 推送；支持则增量渲染，注意 Markdown 增量解析 | chatllm |
| 停止生成 | 无 | **P0**：取消当前请求/停止接收；按钮与发送键互斥 | chatllm |
| 错误提示与重试 | `alert` 或追加一条错误消息 | **P0**：统一错误码 → 文案；消息级“重试”（与 CU-03 合并） | 无 |
| 断线/重连状态 | 无 | **P1**：顶部状态条 + 自动重连提示（与 CU-04 合并） | DxSocket |
| 重新生成 | 模板中按钮被删除 | **P1**：对最后一条 assistant 重新请求；保留旧内容或覆盖 | chatllm |
| 消息编辑后重发 | 无 | **P1**：用户消息可编辑，编辑后截断后续消息并重发 | chatllm（需确认历史重写能力） |
| 复制消息 / 代码块复制 | 无 | **P1**：消息级复制；代码块右上角复制 | 无 |
| 附件真正随消息发送 | 仅存储到 ostfil，发送时未带附件 | **P0**：`sendMessage` payload 携带附件引用；失败可重试；显示上传/发送状态 | chatllm / ostfil |
| 附件预览 | 只有文件名 + 大小 | **P1**：图片缩略图、文档图标、点击预览 | 无 |
| 模型选择 | `sessions.model_name` 存在，UI 无 | **P1**：新建/会话内切换模型，写入 `model_name` | chatllm 模型列表接口（待确认） |
| 系统提示 / 参数 | `system_prompt`、`model_config` 存在，UI 无 | **P2**：系统提示编辑、温度等参数面板 | chatllm |
| token / 耗时统计 | messages 表有字段，UI 只有空 timing | **P2**：消息底部显示 tokens、耗时；会话汇总 | chat_detail 字段确认 |
| 消息时间 | 无 | **P2**：hover/分组显示时间 | 无 |
| 会话删除 | 无 | **P1**：上下文菜单增加删除 + 二次确认 | chatllm（待确认接口） |
| 全文搜索 | 前端过滤已加载列表 | **P1**：改用 `dialogue_search`（与 CU-07 合并） | chatllm |
| 暗色模式 | 模板有 `dark:` 类，无切换 | **P2**：主题切换与持久化 | 无 |
| 滚动到底按钮 | 无 | **P1**：离开底部时显示“回到最新” | 无 |
| 快捷键 | Enter / Shift+Enter / Ctrl+Enter | **P2**：`Ctrl+K` 搜索、`Ctrl+N` 新对话、`Esc` 停止 | 无 |
| 导出对话 | 无 | **P2**：Markdown/JSON 导出 | 无 |
| 分支/树状对话 | messages 表有 `parent_id`，接口未暴露 | **P3**：先确认 chatllm 是否支持分支 | chatllm |
| 多选批量操作 | 无 | **P3**：批量归档/删除 | 无 |

**测试**：每个 P0/P1 功能至少一个测试（mock `DxSocket`）；涉及 DOM 的用轻量 DOM 断言，避免依赖真实后端。

**验收**：P0 模块全部可用；P1 模块有明确排期；不引入与 CU-01~CU-08 重复的实现。

---

### 2.5 CU-13：主框架 CSS 冲突治理（需求 5）

**冲突根因**：主框架 CSS 未分层且自带同名 utility，浏览器中无层声明优先于 Tailwind 的 `@layer utilities`。仅调整 `<link>` 顺序无效（层叠层优先于顺序与权重）。

| 冲突类别 | 具体项 | 影响 | 处理 |
| --- | --- | --- | --- |
| 同名 utility | 25 个类（`p-*`/`m-*`/`gap-*`/`border`/`grid`/`overflow-hidden`/`transition-all` 等） | 间距被压到 1/4；`overflow-hidden` 多出 `position:relative` | 给 chat 的 Tailwind 加前缀（`chat-`），模板同步改名 |
| 颜色变量 | `--color-gray-50..900`、`--color-white/black` 等与 Tailwind theme 同名 | Tailwind 的 `text-gray-500` 等取到主框架值 | chat 使用独立命名空间 `--color-chat-*`，或全部改用 prefix 后的变量名 |
| 断点变量 | `--breakpoint-sm/md/lg/xl` 值不同（576/768/992/1200 vs 640/768/1024/1280） | `md:`/`lg:` 生效区间偏移 | 定义 `--breakpoint-chat-*`，模板使用 `chat-md:` 等 |
| 全局 reset | `*{margin:0;padding:0;border:0 solid}`、`button,input{...}` | Tailwind preflight 与部分 utility 被压制 | 不依赖 preflight；组件样式显式声明；关键 reset 放在容器作用域内 |
| `@import "tailwindcss"` 残留 | `base.css` 首行 | 浏览器发出无效请求 | 构建产物中禁止出现 |

**方案对比**：

| 方案 | 优点 | 缺点 | 结论 |
| --- | --- | --- | --- |
| A. Tailwind `prefix(chat)` + 变量/断点改名 | 彻底避免同名冲突；不依赖加载顺序；改动可脚本化 | 需全量改模板类名；类名变长 | **推荐（P0）** |
| B. 去层 + 确保 chat.css 最后加载 | 改动小 | 依赖顺序；主框架升级/新增同名类会再次冲突；无法解决变量覆盖 | 仅作过渡 |
| C. Shadow DOM 挂载 chat UI | 完全隔离 | 字体/事件/模板渲染改造大；与现有 `document.getElementById` 逻辑冲突 | 备选 |
| D. iframe 嵌入 | 完全隔离 | 路由、通信、尺寸成本高 | 不采用 |
| E. 裁剪主框架 CSS 子集 | 体积小 | 需要维护线上文件副本，风险高 | 不采用 |

**实施步骤（方案 A）**：

1. `src/styles/app.css` 改为 `@import "tailwindcss" prefix(chat) source(none);`；
2. 模板类名机械替换：`p-4` → `chat-p-4`，`md:` → `chat-md:`；用脚本生成映射并人工复核（25 个同名类优先）；
3. `@theme` 中颜色改名 `--color-chat-*`，断点改名 `--breakpoint-chat-*`；
4. 组件样式（`.aui-*`）放在 `@layer components`，选择器限定在 `#chat-container` 内，避免外溢；
5. 保留 `data-slot` 作为行为测试锚点，不参与样式；
6. 在 `index.html` 中不再加载 `base.css`，只加载主框架 CSS 与字体图标。

**验收（浏览器计算样式断言）**：

- chat 容器内 `.chat-p-4` = `16px`，`.chat-m-2` = `8px`；
- `--color-chat-gray-500` 等于 chat 主题定义值，不受主框架影响；
- `chat-md:` 在 768px 生效、`chat-lg:` 在 1024px 生效；
- 主框架自身页面（非 chat 容器）样式无变化；
- 无 `@layer` 相关的样式覆盖告警。

---

## 3. 实施顺序与风险

1. CU-13 前缀方案 + CU-10 构建链（先定样式基线，避免后续块迁移返工）
2. CU-09 组件块迁移（`icons` → `button` → `message` → `composer` → 其余）
3. CU-11 构建任务与产物验证
4. CU-12 功能补全（先 P0：发送状态、附件发送、流式/停止、错误重试）
5. 文档与测试收尾

**风险**：

| 风险 | 影响 | 缓解 |
| --- | --- | --- |
| 模板类名全量改名遗漏 | 局部样式失效 | 脚本替换 + 构建期检查未加前缀的 utility；逐页截图对比 |
| 主框架 CSS 升级 | 变量/断点再次变化 | chat 使用独立命名空间；CI 中保留一份主框架 CSS 做计算样式回归 |
| 流式接口不支持 | CU-12 的流式/停止无法实现 | 先确认 chatllm `/soket` 能力，再定优先级 |
| 删除 `release.css`/`base.css` 影响发布 | 已发布版本引用旧文件 | 保留一个版本周期的兼容副本，或确认 `dytes.json` 发布清单 |
| `@tailwindcss/cli` 需新增依赖 | 离线构建失败 | 使用已安装的 `@tailwindcss/postcss` 写本地构建脚本 |

---

## 4. 测试与验收清单

| 检查 | 方式 |
| --- | --- |
| 组件块渲染 | `tests/ui_blocks.test.ts`（纯函数断言） |
| CSS 构建 | `tests/css_build.test.ts`（体积、前缀、无 `@import` 残留） |
| 计算样式/冲突 | 浏览器自动化或手工：`.chat-p-4`、变量、断点 |
| 发送状态/附件 | mock `DxSocket` + DOM 断言 |
| 回归 | `deno check src/app.ts`、`deno test`、构建产物 `node --check` |
| 体积 | Network 面板：CSS 总量 ≤ 100 KB（含主框架），chat.css ≤ 60 KB |

---

## 5. 待确认

1. **需求 1 的参考块**：消息中粘贴的 109 行示例未随文本传入，当前文档按现有 `aui-*` 结构整理映射与骨架；如需严格对齐示例结构，请补充该段内容。
2. **是否允许修改主框架 CSS**：若可以，最省事的是把主框架 reset 与 utility 包进 `@layer vendor`；若不可以，按 CU-13 方案 A 执行。
3. **chat_ui 的运行形态**：是否始终嵌入主框架页面（同页 DOM）、是否有 iframe/Shadow DOM 场景。
4. **前缀命名**：`chat-` / `tw-` / 其他；确认后统一替换。
5. **流式能力**：chatllm `/soket` 是否支持增量返回与取消；决定 CU-12 中流式/停止的优先级。
6. **发布方式**：`publish.exe` / `dytes.json` 的 `exports` 是否要求保留 `release.css`、`marked.css` 文件名以兼容已安装版本。
