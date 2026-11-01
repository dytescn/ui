// 项目 / 工作区初始化：路由走 info_lib.router_*；表结构仍由 workspace_lib 负责。

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
  id: 100,
  title: "项目",
  icon: "ic-project",
  hide: 0,
  path: "/project",
  parent_id: 0,
  level: 1,
});
await upsertRouter({
  id: 101,
  title: "project",
  icon: "",
  hide: 0,
  path: "/project",
  url: "/workspace/project.js",
  show: 1,
  parent_id: 100,
  level: 2,
});
await upsertRouter({
  id: 200,
  title: "工作区",
  icon: "ic-project",
  hide: 1,
  path: "/workspace",
  parent_id: 0,
  level: 1,
});
await upsertRouter({
  id: 201,
  title: "工作区文件",
  icon: "",
  hide: 1,
  path: "/workspace",
  url: "/workspace/workspace.js",
  show: 1,
  parent_id: 200,
  level: 2,
});
await upsertRouter({
  id: 202,
  title: "工作区设置",
  icon: "",
  hide: 1,
  path: "/workspace/setting",
  url: "/workspace/setting.js",
  show: 1,
  parent_id: 200,
  level: 2,
});
console.log("工作区路由初始化完成");

// ---------- 初始化表结构（由能力库负责） ----------
const res = await fetch("http://127.0.0.1:44944/workspace_lib", {
  method: "POST",
  headers: { "Content-Type": "application/libary", "FFI-Symbol": "setup" },
  body: JSON.stringify({}),
});
const setup = await res.json();
if (setup?.code !== 200) {
  console.warn("[workspace_lib] setup 失败:", setup);
} else {
  console.log("工作区表结构初始化完成", setup.data);
}
