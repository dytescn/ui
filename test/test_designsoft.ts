import { getSoftwareInfo, getSoftwareStatus, startSoftware } from "../src/apis/designsoft.ts";

// 查询 Illustrator 安装情况
const info = await getSoftwareInfo("Illustrator");
if (info.data.list.length > 0) {
  console.log("已安装:", info.data.list);
} else {
  console.log("未安装");
}

// 查询状态（不指定版本，如果只有一个版本则自动选择）
const status = await getSoftwareStatus("Illustrator");
console.log("状态:", status.data.status);

// 启动（指定版本）
await startSoftware("Illustrator", "29.0.0");