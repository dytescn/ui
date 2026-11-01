import type { PagesRouterInfo } from "@funxdata/pages/routetype";

// deno-lint-ignore no-explicit-any
const GlobalPagesRoute =(globalThis as any)["GlobalPagesRouter"] as PagesRouterInfo;

  // 直接得到 Route[]，无需再取 .data
  const routerData = [{
    "title":"AI",
    "icon":"ic-message",
    "hide":false,
    "path":"/project",
    "child":[
        {
            "path":"/project",
            "url":"/src/project.ts",
            "show":true,
            "title":"instro"
        }
      ]
  },
  {
    "title":"AI",
    "icon":"ic-message",
    "hide":false,
    "path":"/workspace",
    "child":[
        {
            "path":"/workspace",
            "url":"/src/workspace.ts",
            "show":true,
            "title":"instro"
        },
        {
            "path":"/workspace/setting",
            "url":"/src/setting.ts",
            "show":true,
            "title":"instro"
        }
      ]
  }

];
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

GlobalPagesRoute.replace("/project");