// setup-chat.ts
// 只负责 AI 路由；dialogue 库初始化已迁移到 chatllm/setup.ts。

const INFO_URL = "http://127.0.0.1:44944/info_lib";

type InfoError = Error & { code?: number };

async function infoCall<T = unknown>(
  symbol: string,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(INFO_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": symbol,
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok || payload.code !== 200) {
    const error = new Error(
      payload?.msg ?? `info_lib ${symbol} failed: ${response.status}`,
    ) as InfoError;
    error.code = payload?.code ?? response.status;
    throw error;
  }
  return payload.data as T;
}

async function upsertRouter(route: Record<string, unknown>): Promise<void> {
  try {
    await infoCall("router_get", { id: route.id });
  } catch (error) {
    if ((error as InfoError).code !== 404100) throw error;
    await infoCall("router_post", route);
    return;
  }
  const { id, ...fields } = route;
  await infoCall("router_update", { id, ...fields });
}

await upsertRouter({
  id: 1,
  title: "AI",
  icon: "ic-message",
  hide: 0,
  path: "/chat",
  parent_id: 0,
  level: 1,
});
await upsertRouter({
  id: 2,
  title: "instro",
  icon: "",
  hide: 0,
  path: "/chat",
  url: "/chat_ui/chat.js",
  show: 1,
  parent_id: 1,
  level: 2,
});
console.log("AI 路由初始化完成");
