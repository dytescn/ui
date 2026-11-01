// src/route/project.ts
import { project_card_tpl } from "../view/project.ts";
import { getProjectsPage } from "../apis/projects.ts";
import { getPageSizeForScreen } from "../utils/scroll.ts";
import type { Tpl } from "@funxdata/pages/tplstype";

// deno-lint-ignore no-explicit-any
const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;

// 状态变量
let currentPage = 1;
let pageSize = 40;
let searchKeyword = '';
let filterStatus: 'all' | 'archived' | 'planned' = 'all';
let isLoading = false;
let hasMore = true;
let cardsContainer: HTMLElement | null = null;
let sentinel: HTMLElement | null = null;
let observer: IntersectionObserver | null = null;

export const project_init = async () => {
  const projectNode = document.getElementById("project_all");
  if (!projectNode) return;

  const addProjectNode = projectNode.querySelector("#add_project") as HTMLElement;
  if (!addProjectNode) return;

  // 创建卡片容器（放在 add_project 后面）
  cardsContainer = document.getElementById("project_cards");
  if (!cardsContainer) {
    cardsContainer = document.createElement("div");
    cardsContainer.id = "project_cards";
    cardsContainer.style.display = "contents";
    addProjectNode.insertAdjacentElement("afterend", cardsContainer);
  }

  // 创建哨兵元素
  sentinel = document.getElementById("load-more-sentinel");
  if (!sentinel) {
    sentinel = document.createElement("div");
    sentinel.id = "load-more-sentinel";
    sentinel.style.height = "1px";
    sentinel.style.width = "100%";
    projectNode.appendChild(sentinel);
  }

  // 根据屏幕计算 pageSize
  pageSize = getPageSizeForScreen(projectNode, 240, 220);

  // IntersectionObserver 无限滚动
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoading && hasMore) {
            loadProjects(false);
          }
        });
      },
      { rootMargin: "200px" }
    );
  }
  observer.observe(sentinel);

  // 搜索事件（防抖）
  const searchInput = document.getElementById("search_manage") as HTMLInputElement;
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      // deno-lint-ignore no-explicit-any
      clearTimeout((searchInput as any).__debounceTimer);
      // deno-lint-ignore no-explicit-any
      (searchInput as any).__debounceTimer = setTimeout(() => {
        searchKeyword = searchInput.value.trim();
        resetAndLoad();
      }, 300);
    });
  }

  // 已归档按钮切换逻辑
  const archivedBtn = document.getElementById("filter_archived");
  const archivedBtnText = archivedBtn?.querySelector("p");

  const updateArchivedButton = () => {
    if (!archivedBtn || !archivedBtnText) return;
    if (filterStatus === 'archived') {
      archivedBtnText.textContent = '执行中';
      archivedBtn.classList.add('active');
    } else {
      archivedBtnText.textContent = '已归档';
      archivedBtn.classList.remove('active');
    }
  };

  archivedBtn?.addEventListener("click", () => {
    filterStatus = (filterStatus === 'archived') ? 'all' : 'archived';
    updateArchivedButton();
    resetAndLoad();
  });

  // 从 URL 参数初始化筛选状态（支持 ?status=planned）
  const urlParams = new URLSearchParams(globalThis.location.search);
  const statusParam = urlParams.get('status');
  if (statusParam === 'archived') {
    filterStatus = 'archived';
  } else if (statusParam === 'planned') {
    filterStatus = 'planned';
  }
  updateArchivedButton();

  // 初始加载
  await resetAndLoad();
};

// 重置并加载第一页
async function resetAndLoad() {
  currentPage = 1;
  hasMore = true;
  isLoading = false;
  if (cardsContainer) cardsContainer.innerHTML = '';
  if (sentinel) sentinel.style.display = 'block';
  await loadProjects();
}

// 加载当前页
async function loadProjects(reset: boolean = false) {
  if (isLoading || !hasMore) return;
  isLoading = true;

  try {
    let where = '';
    const conditions: string[] = [];

    if (searchKeyword) {
      conditions.push(`(name LIKE '%${searchKeyword}%' OR description LIKE '%${searchKeyword}%')`);
    }
    if (filterStatus === 'archived') {
      conditions.push(`is_archived = 1`);
    } else if (filterStatus === 'planned') {
      // 根据实际字段调整，这里假设 schedule = '已规划'
      conditions.push(`schedule = '已规划'`);
    }

    if (conditions.length > 0) {
      where = conditions.join(' AND ');
    }

    const projects = await getProjectsPage(currentPage, pageSize, where);

    if (reset) {
      cardsContainer!.innerHTML = '';
    }

    if (projects && projects.length > 0) {
      const cardsHtml = await TplToHtml.renderString(project_card_tpl, {
        projects: projects,
      });
      cardsContainer!.insertAdjacentHTML('beforeend', cardsHtml);

      if (projects.length < pageSize) {
        hasMore = false;
        sentinel!.style.display = 'none';
      } else {
        currentPage++;
      }
    } else {
      if (cardsContainer!.children.length === 0) {
        cardsContainer!.innerHTML = '<div class="empty-state">暂无项目</div>';
      }
      hasMore = false;
      sentinel!.style.display = 'none';
    }
  } catch (error) {
    console.error("加载项目失败:", error);
    if (cardsContainer!.children.length === 0) {
      cardsContainer!.innerHTML = '<div class="error">加载失败，请刷新重试</div>';
    }
    hasMore = false;
    sentinel!.style.display = 'none';
  } finally {
    isLoading = false;
  }
}