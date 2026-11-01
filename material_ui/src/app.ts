// src/app.ts
import { app_init } from "./route/app.ts";
import { material_tags } from "./route/tags.ts";
import { material_list } from "./route/list.ts";

app_init();

try {
  await material_tags();
  await material_list();
} catch (error) {
  console.error("素材库初始化失败:", error);
}

const searchInput = document.getElementById("search_manage") as HTMLInputElement;
if (searchInput) {
  let timer: number;
  searchInput.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const keyword = searchInput.value.trim();
      globalThis.dispatchEvent(new CustomEvent("material-search-change", { detail: keyword }));
    }, 300);
  });
}