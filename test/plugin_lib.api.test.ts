// test/plugin_lib.api.test.ts
// 验证 plugins_ui 的 API 层全部走 /plugin_lib，且符合 cyctron 的 <method>_<symbol> 约定。

import { getPlugins, installPlugin, uninstallPlugin } from "../src/apis/plugins.ts";
import { getCategories } from "../src/apis/plugin_categories.ts";

interface Call {
  url: string;
  method: string;
  symbol: string;
  body: unknown;
}

const calls: Call[] = [];
const originalFetch = globalThis.fetch;

const responses: Record<string, unknown> = {
  "POST_get_plugins": { list: [], total: 0, page: 1, page_size: 20 },
  "POST_get_categories": { list: [{ uuid: "cat-1", type_name: "分类" }] },
  "POST_install": { install_path: "D:/plugins/x", status: "installed" },
  "POST_uninstall": { uninstalled: true },
};

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

const mockFetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const headers = new Headers(init?.headers);
  const method = (init?.method ?? "GET").toUpperCase();
  const symbol = headers.get("FFI-Symbol") ?? "";
  calls.push({
    url: String(input),
    method,
    symbol,
    body: JSON.parse(String(init?.body ?? "{}")),
  });
  return jsonResponse({
    code: 200,
    data: responses[`${method}_${symbol}`] ?? {},
    msg: "success",
  });
}) as typeof fetch;

const assertEquals = (actual: unknown, expected: unknown, message?: string) => {
  const left = JSON.stringify(actual);
  const right = JSON.stringify(expected);
  if (left !== right) {
    throw new Error(`${message ?? "assertEquals"}: ${left} !== ${right}`);
  }
};

const assertRejects = async (fn: () => Promise<unknown>, pattern: RegExp) => {
  try {
    await fn();
  } catch (error) {
    if (pattern.test((error as Error).message)) return;
    throw error;
  }
  throw new Error("expected rejection");
};

Deno.test("getPlugins 使用 POST + get_plugins", async () => {
  globalThis.fetch = mockFetch;
  try {
    const result = await getPlugins({ category: "cat-1", page: 2, page_size: 10 });
    const last = calls.at(-1);
    assertEquals(last?.url, "http://127.0.0.1:44944/plugin_lib");
    assertEquals(last?.method, "POST");
    assertEquals(last?.symbol, "get_plugins");
    assertEquals(last?.body, { category: "cat-1", page: 2, page_size: 10 });
    assertEquals(result.total, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("getCategories 使用 POST + get_categories 并解包 list", async () => {
  globalThis.fetch = mockFetch;
  try {
    const list = await getCategories({ parent_uuid: "root" });
    assertEquals(calls.at(-1)?.method, "POST");
    assertEquals(calls.at(-1)?.symbol, "get_categories");
    assertEquals(calls.at(-1)?.body, { parent_uuid: "root" });
    assertEquals(list.length, 1);
    assertEquals(list[0].uuid, "cat-1");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("安装/卸载使用 POST + install/uninstall", async () => {
  globalThis.fetch = mockFetch;
  try {
    await installPlugin("plugin-1", "1.0.0");
    assertEquals(calls.at(-1)?.method, "POST");
    assertEquals(calls.at(-1)?.symbol, "install");
    assertEquals(calls.at(-1)?.body, { plugin_uuid: "plugin-1", version: "1.0.0" });

    await uninstallPlugin("plugin-1");
    assertEquals(calls.at(-1)?.method, "POST");
    assertEquals(calls.at(-1)?.symbol, "uninstall");
    assertEquals(calls.at(-1)?.body, { plugin_uuid: "plugin-1" });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("plugin_lib 返回非 200 code 时抛出错误", async () => {
  globalThis.fetch = (async () =>
    jsonResponse({ code: 500201, data: {}, msg: "db error" })) as typeof fetch;
  try {
    await assertRejects(() => getPlugins(), /db error/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
