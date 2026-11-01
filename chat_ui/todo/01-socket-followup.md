# TODO 01：chat_ui socket 化后续任务

> 状态：**1.0.7 已发布，对话全部走 `/soket`**；webdx 1.1.0 已发布，待切回 JSR 依赖。
> 关联：`feature/005-chat-ui-socket.md`（dytes_sys_operations）、`webdx/todo/06-socket-call.md`、cyctron `todo/socket-call.md`。
> 约定：每个功能点必须有对应测试；单元测试用 mock `DxSocket`，集成测试在 `app/piksel` 运行。

---

## 0. 已完成（1.0.7）

| 项 | 实现 |
| --- | --- |
| `chatllm.ts` | `DxSocket.call()` + 符号映射 `chat→post_chat` 等 |
| 发送消息 | `chat`，首次自动新建对话 |
| 会话列表 / 搜索 / 更新 | `dialogue_list` / `dialogue_search` / `dialogue_update` |
| 历史消息 | `chat_detail`（`before_id` 游标） |
| Markdown 渲染 | 使用 chatllm 的 `content_html`，不依赖 marked.js |
| 样式自动加载 | `/chat_ui/release.css`、`/chat_ui/marked.css` |
| SPA fallback | `/chat?uid=...` 回退 `web/index.html`（cyctron 1.0.8） |
| 发布 | `webs/chat_ui/1.0.7/` |

---

## 1. 任务总表

| ID | 功能点 | 优先级 | 主要文件 | 测试 |
| --- | --- | --- | --- | --- |
| CU-01 | 切回 JSR webdx 1.1.0，重发 1.0.8 | P0 | `deno.json`、`dytes.json` | `deno check` + 构建 |
| CU-02 | 发送中状态与防重复提交 | P0 | `src/rout/chat_form.ts`、`src/utils/input_watch.ts` | `tests/send_state.test.ts` |
| CU-03 | 错误码到用户提示 | P1 | `src/apis/chatllm.ts`、`src/rout/chat_form.ts` | `tests/error_message.test.ts` |
| CU-04 | 断线重连 UI 与重试 | P1 | `src/apis/chatllm.ts`、`src/rout/*.ts` | `tests/reconnect.test.ts` |
| CU-05 | 历史分页游标边界 | P1 | `src/rout/chat_msg.ts`、`src/apis/messages.ts` | `tests/history_cursor.test.ts` |
| CU-06 | 首次发送跳转回归 | P1 | `src/rout/chat_form.ts` | 手工 / `tests/first_send.test.ts` |
| CU-07 | 会话搜索使用 `dialogue_search` | P2 | `src/rout/slidebar.ts`、`src/apis/sessions.ts` | `tests/search.test.ts` |
| CU-08 | 测试体系补齐 | P1 | `tests/` | `deno test` |

---

## 2. 任务详情

### CU-01 切回 JSR webdx 1.1.0（P0）

**目标**：移除本地路径映射，使用已发布的 `@funxdata/webdx@1.1.0`。

**改动**：

`deno.json`：

```json
"@funxdata/webdx/dxsoket": "jsr:@funxdata/webdx@^1.1.0",
"@funxdata/webdx/dxhttp": "jsr:@funxdata/webdx@^1.1.0"
```

- 删除 `../../funxdata/webdx/...` 本地映射；
- `deno.json` 版本 `1.0.7 → 1.0.8`；
- 重新构建、发布 `webs/chat_ui/1.0.8/`；
- 同步 `Piksel/dytes.json` 与 `app/piksel/dytes.json`。

**注意**：Deno 的 `minimumDependencyAge` 默认 24 小时；刚发布的 1.1.0 可能被阻止，构建时可加 `--min-dep-age 0` 或等待。

**测试**：

```bash
deno check src/app.ts
deno bundle --import-map deno.json src/app.ts -o "$TMPDIR/chat_ui_bundle.js"
node_modules/.bin/esbuild "$TMPDIR/chat_ui_bundle.js" --minify --target=es2022 \
  --format=esm --drop:console --drop:debugger \
  --outfile=assets/project_app_0_0_1.js
node --check assets/project_app_0_0_1.js
```

**验收**：构建不再依赖本地路径；产物包含 `/soket`、`post_chat`；无 `/chatllm`。

---

### CU-02 发送中状态与防重复提交（P0）

**目标**：发送期间禁用输入与按钮，避免重复请求；失败后恢复。

**改动**：

- `input_watch.ts`：暴露 `setSending(bool)`；
- `chat_form.ts`：发送前 `setSending(true)`，`finally` 恢复；
- 首次发送（无 uid）与续聊都适用；
- 可选：显示“正在生成…”占位。

**测试**：`tests/send_state.test.ts`

- 发送中按钮 disabled；
- 连续点击只触发一次 `sendMessage`；
- 失败后按钮恢复、文本保留；
- 成功后清空输入。

**验收**：无重复消息写入数据库。

---

### CU-03 错误码到用户提示（P1）

**目标**：把调用层错误码与业务错误码转成可读提示。

**映射**：

| 来源 | 提示 |
| --- | --- |
| `ChatllmError.code = -1` | 请求参数错误 |
| `-2` | 模型能力库加载失败（检查 chatllm.dll） |
| `-4` | 调用失败 / 输出过大 |
| `-5` | 非法库或符号 |
| 超时 | 请求超时，请重试 |
| `result.code = 400102` | 参数 JSON 错误 |
| `result.code = 400400` | 模型调用失败（检查 setting） |

**改动**：新增 `src/apis/error_message.ts`，`chat_form` / 列表加载使用。

**测试**：`tests/error_message.test.ts`

- 每个 code 返回预期文案；
- 未知 code 有兜底；
- 不泄露内部路径。

