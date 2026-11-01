import { app_init } from "./rout/app.ts";
import { init_slidebar } from "./rout/slidebar.ts";
import { header_init } from "./rout/header.ts";
import { chat_msg_init } from "./rout/chat_msg.ts";
import { chat_form_init } from "./rout/chat_form.ts";

// 运行 chat.js 时自动加载样式：
// 安装后 chat_ui 包位于 web/chat_ui/，导出文件为 chat.css / marked.css。
const css_base = (() => {
  const src = (document.currentScript as HTMLScriptElement | null)?.src;
  return src ? new URL("./", src).pathname : "/chat_ui/";
})();

for (const name of ["chat.css", "marked.css"]) {
  if (document.querySelector(`link[data-chat-css="${name}"]`)) continue;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = css_base + name;
  link.dataset.chatCss = name;
  document.head.appendChild(link);
}

const uid = new URLSearchParams(globalThis.location.search).get('uid') || '';

app_init(uid);
init_slidebar(uid);
header_init(uid);
chat_msg_init(uid);
chat_form_init(uid);
