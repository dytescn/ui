// rout/render_msg.ts
import { user_msg_tpl, assistant_msg_tpl } from "../view/chat_msg.ts";
import type { Tpl } from "@funxdata/pages/tplstype";

const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;

export interface Message {
  role: "user" | "assistant";
  content: string;
  html?: string;
  messageId: string;
  duration?: string;
}

/** 用户输入按纯文本转义，避免把输入当 HTML 注入。 */
export const escapeHtml = (text: string): string =>
  text.replace(
    /[&<>"']/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[ch] as string,
  );

const getMessageContainer = (): HTMLElement => {
  const parent = document.getElementById("chat-content");
  if (!parent) throw new Error("#chat-content 不存在");

  if (!parent.style.flex) {
    parent.style.flex = "1";
    parent.style.display = "flex";
    parent.style.flexDirection = "column";
    parent.style.overflowY = "auto";
    parent.style.minHeight = "0";
  }

  let container = parent.querySelector(".aui-message-list") as HTMLElement;
  if (!container) {
    container = document.createElement("div");
    container.className = "aui-message-list flex flex-col gap-y-6";
    container.dataset.slot = "aui_message-group";
    parent.appendChild(container);
  }
  return container;
};

// ---------- 滚动到底部（统一入口） ----------
export const scrollChatToBottom = (smooth = false) => {
  const viewport = document.getElementById("chat-scroll-area");
  if (!viewport) return;

  const scroll = () => {
    viewport.scrollTop = viewport.scrollHeight;
  };

  requestAnimationFrame(() => {
    scroll();
    requestAnimationFrame(() => {
      scroll();
      setTimeout(scroll, 100);
    });
  });
};

// ---------- 渲染单条消息 ----------
export const renderMessage = (msg: Message): string => {
  // assistant 的 HTML 由 chatllm（markparse）转译；用户消息只做纯文本转义。
  const html = msg.html ?? escapeHtml(msg.content);
  const tpl = msg.role === "user" ? user_msg_tpl : assistant_msg_tpl;
  return TplToHtml.renderString(tpl, {
    messageId: msg.messageId,
    content: html,
    duration: msg.duration || "",
  });
};

/** 把 chat_detail 返回的行转成渲染用结构。 */
export const messageFromRow = (row: {
  id: number | string;
  role: string;
  content: string;
  content_html?: string;
}): Message => ({
  role: row.role === "user" ? "user" : "assistant",
  content: row.content,
  html: row.role === "user"
    ? escapeHtml(row.content)
    : (row.content_html || escapeHtml(row.content)),
  messageId: String(row.id),
});

// ---------- 批量渲染初始消息 ----------
export const renderInitMessage = (rows: any[]) => {
  const container = getMessageContainer();
  container.innerHTML = "";

  const messages: Message[] = rows.map((row) => messageFromRow(row));

  messages.forEach((msg) => {
    const html = renderMessage(msg);
    container.insertAdjacentHTML("beforeend", html);
  });

  scrollChatToBottom();
};

// ---------- 追加消息（新消息） ----------
export const appendMessage = (msg: Message) => {
  const container = getMessageContainer();
  const html = renderMessage(msg);
  container.insertAdjacentHTML("beforeend", html);
  scrollChatToBottom();
};

// ---------- 向前插入（加载更早消息） ----------
export const prependMessage = (msg: Message) => {
  const container = getMessageContainer();
  const viewport = document.getElementById("chat-scroll-area");

  if (!viewport) {
    container.insertAdjacentHTML("afterbegin", renderMessage(msg));
    return;
  }

  const prevScrollHeight = viewport.scrollHeight;
  const prevScrollTop = viewport.scrollTop;

  const html = renderMessage(msg);
  const first = container.firstElementChild;
  if (first) {
    first.insertAdjacentHTML("beforebegin", html);
  } else {
    container.insertAdjacentHTML("afterbegin", html);
  }

  requestAnimationFrame(() => {
    const newScrollHeight = viewport.scrollHeight;
    viewport.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
  });
};
