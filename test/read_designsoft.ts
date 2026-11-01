// test/read_designsoft.ts
import { getSetting } from "../src/apis/setting.ts";

/**
 * 读取当前选中的设计软件信息（从 setting 表）
 */
async function readSelectedSoftware() {
  try {
    const name = await getSetting("designsoft_name");
    const version = await getSetting("designsoft_version");

    if (name && version) {
      console.log(` 当前选中的软件: ${name} (版本 ${version})`);
    } else if (name) {
      console.log(` 当前选中的软件: ${name} (版本未记录)`);
    } else {
      console.log("ℹ 当前未选择任何设计软件。");
    }
  } catch (error:any) {
    console.error(" 读取失败:", error.message);
  }
}

// 执行
if (import.meta.main) {
  await readSelectedSoftware();
}