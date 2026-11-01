import {
  insertDesignType,
  getAllDesignTypes,
  getDesignTypeById,
  updateDesignType,
  deleteDesignType,
} from "../src/apis/designTypes.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testDesignTypesAPI() {
  console.log("===== 开始测试设计文件类型 CRUD API =====\n");

  console.log("1. 创建新的设计文件类型...");
  const newData = {
    uuid: "test-design-type-uuid-001",
    type_name: "网页设计",
    icon: "ic-web",
    extra: ".html",
  };
  const insertResult = await insertDesignType(newData);
  console.log("  创建结果:", insertResult);
  await sleep(100);

  console.log("\n2. 查询所有设计文件类型...");
  const types = await getAllDesignTypes();
  console.log(`  共 ${types.length} 条记录，最新的一条:`);
  console.log(types[0]);
  const typeId = types[0]?.id;
  if (!typeId) {
    console.error("  未获取到类型 ID，测试终止");
    return;
  }

  console.log(`\n3. 按 ID (${typeId}) 查询类型...`);
  const type = await getDesignTypeById(typeId);
  console.log("  查询结果:", type);

  console.log("\n4. 更新类型名称...");
  const updateResult = await updateDesignType(typeId, {
    type_name: "更新后的类型名称",
  });
  console.log("  更新结果:", updateResult);
  await sleep(100);

  console.log("\n5. 再次查询确认更新...");
  const updatedType = await getDesignTypeById(typeId);
  console.log("  更新后的数据:", updatedType);

  console.log("\n6. 删除类型...");
  const deleteResult = await deleteDesignType(typeId);
  console.log("  删除结果:", deleteResult);
  await sleep(100);

  console.log("\n7. 最终查询，确认类型已删除...");
  const finalCheck = await getDesignTypeById(typeId);
  console.log("  最终查询结果:", finalCheck);

  console.log("\n===== 测试完成 =====");
}

testDesignTypesAPI().catch(err => {
  console.error("测试过程中发生错误:", err);
});