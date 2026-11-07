# chat_ui / apis

所有运行时 API 统一走 chatllm（socket 调用 `/soket`，`lib=chatllm`，`symbol=<FFI-Symbol>`），不再直接访问 `/database`。

chatllm 对外接口：

| FFI-Symbol | 作用 |
| --- | --- |
| `patch_dialogue` | 对话列表；带 `keyword` 时按标题搜索 |
| `update_dialogue` | 更新 `title` / `show_status` / `is_pinned` / `is_archived` |
| `get_dialogue` | 读取一条对话及其消息分页（`uuid` / `before_id` / `after_id` / `limit`） |
| `post_message` | 新建或续聊，写 user 消息并调用云端生成 assistant |

| 文件 | 作用 | chatllm 符号 |
| --- | --- | --- |
| `chatllm.ts` | 统一请求与错误处理、短名映射 | — |
| `sessions.ts` | 会话列表 / 查找 / 更新 | `patch_dialogue`、`update_dialogue` |
| `messages.ts` | 会话消息分页读取 | `get_dialogue` |
| `cloud.ts` | 发送消息（新建 / 续聊） | `post_message` + `get_dialogue` |

## 短名映射（`chatllm.ts`）

| chat_ui 短名 | FFI-Symbol |
| --- | --- |
| `chat` | `post_message` |
| `dialogue_list` | `patch_dialogue` |
| `dialogue_update` | `update_dialogue` |
| `chat_detail` | `get_dialogue` |

## 调用映射

| chat_ui 调用 | chatllm 接口 |
| --- | --- |
| `getSessions` | `patch_dialogue`（`page` / `page_size`） |
| `getSessionById` | `patch_dialogue`（分页遍历按 id 查找） |
| `updateSession` | `update_dialogue`（`uuid` + 待更新字段） |
| `getMessagesBySessionWithLimit` | `get_dialogue`（取返回的 `messages`，`before_id` 游标） |
| `sendMessage` | `post_message` 写入消息，再用 `get_dialogue` 取最新 assistant 回复 |

## 说明

- 会话创建、user / assistant 消息入库、云端调用与 Markdown → HTML 转译全部由 chatllm 完成；chat_ui 不再写数据库。
- `get_dialogue` 返回 `{ dialogue, messages }`，消息列表带 `content_html`，前端直接渲染。
- `post_message` 的响应只包含 `uuid` / `created` / `prompt` / `max_tokens`，回复内容需通过 `get_dialogue` 读取。
- `setup.json` 属于安装期 init 请求（写路由），由 dytes 经 cyctron 执行；它不参与页面运行时。
