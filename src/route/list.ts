// src/route/list.ts
import { card_tpl } from "../view/card.ts";
import {
  getMaterialFilePage,          // 改用分页查询
  updateMaterialFile,
  softDeleteMaterialFileByUuid,
} from "../apis/material.ts";
import { getMaterialTypeList } from "../apis/type.ts";
import { getPageSizeForScreen } from "../utils/scroll.ts";
import type { Tpl } from "@funxdata/pages/tplstype";
import { dialog_delete_tpl, dialog_input_tpl } from "../view/dialog.ts";

// deno-lint-ignore no-explicit-any
const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;

// 模块级筛选状态
let currentTypeUid: string | null = null;
let searchKeyword = "";
// deno-lint-ignore no-explicit-any
let typeMapCache: Map<string, any> | null = null;

// 分页状态
let currentPage = 1;
let pageSize = 40; // 默认值，初始化时根据屏幕调整
let isLoading = false;
let hasMore = true;
let scrollContainer: HTMLElement | null = null;

// 获取类型映射（带缓存）
// deno-lint-ignore no-explicit-any
async function getTypeMap(): Promise<Map<string, any>> {
  if (typeMapCache) return typeMapCache;

  const types = await getMaterialTypeList();
  const map = new Map();
  if (Array.isArray(types)) {
    // deno-lint-ignore no-explicit-any
    types.forEach((t: any) => map.set(t.uuid, t));
  }
  typeMapCache = map;
  return map;
}

// 监听类型筛选事件
globalThis.addEventListener("material-type-change", (e: Event) => {
  const customEvent = e as CustomEvent;
  currentTypeUid = customEvent.detail || null;
  resetAndLoad();
});

// 监听搜索事件
globalThis.addEventListener("material-search-change", (e: Event) => {
  const customEvent = e as CustomEvent;
  searchKeyword = customEvent.detail || "";
  resetAndLoad();
});

/**
 * 重置状态并加载第一页
 */
async function resetAndLoad() {
  currentPage = 1;
  hasMore = true;
  isLoading = false;
  const container = document.getElementById("all-cards-content");
  if (container) container.innerHTML = '';
  await loadMaterials();
}

/**
 * 加载素材列表（分页）
 */
async function loadMaterials() {
  const container = document.getElementById("all-cards-content");
  if (!container) return;
  if (isLoading || !hasMore) return;

  isLoading = true;

  try {
    // 构建查询条件
    const conditions: string[] = [];
    if (searchKeyword) {
      conditions.push(`(name LIKE '%${searchKeyword}%' OR description LIKE '%${searchKeyword}%')`);
    }
    if (currentTypeUid) {
      conditions.push(`type_uid = '${currentTypeUid}'`);
    }
    const where = conditions.join(" AND ");

    // 使用分页 API 获取当前页数据
    const materials = await getMaterialFilePage(currentPage, pageSize, where);

    if (!Array.isArray(materials) || materials.length === 0) {
      if (currentPage === 1) {
        container.innerHTML = `<div class="empty-state">暂无素材</div>`;
      }
      hasMore = false;
      return;
    }

    // 获取类型映射（用于图标）
    const typeMap = await getTypeMap();
    const processed = materials.map((m: any) => ({
      ...m,
      type_icon: typeMap.get(m.type_uid)?.icon || "",
    }));

    // 渲染并追加卡片
    const html = await TplToHtml.renderString(card_tpl, { lists: processed });
    container.insertAdjacentHTML('beforeend', html);
    bindCardEvents(container);

    // 判断是否还有更多
    if (materials.length < pageSize) {
      hasMore = false;
    } else {
      currentPage++;
    }
  } catch (error) {
    console.error("加载素材列表失败:", error);
    if (currentPage === 1) {
      container.innerHTML = `<div class="error">加载失败，请刷新重试</div>`;
    }
    hasMore = false;
  } finally {
    isLoading = false;
  }
}

