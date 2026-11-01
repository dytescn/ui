// test/materialVersionOnly.test.ts
import {
  insertMaterialVersion,
  getMaterialVersionList,
  getMaterialVersionById,
  updateMaterialVersion,
  softDeleteMaterialVersion,
  deleteMaterialVersion,
  getMaterialVersionsByPageUid,
  getMaterialVersionsByFuid,
} from "../src/apis/version.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testMaterialVersionOnly() {
  console.log("===== 素材版本模块独立测试 =====");

  const testPageUid = "page-test-001";
  const testFuid = "fuid-test-001";

  console.log("1. 插入素材版本...");
  const verData = {
    uuid: "ver-only-001",
    cover: "ver-cover.jpg",
    page_uid: testPageUid,
    child_uid: "child-001",
    soft_ver: "v2.0.0",
    name: "独立版本",
    logs: "初始日志",
    fuid: testFuid,
    create_by: "tester",
  };
  const insertRes = await insertMaterialVersion(verData);
  console.log("  插入结果:", insertRes);
  await sleep(100);

  console.log("2. 查询所有版本（最新 5 条）...");
  const all = await getMaterialVersionList('', 'id DESC', 5);
  console.log(`  共 ${all.length} 条`);
  const id = all[0]?.id;
  if (!id) { console.error("  无记录，退出"); return; }

  console.log(`3. 按 ID 查询 (${id})...`);
  const byId = await getMaterialVersionById(id);
  console.log("  结果:", byId);

  console.log("4. 按页面 uid (page_uid) 查询...");
  const byPage = await getMaterialVersionsByPageUid(testPageUid);
  console.log(`  找到 ${byPage.length} 条`);

  console.log("5. 按文件编号 (fuid) 查询...");
  const byFuid = await getMaterialVersionsByFuid(testFuid);
  console.log(`  找到 ${byFuid.length} 条`);

  console.log("6. 更新版本日志...");
  await updateMaterialVersion(id, { logs: "修复重大缺陷" });
  const updated = await getMaterialVersionById(id);
  console.log("  更新后:", updated);

  console.log("7. 软删除...");
  await softDeleteMaterialVersion(id);
  const deleted = await getMaterialVersionById(id);
  console.log("  软删除后 (应为 null):", deleted);

  console.log("8. 物理删除...");
  await deleteMaterialVersion(id);
  const final = await getMaterialVersionById(id);
  console.log("  物理删除后 (应为 null):", final);

  console.log("===== 素材版本测试完成 =====\n");
}

testMaterialVersionOnly().catch(console.error);