// rout/slidebar.ts
import { slidebar_tpl } from "../view/slidebar.ts";
import { slidebar_btn_tips } from "../view/tabs.ts";
import { getSessions, updateSession } from "../apis/sessions.ts";
import type { Tpl } from "@funxdata/pages/tplstype";
import { getDateLabel } from "../utils/time.ts";

// deno-lint-ignore no-explicit-any
const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;

// 模块级变量，用于清理事件监听
let slidebarClickHandler: ((e: MouseEvent) => void) | null = null;
let searchInputHandler: ((e: Event) => void) | null = null;

export const init_slidebar = async (uid: string) => {
  const slidebar_node = document.getElementById("chat-slidebar") as HTMLElement;
  if (!slidebar_node) return;

  const slidebar_info_node = slidebar_node.querySelector(".chat-slidebar-info") as HTMLElement;
  if (!slidebar_info_node) return;

  // 设置滚动容器样式
  slidebar_info_node.style.flex = "1 1 0%";
  slidebar_info_node.style.overflowY = "auto";
  slidebar_info_node.style.minHeight = "0";
  slidebar_info_node.style.position = "relative";

  const limit = 15;
  let offset = 0;
  let allSessions: any[] = [];
  let hasMore = false;
  let searchQuery = "";

  // 加载会话
  const loadSessions = async (offset: number) => {
    try {
      const result = await getSessions(false, limit, offset);
      return Array.isArray(result) ? result : [];
    } catch (err) {
      console.error("[slidebar] 获取会话列表失败:", err);
      return [];
    }
  };

  // 渲染侧边栏
  const renderSidebar = () => {
    const filteredSessions = searchQuery.trim()
      ? allSessions.filter(session =>
          session.title?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allSessions;

    const groupMap: Record<string, any[]> = {};
    filteredSessions.forEach(session => {
      const label = getDateLabel(session.created_at || session.updated_at);
      if (!groupMap[label]) groupMap[label] = [];
      groupMap[label].push(session);
    });

    const order = ["今天", "昨天", "本周", "本月", "更早"];
    const groups = order
      .filter(label => groupMap[label] && groupMap[label].length > 0)
      .map(label => ({ label, sessions: groupMap[label] }));

    const showHasMore = searchQuery.trim() ? false : hasMore;

    const html = TplToHtml.renderString(slidebar_tpl, {
      groups,
      currentUid: uid,
      hasMore: showHasMore,
    });
    slidebar_info_node.innerHTML = html;
  };

  // 初始加载
  const initialSessions = await loadSessions(0);
  allSessions = initialSessions;
  hasMore = initialSessions.length === limit;
  renderSidebar();

  // 搜索框事件
  const searchInput = document.getElementById("search_chat") as HTMLInputElement | null;
  if (searchInput) {
    if (searchInputHandler) {
      searchInput.removeEventListener("input", searchInputHandler);
    }
    searchInputHandler = (e: Event) => {
      const input = e.target as HTMLInputElement;
      searchQuery = input.value;
      renderSidebar();
    };
    searchInput.addEventListener("input", searchInputHandler);
  }

  // 加载更多
  const handleLoadMore = async () => {
    offset += limit;
    const newSessions = await loadSessions(offset);
    if (newSessions.length > 0) {
      allSessions = allSessions.concat(newSessions);
      hasMore = newSessions.length === limit;
    } else {
      hasMore = false;
    }
    renderSidebar();
  };

  // 事件委托：加载更多 + 菜单按钮
  if (slidebarClickHandler) {
    slidebar_info_node.removeEventListener("click", slidebarClickHandler);
  }

  slidebarClickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const loadMoreBtn = target.closest("#slidebar-load-more") as HTMLButtonElement | null;
    const moreBtn = target.closest(".aui-thread-list-item-more") as HTMLButtonElement | null;

    if (loadMoreBtn) {
      handleLoadMore();
      return;
    }

    if (moreBtn) {
      e.preventDefault();
      e.stopPropagation();
      const sessionId = moreBtn.closest(".aui-thread-list-item")?.getAttribute("href")?.split("uid=")[1];
      if (!sessionId) return;
      const session = allSessions.find(s => s.id === sessionId);
      if (!session) return;
      showContextMenu(moreBtn, session);
    }
  };
  slidebar_info_node.addEventListener("click", slidebarClickHandler);

  // 显示上下文菜单（使用 fixed 定位，挂载到 body）
  const showContextMenu = (anchor: HTMLElement, session: any) => {
    // 移除已有菜单
    document.querySelector(".slidebar-context-menu")?.remove();

    // 使用模板渲染菜单
    const menu = document.createElement("div");
    menu.innerHTML = TplToHtml.renderString(slidebar_btn_tips, {
      is_pinned: session.is_pinned,
      is_archived: session.is_archived,
    });
    const menuElement = menu.firstElementChild as HTMLElement;
    if (!menuElement) return;

    // fixed 定位，避免被其他元素遮挡
    menuElement.style.position = "fixed";
    const rect = anchor.getBoundingClientRect();
    menuElement.style.left = `${rect.left}px`;
    menuElement.style.top = `${rect.bottom + 4}px`;
    menuElement.style.zIndex = "9999";

    document.body.appendChild(menuElement);

    // 菜单项点击
    const handleMenuClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const actionBtn = target.closest("[data-action]") as HTMLElement | null;
      if (!actionBtn) return;
      const action = actionBtn.dataset.action;
      e.stopPropagation();

      if (action === "pin") {
        const newPinned = session.is_pinned ? false : true;
        try {
          await updateSession(session.id, { is_pinned: newPinned });
        } catch (err) {
          console.error("[slidebar] 置顶操作失败:", err);
        }
      } else if (action === "archive") {
        const newArchived = session.is_archived ? false : true;
        try {
          await updateSession(session.id, { is_archived: newArchived });
        } catch (err) {
          console.error("[slidebar] 归档操作失败:", err);
        }
      }

      // 关闭菜单并清理事件
      menuElement.remove();
      document.removeEventListener("click", handleOutsideClick);
      globalThis.removeEventListener("scroll", closeMenuOnScroll, true);
      globalThis.removeEventListener("resize", closeMenuOnResize);

      // 重新初始化侧边栏，让数据库结果直接反映到界面
      await init_slidebar(uid);
    };

    // 外部点击关闭
    const handleOutsideClick = (e: MouseEvent) => {
      if (!menuElement.contains(e.target as Node)) {
        menuElement.remove();
        document.removeEventListener("click", handleOutsideClick);
        globalThis.removeEventListener("scroll", closeMenuOnScroll, true);
        globalThis.removeEventListener("resize", closeMenuOnResize);
      }
    };

    const closeMenuOnScroll = () => {
      menuElement.remove();
      document.removeEventListener("click", handleOutsideClick);
      globalThis.removeEventListener("scroll", closeMenuOnScroll, true);
      globalThis.removeEventListener("resize", closeMenuOnResize);
    };

    const closeMenuOnResize = () => {
      menuElement.remove();
      document.removeEventListener("click", handleOutsideClick);
      globalThis.removeEventListener("scroll", closeMenuOnScroll, true);
      globalThis.removeEventListener("resize", closeMenuOnResize);
    };

    menuElement.addEventListener("click", handleMenuClick);
    // 延迟绑定外部事件，避免立即触发
    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
      globalThis.addEventListener("scroll", closeMenuOnScroll, true);
      globalThis.addEventListener("resize", closeMenuOnResize);
    }, 0);
  };
};