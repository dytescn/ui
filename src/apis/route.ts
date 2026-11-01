// route.ts
// 路由读取：调用 info_lib.router_list，不再直接访问 database。
import type { Route } from "@funxdata/pages/routetype";

const INFO_URL = "http://127.0.0.1:44944/info_lib";

interface RouterRow {
  id: number;
  title?: string;
  icon?: string;
  hide?: number;
  path?: string;
  child?: string;
  url?: string;
  show?: number;
  parent_id?: number;
  level?: number;
}

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

async function queryRouters(
  filter: Record<string, unknown> = {},
): Promise<RouterRow[]> {
  const result = await infoCall<{ list: RouterRow[] }>("router_list", {
    page: 1,
    page_size: 500,
    ...filter,
  });
  return result.list ?? [];
}

export const get_router_info = async (): Promise<Route[]> => {
  const rows = await queryRouters();

  if (rows.length === 0) return [];

  const tree: any[] = [];
  const map = new Map<number, any>();

  for (const item of rows) {
    const isRoot = item.parent_id === 0 ||
      item.parent_id === null ||
      item.parent_id === undefined;
    if (isRoot) {
      const node = {
        title: item.title || "",
        icon: item.icon || "",
        hide: item.hide === 1,
        path: item.path || "",
        child: [] as any[],
      };
      map.set(item.id, node);
      tree.push(node);
    }
  }

  for (const item of rows) {
    const pid = item.parent_id;
    if (pid && pid !== 0) {
      const parent = map.get(Number(pid));
      if (parent) {
        parent.child.push({
          path: item.path || "",
          url: item.url || "",
          show: item.show === 1,
          title: item.title || "",
        });
      }
    }
  }

  return tree as Route[];
};

export const get_asides_info = async () => {
  const data = await get_router_info();
  // deno-lint-ignore no-explicit-any
  return data.filter((item: any) => !item.hide);
};

export const getAllRoutersFromDB = async (): Promise<RouterRow[]> => {
  return await queryRouters({ parent_id: 0 });
};

export const getRouterByPathFromDB = async (path: string) => {
  return await queryRouters({ path });
};

export const getChildrenByParentIdFromDB = async (parentId: number) => {
  const rows = await queryRouters({ parent_id: parentId });
  return rows.filter((row) => row.show === 1);
};
