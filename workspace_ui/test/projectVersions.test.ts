import {
  insertProjectVersion,
  getProjectVersionsByProject,
  getProjectVersionById,
  updateProjectVersion,
  deleteProjectVersion,
} from "../src/apis/projectVersions.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testProjectVersionsAPI() {
  console.log("===== 开始测试项目版本 CRUD API =====\n");
  const testProjectUid = "version-test-project-001";

  console.log("1. 创建新项目版本...");
  const newData = {
    uuid: "test-version-uuid-001",
    project_uid: testProjectUid,
    name: "v1.0.0",
    description: "初始版本",
    start_time: "2024-01-01 10:00:00",
    publish_time: null,
    plan_publish_time: "2024-03-01 00:00:00",
    schedule: 30,
    status: 0,
    features_uid: "feature-uid-test",
  };
  const insertResult = await insertProjectVersion(newData);
  console.log("  创建结果:", insertResult);
  await sleep(100);

  console.log("\n2. 查询该项目的所有版本...");
  const versions = await getProjectVersionsByProject(testProjectUid);
  console.log(`  共 ${versions.length} 条记录，最新的一条:`);
  console.log(versions[0]);
  const versionId = versions[0]?.id;
  if (!versionId) {
    console.error("  未获取到版本 ID，测试终止");
    return;
  }

  console.log(`\n3. 按 ID (${versionId}) 查询版本...`);
  const version = await getProjectVersionById(versionId);
  console.log("  查询结果:", version);

  console.log("\n4. 更新版本名称和进度...");
  const updateResult = await updateProjectVersion(versionId, {
    name: "v1.1.0",
    schedule: 50,
  });
  console.log("  更新结果:", updateResult);
  await sleep(100);

  console.log("\n5. 再次查询确认更新...");
  const updatedVersion = await getProjectVersionById(versionId);
  console.log("  更新后的数据:", updatedVersion);

  console.log("\n6. 删除版本...");
  const deleteResult = await deleteProjectVersion(versionId);
  console.log("  删除结果:", deleteResult);
  await sleep(100);

  console.log("\n7. 最终查询，确认版本已删除...");
  const finalCheck = await getProjectVersionById(versionId);
  console.log("  最终查询结果:", finalCheck);

  console.log("\n===== 测试完成 =====");
}

testProjectVersionsAPI().catch(err => {
  console.error("测试过程中发生错误:", err);
});