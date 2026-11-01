// src/apis/lib.ts
// material 能力库统一调用入口（/material_lib）

export const LIB_URL = "http://127.0.0.1:44944/material_lib";

export async function callLib<T = any>(symbol: string, body: unknown = {}): Promise<any> {
  const res = await fetch(LIB_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": symbol,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  if (data && data.code !== 200 && data.code !== 0) {
    throw new Error(`${symbol} failed (code=${data.code}): ${data.msg ?? "unknown"}`);
  }
  return data;
}

export async function listLib(symbol: string, body: unknown = {}): Promise<any[]> {
  const data = await callLib(symbol, body);
  return Array.isArray(data?.data?.list) ? data.data.list : [];
}

export async function pageLib(symbol: string, body: unknown = {}): Promise<{ list: any[]; total: number }> {
  const data = await callLib(symbol, body);
  return {
    list: Array.isArray(data?.data?.list) ? data.data.list : [],
    total: Number(data?.data?.total ?? 0),
  };
}

export async function getLib(symbol: string, body: unknown = {}): Promise<any | null> {
  try {
    const data = await callLib(symbol, body);
    return data?.data ?? null;
  } catch {
    return null;
  }
}

/** 把旧的 SQL where 片段转换为结构化 filter */
export function parseWhere(where: string): Record<string, unknown> {
  const filter: Record<string, unknown> = {};
  if (!where) return filter;

  const text = where.replace(/[()]/g, "");
  for (const part of text.split(/\s+AND\s+/i)) {
    const likeMatches = [...part.matchAll(/(\w+)\s+LIKE\s+'%([^']*)%'/gi)];
    if (likeMatches.length > 0) {
      filter["keyword"] = likeMatches[0][2];
      continue;
    }
    const eq = part.match(/(\w+)\s*=\s*'?([^']*)'?/i);
    if (!eq) continue;
    const value = eq[2].trim();
    filter[eq[1]] = value !== "" && !Number.isNaN(Number(value)) ? Number(value) : value;
  }
  return filter;
}

export function withId(id: number | null | undefined, data: Record<string, unknown>) {
  return { ...(id ? { id } : {}), ...data };
}
