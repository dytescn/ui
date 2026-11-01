import type { PagesRouterInfo } from "@funxdata/pages/routetype";
import { aside_init } from "./rout/aside.ts";
import { rout_init } from "./rout/rout.ts";
import { init_design_soft } from "./rout/design_choose.ts";
import { load_default_assets } from "./defaults.ts";

try {
  await load_default_assets();
} catch (error) {
  console.error(error);
  const app = document.getElementById("app");
  if (app) {
    app.textContent = "初始化失败：无法加载 pages 资源";
  }
  throw error;
}

// deno-lint-ignore no-explicit-any
const GlobalPagesRoute = (globalThis as any)["GlobalPagesRouter"] as PagesRouterInfo;

await rout_init();
await aside_init();
await init_design_soft();

// 获取当前路径（不包含查询参数）
const currentPath = globalThis.location.pathname;
const search = globalThis.location.search;

if (currentPath === "/" || currentPath === "") {
  // 根路径默认跳转到聊天页
  GlobalPagesRoute.replace("/chat" + search);
} else {
  // 非根路径，直接触发当前路径的路由渲染（确保刷新/直接访问不会白屏）
  GlobalPagesRoute.replace(currentPath + search);
}