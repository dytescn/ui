// 素材库初始化：路由走 info_lib.router_*；表结构仍由 material_lib 负责。

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
  id: 300,
  title: "素材",
  icon: "ic-sample",
  hide: 0,
  path: "/material",
  parent_id: 0,
  level: 1,
});
await upsertRouter({
  id: 301,
  title: "素材列表",
  icon: "",
  hide: 0,
  path: "/material",
  url: "/material/material.js",
  show: 1,
  parent_id: 300,
  level: 2,
});
console.log("素材路由初始化完成");

// ---------- 初始化素材库表结构（由能力库负责） ----------
const res = await fetch("http://127.0.0.1:44944/material_lib", {
  method: "POST",
  headers: { "Content-Type": "application/libary", "FFI-Symbol": "setup" },
  body: JSON.stringify({}),
});
const setup = await res.json();
if (setup?.code !== 200) {
  console.warn("[material_lib] setup 失败:", setup);
} else {
  console.log("素材库表结构初始化完成", setup.data);
}
