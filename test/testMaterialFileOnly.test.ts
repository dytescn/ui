// test/materialFileOnly.test.ts
import {
  insertMaterialFile,
  getMaterialFileList,
  getMaterialFileById,
  updateMaterialFile,
  softDeleteMaterialFile,
  deleteMaterialFile,
  getMaterialFilesByPuid,
  getMaterialFilesByOuid,
} from "../src/apis/material.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testMaterialFileOnly() {
  console.log("===== 素材文件模块独立测试 =====");

  // 准备测试数据
  const testPuid = "puid-test-001";
  const testOuid = "ouid-test-001";

  console.log("1. 插入素材文件...");
  const fileData = {
    uuid: "file-only-001",
    puid: testPuid,
    ouid: testOuid,
    flow_uid: "flow-001",
    type_uid: "type-001",
    name: "独立测试文件",
    desc: "仅测试素材文件",
    cover: "cover.png",
    create_by: "tester",
  };
  const insertRes = await insertMaterialFile(fileData);
  console.log("  插入结果:", insertRes);
  await sleep(100);

  console.log("2. 查询所有文件（最新 5 条）...");
  const all = await getMaterialFileList('', 'id DESC', 5);
  console.log(`  共 ${all.length} 条`);
  const id = all[0]?.id;
  if (!id) { console.error("  无记录，退出"); return; }

  console.log(`3. 按 ID 查询 (${id})...`);
  const byId = await getMaterialFileById(id);
  console.log("  结果:", byId);

  console.log("4. 按项目 puid 查询...");
  const byPuid = await getMaterialFilesByPuid(testPuid);
  console.log(`  找到 ${byPuid.length} 条`);

  console.log("5. 按组织 ouid 查询...");
  const byOuid = await getMaterialFilesByOuid(testOuid);
  console.log(`  找到 ${byOuid.length} 条`);

  console.log("6. 更新文件描述...");
  await updateMaterialFile(id, { desc: "已更新描述" });
  const updated = await getMaterialFileById(id);
  console.log("  更新后:", updated);

  console.log("7. 软删除...");
  await softDeleteMaterialFile(id);
  const deleted = await getMaterialFileById(id);
  console.log("  软删除后查询 (应为 null):", deleted);

  console.log("8. 物理删除...");
  await deleteMaterialFile(id);
  const final = await getMaterialFileById(id);
  console.log("  物理删除后 (应为 null):", final);

  console.log("===== 素材文件测试完成 =====\n");
}

testMaterialFileOnly().catch(console.error);