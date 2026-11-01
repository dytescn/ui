// create_project.ts
import { create_project_tpl } from "../view/create.ts";
import { insertProject } from "../apis/projects.ts";
import { generateUUID } from "../utils/uuid.ts";

export const create_project = () => {
  const popup = document.getElementById("popup");
  if (!popup) return;

  // 渲染弹窗模板
  popup.innerHTML = create_project_tpl;

  // 取消按钮：点击后清空弹窗
  const cancelBtn = popup.querySelector("#cancel");
  cancelBtn?.addEventListener(
    "click",
    () => {
      popup.innerHTML = "";
    },
    { once: true }
  );

  // 提交按钮：处理创建项目
  const submitBtn = popup.querySelector("#define");
  submitBtn?.addEventListener(
    "click",
    async (e) => {
      e.preventDefault();

      // 防止重复提交（可选：禁用按钮）
      if ((submitBtn as HTMLButtonElement).disabled) return;
      (submitBtn as HTMLButtonElement).disabled = true;

      const input = popup.querySelector("#name_dom input") as HTMLInputElement;
      const name = input?.value?.trim();
      const errorTip = popup.querySelector("#name_dom .error-tip") as HTMLElement;

      // 清空错误提示
      errorTip.textContent = "";
      errorTip.className = "error-tip";

      // 校验名称
      if (!name) {
        errorTip.textContent = "请输入项目名称";
        errorTip.classList.add("error");
        (submitBtn as HTMLButtonElement).disabled = false; // 恢复按钮
        return;
      }

      try {
        // 生成 UUID 并插入项目
        const uuid = generateUUID();
        const result = await insertProject({ uuid, name });

        // 根据后端返回结构判断成功与否（此处假设成功 code === 200）
        if (result && result.code === 200) {
          popup.innerHTML = ""; // 关闭弹窗
          // 刷新页面以显示新项目（或者触发自定义事件刷新列表）
          globalThis.location.href = "/project";
        } else {
          errorTip.textContent = "创建失败: " + (result?.msg || "未知错误");
          errorTip.classList.add("error");
        }
      } catch (error: any) {
        console.error("创建项目失败:", error);
        errorTip.textContent = "请求失败: " + error.message;
        errorTip.classList.add("error");
      } finally {
        // 无论成功失败，都恢复按钮状态（如果页面已刷新，这一步可能无效但无害）
        (submitBtn as HTMLButtonElement).disabled = false;
      }
    },
    { once: true } // 只绑定一次，防止多次点击重复触发
  );
};