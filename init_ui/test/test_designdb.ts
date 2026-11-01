// src/test/test_designdb.ts
import { getSoftwareInfo } from "../src/apis/designsoft.ts"; // 注意路径，根据你的项目结构调整
import {
  querySoftware,
  syncSoftwareFromApi,
} from  "../src/apis/designdb.ts";


const KEYWORDS = ["Illustrator", "Photoshop", "CorelDRAW", "AutoCAD", "SketchUp"];

async function main() {
  console.log("🚀 开始同步软件信息到数据库...\n");
  for (const keyword of KEYWORDS) {
    await syncSoftwareFromApi(keyword, getSoftwareInfo);
  }

  console.log("\n📊 当前数据库中的软件列表:");
  const all = await querySoftware();
  if (all.length) {
    for (const item of all) {
      console.log(`  - ${item.name} v${item.version} [${item.status}] (路径: ${item.install_path || "N/A"})`);
    }
  } else {
    console.log("  无记录");
  }

  // 测试插入和删除...
}

if (import.meta.main) await main();