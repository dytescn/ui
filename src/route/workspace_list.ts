// src/route/workspace_list.ts
import { workspace_design_card_tpl } from "../view/card.ts";
import { getDesignFilesByProject } from "../apis/designFiles.ts";
import { getDesignIconByExtension } from "../view/icons.ts"; // 改为扩展名匹配
import {
  getCurrentDesignInfo,
  do_save_file,
  saveCurrentDesignToWorkspace,
} from "../apis/save_file.ts";
import { dialog_alert_tpl, dialog_input_tpl } from "../view/dialog.ts";
import type { Tpl } from "@funxdata/pages/tplstype";

const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;

// ---------- 渲染设计文件列表 ----------
async function renderDesignFiles(container: HTMLElement, projectUid: string) {
  try {
    const designfiles = await getDesignFilesByProject(projectUid);
    if (!designfiles || designfiles.length === 0) {
      container.innerHTML = `<div class="empty-state">暂无设计文件</div>`;
      return;
    }
    const processedFiles = designfiles.map((file: any) => {
      // 根据文件名（含扩展名）获取图标 SVG
      const svg = getDesignIconByExtension(file.name); // 使用扩展名判断
      // 注意：不需要转义为 data URI，直接使用 SVG 字符串
      return {
        ...file,
        icon_svg: svg, // 直接放 SVG 字符串
        updated_at_display: file.updated_at
          ? new Date(file.updated_at.replace(" ", "T")).toLocaleString("zh-CN", {
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "",
      };
    });
    container.innerHTML = TplToHtml.renderString(workspace_design_card_tpl, {
      designfiles: processedFiles,
    });
  } catch (error) {
    console.error("加载设计文件失败:", error);
    container.innerHTML = `<div class="error">加载失败，请刷新重试</div>`;
  }
}

// ---------- 主入口 ----------
export const workspace_list = async (projectUid: string) => {
  const container = document.getElementById("design-files");
  if (!container) return;

  const addBtn = document.getElementById("design_file_add") as HTMLElement;
  addBtn.addEventListener("click", () => designfile_add(projectUid));

  await renderDesignFiles(container, projectUid);
};

// ---------- 点击“添加设计文件” ----------
const designfile_add = async (projectUid: string) => {
  console.log("设计文件添加按钮被点击");

  try {
    const info = await getCurrentDesignInfo();
    console.log("获取到的文件信息:", info);

    // 文件未保存（空路径）
    if (!info.filePath) {
      console.log("文件未保存，弹出输入框");
      const fileName = await showInputDialog("请输入文件名（不含扩展名）", "保存文件", "未命名");
      if (fileName) {
        const fullFileName = fileName.endsWith(".cdr") ? fileName : `${fileName}.cdr`;
        await saveCurrentDesignToWorkspace({ projectUid, fileName: fullFileName });
        await renderDesignFiles(document.getElementById("design-files")!, projectUid);
      }
      return;
    }

    // 文件已存在且命名规范（有 puid 和 uuid）
    if (info.puid && info.uuid) {
      console.log(`文件已存在：${info.filePath}，puid=${info.puid}，uuid=${info.uuid}`);
      // 直接保存并生成版本
      await saveCurrentDesignToWorkspace({
        projectUid,
        puid: info.puid,
        uuid: info.uuid,
      });
      // 刷新列表更新封面
      await renderDesignFiles(document.getElementById("design-files")!, projectUid);
      return;
    }

    // 文件名不规范（缺少 puid 或 uuid）
    console.log("文件名不规范，弹出输入框");
    const userFileName = await showInputDialog("请输入文件名（不含扩展名）", "保存文件", "");
    if (userFileName) {
      const fullFileName = userFileName.endsWith(".cdr") ? userFileName : `${userFileName}.cdr`;
      await saveCurrentDesignToWorkspace({ projectUid, fileName: fullFileName });
      await renderDesignFiles(document.getElementById("design-files")!, projectUid);
    }
  // deno-lint-ignore no-explicit-any
  } catch (error:any) {
    console.error("获取设计文件信息失败:", error);
    await showConfirm(`保存失败: ${error.message}`, "错误");
  }
};

// ---------- 增强的 showInputDialog（备用方案） ----------
function showInputDialog(
  message: string,
  title: string = "输入",
  defaultValue: string = ""
): Promise<string | null> {
  return new Promise((resolve) => {
    const container = document.getElementById("popup");
    if (!container) {
      console.warn("未找到 #popup，使用原生 prompt");
      const result = prompt(`${title}: ${message}`, defaultValue);
      resolve(result !== null ? result.trim() || null : null);
      return;
    }
    container.innerHTML = TplToHtml.renderString(dialog_input_tpl, {
      info: { title, placeholder: message },
    });
    const input = container.querySelector("#dialog-input input") as HTMLInputElement;
    if (input && defaultValue) input.value = defaultValue;
    const confirmBtn = container.querySelector("#define") as HTMLElement;
    const cancelBtn = container.querySelector("#cancel") as HTMLElement;

    const cleanup = () => {
      confirmBtn?.removeEventListener("click", onConfirm);
      cancelBtn?.removeEventListener("click", onCancel);
    };
    const onConfirm = () => {
      cleanup();
      const val = input ? input.value.trim() : "";
      resolve(val || null);
    };
    const onCancel = () => {
      cleanup();
      resolve(null);
    };
    confirmBtn?.addEventListener("click", onConfirm);
    cancelBtn?.addEventListener("click", onCancel);
  });
}

// 同样增强 showConfirm
function showConfirm(message: string, title: string = "提示"): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.getElementById("popup");
    if (!container) {
      console.warn("未找到 #popup,使用原生 confirm");
      resolve(confirm(`${title}: ${message}`));
      return;
    }
    container.innerHTML = TplToHtml.renderString(dialog_alert_tpl, { name: title, message });
    const confirmBtn = container.querySelector("#define") as HTMLElement;
    const cancelBtn = container.querySelector("#cancel") as HTMLElement;
    const cleanup = () => {
      confirmBtn?.removeEventListener("click", onConfirm);
      cancelBtn?.removeEventListener("click", onCancel);
    };
    const onConfirm = () => { cleanup(); resolve(true); };
    const onCancel = () => { cleanup(); resolve(false); };
    confirmBtn?.addEventListener("click", onConfirm);
    cancelBtn?.addEventListener("click", onCancel);
  });
}



