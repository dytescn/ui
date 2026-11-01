// src/route/setting.ts
import { workspace_setting_tpl } from "../view/setting.ts";
import { getProjectByUuid, updateProject, softDeleteProject } from "../apis/projects.ts";
import { dialog_delete_tpl, dialog_input_tpl } from "../view/dialog.ts";
import type { Tpl } from "@funxdata/pages/tplstype";

// deno-lint-ignore no-explicit-any
const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;

export const setting_init = async (puid: string) => {
  const container = document.getElementById("project_content");
  if (!container) return;

  try {
    const project = await getProjectByUuid(puid);
    if (!project) {
      container.innerHTML = `<div class="error">项目不存在或已删除</div>`;
      return;
    }

    // 渲染设置页面
    container.innerHTML = await TplToHtml.renderString(workspace_setting_tpl, {
      projectinfo: project,
    });

    // 填充封面
    const avatarImg = container.querySelector("#avator_img") as HTMLElement;
    if (avatarImg && project.cover) {
      avatarImg.style.backgroundImage = `url('${project.cover}')`;
    }

    // 绑定按钮事件
    bindSettingEvents(project);
  } catch (error) {
    console.error("加载设置页失败:", error);
    container.innerHTML = `<div class="error">加载失败，请刷新重试</div>`;
  }
};

function bindSettingEvents(project: any) {
  const container = document.getElementById("project_content");
  if (!container) return;

  // 编辑名称
  container.querySelector("#setup_name_edit")?.addEventListener("click", () => {
    openInputDialog({
      title: "编辑项目名称",
      placeholder: "请输入新的项目名称",
      defaultValue: project.name,
      onConfirm: async (value) => {
        await updateProject(project.id, { name: value });
        const nameText = container.querySelector("#name_text");
        if (nameText) nameText.textContent = value;
        project.name = value;
      },
    });
  });

  // 编辑简介
  container.querySelector("#description_edit")?.addEventListener("click", () => {
    openInputDialog({
      title: "编辑项目简介",
      placeholder: "请输入新的项目简介",
      defaultValue: project.description || "",
      onConfirm: async (value) => {
        await updateProject(project.id, { description: value });
        const descText = container.querySelector("#description_text");
        if (descText) descText.textContent = value || "暂无填写项目简介";
        project.description = value;
      },
    });
  });

  // 上传封面
  const editCoverBtn = container.querySelector("#avator_edit");
  const coverInput = container.querySelector("#avator_input") as HTMLInputElement;
  editCoverBtn?.addEventListener("click", () => coverInput?.click());
  coverInput?.addEventListener("change", async () => {
    const file = coverInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      await updateProject(project.id, { cover: base64 });
      const avatarImg = container.querySelector("#avator_img") as HTMLElement;
      if (avatarImg) avatarImg.style.backgroundImage = `url('${base64}')`;
      project.cover = base64;
    };
    reader.readAsDataURL(file);
  });

  // 归档项目
  container.querySelector("#filing_btn")?.addEventListener("click", () => {
    openConfirmDialog({
      message: "确定要归档该项目吗？",
      onConfirm: async () => {
        await updateProject(project.id, { is_archived: true });
        globalThis.location.href = "/project";
      },
    });
  });

  // 删除项目
  container.querySelector("#del_btn")?.addEventListener("click", () => {
    openConfirmDialog({
      message: "确定要删除该项目吗？删除后项目文件将永久删除，所有成员将无法访问项目文件。",
      onConfirm: async () => {
        await softDeleteProject(project.id);
        globalThis.location.href = "/project";
      },
    });
  });
}

// ---------- 通用弹窗函数 ----------

async function openInputDialog(options: {
  title: string;
  placeholder: string;
  defaultValue?: string;
  onConfirm: (value: string) => Promise<void>;
}) {
  const popup = document.getElementById("popup");
  if (!popup) return;

  popup.innerHTML = await TplToHtml.renderString(dialog_input_tpl, {
    info: { title: options.title, placeholder: options.placeholder },
  });

  const input = popup.querySelector("#dialog-input input") as HTMLInputElement;
  if (input && options.defaultValue !== undefined) {
    input.value = options.defaultValue;
  }

  const errorTip = popup.querySelector("#dialog-input .error-tip") as HTMLElement;
  const confirmBtn = popup.querySelector("#define") as HTMLButtonElement;
  const cancelBtn = popup.querySelector("#cancel") as HTMLButtonElement;

  cancelBtn?.addEventListener("click", () => {
    popup.innerHTML = "";
  }, { once: true });

  confirmBtn?.addEventListener("click", async () => {
    const value = input?.value?.trim() || "";
    if (!value) {
      errorTip.textContent = "内容不能为空";
      errorTip.classList.add("error");
      return;
    }

    if (confirmBtn.disabled) return;
    confirmBtn.disabled = true;

    try {
      await options.onConfirm(value);
      popup.innerHTML = "";
    } catch (error) {
      console.error("操作失败:", error);
      errorTip.textContent = "操作失败，请重试";
      errorTip.classList.add("error");
      confirmBtn.disabled = false;
    }
  }, { once: true });
}

async function openConfirmDialog(options: { message: string; onConfirm: () => Promise<void>;}) {
  const popup = document.getElementById("popup");
  if (!popup) return;

  popup.innerHTML = await TplToHtml.renderString(dialog_delete_tpl, {});

  const messageEl = popup.querySelector("#dialog-message");
  if (messageEl) messageEl.textContent = options.message;

  const confirmBtn = popup.querySelector("#define") as HTMLButtonElement;
  const cancelBtn = popup.querySelector("#cancel") as HTMLButtonElement;

  cancelBtn?.addEventListener("click", () => {
    popup.innerHTML = "";
  }, { once: true });

  confirmBtn?.addEventListener("click", async () => {
    if (confirmBtn.disabled) return;
    confirmBtn.disabled = true;

    try {
      await options.onConfirm();
      popup.innerHTML = "";
    } catch (error) {
      console.error("操作失败:", error);
      alert("操作失败，请重试");
      confirmBtn.disabled = false;
    }
  }, { once: true });
}