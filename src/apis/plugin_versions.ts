// src/apis/plugin_versions.ts
// 插件版本 API：全部通过 plugin_lib。

import { callPluginLib } from "./plugin_lib.ts";

export interface VersionRecord {
  id: number;
  plugin_uuid: string;
  version: string;
  changelog?: string;
  file_path?: string;
  file_size?: number;
  file_hash?: string;
  file_type?: string;
  status?: string;
  is_latest?: number;
  [key: string]: unknown;
}

export const getVersionsByPlugin = async (pluginUuid: string) => {
  const data = await callPluginLib<{ list: VersionRecord[] }>("get_versions", {
    plugin_uuid: pluginUuid,
  });
  return data.list;
};

export const getLatestVersion = async (pluginUuid: string) => {
  const list = await getVersionsByPlugin(pluginUuid);
  return list.find((item) => Number(item.is_latest) === 1) ?? null;
};

export const insertVersion = (data: Record<string, unknown>) =>
  callPluginLib<{ id: number }>("version", data);
