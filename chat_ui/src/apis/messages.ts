// src/apis/messages.ts
// 消息读取，通过 chatllm 的 get_dialogue 接口（对话 + 消息）完成。
import { callChatllm } from "./chatllm.ts";

export interface ChatMessage {
  id: number;
  role: string;
  content: string;
  content_html?: string;
  created_at: number;
}

export interface ChatDetailResult {
  list: ChatMessage[];
  limit: number;
  first_id: number | null;
  last_id: number | null;
  has_more_before: boolean;
  has_more_after: boolean;
}

/**
 * 分页获取会话消息。
 * - 不传 beforeId：返回最新 limit 条（升序）
 * - 传 beforeId：返回 id < beforeId 的更早 limit 条（升序）
 */
export const getMessagesBySessionWithLimit = async (
  sessionId: string,
  limit: number = 10,
  beforeId?: number,
): Promise<ChatDetailResult> => {
  const payload: Record<string, unknown> = { uuid: sessionId, limit };
  if (beforeId !== undefined) payload.before_id = beforeId;
  const data = await callChatllm<{ dialogue: unknown; messages: ChatDetailResult }>(
    "chat_detail",
    payload,
  );
  return data.messages;
};
