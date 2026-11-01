// 辅助函数：调用 FFI 接口
async function callFFI(symbol: string, body: Record<string, unknown>) {
  const res = await fetch("http://127.0.0.1:44944/sysinfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": symbol,
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

const dirResult = await callFFI("cur_dir", {});
console.log(dirResult)

// // 辅助函数：格式化输出
// function printResult(title: string, result: any) {
//   console.log(`\n📌 ${title}`);
//   console.log("完整响应:", result);
//   if (result.code === 200) {
//     console.log("✅ 成功:", result.data);
//   } else {
//     console.error("❌ 失败:", result.msg || result.message || result);
//   }
// }

// // ========== 测试 1：获取当前目录 ==========
// console.log("=== 测试 cur_dir ===");
// const dirResult = await callFFI("cur_dir", {});
// printResult("获取当前目录", dirResult);

// // ========== 测试 2：创建目录 ==========
// console.log("\n=== 测试 create_dir ===");
// const createResult = await callFFI("create_dir", { dir_name: "workspace" });
// printResult("创建目录 workspace", createResult);

// // 重复创建（测试错误处理）
// const createAgain = await callFFI("create_dir", { dir_name: "workspace" });
// printResult("再次创建同名目录", createAgain);

// // ========== 测试 3：检查文件/目录是否存在 ==========
// console.log("\n=== 测试 file_exists ===");
// // 检查刚创建的目录
// const exist1 = await callFFI("file_exists", { path: "./workspace" });
// printResult("检查 workspace 是否存在", exist1);

// // 检查不存在的路径
// const exist2 = await callFFI("file_exists", { path: "./not_exist" });
// printResult("检查不存在的路径", exist2);

// // 检查当前目录
// const exist3 = await callFFI("file_exists", { path: "." });
// printResult("检查当前目录 '.'", exist3);

// // ========== 测试 4：获取文件/目录详细信息 ==========
// console.log("\n=== 测试 file_info ===");
// const info1 = await callFFI("file_info", { path: "./workspace" });
// printResult("获取 workspace 详细信息", info1);

// const info2 = await callFFI("file_info", { path: "." });
// printResult("获取当前目录 '.' 详细信息", info2);

// const info3 = await callFFI("file_info", { path: "./not_exist" });
// printResult("获取不存在的路径信息", info3);

// // ========== 额外测试：参数缺失（测试错误处理） ==========
// console.log("\n=== 测试参数错误处理 ===");
// const badCreate = await callFFI("create_dir", {});
// printResult("创建目录缺少 dir_name", badCreate);

// const badExists = await callFFI("file_exists", {});
// printResult("检查文件缺少 path", badExists);