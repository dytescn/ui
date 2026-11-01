// rout/header.ts
import { header_tpl } from "../view/header.ts";
import { getSessionById, updateSession } from "../apis/sessions.ts";
import { init_slidebar } from "./slidebar.ts";
import type { Tpl } from "@funxdata/pages/tplstype";

const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;

export const header_init = async (uid: string) => {
  const chat_header_node = document.getElementById("chat-header") as HTMLElement;
  if (!chat_header_node) return;

  // 默认标题
  let title = uid ? "加载中..." : "新对话";
  let isArchived = false;

  // 初次渲染
  chat_header_node.innerHTML = TplToHtml.renderString(header_tpl, { title });

  // 获取会话信息（如果有 uid）
  if (uid) {
    try {
      const session = await getSessionById(uid);
      if (session) {
        title = session.title || "未命名会话";
        isArchived = session.is_archived === 1;
        // 重新渲染
        chat_header_node.innerHTML = TplToHtml.renderString(header_tpl, { title });
      }
    } catch (error) {
      console.error("[header_init] 获取会话标题失败:", error);
      chat_header_node.innerHTML = TplToHtml.renderString(header_tpl, { title: "未命名会话" });
    }
  }

  // 绑定事件
  bindHeaderEvents(chat_header_node, uid, isArchived);
};

function bindHeaderEvents(container: HTMLElement, uid: string, initialArchived: boolean) {
  // 侧边栏切换
  const sidebar = document.getElementById("chat-slidebar");
  if (sidebar) {
    const panelBtn = container.querySelector(".lucide-panel-left")?.closest("button") as HTMLButtonElement | null;
    const menuBtn = container.querySelector(".lucide-menu")?.closest("button") as HTMLButtonElement | null;

    const toggleSidebar = () => sidebar.classList.toggle("hidden");
    panelBtn?.addEventListener("click", toggleSidebar);
    menuBtn?.addEventListener("click", toggleSidebar);
  }

  // 标题编辑
  const titleSpan = container.querySelector("#chat-header-title") as HTMLElement | null;
  if (titleSpan && uid) {
    titleSpan.addEventListener("click", () => {
      startTitleEdit(titleSpan, uid);
    });
  }

  // 归档按钮
  const archiveBtn = container.querySelector("#chat-header-archive-btn") as HTMLButtonElement | null;
  if (archiveBtn) {
    // 设置初始状态
    updateArchiveButtonUI(archiveBtn, initialArchived);

    archiveBtn.addEventListener("click", async () => {
      if (!uid) return; // 新对话不可归档

      // 切换归档状态
      const currentState = archiveBtn.dataset.archived === "true";
      const newState = !currentState;

      try {
        await updateSession(uid, { is_archived: newState });
        archiveBtn.dataset.archived = String(newState);
        updateArchiveButtonUI(archiveBtn, newState);
        
        // 刷新侧边栏列表，使归档/取消归档立即反映
        init_slidebar(uid);

        // 若归档了当前会话，可以可选跳转到新对话（按需启用）
        // if (newState) location.href = "/chat";
      } catch (error) {
        console.error("[header_init] 归档操作失败:", error);
        alert("归档操作失败，请重试");
      }
    });
  }
}

// 更新归档按钮的图标和提示
function updateArchiveButtonUI(btn: HTMLButtonElement, archived: boolean) {
  const svg = btn.querySelector("svg");
  const srOnly = btn.querySelector(".aui-sr-only");
  if (archived) {
    if (svg) {
      // 更换为“取消归档”图标（例如 archive-restore 或 archive-x）
      svg.innerHTML = `<rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M12 12v5"></path><path d="m9 14 3 3 3-3"></path>`;
    }
    if (srOnly) srOnly.textContent = "取消归档";
    btn.setAttribute("aria-label", "取消归档");
  } else {
    if (svg) {
      svg.innerHTML = `<rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path>`;
    }
    if (srOnly) srOnly.textContent = "归档";
    btn.setAttribute("aria-label", "归档对话");
  }
}

function startTitleEdit(titleSpan: HTMLElement, uid: string) {
  // 防止重复编辑
  if (titleSpan.dataset.editing === "true") return;
  titleSpan.dataset.editing = "true";

  const currentTitle = titleSpan.textContent?.trim() || "";
  titleSpan.innerHTML = ""; // 清空容器，准备放置 input

  const input = document.createElement("input");
  input.type = "text";
  input.value = currentTitle;
  input.className =
    "bg-transparent border border-border rounded px-1 py-0.5 text-sm font-medium w-full min-w-0 outline-none focus:border-ring";
  input.style.width = "100%";
  titleSpan.appendChild(input);

  // 聚焦并将光标放在末尾，而不是全选
  input.focus();
  const len = currentTitle.length;
  input.setSelectionRange(len, len); // 光标定位到末尾

  let finished = false;

  const cleanup = () => {
    delete titleSpan.dataset.editing;
  };

  const save = async () => {
    if (finished) return;
    finished = true;
    const newTitle = input.value.trim() || currentTitle;
    // 恢复显示
    titleSpan.textContent = newTitle;
    cleanup();

    try {
      await updateSession(uid, { title: newTitle });
      // 刷新侧边栏标题
      init_slidebar(uid);
    } catch (error) {
      console.error("[header_init] 更新标题失败:", error);
      alert("标题更新失败");
    }
  };

  const cancel = () => {
    if (finished) return;
    finished = true;
    titleSpan.textContent = currentTitle;
    cleanup();
  };

  input.addEventListener("keydown", (e) => {
    if (e.isComposing) return;
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  });

  input.addEventListener("blur", save);
}