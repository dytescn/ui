// src/route/tags.ts
import { tags_tpl } from "../view/tags.ts";
import { getMaterialTypeList } from "../apis/type.ts";
import type { Tpl } from "@funxdata/pages/tplstype";

const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;

export const material_tags = async () => {
  const container = document.getElementById("tags-list");
  if (!container) return;

  try {
    const typeslist = await getMaterialTypeList();
    console.log(typeslist)

    if (!Array.isArray(typeslist) || typeslist.length === 0) {
      container.innerHTML = await TplToHtml.renderString(tags_tpl, { types: [] });
      const dropdown = container.querySelector(".vg-dropdowns-content") as HTMLElement;
      if (dropdown) {
        dropdown.innerHTML = `<li class="vg-dropdowns-li" data-type-id="">全部类型</li>`;
        dropdown.querySelectorAll(".vg-dropdowns-li").forEach((li) => {
          li.addEventListener("click", () => {
            const typeId = li.getAttribute("data-type-id") || null;
            const selectName = container.querySelector('[fxtag="select_name"]');
            if (selectName) selectName.textContent = typeId ? li.textContent : "全部类型";
            globalThis.dispatchEvent(new CustomEvent("material-type-change", { detail: typeId }));
            dropdown.classList.add("hide");
          });
        });
      }
      const titleBtn = container.querySelector(".vg-dropdowns-title button") as HTMLButtonElement;
      titleBtn?.addEventListener("click", () => {
        dropdown?.classList.toggle("hide");
      });
      return;
    }

    container.innerHTML = await TplToHtml.renderString(tags_tpl, { typeslist });

    const dropdown = container.querySelector(".vg-dropdowns-content") as HTMLElement;
    if (!dropdown) return;

    let options = `<li class="vg-dropdowns-li" data-type-id="">全部类型</li>`;
    typeslist.forEach((t: any) => {
      options += `<li class="vg-dropdowns-li" data-type-id="${t.uuid}">${t.type_name}</li>`;
    });
    dropdown.innerHTML = options;

    const titleBtn = container.querySelector(".vg-dropdowns-title button") as HTMLButtonElement;
    titleBtn?.addEventListener("click", () => {
      dropdown.classList.toggle("hide");
    });

    dropdown.querySelectorAll(".vg-dropdowns-li").forEach((li) => {
      li.addEventListener("click", () => {
        const typeId = li.getAttribute("data-type-id") || null;
        const selectName = container.querySelector('[fxtag="select_name"]');
        if (selectName) selectName.textContent = typeId ? li.textContent : "全部类型";
        globalThis.dispatchEvent(new CustomEvent("material-type-change", { detail: typeId }));
        dropdown.classList.add("hide");
      });
    });
  } catch (error) {
    console.error("加载素材类型失败:", error);
    container.innerHTML = `<div class="error">类型加载失败</div>`;
  }
};