// src/apis/plugin_configs.ts
// 插件配置 API：全部通过 plugin_lib。

import { callPluginLib } from "./plugin_lib.ts";

export interface ConfigRecord {
  id: number;
  plugin_uuid: string;
  param_key: string;
  param_type?: string;
  default_value?: string;
  value?: string;
  source?: string;
  [key: string]: unknown;
}

export const getConfigsByPlugin = async (pluginUuid: string, version?: string) => {
  const data = await callPluginLib<{ configs: ConfigRecord[] }>("get_configs", {
    plugin_uuid: pluginUuid,
    ...(version ? { version } : {}),
  });
  return data.configs;
};

export const insertConfig = (data: Record<string, unknown>) =>
  callPluginLib<{ id: number }>("config", data);

export const patchConfig = (
  pluginUuid: string,
  key: string,
  value: unknown,
  options: { version?: string; version_id?: number } = {},
) =>
  callPluginLib<{ updated: boolean }>("patch_config", {
    plugin_uuid: pluginUuid,
    key,
    value,
    ...options,
  });
