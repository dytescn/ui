import {
  insertProjectFeature,
  getProjectFeaturesByProject,
  getProjectFeatureById,
  updateProjectFeature,
  deleteProjectFeature,
} from "../src/apis/projectFeatures.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testProjectFeaturesAPI() {
  console.log("===== 开始测试项目更新记录 CRUD API =====\n");
  const testProjectUid = "feature-test-project-001";

  console.log("1. 创建新项目更新记录...");
  const newData = {
    uuid: "test-feature-uuid-001",
    project_uid: testProjectUid,
    name: "功能名称",
    description: "功能描述",
  };
  const insertResult = await insertProjectFeature(newData);
  console.log("  创建结果:", insertResult);
  await sleep(100);

  console.log("\n2. 查询该项目的所有更新记录...");
  const features = await getProjectFeaturesByProject(testProjectUid);
  console.log(`  共 ${features.length} 条记录，最新的一条:`);
  console.log(features[0]);
  const featureId = features[0]?.id;
  if (!featureId) {
    console.error("  未获取到记录 ID，测试终止");
    return;
  }

  console.log(`\n3. 按 ID (${featureId}) 查询记录...`);
  const feature = await getProjectFeatureById(featureId);
  console.log("  查询结果:", feature);

  console.log("\n4. 更新记录名称...");
  const updateResult = await updateProjectFeature(featureId, {
    name: "更新后的功能名称",
  });
  console.log("  更新结果:", updateResult);
  await sleep(100);

  console.log("\n5. 再次查询确认更新...");
  const updatedFeature = await getProjectFeatureById(featureId);
  console.log("  更新后的数据:", updatedFeature);

  console.log("\n6. 删除记录...");
  const deleteResult = await deleteProjectFeature(featureId);
  console.log("  删除结果:", deleteResult);
  await sleep(100);

  console.log("\n7. 最终查询，确认记录已删除...");
  const finalCheck = await getProjectFeatureById(featureId);
  console.log("  最终查询结果:", finalCheck);

  console.log("\n===== 测试完成 =====");
}

testProjectFeaturesAPI().catch(err => {
  console.error("测试过程中发生错误:", err);
});