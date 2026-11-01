// src/rout/design.ts
import { icon_default, getDesignIcon } from "../view/designicons.ts";
import { design_choose_tpl } from "../view/designsoft.ts";
import type { Tpl } from "@funxdata/pages/tplstype";
import { getSoftwareList } from "../apis/designdb.ts";
import { startSoftware } from "../apis/designsoft.ts";
import { setSetting } from "../apis/setting.ts"; // 用于存储和清空


export const init_design_soft = async () => {
  const setting_info_node = document.getElementById("all-setting-info") as HTMLElement;
  const design_choose_node = document.getElementById("design-soft-info") as HTMLElement;

  // 清空存储的软件信息
  await setSetting("designsoft_name", "");
  await setSetting("designsoft_version", "");

  // 恢复默认图标和提示
  design_choose_node.innerHTML = icon_default;
  design_choose_node.title = "选择设计软件";
  design_choose_node.setAttribute('data-tooltip', '选择设计软件');

  design_choose_node.addEventListener("click", (event: Event) => {
    const toggleAction = setting_info_node.dataset.toggle; // "hide" / "show"
    if (toggleAction === "hide") {
      setting_info_node.dataset.toggle = "show";
      design_info("show");
    } else {
      setting_info_node.dataset.toggle = "hide";
      design_info("hide");
    }
  });
};

export const design_info = async (cur: string) => {
    // deno-lint-ignore no-explicit-any
    const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;
  const popup_node = document.getElementById("popup") as HTMLElement;
  const setting_info_node = document.getElementById("all-setting-info") as HTMLElement;
  const design_choose_node = document.getElementById("design-soft-info") as HTMLElement;

  if (cur === "show") {
    // 获取软件列表
    const design_info = await getSoftwareList();
    const designsofts = design_info.map(item => ({
      ...item,
      icon: getDesignIcon(item.name)
    }));

    // 渲染下拉菜单
    popup_node.innerHTML = await TplToHtml.renderString(design_choose_tpl, { designsofts });

    // 绑定每个软件项的点击事件
    popup_node.querySelectorAll(".design-soft-item").forEach((itemEl) => {
      itemEl.addEventListener("click", async (e) => {
        e.preventDefault();
        const name = itemEl.getAttribute("data-name") || "";
        const version = itemEl.getAttribute("data-version") || "";

        try {
          // 启动软件
          await startSoftware(name, version);

          // 存储当前选择的软件信息
          await setSetting("designsoft_name", name);
          await setSetting("designsoft_version", version);

          // 更新顶部图标、标题和提示
          design_choose_node.innerHTML = getDesignIcon(name);
          const tipText = `${name} (${version})`;
          design_choose_node.title = tipText;
          design_choose_node.setAttribute('data-tooltip', tipText);

          // 关闭弹框
          setting_info_node.dataset.toggle = "hide";
          popup_node.innerHTML = "";
        } catch (err) {
          console.error("启动失败:", err);
          alert("启动失败，请确认软件已安装。");
        }
      });
    });
  } else {
    // 隐藏弹框
    popup_node.innerHTML = "";
  }
};
