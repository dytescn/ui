### sessions

字段名	类型	约束/默认值	说明
id	TEXT	PRIMARY KEY	会话唯一标识，使用 UUID
title	TEXT	NOT NULL	会话标题，通常取自第一条用户消息前 30 字符
model_name	TEXT	NOT NULL	该会话使用的模型名称，如 deepseek-ai/DeepSeek-R1-0528-Qwen3-8B
system_prompt	TEXT	默认空字符串	系统提示词，作为上下文首条消息发送给云端
model_config	TEXT	默认 {} (JSON)	模型参数配置（温度、top_p、max_tokens 等），JSON 字符串存储
is_pinned	INTEGER	默认 0	是否置顶（0/1）
is_archived	INTEGER	默认 0	是否归档（0/1）
created_at	TEXT	默认 datetime('now')	创建时间，ISO8601 字符串
updated_at	TEXT	默认 datetime('now')	最后更新时间，每次消息变动时更新


### messages

字段名	类型	约束/默认值	说明
id	TEXT	PRIMARY KEY	消息唯一标识，使用 UUID
session_id	TEXT	NOT NULL, 外键 → sessions.id	所属会话 ID
parent_id	TEXT	可空	父消息 ID，用于构建消息树（目前聊天线性，可忽略）
role	TEXT	NOT NULL	消息角色：user / assistant / system / tool
content	TEXT	NOT NULL	消息正文，支持 Markdown（渲染时需消毒）
metadata	TEXT	默认 {} (JSON)	附加信息：如 reasoning_content、duration 等
prompt_tokens	INTEGER	默认 0	本次请求消耗的提示 token 数
completion_tokens	INTEGER	默认 0	本次请求消耗的生成 token 数
total_tokens	INTEGER	默认 0	总 token 数
first_token_time_ms	INTEGER	默认 0	首 token 延迟（毫秒），用于性能统计
total_time_ms	INTEGER	默认 0	总耗时（毫秒）
status	TEXT	默认 'completed'	消息状态：pending / streaming / completed / error
error_message	TEXT	可空	错误信息（当 status 为 error 时记录）
created_at	TEXT	默认 datetime('now')	创建时间

### prompts

id	INTEGER	PRIMARY KEY AUTOINCREMENT	预设 ID
title	TEXT	NOT NULL	预设标题
content	TEXT	NOT NULL	预设内容（提示词模板）
category	TEXT	默认 'General'	分类
is_system	INTEGER	默认 0	是否系统预设（0/1）
created_at	TEXT	默认 datetime('now')	创建时间
updated_at	TEXT	默认 datetime('now')	更新时间

### 数据流的示意

text
用户输入 → chat_form.handleSend()
   ↓
1. 保存用户消息到 messages 表 (role=user)
   ↓
2. 调用 sendMessage(sessionId, userContent)
   ↓
3. sendMessage 读取 sessions.system_prompt + 历史 messages
   ↓
4. 组装云端请求 messages 数组
   ↓
5. chatCompletion 发送 HTTP 请求到 SiliconFlow
   ↓
6. 获取响应（非流式/流式）
   ↓
7. 调用方（chat_form）保存 assistant 消息到 messages 表 (role=assistant)
   ↓
8. 更新 sessions.updated_at
   ↓
9. UI 渲染新消息

