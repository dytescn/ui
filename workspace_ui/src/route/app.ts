import { project_tpl } from "../view/app.ts";
import { create_project } from "./create.ts";

export const app_init = () => {
  const app_node = document.getElementById("app") as HTMLElement;
  if (!app_node) return;
  app_node.innerHTML = project_tpl;

  const createBtn = app_node.querySelector("#add_project") as HTMLElement;
  if (createBtn) {
    // 移除旧监听器
    const oldHandler = (createBtn as any).__clickHandler;
    if (oldHandler) createBtn.removeEventListener("click", oldHandler);
    const handler = () => create_project();
    (createBtn as any).__clickHandler = handler;
    createBtn.addEventListener("click", handler);
  }
};