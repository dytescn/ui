// src/apis/plugins.ts
// 插件主表 API：全部通过 plugin_lib。

import { callPluginLib } from "./plugin_lib.ts";

export interface PluginListParams {
  category?: string;
  keyword?: string;
  status?: string;
  target?: string;
  page?: number;
  page_size?: number;
}

export interface PluginRecord {
  uuid: string;
  name?: string;
  desc?: string;
  category_id?: string;
  status?: string;
  target?: string;
  installed?: number;
  install_path?: string;
  enabled?: number;
  cover?: string;
  [key: string]: unknown;
}

export interface PluginListResult {
  list: PluginRecord[];
  total: number;
  page: number;
  page_size: number;
}

export interface PluginDetail {
  plugin: PluginRecord | null;
  versions: Record<string, unknown>[];
  installs: Record<string, unknown>[];
}

// 1. 列表 / 查询
export const getPlugins = (params: PluginListParams = {}) =>
  callPluginLib<PluginListResult>("get_plugins", params);

export const getPluginsByCategory = (categoryId: string, params: PluginListParams = {}) =>
  getPlugins({ ...params, category: categoryId });

export const getPluginsByStatus = (status: string, params: PluginListParams = {}) =>
  getPlugins({ ...params, status });

// 2. 单个插件（get_plugin 支持 uuid 或 name）
export const getPluginByUuid = (uuid: string) =>
  callPluginLib<PluginDetail>("get_plugin", { uuid });

export const getPluginByName = (name: string) =>
  callPluginLib<PluginDetail>("get_plugin", { name });

// 3. 新增
export const insertPlugin = (data: Record<string, unknown>) =>
  callPluginLib<{ uuid: string }>("plugin", data);

// 4. 部分更新
export const patchPlugin = (
  uuid: string,
  data: {
    enabled?: boolean | number;
    status?: string;
    category_id?: string;
    cover?: string;
  },
) => callPluginLib<{ updated: boolean }>("patch_plugin", { uuid, ...data });

// 5. 安装 / 卸载（plugin_lib M4 尚未实现，先按最终接口接入）
export const installPlugin = (uuid: string, version?: string, filePath?: string) =>
  callPluginLib<{ install_path: string; status: string }>("install", {
    plugin_uuid: uuid,
    ...(version ? { version } : {}),
    ...(filePath ? { file_path: filePath } : {}),
  });

export const uninstallPlugin = (uuid: string, version?: string) =>
  callPluginLib<{ uninstalled: boolean }>("uninstall", {
    plugin_uuid: uuid,
    ...(version ? { version } : {}),
  });

// 7. 扫描已安装插件目录（plugin_lib.post_scan）
export interface ScanResult {
  found: number;
  added: number;
  updated: number;
  libs: number;
  functions: number;
}

export const scanPlugins = (dir?: string) =>
  callPluginLib<ScanResult>("scan", dir ? { dir } : {});
