import { tags_tpl } from "../view/tags.ts";
import { getCategories } from "../apis/plugin_categories.ts";
import type { Tpl } from "@funxdata/pages/tplstype";
// deno-lint-ignore no-explicit-any
const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;

export const plugins_tags = async () => {
  const Material_node = document.getElementById("tags-list");
  if (!Material_node) return;

  // 1. 确保卡片容器存在（位于按钮之后）

  try {
    const materlists = await getCategories();
    console.log(materlists);
    if (!materlists || materlists.length === 0) {
      // project_node.innerHTML = "<p>暂无项目</p>";
      return;
    }
    // 仅更新卡片容器内容，不影响按钮 
    const cards_html = await TplToHtml.renderString(tags_tpl, {
      lists: materlists,
    });
    Material_node.insertAdjacentHTML('beforeend', cards_html);
  } catch (error) {
    console.error("获取项目列表失败:", error);
  }
};