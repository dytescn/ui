// src/apis/update_check.ts
// 通过 cyctron 的 SSE 调用 plugin_lib 的 check_updates_sse。

const API_URL = "http://127.0.0.1:44944";

export interface PluginUpdate {
  name: string;
  local_version: string;
  remote_version: string;
  needs_update: boolean;
}

export interface UpdateCheckResult {
  checked_at: number;
  count: number;
  updates: PluginUpdate[];
}

export const checkPluginUpdates = async (
  timeoutMs = 15000,
): Promise<UpdateCheckResult> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const params = new URLSearchParams({
      lib: "plugin_lib",
      symbol: "check_updates_sse",
      args: JSON.stringify({}),
      interval_ms: "200",
      once: "1",
    });
    const response = await fetch(`${API_URL}/sse?${params.toString()}`, {
      headers: { Accept: "text/event-stream" },
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`SSE 请求失败: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const raw of events) {
        const dataLine = raw
          .split("\n")
          .find((line) => line.startsWith("data:"));
        if (!dataLine) continue;
        const payload = JSON.parse(dataLine.slice(5).trim());
        return (payload?.data ?? payload) as UpdateCheckResult;
      }
    }

    throw new Error("SSE 未返回数据");
  } finally {
    clearTimeout(timer);
    controller.abort();
  }
};
