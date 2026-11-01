// src/apis/chatllm.ts
// chatllm 能力库统一入口：通过 webdx 的 DxSocket 走 cyctron /soket。
// 对话不再使用 HTTP（/chatllm），也不再直接访问 /database。
import { DxSocket } from "@funxdata/webdx/dxsoket";

const SOCKET_URL = "ws://127.0.0.1:44944/soket";

/** HTTP 模式的 FFI-Symbol -> socket 完整符号 */
const SYMBOLS: Record<string, string> = {
  chat: "post_message",
  dialogue_list: "patch_dialogue",
  dialogue_update: "update_dialogue",
  chat_detail: "get_dialogue",
};

const socket = new DxSocket(SOCKET_URL, {
  maxReconnectAttempts: 10,
  reconnectDelay: 1000,
  reconnectJitter: 0.2,
  connectTimeout: 10000,
});

export class ChatllmError extends Error {
  code?: number;

  constructor(message: string, code?: number) {
    super(message);
    this.name = "ChatllmError";
    this.code = code;
  }
}

/**
 * 通过 socket 调用 chatllm。
 * `symbol` 传 HTTP 模式的短名（如 `chat`）或完整符号（`post_message`）。
 */
export async function callChatllm<T>(
  symbol: string,
  payload: unknown = {},
): Promise<T> {
  const wire = SYMBOLS[symbol] ?? (symbol.startsWith("post_") ? symbol : `post_${symbol}`);
  const timeoutMs = symbol === "chat" || wire === "post_message" ? 120000 : 15000;

  const response = await socket.call<{ code: number; data: T; msg: string }>(
    "chatllm",
    wire,
    payload,
    { timeoutMs },
  );

  if (!response.ok) {
    throw new ChatllmError(
      `chatllm ${symbol} 调用失败 (code=${response.code}): ${response.error ?? "unknown"}`,
      response.code,
    );
  }

  const result = response.result;
  if (!result || (result.code !== 200 && result.code !== 0)) {
    throw new ChatllmError(
      `chatllm ${symbol} 失败 (code=${result?.code}): ${result?.msg ?? "unknown"}`,
      result?.code,
    );
  }

  return result.data;
}
