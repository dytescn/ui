import {
  insertDesignVersion,
  getDesignVersionsByDesign,
  getDesignVersionById,
  updateDesignVersion,
  deleteDesignVersion,
} from "../src/apis/designVersions.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testDesignVersionsAPI() {
  console.log("===== 开始测试设计文件版本 CRUD API =====\n");
  const testDesignUid = "design-version-test-design-001";

  console.log("1. 创建设计文件版本...");
  const newData = {
    uuid: "test-design-version-uuid-001",
    cover: "http://example.com/cover-v1.jpg",
    design_uid: testDesignUid,
    child_uid: "child-001",
    soft_ver: "Figma 2024",
    name: "v1.0.0",
    logs: "初始版本",
    fuid: "file-uid-001",
    create_by: "tester",
  };
  const insertResult = await insertDesignVersion(newData);
  console.log("  创建结果:", insertResult);
  await sleep(100);

  console.log("\n2. 查询该设计文件的所有版本...");
  const versions = await getDesignVersionsByDesign(testDesignUid);
  console.log(`  共 ${versions.length} 条记录，最新的一条:`);
  console.log(versions[0]);
  const versionId = versions[0]?.id;
  if (!versionId) {
    console.error("  未获取到版本 ID，测试终止");
    return;
  }

  console.log(`\n3. 按 ID (${versionId}) 查询版本...`);
  const version = await getDesignVersionById(versionId);
  console.log("  查询结果:", version);

  console.log("\n4. 更新版本名称...");
  const updateResult = await updateDesignVersion(versionId, {
    name: "v1.1.0",
  });
  console.log("  更新结果:", updateResult);
  await sleep(100);

  console.log("\n5. 再次查询确认更新...");
  const updatedVersion = await getDesignVersionById(versionId);
  console.log("  更新后的数据:", updatedVersion);

  console.log("\n6. 删除版本...");
  const deleteResult = await deleteDesignVersion(versionId);
  console.log("  删除结果:", deleteResult);
  await sleep(100);

  console.log("\n7. 最终查询，确认版本已删除...");
  const finalCheck = await getDesignVersionById(versionId);
  console.log("  最终查询结果:", finalCheck);

  console.log("\n===== 测试完成 =====");
}

testDesignVersionsAPI().catch(err => {
  console.error("测试过程中发生错误:", err);
});