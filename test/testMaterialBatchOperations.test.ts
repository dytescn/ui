// test/materialBatchOperations.test.ts
import {
  insertMaterialFile,
  getMaterialFileList,
  deleteMaterialFile,
} from "../src/apis/material.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testBatch() {
  console.log("===== 批量操作测试（连续插入、查询、删除） =====\n");

  const BATCH_SIZE = 10;
  const insertedIds: number[] = [];

  console.log(`1. 批量插入 ${BATCH_SIZE} 条记录...`);
  for (let i = 0; i < BATCH_SIZE; i++) {
    const res = await insertMaterialFile({
      uuid: `batch-${i}-${Date.now()}`,
      puid: "batch-puid",
      ouid: "batch-ouid",
      flow_uid: "batch-flow",
      type_uid: "batch-type",
      name: `BatchFile-${i}`,
      desc: `第 ${i+1} 个文件`,
      cover: "batch.jpg",
      create_by: "batch_tester",
    });
    console.log(`  ${i+1}/${BATCH_SIZE} 插入结果:`, res);
    await sleep(20);
  }

  console.log("\n2. 查询所有批量文件...");
  const all = await getMaterialFileList(`puid = 'batch-puid'`);
  console.log(`  查询到 ${all.length} 条`);
  all.forEach((p:any) => insertedIds.push(p.id));
  console.log(`  记录 IDs:`, insertedIds);

  console.log("\n3. 逐个物理删除...");
  let deletedCount = 0;
  for (const id of insertedIds) {
    await deleteMaterialFile(id);
    deletedCount++;
    console.log(`  已删除 ${deletedCount}/${insertedIds.length} (id=${id})`);
    await sleep(10);
  }

  console.log("\n4. 验证删除结果（再次查询）...");
  const final = await getMaterialFileList(`puid = 'batch-puid'`);
  console.log(`  剩余记录数: ${final.length} (应为 0)`);

  console.log("\n===== 批量测试完成 =====\n");
}

testBatch().catch(console.error);