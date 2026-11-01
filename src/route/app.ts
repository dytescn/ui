import { app_tpl } from "../view/app.ts";
export const app_init = () => {
  const app_node = document.getElementById("app") as HTMLElement;
  if (!app_node) {
    return;
  }
  app_node.innerHTML = app_tpl;
};
