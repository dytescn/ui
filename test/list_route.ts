// test_routers.ts
const DB_URL = "http://127.0.0.1:44944/database";

/**
 * 查询数据库（使用 db_query）
 */
async function dbQuery(sql: string, path: string = "./router") {
  const resp = await fetch(DB_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": "db_query",
    },
    body: JSON.stringify({ path, sql }),
  });
  if (!resp.ok) throw new Error(`HTTP error: ${resp.status}`);
  const result = await resp.json();
  // 返回 data 数组（如果存在）
  return result.data || result;
}

/**
 * 获取并打印路由表
 */
async function getRouters() {
  try {
    const rows = await dbQuery("SELECT * FROM routers ORDER BY id;");
    console.log("✅ 路由表数据（共", rows.length, "条）:");
    console.table(rows);
    return rows;
  // deno-lint-ignore no-explicit-any
  } catch (err:any) {
    console.error(" 获取路由表失败:", err.message);
  }
}

// 执行
if (import.meta.main) {
  await getRouters();
}