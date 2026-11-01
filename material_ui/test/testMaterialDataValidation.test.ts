// test/materialDataValidation.test.ts
import {
  insertMaterialFile,
  getMaterialFileList,
  deleteMaterialFile,
} from "../src/apis/material.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testValidation() {
  console.log("===== 数据验证测试（特殊字符、空值、极长字符串） =====\n");

  const testCases = [
    { name: "包含单引号 ' 的名称", desc: "测试单引号" },
    { name: "包含双引号 \" 的名称", desc: "测试双引号" },
    { name: "包含中文 测试名称", desc: "测试中文" },
    { name: "名称中含有 emoji 😊", desc: "测试 emoji" },
    { name: "名称中含有空格 和 特殊符号 @#$%", desc: "测试特殊符号" },
    { name: "极长名称 " + "A".repeat(500), desc: "长字符串（500字符）" },
    { name: "", desc: "空名称（保留空字符串）" }, // 可能允许空，但看业务
  ];

  const insertedIds: number[] = [];

  console.log("1. 插入各种边界数据...");
  for (const [idx, tc] of testCases.entries()) {
    const res = await insertMaterialFile({
      uuid: `valid-${idx}-${Date.now()}`,
      puid: "valid-puid",
      ouid: "valid-ouid",
      flow_uid: "valid-flow",
      type_uid: "valid-type",
      name: tc.name,
      desc: tc.desc,
      cover: "valid.jpg",
      create_by: "valid_tester",
    });
    console.log(`  ${idx+1}/${testCases.length} 插入结果:`, res);
    await sleep(30);
  }

  console.log("\n2. 查询验证数据...");
  const all = await getMaterialFileList(`puid = 'valid-puid'`);
  console.log(`  查询到 ${all.length} 条记录 (应等于 ${testCases.length})`);
  all.forEach((p:any) => insertedIds.push(p.id));

  // 打印第一个记录的名称以验证特殊字符
  if (all.length > 0) {
    console.log("  示例记录名称:", all[0].name);
    console.log("  示例记录描述:", all[0].desc);
  }

  console.log("\n3. 清理数据...");
  for (const id of insertedIds) {
    await deleteMaterialFile(id);
    console.log(`  删除 id=${id}`);
    await sleep(10);
  }

  console.log("\n===== 验证测试完成 =====\n");
}

testValidation().catch(console.error);