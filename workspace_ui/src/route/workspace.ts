// src/route/workspace.ts
import { workspace_tpl } from "../view/app.ts";
import { getProjectByUuid } from "../apis/projects.ts";
import { workspace_list } from "./workspace_list.ts";
import type { Tpl } from "@funxdata/pages/tplstype";

const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;

export const workspace_init = async (puid: string, active: string = "list") => {
  const workspace_node = document.getElementById("app") as HTMLElement;
  if (!workspace_node) return;

  // 确保 active 合法
  if (active !== "list" && active !== "setting") {
    active = "list";
  }

  workspace_node.innerHTML = `<div class="loading">加载中...</div>`;

  try {
    const project = await getProjectByUuid(puid);
    if (!project) {
      workspace_node.innerHTML = `<div class="error">项目不存在或已删除</div>`;
      return;
    }

    // 渲染模板，传递 active 和 project
    const html = await TplToHtml.renderString(workspace_tpl, {
      active,
      project,
    });
    workspace_node.innerHTML = html;
  } catch (error) {
    console.error("获取项目失败:", error);
    workspace_node.innerHTML = `<div class="error">加载项目失败，请稍后重试</div>`;
  }
  await workspace_list(puid);
  
};