// scripts/seedMaterialData.ts
// 运行：deno run --allow-net scripts/seedMaterialData.ts

const API_URL = "http://127.0.0.1:44944/database";
const DB_PATH = "./material";

const execSQL = async (sql: string, symbol = "db_insert") => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": symbol,
    },
    body: JSON.stringify({ path: DB_PATH, sql }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const randomTime = () => {
  const now = new Date();
  now.setDate(now.getDate() - rand(0, 30));
  now.setHours(now.getHours() - rand(0, 23), now.getMinutes() - rand(0, 59), 0, 0);
  return now.toISOString().replace("T", " ").slice(0, 19);
};

console.log("清空旧数据...");
await execSQL("DELETE FROM material_file", "db_update");
await execSQL("DELETE FROM material_type", "db_update");
await execSQL("DELETE FROM material_version", "db_update");
console.log("旧数据清理完成");

// 插入类型
const types = [
  { uuid: "type-img-001", type_name: "图片", icon: "icon-image" },
  { uuid: "type-video-001", type_name: "视频", icon: "icon-video" },
  { uuid: "type-audio-001", type_name: "音频", icon: "icon-audio" },
  { uuid: "type-doc-001", type_name: "文档", icon: "icon-doc" },
  { uuid: "type-font-001", type_name: "字体", icon: "icon-font" },
];

console.log("\n插入素材类型...");
for (const t of types) {
  const nowTime = randomTime();
  const sql = `INSERT INTO material_type (uuid, type_name, icon, created_at, updated_at) VALUES ('${t.uuid}', '${t.type_name}', '${t.icon}', '${nowTime}', '${nowTime}')`;
  await execSQL(sql);
}
console.log(`已插入 ${types.length} 个类型`);

// 插入素材文件
const projectUids = [
  "331f67d5-0a5c-4c9e-84ac-2cd793263393",
  "proj-alpha", "proj-beta", "proj-gamma", "proj-delta",
  "proj-epsilon", "proj-zeta", "proj-eta", "proj-theta",
];
const organUids = ["org-001", "org-002", "org-003", "org-004"];
const creators = ["alice", "bob", "charlie", "diana", "eve"];
const names = [
  "风景图", "人物照", "产品渲染图", "UI 草图", "图标合集",
  "宣传视频", "教程视频", "动画演示", "背景音乐", "音效片段",
  "配音文件", "文档模板", "字体文件", "海报设计", "插画素材",
  "Logo 设计", "Banner 图", "海报模板", "PPT 模板", "Word 模板",
  "Excel 表格", "PDF 报告", "压缩包", "3D 模型", "材质贴图",
];

console.log("\n插入素材文件...");
const totalFiles = 300;
for (let i = 0; i < totalFiles; i++) {
  const uuid = `file-${String(i + 1).padStart(4, "0")}`;
  const typeUid = pick(types).uuid;
  const name = `${pick(names)} ${i + 1}`;
  const description = `这是第 ${i + 1} 个测试素材，类型为 ${typeUid}`;
  const cover = `https://picsum.photos/seed/${uuid}/300/200`;
  const projectUid = pick(projectUids);
  const organUid = pick(organUids);
  const createBy = pick(creators);
  const flowUid = `flow-${rand(1, 10)}`;
  const createdAt = randomTime();
  const updatedAt = randomTime();

  const sql = `
    INSERT INTO material_file (
      uuid, project_uid, organ_uid, flow_uid, type_uid, name, description, cover,
      create_by, created_at, updated_at
    ) VALUES (
      '${uuid}', '${projectUid}', '${organUid}', '${flowUid}', '${typeUid}',
      '${name}', '${description}', '${cover}', '${createBy}', '${createdAt}', '${updatedAt}'
    )
  `;
  await execSQL(sql);
  if ((i + 1) % 50 === 0) console.log(`  已插入 ${i + 1}/${totalFiles}`);
}
console.log(`素材文件插入完成，共 ${totalFiles} 个`);

// 插入素材版本
console.log("\n插入素材版本...");
let versionCount = 0;
for (let i = 0; i < totalFiles; i++) {
  const fileUuid = `file-${String(i + 1).padStart(4, "0")}`;
  const numVersions = rand(1, 3);
  for (let j = 0; j < numVersions; j++) {
    const versionUuid = `ver-${fileUuid}-${j + 1}`;
    const softVer = `${j + 1}.${rand(0, 9)}.${rand(0, 9)}`;
    const name = `v${j + 1}.0`;
    const logs = `版本 ${j + 1} 更新日志`;
    const cover = `https://picsum.photos/seed/${versionUuid}/300/200`;
    const fuid = `fuid-${fileUuid}-${j + 1}`;
    const createBy = pick(creators);
    const childUid = `child-${fileUuid}-${rand(1, 5)}`;
    const createdAt = randomTime();
    const updatedAt = randomTime();

    const sql = `
      INSERT INTO material_version (
        uuid, cover, design_uid, child_uid, soft_ver, name, logs, fuid,
        create_by, created_at, updated_at
      ) VALUES (
        '${versionUuid}', '${cover}', '${fileUuid}', '${childUid}', '${softVer}',
        '${name}', '${logs}', '${fuid}', '${createBy}', '${createdAt}', '${updatedAt}'
      )
    `;
    await execSQL(sql);
    versionCount++;
  }
  if ((i + 1) % 50 === 0) console.log(`  已处理 ${i + 1}/${totalFiles} 个文件的版本`);
}
console.log(`素材版本插入完成，共 ${versionCount} 个`);

console.log("\n素材库示例数据填充完成！");