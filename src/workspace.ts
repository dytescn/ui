import { workspace_init } from "./route/workspace.ts";
import { workspace_list } from "./route/workspace_list.ts";

const params = new URLSearchParams(globalThis.location.search);
const puid = params.get("puid") as string;

try {
  await workspace_init(puid);
  await workspace_list(puid);
} catch (error) {
  console.error("工作区初始化失败:", error);
}