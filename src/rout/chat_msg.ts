// rout/chat_msg.ts
import {
  messageFromRow,
  prependMessage,
  renderInitMessage,
  scrollChatToBottom,
} from "./render_msg.ts";
import { getMessagesBySessionWithLimit } from "../apis/messages.ts";

export const chat_msg_init = async (uid: string) => {
  if (!uid) return null;

  const viewport = document.getElementById("chat-scroll-area") as HTMLElement;
  if (!viewport) {
    console.warn("[chat_msg_init] #chat-scroll-area 不存在（可能为新对话）");
    return null;
  }

  let isLoadingMore = false;
  let oldestId: number | undefined = undefined;
  let hasMoreBefore = false;
  const limit = 10;

  // ---------- 初始加载（chatllm chat_detail） ----------
  try {
    const data = await getMessagesBySessionWithLimit(uid, limit);
    renderInitMessage(data.list ?? []);
    if ((data.list ?? []).length > 0) {
      oldestId = data.first_id ?? undefined;
      hasMoreBefore = data.has_more_before;
      scrollChatToBottom();
    }
  } catch (err) {
    console.error("[chat_msg_init] 初始加载失败:", err);
  }

  // ---------- 滚动加载更早消息（before_id 游标） ----------
  viewport.addEventListener("scroll", async () => {
    if (
      viewport.scrollTop <= 50 &&
      !isLoadingMore &&
      hasMoreBefore &&
      oldestId !== undefined
    ) {
      isLoadingMore = true;
      try {
        const more = await getMessagesBySessionWithLimit(uid, limit, oldestId);
        if ((more.list ?? []).length > 0) {
          // 返回为升序（旧→新），插入到顶部时需要反转
          const rowsDesc = [...more.list].reverse();
          for (const row of rowsDesc) {
            prependMessage(messageFromRow(row));
          }
          oldestId = more.first_id ?? undefined;
          hasMoreBefore = more.has_more_before;
        } else {
          hasMoreBefore = false;
        }
      } catch (err) {
        console.error("[chat_msg_init] 加载更早消息失败:", err);
      } finally {
        isLoadingMore = false;
      }
    }
  });
};
