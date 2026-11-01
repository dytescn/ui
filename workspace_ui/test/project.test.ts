import {
  insertProject,
  getProjects,
  getProjectById,
  updateProject,
  softDeleteProject,
  deleteProject,
} from "../src/apis/projects.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testProjectAPI() {
  console.log("===== 开始测试项目 CRUD API =====\n");

  console.log("1. 创建新项目...");
  const newData = {
    uuid: "test-uuid-001",
    organ_uid: "org-test",
    create_by: "tester",
    name: "测试项目",
    description: "这是一个测试项目，用于验证 API",
    sort: 1,
    schedule: "进行中",
    is_private: false,
    is_archived: false,
    is_recycled: false,
    auto_update_schedule: true,
  };
  const insertResult = await insertProject(newData);
  console.log("  创建结果:", insertResult);
  await sleep(100);

  console.log("\n2. 查询所有项目（最新 5 条）...");
  const allProjects = await getProjects('', 'id DESC', 5);
  console.log(`  共 ${allProjects.length} 条记录，最新的一条:`);
  console.log(allProjects[0]);
  const projectId = allProjects[0]?.id;
  if (!projectId) {
    console.error("  未获取到项目 ID，测试终止");
    return;
  }

  console.log(`\n3. 按 ID (${projectId}) 查询项目...`);
  const project = await getProjectById(projectId);
  console.log("  查询结果:", project);

  console.log("\n4. 更新项目名称和描述...");
  const updateResult = await updateProject(projectId, {
    name: "更新后的测试项目",
    description: "这是更新后的描述",
  });
  console.log("  更新结果:", updateResult);
  await sleep(100);

  console.log("\n5. 再次查询确认更新...");
  const updatedProject = await getProjectById(projectId);
  console.log("  更新后的数据:", updatedProject);

  console.log("\n6. 软删除项目...");
  const softDelResult = await softDeleteProject(projectId);
  console.log("  软删除结果:", softDelResult);
  await sleep(100);

  console.log("\n7. 查询已软删除的项目（应该返回 null）...");
  const deletedProject = await getProjectById(projectId);
  console.log("  查询结果:", deletedProject);

  console.log("\n8. 物理删除项目（彻底删除）...");
  const hardDelResult = await deleteProject(projectId);
  console.log("  物理删除结果:", hardDelResult);
  await sleep(100);

  console.log("\n9. 最终查询，确认项目已不在数据库中...");
  const finalCheck = await getProjectById(projectId);
  console.log("  最终查询结果:", finalCheck);

  console.log("\n===== 测试完成 =====");
}

testProjectAPI().catch(err => {
  console.error("测试过程中发生错误:", err);
});