/**
 * 滚动加载处理函数
 */
function handleScroll() {
  if (!scrollContainer || isLoading || !hasMore) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
  // 距离底部 200px 时触发加载
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    loadMaterials();
  }
}

/**
 * 初始化滚动监听
 */
function initScrollListener() {
  scrollContainer = document.getElementById("all-cards-content");
  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", handleScroll);
  }
}

/**
 * 素材列表初始化入口
 */
export const material_list = async () => {
  const container = document.getElementById("all-cards-content");
  if (!container) return;

  // 根据屏幕计算合适的 pageSize
  pageSize = getPageSizeForScreen(container, 240, 220);
  console.log("动态 pageSize:", pageSize);

  // 初始化滚动监听（仅绑定一次）
  if (!scrollContainer) {
    initScrollListener();
  }

  // 重置并加载第一页
  await resetAndLoad();
};

// ===================== 卡片操作（保持不变） =====================

function bindCardEvents(container: HTMLElement) {
  container.querySelectorAll(".cards-content-material").forEach((card) => {
    const id = Number(card.getAttribute("data-id"));
    const uuid = card.getAttribute("data-uuid") || "";

    const renameLi = card.querySelector('[data-action="rename"]');
    renameLi?.addEventListener("click", () => {
      openRenameDialog(id, uuid, card.querySelector(".names")?.textContent || "");
    });

    const deleteLi = card.querySelector('[data-action="delete"]');
    deleteLi?.addEventListener("click", () => {
      openDeleteDialog(id, uuid);
    });
  });
}

async function openRenameDialog(id: number, uuid: string, currentName: string) {
  const popup = document.getElementById("popup");
  if (!popup) return;

  popup.innerHTML = await TplToHtml.renderString(dialog_input_tpl, {
    info: { title: "重命名素材", placeholder: "请输入新名称" },
  });

  const input = popup.querySelector("#dialog-input input") as HTMLInputElement;
  if (input) input.value = currentName;

  const errorTip = popup.querySelector("#dialog-input .error-tip") as HTMLElement;
  const confirmBtn = popup.querySelector("#define") as HTMLButtonElement;
  const cancelBtn = popup.querySelector("#cancel") as HTMLButtonElement;

  cancelBtn?.addEventListener("click", () => { popup.innerHTML = ""; }, { once: true });

  confirmBtn?.addEventListener("click", async () => {
    const newName = input?.value?.trim() || "";
    if (!newName) {
      errorTip.textContent = "名称不能为空";
      errorTip.classList.add("error");
      return;
    }
    if (confirmBtn.disabled) return;
    confirmBtn.disabled = true;

    try {
      await updateMaterialFile(id, { name: newName });
      popup.innerHTML = "";
      resetAndLoad(); // 刷新列表
    } catch (error) {
      console.error("重命名失败:", error);
      errorTip.textContent = "操作失败，请重试";
      errorTip.classList.add("error");
      confirmBtn.disabled = false;
    }
  }, { once: true });
}

async function openDeleteDialog(id: number, uuid: string) {
  const popup = document.getElementById("popup");
  if (!popup) return;

  popup.innerHTML = dialog_delete_tpl;

  const confirmBtn = popup.querySelector("#define") as HTMLButtonElement;
  const cancelBtn = popup.querySelector("#cancel") as HTMLButtonElement;

  cancelBtn?.addEventListener("click", () => { popup.innerHTML = ""; }, { once: true });

  confirmBtn?.addEventListener("click", async () => {
    if (confirmBtn.disabled) return;
    confirmBtn.disabled = true;

    try {
      await softDeleteMaterialFileByUuid(uuid);
      popup.innerHTML = "";
      resetAndLoad(); // 刷新列表
    } catch (error) {
      console.error("删除失败:", error);
      alert("删除失败，请重试");
      confirmBtn.disabled = false;
    }
  }, { once: true });
}