// src/route/app.ts
import { app_tpl } from "../view/app.ts";
export const app_init = () => {
  const app_node = document.getElementById("app") as HTMLElement;
  if (app_node) {
    app_node.innerHTML = app_tpl;
  }
};