**验收**：页面提示可读，不出现 `undefined`。

---

### CU-04 断线重连 UI 与重试（P1）

**目标**：socket 断线时提示，重连后恢复；发送失败提供重试。

**改动**：

- `chatllm.ts` 导出 socket 状态订阅（`state` / `close` / `open`）；
- 页面顶部显示“连接中断，正在重连…”；
- 重连成功后可自动重试最近一次失败请求（可选，需幂等）。

**测试**：`tests/reconnect.test.ts`

- mock socket 触发 `close` → UI 提示；
- `open` → 提示消失；
- 发送中断线 → 错误提示 + 保留输入；
- 重连后再次发送成功。

**验收**：断线不白屏，用户可恢复。

---

### CU-05 历史分页游标边界（P1）

**目标**：`chat_detail` 的 `before_id` 分页在空列表、单条、末尾时行为正确。

**改动**：

- `chat_msg.ts`：使用 `first_id` / `has_more_before`；
- 避免重复插入同一条消息；
- 空历史不触发加载。

**测试**：`tests/history_cursor.test.ts`

- 0 条消息；
- 1 条消息；
- 恰好 10 条；
- 11 条（分两页）；
- `has_more_before=false` 时不再请求。

**验收**：滚动加载无重复、无缺失。

---

### CU-06 首次发送跳转回归（P1）

**目标**：无 `uid` 发送后跳转 `/chat?uid=...`，在 cyctron 1.0.8 SPA fallback 下返回 200。

**改动**：无（验证项）；如后续改路由，需保持 `location.href` 或 `GlobalPagesRouter.replace` 一致。

**测试**：

- 浏览器手工：根路径 → 发送 → URL 带 uid → 页面显示消息；
- `curl -o /dev/null -w "%{http_code}" "http://127.0.0.1:44944/chat?uid=test"` → 200。

**验收**：首次发送不 404。

---

### CU-07 会话搜索使用 `dialogue_search`（P2）

**目标**：侧边栏搜索框从本地过滤改为服务端搜索。

**改动**：

- `slidebar.ts`：输入防抖（300ms）后调用 `searchSessions(keyword)`；
- 空关键字恢复 `dialogue_list`；
- `sessions.ts` 的 `searchSessions` 已实现。

**测试**：`tests/search.test.ts`

- 关键字命中；
- 空关键字；
- 搜索失败保留原列表；
- 防抖只发一次请求。

**验收**：搜索结果与服务端一致。

---

### CU-08 测试体系补齐（P1）

**目标**：为上述功能提供可重复测试。

**测试文件**：

| 文件 | 内容 |
| --- | --- |
| `tests/chatllm_api.test.ts` | 已有：`dialogue_list` / `chat_detail` 集成 |
| `tests/send_state.test.ts` | 发送状态与防重复 |
| `tests/error_message.test.ts` | 错误码映射 |
| `tests/reconnect.test.ts` | 断线与重连 |
| `tests/history_cursor.test.ts` | 分页游标 |
| `tests/search.test.ts` | 服务端搜索 |

**约定**：

- 单元测试注入 mock `DxSocket`，不依赖网络；
- 集成测试需要 `app/piksel` 的 cyctron；
- `deno test --allow-net tests/` 全部通过。

**验收**：新增功能均有测试；CI/本地可重复。

---

## 3. 发布清单（CU-01 完成后）

```bash
cd /d/codes/github/dytescn/chat_ui
deno check src/app.ts
deno bundle --import-map deno.json src/app.ts -o "$TMPDIR/chat_ui_bundle.js"
node_modules/.bin/esbuild "$TMPDIR/chat_ui_bundle.js" --minify --target=es2022 \
  --format=esm --drop:console --drop:debugger \
  --outfile=assets/project_app_0_0_1.js
node --check assets/project_app_0_0_1.js
./publish.exe

cd /d/codes/app/piksel
# dytes.json: chat_ui = 1.0.8
./update.exe --auto
```

验证：

- `web/chat_ui/chat.js` 大小与发布一致；
- `dytes.lock` chat_ui 1.0.8；
- 页面发送 / 历史 / 列表正常；
- Network 无 `/chatllm`。

---

## 4. 验收总则

- 每个任务包含测试；
- 不恢复到 HTTP `/chatllm`；
- 不在源码或产物中出现密钥；
- 构建产物无 `marked.js` 依赖；
- 页面无控制台错误。

---

## 5. 附件（F-06）后续

| ID | 任务 | 说明 |
| --- | --- | --- |
| CU-09 | 切回 JSR 后重建附件功能 | `attachments.ts` 使用 `@funxdata/webdx/dxsse`；发布 1.0.9 |
| CU-10 | sysinfo 包发布 | 已完成：sysinfo 0.1.0 已发布，Piksel `dependencies-sys` 已加入 |
| CU-11 | 附件随消息发送 | 把 `{uuid,name,size,extra}` 写入消息 metadata / SSE 请求 |
| CU-12 | 移除附件时清理 ostfil | 调 `libostfil.delete_file`，避免 `storage/<uuid>/` 残留 |
| CU-13 | 多选 / 拖拽 / 粘贴 | 支持多文件与拖拽上传 |
| CU-14 | 附件 UI 测试 | mock 选择结果，断言卡片渲染、删除、大小格式化、错误提示 |
| CU-15 | UI 工具链对齐 | `@funxdata/toolkit` 改为 `jsr:@funxdata/toolkit@^0.1.36`；`deno task pack` 指定入口；用 `pack` 生成 release.css 并更新 `dytes.json` exports |

**验收**：选择文件 → 存储 → 显示 → 发送 → 删除清理形成闭环；`sysinfo` 可通过 `update.exe` 安装。
