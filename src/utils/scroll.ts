// src/utils/scroll.ts
/**
 * 根据容器宽度和视口高度，估算一页应加载的卡片数量
 * @param container 卡片容器元素
 * @param cardMinWidth 卡片最小宽度（px），用于计算列数
 * @param cardHeight 卡片预估高度（px）
 * @param fillRatio 安全系数，默认 1.2，确保加载内容稍多于视口高度
 * @returns 建议的每页加载数量
 */
export const getPageSizeForScreen = (
  container: HTMLElement,
  cardMinWidth: number = 240,
  cardHeight: number = 220,
  fillRatio: number = 1.2
): number => {
  // 获取容器宽度（若无则用视口宽度）
  const containerWidth = container.clientWidth || globalThis.innerWidth;
  // 计算一行能放几个卡片（至少 1 个）
  const columns = Math.max(1, Math.floor(containerWidth / cardMinWidth));
  // 计算视口高度能放几行（至少 1 行）
  const viewportHeight = globalThis.innerHeight;
  const rows = Math.max(1, Math.ceil((viewportHeight * fillRatio) / cardHeight));
  // 返回总卡片数
  return columns * rows;
};