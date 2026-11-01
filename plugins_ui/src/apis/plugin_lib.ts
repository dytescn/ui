// src/apis/plugin_lib.ts
// 统一的 plugin_lib 调用入口。
//
// cyctron 会把请求方法拼到 FFI-Symbol 前：<method>_<FFI-Symbol>。
// 浏览器 fetch 不能给 GET 带 body，因此这里统一用 POST，
// plugin_lib 为查询/更新/部分更新提供了 post_ 前缀别名。

const API_URL = "http://127.0.0.1:44944/plugin_lib";

interface PluginLibResponse<T> {
  code: number;
  data: T;
  msg: string;
}

export const callPluginLib = async <T>(
  symbol: string,
  body: object = {},
): Promise<T> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": symbol,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`plugin_lib ${symbol} HTTP ${response.status}`);
  }

  const raw = (await response.json()) as PluginLibResponse<T>;
  if (raw?.code !== 200) {
    throw new Error(
      `plugin_lib ${symbol} 失败 (${raw?.code}): ${raw?.msg ?? "unknown error"}`,
    );
  }

  return raw.data;
};
