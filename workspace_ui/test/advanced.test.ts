// test/advanced.test.ts
// 进阶测试：批量操作、分页、条件查询、错误处理

import {
  insertProject,
  getProjects,
  getProjectById,
  updateProject,
  softDeleteProject,
  deleteProject,
  getProjectsByOrgan,
  getProjectsByCreator,
} from "../src/apis/projects.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 生成随机字符串
const randomStr = () => Math.random().toString(36).slice(2, 8);

// 测试数据准备：插入 10 个项目（分属不同组织）
async function prepareTestData(count: number = 10) {
  console.log(`\n--- 插入 ${count} 条测试数据 ---`);
  const inserted: any[] = [];
  for (let i = 1; i <= count; i++) {
    const data = {
      uuid: `test-${randomStr()}-${i}`,
      organ_uid: i % 2 === 0 ? "org-even" : "org-odd",
      create_by: i <= 5 ? "user-a" : "user-b",
      name: `测试项目 ${i}`,
      description: `描述 ${i}`,
      sort: i,
    };
    await insertProject(data);
    inserted.push(data);
    if (i % 5 === 0) await sleep(50);
  }
  console.log(`  插入 ${count} 条成功`);
  return inserted;
}

// 清理测试数据（删除所有 uuid 以 test- 开头的记录）
async function cleanTestData() {
  console.log("\n--- 清理测试数据（删除所有以 test- 开头的项目）---");
  const all = await getProjects(`uuid LIKE 'test-%'`, 'id');
  if (all.length === 0) {
    console.log("  没有测试数据需要清理");
    return;
  }
  for (const item of all) {
    await deleteProject(item.id);
  }
  console.log(`  清理了 ${all.length} 条记录`);
}

// 测试场景
async function advancedTest() {
  console.log("========== 进阶测试开始 ==========\n");

  // 1. 准备数据
  await prepareTestData(10);
  await sleep(200);

  // 2. 测试分页（limit 5）
  console.log("\n--- 分页测试 (limit=5) ---");
  const page1 = await getProjects('', 'id ASC', 5);
  console.log(`  第1页（前5条），共 ${page1.length} 条`);
  // 获取第二页：跳过前5条，使用 id 范围，但简单起见，我们只测试 limit，offset 暂不测
  // 或者我们可以用 where 条件手动偏移，但为了简洁，跳过 offset

  // 3. 按组织查询
  console.log("\n--- 按组织查询 (organ_uid='org-even') ---");
  const evenProjects = await getProjectsByOrgan('org-even');
  console.log(`  组织 'org-even' 有 ${evenProjects.length} 个项目`);

  // 4. 按创建人查询
  console.log("\n--- 按创建人查询 (create_by='user-a') ---");
  const userAProjects = await getProjectsByCreator('user-a');
  console.log(`  用户 'user-a' 有 ${userAProjects.length} 个项目`);

  // 5. 名称模糊查询
  console.log("\n--- 名称模糊查询 (name like '%项目 1%') ---");
  const fuzzy = await getProjects(`name LIKE '%项目 1%'`);
  console.log(`  匹配结果: ${fuzzy.length} 条`);

  // 6. 批量更新：将前 3 个项目的描述改为 "已更新"
  console.log("\n--- 批量更新前 3 个项目 ---");
  const firstThree = await getProjects('', 'id ASC', 3);
  for (const p of firstThree) {
    await updateProject(p.id, { description: "已更新描述" });
    console.log(`  更新 ID ${p.id} 完成`);
    await sleep(20);
  }
  const updatedCheck = await getProjects(`description = '已更新描述'`);
  console.log(`  更新后，描述为 '已更新描述' 的项目有 ${updatedCheck.length} 个`);

  // 7. 软删除 2 个项目
  console.log("\n--- 软删除前 2 个项目 ---");
  const toSoftDelete = await getProjects('', 'id ASC', 2);
  for (const p of toSoftDelete) {
    await softDeleteProject(p.id);
    console.log(`  软删除 ID ${p.id}`);
    await sleep(20);
  }
  const afterSoftDelete = await getProjects();
  console.log(`  软删除后，可见项目总数: ${afterSoftDelete.length}`);

  // 8. 查询已删除的项目（通过查询 deleted_at 不为 NULL）--- 无法直接用 getProjects，因为 getProjects 过滤 deleted_at IS NULL
  // 所以这个测试我们也跳过，因为无法直接获取已删除的项目（除非扩展 API）
  // 提示：可以调用 dbQuery 但未导出，所以省略

  // 9. 错误处理：更新不存在的 ID
  console.log("\n--- 错误处理测试：更新不存在的 ID (999) ---");
  try {
    await updateProject(999, { name: "不存在的ID" });
    console.log("  警告：更新不存在的 ID 没有抛出错误（可能 API 未检查）");
  } catch (e: any) {
    console.log(`  捕获到错误: ${e.message}`);
  }

  // 10. 查询单个不存在的 ID
  console.log("\n--- 查询不存在的 ID (999) ---");
  const notFound = await getProjectById(999);
  console.log(`  结果: ${notFound}`);

  // 清理数据
  await cleanTestData();

  console.log("\n========== 进阶测试完成 ==========");
}

// 执行
advancedTest().catch(async (err) => {
  console.error("测试过程中发生错误:", err);
  // 出错时也尝试清理
  try { await cleanTestData(); } catch (_) {}
});