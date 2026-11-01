// 系统基础信息初始化：不再直接建 setting / setting_note 表。
// 通过 info_lib 写入一条系统基础信息设置；info_lib 首次调用会惰性建表。

const INFO_URL = "http://127.0.0.1:44944/info_lib";

type InfoError = Error & { code?: number };

async function infoCall<T = unknown>(
  symbol: string,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(INFO_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": symbol,
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok || payload.code !== 200) {
    const error = new Error(
      payload?.msg ?? `info_lib ${symbol} failed: ${response.status}`,
    ) as InfoError;
    error.code = payload?.code ?? response.status;
    throw error;
  }
  return payload.data as T;
}

const systemInfo = {
  key: "system_info",
  title: "系统基础信息",
  value_type: "json",
  category: "general",
  description: "系统基础信息（平台、语言、时区）",
  value: JSON.stringify({
    // deno-lint-ignore no-explicit-any
    platform: (globalThis.navigator as any)?.platform ?? "unknown",
    // deno-lint-ignore no-explicit-any
    language: (globalThis.navigator as any)?.language ?? "unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }),
  note: {
    key: "general",
    language: "default",
    title: "通用",
    description: "通用设置与内部缓存",
  },
};

try {
  await infoCall("info_get", { key: systemInfo.key });
  await infoCall("info_update", systemInfo);
  console.log("系统基础信息已更新");
} catch (error) {
  if ((error as InfoError).code !== 404100) throw error;
  await infoCall("info_post", systemInfo);
  console.log("系统基础信息已初始化");
}
