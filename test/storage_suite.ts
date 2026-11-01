// test/storage_suite.ts
// 运行：deno run --allow-net test/storage_suite.ts
// 功能：依次测试上传、获取、删除文件

import { uploadFile, deleteFile, getFile } from "../src/apis/storage.ts";

// ====== 配置 ======
// 请修改为你的测试文件路径（确保文件存在）
const TEST_FILE_PATH = "D:\\dayin\\video.mp4";

// ====== 辅助函数 ======
const log = (label: string, data: any) => {
  console.log(`\n🔹 ${label}`);
  console.log(JSON.stringify(data, null, 2));
};

// ====== 主测试流程 ======
async function runSuite() {
  console.log("🚀 开始 storage 功能测试\n");

  let uploadedUuid: string | null = null;

  // 1. 上传
  try {
    console.log(`📤 上传文件: ${TEST_FILE_PATH}`);
    const uploadResult = await uploadFile(TEST_FILE_PATH);
    log("上传结果", uploadResult);

    if (uploadResult.code === 200 && uploadResult.data?.uuid) {
      uploadedUuid = uploadResult.data.uuid;
      console.log(`✅ 上传成功，UUID: ${uploadedUuid}`);
    } else {
      throw new Error("上传返回格式异常");
    }
  } catch (err:any) {
    console.error("❌ 上传失败:", err.message);
    Deno.exit(1);
  }

  // 2. 获取文件信息
  try {
    console.log(`\n🔍 获取文件信息，UUID: ${uploadedUuid}`);
    const getResult = await getFile(uploadedUuid!);
    log("获取结果", getResult);

    if (getResult.code === 200) {
      console.log("✅ 获取成功");
    } else {
      throw new Error("获取返回非 200");
    }
  } catch (err:any) {
    console.error("❌ 获取失败:", err.message);
    Deno.exit(1);
  }

  // 3. 删除文件
  try {
    console.log(`\n🗑️  删除文件，UUID: ${uploadedUuid}`);
    const deleteResult = await deleteFile(uploadedUuid!);
    log("删除结果", deleteResult);

    if (deleteResult.code === 200) {
      console.log("✅ 删除成功");
    } else {
      throw new Error("删除返回非 200");
    }
  } catch (err:any) {
    console.error("❌ 删除失败:", err.message);
    Deno.exit(1);
  }

  console.log("\n🎉 所有测试通过！");
  Deno.exit(0);
}

await runSuite();