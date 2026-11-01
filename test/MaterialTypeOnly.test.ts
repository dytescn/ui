import {
  insertMaterialType,
  getMaterialTypeList,
  getMaterialTypeById,
  updateMaterialType,
  softDeleteMaterialType,
  deleteMaterialType,
  getMaterialTypeByName,
} from "../src/apis/type.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testMaterialTypeOnly() {
  console.log("===== 素材类型模块独立测试 =====\n");

  // 使用随机后缀避免 UUID 冲突
  const testUuid = `type-test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const typeName = "音频类型-测试";

  // 0. 清理可能残留的测试数据（根据 uuid 前缀）
  try {
    // 注意：这里需要调用 deleteMaterialType 但需要先查到 id，简单起见直接执行 SQL 或忽略
    // 更好的做法：使用一个不冲突的 UUID，且测试后一定会删除，残留风险较低
  } catch (e) {
    console.warn("清理旧数据失败，忽略:", e);
  }

  console.log("1. 插入素材类型...");
  const typeData = {
    uuid: testUuid,
    type_name: typeName,
    icon: "audio-icon",
  };
  try {
    const insertRes = await insertMaterialType(typeData);
    console.log("  插入结果:", insertRes);
  } catch (e) {
    console.error("  插入失败:", e);
    return;
  }
  await sleep(100);

  console.log("2. 查询所有类型（最新 5 条）...");
  const all = await getMaterialTypeList('', 'id DESC', 5);
  console.log(`  共 ${all.length} 条`);
  const id = all[0]?.id;
  if (!id) {
    console.error("  无记录，退出");
    return;
  }
  console.log("  最新记录 id:", id);

  console.log(`3. 按 ID 查询 (${id})...`);
  const byId = await getMaterialTypeById(id);
  console.log("  结果:", byId);

  console.log("4. 按类型名称查询...");
  const byName = await getMaterialTypeByName(typeName);
  console.log(`  找到 ${byName.length} 条`);

  console.log("5. 更新类型图标...");
  await updateMaterialType(id, { icon: "new-audio-icon" });
  const updated = await getMaterialTypeById(id);
  console.log("  更新后:", updated);

  console.log("6. 软删除...");
  await softDeleteMaterialType(id);
  const deleted = await getMaterialTypeById(id);
  console.log("  软删除后 (应为 null):", deleted);

  console.log("7. 物理删除...");
  await deleteMaterialType(id);
  const final = await getMaterialTypeById(id);
  console.log("  物理删除后 (应为 null):", final);

  console.log("\n===== 素材类型测试完成 =====");
}

testMaterialTypeOnly().catch(console.error);