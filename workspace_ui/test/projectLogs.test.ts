import {
  insertProjectLog,
  getProjectLogsByProject,
  getProjectLogById,
  deleteProjectLog,
} from "../src/apis/projectLogs.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testProjectLogsAPI() {
  console.log("===== 开始测试项目日志 API =====\n");
  const testProjectUid = "project-log-test-project-001";

  console.log("1. 创建新项目日志...");
  const newData = {
    uuid: "test-project-log-uuid-001",
    project_uid: testProjectUid,
    task_uid: "task-001",
    staff_uid: "staff-001",
    content: "更新了任务状态",
    remark: "手动操作",
    log_type: "update",
    action_type: "task",
    to_staff_uid: "staff-002",
    is_comment: false,
  };
  const insertResult = await insertProjectLog(newData);
  console.log("  创建结果:", insertResult);
  await sleep(100);

  console.log("\n2. 查询该项目的所有日志...");
  const logs = await getProjectLogsByProject(testProjectUid);
  console.log(`  共 ${logs.length} 条记录，最新的一条:`);
  console.log(logs[0]);
  const logId = logs[0]?.id;
  if (!logId) {
    console.error("  未获取到日志 ID，测试终止");
    return;
  }

  console.log(`\n3. 按 ID (${logId}) 查询日志...`);
  const log = await getProjectLogById(logId);
  console.log("  查询结果:", log);

  console.log("\n4. 删除日志...");
  const deleteResult = await deleteProjectLog(logId);
  console.log("  删除结果:", deleteResult);
  await sleep(100);

  console.log("\n5. 最终查询，确认日志已删除...");
  const finalCheck = await getProjectLogById(logId);
  console.log("  最终查询结果:", finalCheck);

  console.log("\n===== 测试完成 =====");
}

testProjectLogsAPI().catch(err => {
  console.error("测试过程中发生错误:", err);
});