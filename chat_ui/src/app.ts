import { app_init } from "./rout/app.ts";
import { init_slidebar } from "./rout/slidebar.ts";
import { header_init } from "./rout/header.ts";
import { chat_msg_init } from "./rout/chat_msg.ts";
import { chat_form_init } from "./rout/chat_form.ts";

// 样式由 stylesheet 包统一提供（/stylesheet/funxui.css、/stylesheet/chat.css），
// 这里只启动对话相关页面模块。

const uid = new URLSearchParams(globalThis.location.search).get('uid') || '';

app_init(uid);
init_slidebar(uid);
header_init(uid);
chat_msg_init(uid);
chat_form_init(uid);
