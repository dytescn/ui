// src/apis/cloud.ts
// 对话发送：post_message 只写消息，回复内容通过 get_dialogue 读取。
import { callChatllm } from "./chatllm.ts";

export interface ChatReply {
  uuid: string;
  created: boolean;
  content: string;
  content_html: string;
}

interface DetailMessage {
  role: string;
  content: string;
  content_html?: string;
}

interface DialogueDetail {
  dialogue: Record<string, unknown>;
  messages: { list: DetailMessage[] };
}

/**
 * 发送一条用户消息。
 * - sessionId 为空：chatllm 自动新建对话，并在返回中给出 uuid
 * - sessionId 非空：在该对话中续聊
 */
export async function sendMessage(
  sessionId: string,
  userContent: string,
  options?: { title?: string },
): Promise<ChatReply> {
  const payload: Record<string, unknown> = { prompt: userContent };
  if (sessionId) payload.uuid = sessionId;
  if (options?.title) payload.title = options.title;

  const sent = await callChatllm<{ uuid: string; created: boolean }>("chat", payload);

  // chatllm 已把云端回复写成 assistant 消息，这里取最新一条。
  const detail = await callChatllm<DialogueDetail>("chat_detail", {
    uuid: sent.uuid,
    limit: 20,
  });
  const list = detail.messages?.list ?? [];
  const reply = [...list].reverse().find((item) => item.role === "assistant");

  return {
    uuid: sent.uuid,
    created: sent.created,
    content: reply?.content ?? "",
    content_html: reply?.content_html ?? "",
  };
}
