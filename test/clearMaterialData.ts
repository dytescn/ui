// scripts/clearMaterialData.js
// 使用 deno run --allow-net scripts/clearMaterialData.js 执行

const API_URL = "http://127.0.0.1:44944/database";
const DB_PATH = "./material";

const execSQL = async (sql, symbol = "db_delete") => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": symbol },
    body: JSON.stringify({ path: DB_PATH, sql }),
  });
  return res.json();
};

const tables = ["material_version", "material_file", "material_type"];

console.log("🧹 清空所有素材表数据...");
for (const table of tables) {
  await execSQL(`DELETE FROM ${table}`);
  console.log(`  ✅ 清空 ${table}`);
}

console.log("✅ 数据清理完成");