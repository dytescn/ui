import { workspace_init } from "./route/workspace.ts";
import { setting_init } from "./route/setting.ts";

const params = new URLSearchParams(globalThis.location.search);
const puid = params.get("puid") as string;

try {
  await workspace_init(puid,"setting");
  await setting_init(puid);
} catch (error) {
  console.error("工作区初始化失败:", error);
}