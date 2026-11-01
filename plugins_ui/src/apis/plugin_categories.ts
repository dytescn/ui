// src/apis/plugin_categories.ts
// 插件分类 API：全部通过 plugin_lib。

import { callPluginLib } from "./plugin_lib.ts";

export interface CategoryRecord {
  uuid: string;
  type_name?: string;
  icon?: string;
  parent_uuid?: string;
  sort_order?: number;
  [key: string]: unknown;
}

export const getCategories = async (params: { parent_uuid?: string } = {}) => {
  const data = await callPluginLib<{ list: CategoryRecord[] }>("get_categories", params);
  return data.list;
};

export const getTopCategories = async () => {
  const list = await getCategories();
  return list.filter((item) => !item.parent_uuid);
};

export const getSubCategories = (parentUuid: string) =>
  getCategories({ parent_uuid: parentUuid });

export const insertCategory = (data: Record<string, unknown>) =>
  callPluginLib<{ uuid: string }>("category", data);
