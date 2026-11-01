// test/cleardesign.ts
// 删除最近两条设计文件记录（用于清理测试数据）

const API_URL = "http://127.0.0.1:44944/database";
const DESIGN_DB = "./design";

async function dbFetch(symbol: string, body: any) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": symbol,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

async function deleteRecentDesignFiles(limit: number = 10) {
  // 1. 查询最近 limit 条记录的 ID
  const querySql = `SELECT id FROM design_files ORDER BY id DESC LIMIT ${limit}`;
  const queryResult = await dbFetch("db_query", { path: DESIGN_DB, sql: querySql });
  const rows = queryResult?.data || [];

  if (rows.length === 0) {
    console.log("✅ 没有记录可删除");
    return;
  }

  const ids = rows.map((row: any) => row.id).join(",");
  const deleteSql = `DELETE FROM design_files WHERE id IN (${ids})`;
  const deleteResult = await dbFetch("db_delete", { path: DESIGN_DB, sql: deleteSql });

  console.log(`✅ 已删除 ${rows.length} 条记录，ID: ${ids}`);
  console.log("删除结果:", deleteResult);
}

// 执行
await deleteRecentDesignFiles(10);