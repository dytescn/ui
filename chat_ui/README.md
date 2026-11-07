# chat_ui

Piksel 的 AI 对话界面，`web` 包，包名 `chat_ui`，当前版本 **1.0.15**。

## 作用

- 会话列表、搜索、置顶 / 归档
- 消息分页、Markdown 渲染、附件
- 通过 WebSocket `/soket` 调用 `chatllm`，不直接读写数据库

## 产物

`dytes.json` 的 `exports`：

| 文件 | 说明 |
| --- | --- |
| `chat.js` | 页面脚本（`assets/chat_ui_app_1_0_15.js`） |
| `setup.json` | 安装 / 更新时执行的路由初始化请求 |

依赖：`chatllm 1.0.9`、`info_lib 0.1.0`。样式由 `stylesheet` 包提供（`/stylesheet/chat.css`）。

## 开发

```bash
deno task view     # 本地预览
deno task pack     # 打包
```

## 文档

- [src/apis/info.md](src/apis/info.md) —— 运行时 API 与 `chatllm` 符号映射
- [src/apis/chat.md](src/apis/chat.md) —— 会话 / 消息 / 预设的数据结构与数据流
- [todo/01-socket-followup.md](todo/01-socket-followup.md) —— socket 化后续任务
- [todo/02-assistant-ui-lightweight.md](todo/02-assistant-ui-lightweight.md) —— 界面轻量化与样式治理
