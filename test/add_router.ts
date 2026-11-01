// 插入路由数据
const res = await fetch("http://127.0.0.1:44944/database", {
  method: "POST",
  headers: {
    "Content-Type": "application/libary",
    "FFI-Symbol": "db_insert",
  },
  body: JSON.stringify({
    path: "./router",
    sql: `INSERT INTO routers (id, title, icon, hide, path, child, url, show, parent_id, level) 
          VALUES 
          (1, 'AI', 'ic-message', 0, '/chat', '[{"path":"/chat","url":"/src/about.ts","show":1,"title":"instro"}]', NULL, NULL, 0, 1),
          (2, '项目', 'ic-project', 0, '/project', '[{"path":"/project","url":"/src/tools.ts","show":1,"title":"instro"}]', NULL, NULL, 0, 1),
          (3, '工作台', '', 1, '/work', '[{"path":"/work","url":"/src/tools.ts","show":1,"title":"instro"},{"path":"/work/user","url":"/src/tools.ts","show":1,"title":"用户"},{"path":"/work/setting","url":"/src/tools.ts","show":0,"title":"design soft/设计软件"},{"path":"/work/ostfil","url":"/src/tools.ts","show":0,"title":"设置"}]', NULL, NULL, 0, 1),
          (4, '文件', 'ic-app', 0, '/ostfil', '[{"path":"/ostfil","url":"/src/xhtml.ts","show":1,"title":"instro"}]', NULL, NULL, 0, 1),
          (5, '素材', 'ic-sample', 0, '/mater', '[{"path":"/mater","url":"/src/xhtml.ts","show":1,"title":"instro"}]', NULL, NULL, 0, 1),
          (6, '流程', 'ic-grid-dots', 0, '/flow', '[{"path":"/flow","url":"/src/comm.ts","show":1,"title":"instro"}]', NULL, NULL, 0, 1)`,
  }),
});

console.log(await res.json());