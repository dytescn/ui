// scripts/createMaterialTables.ts
// 运行：deno run --allow-net scripts/createMaterialTables.ts

const API_URL = "http://127.0.0.1:44944/database";
const DB_PATH = "./material";

const exec = async (sql: string) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": "db_update", // 使用 db_update 执行 DDL
    },
    body: JSON.stringify({ path: DB_PATH, sql }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// 素材文件表
await exec(`
  CREATE TABLE IF NOT EXISTS material_file (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    project_uid TEXT,
    organ_uid TEXT,
    flow_uid TEXT,
    type_uid TEXT,
    name TEXT,
    description TEXT,
    cover TEXT,
    create_by TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime')),
    deleted_at TEXT
  )
`);

// 素材类型表
await exec(`
  CREATE TABLE IF NOT EXISTS material_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    type_name TEXT,
    icon TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime')),
    deleted_at TEXT
  )
`);

// 素材版本表
await exec(`
  CREATE TABLE IF NOT EXISTS material_version (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    cover TEXT,
    design_uid TEXT,
    child_uid TEXT,
    soft_ver TEXT,
    name TEXT,
    logs TEXT,
    fuid TEXT,
    create_by TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime')),
    deleted_at TEXT
  )
`);

console.log("素材库三张表创建成功");