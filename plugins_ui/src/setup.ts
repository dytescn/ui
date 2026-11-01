const API_URL = "http://127.0.0.1:44944/database";

// 插件表由 plugin_lib 的 setup.ts 初始化；这里只维护插件路由。

// ========== 1. 清理可能存在的旧插件路由（幂等） ==========
await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/libary",
        "FFI-Symbol": "db_insert",
    },
    body: JSON.stringify({
        path: "router",
        sql: "DELETE FROM routers WHERE id IN (400, 401) OR parent_id IN (400, 401)",
    }),
});
console.log("旧插件路由清理完成");

// ========== 2. 插入插件父路由（固定 ID 400） ==========
await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/libary",
        "FFI-Symbol": "db_insert",
    },
    body: JSON.stringify({
        path: "router",
        sql: `
            INSERT INTO routers (id, title, icon, hide, path, parent_id, level)
            VALUES (400, '插件', 'ic-store-admin', 0, '/plugins', 0, 1)
        `,
    }),
});
console.log("插件父路由插入成功");

// ========== 3. 插入插件子路由（parent_id = 400） ==========
await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/libary",
        "FFI-Symbol": "db_insert",
    },
    body: JSON.stringify({
        path: "router",
        sql: `
            INSERT INTO routers (id, title, icon, hide, path, url, show, parent_id, level)
            VALUES (401, '插件列表', '', 0, '/plugins', '/plugins/plugins.js', 1, 400, 2)
        `,
    }),
});
console.log("插件子路由插入成功");
