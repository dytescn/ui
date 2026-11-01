// test/stress_storage.ts
// 运行：deno run --allow-net test/stress_storage.ts [并发数] [总请求数]
// 示例：deno run --allow-net test/stress_storage.ts 20 200

import { uploadFile } from "../src/apis/storage.ts";

// ====== 配置 ======
const TEST_FILE_PATH = "D:\\dayin\\video.mp4"; // 请确保文件存在

const concurrency = parseInt(Deno.args[0]) || 10;
const totalRequests = parseInt(Deno.args[1]) || 100;

let completed = 0;
let successCount = 0;
let failureCount = 0;
const errors: string[] = [];

const startTime = performance.now();

// 单个请求任务
async function makeRequest(index: number): Promise<void> {
  try {
    await uploadFile(TEST_FILE_PATH);
    successCount++;
  // deno-lint-ignore no-explicit-any
  } catch (err:any) {
    failureCount++;
    errors.push(`请求 #${index} 失败: ${err.message}`);
  } finally {
    completed++;
    if (completed % Math.ceil(totalRequests / 10) === 0) {
      console.log(`⏳ 已完成 ${completed}/${totalRequests} (${(completed / totalRequests * 100).toFixed(1)}%)`);
    }
  }
}

// 分批并发执行
async function runStressTest() {
  console.log(`🚀 开始压力测试（上传）：并发 ${concurrency}，总请求 ${totalRequests}\n`);

  for (let i = 0; i < totalRequests; i += concurrency) {
    const batchSize = Math.min(concurrency, totalRequests - i);
    const batchPromises: Promise<void>[] = [];
    for (let j = 0; j < batchSize; j++) {
      const index = i + j + 1;
      batchPromises.push(makeRequest(index));
    }
    await Promise.all(batchPromises);
  }

  const endTime = performance.now();
  const duration = (endTime - startTime) / 1000;

  console.log("\n📊 测试结果：");
  console.log(`  总请求数    : ${totalRequests}`);
  console.log(`  成功数      : ${successCount}`);
  console.log(`  失败数      : ${failureCount}`);
  console.log(`  总耗时      : ${duration.toFixed(2)} 秒`);
  console.log(`  吞吐量      : ${(totalRequests / duration).toFixed(2)} req/s`);

  if (errors.length > 0) {
    console.log(`\n⚠️  错误详情（前 5 条）：`);
    errors.slice(0, 5).forEach((e) => console.log(`  - ${e}`));
    if (errors.length > 5) {
      console.log(`  ... 还有 ${errors.length - 5} 条错误`);
    }
  }

  const failureRate = failureCount / totalRequests;
  if (failureRate > 0.1) {
    console.log(`\n❌ 失败率过高 (${(failureRate * 100).toFixed(1)}%)，退出码 1`);
    Deno.exit(1);
  } else {
    console.log("\n✅ 测试完成");
    Deno.exit(0);
  }
}

await runStressTest();