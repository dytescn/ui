import {
  insertDesignFile,
  getDesignFilesByProject,
  getDesignFileById,
  updateDesignFile,
  deleteDesignFile,
} from "../src/apis/designFiles.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testDesignFilesAPI() {
  console.log("===== 开始测试设计文件 CRUD API =====\n");
  const testProjectUid = "design-file-test-project-001";

  console.log("1. 创建设计文件...");
  const newData = {
    uuid: "test-design-file-uuid-001",
    project_uid: testProjectUid,
    organ_uid: "org-test",
    flow_uid: "flow-001",
    type_uid: "type-001",
    name: "首页设计稿",
    description: "首页的设计文件",
    create_by: "tester",
    cover: "http://example.com/cover.jpg",
  };
  const insertResult = await insertDesignFile(newData);
  console.log("  创建结果:", insertResult);
  await sleep(100);

  console.log("\n2. 查询该项目下所有设计文件...");
  const files = await getDesignFilesByProject(testProjectUid);
  console.log(`  共 ${files.length} 条记录，最新的一条:`);
  console.log(files[0]);
  const fileId = files[0]?.id;
  if (!fileId) {
    console.error("  未获取到文件 ID，测试终止");
    return;
  }

  console.log(`\n3. 按 ID (${fileId}) 查询设计文件...`);
  const file = await getDesignFileById(fileId);
  console.log("  查询结果:", file);

  console.log("\n4. 更新设计文件名和描述...");
  const updateResult = await updateDesignFile(fileId, {
    name: "更新后的设计稿",
    description: "更新后的描述",
  });
  console.log("  更新结果:", updateResult);
  await sleep(100);

  console.log("\n5. 再次查询确认更新...");
  const updatedFile = await getDesignFileById(fileId);
  console.log("  更新后的数据:", updatedFile);

  console.log("\n6. 删除设计文件...");
  const deleteResult = await deleteDesignFile(fileId);
  console.log("  删除结果:", deleteResult);
  await sleep(100);

  console.log("\n7. 最终查询，确认文件已删除...");
  const finalCheck = await getDesignFileById(fileId);
  console.log("  最终查询结果:", finalCheck);

  console.log("\n===== 测试完成 =====");
}

testDesignFilesAPI().catch(err => {
  console.error("测试过程中发生错误:", err);
});