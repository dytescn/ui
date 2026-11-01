// 修改后的 rout_init
import type { PagesRouterInfo } from "@funxdata/pages/routetype";
import { get_router_info } from "../apis/route.ts";

export const rout_init = async () => {
  // deno-lint-ignore no-explicit-any
  const GlobalPagesRoute = (globalThis as any)["GlobalPagesRouter"] as PagesRouterInfo;
  // 直接得到 Route[]，无需再取 .data
  const routerData = await get_router_info();
  console.log('Router data from DB:', routerData);

  if (!Array.isArray(routerData)) {
    console.error('routerData is not an array');
    return;
  }

  for (let i = 0; i < routerData.length; i++) {
    // deno-lint-ignore no-explicit-any
    const item:any = routerData[i];
    if (!item.child) continue;
    for (let j = 0; j < item.child.length; j++) {
      const child = item.child[j];
      const rout = GlobalPagesRoute.on(child.path, child.title);
      if (child.url && rout) {
        rout.loadjs = child.url;
      }
    }
  }
};