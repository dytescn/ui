import type { PagesRouterInfo } from "@funxdata/pages/routetype";

// deno-lint-ignore no-explicit-any
const GlobalPagesRoute =(globalThis as any)["GlobalPagesRouter"] as PagesRouterInfo;

  // 直接得到 Route[]，无需再取 .data
  const routerData = [{
    "title":"AI",
    "icon":"ic-message",
    "hide":false,
    "path":"/chat",
    "child":[
        {
            "path":"/chat",
            "url":"/src/app.ts",
            "show":true,
            "title":"instro"
        }
  ]}]
  ;
  console.log('Router data from DB:', routerData);

  if (!Array.isArray(routerData)) {
    console.error('routerData is not an array');
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