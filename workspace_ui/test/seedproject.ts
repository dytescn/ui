// test/seedproject.ts
import { insertProject } from "../src/apis/projects.ts";
import { generateUUID } from "../src/utils/uuid.ts";

// 模拟数据配置
const ORGAN_UIDS = ["org-001", "org-002", "org-003"];
const CREATORS = ["张三", "李四", "王五", "赵六"];
const PROJECT_NAMES = [
  "官网改版",
  "移动端 App",
  "后台管理系统",
  "数据可视化大屏",
  "小程序开发",
  "品牌设计",
  "电商平台",
  "营销活动页",
  "内部工具",
  "用户调研",
  "原型设计",
  "API 接口开发",
  "性能优化",
  "安全加固",
  "多语言支持",
  "第三方集成",
  "自动化测试",
  "部署上线",
  "文档编写",
  "培训与推广",
];

// 随机整数
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// 随机数组元素
const randomPick = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// 生成随机项目数据
const generateMockProject = (index: number) => {
  const uuid = generateUUID();
  const name = `${PROJECT_NAMES[index % PROJECT_NAMES.length]} ${index + 1}`;
  const description = `这是第 ${index + 1} 个测试项目，用于验证项目列表、搜索、分页等功能。`;
  const sort = index;
  const schedule = `${randomInt(0, 100)}%`;
  const is_private = randomPick([false, true]);
  const is_archived = randomPick([false, true]);
  const is_recycled = false; // 默认不回收
  const auto_update_schedule = randomPick([false, true]);

  return {
    uuid,
    organ_uid: randomPick(ORGAN_UIDS),
    create_by: randomPick(CREATORS),
    pro_tpl_uid: `tpl-${randomInt(1, 5)}`,
    cover: `https://picsum.photos/seed/${uuid}/300/200`, // 使用随机图片
    name,
    description,
    sort,
    schedule,
    is_private,
    is_archived,
    open_begin_time: null,
    open_task_private: false,
    begin_time: null,
    end_time: null,
    recycle_time: null,
    is_recycled,
    auto_update_schedule,
  };
};

// 批量插入项目
export const seedProjects = async (count: number = 100) => {
  console.log(`开始批量插入 ${count} 个测试项目...`);
  const startTime = Date.now();

  for (let i = 0; i < count; i++) {
    const mockData = generateMockProject(i);
    try {
      const result = await insertProject(mockData);
      console.log(`[${i + 1}/${count}] 插入项目 "${mockData.name}" 成功`);
    } catch (error) {
      console.error(`[${i + 1}/${count}] 插入项目失败:`, error);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`批量插入完成，耗时 ${elapsed} 秒`);
};

// 如果直接运行此文件，则执行批量插入（默认100个）
if (import.meta.main) {
  const count = parseInt(Deno.args[0] || "100", 10);
  await seedProjects(count);
}