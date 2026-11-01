import {
  insertProjectVersionLog,
  getProjectVersionLogsByProject,
  getProjectVersionLogById,
  deleteProjectVersionLog,
} from "../src/apis/projectVersionLogs.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testProjectVersionLogsAPI() {
  console.log("===== 开始测试项目版本日志 API =====\n");
  const testProjectUid = "log-test-project-001";

  console.log("1. 创建新版本日志...");
  const newData = {
    uuid: "test-version-log-uuid-001",
    staff_uid: "staff-001",
    content: "创建版本",
    remark: "首次创建",
    log_type: "create",
    task_uid: "task-001",
    project_uid: testProjectUid,
    features_uid: "feature-uid-test",
  };
  const insertResult = await insertProjectVersionLog(newData);
  console.log("  创建结果:", insertResult);
  await sleep(100);

  console.log("\n2. 查询该项目的所有版本日志...");
  const logs = await getProjectVersionLogsByProject(testProjectUid);
  console.log(`  共 ${logs.length} 条记录，最新的一条:`);
  console.log(logs[0]);
  const logId = logs[0]?.id;
  if (!logId) {
    console.error("  未获取到日志 ID，测试终止");
    return;
  }

  console.log(`\n3. 按 ID (${logId}) 查询日志...`);
  const log = await getProjectVersionLogById(logId);
  console.log("  查询结果:", log);

  console.log("\n4. 删除日志...");
  const deleteResult = await deleteProjectVersionLog(logId);
  console.log("  删除结果:", deleteResult);
  await sleep(100);

  console.log("\n5. 最终查询，确认日志已删除...");
  const finalCheck = await getProjectVersionLogById(logId);
  console.log("  最终查询结果:", finalCheck);

  console.log("\n===== 测试完成 =====");
}

testProjectVersionLogsAPI().catch(err => {
  console.error("测试过程中发生错误:", err);
});