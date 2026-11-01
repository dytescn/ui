// src/apis/setting.ts
// 设置接口：只调用 info_lib，不再直接访问 database。

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

export interface SettingItem {
  key: string;
  value: string;
  title?: string;
  value_type?: string;
  category?: string;
  description?: string;
}

export const ensureSettingTable = async () => {
  // 由 info_lib 首次调用惰性建表
};

export const setSetting = async (key: string, value: string) => {
  try {
    await infoCall("info_get", { key });
    await infoCall("info_update", { key, value });
  } catch (error) {
    if ((error as InfoError).code !== 404100) throw error;
    await infoCall("info_post", { key, value });
  }
};

export const getSetting = async (key: string): Promise<string | null> => {
  try {
    const item = await infoCall<SettingItem>("info_get", { key });
    return item?.value ?? null;
  } catch (error) {
    if ((error as InfoError).code === 404100) return null;
    throw error;
  }
};

export const getAllSettings = async (): Promise<SettingItem[]> => {
  const result = await infoCall<{ list: SettingItem[] }>("info_list", {
    page: 1,
    page_size: 200,
  });
  return result.list ?? [];
};

export const setSettings = async (settings: Record<string, string>) => {
  for (const [key, value] of Object.entries(settings)) {
    await setSetting(key, value);
  }
};
